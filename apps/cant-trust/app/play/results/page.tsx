import type { Metadata } from "next";
import { decodeResults, getRank } from "@/lib/game/share";
import { ResultsRedirect } from "./results-redirect";

interface Props {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export async function generateMetadata({
  searchParams,
}: Props): Promise<Metadata> {
  const params = await searchParams;
  const r = typeof params.r === "string" ? params.r : undefined;
  const decoded = r ? decodeResults(r) : null;

  if (!decoded) {
    return { title: "Results | Can't Trust" };
  }

  const { score, total } = decoded;
  const percentage = Math.round((score / total) * 100);
  const rank = getRank(percentage);

  const title = `${rank} — ${String(score)}/${String(total)} | Can't Trust`;
  const description = `I scored ${String(score)}/${String(total)} on money, banking, and Bitcoin patterns. Can you beat my score?`;
  const ogImage = "https://cant-trust.saschb2b.com/opengraph-image";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      siteName: "Can't Trust",
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: "Can't Trust: Money, Banking & Bitcoin",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}

/**
 * Renders a minimal page so crawlers can read OG meta tags,
 * then redirects browsers to /play via client-side navigation.
 */
export default async function ResultsPage({ searchParams }: Props) {
  const params = await searchParams;
  const seed = typeof params.seed === "string" ? params.seed : undefined;
  return <ResultsRedirect seed={seed} />;
}
