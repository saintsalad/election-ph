import axios from "axios";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const sessionCookie = request.cookies.get("__session")?.value;
  const publicRoutes = [
    "/",
    "/signin",
    "/signup",
    "/signup/success",
    "/api/signin",
  ];

  // If the request URL matches one of the public routes, bypass authentication
  if (publicRoutes.includes(url.pathname)) {
    return NextResponse.next();
  }

  if (!sessionCookie) {
    return NextResponse.redirect(new URL("/signin", request.url));
  }

  let origin = request.nextUrl.origin;
  if (request.nextUrl.hostname === "localhost") {
    console.log("Running on localhost");
    origin = process.env.NEXT_PUBLIC_SITE_URL || "";
  } else {
    console.log("Running on deployed environment");
  }

  try {
    const responseAPI = await axios.get(`${origin}/api/signin`, {
      headers: {
        Cookie: `__session=${sessionCookie}`,
      },
    });

    // Allow access to the protected route if the session is valid
    if (responseAPI.status === 200) {
      // ✨✨✨ Route checking ✨✨✨

      // const votePathPattern = /^\/vote\/([^\/]+)$/;
      // const match = url.pathname.match(votePathPattern);

      // if (match) {
      //   const voteId = match[1];
      //   // Validate the vote ID (e.g., check length, format, etc.)
      //   if (!(voteId && voteId.length > 0)) {
      //     console.log("✅ Valid vote ID:", voteId);
      //     return NextResponse.next();
      //   } else {
      //     console.log("❌ Invalid vote ID");
      //     return NextResponse.redirect(new URL("/not-found", request.url));
      //   }
      // }

      // ✨✨✨ Route checking end ✨✨✨

      return NextResponse.next();
    } else {
      console.log("❌ Unauthorized access:", responseAPI.status);
      return NextResponse.redirect(new URL("/signin", request.url));
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(
        "Authentication error:",
        error.response?.status,
        error.response?.data
      );
    } else {
      console.error("Unexpected error:", error);
    }
    // Redirect to login page if authentication fails
    return NextResponse.redirect(new URL("/signin", request.url));
  }
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
