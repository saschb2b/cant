import type { Metadata } from "next";
import { Geist_Mono, Inter } from "next/font/google";
import {
  ThemeProvider,
  AnalyticsProviderWrapper,
} from "@cant/shared/components";
import theme from "@/lib/theme";
import { AppThemeWrapper } from "@/components/app-theme-wrapper";
import Script from "next/script";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

const siteUrl = "https://cant-maintain.saschb2b.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Can't Maintain — React Component API Game",
    template: "%s — Can't Maintain",
  },
  description:
    "Train your eye for clean React component APIs. Pick the better design in 10 side-by-side challenges — props, composition, TypeScript patterns, and more.",
  keywords: [
    "React",
    "props",
    "TypeScript",
    "component API",
    "prop naming",
    "component API design",
    "React patterns",
    "composition",
    "generics",
    "quiz",
    "training",
    "best practices",
    "JSDoc",
    "callbacks",
    "boolean props",
  ],
  authors: [{ name: "Sascha", url: "https://saschb2b.com/" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Can't Maintain",
    title: "Can't Maintain — React Component API Game",
    description:
      "Can you spot the better API? Train your eye for clean React component APIs in under 5 minutes.",
    url: siteUrl,
  },
  twitter: {
    card: "summary_large_image",
    title: "Can't Maintain — React Component API Game",
    description:
      "Can you spot the better API? Train your eye for clean React component APIs in under 5 minutes.",
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
              name: "Can't Maintain",
              url: siteUrl,
              description:
                "Train your eye for clean React component APIs. Pick the better pattern in side-by-side code challenges.",
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
          data-website-id="c4123bd8-26b2-45df-9f44-ff7139d83c30"
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
