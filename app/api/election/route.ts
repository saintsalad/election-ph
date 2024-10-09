import { NextRequest, NextResponse } from "next/server";
import { db, getCurrentUser } from "@/lib/firebase/firebase-admin";
import { ElectionWithVoteStatus } from "@/lib/definitions";

export async function GET(req: NextRequest) {
  //   const { searchParams } = new URL(req.url);

  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { message: "Unauthorized access" },
        { status: 401 }
      );
    }

    let electionsData: any[];

    // Fetch all elections if no electionId is provided
    const snapshot = await db.collection("elections").get();
    electionsData = await Promise.all(
      snapshot.docs.map(async (doc) => {
        let election: ElectionWithVoteStatus = {
          id: doc.id,
          ...doc.data(),
          isVoted: false, // Default value, will be updated below
        } as ElectionWithVoteStatus;

        // Check if the user has voted in each election
        const voteSnapshot = await db
          .collection("votes")
          .where("electionId", "==", doc.id)
          .where("userId", "==", user?.uid)
          .get();

        // Add isVoted flag to the election data
        election.isVoted = !voteSnapshot.empty;

        return election;
      })
    );

    // Create the response with the fetched data
    const response = NextResponse.json(electionsData);

    // Set cache age is 1 week and revalidate once a day
    response.headers.set(
      "Cache-Control",
      "public, max-age=120, s-maxage=120, stale-while-revalidate=120"
    );

    return response;
  } catch (error) {
    console.error("Error fetching elections:", error);
    return NextResponse.json(
      { message: "Failed to fetch elections", error: error },
      { status: 500 }
    );
  }
}
