import type { BaseChallenge } from "../../game/types";

export const muiResponsiveChallenges: BaseChallenge[] = [
  {
    id: "mr-001",
    category: "mui-responsive",
    difficulty: "easy",
    title: "Responsive sx values",
    prompt: "Which is SSR-safe for responsive font size?",
    content: {
      type: "code",

      left: `<Typography
  sx={{
    fontSize: window.innerWidth < 600
      ? "1rem"
      : "1.5rem",
  }}
>
  Welcome back
</Typography>`,

      right: `<Typography
  sx={{
    fontSize: { xs: "1rem", sm: "1.5rem" },
  }}
>
  Welcome back
</Typography>`,
    },

    correctSide: "right",
    explanationCorrect:
      "MUI's `sx` prop accepts breakpoint objects that compile to CSS media queries at build time. This is SSR-safe, avoids hydration mismatches, and doesn't trigger re-renders on resize.",
    explanationWrong:
      "`window.innerWidth` is unavailable during SSR and triggers hydration errors. Even on the client, reading it in render means the value is stale until the next re-render, and there's no listener to trigger one.",
    sourceUrl:
      "https://mui.com/system/getting-started/usage/#responsive-values",
    sourceLabel: "MUI: Responsive values",
  },
  {
    id: "mr-002",
    category: "mui-responsive",
    difficulty: "easy",
    title: "Grid responsive columns",
    prompt: "Which grid adapts its columns per breakpoint?",
    content: {
      type: "code",

      left: `<Grid container spacing={2}>
  <Grid size={4}><Card /></Grid>
  <Grid size={4}><Card /></Grid>
  <Grid size={4}><Card /></Grid>
</Grid>`,

      right: `<Grid container spacing={2}>
  <Grid size={{ xs: 12, sm: 6, md: 4 }}>
    <Card />
  </Grid>
  <Grid size={{ xs: 12, sm: 6, md: 4 }}>
    <Card />
  </Grid>
  <Grid size={{ xs: 12, sm: 6, md: 4 }}>
    <Card />
  </Grid>
</Grid>`,
    },

    correctSide: "right",
    explanationCorrect:
      "Responsive `size` objects give each card the full width on mobile (12 columns), half on tablets (6), and a third on desktop (4). The layout adapts without any custom CSS or media queries.",
    explanationWrong:
      "Fixed `size={4}` forces three columns at every screen size. On a 320px phone, each card is only ~100px wide, which is far too narrow to be usable. Always provide at least an `xs` and one larger breakpoint.",
    sourceUrl: "https://mui.com/material-ui/react-grid/#responsive-values",
    sourceLabel: "MUI: Grid responsive values",
  },
  {
    id: "mr-003",
    category: "mui-responsive",
    difficulty: "medium",
    title: "Responsive Stack direction",
    prompt: "Which Stack changes direction without a hook?",
    content: {
      type: "code",

      left: `function FeatureSection() {
  const isMobile = useMediaQuery(
    theme.breakpoints.down("md"),
  );

  return (
    <Stack direction={isMobile ? "column" : "row"}>
      <FeatureCard />
      <FeatureCard />
      <FeatureCard />
    </Stack>
  );
}`,

      right: `function FeatureSection() {
  return (
    <Stack
      direction={{ xs: "column", md: "row" }}
      spacing={{ xs: 2, md: 4 }}
    >
      <FeatureCard />
      <FeatureCard />
      <FeatureCard />
    </Stack>
  );
}`,
    },

    correctSide: "right",
    explanationCorrect:
      "Stack's `direction` and `spacing` props accept breakpoint objects natively. This avoids a `useMediaQuery` hook, its SSR hydration flash, and the extra re-render when the breakpoint crosses.",
    explanationWrong:
      "`useMediaQuery` triggers a re-render on every breakpoint crossing and defaults to `false` during SSR, so server-rendered HTML always shows the desktop layout first, even on mobile. MUI's responsive props handle this in CSS.",
    sourceUrl: "https://mui.com/material-ui/react-stack/#responsive-values",
    sourceLabel: "MUI: Stack responsive values",
  },
  {
    id: "mr-004",
    category: "mui-responsive",
    difficulty: "medium",
    title: "Dialog to full-screen on mobile",
    prompt: "Which dialog adapts to small screens?",
    content: {
      type: "code",

      left: `function ConfirmDialog({ open, onClose }: Props) {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Confirm action</DialogTitle>
      <DialogContent>Are you sure?</DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained">Confirm</Button>
      </DialogActions>
    </Dialog>
  );
}`,

      right: `function ConfirmDialog({ open, onClose }: Props) {
  const fullScreen = useMediaQuery(
    (theme: Theme) => theme.breakpoints.down("sm"),
  );

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullScreen={fullScreen}
    >
      <DialogTitle>Confirm action</DialogTitle>
      <DialogContent>Are you sure?</DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained">Confirm</Button>
      </DialogActions>
    </Dialog>
  );
}`,
    },

    correctSide: "right",
    explanationCorrect:
      "On small screens, a floating dialog with backdrop can feel cramped and the close button may be hard to reach. `fullScreen` on mobile gives the dialog room to breathe and makes it feel like a native screen transition. This is one of the valid uses for `useMediaQuery` because you need a boolean prop, not a CSS value.",
    explanationWrong:
      "A small floating dialog on a 320px screen leaves almost no padding around the content. Users struggle with small touch targets and the modal feels claustrophobic. MUI's `fullScreen` prop is designed exactly for this.",
    sourceUrl:
      "https://mui.com/material-ui/react-dialog/#responsive-full-screen",
    sourceLabel: "MUI: Responsive full-screen dialog",
  },
  {
    id: "mr-005",
    category: "mui-responsive",
    difficulty: "medium",
    title: "Theme breakpoints in sx",
    prompt: "Which stays in sync with the MUI theme?",
    content: {
      type: "code",

      left: `<Box
  sx={{
    padding: "16px",
    "@media (min-width: 600px)": {
      padding: "24px",
    },
    "@media (min-width: 900px)": {
      padding: "32px",
    },
  }}
>`,

      right: `<Box
  sx={{
    p: { xs: 2, sm: 3, md: 4 },
  }}
>`,
    },

    correctSide: "right",
    explanationCorrect:
      "MUI's `sx` shorthand converts breakpoint objects to media queries using the theme's breakpoint values. `p: 2` means `16px` (2 * 8px spacing unit). It's shorter, consistent with the theme, and automatically uses the correct breakpoint values.",
    explanationWrong:
      "Hardcoding `@media` strings in `sx` bypasses MUI's theme breakpoints. If the theme's `sm` breakpoint changes from 600px to 640px, these manual queries won't update. The breakpoint object syntax stays in sync automatically.",
    sourceUrl:
      "https://mui.com/system/getting-started/usage/#responsive-values",
    sourceLabel: "MUI: Responsive values",
  },
  {
    id: "mr-006",
    category: "mui-responsive",
    difficulty: "hard",
    title: "Responsive Drawer pattern",
    prompt: "Which drawer pattern avoids a hydration flash?",
    content: {
      type: "code",

      left: `function Sidebar() {
  const [open, setOpen] = useState(false);
  const isMobile = useMediaQuery("(max-width: 899px)");

  if (!isMobile) {
    return (
      <Box sx={{ width: 240, flexShrink: 0 }}>
        <NavLinks />
      </Box>
    );
  }

  return (
    <>
      <IconButton onClick={() => setOpen(true)}>
        <MenuIcon />
      </IconButton>
      <Drawer open={open} onClose={() => setOpen(false)}>
        <NavLinks />
      </Drawer>
    </>
  );
}`,

      right: `function Sidebar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const drawer = <NavLinks />;

  return (
    <>
      <IconButton
        onClick={() => setMobileOpen(true)}
        sx={{ display: { md: "none" } }}
      >
        <MenuIcon />
      </IconButton>

      {/* Mobile: temporary drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": { width: 240 },
        }}
      >
        {drawer}
      </Drawer>

      {/* Desktop: permanent drawer */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: "none", md: "block" },
          "& .MuiDrawer-paper": { width: 240 },
        }}
      >
        {drawer}
      </Drawer>
    </>
  );
}`,
    },

    correctSide: "right",
    explanationCorrect:
      "Rendering both Drawer variants and toggling with CSS `display` avoids the hydration flash from `useMediaQuery`. The `NavLinks` component is shared, so there's no duplication of logic. MUI's `variant` prop handles the behavioral difference (overlay vs inline).",
    explanationWrong:
      "The conditional render based on `useMediaQuery` causes a flash: on mobile, the server renders the permanent sidebar, then React swaps to the hamburger+drawer after hydration. Users see the sidebar appear and vanish in a split second.",
    sourceUrl: "https://mui.com/material-ui/react-drawer/#responsive-drawer",
    sourceLabel: "MUI: Responsive drawer",
  },
];
