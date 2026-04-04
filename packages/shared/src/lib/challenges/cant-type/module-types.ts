import type { BaseChallenge } from "../../game/types";

export const moduleTypeChallenges: BaseChallenge[] = [
  {
    id: "md-001",
    category: "module-types",
    difficulty: "easy",
    title: "Declaration files basics",
    prompt: "Which provides types for JS modules?",
    content: {
      type: "code",
      left: `// utils.js (no types)
export function slugify(text) {
  return text
    .toLowerCase()
    .replace(/\\s+/g, "-");
}

// app.ts
import { slugify } from "./utils";
// Error: Could not find a declaration
// file for module './utils'
// slugify is implicitly 'any'`,
      right: `// utils.d.ts
export declare function slugify(
  text: string
): string;

// Or even better, rename to utils.ts:
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/\\s+/g, "-");
}

// app.ts
import { slugify } from "./utils";
// slugify is typed: (text: string) => string`,
    },
    correctSide: "right",
    explanationCorrect:
      "Declaration files (.d.ts) describe the types for JavaScript files without containing implementation code. They let TypeScript understand the shape of JS modules. When possible, converting the source file to .ts is even better because it keeps types and implementation together.",
    explanationWrong:
      "Importing a .js file without a corresponding .d.ts file or type declarations causes TypeScript to treat all exports as implicit any (or error under noImplicitAny). This defeats the purpose of using TypeScript because the imported functions have no type checking.",
    sourceUrl:
      "https://www.typescriptlang.org/docs/handbook/declaration-files/introduction.html",
    sourceLabel: "TypeScript: Declaration Files",
  },
  {
    id: "md-002",
    category: "module-types",
    difficulty: "easy",
    title: "Ambient module declarations",
    prompt: "Which handles CSS and SVG imports?",
    content: {
      type: "code",
      left: `// app.ts
import styles from "./Button.module.css";
// Error: Cannot find module
// './Button.module.css' or its
// corresponding type declarations

import logo from "./logo.svg";
// Error: Cannot find module './logo.svg'`,
      right: `// global.d.ts
declare module "*.module.css" {
  const classes: Record<string, string>;
  export default classes;
}

declare module "*.svg" {
  const src: string;
  export default src;
}

// app.ts
import styles from "./Button.module.css"; // OK
import logo from "./logo.svg"; // OK`,
    },
    correctSide: "right",
    explanationCorrect:
      "Ambient module declarations use wildcard patterns to tell TypeScript the shape of non-TypeScript imports like CSS modules and SVG files. The declare module statement goes in a .d.ts file included in your project. Each pattern matches any import path that ends with that extension.",
    explanationWrong:
      "Without ambient declarations for non-TypeScript files, every CSS module or asset import produces an error. Adding @ts-ignore on every import silences the errors but also removes all type information. Ambient modules provide correct types for these imports project-wide.",
    sourceUrl:
      "https://www.typescriptlang.org/docs/handbook/modules/reference.html#ambient-modules",
    sourceLabel: "TypeScript: Ambient Modules",
  },
  {
    id: "md-003",
    category: "module-types",
    difficulty: "medium",
    title: "Module augmentation",
    prompt: "Which extends a library type cleanly?",
    content: {
      type: "code",
      left: `// Want to add a custom theme color to MUI
// Wrong: re-declaring the whole interface
interface PaletteOptions {
  primary?: PaletteColorOptions;
  secondary?: PaletteColorOptions;
  brand?: PaletteColorOptions;
  // Must copy ALL existing properties
  // Breaks when MUI updates
}`,
      right: `// theme.d.ts
import "@mui/material/styles";

declare module "@mui/material/styles" {
  interface PaletteOptions {
    brand?: PaletteColorOptions;
  }
  interface Palette {
    brand: PaletteColor;
  }
}

// Now theme.palette.brand is typed
// without overriding existing properties`,
    },
    correctSide: "right",
    explanationCorrect:
      "Module augmentation lets you add new properties to existing interfaces from external packages without redeclaring the entire type. TypeScript merges your additions with the original declarations. This is the officially supported way to extend library types like MUI's theme.",
    explanationWrong:
      "Redeclaring an entire interface from an external library means you must copy every existing property and keep it up to date across version upgrades. Module augmentation adds only your new properties, and TypeScript merges them with the library's original type automatically.",
    sourceUrl:
      "https://www.typescriptlang.org/docs/handbook/declaration-merging.html#module-augmentation",
    sourceLabel: "TypeScript: Module Augmentation",
  },
  {
    id: "md-004",
    category: "module-types",
    difficulty: "medium",
    title: "Global type augmentation",
    prompt: "Which adds Window properties type-safely?",
    content: {
      type: "code",
      left: `// Adding a property to Window
// Wrong: using 'any' to bypass type check
const analytics = (window as any).analytics;
analytics.track("page_view");
// No autocomplete, no type safety
// Crashes if analytics is not loaded`,
      right: `// global.d.ts
declare global {
  interface Window {
    analytics?: {
      track: (event: string) => void;
      identify: (userId: string) => void;
    };
  }
}

export {}; // Makes this a module

// app.ts
window.analytics?.track("page_view");
// Full autocomplete and null safety`,
    },
    correctSide: "right",
    explanationCorrect:
      "The declare global block augments the global scope from within a module file. By extending the Window interface, you get full type checking and autocomplete for custom global properties. The optional (?) marker ensures you handle the case where the script has not loaded.",
    explanationWrong:
      "Casting window to any removes all type checking for the entire expression chain. If the analytics script fails to load, calling .track() crashes at runtime with no warning. Global augmentation provides the same access with proper types and null-safety through optional chaining.",
    sourceUrl:
      "https://www.typescriptlang.org/docs/handbook/declaration-merging.html#global-augmentation",
    sourceLabel: "TypeScript: Global Augmentation",
  },
  {
    id: "md-005",
    category: "module-types",
    difficulty: "hard",
    title: "Type-only imports",
    prompt: "Which import is guaranteed to be erased?",
    content: {
      type: "code",
      left: `// types.ts
export interface User {
  id: string;
  name: string;
}

// component.ts
import { User } from "./types";
// This import may be kept in the
// compiled JS output, causing:
// 1. Unnecessary bundle size
// 2. Circular dependency issues
// 3. Side effects from module execution`,
      right: `// types.ts
export interface User {
  id: string;
  name: string;
}

// component.ts
import type { User } from "./types";
// Guaranteed to be erased at compile time
// No runtime import, no bundle impact,
// no circular dependency risk

// Or use inline type imports:
import { type User, fetchUser } from "./api";`,
    },
    correctSide: "right",
    explanationCorrect:
      "The import type syntax guarantees the import is erased during compilation and produces no runtime JavaScript. This prevents accidental side effects, reduces bundle size, and avoids circular dependency issues. TypeScript 4.5 also supports inline type imports for mixed import statements.",
    explanationWrong:
      "Regular imports of type-only exports may be preserved in the compiled output depending on the module system and bundler configuration. While many tools can tree-shake unused imports, using import type makes the intent explicit and works correctly regardless of the bundler.",
    sourceUrl:
      "https://www.typescriptlang.org/docs/handbook/2/modules.html#type-only-imports-and-exports",
    sourceLabel: "TypeScript: Type-Only Imports",
  },
  {
    id: "md-006",
    category: "module-types",
    difficulty: "hard",
    title: "declare global for custom hooks",
    prompt: "Which makes custom matchers type-safe?",
    content: {
      type: "code",
      left: `// Want to add custom matchers to Jest
// Wrong: just calling it and hoping
expect.extend({
  toBeWithinRange(received, floor, ceiling) {
    const pass = received >= floor
      && received <= ceiling;
    return { pass, message: () => "..." };
  },
});

// test.ts
expect(100).toBeWithinRange(90, 110);
// Error: Property 'toBeWithinRange'
// does not exist on type 'Matchers'`,
      right: `// jest.d.ts
declare global {
  namespace jest {
    interface Matchers<R> {
      toBeWithinRange(
        floor: number,
        ceiling: number
      ): R;
    }
  }
}
export {};

// jest.setup.ts
expect.extend({
  toBeWithinRange(received, floor, ceiling) {
    const pass = received >= floor
      && received <= ceiling;
    return { pass, message: () => "..." };
  },
});

// test.ts
expect(100).toBeWithinRange(90, 110); // OK`,
    },
    correctSide: "right",
    explanationCorrect:
      "Jest's expect().toX() methods are defined in the jest.Matchers interface. By augmenting this interface inside a declare global block, you tell TypeScript about your custom matchers. The export {} at the end is required to make the file a module, which is necessary for declare global to work.",
    explanationWrong:
      "Calling expect.extend() adds the matcher at runtime, but TypeScript does not know about it. Every test file that uses the custom matcher gets a type error. Without the type augmentation, you would need to cast expect() to any, losing type safety on all assertions in the chain.",
    sourceUrl: "https://jestjs.io/docs/expect#expectextendmatchers",
    sourceLabel: "Jest: Custom Matchers",
  },
];
