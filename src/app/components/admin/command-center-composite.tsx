 /**
 * ADMIN COMMAND CENTER — COMPOSITE: "THE NERVE" v7
 *
 * 3-level Google Maps-style drill UX:
 *   Level 1 — National: state pins. Single-click = state briefing. Double-click = drill in.
 *   Level 2 — State: zone pins + entity count badges. Single-click = zone detail. Double-click = drill in.
 *   Level 3 — Zone: individual entity pins (drivers, riders, hotels, fleet). Single-click = entity detail.
 *
 * Entity filter lives in the DECISION PANEL (contextual), not the header.
 * When state is drilled → panel shows entity filter tabs + zone overview with counts.
 * Zone pins display entity count badges matching the active filter.
 *
 * Layout:
 *   RAIL | HEADER BAR (full width)
 *        | KPI STRIP  (full width, anchored)
 *        | ALERT BAR (map width) | DECISION PANEL
 *        | MAP CANVAS            | (contextual: queue/briefing/entity filter/detail)
 *        |                       | FOOTER TABS
 *        | LIVE FEED BAR (full width)
 */

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useNavigate } from "react-router";
import {
  Activity, Users, MapPin, Wallet, Clock, Shield, Zap,
  TrendingUp, Search, Bell, AlertTriangle, ChevronRight,
  Plus, Minus, RotateCcw, ArrowLeft, Eye, AlertCircle,
  Flame, Globe, Radio, Settings, CreditCard, CheckCircle2,
  XCircle, Scale, Building2, Car, Star, Navigation, User,
  Layers,
} from "lucide-react";
import {
  HEALTH_METRICS, ACTION_QUEUE, ACTIVITY_FEED,
  VERIFICATION_PIPELINE, DISPUTE_SUMMARY, FINANCE_SUMMARY,
  ZONE_MAP_POSITIONS, ZONE_CONNECTIONS,
  STATE_DATA, NATIONAL_METRICS,
  STATE_ZONE_DATA, STATE_ZONE_CONNECTIONS,
  HOTEL_METRICS, FLEET_METRICS,
  HOTEL_PIN_DATA, FLEET_PIN_DATA,
  ZONE_ENTITIES,
  RIDER_METRICS,
  DISPUTE_BY_STATE, DISPUTE_BY_ZONE,
  REVENUE_BY_STATE, REVENUE_BY_ZONE,
  formatNaira,
} from "../../config/admin-mock-data";
import type { ZoneEntityPin, ActionItem } from "../../config/admin-mock-data";
import {
  useAdminTheme, TY, BRAND, STATUS,
  demandColor, stateStatusColor,
} from "../../config/admin-theme";
import type { AdminTheme } from "../../config/admin-theme";
import {
  KPICard, StatusBadge, SegmentedBar, StageRow, StatTile,
  ActionQueueItem, PriorityIcon, FeedIcon, ThemeToggle,
  DiagnosticCard, SectionLabel, ActionRow, CTAButton,
} from "./ui/primitives";
import { CommandCenterOnboarding, type OnboardingVariation } from "./command-center-onboarding";
import { CCv2Onboarding } from "./cc-v2-onboarding";
import {
  buildKPIGroups, KPIStrip as V2KPIStrip, DecisionsPanel as V2DecisionsPanel,
  ActionDrawer as V2ActionDrawer,
} from "./cc-v2-active";
import type { KPIGroup } from "./cc-v2-active";


/* ═══════════════════════════════════════════════════════════════════════════
   ENTITY HELPERS
   ═══════════════════════════════════════════════════════════════════════════ */
type EntityFilter = "all" | "riders" | "drivers" | "hotels" | "fleet";

function entityColor(type: string): string {
  switch (type) {
    case "driver": return BRAND.green;
    case "rider": return "#8B5CF6";
    case "hotel": return STATUS.info;
    case "fleet": return "#F59E0B";
    default: return BRAND.green;
  }
}
function entityIcon(type: string): string {
  switch (type) {
    case "driver": return "D";
    case "rider": return "R";
    case "hotel": return "H";
    case "fleet": return "F";
    default: return "?";
  }
}
const ENTITY_FILTER_OPTIONS: { id: EntityFilter; label: string; icon: typeof Activity; color: string }[] = [
  { id: "all", label: "All", icon: Layers, color: BRAND.green },
  { id: "drivers", label: "Drivers", icon: Car, color: BRAND.green },
  { id: "riders", label: "Riders", icon: Navigation, color: "#8B5CF6" },
  { id: "hotels", label: "Hotels", icon: Building2, color: STATUS.info },
  { id: "fleet", label: "Fleet", icon: Car, color: "#F59E0B" },
];

/** Compute entity counts per zone for a given filter */
function getZoneEntityCounts(zoneName: string, filter: EntityFilter): { total: number; drivers: number; riders: number; hotels: number; fleet: number } {
  const ents = ZONE_ENTITIES[zoneName] || [];
  const counts = { total: ents.length, drivers: 0, riders: 0, hotels: 0, fleet: 0 };
  ents.forEach(e => {
    if (e.type === "driver") counts.drivers++;
    else if (e.type === "rider") counts.riders++;
    else if (e.type === "hotel") counts.hotels++;
    else if (e.type === "fleet") counts.fleet++;
  });
  return counts;
}

function getEntityCountForFilter(zoneName: string, filter: EntityFilter): number {
  const c = getZoneEntityCounts(zoneName, filter);
  if (filter === "all") return c.total;
  if (filter === "drivers") return c.drivers;
  if (filter === "riders") return c.riders;
  if (filter === "hotels") return c.hotels;
  if (filter === "fleet") return c.fleet;
  return c.total;
}

/** Compute entity-specific operational metrics from ZONE_ENTITIES for a single zone */
interface ZoneEntityMetrics {
  driverTotal: number; driverActive: number; driverIdle: number; driverEnRoute: number;
  driverAvgRating: number; driverEVCount: number;
  riderTotal: number; riderInRide: number; riderMatched: number; riderWaiting: number;
  riderAvgTrips: number;
  hotelTotal: number; hotelTotalRooms: number; hotelAvgRating: number; hotelTiers: string[];
  fleetTotal: number; fleetTotalVehicles: number; fleetDriversOnline: number; fleetAvgUtilization: number;
}

function getZoneEntityMetrics(zoneName: string): ZoneEntityMetrics {
  const ents = ZONE_ENTITIES[zoneName] || [];
  const drivers = ents.filter(e => e.type === "driver");
  const riders = ents.filter(e => e.type === "rider");
  const hotels = ents.filter(e => e.type === "hotel");
  const fleet = ents.filter(e => e.type === "fleet");
  return {
    driverTotal: drivers.length, driverActive: drivers.filter(d => d.status === "active").length,
    driverIdle: drivers.filter(d => d.status === "idle").length, driverEnRoute: drivers.filter(d => d.status === "en-route").length,
    driverAvgRating: drivers.length > 0 ? +(drivers.reduce((s, d) => s + (d.rating || 0), 0) / drivers.length).toFixed(1) : 0,
    driverEVCount: drivers.filter(d => d.vehicleType === "EV").length,
    riderTotal: riders.length, riderInRide: riders.filter(r => r.tripStatus === "in-ride").length,
    riderMatched: riders.filter(r => r.tripStatus === "matched").length, riderWaiting: riders.filter(r => r.tripStatus === "waiting").length,
    riderAvgTrips: riders.length > 0 ? Math.round(riders.reduce((s, r) => s + (r.trips || 0), 0) / riders.length) : 0,
    hotelTotal: hotels.length, hotelTotalRooms: hotels.reduce((s, h) => s + (h.rooms || 0), 0),
    hotelAvgRating: hotels.length > 0 ? +(hotels.reduce((s, h) => s + (h.guestRating || 0), 0) / hotels.length).toFixed(1) : 0,
    hotelTiers: [...new Set(hotels.map(h => h.tier || "—"))],
    fleetTotal: fleet.length, fleetTotalVehicles: fleet.reduce((s, f) => s + (f.vehicles || 0), 0),
    fleetDriversOnline: fleet.reduce((s, f) => s + (f.driversOnline || 0), 0),
    fleetAvgUtilization: fleet.length > 0 ? +(fleet.reduce((s, f) => s + (f.utilization || 0), 0) / fleet.length).toFixed(0) : 0,
  };
}

function getStateEntityMetrics(stateName: string): ZoneEntityMetrics {
  const zones = stateName === "Lagos" ? ZONE_MAP_POSITIONS : (STATE_ZONE_DATA[stateName] || []);
  const agg: ZoneEntityMetrics = {
    driverTotal: 0, driverActive: 0, driverIdle: 0, driverEnRoute: 0, driverAvgRating: 0, driverEVCount: 0,
    riderTotal: 0, riderInRide: 0, riderMatched: 0, riderWaiting: 0, riderAvgTrips: 0,
    hotelTotal: 0, hotelTotalRooms: 0, hotelAvgRating: 0, hotelTiers: [],
    fleetTotal: 0, fleetTotalVehicles: 0, fleetDriversOnline: 0, fleetAvgUtilization: 0,
  };
  const zoneMetrics = zones.map(z => getZoneEntityMetrics(z.name));
  zoneMetrics.forEach(zm => {
    agg.driverTotal += zm.driverTotal; agg.driverActive += zm.driverActive;
    agg.driverIdle += zm.driverIdle; agg.driverEnRoute += zm.driverEnRoute; agg.driverEVCount += zm.driverEVCount;
    agg.riderTotal += zm.riderTotal; agg.riderInRide += zm.riderInRide;
    agg.riderMatched += zm.riderMatched; agg.riderWaiting += zm.riderWaiting;
    agg.hotelTotal += zm.hotelTotal; agg.hotelTotalRooms += zm.hotelTotalRooms;
    zm.hotelTiers.forEach(tier => { if (!agg.hotelTiers.includes(tier)) agg.hotelTiers.push(tier); });
    agg.fleetTotal += zm.fleetTotal; agg.fleetTotalVehicles += zm.fleetTotalVehicles;
    agg.fleetDriversOnline += zm.fleetDriversOnline;
  });
  const dz = zoneMetrics.filter(z => z.driverTotal > 0);
  agg.driverAvgRating = dz.length > 0 ? +(dz.reduce((s, z) => s + z.driverAvgRating, 0) / dz.length).toFixed(1) : 0;
  const rz = zoneMetrics.filter(z => z.riderTotal > 0);
  agg.riderAvgTrips = rz.length > 0 ? Math.round(rz.reduce((s, z) => s + z.riderAvgTrips, 0) / rz.length) : 0;
  const fz = zoneMetrics.filter(z => z.fleetTotal > 0);
  agg.fleetAvgUtilization = fz.length > 0 ? +Math.round(fz.reduce((s, z) => s + z.fleetAvgUtilization, 0) / fz.length) : 0;
  const hz = zoneMetrics.filter(z => z.hotelTotal > 0);
  agg.hotelAvgRating = hz.length > 0 ? +(hz.reduce((s, z) => s + z.hotelAvgRating, 0) / hz.length).toFixed(1) : 0;
  return agg;
}

/** Get entity-contextual subtitle for a zone row based on active filter */
function getZoneSubtitle(zoneName: string, filter: EntityFilter, fallbackDrivers: number, fallbackRides: number, fallbackMatch: number): string {
  if (filter === "all" || filter === "drivers") {
    const zm = getZoneEntityMetrics(zoneName);
    if (filter === "drivers") {
      return `${zm.driverActive} active · ${zm.driverIdle} idle · ★${zm.driverAvgRating}`;
    }
    // "All" — show balanced summary across entity types
    const parts = [`${fallbackDrivers} drivers`, `${fallbackRides} rides`, `${fallbackMatch}s match`];
    if (zm.hotelTotal > 0) parts.push(`${zm.hotelTotal} hotel${zm.hotelTotal > 1 ? "s" : ""}`);
    if (zm.fleetTotal > 0) parts.push(`${zm.fleetTotal} fleet`);
    return parts.join(" · ");
  }
  const zm = getZoneEntityMetrics(zoneName);
  if (filter === "riders") return `${zm.riderInRide} in-ride · ${zm.riderWaiting} waiting · ${zm.riderAvgTrips} avg trips`;
  if (filter === "hotels") return zm.hotelTotal > 0 ? `${zm.hotelTotalRooms} rooms · ★${zm.hotelAvgRating} · ${zm.hotelTiers.join(", ")}` : "No hotels in zone";
  if (filter === "fleet") return zm.fleetTotal > 0 ? `${zm.fleetTotalVehicles} vehicles · ${zm.fleetDriversOnline} online · ${zm.fleetAvgUtilization}% util` : "No fleet in zone";
  return `${fallbackDrivers} drivers · ${fallbackRides} rides`;
}


/* ═══════════════════════════════════════════════════════════════════════════
   MAP OUTLINES (theme-aware SVG sub-components)
   ═══════════════════════════════════════════════════════════════════════════ */

function NigeriaOutline() {
  const { t } = useAdminTheme();
  return (
    <g>
      <path
        d="M 60,55 Q 70,42 95,35 Q 140,25 180,22 Q 220,20 260,18 Q 300,16 340,22 Q 370,26 395,35 Q 415,42 430,55 Q 442,68 448,85 Q 452,100 455,120 Q 458,140 452,160 Q 448,175 440,188 Q 435,198 425,210 Q 418,220 410,235 Q 400,252 385,268 Q 370,282 352,295 Q 338,308 320,320 Q 305,330 290,342 Q 272,355 255,362 Q 238,370 220,375 Q 200,380 180,382 Q 165,384 150,378 Q 135,372 120,362 Q 108,354 98,342 Q 88,328 82,312 Q 76,296 72,280 Q 68,264 65,248 Q 62,232 58,215 Q 54,198 52,180 Q 50,162 48,142 Q 46,122 48,102 Q 50,82 55,68 Z"
        fill={t.mapOutlineFill}
        stroke={t.mapOutline}
        strokeWidth="1"
      />
      <path d="M 55,150 Q 100,160 150,180 Q 200,200 250,230 Q 280,248 310,270" fill="none" stroke={t.mapWater} strokeWidth="2" strokeLinecap="round" />
      <path d="M 250,230 Q 300,220 350,215 Q 400,210 440,198" fill="none" stroke={t.mapWater} strokeWidth="1.5" strokeLinecap="round" opacity={0.6} />
      <path d="M 150,378 Q 170,385 200,390 Q 230,394 260,388 Q 280,382 290,370" fill={t.mapWater} stroke={t.mapWater} strokeWidth="1" opacity={0.5} />
      <text x="120" y="60" fill={t.mapLabel} fontSize="7" fontFamily="var(--font-body)" fontWeight="500" letterSpacing="0.12em">NORTH</text>
      <text x="250" y="340" fill={t.mapLabel} fontSize="7" fontFamily="var(--font-body)" fontWeight="500" letterSpacing="0.12em">SOUTH</text>
    </g>
  );
}

function LagosDetailMap() {
  const { t } = useAdminTheme();
  return (
    <g>
      <path d="M0,320 Q60,295 120,310 Q180,325 220,315 Q280,300 340,308 Q400,316 460,305 Q520,294 580,310 Q640,326 700,315 L700,360 Q640,380 580,370 Q520,362 460,375 Q400,385 340,372 Q280,365 220,380 Q160,392 100,378 Q50,368 0,380 Z" fill={t.mapWater} stroke={t.mapOutline} strokeWidth="0.5" />
      <path d="M0,410 Q100,395 200,405 Q300,415 400,400 Q500,390 600,402 Q650,408 700,395 L700,500 L0,500 Z" fill={t.mapWater} stroke={t.mapOutline} strokeWidth="0.5" opacity={0.6} />
      <path d="M280,190 Q295,240 310,280 Q320,310 335,340" fill="none" stroke={t.mapRoute} strokeWidth="2.5" strokeLinecap="round" />
      <path d="M110,300 Q140,310 175,325 Q200,335 220,340" fill="none" stroke={t.mapRoute} strokeWidth="2" strokeLinecap="round" />
      <path d="M310,350 Q370,365 440,368 Q510,370 580,372 Q640,374 700,375" fill="none" stroke={t.mapRoute} strokeWidth="2" strokeLinecap="round" />
      <path d="M200,0 Q198,40 196,80 Q194,120 196,155 Q198,180 200,200" fill="none" stroke={t.mapRoute} strokeWidth="2" strokeLinecap="round" />
      <text x="350" y="320" fill={t.mapLabel} fontSize="6" fontFamily="var(--font-body)" fontWeight="500" letterSpacing="0.12em">LAGOON</text>
    </g>
  );
}


/* ═════════════════════════════════════════════════════════════════════��═════
   ZONE PIN with entity count badge (SVG sub-component)
   ═══════════════════════════════════════════════════════════════════════════ */
function ZonePinSVG({ zone, cx, cy, col, r, isHov, isSel, entityFilter, theme, t, onHover, onLeave, onClick, onDoubleClick }: {
  zone: { name: string; drivers: number; demandLevel: string; surgeMultiplier?: number };
  cx: number; cy: number; col: string; r: number; isHov: boolean; isSel: boolean;
  entityFilter: EntityFilter;
  theme: AdminTheme;
  t: any;
  onHover: () => void; onLeave: () => void; onClick: (e: React.MouseEvent) => void; onDoubleClick: () => void;
}) {
  const entCount = getEntityCountForFilter(zone.name, entityFilter);
  const filterColor = ENTITY_FILTER_OPTIONS.find(f => f.id === entityFilter)?.color || BRAND.green;
  const showBadge = entityFilter !== "all" && entCount > 0;

  return (
    <g
      style={{ cursor: "pointer" }}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      onClick={onClick}
      onDoubleClick={onDoubleClick}
    >
      {zone.demandLevel === "surge" && (
        <circle cx={cx} cy={cy} r={r + 8} fill="none" stroke={col} strokeWidth={0.5} opacity={0.15}>
          <animate attributeName="r" values={`${r + 4};${r + 12};${r + 4}`} dur="2s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.15;0.03;0.15" dur="2s" repeatCount="indefinite" />
        </circle>
      )}
      {isSel && (
        <circle cx={cx} cy={cy} r={r + 14} fill="none" stroke={col} strokeWidth={1.5} opacity={0.25} strokeDasharray="3 3">
          <animate attributeName="stroke-dashoffset" values="0;12" dur="2s" repeatCount="indefinite" />
        </circle>
      )}
      <circle cx={cx} cy={cy} r={r + 8} fill={col} opacity={isSel ? 0.12 : isHov ? 0.06 : 0.02} style={{ transition: "all 0.3s" }} />
      <circle cx={cx} cy={cy} r={isSel ? r + 3 : isHov ? r + 1 : r} fill={col} opacity={isSel ? 0.65 : isHov ? 0.45 : 0.25} style={{ transition: "all 0.25s" }} />
      <circle cx={cx} cy={cy} r={isSel ? r + 3 : isHov ? r + 1 : r} fill="none" stroke={col} strokeWidth={isSel ? 2 : 1} opacity={isSel ? 1 : 0.6} style={{ transition: "all 0.25s" }} />
      <text x={cx} y={cy - r - 10} textAnchor="middle" fill={isSel ? t.text : isHov ? t.textSecondary : t.textMuted} fontSize={10} fontFamily="var(--font-body)" fontWeight={isSel ? 600 : 500} letterSpacing="-0.02em">{zone.name}</text>
      <text x={cx} y={cy + 4} textAnchor="middle" fill={t.text} fontSize={12} fontFamily="var(--font-heading)" fontWeight={600} opacity={0.85}>{zone.drivers}</text>

      {/* Entity count badge with icon */}
      {showBadge && (() => {
        const badgeW = entCount > 9 ? 32 : 26;
        const bx = cx + r - 2;
        const by = cy - r - 8;
        const iconPath = entityFilter === "hotels"
          ? "M3 7v7a1 1 0 001 1h6a1 1 0 001-1V7M1 10h12M5 3h4a1 1 0 011 1v3H4V4a1 1 0 011-1z" // building
          : entityFilter === "fleet"
          ? "M5 11l-1 4h8l-1-4M3 11h10M4.5 7L3 11M11.5 7L13 11M5 7h6a1 1 0 011 1v3H4V8a1 1 0 011-1z" // car
          : entityFilter === "riders"
          ? "M3 13L8 3l5 10M5.5 8.5h5" // navigation
          : "M7 1a4 4 0 100 8 4 4 0 000-8zM1 15a6 6 0 0112 0"; // driver/users
        return (
          <g>
            <rect x={bx} y={by} width={badgeW} height={16} rx={8} fill={filterColor} opacity={0.92} />
            <g transform={`translate(${bx + 3}, ${by + 2}) scale(0.75)`}>
              <path d={iconPath} fill="none" stroke="#FFFFFF" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
            </g>
            <text x={bx + 14 + (entCount > 9 ? 4 : 0)} y={by + 12} textAnchor="middle" fill="#FFFFFF" fontSize={9} fontFamily="var(--font-heading)" fontWeight={700}>{entCount}</text>
          </g>
        );
      })()}
    </g>
  );
}


/* ═══════════════════════════════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════════════════════════════ */
export function CommandCenterComposite({ variant = "v1" }: { variant?: "v1" | "v2" } = {}) {
  const { theme, t } = useAdminTheme();
  const isDark = theme === "dark";
  const navigate = useNavigate();
  const isV2 = variant === "v2";

  // ─── State ──────────────────────────────────────────────────────────────
  const [hoveredZone, setHoveredZone] = useState<string | null>(null);
  const [selectedZone, setSelectedZone] = useState<string | null>(null);
  const [hoveredState, setHoveredState] = useState<string | null>(null);
  const [selectedState, setSelectedState] = useState<string | null>(null);
  const [drilledState, setDrilledState] = useState<string | null>(null);
  const [drilledZone, setDrilledZone] = useState<string | null>(null);
  const [showOverlay, setShowOverlay] = useState<"verification" | "disputes" | "finance" | null>(null);
  const [entityFilter, setEntityFilter] = useState<EntityFilter>("all");
  const [feedOffset, setFeedOffset] = useState(0);
  const [feedFilter, setFeedFilter] = useState<"all" | "ride" | "hotel" | "fleet">("all");
  const [zoom, setZoom] = useState(1);
  const [hoveredEntity, setHoveredEntity] = useState<string | null>(null);
  const [selectedEntity, setSelectedEntity] = useState<ZoneEntityPin | null>(null);
  // Platform state: "setup" = onboarding (no data), "active" = full CC
  const [platformMode, setPlatformMode] = useState<"setup" | "active">(isV2 ? "setup" : "active");
  const [onboardingVariation, setOnboardingVariation] = useState<OnboardingVariation>("B");

  // ─── V2-specific state ─────────────────────────────────────────────────
  const [v2HighlightedIds, setV2HighlightedIds] = useState<string[]>([]);
  const [v2DrawerItem, setV2DrawerItem] = useState<ActionItem | null>(null);
  const v2PanelRef = React.useRef<HTMLDivElement | null>(null);
  const v2ItemRefs = React.useRef<Record<string, HTMLDivElement | null>>({});
  const v2KpiGroups = useMemo(() => isV2 ? buildKPIGroups() : [], [isV2]);
  const handleV2KPIClick = useCallback((group: KPIGroup) => {
    if (group.relatedActions.length === 0) return;
    const firstId = group.relatedActions[0];
    const el = v2ItemRefs.current[firstId];
    if (el && v2PanelRef.current) el.scrollIntoView({ behavior: "smooth", block: "center" });
    setV2HighlightedIds(group.relatedActions);
    setTimeout(() => setV2HighlightedIds([]), 300);
  }, []);
  const handleV2Action = useCallback((item: ActionItem) => setV2DrawerItem(item), []);
  const closeV2Drawer = useCallback(() => setV2DrawerItem(null), []);
  useEffect(() => {
    if (!isV2) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") closeV2Drawer(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isV2, closeV2Drawer]);

  // ─── Derived ────────────────────────────────────────────────────────────
  const mapLevel: "national" | "state" | "zone" = drilledZone ? "zone" : drilledState ? "state" : "national";
  const m = HEALTH_METRICS;
  const nm = NATIONAL_METRICS;
  const revDelta = ((m.revenueToday - m.revenueYesterday) / m.revenueYesterday * 100).toFixed(1);
  const criticalActions = ACTION_QUEUE.filter(a => a.priority === "critical" || a.priority === "high");
  const selectedZoneData = selectedZone
    ? ZONE_MAP_POSITIONS.find(z => z.name === selectedZone)
      ?? (drilledState && STATE_ZONE_DATA[drilledState]?.find(z => z.name === selectedZone))
      ?? null
    : null;
  const selectedStateData = selectedState ? STATE_DATA.find(s => s.name === selectedState) : null;

  // Zone entities for level 3
  const zoneEntities = useMemo(() => {
    if (!drilledZone) return [];
    const all = ZONE_ENTITIES[drilledZone] || [];
    if (entityFilter === "all") return all;
    const typeMap: Record<string, string> = { riders: "rider", drivers: "driver", hotels: "hotel", fleet: "fleet" };
    return all.filter(e => e.type === typeMap[entityFilter]);
  }, [drilledZone, entityFilter]);

  // Zone list with entity counts for the panel (when state is drilled)
  const zoneListWithCounts = useMemo(() => {
    if (!drilledState) return [];
    const zones = drilledState === "Lagos" ? ZONE_MAP_POSITIONS : (STATE_ZONE_DATA[drilledState] || []);
    return zones.map(z => ({
      ...z,
      counts: getZoneEntityCounts(z.name, entityFilter),
      filterCount: getEntityCountForFilter(z.name, entityFilter),
    })).sort((a, b) => b.filterCount - a.filterCount);
  }, [drilledState, entityFilter]);

  // ─── Handlers ───────────────────────────────────────────────────────────
  const zoomIn = useCallback(() => setZoom(z => Math.min(z + 0.25, 3)), []);
  const zoomOut = useCallback(() => setZoom(z => Math.max(z - 0.25, 0.5)), []);
  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    if (e.deltaY < 0) zoomIn(); else zoomOut();
  }, [zoomIn, zoomOut]);

  // Filtered feed based on active feed filter
  const filteredFeed = useMemo(() => {
    if (feedFilter === "all") return ACTIVITY_FEED;
    return ACTIVITY_FEED.filter(e => e.category === feedFilter);
  }, [feedFilter]);

  useEffect(() => {
    setFeedOffset(0);
  }, [feedFilter]);

  useEffect(() => {
    const len = filteredFeed.length;
    if (len === 0) return;
    const t = setInterval(() => setFeedOffset(prev => (prev + 1) % len), 3500);
    return () => clearInterval(t);
  }, [filteredFeed.length]);

  const goNational = () => { setSelectedState(null); setDrilledState(null); setDrilledZone(null); setSelectedZone(null); setSelectedEntity(null); setEntityFilter("all"); setZoom(1); setShowOverlay(null); };
  const goState = (name: string) => { setSelectedState(name); setSelectedZone(null); setDrilledZone(null); setSelectedEntity(null); setShowOverlay(null); };
  const drillIntoState = (name: string) => { setDrilledState(name); setSelectedState(name); setSelectedZone(null); setDrilledZone(null); setSelectedEntity(null); setEntityFilter("all"); setZoom(1); setShowOverlay(null); };
  const goBackToState = () => { setDrilledZone(null); setSelectedEntity(null); setSelectedZone(null); setEntityFilter("all"); setZoom(1); };
  const drillIntoZone = (name: string) => { setDrilledZone(name); setSelectedZone(name); setSelectedEntity(null); setZoom(1); setShowOverlay(null); };
  const switchFilter = (f: EntityFilter) => { setEntityFilter(f); setSelectedEntity(null); };

  // ─── KPIs (entity-filter-aware when drilled) ────────────────────────────
  const scopeKPIs = useMemo(() => {
    const sd = selectedStateData;

    // When drilled into a state AND a specific entity filter is active, show entity-contextual KPIs
    if (drilledState && entityFilter !== "all") {
      const em = getStateEntityMetrics(drilledState);
      if (entityFilter === "riders") {
        return [
          { label: "Riders in State", value: `${em.riderTotal}`, delta: "", up: true, icon: Navigation },
          { label: "In-ride", value: `${em.riderInRide}`, delta: `${em.riderTotal > 0 ? Math.round(em.riderInRide / em.riderTotal * 100) : 0}% active`, up: true, icon: MapPin },
          { label: "Matched", value: `${em.riderMatched}`, delta: "Awaiting pickup", up: true, icon: Clock },
          { label: "Waiting", value: `${em.riderWaiting}`, delta: em.riderWaiting > em.riderInRide * 0.3 ? "High demand" : "Normal", up: em.riderWaiting <= em.riderInRide * 0.3, icon: AlertCircle },
          { label: "Avg Trips", value: `${em.riderAvgTrips}`, delta: "Per rider", up: true, icon: Activity },
          { label: "Avg Spend", value: formatNaira(RIDER_METRICS.avgTripValue), delta: "Per trip", up: true, icon: Wallet },
          { label: "Retention", value: `${RIDER_METRICS.retentionRate}%`, delta: RIDER_METRICS.retentionRate >= 85 ? "Healthy" : "Monitor", up: RIDER_METRICS.retentionRate >= 85, icon: Shield },
        ];
      }
      if (entityFilter === "hotels") {
        return [
          { label: "Hotel Partners", value: `${em.hotelTotal}`, delta: `of ${HOTEL_METRICS.totalPartners} total`, up: true, icon: Building2 },
          { label: "Total Rooms", value: em.hotelTotalRooms.toLocaleString(), delta: "Capacity", up: true, icon: Building2 },
          { label: "Guest Rides", value: `${HOTEL_METRICS.guestRidesToday}`, delta: `+${((HOTEL_METRICS.guestRidesToday - HOTEL_METRICS.guestRidesYesterday) / HOTEL_METRICS.guestRidesYesterday * 100).toFixed(0)}% vs yday`, up: true, icon: MapPin },
          { label: "Ride Rating", value: `★${em.hotelAvgRating}`, delta: em.hotelAvgRating >= 4.5 ? "Excellent" : "Good", up: em.hotelAvgRating >= 4.5, icon: Star },
          { label: "Revenue", value: formatNaira(HOTEL_METRICS.revenueToday), delta: "Guest rides", up: true, icon: Wallet },
          { label: "Pending Invoices", value: `${HOTEL_METRICS.pendingInvoices}`, delta: formatNaira(HOTEL_METRICS.invoiceValue), up: false, icon: CreditCard },
          { label: "Open Cases", value: `${HOTEL_METRICS.openCases}`, delta: HOTEL_METRICS.openCases === 0 ? "Clear" : "Needs attention", up: HOTEL_METRICS.openCases === 0, icon: AlertCircle },
        ];
      }
      if (entityFilter === "fleet") {
        return [
          { label: "Fleet Owners", value: `${em.fleetTotal}`, delta: `of ${FLEET_METRICS.totalFleets} total`, up: true, icon: Car },
          { label: "Vehicles", value: `${em.fleetTotalVehicles}`, delta: "Deployed", up: true, icon: Car },
          { label: "Drivers Online", value: `${em.fleetDriversOnline}`, delta: `of ${FLEET_METRICS.fleetDriversTotal} total`, up: true, icon: Users },
          { label: "Utilization", value: `${em.fleetAvgUtilization}%`, delta: em.fleetAvgUtilization >= 70 ? "Healthy" : "Below target", up: em.fleetAvgUtilization >= 70, icon: Activity },
          { label: "Fleet Revenue", value: formatNaira(FLEET_METRICS.fleetRevenueToday), delta: `+${((FLEET_METRICS.fleetRevenueToday - FLEET_METRICS.fleetRevenueYesterday) / FLEET_METRICS.fleetRevenueYesterday * 100).toFixed(0)}%`, up: true, icon: Wallet },
          { label: "Pending Payouts", value: formatNaira(FLEET_METRICS.pendingPayouts), delta: "Settlement due", up: false, icon: Clock },
          { label: "EV Fleet", value: `${FLEET_METRICS.evFleetPercentage}%`, delta: "Of fleet vehicles", up: true, icon: Zap },
        ];
      }
      // entityFilter === "drivers" — driver-specific KPIs
      return [
        { label: "Drivers in State", value: `${em.driverTotal}`, delta: `${sd?.zones || 0} zones`, up: true, icon: Car },
        { label: "Active", value: `${em.driverActive}`, delta: "On trip", up: true, icon: MapPin },
        { label: "En-route", value: `${em.driverEnRoute}`, delta: "To pickup", up: true, icon: Navigation },
        { label: "Idle", value: `${em.driverIdle}`, delta: em.driverIdle > em.driverActive ? "Oversupply" : "Balanced", up: em.driverIdle <= em.driverActive, icon: Clock },
        { label: "Avg Rating", value: `★${em.driverAvgRating}`, delta: em.driverAvgRating >= 4.5 ? "Excellent" : "Monitor", up: em.driverAvgRating >= 4.5, icon: Star },
        { label: "EV Drivers", value: `${em.driverEVCount}`, delta: `${em.driverTotal > 0 ? Math.round(em.driverEVCount / em.driverTotal * 100) : 0}% of fleet`, up: true, icon: Zap },
        { label: "Avg Match", value: `${sd?.avgMatchTime || m.avgMatchTime}s`, delta: (sd?.avgMatchTime || m.avgMatchTime) <= 60 ? "Healthy" : "Slow", up: (sd?.avgMatchTime || m.avgMatchTime) <= 60, icon: Shield },
      ];
    }

    // Default state-scoped KPIs (no entity filter, or "all")
    if (sd && sd.status !== "planned") {
      const stEm = drilledState ? getStateEntityMetrics(drilledState) : null;
      return [
        { label: "Active Rides", value: sd.activeRides.toLocaleString(), delta: "", up: true, icon: MapPin },
        { label: "Driver Supply", value: `${sd.drivers}`, delta: `${sd.zones} zones`, up: true, icon: Users },
        { label: "Revenue Today", value: formatNaira(sd.revenue), delta: "", up: true, icon: Wallet },
        { label: "Avg Match", value: `${sd.avgMatchTime}s`, delta: sd.avgMatchTime <= 60 ? "Healthy" : "Slow", up: sd.avgMatchTime <= 60, icon: Clock },
        { label: "Hotels", value: `${stEm?.hotelTotal ?? 0}`, delta: stEm && stEm.hotelTotal > 0 ? `${stEm.hotelTotalRooms} rooms` : "None", up: (stEm?.hotelTotal ?? 0) > 0, icon: Building2 },
        { label: "Fleet Owners", value: `${stEm?.fleetTotal ?? 0}`, delta: stEm && stEm.fleetTotal > 0 ? `${stEm.fleetTotalVehicles} vehicles` : "None", up: (stEm?.fleetTotal ?? 0) > 0, icon: Car },
        { label: "Completion", value: `${sd.completionRate}%`, delta: sd.completionRate >= 92 ? "On target" : "Below", up: sd.completionRate >= 92, icon: Shield },
        ...(sd.surgeZones ? [{ label: "Surge zones", value: `${sd.surgeZones}`, delta: "", up: false, icon: TrendingUp }] : []),
      ];
    }
    return [
      { label: "Active Rides", value: m.ridesToday.toLocaleString(), delta: "+5.5%", up: true, icon: MapPin },
      { label: "Revenue Today", value: formatNaira(m.revenueToday), delta: `+${revDelta}%`, up: true, icon: Wallet },
      { label: "Driver Supply", value: `${m.activeDrivers} / ${m.totalDrivers}`, delta: `${Math.round(m.activeDrivers / m.totalDrivers * 100)}% online`, up: true, icon: Users },
      { label: "Avg Match", value: `${m.avgMatchTime}s`, delta: "Healthy", up: true, icon: Clock },
      { label: "Hotel Rides", value: `${HOTEL_METRICS.guestRidesToday}`, delta: `+${((HOTEL_METRICS.guestRidesToday - HOTEL_METRICS.guestRidesYesterday) / HOTEL_METRICS.guestRidesYesterday * 100).toFixed(0)}%`, up: true, icon: Building2 },
      { label: "Fleet Util", value: `${FLEET_METRICS.avgFleetUtilization}%`, delta: FLEET_METRICS.avgFleetUtilization >= 70 ? "Healthy" : "Below target", up: FLEET_METRICS.avgFleetUtilization >= 70, icon: Car },
      { label: "Completion", value: `${m.completionRate}%`, delta: "On target", up: true, icon: Shield },
      { label: "Open Issues", value: `${HOTEL_METRICS.openCases + FLEET_METRICS.openCases + DISPUTE_SUMMARY.open}`, delta: `${DISPUTE_SUMMARY.urgent} urgent`, up: false, icon: AlertCircle },
    ];
  }, [selectedStateData, m, revDelta, drilledState, entityFilter]);

  // ─── Right panel mode (contextual hierarchy) ───────────────────────────
  // showOverlay takes precedence over state-zones so footer tabs work at any level
  const rightPanelMode =
    selectedEntity ? "entity"
    : drilledZone ? "zone-drilled"
    : selectedZoneData && drilledState && !showOverlay ? "zone-detail"
    : showOverlay ? "overlay"
    : drilledState ? "state-zones"
    : selectedState ? "state-detail"
    : "queue";

  // ─── Overlay footer tabs — SCOPE-CONTEXTUAL ─────────────────────────────
  // Pipeline: always national (central ops — drivers are verified once, regardless of state)
  // Disputes: scoped to drilled state/zone (disputes tie to trips → geography)
  // Revenue: scoped to drilled state/zone (revenue = SUM(trip.commission) WHERE trip.zone/state)
  const scopedDisputes = drilledZone
    ? (DISPUTE_BY_ZONE[drilledZone]?.open ?? 0)
    : drilledState
    ? (DISPUTE_BY_STATE[drilledState]?.open ?? 0)
    : DISPUTE_SUMMARY.open;
  const scopedRevenue = drilledZone
    ? (REVENUE_BY_ZONE[drilledZone]?.net ?? 0)
    : drilledState
    ? (REVENUE_BY_STATE[drilledState]?.net ?? 0)
    : FINANCE_SUMMARY.netRevenue;
  const scopeLabel = drilledZone
    ? drilledZone
    : drilledState
    ? drilledState
    : "Platform";

  const footerTabs = [
    { id: "verification" as const, icon: Users, label: "Onboarding", value: VERIFICATION_PIPELINE.newApplications + VERIFICATION_PIPELINE.documentsReview + VERIFICATION_PIPELINE.backgroundCheck, color: STATUS.warning, scope: "Platform-wide" },
    { id: "disputes" as const, icon: Scale, label: "Trip Disputes", value: scopedDisputes, color: STATUS.error, scope: scopeLabel },
    { id: "finance" as const, icon: Wallet, label: "Revenue", value: formatNaira(scopedRevenue), color: BRAND.green, scope: scopeLabel },
  ];


  /* ═══════════════════════════════════════════════════════════════════════
     RENDER
     ═══════════════════════════════════════════════════════════════════════ */

  // ─── ONBOARDING STATE ──
  if (platformMode === "setup") {
    if (isV2) {
      // FIX 1: Full-screen fixed overlay with real action forms + progressive CC build-up
      return <CCv2Onboarding onGoActive={() => setPlatformMode("active")} />;
    }
    return (
      <CommandCenterOnboarding
        variation={onboardingVariation}
        onVariationChange={setOnboardingVariation}
        onGoActive={() => setPlatformMode("active")}
      />
    );
  }

  return (
    <>
      {/* ═══ HEADER BAR ═══ */}
      <motion.div
        className="flex items-center justify-between px-5 h-14 shrink-0"
        style={{ background: t.overlay, borderBottom: `1px solid ${t.border}` }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        <div className="flex items-center gap-3">
          {/* Breadcrumb */}
          <div className="flex items-center gap-1.5">
            {selectedState || drilledState ? (
              <button onClick={goNational} className="flex items-center gap-1.5 hover:opacity-80 transition-opacity">
                <Globe size={13} style={{ color: t.textMuted }} />
                <span style={{ ...TY.sub, fontSize: "14px", color: t.textMuted }}>Nigeria</span>
              </button>
            ) : (
              <h1 style={{ ...TY.sub, fontSize: "14px", color: t.text }}>Command Center</h1>
            )}
            {isV2 && <span className="px-1.5 py-0.5 rounded-md" style={{ ...TY.cap, fontSize: "9px", color: BRAND.green, background: `${BRAND.green}10` }}>V2</span>}
            {selectedState && (
              <>
                <ChevronRight size={12} style={{ color: t.textGhost }} />
                <button
                  onClick={() => { if (drilledZone) goBackToState(); }}
                  className="hover:opacity-80 transition-opacity"
                >
                  <span style={{ ...TY.sub, fontSize: "14px", color: drilledZone ? t.textMuted : drilledState ? t.text : BRAND.green }}>{selectedState}</span>
                </button>
              </>
            )}
            {drilledZone && (
              <>
                <ChevronRight size={12} style={{ color: t.textGhost }} />
                <span style={{ ...TY.sub, fontSize: "14px", color: BRAND.green }}>{drilledZone}</span>
              </>
            )}
            {!drilledZone && selectedZone && drilledState && (
              <>
                <ChevronRight size={12} style={{ color: t.textGhost }} />
                <span style={{ ...TY.sub, fontSize: "14px", color: BRAND.green }}>{selectedZone}</span>
              </>
            )}
          </div>
          <span className="hidden md:block" style={{ ...TY.bodyR, fontSize: "11px", color: t.textGhost }}>
            {mapLevel === "zone"
              ? `${entityFilter === "all" ? "All entities" : entityFilter.charAt(0).toUpperCase() + entityFilter.slice(1)} in ${drilledZone}`
              : drilledState && entityFilter !== "all"
              ? `Viewing ${entityFilter} · ${selectedStateData?.zones || 0} zones`
              : drilledState
              ? `${selectedStateData?.zones || 0} zones · Double-click to explore`
              : selectedState
              ? "Double-click to drill in"
              : `${nm.liveStates} states live · ${nm.launchingStates} launching`}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Demo: view setup/empty state */}
          <button
            onClick={() => setPlatformMode("setup")}
            className="h-7 px-3 rounded-lg flex items-center gap-1.5 transition-colors"
            style={{
              background: isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.03)",
              border: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)"}`,
            }}
            onMouseEnter={e => { e.currentTarget.style.background = isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)"; }}
            onMouseLeave={e => { e.currentTarget.style.background = isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.03)"; }}
          >
            <Settings size={11} style={{ color: t.textMuted }} />
            <span
              style={{
                fontFamily: "'Manrope', sans-serif",
                fontWeight: 500,
                fontSize: "10px",
                letterSpacing: "-0.01em",
                color: t.textMuted,
              }}
            >
              View setup state
            </span>
          </button>
          <ThemeToggle />
          <button className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors" style={{ background: t.surfaceHover }}>
            <Search size={14} style={{ color: t.icon }} />
          </button>
          <button className="relative w-8 h-8 rounded-lg flex items-center justify-center transition-colors" style={{ background: t.surfaceHover }}>
            <Bell size={14} style={{ color: t.icon }} />
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full" style={{ background: STATUS.error }} />
          </button>
          <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: t.greenBg }}>
            <span style={{ ...TY.cap, fontSize: "10px", color: BRAND.green }}>AO</span>
          </div>
        </div>
      </motion.div>

      {/* ═══ KPI STRIP ═══ */}
      {isV2 && mapLevel === "national" && !selectedState ? (
        /* V2: 5-group KPI strip with health indicators at national level */
        <V2KPIStrip groups={v2KpiGroups} onKPIClick={handleV2KPIClick} />
      ) : (
        /* V1: scope-contextual KPI strip (also used by V2 when drilled) */
        <motion.div
          className="flex items-stretch overflow-x-auto shrink-0 scrollbar-hide"
          style={{ background: t.overlay, borderBottom: `1px solid ${t.border}` }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 }}
        >
          {scopeKPIs.map((kpi, i) => (
            <motion.div
              key={kpi.label}
              className="flex items-center gap-3 px-5 py-3 shrink-0"
              style={{ borderRight: i < scopeKPIs.length - 1 ? `1px solid ${t.borderSubtle}` : "none" }}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.04 }}
            >
              <kpi.icon size={14} style={{ color: t.iconSecondary }} />
              <div className="min-w-0">
                <div className="flex items-baseline gap-2">
                  <span style={{ ...TY.h, fontSize: "18px", color: t.text }}>{kpi.value}</span>
                  {kpi.delta && (
                    <span style={{ ...TY.cap, fontSize: "10px", color: kpi.up ? BRAND.green : t.textMuted }}>
                      {kpi.delta}
                    </span>
                  )}
                </div>
                <span className="block" style={{ ...TY.bodyR, fontSize: "10px", color: t.textFaint }}>{kpi.label}</span>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}


      {/* ═══ CONTENT: MAP + DECISION PANEL ═══ */}
      <div className="flex-1 flex min-h-0 relative">

        {/* ─── LEFT: Alert + Map ─── */}
        <div className="flex-1 flex flex-col min-w-0 min-h-0">

          {/* Alert bar */}
          {criticalActions.length > 0 && mapLevel === "national" && !selectedState && (
            <motion.div
              className="flex items-center gap-3 px-5 py-2.5 shrink-0"
              style={{ background: t.errorBg, borderBottom: `1px solid ${t.errorBorder}` }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.35 }}
            >
              <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${STATUS.error}15` }}>
                <AlertTriangle size={14} style={{ color: STATUS.error }} />
              </div>
              <div className="flex-1 min-w-0">
                <span className="block truncate" style={{ ...TY.body, fontSize: "13px", color: t.text }}>{criticalActions[0].title}</span>
                <span className="block truncate" style={{ ...TY.bodyR, fontSize: "11px", color: t.textMuted }}>{criticalActions[0].subtitle}</span>
              </div>
              <button className="h-8 px-4 rounded-xl shrink-0" style={{ background: `${STATUS.error}12`, border: `1px solid ${STATUS.error}20` }} onClick={() => navigate("/admin/disputes")}>
                <span style={{ ...TY.body, fontSize: "12px", color: STATUS.error }}>Investigate</span>
              </button>
            </motion.div>
          )}

          {/* ═══ MAP CANVAS ═══ */}
          <div className="flex-1 relative" onWheel={handleWheel}>
            {/* Atmospheric background */}
            <div className="absolute inset-0" style={{ background: t.mapBg }}>
              <div className="absolute inset-0" style={{ background: `radial-gradient(ellipse at 35% 45%, ${t.mapGlow1} 0%, transparent 55%)` }} />
              <div className="absolute inset-0" style={{ background: `radial-gradient(ellipse at 75% 80%, ${t.mapGlow2} 0%, transparent 50%)` }} />
              <div className="absolute inset-0" style={{
                backgroundImage: `radial-gradient(${t.mapGrid} 1px, transparent 1px)`,
                backgroundSize: "24px 24px",
                mixBlendMode: "overlay",
              }} />
            </div>

            {/* SVG Map */}
            <svg
              viewBox={mapLevel === "national" ? "0 0 500 420" : "0 0 700 500"}
              className="absolute inset-0 w-full h-full"
              preserveAspectRatio="xMidYMid meet"
              style={{ overflow: "hidden" }}
            >
              <g transform={`scale(${zoom})`} style={{ transformOrigin: "center center" }}>
                <AnimatePresence mode="wait">
                  {mapLevel === "national" ? (
                    <motion.g key="ng" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}>
                      <NigeriaOutline />

                      {/* State pins */}
                      {STATE_DATA.map((state) => {
                        const cx = state.x * 5;
                        const cy = state.y * 4.2;
                        const col = stateStatusColor(state.status);
                        const isHov = hoveredState === state.name;
                        const isSel = selectedState === state.name;
                        const r = state.status === "live" ? 16 : state.status === "launching" ? 11 : 6;
                        return (
                          <g
                            key={state.code}
                            style={{ cursor: state.status !== "planned" ? "pointer" : "default" }}
                            onMouseEnter={() => setHoveredState(state.name)}
                            onMouseLeave={() => setHoveredState(null)}
                            onClick={() => { if (state.status !== "planned") goState(state.name); }}
                            onDoubleClick={() => { if (state.status !== "planned") drillIntoState(state.name); }}
                          >
                            {state.status === "live" && (
                              <circle cx={cx} cy={cy} r={r + 10} fill="none" stroke={col} strokeWidth={0.5} opacity={0.2}>
                                <animate attributeName="r" values={`${r + 6};${r + 16};${r + 6}`} dur="3s" repeatCount="indefinite" />
                                <animate attributeName="opacity" values="0.2;0.02;0.2" dur="3s" repeatCount="indefinite" />
                              </circle>
                            )}
                            {isSel && (
                              <circle cx={cx} cy={cy} r={r + 14} fill="none" stroke={col} strokeWidth={1.5} opacity={0.25} strokeDasharray="3 3">
                                <animate attributeName="stroke-dashoffset" values="0;12" dur="2s" repeatCount="indefinite" />
                              </circle>
                            )}
                            <circle cx={cx} cy={cy} r={r + 6} fill={col} opacity={isSel ? 0.15 : isHov ? 0.1 : 0.03} style={{ transition: "all 0.3s" }} />
                            <circle cx={cx} cy={cy} r={isSel ? r + 3 : isHov ? r + 2 : r} fill={col} opacity={isSel ? 0.7 : isHov ? 0.6 : state.status === "planned" ? 0.2 : 0.35} style={{ transition: "all 0.25s" }} />
                            <circle cx={cx} cy={cy} r={isSel ? r + 3 : isHov ? r + 2 : r} fill="none" stroke={col} strokeWidth={isSel ? 2 : state.status === "live" ? 1.5 : 0.8} opacity={isSel ? 1 : 0.6} style={{ transition: "all 0.25s" }} />
                            <text x={cx} y={cy - r - 6} textAnchor="middle" fill={isSel || isHov ? t.text : t.textMuted} fontSize={state.status === "live" ? 10 : 8} fontFamily="var(--font-body)" fontWeight={state.status === "live" ? 600 : 500} letterSpacing="-0.02em" style={{ transition: "fill 0.2s" }}>
                              {state.name}
                            </text>
                            {state.status !== "planned" && (
                              <text x={cx} y={cy + 4} textAnchor="middle" fill={t.text} fontSize={state.status === "live" ? 10 : 8} fontFamily="var(--font-heading)" fontWeight={600} opacity={0.85}>
                                {state.code}
                              </text>
                            )}
                          </g>
                        );
                      })}
                    </motion.g>

                  ) : mapLevel === "zone" ? (
                    /* ─── ZONE ENTITY MAP (Level 3) ─── */
                    <motion.g key="zone-entities" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}>
                      <LagosDetailMap />
                      <text x="350" y="30" textAnchor="middle" fill={t.mapWatermark} fontSize={20} fontFamily="var(--font-heading)" fontWeight={600} letterSpacing="-0.03em">
                        {drilledZone}
                      </text>

                      {/* Entity pins */}
                      {zoneEntities.map((ent) => {
                        const cx = ent.x * 7;
                        const cy = ent.y * 5;
                        const col = entityColor(ent.type);
                        const isHov = hoveredEntity === ent.id;
                        const isSel = selectedEntity?.id === ent.id;
                        const r = ent.type === "hotel" || ent.type === "fleet" ? 12 : 8;
                        return (
                          <g
                            key={ent.id}
                            style={{ cursor: "pointer" }}
                            onMouseEnter={() => setHoveredEntity(ent.id)}
                            onMouseLeave={() => setHoveredEntity(null)}
                            onClick={(e) => { e.stopPropagation(); setSelectedEntity(isSel ? null : ent); setShowOverlay(null); }}
                          >
                            {isSel && (
                              <circle cx={cx} cy={cy} r={r + 10} fill="none" stroke={col} strokeWidth={1.5} opacity={0.3} strokeDasharray="3 3">
                                <animate attributeName="stroke-dashoffset" values="0;12" dur="2s" repeatCount="indefinite" />
                              </circle>
                            )}
                            <circle cx={cx} cy={cy} r={r + 5} fill={col} opacity={isSel ? 0.12 : isHov ? 0.06 : 0.02} style={{ transition: "all 0.3s" }} />
                            <circle cx={cx} cy={cy} r={isSel ? r + 2 : isHov ? r + 1 : r} fill={col} opacity={isSel ? 0.75 : isHov ? 0.6 : 0.4} style={{ transition: "all 0.25s" }} />
                            <circle cx={cx} cy={cy} r={isSel ? r + 2 : isHov ? r + 1 : r} fill="none" stroke={col} strokeWidth={isSel ? 2 : 1} opacity={isSel ? 1 : 0.6} style={{ transition: "all 0.25s" }} />
                            <text x={cx} y={cy + 3.5} textAnchor="middle" fill="#FFFFFF" fontSize={r > 10 ? 10 : 8} fontFamily="var(--font-heading)" fontWeight={600} opacity={0.9}>
                              {entityIcon(ent.type)}
                            </text>
                            {(isHov || isSel) && (
                              <text x={cx} y={cy - r - 6} textAnchor="middle" fill={t.text} fontSize={9} fontFamily="var(--font-body)" fontWeight={500} letterSpacing="-0.02em">
                                {ent.name}
                              </text>
                            )}
                            {ent.type === "driver" && ent.vehicleType === "EV" && (
                              <g>
                                <circle cx={cx + r} cy={cy - r} r={4} fill={BRAND.green} />
                                <text x={cx + r} y={cy - r + 2.5} textAnchor="middle" fill="#FFFFFF" fontSize={5} fontFamily="var(--font-heading)" fontWeight={700}>E</text>
                              </g>
                            )}
                          </g>
                        );
                      })}

                      {/* Legend */}
                      <g transform="translate(560, 440)">
                        {(entityFilter === "all" ? ["driver", "rider", "hotel", "fleet"] : [entityFilter === "drivers" ? "driver" : entityFilter === "riders" ? "rider" : entityFilter === "hotels" ? "hotel" : "fleet"]).map((type, i) => (
                          <g key={type} transform={`translate(0, ${i * 16})`}>
                            <circle cx={5} cy={5} r={4} fill={entityColor(type)} opacity={0.6} />
                            <text x={14} y={8.5} fill={t.textMuted} fontSize={8} fontFamily="var(--font-body)" fontWeight={500}>{type.charAt(0).toUpperCase() + type.slice(1)}s</text>
                          </g>
                        ))}
                      </g>
                    </motion.g>

                  ) : (
                    /* ─── STATE ZONE MAP (Level 2) ─── */
                    <motion.g key="state" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}>
                      {drilledState === "Lagos" ? (
                        <>
                          <LagosDetailMap />

                          {/* Zone connections */}
                          {ZONE_CONNECTIONS.map(([from, to]) => {
                            const a = ZONE_MAP_POSITIONS[from];
                            const b = ZONE_MAP_POSITIONS[to];
                            const isSel = selectedZone === a.name || selectedZone === b.name;
                            return <line key={`${from}-${to}`} x1={a.x * 7} y1={a.y * 5} x2={b.x * 7} y2={b.y * 5} stroke={t.mapRoute} strokeWidth={isSel ? 1.5 : 0.8} opacity={isSel ? 0.5 : 0.25} />;
                          })}
                          {/* Zone pins with entity count badges */}
                          {ZONE_MAP_POSITIONS.map((zone) => {
                            const cx = zone.x * 7;
                            const cy = zone.y * 5;
                            const col = demandColor(zone.demandLevel, theme);
                            const r = zone.demandLevel === "surge" ? 18 : zone.demandLevel === "high" ? 14 : 10;
                            return (
                              <ZonePinSVG
                                key={zone.name}
                                zone={zone}
                                cx={cx} cy={cy} col={col} r={r}
                                isHov={hoveredZone === zone.name}
                                isSel={selectedZone === zone.name}
                                entityFilter={entityFilter}
                                theme={theme} t={t}
                                onHover={() => setHoveredZone(zone.name)}
                                onLeave={() => setHoveredZone(null)}
                                onClick={(e) => { e.stopPropagation(); setSelectedZone(selectedZone === zone.name ? null : zone.name); setSelectedEntity(null); setShowOverlay(null); }}
                                onDoubleClick={() => drillIntoZone(zone.name)}
                              />
                            );
                          })}
                        </>
                      ) : drilledState && STATE_ZONE_DATA[drilledState] ? (
                        <>
                          <text x="350" y="250" textAnchor="middle" fill={t.mapWatermark} fontSize={28} fontFamily="var(--font-heading)" fontWeight={600} letterSpacing="-0.03em">
                            {drilledState}
                          </text>
                          {(STATE_ZONE_CONNECTIONS[drilledState!] || []).map(([from, to]) => {
                            const zones = STATE_ZONE_DATA[drilledState!];
                            const a = zones[from]; const b = zones[to];
                            if (!a || !b) return null;
                            return <line key={`${from}-${to}`} x1={a.x * 7} y1={a.y * 5} x2={b.x * 7} y2={b.y * 5} stroke={t.mapRoute} strokeWidth={0.8} opacity={0.25} />;
                          })}
                          {STATE_ZONE_DATA[drilledState!].map((zone) => {
                            const cx = zone.x * 7; const cy = zone.y * 5;
                            const col = demandColor(zone.demandLevel, theme);
                            const r = zone.demandLevel === "surge" ? 18 : zone.demandLevel === "high" ? 14 : 10;
                            return (
                              <ZonePinSVG
                                key={zone.name}
                                zone={zone}
                                cx={cx} cy={cy} col={col} r={r}
                                isHov={hoveredZone === zone.name}
                                isSel={selectedZone === zone.name}
                                entityFilter={entityFilter}
                                theme={theme} t={t}
                                onHover={() => setHoveredZone(zone.name)}
                                onLeave={() => setHoveredZone(null)}
                                onClick={(e) => { e.stopPropagation(); setSelectedZone(selectedZone === zone.name ? null : zone.name); setSelectedEntity(null); setShowOverlay(null); }}
                                onDoubleClick={() => drillIntoZone(zone.name)}
                              />
                            );
                          })}
                        </>
                      ) : (
                        <g>
                          <text x="350" y="250" textAnchor="middle" fill={t.mapWatermark} fontSize={28} fontFamily="var(--font-heading)" fontWeight={600} letterSpacing="-0.03em">{drilledState}</text>
                          <text x="350" y="275" textAnchor="middle" fill={t.textFaint} fontSize={11} fontFamily="var(--font-body)" fontWeight={500}>Zone data coming soon</text>
                        </g>
                      )}
                    </motion.g>
                  )}
                </AnimatePresence>
              </g>
            </svg>

            {/* Zoom controls + back button */}
            <div className="absolute bottom-4 left-4 flex flex-col gap-1 z-10">
              <div className="rounded-2xl overflow-hidden" style={{ background: t.glass, backdropFilter: t.glassBlur, border: `1px solid ${t.border}`, boxShadow: t.shadow }}>
                {[
                  { icon: Plus, action: zoomIn },
                  { icon: Minus, action: zoomOut },
                  { icon: RotateCcw, action: () => setZoom(1) },
                ].map((ctrl, i) => (
                  <button key={i} onClick={ctrl.action} className="w-9 h-9 flex items-center justify-center transition-colors" style={{ borderBottom: i < 2 ? `1px solid ${t.borderSubtle}` : "none" }}
                    onMouseEnter={e => (e.currentTarget.style.background = t.surfaceHover)}
                    onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                  >
                    <ctrl.icon size={13} style={{ color: t.icon }} />
                  </button>
                ))}
              </div>
              {mapLevel === "zone" && (
                <button
                  onClick={goBackToState}
                  className="mt-1 w-9 h-9 rounded-2xl flex items-center justify-center"
                  style={{ background: t.glass, backdropFilter: t.glassBlur, border: `1px solid ${t.border}`, boxShadow: t.shadow }}
                  onMouseEnter={e => (e.currentTarget.style.background = t.surfaceHover)}
                  onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                >
                  <ArrowLeft size={13} style={{ color: t.icon }} />
                </button>
              )}
            </div>

            {/* Hint text */}
            {!selectedState && !hoveredState && mapLevel === "national" && (
              <motion.div className="absolute bottom-14 left-1/2 -translate-x-1/2 z-10 pointer-events-none" initial={{ opacity: 0 }} animate={{ opacity: 0.5 }} transition={{ delay: 2 }}>
                <div className="flex items-center gap-2 px-3 py-2 rounded-xl" style={{ background: t.glass, backdropFilter: t.glassBlur }}>
                  <Eye size={11} style={{ color: t.iconMuted }} />
                  <span style={{ ...TY.bodyR, fontSize: "10px", color: t.textMuted }}>Click state for details · Double-click to drill in</span>
                </div>
              </motion.div>
            )}

            {/* State hover tooltip */}
            <AnimatePresence>
              {hoveredState && !drilledState && (() => {
                const st = STATE_DATA.find(s => s.name === hoveredState);
                if (!st) return null;
                return (
                  <motion.div
                    className="absolute z-30 pointer-events-none"
                    style={{ left: `${st.x + 3}%`, top: `${st.y - 5}%` }}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                  >
                    <div className="rounded-2xl px-4 py-3 min-w-[180px]" style={{ background: t.overlay, backdropFilter: t.glassBlur, border: `1px solid ${t.borderStrong}`, boxShadow: t.shadowLg }}>
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-2.5 h-2.5 rounded-full" style={{ background: stateStatusColor(st.status) }} />
                        <span style={{ ...TY.sub, fontSize: "13px", color: t.text }}>{st.name}</span>
                        <StatusBadge label={st.status} color={stateStatusColor(st.status)} />
                      </div>
                      {st.status !== "planned" ? (
                        <div className="space-y-1">
                          <div className="flex justify-between"><span style={{ ...TY.bodyR, fontSize: "10px", color: t.textMuted }}>Drivers</span><span style={{ ...TY.body, fontSize: "11px", color: t.text }}>{st.drivers}</span></div>
                          <div className="flex justify-between"><span style={{ ...TY.bodyR, fontSize: "10px", color: t.textMuted }}>Active rides</span><span style={{ ...TY.body, fontSize: "11px", color: t.text }}>{st.activeRides.toLocaleString()}</span></div>
                          <div className="flex justify-between"><span style={{ ...TY.bodyR, fontSize: "10px", color: t.textMuted }}>Revenue</span><span style={{ ...TY.body, fontSize: "11px", color: BRAND.green }}>{formatNaira(st.revenue)}</span></div>
                        </div>
                      ) : (
                        <span style={{ ...TY.bodyR, fontSize: "10px", color: t.textFaint }}>Expansion planned</span>
                      )}
                      {st.status !== "planned" && (
                        <div className="mt-2 pt-2" style={{ borderTop: `1px solid ${t.border}` }}>
                          <span style={{ ...TY.cap, fontSize: "9px", color: t.textMuted }}>Click for details · Double-click to drill in</span>
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })()}
            </AnimatePresence>

            {/* Zone hover tooltip (at state level) */}
            <AnimatePresence>
              {hoveredZone && mapLevel === "state" && !selectedZone && (() => {
                const z = (drilledState === "Lagos" ? ZONE_MAP_POSITIONS : (STATE_ZONE_DATA[drilledState!] || [])).find(zn => zn.name === hoveredZone);
                if (!z) return null;
                const counts = getZoneEntityCounts(z.name, entityFilter);
                return (
                  <motion.div
                    className="absolute z-30 pointer-events-none"
                    style={{ left: `${z.x + 3}%`, top: `${z.y - 5}%` }}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                  >
                    <div className="rounded-xl px-3 py-2.5 min-w-[160px]" style={{ background: t.overlay, backdropFilter: t.glassBlur, border: `1px solid ${t.borderStrong}`, boxShadow: t.shadowLg }}>
                      <div className="flex items-center gap-2 mb-1.5">
                        <div className="w-2 h-2 rounded-full" style={{ background: demandColor(z.demandLevel, theme) }} />
                        <span style={{ ...TY.sub, fontSize: "12px", color: t.text }}>{z.name}</span>
                      </div>
                      <div className="space-y-0.5">
                        {(() => {
                          const zm = getZoneEntityMetrics(z.name);
                          const fc = ENTITY_FILTER_OPTIONS.find(f => f.id === entityFilter)?.color;
                          if (entityFilter === "riders") return (<>
                            <div className="flex justify-between"><span style={{ ...TY.bodyR, fontSize: "10px", color: t.textMuted }}>Riders</span><span style={{ ...TY.body, fontSize: "10px", color: fc }}>{zm.riderTotal}</span></div>
                            <div className="flex justify-between"><span style={{ ...TY.bodyR, fontSize: "10px", color: t.textMuted }}>In-ride</span><span style={{ ...TY.body, fontSize: "10px", color: t.text }}>{zm.riderInRide}</span></div>
                            <div className="flex justify-between"><span style={{ ...TY.bodyR, fontSize: "10px", color: t.textMuted }}>Waiting</span><span style={{ ...TY.body, fontSize: "10px", color: zm.riderWaiting > 3 ? STATUS.warning : t.text }}>{zm.riderWaiting}</span></div>
                            <div className="flex justify-between"><span style={{ ...TY.bodyR, fontSize: "10px", color: t.textMuted }}>Avg trips</span><span style={{ ...TY.body, fontSize: "10px", color: t.text }}>{zm.riderAvgTrips}</span></div>
                          </>);
                          if (entityFilter === "hotels") return (<>
                            <div className="flex justify-between"><span style={{ ...TY.bodyR, fontSize: "10px", color: t.textMuted }}>Hotels</span><span style={{ ...TY.body, fontSize: "10px", color: fc }}>{zm.hotelTotal}</span></div>
                            <div className="flex justify-between"><span style={{ ...TY.bodyR, fontSize: "10px", color: t.textMuted }}>Rooms</span><span style={{ ...TY.body, fontSize: "10px", color: t.text }}>{zm.hotelTotalRooms}</span></div>
                            <div className="flex justify-between"><span style={{ ...TY.bodyR, fontSize: "10px", color: t.textMuted }}>Ride rating</span><span style={{ ...TY.body, fontSize: "10px", color: t.text }}>★{zm.hotelAvgRating}</span></div>
                            {zm.hotelTiers.length > 0 && <div className="flex justify-between"><span style={{ ...TY.bodyR, fontSize: "10px", color: t.textMuted }}>Tiers</span><span style={{ ...TY.body, fontSize: "10px", color: t.text }}>{zm.hotelTiers.join(", ")}</span></div>}
                          </>);
                          if (entityFilter === "fleet") return (<>
                            <div className="flex justify-between"><span style={{ ...TY.bodyR, fontSize: "10px", color: t.textMuted }}>Fleet owners</span><span style={{ ...TY.body, fontSize: "10px", color: fc }}>{zm.fleetTotal}</span></div>
                            <div className="flex justify-between"><span style={{ ...TY.bodyR, fontSize: "10px", color: t.textMuted }}>Vehicles</span><span style={{ ...TY.body, fontSize: "10px", color: t.text }}>{zm.fleetTotalVehicles}</span></div>
                            <div className="flex justify-between"><span style={{ ...TY.bodyR, fontSize: "10px", color: t.textMuted }}>Online</span><span style={{ ...TY.body, fontSize: "10px", color: t.text }}>{zm.fleetDriversOnline}</span></div>
                            <div className="flex justify-between"><span style={{ ...TY.bodyR, fontSize: "10px", color: t.textMuted }}>Utilization</span><span style={{ ...TY.body, fontSize: "10px", color: zm.fleetAvgUtilization >= 70 ? BRAND.green : STATUS.warning }}>{zm.fleetAvgUtilization}%</span></div>
                          </>);
                          if (entityFilter === "drivers") return (<>
                            <div className="flex justify-between"><span style={{ ...TY.bodyR, fontSize: "10px", color: t.textMuted }}>Drivers</span><span style={{ ...TY.body, fontSize: "10px", color: fc }}>{zm.driverTotal}</span></div>
                            <div className="flex justify-between"><span style={{ ...TY.bodyR, fontSize: "10px", color: t.textMuted }}>Active</span><span style={{ ...TY.body, fontSize: "10px", color: t.text }}>{zm.driverActive}</span></div>
                            <div className="flex justify-between"><span style={{ ...TY.bodyR, fontSize: "10px", color: t.textMuted }}>Idle</span><span style={{ ...TY.body, fontSize: "10px", color: zm.driverIdle > zm.driverActive ? STATUS.warning : t.text }}>{zm.driverIdle}</span></div>
                            <div className="flex justify-between"><span style={{ ...TY.bodyR, fontSize: "10px", color: t.textMuted }}>Avg rating</span><span style={{ ...TY.body, fontSize: "10px", color: t.text }}>★{zm.driverAvgRating}</span></div>
                          </>);
                          // "all" — balanced overview
                          return (<>
                            <div className="flex justify-between"><span style={{ ...TY.bodyR, fontSize: "10px", color: t.textMuted }}>Drivers</span><span style={{ ...TY.body, fontSize: "10px", color: t.text }}>{z.drivers}</span></div>
                            <div className="flex justify-between"><span style={{ ...TY.bodyR, fontSize: "10px", color: t.textMuted }}>Active rides</span><span style={{ ...TY.body, fontSize: "10px", color: t.text }}>{z.activeRides}</span></div>
                            <div className="flex justify-between"><span style={{ ...TY.bodyR, fontSize: "10px", color: t.textMuted }}>Match time</span><span style={{ ...TY.body, fontSize: "10px", color: t.text }}>{z.avgMatchTime}s</span></div>
                            {zm.hotelTotal > 0 && <div className="flex justify-between"><span style={{ ...TY.bodyR, fontSize: "10px", color: entityColor("hotel") }}>Hotels</span><span style={{ ...TY.body, fontSize: "10px", color: entityColor("hotel") }}>{zm.hotelTotal}</span></div>}
                            {zm.fleetTotal > 0 && <div className="flex justify-between"><span style={{ ...TY.bodyR, fontSize: "10px", color: entityColor("fleet") }}>Fleet</span><span style={{ ...TY.body, fontSize: "10px", color: entityColor("fleet") }}>{zm.fleetTotal}</span></div>}
                          </>);
                        })()}
                      </div>
                      <div className="mt-1.5 pt-1.5" style={{ borderTop: `1px solid ${t.border}` }}>
                        <span style={{ ...TY.cap, fontSize: "9px", color: t.textMuted }}>Click for details · Double-click to explore</span>
                      </div>
                    </div>
                  </motion.div>
                );
              })()}
            </AnimatePresence>

            {/* Entity hover tooltip (zone level) */}
            <AnimatePresence>
              {hoveredEntity && mapLevel === "zone" && !selectedEntity && (() => {
                const ent = zoneEntities.find(e => e.id === hoveredEntity);
                if (!ent) return null;
                return (
                  <motion.div
                    className="absolute z-30 pointer-events-none"
                    style={{ left: `${ent.x + 2}%`, top: `${ent.y - 4}%` }}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                  >
                    <div className="rounded-xl px-3 py-2 min-w-[140px]" style={{ background: t.overlay, backdropFilter: t.glassBlur, border: `1px solid ${t.borderStrong}`, boxShadow: t.shadowLg }}>
                      <div className="flex items-center gap-2 mb-1">
                        <div className="w-2 h-2 rounded-full" style={{ background: entityColor(ent.type) }} />
                        <span style={{ ...TY.body, fontSize: "11px", color: t.text }}>{ent.name}</span>
                      </div>
                      <span style={{ ...TY.cap, fontSize: "9px", color: entityColor(ent.type) }}>
                        {ent.type === "driver" && `${ent.status} · ${ent.vehicleType}${ent.vehicleType === "EV" ? " ⚡" : ""}`}
                        {ent.type === "rider" && `${ent.tripStatus}`}
                        {ent.type === "hotel" && `${ent.tier} · ${ent.rooms} rooms`}
                        {ent.type === "fleet" && `${ent.vehicles} vehicles · ${ent.utilization}%`}
                      </span>
                    </div>
                  </motion.div>
                );
              })()}
            </AnimatePresence>
          </div>
        </div>


        {/* ─── RIGHT: Decision Panel ─── */}
        <motion.div
          className="hidden md:flex flex-col w-[340px] xl:w-[370px] shrink-0"
          style={{ background: t.overlay, borderLeft: `1px solid ${t.border}` }}
          initial={{ x: 380 }}
          animate={{ x: 0 }}
          transition={{ duration: 0.5, ease: [0.19, 1, 0.22, 1] }}
        >
          {/* Panel header — contextual */}
          <div className="flex items-center justify-between px-4 h-12 shrink-0" style={{ borderBottom: `1px solid ${t.border}` }}>
            {selectedEntity ? (
              <div className="flex items-center gap-2 flex-1">
                <button onClick={() => setSelectedEntity(null)} className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: t.surfaceHover }}><ArrowLeft size={14} style={{ color: t.iconSecondary }} /></button>
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: entityColor(selectedEntity.type) }} />
                <span className="truncate" style={{ ...TY.sub, fontSize: "13px", color: t.text }}>{selectedEntity.name}</span>
              </div>
            ) : rightPanelMode === "zone-drilled" ? (
              <div className="flex items-center gap-2 flex-1">
                <button onClick={goBackToState} className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: t.surfaceHover }}><ArrowLeft size={14} style={{ color: t.iconSecondary }} /></button>
                <span style={{ ...TY.sub, fontSize: "13px", color: t.text }}>{drilledZone}</span>
                <span className="px-1.5 py-0.5 rounded-md" style={{ ...TY.cap, fontSize: "9px", color: t.textMuted, background: t.surface }}>{zoneEntities.length} entities</span>
              </div>
            ) : rightPanelMode === "zone-detail" ? (
              <div className="flex items-center gap-2 flex-1">
                <button onClick={() => setSelectedZone(null)} className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: t.surfaceHover }}><ArrowLeft size={14} style={{ color: t.iconSecondary }} /></button>
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: demandColor(selectedZoneData!.demandLevel, theme) }} />
                <span style={{ ...TY.sub, fontSize: "13px", color: t.text }}>{selectedZone}</span>
              </div>
            ) : rightPanelMode === "state-zones" ? (
              <div className="flex items-center gap-2 flex-1">
                <button onClick={goNational} className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: t.surfaceHover }}><ArrowLeft size={14} style={{ color: t.iconSecondary }} /></button>
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: stateStatusColor(selectedStateData?.status || "live") }} />
                <span style={{ ...TY.sub, fontSize: "13px", color: t.text }}>{drilledState} Zones</span>
              </div>
            ) : showOverlay ? (
              <div className="flex items-center gap-2 flex-1">
                <button onClick={() => setShowOverlay(null)} className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: t.surfaceHover }}><ArrowLeft size={14} style={{ color: t.iconSecondary }} /></button>
                <span style={{ ...TY.sub, fontSize: "13px", color: t.text }}>
                  {showOverlay === "verification" && "Driver Onboarding Pipeline"}
                  {showOverlay === "disputes" && `Trip Disputes · ${scopeLabel}`}
                  {showOverlay === "finance" && `Revenue · ${scopeLabel}`}
                </span>
              </div>
            ) : selectedState && rightPanelMode === "state-detail" ? (
              <div className="flex items-center gap-2 flex-1">
                <button onClick={() => setSelectedState(null)} className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: t.surfaceHover }}><ArrowLeft size={14} style={{ color: t.iconSecondary }} /></button>
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: stateStatusColor(selectedStateData?.status || "planned") }} />
                <span style={{ ...TY.sub, fontSize: "13px", color: t.text }}>{selectedState} Briefing</span>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-2">
                  <span style={{ ...TY.sub, fontSize: "13px", color: t.text }}>Decisions</span>
                  <span className="flex items-center gap-1 px-2 py-0.5 rounded-md" style={{ background: t.errorBg }}>
                    <AlertCircle size={10} style={{ color: STATUS.error }} />
                    <span style={{ ...TY.cap, fontSize: "9px", color: STATUS.error }}>{criticalActions.length} urgent</span>
                  </span>
                </div>
                <span style={{ ...TY.bodyR, fontSize: "10px", color: t.textGhost }}>{ACTION_QUEUE.length} items</span>
              </>
            )}
          </div>

          {/* ─── Sticky entity filter strip (visible when drilled into state/zone, not during overlays) ─── */}
          {drilledState && !showOverlay && (
            <div className="shrink-0 px-3 pt-2 pb-1" style={{ borderBottom: `1px solid ${t.borderSubtle}` }}>
              <div className="flex items-center gap-0.5 p-1 rounded-xl" style={{ background: t.surface }}>
                {ENTITY_FILTER_OPTIONS.map(f => {
                  const active = entityFilter === f.id;
                  return (
                    <button
                      key={f.id}
                      className="flex-1 flex items-center justify-center gap-1.5 h-7 rounded-lg transition-all"
                      style={{
                        background: active ? t.overlay : "transparent",
                        boxShadow: active ? t.shadow : "none",
                      }}
                      onClick={() => switchFilter(f.id)}
                    >
                      <f.icon size={10} style={{ color: active ? f.color : t.iconMuted }} />
                      <span style={{ ...TY.body, fontSize: "9px", letterSpacing: "-0.02em", color: active ? t.text : t.textMuted }}>{f.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Panel body */}
          <div className="flex-1 overflow-y-auto scrollbar-hide">
            <AnimatePresence mode="wait">

              {/* ════════ ENTITY DETAIL (Level 3 single-click) ════════ */}
              {selectedEntity && (() => {
                const ent = selectedEntity;
                return (
                  <motion.div key={`ent-${ent.id}`} initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} className="p-4">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${entityColor(ent.type)}15` }}>
                        {ent.type === "driver" && <Car size={18} style={{ color: entityColor(ent.type) }} />}
                        {ent.type === "rider" && <User size={18} style={{ color: entityColor(ent.type) }} />}
                        {ent.type === "hotel" && <Building2 size={18} style={{ color: entityColor(ent.type) }} />}
                        {ent.type === "fleet" && <Car size={18} style={{ color: entityColor(ent.type) }} />}
                      </div>
                      <div className="min-w-0">
                        <span className="block truncate" style={{ ...TY.sub, fontSize: "13px", color: t.text }}>{ent.name}</span>
                        <div className="flex items-center gap-2">
                          <StatusBadge label={ent.type} color={entityColor(ent.type)} />
                          {ent.vehicleType && <StatusBadge label={ent.vehicleType} color={ent.vehicleType === "EV" ? BRAND.green : t.textMuted} />}
                        </div>
                      </div>
                    </div>

                    {ent.type === "driver" && (
                      <>
                        <div className="grid grid-cols-3 gap-2.5 mb-4">
                          {[
                            { label: "RATING", val: ent.rating || "—", icon: Star },
                            { label: "RIDES", val: ent.ridesCompleted || 0, icon: MapPin },
                            { label: "STATUS", val: ent.status || "—", icon: Activity },
                          ].map(s => (
                            <div key={s.label} className="p-3 rounded-xl" style={{ background: t.surface, border: `1px solid ${t.borderSubtle}` }}>
                              <s.icon size={12} style={{ color: t.iconMuted, marginBottom: 6 }} />
                              <div style={{ ...TY.h, fontSize: "18px", color: t.text }}>{s.val}</div>
                              <span style={{ ...TY.label, fontSize: "7px", color: t.textFaint }}>{s.label}</span>
                            </div>
                          ))}
                        </div>
                        {ent.currentTrip && (
                          <div className="p-3 rounded-xl mb-4 flex items-center gap-3" style={{ background: `${BRAND.green}08`, border: `1px solid ${BRAND.green}15` }}>
                            <MapPin size={14} style={{ color: BRAND.green }} />
                            <div>
                              <span className="block" style={{ ...TY.body, fontSize: "12px", color: BRAND.green }}>Active trip {ent.currentTrip}</span>
                              <span style={{ ...TY.bodyR, fontSize: "10px", color: t.textMuted }}>Currently en route</span>
                            </div>
                          </div>
                        )}
                        {ent.status === "idle" && (
                          <div className="p-3 rounded-xl mb-4" style={{ background: `${STATUS.warning}08`, border: `1px solid ${STATUS.warning}15` }}>
                            <div className="flex items-center gap-2 mb-1">
                              <Clock size={12} style={{ color: STATUS.warning }} />
                              <span style={{ ...TY.body, fontSize: "11px", color: STATUS.warning }}>Idle</span>
                            </div>
                            <span style={{ ...TY.bodyR, fontSize: "10px", color: t.textMuted }}>No active trip. Available for dispatch.</span>
                          </div>
                        )}
                        <SectionLabel>ACTIONS</SectionLabel>
                        <ActionRow label="View driver profile" icon={Users} onClick={() => navigate("/admin/drivers")} />
                        <ActionRow label="View trip history" icon={MapPin} onClick={() => navigate("/admin/rides")} />
                        <ActionRow label="Send message" icon={Radio} />
                      </>
                    )}
                    {ent.type === "rider" && (
                      <>
                        <div className="grid grid-cols-2 gap-2.5 mb-4">
                          {[
                            { label: "TRIP STATUS", val: ent.tripStatus || "—", icon: Activity },
                            { label: "TOTAL TRIPS", val: ent.trips || 0, icon: MapPin },
                          ].map(s => (
                            <div key={s.label} className="p-3 rounded-xl" style={{ background: t.surface, border: `1px solid ${t.borderSubtle}` }}>
                              <s.icon size={12} style={{ color: t.iconMuted, marginBottom: 6 }} />
                              <div style={{ ...TY.h, fontSize: "18px", color: t.text }}>{s.val}</div>
                              <span style={{ ...TY.label, fontSize: "7px", color: t.textFaint }}>{s.label}</span>
                            </div>
                          ))}
                        </div>
                        <SectionLabel>ACTIONS</SectionLabel>
                        <ActionRow label="View rider profile" icon={User} onClick={() => navigate("/admin/riders")} />
                        <ActionRow label="View trip history" icon={MapPin} onClick={() => navigate("/admin/rides")} />
                      </>
                    )}
                    {ent.type === "hotel" && (
                      <>
                        <div className="grid grid-cols-3 gap-2.5 mb-4">
                          {[
                            { label: "TIER", val: ent.tier || "—", icon: Star },
                            { label: "ROOMS", val: ent.rooms || 0, icon: Building2 },
                            { label: "RIDE RATING", val: ent.guestRating || "—", icon: Star },
                          ].map(s => (
                            <div key={s.label} className="p-3 rounded-xl" style={{ background: t.surface, border: `1px solid ${t.borderSubtle}` }}>
                              <s.icon size={12} style={{ color: t.iconMuted, marginBottom: 6 }} />
                              <div style={{ ...TY.h, fontSize: "18px", color: t.text }}>{s.val}</div>
                              <span style={{ ...TY.label, fontSize: "7px", color: t.textFaint }}>{s.label}</span>
                            </div>
                          ))}
                        </div>
                        <SectionLabel>ACTIONS</SectionLabel>
                        <ActionRow label="View hotel detail" icon={Building2} onClick={() => navigate("/admin/hotels")} />
                        <ActionRow label="View guest rides" icon={MapPin} onClick={() => navigate("/admin/rides")} />
                        <ActionRow label="Revenue breakdown" icon={Wallet} onClick={() => navigate("/admin/finance")} />
                      </>
                    )}
                    {ent.type === "fleet" && (
                      <>
                        <div className="grid grid-cols-3 gap-2.5 mb-4">
                          {[
                            { label: "VEHICLES", val: ent.vehicles || 0, icon: Car },
                            { label: "ONLINE", val: ent.driversOnline || 0, icon: Users },
                            { label: "UTIL.", val: `${ent.utilization || 0}%`, icon: Activity },
                          ].map(s => (
                            <div key={s.label} className="p-3 rounded-xl" style={{ background: t.surface, border: `1px solid ${t.borderSubtle}` }}>
                              <s.icon size={12} style={{ color: t.iconMuted, marginBottom: 6 }} />
                              <div style={{ ...TY.h, fontSize: "18px", color: t.text }}>{s.val}</div>
                              <span style={{ ...TY.label, fontSize: "7px", color: t.textFaint }}>{s.label}</span>
                            </div>
                          ))}
                        </div>
                        <SectionLabel>ACTIONS</SectionLabel>
                        <ActionRow label="View fleet detail" icon={Car} onClick={() => navigate("/admin/fleet")} />
                        <ActionRow label="View fleet drivers" icon={Users} onClick={() => navigate("/admin/drivers")} />
                        <ActionRow label="Payout history" icon={Wallet} onClick={() => navigate("/admin/finance")} />
                      </>
                    )}
                  </motion.div>
                );
              })()}

              {/* ════════ ZONE DRILLED — entity list + filter (Level 3) ════════ */}
              {rightPanelMode === "zone-drilled" && (
                <motion.div key="zone-drilled" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }}>
                  {/* Entity-contextual summary */}
                  <div className="px-4 pt-3 pb-2">
                    {(() => {
                      const zm = getZoneEntityMetrics(drilledZone!);
                      const counts = getZoneEntityCounts(drilledZone!, "all");

                      if (entityFilter === "riders") return (
                        <div className="grid grid-cols-3 gap-2">
                          {[
                            { label: "In-ride", val: zm.riderInRide, col: BRAND.green },
                            { label: "Matched", val: zm.riderMatched, col: STATUS.info },
                            { label: "Waiting", val: zm.riderWaiting, col: zm.riderWaiting > 3 ? STATUS.warning : entityColor("rider") },
                          ].map(s => (
                            <div key={s.label} className="p-2 rounded-lg text-center" style={{ background: `${s.col}08`, border: `1px solid ${s.col}15` }}>
                              <div style={{ ...TY.h, fontSize: "16px", color: s.col }}>{s.val}</div>
                              <span style={{ ...TY.cap, fontSize: "7px", color: t.textMuted }}>{s.label}</span>
                            </div>
                          ))}
                        </div>
                      );
                      if (entityFilter === "hotels") return (
                        <div className="grid grid-cols-3 gap-2">
                          {[
                            { label: "Hotels", val: zm.hotelTotal, col: entityColor("hotel") },
                            { label: "Rooms", val: zm.hotelTotalRooms, col: entityColor("hotel") },
                            { label: "Rating", val: `★${zm.hotelAvgRating}`, col: zm.hotelAvgRating >= 4.5 ? BRAND.green : STATUS.warning },
                          ].map(s => (
                            <div key={s.label} className="p-2 rounded-lg text-center" style={{ background: `${typeof s.col === 'string' ? s.col : ''}08`, border: `1px solid ${typeof s.col === 'string' ? s.col : ''}15` }}>
                              <div style={{ ...TY.h, fontSize: "16px", color: s.col }}>{s.val}</div>
                              <span style={{ ...TY.cap, fontSize: "7px", color: t.textMuted }}>{s.label}</span>
                            </div>
                          ))}
                        </div>
                      );
                      if (entityFilter === "fleet") return (
                        <div className="grid grid-cols-3 gap-2">
                          {[
                            { label: "Vehicles", val: zm.fleetTotalVehicles, col: entityColor("fleet") },
                            { label: "Online", val: zm.fleetDriversOnline, col: BRAND.green },
                            { label: "Util.", val: `${zm.fleetAvgUtilization}%`, col: zm.fleetAvgUtilization >= 70 ? BRAND.green : STATUS.warning },
                          ].map(s => (
                            <div key={s.label} className="p-2 rounded-lg text-center" style={{ background: `${s.col}08`, border: `1px solid ${s.col}15` }}>
                              <div style={{ ...TY.h, fontSize: "16px", color: s.col }}>{s.val}</div>
                              <span style={{ ...TY.cap, fontSize: "7px", color: t.textMuted }}>{s.label}</span>
                            </div>
                          ))}
                        </div>
                      );
                      if (entityFilter === "drivers") return (
                        <div className="grid grid-cols-4 gap-2">
                          {[
                            { label: "Active", val: zm.driverActive, col: BRAND.green },
                            { label: "En-route", val: zm.driverEnRoute, col: STATUS.info },
                            { label: "Idle", val: zm.driverIdle, col: zm.driverIdle > zm.driverActive ? STATUS.warning : entityColor("driver") },
                            { label: "EV", val: zm.driverEVCount, col: BRAND.green },
                          ].map(s => (
                            <div key={s.label} className="p-2 rounded-lg text-center" style={{ background: `${s.col}08`, border: `1px solid ${s.col}15` }}>
                              <div style={{ ...TY.h, fontSize: "16px", color: s.col }}>{s.val}</div>
                              <span style={{ ...TY.cap, fontSize: "7px", color: t.textMuted }}>{s.label}</span>
                            </div>
                          ))}
                        </div>
                      );
                      // "all" — balanced counts
                      return (
                        <div className="grid grid-cols-4 gap-2">
                          {[
                            { label: "Drivers", val: counts.drivers, col: entityColor("driver") },
                            { label: "Riders", val: counts.riders, col: entityColor("rider") },
                            { label: "Hotels", val: counts.hotels, col: entityColor("hotel") },
                            { label: "Fleet", val: counts.fleet, col: entityColor("fleet") },
                          ].map(s => (
                            <div key={s.label} className="p-2 rounded-lg text-center" style={{ background: `${s.col}08`, border: `1px solid ${s.col}15` }}>
                              <div style={{ ...TY.h, fontSize: "16px", color: s.col }}>{s.val}</div>
                              <span style={{ ...TY.cap, fontSize: "7px", color: t.textMuted }}>{s.label}</span>
                            </div>
                          ))}
                        </div>
                      );
                    })()}
                  </div>

                  {/* Entity list */}
                  <div className="px-3 pb-3">
                    <SectionLabel>{entityFilter === "all" ? "ALL ENTITIES" : entityFilter.toUpperCase()}</SectionLabel>
                    {zoneEntities.length === 0 ? (
                      <div className="py-6 text-center">
                        <span style={{ ...TY.bodyR, fontSize: "11px", color: t.textFaint }}>No {entityFilter === "all" ? "entities" : entityFilter} in this zone</span>
                      </div>
                    ) : (
                      zoneEntities.slice(0, 20).map(ent => (
                        <button
                          key={ent.id}
                          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors mb-0.5"
                          style={{ background: selectedEntity?.id === ent.id ? t.surfaceHover : "transparent" }}
                          onClick={() => setSelectedEntity(ent)}
                          onMouseEnter={e => { e.currentTarget.style.background = t.surfaceHover; setHoveredEntity(ent.id); }}
                          onMouseLeave={e => { e.currentTarget.style.background = selectedEntity?.id === ent.id ? t.surfaceHover : "transparent"; setHoveredEntity(null); }}
                        >
                          <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0" style={{ background: `${entityColor(ent.type)}15` }}>
                            <span style={{ ...TY.cap, fontSize: "10px", color: entityColor(ent.type) }}>{entityIcon(ent.type)}</span>
                          </div>
                          <div className="flex-1 min-w-0 text-left">
                            <span className="block truncate" style={{ ...TY.body, fontSize: "12px", color: t.text }}>{ent.name}</span>
                            <span className="block truncate" style={{ ...TY.bodyR, fontSize: "10px", color: t.textMuted }}>
                              {ent.type === "driver" && `${ent.status} · ${ent.vehicleType}${ent.rating ? ` · ★${ent.rating}` : ""}`}
                              {ent.type === "rider" && `${ent.tripStatus} · ${ent.trips} trips`}
                              {ent.type === "hotel" && `${ent.tier} · ${ent.rooms} rooms`}
                              {ent.type === "fleet" && `${ent.vehicles} vehicles · ${ent.utilization}% util`}
                            </span>
                          </div>
                          <ChevronRight size={12} style={{ color: t.textGhost }} />
                        </button>
                      ))
                    )}
                  </div>
                </motion.div>
              )}

              {/* ════════ ZONE DETAIL (single-click at state level) ════════ */}
              {rightPanelMode === "zone-detail" && selectedZoneData && (
                <motion.div key="zone-detail" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} className="p-4">
                  {/* Entity-contextual top stats */}
                  {(() => {
                    const zm = getZoneEntityMetrics(selectedZone!);
                    const topStats = entityFilter === "riders" ? [
                      { label: "RIDERS", val: zm.riderTotal, icon: Navigation },
                      { label: "IN-RIDE", val: zm.riderInRide, icon: MapPin },
                      { label: "WAITING", val: zm.riderWaiting, icon: Clock },
                    ] : entityFilter === "hotels" ? [
                      { label: "HOTELS", val: zm.hotelTotal, icon: Building2 },
                      { label: "ROOMS", val: zm.hotelTotalRooms, icon: Building2 },
                      { label: "RATING", val: `★${zm.hotelAvgRating}`, icon: Star },
                    ] : entityFilter === "fleet" ? [
                      { label: "FLEET", val: zm.fleetTotal, icon: Car },
                      { label: "VEHICLES", val: zm.fleetTotalVehicles, icon: Car },
                      { label: "UTIL.", val: `${zm.fleetAvgUtilization}%`, icon: Activity },
                    ] : entityFilter === "drivers" ? [
                      { label: "DRIVERS", val: zm.driverTotal, icon: Car },
                      { label: "ACTIVE", val: zm.driverActive, icon: MapPin },
                      { label: "RATING", val: `★${zm.driverAvgRating}`, icon: Star },
                    ] : [
                      { label: "DRIVERS", val: selectedZoneData.drivers, icon: Users },
                      { label: "RIDES", val: selectedZoneData.activeRides, icon: MapPin },
                      { label: "MATCH", val: `${selectedZoneData.avgMatchTime}s`, icon: Clock },
                    ];
                    return (
                      <div className="grid grid-cols-3 gap-2.5 mb-4">
                        {topStats.map(s => (
                          <div key={s.label} className="p-3 rounded-xl" style={{ background: t.surface, border: `1px solid ${t.borderSubtle}` }}>
                            <s.icon size={12} style={{ color: t.iconMuted, marginBottom: 6 }} />
                            <div style={{ ...TY.h, fontSize: "20px", color: t.text }}>{s.val}</div>
                            <span style={{ ...TY.label, fontSize: "7px", color: t.textFaint }}>{s.label}</span>
                          </div>
                        ))}
                      </div>
                    );
                  })()}

                  {/* Demand / status indicator — entity-contextual */}
                  {(() => {
                    const zm = getZoneEntityMetrics(selectedZone!);
                    if (entityFilter === "hotels") {
                      const hasHotels = zm.hotelTotal > 0;
                      return (
                        <div className="p-3 rounded-xl mb-4 flex items-center gap-3" style={{ background: `${entityColor("hotel")}08`, border: `1px solid ${entityColor("hotel")}15` }}>
                          <Building2 size={16} style={{ color: entityColor("hotel") }} />
                          <div>
                            <span className="block" style={{ ...TY.body, fontSize: "12px", color: entityColor("hotel") }}>
                              {hasHotels ? `${zm.hotelTotal} hotel partner${zm.hotelTotal > 1 ? "s" : ""} · ${zm.hotelTiers.join(", ")}` : "No hotel partners in zone"}
                            </span>
                            <span style={{ ...TY.bodyR, fontSize: "10px", color: t.textMuted }}>
                              {hasHotels ? `★${zm.hotelAvgRating} avg ride rating` : "Consider expanding coverage"}
                            </span>
                          </div>
                        </div>
                      );
                    }
                    if (entityFilter === "fleet") {
                      const hasFleet = zm.fleetTotal > 0;
                      const utilOk = zm.fleetAvgUtilization >= 70;
                      return (
                        <div className="p-3 rounded-xl mb-4 flex items-center gap-3" style={{ background: `${entityColor("fleet")}08`, border: `1px solid ${entityColor("fleet")}15` }}>
                          <Car size={16} style={{ color: entityColor("fleet") }} />
                          <div>
                            <span className="block" style={{ ...TY.body, fontSize: "12px", color: entityColor("fleet") }}>
                              {hasFleet ? `${zm.fleetAvgUtilization}% utilization · ${zm.fleetDriversOnline} online` : "No fleet operators in zone"}
                            </span>
                            <span style={{ ...TY.bodyR, fontSize: "10px", color: t.textMuted }}>
                              {hasFleet ? (utilOk ? "Fleet performing well" : "Utilization below 70% target") : "No fleet presence"}
                            </span>
                          </div>
                        </div>
                      );
                    }
                    if (entityFilter === "riders") {
                      const waitRatio = zm.riderTotal > 0 ? zm.riderWaiting / zm.riderTotal : 0;
                      return (
                        <div className="p-3 rounded-xl mb-4 flex items-center gap-3" style={{ background: `${entityColor("rider")}08`, border: `1px solid ${entityColor("rider")}15` }}>
                          <Navigation size={16} style={{ color: entityColor("rider") }} />
                          <div>
                            <span className="block" style={{ ...TY.body, fontSize: "12px", color: entityColor("rider") }}>
                              {zm.riderTotal > 0 ? `${zm.riderInRide} in-ride · ${zm.riderWaiting} waiting` : "No active riders"}
                            </span>
                            <span style={{ ...TY.bodyR, fontSize: "10px", color: t.textMuted }}>
                              {waitRatio > 0.3 ? "High wait ratio — consider more supply" : "Demand balanced"}
                            </span>
                          </div>
                        </div>
                      );
                    }
                    // drivers or all — original behavior
                    return (
                      <div className="p-3 rounded-xl mb-4 flex items-center gap-3" style={{ background: `${demandColor(selectedZoneData.demandLevel, theme)}08`, border: `1px solid ${demandColor(selectedZoneData.demandLevel, theme)}15` }}>
                        {selectedZoneData.demandLevel === "surge" ? <Flame size={16} style={{ color: STATUS.warning }} /> : <Activity size={16} style={{ color: demandColor(selectedZoneData.demandLevel, theme) }} />}
                        <div>
                          <span className="block" style={{ ...TY.body, fontSize: "12px", color: demandColor(selectedZoneData.demandLevel, theme) }}>
                            {selectedZoneData.demandLevel === "surge" ? `Surge ${selectedZoneData.surgeMultiplier}x` : `${selectedZoneData.demandLevel.charAt(0).toUpperCase() + selectedZoneData.demandLevel.slice(1)} demand`}
                          </span>
                          <span style={{ ...TY.bodyR, fontSize: "10px", color: t.textMuted }}>
                            {selectedZoneData.demandLevel === "surge" ? "Consider dispatching more drivers" : "Supply balanced"}
                          </span>
                        </div>
                      </div>
                    );
                  })()}

                  {/* Entity-contextual breakdown for this zone */}
                  {(() => {
                    const zm = getZoneEntityMetrics(selectedZone!);
                    const counts = getZoneEntityCounts(selectedZone!, "all");
                    if (counts.total === 0) return null;

                    // When a specific filter is active, show operational detail for that entity
                    if (entityFilter === "riders" && zm.riderTotal > 0) return (
                      <>
                        <SectionLabel>RIDER STATUS</SectionLabel>
                        <div className="grid grid-cols-3 gap-2 mb-4">
                          {[
                            { label: "In-ride", val: zm.riderInRide, col: BRAND.green },
                            { label: "Matched", val: zm.riderMatched, col: STATUS.info },
                            { label: "Waiting", val: zm.riderWaiting, col: zm.riderWaiting > 3 ? STATUS.warning : t.textMuted },
                          ].map(s => (
                            <div key={s.label} className="p-2 rounded-lg text-center" style={{ background: `${typeof s.col === 'string' ? s.col : ''}08`, border: `1px solid ${typeof s.col === 'string' ? s.col : ''}12` }}>
                              <div style={{ ...TY.h, fontSize: "14px", color: s.col }}>{s.val}</div>
                              <span style={{ ...TY.cap, fontSize: "7px", color: t.textMuted }}>{s.label}</span>
                            </div>
                          ))}
                        </div>
                      </>
                    );
                    if (entityFilter === "hotels" && zm.hotelTotal > 0) return (
                      <>
                        <SectionLabel>HOTEL DETAIL</SectionLabel>
                        <div className="grid grid-cols-3 gap-2 mb-4">
                          {[
                            { label: "Partners", val: zm.hotelTotal, col: entityColor("hotel") },
                            { label: "Rooms", val: zm.hotelTotalRooms, col: entityColor("hotel") },
                            { label: "Rating", val: `★${zm.hotelAvgRating}`, col: zm.hotelAvgRating >= 4.5 ? BRAND.green : STATUS.warning },
                          ].map(s => (
                            <div key={s.label} className="p-2 rounded-lg text-center" style={{ background: `${s.col}08`, border: `1px solid ${s.col}12` }}>
                              <div style={{ ...TY.h, fontSize: "14px", color: s.col }}>{s.val}</div>
                              <span style={{ ...TY.cap, fontSize: "7px", color: t.textMuted }}>{s.label}</span>
                            </div>
                          ))}
                        </div>
                        {zm.hotelTiers.length > 0 && (
                          <div className="text-center mb-4">
                            <span style={{ ...TY.cap, fontSize: "9px", color: t.textMuted }}>{zm.hotelTiers.join(" · ")}</span>
                          </div>
                        )}
                      </>
                    );
                    if (entityFilter === "fleet" && zm.fleetTotal > 0) return (
                      <>
                        <SectionLabel>FLEET OPERATIONS</SectionLabel>
                        <div className="grid grid-cols-3 gap-2 mb-4">
                          {[
                            { label: "Vehicles", val: zm.fleetTotalVehicles, col: entityColor("fleet") },
                            { label: "Online", val: zm.fleetDriversOnline, col: BRAND.green },
                            { label: "Util.", val: `${zm.fleetAvgUtilization}%`, col: zm.fleetAvgUtilization >= 70 ? BRAND.green : STATUS.warning },
                          ].map(s => (
                            <div key={s.label} className="p-2 rounded-lg text-center" style={{ background: `${s.col}08`, border: `1px solid ${s.col}12` }}>
                              <div style={{ ...TY.h, fontSize: "14px", color: s.col }}>{s.val}</div>
                              <span style={{ ...TY.cap, fontSize: "7px", color: t.textMuted }}>{s.label}</span>
                            </div>
                          ))}
                        </div>
                      </>
                    );
                    if (entityFilter === "drivers" && zm.driverTotal > 0) return (
                      <>
                        <SectionLabel>DRIVER STATUS</SectionLabel>
                        <div className="grid grid-cols-4 gap-2 mb-4">
                          {[
                            { label: "Active", val: zm.driverActive, col: BRAND.green },
                            { label: "En-route", val: zm.driverEnRoute, col: STATUS.info },
                            { label: "Idle", val: zm.driverIdle, col: zm.driverIdle > zm.driverActive ? STATUS.warning : t.textMuted },
                            { label: "EV", val: zm.driverEVCount, col: BRAND.green },
                          ].map(s => (
                            <div key={s.label} className="p-2 rounded-lg text-center" style={{ background: `${typeof s.col === 'string' ? s.col : ''}08`, border: `1px solid ${typeof s.col === 'string' ? s.col : ''}12` }}>
                              <div style={{ ...TY.h, fontSize: "14px", color: s.col }}>{s.val}</div>
                              <span style={{ ...TY.cap, fontSize: "7px", color: t.textMuted }}>{s.label}</span>
                            </div>
                          ))}
                        </div>
                      </>
                    );

                    // "all" — show balanced entity counts
                    return (
                      <>
                        <SectionLabel>ENTITIES IN ZONE</SectionLabel>
                        <div className="grid grid-cols-4 gap-2 mb-4">
                          {[
                            { label: "Drivers", val: counts.drivers, col: entityColor("driver") },
                            { label: "Riders", val: counts.riders, col: entityColor("rider") },
                            { label: "Hotels", val: counts.hotels, col: entityColor("hotel") },
                            { label: "Fleet", val: counts.fleet, col: entityColor("fleet") },
                          ].map(s => (
                            <div key={s.label} className="p-2 rounded-lg text-center" style={{ background: `${s.col}08`, border: `1px solid ${s.col}12` }}>
                              <div style={{ ...TY.h, fontSize: "14px", color: s.col }}>{s.val}</div>
                              <span style={{ ...TY.cap, fontSize: "7px", color: t.textMuted }}>{s.label}</span>
                            </div>
                          ))}
                        </div>
                      </>
                    );
                  })()}

                  <CTAButton label={`Explore ${selectedZone}`} icon={Eye} onClick={() => drillIntoZone(selectedZone!)} />

                  <div className="mt-3">
                    <SectionLabel>ACTIONS</SectionLabel>
                    {(() => {
                      if (entityFilter === "hotels") return (
                        <>
                          <ActionRow label="View hotel partners in zone" icon={Building2} onClick={() => navigate("/admin/hotels")} />
                          <ActionRow label="Review pending invoices" icon={CreditCard} onClick={() => navigate("/admin/finance")} />
                          <ActionRow label="Guest ride history" icon={MapPin} onClick={() => navigate("/admin/rides")} />
                        </>
                      );
                      if (entityFilter === "fleet") return (
                        <>
                          <ActionRow label="View fleet owners in zone" icon={Car} onClick={() => navigate("/admin/fleet")} />
                          <ActionRow label="Fleet compliance status" icon={Shield} onClick={() => navigate("/admin/fleet")} />
                          <ActionRow label="Pending fleet payouts" icon={Wallet} onClick={() => navigate("/admin/finance")} />
                        </>
                      );
                      if (entityFilter === "riders") return (
                        <>
                          <ActionRow label="View active riders" icon={Navigation} onClick={() => navigate("/admin/rides")} />
                          <ActionRow label="Rider demand heatmap" icon={Activity} onClick={() => navigate("/admin/rides")} />
                          <ActionRow label="Adjust surge" icon={TrendingUp} onClick={() => navigate("/admin/settings")} />
                        </>
                      );
                      // drivers or all
                      return (
                        <>
                          <ActionRow label="View all rides in zone" icon={MapPin} onClick={() => navigate("/admin/rides")} />
                          <ActionRow label="Message drivers" icon={Users} onClick={() => navigate("/admin/drivers")} />
                          <ActionRow label="Adjust surge" icon={TrendingUp} onClick={() => navigate("/admin/settings")} />
                        </>
                      );
                    })()}
                  </div>
                </motion.div>
              )}

              {/* ════════ STATE ZONES — entity filter + zone list (Level 2 drilled, no zone selected) ════════ */}
              {rightPanelMode === "state-zones" && (
                <motion.div key="state-zones" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }}>
                  {/* State summary — entity-contextual */}
                  {selectedStateData && (
                    <div className="px-4 py-3" style={{ borderBottom: `1px solid ${t.borderSubtle}` }}>
                      <div className="grid grid-cols-3 gap-2">
                        {(() => {
                          const em = getStateEntityMetrics(drilledState!);
                          if (entityFilter === "hotels") return [
                            { label: "HOTELS", val: em.hotelTotal, c: entityColor("hotel") },
                            { label: "ROOMS", val: em.hotelTotalRooms.toLocaleString(), c: t.text },
                            { label: "RATING", val: `★${em.hotelAvgRating}`, c: em.hotelAvgRating >= 4.5 ? BRAND.green : STATUS.warning },
                          ];
                          if (entityFilter === "fleet") return [
                            { label: "FLEETS", val: em.fleetTotal, c: entityColor("fleet") },
                            { label: "VEHICLES", val: em.fleetTotalVehicles, c: t.text },
                            { label: "UTIL.", val: `${em.fleetAvgUtilization}%`, c: em.fleetAvgUtilization >= 70 ? BRAND.green : STATUS.warning },
                          ];
                          if (entityFilter === "riders") return [
                            { label: "RIDERS", val: em.riderTotal, c: entityColor("rider") },
                            { label: "IN-RIDE", val: em.riderInRide, c: t.text },
                            { label: "WAITING", val: em.riderWaiting, c: em.riderWaiting > em.riderInRide * 0.3 ? STATUS.warning : t.text },
                          ];
                          if (entityFilter === "drivers") return [
                            { label: "DRIVERS", val: em.driverTotal, c: entityColor("driver") },
                            { label: "ACTIVE", val: em.driverActive, c: t.text },
                            { label: "RATING", val: `★${em.driverAvgRating}`, c: em.driverAvgRating >= 4.5 ? BRAND.green : STATUS.warning },
                          ];
                          const allEm = getStateEntityMetrics(drilledState!);
                          return [
                            { label: "DRIVERS", val: allEm.driverTotal, c: entityColor("driver") },
                            { label: "RIDERS", val: allEm.riderTotal, c: entityColor("rider") },
                            { label: "HOTELS", val: allEm.hotelTotal, c: entityColor("hotel") },
                            { label: "FLEET", val: allEm.fleetTotal, c: entityColor("fleet") },
                            { label: "ACTIVE", val: selectedStateData.activeRides.toLocaleString(), c: t.text },
                            { label: "REVENUE", val: formatNaira(selectedStateData.revenue), c: BRAND.green },
                          ];
                        })().map(s => (
                          <div key={s.label} className="text-center">
                            <span className="block" style={{ ...TY.h, fontSize: "16px", color: s.c }}>{s.val}</span>
                            <span style={{ ...TY.cap, fontSize: "7px", color: t.textFaint }}>{s.label}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Zone list */}
                  <div className="px-3 pt-3 pb-2">
                    <SectionLabel>ZONES BY {entityFilter === "all" ? "ACTIVITY" : entityFilter.toUpperCase()}</SectionLabel>
                    {zoneListWithCounts.map(z => {
                      const col = demandColor(z.demandLevel, theme);
                      const isSel = selectedZone === z.name;
                      return (
                        <button
                          key={z.name}
                          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors mb-0.5"
                          style={{ background: isSel ? t.surfaceHover : "transparent" }}
                          onClick={() => { setSelectedZone(z.name); setShowOverlay(null); }}
                          onDoubleClick={() => drillIntoZone(z.name)}
                          onMouseEnter={e => { e.currentTarget.style.background = t.surfaceHover; setHoveredZone(z.name); }}
                          onMouseLeave={e => { e.currentTarget.style.background = isSel ? t.surfaceHover : "transparent"; setHoveredZone(null); }}
                        >
                          <div className="w-3 h-3 rounded-full shrink-0" style={{ background: col }} />
                          <div className="flex-1 min-w-0 text-left">
                            <span className="block truncate" style={{ ...TY.body, fontSize: "12px", color: t.text }}>{z.name}</span>
                            <span className="block truncate" style={{ ...TY.bodyR, fontSize: "10px", color: t.textMuted }}>
                              {getZoneSubtitle(z.name, entityFilter, z.drivers, z.activeRides, z.avgMatchTime)}
                            </span>
                          </div>
                          {entityFilter !== "all" ? (
                            <div className="flex items-center gap-1.5 shrink-0">
                              <span className="px-2 py-0.5 rounded-md" style={{ ...TY.body, fontSize: "11px", background: `${ENTITY_FILTER_OPTIONS.find(f => f.id === entityFilter)?.color}12`, color: ENTITY_FILTER_OPTIONS.find(f => f.id === entityFilter)?.color }}>
                                {z.filterCount}
                              </span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-1 shrink-0">
                              {z.counts.drivers > 0 && <span className="w-5 h-5 rounded flex items-center justify-center" style={{ background: `${entityColor("driver")}12`, ...TY.cap, fontSize: "8px", color: entityColor("driver") }}>{z.counts.drivers}</span>}
                              {z.counts.riders > 0 && <span className="w-5 h-5 rounded flex items-center justify-center" style={{ background: `${entityColor("rider")}12`, ...TY.cap, fontSize: "8px", color: entityColor("rider") }}>{z.counts.riders}</span>}
                              {z.counts.hotels > 0 && <span className="w-5 h-5 rounded flex items-center justify-center" style={{ background: `${entityColor("hotel")}12`, ...TY.cap, fontSize: "8px", color: entityColor("hotel") }}>{z.counts.hotels}</span>}
                              {z.counts.fleet > 0 && <span className="w-5 h-5 rounded flex items-center justify-center" style={{ background: `${entityColor("fleet")}12`, ...TY.cap, fontSize: "8px", color: entityColor("fleet") }}>{z.counts.fleet}</span>}
                            </div>
                          )}
                          <ChevronRight size={12} style={{ color: t.textGhost }} />
                        </button>
                      );
                    })}
                  </div>
                </motion.div>
              )}

              {/* ════════ STATE BRIEFING (national single-click) ════════ */}
              {rightPanelMode === "state-detail" && selectedStateData && (
                <motion.div key="state-detail" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} className="p-4">
                  <div className="flex items-center gap-2 mb-4">
                    <StatusBadge label={selectedStateData.status} color={stateStatusColor(selectedStateData.status)} />
                    <span style={{ ...TY.bodyR, fontSize: "11px", color: t.textMuted }}>{selectedStateData.zones} zones configured</span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 mb-5">
                    {(() => {
                      const bm = getStateEntityMetrics(selectedStateData.name);
                      return [
                      { label: "DRIVERS", val: selectedStateData.drivers, c: t.text },
                      { label: "ACTIVE RIDES", val: selectedStateData.activeRides.toLocaleString(), c: t.text },
                      { label: "REVENUE", val: formatNaira(selectedStateData.revenue), c: BRAND.green },
                      { label: "COMPLETION", val: `${selectedStateData.completionRate}%`, c: selectedStateData.completionRate >= 90 ? BRAND.green : STATUS.warning },
                      { label: "AVG MATCH", val: `${selectedStateData.avgMatchTime}s`, c: selectedStateData.avgMatchTime <= 60 ? BRAND.green : STATUS.warning },
                      { label: "ZONES", val: selectedStateData.zones, c: t.text },
                      { label: "HOTELS", val: bm.hotelTotal, c: bm.hotelTotal > 0 ? entityColor("hotel") : t.textFaint },
                      { label: "FLEET OWNERS", val: bm.fleetTotal, c: bm.fleetTotal > 0 ? entityColor("fleet") : t.textFaint },
                      { label: "RIDERS NOW", val: bm.riderTotal, c: bm.riderTotal > 0 ? entityColor("rider") : t.textFaint },
                    ];
                    })().map(s => (
                      <div key={s.label} className="p-2.5 rounded-xl" style={{ background: t.surface, border: `1px solid ${t.borderSubtle}` }}>
                        <span className="block" style={{ ...TY.h, fontSize: "16px", color: s.c }}>{s.val}</span>
                        <span style={{ ...TY.label, fontSize: "6.5px", color: t.textFaint }}>{s.label}</span>
                      </div>
                    ))}
                  </div>

                  <SectionLabel>OPERATIONAL HEALTH</SectionLabel>
                  <div className="space-y-2 mb-5">
                    {(() => {
                      const sd = selectedStateData;
                      // Supply-demand ratio: idle drivers / waiting riders
                      // Source: driver_sessions.status='idle' / trips.status='requested' AND matched_at IS NULL
                      const em = getStateEntityMetrics(sd.name);
                      const idleDrivers = em.driverIdle > 0 ? em.driverIdle : Math.round(sd.drivers * 0.25);
                      const waitingRiders = em.riderWaiting > 0 ? em.riderWaiting : Math.round(sd.activeRides * 0.04);
                      const supplyRatio = waitingRiders > 0 ? idleDrivers / waitingRiders : 2.0;
                      const supplyOk = supplyRatio >= 1.2;
                      const matchOk = sd.avgMatchTime <= 60;
                      const completionOk = sd.completionRate >= 90;
                      return [
                        { label: "Supply-demand ratio", value: `${idleDrivers} available`, target: `${waitingRiders} requesting`, verdict: supplyOk ? (supplyRatio >= 1.5 ? "Surplus" : "Healthy") : (supplyRatio >= 0.8 ? "Tight" : "Shortage"), ok: supplyOk, pct: Math.min(supplyRatio * 50, 100), col: supplyOk ? BRAND.green : supplyRatio >= 0.8 ? STATUS.warning : STATUS.error },
                        { label: "Avg match time", value: `${sd.avgMatchTime}s`, target: "< 60s target", verdict: matchOk ? "On target" : "Slow", ok: matchOk, pct: Math.max(Math.min((1 - (sd.avgMatchTime - 30) / 90) * 100, 100), 10), col: matchOk ? BRAND.green : STATUS.warning },
                        { label: "Trip completion", value: `${sd.completionRate}%`, target: "≥ 90% target", verdict: completionOk ? "Healthy" : "Monitor", ok: completionOk, pct: sd.completionRate, col: completionOk ? BRAND.green : STATUS.warning },
                      ].map(v => (
                        <DiagnosticCard key={v.label} {...v} color={v.col} />
                      ));
                    })()}
                  </div>

                  {selectedStateData.status !== "planned" && (
                    <CTAButton label={`Explore ${selectedStateData.zones} zones`} icon={MapPin} onClick={() => drillIntoState(selectedState!)} />
                  )}

                  <div className="mt-5">
                    <SectionLabel>ACTIONS</SectionLabel>
                    <ActionRow label="View all drivers" icon={Users} onClick={() => navigate("/admin/drivers")} />
                    <ActionRow label="View active rides" icon={MapPin} onClick={() => navigate("/admin/rides")} />
                    <ActionRow label="Hotel partners" icon={Building2} onClick={() => navigate("/admin/hotels")} />
                    <ActionRow label="Fleet owners" icon={Car} onClick={() => navigate("/admin/fleet")} />
                    <ActionRow label="Revenue breakdown" icon={Wallet} onClick={() => navigate("/admin/finance")} />
                    <ActionRow label="Configure zones" icon={Settings} onClick={() => navigate("/admin/settings")} />
                  </div>

                  <div className="mt-4">
                    <SectionLabel>RECENT ACTIVITY</SectionLabel>
                    {ACTIVITY_FEED.slice(0, 4).map(ev => (
                      <div key={ev.id} className="flex items-center gap-2 py-2" style={{ borderBottom: `1px solid ${t.borderSubtle}` }}>
                        <FeedIcon type={ev.type} />
                        <span className="flex-1 truncate" style={{ ...TY.bodyR, fontSize: "11px", color: t.textMuted }}>{ev.message}</span>
                        <span style={{ ...TY.cap, fontSize: "9px", color: t.textGhost }}>{ev.timestamp}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* ════════ OVERLAY PANELS (Pipeline/Disputes/Finance) ════════ */}
              {showOverlay === "verification" && rightPanelMode === "overlay" && (() => {
                const stages = [
                  { l: "Applied", c: VERIFICATION_PIPELINE.newApplications, col: STATUS.info },
                  { l: "Documents", c: VERIFICATION_PIPELINE.documentsReview, col: STATUS.warning },
                  { l: "Background", c: VERIFICATION_PIPELINE.backgroundCheck, col: "#F97316" },
                  { l: "Inspection", c: VERIFICATION_PIPELINE.inspectionScheduled + VERIFICATION_PIPELINE.inspectionComplete, col: BRAND.green },
                ];
                const pipelineTotal = stages.reduce((s, x) => s + x.c, 0);
                const maxCount = Math.max(...stages.map(s => s.c));
                return (
                  <motion.div key="verif" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} className="p-4">
                    <div className="text-center mb-1">
                      <span style={{ ...TY.h, fontSize: "36px", color: t.text }}>{pipelineTotal}</span>
                    </div>
                    <div className="text-center mb-1">
                      <span style={{ ...TY.bodyR, fontSize: "12px", color: t.textMuted }}>driver applications in review</span>
                    </div>
                    <div className="text-center mb-1">
                      <span style={{ ...TY.cap, fontSize: "9px", color: t.textGhost }}>Application → Documents → Background → Vehicle Inspection</span>
                    </div>
                    <div className="text-center mb-4">
                      <span style={{ ...TY.cap, fontSize: "10px", color: STATUS.warning }}>Oldest pending: {VERIFICATION_PIPELINE.oldestPending} days</span>
                    </div>
                    <SegmentedBar segments={stages.map(s => ({ value: s.c, color: s.col }))} />
                    <div className="space-y-1 mt-5 mb-5">
                      {stages.map((stage, i) => (
                        <StageRow key={stage.l} label={stage.l} count={stage.c} color={stage.col} isBottleneck={stage.c === maxCount} delay={0.08 * i} />
                      ))}
                    </div>
                    <div className="flex gap-2 mb-5">
                      <StatTile label="Approved" value={VERIFICATION_PIPELINE.approved} color={BRAND.green} />
                      <StatTile label="Rejected" value={VERIFICATION_PIPELINE.rejected} />
                      <StatTile label="Avg time" value={`${VERIFICATION_PIPELINE.avgProcessingDays}d`} />
                    </div>
                    <CTAButton label="Review next driver application" icon={Eye} onClick={() => navigate("/admin/drivers")} />
                  </motion.div>
                );
              })()}

              {showOverlay === "disputes" && rightPanelMode === "overlay" && (
                <motion.div key="disp" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} className="p-4">
                  <div className="text-center mb-1">
                    <span style={{ ...TY.h, fontSize: "36px", color: t.text }}>{scopedDisputes}</span>
                  </div>
                  <div className="text-center mb-1">
                    <span style={{ ...TY.bodyR, fontSize: "12px", color: t.textMuted }}>trip disputes awaiting resolution{scopeLabel !== "Platform" ? ` · ${scopeLabel}` : ""}</span>
                  </div>
                  <div className="text-center mb-1">
                    <span style={{ ...TY.cap, fontSize: "9px", color: t.textGhost }}>Fare, route & safety complaints from riders and drivers</span>
                  </div>
                  <div className="flex items-center justify-center gap-3 mb-5">
                    <span className="flex items-center gap-1.5"><AlertCircle size={11} style={{ color: STATUS.error }} /><span style={{ ...TY.cap, fontSize: "10px", color: STATUS.error }}>{drilledZone ? (DISPUTE_BY_ZONE[drilledZone]?.urgent ?? 0) : drilledState ? (DISPUTE_BY_STATE[drilledState]?.urgent ?? 0) : DISPUTE_SUMMARY.urgent} urgent</span></span>
                    <span style={{ ...TY.bodyR, fontSize: "10px", color: t.textGhost }}>·</span>
                    <span className="flex items-center gap-1.5"><CheckCircle2 size={11} style={{ color: BRAND.green }} /><span style={{ ...TY.cap, fontSize: "10px", color: BRAND.green }}>{DISPUTE_SUMMARY.resolvedToday} resolved</span></span>
                  </div>
                  <SectionLabel>RESOLUTION BREAKDOWN</SectionLabel>
                  {[
                    { l: "Rider favored", v: DISPUTE_SUMMARY.riderFavored, c: BRAND.green },
                    { l: "Driver favored", v: DISPUTE_SUMMARY.driverFavored, c: STATUS.info },
                    { l: "Split", v: DISPUTE_SUMMARY.splitResolution, c: t.textFaint },
                  ].map(d => (
                    <div key={d.l} className="flex items-center gap-3 mb-2">
                      <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: t.surfaceActive }}>
                        <div className="h-full rounded-full" style={{ width: `${d.v}%`, background: d.c }} />
                      </div>
                      <span className="w-10 text-right" style={{ ...TY.body, fontSize: "11px", color: t.textTertiary }}>{d.v}%</span>
                      <span className="w-20 truncate" style={{ ...TY.bodyR, fontSize: "10px", color: t.textMuted }}>{d.l}</span>
                    </div>
                  ))}
                  <CTAButton label="Review urgent disputes" icon={AlertTriangle} color={STATUS.warning} onClick={() => navigate("/admin/disputes")} />
                </motion.div>
              )}

              {showOverlay === "finance" && rightPanelMode === "overlay" && (
                <motion.div key="fin" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} className="p-4">
                  <div className="text-center mb-1">
                    <span style={{ ...TY.h, fontSize: "36px", color: t.text }}>{formatNaira(drilledZone ? (REVENUE_BY_ZONE[drilledZone]?.gross ?? 0) : drilledState ? (REVENUE_BY_STATE[drilledState]?.gross ?? 0) : FINANCE_SUMMARY.grossRevenue)}</span>
                  </div>
                  <div className="text-center mb-1">
                    <span style={{ ...TY.bodyR, fontSize: "12px", color: t.textMuted }}>gross today{scopeLabel !== "Platform" ? ` · ${scopeLabel}` : ""}</span>
                  </div>
                  <div className="text-center mb-5">
                    <span style={{ ...TY.cap, fontSize: "10px", color: BRAND.green }}>+{revDelta}% vs yesterday</span>
                  </div>
                  <SectionLabel>BREAKDOWN</SectionLabel>
                  {(() => {
                    const gS = drilledZone ? (REVENUE_BY_ZONE[drilledZone]?.gross ?? 0) : drilledState ? (REVENUE_BY_STATE[drilledState]?.gross ?? 0) : FINANCE_SUMMARY.grossRevenue;
                    const nS = drilledZone ? (REVENUE_BY_ZONE[drilledZone]?.net ?? 0) : drilledState ? (REVENUE_BY_STATE[drilledState]?.net ?? 0) : FINANCE_SUMMARY.netRevenue;
                    return [
                      { l: "Commission (20%)", v: formatNaira(Math.round(gS * 0.2)), c: BRAND.green },
                      { l: "Processing fees", v: formatNaira(Math.round(gS * 0.015)), c: t.textMuted },
                      { l: "Net revenue", v: formatNaira(nS), c: t.text },
                    ].map(f => (
                      <div key={f.l} className="flex items-center justify-between h-10 px-3 rounded-lg mb-1" style={{ background: f.c === t.text ? t.surface : "transparent" }}>
                        <span style={{ ...TY.bodyR, fontSize: "11px", color: t.textMuted }}>{f.l}</span>
                        <span style={{ ...TY.body, fontSize: "13px", color: f.c }}>{f.v}</span>
                      </div>
                    ));
                  })()}
                  <div className="mt-3">
                    <SectionLabel>ATTENTION</SectionLabel>
                  </div>
                  {[
                    { l: "Pending payouts", v: formatNaira(FINANCE_SUMMARY.pendingPayouts), c: STATUS.warning, icon: Clock },
                    { l: "Failed payments", v: formatNaira(FINANCE_SUMMARY.failedPayments), c: STATUS.error, icon: XCircle },
                    { l: "Platform float", v: formatNaira(FINANCE_SUMMARY.float), c: STATUS.info, icon: Wallet },
                  ].map(f => (
                    <div key={f.l} className="flex items-center gap-3 h-11 px-3 rounded-xl mb-1.5" style={{ background: t.surface, border: `1px solid ${t.borderSubtle}` }}>
                      <f.icon size={14} style={{ color: f.c }} />
                      <span className="flex-1" style={{ ...TY.body, fontSize: "11px", color: t.textTertiary }}>{f.l}</span>
                      <span style={{ ...TY.body, fontSize: "13px", color: f.c }}>{f.v}</span>
                    </div>
                  ))}
                </motion.div>
              )}

              {/* ════════ DECISION QUEUE (default — national, nothing selected) ════════ */}
              {rightPanelMode === "queue" && (
                isV2 ? (
                  /* V2: Split Handle Now / Handle Today with verb-action buttons */
                  <V2DecisionsPanel
                    highlightedIds={v2HighlightedIds}
                    onAction={handleV2Action}
                    panelRef={v2PanelRef}
                    itemRefs={v2ItemRefs}
                  />
                ) : (
                  <motion.div key="queue" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    {/* Operations items */}
                    {ACTION_QUEUE.filter(a => a.type !== "hotel" && a.type !== "fleet").map((item, i) => {
                      const route = item.type === "dispute" || item.type === "escalation" ? "/admin/disputes"
                        : item.type === "verification" ? "/admin/drivers"
                        : item.type === "payout" ? "/admin/finance"
                        : "/admin/disputes";
                      return (
                        <ActionQueueItem
                          key={item.id}
                          priority={item.priority}
                          title={item.title}
                          subtitle={item.subtitle}
                          timestamp={item.timestamp}
                          meta={item.meta}
                          delay={0.35 + i * 0.04}
                          onClick={() => navigate(route)}
                        />
                      );
                    })}
                    {/* Hotel items */}
                    {ACTION_QUEUE.filter(a => a.type === "hotel").length > 0 && (
                      <>
                        <div className="flex items-center gap-2 px-4 pt-4 pb-1">
                          <Building2 size={10} style={{ color: STATUS.info }} />
                          <span style={{ ...TY.label, fontSize: "8px", color: STATUS.info }}>HOTEL PARTNERS</span>
                          <div className="flex-1 h-px" style={{ background: `${STATUS.info}15` }} />
                        </div>
                        {ACTION_QUEUE.filter(a => a.type === "hotel").map((item, i) => (
                          <ActionQueueItem
                            key={item.id}
                            priority={item.priority}
                            title={item.title}
                            subtitle={item.subtitle}
                            timestamp={item.timestamp}
                            meta={item.meta}
                            delay={0.55 + i * 0.04}
                            onClick={() => navigate("/admin/hotels")}
                          />
                        ))}
                      </>
                    )}
                    {/* Fleet items */}
                    {ACTION_QUEUE.filter(a => a.type === "fleet").length > 0 && (
                      <>
                        <div className="flex items-center gap-2 px-4 pt-4 pb-1">
                          <Car size={10} style={{ color: "#F59E0B" }} />
                          <span style={{ ...TY.label, fontSize: "8px", color: "#F59E0B" }}>FLEET OWNERS</span>
                          <div className="flex-1 h-px" style={{ background: "#F59E0B15" }} />
                        </div>
                        {ACTION_QUEUE.filter(a => a.type === "fleet").map((item, i) => (
                          <ActionQueueItem
                            key={item.id}
                            priority={item.priority}
                            title={item.title}
                            subtitle={item.subtitle}
                            timestamp={item.timestamp}
                            meta={item.meta}
                            delay={0.65 + i * 0.04}
                            onClick={() => navigate("/admin/fleet")}
                          />
                        ))}
                      </>
                    )}
                  </motion.div>
                )
              )}

            </AnimatePresence>
          </div>

          {/* Footer tabs */}
          <div className="flex shrink-0" style={{ borderTop: `1px solid ${t.border}` }}>
            {footerTabs.map((tab) => {
              const isActive = showOverlay === tab.id;
              return (
                <button
                  key={tab.id}
                  className="flex-1 flex flex-col items-center gap-1.5 py-3.5 transition-colors relative"
                  style={{ borderRight: tab.id !== "finance" ? `1px solid ${t.borderSubtle}` : "none" }}
                  onClick={() => { setSelectedZone(null); setSelectedEntity(null); setDrilledZone(null); setShowOverlay(isActive ? null : tab.id); }}
                  onMouseEnter={e => (e.currentTarget.style.background = t.surfaceHover)}
                  onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                >
                  {isActive && <div className="absolute top-0 left-2 right-2 h-0.5 rounded-full" style={{ background: tab.color }} />}
                  <tab.icon size={16} style={{ color: isActive ? tab.color : t.iconSecondary }} />
                  <span style={{ ...TY.h, fontSize: "18px", color: isActive ? tab.color : t.text }}>
                    {typeof tab.value === "number" ? tab.value : tab.value}
                  </span>
                  <span style={{ ...TY.bodyR, fontSize: "10px", color: isActive ? tab.color : t.textFaint }}>{tab.label}</span>
                  <span style={{ ...TY.cap, fontSize: "7px", color: t.textGhost, marginTop: -2 }}>{tab.scope}</span>
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* V2 Action Drawer overlay */}
        {isV2 && (
          <AnimatePresence>
            {v2DrawerItem && (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 z-40"
                  style={{ background: isDark ? "rgba(0,0,0,0.3)" : "rgba(0,0,0,0.1)" }}
                  onClick={closeV2Drawer}
                />
                <V2ActionDrawer item={v2DrawerItem} onClose={closeV2Drawer} />
              </>
            )}
          </AnimatePresence>
        )}
      </div>


      {/* ═══ LIVE FEED BAR ═══ */}
      <motion.div
        className="flex items-center h-10 px-4 gap-2 shrink-0"
        style={{ background: t.overlay, borderTop: `1px solid ${t.border}` }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <div className="flex items-center gap-1.5 shrink-0">
          <Radio size={10} style={{ color: BRAND.green }} />
          <span style={{ ...TY.label, fontSize: "8px", color: t.textMuted }}>LIVE</span>
        </div>
        {/* Feed filter pills */}
        <div className="hidden md:flex items-center gap-0.5 shrink-0 p-0.5 rounded-md" style={{ background: t.surface }}>
          {([
            { id: "all" as const, label: "All", color: BRAND.green },
            { id: "ride" as const, label: "Rides", color: BRAND.green },
            { id: "hotel" as const, label: "Hotels", color: STATUS.info },
            { id: "fleet" as const, label: "Fleet", color: "#F59E0B" },
          ]).map(f => (
            <button
              key={f.id}
              className="flex items-center gap-1 px-2 py-0.5 rounded transition-all"
              style={{
                background: feedFilter === f.id ? t.overlay : "transparent",
                boxShadow: feedFilter === f.id ? t.shadow : "none",
              }}
              onClick={() => setFeedFilter(f.id)}
            >
              <div className="w-1 h-1 rounded-full" style={{ background: feedFilter === f.id ? f.color : t.iconMuted }} />
              <span style={{ ...TY.cap, fontSize: "8px", color: feedFilter === f.id ? t.text : t.textMuted }}>{f.label}</span>
            </button>
          ))}
        </div>
        <div className="flex-1 overflow-hidden relative h-full flex items-center ml-1">
          <AnimatePresence mode="wait">
            {filteredFeed.length > 0 && (
              <motion.div
                key={`${feedFilter}-${feedOffset}`}
                className="flex items-center gap-2 absolute"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
              >
                <FeedIcon type={filteredFeed[feedOffset % filteredFeed.length].type} />
                <span style={{ ...TY.bodyR, fontSize: "11px", color: t.textMuted }}>{filteredFeed[feedOffset % filteredFeed.length].message}</span>
                <span style={{ ...TY.cap, fontSize: "9px", color: t.textGhost }}>{filteredFeed[feedOffset % filteredFeed.length].timestamp}</span>
                {filteredFeed[feedOffset % filteredFeed.length].zone && (
                  <span className="px-1.5 py-0.5 rounded" style={{ ...TY.cap, fontSize: "8px", color: t.textGhost, background: t.surface }}>{filteredFeed[feedOffset % filteredFeed.length].zone}</span>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <div className="hidden lg:flex items-center gap-1.5 shrink-0">
          <CreditCard size={10} style={{ color: m.paymentFailureRate <= m.paymentThreshold.healthy ? BRAND.green : STATUS.warning }} />
          <span style={{ ...TY.cap, fontSize: "9px", color: t.textFaint }}>Payments {m.paymentFailureRate}% fail</span>
        </div>
        <span className="hidden md:block shrink-0" style={{ ...TY.cap, fontSize: "9px", color: t.textGhost }}>Tuesday, Mar 10 · 3:42 PM</span>
      </motion.div>
    </>
  );
}
