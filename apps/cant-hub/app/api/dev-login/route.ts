import { NextRequest, NextResponse } from "next/server";
import { getAuth } from "@/lib/auth";

/**
 * Dev-only endpoint to log in as a test user.
 * Usage: GET /api/dev-login?role=recruiter|developer|new
 */
export async function GET(request: NextRequest) {
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.json({ error: "Not available" }, { status: 404 });
  }

  const role = request.nextUrl.searchParams.get("role") ?? "recruiter";
  const email = `${role}@test.local`;
  const name = `Test ${role.charAt(0).toUpperCase() + role.slice(1)}`;
  const password = "dev-test-password-123";

  // Try sign-in first, sign-up if user doesn't exist
  let response = await getAuth().api.signInEmail({
    body: { email, password },
    asResponse: true,
  });

  if (!response.ok) {
    // User doesn't exist yet, create them
    response = await getAuth().api.signUpEmail({
      body: {
        name,
        email,
        password,
        role: role === "new" ? null : role,
      },
      asResponse: true,
    });
  }

  if (!response.ok) {
    const text = await response.text();
    return NextResponse.json(
      { error: "Auth failed", details: text },
      { status: 500 },
    );
  }

  // Forward better-auth's signed session cookies to the redirect response
  const redirect = role === "recruiter" ? "/dashboard" : "/";
  const res = NextResponse.redirect(new URL(redirect, request.url));

  const setCookie = response.headers.get("set-cookie");
  if (setCookie) {
    res.headers.set("set-cookie", setCookie);
  }

  return res;
}
