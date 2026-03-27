/**
 * JET — COMPREHENSIVE DESIGN SYSTEM
 *
 * Figma-exportable single-page reference at /design-system.
 * Covers every token, component, state, chart, and pattern.
 * Standard: Untitled UI / shadcn documentation level.
 *
 * Sections:
 *  01. Brand Identity
 *  02. Color Palette (brand · status · grey · green tints)
 *  03. Semantic Tokens (surfaces · text · borders · icons · status sets)
 *  04. Typography (type scale · font specimens · hierarchy demo)
 *  05. Spacing & Grid
 *  06. Radius & Elevation
 *  07. Separators & Dividers
 *  08. Buttons (variants × states × sizes × icons)
 *  09. Inputs (text · textarea · search · disabled · error · focus)
 *  10. Toggles & Selects (toggle · select pill · filter pills)
 *  11. Status System (driver · ride · vehicle · demand · type badges)
 *  12. Cards & Surfaces (standard · accent · glass · KPI · field row)
 *  13. Badges & Pills
 *  14. Charts & Data Viz (sparkline · area chart · progress bar · battery bar)
 *  15. Modals (confirm destructive · confirm success · form sheet · picker modal)
 *  16. Drawers (detail drawer · mobile sheet)
 *  17. Toasts (success · info · error)
 *  18. Alerts & Banners (inline warning · info · error · success)
 *  19. Notification Panel
 *  20. Skeletons (6 variants)
 *  21. Empty & Error States
 *  22. Save Bar
 *  23. Motion Language
 *  24. Icons
 *  25. Accessibility
 */

import { useState, type ReactNode } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Sun, Moon, Zap, Car, Users, Wallet, Star,
  AlertTriangle, CheckCircle, Info, XCircle, AlertCircle,
  Search, Plus, ChevronRight, ChevronDown, X, Copy,
  LayoutDashboard, Settings, Bell, Clock,
  ArrowUp, ArrowDown, Shield, MapPin, Keyboard,
  UserPlus, Mail, Phone, Download, Wrench, RotateCcw,
  Eye, EyeOff, MoreHorizontal, Filter, ArrowUpDown,
} from "lucide-react";
import {
  AdminThemeProvider, useAdminTheme, BRAND, TY, STATUS,
} from "../config/admin-theme";
import {
  FieldRow, Separator,
  TextInput, TextArea, Toggle, SelectPill,
  SettingsSkeleton,
} from "../components/shared/settings-primitives";
import {
  DashboardSkeleton, TableSkeleton, EarningsSkeleton,
  BillingSkeleton, FormSkeleton,
} from "../components/shared/view-skeleton";
import { Sparkline, StatusDot } from "../components/fleet/driver-card";

const STAGGER = 0.04;

// ═══════════════════════════════════════════════════════════════════════════
// PRIMITIVE WRAPPERS
// ═══════════════════════════════════════════════════════════════════════════

function Section({ id, title, description, children }: { id: string; title: string; description?: string; children: ReactNode }) {
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

function DSCard({ children, className = "", noPad }: { children: ReactNode; className?: string; noPad?: boolean }) {
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

function SectionLabel({ children }: { children: string }) {
  const { t } = useAdminTheme();
  return <span style={{ ...TY.label, fontSize: "9px", color: t.textMuted, display: "block", marginBottom: 10, letterSpacing: "0.08em" }}>{children}</span>;
}

function PropTable({ rows }: { rows: [string, string, string][] }) {
  const { t, theme } = useAdminTheme();
  const isDark = theme === "dark";
  return (
    <div className="rounded-xl overflow-hidden" style={{ border: `1px solid ${t.borderSubtle}` }}>
      <div className="flex px-3 py-1.5" style={{ background: isDark ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.02)" }}>
        <span className="w-[120px] shrink-0" style={{ ...TY.label, fontSize: "8px", color: t.textFaint }}>PROP</span>
        <span className="w-[100px] shrink-0" style={{ ...TY.label, fontSize: "8px", color: t.textFaint }}>TYPE</span>
        <span className="flex-1" style={{ ...TY.label, fontSize: "8px", color: t.textFaint }}>DEFAULT</span>
      </div>
      {rows.map(([prop, type, def], i) => (
        <div key={prop} className="flex px-3 py-1.5" style={{ borderTop: `1px solid ${t.borderSubtle}` }}>
          <span className="w-[120px] shrink-0" style={{ ...TY.body, fontSize: "10px", color: BRAND.green, fontFamily: "monospace" }}>{prop}</span>
          <span className="w-[100px] shrink-0" style={{ ...TY.bodyR, fontSize: "10px", color: t.textTertiary, fontFamily: "monospace" }}>{type}</span>
          <span className="flex-1" style={{ ...TY.bodyR, fontSize: "10px", color: t.textFaint, fontFamily: "monospace" }}>{def}</span>
        </div>
      ))}
    </div>
  );
}

// ─── Swatch ─────────────────────────────────────────────────────────────────

function Swatch({ color, name, value, size = "md" }: { color: string; name: string; value: string; size?: "sm" | "md" | "lg" }) {
  const { t } = useAdminTheme();
  const dim = size === "lg" ? "w-20 h-20" : size === "md" ? "w-14 h-14" : "w-10 h-10";
  return (
    <div className="flex flex-col items-center gap-1.5">
      <div className={`${dim} rounded-xl`} style={{ background: color, border: "1px solid rgba(128,128,128,0.15)", boxShadow: "inset 0 1px 0 rgba(255,255,255,0.1)" }} />
      <span style={{ ...TY.body, fontSize: "10px", color: t.text, lineHeight: "1.3" }}>{name}</span>
      <span style={{ ...TY.bodyR, fontSize: "9px", color: t.textFaint, lineHeight: "1.2", fontFamily: "monospace" }}>{value}</span>
    </div>
  );
}

function TokenRow({ name, value, preview }: { name: string; value: string; preview?: "bg" | "text" | "border" }) {
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
      <span style={{ ...TY.body, fontSize: "11px", color: t.text, lineHeight: "1.3", fontFamily: "monospace", flex: 1 }}>{name}</span>
      <span style={{ ...TY.bodyR, fontSize: "10px", color: t.textFaint, lineHeight: "1.3", fontFamily: "monospace" }}>{value.length > 35 ? value.slice(0, 35) + "…" : value}</span>
    </div>
  );
}

function StatusBadge({ label, color, bg, border }: { label: string; color: string; bg: string; border: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full" style={{ background: bg, border: `1px solid ${border}` }}>
      <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: color }} />
      <span style={{ ...TY.body, fontSize: "11px", color, lineHeight: "1.3" }}>{label}</span>
    </span>
  );
}

// ─── DSButton ───────────────────────────────────────────────────────────────

function DSButton({ label, variant, state, size = "md", icon }: {
  label: string; variant: "primary" | "secondary" | "ghost" | "destructive" | "outline";
  state?: "default" | "hover" | "active" | "disabled"; size?: "sm" | "md" | "lg"; icon?: ReactNode;
}) {
  const { t, theme } = useAdminTheme();
  const isDark = theme === "dark";
  const disabled = state === "disabled";
  const py = size === "sm" ? "py-1.5 px-3" : size === "lg" ? "py-3 px-6" : "py-2.5 px-4";
  const fs = size === "sm" ? "11px" : size === "lg" ? "13px" : "12px";
  const styles: Record<string, React.CSSProperties> = {
    primary: { background: state === "hover" ? "#1AA64C" : state === "active" ? "#17913F" : BRAND.green, color: "#fff", border: "none" },
    secondary: { background: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.04)", color: t.text, border: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}` },
    ghost: { background: state === "hover" ? (isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.03)") : "transparent", color: t.textSecondary, border: "1px solid transparent" },
    destructive: { background: state === "hover" ? "#BE1537" : STATUS.error, color: "#fff", border: "none" },
    outline: { background: "transparent", color: t.text, border: `1px solid ${t.borderStrong}` },
  };
  return (
    <div className="flex flex-col items-center gap-1.5">
      <button disabled={disabled} className={`inline-flex items-center justify-center gap-1.5 ${py} rounded-xl transition-all cursor-pointer`}
        style={{ ...styles[variant], ...TY.body, fontSize: fs, lineHeight: "1.4", letterSpacing: "-0.02em", opacity: disabled ? 0.45 : 1, minWidth: size === "sm" ? 72 : 100 }}>
        {icon}{label}
      </button>
      {state && <span style={{ ...TY.bodyR, fontSize: "9px", color: t.textFaint }}>{state}</span>}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// CHART COMPONENTS (documented with actual rendered demos)
// ═══════════════════════════════════════════════════════════════════════════

const CHART_DATA = [
  { week: "W1", amount: 420000 }, { week: "W2", amount: 580000 }, { week: "W3", amount: 510000 },
  { week: "W4", amount: 690000 }, { week: "W5", amount: 620000 }, { week: "W6", amount: 780000 },
  { week: "W7", amount: 730000 }, { week: "W8", amount: 850000 }, { week: "W9", amount: 920000 },
  { week: "W10", amount: 1050000 },
];

function MiniAreaChart({ data, width = 320, height = 140 }: { data: { week: string; amount: number }[]; width?: number; height?: number }) {
  const { t, theme } = useAdminTheme();
  const isDark = theme === "dark";
  const [hover, setHover] = useState<number | null>(null);

  const pad = { top: 8, right: 12, bottom: 24, left: 48 };
  const cw = width - pad.left - pad.right;
  const ch = height - pad.top - pad.bottom;
  const amounts = data.map(d => d.amount);
  const minV = Math.min(...amounts) * 0.9;
  const maxV = Math.max(...amounts) * 1.05;
  const range = maxV - minV || 1;
  const xOf = (i: number) => pad.left + (i / (data.length - 1)) * cw;
  const yOf = (v: number) => pad.top + ch - ((v - minV) / range) * ch;
  const fmt = (n: number) => n >= 1000000 ? `₦${(n / 1e6).toFixed(1)}M` : `₦${(n / 1e3).toFixed(0)}K`;

  const linePath = data.map((d, i) => `${i === 0 ? "M" : "L"}${xOf(i).toFixed(1)},${yOf(d.amount).toFixed(1)}`).join(" ");
  const areaPath = `${linePath} L${xOf(data.length - 1).toFixed(1)},${(pad.top + ch).toFixed(1)} L${xOf(0).toFixed(1)},${(pad.top + ch).toFixed(1)} Z`;
  const yTicks = Array.from({ length: 4 }, (_, i) => minV + (range * i) / 3);

  return (
    <svg width={width} height={height} style={{ display: "block" }}>
      <defs>
        <linearGradient id="ds-chart-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={BRAND.green} stopOpacity={isDark ? 0.2 : 0.15} />
          <stop offset="100%" stopColor={BRAND.green} stopOpacity={0} />
        </linearGradient>
      </defs>
      {yTicks.map((tick, i) => (
        <g key={i}>
          <line x1={pad.left} x2={width - pad.right} y1={yOf(tick)} y2={yOf(tick)} stroke={isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.05)"} strokeDasharray="3 3" />
          <text x={pad.left - 6} y={yOf(tick) + 3} textAnchor="end" fill={t.textFaint} style={{ fontSize: 9, fontFamily: "'Manrope', sans-serif" }}>{fmt(tick)}</text>
        </g>
      ))}
      {data.map((d, i) => (
        <text key={i} x={xOf(i)} y={height - 4} textAnchor="middle" fill={t.textFaint} style={{ fontSize: 9, fontFamily: "'Manrope', sans-serif" }}>{d.week}</text>
      ))}
      <path d={areaPath} fill="url(#ds-chart-grad)" />
      <path d={linePath} fill="none" stroke={BRAND.green} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
      {hover !== null && (
        <>
          <line x1={xOf(hover)} x2={xOf(hover)} y1={pad.top} y2={pad.top + ch} stroke={isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"} strokeDasharray="2 2" />
          <circle cx={xOf(hover)} cy={yOf(data[hover].amount)} r={4} fill={BRAND.green} stroke={isDark ? "#0B0B0D" : "#fff"} strokeWidth={2} />
        </>
      )}
      {data.map((_, i) => (
        <rect key={i} x={xOf(i) - cw / data.length / 2} y={pad.top} width={cw / data.length} height={ch}
          fill="transparent" onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(null)} />
      ))}
    </svg>
  );
}

function ProgressBar({ value, max, color, height = 6 }: { value: number; max: number; color: string; height?: number }) {
  const { theme } = useAdminTheme();
  const isDark = theme === "dark";
  const pct = Math.min((value / max) * 100, 100);
  return (
    <div className="w-full rounded-full overflow-hidden" style={{ height, background: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)" }}>
      <motion.div className="h-full rounded-full" style={{ background: color }} initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }} />
    </div>
  );
}

function BatteryBar({ level }: { level: number }) {
  const color = level > 50 ? BRAND.green : level > 20 ? STATUS.warning : STATUS.error;
  const { theme } = useAdminTheme();
  const isDark = theme === "dark";
  return (
    <div className="flex items-center gap-1.5">
      <div className="w-10 h-2.5 rounded-full overflow-hidden" style={{ background: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)" }}>
        <div className="h-full rounded-full" style={{ width: `${level}%`, background: color }} />
      </div>
      <span style={{ ...TY.body, fontSize: "10px", color, fontFamily: "monospace" }}>{level}%</span>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// MAIN
// ═══════════════════════════════════════════════════════════════════════════

function DesignSystemInner() {
  const { t, theme, toggle } = useAdminTheme();
  const isDark = theme === "dark";

  const [toggleVal, setToggleVal] = useState(true);
  const [inputVal, setInputVal] = useState("Lagos, Nigeria");
  const [selectVal, setSelectVal] = useState("daily");
  const [showDrawerDemo, setShowDrawerDemo] = useState(false);
  const [showModalDemo, setShowModalDemo] = useState<"confirm-del" | "confirm-ok" | "form-sheet" | null>(null);
  const [showToastDemo, setShowToastDemo] = useState<"success" | "info" | "error" | null>(null);
  const [showSavebar, setShowSavebar] = useState(false);
  const [skelVar, setSkelVar] = useState<"dashboard" | "table" | "earnings" | "billing" | "form" | "settings">("dashboard");

  const NAV = [
    { id: "brand", label: "Brand" }, { id: "colors", label: "Colors" }, { id: "semantic", label: "Semantic Tokens" },
    { id: "typography", label: "Typography" }, { id: "spacing", label: "Spacing & Grid" }, { id: "radius", label: "Radius & Elevation" },
    { id: "separators", label: "Separators" }, { id: "buttons", label: "Buttons" }, { id: "inputs", label: "Inputs" },
    { id: "toggles", label: "Toggles & Selects" }, { id: "status", label: "Status System" }, { id: "cards", label: "Cards & Surfaces" },
    { id: "badges", label: "Badges & Pills" }, { id: "charts", label: "Charts & Data Viz" }, { id: "modals", label: "Modals & Sheets" },
    { id: "drawers", label: "Drawers" }, { id: "toasts", label: "Toasts" }, { id: "alerts", label: "Alerts & Banners" },
    { id: "notifications", label: "Notifications" }, { id: "skeletons", label: "Skeletons" }, { id: "states", label: "Empty & Error" },
    { id: "savebar", label: "Save Bar" }, { id: "motion", label: "Motion" }, { id: "icons", label: "Icons" },
    { id: "a11y", label: "Accessibility" },
  ];

  return (
    <div className="w-full min-h-screen" style={{ background: t.bg }}>
      {/* ── Top bar ──────────────────────────────────────── */}
      <div className="sticky top-0 z-30 flex items-center gap-4 px-6 py-3" style={{
        background: isDark ? "rgba(8,8,10,0.85)" : "rgba(247,248,250,0.85)",
        backdropFilter: "blur(20px)", borderBottom: `1px solid ${t.borderSubtle}`,
      }}>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md flex items-center justify-center" style={{ background: BRAND.green }}><Zap size={12} color="#fff" /></div>
          <span style={{ ...TY.h, fontSize: "14px", color: t.text }}>JET Design System</span>
        </div>
        <span className="hidden sm:block" style={{ ...TY.bodyR, fontSize: "11px", color: t.textMuted }}>v1.0 · Comprehensive Figma Handoff</span>
        <div className="flex-1" />
        <button onClick={toggle} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg cursor-pointer transition-all"
          style={{ background: isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.03)", border: `1px solid ${t.borderSubtle}` }}>
          {isDark ? <Moon size={12} style={{ color: t.textSecondary }} /> : <Sun size={12} style={{ color: t.textSecondary }} />}
          <span style={{ ...TY.body, fontSize: "11px", color: t.textSecondary }}>{isDark ? "Dark" : "Light"}</span>
        </button>
      </div>

      <div className="flex">
        {/* ── Sidebar ──────────────────────────────────────── */}
        <nav className="hidden lg:flex flex-col w-[180px] shrink-0 sticky top-[52px] h-[calc(100vh-52px)] overflow-y-auto py-4 px-3 gap-0.5">
          {NAV.map((n) => (
            <a key={n.id} href={`#${n.id}`} className="block px-3 py-1.5 rounded-lg transition-colors hover:bg-[rgba(0,0,0,0.03)] dark:hover:bg-[rgba(255,255,255,0.03)]"
              style={{ ...TY.body, fontSize: "11px", color: t.textSecondary, lineHeight: "1.4" }}>{n.label}</a>
          ))}
        </nav>

        {/* ── Content ─────────────────────────────────────── */}
        <main className="flex-1 max-w-[1100px] mx-auto px-5 py-8 space-y-14">

          {/* ═══ 01. BRAND ═══ */}
          <Section id="brand" title="BRAND IDENTITY" description="JET — Premium, reliable e-hailing. Nigeria.">
            <DSCard>
              <div className="flex flex-wrap items-center gap-6 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center" style={{ background: BRAND.green }}><Zap size={28} color="#fff" /></div>
                  <div>
                    <span style={{ ...TY.h, fontSize: "28px", color: t.text, display: "block" }}>JET</span>
                    <span style={{ ...TY.bodyR, fontSize: "11px", color: t.textMuted }}>E-Hailing Platform · EVs + Gas</span>
                  </div>
                </div>
                <div className="flex-1" />
                <div className="flex flex-wrap gap-2">
                  {["Confident", "Efficient", "Trustworthy", "Premium"].map((tr) => (
                    <span key={tr} className="px-3 py-1.5 rounded-full" style={{ background: isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)", border: `1px solid ${t.borderSubtle}`, ...TY.body, fontSize: "10px", color: t.textTertiary }}>{tr}</span>
                  ))}
                </div>
              </div>
              <SectionLabel>DESIGN NORTH STARS</SectionLabel>
              <div className="flex flex-wrap gap-3">
                {[
                  { name: "Apple", desc: "Spatial clarity, purposeful motion" },
                  { name: "Linear", desc: "Tight typography, density done right" },
                  { name: "Vercel", desc: "Monochrome confidence" },
                  { name: "Airbnb", desc: "Trust through transparency" },
                  { name: "Framer", desc: "Fluid motion serves comprehension" },
                  { name: "Figma", desc: "Composable components" },
                ].map((ref) => (
                  <div key={ref.name} className="flex flex-col gap-0.5 px-3 py-2 rounded-lg" style={{ background: `${BRAND.green}06`, border: `1px solid ${BRAND.green}10` }}>
                    <span style={{ ...TY.body, fontSize: "10px", color: t.greenText }}>{ref.name}</span>
                    <span style={{ ...TY.bodyR, fontSize: "9px", color: t.textFaint }}>{ref.desc}</span>
                  </div>
                ))}
              </div>
            </DSCard>
          </Section>

          {/* ═══ 02. COLORS ═══ */}
          <Section id="colors" title="COLOR PALETTE">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <DSCard>
                <SectionLabel>BRAND COLORS</SectionLabel>
                <div className="flex flex-wrap gap-5">
                  <Swatch color={BRAND.green} name="Primary" value="#1DB954" size="lg" />
                  <Swatch color={BRAND.greenDark} name="Dark Green" value="#046538" size="lg" />
                  <Swatch color={BRAND.black} name="Black" value="#0B0B0D" size="lg" />
                  <Swatch color={BRAND.white} name="White" value="#FFFFFF" size="lg" />
                  <Swatch color={BRAND.light} name="Light" value="#F5F5F5" size="lg" />
                </div>
              </DSCard>
              <DSCard>
                <SectionLabel>STATUS COLORS</SectionLabel>
                <div className="flex flex-wrap gap-5">
                  <Swatch color={STATUS.success} name="Success" value="#1DB954" size="lg" />
                  <Swatch color={STATUS.warning} name="Warning" value="#F59E0B" size="lg" />
                  <Swatch color={STATUS.error} name="Error" value="#D4183D" size="lg" />
                  <Swatch color={STATUS.info} name="Info" value="#3B82F6" size="lg" />
                </div>
              </DSCard>
              <DSCard className="md:col-span-2">
                <SectionLabel>GREY SCALE (INVERTS IN DARK MODE)</SectionLabel>
                <div className="flex flex-wrap gap-3">
                  {[
                    { n: "50", l: "#FAFAFA", d: "#171717" }, { n: "100", l: "#F5F5F5", d: "#1C1C1F" },
                    { n: "200", l: "#E5E5E5", d: "#262626" }, { n: "300", l: "#D4D4D4", d: "#404040" },
                    { n: "400", l: "#A3A3A3", d: "#525252" }, { n: "500", l: "#737373", d: "#737373" },
                    { n: "600", l: "#525252", d: "#A3A3A3" }, { n: "700", l: "#404040", d: "#D4D4D4" },
                    { n: "800", l: "#262626", d: "#E5E5E5" }, { n: "900", l: "#171717", d: "#F5F5F5" },
                    { n: "950", l: "#0B0B0D", d: "#FAFAFA" },
                  ].map((g) => <Swatch key={g.n} color={isDark ? g.d : g.l} name={g.n} value={isDark ? g.d : g.l} size="sm" />)}
                </div>
              </DSCard>
              <DSCard className="md:col-span-2">
                <SectionLabel>GREEN OPACITY SCALE</SectionLabel>
                <div className="flex flex-wrap gap-3">
                  {["0.05", "0.10", "0.15", "0.20", "0.30", "0.50", "1"].map((op) => (
                    <Swatch key={op} color={op === "1" ? BRAND.green : `rgba(29,185,84,${op})`} name={`${Math.round(parseFloat(op) * 100)}%`} value={op === "1" ? "#1DB954" : `rgba(29,185,84,${op})`} size="md" />
                  ))}
                </div>
              </DSCard>
            </div>
          </Section>

          {/* ═══ 03. SEMANTIC TOKENS ═══ */}
          <Section id="semantic" title="SEMANTIC TOKENS" description="All tokens adapt to light/dark mode. Toggle above to preview.">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <DSCard><SectionLabel>SURFACES</SectionLabel>
                {(["bg", "bgSubtle", "surface", "surfaceRaised", "surfaceHover", "surfaceActive", "overlay", "glass"] as const).map(k => <TokenRow key={k} name={k} value={t[k]} preview="bg" />)}
              </DSCard>
              <DSCard><SectionLabel>TEXT HIERARCHY</SectionLabel>
                {(["text", "textSecondary", "textTertiary", "textMuted", "textFaint", "textGhost"] as const).map(k => <TokenRow key={k} name={k} value={t[k]} preview="text" />)}
              </DSCard>
              <DSCard><SectionLabel>BORDERS</SectionLabel>
                {(["border", "borderSubtle", "borderStrong"] as const).map(k => <TokenRow key={k} name={k} value={t[k]} preview="border" />)}
              </DSCard>
              <DSCard><SectionLabel>ICONS</SectionLabel>
                {(["icon", "iconSecondary", "iconMuted"] as const).map(k => (
                  <div key={k} className="flex items-center gap-2 py-1.5">
                    <Car size={16} style={{ color: t[k] }} />
                    <span style={{ ...TY.body, fontSize: "11px", color: t.text, fontFamily: "monospace", flex: 1 }}>{k}</span>
                    <span style={{ ...TY.bodyR, fontSize: "10px", color: t.textFaint, fontFamily: "monospace" }}>{t[k]}</span>
                  </div>
                ))}
              </DSCard>
              <DSCard className="md:col-span-2"><SectionLabel>STATUS TOKEN SETS (bg · border · text)</SectionLabel>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {([
                    { name: "Green / Accent", bg: t.greenBg, border: t.greenBorder, text: t.greenText },
                    { name: "Error", bg: t.errorBg, border: t.errorBorder, text: t.errorText },
                    { name: "Warning", bg: t.warningBg, border: t.warningBorder, text: t.warningText },
                    { name: "Info", bg: t.infoBg, border: t.infoBorder, text: t.infoText },
                  ] as const).map((s) => (
                    <div key={s.name} className="p-3 rounded-xl flex flex-col gap-2" style={{ background: s.bg, border: `1px solid ${s.border}` }}>
                      <span style={{ ...TY.body, fontSize: "11px", color: s.text }}>{s.name}</span>
                      <div className="flex flex-col gap-0.5">
                        {(["bg", "border", "text"] as const).map(field => (
                          <span key={field} style={{ ...TY.bodyR, fontSize: "9px", color: s.text, opacity: 0.7, fontFamily: "monospace" }}>{field}: {(s as any)[field]?.toString().slice(0, 30)}</span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </DSCard>
            </div>
          </Section>

          {/* ═══ 04. TYPOGRAPHY ═══ */}
          <Section id="typography" title="TYPOGRAPHY">
            <DSCard>
              <div className="flex flex-wrap gap-8 mb-6">
                <div>
                  <SectionLabel>HEADINGS</SectionLabel>
                  <span style={{ fontFamily: "var(--font-heading)", fontWeight: 600, fontSize: "32px", color: t.text, letterSpacing: "-0.03em", lineHeight: "1.2" }}>Montserrat</span>
                  <span style={{ ...TY.bodyR, fontSize: "10px", color: t.textFaint, display: "block", marginTop: 4 }}>600 semibold · -0.03em · LH 1.2</span>
                </div>
                <div>
                  <SectionLabel>BODY</SectionLabel>
                  <span style={{ fontFamily: "var(--font-body)", fontWeight: 500, fontSize: "32px", color: t.text, letterSpacing: "-0.02em", lineHeight: "1.4" }}>Manrope</span>
                  <span style={{ ...TY.bodyR, fontSize: "10px", color: t.textFaint, display: "block", marginTop: 4 }}>400/500 · -0.02em · LH 1.4–1.5</span>
                </div>
              </div>
              <Separator />
              <div className="mt-5 space-y-4">
                <SectionLabel>TYPE SCALE (TY TOKENS)</SectionLabel>
                {([
                  { token: "TY.h", style: TY.h, size: "24px", sample: "Dashboard Overview" },
                  { token: "TY.sub", style: TY.sub, size: "16px", sample: "Fleet Earnings This Week" },
                  { token: "TY.body", style: TY.body, size: "13px", sample: "Active drivers across all fleets: 24 online, 8 on trip" },
                  { token: "TY.bodyR", style: TY.bodyR, size: "13px", sample: "Last updated 2 minutes ago. Next payout scheduled for Friday." },
                  { token: "TY.cap", style: TY.cap, size: "11px", sample: "₦2,450,000 total revenue" },
                  { token: "TY.label", style: TY.label, size: "10px", sample: "VEHICLE STATUS" },
                ] as const).map(({ token, style, size, sample }) => (
                  <div key={token} className="flex items-baseline gap-4">
                    <span style={{ ...TY.body, fontSize: "10px", color: t.textFaint, width: 56, shrinkL: 0, fontFamily: "monospace" } as any}>{token}</span>
                    <span style={{ ...style, fontSize: size, color: token === "TY.bodyR" ? t.textSecondary : token === "TY.cap" ? t.textMuted : t.text }}>{sample}</span>
                  </div>
                ))}
              </div>
              <Separator />
              <div className="mt-5">
                <SectionLabel>PROPS</SectionLabel>
                <PropTable rows={[
                  ["fontFamily", "string", "var(--font-heading) | var(--font-body)"],
                  ["fontWeight", "400 | 500 | 600", "Per token"],
                  ["letterSpacing", "string", "-0.02em | -0.03em"],
                  ["lineHeight", "string", "1.2 | 1.3 | 1.4 | 1.5"],
                ]} />
              </div>
            </DSCard>
          </Section>

          {/* ═══ 05. SPACING ═══ */}
          <Section id="spacing" title="SPACING & GRID">
            <DSCard>
              <SectionLabel>4PX BASE UNIT</SectionLabel>
              <div className="flex flex-wrap items-end gap-4 mb-4">
                {[4, 8, 12, 16, 20, 24, 32, 40, 48, 64].map((px) => (
                  <div key={px} className="flex flex-col items-center gap-1.5">
                    <div className="rounded" style={{ width: px, height: px, background: `${BRAND.green}30`, border: `1px solid ${BRAND.green}40` }} />
                    <span style={{ ...TY.body, fontSize: "10px", color: t.text, fontFamily: "monospace" }}>{px}</span>
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap gap-4 mt-2">
                {[
                  { label: "Base unit", value: "4px" },
                  { label: "Touch target", value: "44px min" },
                  { label: "Component gap", value: "8–16px" },
                  { label: "Section gap", value: "24–48px" },
                ].map(s => (
                  <span key={s.label} className="px-3 py-1.5 rounded-lg" style={{ background: isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)", border: `1px solid ${t.borderSubtle}`, ...TY.bodyR, fontSize: "10px", color: t.textSecondary }}>
                    {s.label}: <span style={{ color: t.text, fontFamily: "monospace" }}>{s.value}</span>
                  </span>
                ))}
              </div>
            </DSCard>
          </Section>

          {/* ═══ 06. RADIUS & ELEVATION ═══ */}
          <Section id="radius" title="RADIUS & ELEVATION">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <DSCard>
                <SectionLabel>BORDER RADIUS</SectionLabel>
                <div className="flex flex-wrap gap-4">
                  {[
                    { name: "sm", value: "8px" }, { name: "md", value: "10px" },
                    { name: "lg", value: "12px" }, { name: "xl", value: "16px" },
                    { name: "2xl", value: "20px" }, { name: "full", value: "9999px" },
                  ].map(r => (
                    <div key={r.name} className="flex flex-col items-center gap-1.5">
                      <div className="w-14 h-14 flex items-center justify-center" style={{ background: t.surface, border: `1px solid ${t.borderStrong}`, borderRadius: r.value }}>
                        <span style={{ ...TY.body, fontSize: "9px", color: t.textMuted, fontFamily: "monospace" }}>{r.value}</span>
                      </div>
                      <span style={{ ...TY.body, fontSize: "10px", color: t.text }}>{r.name}</span>
                    </div>
                  ))}
                </div>
              </DSCard>
              <DSCard>
                <SectionLabel>ELEVATION (SHADOWS)</SectionLabel>
                <div className="space-y-4">
                  {[
                    { name: "shadow", value: t.shadow, label: "Default" },
                    { name: "shadowLg", value: t.shadowLg, label: "Large (modals, drawers)" },
                  ].map(s => (
                    <div key={s.name} className="flex items-center gap-3">
                      <div className="w-20 h-12 rounded-xl" style={{ background: isDark ? "rgba(255,255,255,0.04)" : "#fff", boxShadow: s.value }} />
                      <div>
                        <span style={{ ...TY.body, fontSize: "10px", color: t.text, fontFamily: "monospace", display: "block" }}>{s.name}</span>
                        <span style={{ ...TY.bodyR, fontSize: "9px", color: t.textFaint }}>{s.label}</span>
                      </div>
                    </div>
                  ))}
                  <div className="flex items-center gap-3">
                    <div className="w-20 h-12 rounded-xl" style={{ background: t.glass, backdropFilter: t.glassBlur, border: `1px solid ${t.borderSubtle}`, boxShadow: t.shadow }} />
                    <div>
                      <span style={{ ...TY.body, fontSize: "10px", color: t.text, fontFamily: "monospace", display: "block" }}>glass</span>
                      <span style={{ ...TY.bodyR, fontSize: "9px", color: t.textFaint }}>Blur + opacity surface</span>
                    </div>
                  </div>
                </div>
              </DSCard>
            </div>
          </Section>

          {/* ═══ 07. SEPARATORS ═══ */}
          <Section id="separators" title="SEPARATORS & DIVIDERS">
            <DSCard>
              <div className="space-y-6">
                <div>
                  <SectionLabel>HORIZONTAL — GRADIENT FADE</SectionLabel>
                  <div className="h-px" style={{ background: isDark ? "linear-gradient(90deg, transparent, rgba(255,255,255,0.06) 20%, rgba(255,255,255,0.06) 80%, transparent)" : "linear-gradient(90deg, transparent, rgba(0,0,0,0.06) 20%, rgba(0,0,0,0.06) 80%, transparent)" }} />
                </div>
                <div>
                  <SectionLabel>VERTICAL — PANEL DIVIDER</SectionLabel>
                  <div className="flex items-stretch h-20 gap-6">
                    <div className="flex-1 rounded-lg p-3" style={{ background: t.surface }}><span style={{ ...TY.body, fontSize: "10px", color: t.textSecondary }}>Main panel</span></div>
                    <div className="w-px self-stretch" style={{ background: `linear-gradient(to bottom, transparent, ${t.borderSubtle}, transparent)` }} />
                    <div className="w-32 rounded-lg p-3" style={{ background: t.surface }}><span style={{ ...TY.body, fontSize: "10px", color: t.textSecondary }}>Side panel</span></div>
                  </div>
                </div>
                <div>
                  <SectionLabel>SETTINGS SEPARATOR (COMPONENT)</SectionLabel>
                  <Separator />
                </div>
              </div>
              <div className="mt-4 p-3 rounded-xl" style={{ background: t.errorBg, border: `1px solid ${t.errorBorder}` }}>
                <span style={{ ...TY.body, fontSize: "10px", color: t.errorText }}>Never use one-sided borders (border-t, border-l). Always gradient separators that fade at both ends.</span>
              </div>
            </DSCard>
          </Section>

          {/* ═══ 08. BUTTONS ═══ */}
          <Section id="buttons" title="BUTTONS">
            <DSCard>
              <SectionLabel>VARIANTS</SectionLabel>
              <div className="flex flex-wrap gap-4 mb-6">
                <DSButton label="Primary" variant="primary" />
                <DSButton label="Secondary" variant="secondary" />
                <DSButton label="Ghost" variant="ghost" />
                <DSButton label="Destructive" variant="destructive" />
                <DSButton label="Outline" variant="outline" />
              </div>
              <Separator />
              <div className="mt-5"><SectionLabel>PRIMARY STATES</SectionLabel>
                <div className="flex flex-wrap gap-4">{(["default", "hover", "active", "disabled"] as const).map(s => <DSButton key={s} label={s} variant="primary" state={s} />)}</div>
              </div>
              <Separator />
              <div className="mt-5"><SectionLabel>DESTRUCTIVE STATES</SectionLabel>
                <div className="flex flex-wrap gap-4">{(["default", "hover", "active", "disabled"] as const).map(s => <DSButton key={s} label={s} variant="destructive" state={s} />)}</div>
              </div>
              <Separator />
              <div className="mt-5"><SectionLabel>SIZES</SectionLabel>
                <div className="flex flex-wrap items-end gap-4">
                  <DSButton label="Small" variant="primary" size="sm" />
                  <DSButton label="Medium" variant="primary" size="md" />
                  <DSButton label="Large" variant="primary" size="lg" />
                </div>
              </div>
              <Separator />
              <div className="mt-5"><SectionLabel>WITH ICONS</SectionLabel>
                <div className="flex flex-wrap gap-4">
                  <DSButton label="Add Driver" variant="primary" icon={<Plus size={13} />} />
                  <DSButton label="Search" variant="secondary" icon={<Search size={13} />} />
                  <DSButton label="Copy Link" variant="ghost" icon={<Copy size={13} />} />
                  <DSButton label="Remove" variant="destructive" icon={<X size={13} />} />
                  <DSButton label="Download" variant="outline" icon={<Download size={13} />} />
                </div>
              </div>
              <div className="mt-5">
                <SectionLabel>PROPS</SectionLabel>
                <PropTable rows={[
                  ["variant", "'primary' | 'secondary' | ...", "'primary'"],
                  ["state", "'default' | 'hover' | ...", "'default'"],
                  ["size", "'sm' | 'md' | 'lg'", "'md'"],
                  ["icon", "ReactNode", "undefined"],
                  ["disabled", "boolean", "false"],
                ]} />
              </div>
              <div className="mt-4 p-3 rounded-xl" style={{ background: t.greenBg, border: `1px solid ${t.greenBorder}` }}>
                <span style={{ ...TY.body, fontSize: "10px", color: t.greenText }}>Green as scalpel — only CTAs, active states, status indicators, EV badges.</span>
              </div>
            </DSCard>
          </Section>

          {/* ═══ 09. INPUTS ═══ */}
          <Section id="inputs" title="INPUTS">
            <DSCard>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div><SectionLabel>TEXT INPUT — DEFAULT</SectionLabel><TextInput value={inputVal} onChange={setInputVal} placeholder="Enter location..." /></div>
                <div><SectionLabel>TEXT INPUT — DISABLED</SectionLabel><TextInput value="Cannot edit" onChange={() => {}} disabled /></div>
                <div><SectionLabel>SEARCH INPUT (ICON + INPUT COMBO)</SectionLabel>
                  <div className="flex items-center gap-2 px-3 py-2 rounded-xl" style={{ background: isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)", border: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}` }}>
                    <Search size={12} style={{ color: t.textFaint }} />
                    <input value="" readOnly placeholder="Search drivers, vehicles..." className="flex-1 bg-transparent outline-none" style={{ ...TY.bodyR, fontSize: "12px", color: t.text, lineHeight: "1.4" }} />
                  </div>
                </div>
                <div><SectionLabel>INPUT — ERROR STATE</SectionLabel>
                  <div>
                    <input className="w-full px-3 py-2 rounded-xl outline-none" style={{ ...TY.bodyR, fontSize: "12px", color: t.text, background: isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)", border: `1px solid ${STATUS.error}60`, boxShadow: `0 0 0 2px ${STATUS.error}18`, lineHeight: "1.4" }} value="invalid@" readOnly />
                    <span style={{ ...TY.bodyR, fontSize: "10px", color: STATUS.error, display: "block", marginTop: 4 }}>Please enter a valid email address.</span>
                  </div>
                </div>
                <div className="md:col-span-2"><SectionLabel>TEXTAREA</SectionLabel>
                  <TextArea value="Additional notes for the booking concierge." onChange={() => {}} rows={3} />
                </div>
              </div>
              <div className="mt-5"><SectionLabel>PROPS</SectionLabel>
                <PropTable rows={[["value", "string", "''"], ["onChange", "(v: string) => void", "—"], ["placeholder", "string", "undefined"], ["disabled", "boolean", "false"], ["type", "string", "'text'"]]} />
              </div>
              <span style={{ ...TY.bodyR, fontSize: "10px", color: t.textFaint, display: "block", marginTop: 8 }}>Focus: green ring ({BRAND.green}60 border + {BRAND.green}18 shadow). Radius: 12px. Background: surface-subtle.</span>
            </DSCard>
          </Section>

          {/* ═══ 10. TOGGLES & SELECTS ═══ */}
          <Section id="toggles" title="TOGGLES & SELECTS">
            <DSCard>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div><SectionLabel>TOGGLE</SectionLabel>
                  <div className="flex items-center gap-8">
                    {([
                      { label: "On", checked: toggleVal, fn: setToggleVal, dis: false },
                      { label: "Off", checked: false, fn: () => {}, dis: false },
                      { label: "Disabled On", checked: true, fn: () => {}, dis: true },
                      { label: "Disabled Off", checked: false, fn: () => {}, dis: true },
                    ] as const).map((item, i) => (
                      <div key={i} className="flex flex-col items-center gap-1.5">
                        <Toggle checked={item.checked} onChange={item.fn as any} disabled={item.dis} />
                        <span style={{ ...TY.bodyR, fontSize: "9px", color: t.textFaint }}>{item.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div><SectionLabel>SELECT PILL (SEGMENTED)</SectionLabel>
                  <SelectPill options={[{ value: "daily", label: "Daily" }, { value: "weekly", label: "Weekly" }, { value: "monthly", label: "Monthly" }]} value={selectVal} onChange={setSelectVal} />
                </div>
                <div className="md:col-span-2"><SectionLabel>FILTER PILLS (TAB-STYLE)</SectionLabel>
                  <div className="flex gap-1.5">
                    {[
                      { label: "All", count: 32, active: true },
                      { label: "Active", count: 18, active: false },
                      { label: "Pending", count: 6, active: false },
                      { label: "Inactive", count: 8, active: false },
                    ].map(f => (
                      <span key={f.label} className="px-2.5 py-1.5 rounded-lg cursor-pointer" style={{
                        background: f.active ? (isDark ? `${BRAND.green}08` : `${BRAND.green}04`) : "transparent",
                        border: `1px solid ${f.active ? `${BRAND.green}14` : "transparent"}`,
                        ...TY.body, fontSize: "10px", color: f.active ? BRAND.green : t.textMuted,
                      }}>
                        {f.label} <span style={{ ...TY.bodyR, fontSize: "9px", color: f.active ? BRAND.green : t.textFaint }}>{f.count}</span>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </DSCard>
          </Section>

          {/* ═══ 11. STATUS SYSTEM ═══ */}
          <Section id="status" title="STATUS SYSTEM">
            <DSCard>
              <div className="space-y-5">
                <div><SectionLabel>DRIVER STATUS</SectionLabel>
                  <div className="flex flex-wrap gap-3">
                    <StatusBadge label="On Trip" color={BRAND.green} bg={t.greenBg} border={t.greenBorder} />
                    <StatusBadge label="Online" color={STATUS.info} bg={t.infoBg} border={t.infoBorder} />
                    <StatusBadge label="Offline" color="#737373" bg={isDark ? "rgba(115,115,115,0.08)" : "rgba(115,115,115,0.06)"} border={isDark ? "rgba(115,115,115,0.15)" : "rgba(115,115,115,0.12)"} />
                    <StatusBadge label="Suspended" color={STATUS.error} bg={t.errorBg} border={t.errorBorder} />
                  </div></div><Separator />
                <div><SectionLabel>RIDE STATUS</SectionLabel>
                  <div className="flex flex-wrap gap-3">
                    <StatusBadge label="Requested" color={STATUS.warning} bg={t.warningBg} border={t.warningBorder} />
                    <StatusBadge label="Assigned" color={STATUS.info} bg={t.infoBg} border={t.infoBorder} />
                    <StatusBadge label="In Progress" color={BRAND.green} bg={t.greenBg} border={t.greenBorder} />
                    <StatusBadge label="Completed" color={t.textMuted} bg={isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)"} border={t.borderSubtle} />
                    <StatusBadge label="Cancelled" color={STATUS.error} bg={t.errorBg} border={t.errorBorder} />
                    <StatusBadge label="Reassigning" color={STATUS.warning} bg={t.warningBg} border={t.warningBorder} />
                  </div></div><Separator />
                <div><SectionLabel>VEHICLE STATUS</SectionLabel>
                  <div className="flex flex-wrap gap-3">
                    <StatusBadge label="Active" color={BRAND.green} bg={t.greenBg} border={t.greenBorder} />
                    <StatusBadge label="Pending" color={STATUS.warning} bg={t.warningBg} border={t.warningBorder} />
                    <StatusBadge label="Maintenance" color={STATUS.info} bg={t.infoBg} border={t.infoBorder} />
                    <StatusBadge label="Inactive" color={t.textMuted} bg={isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)"} border={t.borderSubtle} />
                  </div></div><Separator />
                <div><SectionLabel>TYPE BADGES</SectionLabel>
                  <div className="flex flex-wrap gap-3">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded" style={{ background: `${BRAND.green}10`, ...TY.body, fontSize: "10px", color: BRAND.green }}><Zap size={10} /> EV</span>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded" style={{ background: isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)", ...TY.body, fontSize: "10px", color: t.textSecondary }}>Gas</span>
                  </div></div>
              </div>
            </DSCard>
          </Section>

          {/* ═══ 12. CARDS ═══ */}
          <Section id="cards" title="CARDS & SURFACES">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <DSCard><SectionLabel>STANDARD CARD</SectionLabel>
                <span style={{ ...TY.sub, fontSize: "13px", color: t.text }}>Total Earnings</span>
                <span style={{ ...TY.h, fontSize: "24px", color: t.text, display: "block", marginTop: 2 }}>₦2.4M</span>
                <div className="flex items-center gap-1 mt-2"><ArrowUp size={10} style={{ color: BRAND.green }} /><span style={{ ...TY.body, fontSize: "10px", color: BRAND.green }}>+12%</span><span style={{ ...TY.bodyR, fontSize: "10px", color: t.textFaint }}>from last week</span></div>
              </DSCard>
              <div className="rounded-2xl p-5" style={{ background: isDark ? `linear-gradient(135deg, ${BRAND.green}08, transparent)` : `linear-gradient(135deg, ${BRAND.green}04, transparent)`, border: `1px solid ${t.greenBorder}` }}>
                <SectionLabel>ACCENT CARD</SectionLabel>
                <span style={{ ...TY.sub, fontSize: "13px", color: t.greenText }}>Next Payout</span>
                <span style={{ ...TY.h, fontSize: "24px", color: t.text, display: "block", marginTop: 2 }}>₦680K</span>
                <span style={{ ...TY.bodyR, fontSize: "10px", color: t.textMuted, display: "block", marginTop: 4 }}>Friday, 21 Mar</span>
              </div>
              <div className="rounded-2xl p-5" style={{ background: t.glass, backdropFilter: t.glassBlur, border: `1px solid ${t.borderSubtle}`, boxShadow: t.shadow }}>
                <SectionLabel>GLASS CARD</SectionLabel>
                <span style={{ ...TY.sub, fontSize: "13px", color: t.text }}>Active Drivers</span>
                <span style={{ ...TY.h, fontSize: "24px", color: t.text, display: "block", marginTop: 2 }}>24</span>
                <span style={{ ...TY.bodyR, fontSize: "10px", color: t.textMuted, display: "block", marginTop: 4 }}>8 on trip · 16 idle</span>
              </div>
            </div>
            <DSCard className="mt-4">
              <SectionLabel>FIELD ROW (SETTINGS PATTERN)</SectionLabel>
              <FieldRow label="Company Name" sublabel="Legal entity"><TextInput value="JET Mobility Ltd" onChange={() => {}} /></FieldRow>
              <Separator />
              <FieldRow label="Notifications"><Toggle checked={true} onChange={() => {}} /></FieldRow>
              <Separator />
              <FieldRow label="Payout Frequency"><SelectPill options={[{ value: "weekly", label: "Weekly" }, { value: "biweekly", label: "Bi-weekly" }]} value="weekly" onChange={() => {}} /></FieldRow>
            </DSCard>
          </Section>

          {/* ═══ 13. BADGES ═══ */}
          <Section id="badges" title="BADGES & PILLS">
            <DSCard>
              <SectionLabel>STATUS DOTS (WITH OPTIONAL PULSE)</SectionLabel>
              <div className="flex items-center gap-6 mb-5">
                {([{ c: BRAND.green, l: "Active", p: true }, { c: STATUS.info, l: "Online", p: true }, { c: STATUS.warning, l: "Warning", p: false }, { c: STATUS.error, l: "Error", p: false }, { c: "#737373", l: "Offline", p: false }] as const).map(d => (
                  <div key={d.l} className="flex items-center gap-1.5"><StatusDot color={d.c} size={6} pulse={d.p} /><span style={{ ...TY.body, fontSize: "10px", color: t.textSecondary }}>{d.l}</span></div>
                ))}
              </div>
              <Separator />
              <div className="mt-5"><SectionLabel>DEMAND LEVELS</SectionLabel>
                <div className="flex flex-wrap gap-3">
                  {([{ l: "Surge", c: STATUS.warning }, { l: "High", c: BRAND.green }, { l: "Normal", c: t.textMuted }, { l: "Low", c: t.textFaint }] as const).map(d => (
                    <span key={d.l} className="px-2.5 py-1 rounded-lg" style={{ background: `${d.c}12`, border: `1px solid ${d.c}20`, ...TY.body, fontSize: "10px", color: d.c }}>{d.l}</span>
                  ))}
                </div></div>
              <Separator />
              <div className="mt-5"><SectionLabel>DRIVER AVATAR</SectionLabel>
                <div className="flex items-center gap-4">
                  {[{ name: "Chidi Okafor", s: 40 }, { name: "Amaka Eze", s: 32 }, { name: "Emeka N.", s: 24 }].map(a => (
                    <div key={a.name} className="flex flex-col items-center gap-1.5">
                      <div className="rounded-full flex items-center justify-center" style={{ width: a.s, height: a.s, background: `${BRAND.green}15`, border: `1.5px solid ${BRAND.green}30` }}>
                        <span style={{ ...TY.body, fontSize: a.s * 0.38, color: BRAND.green }}>{a.name.split(" ").map(n => n[0]).join("")}</span>
                      </div>
                      <span style={{ ...TY.bodyR, fontSize: "9px", color: t.textFaint }}>{a.s}px</span>
                    </div>
                  ))}
                </div></div>
            </DSCard>
          </Section>

          {/* ═══ 14. CHARTS & DATA VIZ ═══ */}
          <Section id="charts" title="CHARTS & DATA VISUALIZATION">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <DSCard>
                <SectionLabel>AREA CHART (SVG — CUSTOM)</SectionLabel>
                <span style={{ ...TY.bodyR, fontSize: "10px", color: t.textFaint, display: "block", marginBottom: 8 }}>Gradient fill + hover dot + dashed grid. Used in earnings.</span>
                <MiniAreaChart data={CHART_DATA} width={460} height={160} />
              </DSCard>
              <DSCard>
                <SectionLabel>SPARKLINE (INLINE SVG)</SectionLabel>
                <span style={{ ...TY.bodyR, fontSize: "10px", color: t.textFaint, display: "block", marginBottom: 12 }}>Micro chart used in driver cards & tables.</span>
                <div className="space-y-4">
                  {([
                    { label: "Trending up", data: [3, 4, 2, 6, 5, 8, 7, 9, 10, 12], color: BRAND.green },
                    { label: "Volatile", data: [8, 3, 7, 2, 9, 4, 6, 3, 8, 5], color: STATUS.warning },
                    { label: "Declining", data: [12, 10, 9, 7, 6, 5, 4, 3, 2, 1], color: STATUS.error },
                  ] as const).map(s => (
                    <div key={s.label} className="flex items-center gap-3">
                      <Sparkline data={s.data} color={s.color} width={64} height={20} />
                      <span style={{ ...TY.body, fontSize: "10px", color: t.textSecondary }}>{s.label}</span>
                    </div>
                  ))}
                </div>
              </DSCard>
              <DSCard>
                <SectionLabel>PROGRESS BAR</SectionLabel>
                <div className="space-y-4">
                  {[
                    { label: "Credit usage (safe)", value: 45, max: 100, color: BRAND.green },
                    { label: "Credit usage (warning)", value: 82, max: 100, color: STATUS.warning },
                    { label: "Credit usage (critical)", value: 95, max: 100, color: STATUS.error },
                  ].map(p => (
                    <div key={p.label}>
                      <div className="flex justify-between mb-1"><span style={{ ...TY.body, fontSize: "10px", color: t.textSecondary }}>{p.label}</span><span style={{ ...TY.body, fontSize: "10px", color: p.color, fontFamily: "monospace" }}>{p.value}%</span></div>
                      <ProgressBar value={p.value} max={p.max} color={p.color} />
                    </div>
                  ))}
                </div>
              </DSCard>
              <DSCard>
                <SectionLabel>BATTERY BAR (EV VEHICLES)</SectionLabel>
                <div className="space-y-3">
                  {[85, 45, 15].map(lvl => (
                    <div key={lvl} className="flex items-center gap-3">
                      <BatteryBar level={lvl} />
                      <span style={{ ...TY.bodyR, fontSize: "10px", color: t.textFaint }}>{lvl > 50 ? "Healthy" : lvl > 20 ? "Low" : "Critical"}</span>
                    </div>
                  ))}
                </div>
              </DSCard>
            </div>
          </Section>

          {/* ═══ 15. MODALS ═══ */}
          <Section id="modals" title="MODALS & SHEETS">
            <DSCard>
              <SectionLabel>MODAL VARIANTS (STATIC PREVIEWS + INTERACTIVE DEMOS)</SectionLabel>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                {/* Confirm Destructive */}
                <div className="rounded-2xl p-5" style={{ background: isDark ? "rgba(22,22,24,0.97)" : "#fff", border: `1px solid ${t.borderSubtle}`, boxShadow: t.shadowLg }}>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: `${STATUS.error}12` }}><AlertTriangle size={15} style={{ color: STATUS.error }} /></div>
                    <div><span style={{ ...TY.sub, fontSize: "13px", color: t.text, display: "block" }}>Suspend Driver?</span><span style={{ ...TY.bodyR, fontSize: "10px", color: t.textFaint }}>Confirm · Destructive</span></div>
                  </div>
                  <span style={{ ...TY.bodyR, fontSize: "12px", color: t.textSecondary, display: "block", marginBottom: 16 }}>This will immediately revoke access. The driver won't be able to accept new rides.</span>
                  <div className="flex gap-3">
                    <div className="flex-1 py-2.5 rounded-xl text-center cursor-pointer" style={{ background: t.surface, border: `1px solid ${t.borderSubtle}`, ...TY.body, fontSize: "12px", color: t.textSecondary }}>Cancel</div>
                    <div className="flex-1 py-2.5 rounded-xl text-center cursor-pointer" style={{ background: STATUS.error, ...TY.body, fontSize: "12px", color: "#fff" }}>Suspend</div>
                  </div>
                </div>

                {/* Confirm Success */}
                <div className="rounded-2xl p-5" style={{ background: isDark ? "rgba(22,22,24,0.97)" : "#fff", border: `1px solid ${t.borderSubtle}`, boxShadow: t.shadowLg }}>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: `${BRAND.green}12` }}><CheckCircle size={15} style={{ color: BRAND.green }} /></div>
                    <div><span style={{ ...TY.sub, fontSize: "13px", color: t.text, display: "block" }}>Reassign Vehicle?</span><span style={{ ...TY.bodyR, fontSize: "10px", color: t.textFaint }}>Confirm · Success</span></div>
                  </div>
                  <span style={{ ...TY.bodyR, fontSize: "12px", color: t.textSecondary, display: "block", marginBottom: 16 }}>The new driver will be notified and can start accepting rides immediately.</span>
                  <div className="flex gap-3">
                    <div className="flex-1 py-2.5 rounded-xl text-center cursor-pointer" style={{ background: t.surface, border: `1px solid ${t.borderSubtle}`, ...TY.body, fontSize: "12px", color: t.textSecondary }}>Cancel</div>
                    <div className="flex-1 py-2.5 rounded-xl text-center cursor-pointer" style={{ background: BRAND.green, ...TY.body, fontSize: "12px", color: "#fff" }}>Confirm</div>
                  </div>
                </div>

                {/* Form Sheet (Add Vehicle) */}
                <div className="rounded-2xl overflow-hidden" style={{ background: isDark ? "#141416" : "#fff", border: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}`, boxShadow: t.shadowLg }}>
                  <div className="flex items-center justify-between px-5 py-3" style={{ borderBottom: `1px solid ${t.borderSubtle}` }}>
                    <div className="flex items-center gap-2"><Car size={14} style={{ color: t.textMuted }} /><span style={{ ...TY.sub, fontSize: "13px", color: t.text }}>Add Vehicle</span></div>
                    <div className="w-6 h-6 rounded-md flex items-center justify-center" style={{ background: t.surface }}><X size={12} style={{ color: t.textMuted }} /></div>
                  </div>
                  <div className="p-5 space-y-3">
                    <div><span style={{ ...TY.body, fontSize: "10px", color: t.textSecondary, display: "block", marginBottom: 4 }}>Make & Model</span><TextInput value="Toyota Camry 2024" onChange={() => {}} /></div>
                    <div><span style={{ ...TY.body, fontSize: "10px", color: t.textSecondary, display: "block", marginBottom: 4 }}>Plate Number</span><TextInput value="LND-234-AB" onChange={() => {}} /></div>
                    <button className="w-full py-2.5 rounded-xl text-center" style={{ background: BRAND.green, ...TY.body, fontSize: "12px", color: "#fff" }}>Add Vehicle</button>
                  </div>
                </div>

                {/* Invite Sheet */}
                <div className="rounded-2xl overflow-hidden" style={{ background: isDark ? "#141416" : "#fff", border: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}`, boxShadow: t.shadowLg }}>
                  <div className="flex items-center justify-between px-5 py-3" style={{ borderBottom: `1px solid ${t.borderSubtle}` }}>
                    <div className="flex items-center gap-2"><UserPlus size={14} style={{ color: t.textMuted }} /><span style={{ ...TY.sub, fontSize: "13px", color: t.text }}>Invite Driver</span></div>
                    <div className="w-6 h-6 rounded-md flex items-center justify-center" style={{ background: t.surface }}><X size={12} style={{ color: t.textMuted }} /></div>
                  </div>
                  <div className="p-5 space-y-3">
                    <div><span style={{ ...TY.body, fontSize: "10px", color: t.textSecondary, display: "block", marginBottom: 4 }}>Full Name</span><TextInput value="Chidi Okafor" onChange={() => {}} /></div>
                    <div><span style={{ ...TY.body, fontSize: "10px", color: t.textSecondary, display: "block", marginBottom: 4 }}>Email or Phone</span><TextInput value="chidi@jet.ng" onChange={() => {}} /></div>
                    <button className="w-full py-2.5 rounded-xl text-center flex items-center justify-center gap-1.5" style={{ background: BRAND.green, ...TY.body, fontSize: "12px", color: "#fff" }}><Mail size={13} /> Send Invite</button>
                  </div>
                </div>
              </div>
              <SectionLabel>ANATOMY</SectionLabel>
              <PropTable rows={[
                ["backdrop", "rgba(0,0,0,0.6|0.3)", "dark | light"],
                ["surface", "#141416 | #FFFFFF", "Opaque, not glass"],
                ["border", "borderSubtle", "Subtle edge"],
                ["shadow", "0 16px 48px ...", "Heavy elevation"],
                ["animation", "scale 0.96→1, y 40→0", "200ms ease-out"],
                ["close", "Escape key + backdrop click", "Always"],
              ]} />
            </DSCard>
          </Section>

          {/* ═══ 16. DRAWERS ═══ */}
          <Section id="drawers" title="DRAWERS">
            <DSCard>
              <SectionLabel>DETAIL DRAWER (DESKTOP: OVERLAY RIGHT · MOBILE: FULL SHEET)</SectionLabel>
              <div className="flex gap-4 items-stretch h-64 relative rounded-xl overflow-hidden" style={{ border: `1px solid ${t.borderSubtle}`, background: t.bg }}>
                {/* Fake content */}
                <div className="flex-1 p-4 space-y-2">
                  {[1, 2, 3, 4, 5].map(i => (
                    <div key={i} className="flex items-center gap-3 px-3 py-2 rounded-lg" style={{ background: t.surface }}>
                      <div className="w-6 h-6 rounded-full" style={{ background: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)" }} />
                      <div className="flex-1"><div className="h-2 rounded" style={{ width: `${40 + i * 8}%`, background: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)" }} /></div>
                    </div>
                  ))}
                </div>
                {/* Drawer preview */}
                <div className="w-[200px] shrink-0 flex flex-col" style={{
                  background: isDark ? "rgba(17,17,19,0.98)" : "rgba(255,255,255,0.98)",
                  borderLeft: `1px solid ${t.borderSubtle}`,
                  boxShadow: isDark ? "-12px 0 40px rgba(0,0,0,0.35)" : "-12px 0 40px rgba(0,0,0,0.08)",
                }}>
                  <div className="px-3 py-2 flex items-center justify-between" style={{ borderBottom: `1px solid ${t.borderSubtle}` }}>
                    <span style={{ ...TY.body, fontSize: "11px", color: t.text }}>Driver Details</span>
                    <X size={10} style={{ color: t.textFaint }} />
                  </div>
                  <div className="flex-1 p-3 space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="rounded-full flex items-center justify-center" style={{ width: 28, height: 28, background: `${BRAND.green}15`, border: `1.5px solid ${BRAND.green}30` }}><span style={{ ...TY.body, fontSize: 10, color: BRAND.green }}>CO</span></div>
                      <div><span style={{ ...TY.body, fontSize: "10px", color: t.text, display: "block" }}>Chidi Okafor</span><span style={{ ...TY.bodyR, fontSize: "9px", color: t.textFaint }}>Online · 4.8★</span></div>
                    </div>
                    <Separator />
                    {[{ l: "Rides today", v: "12" }, { l: "Earnings", v: "₦45K" }, { l: "Vehicle", v: "Camry" }].map(r => (
                      <div key={r.l} className="flex justify-between py-0.5">
                        <span style={{ ...TY.bodyR, fontSize: "9px", color: t.textMuted }}>{r.l}</span>
                        <span style={{ ...TY.body, fontSize: "9px", color: t.text }}>{r.v}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="mt-4"><SectionLabel>PROPS</SectionLabel>
                <PropTable rows={[
                  ["open", "boolean", "false"],
                  ["onClose", "() => void", "—"],
                  ["width", "number", "380"],
                  ["ariaLabel", "string", "'Detail panel'"],
                ]} />
              </div>
              <div className="mt-3"><SectionLabel>BEHAVIOR</SectionLabel>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-xl" style={{ background: t.surface }}>
                    <span style={{ ...TY.body, fontSize: "10px", color: t.text, display: "block" }}>Desktop</span>
                    <span style={{ ...TY.bodyR, fontSize: "9px", color: t.textFaint }}>Absolute overlay, right side. No reflow. 380px wide.</span>
                  </div>
                  <div className="p-3 rounded-xl" style={{ background: t.surface }}>
                    <span style={{ ...TY.body, fontSize: "10px", color: t.text, display: "block" }}>Mobile</span>
                    <span style={{ ...TY.bodyR, fontSize: "9px", color: t.textFaint }}>Fixed full-width sheet. Backdrop click closes. Body scroll locked.</span>
                  </div>
                </div></div>
            </DSCard>
          </Section>

          {/* ═══ 17. TOASTS ═══ */}
          <Section id="toasts" title="TOASTS">
            <DSCard>
              <SectionLabel>TOAST VARIANTS</SectionLabel>
              <div className="space-y-3 mb-4">
                {([
                  { msg: "Driver assigned successfully", type: "success" as const, color: BRAND.green },
                  { msg: "Payout scheduled for Friday", type: "info" as const, color: STATUS.info },
                  { msg: "Failed to send notification", type: "error" as const, color: STATUS.error },
                ] as const).map((toast) => (
                  <div key={toast.type} className="flex items-center gap-2.5 px-4 py-3 rounded-xl" style={{
                    background: isDark ? "rgba(22,22,24,0.95)" : "rgba(255,255,255,0.97)",
                    border: `1px solid ${isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)"}`,
                    boxShadow: isDark ? "0 8px 32px rgba(0,0,0,0.5)" : "0 8px 32px rgba(0,0,0,0.12)",
                  }}>
                    <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: toast.color }} />
                    <span style={{ ...TY.body, fontSize: "12px", color: t.text, lineHeight: "1.4", flex: 1 }}>{toast.msg}</span>
                    <span className="px-2 py-0.5 rounded" style={{ ...TY.label, fontSize: "8px", color: toast.color, background: `${toast.color}10` }}>{toast.type.toUpperCase()}</span>
                  </div>
                ))}
              </div>
              <SectionLabel>PROPS</SectionLabel>
              <PropTable rows={[
                ["message", "string", "—"],
                ["type", "'success' | 'info' | 'error'", "'success'"],
                ["onDismiss", "() => void", "—"],
                ["duration", "number (ms)", "3000"],
              ]} />
              <span style={{ ...TY.bodyR, fontSize: "10px", color: t.textFaint, display: "block", marginTop: 8 }}>Auto-dismiss at 3s · Glass blur · Status dot indicator · Fixed bottom-center · AnimatePresence wrapper required</span>
            </DSCard>
          </Section>

          {/* ═══ 18. ALERTS & BANNERS ═══ */}
          <Section id="alerts" title="ALERTS & BANNERS">
            <DSCard>
              <SectionLabel>INLINE ALERTS</SectionLabel>
              <div className="space-y-3">
                {([
                  { type: "success", icon: CheckCircle, color: BRAND.green, bg: t.greenBg, border: t.greenBorder, text: t.greenText, msg: "Vehicle registration approved successfully." },
                  { type: "info", icon: Info, color: STATUS.info, bg: t.infoBg, border: t.infoBorder, text: t.infoText, msg: "Your next payout is scheduled for Friday, March 21." },
                  { type: "warning", icon: AlertTriangle, color: STATUS.warning, bg: t.warningBg, border: t.warningBorder, text: t.warningText, msg: "Credit limit approaching 80%. Consider making a payment." },
                  { type: "error", icon: AlertCircle, color: STATUS.error, bg: t.errorBg, border: t.errorBorder, text: t.errorText, msg: "Driver verification failed. Please resubmit documents." },
                ] as const).map(a => {
                  const Icon = a.icon;
                  return (
                    <div key={a.type} className="flex items-start gap-3 p-3.5 rounded-xl" style={{ background: a.bg, border: `1px solid ${a.border}` }}>
                      <div className="w-6 h-6 rounded-lg flex items-center justify-center shrink-0 mt-0.5" style={{ background: `${a.color}15` }}><Icon size={13} style={{ color: a.color }} /></div>
                      <div className="flex-1">
                        <span style={{ ...TY.body, fontSize: "11px", color: a.text, display: "block", marginBottom: 2 }}>{a.type.charAt(0).toUpperCase() + a.type.slice(1)}</span>
                        <span style={{ ...TY.bodyR, fontSize: "11px", color: a.text, opacity: 0.85 }}>{a.msg}</span>
                      </div>
                      <X size={12} style={{ color: a.text, opacity: 0.5, cursor: "pointer", marginTop: 2 }} />
                    </div>
                  );
                })}
              </div>
            </DSCard>
          </Section>

          {/* ═══ 19. NOTIFICATIONS ═══ */}
          <Section id="notifications" title="NOTIFICATION PANEL">
            <DSCard>
              <SectionLabel>NOTIFICATION LIST (LINEAR/VERCEL DROPDOWN STYLE)</SectionLabel>
              <div className="rounded-xl overflow-hidden" style={{ border: `1px solid ${t.borderSubtle}`, maxWidth: 340 }}>
                <div className="flex items-center justify-between px-4 py-2.5" style={{ borderBottom: `1px solid ${t.borderSubtle}` }}>
                  <span style={{ ...TY.sub, fontSize: "12px", color: t.text }}>Notifications</span>
                  <span style={{ ...TY.bodyR, fontSize: "10px", color: BRAND.green, cursor: "pointer" }}>Mark all read</span>
                </div>
                {[
                  { icon: Wallet, color: BRAND.green, title: "Payout processed", desc: "₦680,000 sent to GTBank ****4521", time: "2m ago", unread: true },
                  { icon: Users, color: STATUS.info, title: "Driver went offline", desc: "Emeka Nwankwo hasn't been online in 24h", time: "1h ago", unread: true },
                  { icon: Car, color: STATUS.warning, title: "Maintenance due", desc: "Toyota Camry (LND-234) — 15,000km service", time: "3h ago", unread: false },
                  { icon: AlertTriangle, color: STATUS.error, title: "Document expired", desc: "Amaka Eze's insurance expires in 3 days", time: "5h ago", unread: false },
                ].map((n, i) => {
                  const NIcon = n.icon;
                  return (
                    <div key={i} className="flex items-start gap-3 px-4 py-3 cursor-pointer" style={{
                      background: n.unread ? (isDark ? "rgba(29,185,84,0.02)" : "rgba(29,185,84,0.015)") : "transparent",
                      borderBottom: i < 3 ? `1px solid ${isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.03)"}` : "none",
                    }}>
                      <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5" style={{ background: `${n.color}10` }}><NIcon size={12} style={{ color: n.color }} /></div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="truncate" style={{ ...TY.body, fontSize: "11px", color: t.text }}>{n.title}</span>
                          {n.unread && <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: BRAND.green }} />}
                        </div>
                        <span className="truncate block" style={{ ...TY.bodyR, fontSize: "10px", color: t.textMuted }}>{n.desc}</span>
                      </div>
                      <span style={{ ...TY.bodyR, fontSize: "9px", color: t.textFaint, shrink: 0 } as any}>{n.time}</span>
                    </div>
                  );
                })}
              </div>
            </DSCard>
          </Section>

          {/* ═══ 20. SKELETONS ═══ */}
          <Section id="skeletons" title="SKELETON LOADING STATES">
            <DSCard>
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <SectionLabel>VARIANT</SectionLabel>
                {(["dashboard", "table", "earnings", "billing", "form", "settings"] as const).map(v => (
                  <button key={v} onClick={() => setSkelVar(v)} className="px-3 py-1.5 rounded-lg cursor-pointer" style={{
                    background: skelVar === v ? (isDark ? "rgba(255,255,255,0.06)" : "#fff") : "transparent",
                    border: `1px solid ${skelVar === v ? t.borderStrong : "transparent"}`,
                    boxShadow: skelVar === v && !isDark ? "0 1px 3px rgba(0,0,0,0.06)" : "none",
                    ...TY.body, fontSize: "10px", color: skelVar === v ? t.text : t.textMuted,
                  }}>{v}</button>
                ))}
              </div>
              <div className="rounded-xl overflow-hidden" style={{ height: 320, border: `1px solid ${t.borderSubtle}`, background: t.bg }}>
                {skelVar === "dashboard" && <DashboardSkeleton />}
                {skelVar === "table" && <TableSkeleton />}
                {skelVar === "earnings" && <EarningsSkeleton />}
                {skelVar === "billing" && <BillingSkeleton />}
                {skelVar === "form" && <FormSkeleton />}
                {skelVar === "settings" && <SettingsSkeleton />}
              </div>
              <span style={{ ...TY.bodyR, fontSize: "10px", color: t.textFaint, display: "block", marginTop: 8 }}>Rule: "Skeletons, not spinners" — Linear/Vercel. animate-pulse on muted rects matching real layout.</span>
            </DSCard>
          </Section>

          {/* ═══ 21. EMPTY & ERROR ═══ */}
          <Section id="states" title="EMPTY & ERROR STATES">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <DSCard>
                <SectionLabel>EMPTY STATE</SectionLabel>
                <div className="flex flex-col items-center justify-center py-8">
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4" style={{ background: t.surface, border: `1px solid ${t.borderSubtle}` }}><Users size={24} style={{ color: t.iconMuted }} /></div>
                  <span style={{ ...TY.sub, fontSize: "14px", color: t.text, display: "block", marginBottom: 4 }}>No drivers yet</span>
                  <span style={{ ...TY.bodyR, fontSize: "12px", color: t.textMuted, maxWidth: 240, textAlign: "center", display: "block", marginBottom: 16 }}>Invite drivers to start building your fleet.</span>
                  <button className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl cursor-pointer" style={{ background: BRAND.green, ...TY.body, fontSize: "12px", color: "#fff" }}><Plus size={13} /> Invite Driver</button>
                </div>
              </DSCard>
              <DSCard>
                <SectionLabel>ERROR STATE</SectionLabel>
                <div className="flex flex-col items-center justify-center py-8">
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4" style={{ background: t.errorBg, border: `1px solid ${t.errorBorder}` }}><AlertCircle size={24} style={{ color: STATUS.error }} /></div>
                  <span style={{ ...TY.sub, fontSize: "14px", color: t.text, display: "block", marginBottom: 4 }}>Something went wrong</span>
                  <span style={{ ...TY.bodyR, fontSize: "12px", color: t.textMuted, maxWidth: 240, textAlign: "center", display: "block", marginBottom: 16 }}>We couldn't load this content. Please try again.</span>
                  <button className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl cursor-pointer" style={{ background: t.surface, border: `1px solid ${t.borderSubtle}`, ...TY.body, fontSize: "12px", color: t.textSecondary }}>Try again</button>
                </div>
              </DSCard>
            </div>
          </Section>

          {/* ═══ 22. SAVE BAR ═══ */}
          <Section id="savebar" title="SAVE BAR">
            <DSCard>
              <SectionLabel>FLOATING UNSAVED CHANGES BAR</SectionLabel>
              <div className="flex items-center gap-3 px-5 py-3 rounded-2xl" style={{
                background: isDark ? "rgba(18,18,20,0.95)" : "rgba(255,255,255,0.97)",
                border: `1px solid ${isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)"}`,
                backdropFilter: "blur(20px)", boxShadow: t.shadowLg,
              }}>
                <span style={{ ...TY.body, fontSize: "12px", color: t.textMuted }}>Unsaved changes</span>
                <button className="px-3 py-1.5 rounded-lg" style={{ background: isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.03)", border: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}`, ...TY.body, fontSize: "11px", color: t.textMuted }}>Discard</button>
                <button className="px-4 py-1.5 rounded-lg flex items-center gap-1.5" style={{ background: BRAND.green, ...TY.body, fontSize: "11px", color: "#fff" }}><Download size={11} /> Save changes</button>
              </div>
              <div className="mt-4"><SectionLabel>PROPS</SectionLabel>
                <PropTable rows={[["dirty", "boolean", "false"], ["saving", "boolean", "false"], ["onSave", "() => void", "—"], ["onDiscard", "() => void", "—"]]} />
              </div>
              <span style={{ ...TY.bodyR, fontSize: "10px", color: t.textFaint, display: "block", marginTop: 8 }}>Fixed bottom, centered, z-40. Appears when form state diverges from saved state.</span>
            </DSCard>
          </Section>

          {/* ═══ 23. MOTION ═══ */}
          <Section id="motion" title="MOTION LANGUAGE">
            <DSCard>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <SectionLabel>EASING CURVE</SectionLabel>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-20 h-8 rounded-lg overflow-hidden relative" style={{ background: t.surface }}>
                      <motion.div className="absolute top-1 bottom-1 left-1 w-6 rounded-md" style={{ background: BRAND.green }}
                        animate={{ x: [0, 48, 0] }} transition={{ repeat: Infinity, duration: 2, ease: [0.16, 1, 0.3, 1] }} />
                    </div>
                    <span style={{ ...TY.body, fontSize: "10px", color: t.text, fontFamily: "monospace" }}>[0.16, 1, 0.3, 1]</span>
                  </div>
                  <span style={{ ...TY.bodyR, fontSize: "10px", color: t.textFaint }}>Entrances, drawers, modals, cards</span>
                </div>
                <div>
                  <SectionLabel>STAGGER PATTERN</SectionLabel>
                  <div className="space-y-1.5">
                    {[0, 1, 2, 3, 4].map(i => (
                      <motion.div key={i} className="h-6 rounded-lg" style={{ background: `${BRAND.green}${(15 + i * 8).toString(16)}`, width: `${60 + i * 10}%` }}
                        initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * STAGGER, duration: 0.3, ease: [0.16, 1, 0.3, 1] }} />
                    ))}
                  </div>
                  <span style={{ ...TY.body, fontSize: "10px", color: t.text, fontFamily: "monospace", display: "block", marginTop: 8 }}>STAGGER = 0.04 (40ms)</span>
                </div>
                <div>
                  <SectionLabel>DURATIONS</SectionLabel>
                  <div className="space-y-2">
                    {[{ l: "Toggle", v: "150ms" }, { l: "Toast enter", v: "250ms" }, { l: "Card reveal", v: "300–400ms" }, { l: "Drawer slide", v: "250ms" }, { l: "Modal scale", v: "200ms" }, { l: "Page transition", v: "200ms" }].map(d => (
                      <div key={d.l} className="flex items-center justify-between">
                        <span style={{ ...TY.body, fontSize: "10px", color: t.textSecondary }}>{d.l}</span>
                        <span style={{ ...TY.body, fontSize: "10px", color: t.text, fontFamily: "monospace" }}>{d.v}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </DSCard>
          </Section>

          {/* ═══ 24. ICONS ═══ */}
          <Section id="icons" title="ICON CATALOG (LUCIDE-REACT)">
            <DSCard>
              <span style={{ ...TY.bodyR, fontSize: "10px", color: t.textFaint, display: "block", marginBottom: 12 }}>Sizes: 12–14px inline/badges · 16–18px actions · 24–28px empty states</span>
              <div className="flex flex-wrap gap-3">
                {([
                  [LayoutDashboard, "Dashboard"], [Car, "Vehicles"], [Users, "Drivers"], [Wallet, "Earnings"],
                  [Settings, "Settings"], [Bell, "Notifications"], [Clock, "History"], [Star, "Rating"],
                  [Zap, "EV"], [Shield, "Security"], [MapPin, "Location"], [Search, "Search"],
                  [Plus, "Add"], [Copy, "Copy"], [AlertTriangle, "Warning"], [CheckCircle, "Success"],
                  [Info, "Info"], [XCircle, "Error"], [AlertCircle, "Alert"], [ArrowUp, "Up"],
                  [ArrowDown, "Down"], [ChevronRight, "Navigate"], [ChevronDown, "Expand"], [X, "Close"],
                  [Eye, "Show"], [EyeOff, "Hide"], [MoreHorizontal, "More"], [Filter, "Filter"],
                  [ArrowUpDown, "Sort"], [Download, "Download"], [Mail, "Mail"], [Phone, "Phone"],
                  [UserPlus, "Invite"], [Wrench, "Maintenance"], [RotateCcw, "Retry"], [Keyboard, "Keyboard"],
                ] as [typeof Car, string][]).map(([Icon, label]) => (
                  <div key={label} className="flex flex-col items-center gap-1.5 w-14">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: t.surface, border: `1px solid ${t.borderSubtle}` }}><Icon size={16} style={{ color: t.icon }} /></div>
                    <span style={{ ...TY.bodyR, fontSize: "9px", color: t.textFaint, textAlign: "center" }}>{label}</span>
                  </div>
                ))}
              </div>
            </DSCard>
          </Section>

          {/* ═══ 25. ACCESSIBILITY ═══ */}
          <Section id="a11y" title="ACCESSIBILITY">
            <DSCard>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {[
                  { title: "Keyboard Navigation", items: ["Escape closes modals/drawers", "Tab focus trap in modals", "Enter/Space activates buttons", "Arrow keys in select pills"] },
                  { title: "ARIA", items: ["role=\"dialog\" on modals/drawers", "aria-modal=\"true\" on fixed overlays", "aria-label on all interactive elements", "aria-pressed on toggles"] },
                  { title: "Touch Targets", items: ["Minimum 44px on mobile (Apple HIG)", "8px minimum gap between targets", "Generous padding on list rows"] },
                  { title: "Screen Readers", items: ["Status changes announced via live regions", "Form errors linked via aria-describedby", "Icons have sr-only labels or aria-hidden"] },
                ].map(section => (
                  <div key={section.title}>
                    <span style={{ ...TY.sub, fontSize: "12px", color: t.text, display: "block", marginBottom: 8 }}>{section.title}</span>
                    <div className="space-y-1.5">
                      {section.items.map(item => (
                        <div key={item} className="flex items-center gap-2">
                          <CheckCircle size={10} style={{ color: BRAND.green }} />
                          <span style={{ ...TY.bodyR, fontSize: "10px", color: t.textSecondary }}>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </DSCard>
          </Section>

          {/* ── Footer ─────────────────────────────────────────── */}
          <div className="py-8 text-center">
            <span style={{ ...TY.bodyR, fontSize: "10px", color: t.textGhost }}>JET Design System v1.0 — Generated 17 Mar 2026 · Comprehensive Figma Handoff Reference</span>
          </div>
        </main>
      </div>
    </div>
  );
}

export default function DesignSystem() {
  return (
    <AdminThemeProvider>
      <DesignSystemInner />
    </AdminThemeProvider>
  );
}
