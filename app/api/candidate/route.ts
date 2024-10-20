import { NextRequest, NextResponse } from "next/server";
import { db, isUserAuthenticated } from "@/lib/firebase/firebase-admin";
import { CandidateNext, ElectionNext } from "@/lib/definitions";

// Define a type for the election without candidates
type ElectionWithoutCandidates = Omit<ElectionNext, "candidates">;

// Update the CandidateNextResponse type
type CandidateNextResponse = Omit<CandidateNext, "election"> & {
  election: ElectionWithoutCandidates | null;
};

async function fetchElectionForCandidate(
  candidateId: string
): Promise<ElectionWithoutCandidates | null> {
  const electionsSnapshot = await db
    .collection("elections")
    .where("candidates", "array-contains", candidateId)
    .get();

  if (electionsSnapshot.empty) {
    return null;
  }

  const electionDoc = electionsSnapshot.docs[0];
  const election = electionDoc.data() as ElectionNext;
  // Omit the candidates field from the election data
  const { id, candidates, ...electionWithoutCandidates } = election;
  return { id: electionDoc.id, ...electionWithoutCandidates };
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const candidateId = searchParams.get("candidateId");

  try {
    const isAllow = await isUserAuthenticated();
    if (!isAllow) {
      return NextResponse.json(
        { message: "Unauthorized access" },
        { status: 401 }
      );
    }

    if (candidateId) {
      // Fetch single candidate
      const docSnapshot = await db
        .collection("candidates")
        .doc(candidateId)
        .get();

      if (!docSnapshot.exists) {
        console.log(`No document found for candidateId: ${candidateId}`);
        return NextResponse.json(
          {
            message: "Candidate not found",
          },
          { status: 404 }
        );
      }

      const documentData = docSnapshot.data() as Omit<
        CandidateNextResponse,
        "id" | "election"
      >;
      const election = await fetchElectionForCandidate(candidateId);

      const candidateResponse: CandidateNextResponse = {
        ...documentData,
        id: candidateId,
        election,
      };

      return NextResponse.json(candidateResponse, { status: 200 });
    } else {
      // Fetch all candidates
      const querySnapshot = await db.collection("candidates").get();
      const candidatesPromises = querySnapshot.docs.map(async (doc) => {
        const candidateData = doc.data() as Omit<
          CandidateNextResponse,
          "id" | "election"
        >;
        const election = await fetchElectionForCandidate(doc.id);
        return {
          id: doc.id,
          ...candidateData,
          election,
        } as CandidateNextResponse;
      });

      const candidates = await Promise.all(candidatesPromises);

      const response = NextResponse.json({ candidates }, { status: 200 });

      // Set cache headers to revalidate every 5 minutes
      response.headers.set(
        "Cache-Control",
        "public, max-age=300, s-maxage=300, stale-while-revalidate=300"
      );

      return response;
    }
  } catch (error) {
    console.error("Error fetching candidate(s):", error);
    return NextResponse.json(
      { message: "Failed to fetch candidate(s)", error: error },
      { status: 500 }
    );
  }
}
