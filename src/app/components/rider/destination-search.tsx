 /**
 * Destination Search — Variation C: "Command" (LOCKED SPINE)
 *
 * Linear/Vercel command palette energy. Full-screen with bold typographic
 * prompt. Inline fares, ETAs, EV savings on every result. Information-dense.
 *
 * SPINE COMPLIANCE: C visual DNA throughout.
 * - MapCanvas as atmospheric background (peeks at top, fades into content)
 * - GlassPanel for all cards, search bar, quick-access chips, bottom bar
 * - Green ambient glows + noise texture + gradient depth from MapCanvas
 * - Montserrat 600 -0.03em headings, Manrope 500 -0.02em body
 * - Green as scalpel — only CTAs, active states, EV badges
 *
 * LIGHT MODE APPROACH (Apple-grade):
 * - Light aerial map image peeks through at the top
 * - GlassPanel variant="light" uses translucent white + blur + multi-layer shadows
 * - No double gradient overlays — MapCanvas handles the fade
 * - Meta chips use chip-light variant (subtle gray bg, visible against white cards)
 *
 * PILL LAYOUT: Icon-aligned (LOCKED) — pills break out below icon+text row,
 * left-aligned to the card's left padding (same margin as the icon).
 */

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ArrowLeft,
  Search,
  X,
  Home,
  Briefcase,
  MapPin,
  Clock,
  Star,
  Plane,
  Zap,
  CalendarClock,
  UserRound,
  ShieldCheck,
  Crosshair,
} from "lucide-react";
import {
  GLASS_COLORS,
  GLASS_TYPE,
  MOTION,
  type GlassColorMode,
} from "../../config/project";
import { BRAND_COLORS } from "../../config/brand";
import { RIDER_TYPE as RT } from "../../config/rider-type";
import { GlassPanel } from "./glass-panel";
import { MapCanvas } from "./map-canvas";
import {
  savedPlaces,
  recentSearches,
  suggestions,
  type Place,
} from "./destination-search-data";

const iconMap = {
  home: Home,
  work: Briefcase,
  pin: MapPin,
  clock: Clock,
  star: Star,
  plane: Plane,
};

interface DestinationSearchCProps {
  colorMode?: GlassColorMode;
  onBack?: () => void;
  onSelect?: (place: Place) => void;
}

export function DestinationSearch({
  colorMode = "dark",
  onBack,
  onSelect,
}: DestinationSearchCProps) {
  const c = GLASS_COLORS[colorMode];
  const d = colorMode === "dark";
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const t = setTimeout(() => inputRef.current?.focus(), 400);
    return () => clearTimeout(t);
  }, []);

  const allPlaces = [...savedPlaces, ...recentSearches, ...suggestions];
  const filtered = query.trim()
    ? allPlaces.filter(
        (p) =>
          p.name.toLowerCase().includes(query.toLowerCase()) ||
          p.address.toLowerCase().includes(query.toLowerCase())
      )
    : null;

  /* ── Chip variant helper ── */
  const chipVariant = d ? "chip-dark" : "chip-light";

  /* ── Meta pills (extracted for reuse) ── */
  const renderMetaPills = (place: Place) => {
    const hasEta = place.eta && place.eta !== "—";
    const hasFare = place.fare;
    const hasEvFare = place.evFare;
    if (!hasEta && !hasFare) return null;

    return (
      <div className="flex items-center gap-1.5 mt-2 flex-nowrap">
        {hasEta && (
          <GlassPanel
            variant={chipVariant}
            className="flex items-center gap-1 px-1.5 py-px rounded-md shrink-0"
            borderless
          >
            <Clock
              className="w-3 h-3 shrink-0"
              style={{ color: c.icon.muted }}
            />
            <span
              style={{
                ...RT.meta,
                whiteSpace: "nowrap",
                color: c.text.tertiary,
              }}
            >
              {place.eta}
            </span>
          </GlassPanel>
        )}
        {place.distance && (
          <GlassPanel
            variant={chipVariant}
            className="flex items-center px-1.5 py-px rounded-md shrink-0"
            borderless
          >
            <span
              style={{
                ...RT.meta,
                whiteSpace: "nowrap",
                color: c.text.muted,
              }}
            >
              {place.distance}
            </span>
          </GlassPanel>
        )}
        {hasFare && (
          <GlassPanel
            variant={chipVariant}
            className="flex items-center px-1.5 py-px rounded-md shrink-0"
            borderless
          >
            <span
              style={{
                ...RT.meta,
                whiteSpace: "nowrap",
                color: c.text.secondaryStrong,
              }}
            >
              ~{place.fare}
            </span>
          </GlassPanel>
        )}
        {hasEvFare && (
          <span
            className="flex items-center gap-0.5 px-1.5 py-px rounded-md shrink-0"
            style={{
              background: c.green.evBg,
              ...RT.meta,
              whiteSpace: "nowrap",
              color: c.green.evText,
            }}
          >
            <Zap className="w-3 h-3 shrink-0" />
            {place.evFare}
          </span>
        )}
      </div>
    );
  };

  /* ── Place card ── */
  const renderPlaceCard = (place: Place, index: number) => {
    const Icon = iconMap[place.icon];
    const isSaved = place.type === "saved";

    return (
      <motion.button
        key={place.id}
        className="w-full text-left"
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          ...MOTION.standard,
          delay: 0.12 + index * MOTION.stagger,
        }}
        whileTap={{ scale: 0.98 }}
        onClick={() => onSelect?.(place)}
      >
        <GlassPanel
          variant={d ? "dark" : "light"}
          blur={d ? 16 : 24}
          className="px-4 py-3.5 rounded-2xl"
        >
          {/* Icon + text row */}
          <div className="flex items-start gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
              style={{
                background: isSaved ? c.green.tint : c.surface.subtle,
              }}
            >
              <Icon
                className="w-[18px] h-[18px]"
                style={{
                  color: isSaved ? BRAND_COLORS.green : c.icon.tertiary,
                }}
              />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span
                  className="truncate"
                  style={{ ...RT.body, color: c.text.primary }}
                >
                  {place.name}
                </span>
                {isSaved && (
                  <Star
                    className="w-3 h-3 shrink-0"
                    style={{
                      color: BRAND_COLORS.green,
                      fill: BRAND_COLORS.green,
                    }}
                  />
                )}
              </div>
              <div
                className="truncate mt-0.5"
                style={{
                  ...RT.meta,
                  color: c.text.muted,
                }}
              >
                {place.address}
              </div>
            </div>
          </div>

          {/* Pills row — icon-aligned (card padding left edge) */}
          {renderMetaPills(place)}
        </GlassPanel>
      </motion.button>
    );
  };

  /* ── Section label ── */
  const renderSectionLabel = (text: string, delay = 0) => (
    <motion.div
      className="flex items-center justify-between"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ ...MOTION.standard, delay }}
    >
      <span style={{ ...RT.label, color: c.text.faint }}>
        {text}
      </span>
    </motion.div>
  );

  return (
    <div
      className={`relative h-screen w-full overflow-hidden`}
      style={{ background: c.bg }}
    >
      {/* ─── Atmospheric map background ─── */}
      <MapCanvas variant="muted" colorMode={colorMode} />

      {/* Dark mode only: extra gradient for content zone readability */}
      {d && (
        <div className="absolute inset-0 bg-gradient-to-b from-[#0B0B0D]/30 via-[#0B0B0D]/70 to-[#0B0B0D]/95 z-[1]" />
      )}

      {/* ─── Header bar ─── */}
      <GlassPanel
        variant={d ? "map-dark" : "map-light"}
        blur={24}
        className="absolute top-0 left-0 right-0 z-10 rounded-none"
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={MOTION.emphasis}
        style={{ paddingTop: "env(safe-area-inset-top, 12px)" }}
      >
        <div className="px-5 pt-3 pb-2">
          <div className="flex items-center gap-3 mb-1">
            <button
              className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-colors active:scale-95"
              style={{ background: c.surface.button }}
              onClick={onBack}
            >
              <ArrowLeft
                className="w-[18px] h-[18px]"
                style={{ color: c.icon.primary }}
              />
            </button>
          </div>
        </div>
      </GlassPanel>

      {/* ─── Content zone (scrollable, below header) ─── */}
      <div
        className="absolute bottom-0 left-0 right-0 z-20 overflow-y-auto"
        style={{
          top: "80px",
          paddingBottom: "env(safe-area-inset-bottom, 24px)",
        }}
      >
        <div className="px-5 pt-2 pb-6">
          {/* Big typographic prompt */}
          <motion.h1
            className="mb-5"
            style={RT.display}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...MOTION.emphasis, delay: 0.1 }}
          >
            <span style={{ color: c.text.display }}>
              Where are you
            </span>
            <br />
            <span style={{ color: c.text.displayFaded }}>
              headed?
            </span>
          </motion.h1>

          {/* Search input — command palette style */}
          <motion.div
            className="mb-5"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...MOTION.standard, delay: 0.18 }}
          >
            <GlassPanel
              variant={d ? "dark" : "light"}
              blur={d ? 20 : 28}
              className="flex items-center gap-3 px-4 py-3.5 rounded-2xl"
            >
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
                style={{
                  background: d
                    ? BRAND_COLORS.green
                    : c.green.tint,
                }}
              >
                <Search
                  className="w-4 h-4"
                  style={{
                    color: d ? "#FFFFFF" : BRAND_COLORS.green,
                  }}
                />
              </div>
              <input
                ref={inputRef}
                type="text"
                placeholder="Search places, addresses..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="flex-1 bg-transparent outline-none"
                style={{
                  ...RT.body,
                  color: d ? c.text.primary : c.text.display,
                  caretColor: BRAND_COLORS.green,
                }}
              />
              <AnimatePresence>
                {query && (
                  <motion.button
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={MOTION.micro}
                    onClick={() => setQuery("")}
                    className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 active:scale-90"
                    style={{ background: c.surface.raised }}
                  >
                    <X
                      className="w-3.5 h-3.5"
                      style={{ color: c.text.tertiary }}
                    />
                  </motion.button>
                )}
              </AnimatePresence>
              {/* Drop pin on map — inline with search */}
              <button
                className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 active:scale-90 transition-colors"
                style={{ background: c.surface.button }}
                title="Drop pin on map"
              >
                <Crosshair
                  className="w-4 h-4"
                  style={{ color: c.icon.secondary }}
                />
              </button>
            </GlassPanel>
          </motion.div>

          {/* ─── Ride mode chips: Schedule · Ride for someone · Reserve ─── */}
          <motion.div
            className="flex items-center gap-2 mb-5 overflow-x-auto no-scrollbar"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...MOTION.standard, delay: 0.22 }}
          >
            {[
              { icon: CalendarClock, label: "Schedule", desc: "Set a pickup time" },
              { icon: UserRound, label: "Ride for someone", desc: "Send a ride" },
              { icon: ShieldCheck, label: "Reserve", desc: "Guaranteed pickup" },
            ].map((action) => (
              <button
                key={action.label}
                className="flex items-center gap-2 shrink-0 active:scale-[0.97] transition-transform"
              >
                <GlassPanel
                  variant={d ? "dark" : "light"}
                  blur={d ? 12 : 20}
                  className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl"
                >
                  <action.icon
                    className="w-4 h-4 shrink-0"
                    style={{ color: c.icon.tertiary }}
                  />
                  <span
                    style={{
                      ...RT.bodySmall,
                      whiteSpace: "nowrap",
                      color: c.text.secondary,
                    }}
                  >
                    {action.label}
                  </span>
                </GlassPanel>
              </button>
            ))}
          </motion.div>

          {/* Content */}
          <AnimatePresence mode="wait">
            {filtered ? (
              <motion.div
                key="search-results"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.12 }}
              >
                {filtered.length > 0 ? (
                  <>
                    {renderSectionLabel(`${filtered.length} results`)}
                    <div className="space-y-2 mt-2">
                      {filtered.map((p, i) => renderPlaceCard(p, i))}
                    </div>
                  </>
                ) : (
                  /* ── Empty state ── */
                  <div className="py-16 text-center">
                    <GlassPanel
                      variant={d ? "dark" : "light"}
                      blur={16}
                      className="w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center"
                    >
                      <MapPin
                        className="w-6 h-6"
                        style={{ color: c.text.ghost }}
                      />
                    </GlassPanel>
                    <div
                      style={{
                        ...RT.body,
                        color: c.text.muted,
                      }}
                    >
                      No places found
                    </div>
                    <div
                      className="mt-1"
                      style={{
                        ...RT.meta,
                        lineHeight: "1.5",
                        color: c.text.ghost,
                      }}
                    >
                      Try a different address or landmark
                    </div>
                  </div>
                )}
              </motion.div>
            ) : (
              <motion.div
                key="default-browse"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                {/* Saved quick-access cards */}
                <motion.div
                  className="flex gap-2.5 mb-5"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ ...MOTION.standard, delay: 0.22 }}
                >
                  {savedPlaces.map((sp) => {
                    const Icon = iconMap[sp.icon];
                    return (
                      <GlassPanel
                        key={sp.id}
                        variant={d ? "dark" : "light"}
                        blur={d ? 16 : 24}
                        className="flex-1 px-3.5 py-3 rounded-2xl cursor-pointer"
                        whileTap={{ scale: 0.97 }}
                      >
                        <div className="flex items-center gap-2.5">
                          <div
                            className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                            style={{ background: c.green.tint }}
                          >
                            <Icon
                              className="w-4 h-4"
                              style={{ color: BRAND_COLORS.green }}
                            />
                          </div>
                          <div className="min-w-0">
                            <div
                              className="truncate"
                              style={{
                                ...RT.bodySmall,
                                color: c.text.primarySoft,
                              }}
                            >
                              {sp.name}
                            </div>
                            {sp.eta !== "—" && (
                              <div
                                style={{
                                  ...RT.meta,
                                  fontWeight: 400,
                                  color: c.text.faint,
                                }}
                              >
                                {sp.eta}
                              </div>
                            )}
                          </div>
                        </div>
                      </GlassPanel>
                    );
                  })}
                </motion.div>

                {/* Recent */}
                <div className="mb-4">
                  {renderSectionLabel("Recent", 0.26)}
                  <div className="space-y-2 mt-2">
                    {recentSearches.map((p, i) => renderPlaceCard(p, i))}
                  </div>
                </div>

                {/* Suggestions */}
                <div className="mb-4">
                  {renderSectionLabel("Suggested for you", 0.34)}
                  <div className="space-y-2 mt-2">
                    {suggestions.map((p, i) => renderPlaceCard(p, i))}
                  </div>
                </div>

                {/* Bottom breathing room */}
                <div className="h-6" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}