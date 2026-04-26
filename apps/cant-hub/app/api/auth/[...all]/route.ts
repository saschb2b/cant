import { getAuth } from "../../../../lib/auth";
import { toNextJsHandler } from "better-auth/next-js";

let _handlers: ReturnType<typeof toNextJsHandler> | undefined;
function handlers() {
  return (_handlers ??= toNextJsHandler(getAuth().handler));
}

export async function GET(req: Request) {
  return handlers().GET(req);
}

export async function POST(req: Request) {
  return handlers().POST(req);
}
