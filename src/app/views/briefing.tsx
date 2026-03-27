/**
 * JET — VISUAL BRIEFING PAGE
 *
 * Dyslexia-friendly analysis view. Visual-first, minimal text blocks.
 * 1:1 faithful translation of /src/app/docs/admin-evaluation.tsx
 *
 * Route: /briefing
 */

import { useState } from "react";
import { motion } from "motion/react";
import {
  Activity, MapPin, Scale, MessageSquare, Navigation, Users,
  Globe2, Car, Wallet, BarChart3, Megaphone, Settings,
  CheckCircle2, Circle, AlertTriangle, ArrowRight, Zap,
  Layers, Table, CreditCard, Route, Filter, Keyboard,
  ChevronDown, ChevronRight, Sun, Moon, Eye, Target,
  Shield, Clock, Star, Box, GitBranch, Puzzle,
  Terminal, Columns, Database, LayoutList, Gauge,
  UserCheck, Hotel, Truck, BadgeCheck, Search,
  MousePointer, PanelRight, Smartphone, Hash,
  Banknote, Timer, Map, CircleDot, ArrowUpRight,
  AlertCircle, HelpCircle, Monitor, Maximize2,
  Sparkles, Play, RefreshCw, Command as CommandIcon,
  SplitSquareHorizontal, Inbox, LayoutGrid,
} from "lucide-react";
import { AdminThemeProvider, useAdminTheme, TY, BRAND, STATUS } from "../config/admin-theme";

/* ═══════════════════════════════════════════════════════════════════════════
   TYPES
   ═══════════════════════════════════════════════════════════════════════════ */

type SurfaceStatus = "built" | "partial" | "placeholder";
type Severity = "critical" | "important" | "nice";

interface Surface {
  id: string;
  label: string;
  Icon: React.ComponentType<{ size?: number; style?: React.CSSProperties }>;
  status: SurfaceStatus;
  section: string;
  notes: string;
}

/* ═══════════════════════════════════════════════════════════════════════════
   DATA — SECTION 1: INVENTORY
   ═══════════════════════════════════════════════════════════════════════════ */

const BUILT_ITEMS = [
  { label: "Admin Shell", detail: "NavRail + router + theme provider", icon: LayoutGrid },
  { label: "Command Center", detail: "3-level drill map (national → state → zone), KPI strip, decision queue, live feed, entity filtering. All 6 entity types at state level, hotel/fleet KPIs, scoped disputes/finance, descriptive footer panels. ✓ COMPLETE — pending reevaluation.", icon: Activity },
  { label: "Disputes", detail: "3 variations explored (A/B/C). Var C \"Split Court\" is the winner. Has: queue with severity lanes, split court detail, resolution modal, contact drawer, suspend driver flow, resolution confirmation. Currently only Type A/C — Type B/D in progress.", icon: Scale },
  { label: "Drivers", detail: "Verification Kanban (from command center link)", icon: UserCheck },
  { label: "Finance", detail: "Built (need to verify depth)", icon: Wallet },
  { label: "UI Primitives", detail: "StatusBadge, KPICard, ThemeToggle, etc.", icon: Box },
  { label: "Surface Primitives", detail: "AdminModal (center, high-friction, destructive), AdminDrawer (side, contextual). Well-documented selection framework.", icon: Layers },
  { label: "Admin Theme", detail: "Full semantic token system with light/dark mode", icon: Sun },
];

const PLACEHOLDER_ITEMS = [
  { label: "Rides", icon: MapPin },
  { label: "Riders", icon: Navigation },
  { label: "Fleet", icon: Car },
  { label: "Hotels", icon: Globe2 },
  { label: "Support (B2B cases)", icon: MessageSquare },
  { label: "Analytics", icon: BarChart3 },
  { label: "Communications", icon: Megaphone },
  { label: "Settings", icon: Settings },
];

const NOT_BUILT_ITEMS = [
  { label: "Drivers full directory", detail: "Only verification Kanban exists", icon: Users },
];

/* ═══════════════════════════════════════════════════════════════════════════
   DATA — SECTION 2: QUALITY ASSESSMENT
   ═══════════════════════════════════════════════════════════════════════════ */

interface AssessmentBlock {
  surface: string;
  icon: React.ComponentType<{ size?: number; style?: React.CSSProperties }>;
  strengths: { text: string }[];
  gaps: { text: string; northstar?: string }[];
}

const ASSESSMENTS: AssessmentBlock[] = [
  {
    surface: "Command Center ✓",
    icon: Activity,
    strengths: [
      { text: "3-level drill concept (national → state → zone → entity) is genuinely well-architected. Right mental model for Nigeria's geography." },
      { text: "Entity filtering in decision panel (not header) — avoids \"global filter confusion\" pattern." },
      { text: "Decision queue = Linear's issue queue applied to platform ops. Surfaces what needs attention." },
      { text: "KPI strip gives the \"pulse\" feel the experience spine demands." },
      { text: "All 6 entity types visible at state level with \"All\" filter. Hotel Partners and Fleet Owners have room/vehicle counts in KPI strip." },
      { text: "Scoped disputes and finance overlay panels follow drill context. Footer panels have descriptive copy explaining purpose." },
      { text: "ZONE_ENTITIES generated for all state zones — not just Lagos. FCT Abuja zones include hotel and fleet data." },
    ],
    gaps: [
      { text: "COMPLETE for now — pending reevaluation. Remaining stretch goals: keyboard shortcuts/command palette, simulated real-time feed, B2B case queue alongside ride disputes." },
      { text: "Where are keyboard shortcuts? Command palette? Should be navigable without a mouse for power admin users. Table-stakes for northstar parity.", northstar: "Linear" },
      { text: "Is the live feed truly live? Static mock data. A simulated real-time ticker (new rides appearing, status changes) would demonstrate the product vision far more effectively.", northstar: "Vercel" },
    ],
  },
  {
    surface: "Disputes (Var C — Split Court)",
    icon: Scale,
    strengths: [
      { text: "Split court mental model is excellent. \"Two sides + shared truth in the center\" — exactly how fair resolution works." },
      { text: "Severity lanes in queue create natural triage. Right affordance for admin opening with 12 pending disputes." },
      { text: "Surface selection framework (Modal for destructive, Drawer for contextual) is well-documented." },
      { text: "Resolution confirmation as center modal with multi-party consequences summary — Airbnb-level transparency." },
    ],
    gaps: [
      { text: "✓ Type B (hotel→driver) and Type D (driver→hotel-guest) now implemented. Data model extended with disputeType, hotel/guest/fleet fields. Split court adapts: hotel+guest column when hotel-filed, fleet context badge, adaptive resolution options & verdicts. Queue shows type badges (H→D, D→G). Contact drawer supports hotel templates." },
      { text: "What happens when dispute list is EMPTY? Is there a designed empty state? What about loading? Skeleton states?", northstar: "Apple" },
      { text: "No cross-surface links. Clicking rider name should navigate to Riders. Clicking driver name should open Drivers. These create the \"one platform\" feeling." },
    ],
  },
  {
    surface: "Nav Rail",
    icon: LayoutList,
    strengths: [
      { text: "Linear-style expandable sidebar with sections matching the IA." },
      { text: "Badge counts on items with pending actions (Disputes: 12, Support: 3, Drivers: 23) — good affordance." },
      { text: "Sections match architecture: Operations, People, Partners, Business, System." },
    ],
    gaps: [
      { text: "Nav doesn't indicate which items are \"built\" vs \"placeholder.\" Clicking most items leads to generic placeholder page. Undermines trust in the product." },
      { text: "Missing: section collapse, keyboard nav (1-9 shortcuts), active section highlight that persists across page loads.", northstar: "Linear" },
    ],
  },
  {
    surface: "Admin Theme",
    icon: Sun,
    strengths: [
      { text: "Semantic token system (t.text, t.textMuted, t.surface, etc.)" },
      { text: "Light/dark mode with proper context-aware values." },
      { text: "Typography constants (TY) and brand/status constants." },
    ],
    gaps: [
      { text: "Does theme match guidelines' typography specs? Montserrat for headlines (-0.03em), Manrope for body (-0.02em). TY system should enforce at token level. Need to verify." },
      { text: "Design references doc defines detailed grey scale (50→950) and specific green usage rules. Are these reflected in theme tokens?" },
    ],
  },
];

/* ═══════════════════════════════════════════════════════════════════════════
   DATA — SECTION 3: FIRST PRINCIPLES (WHY RIDES)
   ═══════════════════════════════════════════════════════════════════════════ */

const WHY_RIDES = [
  { lens: "Design", icon: Eye, text: "Rides is the central transaction. Building it establishes the \"trip card\" pattern reused in Riders (trip history), Drivers (trip history), Fleet (vehicle trips), Hotels (guest trips), Finance (transaction records). Build once, compose everywhere." },
  { lens: "PM", icon: Target, text: "Rides is the operational backbone. Admin can't investigate issues without ride data. Command Center gives the pulse; Rides gives the detail. Without Rides, admin can see something is wrong but can't drill into WHY." },
  { lens: "Engineering", icon: Terminal, text: "Rides establishes the data table pattern — filtering, sorting, search, detail drill-down — that every other list surface will reuse. Get this right once." },
  { lens: "Brand", icon: Star, text: "Where \"one platform, six windows\" becomes real. Same trip visualization the rider sees should be recognizable in admin's ride detail view. Shared visual language." },
];

/* ═══════════════════════════════════════════════════════════════════════════
   DATA — SECTION 4: RIDES SPEC
   ═══════════════════════════════════════════════════════════════════════════ */

const RIDES_NORTHSTAR_VOICES = [
  { name: "Linear", text: "Dense table with powerful filtering. Every column sortable. Keyboard navigable. Click-through to detail without losing list context (split pane or side panel). Status badges with consistent color language." },
  { name: "Vercel", text: "Real-time by default. Active rides pulse. New completions appear at top. Time-relative labels (\"2m ago\" not \"14:32:17\"). Clean, monochrome, information-dense." },
  { name: "Airbnb", text: "Every row tells a story. Not just \"trip #4521\" but \"Lekki → Airport · ₦5,200 · EV · 45min · Completed.\" Admin should understand the trip at a glance without clicking." },
];

const RIDES_LIVE_VIEW = [
  "Map showing all active rides (routes, driver positions)",
  "Sidebar list of active rides with:",
  "  → Booking source badge (Rider | Hotel)",
  "  → Route: pickup → dropoff (truncated)",
  "  → Status: En route to pickup | In progress | Arriving",
  "  → Driver name + vehicle type (EV badge if applicable)",
  "  → Duration elapsed",
  "Click ride → map focuses + detail panel slides in from right",
  "Real-time status transitions (ride completing → moves to history)",
];

const RIDES_ALL_COLUMNS = [
  "Status (dot + label)", "Trip ID (JET-XXXXXXXXXX, monospace)", "Route (from → to, truncated)",
  "Booking source (Rider | Hotel)", "Rider/Guest name", "Driver name",
  "Vehicle (type + EV badge)", "Fare", "Duration",
  "Time (relative: \"2h ago\", \"Yesterday\")", "State/Zone",
];

const RIDES_ALL_FILTERS = [
  "Status: All | Active | Completed | Cancelled",
  "Source: All | Rider | Hotel",
  "Vehicle: All | EV | Gas",
  "Time: Today | This week | This month | Custom",
  "State/Zone dropdowns",
];

const RIDES_ALL_EXTRAS = [
  "Search: by trip ID, rider name, driver name, phone",
  "Sort: by time (default), fare, duration",
  "Pagination or infinite scroll",
];

const RIDES_DETAIL_SECTIONS = [
  { num: "1", label: "Header", items: ["Status badge, Trip ID, time"] },
  { num: "2", label: "Route", items: ["Map with full route visualization (shared visual language with rider app)", "Pickup → waypoints → dropoff"] },
  { num: "3", label: "Parties", items: ["Rider card (photo, name, rating, phone) → click opens Riders", "Driver card (photo, name, rating, vehicle, EV badge) → click opens Drivers", "If hotel-booked: Hotel card (name, guest name, account tier)", "If fleet-affiliated driver: Fleet badge on driver card"] },
  { num: "4", label: "Fare Breakdown", items: ["Base + distance + time + surge + fees = total", "Payment method, payment status", "(Airbnb-transparent)"] },
  { num: "5", label: "Timeline", items: ["Connected dots showing state transitions with timestamps", "Requested → Matched (12s) → Pickup (8min) → In progress (32min) → Complete"] },
  { num: "6", label: "Actions", items: ["View dispute (if any)", "Contact parties", "Flag", "Audit fare"] },
];

const RIDES_DATA_REQS = [
  "Mock data file: /src/app/config/rides-mock-data.ts",
  "30-50 rides across different states, booking sources, vehicle types, statuses",
  "Some with disputes linked. Some hotel-booked.",
  "This dataset establishes the ride data model that every surface will reference.",
];

/* ═══════════════════════════════════════════════════════════════════════════
   DATA — SECTION 5: RIDERS SPEC
   ═══════════════════════════════════════════════════════════════════════════ */

const RIDERS_DIRECTORY_COLUMNS = [
  "Name + avatar", "Phone", "Status (active | suspended | flagged)",
  "Total rides", "Total spend", "Rating (given to drivers, avg)",
  "Last active", "Join date",
];

const RIDERS_DIRECTORY_FEATURES = [
  "Search by name, phone, email",
  "Filters: Status (active/suspended/flagged), Spend tier, Join date",
  "Sortable, paginated",
];

const RIDERS_PROFILE_SECTIONS = [
  { num: "1", label: "Header", items: ["Avatar, name, phone, email, status badge, member since"] },
  { num: "2", label: "Metrics row", items: ["Total rides, Total spend, Avg fare, Rating"] },
  { num: "3", label: "Trip history", items: ["Reuses the trip card from Rides surface (compose!)"] },
  { num: "4", label: "Payment methods", items: ["Cards, wallet balance"] },
  { num: "5", label: "Disputes", items: ["Any disputes involving this rider"] },
  { num: "6", label: "Actions", items: ["Suspend/reactivate, Issue credit, Contact, Flag, Export"] },
];

/* ═══════════════════════════════════════════════════════════════════════════
   DATA — SECTION 6: DRIVERS DIRECTORY SPEC
   ═══════════════════════════════════════════════════════════════════════════ */

const DRIVERS_DIRECTORY_COLUMNS = [
  "Name + avatar", "Status (online | offline | on-ride | suspended)",
  "Affiliation (Independent | Fleet name)", "Vehicle (model, type, EV badge)",
  "Total rides", "Total earnings", "Rating",
  "Verification status", "Last active",
];

const DRIVERS_DIRECTORY_FILTERS = [
  "Status, Affiliation (independent/fleet), Vehicle type, Verification status, State/Zone",
];

const DRIVERS_PROFILE_SECTIONS = [
  { num: "1", label: "Header", items: ["Avatar, name, phone, status, verification badge"] },
  { num: "2", label: "Metrics", items: ["Rides, Earnings, Rating, Online hours, Acceptance rate"] },
  { num: "3", label: "Vehicle", items: ["Current vehicle details, EV stats if applicable"] },
  { num: "4", label: "Fleet affiliation", items: ["If fleet-affiliated, fleet owner card with link"] },
  { num: "5", label: "Trip history", items: ["Reuses trip card"] },
  { num: "6", label: "Disputes", items: ["Disputes involving this driver"] },
  { num: "7", label: "Actions", items: ["Suspend, Require re-verification, Contact, Flag"] },
];

/* ═══════════════════════════════════════════════════════════════════════════
   DATA — SECTION 7: STRATEGIC OBSERVATIONS
   ═══════════════════════════════════════════════════════════════════════════ */

const SHARED_COMPONENTS = [
  { name: "RideCard", desc: "ONE component used in Rides, Rider profile, Driver profile, Fleet vehicle trips, Hotel guest rides, Dispute evidence.", icon: MapPin, usedIn: ["Rides", "Rider profile", "Driver profile", "Fleet trips", "Hotel rides", "Dispute evidence"] },
  { name: "EntityCard", desc: "Polymorphic card for Rider, Driver, Hotel, Fleet Owner. Click → navigates to that entity's admin surface.", icon: Users, usedIn: ["Rides detail", "Disputes", "All profiles"] },
  { name: "DataTable", desc: "Shared table primitive with sort, filter, search, pagination. Used everywhere. Not rebuilt per surface.", icon: Table, usedIn: ["Rides", "Riders", "Drivers", "Fleet", "Hotels"] },
  { name: "TimelineView", desc: "Connected dots for ride state transitions, dispute resolution steps, verification pipeline stages.", icon: Route, usedIn: ["Ride detail", "Dispute detail", "Driver verification"] },
  { name: "FilterPillBar", desc: "Horizontal pills — status, source, time, zone. Linear-style.", icon: Filter, usedIn: ["Rides", "Riders", "Drivers", "Fleet", "Hotels", "Support"] },
];

const DESIGN_SYSTEM_MATURITY = [
  { layer: "Atoms", status: "have" as const, items: "Badge, KPI number, icon, label" },
  { layer: "Molecules", status: "need" as const, items: "DataTable row, Filter pill bar, Entity card, Metric sparkline, Action button group" },
  { layer: "Organisms", status: "need" as const, items: "DataTable (full), RideDetail drawer, EntityProfile, FilteredListView" },
];

const KEYBOARD_NAV_PHASES = [
  { phase: "Phase 1 (with Rides)", items: "Tab between list items, Enter to open detail, Escape to close, / to focus search" },
  { phase: "Phase 2", items: "Full command palette (⌘K) for cross-surface navigation" },
];

/* ═══════════════════════════════════════════════════════════════════════════
   DATA — SECTION 8: BUILD SEQUENCE
   ═══════════════════════════════════════════════════════════════════════════ */

const BUILD_SEQUENCE = [
  { step: 1, label: "Shared Patterns (foundation)", items: ["DataTable primitive", "RideCard component", "EntityCard component (polymorphic: rider/driver/hotel/fleet)", "FilterPillBar component", "TimelineView component", "Rides mock data file"], color: BRAND.green },
  { step: 2, label: "Rides Surface (the centerpiece)", items: ["Live view with map + sidebar", "All view with DataTable", "Trip detail drawer", "Filter system"], color: BRAND.green },
  { step: 3, label: "Riders Surface", items: ["Directory with DataTable (reuse)", "Rider profile with trip history (reuse RideCard)", "Account actions"], color: STATUS.info },
  { step: 4, label: "Drivers Directory (extend existing)", items: ["Add directory tab alongside verification Kanban", "Driver profile with trip history + vehicle + fleet context", "Account actions"], color: STATUS.info },
  { step: 5, label: "Polish Pass", items: ["Empty states for all surfaces", "Loading skeletons", "Cross-surface navigation links", "Simulated live data for Command Center + Rides"], color: STATUS.warning },
];

/* ═══════════════════════════════════════════════════════════════════════════
   DATA — SECTION 9: GAPS IN BUILT SURFACES
   ═══════════════════════════════════════════════════════════════════════════ */

interface SurfaceGaps {
  surface: string;
  icon: React.ComponentType<{ size?: number; style?: React.CSSProperties }>;
  gaps: string[];
}

const BUILT_SURFACE_GAPS: SurfaceGaps[] = [
  {
    surface: "Command Center",
    icon: Activity,
    gaps: [
      "No empty state for decision queue when all items resolved",
      "No skeleton loading state",
      "KPI numbers don't animate (should count-up on load per guidelines)",
      "No keyboard navigation",
    ],
  },
  {
    surface: "Disputes",
    icon: Scale,
    gaps: [
      "Only Type A/C — architecture-ready for B/D? Need to verify component polymorphism",
      "Cross-surface links not wired (clicking rider/driver name)",
      "Empty state when no disputes in a severity lane — is it handled?",
      "The \"Design Lab toggle\" — is there a way to switch between Variation A/B/C? (Guideline requirement)",
    ],
  },
  {
    surface: "Nav Rail",
    icon: LayoutList,
    gaps: [
      "No keyboard shortcuts",
      "Section headers not collapsible",
      "No \"collapsed\" indicator for which section the active item is in",
    ],
  },
  {
    surface: "General",
    icon: AlertCircle,
    gaps: [
      "Is there a 404/not-found state within admin routes?",
      "Error boundary for admin views?",
      "Responsive behavior: what happens on tablet-width screens? Admin is \"large screen optimized\" per experience spine, but should degrade gracefully.",
    ],
  },
];

/* ═══════════════════════════════════════════════════════════════════════════
   DATA — SECTION 10: RIDER & DRIVER QUICK GAP SCAN
   ═══════════════════════════════════════════════════════════════════════════ */

const RIDER_SCAN = {
  has: "Home, booking flows (A/B/C), activity screen, saved places, account, active trip, wallet, onboarding, settings",
  flags: [
    "booking-flow-b.tsx was just recreated empty — needs content",
    "Does ride state machine cover ALL states from experience spine? (IDLE → SEARCHING → DESTINATION_SET → ... → RATING → RECEIPT)",
    "Is the \"Green Receipt\" (Jet Signature #4) implemented?",
    "Is trip sharing implemented?",
  ],
};

const DRIVER_SCAN = {
  has: "Home (earnings A/B/C), active trip, trip request, wallet, onboarding, verification, settings, profile, vehicle",
  flags: [
    "Does ride request screen show destination + fare BEFORE accept? (Anti-cancellation design — critical per experience spine)",
    "Is the \"Career tool\" feeling coming through? Earnings goals, performance insights?",
  ],
};

/* ═══════════════════════════════════════════════════════════════════════════
   STATUS / SEVERITY HELPERS
   ═══════════════════════════════════════════════════════════════════════════ */

function statusConfig(s: SurfaceStatus) {
  switch (s) {
    case "built": return { color: BRAND.green, label: "Built", icon: CheckCircle2 };
    case "partial": return { color: STATUS.warning, label: "Partial", icon: AlertTriangle };
    case "placeholder": return { color: "#737373", label: "Placeholder", icon: Circle };
  }
}

/* ═══════════════════════════════════════════════════════════════════════════
   SHARED UI ATOMS
   ═══════════════════════════════════════════════════════════════════════════ */

function SectionHeader({ label, number, subtitle }: { label: string; number: string; subtitle?: string }) {
  const { t } = useAdminTheme();
  return (
    <div className="mb-5 mt-12 first:mt-0">
      <div className="flex items-center gap-3 mb-1">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
          style={{ background: `${BRAND.green}15`, color: BRAND.green, ...TY.sub, fontSize: "13px" }}
        >
          {number}
        </div>
        <span style={{ ...TY.sub, fontSize: "16px", color: t.text, letterSpacing: "-0.03em" }}>
          {label}
        </span>
        <div className="flex-1 h-px" style={{ background: t.borderSubtle }} />
      </div>
      {subtitle && (
        <span className="ml-11 block" style={{ ...TY.bodyR, fontSize: "12px", color: t.textMuted }}>
          {subtitle}
        </span>
      )}
    </div>
  );
}

function Bullet({ children, color }: { children: React.ReactNode; color?: string }) {
  const { t } = useAdminTheme();
  return (
    <div className="flex items-start gap-2.5 py-1">
      <div className="w-1.5 h-1.5 rounded-full mt-[6px] shrink-0" style={{ background: color || t.textMuted }} />
      <span style={{ ...TY.bodyR, fontSize: "12px", color: t.textSecondary, lineHeight: "1.55" }}>
        {children}
      </span>
    </div>
  );
}

function IndentBullet({ children, color }: { children: React.ReactNode; color?: string }) {
  const { t } = useAdminTheme();
  return (
    <div className="flex items-start gap-2 py-0.5 ml-4">
      <span style={{ ...TY.bodyR, fontSize: "11px", color: color || t.textMuted }}>→</span>
      <span style={{ ...TY.bodyR, fontSize: "11px", color: t.textTertiary, lineHeight: "1.55" }}>
        {children}
      </span>
    </div>
  );
}

function Card({ children, borderColor, glow }: { children: React.ReactNode; borderColor?: string; glow?: boolean }) {
  const { t } = useAdminTheme();
  return (
    <div
      className="rounded-xl p-4"
      style={{
        background: t.surfaceRaised,
        border: `1px solid ${borderColor || t.borderSubtle}`,
        boxShadow: glow ? `0 0 20px ${BRAND.green}08` : t.shadow,
      }}
    >
      {children}
    </div>
  );
}

function IconLabel({ icon: IconComp, label, color, tag }: { icon: React.ComponentType<{ size?: number; style?: React.CSSProperties }>; label: string; color: string; tag?: string }) {
  const { t } = useAdminTheme();
  return (
    <div className="flex items-center gap-2 mb-2">
      <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0" style={{ background: `${color}12` }}>
        <IconComp size={14} style={{ color }} />
      </div>
      <span style={{ ...TY.body, fontSize: "13px", color: t.text }}>{label}</span>
      {tag && (
        <span className="ml-auto px-2 py-0.5 rounded-full" style={{ ...TY.cap, fontSize: "9px", color, background: `${color}12`, border: `1px solid ${color}20` }}>
          {tag}
        </span>
      )}
    </div>
  );
}

function NorthstarTag({ name }: { name: string }) {
  const { t } = useAdminTheme();
  return (
    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded mr-1" style={{ background: `${STATUS.info}12`, border: `1px solid ${STATUS.info}15` }}>
      <span style={{ ...TY.cap, fontSize: "9px", color: STATUS.info }}>{name} asks</span>
    </span>
  );
}

function TagPills({ items }: { items: string[] }) {
  const { t } = useAdminTheme();
  return (
    <div className="flex flex-wrap gap-1.5 mt-2">
      {items.map(item => (
        <span key={item} className="px-2 py-0.5 rounded-md" style={{ ...TY.cap, fontSize: "10px", color: t.textSecondary, background: t.surface, border: `1px solid ${t.borderSubtle}` }}>
          {item}
        </span>
      ))}
    </div>
  );
}

function NumberedSection({ num, label, items, color }: { num: string; label: string; items: string[]; color: string }) {
  const { t } = useAdminTheme();
  return (
    <div className="flex gap-3 py-2">
      <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5" style={{ background: `${color}15`, color, ...TY.cap, fontSize: "10px" }}>
        {num}
      </div>
      <div className="flex-1">
        <span className="block mb-1" style={{ ...TY.body, fontSize: "12px", color: t.text }}>{label}</span>
        {items.map((item, i) => (
          <div key={i} className="flex items-start gap-2 py-0.5">
            <div className="w-1 h-1 rounded-full mt-[7px] shrink-0" style={{ background: color }} />
            <span style={{ ...TY.bodyR, fontSize: "11px", color: t.textTertiary, lineHeight: "1.5" }}>{item}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   SECTION COMPONENTS
   ═══════════════════════════════════════════════════════════════════════════ */

function InventorySection() {
  const { t } = useAdminTheme();
  const builtCount = BUILT_ITEMS.length;
  const placeholderCount = PLACEHOLDER_ITEMS.length;
  const notBuiltCount = NOT_BUILT_ITEMS.length;
  const total = builtCount + placeholderCount + notBuiltCount;
  const pct = Math.round(((builtCount) / total) * 100);

  return (
    <>
      {/* Progress bar */}
      <motion.div className="rounded-2xl p-5 mb-5" style={{ background: t.surfaceRaised, border: `1px solid ${t.borderSubtle}`, boxShadow: t.shadow }} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center justify-between mb-3">
          <span style={{ ...TY.sub, fontSize: "14px", color: t.text }}>Admin Inventory</span>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-sm" style={{ background: BRAND.green }} />
              <span style={{ ...TY.body, fontSize: "11px", color: t.textSecondary }}>Built {builtCount}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-sm" style={{ background: "#737373" }} />
              <span style={{ ...TY.body, fontSize: "11px", color: t.textSecondary }}>Placeholder {placeholderCount}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-sm" style={{ background: STATUS.error }} />
              <span style={{ ...TY.body, fontSize: "11px", color: t.textSecondary }}>Not built {notBuiltCount}</span>
            </div>
          </div>
        </div>
        <div className="h-3 rounded-full overflow-hidden flex" style={{ background: t.surface }}>
          <motion.div className="h-full" style={{ background: BRAND.green, width: `${(builtCount / total) * 100}%` }} initial={{ width: 0 }} animate={{ width: `${(builtCount / total) * 100}%` }} transition={{ duration: 1 }} />
          <motion.div className="h-full" style={{ background: "#737373", width: `${(placeholderCount / total) * 100}%` }} initial={{ width: 0 }} animate={{ width: `${(placeholderCount / total) * 100}%` }} transition={{ duration: 1, delay: 0.2 }} />
          <motion.div className="h-full" style={{ background: STATUS.error, width: `${(notBuiltCount / total) * 100}%` }} initial={{ width: 0 }} animate={{ width: `${(notBuiltCount / total) * 100}%` }} transition={{ duration: 1, delay: 0.4 }} />
        </div>
      </motion.div>

      {/* Built items */}
      <span className="block mb-2" style={{ ...TY.label, fontSize: "9px", color: t.textFaint, letterSpacing: "0.08em" }}>BUILT (functional, real components)</span>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-5">
        {BUILT_ITEMS.map((item, i) => (
          <motion.div key={item.label} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.03 * i }}>
            <Card borderColor={`${BRAND.green}20`}>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: `${BRAND.green}10` }}>
                  <item.icon size={14} style={{ color: BRAND.green }} />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span style={{ ...TY.body, fontSize: "12px", color: t.text }}>{item.label}</span>
                    <CheckCircle2 size={12} style={{ color: BRAND.green }} />
                  </div>
                  <span className="block mt-0.5" style={{ ...TY.bodyR, fontSize: "11px", color: t.textMuted, lineHeight: "1.5" }}>{item.detail}</span>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Placeholder items */}
      <span className="block mb-2" style={{ ...TY.label, fontSize: "9px", color: t.textFaint, letterSpacing: "0.08em" }}>PLACEHOLDER (exists but skeleton only)</span>
      <div className="flex flex-wrap gap-2 mb-5">
        {PLACEHOLDER_ITEMS.map(item => (
          <div key={item.label} className="flex items-center gap-2 px-3 py-2 rounded-lg" style={{ background: t.surface, border: `1px solid ${t.borderSubtle}` }}>
            <item.icon size={13} style={{ color: "#737373" }} />
            <span style={{ ...TY.body, fontSize: "11px", color: t.textTertiary }}>{item.label}</span>
            <Circle size={10} style={{ color: "#737373" }} />
          </div>
        ))}
      </div>

      {/* Not built */}
      <span className="block mb-2" style={{ ...TY.label, fontSize: "9px", color: t.textFaint, letterSpacing: "0.08em" }}>NOT BUILT</span>
      {NOT_BUILT_ITEMS.map(item => (
        <div key={item.label} className="flex items-center gap-3 px-3 py-2.5 rounded-lg mb-2" style={{ background: `${STATUS.error}08`, border: `1px solid ${STATUS.error}15` }}>
          <item.icon size={14} style={{ color: STATUS.error }} />
          <span style={{ ...TY.body, fontSize: "12px", color: t.text }}>{item.label}</span>
          <span style={{ ...TY.bodyR, fontSize: "11px", color: t.textMuted }}>— {item.detail}</span>
        </div>
      ))}
    </>
  );
}

function QualityAssessmentSection() {
  const { t } = useAdminTheme();
  const [expanded, setExpanded] = useState<string | null>("Command Center");

  return (
    <div className="space-y-3">
      {ASSESSMENTS.map((a, i) => {
        const isOpen = expanded === a.surface;
        return (
          <motion.div key={a.surface} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 * i }}>
            <div
              className="rounded-xl overflow-hidden"
              style={{ background: t.surfaceRaised, border: `1px solid ${t.borderSubtle}`, boxShadow: t.shadow }}
            >
              <button
                className="w-full flex items-center gap-3 p-4"
                onClick={() => setExpanded(isOpen ? null : a.surface)}
              >
                <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: `${BRAND.green}10` }}>
                  <a.icon size={14} style={{ color: BRAND.green }} />
                </div>
                <span style={{ ...TY.body, fontSize: "13px", color: t.text }}>{a.surface}</span>
                <div className="ml-auto flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-full" style={{ ...TY.cap, fontSize: "9px", color: BRAND.green, background: `${BRAND.green}12` }}>
                    {a.strengths.length} strengths
                  </span>
                  <span className="px-2 py-0.5 rounded-full" style={{ ...TY.cap, fontSize: "9px", color: STATUS.warning, background: `${STATUS.warning}12` }}>
                    {a.gaps.length} gaps
                  </span>
                  {isOpen ? <ChevronDown size={14} style={{ color: t.icon }} /> : <ChevronRight size={14} style={{ color: t.icon }} />}
                </div>
              </button>

              {isOpen && (
                <div className="px-4 pb-4 pt-0">
                  <div className="h-px mb-3" style={{ background: t.borderSubtle }} />
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {/* Strengths */}
                    <div>
                      <span className="flex items-center gap-1.5 mb-2" style={{ ...TY.label, fontSize: "9px", color: BRAND.green, letterSpacing: "0.08em" }}>
                        <CheckCircle2 size={10} /> STRENGTHS
                      </span>
                      {a.strengths.map((s, j) => (
                        <Bullet key={j} color={BRAND.green}>{s.text}</Bullet>
                      ))}
                    </div>
                    {/* Gaps */}
                    <div>
                      <span className="flex items-center gap-1.5 mb-2" style={{ ...TY.label, fontSize: "9px", color: STATUS.warning, letterSpacing: "0.08em" }}>
                        <AlertTriangle size={10} /> GAPS
                      </span>
                      {a.gaps.map((g, j) => (
                        <div key={j}>
                          <div className="flex items-start gap-2.5 py-1">
                            <div className="w-1.5 h-1.5 rounded-full mt-[6px] shrink-0" style={{ background: STATUS.warning }} />
                            <span style={{ ...TY.bodyR, fontSize: "12px", color: t.textSecondary, lineHeight: "1.55" }}>
                              {g.northstar && <NorthstarTag name={g.northstar} />}
                              {g.text}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

function FirstPrinciplesSection() {
  const { t } = useAdminTheme();
  return (
    <>
      {/* Context */}
      <Card borderColor={`${STATUS.info}20`}>
        <span style={{ ...TY.bodyR, fontSize: "12px", color: t.textSecondary, lineHeight: "1.6" }}>
          Phase 1 has 4 of 7 surfaces built. Remaining: <strong style={{ color: t.text }}>Rides</strong>, <strong style={{ color: t.text }}>Riders</strong>, <strong style={{ color: t.text }}>Drivers directory</strong>. The PM question: "What's the highest-impact surface to build next?"
        </span>
      </Card>

      {/* Answer */}
      <motion.div
        className="rounded-2xl p-6 mt-4 relative overflow-hidden"
        style={{ background: t.surfaceRaised, border: `1px solid ${BRAND.green}25`, boxShadow: `0 0 40px ${BRAND.green}08` }}
        initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
      >
        <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full opacity-20 pointer-events-none" style={{ background: `radial-gradient(circle, ${BRAND.green}30, transparent)` }} />
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${BRAND.green}12` }}>
            <Target size={20} style={{ color: BRAND.green }} />
          </div>
          <span style={{ ...TY.h, fontSize: "20px", color: t.text }}>Answer: RIDES</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {WHY_RIDES.map((reason, i) => (
            <motion.div key={reason.lens} className="rounded-lg p-3.5" style={{ background: t.surface, border: `1px solid ${t.borderSubtle}` }} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + i * 0.05 }}>
              <div className="flex items-center gap-2 mb-2">
                <reason.icon size={14} style={{ color: BRAND.green }} />
                <span style={{ ...TY.body, fontSize: "12px", color: BRAND.green }}>{reason.lens}</span>
              </div>
              <span style={{ ...TY.bodyR, fontSize: "11px", color: t.textSecondary, lineHeight: "1.55" }}>{reason.text}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </>
  );
}

function RidesSpecSection() {
  const { t } = useAdminTheme();
  return (
    <>
      {/* Northstar voices */}
      <span className="block mb-2" style={{ ...TY.label, fontSize: "9px", color: t.textFaint, letterSpacing: "0.08em" }}>HOW WOULD THE NORTHSTARS APPROACH THIS?</span>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-2 mb-6">
        {RIDES_NORTHSTAR_VOICES.map(v => (
          <Card key={v.name}>
            <NorthstarTag name={v.name} />
            <span className="block mt-2" style={{ ...TY.bodyR, fontSize: "11px", color: t.textSecondary, lineHeight: "1.55" }}>{v.text}</span>
          </Card>
        ))}
      </div>

      {/* View modes intro */}
      <Card borderColor={`${STATUS.info}20`}>
        <span style={{ ...TY.body, fontSize: "12px", color: t.text }}>Two view modes:</span>
        <span className="block mt-1" style={{ ...TY.bodyR, fontSize: "11px", color: t.textSecondary }}>
          Tab 1: <strong style={{ color: t.text }}>LIVE</strong> (active rides, real-time map) · Tab 2: <strong style={{ color: t.text }}>ALL</strong> (historical + active, table view). Default to LIVE — admin's primary JTBD is "is the platform healthy RIGHT NOW?"
        </span>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 mt-4">
        {/* Live View */}
        <Card borderColor={`${BRAND.green}20`}>
          <IconLabel icon={Activity} label="Live View" color={BRAND.green} />
          {RIDES_LIVE_VIEW.map((item, i) => (
            item.startsWith("  →")
              ? <IndentBullet key={i} color={BRAND.green}>{item.replace("  → ", "")}</IndentBullet>
              : <Bullet key={i} color={BRAND.green}>{item}</Bullet>
          ))}
        </Card>

        {/* All View */}
        <Card borderColor={`${STATUS.info}20`}>
          <IconLabel icon={Table} label="All View (the workhorse)" color={STATUS.info} />
          <span className="block mb-1.5" style={{ ...TY.label, fontSize: "8px", color: t.textFaint, letterSpacing: "0.08em" }}>COLUMNS</span>
          {RIDES_ALL_COLUMNS.map((col, i) => <Bullet key={i} color={STATUS.info}>{col}</Bullet>)}
          <span className="block mt-3 mb-1.5" style={{ ...TY.label, fontSize: "8px", color: t.textFaint, letterSpacing: "0.08em" }}>FILTERS (horizontal pill bar)</span>
          {RIDES_ALL_FILTERS.map((f, i) => <Bullet key={i} color={STATUS.info}>{f}</Bullet>)}
          <div className="h-px my-2" style={{ background: t.borderSubtle }} />
          {RIDES_ALL_EXTRAS.map((e, i) => <Bullet key={i} color={t.textMuted}>{e}</Bullet>)}
        </Card>

        {/* Trip Detail */}
        <Card borderColor={`${STATUS.warning}20`}>
          <IconLabel icon={PanelRight} label="Trip Detail (side drawer)" color={STATUS.warning} />
          <span className="block mb-2" style={{ ...TY.bodyR, fontSize: "10px", color: t.textMuted }}>
            AdminDrawer (contextual, low-friction). Keeps the list visible.
          </span>
          {RIDES_DETAIL_SECTIONS.map(sec => (
            <NumberedSection key={sec.num} num={sec.num} label={sec.label} items={sec.items} color={STATUS.warning} />
          ))}
        </Card>
      </div>

      {/* Data requirements */}
      <div className="mt-4">
        <Card borderColor={`${t.borderStrong}`}>
          <IconLabel icon={Database} label="Data Requirements" color={t.icon} />
          {RIDES_DATA_REQS.map((req, i) => <Bullet key={i}>{req}</Bullet>)}
        </Card>
      </div>
    </>
  );
}

function RidersSpecSection() {
  const { t } = useAdminTheme();
  return (
    <>
      <Card borderColor={`${STATUS.info}15`}>
        <span style={{ ...TY.bodyR, fontSize: "11px", color: t.textMuted }}>
          Build AFTER Rides — depends on ride data model and trip card pattern established there.
        </span>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 mt-4">
        {/* Directory */}
        <Card borderColor={`${STATUS.info}20`}>
          <IconLabel icon={Table} label="Directory (table/grid)" color={STATUS.info} />
          <span className="block mb-1.5" style={{ ...TY.label, fontSize: "8px", color: t.textFaint, letterSpacing: "0.08em" }}>COLUMNS</span>
          {RIDERS_DIRECTORY_COLUMNS.map((col, i) => <Bullet key={i} color={STATUS.info}>{col}</Bullet>)}
          <div className="h-px my-2" style={{ background: t.borderSubtle }} />
          {RIDERS_DIRECTORY_FEATURES.map((f, i) => <Bullet key={i} color={t.textMuted}>{f}</Bullet>)}
        </Card>

        {/* Profile */}
        <Card borderColor={`${STATUS.warning}20`}>
          <IconLabel icon={PanelRight} label="Profile (AdminDrawer or full page — TBD)" color={STATUS.warning} />
          {RIDERS_PROFILE_SECTIONS.map(sec => (
            <NumberedSection key={sec.num} num={sec.num} label={sec.label} items={sec.items} color={STATUS.warning} />
          ))}
        </Card>
      </div>
    </>
  );
}

function DriversSpecSection() {
  const { t } = useAdminTheme();
  return (
    <>
      <Card borderColor={`${STATUS.info}15`}>
        <span style={{ ...TY.bodyR, fontSize: "11px", color: t.textMuted }}>
          Extends existing verification Kanban. Two views: <strong style={{ color: t.text }}>Tab 1: DIRECTORY</strong> (all drivers, table) · <strong style={{ color: t.text }}>Tab 2: VERIFICATION</strong> (existing Kanban pipeline)
        </span>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 mt-4">
        {/* Directory */}
        <Card borderColor={`${STATUS.info}20`}>
          <IconLabel icon={Table} label="Directory" color={STATUS.info} />
          <span className="block mb-1.5" style={{ ...TY.label, fontSize: "8px", color: t.textFaint, letterSpacing: "0.08em" }}>COLUMNS</span>
          {DRIVERS_DIRECTORY_COLUMNS.map((col, i) => <Bullet key={i} color={STATUS.info}>{col}</Bullet>)}
          <div className="h-px my-2" style={{ background: t.borderSubtle }} />
          <span className="block mb-1" style={{ ...TY.label, fontSize: "8px", color: t.textFaint, letterSpacing: "0.08em" }}>FILTERS</span>
          {DRIVERS_DIRECTORY_FILTERS.map((f, i) => <Bullet key={i} color={t.textMuted}>{f}</Bullet>)}
        </Card>

        {/* Profile */}
        <Card borderColor={`${STATUS.warning}20`}>
          <IconLabel icon={PanelRight} label="Profile" color={STATUS.warning} />
          {DRIVERS_PROFILE_SECTIONS.map(sec => (
            <NumberedSection key={sec.num} num={sec.num} label={sec.label} items={sec.items} color={STATUS.warning} />
          ))}
        </Card>
      </div>
    </>
  );
}

function StrategicObservationsSection() {
  const { t } = useAdminTheme();
  return (
    <div className="space-y-4">
      {/* A — Composability */}
      <Card borderColor={`${STATUS.info}20`}>
        <IconLabel icon={Puzzle} label="A. The Composability Opportunity" color={STATUS.info} />
        <span className="block mb-3" style={{ ...TY.bodyR, fontSize: "11px", color: t.textMuted, lineHeight: "1.55" }}>
          Each admin surface is being built somewhat in isolation. Architecture says "cross-surface links" and "every entity reference is navigable" — only works with SHARED PATTERNS:
        </span>
        <div className="space-y-2">
          {SHARED_COMPONENTS.map(comp => (
            <div key={comp.name} className="rounded-lg p-3" style={{ background: t.surface, border: `1px solid ${t.borderSubtle}` }}>
              <div className="flex items-center gap-2 mb-1">
                <comp.icon size={13} style={{ color: STATUS.info }} />
                <span style={{ ...TY.body, fontSize: "12px", color: t.text }}>{comp.name}</span>
              </div>
              <span className="block mb-1.5" style={{ ...TY.bodyR, fontSize: "10px", color: t.textMuted, lineHeight: "1.5" }}>{comp.desc}</span>
              <TagPills items={comp.usedIn} />
            </div>
          ))}
        </div>
        <span className="block mt-3" style={{ ...TY.bodyR, fontSize: "11px", color: BRAND.green, lineHeight: "1.55" }}>
          Building these shared patterns NOW (with Rides) means every subsequent surface builds faster and feels cohesive.
        </span>
      </Card>

      {/* B — Live Feed */}
      <Card borderColor={`${STATUS.warning}20`}>
        <IconLabel icon={Play} label={'B. The "Live Feed" Question'} color={STATUS.warning} />
        <span className="block mb-2" style={{ ...TY.bodyR, fontSize: "11px", color: t.textSecondary, lineHeight: "1.55" }}>
          Experience spine says "admin should FEEL the platform's pulse." All data is static mock data. For prototype, a simple setInterval-based simulation that:
        </span>
        <Bullet color={STATUS.warning}>Adds new rides to live feed every few seconds</Bullet>
        <Bullet color={STATUS.warning}>Transitions ride statuses</Bullet>
        <Bullet color={STATUS.warning}>Updates KPI numbers with subtle count animations</Bullet>
        <span className="block mt-2 px-3 py-2 rounded-lg" style={{ background: `${STATUS.warning}08`, ...TY.bodyR, fontSize: "11px", color: STATUS.warning }}>
          Not about real data — about demonstrating the FEELING. A dashboard that moves feels alive. A static dashboard feels like a screenshot.
        </span>
      </Card>

      {/* C — Design System Maturity */}
      <Card borderColor={`${BRAND.green}20`}>
        <IconLabel icon={Layers} label="C. Design System Maturity" color={BRAND.green} />
        <span className="block mb-3" style={{ ...TY.bodyR, fontSize: "11px", color: t.textMuted, lineHeight: "1.55" }}>
          Current primitives are good atoms. But admin needs molecules and organisms:
        </span>
        <div className="space-y-2">
          {DESIGN_SYSTEM_MATURITY.map(layer => (
            <div key={layer.layer} className="flex items-start gap-3 rounded-lg p-3" style={{ background: t.surface, border: `1px solid ${layer.status === "have" ? `${BRAND.green}20` : `${STATUS.warning}20`}` }}>
              <span className="px-2 py-0.5 rounded-full shrink-0" style={{ ...TY.cap, fontSize: "9px", color: layer.status === "have" ? BRAND.green : STATUS.warning, background: layer.status === "have" ? `${BRAND.green}12` : `${STATUS.warning}12` }}>
                {layer.layer}
              </span>
              <div>
                <span className="block" style={{ ...TY.cap, fontSize: "9px", color: layer.status === "have" ? BRAND.green : STATUS.warning }}>{layer.status === "have" ? "Have" : "Need"}</span>
                <span style={{ ...TY.bodyR, fontSize: "11px", color: t.textSecondary, lineHeight: "1.5" }}>{layer.items}</span>
              </div>
            </div>
          ))}
        </div>
        <span className="block mt-3" style={{ ...TY.bodyR, fontSize: "11px", color: STATUS.warning, lineHeight: "1.55" }}>
          The jump from atoms to full surfaces is too big. The missing middle layer creates inconsistency risk between surfaces.
        </span>
      </Card>

      {/* D — Keyboard Navigation */}
      <Card borderColor={`${STATUS.info}20`}>
        <IconLabel icon={Keyboard} label="D. Keyboard Navigation & Command Palette" color={STATUS.info} />
        <span className="block mb-3" style={{ ...TY.bodyR, fontSize: "11px", color: t.textSecondary, lineHeight: "1.55" }}>
          Linear's power comes from keyboard-first design. For admin managing hundreds of rides and disputes daily — not luxury, it's efficiency.
        </span>
        {KEYBOARD_NAV_PHASES.map(phase => (
          <div key={phase.phase} className="flex items-start gap-2.5 py-1.5">
            <span className="px-2 py-0.5 rounded-full shrink-0" style={{ ...TY.cap, fontSize: "9px", color: STATUS.info, background: `${STATUS.info}12` }}>{phase.phase}</span>
            <span style={{ ...TY.bodyR, fontSize: "11px", color: t.textTertiary, lineHeight: "1.5" }}>{phase.items}</span>
          </div>
        ))}
      </Card>
    </div>
  );
}

function BuildSequenceSection() {
  const { t } = useAdminTheme();
  return (
    <>
      <div className="relative">
        <div className="absolute left-[19px] top-6 bottom-6 w-px" style={{ background: t.borderSubtle }} />
        <div className="space-y-3">
          {BUILD_SEQUENCE.map((item, i) => (
            <motion.div key={item.step} className="relative flex items-start gap-4 pl-1" initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 * i }}>
              <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 relative z-10" style={{ background: i === 0 ? item.color : `${item.color}15`, color: i === 0 ? "#fff" : item.color, ...TY.sub, fontSize: "13px", border: `2px solid ${item.color}` }}>
                {item.step}
              </div>
              <div className="flex-1 rounded-xl p-4" style={{ background: t.surfaceRaised, border: `1px solid ${i === 0 ? `${item.color}30` : t.borderSubtle}`, boxShadow: i === 0 ? `0 0 20px ${item.color}08` : t.shadow }}>
                <span style={{ ...TY.body, fontSize: "13px", color: t.text }}>{item.label}</span>
                <div className="mt-1.5">
                  {item.items.map((sub, j) => <Bullet key={j} color={item.color}>{sub}</Bullet>)}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      <div className="mt-4 rounded-lg p-3" style={{ background: t.surface, border: `1px solid ${t.borderSubtle}` }}>
        <span style={{ ...TY.bodyR, fontSize: "11px", color: t.textMuted, lineHeight: "1.55" }}>
          This completes <strong style={{ color: t.text }}>Phase 1</strong>. Phase 2 (Fleet) and Phase 3 (Hotels) follow the same pattern but with shared components already built.
        </span>
      </div>
    </>
  );
}

function BuiltSurfaceGapsSection() {
  const { t } = useAdminTheme();
  return (
    <>
      <Card>
        <span style={{ ...TY.bodyR, fontSize: "11px", color: t.textMuted }}>
          Not blockers for moving forward — noted for a polish pass.
        </span>
      </Card>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
        {BUILT_SURFACE_GAPS.map((surface, i) => (
          <motion.div key={surface.surface} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 * i }}>
            <Card borderColor={`${STATUS.warning}15`}>
              <IconLabel icon={surface.icon} label={surface.surface} color={STATUS.warning} tag={`${surface.gaps.length} gaps`} />
              {surface.gaps.map((gap, j) => (
                <Bullet key={j} color={STATUS.warning}>{gap}</Bullet>
              ))}
            </Card>
          </motion.div>
        ))}
      </div>
    </>
  );
}

function RiderDriverScanSection() {
  const { t } = useAdminTheme();
  return (
    <>
      <Card>
        <span style={{ ...TY.bodyR, fontSize: "11px", color: t.textMuted }}>
          These surfaces are "pretty much finished" — flagging only what jumps out without deep-diving.
        </span>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 mt-3">
        {/* Rider */}
        <Card borderColor={`${BRAND.green}20`}>
          <IconLabel icon={Navigation} label="Rider App" color={BRAND.green} />
          <span className="block mb-1.5" style={{ ...TY.label, fontSize: "8px", color: t.textFaint, letterSpacing: "0.08em" }}>HAS</span>
          <span className="block mb-3 px-3 py-2 rounded-lg" style={{ background: t.surface, ...TY.bodyR, fontSize: "11px", color: t.textSecondary, lineHeight: "1.55" }}>
            {RIDER_SCAN.has}
          </span>
          <span className="block mb-1.5" style={{ ...TY.label, fontSize: "8px", color: STATUS.warning, letterSpacing: "0.08em" }}>FLAGS</span>
          {RIDER_SCAN.flags.map((flag, i) => <Bullet key={i} color={STATUS.warning}>{flag}</Bullet>)}
        </Card>

        {/* Driver */}
        <Card borderColor={`${STATUS.info}20`}>
          <IconLabel icon={Car} label="Driver App" color={STATUS.info} />
          <span className="block mb-1.5" style={{ ...TY.label, fontSize: "8px", color: t.textFaint, letterSpacing: "0.08em" }}>HAS</span>
          <span className="block mb-3 px-3 py-2 rounded-lg" style={{ background: t.surface, ...TY.bodyR, fontSize: "11px", color: t.textSecondary, lineHeight: "1.55" }}>
            {DRIVER_SCAN.has}
          </span>
          <span className="block mb-1.5" style={{ ...TY.label, fontSize: "8px", color: STATUS.warning, letterSpacing: "0.08em" }}>FLAGS</span>
          {DRIVER_SCAN.flags.map((flag, i) => <Bullet key={i} color={STATUS.warning}>{flag}</Bullet>)}
        </Card>
      </div>
    </>
  );
}

function SummarySection() {
  const { t } = useAdminTheme();
  return (
    <motion.div
      className="rounded-2xl p-6 relative overflow-hidden"
      style={{ background: t.surfaceRaised, border: `1px solid ${BRAND.green}25`, boxShadow: `0 0 40px ${BRAND.green}08` }}
      initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
    >
      <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full opacity-20 pointer-events-none" style={{ background: `radial-gradient(circle, ${BRAND.green}30, transparent)` }} />
      <span className="block mb-3" style={{ ...TY.sub, fontSize: "14px", color: t.text }}>Summary</span>

      <span className="block mb-1" style={{ ...TY.label, fontSize: "9px", color: BRAND.green, letterSpacing: "0.08em" }}>STRONG FOUNDATIONS</span>
      <Bullet color={BRAND.green}>Command Center is sophisticated and well-conceived</Bullet>
      <Bullet color={BRAND.green}>Disputes variation C (Split Court) is the right pattern</Bullet>
      <Bullet color={BRAND.green}>Architecture document is thorough and well-reasoned</Bullet>
      <Bullet color={BRAND.green}>Theme system and UI primitives are solid</Bullet>
      <Bullet color={BRAND.green}>Nav structure matches the IA perfectly</Bullet>

      <div className="h-px my-3" style={{ background: t.borderSubtle }} />

      <span className="block mb-1" style={{ ...TY.label, fontSize: "9px", color: STATUS.warning, letterSpacing: "0.08em" }}>CRITICAL GAP</span>
      <span className="block mb-2" style={{ ...TY.bodyR, fontSize: "12px", color: t.textSecondary, lineHeight: "1.55" }}>
        The <strong style={{ color: t.text }}>middle layer</strong> — shared components (DataTable, RideCard, EntityCard, FilterBar) that enable rapid, consistent construction of the remaining 8 surfaces.
      </span>

      <div className="h-px my-3" style={{ background: t.borderSubtle }} />

      <span className="block mb-1" style={{ ...TY.label, fontSize: "9px", color: BRAND.green, letterSpacing: "0.08em" }}>RECOMMENDATION</span>
      <span className="block" style={{ ...TY.body, fontSize: "13px", color: BRAND.green }}>
        Build Rides next. It establishes every pattern the remaining surfaces need.
      </span>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   MAIN PAGE
   ═══════════════════════════════════════════════════════════════════════════ */

function BriefingContent() {
  const { t, theme, toggle } = useAdminTheme();

  return (
    <div className="min-h-screen" style={{ background: t.bg }}>
      {/* ─── Top bar ─── */}
      <div className="sticky top-0 z-50 flex items-center justify-between px-6 h-12" style={{ background: t.overlay, borderBottom: `1px solid ${t.border}`, backdropFilter: "blur(12px)" }}>
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full" style={{ background: BRAND.green }} />
          <span style={{ ...TY.sub, fontSize: "13px", color: t.text }}>JET Admin — Full Evaluation</span>
          <span style={{ ...TY.bodyR, fontSize: "11px", color: t.textMuted }}>March 10, 2026</span>
        </div>
        <button onClick={toggle} className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors" style={{ background: t.surfaceHover }}>
          {theme === "dark" ? <Sun size={14} style={{ color: t.icon }} /> : <Moon size={14} style={{ color: t.icon }} />}
        </button>
      </div>

      {/* ─── Content ─── */}
      <div className="max-w-[1100px] mx-auto px-5 py-8">

        {/* Hero */}
        <motion.div className="mb-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <span style={{ ...TY.h, fontSize: "24px", color: t.text, display: "block", marginBottom: "6px" }}>
            Admin Critical Evaluation & Next Steps
          </span>
          <span style={{ ...TY.bodyR, fontSize: "13px", color: t.textMuted }}>
            Fresh product person picking up mid-project. Evaluated against: PRD, Product OS, Admin Architecture, Experience Spine, Design References, Guidelines, and northstar products (Linear, Vercel, Apple, Airbnb).
          </span>
        </motion.div>

        {/* 1 — Inventory */}
        <SectionHeader number="1" label="Inventory — What Exists vs What's Needed" />
        <InventorySection />

        {/* 2 — Quality Assessment */}
        <SectionHeader number="2" label="Quality Assessment — Built vs Northstar Standard" subtitle="Tap each surface to expand strengths & gaps" />
        <QualityAssessmentSection />

        {/* 3 — First Principles */}
        <SectionHeader number="3" label="First Principles — What Should We Build Next?" />
        <FirstPrinciplesSection />

        {/* 4 — Rides Spec */}
        <SectionHeader number="4" label="Rides Surface — Product Specification" />
        <RidesSpecSection />

        {/* 5 — Riders Spec */}
        <SectionHeader number="5" label="Riders Surface — Product Specification" />
        <RidersSpecSection />

        {/* 6 — Drivers Directory */}
        <SectionHeader number="6" label="Drivers Directory — Product Specification" />
        <DriversSpecSection />

        {/* 7 — Strategic Observations */}
        <SectionHeader number="7" label="Strategic Observations — Beyond the Immediate Build" />
        <StrategicObservationsSection />

        {/* 8 — Build Sequence */}
        <SectionHeader number="8" label="Recommended Build Sequence" />
        <BuildSequenceSection />

        {/* 9 — Gaps in Built Surfaces */}
        <SectionHeader number="9" label="Gaps in Existing Built Surfaces" />
        <BuiltSurfaceGapsSection />

        {/* 10 — Rider & Driver Scan */}
        <SectionHeader number="10" label="Rider & Driver — Quick Gap Scan" />
        <RiderDriverScanSection />

        {/* Summary */}
        <SectionHeader number="★" label="Summary" />
        <SummarySection />

        <div className="h-16" />
      </div>
    </div>
  );
}

export function Briefing() {
  return (
    <AdminThemeProvider>
      <BriefingContent />
    </AdminThemeProvider>
  );
}
