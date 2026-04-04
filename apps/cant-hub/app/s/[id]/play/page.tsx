import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import { redirect } from "next/navigation";
import {
  getAssessmentById,
  getCategoriesByAssessment,
} from "@/lib/assessments";
import { getCandidateSession } from "@/lib/candidate-sessions";
import { getAssessmentChallenges } from "@/lib/assessment-challenges";
import { ChallengePlayer } from "./challenge-player";

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
  const challenges = await getAssessmentChallenges(categories, session.seed);

  // Serialize challenges for client (only what the player needs, no correctSide)
  const clientChallenges = challenges.map((c) => ({
    id: c.id,
    title: c.title,
    prompt: c.prompt,
    category: c.category,
    difficulty: c.difficulty,
    content: c.content,
  }));

  return (
    <ChallengePlayer
      sessionId={sessionId}
      assessmentId={id}
      assessmentTitle={assessment.title}
      challenges={clientChallenges}
      timeLimitSeconds={assessment.timeLimitSeconds}
      startedAt={session.startedAt}
    />
  );
}
