import type { BaseChallenge } from "../../game/types";

export const enumsLiteralsChallenges: BaseChallenge[] = [
  {
    id: "el-001",
    category: "enums-literals",
    difficulty: "easy",
    title: "String literals vs string enums",
    prompt: "Which has less runtime overhead?",
    content: {
      type: "code",

      left: `enum Color {
  Red = "RED",
  Green = "GREEN",
  Blue = "BLUE",
}

// Must import enum to use values
// Generates runtime JavaScript object
// JSON requires conversion: Color[json.color]
function paint(color: Color) { }
paint(Color.Red);`,

      right: `type Color = "RED" | "GREEN" | "BLUE";

// No import needed for values
// Zero runtime cost (erased at compile time)
// JSON strings work directly
function paint(color: Color) { }
paint("RED");`,
    },

    correctSide: "right",
    explanationCorrect:
      "String literal unions are erased at compile time, so they add nothing to the bundle. Plain strings from JSON or APIs match directly without conversion. You get the same autocomplete and type checking as enums, with less overhead.",
    explanationWrong:
      "String enums generate a runtime object that maps keys to values. This adds bundle size and requires importing the enum everywhere. When consuming JSON, you need to validate or convert string values into enum members, adding unnecessary friction.",
    sourceUrl: "https://www.totaltypescript.com/concepts/unions-vs-enums",
    sourceLabel: "Total TypeScript: Unions vs Enums",
  },
  {
    id: "el-002",
    category: "enums-literals",
    difficulty: "easy",
    title: "Numeric enum dangers",
    prompt: "Which rejects invalid values?",
    content: {
      type: "code",

      left: `enum Status {
  Active,   // 0
  Inactive, // 1
  Pending,  // 2
}

function setStatus(status: Status) { }

// Any number is accepted!
setStatus(0);    // OK (Active)
setStatus(999);  // No error, no such member!`,

      right: `type Status = "active" | "inactive" | "pending";

function setStatus(status: Status) { }

setStatus("active");  // OK
setStatus("xyz");     // Error: not assignable`,
    },

    correctSide: "right",
    explanationCorrect:
      "String literal unions only accept exact string values. There is no way to accidentally pass an invalid value. Numeric enums in TypeScript accept any number, which is a known design flaw that can lead to subtle bugs.",
    explanationWrong:
      "Numeric enums accept any number value, not just the defined members. `setStatus(999)` compiles without error even though there is no member with value 999. This is a TypeScript design limitation that makes numeric enums unreliable for input validation.",
    sourceUrl:
      "https://www.typescriptlang.org/docs/handbook/enums.html#numeric-enums",
    sourceLabel: "TypeScript Handbook: Numeric enums",
  },
  {
    id: "el-003",
    category: "enums-literals",
    difficulty: "medium",
    title: "const enum pitfalls",
    prompt: "Which is compatible with all bundlers?",
    content: {
      type: "code",

      left: `// const enums are inlined at compile time
const enum Direction {
  Up = "UP",
  Down = "DOWN",
}

// Problem: breaks with --isolatedModules
// Problem: can't iterate over members
// Problem: incompatible with some bundlers
const dir: Direction = Direction.Up;`,

      right: `// as const object: iterable, compatible, no gotchas
const Direction = {
  Up: "UP",
  Down: "DOWN",
} as const;

type Direction = (typeof Direction)[keyof typeof Direction];
// "UP" | "DOWN"

const dir: Direction = Direction.Up;
// Can also iterate: Object.values(Direction)`,
    },

    correctSide: "right",
    explanationCorrect:
      "`as const` objects provide named constants like enums but without the compatibility issues. You can iterate over values with `Object.values()`, and they work with `--isolatedModules` and all bundlers. The derived union type gives you the same compile-time safety.",
    explanationWrong:
      "`const enum` is inlined at compile time, which means the runtime object does not exist. This breaks `--isolatedModules` (required by most modern bundlers), prevents iteration over members, and causes issues with declaration files consumed by other packages.",
    sourceUrl:
      "https://www.typescriptlang.org/docs/handbook/enums.html#const-enums",
    sourceLabel: "TypeScript Handbook: const enums",
  },
  {
    id: "el-004",
    category: "enums-literals",
    difficulty: "medium",
    title: "as const objects vs enums",
    prompt: "Which pattern is more versatile?",
    content: {
      type: "code",

      left: `enum HttpMethod {
  GET = "GET",
  POST = "POST",
  PUT = "PUT",
  DELETE = "DELETE",
}

// Runtime: { GET: "GET", POST: "POST", ... }
// Reverse mappings for string enums: none
// Bundle impact: generates runtime code`,

      right: `const HttpMethod = {
  GET: "GET",
  POST: "POST",
  PUT: "PUT",
  DELETE: "DELETE",
} as const;

type HttpMethod = (typeof HttpMethod)[keyof typeof HttpMethod];

// Same autocomplete: HttpMethod.GET
// Same type safety: only "GET" | "POST" | "PUT" | "DELETE"
// Bonus: works with Object.keys/values`,
    },

    correctSide: "right",
    explanationCorrect:
      "An `as const` object is plain JavaScript, so it works everywhere without special TypeScript compilation. It provides the same namespace for values (`HttpMethod.GET`) and the same union type for function parameters. It also supports runtime operations like `Object.values(HttpMethod)`.",
    explanationWrong:
      "String enums are a TypeScript-specific construct that generates runtime code. They do not support `Object.values()` in the same ergonomic way and add complexity for libraries that need to interoperate with plain JavaScript. For string-based value sets, `as const` objects are more versatile.",
    sourceUrl: "https://www.totaltypescript.com/concepts/as-const",
    sourceLabel: "Total TypeScript: as const",
  },
  {
    id: "el-005",
    category: "enums-literals",
    difficulty: "hard",
    title: "Union from object values",
    prompt: "Which keeps the type in sync automatically?",
    content: {
      type: "code",

      left: `// Manually keeping the union in sync with the object
const ROUTES = {
  home: "/",
  about: "/about",
  blog: "/blog",
};

// Hand-written, drifts when ROUTES changes
type Route = "/" | "/about" | "/blog";`,

      right: `const ROUTES = {
  home: "/",
  about: "/about",
  blog: "/blog",
} as const;

// Automatically derived from the object
type Route = (typeof ROUTES)[keyof typeof ROUTES];
// "/" | "/about" | "/blog"

// Add a new route? The type updates automatically.`,
    },

    correctSide: "right",
    explanationCorrect:
      "`(typeof ROUTES)[keyof typeof ROUTES]` extracts all values from the `as const` object as a union type. When you add or remove a route, the `Route` type updates automatically. This single-source-of-truth pattern eliminates manual synchronization.",
    explanationWrong:
      'Manually writing the union means two places to update when routes change. If you add `contact: "/contact"` to the object but forget to update the type, TypeScript cannot catch routes that reference `"/contact"`. The derived approach prevents this class of bugs.',
    sourceUrl:
      "https://www.typescriptlang.org/docs/handbook/2/typeof-types.html",
    sourceLabel: "TypeScript Handbook: typeof type operator",
  },
  {
    id: "el-006",
    category: "enums-literals",
    difficulty: "hard",
    title: "Enum vs union for API contracts",
    prompt: "Which works naturally with JSON data?",
    content: {
      type: "code",

      left: `// Backend sends: { "status": "active" }
enum UserStatus {
  Active = "active",
  Inactive = "inactive",
}

// Must convert JSON strings to enum values
const data = await fetch("/api/user").then(r => r.json());
// data.status is string, not UserStatus
// Need: UserStatus[data.status] or validation`,

      right: `// Backend sends: { "status": "active" }
type UserStatus = "active" | "inactive";

interface User {
  name: string;
  status: UserStatus;
}

const data: User = await fetch("/api/user")
  .then(r => r.json());
// data.status is UserStatus directly
// JSON strings match the type naturally`,
    },

    correctSide: "right",
    explanationCorrect:
      'When your API sends string values like `"active"`, a string literal union matches those values directly. No conversion step is needed between the JSON response and your TypeScript types. This makes API integration simpler and less error-prone.',
    explanationWrong:
      "Enums create a layer of indirection between the API's string values and your code's enum values. You need to validate or convert every API response, and forgetting to do so means the value is typed as `string` instead of the enum. Unions eliminate this friction for string-based API contracts.",
    sourceUrl:
      "https://www.typescriptlang.org/docs/handbook/enums.html#enums-at-compile-time",
    sourceLabel: "TypeScript Handbook: Enums at compile time",
  },
  {
    id: "el-007",
    category: "enums-literals",
    difficulty: "medium",
    title: "Erasable syntax and --erasableSyntaxOnly",
    prompt: "Which syntax can be safely type-stripped?",
    content: {
      type: "code",

      left: `// With --erasableSyntaxOnly (TS 5.8+)
// These features have runtime behavior
// and are NOT erasable:

enum Status { Active, Inactive } // Error

namespace Utils {               // Error
  export const parse = () => {};
}

class User {
  constructor(public name: string) {} // Error
}`,

      right: `// With --erasableSyntaxOnly (TS 5.8+)
// All syntax is safely erasable:

type Status = "active" | "inactive";

const Utils = {
  parse: () => {},
};

class User {
  name: string;
  constructor(name: string) {
    this.name = name;
  }
}`,
    },

    correctSide: "right",
    explanationCorrect:
      'The `--erasableSyntaxOnly` flag (TypeScript 5.8) ensures all TypeScript syntax can be removed without changing runtime behavior. This is required for Node.js type stripping and the future "types as comments" proposal. Unions replace enums, plain objects replace namespaces, and explicit assignments replace parameter properties.',
    explanationWrong:
      "Enums, namespaces, and parameter properties generate JavaScript code that does not exist in the original source. Tools that strip types (like Node.js 23+ and future browsers) cannot handle these constructs because removing them would change runtime behavior. The erasableSyntaxOnly flag catches these at compile time.",
    sourceUrl: "https://www.totaltypescript.com/erasable-syntax-only",
    sourceLabel: "Total TypeScript: Erasable Syntax Only",
  },
];
