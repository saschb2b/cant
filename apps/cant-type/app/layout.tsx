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

const siteUrl = "https://cant-type.saschb2b.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Can't Type - TypeScript Pattern Game",
    template: "%s - Can't Type",
  },
  description:
    "Pick the better TypeScript pattern in side-by-side code challenges. Covers generics, narrowing, utility types, and more.",
  keywords: [
    "TypeScript",
    "type safety",
    "generics",
    "type narrowing",
    "utility types",
    "discriminated unions",
    "strict mode",
    "TypeScript patterns",
    "code quality",
    "best practices",
    "React TypeScript",
    "type assertions",
  ],
  authors: [{ name: "Sascha", url: "https://saschb2b.com/" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Can't Type",
    title: "Can't Type - TypeScript Pattern Game",
    description:
      "One type. Two ways. Pick the better TypeScript pattern in side-by-side code challenges.",
    url: siteUrl,
  },
  twitter: {
    card: "summary_large_image",
    title: "Can't Type - TypeScript Pattern Game",
    description:
      "One type. Two ways. Pick the better TypeScript pattern in side-by-side code challenges.",
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
              name: "Can't Type",
              url: siteUrl,
              description:
                "Test your TypeScript instincts. Pick the better pattern in side-by-side code challenges.",
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
          data-website-id="feed24d7-ba3d-4869-9ea7-0b05343937ab"
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
