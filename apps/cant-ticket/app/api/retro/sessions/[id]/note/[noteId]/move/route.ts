import { NextResponse } from "next/server";
import { broadcast } from "@/lib/retro/broadcaster";
import { moveNote, snapshotNote } from "@/lib/retro/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string; noteId: string }> },
) {
  const { id, noteId } = await params;
  const body = (await request.json().catch(() => null)) as {
    participantId?: unknown;
    columnId?: unknown;
    groupId?: unknown;
  } | null;
  const participantId =
    typeof body?.participantId === "string" ? body.participantId : "";
  const columnId =
    typeof body?.columnId === "string" ? body.columnId : undefined;
  let groupId: string | null | undefined;
  if (body && "groupId" in body) {
    const raw = body.groupId;
    if (raw === null) groupId = null;
    else if (typeof raw === "string") groupId = raw;
    else
      return NextResponse.json({ error: "invalid-groupId" }, { status: 400 });
  }

  const result = moveNote(id, participantId, noteId, { columnId, groupId });
  if (!result) {
    return NextResponse.json({ error: "could-not-move" }, { status: 400 });
  }

  const { session, note, orphanedNoteIds } = result;
  broadcast(id, (forParticipantId) => ({
    type: "note-moved",
    note: snapshotNote(session, note, forParticipantId),
  }));
  for (const orphanedId of orphanedNoteIds) {
    const orphan = session.notes.get(orphanedId);
    if (!orphan) continue;
    broadcast(id, (forParticipantId) => ({
      type: "note-moved",
      note: snapshotNote(session, orphan, forParticipantId),
    }));
  }
  return NextResponse.json({ ok: true });
}
