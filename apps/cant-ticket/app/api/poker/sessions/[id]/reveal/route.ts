import { NextResponse } from "next/server";
import { broadcast } from "@/lib/poker/broadcaster";
import { revealSession, snapshotSession } from "@/lib/poker/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const session = revealSession(id);
  if (!session) {
    return NextResponse.json({ error: "not-found" }, { status: 404 });
  }
  broadcast(id, {
    type: "revealed",
    participants: snapshotSession(session).participants,
  });
  return NextResponse.json({ ok: true });
}
