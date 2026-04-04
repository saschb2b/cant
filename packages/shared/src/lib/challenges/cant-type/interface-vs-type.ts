import type { BaseChallenge } from "../../game/types";

export const interfaceVsTypeChallenges: BaseChallenge[] = [
  {
    id: "it-001",
    category: "interface-vs-type",
    difficulty: "easy",
    title: "Interface for object shapes",
    prompt: "Which catches property conflicts earlier?",
    content: {
      type: "code",

      left: `type User = {
  name: string;
  role: string;
};

// Intersection: silently merges conflicts
type AdminUser = User & {
  role: number; // No error here!
};

// role is 'string & number' which is 'never'
// You only find out when you try to use it
const admin: AdminUser = {
  name: "Alice",
  role: "admin", // Error: never
};`,

      right: `interface User {
  name: string;
  role: string;
}

// Extends: catches conflicts immediately
// interface AdminUser extends User {
//   role: number; // Error: not assignable
// }

interface AdminUser extends User {
  permissions: string[];
}

const admin: AdminUser = {
  name: "Alice",
  role: "admin", // OK
  permissions: ["read"],
};`,
    },

    correctSide: "right",
    explanationCorrect:
      "Interfaces are the idiomatic choice for object shapes. They support clean `extends` inheritance (which catches property conflicts at declaration), declaration merging for augmenting third-party types, and produce clearer error messages. Both types and interfaces can be extended, but interfaces make the intent more explicit.",
    explanationWrong:
      "Type aliases work for object shapes and can be extended with `&` intersections. However, intersections silently merge conflicting properties into `never` instead of erroring. Types also cannot be augmented via declaration merging. For plain object shapes, interfaces are the conventional choice.",
    sourceUrl:
      "https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#differences-between-type-aliases-and-interfaces",
    sourceLabel: "TypeScript Handbook: Interfaces vs Types",
  },
  {
    id: "it-002",
    category: "interface-vs-type",
    difficulty: "easy",
    title: "Type for unions",
    prompt: "Which models mutually exclusive states?",
    content: {
      type: "code",

      left: `// Can't express a union with interface
// interface Result = Success | Failure; // Syntax error

// Workaround: single interface with optionals
interface Result {
  success: boolean;
  data?: string;
  error?: string;
}

// Not type-safe: can have both data and error`,

      right: `interface Success {
  status: "ok";
  data: string;
}

interface Failure {
  status: "error";
  error: string;
}

// Union type: only type aliases can do this
type Result = Success | Failure;

// Type-safe: data and error are mutually exclusive`,
    },

    correctSide: "right",
    explanationCorrect:
      "Union types can only be expressed with the `type` keyword. Interfaces cannot be combined with `|`. Define each variant as an interface for its object shape, then use a type alias to create the union. This gives you the best of both worlds.",
    explanationWrong:
      "A single interface with optional fields cannot express mutual exclusivity. Nothing prevents a value from having both `data` and `error`, or neither. A discriminated union with a `status` field guarantees exactly one variant at a time.",
    sourceUrl:
      "https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#union-types",
    sourceLabel: "TypeScript Handbook: Union types",
  },
  {
    id: "it-003",
    category: "interface-vs-type",
    difficulty: "medium",
    title: "Extending interfaces vs intersecting types",
    prompt: "Which extension style reports conflicts?",
    content: {
      type: "code",

      left: `type Animal = {
  name: string;
  legs: number;
};

type Dog = Animal & {
  breed: string;
};

// Intersection issues:
// - Conflicting properties become 'never' silently
type A = { x: number };
type B = { x: string };
type C = A & B; // x is 'never' (number & string)`,

      right: `interface Animal {
  name: string;
  legs: number;
}

interface Dog extends Animal {
  breed: string;
}

// Extends catches conflicts at declaration:
// interface Bad extends Animal {
//   name: number; // Error: not assignable to string
// }`,
    },

    correctSide: "right",
    explanationCorrect:
      "`extends` catches property type conflicts at the point of declaration. If you try to override `name` with an incompatible type, TypeScript immediately reports an error. With `&`, conflicting properties silently become `never`, which only causes errors later when you try to use the value.",
    explanationWrong:
      "Intersection types silently merge conflicting properties into `never`. `number & string` is `never` because no value can be both. This compiles without error at the type definition, but any attempt to assign a value to `x` fails. `extends` catches the conflict immediately.",
    sourceUrl:
      "https://www.typescriptlang.org/docs/handbook/2/objects.html#extending-types",
    sourceLabel: "TypeScript Handbook: Extending types",
  },
  {
    id: "it-004",
    category: "interface-vs-type",
    difficulty: "medium",
    title: "Declaration merging",
    prompt: "Which supports augmenting third-party types?",
    content: {
      type: "code",

      left: `// Can't merge type aliases
type Window = {
  title: string;
};

type Window = {
  // Error: Duplicate identifier 'Window'
  appVersion: string;
};`,

      right: `// Interfaces merge automatically
interface Window {
  title: string;
}

interface Window {
  appVersion: string;
}

// Result: Window has both title and appVersion
// Useful for augmenting third-party types:
declare global {
  interface Window {
    analytics: AnalyticsLib;
  }
}`,
    },

    correctSide: "right",
    explanationCorrect:
      "Interfaces with the same name in the same scope are automatically merged. This is essential for augmenting global types or extending third-party library types without modifying their source. Type aliases cannot be reopened, so they do not support this pattern.",
    explanationWrong:
      "Type aliases are closed after declaration. Defining the same type alias twice is a compile error. If you need to add properties to an existing type from another module (like `Window` or a library type), you must use an interface.",
    sourceUrl:
      "https://www.typescriptlang.org/docs/handbook/declaration-merging.html",
    sourceLabel: "TypeScript Handbook: Declaration merging",
  },
  {
    id: "it-005",
    category: "interface-vs-type",
    difficulty: "hard",
    title: "Indexed access types",
    prompt: "Which avoids duplicating nested types?",
    content: {
      type: "code",

      left: `interface ApiResponse {
  user: {
    id: string;
    profile: {
      name: string;
      avatar: string;
    };
  };
  posts: { id: string; title: string }[];
}

// Manually duplicating nested types
interface Profile {
  name: string;
  avatar: string;
}

interface Post {
  id: string;
  title: string;
}`,

      right: `interface ApiResponse {
  user: {
    id: string;
    profile: {
      name: string;
      avatar: string;
    };
  };
  posts: { id: string; title: string }[];
}

// Extract nested types with indexed access
type Profile = ApiResponse["user"]["profile"];
// { name: string; avatar: string }

type Post = ApiResponse["posts"][number];
// { id: string; title: string }`,
    },

    correctSide: "right",
    explanationCorrect:
      'Indexed access types let you extract nested types from existing types using bracket notation. `ApiResponse["user"]["profile"]` drills into the structure, and `[number]` extracts the element type from an array. Changes to the source type automatically propagate.',
    explanationWrong:
      "Manually writing separate interfaces for nested shapes creates multiple sources of truth. If the API response changes the `profile` shape, the hand-written `Profile` interface is silently wrong. Indexed access types keep everything derived from one source.",
    sourceUrl:
      "https://www.typescriptlang.org/docs/handbook/2/indexed-access-types.html",
    sourceLabel: "TypeScript Handbook: Indexed access types",
  },
  {
    id: "it-006",
    category: "interface-vs-type",
    difficulty: "hard",
    title: "When to use which",
    prompt: "Which follows the conventional split?",
    content: {
      type: "code",

      left: `// Using type for everything
type Props = {
  children: React.ReactNode;
  onClick: () => void;
};

type Theme = "light" | "dark";

type Merge<A, B> = Omit<A, keyof B> & B;

// No consistency, no reasoning about
// when to use type vs interface`,

      right: `// Interface for object shapes and contracts
interface Props {
  children: React.ReactNode;
  onClick: () => void;
}

// Type for unions, intersections, and utilities
type Theme = "light" | "dark";

type Merge<A, B> = Omit<A, keyof B> & B;

// Rule of thumb:
// - interface: object shapes, class contracts, extendable APIs
// - type: unions, mapped types, conditional types, computed types`,
    },

    correctSide: "right",
    explanationCorrect:
      "The practical rule: use `interface` for object shapes you might extend or that represent contracts (props, API responses, class shapes). Use `type` for unions, computed types, mapped types, and anything that cannot be expressed as an interface. Consistency within a codebase matters more than the choice itself.",
    explanationWrong:
      "Using `type` for everything works, but you miss out on `extends` syntax, declaration merging, and clearer error messages for object shapes. Having a clear convention helps teams make consistent decisions and produces more readable code.",
    sourceUrl:
      "https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#differences-between-type-aliases-and-interfaces",
    sourceLabel: "TypeScript Handbook: Interfaces vs Types",
  },
];
