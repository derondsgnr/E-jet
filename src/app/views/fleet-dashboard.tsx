/**
 * VARIATION E — "Fleet Command"
 *
 * VISUAL HIERARCHY (3 tiers):
 *
 *   TIER 1 — HERO: Earnings card
 *     Gets the green accent border, the ONLY chart (weekly sparkline),
 *     and the largest typography. This is the focal point.
 *
 *   TIER 2 — GLANCEABLE: KPI tiles
 *     Numbers only, no sparklines, no decoration. Lighter surface treatment
 *     (no glass, just a subtle border). Scanned in <1 second.
 *
 *   TIER 3 — DETAIL: Drivers, Vehicles
 *     Standard glass surface. Supporting information you drill into.
 *
 *   DECISION PANEL — RIGHT:
 *     Next Payout gets green glow (it's the #1 thing).
 *     Everything else is flat/muted. No competing surfaces.
 *
 * COLOR DISCIPLINE:
 *   Green → Payout hero, CTAs, active status dots. That's it.
 *   All other elements use neutral/muted tokens.
 *   Status colors (warning/info/error) only on status badges.
 */

import { type ReactNode, useCallback, useMemo, useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Car, Users, Wallet, Zap,
  Star, ChevronRight,
  AlertTriangle, Plus,
  UserPlus, Wrench, Send, Calendar,
  ArrowRight, Route, Layers,
} from "lucide-react";
import { useAdminTheme, BRAND, TY, STATUS } from "../config/admin-theme";
import { MOCK_FLEET_OWNER, type FleetVehicle } from "../config/fleet-mock-data";
import {
  DriverCard, Sparkline, StatusDot,
} from "../components/fleet/driver-card";
import { useFleetContext, ALL_FLEETS_ID, type FleetNavId, type FleetDeepLink } from "./fleet-context";
import { InviteDriverSheet } from "../components/fleet/invite-driver-sheet";
import { AddVehicleSheet } from "../components/fleet/add-vehicle-sheet";
import { DashboardSkeleton } from "../components/shared/view-skeleton";
import { ErrorState } from "../components/shared/error-state";

const STAGGER = 0.04;
const data = MOCK_FLEET_OWNER;

// ─── Helpers ────────────────────────────────────────────────────────────────

function fmt(n: number): string {
  if (n >= 1000000) return "₦" + (n / 1000000).toFixed(1) + "M";
  if (n >= 100000) return "₦" + (n / 1000).toFixed(0) + "K";
  return "₦" + n.toLocaleString();
}

function fmtFull(n: number): string {
  return "₦" + n.toLocaleString();
}

function vehicleStatusColor(s: FleetVehicle["status"]): string {
  switch (s) {
    case "approved": return BRAND.green;
    case "inspection_scheduled": return STATUS.warning;
    case "under_review": return STATUS.info;
    case "maintenance": return "#F97316";
    case "registered": return "#555560";
    default: return STATUS.error;
  }
}

function vehicleStatusLabel(s: FleetVehicle["status"]): string {
  switch (s) {
    case "approved": return "Active";
    case "inspection_scheduled": return "Inspection";
    case "under_review": return "In Review";
    case "maintenance": return "Maintenance";
    default: return s.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase());
  }
}

// ─── Computed data ──────────────────────────────────────────────────────────

const activeVehicles = data.vehicles.filter(v => v.status === "approved" && v.assignedDriverId).length;
const onlineDrivers = data.drivers.filter(d => d.status === "online" || d.status === "on_trip").length;
const avgRating = data.drivers.filter(d => d.rating > 0).reduce((a, d) => a + d.rating, 0) / Math.max(data.drivers.filter(d => d.rating > 0).length, 1);

const sortedDrivers = [...data.drivers]
  .filter(d => d.verificationStatus === "approved")
  .sort((a, b) => b.earningsThisWeek - a.earningsThisWeek);

// Vehicle status summary (dots + numbers)
const vehicleStatusCounts = [
  { label: "Active", count: data.vehicles.filter(v => v.status === "approved").length, color: BRAND.green },
  { label: "Inspection", count: data.vehicles.filter(v => v.status === "inspection_scheduled").length, color: STATUS.warning },
  { label: "In Review", count: data.vehicles.filter(v => v.status === "under_review").length, color: STATUS.info },
  { label: "Maintenance", count: data.vehicles.filter(v => v.status === "maintenance").length, color: "#F97316" },
].filter(g => g.count > 0);

// Needs attention items
const ATTENTION_ITEMS = [
  ...data.vehicles.filter(v => v.status === "under_review").map(v => ({
    id: `v-${v.id}`, entityId: v.id, label: `${v.make} ${v.model}`,
    detail: "Awaiting approval", color: STATUS.info, icon: Car, action: "Review",
    navTo: "vehicles" as FleetNavId, entityType: "vehicle" as const,
  })),
  ...data.vehicles.filter(v => v.status === "inspection_scheduled").map(v => ({
    id: `v-${v.id}`, entityId: v.id, label: `${v.make} ${v.model}`,
    detail: "Inspection scheduled", color: STATUS.warning, icon: Car, action: "View",
    navTo: "vehicles" as FleetNavId, entityType: "vehicle" as const,
  })),
  ...data.vehicles.filter(v => v.status === "maintenance").map(v => ({
    id: `v-${v.id}`, entityId: v.id, label: `${v.make} ${v.model}`,
    detail: "In maintenance", color: "#F97316", icon: Wrench, action: "Track",
    navTo: "vehicles" as FleetNavId, entityType: "vehicle" as const,
  })),
  ...data.drivers.filter(d => d.verificationStatus !== "approved").map(d => ({
    id: `d-${d.id}`, entityId: d.id, label: d.name,
    detail: `Verification: ${d.verificationStatus.replace(/_/g, " ")}`, color: STATUS.warning, icon: Users, action: "Check",
    navTo: "drivers" as FleetNavId, entityType: "driver" as const,
  })),
];

const RECENT_ACTIVITY = [
  { id: "a1", label: "Emeka Nwosu", detail: "Completed ride · ₦4,800", time: "2m", color: BRAND.green },
  { id: "a2", label: "Adaeze Okoro", detail: "Came online", time: "8m", color: STATUS.info },
  { id: "a3", label: "System", detail: "Payout processed · ₦187,500", time: "2h", color: STATUS.warning },
];


// ─── Surface Components ─────────────────────────────────────────────────────

/**
 * TIER 1 — Hero card. Gets the premium glass treatment + optional green accent.
 * Used ONLY for the earnings section and payout card.
 */
function HeroCard({
  children, className = "", style = {}, delay = 0, accent = false,
}: {
  children: ReactNode; className?: string; style?: React.CSSProperties;
  delay?: number; accent?: boolean;
}) {
  const { t, theme } = useAdminTheme();
  const isDark = theme === "dark";

  return (
    <motion.div
      className={`rounded-2xl relative overflow-hidden ${className}`}
      style={{
        background: isDark
          ? "linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.02) 100%)"
          : "linear-gradient(135deg, rgba(255,255,255,0.97) 0%, rgba(255,255,255,0.92) 100%)",
        border: accent
          ? `1px solid ${isDark ? `${BRAND.green}18` : `${BRAND.green}20`}`
          : `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}`,
        boxShadow: isDark
          ? `0 4px 24px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.04)${accent ? `, 0 0 32px ${BRAND.green}06` : ""}`
          : `0 4px 24px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.6)${accent ? `, 0 0 32px ${BRAND.green}04` : ""}`,
        ...style,
      }}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}

/**
 * TIER 3 — Standard card. Lighter than hero. Used for detail sections.
 */
function Card({
  children, className = "", delay = 0,
}: {
  children: ReactNode; className?: string; delay?: number;
}) {
  const { t, theme } = useAdminTheme();
  const isDark = theme === "dark";

  return (
    <motion.div
      className={`rounded-2xl relative overflow-hidden ${className}`}
      style={{
        background: isDark
          ? "linear-gradient(135deg, rgba(255,255,255,0.025) 0%, rgba(255,255,255,0.01) 100%)"
          : "linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.8) 100%)",
        border: `1px solid ${isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.05)"}`,
        boxShadow: isDark
          ? "0 1px 4px rgba(0,0,0,0.15)"
          : "0 1px 4px rgba(0,0,0,0.03)",
      }}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}


// ═══════════════════════════════════════════════════════════════════════════
// VARIATION E
// ═══════════════════════════════════════════════════════════════════════════

export function FleetDashboard() {
  const { t, theme } = useAdminTheme();
  const isDark = theme === "dark";
  const { navigateTo, activeFleetId, fleets } = useFleetContext();
  const nav = useCallback((to: FleetNavId, dl?: FleetDeepLink) => () => navigateTo(to, dl), [navigateTo]);
  const isAggregate = activeFleetId === ALL_FLEETS_ID;
  const fleetCount = fleets.length;

  // Aggregate multiplier — in production this would be real cross-fleet data
  const mx = isAggregate ? fleetCount : 1;

  const [inviteDriverSheetOpen, setInviteDriverSheetOpen] = useState(false);
  const [addVehicleSheetOpen, setAddVehicleSheetOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) return <DashboardSkeleton />;
  if (isError) return <ErrorState onRetry={() => { setIsError(false); setIsLoading(true); setTimeout(() => setIsLoading(false), 600); }} />;

  return (
    <div className="flex flex-col md:flex-row h-full relative">

      {/* ── LEFT: Content (scrollable) ─────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto p-4 md:p-5 space-y-5">

        {/* ── Aggregate banner ──────────────────────────────────────────── */}
        {isAggregate && (
          <motion.div
            className="flex items-center gap-2.5 px-4 py-3 rounded-xl"
            style={{
              background: isDark ? `${BRAND.green}06` : `${BRAND.green}04`,
              border: `1px solid ${isDark ? `${BRAND.green}12` : `${BRAND.green}10`}`,
            }}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Layers size={14} style={{ color: BRAND.green }} />
            <div className="flex-1">
              <span style={{ ...TY.body, fontSize: "12px", color: BRAND.green, lineHeight: "1.4", letterSpacing: "-0.02em" }}>
                All Fleets
              </span>
              <span className="ml-2" style={{ ...TY.bodyR, fontSize: "10px", color: t.textMuted, lineHeight: "1.5" }}>
                Combined view across {fleetCount} fleets
              </span>
            </div>
            <div className="flex items-center gap-1">
              {fleets.map(f => (
                <span key={f.id} className="px-1.5 py-0.5 rounded-md" style={{
                  background: isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)",
                  ...TY.bodyR, fontSize: "9px", color: t.textMuted, lineHeight: "1.5",
                }}>
                  {f.name.split(" ").pop()}
                </span>
              ))}
            </div>
          </motion.div>
        )}

        {/* ── TIER 2: KPI Strip (flat, no cards, no charts) ────────────── */}
        {/* These are glanceable numbers. No visual noise. */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-3"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        >
          {[
            { label: isAggregate ? "Total Earnings Today" : "Earnings Today", value: fmtFull(data.earnings.today * mx), icon: Wallet, navTo: "earnings" as FleetNavId },
            { label: isAggregate ? "Total Rides Today" : "Rides Today", value: `${23 * mx}`, icon: Route, navTo: "earnings" as FleetNavId },
            { label: isAggregate ? "All Vehicles Active" : "Vehicles Active", value: `${activeVehicles * mx}/${data.vehicles.length * mx}`, icon: Car, navTo: "vehicles" as FleetNavId },
            { label: isAggregate ? "All Drivers Online" : "Drivers Online", value: `${onlineDrivers * mx}/${data.drivers.length * mx}`, icon: Users, navTo: "drivers" as FleetNavId },
          ].map((kpi, i) => (
            <motion.div
              key={kpi.label}
              className="px-3.5 py-3 rounded-xl cursor-pointer"
              onClick={nav(kpi.navTo)}
              style={{
                border: `1px solid ${isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.05)"}`,
                background: isDark ? "rgba(255,255,255,0.015)" : "rgba(255,255,255,0.6)",
              }}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04, duration: 0.3 }}
            >
              <div className="flex items-center gap-1.5 mb-1.5">
                <kpi.icon size={10} style={{ color: t.textFaint }} />
                <span style={{ ...TY.bodyR, fontSize: "9px", color: t.textFaint, lineHeight: "1.5" }}>{kpi.label}</span>
              </div>
              <span style={{
                fontFamily: "'Montserrat', sans-serif", fontWeight: 600,
                fontSize: "20px", letterSpacing: "-0.03em", color: t.text, lineHeight: "1.2",
              }}>
                {kpi.value}
              </span>
            </motion.div>
          ))}
        </motion.div>


        {/* ── TIER 1: Earnings Hero (the ONE section with a chart) ──────── */}
        <HeroCard delay={0.06} accent>
          <div className="p-4 md:p-5">
            {/* Earnings breakdown — numbers only, no sparklines */}
            <div className="flex items-baseline gap-6 mb-4 flex-wrap">
              {[
                { label: "Today", value: data.earnings.today * mx, active: true },
                { label: "This Week", value: data.earnings.thisWeek * mx, active: false },
                { label: "This Month", value: data.earnings.thisMonth * mx, active: false },
                { label: "All Time", value: data.earnings.allTime * mx, active: false },
              ].map((p) => (
                <div key={p.label}>
                  <span className="block" style={{ ...TY.bodyR, fontSize: "9px", color: t.textFaint, lineHeight: "1.5" }}>{p.label}</span>
                  <span style={{
                    fontFamily: "'Montserrat', sans-serif",
                    fontWeight: p.active ? 600 : 500,
                    fontSize: p.active ? "18px" : "14px",
                    letterSpacing: "-0.03em",
                    color: p.active ? t.text : t.textSecondary,
                    lineHeight: "1.3",
                  }}>
                    {fmt(p.value)}
                  </span>
                </div>
              ))}
            </div>

            {/* Weekly chart — the ONE chart on the page */}
            <div className="w-full overflow-hidden">
              <Sparkline
                data={data.earnings.dailyChart.map(d => d.amount)}
                color={BRAND.green}
                width={540}
                height={44}
                fillOpacity={0.08}
              />
              <div className="flex items-center justify-between mt-1.5" style={{ maxWidth: 540 }}>
                {data.earnings.dailyChart.map(d => (
                  <span key={d.day} style={{ ...TY.bodyR, fontSize: "9px", color: t.textFaint }}>{d.day}</span>
                ))}
              </div>
            </div>
          </div>
        </HeroCard>


        {/* ── Separator ────────────────────────────────────────────────── */}
        <div className="h-px" style={{ background: `linear-gradient(90deg, ${t.borderSubtle}, transparent 80%)` }} />


        {/* ── TIER 3: Top Performers ───────────────────────────────────── */}
        <div>
          <div className="flex items-center justify-between px-1 mb-2.5">
            <span style={{ ...TY.body, fontSize: "12px", color: t.text, lineHeight: "1.4" }}>Top Performers</span>
            <button className="flex items-center gap-1 cursor-pointer"
              onClick={nav("drivers")}
              style={{ minHeight: 28 }}>
              <span style={{ ...TY.body, fontSize: "10px", color: t.textMuted, lineHeight: "1.4" }}>
                All {data.drivers.length}
              </span>
              <ArrowRight size={10} style={{ color: t.textMuted }} />
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {sortedDrivers.slice(0, 4).map((driver, i) => (
              <div key={driver.id} onClick={nav("drivers", { entityId: driver.id, entityType: "driver" })} className="cursor-pointer">
                <DriverCard
                  driver={driver}
                  variant="compact"
                  rank={i + 1}
                  delay={0.18 + i * STAGGER}
                />
              </div>
            ))}
          </div>
        </div>


        {/* ── Separator ────────────────────────────────────────────────── */}
        <div className="h-px" style={{ background: `linear-gradient(90deg, ${t.borderSubtle}, transparent 80%)` }} />


        {/* ── TIER 3: Your Vehicles ────────────────────────────────────── */}
        <div>
          <div className="flex items-center justify-between px-1 mb-2.5">
            <div className="flex items-center gap-2">
              <span style={{ ...TY.body, fontSize: "12px", color: t.text, lineHeight: "1.4" }}>Your Vehicles</span>
              <span style={{ ...TY.bodyR, fontSize: "9px", color: t.textFaint, lineHeight: "1.5" }}>
                {data.vehicles.length}
              </span>
            </div>
            <button className="flex items-center gap-1 px-2 py-1 rounded-lg cursor-pointer"
              onClick={() => setAddVehicleSheetOpen(true)}
              style={{ border: `1px solid ${t.borderSubtle}` }}>
              <Plus size={10} style={{ color: t.textMuted }} />
              <span style={{ ...TY.body, fontSize: "10px", color: t.textMuted, lineHeight: "1.4" }}>Add</span>
            </button>
          </div>

          <Card delay={0.3}>
            <div>
              {data.vehicles.map((vehicle, i) => {
                const statusColor = vehicleStatusColor(vehicle.status);
                const isEV = vehicle.type === "EV";
                const isLast = i === data.vehicles.length - 1;

                return (
                  <motion.div
                    key={vehicle.id}
                    className="flex items-center gap-3 px-4 py-3 cursor-pointer"
                    onClick={nav("vehicles", { entityId: vehicle.id, entityType: "vehicle" })}
                    style={{
                      borderBottom: !isLast
                        ? `1px solid ${isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.03)"}`
                        : "none",
                    }}
                    whileHover={{
                      backgroundColor: isDark ? "rgba(255,255,255,0.015)" : "rgba(0,0,0,0.008)",
                    }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.32 + i * 0.03 }}
                  >
                    {/* Vehicle icon — muted, not status-colored */}
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                      style={{
                        background: isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.03)",
                        border: `1px solid ${isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)"}`,
                      }}
                    >
                      {isEV ? <Zap size={13} style={{ color: t.textFaint }} /> : <Car size={13} style={{ color: t.textFaint }} />}
                    </div>

                    {/* Vehicle info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="truncate" style={{ ...TY.body, fontSize: "11px", color: t.text, lineHeight: "1.4" }}>
                          {vehicle.make} {vehicle.model}
                        </span>
                        {isEV && (
                          <span
                            className="px-1 py-0.5 rounded shrink-0"
                            style={{
                              fontFamily: "'Montserrat', sans-serif", fontWeight: 600,
                              fontSize: "7px", letterSpacing: "0.04em",
                              background: `${BRAND.green}10`, color: BRAND.green,
                              border: `1px solid ${BRAND.green}08`, lineHeight: "1.2",
                            }}
                          >
                            EV
                          </span>
                        )}
                      </div>
                      <span style={{ ...TY.bodyR, fontSize: "9px", color: t.textFaint, lineHeight: "1.5" }}>
                        {vehicle.plate} {vehicle.assignedDriverName ? `· ${vehicle.assignedDriverName}` : "· Unassigned"}
                      </span>
                    </div>

                    {/* Status badge — only source of color in this row */}
                    <span
                      className="px-2 py-1 rounded-lg shrink-0"
                      style={{
                        ...TY.bodyR, fontSize: "9px",
                        background: `${statusColor}08`,
                        color: statusColor,
                        lineHeight: "1.4",
                      }}
                    >
                      {vehicleStatusLabel(vehicle.status)}
                    </span>

                    <ChevronRight size={11} style={{ color: t.textFaint }} />
                  </motion.div>
                );
              })}
            </div>
          </Card>
        </div>


        <div className="h-16" />
      </div>


      {/* ── RIGHT: Decision Panel ──────────────────────────────────────── */}
      {/* Gradient Separator (Linear/Vercel style) */}
      <div className="hidden md:block w-px self-stretch" style={{ background: `linear-gradient(to bottom, transparent, ${t.borderSubtle}, transparent)` }} />
      <div className="md:hidden h-px" style={{ background: `linear-gradient(to right, transparent, ${t.borderSubtle}, transparent)` }} />
      <div
        className="shrink-0 md:w-[300px] overflow-y-auto md:h-full"
        style={{
          background: isDark
            ? "linear-gradient(180deg, rgba(255,255,255,0.008) 0%, transparent 100%)"
            : "linear-gradient(180deg, rgba(0,0,0,0.006) 0%, transparent 100%)",
        }}
      >
        <div className="p-4 space-y-4">

          {/* ── Next Payout (the ONE green-accented card in the panel) ──── */}
          <HeroCard delay={0.05} accent>
            <div className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <StatusDot color={BRAND.green} size={6} pulse />
                <span style={{ ...TY.body, fontSize: "10px", color: BRAND.green, lineHeight: "1.4" }}>Next Payout</span>
                <span className="ml-auto" style={{ ...TY.bodyR, fontSize: "9px", color: t.textFaint, lineHeight: "1.5" }}>
                  {data.earnings.nextPayout.date}
                </span>
              </div>
              <span className="block mb-1" style={{
                fontFamily: "'Montserrat', sans-serif", fontWeight: 600,
                fontSize: "22px", letterSpacing: "-0.03em", color: t.text, lineHeight: "1.2",
              }}>
                {fmtFull(data.earnings.nextPayout.amount * mx)}
              </span>
              <span style={{ ...TY.bodyR, fontSize: "9px", color: t.textMuted, lineHeight: "1.5" }}>
                {data.bankAccount} · {data.payoutSchedule}
              </span>
            </div>
          </HeroCard>


          {/* ── Needs Attention ─────────────────────────────────────────── */}
          {ATTENTION_ITEMS.length > 0 && (
            <>
              <div className="h-px" style={{ background: `linear-gradient(90deg, transparent, ${t.borderSubtle}, transparent)` }} />
              <div>
                <div className="flex items-center gap-1.5 mb-2.5">
                  <AlertTriangle size={11} style={{ color: STATUS.warning }} />
                  <span style={{
                    fontFamily: "'Montserrat', sans-serif", fontWeight: 600,
                    fontSize: "10px", letterSpacing: "-0.02em", color: t.textSecondary, lineHeight: "1.2",
                  }}>
                    Needs Attention
                  </span>
                  <span className="ml-auto px-1.5 py-0.5 rounded-md" style={{
                    ...TY.bodyR, fontSize: "8px",
                    background: `${STATUS.warning}08`, color: STATUS.warning, lineHeight: "1.5",
                  }}>
                    {ATTENTION_ITEMS.length}
                  </span>
                </div>
                <div className="space-y-1">
                  {ATTENTION_ITEMS.map((item, i) => (
                    <motion.div
                      key={item.id}
                      className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl cursor-pointer group"
                      onClick={nav(item.navTo, { entityId: item.entityId, entityType: item.entityType })}
                      style={{
                        border: `1px solid ${isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.03)"}`,
                      }}
                      whileHover={{
                        borderColor: `${item.color}18`,
                        backgroundColor: isDark ? "rgba(255,255,255,0.015)" : "rgba(0,0,0,0.008)",
                      }}
                      initial={{ opacity: 0, x: 8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 + i * STAGGER }}
                    >
                      <item.icon size={12} style={{ color: item.color }} />
                      <div className="flex-1 min-w-0">
                        <span className="block truncate" style={{ ...TY.body, fontSize: "10px", color: t.text, lineHeight: "1.4" }}>
                          {item.label}
                        </span>
                        <span style={{ ...TY.bodyR, fontSize: "9px", color: t.textMuted, lineHeight: "1.5" }}>
                          {item.detail}
                        </span>
                      </div>
                      <span
                        className="px-1.5 py-0.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-150 shrink-0"
                        style={{
                          ...TY.body, fontSize: "8px",
                          color: item.color,
                        }}
                      >
                        {item.action} →
                      </span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </>
          )}


          {/* ── Quick Actions ──────────────────────────────────────────── */}
          <div className="h-px" style={{ background: `linear-gradient(90deg, transparent, ${t.borderSubtle}, transparent)` }} />
          <div>
            <span className="block mb-2" style={{
              fontFamily: "'Montserrat', sans-serif", fontWeight: 600,
              fontSize: "10px", letterSpacing: "-0.02em", color: t.textFaint, lineHeight: "1.2",
            }}>
              Quick Actions
            </span>
            <div className="grid grid-cols-2 gap-1.5">
              {[
                { icon: UserPlus, label: "Invite Driver", onClick: () => setInviteDriverSheetOpen(true) },
                { icon: Plus, label: "Add Vehicle", onClick: () => setAddVehicleSheetOpen(true) },
                { icon: Calendar, label: "Schedule Insp.", onClick: nav("vehicles") },
                { icon: Send, label: "View Payouts", onClick: nav("earnings") },
              ].map((action) => (
                <motion.button
                  key={action.label}
                  className="flex items-center gap-1.5 px-2.5 py-2 rounded-xl cursor-pointer"
                  onClick={action.onClick}
                  style={{
                    border: `1px solid ${isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)"}`,
                    background: "transparent",
                    minHeight: 36,
                  }}
                  whileHover={{
                    backgroundColor: isDark ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.01)",
                    borderColor: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)",
                  }}
                >
                  <action.icon size={11} style={{ color: t.textFaint }} />
                  <span style={{ ...TY.body, fontSize: "9px", color: t.textSecondary, lineHeight: "1.4" }}>{action.label}</span>
                </motion.button>
              ))}
            </div>
          </div>


          {/* ── Fleet Health (dots + numbers) ──────────────────────────── */}
          <div className="h-px" style={{ background: `linear-gradient(90deg, transparent, ${t.borderSubtle}, transparent)` }} />
          <div>
            <span className="block mb-2.5" style={{
              fontFamily: "'Montserrat', sans-serif", fontWeight: 600,
              fontSize: "10px", letterSpacing: "-0.02em", color: t.textFaint, lineHeight: "1.2",
            }}>
              Fleet Health
            </span>

            <div className="space-y-2">
              {/* Rating */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Star size={10} style={{ color: STATUS.warning }} />
                  <span style={{ ...TY.bodyR, fontSize: "10px", color: t.textMuted, lineHeight: "1.5" }}>Rating</span>
                </div>
                <span style={{ ...TY.body, fontSize: "11px", color: t.text, lineHeight: "1.4" }}>
                  {avgRating.toFixed(2)}
                </span>
              </div>

              {/* Vehicle status counts */}
              {vehicleStatusCounts.map(item => (
                <div key={item.label} className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <StatusDot color={item.color} size={5} />
                    <span style={{ ...TY.bodyR, fontSize: "10px", color: t.textMuted, lineHeight: "1.5" }}>{item.label}</span>
                  </div>
                  <span style={{ ...TY.body, fontSize: "11px", color: t.textSecondary, lineHeight: "1.4" }}>
                    {item.count}
                  </span>
                </div>
              ))}

              {/* Online drivers */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <StatusDot color={STATUS.info} size={5} />
                  <span style={{ ...TY.bodyR, fontSize: "10px", color: t.textMuted, lineHeight: "1.5" }}>Online</span>
                </div>
                <span style={{ ...TY.body, fontSize: "11px", color: t.textSecondary, lineHeight: "1.4" }}>
                  {onlineDrivers}/{data.drivers.length}
                </span>
              </div>
            </div>
          </div>


          {/* ── Activity (3 max, muted) ────────────────────────────────── */}
          <div className="h-px" style={{ background: `linear-gradient(90deg, transparent, ${t.borderSubtle}, transparent)` }} />
          <div>
            <span className="block mb-2" style={{
              fontFamily: "'Montserrat', sans-serif", fontWeight: 600,
              fontSize: "10px", letterSpacing: "-0.02em", color: t.textFaint, lineHeight: "1.2",
            }}>
              Recent
            </span>
            <div>
              {RECENT_ACTIVITY.map((event, i) => (
                <div
                  key={event.id}
                  className="flex items-start gap-2.5 py-2"
                  style={{
                    borderBottom: i < RECENT_ACTIVITY.length - 1
                      ? `1px solid ${isDark ? "rgba(255,255,255,0.025)" : "rgba(0,0,0,0.025)"}`
                      : "none",
                  }}
                >
                  <div className="mt-1.5 shrink-0">
                    <StatusDot color={event.color} size={4} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="block truncate" style={{ ...TY.bodyR, fontSize: "9px", color: t.textMuted, lineHeight: "1.4" }}>
                      {event.label} · {event.detail}
                    </span>
                  </div>
                  <span className="shrink-0" style={{ ...TY.bodyR, fontSize: "8px", color: t.textFaint, lineHeight: "1.5" }}>
                    {event.time}
                  </span>
                </div>
              ))}
            </div>
          </div>


          <div className="h-16" />
        </div>
      </div>

      {/* ── Modals ──────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {inviteDriverSheetOpen && (
          <InviteDriverSheet
            onClose={() => setInviteDriverSheetOpen(false)}
            onSend={(name, email) => {
              setInviteDriverSheetOpen(false);
              // Toast would go here in production
            }}
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {addVehicleSheetOpen && (
          <AddVehicleSheet
            onClose={() => setAddVehicleSheetOpen(false)}
            onAdd={(make, plate) => {
              setAddVehicleSheetOpen(false);
              // Toast would go here in production
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}