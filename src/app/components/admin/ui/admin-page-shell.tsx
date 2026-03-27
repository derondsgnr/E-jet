/**
 * JET ADMIN — PAGE SHELL
 *
 * Shared layout for admin sub-pages.
 * Provides: header bar (search, notifications, profile) + scrollable content area.
 *
 * Header buttons wired:
 *   Search → CommandSearch (⌘K palette)
 *   Bell → NotificationsDrawer (side panel)
 *   Avatar → ProfileMenu (popover)
 */

import { useState, useCallback, useEffect, type ReactNode } from "react";
import { useNavigate } from "react-router";
import { motion } from "motion/react";
import { Search, Bell } from "lucide-react";
import { useAdminTheme, TY, BRAND, STATUS } from "../../../config/admin-theme";
import { ThemeToggle } from "./primitives";
import { ContextualHint } from "./admin-onboarding";
import { CommandSearch } from "./admin-command-search";
import { NotificationsDrawer } from "./admin-notifications";
import { ProfileMenu } from "./admin-profile-menu";

interface AdminPageShellProps {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  children: ReactNode;
}

export function AdminPageShell({ title, subtitle, actions, children }: AdminPageShellProps) {
  const { t } = useAdminTheme();
  const navigate = useNavigate();

  const [searchOpen, setSearchOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const handleNavigate = useCallback((route: string) => {
    navigate(route);
  }, [navigate]);

  const handleLogout = useCallback(() => {
    navigate("/admin/login");
  }, [navigate]);

  // Global ⌘K shortcut
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen(prev => !prev);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return (
    <>
      {/* ─── Header ─── */}
      <motion.div
        className="flex items-center justify-between px-3 md:px-5 h-12 md:h-14 shrink-0"
        style={{ background: t.overlay, borderBottom: `1px solid ${t.border}` }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        <div className="flex items-center gap-2 md:gap-3 min-w-0">
          <h1 className="truncate" style={{ ...TY.sub, fontSize: "13px", color: t.text }}>{title}</h1>
          {subtitle && (
            <span className="hidden sm:inline" style={{ ...TY.bodyR, fontSize: "11px", color: t.textGhost }}>{subtitle}</span>
          )}
        </div>

        <div className="flex items-center gap-1.5 md:gap-2 shrink-0">
          {actions}
          <span className="hidden md:inline-flex"><ThemeToggle /></span>

          {/* Search */}
          <ContextualHint id="search-hint" text="Search across all sections (⌘K)" position="bottom" delay={2000}>
            <button
              onClick={() => setSearchOpen(true)}
              className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
              style={{ background: t.surfaceHover }}
              onMouseEnter={e => (e.currentTarget.style.background = t.surfaceActive)}
              onMouseLeave={e => (e.currentTarget.style.background = t.surfaceHover)}
            >
              <Search size={14} style={{ color: t.icon }} />
            </button>
          </ContextualHint>

          {/* Notifications */}
          <ContextualHint id="notifications-hint" text="Alerts and system notifications" position="bottom" delay={3200}>
            <button
              onClick={() => setNotificationsOpen(true)}
              className="relative w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
              style={{ background: t.surfaceHover }}
              onMouseEnter={e => (e.currentTarget.style.background = t.surfaceActive)}
              onMouseLeave={e => (e.currentTarget.style.background = t.surfaceHover)}
            >
              <Bell size={14} style={{ color: t.icon }} />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full" style={{ background: STATUS.error }} />
            </button>
          </ContextualHint>

          {/* Profile */}
          <div className="relative">
            <button
              onClick={() => setProfileOpen(prev => !prev)}
              className="w-8 h-8 rounded-full flex items-center justify-center transition-all cursor-pointer"
              style={{ background: t.greenBg, outline: profileOpen ? `2px solid ${BRAND.green}` : "2px solid transparent" }}
            >
              <span style={{ ...TY.cap, fontSize: "10px", color: BRAND.green }}>AO</span>
            </button>
            <ProfileMenu
              open={profileOpen}
              onClose={() => setProfileOpen(false)}
              onNavigate={handleNavigate}
              onLogout={handleLogout}
            />
          </div>
        </div>
      </motion.div>

      {/* ─── Content ─── */}
      <div className="flex-1 min-h-0 overflow-y-auto scrollbar-hide flex flex-col">
        {children}
      </div>

      {/* ─── Overlays ─── */}
      <CommandSearch open={searchOpen} onClose={() => setSearchOpen(false)} onNavigate={handleNavigate} />
      <NotificationsDrawer open={notificationsOpen} onClose={() => setNotificationsOpen(false)} onNavigate={handleNavigate} />
    </>
  );
}
