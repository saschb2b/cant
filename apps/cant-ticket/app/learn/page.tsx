import type { Metadata } from "next";
import { buildContentMap } from "@cant/shared/lib";
import { LearnIndexPage } from "@cant/shared/components";
import { challenges } from "@cant/shared/lib/challenges/cant-ticket";
import { getHighlighter, highlightDual } from "@/lib/shiki";
import {
  CATEGORY_ORDER,
  CATEGORY_LABELS,
  CATEGORY_DESCRIPTIONS,
  LEARNING_PATH,
} from "@/lib/learn/categories";

export const metadata: Metadata = {
  title: "Learn",
  description:
    "Learn agile ticket craft across 15 categories. Side-by-side comparisons of stories, acceptance criteria, estimates, and splits.",
};

export default async function LearnPage() {
  const previewChallenges = CATEGORY_ORDER.flatMap(
    (cat) => challenges.find((c) => c.category === cat) ?? [],
  );
  const highlighter = await getHighlighter();
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
      title="Learn Ticket Craft"
      subtitle="Stories, acceptance criteria, estimation, splitting, and team practices. Side-by-side comparisons with explanations."
      totalChallenges={challenges.length}
      totalCategories={CATEGORY_ORDER.length}
      sections={sections}
      learningPath={LEARNING_PATH.map((cat) => ({
        category: cat,
        label: CATEGORY_LABELS[cat],
      }))}
      learningPathDescription="New to agile ticket craft? Follow these five categories in order."
    />
  );
}
