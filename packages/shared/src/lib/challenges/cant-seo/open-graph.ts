import type { BaseChallenge } from "../../game/types";

export const openGraphChallenges: BaseChallenge[] = [
  {
    id: "og-001",
    category: "open-graph",
    difficulty: "easy",
    title: "Explicit vs inherited og:title",
    prompt: "Which OG title setup gives more control?",
    content: {
      type: "code",

      left: `// app/about/page.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us | Acme Corp",
  // No openGraph defined, hoping
  // the title tag is enough
};`,

      right: `// app/about/page.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us | Acme Corp",
  openGraph: {
    title: "About Us",
    description: "Learn about Acme Corp and our team.",
  },
};`,
    },

    correctSide: "right",
    explanationCorrect:
      "While some platforms fall back to the `<title>` tag, explicitly setting `og:title` gives you control over how the link appears when shared. You can use a shorter, cleaner title without the brand suffix that the title template adds.",
    explanationWrong:
      "Without explicit Open Graph tags, platforms like Facebook, LinkedIn, and Slack must guess what to display. They may use the full `<title>` (including the brand suffix) or pull random text from the page body, resulting in an unappealing share card.",
    sourceUrl: "https://ogp.me/",
    sourceLabel: "The Open Graph protocol",
  },
  {
    id: "og-002",
    category: "open-graph",
    difficulty: "easy",
    title: "OG image dimensions",
    prompt: "Which OG image config works across platforms?",
    content: {
      type: "code",

      left: `// app/layout.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  openGraph: {
    images: [
      {
        url: "/og.png",
        width: 400,
        height: 400,
      },
    ],
  },
};`,

      right: `// app/layout.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  openGraph: {
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "Acme Corp - Build better products",
      },
    ],
  },
};`,
    },

    correctSide: "right",
    explanationCorrect:
      "The recommended OG image size is 1200x630 pixels (1.91:1 aspect ratio). This works well across Facebook, LinkedIn, Twitter, Slack, and Discord. Including the `alt` attribute improves accessibility for screen readers and provides fallback text when the image fails to load.",
    explanationWrong:
      "A 400x400 square image gets cropped awkwardly on most platforms because they expect a landscape format. Facebook and LinkedIn will either stretch it, add padding, or crop the sides, making the share card look unprofessional.",
    sourceUrl:
      "https://developers.facebook.com/docs/sharing/best-practices/#images",
    sourceLabel: "Facebook: Sharing best practices",
  },
  {
    id: "og-003",
    category: "open-graph",
    difficulty: "medium",
    title: "OG type for articles",
    prompt: "Which OG type fits a blog post?",
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
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "website",
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
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      publishedTime: post.publishedAt,
      authors: [post.author.name],
    },
  };
}`,
    },

    correctSide: "right",
    explanationCorrect:
      "Blog posts should use `type: 'article'` with `publishedTime` and `authors`. This tells social platforms and search engines that the content is a dated article, not a generic webpage. Some platforms display the publish date and author in the share card.",
    explanationWrong:
      "Using `type: 'website'` for a blog post misrepresents the content. It hides useful information like the publish date and author that platforms can display. The `article` type also helps search engines understand your content structure.",
    sourceUrl: "https://ogp.me/#type_article",
    sourceLabel: "Open Graph: Article type",
  },
  {
    id: "og-004",
    category: "open-graph",
    difficulty: "medium",
    title: "OG URL and canonical alignment",
    prompt: "Which URL format is correct for og:url?",
    content: {
      type: "code",

      left: `// app/products/[id]/page.tsx
export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  return {
    openGraph: {
      url: \`/products/\${params.id}\`,
    },
    alternates: {
      canonical: \`/products/\${params.id}\`,
    },
  };
}`,

      right: `// app/products/[id]/page.tsx
export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  return {
    openGraph: {
      url: \`https://acme.com/products/\${params.id}\`,
    },
    alternates: {
      canonical: \`https://acme.com/products/\${params.id}\`,
    },
  };
}`,
    },

    correctSide: "right",
    explanationCorrect:
      "Both `og:url` and the canonical URL should be absolute URLs pointing to the same location. Using `metadataBase` in the root layout can resolve relative paths, but explicit absolute URLs are clearer and ensure consistency. The og:url tells platforms which URL to associate with shares and likes.",
    explanationWrong:
      "Relative URLs in `og:url` may not resolve correctly on all platforms. Facebook's crawler, for instance, needs an absolute URL to properly aggregate share counts. Mismatched og:url and canonical values can also split social engagement metrics across different URLs.",
    sourceUrl:
      "https://nextjs.org/docs/app/api-reference/functions/generate-metadata#metadatabase",
    sourceLabel: "Next.js: metadataBase",
  },
  {
    id: "og-005",
    category: "open-graph",
    difficulty: "easy",
    title: "og:site_name configuration",
    prompt: "Which OG setup identifies the site properly?",
    content: {
      type: "code",

      left: `// app/layout.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  openGraph: {
    title: "Acme Corp",
    description: "We build great products.",
    images: ["/og.png"],
  },
};`,

      right: `// app/layout.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  openGraph: {
    siteName: "Acme Corp",
    title: "Acme Corp",
    description: "We build great products.",
    images: ["/og.png"],
  },
};`,
    },

    correctSide: "right",
    explanationCorrect:
      "The `siteName` property adds an `og:site_name` meta tag that tells platforms the name of the overall website. This is shown separately from the page title in share cards. Facebook, for example, displays the site name in small text above or below the title.",
    explanationWrong:
      "Without `og:site_name`, platforms cannot distinguish between the page title and the website name. On Facebook, the site name appears as a subtle label that helps users identify the source. Missing it makes your share cards look less polished.",
    sourceUrl: "https://ogp.me/#metadata",
    sourceLabel: "Open Graph: Basic metadata",
  },
  {
    id: "og-006",
    category: "open-graph",
    difficulty: "medium",
    title: "OG locale for multilingual sites",
    prompt: "Which locale format follows the OG spec?",
    content: {
      type: "code",

      left: `// app/layout.tsx
export const metadata: Metadata = {
  openGraph: {
    title: "Acme Corp",
    locale: "en",
  },
};`,

      right: `// app/layout.tsx
export const metadata: Metadata = {
  openGraph: {
    title: "Acme Corp",
    locale: "en_US",
    alternateLocale: ["de_DE", "fr_FR"],
  },
};`,
    },

    correctSide: "right",
    explanationCorrect:
      "The `og:locale` tag uses the `language_TERRITORY` format (e.g., `en_US`, not just `en`). Including `alternateLocale` tells platforms that this content is available in other languages, which helps with content discovery and prevents duplicate content issues across locales.",
    explanationWrong:
      "Using just `en` without a territory code does not follow the Open Graph specification, which expects the `language_TERRITORY` format. Without `alternateLocale`, platforms have no way to know your site offers content in other languages.",
    sourceUrl: "https://ogp.me/#optional",
    sourceLabel: "Open Graph: Optional metadata",
  },
  {
    id: "og-007",
    category: "open-graph",
    difficulty: "hard",
    title: "Dynamic OG images with ImageResponse",
    prompt: "Which OG image strategy is more engaging?",
    content: {
      type: "code",

      left: `// app/blog/[slug]/page.tsx
export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  return {
    openGraph: {
      images: ["/default-og.png"],
    },
  };
}`,

      right: `// app/blog/[slug]/opengraph-image.tsx
import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OGImage({
  params,
}: {
  params: { slug: string };
}) {
  const post = await getPost(params.slug);
  return new ImageResponse(
    (
      <div style={{
        display: "flex",
        fontSize: 48,
        background: "#111",
        color: "#fff",
        width: "100%",
        height: "100%",
        padding: 60,
        alignItems: "center",
      }}>
        {post.title}
      </div>
    ),
    { ...size }
  );
}`,
    },

    correctSide: "right",
    explanationCorrect:
      "The `opengraph-image.tsx` file convention generates a unique OG image for each dynamic route. Next.js automatically sets the correct `og:image` meta tags. Each blog post gets its own branded image with the post title, which looks far more engaging in share cards.",
    explanationWrong:
      "Using the same static image for every blog post means all shared links look identical. Users scrolling through social feeds cannot distinguish between posts. Dynamic OG images significantly improve click-through rates by showing relevant, unique content.",
    sourceUrl:
      "https://nextjs.org/docs/app/api-reference/file-conventions/metadata/opengraph-image",
    sourceLabel: "Next.js: opengraph-image",
  },
  {
    id: "og-008",
    category: "open-graph",
    difficulty: "hard",
    title: "Passing fetched data to generateMetadata",
    prompt: "Which data fetching pattern avoids duplication?",
    content: {
      type: "code",

      left: `// app/products/[id]/page.tsx
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const res = await fetch(
    \`https://api.acme.com/products/\${params.id}\`
  );
  const product = await res.json();
  return { title: product.name };
}

export default async function ProductPage({
  params,
}: {
  params: { id: string };
}) {
  const res = await fetch(
    \`https://api.acme.com/products/\${params.id}\`,
    { cache: "no-store" }
  );
  const product = await res.json();
  return <h1>{product.name}</h1>;
}`,

      right: `// app/products/[id]/page.tsx
import type { Metadata } from "next";

async function getProduct(id: string) {
  const res = await fetch(
    \`https://api.acme.com/products/\${id}\`
  );
  return res.json();
}

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const product = await getProduct(params.id);
  return { title: product.name };
}

export default async function ProductPage({
  params,
}: {
  params: { id: string };
}) {
  const product = await getProduct(params.id);
  return <h1>{product.name}</h1>;
}`,
    },

    correctSide: "right",
    explanationCorrect:
      "Next.js automatically deduplicates `fetch` calls with the same URL and options. By extracting the fetch into a shared function, both `generateMetadata` and the page component call it, but only one network request is made. This keeps the code DRY and the data consistent.",
    explanationWrong:
      "Duplicating the fetch call with different cache options (`no-store` in one, default in the other) prevents Next.js from deduplicating the requests. This means two separate network calls for the same data, and the different caching strategies can cause the metadata and page content to show different information.",
    sourceUrl:
      "https://nextjs.org/docs/app/building-your-application/data-fetching/caching-and-revalidating",
    sourceLabel: "Next.js: Data fetching and caching",
  },
];
