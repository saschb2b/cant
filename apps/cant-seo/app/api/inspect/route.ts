import { NextResponse } from "next/server";
import { Parser } from "htmlparser2";

export interface InspectResponse {
  url: string;
  finalUrl: string;
  title: string | null;
  description: string | null;
  canonical: string | null;
  robots: string | null;
  themeColor: string | null;
  favicon: string | null;
  appleTouchIcon: string | null;
  og: {
    title: string | null;
    description: string | null;
    image: string | null;
    imageWidth: string | null;
    imageHeight: string | null;
    type: string | null;
    url: string | null;
    siteName: string | null;
    locale: string | null;
  };
  twitter: {
    card: string | null;
    title: string | null;
    description: string | null;
    image: string | null;
    site: string | null;
    creator: string | null;
  };
  jsonLd: unknown[];
  allMetaTags: {
    name?: string;
    property?: string;
    content: string;
  }[];
}

function resolveUrl(base: string, href: string): string {
  try {
    return new URL(href, base).href;
  } catch {
    return href;
  }
}

function parseHtml(html: string, baseUrl: string): InspectResponse {
  let inTitle = false;
  let titleText = "";
  const result: InspectResponse = {
    url: baseUrl,
    finalUrl: baseUrl,
    title: null,
    description: null,
    canonical: null,
    robots: null,
    themeColor: null,
    favicon: null,
    appleTouchIcon: null,
    og: {
      title: null,
      description: null,
      image: null,
      imageWidth: null,
      imageHeight: null,
      type: null,
      url: null,
      siteName: null,
      locale: null,
    },
    twitter: {
      card: null,
      title: null,
      description: null,
      image: null,
      site: null,
      creator: null,
    },
    jsonLd: [],
    allMetaTags: [],
  };

  let inScript = false;
  let isJsonLd = false;
  let scriptContent = "";

  const parser = new Parser({
    onopentag(name, attrs) {
      if (name === "title") {
        inTitle = true;
        titleText = "";
      }

      if (name === "script" && attrs.type === "application/ld+json") {
        inScript = true;
        isJsonLd = true;
        scriptContent = "";
      }

      if (name === "meta") {
        const nameAttr = attrs.name?.toLowerCase();
        const property = attrs.property?.toLowerCase();
        const content = attrs.content ?? "";

        if (nameAttr || property) {
          result.allMetaTags.push({
            ...(nameAttr && { name: nameAttr }),
            ...(property && { property }),
            content,
          });
        }

        // Standard meta tags
        if (nameAttr === "description") result.description = content;
        if (nameAttr === "robots") result.robots = content;
        if (nameAttr === "theme-color") result.themeColor = content;

        // Open Graph
        if (property === "og:title") result.og.title = content;
        if (property === "og:description") result.og.description = content;
        if (property === "og:image")
          result.og.image = resolveUrl(baseUrl, content);
        if (property === "og:image:width") result.og.imageWidth = content;
        if (property === "og:image:height") result.og.imageHeight = content;
        if (property === "og:type") result.og.type = content;
        if (property === "og:url") result.og.url = content;
        if (property === "og:site_name") result.og.siteName = content;
        if (property === "og:locale") result.og.locale = content;

        // Twitter Cards
        if (nameAttr === "twitter:card") result.twitter.card = content;
        if (nameAttr === "twitter:title") result.twitter.title = content;
        if (nameAttr === "twitter:description")
          result.twitter.description = content;
        if (nameAttr === "twitter:image")
          result.twitter.image = resolveUrl(baseUrl, content);
        if (nameAttr === "twitter:site") result.twitter.site = content;
        if (nameAttr === "twitter:creator") result.twitter.creator = content;
      }

      if (name === "link") {
        const rel = attrs.rel?.toLowerCase();
        const href = attrs.href;

        if (rel === "canonical" && href) {
          result.canonical = resolveUrl(baseUrl, href);
        }
        if (
          (rel === "icon" || rel === "shortcut icon") &&
          href &&
          !result.favicon
        ) {
          result.favicon = resolveUrl(baseUrl, href);
        }
        if (rel === "apple-touch-icon" && href) {
          result.appleTouchIcon = resolveUrl(baseUrl, href);
        }
      }
    },
    ontext(text) {
      if (inTitle) {
        titleText += text;
      }
      if (inScript && isJsonLd) {
        scriptContent += text;
      }
    },
    onclosetag(name) {
      if (name === "title") {
        inTitle = false;
        result.title = titleText.trim() || null;
      }
      if (name === "script" && isJsonLd) {
        inScript = false;
        isJsonLd = false;
        try {
          result.jsonLd.push(JSON.parse(scriptContent) as unknown);
        } catch {
          // Invalid JSON-LD, skip
        }
      }
    },
  });

  parser.write(html);
  parser.end();

  return result;
}

export async function POST(request: Request) {
  let body: { url?: string };
  try {
    body = (await request.json()) as { url?: string };
  } catch {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 },
    );
  }

  const { url } = body;

  if (!url || typeof url !== "string") {
    return NextResponse.json({ error: "URL is required" }, { status: 400 });
  }

  let parsedUrl: URL;
  try {
    parsedUrl = new URL(url);
  } catch {
    return NextResponse.json({ error: "Invalid URL format" }, { status: 400 });
  }

  if (!["http:", "https:"].includes(parsedUrl.protocol)) {
    return NextResponse.json(
      { error: "Only HTTP and HTTPS URLs are supported" },
      { status: 400 },
    );
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);

  try {
    const response = await fetch(url, {
      signal: controller.signal,
      redirect: "follow",
      headers: {
        "User-Agent":
          "Mozilla/5.0 (compatible; CantSEO/1.0; +https://cant-seo.saschb2b.com)",
        Accept: "text/html,application/xhtml+xml",
      },
    });

    clearTimeout(timeout);

    if (!response.ok) {
      return NextResponse.json(
        { error: `Failed to fetch URL: HTTP ${String(response.status)}` },
        { status: 502 },
      );
    }

    const contentType = response.headers.get("content-type") ?? "";
    if (!contentType.includes("text/html") && !contentType.includes("xhtml")) {
      return NextResponse.json(
        { error: "URL does not return HTML content" },
        { status: 422 },
      );
    }

    const html = await response.text();
    const result = parseHtml(html, response.url || url);
    result.finalUrl = response.url || url;

    return NextResponse.json(result);
  } catch (err) {
    clearTimeout(timeout);

    if (err instanceof DOMException && err.name === "AbortError") {
      return NextResponse.json(
        { error: "Request timed out after 8 seconds" },
        { status: 408 },
      );
    }

    return NextResponse.json(
      { error: "Failed to fetch URL. The site may be unreachable." },
      { status: 502 },
    );
  }
}
