"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

interface ResultsRedirectProps {
  /** Seed to resume, forwarded to /play as a query param. */
  seed?: string;
}

/**
 * Sends the browser on to /play. The results route exists so crawlers can
 * read the shared score's OG tags; humans never see it.
 */
export function ResultsRedirect({ seed }: ResultsRedirectProps) {
  const router = useRouter();

  useEffect(() => {
    router.replace(seed ? `/play?seed=${seed}` : "/play");
  }, [router, seed]);

  return null;
}
