import { notFound } from "next/navigation";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { getSession } from "@/lib/auth-session";
import { getCourseById } from "@/lib/courses";
import { CourseActions } from "./course-actions";

const STATUS_COLOR: Record<string, "default" | "success" | "warning"> = {
  draft: "default",
  active: "success",
  archived: "warning",
};

export default async function CourseDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await getSession();
  const course = getCourseById(id);

  if (!course || course.userId !== session!.user.id) {
    notFound();
  }

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
              {course.title}
            </Typography>
            <Chip
              label={course.status}
              size="small"
              color={STATUS_COLOR[course.status]}
              sx={{ textTransform: "capitalize" }}
            />
          </Stack>
          {course.description && (
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mt: 1, lineHeight: 1.7 }}
            >
              {course.description}
            </Typography>
          )}
          <Typography
            variant="caption"
            color="text.disabled"
            fontFamily="var(--font-geist-mono), monospace"
            sx={{ mt: 1.5, display: "block" }}
          >
            Created{" "}
            {new Date(course.createdAt).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </Typography>
        </Box>
        <CourseActions courseId={course.id} status={course.status} />
      </Stack>

      <Box
        sx={{
          py: { xs: 8, md: 12 },
          textAlign: "center",
          border: 1,
          borderColor: "divider",
          borderRadius: 3,
          borderStyle: "dashed",
        }}
      >
        <Typography variant="h6" fontWeight={700} gutterBottom>
          No challenges configured
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ maxWidth: 360, mx: "auto" }}
        >
          The course builder will let you pick apps, categories, and configure
          parameters. Coming in the next milestone.
        </Typography>
      </Box>
    </Stack>
  );
}
