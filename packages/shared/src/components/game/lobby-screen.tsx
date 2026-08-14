"use client";

import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import Tooltip from "@mui/material/Tooltip";
import {
  ArrowRight,
  Hash,
  Dices,
  Flame,
  Sun,
  Calendar,
  Check,
  Gamepad2,
  Target,
  X,
} from "lucide-react";
import { useTrackEvent } from "../../lib/analytics-context";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface CategorySection {
  label: string;
  categories: string[];
}

interface HistoryEntry {
  seed: string;
  bestScore: number;
  total: number;
  bestStreak: number;
  plays: number;
  lastPlayedAt: number;
}

export type GameType = "daily" | "weekly" | "custom";

interface ProgressSummary {
  completed: number;
  total: number;
}

interface LobbyGameUtils {
  decodeSeed: (seed: string) => {
    rawSeed: string;
    excludedCategories: Set<string>;
  };
  generateSeed: () => string;
  seedFromKey: (key: string) => string;
  getTodayKey: () => string;
  getWeekKey: () => string;
  getHistory: () => HistoryEntry[];
  getEntryBySeed: (seed: string) => HistoryEntry | null;
  formatRelativeDate: (timestamp: number) => string;
  /** Completed/total over the app's challenge pool. Enables the progress tile. */
  getProgressSummary?: () => ProgressSummary;
  /** Clears the locally stored challenge progress. */
  resetProgress?: () => void;
}

// ---------------------------------------------------------------------------
// Small shared pieces
// ---------------------------------------------------------------------------

function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <Typography
      variant="caption"
      color="text.secondary"
      fontFamily="var(--font-geist-mono), monospace"
      sx={{
        fontSize: "0.63rem",
        letterSpacing: "0.05em",
        textTransform: "uppercase",
        mb: 1.5,
        display: "block",
      }}
    >
      {children}
    </Typography>
  );
}

/** Circular progress ring with centered content. */
function ProgressRing({
  pct,
  size = 88,
  children,
}: {
  pct: number;
  size?: number;
  children?: ReactNode;
}) {
  const stroke = 7;
  const half = size / 2;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  return (
    <Box
      sx={{ position: "relative", width: size, height: size, flexShrink: 0 }}
    >
      <svg width={size} height={size}>
        <circle
          cx={half}
          cy={half}
          r={radius}
          fill="none"
          stroke="var(--mui-palette-divider)"
          strokeWidth={stroke}
        />
        <circle
          cx={half}
          cy={half}
          r={radius}
          fill="none"
          stroke="var(--mui-palette-primary-main)"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference * (1 - pct / 100)}
          transform={`rotate(-90 ${String(half)} ${String(half)})`}
          style={{ transition: "stroke-dashoffset 0.6s ease" }}
        />
      </svg>
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {children}
      </Box>
    </Box>
  );
}

// ---------------------------------------------------------------------------
// Lobby config
// ---------------------------------------------------------------------------

export interface LobbyConfig {
  categorySections: CategorySection[];
  categoryLabels: Record<string, string>;
  /** Game-specific utility functions for seeds, history, and date formatting. */
  gameUtils: LobbyGameUtils;
}

interface LobbySlots {
  /** Activity graph component rendered in the overview board. */
  activityGraph: React.ComponentType;
}

interface LobbyScreenProps {
  onStart: (
    rawSeed: string,
    excludedCategories: Set<string>,
    gameType: GameType,
  ) => void;
  defaultSeed?: string;
  defaultExcluded?: Set<string>;
  config: LobbyConfig;
  /** Injected sub-components. */
  slots: LobbySlots;
  /** Optional "more topics" section rendered below the overview board. */
  crossPromoSlot?: ReactNode;
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export function LobbyScreen({
  onStart,
  defaultSeed = "",
  defaultExcluded,
  config,
  slots,
  crossPromoSlot,
}: LobbyScreenProps) {
  const trackEvent = useTrackEvent();
  const { gameUtils } = config;
  const ActivityGraphComponent = slots.activityGraph;
  const ALL_CATEGORIES = config.categorySections.flatMap((s) => s.categories);

  const defaultDecoded = defaultSeed ? gameUtils.decodeSeed(defaultSeed) : null;
  const [seedInput, setSeedInput] = useState(defaultSeed);
  const [excluded, setExcluded] = useState(
    defaultDecoded?.excludedCategories ?? defaultExcluded ?? new Set<string>(),
  );

  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [dailyResult, setDailyResult] = useState<HistoryEntry | null>(null);
  const [weeklyResult, setWeeklyResult] = useState<HistoryEntry | null>(null);
  const [progress, setProgress] = useState<ProgressSummary | null>(null);
  const [confirmReset, setConfirmReset] = useState(false);

  const dailySeed = gameUtils.seedFromKey(gameUtils.getTodayKey());
  const weeklySeed = gameUtils.seedFromKey(gameUtils.getWeekKey());

  useEffect(() => {
    setHistory(gameUtils.getHistory());
    setDailyResult(gameUtils.getEntryBySeed(dailySeed));
    setWeeklyResult(gameUtils.getEntryBySeed(weeklySeed));
    setProgress(gameUtils.getProgressSummary?.() ?? null);
  }, []);

  const handleResetProgress = () => {
    if (!confirmReset) {
      setConfirmReset(true);
      return;
    }
    trackEvent("progress-reset", { completed: progress?.completed ?? 0 });
    gameUtils.resetProgress?.();
    setProgress(gameUtils.getProgressSummary?.() ?? null);
    setConfirmReset(false);
  };

  const hasSeed = seedInput.trim().length > 0;
  const seedDecoded = hasSeed
    ? gameUtils.decodeSeed(seedInput.trim().toUpperCase())
    : null;
  const seedHasCategories = (seedDecoded?.excludedCategories.size ?? 0) > 0;
  const effectiveExcluded = hasSeed
    ? (seedDecoded?.excludedCategories ?? new Set<string>())
    : excluded;
  const enabledCount = ALL_CATEGORIES.length - effectiveExcluded.size;

  const toggleCategory = (cat: string) => {
    setExcluded((prev) => {
      const next = new Set(prev);
      if (next.has(cat)) {
        next.delete(cat);
      } else {
        if (enabledCount <= 1) return prev;
        next.add(cat);
      }
      return next;
    });
  };

  const toggleSection = (categories: string[]) => {
    setExcluded((prev) => {
      const allDisabled = categories.every((c) => prev.has(c));
      const next = new Set(prev);
      if (allDisabled) {
        for (const c of categories) next.delete(c);
      } else {
        const othersEnabled = ALL_CATEGORIES.filter(
          (c) => !prev.has(c) && !categories.includes(c),
        );
        if (othersEnabled.length === 0) return prev;
        for (const c of categories) next.add(c);
      }
      return next;
    });
  };

  const handleStart = () => {
    const trimmed = seedInput.trim().toUpperCase();
    if (trimmed) {
      const { rawSeed, excludedCategories } = gameUtils.decodeSeed(trimmed);
      trackEvent("game-started", {
        seed: trimmed,
        type: "custom",
        categories: ALL_CATEGORIES.length - excludedCategories.size,
      });
      onStart(rawSeed, excludedCategories, "custom");
    } else {
      trackEvent("game-started", {
        seed: "",
        type: "custom",
        categories: enabledCount,
      });
      onStart("", excluded, "custom");
    }
  };

  const playDaily = () => {
    trackEvent("game-started", {
      seed: dailySeed,
      type: "daily",
      categories: ALL_CATEGORIES.length,
    });
    onStart(dailySeed, new Set(), "daily");
  };

  const playWeekly = () => {
    trackEvent("game-started", {
      seed: weeklySeed,
      type: "weekly",
      categories: ALL_CATEGORIES.length,
    });
    onStart(weeklySeed, new Set(), "weekly");
  };

  const replayEntry = (entry: HistoryEntry) => {
    trackEvent("history-replayed", {
      seed: entry.seed,
      previousBestScore: entry.bestScore,
      plays: entry.plays,
    });
    const { rawSeed, excludedCategories } = gameUtils.decodeSeed(entry.seed);
    onStart(rawSeed, excludedCategories, "custom");
  };

  const showProgress = Boolean(
    progress && progress.total > 0 && gameUtils.getProgressSummary,
  );
  const progressPct = progress
    ? (progress.completed / Math.max(progress.total, 1)) * 100
    : 0;
  const progressComplete =
    progress !== null && progress.completed >= progress.total;
  const gamesPlayed = history.reduce((sum, entry) => sum + entry.plays, 0);
  const bestStreakOverall = history.reduce(
    (best, entry) => Math.max(best, entry.bestStreak),
    0,
  );

  // -------------------------------------------------------------------------
  // Building blocks
  // -------------------------------------------------------------------------

  const heroContent = (
    <>
      <Typography
        variant="h3"
        component="h1"
        fontWeight={700}
        sx={{
          lineHeight: 1.15,
          mb: { xs: 1, md: 1.5 },
          fontSize: { xs: "1.75rem", sm: "2.25rem", md: "2.75rem" },
        }}
      >
        Customize your game
      </Typography>

      <Typography
        variant="body1"
        color="text.secondary"
        sx={{
          lineHeight: 1.7,
          mb: { xs: 2, md: 3 },
          fontSize: { xs: "0.9rem", md: "1rem" },
        }}
      >
        Focus on specific categories or play them all. Hit Go to jump straight
        in.
      </Typography>

      <Stack
        direction="row"
        alignItems="center"
        spacing={1.5}
        sx={{ justifyContent: { xs: "center", md: "flex-start" } }}
      >
        <Button
          variant="contained"
          size="large"
          onClick={handleStart}
          endIcon={<ArrowRight size={18} />}
          sx={{
            px: { xs: 3, md: 5 },
            py: { xs: 1, md: 1.5 },
            fontSize: { xs: "0.9rem", md: "1.05rem" },
          }}
        >
          Go
        </Button>
      </Stack>

      <Box sx={{ mt: { xs: 2.5, md: 3 } }}>
        <Stack
          direction="row"
          alignItems="center"
          spacing={0.75}
          sx={{
            mb: 0.75,
            justifyContent: { xs: "center", md: "flex-start" },
          }}
        >
          <Hash size={13} color="var(--mui-palette-text-secondary)" />
          <Typography variant="caption" color="text.secondary" fontWeight={500}>
            Seed: play the same game as a friend
          </Typography>
        </Stack>
        <Stack
          direction="row"
          alignItems="center"
          spacing={0.5}
          sx={{ justifyContent: { xs: "center", md: "flex-start" } }}
        >
          <TextField
            placeholder="e.g. A3X9K2"
            size="small"
            value={seedInput}
            onChange={(e) => setSeedInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleStart();
            }}
            slotProps={{
              htmlInput: {
                maxLength: 20,
                style: {
                  fontFamily: "var(--font-geist-mono), monospace",
                  textTransform: "uppercase",
                  letterSpacing: "0.15em",
                },
              },
              input: {
                endAdornment: hasSeed ? (
                  <InputAdornment position="end">
                    <IconButton
                      size="small"
                      onClick={() => setSeedInput("")}
                      edge="end"
                      sx={{ color: "text.disabled", p: 0.5 }}
                    >
                      <X size={14} />
                    </IconButton>
                  </InputAdornment>
                ) : undefined,
              },
            }}
            sx={{ maxWidth: 200 }}
          />
          <Tooltip title="Random seed" arrow>
            <IconButton
              size="small"
              onClick={() => setSeedInput(gameUtils.generateSeed())}
              sx={{
                color: "text.secondary",
                "&:hover": { color: "text.primary" },
              }}
            >
              <Dices size={18} />
            </IconButton>
          </Tooltip>
        </Stack>
      </Box>
    </>
  );

  const categoriesPanel = (
    <Box
      sx={{
        opacity: hasSeed ? 0.45 : 1,
        pointerEvents: hasSeed ? "none" : "auto",
        transition: "opacity 0.2s ease",
      }}
    >
      {hasSeed && (
        <Typography
          variant="caption"
          color="text.secondary"
          fontFamily="var(--font-geist-mono), monospace"
          sx={{ display: "block", mb: 1.5, fontSize: "0.72rem" }}
        >
          {seedHasCategories
            ? "Categories locked by seed."
            : "This seed uses all categories."}
        </Typography>
      )}

      <Stack spacing={1.5}>
        {config.categorySections.map((section) => (
          <Box key={section.label}>
            <Box
              role={hasSeed ? undefined : "button"}
              tabIndex={hasSeed ? undefined : 0}
              onClick={
                hasSeed ? undefined : () => toggleSection(section.categories)
              }
              onKeyDown={
                hasSeed
                  ? undefined
                  : (e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        toggleSection(section.categories);
                      }
                    }
              }
              sx={{
                display: "inline-flex",
                alignItems: "center",
                gap: 0.75,
                mb: 0.5,
                cursor: "pointer",
                "&:hover .toggle-hint, &:focus-visible .toggle-hint": {
                  opacity: 1,
                },
              }}
            >
              <Typography
                variant="caption"
                color="text.secondary"
                fontFamily="var(--font-geist-mono), monospace"
                sx={{
                  fontSize: "0.63rem",
                  letterSpacing: "0.05em",
                  textTransform: "uppercase",
                }}
              >
                {section.label}
              </Typography>
              <Typography
                className="toggle-hint"
                variant="caption"
                fontFamily="var(--font-geist-mono), monospace"
                sx={{
                  fontSize: "0.58rem",
                  color: "text.disabled",
                  opacity: 0,
                  transition: "opacity 0.15s ease",
                }}
              >
                {section.categories.every((c) => effectiveExcluded.has(c))
                  ? "enable all"
                  : "disable all"}
              </Typography>
            </Box>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
              {section.categories.map((cat) => {
                const isEnabled = !effectiveExcluded.has(cat);
                return (
                  <Chip
                    key={cat}
                    label={config.categoryLabels[cat]}
                    size="small"
                    aria-pressed={isEnabled}
                    onClick={() => toggleCategory(cat)}
                    sx={{
                      height: 26,
                      fontSize: "0.72rem",
                      cursor: "pointer",
                      bgcolor: isEnabled ? "action.selected" : "transparent",
                      color: isEnabled ? "text.primary" : "text.disabled",
                      border: 1,
                      borderColor: isEnabled ? "transparent" : "divider",
                      opacity: isEnabled ? 1 : 0.45,
                      transition: "all 0.15s ease",
                      "&:hover": {
                        bgcolor: isEnabled ? "action.focus" : "action.hover",
                      },
                    }}
                  />
                );
              })}
            </Box>
          </Box>
        ))}
      </Stack>
    </Box>
  );

  const resetButton = (
    <Button
      size="small"
      color={confirmReset ? "error" : "inherit"}
      onClick={handleResetProgress}
      onBlur={() => setConfirmReset(false)}
      sx={{
        flexShrink: 0,
        fontSize: "0.72rem",
        color: confirmReset ? undefined : "text.secondary",
      }}
    >
      {confirmReset ? "Confirm reset" : "Reset"}
    </Button>
  );

  /** Compact clickable tile for the daily/weekly challenges. */
  const challengeTile = (
    icon: ReactNode,
    label: string,
    sublabel: string,
    seed: string,
    result: HistoryEntry | null,
    onPlay: () => void,
  ) => {
    const completed = result !== null;
    const pct = completed
      ? Math.round((result.bestScore / result.total) * 100)
      : 0;
    return (
      <Paper
        elevation={0}
        onClick={onPlay}
        sx={{
          p: 2,
          border: 1,
          borderColor: "divider",
          cursor: "pointer",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          transition: "background 0.15s ease",
          "&:hover": { bgcolor: "action.hover" },
        }}
      >
        <Stack direction="row" alignItems="center" spacing={0.75}>
          <Box sx={{ color: "text.secondary", display: "flex" }}>{icon}</Box>
          <Typography
            variant="caption"
            color="text.secondary"
            fontWeight={600}
            sx={{ fontSize: "0.72rem" }}
          >
            {label}
          </Typography>
          <Box
            sx={{
              ml: "auto",
              display: "flex",
              color: completed ? "success.main" : "text.secondary",
            }}
          >
            {completed ? <Check size={15} /> : <ArrowRight size={14} />}
          </Box>
        </Stack>
        <Typography
          fontFamily="var(--font-geist-mono), monospace"
          fontWeight={700}
          sx={{
            mt: 1,
            fontSize: completed ? "1.35rem" : "0.95rem",
            letterSpacing: completed ? 0 : "0.1em",
            color: completed
              ? pct >= 70
                ? "success.main"
                : pct >= 50
                  ? "warning.main"
                  : "error.main"
              : "text.primary",
          }}
        >
          {completed
            ? `${String(result.bestScore)}/${String(result.total)}`
            : seed}
        </Typography>
        <Typography
          variant="caption"
          color="text.disabled"
          sx={{ fontSize: "0.65rem", mt: "auto", pt: 0.5 }}
        >
          {sublabel}
        </Typography>
      </Paper>
    );
  };

  /** Small KPI tile with an oversized numeral. */
  const statTile = (icon: ReactNode, value: string, label: string) => (
    <Paper
      elevation={0}
      sx={{
        p: 2,
        border: 1,
        borderColor: "divider",
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box sx={{ color: "text.secondary", display: "flex" }}>{icon}</Box>
      <Typography
        fontFamily="var(--font-geist-mono), monospace"
        fontWeight={700}
        sx={{ mt: 1, fontSize: "1.35rem" }}
      >
        {value}
      </Typography>
      <Typography
        variant="caption"
        color="text.disabled"
        sx={{ fontSize: "0.65rem", mt: "auto", pt: 0.5 }}
      >
        {label}
      </Typography>
    </Paper>
  );

  return (
    <>
      {/* Hero + categories */}
      <Stack
        direction={{ xs: "column", md: "row" }}
        alignItems={{ md: "flex-start" }}
        spacing={{ xs: 4, md: 8 }}
        sx={{ pt: { xs: 3, md: 8 }, pb: { xs: 3, md: 6 } }}
      >
        <Box
          sx={{ flex: 1, minWidth: 0, textAlign: { xs: "center", md: "left" } }}
        >
          {heroContent}
        </Box>
        <Box
          sx={{
            flex: 1,
            minWidth: 0,
            width: { xs: "100%", md: "auto" },
            maxWidth: { md: 520 },
          }}
        >
          {categoriesPanel}
        </Box>
      </Stack>

      {/* Overview bento board */}
      <Box sx={{ pb: { xs: 2, md: 3 } }}>
        <SectionLabel>Overview</SectionLabel>
        <Box
          sx={{
            display: "grid",
            gap: 2,
            gridTemplateColumns: {
              xs: "repeat(2, 1fr)",
              md: "repeat(4, 1fr)",
            },
          }}
        >
          {challengeTile(
            <Sun size={16} />,
            "Daily",
            "Resets every day",
            dailySeed,
            dailyResult,
            playDaily,
          )}
          {challengeTile(
            <Calendar size={16} />,
            "Weekly",
            "Resets every Monday",
            weeklySeed,
            weeklyResult,
            playWeekly,
          )}
          {statTile(
            <Flame size={16} />,
            String(bestStreakOverall),
            "best streak",
          )}
          {statTile(
            <Gamepad2 size={16} />,
            String(gamesPlayed),
            "games played",
          )}

          <Box
            sx={{
              gridColumn: {
                xs: "span 2",
                md: showProgress ? "span 3" : "span 4",
              },
              minWidth: 0,
            }}
          >
            <Paper
              elevation={0}
              sx={{
                border: 1,
                borderColor: "divider",
                p: { xs: 2, md: 3 },
                height: "100%",
              }}
            >
              <ActivityGraphComponent />
            </Paper>
          </Box>
          {showProgress && progress && (
            <Paper
              elevation={0}
              sx={{
                gridColumn: { xs: "span 2", md: "span 1" },
                border: 1,
                borderColor: "divider",
                p: 2,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 1,
              }}
            >
              <Stack
                direction="row"
                alignItems="center"
                spacing={0.75}
                sx={{ alignSelf: "flex-start" }}
              >
                <Target size={16} color="var(--mui-palette-text-secondary)" />
                <Typography
                  variant="caption"
                  color="text.secondary"
                  fontWeight={600}
                  sx={{ fontSize: "0.72rem" }}
                >
                  Question pool
                </Typography>
              </Stack>
              <ProgressRing pct={progressPct} size={96}>
                <Typography
                  fontFamily="var(--font-geist-mono), monospace"
                  fontWeight={700}
                  sx={{
                    fontSize: "1rem",
                    color: progressComplete ? "success.main" : "text.primary",
                  }}
                >
                  {Math.round(progressPct)}%
                </Typography>
              </ProgressRing>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ fontSize: "0.7rem", textAlign: "center" }}
              >
                {progress.completed}/{progress.total} solved this month
              </Typography>
              {resetButton}
            </Paper>
          )}
        </Box>
      </Box>

      {/* Previous games strip */}
      <Box sx={{ pb: { xs: 3, md: 6 } }}>
        <SectionLabel>Previous games</SectionLabel>
        {history.length === 0 ? (
          <Typography
            variant="caption"
            color="text.disabled"
            sx={{ fontSize: "0.72rem" }}
          >
            No games played yet.
          </Typography>
        ) : (
          <Stack
            direction="row"
            spacing={1.5}
            sx={{ overflowX: "auto", pb: 1, scrollbarWidth: "thin" }}
          >
            {history.map((entry) => {
              const pct = Math.round((entry.bestScore / entry.total) * 100);
              return (
                <Paper
                  key={entry.seed}
                  elevation={0}
                  onClick={() => {
                    replayEntry(entry);
                  }}
                  sx={{
                    px: 2,
                    py: 1.25,
                    border: 1,
                    borderColor: "divider",
                    cursor: "pointer",
                    flexShrink: 0,
                    transition: "background 0.15s ease",
                    "&:hover": { bgcolor: "action.hover" },
                  }}
                >
                  <Typography
                    variant="caption"
                    fontFamily="var(--font-geist-mono), monospace"
                    fontWeight={600}
                    sx={{ fontSize: "0.7rem", letterSpacing: "0.06em" }}
                  >
                    {entry.seed}
                  </Typography>
                  <Stack direction="row" alignItems="center" spacing={0.75}>
                    <Typography
                      fontFamily="var(--font-geist-mono), monospace"
                      fontWeight={700}
                      sx={{
                        fontSize: "0.95rem",
                        color:
                          pct >= 70
                            ? "success.main"
                            : pct >= 50
                              ? "warning.main"
                              : "text.secondary",
                      }}
                    >
                      {entry.bestScore}/{entry.total}
                    </Typography>
                    {entry.bestStreak > 0 && (
                      <Stack direction="row" alignItems="center" spacing={0.25}>
                        <Flame
                          size={10}
                          color="var(--mui-palette-text-disabled)"
                        />
                        <Typography
                          variant="caption"
                          color="text.disabled"
                          fontFamily="var(--font-geist-mono), monospace"
                          sx={{ fontSize: "0.65rem" }}
                        >
                          {entry.bestStreak}
                        </Typography>
                      </Stack>
                    )}
                  </Stack>
                  <Typography
                    variant="caption"
                    color="text.disabled"
                    sx={{ fontSize: "0.62rem" }}
                  >
                    {gameUtils.formatRelativeDate(entry.lastPlayedAt)}
                  </Typography>
                </Paper>
              );
            })}
          </Stack>
        )}
      </Box>

      {/* Cross-promo slot */}
      {crossPromoSlot}
    </>
  );
}
