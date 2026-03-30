/**
 * JET ADMIN — RIDERS SURFACE
 *
 * ROOT: Queue (left 380px) + empty state (right flex)
 * DETAIL: Queue stays visible → full rider profile (right flex)
 *
 * Surfaces wired:
 *   View Profile → SPLIT PANE (dispute pattern — queue stays visible)
 *   Issue Credit → CENTER MODAL (financial impact)
 *   Suspend Account → CENTER MODAL (destructive, high-friction)
 *   Contact Rider → SIDE DRAWER (low-friction, contextual)
 *   View Linked Disputes → cross-link to /admin/disputes
 *
 * Pattern: Linear issues list → detail, Stripe customers
 */

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Users, Search, ChevronRight, ArrowLeft,
  Star, MapPin, Phone, Mail, CreditCard,
  AlertTriangle, Ban, CheckCircle2, Wallet,
  Clock, Filter, ArrowUpRight, ArrowDownRight,
  Scale, Activity, Send, X, Plus, ExternalLink,
  User, Zap, Tag, FileText, MessageSquare, RefreshCcw,
} from "lucide-react";
import { useAdminTheme, TY, BRAND, STATUS } from "../../../config/admin-theme";
import {
  RIDERS, RIDER_KPI, RIDER_STATUS_META, formatNaira,
  type Rider, type RiderStatus,
} from "../../../config/riders-mock-data";
import { AdminModal, AdminDrawer, ModalHeader, ModalFooter, SurfaceButton } from "../ui/surfaces";
import { ProfileDrawer, type ProfileData } from "../ui/profile-drawer";

/* ═══ Priority colors for tags ═══ */
const TAG_COLORS: Record<string, string> = {
  "loyal": "#1DB954",
  "high-value": "#3B82F6",
  "corporate": "#8B5CF6",
  "low-cancel": "#1DB954",
  "new-user": "#3B82F6",
  "high-cancel": "#F59E0B",
  "frequent-disputer": "#D4183D",
  "review-needed": "#F97316",
  "suspended": "#D4183D",
  "abuse-risk": "#D4183D",
  "churned": "#737373",
};

export function AdminRidersPage() {
  const { theme, t } = useAdminTheme();
  const isDark = theme === "dark";
  const [selected, setSelected] = useState<Rider | null>(null);
  const [filterStatus, setFilterStatus] = useState<RiderStatus | "all">("all");
  const [filterCity, setFilterCity] = useState<string>("all");
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Surface states
  const [showCreditModal, setShowCreditModal] = useState(false);
  const [showSuspendModal, setShowSuspendModal] = useState(false);
  const [showContactDrawer, setShowContactDrawer] = useState(false);
  const [creditAmount, setCreditAmount] = useState("");
  const [suspendReason, setSuspendReason] = useState("");

  const hasActiveFilters = filterStatus !== "all" || filterCity !== "all";
  const activeFilterCount = (filterStatus !== "all" ? 1 : 0) + (filterCity !== "all" ? 1 : 0);

  const filtered = useMemo(() => {
    let list = RIDERS;
    if (filterStatus !== "all") list = list.filter(r => r.status === filterStatus);
    if (filterCity !== "all") list = list.filter(r => r.city === filterCity);
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      list = list.filter(r =>
        r.name.toLowerCase().includes(q) ||
        r.phone.includes(q) ||
        r.email.toLowerCase().includes(q) ||
        r.id.toLowerCase().includes(q)
      );
    }
    return list;
  }, [filterStatus, filterCity, searchQuery]);

  const cities = [...new Set(RIDERS.map(r => r.city))];
  const urgentCount = RIDERS.filter(r => r.status === "flagged" || r.status === "suspended").length;

  return (
    <div className="flex h-full overflow-hidden">
      <AnimatePresence mode="wait">
        {!selected ? (
          /* ═══════════════════════════════════════════════════════════════
             ROOT VIEW — Queue (left) + Empty state (right)
             ═══════════════════════════════════════════════════════════════ */
          <motion.div
            key="root"
            className="flex-1 flex min-h-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, x: -16 }}
            transition={{ duration: 0.18 }}
          >
            {/* ─── LEFT: RIDER QUEUE ─── */}
            <div
              className="w-full md:w-[380px] shrink-0 flex flex-col overflow-hidden"
              style={{ background: t.overlay, borderRight: `1px solid ${t.border}` }}
            >
              {/* Header */}
              <div className="shrink-0 flex flex-col gap-3 px-4 pt-3 pb-3" style={{ borderBottom: `1px solid ${t.borderSubtle}` }}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 600, fontSize: "13px", lineHeight: "1.3", letterSpacing: "-0.03em", color: t.text }}>
                      Riders
                    </span>
                    <span style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 400, fontSize: "11px", letterSpacing: "-0.02em", color: t.textMuted }}>
                      {filtered.length} riders · {urgentCount} need attention
                    </span>
                  </div>
                </div>

                {/* Search */}
                <div
                  className="flex items-center gap-2 h-8 px-3 rounded-lg"
                  style={{
                    background: isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.03)",
                    border: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}`,
                  }}
                >
                  <Search size={12} style={{ color: t.textFaint }} />
                  <input
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder="Search by name, phone, email…"
                    className="flex-1 bg-transparent outline-none"
                    style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 400, fontSize: "12px", letterSpacing: "-0.02em", color: t.text }}
                  />
                </div>

                {/* Filter toolbar */}
                <div className="relative">
                  <div className="flex items-center gap-2">
                    <button
                      className="h-8 px-3 rounded-lg flex items-center gap-2 transition-all"
                      style={{
                        background: hasActiveFilters ? (isDark ? "rgba(29,185,84,0.08)" : "rgba(29,185,84,0.06)") : (isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.03)"),
                        border: `1px solid ${hasActiveFilters ? (isDark ? "rgba(29,185,84,0.2)" : "rgba(29,185,84,0.15)") : (isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)")}`,
                      }}
                      onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                    >
                      <Filter size={12} style={{ color: hasActiveFilters ? BRAND.green : t.textMuted }} />
                      <span style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 500, fontSize: "11px", lineHeight: "1.4", letterSpacing: "-0.02em", color: hasActiveFilters ? t.text : t.textMuted }}>
                        Filter
                      </span>
                      {hasActiveFilters && (
                        <span className="flex items-center justify-center rounded-full" style={{ width: 16, height: 16, fontFamily: "'Manrope', sans-serif", fontWeight: 600, fontSize: "9px", color: "#FFFFFF", background: BRAND.green }}>
                          {activeFilterCount}
                        </span>
                      )}
                      <ChevronRight size={10} style={{ color: t.textGhost, transform: showFilterDropdown ? "rotate(90deg)" : "none", transition: "transform 0.15s ease" }} />
                    </button>

                    {/* Inline filter tags */}
                    {hasActiveFilters && !showFilterDropdown && (
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {filterStatus !== "all" && (
                          <span className="inline-flex items-center gap-1 h-6 px-2 rounded-md" style={{ background: `${RIDER_STATUS_META[filterStatus].color}15`, border: `1px solid ${RIDER_STATUS_META[filterStatus].color}20` }}>
                            <span style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 500, fontSize: "10px", letterSpacing: "-0.02em", color: RIDER_STATUS_META[filterStatus].color }}>
                              {RIDER_STATUS_META[filterStatus].label}
                            </span>
                            <button onClick={e => { e.stopPropagation(); setFilterStatus("all"); }} style={{ fontSize: "12px", color: RIDER_STATUS_META[filterStatus].color, opacity: 0.5, lineHeight: 1 }}>×</button>
                          </span>
                        )}
                        {filterCity !== "all" && (
                          <span className="inline-flex items-center gap-1 h-6 px-2 rounded-md" style={{ background: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)", border: `1px solid ${isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.08)"}` }}>
                            <span style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 500, fontSize: "10px", letterSpacing: "-0.02em", color: t.text }}>{filterCity}</span>
                            <button onClick={e => { e.stopPropagation(); setFilterCity("all"); }} style={{ fontSize: "12px", color: t.textMuted, lineHeight: 1 }}>×</button>
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Filter dropdown */}
                  <AnimatePresence>
                    {showFilterDropdown && (
                      <>
                        <div className="fixed inset-0 z-40" onClick={() => setShowFilterDropdown(false)} />
                        <motion.div
                          className="absolute left-0 top-full mt-1 z-50 rounded-xl overflow-hidden overflow-y-auto"
                          style={{
                            width: 224, maxHeight: 420,
                            background: isDark ? "#1A1A1C" : "#FFFFFF",
                            border: `1px solid ${isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)"}`,
                            boxShadow: isDark ? "0 12px 48px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.04)" : "0 12px 48px rgba(0,0,0,0.12), 0 0 0 1px rgba(0,0,0,0.03)",
                          }}
                          initial={{ opacity: 0, y: -4, scale: 0.97 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -4, scale: 0.97 }}
                          transition={{ duration: 0.12 }}
                        >
                          {/* Status */}
                          <div className="px-3 pt-2.5 pb-1">
                            <span style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 600, fontSize: "9px", letterSpacing: "0.05em", textTransform: "uppercase" as const, color: t.textFaint }}>Status</span>
                          </div>
                          {(["all", "active", "flagged", "suspended", "new", "churned"] as const).map(s => {
                            const isActive = filterStatus === s;
                            const meta = s !== "all" ? RIDER_STATUS_META[s] : null;
                            const count = s === "all" ? RIDERS.length : RIDERS.filter(r => r.status === s).length;
                            return (
                              <button
                                key={s}
                                className="w-full flex items-center gap-2.5 px-3 py-[7px] transition-colors text-left"
                                style={{ background: isActive ? (isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.03)") : "transparent" }}
                                onClick={() => setFilterStatus(s)}
                                onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)"; }}
                                onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = "transparent"; }}
                              >
                                <div className="w-4 h-4 flex items-center justify-center shrink-0">
                                  {isActive ? <CheckCircle2 size={13} style={{ color: meta ? meta.color : BRAND.green }} /> : <div className="w-3.5 h-3.5 rounded-full" style={{ border: `1.5px solid ${isDark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.15)"}` }} />}
                                </div>
                                {meta && <span className="w-1.5 h-1.5 rounded-full" style={{ background: meta.color }} />}
                                <span className="flex-1" style={{ fontFamily: "'Manrope', sans-serif", fontWeight: isActive ? 500 : 400, fontSize: "12px", letterSpacing: "-0.02em", color: isActive ? t.text : t.textSecondary }}>
                                  {s === "all" ? "All statuses" : meta!.label}
                                </span>
                                <span style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 500, fontSize: "10px", color: t.textFaint }}>{count}</span>
                              </button>
                            );
                          })}

                          <div className="mx-3 my-1" style={{ height: 1, background: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)" }} />

                          {/* City */}
                          <div className="px-3 pt-1.5 pb-1">
                            <span style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 600, fontSize: "9px", letterSpacing: "0.05em", textTransform: "uppercase" as const, color: t.textFaint }}>City</span>
                          </div>
                          {["all", ...cities].map(c => {
                            const isActive = filterCity === c;
                            const count = c === "all" ? RIDERS.length : RIDERS.filter(r => r.city === c).length;
                            return (
                              <button
                                key={c}
                                className="w-full flex items-center gap-2.5 px-3 py-[7px] transition-colors text-left"
                                style={{ background: isActive ? (isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.03)") : "transparent" }}
                                onClick={() => setFilterCity(c)}
                                onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)"; }}
                                onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = "transparent"; }}
                              >
                                <div className="w-4 h-4 flex items-center justify-center shrink-0">
                                  {isActive ? <CheckCircle2 size={13} style={{ color: BRAND.green }} /> : <div className="w-3.5 h-3.5 rounded-full" style={{ border: `1.5px solid ${isDark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.15)"}` }} />}
                                </div>
                                <MapPin size={11} style={{ color: isActive ? BRAND.green : t.textMuted }} />
                                <span className="flex-1" style={{ fontFamily: "'Manrope', sans-serif", fontWeight: isActive ? 500 : 400, fontSize: "12px", letterSpacing: "-0.02em", color: isActive ? t.text : t.textSecondary }}>
                                  {c === "all" ? "All cities" : c}
                                </span>
                                <span style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 500, fontSize: "10px", color: t.textFaint }}>{count}</span>
                              </button>
                            );
                          })}

                          {hasActiveFilters && (
                            <>
                              <div className="mx-3 my-1" style={{ height: 1, background: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)" }} />
                              <button
                                className="w-full flex items-center gap-2 px-3 py-2 transition-colors text-left"
                                style={{ color: STATUS.error }}
                                onClick={() => { setFilterStatus("all"); setFilterCity("all"); setShowFilterDropdown(false); }}
                                onMouseEnter={e => { e.currentTarget.style.background = isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)"; }}
                                onMouseLeave={e => { e.currentTarget.style.background = "transparent"; }}
                              >
                                <span style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 500, fontSize: "11px", letterSpacing: "-0.02em" }}>Clear all filters</span>
                              </button>
                            </>
                          )}
                          <div className="h-1" />
                        </motion.div>
                      </>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Queue list */}
              <div className="flex-1 overflow-y-auto scrollbar-hide">
                {filtered.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3" style={{ background: isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)", border: `1px solid ${isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.04)"}` }}>
                      <Users size={16} style={{ color: t.textFaint }} />
                    </div>
                    <span className="block mb-1" style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 600, fontSize: "12px", letterSpacing: "-0.02em", color: t.textSecondary }}>No riders match</span>
                    <span className="block mb-4" style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 400, fontSize: "11px", lineHeight: "1.5", letterSpacing: "-0.02em", color: t.textMuted }}>Try adjusting your search or filters</span>
                    <button
                      className="h-8 px-4 rounded-lg transition-opacity hover:opacity-80"
                      style={{ background: isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.03)", border: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)"}` }}
                      onClick={() => { setFilterStatus("all"); setFilterCity("all"); setSearchQuery(""); }}
                    >
                      <span style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 500, fontSize: "11px", letterSpacing: "-0.02em", color: t.textMuted }}>Clear filters</span>
                    </button>
                  </div>
                )}
                {filtered.map((rider, i) => {
                  const sm = RIDER_STATUS_META[rider.status];
                  const initials = rider.name.split(" ").map(w => w[0]).join("").slice(0, 2);
                  const hasOpenDisputes = rider.disputes.some(d => d.status === "open");

                  return (
                    <motion.button
                      key={rider.id}
                      className="w-full flex items-center gap-3 px-4 py-3 text-left transition-colors"
                      style={{ borderBottom: `1px solid ${t.borderSubtle}`, background: selected?.id === rider.id ? t.surfaceActive : "transparent" }}
                      onClick={() => setSelected(rider)}
                      onMouseEnter={e => { if (selected?.id !== rider.id) e.currentTarget.style.background = isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)"; }}
                      onMouseLeave={e => { if (selected?.id !== rider.id) e.currentTarget.style.background = "transparent"; }}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.05 + i * 0.02 }}
                    >
                      {/* Avatar */}
                      <div className="relative shrink-0">
                        <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: `${sm.color}15` }}>
                          <span style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 600, fontSize: "11px", color: sm.color }}>{initials}</span>
                        </div>
                        {/* Status dot */}
                        <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full flex items-center justify-center" style={{ background: t.overlay }}>
                          <span className="relative inline-flex items-center justify-center" style={{ width: 8, height: 8 }}>
                            {sm.dotPulse && (
                              <motion.span className="absolute rounded-full" style={{ width: 10, height: 10, background: sm.color, opacity: 0.3 }} animate={{ scale: [1, 1.8, 1], opacity: [0.3, 0, 0.3] }} transition={{ duration: 2, repeat: Infinity }} />
                            )}
                            <span className="rounded-full" style={{ width: 6, height: 6, background: sm.color }} />
                          </span>
                        </span>
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="truncate" style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 500, fontSize: "13px", letterSpacing: "-0.02em", color: t.text }}>{rider.name}</span>
                          {hasOpenDisputes && <AlertTriangle size={10} style={{ color: STATUS.warning, flexShrink: 0 }} />}
                        </div>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 400, fontSize: "10px", letterSpacing: "-0.02em", color: t.textMuted }}>
                            {rider.city} · {rider.zone}
                          </span>
                          <span style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 400, fontSize: "10px", color: t.textGhost }}>·</span>
                          <span style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 400, fontSize: "10px", color: t.textFaint }}>
                            {rider.totalTrips} trips
                          </span>
                        </div>
                      </div>

                      {/* Right meta */}
                      <div className="flex flex-col items-end gap-1 shrink-0">
                        <span style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 400, fontSize: "10px", color: t.textFaint }}>{rider.lastActive}</span>
                        <div className="flex items-center gap-1">
                          <Star size={9} style={{ color: "#F59E0B", fill: "#F59E0B" }} />
                          <span style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 500, fontSize: "10px", color: t.textMuted }}>{rider.rating.toFixed(1)}</span>
                        </div>
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* ─── RIGHT: EMPTY STATE ─── */}
            <div className="hidden md:flex flex-1 flex-col items-center justify-center" style={{ background: t.bg }}>
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4" style={{ background: isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)", border: `1px solid ${isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)"}` }}>
                <Users size={20} style={{ color: t.textFaint }} />
              </div>
              <span className="block mb-1" style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 600, fontSize: "14px", letterSpacing: "-0.02em", color: t.textSecondary }}>Select a rider</span>
              <span style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 400, fontSize: "12px", letterSpacing: "-0.02em", color: t.textMuted }}>Choose from the queue to view full profile</span>

              {/* Quick KPIs */}
              <div className="grid grid-cols-3 gap-3 mt-8 max-w-md">
                {[
                  { label: "Total Riders", value: RIDER_KPI.total.toLocaleString(), delta: `+${RIDER_KPI.newThisWeek} this week`, up: true, source: RIDER_KPI.sources.total },
                  { label: "Active (30d)", value: RIDER_KPI.active30d.toLocaleString(), delta: `${((RIDER_KPI.active30d / RIDER_KPI.total) * 100).toFixed(1)}% of total`, up: true, source: RIDER_KPI.sources.active30d },
                  { label: "Avg Rating", value: RIDER_KPI.avgRating.toFixed(1), delta: "By drivers", up: true, source: RIDER_KPI.sources.avgRating },
                ].map((kpi, i) => (
                  <motion.div
                    key={kpi.label}
                    className="p-3 rounded-xl group relative"
                    style={{ background: t.surfaceRaised, border: `1px solid ${t.borderSubtle}`, boxShadow: t.shadow }}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + i * 0.06 }}
                  >
                    <span className="block" style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 600, fontSize: "18px", letterSpacing: "-0.03em", lineHeight: "1.2", color: t.text }}>{kpi.value}</span>
                    <span className="block mt-0.5" style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 400, fontSize: "10px", letterSpacing: "-0.02em", color: t.textFaint }}>{kpi.label}</span>
                    <span style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 400, fontSize: "9px", color: BRAND.green }}>{kpi.delta}</span>
                    <div className="absolute bottom-1 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <span style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 400, fontSize: "7px", color: t.textGhost }}>{kpi.source}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        ) : (
          /* ═══════════════════════════════════════════════════════════════
             DETAIL VIEW — Queue (left, compressed) + Rider profile (right)
             ═══════════════════════════════════════════════════════════════ */
          <motion.div
            key="detail"
            className="flex-1 flex min-h-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, x: 16 }}
            transition={{ duration: 0.18 }}
          >
            {/* ─── LEFT: COMPRESSED QUEUE ─── */}
            <div
              className="hidden md:flex w-[280px] shrink-0 flex-col overflow-hidden"
              style={{ background: t.overlay, borderRight: `1px solid ${t.border}` }}
            >
              <div className="shrink-0 flex items-center gap-2 px-3 h-10" style={{ borderBottom: `1px solid ${t.borderSubtle}` }}>
                <button onClick={() => setSelected(null)} className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: t.surfaceHover }}>
                  <ArrowLeft size={13} style={{ color: t.icon }} />
                </button>
                <span style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 500, fontSize: "11px", letterSpacing: "-0.02em", color: t.textMuted }}>
                  {filtered.length} riders
                </span>
              </div>
              <div className="flex-1 overflow-y-auto scrollbar-hide">
                {filtered.map(rider => {
                  const sm = RIDER_STATUS_META[rider.status];
                  const initials = rider.name.split(" ").map(w => w[0]).join("").slice(0, 2);
                  return (
                    <button
                      key={rider.id}
                      className="w-full flex items-center gap-2.5 px-3 py-2.5 text-left transition-colors"
                      style={{ borderBottom: `1px solid ${t.borderSubtle}`, background: selected.id === rider.id ? t.surfaceActive : "transparent" }}
                      onClick={() => setSelected(rider)}
                      onMouseEnter={e => { if (selected.id !== rider.id) e.currentTarget.style.background = isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)"; }}
                      onMouseLeave={e => { if (selected.id !== rider.id) e.currentTarget.style.background = "transparent"; }}
                    >
                      <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0" style={{ background: `${sm.color}15` }}>
                        <span style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 600, fontSize: "9px", color: sm.color }}>{initials}</span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <span className="block truncate" style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 500, fontSize: "11px", letterSpacing: "-0.02em", color: t.text }}>{rider.name}</span>
                        <span style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 400, fontSize: "9px", color: t.textFaint }}>{rider.lastActive}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* ─── RIGHT: FULL PROFILE ─── */}
            <div className="flex-1 flex flex-col overflow-hidden" style={{ background: t.bg }}>
              <RiderDetail
                rider={selected}
                onBack={() => setSelected(null)}
                onContact={() => setShowContactDrawer(true)}
                onIssueCredit={() => setShowCreditModal(true)}
                onSuspend={() => setShowSuspendModal(true)}
                isDark={isDark}
                t={t}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── CONTACT DRAWER ─── */}
      <AdminDrawer
        open={showContactDrawer}
        onClose={() => setShowContactDrawer(false)}
        title="Contact Rider"
        subtitle={selected?.name}
      >
        {selected && <ContactContent rider={selected} onSend={() => setShowContactDrawer(false)} />}
      </AdminDrawer>

      {/* ─── ISSUE CREDIT MODAL ─── */}
      <AdminModal open={showCreditModal} onClose={() => setShowCreditModal(false)} width={440}>
        {selected && (
          <div>
            <ModalHeader
              title="Issue Ride Credit"
              subtitle={`${selected.name} · ${selected.id}`}
              onClose={() => setShowCreditModal(false)}
              icon={<Wallet size={16} style={{ color: BRAND.green }} />}
              accentColor={BRAND.green}
            />
            <div className="px-6 py-5 space-y-4">
              <div>
                <span className="block mb-1.5" style={{ ...TY.label, fontSize: "9px", color: "#7D7D7D", letterSpacing: "0.06em" }}>CREDIT AMOUNT</span>
                <div className="flex items-center gap-2 h-11 px-3 rounded-xl" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
                  <span style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 600, fontSize: "14px", color: BRAND.green }}>₦</span>
                  <input
                    value={creditAmount}
                    onChange={e => setCreditAmount(e.target.value.replace(/[^0-9]/g, ""))}
                    placeholder="0"
                    className="flex-1 bg-transparent outline-none"
                    style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 600, fontSize: "18px", letterSpacing: "-0.03em", color: "white" }}
                  />
                </div>
              </div>
              <div>
                <span className="block mb-1.5" style={{ ...TY.label, fontSize: "9px", color: "#7D7D7D", letterSpacing: "0.06em" }}>REASON</span>
                <select className="w-full h-10 px-3 rounded-xl bg-transparent outline-none" style={{ border: "1px solid rgba(255,255,255,0.08)", fontFamily: "'Manrope', sans-serif", fontSize: "12px", color: "white" }}>
                  <option value="">Select reason…</option>
                  <option value="dispute_resolution">Dispute resolution</option>
                  <option value="service_recovery">Service recovery</option>
                  <option value="promo">Promotional credit</option>
                  <option value="goodwill">Goodwill gesture</option>
                </select>
              </div>
              <div className="rounded-xl p-3" style={{ background: `${BRAND.green}08`, border: `1px solid ${BRAND.green}15` }}>
                <span style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 400, fontSize: "11px", lineHeight: "1.5", color: BRAND.green }}>
                  Credit will be added to rider's JET Wallet and can be used on their next ride. This action is logged in the audit trail.
                </span>
              </div>
            </div>
            <ModalFooter>
              <SurfaceButton label="Cancel" variant="ghost" onClick={() => setShowCreditModal(false)} />
              <SurfaceButton label={`Issue ₦${creditAmount || "0"} Credit`} variant="primary" icon={<Wallet size={13} />} onClick={() => { setShowCreditModal(false); setCreditAmount(""); }} />
            </ModalFooter>
          </div>
        )}
      </AdminModal>

      {/* ─── SUSPEND MODAL ─── */}
      <AdminModal open={showSuspendModal} onClose={() => setShowSuspendModal(false)} width={480} danger persistent>
        {selected && (
          <div>
            <ModalHeader
              title={selected.status === "suspended" ? "Reactivate Account" : "Suspend Account"}
              subtitle={`${selected.name} · ${selected.id}`}
              onClose={() => setShowSuspendModal(false)}
              icon={<Ban size={16} style={{ color: selected.status === "suspended" ? BRAND.green : STATUS.error }} />}
              accentColor={selected.status === "suspended" ? BRAND.green : STATUS.error}
            />
            <div className="px-6 py-5 space-y-4">
              {selected.status !== "suspended" ? (
                <>
                  <div className="rounded-xl p-3" style={{ background: `${STATUS.error}08`, border: `1px solid ${STATUS.error}15` }}>
                    <span style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 400, fontSize: "11px", lineHeight: "1.5", color: STATUS.error }}>
                      Suspending this account will immediately prevent the rider from booking any rides. Active rides will be allowed to complete.
                    </span>
                  </div>
                  <div>
                    <span className="block mb-1.5" style={{ ...TY.label, fontSize: "9px", color: "#7D7D7D", letterSpacing: "0.06em" }}>REASON</span>
                    <textarea
                      value={suspendReason}
                      onChange={e => setSuspendReason(e.target.value)}
                      placeholder="Describe the reason for suspension…"
                      rows={3}
                      className="w-full px-3 py-2.5 rounded-xl bg-transparent outline-none resize-none"
                      style={{ border: "1px solid rgba(255,255,255,0.08)", fontFamily: "'Manrope', sans-serif", fontSize: "12px", lineHeight: "1.5", color: "white" }}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { label: "Total Trips", value: selected.totalTrips.toString() },
                      { label: "Cancel Rate", value: `${selected.cancelRate}%` },
                      { label: "Open Disputes", value: selected.disputes.filter(d => d.status === "open").length.toString() },
                      { label: "Total Spend", value: formatNaira(selected.totalSpend) },
                    ].map(m => (
                      <div key={m.label} className="rounded-lg p-2.5" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
                        <span className="block" style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 600, fontSize: "14px", letterSpacing: "-0.03em", color: "white" }}>{m.value}</span>
                        <span style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 400, fontSize: "9px", color: "#7D7D7D" }}>{m.label}</span>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="rounded-xl p-3" style={{ background: `${BRAND.green}08`, border: `1px solid ${BRAND.green}15` }}>
                  <span style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 400, fontSize: "11px", lineHeight: "1.5", color: BRAND.green }}>
                    Reactivating this account will restore the rider's ability to book rides. Any wallet balance will remain intact.
                  </span>
                </div>
              )}
            </div>
            <ModalFooter>
              <SurfaceButton label="Cancel" variant="ghost" onClick={() => { setShowSuspendModal(false); setSuspendReason(""); }} />
              <SurfaceButton
                label={selected.status === "suspended" ? "Reactivate Account" : "Suspend Account"}
                variant={selected.status === "suspended" ? "primary" : "danger"}
                icon={selected.status === "suspended" ? <RefreshCcw size={13} /> : <Ban size={13} />}
                onClick={() => { setShowSuspendModal(false); setSuspendReason(""); }}
              />
            </ModalFooter>
          </div>
        )}
      </AdminModal>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   RIDER DETAIL — Full profile view
   ═══════════════════════════════════════════════════════════════════════════ */

function RiderDetail({
  rider, onBack, onContact, onIssueCredit, onSuspend, isDark, t,
}: {
  rider: Rider; onBack: () => void; onContact: () => void;
  onIssueCredit: () => void; onSuspend: () => void;
  isDark: boolean; t: any;
}) {
  const sm = RIDER_STATUS_META[rider.status];
  const initials = rider.name.split(" ").map(w => w[0]).join("").slice(0, 2);

  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 shrink-0" style={{ borderBottom: `1px solid ${t.border}` }}>
        <div className="flex items-center gap-2.5">
          <button onClick={onBack} className="md:hidden w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: t.surfaceHover }}>
            <ArrowLeft size={13} style={{ color: t.icon }} />
          </button>
          <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: `${sm.color}15` }}>
            <span style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 600, fontSize: "11px", color: sm.color }}>{initials}</span>
          </div>
          <div>
            <span style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 600, fontSize: "13px", letterSpacing: "-0.03em", lineHeight: "1.3", color: t.text }}>{rider.name}</span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: sm.color }} />
              <span style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 400, fontSize: "10px", color: sm.color }}>{sm.label}</span>
              <span style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 400, fontSize: "10px", color: t.textGhost }}>·</span>
              <span style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 400, fontSize: "10px", color: t.textFaint }}>{rider.id}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <button onClick={onContact} className="h-8 px-3 rounded-lg flex items-center gap-1.5 transition-colors" style={{ background: isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.03)", border: `1px solid ${isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)"}` }}>
            <MessageSquare size={12} style={{ color: t.textMuted }} />
            <span style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 500, fontSize: "11px", color: t.textMuted }}>Contact</span>
          </button>
        </div>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {/* Contact info */}
        <div className="rounded-xl p-3" style={{ background: t.surface, border: `1px solid ${t.borderSubtle}` }}>
          <div className="flex items-center gap-2 mb-2">
            <Phone size={11} style={{ color: t.iconMuted }} />
            <span style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 400, fontSize: "12px", letterSpacing: "-0.02em", color: t.text }}>{rider.phone}</span>
          </div>
          <div className="flex items-center gap-2 mb-2">
            <Mail size={11} style={{ color: t.iconMuted }} />
            <span style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 400, fontSize: "12px", letterSpacing: "-0.02em", color: t.text }}>{rider.email}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin size={11} style={{ color: t.iconMuted }} />
            <span style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 400, fontSize: "12px", letterSpacing: "-0.02em", color: t.text }}>{rider.city} — {rider.zone}</span>
          </div>
          <div className="flex items-center gap-2 mt-2">
            <Clock size={11} style={{ color: t.iconMuted }} />
            <span style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 400, fontSize: "12px", letterSpacing: "-0.02em", color: t.textFaint }}>Joined {rider.joinDate} · Last active {rider.lastActive}</span>
          </div>
        </div>

        {/* Metrics grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {[
            { label: "Trips", value: rider.totalTrips.toString(), color: t.text, source: "rides.rider_id.count" },
            { label: "Spend", value: formatNaira(rider.totalSpend), color: BRAND.green, source: "rides.rider_id.sum(fare)" },
            { label: "Rating", value: rider.rating.toFixed(1), color: "#F59E0B", source: "rides.avg(rider_rating)" },
            { label: "Cancel", value: `${rider.cancelRate}%`, color: rider.cancelRate > 10 ? STATUS.error : rider.cancelRate > 5 ? STATUS.warning : t.textMuted, source: "rides.cancelled / rides.requested" },
          ].map(m => (
            <div key={m.label} className="p-3 rounded-xl group relative" style={{ background: t.surface, border: `1px solid ${t.borderSubtle}` }}>
              <span className="block" style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 600, fontSize: "18px", letterSpacing: "-0.03em", lineHeight: "1.2", color: m.color }}>{m.value}</span>
              <span style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 400, fontSize: "10px", letterSpacing: "-0.02em", color: t.textFaint }}>{m.label}</span>
              <div className="absolute bottom-0.5 right-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                <span style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 400, fontSize: "7px", color: t.textGhost }}>{m.source}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Tags */}
        {rider.tags.length > 0 && (
          <div className="flex items-center gap-1.5 flex-wrap">
            {rider.tags.map(tag => (
              <span key={tag} className="inline-flex items-center gap-1 h-6 px-2 rounded-md" style={{ background: `${TAG_COLORS[tag] || "#737373"}12`, border: `1px solid ${TAG_COLORS[tag] || "#737373"}20` }}>
                <Tag size={8} style={{ color: TAG_COLORS[tag] || "#737373" }} />
                <span style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 500, fontSize: "10px", letterSpacing: "-0.02em", color: TAG_COLORS[tag] || "#737373" }}>{tag}</span>
              </span>
            ))}
          </div>
        )}

        {/* Notes / warnings */}
        {rider.notes.length > 0 && (
          <div className="rounded-xl p-3" style={{ background: `${STATUS.warning}06`, border: `1px solid ${STATUS.warning}12` }}>
            <div className="flex items-center gap-1.5 mb-1.5">
              <AlertTriangle size={11} style={{ color: STATUS.warning }} />
              <span style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 600, fontSize: "9px", letterSpacing: "0.05em", textTransform: "uppercase" as const, color: STATUS.warning }}>Admin Notes</span>
            </div>
            {rider.notes.map((note, i) => (
              <span key={i} className="block" style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 400, fontSize: "11px", lineHeight: "1.5", letterSpacing: "-0.02em", color: t.text }}>• {note}</span>
            ))}
          </div>
        )}

        {/* Payment methods */}
        <div>
          <span style={{ ...TY.label, fontSize: "8px", color: t.textGhost }}>Payment Methods</span>
          <div className="mt-2 space-y-1.5">
            {rider.payments.map((pm, i) => (
              <div key={i} className="flex items-center justify-between px-3 py-2.5 rounded-xl" style={{ background: t.surface, border: `1px solid ${t.borderSubtle}` }}>
                <div className="flex items-center gap-2">
                  {pm.type === "card" ? <CreditCard size={12} style={{ color: t.iconMuted }} /> :
                   pm.type === "wallet" ? <Wallet size={12} style={{ color: BRAND.green }} /> :
                   pm.type === "corporate" ? <Scale size={12} style={{ color: "#8B5CF6" }} /> :
                   <CreditCard size={12} style={{ color: t.iconMuted }} />}
                  <span style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 500, fontSize: "12px", letterSpacing: "-0.02em", color: t.text }}>
                    {pm.label}{pm.last4 ? ` ····${pm.last4}` : ""}
                  </span>
                  {pm.balance != null && (
                    <span style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 400, fontSize: "10px", color: BRAND.green }}>₦{pm.balance.toLocaleString()}</span>
                  )}
                </div>
                {pm.isDefault && (
                  <span style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 500, fontSize: "9px", letterSpacing: "0.02em", color: BRAND.green }}>DEFAULT</span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Recent trips */}
        <div>
          <span style={{ ...TY.label, fontSize: "8px", color: t.textGhost }}>Recent Trips</span>
          <div className="mt-2 space-y-1.5">
            {rider.recentTrips.map(trip => (
              <div key={trip.id} className="flex items-center justify-between px-3 py-2.5 rounded-xl transition-colors cursor-pointer" style={{ background: t.surface, border: `1px solid ${t.borderSubtle}` }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.05)"; }}
              >
                <div className="flex items-start gap-3 min-w-0">
                  <div className="flex flex-col items-center gap-0.5 mt-1.5 shrink-0">
                    <div className="w-1.5 h-1.5 rounded-full" style={{ background: BRAND.green }} />
                    <div className="w-px h-3" style={{ background: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)" }} />
                    <div className="w-1.5 h-1.5 rounded-full" style={{ background: STATUS.error }} />
                  </div>
                  <div className="min-w-0">
                    <span className="block truncate" style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 500, fontSize: "12px", letterSpacing: "-0.02em", color: t.text }}>{trip.route}</span>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 400, fontSize: "10px", color: t.textFaint }}>{trip.date}</span>
                      <span style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 400, fontSize: "10px", color: t.textGhost }}>·</span>
                      <span style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 400, fontSize: "10px", color: t.textFaint }}>{trip.driverName}</span>
                      {trip.rating && (
                        <>
                          <span style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 400, fontSize: "10px", color: t.textGhost }}>·</span>
                          <Star size={8} style={{ color: "#F59E0B", fill: "#F59E0B" }} />
                          <span style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 400, fontSize: "10px", color: t.textFaint }}>{trip.rating}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <span style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 500, fontSize: "12px", letterSpacing: "-0.02em", color: t.text, whiteSpace: "nowrap" }}>{formatNaira(trip.fare)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Disputes */}
        {rider.disputes.length > 0 && (
          <div>
            <span style={{ ...TY.label, fontSize: "8px", color: t.textGhost }}>Disputes ({rider.disputes.length})</span>
            <div className="mt-2 space-y-1.5">
              {rider.disputes.map(d => (
                <div key={d.id} className="flex items-center justify-between px-3 py-2.5 rounded-xl cursor-pointer transition-colors" style={{ background: d.status === "open" ? `${STATUS.warning}06` : t.surface, border: `1px solid ${d.status === "open" ? `${STATUS.warning}15` : t.borderSubtle}` }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = d.status === "open" ? `${STATUS.warning}15` : (isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.05)"); }}
                >
                  <div className="flex items-center gap-2">
                    <Scale size={11} style={{ color: d.status === "open" ? STATUS.warning : t.iconMuted }} />
                    <div>
                      <span className="block" style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 500, fontSize: "12px", letterSpacing: "-0.02em", color: t.text }}>{d.id} — {d.category}</span>
                      <span style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 400, fontSize: "10px", color: t.textFaint }}>{d.date}{d.amount > 0 ? ` · ${formatNaira(d.amount)}` : ""}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="px-1.5 py-0.5 rounded" style={{ background: d.status === "open" ? `${STATUS.warning}15` : `${BRAND.green}12`, fontFamily: "'Manrope', sans-serif", fontWeight: 500, fontSize: "9px", color: d.status === "open" ? STATUS.warning : BRAND.green }}>
                      {d.status}
                    </span>
                    <ExternalLink size={10} style={{ color: t.textFaint }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div>
          <span style={{ ...TY.label, fontSize: "8px", color: t.textGhost }}>Actions</span>
          <div className="mt-2 grid grid-cols-2 gap-2">
            <button onClick={onIssueCredit} className="h-10 rounded-xl flex items-center justify-center gap-2 transition-colors" style={{ background: isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.03)", border: `1px solid ${isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)"}` }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = BRAND.green; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)"; }}
            >
              <Wallet size={13} style={{ color: BRAND.green }} />
              <span style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 500, fontSize: "12px", letterSpacing: "-0.02em", color: t.text }}>Issue Credit</span>
            </button>
            <button onClick={onSuspend} className="h-10 rounded-xl flex items-center justify-center gap-2 transition-colors" style={{ background: rider.status === "suspended" ? `${BRAND.green}06` : `${STATUS.error}06`, border: `1px solid ${rider.status === "suspended" ? `${BRAND.green}15` : `${STATUS.error}15`}` }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = rider.status === "suspended" ? BRAND.green : STATUS.error; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = rider.status === "suspended" ? `${BRAND.green}15` : `${STATUS.error}15`; }}
            >
              {rider.status === "suspended" ? <RefreshCcw size={13} style={{ color: BRAND.green }} /> : <Ban size={13} style={{ color: STATUS.error }} />}
              <span style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 500, fontSize: "12px", letterSpacing: "-0.02em", color: rider.status === "suspended" ? BRAND.green : STATUS.error }}>
                {rider.status === "suspended" ? "Reactivate" : "Suspend"}
              </span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   CONTACT CONTENT — for AdminDrawer
   ═══════════════════════════════════════════════════════════════════════════ */

function ContactContent({ rider, onSend }: { rider: Rider; onSend: () => void }) {
  const { t } = useAdminTheme();
  const [channel, setChannel] = useState<"push" | "sms" | "email">("push");
  const [message, setMessage] = useState("");

  const channels = [
    { key: "push" as const, label: "Push", desc: "In-app notification" },
    { key: "sms" as const, label: "SMS", desc: rider.phone },
    { key: "email" as const, label: "Email", desc: rider.email },
  ];

  return (
    <div className="px-5 py-4 space-y-4">
      {/* Channel selector */}
      <div>
        <span style={{ ...TY.label, fontSize: "8px", color: t.textGhost }}>Channel</span>
        <div className="mt-2 space-y-1.5">
          {channels.map(ch => (
            <button
              key={ch.key}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-colors"
              style={{
                background: channel === ch.key ? `${BRAND.green}08` : t.surface,
                border: `1px solid ${channel === ch.key ? `${BRAND.green}20` : t.borderSubtle}`,
              }}
              onClick={() => setChannel(ch.key)}
            >
              <div className="w-4 h-4 flex items-center justify-center">
                {channel === ch.key ? <CheckCircle2 size={13} style={{ color: BRAND.green }} /> : <div className="w-3.5 h-3.5 rounded-full" style={{ border: `1.5px solid ${t.textFaint}` }} />}
              </div>
              <div>
                <span className="block" style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 500, fontSize: "12px", letterSpacing: "-0.02em", color: t.text }}>{ch.label}</span>
                <span style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 400, fontSize: "10px", color: t.textFaint }}>{ch.desc}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Template */}
      <div>
        <span style={{ ...TY.label, fontSize: "8px", color: t.textGhost }}>Template</span>
        <select className="mt-2 w-full h-10 px-3 rounded-xl bg-transparent outline-none" style={{ border: `1px solid ${t.borderSubtle}`, fontFamily: "'Manrope', sans-serif", fontSize: "12px", color: t.text }}>
          <option value="">Custom message…</option>
          <option value="credit">Credit issued notification</option>
          <option value="resolve">Dispute resolution update</option>
          <option value="promo">Promotional offer</option>
          <option value="reactivation">Account reactivation</option>
        </select>
      </div>

      {/* Message */}
      <div>
        <span style={{ ...TY.label, fontSize: "8px", color: t.textGhost }}>Message</span>
        <textarea
          value={message}
          onChange={e => setMessage(e.target.value)}
          placeholder={`Write a message to ${rider.name.split(" ")[0]}…`}
          rows={5}
          className="mt-2 w-full px-3 py-2.5 rounded-xl bg-transparent outline-none resize-none"
          style={{ border: `1px solid ${t.borderSubtle}`, fontFamily: "'Manrope', sans-serif", fontSize: "12px", lineHeight: "1.5", color: t.text }}
        />
      </div>

      {/* Send */}
      <div className="flex items-center gap-2">
        <button
          className="flex-1 h-11 rounded-xl flex items-center justify-center gap-2"
          style={{ background: BRAND.green, minHeight: 44 }}
          onClick={onSend}
        >
          <Send size={13} style={{ color: "#fff" }} />
          <span style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 500, fontSize: "12px", color: "#fff" }}>Send {channel.toUpperCase()}</span>
        </button>
      </div>
    </div>
  );
}
