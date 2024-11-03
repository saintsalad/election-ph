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
    "/about",
    "/api/signin",
    "/api/signup",
    "/api/user/info",
  ];

  let origin = request.nextUrl.origin;
  if (request.nextUrl.hostname === "localhost") {
    console.log("Running on localhost 🏡");
    origin = process.env.NEXT_PUBLIC_SITE_URL || "";
  } else {
    console.log("Running on deployed environment 🚀");
  }

  // If the request URL matches one of the public routes, bypass authentication
  if (publicRoutes.includes(url.pathname)) {
    return NextResponse.next();
  } else if (url.pathname === "/master") {
    console.log("🔒 Validating master route access");

    try {
      const response = await fetch(`${origin}/api/user/info`, {
        headers: { cookie: request.headers.get("cookie") || "" },
      }).then((res) =>
        res.ok
          ? res.json()
          : Promise.reject(new Error(`Authentication failed: ${res.status}`))
      );

      if (response.level !== 12) {
        console.log("❌ Access denied: Insufficient privileges");
        return NextResponse.redirect(new URL("/not-found", request.url));
      }

      console.log("✅ Super admin access granted");
      return NextResponse.next();
    } catch (error) {
      console.error("🚫 Master route access failed:", error);
      return NextResponse.redirect(new URL("/signin", request.url));
    }
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

  try {
    // const response = await fetch(`${origin}/api/user`, {
    //   headers: {
    //     cookie: request.headers.get("__session") || "",
    //   },
    // });

    // if (!response.ok) {
    //   return NextResponse.redirect(new URL("/signin", request.url));
    // }

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
