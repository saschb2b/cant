"use client";

import { useEffect, useState } from "react";
import Box from "@mui/material/Box";

const SEQ = [
  "green",
  "dpad-up",
  "red",
  "dpad-right",
  "blue",
  "yellow",
  "dpad-down",
  "dpad-left",
] as const;
type Btn = (typeof SEQ)[number];

export function HeroAnimation() {
  const [active, setActive] = useState<Btn>("green");
  useEffect(() => {
    let i = 0;
    const id = setInterval(() => {
      i = (i + 1) % SEQ.length;
      setActive(SEQ[i] ?? "green");
    }, 500);
    return () => clearInterval(id);
  }, []);

  const on = (b: Btn) => active === b;

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
        <style>{`.gp{transition:all .15s ease-out}`}</style>

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

        {/* D-pad highlights */}
        <rect
          className="gp"
          x="91"
          y="216"
          width="30"
          height="24"
          rx="5"
          fill={on("dpad-up") ? "#60A5FA" : "transparent"}
          opacity={on("dpad-up") ? 0.55 : 0}
        />
        <rect
          className="gp"
          x="91"
          y="272"
          width="30"
          height="24"
          rx="5"
          fill={on("dpad-down") ? "#60A5FA" : "transparent"}
          opacity={on("dpad-down") ? 0.55 : 0}
        />
        <rect
          className="gp"
          x="66"
          y="241"
          width="24"
          height="30"
          rx="5"
          fill={on("dpad-left") ? "#60A5FA" : "transparent"}
          opacity={on("dpad-left") ? 0.55 : 0}
        />
        <rect
          className="gp"
          x="122"
          y="241"
          width="24"
          height="30"
          rx="5"
          fill={on("dpad-right") ? "#60A5FA" : "transparent"}
          opacity={on("dpad-right") ? 0.55 : 0}
        />
        {(["dpad-up", "dpad-down", "dpad-left", "dpad-right"] as Btn[]).map(
          (id) =>
            on(id) && (
              <circle
                key={`g-${id}`}
                cx="105.93"
                cy="255.999"
                r="50"
                fill="#60A5FA"
                opacity="0.05"
              />
            ),
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
        <circle
          className="gp"
          cx="357.517"
          cy="258.206"
          r="17.655"
          fill={on("green") ? "#00DCC8" : "currentColor"}
          opacity={on("green") ? 0.7 : 0.07}
          stroke={on("green") ? "#00DCC8" : "currentColor"}
          strokeWidth="1.5"
          strokeOpacity={on("green") ? 0.5 : 0.06}
        />
        {on("green") && (
          <circle
            cx="357.517"
            cy="258.206"
            r="24"
            fill="#00DCC8"
            opacity="0.1"
          />
        )}

        <circle
          className="gp"
          cx="401.655"
          cy="222.896"
          r="17.655"
          fill={on("blue") ? "#82B9FF" : "currentColor"}
          opacity={on("blue") ? 0.7 : 0.07}
          stroke={on("blue") ? "#82B9FF" : "currentColor"}
          strokeWidth="1.5"
          strokeOpacity={on("blue") ? 0.5 : 0.06}
        />
        {on("blue") && (
          <circle
            cx="401.655"
            cy="222.896"
            r="24"
            fill="#82B9FF"
            opacity="0.1"
          />
        )}

        <circle
          className="gp"
          cx="454.62"
          cy="253.792"
          r="17.655"
          fill={on("red") ? "#FF6464" : "currentColor"}
          opacity={on("red") ? 0.7 : 0.07}
          stroke={on("red") ? "#FF6464" : "currentColor"}
          strokeWidth="1.5"
          strokeOpacity={on("red") ? 0.5 : 0.06}
        />
        {on("red") && (
          <circle
            cx="454.62"
            cy="253.792"
            r="24"
            fill="#FF6464"
            opacity="0.1"
          />
        )}

        <circle
          className="gp"
          cx="410.482"
          cy="289.103"
          r="17.655"
          fill={on("yellow") ? "#FFCD46" : "currentColor"}
          opacity={on("yellow") ? 0.7 : 0.07}
          stroke={on("yellow") ? "#FFCD46" : "currentColor"}
          strokeWidth="1.5"
          strokeOpacity={on("yellow") ? 0.5 : 0.06}
        />
        {on("yellow") && (
          <circle
            cx="410.482"
            cy="289.103"
            r="24"
            fill="#FFCD46"
            opacity="0.1"
          />
        )}
      </svg>
    </Box>
  );
}
