/**
 * DS COMPONENTS — Shared UI components documentation.
 * Buttons, Inputs, Toggles, Status, Cards, Badges, Charts,
 * Modals, Drawers, Toasts, Alerts, Notifications, Skeletons, Empty/Error, Save Bar.
 */

import { useState, type ReactNode } from "react";
import { motion } from "motion/react";
import {
  Zap, Car, Users, Wallet, Star,
  AlertTriangle, CheckCircle, Info, XCircle, AlertCircle,
  Search, Plus, ChevronRight, X, Copy,
  ArrowUp, Download, Mail, UserPlus,
} from "lucide-react";
import { useAdminTheme, BRAND, TY, STATUS } from "../config/admin-theme";
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
import { Section, DSCard, SLabel, PropTable, StatusBadge, NoteCard, DSep } from "./ds-primitives";

// ── Local helpers ──────────────────────────────────────────────────────────

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
      <span style={{ ...TY.body, fontSize: "10px", color, fontFamily: "monospace", letterSpacing: "-0.02em" }}>{level}%</span>
    </div>
  );
}

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
        <linearGradient id="ds-chart-grad2" x1="0" y1="0" x2="0" y2="1">
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
      <path d={areaPath} fill="url(#ds-chart-grad2)" />
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

// ═══════════════════════════════════════════════════════════════════════════
// MAIN
// ═══════════════════════════════════════════════════════════════════════════

export default function DSComponents() {
  const { t, theme } = useAdminTheme();
  const isDark = theme === "dark";
  const [toggleVal, setToggleVal] = useState(true);
  const [inputVal, setInputVal] = useState("Lagos, Nigeria");
  const [selectVal, setSelectVal] = useState("daily");
  const [skelVar, setSkelVar] = useState<"dashboard" | "table" | "earnings" | "billing" | "form" | "settings">("dashboard");

  return (
    <div className="max-w-[1100px] mx-auto px-5 py-8 space-y-14">

      {/* ═══ BUTTONS ═══ */}
      <Section id="buttons" title="BUTTONS">
        <DSCard>
          <SLabel>VARIANTS</SLabel>
          <div className="flex flex-wrap gap-4 mb-6">
            <DSButton label="Primary" variant="primary" />
            <DSButton label="Secondary" variant="secondary" />
            <DSButton label="Ghost" variant="ghost" />
            <DSButton label="Destructive" variant="destructive" />
            <DSButton label="Outline" variant="outline" />
          </div>
          <DSep />
          <SLabel>PRIMARY STATES</SLabel>
          <div className="flex flex-wrap gap-4 mb-4">{(["default", "hover", "active", "disabled"] as const).map(s => <DSButton key={s} label={s} variant="primary" state={s} />)}</div>
          <DSep />
          <SLabel>SIZES</SLabel>
          <div className="flex flex-wrap items-end gap-4 mb-4">
            <DSButton label="Small" variant="primary" size="sm" />
            <DSButton label="Medium" variant="primary" size="md" />
            <DSButton label="Large" variant="primary" size="lg" />
          </div>
          <DSep />
          <SLabel>WITH ICONS</SLabel>
          <div className="flex flex-wrap gap-4 mb-4">
            <DSButton label="Add Driver" variant="primary" icon={<Plus size={13} />} />
            <DSButton label="Search" variant="secondary" icon={<Search size={13} />} />
            <DSButton label="Copy Link" variant="ghost" icon={<Copy size={13} />} />
            <DSButton label="Remove" variant="destructive" icon={<X size={13} />} />
            <DSButton label="Download" variant="outline" icon={<Download size={13} />} />
          </div>
          <SLabel>PROPS</SLabel>
          <PropTable rows={[
            ["variant", "'primary' | 'secondary' | ...", "'primary'"],
            ["state", "'default' | 'hover' | ...", "'default'"],
            ["size", "'sm' | 'md' | 'lg'", "'md'"],
            ["icon", "ReactNode", "undefined"],
            ["disabled", "boolean", "false"],
          ]} />
          <NoteCard variant="green">Green as scalpel — only CTAs, active states, status indicators, EV badges.</NoteCard>
        </DSCard>
      </Section>

      {/* ═══ INPUTS ═══ */}
      <Section id="inputs" title="INPUTS">
        <DSCard>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div><SLabel>TEXT INPUT — DEFAULT</SLabel><TextInput value={inputVal} onChange={setInputVal} placeholder="Enter location..." /></div>
            <div><SLabel>TEXT INPUT — DISABLED</SLabel><TextInput value="Cannot edit" onChange={() => {}} disabled /></div>
            <div><SLabel>SEARCH INPUT</SLabel>
              <div className="flex items-center gap-2 px-3 py-2 rounded-xl" style={{ background: isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)", border: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}` }}>
                <Search size={12} style={{ color: t.textFaint }} />
                <input value="" readOnly placeholder="Search drivers, vehicles..." className="flex-1 bg-transparent outline-none" style={{ ...TY.bodyR, fontSize: "12px", color: t.text, lineHeight: "1.4", letterSpacing: "-0.02em" }} />
              </div>
            </div>
            <div><SLabel>INPUT — ERROR STATE</SLabel>
              <div>
                <input className="w-full px-3 py-2 rounded-xl outline-none" style={{ ...TY.bodyR, fontSize: "12px", color: t.text, background: isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)", border: `1px solid ${STATUS.error}60`, boxShadow: `0 0 0 2px ${STATUS.error}18`, lineHeight: "1.4", letterSpacing: "-0.02em" }} value="invalid@" readOnly />
                <span style={{ ...TY.bodyR, fontSize: "10px", color: STATUS.error, display: "block", marginTop: 4, letterSpacing: "-0.02em" }}>Please enter a valid email address.</span>
              </div>
            </div>
            <div className="md:col-span-2"><SLabel>TEXTAREA</SLabel>
              <TextArea value="Additional notes for the booking concierge." onChange={() => {}} rows={3} />
            </div>
          </div>
        </DSCard>
      </Section>

      {/* ═══ TOGGLES & SELECTS ═══ */}
      <Section id="toggles" title="TOGGLES & SELECTS">
        <DSCard>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div><SLabel>TOGGLE</SLabel>
              <div className="flex items-center gap-8">
                {([
                  { label: "On", checked: toggleVal, fn: setToggleVal, dis: false },
                  { label: "Off", checked: false, fn: () => {}, dis: false },
                  { label: "Disabled On", checked: true, fn: () => {}, dis: true },
                  { label: "Disabled Off", checked: false, fn: () => {}, dis: true },
                ] as const).map((item, i) => (
                  <div key={i} className="flex flex-col items-center gap-1.5">
                    <Toggle checked={item.checked} onChange={item.fn as any} disabled={item.dis} />
                    <span style={{ ...TY.bodyR, fontSize: "9px", color: t.textFaint, letterSpacing: "-0.02em" }}>{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
            <div><SLabel>SELECT PILL (SEGMENTED)</SLabel>
              <SelectPill options={[{ value: "daily", label: "Daily" }, { value: "weekly", label: "Weekly" }, { value: "monthly", label: "Monthly" }]} value={selectVal} onChange={setSelectVal} />
            </div>
            <div className="md:col-span-2"><SLabel>FILTER PILLS (TAB-STYLE)</SLabel>
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
                    ...TY.body, fontSize: "10px", color: f.active ? BRAND.green : t.textMuted, letterSpacing: "-0.02em",
                  }}>
                    {f.label} <span style={{ ...TY.bodyR, fontSize: "9px", color: f.active ? BRAND.green : t.textFaint }}>{f.count}</span>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </DSCard>
      </Section>

      {/* ═══ STATUS SYSTEM ═══ */}
      <Section id="status" title="STATUS SYSTEM">
        <DSCard>
          <div className="space-y-5">
            <div><SLabel>DRIVER STATUS</SLabel>
              <div className="flex flex-wrap gap-3">
                <StatusBadge label="On Trip" color={BRAND.green} bg={t.greenBg} border={t.greenBorder} />
                <StatusBadge label="Online" color={STATUS.info} bg={t.infoBg} border={t.infoBorder} />
                <StatusBadge label="Offline" color="#737373" bg={isDark ? "rgba(115,115,115,0.08)" : "rgba(115,115,115,0.06)"} border={isDark ? "rgba(115,115,115,0.15)" : "rgba(115,115,115,0.12)"} />
                <StatusBadge label="Suspended" color={STATUS.error} bg={t.errorBg} border={t.errorBorder} />
              </div></div>
            <DSep />
            <div><SLabel>RIDE STATUS</SLabel>
              <div className="flex flex-wrap gap-3">
                <StatusBadge label="Requested" color={STATUS.warning} bg={t.warningBg} border={t.warningBorder} />
                <StatusBadge label="Assigned" color={STATUS.info} bg={t.infoBg} border={t.infoBorder} />
                <StatusBadge label="In Progress" color={BRAND.green} bg={t.greenBg} border={t.greenBorder} />
                <StatusBadge label="Completed" color={t.textMuted} bg={isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)"} border={t.borderSubtle} />
                <StatusBadge label="Cancelled" color={STATUS.error} bg={t.errorBg} border={t.errorBorder} />
              </div></div>
            <DSep />
            <div><SLabel>VEHICLE STATUS</SLabel>
              <div className="flex flex-wrap gap-3">
                <StatusBadge label="Active" color={BRAND.green} bg={t.greenBg} border={t.greenBorder} />
                <StatusBadge label="Pending" color={STATUS.warning} bg={t.warningBg} border={t.warningBorder} />
                <StatusBadge label="Maintenance" color={STATUS.info} bg={t.infoBg} border={t.infoBorder} />
                <StatusBadge label="Inactive" color={t.textMuted} bg={isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)"} border={t.borderSubtle} />
              </div></div>
            <DSep />
            <div><SLabel>TYPE BADGES</SLabel>
              <div className="flex flex-wrap gap-3">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded" style={{ background: `${BRAND.green}10`, ...TY.body, fontSize: "10px", color: BRAND.green, letterSpacing: "-0.02em" }}><Zap size={10} /> EV</span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded" style={{ background: isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)", ...TY.body, fontSize: "10px", color: t.textSecondary, letterSpacing: "-0.02em" }}>Gas</span>
              </div></div>
          </div>
        </DSCard>
      </Section>

      {/* ═══ CARDS ═══ */}
      <Section id="cards" title="CARDS & SURFACES">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <DSCard><SLabel>STANDARD CARD</SLabel>
            <span style={{ ...TY.sub, fontSize: "13px", color: t.text, letterSpacing: "-0.02em" }}>Total Earnings</span>
            <span style={{ ...TY.h, fontSize: "24px", color: t.text, display: "block", marginTop: 2 }}>₦2.4M</span>
            <div className="flex items-center gap-1 mt-2"><ArrowUp size={10} style={{ color: BRAND.green }} /><span style={{ ...TY.body, fontSize: "10px", color: BRAND.green, letterSpacing: "-0.02em" }}>+12%</span><span style={{ ...TY.bodyR, fontSize: "10px", color: t.textFaint, letterSpacing: "-0.02em" }}>from last week</span></div>
          </DSCard>
          <div className="rounded-2xl p-5" style={{ background: isDark ? `linear-gradient(135deg, ${BRAND.green}08, transparent)` : `linear-gradient(135deg, ${BRAND.green}04, transparent)`, border: `1px solid ${t.greenBorder}` }}>
            <SLabel>ACCENT CARD</SLabel>
            <span style={{ ...TY.sub, fontSize: "13px", color: t.greenText, letterSpacing: "-0.02em" }}>Next Payout</span>
            <span style={{ ...TY.h, fontSize: "24px", color: t.text, display: "block", marginTop: 2 }}>₦680K</span>
          </div>
          <div className="rounded-2xl p-5" style={{ background: t.glass, backdropFilter: t.glassBlur, border: `1px solid ${t.borderSubtle}`, boxShadow: t.shadow }}>
            <SLabel>GLASS CARD</SLabel>
            <span style={{ ...TY.sub, fontSize: "13px", color: t.text, letterSpacing: "-0.02em" }}>Active Drivers</span>
            <span style={{ ...TY.h, fontSize: "24px", color: t.text, display: "block", marginTop: 2 }}>24</span>
          </div>
        </div>
        <DSCard className="mt-4">
          <SLabel>FIELD ROW (SETTINGS PATTERN)</SLabel>
          <FieldRow label="Company Name" sublabel="Legal entity"><TextInput value="JET Mobility Ltd" onChange={() => {}} /></FieldRow>
          <Separator />
          <FieldRow label="Notifications"><Toggle checked={true} onChange={() => {}} /></FieldRow>
          <Separator />
          <FieldRow label="Payout Frequency"><SelectPill options={[{ value: "weekly", label: "Weekly" }, { value: "biweekly", label: "Bi-weekly" }]} value="weekly" onChange={() => {}} /></FieldRow>
        </DSCard>
      </Section>

      {/* ═══ BADGES ═══ */}
      <Section id="badges" title="BADGES & PILLS">
        <DSCard>
          <SLabel>STATUS DOTS (WITH OPTIONAL PULSE)</SLabel>
          <div className="flex items-center gap-6 mb-5">
            {([{ c: BRAND.green, l: "Active", p: true }, { c: STATUS.info, l: "Online", p: true }, { c: STATUS.warning, l: "Warning", p: false }, { c: STATUS.error, l: "Error", p: false }, { c: "#737373", l: "Offline", p: false }] as const).map(d => (
              <div key={d.l} className="flex items-center gap-1.5"><StatusDot color={d.c} size={6} pulse={d.p} /><span style={{ ...TY.body, fontSize: "10px", color: t.textSecondary, letterSpacing: "-0.02em" }}>{d.l}</span></div>
            ))}
          </div>
          <DSep />
          <SLabel>DEMAND LEVELS</SLabel>
          <div className="flex flex-wrap gap-3 mb-5">
            {([{ l: "Surge", c: STATUS.warning }, { l: "High", c: BRAND.green }, { l: "Normal", c: t.textMuted }, { l: "Low", c: t.textFaint }] as const).map(d => (
              <span key={d.l} className="px-2.5 py-1 rounded-lg" style={{ background: `${d.c}12`, border: `1px solid ${d.c}20`, ...TY.body, fontSize: "10px", color: d.c, letterSpacing: "-0.02em" }}>{d.l}</span>
            ))}
          </div>
          <DSep />
          <SLabel>DRIVER AVATAR</SLabel>
          <div className="flex items-center gap-4">
            {[{ name: "Chidi Okafor", s: 40 }, { name: "Amaka Eze", s: 32 }, { name: "Emeka N.", s: 24 }].map(a => (
              <div key={a.name} className="flex flex-col items-center gap-1.5">
                <div className="rounded-full flex items-center justify-center" style={{ width: a.s, height: a.s, background: `${BRAND.green}15`, border: `1.5px solid ${BRAND.green}30` }}>
                  <span style={{ ...TY.body, fontSize: a.s * 0.38, color: BRAND.green, letterSpacing: "-0.02em" }}>{a.name.split(" ").map(n => n[0]).join("")}</span>
                </div>
                <span style={{ ...TY.bodyR, fontSize: "9px", color: t.textFaint }}>{a.s}px</span>
              </div>
            ))}
          </div>
        </DSCard>
      </Section>

      {/* ═══ CHARTS ═══ */}
      <Section id="charts" title="CHARTS & DATA VIZ">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <DSCard>
            <SLabel>AREA CHART (SVG — CUSTOM)</SLabel>
            <MiniAreaChart data={CHART_DATA} width={460} height={160} />
          </DSCard>
          <DSCard>
            <SLabel>SPARKLINE (INLINE SVG)</SLabel>
            <div className="space-y-4 mt-2">
              {([
                { label: "Trending up", data: [3, 4, 2, 6, 5, 8, 7, 9, 10, 12], color: BRAND.green },
                { label: "Volatile", data: [8, 3, 7, 2, 9, 4, 6, 3, 8, 5], color: STATUS.warning },
                { label: "Declining", data: [12, 10, 9, 7, 6, 5, 4, 3, 2, 1], color: STATUS.error },
              ] as const).map(s => (
                <div key={s.label} className="flex items-center gap-3">
                  <Sparkline data={s.data} color={s.color} width={64} height={20} />
                  <span style={{ ...TY.body, fontSize: "10px", color: t.textSecondary, letterSpacing: "-0.02em" }}>{s.label}</span>
                </div>
              ))}
            </div>
          </DSCard>
          <DSCard>
            <SLabel>PROGRESS BAR</SLabel>
            <div className="space-y-4">
              {[
                { label: "Credit usage (safe)", value: 45, max: 100, color: BRAND.green },
                { label: "Credit usage (warning)", value: 82, max: 100, color: STATUS.warning },
                { label: "Credit usage (critical)", value: 95, max: 100, color: STATUS.error },
              ].map(p => (
                <div key={p.label}>
                  <div className="flex justify-between mb-1"><span style={{ ...TY.body, fontSize: "10px", color: t.textSecondary, letterSpacing: "-0.02em" }}>{p.label}</span><span style={{ ...TY.body, fontSize: "10px", color: p.color, fontFamily: "monospace" }}>{p.value}%</span></div>
                  <ProgressBar value={p.value} max={p.max} color={p.color} />
                </div>
              ))}
            </div>
          </DSCard>
          <DSCard>
            <SLabel>BATTERY BAR (EV VEHICLES)</SLabel>
            <div className="space-y-3">
              {[85, 45, 15].map(lvl => (
                <div key={lvl} className="flex items-center gap-3">
                  <BatteryBar level={lvl} />
                  <span style={{ ...TY.bodyR, fontSize: "10px", color: t.textFaint, letterSpacing: "-0.02em" }}>{lvl > 50 ? "Healthy" : lvl > 20 ? "Low" : "Critical"}</span>
                </div>
              ))}
            </div>
          </DSCard>
        </div>
      </Section>

      {/* ═══ MODALS ═══ */}
      <Section id="modals" title="MODALS & SHEETS">
        <DSCard>
          <SLabel>MODAL VARIANTS (STATIC PREVIEWS)</SLabel>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {/* Confirm Destructive */}
            <div className="rounded-2xl p-5" style={{ background: isDark ? "rgba(22,22,24,0.97)" : "#fff", border: `1px solid ${t.borderSubtle}`, boxShadow: t.shadowLg }}>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: `${STATUS.error}12` }}><AlertTriangle size={15} style={{ color: STATUS.error }} /></div>
                <div><span style={{ ...TY.sub, fontSize: "13px", color: t.text, display: "block", letterSpacing: "-0.02em" }}>Suspend Driver?</span><span style={{ ...TY.bodyR, fontSize: "10px", color: t.textFaint, letterSpacing: "-0.02em" }}>Confirm · Destructive</span></div>
              </div>
              <span style={{ ...TY.bodyR, fontSize: "12px", color: t.textSecondary, display: "block", marginBottom: 16, letterSpacing: "-0.02em" }}>This will immediately revoke access.</span>
              <div className="flex gap-3">
                <div className="flex-1 py-2.5 rounded-xl text-center" style={{ background: t.surface, border: `1px solid ${t.borderSubtle}`, ...TY.body, fontSize: "12px", color: t.textSecondary, letterSpacing: "-0.02em" }}>Cancel</div>
                <div className="flex-1 py-2.5 rounded-xl text-center" style={{ background: STATUS.error, ...TY.body, fontSize: "12px", color: "#fff", letterSpacing: "-0.02em" }}>Suspend</div>
              </div>
            </div>
            {/* Confirm Success */}
            <div className="rounded-2xl p-5" style={{ background: isDark ? "rgba(22,22,24,0.97)" : "#fff", border: `1px solid ${t.borderSubtle}`, boxShadow: t.shadowLg }}>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: `${BRAND.green}12` }}><CheckCircle size={15} style={{ color: BRAND.green }} /></div>
                <div><span style={{ ...TY.sub, fontSize: "13px", color: t.text, display: "block", letterSpacing: "-0.02em" }}>Reassign Vehicle?</span><span style={{ ...TY.bodyR, fontSize: "10px", color: t.textFaint, letterSpacing: "-0.02em" }}>Confirm · Success</span></div>
              </div>
              <span style={{ ...TY.bodyR, fontSize: "12px", color: t.textSecondary, display: "block", marginBottom: 16, letterSpacing: "-0.02em" }}>The new driver will be notified.</span>
              <div className="flex gap-3">
                <div className="flex-1 py-2.5 rounded-xl text-center" style={{ background: t.surface, border: `1px solid ${t.borderSubtle}`, ...TY.body, fontSize: "12px", color: t.textSecondary, letterSpacing: "-0.02em" }}>Cancel</div>
                <div className="flex-1 py-2.5 rounded-xl text-center" style={{ background: BRAND.green, ...TY.body, fontSize: "12px", color: "#fff", letterSpacing: "-0.02em" }}>Confirm</div>
              </div>
            </div>
            {/* Form Sheet */}
            <div className="rounded-2xl overflow-hidden" style={{ background: isDark ? "#141416" : "#fff", border: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}`, boxShadow: t.shadowLg }}>
              <div className="flex items-center justify-between px-5 py-3" style={{ borderBottom: `1px solid ${t.borderSubtle}` }}>
                <div className="flex items-center gap-2"><Car size={14} style={{ color: t.textMuted }} /><span style={{ ...TY.sub, fontSize: "13px", color: t.text, letterSpacing: "-0.02em" }}>Add Vehicle</span></div>
                <div className="w-6 h-6 rounded-md flex items-center justify-center" style={{ background: t.surface }}><X size={12} style={{ color: t.textMuted }} /></div>
              </div>
              <div className="p-5 space-y-3">
                <div><span style={{ ...TY.body, fontSize: "10px", color: t.textSecondary, display: "block", marginBottom: 4, letterSpacing: "-0.02em" }}>Make & Model</span><TextInput value="Toyota Camry 2024" onChange={() => {}} /></div>
                <div><span style={{ ...TY.body, fontSize: "10px", color: t.textSecondary, display: "block", marginBottom: 4, letterSpacing: "-0.02em" }}>Plate Number</span><TextInput value="LND-234-AB" onChange={() => {}} /></div>
                <button className="w-full py-2.5 rounded-xl text-center" style={{ background: BRAND.green, ...TY.body, fontSize: "12px", color: "#fff", letterSpacing: "-0.02em" }}>Add Vehicle</button>
              </div>
            </div>
            {/* Invite Sheet */}
            <div className="rounded-2xl overflow-hidden" style={{ background: isDark ? "#141416" : "#fff", border: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}`, boxShadow: t.shadowLg }}>
              <div className="flex items-center justify-between px-5 py-3" style={{ borderBottom: `1px solid ${t.borderSubtle}` }}>
                <div className="flex items-center gap-2"><UserPlus size={14} style={{ color: t.textMuted }} /><span style={{ ...TY.sub, fontSize: "13px", color: t.text, letterSpacing: "-0.02em" }}>Invite Driver</span></div>
                <div className="w-6 h-6 rounded-md flex items-center justify-center" style={{ background: t.surface }}><X size={12} style={{ color: t.textMuted }} /></div>
              </div>
              <div className="p-5 space-y-3">
                <div><span style={{ ...TY.body, fontSize: "10px", color: t.textSecondary, display: "block", marginBottom: 4, letterSpacing: "-0.02em" }}>Full Name</span><TextInput value="Chidi Okafor" onChange={() => {}} /></div>
                <div><span style={{ ...TY.body, fontSize: "10px", color: t.textSecondary, display: "block", marginBottom: 4, letterSpacing: "-0.02em" }}>Email or Phone</span><TextInput value="chidi@jet.ng" onChange={() => {}} /></div>
                <button className="w-full py-2.5 rounded-xl text-center flex items-center justify-center gap-1.5" style={{ background: BRAND.green, ...TY.body, fontSize: "12px", color: "#fff", letterSpacing: "-0.02em" }}><Mail size={13} /> Send Invite</button>
              </div>
            </div>
          </div>
          <SLabel>ANATOMY</SLabel>
          <PropTable rows={[
            ["backdrop", "rgba(0,0,0,0.6|0.3)", "dark | light"],
            ["surface", "#141416 | #FFFFFF", "Opaque, not glass"],
            ["animation", "scale 0.96→1, y 40→0", "200ms ease-out"],
            ["close", "Escape + backdrop click", "Always"],
          ]} />
        </DSCard>
      </Section>

      {/* ═══ TOASTS ═══ */}
      <Section id="toasts" title="TOASTS">
        <DSCard>
          <SLabel>TOAST VARIANTS</SLabel>
          <div className="space-y-3 mb-4">
            {([
              { msg: "Driver assigned successfully", type: "success" as const, color: BRAND.green },
              { msg: "Payout scheduled for Friday", type: "info" as const, color: STATUS.info },
              { msg: "Failed to send notification", type: "error" as const, color: STATUS.error },
            ]).map((toast) => (
              <div key={toast.type} className="flex items-center gap-2.5 px-4 py-3 rounded-xl" style={{
                background: isDark ? "rgba(22,22,24,0.95)" : "rgba(255,255,255,0.97)",
                border: `1px solid ${isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)"}`,
                boxShadow: isDark ? "0 8px 32px rgba(0,0,0,0.5)" : "0 8px 32px rgba(0,0,0,0.12)",
              }}>
                <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: toast.color }} />
                <span style={{ ...TY.body, fontSize: "12px", color: t.text, lineHeight: "1.4", flex: 1, letterSpacing: "-0.02em" }}>{toast.msg}</span>
                <span className="px-2 py-0.5 rounded" style={{ ...TY.label, fontSize: "8px", color: toast.color, background: `${toast.color}10` }}>{toast.type.toUpperCase()}</span>
              </div>
            ))}
          </div>
          <PropTable rows={[
            ["message", "string", "—"],
            ["type", "'success' | 'info' | 'error'", "'success'"],
            ["duration", "number (ms)", "3000"],
          ]} />
        </DSCard>
      </Section>

      {/* ═══ ALERTS ═══ */}
      <Section id="alerts" title="ALERTS & BANNERS">
        <DSCard>
          <SLabel>INLINE ALERTS</SLabel>
          <div className="space-y-3">
            {([
              { type: "success", icon: CheckCircle, color: BRAND.green, bg: t.greenBg, border: t.greenBorder, text: t.greenText, msg: "Vehicle registration approved." },
              { type: "info", icon: Info, color: STATUS.info, bg: t.infoBg, border: t.infoBorder, text: t.infoText, msg: "Next payout scheduled for Friday." },
              { type: "warning", icon: AlertTriangle, color: STATUS.warning, bg: t.warningBg, border: t.warningBorder, text: t.warningText, msg: "Credit limit approaching 80%." },
              { type: "error", icon: AlertCircle, color: STATUS.error, bg: t.errorBg, border: t.errorBorder, text: t.errorText, msg: "Verification failed. Please resubmit." },
            ] as const).map(a => {
              const Icon = a.icon;
              return (
                <div key={a.type} className="flex items-start gap-3 p-3.5 rounded-xl" style={{ background: a.bg, border: `1px solid ${a.border}` }}>
                  <div className="w-6 h-6 rounded-lg flex items-center justify-center shrink-0 mt-0.5" style={{ background: `${a.color}15` }}><Icon size={13} style={{ color: a.color }} /></div>
                  <div className="flex-1">
                    <span style={{ ...TY.body, fontSize: "11px", color: a.text, display: "block", marginBottom: 2, letterSpacing: "-0.02em" }}>{a.type.charAt(0).toUpperCase() + a.type.slice(1)}</span>
                    <span style={{ ...TY.bodyR, fontSize: "11px", color: a.text, opacity: 0.85, letterSpacing: "-0.02em" }}>{a.msg}</span>
                  </div>
                  <X size={12} style={{ color: a.text, opacity: 0.5, cursor: "pointer", marginTop: 2 }} />
                </div>
              );
            })}
          </div>
        </DSCard>
      </Section>

      {/* ═══ NOTIFICATIONS ═══ */}
      <Section id="notifications" title="NOTIFICATION PANEL">
        <DSCard>
          <SLabel>LINEAR/VERCEL DROPDOWN STYLE</SLabel>
          <div className="rounded-xl overflow-hidden" style={{ border: `1px solid ${t.borderSubtle}`, maxWidth: 340 }}>
            <div className="flex items-center justify-between px-4 py-2.5" style={{ borderBottom: `1px solid ${t.borderSubtle}` }}>
              <span style={{ ...TY.sub, fontSize: "12px", color: t.text, letterSpacing: "-0.02em" }}>Notifications</span>
              <span style={{ ...TY.bodyR, fontSize: "10px", color: BRAND.green, cursor: "pointer", letterSpacing: "-0.02em" }}>Mark all read</span>
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
                      <span className="truncate" style={{ ...TY.body, fontSize: "11px", color: t.text, letterSpacing: "-0.02em" }}>{n.title}</span>
                      {n.unread && <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: BRAND.green }} />}
                    </div>
                    <span className="truncate block" style={{ ...TY.bodyR, fontSize: "10px", color: t.textMuted, letterSpacing: "-0.02em" }}>{n.desc}</span>
                  </div>
                  <span className="shrink-0" style={{ ...TY.bodyR, fontSize: "9px", color: t.textFaint }}>{n.time}</span>
                </div>
              );
            })}
          </div>
        </DSCard>
      </Section>

      {/* ═══ SKELETONS ═══ */}
      <Section id="skeletons" title="SKELETON LOADING STATES">
        <DSCard>
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <SLabel>VARIANT</SLabel>
            {(["dashboard", "table", "earnings", "billing", "form", "settings"] as const).map(v => (
              <button key={v} onClick={() => setSkelVar(v)} className="px-3 py-1.5 rounded-lg cursor-pointer" style={{
                background: skelVar === v ? (isDark ? "rgba(255,255,255,0.06)" : "#fff") : "transparent",
                border: `1px solid ${skelVar === v ? t.borderStrong : "transparent"}`,
                boxShadow: skelVar === v && !isDark ? "0 1px 3px rgba(0,0,0,0.06)" : "none",
                ...TY.body, fontSize: "10px", color: skelVar === v ? t.text : t.textMuted, letterSpacing: "-0.02em",
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
          <NoteCard variant="info">Rule: "Skeletons, not spinners" — Linear/Vercel style. animate-pulse on muted rects matching real layout.</NoteCard>
        </DSCard>
      </Section>

      {/* ═══ EMPTY & ERROR ═══ */}
      <Section id="states" title="EMPTY & ERROR STATES">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <DSCard>
            <SLabel>EMPTY STATE</SLabel>
            <div className="flex flex-col items-center justify-center py-8">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4" style={{ background: t.surface, border: `1px solid ${t.borderSubtle}` }}><Users size={24} style={{ color: t.iconMuted }} /></div>
              <span style={{ ...TY.sub, fontSize: "14px", color: t.text, display: "block", marginBottom: 4, letterSpacing: "-0.02em" }}>No drivers yet</span>
              <span style={{ ...TY.bodyR, fontSize: "12px", color: t.textMuted, maxWidth: 240, textAlign: "center", display: "block", marginBottom: 16, letterSpacing: "-0.02em" }}>Invite drivers to start building your fleet.</span>
              <button className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl cursor-pointer" style={{ background: BRAND.green, ...TY.body, fontSize: "12px", color: "#fff", letterSpacing: "-0.02em" }}><Plus size={13} /> Invite Driver</button>
            </div>
          </DSCard>
          <DSCard>
            <SLabel>ERROR STATE</SLabel>
            <div className="flex flex-col items-center justify-center py-8">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4" style={{ background: t.errorBg, border: `1px solid ${t.errorBorder}` }}><AlertCircle size={24} style={{ color: STATUS.error }} /></div>
              <span style={{ ...TY.sub, fontSize: "14px", color: t.text, display: "block", marginBottom: 4, letterSpacing: "-0.02em" }}>Something went wrong</span>
              <span style={{ ...TY.bodyR, fontSize: "12px", color: t.textMuted, maxWidth: 240, textAlign: "center", display: "block", marginBottom: 16, letterSpacing: "-0.02em" }}>We couldn't load this content.</span>
              <button className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl cursor-pointer" style={{ background: t.surface, border: `1px solid ${t.borderSubtle}`, ...TY.body, fontSize: "12px", color: t.textSecondary, letterSpacing: "-0.02em" }}>Try again</button>
            </div>
          </DSCard>
        </div>
      </Section>

      {/* ═══ SAVE BAR ═══ */}
      <Section id="savebar" title="SAVE BAR">
        <DSCard>
          <SLabel>FLOATING UNSAVED CHANGES BAR</SLabel>
          <div className="flex items-center gap-3 px-5 py-3 rounded-2xl" style={{
            background: isDark ? "rgba(18,18,20,0.95)" : "rgba(255,255,255,0.97)",
            border: `1px solid ${isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)"}`,
            backdropFilter: "blur(20px)", boxShadow: t.shadowLg,
          }}>
            <span style={{ ...TY.body, fontSize: "12px", color: t.textMuted, letterSpacing: "-0.02em" }}>Unsaved changes</span>
            <button className="px-3 py-1.5 rounded-lg" style={{ background: isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.03)", border: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}`, ...TY.body, fontSize: "11px", color: t.textMuted, letterSpacing: "-0.02em" }}>Discard</button>
            <button className="px-4 py-1.5 rounded-lg flex items-center gap-1.5" style={{ background: BRAND.green, ...TY.body, fontSize: "11px", color: "#fff", letterSpacing: "-0.02em" }}><Download size={11} /> Save changes</button>
          </div>
          <PropTable rows={[["dirty", "boolean", "false"], ["saving", "boolean", "false"], ["onSave", "() => void", "—"], ["onDiscard", "() => void", "—"]]} />
        </DSCard>
      </Section>

      {/* ── Footer ─── */}
      <div className="py-6 text-center">
        <span style={{ ...TY.bodyR, fontSize: "10px", color: t.textGhost, letterSpacing: "-0.02em" }}>JET Design System · Components · 17 Mar 2026</span>
      </div>
    </div>
  );
}
