import type { BaseChallenge } from "../../game/types";

export const responsiveImageChallenges: BaseChallenge[] = [
  {
    id: "ri-001",
    category: "responsive-images",
    difficulty: "easy",
    title: "Preventing layout shift with aspect ratio",
    prompt: "Which image tag prevents layout shift?",
    content: {
      type: "code",

      left: `<img
  src="/hero.jpg"
  alt="Hero image"
  style={{ width: "100%", height: "auto" }}
/>`,

      right: `<img
  src="/hero.jpg"
  alt="Hero image"
  width={1200}
  height={630}
  style={{ width: "100%", height: "auto" }}
/>`,
    },

    correctSide: "right",
    explanationCorrect:
      "Setting `width` and `height` attributes lets the browser calculate the aspect ratio and reserve space before the image loads. Combined with `width: 100%` and `height: auto`, the image scales responsively while preventing Cumulative Layout Shift (CLS).",
    explanationWrong:
      "Without dimensions, the browser doesn't know how tall the image will be until it downloads. The page content shifts downward when the image loads, causing a poor CLS score and a jarring user experience.",
    sourceUrl:
      "https://web.dev/articles/optimize-cls#images-without-dimensions",
    sourceLabel: "web.dev: Optimize CLS",
  },
  {
    id: "ri-002",
    category: "responsive-images",
    difficulty: "easy",
    title: "Native img vs Next.js image component",
    prompt: "Which serves optimized images automatically?",
    content: {
      type: "code",

      left: `<img
  src="/product.jpg"
  alt="Product"
  width={800}
  height={600}
/>`,

      right: `import Image from "next/image";

<Image
  src="/product.jpg"
  alt="Product"
  width={800}
  height={600}
  sizes="(max-width: 768px) 100vw, 50vw"
/>`,
    },

    correctSide: "right",
    explanationCorrect:
      "Next.js `Image` automatically generates `srcSet` with multiple resolutions, serves WebP/AVIF, lazy-loads by default, and prevents layout shift. The `sizes` prop tells the browser how wide the image will be at each viewport, so it downloads the right size.",
    explanationWrong:
      "A plain `<img>` serves the same 800px image to every device. A mobile user downloads 4x more pixels than needed. No lazy loading, no modern format negotiation, no srcSet. `next/image` handles all of this.",
    sourceUrl: "https://nextjs.org/docs/app/api-reference/components/image",
    sourceLabel: "Next.js: Image component",
  },
  {
    id: "ri-003",
    category: "responsive-images",
    difficulty: "medium",
    title: "Art direction with picture element",
    prompt: "Which serves different crops per screen size?",
    content: {
      type: "code",

      left: `// Same crop for all screen sizes
<Image
  src="/hero-wide.jpg"
  alt="Team photo"
  width={1600}
  height={600}
  sizes="100vw"
/>`,

      right: `<picture>
  <source
    media="(max-width: 640px)"
    srcSet="/hero-portrait.jpg"
    width={640}
    height={800}
  />
  <source
    media="(max-width: 1024px)"
    srcSet="/hero-square.jpg"
    width={1024}
    height={1024}
  />
  <img
    src="/hero-wide.jpg"
    alt="Team photo"
    width={1600}
    height={600}
    style={{ width: "100%", height: "auto" }}
  />
</picture>`,
    },

    correctSide: "right",
    explanationCorrect:
      "Art direction uses `<picture>` to serve different crops for different screens. A wide panoramic hero on desktop becomes a tall portrait crop on mobile, keeping the subject visible. `srcSet` alone only changes resolution, not composition.",
    explanationWrong:
      "A 1600x600 panoramic image on a 375px phone becomes a tiny strip where you can't see the subject. Art direction means changing the crop/composition, not just the resolution. Use `<picture>` when the image needs different framing at different sizes.",
    sourceUrl:
      "https://developer.mozilla.org/en-US/docs/Web/HTML/Guides/Responsive_images#art_direction",
    sourceLabel: "MDN: Art direction",
  },
  {
    id: "ri-004",
    category: "responsive-images",
    difficulty: "medium",
    title: "Correct sizes attribute",
    prompt: "Which sizes attribute saves bandwidth?",
    content: {
      type: "code",

      left: `<Image
  src="/card.jpg"
  alt="Card image"
  width={400}
  height={300}
  sizes="100vw"
/>

{/* Image is actually in a 3-column grid */}`,

      right: `<Image
  src="/card.jpg"
  alt="Card image"
  width={400}
  height={300}
  sizes="(max-width: 640px) 100vw,
         (max-width: 1024px) 50vw,
         33vw"
/>`,
    },

    correctSide: "right",
    explanationCorrect:
      "The `sizes` attribute tells the browser how wide the image will display at each viewport width *before* CSS loads. With `100vw`, a card in a 3-column grid triggers downloading a full-width image. Accurate sizes lets the browser pick the right resolution from the srcSet.",
    explanationWrong:
      '`sizes="100vw"` tells the browser this image fills the viewport. But in a 3-column grid, each image is only ~33% of the viewport. The browser downloads a 1440px-wide image when a 480px-wide one would suffice, wasting 3x the bandwidth.',
    sourceUrl:
      "https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/img#sizes",
    sourceLabel: "MDN: img sizes attribute",
  },
  {
    id: "ri-005",
    category: "responsive-images",
    difficulty: "hard",
    title: "Responsive background images",
    prompt: "Which serves appropriate background images?",
    content: {
      type: "code",

      lang: "css",

      left: `.hero {
  background-image: url("/hero-4k.jpg");
  background-size: cover;
  background-position: center;
  min-height: 60vh;
}`,

      right: `.hero {
  background-image: url("/hero-640.jpg");
  background-size: cover;
  background-position: center;
  min-height: 60vh;
}

@media (min-width: 640px) {
  .hero {
    background-image: url("/hero-1024.jpg");
  }
}

@media (min-width: 1024px) {
  .hero {
    background-image:
      image-set(
        url("/hero-1920.avif") type("image/avif"),
        url("/hero-1920.webp") type("image/webp"),
        url("/hero-1920.jpg") type("image/jpeg")
      );
  }
}`,
    },

    correctSide: "right",
    explanationCorrect:
      "Background images can't use `srcSet`, so media queries swap resolution manually. `image-set()` provides format negotiation (AVIF > WebP > JPEG). Mobile users get a 640px image instead of a 4K one, saving up to 10x the file size.",
    explanationWrong:
      "A 4K background image on a 375px phone downloads megabytes of unnecessary pixels. Unlike `<img srcSet>`, CSS `background-image` has no built-in resolution switching, so you must use media queries to serve appropriate sizes.",
    sourceUrl:
      "https://developer.mozilla.org/en-US/docs/Web/CSS/image/image-set",
    sourceLabel: "MDN: image-set()",
  },
];
