/**
 * JET ADMIN — MOCK DATA
 *
 * Realistic simulated data for the admin command center.
 * All numbers reflect plausible Lagos, Nigeria ride-hailing metrics.
 */

export const HEALTH_METRICS = {
  ridesToday: 12481,
  ridesYesterday: 11832,
  activeDrivers: 847,
  totalDrivers: 1214,
  avgMatchTime: 42,
  matchTimeThreshold: { healthy: 60, warning: 90 },
  completionRate: 94.2,
  completionThreshold: { healthy: 92, warning: 85 },
  revenueToday: 14230000,
  revenueYesterday: 13180000,
  evPercentage: 31.4,
  evTarget: 40,
  avgRating: 4.72,
  surgeZones: 3,
  paymentFailureRate: 1.8,
  paymentThreshold: { healthy: 3, warning: 5 },
};

export const REVENUE_CHART = [
  { day: "Mon", revenue: 11400000, rides: 9820 },
  { day: "Tue", revenue: 12100000, rides: 10450 },
  { day: "Wed", revenue: 13800000, rides: 11200 },
  { day: "Thu", revenue: 12600000, rides: 10680 },
  { day: "Fri", revenue: 15200000, rides: 13100 },
  { day: "Sat", revenue: 13180000, rides: 11832 },
  { day: "Sun", revenue: 14230000, rides: 12481 },
];

export interface ActionItem {
  id: string;
  type: "dispute" | "verification" | "alert" | "payout" | "escalation" | "hotel" | "fleet";
  priority: "critical" | "high" | "medium" | "low";
  title: string;
  subtitle: string;
  timestamp: string;
  meta?: string;
}

export const ACTION_QUEUE: ActionItem[] = [
  {
    id: "act-1",
    type: "alert",
    priority: "critical",
    title: "Payment gateway degraded",
    subtitle: "Paystack reporting 12% failure rate in last 30min",
    timestamp: "4m ago",
    meta: "Infrastructure",
  },
  {
    id: "act-2",
    type: "dispute",
    priority: "high",
    title: "Overcharge claim — ₦4,200 vs ₦2,800 expected",
    subtitle: "Rider: Adaeze O. · Trip #JT-48291 · Lekki → VI",
    timestamp: "18m ago",
    meta: "Fare dispute",
  },
  {
    id: "act-3",
    type: "escalation",
    priority: "high",
    title: "Driver safety report escalated",
    subtitle: "Rider reported aggressive driving · Trip #JT-48105",
    timestamp: "32m ago",
    meta: "Safety",
  },
  {
    id: "act-4",
    type: "verification",
    priority: "medium",
    title: "23 drivers pending document review",
    subtitle: "Oldest application: 3 days ago · ₦345K/day opportunity cost",
    timestamp: "Ongoing",
    meta: "Supply pipeline",
  },
  {
    id: "act-5",
    type: "dispute",
    priority: "medium",
    title: "Route deviation complaint",
    subtitle: "Rider: Chidi E. · Trip #JT-47982 · Ikeja → Maryland",
    timestamp: "1h ago",
    meta: "Route dispute",
  },
  {
    id: "act-6",
    type: "payout",
    priority: "medium",
    title: "₦2.8M daily payout batch pending approval",
    subtitle: "412 drivers · Settlement window closes in 4h",
    timestamp: "2h ago",
    meta: "Finance",
  },
  {
    id: "act-7",
    type: "verification",
    priority: "low",
    title: "Vehicle inspection scheduling",
    subtitle: "8 approved drivers awaiting physical inspection slot",
    timestamp: "3h ago",
    meta: "Supply pipeline",
  },
  // ── Hotel action items ──
  {
    id: "act-h1",
    type: "hotel",
    priority: "high",
    title: "Eko Hotels invoice overdue — ₦2.84M",
    subtitle: "Invoice #INV-2847 · 7 days past due · Auto-escalation triggered",
    timestamp: "1h ago",
    meta: "Hotel billing",
  },
  {
    id: "act-h2",
    type: "hotel",
    priority: "medium",
    title: "Radisson Blu integration error",
    subtitle: "Room booking API returning 503 · Guest ride requests failing",
    timestamp: "45m ago",
    meta: "Hotel integration",
  },
  {
    id: "act-h3",
    type: "hotel",
    priority: "low",
    title: "3 hotel onboarding applications pending review",
    subtitle: "Oldest: The George Hotel · Applied 5 days ago",
    timestamp: "Ongoing",
    meta: "Hotel pipeline",
  },
  // ── Fleet action items ──
  {
    id: "act-f1",
    type: "fleet",
    priority: "high",
    title: "GreenRide Lagos — 8 vehicles expired insurance",
    subtitle: "Vehicles auto-suspended · 64 affected drivers",
    timestamp: "2h ago",
    meta: "Fleet compliance",
  },
  {
    id: "act-f2",
    type: "fleet",
    priority: "medium",
    title: "₦4.28M fleet payout settlement pending",
    subtitle: "5 fleet owners · Weekly settlement window closes tomorrow",
    timestamp: "3h ago",
    meta: "Fleet finance",
  },
  {
    id: "act-f3",
    type: "fleet",
    priority: "low",
    title: "EcoRide Services requesting vehicle cap increase",
    subtitle: "Current: 40 vehicles · Requested: 60 · Utilization: 68%",
    timestamp: "1d ago",
    meta: "Fleet operations",
  },
];

export interface ActivityEvent {
  id: string;
  type: "ride_completed" | "driver_online" | "dispute_opened" | "driver_verified" | "surge_activated" | "payment_failed" | "ride_cancelled" | "hotel_ride" | "hotel_invoice" | "hotel_issue" | "fleet_offline" | "fleet_payout" | "fleet_compliance";
  category: "ride" | "hotel" | "fleet";
  message: string;
  timestamp: string;
  zone?: string;
}

export const ACTIVITY_FEED: ActivityEvent[] = [
  { id: "ev-1", type: "ride_completed", category: "ride", message: "Trip #JT-48320 completed · ₦3,200 · EV", timestamp: "Just now", zone: "Victoria Island" },
  { id: "ev-2", type: "driver_online", category: "ride", message: "Emeka A. came online", timestamp: "1m ago", zone: "Lekki Phase 1" },
  { id: "ev-h1", type: "hotel_ride", category: "hotel", message: "Eko Hotel guest ride requested · Suite 412", timestamp: "1m ago", zone: "Victoria Island" },
  { id: "ev-3", type: "surge_activated", category: "ride", message: "Surge 1.4x activated", timestamp: "2m ago", zone: "Ikeja" },
  { id: "ev-f1", type: "fleet_offline", category: "fleet", message: "GreenRide Lagos: 3 vehicles went offline", timestamp: "2m ago", zone: "Yaba" },
  { id: "ev-4", type: "ride_completed", category: "ride", message: "Trip #JT-48318 completed · ₦2,100", timestamp: "2m ago", zone: "Surulere" },
  { id: "ev-5", type: "payment_failed", category: "ride", message: "Payment retry failed · Trip #JT-48315", timestamp: "3m ago", zone: "Yaba" },
  { id: "ev-h2", type: "hotel_invoice", category: "hotel", message: "Radisson Blu: daily invoice generated · ₦284K", timestamp: "4m ago", zone: "Ikeja GRA" },
  { id: "ev-6", type: "ride_cancelled", category: "ride", message: "Trip #JT-48312 cancelled by rider", timestamp: "4m ago", zone: "Ikoyi" },
  { id: "ev-7", type: "driver_verified", category: "ride", message: "Fatima B. verification approved", timestamp: "5m ago" },
  { id: "ev-8", type: "ride_completed", category: "ride", message: "Trip #JT-48310 completed · ₦4,800 · EV", timestamp: "5m ago", zone: "Lekki → Airport" },
  { id: "ev-f2", type: "fleet_payout", category: "fleet", message: "Metro Express fleet payout processed · ₦980K", timestamp: "6m ago" },
  { id: "ev-9", type: "driver_online", category: "ride", message: "Oluwaseun K. came online", timestamp: "6m ago", zone: "Ajah" },
  { id: "ev-h3", type: "hotel_ride", category: "hotel", message: "Oriental Hotel guest pickup completed · ★4.9", timestamp: "7m ago", zone: "Lekki Phase 1" },
  { id: "ev-10", type: "ride_completed", category: "ride", message: "Trip #JT-48308 completed · ₦1,800", timestamp: "7m ago", zone: "Maryland" },
  { id: "ev-11", type: "dispute_opened", category: "ride", message: "New dispute: wrong pickup location", timestamp: "8m ago", zone: "Ikeja GRA" },
  { id: "ev-f3", type: "fleet_compliance", category: "fleet", message: "EcoRide Services: 2 vehicles due for inspection", timestamp: "8m ago" },
  { id: "ev-12", type: "ride_completed", category: "ride", message: "Trip #JT-48305 completed · ₦2,600", timestamp: "9m ago", zone: "Gbagada" },
  { id: "ev-h4", type: "hotel_issue", category: "hotel", message: "Wheatbaker Hotel: guest wait time exceeded 8min", timestamp: "10m ago", zone: "Ikoyi" },
];

export interface ZoneData {
  name: string;
  drivers: number;
  activeRides: number;
  demandLevel: "low" | "normal" | "high" | "surge";
  surgeMultiplier?: number;
  avgMatchTime: number;
}

export const ZONE_DATA: ZoneData[] = [
  { name: "Victoria Island", drivers: 124, activeRides: 98, demandLevel: "high", avgMatchTime: 35 },
  { name: "Lekki Phase 1", drivers: 89, activeRides: 62, demandLevel: "normal", avgMatchTime: 42 },
  { name: "Ikeja", drivers: 76, activeRides: 71, demandLevel: "surge", surgeMultiplier: 1.4, avgMatchTime: 68 },
  { name: "Ikoyi", drivers: 52, activeRides: 38, demandLevel: "normal", avgMatchTime: 38 },
  { name: "Surulere", drivers: 64, activeRides: 48, demandLevel: "normal", avgMatchTime: 45 },
  { name: "Yaba", drivers: 41, activeRides: 39, demandLevel: "high", avgMatchTime: 55 },
  { name: "Ajah", drivers: 38, activeRides: 22, demandLevel: "low", avgMatchTime: 32 },
  { name: "Gbagada", drivers: 33, activeRides: 28, demandLevel: "normal", avgMatchTime: 44 },
  { name: "Maryland", drivers: 28, activeRides: 24, demandLevel: "normal", avgMatchTime: 40 },
  { name: "Ikeja GRA", drivers: 45, activeRides: 34, demandLevel: "normal", avgMatchTime: 36 },
];

export const VERIFICATION_PIPELINE = {
  newApplications: 12,
  documentsReview: 23,
  backgroundCheck: 8,
  inspectionScheduled: 5,
  inspectionComplete: 3,
  approved: 847,
  rejected: 42,
  avgProcessingDays: 4.2,
  oldestPending: 6,
};

export const DISPUTE_SUMMARY = {
  open: 12,
  urgent: 3,
  avgResolutionTime: 2.4,
  resolvedToday: 8,
  escalated: 2,
  riderFavored: 62,
  driverFavored: 28,
  splitResolution: 10,
};

/** Dispute counts by state — sourced from disputes JOIN trips ON trip.state */
export const DISPUTE_BY_STATE: Record<string, { open: number; urgent: number }> = {
  "Lagos": { open: 5, urgent: 1 },
  "FCT Abuja": { open: 4, urgent: 1 },
  "Rivers": { open: 2, urgent: 1 },
  "Oyo": { open: 1, urgent: 0 },
  "Kano": { open: 0, urgent: 0 },
};

/** Dispute counts by zone — sourced from disputes JOIN trips ON trip.zone */
export const DISPUTE_BY_ZONE: Record<string, { open: number; urgent: number }> = {
  "Victoria Island": { open: 2, urgent: 0 },
  "Lekki Phase 1": { open: 1, urgent: 0 },
  "Ikeja": { open: 1, urgent: 1 },
  "Ikoyi": { open: 0, urgent: 0 },
  "Surulere": { open: 1, urgent: 0 },
  "Yaba": { open: 0, urgent: 0 },
  "Central Area": { open: 1, urgent: 0 },
  "Wuse": { open: 2, urgent: 1 },
  "Garki": { open: 1, urgent: 0 },
  "Maitama": { open: 0, urgent: 0 },
  "Gwarinpa": { open: 0, urgent: 0 },
  "Kubwa": { open: 0, urgent: 0 },
};

export const FINANCE_SUMMARY = {
  grossRevenue: 14230000,
  commission: 2846000,
  paymentProcessing: 213450,
  netRevenue: 2632550,
  pendingPayouts: 11384000,
  failedPayments: 256200,
  refundsIssued: 148000,
  float: 28400000,
};

/** Revenue by state — sourced from SUM(trip.commission) WHERE trip.state = X */
export const REVENUE_BY_STATE: Record<string, { net: number; gross: number }> = {
  "Lagos": { net: 1420000, gross: 7100000 },
  "FCT Abuja": { net: 612000, gross: 3060000 },
  "Rivers": { net: 248000, gross: 1240000 },
  "Oyo": { net: 194000, gross: 970000 },
  "Kano": { net: 158550, gross: 792750 },
};

/** Revenue by zone — sourced from SUM(trip.commission) WHERE trip.zone = X */
export const REVENUE_BY_ZONE: Record<string, { net: number; gross: number }> = {
  "Victoria Island": { net: 428000, gross: 2140000 },
  "Lekki Phase 1": { net: 312000, gross: 1560000 },
  "Ikeja": { net: 284000, gross: 1420000 },
  "Ikoyi": { net: 196000, gross: 980000 },
  "Surulere": { net: 148000, gross: 740000 },
  "Yaba": { net: 52000, gross: 260000 },
  "Central Area": { net: 198000, gross: 990000 },
  "Wuse": { net: 162000, gross: 810000 },
  "Garki": { net: 124000, gross: 620000 },
  "Maitama": { net: 68000, gross: 340000 },
  "Gwarinpa": { net: 42000, gross: 210000 },
  "Kubwa": { net: 18000, gross: 90000 },
};

export function formatNaira(amount: number): string {
  if (amount >= 1000000) {
    return "₦" + (amount / 1000000).toFixed(1) + "M";
  }
  if (amount >= 1000) {
    return "₦" + Math.round(amount / 1000) + "K";
  }
  return "₦" + amount.toLocaleString();
}

// ---------------------------------------------------------------------------
// Hourly ride data (sparklines)
// ---------------------------------------------------------------------------
export const RIDES_HOURLY = [
  { h: "6am", v: 320 }, { h: "7am", v: 580 }, { h: "8am", v: 1200 },
  { h: "9am", v: 1450 }, { h: "10am", v: 1100 }, { h: "11am", v: 980 },
  { h: "12pm", v: 1050 }, { h: "1pm", v: 1120 }, { h: "2pm", v: 890 },
  { h: "3pm", v: 760 }, { h: "4pm", v: 920 }, { h: "5pm", v: 1380 },
];

export const SUPPLY_HOURLY = [
  { h: "6am", v: 280 }, { h: "7am", v: 420 }, { h: "8am", v: 680 },
  { h: "9am", v: 780 }, { h: "10am", v: 820 }, { h: "11am", v: 810 },
  { h: "12pm", v: 790 }, { h: "1pm", v: 830 }, { h: "2pm", v: 850 },
  { h: "3pm", v: 840 }, { h: "4pm", v: 860 }, { h: "5pm", v: 847 },
];

export const REVENUE_HOURLY = [
  { h: "6am", v: 380000 }, { h: "7am", v: 720000 }, { h: "8am", v: 1580000 },
  { h: "9am", v: 1820000 }, { h: "10am", v: 1340000 }, { h: "11am", v: 1180000 },
  { h: "12pm", v: 1260000 }, { h: "1pm", v: 1340000 }, { h: "2pm", v: 1060000 },
  { h: "3pm", v: 920000 }, { h: "4pm", v: 1100000 }, { h: "5pm", v: 1530000 },
];

// ---------------------------------------------------------------------------
// Zone map positions (percentage-based, rough Lagos geography)
// ---------------------------------------------------------------------------
export const ZONE_MAP_POSITIONS = [
  { name: "Victoria Island", x: 30, y: 68, drivers: 124, activeRides: 98, demandLevel: "high", avgMatchTime: 35 },
  { name: "Lekki Phase 1", x: 52, y: 74, drivers: 89, activeRides: 62, demandLevel: "normal", avgMatchTime: 42 },
  { name: "Ikeja", x: 28, y: 22, drivers: 76, activeRides: 71, demandLevel: "surge", surgeMultiplier: 1.4, avgMatchTime: 68 },
  { name: "Ikoyi", x: 36, y: 55, drivers: 52, activeRides: 38, demandLevel: "normal", avgMatchTime: 38 },
  { name: "Surulere", x: 16, y: 45, drivers: 64, activeRides: 48, demandLevel: "normal", avgMatchTime: 45 },
  { name: "Yaba", x: 40, y: 38, drivers: 41, activeRides: 39, demandLevel: "high", avgMatchTime: 55 },
  { name: "Ajah", x: 82, y: 82, drivers: 38, activeRides: 22, demandLevel: "low", avgMatchTime: 32 },
  { name: "Gbagada", x: 56, y: 28, drivers: 33, activeRides: 28, demandLevel: "normal", avgMatchTime: 44 },
  { name: "Maryland", x: 48, y: 20, drivers: 28, activeRides: 24, demandLevel: "normal", avgMatchTime: 40 },
  { name: "Ikeja GRA", x: 34, y: 12, drivers: 45, activeRides: 34, demandLevel: "normal", avgMatchTime: 36 },
];

export const ZONE_CONNECTIONS = [
  [0, 1], [0, 3], [3, 5], [5, 2], [5, 7], [7, 8], [8, 2], [2, 9],
  [4, 5], [4, 0], [1, 6], [7, 1], [3, 4],
];

// ---------------------------------------------------------------------------
// Zone data for non-Lagos states
// ---------------------------------------------------------------------------
export interface StateZoneData {
  name: string;
  x: number;
  y: number;
  drivers: number;
  activeRides: number;
  demandLevel: string;
  surgeMultiplier?: number;
  avgMatchTime: number;
}

export const STATE_ZONE_DATA: Record<string, StateZoneData[]> = {
  "FCT Abuja": [
    { name: "Central Area", x: 50, y: 40, drivers: 98, activeRides: 1420, demandLevel: "high", avgMatchTime: 38 },
    { name: "Wuse", x: 35, y: 30, drivers: 82, activeRides: 1180, demandLevel: "surge", surgeMultiplier: 1.3, avgMatchTime: 52 },
    { name: "Garki", x: 55, y: 60, drivers: 68, activeRides: 940, demandLevel: "normal", avgMatchTime: 44 },
    { name: "Maitama", x: 40, y: 55, drivers: 74, activeRides: 860, demandLevel: "high", avgMatchTime: 40 },
    { name: "Gwarinpa", x: 25, y: 50, drivers: 52, activeRides: 780, demandLevel: "normal", avgMatchTime: 55 },
    { name: "Kubwa", x: 30, y: 15, drivers: 38, activeRides: 660, demandLevel: "low", avgMatchTime: 62 },
  ],
  "Rivers": [
    { name: "Port Harcourt GRA", x: 50, y: 45, drivers: 42, activeRides: 310, demandLevel: "high", avgMatchTime: 52 },
    { name: "Trans Amadi", x: 65, y: 55, drivers: 32, activeRides: 210, demandLevel: "normal", avgMatchTime: 58 },
    { name: "Rumuokwurushi", x: 35, y: 35, drivers: 28, activeRides: 180, demandLevel: "normal", avgMatchTime: 64 },
    { name: "Eleme", x: 70, y: 30, drivers: 22, activeRides: 120, demandLevel: "low", avgMatchTime: 72 },
  ],
  "Oyo": [
    { name: "Ibadan Central", x: 50, y: 45, drivers: 38, activeRides: 260, demandLevel: "high", avgMatchTime: 48 },
    { name: "Bodija", x: 40, y: 30, drivers: 32, activeRides: 210, demandLevel: "normal", avgMatchTime: 55 },
    { name: "Ring Road", x: 60, y: 55, drivers: 28, activeRides: 170, demandLevel: "normal", avgMatchTime: 60 },
  ],
  "Kano": [
    { name: "Nassarawa GRA", x: 50, y: 45, drivers: 28, activeRides: 148, demandLevel: "high", avgMatchTime: 55 },
    { name: "Sabon Gari", x: 40, y: 30, drivers: 26, activeRides: 128, demandLevel: "normal", avgMatchTime: 62 },
    { name: "Bompai", x: 60, y: 55, drivers: 22, activeRides: 104, demandLevel: "low", avgMatchTime: 70 },
  ],
};

export const STATE_ZONE_CONNECTIONS: Record<string, number[][]> = {
  "FCT Abuja": [[0, 1], [0, 2], [0, 3], [1, 5], [3, 4], [2, 3], [4, 5]],
  "Rivers": [[0, 1], [0, 2], [1, 3]],
  "Oyo": [[0, 1], [0, 2], [1, 2]],
  "Kano": [[0, 1], [0, 2], [1, 2]],
};

// ---------------------------------------------------------------------------
// National state-level data (Nigeria-wide admin view)
// ---------------------------------------------------------------------------
export type StateStatus = "live" | "launching" | "planned";

export interface StateData {
  name: string;
  code: string;
  /** Percentage-based position on a Nigeria outline (0-100) */
  x: number;
  y: number;
  status: StateStatus;
  drivers: number;
  activeRides: number;
  revenue: number;
  zones: number;
  /** Optional surge zones count */
  surgeZones?: number;
  completionRate: number;
  avgMatchTime: number;
}

export const STATE_DATA: StateData[] = [
  // LIVE states
  { name: "Lagos", code: "LA", x: 18, y: 72, status: "live", drivers: 847, activeRides: 12481, revenue: 14230000, zones: 10, surgeZones: 3, completionRate: 94.2, avgMatchTime: 42 },
  { name: "FCT Abuja", code: "FC", x: 48, y: 45, status: "live", drivers: 412, activeRides: 5840, revenue: 6120000, zones: 6, surgeZones: 1, completionRate: 92.8, avgMatchTime: 48 },
  // LAUNCHING states
  { name: "Rivers", code: "RI", x: 42, y: 82, status: "launching", drivers: 124, activeRides: 820, revenue: 980000, zones: 4, completionRate: 88.1, avgMatchTime: 62 },
  { name: "Oyo", code: "OY", x: 22, y: 55, status: "launching", drivers: 98, activeRides: 640, revenue: 720000, zones: 3, completionRate: 86.5, avgMatchTime: 58 },
  { name: "Kano", code: "KN", x: 50, y: 12, status: "launching", drivers: 76, activeRides: 380, revenue: 420000, zones: 3, completionRate: 84.2, avgMatchTime: 65 },
  // PLANNED states
  { name: "Enugu", code: "EN", x: 48, y: 62, status: "planned", drivers: 0, activeRides: 0, revenue: 0, zones: 0, completionRate: 0, avgMatchTime: 0 },
  { name: "Kaduna", code: "KD", x: 44, y: 28, status: "planned", drivers: 0, activeRides: 0, revenue: 0, zones: 0, completionRate: 0, avgMatchTime: 0 },
  { name: "Delta", code: "DT", x: 34, y: 78, status: "planned", drivers: 0, activeRides: 0, revenue: 0, zones: 0, completionRate: 0, avgMatchTime: 0 },
  { name: "Ogun", code: "OG", x: 18, y: 62, status: "planned", drivers: 0, activeRides: 0, revenue: 0, zones: 0, completionRate: 0, avgMatchTime: 0 },
  { name: "Anambra", code: "AN", x: 42, y: 68, status: "planned", drivers: 0, activeRides: 0, revenue: 0, zones: 0, completionRate: 0, avgMatchTime: 0 },
  { name: "Kwara", code: "KW", x: 28, y: 45, status: "planned", drivers: 0, activeRides: 0, revenue: 0, zones: 0, completionRate: 0, avgMatchTime: 0 },
  { name: "Edo", code: "ED", x: 34, y: 68, status: "planned", drivers: 0, activeRides: 0, revenue: 0, zones: 0, completionRate: 0, avgMatchTime: 0 },
  { name: "Cross River", code: "CR", x: 55, y: 78, status: "planned", drivers: 0, activeRides: 0, revenue: 0, zones: 0, completionRate: 0, avgMatchTime: 0 },
  { name: "Plateau", code: "PL", x: 52, y: 42, status: "planned", drivers: 0, activeRides: 0, revenue: 0, zones: 0, completionRate: 0, avgMatchTime: 0 },
];

export const NATIONAL_METRICS = {
  totalStates: 36,
  liveStates: 2,
  launchingStates: 3,
  plannedStates: 9,
  totalDrivers: 1557,
  totalActiveRides: 20161,
  totalRevenue: 22470000,
  avgCompletionRate: 91.8,
  avgMatchTime: 47,
};

// ---------------------------------------------------------------------------
// Partner metrics (Hotels + Fleet Owners)
// ---------------------------------------------------------------------------
export const HOTEL_METRICS = {
  activePartners: 14,
  totalPartners: 22,
  guestRidesToday: 846,
  guestRidesYesterday: 781,
  revenueToday: 3420000,
  revenueYesterday: 3180000,
  avgTripValue: 4040,
  openCases: 2,
  pendingInvoices: 3,
  invoiceValue: 8240000,
  avgGuestRating: 4.68,
  topPartners: [
    { name: "Eko Hotels & Suites", rides: 186, revenue: 752000, status: "active" as const },
    { name: "Radisson Blu Ikeja", rides: 142, revenue: 574000, status: "active" as const },
    { name: "Oriental Hotel", rides: 128, revenue: 518000, status: "active" as const },
    { name: "Wheatbaker Hotel", rides: 94, revenue: 380000, status: "active" as const },
    { name: "Lagos Continental", rides: 87, revenue: 352000, status: "active" as const },
  ],
  onboardingPipeline: {
    application: 3,
    review: 2,
    contract: 1,
    integration: 2,
    live: 14,
  },
};

export const FLEET_METRICS = {
  activeFleets: 18,
  totalFleets: 26,
  fleetDriversOnline: 312,
  fleetDriversTotal: 486,
  fleetRidesToday: 4820,
  fleetRevenueToday: 5480000,
  fleetRevenueYesterday: 5120000,
  avgFleetUtilization: 72.4,
  evFleetPercentage: 38.2,
  openCases: 1,
  pendingPayouts: 4280000,
  topFleets: [
    { name: "GreenRide Lagos", drivers: 64, vehicles: 72, utilization: 82, evPct: 65, status: "active" as const },
    { name: "Metro Express", drivers: 48, vehicles: 52, utilization: 78, evPct: 22, status: "active" as const },
    { name: "SwiftMove Nigeria", drivers: 42, vehicles: 45, utilization: 74, evPct: 18, status: "active" as const },
    { name: "EcoRide Services", drivers: 38, vehicles: 40, utilization: 68, evPct: 85, status: "active" as const },
    { name: "DriveRight Fleet", drivers: 34, vehicles: 38, utilization: 64, evPct: 12, status: "active" as const },
  ],
  onboardingPipeline: {
    application: 4,
    verification: 2,
    vehicleApproval: 3,
    live: 18,
  },
};

// ---------------------------------------------------------------------------
// Hotel & Fleet pin positions (map-level geographic data)
// These use the same coordinate system as ZONE_MAP_POSITIONS (Lagos zone map)
// and STATE_DATA (national map). Hotels are demand-side partners, Fleets are
// supply-side partners — both are spatial entities on the same canvas.
// ---------------------------------------------------------------------------
export interface HotelPinData {
  name: string;
  /** Lagos zone map coords (x: 0-100, y: 0-100) */
  x: number;
  y: number;
  /** National map coords */
  nx: number;
  ny: number;
  zone: string;
  tier: string;
  rooms: number;
  guestRating: number;
  avgGuestTrips: number;
  pendingInvoice: number;
  state: string;
}

export const HOTEL_PIN_DATA: HotelPinData[] = [
  { name: "Eko Hotels & Suites", x: 32, y: 62, nx: 19, ny: 73, zone: "Victoria Island", tier: "5-Star", rooms: 824, guestRating: 4.8, avgGuestTrips: 3.2, pendingInvoice: 2840000, state: "Lagos" },
  { name: "Radisson Blu Ikeja", x: 26, y: 18, nx: 17, ny: 70, zone: "Ikeja GRA", tier: "5-Star", rooms: 170, guestRating: 4.6, avgGuestTrips: 2.8, pendingInvoice: 1420000, state: "Lagos" },
  { name: "Oriental Hotel", x: 38, y: 55, nx: 20, ny: 73, zone: "Lekki Phase 1", tier: "5-Star", rooms: 318, guestRating: 4.7, avgGuestTrips: 2.4, pendingInvoice: 0, state: "Lagos" },
  { name: "Wheatbaker Hotel", x: 34, y: 50, nx: 18, ny: 72, zone: "Ikoyi", tier: "4-Star", rooms: 68, guestRating: 4.5, avgGuestTrips: 2.1, pendingInvoice: 860000, state: "Lagos" },
  { name: "Lagos Continental", x: 30, y: 70, nx: 18, ny: 74, zone: "Victoria Island", tier: "5-Star", rooms: 358, guestRating: 4.4, avgGuestTrips: 1.9, pendingInvoice: 0, state: "Lagos" },
  // FCT Abuja hotels
  { name: "Transcorp Hilton", x: 52, y: 42, nx: 42, ny: 48, zone: "Central Area", tier: "5-Star", rooms: 670, guestRating: 4.7, avgGuestTrips: 3.0, pendingInvoice: 2100000, state: "FCT Abuja" },
  { name: "Sheraton Abuja", x: 48, y: 38, nx: 41, ny: 47, zone: "Central Area", tier: "5-Star", rooms: 525, guestRating: 4.6, avgGuestTrips: 2.6, pendingInvoice: 1580000, state: "FCT Abuja" },
  { name: "Nicon Luxury", x: 42, y: 56, nx: 40, ny: 50, zone: "Maitama", tier: "4-Star", rooms: 248, guestRating: 4.5, avgGuestTrips: 2.2, pendingInvoice: 940000, state: "FCT Abuja" },
  { name: "BON Hotel Abuja", x: 36, y: 32, nx: 39, ny: 46, zone: "Wuse", tier: "4-Star", rooms: 165, guestRating: 4.3, avgGuestTrips: 1.8, pendingInvoice: 0, state: "FCT Abuja" },
  { name: "The Envoy Hotel", x: 56, y: 62, nx: 43, ny: 51, zone: "Garki", tier: "3-Star", rooms: 96, guestRating: 4.1, avgGuestTrips: 1.5, pendingInvoice: 420000, state: "FCT Abuja" },
  // Rivers hotels
  { name: "Le Meridien PH", x: 52, y: 48, nx: 54, ny: 78, zone: "Port Harcourt GRA", tier: "5-Star", rooms: 130, guestRating: 4.4, avgGuestTrips: 2.0, pendingInvoice: 680000, state: "Rivers" },
];

export interface FleetPinData {
  name: string;
  /** Lagos zone map coords */
  x: number;
  y: number;
  /** National map coords */
  nx: number;
  ny: number;
  zone: string;
  driversOnline: number;
  ridesActive: number;
  pendingPayout: number;
  state: string;
}

export const FLEET_PIN_DATA: FleetPinData[] = [
  { name: "GreenRide Lagos", x: 44, y: 30, nx: 19, ny: 71, zone: "Yaba", driversOnline: 48, ridesActive: 42, pendingPayout: 1240000, state: "Lagos" },
  { name: "Metro Express", x: 22, y: 22, nx: 17, ny: 70, zone: "Ikeja", driversOnline: 36, ridesActive: 31, pendingPayout: 980000, state: "Lagos" },
  { name: "SwiftMove Nigeria", x: 14, y: 42, nx: 16, ny: 72, zone: "Surulere", driversOnline: 32, ridesActive: 28, pendingPayout: 0, state: "Lagos" },
  { name: "EcoRide Services", x: 56, y: 72, nx: 20, ny: 74, zone: "Lekki Phase 1", driversOnline: 28, ridesActive: 22, pendingPayout: 860000, state: "Lagos" },
  { name: "DriveRight Fleet", x: 60, y: 26, nx: 21, ny: 71, zone: "Gbagada", driversOnline: 24, ridesActive: 18, pendingPayout: 0, state: "Lagos" },
  // FCT Abuja fleets
  { name: "Capital Rides Abuja", x: 48, y: 38, nx: 42, ny: 47, zone: "Wuse", driversOnline: 32, ridesActive: 28, pendingPayout: 780000, state: "FCT Abuja" },
  { name: "Abuja Green Fleet", x: 52, y: 42, nx: 43, ny: 48, zone: "Central Area", driversOnline: 44, ridesActive: 38, pendingPayout: 1120000, state: "FCT Abuja" },
  { name: "FCT Express", x: 42, y: 56, nx: 40, ny: 50, zone: "Maitama", driversOnline: 22, ridesActive: 18, pendingPayout: 0, state: "FCT Abuja" },
  // Rivers fleets
  { name: "PH Ride Services", x: 50, y: 44, nx: 54, ny: 78, zone: "Port Harcourt GRA", driversOnline: 18, ridesActive: 14, pendingPayout: 460000, state: "Rivers" },
];

export const RIDER_METRICS = {
  totalRiders: 48200,
  activeToday: 8420,
  newToday: 124,
  newYesterday: 108,
  avgRating: 4.72,
  avgTripsPerRider: 2.4,
  churnRate: 3.2,
  retentionRate: 88.4,
  topPaymentMethod: "Card (62%)",
  avgTripValue: 2800,
  waitingNow: 342,
  matchedNow: 1240,
  inRideNow: 4680,
};

// ---------------------------------------------------------------------------
// Zone-level entity pins (Level 3 drill — individual entities within a zone)
// ---------------------------------------------------------------------------
export interface ZoneEntityPin {
  id: string;
  type: "driver" | "rider" | "hotel" | "fleet";
  name: string;
  /** Position within zone-level map (0-100 coordinate space) */
  x: number;
  y: number;
  zone: string;
  // Driver fields
  status?: "active" | "idle" | "en-route";
  vehicleType?: "EV" | "gas";
  rating?: number;
  ridesCompleted?: number;
  currentTrip?: string;
  // Rider fields
  tripStatus?: "waiting" | "matched" | "in-ride";
  trips?: number;
  // Hotel fields
  tier?: string;
  rooms?: number;
  guestRating?: number;
  // Fleet fields
  vehicles?: number;
  driversOnline?: number;
  utilization?: number;
}

// Generator for zone entity data
function generateZoneEntities(zone: string, cx: number, cy: number, driverCount: number): ZoneEntityPin[] {
  const entities: ZoneEntityPin[] = [];
  const spread = 22; // scatter radius around zone center

  // Drivers
  for (let i = 0; i < Math.min(driverCount, 12); i++) {
    const angle = (i / Math.min(driverCount, 12)) * Math.PI * 2;
    const dist = 4 + Math.random() * spread;
    entities.push({
      id: `d-${zone}-${i}`,
      type: "driver",
      name: ["Chidi O.", "Emeka A.", "Tunde B.", "Kola M.", "Segun D.", "Femi T.", "Ade K.", "Yusuf S.", "Bola R.", "Kunle J.", "Dayo P.", "Ife N."][i],
      x: Math.max(5, Math.min(95, cx + Math.cos(angle) * dist)),
      y: Math.max(5, Math.min(95, cy + Math.sin(angle) * dist)),
      zone,
      status: i < 3 ? "active" : i < 7 ? "en-route" : "idle",
      vehicleType: i % 3 === 0 ? "EV" : "gas",
      rating: +(4.2 + Math.random() * 0.7).toFixed(1),
      ridesCompleted: 180 + Math.floor(Math.random() * 600),
      currentTrip: i < 3 ? `#JT-${48000 + Math.floor(Math.random() * 1000)}` : undefined,
    });
  }

  // Riders (fewer, clustered differently)
  const riderCount = Math.floor(driverCount * 0.7);
  for (let i = 0; i < Math.min(riderCount, 8); i++) {
    const angle = (i / Math.min(riderCount, 8)) * Math.PI * 2 + 0.3;
    const dist = 3 + Math.random() * (spread - 4);
    entities.push({
      id: `r-${zone}-${i}`,
      type: "rider",
      name: ["Adaeze D.", "Ngozi E.", "Fatima H.", "Blessing O.", "Sarah K.", "Grace M.", "Toyin A.", "Halima Y."][i],
      x: Math.max(5, Math.min(95, cx + Math.cos(angle) * dist)),
      y: Math.max(5, Math.min(95, cy + Math.sin(angle) * dist)),
      zone,
      tripStatus: i < 2 ? "in-ride" : i < 5 ? "matched" : "waiting",
      trips: 12 + Math.floor(Math.random() * 80),
    });
  }

  return entities;
}

// Pre-generate entities for Lagos zones
export const ZONE_ENTITIES: Record<string, ZoneEntityPin[]> = {};
ZONE_MAP_POSITIONS.forEach(z => {
  const ents = generateZoneEntities(z.name, z.x, z.y, z.drivers);
  // Add hotel pins if any are in this zone
  HOTEL_PIN_DATA.filter(h => h.zone === z.name).forEach((h, i) => {
    ents.push({
      id: `h-${z.name}-${i}`,
      type: "hotel",
      name: h.name,
      x: Math.max(5, Math.min(95, z.x + (i % 2 === 0 ? -8 : 8) + Math.random() * 4)),
      y: Math.max(5, Math.min(95, z.y + (i % 2 === 0 ? 6 : -6) + Math.random() * 4)),
      zone: z.name,
      tier: h.tier,
      rooms: h.rooms,
      guestRating: h.guestRating,
    });
  });
  // Add fleet pins if any are in this zone
  FLEET_PIN_DATA.filter(f => f.zone === z.name).forEach((f, i) => {
    ents.push({
      id: `f-${z.name}-${i}`,
      type: "fleet",
      name: f.name,
      x: Math.max(5, Math.min(95, z.x + (i % 2 === 0 ? 10 : -10) + Math.random() * 4)),
      y: Math.max(5, Math.min(95, z.y + (i % 2 === 0 ? -8 : 8) + Math.random() * 4)),
      zone: z.name,
      vehicles: FLEET_METRICS.topFleets.find(fl => fl.name === f.name)?.vehicles,
      driversOnline: f.driversOnline,
      utilization: FLEET_METRICS.topFleets.find(fl => fl.name === f.name)?.utilization,
    });
  });
  ZONE_ENTITIES[z.name] = ents;
});

// Also generate entities for ALL state zones (non-Lagos)
function addHotelFleetToZone(zoneName: string, ents: ZoneEntityPin[], cx: number, cy: number) {
  HOTEL_PIN_DATA.filter(h => h.zone === zoneName).forEach((h, i) => {
    ents.push({
      id: `h-${zoneName}-${i}`,
      type: "hotel",
      name: h.name,
      x: Math.max(5, Math.min(95, cx + (i % 2 === 0 ? -8 : 8) + Math.random() * 4)),
      y: Math.max(5, Math.min(95, cy + (i % 2 === 0 ? 6 : -6) + Math.random() * 4)),
      zone: zoneName,
      tier: h.tier,
      rooms: h.rooms,
      guestRating: h.guestRating,
    });
  });
  FLEET_PIN_DATA.filter(f => f.zone === zoneName).forEach((f, i) => {
    ents.push({
      id: `f-${zoneName}-${i}`,
      type: "fleet",
      name: f.name,
      x: Math.max(5, Math.min(95, cx + (i % 2 === 0 ? 10 : -10) + Math.random() * 4)),
      y: Math.max(5, Math.min(95, cy + (i % 2 === 0 ? -8 : 8) + Math.random() * 4)),
      zone: zoneName,
      vehicles: FLEET_METRICS.topFleets.find(fl => fl.name === f.name)?.vehicles ?? Math.floor(f.driversOnline * 1.2),
      driversOnline: f.driversOnline,
      utilization: FLEET_METRICS.topFleets.find(fl => fl.name === f.name)?.utilization ?? Math.floor(60 + Math.random() * 25),
    });
  });
}

Object.entries(STATE_ZONE_DATA).forEach(([_stateName, zones]) => {
  zones.forEach(z => {
    if (!ZONE_ENTITIES[z.name]) {
      const ents = generateZoneEntities(z.name, z.x, z.y, z.drivers);
      addHotelFleetToZone(z.name, ents, z.x, z.y);
      ZONE_ENTITIES[z.name] = ents;
    }
  });
});