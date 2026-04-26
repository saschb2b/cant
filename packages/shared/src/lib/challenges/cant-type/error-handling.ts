import type { BaseChallenge } from "../../game/types";

export const errorHandlingChallenges: BaseChallenge[] = [
  {
    id: "eh-001",
    category: "error-handling",
    difficulty: "easy",
    title: "unknown vs any in catch blocks",
    prompt: "Which catch block handles all thrown values?",
    content: {
      type: "code",

      left: `try {
  await fetchData();
} catch (error) {
  // With useUnknownInCatchVariables: false
  // error is 'any'
  console.log(error.message);
  // Works for Error objects but crashes
  // if a string or number was thrown
  showToast(error.message);
}`,

      right: `try {
  await fetchData();
} catch (error) {
  // error is 'unknown'
  if (error instanceof Error) {
    console.log(error.message);
    showToast(error.message);
  } else {
    console.log("Unknown error:", error);
    showToast("An unexpected error occurred");
  }
}`,
    },

    correctSide: "right",
    explanationCorrect:
      "When catch variables are unknown, TypeScript forces you to narrow the type before accessing properties. This is correct because JavaScript allows throwing any value: strings, numbers, objects, or Error instances. The instanceof check narrows to Error and provides safe access to .message and .stack.",
    explanationWrong:
      "When catch variables are any, TypeScript lets you access .message directly. But if someone throws a string (throw 'failed') or a plain object (throw { code: 404 }), accessing .message gives undefined instead of the actual error. The bug is silent and hard to trace.",
    sourceUrl:
      "https://www.typescriptlang.org/tsconfig/#useUnknownInCatchVariables",
    sourceLabel: "TypeScript: useUnknownInCatchVariables",
  },
  {
    id: "eh-002",
    category: "error-handling",
    difficulty: "easy",
    title: "Type narrowing errors safely",
    prompt: "Which extracts an error message safely?",
    content: {
      type: "code",

      left: `function handleError(error: unknown) {
  // Unsafe: type assertion
  const err = error as Error;
  logToService(err.message, err.stack);
  // If error is not an Error instance,
  // err.message is undefined
  // err.stack is undefined
}`,

      right: `function getErrorMessage(
  error: unknown
): string {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === "string") {
    return error;
  }
  if (
    error !== null &&
    typeof error === "object" &&
    "message" in error &&
    typeof (error as { message: unknown }).message === "string"
  ) {
    return (error as { message: string }).message;
  }
  return "An unknown error occurred";
}`,
    },

    correctSide: "right",
    explanationCorrect:
      "A robust error handler should handle Error instances, plain strings, and objects with a message property. Each branch narrows the type progressively, and the final fallback ensures every case returns a useful string. This pattern works with any thrown value.",
    explanationWrong:
      "Asserting unknown to Error with 'as' bypasses type checking. If the caught value is a string, accessing .message returns undefined, and .stack returns undefined. The type assertion tells TypeScript to trust you, but the runtime value does not match.",
    sourceUrl: "https://www.typescriptlang.org/docs/handbook/2/narrowing.html",
    sourceLabel: "TypeScript: Narrowing",
  },
  {
    id: "eh-003",
    category: "error-handling",
    difficulty: "medium",
    title: "Result type pattern",
    prompt: "Which makes failure visible in the types?",
    content: {
      type: "code",

      left: `async function fetchUser(
  id: string
): Promise<User> {
  const res = await fetch(\`/api/users/\${id}\`);
  if (!res.ok) {
    throw new Error(\`HTTP \${res.status}\`);
  }
  return res.json();
}

// Caller must remember to try/catch
// Nothing in the type signature indicates
// this function can fail
const user = await fetchUser("123");`,

      right: `type Result<T, E = Error> =
  | { ok: true; value: T }
  | { ok: false; error: E };

async function fetchUser(
  id: string
): Promise<Result<User>> {
  try {
    const res = await fetch(\`/api/users/\${id}\`);
    if (!res.ok) {
      return { ok: false, error: new Error(\`HTTP \${res.status}\`) };
    }
    return { ok: true, value: await res.json() };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e : new Error(String(e)) };
  }
}

const result = await fetchUser("123");
if (result.ok) {
  console.log(result.value.name);
} else {
  console.log(result.error.message);
}`,
    },

    correctSide: "right",
    explanationCorrect:
      "The Result type makes failure explicit in the function signature. Callers cannot access the value without first checking ok, so error handling is enforced at compile time. This pattern is inspired by Rust's Result type and eliminates forgotten try/catch blocks.",
    explanationWrong:
      "Throwing exceptions hides failure modes from the type signature. Promise<User> says nothing about possible errors, so callers may forget to add try/catch. The error surfaces as an unhandled promise rejection at runtime instead of a compile-time type error.",
    sourceUrl: "https://www.totaltypescript.com/concepts/result-type",
    sourceLabel: "Total TypeScript: Result Type",
  },
  {
    id: "eh-004",
    category: "error-handling",
    difficulty: "medium",
    title: "Assertion functions",
    prompt: "Which preserves type narrowing in the caller?",
    content: {
      type: "code",

      left: `function processOrder(order: Order | null) {
  if (!order) {
    throw new Error("Order is required");
  }
  // TypeScript narrows after the if block
  // But what if we extract the check?
}

function validateOrder(order: Order | null) {
  if (!order) throw new Error("Order is required");
  // Calling validateOrder does NOT narrow
  // the type in the caller
}

function process(order: Order | null) {
  validateOrder(order);
  order.id; // Error: possibly null
}`,

      right: `function assertOrder(
  order: Order | null
): asserts order is Order {
  if (!order) {
    throw new Error("Order is required");
  }
}

function process(order: Order | null) {
  assertOrder(order);
  // TypeScript knows order is Order here
  console.log(order.id); // OK, not null

  // Also works with conditions:
  // function assertDefined<T>(
  //   val: T
  // ): asserts val is NonNullable<T>
}`,
    },

    correctSide: "right",
    explanationCorrect:
      "Assertion functions use the `asserts` return type to tell TypeScript that if the function returns normally (without throwing), the parameter has been narrowed. This lets you extract validation logic into reusable functions while preserving type narrowing in the caller.",
    explanationWrong:
      "A regular function that throws on invalid input does not communicate the narrowing to TypeScript. The caller still sees the original type after the function call. You would need to repeat the if-check inline or use a type assertion, both of which are worse than an assertion function.",
    sourceUrl:
      "https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-7.html#assertion-functions",
    sourceLabel: "TypeScript: Assertion Functions",
  },
  {
    id: "eh-005",
    category: "error-handling",
    difficulty: "hard",
    title: "Custom error classes with instanceof",
    prompt: "Which distinguishes error types reliably?",
    content: {
      type: "code",

      left: `// Using plain Error for everything
async function fetchData(url: string) {
  const res = await fetch(url);
  if (res.status === 404) throw new Error("Not found");
  if (res.status === 401) throw new Error("Unauthorized");
  if (!res.ok) throw new Error("Request failed");
  return res.json();
}

try {
  await fetchData("/api/user");
} catch (e) {
  // How to distinguish error types?
  if ((e as Error).message === "Not found") {
    // Fragile string comparison
  }
}`,

      right: `class NotFoundError extends Error {
  constructor(public resource: string) {
    super(\`\${resource} not found\`);
    this.name = "NotFoundError";
  }
}

class UnauthorizedError extends Error {
  constructor() {
    super("Authentication required");
    this.name = "UnauthorizedError";
  }
}

try {
  await fetchData("/api/user");
} catch (e) {
  if (e instanceof NotFoundError) {
    redirect(\`/404?resource=\${e.resource}\`);
  } else if (e instanceof UnauthorizedError) {
    redirect("/login");
  } else {
    showGenericError();
  }
}`,
    },

    correctSide: "right",
    explanationCorrect:
      "Custom error classes let you use instanceof for type-safe branching. Each error class can carry structured data (like the resource name) instead of encoding information in message strings. TypeScript narrows the type inside each instanceof branch, giving you access to class-specific properties.",
    explanationWrong:
      "Comparing error messages with string equality is fragile. Changing the message text breaks the comparison silently. Custom error classes provide stable identity through instanceof and can carry structured metadata that string messages cannot represent.",
    sourceUrl:
      "https://www.typescriptlang.org/docs/handbook/2/classes.html#extends-clauses",
    sourceLabel: "TypeScript: Class Inheritance",
  },
  {
    id: "eh-006",
    category: "error-handling",
    difficulty: "hard",
    title: "Exhaustive error handling",
    prompt: "Which catches unhandled error cases at build?",
    content: {
      type: "code",

      left: `type ApiError =
  | { type: "network" }
  | { type: "auth" }
  | { type: "validation"; fields: string[] };

function handleError(error: ApiError) {
  switch (error.type) {
    case "network":
      showRetryDialog();
      break;
    case "auth":
      redirectToLogin();
      break;
    // Forgot "validation" case
    // No compile error, silently unhandled
  }
}`,

      right: `type ApiError =
  | { type: "network" }
  | { type: "auth" }
  | { type: "validation"; fields: string[] }
  | { type: "rate-limit"; retryAfter: number };

function assertNever(value: never): never {
  throw new Error(
    \`Unhandled case: \${JSON.stringify(value)}\`
  );
}

function handleError(error: ApiError) {
  switch (error.type) {
    case "network":
      return showRetryDialog();
    case "auth":
      return redirectToLogin();
    case "validation":
      return showFieldErrors(error.fields);
    case "rate-limit":
      return showRetryAfter(error.retryAfter);
    default:
      return assertNever(error);
      // Compile error if a case is missing
  }
}`,
    },

    correctSide: "right",
    explanationCorrect:
      "The assertNever function takes a value of type never, which is only valid when all union members have been handled. If you add a new error type to the union without adding a case, TypeScript reports a compile error because the value is not never. This guarantees exhaustive handling.",
    explanationWrong:
      "Without exhaustive checking, adding a new member to the ApiError union does not produce any compiler warnings in existing switch statements. The new error type falls through silently, and the bug only appears when that specific error occurs at runtime and is not handled.",
    sourceUrl:
      "https://www.typescriptlang.org/docs/handbook/2/narrowing.html#exhaustiveness-checking",
    sourceLabel: "TypeScript: Exhaustiveness Checking",
  },
];
