import { NextResponse } from "next/server";

// Environment variables for Airtable webhook refresh
const AIRTABLE_API_KEY = process.env.AIRTABLE_WEBHOOK_PAT;
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;
const WEBHOOK_ID = process.env.AIRTABLE_WEBHOOK_ID;

async function refreshWebhook() {
  
}

export async function POST(request: Request) {
  try {
    // Verify that this is a legitimate cron request from Vercel
    const authHeader = request.headers.get("Authorization");
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      console.error("Unauthorized cron request");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if required environment variables are present
    if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID || !WEBHOOK_ID) {
      console.error(
        "Missing required environment variables for webhook refresh"
      );
      return NextResponse.json(
        { error: "Missing required environment variables" },
        { status: 500 }
      );
    }

    // Call Airtable webhook refresh API
    const refreshUrl = `https://api.airtable.com/v0/bases/${AIRTABLE_BASE_ID}/webhooks/${WEBHOOK_ID}/refresh`;

    console.log(`Refreshing Airtable webhook: ${refreshUrl}`);

    const response = await fetch(refreshUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${AIRTABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(
        `Webhook refresh failed: ${response.status} ${response.statusText}`,
        errorText
      );
      return NextResponse.json(
        {
          error: "Webhook refresh failed",
          status: response.status,
          details: errorText,
        },
        { status: 500 }
      );
    }

    const responseData = await response.json();
    console.log("Webhook refresh successful:", responseData);

    return NextResponse.json({
      success: true,
      message: "Webhook refreshed successfully",
      timestamp: new Date().toISOString(),
      data: responseData,
    });
  } catch (error) {
    console.error("Error refreshing webhook:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// Webhook refresh
export async function GET() {
  // Make an internal POST request to the same endpoint
  const response = await fetch(`https://ugf-website.vercel.app/api/webhook-refresh`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.CRON_SECRET}`,
      'Content-Type': 'application/json'
    }
  });
  
  return NextResponse.json(await response.json(), { status: response.status });
}
