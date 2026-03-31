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

const siteUrl = "https://cant-ux.saschb2b.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Can't UX - UX Design Patterns",
    template: "%s - Can't UX",
  },
  description:
    "Learn UX design patterns by comparing good and bad approaches side by side. Typography, spacing, color, hierarchy, layout, forms, and feedback.",
  keywords: [
    "UX design",
    "UI patterns",
    "design patterns",
    "typography",
    "spacing",
    "color theory",
    "visual hierarchy",
    "form design",
    "user experience",
    "Refactoring UI",
    "web design",
  ],
  authors: [{ name: "Sascha", url: "https://saschb2b.com/" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Can't UX",
    title: "Can't UX - UX Design Patterns",
    description:
      "Spot the better UX pattern. Learn typography, spacing, color, hierarchy, and more through side-by-side comparisons.",
    url: siteUrl,
  },
  twitter: {
    card: "summary_large_image",
    title: "Can't UX - UX Design Patterns",
    description:
      "Spot the better UX pattern. Learn typography, spacing, color, hierarchy, and more through side-by-side comparisons.",
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
              name: "Can't UX",
              url: siteUrl,
              description:
                "Learn UX design patterns by comparing good and bad approaches side by side. 28 patterns across 7 categories.",
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
          data-website-id="e107ebb2-515c-4fb6-8278-ac3df19fd302"
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
