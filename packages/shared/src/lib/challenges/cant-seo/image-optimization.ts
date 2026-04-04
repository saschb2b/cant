import type { BaseChallenge } from "../../game/types";

export const imageOptimizationChallenges: BaseChallenge[] = [
  {
    id: "io-001",
    category: "image-optimization",
    difficulty: "easy",
    title: "opengraph-image.tsx convention",
    prompt: "Which OG image approach is more effective?",
    content: {
      type: "code",

      left: `// app/opengraph-image.png
// A static PNG file in the app directory
// Same image for every page on the site

// app/blog/[slug]/page.tsx
export const metadata: Metadata = {
  openGraph: {
    images: ["/opengraph-image.png"],
  },
};`,

      right: `// app/blog/[slug]/opengraph-image.tsx
import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({
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
        background: "linear-gradient(135deg, \\
#667eea 0%, #764ba2 100%)",
        color: "white",
        width: "100%",
        height: "100%",
        padding: 60,
        alignItems: "center",
        justifyContent: "center",
      }}>
        {post.title}
      </div>
    ),
    size
  );
}`,
    },

    correctSide: "right",
    explanationCorrect:
      "The `opengraph-image.tsx` file convention generates unique OG images per route segment. Next.js automatically wires up the `og:image` meta tag. Each blog post gets a branded, dynamic image with its title, which stands out in social feeds compared to a generic static image.",
    explanationWrong:
      "Using a single static image for every page means all shared links look identical in social feeds. Users scrolling through LinkedIn or Slack cannot tell your blog posts apart. Dynamic OG images are one of the highest-impact SEO improvements for content-heavy sites.",
    sourceUrl:
      "https://nextjs.org/docs/app/api-reference/file-conventions/metadata/opengraph-image",
    sourceLabel: "Next.js: opengraph-image convention",
  },
  {
    id: "io-002",
    category: "image-optimization",
    difficulty: "easy",
    title: "Correct OG image dimensions",
    prompt: "Which OG image size is recommended?",
    content: {
      type: "code",

      left: `// app/opengraph-image.tsx
import { ImageResponse } from "next/og";

export const size = { width: 600, height: 600 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div style={{
        display: "flex",
        width: "100%",
        height: "100%",
        background: "#000",
        color: "#fff",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 32,
      }}>
        Acme Corp
      </div>
    ),
    size
  );
}`,

      right: `// app/opengraph-image.tsx
import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div style={{
        display: "flex",
        width: "100%",
        height: "100%",
        background: "#000",
        color: "#fff",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 48,
      }}>
        Acme Corp
      </div>
    ),
    size
  );
}`,
    },

    correctSide: "right",
    explanationCorrect:
      "The standard OG image size is 1200x630 pixels (1.91:1 ratio). This fits perfectly on Facebook, LinkedIn, Twitter, Slack, and Discord without cropping. Using the correct dimensions ensures your text and branding are fully visible on every platform.",
    explanationWrong:
      "A 600x600 square image will be cropped to a landscape format on most platforms, cutting off the top and bottom. The smaller resolution also looks blurry on high-DPI screens. Always use 1200x630 for maximum compatibility across social platforms.",
    sourceUrl:
      "https://developers.facebook.com/docs/sharing/best-practices/#images",
    sourceLabel: "Facebook: Image best practices",
  },
  {
    id: "io-003",
    category: "image-optimization",
    difficulty: "medium",
    title: "next/image sizes attribute",
    prompt: "Which hero image setup is more responsive?",
    content: {
      type: "code",

      left: `// components/hero.tsx
import Image from "next/image";

export function Hero() {
  return (
    <Image
      src="/hero.jpg"
      alt="Hero banner"
      width={1920}
      height={1080}
    />
  );
}`,

      right: `// components/hero.tsx
import Image from "next/image";

export function Hero() {
  return (
    <Image
      src="/hero.jpg"
      alt="Hero banner"
      fill
      sizes="100vw"
      style={{ objectFit: "cover" }}
      priority
    />
  );
}`,
    },

    correctSide: "right",
    explanationCorrect:
      "Using `fill` with `sizes` tells the browser how wide the image will be at each breakpoint, so it can download the smallest appropriate version. The `sizes='100vw'` indicates a full-width image. Without `sizes`, the browser may download a larger image than needed, wasting bandwidth.",
    explanationWrong:
      "Setting fixed `width` and `height` on a hero image that should be responsive forces a single image size for all viewports. Mobile users download a 1920px image when they only need 375px. This wastes bandwidth and hurts Core Web Vitals, especially on slower connections.",
    sourceUrl:
      "https://nextjs.org/docs/app/api-reference/components/image#sizes",
    sourceLabel: "Next.js: Image sizes prop",
  },
  {
    id: "io-004",
    category: "image-optimization",
    difficulty: "medium",
    title: "LCP image loading strategies",
    prompt: "Which loading strategy improves LCP?",
    content: {
      type: "code",

      left: `// components/hero.tsx
import Image from "next/image";

export function Hero() {
  return (
    <div>
      <Image
        src="/hero.jpg"
        alt="Hero banner"
        fill
        sizes="100vw"
      />
    </div>
  );
  // Image lazy loads by default,
  // delaying LCP
}`,

      right: `// components/hero.tsx
import Image from "next/image";

export function Hero() {
  return (
    <div>
      <Image
        src="/hero.jpg"
        alt="Hero banner"
        fill
        sizes="100vw"
        priority
      />
    </div>
  );
  // Image eagerly loads and is preloaded,
  // improving LCP
}`,
    },

    correctSide: "right",
    explanationCorrect:
      "The `priority` prop disables lazy loading and adds a preload link tag for the image. This is critical for the Largest Contentful Paint (LCP) element, which is often a hero image. Preloading the LCP image can improve your LCP score by hundreds of milliseconds.",
    explanationWrong:
      "Without `priority`, Next.js lazy-loads the image by default. For below-the-fold images this is good, but for the hero image (which is usually the LCP element), lazy loading delays rendering until the browser scrolls or reaches the image during layout. This directly hurts your Core Web Vitals score.",
    sourceUrl:
      "https://nextjs.org/docs/app/api-reference/components/image#priority",
    sourceLabel: "Next.js: Image priority prop",
  },
  {
    id: "io-005",
    category: "image-optimization",
    difficulty: "medium",
    title: "Modern image formats",
    prompt: "Which image optimization config is better?",
    content: {
      type: "code",

      left: `// components/product-card.tsx
import Image from "next/image";

export function ProductCard({
  product,
}: {
  product: Product;
}) {
  return (
    <Image
      src={product.imageUrl}
      alt={product.name}
      width={400}
      height={300}
      unoptimized
    />
  );
}`,

      right: `// components/product-card.tsx
import Image from "next/image";

export function ProductCard({
  product,
}: {
  product: Product;
}) {
  return (
    <Image
      src={product.imageUrl}
      alt={product.name}
      width={400}
      height={300}
      quality={80}
    />
  );
  // Next.js serves WebP/AVIF automatically
  // based on browser Accept header
}`,
    },

    correctSide: "right",
    explanationCorrect:
      "Next.js automatically serves images in WebP or AVIF format when the browser supports them. These modern formats are 25-50% smaller than JPEG/PNG with similar quality. The `quality` prop controls compression level. Removing `unoptimized` lets the built-in image optimizer do its job.",
    explanationWrong:
      "The `unoptimized` prop bypasses Next.js image optimization entirely, serving the original file as-is. Users receive uncompressed PNGs or JPEGs that are often 2-5x larger than necessary. This increases page load time and bandwidth costs, and directly harms your Core Web Vitals scores.",
    sourceUrl: "https://web.dev/articles/serve-images-webp",
    sourceLabel: "web.dev: Serve images in modern formats",
  },
  {
    id: "io-006",
    category: "image-optimization",
    difficulty: "medium",
    title: "Blur placeholder for images",
    prompt: "Which image loading experience is smoother?",
    content: {
      type: "code",

      left: `// components/gallery.tsx
import Image from "next/image";

export function Gallery({
  images,
}: {
  images: GalleryImage[];
}) {
  return (
    <div className="grid grid-cols-3 gap-4">
      {images.map((img) => (
        <Image
          key={img.id}
          src={img.url}
          alt={img.alt}
          width={400}
          height={300}
        />
      ))}
    </div>
  );
  // Images pop in abruptly as they load
}`,

      right: `// components/gallery.tsx
import Image from "next/image";

export function Gallery({
  images,
}: {
  images: GalleryImage[];
}) {
  return (
    <div className="grid grid-cols-3 gap-4">
      {images.map((img) => (
        <Image
          key={img.id}
          src={img.url}
          alt={img.alt}
          width={400}
          height={300}
          placeholder="blur"
          blurDataURL={img.blurHash}
        />
      ))}
    </div>
  );
  // Smooth transition from blur to sharp
}`,
    },

    correctSide: "right",
    explanationCorrect:
      "The `placeholder='blur'` prop shows a blurred preview while the full image loads. This prevents layout shift (improving CLS scores) and provides a smoother visual experience. For remote images, you provide a base64-encoded `blurDataURL` generated at build time or from your CMS.",
    explanationWrong:
      "Without a placeholder, images appear as empty rectangles that suddenly pop into view. This causes Cumulative Layout Shift (CLS) if dimensions are not properly set, and feels jarring to users. The abrupt appearance is especially noticeable on image galleries with many items.",
    sourceUrl:
      "https://nextjs.org/docs/app/api-reference/components/image#placeholder",
    sourceLabel: "Next.js: Image placeholder",
  },
  {
    id: "io-007",
    category: "image-optimization",
    difficulty: "hard",
    title: "Art direction with picture element",
    prompt: "Which approach serves better crops per device?",
    content: {
      type: "code",

      lang: "html",

      left: `// components/hero.tsx
import Image from "next/image";

export function Hero() {
  return (
    <Image
      src="/hero-desktop.jpg"
      alt="Product showcase"
      width={1920}
      height={600}
      sizes="100vw"
      priority
    />
  );
  // Same wide landscape crop on mobile
  // Important content gets tiny
}`,

      right: `// components/hero.tsx
export function Hero() {
  return (
    <picture>
      <source
        media="(min-width: 768px)"
        srcSet="/hero-desktop.jpg"
        width={1920}
        height={600}
      />
      <img
        src="/hero-mobile.jpg"
        alt="Product showcase"
        width={750}
        height={750}
        style={{ width: "100%", height: "auto" }}
        fetchPriority="high"
      />
    </picture>
  );
  // Mobile gets a square crop focused
  // on the product
}`,
    },

    correctSide: "right",
    explanationCorrect:
      "Art direction uses the `<picture>` element to serve different image crops for different screen sizes. A wide landscape hero on desktop can be replaced with a tighter square crop on mobile that keeps the important subject visible. This is different from responsive sizing, which just changes resolution.",
    explanationWrong:
      "Serving a wide 1920x600 landscape image on mobile squeezes the content into a tiny strip. The main subject becomes too small to see clearly. Art direction solves this by providing a differently composed image for mobile, not just a smaller version of the same crop.",
    sourceUrl:
      "https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Structuring_content/HTML_images#art_direction",
    sourceLabel: "MDN: Art direction",
  },
  {
    id: "io-008",
    category: "image-optimization",
    difficulty: "easy",
    title: "Lazy loading below-fold images",
    prompt: "Which loading strategy saves more bandwidth?",
    content: {
      type: "code",

      left: `// components/testimonials.tsx
import Image from "next/image";

export function Testimonials({
  items,
}: {
  items: Testimonial[];
}) {
  return (
    <section>
      {items.map((t) => (
        <div key={t.id}>
          <Image
            src={t.avatarUrl}
            alt={t.name}
            width={64}
            height={64}
            priority
          />
          <p>{t.quote}</p>
        </div>
      ))}
    </section>
  );
  // All avatars are preloaded even though
  // they are far below the fold
}`,

      right: `// components/testimonials.tsx
import Image from "next/image";

export function Testimonials({
  items,
}: {
  items: Testimonial[];
}) {
  return (
    <section>
      {items.map((t) => (
        <div key={t.id}>
          <Image
            src={t.avatarUrl}
            alt={t.name}
            width={64}
            height={64}
            loading="lazy"
          />
          <p>{t.quote}</p>
        </div>
      ))}
    </section>
  );
  // Avatars load only when the section
  // scrolls into view
}`,
    },

    correctSide: "right",
    explanationCorrect:
      "Images below the fold should use lazy loading (which is the default for next/image). This defers loading until the image is about to enter the viewport. Only the LCP image should use `priority`. Lazy loading reduces initial page weight and speeds up the first meaningful paint.",
    explanationWrong:
      "Adding `priority` to every image defeats the purpose of lazy loading. The browser preloads all images immediately, even those the user may never scroll to. This wastes bandwidth, slows down the initial page load, and can actually hurt your LCP score by competing with the real LCP element.",
    sourceUrl: "https://web.dev/articles/browser-level-image-lazy-loading",
    sourceLabel: "web.dev: Browser-level lazy loading",
  },
];
