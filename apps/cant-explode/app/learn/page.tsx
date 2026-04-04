import type { Metadata } from "next";
import { buildContentMap } from "@cant/shared/lib";
import { LearnIndexPage } from "@cant/shared/components";
import { appThemeConfig } from "@/lib/app-theme-config";
import { visualRegistry } from "@/components/visual/registry";
import { challenges } from "@cant/shared/lib/challenges/cant-explode";
import {
  CATEGORY_ORDER,
  CATEGORY_LABELS,
  CATEGORY_DESCRIPTIONS,
  LEARNING_PATH,
} from "@/lib/learn/categories";

export const metadata: Metadata = {
  title: "Learn",
  description:
    "Learn chemistry concepts across 15 categories. Side-by-side molecule comparisons with explanations.",
};

export default function LearnPage() {
  const previewChallenges = CATEGORY_ORDER.flatMap(
    (cat) => challenges.find((c) => c.category === cat) ?? [],
  );
  const previewContentMap = buildContentMap(previewChallenges);

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
    } else if (entry?.type === "molecule") {
      sectionPreview = {
        type: "molecule" as const,
        good: {
          name: entry.goodMolecule.name,
          formula: entry.goodMolecule.formula,
        },
        bad: {
          name: entry.badMolecule.name,
          formula: entry.badMolecule.formula,
        },
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
      title="Learn Chemistry"
      subtitle="Learn chemistry concepts across 15 categories. Side-by-side molecule comparisons with explanations."
      totalChallenges={challenges.length}
      totalCategories={CATEGORY_ORDER.length}
      sections={sections}
      visualRegistry={visualRegistry}
      learningPath={LEARNING_PATH.map((cat) => ({
        category: cat,
        label: CATEGORY_LABELS[cat],
      }))}
      learningPathDescription="New to chemistry? Follow these five categories in order to build a solid foundation."
      badLabel={appThemeConfig.labels.badLabel}
      goodLabel={appThemeConfig.labels.goodLabel}
    />
  );
}
