import { NextResponse } from "next/server";
import { broadcast } from "@/lib/retro/broadcaster";
import { leaveSession } from "@/lib/retro/store";

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
  if (!participantId) {
    return NextResponse.json({ error: "missing-participant" }, { status: 400 });
  }
  const result = leaveSession(id, participantId);
  if (result.removed) {
    broadcast(id, { type: "participant-left", participantId });
    if (result.newHostId !== null) {
      broadcast(id, { type: "host-changed", hostId: result.newHostId });
    }
  }
  return NextResponse.json({ ok: true });
}
