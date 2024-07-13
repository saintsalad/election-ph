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
