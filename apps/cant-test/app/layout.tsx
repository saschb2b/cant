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

const siteUrl = "https://cant-test.saschb2b.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Can't Test - Testing Patterns",
    template: "%s - Can't Test",
  },
  description:
    "Learn testing patterns across unit tests, integration tests, mocking, and more. Side-by-side comparisons of fragile vs resilient approaches.",
  keywords: [
    "testing",
    "unit testing",
    "integration testing",
    "mocking",
    "test strategy",
    "React Testing Library",
    "Vitest",
    "Jest",
    "async testing",
    "CI testing",
    "component testing",
    "web development",
  ],
  authors: [{ name: "Sascha", url: "https://saschb2b.com/" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Can't Test",
    title: "Can't Test - Testing Patterns",
    description:
      "Learn testing patterns across unit tests, integration tests, mocking, and more. Side-by-side comparisons with explanations.",
    url: siteUrl,
  },
  twitter: {
    card: "summary_large_image",
    title: "Can't Test - Testing Patterns",
    description:
      "Learn testing patterns across unit tests, integration tests, mocking, and more. Side-by-side comparisons with explanations.",
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
              name: "Can't Test",
              url: siteUrl,
              description:
                "Learn testing patterns across unit tests, integration tests, mocking, and more. Side-by-side comparisons with explanations.",
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
          data-website-id="b733064b-a08b-44f8-a8aa-1c1525821907"
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
