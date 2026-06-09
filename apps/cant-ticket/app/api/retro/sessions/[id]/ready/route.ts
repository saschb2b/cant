import { NextResponse } from "next/server";
import { broadcast } from "@/lib/retro/broadcaster";
import {
  listNotes,
  setReady,
  snapshotNote,
  tallyVotes,
} from "@/lib/retro/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const body = (await request.json().catch(() => null)) as {
    participantId?: unknown;
    isReady?: unknown;
  } | null;
  const participantId =
    typeof body?.participantId === "string" ? body.participantId : "";
  const isReady = body?.isReady === true;

  const result = setReady(id, participantId, isReady);
  if (!result) {
    return NextResponse.json({ error: "cannot-set-ready" }, { status: 400 });
  }

  broadcast(id, {
    type: "ready-changed",
    participantId: result.participantId,
    isReady: result.isReady,
  });

  // When the ready check tips the phase forward we also broadcast the same
  // events the manual reveal/end-voting endpoints would, so every client sees
  // the same state regardless of who triggered the transition.
  if (result.autoAdvanced === "collect-to-discuss") {
    const session = result.session;
    const notes = listNotes(session);
    broadcast(id, (forParticipantId) => ({
      type: "revealed",
      notes: notes.map((n) => snapshotNote(session, n, forParticipantId)),
    }));
    broadcast(id, {
      type: "phase-changed",
      phase: session.phase,
      voting: {
        maxVotes: session.votingMaxVotes,
        endsAt: session.votingEndsAt,
      },
      collectEndsAt: session.collectEndsAt,
    });
  } else if (result.autoAdvanced === "vote-to-results") {
    const session = result.session;
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
  }

  return NextResponse.json({
    ok: true,
    isReady: result.isReady,
    autoAdvanced: result.autoAdvanced,
  });
}
