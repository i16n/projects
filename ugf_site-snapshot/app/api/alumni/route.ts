import { NextResponse } from "next/server";
import { fetchAlumniMembers } from "@/lib/services/airtable";

export const revalidate = 86400; // 24 hours in seconds

export async function GET() {
  try {
    const alumni = await fetchAlumniMembers();
    return NextResponse.json(alumni, {
      headers: {
        "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=86400",
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch alumni" },
      { status: 500 }
    );
  }
}
