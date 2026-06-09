import { useRef, useEffect } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { CanvasSimulation, useIsDarkMode } from "../canvas-simulation";

function BouncingBallDemo({
  label = "Bouncing ball demo",
  width = 320,
  height = 240,
}: {
  label?: string;
  width?: number;
  height?: number;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDark = useIsDarkMode();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let x = width / 2;
    let y = height / 2;
    let vx = 100;
    let vy = 80;
    let lastTime = 0;
    let rafId = 0;

    const tick = (time: number) => {
      const dt = lastTime ? (time - lastTime) / 1000 : 1 / 60;
      lastTime = time;

      x += vx * dt;
      y += vy * dt;
      if (x < 8 || x > width - 8) vx = -vx;
      if (y < 8 || y > height - 8) vy = -vy;
      x = Math.max(8, Math.min(width - 8, x));
      y = Math.max(8, Math.min(height - 8, y));

      ctx.fillStyle = isDark ? "#1a1a1a" : "#fafafa";
      ctx.fillRect(0, 0, width, height);
      ctx.beginPath();
      ctx.arc(x, y, 8, 0, Math.PI * 2);
      ctx.fillStyle = isDark ? "#F87171" : "#DC2626";
      ctx.fill();

      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [isDark, width, height]);

  return (
    <CanvasSimulation
      label={label}
      canvasRef={canvasRef}
      width={width}
      height={height}
    />
  );
}

const meta: Meta<typeof CanvasSimulation> = {
  title: "Visual Renderers/Canvas Simulation",
  component: CanvasSimulation,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "A presentational shell for Canvas 2D simulations. Wraps a `<canvas>` element inside a MUI Paper with a monospace label and bordered container. The consuming component owns the simulation logic and passes a `canvasRef`. Used by cant-game for pathfinding, collision detection, shading, rope physics, and other interactive visualizations. Pairs with the `useIsDarkMode()` hook for theme-aware drawing.",
      },
    },
  },
  argTypes: {
    label: {
      description: "Monospace label shown above the canvas.",
      control: "text",
    },
    width: {
      description: "Canvas width in pixels.",
      control: { type: "number", min: 100, max: 800, step: 10 },
      table: { defaultValue: { summary: "320" } },
    },
    height: {
      description: "Canvas height in pixels.",
      control: { type: "number", min: 100, max: 600, step: 10 },
      table: { defaultValue: { summary: "240" } },
    },
    canvasRef: {
      description:
        "Ref to the `<canvas>` element. The consuming component uses this to draw.",
      control: false,
    },
  },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 400, padding: 16 }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof CanvasSimulation>;

/** Default 320x240 canvas with an animated bouncing ball. */
export const Default: Story = {
  render: (args) => <BouncingBallDemo label={args.label} />,
  args: { label: "Bouncing ball demo" },
};

/** Canvas with custom dimensions. The simulation adapts to the size. */
export const CustomSize: Story = {
  render: (args) => (
    <BouncingBallDemo
      label={args.label}
      width={args.width}
      height={args.height}
    />
  ),
  args: {
    label: "Small canvas",
    width: 200,
    height: 150,
  },
};
