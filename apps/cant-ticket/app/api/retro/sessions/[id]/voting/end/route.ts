import { NextResponse } from "next/server";
import { broadcast } from "@/lib/retro/broadcaster";
import { endVoting, tallyVotes } from "@/lib/retro/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const body = (await request.json().catch(() => null)) as {
    participantId?: unknown;
  } | null;
  const participantId =
    typeof body?.participantId === "string" ? body.participantId : "";

  const session = endVoting(id, participantId);
  if (!session) {
    return NextResponse.json({ error: "cannot-end-voting" }, { status: 400 });
  }
  broadcast(id, {
    type: "phase-changed",
    phase: session.phase,
    voting: {
      maxVotes: session.votingMaxVotes,
      endsAt: session.votingEndsAt,
    },
    collectEndsAt: session.collectEndsAt,
    // Voting just closed: now it is safe to reveal the tally.
    voteCounts: tallyVotes(session),
  });
  return NextResponse.json({ ok: true });
}
