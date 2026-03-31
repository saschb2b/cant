import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";

const STEPS = [
  {
    number: "01",
    title: "See two options",
    description:
      "Every challenge shows two approaches side by side. Real code, real patterns, real decisions you face at work.",
  },
  {
    number: "02",
    title: "Pick the better one",
    description:
      "No trick questions. One side is genuinely better. Trust your gut, then commit to a choice.",
  },
  {
    number: "03",
    title: "Learn why",
    description:
      "Right or wrong, you get a clear explanation with links to the official docs. That's where the learning happens.",
  },
];

export function HowItWorks() {
  return (
    <Container maxWidth="lg" sx={{ py: { xs: 8, md: 14 } }}>
      <Typography
        variant="overline"
        component="h2"
        color="text.disabled"
        sx={{
          display: "block",
          textAlign: "center",
          mb: { xs: 5, md: 8 },
          letterSpacing: "0.1em",
        }}
      >
        How it works
      </Typography>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" },
          gap: { xs: 6, md: 8 },
        }}
      >
        {STEPS.map((step) => (
          <Box key={step.number} sx={{ textAlign: "center" }}>
            <Typography
              fontFamily="var(--font-geist-mono), monospace"
              fontWeight={700}
              color="secondary"
              sx={{
                fontSize: "0.75rem",
                letterSpacing: "0.05em",
                mb: 1.5,
                opacity: 0.7,
              }}
            >
              {step.number}
            </Typography>
            <Typography
              variant="h5"
              component="h3"
              fontWeight={700}
              sx={{ mb: 1.5, fontSize: { xs: "1.25rem", md: "1.4rem" } }}
            >
              {step.title}
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{
                lineHeight: 1.8,
                maxWidth: 320,
                mx: "auto",
              }}
            >
              {step.description}
            </Typography>
          </Box>
        ))}
      </Box>
    </Container>
  );
}
