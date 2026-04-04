import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import { redirect } from "next/navigation";
import {
  getAssessmentById,
  getCategoriesByAssessment,
} from "@/lib/assessments";
import { getCandidateSession } from "@/lib/candidate-sessions";
import { getAssessmentChallenges } from "@/lib/assessment-challenges";
import { type AppSlug, APP_CATALOG } from "@cant/shared/lib/app-catalog";
import { getHighlighter, highlightDual } from "@cant/shared/lib/shiki";
import { buildContentMap } from "@cant/shared/lib/content-map";
import { ChallengePlayer } from "./challenge-player";

/**
 * Build a slug-to-label map for every category referenced by the assessment.
 */
function buildCategoryLabels(
  categories: { appSlug: string; categorySlug: string }[],
): Record<string, string> {
  const labels: Record<string, string> = {};
  for (const cat of categories) {
    const entry = APP_CATALOG[cat.appSlug as AppSlug];
    const meta = entry.categories.find((c) => c.slug === cat.categorySlug);
    if (meta) {
      labels[cat.categorySlug] = meta.label;
    }
  }
  return labels;
}

export default async function PlayPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ session?: string }>;
}) {
  const { id } = await params;
  const { session: sessionId } = await searchParams;

  if (!sessionId) redirect(`/s/${id}`);

  const session = getCandidateSession(sessionId);
  if (session?.assessmentId !== id) redirect(`/s/${id}`);

  if (session.status === "completed") {
    redirect(`/s/${id}/done?session=${sessionId}`);
  }

  const assessment = getAssessmentById(id);
  if (assessment?.status !== "active") {
    return (
      <Container maxWidth="sm" sx={{ py: 8, textAlign: "center" }}>
        <Typography variant="h5" fontWeight={700}>
          Assessment not available
        </Typography>
      </Container>
    );
  }

  const categories = getCategoriesByAssessment(id);
  const challenges = await getAssessmentChallenges(
    categories,
    session.seed,
    assessment.questionCount,
  );

  // Pre-highlight code challenges with Shiki
  const highlighter = await getHighlighter();
  const contentMap = buildContentMap(challenges, highlighter, highlightDual);

  // Build category labels from the app catalog
  const categoryLabels = buildCategoryLabels(categories);

  return (
    <ChallengePlayer
      sessionId={sessionId}
      assessmentTitle={assessment.title}
      challenges={challenges}
      contentMap={contentMap}
      categoryLabels={categoryLabels}
      seed={session.seed}
      timeLimitSeconds={assessment.timeLimitSeconds}
      startedAt={session.startedAt}
    />
  );
}
