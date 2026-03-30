/**
 * JET ADMIN — RIDES SURFACE
 *
 * Trip management across all booking sources.
 * Operational view for monitoring live rides, investigating completed trips,
 * and auditing fare calculations.
 *
 * Three view modes (user-selectable):
 *   A "Table"   — Full-width data table, status tabs, row → detail drawer.
 *   B "Map"     — Map + list dual-pane. Click syncs both.
 *   C "Feed"    — Temporal activity feed with progressive disclosure.
 */

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  MapPin, Car, Activity, Wallet, Clock, Star,
  ChevronRight, X, Search,
  Zap, Building2, CreditCard,
  Route, AlertTriangle,
  Radio, Eye,
} from "lucide-react";
import { useAdminTheme, TY, BRAND, STATUS } from "../../../config/admin-theme";
import { ThemeToggle } from "../ui/primitives";
import {
  TRIPS, LIVE_TRIPS, COMPLETED_TRIPS, CANCELLED_TRIPS, RIDES_KPI,
  TRIP_STATUS_META, SOURCE_META, FLAG_META,
  formatNaira, timeAgo,
  type TripRecord, type TripStatus, type BookingSource,
} from "../../../config/rides-mock-data";

/* ═══════════════════════════════════════════════════════════════════════════
   SHARED — Status dot component
   ═══════════════════════════════════════════════════════════════════════════ */

function StatusDot({ status, size = 6 }: { status: TripStatus; size?: number }) {
  const meta = TRIP_STATUS_META[status];
  return (
    <span className="relative inline-flex items-center justify-center" style={{ width: size + 4, height: size + 4 }}>
      {meta.dotPulse && (
        <motion.span
          className="absolute rounded-full"
          style={{ width: size + 4, height: size + 4, background: meta.color, opacity: 0.3 }}
          animate={{ scale: [1, 1.8, 1], opacity: [0.3, 0, 0.3] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      )}
      <span className="rounded-full" style={{ width: size, height: size, background: meta.color }} />
    </span>
  );
}

function FlagBadge({ flag }: { flag: string }) {
  const { theme } = useAdminTheme();
  const isDark = theme === "dark";
  const meta = FLAG_META[flag];
  if (!meta) return null;
  return (
    <span
      className="inline-flex items-center px-1.5 py-0.5 rounded"
      style={{
        background: `${meta.color}${isDark ? "12" : "08"}`,
        border: `1px solid ${meta.color}${isDark ? "20" : "12"}`,
      }}
    >
      <span style={{
        fontFamily: "'Manrope', sans-serif", fontWeight: 500,
        fontSize: "9px", letterSpacing: "-0.01em", color: meta.color,
      }}>{meta.label}</span>
    </span>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   SHARED — Trip detail panel (used by all variations)
   ═══════════════════════════════════════════════════════════════════════════ */

function TripDetail({ trip, onClose }: { trip: TripRecord; onClose: () => void }) {
  const { theme, t } = useAdminTheme();
  const isDark = theme === "dark";
  const meta = TRIP_STATUS_META[trip.status];
  const srcMeta = SOURCE_META[trip.source];

  return (
    <div className="h-full flex flex-col overflow-hidden" style={{ background: t.overlay }}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 shrink-0" style={{ borderBottom: `1px solid ${t.border}` }}>
        <div className="flex items-center gap-2.5">
          <button onClick={onClose} className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: t.surfaceHover }}>
            <X size={13} style={{ color: t.icon }} />
          </button>
          <div>
            <span style={{ ...TY.sub, fontSize: "13px", color: t.text }}>{trip.id}</span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <StatusDot status={trip.status} size={5} />
              <span style={{ ...TY.bodyR, fontSize: "10px", color: meta.color }}>{meta.label}</span>
              <span style={{ ...TY.bodyR, fontSize: "10px", color: t.textFaint }}>·</span>
              <span style={{ ...TY.bodyR, fontSize: "10px", color: t.textFaint }}>{srcMeta.label}</span>
            </div>
          </div>
        </div>
        {trip.fare.total > 0 && (
          <span style={{ ...TY.sub, fontSize: "16px", color: t.text }}>{formatNaira(trip.fare.total)}</span>
        )}
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {/* Route */}
        <div>
          <span style={{ ...TY.label, fontSize: "8px", color: t.textGhost }}>Route</span>
          <div className="mt-2 flex items-start gap-3">
            <div className="flex flex-col items-center gap-1 mt-1">
              <div className="w-2 h-2 rounded-full" style={{ background: BRAND.green }} />
              <div className="w-px h-8" style={{ background: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)" }} />
              <div className="w-2 h-2 rounded-full" style={{ background: STATUS.error }} />
            </div>
            <div className="flex-1 space-y-3">
              <div>
                <span className="block" style={{ ...TY.body, fontSize: "12px", color: t.text }}>{trip.pickup.address}</span>
                <span style={{ ...TY.bodyR, fontSize: "10px", color: t.textFaint }}>{trip.pickup.zone}</span>
              </div>
              <div>
                <span className="block" style={{ ...TY.body, fontSize: "12px", color: t.text }}>{trip.dropoff.address}</span>
                <span style={{ ...TY.bodyR, fontSize: "10px", color: t.textFaint }}>{trip.dropoff.zone}</span>
              </div>
            </div>
          </div>
          {trip.distance > 0 && (
            <div className="flex items-center gap-1.5 mt-2 ml-5">
              <Route size={10} style={{ color: t.textFaint }} />
              <span style={{ ...TY.bodyR, fontSize: "10px", color: t.textMuted }}>{trip.distance} km</span>
              {trip.timing.duration && (
                <>
                  <span style={{ ...TY.bodyR, fontSize: "10px", color: t.textGhost }}>·</span>
                  <span style={{ ...TY.bodyR, fontSize: "10px", color: t.textMuted }}>{trip.timing.duration} min</span>
                </>
              )}
            </div>
          )}
        </div>

        {/* Rider + Driver */}
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl p-3" style={{ background: t.surface, border: `1px solid ${t.borderSubtle}` }}>
            <span style={{ ...TY.label, fontSize: "8px", color: t.textGhost }}>Rider</span>
            <span className="block mt-1" style={{ ...TY.body, fontSize: "12px", color: t.text }}>{trip.rider.name}</span>
            <div className="flex items-center gap-1.5 mt-1">
              <Star size={9} style={{ color: "#F59E0B" }} />
              <span style={{ ...TY.bodyR, fontSize: "10px", color: t.textMuted }}>{trip.rider.rating}</span>
              <span style={{ ...TY.bodyR, fontSize: "10px", color: t.textGhost }}>·</span>
              <span style={{ ...TY.bodyR, fontSize: "10px", color: t.textFaint }}>{trip.rider.totalTrips} trips</span>
            </div>
          </div>
          <div className="rounded-xl p-3" style={{ background: t.surface, border: `1px solid ${t.borderSubtle}` }}>
            <span style={{ ...TY.label, fontSize: "8px", color: t.textGhost }}>Driver</span>
            {trip.driver ? (
              <>
                <span className="block mt-1" style={{ ...TY.body, fontSize: "12px", color: t.text }}>{trip.driver.name}</span>
                <div className="flex items-center gap-1.5 mt-1">
                  <Star size={9} style={{ color: "#F59E0B" }} />
                  <span style={{ ...TY.bodyR, fontSize: "10px", color: t.textMuted }}>{trip.driver.rating}</span>
                  {trip.driver.isEV && (
                    <>
                      <span style={{ ...TY.bodyR, fontSize: "10px", color: t.textGhost }}>·</span>
                      <Zap size={9} style={{ color: BRAND.green }} />
                      <span style={{ ...TY.bodyR, fontSize: "10px", color: BRAND.green }}>EV</span>
                    </>
                  )}
                </div>
              </>
            ) : (
              <span className="block mt-1" style={{ ...TY.bodyR, fontSize: "11px", color: t.textFaint }}>Searching...</span>
            )}
          </div>
        </div>

        {/* Vehicle */}
        {trip.driver && (
          <div className="rounded-xl p-3" style={{ background: t.surface, border: `1px solid ${t.borderSubtle}` }}>
            <span style={{ ...TY.label, fontSize: "8px", color: t.textGhost }}>Vehicle</span>
            <span className="block mt-1" style={{ ...TY.body, fontSize: "12px", color: t.text }}>{trip.driver.vehicle}</span>
            <span style={{ ...TY.bodyR, fontSize: "10px", color: t.textFaint }}>{trip.driver.plate}</span>
          </div>
        )}

        {/* Fare breakdown */}
        {trip.fare.total > 0 && (
          <div className="rounded-xl p-3" style={{ background: t.surface, border: `1px solid ${t.borderSubtle}` }}>
            <span style={{ ...TY.label, fontSize: "8px", color: t.textGhost }}>Fare breakdown</span>
            <div className="mt-2 space-y-1.5">
              <div className="flex justify-between">
                <span style={{ ...TY.bodyR, fontSize: "11px", color: t.textMuted }}>Base fare</span>
                <span style={{ ...TY.body, fontSize: "11px", color: t.text }}>{formatNaira(trip.fare.base)}</span>
              </div>
              <div className="flex justify-between">
                <span style={{ ...TY.bodyR, fontSize: "11px", color: t.textMuted }}>Distance ({trip.distance} km)</span>
                <span style={{ ...TY.body, fontSize: "11px", color: t.text }}>{formatNaira(trip.fare.distance)}</span>
              </div>
              {trip.fare.surge > 0 && (
                <div className="flex justify-between">
                  <span style={{ ...TY.bodyR, fontSize: "11px", color: STATUS.warning }}>Surge</span>
                  <span style={{ ...TY.body, fontSize: "11px", color: STATUS.warning }}>{formatNaira(trip.fare.surge)}</span>
                </div>
              )}
              <div className="h-px" style={{ background: t.border }} />
              <div className="flex justify-between">
                <span style={{ ...TY.body, fontSize: "11px", color: t.text }}>Total</span>
                <span style={{ ...TY.sub, fontSize: "12px", color: t.text }}>{formatNaira(trip.fare.total)}</span>
              </div>
              <div className="flex justify-between">
                <span style={{ ...TY.bodyR, fontSize: "10px", color: t.textFaint }}>JET commission (20%)</span>
                <span style={{ ...TY.bodyR, fontSize: "10px", color: BRAND.green }}>{formatNaira(trip.fare.commission)}</span>
              </div>
            </div>
          </div>
        )}

        {/* Timing */}
        <div className="rounded-xl p-3" style={{ background: t.surface, border: `1px solid ${t.borderSubtle}` }}>
          <span style={{ ...TY.label, fontSize: "8px", color: t.textGhost }}>Timeline</span>
          <div className="mt-2 space-y-2">
            {[
              { label: "Requested", time: trip.timing.requested, color: t.textMuted },
              trip.timing.matched ? { label: "Matched", time: trip.timing.matched, color: STATUS.info } : null,
              trip.timing.pickedUp ? { label: "Picked up", time: trip.timing.pickedUp, color: BRAND.green } : null,
              trip.timing.droppedOff ? { label: "Dropped off", time: trip.timing.droppedOff, color: BRAND.green } : null,
            ].filter(Boolean).map((evt, i) => (
              <div key={i} className="flex items-center gap-2.5">
                <div className="w-1.5 h-1.5 rounded-full" style={{ background: evt!.color }} />
                <span style={{ ...TY.bodyR, fontSize: "10px", color: t.textMuted, minWidth: 60 }}>{evt!.label}</span>
                <span style={{ ...TY.bodyR, fontSize: "10px", color: t.textFaint }}>{timeAgo(evt!.time)}</span>
              </div>
            ))}
            {trip.timing.waitTime !== null && (
              <div className="flex items-center gap-1.5 mt-1">
                <Clock size={9} style={{ color: t.textFaint }} />
                <span style={{ ...TY.bodyR, fontSize: "10px", color: t.textFaint }}>
                  Matched in {trip.timing.waitTime}s
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Payment */}
        <div className="rounded-xl p-3" style={{ background: t.surface, border: `1px solid ${t.borderSubtle}` }}>
          <span style={{ ...TY.label, fontSize: "8px", color: t.textGhost }}>Payment</span>
          <div className="flex items-center justify-between mt-1.5">
            <div className="flex items-center gap-1.5">
              <CreditCard size={11} style={{ color: t.textMuted }} />
              <span style={{ ...TY.body, fontSize: "11px", color: t.text }}>
                {trip.payment.method === "hotel_invoice" ? "Hotel invoice" : trip.payment.method.charAt(0).toUpperCase() + trip.payment.method.slice(1)}
              </span>
            </div>
            <span
              className="px-1.5 py-0.5 rounded"
              style={{
                fontFamily: "'Manrope', sans-serif", fontWeight: 500,
                fontSize: "9px",
                color: trip.payment.status === "paid" ? BRAND.green : trip.payment.status === "refunded" ? STATUS.warning : t.textMuted,
                background: trip.payment.status === "paid" ? `${BRAND.green}12` : trip.payment.status === "refunded" ? `${STATUS.warning}12` : t.surface,
              }}
            >
              {trip.payment.status.charAt(0).toUpperCase() + trip.payment.status.slice(1)}
            </span>
          </div>
          {trip.hotelName && (
            <div className="flex items-center gap-1.5 mt-1.5">
              <Building2 size={9} style={{ color: STATUS.info }} />
              <span style={{ ...TY.bodyR, fontSize: "10px", color: t.textMuted }}>{trip.hotelName}</span>
            </div>
          )}
        </div>

        {/* Ratings */}
        {(trip.riderRating || trip.driverRating) && (
          <div className="grid grid-cols-2 gap-3">
            {trip.riderRating && (
              <div className="rounded-xl p-3" style={{ background: t.surface, border: `1px solid ${t.borderSubtle}` }}>
                <span style={{ ...TY.label, fontSize: "8px", color: t.textGhost }}>Rider → Driver</span>
                <div className="flex items-center gap-1 mt-1">
                  {[1, 2, 3, 4, 5].map(s => (
                    <Star key={s} size={11} style={{ color: s <= trip.riderRating! ? "#F59E0B" : t.textGhost }} fill={s <= trip.riderRating! ? "#F59E0B" : "none"} />
                  ))}
                </div>
              </div>
            )}
            {trip.driverRating && (
              <div className="rounded-xl p-3" style={{ background: t.surface, border: `1px solid ${t.borderSubtle}` }}>
                <span style={{ ...TY.label, fontSize: "8px", color: t.textGhost }}>Driver → Rider</span>
                <div className="flex items-center gap-1 mt-1">
                  {[1, 2, 3, 4, 5].map(s => (
                    <Star key={s} size={11} style={{ color: s <= trip.driverRating! ? "#F59E0B" : t.textGhost }} fill={s <= trip.driverRating! ? "#F59E0B" : "none"} />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Flags */}
        {trip.flags.length > 0 && (
          <div>
            <span style={{ ...TY.label, fontSize: "8px", color: t.textGhost }}>Flags</span>
            <div className="flex flex-wrap gap-1.5 mt-1.5">
              {trip.flags.map(f => <FlagBadge key={f} flag={f} />)}
            </div>
          </div>
        )}

        {/* Cancellation reason */}
        {trip.cancellationReason && (
          <div className="rounded-xl p-3" style={{ background: t.errorBg, border: `1px solid ${t.errorBorder}` }}>
            <span style={{ ...TY.label, fontSize: "8px", color: t.errorText }}>Cancellation reason</span>
            <span className="block mt-1" style={{ ...TY.body, fontSize: "12px", color: t.errorText }}>{trip.cancellationReason}</span>
          </div>
        )}
      </div>
    </div>
  );
}


/* ═══════════════════════════════════════════════════════════════════════════
   VARIATION A — "Operations Table"

   Stripe payments × Linear issues × Vercel deployments.
   Full-width data table. Status tabs at top. Click row → detail drawer right.
   ═══════════════════════════════════════════════════════════════════════════ */

type StatusFilter = "all" | "live" | "completed" | "cancelled";

function VariationA({ onSelectTrip, selectedTrip }: { onSelectTrip: (t: TripRecord | null) => void; selectedTrip: TripRecord | null }) {
  const { theme, t } = useAdminTheme();
  const isDark = theme === "dark";
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sourceFilter, setSourceFilter] = useState<BookingSource | "all">("all");

  const filteredTrips = useMemo(() => {
    let list = TRIPS;
    if (statusFilter === "live") list = list.filter(t => ["matching", "driver_assigned", "en_route_pickup", "in_progress"].includes(t.status));
    else if (statusFilter === "completed") list = list.filter(t => t.status === "completed");
    else if (statusFilter === "cancelled") list = list.filter(t => t.status === "cancelled");
    if (sourceFilter !== "all") list = list.filter(t => t.source === sourceFilter);
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      list = list.filter(t =>
        t.id.toLowerCase().includes(q) ||
        t.rider.name.toLowerCase().includes(q) ||
        (t.driver?.name || "").toLowerCase().includes(q) ||
        t.pickup.address.toLowerCase().includes(q) ||
        t.dropoff.address.toLowerCase().includes(q)
      );
    }
    return list;
  }, [statusFilter, sourceFilter, searchQuery]);

  const tabs: { id: StatusFilter; label: string; count: number; color: string }[] = [
    { id: "all", label: "All trips", count: TRIPS.length, color: t.text },
    { id: "live", label: "Live", count: LIVE_TRIPS.length, color: BRAND.green },
    { id: "completed", label: "Completed", count: COMPLETED_TRIPS.length, color: t.textMuted },
    { id: "cancelled", label: "Cancelled", count: CANCELLED_TRIPS.length, color: STATUS.error },
  ];

  return (
    <div className="flex-1 flex min-h-0">
      {/* Main table area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Tabs + search */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 px-5 py-3 shrink-0" style={{ borderBottom: `1px solid ${t.border}` }}>
          <div className="flex items-center gap-1">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setStatusFilter(tab.id)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors"
                style={{
                  background: statusFilter === tab.id ? (isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.04)") : "transparent",
                  minHeight: 32,
                }}
              >
                {tab.id === "live" && <StatusDot status="in_progress" size={4} />}
                <span style={{
                  ...TY.body, fontSize: "12px",
                  color: statusFilter === tab.id ? tab.color : t.textFaint,
                  fontWeight: statusFilter === tab.id ? 600 : 500,
                }}>
                  {tab.label}
                </span>
                <span style={{
                  fontFamily: "'Manrope', sans-serif", fontWeight: 400,
                  fontSize: "10px", color: t.textGhost,
                }}>{tab.count}</span>
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            {/* Source filter */}
            <div className="flex items-center gap-1 h-8 px-2 rounded-lg" style={{ background: t.surface, border: `1px solid ${t.borderSubtle}` }}>
              {(["all", "rider_app", "hotel_concierge", "scheduled"] as const).map(src => (
                <button
                  key={src}
                  onClick={() => setSourceFilter(src)}
                  className="px-2 py-1 rounded transition-colors"
                  style={{ background: sourceFilter === src ? (isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)") : "transparent" }}
                >
                  <span style={{
                    fontFamily: "'Manrope', sans-serif", fontWeight: sourceFilter === src ? 600 : 400,
                    fontSize: "10px", color: sourceFilter === src ? t.text : t.textFaint,
                  }}>
                    {src === "all" ? "All" : SOURCE_META[src].label}
                  </span>
                </button>
              ))}
            </div>

            {/* Search */}
            <div className="flex items-center gap-1.5 h-8 px-2.5 rounded-lg" style={{ background: t.surface, border: `1px solid ${t.borderSubtle}`, width: 200 }}>
              <Search size={12} style={{ color: t.textFaint }} />
              <input
                type="text"
                placeholder="Search trips..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="flex-1 bg-transparent outline-none"
                style={{ ...TY.bodyR, fontSize: "11px", color: t.text }}
              />
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="flex-1 overflow-y-auto">
          {/* Header */}
          <div className="flex items-center px-5 py-2 shrink-0 sticky top-0 z-10" style={{ background: t.overlay, borderBottom: `1px solid ${t.border}` }}>
            <span className="w-20 shrink-0" style={{ ...TY.label, fontSize: "8px", color: t.textGhost }}>Trip ID</span>
            <span className="w-16 shrink-0" style={{ ...TY.label, fontSize: "8px", color: t.textGhost }}>Status</span>
            <span className="flex-1 min-w-0" style={{ ...TY.label, fontSize: "8px", color: t.textGhost }}>Route</span>
            <span className="w-28 shrink-0 hidden md:block" style={{ ...TY.label, fontSize: "8px", color: t.textGhost }}>Rider</span>
            <span className="w-28 shrink-0 hidden lg:block" style={{ ...TY.label, fontSize: "8px", color: t.textGhost }}>Driver</span>
            <span className="w-16 shrink-0 text-right" style={{ ...TY.label, fontSize: "8px", color: t.textGhost }}>Fare</span>
            <span className="w-14 shrink-0 text-right hidden sm:block" style={{ ...TY.label, fontSize: "8px", color: t.textGhost }}>Time</span>
            <span className="w-6" />
          </div>

          {/* Rows */}
          {filteredTrips.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Search size={24} style={{ color: t.textGhost, marginBottom: 12 }} />
              <span style={{ ...TY.body, fontSize: "13px", color: t.textFaint }}>No trips match your filters</span>
              <span style={{ ...TY.bodyR, fontSize: "11px", color: t.textGhost, marginTop: 4 }}>Try adjusting your search or filter criteria</span>
            </div>
          ) : (
            filteredTrips.map((trip, i) => {
              const isSelected = selectedTrip?.id === trip.id;
              const meta = TRIP_STATUS_META[trip.status];
              return (
                <motion.button
                  key={trip.id}
                  onClick={() => onSelectTrip(isSelected ? null : trip)}
                  className="w-full flex items-center px-5 py-2.5 transition-colors"
                  style={{
                    background: isSelected ? (isDark ? "rgba(29,185,84,0.04)" : "rgba(29,185,84,0.03)") : "transparent",
                    borderBottom: `1px solid ${t.borderSubtle}`,
                    borderLeft: isSelected ? `2px solid ${BRAND.green}` : "2px solid transparent",
                    minHeight: 48,
                  }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.02 }}
                  onMouseEnter={e => { if (!isSelected) e.currentTarget.style.background = isDark ? "rgba(255,255,255,0.015)" : "rgba(0,0,0,0.01)"; }}
                  onMouseLeave={e => { if (!isSelected) e.currentTarget.style.background = "transparent"; }}
                >
                  {/* ID */}
                  <span className="w-20 shrink-0 text-left" style={{ ...TY.body, fontSize: "11px", color: t.text }}>{trip.id}</span>

                  {/* Status */}
                  <div className="w-16 shrink-0 flex items-center gap-1.5">
                    <StatusDot status={trip.status} size={5} />
                    <span style={{ ...TY.bodyR, fontSize: "10px", color: meta.color }}>{meta.label}</span>
                  </div>

                  {/* Route */}
                  <div className="flex-1 min-w-0 text-left">
                    <span className="block truncate" style={{ ...TY.body, fontSize: "11px", color: t.text }}>
                      {trip.pickup.zone} → {trip.dropoff.zone}
                    </span>
                    <span className="block truncate" style={{ ...TY.bodyR, fontSize: "9px", color: t.textFaint }}>
                      {trip.pickup.address}
                    </span>
                  </div>

                  {/* Rider */}
                  <div className="w-28 shrink-0 text-left hidden md:block">
                    <span className="block truncate" style={{ ...TY.body, fontSize: "11px", color: t.text }}>{trip.rider.name}</span>
                    <div className="flex items-center gap-1">
                      <Star size={8} style={{ color: "#F59E0B" }} />
                      <span style={{ ...TY.bodyR, fontSize: "9px", color: t.textFaint }}>{trip.rider.rating}</span>
                      {trip.source === "hotel_concierge" && (
                        <Building2 size={8} style={{ color: STATUS.info, marginLeft: 2 }} />
                      )}
                    </div>
                  </div>

                  {/* Driver */}
                  <div className="w-28 shrink-0 text-left hidden lg:block">
                    {trip.driver ? (
                      <>
                        <span className="block truncate" style={{ ...TY.body, fontSize: "11px", color: t.text }}>{trip.driver.name}</span>
                        <div className="flex items-center gap-1">
                          {trip.driver.isEV && <Zap size={8} style={{ color: BRAND.green }} />}
                          <span style={{ ...TY.bodyR, fontSize: "9px", color: t.textFaint }}>{trip.driver.vehicle.split(" ").slice(0, 2).join(" ")}</span>
                        </div>
                      </>
                    ) : (
                      <span style={{ ...TY.bodyR, fontSize: "10px", color: t.textFaint }}>—</span>
                    )}
                  </div>

                  {/* Fare */}
                  <span className="w-16 shrink-0 text-right" style={{ ...TY.body, fontSize: "11px", color: trip.fare.total > 0 ? t.text : t.textFaint }}>
                    {trip.fare.total > 0 ? formatNaira(trip.fare.total) : "—"}
                  </span>

                  {/* Time */}
                  <span className="w-14 shrink-0 text-right hidden sm:block" style={{ ...TY.bodyR, fontSize: "10px", color: t.textFaint }}>
                    {timeAgo(trip.timing.requested)}
                  </span>

                  <ChevronRight size={12} className="ml-1 shrink-0" style={{ color: t.textGhost }} />
                </motion.button>
              );
            })
          )}
        </div>
      </div>

      {/* Detail drawer */}
      <AnimatePresence>
        {selectedTrip && (
          <motion.div
            className="hidden md:block shrink-0 border-l overflow-hidden"
            style={{ width: 360, borderColor: t.border }}
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 360, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <TripDetail trip={selectedTrip} onClose={() => onSelectTrip(null)} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}


/* ═══════════════════════════════════════════════════════════════════════════
   VARIATION B — "Split Monitor"

   Map + list dual-pane. Live rides on map, scrollable list on right.
   Click syncs map ↔ list. Map shows route lines for active rides.

   Uber city ops × Google Maps logistics × Mapbox Studio
   ═══════════════════════════════════════════════════════════════════════════ */

function VariationB({ onSelectTrip, selectedTrip }: { onSelectTrip: (t: TripRecord | null) => void; selectedTrip: TripRecord | null }) {
  const { theme, t } = useAdminTheme();
  const isDark = theme === "dark";
  const [hoveredTrip, setHoveredTrip] = useState<string | null>(null);
  const [sourceFilter, setSourceFilter] = useState<BookingSource | "all">("all");

  const filteredTrips = useMemo(() => {
    if (sourceFilter === "all") return TRIPS;
    return TRIPS.filter(tr => tr.source === sourceFilter);
  }, [sourceFilter]);

  // Map pin positions (simulated — in production these come from GPS)
  const pinPositions: Record<string, { x: number; y: number; dx: number; dy: number }> = {
    "JET-3041": { x: 230, y: 310, dx: 180, dy: 330 },
    "JET-3042": { x: 180, y: 330, dx: 110, dy: 260 },
    "JET-3043": { x: 110, y: 260, dx: 140, dy: 290 },
    "JET-3044": { x: 115, y: 265, dx: 190, dy: 325 },
  };

  return (
    <div className="flex-1 flex min-h-0">
      {/* Left: Map */}
      <div className="hidden md:flex flex-1 relative min-w-0">
        {/* Map background */}
        <div className="absolute inset-0" style={{ background: t.mapBg }}>
          <div className="absolute inset-0" style={{ background: `radial-gradient(ellipse at 35% 45%, ${t.mapGlow1} 0%, transparent 55%)` }} />
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(${t.mapGrid} 1px, transparent 1px)`,
            backgroundSize: "24px 24px", mixBlendMode: "overlay",
          }} />
        </div>

        {/* Map SVG */}
        <svg viewBox="0 0 500 420" className="absolute inset-0 w-full h-full" preserveAspectRatio="xMidYMid meet">
          {/* Nigeria outline */}
          <path
            d="M 60,55 Q 70,42 95,35 Q 140,25 180,22 Q 220,20 260,18 Q 300,16 340,22 Q 370,26 395,35 Q 415,42 430,55 Q 442,68 448,85 Q 452,100 455,120 Q 458,140 452,160 Q 448,175 440,188 Q 435,198 425,210 Q 418,220 410,235 Q 400,252 385,268 Q 370,282 352,295 Q 338,308 320,320 Q 305,330 290,342 Q 272,355 255,362 Q 238,370 220,375 Q 200,380 180,382 Q 165,384 150,378 Q 135,372 120,362 Q 108,354 98,342 Q 88,328 82,312 Q 76,296 72,280 Q 68,264 65,248 Q 62,232 58,215 Q 54,198 52,180 Q 50,162 48,142 Q 46,122 48,102 Q 50,82 55,68 Z"
            fill={t.mapOutlineFill}
            stroke={`${BRAND.green}30`}
            strokeWidth="1"
          />

          {/* Zone labels */}
          {[
            { cx: 180, cy: 330, name: "Island" },
            { cx: 140, cy: 290, name: "Mainland" },
            { cx: 230, cy: 310, name: "Lekki" },
            { cx: 110, cy: 260, name: "Ikeja" },
          ].map(z => (
            <g key={z.name}>
              <circle cx={z.cx} cy={z.cy} r="16" fill={`${BRAND.green}06`} stroke={`${BRAND.green}20`} strokeWidth="0.5" />
              <text x={z.cx} y={z.cy - 20} textAnchor="middle" fill={t.textFaint} fontSize="6.5" fontFamily="var(--font-body)" fontWeight="500">{z.name}</text>
            </g>
          ))}

          {/* Live ride route lines */}
          {LIVE_TRIPS.map(trip => {
            const pos = pinPositions[trip.id];
            if (!pos) return null;
            const isHovered = hoveredTrip === trip.id || selectedTrip?.id === trip.id;
            return (
              <g key={trip.id}>
                <motion.line
                  x1={pos.x} y1={pos.y} x2={pos.dx} y2={pos.dy}
                  stroke={BRAND.green} strokeWidth={isHovered ? 2 : 1} strokeDasharray="4 3"
                  opacity={isHovered ? 0.8 : 0.3}
                  animate={{ opacity: isHovered ? 0.8 : [0.2, 0.5, 0.2] }}
                  transition={isHovered ? {} : { duration: 2, repeat: Infinity }}
                />
                {/* Pickup pin */}
                <motion.circle
                  cx={pos.x} cy={pos.y} r={isHovered ? 6 : 4}
                  fill={BRAND.green}
                  opacity={isHovered ? 1 : 0.7}
                  style={{ cursor: "pointer" }}
                  onClick={() => onSelectTrip(trip)}
                  onMouseEnter={() => setHoveredTrip(trip.id)}
                  onMouseLeave={() => setHoveredTrip(null)}
                />
                {/* Dropoff pin */}
                <circle cx={pos.dx} cy={pos.dy} r={isHovered ? 5 : 3} fill={STATUS.error} opacity={isHovered ? 0.8 : 0.4} />
                {/* Label on hover */}
                {isHovered && (
                  <g>
                    <rect x={pos.x - 25} y={pos.y - 22} width="50" height="14" rx="4"
                      fill={isDark ? "rgba(0,0,0,0.8)" : "rgba(255,255,255,0.95)"}
                      stroke={`${BRAND.green}40`} strokeWidth="0.5"
                    />
                    <text x={pos.x} y={pos.y - 12} textAnchor="middle"
                      fill={BRAND.green} fontSize="7" fontFamily="var(--font-body)" fontWeight="600">
                      {trip.id}
                    </text>
                  </g>
                )}
              </g>
            );
          })}
        </svg>

        {/* Live counter overlay */}
        <div
          className="absolute top-4 left-4 flex items-center gap-2 px-3 py-2 rounded-xl"
          style={{
            background: isDark ? "rgba(12,12,14,0.85)" : "rgba(255,255,255,0.92)",
            backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)",
            border: `1px solid ${isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)"}`,
          }}
        >
          <StatusDot status="in_progress" size={6} />
          <span style={{ ...TY.body, fontSize: "12px", color: t.text }}>{LIVE_TRIPS.length} live</span>
          <span style={{ ...TY.bodyR, fontSize: "10px", color: t.textFaint }}>·</span>
          <span style={{ ...TY.bodyR, fontSize: "10px", color: t.textFaint }}>{RIDES_KPI.completedToday} completed today</span>
        </div>
      </div>

      {/* Right: Trip list */}
      <div className="w-full md:w-[380px] flex flex-col shrink-0 overflow-hidden" style={{ borderLeft: `1px solid ${t.border}` }}>
        {/* List header with source filter */}
        <div className="px-4 py-3 shrink-0" style={{ borderBottom: `1px solid ${t.border}` }}>
          <div className="flex items-center justify-between">
            <div>
              <span style={{ ...TY.sub, fontSize: "12px", color: t.text }}>Trip feed</span>
              <span style={{ ...TY.bodyR, fontSize: "10px", color: t.textFaint, marginLeft: 8 }}>
                {filteredTrips.length} today
              </span>
            </div>
          </div>
          <div className="flex items-center gap-1 mt-2">
            {(["all", "rider_app", "hotel_concierge", "scheduled"] as const).map(src => (
              <button
                key={src}
                onClick={() => setSourceFilter(src)}
                className="px-2 py-1 rounded transition-colors"
                style={{ background: sourceFilter === src ? (isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)") : "transparent" }}
              >
                <span style={{
                  fontFamily: "'Manrope', sans-serif", fontWeight: sourceFilter === src ? 600 : 400,
                  fontSize: "10px", color: sourceFilter === src ? t.text : t.textFaint,
                }}>
                  {src === "all" ? "All" : SOURCE_META[src].label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Trip list */}
        <div className="flex-1 overflow-y-auto">
          {filteredTrips.map((trip, i) => {
            const meta = TRIP_STATUS_META[trip.status];
            const isSelected = selectedTrip?.id === trip.id;
            const isHov = hoveredTrip === trip.id;
            return (
              <motion.button
                key={trip.id}
                onClick={() => onSelectTrip(isSelected ? null : trip)}
                onMouseEnter={() => setHoveredTrip(trip.id)}
                onMouseLeave={() => setHoveredTrip(null)}
                className="w-full px-4 py-3 text-left transition-colors"
                style={{
                  background: isSelected
                    ? isDark ? "rgba(29,185,84,0.04)" : "rgba(29,185,84,0.03)"
                    : isHov ? (isDark ? "rgba(255,255,255,0.015)" : "rgba(0,0,0,0.01)") : "transparent",
                  borderBottom: `1px solid ${t.borderSubtle}`,
                  borderLeft: isSelected ? `2px solid ${BRAND.green}` : "2px solid transparent",
                }}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.02 }}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <StatusDot status={trip.status} size={5} />
                    <span style={{ ...TY.body, fontSize: "12px", color: t.text }}>{trip.id}</span>
                    {trip.source === "hotel_concierge" && (
                      <Building2 size={10} style={{ color: STATUS.info }} />
                    )}
                    {trip.driver?.isEV && <Zap size={10} style={{ color: BRAND.green }} />}
                  </div>
                  <span style={{ ...TY.body, fontSize: "11px", color: trip.fare.total > 0 ? t.text : t.textFaint }}>
                    {trip.fare.total > 0 ? formatNaira(trip.fare.total) : "—"}
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <span style={{ ...TY.bodyR, fontSize: "10px", color: t.textMuted }}>
                    {trip.pickup.zone} → {trip.dropoff.zone}
                  </span>
                  <span style={{ ...TY.bodyR, fontSize: "10px", color: t.textGhost }}>·</span>
                  <span style={{ ...TY.bodyR, fontSize: "10px", color: t.textFaint }}>
                    {timeAgo(trip.timing.requested)}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 mt-1">
                  <span className="truncate" style={{ ...TY.bodyR, fontSize: "10px", color: t.textFaint }}>
                    {trip.rider.name}
                  </span>
                  {trip.driver && (
                    <>
                      <span style={{ ...TY.bodyR, fontSize: "10px", color: t.textGhost }}>→</span>
                      <span className="truncate" style={{ ...TY.bodyR, fontSize: "10px", color: t.textFaint }}>
                        {trip.driver.name}
                      </span>
                    </>
                  )}
                </div>

                {trip.flags.length > 0 && (
                  <div className="flex gap-1 mt-1.5">
                    {trip.flags.slice(0, 3).map(f => <FlagBadge key={f} flag={f} />)}
                  </div>
                )}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Mobile: detail overlay */}
      <AnimatePresence>
        {selectedTrip && (
          <motion.div
            className="fixed inset-0 z-50 md:hidden"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 350 }}
          >
            <TripDetail trip={selectedTrip} onClose={() => onSelectTrip(null)} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}


/* ═══════════════════════════════════════════════════════════════════════════
   VARIATION C — "Feed + Drill"

   Temporal activity feed. Cards grouped by time, expand inline.
   Sticky live stats at top.

   Vercel deployment log × GitHub activity × Datadog event stream
   ═══════════════════════════════════════════════════════════════════════════ */

function VariationC({ onSelectTrip, selectedTrip }: { onSelectTrip: (t: TripRecord | null) => void; selectedTrip: TripRecord | null }) {
  const { theme, t } = useAdminTheme();
  const isDark = theme === "dark";
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [sourceFilter, setSourceFilter] = useState<BookingSource | "all">("all");
  const refNow = useMemo(() => new Date("2026-03-11T14:32:00+01:00"), []);

  // Group trips by time (with source filter applied)
  const groups = useMemo(() => {
    const base = sourceFilter === "all" ? TRIPS : TRIPS.filter(tr => tr.source === sourceFilter);
    const liveTrips = base.filter(tr => ["matching", "driver_assigned", "en_route_pickup", "in_progress"].includes(tr.status));
    const recentTrips = base.filter(tr => {
      if (["matching", "driver_assigned", "en_route_pickup", "in_progress"].includes(tr.status)) return false;
      const diff = refNow.getTime() - new Date(tr.timing.requested).getTime();
      return diff < 3600000; // last hour
    });
    const olderTrips = base.filter(tr => {
      if (["matching", "driver_assigned", "en_route_pickup", "in_progress"].includes(tr.status)) return false;
      const diff = refNow.getTime() - new Date(tr.timing.requested).getTime();
      return diff >= 3600000;
    });

    return [
      { label: "Right now", trips: liveTrips, pulse: true },
      { label: "Last hour", trips: recentTrips, pulse: false },
      { label: "Earlier today", trips: olderTrips, pulse: false },
    ].filter(g => g.trips.length > 0);
  }, [refNow, sourceFilter]);

  return (
    <div className="flex-1 flex min-h-0">
      <div className="flex-1 flex flex-col min-w-0">
        {/* Live stats strip */}
        <div
          className="flex items-center gap-6 px-5 py-3 shrink-0 overflow-x-auto scrollbar-hide"
          style={{ borderBottom: `1px solid ${t.border}` }}
        >
          {[
            { label: "Live", value: `${RIDES_KPI.liveCount}`, icon: Radio, color: BRAND.green, pulse: true },
            { label: "Completed", value: `${RIDES_KPI.completedToday}`, icon: Activity, color: t.textMuted, pulse: false },
            { label: "Avg wait", value: `${RIDES_KPI.avgWaitTime}s`, icon: Clock, color: STATUS.warning, pulse: false },
            { label: "Revenue", value: formatNaira(RIDES_KPI.revenueToday), icon: Wallet, color: BRAND.green, pulse: false },
            { label: "Cancel rate", value: `${RIDES_KPI.cancellationRate}%`, icon: AlertTriangle, color: STATUS.error, pulse: false },
            { label: "Avg rating", value: `★${RIDES_KPI.avgRating}`, icon: Star, color: "#F59E0B", pulse: false },
          ].map(stat => (
            <div key={stat.label} className="flex items-center gap-2 shrink-0">
              <div className="relative">
                {stat.pulse && (
                  <motion.div
                    className="absolute inset-0 rounded-full"
                    style={{ background: stat.color }}
                    animate={{ scale: [1, 1.5], opacity: [0.3, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  />
                )}
                <stat.icon size={12} style={{ color: stat.color, position: "relative" }} />
              </div>
              <div>
                <span style={{ ...TY.cap, fontSize: "8px", color: t.textGhost, display: "block" }}>{stat.label}</span>
                <span style={{ ...TY.sub, fontSize: "13px", color: t.text, display: "block" }}>{stat.value}</span>
              </div>
            </div>
          ))}

          {/* Source filter pills */}
          <div className="flex items-center gap-1 ml-auto shrink-0 h-7 px-1.5 rounded-lg" style={{ background: t.surface, border: `1px solid ${t.borderSubtle}` }}>
            {(["all", "rider_app", "hotel_concierge", "scheduled"] as const).map(src => (
              <button
                key={src}
                onClick={() => setSourceFilter(src)}
                className="px-2 py-0.5 rounded transition-colors"
                style={{ background: sourceFilter === src ? (isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)") : "transparent" }}
              >
                <span style={{
                  fontFamily: "'Manrope', sans-serif", fontWeight: sourceFilter === src ? 600 : 400,
                  fontSize: "10px", color: sourceFilter === src ? t.text : t.textFaint,
                }}>
                  {src === "all" ? "All" : SOURCE_META[src].label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Feed */}
        <div className="flex-1 overflow-y-auto px-4 md:px-6 py-4">
          <div className="max-w-3xl mx-auto">
            {groups.map((group, gi) => (
              <div key={group.label} className="mb-6">
                {/* Group label */}
                <div className="flex items-center gap-2 mb-3">
                  {group.pulse && <StatusDot status="in_progress" size={5} />}
                  <span style={{ ...TY.label, fontSize: "9px", color: group.pulse ? BRAND.green : t.textGhost }}>
                    {group.label}
                  </span>
                  <span style={{ ...TY.bodyR, fontSize: "10px", color: t.textGhost }}>{group.trips.length}</span>
                  <div className="flex-1 h-px" style={{ background: isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.03)" }} />
                </div>

                {/* Trip cards */}
                <div className="space-y-2">
                  {group.trips.map((trip, i) => {
                    const meta = TRIP_STATUS_META[trip.status];
                    const srcMeta = SOURCE_META[trip.source];
                    const isExpanded = expandedId === trip.id;

                    return (
                      <motion.div
                        key={trip.id}
                        className="rounded-xl overflow-hidden"
                        style={{
                          background: isDark ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.015)",
                          border: `1px solid ${isExpanded
                            ? `${BRAND.green}${isDark ? "20" : "15"}`
                            : isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.03)"
                          }`,
                        }}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: gi * 0.1 + i * 0.03 }}
                      >
                        {/* Card header (always visible) */}
                        <button
                          onClick={() => setExpandedId(isExpanded ? null : trip.id)}
                          className="w-full px-4 py-3 text-left"
                          onMouseEnter={e => { e.currentTarget.style.background = isDark ? "rgba(255,255,255,0.01)" : "rgba(0,0,0,0.005)"; }}
                          onMouseLeave={e => { e.currentTarget.style.background = "transparent"; }}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2.5 min-w-0">
                              <StatusDot status={trip.status} size={6} />
                              <div className="min-w-0">
                                <div className="flex items-center gap-2">
                                  <span style={{ ...TY.body, fontSize: "12px", color: t.text }}>{trip.id}</span>
                                  <span style={{ ...TY.bodyR, fontSize: "10px", color: meta.color }}>{meta.label}</span>
                                  {trip.source !== "rider_app" && (
                                    <span
                                      className="px-1.5 py-0.5 rounded"
                                      style={{
                                        fontFamily: "'Manrope', sans-serif", fontWeight: 500,
                                        fontSize: "9px", color: srcMeta.color,
                                        background: `${srcMeta.color}10`,
                                      }}
                                    >{srcMeta.label}</span>
                                  )}
                                </div>
                                <span style={{ ...TY.bodyR, fontSize: "10px", color: t.textMuted }}>
                                  {trip.pickup.zone} → {trip.dropoff.zone}
                                  <span style={{ color: t.textGhost }}> · {trip.rider.name}</span>
                                  {trip.driver && <span style={{ color: t.textGhost }}> → {trip.driver.name}</span>}
                                </span>
                              </div>
                            </div>

                            <div className="flex items-center gap-3 shrink-0">
                              {trip.flags.length > 0 && (
                                <div className="hidden sm:flex gap-1">
                                  {trip.flags.slice(0, 2).map(f => <FlagBadge key={f} flag={f} />)}
                                </div>
                              )}
                              <div className="text-right">
                                <span className="block" style={{ ...TY.body, fontSize: "12px", color: trip.fare.total > 0 ? t.text : t.textFaint }}>
                                  {trip.fare.total > 0 ? formatNaira(trip.fare.total) : "—"}
                                </span>
                                <span style={{ ...TY.bodyR, fontSize: "9px", color: t.textFaint }}>
                                  {timeAgo(trip.timing.requested)}
                                </span>
                              </div>
                              <ChevronRight
                                size={12}
                                style={{
                                  color: t.textGhost,
                                  transform: isExpanded ? "rotate(90deg)" : "rotate(0deg)",
                                  transition: "transform 0.15s ease",
                                }}
                              />
                            </div>
                          </div>
                        </button>

                        {/* Expanded detail (inline) */}
                        <AnimatePresence>
                          {isExpanded && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.2 }}
                              className="overflow-hidden"
                            >
                              <div className="px-4 pb-4 pt-0" style={{ borderTop: `1px solid ${isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.03)"}` }}>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
                                  {/* Route detail */}
                                  <div className="rounded-lg p-3" style={{ background: t.surface, border: `1px solid ${t.borderSubtle}` }}>
                                    <div className="flex items-start gap-2">
                                      <div className="flex flex-col items-center gap-0.5 mt-1">
                                        <div className="w-1.5 h-1.5 rounded-full" style={{ background: BRAND.green }} />
                                        <div className="w-px h-5" style={{ background: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)" }} />
                                        <div className="w-1.5 h-1.5 rounded-full" style={{ background: STATUS.error }} />
                                      </div>
                                      <div className="space-y-2">
                                        <div>
                                          <span className="block" style={{ ...TY.body, fontSize: "10px", color: t.text }}>{trip.pickup.address}</span>
                                        </div>
                                        <div>
                                          <span className="block" style={{ ...TY.body, fontSize: "10px", color: t.text }}>{trip.dropoff.address}</span>
                                        </div>
                                      </div>
                                    </div>
                                    {trip.distance > 0 && (
                                      <div className="flex items-center gap-2 mt-2">
                                        <span style={{ ...TY.bodyR, fontSize: "9px", color: t.textFaint }}>{trip.distance} km</span>
                                        {trip.timing.duration && <span style={{ ...TY.bodyR, fontSize: "9px", color: t.textFaint }}>· {trip.timing.duration} min</span>}
                                      </div>
                                    )}
                                  </div>

                                  {/* Fare + payment */}
                                  <div className="rounded-lg p-3" style={{ background: t.surface, border: `1px solid ${t.borderSubtle}` }}>
                                    {trip.fare.total > 0 ? (
                                      <>
                                        <div className="flex justify-between mb-1">
                                          <span style={{ ...TY.bodyR, fontSize: "10px", color: t.textMuted }}>Base + distance</span>
                                          <span style={{ ...TY.body, fontSize: "10px", color: t.text }}>{formatNaira(trip.fare.base + trip.fare.distance)}</span>
                                        </div>
                                        {trip.fare.surge > 0 && (
                                          <div className="flex justify-between mb-1">
                                            <span style={{ ...TY.bodyR, fontSize: "10px", color: STATUS.warning }}>Surge</span>
                                            <span style={{ ...TY.body, fontSize: "10px", color: STATUS.warning }}>{formatNaira(trip.fare.surge)}</span>
                                          </div>
                                        )}
                                        <div className="h-px my-1" style={{ background: t.borderSubtle }} />
                                        <div className="flex justify-between">
                                          <span style={{ ...TY.body, fontSize: "10px", color: t.text }}>Total</span>
                                          <span style={{ ...TY.sub, fontSize: "11px", color: t.text }}>{formatNaira(trip.fare.total)}</span>
                                        </div>
                                        <div className="flex items-center gap-1 mt-1.5">
                                          <CreditCard size={9} style={{ color: t.textFaint }} />
                                          <span style={{ ...TY.bodyR, fontSize: "9px", color: t.textFaint }}>
                                            {trip.payment.method === "hotel_invoice" ? "Hotel invoice" : trip.payment.method} · {trip.payment.status}
                                          </span>
                                        </div>
                                      </>
                                    ) : (
                                      <span style={{ ...TY.bodyR, fontSize: "10px", color: t.textFaint }}>No fare — trip cancelled</span>
                                    )}
                                  </div>

                                  {/* Rider */}
                                  <div className="rounded-lg p-3" style={{ background: t.surface, border: `1px solid ${t.borderSubtle}` }}>
                                    <span style={{ ...TY.label, fontSize: "7px", color: t.textGhost }}>Rider</span>
                                    <span className="block mt-0.5" style={{ ...TY.body, fontSize: "11px", color: t.text }}>{trip.rider.name}</span>
                                    <div className="flex items-center gap-1.5 mt-0.5">
                                      <Star size={8} style={{ color: "#F59E0B" }} />
                                      <span style={{ ...TY.bodyR, fontSize: "9px", color: t.textFaint }}>{trip.rider.rating} · {trip.rider.totalTrips} trips</span>
                                    </div>
                                  </div>

                                  {/* Driver */}
                                  <div className="rounded-lg p-3" style={{ background: t.surface, border: `1px solid ${t.borderSubtle}` }}>
                                    <span style={{ ...TY.label, fontSize: "7px", color: t.textGhost }}>Driver</span>
                                    {trip.driver ? (
                                      <>
                                        <span className="block mt-0.5" style={{ ...TY.body, fontSize: "11px", color: t.text }}>{trip.driver.name}</span>
                                        <div className="flex items-center gap-1.5 mt-0.5">
                                          {trip.driver.isEV && <Zap size={8} style={{ color: BRAND.green }} />}
                                          <span style={{ ...TY.bodyR, fontSize: "9px", color: t.textFaint }}>{trip.driver.vehicle}</span>
                                        </div>
                                      </>
                                    ) : (
                                      <span className="block mt-0.5" style={{ ...TY.bodyR, fontSize: "10px", color: t.textFaint }}>Matching...</span>
                                    )}
                                  </div>
                                </div>

                                {/* Actions */}
                                <div className="flex items-center gap-2 mt-3">
                                  <button
                                    onClick={() => onSelectTrip(trip)}
                                    className="h-7 px-3 rounded-lg flex items-center gap-1.5 transition-opacity hover:opacity-80"
                                    style={{ background: BRAND.green }}
                                  >
                                    <Eye size={10} style={{ color: "#fff" }} />
                                    <span style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 600, fontSize: "10px", color: "#fff" }}>
                                      Full details
                                    </span>
                                  </button>
                                  {trip.cancellationReason && (
                                    <span
                                      className="px-2.5 py-1 rounded-lg"
                                      style={{
                                        fontFamily: "'Manrope', sans-serif", fontWeight: 500,
                                        fontSize: "10px", color: STATUS.error,
                                        background: `${STATUS.error}10`,
                                        border: `1px solid ${STATUS.error}20`,
                                      }}
                                    >
                                      {trip.cancellationReason}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Detail drawer (opened via "Full details" button) */}
      <AnimatePresence>
        {selectedTrip && (
          <motion.div
            className="hidden md:block shrink-0 border-l overflow-hidden"
            style={{ width: 360, borderColor: t.border }}
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 360, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <TripDetail trip={selectedTrip} onClose={() => onSelectTrip(null)} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}


/* ══════════════��════════════════════════════════════════════════════════════
   MAIN EXPORT — Rides page with view mode selector
   ═══════════════════════════════════════════════════════════════════════════ */

export type RidesVariation = "A" | "B" | "C";

export function AdminRidesPage() {
  const { theme, t } = useAdminTheme();
  const isDark = theme === "dark";
  const [variation, setVariation] = useState<RidesVariation>("A");
  const [selectedTrip, setSelectedTrip] = useState<TripRecord | null>(null);

  // Clear selection when switching variations
  const handleVariationChange = (v: RidesVariation) => {
    setSelectedTrip(null);
    setVariation(v);
  };

  const variationLabels: Record<RidesVariation, string> = {
    A: "Table",
    B: "Map",
    C: "Feed",
  };

  return (
    <>
      {/* Header */}
      <motion.div
        className="flex items-center justify-between px-3 md:px-5 h-12 md:h-14 shrink-0"
        style={{ background: t.overlay, borderBottom: `1px solid ${t.border}` }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="flex items-center gap-2 md:gap-3 min-w-0">
          <h1 className="truncate" style={{ ...TY.sub, fontSize: "13px", color: t.text }}>Rides</h1>
          <span className="hidden sm:inline" style={{ ...TY.bodyR, fontSize: "11px", color: t.textGhost }}>Trip management</span>

          {/* KPI pills */}
          <div className="hidden md:flex items-center gap-3 ml-3">
            <div className="flex items-center gap-1.5">
              <StatusDot status="in_progress" size={4} />
              <span style={{ ...TY.body, fontSize: "11px", color: BRAND.green }}>{RIDES_KPI.liveCount} live</span>
            </div>
            <span style={{ ...TY.bodyR, fontSize: "11px", color: t.textGhost }}>·</span>
            <span style={{ ...TY.bodyR, fontSize: "11px", color: t.textFaint }}>{RIDES_KPI.completedToday} completed</span>
            <span style={{ ...TY.bodyR, fontSize: "11px", color: t.textGhost }}>·</span>
            <span style={{ ...TY.bodyR, fontSize: "11px", color: t.textFaint }}>{formatNaira(RIDES_KPI.revenueToday)}</span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 md:gap-2 shrink-0">
          {/* Variation toggle */}
          <div
            className="flex items-center h-7 rounded-lg overflow-hidden"
            style={{ border: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)"}` }}
          >
            {(["A", "B", "C"] as const).map(v => (
              <button
                key={v}
                onClick={() => handleVariationChange(v)}
                className="h-full px-2 md:px-2.5 transition-colors flex items-center gap-1"
                style={{
                  background: variation === v
                    ? isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)"
                    : "transparent",
                  minWidth: 28,
                }}
              >
                <span style={{
                  fontFamily: "'Manrope', sans-serif",
                  fontWeight: variation === v ? 600 : 400,
                  fontSize: "10px",
                  color: variation === v ? t.text : t.textFaint,
                }}>
                  {v}
                </span>
                <span className="hidden md:inline" style={{
                  fontFamily: "'Manrope', sans-serif",
                  fontWeight: 400,
                  fontSize: "9px",
                  color: variation === v ? t.textMuted : t.textGhost,
                }}>
                  {variationLabels[v]}
                </span>
              </button>
            ))}
          </div>

          <span className="hidden md:inline-flex"><ThemeToggle /></span>
        </div>
      </motion.div>

      {/* Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={variation}
          className="flex-1 flex flex-col min-h-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
        >
          {variation === "A" && <VariationA onSelectTrip={setSelectedTrip} selectedTrip={selectedTrip} />}
          {variation === "B" && <VariationB onSelectTrip={setSelectedTrip} selectedTrip={selectedTrip} />}
          {variation === "C" && <VariationC onSelectTrip={setSelectedTrip} selectedTrip={selectedTrip} />}
        </motion.div>
      </AnimatePresence>
    </>
  );
}
