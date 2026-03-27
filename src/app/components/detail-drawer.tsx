/**
 * DETAIL DRAWER — Shared overlay side panel
 *
 * Systemic component used by all fleet tabs (Drivers, Vehicles, Earnings, etc.)
 * to guarantee identical height, animation, and responsive behavior.
 *
 * Behavior (matches Figma):
 *   Desktop: absolute overlay pinned to the right of the nearest relative parent,
 *            full height, slides in from right. Content underneath does NOT reflow.
 *   Mobile:  fixed slide-over from right with backdrop.
 *
 * A11y:
 *   - Escape key closes the drawer
 *   - Body scroll locked on mobile when open
 *   - role="dialog" + aria-label for screen readers
 *   - Backdrop click closes (mobile)
 *
 * The parent view must have `position: relative` on its outer container so the
 * desktop drawer anchors correctly. The drawer is placed OUTSIDE any flex row —
 * it overlays, it does not participate in flex layout.
 *
 * Usage:
 *   <div className="h-full flex flex-col relative overflow-hidden">
 *     <div>...toolbar...</div>
 *     <div className="flex-1 overflow-y-auto">...table...</div>
 *     <DetailDrawer open={!!selected} onClose={() => set(null)}>
 *       <YourDetailContent />
 *     </DetailDrawer>
 *   </div>
 */

import { type ReactNode, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useAdminTheme } from "../config/admin-theme";

const DRAWER_WIDTH = 380;
const EASE = [0.16, 1, 0.3, 1] as const;

interface DetailDrawerProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  width?: number;
  ariaLabel?: string;
}

export function DetailDrawer({ open, onClose, children, width = DRAWER_WIDTH, ariaLabel = "Detail panel" }: DetailDrawerProps) {
  const { t, theme } = useAdminTheme();
  const isDark = theme === "dark";
  const drawerRef = useRef<HTMLDivElement>(null);

  // ── Escape key handler ──────────────────────────────────────────────────
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        onClose();
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, onClose]);

  // ── Body scroll lock on mobile ──────────────────────────────────────────
  useEffect(() => {
    if (!open) return;

    // Only lock on mobile (check if mobile drawer would render)
    const isMobile = window.matchMedia("(max-width: 767px)").matches;
    if (!isMobile) return;

    const originalOverflow = document.body.style.overflow;
    const originalPosition = document.body.style.position;
    const originalWidth = document.body.style.width;
    const scrollY = window.scrollY;

    document.body.style.overflow = "hidden";
    document.body.style.position = "fixed";
    document.body.style.width = "100%";
    document.body.style.top = `-${scrollY}px`;

    return () => {
      document.body.style.overflow = originalOverflow;
      document.body.style.position = originalPosition;
      document.body.style.width = originalWidth;
      document.body.style.top = "";
      window.scrollTo(0, scrollY);
    };
  }, [open]);

  return (
    <>
      {/* ── Desktop: absolute overlay on right ─────────────────────────── */}
      <AnimatePresence>
        {open && (
          <motion.div
            ref={drawerRef}
            key="detail-drawer-desktop"
            className="absolute top-0 right-0 bottom-0 z-30 hidden md:flex flex-col overflow-hidden"
            role="dialog"
            aria-label={ariaLabel}
            aria-modal="false"
            style={{
              width,
              background: isDark ? "rgba(17,17,19,0.98)" : "rgba(255,255,255,0.98)",
              backdropFilter: "blur(16px)",
              borderLeft: `1px solid ${t.borderSubtle}`,
              boxShadow: isDark
                ? "-12px 0 40px rgba(0,0,0,0.35)"
                : "-12px 0 40px rgba(0,0,0,0.08)",
            }}
            initial={{ x: width }}
            animate={{ x: 0 }}
            exit={{ x: width }}
            transition={{ duration: 0.25, ease: EASE as unknown as number[] }}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Mobile: fixed slide-over from right ────────────────────────── */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="detail-drawer-mobile"
            className="fixed inset-0 z-40 md:hidden"
            role="dialog"
            aria-label={ariaLabel}
            aria-modal="true"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div
              className="absolute inset-0"
              style={{ background: isDark ? "rgba(0,0,0,0.6)" : "rgba(0,0,0,0.25)" }}
              onClick={onClose}
              aria-label="Close panel"
              role="button"
              tabIndex={0}
              onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") onClose(); }}
            />
            <motion.div
              className="absolute top-0 right-0 h-full flex flex-col overflow-hidden"
              style={{
                width: "100%",
                maxWidth: width,
                background: isDark ? "#111113" : "#fff",
                borderLeft: `1px solid ${t.borderSubtle}`,
                boxShadow: isDark
                  ? "-8px 0 32px rgba(0,0,0,0.5)"
                  : "-8px 0 32px rgba(0,0,0,0.1)",
              }}
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.25, ease: EASE as unknown as number[] }}
            >
              {children}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
