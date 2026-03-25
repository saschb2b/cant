import type { ChallengeCategory } from "./types";

/** Canonical display order of challenge categories. */
export const CATEGORY_ORDER: ChallengeCategory[] = [
  // Foundations
  "type-narrowing",
  "generics",
  "utility-types",
  "union-intersection",
  // Type Safety
  "type-assertions",
  "enums-literals",
  "strict-mode",
  "readonly-immutability",
  // Functions & Structures
  "function-types",
  "interface-vs-type",
  "mapped-types",
  "template-literals",
  // Applied TypeScript
  "react-typescript",
  "module-types",
  // Anti-Patterns & Debugging
  "error-handling",
  "common-mistakes",
];

/** Human-readable labels for each challenge category. */
export const CATEGORY_LABELS: Record<ChallengeCategory, string> = {
  "type-narrowing": "Type Narrowing",
  generics: "Generics",
  "utility-types": "Utility Types",
  "union-intersection": "Union & Intersection",
  "type-assertions": "Type Assertions",
  "enums-literals": "Enums & Literals",
  "strict-mode": "Strict Mode",
  "readonly-immutability": "Readonly & Immutability",
  "function-types": "Function Types",
  "interface-vs-type": "Interface vs Type",
  "mapped-types": "Mapped Types",
  "template-literals": "Template Literals",
  "react-typescript": "React + TypeScript",
  "module-types": "Module Types",
  "error-handling": "Error Handling",
  "common-mistakes": "Common Mistakes",
};

/** Logical grouping of categories for sidebar navigation. */
export interface CategorySection {
  label: string;
  categories: ChallengeCategory[];
}

export const CATEGORY_SECTIONS: CategorySection[] = [
  {
    label: "Foundations",
    categories: [
      "type-narrowing",
      "generics",
      "utility-types",
      "union-intersection",
    ],
  },
  {
    label: "Type Safety",
    categories: [
      "type-assertions",
      "enums-literals",
      "strict-mode",
      "readonly-immutability",
    ],
  },
  {
    label: "Functions & Structures",
    categories: [
      "function-types",
      "interface-vs-type",
      "mapped-types",
      "template-literals",
    ],
  },
  {
    label: "Applied TypeScript",
    categories: ["react-typescript", "module-types"],
  },
  {
    label: "Anti-Patterns & Debugging",
    categories: ["error-handling", "common-mistakes"],
  },
];

/** Recommended category order for newcomers starting from scratch. */
export const LEARNING_PATH: ChallengeCategory[] = [
  "type-narrowing",
  "generics",
  "union-intersection",
  "interface-vs-type",
  "common-mistakes",
];

/** Short description for each category, shown on the learn overview. */
export const CATEGORY_DESCRIPTIONS: Record<ChallengeCategory, string> = {
  "type-narrowing":
    "Discriminated unions, type guards, typeof, and instanceof for safely accessing properties. You'll hit this when TypeScript complains about a property that might not exist on a union type.",
  generics:
    "Type parameters, constraints, inference, and when to let TypeScript figure it out. You'll hit this when you write a function that should work with multiple types but you keep reaching for `any`.",
  "utility-types":
    "Partial, Required, Pick, Omit, Record, and Extract for transforming types without rewriting them. You'll hit this when you need a version of an existing type with some fields optional or removed.",
  "union-intersection":
    "Union types for alternatives, intersection types for combining, and the `never` type for exhaustive checks. You'll hit this when a value can be one of several shapes and you need to handle all of them.",
  "type-assertions":
    "as const, satisfies, type predicates, and why `as` should be your last resort. You'll hit this when you know more than the compiler but want to prove it safely instead of just overriding.",
  "enums-literals":
    "String literal unions vs enums, const assertions, and when numeric enums cause trouble. You'll hit this when you need a fixed set of values and can't decide between `type Status = 'active' | 'inactive'` and `enum Status`.",
  "strict-mode":
    "strictNullChecks, noUncheckedIndexedAccess, exactOptionalPropertyTypes, and the flags that catch real bugs. You'll hit this when your code compiles fine but crashes at runtime because a value was unexpectedly undefined.",
  "readonly-immutability":
    "readonly properties, Readonly<T>, ReadonlyArray, and as const for preventing accidental mutations. You'll hit this when a function modifies an array or object it was only supposed to read.",
  "function-types":
    "Overloads, generic functions, callback typing, and return type inference. You'll hit this when a function should accept different argument shapes and return different types accordingly.",
  "interface-vs-type":
    "When to use interface, when to use type, declaration merging, and extending vs intersecting. You'll hit this when you're unsure which to pick and whether it actually matters.",
  "mapped-types":
    "Key remapping, conditional types, infer keyword, and building types from other types. You'll hit this when you need to transform every property of an existing type in a systematic way.",
  "template-literals":
    "Template literal types, string manipulation types, and pattern matching on string shapes. You'll hit this when you want the compiler to enforce that a string follows a specific format like `on${string}`.",
  "react-typescript":
    "Component props, event handlers, refs, generic components, and polymorphic patterns. You'll hit this when you try to type a React component that forwards refs or accepts an `as` prop.",
  "module-types":
    "Declaration files, ambient modules, type augmentation, and global types. You'll hit this when you import a JavaScript library that has no types or need to extend an existing module's types.",
  "error-handling":
    "Unknown vs any in catch blocks, Result types, type-safe error handling, and assertion functions. You'll hit this when your catch block uses `error.message` and TypeScript says `error` is `unknown`.",
  "common-mistakes":
    "Overusing any, unnecessary type assertions, ignoring strict flags, and other TypeScript anti-patterns that compile but break. You'll hit this when TypeScript stops catching bugs it should have caught.",
};
