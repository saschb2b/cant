import type { BaseChallenge } from "../../game/types";

export const asyncTestingChallenges: BaseChallenge[] = [
  {
    id: "async-001",
    category: "async-testing",
    difficulty: "easy",
    title: "Async test structure",
    prompt: "Which async test pattern is more reliable?",
    content: {
      type: "code",

      left: `// Testing an async user fetch
test("loads user data", async () => {
  const user = await fetchUser("u-42");

  expect(user).toEqual({
    id: "u-42",
    name: "Alice",
    role: "admin",
  });
});`,

      right: `// Testing an async user fetch
test("loads user data", (done) => {
  fetchUser("u-42").then((user) => {
    expect(user).toEqual({
      id: "u-42",
      name: "Alice",
      role: "admin",
    });
    done();
  });
});`,
    },

    correctSide: "left",
    explanationCorrect:
      "Using async/await lets the test runner detect unhandled rejections automatically. If the promise rejects, the test fails immediately with a clear stack trace pointing to the failing line.",
    explanationWrong:
      "The done callback pattern silently passes when the promise rejects, because the .then handler never runs and done() is never called. The test eventually times out with a generic timeout error instead of showing the actual failure reason.",
    sourceUrl: "https://vitest.dev/guide/testing-types.html",
    sourceLabel: "Vitest: Testing async code",
  },
  {
    id: "async-002",
    category: "async-testing",
    difficulty: "easy",
    title: "Promise rejection testing",
    prompt: "Which approach correctly tests for a rejected promise?",
    content: {
      type: "code",

      left: `// Verifying that login rejects
test("rejects invalid credentials", async () => {
  try {
    await login("bad-user", "bad-pass");
  } catch (err) {
    expect(err).toBeInstanceOf(AuthError);
    expect(err.message).toBe("Invalid credentials");
  }
});`,

      right: `// Verifying that login rejects
test("rejects invalid credentials", async () => {
  await expect(
    login("bad-user", "bad-pass")
  ).rejects.toThrow(AuthError);

  await expect(
    login("bad-user", "bad-pass")
  ).rejects.toThrow("Invalid credentials");
});`,
    },

    correctSide: "right",
    explanationCorrect:
      "The .rejects.toThrow() matcher guarantees the test fails if the promise resolves instead of rejecting. The assertion is declarative and the test runner enforces that a rejection actually occurs.",
    explanationWrong:
      "The try/catch pattern silently passes when the promise resolves successfully, because the catch block is simply skipped. The test reports success even though the expected rejection never happened. You would need to add an explicit fail() call or expect.assertions() to guard against this.",
    sourceUrl: "https://vitest.dev/api/expect.html#rejects",
    sourceLabel: "Vitest: expect.rejects",
  },
  {
    id: "async-003",
    category: "async-testing",
    difficulty: "medium",
    title: "Timer-based test patterns",
    prompt: "Which approach handles timers in tests more effectively?",
    content: {
      type: "code",

      left: `// Testing a delayed notification
test("shows alert after delay", async () => {
  vi.useFakeTimers();

  const onAlert = vi.fn();
  scheduleAlert("Server restarting", 5000, onAlert);

  // Advance time and flush microtasks
  await vi.advanceTimersByTimeAsync(5000);

  expect(onAlert).toHaveBeenCalledWith(
    "Server restarting"
  );

  vi.useRealTimers();
});`,

      right: `// Testing a delayed notification
test("shows alert after delay", async () => {
  const onAlert = vi.fn();
  scheduleAlert("Server restarting", 5000, onAlert);

  // Wait for the real timer to fire
  await new Promise((r) => setTimeout(r, 5000));

  expect(onAlert).toHaveBeenCalledWith(
    "Server restarting"
  );
});`,
    },

    correctSide: "left",
    explanationCorrect:
      "Fake timers let you advance time instantly without actually waiting. The test runs in milliseconds instead of 5 seconds, and you have precise control over when each timer fires. advanceTimersByTimeAsync also flushes promise-based microtasks.",
    explanationWrong:
      "Waiting for real timers makes the test slow and introduces flakiness from scheduling jitter. A 5-second wait in every timer test compounds into minutes of wasted CI time. Fake timers eliminate both the slowness and the timing uncertainty.",
    sourceUrl: "https://vitest.dev/api/vi.html#vi-usefaketimers",
    sourceLabel: "Vitest: Fake Timers",
  },
  {
    id: "async-004",
    category: "async-testing",
    difficulty: "medium",
    title: "Polling and retry in tests",
    prompt: "Which polling test approach is more robust?",
    content: {
      type: "code",

      left: `// Testing a status poller
test("detects deployment completion", async () => {
  const status = await getDeployStatus("d-1");
  expect(status).toBe("pending");

  // Wait a fixed amount of time
  await new Promise((r) => setTimeout(r, 3000));

  const updated = await getDeployStatus("d-1");
  expect(updated).toBe("complete");
});`,

      right: `// Testing a status poller
test("detects deployment completion", async () => {
  const status = await getDeployStatus("d-1");
  expect(status).toBe("pending");

  // Poll until the condition is met
  await vi.waitFor(async () => {
    const updated = await getDeployStatus("d-1");
    expect(updated).toBe("complete");
  });
});`,
    },

    correctSide: "right",
    explanationCorrect:
      "vi.waitFor() retries the assertion on a short interval until it passes or times out. This adapts to the actual speed of the system under test, finishing as soon as the condition is met rather than waiting a fixed duration.",
    explanationWrong:
      "A fixed delay is a guess. If the system is faster, the test wastes time. If the system is slower (common under CI load), the test fails intermittently. There is no retry mechanism, so a single slow response causes a false failure.",
    sourceUrl: "https://vitest.dev/api/vi.html#vi-waitfor",
    sourceLabel: "Vitest: vi.waitFor",
  },
  {
    id: "async-005",
    category: "async-testing",
    difficulty: "medium",
    title: "Testing debounced functions",
    prompt: "Which pattern correctly tests a debounced handler?",
    content: {
      type: "code",

      left: `// Testing debounced search
test("debounces search input", async () => {
  vi.useFakeTimers();
  const search = vi.fn();
  const debounced = debounce(search, 300);

  debounced("h");
  debounced("he");
  debounced("hel");

  // Nothing fired yet
  expect(search).not.toHaveBeenCalled();

  // Advance past the debounce window
  await vi.advanceTimersByTimeAsync(300);

  expect(search).toHaveBeenCalledTimes(1);
  expect(search).toHaveBeenCalledWith("hel");

  vi.useRealTimers();
});`,

      right: `// Testing debounced search
test("debounces search input", async () => {
  const search = vi.fn();
  const debounced = debounce(search, 300);

  debounced("h");
  debounced("he");
  debounced("hel");

  // Wait for debounce to settle
  await new Promise((r) => setTimeout(r, 500));

  expect(search).toHaveBeenCalledTimes(1);
  expect(search).toHaveBeenCalledWith("hel");
});`,
    },

    correctSide: "left",
    explanationCorrect:
      "Fake timers give you precise control over when the debounce window expires. You can verify the intermediate state (nothing called yet) and then advance time to the exact debounce threshold. The test runs instantly and deterministically.",
    explanationWrong:
      "Using a real setTimeout with an extra 200ms buffer works but is fragile. You cannot assert the intermediate state reliably, the test takes 500ms of real time, and under heavy CI load the timing margin may not be enough.",
    sourceUrl: "https://vitest.dev/api/vi.html#vi-advancetimersbytimeasync",
    sourceLabel: "Vitest: advanceTimersByTimeAsync",
  },
  {
    id: "async-006",
    category: "async-testing",
    difficulty: "hard",
    title: "Race condition detection in tests",
    prompt: "Which test pattern better guards against race conditions?",
    content: {
      type: "code",

      left: `// Testing concurrent cart updates
test("handles concurrent additions", async () => {
  const cart = createCart();

  // Fire both requests at once
  const [r1, r2] = await Promise.all([
    cart.addItem("sku-a", 1),
    cart.addItem("sku-b", 2),
  ]);

  // Verify final state after both settle
  const items = await cart.getItems();
  expect(items).toHaveLength(2);
  expect(items).toContainEqual(
    expect.objectContaining({ sku: "sku-a" })
  );
  expect(items).toContainEqual(
    expect.objectContaining({ sku: "sku-b" })
  );
});`,

      right: `// Testing concurrent cart updates
test("handles concurrent additions", async () => {
  const cart = createCart();

  // Run requests sequentially
  await cart.addItem("sku-a", 1);
  await cart.addItem("sku-b", 2);

  const items = await cart.getItems();
  expect(items).toHaveLength(2);
  expect(items).toContainEqual(
    expect.objectContaining({ sku: "sku-a" })
  );
  expect(items).toContainEqual(
    expect.objectContaining({ sku: "sku-b" })
  );
});`,
    },

    correctSide: "left",
    explanationCorrect:
      "Promise.all fires both operations concurrently, which is how real users interact with a cart. This exposes race conditions such as lost updates or duplicate entries that only surface under concurrent access. Sequential tests hide these bugs entirely.",
    explanationWrong:
      "Running operations one after another never overlaps their execution. The code under test always sees a settled state before the next operation begins. Bugs that only appear when two writes overlap (lost updates, stale reads) will pass this test and break in production.",
    sourceUrl:
      "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/all",
    sourceLabel: "MDN: Promise.all()",
  },
  {
    id: "async-007",
    category: "async-testing",
    difficulty: "hard",
    title: "Testing event emitters and streams",
    prompt: "Which pattern tests an event-driven workflow more reliably?",
    content: {
      type: "code",

      left: `// Testing a job processor
test("emits progress events", async () => {
  const processor = new JobProcessor();
  const events: string[] = [];

  processor.on("progress", (msg) => {
    events.push(msg);
  });
  processor.start("job-1");

  // Wait until the done event fires
  await new Promise<void>((resolve) => {
    processor.on("done", () => resolve());
  });

  expect(events).toEqual([
    "Validating",
    "Processing",
    "Finalizing",
  ]);
});`,

      right: `// Testing a job processor
test("emits progress events", async () => {
  const processor = new JobProcessor();
  const events: string[] = [];

  processor.on("progress", (msg) => {
    events.push(msg);
  });
  processor.start("job-1");

  // Assume processing takes under 2 seconds
  await new Promise((r) => setTimeout(r, 2000));

  expect(events).toEqual([
    "Validating",
    "Processing",
    "Finalizing",
  ]);
});`,
    },

    correctSide: "left",
    explanationCorrect:
      "Waiting for the 'done' event ties the test to the actual completion signal of the system. The test finishes as soon as processing completes, whether that takes 10ms or 900ms. It never waits longer than necessary and never times out prematurely.",
    explanationWrong:
      "A fixed 2-second sleep is an arbitrary guess. If the processor finishes in 50ms, the test wastes time. If CI is under load and processing takes 2.1 seconds, the test fails randomly. Tying assertions to the completion event removes both problems.",
    sourceUrl: "https://nodejs.org/api/events.html#class-eventemitter",
    sourceLabel: "Node.js: EventEmitter",
  },
  {
    id: "async-008",
    category: "async-testing",
    difficulty: "hard",
    title: "Flaky test prevention patterns",
    prompt: "Which test setup reduces flakiness in async tests?",
    content: {
      type: "code",

      left: `// Testing order creation with a server
let server: MockServer;

beforeEach(async () => {
  server = await createMockServer();
});

afterEach(async () => {
  await server.close();
});

test("creates an order", async () => {
  server.post("/orders", { id: "ord-1" });

  const order = await createOrder({
    baseUrl: server.url,
    items: [{ sku: "a", qty: 1 }],
  });

  expect(order.id).toBe("ord-1");
  expect(server.requests).toHaveLength(1);
});`,

      right: `// Testing order creation with a server
const server = await createMockServer();

afterAll(async () => {
  await server.close();
});

test("creates an order", async () => {
  server.post("/orders", { id: "ord-1" });

  const order = await createOrder({
    baseUrl: server.url,
    items: [{ sku: "a", qty: 1 }],
  });

  expect(order.id).toBe("ord-1");
  expect(server.requests).toHaveLength(1);
});`,
    },

    correctSide: "left",
    explanationCorrect:
      "Creating and tearing down the mock server in beforeEach/afterEach gives every test a clean instance. Registered routes, recorded requests, and any internal state are fully isolated. Tests can run in any order without affecting each other.",
    explanationWrong:
      "Sharing a single server across tests means route handlers and recorded requests leak between them. The second test sees leftover requests from the first, so the toHaveLength check depends on execution order. Adding or reordering tests will cause unexpected failures.",
    sourceUrl: "https://vitest.dev/api/#beforeeach",
    sourceLabel: "Vitest: beforeEach / afterEach",
  },
];
