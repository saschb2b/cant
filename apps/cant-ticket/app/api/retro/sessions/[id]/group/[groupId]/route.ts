import { NextResponse } from "next/server";
import { broadcast } from "@/lib/retro/broadcaster";
import { snapshotNote, ungroupGroup } from "@/lib/retro/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string; groupId: string }> },
) {
  const { id, groupId } = await params;
  const url = new URL(request.url);
  const participantId = url.searchParams.get("participantId") ?? "";

  const result = ungroupGroup(id, participantId, groupId);
  if (!result) {
    return NextResponse.json({ error: "could-not-ungroup" }, { status: 400 });
  }
  const { session, notes } = result;
  for (const note of notes) {
    broadcast(id, (forParticipantId) => ({
      type: "note-moved",
      note: snapshotNote(session, note, forParticipantId),
    }));
  }
  return NextResponse.json({ ok: true });
}
