import { redirect } from "next/navigation";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import { getSession } from "@/lib/auth-session";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { DashboardNav } from "@/components/dashboard-nav";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  if (!session) {
    redirect("/sign-in?callbackUrl=/dashboard");
  }

  if (!session.user.role) {
    redirect("/onboarding");
  }

  if (session.user.role !== "recruiter") {
    redirect("/");
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
      <Container
        maxWidth="lg"
        component="main"
        sx={{ py: { xs: 4, md: 6 }, flex: 1 }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            gap: { xs: 3, md: 5 },
          }}
        >
          <DashboardNav />
          <Box sx={{ flex: 1, minWidth: 0 }}>{children}</Box>
        </Box>
      </Container>
      <SiteFooter />
    </Box>
  );
}
