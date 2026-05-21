import { NextResponse } from "next/server";
import { broadcast } from "@/lib/retro/broadcaster";
import { reorderGroup, snapshotNote } from "@/lib/retro/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string; groupId: string }> },
) {
  const { id, groupId } = await params;
  const body = (await request.json().catch(() => null)) as {
    participantId?: unknown;
    noteIds?: unknown;
  } | null;
  const participantId =
    typeof body?.participantId === "string" ? body.participantId : "";
  const rawIds = body?.noteIds;
  if (!Array.isArray(rawIds)) {
    return NextResponse.json({ error: "invalid-noteIds" }, { status: 400 });
  }
  const noteIds: string[] = [];
  for (const v of rawIds) {
    if (typeof v !== "string") {
      return NextResponse.json({ error: "invalid-noteIds" }, { status: 400 });
    }
    noteIds.push(v);
  }

  const result = reorderGroup(id, participantId, groupId, noteIds);
  if (!result) {
    return NextResponse.json({ error: "could-not-reorder" }, { status: 400 });
  }
  for (const note of result.notes) {
    broadcast(id, (forParticipantId) => ({
      type: "note-moved",
      note: snapshotNote(result.session, note, forParticipantId),
    }));
  }
  return NextResponse.json({ ok: true });
}
