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
    };
  };
}

const CURSOR_KEY = "airtable_portco_webhook_cursor";

// Portco titles that trigger photo processing
const PORTCO_TITLES = ["Portfolio - Fund I", "Portfolio - Fund II", "Exited"];

// Hardcoded field IDs for the deals table
const DEAL_FIELDS = {
  PLAQUE: "fldjAiMzEdn2JFGTu",
  STATUS: "fldmQllRbyaAY6BBZ",
};

// Webhook secret for signature verification (if configured)
const WEBHOOK_SECRET = process.env.AIRTABLE_PORTCO_WEBHOOK_SECRET;

// Airtable API configuration
const AIRTABLE_API_KEY = process.env.AIRTABLE_WEBHOOK_PAT;
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;
const WEBHOOK_ID = process.env.AIRTABLE_PORTCO_WEBHOOK_ID;
const DEALS_TABLE_ID = process.env.AIRTABLE_DEALS_TABLE_ID!;

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
      await processPortcoRecord(payload);
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
        
        // Revalidate the portfolio page to reflect changes
        revalidatePath('/portfolio');
        console.log('Revalidated /portfolio page after portfolio company changes');
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

async function processPortcoRecord(payload: AirtableWebhookPayload) {
  try {
    const tableChanges = payload.changedTablesById[DEALS_TABLE_ID];
    if (!tableChanges) {
      console.log("No changes for the deals table in this payload.");
      return;
    }

    // We handle the following cases below:
    // a portfolio company record is initialized from within the portfolio (via airtable GUI -- edge case)
    // a portfolio company existing record moves into the portfolio
    // the plaque field is changed for a company IN the portfolio

    // Handle changed records
    if (tableChanges.changedRecordsById) {
      for (const recordId in tableChanges.changedRecordsById) {
        const record = tableChanges.changedRecordsById[recordId];
        const currentStatus =
          record.current?.cellValuesByFieldId[DEAL_FIELDS.STATUS]?.name;
        const previousStatus =
          record.previous?.cellValuesByFieldId[DEAL_FIELDS.STATUS]?.name;

        const isCurrentlyInPortfolio =
          currentStatus && PORTCO_TITLES.includes(currentStatus);
        const wasPreviouslyInPortfolio =
          previousStatus && PORTCO_TITLES.includes(previousStatus);

        console.log(
          `Processing changed record ${recordId}. Was in portfolio: ${wasPreviouslyInPortfolio}, Now in portfolio: ${isCurrentlyInPortfolio}`
        );

        if (!wasPreviouslyInPortfolio && isCurrentlyInPortfolio) {
          // Became active: upload plaque
          const plaqueUrl = await getPortcoPlaqueUrl(recordId);
          if (plaqueUrl) {
            console.log(
              `Portco ${recordId} entered portfolio, uploading plaque.`
            );
            await processPortcoPlaque(recordId, plaqueUrl);
          }
        } else if (isCurrentlyInPortfolio) {
          // Stayed in portfolio, but plaque may have changed --
          // we falsely update if a portco moves from active to active but that's fine.
          console.log(
            `this portco ${recordId} stayed active, but plaque _may_ have changed`
          );

          // these are temp URLs so we will just delete and reupload.
          const currentPlaqueUrl = await getPortcoPlaqueUrl(recordId);

          // no need to delete the old photo, we will just overwrite it.
          if (currentPlaqueUrl) {
            console.log("overwriting plaque for portco", recordId);
            await processPortcoPlaque(recordId, currentPlaqueUrl);
          }
        }
        // kind of a catch-all, this is OK because we have overwrite enabled. This will almost never happen.
        else if (
          isCurrentlyInPortfolio ||
          isCurrentlyInPortfolio == undefined
        ) {
          const plaqueUrl = await getPortcoPlaqueUrl(recordId);
          if (plaqueUrl) {
            console.log(
              `Portco ${recordId} was new but has a plaque, uploading plaque. (for some reason active markers both were undefined)`
            );
            await processPortcoPlaque(recordId, plaqueUrl);
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

async function processPortcoPlaque(recordId: string, airtableImageUrl: string) {
  try {
    console.log(`Processing plaque for record ${recordId}`);

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
    const filename = `${recordId}.jpeg`;
    console.log("renamed to filename: ", filename);

    // Upload to Vercel Blob storage in the portfolio folder
    const blob = await put(`portfolio/${filename}`, jpegBuffer, {
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

async function getPortcoPlaqueUrl(recordId: string): Promise<string | null> {
  try {
    const url = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${DEALS_TABLE_ID}/${recordId}`;
    console.log(`Fetching plaque URL for record: ${recordId}`);

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
    const plaqueField = record.fields.plaque[0].url;
    console.log("airtable's temp plaque url: ", plaqueField);
    return plaqueField;
  } catch (error) {
    console.error(`Error fetching plaque URL for record ${recordId}:`, error);
    return null;
  }
}

// Health check endpoint
export async function GET() {
  return NextResponse.json({
    message: "Airtable portco webhook endpoint is active, hi there!",
    timestamp: new Date().toISOString(),
  });
}
