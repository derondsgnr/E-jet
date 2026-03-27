 /**
 * ScheduleCreateSheet — Bottom sheet for scheduling a new ride.
 *
 * Location selection: tapping pickup/destination transforms the sheet
 * into a full search mode (text input + saved + recent + live results).
 * This mirrors the destination search UX — familiar pattern, no learning curve.
 *
 * Flow: Pickup → Destination → Date → Time → Vehicle → Recurrence → Confirm
 */

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  X,
  MapPin,
  Navigation,
  Home,
  Briefcase,
  Plane,
  Zap,
  Car,
  Crown,
  ChevronRight,
  Repeat,
  Clock,
  Calendar,
  Search,
  ArrowLeft,
  MapPinned,
  History,
  Dumbbell,
  ChevronLeft,
} from "lucide-react";
import { MOTION, GLASS_COLORS, GLASS_TYPE, type GlassColorMode } from "../../config/project";
import { BRAND_COLORS } from "../../config/brand";
import { GlassPanel } from "./glass-panel";
import {
  type ScheduledRide,
  type RideCategory,
  type Recurrence,
  getCalendarDays,
  getCategoryColor,
  recurrenceLabel,
  generateTimeSlots,
} from "./scheduled-rides-data";

/* ── Location types ── */
interface LocationItem {
  id: string;
  label: string;
  address: string;
  icon: typeof Home;
  type: "saved" | "recent" | "search";
}

const SAVED_PLACES: LocationItem[] = [
  { id: "home", icon: Home, label: "Home", address: "12 Bourdillon Rd, Ikoyi", type: "saved" },
  { id: "work", icon: Briefcase, label: "Work", address: "235 Ikorodu Rd, Lagos", type: "saved" },
  { id: "airport", icon: Plane, label: "Airport", address: "MM Airport, Ikeja", type: "saved" },
  { id: "gym", icon: Dumbbell, label: "Gym", address: "The Palms, Lekki", type: "saved" },
];

const RECENT_PLACES: LocationItem[] = [
  { id: "lekki", icon: History, label: "Lekki Phase 1", address: "Admiralty Way, Lekki Phase 1", type: "recent" },
  { id: "vi", icon: History, label: "Victoria Island", address: "Adeola Odeku St, Victoria Island", type: "recent" },
  { id: "surulere", icon: History, label: "Surulere", address: "Adeniran Ogunsanya St, Surulere", type: "recent" },
];

/** Mock search results based on query */
function searchLocations(query: string): LocationItem[] {
  if (!query.trim()) return [];
  const all = [
    { id: "s1", label: "Eko Atlantic City", address: "Eko Atlantic, Victoria Island", type: "search" as const },
    { id: "s2", label: "Landmark Beach", address: "Water Corporation Rd, Oniru", type: "search" as const },
    { id: "s3", label: "National Theatre", address: "Iganmu, Surulere", type: "search" as const },
    { id: "s4", label: "Computer Village", address: "Otigba St, Ikeja", type: "search" as const },
    { id: "s5", label: "University of Lagos", address: "University Rd, Akoka", type: "search" as const },
    { id: "s6", label: "Ikeja City Mall", address: "Obafemi Awolowo Way, Ikeja", type: "search" as const },
    { id: "s7", label: "Third Mainland Bridge", address: "Third Mainland Bridge, Lagos", type: "search" as const },
    { id: "s8", label: "Palms Shopping Mall", address: "1 Bis Way, Lekki Phase 1", type: "search" as const },
  ];
  const q = query.toLowerCase();
  return all
    .filter((p) => p.label.toLowerCase().includes(q) || p.address.toLowerCase().includes(q))
    .slice(0, 5)
    .map((p) => ({ ...p, icon: MapPinned }));
}

/* ── Vehicle options ── */
const VEHICLES: { id: RideCategory; label: string; sub: string; icon: typeof Car; isEV?: boolean }[] = [
  { id: "JetEV", label: "JetEV", sub: "Zero emissions", icon: Zap, isEV: true },
  { id: "Comfort", label: "Comfort", sub: "Extra legroom", icon: Car },
  { id: "Premium", label: "Premium", sub: "Premium experience", icon: Crown },
];

const RECURRENCE_OPTIONS: { value: Recurrence; label: string }[] = [
  { value: null, label: "One-time" },
  { value: "weekdays", label: "Weekdays" },
  { value: "daily", label: "Daily" },
  { value: "weekly", label: "Weekly" },
];

function estimateFare(category: RideCategory): string {
  switch (category) {
    case "JetEV": return "₦2,800";
    case "Comfort": return "₦4,200";
    case "Premium": return "₦7,500";
  }
}

interface ScheduleCreateSheetProps {
  colorMode: GlassColorMode;
  onClose: () => void;
  onConfirm: (ride: Omit<ScheduledRide, "id" | "status" | "driver">) => void;
}

export function ScheduleCreateSheet({
  colorMode,
  onClose,
  onConfirm,
}: ScheduleCreateSheetProps) {
  const d = colorMode === "dark";
  const c = GLASS_COLORS[colorMode];

  // Form state
  const [pickup, setPickup] = useState<LocationItem | null>(SAVED_PLACES[0]); // default Home
  const [destination, setDestination] = useState<LocationItem | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  const [selectedTime, setSelectedTime] = useState<string>("7:30 AM");
  const [category, setCategory] = useState<RideCategory>("JetEV");
  const [recurrence, setRecurrence] = useState<Recurrence>(null);
  const [showTimePicker, setShowTimePicker] = useState(false);

  // Location search mode
  const [searchMode, setSearchMode] = useState<"pickup" | "destination" | null>(null);

  const calendarDays = getCalendarDays(new Date(), 14);
  const timeSlots = generateTimeSlots();
  const timeScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (showTimePicker && timeScrollRef.current) {
      const active = timeScrollRef.current.querySelector("[data-active='true']");
      if (active) active.scrollIntoView({ block: "center", behavior: "smooth" });
    }
  }, [showTimePicker]);

  const canConfirm = pickup && destination && selectedDate && selectedTime;

  const handleConfirm = () => {
    if (!pickup || !destination) return;
    onConfirm({
      from: pickup.label,
      fromAddress: pickup.address,
      to: destination.label,
      toAddress: destination.address,
      date: selectedDate,
      time: selectedTime,
      category,
      fare: estimateFare(category),
      recurring: recurrence,
      duration: `${15 + Math.floor(Math.random() * 25)} min`,
    });
  };

  const handleLocationSelect = (loc: LocationItem) => {
    if (searchMode === "pickup") {
      setPickup(loc);
      // Auto-advance to destination if not set
      if (!destination) {
        setSearchMode("destination");
        return;
      }
    } else {
      setDestination(loc);
    }
    setSearchMode(null);
  };

  return (
    <>
      {/* Scrim */}
      <motion.div
        className="absolute inset-0 z-30"
        style={{ background: d ? "rgba(0,0,0,0.5)" : "rgba(0,0,0,0.15)" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={searchMode ? () => setSearchMode(null) : onClose}
      />

      {/* Sheet */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 z-40"
        style={{ maxHeight: "92%" }}
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", stiffness: 350, damping: 30 }}
      >
        <GlassPanel variant={d ? "dark" : "light"} blur={24} className="rounded-t-3xl h-full flex flex-col">
          {/* Handle */}
          <div className="flex justify-center py-3 shrink-0">
            <div className="w-10 h-1 rounded-full" style={{ background: c.surface.hover }} />
          </div>

          <AnimatePresence mode="wait">
            {searchMode ? (
              <LocationSearch
                key="search"
                mode={searchMode}
                colorMode={colorMode}
                currentPickup={pickup}
                currentDestination={destination}
                onSelect={handleLocationSelect}
                onBack={() => setSearchMode(null)}
              />
            ) : (
              <FormView
                key="form"
                colorMode={colorMode}
                pickup={pickup}
                destination={destination}
                selectedDate={selectedDate}
                selectedTime={selectedTime}
                category={category}
                recurrence={recurrence}
                showTimePicker={showTimePicker}
                calendarDays={calendarDays}
                timeSlots={timeSlots}
                timeScrollRef={timeScrollRef}
                canConfirm={!!canConfirm}
                onPickupTap={() => setSearchMode("pickup")}
                onDestinationTap={() => setSearchMode("destination")}
                onDateSelect={setSelectedDate}
                onTimeSelect={setSelectedTime}
                onToggleTimePicker={() => setShowTimePicker(!showTimePicker)}
                onCategorySelect={setCategory}
                onRecurrenceSelect={setRecurrence}
                onConfirm={handleConfirm}
                onClose={onClose}
              />
            )}
          </AnimatePresence>
        </GlassPanel>
      </motion.div>
    </>
  );
}


/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * LocationSearch — Full search mode for pickup or destination.
 * Text input + saved + recent + live search results.
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━���━━━━━━━━━━━━━━ */
function LocationSearch({
  mode,
  colorMode,
  currentPickup,
  currentDestination,
  onSelect,
  onBack,
}: {
  mode: "pickup" | "destination";
  colorMode: GlassColorMode;
  currentPickup: LocationItem | null;
  currentDestination: LocationItem | null;
  onSelect: (loc: LocationItem) => void;
  onBack: () => void;
}) {
  const d = colorMode === "dark";
  const c = GLASS_COLORS[colorMode];
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const results = searchLocations(query);

  // Auto-focus the input
  useEffect(() => {
    const t = setTimeout(() => inputRef.current?.focus(), 200);
    return () => clearTimeout(t);
  }, []);

  // Filter out already-selected location
  const excludeId = mode === "pickup" ? currentDestination?.id : currentPickup?.id;
  const filteredSaved = SAVED_PLACES.filter((p) => p.id !== excludeId);
  const filteredRecent = RECENT_PLACES.filter((p) => p.id !== excludeId);

  return (
    <motion.div
      className="flex-1 flex flex-col overflow-hidden"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={MOTION.standard}
    >
      {/* Header */}
      <div className="flex items-center gap-3 px-5 pb-3 shrink-0">
        <motion.button
          className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
          style={{ background: c.surface.subtle }}
          onClick={onBack}
          whileTap={{ scale: 0.9 }}
        >
          <ArrowLeft className="w-4 h-4" style={{ color: c.icon.primary }} />
        </motion.button>
        <span style={{
          fontFamily: "var(--font-heading)", fontSize: "17px", fontWeight: 600,
          letterSpacing: "-0.02em", color: c.text.primary,
        }}>
          {mode === "pickup" ? "Pickup location" : "Where to?"}
        </span>
      </div>

      {/* Search input */}
      <div className="px-5 pb-3 shrink-0">
        <div
          className="flex items-center gap-2.5 px-3.5 py-3 rounded-xl"
          style={{
            background: c.surface.subtle,
            border: `1px solid ${d ? "rgba(255,255,255,0.08)" : "rgba(11,11,13,0.08)"}`,
          }}
        >
          <Search className="w-4 h-4 shrink-0" style={{ color: c.icon.muted }} />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={mode === "pickup" ? "Search pickup location..." : "Search destination..."}
            className="flex-1 bg-transparent outline-none"
            style={{
              ...GLASS_TYPE.bodySmall,
              color: c.text.primary,
              letterSpacing: "-0.02em",
            }}
          />
          {query && (
            <motion.button
              className="w-5 h-5 rounded-full flex items-center justify-center"
              style={{ background: c.surface.hover }}
              onClick={() => setQuery("")}
              whileTap={{ scale: 0.9 }}
            >
              <X className="w-3 h-3" style={{ color: c.icon.secondary }} />
            </motion.button>
          )}
        </div>
      </div>

      {/* Results list */}
      <div className="flex-1 overflow-y-auto scrollbar-hide px-5 pb-8">
        {/* Current location option (for pickup) */}
        {mode === "pickup" && !query && (
          <motion.button
            className="w-full flex items-center gap-3 py-3"
            style={{ borderBottom: `1px solid ${c.surface.hover}` }}
            onClick={() => onSelect({
              id: "current",
              label: "Current location",
              address: "12 Bourdillon Rd, Ikoyi",
              icon: Navigation,
              type: "saved",
            })}
            whileTap={{ scale: 0.98 }}
          >
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: "rgba(29,185,84,0.1)" }}
            >
              <Navigation className="w-4 h-4" style={{ color: BRAND_COLORS.green }} />
            </div>
            <div className="text-left">
              <div style={{ ...GLASS_TYPE.bodySmall, color: c.text.primary }}>Current location</div>
              <div style={{ ...GLASS_TYPE.caption, color: c.text.muted }}>12 Bourdillon Rd, Ikoyi</div>
            </div>
          </motion.button>
        )}

        {/* Search results */}
        {query && results.length > 0 && (
          <div className="mb-4">
            {results.map((loc, i) => (
              <LocationRow
                key={loc.id}
                location={loc}
                colorMode={colorMode}
                index={i}
                onSelect={onSelect}
              />
            ))}
          </div>
        )}

        {/* No results */}
        {query && results.length === 0 && (
          <div className="py-8 text-center">
            <MapPin className="w-6 h-6 mx-auto mb-2" style={{ color: c.text.ghost }} />
            <p style={{ ...GLASS_TYPE.bodySmall, color: c.text.muted }}>No results for "{query}"</p>
            <p style={{ ...GLASS_TYPE.caption, color: c.text.faint, marginTop: "4px" }}>
              Try a different search term
            </p>
          </div>
        )}

        {/* Saved places */}
        {!query && (
          <>
            <div className="mb-1 mt-2">
              <span style={{ ...GLASS_TYPE.label, color: c.text.faint }}>Saved places</span>
            </div>
            {filteredSaved.map((loc, i) => (
              <LocationRow
                key={loc.id}
                location={loc}
                colorMode={colorMode}
                index={i}
                onSelect={onSelect}
              />
            ))}

            {/* Recent */}
            <div className="mb-1 mt-4">
              <span style={{ ...GLASS_TYPE.label, color: c.text.faint }}>Recent</span>
            </div>
            {filteredRecent.map((loc, i) => (
              <LocationRow
                key={loc.id}
                location={loc}
                colorMode={colorMode}
                index={i + filteredSaved.length}
                onSelect={onSelect}
              />
            ))}
          </>
        )}
      </div>
    </motion.div>
  );
}

function LocationRow({
  location,
  colorMode,
  index,
  onSelect,
}: {
  location: LocationItem;
  colorMode: GlassColorMode;
  index: number;
  onSelect: (loc: LocationItem) => void;
}) {
  const d = colorMode === "dark";
  const c = GLASS_COLORS[colorMode];
  const Icon = location.icon;

  return (
    <motion.button
      className="w-full flex items-center gap-3 py-2.5 transition-colors"
      style={{ borderBottom: `1px solid ${c.surface.hover}` }}
      onClick={() => onSelect(location)}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ ...MOTION.micro, delay: index * 0.03 }}
    >
      <div
        className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
        style={{ background: c.surface.subtle }}
      >
        <Icon className="w-4 h-4" style={{ color: c.icon.secondary }} />
      </div>
      <div className="flex-1 text-left min-w-0">
        <div className="truncate" style={{ ...GLASS_TYPE.bodySmall, color: c.text.primary }}>
          {location.label}
        </div>
        <div className="truncate" style={{ ...GLASS_TYPE.caption, color: c.text.muted }}>
          {location.address}
        </div>
      </div>
    </motion.button>
  );
}


/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * FormView — The main scheduling form (date, time, vehicle, recurrence)
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
function FormView({
  colorMode,
  pickup,
  destination,
  selectedDate,
  selectedTime,
  category,
  recurrence,
  showTimePicker,
  calendarDays,
  timeSlots,
  timeScrollRef,
  canConfirm,
  onPickupTap,
  onDestinationTap,
  onDateSelect,
  onTimeSelect,
  onToggleTimePicker,
  onCategorySelect,
  onRecurrenceSelect,
  onConfirm,
  onClose,
}: {
  colorMode: GlassColorMode;
  pickup: LocationItem | null;
  destination: LocationItem | null;
  selectedDate: string;
  selectedTime: string;
  category: RideCategory;
  recurrence: Recurrence;
  showTimePicker: boolean;
  calendarDays: ReturnType<typeof getCalendarDays>;
  timeSlots: string[];
  timeScrollRef: React.RefObject<HTMLDivElement | null>;
  canConfirm: boolean;
  onPickupTap: () => void;
  onDestinationTap: () => void;
  onDateSelect: (d: string) => void;
  onTimeSelect: (t: string) => void;
  onToggleTimePicker: () => void;
  onCategorySelect: (c: RideCategory) => void;
  onRecurrenceSelect: (r: Recurrence) => void;
  onConfirm: () => void;
  onClose: () => void;
}) {
  const d = colorMode === "dark";
  const c = GLASS_COLORS[colorMode];
  const [showFullCalendar, setShowFullCalendar] = useState(false);

  return (
    <motion.div
      className="flex-1 flex flex-col overflow-hidden"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={MOTION.standard}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 pb-4 shrink-0">
        <span style={{
          fontFamily: "var(--font-heading)", fontSize: "20px", fontWeight: 600,
          letterSpacing: "-0.03em", lineHeight: "1.2", color: c.text.display,
        }}>
          Schedule a ride
        </span>
        <motion.button
          className="w-8 h-8 rounded-full flex items-center justify-center"
          style={{ background: c.surface.subtle }}
          onClick={onClose}
          whileTap={{ scale: 0.9 }}
        >
          <X className="w-4 h-4" style={{ color: c.icon.secondary }} />
        </motion.button>
      </div>

      {/* Scrollable form */}
      <div className="flex-1 overflow-y-auto scrollbar-hide px-5 pb-4">

        {/* ── Route (pickup + destination) ── */}
        <div className="mb-5">
          <div className="flex items-start gap-3">
            {/* Route line */}
            <div className="flex flex-col items-center shrink-0 pt-4">
              <div className="w-2.5 h-2.5 rounded-full border-2" style={{ borderColor: BRAND_COLORS.green }} />
              <div className="w-px h-8 my-1" style={{ background: c.surface.hover }} />
              <div className="w-2.5 h-2.5 rounded-full" style={{ background: c.text.ghost }} />
            </div>

            <div className="flex-1 flex flex-col gap-2">
              {/* Pickup */}
              <motion.button
                className="w-full text-left px-3.5 py-3 rounded-xl transition-colors"
                style={{
                  background: c.surface.subtle,
                  border: pickup ? `1px solid transparent` : `1px dashed ${c.surface.hover}`,
                }}
                onClick={onPickupTap}
                whileTap={{ scale: 0.98 }}
              >
                {pickup ? (
                  <div>
                    <div style={{ ...GLASS_TYPE.bodySmall, color: c.text.primary }}>
                      {pickup.label}
                    </div>
                    <div style={{ ...GLASS_TYPE.caption, color: c.text.muted }}>{pickup.address}</div>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Navigation className="w-3.5 h-3.5" style={{ color: c.icon.muted }} />
                    <span style={{ ...GLASS_TYPE.bodySmall, color: c.text.faint }}>Set pickup location</span>
                  </div>
                )}
              </motion.button>

              {/* Destination */}
              <motion.button
                className="w-full text-left px-3.5 py-3 rounded-xl transition-colors"
                style={{
                  background: destination
                    ? c.surface.subtle
                    : d ? "rgba(29,185,84,0.04)" : "rgba(29,185,84,0.03)",
                  border: destination
                    ? `1px solid transparent`
                    : `1px dashed rgba(29,185,84,${d ? "0.2" : "0.15"})`,
                }}
                onClick={onDestinationTap}
                whileTap={{ scale: 0.98 }}
              >
                {destination ? (
                  <div>
                    <div style={{ ...GLASS_TYPE.bodySmall, color: c.text.primary }}>
                      {destination.label}
                    </div>
                    <div style={{ ...GLASS_TYPE.caption, color: c.text.muted }}>{destination.address}</div>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5" style={{ color: BRAND_COLORS.green, opacity: 0.5 }} />
                    <span style={{ ...GLASS_TYPE.bodySmall, color: c.text.faint }}>Where to?</span>
                  </div>
                )}
              </motion.button>
            </div>
          </div>
        </div>

        {/* ── Date ── */}
        <div className="mb-5">
          <div className="flex items-center justify-between">
            <span style={{ ...GLASS_TYPE.label, color: c.text.faint }}>Date</span>
            <motion.button
              className="flex items-center gap-1 px-1.5 py-0.5 rounded-md transition-colors"
              style={{
                background: showFullCalendar
                  ? d ? "rgba(29,185,84,0.1)" : "rgba(29,185,84,0.06)"
                  : "transparent",
              }}
              onClick={() => setShowFullCalendar(!showFullCalendar)}
              whileTap={{ scale: 0.95 }}
            >
              <Calendar className="w-3 h-3" style={{ color: showFullCalendar ? BRAND_COLORS.green : c.icon.muted }} />
              <span style={{
                ...GLASS_TYPE.caption, fontSize: "11px", lineHeight: "1.4",
                color: showFullCalendar ? BRAND_COLORS.green : c.text.muted,
              }}>
                {showFullCalendar ? "Less" : "More"}
              </span>
            </motion.button>
          </div>

          {/* Horizontal quick-pick */}
          <div className="flex gap-1.5 mt-2 overflow-x-auto scrollbar-hide -mx-5 px-5">
            {calendarDays.map((day) => {
              const isSelected = day.dateStr === selectedDate;
              return (
                <motion.button
                  key={day.dateStr}
                  className="flex flex-col items-center gap-0.5 px-3 py-2 rounded-xl shrink-0 transition-colors"
                  style={{
                    minWidth: "48px",
                    background: isSelected
                      ? d ? "rgba(29,185,84,0.12)" : "rgba(29,185,84,0.08)"
                      : "transparent",
                    border: isSelected
                      ? `1px solid rgba(29,185,84,${d ? "0.25" : "0.2"})`
                      : "1px solid transparent",
                  }}
                  onClick={() => { onDateSelect(day.dateStr); setShowFullCalendar(false); }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span style={{
                    ...GLASS_TYPE.caption, fontSize: "10px",
                    color: isSelected ? BRAND_COLORS.green : c.text.muted,
                  }}>
                    {day.isToday ? "Today" : day.dayName}
                  </span>
                  <span style={{
                    fontFamily: "var(--font-heading)", fontSize: "16px",
                    fontWeight: isSelected ? 600 : 500, letterSpacing: "-0.02em", lineHeight: "1.2",
                    color: isSelected ? (d ? "rgba(255,255,255,0.9)" : "#0B0B0D") : c.text.tertiary,
                  }}>
                    {day.dayNum}
                  </span>
                </motion.button>
              );
            })}
          </div>

          {/* Show selected date label if it's outside the quick-pick range */}
          {(() => {
            const inRange = calendarDays.some((day) => day.dateStr === selectedDate);
            if (inRange || showFullCalendar) return null;
            const sel = new Date(selectedDate + "T00:00:00");
            return (
              <div className="mt-2 px-1" style={{ ...GLASS_TYPE.caption, color: BRAND_COLORS.green }}>
                {sel.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
              </div>
            );
          })()}

          {/* Full calendar month view */}
          <AnimatePresence>
            {showFullCalendar && (
              <MonthCalendar
                selectedDate={selectedDate}
                colorMode={colorMode}
                onSelect={(dateStr) => {
                  onDateSelect(dateStr);
                  setShowFullCalendar(false);
                }}
              />
            )}
          </AnimatePresence>
        </div>

        {/* ── Time ── */}
        <div className="mb-5">
          <span style={{ ...GLASS_TYPE.label, color: c.text.faint }}>Time</span>
          <motion.button
            className="w-full flex items-center justify-between mt-2 px-4 py-3 rounded-xl transition-colors"
            style={{
              background: c.surface.subtle,
              border: showTimePicker
                ? `1px solid rgba(29,185,84,${d ? "0.25" : "0.2"})`
                : `1px solid transparent`,
            }}
            onClick={onToggleTimePicker}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" style={{ color: c.icon.secondary }} />
              <span style={{ ...GLASS_TYPE.small, color: c.text.primary }}>{selectedTime}</span>
            </div>
            <ChevronRight
              className="w-4 h-4 transition-transform"
              style={{ color: c.icon.muted, transform: showTimePicker ? "rotate(90deg)" : "rotate(0deg)" }}
            />
          </motion.button>
          <AnimatePresence>
            {showTimePicker && (
              <motion.div
                ref={timeScrollRef}
                className="mt-2 max-h-[160px] overflow-y-auto scrollbar-hide rounded-xl"
                style={{ background: c.surface.subtle }}
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={MOTION.standard}
              >
                <div className="py-1">
                  {timeSlots.map((slot) => {
                    const isActive = slot === selectedTime;
                    return (
                      <button
                        key={slot}
                        data-active={isActive ? "true" : undefined}
                        className="w-full text-left px-4 py-2 transition-colors"
                        style={{
                          background: isActive ? d ? "rgba(29,185,84,0.12)" : "rgba(29,185,84,0.08)" : "transparent",
                          ...GLASS_TYPE.bodySmall,
                          color: isActive ? BRAND_COLORS.green : c.text.secondary,
                          fontWeight: isActive ? 600 : 400,
                        }}
                        onClick={() => onTimeSelect(slot)}
                      >
                        {slot}
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ── Vehicle ── */}
        <div className="mb-5">
          <span style={{ ...GLASS_TYPE.label, color: c.text.faint }}>Vehicle</span>
          <div className="flex gap-2 mt-2">
            {VEHICLES.map((v) => {
              const Icon = v.icon;
              const isSelected = category === v.id;
              const catColor = getCategoryColor(v.id);
              return (
                <motion.button
                  key={v.id}
                  className="flex-1 flex flex-col items-center gap-1.5 px-2 py-3 rounded-xl transition-colors"
                  style={{
                    background: isSelected ? `${catColor}${d ? "18" : "10"}` : c.surface.subtle,
                    border: isSelected ? `1px solid ${catColor}40` : "1px solid transparent",
                  }}
                  onClick={() => onCategorySelect(v.id)}
                  whileTap={{ scale: 0.95 }}
                >
                  <Icon className="w-5 h-5" style={{ color: isSelected ? catColor : c.icon.secondary }} />
                  <div style={{ ...GLASS_TYPE.caption, fontWeight: isSelected ? 600 : 500, color: isSelected ? catColor : c.text.secondary }}>
                    {v.label}
                  </div>
                  <div style={{ ...GLASS_TYPE.caption, fontSize: "10px", color: c.text.muted }}>
                    {estimateFare(v.id)}
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* ── Recurrence ── */}
        <div className="mb-6">
          <span style={{ ...GLASS_TYPE.label, color: c.text.faint }}>Repeat</span>
          <div className="flex gap-2 mt-2 overflow-x-auto scrollbar-hide">
            {RECURRENCE_OPTIONS.map((opt) => {
              const isSelected = recurrence === opt.value;
              return (
                <motion.button
                  key={opt.label}
                  className="px-3.5 py-2 rounded-xl shrink-0 transition-colors"
                  style={{
                    background: isSelected
                      ? d ? "rgba(255,255,255,0.08)" : "rgba(11,11,13,0.06)"
                      : c.surface.subtle,
                    border: isSelected
                      ? `1px solid ${d ? "rgba(255,255,255,0.12)" : "rgba(11,11,13,0.1)"}`
                      : "1px solid transparent",
                  }}
                  onClick={() => onRecurrenceSelect(opt.value)}
                  whileTap={{ scale: 0.95 }}
                >
                  <span style={{
                    ...GLASS_TYPE.caption, fontWeight: isSelected ? 600 : 500,
                    color: isSelected ? c.text.primary : c.text.muted,
                  }}>
                    {opt.label}
                  </span>
                </motion.button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Confirm bar ── */}
      <div className="shrink-0 px-5 pb-8 pt-3" style={{ borderTop: `1px solid ${c.surface.hover}` }}>
        {canConfirm && pickup && destination && (
          <motion.div
            className="flex items-center justify-between mb-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={MOTION.micro}
          >
            <div>
              <span style={{ ...GLASS_TYPE.bodySmall, color: c.text.secondary }}>
                {pickup.label} → {destination.label}
              </span>
              <div style={{ ...GLASS_TYPE.caption, color: c.text.muted }}>
                {selectedTime} · {recurrence ? recurrenceLabel(recurrence) : "One-time"}
              </div>
            </div>
            <span style={{
              fontFamily: "var(--font-heading)", fontSize: "17px", fontWeight: 600,
              letterSpacing: "-0.02em", color: c.text.primary,
            }}>
              {estimateFare(category)}
            </span>
          </motion.div>
        )}
        <motion.button
          className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl transition-opacity"
          style={{
            background: canConfirm ? BRAND_COLORS.green : c.surface.subtle,
            opacity: canConfirm ? 1 : 0.5,
          }}
          onClick={canConfirm ? onConfirm : undefined}
          whileTap={canConfirm ? { scale: 0.98 } : undefined}
        >
          <Calendar className="w-4 h-4" style={{ color: canConfirm ? "#fff" : c.text.muted }} />
          <span style={{ ...GLASS_TYPE.small, fontWeight: 600, color: canConfirm ? "#fff" : c.text.muted }}>
            {canConfirm ? "Schedule ride" : "Set pickup & destination"}
          </span>
        </motion.button>
      </div>
    </motion.div>
  );
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * MonthCalendar — Full month view calendar for date selection.
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
function MonthCalendar({
  selectedDate,
  colorMode,
  onSelect,
}: {
  selectedDate: string;
  colorMode: GlassColorMode;
  onSelect: (dateStr: string) => void;
}) {
  const d = colorMode === "dark";
  const c = GLASS_COLORS[colorMode];
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Track the displayed month
  const [viewDate, setViewDate] = useState(() => {
    const sel = selectedDate ? new Date(selectedDate + "T00:00:00") : new Date();
    return new Date(sel.getFullYear(), sel.getMonth(), 1);
  });

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const totalDays = new Date(year, month + 1, 0).getDate();
  const startDay = new Date(year, month, 1).getDay();
  const monthLabel = viewDate.toLocaleString("en-US", { month: "long", year: "numeric" });

  const prevMonth = () => setViewDate(new Date(year, month - 1, 1));
  const nextMonth = () => setViewDate(new Date(year, month + 1, 1));

  return (
    <motion.div
      className="mt-3 rounded-xl py-3 px-2"
      style={{ background: c.surface.subtle }}
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: "auto", opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      transition={MOTION.standard}
    >
      {/* Month nav */}
      <div className="flex items-center justify-between px-1 mb-3">
        <motion.button
          className="w-8 h-8 rounded-full flex items-center justify-center"
          style={{ background: c.surface.hover }}
          onClick={prevMonth}
          whileTap={{ scale: 0.9 }}
        >
          <ChevronLeft className="w-4 h-4" style={{ color: c.icon.primary }} />
        </motion.button>
        <span style={{
          fontFamily: "var(--font-heading)", fontSize: "15px", fontWeight: 600,
          letterSpacing: "-0.02em", color: c.text.primary,
        }}>
          {monthLabel}
        </span>
        <motion.button
          className="w-8 h-8 rounded-full flex items-center justify-center"
          style={{ background: c.surface.hover }}
          onClick={nextMonth}
          whileTap={{ scale: 0.9 }}
        >
          <ChevronRight className="w-4 h-4" style={{ color: c.icon.primary }} />
        </motion.button>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 mb-1">
        {["S", "M", "T", "W", "T", "F", "S"].map((day, i) => (
          <div
            key={`${day}-${i}`}
            className="flex items-center justify-center h-8"
            style={{ ...GLASS_TYPE.caption, fontSize: "11px", color: c.text.faint }}
          >
            {day}
          </div>
        ))}
      </div>

      {/* Day grid */}
      <div className="grid grid-cols-7">
        {/* Leading empty cells */}
        {Array.from({ length: startDay }, (_, i) => (
          <div key={`pad-${i}`} className="h-9" />
        ))}
        {/* Days */}
        {Array.from({ length: totalDays }, (_, i) => {
          const dayNum = i + 1;
          const date = new Date(year, month, dayNum);
          const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(dayNum).padStart(2, "0")}`;
          const isSelected = dateStr === selectedDate;
          const isToday = date.getTime() === today.getTime();
          const isPast = date < today;

          return (
            <motion.button
              key={dateStr}
              className="h-9 flex items-center justify-center rounded-full"
              style={{
                background: isSelected
                  ? d ? "rgba(29,185,84,0.15)" : "rgba(29,185,84,0.1)"
                  : "transparent",
                border: isSelected
                  ? `1.5px solid rgba(29,185,84,${d ? "0.35" : "0.25"})`
                  : isToday
                    ? `1px solid ${d ? "rgba(255,255,255,0.12)" : "rgba(11,11,13,0.1)"}`
                    : "1.5px solid transparent",
                opacity: isPast && !isToday ? 0.35 : 1,
              }}
              onClick={() => onSelect(dateStr)}
              whileTap={{ scale: 0.9 }}
            >
              <span style={{
                fontFamily: "var(--font-heading)", fontSize: "13px",
                fontWeight: isSelected ? 600 : isToday ? 600 : 400,
                letterSpacing: "-0.02em",
                color: isSelected ? BRAND_COLORS.green : isToday ? c.text.primary : c.text.secondary,
              }}>
                {dayNum}
              </span>
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
}