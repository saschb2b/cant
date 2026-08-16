import { Suspense } from "react";
import { ResultsRedirect } from "./results-redirect";

type ResultsSearchParams = Promise<
  Record<string, string | string[] | undefined>
>;

async function RedirectWhenReady({
  searchParams,
}: {
  searchParams: ResultsSearchParams;
}) {
  const params = await searchParams;
  const seed = typeof params.seed === "string" ? params.seed : undefined;
  return <ResultsRedirect seed={seed} />;
}

/**
 * Body of a `/play/results` route. Reads the seed at request time inside a
 * Suspense boundary, which Cache Components requires, then hands off to the
 * client redirect.
 */
export function ResultsRedirectSection({
  searchParams,
}: {
  searchParams: ResultsSearchParams;
}) {
  return (
    <Suspense fallback={null}>
      <RedirectWhenReady searchParams={searchParams} />
    </Suspense>
  );
}
