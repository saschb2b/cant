import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import { ThemeProvider } from "@/components/theme-provider";

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
        <Script
          async
          src="https://umami.saschb2b.com/script.js"
          data-website-id="feed24d7-ba3d-4869-9ea7-0b05343937ab"
        />
      </head>
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
