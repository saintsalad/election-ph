import { NextRequest, NextResponse } from "next/server";
import { db, getCurrentUser } from "@/lib/firebase/firebase-admin";
import { ElectionNext, VoteResponse } from "@/lib/definitions";

// Fixed color map for gender categories
const genderColors: Record<string, string> = {
  male: "#3498db", // Blue
  female: "#e74c3c", // Red
  other: "#2ecc71", // Green
  // Add more gender categories and colors as needed
};

// Default color for unknown gender categories
const defaultColor = "#95a5a6"; // Gray

export async function GET(req: NextRequest) {
  try {
    // 🔐 Authenticate user
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { message: "Unauthorized access" },
        { status: 401 }
      );
    }

    // 🔍 Extract election ID from query params
    const electionId = new URL(req.url).searchParams.get("electionId");
    if (!electionId) {
      return NextResponse.json(
        { message: "Election ID is required" },
        { status: 400 }
      );
    }

    // Fetch election details
    const electionDoc = await db.collection("elections").doc(electionId).get();
    if (!electionDoc.exists) {
      return NextResponse.json(
        { message: "Election not found" },
        { status: 404 }
      );
    }

    const electionData = electionDoc.data() as ElectionNext;
    const { endDate, startDate } = electionData;

    // 📊 Fetch votes for the election
    const votesSnapshot = await db
      .collection("votes")
      .where("electionId", "==", electionId)
      .get();

    const genderCounts = new Map<string, number>([
      ["male", 0],
      ["female", 0],
      ["other", 0],
    ]);

    votesSnapshot.forEach((doc) => {
      const {
        userInfo: { gender },
      } = doc.data() as VoteResponse;
      const normalizedGender = gender.toLowerCase();
      const count = genderCounts.get(normalizedGender) || 0;
      genderCounts.set(normalizedGender, count + 1);
    });

    const voteResult = Array.from(genderCounts).map(([gender, votes]) => ({
      gender,
      votes,
      color: genderColors[gender] || defaultColor,
    }));

    // 🕒 Add caching headers
    return NextResponse.json(
      {
        voteResult,
        totalVotes: votesSnapshot.size,
        electionStart: startDate,
        electionEnd: endDate,
      },
      {
        status: 200,
        headers: {
          "Cache-Control":
            "public, max-age=360, s-maxage=360, stale-while-revalidate=360",
        },
      }
    );
  } catch (error) {
    console.error("Error calculating gender vote results:", error);
    return NextResponse.json(
      { message: "Failed to calculate gender vote results", error },
      { status: 500 }
    );
  }
}
