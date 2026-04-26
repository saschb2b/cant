"use client";

import { useState, useCallback, useTransition } from "react";
import { useRouter } from "next/navigation";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import Chip from "@mui/material/Chip";
import Collapse from "@mui/material/Collapse";
import FormControlLabel from "@mui/material/FormControlLabel";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { ChevronDown, ChevronRight, Save } from "lucide-react";
import { ALL_APPS } from "@cant/shared/lib/cant-apps";
import type { CantApp } from "@cant/shared/lib/cant-apps";
import {
  APP_CATALOG,
  appNameToSlug,
  type AppSlug,
  type AppCatalogEntry,
} from "@cant/shared/lib/app-catalog";
import type { AssessmentCategory } from "@/lib/assessments";
import { saveAssessmentBuilderAction } from "@/app/dashboard/assessments/[id]/builder-actions";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface CategoryConfig {
  questionCount: number | null;
  difficulty: string | null;
}

type SelectionMap = Record<string, Record<string, CategoryConfig>>;

interface AssessmentBuilderProps {
  assessmentId: string;
  existingCategories: AssessmentCategory[];
  timeLimitSeconds: number | null;
  questionCount: number | null;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function buildInitialSelections(existing: AssessmentCategory[]): SelectionMap {
  const map: SelectionMap = {};
  for (const cat of existing) {
    const appCats = (map[cat.appSlug] ??= {});
    appCats[cat.categorySlug] = {
      questionCount: cat.questionCount,
      difficulty: cat.difficulty,
    };
  }
  return map;
}

function countTotalQuestions(selections: SelectionMap): number {
  let total = 0;
  for (const [appSlug, cats] of Object.entries(selections)) {
    const entry = APP_CATALOG[appSlug as AppSlug];
    for (const [catSlug, config] of Object.entries(cats)) {
      if (config.questionCount != null) {
        total += config.questionCount;
      } else {
        const meta = entry.categories.find((c) => c.slug === catSlug);
        total += meta?.questionCount ?? 0;
      }
    }
  }
  return total;
}

function countSelectedCategories(selections: SelectionMap): number {
  let count = 0;
  for (const cats of Object.values(selections)) {
    count += Object.keys(cats).length;
  }
  return count;
}

// ---------------------------------------------------------------------------
// App Icon (reused pattern from hub-series-grid)
// ---------------------------------------------------------------------------

function AppIcon({ app, size = 40 }: { app: CantApp; size?: number }) {
  const id = `builder-icon-${app.name.replace(/[^a-zA-Z0-9]/g, "").toLowerCase()}`;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 180 180"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      style={{ flexShrink: 0 }}
    >
      <defs>
        <linearGradient
          id={id}
          x1="0"
          y1="0"
          x2="180"
          y2="180"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor={app.colorFrom} />
          <stop offset="100%" stopColor={app.colorTo} />
        </linearGradient>
      </defs>
      <rect width="180" height="180" rx="37" fill={`url(#${id})`} />
      <g dangerouslySetInnerHTML={{ __html: app.iconSvgContent }} />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// App Card with expandable category checklist
// ---------------------------------------------------------------------------

function AppCard({
  app,
  catalog,
  appSlug,
  selected,
  onToggleCategory,
}: {
  app: CantApp;
  catalog: AppCatalogEntry;
  appSlug: AppSlug;
  selected: Record<string, CategoryConfig>;
  onToggleCategory: (
    appSlug: AppSlug,
    catSlug: string,
    checked: boolean,
  ) => void;
}) {
  const [expanded, setExpanded] = useState(Object.keys(selected).length > 0);
  const selectedCount = Object.keys(selected).length;
  const totalCount = catalog.categories.length;

  return (
    <Box
      sx={{
        borderRadius: 3,
        overflow: "hidden",
        border: 1,
        borderColor: selectedCount > 0 ? `${app.colorFrom}80` : "divider",
        background:
          selectedCount > 0
            ? `linear-gradient(135deg, ${app.colorFrom}15, ${app.colorTo}08)`
            : undefined,
        transition: "all 0.2s ease",
      }}
    >
      {/* Header */}
      <Box
        onClick={() => setExpanded(!expanded)}
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1.5,
          p: 2,
          cursor: "pointer",
          userSelect: "none",
          "&:hover": { bgcolor: "action.hover" },
        }}
      >
        <AppIcon app={app} size={36} />
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography variant="body2" fontWeight={700}>
            {app.name}
          </Typography>
          <Typography
            variant="caption"
            color="text.secondary"
            fontFamily="var(--font-geist-mono), monospace"
            sx={{ fontSize: "0.65rem" }}
          >
            {totalCount} categories
          </Typography>
        </Box>
        {selectedCount > 0 && (
          <Chip
            label={`${String(selectedCount)}/${String(totalCount)}`}
            size="small"
            sx={{
              bgcolor: `${app.colorFrom}25`,
              color: app.colorFrom,
              fontWeight: 700,
              fontFamily: "var(--font-geist-mono), monospace",
              fontSize: "0.7rem",
            }}
          />
        )}
        {expanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
      </Box>

      {/* Category checklist */}
      <Collapse in={expanded}>
        <Box sx={{ px: 2, pb: 2 }}>
          {catalog.sections.map((section) => (
            <Box key={section.label} sx={{ mb: 1.5 }}>
              <Typography
                variant="caption"
                color="text.disabled"
                fontFamily="var(--font-geist-mono), monospace"
                sx={{
                  display: "block",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  fontSize: "0.6rem",
                  mb: 0.5,
                  ml: 0.5,
                }}
              >
                {section.label}
              </Typography>
              {section.categories.map((catSlug) => {
                const meta = catalog.categories.find((c) => c.slug === catSlug);
                if (!meta) return null;
                const isChecked = catSlug in selected;
                return (
                  <FormControlLabel
                    key={catSlug}
                    sx={{
                      display: "flex",
                      mx: 0,
                      py: 0.25,
                      "&:hover": {
                        bgcolor: "action.hover",
                        borderRadius: 1,
                      },
                    }}
                    control={
                      <Checkbox
                        size="small"
                        checked={isChecked}
                        onChange={(_, checked) =>
                          onToggleCategory(appSlug, catSlug, checked)
                        }
                        sx={{
                          color: `${app.colorFrom}60`,
                          "&.Mui-checked": { color: app.colorFrom },
                        }}
                      />
                    }
                    label={
                      <Stack
                        direction="row"
                        alignItems="center"
                        spacing={1}
                        sx={{ flex: 1 }}
                      >
                        <Typography variant="body2">{meta.label}</Typography>
                        <Typography
                          variant="caption"
                          color="text.disabled"
                          fontFamily="var(--font-geist-mono), monospace"
                          sx={{ fontSize: "0.65rem" }}
                        >
                          {meta.questionCount}q
                        </Typography>
                      </Stack>
                    }
                  />
                );
              })}
            </Box>
          ))}
          {/* Select all / none */}
          <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
            <Button
              size="small"
              variant="text"
              sx={{ fontSize: "0.7rem", textTransform: "none" }}
              onClick={() => {
                for (const cat of catalog.categories) {
                  if (!(cat.slug in selected)) {
                    onToggleCategory(appSlug, cat.slug, true);
                  }
                }
              }}
            >
              Select all
            </Button>
            <Button
              size="small"
              variant="text"
              sx={{ fontSize: "0.7rem", textTransform: "none" }}
              onClick={() => {
                for (const cat of catalog.categories) {
                  if (cat.slug in selected) {
                    onToggleCategory(appSlug, cat.slug, false);
                  }
                }
              }}
            >
              Clear
            </Button>
          </Stack>
        </Box>
      </Collapse>
    </Box>
  );
}

// ---------------------------------------------------------------------------
// Main builder
// ---------------------------------------------------------------------------

export function AssessmentBuilder({
  assessmentId,
  existingCategories,
  timeLimitSeconds,
  questionCount: initialQuestionCount,
}: AssessmentBuilderProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [selections, setSelections] = useState<SelectionMap>(() =>
    buildInitialSelections(existingCategories),
  );
  const [timeLimitMinutes, setTimeLimitMinutes] = useState(
    timeLimitSeconds ? String(timeLimitSeconds / 60) : "",
  );
  const [questionCountInput, setQuestionCountInput] = useState(
    initialQuestionCount ? String(initialQuestionCount) : "",
  );

  const toggleCategory = useCallback(
    (appSlug: AppSlug, catSlug: string, checked: boolean) => {
      setSelections((prev) => {
        const next = { ...prev };
        if (checked) {
          next[appSlug] = {
            ...next[appSlug],
            [catSlug]: { questionCount: null, difficulty: null },
          };
        } else {
          const { [catSlug]: _removed, ...remaining } = next[appSlug] ?? {};
          if (Object.keys(remaining).length === 0) {
            const { [appSlug]: _dropped, ...rest } = next;
            return rest;
          }
          next[appSlug] = remaining;
        }
        return next;
      });
    },
    [],
  );

  const handleSave = () => {
    const categories = Object.entries(selections).flatMap(([appSlug, cats]) =>
      Object.entries(cats).map(([categorySlug, config]) => ({
        appSlug,
        categorySlug,
        questionCount: config.questionCount,
        difficulty: config.difficulty,
      })),
    );

    const minutes = timeLimitMinutes ? parseInt(timeLimitMinutes, 10) : null;
    const qCount = questionCountInput ? parseInt(questionCountInput, 10) : null;

    startTransition(async () => {
      await saveAssessmentBuilderAction(assessmentId, {
        timeLimitMinutes:
          minutes && !isNaN(minutes) && minutes > 0 ? minutes : null,
        questionCount: qCount && !isNaN(qCount) && qCount > 0 ? qCount : null,
        categories,
      });
      router.refresh();
    });
  };

  const totalQuestions = countTotalQuestions(selections);
  const totalCategories = countSelectedCategories(selections);

  // Build list of apps that have catalog entries
  const appsWithCatalog = ALL_APPS.map((app) => {
    const slug = appNameToSlug(app.name);
    if (!slug) return null;
    return { app, slug, catalog: APP_CATALOG[slug] };
  }).filter(Boolean) as {
    app: CantApp;
    slug: AppSlug;
    catalog: AppCatalogEntry;
  }[];

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: { xs: "1fr", lg: "1fr 300px" },
        gap: 3,
        alignItems: "start",
      }}
    >
      {/* Left: app cards */}
      <Stack spacing={2}>
        <Typography variant="subtitle2" color="text.secondary">
          Select topics for this assessment
        </Typography>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              md: "1fr 1fr",
            },
            gap: 2,
            alignItems: "start",
          }}
        >
          {appsWithCatalog.map(({ app, slug, catalog }) => (
            <AppCard
              key={slug}
              app={app}
              catalog={catalog}
              appSlug={slug}
              selected={selections[slug] ?? {}}
              onToggleCategory={toggleCategory}
            />
          ))}
        </Box>
      </Stack>

      {/* Right: summary panel */}
      <Box
        sx={{
          position: { lg: "sticky" },
          top: { lg: 24 },
          border: 1,
          borderColor: "divider",
          borderRadius: 3,
          p: 3,
        }}
      >
        <Typography variant="subtitle2" fontWeight={700} gutterBottom>
          Summary
        </Typography>

        <Stack spacing={2} sx={{ mt: 2 }}>
          {/* Stats */}
          <Stack direction="row" spacing={3}>
            <Box>
              <Typography
                variant="h5"
                fontWeight={800}
                fontFamily="var(--font-geist-mono), monospace"
              >
                {totalQuestions}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                questions
              </Typography>
            </Box>
            <Box>
              <Typography
                variant="h5"
                fontWeight={800}
                fontFamily="var(--font-geist-mono), monospace"
              >
                {totalCategories}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                categories
              </Typography>
            </Box>
          </Stack>

          {/* Selected categories breakdown */}
          {Object.entries(selections).length > 0 && (
            <Box>
              <Typography
                variant="caption"
                color="text.disabled"
                fontFamily="var(--font-geist-mono), monospace"
                sx={{
                  display: "block",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  fontSize: "0.6rem",
                  mb: 1,
                }}
              >
                Selected
              </Typography>
              <Stack spacing={0.5}>
                {Object.entries(selections).map(([appSlug, cats]) => {
                  const entry = APP_CATALOG[appSlug as AppSlug];
                  return (
                    <Box key={appSlug}>
                      <Typography
                        variant="caption"
                        fontWeight={700}
                        sx={{ fontSize: "0.7rem" }}
                      >
                        {entry.appName}
                      </Typography>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{
                          display: "block",
                          fontSize: "0.65rem",
                          ml: 1,
                        }}
                      >
                        {Object.keys(cats)
                          .map((slug) => {
                            const meta = entry.categories.find(
                              (c) => c.slug === slug,
                            );
                            return meta?.label ?? slug;
                          })
                          .join(", ")}
                      </Typography>
                    </Box>
                  );
                })}
              </Stack>
            </Box>
          )}

          {/* Question count */}
          <TextField
            label="Total questions"
            type="number"
            size="small"
            value={questionCountInput}
            onChange={(e) => setQuestionCountInput(e.target.value)}
            slotProps={{ htmlInput: { min: 1, max: totalQuestions } }}
            helperText={`Leave empty to use all ${String(totalQuestions)} questions`}
          />

          {/* Time limit */}
          <TextField
            label="Time limit (minutes)"
            type="number"
            size="small"
            value={timeLimitMinutes}
            onChange={(e) => setTimeLimitMinutes(e.target.value)}
            slotProps={{ htmlInput: { min: 1 } }}
            helperText="Leave empty for no time limit"
          />

          {/* Save button */}
          <Button
            variant="contained"
            startIcon={<Save size={16} />}
            onClick={handleSave}
            disabled={isPending}
            sx={{ textTransform: "none" }}
          >
            {isPending ? "Saving..." : "Save"}
          </Button>
        </Stack>
      </Box>
    </Box>
  );
}
