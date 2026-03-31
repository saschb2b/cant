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

const siteUrl = "https://cant-orchestrate.saschb2b.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Can't Orchestrate - Container Orchestration Pattern Game",
    template: "%s - Can't Orchestrate",
  },
  description:
    "Pick the better container orchestration pattern in side-by-side code challenges. Covers Docker, Kubernetes, Helm, Swarm, and more.",
  keywords: [
    "Docker",
    "Kubernetes",
    "container orchestration",
    "Docker Compose",
    "Helm",
    "Docker Swarm",
    "Dockerfile",
    "CI/CD",
    "DevOps",
    "container security",
    "best practices",
    "infrastructure as code",
  ],
  authors: [{ name: "Sascha", url: "https://saschb2b.com/" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Can't Orchestrate",
    title: "Can't Orchestrate - Container Orchestration Pattern Game",
    description:
      "One config. Two ways. Pick the better container orchestration pattern in side-by-side code challenges.",
    url: siteUrl,
  },
  twitter: {
    card: "summary_large_image",
    title: "Can't Orchestrate - Container Orchestration Pattern Game",
    description:
      "One config. Two ways. Pick the better container orchestration pattern in side-by-side code challenges.",
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
              name: "Can't Orchestrate",
              url: siteUrl,
              description:
                "Test your DevOps instincts. Pick the better container orchestration pattern in side-by-side challenges.",
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
          data-website-id="8e020139-e7fb-489c-b4bc-421e51b58e19"
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
