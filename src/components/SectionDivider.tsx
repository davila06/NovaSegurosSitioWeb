/**
 * Decorative diagonal/wave SVG divider between sections.
 * `flip` rotates it 180° so the wave points the other way.
 * `color` is the fill color of the wave (the "incoming" section's bg color).
 */
export default function SectionDivider({
  color = "#141414",
  flip  = false,
  className = "",
}: {
  color?:     string;
  flip?:      boolean;
  className?: string;
}) {
  return (
    <div
      aria-hidden="true"
      className={`relative w-full overflow-hidden leading-none pointer-events-none ${className}`}
      style={{ transform: flip ? "rotate(180deg)" : undefined, height: 72 }}
    >
      <svg
        viewBox="0 0 1440 72"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
        className="absolute inset-0 w-full h-full"
      >
        <path
          d="M0,0 C360,72 1080,0 1440,72 L1440,72 L0,72 Z"
          fill={color}
        />
        {/* Gold accent line along the curve */}
        <path
          d="M0,0 C360,72 1080,0 1440,72"
          fill="none"
          stroke="rgba(200,169,110,0.18)"
          strokeWidth="1"
        />
      </svg>
    </div>
  );
}
