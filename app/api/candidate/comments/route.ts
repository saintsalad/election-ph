import { NextRequest, NextResponse } from "next/server";
import { Comment } from "@/lib/definitions";
import {
  db,
  getCurrentUser,
  isUserAuthenticated,
} from "@/lib/firebase/firebase-admin";
import { FieldValue, Timestamp } from "firebase-admin/firestore";

// Helper function to create error responses
function createErrorResponse(message: string, status: number) {
  return NextResponse.json({ message }, { status });
}

// Helper function to create a new comment object
function createNewComment(user: any, content: string): Omit<Comment, "id"> {
  return {
    userId: user.uid,
    author: user.displayName || "Anonymous",
    avatar: user.photoURL || "",
    content,
    createdAt: Timestamp.now().toDate().toISOString(),
    userInteractions: {},
    isAuthor: true,
  };
}

export async function POST(req: NextRequest) {
  try {
    if (!(await isUserAuthenticated())) {
      return createErrorResponse("Unauthorized access", 401);
    }

    const user = await getCurrentUser();
    if (!user) {
      return createErrorResponse("User not found", 404);
    }

    const { candidateId, content, parentCommentId } = await req.json();

    if (!candidateId || !content) {
      return createErrorResponse(
        "Candidate ID and comment content are required",
        400
      );
    }

    const newComment = createNewComment(user, content);
    let createdComment: Comment;

    if (parentCommentId) {
      createdComment = await addReplyToComment(parentCommentId, newComment);
    } else {
      createdComment = await addTopLevelComment(candidateId, newComment);
    }

    return NextResponse.json(
      { message: "Comment added successfully", comment: createdComment },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error saving comment:", error);
    return createErrorResponse("Failed to save comment", 500);
  }
}

async function addReplyToComment(
  parentCommentId: string,
  newComment: Omit<Comment, "id">
): Promise<Comment> {
  const parentCommentRef = db
    .collection("candidateComments")
    .doc(parentCommentId);
  const parentCommentDoc = await parentCommentRef.get();

  if (!parentCommentDoc.exists) {
    throw new Error("Parent comment not found");
  }

  const parentComment = parentCommentDoc.data() as Comment;
  const replies = parentComment.replies || [];
  const replyId = `${parentCommentId}_reply_${replies.length + 1}`;
  const createdComment = { id: replyId, ...newComment };

  await parentCommentRef.update({
    replies: FieldValue.arrayUnion(createdComment),
  });

  return createdComment;
}

async function addTopLevelComment(
  candidateId: string,
  newComment: Omit<Comment, "id">
): Promise<Comment> {
  const docRef = await db.collection("candidateComments").add({
    ...newComment,
    candidateId,
  });

  return {
    id: docRef.id,
    ...newComment,
  };
}

export async function GET(req: NextRequest) {
  try {
    if (!(await isUserAuthenticated())) {
      return createErrorResponse("Unauthorized access", 401);
    }

    const { searchParams } = new URL(req.url);
    const candidateId = searchParams.get("candidateId");

    if (!candidateId) {
      return createErrorResponse("Candidate ID is required", 400);
    }

    const comments = await fetchComments(candidateId);

    // Create a new response with the comments data
    const response = NextResponse.json([...comments], { status: 200 });

    // Set cache control headers
    response.headers.set(
      "Cache-Control",
      "public, s-maxage=120, stale-while-revalidate=60"
    );

    return response;
  } catch (error) {
    console.error("Error fetching comments:", error);
    return createErrorResponse("Failed to fetch comments", 500);
  }
}

async function fetchComments(candidateId: string): Promise<Comment[]> {
  const commentsSnapshot = await db
    .collection("candidateComments")
    .where("candidateId", "==", candidateId)
    .orderBy("createdAt", "desc")
    .get();

  const currentUser = await getCurrentUser();
  const currentUserId = currentUser?.uid;

  return commentsSnapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      userId: data.userId,
      author: data.author || "Anonymous",
      avatar: data.avatar || "",
      content: data.content,
      createdAt: data.createdAt,
      userInteractions: data.userInteractions || {},
      isAuthor: data.userId === currentUserId,
      replies: (data.replies || []).map((reply: any) => ({
        ...reply,
        userInteractions: reply.userInteractions || {},
        isAuthor: reply.userId === currentUserId,
      })),
    } as Comment;
  });
}

// Helper functions for calculating likes and dislikes
function getLikes(comment: Comment): number {
  return Object.values(comment.userInteractions || {}).filter(
    (v) => v === "like"
  ).length;
}

function getDislikes(comment: Comment): number {
  return Object.values(comment.userInteractions || {}).filter(
    (v) => v === "dislike"
  ).length;
}

export async function DELETE(req: NextRequest) {
  try {
    if (!(await isUserAuthenticated())) {
      return createErrorResponse("Unauthorized access", 401);
    }

    const user = await getCurrentUser();
    if (!user) {
      return createErrorResponse("User not found", 404);
    }

    const { searchParams } = new URL(req.url);
    const commentId = searchParams.get("commentId");
    const parentCommentId = searchParams.get("parentCommentId");

    if (!commentId) {
      return createErrorResponse("Comment ID is required", 400);
    }

    if (parentCommentId) {
      // Deleting a reply
      return await deleteReply(commentId, parentCommentId, user.uid);
    } else {
      // Deleting a top-level comment
      return await deleteTopLevelComment(commentId, user.uid);
    }
  } catch (error) {
    console.error("Error deleting comment:", error);
    return createErrorResponse("Failed to delete comment", 500);
  }
}

async function deleteTopLevelComment(commentId: string, userId: string) {
  const commentRef = db.collection("candidateComments").doc(commentId);
  const commentDoc = await commentRef.get();

  if (!commentDoc.exists) {
    return createErrorResponse("Comment not found", 404);
  }

  const commentData = commentDoc.data() as Comment;
  if (commentData.userId !== userId) {
    return createErrorResponse(
      "You don't have permission to delete this comment",
      403
    );
  }

  await commentRef.delete();
  return NextResponse.json(
    { message: "Comment deleted successfully" },
    { status: 200 }
  );
}

async function deleteReply(
  replyId: string,
  parentCommentId: string,
  userId: string
) {
  const parentCommentRef = db
    .collection("candidateComments")
    .doc(parentCommentId);
  const parentCommentDoc = await parentCommentRef.get();

  if (!parentCommentDoc.exists) {
    return createErrorResponse("Parent comment not found", 404);
  }

  const parentCommentData = parentCommentDoc.data() as Comment;
  const replyIndex = parentCommentData.replies?.findIndex(
    (reply) => reply.id === replyId
  );

  if (replyIndex === undefined || replyIndex === -1) {
    return createErrorResponse("Reply not found", 404);
  }

  if (!parentCommentData.replies) {
    return createErrorResponse("Replies not found", 404);
  }

  const reply = parentCommentData.replies[replyIndex];
  if (reply.userId !== userId) {
    return createErrorResponse(
      "You don't have permission to delete this reply",
      403
    );
  }

  await parentCommentRef.update({
    replies: FieldValue.arrayRemove(reply),
  });

  return NextResponse.json(
    { message: "Reply deleted successfully" },
    { status: 200 }
  );
}
