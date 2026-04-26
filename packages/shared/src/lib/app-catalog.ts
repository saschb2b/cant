/**
 * Central catalog of all challenge categories across the Can't app ecosystem.
 *
 * Single source of truth for category metadata. Apps derive their local types
 * and exports from this file. The hub uses it for the assessment builder and
 * series grid stats.
 *
 * When adding or removing categories/challenges, update this file and the
 * consuming app re-exports will pick up the changes automatically.
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** Metadata for a single challenge category. */
export interface CategoryMeta {
  readonly slug: string;
  readonly label: string;
  readonly description: string;
  readonly questionCount: number;
}

/** Logical grouping of categories for sidebar navigation. */
export interface CategorySection<T extends string = string> {
  label: string;
  categories: T[];
}

/** Full category catalog for one app. */
export interface AppCatalogEntry {
  /** Display name matching CantApp.name, e.g. "Can't Type". */
  readonly appName: string;
  readonly categories: readonly CategoryMeta[];
  readonly sections: readonly {
    label: string;
    categories: readonly string[];
  }[];
  /** Recommended category order for newcomers (subset of category slugs). */
  readonly learningPath: readonly string[];
}

// ---------------------------------------------------------------------------
// Can't Maintain
// ---------------------------------------------------------------------------

const cantMaintain = {
  appName: "Can't Maintain",
  categories: [
    {
      slug: "component-naming",
      label: "Component Naming",
      description:
        "Naming components by role, not location. Avoiding over-specific prefixes, redundant splitting, and verb-based names.",
      questionCount: 8,
    },
    {
      slug: "boolean-naming",
      label: "Boolean Props",
      description:
        "Using is, has, should, and other prefixes to make yes/no props obvious at a glance.",
      questionCount: 6,
    },
    {
      slug: "callback-naming",
      label: "Callback Naming",
      description:
        "Why the on prefix matters and how to name event handler props so they read like English.",
      questionCount: 9,
    },
    {
      slug: "jsdoc",
      label: "JSDoc",
      description:
        "Documenting defaults, examples, and deprecations so consumers don't have to read your source.",
      questionCount: 5,
    },
    {
      slug: "default-values",
      label: "Default Values",
      description:
        "Setting sensible defaults via destructuring, stable references, and default callbacks.",
      questionCount: 5,
    },
    {
      slug: "prop-specificity",
      label: "Prop Specificity",
      description:
        "Replacing vague primitives with union types, template literals, and accessible text props.",
      questionCount: 7,
    },
    {
      slug: "prop-organization",
      label: "Prop Organization",
      description:
        "Grouping related props, removing redundancy, and knowing when to extract sub-components.",
      questionCount: 8,
    },
    {
      slug: "enumerated-variants",
      label: "Enumerated Variants",
      description:
        "Replacing boolean prop explosion with string union enums for size, variant, color, and other visual dimensions.",
      questionCount: 8,
    },
    {
      slug: "styling-api",
      label: "Styling API",
      description:
        "Choosing between className, style, variants, and design tokens to keep styling concerns out of your prop API.",
      questionCount: 8,
    },
    {
      slug: "controlled-uncontrolled",
      label: "Controlled & Uncontrolled",
      description:
        "The value/defaultValue/onChange contract, dual-mode APIs, and mirroring native HTML form patterns.",
      questionCount: 7,
    },
    {
      slug: "children-pattern",
      label: "Children Pattern",
      description:
        "Composition, compound components, named slots, and the slots/slotProps convention.",
      questionCount: 9,
    },
    {
      slug: "render-props",
      label: "Render Props",
      description:
        "When to use render functions vs ReactNode slots, and how to name headless component APIs.",
      questionCount: 5,
    },
    {
      slug: "extending-html",
      label: "Extending HTML",
      description:
        "Forwarding native HTML attributes with ComponentProps, Omit, and polymorphic as props.",
      questionCount: 7,
    },
    {
      slug: "ref-forwarding",
      label: "Ref Forwarding",
      description:
        "Forwarding refs to the right element, typing them correctly, and keeping imperative handles minimal.",
      questionCount: 5,
    },
    {
      slug: "generic-props",
      label: "Generic Props",
      description:
        "Using TypeScript generics to create type-safe, reusable component APIs that infer from props.",
      questionCount: 6,
    },
    {
      slug: "accessibility-props",
      label: "Accessibility Props",
      description:
        "Making aria-label required, typing ARIA roles as unions, and wiring up labelledby/describedby.",
      questionCount: 5,
    },
    {
      slug: "discriminated-unions",
      label: "Discriminated Unions",
      description:
        "Modeling variant-dependent props with TypeScript so impossible states are unrepresentable.",
      questionCount: 6,
    },
    {
      slug: "server-component-props",
      label: "Server Component Props",
      description:
        "Serializable props across the server/client boundary, Server Actions, and the donut pattern.",
      questionCount: 7,
    },
  ],
  sections: [
    {
      label: "Naming & Docs",
      categories: [
        "component-naming",
        "boolean-naming",
        "callback-naming",
        "jsdoc",
      ],
    },
    {
      label: "Prop Design",
      categories: [
        "default-values",
        "prop-specificity",
        "prop-organization",
        "enumerated-variants",
        "styling-api",
        "controlled-uncontrolled",
      ],
    },
    { label: "Composition", categories: ["children-pattern", "render-props"] },
    {
      label: "Advanced Patterns",
      categories: [
        "extending-html",
        "ref-forwarding",
        "generic-props",
        "accessibility-props",
        "discriminated-unions",
      ],
    },
    { label: "React 19 & Server", categories: ["server-component-props"] },
  ],
  learningPath: [],
} as const satisfies AppCatalogEntry;

// ---------------------------------------------------------------------------
// Can't Resize
// ---------------------------------------------------------------------------

const cantResize = {
  appName: "Can't Resize",
  categories: [
    {
      slug: "media-queries",
      label: "Media Queries",
      description:
        "Mobile-first breakpoints, logical ranges with min-width, and why max-width leads to override chains. You'll hit this when layouts break between standard device widths or when you inherit a desktop-first codebase.",
      questionCount: 6,
    },
    {
      slug: "container-queries",
      label: "Container Queries",
      description:
        "@container vs @media: when components should own their own responsiveness instead of relying on the viewport. You'll hit this when a reusable component looks wrong after being placed in a narrower sidebar or modal.",
      questionCount: 5,
    },
    {
      slug: "fluid-typography",
      label: "Fluid Typography",
      description:
        "Using clamp() and fluid type scales so text adapts smoothly without hard breakpoints. You'll hit this when headings look too big on mobile or too small on ultrawide monitors.",
      questionCount: 5,
    },
    {
      slug: "viewport-units",
      label: "Viewport Units",
      description:
        "vw, vh, dvh, svh, and lvh. Understanding the mobile viewport trap and picking the right unit. You'll hit this when a full-screen hero section hides behind the mobile browser toolbar.",
      questionCount: 5,
    },
    {
      slug: "flexbox-patterns",
      label: "Flexbox Patterns",
      description:
        "flex-wrap, gap, shrink, and grow for layouts that reflow naturally across screen sizes. You'll hit this when items squish into a single row on small screens instead of wrapping naturally.",
      questionCount: 5,
    },
    {
      slug: "grid-patterns",
      label: "Grid Patterns",
      description:
        "auto-fit, auto-fill, and minmax() for responsive grids that need zero media queries. You'll hit this when a card grid should go from one column to three without writing any breakpoint.",
      questionCount: 5,
    },
    {
      slug: "responsive-spacing",
      label: "Responsive Spacing",
      description:
        "Consistent spacing systems that scale with the viewport using clamp(), custom properties, and theme tokens. You'll hit this when padding and margins feel too tight on mobile or too loose on desktop.",
      questionCount: 5,
    },
    {
      slug: "overflow-handling",
      label: "Overflow Handling",
      description:
        "Scroll containers, text truncation, responsive tables, and preventing horizontal overflow on mobile. You'll hit this when a table or long URL causes horizontal scrolling on mobile.",
      questionCount: 5,
    },
    {
      slug: "breakpoint-hooks",
      label: "Breakpoint Hooks",
      description:
        "useMediaQuery, custom breakpoint hooks, SSR hydration pitfalls, and when to avoid them entirely. You'll hit this when a component flickers after server-side rendering because useMediaQuery runs too late.",
      questionCount: 5,
    },
    {
      slug: "responsive-props",
      label: "Responsive Props",
      description:
        "Components that accept breakpoint-aware prop objects like direction={{ xs: 'column', md: 'row' }}. You'll hit this when you want a Stack to be vertical on mobile and horizontal on desktop in one prop.",
      questionCount: 5,
    },
    {
      slug: "conditional-rendering",
      label: "Conditional Rendering",
      description:
        "Rendering different components by viewport vs hiding with CSS, including performance and SEO tradeoffs. You'll hit this when you conditionally render with JavaScript but the hidden component still makes a network request.",
      questionCount: 5,
    },
    {
      slug: "responsive-images",
      label: "Responsive Images",
      description:
        "srcSet, sizes, next/image, art direction with <picture>, and avoiding layout shift. You'll hit this when a 2 MB hero image loads on a phone with a slow connection.",
      questionCount: 5,
    },
    {
      slug: "mui-responsive",
      label: "MUI Responsive",
      description:
        "MUI's sx breakpoint syntax, responsive Grid2, theme.breakpoints, and responsive dialog patterns. You'll hit this when you need an MUI dialog to be fullscreen on mobile but a centered modal on desktop.",
      questionCount: 6,
    },
    {
      slug: "tailwind-responsive",
      label: "Tailwind Responsive",
      description:
        "Utility-first responsive design with sm:/md:/lg: prefixes, container queries plugin, and custom screens. You'll hit this when Tailwind's sm: prefix doesn't behave the way you expected at 640px.",
      questionCount: 5,
    },
    {
      slug: "common-mistakes",
      label: "Common Mistakes",
      description:
        "Fixed widths, pixel assumptions, forgotten touch targets, ignoring landscape, and other responsive pitfalls. You'll hit this when a button is too small to tap on a phone or a layout collapses in landscape mode.",
      questionCount: 5,
    },
    {
      slug: "testing-responsive",
      label: "Testing Responsive",
      description:
        "Strategies for testing responsiveness: viewport meta, device mode, visual regression, and automated checks. You'll hit this when a layout looks fine in Chrome DevTools but breaks on a real device.",
      questionCount: 5,
    },
  ],
  sections: [
    {
      label: "Foundations",
      categories: [
        "media-queries",
        "container-queries",
        "fluid-typography",
        "viewport-units",
      ],
    },
    {
      label: "Layout Patterns",
      categories: [
        "flexbox-patterns",
        "grid-patterns",
        "responsive-spacing",
        "overflow-handling",
      ],
    },
    {
      label: "Component Patterns",
      categories: [
        "breakpoint-hooks",
        "responsive-props",
        "conditional-rendering",
        "responsive-images",
      ],
    },
    {
      label: "Framework Patterns",
      categories: ["mui-responsive", "tailwind-responsive"],
    },
    {
      label: "Anti-Patterns & Debugging",
      categories: ["common-mistakes", "testing-responsive"],
    },
  ],
  learningPath: [
    "media-queries",
    "flexbox-patterns",
    "grid-patterns",
    "responsive-props",
    "common-mistakes",
  ],
} as const satisfies AppCatalogEntry;

// ---------------------------------------------------------------------------
// Can't Type
// ---------------------------------------------------------------------------

const cantType = {
  appName: "Can't Type",
  categories: [
    {
      slug: "type-narrowing",
      label: "Type Narrowing",
      description:
        "Discriminated unions, type guards, typeof, and instanceof for safely accessing properties. You'll hit this when TypeScript complains about a property that might not exist on a union type.",
      questionCount: 6,
    },
    {
      slug: "generics",
      label: "Generics",
      description:
        "Type parameters, constraints, inference, and when to let TypeScript figure it out. You'll hit this when you write a function that should work with multiple types but you keep reaching for `any`.",
      questionCount: 8,
    },
    {
      slug: "utility-types",
      label: "Utility Types",
      description:
        "Partial, Required, Pick, Omit, Record, and Extract for transforming types without rewriting them. You'll hit this when you need a version of an existing type with some fields optional or removed.",
      questionCount: 14,
    },
    {
      slug: "union-intersection",
      label: "Union & Intersection",
      description:
        "Union types for alternatives, intersection types for combining, and the `never` type for exhaustive checks. You'll hit this when a value can be one of several shapes and you need to handle all of them.",
      questionCount: 9,
    },
    {
      slug: "type-assertions",
      label: "Type Assertions",
      description:
        "as const, satisfies, type predicates, and why `as` should be your last resort. You'll hit this when you know more than the compiler but want to prove it safely instead of just overriding.",
      questionCount: 7,
    },
    {
      slug: "enums-literals",
      label: "Enums & Literals",
      description:
        "String literal unions vs enums, const assertions, and when numeric enums cause trouble. You'll hit this when you need a fixed set of values and can't decide between `type Status = 'active' | 'inactive'` and `enum Status`.",
      questionCount: 7,
    },
    {
      slug: "strict-mode",
      label: "Strict Mode",
      description:
        "strictNullChecks, noUncheckedIndexedAccess, exactOptionalPropertyTypes, and the flags that catch real bugs. You'll hit this when your code compiles fine but crashes at runtime because a value was unexpectedly undefined.",
      questionCount: 7,
    },
    {
      slug: "readonly-immutability",
      label: "Readonly & Immutability",
      description:
        "readonly properties, Readonly<T>, ReadonlyArray, and as const for preventing accidental mutations. You'll hit this when a function modifies an array or object it was only supposed to read.",
      questionCount: 8,
    },
    {
      slug: "function-types",
      label: "Function Types",
      description:
        "Overloads, generic functions, callback typing, and return type inference. You'll hit this when a function should accept different argument shapes and return different types accordingly.",
      questionCount: 9,
    },
    {
      slug: "interface-vs-type",
      label: "Interface vs Type",
      description:
        "When to use interface, when to use type, declaration merging, and extending vs intersecting. You'll hit this when you're unsure which to pick and whether it actually matters.",
      questionCount: 9,
    },
    {
      slug: "mapped-types",
      label: "Mapped Types",
      description:
        "Key remapping, conditional types, infer keyword, and building types from other types. You'll hit this when you need to transform every property of an existing type in a systematic way.",
      questionCount: 8,
    },
    {
      slug: "template-literals",
      label: "Template Literals",
      description:
        "Template literal types, string manipulation types, and pattern matching on string shapes. You'll hit this when you want the compiler to enforce that a string follows a specific format like `on${string}`.",
      questionCount: 6,
    },
    {
      slug: "react-typescript",
      label: "React + TypeScript",
      description:
        "Component props, event handlers, refs, generic components, and polymorphic patterns. You'll hit this when you try to type a React component that forwards refs or accepts an `as` prop.",
      questionCount: 7,
    },
    {
      slug: "module-types",
      label: "Module Types",
      description:
        "Declaration files, ambient modules, type augmentation, and global types. You'll hit this when you import a JavaScript library that has no types or need to extend an existing module's types.",
      questionCount: 8,
    },
    {
      slug: "error-handling",
      label: "Error Handling",
      description:
        "Unknown vs any in catch blocks, Result types, type-safe error handling, and assertion functions. You'll hit this when your catch block uses `error.message` and TypeScript says `error` is `unknown`.",
      questionCount: 8,
    },
    {
      slug: "common-mistakes",
      label: "Common Mistakes",
      description:
        "Overusing any, unnecessary type assertions, ignoring strict flags, and other TypeScript anti-patterns that compile but break. You'll hit this when TypeScript stops catching bugs it should have caught.",
      questionCount: 12,
    },
  ],
  sections: [
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
  ],
  learningPath: [
    "type-narrowing",
    "generics",
    "union-intersection",
    "interface-vs-type",
    "common-mistakes",
  ],
} as const satisfies AppCatalogEntry;

// ---------------------------------------------------------------------------
// Can't Orchestrate
// ---------------------------------------------------------------------------

const cantOrchestrate = {
  appName: "Can't Orchestrate",
  categories: [
    {
      slug: "dockerfile-basics",
      label: "Dockerfile Basics",
      description:
        "FROM, RUN, COPY, ENTRYPOINT, and CMD instructions for building container images. You'll hit this when your container starts but runs the wrong command or ignores signals.",
      questionCount: 5,
    },
    {
      slug: "image-optimization",
      label: "Image Optimization",
      description:
        "Multi-stage builds, layer caching, .dockerignore, and base image selection. You'll hit this when your image is 2 GB, builds take 10 minutes, or a small code change invalidates every layer.",
      questionCount: 5,
    },
    {
      slug: "docker-compose",
      label: "Docker Compose",
      description:
        "Service definitions, depends_on, profiles, and compose file structure. You'll hit this when your local dev stack has five services and you need them to start in the right order.",
      questionCount: 4,
    },
    {
      slug: "volumes-storage",
      label: "Volumes & Storage",
      description:
        "Named volumes, bind mounts, tmpfs, and volume drivers. You'll hit this when container restarts lose your database data or your local file edits don't appear inside the container.",
      questionCount: 4,
    },
    {
      slug: "networking",
      label: "Networking",
      description:
        "Bridge networks, overlay networks, port mapping, and DNS resolution. You'll hit this when containers can't reach each other or your app is exposed on the wrong port.",
      questionCount: 4,
    },
    {
      slug: "health-checks",
      label: "Health Checks",
      description:
        "HEALTHCHECK in Dockerfiles, readiness and liveness probes in Kubernetes. You'll hit this when your orchestrator routes traffic to a container that hasn't finished starting up.",
      questionCount: 4,
    },
    {
      slug: "security",
      label: "Security",
      description:
        "Running as non-root, read-only filesystems, secrets management, and image scanning. You'll hit this when a security audit flags your containers for running as root with write access everywhere.",
      questionCount: 5,
    },
    {
      slug: "environment-config",
      label: "Environment & Config",
      description:
        "Environment variables, .env files, ConfigMaps, and runtime configuration. You'll hit this when you hardcode a database URL and it breaks in staging because the host is different.",
      questionCount: 4,
    },
    {
      slug: "kubernetes-pods",
      label: "Pods & Deployments",
      description:
        "Pod specs, Deployments, ReplicaSets, and rolling updates. You'll hit this when you need zero-downtime deploys or your pods keep crashing without clear reasons.",
      questionCount: 4,
    },
    {
      slug: "kubernetes-services",
      label: "Services & Ingress",
      description:
        "ClusterIP, NodePort, LoadBalancer, Ingress resources, and service mesh basics. You'll hit this when external traffic can't reach your pods or internal services can't find each other.",
      questionCount: 4,
    },
    {
      slug: "kubernetes-config",
      label: "ConfigMaps & Secrets",
      description:
        "ConfigMaps, Secrets, resource requests and limits, and pod scheduling. You'll hit this when your pod gets OOMKilled, can't read its config, or lands on the wrong node.",
      questionCount: 4,
    },
    {
      slug: "helm-charts",
      label: "Helm Charts",
      description:
        "Chart structure, values.yaml, templates, helpers, and chart dependencies. You'll hit this when you copy-paste Kubernetes manifests across environments instead of parameterizing them.",
      questionCount: 4,
    },
    {
      slug: "docker-swarm",
      label: "Docker Swarm",
      description:
        "Swarm mode, service definitions, stacks, replicas, and rolling updates. You'll hit this when you need simple container orchestration without the complexity of Kubernetes.",
      questionCount: 4,
    },
    {
      slug: "ci-cd-pipelines",
      label: "CI/CD Pipelines",
      description:
        "Building images in CI, layer caching in pipelines, multi-platform builds, and registry tagging. You'll hit this when your CI pipeline rebuilds everything from scratch on every commit.",
      questionCount: 4,
    },
    {
      slug: "build-scripts",
      label: "Build Scripts",
      description:
        "Makefiles, Ant build files, Gradle tasks, and shell scripts for container workflows. You'll hit this when your team needs a single command to build, test, and deploy containers.",
      questionCount: 4,
    },
    {
      slug: "common-mistakes",
      label: "Common Mistakes",
      description:
        "Misusing latest tags, ignoring .dockerignore, running as root, and other orchestration anti-patterns. You'll hit this when a deploy fails in production but works on your machine.",
      questionCount: 5,
    },
  ],
  sections: [
    {
      label: "Foundations",
      categories: [
        "dockerfile-basics",
        "image-optimization",
        "docker-compose",
        "volumes-storage",
      ],
    },
    {
      label: "Container Patterns",
      categories: [
        "networking",
        "health-checks",
        "security",
        "environment-config",
      ],
    },
    {
      label: "Orchestration",
      categories: [
        "kubernetes-pods",
        "kubernetes-services",
        "kubernetes-config",
        "helm-charts",
      ],
    },
    {
      label: "Build & Pipelines",
      categories: [
        "docker-swarm",
        "ci-cd-pipelines",
        "build-scripts",
        "common-mistakes",
      ],
    },
  ],
  learningPath: [
    "dockerfile-basics",
    "docker-compose",
    "kubernetes-pods",
    "security",
    "common-mistakes",
  ],
} as const satisfies AppCatalogEntry;

// ---------------------------------------------------------------------------
// Can't SEO
// ---------------------------------------------------------------------------

const cantSeo = {
  appName: "Can't SEO",
  categories: [
    {
      slug: "meta-tags",
      label: "Meta Tags",
      description:
        "The title tag, meta description, and viewport meta. These are the foundation of every page's search appearance. You will hit this when your page shows 'Untitled' in browser tabs or gets a generic snippet in search results.",
      questionCount: 8,
    },
    {
      slug: "open-graph",
      label: "Open Graph",
      description:
        "og:title, og:image, og:description, and the rest of the Open Graph protocol. These control how your links appear when shared on LinkedIn, Facebook, Slack, Teams, and Discord. You will hit this when a shared link shows a blank card or the wrong image.",
      questionCount: 8,
    },
    {
      slug: "twitter-cards",
      label: "Twitter Cards",
      description:
        "twitter:card, twitter:image, and the difference between summary and summary_large_image. These control how your links look on Twitter/X. You will hit this when your tweet shows a tiny thumbnail instead of a large preview image.",
      questionCount: 8,
    },
    {
      slug: "canonical-urls",
      label: "Canonical URLs",
      description:
        "The canonical link element, trailing slash handling, www vs non-www, and how to tell search engines which URL is the original. You will hit this when Google indexes three versions of the same page and splits your ranking.",
      questionCount: 8,
    },
    {
      slug: "sitemaps-robots",
      label: "Sitemaps & Robots",
      description:
        "The sitemap.ts and robots.ts files in Next.js, how to control crawling, and when to use noindex vs disallow. You will hit this when search engines cannot find your new pages or index pages you wanted to keep private.",
      questionCount: 8,
    },
    {
      slug: "structured-data",
      label: "Structured Data",
      description:
        "JSON-LD, schema.org markup, and how to add rich results like FAQ accordions, breadcrumbs, and article metadata to your Next.js pages. You will hit this when your competitors show star ratings in search results and you do not.",
      questionCount: 8,
    },
    {
      slug: "image-optimization",
      label: "Image Optimization",
      description:
        "The opengraph-image.tsx convention, proper image dimensions for social sharing, next/image for Core Web Vitals, and how image size affects page speed. You will hit this when your OG image gets cropped on LinkedIn or your LCP score tanks.",
      questionCount: 8,
    },
    {
      slug: "internationalization",
      label: "Internationalization",
      description:
        "hreflang tags, alternate links, Next.js i18n routing, and locale-specific metadata. You will hit this when Google shows the wrong language version of your page to users in a different country.",
      questionCount: 8,
    },
  ],
  sections: [
    {
      label: "Foundations",
      categories: ["meta-tags", "open-graph", "twitter-cards"],
    },
    {
      label: "Technical SEO",
      categories: ["canonical-urls", "sitemaps-robots", "structured-data"],
    },
    {
      label: "Performance & i18n",
      categories: ["image-optimization", "internationalization"],
    },
  ],
  learningPath: [
    "meta-tags",
    "open-graph",
    "canonical-urls",
    "structured-data",
    "image-optimization",
  ],
} as const satisfies AppCatalogEntry;

// ---------------------------------------------------------------------------
// Can't UX
// ---------------------------------------------------------------------------

const cantUx = {
  appName: "Can't UX",
  categories: [
    {
      slug: "typography",
      label: "Typography",
      description:
        "Font sizing, line height, line length, and type scales that make text comfortable to read. You'll hit this when body text feels hard to scan or headings blend into the surrounding content.",
      questionCount: 4,
    },
    {
      slug: "spacing",
      label: "Spacing",
      description:
        "Consistent spacing systems, proximity grouping, and whitespace as a design tool. You'll hit this when a layout feels cluttered even though every individual element looks fine on its own.",
      questionCount: 4,
    },
    {
      slug: "color",
      label: "Color",
      description:
        "Contrast ratios, limited palettes, and accessible color choices that work for all users. You'll hit this when text becomes hard to read on colored backgrounds or when a UI feels visually noisy.",
      questionCount: 4,
    },
    {
      slug: "hierarchy",
      label: "Hierarchy",
      description:
        "Visual weight, button priority, and emphasis patterns that guide the user's eye. You'll hit this when a page feels flat and users cannot tell what to do first or which action matters most.",
      questionCount: 4,
    },
    {
      slug: "layout",
      label: "Layout",
      description:
        "Content width constraints, form layouts, card grids, and text alignment for readability. You'll hit this when a page stretches edge to edge on a wide monitor and becomes difficult to scan.",
      questionCount: 4,
    },
    {
      slug: "forms",
      label: "Forms",
      description:
        "Input labels, error messages, touch targets, and field organization that reduce user friction. You'll hit this when users abandon a form because they cannot tell what went wrong or where to tap.",
      questionCount: 4,
    },
    {
      slug: "feedback",
      label: "Feedback",
      description:
        "Loading states, empty states, error screens, and confirmation dialogs that keep users informed. You'll hit this when users stare at a blank screen during data loading or accidentally delete something with no warning.",
      questionCount: 4,
    },
    {
      slug: "navigation",
      label: "Navigation",
      description:
        "Menu structure, labeling, breadcrumbs, and mobile navigation patterns that help users find their way. You'll hit this when users cannot figure out where to go next or lose track of where they are in your site.",
      questionCount: 4,
    },
    {
      slug: "accessibility",
      label: "Accessibility",
      description:
        "Focus indicators, icon labels, status communication, and link distinction patterns that make interfaces usable for everyone. You'll hit this when keyboard users cannot navigate your UI or color-blind users miss critical information.",
      questionCount: 4,
    },
    {
      slug: "micro-interactions",
      label: "Micro-interactions",
      description:
        "Button states, toggle animations, staggered entrances, and progress indicators that make interfaces feel responsive and alive. You'll hit this when users are unsure if their click registered or how long an operation will take.",
      questionCount: 4,
    },
    {
      slug: "content-copy",
      label: "Content & Copy",
      description:
        "Error messages, scannable content, link text, and onboarding copy that communicate clearly. You'll hit this when users are confused by jargon, miss important links, or cannot figure out what went wrong.",
      questionCount: 4,
    },
    {
      slug: "data-display",
      label: "Data Display",
      description:
        "Number alignment, text overflow, data density, and empty states in tables and data views. You'll hit this when users struggle to compare values, cannot see truncated content, or stare at a blank table with no guidance.",
      questionCount: 4,
    },
    {
      slug: "modals-overlays",
      label: "Modals & Overlays",
      description:
        "Confirmation dialogs, dismissibility, form complexity in overlays, and interruption timing. You'll hit this when users feel trapped in a dialog, overwhelmed by popups, or forced to fill out a giant form in a tiny modal.",
      questionCount: 4,
    },
    {
      slug: "lists-cards",
      label: "Lists & Cards",
      description:
        "Card height consistency, clickable affordance, information density, and list grouping patterns. You'll hit this when card grids look messy, users do not realize cards are clickable, or a settings page is an endless flat list.",
      questionCount: 4,
    },
    {
      slug: "icons-imagery",
      label: "Icons & Imagery",
      description:
        "Icon consistency, meaningful imagery, icon ambiguity, and image quality patterns. You'll hit this when icons look mismatched, hero images say nothing about the product, or stretched images undermine your credibility.",
      questionCount: 4,
    },
  ],
  sections: [
    {
      label: "Visual Design",
      categories: [
        "typography",
        "spacing",
        "color",
        "hierarchy",
        "icons-imagery",
      ],
    },
    {
      label: "Interaction Design",
      categories: [
        "layout",
        "forms",
        "feedback",
        "navigation",
        "accessibility",
        "micro-interactions",
        "modals-overlays",
      ],
    },
    {
      label: "Content",
      categories: ["content-copy", "data-display", "lists-cards"],
    },
  ],
  learningPath: ["hierarchy", "spacing", "typography", "forms", "color"],
} as const satisfies AppCatalogEntry;

// ---------------------------------------------------------------------------
// Can't Explode
// ---------------------------------------------------------------------------

const cantExplode = {
  appName: "Can't Explode",
  categories: [
    {
      slug: "molecular-stability",
      label: "Molecular Stability",
      description:
        "Aromaticity, resonance stabilization, ring strain, and carbocation stability. These determine which molecules persist and which decompose. You will encounter this when predicting whether a compound will survive reaction conditions or fall apart.",
      questionCount: 3,
    },
    {
      slug: "acid-strength",
      label: "Acid Strength",
      description:
        "pKa values, conjugate base stability, and the factors that make a proton easy or hard to remove. Electronegativity, resonance, induction, and atom size all play a role. Essential for understanding buffer systems and organic reaction mechanisms.",
      questionCount: 4,
    },
    {
      slug: "bond-energy",
      label: "Bond Energy",
      description:
        "Single, double, and triple bond energies and what makes one bond stronger than another. Bond length, orbital overlap, and electronegativity differences matter. This determines reaction enthalpies and which bonds break first.",
      questionCount: 4,
    },
    {
      slug: "electronegativity",
      label: "Electronegativity",
      description:
        "The tendency of an atom to attract shared electrons. Trends across the periodic table, Pauling scale values, and how electronegativity differences create polar bonds and influence molecular properties.",
      questionCount: 4,
    },
    {
      slug: "periodic-trends",
      label: "Periodic Table Trends",
      description:
        "How atomic properties change across periods and down groups. Electronegativity, atomic radius, ionization energy, and electron affinity follow predictable patterns that explain chemical reactivity.",
      questionCount: 4,
    },
    {
      slug: "electron-configuration",
      label: "Electron Configuration",
      description:
        "How electrons fill orbitals according to the Aufbau principle, Hund's rule, and the Pauli exclusion principle. Includes common exceptions like chromium and copper where half-filled or filled d-subshells are favored.",
      questionCount: 4,
    },
    {
      slug: "reaction-favorability",
      label: "Reaction Favorability",
      description:
        "Thermodynamic and kinetic factors that determine whether a reaction proceeds. Gibbs free energy, enthalpy, entropy, activation energy, and Le Chatelier's principle. Predicting which direction a reaction will go under given conditions.",
      questionCount: 2,
    },
    {
      slug: "solubility",
      label: "Solubility",
      description:
        "Like dissolves like, solubility rules for ionic compounds, and the role of intermolecular forces. Hydrogen bonding, polarity, and lattice energy determine whether a substance dissolves in water or organic solvents.",
      questionCount: 4,
    },
    {
      slug: "oxidation-reduction",
      label: "Oxidation & Reduction",
      description:
        "Electron transfer reactions, standard reduction potentials, and the activity series. Identifying oxidizing and reducing agents, balancing redox equations, and predicting spontaneous reactions in electrochemistry.",
      questionCount: 3,
    },
    {
      slug: "functional-groups",
      label: "Functional Groups",
      description:
        "Reactivity patterns of alcohols, aldehydes, ketones, carboxylic acids, amines, and esters. How functional group identity determines chemical behavior, acidity, basicity, and reaction pathways in organic chemistry.",
      questionCount: 3,
    },
    {
      slug: "energy-diagrams",
      label: "Energy Diagrams",
      description:
        "Reaction coordinate diagrams showing activation energy, transition states, and intermediates. Covers exothermic vs endothermic profiles, the effect of catalysts, and how energy barriers determine reaction rates.",
      questionCount: 4,
    },
    {
      slug: "structural-formulas",
      label: "Structural Formulas",
      description:
        "How molecules are drawn and what those drawings communicate. Covers skeletal structures, resonance notation, constitutional isomers, and the difference between open-chain and cyclic forms of the same compound.",
      questionCount: 4,
    },
    {
      slug: "molecular-geometry",
      label: "Molecular Geometry",
      description:
        "Three-dimensional shapes of molecules predicted by VSEPR theory. Covers bond angles, lone pair repulsion, and why water is bent, methane is tetrahedral, and ammonia is pyramidal.",
      questionCount: 4,
    },
    {
      slug: "stereochemistry",
      label: "Stereochemistry",
      description:
        "Spatial arrangement of atoms in molecules and how it affects properties. Covers Newman projections, Fischer projections, chair conformations, and the difference between cis/trans and R/S configurations.",
      questionCount: 4,
    },
    {
      slug: "electrostatic-maps",
      label: "Electrostatic Maps",
      description:
        "Visualization of electron density and charge distribution in molecules. Covers polar vs nonpolar bonds, net dipole moments, and the spectrum from ionic to covalent bonding character.",
      questionCount: 4,
    },
    {
      slug: "protein-structure",
      label: "Protein Structure",
      description:
        "How amino acid chains fold into functional shapes. Covers alpha helices, beta sheets, primary through quaternary structure levels, and the forces that stabilize each level. Understanding protein architecture is essential for biochemistry and drug design.",
      questionCount: 4,
    },
  ],
  sections: [
    {
      label: "Foundations",
      categories: [
        "molecular-stability",
        "acid-strength",
        "bond-energy",
        "electronegativity",
        "periodic-trends",
        "electron-configuration",
      ],
    },
    {
      label: "Reactions & Properties",
      categories: [
        "reaction-favorability",
        "solubility",
        "oxidation-reduction",
        "functional-groups",
        "energy-diagrams",
      ],
    },
    {
      label: "Structure & Bonding",
      categories: [
        "structural-formulas",
        "molecular-geometry",
        "stereochemistry",
        "electrostatic-maps",
      ],
    },
    { label: "Biochemistry", categories: ["protein-structure"] },
  ],
  learningPath: [
    "periodic-trends",
    "electron-configuration",
    "structural-formulas",
    "electronegativity",
    "bond-energy",
  ],
} as const satisfies AppCatalogEntry;

// ---------------------------------------------------------------------------
// Can't Branch
// ---------------------------------------------------------------------------

const cantBranch = {
  appName: "Can't Branch",
  categories: [
    {
      slug: "commit-messages",
      label: "Commit Messages",
      description:
        "Writing clear, conventional commit messages with imperative mood, proper subject/body separation, and meaningful scope.",
      questionCount: 7,
    },
    {
      slug: "atomic-commits",
      label: "Atomic Commits",
      description:
        "Making single-purpose commits that are easy to review, revert, and bisect. Staging hunks instead of entire files.",
      questionCount: 7,
    },
    {
      slug: "branching-naming",
      label: "Branch Naming",
      description:
        "Naming branches with prefixes like feature/, fix/, and chore/. Keeping names short, descriptive, and kebab-cased.",
      questionCount: 7,
    },
    {
      slug: "branching-strategies",
      label: "Branching Strategies",
      description:
        "Choosing between trunk-based development, GitHub flow, and git flow based on team size and release cadence.",
      questionCount: 7,
    },
    {
      slug: "merge-strategies",
      label: "Merge Strategies",
      description:
        "Knowing when to merge, rebase, or squash. Understanding fast-forward, merge commits, and their trade-offs.",
      questionCount: 7,
    },
    {
      slug: "conflict-resolution",
      label: "Conflict Resolution",
      description:
        "Resolving merge conflicts cleanly, using rerere, and structuring code to minimize conflicts in the first place.",
      questionCount: 7,
    },
    {
      slug: "clean-history",
      label: "Clean History",
      description:
        "Using interactive rebase, fixup commits, and autosquash to keep the commit log readable and meaningful.",
      questionCount: 7,
    },
    {
      slug: "undoing-changes",
      label: "Undoing Changes",
      description:
        "Choosing between reset, revert, and restore. Understanding soft, mixed, and hard resets and when each is safe.",
      questionCount: 7,
    },
    {
      slug: "git-bisect",
      label: "Git Bisect",
      description:
        "Using binary search to find the commit that introduced a bug. Automating bisect with test scripts.",
      questionCount: 7,
    },
    {
      slug: "pull-requests",
      label: "Pull Requests",
      description:
        "Keeping PRs small and focused. Writing clear descriptions, using draft PRs, and structuring stacked PRs.",
      questionCount: 8,
    },
    {
      slug: "code-review",
      label: "Code Review",
      description:
        "Reviewing diffs effectively, using CODEOWNERS, setting up branch protection rules, and approval workflows.",
      questionCount: 7,
    },
    {
      slug: "git-hooks",
      label: "Git Hooks",
      description:
        "Automating quality checks with pre-commit, commit-msg, and pre-push hooks using husky and lint-staged.",
      questionCount: 7,
    },
    {
      slug: "gitignore",
      label: "Gitignore",
      description:
        "Tracking what matters, ignoring what doesn't. Handling secrets, build artifacts, OS files, and IDE config.",
      questionCount: 7,
    },
    {
      slug: "large-files",
      label: "Large Files",
      description:
        "Keeping repos fast with Git LFS, avoiding checked-in binaries, and managing repository size over time.",
      questionCount: 7,
    },
    {
      slug: "repo-structure",
      label: "Repo Structure",
      description:
        "Organizing repos with clear README conventions, license files, contributing guides, and consistent directory layouts.",
      questionCount: 7,
    },
    {
      slug: "tagging-releases",
      label: "Tagging & Releases",
      description:
        "Using semantic versioning, annotated tags, and release workflows to mark stable points in your history.",
      questionCount: 7,
    },
    {
      slug: "changelogs",
      label: "Changelogs",
      description:
        "Maintaining changelogs from conventional commits, linking to issues, and following the Keep a Changelog format.",
      questionCount: 7,
    },
    {
      slug: "git-config",
      label: "Git Config",
      description:
        "Setting up useful aliases, configuring diff and merge tools, signing commits, and managing global vs local config.",
      questionCount: 7,
    },
    {
      slug: "worktrees-stashing",
      label: "Worktrees & Stashing",
      description:
        "Using git worktrees for parallel work, stashing changes properly, and knowing when stash vs WIP commits are better.",
      questionCount: 7,
    },
    {
      slug: "ci-integration",
      label: "CI Integration",
      description:
        "Setting up branch protection rules, required status checks, deploy previews, and pipeline triggers for safe delivery.",
      questionCount: 7,
    },
  ],
  sections: [
    {
      label: "Fundamentals",
      categories: ["commit-messages", "atomic-commits", "branching-naming"],
    },
    {
      label: "Branching & Merging",
      categories: [
        "branching-strategies",
        "merge-strategies",
        "conflict-resolution",
      ],
    },
    {
      label: "History & Navigation",
      categories: ["clean-history", "undoing-changes", "git-bisect"],
    },
    {
      label: "Collaboration",
      categories: ["pull-requests", "code-review", "git-hooks"],
    },
    {
      label: "Repository Hygiene",
      categories: ["gitignore", "large-files", "repo-structure"],
    },
    {
      label: "Release Management",
      categories: ["tagging-releases", "changelogs"],
    },
    {
      label: "Advanced",
      categories: ["git-config", "worktrees-stashing", "ci-integration"],
    },
  ],
  learningPath: [],
} as const satisfies AppCatalogEntry;

// ---------------------------------------------------------------------------
// Can't Query
// ---------------------------------------------------------------------------

const cantQuery = {
  appName: "Can't Query",
  categories: [
    {
      slug: "rest-api-design",
      label: "REST API Design",
      description:
        "Resource naming, HTTP methods, status codes, pagination, and versioning. You'll hit this when your endpoints grow inconsistent, clients break on API changes, or you can't decide between PUT and PATCH.",
      questionCount: 13,
    },
    {
      slug: "graphql-patterns",
      label: "GraphQL Patterns",
      description:
        "Query structure, mutations, fragments, N+1 problems, and when GraphQL beats REST. You'll hit this when nested resolvers slow your API to a crawl or clients over-fetch data they never use.",
      questionCount: 8,
    },
    {
      slug: "websockets-realtime",
      label: "WebSockets & Real-time",
      description:
        "When to use WebSockets vs SSE vs polling, connection lifecycle, reconnection, and message design. You'll hit this when you need live updates but long-polling is crushing your server or messages arrive out of order.",
      questionCount: 8,
    },
    {
      slug: "auth-patterns",
      label: "Authentication & Authorization",
      description:
        "API keys vs OAuth vs JWT, token placement, scopes, rate limiting, and permission models. You'll hit this when tokens leak through query strings, JWTs grow too large, or rate limits punish legitimate users.",
      questionCount: 8,
    },
    {
      slug: "error-handling",
      label: "Error Handling",
      description:
        "Error response structure, retry strategies, idempotency, timeouts, and graceful degradation. You'll hit this when clients can't tell a validation error from a server crash, or retries cause duplicate orders.",
      questionCount: 9,
    },
    {
      slug: "api-consumption",
      label: "API Consumption",
      description:
        "Caching strategies, request deduplication, batching, optimistic updates, and loading states. You'll hit this when the same endpoint is called five times on one page load or stale data lingers after a mutation.",
      questionCount: 8,
    },
    {
      slug: "docs-contracts",
      label: "Documentation & Contracts",
      description:
        "OpenAPI vs hand-written docs, schema validation, versioning communication, and SDK generation. You'll hit this when frontend and backend disagree on the shape of a response, or API docs are perpetually outdated.",
      questionCount: 11,
    },
  ],
  sections: [
    {
      label: "Fundamentals",
      categories: [
        "rest-api-design",
        "graphql-patterns",
        "websockets-realtime",
      ],
    },
    {
      label: "Security & Reliability",
      categories: ["auth-patterns", "error-handling"],
    },
    {
      label: "Client Patterns",
      categories: ["api-consumption", "docs-contracts"],
    },
  ],
  learningPath: [
    "rest-api-design",
    "error-handling",
    "auth-patterns",
    "api-consumption",
    "graphql-patterns",
  ],
} as const satisfies AppCatalogEntry;

// ---------------------------------------------------------------------------
// Can't Test
// ---------------------------------------------------------------------------

const cantTest = {
  appName: "Can't Test",
  categories: [
    {
      slug: "unit-testing",
      label: "Unit Testing",
      description:
        "Test structure, assertions, naming, arrange-act-assert, and isolation. You'll hit this when tests are hard to read, break on refactors, or test implementation details instead of behavior.",
      questionCount: 11,
    },
    {
      slug: "integration-testing",
      label: "Integration Testing",
      description:
        "Database tests, API tests, service boundaries, and end-to-end flows. You'll hit this when unit tests pass but the app breaks in production, or when test setup takes longer than the test itself.",
      questionCount: 9,
    },
    {
      slug: "component-testing",
      label: "Component Testing",
      description:
        "React Testing Library, user-event, accessibility queries, and snapshot testing. You'll hit this when tests break on every CSS change, or when you can't tell whether a component actually works for users.",
      questionCount: 8,
    },
    {
      slug: "test-strategy",
      label: "Test Strategy",
      description:
        "Test pyramid, test trophy, coverage goals, and when to skip tests. You'll hit this when you have 1000 tests but still ship bugs, or when test suites take 45 minutes to run.",
      questionCount: 9,
    },
    {
      slug: "mocking-stubbing",
      label: "Mocking & Stubbing",
      description:
        "When to mock, mock vs stub vs spy, over-mocking, and dependency injection. You'll hit this when mocked tests pass but production fails, or when changing one module breaks 50 test files.",
      questionCount: 13,
    },
    {
      slug: "async-testing",
      label: "Async & Timing",
      description:
        "Async assertions, timers, flaky tests, race conditions, and waitFor patterns. You'll hit this when tests pass locally but fail in CI, or when you add sleep calls to make tests green.",
      questionCount: 10,
    },
    {
      slug: "ci-test-infra",
      label: "CI & Test Infrastructure",
      description:
        "Test runners, parallel execution, test environments, reporting, and flake detection. You'll hit this when your CI pipeline takes 30 minutes, tests fight over shared state, or nobody trusts the test suite.",
      questionCount: 11,
    },
  ],
  sections: [
    {
      label: "Fundamentals",
      categories: ["unit-testing", "integration-testing", "component-testing"],
    },
    {
      label: "Strategy & Design",
      categories: ["test-strategy", "mocking-stubbing"],
    },
    { label: "Advanced", categories: ["async-testing", "ci-test-infra"] },
  ],
  learningPath: [
    "unit-testing",
    "test-strategy",
    "mocking-stubbing",
    "component-testing",
    "async-testing",
  ],
} as const satisfies AppCatalogEntry;

// ---------------------------------------------------------------------------
// Can't Game
// ---------------------------------------------------------------------------

const cantGame = {
  appName: "Can't Game",
  categories: [
    {
      slug: "game-loop",
      label: "Game Loop",
      description:
        "Timesteps, update ordering, ECS vs inheritance, and object pooling. You'll hit this when physics breaks at low FPS, entities interact in unpredictable order, or garbage collection causes frame drops.",
      questionCount: 4,
    },
    {
      slug: "state",
      label: "State Management",
      description:
        "Finite state machines, scene transitions, save systems, and entity lifecycle. You'll hit this when adding a new enemy behavior breaks three others, or when your pause menu doesn't actually pause everything.",
      questionCount: 2,
    },
    {
      slug: "input",
      label: "Input Handling",
      description:
        "Input buffering, dead zones, action mapping, and frame-independent input. You'll hit this when jumps feel unresponsive, analog sticks drift, or rebinding keys requires a code change.",
      questionCount: 5,
    },
    {
      slug: "physics",
      label: "Physics & Collision",
      description:
        "Collision detection, spatial partitioning, fixed timesteps, and continuous collision. You'll hit this when bullets pass through walls, collision checks tank your framerate, or physics behaves differently on fast machines.",
      questionCount: 3,
    },
    {
      slug: "ai",
      label: "Game AI",
      description:
        "Behavior trees, finite state machines, pathfinding, and steering behaviors. You'll hit this when enemies get stuck on corners, AI decisions feel robotic, or adding a new behavior means rewriting the entire decision tree.",
      questionCount: 3,
    },
    {
      slug: "rendering",
      label: "Rendering",
      description:
        "Draw call batching, frustum culling, LOD, texture atlasing, and instanced rendering. You'll hit this when your scene drops below 60 FPS despite simple geometry, or when adding one more particle system halves your framerate.",
      questionCount: 2,
    },
    {
      slug: "shaders",
      label: "Shaders",
      description:
        "GPU branching, precision qualifiers, vertex vs fragment computation, and uniform batching. You'll hit this when a shader runs fine on desktop but crawls on mobile, or when a visual effect costs 10x more than it should.",
      questionCount: 2,
    },
    {
      slug: "netcode",
      label: "Netcode",
      description:
        "Client prediction, server authority, state interpolation, lag compensation, and snapshot compression. You'll hit this when players teleport, shots don't register, or the game feels unplayable above 100ms latency.",
      questionCount: 2,
    },
  ],
  sections: [
    { label: "Core Architecture", categories: ["game-loop", "state", "input"] },
    { label: "Simulation", categories: ["physics", "ai"] },
    { label: "Graphics", categories: ["rendering", "shaders"] },
    { label: "Multiplayer", categories: ["netcode"] },
  ],
  learningPath: ["game-loop", "state", "input", "physics", "rendering"],
} as const satisfies AppCatalogEntry;

// ---------------------------------------------------------------------------
// Can't Ticket
// ---------------------------------------------------------------------------

const cantTicket = {
  appName: "Can't Ticket",
  categories: [
    {
      slug: "epic-story-task",
      label: "Epic, Story, Task",
      description:
        "What each level of the Jira hierarchy is for. Why skipping the Story layer turns every Epic into a pile of plumbing nobody can roadmap from.",
      questionCount: 6,
    },
    {
      slug: "story-vs-braindump",
      label: "Story vs Braindump",
      description:
        "The difference between a note to self and a contract between product, design, and engineering. Titles that read as implementation, ACs tangled with technical notes, and the kind of ticket a new joiner has no chance with.",
      questionCount: 7,
    },
    {
      slug: "connextra-template",
      label: "User Story Template",
      description:
        "As a, I want, so that. Ron Jeffries' three Cs. Why the so that clause is the part that survives a refactor of the template, and how to write it in plain prose without losing the discipline.",
      questionCount: 6,
    },
    {
      slug: "bugs-spikes-tasks",
      label: "Bugs, Spikes, Tasks",
      description:
        "When a piece of work is not a story. Bug tickets that make the impact reproducible, spike tickets timeboxed to questions, and the plumbing work that genuinely belongs as a Task.",
      questionCount: 5,
    },
    {
      slug: "invest",
      label: "INVEST",
      description:
        "Independent, Negotiable, Valuable, Estimable, Small, Testable. The compact 2003 sanity check that still catches more bad stories than any longer checklist. Testable is the letter teams fail most.",
      questionCount: 7,
    },
    {
      slug: "acceptance-criteria",
      label: "Acceptance Criteria",
      description:
        "Given, When, Then for outcomes a neutral reader can verify. The line between completeness and over-specification, and how to keep implementation notes out of the AC list.",
      questionCount: 7,
    },
    {
      slug: "definition-of-ready",
      label: "Definition of Ready",
      description:
        "The shared bar a story has to clear before it enters a sprint. Actor and outcome present, dependencies linked not assumed, fits in a sprint, and nobody walks out of refinement still confused.",
      questionCount: 5,
    },
    {
      slug: "definition-of-done",
      label: "Definition of Done",
      description:
        "The shared bar a story has to clear before it leaves a sprint. Verified by someone other than the implementer, tests at the right level, deployed and observable, ticket closed with what actually shipped.",
      questionCount: 5,
    },
    {
      slug: "story-points",
      label: "Story Points",
      description:
        "Size, not time. Why Fibonacci's gaps are a feature, why a 4-and-5 disagreement is noise, and why a 13 is a signal to split or spike rather than an estimate to commit to.",
      questionCount: 7,
    },
    {
      slug: "estimation-rituals",
      label: "Estimation Rituals",
      description:
        "Planning poker, t-shirt sizing, and reference stories. The room outlier is the whole point. The number is a side effect of the conversation, not the goal.",
      questionCount: 5,
    },
    {
      slug: "splitting-vertical",
      label: "Vertical vs Horizontal",
      description:
        "Why splitting a story by technical layer fails INVEST on three letters at once. The vertical slice that ships end-to-end, teaches the team something, and lets product deprioritize the rest.",
      questionCount: 6,
    },
    {
      slug: "splitting-patterns",
      label: "Splitting Patterns",
      description:
        "The Humanizing Work nine patterns and the SPIDR mnemonic that compresses the most useful five. Workflow steps, CRUD, business rules, data shapes, input methods, major effort, simple-then-complex, defer performance, and spike.",
      questionCount: 9,
    },
    {
      slug: "prioritization",
      label: "Prioritization",
      description:
        "MoSCoW, RICE, value vs effort, and Cost of Delay. Who decides, and how to keep prioritization a product conversation rather than an engineering vote.",
      questionCount: 6,
    },
    {
      slug: "team-flow",
      label: "Team Flow",
      description:
        "Velocity vs throughput, WIP limits, focus factor, and capacity. Lead time and cycle time. Why a board with eight in-progress tickets per person is not productive, it is stuck.",
      questionCount: 6,
    },
    {
      slug: "ceremonies",
      label: "Ceremonies",
      description:
        "Standup, refinement, planning, review, retro. What each is for, what it turns into when misused (status reports, design committees, demo theater), and how to keep them short and useful.",
      questionCount: 6,
    },
  ],
  sections: [
    {
      label: "Foundations",
      categories: [
        "epic-story-task",
        "story-vs-braindump",
        "connextra-template",
        "bugs-spikes-tasks",
      ],
    },
    {
      label: "Story Quality",
      categories: [
        "invest",
        "acceptance-criteria",
        "definition-of-ready",
        "definition-of-done",
      ],
    },
    {
      label: "Estimation & Splitting",
      categories: [
        "story-points",
        "estimation-rituals",
        "splitting-vertical",
        "splitting-patterns",
      ],
    },
    {
      label: "Team Practices",
      categories: ["prioritization", "team-flow", "ceremonies"],
    },
  ],
  learningPath: [
    "story-vs-braindump",
    "connextra-template",
    "invest",
    "acceptance-criteria",
    "splitting-patterns",
  ],
} as const satisfies AppCatalogEntry;

// ---------------------------------------------------------------------------
// Combined catalog
// ---------------------------------------------------------------------------

/**
 * All app catalogs keyed by slug (matches the app directory name).
 *
 * Use `APP_CATALOG_LIST` for iteration, `APP_CATALOG` for lookup by slug.
 */
export const APP_CATALOG = {
  "cant-maintain": cantMaintain,
  "cant-resize": cantResize,
  "cant-type": cantType,
  "cant-orchestrate": cantOrchestrate,
  "cant-seo": cantSeo,
  "cant-ux": cantUx,
  "cant-explode": cantExplode,
  "cant-branch": cantBranch,
  "cant-query": cantQuery,
  "cant-test": cantTest,
  "cant-game": cantGame,
  "cant-ticket": cantTicket,
} as const;

/** Union of all app slugs in the catalog. */
export type AppSlug = keyof typeof APP_CATALOG;

/** Ordered list for iteration (matches display order on the hub). */
export const APP_CATALOG_LIST: readonly AppCatalogEntry[] = [
  cantMaintain,
  cantResize,
  cantType,
  cantOrchestrate,
  cantSeo,
  cantUx,
  cantExplode,
  cantBranch,
  cantQuery,
  cantTest,
  cantGame,
  cantTicket,
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Total challenge count for an app. */
export function getAppChallengeCount(slug: AppSlug): number {
  return APP_CATALOG[slug].categories.reduce(
    (sum, c) => sum + c.questionCount,
    0,
  );
}

/** Number of categories for an app. */
export function getAppCategoryCount(slug: AppSlug): number {
  return APP_CATALOG[slug].categories.length;
}

/** Map from CantApp.name to catalog slug. */
export function appNameToSlug(name: string): AppSlug | undefined {
  for (const [slug, entry] of Object.entries(APP_CATALOG)) {
    if (entry.appName === name) return slug as AppSlug;
  }
  return undefined;
}
