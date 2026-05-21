import { NextResponse } from "next/server";
import { broadcast } from "@/lib/retro/broadcaster";
import { deleteNote, editNote, snapshotNote } from "@/lib/retro/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string; noteId: string }> },
) {
  const { id, noteId } = await params;
  const body = (await request.json().catch(() => null)) as {
    participantId?: unknown;
    text?: unknown;
  } | null;
  const participantId =
    typeof body?.participantId === "string" ? body.participantId : "";
  const text = typeof body?.text === "string" ? body.text : "";

  const result = editNote(id, participantId, noteId, text);
  if (!result) {
    return NextResponse.json({ error: "could-not-edit" }, { status: 400 });
  }
  const { session, note } = result;
  broadcast(id, (forParticipantId) => ({
    type: "note-edited",
    note: snapshotNote(session, note, forParticipantId),
  }));
  return NextResponse.json({ ok: true });
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string; noteId: string }> },
) {
  const { id, noteId } = await params;
  const url = new URL(request.url);
  const participantId = url.searchParams.get("participantId") ?? "";

  const result = deleteNote(id, participantId, noteId);
  if (!result) {
    return NextResponse.json({ error: "could-not-delete" }, { status: 400 });
  }
  broadcast(id, {
    type: "note-deleted",
    noteId: result.note.id,
    columnId: result.note.columnId,
    authorId: result.note.authorId,
  });
  for (const orphanedId of result.orphanedNoteIds) {
    const orphan = result.session.notes.get(orphanedId);
    if (!orphan) continue;
    broadcast(id, (forParticipantId) => ({
      type: "note-moved",
      note: snapshotNote(result.session, orphan, forParticipantId),
    }));
  }
  return NextResponse.json({ ok: true });
}
