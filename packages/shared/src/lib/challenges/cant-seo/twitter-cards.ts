import type { BaseChallenge } from "../../game/types";

export const twitterCardsChallenges: BaseChallenge[] = [
  {
    id: "tc-001",
    category: "twitter-cards",
    difficulty: "easy",
    title: "Summary vs summary_large_image",
    prompt: "Which card type shows images best?",
    content: {
      type: "code",

      left: `// app/blog/[slug]/page.tsx
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const post = await getPost(params.slug);
  return {
    twitter: {
      card: "summary",
      title: post.title,
      description: post.excerpt,
      images: [post.coverImage],
    },
  };
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
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      images: [post.coverImage],
    },
  };
}`,
    },

    correctSide: "right",
    explanationCorrect:
      "Blog posts with cover images should use `summary_large_image` to display the image prominently. The large image card takes up more space in the timeline, which increases visibility and click-through rates. The `summary` card shows only a small square thumbnail.",
    explanationWrong:
      "The `summary` card type shrinks the cover image to a small 144x144 thumbnail next to the text. For content with a strong visual, this wastes the effort put into creating the cover image. Use `summary` only for pages where the text is more important than the image.",
    sourceUrl:
      "https://developer.x.com/en/docs/twitter-for-websites/cards/overview/summary-card-with-large-image",
    sourceLabel: "X: Summary card with large image",
  },
  {
    id: "tc-002",
    category: "twitter-cards",
    difficulty: "easy",
    title: "Twitter image aspect ratio",
    prompt: "Which image dimensions fit Twitter cards?",
    content: {
      type: "code",

      left: `// app/layout.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  twitter: {
    card: "summary_large_image",
    images: [{
      url: "/twitter-card.png",
      width: 800,
      height: 800,
    }],
  },
};`,

      right: `// app/layout.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  twitter: {
    card: "summary_large_image",
    images: [{
      url: "/twitter-card.png",
      width: 1200,
      height: 628,
      alt: "Acme Corp homepage preview",
    }],
  },
};`,
    },

    correctSide: "right",
    explanationCorrect:
      "Twitter's large image card expects a 2:1 aspect ratio (minimum 300x157, recommended 1200x628). Providing the correct dimensions ensures the image is displayed without cropping. The `alt` text is required for accessibility and is read by screen readers.",
    explanationWrong:
      "A square 800x800 image will be heavily cropped by Twitter to fit the 2:1 card format. The top and bottom of the image will be cut off, potentially removing important content like text overlays or logos placed near the edges.",
    sourceUrl:
      "https://developer.x.com/en/docs/twitter-for-websites/cards/overview/summary-card-with-large-image",
    sourceLabel: "X: Large image card specs",
  },
  {
    id: "tc-003",
    category: "twitter-cards",
    difficulty: "medium",
    title: "twitter:site vs twitter:creator",
    prompt: "Which Twitter attribution is correct?",
    content: {
      type: "code",

      left: `// app/blog/[slug]/page.tsx
export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const post = await getPost(params.slug);
  return {
    twitter: {
      card: "summary_large_image",
      site: post.author.twitterHandle,
      title: post.title,
    },
  };
}`,

      right: `// app/blog/[slug]/page.tsx
export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const post = await getPost(params.slug);
  return {
    twitter: {
      card: "summary_large_image",
      site: "@acmecorp",
      creator: post.author.twitterHandle,
      title: post.title,
    },
  };
}`,
    },

    correctSide: "right",
    explanationCorrect:
      "`twitter:site` identifies the website's Twitter account (your company), while `twitter:creator` identifies the content author's personal account. Setting both correctly attributes the content to the right people and enables Twitter analytics for both accounts.",
    explanationWrong:
      "Using the author's handle as `twitter:site` means the company's Twitter account gets no attribution. The `site` field should always be the organization that owns the website. Without `creator`, the individual author misses out on analytics and attribution for their content.",
    sourceUrl:
      "https://developer.x.com/en/docs/twitter-for-websites/cards/overview/markup",
    sourceLabel: "X: Card markup reference",
  },
  {
    id: "tc-004",
    category: "twitter-cards",
    difficulty: "medium",
    title: "Twitter card fallback to Open Graph",
    prompt: "Which config avoids redundant tags?",
    content: {
      type: "code",

      left: `// app/layout.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  openGraph: {
    title: "Acme Corp",
    description: "Building great products.",
    images: ["/og.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Acme Corp",
    description: "Building great products.",
    images: ["/og.png"],
  },
};`,

      right: `// app/layout.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  openGraph: {
    title: "Acme Corp",
    description: "Building great products.",
    images: ["/og.png"],
  },
  twitter: {
    card: "summary_large_image",
    // title, description, and images
    // fall back to openGraph values
  },
};`,
    },

    correctSide: "right",
    explanationCorrect:
      "Twitter automatically falls back to Open Graph tags when dedicated `twitter:` tags are absent. You only need to set `twitter:card` to choose the card type. Duplicating every field is unnecessary and creates a maintenance burden where changes must be made in two places.",
    explanationWrong:
      "Duplicating all Open Graph values in the twitter object is redundant. Twitter will use `og:title`, `og:description`, and `og:image` as fallbacks. Maintaining two identical copies means you might update one and forget the other, causing inconsistencies.",
    sourceUrl:
      "https://developer.x.com/en/docs/twitter-for-websites/cards/guides/getting-started",
    sourceLabel: "X: Getting started with cards",
  },
  {
    id: "tc-005",
    category: "twitter-cards",
    difficulty: "medium",
    title: "Twitter title length",
    prompt: "Which title length fits Twitter's limits?",
    content: {
      type: "code",

      left: `// app/blog/[slug]/page.tsx
export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const post = await getPost(params.slug);
  return {
    twitter: {
      card: "summary_large_image",
      title: \`\${post.title} - Read the full \\
article on Acme Corp's blog for more details\`,
    },
  };
}`,

      right: `// app/blog/[slug]/page.tsx
export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const post = await getPost(params.slug);
  return {
    twitter: {
      card: "summary_large_image",
      title: post.title.slice(0, 70),
      description: post.excerpt.slice(0, 200),
    },
  };
}`,
    },

    correctSide: "right",
    explanationCorrect:
      "Twitter truncates titles longer than about 70 characters and descriptions longer than 200 characters. Keeping the title concise ensures the full text is visible in the card. If the title needs context, put it in the description field instead.",
    explanationWrong:
      "A title that exceeds 70 characters gets cut off mid-sentence in the Twitter card, often ending with an ellipsis in an awkward place. Stuffing extra context into the title field makes it harder to read and reduces the card's visual appeal.",
    sourceUrl:
      "https://developer.x.com/en/docs/twitter-for-websites/cards/overview/summary",
    sourceLabel: "X: Summary card",
  },
  {
    id: "tc-006",
    category: "twitter-cards",
    difficulty: "medium",
    title: "Dedicated twitter metadata in Next.js",
    prompt: "Which setup looks best on every platform?",
    content: {
      type: "code",

      left: `// app/layout.tsx
export const metadata: Metadata = {
  openGraph: {
    title: "Acme Corp - Official Website",
    description:
      "Acme Corp builds enterprise software "
      + "solutions for Fortune 500 companies.",
    images: ["/og-banner.png"],
  },
  twitter: {
    card: "summary_large_image",
  },
  // Twitter inherits OG values, but the
  // OG title is too long for Twitter cards
};`,

      right: `// app/layout.tsx
export const metadata: Metadata = {
  openGraph: {
    title: "Acme Corp - Official Website",
    description:
      "Acme Corp builds enterprise software "
      + "solutions for Fortune 500 companies.",
    images: ["/og-banner.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Acme Corp",
    description: "Enterprise software for the "
      + "Fortune 500.",
    images: ["/twitter-card.png"],
  },
};`,
    },

    correctSide: "right",
    explanationCorrect:
      "When your OG tags are optimized for Facebook and LinkedIn but do not fit Twitter's constraints, set dedicated twitter fields. Twitter cards have shorter character limits and a different image aspect ratio (2:1 vs 1.91:1). Providing platform-specific values ensures the best appearance everywhere.",
    explanationWrong:
      "Letting Twitter fall back to Open Graph values works only when the same content fits both platforms. A long OG title optimized for Facebook gets truncated on Twitter. Different image aspect ratios also mean a single image cannot look perfect on both platforms.",
    sourceUrl:
      "https://nextjs.org/docs/app/api-reference/functions/generate-metadata#twitter",
    sourceLabel: "Next.js: Twitter metadata",
  },
  {
    id: "tc-007",
    category: "twitter-cards",
    difficulty: "easy",
    title: "Image alt text for Twitter cards",
    prompt: "Which image config is more accessible?",
    content: {
      type: "code",

      left: `// app/layout.tsx
export const metadata: Metadata = {
  twitter: {
    card: "summary_large_image",
    images: [
      {
        url: "/twitter-card.png",
        width: 1200,
        height: 628,
      },
    ],
  },
};`,

      right: `// app/layout.tsx
export const metadata: Metadata = {
  twitter: {
    card: "summary_large_image",
    images: [
      {
        url: "/twitter-card.png",
        width: 1200,
        height: 628,
        alt: "Acme Corp logo on a gradient "
          + "background with the tagline "
          + "'Build better products'",
      },
    ],
  },
};`,
    },

    correctSide: "right",
    explanationCorrect:
      "The `alt` attribute on Twitter card images is rendered as `twitter:image:alt` in the HTML. Screen readers use this text to describe the image to visually impaired users. It also serves as fallback text if the image fails to load.",
    explanationWrong:
      "Omitting the `alt` attribute means visually impaired users who encounter the card in their timeline have no idea what the image shows. Twitter will also display a blank space if the image fails to load, with no text to explain what should be there.",
    sourceUrl:
      "https://developer.x.com/en/docs/twitter-for-websites/cards/overview/markup",
    sourceLabel: "X: Card markup tags",
  },
  {
    id: "tc-008",
    category: "twitter-cards",
    difficulty: "hard",
    title: "Validating Twitter cards before launch",
    prompt: "Which setup avoids broken card previews?",
    content: {
      type: "code",

      left: `// app/layout.tsx
export const metadata: Metadata = {
  twitter: {
    card: "summary_large_image",
    images: ["/og.png"],
  },
};

// Deploy to production and share on Twitter
// to see if the card looks correct`,

      right: `// app/layout.tsx
export const metadata: Metadata = {
  metadataBase: new URL("https://acme.com"),
  twitter: {
    card: "summary_large_image",
    images: [{
      url: "/og.png",
      width: 1200,
      height: 628,
      alt: "Acme Corp preview",
    }],
  },
};

// Validate: check meta tags in page source,
// then use https://cards-dev.twitter.com/
// after deploying to a public URL`,
    },

    correctSide: "right",
    explanationCorrect:
      "Setting `metadataBase` ensures all image URLs resolve to absolute paths, which is required for Twitter's crawler. Before sharing publicly, validate the card using Twitter's Card Validator tool. This catches issues like incorrect image dimensions, missing required fields, or inaccessible image URLs.",
    explanationWrong:
      "Testing Twitter cards by sharing on the live platform is risky. Twitter caches card data aggressively, so a broken card may persist for days even after you fix it. Always validate with the Card Validator first, and ensure `metadataBase` is set so relative URLs resolve correctly.",
    sourceUrl:
      "https://developer.x.com/en/docs/twitter-for-websites/cards/guides/troubleshooting-cards",
    sourceLabel: "X: Troubleshooting cards",
  },
];
