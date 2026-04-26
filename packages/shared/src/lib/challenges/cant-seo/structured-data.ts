import type { BaseChallenge } from "../../game/types";

export const structuredDataChallenges: BaseChallenge[] = [
  {
    id: "sd-001",
    category: "structured-data",
    difficulty: "easy",
    title: "JSON-LD in Next.js via script tag",
    prompt: "Which JSON-LD approach is recommended?",
    content: {
      type: "code",

      left: `// app/page.tsx
export const metadata: Metadata = {
  other: {
    "application/ld+json": JSON.stringify({
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: "Acme Corp",
    }),
  },
};

export default function Home() {
  return <main>Welcome to Acme</main>;
}`,

      right: `// app/page.tsx
export default function Home() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Acme Corp",
    url: "https://acme.com",
  };

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd),
        }}
      />
      Welcome to Acme
    </main>
  );
}`,
    },

    correctSide: "right",
    explanationCorrect:
      "The recommended way to add JSON-LD in Next.js is via a `<script type='application/ld+json'>` tag in the page component. This approach is explicit, easy to read, and works with both static and dynamic data. Google's own documentation recommends JSON-LD over other structured data formats.",
    explanationWrong:
      "Putting JSON-LD in the `other` field of the metadata export is not the intended use of that API. The metadata export is designed for standard meta tags, not arbitrary script blocks. This approach is fragile and may not render correctly in all cases.",
    sourceUrl:
      "https://nextjs.org/docs/app/building-your-application/optimizing/metadata#json-ld",
    sourceLabel: "Next.js: JSON-LD",
  },
  {
    id: "sd-002",
    category: "structured-data",
    difficulty: "medium",
    title: "Article schema for blog posts",
    prompt: "Which Article schema qualifies for rich results?",
    content: {
      type: "code",

      left: `// app/blog/[slug]/page.tsx
export default async function BlogPost({
  params,
}: {
  params: { slug: string };
}) {
  const post = await getPost(params.slug);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
  };

  return (
    <article>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd),
        }}
      />
      <h1>{post.title}</h1>
      <p>{post.content}</p>
    </article>
  );
}`,

      right: `// app/blog/[slug]/page.tsx
export default async function BlogPost({
  params,
}: {
  params: { slug: string };
}) {
  const post = await getPost(params.slug);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt,
    author: {
      "@type": "Person",
      name: post.author.name,
      url: post.author.url,
    },
    image: post.coverImage,
    publisher: {
      "@type": "Organization",
      name: "Acme Corp",
      logo: {
        "@type": "ImageObject",
        url: "https://acme.com/logo.png",
      },
    },
  };

  return (
    <article>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd),
        }}
      />
      <h1>{post.title}</h1>
      <p>{post.content}</p>
    </article>
  );
}`,
    },

    correctSide: "right",
    explanationCorrect:
      "A complete Article schema includes the headline, dates, author, image, and publisher. Google uses these fields to display rich results like article carousels with author photos and publish dates. The more fields you provide, the more likely your content qualifies for enhanced search features.",
    explanationWrong:
      "An Article schema with only a headline provides almost no value. Google requires at minimum the headline, author, datePublished, and image to consider the page for article-related rich results. A bare-bones schema is effectively the same as having none.",
    sourceUrl:
      "https://developers.google.com/search/docs/appearance/structured-data/article",
    sourceLabel: "Google: Article structured data",
  },
  {
    id: "sd-003",
    category: "structured-data",
    difficulty: "medium",
    title: "FAQ schema markup",
    prompt: "Which FAQ page can trigger rich results?",
    content: {
      type: "code",

      left: `// app/faq/page.tsx
export default function FAQPage() {
  return (
    <main>
      <h1>FAQ</h1>
      <div>
        <h3>What is your return policy?</h3>
        <p>You can return items within 30 days.</p>
      </div>
      <div>
        <h3>Do you ship internationally?</h3>
        <p>Yes, we ship to over 50 countries.</p>
      </div>
    </main>
  );
}`,

      right: `// app/faq/page.tsx
const faqs = [
  { q: "What is your return policy?",
    a: "You can return items within 30 days." },
  { q: "Do you ship internationally?",
    a: "Yes, we ship to over 50 countries." },
];

export default function FAQPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.a,
      },
    })),
  };

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd),
        }}
      />
      <h1>FAQ</h1>
      {faqs.map((faq) => (
        <div key={faq.q}>
          <h3>{faq.q}</h3>
          <p>{faq.a}</p>
        </div>
      ))}
    </main>
  );
}`,
    },

    correctSide: "right",
    explanationCorrect:
      "FAQ schema markup can trigger rich results that show expandable question-and-answer pairs directly in Google search. This takes up more visual space on the results page, increasing your visibility. The data-driven approach also keeps the schema and rendered content in sync.",
    explanationWrong:
      "Without FAQ schema, Google has no structured way to identify the questions and answers on your page. It may still show the content in regular search results, but you miss the opportunity for the expandable FAQ rich result that can dramatically increase your click-through rate.",
    sourceUrl:
      "https://developers.google.com/search/docs/appearance/structured-data/faqpage",
    sourceLabel: "Google: FAQ structured data",
  },
  {
    id: "sd-004",
    category: "structured-data",
    difficulty: "medium",
    title: "BreadcrumbList schema",
    prompt: "Which breadcrumb shows labels in search results?",
    content: {
      type: "code",

      left: `// components/breadcrumbs.tsx
export function Breadcrumbs({
  items,
}: {
  items: { label: string; href: string }[];
}) {
  return (
    <nav aria-label="Breadcrumb">
      <ol>
        {items.map((item, i) => (
          <li key={item.href}>
            <a href={item.href}>{item.label}</a>
            {i < items.length - 1 && " > "}
          </li>
        ))}
      </ol>
    </nav>
  );
}`,

      right: `// components/breadcrumbs.tsx
export function Breadcrumbs({
  items,
}: {
  items: { label: string; href: string }[];
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.label,
      item: item.href,
    })),
  };

  return (
    <nav aria-label="Breadcrumb">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd),
        }}
      />
      <ol>
        {items.map((item, i) => (
          <li key={item.href}>
            <a href={item.href}>{item.label}</a>
            {i < items.length - 1 && " > "}
          </li>
        ))}
      </ol>
    </nav>
  );
}`,
    },

    correctSide: "right",
    explanationCorrect:
      "BreadcrumbList schema tells Google how to display the page's position in the site hierarchy directly in search results. Instead of showing the raw URL, Google shows clickable breadcrumb links like 'Home > Products > Widgets'. This improves navigation and click-through rates.",
    explanationWrong:
      "Without BreadcrumbList schema, Google may still infer breadcrumbs from your URL structure, but the result is less reliable and often shows the raw URL path instead of human-readable labels. Explicit schema markup gives you control over what appears in search results.",
    sourceUrl:
      "https://developers.google.com/search/docs/appearance/structured-data/breadcrumb",
    sourceLabel: "Google: Breadcrumb structured data",
  },
  {
    id: "sd-005",
    category: "structured-data",
    difficulty: "easy",
    title: "Organization schema in root layout",
    prompt: "Which layout helps build a Knowledge Panel?",
    content: {
      type: "code",

      left: `// app/layout.tsx
export const metadata: Metadata = {
  title: {
    default: "Acme Corp",
    template: "%s | Acme Corp",
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
export const metadata: Metadata = {
  title: {
    default: "Acme Corp",
    template: "%s | Acme Corp",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const orgJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Acme Corp",
    url: "https://acme.com",
    logo: "https://acme.com/logo.png",
    sameAs: [
      "https://twitter.com/acmecorp",
      "https://linkedin.com/company/acme",
    ],
  };

  return (
    <html lang="en">
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(orgJsonLd),
          }}
        />
        {children}
      </body>
    </html>
  );
}`,
    },

    correctSide: "right",
    explanationCorrect:
      "Placing Organization schema in the root layout makes it available on every page. It tells Google your company name, logo, and social profiles, which can appear in the Knowledge Panel on the right side of search results. The `sameAs` array links to your verified social accounts.",
    explanationWrong:
      "Without Organization schema, Google must infer your brand information from scattered signals across the web. You miss the opportunity to directly tell Google your official name, logo, and social media profiles, which reduces your chances of getting a Knowledge Panel.",
    sourceUrl:
      "https://developers.google.com/search/docs/appearance/structured-data/organization",
    sourceLabel: "Google: Organization structured data",
  },
  {
    id: "sd-006",
    category: "structured-data",
    difficulty: "hard",
    title: "Multiple schemas per page",
    prompt: "Which way of combining schemas is cleaner?",
    content: {
      type: "code",

      left: `// app/blog/[slug]/page.tsx
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: post.title,
  author: { "@type": "Person", name: "Jane" },
  breadcrumb: {
    "@type": "BreadcrumbList",
    itemListElement: [
      { position: 1, name: "Home", item: "/" },
      { position: 2, name: "Blog", item: "/blog" },
    ],
  },
};`,

      right: `// app/blog/[slug]/page.tsx
const articleJsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: post.title,
  author: {
    "@type": "Person",
    name: "Jane",
  },
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem",
      position: 1, name: "Home", item: "/" },
    { "@type": "ListItem",
      position: 2, name: "Blog", item: "/blog" },
  ],
};

// Render as two separate script tags`,
    },

    correctSide: "right",
    explanationCorrect:
      "Each schema type should be in its own `<script type='application/ld+json'>` tag. This is cleaner and avoids nesting unrelated schemas. Google recommends keeping schemas separate unless they have a natural parent-child relationship. It also makes validation easier.",
    explanationWrong:
      "Nesting BreadcrumbList inside Article as a `breadcrumb` property is not semantically correct according to schema.org. While Google might still parse it, the relationship is artificial. It also makes the schema harder to validate and maintain as you add more types.",
    sourceUrl:
      "https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data",
    sourceLabel: "Google: Intro to structured data",
  },
  {
    id: "sd-007",
    category: "structured-data",
    difficulty: "hard",
    title: "Validating structured data",
    prompt: "Which Product schema is valid for rich results?",
    content: {
      type: "code",

      left: `// app/products/[id]/page.tsx
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Product",
  name: product.name,
  description: product.description,
  // Missing required fields: offers, image
  // Deploy and hope Google picks it up
};`,

      right: `// app/products/[id]/page.tsx
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Product",
  name: product.name,
  description: product.description,
  image: product.imageUrl,
  offers: {
    "@type": "Offer",
    price: product.price,
    priceCurrency: "USD",
    availability:
      "https://schema.org/InStock",
  },
};
// Validate: paste URL into
// search.google.com/test/rich-results`,
    },

    correctSide: "right",
    explanationCorrect:
      "Product schema requires specific fields like `offers` and `image` to qualify for rich results. Always validate your schema using Google's Rich Results Test before deploying. This tool shows exactly which fields are missing or incorrect, saving you from waiting weeks to discover the schema was invalid.",
    explanationWrong:
      "Deploying incomplete Product schema without validation is wasteful. Google silently ignores schemas that are missing required fields. You could wait months wondering why your products never show star ratings or pricing in search results, only to discover the schema was never valid.",
    sourceUrl: "https://search.google.com/test/rich-results",
    sourceLabel: "Google: Rich Results Test",
  },
  {
    id: "sd-008",
    category: "structured-data",
    difficulty: "hard",
    title: "Dynamic JSON-LD from component props",
    prompt: "Which event page is discoverable via search?",
    content: {
      type: "code",

      left: `// app/events/[id]/page.tsx
export default async function EventPage({
  params,
}: {
  params: { id: string };
}) {
  const event = await getEvent(params.id);

  return (
    <main>
      <h1>{event.name}</h1>
      <p>{event.date}</p>
      <p>{event.location}</p>
    </main>
  );
  // No structured data at all
}`,

      right: `// app/events/[id]/page.tsx
export default async function EventPage({
  params,
}: {
  params: { id: string };
}) {
  const event = await getEvent(params.id);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: event.name,
    startDate: event.startDate,
    endDate: event.endDate,
    location: {
      "@type": "Place",
      name: event.venueName,
      address: event.address,
    },
    organizer: {
      "@type": "Organization",
      name: "Acme Corp",
      url: "https://acme.com",
    },
  };

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd),
        }}
      />
      <h1>{event.name}</h1>
      <p>{event.date}</p>
      <p>{event.location}</p>
    </main>
  );
}`,
    },

    correctSide: "right",
    explanationCorrect:
      "Building JSON-LD from fetched data ensures each event page has accurate, unique structured data. Google can display event rich results with the date, venue, and organizer directly in search. This is especially valuable for event pages because users often search for events by date or location.",
    explanationWrong:
      "Event pages without structured data miss out on Google's event rich results, which show the date, time, and venue in a visually distinct format. Users searching for events in a specific area will never see your events in the dedicated events section of search results.",
    sourceUrl:
      "https://developers.google.com/search/docs/appearance/structured-data/event",
    sourceLabel: "Google: Event structured data",
  },
];
