import { NextResponse } from "next/server";
import { broadcast } from "@/lib/retro/broadcaster";
import { joinSession, snapshotParticipant } from "@/lib/retro/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const body = (await request.json().catch(() => null)) as {
    name?: unknown;
    participantId?: unknown;
  } | null;
  const name = typeof body?.name === "string" ? body.name : "";
  const participantId =
    typeof body?.participantId === "string" ? body.participantId : undefined;

  const result = joinSession(id, name, participantId);
  if (!result) {
    return NextResponse.json({ error: "session-not-found" }, { status: 404 });
  }

  if (result.created) {
    broadcast(id, {
      type: "participant-joined",
      participant: snapshotParticipant(result.session, result.participant),
    });
  }

  return NextResponse.json({
    participantId: result.participant.id,
  });
}
