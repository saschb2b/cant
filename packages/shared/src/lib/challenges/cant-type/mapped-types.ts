import type { BaseChallenge } from "../../game/types";

export const mappedTypeChallenges: BaseChallenge[] = [
  {
    id: "mt-001",
    category: "mapped-types",
    difficulty: "easy",
    title: "Basic mapped types",
    prompt: "Which stays in sync when the source changes?",
    content: {
      type: "code",
      left: `interface User {
  name: string;
  email: string;
  age: number;
}

// Manually creating an optional version
interface PartialUser {
  name?: string;
  email?: string;
  age?: number;
}
// Must update both when User changes`,
      right: `interface User {
  name: string;
  email: string;
  age: number;
}

// Mapped type transforms every property
type PartialUser = {
  [K in keyof User]?: User[K];
};

// Or simply use the built-in:
type AlsoPartialUser = Partial<User>;
// Both auto-update when User changes`,
    },
    correctSide: "right",
    explanationCorrect:
      "Mapped types iterate over keys of an existing type using `[K in keyof T]` and can add or remove modifiers like `?` and `readonly`. This is exactly how the built-in Partial utility type works. Changes to the source type automatically propagate to the mapped type.",
    explanationWrong:
      "Manually duplicating an interface with optional properties creates two types that must be kept in sync. Adding a new field to User without updating PartialUser leads to inconsistencies that the compiler cannot detect. Mapped types derive one type from another, eliminating this drift.",
    sourceUrl:
      "https://www.typescriptlang.org/docs/handbook/2/mapped-types.html",
    sourceLabel: "TypeScript: Mapped Types",
  },
  {
    id: "mt-002",
    category: "mapped-types",
    difficulty: "easy",
    title: "Key remapping with as",
    prompt: "Which generates setter names automatically?",
    content: {
      type: "code",
      left: `interface Config {
  host: string;
  port: number;
  debug: boolean;
}

// Manually creating setter functions
interface ConfigSetters {
  setHost: (val: string) => void;
  setPort: (val: number) => void;
  setDebug: (val: boolean) => void;
}`,
      right: `interface Config {
  host: string;
  port: number;
  debug: boolean;
}

type Setters<T> = {
  [K in keyof T
    as \`set\${Capitalize<string & K>}\`
  ]: (value: T[K]) => void;
};

type ConfigSetters = Setters<Config>;
// { setHost: (value: string) => void;
//   setPort: (value: number) => void;
//   setDebug: (value: boolean) => void }`,
    },
    correctSide: "right",
    explanationCorrect:
      "The `as` clause in mapped types lets you remap keys to new names. Combined with template literal types and Capitalize, you can automatically generate setter method names from property keys. The value types stay correctly linked to their original properties.",
    explanationWrong:
      "Manually writing setter interfaces requires updating three places when a config property changes: the Config type, the setter type, and the implementation. Key remapping generates the setter type automatically, so adding a new config field produces the correct setter signature with no extra work.",
    sourceUrl:
      "https://www.typescriptlang.org/docs/handbook/2/mapped-types.html#key-remapping-via-as",
    sourceLabel: "TypeScript: Key Remapping via as",
  },
  {
    id: "mt-003",
    category: "mapped-types",
    difficulty: "medium",
    title: "Conditional types for filtering",
    prompt: "Which extracts string fields automatically?",
    content: {
      type: "code",
      left: `interface User {
  id: number;
  name: string;
  email: string;
  isAdmin: boolean;
  age: number;
}

// Manually picking string properties
interface StringFields {
  name: string;
  email: string;
}
// Breaks if User changes`,
      right: `type StringKeys<T> = {
  [K in keyof T]: T[K] extends string ? K : never;
}[keyof T];

interface User {
  id: number;
  name: string;
  email: string;
  isAdmin: boolean;
  age: number;
}

type UserStringKeys = StringKeys<User>;
// "name" | "email"

type UserStrings = Pick<User, UserStringKeys>;
// { name: string; email: string }`,
    },
    correctSide: "right",
    explanationCorrect:
      "Conditional types inside mapped types can filter keys by their value type. Mapping non-matching keys to `never` and then indexing with `[keyof T]` produces a union of only the matching keys. Combined with Pick, this extracts a subset of properties based on their types.",
    explanationWrong:
      "Manually picking properties by hand creates a separate type that must be maintained whenever the source type changes. Adding a new string property to User would not appear in StringFields unless you remember to add it. Type-level filtering keeps the extracted type in sync automatically.",
    sourceUrl:
      "https://www.typescriptlang.org/docs/handbook/2/conditional-types.html",
    sourceLabel: "TypeScript: Conditional Types",
  },
  {
    id: "mt-004",
    category: "mapped-types",
    difficulty: "medium",
    title: "Extracting types with infer",
    prompt: "Which derives the type from the function?",
    content: {
      type: "code",
      left: `// Manually defining return types
type UserFromAPI = {
  name: string;
  email: string;
};

async function fetchUser(): Promise<UserFromAPI> {
  return api.get("/user");
}

// Must keep UserFromAPI in sync with
// what the function actually returns
type FetchedUser = UserFromAPI;`,
      right: `async function fetchUser() {
  const res = await api.get<{
    name: string;
    email: string;
  }>("/user");
  return res.data;
}

// Extract the resolved type from
// the function's return type
type UnwrapPromise<T> =
  T extends Promise<infer U> ? U : T;

type FetchedUser = UnwrapPromise<
  ReturnType<typeof fetchUser>
>;
// { name: string; email: string }
// Auto-updates when fetchUser changes`,
    },
    correctSide: "right",
    explanationCorrect:
      "The infer keyword lets you declare a type variable within a conditional type and extract part of a matched type. Here it unwraps the Promise to get the resolved value type. Combined with ReturnType, this derives the type directly from the function, so changes to fetchUser automatically flow to FetchedUser.",
    explanationWrong:
      "Defining a separate type alias and manually keeping it in sync with the function's actual return type is fragile. If the API response shape changes in the function but not in the type alias, the compiler cannot detect the mismatch. Using infer with ReturnType extracts the type from the source of truth.",
    sourceUrl:
      "https://www.typescriptlang.org/docs/handbook/2/conditional-types.html#inferring-within-conditional-types",
    sourceLabel: "TypeScript: Inferring Within Conditional Types",
  },
  {
    id: "mt-005",
    category: "mapped-types",
    difficulty: "hard",
    title: "Distributive conditional types",
    prompt: "Which removes null from every nested level?",
    content: {
      type: "code",
      left: `type NonNullableFields<T> = {
  [K in keyof T]: Exclude<T[K], null | undefined>;
};

// But what about nested objects?
interface Form {
  name: string | null;
  address: {
    city: string | null;
    zip: string | undefined;
  } | null;
}

type Clean = NonNullableFields<Form>;
// address.city is still string | null`,
      right: `type DeepNonNullable<T> =
  T extends object
    ? { [K in keyof T]-?:
        DeepNonNullable<NonNullable<T[K]>>
      }
    : NonNullable<T>;

interface Form {
  name: string | null;
  address: {
    city: string | null;
    zip: string | undefined;
  } | null;
}

type Clean = DeepNonNullable<Form>;
// { name: string;
//   address: { city: string; zip: string } }`,
    },
    correctSide: "right",
    explanationCorrect:
      "Distributive conditional types (T extends object ? ...) distribute over union members. By recursively applying the transformation, DeepNonNullable strips null and undefined from every level of a nested type. The -? modifier removes optional markers as well.",
    explanationWrong:
      "A shallow mapped type only transforms the top-level properties. Nested objects retain their original nullability, which means you still need manual null checks inside deeply nested structures. Recursive conditional types solve this by applying the transformation at every depth.",
    sourceUrl:
      "https://www.typescriptlang.org/docs/handbook/2/conditional-types.html#distributive-conditional-types",
    sourceLabel: "TypeScript: Distributive Conditional Types",
  },
  {
    id: "mt-006",
    category: "mapped-types",
    difficulty: "hard",
    title: "Recursive types for nested paths",
    prompt: "Which computes all valid dot-paths?",
    content: {
      type: "code",
      left: `interface Config {
  db: { host: string; port: number };
  cache: { ttl: number };
}

// Manually listing all possible paths
type ConfigPath =
  | "db"
  | "db.host"
  | "db.port"
  | "cache"
  | "cache.ttl";
// Must update when Config changes`,
      right: `type Paths<T, Prefix extends string = ""> =
  T extends object
    ? {
        [K in keyof T & string]:
          | \`\${Prefix}\${K}\`
          | Paths<T[K], \`\${Prefix}\${K}.\`>
      }[keyof T & string]
    : never;

interface Config {
  db: { host: string; port: number };
  cache: { ttl: number };
}

type ConfigPath = Paths<Config>;
// "db" | "db.host" | "db.port"
// | "cache" | "cache.ttl"`,
    },
    correctSide: "right",
    explanationCorrect:
      "Recursive mapped types can generate dot-notation path strings for any nested object structure. By iterating over keys and recursing into object values, the type builds a union of all valid paths. Adding a new nested field to Config automatically produces the correct path string.",
    explanationWrong:
      "Manually enumerating dot-notation paths is tedious and impossible to keep in sync with a changing type. A recursive type computes the full set of valid paths from the source type, enabling type-safe deep access patterns like get(config, 'db.host') without maintaining a separate path list.",
    sourceUrl:
      "https://www.typescriptlang.org/docs/handbook/2/types-from-types.html",
    sourceLabel: "TypeScript: Creating Types from Types",
  },
];
