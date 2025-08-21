import { NextResponse } from "next/server";
import { getAllMembersDealsMapping } from "@/lib/services/airtable";

export const revalidate = 86400; // 24 hours in seconds

export async function GET() {
  try {
    const membersDealsMapping = await getAllMembersDealsMapping();

    // Convert Map to Object for JSON serialization
    const membersDealsObject = Object.fromEntries(membersDealsMapping);

    return NextResponse.json(membersDealsObject, {
      headers: {
        "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=86400",
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong." },
      { status: 500 }
    );
  }
}
