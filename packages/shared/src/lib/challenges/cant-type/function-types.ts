import type { BaseChallenge } from "../../game/types";

export const functionTypeChallenges: BaseChallenge[] = [
  {
    id: "ft-001",
    category: "function-types",
    difficulty: "easy",
    title: "Callback typing",
    prompt: "Which callback type catches property errors?",
    content: {
      type: "code",
      left: `// Callback typed as Function
function fetchData(callback: Function) {
  const data = { name: "Alice" };
  callback(data);
}

// No type safety on the callback
fetchData((data) => {
  // data is 'any'
  console.log(data.nonexistent); // No error
});`,
      right: `interface User {
  name: string;
}

function fetchData(callback: (data: User) => void) {
  const data: User = { name: "Alice" };
  callback(data);
}

fetchData((data) => {
  console.log(data.name);        // OK
  console.log(data.nonexistent); // Error
});`,
    },
    correctSide: "right",
    explanationCorrect:
      "Typing the callback with a specific signature gives TypeScript full knowledge of the parameter types. The callback's `data` parameter is inferred as `User`, providing autocomplete and catching property access errors. Never use the `Function` type.",
    explanationWrong:
      "The `Function` type accepts any callable value with any arguments and any return type. It is essentially `any` for functions. Parameters inside the callback become `any`, so TypeScript cannot catch mistakes like accessing nonexistent properties.",
    sourceUrl:
      "https://www.typescriptlang.org/docs/handbook/2/functions.html#function-type-expressions",
    sourceLabel: "TypeScript Handbook: Function type expressions",
  },
  {
    id: "ft-002",
    category: "function-types",
    difficulty: "easy",
    title: "void vs undefined return",
    prompt: "Which return type works for callbacks?",
    content: {
      type: "code",
      left: `// Forces callbacks to return undefined explicitly
type Handler = () => undefined;

// Error: map returns number[], not undefined
const handler: Handler = () => [1, 2].map(n => n * 2);

// Must write: () => { [1,2].map(n => n*2); return undefined; }`,
      right: `// void means "return value is ignored"
type Handler = () => void;

// Any return value is accepted
const handler: Handler = () => [1, 2].map(n => n * 2);

// These all work:
const a: Handler = () => {};
const b: Handler = () => true;
const c: Handler = () => "hello";`,
    },
    correctSide: "right",
    explanationCorrect:
      "`void` means the return value will not be used, so TypeScript allows any return type. This is intentional: callbacks like `forEach` accept `() => void` so you can pass functions that happen to return values. Using `undefined` as the return type forces callers to explicitly return nothing.",
    explanationWrong:
      "A return type of `undefined` requires the function to literally return `undefined`. This breaks common patterns where callbacks ignore their return value. Arrow functions that call `.map()` or other array methods implicitly return the result, which conflicts with an `undefined` return type.",
    sourceUrl:
      "https://www.typescriptlang.org/docs/handbook/2/functions.html#void",
    sourceLabel: "TypeScript Handbook: void",
  },
  {
    id: "ft-003",
    category: "function-types",
    difficulty: "medium",
    title: "Generic function parameters",
    prompt: "Which merge function preserves property types?",
    content: {
      type: "code",
      left: `function merge(a: object, b: object): object {
  return { ...a, ...b };
}

const result = merge(
  { name: "Alice" },
  { age: 30 }
);
// result is 'object', no properties accessible
result.name; // Error`,
      right: `function merge<A extends object, B extends object>(
  a: A,
  b: B
): A & B {
  return { ...a, ...b } as A & B;
}

const result = merge(
  { name: "Alice" },
  { age: 30 }
);
// result is { name: string } & { age: number }
result.name; // string
result.age;  // number`,
    },
    correctSide: "right",
    explanationCorrect:
      "Generic type parameters `A` and `B` capture the exact shapes of both arguments. The return type `A & B` is the intersection, giving you access to all properties from both objects. TypeScript infers the generics from the arguments, so no explicit type annotation is needed at the call site.",
    explanationWrong:
      "Using `object` as both parameter and return type erases all structural information. The return value is just `object`, which has no known properties. You would need to cast the result to use any properties, defeating the purpose of TypeScript.",
    sourceUrl: "https://www.typescriptlang.org/docs/handbook/2/generics.html",
    sourceLabel: "TypeScript Handbook: Generics",
  },
  {
    id: "ft-004",
    category: "function-types",
    difficulty: "medium",
    title: "Overloads vs unions",
    prompt: "Which signature is simpler here?",
    content: {
      type: "code",
      left: `// Overloads for something simple
function format(input: string): string;
function format(input: number): string;
function format(input: string | number): string {
  return String(input);
}`,
      right: `// Union parameter when the logic is the same
function format(input: string | number): string {
  return String(input);
}

// Save overloads for when return type
// depends on input type:
function parse(input: string): Date;
function parse(input: number): Date;
function parse(input: string | number): Date {
  if (typeof input === "string") return new Date(input);
  return new Date(input);
}`,
    },
    correctSide: "right",
    explanationCorrect:
      "Use union types when all input types follow the same logic and produce the same return type. Reserve overloads for cases where the return type changes based on the input type, or when you need distinct call signatures for documentation. Overloads add complexity, so prefer the simpler approach when possible.",
    explanationWrong:
      "Overloads for a function that treats all inputs the same way are unnecessary ceremony. They add three lines where one would suffice and make the code harder to read. Overloads shine when different inputs produce different output types.",
    sourceUrl:
      "https://www.typescriptlang.org/docs/handbook/2/functions.html#function-overloads",
    sourceLabel: "TypeScript Handbook: Function overloads",
  },
  {
    id: "ft-005",
    category: "function-types",
    difficulty: "hard",
    title: "Inferred return types",
    prompt: "Which avoids duplicating the return shape?",
    content: {
      type: "code",
      left: `// Explicit return type duplicates the logic
function createUser(
  name: string,
  role: "admin" | "user"
): {
  id: string;
  name: string;
  role: "admin" | "user";
  createdAt: Date;
} {
  return {
    id: crypto.randomUUID(),
    name,
    role,
    createdAt: new Date(),
  };
}`,
      right: `// Let TypeScript infer the return type
function createUser(
  name: string,
  role: "admin" | "user"
) {
  return {
    id: crypto.randomUUID(),
    name,
    role,
    createdAt: new Date(),
  };
}

// Use ReturnType if you need the type elsewhere
type NewUser = ReturnType<typeof createUser>;`,
    },
    correctSide: "right",
    explanationCorrect:
      "TypeScript automatically infers the return type from the return statement. Omitting the explicit annotation avoids duplication and keeps the return type in sync with the implementation. If you need the type in other places, use `ReturnType<typeof createUser>` to extract it.",
    explanationWrong:
      "Manually writing the return type creates a second source of truth. If you add a field to the return object but forget to update the annotation, you get a type error instead of the type just working. For internal functions, inferred return types reduce maintenance overhead.",
    sourceUrl:
      "https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#return-type-annotations",
    sourceLabel: "TypeScript Handbook: Return type annotations",
  },
  {
    id: "ft-006",
    category: "function-types",
    difficulty: "hard",
    title: "Rest params with tuples",
    prompt: "Which validates arguments against the function?",
    content: {
      type: "code",
      left: `// Loses argument structure
function call(fn: Function, ...args: any[]) {
  return fn(...args);
}

// No type safety whatsoever
call(Math.max, "not", "numbers"); // No error`,
      right: `function call<A extends unknown[], R>(
  fn: (...args: A) => R,
  ...args: A
): R {
  return fn(...args);
}

call(Math.max, 1, 2, 3);          // OK, returns number
call(Math.max, "not", "numbers");  // Error!`,
    },
    correctSide: "right",
    explanationCorrect:
      "Using a generic tuple type `A extends unknown[]` for the rest parameter links the function's expected arguments to the actual arguments passed. TypeScript infers `A` from the function signature and checks that the remaining arguments match. The return type `R` is also inferred correctly.",
    explanationWrong:
      "Using `Function` and `any[]` throws away all type information. The compiler cannot check whether the arguments match the function's signature, so type errors like passing strings to `Math.max` go undetected. Generic tuples make this pattern fully type-safe.",
    sourceUrl:
      "https://www.typescriptlang.org/docs/handbook/2/functions.html#rest-parameters-and-arguments",
    sourceLabel: "TypeScript Handbook: Rest parameters",
  },
];
