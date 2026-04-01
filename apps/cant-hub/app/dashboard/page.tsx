import Link from "next/link";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { getSession } from "@/lib/auth-session";
import { getCoursesByUser, type Course } from "@/lib/courses";

const STATUS_COLOR: Record<string, "default" | "success" | "warning"> = {
  draft: "default",
  active: "success",
  archived: "warning",
};

function CourseCard({ course }: { course: Course }) {
  return (
    <Link
      href={`/dashboard/courses/${course.id}`}
      style={{ textDecoration: "none", color: "inherit", display: "block" }}
    >
      <Box
        sx={{
          p: { xs: 3, md: 4 },
          borderRadius: 3,
          border: 1,
          borderColor: "divider",
          transition: "border-color 0.2s, transform 0.2s",
          "&:hover": {
            borderColor: "primary.main",
            transform: "translateY(-2px)",
          },
        }}
      >
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="flex-start"
          spacing={2}
        >
          <Box sx={{ minWidth: 0 }}>
            <Typography variant="h6" fontWeight={700} lineHeight={1.2} noWrap>
              {course.title}
            </Typography>
            {course.description && (
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mt: 0.5, lineHeight: 1.7 }}
                noWrap
              >
                {course.description}
              </Typography>
            )}
          </Box>
          <Chip
            label={course.status}
            size="small"
            color={STATUS_COLOR[course.status]}
            sx={{ textTransform: "capitalize", flexShrink: 0 }}
          />
        </Stack>
        <Typography
          variant="caption"
          color="text.disabled"
          fontFamily="var(--font-geist-mono), monospace"
          sx={{ mt: 1.5, display: "block" }}
        >
          Updated{" "}
          {new Date(course.updatedAt).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </Typography>
      </Box>
    </Link>
  );
}

function EmptyState() {
  return (
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
        No courses yet
      </Typography>
      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ mb: 3, maxWidth: 360, mx: "auto" }}
      >
        Create your first screening course to start evaluating candidates across
        the series.
      </Typography>
      <Link href="/dashboard/courses/new">
        <Box
          component="span"
          sx={{
            display: "inline-block",
            bgcolor: "secondary.main",
            color: "secondary.contrastText",
            px: 4,
            py: 1.5,
            borderRadius: 1,
            fontSize: "0.95rem",
            fontWeight: 600,
            textDecoration: "none",
          }}
        >
          Create course
        </Box>
      </Link>
    </Box>
  );
}

export default async function DashboardPage() {
  const session = await getSession();
  const courses = getCoursesByUser(session!.user.id);

  return (
    <Stack spacing={{ xs: 3, md: 4 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Box>
          <Typography
            variant="h4"
            fontWeight={800}
            lineHeight={1.15}
            letterSpacing="-0.02em"
          >
            Courses
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Manage your screening courses
          </Typography>
        </Box>
        {courses.length > 0 && (
          <Link href="/dashboard/courses/new">
            <Box
              component="span"
              sx={{
                display: "inline-block",
                bgcolor: "secondary.main",
                color: "secondary.contrastText",
                px: 3,
                py: 1,
                borderRadius: 1,
                fontSize: "0.9rem",
                fontWeight: 600,
                textDecoration: "none",
              }}
            >
              New course
            </Box>
          </Link>
        )}
      </Stack>

      {courses.length === 0 ? (
        <EmptyState />
      ) : (
        <Stack spacing={2}>
          {courses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </Stack>
      )}
    </Stack>
  );
}
