import { NextResponse } from "next/server";
import { createSession } from "@/lib/poker/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as {
    name?: unknown;
    spectator?: unknown;
  } | null;
  const name = typeof body?.name === "string" ? body.name : "";
  const isSpectator = body?.spectator === true;
  const { session, participant } = createSession(name, { isSpectator });
  return NextResponse.json({
    sessionId: session.id,
    participantId: participant.id,
  });
}
