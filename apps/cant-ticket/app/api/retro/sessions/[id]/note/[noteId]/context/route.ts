import { NextResponse } from "next/server";
import { broadcast } from "@/lib/retro/broadcaster";
import { addContext, snapshotContextEntry } from "@/lib/retro/store";

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

  const result = addContext(id, participantId, noteId, text);
  if (!result) {
    return NextResponse.json({ error: "cannot-add-context" }, { status: 400 });
  }
  broadcast(id, {
    type: "context-added",
    noteId: result.noteId,
    context: snapshotContextEntry(result.session, result.entry),
  });
  return NextResponse.json({ ok: true });
}
