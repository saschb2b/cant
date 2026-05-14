import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Box from "@mui/material/Box";
import {
  getHighlighter,
  highlightDual,
  buildContentMap,
} from "@cant/shared/lib";
import {
  LearnCategoryPage,
  FormattedText,
  SourceLink,
} from "@cant/shared/components";
import { challenges } from "@cant/shared/lib/challenges/cant-maintain";
import {
  CATEGORY_ORDER,
  CATEGORY_LABELS,
  CATEGORY_DESCRIPTIONS,
} from "@/lib/game/categories";
import type { ChallengeCategory, Difficulty } from "@/lib/game/types";

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
    title: `${label} — Learn`,
    description: CATEGORY_DESCRIPTIONS[category as ChallengeCategory],
  };
}

export default async function CategoryPage({ params }: PageProps) {
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
  const prevCat =
    currentIndex > 0 ? CATEGORY_ORDER[currentIndex - 1] : undefined;
  const nextCat =
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
        prevCat
          ? { href: `/learn/${prevCat}`, label: CATEGORY_LABELS[prevCat] }
          : undefined
      }
      next={
        nextCat
          ? { href: `/learn/${nextCat}`, label: CATEGORY_LABELS[nextCat] }
          : undefined
      }
      panelBg="rgba(var(--mui-palette-secondary-mainChannel) / 0.5)"
      renderExplanation={(challenge) => (
        <>
          <Box
            sx={{
              typography: "body2",
              lineHeight: 1.75,
              color: "text.primary",
            }}
          >
            <FormattedText text={challenge.explanationCorrect} />
          </Box>
          <SourceLink
            href={challenge.sourceUrl}
            label={challenge.sourceLabel}
            challengeId={challenge.id}
            category={challenge.category}
            challengeTitle={challenge.title}
            categoryLabel={
              CATEGORY_LABELS[challenge.category as ChallengeCategory]
            }
            githubUrl="https://github.com/saschb2b/cant"
          />
        </>
      )}
    />
  );
}
