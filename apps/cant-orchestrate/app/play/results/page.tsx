import type { Metadata } from "next";
import { ResultsRedirectSection } from "@cant/shared/components";
import { buildResultsMetadata } from "@cant/shared/lib/results-metadata";
import { decodeResults, getRank } from "@/lib/game/share";

interface Props {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  return buildResultsMetadata(searchParams, {
    appName: "Can't Orchestrate",
    siteUrl: "https://cant-orchestrate.saschb2b.com",
    ogAlt: "Can't Orchestrate: Container Orchestration Pattern Game",
    describeScore: (score, total) =>
      `I scored ${String(score)}/${String(total)} on spotting better container orchestration patterns. Can you beat my score? Train your eye for clean configs in under 5 minutes.`,
    decodeResults,
    getRank,
  });
}

export default function ResultsPage({ searchParams }: Props) {
  return <ResultsRedirectSection searchParams={searchParams} />;
}
