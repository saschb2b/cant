import type { BaseChallenge } from "../../game/types";

export const errorHandlingChallenges: BaseChallenge[] = [
  {
    id: "err-001",
    category: "error-handling",
    difficulty: "easy",
    title: "Error response format",
    prompt:
      "Which error response format is easier for clients to handle programmatically?",
    content: {
      type: "code",

      left: `// Simple error response
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    error: err.message,
  });
});`,

      right: `// RFC 7807 Problem Details
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    type: "https://api.example.com/errors/validation",
    title: "Validation Error",
    status: err.status,
    detail: err.message,
    instance: req.originalUrl,
  });
});`,
    },

    correctSide: "right",
    explanationCorrect:
      "RFC 7807 Problem Details provides a standardized error format with well-defined fields like type, title, status, detail, and instance. Clients can parse errors consistently across different APIs without guessing the shape of the response body.",
    explanationWrong:
      "Ad-hoc error objects with a single message string give clients no structured way to distinguish error types, map them to UI states, or build reliable retry logic. Every API ends up inventing its own format, forcing clients to write custom parsing for each one.",
    sourceUrl: "https://www.rfc-editor.org/rfc/rfc7807",
    sourceLabel: "RFC 7807: Problem Details for HTTP APIs",
  },
  {
    id: "err-002",
    category: "error-handling",
    difficulty: "easy",
    title: "Validation status codes",
    prompt: "Which status code should a server return for invalid user input?",
    content: {
      type: "code",

      left: `// Return 400 for validation errors
app.post("/users", (req, res) => {
  const errors = validate(req.body);
  if (errors.length > 0) {
    return res.status(400).json({
      title: "Validation Error",
      errors,
    });
  }
  // ... create user
});`,

      right: `// Return 500 for validation errors
app.post("/users", (req, res) => {
  const errors = validate(req.body);
  if (errors.length > 0) {
    return res.status(500).json({
      title: "Server Error",
      errors,
    });
  }
  // ... create user
});`,
    },

    correctSide: "left",
    explanationCorrect:
      "400 Bad Request tells the client that the problem is with its input, not the server. This distinction matters because clients know they should fix the request before retrying. Monitoring systems also rely on 4xx vs 5xx to separate client mistakes from server failures.",
    explanationWrong:
      "Using 500 Internal Server Error for validation failures conflates client mistakes with actual server bugs. Alerting systems will fire false alarms, retry logic will pointlessly retry requests that can never succeed, and clients have no signal that they need to fix their input.",
    sourceUrl:
      "https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status/400",
    sourceLabel: "MDN: 400 Bad Request",
  },
  {
    id: "err-003",
    category: "error-handling",
    difficulty: "easy",
    title: "Error messages and internal details",
    prompt:
      "Which error response is safer to return to external API consumers?",
    content: {
      type: "code",

      left: `// Full error details in response
app.use((err, req, res, next) => {
  res.status(500).json({
    message: err.message,
    stack: err.stack,
    query: err.sql,
    host: process.env.DB_HOST,
  });
});`,

      right: `// Generic error with trace ID
app.use((err, req, res, next) => {
  console.error(err); // log full details
  res.status(500).json({
    title: "Internal Server Error",
    detail: "Something went wrong. Please try again.",
    traceId: req.id,
  });
});`,
    },

    correctSide: "right",
    explanationCorrect:
      "Safe error responses hide implementation details (stack traces, SQL queries, hostnames) while providing a trace ID so support teams can look up the full error in server logs. This prevents attackers from gathering information about your infrastructure.",
    explanationWrong:
      "Exposing stack traces, SQL statements, and database hostnames in API responses is a security vulnerability. Attackers can use this information to map your infrastructure, identify vulnerable dependencies, and craft targeted attacks against your database.",
    sourceUrl:
      "https://cheatsheetseries.owasp.org/cheatsheets/Error_Handling_Cheat_Sheet.html",
    sourceLabel: "OWASP: Error Handling Cheat Sheet",
  },
  {
    id: "err-004",
    category: "error-handling",
    difficulty: "medium",
    title: "Retry strategy for POST requests",
    prompt: "Which approach safely handles retrying a failed payment request?",
    content: {
      type: "code",

      left: `// Retry without idempotency
async function charge(amount: number) {
  for (let i = 0; i < 3; i++) {
    try {
      return await fetch("/api/charge", {
        method: "POST",
        body: JSON.stringify({ amount }),
      });
    } catch {
      await delay(1000 * 2 ** i);
    }
  }
}`,

      right: `// Retry with idempotency key
async function charge(amount: number) {
  const key = crypto.randomUUID();
  for (let i = 0; i < 3; i++) {
    try {
      return await fetch("/api/charge", {
        method: "POST",
        headers: { "Idempotency-Key": key },
        body: JSON.stringify({ amount }),
      });
    } catch {
      await delay(1000 * 2 ** i);
    }
  }
}`,
    },

    correctSide: "right",
    explanationCorrect:
      "An idempotency key generated once before the retry loop ensures the server processes the payment exactly once, even if the client sends multiple requests. The server checks the key and returns the original response for duplicate requests instead of charging again.",
    explanationWrong:
      "Retrying a POST request without an idempotency key risks duplicate side effects. If the first request succeeded but the response was lost due to a network error, the retry will create a second charge. For financial operations this can mean double-billing a customer.",
    sourceUrl: "https://datatracker.ietf.org/doc/rfc9110/",
    sourceLabel: "RFC 9110: HTTP Semantics (Idempotent Methods)",
  },
  {
    id: "err-005",
    category: "error-handling",
    difficulty: "medium",
    title: "Timeout handling",
    prompt:
      "Which client-side approach handles slow API responses more reliably?",
    content: {
      type: "code",

      left: `// Race with a timeout promise
async function fetchData(url: string) {
  const timeout = new Promise((_, reject) =>
    setTimeout(() => reject(new Error("Timeout")), 5000)
  );
  const res = await Promise.race([
    fetch(url),
    timeout,
  ]);
  return res.json();
}`,

      right: `// AbortController with signal
async function fetchData(url: string) {
  const controller = new AbortController();
  const id = setTimeout(
    () => controller.abort(), 5000
  );
  try {
    const res = await fetch(url, {
      signal: controller.signal,
    });
    return await res.json();
  } finally {
    clearTimeout(id);
  }
}`,
    },

    correctSide: "right",
    explanationCorrect:
      "AbortController actually cancels the underlying HTTP request when the timeout fires. The browser tears down the TCP connection and frees resources immediately. The finally block cleans up the timer if the fetch completes before the timeout.",
    explanationWrong:
      "Promise.race resolves the outer promise on timeout, but the fetch request keeps running in the background. The connection stays open, the response body is still being downloaded, and the callback will eventually resolve with no one listening. This wastes bandwidth and can cause memory leaks.",
    sourceUrl:
      "https://developer.mozilla.org/en-US/docs/Web/API/AbortController",
    sourceLabel: "MDN: AbortController",
  },
  {
    id: "err-006",
    category: "error-handling",
    difficulty: "medium",
    title: "Downstream failure handling",
    prompt:
      "Which approach better handles a repeatedly failing downstream service?",
    content: {
      type: "code",

      left: `// Direct service call
async function getPrice(id: string) {
  try {
    const res = await fetch(
      \`\${PRICING_API}/items/\${id}\`
    );
    return await res.json();
  } catch {
    return { price: null, source: "error" };
  }
}`,

      right: `// Service call with state tracking
const breaker = new CircuitBreaker({
  threshold: 5,
  resetTimeout: 30_000,
});

async function getPrice(id: string) {
  if (breaker.isOpen()) {
    return { price: null, source: "cache" };
  }
  try {
    const res = await fetch(
      \`\${PRICING_API}/items/\${id}\`
    );
    breaker.recordSuccess();
    return await res.json();
  } catch {
    breaker.recordFailure();
    return { price: null, source: "fallback" };
  }
}`,
    },

    correctSide: "right",
    explanationCorrect:
      "A circuit breaker stops sending requests to a service that has failed repeatedly. After a threshold of failures, the circuit opens and subsequent calls return a fallback immediately. This prevents cascading failures, reduces latency for users, and gives the downstream service time to recover.",
    explanationWrong:
      "Calling a failing service on every request wastes time waiting for inevitable timeouts. If the service is down, every request adds load to an already struggling system, increases response times for your users, and can cause cascading failures across your infrastructure.",
    sourceUrl:
      "https://learn.microsoft.com/en-us/azure/architecture/patterns/circuit-breaker",
    sourceLabel: "Azure: Circuit Breaker Pattern",
  },
  {
    id: "err-007",
    category: "error-handling",
    difficulty: "hard",
    title: "Bulk operation partial failure",
    prompt:
      "Which response format better communicates partial failures in a bulk API?",
    content: {
      type: "code",

      left: `// All-or-nothing bulk response
app.post("/api/users/bulk", async (req, res) => {
  try {
    const users = await Promise.all(
      req.body.users.map(createUser)
    );
    res.status(201).json({ users });
  } catch (err) {
    res.status(500).json({
      error: "Bulk operation failed",
    });
  }
});`,

      right: `// Per-item status in bulk response
app.post("/api/users/bulk", async (req, res) => {
  const results = await Promise.allSettled(
    req.body.users.map(createUser)
  );
  const response = results.map((r, i) => ({
    index: i,
    status: r.status === "fulfilled"
      ? "created" : "failed",
    data: r.status === "fulfilled"
      ? r.value : undefined,
    error: r.status === "rejected"
      ? r.reason.message : undefined,
  }));
  const allOk = response.every(
    r => r.status === "created"
  );
  res.status(allOk ? 201 : 207).json(response);
});`,
    },

    correctSide: "right",
    explanationCorrect:
      "Promise.allSettled processes every item regardless of individual failures, and the response includes per-item status. HTTP 207 Multi-Status signals that the response contains mixed results. Clients can identify which items succeeded and retry only the failures.",
    explanationWrong:
      "Promise.all rejects on the first failure and discards all results, including items that succeeded. The client has no way to know which items were created and which were not. Re-submitting the entire batch risks duplicating the items that already succeeded.",
    sourceUrl:
      "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/allSettled",
    sourceLabel: "MDN: Promise.allSettled()",
  },
  {
    id: "err-008",
    category: "error-handling",
    difficulty: "hard",
    title: "Rate limit exceeded response",
    prompt: "Which rate-limit response helps clients recover more effectively?",
    content: {
      type: "code",

      left: `// Basic 429 response
app.use(rateLimiter({
  max: 100,
  handler: (req, res) => {
    res.status(429).json({
      error: "Too many requests",
    });
  },
}));`,

      right: `// 429 with headers
app.use(rateLimiter({
  max: 100,
  handler: (req, res) => {
    res.set({
      "Retry-After": "30",
      "X-RateLimit-Limit": "100",
      "X-RateLimit-Remaining": "0",
      "X-RateLimit-Reset": String(
        Math.ceil(Date.now() / 1000) + 30
      ),
    });
    res.status(429).json({
      title: "Rate Limit Exceeded",
      detail: "Try again in 30 seconds.",
      retryAfter: 30,
    });
  },
}));`,
    },

    correctSide: "right",
    explanationCorrect:
      "Including the Retry-After header and rate limit metadata (limit, remaining, reset) lets clients implement smart backoff automatically. Well-behaved clients read these headers to schedule their next request precisely, reducing unnecessary retries and server load.",
    explanationWrong:
      "A bare 429 response without Retry-After or rate limit headers forces clients to guess when they can retry. Most will use aggressive exponential backoff or fixed intervals, leading to either thundering herd problems when all clients retry simultaneously or unnecessarily long delays.",
    sourceUrl:
      "https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status/429",
    sourceLabel: "MDN: 429 Too Many Requests",
  },
  {
    id: "err-009",
    category: "error-handling",
    difficulty: "hard",
    title: "Retry backoff strategy",
    prompt:
      "Which retry strategy behaves better when many clients fail at the same time?",
    content: {
      type: "code",

      left: `async function fetchWithRetry(url: string) {
  for (let attempt = 0; attempt < 5; attempt++) {
    try {
      return await fetch(url);
    } catch {
      const delay = 1000 * 2 ** attempt;
      await new Promise((r) => setTimeout(r, delay));
    }
  }
  throw new Error("All retries failed");
}`,

      right: `async function fetchWithRetry(url: string) {
  for (let attempt = 0; attempt < 5; attempt++) {
    try {
      return await fetch(url);
    } catch {
      const base = 1000 * 2 ** attempt;
      const jitter = Math.random() * base;
      await new Promise((r) => setTimeout(r, jitter));
    }
  }
  throw new Error("All retries failed");
}`,
    },

    correctSide: "right",
    explanationCorrect:
      "Adding random jitter spreads retry attempts across time. When a server goes down and 1,000 clients all start retrying, pure exponential backoff makes them all retry at exactly the same intervals (1s, 2s, 4s), creating repeated traffic spikes. Jitter randomizes the timing so retries arrive gradually, giving the server a smooth recovery window instead of repeated bursts.",
    explanationWrong:
      "Pure exponential backoff without jitter causes a thundering herd problem. All clients that failed at the same moment will retry at the same moment (after 1s, then 2s, then 4s). Each synchronized retry wave can re-overwhelm the recovering server, potentially causing a cycle of failures that takes much longer to resolve.",
    sourceUrl:
      "https://aws.amazon.com/blogs/architecture/exponential-backoff-and-jitter/",
    sourceLabel: "AWS: Exponential Backoff and Jitter",
  },
];
