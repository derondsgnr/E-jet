/**
 * HOTEL — DASHBOARD (Active state)
 *
 * One job: Understand today's guest mobility at a glance.
 *
 * Architecture:
 *   - KPI strip (rides today, spend, active guests, avg rating)
 *   - Active rides feed (live status)
 *   - Weekly ride chart (sparkline)
 *   - Credit usage meter
 *   - Recent rides list
 *   - Quick actions
 *
 * Data sources (all traceable):
 *   - KPIs → hotel_kpis view (aggregated from trips + invoices)
 *   - Active rides → trips WHERE hotel_id AND status IN (requested, assigned, in_progress)
 *   - Credit → hotel_invoices WHERE status = 'pending'
 */

import { useCallback, useState, useEffect } from "react";
import { motion } from "motion/react";
import {
  Car, Users, Wallet, Star, TrendingUp,
  ArrowRight, Clock, MapPin, CreditCard,
  ChevronRight, Zap, UserPlus,
} from "lucide-react";
import { useAdminTheme, BRAND, TY, STATUS } from "../config/admin-theme";
import { MOCK_HOTEL, type HotelRide } from "../config/hotel-mock-data";
import { Sparkline, StatusDot } from "../components/fleet/driver-card";
import { useHotelContext } from "./hotel-context";
import { DashboardSkeleton } from "../components/shared/view-skeleton";
import { ErrorState } from "../components/shared/error-state";

const data = MOCK_HOTEL;
const STAGGER = 0.04;

function fmt(n: number): string {
  if (n >= 1000000) return "₦" + (n / 1000000).toFixed(1) + "M";
  if (n >= 100000) return "₦" + (n / 1000).toFixed(0) + "K";
  return "₦" + n.toLocaleString();
}

function rideStatusColor(s: HotelRide["status"]): string {
  switch (s) {
    case "completed": return BRAND.green;
    case "in_progress": return STATUS.info;
    case "driver_assigned": return STATUS.warning;
    case "requested": return "#8B5CF6";
    case "cancelled": return STATUS.error;
    default: return "#555";
  }
}

function rideStatusLabel(s: HotelRide["status"]): string {
  switch (s) {
    case "completed": return "Completed";
    case "in_progress": return "In Progress";
    case "driver_assigned": return "Driver Assigned";
    case "requested": return "Requested";
    case "cancelled": return "Cancelled";
    default: return s;
  }
}


export function HotelDashboardView() {
  const { t, theme } = useAdminTheme();
  const isDark = theme === "dark";
  const { navigateTo } = useHotelContext();
  const nav = useCallback((id: "book" | "rides" | "billing" | "settings") => () => navigateTo(id), [navigateTo]);

  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  const activeRides = data.rides.filter(r => r.status === "in_progress" || r.status === "driver_assigned" || r.status === "requested");
  const recentCompleted = data.rides.filter(r => r.status === "completed").slice(0, 4);
  const creditPercent = Math.min((data.creditUsed / data.creditLimit) * 100, 100);
  const creditWarning = creditPercent > 80;

  if (isLoading) return <DashboardSkeleton />;
  if (isError) return <ErrorState onRetry={() => { setIsError(false); setIsLoading(true); setTimeout(() => setIsLoading(false), 600); }} />;

  return (
    <div className="flex flex-col md:flex-row h-full relative">

      {/* ── LEFT: Main Content ──────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto p-4 md:p-5 space-y-5">

        {/* KPI Strip */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-3"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
        >
          {[
            { label: "Rides Today", value: `${data.kpis.ridesToday}`, icon: Car, onClick: nav("rides") },
            { label: "Spend Today", value: fmt(data.kpis.spendToday), icon: Wallet, onClick: nav("billing") },
            { label: "Active Guests", value: `${data.kpis.activeGuests}`, icon: Users, onClick: nav("rides") },
            { label: "Avg Rating", value: data.kpis.avgRating.toFixed(1), icon: Star, onClick: nav("rides") },
          ].map((kpi, i) => (
            <motion.div
              key={kpi.label}
              className="px-3.5 py-3 rounded-xl cursor-pointer"
              onClick={kpi.onClick}
              style={{
                border: `1px solid ${isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.05)"}`,
                background: isDark ? "rgba(255,255,255,0.015)" : "rgba(255,255,255,0.6)",
              }}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * STAGGER, duration: 0.3 }}
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


        {/* Active Rides */}
        {activeRides.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 }}
          >
            <div className="flex items-center justify-between px-1 mb-2.5">
              <div className="flex items-center gap-2">
                <StatusDot color={BRAND.green} size={6} pulse />
                <span style={{ ...TY.body, fontSize: "12px", color: t.text, lineHeight: "1.4", letterSpacing: "-0.02em" }}>
                  Active Rides
                </span>
                <span className="px-1.5 py-0.5 rounded-md" style={{
                  ...TY.bodyR, fontSize: "9px", background: `${BRAND.green}08`, color: BRAND.green, lineHeight: "1.5",
                }}>
                  {activeRides.length}
                </span>
              </div>
              <button onClick={nav("rides")} className="flex items-center gap-1 cursor-pointer" style={{ minHeight: 28 }}>
                <span style={{ ...TY.body, fontSize: "10px", color: t.textMuted, lineHeight: "1.4" }}>View all</span>
                <ArrowRight size={10} style={{ color: t.textMuted }} />
              </button>
            </div>

            <div className="space-y-2">
              {activeRides.map((ride, i) => {
                const statusColor = rideStatusColor(ride.status);
                return (
                  <motion.div
                    key={ride.id}
                    className="px-4 py-3 rounded-xl cursor-pointer"
                    onClick={nav("rides")}
                    style={{
                      background: isDark ? "rgba(255,255,255,0.02)" : "rgba(255,255,255,0.8)",
                      border: `1px solid ${isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.05)"}`,
                    }}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + i * STAGGER }}
                    whileHover={{ borderColor: `${statusColor}18` }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span style={{ ...TY.body, fontSize: "11px", color: t.text, lineHeight: "1.4", letterSpacing: "-0.02em" }}>
                            {ride.guestName}
                          </span>
                          <span className="px-1.5 py-0.5 rounded-md" style={{
                            ...TY.bodyR, fontSize: "8px", background: isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)", color: t.textFaint, lineHeight: "1.5",
                          }}>
                            Room {ride.roomNumber}
                          </span>
                          {ride.vehicleType === "EV" && (
                            <span className="px-1 py-0.5 rounded" style={{
                              fontFamily: "'Montserrat', sans-serif", fontWeight: 600,
                              fontSize: "7px", letterSpacing: "0.04em",
                              background: `${BRAND.green}10`, color: BRAND.green, lineHeight: "1.2",
                            }}>EV</span>
                          )}
                        </div>
                        <div className="flex items-center gap-1.5">
                          <MapPin size={9} style={{ color: t.textFaint }} />
                          <span style={{ ...TY.bodyR, fontSize: "10px", color: t.textMuted, lineHeight: "1.5" }}>
                            {ride.dropoff}
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-1 shrink-0">
                        <span className="px-2 py-0.5 rounded-lg" style={{
                          ...TY.bodyR, fontSize: "9px", background: `${statusColor}08`, color: statusColor, lineHeight: "1.4",
                        }}>
                          {rideStatusLabel(ride.status)}
                        </span>
                        {ride.driverName && (
                          <span style={{ ...TY.bodyR, fontSize: "9px", color: t.textFaint, lineHeight: "1.5" }}>
                            {ride.driverName}
                          </span>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}


        {/* Separator */}
        <div className="h-px" style={{ background: `linear-gradient(90deg, ${t.borderSubtle}, transparent 80%)` }} />


        {/* Weekly Trend */}
        <motion.div
          className="p-4 rounded-xl"
          style={{
            background: isDark ? "rgba(255,255,255,0.02)" : "rgba(255,255,255,0.8)",
            border: `1px solid ${isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.05)"}`,
          }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.12 }}
        >
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp size={12} style={{ color: t.textFaint }} />
            <span style={{ ...TY.body, fontSize: "11px", color: t.text, lineHeight: "1.4", letterSpacing: "-0.02em" }}>
              This Week
            </span>
            <span className="ml-auto" style={{ ...TY.bodyR, fontSize: "10px", color: t.textMuted }}>
              {data.kpis.ridesThisWeek} rides · {fmt(data.kpis.spendThisWeek)}
            </span>
          </div>
          <Sparkline data={data.kpis.weeklyChart} color={BRAND.green} width={480} height={40} fillOpacity={0.08} />
          <div className="flex justify-between mt-1.5" style={{ maxWidth: 480 }}>
            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(d => (
              <span key={d} style={{ ...TY.bodyR, fontSize: "9px", color: t.textFaint }}>{d}</span>
            ))}
          </div>
        </motion.div>


        {/* Separator */}
        <div className="h-px" style={{ background: `linear-gradient(90deg, ${t.borderSubtle}, transparent 80%)` }} />


        {/* Recent Completed */}
        <div>
          <div className="flex items-center justify-between px-1 mb-2.5">
            <span style={{ ...TY.body, fontSize: "12px", color: t.text, lineHeight: "1.4", letterSpacing: "-0.02em" }}>
              Recent Rides
            </span>
            <button onClick={nav("rides")} className="flex items-center gap-1 cursor-pointer" style={{ minHeight: 28 }}>
              <span style={{ ...TY.body, fontSize: "10px", color: t.textMuted }}>All rides</span>
              <ArrowRight size={10} style={{ color: t.textMuted }} />
            </button>
          </div>

          <div className="rounded-xl overflow-hidden" style={{ border: `1px solid ${isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.05)"}` }}>
            {recentCompleted.map((ride, i) => (
              <motion.div
                key={ride.id}
                className="flex items-center gap-3 px-4 py-3 cursor-pointer"
                onClick={nav("rides")}
                style={{ borderBottom: i < recentCompleted.length - 1 ? `1px solid ${isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.03)"}` : "none" }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.15 + i * 0.03 }}
                whileHover={{ backgroundColor: isDark ? "rgba(255,255,255,0.015)" : "rgba(0,0,0,0.008)" }}
              >
                <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{
                  background: isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.03)",
                  border: `1px solid ${isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)"}`,
                }}>
                  <Car size={13} style={{ color: t.textFaint }} />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="block truncate" style={{ ...TY.body, fontSize: "11px", color: t.text, lineHeight: "1.4", letterSpacing: "-0.02em" }}>
                    {ride.guestName} · Room {ride.roomNumber}
                  </span>
                  <span style={{ ...TY.bodyR, fontSize: "9px", color: t.textFaint, lineHeight: "1.5" }}>
                    {ride.dropoff} · {ride.requestedAt}
                  </span>
                </div>
                <span style={{
                  fontFamily: "'Montserrat', sans-serif", fontWeight: 600,
                  fontSize: "12px", letterSpacing: "-0.02em", color: t.text, lineHeight: "1.2",
                }}>
                  {fmt(ride.fare)}
                </span>
                <ChevronRight size={11} style={{ color: t.textFaint }} />
              </motion.div>
            ))}
          </div>
        </div>

        <div className="h-16" />
      </div>


      {/* ── RIGHT: Decision Panel ──────────────────────────────────────── */}
      {/* Gradient Separator (Linear/Vercel style) */}
      <div className="hidden md:block w-px self-stretch" style={{ background: `linear-gradient(to bottom, transparent, ${t.borderSubtle}, transparent)` }} />
      <div className="md:hidden h-px" style={{ background: `linear-gradient(to right, transparent, ${t.borderSubtle}, transparent)` }} />
      <div
        className="shrink-0 md:w-[280px] overflow-y-auto md:h-full"
      >
        <div className="p-4 space-y-4">

          {/* Credit Meter */}
          <motion.div
            className="p-4 rounded-xl"
            style={{
              background: isDark
                ? `linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.015) 100%)`
                : `linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.9) 100%)`,
              border: `1px solid ${creditWarning ? `${STATUS.warning}20` : (isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)")}`,
              boxShadow: creditWarning ? `0 0 24px ${STATUS.warning}06` : undefined,
            }}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
          >
            <div className="flex items-center gap-2 mb-2">
              <CreditCard size={12} style={{ color: creditWarning ? STATUS.warning : t.textMuted }} />
              <span style={{ ...TY.body, fontSize: "10px", color: creditWarning ? STATUS.warning : t.textSecondary, lineHeight: "1.4", letterSpacing: "-0.02em" }}>
                Credit Usage
              </span>
            </div>
            <div className="flex items-baseline gap-1 mb-2">
              <span style={{
                fontFamily: "'Montserrat', sans-serif", fontWeight: 600,
                fontSize: "20px", letterSpacing: "-0.03em", color: t.text, lineHeight: "1.2",
              }}>
                {fmt(data.creditUsed)}
              </span>
              <span style={{ ...TY.bodyR, fontSize: "10px", color: t.textFaint, lineHeight: "1.5" }}>
                / {fmt(data.creditLimit)}
              </span>
            </div>
            <div className="h-1.5 rounded-full overflow-hidden mb-1.5" style={{ background: isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)" }}>
              <motion.div
                className="h-full rounded-full"
                style={{ background: creditWarning ? STATUS.warning : BRAND.green }}
                initial={{ width: 0 }}
                animate={{ width: `${creditPercent}%` }}
                transition={{ duration: 0.6, delay: 0.2 }}
              />
            </div>
            <span style={{ ...TY.bodyR, fontSize: "9px", color: creditWarning ? STATUS.warning : t.textFaint, lineHeight: "1.5" }}>
              {creditPercent.toFixed(0)}% used · Resets {data.billingCycle.toLowerCase()}
            </span>
          </motion.div>


          {/* Separator */}
          <div className="h-px" style={{ background: `linear-gradient(90deg, transparent, ${t.borderSubtle}, transparent)` }} />


          {/* Month Summary */}
          <div>
            <span className="block mb-2.5" style={{
              fontFamily: "'Montserrat', sans-serif", fontWeight: 600,
              fontSize: "10px", letterSpacing: "-0.02em", color: t.textFaint, lineHeight: "1.2",
            }}>
              March 2026
            </span>
            <div className="space-y-2">
              {[
                { label: "Rides", value: `${data.kpis.ridesThisMonth}` },
                { label: "Total Spend", value: fmt(data.kpis.spendThisMonth) },
                { label: "Avg Fare", value: fmt(data.kpis.avgFare) },
                { label: "Service Rating", value: `${data.kpis.avgRating} ★` },
              ].map(item => (
                <div key={item.label} className="flex items-center justify-between">
                  <span style={{ ...TY.bodyR, fontSize: "10px", color: t.textMuted, lineHeight: "1.5" }}>{item.label}</span>
                  <span style={{ ...TY.body, fontSize: "11px", color: t.text, lineHeight: "1.4", letterSpacing: "-0.02em" }}>{item.value}</span>
                </div>
              ))}
            </div>
          </div>


          {/* Separator */}
          <div className="h-px" style={{ background: `linear-gradient(90deg, transparent, ${t.borderSubtle}, transparent)` }} />


          {/* Quick Actions */}
          <div>
            <span className="block mb-2" style={{
              fontFamily: "'Montserrat', sans-serif", fontWeight: 600,
              fontSize: "10px", letterSpacing: "-0.02em", color: t.textFaint, lineHeight: "1.2",
            }}>
              Quick Actions
            </span>
            <div className="space-y-1.5">
              {[
                { icon: Car, label: "Book a ride", onClick: nav("book"), accent: true },
                { icon: Clock, label: "View ride history", onClick: nav("rides"), accent: false },
                { icon: CreditCard, label: "View invoices", onClick: nav("billing"), accent: false },
                { icon: UserPlus, label: "Invite team member", onClick: nav("settings"), accent: false },
              ].map(action => (
                <motion.button
                  key={action.label}
                  className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl cursor-pointer"
                  onClick={action.onClick}
                  style={{
                    border: `1px solid ${action.accent ? `${BRAND.green}14` : (isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)")}`,
                    background: action.accent ? (isDark ? `${BRAND.green}04` : `${BRAND.green}02`) : "transparent",
                    minHeight: 40,
                  }}
                  whileHover={{ borderColor: action.accent ? `${BRAND.green}20` : (isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)") }}
                >
                  <action.icon size={12} style={{ color: action.accent ? BRAND.green : t.textFaint }} />
                  <span style={{ ...TY.body, fontSize: "10px", color: action.accent ? BRAND.green : t.textSecondary, lineHeight: "1.4", letterSpacing: "-0.02em" }}>
                    {action.label}
                  </span>
                </motion.button>
              ))}
            </div>
          </div>

          <div className="h-16" />
        </div>
      </div>
    </div>
  );
}