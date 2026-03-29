import type { Metadata } from "next";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import { Check, X } from "lucide-react";
import { buildContentMap } from "@cant/shared/lib";
import { LearnIndexPage } from "@cant/shared/components";
import type { ContentMapEntry } from "@cant/shared/components/game";
import type { ComponentType } from "react";
import { appThemeConfig } from "@/lib/app-theme-config";
import { visualRegistry } from "@/components/visual/registry";
import { challenges } from "@/lib/learn/challenges";
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

function MoleculePreviewCard({
  name,
  formula,
}: {
  name: string;
  formula: string;
}) {
  return (
    <Box
      sx={{
        p: 2,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 0.5,
        minHeight: 80,
      }}
    >
      <Typography
        variant="body2"
        fontWeight={700}
        sx={{ textAlign: "center", color: "text.primary" }}
      >
        {name}
      </Typography>
      <Typography
        variant="caption"
        fontFamily="var(--font-geist-mono), monospace"
        sx={{
          textAlign: "center",
          color: "text.secondary",
          letterSpacing: "0.05em",
        }}
      >
        {formula}
      </Typography>
    </Box>
  );
}

function PreviewSideLabel({ side }: { side: "good" | "bad" }) {
  const isGood = side === "good";
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 0.75,
        px: 2,
        pt: 1.5,
      }}
    >
      <Box
        sx={{
          width: 16,
          height: 16,
          borderRadius: "50%",
          bgcolor: isGood
            ? "rgba(var(--mui-palette-success-mainChannel) / 0.12)"
            : "rgba(var(--mui-palette-error-mainChannel) / 0.12)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: isGood ? "success.main" : "error.main",
        }}
      >
        {isGood ? (
          <Check size={9} strokeWidth={3} />
        ) : (
          <X size={9} strokeWidth={3} />
        )}
      </Box>
      <Typography
        variant="caption"
        fontWeight={600}
        fontFamily="var(--font-geist-mono), monospace"
        color={isGood ? "success.main" : "error.main"}
      >
        {isGood
          ? appThemeConfig.labels.goodLabel
          : appThemeConfig.labels.badLabel}
      </Typography>
    </Box>
  );
}

export default function LearnPage() {
  const previewChallenges = CATEGORY_ORDER.flatMap(
    (cat) => challenges.find((c) => c.category === cat) ?? [],
  );
  const previewContentMap = buildContentMap(previewChallenges);

  const previewLookup: Record<string, ContentMapEntry | undefined> = {};
  for (const c of previewChallenges) {
    if (previewContentMap[c.id]) {
      previewLookup[c.category] = previewContentMap[c.id];
    }
  }

  const sections = CATEGORY_ORDER.map((category) => {
    const count = challenges.filter((c) => c.category === category).length;
    const entry = previewLookup[category];
    return {
      category,
      label: CATEGORY_LABELS[category],
      description: CATEGORY_DESCRIPTIONS[category],
      count,
      preview: null,
      hasPreview: entry?.type === "molecule" || entry?.type === "visual",
    };
  });

  function renderPreview(category: string) {
    const entry = previewLookup[category];
    if (!entry) return null;

    if (entry.type === "molecule") {
      return (
        <>
          <Box sx={{ flex: "1 1 50%", minWidth: 0 }}>
            <PreviewSideLabel side="bad" />
            <MoleculePreviewCard
              name={entry.badMolecule.name}
              formula={entry.badMolecule.formula}
            />
          </Box>
          <Divider sx={{ display: { sm: "none" } }} />
          <Box sx={{ flex: "1 1 50%", minWidth: 0 }}>
            <PreviewSideLabel side="good" />
            <MoleculePreviewCard
              name={entry.goodMolecule.name}
              formula={entry.goodMolecule.formula}
            />
          </Box>
        </>
      );
    }

    if (entry.type === "visual") {
      const BadComponent = visualRegistry[entry.badComponentId] as
        | ComponentType
        | undefined;
      const GoodComponent = visualRegistry[entry.goodComponentId] as
        | ComponentType
        | undefined;
      return (
        <>
          <Box sx={{ flex: "1 1 50%", minWidth: 0 }}>
            <PreviewSideLabel side="bad" />
            <Box
              sx={{
                p: 2,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                minHeight: 80,
              }}
            >
              {BadComponent ? <BadComponent /> : null}
            </Box>
          </Box>
          <Divider sx={{ display: { sm: "none" } }} />
          <Box sx={{ flex: "1 1 50%", minWidth: 0 }}>
            <PreviewSideLabel side="good" />
            <Box
              sx={{
                p: 2,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                minHeight: 80,
              }}
            >
              {GoodComponent ? <GoodComponent /> : null}
            </Box>
          </Box>
        </>
      );
    }

    return null;
  }

  return (
    <LearnIndexPage
      title="Learn Chemistry"
      subtitle="Learn chemistry concepts across 15 categories. Side-by-side molecule comparisons with explanations."
      totalChallenges={challenges.length}
      totalCategories={CATEGORY_ORDER.length}
      sections={sections}
      learningPath={LEARNING_PATH.map((cat) => ({
        category: cat,
        label: CATEGORY_LABELS[cat],
      }))}
      learningPathDescription="New to chemistry? Follow these five categories in order to build a solid foundation."
      badLabel={appThemeConfig.labels.badLabel}
      goodLabel={appThemeConfig.labels.goodLabel}
      renderPreview={renderPreview}
    />
  );
}
