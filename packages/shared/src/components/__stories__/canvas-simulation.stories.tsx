import { useRef, useEffect } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { CanvasSimulation, useIsDarkMode } from "../canvas-simulation";

function BouncingBallDemo() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDark = useIsDarkMode();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let x = 160;
    let y = 120;
    let vx = 100;
    let vy = 80;
    let lastTime = 0;
    let rafId = 0;

    function tick(time: number) {
      const dt = lastTime ? (time - lastTime) / 1000 : 1 / 60;
      lastTime = time;

      x += vx * dt;
      y += vy * dt;
      if (x < 8 || x > 312) vx = -vx;
      if (y < 8 || y > 232) vy = -vy;
      x = Math.max(8, Math.min(312, x));
      y = Math.max(8, Math.min(232, y));

      ctx.fillStyle = isDark ? "#1a1a1a" : "#fafafa";
      ctx.fillRect(0, 0, 320, 240);
      ctx.beginPath();
      ctx.arc(x, y, 8, 0, Math.PI * 2);
      ctx.fillStyle = isDark ? "#F87171" : "#DC2626";
      ctx.fill();

      rafId = requestAnimationFrame(tick);
    }

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [isDark]);

  return <CanvasSimulation label="Bouncing ball demo" canvasRef={canvasRef} />;
}

const meta: Meta<typeof CanvasSimulation> = {
  title: "Content/Canvas Simulation",
  component: CanvasSimulation,
  tags: ["autodocs"],
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

export const Default: Story = {
  render: () => <BouncingBallDemo />,
};

export const CustomSize: Story = {
  render: () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.fillStyle = "#6366f1";
      ctx.fillRect(0, 0, 200, 150);
      ctx.fillStyle = "#fff";
      ctx.font = "14px monospace";
      ctx.textAlign = "center";
      ctx.fillText("200 x 150", 100, 80);
    }, []);

    return (
      <CanvasSimulation
        label="Custom dimensions"
        canvasRef={canvasRef}
        width={200}
        height={150}
      />
    );
  },
};
