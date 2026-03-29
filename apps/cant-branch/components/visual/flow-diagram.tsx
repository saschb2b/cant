"use client";

import Paper from "@mui/material/Paper";
import { ReactFlow, type Node, type Edge } from "@xyflow/react";
import "@xyflow/react/dist/style.css";

const flowWrapperSx = {
  width: "100%",
  height: 320,
  overflow: "hidden",
  "& .react-flow__attribution": { display: "none" },
} as const;

/* ---------- No branch protection ---------- */

const noBranchNodes: Node[] = [
  {
    id: "push",
    position: { x: 20, y: 110 },
    data: { label: "Push to main" },
    style: {
      background: "#ef5350",
      color: "#fff",
      border: "none",
      fontSize: 11,
      padding: "6px 12px",
    },
  },
  {
    id: "deploy",
    position: { x: 220, y: 110 },
    data: { label: "Deploy to production" },
    style: {
      background: "#ef5350",
      color: "#fff",
      border: "none",
      fontSize: 11,
      padding: "6px 12px",
    },
  },
];

const noBranchEdges: Edge[] = [
  { id: "e-push-deploy", source: "push", target: "deploy", animated: true },
];

export function FlowNoBranchProtection() {
  return (
    <Paper sx={flowWrapperSx}>
      <ReactFlow
        nodes={noBranchNodes}
        edges={noBranchEdges}
        fitView
        panOnDrag={false}
        zoomOnScroll={false}
        zoomOnPinch={false}
        zoomOnDoubleClick={false}
        preventScrolling={false}
        nodesDraggable={false}
        nodesConnectable={false}
        proOptions={{ hideAttribution: true }}
      />
    </Paper>
  );
}

/* ---------- With branch protection ---------- */

const protectedNodes: Node[] = [
  {
    id: "push",
    position: { x: 0, y: 100 },
    data: { label: "Push to branch" },
    style: {
      background: "#42a5f5",
      color: "#fff",
      border: "none",
      fontSize: 10,
      padding: "5px 8px",
    },
  },
  {
    id: "lint",
    position: { x: 140, y: 50 },
    data: { label: "Lint" },
    style: {
      background: "#66bb6a",
      color: "#fff",
      border: "none",
      fontSize: 10,
      padding: "5px 8px",
    },
  },
  {
    id: "test",
    position: { x: 140, y: 150 },
    data: { label: "Test" },
    style: {
      background: "#66bb6a",
      color: "#fff",
      border: "none",
      fontSize: 10,
      padding: "5px 8px",
    },
  },
  {
    id: "review",
    position: { x: 260, y: 100 },
    data: { label: "Code review" },
    style: {
      background: "#ab47bc",
      color: "#fff",
      border: "none",
      fontSize: 10,
      padding: "5px 8px",
    },
  },
  {
    id: "staging",
    position: { x: 380, y: 100 },
    data: { label: "Staging" },
    style: {
      background: "#ffa726",
      color: "#fff",
      border: "none",
      fontSize: 10,
      padding: "5px 8px",
    },
  },
  {
    id: "deploy",
    position: { x: 500, y: 100 },
    data: { label: "Deploy" },
    style: {
      background: "#42a5f5",
      color: "#fff",
      border: "none",
      fontSize: 10,
      padding: "5px 8px",
    },
  },
];

const protectedEdges: Edge[] = [
  { id: "e1", source: "push", target: "lint" },
  { id: "e2", source: "push", target: "test" },
  { id: "e3", source: "lint", target: "review" },
  { id: "e4", source: "test", target: "review" },
  { id: "e5", source: "review", target: "staging" },
  { id: "e6", source: "staging", target: "deploy", animated: true },
];

export function FlowWithProtection() {
  return (
    <Paper sx={flowWrapperSx}>
      <ReactFlow
        nodes={protectedNodes}
        edges={protectedEdges}
        fitView
        panOnDrag={false}
        zoomOnScroll={false}
        zoomOnPinch={false}
        zoomOnDoubleClick={false}
        preventScrolling={false}
        nodesDraggable={false}
        nodesConnectable={false}
        proOptions={{ hideAttribution: true }}
      />
    </Paper>
  );
}

/* ---------- No hooks (slow feedback loop) ---------- */

const noHooksNodes: Node[] = [
  {
    id: "commit",
    position: { x: 0, y: 110 },
    data: { label: "git commit" },
    style: {
      background: "#42a5f5",
      color: "#fff",
      border: "none",
      fontSize: 10,
      padding: "5px 8px",
    },
  },
  {
    id: "push",
    position: { x: 120, y: 110 },
    data: { label: "git push" },
    style: {
      background: "#42a5f5",
      color: "#fff",
      border: "none",
      fontSize: 10,
      padding: "5px 8px",
    },
  },
  {
    id: "ci",
    position: { x: 240, y: 110 },
    data: { label: "CI (5 min)" },
    style: {
      background: "#ffa726",
      color: "#fff",
      border: "none",
      fontSize: 10,
      padding: "5px 8px",
    },
  },
  {
    id: "fail",
    position: { x: 370, y: 110 },
    data: { label: "Lint fails" },
    style: {
      background: "#ef5350",
      color: "#fff",
      border: "none",
      fontSize: 10,
      padding: "5px 8px",
    },
  },
  {
    id: "fix",
    position: { x: 240, y: 20 },
    data: { label: "Fix locally" },
    style: {
      background: "#ef5350",
      color: "#fff",
      border: "none",
      fontSize: 10,
      padding: "5px 8px",
    },
  },
];

const noHooksEdges: Edge[] = [
  { id: "nh1", source: "commit", target: "push" },
  { id: "nh2", source: "push", target: "ci" },
  { id: "nh3", source: "ci", target: "fail" },
  { id: "nh4", source: "fail", target: "fix" },
  { id: "nh5", source: "fix", target: "commit", animated: true },
];

export function FlowNoHooks() {
  return (
    <Paper sx={flowWrapperSx}>
      <ReactFlow
        nodes={noHooksNodes}
        edges={noHooksEdges}
        fitView
        panOnDrag={false}
        zoomOnScroll={false}
        zoomOnPinch={false}
        zoomOnDoubleClick={false}
        preventScrolling={false}
        nodesDraggable={false}
        nodesConnectable={false}
        proOptions={{ hideAttribution: true }}
      />
    </Paper>
  );
}

/* ---------- With hooks (fast feedback loop) ---------- */

const withHooksNodes: Node[] = [
  {
    id: "commit",
    position: { x: 0, y: 110 },
    data: { label: "git commit" },
    style: {
      background: "#42a5f5",
      color: "#fff",
      border: "none",
      fontSize: 9,
      padding: "5px 6px",
    },
  },
  {
    id: "precommit",
    position: { x: 100, y: 110 },
    data: { label: "pre-commit: lint" },
    style: {
      background: "#66bb6a",
      color: "#fff",
      border: "none",
      fontSize: 9,
      padding: "5px 6px",
    },
  },
  {
    id: "commitmsg",
    position: { x: 230, y: 110 },
    data: { label: "commit-msg: validate" },
    style: {
      background: "#66bb6a",
      color: "#fff",
      border: "none",
      fontSize: 9,
      padding: "5px 6px",
    },
  },
  {
    id: "push",
    position: { x: 380, y: 50 },
    data: { label: "git push" },
    style: {
      background: "#42a5f5",
      color: "#fff",
      border: "none",
      fontSize: 9,
      padding: "5px 6px",
    },
  },
  {
    id: "prepush",
    position: { x: 380, y: 170 },
    data: { label: "pre-push: tests (30s)" },
    style: {
      background: "#66bb6a",
      color: "#fff",
      border: "none",
      fontSize: 9,
      padding: "5px 6px",
    },
  },
  {
    id: "ci",
    position: { x: 530, y: 110 },
    data: { label: "CI" },
    style: {
      background: "#66bb6a",
      color: "#fff",
      border: "none",
      fontSize: 9,
      padding: "5px 6px",
    },
  },
];

const withHooksEdges: Edge[] = [
  { id: "wh1", source: "commit", target: "precommit" },
  { id: "wh2", source: "precommit", target: "commitmsg" },
  { id: "wh3", source: "commitmsg", target: "push" },
  { id: "wh4", source: "commitmsg", target: "prepush" },
  { id: "wh5", source: "push", target: "ci" },
  { id: "wh6", source: "prepush", target: "ci", animated: true },
];

export function FlowWithHooks() {
  return (
    <Paper sx={flowWrapperSx}>
      <ReactFlow
        nodes={withHooksNodes}
        edges={withHooksEdges}
        fitView
        panOnDrag={false}
        zoomOnScroll={false}
        zoomOnPinch={false}
        zoomOnDoubleClick={false}
        preventScrolling={false}
        nodesDraggable={false}
        nodesConnectable={false}
        proOptions={{ hideAttribution: true }}
      />
    </Paper>
  );
}
