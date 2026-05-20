"use client";

import { useEffect, useRef, type ReactNode } from "react";
import Box from "@mui/material/Box";

type WireframeKind =
  | "card"
  | "formField"
  | "button"
  | "avatarRow"
  | "imagePlaceholder"
  | "toggle"
  | "searchBar"
  | "bottomNav"
  | "dropdown"
  | "checkboxList"
  | "modal"
  | "tabBar"
  | "progressBar"
  | "slider";

interface Wireframe {
  id: number;
  kind: WireframeKind;
  left: string;
  top: string;
  rotate: number;
  opacity: number;
  /** Decorate with Figma-style corner handles + frame label. Only one piece should be "selected". */
  selected?: { label: string };
}

const WIREFRAMES: Wireframe[] = [
  {
    id: 0,
    kind: "card",
    left: "4%",
    top: "16%",
    rotate: 0,
    opacity: 0.42,
    selected: { label: "Card / 134 × 92" },
  },
  {
    id: 1,
    kind: "searchBar",
    left: "22%",
    top: "6%",
    rotate: 0,
    opacity: 0.22,
  },
  {
    id: 2,
    kind: "avatarRow",
    left: "16%",
    top: "62%",
    rotate: 0,
    opacity: 0.3,
  },
  { id: 3, kind: "toggle", left: "33%", top: "80%", rotate: 0, opacity: 0.32 },
  {
    id: 4,
    kind: "imagePlaceholder",
    left: "67%",
    top: "12%",
    rotate: 0,
    opacity: 0.28,
  },
  {
    id: 5,
    kind: "formField",
    left: "82%",
    top: "56%",
    rotate: 0,
    opacity: 0.34,
  },
  { id: 6, kind: "button", left: "60%", top: "82%", rotate: 0, opacity: 0.4 },
  { id: 7, kind: "tabBar", left: "84%", top: "32%", rotate: 0, opacity: 0.3 },
  {
    id: 8,
    kind: "checkboxList",
    left: "6%",
    top: "78%",
    rotate: 0,
    opacity: 0.28,
  },
  { id: 9, kind: "dropdown", left: "46%", top: "6%", rotate: 0, opacity: 0.26 },
  { id: 10, kind: "modal", left: "70%", top: "68%", rotate: -2, opacity: 0.22 },
  {
    id: 11,
    kind: "progressBar",
    left: "50%",
    top: "92%",
    rotate: 0,
    opacity: 0.36,
  },
  { id: 12, kind: "slider", left: "92%", top: "12%", rotate: 3, opacity: 0.24 },
  {
    id: 13,
    kind: "bottomNav",
    left: "2%",
    top: "44%",
    rotate: -3,
    opacity: 0.2,
  },
];

const STROKE = 1.25;
const DOT_GRID =
  "radial-gradient(circle, rgba(var(--mui-palette-primary-mainChannel) / 0.10) 1px, transparent 1px)";
const DOT_GRID_BRIGHT =
  "radial-gradient(circle, rgba(var(--mui-palette-primary-mainChannel) / 0.55) 1.4px, transparent 1.6px)";
const SPOTLIGHT_RADIUS = 220;

function Card(): ReactNode {
  return (
    <svg
      width="134"
      height="92"
      viewBox="0 0 134 92"
      fill="none"
      stroke="currentColor"
      strokeWidth={STROKE}
      strokeLinecap="round"
    >
      <rect x="0.75" y="0.75" width="132.5" height="90.5" rx="6" />
      <rect
        x="10"
        y="10"
        width="58"
        height="6"
        rx="2"
        fill="currentColor"
        opacity="0.5"
        stroke="none"
      />
      <line x1="10" y1="28" x2="124" y2="28" />
      <line x1="10" y1="38" x2="108" y2="38" />
      <line x1="10" y1="48" x2="118" y2="48" />
      <line x1="10" y1="58" x2="94" y2="58" />
      <rect
        x="10"
        y="72"
        width="38"
        height="12"
        rx="3"
        fill="currentColor"
        opacity="0.4"
        stroke="none"
      />
    </svg>
  );
}

function FormField(): ReactNode {
  return (
    <svg
      width="116"
      height="40"
      viewBox="0 0 116 40"
      fill="none"
      stroke="currentColor"
      strokeWidth={STROKE}
      strokeLinecap="round"
    >
      <line x1="2" y1="4" x2="40" y2="4" />
      <rect x="0.75" y="11.75" width="114.5" height="27.5" rx="4" />
    </svg>
  );
}

function Button(): ReactNode {
  return (
    <svg
      width="64"
      height="24"
      viewBox="0 0 64 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={STROKE}
    >
      <rect
        x="0.75"
        y="0.75"
        width="62.5"
        height="22.5"
        rx="11"
        fill="currentColor"
        opacity="0.5"
        stroke="none"
      />
      <rect x="0.75" y="0.75" width="62.5" height="22.5" rx="11" />
    </svg>
  );
}

function AvatarRow(): ReactNode {
  return (
    <svg
      width="126"
      height="34"
      viewBox="0 0 126 34"
      fill="none"
      stroke="currentColor"
      strokeWidth={STROKE}
      strokeLinecap="round"
    >
      <circle cx="17" cy="17" r="15.5" />
      <line x1="42" y1="11" x2="96" y2="11" />
      <line x1="42" y1="22" x2="116" y2="22" />
    </svg>
  );
}

function ImagePlaceholder(): ReactNode {
  return (
    <svg
      width="84"
      height="62"
      viewBox="0 0 84 62"
      fill="none"
      stroke="currentColor"
      strokeWidth={STROKE}
      strokeLinecap="round"
    >
      <rect x="0.75" y="0.75" width="82.5" height="60.5" rx="4" />
      <line x1="0.75" y1="0.75" x2="83.25" y2="61.25" />
      <line x1="0.75" y1="61.25" x2="83.25" y2="0.75" />
    </svg>
  );
}

function Toggle(): ReactNode {
  return (
    <svg
      width="46"
      height="22"
      viewBox="0 0 46 22"
      fill="none"
      stroke="currentColor"
      strokeWidth={STROKE}
    >
      <rect x="0.75" y="0.75" width="44.5" height="20.5" rx="10.25" />
      <circle
        cx="33"
        cy="11"
        r="6.5"
        fill="currentColor"
        opacity="0.6"
        stroke="none"
      />
    </svg>
  );
}

function SearchBar(): ReactNode {
  return (
    <svg
      width="148"
      height="26"
      viewBox="0 0 148 26"
      fill="none"
      stroke="currentColor"
      strokeWidth={STROKE}
      strokeLinecap="round"
    >
      <rect x="0.75" y="0.75" width="146.5" height="24.5" rx="12.25" />
      <circle cx="14" cy="13" r="4" />
      <line x1="17.5" y1="16.5" x2="20.5" y2="19.5" />
      <line x1="28" y1="13" x2="80" y2="13" />
    </svg>
  );
}

function BottomNav(): ReactNode {
  return (
    <svg
      width="118"
      height="34"
      viewBox="0 0 118 34"
      fill="none"
      stroke="currentColor"
      strokeWidth={STROKE}
    >
      <rect x="0.75" y="0.75" width="116.5" height="32.5" rx="4" />
      <circle cx="24" cy="17" r="5" />
      <circle
        cx="59"
        cy="17"
        r="5"
        fill="currentColor"
        opacity="0.5"
        stroke="none"
      />
      <circle cx="94" cy="17" r="5" />
    </svg>
  );
}

function Dropdown(): ReactNode {
  return (
    <svg
      width="96"
      height="24"
      viewBox="0 0 96 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={STROKE}
      strokeLinecap="round"
    >
      <rect x="0.75" y="0.75" width="94.5" height="22.5" rx="4" />
      <line x1="10" y1="12" x2="46" y2="12" />
      <polyline points="78,10 83,15 88,10" />
    </svg>
  );
}

function CheckboxList(): ReactNode {
  return (
    <svg
      width="106"
      height="58"
      viewBox="0 0 106 58"
      fill="none"
      stroke="currentColor"
      strokeWidth={STROKE}
      strokeLinecap="round"
    >
      <rect
        x="0.75"
        y="0.75"
        width="13"
        height="13"
        rx="2"
        fill="currentColor"
        opacity="0.6"
        stroke="none"
      />
      <rect x="0.75" y="0.75" width="13" height="13" rx="2" />
      <polyline
        points="3.5,7 6,9.5 11,4"
        stroke="var(--mui-palette-background-default)"
        strokeWidth="1.5"
      />
      <line x1="22" y1="7.5" x2="80" y2="7.5" />
      <rect x="0.75" y="22.75" width="13" height="13" rx="2" />
      <line x1="22" y1="29.5" x2="92" y2="29.5" />
      <rect x="0.75" y="44.75" width="13" height="13" rx="2" />
      <line x1="22" y1="51.5" x2="70" y2="51.5" />
    </svg>
  );
}

function Modal(): ReactNode {
  return (
    <svg
      width="150"
      height="108"
      viewBox="0 0 150 108"
      fill="none"
      stroke="currentColor"
      strokeWidth={STROKE}
      strokeLinecap="round"
    >
      <rect x="0.75" y="0.75" width="148.5" height="106.5" rx="8" />
      <rect
        x="14"
        y="14"
        width="64"
        height="7"
        rx="2"
        fill="currentColor"
        opacity="0.5"
        stroke="none"
      />
      <line x1="14" y1="36" x2="136" y2="36" />
      <line x1="14" y1="46" x2="124" y2="46" />
      <line x1="14" y1="56" x2="116" y2="56" />
      <rect x="68" y="82" width="32" height="14" rx="3" />
      <rect
        x="106"
        y="82"
        width="32"
        height="14"
        rx="3"
        fill="currentColor"
        opacity="0.5"
        stroke="none"
      />
    </svg>
  );
}

function TabBar(): ReactNode {
  return (
    <svg
      width="160"
      height="32"
      viewBox="0 0 160 32"
      fill="none"
      stroke="currentColor"
      strokeWidth={STROKE}
      strokeLinecap="round"
    >
      <line x1="0" y1="31.25" x2="160" y2="31.25" />
      <line x1="14" y1="14" x2="44" y2="14" />
      <line x1="58" y1="14" x2="84" y2="14" />
      <line x1="98" y1="14" x2="128" y2="14" />
      <rect
        x="10"
        y="26"
        width="38"
        height="3"
        rx="1.5"
        fill="currentColor"
        opacity="0.7"
        stroke="none"
      />
    </svg>
  );
}

function ProgressBar(): ReactNode {
  return (
    <svg
      width="140"
      height="14"
      viewBox="0 0 140 14"
      fill="none"
      stroke="currentColor"
      strokeWidth={STROKE}
      strokeLinecap="round"
    >
      <rect x="0.75" y="0.75" width="138.5" height="12.5" rx="6.25" />
      <rect
        x="0.75"
        y="0.75"
        width="82"
        height="12.5"
        rx="6.25"
        fill="currentColor"
        opacity="0.55"
        stroke="none"
      />
    </svg>
  );
}

function Slider(): ReactNode {
  return (
    <svg
      width="124"
      height="22"
      viewBox="0 0 124 22"
      fill="none"
      stroke="currentColor"
      strokeWidth={STROKE}
      strokeLinecap="round"
    >
      <line x1="6" y1="11" x2="118" y2="11" />
      <line
        x1="6"
        y1="11"
        x2="76"
        y2="11"
        stroke="currentColor"
        strokeWidth="2.5"
        opacity="0.6"
      />
      <circle
        cx="76"
        cy="11"
        r="6"
        fill="currentColor"
        opacity="0.7"
        stroke="none"
      />
      <circle cx="76" cy="11" r="6" fill="none" />
    </svg>
  );
}

const RENDERERS: Record<WireframeKind, () => ReactNode> = {
  card: Card,
  formField: FormField,
  button: Button,
  avatarRow: AvatarRow,
  imagePlaceholder: ImagePlaceholder,
  toggle: Toggle,
  searchBar: SearchBar,
  bottomNav: BottomNav,
  dropdown: Dropdown,
  checkboxList: CheckboxList,
  modal: Modal,
  tabBar: TabBar,
  progressBar: ProgressBar,
  slider: Slider,
};

function SelectionFrame({ label }: { label: string }) {
  const handle = 5;
  const offset = handle / 2;
  return (
    <>
      <Box
        sx={{
          position: "absolute",
          left: 0,
          top: -16,
          fontFamily: "var(--font-geist-mono), ui-monospace, monospace",
          fontSize: 9,
          letterSpacing: 0.3,
          color: "primary.main",
          opacity: 0.85,
          whiteSpace: "nowrap",
        }}
      >
        {label}
      </Box>
      {[
        { left: -offset, top: -offset },
        { right: -offset, top: -offset },
        { left: -offset, bottom: -offset },
        { right: -offset, bottom: -offset },
      ].map((pos, i) => (
        <Box
          key={i}
          sx={{
            position: "absolute",
            width: handle,
            height: handle,
            bgcolor: "background.default",
            border: "1px solid",
            borderColor: "primary.main",
            ...pos,
          }}
        />
      ))}
    </>
  );
}

export function DesignCanvas() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = rootRef.current;
    if (!node) return;
    // Start spotlight off-screen so first paint has no visible halo
    node.style.setProperty("--mx", "-9999px");
    node.style.setProperty("--my", "-9999px");
    const handleMove = (e: MouseEvent) => {
      node.style.setProperty("--mx", `${String(e.clientX)}px`);
      node.style.setProperty("--my", `${String(e.clientY)}px`);
    };
    const handleLeave = () => {
      node.style.setProperty("--mx", "-9999px");
      node.style.setProperty("--my", "-9999px");
    };
    window.addEventListener("mousemove", handleMove, { passive: true });
    window.addEventListener("mouseleave", handleLeave);
    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseleave", handleLeave);
    };
  }, []);

  const spotlightMask = `radial-gradient(circle ${String(SPOTLIGHT_RADIUS)}px at var(--mx) var(--my), #000 0%, rgba(0,0,0,0.4) 60%, transparent 100%)`;

  return (
    <Box
      ref={rootRef}
      aria-hidden
      sx={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        pointerEvents: "none",
        backgroundImage: DOT_GRID,
        backgroundSize: "24px 24px",
      }}
    >
      {/* Spotlight: brighter dot grid revealed near cursor */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          backgroundImage: DOT_GRID_BRIGHT,
          backgroundSize: "24px 24px",
          maskImage: spotlightMask,
          WebkitMaskImage: spotlightMask,
        }}
      />

      {WIREFRAMES.map((w) => {
        const Render = RENDERERS[w.kind];
        return (
          <Box
            key={w.id}
            sx={{
              position: "absolute",
              left: w.left,
              top: w.top,
              color: "primary.main",
              transform: `rotate(${String(w.rotate)}deg)`,
              transformOrigin: "top left",
              opacity: w.opacity,
            }}
          >
            <Box sx={{ position: "relative", display: "inline-block" }}>
              <Render />
              {w.selected ? <SelectionFrame label={w.selected.label} /> : null}
            </Box>
          </Box>
        );
      })}
    </Box>
  );
}
