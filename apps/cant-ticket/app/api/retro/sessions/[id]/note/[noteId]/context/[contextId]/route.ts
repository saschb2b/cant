import { NextResponse } from "next/server";
import { broadcast } from "@/lib/retro/broadcaster";
import { deleteContext } from "@/lib/retro/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function DELETE(
  request: Request,
  {
    params,
  }: {
    params: Promise<{ id: string; noteId: string; contextId: string }>;
  },
) {
  const { id, noteId, contextId } = await params;
  const url = new URL(request.url);
  const participantId = url.searchParams.get("participantId") ?? "";

  const result = deleteContext(id, participantId, noteId, contextId);
  if (!result) {
    return NextResponse.json(
      { error: "cannot-delete-context" },
      { status: 400 },
    );
  }
  broadcast(id, {
    type: "context-deleted",
    noteId: result.noteId,
    contextId: result.contextId,
  });
  return NextResponse.json({ ok: true });
}
