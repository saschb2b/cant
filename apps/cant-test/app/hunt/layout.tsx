import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Bug Hunt",
  description:
    "Find the bugs before they crash production. A Minesweeper-inspired testing game.",
};

export default function HuntLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
