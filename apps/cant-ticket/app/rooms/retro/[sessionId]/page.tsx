import type { Metadata } from "next";
import { Suspense } from "react";
import Box from "@mui/material/Box";
import { MeshGradient } from "@cant/shared/components";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { RetroRoom } from "@/components/retro/retro-room";

export const metadata: Metadata = {
  title: "Retro session",
  robots: { index: false, follow: false },
};

async function RoomSection({
  params,
}: {
  params: Promise<{ sessionId: string }>;
}) {
  const { sessionId } = await params;
  return <RetroRoom sessionId={sessionId} />;
}

export default function RetroSessionPage({
  params,
}: {
  params: Promise<{ sessionId: string }>;
}) {
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
      <Box
        component="section"
        sx={{ flex: 1, position: "relative", zIndex: 1 }}
      >
        <Suspense fallback={null}>
          <RoomSection params={params} />
        </Suspense>
      </Box>
      <SiteFooter />
    </Box>
  );
}
