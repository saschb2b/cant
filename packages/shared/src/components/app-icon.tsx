import type { CantApp } from "../lib/cant-apps";

function slugify(name: string): string {
  return name.replace(/[^a-zA-Z0-9]/g, "").toLowerCase();
}

export function AppIcon({ app, size = 44 }: { app: CantApp; size?: number }) {
  const id = `icon-${slugify(app.name)}`;
  const rx = size * (37 / 180);
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 180 180"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ flexShrink: 0, borderRadius: rx }}
    >
      <defs>
        <linearGradient
          id={id}
          x1="0"
          y1="0"
          x2="180"
          y2="180"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor={app.colorFrom} />
          <stop offset="100%" stopColor={app.colorTo} />
        </linearGradient>
      </defs>
      <rect width="180" height="180" rx="37" fill={`url(#${id})`} />
      <g dangerouslySetInnerHTML={{ __html: app.iconSvgContent }} />
    </svg>
  );
}
