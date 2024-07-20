import {
  addDoc,
  collection,
  doc,
  documentId,
  getDoc,
  getDocs,
  query,
  QuerySnapshot,
  where,
  WithFieldValue,
} from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import {
  fetchSignInMethodsForEmail,
  onAuthStateChanged,
  User,
} from "firebase/auth";
import { APIResponse } from "@/lib/definitions";
import axios from "axios";
import CryptoJS from "crypto-js";

type customAuthEndpoint = {
  success: boolean;
};

type FetchOptions = {
  cacheKey: string;
  cacheExpiry?: number; // Optional cache expiry time in milliseconds
};

const SECRET_KEY = process.env.NEXT_PUBLIC_SECRET_KEY || ""; // Replace this with your actual secret key

const hashData = (data: string): string => {
  return CryptoJS.HmacSHA256(data, SECRET_KEY).toString(CryptoJS.enc.Hex);
};

export const isUnique = async (
  path: string,
  field: string,
  username: string
) => {
  const usersRef = collection(db, path);
  const q = query(usersRef, where(field, "==", username));
  const querySnapshot = await getDocs(q);
  return querySnapshot.empty;
};

export const checkAccountExists = async (email: string): Promise<boolean> => {
  try {
    const signInMethods = await fetchSignInMethodsForEmail(auth, email);
    return signInMethods.length > 0;
  } catch (error) {
    console.error("Error checking account existence:", error);
    return false;
  }
};

export const handleLogin = async (user: User): Promise<customAuthEndpoint> => {
  const idToken = await user.getIdToken();

  const response = await axios.post<APIResponse<string>>(
    "/api/signin",
    {
      idToken,
    },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  return {
    success: response.status == 200,
  };
};

export const handleLogout = async () => {
  await axios.get<APIResponse<string>>("/api/signout");
};

// ✨✨ USAGE ✨✨
// async function loadElections(forceRefresh: boolean = false) {
//   try {
//     const result = await fetchFromFirebase<Election>("elections", {
//       cacheKey: "elections",
//     }, forceRefresh);
//     setElections(result);
//   } catch (e) {
//     console.error("Error loading elections: ", e);
//   }
// }
export async function fetchFromFirebase<T>(
  collectionName: string,
  options: FetchOptions,
  forceRefresh: boolean = false
): Promise<T[]> {
  const { cacheKey, cacheExpiry = 1000 * 60 * 60 } = options;
  // Default cache expiry to 1 hour
  // Check local storage for cached data if not forcing a refresh
  if (!forceRefresh) {
    const cachedData = localStorage.getItem(cacheKey);
    const cachedTime = localStorage.getItem(`${cacheKey}_time`);
    const currentTime = new Date().getTime();

    if (cachedData && cachedTime) {
      const cacheAge = currentTime - parseInt(cachedTime, 10);
      if (cacheAge < cacheExpiry) {
        // Use cached data
        console.log(`fetching ${collectionName} from local storage 🍪`);
        return JSON.parse(cachedData);
      }
    }
  }

  // Fetch from Firebase
  try {
    console.log(`Fetching data from collection: ${collectionName}`);
    const querySnapshot = await getDocs(collection(db, collectionName));
    const result = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as T),
    }));

    // Cache the result and current timestamp
    localStorage.setItem(cacheKey, JSON.stringify(result));
    localStorage.setItem(`${cacheKey}_time`, new Date().getTime().toString());

    return result;
  } catch (e) {
    console.error(
      `Error retrieving data from collection ${collectionName}: `,
      e
    );
    throw e;
  }
}

// ✨✨ USAGE ✨✨
// const candidateIds = ["id1", "id2", "id3"];
// getDocumentsByIds("candidates", candidateIds)
//   .then((documents) => {
//     console.log("Retrieved documents:", documents);
//   })
//   .catch((error) => {
//     console.error("Error retrieving documents:", error);
//   });

/**
 * Fetch documents from a Firestore collection based on a list of document IDs.
 * @param collectionName - The name of the Firestore collection.
 * @param ids - An array of document IDs to retrieve.
 * @returns A Promise that resolves to an array of documents with their IDs.
 */
export async function fetchDocumentsByIds<T>(
  collectionName: string,
  ids: string[]
): Promise<(T & { id: string })[]> {
  if (ids.length === 0) {
    return [];
  }

  // Query Firestore to get documents with the specified IDs
  const snap = await getDocs(
    query(collection(db, collectionName), where(documentId(), "in", ids))
  );

  // Map the document snapshots to include their IDs
  const documents = snap.docs.map((doc) => {
    const item = doc.data() as T;
    return { ...item, id: doc.id };
  });

  return documents;
}

type DocumentData = {
  id: string;
  [key: string]: any;
};

/**
 * Fetches a single document from a Firestore collection by its ID.
 * @template T - The type of the document data.
 * @param {string} collectionName - The name of the Firestore collection.
 * @param {string} documentId - The ID of the document to fetch.
 * @returns {Promise<T | null>} A promise that resolves with the document data if found, or null if not found.
 * @throws Will throw an error if the document fetch fails.
 */
export const fetchDocumentById = async <T extends DocumentData>(
  collectionName: string,
  documentId: string
): Promise<T | null> => {
  try {
    const docRef = doc(db, collectionName, documentId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as T;
    } else {
      console.log("No such document!");
      return null;
    }
  } catch (error) {
    console.error("Error fetching document:", error);
    throw error;
  }
};

// Define the return type for the saveDocument function
type SaveDocumentResult<T> = {
  success: boolean;
  data?: (T & { id: string }) | string; // data can be a saved document with id or an error message
};

// Generic function to save a document
export const saveDocument = async <T>(
  collectionName: string,
  document: T
): Promise<SaveDocumentResult<T>> => {
  try {
    // Ensure document conforms to DocumentData by asserting type
    const docRef = await addDoc(
      collection(db, collectionName),
      document as DocumentData
    );

    // Return the document with the generated ID
    const savedDocument = { ...document, id: docRef.id } as T & { id: string };
    return { success: true, data: savedDocument };
  } catch (err) {
    console.error("Error saving document:", err);
    return {
      success: false,
      data: err instanceof Error ? err.message : "Unknown error",
    };
  }
};

export const getPathFromUrl = (url: string): string => {
  const url_token = url.split("?");
  const _url = url_token[0].split("/");
  const filePath = _url[_url.length - 1].replaceAll("%2F", "/");
  return decodeURIComponent(filePath);
};

export const getFileNameFromUrl = (url: string): string => {
  const url_token = url.split("?");
  const _url = url_token[0].split("/");
  const filePath = _url[_url.length - 1].replaceAll("%2F", "/");
  const decodedFilePath = decodeURIComponent(filePath);

  // Extract the filename from the path
  const fileName = decodedFilePath.split("/").pop();
  return fileName || "";
};

/**
 * Retrieves documents from a Firestore collection where a specific field matches the provided value.
 * @param collectionName - The name of the Firestore collection.
 * @param field - The field to filter documents by.
 * @param value - The value to filter documents by.
 * @returns An array of documents that match the specified field value.
 * @throws Error if the query fails.
 */
export const getDocumentsByField = async <T>(
  collectionName: string,
  field: string,
  value: any
): Promise<T[]> => {
  try {
    const q = query(collection(db, collectionName), where(field, "==", value));
    const querySnapshot = await getDocs(q);

    const documents: T[] = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as T[];

    return documents;
  } catch (error) {
    console.error("Error getting documents: ", error);
    throw new Error("Failed to get documents");
  }
};

export const hasUserVoted = async (
  userId: string,
  electionId: string,
  forceRefresh: boolean = false
): Promise<boolean> => {
  const cacheKey = `hasUserVoted_${userId}_${electionId}`;
  const cacheHashKey = `${cacheKey}_hash`;
  const cacheExpiry = 1000 * 60 * 30; // 1 minute

  if (!forceRefresh) {
    const cachedData = localStorage.getItem(cacheKey);
    const cachedHash = localStorage.getItem(cacheHashKey);
    const cachedTime = localStorage.getItem(`${cacheKey}_time`);
    const currentTime = new Date().getTime();

    if (cachedData && cachedHash && cachedTime) {
      const cacheAge = currentTime - parseInt(cachedTime, 10);
      const dataHash = hashData(cachedData);

      if (cacheAge < cacheExpiry && cachedHash === dataHash) {
        // Use cached data
        console.log(`Fetching hasUserVoted result from local storage 🍪`);
        try {
          return JSON.parse(cachedData);
        } catch (e) {
          console.error("Error parsing cached data:", e);
          // Clear corrupted cache
          localStorage.removeItem(cacheKey);
          localStorage.removeItem(cacheHashKey);
          localStorage.removeItem(`${cacheKey}_time`);
        }
      } else {
        console.warn("Cache is stale or corrupted. Fetching new data...");
        // Clear corrupted cache
        localStorage.removeItem(cacheKey);
        localStorage.removeItem(cacheHashKey);
        localStorage.removeItem(`${cacheKey}_time`);
      }
    }
  }

  try {
    const q = query(
      collection(db, "votes"),
      where("userId", "==", userId),
      where("electionId", "==", electionId)
    );
    console.log(`Fetching hasUserVoted result from firebase 🔥`);
    const querySnapshot: QuerySnapshot = await getDocs(q);

    const result = !querySnapshot.empty;
    const resultString = JSON.stringify(result);

    // Cache the result, its hash, and the current timestamp
    localStorage.setItem(cacheKey, resultString);
    localStorage.setItem(cacheHashKey, hashData(resultString));
    localStorage.setItem(`${cacheKey}_time`, new Date().getTime().toString());

    return result;
  } catch (error) {
    console.error("Error checking if user has voted:", error);
    return false;
  }
};
