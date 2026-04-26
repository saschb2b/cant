import type { BaseChallenge } from "../../game/types";

export const commonMistakeChallenges: BaseChallenge[] = [
  {
    id: "cm-001",
    category: "common-mistakes",
    difficulty: "easy",
    title: "Overusing any defeats type safety",
    prompt: "Which approach handles data more safely?",
    content: {
      type: "code",

      left: `function processData(data: any) {
  // No errors, but no safety either
  data.forEach((item: any) => {
    console.log(item.naem); // Typo
    updateRecord(item.id.toFixed()); // id might not be number
  });
}

// any spreads: anything derived from
// an any value is also any`,

      right: `interface DataRecord {
  id: number;
  name: string;
  status: "active" | "inactive";
}

function processData(data: DataRecord[]) {
  data.forEach((item) => {
    console.log(item.name); // Autocomplete
    // item.naem; // Error: typo caught
    updateRecord(item.id.toFixed());
  });
}`,
    },

    correctSide: "right",
    explanationCorrect:
      "Defining a proper interface for your data gives you autocomplete, catches typos, and validates operations at compile time. If you receive untyped data (from an API, for example), validate it at the boundary and type it once. Everything downstream benefits from the types.",
    explanationWrong:
      "Using any is viral: any value derived from an any expression is also any. A single any at the top of a data pipeline disables type checking for everything that touches that data. Typos, wrong method calls, and missing properties all compile without errors.",
    sourceUrl:
      "https://www.typescriptlang.org/docs/handbook/2/types-from-types.html",
    sourceLabel: "TypeScript: Types from Types",
  },
  {
    id: "cm-002",
    category: "common-mistakes",
    difficulty: "easy",
    title: "Unnecessary type assertions",
    prompt: "Which way to access DOM elements is safer?",
    content: {
      type: "code",

      left: `const input = document.getElementById(
  "search"
) as HTMLInputElement;

// If the element doesn't exist,
// input is null cast to HTMLInputElement
// Accessing .value crashes at runtime
console.log(input.value);

const data = JSON.parse(raw) as User;
// No runtime validation, just a promise`,

      right: `const input = document.getElementById("search");

if (input instanceof HTMLInputElement) {
  // Safely narrowed to HTMLInputElement
  console.log(input.value);
} else {
  console.error("Search input not found");
}

// For parsed data, validate the shape:
function isUser(val: unknown): val is User {
  return (
    val !== null &&
    typeof val === "object" &&
    "name" in val &&
    "email" in val
  );
}
const parsed: unknown = JSON.parse(raw);
if (isUser(parsed)) {
  console.log(parsed.name); // Safe
}`,
    },

    correctSide: "right",
    explanationCorrect:
      "Type assertions (as) tell TypeScript to trust you, but they perform no runtime checks. Using instanceof narrows the type safely because it actually checks the value at runtime. For parsed JSON, a type guard validates the shape before trusting the data.",
    explanationWrong:
      "Type assertions override the compiler without any runtime verification. If the element is null or not an HTMLInputElement, the assertion still compiles. The crash happens at runtime when you access .value on null. Assertions should be a last resort, not the default approach.",
    sourceUrl:
      "https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#type-assertions",
    sourceLabel: "TypeScript: Type Assertions",
  },
  {
    id: "cm-003",
    category: "common-mistakes",
    difficulty: "medium",
    title: "object vs Record for dictionaries",
    prompt: "Which type works for key-value collections?",
    content: {
      type: "code",

      left: `function countWords(text: string): object {
  const counts: object = {};
  for (const word of text.split(" ")) {
    // Error: Element implicitly has an
    // 'any' type because 'object' has
    // no index signature
    counts[word] = (counts[word] || 0) + 1;
  }
  return counts;
}`,

      right: `function countWords(
  text: string
): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const word of text.split(" ")) {
    counts[word] = (counts[word] || 0) + 1;
    // OK: Record<string, number> has an
    // index signature for string keys
  }
  return counts;
}

// Even better with Map:
// const counts = new Map<string, number>();`,
    },

    correctSide: "right",
    explanationCorrect:
      "The object type means 'any non-primitive' but has no index signature, so you cannot use bracket notation. Record<string, number> creates an index signature that allows string keys with number values. For dynamic key-value collections, Map<K, V> is another good option.",
    explanationWrong:
      "The object type is almost never what you want for dictionaries. It prevents indexing with brackets and provides no information about the value types. Most uses of object should be replaced with Record, a specific interface, or unknown (if you truly don't know the shape).",
    sourceUrl:
      "https://www.typescriptlang.org/docs/handbook/utility-types.html#recordkeys-type",
    sourceLabel: "TypeScript: Record<K, T>",
  },
  {
    id: "cm-004",
    category: "common-mistakes",
    difficulty: "medium",
    title: "The {} type pitfall",
    prompt: "Which expresses the intended constraint?",
    content: {
      type: "code",

      left: `// "{}" does NOT mean "empty object"
function process(value: {}) {
  console.log(value);
}

// All of these are allowed!
process("hello");   // string
process(42);        // number
process(true);      // boolean
process([1, 2, 3]); // array
// {} means "any non-nullish value"`,

      right: `// For "any non-nullish value":
function process(value: NonNullable<unknown>) {
  console.log(value);
}

// For an actual empty object:
type EmptyObject = Record<string, never>;
function processEmpty(value: EmptyObject) {
  // Only accepts {}
}

// For objects with known shape:
interface Config {
  debug: boolean;
  logLevel: string;
}
function processConfig(value: Config) {
  console.log(value.debug);
}`,
    },

    correctSide: "right",
    explanationCorrect:
      "The {} type in TypeScript means 'any value that is not null or undefined.' It accepts strings, numbers, booleans, and objects. For an actual empty object, use Record<string, never>. For 'any non-nullish value', use NonNullable<unknown> which is more explicit about the intent.",
    explanationWrong:
      "Using {} when you mean 'empty object' is misleading because it accepts all non-nullish values. This is a common source of confusion. TypeScript's structural type system means {} is satisfied by anything with zero or more properties, which includes all primitives except null and undefined.",
    sourceUrl:
      "https://www.totaltypescript.com/the-empty-object-type-in-typescript",
    sourceLabel: "Total TypeScript: The Empty Object Type",
  },
  {
    id: "cm-005",
    category: "common-mistakes",
    difficulty: "hard",
    title: "Return type annotations on public APIs",
    prompt: "Which function signature is more maintainable?",
    content: {
      type: "code",

      left: `// No return type annotation
export function createUser(name: string) {
  return {
    id: crypto.randomUUID(),
    name,
    createdAt: new Date(),
    role: "user" as const,
  };
}

// Return type is inferred, but:
// 1. Changing internals silently changes
//    the public API type
// 2. Error messages point to callers,
//    not the function definition`,

      right: `interface User {
  id: string;
  name: string;
  createdAt: Date;
  role: "user" | "admin";
}

export function createUser(name: string): User {
  return {
    id: crypto.randomUUID(),
    name,
    createdAt: new Date(),
    role: "user",
  };
}

// Benefits:
// 1. Public contract is explicit
// 2. Internal changes that break the
//    contract show errors HERE, not in
//    every file that imports the function`,
    },

    correctSide: "right",
    explanationCorrect:
      "Explicit return types on exported functions create a stable public contract. If you accidentally change the return shape, the error appears at the function definition, not in every consuming file. For private/local functions, inference is fine because both the definition and usage are nearby.",
    explanationWrong:
      "Relying on inference for exported functions means the public API type changes silently when internals change. Removing a property, changing a type, or renaming a field causes errors in every file that imports the function, making it hard to trace the root cause.",
    sourceUrl:
      "https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#return-type-annotations",
    sourceLabel: "TypeScript: Return Type Annotations",
  },
  {
    id: "cm-006",
    category: "common-mistakes",
    difficulty: "hard",
    title: "Optional vs undefined properties",
    prompt: "Which models missing vs cleared values?",
    content: {
      type: "code",

      left: `interface FormData {
  name: string;
  nickname?: string;
}

// These are treated the same:
const a: FormData = { name: "Alice" };
const b: FormData = {
  name: "Alice",
  nickname: undefined,
};

// But they behave differently:
"nickname" in a; // false
"nickname" in b; // true
Object.keys(a);  // ["name"]
Object.keys(b);  // ["name", "nickname"]`,

      right: `// Distinguish missing from explicit undefined
// with exactOptionalPropertyTypes: true

interface FormData {
  name: string;
  // Can be missing (not provided)
  nickname?: string;
}

interface FormPatch {
  name?: string;
  // Can be explicitly set to undefined
  // (to clear the value)
  nickname?: string | undefined;
}

// patch.nickname = undefined means "clear it"
// Missing nickname means "don't change it"
function applyPatch(
  data: FormData,
  patch: FormPatch
): FormData {
  return { ...data, ...patch };
}`,
    },

    correctSide: "right",
    explanationCorrect:
      "Optional properties (?) and properties that accept undefined have different semantics. A missing property means 'not specified,' while an explicit undefined means 'intentionally cleared.' This distinction matters for PATCH APIs, form handling, and serialization. The exactOptionalPropertyTypes flag enforces this difference.",
    explanationWrong:
      "Treating optional and undefined as equivalent hides a real semantic difference. In a PATCH request, omitting a field means 'keep the current value,' while sending undefined means 'clear this field.' Without distinguishing the two, you cannot express 'do not change' at the type level.",
    sourceUrl:
      "https://www.typescriptlang.org/tsconfig/#exactOptionalPropertyTypes",
    sourceLabel: "TypeScript: exactOptionalPropertyTypes",
  },
  {
    id: "cm-007",
    category: "common-mistakes",
    difficulty: "medium",
    title: "Type-safe Object.keys",
    prompt: "Which gives type-safe key iteration?",
    content: {
      type: "code",

      left: `const config = { host: "localhost", port: 3000, debug: true };

Object.keys(config).forEach((key) => {
  // key is 'string', not keyof typeof config
  console.log(config[key]); // Error
});`,

      right: `const objectKeys = <T extends object>(
  obj: T
): (keyof T)[] => {
  return Object.keys(obj) as (keyof T)[];
};

const config = { host: "localhost", port: 3000, debug: true };

objectKeys(config).forEach((key) => {
  console.log(config[key]); // OK
});`,
    },

    correctSide: "right",
    explanationCorrect:
      "A generic `objectKeys` wrapper returns `(keyof T)[]` instead of `string[]`. This gives you literal key types when iterating, so `config[key]` is type-safe. The `as` assertion is safe here because `Object.keys` does return the object's own keys at runtime.",
    explanationWrong:
      "`Object.keys` returns `string[]` by design because TypeScript's type system is structural: an object can have more keys at runtime than its type declares. While this is technically correct, it makes key iteration painful. A typed wrapper trades that theoretical safety for practical usability.",
    sourceUrl:
      "https://www.totaltypescript.com/tips/create-your-own-objectkeys-function-using-generics-and-the-keyof-operator",
    sourceLabel: "Total TypeScript: Type-safe Object.keys",
  },
  {
    id: "cm-008",
    category: "common-mistakes",
    difficulty: "easy",
    title: "@ts-expect-error vs @ts-ignore",
    prompt: "Which directive is self-cleaning?",
    content: {
      type: "code",

      left: `// @ts-ignore
const port: number = "3000";

// Later, someone fixes the value:
// const port: number = 3000;
// The @ts-ignore stays, silently hiding
// any future error on this line`,

      right: `// @ts-expect-error: testing invalid assignment
const port: number = "3000";

// Later, when the line is fixed:
// const port: number = 3000;
// TypeScript reports: "Unused @ts-expect-error"
// so you know to remove the directive`,
    },

    correctSide: "right",
    explanationCorrect:
      "`@ts-expect-error` requires the next line to have an error. If the error disappears (because someone fixed the code), TypeScript flags the unused directive. This makes it self-cleaning: you never end up with stale suppressions hiding real issues.",
    explanationWrong:
      "`@ts-ignore` silently suppresses any error on the next line, forever. If the original issue is fixed but a new, different error appears on the same line, `@ts-ignore` hides it. Over time, codebases accumulate `@ts-ignore` comments that mask real bugs.",
    sourceUrl:
      "https://www.totaltypescript.com/concepts/how-to-use-ts-expect-error",
    sourceLabel: "Total TypeScript: @ts-expect-error",
  },
];
