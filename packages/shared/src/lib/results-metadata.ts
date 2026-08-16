import type { Metadata } from "next";

interface DecodedResults {
  score: number;
  total: number;
}

export interface ResultsMetadataConfig {
  /** Display name, e.g. "Can't Resize". */
  appName: string;
  /** Origin of the deployed app, without a trailing slash. */
  siteUrl: string;
  /** Alt text for the OG image. */
  ogAlt: string;
  /** Share copy for a given score, written per app. */
  describeScore: (score: number, total: number) => string;
  /** Decodes the `r` query param produced when a game is shared. */
  decodeResults: (param: string) => DecodedResults | null;
  /** Maps a percentage to a rank title. */
  getRank: (percentage: number) => string;
}

/**
 * Builds the Open Graph and Twitter metadata for a `/play/results` route.
 *
 * The route is only ever hit by crawlers following a shared link, so the
 * score has to come out of the URL rather than any stored state. Falls back
 * to a plain title when the param is missing or unreadable.
 */
export async function buildResultsMetadata(
  searchParams: Promise<Record<string, string | string[] | undefined>>,
  config: ResultsMetadataConfig,
): Promise<Metadata> {
  const params = await searchParams;
  const r = typeof params.r === "string" ? params.r : undefined;
  const decoded = r ? config.decodeResults(r) : null;

  if (!decoded) {
    return { title: { absolute: `Results | ${config.appName}` } };
  }

  const { score, total } = decoded;
  const percentage = Math.round((score / total) * 100);
  const rank = config.getRank(percentage);

  const title = `${rank} — ${String(score)}/${String(total)} | ${config.appName}`;
  const description = config.describeScore(score, total);
  const ogImage = `${config.siteUrl}/opengraph-image`;

  return {
    // Absolute, so the root layout's "%s - App" template does not append the
    // app name a second time.
    title: { absolute: title },
    description,
    openGraph: {
      title,
      description,
      type: "website",
      siteName: config.appName,
      images: [{ url: ogImage, width: 1200, height: 630, alt: config.ogAlt }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}
