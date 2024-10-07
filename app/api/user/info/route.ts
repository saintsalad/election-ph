import { NextRequest, NextResponse } from "next/server";
import {
  db,
  getCurrentUser,
  isUserAuthenticated,
} from "@/lib/firebase/firebase-admin";

interface UserInfo {
  age: string;
  gender: string;
  education: string;
  city: string;
}

export async function GET(req: NextRequest) {
  try {
    const isAllowed = await isUserAuthenticated();
    if (!isAllowed) {
      return NextResponse.json(
        { message: "Unauthorized access" },
        { status: 401 }
      );
    }

    const user = await getCurrentUser();
    const userId = user?.uid;

    if (!userId) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const userRef = db.collection("users").doc(userId);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      return NextResponse.json(
        { message: "User data not found" },
        { status: 404 }
      );
    }

    const userData = userDoc.data() as UserInfo;

    const response = NextResponse.json(userData, { status: 200 });
    response.headers.set(
      "Cache-Control",
      "max-age=86400, s-maxage=86400, stale-while-revalidate=172800"
    );

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
  const userInfo: Partial<UserInfo> = await req.json();

  try {
    const isAllow = await isUserAuthenticated();
    if (!isAllow) {
      return NextResponse.json(
        { message: "Unauthorized access" },
        { status: 401 }
      );
    }

    const user = await getCurrentUser();
    const userId = user?.uid;

    if (!userId) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const userRef = db.collection("users").doc(userId);
    const dateUpdated = new Date(
      new Date().toLocaleString("en-US", { timeZone: "Asia/Singapore" })
    );
    await userRef.update({
      ...userInfo,
      dateUpdated,
    });

    return NextResponse.json(
      { message: "User info updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating user info:", error);
    return NextResponse.json(
      { message: "Failed to update user info" },
      { status: 500 }
    );
  }
}
