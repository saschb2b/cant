import { NextResponse } from "next/server";
import { broadcast } from "@/lib/retro/broadcaster";
import { setPhaseTimer } from "@/lib/retro/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const body = (await request.json().catch(() => null)) as {
    participantId?: unknown;
    endsAt?: unknown;
  } | null;
  const participantId =
    typeof body?.participantId === "string" ? body.participantId : "";
  const endsAt = body && "endsAt" in body ? body.endsAt : null;

  const session = setPhaseTimer(id, participantId, endsAt);
  if (!session) {
    return NextResponse.json({ error: "cannot-set-timer" }, { status: 400 });
  }
  broadcast(id, {
    type: "phase-changed",
    phase: session.phase,
    voting: {
      maxVotes: session.votingMaxVotes,
      endsAt: session.votingEndsAt,
    },
    collectEndsAt: session.collectEndsAt,
  });
  return NextResponse.json({ ok: true });
}
