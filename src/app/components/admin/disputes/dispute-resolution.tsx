/**
 * JET ADMIN — DISPUTE RESOLUTION (Locked Composite)
 *
 * ROOT: A's queue (left 380px) + empty state (right flex)
 * DETAIL: Queue disappears → C's full-screen split court + resolution panel
 *
 * Surfaces wired:
 *   Confirm Resolution → CENTER MODAL (high-friction, irreversible)
 *   Contact Rider/Driver → SIDE DRAWER (low-friction, contextual)
 *   Suspend Driver → CENTER MODAL (high-friction, irreversible)
 *   View Trip Replay → DISABLED (no infrastructure)
 */

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  MapPin, AlertTriangle, ChevronRight, ArrowLeft,
  Camera, FileText, Shield, CheckCircle2, RefreshCcw,
  Eye, Phone, User, Timer, Scale, Ban,
  Building2, Car, BedDouble, Filter,
} from "lucide-react";
import { useAdminTheme, TY, BRAND, STATUS } from "../../../config/admin-theme";
import {
  DISPUTES, CATEGORY_META, STATUS_META, DISPUTE_TYPE_META,
  formatNaira, type Dispute, type DisputeCategory, type DisputeType,
} from "../../../config/dispute-mock-data";
import { ResolutionConfirmation, type VerdictType, type ResolutionData } from "./resolution-confirmation";
import { ContactDrawer, type ContactMessageData } from "./contact-drawer";
import { SuspendDriver, type SuspensionData } from "./suspend-driver";
import { ProfileDrawer, MOCK_PROFILES, type ProfileData } from "../ui/profile-drawer";

/* ═══ Priority colors ═══ */
const PC: Record<string, string> = {
  critical: "#D4183D",
  high: "#F97316",
  medium: "#F59E0B",
  low: "#737373",
};

const CAT_Q: Record<string, string> = {
  safety: "#D4183D",
  fare: "#F59E0B",
  route: "#3B82F6",
  payment: "#F97316",
  service: "#737373",
  property: "#8B5CF6",
  no_show: "#EC4899",
};

const STATUS_Q: Record<string, string> = {
  new: "#3B82F6",
  in_review: "#F59E0B",
  awaiting_evidence: "#F97316",
  escalated: "#D4183D",
  resolved: "#1DB954",
};

const TYPE_COLORS: Record<DisputeType, string> = {
  rider_driver: "#3B82F6",
  hotel_driver: "#8B5CF6",
  driver_hotel_guest: "#EC4899",
};

/** Hotel accent color for split court */
const HOTEL_ACCENT = "#8B5CF6";

const PARTY_FILTER_META: Record<"rider" | "driver" | "hotel" | "fleet", { label: string; color: string; icon: React.ComponentType<{ size?: number; style?: React.CSSProperties }> }> = {
  rider: { label: "Rider", color: STATUS.info, icon: User },
  driver: { label: "Driver", color: BRAND.green, icon: Shield },
  hotel: { label: "Hotel", color: HOTEL_ACCENT, icon: Building2 },
  fleet: { label: "Fleet", color: STATUS.warning, icon: Car },
};

export function DisputeResolution() {
  const { theme, t } = useAdminTheme();
  const isDark = theme === "dark";
  const [selected, setSelected] = useState<Dispute | null>(null);
  const [filterCat, setFilterCat] = useState<DisputeCategory | "all">("all");
  const [filterParty, setFilterParty] = useState<"all" | "rider" | "driver" | "hotel" | "fleet">("all");
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [activeVerdict, setActiveVerdict] = useState<string | null>(null);

  // Surface states
  const [showResolutionModal, setShowResolutionModal] = useState(false);
  const [showContactDrawer, setShowContactDrawer] = useState(false);
  const [showSuspendModal, setShowSuspendModal] = useState(false);
  const [contactTarget, setContactTarget] = useState<"rider" | "driver" | "hotel">("rider");
  const [resolvedDisputes, setResolvedDisputes] = useState<Set<string>>(new Set());
  const [suspendedDrivers, setSuspendedDrivers] = useState<Set<string>>(new Set());
  const [profileDrawerData, setProfileDrawerData] = useState<ProfileData | null>(null);
  const [showProfileDrawer, setShowProfileDrawer] = useState(false);

  const openProfile = (name: string) => {
    // Check mock profiles first, then build from current dispute data
    const profile = MOCK_PROFILES[name];
    if (profile) {
      setProfileDrawerData(profile);
      setShowProfileDrawer(true);
      return;
    }
    // Auto-generate profile from dispute party data
    if (selected) {
      const initials = name.split(" ").filter(w => w.length > 0).map(w => w[0]).join("").slice(0, 2).toUpperCase();
      if (selected.rider && selected.rider.name === name) {
        setProfileDrawerData({
          type: "rider", name, initials,
          phone: selected.rider.phone, joinDate: selected.rider.joinDate, status: "active",
          rating: selected.rider.rating, totalTrips: selected.rider.totalTrips,
          totalSpend: `₦${(selected.rider.totalTrips * 2800).toLocaleString()}`,
          lastActive: "Recently", paymentMethods: 2,
        });
        setShowProfileDrawer(true);
        return;
      }
      if (selected.driver && selected.driver.name === name) {
        setProfileDrawerData({
          type: "driver", name, initials,
          phone: selected.driver.phone, joinDate: selected.driver.joinDate, status: "active",
          rating: selected.driver.rating, totalTrips: selected.driver.totalTrips,
          vehicleType: "Registered Vehicle", vehiclePlate: "—",
          isEV: false, completionRate: "—", acceptanceRate: "—",
          totalEarnings: `₦${(selected.driver.totalTrips * 1800).toLocaleString()}`,
          verificationStatus: "verified",
          fleet: selected.fleet?.name,
        });
        setShowProfileDrawer(true);
        return;
      }
      if (selected.hotel && selected.hotel.name === name) {
        setProfileDrawerData({
          type: "hotel", name, initials,
          phone: selected.hotel.phone, joinDate: "2024", status: "active",
          hotelTier: selected.hotel.tier === "gold" ? "premium" : "standard",
          guestBookings: selected.hotel.totalBookings,
          monthlyVolume: `₦${(selected.hotel.totalBookings * 12500).toLocaleString()}`,
          contactPerson: selected.hotel.contactPerson,
          integrationStatus: "live",
        });
        setShowProfileDrawer(true);
        return;
      }
    }
  };

  const partyFilter = (d: Dispute) => {
    if (filterParty === "all") return true;
    if (filterParty === "rider") return d.disputeType === "rider_driver";
    if (filterParty === "driver") return true; // driver is always involved
    if (filterParty === "hotel") return d.disputeType === "hotel_driver" || d.disputeType === "driver_hotel_guest";
    if (filterParty === "fleet") return !!d.fleet;
    return true;
  };

  const filtered = DISPUTES
    .filter(d => filterCat === "all" || d.category === filterCat)
    .filter(partyFilter);
  const urgentCount = DISPUTES.filter(d => d.priority === "critical" || d.priority === "high").length;
  const hasActiveFilters = filterParty !== "all" || filterCat !== "all";
  const activeFilterCount = (filterParty !== "all" ? 1 : 0) + (filterCat !== "all" ? 1 : 0);

  const handleConfirmResolution = (verdict: VerdictType, data: ResolutionData) => {
    if (selected) {
      setResolvedDisputes(prev => new Set(prev).add(selected.id));
    }
    setShowResolutionModal(false);
    setActiveVerdict(null);
    console.log("Resolution confirmed:", { verdict, data });
  };

  const handleContactSend = (data: ContactMessageData) => {
    setShowContactDrawer(false);
    console.log("Message sent:", data);
  };

  const handleSuspendConfirm = (data: SuspensionData) => {
    setSuspendedDrivers(prev => new Set(prev).add(data.driverName));
    setShowSuspendModal(false);
    console.log("Driver suspended:", data);
  };

  const openContact = (target: "rider" | "driver" | "hotel") => {
    setContactTarget(target);
    setShowContactDrawer(true);
  };

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
            {/* ─── LEFT: QUEUE PANEL ─── */}
            <div
              className="w-full md:w-[380px] shrink-0 flex flex-col overflow-hidden"
              style={{
                background: t.overlay,
                borderRight: `1px solid ${t.border}`,
              }}
            >
              <div
                className="shrink-0 flex flex-col gap-3 px-4 pt-3 pb-3"
                style={{ borderBottom: `1px solid ${t.borderSubtle}` }}
              >
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 600, fontSize: "13px", lineHeight: "1.3", letterSpacing: "-0.03em", color: t.text }}>
                      Disputes
                    </span>
                    <span style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 400, fontSize: "11px", letterSpacing: "-0.02em", color: t.textMuted }}>
                      {filtered.length} open · {urgentCount} urgent
                    </span>
                  </div>
                </div>

                {/* Toolbar */}
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

                    {/* Inline filter tags when dropdown closed */}
                    {hasActiveFilters && !showFilterDropdown && (
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {filterParty !== "all" && (
                          <span className="inline-flex items-center gap-1 h-6 px-2 rounded-md" style={{ background: isDark ? `${PARTY_FILTER_META[filterParty].color}15` : `${PARTY_FILTER_META[filterParty].color}10`, border: `1px solid ${PARTY_FILTER_META[filterParty].color}20` }}>
                            <span style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 500, fontSize: "10px", letterSpacing: "-0.02em", color: PARTY_FILTER_META[filterParty].color }}>
                              {PARTY_FILTER_META[filterParty].label}
                            </span>
                            <button className="flex items-center justify-center" onClick={(e) => { e.stopPropagation(); setFilterParty("all"); }} style={{ fontFamily: "'Manrope', sans-serif", fontSize: "12px", color: PARTY_FILTER_META[filterParty].color, opacity: 0.5, lineHeight: 1 }}>×</button>
                          </span>
                        )}
                        {filterCat !== "all" && (
                          <span className="inline-flex items-center gap-1 h-6 px-2 rounded-md" style={{ background: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)", border: `1px solid ${isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.08)"}` }}>
                            <span style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 500, fontSize: "10px", letterSpacing: "-0.02em", color: t.text }}>
                              {filterCat === "no_show" ? "No-Show" : filterCat.charAt(0).toUpperCase() + filterCat.slice(1)}
                            </span>
                            <button className="flex items-center justify-center" onClick={(e) => { e.stopPropagation(); setFilterCat("all"); }} style={{ fontFamily: "'Manrope', sans-serif", fontSize: "12px", color: t.textMuted, lineHeight: 1 }}>×</button>
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Dropdown */}
                  <AnimatePresence>
                    {showFilterDropdown && (
                      <>
                        <div className="fixed inset-0 z-40" onClick={() => setShowFilterDropdown(false)} />
                        <motion.div
                          className="absolute left-0 top-full mt-1 z-50 rounded-xl overflow-hidden overflow-y-auto"
                          style={{
                            width: 224,
                            maxHeight: 420,
                            background: isDark ? "#1A1A1C" : "#FFFFFF",
                            border: `1px solid ${isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)"}`,
                            boxShadow: isDark
                              ? "0 12px 48px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.04)"
                              : "0 12px 48px rgba(0,0,0,0.12), 0 0 0 1px rgba(0,0,0,0.03)",
                          }}
                          initial={{ opacity: 0, y: -4, scale: 0.97 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -4, scale: 0.97 }}
                          transition={{ duration: 0.12 }}
                        >
                          {/* Section: Involves */}
                          <div className="px-3 pt-2.5 pb-1">
                            <span style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 600, fontSize: "9px", letterSpacing: "0.05em", textTransform: "uppercase" as const, color: t.textFaint }}>
                              Involves
                            </span>
                          </div>
                          {(["all", "rider", "driver", "hotel", "fleet"] as const).map((party) => {
                            const isActive = filterParty === party;
                            const meta = party !== "all" ? PARTY_FILTER_META[party] : null;
                            const count = party === "all" ? DISPUTES.length : DISPUTES.filter(d => {
                              if (party === "rider") return d.disputeType === "rider_driver";
                              if (party === "driver") return true;
                              if (party === "hotel") return d.disputeType === "hotel_driver" || d.disputeType === "driver_hotel_guest";
                              if (party === "fleet") return !!d.fleet;
                              return true;
                            }).length;
                            return (
                              <button
                                key={party}
                                className="w-full flex items-center gap-2.5 px-3 py-[7px] transition-colors text-left"
                                style={{ background: isActive ? (isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.03)") : "transparent" }}
                                onClick={() => setFilterParty(party)}
                                onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)"; }}
                                onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = "transparent"; }}
                              >
                                <div className="w-4 h-4 flex items-center justify-center shrink-0">
                                  {isActive ? <CheckCircle2 size={13} style={{ color: meta ? meta.color : BRAND.green }} /> : <div className="w-3.5 h-3.5 rounded-full" style={{ border: `1.5px solid ${isDark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.15)"}` }} />}
                                </div>
                                {meta ? <meta.icon size={13} style={{ color: isActive ? meta.color : t.textMuted }} /> : <Scale size={13} style={{ color: isActive ? t.text : t.textMuted }} />}
                                <span className="flex-1" style={{ fontFamily: "'Manrope', sans-serif", fontWeight: isActive ? 500 : 400, fontSize: "12px", letterSpacing: "-0.02em", color: isActive ? t.text : t.textSecondary }}>
                                  {party === "all" ? "All parties" : meta!.label}
                                </span>
                                <span style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 500, fontSize: "10px", color: t.textFaint }}>{count}</span>
                              </button>
                            );
                          })}

                          {/* Divider */}
                          <div className="mx-3 my-1" style={{ height: 1, background: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)" }} />

                          {/* Section: Category */}
                          <div className="px-3 pt-1.5 pb-1">
                            <span style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 600, fontSize: "9px", letterSpacing: "0.05em", textTransform: "uppercase" as const, color: t.textFaint }}>
                              Category
                            </span>
                          </div>
                          {(["all", "safety", "fare", "route", "payment", "service", "property", "no_show"] as const).map((cat) => {
                            const isActive = filterCat === cat;
                            const label = cat === "all" ? "All categories" : cat === "no_show" ? "No-Show" : cat.charAt(0).toUpperCase() + cat.slice(1);
                            return (
                              <button
                                key={cat}
                                className="w-full flex items-center gap-2.5 px-3 py-[7px] transition-colors text-left"
                                style={{ background: isActive ? (isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.03)") : "transparent" }}
                                onClick={() => setFilterCat(cat)}
                                onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)"; }}
                                onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = "transparent"; }}
                              >
                                <div className="w-4 h-4 flex items-center justify-center shrink-0">
                                  {isActive ? <CheckCircle2 size={13} style={{ color: BRAND.green }} /> : <div className="w-3.5 h-3.5 rounded-full" style={{ border: `1.5px solid ${isDark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.15)"}` }} />}
                                </div>
                                <span className="flex-1" style={{ fontFamily: "'Manrope', sans-serif", fontWeight: isActive ? 500 : 400, fontSize: "12px", letterSpacing: "-0.02em", color: isActive ? t.text : t.textSecondary }}>
                                  {label}
                                </span>
                              </button>
                            );
                          })}

                          {/* Clear all */}
                          {hasActiveFilters && (
                            <>
                              <div className="mx-3 my-1" style={{ height: 1, background: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)" }} />
                              <button
                                className="w-full flex items-center gap-2 px-3 py-2 transition-colors text-left"
                                style={{ color: STATUS.error }}
                                onClick={() => { setFilterParty("all"); setFilterCat("all"); setShowFilterDropdown(false); }}
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

              <div className="flex-1 overflow-y-auto scrollbar-hide">
                {filtered.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
                      style={{
                        background: isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)",
                        border: `1px solid ${isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.04)"}`,
                      }}
                    >
                      <Scale size={16} style={{ color: t.textFaint }} />
                    </div>
                    <span
                      className="block mb-1"
                      style={{
                        fontFamily: "'Montserrat', sans-serif",
                        fontWeight: 600,
                        fontSize: "12px",
                        letterSpacing: "-0.02em",
                        color: t.textSecondary,
                      }}
                    >
                      No disputes match
                    </span>
                    <span
                      className="block mb-4"
                      style={{
                        fontFamily: "'Manrope', sans-serif",
                        fontWeight: 400,
                        fontSize: "11px",
                        lineHeight: "1.5",
                        letterSpacing: "-0.02em",
                        color: t.textMuted,
                      }}
                    >
                      Try adjusting your filters to see more results
                    </span>
                    <button
                      className="h-8 px-4 rounded-lg transition-opacity hover:opacity-80"
                      style={{
                        background: isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.03)",
                        border: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)"}`,
                      }}
                      onClick={() => { setFilterParty("all"); setFilterCat("all"); }}
                    >
                      <span
                        style={{
                          fontFamily: "'Manrope', sans-serif",
                          fontWeight: 500,
                          fontSize: "11px",
                          letterSpacing: "-0.02em",
                          color: t.textMuted,
                        }}
                      >
                        Clear filters
                      </span>
                    </button>
                  </div>
                )}
                {filtered.map((dispute, i) => {
                  const pc = PC[dispute.priority] || PC.low;
                  const catColor = CAT_Q[dispute.category] || "#737373";
                  const statColor = STATUS_Q[dispute.status] || "#737373";
                  const sm = STATUS_META[dispute.status];
                  const isResolved = resolvedDisputes.has(dispute.id);

                  return (
                    <motion.button
                      key={dispute.id}
                      className="w-full text-left relative"
                      style={{ height: 79, opacity: isResolved ? 0.4 : 1 }}
                      onClick={() => { setSelected(dispute); setActiveVerdict(null); }}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: isResolved ? 0.4 : 1, y: 0 }}
                      transition={{ delay: i * 0.03 }}
                      onMouseEnter={e => (e.currentTarget.style.background = t.surfaceHover)}
                      onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                    >
                      <div
                        className="absolute inset-0 pointer-events-none"
                        style={{ borderBottom: `1px solid ${t.borderSubtle}` }}
                      />

                      <div className="absolute flex gap-3 items-start" style={{ left: 16, top: 14, right: 16, height: 50 }}>
                        <div className="flex flex-col gap-1 items-center pt-0.5 shrink-0" style={{ width: 8, height: 38 }}>
                          <div
                            className="rounded-full shrink-0"
                            style={{ width: 8, height: 8, background: isResolved ? BRAND.green : pc }}
                          />
                          <div
                            className="flex-1 rounded-full"
                            style={{ width: 2, background: isResolved ? `${BRAND.green}30` : `${pc}30` }}
                          />
                        </div>

                        <div className="flex-1 flex flex-col gap-1 min-w-0">
                          <div className="flex items-center gap-2 h-3.5">
                            {/* Dispute type badge */}
                            {dispute.disputeType !== "rider_driver" && (
                              <>
                                <span
                                  className="px-1.5 py-0.5 rounded"
                                  style={{
                                    fontFamily: "'Manrope', sans-serif",
                                    fontWeight: 500,
                                    fontSize: "8px",
                                    lineHeight: "1.4",
                                    letterSpacing: "-0.02em",
                                    color: TYPE_COLORS[dispute.disputeType],
                                    background: `${TYPE_COLORS[dispute.disputeType]}12`,
                                    whiteSpace: "nowrap",
                                  }}
                                >
                                  {dispute.disputeType === "hotel_driver" ? "Hotel" : "Guest"}
                                </span>
                                <span style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 500, fontSize: "9px", color: t.textGhost }}>·</span>
                              </>
                            )}
                            <span
                              style={{
                                fontFamily: "'Manrope', sans-serif",
                                fontWeight: 500,
                                fontSize: "9px",
                                lineHeight: "1.4",
                                letterSpacing: "-0.02em",
                                color: isResolved ? BRAND.green : catColor,
                                whiteSpace: "nowrap",
                              }}
                            >
                              {isResolved ? "Resolved" : CATEGORY_META[dispute.category].label}
                            </span>
                            <span style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 500, fontSize: "9px", color: t.textGhost }}>·</span>
                            <span
                              style={{
                                fontFamily: "'Manrope', sans-serif",
                                fontWeight: 500,
                                fontSize: "9px",
                                lineHeight: "1.4",
                                letterSpacing: "-0.02em",
                                color: isResolved ? BRAND.green : statColor,
                                whiteSpace: "nowrap",
                              }}
                            >
                              {isResolved ? "Closed" : sm.label}
                            </span>
                          </div>

                          <div className="overflow-hidden" style={{ height: 17 }}>
                            <span
                              className="block truncate"
                              style={{
                                fontFamily: "'Manrope', sans-serif",
                                fontWeight: 500,
                                fontSize: "12px",
                                lineHeight: "1.4",
                                letterSpacing: "-0.02em",
                                color: isResolved ? t.textMuted : t.text,
                              }}
                            >
                              {dispute.title}
                            </span>
                          </div>

                          <div className="flex items-center gap-2 h-3.5">
                            <span
                              style={{
                                fontFamily: "'Manrope', sans-serif",
                                fontWeight: 500,
                                fontSize: "9px",
                                lineHeight: "1.4",
                                letterSpacing: "-0.02em",
                                color: t.textFaint,
                                whiteSpace: "nowrap",
                              }}
                            >
                              {dispute.id}
                            </span>
                            <span style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 500, fontSize: "9px", color: t.textGhost }}>·</span>
                            <span
                              style={{
                                fontFamily: "'Manrope', sans-serif",
                                fontWeight: 500,
                                fontSize: "9px",
                                lineHeight: "1.4",
                                letterSpacing: "-0.02em",
                                color: t.textFaint,
                                whiteSpace: "nowrap",
                              }}
                            >
                              {dispute.createdAt}
                            </span>
                            {!isResolved && dispute.slaHoursLeft <= 4 && (
                              <span className="flex items-center gap-0.5 shrink-0">
                                <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                                  <path d="M3.333 0.667H4.667" stroke="#D4183D" strokeWidth="0.667" strokeLinecap="round" strokeLinejoin="round" />
                                  <path d="M4 4.667L5 3.667" stroke="#D4183D" strokeWidth="0.667" strokeLinecap="round" strokeLinejoin="round" />
                                  <circle cx="4" cy="4.667" r="2.667" stroke="#D4183D" strokeWidth="0.667" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                <span
                                  style={{
                                    fontFamily: "'Manrope', sans-serif",
                                    fontWeight: 500,
                                    fontSize: "9px",
                                    lineHeight: "1.4",
                                    letterSpacing: "-0.02em",
                                    color: "#D4183D",
                                    whiteSpace: "nowrap",
                                  }}
                                >
                                  {dispute.slaHoursLeft}h left
                                </span>
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* ─── RIGHT: EMPTY STATE ─── */}
            <div className="flex-1 hidden md:flex items-center justify-center">
              <motion.div
                className="flex flex-col items-center text-center max-w-[320px]"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div
                  className="rounded-2xl flex items-center justify-center mb-5"
                  style={{
                    width: 56,
                    height: 56,
                    background: isDark ? "rgba(255,255,255,0.025)" : "rgba(0,0,0,0.02)",
                    border: `1px solid ${isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)"}`,
                  }}
                >
                  <Scale size={22} style={{ color: t.textFaint }} />
                </div>
                <span
                  className="block mb-2"
                  style={{
                    fontFamily: "'Montserrat', sans-serif",
                    fontWeight: 600,
                    fontSize: "15px",
                    lineHeight: "1.3",
                    letterSpacing: "-0.03em",
                    color: t.textSecondary,
                  }}
                >
                  Select a dispute to review
                </span>
                <span
                  className="block mb-5"
                  style={{
                    fontFamily: "'Manrope', sans-serif",
                    fontWeight: 400,
                    fontSize: "12px",
                    lineHeight: "1.6",
                    letterSpacing: "-0.02em",
                    color: t.textMuted,
                  }}
                >
                  Pick a case from the queue to view evidence from both parties, review the shared truth timeline, and issue a resolution.
                </span>
                {/* Instructional hints */}
                <div className="flex flex-col gap-2 w-full">
                  {[
                    { label: "Red bar", desc: "Critical priority — SLA ticking", color: STATUS.error },
                    { label: "Orange bar", desc: "High priority — needs attention", color: STATUS.warning },
                    { label: "Blue bar", desc: "Medium — can queue", color: STATUS.info },
                  ].map(hint => (
                    <div
                      key={hint.label}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-lg"
                      style={{
                        background: isDark ? "rgba(255,255,255,0.015)" : "rgba(0,0,0,0.01)",
                      }}
                    >
                      <div className="w-1 h-4 rounded-full shrink-0" style={{ background: hint.color }} />
                      <span
                        style={{
                          fontFamily: "'Manrope', sans-serif",
                          fontWeight: 400,
                          fontSize: "11px",
                          letterSpacing: "-0.02em",
                          color: t.textMuted,
                        }}
                      >
                        <span style={{ fontWeight: 500, color: t.textSecondary }}>{hint.label}</span> — {hint.desc}
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </motion.div>
        ) : (
          /* ═══════════════════════════════════════════════════════════════
             DETAIL VIEW — Full screen split court + resolution panel
             ═══════════════════════════════════════════════════════════════ */
          <motion.div
            key={`detail-${selected.id}`}
            className="flex-1 flex flex-col overflow-hidden"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {/* ─── HERO BAR ─── */}
            <div
              className="flex items-center gap-3 md:gap-4 px-3 md:px-5 shrink-0"
              style={{ borderBottom: `1px solid ${t.borderSubtle}`, minHeight: 56 }}
            >
              <button
                onClick={() => { setSelected(null); setActiveVerdict(null); }}
                className="w-9 h-9 md:w-8 md:h-8 rounded-xl flex items-center justify-center shrink-0 transition-colors"
                style={{ background: t.surfaceHover, minWidth: 44, minHeight: 44 }}
                onMouseEnter={e => (e.currentTarget.style.background = t.surfaceActive)}
                onMouseLeave={e => (e.currentTarget.style.background = t.surfaceHover)}
              >
                <ArrowLeft size={14} style={{ color: t.iconSecondary }} />
              </button>

              <div className="flex items-center gap-3 flex-1 min-w-0">
                <span style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 600, fontSize: "13px", lineHeight: "1.3", letterSpacing: "-0.02em", color: t.text, whiteSpace: "nowrap" }}>
                  {selected.id}
                </span>
                <span
                  className="px-2 py-0.5 rounded-lg shrink-0"
                  style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 500, fontSize: "9px", letterSpacing: "-0.02em", color: CAT_Q[selected.category] || "#737373", background: `${CAT_Q[selected.category] || "#737373"}10` }}
                >
                  {CATEGORY_META[selected.category].label}
                </span>
                <span
                  className="px-2 py-0.5 rounded-lg shrink-0"
                  style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 500, fontSize: "9px", letterSpacing: "-0.02em", color: TYPE_COLORS[selected.disputeType], background: `${TYPE_COLORS[selected.disputeType]}12` }}
                >
                  {DISPUTE_TYPE_META[selected.disputeType].label}
                </span>
                <div className="w-px h-3.5 shrink-0" style={{ background: t.borderSubtle }} />
                <span className="truncate" style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 400, fontSize: "11px", lineHeight: "1.5", letterSpacing: "-0.02em", color: t.textMuted }}>
                  {selected.title}
                </span>
              </div>

              {/* Resolved badge */}
              {resolvedDisputes.has(selected.id) && (
                <span className="px-3 py-1 rounded-lg flex items-center gap-1.5 shrink-0" style={{ background: `${BRAND.green}12`, border: `1px solid ${BRAND.green}20` }}>
                  <CheckCircle2 size={12} style={{ color: BRAND.green }} />
                  <span style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 500, fontSize: "10px", color: BRAND.green }}>Resolved</span>
                </span>
              )}

              {/* Suspended driver badge */}
              {suspendedDrivers.has(selected.driver.name) && (
                <span className="px-3 py-1 rounded-lg flex items-center gap-1.5 shrink-0" style={{ background: t.errorBg, border: `1px solid ${t.errorBorder}` }}>
                  <Ban size={12} style={{ color: STATUS.error }} />
                  <span style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 500, fontSize: "10px", color: STATUS.error }}>Driver suspended</span>
                </span>
              )}

              {/* Time remaining */}
              <div
                className="rounded-2xl flex items-center gap-2 px-4 py-2.5 shrink-0"
                style={{
                  background: selected.slaHoursLeft <= 2 ? t.errorBg : t.surface,
                  border: `1px solid ${selected.slaHoursLeft <= 2 ? t.errorBorder : t.borderSubtle}`,
                }}
              >
                <Timer size={14} style={{ color: selected.slaHoursLeft <= 2 ? STATUS.error : t.iconSecondary }} />
                <div>
                  <span className="block" style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 500, fontSize: "14px", lineHeight: "1.4", letterSpacing: "-0.02em", color: selected.slaHoursLeft <= 2 ? STATUS.error : t.text }}>
                    {selected.slaHoursLeft}h
                  </span>
                  <span style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 500, fontSize: "8px", lineHeight: "1.4", letterSpacing: "-0.02em", color: t.textFaint }}>
                    remaining
                  </span>
                </div>
              </div>
            </div>

            {/* ─── TRIP CONTEXT STRIP ─── */}
            <div
              className="flex items-center gap-5 px-5 shrink-0"
              style={{ background: t.surface, borderBottom: `1px solid ${t.borderSubtle}`, minHeight: 36 }}
            >
              <div className="flex items-center gap-2">
                <MapPin size={11} style={{ color: BRAND.green }} />
                <span style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 500, fontSize: "11px", letterSpacing: "-0.02em", color: t.textSecondary }}>
                  {selected.trip.pickup} → {selected.trip.dropoff}
                </span>
              </div>
              <span style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 500, fontSize: "10px", letterSpacing: "-0.02em", color: t.textMuted }}>
                {selected.trip.distance} · {selected.trip.duration}
              </span>
              <span style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 500, fontSize: "11px", letterSpacing: "-0.02em", color: t.text }}>
                {formatNaira(selected.trip.fare)}
              </span>
              {selected.trip.surgeMultiplier > 1 && (
                <span style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 500, fontSize: "10px", letterSpacing: "-0.02em", color: STATUS.warning }}>
                  {selected.trip.surgeMultiplier}x surge
                </span>
              )}
              <span style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 500, fontSize: "10px", letterSpacing: "-0.02em", color: t.textMuted }}>
                {selected.trip.vehicleType}
              </span>
              {selected.trip.bookingSource === "hotel_concierge" && (
                <span className="flex items-center gap-1 px-2 py-0.5 rounded-md" style={{ background: `${HOTEL_ACCENT}10`, border: `1px solid ${HOTEL_ACCENT}20` }}>
                  <Building2 size={9} style={{ color: HOTEL_ACCENT }} />
                  <span style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 500, fontSize: "9px", letterSpacing: "-0.02em", color: HOTEL_ACCENT }}>Hotel Booking</span>
                </span>
              )}
              {selected.fleet && (
                <span className="flex items-center gap-1 px-2 py-0.5 rounded-md" style={{ background: `${STATUS.warning}10`, border: `1px solid ${STATUS.warning}20` }}>
                  <Car size={9} style={{ color: STATUS.warning }} />
                  <span style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 500, fontSize: "9px", letterSpacing: "-0.02em", color: STATUS.warning }}>{selected.fleet.name}</span>
                </span>
              )}
            </div>

            {/* ─── SPLIT COURT + RESOLUTION ─── */}
            <div className="flex-1 flex flex-col md:flex-row min-h-0 overflow-hidden">

              {/* ── LEFT COLUMN (Filer side) ── */}
              <div className="flex-1 flex flex-col overflow-y-auto scrollbar-hide p-4" style={{ borderRight: `1px solid ${t.borderSubtle}` }}>
                {selected.disputeType === "rider_driver" && (
                  <>
                    <PartyCard party={selected.rider} role="RIDER" accent={STATUS.info} t={t} joinLabel={`Since ${selected.rider.joinDate}`} onNameClick={openProfile} />
                    <SectionLabel color={STATUS.info}>RIDER'S STATEMENT</SectionLabel>
                    <StatementBlock text={selected.description} t={t} />
                    <SectionLabel color={STATUS.info}>RIDER'S EVIDENCE</SectionLabel>
                    <EvidenceList evidence={selected.evidence.filter(e => e.source === "rider")} accentColor={STATUS.info} t={t} />
                    <SectionLabel color={STATUS.info}>RIDER'S ACTIONS</SectionLabel>
                    <TimelineDots events={selected.timeline.filter(e => e.type === "rider")} dotColor={STATUS.info} t={t} />
                  </>
                )}

                {selected.disputeType === "hotel_driver" && (
                  <>
                    {/* Hotel party card */}
                    {selected.hotel && (
                      <HotelPartyCard hotel={selected.hotel} accent={HOTEL_ACCENT} t={t} onNameClick={openProfile} />
                    )}
                    {/* Guest info card */}
                    {selected.guest && (
                      <GuestInfoCard guest={selected.guest} accent={HOTEL_ACCENT} t={t} />
                    )}
                    <SectionLabel color={HOTEL_ACCENT}>HOTEL'S STATEMENT</SectionLabel>
                    <StatementBlock text={selected.description} t={t} />
                    <SectionLabel color={HOTEL_ACCENT}>HOTEL'S EVIDENCE</SectionLabel>
                    <EvidenceList evidence={selected.evidence.filter(e => e.source === "hotel")} accentColor={HOTEL_ACCENT} t={t} />
                    <SectionLabel color={HOTEL_ACCENT}>HOTEL TIMELINE</SectionLabel>
                    <TimelineDots events={selected.timeline.filter(e => e.type === "hotel")} dotColor={HOTEL_ACCENT} t={t} />
                  </>
                )}

                {selected.disputeType === "driver_hotel_guest" && (
                  <>
                    <PartyCard party={selected.driver} role="DRIVER (FILER)" accent={BRAND.green} t={t} joinLabel={`Since ${selected.driver.joinDate}`} suspended={suspendedDrivers.has(selected.driver.name)} onNameClick={openProfile} />
                    {selected.fleet && <FleetBadge fleet={selected.fleet} t={t} />}
                    <SectionLabel color={BRAND.green}>DRIVER'S STATEMENT</SectionLabel>
                    <StatementBlock text={selected.description} t={t} />
                    <SectionLabel color={BRAND.green}>DRIVER'S EVIDENCE</SectionLabel>
                    <EvidenceList evidence={selected.evidence.filter(e => e.source === "driver")} accentColor={BRAND.green} t={t} />
                    <SectionLabel color={BRAND.green}>DRIVER'S ACTIONS</SectionLabel>
                    <TimelineDots events={selected.timeline.filter(e => e.type === "driver")} dotColor={BRAND.green} t={t} />
                  </>
                )}
              </div>

              {/* ── SHARED TRUTH ── */}
              <div className="w-full md:w-[280px] xl:w-[320px] shrink-0 flex flex-col overflow-y-auto scrollbar-hide p-4" style={{ background: t.bgSubtle }}>
                <div className="flex items-center justify-center gap-2 mb-4">
                  <Scale size={13} style={{ color: t.textMuted }} />
                  <span style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 500, fontSize: "9px", letterSpacing: "0.06em", textTransform: "uppercase" as const, color: t.textMuted }}>SHARED TRUTH</span>
                </div>

                <div className="space-y-3">
                  {selected.evidence.filter(e => e.source === "system").map((ev, i) => (
                    <motion.div
                      key={ev.id} className="rounded-xl p-4"
                      style={{ background: t.surfaceRaised, border: `1px solid ${t.borderSubtle}`, boxShadow: t.shadow }}
                      initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.12 + i * 0.05 }}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <FileText size={11} style={{ color: t.iconSecondary }} />
                        <span style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 500, fontSize: "11px", letterSpacing: "-0.02em", color: t.text }}>{ev.label}</span>
                      </div>
                      <span className="block" style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 400, fontSize: "11px", lineHeight: "1.6", letterSpacing: "-0.02em", color: t.textSecondary }}>{ev.summary}</span>
                      {ev.timestamp && <span className="block mt-1.5" style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 500, fontSize: "9px", letterSpacing: "-0.02em", color: t.textFaint }}>{ev.timestamp}</span>}
                    </motion.div>
                  ))}
                </div>

                {selected.timeline.filter(e => ["system", "auto", "admin", ...(selected.disputeType !== "hotel_driver" ? [] : [])].includes(e.type)).length > 0 && (
                  <>
                    <span className="block mt-5 mb-2" style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 500, fontSize: "9px", letterSpacing: "0.06em", textTransform: "uppercase" as const, color: t.textFaint }}>
                      SYSTEM TIMELINE
                    </span>
                    <div className="relative">
                      <div className="absolute left-[3px] top-2 bottom-0 w-px" style={{ background: t.borderSubtle }} />
                      {selected.timeline
                        .filter(e => ["system", "auto", "admin"].includes(e.type))
                        .map((event, i) => {
                          const dotColor = event.type === "auto" ? STATUS.error : event.type === "admin" ? STATUS.warning : t.textFaint;
                          return (
                            <motion.div key={event.id} className="relative flex items-start gap-3 mb-3"
                              initial={{ opacity: 0, x: -4 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.25 + i * 0.04 }}
                            >
                              <div className="relative z-10 w-1.5 h-1.5 rounded-full mt-1.5 shrink-0" style={{ background: dotColor }} />
                              <div className="min-w-0">
                                <span className="block" style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 500, fontSize: "10px", letterSpacing: "-0.02em", color: t.textSecondary }}>{event.title}</span>
                                {event.detail && <span style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 400, fontSize: "10px", letterSpacing: "-0.02em", color: t.textMuted }}>{event.detail}</span>}
                                <span className="block" style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 500, fontSize: "8px", letterSpacing: "-0.02em", color: t.textFaint }}>{event.timestamp}</span>
                              </div>
                            </motion.div>
                          );
                        })}
                    </div>
                  </>
                )}
              </div>

              {/* ── RIGHT COLUMN (Accused side) ── */}
              <div className="flex-1 flex flex-col overflow-y-auto scrollbar-hide p-4" style={{ borderLeft: `1px solid ${t.borderSubtle}`, borderRight: `1px solid ${t.border}` }}>
                {/* Type A & B: Driver is on the right (accused) */}
                {(selected.disputeType === "rider_driver" || selected.disputeType === "hotel_driver") && (
                  <>
                    <PartyCard party={selected.driver} role="DRIVER" accent={BRAND.green} t={t} joinLabel={`Since ${selected.driver.joinDate}`} suspended={suspendedDrivers.has(selected.driver.name)} onNameClick={openProfile} />
                    {selected.fleet && <FleetBadge fleet={selected.fleet} t={t} />}
                    <SectionLabel color={BRAND.green}>DRIVER'S EVIDENCE</SectionLabel>
                    <EvidenceList evidence={selected.evidence.filter(e => e.source === "driver")} accentColor={BRAND.green} t={t} />
                    <SectionLabel color={BRAND.green}>DRIVER'S ACTIONS</SectionLabel>
                    <TimelineDots events={selected.timeline.filter(e => e.type === "driver")} dotColor={BRAND.green} t={t} />
                    <RiskSignal driver={selected.driver} t={t} />
                  </>
                )}

                {/* Type D: Hotel+Guest is on the right (accused) */}
                {selected.disputeType === "driver_hotel_guest" && (
                  <>
                    {selected.hotel && (
                      <HotelPartyCard hotel={selected.hotel} accent={HOTEL_ACCENT} t={t} onNameClick={openProfile} />
                    )}
                    {selected.guest && (
                      <GuestInfoCard guest={selected.guest} accent={HOTEL_ACCENT} t={t} />
                    )}
                    <SectionLabel color={HOTEL_ACCENT}>HOTEL'S EVIDENCE</SectionLabel>
                    <EvidenceList evidence={selected.evidence.filter(e => e.source === "hotel")} accentColor={HOTEL_ACCENT} t={t} />
                    <SectionLabel color={HOTEL_ACCENT}>HOTEL TIMELINE</SectionLabel>
                    <TimelineDots events={selected.timeline.filter(e => e.type === "hotel")} dotColor={HOTEL_ACCENT} t={t} />
                    {/* Rider evidence if guest submitted any */}
                    {selected.evidence.filter(e => e.source === "rider").length > 0 && (
                      <>
                        <SectionLabel color={STATUS.info}>GUEST'S EVIDENCE</SectionLabel>
                        <EvidenceList evidence={selected.evidence.filter(e => e.source === "rider")} accentColor={STATUS.info} t={t} />
                      </>
                    )}
                  </>
                )}
              </div>

              {/* ═══ RESOLUTION PANEL ═══ */}
              <div className="w-full md:w-[260px] shrink-0 flex flex-col overflow-y-auto scrollbar-hide" style={{ background: t.overlay }}>
                <div className="px-4 py-3 shrink-0" style={{ borderBottom: `1px solid ${t.borderSubtle}` }}>
                  <span style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 600, fontSize: "13px", letterSpacing: "-0.03em", color: t.text }}>Resolution</span>
                </div>
                <div className="p-4 flex-1 flex flex-col">
                  <span className="block mb-2" style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 500, fontSize: "9px", letterSpacing: "0.06em", textTransform: "uppercase" as const, color: t.textFaint }}>VERDICT</span>

                  {getVerdictOptions(selected, t).map((action, i) => {
                    const isActive = activeVerdict === action.id;
                    const isDisabled = resolvedDisputes.has(selected.id);
                    return (
                      <motion.button
                        key={action.id}
                        className="w-full flex items-center gap-3 px-3 py-3 rounded-xl mb-2 text-left transition-all"
                        style={{
                          background: isActive ? `${action.color}12` : "transparent",
                          border: `1px solid ${isActive ? `${action.color}30` : t.borderSubtle}`,
                          boxShadow: isActive ? `0 0 16px ${action.color}08` : "none",
                          opacity: isDisabled ? 0.35 : 1,
                          cursor: isDisabled ? "not-allowed" : "pointer",
                        }}
                        onClick={() => !isDisabled && setActiveVerdict(isActive ? null : action.id)}
                        onMouseEnter={e => { if (!isActive && !isDisabled) { e.currentTarget.style.borderColor = `${action.color}30`; e.currentTarget.style.background = t.surfaceHover; } }}
                        onMouseLeave={e => { if (!isActive && !isDisabled) { e.currentTarget.style.borderColor = t.borderSubtle; e.currentTarget.style.background = "transparent"; } }}
                        initial={{ opacity: 0, x: 6 }} animate={{ opacity: isDisabled ? 0.35 : 1, x: 0 }} transition={{ delay: 0.2 + i * 0.04 }}
                      >
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: `${action.color}12` }}>
                          <action.icon size={14} style={{ color: action.color }} />
                        </div>
                        <div className="min-w-0">
                          <span className="block" style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 500, fontSize: "12px", letterSpacing: "-0.02em", color: isActive ? action.color : t.text }}>{action.label}</span>
                          <span className="block truncate" style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 500, fontSize: "9px", letterSpacing: "-0.02em", color: t.textMuted }}>{action.desc}</span>
                        </div>
                      </motion.button>
                    );
                  })}

                  <AnimatePresence>
                    {activeVerdict && !resolvedDisputes.has(selected.id) && (
                      <motion.button
                        className="w-full h-11 rounded-xl flex items-center justify-center gap-2 mb-5 mt-1"
                        style={{ background: BRAND.green, minHeight: 44 }}
                        initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 6 }}
                        onClick={() => setShowResolutionModal(true)}
                      >
                        <CheckCircle2 size={14} style={{ color: "#FFFFFF" }} />
                        <span style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 500, fontSize: "12px", letterSpacing: "-0.02em", color: "#FFFFFF" }}>Confirm Resolution</span>
                      </motion.button>
                    )}
                  </AnimatePresence>

                  <div className="h-px my-1 mb-3" style={{ background: t.borderSubtle }} />

                  <span className="block mb-2" style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 500, fontSize: "9px", letterSpacing: "0.06em", textTransform: "uppercase" as const, color: t.textFaint }}>ACTIONS</span>
                  {getActionOptions(selected, t, openContact, () => setShowSuspendModal(true), suspendedDrivers).map(a => (
                    <div key={a.label} className="relative">
                      <button
                        className="w-full flex items-center gap-2.5 px-3 h-10 rounded-lg mb-1 transition-colors text-left"
                        style={{
                          minHeight: 44,
                          opacity: a.disabled ? 0.35 : 1,
                          cursor: a.disabled ? "default" : "pointer",
                        }}
                        onMouseEnter={e => { if (!a.disabled) e.currentTarget.style.background = t.surfaceHover; }}
                        onMouseLeave={e => { if (!a.disabled) e.currentTarget.style.background = "transparent"; }}
                        onClick={a.disabled ? undefined : a.action}
                        disabled={a.disabled}
                      >
                        <a.icon size={12} style={{ color: a.disabled ? t.textGhost : a.color }} />
                        <span style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 500, fontSize: "11px", letterSpacing: "-0.02em", color: a.disabled ? t.textGhost : a.color }}>
                          {a.label}
                        </span>
                        {a.disabled && a.label === "View full trip replay" && (
                          <span className="px-1.5 py-0.5 rounded ml-auto" style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 500, fontSize: "8px", color: t.textFaint, background: t.surface }}>
                            Coming soon
                          </span>
                        )}
                        {a.disabled && a.label === "Suspend driver" && (
                          <span className="px-1.5 py-0.5 rounded ml-auto" style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 500, fontSize: "8px", color: STATUS.error, background: t.errorBg }}>
                            Suspended
                          </span>
                        )}
                        {!a.disabled && (
                          <ChevronRight size={10} className="ml-auto" style={{ color: t.textGhost }} />
                        )}
                      </button>
                    </div>
                  ))}

                  <div className="mt-auto pt-4">
                    <span className="block mb-2" style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 500, fontSize: "9px", letterSpacing: "0.06em", textTransform: "uppercase" as const, color: t.textFaint }}>TAGS</span>
                    <div className="flex flex-wrap gap-1.5">
                      {selected.tags.map(tag => (
                        <span key={tag} className="px-2 py-1 rounded-md" style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 500, fontSize: "9px", letterSpacing: "-0.02em", color: t.textMuted, background: t.surface }}>{tag}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══ SURFACE OVERLAYS ═══ */}

      {/* Resolution Confirmation — CENTER MODAL (high-friction) */}
      {selected && activeVerdict && (
        <ResolutionConfirmation
          open={showResolutionModal}
          onClose={() => setShowResolutionModal(false)}
          dispute={selected}
          verdict={activeVerdict as VerdictType}
          onConfirm={handleConfirmResolution}
        />
      )}

      {/* Contact Drawer — SIDE DRAWER (low-friction) */}
      {selected && (
        <ContactDrawer
          open={showContactDrawer}
          onClose={() => setShowContactDrawer(false)}
          dispute={selected}
          target={contactTarget}
          onSend={handleContactSend}
        />
      )}

      {/* Suspend Driver — CENTER MODAL (high-friction) */}
      {selected && (
        <SuspendDriver
          open={showSuspendModal}
          onClose={() => setShowSuspendModal(false)}
          dispute={selected}
          onConfirm={handleSuspendConfirm}
        />
      )}

      {/* Profile drawer — cross-surface */}
      <ProfileDrawer
        open={showProfileDrawer}
        onClose={() => setShowProfileDrawer(false)}
        profile={profileDrawerData}
      />
    </div>
  );
}

/* ═══ Sub-components ═══ */

function SectionLabel({ color, children }: { color: string; children: React.ReactNode }) {
  return (
    <span className="block mb-2" style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 500, fontSize: "9px", letterSpacing: "0.06em", textTransform: "uppercase" as const, color }}>
      {children}
    </span>
  );
}

function EvidenceList({ evidence, accentColor, t }: { evidence: any[]; accentColor: string; t: any }) {
  if (evidence.length === 0) {
    return (
      <div className="rounded-xl p-4 text-center mb-4" style={{ background: t.surface }}>
        <span style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 400, fontSize: "11px", color: t.textFaint }}>No evidence submitted</span>
      </div>
    );
  }
  return (
    <div className="space-y-2 mb-4">
      {evidence.map((ev: any, i: number) => (
        <motion.div key={ev.id} className="rounded-xl p-3" style={{ background: t.surfaceRaised, border: `1px solid ${t.borderSubtle}` }}
          initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 + i * 0.04 }}
        >
          <span className="block mb-0.5" style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 500, fontSize: "11px", letterSpacing: "-0.02em", color: accentColor }}>{ev.label}</span>
          <span style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 400, fontSize: "11px", lineHeight: "1.5", letterSpacing: "-0.02em", color: t.textMuted }}>{ev.summary}</span>
          {ev.timestamp && <span className="block mt-1" style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 500, fontSize: "9px", letterSpacing: "-0.02em", color: t.textFaint }}>{ev.timestamp}</span>}
        </motion.div>
      ))}
    </div>
  );
}

function TimelineDots({ events, dotColor, t }: { events: any[]; dotColor: string; t: any }) {
  if (events.length === 0) {
    return (
      <div className="rounded-xl p-3 text-center mb-4" style={{ background: t.surface }}>
        <span style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 400, fontSize: "11px", color: t.textFaint }}>No actions recorded</span>
      </div>
    );
  }
  return (
    <div className="mb-4">
      {events.map((event: any) => (
        <div key={event.id} className="flex items-start gap-2 mb-2.5">
          <div className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0" style={{ background: dotColor }} />
          <div>
            <span className="block" style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 500, fontSize: "11px", letterSpacing: "-0.02em", color: t.textSecondary }}>{event.title}</span>
            {event.detail && <span style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 400, fontSize: "10px", letterSpacing: "-0.02em", color: t.textMuted }}>{event.detail}</span>}
            <span className="block" style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 500, fontSize: "9px", letterSpacing: "-0.02em", color: t.textFaint }}>{event.timestamp}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

function StatementBlock({ text, t }: { text: string; t: any }) {
  return (
    <div className="rounded-xl p-3 mb-4" style={{ background: t.surfaceRaised, border: `1px solid ${t.borderSubtle}` }}>
      <span style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 400, fontSize: "12px", lineHeight: "1.6", letterSpacing: "-0.02em", color: t.textSecondary }}>
        &ldquo;{text}&rdquo;
      </span>
    </div>
  );
}

function PartyCard({ party, role, accent, t, joinLabel, suspended, onNameClick }: { party: import("../../../config/dispute-mock-data").DisputeParty; role: string; accent: string; t: any; joinLabel: string; suspended?: boolean; onNameClick?: (name: string) => void }) {
  return (
    <motion.div
      className="rounded-2xl p-4 mb-4"
      style={{ background: `${accent}05`, border: `1px solid ${accent}12` }}
      initial={{ opacity: 0, x: role.includes("FILER") ? -12 : 12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.08 }}
    >
      <div className="flex items-center gap-3 mb-3">
        <div className="w-11 h-11 rounded-full flex items-center justify-center" style={{ background: `${accent}12` }}>
          <span style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 500, fontSize: "13px", color: accent }}>{party.avatar}</span>
        </div>
        <div>
          <button
            className="block text-left transition-opacity hover:opacity-70"
            onClick={() => onNameClick?.(party.name)}
            style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 600, fontSize: "13px", letterSpacing: "-0.03em", color: t.text, background: "none", border: "none", padding: 0, cursor: "pointer", textDecoration: "none", borderBottom: `1px dashed ${t.borderSubtle}` }}
          >
            {party.name}
          </button>
          <div className="flex items-center gap-2">
            <span style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 500, fontSize: "9px", letterSpacing: "0.04em", textTransform: "uppercase" as const, color: accent }}>{role} · {joinLabel}</span>
            {suspended && (
              <span className="px-1.5 py-0.5 rounded" style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 500, fontSize: "8px", color: STATUS.error, background: `${STATUS.error}10` }}>Suspended</span>
            )}
          </div>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {[
          { label: "Rating", value: `${party.rating}`, color: party.rating < 4.3 ? STATUS.warning : t.text },
          { label: "Trips", value: `${party.totalTrips}`, color: t.text },
          { label: "Disputes", value: `${party.disputeHistory}`, color: party.disputeHistory >= 5 ? STATUS.error : party.disputeHistory === 0 ? BRAND.green : t.text },
        ].map(s => (
          <div key={s.label} className="p-2 rounded-lg text-center" style={{ background: t.surface }}>
            <span className="block" style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 500, fontSize: "15px", letterSpacing: "-0.02em", color: s.color }}>{s.value}</span>
            <span style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 500, fontSize: "8px", letterSpacing: "0.04em", textTransform: "uppercase" as const, color: t.textFaint }}>{s.label}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

function HotelPartyCard({ hotel, accent, t, onNameClick }: { hotel: import("../../../config/dispute-mock-data").HotelParty; accent: string; t: any; onNameClick?: (name: string) => void }) {
  const tierColors: Record<string, string> = { gold: "#F59E0B", silver: "#94A3B8", bronze: "#D97706" };
  return (
    <motion.div
      className="rounded-2xl p-4 mb-4"
      style={{ background: `${accent}05`, border: `1px solid ${accent}12` }}
      initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.08 }}
    >
      <div className="flex items-center gap-3 mb-3">
        <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: `${accent}12` }}>
          <Building2 size={18} style={{ color: accent }} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <button
              className="block truncate text-left transition-opacity hover:opacity-70"
              onClick={() => onNameClick?.(hotel.name)}
              style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 600, fontSize: "13px", letterSpacing: "-0.03em", color: t.text, background: "none", border: "none", padding: 0, cursor: "pointer", borderBottom: `1px dashed ${t.borderSubtle}` }}
            >
              {hotel.name}
            </button>
            <span className="px-1.5 py-0.5 rounded shrink-0" style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 500, fontSize: "8px", letterSpacing: "0.04em", textTransform: "uppercase" as const, color: tierColors[hotel.tier] || accent, background: `${tierColors[hotel.tier] || accent}12` }}>
              {hotel.tier}
            </span>
          </div>
          <span style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 500, fontSize: "9px", letterSpacing: "0.04em", textTransform: "uppercase" as const, color: accent }}>HOTEL PARTNER</span>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2 mb-3">
        {[
          { label: "Bookings", value: `${hotel.totalBookings}`, color: t.text },
          { label: "Disputes", value: `${hotel.disputeHistory}`, color: hotel.disputeHistory === 0 ? BRAND.green : t.text },
        ].map(s => (
          <div key={s.label} className="p-2 rounded-lg text-center" style={{ background: t.surface }}>
            <span className="block" style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 500, fontSize: "15px", letterSpacing: "-0.02em", color: s.color }}>{s.value}</span>
            <span style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 500, fontSize: "8px", letterSpacing: "0.04em", textTransform: "uppercase" as const, color: t.textFaint }}>{s.label}</span>
          </div>
        ))}
      </div>
      <div className="space-y-1">
        <span className="block" style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 400, fontSize: "10px", letterSpacing: "-0.02em", color: t.textMuted }}>{hotel.address}</span>
        <span className="block" style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 500, fontSize: "10px", letterSpacing: "-0.02em", color: t.textSecondary }}>{hotel.contactPerson}</span>
      </div>
    </motion.div>
  );
}

function GuestInfoCard({ guest, accent, t }: { guest: import("../../../config/dispute-mock-data").GuestInfo; accent: string; t: any }) {
  return (
    <motion.div
      className="rounded-xl p-3 mb-4 flex items-center gap-3"
      style={{ background: t.surfaceRaised, border: `1px solid ${t.borderSubtle}` }}
      initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.14 }}
    >
      <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0" style={{ background: `${accent}10` }}>
        <span style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 500, fontSize: "11px", color: accent }}>{guest.avatar}</span>
      </div>
      <div className="flex-1 min-w-0">
        <span className="block" style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 500, fontSize: "12px", letterSpacing: "-0.02em", color: t.text }}>{guest.name}</span>
        <div className="flex items-center gap-2">
          <span style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 500, fontSize: "9px", letterSpacing: "-0.02em", color: t.textMuted }}>Room {guest.roomNumber}</span>
          <span style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 500, fontSize: "9px", color: t.textGhost }}>·</span>
          <span style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 500, fontSize: "9px", letterSpacing: "-0.02em", color: t.textMuted }}>{guest.checkIn} → {guest.checkOut}</span>
        </div>
      </div>
      <BedDouble size={14} style={{ color: t.textFaint }} />
    </motion.div>
  );
}

function FleetBadge({ fleet, t }: { fleet: { name: string; id: string; vehicleCount: number }; t: any }) {
  return (
    <motion.div
      className="rounded-xl p-2.5 mb-4 flex items-center gap-2.5"
      style={{ background: `${STATUS.warning}08`, border: `1px solid ${STATUS.warning}15` }}
      initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 }}
    >
      <Car size={13} style={{ color: STATUS.warning }} />
      <div className="flex-1 min-w-0">
        <span className="block" style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 500, fontSize: "11px", letterSpacing: "-0.02em", color: t.text }}>{fleet.name}</span>
        <span style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 500, fontSize: "9px", letterSpacing: "-0.02em", color: t.textMuted }}>{fleet.id} · {fleet.vehicleCount} vehicles</span>
      </div>
    </motion.div>
  );
}

function RiskSignal({ driver, t }: { driver: import("../../../config/dispute-mock-data").DisputeParty; t: any }) {
  if (driver.disputeHistory < 3) return null;
  return (
    <motion.div className="mt-4 p-3 rounded-xl" style={{ background: t.errorBg, border: `1px solid ${t.errorBorder}` }}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }}
    >
      <div className="flex items-center gap-2 mb-1">
        <AlertTriangle size={12} style={{ color: STATUS.error }} />
        <span style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 500, fontSize: "11px", letterSpacing: "-0.02em", color: STATUS.error }}>Risk Signal</span>
      </div>
      <span style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 400, fontSize: "10px", letterSpacing: "-0.02em", color: t.textMuted }}>
        {driver.disputeHistory} previous disputes on record.{driver.rating < 4.3 ? " Rating below 4.3 threshold." : ""}
      </span>
    </motion.div>
  );
}

/* ═══ Adaptive verdict & action options ═══ */

function getVerdictOptions(dispute: Dispute, _t: any) {
  if (dispute.disputeType === "rider_driver") {
    return [
      { id: "rider" as VerdictType, label: "Favor rider", desc: `Refund ${formatNaira(dispute.trip.fare)} to rider`, icon: User, color: STATUS.info },
      { id: "driver" as VerdictType, label: "Favor driver", desc: "Close dispute, no refund", icon: Shield, color: BRAND.green },
      { id: "split" as VerdictType, label: "Split resolution", desc: "Partial refund to rider", icon: RefreshCcw, color: STATUS.warning },
    ];
  }
  
  if (dispute.disputeType === "hotel_driver") {
    return [
      { id: "rider" as VerdictType, label: "Favor hotel/guest", desc: `Compensate hotel partner + guest credit`, icon: Building2, color: HOTEL_ACCENT },
      { id: "driver" as VerdictType, label: "Favor driver", desc: "Close dispute, no action against driver", icon: Shield, color: BRAND.green },
      { id: "split" as VerdictType, label: "Split resolution", desc: "Partial compensation + driver warning", icon: RefreshCcw, color: STATUS.warning },
    ];
  }
  
  // driver_hotel_guest
  return [
    { id: "driver" as VerdictType, label: "Favor driver", desc: `Charge guest ${dispute.amount ? formatNaira(dispute.amount) : "cleaning fee"}`, icon: Shield, color: BRAND.green },
    { id: "rider" as VerdictType, label: "Favor guest", desc: "Close dispute, no charge to guest", icon: User, color: STATUS.info },
    { id: "split" as VerdictType, label: "Split resolution", desc: "Partial fee charged to hotel account", icon: RefreshCcw, color: STATUS.warning },
  ];
}

function getActionOptions(
  dispute: Dispute,
  t: any,
  openContact: (target: "rider" | "driver" | "hotel") => void,
  openSuspend: () => void,
  suspendedDrivers: Set<string>,
) {
  const common = [
    { label: "Request more evidence", icon: Camera, color: t.textTertiary, action: () => openContact("rider"), disabled: false },
    { label: "View full trip replay", icon: Eye, color: t.textGhost, action: () => {}, disabled: true },
  ];

  if (dispute.disputeType === "rider_driver") {
    return [
      ...common,
      { label: "Contact rider", icon: Phone, color: STATUS.info, action: () => openContact("rider"), disabled: false },
      { label: "Contact driver", icon: Phone, color: BRAND.green, action: () => openContact("driver"), disabled: false },
      { label: "Suspend driver", icon: Ban, color: STATUS.error, action: openSuspend, disabled: suspendedDrivers.has(dispute.driver.name) },
    ];
  }

  if (dispute.disputeType === "hotel_driver") {
    return [
      ...common,
      { label: "Contact hotel", icon: Phone, color: HOTEL_ACCENT, action: () => openContact("hotel"), disabled: false },
      { label: "Contact driver", icon: Phone, color: BRAND.green, action: () => openContact("driver"), disabled: false },
      { label: "Contact guest", icon: Phone, color: STATUS.info, action: () => openContact("rider"), disabled: false },
      { label: "Suspend driver", icon: Ban, color: STATUS.error, action: openSuspend, disabled: suspendedDrivers.has(dispute.driver.name) },
    ];
  }

  // driver_hotel_guest
  return [
    ...common,
    { label: "Contact driver", icon: Phone, color: BRAND.green, action: () => openContact("driver"), disabled: false },
    { label: "Contact hotel", icon: Phone, color: HOTEL_ACCENT, action: () => openContact("hotel"), disabled: false },
    { label: "Contact guest", icon: Phone, color: STATUS.info, action: () => openContact("rider"), disabled: false },
  ];
}