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
import imgJetLogoIcon from "figma:asset/7dc8f36e08920bdc46a6fffcaeb8bd5df5addb8b.png";
import imgJetLogo from "figma:asset/7c193654ac3abd16673fc92255e5e60a8a6fd1cf.png";
import imgJetLogoWhite from "figma:asset/23458c6351127b3aa839838836df8e464e79e3f9.png";

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
  if (variant === "icon") {
    return (
      <img
        src={imgJetLogoIcon}
        alt="Jet"
        className={`object-contain ${className}`}
        style={{ height }}
      />
    );
  }

  if (variant === "wordmark-png") {
    const src = mode === "light" ? imgJetLogoWhite : imgJetLogo;
    return (
      <img
        src={src}
        alt="Jet"
        className={`object-contain ${className}`}
        style={{ height }}
      />
    );
  }

  // Default: SVG full wordmark — crisp at any size
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
