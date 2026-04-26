import { headers } from "next/headers";
import { getAuth } from "./auth";

export async function getSession() {
  const session = await getAuth().api.getSession({
    headers: await headers(),
  });
  return session;
}
