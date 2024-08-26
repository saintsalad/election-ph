import { NextRequest, NextResponse } from "next/server";
import { UserRating } from "@/lib/definitions";
import { db, isUserAuthenticated } from "@/lib/firebase/firebase-admin";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const candidateId = searchParams.get("candidateId");

  if (!candidateId) {
    return NextResponse.json(
      { message: "Candidate ID is missing" },
      { status: 400 }
    );
  }

  try {
    const isAllow = await isUserAuthenticated();
    if (!isAllow) {
      return NextResponse.json(
        { message: "Unauthorized access" },
        { status: 401 }
      );
    }

    const docSnapshot = await db
      .collection("candidates")
      .doc(candidateId)
      .get();

    if (!docSnapshot.exists) {
      console.log(`No document found for candidateId: ${candidateId}`);

      return NextResponse.json(
        {
          candidateId: candidateId,
          averageRating: 0,
          numberOfRatings: 0,
        },
        { status: 200 }
      );
    }

    const documentData = docSnapshot.data();
    const response = NextResponse.json(
      { ...documentData, id: candidateId },
      { status: 200 }
    );

    // Set cache headers to revalidate every 5 minutes
    response.headers.set(
      "Cache-Control",
      "public, max-age=300, s-maxage=300, stale-while-revalidate=300"
    );

    return response;
  } catch (error) {
    console.error("Error fetching document:", error);
    return NextResponse.json(
      { message: "Failed to fetch candidate", error: error },
      { status: 500 }
    );
  }
}
