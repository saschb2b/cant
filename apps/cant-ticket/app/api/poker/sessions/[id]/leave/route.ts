import { NextResponse } from "next/server";
import { broadcast } from "@/lib/poker/broadcaster";
import { leaveSession } from "@/lib/poker/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

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
  const removed = leaveSession(id, participantId);
  if (removed) {
    broadcast(id, { type: "participant-left", participantId });
  }
  return NextResponse.json({ ok: true });
}
