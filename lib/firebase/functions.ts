import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { auth, db, signInWithGooglePopup } from "@/lib/firebase";

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
