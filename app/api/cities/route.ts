import { NextRequest, NextResponse } from "next/server";
import cities from "@/lib/json/cities.json";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get("code");

  const headers = {
    "Cache-Control": "public, max-age=31536000, immutable",
  };

  if (code) {
    const city = cities.find((city) => city.code === code);
    if (city) {
      return NextResponse.json(city, { headers });
    } else {
      return NextResponse.json(
        { error: "City not found" },
        { status: 404, headers }
      );
    }
  }

  return NextResponse.json(cities, { headers });
}
