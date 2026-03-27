/**
 * Driver Sheets — Bottom sheet overlays for Driver Earnings Home.
 *
 * Sheets:
 *   - TripDetailSheet — expanded view of a completed trip
 *   - EarningsBreakdownSheet — daily/weekly earnings decomposition
 *   - DemandZonesSheet — all active demand zones
 *
 * C spine: GlassPanel, ambient backdrop, green-as-scalpel, motion stagger.
 * Pattern: matches Rider wallet-sheets.tsx architecture.
 */

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  X,
  ArrowUpRight,
  ArrowLeft,
  Star,
  Clock,
  Car,
  Banknote,
  Smartphone,
  Zap,
  TrendingUp,
  MapPin,
  Users,
  Route,
  HelpCircle,
  Flag,
  ChevronRight,
  MessageSquare,
  CreditCard,
  Navigation,
  ShieldAlert,
  CircleDot,
  CheckCircle2,
  Send,
} from "lucide-react";
import {
  GLASS_COLORS,
  GLASS_TYPE,
  MOTION,
  type GlassColorMode,
} from "../../config/project";
import { BRAND_COLORS } from "../../config/brand";
import { DRIVER_TYPE as DT } from "../../config/driver-type";
import { GlassPanel } from "../rider/glass-panel";
import { useJetToast } from "../rider/jet-toast";
import {
  type TripRecord,
  type EarningsPeriod,
  type DemandZone,
  type DailyEarning,
  formatNaira,
  formatHours,
  getDemandColor,
} from "./driver-data";

// ---------------------------------------------------------------------------
// Shared backdrop
// ---------------------------------------------------------------------------
function SheetBackdrop({
  onClose,
  children,
  colorMode,
}: {
  onClose: () => void;
  children: React.ReactNode;
  colorMode: GlassColorMode;
}) {
  const d = colorMode === "dark";
  return (
    <motion.div
      className="absolute inset-0 z-40 flex flex-col justify-end"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      {/* Scrim */}
      <motion.div
        className="absolute inset-0"
        style={{
          background: d ? "rgba(0,0,0,0.6)" : "rgba(0,0,0,0.3)",
          backdropFilter: "blur(4px)",
          WebkitBackdropFilter: "blur(4px)",
        }}
        onClick={onClose}
      />
      {/* Sheet */}
      <motion.div
        className="relative z-10"
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", stiffness: 350, damping: 32 }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Sheet header with close
// ---------------------------------------------------------------------------
function SheetHeader({
  title,
  onClose,
  colorMode,
}: {
  title: string;
  onClose: () => void;
  colorMode: GlassColorMode;
}) {
  const c = GLASS_COLORS[colorMode];
  return (
    <div className="flex items-center justify-between px-5 pt-5 pb-3">
      <span
        style={{
          fontFamily: "var(--font-heading)",
          fontSize: "18px",
          fontWeight: 600,
          letterSpacing: "-0.03em",
          lineHeight: "1.3",
          color: c.text.primary,
        }}
      >
        {title}
      </span>
      <motion.button
        className="w-8 h-8 rounded-full flex items-center justify-center"
        style={{ background: c.surface.subtle }}
        onClick={onClose}
        whileTap={{ scale: 0.9 }}
      >
        <X className="w-4 h-4" style={{ color: c.text.muted }} />
      </motion.button>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Stat row helper
// ---------------------------------------------------------------------------
function StatRow({
  label,
  value,
  colorMode,
  valueColor,
  icon: Icon,
}: {
  label: string;
  value: string;
  colorMode: GlassColorMode;
  valueColor?: string;
  icon?: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
}) {
  const c = GLASS_COLORS[colorMode];
  return (
    <div className="flex items-center justify-between py-2.5">
      <div className="flex items-center gap-2">
        {Icon && <Icon className="w-3.5 h-3.5" style={{ color: c.icon.muted }} />}
        <span style={{ ...DT.secondary, color: c.text.tertiary }}>
          {label}
        </span>
      </div>
      <span
        style={{
          ...DT.label,
          color: valueColor || c.text.primary,
        }}
      >
        {value}
      </span>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// Help & Report data
// ═══════════════════════════════════════════════════════════════════════════

interface HelpTopic {
  id: string;
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  label: string;
  description: string;
}

const HELP_TOPICS: HelpTopic[] = [
  {
    id: "fare_wrong",
    icon: CreditCard,
    label: "My fare seems wrong",
    description:
      "If the fare doesn't match what you expected, it may be due to route changes, tolls, or surge adjustments. We'll review the trip and correct any errors within 24 hours.",
  },
  {
    id: "not_paid",
    icon: Banknote,
    label: "I wasn't paid for this trip",
    description:
      "If you completed this trip but don't see earnings, it may be processing. Cash trips settle immediately; digital payments can take up to 2 hours. If it's been longer, we'll investigate.",
  },
  {
    id: "route_issue",
    icon: Navigation,
    label: "Route or navigation problem",
    description:
      "If the navigation took a longer route or the distance seems incorrect, we can review GPS data and adjust your fare accordingly.",
  },
  {
    id: "toll_missing",
    icon: Route,
    label: "Toll charges not included",
    description:
      "Toll fees should be automatically added to the rider's fare. If they weren't, submit this request and we'll reimburse you within 24 hours.",
  },
  {
    id: "other_help",
    icon: HelpCircle,
    label: "Something else",
    description:
      "Tell us what happened and our support team will review your trip and get back to you as soon as possible.",
  },
];

interface ReportReason {
  id: string;
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  label: string;
}

const REPORT_REASONS: ReportReason[] = [
  { id: "rude_rider", icon: MessageSquare, label: "Rider was rude or aggressive" },
  { id: "vehicle_damage", icon: Car, label: "Rider damaged my vehicle" },
  { id: "wrong_pickup", icon: MapPin, label: "Rider gave wrong pickup location" },
  { id: "safety", icon: ShieldAlert, label: "Safety concern" },
  { id: "fraud", icon: Flag, label: "Suspected fraud" },
  { id: "other_report", icon: CircleDot, label: "Other issue" },
];

// ═══════════════════════════════════════════════════════════════════════════
// TripDetailSheet — multi-view: detail → help/report → submit
// ═══════════════════════════════════════════════════════════════════════════
type SheetView = "detail" | "help" | "help-topic" | "report" | "report-notes";

export function TripDetailSheet({
  trip,
  colorMode,
  onClose,
}: {
  trip: TripRecord;
  colorMode: GlassColorMode;
  onClose: () => void;
}) {
  const c = GLASS_COLORS[colorMode];
  const d = colorMode === "dark";
  const { showToast, ToastContainer } = useJetToast(colorMode);

  const [view, setView] = useState<SheetView>("detail");
  const [selectedTopic, setSelectedTopic] = useState<HelpTopic | null>(null);
  const [selectedReason, setSelectedReason] = useState<ReportReason | null>(null);
  const [reportNotes, setReportNotes] = useState("");

  const handleBack = useCallback(() => {
    if (view === "help-topic") setView("help");
    else if (view === "report-notes") setView("report");
    else setView("detail");
  }, [view]);

  const handleSubmitHelp = useCallback(() => {
    showToast({
      message: "Support request sent — we'll review within 24h",
      variant: "success",
    });
    setTimeout(() => onClose(), 600);
  }, [showToast, onClose]);

  const handleSubmitReport = useCallback(() => {
    showToast({
      message: "Report submitted — thank you",
      variant: "success",
    });
    setTimeout(() => onClose(), 600);
  }, [showToast, onClose]);

  // Title based on view
  const title =
    view === "detail"
      ? "Trip details"
      : view === "help"
        ? "Get help"
        : view === "help-topic"
          ? selectedTopic?.label ?? "Help"
          : view === "report"
            ? "Report an issue"
            : selectedReason?.label ?? "Report";

  return (
    <SheetBackdrop onClose={onClose} colorMode={colorMode}>
      <GlassPanel
        variant={d ? "dark" : "light"}
        className="rounded-t-3xl overflow-hidden"
        blur={32}
      >
        {/* ── Header ── */}
        <div className="flex items-center justify-between px-5 pt-5 pb-3">
          <div className="flex items-center gap-2.5">
            {view !== "detail" && (
              <motion.button
                className="w-8 h-8 rounded-full flex items-center justify-center"
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
            <span
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "18px",
                fontWeight: 600,
                letterSpacing: "-0.03em",
                lineHeight: "1.3",
                color: c.text.primary,
              }}
            >
              {title}
            </span>
          </div>
          <motion.button
            className="w-8 h-8 rounded-full flex items-center justify-center"
            style={{ background: c.surface.subtle }}
            onClick={onClose}
            whileTap={{ scale: 0.9 }}
          >
            <X className="w-4 h-4" style={{ color: c.text.muted }} />
          </motion.button>
        </div>

        {/* ── Content — transitions between views ── */}
        <AnimatePresence mode="wait">
          {/* ─── DETAIL VIEW ─── */}
          {view === "detail" && (
            <motion.div
              key="detail"
              initial={{ opacity: 0, x: 0 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={MOTION.micro}
            >
              <div className="px-5 pb-6">
                {/* Route */}
                <div className="flex items-start gap-3 mb-5">
                  <div className="flex flex-col items-center shrink-0 pt-0.5">
                    <div className="w-2.5 h-2.5 rounded-full border-2 border-[#1DB954] bg-transparent" />
                    <div
                      className="w-px my-1"
                      style={{ height: 20, background: c.surface.hover }}
                    />
                    <div
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ background: c.text.ghost }}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div style={{ ...DT.secondary, color: c.text.primary, marginBottom: "2px" }}>
                      {trip.from}
                    </div>
                    <div
                      className="w-full my-1.5"
                      style={{ height: 1, background: c.surface.hover }}
                    />
                    <div style={{ ...DT.secondary, color: c.text.primary }}>
                      {trip.to}
                    </div>
                  </div>
                </div>

                {/* Rider info */}
                <div
                  className="flex items-center gap-3 px-3.5 py-3 rounded-xl mb-4"
                  style={{ background: c.surface.subtle }}
                >
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
                    style={{ background: c.surface.hover }}
                  >
                    <span
                      style={{
                        ...DT.meta,
                        fontWeight: 600,
                        color: c.text.secondary,
                      }}
                    >
                      {trip.rider
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <span style={{ ...DT.secondary, color: c.text.primary }}>
                      {trip.rider}
                    </span>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <Star
                        className="w-3 h-3"
                        style={{ color: BRAND_COLORS.green, fill: BRAND_COLORS.green }}
                      />
                      <span style={{ ...DT.meta, color: c.text.muted }}>
                        {trip.riderRating} · {trip.riderTrips} rides
                      </span>
                    </div>
                  </div>
                  <span style={{ ...DT.meta, color: c.text.ghost }}>
                    {trip.time}
                  </span>
                </div>

                {/* Fare breakdown */}
                <div
                  className="px-1"
                  style={{
                    borderTop: `1px solid ${d ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}`,
                  }}
                >
                  <StatRow
                    label="Gross fare"
                    value={formatNaira(trip.grossFare)}
                    colorMode={colorMode}
                    icon={Banknote}
                  />
                  <StatRow
                    label="Commission (20%)"
                    value={`-${formatNaira(trip.commission)}`}
                    colorMode={colorMode}
                    valueColor={d ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.35)"}
                  />
                  {trip.tip > 0 && (
                    <StatRow
                      label="Tip"
                      value={`+${formatNaira(trip.tip)}`}
                      colorMode={colorMode}
                      valueColor={BRAND_COLORS.green}
                      icon={Star}
                    />
                  )}
                  <div
                    className="mt-1 pt-2"
                    style={{
                      borderTop: `1px solid ${d ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}`,
                    }}
                  >
                    <StatRow
                      label="Net earnings"
                      value={formatNaira(trip.netEarnings + trip.tip)}
                      colorMode={colorMode}
                      valueColor={BRAND_COLORS.green}
                    />
                  </div>
                </div>

                {/* Trip meta chips */}
                <div className="flex gap-3 mt-3">
                  {[
                    { icon: Clock, label: `${trip.duration} min` },
                    {
                      icon: Route,
                      label: `${trip.distance} km`,
                    },
                    {
                      icon: trip.paymentType === "cash" ? Banknote : Smartphone,
                      label: trip.paymentType === "cash" ? "Cash" : "Digital",
                    },
                    ...(trip.vehicleType === "EV"
                      ? [{ icon: Zap, label: "EV" }]
                      : []),
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg"
                      style={{ background: c.surface.subtle }}
                    >
                      <item.icon
                        className="w-3 h-3"
                        style={{
                          color:
                            item.label === "EV"
                              ? BRAND_COLORS.green
                              : c.icon.muted,
                        }}
                      />
                      <span
                        style={{
                          ...DT.meta,
                          color:
                            item.label === "EV"
                              ? BRAND_COLORS.green
                              : c.text.muted,
                        }}
                      >
                        {item.label}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Get help / Report issue */}
                <div
                  className="mt-5 pt-4"
                  style={{
                    borderTop: `1px solid ${d ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}`,
                  }}
                >
                  <div className="flex gap-2">
                    <motion.button
                      className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl"
                      style={{ background: c.surface.subtle }}
                      onClick={() => setView("help")}
                      whileTap={{ scale: 0.97 }}
                    >
                      <HelpCircle
                        className="w-3.5 h-3.5"
                        style={{ color: c.icon.secondary }}
                      />
                      <span style={{ ...DT.meta, color: c.text.secondary }}>
                        Get help
                      </span>
                    </motion.button>
                    <motion.button
                      className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl"
                      style={{
                        background: d
                          ? "rgba(212,24,61,0.06)"
                          : "rgba(212,24,61,0.04)",
                        border: `1px solid ${d ? "rgba(212,24,61,0.1)" : "rgba(212,24,61,0.08)"}`,
                      }}
                      onClick={() => setView("report")}
                      whileTap={{ scale: 0.97 }}
                    >
                      <Flag
                        className="w-3.5 h-3.5"
                        style={{ color: BRAND_COLORS.error }}
                      />
                      <span style={{ ...DT.meta, color: BRAND_COLORS.error }}>
                        Report issue
                      </span>
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* ─── HELP TOPICS LIST ─── */}
          {view === "help" && (
            <motion.div
              key="help"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={MOTION.micro}
            >
              <div className="px-5 pb-6">
                {/* Trip context pill */}
                <div
                  className="flex items-center gap-2 px-3 py-2 rounded-lg mb-4"
                  style={{ background: c.surface.subtle }}
                >
                  <ArrowUpRight className="w-3.5 h-3.5" style={{ color: c.icon.muted }} />
                  <span style={{ ...DT.meta, color: c.text.muted }}>
                    {trip.from} → {trip.to} · {trip.time}
                  </span>
                </div>

                <div className="space-y-0">
                  {HELP_TOPICS.map((topic, i) => (
                    <motion.button
                      key={topic.id}
                      className="w-full flex items-center gap-3 py-3.5"
                      style={{
                        borderBottom:
                          i < HELP_TOPICS.length - 1
                            ? `1px solid ${c.surface.hover}`
                            : "none",
                      }}
                      onClick={() => {
                        setSelectedTopic(topic);
                        setView("help-topic");
                      }}
                      whileTap={{ scale: 0.98 }}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        ...MOTION.standard,
                        delay: i * 0.03,
                      }}
                    >
                      <topic.icon
                        className="w-4 h-4 shrink-0"
                        style={{ color: c.icon.secondary }}
                      />
                      <span
                        className="flex-1 text-left"
                        style={{ ...DT.secondary, color: c.text.primary }}
                      >
                        {topic.label}
                      </span>
                      <ChevronRight
                        className="w-4 h-4 shrink-0"
                        style={{ color: c.icon.muted }}
                      />
                    </motion.button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* ─── HELP TOPIC DETAIL ─── */}
          {view === "help-topic" && selectedTopic && (
            <motion.div
              key="help-topic"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={MOTION.micro}
            >
              <div className="px-5 pb-6">
                {/* Icon */}
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4"
                  style={{ background: c.surface.subtle }}
                >
                  <selectedTopic.icon
                    className="w-5 h-5"
                    style={{ color: c.icon.secondary }}
                  />
                </div>

                {/* Description */}
                <p
                  style={{
                    ...DT.secondary,
                    color: c.text.secondary,
                    lineHeight: "1.6",
                    marginBottom: "16px",
                  }}
                >
                  {selectedTopic.description}
                </p>

                {/* Trip reference */}
                <div
                  className="flex items-center gap-2 px-3 py-2.5 rounded-xl mb-5"
                  style={{ background: c.surface.subtle }}
                >
                  <MapPin className="w-3.5 h-3.5 shrink-0" style={{ color: c.icon.muted }} />
                  <span style={{ ...DT.meta, color: c.text.muted }}>
                    {trip.from} → {trip.to}
                  </span>
                  <span
                    className="ml-auto shrink-0"
                    style={{ ...DT.meta, color: BRAND_COLORS.green }}
                  >
                    {formatNaira(trip.netEarnings)}
                  </span>
                </div>

                {/* Submit CTA */}
                <motion.button
                  className="w-full flex items-center justify-center gap-2.5 py-3 rounded-xl"
                  style={{
                    background: BRAND_COLORS.green,
                    boxShadow: `0 4px 16px ${BRAND_COLORS.green}25`,
                  }}
                  onClick={handleSubmitHelp}
                  whileTap={{ scale: 0.97 }}
                >
                  <Send className="w-4 h-4" style={{ color: "#fff" }} />
                  <span style={{ ...DT.cta, color: "#fff" }}>
                    Contact support
                  </span>
                </motion.button>
              </div>
            </motion.div>
          )}

          {/* ─── REPORT REASONS LIST ─── */}
          {view === "report" && (
            <motion.div
              key="report"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={MOTION.micro}
            >
              <div className="px-5 pb-6">
                {/* Context */}
                <div
                  className="flex items-center gap-2 px-3 py-2 rounded-lg mb-4"
                  style={{ background: c.surface.subtle }}
                >
                  <ArrowUpRight className="w-3.5 h-3.5" style={{ color: c.icon.muted }} />
                  <span style={{ ...DT.meta, color: c.text.muted }}>
                    {trip.rider} · {trip.from} → {trip.to}
                  </span>
                </div>

                <p
                  className="mb-4"
                  style={{ ...DT.meta, color: c.text.ghost }}
                >
                  Select the issue that best describes what happened.
                </p>

                <div className="space-y-0">
                  {REPORT_REASONS.map((reason, i) => (
                    <motion.button
                      key={reason.id}
                      className="w-full flex items-center gap-3 py-3.5"
                      style={{
                        borderBottom:
                          i < REPORT_REASONS.length - 1
                            ? `1px solid ${c.surface.hover}`
                            : "none",
                      }}
                      onClick={() => {
                        setSelectedReason(reason);
                        setReportNotes("");
                        setView("report-notes");
                      }}
                      whileTap={{ scale: 0.98 }}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        ...MOTION.standard,
                        delay: i * 0.03,
                      }}
                    >
                      <reason.icon
                        className="w-4 h-4 shrink-0"
                        style={{ color: BRAND_COLORS.error + "90" }}
                      />
                      <span
                        className="flex-1 text-left"
                        style={{ ...DT.secondary, color: c.text.primary }}
                      >
                        {reason.label}
                      </span>
                      <ChevronRight
                        className="w-4 h-4 shrink-0"
                        style={{ color: c.icon.muted }}
                      />
                    </motion.button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* ─── REPORT NOTES + SUBMIT ─── */}
          {view === "report-notes" && selectedReason && (
            <motion.div
              key="report-notes"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={MOTION.micro}
            >
              <div className="px-5 pb-6">
                {/* Selected reason pill */}
                <div
                  className="flex items-center gap-2 px-3 py-2.5 rounded-xl mb-4"
                  style={{
                    background: d
                      ? "rgba(212,24,61,0.06)"
                      : "rgba(212,24,61,0.04)",
                    border: `1px solid ${d ? "rgba(212,24,61,0.1)" : "rgba(212,24,61,0.08)"}`,
                  }}
                >
                  <selectedReason.icon
                    className="w-3.5 h-3.5 shrink-0"
                    style={{ color: BRAND_COLORS.error }}
                  />
                  <span style={{ ...DT.meta, color: BRAND_COLORS.error }}>
                    {selectedReason.label}
                  </span>
                </div>

                {/* Notes textarea */}
                <div className="mb-4">
                  <label
                    style={{
                      ...DT.meta,
                      color: c.text.muted,
                      display: "block",
                      marginBottom: "8px",
                    }}
                  >
                    Additional details (optional)
                  </label>
                  <textarea
                    className="w-full rounded-xl px-4 py-3 resize-none outline-none"
                    rows={3}
                    placeholder="Tell us more about what happened..."
                    value={reportNotes}
                    onChange={(e) => setReportNotes(e.target.value)}
                    style={{
                      ...DT.secondary,
                      color: c.text.primary,
                      background: c.surface.subtle,
                      border: `1px solid ${c.surface.hover}`,
                      lineHeight: "1.5",
                    }}
                  />
                </div>

                {/* Trip reference */}
                <div
                  className="flex items-center gap-2 px-3 py-2.5 rounded-xl mb-5"
                  style={{ background: c.surface.subtle }}
                >
                  <MapPin className="w-3.5 h-3.5 shrink-0" style={{ color: c.icon.muted }} />
                  <span style={{ ...DT.meta, color: c.text.muted }}>
                    {trip.from} → {trip.to} · {trip.rider}
                  </span>
                </div>

                {/* Submit report CTA */}
                <motion.button
                  className="w-full flex items-center justify-center gap-2.5 py-3 rounded-xl"
                  style={{
                    background: BRAND_COLORS.error,
                    boxShadow: `0 4px 16px ${BRAND_COLORS.error}25`,
                  }}
                  onClick={handleSubmitReport}
                  whileTap={{ scale: 0.97 }}
                >
                  <Flag className="w-4 h-4" style={{ color: "#fff" }} />
                  <span style={{ ...DT.cta, color: "#fff" }}>
                    Submit report
                  </span>
                </motion.button>

                {/* Disclaimer */}
                <p
                  className="text-center mt-3"
                  style={{ ...DT.meta, color: c.text.ghost }}
                >
                  Reports are reviewed within 24 hours. False reports may affect your account.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Toast container */}
        <ToastContainer />
      </GlassPanel>
    </SheetBackdrop>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// EarningsBreakdownSheet
// ═══════════════════════════════════════════════════════════════════════════
export function EarningsBreakdownSheet({
  today,
  week,
  daily,
  colorMode,
  onClose,
}: {
  today: EarningsPeriod;
  week: EarningsPeriod;
  daily: DailyEarning[];
  colorMode: GlassColorMode;
  onClose: () => void;
}) {
  const c = GLASS_COLORS[colorMode];
  const d = colorMode === "dark";

  return (
    <SheetBackdrop onClose={onClose} colorMode={colorMode}>
      <GlassPanel
        variant={d ? "dark" : "light"}
        className="rounded-t-3xl overflow-hidden"
        blur={32}
      >
        <SheetHeader title="Earnings breakdown" onClose={onClose} colorMode={colorMode} />

        <div className="px-5 pb-6 max-h-[65vh] overflow-y-auto scrollbar-hide">
          {/* Today hero */}
          <motion.div
            className="text-center mb-5"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <span
              style={{
                ...DT.meta,
                color: c.text.muted,
                display: "block",
                marginBottom: "4px",
              }}
            >
              Today
            </span>
            <span
              style={{
                ...DT.hero,
                fontSize: "32px",
                color: c.text.display,
              }}
            >
              {formatNaira(today.earnings)}
            </span>
            <span
              className="block mt-1"
              style={{ ...DT.meta, color: c.text.ghost }}
            >
              {today.trips} trips · {formatHours(today.hoursOnline)} online
            </span>
          </motion.div>

          {/* Today breakdown */}
          <motion.div
            className="mb-5"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            <div
              className="px-1"
              style={{
                borderTop: `1px solid ${d ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}`,
              }}
            >
              <StatRow label="Gross fares" value={formatNaira(today.earnings + today.commission)} colorMode={colorMode} icon={Car} />
              <StatRow
                label="Commission (20%)"
                value={`-${formatNaira(today.commission)}`}
                colorMode={colorMode}
                valueColor={d ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.35)"}
              />
              {today.bonuses > 0 && (
                <StatRow label="Bonuses" value={`+${formatNaira(today.bonuses)}`} colorMode={colorMode} valueColor={BRAND_COLORS.green} icon={TrendingUp} />
              )}
              {today.tips > 0 && (
                <StatRow label="Tips" value={`+${formatNaira(today.tips)}`} colorMode={colorMode} valueColor={BRAND_COLORS.green} icon={Star} />
              )}
              <StatRow label="Cash trips" value={`${today.cashTrips}`} colorMode={colorMode} icon={Banknote} />
              <StatRow label="Digital trips" value={`${today.digitalTrips}`} colorMode={colorMode} icon={Smartphone} />
            </div>
          </motion.div>

          {/* Weekly sparkline expanded */}
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <span
              style={{
                ...DT.statLabel,
                letterSpacing: "0.05em",
                textTransform: "uppercase" as const,
                color: c.text.faint,
                display: "block",
                marginBottom: "8px",
              }}
            >
              This week
            </span>
            <div className="flex items-end gap-1.5" style={{ height: 60 }}>
              {daily.map((day, i) => {
                const max = Math.max(...daily.map((dd) => dd.amount), 1);
                const h = day.amount > 0 ? (day.amount / max) * 100 : 4;
                const isToday = i === new Date().getDay() - 1;
                return (
                  <div key={day.day} className="flex-1 flex flex-col items-center gap-1.5">
                    <span
                      style={{
                        ...GLASS_TYPE.caption,
                        fontSize: "9px",
                        color: day.amount > 0 ? c.text.muted : c.text.ghost,
                      }}
                    >
                      {day.amount > 0 ? formatNaira(day.amount) : "—"}
                    </span>
                    <motion.div
                      className="w-full rounded-sm"
                      initial={{ height: 0 }}
                      animate={{ height: `${h}%` }}
                      transition={{
                        delay: i * 0.04 + 0.25,
                        ...MOTION.standard,
                      }}
                      style={{
                        background: isToday
                          ? BRAND_COLORS.green
                          : d
                            ? "rgba(255,255,255,0.08)"
                            : "rgba(0,0,0,0.06)",
                        minHeight: "2px",
                        borderRadius: "3px",
                      }}
                    />
                    <span
                      style={{
                        ...GLASS_TYPE.caption,
                        fontSize: "9px",
                        color: isToday ? BRAND_COLORS.green : c.text.ghost,
                      }}
                    >
                      {day.day}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Week total */}
            <div
              className="flex items-center justify-between mt-4 pt-3"
              style={{
                borderTop: `1px solid ${d ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}`,
              }}
            >
              <span style={{ ...DT.secondary, color: c.text.tertiary }}>
                Week total
              </span>
              <span
                style={{
                  ...DT.stat,
                  fontSize: "18px",
                  color: c.text.display,
                }}
              >
                {formatNaira(week.earnings)}
              </span>
            </div>
            <div className="flex items-center gap-1.5 mt-1">
              <span style={{ ...DT.meta, color: c.text.ghost }}>
                {week.trips} trips · {formatHours(week.hoursOnline)} online · {formatNaira(Math.round(week.earnings / Math.max(week.trips, 1)))}/trip avg
              </span>
            </div>
          </motion.div>
        </div>
      </GlassPanel>
    </SheetBackdrop>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// DemandZonesSheet
// ══════════════════════════════════════════════════════════════════════════
export function DemandZonesSheet({
  zones,
  colorMode,
  onClose,
}: {
  zones: DemandZone[];
  colorMode: GlassColorMode;
  onClose: () => void;
}) {
  const c = GLASS_COLORS[colorMode];
  const d = colorMode === "dark";

  const sorted = [...zones].sort((a, b) => b.multiplier - a.multiplier);

  return (
    <SheetBackdrop onClose={onClose} colorMode={colorMode}>
      <GlassPanel
        variant={d ? "dark" : "light"}
        className="rounded-t-3xl overflow-hidden"
        blur={32}
      >
        <SheetHeader title="Demand zones" onClose={onClose} colorMode={colorMode} />

        <div className="px-5 pb-6">
          <p
            className="mb-4"
            style={{ ...DT.meta, color: c.text.ghost }}
          >
            Areas with higher demand pay more. Head towards surge zones to maximise earnings.
          </p>

          <div className="space-y-2">
            {sorted.map((zone, i) => (
              <motion.div
                key={zone.id}
                className="flex items-center gap-3 px-3.5 py-3 rounded-xl"
                style={{ background: c.surface.subtle }}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * MOTION.stagger, ...MOTION.standard }}
              >
                <motion.div
                  className="w-3 h-3 rounded-full shrink-0"
                  animate={
                    zone.level === "surge"
                      ? {
                          scale: [1, 1.25, 1],
                          opacity: [0.8, 1, 0.8],
                        }
                      : {}
                  }
                  transition={
                    zone.level === "surge"
                      ? { duration: 2, repeat: Infinity, ease: "easeInOut" }
                      : {}
                  }
                  style={{
                    background: getDemandColor(zone.level),
                    boxShadow:
                      zone.level === "surge"
                        ? `0 0 8px ${getDemandColor(zone.level)}60`
                        : "none",
                  }}
                />
                <div className="flex-1 min-w-0">
                  <span style={{ ...DT.secondary, color: c.text.primary }}>
                    {zone.area}
                  </span>
                  <span
                    className="block mt-0.5"
                    style={{
                      ...DT.meta,
                      color: c.text.muted,
                      textTransform: "capitalize" as const,
                    }}
                  >
                    {zone.level} demand
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <span
                    style={{
                      fontFamily: "var(--font-heading)",
                      fontSize: "15px",
                      fontWeight: 600,
                      letterSpacing: "-0.02em",
                      lineHeight: "1",
                      color: getDemandColor(zone.level),
                    }}
                  >
                    {zone.multiplier}x
                  </span>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Contextual insight */}
          <motion.div
            className="flex items-center gap-2 mt-4 px-3 py-2.5 rounded-xl"
            style={{ background: c.green.tint }}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, ...MOTION.standard }}
          >
            <MapPin className="w-3.5 h-3.5 shrink-0" style={{ color: BRAND_COLORS.green }} />
            <span style={{ ...DT.meta, color: BRAND_COLORS.green }}>
              Lekki has highest demand right now — 1.8x surge pricing
            </span>
          </motion.div>
        </div>
      </GlassPanel>
    </SheetBackdrop>
  );
}