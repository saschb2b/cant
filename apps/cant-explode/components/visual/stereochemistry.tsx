"use client";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
/* ---------- Shared constants ---------- */

const W = 300;
const H = 250;

/** Wrapper that centers an SVG diagram with a caption. */
function DiagramShell({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 1,
        p: 2,
      }}
    >
      <svg
        viewBox={`0 0 ${String(W)} ${String(H)}`}
        width={W}
        height={H}
        style={{ maxWidth: "100%" }}
      >
        {children}
      </svg>
      <Typography variant="caption" color="text.secondary">
        {title}
      </Typography>
    </Box>
  );
}

/* ====================================================================
   st-001: Newman projection of ethane, staggered vs eclipsed
   ==================================================================== */

const CX = 150;
const CY = 120;
const BOND_LEN = 65;
const CIRCLE_R = 30;

/** Helper: point on a circle at a given angle (degrees). */
function polarPoint(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = (angleDeg * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy - r * Math.sin(rad) };
}

export function NewmanStaggered() {
  const bond = "var(--mui-palette-text-primary)";
  const labelColor = "var(--mui-palette-text-secondary)";
  const circle = "var(--mui-palette-divider)";

  // Front carbon bonds at 90, 210, 330 degrees
  const frontAngles = [90, 210, 330];
  // Back carbon bonds offset by 60 degrees: 150, 270, 30
  const backAngles = [30, 150, 270];

  return (
    <DiagramShell title="Newman projection: staggered conformation">
      {/* Back bonds (drawn first, clipped at circle edge) */}
      {backAngles.map((a) => {
        const outer = polarPoint(CX, CY, BOND_LEN, a);
        const edge = polarPoint(CX, CY, CIRCLE_R, a);
        return (
          <g key={`back-${String(a)}`}>
            <line
              x1={edge.x}
              y1={edge.y}
              x2={outer.x}
              y2={outer.y}
              stroke={bond}
              strokeWidth={2}
            />
            <text
              x={outer.x + (outer.x > CX ? 6 : -6)}
              y={outer.y + (outer.y > CY ? 14 : -6)}
              textAnchor="middle"
              fill={labelColor}
              fontSize={11}
              fontFamily="inherit"
            >
              H
            </text>
          </g>
        );
      })}
      {/* Circle representing back carbon */}
      <circle
        cx={CX}
        cy={CY}
        r={CIRCLE_R}
        fill="none"
        stroke={circle}
        strokeWidth={1.5}
      />
      {/* Front bonds (from center to outer) */}
      {frontAngles.map((a) => {
        const outer = polarPoint(CX, CY, BOND_LEN, a);
        return (
          <g key={`front-${String(a)}`}>
            <line
              x1={CX}
              y1={CY}
              x2={outer.x}
              y2={outer.y}
              stroke={bond}
              strokeWidth={2}
            />
            <text
              x={outer.x + (outer.x > CX ? 6 : outer.x < CX ? -6 : 0)}
              y={outer.y + (outer.y > CY ? 14 : -6)}
              textAnchor="middle"
              fill={labelColor}
              fontSize={11}
              fontFamily="inherit"
            >
              H
            </text>
          </g>
        );
      })}
      {/* Center dot for front carbon */}
      <circle cx={CX} cy={CY} r={2.5} fill={bond} />
      {/* Torsion angle label */}
      <text
        x={CX}
        y={H - 20}
        textAnchor="middle"
        fill={labelColor}
        fontSize={10}
        fontFamily="inherit"
      >
        Dihedral angle: 60 degrees
      </text>
    </DiagramShell>
  );
}

export function NewmanEclipsed() {
  const bond = "var(--mui-palette-text-primary)";
  const labelColor = "var(--mui-palette-text-secondary)";
  const circle = "var(--mui-palette-divider)";
  const backBond = "var(--mui-palette-action-disabled)";

  // Front and back bonds at same angles (eclipsed)
  const angles = [90, 210, 330];

  return (
    <DiagramShell title="Newman projection: eclipsed conformation">
      {/* Back bonds (slightly offset to show they are behind) */}
      {angles.map((a) => {
        const outer = polarPoint(CX, CY, BOND_LEN + 8, a + 8);
        const edge = polarPoint(CX, CY, CIRCLE_R, a + 8);
        return (
          <g key={`back-${String(a)}`}>
            <line
              x1={edge.x}
              y1={edge.y}
              x2={outer.x}
              y2={outer.y}
              stroke={backBond}
              strokeWidth={2}
            />
            <text
              x={outer.x + (outer.x > CX ? 8 : -8)}
              y={outer.y + (outer.y > CY ? 14 : -6)}
              textAnchor="middle"
              fill={labelColor}
              fontSize={10}
              fontFamily="inherit"
              opacity={0.6}
            >
              H
            </text>
          </g>
        );
      })}
      {/* Circle */}
      <circle
        cx={CX}
        cy={CY}
        r={CIRCLE_R}
        fill="none"
        stroke={circle}
        strokeWidth={1.5}
      />
      {/* Front bonds */}
      {angles.map((a) => {
        const outer = polarPoint(CX, CY, BOND_LEN, a);
        return (
          <g key={`front-${String(a)}`}>
            <line
              x1={CX}
              y1={CY}
              x2={outer.x}
              y2={outer.y}
              stroke={bond}
              strokeWidth={2}
            />
            <text
              x={outer.x + (outer.x > CX ? 6 : outer.x < CX ? -6 : 0)}
              y={outer.y + (outer.y > CY ? 14 : -6)}
              textAnchor="middle"
              fill={labelColor}
              fontSize={11}
              fontFamily="inherit"
            >
              H
            </text>
          </g>
        );
      })}
      <circle cx={CX} cy={CY} r={2.5} fill={bond} />
      <text
        x={CX}
        y={H - 20}
        textAnchor="middle"
        fill={labelColor}
        fontSize={10}
        fontFamily="inherit"
      >
        Dihedral angle: 0 degrees
      </text>
    </DiagramShell>
  );
}

/* ====================================================================
   st-002: Fischer projection of (R) vs (S)-glyceraldehyde
   ==================================================================== */

function FischerProjection({
  title,
  leftGroup,
  rightGroup,
}: {
  title: string;
  leftGroup: string;
  rightGroup: string;
}) {
  const bond = "var(--mui-palette-text-primary)";
  const labelColor = "var(--mui-palette-text-primary)";
  const secondary = "var(--mui-palette-text-secondary)";

  const cx = 150;
  const cy = 125;
  const vLen = 70; // vertical bond length
  const hLen = 55; // horizontal bond length

  return (
    <DiagramShell title={title}>
      {/* Vertical line (carbon chain) */}
      <line
        x1={cx}
        y1={cy - vLen}
        x2={cx}
        y2={cy + vLen}
        stroke={bond}
        strokeWidth={2}
      />
      {/* Horizontal line (substituents) */}
      <line
        x1={cx - hLen}
        y1={cy}
        x2={cx + hLen}
        y2={cy}
        stroke={bond}
        strokeWidth={2}
      />
      {/* Center dot (chiral carbon) */}
      <circle cx={cx} cy={cy} r={3} fill={bond} />
      {/* Top group: CHO */}
      <text
        x={cx}
        y={cy - vLen - 10}
        textAnchor="middle"
        fill={labelColor}
        fontSize={13}
        fontFamily="inherit"
        fontWeight={600}
      >
        CHO
      </text>
      {/* Bottom group: CH2OH */}
      <text
        x={cx}
        y={cy + vLen + 18}
        textAnchor="middle"
        fill={labelColor}
        fontSize={13}
        fontFamily="inherit"
        fontWeight={600}
      >
        CH&#x2082;OH
      </text>
      {/* Left group */}
      <text
        x={cx - hLen - 10}
        y={cy + 4}
        textAnchor="end"
        fill={labelColor}
        fontSize={13}
        fontFamily="inherit"
        fontWeight={600}
      >
        {leftGroup}
      </text>
      {/* Right group */}
      <text
        x={cx + hLen + 10}
        y={cy + 4}
        textAnchor="start"
        fill={labelColor}
        fontSize={13}
        fontFamily="inherit"
        fontWeight={600}
      >
        {rightGroup}
      </text>
      {/* Chiral center label */}
      <text
        x={cx + 10}
        y={cy - 8}
        fill={secondary}
        fontSize={9}
        fontFamily="inherit"
      >
        C*
      </text>
    </DiagramShell>
  );
}

export function FischerR() {
  return (
    <FischerProjection
      title="(R)-Glyceraldehyde (OH on right)"
      leftGroup="H"
      rightGroup="OH"
    />
  );
}

export function FischerS() {
  return (
    <FischerProjection
      title="(S)-Glyceraldehyde (OH on left)"
      leftGroup="OH"
      rightGroup="H"
    />
  );
}

/* ====================================================================
   st-003: Chair cyclohexane, axial vs equatorial methyl
   ==================================================================== */

/**
 * Chair cyclohexane points. The chair is drawn as a standard organic
 * chemistry zig-zag with 6 vertices.
 */
const CHAIR_C1 = { x: 80, y: 130 };
const CHAIR_C2 = { x: 110, y: 160 };
const CHAIR_C3 = { x: 170, y: 160 };
const CHAIR_C4 = { x: 220, y: 130 };
const CHAIR_C5 = { x: 190, y: 100 };
const CHAIR_C6 = { x: 130, y: 100 };
const CHAIR_POINTS = [
  CHAIR_C1,
  CHAIR_C2,
  CHAIR_C3,
  CHAIR_C4,
  CHAIR_C5,
  CHAIR_C6,
];

function chairPath(): string {
  return (
    CHAIR_POINTS.map(
      (p, i) => `${i === 0 ? "M" : "L"} ${String(p.x)} ${String(p.y)}`,
    ).join(" ") + " Z"
  );
}

export function ChairAxialMethyl() {
  const bond = "var(--mui-palette-text-primary)";
  const secondary = "var(--mui-palette-text-secondary)";
  const accent = "var(--mui-palette-error-main)";

  // Axial substituent on C1 goes straight up
  const sub = CHAIR_C1;

  return (
    <DiagramShell title="Chair cyclohexane: axial methyl (less stable)">
      <path d={chairPath()} fill="none" stroke={bond} strokeWidth={2} />
      {/* Axial bond (vertical up from C1) */}
      <line
        x1={sub.x}
        y1={sub.y}
        x2={sub.x}
        y2={sub.y - 45}
        stroke={accent}
        strokeWidth={2.5}
      />
      <text
        x={sub.x}
        y={sub.y - 52}
        textAnchor="middle"
        fill={accent}
        fontSize={12}
        fontFamily="inherit"
        fontWeight={700}
      >
        CH&#x2083;
      </text>
      {/* Label "axial" */}
      <text
        x={sub.x + 25}
        y={sub.y - 30}
        fill={secondary}
        fontSize={9}
        fontFamily="inherit"
      >
        axial
      </text>
      {/* H atoms on other carbons (simplified, just show a couple) */}
      {CHAIR_POINTS.slice(1).map((p, i) => (
        <g key={i}>
          <line
            x1={p.x}
            y1={p.y}
            x2={p.x + (i % 2 === 0 ? 0 : 0)}
            y2={p.y + (i % 2 === 0 ? 15 : -15)}
            stroke={bond}
            strokeWidth={1}
            opacity={0.3}
          />
        </g>
      ))}
      {/* 1,3-diaxial strain indicator */}
      <text
        x={W / 2}
        y={H - 18}
        textAnchor="middle"
        fill={secondary}
        fontSize={9}
        fontFamily="inherit"
      >
        1,3-diaxial interactions cause strain
      </text>
    </DiagramShell>
  );
}

export function ChairEquatorialMethyl() {
  const bond = "var(--mui-palette-text-primary)";
  const secondary = "var(--mui-palette-text-secondary)";
  const accent = "var(--mui-palette-success-main)";

  // Equatorial substituent on C1 goes out and slightly down
  const sub = CHAIR_C1;

  return (
    <DiagramShell title="Chair cyclohexane: equatorial methyl (more stable)">
      <path d={chairPath()} fill="none" stroke={bond} strokeWidth={2} />
      {/* Equatorial bond (out to the left and slightly down) */}
      <line
        x1={sub.x}
        y1={sub.y}
        x2={sub.x - 40}
        y2={sub.y + 20}
        stroke={accent}
        strokeWidth={2.5}
      />
      <text
        x={sub.x - 52}
        y={sub.y + 28}
        textAnchor="middle"
        fill={accent}
        fontSize={12}
        fontFamily="inherit"
        fontWeight={700}
      >
        CH&#x2083;
      </text>
      {/* Label "equatorial" */}
      <text
        x={sub.x - 20}
        y={sub.y + 42}
        fill={secondary}
        fontSize={9}
        fontFamily="inherit"
      >
        equatorial
      </text>
      {/* Simplified H atoms */}
      {CHAIR_POINTS.slice(1).map((p, i) => (
        <g key={i}>
          <line
            x1={p.x}
            y1={p.y}
            x2={p.x + (i % 2 === 0 ? 0 : 0)}
            y2={p.y + (i % 2 === 0 ? 15 : -15)}
            stroke={bond}
            strokeWidth={1}
            opacity={0.3}
          />
        </g>
      ))}
      <text
        x={W / 2}
        y={H - 18}
        textAnchor="middle"
        fill={secondary}
        fontSize={9}
        fontFamily="inherit"
      >
        Minimal steric strain
      </text>
    </DiagramShell>
  );
}

/* ====================================================================
   st-004: Cis vs trans decalin ring fusion
   ==================================================================== */

/** Two fused chair-like hexagons sharing an edge. */

export function CisDecalin() {
  const bond = "var(--mui-palette-text-primary)";
  const secondary = "var(--mui-palette-text-secondary)";
  const accent = "var(--mui-palette-warning-main)";

  // Left ring
  const leftRing = [
    { x: 60, y: 100 },
    { x: 85, y: 130 },
    { x: 125, y: 130 },
    { x: 150, y: 100 },
    { x: 125, y: 70 },
    { x: 85, y: 70 },
  ];

  // Right ring shares edge C4-C3 (indices 2,3 of left ring)
  const rightRing = [
    { x: 125, y: 130 }, // shared with left[2]
    { x: 150, y: 160 },
    { x: 190, y: 160 },
    { x: 215, y: 130 },
    { x: 190, y: 100 },
    { x: 150, y: 100 }, // shared with left[3]
  ];

  const leftPath =
    leftRing
      .map((p, i) => `${i === 0 ? "M" : "L"} ${String(p.x)} ${String(p.y)}`)
      .join(" ") + " Z";
  const rightPath =
    rightRing
      .map((p, i) => `${i === 0 ? "M" : "L"} ${String(p.x)} ${String(p.y)}`)
      .join(" ") + " Z";

  // Cis: both ring-junction H atoms on same side
  // Junction carbons are at the shared edge (indices 2 and 3 of leftRing)
  const j1 = { x: 125, y: 130 };
  const j2 = { x: 150, y: 100 };

  return (
    <DiagramShell title="Cis-decalin (ring junction H atoms on same side)">
      <path d={leftPath} fill="none" stroke={bond} strokeWidth={2} />
      <path d={rightPath} fill="none" stroke={bond} strokeWidth={2} />
      {/* Junction H atoms both pointing up (cis) */}
      <line
        x1={j1.x}
        y1={j1.y}
        x2={j1.x}
        y2={j1.y - 25}
        stroke={accent}
        strokeWidth={2}
      />
      <text
        x={j1.x}
        y={j1.y - 30}
        textAnchor="middle"
        fill={accent}
        fontSize={10}
        fontFamily="inherit"
        fontWeight={600}
      >
        H
      </text>
      <line
        x1={j2.x}
        y1={j2.y}
        x2={j2.x}
        y2={j2.y - 25}
        stroke={accent}
        strokeWidth={2}
      />
      <text
        x={j2.x}
        y={j2.y - 30}
        textAnchor="middle"
        fill={accent}
        fontSize={10}
        fontFamily="inherit"
        fontWeight={600}
      >
        H
      </text>
      {/* "cis" label */}
      <text
        x={(j1.x + j2.x) / 2}
        y={j1.y - 42}
        textAnchor="middle"
        fill={secondary}
        fontSize={9}
        fontFamily="inherit"
      >
        cis (same side)
      </text>
      <text
        x={W / 2}
        y={H - 10}
        textAnchor="middle"
        fill={secondary}
        fontSize={9}
        fontFamily="inherit"
      >
        Flexible, can ring-flip
      </text>
    </DiagramShell>
  );
}

export function TransDecalin() {
  const bond = "var(--mui-palette-text-primary)";
  const secondary = "var(--mui-palette-text-secondary)";
  const accent = "var(--mui-palette-info-main)";

  // Same ring geometry
  const leftRing = [
    { x: 60, y: 100 },
    { x: 85, y: 130 },
    { x: 125, y: 130 },
    { x: 150, y: 100 },
    { x: 125, y: 70 },
    { x: 85, y: 70 },
  ];

  const rightRing = [
    { x: 125, y: 130 },
    { x: 150, y: 160 },
    { x: 190, y: 160 },
    { x: 215, y: 130 },
    { x: 190, y: 100 },
    { x: 150, y: 100 },
  ];

  const leftPath =
    leftRing
      .map((p, i) => `${i === 0 ? "M" : "L"} ${String(p.x)} ${String(p.y)}`)
      .join(" ") + " Z";
  const rightPath =
    rightRing
      .map((p, i) => `${i === 0 ? "M" : "L"} ${String(p.x)} ${String(p.y)}`)
      .join(" ") + " Z";

  // Junction carbons at the shared edge
  const j1 = { x: 125, y: 130 };
  const j2 = { x: 150, y: 100 };

  return (
    <DiagramShell title="Trans-decalin (ring junction H atoms on opposite sides)">
      <path d={leftPath} fill="none" stroke={bond} strokeWidth={2} />
      <path d={rightPath} fill="none" stroke={bond} strokeWidth={2} />
      {/* Junction H atoms: one up, one down (trans) */}
      <line
        x1={j1.x}
        y1={j1.y}
        x2={j1.x}
        y2={j1.y + 25}
        stroke={accent}
        strokeWidth={2}
      />
      <text
        x={j1.x}
        y={j1.y + 38}
        textAnchor="middle"
        fill={accent}
        fontSize={10}
        fontFamily="inherit"
        fontWeight={600}
      >
        H
      </text>
      <line
        x1={j2.x}
        y1={j2.y}
        x2={j2.x}
        y2={j2.y - 25}
        stroke={accent}
        strokeWidth={2}
      />
      <text
        x={j2.x}
        y={j2.y - 30}
        textAnchor="middle"
        fill={accent}
        fontSize={10}
        fontFamily="inherit"
        fontWeight={600}
      >
        H
      </text>
      {/* "trans" labels */}
      <text
        x={j1.x - 20}
        y={j1.y + 32}
        fill={secondary}
        fontSize={8}
        fontFamily="inherit"
      >
        down
      </text>
      <text
        x={j2.x + 12}
        y={j2.y - 24}
        fill={secondary}
        fontSize={8}
        fontFamily="inherit"
      >
        up
      </text>
      <text
        x={(j1.x + j2.x) / 2}
        y={30}
        textAnchor="middle"
        fill={secondary}
        fontSize={9}
        fontFamily="inherit"
      >
        trans (opposite sides)
      </text>
      <text
        x={W / 2}
        y={H - 10}
        textAnchor="middle"
        fill={secondary}
        fontSize={9}
        fontFamily="inherit"
      >
        Rigid, locked conformation
      </text>
    </DiagramShell>
  );
}
