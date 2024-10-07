import axios from "axios";
import { NextResponse, type NextRequest } from "next/server";
import { Ratelimit } from "@upstash/ratelimit";
import { kv } from "@vercel/kv";
import { AxiosError } from "axios";

// const ratelimit = new Ratelimit({
//   redis: kv,
//   // 5 requests from the same IP in 10 seconds
//   limiter: Ratelimit.slidingWindow(10, "10 s"),
// });

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

  // if (request.nextUrl.hostname === "production") {
  //   const ip = request.ip ?? "127.0.0.1";
  //   const { success, pending, limit, reset, remaining } = await ratelimit.limit(
  //     ip
  //   );

  //   if (!success) {
  //     return NextResponse.redirect(new URL("/blocked", request.url));
  //   }
  // }

  //return NextResponse.next();

  if (!sessionCookie) {
    console.log("Cookie not found");
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
    const response = await axios.get(`${origin}/api/signin`, {
      headers: {
        Cookie: `__session=${sessionCookie}`,
      },
      validateStatus: (status) => status < 500, // Consider all status codes less than 500 as resolved
    });

    if (response.status === 200) {
      return NextResponse.next();
    } else {
      console.log(`❌ Unauthorized access: ${response.status}`);
      if (response.data?.code === "auth/session-cookie-expired") {
        console.log("Session cookie expired");
      }
      return NextResponse.redirect(new URL("/signin", request.url));
    }
  } catch (error) {
    console.error("Error verifying session:", error);
    if (error instanceof AxiosError) {
      if (error.response) {
        console.log(`Server responded with status: ${error.response.status}`);
      } else if (error.request) {
        console.log("No response received from server");
      } else {
        console.log("Error setting up the request:", error.message);
      }
    }
    return NextResponse.redirect(new URL("/signin", request.url));
  }
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
