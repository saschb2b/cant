/**
 * Formats a count with its noun, pluralizing for any value other than one.
 * `countLabel(1, "note")` returns "1 note"; `countLabel(3, "note")` returns
 * "3 notes". Pass an explicit plural when it is not just the singular plus an
 * "s" (e.g. `countLabel(2, "card or stack", "cards or stacks")`).
 */
export function countLabel(
  count: number,
  singular: string,
  plural = `${singular}s`,
): string {
  return `${String(count)} ${count === 1 ? singular : plural}`;
}
