import type { Metadata } from "next";
import { getHighlighter, highlightDual } from "@/lib/shiki";
import { buildContentMap } from "@cant/shared/lib";
import { LearnIndexPage } from "@cant/shared/components";
import { visualRegistry } from "@/components/visual/registry";
import { challenges } from "@cant/shared/lib/challenges/cant-game";
import {
  CATEGORY_ORDER,
  CATEGORY_LABELS,
  CATEGORY_DESCRIPTIONS,
  LEARNING_PATH,
} from "@/lib/learn/categories";

export const metadata: Metadata = {
  title: "Learn",
  description:
    "Learn game development patterns across 8 categories. Side-by-side naive vs robust code examples with explanations.",
};

export default async function LearnPage() {
  const highlighter = await getHighlighter();

  const previewChallenges = CATEGORY_ORDER.flatMap(
    (cat) => challenges.find((c) => c.category === cat) ?? [],
  );
  const previewContentMap = buildContentMap(
    previewChallenges,
    highlighter,
    highlightDual,
  );

  const sections = CATEGORY_ORDER.map((category) => {
    const count = challenges.filter((c) => c.category === category).length;
    const preview = previewChallenges.find((c) => c.category === category);
    const entry = preview ? previewContentMap[preview.id] : undefined;

    let sectionPreview = undefined;
    if (entry?.type === "code") {
      sectionPreview = {
        type: "code" as const,
        goodHtml: entry.goodHtml,
        badHtml: entry.badHtml,
      };
    } else if (entry?.type === "visual") {
      sectionPreview = {
        type: "visual" as const,
        goodComponentId: entry.goodComponentId,
        badComponentId: entry.badComponentId,
      };
    }

    return {
      category,
      label: CATEGORY_LABELS[category],
      description: CATEGORY_DESCRIPTIONS[category],
      count,
      sectionPreview,
    };
  });

  return (
    <LearnIndexPage
      title="Learn Game Dev Patterns"
      subtitle="Learn game development patterns across 8 categories. Side-by-side naive vs robust code examples with explanations."
      totalChallenges={challenges.length}
      totalCategories={CATEGORY_ORDER.length}
      sections={sections}
      visualRegistry={visualRegistry}
      learningPath={LEARNING_PATH.map((cat) => ({
        category: cat,
        label: CATEGORY_LABELS[cat],
      }))}
      learningPathDescription="New to game development? Follow these five categories in order."
    />
  );
}
