import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Canvas",
  description:
    "Multi-device responsive design viewer. Add device viewports and preview any URL across phones, tablets, and desktops with synchronized interactions.",
};

export default function CanvasLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
