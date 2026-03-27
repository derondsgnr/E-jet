 /**
 * DashboardLayout — Shared layout shell for web dashboards.
 *
 * Used by: Fleet Owner, Hotel, Admin dashboards
 *
 * Architecture:
 * - Collapsible sidebar on desktop (Linear-style)
 * - Bottom nav on mobile (iOS-style)
 * - Top bar with breadcrumbs, search, user menu
 * - Content area with responsive padding
 *
 * Built for Figma auto-layout export:
 * - Flex column/row only (no absolute positioning)
 * - Consistent gap/padding on 4px grid
 */

import { Outlet } from "react-router";
import type { UserType } from "../../config/project";

interface DashboardLayoutProps {
  userType: UserType;
}

export function DashboardLayout({ userType }: DashboardLayoutProps) {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      {/* Sidebar — desktop */}
      <aside className="hidden lg:flex lg:w-60 xl:w-64 flex-col border-r border-sidebar-border bg-sidebar shrink-0">
        <div className="flex items-center h-14 px-4 border-b border-sidebar-border">
          <span className="text-foreground tracking-tight" style={{ fontFamily: "var(--font-heading)" }}>
            JET
          </span>
          <span className="text-muted-foreground ml-2">
            {userType.replace("-", " ")}
          </span>
        </div>
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {/* Navigation items injected per user type */}
        </nav>
      </aside>

      {/* Main content */}
      <div className="flex flex-1 flex-col min-w-0">
        {/* Top bar */}
        <header className="flex items-center h-14 px-4 sm:px-6 border-b border-border bg-background shrink-0 gap-3">
          {/* Mobile menu trigger, breadcrumbs, search, user menu — TBD */}
          <div className="flex-1" />
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>

      {/* Mobile bottom nav */}
      <nav className="fixed bottom-0 left-0 right-0 lg:hidden flex items-center justify-around h-16 border-t border-border bg-background/95 backdrop-blur-sm z-20 pb-[env(safe-area-inset-bottom)]">
        {/* Bottom nav items — TBD per user type */}
      </nav>
    </div>
  );
}
