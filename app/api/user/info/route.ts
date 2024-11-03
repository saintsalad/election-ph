import { NextRequest, NextResponse } from "next/server";
import {
  db,
  getCurrentUser,
  isUserAuthenticated,
} from "@/lib/firebase/firebase-admin";
import { UserResponse } from "@/lib/definitions";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const requestedUserId = searchParams.get("userId");

    let userId: string | undefined;

    if (requestedUserId) {
      userId = requestedUserId;
    } else {
      const isAllowed = await isUserAuthenticated();
      if (!isAllowed) {
        return NextResponse.json(
          { message: "Unauthorized access" },
          { status: 401 }
        );
      }

      const user = await getCurrentUser();
      userId = user?.uid;
    }

    if (!userId) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const userRef = db.collection("users").doc(userId);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      const response = NextResponse.json(
        { message: "User data not found" },
        { status: 200 }
      );
      response.headers.set(
        "Cache-Control",
        "max-age=86400, s-maxage=86400, stale-while-revalidate=172800"
      );
      return response;
    }

    const userData = userDoc.data() as UserResponse;

    const response = NextResponse.json(userData, { status: 200 });
    // response.headers.set(
    //   "Cache-Control",
    //   "max-age=86400, s-maxage=86400, stale-while-revalidate=172800"
    // );

    return response;
  } catch (error) {
    console.error("Error fetching user info:", error);
    return NextResponse.json(
      { message: "Failed to fetch user info" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  console.log("POST request received for user info update");
  const userInfo: Partial<UserResponse> = await req.json();
  console.log("Received user info:", userInfo);

  try {
    console.log("Checking user authentication");
    const isAllowed = await isUserAuthenticated();
    if (!isAllowed) {
      console.log("Unauthorized access attempt");
      return NextResponse.json(
        { message: "Unauthorized access" },
        { status: 401 }
      );
    }

    console.log("User authenticated, fetching current user");
    const user = await getCurrentUser();
    const userId = user?.uid;

    if (!userId) {
      console.log("User not found");
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    console.log(`Updating info for user: ${userId}`);
    const userRef = db.collection("users").doc(userId);
    const dateUpdated = new Date().toLocaleString("en-US", {
      timeZone: "Asia/Manila",
    });
    const dateUpdatedISO = new Date(dateUpdated).toISOString();
    // user level is 1 by default
    // super admin is level 12
    await userRef.update({
      ...userInfo,
      level: 1,
      dateUpdated: dateUpdatedISO,
    });
    console.log("User info updated successfully");

    return NextResponse.json(
      { message: "User info updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating user info:", error);
    if (error instanceof Error) {
      console.error("Error details:", error.message);
    }
    return NextResponse.json(
      { message: "Failed to update user info" },
      { status: 500 }
    );
  }
}
