"use client";

import { useRouter } from "next/navigation";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { authClient } from "@/lib/auth-client";
import { SiteHeader } from "@/components/site-header";
import { setUserRole } from "./actions";

function RoleCard({
  title,
  description,
  onClick,
  disabled,
}: {
  title: string;
  description: string;
  onClick: () => void;
  disabled: boolean;
}) {
  return (
    <Paper
      variant="outlined"
      sx={{
        p: 3,
        cursor: disabled ? "default" : "pointer",
        opacity: disabled ? 0.6 : 1,
        transition: "border-color 0.2s, box-shadow 0.2s",
        "&:hover": disabled
          ? {}
          : {
              borderColor: "primary.main",
              boxShadow: (theme) => `0 0 0 1px ${theme.palette.primary.main}`,
            },
      }}
      onClick={disabled ? undefined : onClick}
    >
      <Typography variant="h6" fontWeight={700} gutterBottom>
        {title}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {description}
      </Typography>
    </Paper>
  );
}

export default function OnboardingPage() {
  const { data: session, isPending } = authClient.useSession();
  const router = useRouter();

  const handleRoleSelect = async (role: "developer" | "recruiter") => {
    await setUserRole(role);
    router.replace(role === "recruiter" ? "/dashboard" : "/");
  };

  if (isPending) return null;

  if (!session) {
    router.replace("/sign-in");
    return null;
  }

  if (session.user.role) {
    router.replace(session.user.role === "recruiter" ? "/dashboard" : "/");
    return null;
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        bgcolor: "background.default",
      }}
    >
      <SiteHeader />
      <Box
        sx={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Container maxWidth="sm">
          <Typography
            variant="h4"
            fontWeight={700}
            textAlign="center"
            gutterBottom
          >
            Welcome, {session.user.name}
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            textAlign="center"
            sx={{ mb: 4 }}
          >
            How will you use the platform?
          </Typography>

          <Stack spacing={2}>
            <RoleCard
              title="Developer"
              description="Take screening challenges shared by recruiters and track your results."
              onClick={() => void handleRoleSelect("developer")}
              disabled={false}
            />
            <RoleCard
              title="Recruiter"
              description="Create screening assessments from existing challenges, share them with candidates, and review results."
              onClick={() => void handleRoleSelect("recruiter")}
              disabled={false}
            />
          </Stack>
        </Container>
      </Box>
    </Box>
  );
}
