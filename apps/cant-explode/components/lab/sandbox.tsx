"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import Box from "@mui/material/Box";
import type { ElementType, Grid } from "@/lib/lab/types";
import { createGrid, clearGrid, setCell, getCell } from "@/lib/lab/grid";
import { createParticle, tickSimulation } from "@/lib/lab/simulation";
import { renderGrid } from "@/lib/lab/renderer";
import { createAtmosphere, updateAtmosphere } from "@/lib/lab/atmosphere";
import { SandboxCanvas } from "./sandbox-canvas";
import { LabToolbar } from "./element-picker";
import { SandboxControls } from "./sandbox-controls";
import { ReactionBookButton } from "./reaction-book";

/** Canvas backing is 1:1 with grid cells; CSS handles display scaling. */
const CELL_SIZE = 1;

export function Sandbox() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gridRef = useRef<Grid | null>(null);
  const tickRef = useRef(0);
  const rafRef = useRef<number>(0);
  const atmoRef = useRef(createAtmosphere());

  const [selectedElement, setSelectedElement] = useState<ElementType>("sand");
  const [eraserActive, setEraserActive] = useState(false);
  const [paused, setPaused] = useState(false);
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
