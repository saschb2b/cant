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

const siteUrl = "https://cant-trust.saschb2b.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Can't Trust - Money, Banking & Bitcoin",
    template: "%s - Can't Trust",
  },
  description:
    "Learn why trust is the problem in traditional finance and how Bitcoin removes the need for it. From money origins to cryptography, consensus, and self-custody.",
  keywords: [
    "bitcoin",
    "money",
    "banking",
    "inflation",
    "fiat currency",
    "cryptocurrency",
    "Cardano",
    "blockchain",
    "sound money",
    "fractional reserve",
    "self-custody",
    "Cantillon effect",
    "1971",
    "Nixon shock",
  ],
  authors: [{ name: "Sascha", url: "https://saschb2b.com/" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Can't Trust",
    title: "Can't Trust - Money, Banking & Bitcoin",
    description:
      "Learn why trust is the problem in traditional finance and how Bitcoin removes the need for it.",
    url: siteUrl,
  },
  twitter: {
    card: "summary_large_image",
    title: "Can't Trust - Money, Banking & Bitcoin",
    description:
      "Learn why trust is the problem in traditional finance and how Bitcoin removes the need for it.",
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
              name: "Can't Trust",
              url: siteUrl,
              description:
                "Learn why trust is the problem in traditional finance and how Bitcoin removes the need for it.",
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
          data-website-id="placeholder-cant-trust"
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
