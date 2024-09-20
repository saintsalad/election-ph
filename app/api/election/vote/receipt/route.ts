import { db, getCurrentUser } from "@/lib/firebase/firebase-admin";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { electionId } = await req.json();

  if (!electionId) {
    return NextResponse.json(
      { message: "Election ID is required", code: "ELECTION_ID_REQUIRED" },
      { status: 400 }
    );
  }

  // Get the current user
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json(
      { message: "Unauthorized access", code: "UNAUTHORIZED" },
      { status: 401 }
    );
  }

  try {
    // Check if the user has voted in this election
    const voteSnapshot = await db
      .collection("votes")
      .where("electionId", "==", electionId)
      .where("userId", "==", user.uid)
      .get();

    if (voteSnapshot.empty) {
      return NextResponse.json(
        { message: "User has not voted", code: "USER_NOT_VOTED" },
        { status: 400 }
      );
    }

    const vote = voteSnapshot.docs.map((doc) => doc.data());

    return NextResponse.json({ message: "Vote receipt retrieved" });
  } catch (error) {
    console.error("Error getting vote receipt", error);
    return NextResponse.json(
      {
        message: "Error getting vote receipt",
        code: "ERROR_GETTING_VOTE_RECEIPT",
      },
      { status: 500 }
    );
  }
}
