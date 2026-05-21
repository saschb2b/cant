import { broadcast, subscribe } from "@/lib/retro/broadcaster";
import type { RetroEvent } from "@/lib/retro/events";
import {
  getSession,
  isStillDisconnected,
  leaveSession,
  markConnected,
  markDisconnected,
  snapshotSession,
} from "@/lib/retro/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const KEEPALIVE_MS = 20_000;
const DISCONNECT_GRACE_MS = 10_000;

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const url = new URL(request.url);
  const participantId = url.searchParams.get("participantId") ?? "";
  const session = getSession(id);
  if (!session?.participants.has(participantId)) {
    return new Response("session or participant not found", { status: 404 });
  }

  const encoder = new TextEncoder();
  let unsubscribe: (() => void) | null = null;
  let keepalive: ReturnType<typeof setInterval> | null = null;
  let closed = false;

  const stream = new ReadableStream<Uint8Array>({
    start(controller) {
      function write(chunk: string) {
        if (closed) return;
        try {
          controller.enqueue(encoder.encode(chunk));
        } catch {
          closed = true;
        }
      }
      function send(event: RetroEvent) {
        write(`data: ${JSON.stringify(event)}\n\n`);
      }

      markConnected(id, participantId);

      const initial = snapshotSession(session, participantId);
      send({ type: "snapshot", session: initial });

      unsubscribe = subscribe(id, participantId, send);
      keepalive = setInterval(() => {
        write(`: keepalive\n\n`);
      }, KEEPALIVE_MS);

      function teardown() {
        if (closed) return;
        closed = true;
        if (keepalive) clearInterval(keepalive);
        if (unsubscribe) unsubscribe();
        markDisconnected(id, participantId);
        setTimeout(() => {
          if (isStillDisconnected(id, participantId, DISCONNECT_GRACE_MS)) {
            const result = leaveSession(id, participantId);
            if (result.removed) {
              broadcast(id, { type: "participant-left", participantId });
              if (result.newHostId !== null) {
                broadcast(id, {
                  type: "host-changed",
                  hostId: result.newHostId,
                });
              }
            }
          }
        }, DISCONNECT_GRACE_MS);
        try {
          controller.close();
        } catch {
          // already closed
        }
      }

      request.signal.addEventListener("abort", teardown);
    },
    cancel() {
      if (closed) return;
      closed = true;
      if (keepalive) clearInterval(keepalive);
      if (unsubscribe) unsubscribe();
      markDisconnected(id, participantId);
      setTimeout(() => {
        if (isStillDisconnected(id, participantId, DISCONNECT_GRACE_MS)) {
          const result = leaveSession(id, participantId);
          if (result.removed) {
            broadcast(id, { type: "participant-left", participantId });
            if (result.newHostId !== null) {
              broadcast(id, {
                type: "host-changed",
                hostId: result.newHostId,
              });
            }
          }
        }
      }, DISCONNECT_GRACE_MS);
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}
