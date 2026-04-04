import type { Metadata } from "next";
import { getHighlighter, highlightDual } from "@/lib/shiki";
import { buildContentMap } from "@cant/shared/lib";
import { LearnIndexPage } from "@cant/shared/components";
import { challenges } from "@cant/shared/lib/challenges/cant-query";
import {
  CATEGORY_ORDER,
  CATEGORY_LABELS,
  CATEGORY_DESCRIPTIONS,
  LEARNING_PATH,
} from "@/lib/learn/categories";

export const metadata: Metadata = {
  title: "Learn",
  description:
    "Learn API endpoint patterns across 7 categories. Side-by-side fragile vs resilient code examples with explanations.",
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
    return {
      category,
      label: CATEGORY_LABELS[category],
      description: CATEGORY_DESCRIPTIONS[category],
      count,
      preview:
        entry?.type === "code"
          ? { goodHtml: entry.goodHtml, badHtml: entry.badHtml }
          : null,
    };
  });

  return (
    <LearnIndexPage
      title="Learn API Endpoint Patterns"
      subtitle="Learn API endpoint patterns across 7 categories. Side-by-side fragile vs resilient code examples with explanations."
      totalChallenges={challenges.length}
      totalCategories={CATEGORY_ORDER.length}
      sections={sections}
      learningPath={LEARNING_PATH.map((cat) => ({
        category: cat,
        label: CATEGORY_LABELS[cat],
      }))}
      learningPathDescription="New to API design? Follow these five categories in order."
    />
  );
}
