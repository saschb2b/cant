import type { BaseChallenge } from "../../game/types";

export const internationalizationChallenges: BaseChallenge[] = [
  {
    id: "i18n-001",
    category: "internationalization",
    difficulty: "easy",
    title: "hreflang tags for language variants",
    prompt: "Which setup helps Google serve the right language?",
    content: {
      type: "code",

      left: `// app/layout.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Acme Corp",
  // No hreflang tags
  // Google may show the wrong language
  // version to users in other countries
};`,

      right: `// app/layout.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Acme Corp",
  alternates: {
    languages: {
      "en-US": "https://acme.com/en",
      "de-DE": "https://acme.com/de",
      "fr-FR": "https://acme.com/fr",
    },
  },
};`,
    },

    correctSide: "right",
    explanationCorrect:
      "The `alternates.languages` field generates `<link rel='alternate' hreflang='...'>` tags. These tell Google which URL to show for each language and region. Without them, German users might see the English page in search results even though a German version exists.",
    explanationWrong:
      "Without hreflang tags, Google treats each language version as an independent page and guesses which one to show based on signals like the user's location and browser language. This often results in the wrong version appearing in search results, frustrating users.",
    sourceUrl:
      "https://developers.google.com/search/docs/specialty/international/localized-versions",
    sourceLabel: "Google: Localized versions of pages",
  },
  {
    id: "i18n-002",
    category: "internationalization",
    difficulty: "medium",
    title: "x-default hreflang",
    prompt: "Which hreflang setup covers all users?",
    content: {
      type: "code",

      left: `// app/[locale]/layout.tsx
export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  return {
    alternates: {
      languages: {
        "en-US": "https://acme.com/en",
        "de-DE": "https://acme.com/de",
      },
    },
  };
}`,

      right: `// app/[locale]/layout.tsx
export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  return {
    alternates: {
      languages: {
        "en-US": "https://acme.com/en",
        "de-DE": "https://acme.com/de",
        "x-default": "https://acme.com",
      },
    },
  };
}`,
    },

    correctSide: "right",
    explanationCorrect:
      "The `x-default` hreflang value specifies the fallback URL for users whose language does not match any of the listed variants. This is typically your homepage or a language selector page. Without it, Google has no guidance for users outside your supported locales.",
    explanationWrong:
      "Without `x-default`, users in countries you have not explicitly listed (e.g., Japan, Brazil) may see any version Google chooses. The `x-default` tag lets you direct them to a language selector or your primary language version, providing a better experience.",
    sourceUrl:
      "https://developers.google.com/search/docs/specialty/international/localized-versions#xdefault",
    sourceLabel: "Google: x-default hreflang",
  },
  {
    id: "i18n-003",
    category: "internationalization",
    difficulty: "medium",
    title: "Next.js alternates.languages per page",
    prompt: "Which hreflang scope is more accurate?",
    content: {
      type: "code",

      left: `// app/[locale]/blog/[slug]/page.tsx
export async function generateMetadata({
  params,
}: {
  params: { locale: string; slug: string };
}): Promise<Metadata> {
  const post = await getPost(params.slug);
  return {
    title: post.title,
    // No per-page hreflang tags
    // Relies on layout-level alternates only
  };
}`,

      right: `// app/[locale]/blog/[slug]/page.tsx
export async function generateMetadata({
  params,
}: {
  params: { locale: string; slug: string };
}): Promise<Metadata> {
  const post = await getPost(params.slug);
  const locales = ["en", "de", "fr"];
  const languages: Record<string, string> = {};
  for (const loc of locales) {
    languages[loc] =
      \`https://acme.com/\${loc}/blog/\${params.slug}\`;
  }
  languages["x-default"] =
    \`https://acme.com/en/blog/\${params.slug}\`;

  return {
    title: post.title,
    alternates: { languages },
  };
}`,
    },

    correctSide: "right",
    explanationCorrect:
      "hreflang tags must point to the exact equivalent page in each language, not just the site root. Each blog post needs hreflang links to its translated versions at the same URL path. This helps Google serve the correct language version when someone searches for a topic covered by that specific post.",
    explanationWrong:
      "Layout-level hreflang tags only cover the layout's own URL pattern. Individual pages need their own hreflang tags that point to the exact translated counterparts. Without per-page tags, Google cannot connect `/en/blog/my-post` to `/de/blog/my-post` as language variants of the same content.",
    sourceUrl:
      "https://nextjs.org/docs/app/api-reference/functions/generate-metadata#alternates",
    sourceLabel: "Next.js: alternates metadata",
  },
  {
    id: "i18n-004",
    category: "internationalization",
    difficulty: "easy",
    title: "Locale in URL path",
    prompt: "Which locale routing is crawlable?",
    content: {
      type: "code",

      left: `// Locale detection via cookies only
// middleware.ts
export function middleware(request: NextRequest) {
  const locale = request.cookies.get("locale")
    ?.value || "en";
  // Rewrite internally but keep same URL
  return NextResponse.rewrite(
    new URL(\`/\${locale}\${request.nextUrl.pathname}\`,
      request.url)
  );
}
// All languages serve from the same URL`,

      right: `// Locale visible in URL path
// middleware.ts
export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const hasLocale = locales.some(
    (loc) => pathname.startsWith(\`/\${loc}/\`)
      || pathname === \`/\${loc}\`
  );
  if (!hasLocale) {
    const locale = detectLocale(request);
    return NextResponse.redirect(
      new URL(\`/\${locale}\${pathname}\`,
        request.url)
    );
  }
}
// /en/about and /de/about are distinct URLs`,
    },

    correctSide: "right",
    explanationCorrect:
      "Having the locale in the URL path (e.g., `/en/about`, `/de/about`) gives each language version its own unique, crawlable URL. Search engines can index and serve the correct version. Cookie-based detection is invisible to crawlers and prevents proper indexing of translated content.",
    explanationWrong:
      "Cookie-based locale detection means search engine crawlers always see the default language because they do not carry cookies. All your translated content is effectively invisible to Google. Users also cannot share a link to the German version because the URL does not encode the language.",
    sourceUrl:
      "https://nextjs.org/docs/app/building-your-application/routing/internationalization",
    sourceLabel: "Next.js: Internationalization",
  },
  {
    id: "i18n-005",
    category: "internationalization",
    difficulty: "hard",
    title: "Domain-based locale routing",
    prompt: "Which domain strategy is stronger for geo SEO?",
    content: {
      type: "code",

      left: `// next.config.mjs
// All locales on one domain with subpaths
// acme.com/en, acme.com/de, acme.com/fr
// But we own acme.de and acme.fr too

const nextConfig = {
  // Domain-specific routing not configured
  // acme.de redirects to acme.com/de
};`,

      right: `// middleware.ts
const domainLocales = {
  "acme.com": "en",
  "acme.de": "de",
  "acme.fr": "fr",
};

export function middleware(request: NextRequest) {
  const host = request.headers.get("host")
    || "acme.com";
  const domain = host.replace(/^www\\./, "");
  const locale = domainLocales[domain] || "en";

  return NextResponse.rewrite(
    new URL(
      \`/\${locale}\${request.nextUrl.pathname}\`,
      request.url
    )
  );
}`,
    },

    correctSide: "right",
    explanationCorrect:
      "Domain-based routing uses country-code domains (acme.de, acme.fr) to signal the target audience to search engines. Google gives a strong geo-targeting signal to ccTLDs. Combined with hreflang tags, this is the most effective approach for international SEO when you own the relevant domains.",
    explanationWrong:
      "Redirecting acme.de to acme.com/de wastes the SEO value of the ccTLD. Country-code domains carry an inherent geo-targeting signal that subpaths do not. German users are more likely to click on acme.de in search results, and Google gives it a ranking boost for German searches.",
    sourceUrl:
      "https://developers.google.com/search/docs/specialty/international/managing-multi-regional-sites",
    sourceLabel: "Google: Multi-regional sites",
  },
  {
    id: "i18n-006",
    category: "internationalization",
    difficulty: "medium",
    title: "Translated metadata",
    prompt: "Which metadata approach fits localized pages?",
    content: {
      type: "code",

      left: `// app/[locale]/about/page.tsx
export const metadata: Metadata = {
  title: "About Us",
  description: "Learn about our company "
    + "and our mission to build great products.",
};
// Same English metadata for all locales`,

      right: `// app/[locale]/about/page.tsx
const translations: Record<string, {
  title: string;
  description: string;
}> = {
  en: {
    title: "About Us",
    description: "Learn about our company "
      + "and our mission.",
  },
  de: {
    title: "Ueber uns",
    description: "Erfahren Sie mehr ueber unser "
      + "Unternehmen und unsere Mission.",
  },
};

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const t = translations[params.locale]
    || translations.en;
  return {
    title: t.title,
    description: t.description,
  };
}`,
    },

    correctSide: "right",
    explanationCorrect:
      "Meta titles and descriptions should be translated for each locale. German users searching on google.de expect to see German snippets in the results. Translated metadata improves click-through rates because users are more likely to click on results in their own language.",
    explanationWrong:
      "Serving English metadata on a German page creates a mismatch that confuses both users and search engines. A German user sees an English title in search results, which reduces trust and click-through rate. Google may also question whether the page is truly German content.",
    sourceUrl:
      "https://developers.google.com/search/docs/specialty/international/localized-versions#guidelines",
    sourceLabel: "Google: Localization guidelines",
  },
  {
    id: "i18n-007",
    category: "internationalization",
    difficulty: "easy",
    title: "lang attribute on html element",
    prompt: "Which layout sets the page language correctly?",
    content: {
      type: "code",

      left: `// app/[locale]/layout.tsx
export default function LocaleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <body>{children}</body>
    </html>
  );
}`,

      right: `// app/[locale]/layout.tsx
export default function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  return (
    <html lang={params.locale}>
      <body>{children}</body>
    </html>
  );
}`,
    },

    correctSide: "right",
    explanationCorrect:
      "Setting the `lang` attribute dynamically based on the current locale is essential for accessibility and SEO. Screen readers use it to select the correct pronunciation rules. Search engines use it as a signal for the page's language. Browser translation features also rely on it.",
    explanationWrong:
      "Without a `lang` attribute, the browser and screen readers must guess the page's language. A screen reader may read German text with English pronunciation rules, making it unintelligible. Search engines lose a clear signal about the content's language, which can affect ranking in localized results.",
    sourceUrl:
      "https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/lang",
    sourceLabel: "MDN: lang attribute",
  },
  {
    id: "i18n-008",
    category: "internationalization",
    difficulty: "hard",
    title: "Right-to-left language support",
    prompt: "Which layout supports RTL languages?",
    content: {
      type: "code",

      left: `// app/[locale]/layout.tsx
export default function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  return (
    <html lang={params.locale}>
      <body>{children}</body>
    </html>
  );
  // Arabic text displays left-to-right,
  // making it unreadable
}`,

      right: `// app/[locale]/layout.tsx
const rtlLocales = ["ar", "he", "fa", "ur"];

export default function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const dir = rtlLocales.includes(params.locale)
    ? "rtl" : "ltr";

  return (
    <html lang={params.locale} dir={dir}>
      <body>{children}</body>
    </html>
  );
}`,
    },

    correctSide: "right",
    explanationCorrect:
      "The `dir` attribute on `<html>` sets the base text direction for the entire page. Arabic, Hebrew, Farsi, and Urdu are right-to-left languages that require `dir='rtl'` for correct text rendering. Without it, text alignment, punctuation placement, and UI layout are all wrong.",
    explanationWrong:
      "Without `dir='rtl'`, Arabic and Hebrew text still renders the individual characters correctly, but the overall layout is broken. Sentences start from the wrong side, punctuation appears in the wrong place, and UI elements like navigation and sidebars are mirrored incorrectly.",
    sourceUrl:
      "https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/dir",
    sourceLabel: "MDN: dir attribute",
  },
];
