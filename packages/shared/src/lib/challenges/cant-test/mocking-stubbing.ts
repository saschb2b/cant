import type { BaseChallenge } from "../../game/types";

export const mockingStubbingChallenges: BaseChallenge[] = [
  {
    id: "mock-001",
    category: "mocking-stubbing",
    difficulty: "easy",
    title: "Mocking return values vs implementations",
    prompt: "Which mocking approach is more maintainable?",
    content: {
      type: "code",

      left: `import { vi, test, expect } from "vitest";
import { getUser } from "./user-service";
import * as db from "./db";

vi.mock("./db");

test("returns formatted user", async () => {
  // Provide the data the function needs
  vi.mocked(db.findById).mockResolvedValue({
    id: 1,
    name: "Alice",
    role: "admin",
  });

  const result = await getUser(1);
  expect(result).toEqual({
    id: 1,
    displayName: "Alice (admin)",
  });
});`,

      right: `import { vi, test, expect } from "vitest";
import { getUser } from "./user-service";
import * as db from "./db";

vi.mock("./db");

test("returns formatted user", async () => {
  // Re-implement the dependency
  vi.mocked(db.findById).mockImplementation(
    async (id: number) => {
      if (id === 1) {
        return { id: 1, name: "Alice", role: "admin" };
      }
      throw new Error("not found");
    }
  );

  const result = await getUser(1);
  expect(result).toEqual({
    id: 1,
    displayName: "Alice (admin)",
  });
});`,
    },

    correctSide: "left",
    explanationCorrect:
      "mockResolvedValue provides just the data the test needs without re-implementing any logic. The test stays focused on verifying the output of getUser, not on simulating the internals of the database module. When the dependency changes, you only update the return value.",
    explanationWrong:
      "mockImplementation duplicates logic that belongs to the real module. The test now contains branching, error throwing, and parameter checking that mirrors the actual implementation. If the real module changes its signature, the mock implementation must be updated in lockstep, making tests brittle.",
    sourceUrl: "https://vitest.dev/api/mock.html#mockreturnvalue",
    sourceLabel: "Vitest: Mock Return Value",
  },
  {
    id: "mock-002",
    category: "mocking-stubbing",
    difficulty: "easy",
    title: "Spy assertions on function calls",
    prompt: "Which approach verifies function calls more reliably?",
    content: {
      type: "code",

      left: `import { vi, test, expect } from "vitest";
import { processOrder } from "./orders";
import * as mailer from "./mailer";

test("sends confirmation email", async () => {
  const spy = vi.spyOn(mailer, "sendEmail");
  spy.mockResolvedValue(undefined);

  await processOrder({ id: 42, email: "a@b.com" });

  expect(spy).toHaveBeenCalledWith(
    "a@b.com",
    expect.stringContaining("Order #42")
  );
  expect(spy).toHaveBeenCalledTimes(1);
});`,

      right: `import { vi, test, expect } from "vitest";
import { processOrder } from "./orders";
import * as mailer from "./mailer";

let emailSent = false;

test("sends confirmation email", async () => {
  vi.spyOn(mailer, "sendEmail").mockImplementation(
    async () => {
      emailSent = true;
    }
  );

  await processOrder({ id: 42, email: "a@b.com" });

  expect(emailSent).toBe(true);
});`,
    },

    correctSide: "left",
    explanationCorrect:
      "Using toHaveBeenCalledWith checks both that the function was called and that it received the correct arguments. Combining it with toHaveBeenCalledTimes ensures no extra calls happen. The spy captures all invocation details automatically, so no manual tracking is needed.",
    explanationWrong:
      "Tracking calls with a boolean flag only proves the function ran. It says nothing about the arguments passed. If processOrder accidentally calls sendEmail with the wrong address or a malformed subject, this test still passes. Manual flags also risk leaking state between tests when declared outside the test block.",
    sourceUrl: "https://vitest.dev/api/expect.html#tohavebeencalledwith",
    sourceLabel: "Vitest: toHaveBeenCalledWith",
  },
  {
    id: "mock-003",
    category: "mocking-stubbing",
    difficulty: "medium",
    title: "Mocking external API calls",
    prompt: "Which pattern for mocking HTTP requests leads to better tests?",
    content: {
      type: "code",

      left: `import { test, expect } from "vitest";
import { fetchUserProfile } from "./profile";

// Intercept at the network level
const server = setupServer(
  http.get("https://api.example.com/users/:id", () => {
    return HttpResponse.json({
      id: 1,
      name: "Alice",
      avatar: "https://img.example.com/1.png",
    });
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

test("maps API response to profile", async () => {
  const profile = await fetchUserProfile(1);
  expect(profile.displayName).toBe("Alice");
});`,

      right: `import { vi, test, expect } from "vitest";
import { fetchUserProfile } from "./profile";

test("maps API response to profile", async () => {
  // Replace the global fetch function
  vi.stubGlobal(
    "fetch",
    vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        id: 1,
        name: "Alice",
        avatar: "https://img.example.com/1.png",
      }),
    })
  );

  const profile = await fetchUserProfile(1);
  expect(profile.displayName).toBe("Alice");
});`,
    },

    correctSide: "left",
    explanationCorrect:
      "MSW (Mock Service Worker) intercepts requests at the network level, so your test exercises the real fetch call, headers, URL construction, and response parsing. If your code switches from fetch to axios, the test still works. Network-level mocking also catches issues like incorrect URLs or missing headers that stubbing fetch would miss.",
    explanationWrong:
      "Replacing globalThis.fetch with a mock skips URL routing, header handling, and the actual Response API. The mock returns a plain object that looks like a Response but is not one. If the code under test calls response.headers.get() or checks response.status, the mock must be extended manually for each case.",
    sourceUrl: "https://mswjs.io/docs/getting-started",
    sourceLabel: "MSW: Getting Started",
  },
  {
    id: "mock-004",
    category: "mocking-stubbing",
    difficulty: "medium",
    title: "Dependency injection for testability",
    prompt: "Which design makes the function easier to test?",
    content: {
      type: "code",

      right: `// notification-service.ts
import { sendPush } from "./push-client";
import { logEvent } from "./analytics";

export async function notifyUser(
  userId: string,
  message: string
) {
  await sendPush(userId, message);
  logEvent("notification_sent", { userId });
}

// notification-service.test.ts
vi.mock("./push-client");
vi.mock("./analytics");

test("sends push and logs event", async () => {
  await notifyUser("u1", "Hello");
  expect(sendPush).toHaveBeenCalledWith("u1", "Hello");
  expect(logEvent).toHaveBeenCalled();
});`,

      left: `// notification-service.ts
interface NotificationDeps {
  sendPush: (userId: string, msg: string) => Promise<void>;
  logEvent: (name: string, data: object) => void;
}

export async function notifyUser(
  userId: string,
  message: string,
  deps: NotificationDeps
) {
  await deps.sendPush(userId, message);
  deps.logEvent("notification_sent", { userId });
}

// notification-service.test.ts
test("sends push and logs event", async () => {
  const deps = {
    sendPush: vi.fn().mockResolvedValue(undefined),
    logEvent: vi.fn(),
  };
  await notifyUser("u1", "Hello", deps);
  expect(deps.sendPush).toHaveBeenCalledWith("u1", "Hello");
  expect(deps.logEvent).toHaveBeenCalled();
});`,
    },

    correctSide: "left",
    explanationCorrect:
      "Passing dependencies as a parameter makes the function pure and testable without any module-level mocking. Tests create lightweight fakes inline, there is no hidden global state, and the function signature documents exactly what it needs. This pattern also makes it straightforward to swap implementations in production (logging, push providers).",
    explanationWrong:
      "vi.mock() hoists to the top of the file and replaces the entire module for every test in the file. This couples the test to the import paths of the implementation. If the code refactors push-client into a different module, the test breaks even though behavior is unchanged. Module mocking also makes it harder to test different dependency configurations in the same file.",
    sourceUrl: "https://vitest.dev/guide/mocking.html#modules",
    sourceLabel: "Vitest: Mocking Modules",
  },
  {
    id: "mock-005",
    category: "mocking-stubbing",
    difficulty: "medium",
    title: "Mock scope and cleanup",
    prompt: "Which mock lifecycle approach avoids test pollution?",
    content: {
      type: "code",

      left: `import { vi, test, expect, afterEach } from "vitest";
import * as cache from "./cache";

// Module-level spy shared by all tests
const getSpy = vi.spyOn(cache, "get");
const setSpy = vi.spyOn(cache, "set");

test("reads from cache on hit", async () => {
  getSpy.mockResolvedValue("cached-data");
  const result = await readThrough("key-1");
  expect(result).toBe("cached-data");
});

test("writes to cache on miss", async () => {
  // getSpy still returns "cached-data"
  // from the previous test
  getSpy.mockResolvedValue(null);
  await readThrough("key-2");
  expect(setSpy).toHaveBeenCalledWith(
    "key-2",
    expect.anything()
  );
});`,

      right: `import { vi, test, expect, beforeEach } from "vitest";
import * as cache from "./cache";

let getSpy: ReturnType<typeof vi.spyOn>;
let setSpy: ReturnType<typeof vi.spyOn>;

beforeEach(() => {
  getSpy = vi.spyOn(cache, "get");
  setSpy = vi.spyOn(cache, "set");
});

afterEach(() => {
  vi.restoreAllMocks();
});

test("reads from cache on hit", async () => {
  getSpy.mockResolvedValue("cached-data");
  const result = await readThrough("key-1");
  expect(result).toBe("cached-data");
});

test("writes to cache on miss", async () => {
  getSpy.mockResolvedValue(null);
  await readThrough("key-2");
  expect(setSpy).toHaveBeenCalledWith(
    "key-2",
    expect.anything()
  );
});`,
    },

    correctSide: "right",
    explanationCorrect:
      "Creating spies in beforeEach and restoring them in afterEach guarantees each test starts with a clean slate. No mock return values or call counts leak between tests, so tests can run in any order and still pass. vi.restoreAllMocks() reverts every spy to its original implementation.",
    explanationWrong:
      "Module-level spies persist across all tests in the file. If a previous test sets a mock return value and the next test forgets to override it, the stale value leaks through. This causes tests that pass individually but fail when run together, one of the hardest bugs to track down in a test suite.",
    sourceUrl: "https://vitest.dev/api/vi.html#vi-restoreallmocks",
    sourceLabel: "Vitest: restoreAllMocks",
  },
  {
    id: "mock-006",
    category: "mocking-stubbing",
    difficulty: "hard",
    title: "Partial mocking of modules",
    prompt: "Which approach to partial module mocking is more correct?",
    content: {
      type: "code",

      left: `import { vi, test, expect } from "vitest";

// Mock only the logger, keep everything else
vi.mock("./utils", async (importOriginal) => {
  const actual = await importOriginal<
    typeof import("./utils")
  >();
  return {
    ...actual,
    logger: {
      info: vi.fn(),
      error: vi.fn(),
    },
  };
});

import { processItems, logger } from "./utils";

test("logs progress for each item", async () => {
  await processItems([1, 2, 3]);
  expect(logger.info).toHaveBeenCalledTimes(3);
});`,

      right: `import { vi, test, expect } from "vitest";
import { processItems, logger } from "./utils";

// Replace individual methods after import
vi.spyOn(logger, "info").mockImplementation(() => {});
vi.spyOn(logger, "error").mockImplementation(() => {});

test("logs progress for each item", async () => {
  await processItems([1, 2, 3]);
  expect(logger.info).toHaveBeenCalledTimes(3);
});`,
    },

    correctSide: "right",
    explanationCorrect:
      "vi.spyOn selectively wraps individual methods while keeping the rest of the object intact. There is no need to re-import the module or spread original exports. Spies are easy to restore with mockRestore(), and they preserve the object reference so any code holding a reference to logger sees the same spy.",
    explanationWrong:
      "vi.mock with importOriginal works, but it replaces the entire module export and forces you to manually spread all original members. If the module adds new exports later, the spread still works, but the factory runs once at load time, which makes per-test customization harder. It also requires the vi.mock call to be hoisted above the import, which can cause confusion when reading the file top to bottom.",
    sourceUrl: "https://vitest.dev/api/vi.html#vi-spyon",
    sourceLabel: "Vitest: vi.spyOn",
  },
  {
    id: "mock-007",
    category: "mocking-stubbing",
    difficulty: "hard",
    title: "Mocking time and dates",
    prompt: "Which approach to testing time-dependent code is more reliable?",
    content: {
      type: "code",

      right: `import { vi, test, expect, afterEach } from "vitest";
import { isTokenExpired } from "./auth";

afterEach(() => {
  vi.useRealTimers();
});

test("detects expired token", () => {
  // Fix time to a known instant
  vi.useFakeTimers();
  vi.setSystemTime(new Date("2025-06-15T12:00:00Z"));

  const token = {
    expiresAt: "2025-06-15T11:00:00Z",
  };

  expect(isTokenExpired(token)).toBe(true);
});

test("detects valid token", () => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date("2025-06-15T12:00:00Z"));

  const token = {
    expiresAt: "2025-06-16T12:00:00Z",
  };

  expect(isTokenExpired(token)).toBe(false);
});`,

      left: `import { test, expect } from "vitest";
import { isTokenExpired } from "./auth";

test("detects expired token", () => {
  const token = {
    // Set expiry one hour in the past
    expiresAt: new Date(
      Date.now() - 60 * 60 * 1000
    ).toISOString(),
  };

  expect(isTokenExpired(token)).toBe(true);
});

test("detects valid token", () => {
  const token = {
    // Set expiry one day in the future
    expiresAt: new Date(
      Date.now() + 24 * 60 * 60 * 1000
    ).toISOString(),
  };

  expect(isTokenExpired(token)).toBe(false);
});`,
    },

    correctSide: "right",
    explanationCorrect:
      "Fake timers pin Date.now() to a deterministic value, so the test always evaluates the same comparison. This eliminates flakiness from timing differences between test setup and assertion. It also lets you test edge cases like exact boundary times or midnight rollovers by setting the system time precisely.",
    explanationWrong:
      "Computing expiry relative to Date.now() seems convenient, but the real clock keeps ticking between the moment you construct the date and the moment the assertion runs. On slow CI machines or when debugging, that gap can cause intermittent failures. You also cannot test exact boundary conditions because the reference time shifts with each run.",
    sourceUrl: "https://vitest.dev/api/vi.html#vi-usefaketimers",
    sourceLabel: "Vitest: Fake Timers",
  },
  {
    id: "mock-008",
    category: "mocking-stubbing",
    difficulty: "hard",
    title: "Over-mocking vs integration approach",
    prompt: "Which testing strategy gives more confidence for this feature?",
    content: {
      type: "code",

      left: `import { vi, test, expect } from "vitest";
import { checkout } from "./checkout";

vi.mock("./cart", () => ({
  getItems: vi.fn(() => [
    { id: 1, price: 10, qty: 2 },
  ]),
}));
vi.mock("./pricing", () => ({
  applyDiscount: vi.fn((total) => total * 0.9),
}));
vi.mock("./tax", () => ({
  calculateTax: vi.fn((amount) => amount * 0.2),
}));
vi.mock("./payment", () => ({
  charge: vi.fn(() => ({ status: "ok" })),
}));

test("processes checkout", async () => {
  const result = await checkout("user-1", "SAVE10");
  expect(result.status).toBe("ok");
});`,

      right: `import { vi, test, expect } from "vitest";
import { checkout } from "./checkout";
import * as payment from "./payment";

// Only mock the external boundary
vi.spyOn(payment, "charge").mockResolvedValue({
  status: "ok",
  transactionId: "tx-123",
});

test("calculates total with discount and tax", async () => {
  // Use real cart, pricing, and tax modules
  const result = await checkout("user-1", "SAVE10");

  expect(result.status).toBe("ok");
  // Verify the real calculation pipeline
  expect(payment.charge).toHaveBeenCalledWith(
    "user-1",
    expect.objectContaining({
      total: expect.any(Number),
      tax: expect.any(Number),
    })
  );
});`,
    },

    correctSide: "right",
    explanationCorrect:
      "Mocking only at the boundary (the payment gateway) lets the real cart, pricing, and tax logic run together. This catches integration bugs like incorrect discount stacking or tax rounding errors that unit mocks would hide. The test verifies the actual calculation pipeline end to end while still avoiding real charges.",
    explanationWrong:
      "When every dependency is mocked, the test only proves that checkout calls four functions in sequence. If applyDiscount changes its return format or calculateTax expects a different input shape, the mocks mask the breakage. The test passes while the real code is broken, giving false confidence.",
    sourceUrl: "https://kentcdodds.com/blog/write-tests",
    sourceLabel: "Kent C. Dodds: Write Tests",
  },
];
