 /**
 * PageShell — Consistent page wrapper with responsive padding,
 * max-width constraints, and scroll behavior.
 *
 * Designed to produce clean auto-layout when exported to Figma:
 * - Uses flex column layout (maps to vertical auto-layout)
 * - Consistent padding scale on 4px grid
 * - No absolute positioning
 */

import { type ReactNode } from "react";

interface PageShellProps {
  children: ReactNode;
  /** Optional max-width constraint. Defaults to full width. */
  maxWidth?: "sm" | "md" | "lg" | "xl" | "full";
  /** Optional padding override */
  className?: string;
}

const maxWidthMap = {
  sm: "max-w-2xl",
  md: "max-w-4xl",
  lg: "max-w-6xl",
  xl: "max-w-7xl",
  full: "max-w-full",
};

export function PageShell({
  children,
  maxWidth = "full",
  className = "",
}: PageShellProps) {
  return (
    <div
      className={`flex flex-col w-full min-h-full px-4 py-6 sm:px-6 lg:px-8 ${maxWidthMap[maxWidth]} mx-auto ${className}`}
    >
      {children}
    </div>
  );
}
