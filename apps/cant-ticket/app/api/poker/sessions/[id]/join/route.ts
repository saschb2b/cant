import { NextResponse } from "next/server";
import { broadcast } from "@/lib/poker/broadcaster";
import { joinSession, snapshotParticipant } from "@/lib/poker/store";

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
    spectator?: unknown;
  } | null;
  const name = typeof body?.name === "string" ? body.name : "";
  const participantId =
    typeof body?.participantId === "string" ? body.participantId : undefined;
  const isSpectator =
    typeof body?.spectator === "boolean" ? body.spectator : undefined;

  const result = joinSession(id, name, participantId, { isSpectator });
  if (!result) {
    return NextResponse.json({ error: "session-not-found" }, { status: 404 });
  }
  const isNew = !participantId || participantId !== result.participant.id;
  if (isNew) {
    broadcast(id, {
      type: "participant-joined",
      participant: snapshotParticipant(result.participant),
    });
  } else if (typeof isSpectator === "boolean") {
    broadcast(id, {
      type: "participant-joined",
      participant: snapshotParticipant(result.participant),
    });
  }
  return NextResponse.json({
    participantId: result.participant.id,
    isSpectator: result.participant.isSpectator,
  });
}
