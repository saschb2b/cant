"use client";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
/* ---------- Shared constants ---------- */

const W = 300;
const H = 250;
const PAD = { top: 20, right: 20, bottom: 30, left: 45 };

/** Convert number to string for use in SVG template literals. */
const S = String;

/** Build a simple cubic bezier path for a single-hump reaction curve. */
function singleHumpPath(
  x0: number,
  rY: number,
  x1: number,
  tsY: number,
  x2: number,
  pY: number,
  cpSpread = 40,
  cpSpreadMid = 50,
): string {
  return [
    `M ${S(x0)} ${S(rY)}`,
    `C ${S(x0 + cpSpread)} ${S(rY)}, ${S(x1 - cpSpreadMid)} ${S(tsY)}, ${S(x1)} ${S(tsY)}`,
    `C ${S(x1 + cpSpreadMid)} ${S(tsY)}, ${S(x2 - cpSpread)} ${S(pY)}, ${S(x2)} ${S(pY)}`,
  ].join(" ");
}

/** Render common axes and labels for a reaction coordinate diagram. */
function DiagramShell({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  const axisColor = "var(--mui-palette-text-secondary)";

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
        viewBox={`0 0 ${S(W)} ${S(H)}`}
        width={W}
        height={H}
        style={{ maxWidth: "100%" }}
      >
        {/* Y-axis */}
        <line
          x1={PAD.left}
          y1={PAD.top}
          x2={PAD.left}
          y2={H - PAD.bottom}
          stroke={axisColor}
          strokeWidth={1.5}
        />
        {/* X-axis */}
        <line
          x1={PAD.left}
          y1={H - PAD.bottom}
          x2={W - PAD.right}
          y2={H - PAD.bottom}
          stroke={axisColor}
          strokeWidth={1.5}
        />
        {/* Y-axis label */}
        <text
          x={14}
          y={H / 2}
          textAnchor="middle"
          dominantBaseline="middle"
          transform={`rotate(-90, 14, ${S(H / 2)})`}
          fill={axisColor}
          fontSize={11}
          fontFamily="inherit"
        >
          Energy
        </text>
        {/* X-axis label */}
        <text
          x={(PAD.left + W - PAD.right) / 2}
          y={H - 6}
          textAnchor="middle"
          fill={axisColor}
          fontSize={11}
          fontFamily="inherit"
        >
          Reaction coordinate
        </text>
        {children}
      </svg>
      <Typography variant="caption" color="text.secondary">
        {title}
      </Typography>
    </Box>
  );
}

/* ====================================================================
   ed-001: Exothermic vs endothermic reaction profile
   ==================================================================== */

export function ExothermicProfile() {
  const curve = "var(--mui-palette-primary-main)";
  const label = "var(--mui-palette-text-primary)";
  const secondary = "var(--mui-palette-text-secondary)";

  // Reactants at y=160, products at y=190 (lower energy)
  // Transition state at y=70
  const rY = 100; // reactants
  const pY = 175; // products (lower)
  const tsY = 50; // transition state

  const x0 = PAD.left + 20;
  const x1 = (PAD.left + W - PAD.right) / 2;
  const x2 = W - PAD.right - 20;

  const path = singleHumpPath(x0, rY, x1, tsY, x2, pY);

  return (
    <DiagramShell title="Exothermic reaction profile">
      <path d={path} fill="none" stroke={curve} strokeWidth={2.5} />
      {/* Reactants label */}
      <text
        x={x0}
        y={rY - 10}
        textAnchor="middle"
        fill={label}
        fontSize={10}
        fontFamily="inherit"
      >
        Reactants
      </text>
      {/* Products label */}
      <text
        x={x2}
        y={pY - 10}
        textAnchor="middle"
        fill={label}
        fontSize={10}
        fontFamily="inherit"
      >
        Products
      </text>
      {/* Ea arrow */}
      <line
        x1={x1 + 30}
        y1={rY}
        x2={x1 + 30}
        y2={tsY}
        stroke={secondary}
        strokeWidth={1}
        strokeDasharray="4 2"
      />
      <text
        x={x1 + 42}
        y={(rY + tsY) / 2}
        fill={secondary}
        fontSize={9}
        fontFamily="inherit"
      >
        Ea
      </text>
      {/* Delta H arrow */}
      <line
        x1={x2 + 10}
        y1={rY}
        x2={x2 + 10}
        y2={pY}
        stroke={curve}
        strokeWidth={1}
        strokeDasharray="4 2"
      />
      <text
        x={x2 - 4}
        y={(rY + pY) / 2 + 4}
        textAnchor="end"
        fill={curve}
        fontSize={9}
        fontFamily="inherit"
        fontWeight={700}
      >
        {"ΔH < 0"}
      </text>
      {/* Dashed reference lines for reactant/product levels */}
      <line
        x1={PAD.left}
        y1={rY}
        x2={x0}
        y2={rY}
        stroke={secondary}
        strokeWidth={0.5}
        strokeDasharray="3 3"
      />
      <line
        x1={x2}
        y1={pY}
        x2={W - PAD.right}
        y2={pY}
        stroke={secondary}
        strokeWidth={0.5}
        strokeDasharray="3 3"
      />
    </DiagramShell>
  );
}

export function EndothermicProfile() {
  const curve = "var(--mui-palette-primary-main)";
  const label = "var(--mui-palette-text-primary)";
  const secondary = "var(--mui-palette-text-secondary)";

  const rY = 175; // reactants (lower)
  const pY = 100; // products (higher)
  const tsY = 45; // transition state

  const x0 = PAD.left + 20;
  const x1 = (PAD.left + W - PAD.right) / 2;
  const x2 = W - PAD.right - 20;

  const path = singleHumpPath(x0, rY, x1, tsY, x2, pY);

  return (
    <DiagramShell title="Endothermic reaction profile">
      <path d={path} fill="none" stroke={curve} strokeWidth={2.5} />
      <text
        x={x0}
        y={rY - 10}
        textAnchor="middle"
        fill={label}
        fontSize={10}
        fontFamily="inherit"
      >
        Reactants
      </text>
      <text
        x={x2}
        y={pY - 10}
        textAnchor="middle"
        fill={label}
        fontSize={10}
        fontFamily="inherit"
      >
        Products
      </text>
      {/* Ea arrow */}
      <line
        x1={x1 - 30}
        y1={rY}
        x2={x1 - 30}
        y2={tsY}
        stroke={secondary}
        strokeWidth={1}
        strokeDasharray="4 2"
      />
      <text
        x={x1 - 18}
        y={(rY + tsY) / 2}
        fill={secondary}
        fontSize={9}
        fontFamily="inherit"
      >
        Ea
      </text>
      {/* Delta H arrow */}
      <line
        x1={x2 + 10}
        y1={rY}
        x2={x2 + 10}
        y2={pY}
        stroke={curve}
        strokeWidth={1}
        strokeDasharray="4 2"
      />
      <text
        x={x2 - 4}
        y={(rY + pY) / 2 + 4}
        textAnchor="end"
        fill={curve}
        fontSize={9}
        fontFamily="inherit"
        fontWeight={700}
      >
        {"ΔH > 0"}
      </text>
      <line
        x1={PAD.left}
        y1={rY}
        x2={x0}
        y2={rY}
        stroke={secondary}
        strokeWidth={0.5}
        strokeDasharray="3 3"
      />
      <line
        x1={x2}
        y1={pY}
        x2={W - PAD.right}
        y2={pY}
        stroke={secondary}
        strokeWidth={0.5}
        strokeDasharray="3 3"
      />
    </DiagramShell>
  );
}

/* ====================================================================
   ed-002: Catalyzed vs uncatalyzed reaction
   ==================================================================== */

export function CatalyzedReaction() {
  const curve = "var(--mui-palette-primary-main)";
  const label = "var(--mui-palette-text-primary)";
  const secondary = "var(--mui-palette-text-secondary)";

  const rY = 160;
  const pY = 160; // same start/end (no net energy change shown)
  const tsY = 90; // lower activation energy

  const x0 = PAD.left + 20;
  const x1 = (PAD.left + W - PAD.right) / 2;
  const x2 = W - PAD.right - 20;

  const path = singleHumpPath(x0, rY, x1, tsY, x2, pY);

  return (
    <DiagramShell title="Catalyzed reaction (lower Ea)">
      <path d={path} fill="none" stroke={curve} strokeWidth={2.5} />
      <text
        x={x0}
        y={rY - 10}
        textAnchor="middle"
        fill={label}
        fontSize={10}
        fontFamily="inherit"
      >
        Reactants
      </text>
      <text
        x={x2}
        y={pY - 10}
        textAnchor="middle"
        fill={label}
        fontSize={10}
        fontFamily="inherit"
      >
        Products
      </text>
      {/* Ea arrow */}
      <line
        x1={x1 + 30}
        y1={rY}
        x2={x1 + 30}
        y2={tsY}
        stroke={secondary}
        strokeWidth={1}
        strokeDasharray="4 2"
      />
      <text
        x={x1 + 42}
        y={(rY + tsY) / 2}
        fill={secondary}
        fontSize={9}
        fontFamily="inherit"
      >
        Ea (cat.)
      </text>
      {/* Catalyst label */}
      <text
        x={x1}
        y={tsY - 10}
        textAnchor="middle"
        fill={curve}
        fontSize={9}
        fontFamily="inherit"
        fontWeight={600}
      >
        With catalyst
      </text>
    </DiagramShell>
  );
}

export function UncatalyzedReaction() {
  const curve = "var(--mui-palette-primary-main)";
  const label = "var(--mui-palette-text-primary)";
  const secondary = "var(--mui-palette-text-secondary)";

  const rY = 160;
  const pY = 160;
  const tsY = 45; // higher activation energy

  const x0 = PAD.left + 20;
  const x1 = (PAD.left + W - PAD.right) / 2;
  const x2 = W - PAD.right - 20;

  const path = singleHumpPath(x0, rY, x1, tsY, x2, pY);

  return (
    <DiagramShell title="Uncatalyzed reaction (higher Ea)">
      <path d={path} fill="none" stroke={curve} strokeWidth={2.5} />
      <text
        x={x0}
        y={rY - 10}
        textAnchor="middle"
        fill={label}
        fontSize={10}
        fontFamily="inherit"
      >
        Reactants
      </text>
      <text
        x={x2}
        y={pY - 10}
        textAnchor="middle"
        fill={label}
        fontSize={10}
        fontFamily="inherit"
      >
        Products
      </text>
      <line
        x1={x1 + 30}
        y1={rY}
        x2={x1 + 30}
        y2={tsY}
        stroke={secondary}
        strokeWidth={1}
        strokeDasharray="4 2"
      />
      <text
        x={x1 + 42}
        y={(rY + tsY) / 2}
        fill={secondary}
        fontSize={9}
        fontFamily="inherit"
      >
        Ea (uncat.)
      </text>
      <text
        x={x1}
        y={tsY - 10}
        textAnchor="middle"
        fill={curve}
        fontSize={9}
        fontFamily="inherit"
        fontWeight={600}
      >
        No catalyst
      </text>
    </DiagramShell>
  );
}

/* ====================================================================
   ed-003: SN1 vs SN2 energy profile
   ==================================================================== */

export function SN1EnergyProfile() {
  const curve = "var(--mui-palette-primary-main)";
  const label = "var(--mui-palette-text-primary)";
  const secondary = "var(--mui-palette-text-secondary)";

  // Two-step: reactants -> TS1 -> intermediate -> TS2 -> products
  const rY = 160;
  const ts1Y = 55;
  const intY = 120;
  const ts2Y = 70;
  const pY = 175;

  const x0 = PAD.left + 15;
  const xA = PAD.left + 65;
  const xMid = (PAD.left + W - PAD.right) / 2;
  const xB = W - PAD.right - 65;
  const x2 = W - PAD.right - 15;

  const path = [
    `M ${S(x0)} ${S(rY)}`,
    `C ${S(x0 + 25)} ${S(rY)}, ${S(xA - 25)} ${S(ts1Y)}, ${S(xA)} ${S(ts1Y)}`,
    `C ${S(xA + 25)} ${S(ts1Y)}, ${S(xMid - 20)} ${S(intY)}, ${S(xMid)} ${S(intY)}`,
    `C ${S(xMid + 20)} ${S(intY)}, ${S(xB - 25)} ${S(ts2Y)}, ${S(xB)} ${S(ts2Y)}`,
    `C ${S(xB + 25)} ${S(ts2Y)}, ${S(x2 - 25)} ${S(pY)}, ${S(x2)} ${S(pY)}`,
  ].join(" ");

  return (
    <DiagramShell title="SN1 profile (two-step, with intermediate)">
      <path d={path} fill="none" stroke={curve} strokeWidth={2.5} />
      <text
        x={x0}
        y={rY - 10}
        textAnchor="start"
        fill={label}
        fontSize={9}
        fontFamily="inherit"
      >
        Reactants
      </text>
      <text
        x={x2}
        y={pY - 10}
        textAnchor="end"
        fill={label}
        fontSize={9}
        fontFamily="inherit"
      >
        Products
      </text>
      <text
        x={xA}
        y={ts1Y - 8}
        textAnchor="middle"
        fill={secondary}
        fontSize={8}
        fontFamily="inherit"
      >
        TS1
      </text>
      <text
        x={xMid}
        y={intY + 14}
        textAnchor="middle"
        fill={secondary}
        fontSize={8}
        fontFamily="inherit"
      >
        Intermediate
      </text>
      <text
        x={xB}
        y={ts2Y - 8}
        textAnchor="middle"
        fill={secondary}
        fontSize={8}
        fontFamily="inherit"
      >
        TS2
      </text>
    </DiagramShell>
  );
}

export function SN2EnergyProfile() {
  const curve = "var(--mui-palette-primary-main)";
  const label = "var(--mui-palette-text-primary)";
  const secondary = "var(--mui-palette-text-secondary)";

  // Single-step concerted: one hump
  const rY = 160;
  const tsY = 55;
  const pY = 175;

  const x0 = PAD.left + 15;
  const x1 = (PAD.left + W - PAD.right) / 2;
  const x2 = W - PAD.right - 15;

  const path = singleHumpPath(x0, rY, x1, tsY, x2, pY, 50, 60);

  return (
    <DiagramShell title="SN2 profile (one-step, concerted)">
      <path d={path} fill="none" stroke={curve} strokeWidth={2.5} />
      <text
        x={x0}
        y={rY - 10}
        textAnchor="start"
        fill={label}
        fontSize={9}
        fontFamily="inherit"
      >
        Reactants
      </text>
      <text
        x={x2}
        y={pY - 10}
        textAnchor="end"
        fill={label}
        fontSize={9}
        fontFamily="inherit"
      >
        Products
      </text>
      <text
        x={x1}
        y={tsY - 8}
        textAnchor="middle"
        fill={secondary}
        fontSize={9}
        fontFamily="inherit"
      >
        Transition state
      </text>
    </DiagramShell>
  );
}

/* ====================================================================
   ed-004: Activation energy comparison
   ==================================================================== */

export function LowActivationEnergy() {
  const curve = "var(--mui-palette-primary-main)";
  const label = "var(--mui-palette-text-primary)";
  const secondary = "var(--mui-palette-text-secondary)";

  const rY = 155;
  const tsY = 110; // small barrier
  const pY = 170;

  const x0 = PAD.left + 20;
  const x1 = (PAD.left + W - PAD.right) / 2;
  const x2 = W - PAD.right - 20;

  const path = singleHumpPath(x0, rY, x1, tsY, x2, pY);

  return (
    <DiagramShell title="Low activation energy (fast reaction)">
      <path d={path} fill="none" stroke={curve} strokeWidth={2.5} />
      <text
        x={x0}
        y={rY - 10}
        textAnchor="middle"
        fill={label}
        fontSize={10}
        fontFamily="inherit"
      >
        Reactants
      </text>
      <text
        x={x2}
        y={pY - 10}
        textAnchor="middle"
        fill={label}
        fontSize={10}
        fontFamily="inherit"
      >
        Products
      </text>
      {/* Small Ea bracket */}
      <line
        x1={x1 + 30}
        y1={rY}
        x2={x1 + 30}
        y2={tsY}
        stroke={secondary}
        strokeWidth={1}
        strokeDasharray="4 2"
      />
      <text
        x={x1 + 42}
        y={(rY + tsY) / 2 + 2}
        fill={secondary}
        fontSize={9}
        fontFamily="inherit"
      >
        Ea (small)
      </text>
      {/* Speed indicator */}
      <text
        x={x1}
        y={H - PAD.bottom - 8}
        textAnchor="middle"
        fill={curve}
        fontSize={9}
        fontFamily="inherit"
        fontWeight={600}
      >
        Fast
      </text>
    </DiagramShell>
  );
}

export function HighActivationEnergy() {
  const curve = "var(--mui-palette-primary-main)";
  const label = "var(--mui-palette-text-primary)";
  const secondary = "var(--mui-palette-text-secondary)";

  const rY = 155;
  const tsY = 35; // large barrier
  const pY = 170;

  const x0 = PAD.left + 20;
  const x1 = (PAD.left + W - PAD.right) / 2;
  const x2 = W - PAD.right - 20;

  const path = singleHumpPath(x0, rY, x1, tsY, x2, pY);

  return (
    <DiagramShell title="High activation energy (slow reaction)">
      <path d={path} fill="none" stroke={curve} strokeWidth={2.5} />
      <text
        x={x0}
        y={rY - 10}
        textAnchor="middle"
        fill={label}
        fontSize={10}
        fontFamily="inherit"
      >
        Reactants
      </text>
      <text
        x={x2}
        y={pY - 10}
        textAnchor="middle"
        fill={label}
        fontSize={10}
        fontFamily="inherit"
      >
        Products
      </text>
      <line
        x1={x1 + 30}
        y1={rY}
        x2={x1 + 30}
        y2={tsY}
        stroke={secondary}
        strokeWidth={1}
        strokeDasharray="4 2"
      />
      <text
        x={x1 + 42}
        y={(rY + tsY) / 2 + 2}
        fill={secondary}
        fontSize={9}
        fontFamily="inherit"
      >
        Ea (large)
      </text>
      <text
        x={x1}
        y={H - PAD.bottom - 8}
        textAnchor="middle"
        fill={curve}
        fontSize={9}
        fontFamily="inherit"
        fontWeight={600}
      >
        Slow
      </text>
    </DiagramShell>
  );
}
