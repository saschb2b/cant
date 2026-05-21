import { NextResponse } from "next/server";
import { broadcast } from "@/lib/retro/broadcaster";
import { transferHost } from "@/lib/retro/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const body = (await request.json().catch(() => null)) as {
    participantId?: unknown;
    toParticipantId?: unknown;
  } | null;
  const fromParticipantId =
    typeof body?.participantId === "string" ? body.participantId : "";
  const toParticipantId =
    typeof body?.toParticipantId === "string" ? body.toParticipantId : "";

  const session = transferHost(id, fromParticipantId, toParticipantId);
  if (!session) {
    return NextResponse.json(
      { error: "cannot-transfer-host" },
      { status: 400 },
    );
  }
  broadcast(id, { type: "host-changed", hostId: session.hostId });
  return NextResponse.json({ ok: true });
}
