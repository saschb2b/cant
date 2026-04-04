import type { BaseChallenge } from "../../game/types";

export const templateLiteralChallenges: BaseChallenge[] = [
  {
    id: "tl-001",
    category: "template-literals",
    difficulty: "easy",
    title: "Event name patterns",
    prompt: "Which catches typos in event names?",
    content: {
      type: "code",

      left: `type EventHandler = {
  on: (event: string, cb: () => void) => void;
};

const emitter: EventHandler = getEmitter();
emitter.on("clck", handleClick);
// Typo not caught, handler never fires
// No error at compile time`,

      right: `type EventName =
  | \`on\${"Click" | "Hover" | "Focus"}\`
  | \`on\${"Key" | "Mouse"}\${"Down" | "Up"}\`;

type EventHandler = {
  on: (event: EventName, cb: () => void) => void;
};

const emitter: EventHandler = getEmitter();
emitter.on("onClick", handleClick);
// emitter.on("onClck", handleClick);
// Error: not assignable to EventName`,
    },

    correctSide: "right",
    explanationCorrect:
      "Template literal types let you define string patterns the compiler enforces. By combining literal unions inside template positions, TypeScript generates all valid combinations and catches typos at compile time instead of silently failing at runtime.",
    explanationWrong:
      "Using a plain string type for event names provides no protection against typos. A misspelled event name compiles without errors but silently fails at runtime because the handler is never triggered. Template literal types make the valid set of strings explicit.",
    sourceUrl:
      "https://www.typescriptlang.org/docs/handbook/2/template-literal-types.html",
    sourceLabel: "TypeScript: Template Literal Types",
  },
  {
    id: "tl-002",
    category: "template-literals",
    difficulty: "easy",
    title: "Route path types",
    prompt: "Which validates route path structure?",
    content: {
      type: "code",

      left: `function navigate(path: string) {
  router.push(path);
}

// No validation on path format
navigate("users/123");
// Missing leading slash, breaks routing
navigate("/uesrs/123");
// Typo in segment, silent 404`,

      right: `type AppRoute =
  | \`/users/\${number}\`
  | \`/posts/\${number}\`
  | \`/settings/\${"profile" | "billing"}\`;

function navigate(path: AppRoute) {
  router.push(path);
}

navigate("/users/123"); // OK
// navigate("users/123"); // Error
// navigate("/uesrs/123"); // Error`,
    },

    correctSide: "right",
    explanationCorrect:
      "Template literal types can encode the structure of URL paths. The compiler checks that the path starts with a slash, uses valid segments, and has parameters of the right type. Typos and missing slashes become compile-time errors.",
    explanationWrong:
      "Accepting any string for navigation paths means typos, missing slashes, and invalid routes all compile without errors. These bugs are only discovered when users see 404 pages at runtime. Template literal types catch the entire class of invalid route strings.",
    sourceUrl:
      "https://www.typescriptlang.org/docs/handbook/2/template-literal-types.html",
    sourceLabel: "TypeScript: Template Literal Types",
  },
  {
    id: "tl-003",
    category: "template-literals",
    difficulty: "medium",
    title: "String manipulation types",
    prompt: "Which produces proper camelCase getters?",
    content: {
      type: "code",

      left: `type Getters<T> = {
  [K in keyof T as \`get\${string}\`]: () => T[K];
};

// Key is just \`get\${string}\`, no link
// to the original property name.
// get_anything would match.
// No casing convention enforced.`,

      right: `type Getters<T> = {
  [K in keyof T as
    \`get\${Capitalize<string & K>}\`
  ]: () => T[K];
};

interface Person { name: string; age: number }
type PersonGetters = Getters<Person>;
// { getName: () => string;
//   getAge: () => number }`,
    },

    correctSide: "right",
    explanationCorrect:
      "TypeScript provides intrinsic string manipulation types: Uppercase, Lowercase, Capitalize, and Uncapitalize. Using Capitalize in a mapped type with template literals transforms property names to follow conventional getter naming (getName, getAge) while preserving the type relationship.",
    explanationWrong:
      "Using a raw template literal like `get${string}` accepts any string after 'get' and loses the connection to the original key. The resulting type cannot enforce camelCase naming or map each getter back to its specific property type.",
    sourceUrl:
      "https://www.typescriptlang.org/docs/handbook/2/template-literal-types.html#intrinsic-string-manipulation-types",
    sourceLabel: "TypeScript: String Manipulation Types",
  },
  {
    id: "tl-004",
    category: "template-literals",
    difficulty: "medium",
    title: "Template unions expand combinatorially",
    prompt: "Which generates all combinations for you?",
    content: {
      type: "code",

      left: `type Color = "red" | "green" | "blue";
type Shade = "light" | "dark";

// Manually listing all combinations
type Theme =
  | "light-red" | "light-green" | "light-blue"
  | "dark-red" | "dark-green" | "dark-blue";
// Doesn't scale. Forgot a combo?
// Adding a color means updating manually.`,

      right: `type Color = "red" | "green" | "blue";
type Shade = "light" | "dark";

// Template literal distributes over unions
type Theme = \`\${Shade}-\${Color}\`;
// Expands to:
// "light-red" | "light-green" |
// "light-blue" | "dark-red" |
// "dark-green" | "dark-blue"
// Adding a new Color auto-expands Theme`,
    },

    correctSide: "right",
    explanationCorrect:
      "When a template literal type contains union types, TypeScript distributes across them and generates every combination. Adding a new member to either union automatically expands the result. This removes the manual maintenance burden and eliminates the risk of missing a combination.",
    explanationWrong:
      "Manually enumerating all combinations of two union types is tedious and error-prone. If you add a new color, you must remember to add entries for every shade. Template literal types generate the full cross-product automatically, and they stay in sync as unions change.",
    sourceUrl:
      "https://www.typescriptlang.org/docs/handbook/2/template-literal-types.html",
    sourceLabel: "TypeScript: Template Literal Types",
  },
  {
    id: "tl-005",
    category: "template-literals",
    difficulty: "hard",
    title: "Branded string types",
    prompt: "Which ensures strings are validated first?",
    content: {
      type: "code",

      left: `function sendEmail(email: string) {
  mailer.send(email, template);
}

// Both compile, but one is wrong
sendEmail("user@example.com");
sendEmail("not an email at all");
// No way to distinguish validated
// strings from arbitrary strings`,

      right: `type Email = string & { __brand: "Email" };

function validateEmail(input: string): Email | null {
  const re = /^[^@]+@[^@]+\\.[^@]+$/;
  return re.test(input) ? (input as Email) : null;
}

function sendEmail(email: Email) {
  mailer.send(email, template);
}

const email = validateEmail(userInput);
if (email) sendEmail(email); // OK
// sendEmail("raw string"); // Error`,
    },

    correctSide: "right",
    explanationCorrect:
      "Branded types use an intersection with a phantom property to create a nominal subtype of string. The only way to obtain an Email value is through the validateEmail function, so sendEmail can trust that its input has already been validated. The brand property exists only at the type level.",
    explanationWrong:
      "Plain string types make no distinction between validated and unvalidated data. Any string, including empty strings and garbage input, can be passed to sendEmail. Branded types force all string data through a validation boundary before it can be used in type-safe contexts.",
    sourceUrl: "https://www.totaltypescript.com/concepts/branded-types",
    sourceLabel: "Total TypeScript: Branded Types",
  },
  {
    id: "tl-006",
    category: "template-literals",
    difficulty: "hard",
    title: "Key patterns with template literals",
    prompt: "Which converts snake_case keys automatically?",
    content: {
      type: "code",

      left: `interface APIResponse {
  user_id: number;
  user_name: string;
  user_email: string;
  post_count: number;
}

// Manual snake_case to camelCase mapping
interface ClientData {
  userId: number;
  userName: string;
  userEmail: string;
  postCount: number;
  // Must update both types in sync
}`,

      right: `type SnakeToCamel<S extends string> =
  S extends \`\${infer Head}_\${infer Tail}\`
    ? \`\${Head}\${Capitalize<SnakeToCamel<Tail>>}\`
    : S;

type CamelKeys<T> = {
  [K in keyof T
    as SnakeToCamel<string & K>]: T[K];
};

interface APIResponse {
  user_id: number;
  user_name: string;
  user_email: string;
  post_count: number;
}

type ClientData = CamelKeys<APIResponse>;
// { userId: number; userName: string;
//   userEmail: string; postCount: number }`,
    },

    correctSide: "right",
    explanationCorrect:
      "By combining template literal types with infer, you can write a recursive type that splits a string at underscores and capitalizes each subsequent segment. The CamelKeys mapped type transforms all keys automatically, so adding a new field to APIResponse updates ClientData with zero manual effort.",
    explanationWrong:
      "Maintaining two separate interfaces that must stay in sync is a source of silent bugs. When a new field is added to the API response, forgetting to add it to the client type means the data is available at runtime but invisible to TypeScript. A computed type transformation eliminates this drift.",
    sourceUrl:
      "https://www.typescriptlang.org/docs/handbook/2/template-literal-types.html",
    sourceLabel: "TypeScript: Template Literal Types",
  },
];
