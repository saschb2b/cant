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

const siteUrl = "https://cant-seo.saschb2b.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Can't SEO - Link Inspector",
    template: "%s - Can't SEO",
  },
  description:
    "Paste any URL and preview how it appears on LinkedIn, Twitter/X, Slack, Teams, Discord, Google, and WhatsApp. Plus SEO challenges and a pattern library for Next.js.",
  keywords: [
    "SEO",
    "meta tags",
    "Open Graph",
    "Twitter Cards",
    "link preview",
    "social sharing",
    "structured data",
    "Next.js SEO",
    "canonical URL",
    "sitemap",
    "og:image",
    "link inspector",
  ],
  authors: [{ name: "Sascha", url: "https://saschb2b.com/" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Can't SEO",
    title: "Can't SEO - Link Inspector",
    description:
      "One link. Every platform. Preview how your URLs appear across LinkedIn, Twitter/X, Slack, Teams, and more.",
    url: siteUrl,
  },
  twitter: {
    card: "summary_large_image",
    title: "Can't SEO - Link Inspector",
    description:
      "One link. Every platform. Preview how your URLs appear across LinkedIn, Twitter/X, Slack, Teams, and more.",
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
              name: "Can't SEO",
              url: siteUrl,
              description:
                "Learn SEO best practices for Next.js. Inspect link previews across platforms and study 64 patterns.",
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
          data-website-id="1ca08826-ca6c-4791-b790-7e3651301ce0"
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
