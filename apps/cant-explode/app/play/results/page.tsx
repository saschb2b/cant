import type { Metadata } from "next";
import { ResultsRedirectSection } from "@cant/shared/components";
import { buildResultsMetadata } from "@cant/shared/lib/results-metadata";
import { decodeResults, getRank } from "@/lib/game/share";

interface Props {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  return buildResultsMetadata(searchParams, {
    appName: "Can't Explode",
    siteUrl: "https://cant-explode.saschb2b.com",
    ogAlt: "Can't Explode: Chemistry Challenge Game",
    describeScore: (score, total) =>
      `I scored ${String(score)}/${String(total)} on chemistry molecule comparisons. Can you beat my score? Test your chemistry instincts in under 5 minutes.`,
    decodeResults,
    getRank,
  });
}

export default function ResultsPage({ searchParams }: Props) {
  return <ResultsRedirectSection searchParams={searchParams} />;
}
