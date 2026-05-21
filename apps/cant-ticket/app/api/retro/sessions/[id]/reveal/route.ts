import { NextResponse } from "next/server";
import { broadcast } from "@/lib/retro/broadcaster";
import { listNotes, reveal, snapshotNote } from "@/lib/retro/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const session = reveal(id);
  if (!session) {
    return NextResponse.json({ error: "session-not-found" }, { status: 404 });
  }
  const notes = listNotes(session);
  broadcast(id, (forParticipantId) => ({
    type: "revealed",
    notes: notes.map((n) => snapshotNote(session, n, forParticipantId)),
  }));
  return NextResponse.json({ ok: true });
}
