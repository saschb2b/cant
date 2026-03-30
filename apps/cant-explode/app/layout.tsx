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

const siteUrl = "https://cant-explode.saschb2b.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Can't Explode - Chemistry Challenges",
    template: "%s - Can't Explode",
  },
  description:
    "Test your chemistry knowledge with side-by-side molecule comparisons. Stability, acidity, bond energy, electronegativity, and more.",
  keywords: [
    "chemistry",
    "molecules",
    "chemical stability",
    "acid strength",
    "bond energy",
    "electronegativity",
    "organic chemistry",
    "general chemistry",
    "quiz",
    "learning",
  ],
  authors: [{ name: "Sascha", url: "https://saschb2b.com/" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Can't Explode",
    title: "Can't Explode - Chemistry Challenges",
    description:
      "Which molecule is more stable? Which acid is stronger? Test your chemistry instincts with quick-fire comparisons.",
    url: siteUrl,
  },
  twitter: {
    card: "summary_large_image",
    title: "Can't Explode - Chemistry Challenges",
    description:
      "Which molecule is more stable? Which acid is stronger? Test your chemistry instincts with quick-fire comparisons.",
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
              name: "Can't Explode",
              url: siteUrl,
              description:
                "Test your chemistry knowledge with molecule comparisons across 8 categories.",
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
          data-website-id="c78811f8-12ee-429b-84e0-592edd47676f"
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
