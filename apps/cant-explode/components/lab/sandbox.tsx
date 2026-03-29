"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import type { ElementType, Grid } from "@/lib/lab/types";
import { createGrid, clearGrid, setCell, getCell } from "@/lib/lab/grid";
import { createParticle, tickSimulation } from "@/lib/lab/simulation";
import { renderGrid } from "@/lib/lab/renderer";
import { createAtmosphere, updateAtmosphere } from "@/lib/lab/atmosphere";
import { SandboxCanvas } from "./sandbox-canvas";
import { ElementPicker } from "./element-picker";
import { SandboxControls } from "./sandbox-controls";
import { ReactionBookButton } from "./reaction-book";

const GRID_WIDTH = 200;
const GRID_HEIGHT = 150;

export function Sandbox() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gridRef = useRef<Grid>(createGrid(GRID_WIDTH, GRID_HEIGHT));
  const tickRef = useRef(0);
  const cellSizeRef = useRef(3);
  const rafRef = useRef<number>(0);

  const [selectedElement, setSelectedElement] = useState<ElementType>("sand");
  const [eraserActive, setEraserActive] = useState(false);
  const [paused, setPaused] = useState(false);
  const isMobile = typeof window !== "undefined" && window.innerWidth < 600;
  const [brushSize, setBrushSize] = useState(isMobile ? 3 : 2);

  const atmoRef = useRef(createAtmosphere());

  const pausedRef = useRef(paused);
  pausedRef.current = paused;

  const selectedRef = useRef(selectedElement);
  selectedRef.current = selectedElement;

  const eraserRef = useRef(eraserActive);
  eraserRef.current = eraserActive;

  const brushSizeRef = useRef(brushSize);
  brushSizeRef.current = brushSize;

  const handleDraw = useCallback((gx: number, gy: number) => {
    const grid = gridRef.current;
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

  const handleCellSizeChange = useCallback((cs: number) => {
    cellSizeRef.current = cs;
  }, []);

  const handleReset = useCallback(() => {
    clearGrid(gridRef.current);
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
    function loop() {
      if (!pausedRef.current) {
        tickSimulation(gridRef.current, tickRef.current, atmoRef.current.daylight);
        tickRef.current++;
      }

      updateAtmosphere(atmoRef.current, gridRef.current);

      const canvas = canvasRef.current;
      const ctx = canvas?.getContext("2d");
      if (ctx) {
        renderGrid(ctx, gridRef.current, cellSizeRef.current, atmoRef.current);
      }

      rafRef.current = requestAnimationFrame(loop);
    }

    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  return (
    <>
      <ElementPicker selected={eraserActive ? "empty" : selectedElement} onSelect={handleSelectElement} />
      <SandboxCanvas
        canvasRef={canvasRef}
        gridWidth={GRID_WIDTH}
        gridHeight={GRID_HEIGHT}
        onDraw={handleDraw}
        onCellSizeChange={handleCellSizeChange}
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
    </>
  );
}
