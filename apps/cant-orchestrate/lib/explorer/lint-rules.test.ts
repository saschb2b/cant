import { describe, it, expect } from "vitest";
import { parseDockerfile } from "./parse-dockerfile";
import { lintDockerfile } from "./lint-rules";

/** Lint a Dockerfile and return just the triggered rule ids. */
function rules(dockerfile: string): string[] {
  return lintDockerfile(parseDockerfile(dockerfile)).map((i) => i.rule);
}

describe("lintDockerfile", () => {
  it("returns issues shaped as { severity, line, rule, message }", () => {
    const issues = lintDockerfile(parseDockerfile("FROM node:latest"));
    const latest = issues.find((i) => i.rule === "latest-tag");
    expect(latest).toMatchObject({
      severity: "warning",
      rule: "latest-tag",
    });
    expect(typeof latest?.message).toBe("string");
    expect(latest?.line).toBeNull();
  });

  describe("latest-tag", () => {
    it("warns on an untagged or :latest base image", () => {
      expect(rules("FROM node")).toContain("latest-tag");
      expect(rules("FROM node:latest")).toContain("latest-tag");
    });

    it("accepts a pinned tag and ignores the implicit global stage", () => {
      expect(rules("FROM node:18-alpine")).not.toContain("latest-tag");
      expect(rules("ARG V=18\nFROM node:18")).not.toContain("latest-tag");
    });
  });

  describe("multiple-run", () => {
    it("warns on consecutive RUN instructions", () => {
      expect(rules("FROM node:18\nRUN echo a\nRUN echo b")).toContain(
        "multiple-run",
      );
    });

    it("does not warn when RUNs are separated by other instructions", () => {
      expect(
        rules("FROM node:18\nRUN echo a\nCOPY x y\nRUN echo b"),
      ).not.toContain("multiple-run");
    });
  });

  describe("copy-before-deps", () => {
    it("warns when a broad COPY precedes a dependency install", () => {
      expect(rules("FROM node:18\nCOPY . .\nRUN npm ci")).toContain(
        "copy-before-deps",
      );
    });

    it("accepts copying the manifest, installing, then copying the rest", () => {
      expect(
        rules("FROM node:18\nCOPY package.json .\nRUN npm ci\nCOPY . ."),
      ).not.toContain("copy-before-deps");
    });
  });

  describe("no-user", () => {
    it("flags a final stage that never sets USER", () => {
      expect(rules('FROM node:18\nCMD ["node"]')).toContain("no-user");
    });

    it("is satisfied once USER is set", () => {
      expect(rules('FROM node:18\nUSER app\nCMD ["node"]')).not.toContain(
        "no-user",
      );
    });
  });

  describe("apt-no-clean", () => {
    it("warns when apt-get install does not clean the cache", () => {
      expect(rules("FROM ubuntu:22.04\nRUN apt-get install -y curl")).toContain(
        "apt-no-clean",
      );
    });

    it("accepts a RUN that removes the apt lists in the same layer", () => {
      expect(
        rules(
          "FROM ubuntu:22.04\nRUN apt-get install -y curl && rm -rf /var/lib/apt/lists/*",
        ),
      ).not.toContain("apt-no-clean");
    });
  });

  describe("add-vs-copy", () => {
    it("suggests COPY for a plain file ADD", () => {
      expect(rules("FROM node:18\nADD app.js /app/")).toContain("add-vs-copy");
    });

    it("leaves ADD alone for URLs and archives", () => {
      expect(
        rules("FROM node:18\nADD https://example.com/f.txt /app/"),
      ).not.toContain("add-vs-copy");
      expect(rules("FROM node:18\nADD bundle.tar.gz /app/")).not.toContain(
        "add-vs-copy",
      );
    });
  });

  describe("missing-healthcheck", () => {
    it("flags a runnable final stage without a HEALTHCHECK", () => {
      expect(rules('FROM nginx:alpine\nCMD ["nginx"]')).toContain(
        "missing-healthcheck",
      );
    });

    it("is satisfied when a HEALTHCHECK is present", () => {
      expect(
        rules(
          'FROM nginx:alpine\nHEALTHCHECK CMD curl -f http://localhost/ || exit 1\nCMD ["nginx"]',
        ),
      ).not.toContain("missing-healthcheck");
    });

    it("ignores build-only final stages (no CMD or ENTRYPOINT)", () => {
      expect(rules("FROM node:18\nRUN npm run build")).not.toContain(
        "missing-healthcheck",
      );
    });
  });
});
