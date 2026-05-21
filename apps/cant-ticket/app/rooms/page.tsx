import type { Metadata } from "next";
import NextLink from "next/link";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { MeshGradient } from "@cant/shared/components";
import { ArrowRight, Spade, MessageSquare } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export const metadata: Metadata = {
  title: "Rooms",
  description:
    "Ephemeral team rooms for sprint ceremonies. Planning poker and retros, no signup, no data stored.",
};

interface Room {
  href: string;
  title: string;
  blurb: string;
  detail: string;
  icon: React.ReactNode;
}

const ROOMS: Room[] = [
  {
    href: "/rooms/poker",
    title: "Planning Poker",
    blurb: "Estimate tickets together, reveal at once.",
    detail:
      "Fibonacci deck, async-friendly, reveal verdict and distribution. Share a link, vote, move on.",
    icon: <Spade size={24} />,
  },
  {
    href: "/rooms/retro",
    title: "Sprint Retro",
    blurb: "Collect notes by template, reveal, ship action items.",
    detail:
      "4 L's, Start/Stop/Continue, Mad/Sad/Glad, Sailboat or your own columns. Hidden until reveal, copy actions as markdown.",
    icon: <MessageSquare size={24} />,
  },
];

export default function RoomsLandingPage() {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        bgcolor: "background.default",
        position: "relative",
      }}
    >
      <MeshGradient />
      <SiteHeader />

      <Container
        maxWidth="md"
        component="section"
        sx={{ py: { xs: 4, sm: 6 }, flex: 1, position: "relative", zIndex: 1 }}
      >
        <Stack spacing={4}>
          <Box>
            <Typography variant="h4" fontWeight={700} sx={{ mb: 1 }}>
              Rooms
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Live team rooms for sprint ceremonies. Pick a tool, share the
              link, get on with the meeting. Nothing is stored.
            </Typography>
          </Box>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
              gap: { xs: 2.5, sm: 3 },
            }}
          >
            {ROOMS.map((room) => (
              <NextLink
                key={room.href}
                href={room.href}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <Box
                  sx={{
                    height: "100%",
                    p: { xs: 3, sm: 3.5 },
                    border: 1,
                    borderColor: "divider",
                    borderRadius: 2,
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                    transition: "all 0.2s ease",
                    bgcolor: "background.paper",
                    "&:hover": {
                      borderColor: "primary.main",
                      transform: "translateY(-2px)",
                      boxShadow: 2,
                    },
                  }}
                >
                  <Stack direction="row" spacing={1.5} alignItems="center">
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: 1.5,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        bgcolor:
                          "rgba(var(--mui-palette-primary-mainChannel) / 0.1)",
                        color: "primary.main",
                      }}
                    >
                      {room.icon}
                    </Box>
                    <Typography variant="h6" fontWeight={700}>
                      {room.title}
                    </Typography>
                  </Stack>
                  <Typography
                    variant="body2"
                    color="text.primary"
                    fontWeight={500}
                  >
                    {room.blurb}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ flex: 1 }}
                  >
                    {room.detail}
                  </Typography>
                  <Stack
                    direction="row"
                    spacing={0.5}
                    alignItems="center"
                    sx={{ color: "primary.main", fontWeight: 600 }}
                  >
                    <Typography variant="body2" fontWeight={600}>
                      Open
                    </Typography>
                    <ArrowRight size={14} />
                  </Stack>
                </Box>
              </NextLink>
            ))}
          </Box>

          <Typography
            variant="caption"
            color="text.disabled"
            align="center"
            sx={{ alignSelf: "center", maxWidth: 520 }}
          >
            Sessions are ephemeral. They vanish when everyone leaves or the
            server restarts. No accounts, no data stored.
          </Typography>
        </Stack>
      </Container>

      <SiteFooter />
    </Box>
  );
}
