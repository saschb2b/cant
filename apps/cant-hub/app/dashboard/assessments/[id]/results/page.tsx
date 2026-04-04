import { notFound } from "next/navigation";
import Link from "next/link";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { ArrowLeft } from "lucide-react";
import { getSession } from "@/lib/auth-session";
import { getAssessmentById } from "@/lib/assessments";
import { getSessionsByAssessment } from "@/lib/candidate-sessions";
import { CandidateTable } from "./candidate-table";

export default async function ResultsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await getSession();
  const assessment = getAssessmentById(id);

  if (!assessment || assessment.userId !== session?.user.id) {
    notFound();
  }

  const candidateSessions = getSessionsByAssessment(id);

  return (
    <Stack spacing={{ xs: 3, md: 4 }}>
      <Box>
        <Link href={`/dashboard/assessments/${id}`}>
          <Button
            size="small"
            startIcon={<ArrowLeft size={16} />}
            sx={{ mb: 2, color: "text.secondary" }}
          >
            Back to assessment
          </Button>
        </Link>
        <Stack direction="row" spacing={1.5} alignItems="center">
          <Typography
            variant="h4"
            fontWeight={800}
            lineHeight={1.15}
            letterSpacing="-0.02em"
          >
            Candidate results
          </Typography>
          <Chip
            label={`${String(candidateSessions.length)} candidate${candidateSessions.length !== 1 ? "s" : ""}`}
            size="small"
            color="default"
            sx={{ fontFamily: "var(--font-geist-mono), monospace" }}
          />
        </Stack>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mt: 1, lineHeight: 1.7 }}
        >
          {assessment.title}
        </Typography>
      </Box>

      <CandidateTable sessions={candidateSessions} assessmentId={id} />
    </Stack>
  );
}
