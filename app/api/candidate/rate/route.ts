import { NextRequest, NextResponse } from "next/server";
import { UserRating } from "@/lib/definitions";
import {
  db,
  getCurrentUser,
  isUserAuthenticated,
} from "@/lib/firebase/firebase-admin";

export async function GET(req: NextRequest) {
  // Extract the candidateId and userId from the query string
  const { searchParams } = new URL(req.url);
  const candidateId = searchParams.get("candidateId");
  const user = await getCurrentUser();
  const userId = user?.uid;

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

    // Otherwise, fetch all ratings for the candidate
    // TODO: use aggragate to get average
    const querySnapshot = await db
      .collection("candidateRate")
      .where("candidateId", "==", candidateId)
      .get();

    if (querySnapshot.empty) {
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

    // Calculate the total and average rating for all users
    let totalRating = 0;
    querySnapshot.forEach((doc) => {
      const data = doc.data() as UserRating;
      totalRating += data.rate;
    });

    const averageRating = totalRating / querySnapshot.size;

    const resultObj = {
      candidateId: candidateId,
      averageRating: averageRating,
      numberOfRatings: querySnapshot.size,
    };

    // Return the total and average rating or specific user's rating
    const response = NextResponse.json(resultObj, { status: 200 });

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
