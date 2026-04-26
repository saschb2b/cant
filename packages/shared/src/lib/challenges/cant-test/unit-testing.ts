import type { BaseChallenge } from "../../game/types";

export const unitTestingChallenges: BaseChallenge[] = [
  {
    id: "unit-001",
    category: "unit-testing",
    difficulty: "easy",
    title: "Test naming conventions",
    prompt: "Which test is structured more effectively?",
    content: {
      type: "code",

      left: `describe("calculateTotal", () => {
  it("test1", () => {
    expect(calculateTotal([10, 20])).toBe(30);
  });

  it("test2", () => {
    expect(calculateTotal([])).toBe(0);
  });

  it("test3", () => {
    expect(calculateTotal([-5, 5])).toBe(0);
  });
});`,

      right: `describe("calculateTotal", () => {
  it("returns the sum of all items", () => {
    expect(calculateTotal([10, 20])).toBe(30);
  });

  it("returns zero for an empty array", () => {
    expect(calculateTotal([])).toBe(0);
  });

  it("handles negative numbers", () => {
    expect(calculateTotal([-5, 5])).toBe(0);
  });
});`,
    },

    correctSide: "right",
    explanationCorrect:
      "Descriptive test names serve as living documentation. When a test fails, a name like 'returns zero for an empty array' immediately tells you what broke, without needing to read the test body. This speeds up debugging and helps teammates understand intent.",
    explanationWrong:
      "Cryptic names like 'test1' and 'test2' force developers to read the full test body to understand what is being verified. As a test suite grows, this makes failures hard to triage and the suite difficult to maintain.",
    sourceUrl: "https://vitest.dev/guide/#writing-tests",
    sourceLabel: "Vitest: Writing Tests",
  },
  {
    id: "unit-002",
    category: "unit-testing",
    difficulty: "easy",
    title: "Test body structure",
    prompt: "Which test is structured more effectively?",
    content: {
      type: "code",

      left: `it("applies discount to order total", () => {
  // Arrange
  const order = createOrder({ subtotal: 100 });
  const coupon = createCoupon({ percent: 20 });

  // Act
  const result = applyDiscount(order, coupon);

  // Assert
  expect(result.total).toBe(80);
  expect(result.discount).toBe(20);
});`,

      right: `it("applies discount to order total", () => {
  const result = applyDiscount(
    createOrder({ subtotal: 100 }),
    createCoupon({ percent: 20 }),
  );
  expect(result.total).toBe(80);
  expect(result.discount).toBe(20);
  const order2 = createOrder({ subtotal: 50 });
  expect(applyDiscount(order2, createCoupon({ percent: 10 })).total).toBe(45);
});`,
    },

    correctSide: "left",
    explanationCorrect:
      "The Arrange-Act-Assert pattern gives each test a clear three-part rhythm: set up inputs, execute the code under test, then verify the outcome. This makes tests easy to scan and predictable in structure, even as the suite grows.",
    explanationWrong:
      "Mixing setup, execution, and assertions into a single block makes it hard to tell where one logical step ends and another begins. Cramming multiple scenarios into one test also means a failure message points to the wrong cause.",
    sourceUrl: "https://testing-library.com/docs/guiding-principles",
    sourceLabel: "Testing Library: Guiding Principles",
  },
  {
    id: "unit-003",
    category: "unit-testing",
    difficulty: "easy",
    title: "What the test verifies",
    prompt: "Which test is structured more effectively?",
    content: {
      type: "code",

      left: `it("sorts products by price ascending", () => {
  const products = [
    { name: "Shirt", price: 30 },
    { name: "Hat", price: 10 },
    { name: "Jacket", price: 50 },
  ];

  const sorted = sortProducts(products, "price-asc");

  expect(sorted[0].price).toBe(10);
  expect(sorted[1].price).toBe(30);
  expect(sorted[2].price).toBe(50);
});`,

      right: `it("sorts products by price ascending", () => {
  const spy = vi.spyOn(Array.prototype, "sort");
  const products = [
    { name: "Shirt", price: 30 },
    { name: "Hat", price: 10 },
    { name: "Jacket", price: 50 },
  ];

  sortProducts(products, "price-asc");

  expect(spy).toHaveBeenCalledOnce();
  expect(spy).toHaveBeenCalledWith(expect.any(Function));
  spy.mockRestore();
});`,
    },

    correctSide: "left",
    explanationCorrect:
      "Testing the observable output (the sorted order) confirms that the function does what users care about. If the internal sorting algorithm changes, the test still passes as long as the result is correct, making refactoring safe.",
    explanationWrong:
      "Asserting that Array.prototype.sort was called checks how the function works, not what it produces. The test would break if the implementation switched to a different sorting approach, even though the output remained identical.",
    sourceUrl: "https://testing-library.com/docs/guiding-principles",
    sourceLabel: "Testing Library: Guiding Principles",
  },
  {
    id: "unit-004",
    category: "unit-testing",
    difficulty: "medium",
    title: "Assertion scope per test",
    prompt: "Which test is structured more effectively?",
    content: {
      type: "code",

      left: `it("formats a date, validates email, and parses CSV", () => {
  expect(formatDate(new Date(2024, 0, 1))).toBe("2024-01-01");

  expect(isValidEmail("user@example.com")).toBe(true);

  const rows = parseCsv("a,b\\n1,2");
  expect(rows).toEqual([{ a: "1", b: "2" }]);
});`,

      right: `it("formats a Date into an ISO date string", () => {
  const result = formatDate(new Date(2024, 0, 1));
  expect(result).toBe("2024-01-01");
});

it("accepts a valid email address", () => {
  expect(isValidEmail("user@example.com")).toBe(true);
});

it("parses CSV rows into objects", () => {
  const rows = parseCsv("a,b\\n1,2");
  expect(rows).toEqual([{ a: "1", b: "2" }]);
});`,
    },

    correctSide: "right",
    explanationCorrect:
      "Each test focuses on one behavior, so a failure pinpoints exactly which function broke. Isolated tests also run independently, making it straightforward to rerun or skip a single case during development.",
    explanationWrong:
      "Bundling unrelated assertions into one test means a failure in formatDate hides whether isValidEmail or parseCsv also failed. It also makes the test name meaningless since no single name can describe three unrelated checks.",
    sourceUrl: "https://vitest.dev/guide/#writing-tests",
    sourceLabel: "Vitest: Writing Tests",
  },
  {
    id: "unit-005",
    category: "unit-testing",
    difficulty: "medium",
    title: "Test data construction",
    prompt: "Which test is structured more effectively?",
    content: {
      type: "code",

      left: `function buildUser(overrides = {}) {
  return {
    id: "u-1",
    name: "Alice",
    email: "alice@test.com",
    role: "viewer",
    ...overrides,
  };
}

it("grants edit access to editors", () => {
  const user = buildUser({ role: "editor" });
  expect(canEdit(user)).toBe(true);
});`,

      right: `it("grants edit access to editors", () => {
  const user = {
    id: "u-1",
    name: "Alice",
    email: "alice@test.com",
    role: "editor",
  };
  expect(canEdit(user)).toBe(true);
});

it("denies edit access to viewers", () => {
  const user = {
    id: "u-2",
    name: "Bob",
    email: "bob@test.com",
    role: "viewer",
  };
  expect(canEdit(user)).toBe(false);
});`,
    },

    correctSide: "left",
    explanationCorrect:
      "A builder function provides sensible defaults and lets each test override only the fields that matter. This highlights what the test actually cares about (the role) and reduces noise from irrelevant properties.",
    explanationWrong:
      "Repeating full object literals in every test adds boilerplate and buries the important field among defaults. When the User type gains a new required property, every test that constructs a user inline must be updated.",
    sourceUrl: "https://jestjs.io/docs/setup-teardown#repeating-setup",
    sourceLabel: "Jest: Repeating Setup",
  },
  {
    id: "unit-006",
    category: "unit-testing",
    difficulty: "medium",
    title: "Boundary value coverage",
    prompt: "Which test is structured more effectively?",
    content: {
      type: "code",

      left: `describe("clamp", () => {
  it("returns the value when inside range", () => {
    expect(clamp(5, 0, 10)).toBe(5);
  });
});`,

      right: `describe("clamp", () => {
  it("returns min when value is below range", () => {
    expect(clamp(-1, 0, 10)).toBe(0);
  });

  it("returns max when value is above range", () => {
    expect(clamp(11, 0, 10)).toBe(10);
  });

  it("returns min when value equals min", () => {
    expect(clamp(0, 0, 10)).toBe(0);
  });

  it("returns max when value equals max", () => {
    expect(clamp(10, 0, 10)).toBe(10);
  });

  it("returns the value when inside range", () => {
    expect(clamp(5, 0, 10)).toBe(5);
  });
});`,
    },

    correctSide: "right",
    explanationCorrect:
      "Testing at and beyond both boundaries catches off-by-one errors and incorrect comparison operators. Boundary values are where most bugs hide, so explicitly covering them provides much stronger confidence than a single happy-path check.",
    explanationWrong:
      "A single test with a value in the middle of the range only proves the function works for one easy case. It misses bugs at the boundaries, such as using < instead of <= or forgetting to clamp values below the minimum.",
    sourceUrl: "https://jestjs.io/docs/expect#tobevalue",
    sourceLabel: "Jest: Matchers",
  },
  {
    id: "unit-007",
    category: "unit-testing",
    difficulty: "hard",
    title: "Repetitive scenario coverage",
    prompt: "Which test is structured more effectively?",
    content: {
      type: "code",

      left: `it.each([
  { input: "",         expected: false },
  { input: "abc",      expected: false },
  { input: "abc@",     expected: false },
  { input: "a@b.c",    expected: true  },
  { input: "user@x.co", expected: true },
])("isEmail($input) returns $expected", ({ input, expected }) => {
  expect(isEmail(input)).toBe(expected);
});`,

      right: `it("rejects empty string", () => {
  expect(isEmail("")).toBe(false);
});
it("rejects missing @", () => {
  expect(isEmail("abc")).toBe(false);
});
it("rejects missing domain", () => {
  expect(isEmail("abc@")).toBe(false);
});
it("accepts minimal email", () => {
  expect(isEmail("a@b.c")).toBe(true);
});
it("accepts standard email", () => {
  expect(isEmail("user@x.co")).toBe(true);
});`,
    },

    correctSide: "left",
    explanationCorrect:
      "Parameterized tests (it.each) express many input/output pairs in a compact table. Adding a new case is a single line, and the pattern makes it obvious that every row follows the same logic. This reduces duplication and keeps the suite easy to extend.",
    explanationWrong:
      "Writing a separate test for each case duplicates the same assertion structure over and over. With five or more cases the file becomes long and repetitive, and adding a new scenario requires copying boilerplate instead of appending a row.",
    sourceUrl: "https://vitest.dev/api/#test-each",
    sourceLabel: "Vitest: test.each",
  },
  {
    id: "unit-008",
    category: "unit-testing",
    difficulty: "hard",
    title: "Function purity in tests",
    prompt: "Which test is structured more effectively?",
    content: {
      type: "code",

      left: `// Calculate shipping cost
function shippingCost(weightKg, zone) {
  const rate = zone === "domestic" ? 5 : 15;
  return weightKg * rate;
}

it("calculates domestic shipping", () => {
  expect(shippingCost(2, "domestic")).toBe(10);
});

it("calculates international shipping", () => {
  expect(shippingCost(3, "international")).toBe(45);
});`,

      right: `// Calculate shipping cost
let config;

beforeEach(() => {
  config = { domesticRate: 5, internationalRate: 15 };
  global.__shippingConfig = config;
});

afterEach(() => {
  delete global.__shippingConfig;
});

it("calculates domestic shipping", () => {
  const result = getShippingCost(2, "domestic");
  expect(result).toBe(10);
});

it("calculates international shipping", () => {
  const result = getShippingCost(3, "international");
  expect(result).toBe(45);
});`,
    },

    correctSide: "left",
    explanationCorrect:
      "Pure functions take all inputs as arguments and return a result with no hidden dependencies. Tests for pure functions need no setup or teardown, run in any order, and never interfere with each other, making the suite fast and reliable.",
    explanationWrong:
      "Relying on global state means every test must set up and clean up that state correctly. If a test forgets teardown or runs out of order, it can leak configuration into other tests, causing flaky failures that are difficult to reproduce.",
    sourceUrl:
      "https://vitest.dev/guide/common-errors#cannot-redefine-property",
    sourceLabel: "Vitest: Common Errors",
  },
];
