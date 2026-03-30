/**
 * JET ADMIN — UI PRIMITIVES
 *
 * Reusable atoms and molecules for the admin dashboard.
 * Every component is theme-aware, handles states, and adapts responsively.
 */

import { type ReactNode } from "react";
import { motion } from "motion/react";
import {
  AlertCircle, Flame, Timer, Info, CheckCircle2, Zap,
  TrendingUp, XCircle, Scale, UserCheck, CircleDot,
  ChevronRight, Sun, Moon,
  Building2, CreditCard, Car, Wallet, Shield,
} from "lucide-react";
import { useAdminTheme, TY, BRAND, STATUS } from "../../../config/admin-theme";

// ═══════════════════════════════════════════════════════════════════════════
// STATUS BADGE
// ═══════════════════════════════════════════════════════════════════════════
interface StatusBadgeProps {
  label: string;
  color: string;
  size?: "sm" | "md";
}

export function StatusBadge({ label, color, size = "sm" }: StatusBadgeProps) {
  const fontSize = size === "sm" ? "9px" : "10px";
  return (
    <span
      className="px-2 py-0.5 rounded-full inline-flex items-center"
      style={{
        ...TY.cap,
        fontSize,
        color,
        background: `${color}12`,
        border: `1px solid ${color}20`,
      }}
    >
      {label}
    </span>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// KPI CARD
// ═══════════════════════════════════════════════════════════════════════════
interface KPICardProps {
  label: string;
  value: string;
  delta?: string;
  up?: boolean;
  icon: React.ComponentType<{ size?: number; style?: React.CSSProperties }>;
  delay?: number;
}

export function KPICard({ label, value, delta, up, icon: Icon, delay = 0 }: KPICardProps) {
  const { t } = useAdminTheme();
  return (
    <motion.div
      className="flex items-center gap-3 px-4 py-3 rounded-2xl shrink-0"
      style={{
        background: t.surface,
        border: `1px solid ${t.borderSubtle}`,
      }}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
    >
      <Icon size={14} style={{ color: t.iconSecondary }} />
      <div className="min-w-0">
        <div className="flex items-baseline gap-2">
          <span style={{ ...TY.h, fontSize: "18px", color: t.text }}>{value}</span>
          {delta && (
            <span style={{ ...TY.cap, fontSize: "10px", color: up ? BRAND.green : t.textMuted }}>
              {delta}
            </span>
          )}
        </div>
        <span className="block" style={{ ...TY.bodyR, fontSize: "10px", color: t.textFaint }}>{label}</span>
      </div>
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// SEGMENTED BAR
// ═══════════════════════════════════════════════════════════════════════════
interface Segment {
  value: number;
  color: string;
  label?: string;
}

interface SegmentedBarProps {
  segments: Segment[];
  height?: number;
}

export function SegmentedBar({ segments, height = 10 }: SegmentedBarProps) {
  return (
    <div className="flex rounded-full overflow-hidden gap-px" style={{ height }}>
      {segments.map((s, i) => (
        <div
          key={i}
          className="rounded-full"
          style={{
            flex: s.value,
            background: s.color,
            minWidth: s.value > 0 ? 4 : 0,
            transition: "flex 0.5s",
          }}
        />
      ))}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// STAT TILE
// ═══════════════════════════════════════════════════════════════════════════
interface StatTileProps {
  label: string;
  value: string | number;
  color?: string;
}

export function StatTile({ label, value, color }: StatTileProps) {
  const { t } = useAdminTheme();
  return (
    <div
      className="flex-1 px-3 py-2.5 rounded-xl"
      style={{ background: t.surface, border: `1px solid ${t.borderSubtle}` }}
    >
      <span className="block" style={{ ...TY.h, fontSize: "16px", color: color || t.text }}>{value}</span>
      <span style={{ ...TY.bodyR, fontSize: "9px", color: t.textFaint }}>{label}</span>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// DIAGNOSTIC CARD (supply health)
// ═══════════════════════════════════════════════════════════════════════════
interface DiagnosticProps {
  label: string;
  value: string;
  target: string;
  verdict: string;
  ok: boolean;
  pct: number;
  color: string;
}

export function DiagnosticCard({ label, value, target, verdict, ok, pct, color }: DiagnosticProps) {
  const { t } = useAdminTheme();
  return (
    <div
      className="p-3 rounded-xl"
      style={{ background: t.surface, border: `1px solid ${t.borderSubtle}` }}
    >
      <div className="flex items-center justify-between mb-1.5">
        <span style={{ ...TY.body, fontSize: "11px", color: t.textSecondary }}>{label}</span>
        <StatusBadge label={verdict} color={ok ? BRAND.green : STATUS.warning} />
      </div>
      <div className="flex items-baseline gap-2 mb-2">
        <span style={{ ...TY.h, fontSize: "18px", color: t.text }}>{value}</span>
        <span style={{ ...TY.bodyR, fontSize: "10px", color: t.textFaint }}>{target}</span>
      </div>
      <div className="h-1.5 rounded-full overflow-hidden" style={{ background: t.surfaceActive }}>
        <div className="h-full rounded-full" style={{ width: `${pct}%`, background: color, transition: "width 0.5s" }} />
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// STAGE ROW (for pipeline)
// ═══════════════════════════════════════════════════════════════════════════
interface StageRowProps {
  label: string;
  count: number;
  color: string;
  isBottleneck?: boolean;
  delay?: number;
}

export function StageRow({ label, count, color, isBottleneck, delay = 0 }: StageRowProps) {
  const { t } = useAdminTheme();
  return (
    <motion.div
      className="flex items-center gap-3 px-3 rounded-xl"
      style={{
        height: 44,
        background: isBottleneck ? `${color}08` : "transparent",
        border: isBottleneck ? `1px solid ${color}18` : "1px solid transparent",
      }}
      initial={{ opacity: 0, x: 8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay }}
    >
      <div className="w-2 h-2 rounded-full shrink-0" style={{ background: color }} />
      <span className="flex-1" style={{ ...TY.body, fontSize: "13px", letterSpacing: "-0.02em", color: isBottleneck ? t.text : t.textTertiary }}>{label}</span>
      <span style={{ ...TY.h, fontSize: "16px", letterSpacing: "-0.03em", color: isBottleneck ? color : t.textSecondary }}>{count}</span>
      {isBottleneck && (
        <span className="px-1.5 py-0.5 rounded" style={{ ...TY.cap, fontSize: "8px", color, background: `${color}15` }}>Stuck</span>
      )}
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// ACTION QUEUE ITEM
// ═══════════════════════════════════════════════════════════════════════════
interface ActionQueueItemProps {
  priority: string;
  title: string;
  subtitle: string;
  timestamp: string;
  meta?: string;
  delay?: number;
  onClick?: () => void;
}

export function ActionQueueItem({ priority, title, subtitle, timestamp, meta, delay = 0, onClick }: ActionQueueItemProps) {
  const { t } = useAdminTheme();
  const pc = priorityColorFn(priority);
  return (
    <motion.button
      className="w-full flex items-start gap-3 px-4 py-3.5 text-left group"
      style={{ borderBottom: `1px solid ${t.borderSubtle}` }}
      initial={{ opacity: 0, x: 12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay }}
      onClick={onClick}
    >
      <div className="flex flex-col items-center gap-1.5 pt-0.5 shrink-0">
        <PriorityIcon priority={priority} />
        <div className="w-0.5 flex-1 rounded-full" style={{ background: pc, minHeight: 20 }} />
      </div>
      <div className="flex-1 min-w-0">
        <span className="block truncate" style={{ ...TY.body, fontSize: "13px", color: t.text }}>{title}</span>
        <span className="block truncate mt-0.5" style={{ ...TY.bodyR, fontSize: "11px", color: t.textMuted }}>{subtitle}</span>
        <div className="flex items-center gap-2 mt-1.5">
          <span style={{ ...TY.cap, fontSize: "9px", color: t.textFaint }}>{timestamp}</span>
          {meta && (
            <span className="px-1.5 py-0.5 rounded" style={{ ...TY.cap, fontSize: "8px", color: t.textFaint, background: t.surface }}>{meta}</span>
          )}
        </div>
      </div>
      <ChevronRight size={14} className="mt-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: t.iconMuted }} />
    </motion.button>
  );
}

function priorityColorFn(priority: string): string {
  switch (priority) {
    case "critical": return STATUS.error;
    case "high": return STATUS.warning;
    case "medium": return STATUS.info;
    default: return STATUS.neutral;
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// PRIORITY ICON
// ═══════════════════════════════════════════════════════════════════════════
export function PriorityIcon({ priority, size = 12 }: { priority: string; size?: number }) {
  switch (priority) {
    case "critical": return <AlertCircle size={size} style={{ color: STATUS.error }} />;
    case "high": return <Flame size={size} style={{ color: STATUS.warning }} />;
    case "medium": return <Timer size={size} style={{ color: STATUS.info }} />;
    default: return <Info size={size} style={{ color: STATUS.neutral }} />;
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// FEED ICON
// ═══════════════════════════════════════════════════════════════════════════
export function FeedIcon({ type, size = 11 }: { type: string; size?: number }) {
  switch (type) {
    case "ride_completed": return <CheckCircle2 size={size} style={{ color: BRAND.green }} />;
    case "driver_online": return <Zap size={size} style={{ color: STATUS.info }} />;
    case "surge_activated": return <TrendingUp size={size} style={{ color: STATUS.warning }} />;
    case "payment_failed": return <XCircle size={size} style={{ color: STATUS.error }} />;
    case "ride_cancelled": return <XCircle size={size} style={{ color: STATUS.neutral }} />;
    case "dispute_opened": return <Scale size={size} style={{ color: STATUS.warning }} />;
    case "driver_verified": return <UserCheck size={size} style={{ color: BRAND.green }} />;
    // Hotel events
    case "hotel_ride": return <Building2 size={size} style={{ color: STATUS.info }} />;
    case "hotel_invoice": return <CreditCard size={size} style={{ color: STATUS.info }} />;
    case "hotel_issue": return <AlertCircle size={size} style={{ color: STATUS.warning }} />;
    // Fleet events
    case "fleet_offline": return <Car size={size} style={{ color: "#F59E0B" }} />;
    case "fleet_payout": return <Wallet size={size} style={{ color: "#F59E0B" }} />;
    case "fleet_compliance": return <Shield size={size} style={{ color: "#F59E0B" }} />;
    default: return <CircleDot size={size} style={{ color: STATUS.neutral }} />;
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// THEME TOGGLE
// ═══════════════════════════════════════════════════════════════════════════
export function ThemeToggle() {
  const { theme, t, toggle } = useAdminTheme();
  return (
    <button
      onClick={toggle}
      className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
      style={{ background: t.surfaceHover }}
      title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
    >
      {theme === "dark" ? (
        <Sun size={14} style={{ color: t.icon }} />
      ) : (
        <Moon size={14} style={{ color: t.icon }} />
      )}
    </button>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// SECTION LABEL
// ═══════════════════════════════════════════════════════════════════════════
export function SectionLabel({ children }: { children: ReactNode }) {
  const { t } = useAdminTheme();
  return (
    <span className="block mb-2" style={{ ...TY.label, fontSize: "8px", color: t.textFaint }}>
      {children}
    </span>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// ACTION ROW
// ═══════════════════════════════════════════════════════════════════════════
interface ActionRowProps {
  label: string;
  icon: React.ComponentType<{ size?: number; style?: React.CSSProperties }>;
  onClick?: () => void;
}

export function ActionRow({ label, icon: Icon, onClick }: ActionRowProps) {
  const { t } = useAdminTheme();
  return (
    <button
      className="w-full flex items-center gap-3 h-11 px-3 rounded-xl mb-1 transition-colors"
      style={{ border: `1px solid ${t.borderSubtle}` }}
      onClick={onClick}
      onMouseEnter={e => (e.currentTarget.style.background = t.surfaceHover)}
      onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
    >
      <Icon size={14} style={{ color: t.iconSecondary }} />
      <span className="flex-1 text-left" style={{ ...TY.body, fontSize: "12px", color: t.textTertiary }}>{label}</span>
      <ChevronRight size={12} style={{ color: t.textGhost }} />
    </button>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// CTA BUTTON
// ═══════════════════════════════════════════════════════════════════════════
interface CTAButtonProps {
  label: string;
  icon: React.ComponentType<{ size?: number; style?: React.CSSProperties }>;
  color?: string;
  onClick?: () => void;
}

export function CTAButton({ label, icon: Icon, color, onClick }: CTAButtonProps) {
  const c = color || BRAND.green;
  return (
    <button
      className="h-11 px-4 rounded-xl w-full flex items-center justify-center gap-2 transition-opacity hover:opacity-90"
      style={{
        background: `${c}15`,
        border: `1px solid ${c}25`,
        minHeight: 44,
      }}
      onClick={onClick}
    >
      <Icon size={14} style={{ color: c }} />
      <span style={{ ...TY.body, fontSize: "12px", color: c }}>{label}</span>
    </button>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// EMPTY STATE
// ═══════════════════════════════════════════════════════════════════════════
interface EmptyStateProps {
  icon: React.ComponentType<{ size?: number; style?: React.CSSProperties }>;
  title: string;
  description: string;
}

export function EmptyState({ icon: Icon, title, description }: EmptyStateProps) {
  const { t } = useAdminTheme();
  return (
    <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
      <div
        className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4"
        style={{ background: t.surface, border: `1px solid ${t.borderSubtle}` }}
      >
        <Icon size={20} style={{ color: t.iconMuted }} />
      </div>
      <span className="block mb-1" style={{ ...TY.sub, fontSize: "14px", color: t.textSecondary }}>{title}</span>
      <span style={{ ...TY.bodyR, fontSize: "12px", color: t.textMuted }}>{description}</span>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// SKELETON LOADER
// ═══════════════════════════════════════════════════════════════════════════
export function Skeleton({ width = "100%", height = 20, rounded = 8 }: { width?: string | number; height?: number; rounded?: number }) {
  const { theme } = useAdminTheme();
  const bg = theme === "dark" ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)";
  const shimmer = theme === "dark" ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)";
  return (
    <div
      className="animate-pulse"
      style={{
        width,
        height,
        borderRadius: rounded,
        background: `linear-gradient(90deg, ${bg} 25%, ${shimmer} 50%, ${bg} 75%)`,
        backgroundSize: "200% 100%",
      }}
    />
  );
}