/**
 * JET ADMIN — ANALYTICS
 * Route: /admin/analytics
 *
 * Cross-platform deep dive analytics.
 * Pattern: Vercel Analytics + Linear Insights.
 */

import React from "react";
import { useState } from "react";
import { motion } from "motion/react";
import {
  BarChart3, TrendingUp, TrendingDown, Users, Car, MapPin,
  Zap, Building2, Truck, Clock, DollarSign, Activity,
  ArrowUpRight, ArrowDownRight, ChevronDown,
} from "lucide-react";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid, PieChart, Pie, Cell,
} from "recharts";
import { useAdminTheme, TY, BRAND, STATUS } from "../config/admin-theme";
import { AdminPageShell } from "../components/admin/ui/admin-page-shell";

/* ─── Mock Data ─── */
const RIDE_TREND = [
  { date: "Mon", rides: 2420, revenue: 4840 },
  { date: "Tue", rides: 2680, revenue: 5360 },
  { date: "Wed", rides: 3100, revenue: 6200 },
  { date: "Thu", rides: 2890, revenue: 5780 },
  { date: "Fri", rides: 3540, revenue: 7080 },
  { date: "Sat", rides: 4120, revenue: 8240 },
  { date: "Sun", rides: 3680, revenue: 7360 },
];

const SUPPLY_DEMAND = [
  { hour: "6a", demand: 120, supply: 80 },
  { hour: "8a", demand: 340, supply: 180 },
  { hour: "10a", demand: 280, supply: 260 },
  { hour: "12p", demand: 220, supply: 240 },
  { hour: "2p", demand: 260, supply: 250 },
  { hour: "4p", demand: 310, supply: 220 },
  { hour: "6p", demand: 420, supply: 260 },
  { hour: "8p", demand: 380, supply: 300 },
  { hour: "10p", demand: 200, supply: 180 },
];

const SOURCE_SPLIT = [
  { name: "Rider-booked", value: 78, color: BRAND.green },
  { name: "Hotel-booked", value: 22, color: STATUS.info },
];

const VEHICLE_SPLIT = [
  { name: "Gas", value: 64, color: "#737373" },
  { name: "EV", value: 36, color: BRAND.green },
];

const GEO_DATA = [
  { state: "Lagos", rides: 12_840, revenue: 25_680, drivers: 2_412, growth: "+12%" },
  { state: "Abuja", rides: 4_230, revenue: 8_460, drivers: 834, growth: "+18%" },
  { state: "Port Harcourt", rides: 1_890, revenue: 3_780, drivers: 412, growth: "+8%" },
  { state: "Kano", rides: 980, revenue: 1_960, drivers: 201, growth: "+24%" },
  { state: "Ibadan", rides: 720, revenue: 1_440, drivers: 156, growth: "+15%" },
];

const COHORT_DATA = [
  { cohort: "Jan '26", w1: 100, w2: 72, w4: 58, w8: 41, w12: 34 },
  { cohort: "Feb '26", w1: 100, w2: 68, w4: 52, w8: 38, w12: null },
  { cohort: "Mar '26", w1: 100, w2: 74, w4: null, w8: null, w12: null },
];

const TABS = ["Overview", "Supply & Demand", "Revenue", "Geographic", "Cohorts"] as const;
type TabKey = typeof TABS[number];

const formatK = (v: number) => v >= 1000 ? `${(v / 1000).toFixed(1)}k` : v.toString();
const formatNaira = (v: number) => `₦${(v / 1000).toFixed(0)}k`;

export function AdminAnalyticsPage() {
  const { t, theme } = useAdminTheme();
  const isDark = theme === "dark";
  const [activeTab, setActiveTab] = useState<TabKey>("Overview");

  const chartText = t.textFaint;
  const chartGrid = isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)";

  return (
    <AdminPageShell title="Analytics" subtitle="Platform intelligence">
      <div className="p-3 md:p-5 max-w-[1400px]">
        {/* Tabs */}
        <div className="flex items-center gap-1 mb-6 overflow-x-auto">
          {TABS.map(tb => (
            <button
              key={tb}
              onClick={() => setActiveTab(tb)}
              className="px-3 h-8 rounded-lg whitespace-nowrap transition-colors"
              style={{ background: activeTab === tb ? t.surfaceActive : "transparent", color: activeTab === tb ? t.text : t.textMuted, ...TY.body, fontSize: "12px" }}
            >
              {tb}
            </button>
          ))}
        </div>

        {activeTab === "Overview" && <OverviewTab t={t} isDark={isDark} chartText={chartText} chartGrid={chartGrid} />}
        {activeTab === "Supply & Demand" && <SupplyDemandTab t={t} isDark={isDark} chartText={chartText} chartGrid={chartGrid} />}
        {activeTab === "Revenue" && <RevenueTab t={t} isDark={isDark} chartText={chartText} chartGrid={chartGrid} />}
        {activeTab === "Geographic" && <GeoTab t={t} isDark={isDark} />}
        {activeTab === "Cohorts" && <CohortTab t={t} isDark={isDark} />}
      </div>
    </AdminPageShell>
  );
}

function OverviewTab({ t, isDark, chartText, chartGrid }: any) {
  const kpis = [
    { label: "Weekly Rides", value: "22,430", delta: "+12.4%", up: true, icon: MapPin, color: BRAND.green, source: "rides.completed.count (7d rolling)" },
    { label: "Gross Revenue", value: "₦44.8M", delta: "+8.2%", up: true, icon: DollarSign, color: STATUS.info, source: "finance.gross_revenue (7d)" },
    { label: "Active Drivers", value: "3,814", delta: "+3.1%", up: true, icon: Car, color: STATUS.warning, source: "drivers.status=online (7d unique)" },
    { label: "Avg ETA", value: "4.2min", delta: "-0.8min", up: true, icon: Clock, color: BRAND.green, source: "rides.avg_eta (7d)" },
    { label: "Cancellation Rate", value: "6.8%", delta: "+0.4%", up: false, icon: Activity, color: STATUS.error, source: "rides.cancelled / rides.requested (7d)" },
    { label: "EV Utilization", value: "73%", delta: "+5%", up: true, icon: Zap, color: BRAND.green, source: "vehicles.ev.hours_active / hours_available (7d)" },
  ];

  return (
    <>
      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
        {kpis.map((kpi, i) => (
          <motion.div
            key={kpi.label}
            className="p-4 rounded-2xl group relative"
            style={{ background: t.surfaceRaised, border: `1px solid ${t.borderSubtle}`, boxShadow: t.shadow }}
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.04 }}
          >
            <div className="flex items-center justify-between mb-2">
              <kpi.icon size={14} style={{ color: kpi.color }} />
              <span className="flex items-center gap-0.5" style={{ ...TY.cap, fontSize: "10px", color: kpi.up ? BRAND.green : STATUS.error }}>
                {kpi.up ? <ArrowUpRight size={10} /> : <ArrowDownRight size={10} />}
                {kpi.delta}
              </span>
            </div>
            <span className="block" style={{ ...TY.h, fontSize: "22px", color: t.text }}>{kpi.value}</span>
            <span className="block" style={{ ...TY.bodyR, fontSize: "10px", color: t.textFaint }}>{kpi.label}</span>
            {/* Data source tooltip */}
            <div className="absolute bottom-1 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <span style={{ ...TY.cap, fontSize: "8px", color: t.textGhost }}>{kpi.source}</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Ride trend chart */}
      <motion.div
        className="rounded-2xl p-5 mb-6"
        style={{ background: t.surfaceRaised, border: `1px solid ${t.borderSubtle}`, boxShadow: t.shadow }}
        initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
      >
        <span className="block mb-4" style={{ ...TY.label, fontSize: "9px", color: t.textFaint, letterSpacing: "0.06em" }}>RIDE VOLUME — THIS WEEK</span>
        <div>
          <ResponsiveContainer width="100%" height={200} minWidth={0}>
            <AreaChart data={RIDE_TREND}>
              <defs>
                <linearGradient id="analytics-rideGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={BRAND.green} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={BRAND.green} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke={chartGrid} strokeDasharray="3 3" />
              <XAxis dataKey="date" tick={{ fill: chartText, fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: chartText, fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={formatK} />
              <Tooltip
                contentStyle={{ background: isDark ? "#1a1a1a" : "#fff", border: `1px solid ${t.borderSubtle}`, borderRadius: 8, fontSize: 11 }}
                labelStyle={{ color: t.textMuted }}
              />
              <Area type="monotone" dataKey="rides" stroke={BRAND.green} fill="url(#analytics-rideGrad)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Source + Vehicle splits */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {[
          { label: "BOOKING SOURCE", data: SOURCE_SPLIT, id: "pie-source" },
          { label: "VEHICLE TYPE", data: VEHICLE_SPLIT, id: "pie-vehicle" },
        ].map((chart, ci) => (
          <motion.div
            key={chart.label}
            className="rounded-2xl p-5"
            style={{ background: t.surfaceRaised, border: `1px solid ${t.borderSubtle}`, boxShadow: t.shadow }}
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 + ci * 0.05 }}
          >
            <span className="block mb-4" style={{ ...TY.label, fontSize: "9px", color: t.textFaint, letterSpacing: "0.06em" }}>{chart.label}</span>
            <div className="flex items-center gap-6">
              <div style={{ width: 100, height: 100 }}>
                <ResponsiveContainer width={100} height={100}>
                  <PieChart id={chart.id}>
                    <Pie data={chart.data} dataKey="value" innerRadius={30} outerRadius={45} paddingAngle={3} strokeWidth={0}>
                      {chart.data.map(entry => (
                        <Cell key={entry.name} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-2">
                {chart.data.map(d => (
                  <div key={d.name} className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full" style={{ background: d.color }} />
                    <span style={{ ...TY.body, fontSize: "12px", color: t.text }}>{d.name}</span>
                    <span style={{ ...TY.bodyR, fontSize: "12px", color: t.textMuted }}>{d.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </>
  );
}

function SupplyDemandTab({ t, isDark, chartText, chartGrid }: any) {
  return (
    <motion.div
      className="rounded-2xl p-5"
      style={{ background: t.surfaceRaised, border: `1px solid ${t.borderSubtle}`, boxShadow: t.shadow }}
      initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex items-center justify-between mb-4">
        <span style={{ ...TY.label, fontSize: "9px", color: t.textFaint, letterSpacing: "0.06em" }}>SUPPLY VS DEMAND — TODAY</span>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full" style={{ background: STATUS.error }} />
            <span style={{ ...TY.bodyR, fontSize: "10px", color: t.textMuted }}>Demand</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full" style={{ background: BRAND.green }} />
            <span style={{ ...TY.bodyR, fontSize: "10px", color: t.textMuted }}>Supply</span>
          </div>
        </div>
      </div>
      <div style={{ height: 300 }}>
        <ResponsiveContainer width="100%" height={300} minWidth={0}>
          <AreaChart data={SUPPLY_DEMAND}>
            <defs>
              <linearGradient id="demandGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={STATUS.error} stopOpacity={0.2} />
                <stop offset="95%" stopColor={STATUS.error} stopOpacity={0} />
              </linearGradient>
              <linearGradient id="supplyGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={BRAND.green} stopOpacity={0.2} />
                <stop offset="95%" stopColor={BRAND.green} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke={chartGrid} strokeDasharray="3 3" />
            <XAxis dataKey="hour" tick={{ fill: chartText, fontSize: 10 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: chartText, fontSize: 10 }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ background: isDark ? "#1a1a1a" : "#fff", border: `1px solid ${t.borderSubtle}`, borderRadius: 8, fontSize: 11 }} />
            <Area type="monotone" dataKey="demand" stroke={STATUS.error} fill="url(#demandGrad)" strokeWidth={2} />
            <Area type="monotone" dataKey="supply" stroke={BRAND.green} fill="url(#supplyGrad)" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div className="grid grid-cols-3 gap-3 mt-4">
        {[
          { label: "Peak Gap", value: "6pm — 160 deficit", color: STATUS.error },
          { label: "Surplus Window", value: "12pm — 20 excess", color: BRAND.green },
          { label: "Balance Score", value: "68/100", color: STATUS.warning },
        ].map(m => (
          <div key={m.label} className="p-3 rounded-xl" style={{ background: t.surface, border: `1px solid ${t.borderSubtle}` }}>
            <span className="block" style={{ ...TY.body, fontSize: "13px", color: m.color }}>{m.value}</span>
            <span style={{ ...TY.bodyR, fontSize: "10px", color: t.textFaint }}>{m.label}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

function RevenueTab({ t, isDark, chartText, chartGrid }: any) {
  return (
    <>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {[
          { label: "Gross Revenue", value: "₦44.8M", delta: "+8.2%", color: t.text },
          { label: "Take Rate", value: "20%", delta: "Stable", color: BRAND.green },
          { label: "ARPU", value: "₦1,840", delta: "+3.1%", color: STATUS.info },
          { label: "LTV (90d)", value: "₦28,400", delta: "+5.8%", color: STATUS.warning },
        ].map((m, i) => (
          <motion.div key={m.label} className="p-4 rounded-2xl" style={{ background: t.surfaceRaised, border: `1px solid ${t.borderSubtle}`, boxShadow: t.shadow }} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.04 }}>
            <span className="block" style={{ ...TY.h, fontSize: "22px", color: m.color }}>{m.value}</span>
            <span className="block" style={{ ...TY.bodyR, fontSize: "10px", color: t.textFaint }}>{m.label}</span>
            <span style={{ ...TY.cap, fontSize: "9px", color: BRAND.green }}>{m.delta}</span>
          </motion.div>
        ))}
      </div>
      <motion.div className="rounded-2xl p-5" style={{ background: t.surfaceRaised, border: `1px solid ${t.borderSubtle}`, boxShadow: t.shadow }} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <span className="block mb-4" style={{ ...TY.label, fontSize: "9px", color: t.textFaint, letterSpacing: "0.06em" }}>DAILY REVENUE — THIS WEEK</span>
        <div style={{ height: 240 }}>
          <ResponsiveContainer width="100%" height={240} minWidth={0}>
            <BarChart data={RIDE_TREND}>
              <CartesianGrid stroke={chartGrid} strokeDasharray="3 3" />
              <XAxis dataKey="date" tick={{ fill: chartText, fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: chartText, fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={(v: number) => `₦${v / 1000}k`} />
              <Tooltip contentStyle={{ background: isDark ? "#1a1a1a" : "#fff", border: `1px solid ${t.borderSubtle}`, borderRadius: 8, fontSize: 11 }} formatter={(v: number) => [`₦${v.toLocaleString()}`, "Revenue"]} />
              <Bar dataKey="revenue" fill={BRAND.green} radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
    </>
  );
}

function GeoTab({ t, isDark }: any) {
  return (
    <>
      <span className="block mb-3" style={{ ...TY.label, fontSize: "9px", color: t.textFaint, letterSpacing: "0.06em" }}>STATE PERFORMANCE</span>
      <div className="rounded-2xl overflow-hidden" style={{ background: t.surfaceRaised, border: `1px solid ${t.borderSubtle}`, boxShadow: t.shadow }}>
        <div className="hidden md:grid grid-cols-[2fr_1fr_1fr_1fr_1fr] gap-2 px-4 h-10 items-center" style={{ borderBottom: `1px solid ${t.borderSubtle}` }}>
          {["State", "Rides (7d)", "Revenue (7d)", "Drivers", "Growth"].map(h => (
            <span key={h} style={{ ...TY.label, fontSize: "9px", color: t.textFaint, letterSpacing: "0.06em" }}>{h}</span>
          ))}
        </div>
        {GEO_DATA.map((row, i) => {
          const maxRides = Math.max(...GEO_DATA.map(r => r.rides));
          return (
            <motion.div
              key={row.state}
              className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr] gap-2 px-4 h-14 items-center"
              style={{ borderBottom: `1px solid ${t.borderSubtle}` }}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 + i * 0.04 }}
            >
              <div className="flex items-center gap-3">
                <MapPin size={14} style={{ color: BRAND.green }} />
                <div>
                  <span className="block" style={{ ...TY.body, fontSize: "13px", color: t.text }}>{row.state}</span>
                  {/* Mini bar */}
                  <div className="w-20 h-1 rounded-full mt-1" style={{ background: t.surfaceActive }}>
                    <div className="h-full rounded-full" style={{ width: `${(row.rides / maxRides) * 100}%`, background: BRAND.green }} />
                  </div>
                </div>
              </div>
              <span style={{ ...TY.body, fontSize: "12px", color: t.text }}>{row.rides.toLocaleString()}</span>
              <span style={{ ...TY.body, fontSize: "12px", color: t.text }}>{formatNaira(row.revenue)}</span>
              <span style={{ ...TY.body, fontSize: "12px", color: t.text }}>{row.drivers.toLocaleString()}</span>
              <span style={{ ...TY.body, fontSize: "12px", color: BRAND.green }}>{row.growth}</span>
            </motion.div>
          );
        })}
      </div>
    </>
  );
}

function CohortTab({ t, isDark }: any) {
  const weeks = ["W1", "W2", "W4", "W8", "W12"];
  const keys = ["w1", "w2", "w4", "w8", "w12"] as const;

  return (
    <>
      <span className="block mb-3" style={{ ...TY.label, fontSize: "9px", color: t.textFaint, letterSpacing: "0.06em" }}>RIDER RETENTION COHORTS</span>
      <div className="rounded-2xl overflow-hidden" style={{ background: t.surfaceRaised, border: `1px solid ${t.borderSubtle}`, boxShadow: t.shadow }}>
        <div className="grid gap-0" style={{ gridTemplateColumns: `1fr ${weeks.map(() => "1fr").join(" ")}` }}>
          {/* Header */}
          <div className="px-4 h-10 flex items-center" style={{ borderBottom: `1px solid ${t.borderSubtle}`, borderRight: `1px solid ${t.borderSubtle}` }}>
            <span style={{ ...TY.label, fontSize: "9px", color: t.textFaint, letterSpacing: "0.06em" }}>COHORT</span>
          </div>
          {weeks.map(w => (
            <div key={w} className="px-3 h-10 flex items-center justify-center" style={{ borderBottom: `1px solid ${t.borderSubtle}`, borderRight: `1px solid ${t.borderSubtle}` }}>
              <span style={{ ...TY.label, fontSize: "9px", color: t.textFaint, letterSpacing: "0.06em" }}>{w}</span>
            </div>
          ))}
          {/* Rows */}
          {COHORT_DATA.map((row, ri) => (
            <React.Fragment key={row.cohort}>
              <div className="px-4 h-12 flex items-center" style={{ borderBottom: `1px solid ${t.borderSubtle}`, borderRight: `1px solid ${t.borderSubtle}` }}>
                <span style={{ ...TY.body, fontSize: "12px", color: t.text }}>{row.cohort}</span>
              </div>
              {keys.map(k => {
                const val = row[k];
                const opacity = val != null ? Math.max(0.15, val / 100) : 0;
                return (
                  <div key={`${row.cohort}-${k}`} className="h-12 flex items-center justify-center" style={{ borderBottom: `1px solid ${t.borderSubtle}`, borderRight: `1px solid ${t.borderSubtle}`, background: val != null ? `${BRAND.green}${Math.round(opacity * 255).toString(16).padStart(2, "0")}` : "transparent" }}>
                    <span style={{ ...TY.body, fontSize: "12px", color: val != null ? (val > 60 ? "#fff" : t.text) : t.textGhost }}>
                      {val != null ? `${val}%` : "—"}
                    </span>
                  </div>
                );
              })}
            </React.Fragment>
          ))}
        </div>
      </div>
      <div className="mt-4 p-3 rounded-xl" style={{ background: t.surface, border: `1px solid ${t.borderSubtle}` }}>
        <span style={{ ...TY.bodyR, fontSize: "11px", color: t.textMuted, lineHeight: "1.5" }}>
          Data source: <code style={{ fontSize: "10px", color: BRAND.green }}>riders.cohort_retention</code> — Percentage of riders who completed at least one ride in each time window after signup.
        </span>
      </div>
    </>
  );
}