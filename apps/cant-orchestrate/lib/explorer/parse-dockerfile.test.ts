import { describe, it, expect } from "vitest";
import { parseDockerfile } from "./parse-dockerfile";

describe("parseDockerfile", () => {
  it("parses a single-stage Dockerfile into one stage with its instructions", () => {
    const { stages } = parseDockerfile(
      ["FROM node:18-alpine", "WORKDIR /app", "COPY . .", "RUN npm ci"].join(
        "\n",
      ),
    );

    expect(stages).toHaveLength(1);
    const stage = stages[0];
    expect(stage?.index).toBe(0);
    expect(stage?.baseImage).toBe("node:18-alpine");
    expect(stage?.tag).toBe("18-alpine");
    expect(stage?.name).toBeNull();
    expect(stage?.instructions.map((i) => i.instruction)).toEqual([
      "WORKDIR",
      "COPY",
      "RUN",
    ]);
  });

  it("preserves 1-based line numbers across comments and blank lines", () => {
    const { stages } = parseDockerfile(
      [
        "# base image", // 1
        "", // 2
        "FROM ubuntu", // 3
        "# install deps", // 4
        "RUN apt-get update", // 5
      ].join("\n"),
    );

    const run = stages[0]?.instructions[0];
    expect(run?.instruction).toBe("RUN");
    expect(run?.line).toBe(5);
  });

  it("merges backslash line continuations into a single instruction", () => {
    const { stages } = parseDockerfile(
      [
        "FROM ubuntu", // 1
        "RUN apt-get update \\", // 2
        "    && apt-get install -y curl", // 3
      ].join("\n"),
    );

    const run = stages[0]?.instructions[0];
    expect(run?.instruction).toBe("RUN");
    expect(run?.line).toBe(2);
    expect(run?.args).toBe("apt-get update && apt-get install -y curl");
    // raw keeps both physical lines
    expect(run?.raw).toContain("\\");
    expect(run?.raw.split("\n")).toHaveLength(2);
  });

  it("splits multi-stage builds and records the AS alias", () => {
    const { stages } = parseDockerfile(
      [
        "FROM node:18 AS builder",
        "RUN npm run build",
        "FROM nginx:alpine",
        "COPY --from=builder /app/dist /usr/share/nginx/html",
      ].join("\n"),
    );

    expect(stages).toHaveLength(2);
    expect(stages[0]?.name).toBe("builder");
    expect(stages[0]?.baseImage).toBe("node:18");
    expect(stages[1]?.index).toBe(1);
    expect(stages[1]?.name).toBeNull();
    expect(stages[1]?.baseImage).toBe("nginx:alpine");
  });

  it("collects pre-FROM instructions into an implicit global stage", () => {
    const { stages } = parseDockerfile(
      ["ARG NODE_VERSION=18", "FROM node:${NODE_VERSION}"].join("\n"),
    );

    expect(stages).toHaveLength(2);
    expect(stages[0]?.baseImage).toBe("(global)");
    expect(stages[0]?.name).toBeNull();
    expect(stages[0]?.instructions[0]?.instruction).toBe("ARG");
    expect(stages[1]?.baseImage).toBe("node:${NODE_VERSION}");
  });

  it("treats a heredoc block as one instruction and keeps later line numbers", () => {
    const { stages } = parseDockerfile(
      [
        "FROM ubuntu", // 1
        "RUN <<EOF", // 2
        "echo hello", // 3
        "echo world", // 4
        "EOF", // 5
        "COPY . /app", // 6
      ].join("\n"),
    );

    const instructions = stages[0]?.instructions ?? [];
    // The echo lines inside the heredoc are not parsed as instructions.
    expect(instructions.map((i) => i.instruction)).toEqual(["RUN", "COPY"]);
    expect(instructions[0]?.raw).toContain("echo hello");
    expect(instructions[1]?.line).toBe(6);
  });

  it("flags only FROM, RUN, COPY, and ADD as layer-creating", () => {
    const { stages } = parseDockerfile(
      [
        "FROM ubuntu",
        "RUN echo hi",
        "COPY . .",
        "ADD file.tar /",
        "ENV KEY=value",
        "WORKDIR /app",
        'CMD ["node"]',
      ].join("\n"),
    );

    const layerFlags = Object.fromEntries(
      (stages[0]?.instructions ?? []).map((i) => [
        i.instruction,
        i.createsLayer,
      ]),
    );
    expect(layerFlags).toMatchObject({
      RUN: true,
      COPY: true,
      ADD: true,
      ENV: false,
      WORKDIR: false,
      CMD: false,
    });
  });

  describe("FROM argument parsing", () => {
    it("strips a --platform flag before the image", () => {
      const stage = parseDockerfile("FROM --platform=linux/amd64 node:20")
        .stages[0];
      expect(stage?.baseImage).toBe("node:20");
      expect(stage?.tag).toBe("20");
    });

    it("leaves tag null when no tag is given", () => {
      const stage = parseDockerfile("FROM ubuntu").stages[0];
      expect(stage?.baseImage).toBe("ubuntu");
      expect(stage?.tag).toBeNull();
    });

    it("keeps the registry/path when splitting image and tag", () => {
      const stage = parseDockerfile("FROM gcr.io/distroless/static:nonroot")
        .stages[0];
      expect(stage?.baseImage).toBe("gcr.io/distroless/static:nonroot");
      expect(stage?.tag).toBe("nonroot");
    });

    it("captures a @sha256 digest as the tag", () => {
      const stage = parseDockerfile("FROM alpine@sha256:abc123 AS pinned")
        .stages[0];
      expect(stage?.name).toBe("pinned");
      expect(stage?.tag).toBe("@sha256:abc123");
    });
  });

  it("returns no stages for empty or comment-only input", () => {
    expect(parseDockerfile("").stages).toHaveLength(0);
    expect(parseDockerfile("# just a comment\n\n").stages).toHaveLength(0);
  });
});
