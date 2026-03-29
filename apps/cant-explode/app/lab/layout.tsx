import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Lab",
  description:
    "A falling-sand chemistry sandbox. Drop elements onto the canvas and watch them react with each other.",
};

export default function LabLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
