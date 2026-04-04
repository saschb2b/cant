import type { BaseChallenge } from "../../game/types";

export const testStrategyChallenges: BaseChallenge[] = [
  {
    id: "strat-001",
    category: "test-strategy",
    difficulty: "easy",
    title: "Test coverage targets",
    prompt: "Which approach to test coverage leads to more reliable software?",
    content: {
      type: "code",

      left: `// coverage config
module.exports = {
  coverageThreshold: {
    global: {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100,
    },
  },
};

// test to hit coverage
test("constructor sets name", () => {
  const u = new User("Alice");
  expect(u.name).toBe("Alice");
});

// exists only for line coverage
test("toString returns string", () => {
  const u = new User("Bob");
  u.toString();
});`,

      right: `// coverage config
module.exports = {
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
};

// test validates behavior
test("creates order with line items", () => {
  const order = createOrder([item1, item2]);
  expect(order.total).toBe(30);
  expect(order.items).toHaveLength(2);
});

// test covers an edge case
test("rejects order with no items", () => {
  expect(() => createOrder([])).toThrow("empty");
});`,
    },

    correctSide: "right",
    explanationCorrect:
      "Targeting 80% coverage with meaningful tests focuses effort on verifying real behavior and edge cases. This threshold is high enough to catch regressions while leaving room for code that is difficult or pointless to test, such as generated types or trivial getters.",
    explanationWrong:
      "Mandating 100% coverage forces developers to write tests that exist only to satisfy the metric. These tests often assert implementation details rather than behavior, making refactoring harder without actually catching more bugs.",
    sourceUrl:
      "https://testing.googleblog.com/2020/08/code-coverage-best-practices.html",
    sourceLabel: "Google Testing Blog: Code Coverage Best Practices",
  },
  {
    id: "strat-002",
    category: "test-strategy",
    difficulty: "easy",
    title: "Test file organization",
    prompt: "Which test file structure is easier to maintain?",
    content: {
      type: "visual",
      left: { componentId: "FileTreeColocated" },
      right: { componentId: "FileTreeSeparate" },
    },

    correctSide: "left",
    explanationCorrect:
      "Co-locating test files next to the source they cover makes it obvious when a module lacks tests and simplifies imports with relative paths. When a file moves or gets deleted, its test naturally moves or gets deleted with it.",
    explanationWrong:
      "A separate __tests__ directory mirrors the source tree, which means every rename or move requires updating two locations. It also hides gaps in coverage because a missing test file is not visible alongside the source.",
    sourceUrl: "https://vitest.dev/guide/#configuring-vitest",
    sourceLabel: "Vitest: Configuring Vitest",
  },
  {
    id: "strat-003",
    category: "test-strategy",
    difficulty: "medium",
    title: "Path coverage for an endpoint",
    prompt: "Which test suite provides more confidence in this endpoint?",
    content: {
      type: "code",

      left: `describe("POST /api/orders", () => {
  it("creates an order", async () => {
    const res = await request(app)
      .post("/api/orders")
      .send({ items: [{ sku: "A1", qty: 2 }] });

    expect(res.status).toBe(201);
    expect(res.body.id).toBeDefined();
  });

  it("returns the total price", async () => {
    const res = await request(app)
      .post("/api/orders")
      .send({ items: [{ sku: "A1", qty: 1 }] });

    expect(res.body.total).toBe(9.99);
  });
});`,

      right: `describe("POST /api/orders", () => {
  it("creates an order with valid items", async () => {
    const res = await request(app)
      .post("/api/orders")
      .send({ items: [{ sku: "A1", qty: 2 }] });

    expect(res.status).toBe(201);
    expect(res.body.id).toBeDefined();
  });

  it("rejects an empty items array", async () => {
    const res = await request(app)
      .post("/api/orders")
      .send({ items: [] });

    expect(res.status).toBe(400);
  });

  it("rejects a missing body", async () => {
    const res = await request(app).post("/api/orders");
    expect(res.status).toBe(400);
  });

  it("rejects a negative quantity", async () => {
    const res = await request(app)
      .post("/api/orders")
      .send({ items: [{ sku: "A1", qty: -1 }] });

    expect(res.status).toBe(422);
  });
});`,
    },

    correctSide: "right",
    explanationCorrect:
      "Testing both the success path and multiple error paths verifies that validation logic works and that the API returns correct status codes for invalid input. Each error case documents an expected constraint of the endpoint.",
    explanationWrong:
      "Testing only the success path leaves validation and error handling completely unverified. Bugs in input parsing, missing fields, or negative values will reach production without any safety net.",
    sourceUrl: "https://martinfowler.com/articles/practical-test-pyramid.html",
    sourceLabel: "Martin Fowler: The Practical Test Pyramid",
  },
  {
    id: "strat-004",
    category: "test-strategy",
    difficulty: "medium",
    title: "Regression test approach",
    prompt: "Which approach better prevents regressions after a bug fix?",
    content: {
      type: "code",

      left: `// Bug: discount rounds incorrectly
// Fix applied in applyDiscount()

// Existing test still passes
test("applies 10% discount", () => {
  const result = applyDiscount(100, 0.1);
  expect(result).toBe(90);
});

// Manual QA confirms the fix
// Mark ticket as resolved`,

      right: `// Bug: discount rounds incorrectly
// Fix applied in applyDiscount()

// Existing test still passes
test("applies 10% discount", () => {
  const result = applyDiscount(100, 0.1);
  expect(result).toBe(90);
});

// Regression test for the specific bug
test("rounds discount to two decimals", () => {
  const result = applyDiscount(19.99, 0.15);
  expect(result).toBe(16.99);
});

// Edge case from the bug report
test("handles discount on small amounts", () => {
  const result = applyDiscount(0.1, 0.5);
  expect(result).toBe(0.05);
});`,
    },

    correctSide: "right",
    explanationCorrect:
      "Adding a regression test that reproduces the exact bug (and its edge cases) ensures the fix stays in place. If a future refactor reintroduces the rounding error, the test fails immediately instead of relying on manual QA to catch it.",
    explanationWrong:
      "Relying on the original test and manual verification leaves a gap. The original test did not catch the bug in the first place, and manual QA will not be repeated on every future change to the discount logic.",
    sourceUrl:
      "https://testing.googleblog.com/2017/04/where-do-our-flaky-tests-come-from.html",
    sourceLabel: "Google Testing Blog: Where Do Our Flaky Tests Come From?",
  },
  {
    id: "strat-005",
    category: "test-strategy",
    difficulty: "medium",
    title: "Test granularity for a feature",
    prompt:
      "Which test distribution gives better feedback for a checkout feature?",
    content: {
      type: "code",

      left: `// All tests run through the browser
describe("Checkout", () => {
  it("completes purchase end-to-end", async () => {
    await page.goto("/products");
    await page.click('[data-testid="add-to-cart"]');
    await page.click('[data-testid="checkout"]');
    await page.fill("#card", "4242424242424242");
    await page.click('[data-testid="pay"]');
    await expect(page.locator(".confirmation")).toBeVisible();
  });

  it("shows error for declined card", async () => {
    await page.goto("/checkout");
    await page.fill("#card", "4000000000000002");
    await page.click('[data-testid="pay"]');
    await expect(page.locator(".error")).toBeVisible();
  });
});`,

      right: `// Unit: price calculation logic
test("calculates subtotal", () => {
  expect(subtotal([{ price: 10, qty: 2 }])).toBe(20);
});
test("applies tax rate", () => {
  expect(withTax(100, 0.08)).toBe(108);
});

// Integration: checkout API
test("POST /checkout returns order ID", async () => {
  const res = await request(app)
    .post("/checkout")
    .send({ cartId: "c1", card: "tok_visa" });
  expect(res.status).toBe(201);
});

// E2E: critical path only
test("purchase confirmation is shown", async () => {
  await page.goto("/products");
  await page.click('[data-testid="add-to-cart"]');
  await page.click('[data-testid="checkout"]');
  await page.fill("#card", "4242424242424242");
  await page.click('[data-testid="pay"]');
  await expect(page.locator(".confirmation")).toBeVisible();
});`,
    },

    correctSide: "right",
    explanationCorrect:
      "Distributing tests across unit, integration, and E2E layers gives fast feedback on logic errors (units), verifies service boundaries (integration), and confirms the critical user flow works (E2E). This layered approach keeps the suite fast while still covering the full stack.",
    explanationWrong:
      "Running everything through the browser makes the suite slow and brittle. A tax calculation bug takes minutes to surface instead of milliseconds, and flaky selectors or network timeouts can mask real failures.",
    sourceUrl: "https://martinfowler.com/articles/practical-test-pyramid.html",
    sourceLabel: "Martin Fowler: The Practical Test Pyramid",
  },
  {
    id: "strat-006",
    category: "test-strategy",
    difficulty: "hard",
    title: "Testing legacy code strategy",
    prompt:
      "Which approach is safer when adding tests to untested legacy code?",
    content: {
      type: "code",

      left: `// Step 1: refactor for testability
class OrderService {
  constructor(private repo: OrderRepo) {}

  async place(items: Item[]) {
    const order = buildOrder(items);
    await this.repo.save(order);
    await sendEmail(order);
    return order;
  }
}

// Step 2: write tests after refactoring
test("places an order", async () => {
  const repo = new InMemoryOrderRepo();
  const svc = new OrderService(repo);
  const order = await svc.place([item]);
  expect(repo.saved).toContainEqual(order);
});`,

      right: `// Step 1: pin current behavior with a characterization test
test("place returns order with total", async () => {
  const result = await legacyPlaceOrder([item]);
  // Capture actual output as the expected value
  expect(result.total).toBe(29.97);
  expect(result.status).toBe("pending");
});

// Step 2: extract dependency behind an interface
class OrderService {
  constructor(private repo: OrderRepo) {}

  async place(items: Item[]) {
    const order = buildOrder(items);
    await this.repo.save(order);
    return order;
  }
}

// Step 3: verify refactored code matches pinned behavior
test("refactored place matches legacy output", async () => {
  const repo = new InMemoryOrderRepo();
  const svc = new OrderService(repo);
  const order = await svc.place([item]);
  expect(order.total).toBe(29.97);
  expect(order.status).toBe("pending");
});`,
    },

    correctSide: "right",
    explanationCorrect:
      "Characterization tests lock in the existing behavior before any refactoring starts. This safety net ensures that each small structural change preserves the original output. Refactoring without this net risks silently changing behavior and shipping a regression.",
    explanationWrong:
      "Refactoring first and testing second removes the safety net that would catch accidental behavior changes. If the refactoring introduces a subtle bug, there is no baseline to compare against, and the new test simply encodes the broken behavior.",
    sourceUrl:
      "https://www.amazon.com/Working-Effectively-Legacy-Michael-Feathers/dp/0131177052",
    sourceLabel: "Michael Feathers: Working Effectively with Legacy Code",
  },
  {
    id: "strat-007",
    category: "test-strategy",
    difficulty: "hard",
    title: "Contract testing between services",
    prompt: "Which approach catches breaking changes between services earlier?",
    content: {
      type: "code",

      left: `// Consumer: order-service
// Integration test against live user-service
test("fetches user for order", async () => {
  // Requires user-service running on port 3001
  const res = await fetch(
    "http://localhost:3001/users/u1"
  );
  const user = await res.json();

  expect(user.id).toBe("u1");
  expect(user.name).toBeDefined();
  expect(user.email).toBeDefined();
});

// CI pipeline starts both services
// in docker-compose before tests run`,

      right: `// Consumer: order-service
// Define expected contract with Pact
const interaction = {
  state: "user u1 exists",
  uponReceiving: "a request for user u1",
  withRequest: {
    method: "GET",
    path: "/users/u1",
  },
  willRespondWith: {
    status: 200,
    body: {
      id: like("u1"),
      name: like("Alice"),
      email: like("a@test.com"),
    },
  },
};

// Provider: user-service
// Verify contract in provider's own CI
// Pact broker stores and shares contracts
// Provider test replays interactions
// and checks they still match`,
    },

    correctSide: "right",
    explanationCorrect:
      "Contract tests let each service verify its obligations independently. The consumer publishes what it expects, and the provider confirms it can deliver. Breaking changes surface in the provider's CI before deployment, without requiring both services to run simultaneously.",
    explanationWrong:
      "Integration tests against a live service couple both teams' CI pipelines and require orchestrating multiple containers. They are slow, flaky due to network issues, and only catch problems after both services are built, which delays feedback.",
    sourceUrl: "https://docs.pact.io/",
    sourceLabel: "Pact: Contract Testing",
  },
  {
    id: "strat-008",
    category: "test-strategy",
    difficulty: "hard",
    title: "Property-based vs example-based testing",
    prompt: "Which testing style finds more edge cases in a sorting function?",
    content: {
      type: "code",

      left: `import { test, expect } from "vitest";

test("sorts numbers ascending", () => {
  expect(mySort([3, 1, 2])).toEqual([1, 2, 3]);
});

test("sorts negative numbers", () => {
  expect(mySort([-1, -3, -2])).toEqual([-3, -2, -1]);
});

test("handles empty array", () => {
  expect(mySort([])).toEqual([]);
});

test("handles single element", () => {
  expect(mySort([1])).toEqual([1]);
});

test("handles duplicates", () => {
  expect(mySort([2, 1, 2])).toEqual([1, 2, 2]);
});`,

      right: `import { test, expect } from "vitest";
import fc from "fast-check";

test("output length matches input", () => {
  fc.assert(
    fc.property(fc.array(fc.integer()), (arr) => {
      expect(mySort(arr)).toHaveLength(arr.length);
    })
  );
});

test("output is sorted", () => {
  fc.assert(
    fc.property(fc.array(fc.integer()), (arr) => {
      const sorted = mySort(arr);
      for (let i = 1; i < sorted.length; i++) {
        expect(sorted[i]).toBeGreaterThanOrEqual(
          sorted[i - 1]
        );
      }
    })
  );
});

test("output is a permutation of input", () => {
  fc.assert(
    fc.property(fc.array(fc.integer()), (arr) => {
      const sorted = mySort(arr);
      expect(sorted.sort()).toEqual([...arr].sort());
    })
  );
});`,
    },

    correctSide: "right",
    explanationCorrect:
      "Property-based tests generate hundreds of random inputs and verify invariants like ordering and length preservation. This approach surfaces edge cases that a developer would never think to write by hand, such as very large arrays, extreme integers, or unusual duplicate patterns.",
    explanationWrong:
      "Example-based tests only check the specific cases the developer anticipated. A subtle bug triggered by integer overflow, a large input size, or an unusual element distribution will slip through because none of the handpicked examples exercise that path.",
    sourceUrl: "https://fast-check.dev/docs/introduction/",
    sourceLabel: "fast-check: Introduction to Property-Based Testing",
  },
];
