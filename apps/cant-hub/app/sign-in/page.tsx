"use client";

import { useRouter } from "next/navigation";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { authClient } from "@/lib/auth-client";
import { SiteHeader } from "@/components/site-header";
import { CompassIcon } from "@/components/compass-icon";

function GitHubIcon() {
  return (
    <svg width={20} height={20} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 17.07 3.633 16.7 3.633 16.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12c0-6.63-5.37-12-12-12" />
    </svg>
  );
}

function GoogleIcon() {
  return (
    <svg width={20} height={20} viewBox="0 0 24 24">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  );
}

function GitLabIcon() {
  return (
    <svg width={20} height={20} viewBox="0 0 24 24">
      <path d="M12 23.054l4.419-13.6H7.581L12 23.054z" fill="#E24329" />
      <path d="M12 23.054L7.581 9.454H1.167L12 23.054z" fill="#FC6D26" />
      <path
        d="M1.167 9.454l-.93 2.862c-.085.26.006.545.228.703L12 23.054 1.167 9.454z"
        fill="#FCA326"
      />
      <path
        d="M1.167 9.454h6.414L4.86 1.383a.392.392 0 0 0-.746 0L1.167 9.454z"
        fill="#E24329"
      />
      <path d="M12 23.054l4.419-13.6h6.414L12 23.054z" fill="#FC6D26" />
      <path
        d="M22.833 9.454l.93 2.862c.085.26-.006.545-.228.703L12 23.054l10.833-13.6z"
        fill="#FCA326"
      />
      <path
        d="M22.833 9.454h-6.414l2.721-8.071a.392.392 0 0 1 .746 0l2.947 8.071z"
        fill="#E24329"
      />
    </svg>
  );
}

const BUTTON_SX = {
  justifyContent: "flex-start",
  px: 3,
  py: 1.5,
  borderColor: "divider",
  color: "text.primary",
  fontWeight: 500,
  "&:hover": { borderColor: "text.disabled", bgcolor: "action.hover" },
} as const;

export default function SignInPage() {
  const { data: session, isPending } = authClient.useSession();
  const router = useRouter();

  if (!isPending && session) {
    if (!session.user.role) {
      router.replace("/onboarding");
    } else if (session.user.role === "recruiter") {
      router.replace("/dashboard");
    } else {
      router.replace("/");
    }
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
          position: "relative",
          overflow: "hidden",
          "&::before": {
            content: '""',
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(ellipse at 40% 50%, rgba(212,168,67,0.12) 0%, rgba(61,139,114,0.06) 35%, transparent 65%), radial-gradient(ellipse at 65% 60%, rgba(124,58,237,0.06) 0%, transparent 50%)",
            pointerEvents: "none",
          },
        }}
      >
        <Container maxWidth="lg" sx={{ position: "relative" }}>
          <Stack
            direction={{ xs: "column", md: "row" }}
            spacing={{ xs: 6, md: 10 }}
            alignItems="center"
            sx={{ py: { xs: 8, md: 0 } }}
          >
            {/* Left: branding and message */}
            <Box
              sx={{
                flex: 1,
                textAlign: { xs: "center", md: "left" },
                order: { xs: 2, md: 1 },
              }}
            >
              <Box
                sx={{
                  display: "inline-flex",
                  mb: 3,
                  mx: { xs: "auto", md: 0 },
                }}
              >
                <CompassIcon size={48} />
              </Box>
              <Typography
                variant="h2"
                component="h1"
                fontWeight={800}
                sx={{
                  fontSize: { xs: "2rem", sm: "2.5rem", md: "3rem" },
                  lineHeight: 1.1,
                  letterSpacing: "-0.02em",
                }}
              >
                Welcome back
              </Typography>
              <Typography
                variant="body1"
                color="text.secondary"
                sx={{
                  mt: 2,
                  lineHeight: 1.7,
                  maxWidth: { md: 400 },
                  mx: { xs: "auto", md: 0 },
                }}
              >
                Sign in to manage your screening assessments, review candidates,
                and track results across the series.
              </Typography>
              <Typography
                variant="caption"
                color="text.disabled"
                fontFamily="var(--font-geist-mono), monospace"
                sx={{
                  mt: 3,
                  display: "block",
                  letterSpacing: "0.05em",
                }}
              >
                Learning content is always free.
              </Typography>
            </Box>

            {/* Right: sign-in card */}
            <Box
              sx={{
                width: { xs: "100%", sm: 400 },
                flexShrink: 0,
                order: { xs: 1, md: 2 },
              }}
            >
              <Stack
                spacing={1.5}
                sx={{
                  p: { xs: 3, sm: 4 },
                  borderRadius: 3,
                  border: 1,
                  borderColor: "divider",
                  bgcolor: "background.paper",
                }}
              >
                <Typography variant="h6" fontWeight={700} sx={{ mb: 1 }}>
                  Sign in
                </Typography>

                <Button
                  variant="outlined"
                  fullWidth
                  startIcon={<GitHubIcon />}
                  onClick={() =>
                    void authClient.signIn.social({
                      provider: "github",
                      callbackURL: "/onboarding",
                    })
                  }
                  sx={BUTTON_SX}
                >
                  Continue with GitHub
                </Button>

                <Button
                  variant="outlined"
                  fullWidth
                  startIcon={<GoogleIcon />}
                  onClick={() =>
                    void authClient.signIn.social({
                      provider: "google",
                      callbackURL: "/onboarding",
                    })
                  }
                  sx={BUTTON_SX}
                >
                  Continue with Google
                </Button>

                <Button
                  variant="outlined"
                  fullWidth
                  startIcon={<GitLabIcon />}
                  onClick={() =>
                    void authClient.signIn.social({
                      provider: "gitlab",
                      callbackURL: "/onboarding",
                    })
                  }
                  sx={BUTTON_SX}
                >
                  Continue with GitLab
                </Button>

                <Typography
                  variant="caption"
                  color="text.disabled"
                  sx={{ pt: 1, textAlign: "center" }}
                >
                  By signing in you agree to our terms of service.
                </Typography>
              </Stack>
            </Box>
          </Stack>
        </Container>
      </Box>
    </Box>
  );
}
