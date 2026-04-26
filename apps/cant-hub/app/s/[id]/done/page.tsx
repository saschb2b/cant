import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { redirect } from "next/navigation";
import { getAssessmentById } from "@/lib/assessments";
import { getCandidateSession } from "@/lib/candidate-sessions";

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

  return (
    <Container
      maxWidth="sm"
      sx={{ py: { xs: 8, md: 16 }, textAlign: "center" }}
    >
      <Stack spacing={3} alignItems="center">
        <Box>
          <Typography variant="h4" fontWeight={800} gutterBottom>
            Assessment complete
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Thank you, {session.candidateName}. Your responses for{" "}
            <strong>{assessment?.title ?? "this assessment"}</strong> have been
            submitted.
          </Typography>
        </Box>

        <Typography variant="body2" color="text.secondary">
          The recruiter will review your submission and follow up with you
          directly. You may close this page.
        </Typography>
      </Stack>
    </Container>
  );
}
