import { NextResponse } from "next/server";
import { put, del } from "@vercel/blob";
import { withRedis } from "@/lib/redis";
import { revalidatePath } from "next/cache";
import sharp from "sharp";

// Interface for Airtable initial notification payload
interface AirtableNotificationPayload {
  base: {
    id: string;
  };
  webhook: {
    id: string;
  };
  timestamp: string;
}

interface AirtablePayloadsWrapper {
  payloads: AirtableWebhookPayload[];
  cursor?: number;
  mightHaveMore?: boolean;
}

// Interface for Airtable webhook payload
interface AirtableWebhookPayload {
  timestamp: string;
  baseTransactionNumber: number;
  changedTablesById: {
    [tableId: string]: {
      changedRecordsById?: {
        [recordId: string]: {
          current?: {
            cellValuesByFieldId: {
              [fieldId: string]: {
                name: string;
              };
            };
          };
          previous?: {
            cellValuesByFieldId: {
              [fieldId: string]: {
                name: string;
              };
            };
          };
        };
      };
      createdRecordsById?: {
        [recordId: string]: {
          cellValuesByFieldId: {
            [fieldId: string]: any;
          };
        };
      };
      destroyedRecordIds?: string[];
    };
  };
}

const CURSOR_KEY = "airtable_webhook_cursor";

// Active member titles that trigger photo processing
const ACTIVE_MEMBER_TITLES = [
  "Spring Interns",
  "Summer Interns",
  "Fall Interns",
  "Associates",
  "Sr Associates",
  "Analyst",
  "Management",
];

// Hardcoded field IDs for the team table
const TEAM_FIELDS = {
  PHOTO: "fld2vDiPHVvTVqQdl",
  TITLE: "flduwcgRbZZiCZFpp",
};

// Webhook secret for signature verification (if configured)
const WEBHOOK_SECRET = process.env.AIRTABLE_WEBHOOK_SECRET;

// Airtable API configuration
const AIRTABLE_API_KEY = process.env.AIRTABLE_WEBHOOK_PAT;
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;
const WEBHOOK_ID = process.env.AIRTABLE_WEBHOOK_ID;
const TEAM_TABLE_ID = process.env.AIRTABLE_TEAM_TABLE_ID!;

// Function to list all webhooks for the base
async function listWebhookPayloads(baseId: string): Promise<any> {
  try {
    // Get the saved cursor from Redis
    let currentCursor = await withRedis(
      async (client) => await client.get(CURSOR_KEY)
    );

    let allPayloads: AirtableWebhookPayload[] = [];
    let lastResponse: AirtablePayloadsWrapper;

    // Keep fetching until we have all payloads
    do {
      // Build URL with cursor parameter if we have one
      let url = `https://api.airtable.com/v0/bases/${baseId}/webhooks/${WEBHOOK_ID}/payloads`;
      if (currentCursor) {
        url += `?cursor=${currentCursor}`;
      }
      console.log(`Calling List Webhook Payloads API: ${url}`);

      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${AIRTABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(
          `List webhooks failed: ${response.status} ${response.statusText}`,
          errorText
        );
        throw new Error(
          `List webhooks API request failed: ${response.status} - ${errorText}`
        );
      }

      lastResponse = await response.json();
      allPayloads.push(...lastResponse.payloads);

      // Update cursor for next iteration
      currentCursor = lastResponse.cursor?.toString() || null;

      console.log(
        `Fetched ${lastResponse.payloads.length} payloads. mightHaveMore: ${lastResponse.mightHaveMore}`
      );
    } while (lastResponse.mightHaveMore);

    console.log(`Total payloads fetched: ${allPayloads.length}`);

    // Process all payloads
    for (const payload of allPayloads) {
      console.log(
        `Processing payload with baseTransactionNumber: ${payload.baseTransactionNumber}`
      );
      await processTeamMemberRecord(payload);
    }

    // Save the final cursor for the next webhook trigger
    if (lastResponse.cursor !== undefined) {
      await withRedis(
        async (client) =>
          await client.set(CURSOR_KEY, lastResponse.cursor!.toString())
      );
      console.log(`Saved cursor for next API call: ${lastResponse.cursor}`);
    }

    return { payloads: allPayloads, cursor: lastResponse.cursor };
  } catch (error) {
    console.error("Error listing webhooks:", error);
    throw error;
  }
}

export async function POST(request: Request) {
  try {
    const payload: AirtableNotificationPayload = await request.json();

    // Verify webhook signature if secret is configured
    if (WEBHOOK_SECRET) {
      const macSecretDecoded = Buffer.from(WEBHOOK_SECRET, "base64");
      const body = Buffer.from(JSON.stringify(payload), "utf8");
      const hmac = require("crypto").createHmac("sha256", macSecretDecoded);
      hmac.update(body.toString(), "ascii");
    }

    try {
      if (AIRTABLE_BASE_ID) {
        await listWebhookPayloads(AIRTABLE_BASE_ID);

        // Revalidate the team page to reflect changes
        revalidatePath("/team");
        console.log("Revalidated /team page after team member changes");
      } else {
        console.warn(
          "AIRTABLE_BASE_ID not configured, skipping webhook listing"
        );
      }
    } catch (webhookError) {
      // Log webhook listing errors but don't fail the main webhook response
      console.error(
        "Failed to list webhooks after initial notification:",
        webhookError
      );
    }

    return NextResponse.json({ status: 200 }); // we handled the message, now send 200 OK response promptly.
  } catch (error) {
    console.error("Webhook processing error:", error);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }
}

async function processTeamMemberRecord(payload: AirtableWebhookPayload) {
  try {
    const tableChanges = payload.changedTablesById[TEAM_TABLE_ID];
    if (!tableChanges) {
      console.log("No changes for the team table in this payload.");
      return;
    }

    // We handle the following cases below:
    // creation of new member -- we will attempt to upload a photo if it exists
    // moving from active to inactive
    // moving from inactive to active
    // photo being updated -- we will just overwrite the old photo.
    // moving from active to active -- we will just overwrite the old photo; even though it really didn't change in this case.
    // record is deleted -- this is actually handled by our recordChanged logic and is automatically deleted from blob storage.
    // record created via GUI initially completely empty --
    // this is because it's considered that the student "became inactive" in our logic

    // Handle destroyed records
    if (tableChanges.destroyedRecordIds) {
      for (const recordId of tableChanges.destroyedRecordIds) {
        console.log(`Deleting photo for destroyed record ${recordId}`);
        await deleteMemberPhoto(recordId);
      }
    }

    // Handle changed records
    if (tableChanges.changedRecordsById) {
      for (const recordId in tableChanges.changedRecordsById) {
        const record = tableChanges.changedRecordsById[recordId];
        const currentTitle =
          record.current?.cellValuesByFieldId[TEAM_FIELDS.TITLE]?.name;
        const previousTitle =
          record.previous?.cellValuesByFieldId[TEAM_FIELDS.TITLE]?.name;

        const isCurrentlyActive =
          currentTitle && ACTIVE_MEMBER_TITLES.includes(currentTitle);
        const wasPreviouslyActive =
          previousTitle && ACTIVE_MEMBER_TITLES.includes(previousTitle);

        console.log(
          `Processing changed record ${recordId}. Was active: ${wasPreviouslyActive}, Now active: ${isCurrentlyActive}`
        );

        if (!wasPreviouslyActive && isCurrentlyActive) {
          // Became active: upload photo
          const photoUrl = await getMemberPhotoUrl(recordId);
          if (photoUrl) {
            console.log(`Member ${recordId} became active, uploading photo.`);
            await processMemberPhoto(recordId, photoUrl);
          }
        } else if (wasPreviouslyActive && !isCurrentlyActive) {
          // Became inactive: delete photo
          console.log(
            `Member ${recordId} became inactive, deleting photo from blob storage.`
          );
          await deleteMemberPhoto(recordId);
        } else if (isCurrentlyActive) {
          // Stayed active, but photo _may_ have changed --
          // we falsely update if a student moves from active to active but that's fine.
          console.log(
            `this member ${recordId} stayed active, but photo _may_ have changed`
          );

          // these are temp URLs so we will just delete and reupload.
          const currentPhotoUrl = await getMemberPhotoUrl(recordId);

          // no need to delete the old photo, we will just overwrite it.
          if (currentPhotoUrl) {
            console.log("overwriting photo for member", recordId);
            await processMemberPhoto(recordId, currentPhotoUrl);
          }
        }
        // kind of a catch-all, this is OK because we have overwrite enabled.
        else if (isCurrentlyActive || isCurrentlyActive == undefined) {
          // the trigger happens once on creation via airtable GUI and again on photo field change, so we will attempt to add a photo, simply
          // by checking if adding a photo works...
          // this method for adding members is probably not really ever used, instead it's usually via the onboarding form where all fields are required.
          const photoUrl = await getMemberPhotoUrl(recordId);
          if (photoUrl) {
            console.log(
              `Member ${recordId} was new but has a photo, uploading photo. (for some reason active markers both were undefined)`
            );
            await processMemberPhoto(recordId, photoUrl);
          }
        } else {
          console.error(
            "something went wrong, nothing has been changed in blob"
          );
        }
      }
    }
  } catch (error) {
    console.log(`Error processing webhook payload:`, error);
  }
}

async function processMemberPhoto(recordId: string, airtableImageUrl: string) {
  try {
    console.log(`Processing photo for record ${recordId}`);

    // Download the image from Airtable with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

    const response = await fetch(airtableImageUrl, {
      signal: controller.signal,
      headers: {
        "User-Agent": "UGF-Webhook/1.0",
      },
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(
        `Failed to download image: ${response.status} ${response.statusText}`
      );
    }

    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.startsWith("image/")) {
      throw new Error(`Invalid content type: ${contentType}`);
    }

    const imageBuffer = await response.arrayBuffer();

    // Convert to JPEG using Sharp with error handling
    const jpegBuffer = await sharp(Buffer.from(imageBuffer))
      .jpeg({
        quality: 100,
        progressive: true,
      })
      .toBuffer();

    // Generate filename: remove 'rec' prefix from record ID for consistency
    const filename = `${recordId.replace("rec", "")}.jpeg`;
    console.log("renamed to filename: ", filename);

    // Upload to Vercel Blob storage in the team folder
    const blob = await put(`team/${filename}`, jpegBuffer, {
      access: "public",
      contentType: "image/jpeg",
      allowOverwrite: true, // in the case of a photo update, we still use the same rec file prefix, so we need to allow overwriting.
    });

    console.log(
      `Successfully uploaded photo for ${recordId} to blob storage: ${blob.url}`
    );

    return blob.url;
  } catch (error) {
    console.error(`Error processing photo for record ${recordId}:`, error);
    throw error;
  }
}

async function deleteMemberPhoto(recordId: string) {
  try {
    // Generate filename: remove 'rec' prefix from record ID for consistency
    const filename = `${recordId.replace("rec", "")}.jpeg`;
    const blobPath = `team/${filename}`;

    console.log(
      `Deleting photo for record ${recordId} from blob storage: ${blobPath}`
    );

    // Delete from Vercel Blob storage
    await del(blobPath);

    console.log(`Successfully deleted photo for ${recordId} from blob storage`);
  } catch (error) {
    console.error(`Error deleting photo for record ${recordId}:`, error);
    // Don't throw error here - deletion failures shouldn't break the webhook
  }
}

async function getMemberPhotoUrl(recordId: string): Promise<string | null> {
  try {
    const url = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${TEAM_TABLE_ID}/${recordId}`;
    console.log(`Fetching photo URL for record: ${recordId}`);

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${AIRTABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(
        `Failed to fetch record ${recordId}: ${response.status} ${response.statusText}`,
        errorText
      );
      return null;
    }

    const record = await response.json();
    const photoField = record.fields.Photo[0].url; // this can be null if no photo uploaded yet. It's a silent error; nothing gets deposited into blob.
    console.log("airtable's temp photo url: ", photoField);
    return photoField;
  } catch (error) {
    console.error(`Error fetching photo URL for record ${recordId}:`, error);
    return null;
  }
}

// Health check endpoint
export async function GET() {
  return NextResponse.json({
    message: "Airtable webhook endpoint is active, hi there!",
    timestamp: new Date().toISOString(),
  });
}
