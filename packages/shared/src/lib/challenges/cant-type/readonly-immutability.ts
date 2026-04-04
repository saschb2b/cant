import type { BaseChallenge } from "../../game/types";

export const readonlyImmutabilityChallenges: BaseChallenge[] = [
  {
    id: "ri-001",
    category: "readonly-immutability",
    difficulty: "easy",
    title: "Readonly properties prevent accidental mutation",
    prompt: "Which prevents accidental reassignment?",
    content: {
      type: "code",

      left: `interface Config {
  apiUrl: string;
  timeout: number;
}

const config: Config = {
  apiUrl: "https://api.example.com",
  timeout: 5000,
};

// Oops, accidentally mutated config
config.timeout = -1;
// No error, invalid state`,

      right: `interface Config {
  readonly apiUrl: string;
  readonly timeout: number;
}

const config: Config = {
  apiUrl: "https://api.example.com",
  timeout: 5000,
};

// config.timeout = -1;
// Error: Cannot assign to 'timeout'
// because it is a read-only property`,
    },

    correctSide: "right",
    explanationCorrect:
      "The readonly modifier on interface properties prevents reassignment after initialization. This catches accidental mutations at compile time. It is especially valuable for configuration objects that should be set once and never changed.",
    explanationWrong:
      "Without readonly, any code with a reference to the config object can change its properties. A single accidental assignment like config.timeout = -1 creates an invalid state that affects the entire application. The bug may surface far from where the mutation happened.",
    sourceUrl:
      "https://www.typescriptlang.org/docs/handbook/2/objects.html#readonly-properties",
    sourceLabel: "TypeScript: Readonly Properties",
  },
  {
    id: "ri-002",
    category: "readonly-immutability",
    difficulty: "easy",
    title: "Readonly<T> utility type",
    prompt: "Which signals the function only reads data?",
    content: {
      type: "code",

      left: `interface User {
  name: string;
  email: string;
  role: "admin" | "user";
}

function displayUser(user: User) {
  // Function accidentally mutates input
  user.role = "admin";
  // Caller's object is now corrupted
  console.log(user.name);
}`,

      right: `interface User {
  name: string;
  email: string;
  role: "admin" | "user";
}

function displayUser(user: Readonly<User>) {
  // user.role = "admin";
  // Error: Cannot assign to 'role'
  console.log(user.name); // OK to read
}

// Original User type is still mutable
// where mutation is intended
function promoteUser(user: User) {
  user.role = "admin"; // OK
}`,
    },

    correctSide: "right",
    explanationCorrect:
      "Readonly<T> makes all properties of T readonly without changing the original type. Applying it to function parameters signals that the function only reads the data. Functions that need to mutate can still use the original mutable type.",
    explanationWrong:
      "Passing a mutable type to a function gives it permission to modify the object. Since objects are passed by reference, the caller's data is corrupted. This is a common source of bugs in functions that are supposed to only read their input.",
    sourceUrl:
      "https://www.typescriptlang.org/docs/handbook/utility-types.html#readonlytype",
    sourceLabel: "TypeScript: Readonly<T>",
  },
  {
    id: "ri-003",
    category: "readonly-immutability",
    difficulty: "medium",
    title: "ReadonlyArray prevents mutations",
    prompt: "Which avoids mutating the original array?",
    content: {
      type: "code",

      left: `function getTopScores(
  scores: number[]
): number[] {
  // Sort mutates the original array!
  scores.sort((a, b) => b - a);
  return scores.slice(0, 3);
}

const allScores = [42, 99, 17, 88, 73];
const top3 = getTopScores(allScores);
// allScores is now [99, 88, 73, 42, 17]
// Original order is destroyed`,

      right: `function getTopScores(
  scores: readonly number[]
): number[] {
  // scores.sort(...);
  // Error: Property 'sort' does not exist
  // on type 'readonly number[]'

  // Must create a new array first:
  return [...scores]
    .sort((a, b) => b - a)
    .slice(0, 3);
}

const allScores = [42, 99, 17, 88, 73];
const top3 = getTopScores(allScores);
// allScores is still [42, 99, 17, 88, 73]`,
    },

    correctSide: "right",
    explanationCorrect:
      "readonly number[] (or ReadonlyArray<number>) removes mutating methods like sort, push, pop, and splice from the type. This forces you to copy the array before sorting, preventing accidental mutation of the caller's data. The spread operator creates a shallow copy that is safe to sort.",
    explanationWrong:
      "Array.sort() mutates the array in place and returns the same reference. When a function sorts its input array, the caller's original data is permanently reordered. This is one of the most common mutation bugs in JavaScript, and readonly arrays catch it at compile time.",
    sourceUrl:
      "https://www.typescriptlang.org/docs/handbook/2/objects.html#readonly-tuple-types",
    sourceLabel: "TypeScript: Readonly Arrays",
  },
  {
    id: "ri-004",
    category: "readonly-immutability",
    difficulty: "medium",
    title: "as const for tuple inference",
    prompt: "Which produces a useful union type?",
    content: {
      type: "code",

      left: `const COLORS = ["red", "green", "blue"];
// Type: string[]

type Color = typeof COLORS[number];
// Type: string (not useful)

function setColor(color: Color) {
  // Accepts any string, not just
  // "red" | "green" | "blue"
}

setColor("banana"); // No error`,

      right: `const COLORS = ["red", "green", "blue"] as const;
// Type: readonly ["red", "green", "blue"]

type Color = typeof COLORS[number];
// Type: "red" | "green" | "blue"

function setColor(color: Color) {
  // Only accepts the three valid colors
}

setColor("red");    // OK
// setColor("banana"); // Error`,
    },

    correctSide: "right",
    explanationCorrect:
      "The as const assertion tells TypeScript to infer the narrowest possible type: a readonly tuple of literal strings instead of a mutable array of string. Indexing with [number] extracts a union of the literal types. This keeps the runtime array and the type in sync from a single source of truth.",
    explanationWrong:
      "Without as const, TypeScript widens the array to string[]. Extracting a type with typeof COLORS[number] gives string, which accepts any string value. The intended constraint of only three valid colors is lost, and typos like 'banana' pass without errors.",
    sourceUrl:
      "https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#literal-types",
    sourceLabel: "TypeScript: Literal Types",
  },
  {
    id: "ri-005",
    category: "readonly-immutability",
    difficulty: "hard",
    title: "Deep readonly for nested objects",
    prompt: "Which protects nested properties too?",
    content: {
      type: "code",

      left: `interface AppState {
  readonly user: {
    name: string;
    preferences: {
      theme: "light" | "dark";
    };
  };
}

const state: AppState = {
  user: {
    name: "Alice",
    preferences: { theme: "light" },
  },
};

// state.user = ...; // Error (readonly)
state.user.name = "Bob"; // No error!
state.user.preferences.theme = "dark"; // No error!
// readonly is only one level deep`,

      right: `type DeepReadonly<T> = T extends object
  ? { readonly [K in keyof T]: DeepReadonly<T[K]> }
  : T;

interface AppState {
  user: {
    name: string;
    preferences: {
      theme: "light" | "dark";
    };
  };
}

const state: DeepReadonly<AppState> = {
  user: {
    name: "Alice",
    preferences: { theme: "light" },
  },
};

// state.user.name = "Bob"; // Error
// state.user.preferences.theme = "dark";
// Error: Cannot assign to 'theme'`,
    },

    correctSide: "right",
    explanationCorrect:
      "Readonly<T> and the readonly modifier only apply to the immediate properties. Nested objects remain mutable. A recursive DeepReadonly type applies readonly at every level by checking if the value is an object and recursively wrapping it. This provides true immutability for the entire object tree.",
    explanationWrong:
      "Marking only the top-level property as readonly gives a false sense of security. The nested properties are still fully mutable, so code can change user.name or preferences.theme without any compiler warning. For state management, shallow readonly is often insufficient.",
    sourceUrl:
      "https://www.typescriptlang.org/docs/handbook/utility-types.html#readonlytype",
    sourceLabel: "TypeScript: Readonly<T>",
  },
  {
    id: "ri-006",
    category: "readonly-immutability",
    difficulty: "hard",
    title: "Readonly function parameters",
    prompt: "Which keeps the caller's data untouched?",
    content: {
      type: "code",

      left: `interface CartItem {
  id: string;
  quantity: number;
  price: number;
}

function calculateTotal(items: CartItem[]) {
  let total = 0;
  // Accidentally mutating while iterating
  for (const item of items) {
    item.price = item.price * 1.1; // Add tax
    total += item.price * item.quantity;
  }
  return total;
  // Caller's items now have inflated prices
  // Calling twice doubles the tax
}`,

      right: `interface CartItem {
  id: string;
  quantity: number;
  price: number;
}

function calculateTotal(
  items: ReadonlyArray<Readonly<CartItem>>
) {
  let total = 0;
  for (const item of items) {
    // item.price = item.price * 1.1;
    // Error: Cannot assign to 'price'
    const priceWithTax = item.price * 1.1;
    total += priceWithTax * item.quantity;
  }
  return total;
  // Caller's data is untouched
}`,
    },

    correctSide: "right",
    explanationCorrect:
      "Combining ReadonlyArray (prevents push/pop/splice) with Readonly on each element (prevents property assignment) provides full protection. The function is forced to use local variables for computed values instead of mutating the input. This makes the function pure and safe to call repeatedly.",
    explanationWrong:
      "Mutating input data inside a calculation function is a common bug that produces incorrect results when the function is called more than once. The tax gets applied again to already-taxed prices, compounding with each call. Readonly parameters make this impossible at compile time.",
    sourceUrl:
      "https://www.typescriptlang.org/docs/handbook/2/objects.html#readonly-properties",
    sourceLabel: "TypeScript: Readonly Properties",
  },
];
