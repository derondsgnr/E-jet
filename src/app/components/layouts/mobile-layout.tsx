 /**
 * MobileLayout — Shared layout shell for mobile app screens.
 *
 * Used by: Rider app, Driver app
 *
 * Architecture:
 * - Full-bleed content area (map-centric views)
 * - Bottom navigation bar
 * - Optional top bar (context-dependent)
 * - Safe area handling for notch/home indicator
 *
 * Built for Figma auto-layout export:
 * - Flex column only
 * - Safe area padding via env()
 * - Touch targets minimum 44px
 */

import { Outlet } from "react-router";
import type { UserType } from "../../config/project";

interface MobileLayoutProps {
  userType: Extract<UserType, "rider" | "driver">;
}

export function MobileLayout({ userType }: MobileLayoutProps) {
  return (
    <div className="flex flex-col h-screen w-full bg-background overflow-hidden">
      {/* Content area — full bleed for maps, padded for lists */}
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>

      {/* Bottom navigation */}
      <nav className="flex items-center justify-around h-16 border-t border-border bg-background/95 backdrop-blur-sm shrink-0 pb-[env(safe-area-inset-bottom)]">
        {/* Nav items injected per user type */}
      </nav>
    </div>
  );
}
