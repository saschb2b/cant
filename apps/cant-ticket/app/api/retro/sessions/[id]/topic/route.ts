import { NextResponse } from "next/server";
import { broadcast } from "@/lib/retro/broadcaster";
import { setTopic } from "@/lib/retro/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const body = (await request.json().catch(() => null)) as {
    topic?: unknown;
  } | null;
  const topic = typeof body?.topic === "string" ? body.topic : "";
  const session = setTopic(id, topic);
  if (!session) {
    return NextResponse.json({ error: "session-not-found" }, { status: 404 });
  }
  broadcast(id, { type: "topic", topic: session.topic });
  return NextResponse.json({ ok: true });
}
