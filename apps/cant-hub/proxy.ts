import { NextRequest, NextResponse } from "next/server";

const SCREENING_ENABLED = process.env.NEXT_PUBLIC_SCREENING_ENABLED === "true";

export function proxy(request: NextRequest) {
  if (!SCREENING_ENABLED) {
    return new NextResponse(null, { status: 404 });
  }

  const { pathname } = request.nextUrl;

  // Public screening routes: candidate flow, sign-in page, and auth API routes.
  if (
    pathname === "/sign-in" ||
    pathname.startsWith("/s/") ||
    pathname.startsWith("/api/auth/") ||
    pathname === "/api/dev-login"
  ) {
    return NextResponse.next();
  }

  const hasSession = request.cookies
    .getAll()
    .some(
      (c) =>
        c.name.includes("session_token") || c.name.includes("session-token"),
    );

  if (!hasSession) {
    const signInUrl = new URL("/sign-in", request.url);
    signInUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(signInUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/onboarding/:path*",
    "/sign-in",
    "/s/:path*",
    "/api/auth/:path*",
    "/api/dev-login",
  ],
};
