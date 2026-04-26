import type { BaseChallenge } from "../../game/types";

export const metaTagsChallenges: BaseChallenge[] = [
  {
    id: "mt-001",
    category: "meta-tags",
    difficulty: "easy",
    title: "Page title via metadata API",
    prompt: "Which way of setting the page title is correct?",
    content: {
      type: "code",

      left: `// app/about/page.tsx
export default function AboutPage() {
  return (
    <>
      <head>
        <title>About Us | Acme Corp</title>
      </head>
      <main>
        <h1>About Us</h1>
        <p>We build great products.</p>
      </main>
    </>
  );
}`,

      right: `// app/about/page.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us",
};

export default function AboutPage() {
  return (
    <main>
      <h1>About Us</h1>
      <p>We build great products.</p>
    </main>
  );
}`,
    },

    correctSide: "right",
    explanationCorrect:
      "Next.js provides a built-in Metadata API that handles the title tag, deduplication, and template merging automatically. Exporting a `metadata` object from a page or layout is the recommended approach. It also enables the title template feature from the root layout.",
    explanationWrong:
      "Manually inserting a `<head>` element inside a page component bypasses the Next.js metadata system. It can cause duplicate tags, prevents title template merging, and does not work correctly with streaming or static generation.",
    sourceUrl:
      "https://nextjs.org/docs/app/building-your-application/optimizing/metadata",
    sourceLabel: "Next.js: Metadata API",
  },
  {
    id: "mt-002",
    category: "meta-tags",
    difficulty: "easy",
    title: "Meta description length",
    prompt: "Which meta description is more effective?",
    content: {
      type: "code",

      left: `// app/products/page.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Products",
  description: "Products.",
};`,

      right: `// app/products/page.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Products",
  description:
    "Browse our catalog of hand-crafted widgets "
    + "and gadgets. Free shipping on orders over "
    + "$50. Rated 4.8 stars by 2,000+ customers.",
};`,
    },

    correctSide: "right",
    explanationCorrect:
      "A meta description between 120 and 160 characters gives search engines enough text to display a meaningful snippet. It should summarize the page content and include a compelling reason to click. Too short and you waste valuable SERP real estate.",
    explanationWrong:
      "A one-word meta description provides no useful information to search engines or users. Google will likely ignore it and auto-generate a snippet from the page body, which may not represent the page well.",
    sourceUrl: "https://developers.google.com/search/docs/appearance/snippet",
    sourceLabel: "Google: Control your snippets",
  },
  {
    id: "mt-003",
    category: "meta-tags",
    difficulty: "easy",
    title: "Viewport meta tag",
    prompt: "Which viewport configuration is correct?",
    content: {
      type: "code",

      left: `// app/layout.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My App",
  other: {
    viewport:
      "width=1024",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}`,

      right: `// app/layout.tsx
import type { Metadata, Viewport } from "next";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: "My App",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}`,
    },

    correctSide: "right",
    explanationCorrect:
      "Next.js provides a dedicated `viewport` export that is separate from `metadata`. Setting `width: 'device-width'` ensures the page scales to the actual screen size. The separate export allows Next.js to handle viewport-related tags independently from other metadata.",
    explanationWrong:
      "Setting the viewport width to a fixed value like 1024 forces mobile browsers to render the page as if the screen were 1024px wide, then zoom out to fit. This makes text unreadable and disables responsive design entirely.",
    sourceUrl:
      "https://nextjs.org/docs/app/api-reference/functions/generate-viewport",
    sourceLabel: "Next.js: generateViewport",
  },
  {
    id: "mt-004",
    category: "meta-tags",
    difficulty: "medium",
    title: "Dynamic metadata with generateMetadata",
    prompt: "Which metadata approach fits dynamic routes?",
    content: {
      type: "code",

      left: `// app/blog/[slug]/page.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog Post",
  description: "Read our latest blog post.",
};

export default async function BlogPost({
  params,
}: {
  params: { slug: string };
}) {
  const post = await getPost(params.slug);
  return <article>{post.content}</article>;
}`,

      right: `// app/blog/[slug]/page.tsx
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const post = await getPost(params.slug);
  return {
    title: post.title,
    description: post.excerpt,
  };
}

export default async function BlogPost({
  params,
}: {
  params: { slug: string };
}) {
  const post = await getPost(params.slug);
  return <article>{post.content}</article>;
}`,
    },

    correctSide: "right",
    explanationCorrect:
      "For dynamic routes, `generateMetadata` fetches data and returns metadata specific to each page. Next.js automatically deduplicates the `fetch` call so it is not made twice. Each blog post gets its own unique title and description in search results.",
    explanationWrong:
      "Using a static `metadata` export on a dynamic route means every blog post shows the same generic title and description. Search engines cannot distinguish between pages, and users see 'Blog Post' for every result instead of the actual post title.",
    sourceUrl:
      "https://nextjs.org/docs/app/api-reference/functions/generate-metadata",
    sourceLabel: "Next.js: generateMetadata",
  },
  {
    id: "mt-005",
    category: "meta-tags",
    difficulty: "medium",
    title: "Title template in root layout",
    prompt: "Which title pattern scales better across pages?",
    content: {
      type: "code",

      left: `// app/layout.tsx
export const metadata: Metadata = {
  title: "Acme Corp",
};

// app/about/page.tsx
export const metadata: Metadata = {
  title: "About Us | Acme Corp",
};

// app/pricing/page.tsx
export const metadata: Metadata = {
  title: "Pricing | Acme Corp",
};`,

      right: `// app/layout.tsx
export const metadata: Metadata = {
  title: {
    default: "Acme Corp",
    template: "%s | Acme Corp",
  },
};

// app/about/page.tsx
export const metadata: Metadata = {
  title: "About Us",
};

// app/pricing/page.tsx
export const metadata: Metadata = {
  title: "Pricing",
};`,
    },

    correctSide: "right",
    explanationCorrect:
      "The `title.template` pattern in the root layout defines a consistent suffix for all child pages. Each page only needs to set its own unique portion. If you rebrand from 'Acme Corp' to 'Acme Inc', you change one line instead of every page.",
    explanationWrong:
      "Repeating the brand name in every page's title is error-prone. If the format changes (say, from '|' to a dash), you must update every file. It is also easy to introduce inconsistencies like 'About Us | Acme Corp' vs 'About - Acme Corp'.",
    sourceUrl:
      "https://nextjs.org/docs/app/api-reference/functions/generate-metadata#title",
    sourceLabel: "Next.js: Metadata title",
  },
  {
    id: "mt-006",
    category: "meta-tags",
    difficulty: "medium",
    title: "Metadata merging across layouts",
    prompt: "Which layout preserves OG fields correctly?",
    content: {
      type: "code",

      left: `// app/layout.tsx
export const metadata: Metadata = {
  title: { default: "Acme", template: "%s | Acme" },
  openGraph: {
    siteName: "Acme",
    type: "website",
    images: ["/og-default.png"],
  },
};

// app/blog/layout.tsx
export const metadata: Metadata = {
  openGraph: {
    type: "article",
  },
  // Forgot siteName and images, they are gone
};`,

      right: `// app/layout.tsx
export const metadata: Metadata = {
  title: { default: "Acme", template: "%s | Acme" },
  openGraph: {
    siteName: "Acme",
    type: "website",
    images: ["/og-default.png"],
  },
};

// app/blog/layout.tsx
export const metadata: Metadata = {
  openGraph: {
    ...null, // shallow merge hint
    type: "article",
    siteName: "Acme",
    images: ["/og-default.png"],
  },
};`,
    },

    correctSide: "right",
    explanationCorrect:
      "Next.js metadata merging is shallow: when a child layout defines `openGraph`, it replaces the entire parent `openGraph` object. You must re-include fields like `siteName` and `images` that you still want. Understanding this prevents accidental data loss.",
    explanationWrong:
      "Because metadata merging is shallow, the child layout's `openGraph` completely replaces the parent's. This means `siteName` and `images` disappear, and shared links lose their preview image even though the root layout defined one.",
    sourceUrl:
      "https://nextjs.org/docs/app/building-your-application/optimizing/metadata#ordering",
    sourceLabel: "Next.js: Metadata merging behavior",
  },
  {
    id: "mt-007",
    category: "meta-tags",
    difficulty: "medium",
    title: "Robots meta per page",
    prompt: "Which approach blocks indexing more reliably?",
    content: {
      type: "code",

      left: `// app/internal/dashboard/page.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Dashboard",
};

// Relying on robots.txt to block this page
export default function Dashboard() {
  return <main>Secret dashboard</main>;
}`,

      right: `// app/internal/dashboard/page.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Dashboard",
  robots: {
    index: false,
    follow: false,
  },
};

export default function Dashboard() {
  return <main>Secret dashboard</main>;
}`,
    },

    correctSide: "right",
    explanationCorrect:
      "Setting `robots: { index: false, follow: false }` in the page metadata adds a `<meta name='robots' content='noindex, nofollow'>` tag. This is more reliable than relying solely on robots.txt because some crawlers ignore robots.txt, and the meta tag is a stronger signal to remove a page from search results.",
    explanationWrong:
      "Relying only on robots.txt to keep a page out of search results is risky. robots.txt can prevent crawling, but if another page links to your dashboard, Google may still index the URL (showing it without a snippet). A `noindex` meta tag is the definitive way to exclude a page.",
    sourceUrl:
      "https://developers.google.com/search/docs/crawling-indexing/block-indexing",
    sourceLabel: "Google: Block indexing with noindex",
  },
  {
    id: "mt-008",
    category: "meta-tags",
    difficulty: "hard",
    title: "Charset and language attributes",
    prompt: "Which root layout setup is more complete?",
    content: {
      type: "code",

      left: `// app/layout.tsx
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <head>
        <meta charSet="utf-8" />
      </head>
      <body>{children}</body>
    </html>
  );
}`,

      right: `// app/layout.tsx
export const metadata: Metadata = {
  metadataBase: new URL("https://acme.com"),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}`,
    },

    correctSide: "right",
    explanationCorrect:
      "Next.js automatically adds `<meta charset='utf-8'>` and the viewport tag, so you do not need to add them manually. What you do need is the `lang` attribute on `<html>` for accessibility and SEO, and a `metadataBase` for resolving relative URLs in metadata like OG images.",
    explanationWrong:
      "Manually adding `<meta charSet>` in a `<head>` tag is redundant because Next.js handles it automatically. More importantly, the missing `lang` attribute on `<html>` hurts accessibility (screen readers cannot determine the language) and can confuse search engines about the page's language.",
    sourceUrl:
      "https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/lang",
    sourceLabel: "MDN: lang attribute",
  },
];
