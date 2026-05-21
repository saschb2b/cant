import { NextResponse } from "next/server";
import { broadcast } from "@/lib/retro/broadcaster";
import { addNote, snapshotNote } from "@/lib/retro/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const body = (await request.json().catch(() => null)) as {
    participantId?: unknown;
    columnId?: unknown;
    text?: unknown;
  } | null;
  const participantId =
    typeof body?.participantId === "string" ? body.participantId : "";
  const columnId = typeof body?.columnId === "string" ? body.columnId : "";
  const text = typeof body?.text === "string" ? body.text : "";

  const result = addNote(id, participantId, columnId, text);
  if (!result) {
    return NextResponse.json({ error: "could-not-add" }, { status: 400 });
  }

  const { session, note } = result;
  broadcast(id, (forParticipantId) => ({
    type: "note-added",
    note: snapshotNote(session, note, forParticipantId),
  }));

  return NextResponse.json({ noteId: note.id });
}
