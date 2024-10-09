import { Election } from "@/lib/definitions";
import { db, getCurrentUser } from "@/lib/firebase/firebase-admin";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { electionId, referenceId, value } = await req.json();
  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type"); // single or multiple

  // Get the current user
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json(
      { message: "Unauthorized access", code: "UNAUTHORIZED" },
      { status: 401 }
    );
  }

  // Check if the user has voted in this election
  const voteSnapshot = await db
    .collection("votes")
    .where("electionId", "==", electionId)
    .where("userId", "==", user.uid)
    .get();

  const isVoted = !voteSnapshot.empty;

  if (isVoted) {
    return NextResponse.json(
      { message: "User has already voted", code: "USER_ALREADY_VOTED" },
      { status: 400 }
    );
  }

  //check if candidate exists in election
  const electionSnapshot = await db
    .collection("elections")
    .doc(electionId)
    .get();

  // check if candidate exists in candidates array
  const { candidates } = electionSnapshot.data() as Election;
  const candidatesExist = Array.isArray(value)
    ? value.every((candidateId) => candidates.includes(candidateId))
    : candidates.includes(value);

  if (!candidatesExist) {
    return NextResponse.json(
      { message: "Candidate not found", code: "CANDIDATE_NOT_FOUND" },
      { status: 404 }
    );
  }

  try {
    const dateCreated = new Date();

    // Fetch user details from the users collection
    const userDoc = await db.collection("users").doc(user.uid).get();
    const userData = userDoc.data();

    if (!userData) {
      return NextResponse.json(
        { message: "User data not found", code: "USER_DATA_NOT_FOUND" },
        { status: 404 }
      );
    }

    // Extract required user information
    const { age, city, education, gender } = userData;

    // Insert the vote to the database with user information
    await db.collection("votes").add({
      electionId,
      userId: user.uid,
      referenceId,
      value,
      dateCreated,
      userInfo: {
        age,
        city,
        education,
        gender,
      },
    });

    return NextResponse.json({ message: "Vote submitted" });
  } catch (error) {
    console.error("Error submitting vote", error);
    return NextResponse.json(
      { message: "Error submitting vote", code: "ERROR_SUBMITTING_VOTE" },
      { status: 500 }
    );
  }
}
