import type { BaseChallenge } from "../../game/types";

export const typeAssertionChallenges: BaseChallenge[] = [
  {
    id: "ta-001",
    category: "type-assertions",
    difficulty: "easy",
    title: "satisfies vs as",
    prompt: "Which keeps the inferred literal types?",
    content: {
      type: "code",

      left: `type Color = "red" | "green" | "blue";

const palette = {
  primary: "red",
  secondary: "green",
} as Record<string, Color>;

// Lost the specific keys!
palette.primary;    // Color (not "red")
palette.oops;       // Color (no error for bad key)`,

      right: `type Color = "red" | "green" | "blue";

const palette = {
  primary: "red",
  secondary: "green",
} satisfies Record<string, Color>;

// Keeps specific keys and values!
palette.primary;    // "red"
palette.oops;       // Error: property doesn't exist`,
    },

    correctSide: "right",
    explanationCorrect:
      '`satisfies` validates that a value matches a type without widening it. The value keeps its inferred literal types, so `palette.primary` is `"red"` (not `Color`) and invalid keys are caught. It gives you validation and precision at the same time.',
    explanationWrong:
      "`as Record<string, Color>` widens the type, losing the specific keys and literal values. TypeScript thinks any string key is valid and every value is the full `Color` union. You lose the exact type information that makes TypeScript useful.",
    sourceUrl:
      "https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-9.html#the-satisfies-operator",
    sourceLabel: "TypeScript 4.9: satisfies operator",
  },
  {
    id: "ta-002",
    category: "type-assertions",
    difficulty: "easy",
    title: "as const for literals",
    prompt: "Which narrows values to their exact types?",
    content: {
      type: "code",

      left: `const config = {
  endpoint: "https://api.example.com",
  retries: 3,
  methods: ["GET", "POST"],
};

// config.endpoint is string (not the literal)
// config.methods is string[] (not tuple)
// config.methods[0] is string (not "GET")`,

      right: `const config = {
  endpoint: "https://api.example.com",
  retries: 3,
  methods: ["GET", "POST"],
} as const;

// config.endpoint is "https://api.example.com"
// config.methods is readonly ["GET", "POST"]
// config.methods[0] is "GET"`,
    },

    correctSide: "right",
    explanationCorrect:
      "`as const` makes every property `readonly` and narrows all values to their literal types. Strings become literal string types, arrays become readonly tuples with literal element types. This is essential for objects used as configuration or lookup tables.",
    explanationWrong:
      'Without `as const`, TypeScript widens literals to their base types: `"https://api.example.com"` becomes `string`, and the array becomes `string[]`. You lose the ability to use these values as discriminants or precise types downstream.',
    sourceUrl:
      "https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-4.html#const-assertions",
    sourceLabel: "TypeScript 3.4: const assertions",
  },
  {
    id: "ta-003",
    category: "type-assertions",
    difficulty: "medium",
    title: "Type predicates with is",
    prompt: "Which narrows the type in the caller?",
    content: {
      type: "code",

      left: `interface Fish { swim(): void }
interface Bird { fly(): void }

function isFish(pet: Fish | Bird): boolean {
  return (pet as Fish).swim !== undefined;
}

const pet: Fish | Bird = getPet();
if (isFish(pet)) {
  // Still Fish | Bird here, no narrowing!
  pet.swim(); // Error
}`,

      right: `interface Fish { swim(): void }
interface Bird { fly(): void }

function isFish(pet: Fish | Bird): pet is Fish {
  return (pet as Fish).swim !== undefined;
}

const pet: Fish | Bird = getPet();
if (isFish(pet)) {
  // Narrowed to Fish
  pet.swim(); // OK
}`,
    },

    correctSide: "right",
    explanationCorrect:
      "The `pet is Fish` return type is a type predicate that tells TypeScript the function acts as a type guard. When it returns `true`, the compiler narrows the argument to `Fish` in the calling scope. Without the predicate, the boolean return provides no narrowing information.",
    explanationWrong:
      "A plain `boolean` return type tells TypeScript nothing about how the argument's type changes. The narrowing logic is locked inside the function, invisible to the caller. The type stays as the full union even after the check passes.",
    sourceUrl:
      "https://www.typescriptlang.org/docs/handbook/2/narrowing.html#using-type-predicates",
    sourceLabel: "TypeScript Handbook: Type predicates",
  },
  {
    id: "ta-004",
    category: "type-assertions",
    difficulty: "medium",
    title: "Assertion functions",
    prompt: "Which avoids repeated null checks?",
    content: {
      type: "code",

      left: `function loadConfig(): Config | undefined {
  return JSON.parse(fs.readFileSync("config.json", "utf-8"));
}

const config = loadConfig();
// Must check everywhere it's used
if (!config) throw new Error("Missing config");
console.log(config.port);
if (!config) throw new Error("Missing config");
console.log(config.host);`,

      right: `function assertDefined<T>(
  val: T | undefined,
  msg: string
): asserts val is T {
  if (val === undefined) throw new Error(msg);
}

const config = loadConfig();
assertDefined(config, "Missing config");
// From here on, config is Config (not undefined)
console.log(config.port); // OK
console.log(config.host); // OK`,
    },

    correctSide: "right",
    explanationCorrect:
      "An assertion function with `asserts val is T` tells TypeScript that if the function returns normally (does not throw), the value is narrowed for the rest of the scope. One call replaces repeated null checks throughout the function.",
    explanationWrong:
      "Repeating `if (!config) throw` before every use is noisy and error-prone. It is easy to forget a check, and the intent (fail-fast validation) is buried in boilerplate. Assertion functions centralize the check and communicate the narrowing to the compiler.",
    sourceUrl:
      "https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-7.html#assertion-functions",
    sourceLabel: "TypeScript 3.7: Assertion functions",
  },
  {
    id: "ta-005",
    category: "type-assertions",
    difficulty: "hard",
    title: "Avoiding double assertions",
    prompt: "Which validates the data shape at runtime?",
    content: {
      type: "code",

      left: `interface User { name: string; age: number }
interface Product { title: string; price: number }

// Double assertion bypasses ALL type checking
const user = { title: "Widget", price: 10 } as unknown as User;

console.log(user.name); // undefined at runtime!`,

      right: `interface User { name: string; age: number }
interface Product { title: string; price: number }

// Use a type guard or validation function
function isUser(val: unknown): val is User {
  return (
    typeof val === "object" &&
    val !== null &&
    "name" in val &&
    "age" in val
  );
}

const data: unknown = fetchData();
if (isUser(data)) {
  console.log(data.name); // safe
}`,
    },

    correctSide: "right",
    explanationCorrect:
      "A type guard validates the shape at runtime, so the narrowed type reflects reality. The compiler trusts the guard, and you can trust the runtime. This is the correct approach when dealing with external data of unknown shape.",
    explanationWrong:
      "`as unknown as User` is a double assertion that forces any type into any other type with zero runtime checks. It is a complete escape hatch from the type system. The object has `title` and `price`, but TypeScript pretends it has `name` and `age`. Every property access is a lie.",
    sourceUrl:
      "https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#type-assertions",
    sourceLabel: "TypeScript Handbook: Type assertions",
  },
  {
    id: "ta-006",
    category: "type-assertions",
    difficulty: "hard",
    title: "Non-null assertion vs optional chaining",
    prompt: "Which is safe when the value is missing?",
    content: {
      type: "code",

      left: `interface User {
  address?: {
    city: string;
    zip: string;
  };
}

function getCity(user: User): string {
  // Non-null assertion: "trust me, it exists"
  return user.address!.city;
  // Crashes if address is undefined
}`,

      right: `interface User {
  address?: {
    city: string;
    zip: string;
  };
}

function getCity(user: User): string | undefined {
  // Optional chaining: safe access
  return user.address?.city;
  // Returns undefined if address is missing
}`,
    },

    correctSide: "right",
    explanationCorrect:
      "Optional chaining (`?.`) safely returns `undefined` if any part of the chain is nullish. The return type honestly reflects the possibility of `undefined`. This is a runtime-safe operation, unlike the non-null assertion which is erased at compile time.",
    explanationWrong:
      "The non-null assertion operator (`!`) tells TypeScript to pretend a value is not null or undefined. It is erased during compilation and provides zero runtime protection. If `address` is actually `undefined`, the code throws a TypeError.",
    sourceUrl:
      "https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-7.html#optional-chaining",
    sourceLabel: "TypeScript 3.7: Optional chaining",
  },
  {
    id: "ta-007",
    category: "type-assertions",
    difficulty: "hard",
    title: "Branded types for type-safe IDs",
    prompt: "Which prevents mixing up ID types?",
    content: {
      type: "code",

      left: `type UserId = number;
type PostId = number;

function getUser(id: UserId) { }
function getPost(id: PostId) { }

const oderId: PostId = 42;
getUser(oderId); // No error, PostId is just number`,

      right: `type Brand<T, B extends string> =
  T & { readonly __brand: B };

type UserId = Brand<number, "UserId">;
type PostId = Brand<number, "PostId">;

function getUser(id: UserId) { }
function getPost(id: PostId) { }

const userId = 1 as UserId;
const postId = 2 as PostId;
getUser(userId);  // OK
// getUser(postId); // Error`,
    },

    correctSide: "right",
    explanationCorrect:
      "A branded type adds a phantom `__brand` property that exists only at the type level. This makes `UserId` and `PostId` structurally incompatible even though both are numbers at runtime. The `as` cast is typically wrapped in a factory or validation function so callers never see it.",
    explanationWrong:
      "Plain type aliases for primitives are structurally identical. `UserId` and `PostId` are both just `number`, so TypeScript treats them as interchangeable. Accidentally passing a post ID where a user ID is expected compiles without error and causes bugs at runtime.",
    sourceUrl: "https://www.typescriptlang.org/play#example/nominal-typing",
    sourceLabel: "TypeScript Playground: Nominal Typing",
  },
];
