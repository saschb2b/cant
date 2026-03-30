"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import type { Difficulty, HuntState } from "@/lib/hunt/types";
import { DIFFICULTY_CONFIGS } from "@/lib/hunt/config";
import { createGrid } from "@/lib/hunt/grid";
import { revealCell, toggleFlag } from "@/lib/hunt/reveal";
import { calculateScore, type ScoreResult } from "@/lib/hunt/scoring";

export function useHuntGame() {
  const [state, setState] = useState<HuntState | null>(null);
  const [elapsed, setElapsed] = useState(0);
  const [score, setScore] = useState<ScoreResult | null>(null);
  const isFirstClick = useRef(true);
  const seedRef = useRef(0);

  // Timer
  useEffect(() => {
    if (state?.status !== "playing") return;
    const interval = setInterval(() => {
      setElapsed(
        state.startedAt ? Math.floor((Date.now() - state.startedAt) / 1000) : 0,
      );
    }, 1000);
    return () => clearInterval(interval);
  }, [state?.status, state?.startedAt]);

  const startGame = useCallback((difficulty: Difficulty) => {
    const config = DIFFICULTY_CONFIGS[difficulty];
    const counter = seedRef.current++;
    const seed = `hunt-${String(Date.now())}-${String(counter)}`;
    const grid = createGrid(config, seed);
    setState({
      grid,
      difficulty,
      config,
      status: "idle",
      flagsPlaced: 0,
      cellsRevealed: 0,
      safeCellCount: config.rows * config.cols - config.bugCount,
      startedAt: null,
      finishedAt: null,
    });
    setElapsed(0);
    setScore(null);
    isFirstClick.current = true;
  }, []);

  const handleReveal = useCallback(
    (row: number, col: number) => {
      if (!state) return;

      let current = state;

      // First click: regenerate grid with safe zone and start timer
      if (isFirstClick.current) {
        isFirstClick.current = false;
        const counter2 = seedRef.current++;
        const seed = `hunt-${String(Date.now())}-${String(counter2)}`;
        const grid = createGrid(current.config, seed, row, col);
        current = {
          ...current,
          grid,
          status: "playing",
          startedAt: Date.now(),
        };
      }

      const next = revealCell(current, row, col);
      setState(next);

      if (next.status === "won") {
        setScore(calculateScore(next));
      }
    },
    [state],
  );

  const handleFlag = useCallback(
    (row: number, col: number) => {
      if (!state) return;
      // Allow flagging even before first reveal
      let current = state;
      if (current.status === "idle") {
        current = { ...current, status: "playing", startedAt: Date.now() };
        isFirstClick.current = false;
      }
      setState(toggleFlag(current, row, col));
    },
    [state],
  );

  const reset = useCallback(() => {
    setState(null);
    setElapsed(0);
    setScore(null);
  }, []);

  const restart = useCallback(() => {
    if (state) startGame(state.difficulty);
  }, [state, startGame]);

  return {
    state,
    elapsed,
    score,
    startGame,
    handleReveal,
    handleFlag,
    reset,
    restart,
  };
}
