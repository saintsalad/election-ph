import { NextRequest, NextResponse } from "next/server";
import { db, getCurrentUser } from "@/lib/firebase/firebase-admin";

import { getElectionData } from "@/lib/firebase/firebase-admin";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const electionId = params.id;

  // Get the current user
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json(
      { message: "Unauthorized access" },
      { status: 401 }
    );
  }

  try {
    const electionData = await getElectionData(electionId, user.uid);
    const response = NextResponse.json(electionData);

    // Set cache age to 5 minutes and revalidate every 5 minutes
    response.headers.set(
      "Cache-Control",
      "public, max-age=360, s-maxage=360, stale-while-revalidate=360"
    );

    return response;
  } catch (error) {
    if (error instanceof Error && error.message === "Election not found") {
      return NextResponse.json(
        { message: "Election not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
