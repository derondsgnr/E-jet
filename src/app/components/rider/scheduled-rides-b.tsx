 /**
 * Scheduled Rides — "Hero + Timeline" (CONVERGED DIRECTION)
 *
 * Full flow: creation → management → live state progression → pickup.
 *
 * Three filters, each showing genuinely different content:
 *   Upcoming  — "What's next?" Hero card + date-grouped list
 *   Recurring — "What are my patterns?" Deduplicated route templates
 *   Past      — "What happened?" Reverse-chronological completed rides
 *
 * Hero card state progression:
 *   confirmed       → standard hero
 *   driver-assigned  → driver info, pulsing green indicator
 *   driver-en-route  → ETA countdown, "Track" CTA → Driver Approach
 *
 * "+" opens ScheduleCreateSheet. New ride inserts into list.
 */

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ArrowLeft,
  Plus,
  Zap,
  Repeat,
  ChevronRight,
  Calendar,
  X,
  Clock,
  Navigation,
  Car,
  Crown,
  Pause,
  Play,
} from "lucide-react";
import { MOTION, GLASS_COLORS, GLASS_TYPE, type GlassColorMode } from "../../config/project";
import { BRAND_COLORS } from "../../config/brand";
import { MapCanvas } from "./map-canvas";
import { GlassPanel } from "./glass-panel";
import { ScheduleCreateSheet } from "./schedule-create-sheet";
import {
  type ScheduledRide,
  type RecurringTemplate,
  MOCK_SCHEDULED_RIDES,
  groupRidesByDate,
  formatDateDisplay,
  getCategoryColor,
  extractRecurringTemplates,
  recurrenceLabel,
  statusLabel,
  isLiveStatus,
} from "./scheduled-rides-data";

type FilterTab = "upcoming" | "recurring" | "past";

interface ScheduledRidesBProps {
  colorMode: GlassColorMode;
  onBack?: () => void;
  onScheduleNew?: () => void;
  onTrackRide?: (rideId: string) => void;
}

export function ScheduledRidesB({
  colorMode,
  onBack,
  onTrackRide,
}: ScheduledRidesBProps) {
  const d = colorMode === "dark";
  const c = GLASS_COLORS[colorMode];
  const [rides, setRides] = useState(MOCK_SCHEDULED_RIDES);
  const [filter, setFilter] = useState<FilterTab>("upcoming");
  const [selectedRide, setSelectedRide] = useState<string | null>(null);
  const [cancelConfirm, setCancelConfirm] = useState<string | null>(null);
  const [showCreate, setShowCreate] = useState(false);

  // ── Derived data per filter ──
  const upcomingRides = rides
    .filter((r) => r.status !== "cancelled" && r.status !== "completed")
    .sort((a, b) => a.date.localeCompare(b.date) || a.time.localeCompare(b.time));

  const pastRides = rides
    .filter((r) => r.status === "completed" || r.status === "cancelled")
    .sort((a, b) => b.date.localeCompare(a.date));

  const recurringTemplates = extractRecurringTemplates(rides);

  const nextRide = upcomingRides[0] ?? null;
  const remainingRides = upcomingRides.slice(1);
  const grouped = groupRidesByDate(remainingRides);
  const sortedDates = Object.keys(grouped).sort();
  const pastGrouped = groupRidesByDate(pastRides);
  const pastDates = Object.keys(pastGrouped).sort().reverse();

  const handleCancel = useCallback((id: string) => {
    setRides((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: "cancelled" as const } : r))
    );
    setCancelConfirm(null);
    setSelectedRide(null);
  }, []);

  const handleCreate = useCallback((ride: Omit<ScheduledRide, "id" | "status" | "driver">) => {
    const newRide: ScheduledRide = {
      ...ride,
      id: `s-${Date.now()}`,
      status: "upcoming",
      driver: null,
    };
    setRides((prev) => [...prev, newRide]);
    setShowCreate(false);
    setFilter("upcoming");
  }, []);

  const [pausedTemplates, setPausedTemplates] = useState<Set<string>>(new Set());
  const toggleTemplate = useCallback((id: string) => {
    setPausedTemplates((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  // Filter counts
  const counts = {
    upcoming: upcomingRides.length,
    recurring: recurringTemplates.length,
    past: pastRides.length,
  };

  return (
    <div className={`relative h-full w-full overflow-hidden ${d ? "bg-[#0B0B0D]" : "bg-[#FAFAFA]"}`}>
      {/* Map — full bleed */}
      <MapCanvas colorMode={colorMode} variant="muted" />
      {d ? (
        <div className="absolute inset-0 bg-gradient-to-b from-[#0B0B0D]/30 via-[#0B0B0D]/50 to-[#0B0B0D] z-[1]" />
      ) : (
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(to bottom, rgba(250,250,250,0.05) 0%, rgba(250,250,250,0.5) 30%, #FAFAFA 50%)",
          }}
        />
      )}

      {/* ── Header ── */}
      <GlassPanel
        variant={d ? "map-dark" : "map-light"}
        blur={24}
        className="absolute top-0 left-0 right-0 z-20 rounded-none"
        style={{ paddingTop: "env(safe-area-inset-top, 12px)" }}
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={MOTION.emphasis}
      >
        <div className="flex items-center justify-between px-5 py-3">
          <motion.button
            className="w-8 h-8 rounded-full flex items-center justify-center"
            style={{ background: c.surface.subtle }}
            onClick={onBack}
            whileTap={{ scale: 0.9 }}
          >
            <ArrowLeft className="w-4 h-4" style={{ color: c.icon.primary }} />
          </motion.button>
          <span
            style={{
              ...GLASS_TYPE.body,
              fontWeight: 600,
              color: c.text.primary,
              fontFamily: "var(--font-heading)",
              letterSpacing: "-0.02em",
            }}
          >
            Scheduled
          </span>
          <motion.button
            className="w-8 h-8 rounded-full flex items-center justify-center"
            style={{ background: "rgba(29,185,84,0.12)" }}
            onClick={() => setShowCreate(true)}
            whileTap={{ scale: 0.9 }}
          >
            <Plus className="w-4 h-4" style={{ color: BRAND_COLORS.green }} />
          </motion.button>
        </div>

        {/* ── Filters ── */}
        <div className="flex gap-1 px-5 pb-3">
          {(["upcoming", "recurring", "past"] as FilterTab[]).map((tab) => {
            const active = filter === tab;
            const label = tab === "upcoming" ? "Upcoming" : tab === "recurring" ? "Recurring" : "Past";
            const count = counts[tab];
            return (
              <motion.button
                key={tab}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors"
                style={{
                  background: active
                    ? d ? "rgba(255,255,255,0.08)" : "rgba(11,11,13,0.06)"
                    : "transparent",
                  border: active
                    ? `1px solid ${d ? "rgba(255,255,255,0.1)" : "rgba(11,11,13,0.08)"}`
                    : "1px solid transparent",
                }}
                onClick={() => setFilter(tab)}
                whileTap={{ scale: 0.95 }}
              >
                <span style={{
                  ...GLASS_TYPE.caption,
                  fontWeight: active ? 600 : 500,
                  color: active ? c.text.primary : c.text.muted,
                }}>
                  {label}
                </span>
                {count > 0 && (
                  <span
                    className="px-1.5 py-0.5 rounded-md"
                    style={{
                      ...GLASS_TYPE.caption,
                      fontSize: "10px",
                      background: active ? "rgba(29,185,84,0.12)" : c.surface.subtle,
                      color: active ? BRAND_COLORS.green : c.text.faint,
                    }}
                  >
                    {count}
                  </span>
                )}
              </motion.button>
            );
          })}
        </div>
      </GlassPanel>

      {/* ── Content ── */}
      <div
        className="absolute inset-0 z-10 overflow-y-auto scrollbar-hide"
        style={{
          paddingTop: "calc(env(safe-area-inset-top, 12px) + 104px)",
          paddingBottom: "32px",
        }}
      >
        <AnimatePresence mode="wait">
          {filter === "upcoming" && (
            <UpcomingView
              key="upcoming"
              rides={upcomingRides}
              nextRide={nextRide}
              remainingRides={remainingRides}
              grouped={grouped}
              sortedDates={sortedDates}
              colorMode={colorMode}
              cancelConfirm={cancelConfirm}
              onCancelStart={(id) => setCancelConfirm(id)}
              onCancelConfirm={handleCancel}
              onCancelDismiss={() => setCancelConfirm(null)}
              onRideTap={(id) => setSelectedRide(id)}
              onScheduleNew={() => setShowCreate(true)}
              onTrackRide={onTrackRide}
            />
          )}
          {filter === "recurring" && (
            <RecurringView
              key="recurring"
              templates={recurringTemplates}
              paused={pausedTemplates}
              onToggle={toggleTemplate}
              colorMode={colorMode}
              onScheduleNew={() => setShowCreate(true)}
            />
          )}
          {filter === "past" && (
            <PastView
              key="past"
              grouped={pastGrouped}
              sortedDates={pastDates}
              colorMode={colorMode}
            />
          )}
        </AnimatePresence>
      </div>

      {/* ── Detail sheet ── */}
      <AnimatePresence>
        {selectedRide && (() => {
          const ride = rides.find((r) => r.id === selectedRide);
          if (!ride) return null;
          return (
            <RideDetailSheet
              ride={ride}
              colorMode={colorMode}
              onClose={() => { setSelectedRide(null); setCancelConfirm(null); }}
              cancelConfirm={cancelConfirm === selectedRide}
              onCancelStart={() => setCancelConfirm(selectedRide)}
              onCancelConfirm={() => handleCancel(selectedRide)}
              onCancelDismiss={() => setCancelConfirm(null)}
            />
          );
        })()}
      </AnimatePresence>

      {/* ── Create sheet ── */}
      <AnimatePresence>
        {showCreate && (
          <ScheduleCreateSheet
            colorMode={colorMode}
            onClose={() => setShowCreate(false)}
            onConfirm={handleCreate}
          />
        )}
      </AnimatePresence>
    </div>
  );
}


/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * UPCOMING VIEW — Hero + date-grouped list
 * ━━━━━━━━━━━━━━━━━━━━━━━━━���━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
function UpcomingView({
  rides,
  nextRide,
  remainingRides,
  grouped,
  sortedDates,
  colorMode,
  cancelConfirm,
  onCancelStart,
  onCancelConfirm,
  onCancelDismiss,
  onRideTap,
  onScheduleNew,
  onTrackRide,
}: {
  rides: ScheduledRide[];
  nextRide: ScheduledRide | null;
  remainingRides: ScheduledRide[];
  grouped: Record<string, ScheduledRide[]>;
  sortedDates: string[];
  colorMode: GlassColorMode;
  cancelConfirm: string | null;
  onCancelStart: (id: string) => void;
  onCancelConfirm: (id: string) => void;
  onCancelDismiss: () => void;
  onRideTap: (id: string) => void;
  onScheduleNew: () => void;
  onTrackRide?: (id: string) => void;
}) {
  const d = colorMode === "dark";
  const c = GLASS_COLORS[colorMode];

  if (rides.length === 0) {
    return (
      <motion.div
        className="flex flex-col items-center justify-center px-5 pt-20 gap-4"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={MOTION.emphasis}
      >
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: c.surface.subtle }}>
          <Calendar className="w-6 h-6" style={{ color: c.text.ghost }} />
        </div>
        <div className="text-center">
          <p style={{
            fontFamily: "var(--font-heading)", fontSize: "18px", fontWeight: 600,
            letterSpacing: "-0.02em", lineHeight: "1.3", color: c.text.primary,
          }}>
            No rides scheduled
          </p>
          <p style={{ ...GLASS_TYPE.bodySmall, color: c.text.muted, marginTop: "6px", maxWidth: "240px" }}>
            Plan your commute ahead of time — skip the wait, ride on your terms.
          </p>
        </div>
        <motion.button
          className="flex items-center gap-2 px-5 py-3 rounded-xl mt-2"
          style={{ background: BRAND_COLORS.green }}
          onClick={onScheduleNew}
          whileTap={{ scale: 0.95 }}
        >
          <Plus className="w-4 h-4 text-white" />
          <span style={{ ...GLASS_TYPE.small, fontWeight: 600, color: "#fff" }}>Schedule a ride</span>
        </motion.button>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="px-5"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={MOTION.emphasis}
    >
      {/* Hero */}
      {nextRide && (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <span style={{ ...GLASS_TYPE.label, color: c.text.faint }}>
              {isLiveStatus(nextRide.status) ? "Live" : "Next up"}
            </span>
            <span style={{ ...GLASS_TYPE.caption, color: c.text.muted }}>
              {formatDateDisplay(nextRide.date)}
            </span>
          </div>
          <NextRideHero
            ride={nextRide}
            colorMode={colorMode}
            cancelConfirm={cancelConfirm === nextRide.id}
            onCancelStart={() => onCancelStart(nextRide.id)}
            onCancelConfirm={() => onCancelConfirm(nextRide.id)}
            onCancelDismiss={onCancelDismiss}
            onTrack={() => onTrackRide?.(nextRide.id)}
          />
        </div>
      )}

      {/* Remaining */}
      {sortedDates.map((dateStr, di) => (
        <div key={dateStr} className="mb-5">
          <div className="flex items-center gap-3 mb-2.5">
            <span style={{ ...GLASS_TYPE.label, color: c.text.faint }}>{formatDateDisplay(dateStr)}</span>
            <div className="flex-1 h-px" style={{ background: c.surface.hover }} />
          </div>
          <div className="flex flex-col gap-2">
            {grouped[dateStr].map((ride, ri) => (
              <RideRow key={ride.id} ride={ride} colorMode={colorMode} index={di * 2 + ri} onTap={() => onRideTap(ride.id)} />
            ))}
          </div>
        </div>
      ))}
    </motion.div>
  );
}


/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * RECURRING VIEW — Route templates, not individual instances
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
function RecurringView({
  templates,
  paused,
  onToggle,
  colorMode,
  onScheduleNew,
}: {
  templates: RecurringTemplate[];
  paused: Set<string>;
  onToggle: (id: string) => void;
  colorMode: GlassColorMode;
  onScheduleNew: () => void;
}) {
  const d = colorMode === "dark";
  const c = GLASS_COLORS[colorMode];

  if (templates.length === 0) {
    return (
      <motion.div
        className="flex flex-col items-center justify-center px-5 pt-20 gap-4"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={MOTION.emphasis}
      >
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: c.surface.subtle }}>
          <Repeat className="w-6 h-6" style={{ color: c.text.ghost }} />
        </div>
        <div className="text-center">
          <p style={{
            fontFamily: "var(--font-heading)", fontSize: "18px", fontWeight: 600,
            letterSpacing: "-0.02em", lineHeight: "1.3", color: c.text.primary,
          }}>
            No recurring rides
          </p>
          <p style={{ ...GLASS_TYPE.bodySmall, color: c.text.muted, marginTop: "6px", maxWidth: "260px" }}>
            Set up a ride that repeats — your commute, automated.
          </p>
        </div>
        <motion.button
          className="flex items-center gap-2 px-5 py-3 rounded-xl mt-2"
          style={{ background: BRAND_COLORS.green }}
          onClick={onScheduleNew}
          whileTap={{ scale: 0.95 }}
        >
          <Plus className="w-4 h-4 text-white" />
          <span style={{ ...GLASS_TYPE.small, fontWeight: 600, color: "#fff" }}>Create recurring ride</span>
        </motion.button>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="px-5"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={MOTION.emphasis}
    >
      <div className="mb-3">
        <span style={{ ...GLASS_TYPE.label, color: c.text.faint }}>
          Your patterns
        </span>
      </div>

      <div className="flex flex-col gap-2.5">
        {templates.map((tmpl, i) => {
          const isPaused = paused.has(tmpl.id);
          const catColor = getCategoryColor(tmpl.category);

          return (
            <motion.div
              key={tmpl.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: isPaused ? 0.5 : 1, y: 0 }}
              transition={{ ...MOTION.standard, delay: i * MOTION.stagger }}
            >
              <GlassPanel
                variant={d ? "dark" : "light"}
                blur={16}
                className="rounded-2xl px-4 py-3.5"
              >
                <div className="flex items-start gap-3">
                  {/* Route icon */}
                  <div className="flex flex-col items-center shrink-0 pt-0.5">
                    <div className="w-2 h-2 rounded-full border-[1.5px]" style={{ borderColor: BRAND_COLORS.green }} />
                    <div className="w-px h-3 my-0.5" style={{ background: c.surface.hover }} />
                    <div className="w-2 h-2 rounded-full" style={{ background: c.text.ghost }} />
                  </div>

                  <div className="flex-1 min-w-0">
                    {/* Route */}
                    <div className="flex items-center gap-1">
                      <span style={{ ...GLASS_TYPE.small, color: c.text.primary }}>{tmpl.from}</span>
                      <ChevronRight className="w-3 h-3 shrink-0" style={{ color: c.text.ghost }} />
                      <span className="truncate" style={{ ...GLASS_TYPE.small, color: c.text.primary }}>{tmpl.to}</span>
                    </div>
                    {/* Meta */}
                    <div className="flex items-center gap-1.5 mt-1">
                      <span style={{ ...GLASS_TYPE.caption, color: c.text.muted }}>{tmpl.time}</span>
                      <span style={{ ...GLASS_TYPE.caption, color: c.text.faint }}>·</span>
                      <span className="flex items-center gap-0.5" style={{ ...GLASS_TYPE.caption, color: c.text.muted }}>
                        <Repeat className="w-2.5 h-2.5" />
                        {recurrenceLabel(tmpl.recurrence)}
                      </span>
                      <span style={{ ...GLASS_TYPE.caption, color: c.text.faint }}>·</span>
                      <span className="flex items-center gap-0.5" style={{ ...GLASS_TYPE.caption, color: catColor, opacity: 0.8 }}>
                        {tmpl.category === "JetEV" && <Zap className="w-2.5 h-2.5" />}
                        {tmpl.category}
                      </span>
                    </div>
                    {/* Upcoming count */}
                    {tmpl.instanceCount > 0 && (
                      <div className="mt-1.5" style={{ ...GLASS_TYPE.caption, color: c.text.faint }}>
                        {tmpl.instanceCount} upcoming ride{tmpl.instanceCount !== 1 ? "s" : ""}
                      </div>
                    )}
                  </div>

                  {/* Pause/resume */}
                  <motion.button
                    className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                    style={{
                      background: isPaused ? "rgba(245,158,11,0.08)" : c.surface.subtle,
                    }}
                    onClick={() => onToggle(tmpl.id)}
                    whileTap={{ scale: 0.9 }}
                  >
                    {isPaused ? (
                      <Play className="w-3.5 h-3.5" style={{ color: BRAND_COLORS.warning }} />
                    ) : (
                      <Pause className="w-3.5 h-3.5" style={{ color: c.icon.muted }} />
                    )}
                  </motion.button>
                </div>
              </GlassPanel>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}


/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * PAST VIEW — Completed/cancelled rides, reverse chronological
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━��━━━━━━━━━━━━━━━━━━━━━━━━ */
function PastView({
  grouped,
  sortedDates,
  colorMode,
}: {
  grouped: Record<string, ScheduledRide[]>;
  sortedDates: string[];
  colorMode: GlassColorMode;
}) {
  const d = colorMode === "dark";
  const c = GLASS_COLORS[colorMode];

  if (sortedDates.length === 0) {
    return (
      <motion.div
        className="flex flex-col items-center justify-center px-5 pt-20 gap-4"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={MOTION.emphasis}
      >
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: c.surface.subtle }}>
          <Clock className="w-6 h-6" style={{ color: c.text.ghost }} />
        </div>
        <p style={{ ...GLASS_TYPE.body, color: c.text.tertiary }}>No past scheduled rides</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="px-5"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={MOTION.emphasis}
    >
      {sortedDates.map((dateStr, di) => (
        <div key={dateStr} className="mb-5">
          <div className="flex items-center gap-3 mb-2.5">
            <span style={{ ...GLASS_TYPE.label, color: c.text.faint }}>{formatDateDisplay(dateStr)}</span>
            <div className="flex-1 h-px" style={{ background: c.surface.hover }} />
          </div>
          <div className="flex flex-col gap-2">
            {grouped[dateStr].map((ride, ri) => (
              <PastRideRow key={ride.id} ride={ride} colorMode={colorMode} index={di * 2 + ri} />
            ))}
          </div>
        </div>
      ))}
    </motion.div>
  );
}

function PastRideRow({ ride, colorMode, index }: { ride: ScheduledRide; colorMode: GlassColorMode; index: number }) {
  const d = colorMode === "dark";
  const c = GLASS_COLORS[colorMode];
  const isCancelled = ride.status === "cancelled";

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: isCancelled ? 0.5 : 1, y: 0 }}
      transition={{ ...MOTION.standard, delay: 0.1 + index * MOTION.stagger }}
    >
      <GlassPanel variant={d ? "dark" : "light"} blur={16} className="rounded-xl px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="shrink-0 w-14">
            <span style={{
              fontFamily: "var(--font-heading)", fontSize: "14px", fontWeight: 600,
              letterSpacing: "-0.02em", lineHeight: "1.3", color: c.text.tertiary,
            }}>
              {ride.time.replace(" AM", "").replace(" PM", "")}
            </span>
            <div style={{ ...GLASS_TYPE.caption, fontSize: "10px", color: c.text.muted }}>
              {ride.time.includes("AM") ? "AM" : "PM"}
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1">
              <span style={{ ...GLASS_TYPE.small, color: c.text.tertiary }}>{ride.from}</span>
              <ChevronRight className="w-3 h-3 shrink-0" style={{ color: c.text.ghost }} />
              <span className="truncate" style={{ ...GLASS_TYPE.small, color: c.text.tertiary }}>{ride.to}</span>
            </div>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span style={{
                ...GLASS_TYPE.caption,
                color: isCancelled ? BRAND_COLORS.error : c.text.muted,
                opacity: isCancelled ? 0.7 : 1,
              }}>
                {isCancelled ? "Cancelled" : "Completed"}
              </span>
              {ride.driver && (
                <>
                  <span style={{ ...GLASS_TYPE.caption, color: c.text.faint }}>·</span>
                  <span style={{ ...GLASS_TYPE.caption, color: c.text.muted }}>{ride.driver.name}</span>
                </>
              )}
            </div>
          </div>
          <span style={{
            fontFamily: "var(--font-heading)", fontSize: "14px", fontWeight: 500,
            letterSpacing: "-0.02em",
            color: isCancelled ? c.text.faint : c.text.muted,
            textDecoration: isCancelled ? "line-through" : "none",
          }}>
            {ride.fare}
          </span>
        </div>
      </GlassPanel>
    </motion.div>
  );
}


/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * NextRideHero — dispatches to the correct visual treatment.
 *
 * Two distinct states:
 *   ScheduledHero  → calm, muted, future-looking (upcoming/confirmed)
 *   LiveHero       → green energy, pulsing, driver prominent (assigned/en-route)
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

interface HeroProps {
  ride: ScheduledRide;
  colorMode: GlassColorMode;
  cancelConfirm: boolean;
  onCancelStart: () => void;
  onCancelConfirm: () => void;
  onCancelDismiss: () => void;
  onTrack: () => void;
}

function NextRideHero(props: HeroProps) {
  return isLiveStatus(props.ride.status)
    ? <LiveHero {...props} />
    : <ScheduledHero {...props} />;
}


/* ── ScheduledHero: calm, muted, future-looking ──────────────────────────── */
function ScheduledHero({
  ride,
  colorMode,
  cancelConfirm,
  onCancelStart,
  onCancelConfirm,
  onCancelDismiss,
}: HeroProps) {
  const d = colorMode === "dark";
  const c = GLASS_COLORS[colorMode];
  const catColor = getCategoryColor(ride.category);

  return (
    <GlassPanel variant={d ? "dark" : "light"} blur={20} className="rounded-2xl overflow-hidden">
      {/* Time + category + status */}
      <div className="px-5 pt-4 pb-3">
        <div className="flex items-start justify-between">
          <div>
            <div style={{
              fontFamily: "var(--font-heading)", fontSize: "24px", fontWeight: 600,
              letterSpacing: "-0.03em", lineHeight: "1.15", color: c.text.display,
            }}>
              {ride.time}
            </div>
            <div className="flex items-center gap-2 mt-1.5">
              <span className="flex items-center gap-1" style={{ ...GLASS_TYPE.caption, color: catColor }}>
                {ride.category === "JetEV" && <Zap className="w-3 h-3" />}
                {ride.category}
              </span>
              {ride.recurring && (
                <>
                  <span style={{ ...GLASS_TYPE.caption, color: c.text.faint }}>·</span>
                  <span className="flex items-center gap-0.5" style={{ ...GLASS_TYPE.caption, color: c.text.muted }}>
                    <Repeat className="w-3 h-3" />{ride.recurring}
                  </span>
                </>
              )}
            </div>
          </div>
          <div
            className="px-2.5 py-1 rounded-lg"
            style={{ background: ride.status === "confirmed" ? "rgba(29,185,84,0.1)" : c.surface.subtle }}
          >
            <span style={{
              ...GLASS_TYPE.caption, fontWeight: 600,
              color: ride.status === "confirmed" ? BRAND_COLORS.green : c.text.muted,
            }}>
              {statusLabel(ride.status)}
            </span>
          </div>
        </div>
      </div>

      {/* Route */}
      <div className="px-5 py-3" style={{ borderTop: `1px solid ${c.surface.hover}` }}>
        <div className="flex items-start gap-3">
          <div className="flex flex-col items-center shrink-0 pt-1">
            <div className="w-2.5 h-2.5 rounded-full border-2" style={{ borderColor: BRAND_COLORS.green }} />
            <div className="w-px h-6 my-1" style={{ background: c.surface.hover }} />
            <div className="w-2.5 h-2.5 rounded-full" style={{ background: c.text.ghost }} />
          </div>
          <div className="flex-1 flex flex-col gap-4">
            <div>
              <span style={{ ...GLASS_TYPE.small, color: c.text.primary }}>{ride.from}</span>
              <div style={{ ...GLASS_TYPE.caption, color: c.text.muted, marginTop: "2px" }}>{ride.fromAddress}</div>
            </div>
            <div>
              <span style={{ ...GLASS_TYPE.small, color: c.text.primary }}>{ride.to}</span>
              <div style={{ ...GLASS_TYPE.caption, color: c.text.muted, marginTop: "2px" }}>{ride.toAddress}</div>
            </div>
          </div>
          <div className="shrink-0 text-right">
            <span style={{
              fontFamily: "var(--font-heading)", fontSize: "17px", fontWeight: 600,
              letterSpacing: "-0.02em", lineHeight: "1.2", color: c.text.primary,
            }}>
              {ride.fare}
            </span>
            <div style={{ ...GLASS_TYPE.caption, color: c.text.muted, marginTop: "2px" }}>~{ride.duration}</div>
          </div>
        </div>
      </div>

      {/* Footer: assignment status + cancel */}
      <div className="flex items-center justify-between px-5 py-3" style={{ borderTop: `1px solid ${c.surface.hover}` }}>
        <span style={{ ...GLASS_TYPE.caption, color: c.text.muted }}>
          Driver will be assigned before pickup
        </span>
        <CancelButton
          cancelConfirm={cancelConfirm}
          onStart={onCancelStart}
          onConfirm={onCancelConfirm}
          onDismiss={onCancelDismiss}
          colorMode={colorMode}
          compact
        />
      </div>
    </GlassPanel>
  );
}


/* ── LiveHero: green energy, pulsing, driver prominent ───────────────────── */
function LiveHero({
  ride,
  colorMode,
  cancelConfirm,
  onCancelStart,
  onCancelConfirm,
  onCancelDismiss,
  onTrack,
}: HeroProps) {
  const d = colorMode === "dark";
  const c = GLASS_COLORS[colorMode];
  const catColor = getCategoryColor(ride.category);
  const isEnRoute = ride.status === "driver-en-route";

  return (
    <GlassPanel
      variant={d ? "dark" : "light"}
      blur={20}
      className="rounded-2xl overflow-hidden relative"
    >
      {/* Green ambient border */}
      <div
        className="absolute inset-0 rounded-2xl pointer-events-none"
        style={{
          border: `1.5px solid rgba(29,185,84,${d ? "0.25" : "0.18"})`,
          boxShadow: `inset 0 0 20px rgba(29,185,84,${d ? "0.06" : "0.03"}), 0 0 24px rgba(29,185,84,${d ? "0.08" : "0.04"})`,
        }}
      />

      {/* Green glow accent at top */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px"
        style={{ background: `linear-gradient(90deg, transparent, rgba(29,185,84,${d ? "0.4" : "0.25"}), transparent)` }}
      />

      {/* Status bar — prominent green strip */}
      <div
        className="flex items-center justify-between px-5 py-2.5"
        style={{ background: `rgba(29,185,84,${d ? "0.08" : "0.05"})` }}
      >
        <div className="flex items-center gap-2">
          <motion.div
            className="w-2 h-2 rounded-full"
            style={{ background: BRAND_COLORS.green }}
            animate={{ scale: [1, 1.3, 1], opacity: [1, 0.5, 1] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          />
          <span style={{
            ...GLASS_TYPE.caption, fontWeight: 600, color: BRAND_COLORS.green,
          }}>
            {isEnRoute ? "Driver en route" : "Driver assigned"}
          </span>
        </div>
        {ride.driver?.eta && (
          <span style={{
            fontFamily: "var(--font-heading)", fontSize: "14px", fontWeight: 600,
            letterSpacing: "-0.02em", color: BRAND_COLORS.green,
          }}>
            {ride.driver.eta} away
          </span>
        )}
      </div>

      {/* Driver info — prominent */}
      {ride.driver && (
        <div className="px-5 py-3.5">
          <div className="flex items-center gap-3">
            <div
              className="w-11 h-11 rounded-full flex items-center justify-center shrink-0"
              style={{
                background: "rgba(29,185,84,0.12)",
                border: `1.5px solid rgba(29,185,84,${d ? "0.25" : "0.2"})`,
              }}
            >
              <span style={{
                fontFamily: "var(--font-heading)", fontSize: "16px", fontWeight: 600,
                color: BRAND_COLORS.green,
              }}>
                {ride.driver.name.charAt(0)}
              </span>
            </div>
            <div className="flex-1">
              <span style={{
                fontFamily: "var(--font-heading)", fontSize: "16px", fontWeight: 600,
                letterSpacing: "-0.02em", color: c.text.primary,
              }}>
                {ride.driver.name}
              </span>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span style={{ ...GLASS_TYPE.caption, color: c.text.muted }}>★ {ride.driver.rating}</span>
                {ride.driver.vehicle && (
                  <>
                    <span style={{ ...GLASS_TYPE.caption, color: c.text.faint }}>·</span>
                    <span style={{ ...GLASS_TYPE.caption, color: c.text.muted }}>{ride.driver.vehicle}</span>
                  </>
                )}
              </div>
              {ride.driver.plate && (
                <div
                  className="inline-block mt-1 px-2 py-0.5 rounded-md"
                  style={{
                    background: d ? "rgba(255,255,255,0.06)" : "rgba(11,11,13,0.04)",
                    border: `1px solid ${d ? "rgba(255,255,255,0.08)" : "rgba(11,11,13,0.06)"}`,
                  }}
                >
                  <span style={{
                    fontFamily: "var(--font-heading)", fontSize: "12px", fontWeight: 600,
                    letterSpacing: "0.04em", color: c.text.secondary,
                  }}>
                    {ride.driver.plate}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Route — compact in live state */}
      <div className="px-5 py-2.5" style={{ borderTop: `1px solid ${c.surface.hover}` }}>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full border-[1.5px]" style={{ borderColor: BRAND_COLORS.green }} />
          <span style={{ ...GLASS_TYPE.caption, color: c.text.secondary }}>{ride.from}</span>
          <ChevronRight className="w-3 h-3" style={{ color: c.text.ghost }} />
          <span style={{ ...GLASS_TYPE.caption, color: c.text.secondary }}>{ride.to}</span>
          <span style={{ ...GLASS_TYPE.caption, color: c.text.faint }}>·</span>
          <span className="flex items-center gap-0.5" style={{ ...GLASS_TYPE.caption, color: catColor, opacity: 0.8 }}>
            {ride.category === "JetEV" && <Zap className="w-2.5 h-2.5" />}
            {ride.category}
          </span>
          <div className="flex-1" />
          <span style={{
            fontFamily: "var(--font-heading)", fontSize: "14px", fontWeight: 600,
            letterSpacing: "-0.02em", color: c.text.primary,
          }}>
            {ride.fare}
          </span>
        </div>
      </div>

      {/* Action bar */}
      <div className="px-5 py-3" style={{ borderTop: `1px solid ${c.surface.hover}` }}>
        <div className="flex gap-2.5">
          <motion.button
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl"
            style={{ background: BRAND_COLORS.green }}
            onClick={onTrack}
            whileTap={{ scale: 0.98 }}
          >
            <Navigation className="w-4 h-4 text-white" />
            <span style={{ ...GLASS_TYPE.small, fontWeight: 600, color: "#fff" }}>
              {isEnRoute ? "Track driver" : "Track"}
            </span>
          </motion.button>
          {!isEnRoute && (
            <CancelButton
              cancelConfirm={cancelConfirm}
              onStart={onCancelStart}
              onConfirm={onCancelConfirm}
              onDismiss={onCancelDismiss}
              colorMode={colorMode}
              compact
            />
          )}
        </div>
      </div>
    </GlassPanel>
  );
}


/* ━━━━━━━━━━��━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * Shared components
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

function CancelButton({
  cancelConfirm,
  onStart,
  onConfirm,
  onDismiss,
  colorMode,
  compact,
}: {
  cancelConfirm: boolean;
  onStart: () => void;
  onConfirm: () => void;
  onDismiss: () => void;
  colorMode: GlassColorMode;
  compact?: boolean;
}) {
  const c = GLASS_COLORS[colorMode];

  return (
    <AnimatePresence mode="wait">
      {!cancelConfirm ? (
        <motion.button
          key="init"
          className={`flex items-center justify-center gap-1.5 rounded-xl ${compact ? "px-4 py-3" : "w-full py-3"}`}
          style={{
            background: "rgba(212,24,61,0.06)",
            ...GLASS_TYPE.caption,
            color: BRAND_COLORS.error,
          }}
          onClick={onStart}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          Cancel{!compact && " ride"}
        </motion.button>
      ) : (
        <motion.div
          key="confirm"
          className={`flex items-center gap-2 ${compact ? "" : "w-full"}`}
          initial={{ opacity: 0, x: 8 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0 }}
          transition={MOTION.micro}
        >
          <motion.button
            className="px-3 py-1.5 rounded-lg"
            style={{ background: "rgba(212,24,61,0.1)", ...GLASS_TYPE.caption, fontWeight: 600, color: BRAND_COLORS.error }}
            onClick={onConfirm}
            whileTap={{ scale: 0.95 }}
          >
            Confirm
          </motion.button>
          <motion.button
            className="px-3 py-1.5 rounded-lg"
            style={{ background: c.surface.subtle, ...GLASS_TYPE.caption, color: c.text.muted }}
            onClick={onDismiss}
            whileTap={{ scale: 0.95 }}
          >
            Keep
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}


function RideRow({
  ride,
  colorMode,
  index,
  onTap,
}: {
  ride: ScheduledRide;
  colorMode: GlassColorMode;
  index: number;
  onTap: () => void;
}) {
  const d = colorMode === "dark";
  const c = GLASS_COLORS[colorMode];
  const catColor = getCategoryColor(ride.category);

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ ...MOTION.standard, delay: 0.22 + index * MOTION.stagger }}
    >
      <motion.button className="w-full text-left" onClick={onTap} whileTap={{ scale: 0.98 }}>
        <GlassPanel variant={d ? "dark" : "light"} blur={16} className="rounded-xl px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="shrink-0 w-14">
              <span style={{
                fontFamily: "var(--font-heading)", fontSize: "14px", fontWeight: 600,
                letterSpacing: "-0.02em", lineHeight: "1.3", color: c.text.primary,
              }}>
                {ride.time.replace(" AM", "").replace(" PM", "")}
              </span>
              <div style={{ ...GLASS_TYPE.caption, fontSize: "10px", color: c.text.muted }}>
                {ride.time.includes("AM") ? "AM" : "PM"}
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1">
                <span style={{ ...GLASS_TYPE.small, color: c.text.primary }}>{ride.from}</span>
                <ChevronRight className="w-3 h-3 shrink-0" style={{ color: c.text.ghost }} />
                <span className="truncate" style={{ ...GLASS_TYPE.small, color: c.text.primary }}>{ride.to}</span>
              </div>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="flex items-center gap-0.5" style={{ ...GLASS_TYPE.caption, color: catColor, opacity: 0.8 }}>
                  {ride.category === "JetEV" && <Zap className="w-2.5 h-2.5" />}
                  {ride.category}
                </span>
                <span style={{ ...GLASS_TYPE.caption, color: c.text.faint }}>·</span>
                <span style={{ ...GLASS_TYPE.caption, color: c.text.muted }}>{ride.duration}</span>
                {ride.recurring && (
                  <>
                    <span style={{ ...GLASS_TYPE.caption, color: c.text.faint }}>·</span>
                    <Repeat className="w-2.5 h-2.5" style={{ color: c.text.muted }} />
                  </>
                )}
              </div>
            </div>
            <span style={{
              fontFamily: "var(--font-heading)", fontSize: "14px", fontWeight: 500,
              letterSpacing: "-0.02em", color: c.text.secondaryStrong,
            }}>
              {ride.fare}
            </span>
          </div>
        </GlassPanel>
      </motion.button>
    </motion.div>
  );
}


function RideDetailSheet({
  ride,
  colorMode,
  onClose,
  cancelConfirm,
  onCancelStart,
  onCancelConfirm,
  onCancelDismiss,
}: {
  ride: ScheduledRide;
  colorMode: GlassColorMode;
  onClose: () => void;
  cancelConfirm: boolean;
  onCancelStart: () => void;
  onCancelConfirm: () => void;
  onCancelDismiss: () => void;
}) {
  const d = colorMode === "dark";
  const c = GLASS_COLORS[colorMode];
  const catColor = getCategoryColor(ride.category);

  return (
    <>
      <motion.div
        className="absolute inset-0 z-30"
        style={{ background: d ? "rgba(0,0,0,0.5)" : "rgba(0,0,0,0.15)" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />
      <motion.div
        className="absolute bottom-0 left-0 right-0 z-40"
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", stiffness: 350, damping: 30 }}
      >
        <GlassPanel variant={d ? "dark" : "light"} blur={24} className="rounded-t-3xl">
          <div className="flex justify-center py-3">
            <div className="w-10 h-1 rounded-full" style={{ background: c.surface.hover }} />
          </div>
          <div className="px-5 pb-8">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div>
                <div style={{
                  fontFamily: "var(--font-heading)", fontSize: "22px", fontWeight: 600,
                  letterSpacing: "-0.03em", lineHeight: "1.15", color: c.text.display,
                }}>
                  {ride.time}
                </div>
                <div className="flex items-center gap-1.5 mt-1">
                  <span style={{ ...GLASS_TYPE.caption, color: c.text.muted }}>{formatDateDisplay(ride.date)}</span>
                  {ride.recurring && (
                    <>
                      <span style={{ ...GLASS_TYPE.caption, color: c.text.faint }}>·</span>
                      <span className="flex items-center gap-0.5" style={{ ...GLASS_TYPE.caption, color: c.text.muted }}>
                        <Repeat className="w-3 h-3" />{ride.recurring}
                      </span>
                    </>
                  )}
                </div>
              </div>
              <motion.button
                className="w-8 h-8 rounded-full flex items-center justify-center"
                style={{ background: c.surface.subtle }}
                onClick={onClose}
                whileTap={{ scale: 0.9 }}
              >
                <X className="w-4 h-4" style={{ color: c.icon.secondary }} />
              </motion.button>
            </div>

            {/* Route */}
            <div className="flex items-start gap-3 mb-5">
              <div className="flex flex-col items-center shrink-0 pt-1">
                <div className="w-2.5 h-2.5 rounded-full border-2" style={{ borderColor: BRAND_COLORS.green }} />
                <div className="w-px h-6 my-1" style={{ background: c.surface.hover }} />
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: c.text.ghost }} />
              </div>
              <div className="flex-1 flex flex-col gap-4">
                <div>
                  <span style={{ ...GLASS_TYPE.small, color: c.text.primary }}>{ride.from}</span>
                  <div style={{ ...GLASS_TYPE.caption, color: c.text.muted, marginTop: "2px" }}>{ride.fromAddress}</div>
                </div>
                <div>
                  <span style={{ ...GLASS_TYPE.small, color: c.text.primary }}>{ride.to}</span>
                  <div style={{ ...GLASS_TYPE.caption, color: c.text.muted, marginTop: "2px" }}>{ride.toAddress}</div>
                </div>
              </div>
            </div>

            {/* Meta */}
            <div className="flex gap-2.5 mb-5">
              {[
                { label: "Fare", value: ride.fare },
                { label: "Duration", value: ride.duration },
              ].map((item) => (
                <div key={item.label} className="flex-1 px-3 py-2.5 rounded-xl" style={{ background: c.surface.subtle }}>
                  <div style={{ ...GLASS_TYPE.caption, color: c.text.muted }}>{item.label}</div>
                  <div style={{
                    fontFamily: "var(--font-heading)", fontSize: "16px", fontWeight: 600,
                    letterSpacing: "-0.02em", lineHeight: "1.3", color: c.text.primary,
                  }}>
                    {item.value}
                  </div>
                </div>
              ))}
              <div className="flex-1 px-3 py-2.5 rounded-xl" style={{ background: c.surface.subtle }}>
                <div style={{ ...GLASS_TYPE.caption, color: c.text.muted }}>Type</div>
                <div className="flex items-center gap-1" style={{
                  fontFamily: "var(--font-heading)", fontSize: "16px", fontWeight: 600,
                  letterSpacing: "-0.02em", lineHeight: "1.3", color: catColor,
                }}>
                  {ride.category === "JetEV" && <Zap className="w-3.5 h-3.5" />}
                  {ride.category}
                </div>
              </div>
            </div>

            {/* Driver */}
            {ride.driver && (
              <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl mb-5" style={{ background: c.surface.subtle }}>
                <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: "rgba(29,185,84,0.12)" }}>
                  <span style={{ ...GLASS_TYPE.caption, fontWeight: 600, color: BRAND_COLORS.green }}>
                    {ride.driver.name.charAt(0)}
                  </span>
                </div>
                <div className="flex-1">
                  <span style={{ ...GLASS_TYPE.small, color: c.text.primary }}>{ride.driver.name}</span>
                  <div style={{ ...GLASS_TYPE.caption, color: c.text.muted }}>★ {ride.driver.rating} · Assigned driver</div>
                </div>
              </div>
            )}

            {/* Cancel */}
            <CancelButton
              cancelConfirm={cancelConfirm}
              onStart={onCancelStart}
              onConfirm={onCancelConfirm}
              onDismiss={onCancelDismiss}
              colorMode={colorMode}
            />
          </div>
        </GlassPanel>
      </motion.div>
    </>
  );
}
