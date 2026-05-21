import { NextResponse } from "next/server";
import { broadcast } from "@/lib/retro/broadcaster";
import { addAction, snapshotActionItem } from "@/lib/retro/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const body = (await request.json().catch(() => null)) as {
    participantId?: unknown;
    text?: unknown;
    owner?: unknown;
  } | null;
  const participantId =
    typeof body?.participantId === "string" ? body.participantId : "";
  const text = typeof body?.text === "string" ? body.text : "";
  const owner = typeof body?.owner === "string" ? body.owner : "";

  const result = addAction(id, participantId, text, owner);
  if (!result) {
    return NextResponse.json({ error: "could-not-add" }, { status: 400 });
  }

  const { session, action } = result;
  broadcast(id, {
    type: "action-added",
    action: snapshotActionItem(session, action),
  });

  return NextResponse.json({ actionId: action.id });
}
