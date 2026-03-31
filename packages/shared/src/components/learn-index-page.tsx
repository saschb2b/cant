import type { ComponentType, ReactNode } from "react";
import NextLink from "next/link";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Paper from "@mui/material/Paper";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import { ArrowRight, Check, X } from "lucide-react";
import { codeBlockStyles } from "../lib/code-styles";

interface CodePreview {
  type: "code";
  goodHtml: string;
  badHtml: string;
}

interface VisualPreview {
  type: "visual";
  goodComponentId: string;
  badComponentId: string;
}

interface MoleculePreview {
  type: "molecule";
  good: { name: string; formula: string };
  bad: { name: string; formula: string };
}

type SectionPreview = CodePreview | VisualPreview | MoleculePreview;

interface LearnSection {
  category: string;
  label: string;
  description: string;
  count: number;
  /**
   * Legacy code preview data. Prefer `sectionPreview` for new code.
   */
  preview?: { goodHtml: string; badHtml: string } | null;
  /** Whether a non-code preview exists for this category (used with renderPreview). */
  hasPreview?: boolean;
  /** Typed preview data. Supports code, visual, and molecule previews natively. */
  sectionPreview?: SectionPreview | null;
}

interface LearnIndexPageProps {
  /** Page title, e.g. "Learn Responsive Design" */
  title: string;
  /** Subtitle/description below the title */
  subtitle: string;
  /** Total challenge count for the intro text */
  totalChallenges: number;
  /** Total category count for the intro text */
  totalCategories: number;
  /** Category sections with preview content */
  sections: LearnSection[];
  /** Optional "Start here" learning path. If provided, renders the learning path section. */
  learningPath?: { category: string; label: string }[];
  /** Short text for the learning path section, e.g. "New to responsive design? Follow these five categories in order." */
  learningPathDescription?: string;
  /** Label for the "bad" panel header. Defaults to "Avoid". */
  badLabel?: string;
  /** Label for the "good" panel header. Defaults to "Prefer". */
  goodLabel?: string;
  /**
   * Custom preview renderer for non-code content types (visual, molecule).
   * When provided, renders this instead of the default code preview for
   * categories where `hasPreview` is true but `preview` is null.
   * Receives the category slug and returns a ReactNode with both sides.
   */
  renderPreview?: (category: string) => ReactNode;
  /**
   * Component registry mapping componentId strings to React components.
   * Required for rendering visual previews via `sectionPreview`.
   */
  visualRegistry?: Record<string, ComponentType>;
}

function PreviewSideLabel({
  side,
  label,
}: {
  side: "good" | "bad";
  label: string;
}) {
  const isGood = side === "good";
  return (
    <Stack
      direction="row"
      alignItems="center"
      spacing={0.75}
      sx={{ px: 2, pt: 1.5 }}
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
        {label}
      </Typography>
    </Stack>
  );
}

function VisualPreviewPanel({
  preview,
  badLabel,
  goodLabel,
  visualRegistry,
}: {
  preview: VisualPreview;
  badLabel: string;
  goodLabel: string;
  visualRegistry: Record<string, ComponentType>;
}) {
  const BadComponent = visualRegistry[preview.badComponentId];
  const GoodComponent = visualRegistry[preview.goodComponentId];
  return (
    <>
      <Box sx={{ flex: "1 1 50%", minWidth: 0 }}>
        <PreviewSideLabel side="bad" label={badLabel} />
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
        <PreviewSideLabel side="good" label={goodLabel} />
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

function MoleculePreviewPanel({
  preview,
  badLabel,
  goodLabel,
}: {
  preview: MoleculePreview;
  badLabel: string;
  goodLabel: string;
}) {
  return (
    <>
      <Box sx={{ flex: "1 1 50%", minWidth: 0 }}>
        <PreviewSideLabel side="bad" label={badLabel} />
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
            {preview.bad.name}
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
            {preview.bad.formula}
          </Typography>
        </Box>
      </Box>
      <Divider sx={{ display: { sm: "none" } }} />
      <Box sx={{ flex: "1 1 50%", minWidth: 0 }}>
        <PreviewSideLabel side="good" label={goodLabel} />
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
            {preview.good.name}
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
            {preview.good.formula}
          </Typography>
        </Box>
      </Box>
    </>
  );
}

export function LearnIndexPage({
  title,
  totalChallenges,
  totalCategories,
  sections,
  learningPath,
  learningPathDescription,
  badLabel = "Avoid",
  goodLabel = "Prefer",
  renderPreview,
  visualRegistry,
}: LearnIndexPageProps) {
  return (
    <>
      <Stack spacing={1} sx={{ mb: { xs: 4, md: 5 } }}>
        <Typography variant="h4" component="h1" fontWeight={700}>
          {title}
        </Typography>
        <Typography
          variant="body1"
          color="text.secondary"
          sx={{ maxWidth: 520, lineHeight: 1.7 }}
        >
          {String(totalChallenges)} patterns across {String(totalCategories)}{" "}
          categories. Each one shows the convention, a side-by-side example, and
          why it matters.
        </Typography>
      </Stack>

      {learningPath && learningPath.length > 0 && (
        <Box sx={{ mb: { xs: 4, md: 5 } }}>
          <Typography variant="h6" fontWeight={600} sx={{ mb: 0.5 }}>
            Start here
          </Typography>
          {learningPathDescription && (
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mb: 2, maxWidth: 480, lineHeight: 1.6 }}
            >
              {learningPathDescription}
            </Typography>
          )}
          <Stack direction="row" sx={{ flexWrap: "wrap", gap: 1.5 }}>
            {learningPath.map((item, index) => (
              <NextLink
                key={item.category}
                href={`/learn/${item.category}`}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <Paper
                  elevation={0}
                  sx={{
                    border: 1,
                    borderColor: "divider",
                    px: 2,
                    py: 1.5,
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                    transition: "all 0.2s ease",
                    "&:hover": {
                      borderColor: "text.secondary",
                      transform: "translateY(-1px)",
                    },
                  }}
                >
                  <Typography
                    variant="caption"
                    fontWeight={700}
                    fontFamily="var(--font-geist-mono), monospace"
                    color="text.secondary"
                    sx={{ minWidth: 16 }}
                  >
                    {String(index + 1)}
                  </Typography>
                  <Typography variant="body2" fontWeight={600}>
                    {item.label}
                  </Typography>
                </Paper>
              </NextLink>
            ))}
          </Stack>
        </Box>
      )}

      <Stack spacing={3}>
        {sections.map((section) => {
          // Read the legacy `preview` field for backward compatibility.
          const legacyPreview = section.preview;
          return (
            <NextLink
              key={section.category}
              href={section.count > 0 ? `/learn/${section.category}` : "#"}
              style={{
                textDecoration: "none",
                color: "inherit",
                ...(section.count === 0 && { pointerEvents: "none" }),
              }}
            >
              <Paper
                elevation={0}
                sx={{
                  border: 1,
                  borderColor: "divider",
                  overflow: "hidden",
                  transition: "all 0.2s ease",
                  ...(section.count > 0 && {
                    "&:hover": {
                      borderColor: "text.secondary",
                      boxShadow: 8,
                      transform: "translateY(-2px)",
                    },
                  }),
                  ...(section.count === 0 && { opacity: 0.5 }),
                }}
              >
                <Box sx={{ px: 2.5, pt: 2.5, pb: 1.5 }}>
                  <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="space-between"
                  >
                    <Stack direction="row" alignItems="center" spacing={1.5}>
                      <Typography variant="h6" fontWeight={600}>
                        {section.label}
                      </Typography>
                      <Chip
                        label={
                          section.count > 0
                            ? `${String(section.count)} patterns`
                            : "coming soon"
                        }
                        size="small"
                        sx={{
                          height: 22,
                          fontSize: "0.7rem",
                          bgcolor: "background.paper",
                        }}
                      />
                    </Stack>
                    {section.count > 0 && (
                      <Box sx={{ color: "text.secondary", display: "flex" }}>
                        <ArrowRight size={18} />
                      </Box>
                    )}
                  </Stack>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mt: 0.75, lineHeight: 1.6 }}
                  >
                    {section.description}
                  </Typography>
                </Box>

                {(section.sectionPreview ??
                  legacyPreview ??
                  (section.hasPreview && renderPreview)) && (
                  <Stack
                    direction={{ xs: "column", sm: "row" }}
                    divider={
                      <Divider
                        orientation="vertical"
                        flexItem
                        sx={{ display: { xs: "none", sm: "block" } }}
                      />
                    }
                    sx={{
                      borderTop: 1,
                      borderColor: "divider",
                      bgcolor: "background.paper",
                    }}
                  >
                    {section.sectionPreview?.type === "visual" &&
                    visualRegistry ? (
                      <VisualPreviewPanel
                        preview={section.sectionPreview}
                        badLabel={badLabel}
                        goodLabel={goodLabel}
                        visualRegistry={visualRegistry}
                      />
                    ) : section.sectionPreview?.type === "molecule" ? (
                      <MoleculePreviewPanel
                        preview={section.sectionPreview}
                        badLabel={badLabel}
                        goodLabel={goodLabel}
                      />
                    ) : section.sectionPreview?.type === "code" ? (
                      <>
                        <Box sx={{ flex: "1 1 50%", minWidth: 0 }}>
                          <PreviewSideLabel side="bad" label={badLabel} />
                          <Box
                            sx={{
                              ...codeBlockStyles,
                              "& pre": { fontSize: "0.75rem", p: 1.5 },
                            }}
                            dangerouslySetInnerHTML={{
                              __html: section.sectionPreview.badHtml,
                            }}
                          />
                        </Box>
                        <Divider sx={{ display: { sm: "none" } }} />
                        <Box sx={{ flex: "1 1 50%", minWidth: 0 }}>
                          <PreviewSideLabel side="good" label={goodLabel} />
                          <Box
                            sx={{
                              ...codeBlockStyles,
                              "& pre": { fontSize: "0.75rem", p: 1.5 },
                            }}
                            dangerouslySetInnerHTML={{
                              __html: section.sectionPreview.goodHtml,
                            }}
                          />
                        </Box>
                      </>
                    ) : legacyPreview ? (
                      <>
                        <Box sx={{ flex: "1 1 50%", minWidth: 0 }}>
                          <PreviewSideLabel side="bad" label={badLabel} />
                          <Box
                            sx={{
                              ...codeBlockStyles,
                              "& pre": { fontSize: "0.75rem", p: 1.5 },
                            }}
                            dangerouslySetInnerHTML={{
                              __html: legacyPreview.badHtml,
                            }}
                          />
                        </Box>
                        <Divider sx={{ display: { sm: "none" } }} />
                        <Box sx={{ flex: "1 1 50%", minWidth: 0 }}>
                          <PreviewSideLabel side="good" label={goodLabel} />
                          <Box
                            sx={{
                              ...codeBlockStyles,
                              "& pre": { fontSize: "0.75rem", p: 1.5 },
                            }}
                            dangerouslySetInnerHTML={{
                              __html: legacyPreview.goodHtml,
                            }}
                          />
                        </Box>
                      </>
                    ) : (
                      renderPreview?.(section.category)
                    )}
                  </Stack>
                )}
              </Paper>
            </NextLink>
          );
        })}
      </Stack>
    </>
  );
}
