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

const siteUrl = "https://cant-query.saschb2b.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Can't Query - API Endpoint Patterns",
    template: "%s - Can't Query",
  },
  description:
    "Learn API endpoint patterns across REST, GraphQL, WebSockets, and more. Side-by-side comparisons of fragile vs resilient approaches.",
  keywords: [
    "API design",
    "REST API",
    "GraphQL",
    "WebSockets",
    "API patterns",
    "endpoint design",
    "HTTP methods",
    "API authentication",
    "error handling",
    "API consumption",
    "OpenAPI",
    "web development",
  ],
  authors: [{ name: "Sascha", url: "https://saschb2b.com/" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Can't Query",
    title: "Can't Query - API Endpoint Patterns",
    description:
      "Learn API endpoint patterns across REST, GraphQL, WebSockets, and more. Side-by-side comparisons with explanations.",
    url: siteUrl,
  },
  twitter: {
    card: "summary_large_image",
    title: "Can't Query - API Endpoint Patterns",
    description:
      "Learn API endpoint patterns across REST, GraphQL, WebSockets, and more. Side-by-side comparisons with explanations.",
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
              name: "Can't Query",
              url: siteUrl,
              description:
                "Learn API endpoint patterns across REST, GraphQL, WebSockets, and more. Side-by-side comparisons with explanations.",
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
          data-website-id="a9cc485d-f481-4d35-a738-2ec0d4bdef33"
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
