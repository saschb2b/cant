import type { BaseChallenge } from "../../game/types";

export const componentTestingChallenges: BaseChallenge[] = [
  {
    id: "comp-001",
    category: "component-testing",
    difficulty: "easy",
    title: "Query selection strategy",
    prompt: "Which query approach is more resilient to refactoring?",
    content: {
      type: "code",

      left: `import { render, screen } from "@testing-library/react";
import { LoginForm } from "./LoginForm";

test("renders the submit button", () => {
  render(<LoginForm />);

  const button = screen.getByRole("button", {
    name: /sign in/i,
  });

  expect(button).toBeInTheDocument();
});`,

      right: `import { render, screen } from "@testing-library/react";
import { LoginForm } from "./LoginForm";

test("renders the submit button", () => {
  render(<LoginForm />);

  const button = screen.getByTestId(
    "login-submit-btn"
  );

  expect(button).toBeInTheDocument();
});`,
    },

    correctSide: "left",
    explanationCorrect:
      "getByRole queries the accessibility tree, which mirrors how users and assistive technology interact with the page. Tests using role-based queries keep working even when class names, data attributes, or DOM structure change. They also surface missing ARIA roles early.",
    explanationWrong:
      "getByTestId relies on a custom attribute that has no meaning to users or assistive technology. If someone removes or renames the data-testid during a refactor, the test breaks even though the button still works. Role-based queries tie tests to behavior rather than implementation details.",
    sourceUrl: "https://testing-library.com/docs/queries/about/#priority",
    sourceLabel: "Testing Library: Query Priority",
  },
  {
    id: "comp-002",
    category: "component-testing",
    difficulty: "easy",
    title: "User interaction simulation",
    prompt: "Which approach more accurately simulates real user input?",
    content: {
      type: "code",

      left: `import { render, screen, fireEvent } from
  "@testing-library/react";
import { SearchBox } from "./SearchBox";

test("filters results on input", () => {
  render(<SearchBox />);

  const input = screen.getByRole("searchbox");
  fireEvent.change(input, {
    target: { value: "vitest" },
  });

  expect(input).toHaveValue("vitest");
});`,

      right: `import { render, screen } from
  "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SearchBox } from "./SearchBox";

test("filters results on input", async () => {
  const user = userEvent.setup();
  render(<SearchBox />);

  const input = screen.getByRole("searchbox");
  await user.type(input, "vitest");

  expect(input).toHaveValue("vitest");
});`,
    },

    correctSide: "right",
    explanationCorrect:
      "userEvent.type fires the full sequence of keyDown, keyPress, input, and keyUp events for each character, just like a real keyboard. This catches bugs that only appear when event handlers depend on intermediate events such as debounced search or character validation.",
    explanationWrong:
      "fireEvent.change dispatches a single synthetic change event and skips keyboard events entirely. Code that listens for keyDown, input, or focus and blur transitions will not be exercised, leaving gaps in coverage that may hide real bugs.",
    sourceUrl: "https://testing-library.com/docs/user-event/intro/",
    sourceLabel: "Testing Library: user-event Introduction",
  },
  {
    id: "comp-003",
    category: "component-testing",
    difficulty: "medium",
    title: "Async rendering assertions",
    prompt: "Which pattern handles asynchronous UI updates more reliably?",
    content: {
      type: "code",

      left: `import { render, screen } from
  "@testing-library/react";
import { UserProfile } from "./UserProfile";

test("shows the username after fetch", async () => {
  render(<UserProfile id="42" />);

  // Wait for loading to finish
  await new Promise((r) => setTimeout(r, 1000));

  const name = screen.getByText("Alice");
  expect(name).toBeInTheDocument();
});`,

      right: `import { render, screen } from
  "@testing-library/react";
import { UserProfile } from "./UserProfile";

test("shows the username after fetch", async () => {
  render(<UserProfile id="42" />);

  const name = await screen.findByText("Alice");

  expect(name).toBeInTheDocument();
});`,
    },

    correctSide: "right",
    explanationCorrect:
      "findByText internally uses waitFor with a configurable timeout, polling the DOM until the element appears or the timeout expires. This approach is deterministic: it resolves as soon as the element is present, keeping tests fast and independent of network speed.",
    explanationWrong:
      "A fixed setTimeout is a race condition. If the fetch takes longer than 1000 ms in CI, the test fails. If it resolves in 50 ms, the test wastes 950 ms of wall time. Hard-coded delays are a common source of flaky tests and slow suites.",
    sourceUrl:
      "https://testing-library.com/docs/dom-testing-library/api-async/",
    sourceLabel: "Testing Library: Async Utilities",
  },
  {
    id: "comp-004",
    category: "component-testing",
    difficulty: "medium",
    title: "Snapshot testing scope",
    prompt: "Which snapshot testing strategy is easier to maintain over time?",
    content: {
      type: "code",

      left: `import { render } from "@testing-library/react";
import { Dashboard } from "./Dashboard";

test("Dashboard matches snapshot", () => {
  const { container } = render(<Dashboard />);

  // Capture the full rendered tree
  expect(container).toMatchSnapshot();
});`,

      right: `import { render, screen } from
  "@testing-library/react";
import { Dashboard } from "./Dashboard";

test("renders the expected sections", () => {
  render(<Dashboard />);

  const header = screen.getByRole("banner");
  const nav = screen.getByRole("navigation");
  const main = screen.getByRole("main");

  expect(header).toBeInTheDocument();
  expect(nav).toBeInTheDocument();
  expect(main).toBeInTheDocument();
});`,
    },

    correctSide: "right",
    explanationCorrect:
      "Targeted assertions describe the intent of the test. Reviewers can tell at a glance what the test verifies, and the test only fails when the actual contract (landmark roles) changes. This makes pull-request diffs meaningful rather than pages of serialized HTML.",
    explanationWrong:
      "A whole-tree snapshot captures every element, attribute, and whitespace character. Any cosmetic change, such as a new class name or a reordered attribute, produces a diff that reviewers typically approve without reading. Over time these snapshots become rubber-stamped artifacts that verify nothing intentional.",
    sourceUrl: "https://kentcdodds.com/blog/effective-snapshot-testing",
    sourceLabel: "Kent C. Dodds: Effective Snapshot Testing",
  },
  {
    id: "comp-005",
    category: "component-testing",
    difficulty: "medium",
    title: "Testing form validation",
    prompt:
      "Which approach verifies form validation from the user's perspective?",
    content: {
      type: "code",

      left: `import { render, screen } from
  "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SignupForm } from "./SignupForm";

test("shows error for short password", async () => {
  const user = userEvent.setup();
  render(<SignupForm />);

  await user.type(
    screen.getByLabelText(/password/i), "ab"
  );
  await user.click(
    screen.getByRole("button", { name: /submit/i })
  );

  expect(
    await screen.findByText(/at least 8 characters/i)
  ).toBeInTheDocument();
});`,

      right: `import { render } from "@testing-library/react";
import { SignupForm } from "./SignupForm";

test("shows error for short password", () => {
  const { container } = render(<SignupForm />);

  const input = container.querySelector(
    'input[name="password"]'
  );
  const form = container.querySelector("form");

  input.value = "ab";
  form.dispatchEvent(new Event("submit"));

  const error = container.querySelector(
    ".field-error"
  );
  expect(error.textContent).toContain(
    "at least 8 characters"
  );
});`,
    },

    correctSide: "left",
    explanationCorrect:
      "Typing into a labelled field and clicking the submit button replicates the exact flow a user follows. The assertion checks visible text, so the test remains valid regardless of how the error is rendered internally. Label queries also confirm that the input is properly associated with its label.",
    explanationWrong:
      "Querying by CSS selector and manually dispatching events couples the test to class names, DOM structure, and event wiring. If the team switches from a .field-error div to an aria-live region or a toast notification, the test breaks even though the feature still works correctly.",
    sourceUrl: "https://testing-library.com/docs/guide-which-query/",
    sourceLabel: "Testing Library: Which Query Should I Use?",
  },
  {
    id: "comp-006",
    category: "component-testing",
    difficulty: "hard",
    title: "Testing custom hooks",
    prompt:
      "Which pattern tests a custom hook with the least coupling to internals?",
    content: {
      type: "code",

      left: `import { renderHook, act } from
  "@testing-library/react";
import { useCounter } from "./useCounter";

test("increments the count", () => {
  const { result } = renderHook(() =>
    useCounter({ initial: 0 })
  );

  act(() => {
    result.current.increment();
  });

  expect(result.current.count).toBe(1);
});`,

      right: `import { render, screen } from
  "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useCounter } from "./useCounter";

function TestConsumer() {
  const { count, increment } = useCounter({
    initial: 0,
  });
  return (
    <button onClick={increment}>{count}</button>
  );
}

test("increments the count", async () => {
  const user = userEvent.setup();
  render(<TestConsumer />);

  await user.click(screen.getByRole("button"));

  expect(screen.getByRole("button")).toHaveTextContent(
    "1"
  );
});`,
    },

    correctSide: "right",
    explanationCorrect:
      "A lightweight consumer component exercises the hook the same way a real component would, including the render cycle and event handling. This catches issues such as stale closures, missing dependencies in effect arrays, and incorrect batching that renderHook may not surface.",
    explanationWrong:
      "renderHook is convenient, but it calls the hook outside a realistic render tree. Bugs that only manifest during a full React render, such as state batching differences or context-dependent behavior, can slip through. The Testing Library docs recommend testing hooks through a component whenever practical.",
    sourceUrl:
      "https://testing-library.com/docs/react-testing-library/api/#renderhook",
    sourceLabel: "Testing Library: renderHook API",
  },
  {
    id: "comp-007",
    category: "component-testing",
    difficulty: "hard",
    title: "Child component isolation strategy",
    prompt:
      "Which approach to child components produces more reliable integration tests?",
    content: {
      type: "code",

      left: `import { render, screen } from
  "@testing-library/react";
import { OrderSummary } from "./OrderSummary";

// Mock the child components
vi.mock("./LineItems", () => ({
  LineItems: () => <div data-testid="line-items" />,
}));
vi.mock("./TotalPrice", () => ({
  TotalPrice: () => <span data-testid="total" />,
}));

test("renders order sections", () => {
  render(<OrderSummary orderId="99" />);

  expect(screen.getByTestId("line-items"))
    .toBeInTheDocument();
  expect(screen.getByTestId("total"))
    .toBeInTheDocument();
});`,

      right: `import { render, screen } from
  "@testing-library/react";
import { OrderSummary } from "./OrderSummary";
import { server } from "../mocks/server";
import { http, HttpResponse } from "msw";

test("renders order with line items", async () => {
  server.use(
    http.get("/api/orders/99", () =>
      HttpResponse.json({
        items: [{ name: "Widget", qty: 2 }],
        total: 25.0,
      })
    )
  );

  render(<OrderSummary orderId="99" />);

  expect(await screen.findByText("Widget"))
    .toBeInTheDocument();
  expect(screen.getByText("$25.00"))
    .toBeInTheDocument();
});`,
    },

    correctSide: "right",
    explanationCorrect:
      "Rendering the full component tree with a mocked network layer tests the real integration between parent and children. If a prop name changes or a child is refactored, the test still passes as long as the visible output is correct. MSW intercepts requests at the network level, leaving application code untouched.",
    explanationWrong:
      "Mocking child components replaces the actual rendering with stubs that only prove the parent references the right module path. The test cannot verify that props are passed correctly, that children render the data, or that the overall layout is intact. Any refactor that splits or merges child components forces the mocks to be rewritten.",
    sourceUrl: "https://mswjs.io/docs/philosophy",
    sourceLabel: "MSW: Philosophy",
  },
  {
    id: "comp-008",
    category: "component-testing",
    difficulty: "hard",
    title: "Testing accessibility in components",
    prompt: "Which strategy catches accessibility issues more thoroughly?",
    content: {
      type: "code",

      left: `import { render, screen } from
  "@testing-library/react";
import { Modal } from "./Modal";

test("modal is accessible", () => {
  render(<Modal open title="Confirm" />);

  const dialog = screen.getByRole("dialog", {
    name: "Confirm",
  });

  expect(dialog).toBeInTheDocument();
  expect(dialog).toHaveAttribute(
    "aria-modal", "true"
  );
});`,

      right: `import { render } from "@testing-library/react";
import { axe, toHaveNoViolations } from
  "jest-axe";
import { Modal } from "./Modal";

expect.extend(toHaveNoViolations);

test("modal has no a11y violations", async () => {
  const { container } = render(
    <Modal open title="Confirm">
      <p>Are you sure?</p>
      <button>Yes</button>
      <button>No</button>
    </Modal>
  );

  const results = await axe(container);
  expect(results).toHaveNoViolations();
});`,
    },

    correctSide: "right",
    explanationCorrect:
      "Running axe against the rendered DOM audits dozens of WCAG rules at once: color contrast, missing labels, invalid ARIA attributes, focus order, and more. This catches classes of issues that a few manual assertions would never cover, and the audit stays current as axe updates its rule set.",
    explanationWrong:
      "Checking individual ARIA attributes is useful but narrow. A test that asserts aria-modal and a role can still pass while the modal traps focus incorrectly, has insufficient color contrast, or nests interactive elements improperly. Manual assertions scale poorly as components grow in complexity.",
    sourceUrl: "https://github.com/dequelabs/axe-core/blob/develop/doc/API.md",
    sourceLabel: "axe-core: API Documentation",
  },
];
