import type { BaseChallenge } from "../../game/types";

export const strictModeChallenges: BaseChallenge[] = [
  {
    id: "sm-001",
    category: "strict-mode",
    difficulty: "easy",
    title: "strictNullChecks prevents null crashes",
    prompt: "Which catches missing null checks?",
    content: {
      type: "code",

      left: `// tsconfig: "strict": false
function getLength(name: string) {
  return name.length;
}

const user = users.find((u) => u.id === id);
// No error, but user might be undefined
console.log(getLength(user.name));
// Runtime: Cannot read property 'name'
// of undefined`,

      right: `// tsconfig: "strict": true
function getLength(name: string) {
  return name.length;
}

const user = users.find((u) => u.id === id);
// Error: 'user' is possibly 'undefined'
if (user) {
  console.log(getLength(user.name));
}`,
    },

    correctSide: "right",
    explanationCorrect:
      "With strictNullChecks enabled, TypeScript knows that Array.find() returns T | undefined. The compiler forces you to handle the undefined case before accessing properties, catching potential runtime crashes at compile time.",
    explanationWrong:
      "Without strictNullChecks, TypeScript assumes every value is non-null. This means find() appears to return T instead of T | undefined, so the compiler lets you access .name on a potentially undefined value. The bug only appears at runtime.",
    sourceUrl: "https://www.typescriptlang.org/tsconfig/#strictNullChecks",
    sourceLabel: "TypeScript: strictNullChecks",
  },
  {
    id: "sm-002",
    category: "strict-mode",
    difficulty: "easy",
    title: "noUncheckedIndexedAccess for arrays",
    prompt: "Which handles out-of-bounds access safely?",
    content: {
      type: "code",

      left: `// tsconfig: noUncheckedIndexedAccess not set
const names: string[] = ["Alice", "Bob"];

// TypeScript says this is 'string'
const third = names[2];
console.log(third.toUpperCase());
// Runtime: Cannot read property
// 'toUpperCase' of undefined`,

      right: `// tsconfig: "noUncheckedIndexedAccess": true
const names: string[] = ["Alice", "Bob"];

// TypeScript says this is 'string | undefined'
const third = names[2];
if (third !== undefined) {
  console.log(third.toUpperCase());
}`,
    },

    correctSide: "right",
    explanationCorrect:
      "With noUncheckedIndexedAccess enabled, accessing an array element by index returns T | undefined instead of just T. This forces you to handle the case where the index is out of bounds, preventing runtime errors from accessing properties on undefined.",
    explanationWrong:
      "Without noUncheckedIndexedAccess, TypeScript trusts that every array index access returns a valid element. Accessing an out-of-bounds index returns undefined at runtime, but TypeScript claims it is a string. This mismatch leads to unhandled runtime crashes.",
    sourceUrl:
      "https://www.typescriptlang.org/tsconfig/#noUncheckedIndexedAccess",
    sourceLabel: "TypeScript: noUncheckedIndexedAccess",
  },
  {
    id: "sm-003",
    category: "strict-mode",
    difficulty: "medium",
    title: "Strict property initialization",
    prompt: "Which ensures properties are always set?",
    content: {
      type: "code",

      left: `class UserService {
  private db: Database;
  private cache: Map<string, User>;

  // Forgot to initialize in constructor
  async init() {
    this.db = await connectDB();
    this.cache = new Map();
  }

  getUser(id: string) {
    return this.cache.get(id);
    // Runtime: Cannot read property 'get'
    // of undefined (if init not called)
  }
}`,

      right: `class UserService {
  private db: Database;
  private cache: Map<string, User>;

  constructor(db: Database) {
    this.db = db;
    this.cache = new Map();
  }

  getUser(id: string) {
    return this.cache.get(id);
    // Always safe: cache is initialized
    // in the constructor
  }
}`,
    },

    correctSide: "right",
    explanationCorrect:
      "With strictPropertyInitialization enabled (part of strict mode), TypeScript requires that class properties declared without a type that includes undefined must be initialized in the constructor. This catches the common pattern of forgetting to call an init method before using the class.",
    explanationWrong:
      "Deferring initialization to an async init() method means any code that calls getUser() before init() will crash. The compiler cannot guarantee the method call order at runtime. Either initialize in the constructor or mark the properties as possibly undefined.",
    sourceUrl:
      "https://www.typescriptlang.org/tsconfig/#strictPropertyInitialization",
    sourceLabel: "TypeScript: strictPropertyInitialization",
  },
  {
    id: "sm-004",
    category: "strict-mode",
    difficulty: "medium",
    title: "exactOptionalPropertyTypes",
    prompt: "Which distinguishes missing from undefined?",
    content: {
      type: "code",

      left: `interface Settings {
  theme?: "light" | "dark";
}

const settings: Settings = {};

// Explicitly setting to undefined
// clears it from storage
settings.theme = undefined;
// But this is different from "not set"
// in many serialization formats`,

      right: `// tsconfig: exactOptionalPropertyTypes: true
interface Settings {
  theme?: "light" | "dark";
  // ? means "can be missing"
  // NOT "can be undefined"
}

const settings: Settings = {};

// Error: Type 'undefined' is not
// assignable to type '"light" | "dark"'
settings.theme = undefined;

// To allow explicit undefined, write:
// theme?: "light" | "dark" | undefined;`,
    },

    correctSide: "right",
    explanationCorrect:
      "With exactOptionalPropertyTypes, the ? modifier means the property can be missing, not that it can be explicitly set to undefined. This distinction matters for serialization: JSON.stringify omits missing keys but includes keys with undefined values differently across environments.",
    explanationWrong:
      "Without this flag, TypeScript treats optional properties and properties that accept undefined as equivalent. This hides a real semantic difference: a missing property and a property set to undefined behave differently with the `in` operator, Object.keys(), and serialization.",
    sourceUrl:
      "https://www.typescriptlang.org/tsconfig/#exactOptionalPropertyTypes",
    sourceLabel: "TypeScript: exactOptionalPropertyTypes",
  },
  {
    id: "sm-005",
    category: "strict-mode",
    difficulty: "hard",
    title: "useUnknownInCatchVariables",
    prompt: "Which forces narrowing before property access?",
    content: {
      type: "code",

      left: `// tsconfig: useUnknownInCatchVariables: false
try {
  JSON.parse(userInput);
} catch (error) {
  // error is 'any' by default
  console.log(error.message);
  // Works for Error objects but crashes
  // if something else was thrown
  // (e.g., a string or number)
}`,

      right: `// tsconfig: useUnknownInCatchVariables: true
try {
  JSON.parse(userInput);
} catch (error) {
  // error is 'unknown'
  if (error instanceof Error) {
    console.log(error.message);
  } else {
    console.log("Unexpected error:", String(error));
  }
}`,
    },

    correctSide: "right",
    explanationCorrect:
      "With useUnknownInCatchVariables (part of strict since TypeScript 4.4), catch clause variables are typed as unknown instead of any. This forces you to narrow the type before accessing properties, which is correct because JavaScript allows throwing any value, not just Error objects.",
    explanationWrong:
      "When catch variables are typed as any, TypeScript lets you access .message without checking the type. But JavaScript allows `throw 'oops'` or `throw 42`, so the caught value might not be an Error at all. Accessing .message on a string causes a silent undefined, not the error message.",
    sourceUrl:
      "https://www.typescriptlang.org/tsconfig/#useUnknownInCatchVariables",
    sourceLabel: "TypeScript: useUnknownInCatchVariables",
  },
  {
    id: "sm-006",
    category: "strict-mode",
    difficulty: "hard",
    title: "Enabling strict mode incrementally",
    prompt: "Which adoption strategy is more practical?",
    content: {
      type: "code",

      left: `// tsconfig.json
{
  "compilerOptions": {
    "strict": true
    // Turned on strict in a 200-file project
    // Result: 847 errors, team gives up,
    // reverts to "strict": false
  }
}`,

      right: `// tsconfig.json
{
  "compilerOptions": {
    "strict": false,
    // Enable one flag at a time:
    "strictNullChecks": true,
    "noImplicitAny": true
    // Fix all errors, then enable next:
    // "strictBindCallApply": true
    // "strictFunctionTypes": true
    // "strictPropertyInitialization": true
    // Once all pass, replace with:
    // "strict": true
  }
}`,
    },

    correctSide: "right",
    explanationCorrect:
      "The strict flag is a shorthand that enables multiple sub-flags at once. In a large codebase, enabling all of them simultaneously creates an overwhelming number of errors. Enabling them one at a time lets you fix each category of issue incrementally, building toward full strict mode without blocking development.",
    explanationWrong:
      "Enabling strict mode all at once in a large project creates hundreds or thousands of errors across the codebase. Teams often revert it entirely because the task feels impossible. The incremental approach achieves the same end result while keeping the project buildable at every step.",
    sourceUrl: "https://www.typescriptlang.org/tsconfig/#strict",
    sourceLabel: "TypeScript: strict",
  },
  {
    id: "sm-007",
    category: "strict-mode",
    difficulty: "easy",
    title: "TypeScript 6.0 strict defaults",
    prompt: "Which uses the recommended TS 6.0 defaults?",
    content: {
      type: "code",

      left: `// tsconfig.json (TS 6.0)
{
  "compilerOptions": {
    "strict": false,
    "target": "es5",
    "moduleResolution": "node"
  }
}
// Disabling strict in TS 6.0 opts out
// of the new safe defaults
// "target": "es5" is deprecated
// "moduleResolution": "node" is deprecated`,

      right: `// tsconfig.json (TS 6.0)
{
  "compilerOptions": {
    "module": "esnext",
    "moduleResolution": "bundler"
  }
}
// strict is ON by default in TS 6.0
// target defaults to es2025
// No deprecated options needed
// Just override what you actually need`,
    },

    correctSide: "right",
    explanationCorrect:
      "TypeScript 6.0 enables strict mode by default and sets modern defaults for target (es2025) and module (esnext). New projects get full type safety out of the box. You only need to configure what you actually want to change, like moduleResolution for your bundler.",
    explanationWrong:
      "Explicitly disabling strict in TypeScript 6.0 opts out of the safe defaults the team now recommends for all projects. Using deprecated options like `target: es5` and `moduleResolution: node` ties your project to legacy patterns that will be removed in TypeScript 7.0.",
    sourceUrl:
      "https://devblogs.microsoft.com/typescript/announcing-typescript-6-0/",
    sourceLabel: "TypeScript 6.0 Announcement",
  },
];
