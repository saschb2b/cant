import { NextResponse } from "next/server";
import { createSession } from "@/lib/poker/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as {
    name?: unknown;
  } | null;
  const name = typeof body?.name === "string" ? body.name : "";
  const { session, participant } = createSession(name);
  return NextResponse.json({
    sessionId: session.id,
    participantId: participant.id,
  });
}
