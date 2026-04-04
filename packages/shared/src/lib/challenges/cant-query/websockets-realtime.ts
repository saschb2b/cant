import type { BaseChallenge } from "../../game/types";

export const websocketsRealtimeChallenges: BaseChallenge[] = [
  {
    id: "ws-001",
    category: "websockets-realtime",
    difficulty: "easy",
    title: "WebSocket vs SSE for one-way updates",
    prompt:
      "Which approach is better for streaming server-sent stock prices to a dashboard?",
    content: {
      type: "code",

      left: `// WebSocket approach
const ws = new WebSocket("wss://api.example.com/prices");

ws.onopen = () => {
  console.log("Connected");
};

ws.onmessage = (event) => {
  const price = JSON.parse(event.data);
  updateDashboard(price);
};`,

      right: `// EventSource approach
const source = new EventSource("/api/prices");

source.addEventListener("price-update", (event) => {
  const price = JSON.parse(event.data);
  updateDashboard(price);
});

source.onerror = () => {
  console.log("Reconnecting automatically...");
};`,
    },

    correctSide: "right",
    explanationCorrect:
      "Server-Sent Events (SSE) are purpose-built for one-way server-to-client streaming. They use a simple HTTP connection, support automatic reconnection, work with HTTP/2 multiplexing, and are easier to load-balance. For read-only data streams like stock prices, SSE is the simpler and more efficient choice.",
    explanationWrong:
      "WebSockets provide full-duplex communication, which is unnecessary overhead when the client only needs to receive data. They require a custom protocol upgrade, manual reconnection logic, and are harder to scale behind load balancers compared to SSE for one-way streams.",
    sourceUrl:
      "https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events/Using_server-sent_events",
    sourceLabel: "MDN: Using Server-Sent Events",
  },
  {
    id: "ws-002",
    category: "websockets-realtime",
    difficulty: "easy",
    title: "WebSocket vs polling for real-time chat",
    prompt: "Which approach is better for a real-time chat application?",
    content: {
      type: "code",

      left: `// Polling for new messages
async function pollMessages() {
  while (true) {
    const res = await fetch("/api/messages?since=" + lastId);
    const msgs = await res.json();
    msgs.forEach(renderMessage);
    lastId = msgs.at(-1)?.id ?? lastId;
    await new Promise((r) => setTimeout(r, 2000));
  }
}
pollMessages();`,

      right: `// WebSocket approach
const ws = new WebSocket("wss://chat.example.com");

ws.onmessage = (event) => {
  const msg = JSON.parse(event.data);
  renderMessage(msg);
};

function sendMessage(text: string) {
  ws.send(JSON.stringify({ type: "message", text }));
}`,
    },

    correctSide: "right",
    explanationCorrect:
      "WebSockets maintain a persistent connection that delivers messages instantly in both directions. This eliminates the latency of polling intervals, reduces unnecessary network requests, and enables true real-time interaction between chat participants.",
    explanationWrong:
      "Polling creates a 2-second delay between messages, wastes bandwidth with empty responses when no new messages exist, and puts unnecessary load on the server. For bidirectional real-time features like chat, polling is both slower and more resource-intensive than WebSockets.",
    sourceUrl:
      "https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API",
    sourceLabel: "MDN: WebSockets API",
  },
  {
    id: "ws-003",
    category: "websockets-realtime",
    difficulty: "easy",
    title: "Connection lifecycle handling",
    prompt: "Which WebSocket setup handles the connection lifecycle correctly?",
    content: {
      type: "code",

      left: `const ws = new WebSocket("wss://api.example.com");

ws.onopen = () => {
  console.log("Connected");
  ws.send(JSON.stringify({ type: "subscribe", channel: "feed" }));
};

ws.onclose = (event) => {
  console.log("Closed:", event.code, event.reason);
};

window.addEventListener("beforeunload", () => {
  ws.close(1000, "Page closed");
});`,

      right: `const ws = new WebSocket("wss://api.example.com");

ws.send(JSON.stringify({ type: "subscribe", channel: "feed" }));`,
    },

    correctSide: "left",
    explanationCorrect:
      "Waiting for the `onopen` event before sending messages ensures the connection is established. Listening to `onclose` lets you respond to disconnections. Calling `ws.close(1000)` on page unload sends a clean close frame with the normal closure status code, allowing the server to free resources gracefully.",
    explanationWrong:
      "Calling `ws.send()` before the connection is open throws an error because the WebSocket is still in the CONNECTING state. Ignoring the close event means you have no way to detect disconnections. Without an explicit close on page unload, the server may not receive a clean close frame and will keep the connection alive until a timeout.",
    sourceUrl:
      "https://developer.mozilla.org/en-US/docs/Web/API/WebSocket/readyState",
    sourceLabel: "MDN: WebSocket readyState",
  },
  {
    id: "ws-004",
    category: "websockets-realtime",
    difficulty: "medium",
    title: "Reconnection strategy",
    prompt: "Which reconnection strategy is more resilient?",
    content: {
      type: "code",

      left: `function connect() {
  const ws = new WebSocket("wss://api.example.com");

  ws.onclose = () => {
    // Reconnect on close
    connect();
  };

  ws.onerror = () => {
    ws.close();
  };
}
connect();`,

      right: `let attempt = 0;

function connect() {
  const ws = new WebSocket("wss://api.example.com");

  ws.onopen = () => { attempt = 0; };

  ws.onclose = () => {
    const delay = Math.min(1000 * 2 ** attempt, 30000);
    attempt++;
    setTimeout(connect, delay);
  };

  ws.onerror = () => { ws.close(); };
}
connect();`,
    },

    correctSide: "right",
    explanationCorrect:
      "Exponential backoff (1s, 2s, 4s, 8s, capped at 30s) prevents overwhelming the server with reconnection attempts during outages. Resetting the attempt counter on successful open ensures fast reconnection after brief disconnects. This pattern is standard practice in production WebSocket clients.",
    explanationWrong:
      "Reconnecting immediately without any delay creates a tight loop during server outages. Hundreds or thousands of clients hammering the server with connection attempts can cause a thundering herd problem, making recovery even harder and potentially triggering rate limits or IP bans.",
    sourceUrl: "https://web.dev/articles/websocket#exponential_backoff",
    sourceLabel: "web.dev: WebSocket best practices",
  },
  {
    id: "ws-005",
    category: "websockets-realtime",
    difficulty: "medium",
    title: "Message format design",
    prompt: "Which message format is easier to extend and debug?",
    content: {
      type: "code",

      left: `// JSON message protocol
type WsMessage =
  | { type: "chat"; text: string; userId: string }
  | { type: "typing"; userId: string }
  | { type: "presence"; userId: string; online: boolean };

ws.onmessage = (event) => {
  const msg: WsMessage = JSON.parse(event.data);
  switch (msg.type) {
    case "chat": renderChat(msg); break;
    case "typing": showTyping(msg.userId); break;
    case "presence": updatePresence(msg); break;
  }
};`,

      right: `// Delimited string protocol
ws.onmessage = (event) => {
  const parts = event.data.split("|");
  // parts[0] = action, parts[1] = user, parts[2] = payload
  if (parts[0] === "c") {
    renderChat({ text: parts[2], userId: parts[1] });
  } else if (parts[0] === "t") {
    showTyping(parts[1]);
  } else if (parts[0] === "p") {
    updatePresence({ userId: parts[1], online: parts[2] === "1" });
  }
};`,
    },

    correctSide: "left",
    explanationCorrect:
      "A typed JSON message protocol with discriminated unions makes messages self-describing and easy to extend. Adding new message types does not break existing handlers. TypeScript can enforce exhaustive handling, and the messages are human-readable in browser dev tools for easier debugging.",
    explanationWrong:
      "Pipe-delimited strings with single-character codes are fragile and hard to debug. Adding a new field can shift positions and break parsing. The format cannot represent nested data, requires documentation to understand, and provides no type safety. The minor bandwidth savings rarely justify the maintenance cost.",
    sourceUrl:
      "https://www.typescriptlang.org/docs/handbook/2/narrowing.html#discriminated-unions",
    sourceLabel: "TypeScript: Discriminated Unions",
  },
  {
    id: "ws-006",
    category: "websockets-realtime",
    difficulty: "medium",
    title: "Connection liveness detection",
    prompt: "Which approach properly detects stale WebSocket connections?",
    content: {
      type: "code",

      right: `const ws = new WebSocket("wss://api.example.com");
let pingTimer: ReturnType<typeof setInterval>;
let alive = true;

ws.onopen = () => {
  pingTimer = setInterval(() => {
    if (!alive) { ws.close(); return; }
    alive = false;
    ws.send(JSON.stringify({ type: "ping" }));
  }, 30000);
};

ws.onmessage = (event) => {
  const msg = JSON.parse(event.data);
  if (msg.type === "pong") { alive = true; return; }
  handleMessage(msg);
};`,

      left: `const ws = new WebSocket("wss://api.example.com");
// Rely on TCP keepalive and browser defaults

ws.onmessage = (event) => {
  handleMessage(JSON.parse(event.data));
};

`,
    },

    correctSide: "right",
    explanationCorrect:
      "Application-level ping/pong heartbeats detect dead connections that TCP keepalive might miss, such as connections dropped by intermediate proxies, NAT timeouts, or mobile network switches. If no pong arrives within the next interval, the client knows the connection is stale and can reconnect.",
    explanationWrong:
      "Relying on TCP keepalive alone is unreliable for WebSocket connections. Proxies, load balancers, and firewalls often terminate idle connections after 60 to 120 seconds without notifying either endpoint. Without application-level heartbeats, the client may believe it is connected while messages are silently lost.",
    sourceUrl: "https://www.rfc-editor.org/rfc/rfc6455#section-5.5.2",
    sourceLabel: "RFC 6455: Ping/Pong Frames",
  },
  {
    id: "ws-007",
    category: "websockets-realtime",
    difficulty: "hard",
    title: "Message routing",
    prompt: "Which server-side message routing is more scalable?",
    content: {
      type: "code",

      left: `// Broadcast to all clients
wss.on("connection", (ws) => {
  ws.on("message", (data) => {
    const msg = JSON.parse(data);
    // Send to every connected client
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(data);
      }
    });
  });
});`,

      right: `// Room-based messaging
const rooms = new Map<string, Set<WebSocket>>();

wss.on("connection", (ws) => {
  ws.on("message", (data) => {
    const msg = JSON.parse(data);
    if (msg.type === "join") {
      if (!rooms.has(msg.room)) rooms.set(msg.room, new Set());
      rooms.get(msg.room)!.add(ws);
    } else {
      const room = rooms.get(msg.room);
      room?.forEach((client) => {
        if (client !== ws && client.readyState === WebSocket.OPEN)
          client.send(data);
      });
    }
  });
});`,
    },

    correctSide: "right",
    explanationCorrect:
      "Room-based routing sends messages only to clients who have subscribed to a specific channel or room. This reduces bandwidth usage dramatically, prevents users from receiving irrelevant messages, and scales much better as the number of concurrent connections grows. It also provides a natural boundary for authorization checks.",
    explanationWrong:
      "Broadcasting every message to every client wastes bandwidth and CPU on both the server and client side. Users receive messages they do not care about, creating unnecessary JSON parsing overhead. With 10,000 clients, a single message triggers 10,000 sends instead of just the relevant subset.",
    sourceUrl:
      "https://developer.mozilla.org/en-US/docs/Web/API/WebSocket/readyState",
    sourceLabel: "MDN: WebSocket readyState",
  },
  {
    id: "ws-008",
    category: "websockets-realtime",
    difficulty: "hard",
    title: "Error handling approach",
    prompt: "Which approach handles WebSocket errors more robustly?",
    content: {
      type: "code",

      left: `const ws = new WebSocket("wss://api.example.com");

ws.onerror = (err) => {
  console.error("WebSocket failed:", err);
  // Error always fires before close, so just log here
};

ws.onclose = (event) => {
  if (event.code !== 1000) {
    console.warn("Abnormal close:", event.code, event.reason);
    scheduleReconnect();
  }
};

ws.onmessage = (event) => {
  try {
    const msg = JSON.parse(event.data);
    handleMessage(msg);
  } catch {
    console.warn("Invalid JSON received, ignoring");
  }
};`,

      right: `const ws = new WebSocket("wss://api.example.com");

ws.onerror = () => {
  // Just reconnect on any error
  ws.close();
  new WebSocket("wss://api.example.com");
};

ws.onmessage = (event) => {
  const msg = JSON.parse(event.data);
  handleMessage(msg);
};`,
    },

    correctSide: "left",
    explanationCorrect:
      "Proper error handling separates the error and close events, inspects close codes to distinguish normal disconnections from failures, and wraps message parsing in try/catch to handle malformed data. Reconnection logic belongs in the close handler because the error event always fires before close, and creating a new connection requires proper backoff scheduling.",
    explanationWrong:
      "Creating a new WebSocket directly in the error handler ignores the close event that always follows, leading to potential duplicate connections. Unguarded JSON.parse will throw on malformed messages and crash the handler. Without checking the close code, you cannot distinguish between intentional disconnects and server failures.",
    sourceUrl:
      "https://developer.mozilla.org/en-US/docs/Web/API/WebSocket/close_event",
    sourceLabel: "MDN: WebSocket close event",
  },
];
