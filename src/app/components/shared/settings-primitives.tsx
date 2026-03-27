/**
 * SHARED SETTINGS PRIMITIVES
 *
 * Single source of truth for settings UI components used across:
 *   - Fleet Settings (/views/fleet-settings.tsx)
 *   - Hotel Settings (/views/hotel-settings.tsx)
 *   - Any future settings surface
 *
 * Components:
 *   SettingCard — rounded-2xl card wrapper with theme-aware surface
 *   SectionHeader — icon + title + description header
 *   FieldRow — label/sublabel left, input right, responsive
 *   Separator — gradient fade divider (Linear/Vercel style)
 *   TextInput — themed input with green focus ring
 *   TextArea — multi-line themed input with green focus ring
 *   Toggle — animated boolean switch
 *   SelectPill — segmented pill selector
 *   SaveBar — floating unsaved-changes bar with save/discard
 *   SettingsSkeleton — skeleton loading state
 *   motionProps — stagger animation helper
 *
 * Data source: UI-only primitives, no data coupling.
 */

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Save } from "lucide-react";
import { useAdminTheme, BRAND, TY } from "../../config/admin-theme";

const STAGGER = 0.04;

// ─── Stagger animation helper ──────────────────────────────────────────────

export function motionProps(i: number, reducedMotion: boolean) {
  if (reducedMotion) return {};
  return {
    initial: { opacity: 0, y: 8 },
    animate: { opacity: 1, y: 0 },
    transition: { delay: i * STAGGER, duration: 0.3, ease: [0.16, 1, 0.3, 1] },
  };
}

// ─── SettingCard ────────────────────────────────────────────────────────────

export function SettingCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const { theme } = useAdminTheme();
  const isDark = theme === "dark";
  return (
    <div
      className={`rounded-2xl p-5 ${className}`}
      style={{
        background: isDark ? "rgba(255,255,255,0.02)" : "#FFFFFF",
        border: `1px solid ${isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.05)"}`,
        boxShadow: isDark ? "none" : "0 1px 3px rgba(0,0,0,0.04)",
      }}
    >
      {children}
    </div>
  );
}

// ─── SectionHeader ─────────────────────────────────────────────────────────

export function SectionHeader({ title, description, icon: Icon }: {
  title: string; description: string; icon: React.ComponentType<{ size?: number; style?: React.CSSProperties }>;
}) {
  const { t } = useAdminTheme();
  return (
    <div className="flex items-start gap-3 mb-5">
      <div
        className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5"
        style={{ background: `${BRAND.green}08`, border: `1px solid ${BRAND.green}10` }}
      >
        <Icon size={14} style={{ color: BRAND.green }} />
      </div>
      <div>
        <span style={{
          fontFamily: "'Montserrat', sans-serif", fontWeight: 600,
          fontSize: "14px", letterSpacing: "-0.03em", color: t.text, lineHeight: "1.2",
          display: "block", marginBottom: 2,
        }}>
          {title}
        </span>
        <span style={{ ...TY.bodyR, fontSize: "11px", color: t.textMuted, lineHeight: "1.5" }}>
          {description}
        </span>
      </div>
    </div>
  );
}

// ─── FieldRow ──────────────────────────────────────────────────────────────

export function FieldRow({ label, sublabel, children }: { label: string; sublabel?: string; children: React.ReactNode }) {
  const { t } = useAdminTheme();
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 py-3.5">
      <div className="sm:w-[180px] shrink-0">
        <span style={{ ...TY.body, fontSize: "12px", color: t.text, lineHeight: "1.4", display: "block" }}>{label}</span>
        {sublabel && <span style={{ ...TY.bodyR, fontSize: "10px", color: t.textFaint, lineHeight: "1.4" }}>{sublabel}</span>}
      </div>
      <div className="flex-1">{children}</div>
    </div>
  );
}

// ─── Separator ─────────────────────────────────────────────────────────────

export function Separator() {
  const { theme } = useAdminTheme();
  const isDark = theme === "dark";
  return (
    <div
      style={{
        height: 1,
        background: isDark
          ? "linear-gradient(90deg, transparent, rgba(255,255,255,0.04) 20%, rgba(255,255,255,0.04) 80%, transparent)"
          : "linear-gradient(90deg, transparent, rgba(0,0,0,0.04) 20%, rgba(0,0,0,0.04) 80%, transparent)",
      }}
    />
  );
}

// ─── TextInput ─────────────────────────────────────────────────────────────

export function TextInput({ value, onChange, placeholder, type = "text", disabled = false }: {
  value: string; onChange: (v: string) => void; placeholder?: string; type?: string; disabled?: boolean;
}) {
  const { t, theme } = useAdminTheme();
  const isDark = theme === "dark";
  const [focused, setFocused] = useState(false);
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      disabled={disabled}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      className="w-full px-3 py-2 rounded-xl outline-none transition-all duration-150"
      style={{
        ...TY.bodyR,
        fontSize: "12px",
        color: disabled ? t.textFaint : t.text,
        lineHeight: "1.4",
        background: isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)",
        border: `1px solid ${focused && !disabled ? BRAND.green + "60" : isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}`,
        boxShadow: focused && !disabled ? `0 0 0 2px ${BRAND.green}18` : "none",
        opacity: disabled ? 0.6 : 1,
      }}
    />
  );
}

// ─── TextArea ──────────────────────────────────────────────────────────────

export function TextArea({ value, onChange, placeholder, rows = 3, disabled = false }: {
  value: string; onChange: (v: string) => void; placeholder?: string; rows?: number; disabled?: boolean;
}) {
  const { t, theme } = useAdminTheme();
  const isDark = theme === "dark";
  const [focused, setFocused] = useState(false);
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      disabled={disabled}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      className="w-full px-3 py-2 rounded-xl outline-none transition-all duration-150 resize-none"
      style={{
        ...TY.bodyR,
        fontSize: "12px",
        color: disabled ? t.textFaint : t.text,
        lineHeight: "1.5",
        background: isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)",
        border: `1px solid ${focused && !disabled ? BRAND.green + "60" : isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}`,
        boxShadow: focused && !disabled ? `0 0 0 2px ${BRAND.green}18` : "none",
        opacity: disabled ? 0.6 : 1,
      }}
    />
  );
}

// ─── Toggle ────────────────────────────────────────────────────────────────

export function Toggle({ checked, onChange, disabled = false }: { checked: boolean; onChange: (v: boolean) => void; disabled?: boolean }) {
  const { theme } = useAdminTheme();
  const isDark = theme === "dark";
  return (
    <button
      onClick={() => !disabled && onChange(!checked)}
      className="relative w-9 h-5 rounded-full transition-colors duration-200 cursor-pointer shrink-0"
      style={{
        background: checked
          ? BRAND.green
          : isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)",
        opacity: disabled ? 0.5 : 1,
      }}
      aria-pressed={checked}
      role="switch"
    >
      <motion.div
        className="absolute top-0.5 w-4 h-4 rounded-full"
        style={{
          background: "#fff",
          boxShadow: "0 1px 3px rgba(0,0,0,0.15)",
        }}
        animate={{ left: checked ? 18 : 2 }}
        transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
      />
    </button>
  );
}

// ─── SelectPill ────────────────────────────────────────────────────────────

export function SelectPill({ options, value, onChange }: {
  options: { value: string; label: string }[]; value: string; onChange: (v: string) => void;
}) {
  const { t, theme } = useAdminTheme();
  const isDark = theme === "dark";
  return (
    <div className="flex items-center gap-1 p-0.5 rounded-xl" style={{
      background: isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)",
      border: `1px solid ${isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)"}`,
    }}>
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className="px-3 py-1.5 rounded-lg cursor-pointer transition-all duration-150"
          style={{
            background: value === opt.value
              ? isDark ? "rgba(255,255,255,0.06)" : "#fff"
              : "transparent",
            boxShadow: value === opt.value
              ? isDark ? "none" : "0 1px 3px rgba(0,0,0,0.06)"
              : "none",
            ...TY.body,
            fontSize: "11px",
            color: value === opt.value ? t.text : t.textMuted,
            lineHeight: "1.4",
          }}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

// ─── SaveBar ───────────────────────────────────────────────────────────────

export function SaveBar({ dirty, saving, onSave, onDiscard }: {
  dirty: boolean; saving: boolean; onSave: () => void; onDiscard: () => void;
}) {
  const { t, theme } = useAdminTheme();
  const isDark = theme === "dark";

  return (
    <AnimatePresence>
      {dirty && (
        <motion.div
          className="fixed bottom-16 left-1/2 z-40 flex items-center gap-3 px-5 py-3 rounded-2xl"
          style={{
            background: isDark ? "rgba(18,18,20,0.95)" : "rgba(255,255,255,0.97)",
            border: `1px solid ${isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)"}`,
            backdropFilter: "blur(20px)",
            boxShadow: isDark ? "0 12px 40px rgba(0,0,0,0.5)" : "0 12px 40px rgba(0,0,0,0.12)",
            transform: "translateX(-50%)",
          }}
          initial={{ opacity: 0, y: 20, x: "-50%" }}
          animate={{ opacity: 1, y: 0, x: "-50%" }}
          exit={{ opacity: 0, y: 20, x: "-50%" }}
          transition={{ duration: 0.25 }}
        >
          <span style={{ ...TY.body, fontSize: "12px", color: t.textMuted, lineHeight: "1.4", letterSpacing: "-0.02em" }}>
            Unsaved changes
          </span>
          <button
            onClick={onDiscard}
            className="px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
            style={{
              background: isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.03)",
              border: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}`,
              ...TY.body, fontSize: "11px", color: t.textMuted, lineHeight: "1.4",
            }}
          >
            Discard
          </button>
          <button
            onClick={onSave}
            disabled={saving}
            className="px-4 py-1.5 rounded-lg transition-opacity hover:opacity-90 cursor-pointer flex items-center gap-1.5"
            style={{
              background: BRAND.green,
              ...TY.body, fontSize: "11px", color: "#fff", lineHeight: "1.4",
              opacity: saving ? 0.7 : 1,
            }}
          >
            {saving ? (
              <motion.div
                className="w-3 h-3 rounded-full border-2 border-white/30"
                style={{ borderTopColor: "#fff" }}
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 0.6, ease: "linear" }}
              />
            ) : (
              <Save size={11} />
            )}
            {saving ? "Saving..." : "Save changes"}
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─── SettingsSkeleton ──────────────────────────────────────────────────────

export function SettingsSkeleton() {
  const { theme } = useAdminTheme();
  const isDark = theme === "dark";
  const shimmer = isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)";
  return (
    <div className="space-y-4 animate-pulse">
      {[1, 2, 3].map((i) => (
        <div key={i} className="rounded-2xl p-5" style={{
          background: isDark ? "rgba(255,255,255,0.02)" : "#fff",
          border: `1px solid ${isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.05)"}`,
        }}>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-xl" style={{ background: shimmer }} />
            <div className="flex-1 space-y-2">
              <div className="h-3 w-32 rounded" style={{ background: shimmer }} />
              <div className="h-2 w-48 rounded" style={{ background: shimmer }} />
            </div>
          </div>
          {[1, 2, 3].map((j) => (
            <div key={j} className="flex items-center gap-4 py-3">
              <div className="h-2.5 w-24 rounded" style={{ background: shimmer }} />
              <div className="flex-1 h-8 rounded-xl" style={{ background: shimmer }} />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
