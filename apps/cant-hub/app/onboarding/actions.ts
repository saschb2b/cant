"use server";

import { headers } from "next/headers";
import { getAuth } from "@/lib/auth";

export async function setUserRole(role: "developer" | "recruiter") {
  const session = await getAuth().api.getSession({ headers: await headers() });
  if (!session) throw new Error("Not authenticated");
  if (session.user.role) throw new Error("Role already set");

  await getAuth().api.updateUser({
    body: { role },
    headers: await headers(),
  });
}
