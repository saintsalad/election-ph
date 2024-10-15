import { NextRequest, NextResponse } from "next/server";
import { db, getCurrentUser } from "@/lib/firebase/firebase-admin";
import { ElectionNext, VoteResponse, EducationData } from "@/lib/definitions";

// Fixed color map for education levels
const educationColors: Record<string, string> = {
  elementary: "#3498db",
  highschool: "#e74c3c",
  vocational: "#2ecc71",
  college: "#f39c12",
  postgraduate: "#9b59b6",
};

// Default color for unknown education levels
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

    // Initialize educationCounts with all education levels
    const educationCounts = new Map<string, number>(
      Object.keys(educationColors).map((level) => [level, 0])
    );

    votesSnapshot.forEach((doc) => {
      const {
        userInfo: { education },
      } = doc.data() as VoteResponse;
      const normalizedEducation = education.toLowerCase();
      if (educationCounts.has(normalizedEducation)) {
        const count = educationCounts.get(normalizedEducation)!;
        educationCounts.set(normalizedEducation, count + 1);
      }
    });

    const voteResult: EducationData[] = Array.from(educationCounts).map(
      ([level, voters]) => ({
        level,
        voters,
        color: educationColors[level] || defaultColor,
      })
    );

    const totalVoters = votesSnapshot.size;

    // 🕒 Add caching headers
    return NextResponse.json(
      {
        voteResult,
        totalVoters,
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
    console.error("Error calculating education vote results:", error);
    return NextResponse.json(
      { message: "Failed to calculate education vote results", error },
      { status: 500 }
    );
  }
}
