import { NextResponse, NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  console.log("Middleware called");
  let cookie = request.cookies.get("session");

  if (!cookie) {
    return NextResponse.redirect(
      new URL("/login", request.nextUrl)
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/api/protected/", "/protected/(.*)"],
};
