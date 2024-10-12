import "server-only";
import { cookies } from "next/headers";
import { initializeApp, getApps, cert } from "firebase-admin/app";
import { SessionCookieOptions, getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";
import { getStorage } from "firebase-admin/storage";

import { ElectionNext, CandidateNext } from "@/lib/definitions";

if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId: process.env.NEXT_PUBLIC_PROJECT_ID,
      clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY
        ? process.env.FIREBASE_ADMIN_PRIVATE_KEY.replace(/\\n/g, "\n")
        : undefined,
    }),
    storageBucket: process.env.NEXT_PUBLIC_STORAGE_BUCKET,
  });
}

export const auth = getAuth();

export const db = getFirestore();
export const storage = getStorage().bucket();

export async function isUserAuthenticated(
  session: string | undefined = undefined
) {
  const _session = session ?? (await getSession());
  if (!_session) return false;

  try {
    const isRevoked = !(await auth.verifySessionCookie(_session, true));
    return !isRevoked;
  } catch (error) {
    console.log("FIREBASE ADMIN ❌❌❌");
    return false;
  }
}

export async function getCurrentUser() {
  const session = await getSession();

  if (!(await isUserAuthenticated(session))) {
    return null;
  }

  const decodedIdToken = await auth.verifySessionCookie(session!);
  const currentUser = await auth.getUser(decodedIdToken.uid);

  return currentUser;
}

async function getSession() {
  try {
    return cookies().get("__session")?.value;
  } catch (error) {
    return undefined;
  }
}

export async function createSessionCookie(
  idToken: string,
  sessionCookieOptions: SessionCookieOptions
) {
  return auth.createSessionCookie(idToken, sessionCookieOptions);
}

export async function revokeAllSessions(session: string) {
  const decodedIdToken = await auth.verifySessionCookie(session);

  return await auth.revokeRefreshTokens(decodedIdToken.sub);
}

export function getRelativePath(fullUrl: string): string {
  const regex =
    /https:\/\/firebasestorage\.googleapis\.com\/v0\/b\/[^\/]+\/o\/(.+?)\?alt=media.*/;
  const match = fullUrl.match(regex);
  if (match && match[1]) {
    // Decode the URL-encoded path
    return decodeURIComponent(match[1]);
  }
  throw new Error("Invalid Firebase Storage URL");
}

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

export async function getElectionData(electionId: string, userId: string) {
  // Fetch the election document by electionId
  const docRef = db.collection("elections").doc(electionId);
  const doc = await docRef.get();

  if (!doc.exists) {
    throw new Error("Election not found");
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
    .where("userId", "==", userId)
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

  return election;
}
