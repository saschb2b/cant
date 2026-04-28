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

const siteUrl = "https://cant-ticket.saschb2b.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Can't Ticket - Agile Ticket Craft",
    template: "%s - Can't Ticket",
  },
  description:
    "Learn agile ticket craft by comparing stories side by side. User stories, INVEST, acceptance criteria, story points, splitting, ceremonies.",
  keywords: [
    "agile",
    "scrum",
    "user stories",
    "INVEST",
    "acceptance criteria",
    "story points",
    "story splitting",
    "definition of ready",
    "definition of done",
    "sprint planning",
    "Jira",
  ],
  authors: [{ name: "Sascha", url: "https://saschb2b.com/" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Can't Ticket",
    title: "Can't Ticket - Agile Ticket Craft",
    description:
      "Spot the cleaner ticket. Stories, acceptance criteria, story points, and splitting through side-by-side comparisons.",
    url: siteUrl,
  },
  twitter: {
    card: "summary_large_image",
    title: "Can't Ticket - Agile Ticket Craft",
    description:
      "Spot the cleaner ticket. Stories, acceptance criteria, story points, and splitting through side-by-side comparisons.",
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
              name: "Can't Ticket",
              url: siteUrl,
              description:
                "Learn agile ticket craft by comparing stories side by side. 93 comparisons across 15 categories.",
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
          data-website-id="f09beb99-5074-4c53-bb96-eb6fd54a248c"
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
