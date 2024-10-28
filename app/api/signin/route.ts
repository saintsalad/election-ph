import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

import { APIResponse } from "@/lib/definitions";
import { createSessionCookie, auth } from "@/lib/firebase/firebase-admin";
import { FirebaseAuthError } from "firebase-admin/auth";

export async function POST(request: NextRequest) {
  try {
    console.log("🔍 Parsing request body...");
    const reqBody = (await request.json()) as { idToken: string };
    const idToken = reqBody?.idToken;

    if (!idToken) {
      console.error("❌ ID token is missing in the request body.");
      return NextResponse.json<APIResponse<string>>({
        success: false,
        data: "ID token is missing.",
      });
    }

    console.log("🔑 Creating session cookie...");
    const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 days
    const sessionCookie = await createSessionCookie(idToken, { expiresIn });

    if (!sessionCookie) {
      console.error("❌ Failed to create session cookie.");
      return NextResponse.json<APIResponse<string>>({
        success: false,
        data: "Failed to create session cookie.",
      });
    }

    console.log("🍪 Setting session cookie...");
    cookies().set("__session", sessionCookie, {
      maxAge: expiresIn,
      httpOnly: true,
      secure: true,
      sameSite: "strict", // Added security measure
    });

    // Verify the cookie was set by reading it back
    const verifySession = cookies().get("__session")?.value;

    if (!verifySession) {
      console.error("❌ Session cookie verification failed");
      return NextResponse.json<APIResponse<string>>({
        success: false,
        data: "Failed to verify session cookie.",
      });
    }

    // Verify the session cookie is valid with Firebase
    try {
      await auth.verifySessionCookie(verifySession, true);
    } catch (error) {
      console.error("❌ Invalid session cookie:", error);
      return NextResponse.json<APIResponse<string>>({
        success: false,
        data: "Invalid session cookie.",
      });
    }

    console.log("✅ Sign in successful.");
    return NextResponse.json<APIResponse<string>>({
      success: true,
      data: "Signed in successfully.",
    });
  } catch (error) {
    console.error("❌ Error during sign in:", error);
    return NextResponse.json<APIResponse<string>>({
      success: false,
      data: `${error}`,
    });
  }
}

export async function GET(request: NextRequest) {
  const session = cookies().get("__session")?.value || "";

  // Validate if the cookie exist in the request
  if (!session) {
    return NextResponse.json({ isLogged: false }, { status: 401 });
  }

  // Use Firebase Admin to validate the session cookie
  try {
    const decodedClaims = await auth.verifySessionCookie(session, true);

    if (!decodedClaims) {
      return NextResponse.json({ isLogged: false }, { status: 402 });
    }
  } catch (error) {
    if (error instanceof FirebaseAuthError) {
      if (error.code === "auth/session-cookie-expired") {
        return NextResponse.json(
          { isLogged: false, code: error.code },
          { status: 402 }
        );
      }
    }
  }

  return NextResponse.json({ isLogged: true }, { status: 200 });
}
