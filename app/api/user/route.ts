import { NextRequest, NextResponse } from "next/server";
import {
  isUserAuthenticated,
  getCurrentUser,
} from "@/lib/firebase/firebase-admin";

export async function GET(req: NextRequest) {
  try {
    const isAuthenticated = await isUserAuthenticated();

    if (!isAuthenticated) {
      return NextResponse.json(
        { message: "User is not authenticated" },
        { status: 401 }
      );
    }

    const user = await getCurrentUser();
    return NextResponse.json(
      { user },
      {
        status: 200,
        headers: {
          "Cache-Control":
            "private, max-age=30, s-maxage=30, stale-while-revalidate=60",
        },
      }
    );
  } catch (error) {
    console.error("Authentication error:", error);
    return NextResponse.json(
      { message: "Authentication check failed" },
      { status: 500 }
    );
  }
}
