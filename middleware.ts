import axios from "axios";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const sessionCookie = request.cookies.get("__session")?.value;
  const publicRoutes = ["/signin", "/signup", "/signup/success", "/api/signin"];
  // If the request URL matches one of the public routes, bypass authentication
  if (publicRoutes.some((route) => url.pathname.startsWith(route))) {
    return NextResponse.next();
  }

  if (!sessionCookie) {
    return NextResponse.redirect(new URL("/signin", request.url));
  }
  try {
    const responseAPI = await axios.get(
      `${process.env.NEXT_PUBLIC_SITE_URL}/api/signin`,
      {
        headers: {
          Cookie: `__session=${sessionCookie}`,
        },
      }
    );

    // Redirect to login page if the session is invalid
    if (responseAPI.status !== 200) {
      console.log("❌❌❌", responseAPI.status);
      return NextResponse.redirect(new URL("/signin", request.url));
    }
    // Allow access to the protected route
    return NextResponse.next();
  } catch (error) {
    console.error("Authentication error:", error);
    // Redirect to login page if authentication fails
    return NextResponse.redirect(new URL("/signin", request.url));
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
