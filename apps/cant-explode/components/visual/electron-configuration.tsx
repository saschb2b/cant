"use client";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
/* ---------- Types ---------- */

interface OrbitalGroup {
  label: string;
  /** Number of boxes (sub-orbitals) in this group */
  boxes: number;
  /** Electrons in each box: 0 = empty, 1 = up arrow only, 2 = paired */
  fill: number[];
}

/* ---------- Shared SVG renderer ---------- */

const BOX_W = 32;
const BOX_H = 40;
const BOX_GAP = 3;
const GROUP_GAP = 16;
const LABEL_H = 16;
const PAD = 12;

/** Pre-computed layout for a single orbital box. */
interface BoxLayout {
  gi: number;
  bi: number;
  x: number;
  y: number;
  electrons: number;
}

/** Pre-computed layout for a group of orbital boxes. */
interface GroupLayout {
  gi: number;
  label: string;
  labelX: number;
  boxes: BoxLayout[];
}

function computeLayout(groups: OrbitalGroup[]) {
  let totalBoxes = 0;
  let totalGroupGaps = 0;
  for (const [i, g] of groups.entries()) {
    totalBoxes += g.boxes;
    if (i > 0) totalGroupGaps += 1;
  }
  const contentW =
    totalBoxes * BOX_W +
    (totalBoxes - groups.length) * BOX_GAP +
    totalGroupGaps * GROUP_GAP;
  const svgW = contentW + PAD * 2;
  const svgH = LABEL_H + BOX_H + PAD * 2 + 4;

  let cursorX = PAD;
  const groupLayouts: GroupLayout[] = [];

  for (const [gi, group] of groups.entries()) {
    if (gi > 0) cursorX += GROUP_GAP;
    const groupStartX = cursorX;
    const boxes: BoxLayout[] = [];

    for (const [bi, electrons] of group.fill.entries()) {
      const x = cursorX;
      cursorX += BOX_W + (bi < group.boxes - 1 ? BOX_GAP : 0);
      boxes.push({ gi, bi, x, y: PAD, electrons });
    }

    const groupEndX = cursorX;
    const labelX = (groupStartX + groupEndX) / 2;
    groupLayouts.push({ gi, label: group.label, labelX, boxes });
  }

  return { svgW, svgH, groupLayouts };
}

function OrbitalDiagram({
  title,
  groups,
}: {
  title: string;
  groups: OrbitalGroup[];
}) {
  const borderColor = "var(--mui-palette-divider)";
  const boxFill = "var(--mui-palette-action-hover)";
  const arrowColor = "var(--mui-palette-text-primary)";
  const labelColor = "var(--mui-palette-text-secondary)";

  const { svgW, svgH, groupLayouts } = computeLayout(groups);

  return (
    <Box sx={{ width: 300, p: 1.5 }}>
      <Typography
        sx={{ fontSize: 12, fontWeight: 700, mb: 1, textAlign: "center" }}
      >
        {title}
      </Typography>
      <Box
        sx={{
          overflowX: "auto",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <svg
          width={svgW}
          height={svgH}
          viewBox={`0 0 ${String(svgW)} ${String(svgH)}`}
          style={{ display: "block" }}
        >
          {groupLayouts.map((gl) => (
            <g key={gl.gi}>
              {gl.boxes.map((box) => (
                <g key={`${String(box.gi)}-${String(box.bi)}`}>
                  {/* Box */}
                  <rect
                    x={box.x}
                    y={box.y}
                    width={BOX_W}
                    height={BOX_H}
                    fill={boxFill}
                    stroke={borderColor}
                    strokeWidth={1.5}
                    rx={2}
                  />
                  {/* Up arrow */}
                  {box.electrons >= 1 &&
                    (() => {
                      const ax =
                        box.electrons === 2
                          ? box.x + BOX_W / 2 - 7
                          : box.x + BOX_W / 2;
                      const top = box.y + 6;
                      const bot = box.y + BOX_H - 6;
                      return (
                        <g>
                          <line
                            x1={ax}
                            y1={bot}
                            x2={ax}
                            y2={top}
                            stroke={arrowColor}
                            strokeWidth={2.5}
                          />
                          <polygon
                            points={`${String(ax)},${String(top - 1)} ${String(ax - 5)},${String(top + 7)} ${String(ax + 5)},${String(top + 7)}`}
                            fill={arrowColor}
                          />
                        </g>
                      );
                    })()}
                  {/* Down arrow */}
                  {box.electrons === 2 &&
                    (() => {
                      const ax = box.x + BOX_W / 2 + 7;
                      const top = box.y + 6;
                      const bot = box.y + BOX_H - 6;
                      return (
                        <g>
                          <line
                            x1={ax}
                            y1={top}
                            x2={ax}
                            y2={bot}
                            stroke={arrowColor}
                            strokeWidth={2.5}
                          />
                          <polygon
                            points={`${String(ax)},${String(bot + 1)} ${String(ax - 5)},${String(bot - 7)} ${String(ax + 5)},${String(bot - 7)}`}
                            fill={arrowColor}
                          />
                        </g>
                      );
                    })()}
                </g>
              ))}
              <text
                x={gl.labelX}
                y={PAD + BOX_H + LABEL_H}
                textAnchor="middle"
                fontSize={10}
                fill={labelColor}
              >
                {gl.label}
              </text>
            </g>
          ))}
        </svg>
      </Box>
    </Box>
  );
}

/* ---------- ec-001: Nitrogen (1s2 2s2 2p3) ---------- */

export function NitrogenCorrectConfig() {
  return (
    <OrbitalDiagram
      title="Nitrogen: 1s² 2s² 2p³"
      groups={[
        { label: "1s", boxes: 1, fill: [2] },
        { label: "2s", boxes: 1, fill: [2] },
        { label: "2p", boxes: 3, fill: [1, 1, 1] },
      ]}
    />
  );
}

export function NitrogenWrongConfig() {
  return (
    <OrbitalDiagram
      title="Nitrogen: 1s² 2s² 2p³"
      groups={[
        { label: "1s", boxes: 1, fill: [2] },
        { label: "2s", boxes: 1, fill: [2] },
        { label: "2p", boxes: 3, fill: [2, 1, 0] },
      ]}
    />
  );
}

/* ---------- ec-002: Chromium exception ([Ar] 4s1 3d5) ---------- */

export function ChromiumCorrectConfig() {
  return (
    <OrbitalDiagram
      title="Chromium: [Ar] 4s¹ 3d⁵"
      groups={[
        { label: "4s", boxes: 1, fill: [1] },
        { label: "3d", boxes: 5, fill: [1, 1, 1, 1, 1] },
      ]}
    />
  );
}

export function ChromiumWrongConfig() {
  return (
    <OrbitalDiagram
      title="Chromium: [Ar] 4s² 3d⁴"
      groups={[
        { label: "4s", boxes: 1, fill: [2] },
        { label: "3d", boxes: 5, fill: [1, 1, 1, 1, 0] },
      ]}
    />
  );
}

/* ---------- ec-003: Oxygen (1s2 2s2 2p4) ---------- */

export function OxygenCorrectConfig() {
  return (
    <OrbitalDiagram
      title="Oxygen: 1s² 2s² 2p⁴"
      groups={[
        { label: "1s", boxes: 1, fill: [2] },
        { label: "2s", boxes: 1, fill: [2] },
        { label: "2p", boxes: 3, fill: [2, 1, 1] },
      ]}
    />
  );
}

export function OxygenWrongConfig() {
  return (
    <OrbitalDiagram
      title="Oxygen: 1s² 2s² 2p⁴"
      groups={[
        { label: "1s", boxes: 1, fill: [2] },
        { label: "2s", boxes: 1, fill: [2] },
        { label: "2p", boxes: 3, fill: [2, 2, 0] },
      ]}
    />
  );
}

/* ---------- ec-004: Iron ([Ar] 4s2 3d6) ---------- */

export function IronCorrectConfig() {
  return (
    <OrbitalDiagram
      title="Iron: [Ar] 4s² 3d⁶"
      groups={[
        { label: "4s", boxes: 1, fill: [2] },
        { label: "3d", boxes: 5, fill: [2, 1, 1, 1, 1] },
      ]}
    />
  );
}

export function IronWrongConfig() {
  return (
    <OrbitalDiagram
      title="Iron: [Ar] 4s² 3d⁶"
      groups={[
        { label: "4s", boxes: 1, fill: [2] },
        { label: "3d", boxes: 5, fill: [2, 2, 2, 0, 0] },
      ]}
    />
  );
}
