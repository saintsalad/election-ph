import { NextRequest, NextResponse } from "next/server";
import { isUserAuthenticated } from "@/lib/firebase/firebase-admin";

export async function GET(req: NextRequest) {
  try {
    const isAllowed = await isUserAuthenticated();

    const response = NextResponse.json(
      {
        authenticated: isAllowed,
        message: isAllowed
          ? "User is authenticated"
          : "User is not authenticated",
      },
      { status: isAllowed ? 200 : 401 }
    );

    // Short cache duration for auth status
    response.headers.set(
      "Cache-Control",
      "max-age=30, s-maxage=30, stale-while-revalidate=60"
    );

    return response;
  } catch (error) {
    console.error("Error checking authentication:", error);
    return NextResponse.json(
      { message: "Failed to check authentication status" },
      { status: 500 }
    );
  }
}
