import { NextResponse } from "next/server";
import { broadcast } from "@/lib/retro/broadcaster";
import { startVoting } from "@/lib/retro/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const body = (await request.json().catch(() => null)) as {
    participantId?: unknown;
    maxVotes?: unknown;
    endsAt?: unknown;
  } | null;
  const participantId =
    typeof body?.participantId === "string" ? body.participantId : "";

  const session = startVoting(
    id,
    participantId,
    body?.maxVotes,
    body?.endsAt ?? null,
  );
  if (!session) {
    return NextResponse.json({ error: "cannot-start-voting" }, { status: 400 });
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
