/**
 * Rider Activity Screen — Approach C (Vercel Analytics DNA)
 *
 * Hero spend → context line → sparkline → insight row
 * (EV impact · commute time · most visited) → date-grouped trip list
 * → trip detail bottom sheet.
 *
 * Wired: period selector (week/month/3months), save frequent place.
 * C spine: MapCanvas, ambient glows, noise, green-as-scalpel.
 */

import { useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  X,
  Zap,
  Car,
  ArrowUpRight,
  MapPin,
  Clock,
  Leaf,
  ChevronDown,
  Check,
  CalendarDays,
  HelpCircle,
  Flag,
  ChevronRight,
  CreditCard,
  Navigation,
  ShieldAlert,
  MessageSquare,
  Send,
  ArrowLeft,
} from "lucide-react";
import {
  GLASS_COLORS,
  GLASS_TYPE,
  type GlassColorMode,
  MOTION,
} from "../../config/project";
import { RIDER_TYPE as RT } from "../../config/rider-type";
import { BRAND_COLORS } from "../../config/brand";
import { MapCanvas } from "./map-canvas";
import {
  type ActivityTrip,
  type Period,
  PERIOD_LABELS,
  filterByPeriod,
  computeStats,
  sparklineForPeriod,
  deriveMostVisited,
  formatMinutes,
  formatNaira,
  groupTripsByDate,
} from "./activity-data";
import { useSavedPlaceNames, useSavedPlaces } from "./saved-places-store";
import { useJetToast } from "./jet-toast";
import { ActivitySkeleton } from "./jet-skeleton";
import { JetEmpty } from "./jet-states";

// ---------------------------------------------------------------------------
// Sparkline SVG
// ---------------------------------------------------------------------------
function Sparkline({
  data,
  colorMode,
}: {
  data: { label: string; amount: number }[];
  colorMode: GlassColorMode;
}) {
  const d = colorMode === "dark";
  const max = Math.max(...data.map((p) => p.amount), 1);
  const w = 280;
  const h = 44;
  const pad = 2;

  const points = data.map((p, i) => ({
    x: pad + (i / Math.max(data.length - 1, 1)) * (w - pad * 2),
    y: h - pad - (p.amount / max) * (h - pad * 2),
  }));

  const pathD = points
    .map((p, i) => (i === 0 ? `M${p.x},${p.y}` : `L${p.x},${p.y}`))
    .join(" ");

  const areaD = `${pathD} L${points[points.length - 1].x},${h} L${points[0].x},${h} Z`;

  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      className="w-full"
      style={{ height: h }}
      preserveAspectRatio="none"
    >
      <defs>
        <linearGradient id="spark-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={BRAND_COLORS.green} stopOpacity={d ? 0.15 : 0.1} />
          <stop offset="100%" stopColor={BRAND_COLORS.green} stopOpacity={0} />
        </linearGradient>
      </defs>
      <path d={areaD} fill="url(#spark-fill)" />
      <path
        d={pathD}
        fill="none"
        stroke={BRAND_COLORS.green}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity={0.6}
      />
      <circle
        cx={points[points.length - 1].x}
        cy={points[points.length - 1].y}
        r="2.5"
        fill={BRAND_COLORS.green}
        opacity={0.8}
      />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Period picker dropdown
// ---------------------------------------------------------------------------
const PERIODS: Period[] = ["week", "month", "3months"];

function PeriodPicker({
  value,
  onChange,
  colorMode,
}: {
  value: Period;
  onChange: (p: Period) => void;
  colorMode: GlassColorMode;
}) {
  const c = GLASS_COLORS[colorMode];
  const d = colorMode === "dark";
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <motion.button
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg"
        style={{ background: c.surface.subtle }}
        onClick={() => setOpen(!open)}
        whileTap={{ scale: 0.96 }}
      >
        <CalendarDays className="w-3 h-3" style={{ color: c.icon.muted }} />
        <span style={{ ...RT.meta, color: c.text.muted }}>
          {PERIOD_LABELS[value]}
        </span>
        <ChevronDown
          className="w-3 h-3"
          style={{
            color: c.icon.muted,
            transform: open ? "rotate(180deg)" : "none",
            transition: "transform 0.15s ease",
          }}
        />
      </motion.button>

      <AnimatePresence>
        {open && (
          <>
            {/* Invisible backdrop to close */}
            <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
            <motion.div
              className="absolute right-0 top-full mt-1.5 z-50 py-1 rounded-xl overflow-hidden"
              style={{
                background: d ? "#1A1A1D" : "#FFFFFF",
                border: `1px solid ${d ? "rgba(255,255,255,0.08)" : "rgba(11,11,13,0.08)"}`,
                boxShadow: d
                  ? "0 8px 32px rgba(0,0,0,0.5)"
                  : "0 8px 32px rgba(0,0,0,0.1)",
                minWidth: 140,
              }}
              initial={{ opacity: 0, y: -4, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -4, scale: 0.96 }}
              transition={{ duration: 0.15 }}
            >
              {PERIODS.map((p) => (
                <button
                  key={p}
                  className="w-full flex items-center justify-between px-3.5 py-2.5"
                  style={{
                    background: value === p ? c.surface.subtle : "transparent",
                  }}
                  onClick={() => { onChange(p); setOpen(false); }}
                >
                  <span
                    style={{
                      ...RT.bodySmall,
                      color: value === p ? c.text.primary : c.text.muted,
                    }}
                  >
                    {PERIOD_LABELS[p]}
                  </span>
                  {value === p && (
                    <Check className="w-3 h-3" style={{ color: BRAND_COLORS.green }} />
                  )}
                </button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main screen
// ---------------------------------------------------------------------------
interface Props {
  colorMode: GlassColorMode;
  isNewUser?: boolean;
  onBookAgain?: () => void;
}

export function RiderActivityScreen({ colorMode, isNewUser = false, onBookAgain }: Props) {
  const c = GLASS_COLORS[colorMode];
  const d = colorMode === "dark";
  const [selectedTrip, setSelectedTrip] = useState<ActivityTrip | null>(null);
  const [period, setPeriod] = useState<Period>("month");
  const savedNames = useSavedPlaceNames();
  const { quickSave } = useSavedPlaces();
  const { showToast, ToastContainer } = useJetToast(colorMode);

  // Filter + compute for active period
  const trips = useMemo(() => filterByPeriod(period), [period]);
  const stats = useMemo(() => computeStats(trips), [trips]);
  const spark = useMemo(() => sparklineForPeriod(period), [period]);
  const mostVisited = useMemo(() => deriveMostVisited(trips, savedNames), [trips, savedNames]);
  const grouped = useMemo(() => groupTripsByDate(trips), [trips]);

  const handleSavePlace = useCallback((name: string) => {
    const added = quickSave(name);
    if (added) {
      showToast({ message: `${name} saved to places`, variant: "success" });
    } else {
      showToast({ message: `${name} is already saved`, variant: "info", duration: 1800 });
    }
  }, [quickSave, showToast]);

  return (
    <div className="h-full flex flex-col" style={{ background: c.bg }}>
      {/* Map peek */}
      <div className="relative shrink-0" style={{ height: "12vh" }}>
        <MapCanvas variant="muted" colorMode={colorMode} />
        <div
          className="absolute inset-0"
          style={{
            background: d
              ? "linear-gradient(to bottom, transparent 20%, #0B0B0D)"
              : "linear-gradient(to bottom, transparent 20%, #FAFAFA)",
          }}
        />
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-5 pb-24 scrollbar-hide">
        {/* ── Header: centered title + period top-right ── */}
        <motion.div
          className="relative flex items-center justify-center pt-4 pb-1"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <span
            style={{
              ...RT.heading,
              color: c.text.primary,
            }}
          >
            Activity
          </span>
          {!isNewUser && (
          <div className="absolute right-0 top-1/2 -translate-y-1/2">
            <PeriodPicker value={period} onChange={setPeriod} colorMode={colorMode} />
          </div>
          )}
        </motion.div>

        {isNewUser ? (
          /* ── New user empty state ── */
          <motion.div
            className="flex flex-col items-center justify-center py-16"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div
              className="w-16 h-16 rounded-2xl mb-4 flex items-center justify-center"
              style={{ background: c.surface.hover }}
            >
              <Car className="w-7 h-7" style={{ color: c.text.ghost }} />
            </div>
            <span
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "38px",
                fontWeight: 700,
                letterSpacing: "-0.04em",
                lineHeight: "1",
                color: c.text.display,
                display: "block",
                marginBottom: "6px",
              }}
            >
              {formatNaira(0)}
            </span>
            <p style={{ ...RT.bodySmall, color: c.text.muted, marginBottom: "4px" }}>
              0 rides · avg {formatNaira(0)}
            </p>
            <p style={{ ...RT.meta, color: c.text.ghost, maxWidth: "220px", textAlign: "center", marginTop: "8px" }}>
              Your ride activity and spending insights will appear here after your first trip
            </p>

            {/* Placeholder insight cards */}
            <div className="flex gap-2 mt-8 w-full">
              {[
                { icon: Leaf, label: "CO₂ saved", value: "0kg" },
                { icon: Clock, label: "On the road", value: "0h" },
                { icon: MapPin, label: "Top place", value: "—" },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex-1 px-3 py-3 rounded-xl"
                  style={{ background: c.surface.subtle }}
                >
                  <item.icon className="w-3 h-3 mb-1.5" style={{ color: c.text.ghost }} />
                  <span
                    style={{
                      fontFamily: "var(--font-heading)",
                      fontSize: "16px",
                      fontWeight: 600,
                      letterSpacing: "-0.02em",
                      lineHeight: "1.2",
                      color: c.text.ghost,
                      display: "block",
                    }}
                  >
                    {item.value}
                  </span>
                  <span
                    style={{
                      ...RT.metaSmall,
                      color: c.text.faint,
                      display: "block",
                      marginTop: "2px",
                    }}
                  >
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        ) : (
        <>
        {/* ── Hero spend (Wallet-B DNA: naked, center-aligned) ── */}
        <motion.div
          className="text-center mt-3 mb-1"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <span
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: "38px",
              fontWeight: 700,
              letterSpacing: "-0.04em",
              lineHeight: "1",
              color: c.text.display,
            }}
          >
            {formatNaira(stats.totalSpend)}
          </span>
        </motion.div>
        <motion.div
          className="text-center mb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <span style={{ ...RT.bodySmall, color: c.text.muted }}>
            {stats.rideCount} rides · avg {formatNaira(stats.avgRide)}
          </span>
        </motion.div>

        {/* ── Sparkline ── */}
        <motion.div
          className="mb-5 rounded-xl overflow-hidden px-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.25 }}
        >
          <Sparkline data={spark} colorMode={colorMode} />
          <div className="flex justify-between mt-1 px-0.5">
            {spark.map((p) => (
              <span
                key={p.label}
                style={{ ...GLASS_TYPE.caption, fontSize: "9px", color: c.text.faint }}
              >
                {p.label}
              </span>
            ))}
          </div>
        </motion.div>

        {/* ── Insight row: EV · Time · Top place ── */}
        <motion.div
          className="flex gap-2 mb-6"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          {/* EV Impact */}
          <div
            className="flex-1 px-3 py-3 rounded-xl"
            style={{
              background: d ? "rgba(29,185,84,0.08)" : "rgba(29,185,84,0.04)",
              border: `1px solid rgba(29,185,84,${d ? "0.12" : "0.08"})`,
            }}
          >
            <Leaf className="w-3 h-3 mb-1.5" style={{ color: BRAND_COLORS.green }} />
            <div className="flex items-baseline gap-0.5">
              <span
                style={{
                  fontFamily: "var(--font-heading)",
                  fontSize: "18px",
                  fontWeight: 600,
                  letterSpacing: "-0.03em",
                  lineHeight: "1.1",
                  color: BRAND_COLORS.green,
                }}
              >
                {stats.carbonSavedKg}
              </span>
              <span style={{ ...RT.metaSmall, color: BRAND_COLORS.green }}>
                kg
              </span>
            </div>
            <span
              style={{
                ...RT.metaSmall,
                color: c.text.faint, display: "block", marginTop: "2px",
              }}
            >
              CO₂ saved · {stats.evRides} EV
            </span>
          </div>

          {/* Time on road */}
          <div
            className="flex-1 px-3 py-3 rounded-xl"
            style={{ background: c.surface.subtle, border: "1px solid transparent" }}
          >
            <Clock className="w-3 h-3 mb-1.5" style={{ color: c.icon.muted }} />
            <span
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "18px",
                fontWeight: 600,
                letterSpacing: "-0.03em",
                lineHeight: "1.1",
                color: c.text.primary,
                display: "block",
              }}
            >
              {formatMinutes(stats.totalMinutes)}
            </span>
            <span
              style={{
                ...RT.metaSmall,
                color: c.text.faint, display: "block", marginTop: "2px",
              }}
            >
              On the road
            </span>
          </div>

          {/* Most visited */}
          <div
            className="flex-1 px-3 py-3 rounded-xl"
            style={{ background: c.surface.subtle, border: "1px solid transparent" }}
          >
            <MapPin className="w-3 h-3 mb-1.5" style={{ color: c.icon.muted }} />
            <span
              className="truncate block"
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "14px",
                fontWeight: 600,
                letterSpacing: "-0.02em",
                lineHeight: "1.2",
                color: c.text.primary,
              }}
            >
              {mostVisited[0]?.name ?? "—"}
            </span>
            <span
              style={{
                ...RT.metaSmall,
                color: c.text.faint, display: "block", marginTop: "2px",
              }}
            >
              {mostVisited[0]?.count ?? 0} trips
              {mostVisited[0] && !mostVisited[0].isSaved ? " · Not saved" : ""}
            </span>
          </div>
        </motion.div>

        {/* ── Frequent places (scrollable pills with save) ── */}
        <motion.div
          className="mb-5"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
        >
          <span
            style={{
              ...RT.label,
              color: c.text.faint,
              display: "block",
              marginBottom: "8px",
            }}
          >
            Frequent places
          </span>
          <div className="flex gap-2 overflow-x-auto scrollbar-hide">
            {mostVisited.map((place) => (
              <motion.button
                key={place.name}
                className="flex items-center gap-2 px-3 py-2 rounded-xl shrink-0 text-left"
                style={{
                  background: c.surface.subtle,
                  border: `1px solid ${
                    place.isSaved
                      ? `rgba(29,185,84,${d ? "0.12" : "0.08"})`
                      : "transparent"
                  }`,
                }}
                whileTap={{ scale: 0.97 }}
                onClick={() => {
                  if (!place.isSaved) handleSavePlace(place.name);
                }}
              >
                <MapPin
                  className="w-3 h-3 shrink-0"
                  style={{ color: place.isSaved ? BRAND_COLORS.green : c.icon.muted }}
                />
                <div>
                  <span
                    style={{
                      ...RT.meta,
                      color: c.text.primary,
                      display: "block",
                    }}
                  >
                    {place.name}
                  </span>
                  <span
                    style={{
                      ...RT.metaSmall,
                      color: c.text.faint,
                      display: "block",
                    }}
                  >
                    {place.count} trips
                    {place.isSaved ? (
                      <span style={{ color: BRAND_COLORS.green }}> · Saved</span>
                    ) : (
                      <span style={{ color: BRAND_COLORS.green }}> · + Save</span>
                    )}
                  </span>
                </div>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* ── Trip list (date-grouped) ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <span
            style={{
              ...RT.label,
              color: c.text.faint,
              display: "block",
              marginBottom: "8px",
            }}
          >
            Rides
          </span>

          {grouped.map((group) => (
            <div key={group.date} className="mb-4">
              <span
                className="block mb-1.5 px-1"
                style={{ ...RT.meta, color: c.text.faint }}
              >
                {group.date}
              </span>
              <div className="space-y-1">
                {group.trips.map((trip, i) => (
                  <motion.button
                    key={trip.id}
                    className="w-full text-left"
                    onClick={() => setSelectedTrip(trip)}
                    whileTap={{ scale: 0.98 }}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.42 + i * MOTION.stagger }}
                  >
                    <div
                      className="flex items-center gap-3 px-3.5 py-3 rounded-xl"
                      style={{
                        background: c.surface.subtle,
                        opacity: trip.status === "cancelled" ? 0.5 : 1,
                      }}
                    >
                      <div
                        className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                        style={{ background: trip.ev ? c.green.tint : c.surface.hover }}
                      >
                        {trip.ev ? (
                          <Zap className="w-4 h-4" style={{ color: BRAND_COLORS.green }} />
                        ) : (
                          <Car className="w-4 h-4" style={{ color: c.icon.tertiary }} />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1">
                          <span className="truncate" style={{ ...RT.bodySmall, color: c.text.primary }}>
                            {trip.from}
                          </span>
                          <ArrowUpRight className="w-3 h-3 shrink-0" style={{ color: c.icon.muted }} />
                          <span className="truncate" style={{ ...RT.bodySmall, color: c.text.primary }}>
                            {trip.to}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span style={{ ...RT.meta, color: c.text.muted }}>{trip.time}</span>
                          <span style={{ ...RT.meta, color: c.text.faint }}>·</span>
                          <span style={{ ...RT.meta, color: c.text.muted }}>{trip.durationMin}m</span>
                          {trip.status === "cancelled" && (
                            <>
                              <span style={{ ...RT.meta, color: c.text.faint }}>·</span>
                              <span
                                style={{
                                  ...RT.statusPill,
                                  color: BRAND_COLORS.error,
                                }}
                              >
                                Cancelled
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                      <span
                        style={{
                          fontFamily: "var(--font-heading)",
                          fontSize: "14px",
                          fontWeight: 500,
                          letterSpacing: "-0.02em",
                          lineHeight: "1",
                          color: trip.status === "cancelled" ? c.text.muted : c.text.primary,
                        }}
                      >
                        {trip.status === "cancelled" ? "—" : trip.fare}
                      </span>
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>
          ))}
        </motion.div>
        </>
        )}
      </div>

      {/* ─── Trip detail bottom sheet ─── */}
      <AnimatePresence>
        {selectedTrip && (
          <TripDetailSheet
            colorMode={colorMode}
            trip={selectedTrip}
            onClose={() => setSelectedTrip(null)}
            onBookAgain={() => {
              setSelectedTrip(null);
              onBookAgain?.();
            }}
          />
        )}
      </AnimatePresence>

      {/* Toast notifications */}
      <ToastContainer />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Help & Report data (rider-specific)
// ---------------------------------------------------------------------------
interface RiderHelpTopic {
  id: string;
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  label: string;
  description: string;
}

const RIDER_HELP_TOPICS: RiderHelpTopic[] = [
  { id: "wrong_charge", icon: CreditCard, label: "I was charged incorrectly", description: "If the fare doesn't match what was quoted, it may be due to route changes, tolls, or surge pricing. We'll review the trip and refund any overcharge within 24 hours." },
  { id: "route_issue", icon: Navigation, label: "Driver took a longer route", description: "If your driver deviated from the optimal route, we can review GPS data and adjust the fare. This review typically completes within a few hours." },
  { id: "lost_item", icon: Car, label: "I left something in the car", description: "We'll contact your driver to help retrieve your item. Most items are returned within 24 hours. You may need to arrange a convenient pickup point." },
  { id: "safety_concern", icon: ShieldAlert, label: "Safety concern", description: "Your safety is our priority. If you felt unsafe during this ride, our safety team will review the incident and take appropriate action. For emergencies, please call 112." },
  { id: "other_help", icon: HelpCircle, label: "Something else", description: "Tell us what happened and our support team will review your trip and get back to you as soon as possible." },
];

interface RiderReportReason {
  id: string;
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  label: string;
}

const RIDER_REPORT_REASONS: RiderReportReason[] = [
  { id: "rude_driver", icon: MessageSquare, label: "Driver was rude or unprofessional" },
  { id: "unsafe_driving", icon: ShieldAlert, label: "Unsafe driving" },
  { id: "wrong_vehicle", icon: Car, label: "Wrong vehicle or driver" },
  { id: "detour", icon: Navigation, label: "Unnecessary detour" },
  { id: "fraud", icon: Flag, label: "Suspected fraud" },
  { id: "other", icon: HelpCircle, label: "Other issue" },
];

// ---------------------------------------------------------------------------
// Trip Detail Sheet — multi-view with help/report flows
// ---------------------------------------------------------------------------
type RiderSheetView = "detail" | "help" | "help-topic" | "report" | "report-notes";

function TripDetailSheet({
  colorMode,
  trip,
  onClose,
  onBookAgain,
}: {
  colorMode: GlassColorMode;
  trip: ActivityTrip;
  onClose: () => void;
  onBookAgain: () => void;
}) {
  const c = GLASS_COLORS[colorMode];
  const d = colorMode === "dark";
  const [copied, setCopied] = useState(false);
  const divider = `1px solid ${d ? "rgba(255,255,255,0.04)" : "rgba(11,11,13,0.04)"}`;
  const isCancelled = trip.status === "cancelled";
  const { showToast, ToastContainer } = useJetToast(colorMode);

  const [view, setView] = useState<RiderSheetView>("detail");
  const [selectedTopic, setSelectedTopic] = useState<RiderHelpTopic | null>(null);
  const [selectedReason, setSelectedReason] = useState<RiderReportReason | null>(null);
  const [reportNotes, setReportNotes] = useState("");

  const handleBack = useCallback(() => {
    if (view === "help-topic") setView("help");
    else if (view === "report-notes") setView("report");
    else setView("detail");
  }, [view]);

  const handleCopyReceipt = () => {
    const text = `JET Ride Receipt\n${trip.from} → ${trip.to}\n${trip.fare}\n${trip.fullDate}\nDriver: ${trip.driver}\nVehicle: ${trip.vehicle}`;
    navigator.clipboard?.writeText(text).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleSubmitHelp = useCallback(() => {
    showToast({ message: "Support request sent — we'll review within 24h", variant: "success" });
    setTimeout(() => onClose(), 600);
  }, [showToast, onClose]);

  const handleSubmitReport = useCallback(() => {
    showToast({ message: "Report submitted — thank you", variant: "success" });
    setTimeout(() => onClose(), 600);
  }, [showToast, onClose]);

  const title =
    view === "detail" ? "Trip details"
    : view === "help" ? "Get help"
    : view === "help-topic" ? (selectedTopic?.label ?? "Help")
    : view === "report" ? "Report an issue"
    : (selectedReason?.label ?? "Report");

  return (
    <div className="absolute inset-0 z-50 flex flex-col justify-end">
      <motion.div
        className="absolute inset-0"
        style={{ background: d ? "rgba(0,0,0,0.6)" : "rgba(0,0,0,0.25)" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />
      <motion.div
        className="relative z-10 overflow-hidden"
        style={{
          maxHeight: "85vh",
          background: d ? "#111113" : "#FFFFFF",
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          boxShadow: d ? "0 -8px 40px rgba(0,0,0,0.5)" : "0 -8px 40px rgba(0,0,0,0.08)",
        }}
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", stiffness: 350, damping: 30, mass: 0.8 }}
      >
        <div className="flex justify-center pt-2.5 pb-1">
          <div className="w-9 h-1 rounded-full" style={{ background: d ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.15)" }} />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-2 mb-1">
          <div className="flex items-center gap-2.5">
            {view !== "detail" && (
              <motion.button
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ background: c.surface.subtle }}
                onClick={handleBack}
                whileTap={{ scale: 0.9 }}
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={MOTION.micro}
              >
                <ArrowLeft className="w-4 h-4" style={{ color: c.text.muted }} />
              </motion.button>
            )}
            <span style={{ ...RT.body, fontWeight: 600, color: c.text.primary }}>{title}</span>
          </div>
          <motion.button
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: c.surface.subtle }}
            onClick={onClose}
            whileTap={{ scale: 0.9 }}
          >
            <X className="w-4 h-4" style={{ color: c.icon.secondary }} />
          </motion.button>
        </div>

        <div className="overflow-y-auto" style={{ maxHeight: "75vh" }}>
          <AnimatePresence mode="wait">
            {/* ─── DETAIL VIEW ─── */}
            {view === "detail" && (
              <motion.div key="detail" className="px-5 pb-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, x: -20 }} transition={MOTION.micro}>
                <div className="text-center mb-1">
                  <span style={{ ...RT.hero, color: isCancelled ? c.text.muted : c.text.primary }}>
                    {isCancelled ? "—" : trip.fare}
                  </span>
                </div>
                <div className="flex justify-center mb-5">
                  <span className="px-2 py-0.5 rounded-md" style={{ ...RT.statusPill, color: isCancelled ? BRAND_COLORS.error : BRAND_COLORS.green, background: isCancelled ? (d ? "rgba(212,24,61,0.12)" : "rgba(212,24,61,0.08)") : (d ? "rgba(29,185,84,0.12)" : "rgba(29,185,84,0.08)") }}>
                    {isCancelled ? "Cancelled" : "Completed"}
                  </span>
                </div>
                <div className="flex gap-3 mb-4">
                  <div className="flex flex-col items-center py-1 shrink-0">
                    <div className="w-2 h-2 rounded-full border-[1.5px]" style={{ borderColor: BRAND_COLORS.green }} />
                    <div className="w-px flex-1 my-1" style={{ background: c.surface.hover }} />
                    <div className="w-2 h-2 rounded-full" style={{ background: c.text.ghost }} />
                  </div>
                  <div className="flex-1">
                    <div style={{ ...RT.bodySmall, color: c.text.primary }}>{trip.from}</div>
                    <div className="mt-0.5 mb-3" style={{ ...RT.meta, color: c.text.muted }}>{trip.time}</div>
                    <div style={{ ...RT.bodySmall, color: c.text.primary }}>{trip.to}</div>
                  </div>
                </div>
                {!isCancelled && (
                  <div className="flex items-center gap-3 px-4 py-3 rounded-xl mb-3" style={{ background: c.surface.subtle, border: `1px solid ${c.surface.hover}` }}>
                    <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0" style={{ background: d ? "rgba(255,255,255,0.08)" : "rgba(11,11,13,0.06)" }}>
                      <span style={{ ...RT.meta, fontWeight: 600, color: c.text.tertiary }}>{trip.driverInitials}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span style={{ ...RT.bodySmall, color: c.text.primary }}>{trip.driver}</span>
                        <span style={{ ...RT.metaSmall, color: c.text.muted }}>★ {trip.rating}</span>
                        {trip.ev && (<span className="px-1 py-px rounded" style={{ ...RT.badge, color: c.green.evText, background: c.green.evBg }}>EV</span>)}
                      </div>
                      <div className="mt-0.5 truncate" style={{ ...RT.meta, color: c.text.muted }}>{trip.vehicle}</div>
                    </div>
                    <div className="text-right shrink-0">
                      <div style={{ ...RT.meta, color: c.text.tertiary }}>{trip.durationMin} min</div>
                      <div className="mt-0.5" style={{ ...RT.meta, color: c.text.muted }}>{trip.distanceKm} km</div>
                    </div>
                  </div>
                )}
                <div className="rounded-xl px-4 py-1 mb-3" style={{ background: c.surface.subtle, border: `1px solid ${c.surface.hover}` }}>
                  <div className="flex items-center justify-between py-3">
                    <span style={{ ...RT.meta, color: c.text.muted }}>Date</span>
                    <span style={{ ...RT.bodySmall, color: c.text.primary }}>{trip.fullDate}</span>
                  </div>
                  <div style={{ borderBottom: divider }} />
                  <div className="flex items-center justify-between py-3">
                    <span style={{ ...RT.meta, color: c.text.muted }}>Paid with</span>
                    <span style={{ ...RT.bodySmall, color: c.text.primary }}>{trip.payment}</span>
                  </div>
                  {!isCancelled && trip.breakdown && (
                    <>
                      <div style={{ borderBottom: divider }} />
                      <div className="py-2.5 space-y-2">
                        {[
                          { label: "Base fare", value: trip.breakdown.baseFare },
                          { label: "Distance", value: trip.breakdown.distance },
                          { label: "Time", value: trip.breakdown.time },
                          ...(trip.breakdown.surge ? [{ label: "Surge", value: trip.breakdown.surge }] : []),
                          ...(trip.breakdown.discount ? [{ label: "Discount", value: trip.breakdown.discount, green: true }] : []),
                        ].map((row) => (
                          <div key={row.label} className="flex items-center justify-between">
                            <span style={{ ...RT.meta, color: c.text.faint }}>{row.label}</span>
                            <span style={{ ...RT.meta, color: "green" in row && row.green ? BRAND_COLORS.green : c.text.muted }}>{row.value}</span>
                          </div>
                        ))}
                      </div>
                      <div style={{ borderBottom: divider }} />
                      <div className="flex items-center justify-between py-3">
                        <span style={{ ...RT.meta, fontWeight: 600, color: c.text.tertiary }}>Total</span>
                        <span style={{ ...RT.bodySmall, fontWeight: 600, color: c.text.primary }}>{trip.breakdown.total}</span>
                      </div>
                    </>
                  )}
                </div>
                <div className="pt-4" style={{ borderTop: divider }}>
                  <div className="flex gap-2 mb-3">
                    <motion.button className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl" style={{ background: c.surface.subtle }} onClick={() => setView("help")} whileTap={{ scale: 0.97 }}>
                      <HelpCircle className="w-3.5 h-3.5" style={{ color: c.icon.secondary }} />
                      <span style={{ ...RT.meta, color: c.text.secondary }}>Get help</span>
                    </motion.button>
                    <motion.button className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl" style={{ background: d ? "rgba(212,24,61,0.06)" : "rgba(212,24,61,0.04)", border: `1px solid ${d ? "rgba(212,24,61,0.1)" : "rgba(212,24,61,0.08)"}` }} onClick={() => setView("report")} whileTap={{ scale: 0.97 }}>
                      <Flag className="w-3.5 h-3.5" style={{ color: BRAND_COLORS.error }} />
                      <span style={{ ...RT.meta, color: BRAND_COLORS.error }}>Report issue</span>
                    </motion.button>
                  </div>
                  <div className="flex items-center justify-center gap-5">
                    <motion.button className="flex items-center gap-1" onClick={onBookAgain} whileTap={{ scale: 0.95 }}>
                      <span style={{ ...RT.meta, fontWeight: 600, color: BRAND_COLORS.green }}>Book again</span>
                    </motion.button>
                    <motion.button className="flex items-center gap-1" onClick={handleCopyReceipt} whileTap={{ scale: 0.95 }}>
                      <span style={{ ...RT.meta, color: c.text.muted }}>{copied ? "Copied" : "Share receipt"}</span>
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ─── HELP TOPICS ─── */}
            {view === "help" && (
              <motion.div key="help" className="px-5 pb-6" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={MOTION.micro}>
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg mb-4" style={{ background: c.surface.subtle }}>
                  <ArrowUpRight className="w-3.5 h-3.5" style={{ color: c.icon.muted }} />
                  <span style={{ ...RT.meta, color: c.text.muted }}>{trip.from} → {trip.to} · {trip.time}</span>
                </div>
                <div className="space-y-0">
                  {RIDER_HELP_TOPICS.map((topic, i) => (
                    <motion.button key={topic.id} className="w-full flex items-center gap-3 py-3.5" style={{ borderBottom: i < RIDER_HELP_TOPICS.length - 1 ? `1px solid ${c.surface.hover}` : "none" }} onClick={() => { setSelectedTopic(topic); setView("help-topic"); }} whileTap={{ scale: 0.98 }} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ ...MOTION.standard, delay: i * 0.03 }}>
                      <topic.icon className="w-4 h-4 shrink-0" style={{ color: c.icon.secondary }} />
                      <span className="flex-1 text-left" style={{ ...RT.bodySmall, color: c.text.primary }}>{topic.label}</span>
                      <ChevronRight className="w-4 h-4 shrink-0" style={{ color: c.icon.muted }} />
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* ─── HELP TOPIC DETAIL ─── */}
            {view === "help-topic" && selectedTopic && (
              <motion.div key="help-topic" className="px-5 pb-6" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={MOTION.micro}>
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4" style={{ background: c.surface.subtle }}>
                  <selectedTopic.icon className="w-5 h-5" style={{ color: c.icon.secondary }} />
                </div>
                <p style={{ ...RT.bodySmall, color: c.text.secondary, lineHeight: "1.6", marginBottom: "16px" }}>{selectedTopic.description}</p>
                <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl mb-5" style={{ background: c.surface.subtle }}>
                  <MapPin className="w-3.5 h-3.5 shrink-0" style={{ color: c.icon.muted }} />
                  <span style={{ ...RT.meta, color: c.text.muted }}>{trip.from} → {trip.to}</span>
                  <span className="ml-auto shrink-0" style={{ ...RT.meta, color: c.text.primary }}>{trip.fare}</span>
                </div>
                <motion.button className="w-full flex items-center justify-center gap-2.5 py-3 rounded-xl" style={{ background: BRAND_COLORS.green, boxShadow: `0 4px 16px ${BRAND_COLORS.green}25` }} onClick={handleSubmitHelp} whileTap={{ scale: 0.97 }}>
                  <Send className="w-4 h-4" style={{ color: "#fff" }} />
                  <span style={{ ...RT.cta, color: "#fff" }}>Contact support</span>
                </motion.button>
              </motion.div>
            )}

            {/* ─── REPORT REASONS ─── */}
            {view === "report" && (
              <motion.div key="report" className="px-5 pb-6" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={MOTION.micro}>
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg mb-4" style={{ background: c.surface.subtle }}>
                  <ArrowUpRight className="w-3.5 h-3.5" style={{ color: c.icon.muted }} />
                  <span style={{ ...RT.meta, color: c.text.muted }}>{trip.driver} · {trip.from} → {trip.to}</span>
                </div>
                <p className="mb-4" style={{ ...RT.meta, color: c.text.ghost }}>Select the issue that best describes what happened.</p>
                <div className="space-y-0">
                  {RIDER_REPORT_REASONS.map((reason, i) => (
                    <motion.button key={reason.id} className="w-full flex items-center gap-3 py-3.5" style={{ borderBottom: i < RIDER_REPORT_REASONS.length - 1 ? `1px solid ${c.surface.hover}` : "none" }} onClick={() => { setSelectedReason(reason); setReportNotes(""); setView("report-notes"); }} whileTap={{ scale: 0.98 }} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ ...MOTION.standard, delay: i * 0.03 }}>
                      <reason.icon className="w-4 h-4 shrink-0" style={{ color: BRAND_COLORS.error + "90" }} />
                      <span className="flex-1 text-left" style={{ ...RT.bodySmall, color: c.text.primary }}>{reason.label}</span>
                      <ChevronRight className="w-4 h-4 shrink-0" style={{ color: c.icon.muted }} />
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* ─── REPORT NOTES + SUBMIT ─── */}
            {view === "report-notes" && selectedReason && (
              <motion.div key="report-notes" className="px-5 pb-6" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={MOTION.micro}>
                <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl mb-4" style={{ background: d ? "rgba(212,24,61,0.06)" : "rgba(212,24,61,0.04)", border: `1px solid ${d ? "rgba(212,24,61,0.1)" : "rgba(212,24,61,0.08)"}` }}>
                  <selectedReason.icon className="w-3.5 h-3.5 shrink-0" style={{ color: BRAND_COLORS.error }} />
                  <span style={{ ...RT.meta, color: BRAND_COLORS.error }}>{selectedReason.label}</span>
                </div>
                <div className="mb-4">
                  <label style={{ ...RT.meta, color: c.text.muted, display: "block", marginBottom: "8px" }}>Additional details (optional)</label>
                  <textarea className="w-full rounded-xl px-4 py-3 resize-none outline-none" rows={3} placeholder="Tell us more about what happened..." value={reportNotes} onChange={(e) => setReportNotes(e.target.value)} style={{ ...RT.bodySmall, color: c.text.primary, background: c.surface.subtle, border: `1px solid ${c.surface.hover}`, lineHeight: "1.5" }} />
                </div>
                <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl mb-5" style={{ background: c.surface.subtle }}>
                  <MapPin className="w-3.5 h-3.5 shrink-0" style={{ color: c.icon.muted }} />
                  <span style={{ ...RT.meta, color: c.text.muted }}>{trip.from} → {trip.to} · {trip.driver}</span>
                </div>
                <motion.button className="w-full flex items-center justify-center gap-2.5 py-3 rounded-xl" style={{ background: BRAND_COLORS.error, boxShadow: `0 4px 16px ${BRAND_COLORS.error}25` }} onClick={handleSubmitReport} whileTap={{ scale: 0.97 }}>
                  <Flag className="w-4 h-4" style={{ color: "#fff" }} />
                  <span style={{ ...RT.cta, color: "#fff" }}>Submit report</span>
                </motion.button>
                <p className="text-center mt-3" style={{ ...RT.meta, color: c.text.ghost }}>Reports are reviewed within 24 hours.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <ToastContainer />
      </motion.div>
    </div>
  );
}