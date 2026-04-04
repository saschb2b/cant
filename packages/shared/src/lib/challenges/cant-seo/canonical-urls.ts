import type { BaseChallenge } from "../../game/types";

export const canonicalUrlsChallenges: BaseChallenge[] = [
  {
    id: "cu-001",
    category: "canonical-urls",
    difficulty: "easy",
    title: "Canonical tag reference strategy",
    prompt: "Which canonical tag approach is correct?",
    content: {
      type: "code",

      left: `// app/about/page.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us",
  description: "Learn about our company.",
  // No canonical URL set
};`,

      right: `// app/about/page.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us",
  description: "Learn about our company.",
  alternates: {
    canonical: "https://acme.com/about",
  },
};`,
    },

    correctSide: "right",
    explanationCorrect:
      "Every page should have a self-referencing canonical tag that points to its own URL. This tells search engines that this is the authoritative version of the page. Without it, Google may choose a canonical on its own, which could be a version with query parameters or a different protocol.",
    explanationWrong:
      "Without a canonical tag, search engines must guess which URL version is the 'real' one. If your page is accessible at both `/about` and `/about?ref=footer`, Google might index the wrong version or split ranking signals between them.",
    sourceUrl:
      "https://developers.google.com/search/docs/crawling-indexing/canonicalization",
    sourceLabel: "Google: Canonicalization",
  },
  {
    id: "cu-002",
    category: "canonical-urls",
    difficulty: "easy",
    title: "Trailing slash consistency",
    prompt: "Which trailing slash config prevents duplicates?",
    content: {
      type: "code",

      left: `// next.config.mjs
/** @type {import('next').NextConfig} */
const nextConfig = {
  // No trailingSlash config
  // /about and /about/ both work
};

export default nextConfig;`,

      right: `// next.config.mjs
/** @type {import('next').NextConfig} */
const nextConfig = {
  trailingSlash: false,
  // /about/ redirects to /about
  // Consistent canonical URLs
};

export default nextConfig;`,
    },

    correctSide: "right",
    explanationCorrect:
      "Setting `trailingSlash` explicitly ensures consistent URL behavior. When set to `false`, visiting `/about/` automatically redirects to `/about` (or vice versa when set to `true`). This prevents duplicate content issues where both URL variants are indexed separately.",
    explanationWrong:
      "Without the `trailingSlash` setting, both `/about` and `/about/` may serve the same content. Search engines treat these as two different URLs, which splits your page's ranking signals. Internal links with inconsistent trailing slashes make the problem worse.",
    sourceUrl:
      "https://nextjs.org/docs/app/api-reference/config/next-config-js/trailingSlash",
    sourceLabel: "Next.js: trailingSlash config",
  },
  {
    id: "cu-003",
    category: "canonical-urls",
    difficulty: "medium",
    title: "www vs non-www canonical",
    prompt: "Which middleware handles www correctly?",
    content: {
      type: "code",

      left: `// middleware.ts
import { NextResponse } from "next/server";

export function middleware() {
  // No redirect logic
  // Both www.acme.com and acme.com
  // serve the same content
  return NextResponse.next();
}`,

      right: `// middleware.ts
import { NextRequest, NextResponse } from
  "next/server";

export function middleware(request: NextRequest) {
  const host = request.headers.get("host") || "";
  if (host.startsWith("www.")) {
    const url = request.nextUrl.clone();
    url.host = host.replace("www.", "");
    return NextResponse.redirect(url, 301);
  }
  return NextResponse.next();
}`,
    },

    correctSide: "right",
    explanationCorrect:
      "Redirecting www to non-www (or vice versa) with a 301 ensures search engines consolidate all signals under one domain. A permanent redirect tells crawlers to update their index. This should also be configured at the DNS or CDN level for requests that never reach Next.js.",
    explanationWrong:
      "Serving identical content on both `www.acme.com` and `acme.com` creates a duplicate content problem. Google may index both versions, splitting backlink equity and ranking signals between two domains. Even with canonical tags, a redirect is the strongest signal.",
    sourceUrl:
      "https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls",
    sourceLabel: "Google: Consolidate duplicate URLs",
  },
  {
    id: "cu-004",
    category: "canonical-urls",
    difficulty: "medium",
    title: "Canonical for paginated content",
    prompt: "Which pagination canonical strategy is correct?",
    content: {
      type: "code",

      left: `// app/blog/page.tsx
export async function generateMetadata({
  searchParams,
}: {
  searchParams: { page?: string };
}): Promise<Metadata> {
  return {
    alternates: {
      canonical: "https://acme.com/blog",
    },
    // All pages point canonical to page 1
  };
}`,

      right: `// app/blog/page.tsx
export async function generateMetadata({
  searchParams,
}: {
  searchParams: { page?: string };
}): Promise<Metadata> {
  const page = searchParams.page || "1";
  const canonical = page === "1"
    ? "https://acme.com/blog"
    : \`https://acme.com/blog?page=\${page}\`;

  return {
    alternates: {
      canonical,
    },
  };
}`,
    },

    correctSide: "right",
    explanationCorrect:
      "Each page of paginated content should have its own canonical URL. Page 2 has unique content (different blog posts) that deserves its own place in search results. Pointing all pages to page 1 tells Google that pages 2, 3, and beyond are duplicates, hiding their content from search.",
    explanationWrong:
      "Setting every paginated page's canonical to the first page tells Google to ignore pages 2 and beyond. Posts that only appear on later pages will never be discovered through search. Each page has unique content and needs its own canonical URL.",
    sourceUrl:
      "https://developers.google.com/search/docs/specialty/ecommerce/pagination-and-incremental-page-loading",
    sourceLabel: "Google: Pagination and SEO",
  },
  {
    id: "cu-005",
    category: "canonical-urls",
    difficulty: "hard",
    title: "Cross-domain canonical",
    prompt: "Which canonical handles syndicated content?",
    content: {
      type: "code",

      left: `// Syndicated article on partner.com
// app/syndicated/[slug]/page.tsx
export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  return {
    alternates: {
      canonical:
        \`https://partner.com/syndicated/\${params.slug}\`,
    },
  };
}`,

      right: `// Syndicated article on partner.com
// app/syndicated/[slug]/page.tsx
export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  return {
    alternates: {
      canonical:
        \`https://acme.com/blog/\${params.slug}\`,
    },
  };
}`,
    },

    correctSide: "right",
    explanationCorrect:
      "When content is syndicated (republished on a partner site), the canonical should point back to the original source on your domain. This tells Google that the original lives at acme.com, so all ranking signals flow to your site instead of the partner's copy.",
    explanationWrong:
      "Setting the canonical to the partner site's own URL means the syndicated copy becomes the 'original' in Google's eyes. Your original article on acme.com could be treated as a duplicate, losing rankings to the partner's republished version.",
    sourceUrl:
      "https://developers.google.com/search/docs/crawling-indexing/canonicalization#syndication",
    sourceLabel: "Google: Canonical for syndication",
  },
  {
    id: "cu-006",
    category: "canonical-urls",
    difficulty: "medium",
    title: "Next.js alternates.canonical",
    prompt: "Which API sets the canonical URL properly?",
    content: {
      type: "code",

      left: `// app/products/[id]/page.tsx
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  return {
    other: {
      "link:canonical":
        \`https://acme.com/products/\${params.id}\`,
    },
  };
}`,

      right: `// app/products/[id]/page.tsx
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  return {
    alternates: {
      canonical:
        \`https://acme.com/products/\${params.id}\`,
    },
  };
}`,
    },

    correctSide: "right",
    explanationCorrect:
      "Next.js provides the `alternates.canonical` field specifically for setting canonical URLs. It renders the proper `<link rel='canonical'>` tag in the document head. This is the idiomatic approach that integrates with the rest of the metadata system.",
    explanationWrong:
      "Using the `other` field to set a canonical link is a hack that does not generate a proper `<link rel='canonical'>` element. The `other` field creates `<meta>` tags, not `<link>` tags. The canonical tag requires a `<link>` element to be recognized by search engines.",
    sourceUrl:
      "https://nextjs.org/docs/app/api-reference/functions/generate-metadata#alternates",
    sourceLabel: "Next.js: alternates metadata",
  },
  {
    id: "cu-007",
    category: "canonical-urls",
    difficulty: "hard",
    title: "Dynamic canonical from route params",
    prompt: "Which catch-all canonical approach is better?",
    content: {
      type: "code",

      left: `// app/docs/[...slug]/page.tsx
export async function generateMetadata({
  params,
}: {
  params: { slug: string[] };
}): Promise<Metadata> {
  return {
    alternates: {
      canonical: "/docs",
    },
  };
  // All nested docs pages share one canonical
}`,

      right: `// app/docs/[...slug]/page.tsx
export async function generateMetadata({
  params,
}: {
  params: { slug: string[] };
}): Promise<Metadata> {
  const path = params.slug.join("/");
  return {
    alternates: {
      canonical: \`https://acme.com/docs/\${path}\`,
    },
  };
}`,
    },

    correctSide: "right",
    explanationCorrect:
      "Catch-all routes like `[...slug]` serve many different pages. Each one needs its own canonical URL built from the route parameters. This ensures `/docs/getting-started` and `/docs/api/reference` are recognized as distinct pages with their own search rankings.",
    explanationWrong:
      "Pointing every nested documentation page to `/docs` tells Google that hundreds of unique pages are all duplicates of the docs index. Google will likely ignore this incorrect signal, but it creates confusion and may delay proper indexing of your documentation.",
    sourceUrl:
      "https://nextjs.org/docs/app/building-your-application/routing/dynamic-routes#catch-all-segments",
    sourceLabel: "Next.js: Catch-all segments",
  },
  {
    id: "cu-008",
    category: "canonical-urls",
    difficulty: "medium",
    title: "Canonical with query parameters",
    prompt: "Which query parameter handling is better?",
    content: {
      type: "code",

      left: `// app/products/page.tsx
export async function generateMetadata({
  searchParams,
}: {
  searchParams: {
    sort?: string;
    color?: string;
  };
}): Promise<Metadata> {
  const qs = new URLSearchParams(searchParams);
  return {
    alternates: {
      canonical:
        \`https://acme.com/products?\${qs}\`,
    },
  };
}`,

      right: `// app/products/page.tsx
export async function generateMetadata({
  searchParams,
}: {
  searchParams: {
    sort?: string;
    color?: string;
  };
}): Promise<Metadata> {
  // Filter params only keep meaningful ones
  const color = searchParams.color;
  const canonical = color
    ? \`https://acme.com/products?color=\${color}\`
    : "https://acme.com/products";

  return {
    alternates: { canonical },
  };
}`,
    },

    correctSide: "right",
    explanationCorrect:
      "Only include query parameters that produce meaningfully different content. A color filter shows different products, so it deserves its own canonical. A sort parameter shows the same products in a different order, so it should be stripped from the canonical to avoid duplicate content.",
    explanationWrong:
      "Including all query parameters in the canonical creates a unique canonical for every combination of sort and filter. This fragments your page's ranking signals across dozens of URLs that all show similar content. Search engines may also waste crawl budget on low-value parameter variations.",
    sourceUrl:
      "https://developers.google.com/search/docs/crawling-indexing/url-parameters",
    sourceLabel: "Google: URL parameters",
  },
];
