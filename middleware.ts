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
  const publicRoutes = [
    "/",
    "/signin",
    "/signup",
    "/signup/success",
    "/api/signin",
    "/api/signup",
    "/api/user/info",
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

  let origin = request.nextUrl.origin;
  if (request.nextUrl.hostname === "localhost") {
    console.log("Running on localhost 🏡");
    origin = process.env.NEXT_PUBLIC_SITE_URL || "";
  } else {
    console.log("Running on deployed environment 🚀");
  }

  try {
    const response = await fetch(`${request.nextUrl.origin}/api/user`, {
      headers: {
        cookie: request.headers.get("cookie") || "",
      },
    });

    if (!response.ok) {
      return NextResponse.redirect(new URL("/signin", request.url));
    }

    return NextResponse.next();
  } catch (error) {
    console.error("Authentication check failed:", error);
    return NextResponse.redirect(new URL("/signin", request.url));
  }
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
