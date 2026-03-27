/**
 * HOTEL — RIDES TAB
 *
 * One job: See all rides — active and historical.
 * Linear/Stripe-style data table with filters.
 *
 * Data source: trips WHERE booking_source = 'hotel' AND hotel_id = current
 */

import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Car, Search, Filter, MapPin, Clock, ChevronRight, Zap, ArrowUpDown, AlertTriangle, RotateCcw, Phone, X } from "lucide-react";
import { useAdminTheme, BRAND, TY, STATUS } from "../config/admin-theme";
import { MOCK_HOTEL, type HotelRide } from "../config/hotel-mock-data";
import { StatusDot } from "../components/fleet/driver-card";
import { DetailDrawer } from "../components/detail-drawer";
import { Toast } from "../components/shared/toast";
import { TableSkeleton } from "../components/shared/view-skeleton";
import { ErrorState } from "../components/shared/error-state";

const data = MOCK_HOTEL;

function rideStatusColor(s: HotelRide["status"]): string {
  switch (s) {
    case "completed": return BRAND.green;
    case "in_progress": return STATUS.info;
    case "driver_assigned": return STATUS.warning;
    case "requested": return "#8B5CF6";
    case "cancelled": return STATUS.error;
    case "reassigning": return "#F59E0B";
    default: return "#555";
  }
}

function rideStatusLabel(s: HotelRide["status"]): string {
  switch (s) {
    case "completed": return "Completed";
    case "in_progress": return "In Progress";
    case "driver_assigned": return "Assigned";
    case "requested": return "Requested";
    case "cancelled": return "Cancelled";
    case "reassigning": return "Reassigning";
    default: return s;
  }
}

type FilterStatus = "all" | HotelRide["status"];

export function HotelRides() {
  const { t, theme } = useAdminTheme();
  const isDark = theme === "dark";

  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("all");
  const [sortBy, setSortBy] = useState<"recent" | "fare">("recent");
  const [selectedRide, setSelectedRide] = useState<HotelRide | null>(null);
  const [toastMsg, setToastMsg] = useState<{ msg: string; type: "success" | "info" | "error" } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  const filtered = useMemo(() => {
    let rides = [...data.rides];
    if (filterStatus !== "all") rides = rides.filter(r => r.status === filterStatus);
    if (search.trim()) {
      const q = search.toLowerCase();
      rides = rides.filter(r =>
        r.guestName.toLowerCase().includes(q) ||
        r.roomNumber.includes(q) ||
        r.dropoff.toLowerCase().includes(q) ||
        (r.driverName?.toLowerCase().includes(q) ?? false)
      );
    }
    if (sortBy === "fare") rides.sort((a, b) => b.fare - a.fare);
    return rides;
  }, [search, filterStatus, sortBy]);

  const FILTERS: { id: FilterStatus; label: string; count: number }[] = [
    { id: "all", label: "All", count: data.rides.length },
    { id: "in_progress", label: "Active", count: data.rides.filter(r => r.status === "in_progress" || r.status === "driver_assigned" || r.status === "requested" || r.status === "reassigning").length },
    { id: "reassigning", label: "Reassigning", count: data.rides.filter(r => r.status === "reassigning").length },
    { id: "completed", label: "Completed", count: data.rides.filter(r => r.status === "completed").length },
    { id: "cancelled", label: "Cancelled", count: data.rides.filter(r => r.status === "cancelled").length },
  ];

  if (isLoading) return <TableSkeleton />;
  if (isError) return <ErrorState onRetry={() => { setIsError(false); setIsLoading(true); setTimeout(() => setIsLoading(false), 500); }} />;

  return (
    <div className="h-full flex flex-col relative overflow-hidden">

      {/* Toolbar */}
      <div className="px-4 py-3 flex flex-col sm:flex-row sm:items-center gap-3 shrink-0" style={{ borderBottom: `1px solid ${t.borderSubtle}` }}>
        <h2 style={{
          fontFamily: "'Montserrat', sans-serif", fontWeight: 600,
          fontSize: "14px", letterSpacing: "-0.03em", color: t.text, lineHeight: "1.2",
        }}>
          Rides
        </h2>

        {/* Filters */}
        <div className="flex items-center gap-1.5">
          {FILTERS.map(f => {
            const active = filterStatus === f.id || (filterStatus === "all" && f.id === "all") ||
              (f.id === "in_progress" && ["in_progress", "driver_assigned", "requested", "reassigning"].includes(filterStatus));
            const isActive = filterStatus === f.id;
            return (
              <button
                key={f.id}
                onClick={() => setFilterStatus(f.id)}
                className="px-2.5 py-1.5 rounded-lg cursor-pointer"
                style={{
                  background: isActive ? (isDark ? `${BRAND.green}08` : `${BRAND.green}04`) : "transparent",
                  border: `1px solid ${isActive ? `${BRAND.green}14` : "transparent"}`,
                }}
              >
                <span style={{ ...TY.body, fontSize: "10px", color: isActive ? BRAND.green : t.textMuted, lineHeight: "1.4", letterSpacing: "-0.02em" }}>
                  {f.label}
                </span>
                <span className="ml-1" style={{ ...TY.bodyR, fontSize: "9px", color: isActive ? BRAND.green : t.textFaint, lineHeight: "1.5" }}>
                  {f.count}
                </span>
              </button>
            );
          })}
        </div>

        <div className="flex-1" />

        {/* Search */}
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl" style={{ border: `1px solid ${t.borderSubtle}`, maxWidth: 240 }}>
          <Search size={12} style={{ color: t.textFaint }} />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search guest, room, driver..."
            className="flex-1 bg-transparent outline-none"
            style={{ ...TY.bodyR, fontSize: "11px", color: t.text, lineHeight: "1.4" }}
          />
        </div>

        {/* Sort */}
        <button
          onClick={() => setSortBy(s => s === "recent" ? "fare" : "recent")}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg cursor-pointer"
          style={{ border: `1px solid ${t.borderSubtle}` }}
        >
          <ArrowUpDown size={10} style={{ color: t.textFaint }} />
          <span style={{ ...TY.bodyR, fontSize: "10px", color: t.textMuted, lineHeight: "1.4" }}>
            {sortBy === "recent" ? "Recent" : "Fare ↓"}
          </span>
        </button>
      </div>


      {/* Table */}
      <div className="flex-1 overflow-y-auto">
        {filtered.length === 0 ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <Car size={24} style={{ color: t.textFaint, margin: "0 auto 8px" }} />
              <span style={{ ...TY.bodyR, fontSize: "12px", color: t.textMuted }}>No rides found</span>
            </div>
          </div>
        ) : (
          <div>
            {filtered.map((ride, i) => {
              const statusColor = rideStatusColor(ride.status);
              return (
                <motion.div
                  key={ride.id}
                  className="cursor-pointer"
                  onClick={() => setSelectedRide(ride)}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.02 }}
                >
                  <div
                    className="flex items-center gap-3 px-4 py-3"
                    style={{
                      borderBottom: `1px solid ${isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.03)"}`,
                      background: selectedRide?.id === ride.id
                        ? (isDark ? "rgba(29,185,84,0.03)" : "rgba(29,185,84,0.015)")
                        : ride.status === "reassigning"
                          ? (isDark ? "rgba(245,158,11,0.03)" : "rgba(245,158,11,0.02)")
                          : "transparent",
                    }}
                  >
                    {/* Status dot */}
                    <StatusDot color={statusColor} size={6} pulse={ride.status === "in_progress" || ride.status === "reassigning"} />

                    {/* Guest info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="truncate" style={{ ...TY.body, fontSize: "11px", color: t.text, lineHeight: "1.4", letterSpacing: "-0.02em" }}>
                          {ride.guestName}
                        </span>
                        <span className="px-1.5 py-0.5 rounded-md shrink-0" style={{
                          ...TY.bodyR, fontSize: "8px", background: isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)", color: t.textFaint, lineHeight: "1.5",
                        }}>
                          {ride.roomNumber}
                        </span>
                        {ride.vehicleType === "EV" && (
                          <span className="px-1 py-0.5 rounded shrink-0" style={{
                            fontFamily: "'Montserrat', sans-serif", fontWeight: 600, fontSize: "7px",
                            background: `${BRAND.green}10`, color: BRAND.green, lineHeight: "1.2",
                          }}>EV</span>
                        )}
                      </div>
                      <span style={{ ...TY.bodyR, fontSize: "9px", color: t.textFaint, lineHeight: "1.5" }}>
                        {ride.dropoff} · {ride.requestedAt}
                      </span>
                      {/* Inline reassignment info */}
                      {ride.status === "reassigning" && ride.reassignment && (
                        <div className="flex items-center gap-1.5 mt-1">
                          <RotateCcw size={8} style={{ color: "#F59E0B" }} className="animate-spin" />
                          <span style={{ ...TY.bodyR, fontSize: "8px", color: "#F59E0B", lineHeight: "1.5" }}>
                            Attempt {ride.reassignment.attempt}/{ride.reassignment.maxAttempts} · {ride.reassignment.cancelReason}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Status badge */}
                    <span className="px-2 py-0.5 rounded-lg shrink-0" style={{
                      ...TY.bodyR, fontSize: "9px", background: `${statusColor}08`, color: statusColor, lineHeight: "1.4",
                    }}>
                      {rideStatusLabel(ride.status)}
                    </span>

                    {/* Fare */}
                    {ride.fare > 0 && (
                      <span className="shrink-0" style={{
                        fontFamily: "'Montserrat', sans-serif", fontWeight: 600,
                        fontSize: "11px", letterSpacing: "-0.02em", color: t.text, lineHeight: "1.2",
                      }}>
                        ₦{ride.fare.toLocaleString()}
                      </span>
                    )}

                    <ChevronRight size={11} style={{ color: t.textFaint }} />
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>


      {/* Detail Drawer */}
      <DetailDrawer open={!!selectedRide} onClose={() => setSelectedRide(null)} ariaLabel="Ride details">
        {selectedRide && <RideDetail ride={selectedRide} onClose={() => setSelectedRide(null)} />}
      </DetailDrawer>

      <AnimatePresence>
        {toastMsg && <Toast message={toastMsg.msg} type={toastMsg.type} onDismiss={() => setToastMsg(null)} />}
      </AnimatePresence>
    </div>
  );
}


// ── Ride Detail Panel ──────────────────────────────────────────────────────

function RideDetail({ ride, onClose }: { ride: HotelRide; onClose: () => void }) {
  const { t, theme } = useAdminTheme();
  const isDark = theme === "dark";
  const statusColor = rideStatusColor(ride.status);

  // Live elapsed timer for reassigning rides
  const [elapsed, setElapsed] = useState(ride.reassignment?.elapsedSeconds ?? 0);
  useEffect(() => {
    if (ride.status !== "reassigning" || !ride.reassignment) return;
    setElapsed(ride.reassignment.elapsedSeconds);
    const iv = setInterval(() => setElapsed(prev => prev + 1), 1000);
    return () => clearInterval(iv);
  }, [ride]);

  const ra = ride.reassignment;
  const timeoutSec = ra?.timeoutSeconds ?? 300;
  const progressPct = ra ? Math.min((elapsed / timeoutSec) * 100, 100) : 0;
  const remainingSec = Math.max(timeoutSec - elapsed, 0);
  const remainMin = Math.floor(remainingSec / 60);
  const remainSecMod = remainingSec % 60;

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-4 py-3 flex items-center justify-between shrink-0" style={{ borderBottom: `1px solid ${t.borderSubtle}` }}>
        <span style={{ ...TY.body, fontSize: "12px", color: t.text, lineHeight: "1.4", letterSpacing: "-0.02em" }}>
          Ride Details
        </span>
        <button onClick={onClose} className="px-2 py-1 rounded-lg cursor-pointer" style={{ border: `1px solid ${t.borderSubtle}` }}>
          <span style={{ ...TY.bodyR, fontSize: "9px", color: t.textMuted }}>Close</span>
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Guest */}
        <div>
          <span className="block mb-1" style={{
            fontFamily: "'Montserrat', sans-serif", fontWeight: 600,
            fontSize: "16px", letterSpacing: "-0.03em", color: t.text, lineHeight: "1.2",
          }}>
            {ride.guestName}
          </span>
          <div className="flex items-center gap-2">
            <span className="px-1.5 py-0.5 rounded-md" style={{
              ...TY.bodyR, fontSize: "9px", background: isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)", color: t.textFaint, lineHeight: "1.5",
            }}>
              Room {ride.roomNumber}
            </span>
            <span className="px-2 py-0.5 rounded-lg" style={{
              ...TY.bodyR, fontSize: "9px", background: `${statusColor}08`, color: statusColor, lineHeight: "1.4",
            }}>
              {rideStatusLabel(ride.status)}
            </span>
          </div>
        </div>

        <div className="h-px" style={{ background: t.borderSubtle }} />

        {/* ── Reassignment Card ── */}
        {ride.status === "reassigning" && ra && (
          <>
            <div
              className="rounded-xl p-3 space-y-3"
              style={{
                background: isDark ? "rgba(245,158,11,0.04)" : "rgba(245,158,11,0.03)",
                border: `1px solid ${isDark ? "rgba(245,158,11,0.12)" : "rgba(245,158,11,0.10)"}`,
              }}
            >
              {/* Title row */}
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ background: "rgba(245,158,11,0.10)" }}>
                  <AlertTriangle size={12} style={{ color: "#F59E0B" }} />
                </div>
                <div>
                  <span className="block" style={{
                    fontFamily: "'Montserrat', sans-serif", fontWeight: 600,
                    fontSize: "11px", letterSpacing: "-0.03em", color: "#F59E0B", lineHeight: "1.2",
                  }}>
                    Driver Cancelled
                  </span>
                  <span style={{ ...TY.bodyR, fontSize: "9px", color: t.textMuted, lineHeight: "1.5" }}>
                    Finding a new driver...
                  </span>
                </div>
              </div>

              {/* Cancel details */}
              <div className="space-y-1.5">
                {[
                  { label: "Previous driver", value: ra.cancelledDriverName },
                  { label: "Reason", value: ra.cancelReason },
                  { label: "Cancelled at", value: ra.cancelledAt },
                ].map(item => (
                  <div key={item.label} className="flex items-center justify-between">
                    <span style={{ ...TY.bodyR, fontSize: "9px", color: t.textMuted, lineHeight: "1.5" }}>{item.label}</span>
                    <span style={{ ...TY.body, fontSize: "10px", color: t.text, lineHeight: "1.4", letterSpacing: "-0.02em" }}>{item.value}</span>
                  </div>
                ))}
              </div>

              {/* Progress bar */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span style={{ ...TY.bodyR, fontSize: "9px", color: t.textMuted, lineHeight: "1.5" }}>
                    Attempt {ra.attempt} of {ra.maxAttempts}
                  </span>
                  <span style={{
                    fontFamily: "'Montserrat', sans-serif", fontWeight: 600,
                    fontSize: "10px", letterSpacing: "-0.02em",
                    color: remainingSec < 60 ? STATUS.error : "#F59E0B", lineHeight: "1.2",
                  }}>
                    {remainMin}:{String(remainSecMod).padStart(2, "0")}
                  </span>
                </div>
                <div className="h-1.5 rounded-full overflow-hidden" style={{ background: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)" }}>
                  <motion.div
                    className="h-full rounded-full"
                    style={{ background: progressPct > 80 ? STATUS.error : "#F59E0B" }}
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPct}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              </div>

              {/* Attempt dots */}
              <div className="flex items-center gap-1.5">
                {Array.from({ length: ra.maxAttempts }).map((_, i) => (
                  <div
                    key={i}
                    className="h-1.5 flex-1 rounded-full"
                    style={{
                      background: i < ra.attempt
                        ? "#F59E0B"
                        : isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)",
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex gap-2">
              <button
                className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl cursor-pointer"
                style={{
                  background: isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.03)",
                  border: `1px solid ${t.borderSubtle}`,
                }}
              >
                <Phone size={10} style={{ color: t.textMuted }} />
                <span style={{ ...TY.body, fontSize: "10px", color: t.textMuted, lineHeight: "1.4", letterSpacing: "-0.02em" }}>
                  Call Guest
                </span>
              </button>
              <button
                className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl cursor-pointer"
                style={{
                  background: `${STATUS.error}08`,
                  border: `1px solid ${STATUS.error}18`,
                }}
              >
                <X size={10} style={{ color: STATUS.error }} />
                <span style={{ ...TY.body, fontSize: "10px", color: STATUS.error, lineHeight: "1.4", letterSpacing: "-0.02em" }}>
                  Cancel Ride
                </span>
              </button>
            </div>
            <button
              className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl cursor-pointer"
              style={{
                background: isDark ? `${BRAND.green}10` : `${BRAND.green}08`,
                border: `1px solid ${BRAND.green}18`,
              }}
            >
              <RotateCcw size={10} style={{ color: BRAND.green }} />
              <span style={{ ...TY.body, fontSize: "10px", color: BRAND.green, lineHeight: "1.4", letterSpacing: "-0.02em" }}>
                Rebook Manually
              </span>
            </button>

            <div className="h-px" style={{ background: t.borderSubtle }} />
          </>
        )}

        {/* Route */}
        <div className="space-y-2">
          <div className="flex items-start gap-2">
            <div className="w-4 h-4 rounded-full flex items-center justify-center mt-0.5" style={{ background: `${BRAND.green}10` }}>
              <div className="w-1.5 h-1.5 rounded-full" style={{ background: BRAND.green }} />
            </div>
            <div>
              <span className="block" style={{ ...TY.bodyR, fontSize: "9px", color: t.textFaint, lineHeight: "1.5" }}>Pickup</span>
              <span style={{ ...TY.body, fontSize: "11px", color: t.text, lineHeight: "1.4", letterSpacing: "-0.02em" }}>{ride.pickup}</span>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <div className="w-4 h-4 rounded-full flex items-center justify-center mt-0.5" style={{ background: isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)" }}>
              <MapPin size={8} style={{ color: t.textFaint }} />
            </div>
            <div>
              <span className="block" style={{ ...TY.bodyR, fontSize: "9px", color: t.textFaint, lineHeight: "1.5" }}>Dropoff</span>
              <span style={{ ...TY.body, fontSize: "11px", color: t.text, lineHeight: "1.4", letterSpacing: "-0.02em" }}>{ride.dropoff}</span>
            </div>
          </div>
        </div>

        <div className="h-px" style={{ background: t.borderSubtle }} />

        {/* Details grid */}
        <div className="space-y-2">
          {[
            { label: "Vehicle", value: ride.vehicleType },
            { label: "Fare", value: ride.fare > 0 ? `₦${ride.fare.toLocaleString()}` : "—" },
            { label: "Driver", value: ride.driverName || "Not assigned" },
            { label: "Rating", value: ride.driverRating > 0 ? `${ride.driverRating} ★` : "—" },
            { label: "Booked by", value: ride.bookedBy },
            { label: "Payment", value: ride.paymentMethod === "hotel_account" ? "Hotel account" : "Guest card" },
            { label: "Requested", value: ride.requestedAt },
            { label: "Completed", value: ride.completedAt || "—" },
          ].map(item => (
            <div key={item.label} className="flex items-center justify-between py-1">
              <span style={{ ...TY.bodyR, fontSize: "10px", color: t.textMuted, lineHeight: "1.5" }}>{item.label}</span>
              <span style={{ ...TY.body, fontSize: "11px", color: t.text, lineHeight: "1.4", letterSpacing: "-0.02em" }}>{item.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}