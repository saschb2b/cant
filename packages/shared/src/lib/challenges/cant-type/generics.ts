import type { BaseChallenge } from "../../game/types";

export const genericsChallenges: BaseChallenge[] = [
  {
    id: "ge-001",
    category: "generics",
    difficulty: "easy",
    title: "Generic functions vs any",
    prompt: "Which preserves the element type?",
    content: {
      type: "code",

      left: `function first(arr: any[]): any {
  return arr[0];
}

const val = first([1, 2, 3]);
// val is 'any', no autocomplete
val.toFixed(2); // No error even if wrong`,

      right: `function first<T>(arr: T[]): T {
  return arr[0];
}

const val = first([1, 2, 3]);
// val is 'number', full autocomplete
val.toFixed(2); // OK, checked by compiler`,
    },

    correctSide: "right",
    explanationCorrect:
      "A generic type parameter `T` preserves the relationship between input and output. TypeScript infers `T` as `number` from the argument, so the return type is `number` with full type safety. You get autocomplete and compile-time error checking.",
    explanationWrong:
      "Using `any` throws away all type information. The return value is `any`, which means TypeScript cannot catch mistakes like calling string methods on a number. Generics give you flexibility without losing safety.",
    sourceUrl:
      "https://www.typescriptlang.org/docs/handbook/2/generics.html#hello-world-of-generics",
    sourceLabel: "TypeScript Handbook: Generics",
  },
  {
    id: "ge-002",
    category: "generics",
    difficulty: "easy",
    title: "Inference over explicit types",
    prompt: "Which call style is less redundant?",
    content: {
      type: "code",

      left: `function identity<T>(value: T): T {
  return value;
}

// Redundant: TS can infer this
const result = identity<string>("hello");
const num = identity<number>(42);`,

      right: `function identity<T>(value: T): T {
  return value;
}

// Let TS infer the type parameter
const result = identity("hello"); // string
const num = identity(42); // number`,
    },

    correctSide: "right",
    explanationCorrect:
      'TypeScript infers generic type parameters from the arguments you pass. Writing `identity("hello")` automatically infers `T` as `string`. Specifying the type explicitly is redundant noise when inference works correctly. Save explicit type arguments for cases where inference fails or gives the wrong result.',
    explanationWrong:
      "Explicitly specifying `<string>` and `<number>` when TypeScript already infers them correctly adds clutter without benefit. It also creates a maintenance burden: if the argument type changes, you need to update the type parameter too.",
    sourceUrl:
      "https://www.typescriptlang.org/docs/handbook/2/generics.html#working-with-generic-type-variables",
    sourceLabel: "TypeScript Handbook: Generic type variables",
  },
  {
    id: "ge-003",
    category: "generics",
    difficulty: "medium",
    title: "Constraints with extends",
    prompt: "Which allows safe access to .length?",
    content: {
      type: "code",

      left: `function getLength<T>(value: T): number {
  return value.length;
  // Error: Property 'length' does not
  // exist on type 'T'
}`,

      right: `function getLength<T extends { length: number }>(
  value: T
): number {
  return value.length; // OK
}

getLength("hello");     // 5
getLength([1, 2, 3]);   // 3
getLength(42);           // Error: number has no length`,
    },

    correctSide: "right",
    explanationCorrect:
      "Adding `extends { length: number }` constrains `T` to types that have a `length` property. TypeScript knows `.length` is safe inside the function, and rejects arguments that lack it. Constraints let you use specific properties while keeping the function generic.",
    explanationWrong:
      "An unconstrained `T` could be anything, including types without a `.length` property. TypeScript correctly rejects the access because it cannot guarantee the property exists. The fix is a constraint, not a type assertion.",
    sourceUrl:
      "https://www.typescriptlang.org/docs/handbook/2/generics.html#generic-constraints",
    sourceLabel: "TypeScript Handbook: Generic constraints",
  },
  {
    id: "ge-004",
    category: "generics",
    difficulty: "medium",
    title: "Generic interfaces",
    prompt: "Which response type gives full autocomplete?",
    content: {
      type: "code",

      left: `interface ApiResponse {
  data: any;
  error: string | null;
}

const res: ApiResponse = await fetchUser();
// res.data is 'any', no type safety
res.data.name; // Could be anything`,

      right: `interface ApiResponse<T> {
  data: T;
  error: string | null;
}

interface User {
  name: string;
  email: string;
}

const res: ApiResponse<User> = await fetchUser();
// res.data is User, fully typed
res.data.name; // string, autocomplete works`,
    },

    correctSide: "right",
    explanationCorrect:
      "Making `ApiResponse` generic with `<T>` lets you specify the shape of `data` at each usage site. When you write `ApiResponse<User>`, the `data` field is typed as `User` with full autocompletion. One interface works for every endpoint.",
    explanationWrong:
      "Using `any` for the `data` field means every consumer of the response loses type information. You cannot get autocomplete on `res.data`, and typos like `res.data.nmae` will not be caught. Generic interfaces solve this cleanly.",
    sourceUrl:
      "https://www.typescriptlang.org/docs/handbook/2/generics.html#generic-types",
    sourceLabel: "TypeScript Handbook: Generic types",
  },
  {
    id: "ge-005",
    category: "generics",
    difficulty: "hard",
    title: "keyof constraints",
    prompt: "Which catches typos in property names?",
    content: {
      type: "code",

      left: `function getProperty(obj: any, key: string) {
  return obj[key]; // Returns any
}

const user = { name: "Alice", age: 30 };
getProperty(user, "naem"); // No error, typo undetected`,

      right: `function getProperty<T, K extends keyof T>(
  obj: T,
  key: K
): T[K] {
  return obj[key];
}

const user = { name: "Alice", age: 30 };
getProperty(user, "name");  // string
getProperty(user, "naem");  // Error: not in keyof`,
    },

    correctSide: "right",
    explanationCorrect:
      'Using `K extends keyof T` constrains the key to actual properties of the object. TypeScript catches typos at compile time and infers the correct return type via `T[K]`. For `"name"`, the return type is `string`. For `"age"`, it is `number`.',
    explanationWrong:
      'With `any` and `string`, TypeScript has no idea which keys are valid or what the return type should be. Typos like `"naem"` compile without errors and return `undefined` at runtime. The `keyof` constraint catches these mistakes statically.',
    sourceUrl:
      "https://www.typescriptlang.org/docs/handbook/2/generics.html#using-type-parameters-in-generic-constraints",
    sourceLabel: "TypeScript Handbook: Type parameters in constraints",
  },
  {
    id: "ge-006",
    category: "generics",
    difficulty: "hard",
    title: "Default type parameters",
    prompt: "Which lets callers omit the type argument?",
    content: {
      type: "code",

      left: `// Forces every caller to specify the type
interface PaginatedList<T> {
  items: T[];
  page: number;
  totalPages: number;
}

// Error: Generic type requires 1 type argument
const meta: PaginatedList = {
  items: [],
  page: 1,
  totalPages: 10,
};`,

      right: `// Default makes the parameter optional
interface PaginatedList<T = unknown> {
  items: T[];
  page: number;
  totalPages: number;
}

// When you know the type
const users: PaginatedList<User> = { ... };

// When you only care about pagination
const meta: PaginatedList = {
  items: [],
  page: 1,
  totalPages: 10,
};`,
    },

    correctSide: "right",
    explanationCorrect:
      "Default type parameters (like `T = unknown`) let callers omit the type argument when they do not need a specific type. This is useful for utility interfaces where some consumers care about the item type and others just need the pagination metadata.",
    explanationWrong:
      "Without a default, every usage of `PaginatedList` must specify a type argument. This is cumbersome when the consumer does not use the `items` array or when the items are heterogeneous. Default parameters make generics more ergonomic.",
    sourceUrl:
      "https://www.typescriptlang.org/docs/handbook/2/generics.html#generic-parameter-defaults",
    sourceLabel: "TypeScript Handbook: Generic parameter defaults",
  },
  {
    id: "ge-007",
    category: "generics",
    difficulty: "hard",
    title: "NoInfer to control inference sites",
    prompt: "Which restricts initial to valid states?",
    content: {
      type: "code",

      left: `function createFSM<S extends string>(config: {
  initial: S;
  states: S[];
}) { }

// "not-a-state" widens the union, no error!
createFSM({
  initial: "not-a-state",
  states: ["open", "closed"],
});`,

      right: `function createFSM<S extends string>(config: {
  initial: NoInfer<S>;
  states: S[];
}) { }

createFSM({
  initial: "open",           // OK
  states: ["open", "closed"],
});
// createFSM({
//   initial: "not-a-state", // Error
//   states: ["open", "closed"],
// });`,
    },

    correctSide: "right",
    explanationCorrect:
      '`NoInfer<T>` (TypeScript 5.4) marks a position as not an inference site. TypeScript infers `S` only from `states`, then checks `initial` against that inferred type. This gives you a "driver" parameter that defines the set and a "consumer" parameter that must pick from it.',
    explanationWrong:
      "Without `NoInfer`, TypeScript infers the generic from all positions. Any value you pass to `initial` is included in the inferred union, so there is no way to restrict it to the values in `states`. Invalid values silently widen the type instead of causing an error.",
    sourceUrl: "https://www.totaltypescript.com/noinfer",
    sourceLabel: "Total TypeScript: NoInfer",
  },
  {
    id: "ge-008",
    category: "generics",
    difficulty: "hard",
    title: "const type parameters for literal inference",
    prompt: "Which preserves literal string values?",
    content: {
      type: "code",

      left: `function routes<T extends Record<string, string>>(
  config: T
): T {
  return config;
}

const r = routes({
  home: "/",
  about: "/about",
});
// Type: { home: string; about: string }
// Literal paths are widened to string`,

      right: `function routes<const T extends Record<string, string>>(
  config: T
): T {
  return config;
}

const r = routes({
  home: "/",
  about: "/about",
});
// Type: { readonly home: "/"; readonly about: "/about" }
// Literal paths are preserved`,
    },

    correctSide: "right",
    explanationCorrect:
      "Adding `const` to a type parameter (TypeScript 5.0) tells the compiler to infer the narrowest possible type from the argument. String and number literals are preserved instead of widened, and arrays become readonly tuples. Before this feature, callers had to write `as const` at every call site.",
    explanationWrong:
      "Without `const`, TypeScript applies its default widening rules: string literals become `string`, number literals become `number`, and arrays become mutable arrays. The caller loses the specific values they passed in, which defeats the purpose of inferring from the argument.",
    sourceUrl:
      "https://www.typescriptlang.org/docs/handbook/release-notes/typescript-5-0.html#const-type-parameters",
    sourceLabel: "TypeScript 5.0: const type parameters",
  },
];
