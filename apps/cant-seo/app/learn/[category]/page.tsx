import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getHighlighter, highlightDual } from "@/lib/shiki";
import { buildContentMap } from "@cant/shared/lib";
import { LearnCategoryPage, LearnExplanation } from "@cant/shared/components";
import { challenges } from "@cant/shared/lib/challenges/cant-seo";
import {
  CATEGORY_ORDER,
  CATEGORY_LABELS,
  CATEGORY_DESCRIPTIONS,
} from "@/lib/learn/categories";
import type { ChallengeCategory, Difficulty } from "@/lib/learn/types";

const categorySet = new Set<string>(CATEGORY_ORDER);

interface PageProps {
  params: Promise<{ category: string }>;
}

export function generateStaticParams() {
  return CATEGORY_ORDER.map((category) => ({ category }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { category } = await params;
  if (!categorySet.has(category)) return {};
  const label = CATEGORY_LABELS[category as ChallengeCategory];
  return {
    title: `${label} - Learn`,
    description: CATEGORY_DESCRIPTIONS[category as ChallengeCategory],
  };
}

export default async function CategoryPage({ params }: PageProps) {
  "use cache";
  const { category } = await params;
  if (!categorySet.has(category)) notFound();

  const cat = category as ChallengeCategory;
  const label = CATEGORY_LABELS[cat];
  const description = CATEGORY_DESCRIPTIONS[cat];
  const difficultyOrder: Record<Difficulty, number> = {
    easy: 0,
    medium: 1,
    hard: 2,
  };
  const categoryChallenges = challenges
    .filter((c) => c.category === cat)
    .sort(
      (a, b) => difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty],
    );

  const currentIndex = CATEGORY_ORDER.indexOf(cat);
  const prev = currentIndex > 0 ? CATEGORY_ORDER[currentIndex - 1] : undefined;
  const next =
    currentIndex < CATEGORY_ORDER.length - 1
      ? CATEGORY_ORDER[currentIndex + 1]
      : undefined;

  const highlighter = await getHighlighter();
  const contentMap = buildContentMap(
    categoryChallenges,
    highlighter,
    highlightDual,
  );

  return (
    <LearnCategoryPage
      label={label}
      description={description}
      challenges={categoryChallenges}
      contentMap={contentMap}
      prev={
        prev
          ? { href: `/learn/${prev}`, label: CATEGORY_LABELS[prev] }
          : undefined
      }
      next={
        next
          ? { href: `/learn/${next}`, label: CATEGORY_LABELS[next] }
          : undefined
      }
      panelBg="background.paper"
      renderExplanation={(challenge) => (
        <LearnExplanation
          challenge={challenge}
          categoryLabel={
            CATEGORY_LABELS[challenge.category as ChallengeCategory]
          }
          githubUrl="https://github.com/saschb2b/cant"
        />
      )}
    />
  );
}
