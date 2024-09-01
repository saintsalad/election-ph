import { CandidateNext } from "@/lib/definitions";
import {
  db,
  getRelativePath,
  isUserAuthenticated,
  storage,
} from "@/lib/firebase/firebase-admin";
import {
  DocumentSnapshot,
  FirebaseFirestoreError,
} from "firebase-admin/firestore";
import { deleteObject } from "firebase/storage";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const candidateId = searchParams.get("candidateId");

  if (!candidateId) {
    return NextResponse.json(
      { message: "Candidate ID is missing" },
      { status: 400 }
    );
  }

  try {
    const isAllow = await isUserAuthenticated();
    if (!isAllow) {
      return NextResponse.json(
        { message: "Unauthorized access" },
        { status: 401 }
      );
    }

    const docRef = db.collection("candidates").doc(candidateId);

    const docSnapshot = (await docRef.get()) as DocumentSnapshot<CandidateNext>;

    if (!docSnapshot.exists) {
      return NextResponse.json(
        {
          message: "Candidate do not exist",
        },

        { status: 404 }
      );
    }

    const docData = docSnapshot.data();

    if (!docData) {
      return NextResponse.json(
        {
          message: "Candidate has no data",
        },

        { status: 400 }
      );
    }

    await deleteFile(docData.displayPhoto);
    await deleteFile(docData.coverPhoto);

    await docRef.delete();

    return NextResponse.json(
      { message: "Candidate successfully deleted" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting document:", error);
    return NextResponse.json(
      { message: "Failed to delete candidate", error },
      { status: 500 }
    );
  }
}

async function deleteFile(fullPath: string) {
  if (!fullPath) {
    return;
  }
  const relativePath = getRelativePath(fullPath);

  if (relativePath) {
    try {
      const fileRef = storage.file(relativePath);

      // Check if the file exists
      await fileRef.getMetadata();

      // If file exists, delete it
      await fileRef.delete();

      console.log("File deleted successfully.", relativePath);
    } catch (error) {
      // Narrow the error type
      if (error instanceof Error) {
        if (error.message.includes("No such object")) {
          return; //just skip if file not found
        } else {
          throw new Error("Error accessing file: " + error);
        }
      } else {
        throw new Error("Unknown error occurred:" + error);
      }
    }
  } else {
    throw new Error("Invalid path extracted:" + fullPath);
  }
}
