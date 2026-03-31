"use client";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

/* ---------- Shared helpers ---------- */

const ROWS: string[][] = [
  ["H", "", "", ""],
  ["Li", "Be", "B", "F"],
  ["Na", "Mg", "Al", "Cl"],
  ["K", "Ca", "Ga", "Br"],
];

function interpolateColor(
  low: [number, number, number],
  high: [number, number, number],
  t: number,
): string {
  const r = Math.round(low[0] + (high[0] - low[0]) * t);
  const g = Math.round(low[1] + (high[1] - low[1]) * t);
  const b = Math.round(low[2] + (high[2] - low[2]) * t);
  return `rgb(${String(r)},${String(g)},${String(b)})`;
}

function MiniPeriodicTable({
  label,
  lowColor,
  highColor,
  getValue,
  lowLabel = "Low",
  highLabel = "High",
}: {
  label: string;
  lowColor: [number, number, number];
  highColor: [number, number, number];
  getValue: (row: number, col: number) => number;
  lowLabel?: string;
  highLabel?: string;
}) {
  return (
    <Box sx={{ width: 280, p: 1.5 }}>
      <Typography
        sx={{ fontSize: 12, fontWeight: 700, mb: 1, textAlign: "center" }}
      >
        {label}
      </Typography>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 0.5,
          mb: 1,
        }}
      >
        {ROWS.flatMap((row, ri) =>
          row.map((el, ci) => {
            if (!el) {
              return <Box key={`${String(ri)}-${String(ci)}`} />;
            }
            const t = getValue(ri, ci);
            const bg = interpolateColor(lowColor, highColor, t);
            const textColor = t > 0.6 ? "#fff" : "#000";
            return (
              <Box
                key={`${String(ri)}-${String(ci)}`}
                sx={{
                  bgcolor: bg,
                  color: textColor,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  height: 40,
                  fontSize: 11,
                  fontWeight: 600,
                  borderRadius: 0.5,
                }}
              >
                {el}
              </Box>
            );
          }),
        )}
      </Box>

      {/* Legend bar */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
        <Typography sx={{ fontSize: 9, color: "text.secondary" }}>
          {lowLabel}
        </Typography>
        <Box
          sx={{
            flex: 1,
            height: 8,
            borderRadius: 1,
            background: `linear-gradient(to right, rgb(${lowColor.join(",")}), rgb(${highColor.join(",")}))`,
          }}
        />
        <Typography sx={{ fontSize: 9, color: "text.secondary" }}>
          {highLabel}
        </Typography>
      </Box>
    </Box>
  );
}

/* ---------- pt-001: Electronegativity ---------- */

export function ElectronegativityCorrectTrend() {
  return (
    <MiniPeriodicTable
      label="Electronegativity"
      lowColor={[220, 237, 200]}
      highColor={[27, 94, 32]}
      getValue={(row, col) => {
        // Increases left-to-right, bottom-to-top (correct)
        const colFactor = col / 3;
        const rowFactor = (3 - row) / 3;
        return colFactor * 0.6 + rowFactor * 0.4;
      }}
    />
  );
}

export function ElectronegativityWrongTrend() {
  return (
    <MiniPeriodicTable
      label="Electronegativity"
      lowColor={[220, 237, 200]}
      highColor={[27, 94, 32]}
      getValue={(row, col) => {
        // Wrong: increases left-to-right and top-to-bottom
        const colFactor = col / 3;
        const rowFactor = row / 3;
        return colFactor * 0.6 + rowFactor * 0.4;
      }}
    />
  );
}

/* ---------- pt-002: Atomic Radius ---------- */

export function AtomicRadiusCorrectTrend() {
  return (
    <MiniPeriodicTable
      label="Atomic Radius"
      lowColor={[227, 242, 253]}
      highColor={[13, 71, 161]}
      getValue={(row, col) => {
        // Increases down and to the left (correct)
        const colFactor = (3 - col) / 3;
        const rowFactor = row / 3;
        return colFactor * 0.5 + rowFactor * 0.5;
      }}
      lowLabel="Small"
      highLabel="Large"
    />
  );
}

export function AtomicRadiusWrongTrend() {
  return (
    <MiniPeriodicTable
      label="Atomic Radius"
      lowColor={[227, 242, 253]}
      highColor={[13, 71, 161]}
      getValue={(row, col) => {
        // Wrong: increases up and to the right
        const colFactor = col / 3;
        const rowFactor = (3 - row) / 3;
        return colFactor * 0.5 + rowFactor * 0.5;
      }}
      lowLabel="Small"
      highLabel="Large"
    />
  );
}

/* ---------- pt-003: Ionization Energy ---------- */

export function IonizationEnergyCorrect() {
  return (
    <MiniPeriodicTable
      label="Ionization Energy"
      lowColor={[255, 243, 224]}
      highColor={[230, 81, 0]}
      getValue={(row, col) => {
        // Increases up and to the right (correct)
        const colFactor = col / 3;
        const rowFactor = (3 - row) / 3;
        return colFactor * 0.5 + rowFactor * 0.5;
      }}
    />
  );
}

export function IonizationEnergyWrong() {
  return (
    <MiniPeriodicTable
      label="Ionization Energy"
      lowColor={[255, 243, 224]}
      highColor={[230, 81, 0]}
      getValue={(row, col) => {
        // Wrong: increases down and to the left
        const colFactor = (3 - col) / 3;
        const rowFactor = row / 3;
        return colFactor * 0.5 + rowFactor * 0.5;
      }}
    />
  );
}

/* ---------- pt-004: Electron Affinity ---------- */

export function ElectronAffinityCorrect() {
  return (
    <MiniPeriodicTable
      label="Electron Affinity"
      lowColor={[243, 229, 245]}
      highColor={[106, 27, 154]}
      getValue={(row, col) => {
        // Increases toward upper right (halogens highest, correct)
        const colFactor = col / 3;
        const rowFactor = (3 - row) / 3;
        return colFactor * 0.6 + rowFactor * 0.4;
      }}
    />
  );
}

export function ElectronAffinityWrong() {
  return (
    <MiniPeriodicTable
      label="Electron Affinity"
      lowColor={[243, 229, 245]}
      highColor={[106, 27, 154]}
      getValue={(row, col) => {
        // Wrong: increases toward lower left
        const colFactor = (3 - col) / 3;
        const rowFactor = row / 3;
        return colFactor * 0.6 + rowFactor * 0.4;
      }}
    />
  );
}
