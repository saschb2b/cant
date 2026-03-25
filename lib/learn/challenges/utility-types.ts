import type { Challenge } from "../types";

export const utilityTypeChallenges: Challenge[] = [
  {
    id: "ut-001",
    category: "utility-types",
    difficulty: "easy",
    title: "Partial for updates",
    badCode: `interface User {
  name: string;
  email: string;
  age: number;
}

function updateUser(id: string, data: User) {
  // Caller must pass ALL fields, even
  // if they only want to update one
}

updateUser("1", {
  name: "Alice",
  email: "alice@example.com",
  age: 30,
}); // Just wanted to update name!`,
    goodCode: `interface User {
  name: string;
  email: string;
  age: number;
}

function updateUser(id: string, data: Partial<User>) {
  // Caller passes only the fields to update
}

updateUser("1", { name: "Alice" }); // OK`,
    correctSide: "right",
    explanationCorrect:
      "`Partial<User>` makes every property optional, so callers can pass only the fields they want to update. This is the standard pattern for PATCH-style updates. The type still ensures only valid `User` properties with correct types are provided.",
    explanationWrong:
      "Requiring the full `User` object for an update forces callers to re-supply every field, which is tedious and error-prone. If a field is added to `User` later, every update call breaks. `Partial` solves this cleanly.",
    sourceUrl:
      "https://www.typescriptlang.org/docs/handbook/utility-types.html#partialtype",
    sourceLabel: "TypeScript Handbook: Partial",
  },
  {
    id: "ut-002",
    category: "utility-types",
    difficulty: "easy",
    title: "Pick for subsets",
    badCode: `interface User {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  createdAt: Date;
}

// Manually duplicated type
interface UserPreview {
  id: string;
  name: string;
  email: string;
}`,
    goodCode: `interface User {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  createdAt: Date;
}

// Derived from the source of truth
type UserPreview = Pick<User, "id" | "name" | "email">;`,
    correctSide: "right",
    explanationCorrect:
      '`Pick<User, "id" | "name" | "email">` creates a new type with only those three properties. If `User` changes a field\'s type, the preview type updates automatically. This keeps your types DRY and avoids drift between related shapes.',
    explanationWrong:
      "Manually copying properties into a separate interface creates two sources of truth. If `name` changes from `string` to `{ first: string; last: string }`, the hand-written `UserPreview` is silently out of date. `Pick` prevents this.",
    sourceUrl:
      "https://www.typescriptlang.org/docs/handbook/utility-types.html#picktype-keys",
    sourceLabel: "TypeScript Handbook: Pick",
  },
  {
    id: "ut-003",
    category: "utility-types",
    difficulty: "medium",
    title: "Omit for exclusion",
    badCode: `interface DbUser {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
}

// Manually rebuilding without passwordHash
interface PublicUser {
  id: string;
  name: string;
  email: string;
}`,
    goodCode: `interface DbUser {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
}

// Automatically excludes passwordHash
type PublicUser = Omit<DbUser, "passwordHash">;`,
    correctSide: "right",
    explanationCorrect:
      '`Omit<DbUser, "passwordHash">` creates a type with every property except `passwordHash`. If new fields are added to `DbUser`, they automatically appear in `PublicUser`. This is safer than `Pick` when you want to exclude a small number of fields from a large type.',
    explanationWrong:
      "Manually listing all safe fields is fragile. When a new field like `avatarUrl` is added to `DbUser`, the manual `PublicUser` does not include it unless you remember to add it. `Omit` ensures only the explicitly excluded fields are removed.",
    sourceUrl:
      "https://www.typescriptlang.org/docs/handbook/utility-types.html#omittype-keys",
    sourceLabel: "TypeScript Handbook: Omit",
  },
  {
    id: "ut-004",
    category: "utility-types",
    difficulty: "medium",
    title: "Record for maps",
    badCode: `// Using a plain object with index signature
const themes: { [key: string]: string } = {
  light: "#ffffff",
  dark: "#1a1a1a",
  ocean: "#0066cc",
};

// Any string key is accepted
themes.nonexistent; // No error, undefined`,
    goodCode: `type Theme = "light" | "dark" | "ocean";

const themes: Record<Theme, string> = {
  light: "#ffffff",
  dark: "#1a1a1a",
  ocean: "#0066cc",
};

// Only valid keys accepted
themes.light;  // OK
themes.forest; // Error: not in Theme`,
    correctSide: "right",
    explanationCorrect:
      "`Record<Theme, string>` creates an object type where every key in the `Theme` union must be present and map to a `string`. It catches missing keys (if you add a new theme, you must add a color) and rejects invalid keys. Much safer than an index signature.",
    explanationWrong:
      "An index signature `{ [key: string]: string }` accepts any string as a key, so TypeScript cannot catch typos or missing entries. It also allows accessing nonexistent keys without errors, returning `undefined` at runtime.",
    sourceUrl:
      "https://www.typescriptlang.org/docs/handbook/utility-types.html#recordkeys-type",
    sourceLabel: "TypeScript Handbook: Record",
  },
  {
    id: "ut-005",
    category: "utility-types",
    difficulty: "hard",
    title: "Extract and Exclude for unions",
    badCode: `type Event =
  | { type: "click"; x: number; y: number }
  | { type: "keypress"; key: string }
  | { type: "scroll"; offset: number };

// Manually picking event types
type MouseEvent = { type: "click"; x: number; y: number };
type KeyEvent = { type: "keypress"; key: string };`,
    goodCode: `type AppEvent =
  | { type: "click"; x: number; y: number }
  | { type: "keypress"; key: string }
  | { type: "scroll"; offset: number };

// Automatically extract matching members
type MouseEvent = Extract<AppEvent, { type: "click" }>;
// { type: "click"; x: number; y: number }

type NonMouseEvent = Exclude<AppEvent, { type: "click" }>;
// keypress | scroll events`,
    correctSide: "right",
    explanationCorrect:
      "`Extract` filters a union to members assignable to the given shape. `Exclude` does the opposite, removing matching members. Both stay in sync when the original union changes. This is cleaner and safer than manually copying type definitions.",
    explanationWrong:
      "Manually duplicating union members creates a maintenance risk. If the `click` event gains a `target` property, the hand-written copy is out of date. `Extract` always reflects the current shape of the source union.",
    sourceUrl:
      "https://www.typescriptlang.org/docs/handbook/utility-types.html#extracttype-union",
    sourceLabel: "TypeScript Handbook: Extract",
  },
  {
    id: "ut-006",
    category: "utility-types",
    difficulty: "hard",
    title: "ReturnType and Parameters",
    badCode: `// Manually typing what the function returns
function createUser(name: string, age: number) {
  return { id: crypto.randomUUID(), name, age };
}

// Hand-written, can drift from implementation
type NewUser = { id: string; name: string; age: number };
type CreateArgs = [string, number];`,
    goodCode: `function createUser(name: string, age: number) {
  return { id: crypto.randomUUID(), name, age };
}

// Derived from the function itself
type NewUser = ReturnType<typeof createUser>;
// { id: string; name: string; age: number }

type CreateArgs = Parameters<typeof createUser>;
// [name: string, age: number]`,
    correctSide: "right",
    explanationCorrect:
      "`ReturnType` extracts the return type and `Parameters` extracts the parameter tuple from a function type. Both stay in sync with the implementation automatically. This is especially useful when you do not control the function's source or want to avoid exporting an extra type.",
    explanationWrong:
      "Manually writing the return type and parameter types creates a second source of truth. If `createUser` starts returning an `email` field, the hand-written `NewUser` type is silently wrong. `ReturnType` and `Parameters` eliminate this class of bugs.",
    sourceUrl:
      "https://www.typescriptlang.org/docs/handbook/utility-types.html#returntypetype",
    sourceLabel: "TypeScript Handbook: ReturnType",
  },
];
