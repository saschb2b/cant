"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useTrackEvent } from "../lib/analytics-context";

export default function NotFound() {
  const router = useRouter();
  const pathname = usePathname();
  const trackEvent = useTrackEvent();

  useEffect(() => {
    trackEvent("404-visited", { path: pathname });
    router.replace("/");
  }, [router, pathname, trackEvent]);

  return null;
}
