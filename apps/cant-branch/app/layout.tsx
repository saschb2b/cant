import type { Metadata } from "next";
import { Geist_Mono, Inter } from "next/font/google";
import Script from "next/script";
import {
  ThemeProvider,
  AnalyticsProviderWrapper,
} from "@cant/shared/components";
import theme from "@/lib/theme";
import { AppThemeWrapper } from "@/components/app-theme-wrapper";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

const siteUrl = "https://cant-branch.saschb2b.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Can't Branch — Git Best Practices Game",
    template: "%s — Can't Branch",
  },
  description:
    "Train your eye for clean git workflows. Pick the better approach in 10 side-by-side challenges covering commits, branches, merges, PRs, and more.",
  keywords: [
    "git",
    "git best practices",
    "commit messages",
    "branching",
    "merge",
    "rebase",
    "pull requests",
    "code review",
    "git hooks",
    "CI/CD",
    "quiz",
    "training",
    "repository management",
    "conventional commits",
    "gitignore",
  ],
  authors: [{ name: "Sascha", url: "https://saschb2b.com/" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Can't Branch",
    title: "Can't Branch — Git Best Practices Game",
    description:
      "Can you spot the better git workflow? Train your eye for clean repository management in under 5 minutes.",
    url: siteUrl,
  },
  twitter: {
    card: "summary_large_image",
    title: "Can't Branch — Git Best Practices Game",
    description:
      "Can you spot the better git workflow? Train your eye for clean repository management in under 5 minutes.",
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
      className={`${inter.variable} ${geistMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "Can't Branch",
              url: siteUrl,
              description:
                "Train your eye for clean git workflows. Pick the better approach in side-by-side challenges.",
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
          data-website-id="f09fdcdc-db94-4831-a1c3-d983f38f1205"
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
