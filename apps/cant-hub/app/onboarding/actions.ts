"use server";

import { headers } from "next/headers";
import { auth } from "@/lib/auth";

export async function setUserRole(role: "developer" | "recruiter") {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) throw new Error("Not authenticated");
  if (session.user.role) throw new Error("Role already set");

  await auth.api.updateUser({
    body: { role },
    headers: await headers(),
  });
}
