import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import {
  ThemeProvider,
  AnalyticsProviderWrapper,
} from "@cant/shared/components";
import theme from "@/lib/theme";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

const siteUrl = "https://cant-hub.saschb2b.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Can't Hub - The Complete Series",
    template: "%s - Can't Hub",
  },
  description:
    "One game, every topic. Six series covering React, responsive design, TypeScript, DevOps, SEO, and UX. Pick the better pattern, learn why it matters.",
  keywords: [
    "web development quiz",
    "coding challenges",
    "React patterns",
    "responsive design",
    "TypeScript",
    "DevOps",
    "SEO",
    "UX design",
    "technical screening",
    "developer training",
  ],
  authors: [{ name: "Sascha", url: "https://saschb2b.com/" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Can't Hub",
    title: "Can't Hub - The Complete Series",
    description:
      "One game, every topic. Six series covering React, responsive design, TypeScript, DevOps, SEO, and UX.",
    url: siteUrl,
  },
  twitter: {
    card: "summary_large_image",
    title: "Can't Hub - The Complete Series",
    description:
      "One game, every topic. Six series covering React, responsive design, TypeScript, DevOps, SEO, and UX.",
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
              name: "Can't Hub",
              url: siteUrl,
              description:
                "One game, every topic. Six series covering React, responsive design, TypeScript, DevOps, SEO, and UX design patterns.",
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
          data-website-id="placeholder-hub-id"
        />
      </head>
      <body>
        <ThemeProvider theme={theme}>
          <AnalyticsProviderWrapper>{children}</AnalyticsProviderWrapper>
        </ThemeProvider>
      </body>
    </html>
  );
}
