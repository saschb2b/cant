import { notFound } from "next/navigation";
import Link from "next/link";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { Users } from "lucide-react";
import { getSession } from "@/lib/auth-session";
import {
  getAssessmentById,
  getCategoriesByAssessment,
} from "@/lib/assessments";
import { AssessmentActions } from "./assessment-actions";
import { AssessmentBuilder } from "@/components/assessment-builder";

const STATUS_COLOR: Record<string, "default" | "success" | "warning"> = {
  draft: "default",
  active: "success",
  archived: "warning",
};

export default async function AssessmentDetailPage({
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

  const categories = getCategoriesByAssessment(id);

  return (
    <Stack spacing={{ xs: 3, md: 4 }}>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="flex-start"
        spacing={2}
      >
        <Box sx={{ minWidth: 0 }}>
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Typography
              variant="h4"
              fontWeight={800}
              lineHeight={1.15}
              letterSpacing="-0.02em"
              noWrap
            >
              {assessment.title}
            </Typography>
            <Chip
              label={assessment.status}
              size="small"
              color={STATUS_COLOR[assessment.status]}
              sx={{ textTransform: "capitalize" }}
            />
          </Stack>
          {assessment.description && (
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mt: 1, lineHeight: 1.7 }}
            >
              {assessment.description}
            </Typography>
          )}
          <Typography
            variant="caption"
            color="text.disabled"
            fontFamily="var(--font-geist-mono), monospace"
            sx={{ mt: 1.5, display: "block" }}
          >
            Created{" "}
            {new Date(assessment.createdAt).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </Typography>
        </Box>
        <Stack direction="row" spacing={1} alignItems="center">
          <Link href={`/dashboard/assessments/${assessment.id}/results`}>
            <Button
              size="small"
              variant="outlined"
              startIcon={<Users size={16} />}
              sx={{ flexShrink: 0 }}
            >
              View candidates
            </Button>
          </Link>
          <AssessmentActions
            assessmentId={assessment.id}
            status={assessment.status}
          />
        </Stack>
      </Stack>

      <AssessmentBuilder
        assessmentId={assessment.id}
        existingCategories={categories}
        timeLimitSeconds={assessment.timeLimitSeconds}
        questionCount={assessment.questionCount}
      />
    </Stack>
  );
}
