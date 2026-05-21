import { NextResponse } from "next/server";
import { broadcast } from "@/lib/retro/broadcaster";
import {
  deleteAction,
  editAction,
  snapshotActionItem,
} from "@/lib/retro/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string; actionId: string }> },
) {
  const { id, actionId } = await params;
  const body = (await request.json().catch(() => null)) as {
    text?: unknown;
    owner?: unknown;
  } | null;
  const text = typeof body?.text === "string" ? body.text : "";
  const owner = typeof body?.owner === "string" ? body.owner : "";

  const result = editAction(id, actionId, text, owner);
  if (!result) {
    return NextResponse.json({ error: "could-not-edit" }, { status: 400 });
  }
  broadcast(id, {
    type: "action-edited",
    action: snapshotActionItem(result.session, result.action),
  });
  return NextResponse.json({ ok: true });
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string; actionId: string }> },
) {
  const { id, actionId } = await params;
  const result = deleteAction(id, actionId);
  if (!result) {
    return NextResponse.json({ error: "could-not-delete" }, { status: 400 });
  }
  broadcast(id, { type: "action-deleted", actionId: result.action.id });
  return NextResponse.json({ ok: true });
}
