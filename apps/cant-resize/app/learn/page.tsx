import type { Metadata } from "next";
import NextLink from "next/link";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Paper from "@mui/material/Paper";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import { ArrowRight, Check, X } from "lucide-react";
import { getHighlighter, highlightDual } from "@/lib/shiki";
import { codeBlockStyles } from "@/lib/code-styles";
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
    "Learn responsive design patterns across 16 categories. Side-by-side fragile vs resilient code examples with explanations.",
};

export default async function LearnPage() {
  const highlighter = await getHighlighter();

  const sections = CATEGORY_ORDER.map((category) => {
    const categoryChallenges = challenges.filter(
      (c) => c.category === category,
    );
    const preview = categoryChallenges[0];
    return {
      category,
      label: CATEGORY_LABELS[category],
      description: CATEGORY_DESCRIPTIONS[category],
      count: categoryChallenges.length,
      preview: preview
        ? {
            goodHtml: highlightDual(
              highlighter,
              preview.goodCode,
              preview.lang ?? "tsx",
            ),
            badHtml: highlightDual(
              highlighter,
              preview.badCode,
              preview.lang ?? "tsx",
            ),
          }
        : null,
    };
  });

  return (
    <>
      <Stack spacing={1} sx={{ mb: { xs: 4, md: 5 } }}>
        <Typography variant="h4" component="h1" fontWeight={700}>
          Learn Responsive Design
        </Typography>
        <Typography
          variant="body1"
          color="text.secondary"
          sx={{ maxWidth: 520, lineHeight: 1.7 }}
        >
          {String(challenges.length)} patterns across{" "}
          {String(CATEGORY_ORDER.length)} categories. Each one shows the
          convention, a side-by-side example, and why it matters.
        </Typography>
      </Stack>

      {/* Start here */}
      <Box sx={{ mb: { xs: 4, md: 5 } }}>
        <Typography variant="h6" fontWeight={600} sx={{ mb: 0.5 }}>
          Start here
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mb: 2, maxWidth: 480, lineHeight: 1.6 }}
        >
          New to responsive design? Follow these five categories in order.
        </Typography>
        <Stack direction="row" sx={{ flexWrap: "wrap", gap: 1.5 }}>
          {LEARNING_PATH.map((category, index) => (
            <NextLink
              key={category}
              href={`/learn/${category}`}
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
                  {CATEGORY_LABELS[category]}
                </Typography>
              </Paper>
            </NextLink>
          ))}
        </Stack>
      </Box>

      <Stack spacing={3}>
        {sections.map((section) => (
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

              {section.preview && (
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
                    bgcolor:
                      "background.paper",
                  }}
                >
                  <Box sx={{ flex: "1 1 50%", minWidth: 0 }}>
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
                          bgcolor:
                            "rgba(var(--mui-palette-error-mainChannel) / 0.12)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "error.main",
                        }}
                      >
                        <X size={9} strokeWidth={3} />
                      </Box>
                      <Typography
                        variant="caption"
                        fontWeight={600}
                        fontFamily="var(--font-geist-mono), monospace"
                        color="error.main"
                      >
                        Avoid
                      </Typography>
                    </Stack>
                    <Box
                      sx={{
                        ...codeBlockStyles,
                        "& pre": {
                          ...codeBlockStyles["& pre"],
                          fontSize: "0.75rem",
                          p: 1.5,
                        },
                      }}
                      dangerouslySetInnerHTML={{
                        __html: section.preview.badHtml,
                      }}
                    />
                  </Box>

                  <Divider sx={{ display: { sm: "none" } }} />

                  <Box sx={{ flex: "1 1 50%", minWidth: 0 }}>
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
                          bgcolor:
                            "rgba(var(--mui-palette-success-mainChannel) / 0.12)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "success.main",
                        }}
                      >
                        <Check size={9} strokeWidth={3} />
                      </Box>
                      <Typography
                        variant="caption"
                        fontWeight={600}
                        fontFamily="var(--font-geist-mono), monospace"
                        color="success.main"
                      >
                        Prefer
                      </Typography>
                    </Stack>
                    <Box
                      sx={{
                        ...codeBlockStyles,
                        "& pre": {
                          ...codeBlockStyles["& pre"],
                          fontSize: "0.75rem",
                          p: 1.5,
                        },
                      }}
                      dangerouslySetInnerHTML={{
                        __html: section.preview.goodHtml,
                      }}
                    />
                  </Box>
                </Stack>
              )}
            </Paper>
          </NextLink>
        ))}
      </Stack>
    </>
  );
}
