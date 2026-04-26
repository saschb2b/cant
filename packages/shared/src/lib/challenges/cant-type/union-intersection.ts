import type { BaseChallenge } from "../../game/types";

export const unionIntersectionChallenges: BaseChallenge[] = [
  {
    id: "ui-001",
    category: "union-intersection",
    difficulty: "easy",
    title: "Union for variants",
    prompt: "Which catches invalid status values?",
    content: {
      type: "code",

      left: `// Overly broad type
function setStatus(status: string) {
  // Any string is accepted
}

setStatus("active");  // OK
setStatus("acitve");  // No error, typo undetected
setStatus("banana");  // No error, nonsense value`,

      right: `type Status = "active" | "inactive" | "pending";

function setStatus(status: Status) {
  // Only valid values accepted
}

setStatus("active");  // OK
setStatus("acitve");  // Error: typo caught
setStatus("banana");  // Error: not a valid Status`,
    },

    correctSide: "right",
    explanationCorrect:
      "A string literal union limits values to an exact set of allowed strings. TypeScript catches typos and invalid values at compile time. You also get autocomplete when typing the argument, which makes the API self-documenting.",
    explanationWrong:
      "Using `string` accepts any string, so typos and nonsense values compile without errors. The bug only surfaces at runtime when the code does not recognize the value. Literal unions catch these mistakes during development.",
    sourceUrl:
      "https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#union-types",
    sourceLabel: "TypeScript Handbook: Union types",
  },
  {
    id: "ui-002",
    category: "union-intersection",
    difficulty: "easy",
    title: "Discriminated unions with switch",
    prompt: "Which guarantees data exists when needed?",
    content: {
      type: "code",

      left: `type Result = {
  success: boolean;
  data?: string;
  error?: string;
};

function handle(result: Result) {
  if (result.success) {
    // data might still be undefined
    console.log(result.data.toUpperCase());
  }
}`,

      right: `type Result =
  | { status: "ok"; data: string }
  | { status: "error"; error: string };

function handle(result: Result) {
  switch (result.status) {
    case "ok":
      console.log(result.data.toUpperCase()); // safe
      break;
    case "error":
      console.log(result.error); // safe
      break;
  }
}`,
    },

    correctSide: "right",
    explanationCorrect:
      'A discriminated union with a `status` field guarantees that `data` exists when status is `"ok"` and `error` exists when status is `"error"`. Each branch has exactly the properties it needs, with no optional fields to check.',
    explanationWrong:
      "A boolean `success` field with optional `data` and `error` does not guarantee that `data` exists when `success` is true. TypeScript cannot narrow based on a boolean flag linked to optional properties. You can still get `undefined` at runtime.",
    sourceUrl:
      "https://www.typescriptlang.org/docs/handbook/2/narrowing.html#discriminated-unions",
    sourceLabel: "TypeScript Handbook: Discriminated unions",
  },
  {
    id: "ui-003",
    category: "union-intersection",
    difficulty: "medium",
    title: "Exhaustive checks with never",
    prompt: "Which catches missing switch cases at build?",
    content: {
      type: "code",

      left: `type Shape = "circle" | "square" | "triangle";

function area(shape: Shape) {
  switch (shape) {
    case "circle":
      return Math.PI * 10 ** 2;
    case "square":
      return 10 * 10;
    // Forgot "triangle"!
    // No compile error, returns undefined
  }
}`,

      right: `type Shape = "circle" | "square" | "triangle";

function area(shape: Shape) {
  switch (shape) {
    case "circle":
      return Math.PI * 10 ** 2;
    case "square":
      return 10 * 10;
    case "triangle":
      return (10 * 8.66) / 2;
    default: {
      const _exhaustive: never = shape;
      return _exhaustive;
    }
  }
}`,
    },

    correctSide: "right",
    explanationCorrect:
      "Assigning `shape` to a `never` variable in the default case fails at compile time if any union member is unhandled. When you add a new variant to `Shape`, every switch statement with this pattern produces an error until you handle it. This is called an exhaustive check.",
    explanationWrong:
      "Without an exhaustive check, forgetting a case silently returns `undefined`. Worse, when a new variant is added to the union later, there is no compiler error to remind you to handle it. Bugs surface at runtime instead of at build time.",
    sourceUrl:
      "https://www.typescriptlang.org/docs/handbook/2/narrowing.html#exhaustiveness-checking",
    sourceLabel: "TypeScript Handbook: Exhaustiveness checking",
  },
  {
    id: "ui-004",
    category: "union-intersection",
    difficulty: "medium",
    title: "Narrowing unions",
    prompt: "Which safely accesses variant-specific fields?",
    content: {
      type: "code",

      left: `type Admin = { role: "admin"; permissions: string[] };
type Guest = { role: "guest" };

type User = Admin | Guest;

function showPermissions(user: User) {
  // Error: permissions doesn't exist on Guest
  return user.permissions.join(", ");
}`,

      right: `type Admin = { role: "admin"; permissions: string[] };
type Guest = { role: "guest" };

type User = Admin | Guest;

function showPermissions(user: User) {
  if (user.role === "admin") {
    return user.permissions.join(", ");
  }
  return "No permissions (guest)";
}`,
    },

    correctSide: "right",
    explanationCorrect:
      'Checking `user.role === "admin"` narrows the type to `Admin`, making `permissions` safely accessible. The discriminant field `role` tells TypeScript exactly which variant you are working with. The else branch knows the user is a `Guest`.',
    explanationWrong:
      "Without narrowing, TypeScript sees the full union and only allows access to properties common to all variants. Since `Guest` does not have `permissions`, direct access is a compile error. You must check the discriminant first.",
    sourceUrl: "https://www.typescriptlang.org/docs/handbook/2/narrowing.html",
    sourceLabel: "TypeScript Handbook: Narrowing",
  },
  {
    id: "ui-005",
    category: "union-intersection",
    difficulty: "hard",
    title: "Intersection for composition",
    prompt: "Which keeps type pieces reusable?",
    content: {
      type: "code",

      left: `// One giant interface for everything
interface User {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
  lastLogin: Date;
  preferences: Record<string, string>;
}`,

      right: `interface Identity {
  id: string;
  name: string;
  email: string;
}

interface Timestamps {
  createdAt: Date;
  updatedAt: Date;
}

interface Trackable {
  lastLogin: Date;
  preferences: Record<string, string>;
}

type User = Identity & Timestamps & Trackable;`,
    },

    correctSide: "right",
    explanationCorrect:
      "Intersection types (`&`) combine multiple interfaces into one. Each piece is reusable on its own: `Timestamps` can be used for posts, comments, or any entity. The resulting `User` type has all properties from all three interfaces.",
    explanationWrong:
      "A monolithic interface mixes unrelated concerns. If another entity needs timestamps, you either duplicate the fields or create an awkward inheritance chain. Composing small interfaces with intersections keeps things modular and reusable.",
    sourceUrl:
      "https://www.typescriptlang.org/docs/handbook/2/objects.html#intersection-types",
    sourceLabel: "TypeScript Handbook: Intersection types",
  },
  {
    id: "ui-006",
    category: "union-intersection",
    difficulty: "hard",
    title: "Union vs enum",
    prompt: "Which adds zero bytes to the bundle?",
    content: {
      type: "code",

      left: `enum Direction {
  Up = "UP",
  Down = "DOWN",
  Left = "LEFT",
  Right = "RIGHT",
}

// Enums create runtime objects
// Enums are nominal: "UP" !== Direction.Up in some cases
// Enums add JS output even when only used as types
function move(dir: Direction) { }
move(Direction.Up);`,

      right: `type Direction = "UP" | "DOWN" | "LEFT" | "RIGHT";

// Zero runtime cost, just types
// Plain strings work directly
// JSON payloads match without conversion
function move(dir: Direction) { }
move("UP");`,
    },

    correctSide: "right",
    explanationCorrect:
      "String literal unions are erased at compile time, adding zero bytes to the bundle. They work naturally with JSON (no need to convert strings to enum values), and they provide the same autocomplete and type checking as enums. For most use cases, unions are simpler.",
    explanationWrong:
      "String enums generate a runtime JavaScript object, increasing bundle size. They also require importing the enum to use its values, which can be awkward with JSON data from APIs. Unions are lighter and more interoperable for string-based value sets.",
    sourceUrl: "https://www.totaltypescript.com/concepts/unions-vs-enums",
    sourceLabel: "Total TypeScript: Unions vs Enums",
  },
  {
    id: "ui-007",
    category: "union-intersection",
    difficulty: "hard",
    title: "Loose autocomplete with string unions",
    prompt: "Which preserves autocomplete suggestions?",
    content: {
      type: "code",

      left: `type IconSize = "sm" | "md" | "lg" | string;

function setSize(size: IconSize) { }

// TypeScript collapses the union to just 'string'
// No autocomplete for "sm", "md", "lg"
setSize("sm");   // No suggestions
setSize("xl");   // No error, no help`,

      right: `type LooseAutocomplete<T extends string> =
  | T
  | (string & {});

type IconSize = LooseAutocomplete<"sm" | "md" | "lg">;

function setSize(size: IconSize) { }

setSize("sm");   // OK, autocomplete works
setSize("xl");   // OK, arbitrary strings allowed`,
    },

    correctSide: "right",
    explanationCorrect:
      "The `string & {}` trick preserves autocomplete for known values while still accepting any string. TypeScript sees `string & {}` as a separate branch from the literals, so it does not collapse the union. This is useful for icon sizes, color names, or any API where you want suggestions but not a closed set.",
    explanationWrong:
      "Adding `string` to a union of string literals causes TypeScript to collapse everything into `string`. The literal values are technically still part of the union, but the IDE no longer suggests them because the broader `string` type subsumes them.",
    sourceUrl:
      "https://www.totaltypescript.com/tips/create-autocomplete-helper-which-allows-for-arbitrary-values",
    sourceLabel: "Total TypeScript: Loose Autocomplete",
  },
];
