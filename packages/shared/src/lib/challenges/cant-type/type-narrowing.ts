import type { BaseChallenge } from "../../game/types";

export const typeNarrowingChallenges: BaseChallenge[] = [
  {
    id: "tn-001",
    category: "type-narrowing",
    difficulty: "easy",
    title: "typeof guards",
    prompt: "Which handles both string and number input?",
    content: {
      type: "code",

      left: `function double(value: string | number) {
  // No narrowing, just cast
  return (value as number) * 2;
}

double("hello"); // NaN at runtime`,

      right: `function double(value: string | number) {
  if (typeof value === "number") {
    return value * 2;
  }
  return value.repeat(2);
}

double("hello"); // "hellohello"`,
    },

    correctSide: "right",
    explanationCorrect:
      "Using `typeof` to check the type at runtime lets TypeScript narrow the type inside each branch. In the `number` branch, `value` is known to be a number, so multiplication is safe. In the `string` branch, string methods are available. No type assertions needed.",
    explanationWrong:
      "Casting with `as number` silences the compiler but does nothing at runtime. If `value` is a string, multiplying it produces `NaN`. Type assertions bypass safety checks instead of adding them.",
    sourceUrl:
      "https://www.typescriptlang.org/docs/handbook/2/narrowing.html#typeof-type-guards",
    sourceLabel: "TypeScript Handbook: typeof type guards",
  },
  {
    id: "tn-002",
    category: "type-narrowing",
    difficulty: "easy",
    title: "Truthiness narrowing",
    prompt: "Which handles the undefined case gracefully?",
    content: {
      type: "code",

      left: `function greet(name?: string) {
  // Might be undefined
  return \`Hello, \${name.toUpperCase()}!\`;
}

greet(); // Runtime error`,

      right: `function greet(name?: string) {
  if (name) {
    return \`Hello, \${name.toUpperCase()}!\`;
  }
  return "Hello, stranger!";
}

greet(); // "Hello, stranger!"`,
    },

    correctSide: "right",
    explanationCorrect:
      "Checking `if (name)` filters out both `undefined` and empty strings. Inside the truthy branch, TypeScript knows `name` is a non-empty string, so `.toUpperCase()` is safe. This is the simplest form of narrowing.",
    explanationWrong:
      "When `name` is `undefined`, calling `.toUpperCase()` on it throws a TypeError at runtime. TypeScript warns about this with strictNullChecks enabled. Always check optional values before using them.",
    sourceUrl:
      "https://www.typescriptlang.org/docs/handbook/2/narrowing.html#truthiness-narrowing",
    sourceLabel: "TypeScript Handbook: Truthiness narrowing",
  },
  {
    id: "tn-003",
    category: "type-narrowing",
    difficulty: "medium",
    title: "Discriminated unions",
    prompt: "Which gives safe access to variant fields?",
    content: {
      type: "code",

      left: `type Shape =
  | { kind: "circle"; radius: number }
  | { kind: "rect"; width: number; height: number };

function area(shape: Shape) {
  // Unsafe access
  return shape.width * shape.height;
  // Error: Property 'width' does not exist
  // on type '{ kind: "circle"; radius: number }'
}`,

      right: `type Shape =
  | { kind: "circle"; radius: number }
  | { kind: "rect"; width: number; height: number };

function area(shape: Shape) {
  switch (shape.kind) {
    case "circle":
      return Math.PI * shape.radius ** 2;
    case "rect":
      return shape.width * shape.height;
  }
}`,
    },

    correctSide: "right",
    explanationCorrect:
      "Discriminated unions use a shared literal property (here `kind`) to tell variants apart. When you switch on `shape.kind`, TypeScript narrows each case to the correct variant. You get full autocompletion and type safety in every branch.",
    explanationWrong:
      "Without checking `kind`, TypeScript sees the full union and only allows access to properties shared by all variants. `width` only exists on the `rect` variant, so accessing it directly is a compile error.",
    sourceUrl:
      "https://www.typescriptlang.org/docs/handbook/2/narrowing.html#discriminated-unions",
    sourceLabel: "TypeScript Handbook: Discriminated unions",
  },
  {
    id: "tn-004",
    category: "type-narrowing",
    difficulty: "medium",
    title: "The in operator",
    prompt: "Which checks properties before calling them?",
    content: {
      type: "code",

      left: `type Fish = { swim: () => void };
type Bird = { fly: () => void };

function move(animal: Fish | Bird) {
  // Guessing without checking
  (animal as Fish).swim();
}

const bird: Bird = { fly: () => {} };
move(bird); // Runtime error: swim is not a function`,

      right: `type Fish = { swim: () => void };
type Bird = { fly: () => void };

function move(animal: Fish | Bird) {
  if ("swim" in animal) {
    animal.swim();
  } else {
    animal.fly();
  }
}`,
    },

    correctSide: "right",
    explanationCorrect:
      'The `in` operator checks whether a property exists on an object at runtime. TypeScript uses this to narrow the type: inside the `"swim" in animal` branch, `animal` is narrowed to `Fish`. This works well when union members have distinct properties but no shared discriminant.',
    explanationWrong:
      "Using `as Fish` tells the compiler to trust you, but at runtime there is no check. If the actual value is a `Bird`, calling `.swim()` throws because that method does not exist. Type assertions should be a last resort, not a substitute for runtime checks.",
    sourceUrl:
      "https://www.typescriptlang.org/docs/handbook/2/narrowing.html#the-in-operator-narrowing",
    sourceLabel: "TypeScript Handbook: in operator narrowing",
  },
  {
    id: "tn-005",
    category: "type-narrowing",
    difficulty: "hard",
    title: "instanceof narrowing",
    prompt: "Which handles both Error and string values?",
    content: {
      type: "code",

      left: `function handleError(err: Error | string) {
  // Assumes it's always an Error
  console.log(err.message);
  console.log(err.stack);
  // Error if err is a string
}`,

      right: `function handleError(err: Error | string) {
  if (err instanceof Error) {
    console.log(err.message);
    console.log(err.stack);
  } else {
    console.log(err);
  }
}`,
    },

    correctSide: "right",
    explanationCorrect:
      "`instanceof` checks the prototype chain at runtime. Inside the `instanceof Error` branch, TypeScript knows `err` is an `Error` with `.message` and `.stack`. In the else branch, it is narrowed to `string`. This is especially useful for class hierarchies.",
    explanationWrong:
      'Accessing `.message` on a `string` value fails because strings do not have a `.message` property. In JavaScript, both `throw new Error("oops")` and `throw "oops"` are valid, so catch blocks often receive `Error | string` (or `unknown`).',
    sourceUrl:
      "https://www.typescriptlang.org/docs/handbook/2/narrowing.html#instanceof-narrowing",
    sourceLabel: "TypeScript Handbook: instanceof narrowing",
  },
  {
    id: "tn-006",
    category: "type-narrowing",
    difficulty: "hard",
    title: "User-defined type guards",
    prompt: "Which propagates narrowing to the caller?",
    content: {
      type: "code",

      left: `type Cat = { meow: () => void; purr: () => void };
type Dog = { bark: () => void; fetch: () => void };

function isCat(pet: Cat | Dog) {
  return "meow" in pet;
}

function handle(pet: Cat | Dog) {
  if (isCat(pet)) {
    // TypeScript still sees Cat | Dog here
    pet.purr(); // Error
  }
}`,

      right: `type Cat = { meow: () => void; purr: () => void };
type Dog = { bark: () => void; fetch: () => void };

function isCat(pet: Cat | Dog): pet is Cat {
  return "meow" in pet;
}

function handle(pet: Cat | Dog) {
  if (isCat(pet)) {
    // TypeScript knows pet is Cat
    pet.purr(); // OK
  }
}`,
    },

    correctSide: "right",
    explanationCorrect:
      "A user-defined type guard uses the `pet is Cat` return type to tell TypeScript that when the function returns true, the argument is a specific type. Without this annotation, TypeScript cannot infer the narrowing across function boundaries. The return type `pet is Cat` bridges runtime logic and compile-time types.",
    explanationWrong:
      'A regular boolean return type tells TypeScript nothing about the argument\'s type. Even though the function checks `"meow" in pet`, TypeScript does not propagate that narrowing back to the caller. The type stays `Cat | Dog` in the if-block.',
    sourceUrl:
      "https://www.typescriptlang.org/docs/handbook/2/narrowing.html#using-type-predicates",
    sourceLabel: "TypeScript Handbook: Type predicates",
  },
];
