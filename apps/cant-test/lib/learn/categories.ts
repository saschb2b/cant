import type { ChallengeCategory } from "./types";

/** Canonical display order of challenge categories. */
export const CATEGORY_ORDER: ChallengeCategory[] = [
  // Fundamentals
  "unit-testing",
  "integration-testing",
  "component-testing",
  // Strategy & Design
  "test-strategy",
  "mocking-stubbing",
  // Advanced
  "async-testing",
  "ci-test-infra",
];

/** Human-readable labels for each challenge category. */
export const CATEGORY_LABELS: Record<ChallengeCategory, string> = {
  "unit-testing": "Unit Testing",
  "integration-testing": "Integration Testing",
  "component-testing": "Component Testing",
  "test-strategy": "Test Strategy",
  "mocking-stubbing": "Mocking & Stubbing",
  "async-testing": "Async & Timing",
  "ci-test-infra": "CI & Test Infrastructure",
};

/** Logical grouping of categories for sidebar navigation. */
export interface CategorySection {
  label: string;
  categories: ChallengeCategory[];
}

export const CATEGORY_SECTIONS: CategorySection[] = [
  {
    label: "Fundamentals",
    categories: ["unit-testing", "integration-testing", "component-testing"],
  },
  {
    label: "Strategy & Design",
    categories: ["test-strategy", "mocking-stubbing"],
  },
  {
    label: "Advanced",
    categories: ["async-testing", "ci-test-infra"],
  },
];

/** Recommended category order for newcomers starting from scratch. */
export const LEARNING_PATH: ChallengeCategory[] = [
  "unit-testing",
  "test-strategy",
  "mocking-stubbing",
  "component-testing",
  "async-testing",
];

/** Short description for each category, shown on the learn overview. */
export const CATEGORY_DESCRIPTIONS: Record<ChallengeCategory, string> = {
  "unit-testing":
    "Test structure, assertions, naming, arrange-act-assert, and isolation. You'll hit this when tests are hard to read, break on refactors, or test implementation details instead of behavior.",
  "integration-testing":
    "Database tests, API tests, service boundaries, and end-to-end flows. You'll hit this when unit tests pass but the app breaks in production, or when test setup takes longer than the test itself.",
  "component-testing":
    "React Testing Library, user-event, accessibility queries, and snapshot testing. You'll hit this when tests break on every CSS change, or when you can't tell whether a component actually works for users.",
  "test-strategy":
    "Test pyramid, test trophy, coverage goals, and when to skip tests. You'll hit this when you have 1000 tests but still ship bugs, or when test suites take 45 minutes to run.",
  "mocking-stubbing":
    "When to mock, mock vs stub vs spy, over-mocking, and dependency injection. You'll hit this when mocked tests pass but production fails, or when changing one module breaks 50 test files.",
  "async-testing":
    "Async assertions, timers, flaky tests, race conditions, and waitFor patterns. You'll hit this when tests pass locally but fail in CI, or when you add sleep calls to make tests green.",
  "ci-test-infra":
    "Test runners, parallel execution, test environments, reporting, and flake detection. You'll hit this when your CI pipeline takes 30 minutes, tests fight over shared state, or nobody trusts the test suite.",
};
