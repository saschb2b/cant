"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import type { ElementType, Grid } from "@/lib/lab/types";
import { createGrid, clearGrid, setCell, getCell } from "@/lib/lab/grid";
import { createParticle, tickSimulation } from "@/lib/lab/simulation";
import { renderGrid } from "@/lib/lab/renderer";
import { createAtmosphere, updateAtmosphere } from "@/lib/lab/atmosphere";
import { SandboxCanvas } from "./sandbox-canvas";
import { LabToolbar } from "./element-picker";
import { SandboxControls } from "./sandbox-controls";
import { ReactionBookButton } from "./reaction-book";

/** Count specific creature types in the grid. */
function countCreatures(grid: Grid): {
  worms: number;
  bees: number;
  humans: number;
  birds: number;
} {
  let worms = 0;
  let bees = 0;
  let humans = 0;
  let birds = 0;
  for (const cell of grid.cells) {
    if (!cell) continue;
    if (cell.element === "worm") worms++;
    else if (cell.element === "bee") bees++;
    else if (cell.element === "human") humans++;
    else if (cell.element === "bird") birds++;
  }
  return { worms, bees, humans, birds };
}

/** Canvas backing is 1:1 with grid cells; CSS handles display scaling. */
const CELL_SIZE = 1;

export function Sandbox() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gridRef = useRef<Grid | null>(null);
  const tickRef = useRef(0);
  const rafRef = useRef(0);
  const atmoRef = useRef(createAtmosphere());

  const [selectedElement, setSelectedElement] = useState<ElementType>("sand");
  const [eraserActive, setEraserActive] = useState(false);
  const [paused, setPaused] = useState(false);
  const creaturesRef = useRef({ worms: 0, bees: 0, humans: 0, birds: 0 });
  const [creatures, setCreatures] = useState({
    worms: 0,
    bees: 0,
    humans: 0,
    birds: 0,
  });
  const isMobile = typeof window !== "undefined" && window.innerWidth < 600;
  const [brushSize, setBrushSize] = useState(isMobile ? 3 : 2);

  const pausedRef = useRef(paused);
  pausedRef.current = paused;

  const selectedRef = useRef(selectedElement);
  selectedRef.current = selectedElement;

  const eraserRef = useRef(eraserActive);
  eraserRef.current = eraserActive;

  const brushSizeRef = useRef(brushSize);
  brushSizeRef.current = brushSize;

  // Track whether a human was already placed in the current drag stroke
  const humanPlacedRef = useRef(false);

  const handleResize = useCallback((gw: number, gh: number) => {
    const oldGrid = gridRef.current;
    const newGrid = createGrid(gw, gh);

    if (oldGrid) {
      const copyW = Math.min(oldGrid.width, gw);
      const copyH = Math.min(oldGrid.height, gh);
      for (let y = 0; y < copyH; y++) {
        for (let x = 0; x < copyW; x++) {
          const cell = getCell(oldGrid, x, y);
          if (cell) setCell(newGrid, x, y, cell);
        }
      }
    }

    gridRef.current = newGrid;
  }, []);

  const handleDraw = useCallback((gx: number, gy: number) => {
    const grid = gridRef.current;
    if (!grid) return;
    const isErasing = eraserRef.current;
    const el = selectedRef.current;

    // Humans: only one per drag stroke, placed at exact cursor position
    if (el === "human" && !isErasing) {
      if (humanPlacedRef.current) return;
      if (!getCell(grid, gx, gy)) {
        setCell(grid, gx, gy, createParticle(el));
        humanPlacedRef.current = true;
      }
      return;
    }

    const size = brushSizeRef.current;
    const half = Math.floor(size / 2);

    for (let dy = -half; dy <= half; dy++) {
      for (let dx = -half; dx <= half; dx++) {
        const x = gx + dx;
        const y = gy + dy;
        if (isErasing) {
          setCell(grid, x, y, null);
        } else if (!getCell(grid, x, y)) {
          setCell(grid, x, y, createParticle(el));
        }
      }
    }
  }, []);

  const handleDrawEnd = useCallback(() => {
    humanPlacedRef.current = false;
  }, []);

  const handleReset = useCallback(() => {
    if (gridRef.current) clearGrid(gridRef.current);
    tickRef.current = 0;
    atmoRef.current = createAtmosphere();
  }, []);

  const handleTogglePause = useCallback(() => {
    setPaused((p) => !p);
  }, []);

  const handleToggleEraser = useCallback(() => {
    setEraserActive((e) => !e);
  }, []);

  const handleSelectElement = useCallback((el: ElementType) => {
    setSelectedElement(el);
    setEraserActive(false);
  }, []);

  // Main loop
  useEffect(() => {
    let frameCount = 0;
    function loop() {
      frameCount++;
      const grid = gridRef.current;

      if (grid) {
        if (!pausedRef.current && frameCount % 2 === 0) {
          tickSimulation(grid, tickRef.current, atmoRef.current.daylight);
          updateAtmosphere(atmoRef.current, grid);
          tickRef.current++;
        }

        // Count creatures every 30 frames (~0.5s at 60fps)
        if (frameCount % 30 === 0) {
          const counts = countCreatures(grid);
          creaturesRef.current = counts;
          setCreatures(counts);
        }

        const canvas = canvasRef.current;
        const ctx = canvas?.getContext("2d");
        if (ctx) {
          renderGrid(ctx, grid, CELL_SIZE, atmoRef.current);
        }
      }

      rafRef.current = requestAnimationFrame(loop);
    }

    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: "100%",
      }}
    >
      {/* Canvas area with floating controls overlay */}
      <Box sx={{ flex: 1, minHeight: 0, position: "relative" }}>
        <SandboxCanvas
          canvasRef={canvasRef}
          onResize={handleResize}
          onDraw={handleDraw}
          onDrawEnd={handleDrawEnd}
        />

        <SandboxControls
          paused={paused}
          onTogglePause={handleTogglePause}
          onReset={handleReset}
          brushSize={brushSize}
          onBrushSizeChange={setBrushSize}
          eraserActive={eraserActive}
          onToggleEraser={handleToggleEraser}
        >
          <ReactionBookButton />
        </SandboxControls>

        {/* Creature population counter */}
        {(creatures.worms > 0 ||
          creatures.bees > 0 ||
          creatures.humans > 0 ||
          creatures.birds > 0) && (
          <Box
            sx={{
              position: "absolute",
              top: 8,
              right: 8,
              zIndex: 2,
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              bgcolor: "rgba(0, 0, 0, 0.5)",
              backdropFilter: "blur(8px)",
              borderRadius: 20,
              px: 1.5,
              py: 0.5,
            }}
          >
            {creatures.worms > 0 && (
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                <Typography sx={{ fontSize: "0.85rem", lineHeight: 1 }}>
                  🪱
                </Typography>
                <Typography
                  sx={{
                    fontSize: "0.75rem",
                    fontWeight: 700,
                    color: "grey.300",
                    fontFamily: "monospace",
                  }}
                >
                  {creatures.worms}
                </Typography>
              </Box>
            )}
            {creatures.bees > 0 && (
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                <Typography sx={{ fontSize: "0.85rem", lineHeight: 1 }}>
                  🐝
                </Typography>
                <Typography
                  sx={{
                    fontSize: "0.75rem",
                    fontWeight: 700,
                    color: "grey.300",
                    fontFamily: "monospace",
                  }}
                >
                  {creatures.bees}
                </Typography>
              </Box>
            )}
            {creatures.birds > 0 && (
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                <Typography sx={{ fontSize: "0.85rem", lineHeight: 1 }}>
                  🐦
                </Typography>
                <Typography
                  sx={{
                    fontSize: "0.75rem",
                    fontWeight: 700,
                    color: "grey.300",
                    fontFamily: "monospace",
                  }}
                >
                  {creatures.birds}
                </Typography>
              </Box>
            )}
            {creatures.humans > 0 && (
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                <Typography sx={{ fontSize: "0.85rem", lineHeight: 1 }}>
                  🧑
                </Typography>
                <Typography
                  sx={{
                    fontSize: "0.75rem",
                    fontWeight: 700,
                    color: "grey.300",
                    fontFamily: "monospace",
                  }}
                >
                  {creatures.humans}
                </Typography>
              </Box>
            )}
          </Box>
        )}
      </Box>

      {/* Bottom bar: categories + elements */}
      <LabToolbar
        selected={eraserActive ? "empty" : selectedElement}
        onSelect={handleSelectElement}
        eraserActive={eraserActive}
      />
    </Box>
  );
}
