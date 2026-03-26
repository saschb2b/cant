/**
 * Thin wrapper around Umami's `umami.track()` for type-safe custom events.
 *
 * Each app defines its own EventMap and passes it as the generic parameter.
 *
 * @see https://umami.is/docs/tracker-functions
 *
 * @example
 * ```ts
 * interface MyEvents {
 *   "page-viewed": { path: string };
 *   "button-clicked": { id: string };
 * }
 * export const track = createTracker<MyEvents>();
 * track("page-viewed", { path: "/home" });
 * ```
 */

declare global {
  interface Window {
    umami?: { track: (event: string, data?: Record<string, unknown>) => void };
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function createTracker<EventMap extends Record<string, any>>() {
  return function trackEvent<K extends keyof EventMap & string>(
    event: K,
    data: EventMap[K],
  ): void {
    window.umami?.track(event, data as unknown as Record<string, unknown>);
  };
}
