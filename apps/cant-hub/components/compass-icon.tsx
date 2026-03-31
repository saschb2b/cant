interface CompassIconProps {
  size?: number;
}

export function CompassIcon({ size = 24 }: CompassIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ flexShrink: 0 }}
    >
      {/* Outer ring */}
      <circle
        cx="12"
        cy="12"
        r="10.5"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      {/* North needle (gold) */}
      <polygon points="12,3.5 10,12 14,12" fill="#E9C46A" />
      {/* South needle (muted) */}
      <polygon points="12,20.5 10,12 14,12" fill="currentColor" opacity="0.3" />
      {/* Center dot */}
      <circle cx="12" cy="12" r="1.5" fill="currentColor" />
    </svg>
  );
}
