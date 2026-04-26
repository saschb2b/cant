import type { BaseChallenge } from "../../game/types";

export const tailwindResponsiveChallenges: BaseChallenge[] = [
  {
    id: "tw-001",
    category: "tailwind-responsive",
    difficulty: "easy",
    title: "Mobile-first utility classes",
    prompt: "Which applies Tailwind prefixes correctly?",
    content: {
      type: "code",

      left: `<div className="flex-row md:flex-row sm:flex-col">
  <Card />
  <Card />
</div>`,

      right: `<div className="flex flex-col sm:flex-row">
  <Card />
  <Card />
</div>`,
    },

    correctSide: "right",
    explanationCorrect:
      "Tailwind is mobile-first: unprefixed utilities apply to all screens, `sm:` applies at 640px+. Start with the mobile layout (`flex-col`), then override for larger screens (`sm:flex-row`). The base class is the smallest screen.",
    explanationWrong:
      "Two problems: `flex-row` and `flex-col` only set `flex-direction` and they don't add `display: flex`. Without the `flex` class, the container isn't a flex container at *any* screen size. Second, the responsive prefixes are backwards. Start with the mobile layout unprefixed, then override for larger screens.",
    sourceUrl: "https://tailwindcss.com/docs/responsive-design",
    sourceLabel: "Tailwind: Responsive design",
  },
  {
    id: "tw-002",
    category: "tailwind-responsive",
    difficulty: "easy",
    title: "Responsive hiding",
    prompt: "Which hides an element without JavaScript?",
    content: {
      type: "code",

      left: `function Sidebar() {
  const [show, setShow] = useState(
    window.innerWidth >= 768,
  );
  // ...resize listener...

  if (!show) return null;
  return <nav>...</nav>;
}`,

      right: `<nav className="hidden md:block">
  {/* Sidebar content */}
</nav>`,
    },

    correctSide: "right",
    explanationCorrect:
      "`hidden md:block` compiles to `display: none` by default and `display: block` at 768px+. Pure CSS, no JavaScript, no hydration issues, no resize listeners. Tailwind's responsive prefixes are the standard way to show/hide elements.",
    explanationWrong:
      "`window.innerWidth` breaks SSR. A resize listener adds complexity for something CSS handles natively. The component unmounts on mobile, losing its state. Tailwind's `hidden md:block` is simpler and more robust.",
    sourceUrl: "https://tailwindcss.com/docs/display#responsive",
    sourceLabel: "Tailwind: Responsive display",
  },
  {
    id: "tw-003",
    category: "tailwind-responsive",
    difficulty: "medium",
    title: "Responsive grid columns",
    prompt: "Which grid is usable on all screen sizes?",
    content: {
      type: "code",

      left: `<div className="grid grid-cols-4 gap-4">
  {items.map((item) => (
    <ItemCard key={item.id} item={item} />
  ))}
</div>`,

      right: `<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
  {items.map((item) => (
    <ItemCard key={item.id} item={item} />
  ))}
</div>`,
    },

    correctSide: "right",
    explanationCorrect:
      "Progressive column counts: 1 on mobile, 2 on tablet, 3 on small desktop, 4 on wide screens. Each breakpoint adds a column when there's enough space. Items are always readable and properly sized for the screen.",
    explanationWrong:
      "4 columns on a 320px phone means each card is ~72px wide (320px - gaps / 4). That's completely unusable. Always start with `grid-cols-1` and add columns as the viewport grows.",
    sourceUrl: "https://tailwindcss.com/docs/grid-template-columns#responsive",
    sourceLabel: "Tailwind: Responsive grid columns",
  },
  {
    id: "tw-004",
    category: "tailwind-responsive",
    difficulty: "medium",
    title: "Container queries in Tailwind",
    prompt: "Which responds to the parent's width?",
    content: {
      type: "code",

      left: `// Card responds to viewport, not parent
<div className="w-full md:w-1/3">
  <div className="flex flex-col md:flex-row gap-4">
    <img className="w-full md:w-1/3" />
    <div>...</div>
  </div>
</div>`,

      right: `// Card responds to its container width
<div className="@container w-full md:w-1/3">
  <div className="flex flex-col @sm:flex-row gap-4">
    <img className="w-full @sm:w-1/3" />
    <div>...</div>
  </div>
</div>`,
    },

    correctSide: "right",
    explanationCorrect:
      "Tailwind's `@container` and `@sm:` prefixes generate CSS container queries. The card adapts to its parent's width, not the viewport. If this card is in a sidebar, it stays in column layout even on a wide desktop.",
    explanationWrong:
      "`md:flex-row` triggers at 768px viewport width regardless of where the card is placed. In a 300px sidebar on a 1440px screen, the card still switches to row layout because the *viewport* is wide. Container queries fix this.",
    sourceUrl:
      "https://tailwindcss.com/docs/responsive-design#container-queries",
    sourceLabel: "Tailwind: Container queries",
  },
  {
    id: "tw-005",
    category: "tailwind-responsive",
    difficulty: "medium",
    title: "Responsive typography with Tailwind",
    prompt: "Which heading size adapts across breakpoints?",
    content: {
      type: "code",

      left: `<h1 className="text-4xl">
  Welcome
</h1>

{/* 4xl is too large on mobile */}`,

      right: `<h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl">
  Welcome
</h1>`,
    },

    correctSide: "right",
    explanationCorrect:
      "Progressive font sizing from `text-2xl` (1.5rem) on mobile up to `text-5xl` (3rem) on large screens. Each breakpoint increases the size when there's room for it. This is the standard Tailwind pattern for responsive headings.",
    explanationWrong:
      "`text-4xl` (2.25rem / 36px) as a heading is fine on desktop but overwhelmingly large on a 320px phone where it might take 3 lines. Always start with a mobile-appropriate size and scale up.",
    sourceUrl: "https://tailwindcss.com/docs/font-size#responsive",
    sourceLabel: "Tailwind: Responsive font size",
  },
];
