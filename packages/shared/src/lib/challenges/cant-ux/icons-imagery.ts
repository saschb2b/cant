import type { BaseChallenge } from "../../game/types";

export const iconsImageryChallenges: BaseChallenge[] = [
  {
    id: "icon-001",
    category: "icons-imagery",
    difficulty: "easy",
    title: "Icon consistency",
    prompt: "Which icon set looks more cohesive?",
    content: {
      type: "visual",
      left: { componentId: "IconMixedStyles" },
      right: { componentId: "IconConsistentStyles" },
    },
    correctSide: "right",
    explanationCorrect:
      "A consistent icon set uses the same style (all outlined or all filled), stroke weight, and visual proportions. This creates a unified look that feels intentional and professional. Users subconsciously register consistency as a signal of quality and trustworthiness.",
    explanationWrong:
      "Mixing outlined and filled icons, or varying stroke weights, creates visual discord. Some icons look heavier than others, drawing uneven attention. It signals that the interface was assembled from different sources rather than designed as a cohesive system.",
    sourceUrl: "https://m3.material.io/styles/icons/overview",
    sourceLabel: "Material Design: Icon guidelines",
  },
  {
    id: "icon-002",
    category: "icons-imagery",
    difficulty: "easy",
    title: "Meaningful imagery",
    prompt: "Which hero image communicates more?",
    content: {
      type: "visual",
      left: { componentId: "IconGenericHero" },
      right: { componentId: "IconMeaningfulHero" },
    },
    correctSide: "right",
    explanationCorrect:
      "A product illustration that shows what the tool actually does gives users an immediate visual understanding. It communicates the product's value proposition in a way that complements the headline, helping users decide if this is what they need within seconds of landing on the page.",
    explanationWrong:
      "A generic gradient or stock photo adds visual weight but communicates nothing about the product. Users have learned to ignore decorative hero images because they carry no information. The space is wasted on something that looks pretty but does not help the user understand or decide.",
    sourceUrl: "https://www.nngroup.com/articles/image-focused-design/",
    sourceLabel: "NN/G: Image-focused design",
  },
  {
    id: "icon-003",
    category: "icons-imagery",
    difficulty: "medium",
    title: "Icon ambiguity",
    prompt: "Which icon set is easier to interpret?",
    content: {
      type: "visual",
      left: { componentId: "IconAmbiguous" },
      right: { componentId: "IconRecognized" },
    },
    correctSide: "right",
    explanationCorrect:
      "Universally recognized icons like the gear (settings), bell (notifications), person (profile), and question mark (help) are immediately understood across cultures and experience levels. They leverage established conventions that users have learned from years of interacting with digital interfaces.",
    explanationWrong:
      "Abstract or novel icons force users to guess what each button does. A square-in-square, a triangle, or an X could mean many things. Without established conventions to fall back on, users must try each icon to discover its function, which wastes time and breeds frustration.",
    sourceUrl: "https://www.nngroup.com/articles/icon-usability/",
    sourceLabel: "NN/G: Icon usability",
  },
  {
    id: "icon-004",
    category: "icons-imagery",
    difficulty: "medium",
    title: "Image quality",
    prompt: "Which page looks more trustworthy?",
    content: {
      type: "visual",
      left: { componentId: "IconPoorImageQuality" },
      right: { componentId: "IconProperImageQuality" },
    },
    correctSide: "right",
    explanationCorrect:
      "Properly sized, sharp images with consistent dimensions signal attention to detail. Users associate visual polish with product quality and reliability. Clean avatar components with consistent shapes and good contrast convey professionalism even without real photos.",
    explanationWrong:
      "Stretched, pixelated, or poorly cropped images immediately undermine credibility. Users associate poor image quality with low effort and unreliability. If a team cannot get their own visuals right, users question whether the product itself will be well-maintained.",
    sourceUrl: "https://www.nngroup.com/articles/photos-as-web-content/",
    sourceLabel: "NN/G: Photos as web content",
  },
];
