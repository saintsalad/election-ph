import { NextRequest, NextResponse } from "next/server";
import { db, getCurrentUser } from "@/lib/firebase/firebase-admin";
import { VoteResponse, ElectionNext } from "@/lib/definitions";
import { getElectionData } from "@/lib/firebase/firebase-admin";
import { decrypt } from "@/lib/tweetnacl-encrypt";

function generateRandomColor(): string {
  return (
    "#" +
    Math.floor(Math.random() * 16777215)
      .toString(16)
      .padStart(6, "0")
  );
}

export async function GET(req: NextRequest) {
  try {
    // 🔐 Authenticate user
    console.log("🔐 Authenticating user...");
    const user = await getCurrentUser();

    if (!user) {
      console.log("❌ Unauthorized access");
      return NextResponse.json(
        { message: "Unauthorized access" },
        { status: 401 }
      );
    }

    // 🔍 Extract election ID from query params
    console.log("🔍 Extracting election ID...");
    const { searchParams } = new URL(req.url);
    const electionId = searchParams.get("electionId");

    if (!electionId) {
      console.log("❌ Missing election ID");
      return NextResponse.json(
        { message: "Election ID is required" },
        { status: 400 }
      );
    }

    // 📡 Fetch election data using the getElectionData function
    console.log("📡 Fetching election data...");
    const election: ElectionNext = await getElectionData(electionId, user.uid);
    console.log("✅ Election data fetched successfully");

    // 📊 Fetch votes for the election
    console.log("📊 Fetching votes...");
    const votesSnapshot = await db
      .collection("votes")
      .where("electionId", "==", electionId)
      .get();

    const votes: VoteResponse[] = votesSnapshot.docs.map((doc) => ({
      ...doc.data(),
      value: doc
        .data()
        .value.map((candidateId: string) => decrypt(candidateId)),
    })) as VoteResponse[];
    console.log(`✅ Fetched ${votes.length} votes`);

    // 🧮 Initialize vote counts and calculate total votes
    console.log("🧮 Initializing vote counts...");
    const voteCounts = new Map<string, number>();
    election.candidates.forEach((candidate) => voteCounts.set(candidate.id, 0));
    const totalVotes = votes.length;

    // 🔢 Count votes for each candidate
    console.log("🔢 Counting votes...");
    votes.forEach((vote) => {
      vote.value.forEach((candidateId) => {
        if (voteCounts.has(candidateId)) {
          voteCounts.set(candidateId, voteCounts.get(candidateId)! + 1);
        }
      });
    });

    // 📊 Calculate vote results
    console.log("📊 Calculating vote results...");
    const voteResults = election.candidates.map((candidate) => ({
      candidate: candidate.displayName,
      party: candidate.party,
      votes: voteCounts.get(candidate.id) || 0,
      color: generateRandomColor(), // 🎨 Generate random color
    }));

    console.log("✅ Vote results calculated successfully");

    // 🕒 Add caching headers
    const response = NextResponse.json(
      {
        voteResults,
        totalVotes,
        electionStart: election.startDate,
        electionEnd: election.endDate,
      },
      { status: 200 }
    );
    response.headers.set(
      "Cache-Control",
      "public, max-age=360, s-maxage=360, stale-while-revalidate=360"
    );

    return response;
  } catch (error) {
    console.error("❌ Error calculating vote results:", error);
    return NextResponse.json(
      { message: "Failed to calculate vote results", error: error },
      { status: 500 }
    );
  }
}
