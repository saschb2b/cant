import { NextResponse } from "next/server";
import { broadcast } from "@/lib/poker/broadcaster";
import { isVote } from "@/lib/poker/deck";
import { castVote } from "@/lib/poker/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const body = (await request.json().catch(() => null)) as {
    participantId?: unknown;
    vote?: unknown;
  } | null;
  const participantId =
    typeof body?.participantId === "string" ? body.participantId : "";
  const vote = body?.vote;
  if (!participantId || !isVote(vote)) {
    return NextResponse.json({ error: "bad-request" }, { status: 400 });
  }
  const session = castVote(id, participantId, vote);
  if (!session) {
    return NextResponse.json({ error: "not-found" }, { status: 404 });
  }
  broadcast(id, { type: "vote", participantId, hasVoted: true });
  return NextResponse.json({ ok: true });
}
