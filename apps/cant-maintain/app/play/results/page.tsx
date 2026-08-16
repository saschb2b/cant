import type { Metadata } from "next";
import { ResultsRedirectSection } from "@cant/shared/components";
import { buildResultsMetadata } from "@cant/shared/lib/results-metadata";
import { decodeResults, getRank } from "@/lib/game/share";

interface Props {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  return buildResultsMetadata(searchParams, {
    appName: "Can't Maintain",
    siteUrl: "https://cant-maintain.saschb2b.com",
    ogAlt: "Can't Maintain — React Component API Game",
    describeScore: (score, total) =>
      `I scored ${String(score)}/${String(total)} on spotting better React component APIs. Can you beat my score? Train your eye for clean React component APIs in under 5 minutes.`,
    decodeResults,
    getRank,
  });
}

export default function ResultsPage({ searchParams }: Props) {
  return <ResultsRedirectSection searchParams={searchParams} />;
}
