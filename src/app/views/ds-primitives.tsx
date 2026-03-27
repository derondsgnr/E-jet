/**
 * DS PRIMITIVES — Shared documentation helper components.
 * Used across all design system pages.
 */

import { type ReactNode } from "react";
import { useAdminTheme, BRAND, TY, STATUS } from "../config/admin-theme";

// ─── Section Divider ────────────────────────────────────────────────────────

export function Section({ id, title, description, children }: { id: string; title: string; description?: string; children: ReactNode }) {
  const { t, theme } = useAdminTheme();
  const isDark = theme === "dark";
  return (
    <section id={id} className="scroll-mt-20">
      <div className="flex items-center gap-3 mb-2">
        <div className="h-px flex-1" style={{ background: isDark
          ? "linear-gradient(90deg, transparent, rgba(255,255,255,0.06) 40%, rgba(255,255,255,0.06) 60%, transparent)"
          : "linear-gradient(90deg, transparent, rgba(0,0,0,0.06) 40%, rgba(0,0,0,0.06) 60%, transparent)" }} />
        <span style={{ ...TY.label, fontSize: "10px", color: t.textMuted, letterSpacing: "0.12em" }}>{title}</span>
        <div className="h-px flex-1" style={{ background: isDark
          ? "linear-gradient(90deg, transparent, rgba(255,255,255,0.06) 40%, rgba(255,255,255,0.06) 60%, transparent)"
          : "linear-gradient(90deg, transparent, rgba(0,0,0,0.06) 40%, rgba(0,0,0,0.06) 60%, transparent)" }} />
      </div>
      {description && (
        <p className="text-center mb-5" style={{ ...TY.bodyR, fontSize: "11px", color: t.textFaint }}>{description}</p>
      )}
      <div className="mt-4">{children}</div>
    </section>
  );
}

// ─── Card ───────────────────────────────────────────────────────────────────

export function DSCard({ children, className = "", noPad }: { children: ReactNode; className?: string; noPad?: boolean }) {
  const { theme } = useAdminTheme();
  const isDark = theme === "dark";
  return (
    <div
      className={`rounded-2xl ${noPad ? "" : "p-5"} ${className}`}
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

// ─── Section Label ──────────────────────────────────────────────────────────

export function SLabel({ children }: { children: string }) {
  const { t } = useAdminTheme();
  return <span style={{ ...TY.label, fontSize: "9px", color: t.textMuted, display: "block", marginBottom: 10, letterSpacing: "0.08em" }}>{children}</span>;
}

// ─── Prop Table ─────────────────────────────────────────────────────────────

export function PropTable({ rows }: { rows: [string, string, string][] }) {
  const { t, theme } = useAdminTheme();
  const isDark = theme === "dark";
  return (
    <div className="rounded-xl overflow-hidden" style={{ border: `1px solid ${t.borderSubtle}` }}>
      <div className="flex px-3 py-1.5" style={{ background: isDark ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.02)" }}>
        <span className="w-[120px] shrink-0" style={{ ...TY.label, fontSize: "8px", color: t.textFaint }}>PROP</span>
        <span className="w-[100px] shrink-0" style={{ ...TY.label, fontSize: "8px", color: t.textFaint }}>TYPE</span>
        <span className="flex-1" style={{ ...TY.label, fontSize: "8px", color: t.textFaint }}>DEFAULT</span>
      </div>
      {rows.map(([prop, type, def]) => (
        <div key={prop} className="flex px-3 py-1.5" style={{ borderTop: `1px solid ${t.borderSubtle}` }}>
          <span className="w-[120px] shrink-0" style={{ ...TY.body, fontSize: "10px", color: BRAND.green, fontFamily: "monospace", lineHeight: "1.4", letterSpacing: "-0.02em" }}>{prop}</span>
          <span className="w-[100px] shrink-0" style={{ ...TY.bodyR, fontSize: "10px", color: t.textTertiary, fontFamily: "monospace", lineHeight: "1.4" }}>{type}</span>
          <span className="flex-1" style={{ ...TY.bodyR, fontSize: "10px", color: t.textFaint, fontFamily: "monospace", lineHeight: "1.4" }}>{def}</span>
        </div>
      ))}
    </div>
  );
}

// ─── Color Swatch ───────────────────────────────────────────────────────────

export function Swatch({ color, name, value, size = "md" }: { color: string; name: string; value: string; size?: "sm" | "md" | "lg" }) {
  const { t } = useAdminTheme();
  const dim = size === "lg" ? "w-20 h-20" : size === "md" ? "w-14 h-14" : "w-10 h-10";
  return (
    <div className="flex flex-col items-center gap-1.5">
      <div className={`${dim} rounded-xl`} style={{ background: color, border: "1px solid rgba(128,128,128,0.15)", boxShadow: "inset 0 1px 0 rgba(255,255,255,0.1)" }} />
      <span style={{ ...TY.body, fontSize: "10px", color: t.text, lineHeight: "1.3", letterSpacing: "-0.02em" }}>{name}</span>
      <span style={{ ...TY.bodyR, fontSize: "9px", color: t.textFaint, lineHeight: "1.2", fontFamily: "monospace" }}>{value}</span>
    </div>
  );
}

// ─── Token Row ──────────────────────────────────────────────────────────────

export function TokenRow({ name, value, preview }: { name: string; value: string; preview?: "bg" | "text" | "border" }) {
  const { t } = useAdminTheme();
  return (
    <div className="flex items-center gap-3 py-1.5">
      {preview === "text" ? (
        <span className="w-5 text-center shrink-0" style={{ color: value, fontWeight: 600, fontSize: "13px" }}>Aa</span>
      ) : preview === "border" ? (
        <div className="w-5 h-5 rounded-md shrink-0" style={{ border: `2px solid ${value}` }} />
      ) : (
        <div className="w-5 h-5 rounded-md shrink-0" style={{ background: value, border: "1px solid rgba(128,128,128,0.15)" }} />
      )}
      <span style={{ ...TY.body, fontSize: "11px", color: t.text, lineHeight: "1.3", fontFamily: "monospace", flex: 1, letterSpacing: "-0.02em" }}>{name}</span>
      <span style={{ ...TY.bodyR, fontSize: "10px", color: t.textFaint, lineHeight: "1.3", fontFamily: "monospace" }}>{value.length > 35 ? value.slice(0, 35) + "…" : value}</span>
    </div>
  );
}

// ─── Status Badge (doc preview) ─────────────────────────────────────────────

export function StatusBadge({ label, color, bg, border }: { label: string; color: string; bg: string; border: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full" style={{ background: bg, border: `1px solid ${border}` }}>
      <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: color }} />
      <span style={{ ...TY.body, fontSize: "11px", color, lineHeight: "1.3", letterSpacing: "-0.02em" }}>{label}</span>
    </span>
  );
}

// ─── Note Card ──────────────────────────────────────────────────────────────

export function NoteCard({ children, variant = "info" }: { children: ReactNode; variant?: "info" | "warning" | "error" | "green" }) {
  const { t } = useAdminTheme();
  const map = {
    info: { bg: t.infoBg, border: t.infoBorder, text: t.infoText },
    warning: { bg: t.warningBg, border: t.warningBorder, text: t.warningText },
    error: { bg: t.errorBg, border: t.errorBorder, text: t.errorText },
    green: { bg: t.greenBg, border: t.greenBorder, text: t.greenText },
  };
  const s = map[variant];
  return (
    <div className="p-3 rounded-xl" style={{ background: s.bg, border: `1px solid ${s.border}` }}>
      <span style={{ ...TY.body, fontSize: "10px", color: s.text, lineHeight: "1.4", letterSpacing: "-0.02em" }}>{children}</span>
    </div>
  );
}

// ─── Separator ──────────────────────────────────────────────────────────────

export function DSep() {
  const { theme } = useAdminTheme();
  const isDark = theme === "dark";
  return (
    <div className="my-5 h-px" style={{
      background: isDark
        ? "linear-gradient(90deg, transparent, rgba(255,255,255,0.06) 20%, rgba(255,255,255,0.06) 80%, transparent)"
        : "linear-gradient(90deg, transparent, rgba(0,0,0,0.06) 20%, rgba(0,0,0,0.06) 80%, transparent)"
    }} />
  );
}
