import { describe, it, expect } from "vitest";
import { parseChangelog } from "./parse-changelog";

describe("parseChangelog", () => {
  it("parses a single version entry with sections and items", () => {
    const entries = parseChangelog(
      [
        "## [0.7.0] - 2026-03-06",
        "### Added",
        "- New ticket card",
        "- Retro export",
        "### Fixed",
        "- Contrast bug",
      ].join("\n"),
    );

    expect(entries).toHaveLength(1);
    expect(entries[0]).toEqual({
      version: "0.7.0",
      date: "2026-03-06",
      sections: [
        { type: "Added", items: ["New ticket card", "Retro export"] },
        { type: "Fixed", items: ["Contrast bug"] },
      ],
    });
  });

  it("splits multiple version entries and keeps document order", () => {
    const entries = parseChangelog(
      [
        "## [0.2.0] - 2026-02-01",
        "### Added",
        "- B feature",
        "## [0.1.0] - 2026-01-01",
        "### Added",
        "- A feature",
      ].join("\n"),
    );

    expect(entries.map((e) => e.version)).toEqual(["0.2.0", "0.1.0"]);
    expect(entries[1]?.sections[0]?.items).toEqual(["A feature"]);
  });

  it("trims surrounding whitespace from the date", () => {
    const [entry] = parseChangelog("## [1.0.0] -   2026-05-01  ");
    expect(entry?.date).toBe("2026-05-01");
  });

  it("appends a 2-space indented sub-item to the preceding item", () => {
    const [entry] = parseChangelog(
      [
        "## [1.0.0] - 2026-01-01",
        "### Changed",
        "- Parent item",
        "  - Child detail",
      ].join("\n"),
    );

    expect(entry?.sections[0]?.items).toEqual([
      "Parent item",
      "  Child detail",
    ]);
  });

  it("ignores a sub-item that has no preceding item in the section", () => {
    const [entry] = parseChangelog(
      ["## [1.0.0] - 2026-01-01", "### Added", "  - orphan sub-item"].join(
        "\n",
      ),
    );

    expect(entry?.sections[0]?.items).toEqual([]);
  });

  it("ignores a section header that appears before any version", () => {
    const entries = parseChangelog(["### Added", "- stray item"].join("\n"));
    expect(entries).toHaveLength(0);
  });

  it("ignores an item that appears before any section", () => {
    const [entry] = parseChangelog(
      ["## [1.0.0] - 2026-01-01", "- item with no section"].join("\n"),
    );
    expect(entry?.sections).toEqual([]);
  });

  it("ignores prose, blank lines, and the top title", () => {
    const entries = parseChangelog(
      [
        "# Changelog",
        "",
        "All notable changes are documented here.",
        "",
        "## [1.0.0] - 2026-01-01",
        "### Added",
        "- Real item",
      ].join("\n"),
    );

    expect(entries).toHaveLength(1);
    expect(entries[0]?.sections[0]?.items).toEqual(["Real item"]);
  });

  it("returns an empty array for empty input", () => {
    expect(parseChangelog("")).toEqual([]);
  });
});
