/**
 * JET ADMIN — PROFILE MENU
 *
 * Avatar popover with account info, theme toggle, quick actions.
 * Pattern: Linear account menu, Vercel team selector
 */

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { User, Settings, LogOut, Moon, Sun, Shield, HelpCircle, ExternalLink } from "lucide-react";
import { useAdminTheme, TY, BRAND, STATUS } from "../../../config/admin-theme";

interface ProfileMenuProps {
  open: boolean;
  onClose: () => void;
  onNavigate: (route: string) => void;
  onLogout: () => void;
}

export function ProfileMenu({ open, onClose, onNavigate, onLogout }: ProfileMenuProps) {
  const { t, theme, toggle: toggleTheme } = useAdminTheme();
  const isDark = theme === "dark";
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) onClose();
    };
    // Delay to prevent immediate close from the click that opened it
    const timeout = setTimeout(() => document.addEventListener("mousedown", handler), 50);
    return () => { clearTimeout(timeout); document.removeEventListener("mousedown", handler); };
  }, [open, onClose]);

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          ref={menuRef}
          className="absolute right-0 top-full mt-2 z-[160] rounded-xl overflow-hidden"
          style={{
            width: 260,
            background: t.overlay,
            border: `1px solid ${t.border}`,
            boxShadow: isDark
              ? "0 16px 48px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.03)"
              : "0 16px 48px rgba(0,0,0,0.12), 0 0 0 1px rgba(0,0,0,0.04)",
          }}
          initial={{ opacity: 0, scale: 0.96, y: -4 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.97, y: -2 }}
          transition={{ duration: 0.12, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* User info */}
          <div className="px-4 py-3" style={{ borderBottom: `1px solid ${t.borderSubtle}` }}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: t.greenBg }}>
                <span style={{ ...TY.h, fontSize: "13px", color: BRAND.green }}>AO</span>
              </div>
              <div>
                <span className="block" style={{ ...TY.body, fontSize: "13px", color: t.text }}>Adeola Ogunbiyi</span>
                <span className="block" style={{ ...TY.bodyR, fontSize: "11px", color: t.textMuted }}>Super Admin</span>
              </div>
            </div>
            <div className="flex items-center gap-1.5 mt-2">
              <div className="w-1.5 h-1.5 rounded-full" style={{ background: BRAND.green }} />
              <span style={{ ...TY.bodyR, fontSize: "10px", color: t.textFaint }}>adeola@jet.ng</span>
            </div>
          </div>

          {/* Actions */}
          <div className="py-1.5">
            {[
              { label: "Account Settings", icon: User, action: () => { onNavigate("/admin/settings"); onClose(); } },
              { label: "System Settings", icon: Settings, action: () => { onNavigate("/admin/settings"); onClose(); } },
              { label: "Security & Access", icon: Shield, action: () => { onNavigate("/admin/settings"); onClose(); } },
            ].map(item => (
              <button
                key={item.label}
                onClick={item.action}
                className="w-full flex items-center gap-3 px-4 h-9 transition-colors"
                onMouseEnter={e => (e.currentTarget.style.background = t.surfaceHover)}
                onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
              >
                <item.icon size={14} style={{ color: t.iconMuted }} />
                <span style={{ ...TY.body, fontSize: "12px", color: t.textSecondary }}>{item.label}</span>
              </button>
            ))}
          </div>

          {/* Theme toggle */}
          <div className="px-2 py-1.5" style={{ borderTop: `1px solid ${t.borderSubtle}` }}>
            <button
              onClick={toggleTheme}
              className="w-full flex items-center gap-3 px-2 h-9 rounded-lg transition-colors"
              onMouseEnter={e => (e.currentTarget.style.background = t.surfaceHover)}
              onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
            >
              {isDark ? <Sun size={14} style={{ color: t.iconMuted }} /> : <Moon size={14} style={{ color: t.iconMuted }} />}
              <span className="flex-1 text-left" style={{ ...TY.body, fontSize: "12px", color: t.textSecondary }}>{isDark ? "Light mode" : "Dark mode"}</span>
              <span className="h-5 px-1.5 rounded flex items-center" style={{ background: t.surfaceActive, ...TY.cap, fontSize: "9px", color: t.textFaint }}>⌘D</span>
            </button>
          </div>

          {/* Help + Logout */}
          <div className="py-1.5" style={{ borderTop: `1px solid ${t.borderSubtle}` }}>
            <button
              className="w-full flex items-center gap-3 px-4 h-9 transition-colors"
              onMouseEnter={e => (e.currentTarget.style.background = t.surfaceHover)}
              onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
            >
              <HelpCircle size={14} style={{ color: t.iconMuted }} />
              <span className="flex-1 text-left" style={{ ...TY.body, fontSize: "12px", color: t.textSecondary }}>Help & Documentation</span>
              <ExternalLink size={11} style={{ color: t.textFaint }} />
            </button>
            <button
              onClick={() => { onLogout(); onClose(); }}
              className="w-full flex items-center gap-3 px-4 h-9 transition-colors"
              onMouseEnter={e => (e.currentTarget.style.background = isDark ? "rgba(212,24,61,0.06)" : "rgba(212,24,61,0.04)")}
              onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
            >
              <LogOut size={14} style={{ color: STATUS.error }} />
              <span style={{ ...TY.body, fontSize: "12px", color: STATUS.error }}>Sign out</span>
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}