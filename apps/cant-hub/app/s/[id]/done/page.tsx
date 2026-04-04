import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { redirect } from "next/navigation";
import { getAssessmentById } from "@/lib/assessments";
import {
  getCandidateSession,
  getAnswersBySession,
} from "@/lib/candidate-sessions";

export default async function DonePage({
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

  const assessment = getAssessmentById(id);
  const answers = getAnswersBySession(sessionId);
  const correctCount = answers.filter((a) => a.correct === 1).length;
  const totalAnswered = answers.length;
  const total = session.totalQuestions ?? totalAnswered;

  const startedAt = new Date(session.startedAt);
  const finishedAt = session.finishedAt
    ? new Date(session.finishedAt)
    : new Date();
  const durationMs = finishedAt.getTime() - startedAt.getTime();
  const durationMin = Math.floor(durationMs / 60000);
  const durationSec = Math.floor((durationMs % 60000) / 1000);

  return (
    <Container
      maxWidth="sm"
      sx={{ py: { xs: 8, md: 16 }, textAlign: "center" }}
    >
      <Stack spacing={4} alignItems="center">
        <Box>
          <Typography variant="h4" fontWeight={800} gutterBottom>
            Assessment complete
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Thank you, {session.candidateName}. Your results for{" "}
            <strong>{assessment?.title ?? "this assessment"}</strong> have been
            recorded.
          </Typography>
        </Box>

        <Stack direction="row" spacing={4}>
          <Box>
            <Typography
              variant="h3"
              fontWeight={800}
              fontFamily="var(--font-geist-mono), monospace"
            >
              {correctCount}/{total}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              correct answers
            </Typography>
          </Box>
          <Box>
            <Typography
              variant="h3"
              fontWeight={800}
              fontFamily="var(--font-geist-mono), monospace"
            >
              {total > 0 ? Math.round((correctCount / total) * 100) : 0}%
            </Typography>
            <Typography variant="caption" color="text.secondary">
              score
            </Typography>
          </Box>
          <Box>
            <Typography
              variant="h3"
              fontWeight={800}
              fontFamily="var(--font-geist-mono), monospace"
            >
              {durationMin}:{String(durationSec).padStart(2, "0")}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              time taken
            </Typography>
          </Box>
        </Stack>

        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
          The recruiter will review your results. You may close this page.
        </Typography>
      </Stack>
    </Container>
  );
}
