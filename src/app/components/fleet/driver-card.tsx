/**
 * FLEET — REUSABLE DRIVER CARD
 *
 * Used anywhere driver info needs to be displayed:
 *   - Fleet dashboard (all variations)
 *   - Driver management screens
 *   - Admin driver detail panels
 *
 * Props:
 *   driver: FleetDriver data
 *   variant: "compact" | "detailed" | "mini"
 *   expanded: whether the card shows expanded trip/detail section
 *   onToggleExpand: callback for expand/collapse
 *   rank: optional ranking number (for "top performers" context)
 *   selectionCriteria: optional label explaining WHY this driver is shown
 *
 * Data sources:
 *   - driver.status → real-time dispatch heartbeat
 *   - driver.sparkline → daily earnings aggregation (trips × fleet_share)
 *   - driver.currentRide → active trip from dispatch table
 *   - driver.rating → 30-day rolling avg from rider feedback
 */

import { motion, AnimatePresence } from "motion/react";
import {
  Star, ChevronRight, Zap, Timer, Car, Phone,
  MoreHorizontal, MapPin, ArrowUpRight,
} from "lucide-react";
import { useAdminTheme, BRAND, TY, STATUS } from "../../config/admin-theme";
import type { FleetDriver } from "../../config/fleet-mock-data";

// ─── Helpers ────────────────────────────────────────────────────────────────

export function driverStatusColor(s: FleetDriver["status"]): string {
  switch (s) {
    case "on_trip": return BRAND.green;
    case "online": return STATUS.info;
    case "offline": return "#555560";
    case "suspended": return STATUS.error;
  }
}

export function driverStatusLabel(s: FleetDriver["status"]): string {
  switch (s) {
    case "on_trip": return "On trip";
    case "online": return "Online";
    case "offline": return "Offline";
    case "suspended": return "Suspended";
  }
}

function fmtFull(n: number): string {
  return "₦" + n.toLocaleString();
}

function fmt(n: number): string {
  if (n >= 1000000) return "₦" + (n / 1000000).toFixed(1) + "M";
  if (n >= 100000) return "₦" + (n / 1000).toFixed(0) + "K";
  return "₦" + n.toLocaleString();
}

// ─── Sparkline (shared inline SVG) ──────────────────────────────────────────

export function Sparkline({
  data: points,
  width = 64,
  height = 20,
  color = BRAND.green,
  fillOpacity = 0.15,
}: {
  data: number[];
  width?: number;
  height?: number;
  color?: string;
  fillOpacity?: number;
}) {
  if (!points.length || points.every(p => p === 0)) return null;
  const max = Math.max(...points);
  const min = Math.min(...points);
  const range = max - min || 1;
  const step = width / (points.length - 1);
  const pts = points.map((p, i) => ({
    x: i * step,
    y: height - ((p - min) / range) * (height - 2) - 1,
  }));
  const line = pts.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(" ");
  const fill = `${line} L ${width} ${height} L 0 ${height} Z`;

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="shrink-0">
      <path d={fill} fill={color} opacity={fillOpacity} />
      <path d={line} fill="none" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ─── Status Dot ─────────────────────────────────────────────────────────────

export function StatusDot({ color, size = 8, pulse = false }: { color: string; size?: number; pulse?: boolean }) {
  return (
    <span className="relative inline-flex shrink-0" style={{ width: size, height: size }}>
      {pulse && (
        <span
          className="absolute inset-0 rounded-full animate-ping"
          style={{ background: color, opacity: 0.4, animationDuration: "2s" }}
        />
      )}
      <span className="relative inline-flex rounded-full w-full h-full" style={{ background: color }} />
    </span>
  );
}

// ─── Driver Avatar ──────────────────────────────────────────────────────────

export function DriverAvatar({ driver, size = 40 }: { driver: FleetDriver; size?: number }) {
  const color = driverStatusColor(driver.status);
  const initials = driver.name.split(" ").map(n => n[0]).join("");
  const isLive = driver.status === "on_trip" || driver.status === "online";

  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <div
        className="w-full h-full rounded-xl flex items-center justify-center"
        style={{
          background: `linear-gradient(135deg, ${color}15 0%, ${color}05 100%)`,
          border: `1px solid ${color}20`,
        }}
      >
        <span style={{
          fontFamily: "'Manrope', sans-serif",
          fontWeight: 500,
          fontSize: size * 0.28,
          color,
          letterSpacing: "-0.02em",
          lineHeight: "1.4",
        }}>
          {initials}
        </span>
      </div>
      <div className="absolute -bottom-0.5 -right-0.5">
        <StatusDot color={color} size={size * 0.25} pulse={isLive} />
      </div>
    </div>
  );
}

// ─── EV Badge ───────────────────────────────────────────────────────────────

function EVBadge() {
  return (
    <span
      className="px-1 py-0.5 rounded shrink-0"
      style={{
        fontFamily: "'Montserrat', sans-serif",
        fontWeight: 600,
        fontSize: "7px",
        letterSpacing: "0.04em",
        background: `linear-gradient(135deg, ${BRAND.green}14 0%, ${BRAND.green}06 100%)`,
        color: BRAND.green,
        border: `1px solid ${BRAND.green}12`,
        lineHeight: "1.2",
      }}
    >
      EV
    </span>
  );
}

// ─── Trip Detail (expanded section) ─────────────────────────────────────────

function TripDetail({ driver }: { driver: FleetDriver }) {
  const { t } = useAdminTheme();

  if (!driver.currentRide) {
    return (
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <Star size={10} style={{ color: STATUS.warning }} />
            <span style={{ ...TY.body, fontSize: "11px", color: t.text, lineHeight: "1.4" }}>
              {driver.rating > 0 ? driver.rating.toFixed(2) : "—"}
            </span>
          </div>
          <span style={{ ...TY.bodyR, fontSize: "10px", color: t.textFaint, lineHeight: "1.5" }}>
            {driver.totalRides} rides total
          </span>
        </div>
        {driver.verificationStatus !== "approved" && (
          <span
            className="px-2 py-1 rounded-lg"
            style={{
              fontFamily: "'Montserrat', sans-serif",
              fontWeight: 600,
              fontSize: "9px",
              letterSpacing: "0.02em",
              background: `${STATUS.warning}10`,
              color: STATUS.warning,
              border: `1px solid ${STATUS.warning}15`,
              lineHeight: "1.2",
            }}
          >
            {driver.verificationStatus.replace(/_/g, " ")}
          </span>
        )}
      </div>
    );
  }

  return (
    <div className="flex items-start gap-3">
      <div className="flex flex-col items-center gap-1 shrink-0 pt-0.5">
        <div className="w-2 h-2 rounded-full" style={{ background: BRAND.green }} />
        <div className="w-px h-6" style={{ background: `${t.textFaint}30` }} />
        <div className="w-2 h-2 rounded-full" style={{ background: STATUS.error }} />
      </div>
      <div className="flex-1 space-y-2">
        <div>
          <span className="block" style={{ ...TY.bodyR, fontSize: "10px", color: t.textMuted, lineHeight: "1.5" }}>Pickup</span>
          <span style={{ ...TY.body, fontSize: "11px", color: t.text, lineHeight: "1.4" }}>{driver.currentRide.pickup}</span>
        </div>
        <div>
          <span className="block" style={{ ...TY.bodyR, fontSize: "10px", color: t.textMuted, lineHeight: "1.5" }}>Dropoff</span>
          <span style={{ ...TY.body, fontSize: "11px", color: t.text, lineHeight: "1.4" }}>{driver.currentRide.dropoff}</span>
        </div>
      </div>
      <div className="shrink-0 text-right space-y-1">
        <div className="flex items-center gap-1 justify-end">
          <Timer size={10} style={{ color: BRAND.green }} />
          <span style={{ ...TY.body, fontSize: "11px", color: BRAND.green, lineHeight: "1.4" }}>
            ETA {driver.currentRide.eta}
          </span>
        </div>
        <span style={{ ...TY.body, fontSize: "12px", color: t.text, lineHeight: "1.4" }}>
          {fmtFull(driver.currentRide.fare)}
        </span>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// DRIVER CARD — "detailed" variant
// ═══════════════════════════════════════════════════════════════════════════

export interface DriverCardProps {
  driver: FleetDriver;
  variant?: "compact" | "detailed" | "mini";
  expanded?: boolean;
  onToggleExpand?: () => void;
  rank?: number;
  delay?: number;
}

export function DriverCard({
  driver,
  variant = "detailed",
  expanded = false,
  onToggleExpand,
  rank,
  delay = 0,
}: DriverCardProps) {
  const { t, theme } = useAdminTheme();
  const isDark = theme === "dark";
  const isOnTrip = driver.status === "on_trip";
  const isEV = driver.assignedVehicle?.includes("BYD") || driver.assignedVehicle?.includes("Ioniq");
  const statusColor = driverStatusColor(driver.status);

  if (variant === "mini") {
    return (
      <motion.div
        className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl cursor-pointer"
        style={{
          background: `linear-gradient(135deg, ${statusColor}06 0%, transparent 100%)`,
          border: `1px solid ${statusColor}08`,
        }}
        whileHover={{
          y: -1,
          borderColor: `${statusColor}20`,
          boxShadow: `0 4px 12px ${statusColor}06`,
        }}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay }}
      >
        <DriverAvatar driver={driver} size={28} />
        <div className="flex-1 min-w-0">
          <span className="block truncate" style={{ ...TY.body, fontSize: "11px", color: t.text, lineHeight: "1.4" }}>
            {driver.name}
          </span>
          <span style={{ ...TY.bodyR, fontSize: "9px", color: t.textMuted, lineHeight: "1.5" }}>
            {driverStatusLabel(driver.status)}
          </span>
        </div>
        <Sparkline data={driver.sparkline} color={statusColor} width={36} height={14} />
      </motion.div>
    );
  }

  if (variant === "compact") {
    return (
      <motion.div
        className="p-3.5 rounded-2xl cursor-pointer overflow-hidden relative"
        style={{
          background: isDark
            ? `linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.015) 100%)`
            : `linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.85) 100%)`,
          border: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}`,
          boxShadow: isDark
            ? "0 2px 12px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.03)"
            : "0 2px 12px rgba(0,0,0,0.04), inset 0 1px 0 rgba(255,255,255,0.5)",
        }}
        whileHover={{
          y: -2,
          borderColor: isDark ? `${statusColor}20` : `${statusColor}18`,
          boxShadow: isDark
            ? `0 8px 24px rgba(0,0,0,0.3), 0 0 16px ${statusColor}06`
            : `0 8px 24px rgba(0,0,0,0.06)`,
        }}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay }}
        onClick={onToggleExpand}
      >
        {/* Rank badge */}
        {rank && (
          <div
            className="absolute top-2.5 right-2.5 w-5 h-5 rounded-md flex items-center justify-center"
            style={{ background: t.surface, border: `1px solid ${t.borderSubtle}` }}
          >
            <span style={{ ...TY.cap, fontSize: "8px", color: t.textMuted }}>#{rank}</span>
          </div>
        )}

        <div className="flex items-center gap-3 mb-3">
          <DriverAvatar driver={driver} size={36} />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="truncate" style={{ ...TY.body, fontSize: "12px", color: t.text, lineHeight: "1.4" }}>{driver.name}</span>
              {isEV && <EVBadge />}
            </div>
            <span style={{ ...TY.bodyR, fontSize: "10px", color: t.textMuted, lineHeight: "1.5" }}>
              {driverStatusLabel(driver.status)}
            </span>
          </div>
        </div>

        {/* Stats row */}
        <div className="flex items-end justify-between gap-2 mb-2">
          <div className="flex items-center gap-4">
            <div>
              <span className="block" style={{ ...TY.bodyR, fontSize: "9px", color: t.textFaint, lineHeight: "1.5" }}>Rides</span>
              <span style={{ ...TY.body, fontSize: "13px", color: t.text, lineHeight: "1.4" }}>{driver.totalRides}</span>
            </div>
            <div>
              <span className="block" style={{ ...TY.bodyR, fontSize: "9px", color: t.textFaint, lineHeight: "1.5" }}>Rating</span>
              <div className="flex items-center gap-0.5">
                <Star size={9} style={{ color: STATUS.warning }} />
                <span style={{ ...TY.body, fontSize: "13px", color: t.text, lineHeight: "1.4" }}>{driver.rating.toFixed(1)}</span>
              </div>
            </div>
            <div>
              <span className="block" style={{ ...TY.bodyR, fontSize: "9px", color: t.textFaint, lineHeight: "1.5" }}>This week</span>
              <span style={{ ...TY.body, fontSize: "13px", color: t.text, lineHeight: "1.4" }}>{fmt(driver.earningsThisWeek)}</span>
            </div>
          </div>
          <Sparkline data={driver.sparkline} color={statusColor} width={48} height={18} />
        </div>

        {/* Vehicle assignment */}
        <div
          className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg"
          style={{ background: t.surface, border: `1px solid ${t.borderSubtle}` }}
        >
          <Car size={10} style={{ color: t.iconMuted }} />
          <span style={{ ...TY.bodyR, fontSize: "10px", color: t.textMuted, lineHeight: "1.5" }}>
            {driver.assignedVehicle || "No vehicle"}
          </span>
        </div>
      </motion.div>
    );
  }

  // ─── "detailed" variant (default) — with expand/collapse ────────────────

  return (
    <motion.div
      className="rounded-2xl overflow-hidden cursor-pointer relative"
      style={{
        background: isDark
          ? "linear-gradient(135deg, rgba(255,255,255,0.035) 0%, rgba(255,255,255,0.015) 100%)"
          : "linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.85) 100%)",
        border: isOnTrip
          ? `1px solid ${BRAND.green}18`
          : `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}`,
        boxShadow: isDark
          ? `0 2px 12px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.03)${isOnTrip ? `, 0 0 20px ${BRAND.green}06` : ""}`
          : "0 2px 12px rgba(0,0,0,0.04), inset 0 1px 0 rgba(255,255,255,0.5)",
      }}
      whileHover={{
        y: -2,
        boxShadow: isDark
          ? `0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.05)${isOnTrip ? `, 0 0 24px ${BRAND.green}08` : ""}`
          : "0 8px 32px rgba(0,0,0,0.08)",
      }}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      onClick={onToggleExpand}
    >
      <div className="p-3.5">
        <div className="flex items-center gap-3">
          <DriverAvatar driver={driver} size={40} />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span style={{ ...TY.body, fontSize: "12px", color: t.text, lineHeight: "1.4" }}>{driver.name}</span>
              {isEV && <EVBadge />}
            </div>
            <span style={{ ...TY.bodyR, fontSize: "10px", color: t.textMuted, lineHeight: "1.5" }}>
              {driver.assignedVehicle || "No vehicle"} · {driverStatusLabel(driver.status)}
            </span>
          </div>
          <div className="shrink-0 flex items-center gap-3">
            <Sparkline data={driver.sparkline} color={statusColor} width={48} height={18} />
            <div className="text-right">
              <span className="block" style={{ ...TY.body, fontSize: "12px", color: t.text, lineHeight: "1.4" }}>
                {driver.totalRides > 0 ? fmtFull(driver.earningsThisWeek) : "—"}
              </span>
              <span style={{ ...TY.bodyR, fontSize: "9px", color: t.textFaint, lineHeight: "1.5" }}>
                {driver.totalRides > 0 ? "this week" : "pending"}
              </span>
            </div>
            <ChevronRight
              size={14}
              className="transition-transform duration-200"
              style={{
                color: t.iconMuted,
                transform: expanded ? "rotate(90deg)" : "rotate(0deg)",
              }}
            />
          </div>
        </div>

        <AnimatePresence>
          {expanded && (
            <motion.div
              className="mt-3 pt-3"
              style={{ borderTop: `1px solid ${t.borderSubtle}` }}
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <TripDetail driver={driver} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
