 /**
 * JetLogo — Reusable brand logo component.
 *
 * Variants:
 * - "full"  → Full wordmark + chevron icon (SVG, scalable)
 * - "icon"  → Chevron icon only (PNG)
 * - "wordmark-png" → Full wordmark PNG (for contexts needing raster)
 *
 * Modes:
 * - "dark"  → Black text + green chevrons (for light backgrounds)
 * - "light" → White text + green chevrons (for dark backgrounds)
 */

import svgPaths from "../../../imports/svg-9oy2kbm1fd";

interface JetLogoProps {
  variant?: "full" | "icon" | "wordmark-png";
  mode?: "dark" | "light" | "auto";
  className?: string;
  /** Height in pixels — width scales proportionally */
  height?: number;
}

export function JetLogo({
  variant = "full",
  mode = "auto",
  className = "",
  height = 32,
}: JetLogoProps) {
  // Default: SVG full wordmark — crisp at any size
  // "icon" and "wordmark-png" variants fall through to SVG (Figma assets not available outside Figma)
  const textFill = mode === "light" ? "white" : mode === "dark" ? "black" : "currentColor";

  return (
    <svg
      viewBox="0 0 532 201"
      fill="none"
      className={`${className}`}
      style={{ height, width: "auto" }}
      aria-label="Jet"
      role="img"
    >
      {/* "j" letterform */}
      <path
        d={svgPaths.p1a564d00}
        fill={textFill}
        fillRule="evenodd"
        clipRule="evenodd"
      />
      {/* "j" dot */}
      <path
        d={svgPaths.p230e7f80}
        fill="#046538"
        fillRule="evenodd"
        clipRule="evenodd"
      />
      {/* "e" letterform */}
      <path
        d={svgPaths.p39cdf900}
        fill={textFill}
        fillRule="evenodd"
        clipRule="evenodd"
      />
      {/* "t" letterform */}
      <path
        d={svgPaths.p255fb780}
        fill={textFill}
        fillRule="evenodd"
        clipRule="evenodd"
      />
      {/* Chevron — light green */}
      <path
        d={svgPaths.p19aae700}
        fill="#1DB954"
        fillRule="evenodd"
        clipRule="evenodd"
      />
      {/* Chevron — dark green (large) */}
      <path
        d={svgPaths.p3d01a080}
        fill="#046538"
        fillRule="evenodd"
        clipRule="evenodd"
      />
      {/* Chevron — dark green (small) */}
      <path
        d={svgPaths.p10ba3440}
        fill="#046538"
        fillRule="evenodd"
        clipRule="evenodd"
      />
    </svg>
  );
}
