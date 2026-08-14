import { NextResponse } from "next/server";
import { broadcast } from "@/lib/retro/broadcaster";
import { listNotes, reveal, snapshotNote } from "@/lib/retro/store";

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
  const session = reveal(id, participantId);
  if (!session) {
    return NextResponse.json({ error: "session-not-found" }, { status: 404 });
  }
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
  return NextResponse.json({ ok: true });
}
