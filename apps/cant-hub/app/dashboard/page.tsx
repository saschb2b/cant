import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import { getSession } from "@/lib/auth-session";

export default async function DashboardPage() {
  const session = await getSession();

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Typography variant="h4" fontWeight={700} gutterBottom>
        Dashboard
      </Typography>
      <Typography variant="body1" color="text.secondary">
        Welcome back, {session!.user.name}. Your screening courses will appear
        here.
      </Typography>
      <Box
        sx={{
          mt: 4,
          p: 6,
          border: 1,
          borderColor: "divider",
          borderRadius: 1,
          textAlign: "center",
        }}
      >
        <Typography variant="body2" color="text.secondary">
          No courses yet. Create your first screening course to get started.
        </Typography>
      </Box>
    </Container>
  );
}
