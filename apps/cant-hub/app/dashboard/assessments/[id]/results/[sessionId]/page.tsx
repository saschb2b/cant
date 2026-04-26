import { notFound } from "next/navigation";
import Link from "next/link";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import { ArrowLeft, Check, X } from "lucide-react";
import { getSession } from "@/lib/auth-session";
import {
  getAssessmentById,
  getCategoriesByAssessment,
} from "@/lib/assessments";
import {
  getCandidateSession,
  getAnswersBySession,
} from "@/lib/candidate-sessions";
import { getAssessmentChallenges } from "@/lib/assessment-challenges";
import { APP_CATALOG, type AppSlug } from "@cant/shared/lib/app-catalog";

const MONO_FONT = "var(--font-geist-mono), monospace";

function formatDuration(startedAt: string, finishedAt: string | null): string {
  if (!finishedAt) return "In progress";
  const ms = new Date(finishedAt).getTime() - new Date(startedAt).getTime();
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  if (minutes === 0) return `${String(seconds)}s`;
  return `${String(minutes)}m ${String(seconds)}s`;
}

function scoreColor(percentage: number): "success" | "warning" | "error" {
  if (percentage >= 70) return "success";
  if (percentage >= 40) return "warning";
  return "error";
}

function difficultyColor(
  difficulty: string,
): "success" | "warning" | "error" | "default" {
  if (difficulty === "easy") return "success";
  if (difficulty === "medium") return "warning";
  if (difficulty === "hard") return "error";
  return "default";
}

function reviewStatusLabel(status: string): {
  label: string;
  color: "default" | "success" | "error";
} {
  if (status === "proceed") return { label: "Proceed", color: "success" };
  if (status === "rejected") return { label: "Rejected", color: "error" };
  return { label: "Pending review", color: "default" };
}

function getCategoryLabel(appSlug: string, categorySlug: string): string {
  const entry = APP_CATALOG[appSlug as AppSlug] as
    | (typeof APP_CATALOG)[AppSlug]
    | undefined;
  if (!entry) return categorySlug;
  const cat = entry.categories.find((c) => c.slug === categorySlug);
  return cat?.label ?? categorySlug;
}

export default async function CandidateDetailPage({
  params,
}: {
  params: Promise<{ id: string; sessionId: string }>;
}) {
  const { id, sessionId } = await params;
  const session = await getSession();
  const assessment = getAssessmentById(id);

  if (!assessment || assessment.userId !== session?.user.id) {
    notFound();
  }

  const candidateSession = getCandidateSession(sessionId);

  if (candidateSession?.assessmentId !== id) {
    notFound();
  }

  const categories = getCategoriesByAssessment(id);
  const challenges = await getAssessmentChallenges(
    categories,
    candidateSession.seed,
  );
  const answers = getAnswersBySession(sessionId);

  // Build a lookup from challengeId to answer
  const answerMap = new Map(answers.map((a) => [a.challengeId, a]));

  // Compute overall score
  const totalQuestions = challenges.length;
  const correctCount = answers.filter((a) => a.correct === 1).length;
  const overallPercentage =
    totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;

  // Group answers by category for the breakdown
  const categoryStats = new Map<
    string,
    { appSlug: string; categorySlug: string; correct: number; total: number }
  >();

  for (const challenge of challenges) {
    // Determine the appSlug for this challenge's category
    const matchingCat = categories.find(
      (cat) => cat.categorySlug === challenge.category,
    );
    const appSlug = matchingCat?.appSlug ?? "";
    const key = `${appSlug}:${challenge.category}`;

    let stat = categoryStats.get(key);
    if (!stat) {
      stat = {
        appSlug,
        categorySlug: challenge.category,
        correct: 0,
        total: 0,
      };
      categoryStats.set(key, stat);
    }
    stat.total += 1;
    const answer = answerMap.get(challenge.id);
    if (answer?.correct === 1) {
      stat.correct += 1;
    }
  }

  const categoryBreakdown = [...categoryStats.values()];

  // Time taken
  const timeTaken = formatDuration(
    candidateSession.startedAt,
    candidateSession.finishedAt,
  );

  const reviewChip = reviewStatusLabel(candidateSession.reviewStatus);

  return (
    <Stack spacing={{ xs: 3, md: 4 }}>
      {/* ---- Header ---- */}
      <Box>
        <Link href={`/dashboard/assessments/${id}/results`}>
          <Button
            size="small"
            startIcon={<ArrowLeft size={16} />}
            sx={{ mb: 2, color: "text.secondary" }}
          >
            Back to results
          </Button>
        </Link>

        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          alignItems={{ sm: "center" }}
          justifyContent="space-between"
        >
          <Box>
            <Typography
              variant="h4"
              fontWeight={800}
              lineHeight={1.15}
              letterSpacing="-0.02em"
            >
              {candidateSession.candidateName}
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mt: 0.5, lineHeight: 1.7 }}
            >
              {candidateSession.candidateEmail}
            </Typography>
          </Box>

          <Stack direction="row" spacing={1} alignItems="center" flexShrink={0}>
            <Chip
              label={`${String(correctCount)}/${String(totalQuestions)} (${String(overallPercentage)}%)`}
              color={scoreColor(overallPercentage)}
              sx={{ fontFamily: MONO_FONT, fontWeight: 700 }}
            />
            <Chip
              label={timeTaken}
              variant="outlined"
              size="small"
              sx={{ fontFamily: MONO_FONT }}
            />
            <Chip
              label={reviewChip.label}
              color={reviewChip.color}
              variant="outlined"
              size="small"
            />
          </Stack>
        </Stack>
      </Box>

      {/* ---- Score by category ---- */}
      <Box>
        <Typography variant="h6" fontWeight={700} sx={{ mb: 1.5 }}>
          Score by category
        </Typography>
        <TableContainer component={Paper} variant="outlined">
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Category</TableCell>
                <TableCell align="right" sx={{ fontFamily: MONO_FONT }}>
                  Correct / Total
                </TableCell>
                <TableCell align="right" sx={{ fontFamily: MONO_FONT }}>
                  Percentage
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {categoryBreakdown.map((stat) => {
                const pct =
                  stat.total > 0
                    ? Math.round((stat.correct / stat.total) * 100)
                    : 0;
                return (
                  <TableRow key={`${stat.appSlug}:${stat.categorySlug}`}>
                    <TableCell>
                      {getCategoryLabel(stat.appSlug, stat.categorySlug)}
                    </TableCell>
                    <TableCell align="right" sx={{ fontFamily: MONO_FONT }}>
                      {String(stat.correct)} / {String(stat.total)}
                    </TableCell>
                    <TableCell align="right">
                      <Chip
                        label={`${String(pct)}%`}
                        size="small"
                        color={scoreColor(pct)}
                        sx={{ fontFamily: MONO_FONT, minWidth: 52 }}
                      />
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      {/* ---- Per-question breakdown ---- */}
      <Box>
        <Typography variant="h6" fontWeight={700} sx={{ mb: 1.5 }}>
          Per-question breakdown
        </Typography>
        <TableContainer component={Paper} variant="outlined">
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontFamily: MONO_FONT, width: 48 }}>
                  #
                </TableCell>
                <TableCell>Title</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Difficulty</TableCell>
                <TableCell align="center">Result</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {challenges.map((challenge, index) => {
                const answer = answerMap.get(challenge.id);
                const isCorrect = answer?.correct === 1;
                const wasAnswered = Boolean(answer);

                // Find matching category for label
                const matchingCat = categories.find(
                  (cat) => cat.categorySlug === challenge.category,
                );
                const appSlug = matchingCat?.appSlug ?? "";

                return (
                  <TableRow key={challenge.id}>
                    <TableCell sx={{ fontFamily: MONO_FONT }}>
                      {String(index + 1)}
                    </TableCell>
                    <TableCell>{challenge.title}</TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {getCategoryLabel(appSlug, challenge.category)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={challenge.difficulty}
                        size="small"
                        color={difficultyColor(challenge.difficulty)}
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell align="center">
                      {wasAnswered ? (
                        isCorrect ? (
                          <Check
                            size={18}
                            color="var(--mui-palette-success-main)"
                          />
                        ) : (
                          <X size={18} color="var(--mui-palette-error-main)" />
                        )
                      ) : (
                        <Typography variant="caption" color="text.disabled">
                          --
                        </Typography>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Stack>
  );
}
