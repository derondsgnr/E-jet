 /**
 * SavedPlacesScreen — Full CRUD for saved/favourite places.
 *
 * Features:
 * - List all saved places with icons, addresses, trip count, carbon stats
 * - Add new place (search → pick → label → icon → save)
 * - Edit existing (change label, icon, address)
 * - Delete with inline confirmation
 * - Tap place → trigger ride (navigate to booking)
 *
 * NORTHSTAR: Uber saved places + Apple Maps favourites
 * SPINE: GlassPanel, MapCanvas, green-as-scalpel, motion stagger
 */

import { useState, useMemo, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ArrowLeft,
  Plus,
  Search,
  X,
  Check,
  Trash2,
  Pencil,
  ChevronRight,
  Navigation,
  Home,
  Briefcase,
  Plane,
  Dumbbell,
  Heart,
  Star,
  Coffee,
  BookOpen,
  ShoppingBag,
  Hospital,
  Leaf,
  MapPin,
} from "lucide-react";
import {
  GLASS_COLORS,
  GLASS_TYPE,
  MOTION,
  type GlassColorMode,
} from "../../config/project";
import { BRAND_COLORS } from "../../config/brand";
import { GlassPanel } from "./glass-panel";
import { MapCanvas } from "./map-canvas";
import { CarbonSummaryCard } from "./carbon-summary-card";
import {
  type SavedPlace,
  type PlaceIcon,
  type SearchResult,
  ICON_OPTIONS,
  mockSearchResults,
} from "./saved-places-data";
import { useSavedPlaces } from "./saved-places-store";

const SPRING = { type: "spring" as const, stiffness: 500, damping: 32, mass: 0.8 };
const SPRING_BOUNCY = { type: "spring" as const, stiffness: 400, damping: 22, mass: 0.6 };

/* ── Icon map ── */
const ICON_MAP: Record<PlaceIcon, typeof Home> = {
  home: Home,
  work: Briefcase,
  plane: Plane,
  gym: Dumbbell,
  heart: Heart,
  star: Star,
  coffee: Coffee,
  book: BookOpen,
  shopping: ShoppingBag,
  hospital: Hospital,
};

type SheetMode = "closed" | "add-search" | "add-configure" | "edit";

interface SavedPlacesScreenProps {
  colorMode: GlassColorMode;
  onBack: () => void;
  onRideToPlace?: (place: SavedPlace) => void;
}

export function SavedPlacesScreen({
  colorMode,
  onBack,
  onRideToPlace,
}: SavedPlacesScreenProps) {
  const d = colorMode === "dark";
  const c = GLASS_COLORS[colorMode];

  /* ── State ── */
  const { places, addPlace, updatePlace, removePlace } = useSavedPlaces();
  const [sheetMode, setSheetMode] = useState<SheetMode>("closed");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedResult, setSelectedResult] = useState<SearchResult | null>(null);
  const [editingPlace, setEditingPlace] = useState<SavedPlace | null>(null);
  const [formLabel, setFormLabel] = useState("");
  const [formIcon, setFormIcon] = useState<PlaceIcon>("star");
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  /* ── Derived ── */
  const totalCarbon = useMemo(
    () => places.reduce((sum, p) => sum + p.carbonSavedKg, 0).toFixed(1),
    [places]
  );
  const totalTrips = useMemo(
    () => places.reduce((sum, p) => sum + p.tripCount, 0),
    [places]
  );

  const filteredResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase();
    return mockSearchResults.filter(
      (r) =>
        r.name.toLowerCase().includes(q) ||
        r.address.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  /* ── Focus search on open ── */
  useEffect(() => {
    if (sheetMode === "add-search") {
      setTimeout(() => searchRef.current?.focus(), 300);
    }
  }, [sheetMode]);

  /* ── Actions ── */
  const openAdd = () => {
    setSearchQuery("");
    setSelectedResult(null);
    setFormLabel("");
    setFormIcon("star");
    setSheetMode("add-search");
  };

  const pickSearchResult = (result: SearchResult) => {
    setSelectedResult(result);
    setFormLabel(result.name);
    setFormIcon("star");
    setSheetMode("add-configure");
  };

  const saveNewPlace = () => {
    if (!selectedResult || !formLabel.trim()) return;
    addPlace({
      id: `sp-${Date.now()}`,
      label: formLabel.trim(),
      address: selectedResult.address,
      icon: formIcon,
      lat: selectedResult.lat,
      lng: selectedResult.lng,
      tripCount: 0,
      carbonSavedKg: 0,
      lastVisited: null,
    });
    setSheetMode("closed");
  };

  const openEdit = (place: SavedPlace) => {
    setEditingPlace(place);
    setFormLabel(place.label);
    setFormIcon(place.icon);
    setSheetMode("edit");
  };

  const saveEdit = () => {
    if (!editingPlace || !formLabel.trim()) return;
    updatePlace(editingPlace.id, { label: formLabel.trim(), icon: formIcon });
    setEditingPlace(null);
    setSheetMode("closed");
  };

  const confirmDelete = (id: string) => {
    removePlace(id);
    setDeleteConfirmId(null);
  };

  const closeSheet = () => {
    setSheetMode("closed");
    setEditingPlace(null);
    setSelectedResult(null);
    setSearchQuery("");
  };

  return (
    <div
      className="relative h-full w-full overflow-hidden flex flex-col"
      style={{ background: c.bg }}
    >
      {/* ── Map atmospheric background ── */}
      <div className="absolute inset-0">
        <MapCanvas variant="muted" colorMode={colorMode} />
        {d ? (
          <div className="absolute inset-0 bg-gradient-to-b from-[#0B0B0D]/70 via-[#0B0B0D]/50 to-[#0B0B0D]/90 z-[1]" />
        ) : (
          <div
            className="absolute inset-0 z-[1]"
            style={{
              background:
                "linear-gradient(to bottom, rgba(250,250,250,0.8) 0%, rgba(250,250,250,0.6) 40%, rgba(250,250,250,0.92) 100%)",
            }}
          />
        )}
      </div>

      {/* ── Header ── */}
      <div
        className="relative z-10 shrink-0 px-5 flex items-center gap-3"
        style={{
          paddingTop: "calc(env(safe-area-inset-top, 12px) + 16px)",
          paddingBottom: "12px",
        }}
      >
        <motion.button
          className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
          style={{ background: c.surface.button, backdropFilter: "blur(16px)" }}
          onClick={onBack}
          whileTap={{ scale: 0.9 }}
        >
          <ArrowLeft className="w-[18px] h-[18px]" style={{ color: c.icon.primary }} />
        </motion.button>

        <div className="flex-1">
          <span
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: "20px",
              fontWeight: 600,
              letterSpacing: "-0.03em",
              lineHeight: "1.2",
              color: c.text.display,
            }}
          >
            Saved places
          </span>
        </div>

        <motion.button
          className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
          style={{
            background: d ? "rgba(29,185,84,0.1)" : "rgba(29,185,84,0.06)",
            border: `1px solid rgba(29,185,84,${d ? "0.2" : "0.12"})`,
          }}
          onClick={openAdd}
          whileTap={{ scale: 0.9 }}
        >
          <Plus className="w-[18px] h-[18px]" style={{ color: BRAND_COLORS.green }} />
        </motion.button>
      </div>

      {/* ── Carbon summary card ── */}
      <div className="relative z-10 mx-5 mb-4">
        <CarbonSummaryCard
          colorMode={colorMode}
          variant="C"
          totalCarbonKg={parseFloat(totalCarbon)}
          totalTrips={totalTrips}
          totalPlaces={places.length}
        />
      </div>

      {/* ── Places list ── */}
      <div className="relative z-10 flex-1 overflow-y-auto px-5 pb-4 scrollbar-hide">
        {places.length === 0 ? (
          /* Empty state */
          <motion.div
            className="flex flex-col items-center justify-center h-full py-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
              style={{ background: c.surface.subtle }}
            >
              <MapPin className="w-7 h-7" style={{ color: c.icon.muted }} />
            </div>
            <span
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "17px",
                fontWeight: 600,
                letterSpacing: "-0.02em",
                lineHeight: "1.3",
                color: c.text.primary,
              }}
            >
              No saved places yet
            </span>
            <span
              className="mt-1 text-center max-w-[240px]"
              style={{ ...GLASS_TYPE.bodySmall, color: c.text.muted }}
            >
              Save your frequent destinations for quicker booking
            </span>
            <motion.button
              className="mt-5 flex items-center gap-2 px-5 py-3 rounded-xl"
              style={{ background: BRAND_COLORS.green }}
              onClick={openAdd}
              whileTap={{ scale: 0.97 }}
            >
              <Plus className="w-4 h-4" style={{ color: "#fff" }} />
              <span style={{ ...GLASS_TYPE.small, fontWeight: 600, color: "#fff" }}>
                Add a place
              </span>
            </motion.button>
          </motion.div>
        ) : (
          <div className="space-y-2">
            {places.map((place, i) => {
              const Icon = ICON_MAP[place.icon] || Star;
              const isDeleting = deleteConfirmId === place.id;

              return (
                <motion.div
                  key={place.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100, height: 0 }}
                  transition={{ ...MOTION.standard, delay: i * MOTION.stagger }}
                  layout
                >
                  <GlassPanel
                    variant={d ? "dark" : "light"}
                    blur={16}
                    className="rounded-2xl overflow-hidden"
                  >
                    <AnimatePresence mode="wait">
                      {isDeleting ? (
                        /* ── Delete confirmation inline ── */
                        <motion.div
                          key="delete"
                          className="px-4 py-4 flex items-center gap-3"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={MOTION.micro}
                        >
                          <div
                            className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                            style={{
                              background: d ? "rgba(212,24,61,0.1)" : "rgba(212,24,61,0.06)",
                            }}
                          >
                            <Trash2 className="w-4 h-4" style={{ color: BRAND_COLORS.error }} />
                          </div>
                          <div className="flex-1">
                            <span style={{ ...GLASS_TYPE.bodySmall, color: c.text.primary }}>
                              Remove "{place.label}"?
                            </span>
                            <div style={{ ...GLASS_TYPE.caption, color: c.text.muted }}>
                              This can't be undone
                            </div>
                          </div>
                          <div className="flex gap-2 shrink-0">
                            <motion.button
                              className="px-3 py-2 rounded-lg"
                              style={{ background: c.surface.subtle }}
                              onClick={() => setDeleteConfirmId(null)}
                              whileTap={{ scale: 0.95 }}
                            >
                              <span style={{ ...GLASS_TYPE.caption, color: c.text.muted }}>
                                Cancel
                              </span>
                            </motion.button>
                            <motion.button
                              className="px-3 py-2 rounded-lg"
                              style={{
                                background: d ? "rgba(212,24,61,0.15)" : "rgba(212,24,61,0.1)",
                              }}
                              onClick={() => confirmDelete(place.id)}
                              whileTap={{ scale: 0.95 }}
                            >
                              <span style={{ ...GLASS_TYPE.caption, fontWeight: 600, color: BRAND_COLORS.error }}>
                                Delete
                              </span>
                            </motion.button>
                          </div>
                        </motion.div>
                      ) : (
                        /* ── Normal place row ── */
                        <motion.div
                          key="normal"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={MOTION.micro}
                        >
                          <motion.button
                            className="w-full px-4 py-3.5 flex items-center gap-3 text-left"
                            onClick={() => onRideToPlace?.(place)}
                            whileTap={{ scale: 0.98 }}
                          >
                            <div
                              className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                              style={{ background: c.green.tint }}
                            >
                              <Icon className="w-4 h-4" style={{ color: BRAND_COLORS.green }} />
                            </div>

                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-1.5">
                                <span
                                  className="truncate"
                                  style={{ ...GLASS_TYPE.body, color: c.text.primary }}
                                >
                                  {place.label}
                                </span>
                                {place.carbonSavedKg > 0 && (
                                  <div className="flex items-center gap-0.5 shrink-0">
                                    <Leaf className="w-2.5 h-2.5" style={{ color: BRAND_COLORS.green }} />
                                    <span
                                      style={{
                                        ...GLASS_TYPE.caption,
                                        fontSize: "9px",
                                        color: c.green.evText,
                                      }}
                                    >
                                      {place.carbonSavedKg}kg
                                    </span>
                                  </div>
                                )}
                              </div>
                              <div
                                className="truncate"
                                style={{ ...GLASS_TYPE.caption, color: c.text.muted }}
                              >
                                {place.address}
                              </div>
                              <div className="flex items-center gap-2 mt-0.5">
                                {place.lastVisited && (
                                  <span
                                    style={{ ...GLASS_TYPE.caption, fontSize: "10px", color: c.text.faint }}
                                  >
                                    {place.lastVisited}
                                  </span>
                                )}
                                {place.tripCount > 0 && (
                                  <>
                                    <span
                                      style={{ ...GLASS_TYPE.caption, fontSize: "10px", color: c.text.ghost }}
                                    >
                                      ·
                                    </span>
                                    <span
                                      style={{ ...GLASS_TYPE.caption, fontSize: "10px", color: c.text.faint }}
                                    >
                                      {place.tripCount} trips
                                    </span>
                                  </>
                                )}
                              </div>
                            </div>

                            <ChevronRight className="w-4 h-4 shrink-0" style={{ color: c.icon.muted }} />
                          </motion.button>

                          {/* Quick action row */}
                          <div
                            className="flex items-center px-4 pb-3 gap-2"
                          >
                            <motion.button
                              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg"
                              style={{ background: c.surface.subtle }}
                              onClick={(e) => {
                                e.stopPropagation();
                                onRideToPlace?.(place);
                              }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <Navigation className="w-3 h-3" style={{ color: BRAND_COLORS.green }} />
                              <span style={{ ...GLASS_TYPE.caption, color: BRAND_COLORS.green }}>
                                Ride here
                              </span>
                            </motion.button>
                            <motion.button
                              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg"
                              style={{ background: c.surface.subtle }}
                              onClick={(e) => {
                                e.stopPropagation();
                                openEdit(place);
                              }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <Pencil className="w-3 h-3" style={{ color: c.icon.muted }} />
                              <span style={{ ...GLASS_TYPE.caption, color: c.text.muted }}>
                                Edit
                              </span>
                            </motion.button>
                            <motion.button
                              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg"
                              style={{ background: c.surface.subtle }}
                              onClick={(e) => {
                                e.stopPropagation();
                                setDeleteConfirmId(place.id);
                              }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <Trash2 className="w-3 h-3" style={{ color: c.icon.muted }} />
                              <span style={{ ...GLASS_TYPE.caption, color: c.text.muted }}>
                                Remove
                              </span>
                            </motion.button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </GlassPanel>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Sheet overlay ── */}
      <AnimatePresence>
        {sheetMode !== "closed" && (
          <>
            <motion.div
              className="absolute inset-0 z-30"
              style={{ background: d ? "rgba(0,0,0,0.5)" : "rgba(0,0,0,0.15)" }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeSheet}
            />
            <motion.div
              className="absolute bottom-0 left-0 right-0 z-40 flex flex-col"
              style={{ maxHeight: "85vh" }}
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 350, damping: 30 }}
            >
              <GlassPanel
                variant={d ? "dark" : "light"}
                blur={24}
                className="rounded-t-3xl flex flex-col overflow-hidden"
                style={{ maxHeight: "85vh" }}
              >
                {/* ── ADD: Search step ── */}
                {sheetMode === "add-search" && (
                  <>
                    <div className="px-5 pt-5 pb-3 shrink-0">
                      <div className="flex items-center justify-between mb-4">
                        <span
                          style={{
                            fontFamily: "var(--font-heading)",
                            fontSize: "18px",
                            fontWeight: 600,
                            letterSpacing: "-0.02em",
                            lineHeight: "1.2",
                            color: c.text.primary,
                          }}
                        >
                          Add a place
                        </span>
                        <motion.button
                          className="w-8 h-8 rounded-full flex items-center justify-center"
                          style={{ background: c.surface.subtle }}
                          onClick={closeSheet}
                          whileTap={{ scale: 0.9 }}
                        >
                          <X className="w-4 h-4" style={{ color: c.icon.secondary }} />
                        </motion.button>
                      </div>

                      {/* Search input */}
                      <div
                        className="flex items-center gap-2.5 px-4 py-3 rounded-xl"
                        style={{
                          background: c.surface.subtle,
                          border: `1px solid ${c.surface.hover}`,
                        }}
                      >
                        <Search className="w-4 h-4 shrink-0" style={{ color: c.icon.muted }} />
                        <input
                          ref={searchRef}
                          type="text"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          placeholder="Search for a place..."
                          className="flex-1 bg-transparent outline-none"
                          style={{ ...GLASS_TYPE.bodySmall, color: c.text.primary }}
                        />
                        {searchQuery && (
                          <motion.button
                            onClick={() => setSearchQuery("")}
                            whileTap={{ scale: 0.9 }}
                          >
                            <X className="w-3.5 h-3.5" style={{ color: c.icon.muted }} />
                          </motion.button>
                        )}
                      </div>
                    </div>

                    {/* Search results */}
                    <div
                      className="flex-1 overflow-y-auto px-5 pb-5 scrollbar-hide"
                      style={{ paddingBottom: "max(env(safe-area-inset-bottom, 16px), 16px)" }}
                    >
                      {searchQuery.trim() === "" ? (
                        <div className="py-8 text-center">
                          <span style={{ ...GLASS_TYPE.bodySmall, color: c.text.faint }}>
                            Type to search for a location
                          </span>
                        </div>
                      ) : filteredResults.length === 0 ? (
                        <div className="py-8 text-center">
                          <span style={{ ...GLASS_TYPE.bodySmall, color: c.text.faint }}>
                            No results for "{searchQuery}"
                          </span>
                        </div>
                      ) : (
                        <div className="space-y-1">
                          {filteredResults.map((result, i) => (
                            <motion.button
                              key={result.id}
                              className="w-full flex items-center gap-3 py-3 text-left"
                              style={{
                                borderBottom:
                                  i < filteredResults.length - 1
                                    ? `1px solid ${c.surface.hover}`
                                    : "none",
                              }}
                              onClick={() => pickSearchResult(result)}
                              whileTap={{ scale: 0.98 }}
                              initial={{ opacity: 0, y: 6 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ ...MOTION.micro, delay: i * 0.03 }}
                            >
                              <div
                                className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                                style={{ background: c.surface.subtle }}
                              >
                                <MapPin className="w-4 h-4" style={{ color: c.icon.secondary }} />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="truncate" style={{ ...GLASS_TYPE.bodySmall, color: c.text.primary }}>
                                  {result.name}
                                </div>
                                <div className="truncate" style={{ ...GLASS_TYPE.caption, color: c.text.muted }}>
                                  {result.address}
                                </div>
                              </div>
                              <ChevronRight className="w-4 h-4 shrink-0" style={{ color: c.icon.muted }} />
                            </motion.button>
                          ))}
                        </div>
                      )}
                    </div>
                  </>
                )}

                {/* ── ADD: Configure step (label + icon) ── */}
                {sheetMode === "add-configure" && selectedResult && (
                  <div
                    className="px-5 pt-5 pb-5"
                    style={{ paddingBottom: "max(env(safe-area-inset-bottom, 24px), 24px)" }}
                  >
                    <div className="flex items-center justify-between mb-5">
                      <div className="flex items-center gap-3">
                        <motion.button
                          className="w-8 h-8 rounded-full flex items-center justify-center"
                          style={{ background: c.surface.subtle }}
                          onClick={() => setSheetMode("add-search")}
                          whileTap={{ scale: 0.9 }}
                        >
                          <ArrowLeft className="w-4 h-4" style={{ color: c.icon.secondary }} />
                        </motion.button>
                        <span
                          style={{
                            fontFamily: "var(--font-heading)",
                            fontSize: "18px",
                            fontWeight: 600,
                            letterSpacing: "-0.02em",
                            lineHeight: "1.2",
                            color: c.text.primary,
                          }}
                        >
                          Save place
                        </span>
                      </div>
                      <motion.button
                        className="w-8 h-8 rounded-full flex items-center justify-center"
                        style={{ background: c.surface.subtle }}
                        onClick={closeSheet}
                        whileTap={{ scale: 0.9 }}
                      >
                        <X className="w-4 h-4" style={{ color: c.icon.secondary }} />
                      </motion.button>
                    </div>

                    {/* Selected address preview */}
                    <div
                      className="flex items-center gap-3 px-4 py-3 rounded-xl mb-5"
                      style={{ background: c.surface.subtle }}
                    >
                      <MapPin className="w-4 h-4 shrink-0" style={{ color: BRAND_COLORS.green }} />
                      <div className="flex-1 min-w-0">
                        <div className="truncate" style={{ ...GLASS_TYPE.bodySmall, color: c.text.primary }}>
                          {selectedResult.name}
                        </div>
                        <div className="truncate" style={{ ...GLASS_TYPE.caption, color: c.text.muted }}>
                          {selectedResult.address}
                        </div>
                      </div>
                    </div>

                    {/* Label input */}
                    <div className="mb-5">
                      <span
                        style={{ ...GLASS_TYPE.label, color: c.text.faint, display: "block", marginBottom: "8px" }}
                      >
                        Label
                      </span>
                      <input
                        type="text"
                        value={formLabel}
                        onChange={(e) => setFormLabel(e.target.value)}
                        placeholder="e.g. Home, Office, Gym..."
                        className="w-full px-4 py-3 rounded-xl bg-transparent outline-none"
                        style={{
                          ...GLASS_TYPE.body,
                          color: c.text.primary,
                          background: c.surface.subtle,
                          border: `1px solid ${c.surface.hover}`,
                        }}
                      />
                    </div>

                    {/* Icon picker */}
                    <div className="mb-6">
                      <span
                        style={{ ...GLASS_TYPE.label, color: c.text.faint, display: "block", marginBottom: "10px" }}
                      >
                        Icon
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {ICON_OPTIONS.map(({ id, label }) => {
                          const IconComp = ICON_MAP[id];
                          const selected = formIcon === id;
                          return (
                            <motion.button
                              key={id}
                              className="flex items-center gap-1.5 px-3 py-2 rounded-xl"
                              style={{
                                background: selected
                                  ? d ? "rgba(29,185,84,0.12)" : "rgba(29,185,84,0.08)"
                                  : c.surface.subtle,
                                border: selected
                                  ? `1px solid rgba(29,185,84,${d ? "0.25" : "0.18"})`
                                  : "1px solid transparent",
                              }}
                              onClick={() => setFormIcon(id)}
                              whileTap={{ scale: 0.95 }}
                            >
                              <IconComp
                                className="w-3.5 h-3.5"
                                style={{ color: selected ? BRAND_COLORS.green : c.icon.muted }}
                              />
                              <span
                                style={{
                                  ...GLASS_TYPE.caption,
                                  fontWeight: selected ? 600 : 500,
                                  color: selected ? BRAND_COLORS.green : c.text.secondary,
                                }}
                              >
                                {label}
                              </span>
                            </motion.button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Save button */}
                    <motion.button
                      className="w-full py-3.5 rounded-xl flex items-center justify-center gap-2 relative overflow-hidden"
                      style={{
                        background: formLabel.trim() ? BRAND_COLORS.green : c.surface.subtle,
                        opacity: formLabel.trim() ? 1 : 0.5,
                      }}
                      onClick={formLabel.trim() ? saveNewPlace : undefined}
                      whileTap={formLabel.trim() ? { scale: 0.98 } : undefined}
                    >
                      {formLabel.trim() && (
                        <motion.div
                          className="absolute inset-0"
                          style={{
                            background:
                              "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.12) 50%, transparent 60%)",
                          }}
                          animate={{ x: ["-100%", "200%"] }}
                          transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 4, ease: "linear" }}
                        />
                      )}
                      <Check className="w-4 h-4 relative z-10" style={{ color: formLabel.trim() ? "#fff" : c.icon.muted }} />
                      <span
                        className="relative z-10"
                        style={{
                          ...GLASS_TYPE.small,
                          fontWeight: 600,
                          color: formLabel.trim() ? "#fff" : c.text.muted,
                        }}
                      >
                        Save place
                      </span>
                    </motion.button>
                  </div>
                )}

                {/* ── EDIT ── */}
                {sheetMode === "edit" && editingPlace && (
                  <div
                    className="px-5 pt-5 pb-5"
                    style={{ paddingBottom: "max(env(safe-area-inset-bottom, 24px), 24px)" }}
                  >
                    <div className="flex items-center justify-between mb-5">
                      <span
                        style={{
                          fontFamily: "var(--font-heading)",
                          fontSize: "18px",
                          fontWeight: 600,
                          letterSpacing: "-0.02em",
                          lineHeight: "1.2",
                          color: c.text.primary,
                        }}
                      >
                        Edit place
                      </span>
                      <motion.button
                        className="w-8 h-8 rounded-full flex items-center justify-center"
                        style={{ background: c.surface.subtle }}
                        onClick={closeSheet}
                        whileTap={{ scale: 0.9 }}
                      >
                        <X className="w-4 h-4" style={{ color: c.icon.secondary }} />
                      </motion.button>
                    </div>

                    {/* Address (non-editable) */}
                    <div
                      className="flex items-center gap-3 px-4 py-3 rounded-xl mb-5"
                      style={{ background: c.surface.subtle }}
                    >
                      <MapPin className="w-4 h-4 shrink-0" style={{ color: BRAND_COLORS.green }} />
                      <div className="flex-1 min-w-0">
                        <div className="truncate" style={{ ...GLASS_TYPE.bodySmall, color: c.text.primary }}>
                          {editingPlace.address}
                        </div>
                      </div>
                    </div>

                    {/* Label */}
                    <div className="mb-5">
                      <span
                        style={{ ...GLASS_TYPE.label, color: c.text.faint, display: "block", marginBottom: "8px" }}
                      >
                        Label
                      </span>
                      <input
                        type="text"
                        value={formLabel}
                        onChange={(e) => setFormLabel(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl bg-transparent outline-none"
                        style={{
                          ...GLASS_TYPE.body,
                          color: c.text.primary,
                          background: c.surface.subtle,
                          border: `1px solid ${c.surface.hover}`,
                        }}
                      />
                    </div>

                    {/* Icon picker */}
                    <div className="mb-6">
                      <span
                        style={{ ...GLASS_TYPE.label, color: c.text.faint, display: "block", marginBottom: "10px" }}
                      >
                        Icon
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {ICON_OPTIONS.map(({ id, label }) => {
                          const IconComp = ICON_MAP[id];
                          const selected = formIcon === id;
                          return (
                            <motion.button
                              key={id}
                              className="flex items-center gap-1.5 px-3 py-2 rounded-xl"
                              style={{
                                background: selected
                                  ? d ? "rgba(29,185,84,0.12)" : "rgba(29,185,84,0.08)"
                                  : c.surface.subtle,
                                border: selected
                                  ? `1px solid rgba(29,185,84,${d ? "0.25" : "0.18"})`
                                  : "1px solid transparent",
                              }}
                              onClick={() => setFormIcon(id)}
                              whileTap={{ scale: 0.95 }}
                            >
                              <IconComp
                                className="w-3.5 h-3.5"
                                style={{ color: selected ? BRAND_COLORS.green : c.icon.muted }}
                              />
                              <span
                                style={{
                                  ...GLASS_TYPE.caption,
                                  fontWeight: selected ? 600 : 500,
                                  color: selected ? BRAND_COLORS.green : c.text.secondary,
                                }}
                              >
                                {label}
                              </span>
                            </motion.button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Carbon stat for this place */}
                    {editingPlace.carbonSavedKg > 0 && (
                      <div
                        className="flex items-center gap-2 px-4 py-3 rounded-xl mb-5"
                        style={{
                          background: d ? "rgba(29,185,84,0.06)" : "rgba(29,185,84,0.03)",
                          border: `1px solid rgba(29,185,84,${d ? "0.1" : "0.06"})`,
                        }}
                      >
                        <Leaf className="w-3.5 h-3.5" style={{ color: BRAND_COLORS.green }} />
                        <span style={{ ...GLASS_TYPE.caption, color: BRAND_COLORS.green }}>
                          {editingPlace.carbonSavedKg} kg CO₂ saved across {editingPlace.tripCount} trips here
                        </span>
                      </div>
                    )}

                    {/* Save button */}
                    <motion.button
                      className="w-full py-3.5 rounded-xl flex items-center justify-center gap-2"
                      style={{
                        background: formLabel.trim() ? BRAND_COLORS.green : c.surface.subtle,
                        opacity: formLabel.trim() ? 1 : 0.5,
                      }}
                      onClick={formLabel.trim() ? saveEdit : undefined}
                      whileTap={formLabel.trim() ? { scale: 0.98 } : undefined}
                    >
                      <Check className="w-4 h-4" style={{ color: formLabel.trim() ? "#fff" : c.icon.muted }} />
                      <span
                        style={{
                          ...GLASS_TYPE.small,
                          fontWeight: 600,
                          color: formLabel.trim() ? "#fff" : c.text.muted,
                        }}
                      >
                        Save changes
                      </span>
                    </motion.button>
                  </div>
                )}
              </GlassPanel>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}