import { NextResponse } from "next/server";
import { broadcast } from "@/lib/retro/broadcaster";
import { castVote } from "@/lib/retro/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const body = (await request.json().catch(() => null)) as {
    participantId?: unknown;
    targetKey?: unknown;
    action?: unknown;
  } | null;
  const participantId =
    typeof body?.participantId === "string" ? body.participantId : "";
  const targetKey = typeof body?.targetKey === "string" ? body.targetKey : "";
  const action = body?.action === "remove" ? "remove" : "add";

  const result = castVote(id, participantId, targetKey, action);
  if (!result) {
    return NextResponse.json({ error: "vote-rejected" }, { status: 400 });
  }
  const { targetKey: key, isVoter } = result;
  // Only each recipient's own vote state is broadcast; the aggregate count is
  // deliberately withheld until voting closes (see the results transition).
  broadcast(id, (forParticipantId) => ({
    type: "vote-changed",
    targetKey: key,
    voted: isVoter(forParticipantId),
  }));
  return NextResponse.json({ ok: true });
}
