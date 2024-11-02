import { NextResponse } from "next/server";
import {
  auth,
  isUserAuthenticated,
  getCurrentUser,
  db,
} from "@/lib/firebase/firebase-admin";
import { headers } from "next/headers";
import { getAuth } from "firebase-admin/auth";

export async function DELETE() {
  try {
    // Get the authorization token from headers
    const headersList = headers();

    const isAllow = await isUserAuthenticated();
    if (!isAllow) {
      return NextResponse.json(
        { message: "Unauthorized access" },
        { status: 401 }
      );
    }

    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { message: "Unauthorized access" },
        { status: 401 }
      );
    }

    // Delete user document from Firestore
    await db.collection("users").doc(user.uid).delete();

    // Delete the user from Firebase Authentication
    await getAuth().deleteUser(user.uid);

    return NextResponse.json(
      { message: "Account successfully deleted" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting account:", error);
    return NextResponse.json(
      { error: "Failed to delete account" },
      { status: 500 }
    );
  }
}
