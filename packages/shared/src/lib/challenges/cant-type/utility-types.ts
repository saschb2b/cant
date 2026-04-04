import type { BaseChallenge } from "../../game/types";

export const utilityTypeChallenges: BaseChallenge[] = [
  {
    id: "ut-001",
    category: "utility-types",
    difficulty: "easy",
    title: "Partial for updates",
    prompt: "Which lets callers update a single field?",
    content: {
      type: "code",
      left: `interface User {
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
      right: `interface User {
  name: string;
  email: string;
  age: number;
}

function updateUser(id: string, data: Partial<User>) {
  // Caller passes only the fields to update
}

updateUser("1", { name: "Alice" }); // OK`,
    },
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
    prompt: "Which derives the subset from the source?",
    content: {
      type: "code",
      left: `interface User {
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
      right: `interface User {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  createdAt: Date;
}

// Derived from the source of truth
type UserPreview = Pick<User, "id" | "name" | "email">;`,
    },
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
    prompt: "Which excludes sensitive fields automatically?",
    content: {
      type: "code",
      left: `interface DbUser {
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
      right: `interface DbUser {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
}

// Automatically excludes passwordHash
type PublicUser = Omit<DbUser, "passwordHash">;`,
    },
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
    prompt: "Which enforces that all keys are present?",
    content: {
      type: "code",
      left: `// Using a plain object with index signature
const themes: { [key: string]: string } = {
  light: "#ffffff",
  dark: "#1a1a1a",
  ocean: "#0066cc",
};

// Any string key is accepted
themes.nonexistent; // No error, undefined`,
      right: `type Theme = "light" | "dark" | "ocean";

const themes: Record<Theme, string> = {
  light: "#ffffff",
  dark: "#1a1a1a",
  ocean: "#0066cc",
};

// Only valid keys accepted
themes.light;  // OK
themes.forest; // Error: not in Theme`,
    },
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
    prompt: "Which filters union members automatically?",
    content: {
      type: "code",
      left: `type Event =
  | { type: "click"; x: number; y: number }
  | { type: "keypress"; key: string }
  | { type: "scroll"; offset: number };

// Manually picking event types
type MouseEvent = { type: "click"; x: number; y: number };
type KeyEvent = { type: "keypress"; key: string };`,
      right: `type AppEvent =
  | { type: "click"; x: number; y: number }
  | { type: "keypress"; key: string }
  | { type: "scroll"; offset: number };

// Automatically extract matching members
type MouseEvent = Extract<AppEvent, { type: "click" }>;
// { type: "click"; x: number; y: number }

type NonMouseEvent = Exclude<AppEvent, { type: "click" }>;
// keypress | scroll events`,
    },
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
    prompt: "Which derives types from the function?",
    content: {
      type: "code",
      left: `// Manually typing what the function returns
function createUser(name: string, age: number) {
  return { id: crypto.randomUUID(), name, age };
}

// Hand-written, can drift from implementation
type NewUser = { id: string; name: string; age: number };
type CreateArgs = [string, number];`,
      right: `function createUser(name: string, age: number) {
  return { id: crypto.randomUUID(), name, age };
}

// Derived from the function itself
type NewUser = ReturnType<typeof createUser>;
// { id: string; name: string; age: number }

type CreateArgs = Parameters<typeof createUser>;
// [name: string, age: number]`,
    },
    correctSide: "right",
    explanationCorrect:
      "`ReturnType` extracts the return type and `Parameters` extracts the parameter tuple from a function type. Both stay in sync with the implementation automatically. This is especially useful when you do not control the function's source or want to avoid exporting an extra type.",
    explanationWrong:
      "Manually writing the return type and parameter types creates a second source of truth. If `createUser` starts returning an `email` field, the hand-written `NewUser` type is silently wrong. `ReturnType` and `Parameters` eliminate this class of bugs.",
    sourceUrl:
      "https://www.typescriptlang.org/docs/handbook/utility-types.html#returntypetype",
    sourceLabel: "TypeScript Handbook: ReturnType",
  },
  {
    id: "ut-007",
    category: "utility-types",
    difficulty: "medium",
    title: "Prettify intersections for readability",
    prompt: "Which shows a clean type on hover?",
    content: {
      type: "code",
      left: `type User = { name: string } &
  { email: string } &
  { role: "admin" | "user" };

// Hover shows:
// { name: string } & { email: string }
//   & { role: "admin" | "user" }
// Hard to read with many intersections`,
      right: `type Prettify<T> = {
  [K in keyof T]: T[K];
} & {};

type User = Prettify<
  { name: string } &
  { email: string } &
  { role: "admin" | "user" }
>;

// Hover shows:
// { name: string; email: string;
//   role: "admin" | "user" }`,
    },
    correctSide: "right",
    explanationCorrect:
      "The `Prettify` helper uses a mapped type to flatten intersections into a single object type. IDE hover tooltips show a clean, readable object instead of a chain of `&` intersections. This is especially valuable when composing types from multiple sources like mixins, Pick/Omit combinations, or module augmentations.",
    explanationWrong:
      "Raw intersections display as a chain of `&` in IDE tooltips. With two or three intersections this is manageable, but with more it becomes hard to see what properties are available. The `Prettify` helper solves this with zero runtime cost since it resolves to the same type.",
    sourceUrl: "https://www.totaltypescript.com/concepts/the-prettify-helper",
    sourceLabel: "Total TypeScript: The Prettify Helper",
  },
  {
    id: "ut-008",
    category: "utility-types",
    difficulty: "medium",
    title: "Array element type with indexed access",
    prompt: "Which keeps the array and type in sync?",
    content: {
      type: "code",
      left: `const ROLES = ["admin", "editor", "viewer"] as const;

// Manually duplicating the values as a union
type Role = "admin" | "editor" | "viewer";

// Must update both when roles change
function hasRole(role: Role) { }`,
      right: `const ROLES = ["admin", "editor", "viewer"] as const;

// Derive the union from the array
type Role = (typeof ROLES)[number];

// "admin" | "editor" | "viewer"
// Auto-updates when ROLES changes
function hasRole(role: Role) { }`,
    },
    correctSide: "right",
    explanationCorrect:
      "Indexing a tuple or readonly array with `[number]` extracts a union of all element types. Combined with `as const` and `typeof`, this derives a string literal union directly from a runtime array. Adding or removing an element in `ROLES` updates the `Role` type automatically.",
    explanationWrong:
      "Manually writing the union duplicates the values. When you add a new role to the array but forget to update the type, the type and runtime array drift apart silently. The indexed access pattern keeps them in sync with zero maintenance.",
    sourceUrl:
      "https://www.totaltypescript.com/tips/access-deeper-parts-of-objects-and-arrays",
    sourceLabel: "Total TypeScript: Indexed Access Types",
  },
];
