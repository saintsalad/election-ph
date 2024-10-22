import { NextRequest, NextResponse } from "next/server";
import {
  db,
  getCurrentUser,
  isUserAuthenticated,
} from "@/lib/firebase/firebase-admin";
import { FieldValue } from "firebase-admin/firestore";

export async function POST(req: NextRequest) {
  try {
    const isAllowed = await isUserAuthenticated();
    if (!isAllowed) {
      return NextResponse.json(
        { message: "Unauthorized access" },
        { status: 401 }
      );
    }

    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const { commentId, interactionType } = await req.json();

    if (
      !commentId ||
      !["like", "dislike", "unlike", "undislike"].includes(interactionType)
    ) {
      return NextResponse.json({ message: "Invalid request" }, { status: 400 });
    }

    const commentRef = db.collection("candidateComments").doc(commentId);
    const commentDoc = await commentRef.get();

    if (!commentDoc.exists) {
      return NextResponse.json(
        { message: "Comment not found" },
        { status: 404 }
      );
    }

    const updateData: { [key: string]: any } = {};
    const currentInteraction =
      commentDoc.data()?.userInteractions?.[user.uid] || null;

    if (interactionType === "like" && currentInteraction !== "like") {
      updateData[`userInteractions.${user.uid}`] = "like";
      updateData.likes = FieldValue.increment(1);
      if (currentInteraction === "dislike") {
        updateData.dislikes = FieldValue.increment(-1);
      }
    } else if (
      interactionType === "dislike" &&
      currentInteraction !== "dislike"
    ) {
      updateData[`userInteractions.${user.uid}`] = "dislike";
      updateData.dislikes = FieldValue.increment(1);
      if (currentInteraction === "like") {
        updateData.likes = FieldValue.increment(-1);
      }
    } else if (interactionType === "unlike" && currentInteraction === "like") {
      updateData[`userInteractions.${user.uid}`] = FieldValue.delete();
      updateData.likes = FieldValue.increment(-1);
    } else if (
      interactionType === "undislike" &&
      currentInteraction === "dislike"
    ) {
      updateData[`userInteractions.${user.uid}`] = FieldValue.delete();
      updateData.dislikes = FieldValue.increment(-1);
    } else {
      return NextResponse.json(
        { message: "No change in interaction" },
        { status: 200 }
      );
    }

    await commentRef.update(updateData);

    return NextResponse.json(
      { message: "Interaction updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating interaction:", error);
    return NextResponse.json(
      { message: "Failed to update interaction", error: error },
      { status: 500 }
    );
  }
}
