import { collection, getDocs, query, where } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import {
  fetchSignInMethodsForEmail,
  onAuthStateChanged,
  User,
} from "firebase/auth";
import { APIResponse } from "@/lib/definitions";
import axios from "axios";

type customAuthEndpoint = {
  success: boolean;
};

type FetchOptions = {
  cacheKey: string;
  cacheExpiry?: number; // Optional cache expiry time in milliseconds
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
