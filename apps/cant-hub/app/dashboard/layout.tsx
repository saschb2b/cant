import { redirect } from "next/navigation";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import { getSession } from "@/lib/auth-session";
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
    <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
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
  );
}
