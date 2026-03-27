import type { ReactNode } from "react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { LearnSidebar } from "@/components/learn-sidebar";
import { LearnMobileNav } from "@/components/learn-mobile-nav";

export default function LearnLayout({ children }: { children: ReactNode }) {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        position: "relative",
      }}
    >
      {/* Mesh gradient background */}
      <Box
        sx={{
          position: "fixed",
          inset: 0,
          pointerEvents: "none",
          zIndex: 0,
          background: [
            "radial-gradient(ellipse 80% 60% at 10% 20%, rgba(var(--mui-palette-primary-mainChannel) / 0.04) 0%, transparent 100%)",
            "radial-gradient(ellipse 60% 50% at 85% 75%, rgba(var(--mui-palette-primary-mainChannel) / 0.03) 0%, transparent 100%)",
          ].join(", "),
        }}
      />

      <SiteHeader />

      <Container
        maxWidth="lg"
        sx={{ position: "relative", zIndex: 1, flex: 1 }}
      >
        <Box
          sx={{
            display: "flex",
            gap: { md: 4 },
          }}
        >
          <LearnSidebar />
          <Box
            component="main"
            sx={{
              flex: 1,
              minWidth: 0,
              py: { xs: 4, md: 5 },
            }}
          >
            <LearnMobileNav />
            {children}
          </Box>
        </Box>
      </Container>

      <SiteFooter />
    </Box>
  );
}
