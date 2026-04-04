import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import {
  getAssessmentById,
  getCategoriesByAssessment,
} from "@/lib/assessments";
import { APP_CATALOG, type AppSlug } from "@cant/shared/lib/app-catalog";
import { CandidateForm } from "./candidate-form";

export default async function SharePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const assessment = getAssessmentById(id);

  if (assessment?.status !== "active") {
    return (
      <Container
        maxWidth="sm"
        sx={{ py: { xs: 8, md: 16 }, textAlign: "center" }}
      >
        <Typography variant="h5" fontWeight={700} gutterBottom>
          Assessment not available
        </Typography>
        <Typography variant="body2" color="text.secondary">
          This assessment link is no longer active or does not exist.
        </Typography>
      </Container>
    );
  }

  const categories = getCategoriesByAssessment(id);

  // Group categories by app
  const byApp = new Map<string, string[]>();
  for (const cat of categories) {
    if (!byApp.has(cat.appSlug)) byApp.set(cat.appSlug, []);
    byApp.get(cat.appSlug)?.push(cat.categorySlug);
  }

  // Count total questions (respect assessment-level limit)
  let availableQuestions = 0;
  for (const cat of categories) {
    if (cat.questionCount != null) {
      availableQuestions += cat.questionCount;
    } else {
      const entry = APP_CATALOG[cat.appSlug as AppSlug];
      const meta = entry.categories.find((c) => c.slug === cat.categorySlug);
      availableQuestions += meta?.questionCount ?? 0;
    }
  }
  const totalQuestions =
    assessment.questionCount != null && assessment.questionCount > 0
      ? Math.min(assessment.questionCount, availableQuestions)
      : availableQuestions;

  const timeEstimate = assessment.timeLimitSeconds
    ? `${String(Math.round(assessment.timeLimitSeconds / 60))} minutes`
    : `About ${String(Math.max(1, Math.round(totalQuestions * 0.5)))} minutes`;

  return (
    <Container maxWidth="sm" sx={{ py: { xs: 6, md: 12 } }}>
      <Stack spacing={4} alignItems="center" textAlign="center">
        <Box>
          <Typography
            variant="h4"
            fontWeight={800}
            letterSpacing="-0.02em"
            gutterBottom
          >
            {assessment.title}
          </Typography>
          {assessment.description && (
            <Typography variant="body1" color="text.secondary">
              {assessment.description}
            </Typography>
          )}
        </Box>

        {/* Stats */}
        <Stack direction="row" spacing={4}>
          <Box>
            <Typography
              variant="h4"
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
              variant="h4"
              fontWeight={800}
              fontFamily="var(--font-geist-mono), monospace"
            >
              {byApp.size}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              topics
            </Typography>
          </Box>
          {assessment.timeLimitSeconds && (
            <Box>
              <Typography
                variant="h4"
                fontWeight={800}
                fontFamily="var(--font-geist-mono), monospace"
              >
                {Math.round(assessment.timeLimitSeconds / 60)}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                minutes
              </Typography>
            </Box>
          )}
        </Stack>

        {/* Topics */}
        <Box>
          <Typography
            variant="caption"
            color="text.disabled"
            fontFamily="var(--font-geist-mono), monospace"
            sx={{
              display: "block",
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              fontSize: "0.6rem",
              mb: 1.5,
            }}
          >
            Topics covered
          </Typography>
          <Stack
            direction="row"
            flexWrap="wrap"
            justifyContent="center"
            gap={1}
          >
            {Array.from(byApp.entries()).map(([appSlug, catSlugs]) => {
              const entry = APP_CATALOG[appSlug as AppSlug];
              return catSlugs.map((catSlug) => {
                const meta = entry.categories.find((c) => c.slug === catSlug);
                return (
                  <Chip
                    key={`${appSlug}-${catSlug}`}
                    label={meta?.label ?? catSlug}
                    size="small"
                    variant="outlined"
                  />
                );
              });
            })}
          </Stack>
        </Box>

        {/* Candidate sign-in form */}
        <CandidateForm assessmentId={id} timeEstimate={timeEstimate} />
      </Stack>
    </Container>
  );
}
