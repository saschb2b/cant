import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import { ThemeProvider } from "@/components/theme-provider";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

const siteUrl = "https://cant-resize.saschb2b.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Can't Resize - Multi-Device Preview",
    template: "%s - Can't Resize",
  },
  description:
    "Preview any URL across phones, tablets, and desktops simultaneously. Scroll, click, and navigate, synced across every viewport in real time.",
  keywords: [
    "responsive design",
    "multi-device preview",
    "viewport testing",
    "responsive viewer",
    "device emulator",
    "screen size testing",
    "web development",
    "CSS",
    "mobile preview",
    "tablet preview",
    "desktop preview",
    "synchronized scrolling",
  ],
  authors: [{ name: "Sascha", url: "https://saschb2b.com/" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Responsive Viewer",
    title: "Can't Resize - Multi-Device Preview",
    description:
      "One site. Every screen. Preview any URL across devices with synced scrolling, clicks, and navigation.",
    url: siteUrl,
  },
  twitter: {
    card: "summary_large_image",
    title: "Can't Resize - Multi-Device Preview",
    description:
      "One site. Every screen. Preview any URL across devices with synced scrolling, clicks, and navigation.",
  },
  icons: {
    icon: "/icon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geist.variable} ${geistMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <Script
          async
          src="https://umami.saschb2b.com/script.js"
          data-website-id="24a9a7f0-ea82-4364-8eae-74f50b296d3e"
        />
      </head>
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
