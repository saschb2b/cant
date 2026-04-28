import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import {
  ThemeProvider,
  AnalyticsProviderWrapper,
} from "@cant/shared/components";
import theme from "@/lib/theme";
import { AppThemeWrapper } from "@/components/app-theme-wrapper";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

const siteUrl = "https://cant-game.saschb2b.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Can't Game - Game Dev Patterns",
    template: "%s - Can't Game",
  },
  description:
    "Learn game development patterns across game loops, input handling, physics, rendering, AI, shaders, and netcode. Side-by-side comparisons of naive vs robust approaches.",
  keywords: [
    "game development",
    "game programming",
    "game loop",
    "ECS",
    "input handling",
    "physics engine",
    "collision detection",
    "pathfinding",
    "behavior trees",
    "shaders",
    "netcode",
    "multiplayer",
    "rendering",
    "game architecture",
  ],
  authors: [{ name: "Sascha", url: "https://saschb2b.com/" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Can't Game",
    title: "Can't Game - Game Dev Patterns",
    description:
      "Learn game development patterns across game loops, physics, rendering, AI, and more. Side-by-side comparisons with explanations.",
    url: siteUrl,
  },
  twitter: {
    card: "summary_large_image",
    title: "Can't Game - Game Dev Patterns",
    description:
      "Learn game development patterns across game loops, physics, rendering, AI, and more. Side-by-side comparisons with explanations.",
  },
  alternates: {
    canonical: siteUrl,
  },
  robots: {
    index: true,
    follow: true,
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "Can't Game",
              url: siteUrl,
              description:
                "Learn game development patterns across game loops, physics, rendering, AI, and more. Side-by-side comparisons with explanations.",
              author: {
                "@type": "Person",
                name: "Sascha Becker",
                url: "https://saschb2b.com",
              },
            }),
          }}
        />
        <Script
          async
          src="https://umami.saschb2b.com/script.js"
          data-website-id="a0700de0-fcd7-41e1-adac-79427aedab61"
        />
      </head>
      <body>
        <ThemeProvider theme={theme}>
          <AnalyticsProviderWrapper>
            <AppThemeWrapper>{children}</AppThemeWrapper>
          </AnalyticsProviderWrapper>
        </ThemeProvider>
      </body>
    </html>
  );
}
