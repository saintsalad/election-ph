import { ElectionNext, CandidateNext } from "@/lib/definitions";
import { NextRequest, NextResponse } from "next/server";
import { db, getCurrentUser } from "@/lib/firebase/firebase-admin";

async function fetchDocumentsByIds<T>(
  collectionName: string,
  ids: string[]
): Promise<(T & { id: string })[]> {
  if (ids.length === 0) {
    return [];
  }

  // Create a reference to the collection
  const collectionRef = db.collection(collectionName);

  // Fetch documents in batches (Firestore has a limit of 10 items per 'in' query)
  const batchSize = 10;
  const batches = [];

  for (let i = 0; i < ids.length; i += batchSize) {
    const batch = ids.slice(i, i + batchSize);
    batches.push(collectionRef.where("__name__", "in", batch).get());
  }

  // Execute all batches
  const snapshots = await Promise.all(batches);

  // Combine and process results
  const documents = snapshots.flatMap((snapshot) =>
    snapshot.docs.map((doc) => {
      const item = doc.data() as T;
      return { ...item, id: doc.id };
    })
  );

  return documents;
}

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const electionId = params.id;

  // Get the current user
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json(
      { message: "Unauthorized access" },
      { status: 401 }
    );
  }

  // Fetch the election document by electionId
  const docRef = db.collection("elections").doc(electionId);
  const doc = await docRef.get();

  if (!doc.exists) {
    return NextResponse.json(
      { message: "Election not found" },
      { status: 404 }
    );
  }

  let election: any = {
    id: doc.id,
    ...doc.data(),
    isVoted: true, // Default value, will be updated below
  } as ElectionNext;

  // Check if the user has voted in this election
  const voteSnapshot = await db
    .collection("votes")
    .where("electionId", "==", electionId)
    .where("userId", "==", user.uid)
    .get();

  // Add isVoted flag to the election data
  election.isVoted = !voteSnapshot.empty;

  // Fetch all candidates based on candidate document IDs in the election data
  const candidateIds = election.candidates || []; // Array of candidate IDs

  // Fetch candidates using the optimized fetchDocumentsByIds function
  const candidatesData = await fetchDocumentsByIds<CandidateNext>(
    "candidates",
    candidateIds
  );

  // Sort candidates by ballot number
  const sortedCandidatesData = candidatesData.sort(
    (a, b) => a.ballotNumber - b.ballotNumber
  );

  // Attach sorted candidates data to the election
  election.candidates = sortedCandidatesData;

  // Create the response with the fetched election and candidate data
  // return NextResponse.json(election);
  const response = NextResponse.json(election);

  // Set cache age to 5 minutes and revalidate every 5 minutes
  response.headers.set(
    "Cache-Control",
    "public, max-age=360, s-maxage=360, stale-while-revalidate=360"
  );

  return response;
}
