import { NextRequest, NextResponse } from "next/server";
import { UserRating } from "@/lib/definitions";
import {
  db,
  getCurrentUser,
  isUserAuthenticated,
} from "@/lib/firebase/firebase-admin";
import { differenceInDays } from "date-fns";

export async function GET(req: NextRequest) {
  // Extract the candidateId and userId from the query string
  const { searchParams } = new URL(req.url);
  const candidateId = searchParams.get("candidateId");
  const user = await getCurrentUser();
  const userId = user?.uid;

  if (!candidateId || candidateId == "undefined") {
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
      averageRating: Number(averageRating.toFixed(1)),
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

export async function POST(req: NextRequest) {
  try {
    const isAllowed = await isUserAuthenticated();
    if (!isAllowed) {
      return NextResponse.json(
        { message: "Unauthorized access" },
        { status: 401 }
      );
    }

    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 401 });
    }

    const body = await req.json();
    const { rate, candidateId } = body;

    if (!rate || !candidateId) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    const ratingData: UserRating = {
      rate,
      candidateId,
      userId: user.uid,
      dateCreated: new Date().toISOString(),
    };

    // Check if a rating already exists for this user and candidate
    const existingRatingQuery = await db
      .collection("candidateRate")
      .where("userId", "==", user.uid)
      .where("candidateId", "==", candidateId)
      .limit(1)
      .get();

    let result;
    if (existingRatingQuery.empty) {
      // If no existing rating, add a new one
      result = await db.collection("candidateRate").add(ratingData);
    } else {
      // If rating exists, check if 3 days have passed
      const existingRatingDoc = existingRatingQuery.docs[0];
      const existingRating = existingRatingDoc.data() as UserRating;
      const daysSinceLastRating = differenceInDays(
        new Date(),
        new Date(existingRating.dateCreated)
      );

      if (daysSinceLastRating < 3) {
        return NextResponse.json(
          {
            message: "You can only update your rating after 3 days",
            daysLeft: 3 - daysSinceLastRating,
          },
          { status: 403 }
        );
      }

      // If 3 days have passed, update the rating
      result = await existingRatingDoc.ref.update(ratingData);
    }

    if (result) {
      return NextResponse.json(
        { message: "Rating saved successfully", success: true },
        { status: 200 }
      );
    } else {
      throw new Error("Failed to save rating");
    }
  } catch (error) {
    console.error("Error saving rating:", error);
    return NextResponse.json(
      { message: "Failed to save rating", error: error },
      { status: 500 }
    );
  }
}
