import type { Preset } from "./types";

export const presets: Preset[] = [
  {
    id: "utility-basics",
    label: "Utility Types",
    code: `interface User {
  id: number;
  name: string;
  email: string;
  password: string;
}

type PublicUser = Omit<User, "password">;

type UserUpdate = Partial<Pick<User, "name" | "email">>;

type UserKeys = keyof User;`,
  },
  {
    id: "mapped-types",
    label: "Mapped Types",
    code: `interface Config {
  host: string;
  port: number;
  debug: boolean;
}

type Optional<T> = {
  [K in keyof T]?: T[K];
};

type Setters<T> = {
  [K in keyof T as \`set\${Capitalize<string & K>}\`]: (value: T[K]) => void;
};

type OptionalConfig = Optional<Config>;

type ConfigSetters = Setters<Config>;`,
  },
  {
    id: "conditional-types",
    label: "Conditional Types",
    code: `type IsString<T> = T extends string ? true : false;

type A = IsString<"hello">;
type B = IsString<42>;

type ExtractStrings<T> = T extends string ? T : never;

type Mixed = "a" | 1 | "b" | true | "c";
type OnlyStrings = ExtractStrings<Mixed>;`,
  },
  {
    id: "template-literals",
    label: "Template Literals",
    code: `type Color = "red" | "green" | "blue";
type Size = "sm" | "md" | "lg";

type ColorClass = \`text-\${Color}\`;
type SizeClass = \`size-\${Size}\`;
type AllClasses = \`\${Size}-\${Color}\`;`,
  },
  {
    id: "infer-keyword",
    label: "Infer Keyword",
    code: `type GetReturnType<T> =
  T extends (...args: any[]) => infer R ? R : never;

type GetParams<T> =
  T extends (...args: infer P) => any ? P : never;

type Fn = (name: string, age: number) => { id: number };

type FnReturn = GetReturnType<Fn>;
type FnParams = GetParams<Fn>;`,
  },
  {
    id: "recursive-types",
    label: "Recursive Types",
    code: `type DeepReadonly<T> = {
  readonly [K in keyof T]: T[K] extends object
    ? DeepReadonly<T[K]>
    : T[K];
};

interface Settings {
  theme: { mode: "light" | "dark"; accent: string };
  notifications: { email: boolean; push: boolean };
}

type FrozenSettings = DeepReadonly<Settings>;`,
  },
  {
    id: "discriminated-unions",
    label: "Discriminated Unions",
    code: `type Success<T> = { status: "ok"; data: T };
type Failure = { status: "error"; message: string };
type Loading = { status: "loading" };

type ApiState<T> = Success<T> | Failure | Loading;

type UserState = ApiState<{ name: string; email: string }>;

type ExtractData<T> =
  T extends { status: "ok"; data: infer D } ? D : never;

type UserData = ExtractData<UserState>;`,
  },
  {
    id: "record-types",
    label: "Record and Index",
    code: `type Permission = "read" | "write" | "admin";
type Resource = "posts" | "users" | "settings";

type PermissionMap = Record<Resource, Permission[]>;

type Flags = Record<string, boolean>;

type Matrix = Record<Resource, Record<Permission, boolean>>;`,
  },
];
