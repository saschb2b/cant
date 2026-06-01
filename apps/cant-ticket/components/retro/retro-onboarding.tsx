"use client";

import {
  useCallback,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Clipboard,
  EyeOff,
  Heart,
  Layers,
  X,
} from "lucide-react";

const STORAGE_KEY = "cant-ticket:retro:onboarded";
const SLIDES = 3;
/**
 * Time-based re-show interval. Retro norms (Prime Directive, do's, don'ts)
 * are behavioural and fade fast; mechanics are learned in one session and
 * stick. 30 days ≈ two sprints for most teams, which is enough cadence to
 * reinforce norms without being noisy. Roughly matches what tools like
 * EasyRetro do with persistent norm banners — we just trade their always-on
 * chrome for a periodic full re-show.
 */
const REMIND_INTERVAL_MS = 30 * 24 * 60 * 60 * 1000;

/**
 * Onboarding shown the first time a participant joins any retro session on
 * this browser, and re-shown if more than REMIND_INTERVAL_MS has passed
 * since the last dismissal. Three slides:
 *   1. Norman Kerth's Prime Directive — the working agreement that makes
 *      retros work.
 *   2. Do's and don'ts — the most common behavioural anti-patterns.
 *   3. A tour of the things in this room a newcomer won't intuit (hidden
 *      notes, ready check, stacking, voting, markdown export).
 *
 * Dismissal — via Skip, Got it, backdrop, ESC, or the help "?" button —
 * writes the current timestamp to localStorage so we don't bother the
 * participant again until the interval elapses.
 */
const emptySubscribe = () => () => undefined;

function readSeen(): boolean {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw === null) return false;
    const lastSeen = Number(raw);
    // Older builds stored the flag as "1"; treat anything non-numeric as a
    // fresh fire so we re-show with the new behaviour rather than blocking it.
    if (!Number.isFinite(lastSeen) || lastSeen <= 0) return false;
    return Date.now() - lastSeen < REMIND_INTERVAL_MS;
  } catch {
    return false;
  }
}

export interface RetroOnboardingProps {
  /** When true the modal is forced open regardless of localStorage. */
  forceOpen?: boolean;
  /** Called whenever the modal closes (auto-dismissal or forced). */
  onClose?: () => void;
}

export function RetroOnboarding({
  forceOpen = false,
  onClose,
}: RetroOnboardingProps) {
  const [step, setStep] = useState(0);
  const [closedLocally, setClosedLocally] = useState(false);
  // During SSR / first paint we report "seen" so the modal never flashes
  // through hydration. After hydration the client snapshot reads localStorage.
  const seen = useSyncExternalStore(emptySubscribe, readSeen, () => true);
  const open = forceOpen || (!seen && !closedLocally);

  const close = useCallback(() => {
    setClosedLocally(true);
    setStep(0);
    try {
      window.localStorage.setItem(STORAGE_KEY, String(Date.now()));
    } catch {
      // ignore
    }
    onClose?.();
  }, [onClose]);

  return (
    <Dialog
      open={open}
      onClose={close}
      maxWidth="sm"
      fullWidth
      slotProps={{ paper: { sx: { borderRadius: 3 } } }}
    >
      <DialogContent sx={{ p: 0 }}>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{ px: 3, pt: 2 }}
        >
          <Stack direction="row" spacing={0.75}>
            {Array.from({ length: SLIDES }, (_, i) => (
              <Box
                key={i}
                sx={{
                  width: i === step ? 18 : 6,
                  height: 6,
                  borderRadius: 3,
                  bgcolor: i === step ? "primary.main" : "divider",
                  transition: "width 200ms ease, background-color 200ms ease",
                }}
              />
            ))}
          </Stack>
          <Button
            size="small"
            onClick={close}
            sx={{ color: "text.secondary", fontWeight: 500 }}
          >
            Skip
          </Button>
        </Stack>

        <Box sx={{ px: { xs: 2.5, sm: 4 }, py: 3 }}>
          {step === 0 && <PrimeDirectiveSlide />}
          {step === 1 && <NormsSlide />}
          {step === 2 && <RoomTourSlide />}
        </Box>

        <Stack
          direction="row"
          spacing={1}
          justifyContent="space-between"
          alignItems="center"
          sx={{ px: 3, pb: 3 }}
        >
          <Button
            disabled={step === 0}
            onClick={() => {
              setStep(step - 1);
            }}
            startIcon={<ArrowLeft size={14} />}
            sx={{ visibility: step === 0 ? "hidden" : "visible" }}
          >
            Back
          </Button>
          {step < SLIDES - 1 ? (
            <Button
              variant="contained"
              endIcon={<ArrowRight size={14} />}
              onClick={() => {
                setStep(step + 1);
              }}
            >
              Next
            </Button>
          ) : (
            <Button
              variant="contained"
              startIcon={<Check size={14} />}
              onClick={close}
            >
              Got it
            </Button>
          )}
        </Stack>
      </DialogContent>
    </Dialog>
  );
}

function SlideHeader({ overline, title }: { overline: string; title: string }) {
  return (
    <Box sx={{ mb: 2.5 }}>
      <Typography
        variant="overline"
        color="text.secondary"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        sx={{ fontSize: "0.65rem", letterSpacing: "0.12em" }}
      >
        {overline}
      </Typography>
      <Typography variant="h5" fontWeight={700} sx={{ mt: 0.25 }}>
        {title}
      </Typography>
    </Box>
  );
}

function PrimeDirectiveSlide() {
  return (
    <Stack spacing={2}>
      <SlideHeader overline="Before we start" title="Assume good intent." />
      <Box
        component="blockquote"
        sx={{
          m: 0,
          p: 2.25,
          borderLeft: 3,
          borderColor: "primary.main",
          bgcolor: "rgba(var(--mui-palette-primary-mainChannel) / 0.06)",
          borderRadius: 1,
        }}
      >
        <Typography
          variant="body2"
          sx={{ lineHeight: 1.7, fontStyle: "italic" }}
        >
          Regardless of what we discover, we understand and truly believe that
          everyone did the best job they could, given what they knew at the
          time, their skills and abilities, the resources available, and the
          situation at hand.
        </Typography>
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ display: "block", mt: 1.25, fontStyle: "normal" }}
        >
          — Norman Kerth, Project Retrospectives
        </Typography>
      </Box>
      <Typography variant="body2" color="text.secondary">
        This is the working agreement that makes retros work. Hold it for
        everyone in the room, including yourself.
      </Typography>
    </Stack>
  );
}

interface Norm {
  text: string;
}

const DOS: Norm[] = [
  {
    text: "Be specific. “Deploy took 2h because X” beats “deploy was painful.”",
  },
  { text: "Focus on systems, not people." },
  { text: "Be candid — psych safety only works when people are honest." },
  { text: "Celebrate wins. The “Liked” column matters as much as the gripes." },
  { text: "Mark yourself ready to keep the room moving." },
];

const DONTS: Norm[] = [
  { text: "No name-and-blame." },
  { text: "Don’t relitigate — every “Lacked” should imply a path forward." },
  { text: "Don’t dominate. Leave space for quieter teammates." },
  { text: "Don’t ship twelve action items. Pick 1–3 you’ll actually do." },
  { text: "Don’t multitask. Be present." },
];

function NormItem({
  variant,
  icon,
  text,
}: {
  variant: "do" | "dont";
  icon: ReactNode;
  text: string;
}) {
  return (
    <Stack direction="row" spacing={1.25} alignItems="flex-start">
      <Box
        sx={{
          color: variant === "do" ? "success.main" : "error.main",
          mt: "3px",
          flexShrink: 0,
          display: "inline-flex",
        }}
      >
        {icon}
      </Box>
      <Typography variant="body2" sx={{ lineHeight: 1.55 }}>
        {text}
      </Typography>
    </Stack>
  );
}

function NormsSlide() {
  return (
    <Stack spacing={2.5}>
      <SlideHeader overline="Norms" title="How we run this." />
      <Box>
        <Typography
          variant="overline"
          color="success.main"
          fontFamily="var(--font-geist-mono), ui-monospace, monospace"
          sx={{
            fontSize: "0.65rem",
            letterSpacing: "0.1em",
            display: "block",
            mb: 1,
          }}
        >
          Do
        </Typography>
        <Stack spacing={0.9}>
          {DOS.map((d) => (
            <NormItem
              key={d.text}
              variant="do"
              icon={<Check size={14} strokeWidth={3} />}
              text={d.text}
            />
          ))}
        </Stack>
      </Box>
      <Box>
        <Typography
          variant="overline"
          color="error.main"
          fontFamily="var(--font-geist-mono), ui-monospace, monospace"
          sx={{
            fontSize: "0.65rem",
            letterSpacing: "0.1em",
            display: "block",
            mb: 1,
          }}
        >
          Don&rsquo;t
        </Typography>
        <Stack spacing={0.9}>
          {DONTS.map((d) => (
            <NormItem
              key={d.text}
              variant="dont"
              icon={<X size={14} strokeWidth={3} />}
              text={d.text}
            />
          ))}
        </Stack>
      </Box>
    </Stack>
  );
}

interface Tip {
  icon: ReactNode;
  title: string;
  body: string;
}

const TIPS: Tip[] = [
  {
    icon: <EyeOff size={16} />,
    title: "Notes stay hidden until reveal",
    body: "Other people only see your notes once the room reveals. Write candidly.",
  },
  {
    icon: <Check size={16} strokeWidth={2.5} />,
    title: "Mark yourself ready when you’re done",
    body: "When everyone’s ready the room auto-advances — no waiting on the clock.",
  },
  {
    icon: <Layers size={16} />,
    title: "Stack similar themes",
    body: "After reveal, drag a card onto another to merge them. The top card is the headline; you can reorder.",
  },
  {
    icon: <Heart size={16} />,
    title: "Vote with hearts",
    body: "When voting opens, like the items that matter most to you. Cards reorder by votes at the end.",
  },
  {
    icon: <Clipboard size={16} />,
    title: "Export your action items",
    body: "Action items copy as markdown — paste them into Confluence, Linear, wherever you track work.",
  },
];

function TipRow({ tip }: { tip: Tip }) {
  return (
    <Stack direction="row" spacing={1.5} alignItems="flex-start">
      <Box
        sx={{
          color: "primary.main",
          flexShrink: 0,
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          width: 30,
          height: 30,
          borderRadius: 1.25,
          bgcolor: "rgba(var(--mui-palette-primary-mainChannel) / 0.10)",
        }}
      >
        {tip.icon}
      </Box>
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography variant="body2" fontWeight={700} sx={{ lineHeight: 1.4 }}>
          {tip.title}
        </Typography>
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ display: "block", lineHeight: 1.5, mt: 0.25 }}
        >
          {tip.body}
        </Typography>
      </Box>
    </Stack>
  );
}

function RoomTourSlide() {
  return (
    <Stack spacing={2}>
      <SlideHeader
        overline="How this room works"
        title="Five things to know."
      />
      <Stack spacing={1.5}>
        {TIPS.map((t) => (
          <TipRow key={t.title} tip={t} />
        ))}
      </Stack>
    </Stack>
  );
}
