import type { BaseChallenge } from "../../game/types";

export const sitemapsRobotsChallenges: BaseChallenge[] = [
  {
    id: "sr-001",
    category: "sitemaps-robots",
    difficulty: "easy",
    title: "Next.js sitemap.ts file",
    prompt: "Which sitemap approach stays in sync?",
    content: {
      type: "code",

      lang: "html",

      left: `// public/sitemap.xml (static file)
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://acme.com</loc>
  </url>
  <url>
    <loc>https://acme.com/about</loc>
  </url>
  <!-- Must manually update -->
</urlset>`,

      right: `// app/sitemap.ts
import type { MetadataRoute } from "next";

export default function sitemap():
  MetadataRoute.Sitemap {
  return [
    {
      url: "https://acme.com",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: "https://acme.com/about",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
  ];
}`,
    },

    correctSide: "right",
    explanationCorrect:
      "Next.js generates the sitemap at build time from the `sitemap.ts` file. This approach is type-safe, stays in sync with your routes, and can fetch data dynamically. You never have to manually edit XML or remember to add new pages.",
    explanationWrong:
      "A static XML file in the public directory must be updated manually every time you add or remove a page. It is easy to forget, leading to missing pages in search results or stale entries pointing to deleted pages. There is no type checking for the XML structure either.",
    sourceUrl:
      "https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap",
    sourceLabel: "Next.js: sitemap.ts",
  },
  {
    id: "sr-002",
    category: "sitemaps-robots",
    difficulty: "medium",
    title: "Dynamic sitemap from database",
    prompt: "Which sitemap handles new content better?",
    content: {
      type: "code",

      left: `// app/sitemap.ts
import type { MetadataRoute } from "next";

export default function sitemap():
  MetadataRoute.Sitemap {
  // Hard-coded list of blog posts
  return [
    { url: "https://acme.com/blog/post-1" },
    { url: "https://acme.com/blog/post-2" },
    { url: "https://acme.com/blog/post-3" },
  ];
}`,

      right: `// app/sitemap.ts
import type { MetadataRoute } from "next";
import { getAllPosts } from "@/lib/posts";

export default async function sitemap():
  Promise<MetadataRoute.Sitemap> {
  const posts = await getAllPosts();

  const blogUrls = posts.map((post) => ({
    url: \`https://acme.com/blog/\${post.slug}\`,
    lastModified: new Date(post.updatedAt),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  return [
    {
      url: "https://acme.com",
      lastModified: new Date(),
      priority: 1,
    },
    ...blogUrls,
  ];
}`,
    },

    correctSide: "right",
    explanationCorrect:
      "Making the sitemap function `async` lets you fetch blog posts from a database or CMS. New posts are automatically included in the sitemap without any code changes. The `lastModified` date from the database gives search engines accurate freshness signals.",
    explanationWrong:
      "A hard-coded list of URLs defeats the purpose of using a programmatic sitemap. Every new blog post requires a code change, a commit, and a deployment. If you forget to add a post, it may take much longer for search engines to discover it.",
    sourceUrl:
      "https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap#generating-a-sitemap-using-code",
    sourceLabel: "Next.js: Dynamic sitemap generation",
  },
  {
    id: "sr-003",
    category: "sitemaps-robots",
    difficulty: "easy",
    title: "robots.ts allow and disallow",
    prompt: "Which robots config protects crawl budget?",
    content: {
      type: "code",

      left: `// public/robots.txt (static file)
User-agent: *
Disallow:`,

      right: `// app/robots.ts
import type { MetadataRoute } from "next";

export default function robots():
  MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin/", "/api/"],
    },
    sitemap: "https://acme.com/sitemap.xml",
  };
}`,
    },

    correctSide: "right",
    explanationCorrect:
      "Using `robots.ts` is type-safe and keeps configuration with your code. Disallowing `/admin/` and `/api/` prevents crawlers from wasting time on pages that are not useful in search results. Including the sitemap URL in robots.txt helps crawlers discover your sitemap automatically.",
    explanationWrong:
      "An empty `Disallow:` directive means all crawlers can access every URL, including admin panels and API endpoints. While these pages may have authentication, crawlers will still waste time trying to access them, consuming your crawl budget on low-value URLs.",
    sourceUrl:
      "https://nextjs.org/docs/app/api-reference/file-conventions/metadata/robots",
    sourceLabel: "Next.js: robots.ts",
  },
  {
    id: "sr-004",
    category: "sitemaps-robots",
    difficulty: "medium",
    title: "noindex vs disallow difference",
    prompt: "Which method truly removes a page from search?",
    content: {
      type: "code",

      left: `// app/robots.ts - trying to hide a page
export default function robots():
  MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/secret-launch/"],
    },
  };
}
// The page at /secret-launch is still
// indexed because other sites link to it`,

      right: `// app/secret-launch/page.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

// app/robots.ts
export default function robots():
  MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/"],
    },
    // Do NOT disallow /secret-launch here
    // so crawlers can see the noindex tag
  };
}`,
    },

    correctSide: "right",
    explanationCorrect:
      "To prevent a page from appearing in search results, use `noindex` in the page metadata. This is more reliable than `Disallow` because Google must be able to crawl the page to see the `noindex` directive. If you disallow crawling, Google might still index the URL (without a snippet) based on external links.",
    explanationWrong:
      "Disallowing a URL in robots.txt prevents crawlers from visiting it, but does not prevent indexing. If another website links to `/secret-launch/`, Google may still list it in search results showing just the URL and any anchor text from the linking page. The noindex tag is the correct tool for this job.",
    sourceUrl:
      "https://developers.google.com/search/docs/crawling-indexing/block-indexing",
    sourceLabel: "Google: Block indexing",
  },
  {
    id: "sr-005",
    category: "sitemaps-robots",
    difficulty: "hard",
    title: "Sitemap index for large sites",
    prompt: "Which sitemap setup handles 100k+ URLs?",
    content: {
      type: "code",

      left: `// app/sitemap.ts
import type { MetadataRoute } from "next";

export default async function sitemap():
  Promise<MetadataRoute.Sitemap> {
  const products = await getAllProducts();
  // Returns 100,000+ URLs in one sitemap
  return products.map((p) => ({
    url: \`https://acme.com/products/\${p.slug}\`,
    lastModified: new Date(p.updatedAt),
  }));
}`,

      right: `// app/sitemap.ts
import type { MetadataRoute } from "next";

export default function sitemap():
  MetadataRoute.Sitemap {
  return [
    { url: "https://acme.com", priority: 1 },
    { url: "https://acme.com/about" },
  ];
}

// app/products/sitemap.ts
export async function generateSitemaps() {
  const count = await getProductCount();
  const pages = Math.ceil(count / 50000);
  return Array.from({ length: pages },
    (_, i) => ({ id: i }));
}

export default async function sitemap({
  id,
}: { id: number }):
  Promise<MetadataRoute.Sitemap> {
  const products = await getProductsPage(id);
  return products.map((p) => ({
    url: \`https://acme.com/products/\${p.slug}\`,
    lastModified: new Date(p.updatedAt),
  }));
}`,
    },

    correctSide: "right",
    explanationCorrect:
      "The sitemap protocol limits each file to 50,000 URLs. Next.js supports `generateSitemaps()` to split large sitemaps into multiple files with an automatic sitemap index. This keeps each file within limits and allows search engines to re-fetch only the changed segments.",
    explanationWrong:
      "A single sitemap with 100,000+ URLs exceeds the sitemap protocol's 50,000 URL limit and likely exceeds the 50MB file size limit too. Search engines will reject or truncate it, meaning many of your products will never be discovered through the sitemap.",
    sourceUrl:
      "https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap#generating-multiple-sitemaps",
    sourceLabel: "Next.js: Multiple sitemaps",
  },
  {
    id: "sr-006",
    category: "sitemaps-robots",
    difficulty: "medium",
    title: "Robots meta tag per page",
    prompt: "Which approach keeps staging out of search?",
    content: {
      type: "code",

      left: `// app/staging/page.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Staging Preview",
  // Forgetting to add noindex on staging
  // pages that are publicly accessible
};`,

      right: `// app/staging/page.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Staging Preview",
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
    },
  },
};`,
    },

    correctSide: "right",
    explanationCorrect:
      "Staging and preview pages that are publicly accessible should have `noindex` to prevent them from appearing in search results. The `googleBot` field allows you to set additional directives specific to Google's crawler, like `noimageindex` to prevent images from appearing in Google Images.",
    explanationWrong:
      "Publicly accessible staging pages without `noindex` can be discovered and indexed by search engines. This creates duplicate content issues with your production site and may expose unfinished features. Search engines regularly discover URLs through DNS records, certificate transparency logs, and spidering.",
    sourceUrl:
      "https://developers.google.com/search/docs/crawling-indexing/robots-meta-tag",
    sourceLabel: "Google: Robots meta tag",
  },
  {
    id: "sr-007",
    category: "sitemaps-robots",
    difficulty: "medium",
    title: "Accurate lastModified dates",
    prompt: "Which lastModified value helps crawlers more?",
    content: {
      type: "code",

      left: `// app/sitemap.ts
export default async function sitemap():
  Promise<MetadataRoute.Sitemap> {
  const posts = await getAllPosts();
  return posts.map((post) => ({
    url: \`https://acme.com/blog/\${post.slug}\`,
    lastModified: new Date(), // Always "now"
  }));
}`,

      right: `// app/sitemap.ts
export default async function sitemap():
  Promise<MetadataRoute.Sitemap> {
  const posts = await getAllPosts();
  return posts.map((post) => ({
    url: \`https://acme.com/blog/\${post.slug}\`,
    lastModified: new Date(post.updatedAt),
  }));
}`,
    },

    correctSide: "right",
    explanationCorrect:
      "The `lastModified` date should reflect when the content actually changed. Google uses this signal to prioritize which pages to re-crawl. Accurate dates help your updated content get re-indexed faster while avoiding unnecessary crawling of unchanged pages.",
    explanationWrong:
      "Setting `lastModified` to the current date on every build tells search engines that all pages changed, even if they did not. Google may eventually ignore your `lastModified` signals entirely if they are consistently inaccurate, reducing the effectiveness of your sitemap.",
    sourceUrl:
      "https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap#additional-notes-about-xml-sitemaps",
    sourceLabel: "Google: Sitemap best practices",
  },
  {
    id: "sr-008",
    category: "sitemaps-robots",
    difficulty: "hard",
    title: "Sitemap priority values",
    prompt: "Which priority assignment is more meaningful?",
    content: {
      type: "code",

      left: `// app/sitemap.ts
export default function sitemap():
  MetadataRoute.Sitemap {
  return [
    { url: "https://acme.com",
      priority: 1.0 },
    { url: "https://acme.com/about",
      priority: 1.0 },
    { url: "https://acme.com/blog",
      priority: 1.0 },
    { url: "https://acme.com/contact",
      priority: 1.0 },
    // Everything is top priority
  ];
}`,

      right: `// app/sitemap.ts
export default function sitemap():
  MetadataRoute.Sitemap {
  return [
    { url: "https://acme.com",
      priority: 1.0 },
    { url: "https://acme.com/products",
      priority: 0.9 },
    { url: "https://acme.com/blog",
      priority: 0.8 },
    { url: "https://acme.com/about",
      priority: 0.5 },
    { url: "https://acme.com/contact",
      priority: 0.3 },
  ];
}`,
    },

    correctSide: "right",
    explanationCorrect:
      "Priority values range from 0.0 to 1.0 and indicate the relative importance of pages within your own site. Using a meaningful hierarchy helps search engines understand which pages matter most to you. Note that Google has stated it largely ignores priority, but other search engines like Bing may use it.",
    explanationWrong:
      "Setting every page to priority 1.0 is the same as setting no priority at all. If everything is the highest priority, nothing is prioritized. Search engines cannot use this signal to distinguish your most important pages from less important ones.",
    sourceUrl: "https://www.sitemaps.org/protocol.html#prioritydef",
    sourceLabel: "Sitemaps.org: Priority definition",
  },
];
