import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Link Inspector",
  description:
    "Paste any URL and preview how it appears on LinkedIn, Twitter/X, Slack, Teams, Discord, Google, and WhatsApp.",
};

export default function InspectorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
