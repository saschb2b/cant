"use client";

import { useEffect, useState, useCallback } from "react";
import Box from "@mui/material/Box";

type DpadDir = "up" | "down" | "left" | "right";
type FaceBtn = "green" | "blue" | "red" | "yellow";

interface Frame {
  dpad?: DpadDir;
  face?: FaceBtn;
  /** Duration in ms. Short = mash, long = hold. */
  ms: number;
}

/**
 * A gameplay sequence: the player moves with d-pad while
 * occasionally pressing action buttons. Sometimes mashes.
 */
const GAMEPLAY: Frame[] = [
  // Running right
  { dpad: "right", ms: 400 },
  { dpad: "right", ms: 350 },
  // Jump while moving right
  { dpad: "right", face: "green", ms: 300 },
  { dpad: "right", ms: 250 },
  { dpad: "right", ms: 300 },
  // Attack mash
  { dpad: "right", face: "red", ms: 150 },
  { face: "red", ms: 120 },
  { face: "red", ms: 120 },
  // Move up
  { dpad: "up", ms: 350 },
  { dpad: "up", ms: 300 },
  // Use ability
  { dpad: "up", face: "blue", ms: 280 },
  { dpad: "up", ms: 300 },
  // Dodge left
  { dpad: "left", ms: 250 },
  { dpad: "left", face: "yellow", ms: 300 },
  { dpad: "left", ms: 300 },
  // Move down
  { dpad: "down", ms: 350 },
  { dpad: "down", face: "green", ms: 280 },
  // Quick right + attack combo
  { dpad: "right", ms: 200 },
  { dpad: "right", face: "red", ms: 200 },
  { face: "red", ms: 140 },
  { face: "red", ms: 140 },
  { face: "red", ms: 140 },
  // Pause, then jump
  { ms: 300 },
  { face: "green", ms: 250 },
  { dpad: "right", ms: 350 },
  { dpad: "right", ms: 300 },
  // Special move
  { dpad: "down", ms: 200 },
  { dpad: "right", face: "blue", ms: 300 },
  { dpad: "right", ms: 350 },
  // More movement
  { dpad: "up", ms: 300 },
  { dpad: "right", ms: 350 },
  { dpad: "right", face: "yellow", ms: 280 },
  { dpad: "right", ms: 300 },
];

export function HeroAnimation() {
  const [dpad, setDpad] = useState<DpadDir | null>(null);
  const [face, setFace] = useState<FaceBtn | null>(null);

  const tick = useCallback(() => {
    let i = 0;
    let timeout: ReturnType<typeof setTimeout>;

    function next() {
      const frame = GAMEPLAY[i % GAMEPLAY.length];
      if (frame) {
        setDpad(frame.dpad ?? null);
        setFace(frame.face ?? null);
        i++;
        timeout = setTimeout(next, frame.ms);
      }
    }

    next();
    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => tick(), [tick]);

  const dOn = (dir: DpadDir) => dpad === dir;
  const fOn = (btn: FaceBtn) => face === btn;

  return (
    <Box
      sx={{
        position: "relative",
        py: { xs: 1, md: 2 },
        display: "flex",
        justifyContent: "center",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "60%",
          height: "50%",
          borderRadius: "50%",
          background:
            "radial-gradient(ellipse, rgba(var(--mui-palette-primary-mainChannel) / 0.08) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      <svg
        viewBox="0 0 512 512"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        style={{ width: "100%", maxWidth: 360, height: "auto" }}
      >
        <style>{`.gp{transition:all .1s ease-out}`}</style>

        {/* Controller body */}
        <path
          d="M406.068,150.068H109.444c-58.325,0-108.359,45.63-109.426,103.946
          C-1.07,313.426,46.766,361.93,105.93,361.93c28.724,0,54.702-11.499,73.772-30.073
          c3.322-3.235,7.648-5.237,12.286-5.237h128.044c4.626,0,8.937,1.995,12.249,5.224
          c21.57,21.017,51.988,32.982,85.218,29.484c48.802-5.138,88.484-44.561,93.839-93.34
          C518.352,204.114,468.522,150.068,406.068,150.068z"
          fill="currentColor"
          opacity="0.07"
          stroke="currentColor"
          strokeWidth="2"
          strokeOpacity="0.12"
        />

        {/* Right circle area */}
        <circle
          cx="406.068"
          cy="255.999"
          r="88.276"
          fill="currentColor"
          opacity="0.04"
        />

        {/* Left circle area */}
        <circle
          cx="105.93"
          cy="255.999"
          r="57.379"
          fill="currentColor"
          opacity="0.04"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeOpacity="0.06"
        />

        {/* D-PAD cross */}
        <path
          d="M140.689,241.103h-14.897c-2.742,0-4.966-2.223-4.966-4.966v-14.897
          c0-2.742-2.223-4.966-4.966-4.966H95.999c-2.742,0-4.966,2.223-4.966,4.966v14.897
          c0,2.742-2.223,4.966-4.966,4.966H71.172c-2.742,0-4.966,2.223-4.966,4.966v19.862
          c0,2.742,2.223,4.966,4.966,4.966h14.897c2.742,0,4.966,2.223,4.966,4.966v14.897
          c0,2.742,2.223,4.966,4.966,4.966h19.862c2.742,0,4.966-2.223,4.966-4.966v-14.897
          c0-2.742,2.223-4.966,4.966-4.966h14.897c2.742,0,4.966-2.223,4.966-4.966v-19.862
          C145.655,243.326,143.431,241.103,140.689,241.103z"
          fill="currentColor"
          opacity="0.09"
        />
        <circle
          cx="105.93"
          cy="255.999"
          r="8.828"
          fill="currentColor"
          opacity="0.06"
        />

        {/* D-pad directional highlights */}
        <rect
          className="gp"
          x="91"
          y="216"
          width="30"
          height="24"
          rx="5"
          fill={dOn("up") ? "#60A5FA" : "transparent"}
          opacity={dOn("up") ? 0.55 : 0}
        />
        <rect
          className="gp"
          x="91"
          y="272"
          width="30"
          height="24"
          rx="5"
          fill={dOn("down") ? "#60A5FA" : "transparent"}
          opacity={dOn("down") ? 0.55 : 0}
        />
        <rect
          className="gp"
          x="66"
          y="241"
          width="24"
          height="30"
          rx="5"
          fill={dOn("left") ? "#60A5FA" : "transparent"}
          opacity={dOn("left") ? 0.55 : 0}
        />
        <rect
          className="gp"
          x="122"
          y="241"
          width="24"
          height="30"
          rx="5"
          fill={dOn("right") ? "#60A5FA" : "transparent"}
          opacity={dOn("right") ? 0.55 : 0}
        />
        {/* D-pad glow */}
        {dpad != null && (
          <circle
            cx="105.93"
            cy="255.999"
            r="50"
            fill="#60A5FA"
            opacity="0.05"
          />
        )}

        {/* Center bar */}
        <path
          d="M286.896,203.034h-79.448c-7.313,0-13.241-5.929-13.241-13.241
          c0-7.313,5.929-13.241,13.241-13.241h79.448c7.313,0,13.241,5.929,13.241,13.241
          C300.137,197.105,294.209,203.034,286.896,203.034z"
          fill="currentColor"
          opacity="0.06"
        />

        {/* Diagonal accents */}
        <line
          x1="213"
          y1="290"
          x2="230"
          y2="282"
          stroke="currentColor"
          strokeWidth="3"
          strokeOpacity="0.06"
          strokeLinecap="round"
        />
        <line
          x1="266"
          y1="290"
          x2="283"
          y2="282"
          stroke="currentColor"
          strokeWidth="3"
          strokeOpacity="0.06"
          strokeLinecap="round"
        />

        {/* Cross-lines behind face buttons */}
        <path
          d="M357.526,275.861c-5.181,0-10.311-2.268-13.793-6.625
          c-6.094-7.616-4.862-18.724,2.759-24.814l44.138-35.31
          c7.604-6.099,18.724-4.862,24.81,2.754c6.094,7.616,4.862,18.724-2.759,24.814
          l-44.138,35.31C365.293,274.598,361.396,275.861,357.526,275.861z"
          fill="currentColor"
          opacity="0.04"
        />
        <path
          d="M410.491,306.758c-5.181,0-10.311-2.268-13.793-6.625
          c-6.094-7.616-4.862-18.724,2.759-24.814l44.138-35.31
          c7.595-6.103,18.733-4.853,24.81,2.754c6.094,7.616,4.862,18.724-2.759,24.814
          l-44.138,35.31C418.258,305.494,414.362,306.758,410.491,306.758z"
          fill="currentColor"
          opacity="0.04"
        />

        {/* Face buttons */}
        {(
          [
            {
              id: "green" as FaceBtn,
              cx: 357.517,
              cy: 258.206,
              col: "#00DCC8",
            },
            { id: "blue" as FaceBtn, cx: 401.655, cy: 222.896, col: "#82B9FF" },
            { id: "red" as FaceBtn, cx: 454.62, cy: 253.792, col: "#FF6464" },
            {
              id: "yellow" as FaceBtn,
              cx: 410.482,
              cy: 289.103,
              col: "#FFCD46",
            },
          ] as const
        ).map((b) => (
          <g key={b.id}>
            <circle
              className="gp"
              cx={b.cx}
              cy={b.cy}
              r="17.655"
              fill={fOn(b.id) ? b.col : "currentColor"}
              opacity={fOn(b.id) ? 0.7 : 0.07}
              stroke={fOn(b.id) ? b.col : "currentColor"}
              strokeWidth="1.5"
              strokeOpacity={fOn(b.id) ? 0.5 : 0.06}
            />
            {fOn(b.id) && (
              <circle cx={b.cx} cy={b.cy} r="24" fill={b.col} opacity="0.1" />
            )}
          </g>
        ))}
      </svg>
    </Box>
  );
}
