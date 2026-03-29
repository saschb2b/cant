import type { Metadata } from "next";
import type { ComponentType, ReactNode } from "react";
import { notFound } from "next/navigation";
import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import { ExternalLink } from "lucide-react";
import { getHighlighter, highlightDual } from "@/lib/shiki";
import { buildContentMap } from "@cant/shared/lib";
import { LearnCategoryPage, FormattedText } from "@cant/shared/components";
import type { ContentMapEntry } from "@cant/shared/components/game";
import { visualRegistry } from "@/components/visual/registry";
import { challenges } from "@/lib/game/challenges";
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

function renderVisualContentPanel(
  entry: ContentMapEntry | undefined,
  side: "good" | "bad",
): ReactNode {
  if (entry?.type !== "visual") return null;
  const componentId =
    side === "good" ? entry.goodComponentId : entry.badComponentId;
  const Component = visualRegistry[componentId] as ComponentType | undefined;
  if (!Component) return null;
  return (
    <Box
      sx={{
        p: 2,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: 200,
      }}
    >
      <Component />
    </Box>
  );
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
      renderContentPanel={renderVisualContentPanel}
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
          <Link
            href={challenge.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            underline="hover"
            sx={{
              display: "inline-flex",
              alignItems: "center",
              gap: 0.5,
              mt: 1.5,
              typography: "caption",
              fontFamily: "var(--font-geist-mono), monospace",
              fontWeight: 500,
            }}
          >
            <ExternalLink size={12} />
            {challenge.sourceLabel}
          </Link>
        </>
      )}
    />
  );
}
