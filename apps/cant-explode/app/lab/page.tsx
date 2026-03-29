import Box from "@mui/material/Box";
import { SiteHeader } from "@/components/site-header";
import { Sandbox } from "@/components/lab/sandbox";

export default function LabPage() {
  return (
    <Box
      sx={{
        height: "100dvh",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      <SiteHeader />

      <Box
        component="section"
        sx={{
          flex: 1,
          minHeight: 0,
          position: "relative",
        }}
      >
        <Sandbox />
      </Box>
    </Box>
  );
}
