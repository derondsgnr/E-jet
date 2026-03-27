 /**
 * JET ADMIN — DISPUTE MOCK DATA
 *
 * Rich simulated data for the dispute resolution surface.
 * Reflects real-world Nigerian ride-hailing dispute patterns.
 */

export type DisputeCategory = "fare" | "route" | "safety" | "payment" | "service" | "property" | "no_show";
export type DisputePriority = "critical" | "high" | "medium" | "low";
export type DisputeStatus = "new" | "in_review" | "awaiting_evidence" | "escalated" | "resolved";
export type EvidenceType = "gps_trace" | "chat" | "fare_calc" | "photo" | "system_log" | "rating" | "call_recording";
export type TimelineEventType = "system" | "rider" | "driver" | "admin" | "auto" | "hotel";

/**
 * Dispute types:
 *   A: rider↔driver (standard ride disputes)
 *   B: hotel↔driver (hotel files against driver on behalf of guest)
 *   C: driver→rider (driver files against rider — uses same shape as A)
 *   D: driver→hotel_guest (driver files against a hotel guest)
 */
export type DisputeType = "rider_driver" | "hotel_driver" | "driver_hotel_guest";

export interface DisputeParty {
  name: string;
  phone: string;
  rating: number;
  totalTrips: number;
  avatar: string; // initials
  joinDate: string;
  disputeHistory: number;
}

export interface HotelParty {
  name: string;
  phone: string;
  avatar: string;
  tier: "gold" | "silver" | "bronze";
  totalBookings: number;
  address: string;
  contactPerson: string;
  disputeHistory: number;
}

export interface GuestInfo {
  name: string;
  phone: string;
  avatar: string;
  roomNumber: string;
  checkIn: string;
  checkOut: string;
}

export interface TimelineEvent {
  id: string;
  type: TimelineEventType;
  timestamp: string;
  title: string;
  detail: string;
  evidenceRef?: string;
}

export interface Evidence {
  id: string;
  type: EvidenceType;
  label: string;
  summary: string;
  timestamp: string;
  source: "rider" | "driver" | "system" | "hotel";
}

export interface Dispute {
  id: string;
  disputeType: DisputeType;
  category: DisputeCategory;
  priority: DisputePriority;
  status: DisputeStatus;
  title: string;
  description: string;
  amount?: number;
  rider: DisputeParty;
  driver: DisputeParty;
  /** Present when disputeType is hotel_driver or driver_hotel_guest */
  hotel?: HotelParty;
  /** Present when disputeType involves a hotel guest */
  guest?: GuestInfo;
  /** Fleet context — present when driver is fleet-affiliated */
  fleet?: { name: string; id: string; vehicleCount: number };
  trip: {
    id: string;
    pickup: string;
    dropoff: string;
    distance: string;
    duration: string;
    fare: number;
    surgeMultiplier: number;
    date: string;
    vehicleType: string;
    paymentMethod: string;
    /** Booking source — relevant for hotel disputes */
    bookingSource?: "app" | "hotel_concierge" | "fleet_dispatch";
  };
  timeline: TimelineEvent[];
  evidence: Evidence[];
  createdAt: string;
  slaDeadline: string;
  slaHoursLeft: number;
  assignedTo?: string;
  tags: string[];
}

export const CATEGORY_META: Record<DisputeCategory, { label: string; color: string; icon: string }> = {
  fare: { label: "Fare Dispute", color: "#F59E0B", icon: "₦" },
  route: { label: "Route Deviation", color: "#3B82F6", icon: "↗" },
  safety: { label: "Safety Report", color: "#D4183D", icon: "!" },
  payment: { label: "Payment Issue", color: "#F97316", icon: "₦" },
  service: { label: "Service Quality", color: "#737373", icon: "★" },
  property: { label: "Property Damage", color: "#8B5CF6", icon: "⚠" },
  no_show: { label: "No-Show", color: "#EC4899", icon: "✕" },
};

export const DISPUTE_TYPE_META: Record<DisputeType, { label: string; shortLabel: string; color: string }> = {
  rider_driver: { label: "Rider ↔ Driver", shortLabel: "R↔D", color: "#3B82F6" },
  hotel_driver: { label: "Hotel → Driver", shortLabel: "H→D", color: "#8B5CF6" },
  driver_hotel_guest: { label: "Driver → Guest", shortLabel: "D→G", color: "#EC4899" },
};

export const STATUS_META: Record<DisputeStatus, { label: string; color: string }> = {
  new: { label: "New", color: "#3B82F6" },
  in_review: { label: "In Review", color: "#F59E0B" },
  awaiting_evidence: { label: "Awaiting Evidence", color: "#F97316" },
  escalated: { label: "Escalated", color: "#D4183D" },
  resolved: { label: "Resolved", color: "#1DB954" },
};

export const DISPUTES: Dispute[] = [
  {
    id: "DSP-1047",
    disputeType: "rider_driver",
    category: "safety",
    priority: "critical",
    status: "escalated",
    title: "Aggressive driving reported — near-miss incident",
    description: "Rider reports driver running a red light at Maryland junction and nearly colliding with a BRT bus. Rider felt unsafe and requested immediate stop.",
    rider: { name: "Adaeze Okonkwo", phone: "+234 812 345 6789", rating: 4.89, totalTrips: 234, avatar: "AO", joinDate: "Mar 2024", disputeHistory: 1 },
    driver: { name: "Emeka Nwosu", phone: "+234 803 456 7890", rating: 4.21, totalTrips: 1847, avatar: "EN", joinDate: "Jun 2023", disputeHistory: 5 },
    trip: { id: "TRP-88291", pickup: "Yaba, Lagos", dropoff: "Victoria Island", distance: "14.2 km", duration: "38 min", fare: 4200, surgeMultiplier: 1.0, date: "Mar 8, 3:14 PM", vehicleType: "JET Comfort", paymentMethod: "Card •• 4521" },
    timeline: [
      { id: "t1", type: "system", timestamp: "3:14 PM", title: "Ride started", detail: "Pickup confirmed at Yaba" },
      { id: "t2", type: "system", timestamp: "3:28 PM", title: "Speed anomaly detected", detail: "Vehicle exceeded 85 km/h in 50 km/h zone for 12 seconds" },
      { id: "t3", type: "auto", timestamp: "3:29 PM", title: "Hard brake event", detail: "Deceleration of 0.8g detected near Maryland junction" },
      { id: "t4", type: "rider", timestamp: "3:31 PM", title: "SOS button pressed", detail: "Rider activated emergency alert" },
      { id: "t5", type: "system", timestamp: "3:31 PM", title: "Safety protocol initiated", detail: "Location shared with emergency contacts" },
      { id: "t6", type: "rider", timestamp: "3:33 PM", title: "Rider requested stop", detail: "\"Please stop the car, I want to get out\"" },
      { id: "t7", type: "driver", timestamp: "3:34 PM", title: "Trip ended early", detail: "Driver pulled over at Maryland Mall" },
      { id: "t8", type: "rider", timestamp: "3:52 PM", title: "Dispute filed", detail: "Category: Safety — Aggressive driving" },
      { id: "t9", type: "admin", timestamp: "4:05 PM", title: "Auto-escalated", detail: "Safety disputes with SOS trigger auto-escalate" },
    ],
    evidence: [
      { id: "e1", type: "gps_trace", label: "GPS Trace", summary: "Route shows 85km/h spike at Maryland. Hard brake at junction.", timestamp: "3:28 PM", source: "system" },
      { id: "e2", type: "system_log", label: "Speed Alert", summary: "Exceeded zone limit by 35 km/h for 12s", timestamp: "3:28 PM", source: "system" },
      { id: "e3", type: "system_log", label: "Hard Brake Log", summary: "0.8g deceleration event — threshold is 0.6g", timestamp: "3:29 PM", source: "system" },
      { id: "e4", type: "chat", label: "In-ride Chat", summary: "Rider asked driver to slow down twice before SOS", timestamp: "3:30 PM", source: "rider" },
      { id: "e5", type: "system_log", label: "SOS Trigger", summary: "Emergency button pressed at 6.5058°N, 3.3731°E", timestamp: "3:31 PM", source: "system" },
      { id: "e6", type: "rating", label: "Post-trip Rating", summary: "Rider gave 1★ with comment about unsafe driving", timestamp: "3:55 PM", source: "rider" },
    ],
    createdAt: "48 min ago",
    slaDeadline: "2h",
    slaHoursLeft: 1.2,
    assignedTo: "Senior Ops",
    tags: ["SOS", "speed-violation", "escalated", "priority"],
  },
  {
    id: "DSP-1046",
    disputeType: "rider_driver",
    category: "fare",
    priority: "high",
    status: "in_review",
    title: "Rider charged ₦6,800 for ₦3,200 trip — surge not displayed",
    description: "Rider claims surge pricing was not shown at booking. App showed ₦3,200 estimate but final charge was ₦6,800 with 2.1x surge applied.",
    rider: { name: "Chidinma Eze", phone: "+234 806 789 0123", rating: 4.92, totalTrips: 156, avatar: "CE", joinDate: "Aug 2024", disputeHistory: 0 },
    driver: { name: "Oluwaseun Adeyemi", phone: "+234 815 234 5678", rating: 4.76, totalTrips: 2103, avatar: "OA", joinDate: "Jan 2023", disputeHistory: 2 },
    trip: { id: "TRP-88284", pickup: "Lekki Phase 1", dropoff: "Ikeja GRA", distance: "22.8 km", duration: "52 min", fare: 6800, surgeMultiplier: 2.1, date: "Mar 8, 1:45 PM", vehicleType: "JET Go", paymentMethod: "Wallet" },
    timeline: [
      { id: "t1", type: "system", timestamp: "1:42 PM", title: "Ride requested", detail: "Estimate shown: ₦3,200" },
      { id: "t2", type: "system", timestamp: "1:43 PM", title: "Surge activated", detail: "2.1x surge in Lekki Phase 1 zone" },
      { id: "t3", type: "system", timestamp: "1:45 PM", title: "Ride started", detail: "Driver matched and pickup confirmed" },
      { id: "t4", type: "system", timestamp: "2:37 PM", title: "Ride completed", detail: "Final fare: ₦6,800" },
      { id: "t5", type: "rider", timestamp: "2:42 PM", title: "Dispute filed", detail: "\"I was never shown surge pricing. The app said ₦3,200\"" },
      { id: "t6", type: "admin", timestamp: "2:58 PM", title: "Assigned for review", detail: "Fare disputes with >50% variance auto-flagged" },
    ],
    evidence: [
      { id: "e1", type: "fare_calc", label: "Fare Breakdown", summary: "Base ₦3,200 × 2.1x surge = ₦6,720 + ₦80 fees = ₦6,800", timestamp: "2:37 PM", source: "system" },
      { id: "e2", type: "system_log", label: "Surge Display Log", summary: "Surge confirmation screen rendered but no tap event logged", timestamp: "1:43 PM", source: "system" },
      { id: "e3", type: "system_log", label: "App Version", summary: "Rider on v2.3.1 — known issue with surge modal on Android 12", timestamp: "1:42 PM", source: "system" },
      { id: "e4", type: "chat", label: "Post-ride Chat", summary: "Rider contacted support: \"Why am I paying double?\"", timestamp: "2:45 PM", source: "rider" },
    ],
    createdAt: "2h ago",
    slaDeadline: "6h",
    slaHoursLeft: 4,
    tags: ["surge-display", "fare-variance", "app-bug-possible"],
  },
  {
    id: "DSP-1045",
    disputeType: "rider_driver",
    category: "route",
    priority: "medium",
    status: "new",
    title: "Driver took Apapa route instead of Third Mainland Bridge",
    description: "Rider says driver deliberately took a longer route through Apapa instead of Third Mainland Bridge, adding 25 minutes and ₦1,100 to the fare.",
    rider: { name: "Kemi Adebayo", phone: "+234 809 876 5432", rating: 4.67, totalTrips: 89, avatar: "KA", joinDate: "Nov 2024", disputeHistory: 2 },
    driver: { name: "Ibrahim Musa", phone: "+234 802 111 2222", rating: 4.45, totalTrips: 3201, avatar: "IM", joinDate: "Mar 2023", disputeHistory: 7 },
    trip: { id: "TRP-88276", pickup: "Surulere", dropoff: "Victoria Island", distance: "19.1 km", duration: "67 min", fare: 5100, surgeMultiplier: 1.0, date: "Mar 8, 11:20 AM", vehicleType: "JET Comfort", paymentMethod: "Card •• 8832" },
    timeline: [
      { id: "t1", type: "system", timestamp: "11:17 AM", title: "Ride requested", detail: "Optimal route: Third Mainland Bridge — 42 min, ₦4,000 est." },
      { id: "t2", type: "system", timestamp: "11:20 AM", title: "Ride started", detail: "Pickup confirmed at Surulere" },
      { id: "t3", type: "auto", timestamp: "11:32 AM", title: "Route deviation detected", detail: "Driver diverged from recommended route at Eko Bridge junction" },
      { id: "t4", type: "rider", timestamp: "11:35 AM", title: "Rider message", detail: "\"Why are we going through Apapa?\"" },
      { id: "t5", type: "driver", timestamp: "11:36 AM", title: "Driver response", detail: "\"Third Mainland Bridge has heavy traffic\"" },
      { id: "t6", type: "system", timestamp: "12:27 PM", title: "Ride completed", detail: "Actual: 19.1 km, 67 min — ₦5,100" },
      { id: "t7", type: "rider", timestamp: "12:35 PM", title: "Dispute filed", detail: "\"Driver took longer route on purpose\"" },
    ],
    evidence: [
      { id: "e1", type: "gps_trace", label: "GPS Comparison", summary: "Recommended: 14.2 km via 3rd Mainland. Actual: 19.1 km via Apapa (+34%)", timestamp: "12:27 PM", source: "system" },
      { id: "e2", type: "system_log", label: "Traffic Data", summary: "Third Mainland Bridge traffic at 11:20: moderate (no advisory)", timestamp: "11:20 AM", source: "system" },
      { id: "e3", type: "fare_calc", label: "Fare Delta", summary: "Expected: ₦4,000 — Charged: ₦5,100 — Delta: +₦1,100 (27.5%)", timestamp: "12:27 PM", source: "system" },
      { id: "e4", type: "chat", label: "In-ride Chat", summary: "Rider questioned route; driver cited traffic (not confirmed by data)", timestamp: "11:35 AM", source: "rider" },
    ],
    createdAt: "4h ago",
    slaDeadline: "12h",
    slaHoursLeft: 8,
    tags: ["route-deviation", "fare-delta"],
  },
  {
    id: "DSP-1044",
    disputeType: "rider_driver",
    category: "payment",
    priority: "high",
    status: "awaiting_evidence",
    title: "Double charge — rider billed twice for same trip",
    description: "Rider's bank statement shows two deductions of ₦3,450 for a single trip. Second charge appeared 4 hours after trip completion.",
    rider: { name: "Fatimah Bello", phone: "+234 811 222 3333", rating: 4.95, totalTrips: 312, avatar: "FB", joinDate: "Jan 2024", disputeHistory: 0 },
    driver: { name: "Chukwudi Obi", phone: "+234 805 444 5555", rating: 4.68, totalTrips: 1456, avatar: "CO", joinDate: "Sep 2023", disputeHistory: 1 },
    trip: { id: "TRP-88201", pickup: "Ikeja", dropoff: "Ogba", distance: "6.3 km", duration: "22 min", fare: 3450, surgeMultiplier: 1.0, date: "Mar 7, 6:15 PM", vehicleType: "JET Go", paymentMethod: "Card •• 1199" },
    timeline: [
      { id: "t1", type: "system", timestamp: "6:15 PM", title: "Ride completed", detail: "Charged ₦3,450 to Card •• 1199" },
      { id: "t2", type: "system", timestamp: "10:22 PM", title: "Duplicate charge", detail: "Second debit of ₦3,450 processed by payment gateway" },
      { id: "t3", type: "rider", timestamp: "10:45 PM", title: "Rider contacted support", detail: "\"I've been charged twice for the same ride\"" },
      { id: "t4", type: "admin", timestamp: "Mar 8 9:00 AM", title: "Paystack log requested", detail: "Awaiting transaction reconciliation from gateway" },
    ],
    evidence: [
      { id: "e1", type: "system_log", label: "Payment Log", summary: "Two successful charges: TXN-8829A (6:15 PM) and TXN-8829B (10:22 PM)", timestamp: "10:22 PM", source: "system" },
      { id: "e2", type: "system_log", label: "Gateway Status", summary: "Paystack reported intermittent timeout at 10:20 PM — retry triggered duplicate", timestamp: "10:22 PM", source: "system" },
    ],
    createdAt: "18h ago",
    slaDeadline: "4h",
    slaHoursLeft: 2.5,
    tags: ["double-charge", "paystack", "refund-likely"],
  },
  {
    id: "DSP-1043",
    disputeType: "rider_driver",
    category: "service",
    priority: "medium",
    status: "in_review",
    title: "Vehicle condition — AC not working, dirty interior",
    description: "Rider booked JET Comfort but vehicle had non-functional AC and stained seats. Rider requesting partial refund for comfort downgrade.",
    rider: { name: "Yinka Adeola", phone: "+234 808 666 7777", rating: 4.81, totalTrips: 67, avatar: "YA", joinDate: "Dec 2024", disputeHistory: 1 },
    driver: { name: "Abubakar Sani", phone: "+234 807 888 9999", rating: 4.12, totalTrips: 892, avatar: "AS", joinDate: "Apr 2023", disputeHistory: 9 },
    trip: { id: "TRP-88215", pickup: "Ajah", dropoff: "Lekki Phase 1", distance: "8.7 km", duration: "28 min", fare: 3800, surgeMultiplier: 1.0, date: "Mar 8, 10:05 AM", vehicleType: "JET Comfort", paymentMethod: "Wallet" },
    timeline: [
      { id: "t1", type: "system", timestamp: "10:05 AM", title: "Ride started", detail: "JET Comfort — Toyota Camry 2019" },
      { id: "t2", type: "rider", timestamp: "10:08 AM", title: "Rider message", detail: "\"The AC is not working and seats are dirty\"" },
      { id: "t3", type: "driver", timestamp: "10:10 AM", title: "Driver response", detail: "\"Sorry, the AC just stopped this morning\"" },
      { id: "t4", type: "system", timestamp: "10:33 AM", title: "Ride completed", detail: "Fare: ₦3,800" },
      { id: "t5", type: "rider", timestamp: "10:40 AM", title: "Dispute filed + photos", detail: "Uploaded 2 photos of stained seats and broken AC vent" },
    ],
    evidence: [
      { id: "e1", type: "photo", label: "Seat Photo", summary: "Visible stain on rear passenger seat — food/drink spill", timestamp: "10:40 AM", source: "rider" },
      { id: "e2", type: "photo", label: "AC Vent Photo", summary: "Broken AC vent cover on passenger side", timestamp: "10:40 AM", source: "rider" },
      { id: "e3", type: "rating", label: "Driver History", summary: "3 similar complaints in last 30 days about vehicle condition", timestamp: "", source: "system" },
      { id: "e4", type: "system_log", label: "Inspection Record", summary: "Last inspection: Feb 12 — passed with note about AC maintenance needed", timestamp: "", source: "system" },
    ],
    createdAt: "5h ago",
    slaDeadline: "24h",
    slaHoursLeft: 19,
    tags: ["vehicle-condition", "comfort-downgrade", "repeat-offender"],
  },
  {
    id: "DSP-1042",
    disputeType: "rider_driver",
    category: "fare",
    priority: "low",
    status: "new",
    title: "Toll charge added but rider says no toll road used",
    description: "₦400 toll charge added to fare but rider claims driver did not use Lekki toll road.",
    amount: 400,
    rider: { name: "Ngozi Uche", phone: "+234 814 333 4444", rating: 4.73, totalTrips: 145, avatar: "NU", joinDate: "May 2024", disputeHistory: 1 },
    driver: { name: "Tunde Bakare", phone: "+234 901 555 6666", rating: 4.58, totalTrips: 1678, avatar: "TB", joinDate: "Feb 2023", disputeHistory: 3 },
    trip: { id: "TRP-88188", pickup: "Ajah", dropoff: "VI", distance: "18.4 km", duration: "45 min", fare: 5400, surgeMultiplier: 1.0, date: "Mar 8, 8:30 AM", vehicleType: "JET Go", paymentMethod: "Card •• 6644" },
    timeline: [
      { id: "t1", type: "system", timestamp: "8:30 AM", title: "Ride started", detail: "" },
      { id: "t2", type: "system", timestamp: "9:15 AM", title: "Ride completed", detail: "₦5,000 base + ₦400 toll = ₦5,400" },
      { id: "t3", type: "rider", timestamp: "9:25 AM", title: "Dispute filed", detail: "\"We did not pass through the toll gate\"" },
    ],
    evidence: [
      { id: "e1", type: "gps_trace", label: "GPS Trace", summary: "Route passed through Admiralty Way — not the toll road", timestamp: "9:15 AM", source: "system" },
      { id: "e2", type: "fare_calc", label: "Toll Auto-add", summary: "System auto-added toll based on zone pair. GPS confirms no toll road used.", timestamp: "9:15 AM", source: "system" },
    ],
    createdAt: "7h ago",
    slaDeadline: "48h",
    slaHoursLeft: 41,
    tags: ["toll-dispute", "auto-toll-error"],
  },
  {
    id: "DSP-1041",
    disputeType: "rider_driver",
    category: "safety",
    priority: "high",
    status: "new",
    title: "Driver making phone calls while driving",
    description: "Rider reports driver held phone to ear for multiple calls during the trip, despite being asked to stop.",
    rider: { name: "Olumide Fashola", phone: "+234 816 777 8888", rating: 4.86, totalTrips: 203, avatar: "OF", joinDate: "Jun 2024", disputeHistory: 0 },
    driver: { name: "Gbenga Alabi", phone: "+234 904 999 0000", rating: 4.33, totalTrips: 2456, avatar: "GA", joinDate: "Nov 2022", disputeHistory: 6 },
    trip: { id: "TRP-88256", pickup: "Ikoyi", dropoff: "Yaba", distance: "11.5 km", duration: "35 min", fare: 3600, surgeMultiplier: 1.0, date: "Mar 8, 12:40 PM", vehicleType: "JET EV", paymentMethod: "Wallet" },
    timeline: [
      { id: "t1", type: "system", timestamp: "12:40 PM", title: "Ride started", detail: "JET EV — BYD Atto 3" },
      { id: "t2", type: "rider", timestamp: "12:48 PM", title: "Rider message", detail: "\"Driver is on a phone call while driving\"" },
      { id: "t3", type: "rider", timestamp: "12:55 PM", title: "Second complaint", detail: "\"Still on the phone. I asked him to stop and he ignored me\"" },
      { id: "t4", type: "system", timestamp: "1:15 PM", title: "Ride completed", detail: "" },
      { id: "t5", type: "rider", timestamp: "1:20 PM", title: "Dispute filed", detail: "Category: Safety — Distracted driving" },
    ],
    evidence: [
      { id: "e1", type: "chat", label: "In-ride Messages", summary: "Two messages from rider during trip about phone usage", timestamp: "12:48 PM", source: "rider" },
      { id: "e2", type: "system_log", label: "Driver Phone Activity", summary: "3 outgoing calls detected during trip (Bluetooth not connected)", timestamp: "12:45 PM", source: "system" },
      { id: "e3", type: "rating", label: "Driver History", summary: "2 previous distracted driving reports in last 60 days", timestamp: "", source: "system" },
    ],
    createdAt: "2h ago",
    slaDeadline: "6h",
    slaHoursLeft: 4,
    tags: ["distracted-driving", "repeat-pattern", "phone-use"],
  },

  // ─── TYPE B: Hotel → Driver ─────────────────────────────────────────────
  {
    id: "DSP-1040",
    disputeType: "hotel_driver",
    category: "service",
    priority: "high",
    status: "new",
    title: "Driver rude to hotel guest — guest complained to front desk",
    description: "Radisson Blu Lagos concierge reports driver was verbally aggressive to a VIP guest during pickup. Guest returned to lobby visibly upset and requested a different service.",
    rider: { name: "Mrs. Aisha Balogun", phone: "+234 813 111 2222", rating: 4.95, totalTrips: 12, avatar: "AB", joinDate: "Feb 2026", disputeHistory: 0 },
    driver: { name: "Segun Okafor", phone: "+234 805 333 4444", rating: 4.18, totalTrips: 1562, avatar: "SO", joinDate: "May 2023", disputeHistory: 4 },
    hotel: {
      name: "Radisson Blu Lagos Ikeja",
      phone: "+234 1 271 1000",
      avatar: "RB",
      tier: "gold",
      totalBookings: 847,
      address: "38 Isaac John St, Ikeja GRA, Lagos",
      contactPerson: "Folake Adeyemi (Guest Relations Mgr)",
      disputeHistory: 2,
    },
    guest: {
      name: "Mrs. Aisha Balogun",
      phone: "+234 813 111 2222",
      avatar: "AB",
      roomNumber: "1204",
      checkIn: "Mar 6, 2026",
      checkOut: "Mar 10, 2026",
    },
    fleet: { name: "LagosRide Fleet", id: "FLT-042", vehicleCount: 38 },
    trip: { id: "TRP-88310", pickup: "Radisson Blu, Ikeja GRA", dropoff: "Eko Atlantic", distance: "24.1 km", duration: "55 min", fare: 7200, surgeMultiplier: 1.0, date: "Mar 9, 10:30 AM", vehicleType: "JET Comfort", paymentMethod: "Hotel Account", bookingSource: "hotel_concierge" },
    timeline: [
      { id: "t1", type: "system", timestamp: "10:25 AM", title: "Ride requested via hotel concierge", detail: "Booked by Folake Adeyemi for guest Room 1204" },
      { id: "t2", type: "system", timestamp: "10:28 AM", title: "Driver assigned", detail: "Segun Okafor — Toyota Camry (LagosRide Fleet)" },
      { id: "t3", type: "system", timestamp: "10:30 AM", title: "Driver arrived at hotel", detail: "Pickup at lobby entrance" },
      { id: "t4", type: "hotel", timestamp: "10:33 AM", title: "Incident at pickup", detail: "Concierge observed driver shouting at guest about luggage placement" },
      { id: "t5", type: "rider", timestamp: "10:35 AM", title: "Guest returned to lobby", detail: "Guest refused to continue with assigned driver" },
      { id: "t6", type: "hotel", timestamp: "10:40 AM", title: "Hotel filed dispute", detail: "Guest Relations Manager filed formal complaint. Guest is a returning VIP." },
      { id: "t7", type: "admin", timestamp: "10:55 AM", title: "Escalated — hotel partner dispute", detail: "Gold-tier hotel partner involved. Auto-escalated." },
    ],
    evidence: [
      { id: "e1", type: "system_log", label: "Booking Log", summary: "Hotel concierge booking for VIP guest. Pre-paid on hotel account.", timestamp: "10:25 AM", source: "system" },
      { id: "e2", type: "chat", label: "Concierge Statement", summary: "\"Driver refused to help with luggage and raised his voice when guest asked him to open the boot.\"", timestamp: "10:40 AM", source: "hotel" },
      { id: "e3", type: "system_log", label: "Driver History", summary: "2 previous service complaints from hotel pickups in last 90 days", timestamp: "", source: "system" },
      { id: "e4", type: "rating", label: "Driver Fleet Rating", summary: "Fleet manager flagged for attitude issues — verbal warning issued Feb 2026", timestamp: "", source: "system" },
    ],
    createdAt: "1h ago",
    slaDeadline: "4h",
    slaHoursLeft: 3,
    assignedTo: "Partner Ops",
    tags: ["hotel-partner", "vip-guest", "fleet-driver", "service-complaint", "gold-tier"],
  },
  {
    id: "DSP-1039",
    disputeType: "hotel_driver",
    category: "safety",
    priority: "critical",
    status: "escalated",
    title: "Driver no-show for airport pickup — guest stranded at MMIA",
    description: "Eko Hotels reported their guest was left stranded at Murtala Muhammed International Airport after the assigned driver accepted the trip but never arrived. Guest waited 45 minutes.",
    rider: { name: "Dr. Emeka Obi", phone: "+234 802 555 6666", rating: 4.88, totalTrips: 5, avatar: "EO", joinDate: "Mar 2026", disputeHistory: 0 },
    driver: { name: "Yusuf Abdullahi", phone: "+234 906 777 8888", rating: 3.91, totalTrips: 2340, avatar: "YA", joinDate: "Jan 2023", disputeHistory: 8 },
    hotel: {
      name: "Eko Hotels & Suites",
      phone: "+234 1 262 0000",
      avatar: "EH",
      tier: "gold",
      totalBookings: 1203,
      address: "Plot 1415 Adetokunbo Ademola St, VI, Lagos",
      contactPerson: "Chidi Nnamdi (Transport Desk)",
      disputeHistory: 5,
    },
    guest: {
      name: "Dr. Emeka Obi",
      phone: "+234 802 555 6666",
      avatar: "EO",
      roomNumber: "PH-3",
      checkIn: "Mar 9, 2026",
      checkOut: "Mar 14, 2026",
    },
    trip: { id: "TRP-88298", pickup: "MMIA Terminal 2", dropoff: "Eko Hotels, VI", distance: "31.2 km", duration: "—", fare: 9500, surgeMultiplier: 1.0, date: "Mar 9, 7:15 PM", vehicleType: "JET Premium", paymentMethod: "Hotel Account", bookingSource: "hotel_concierge" },
    timeline: [
      { id: "t1", type: "system", timestamp: "6:45 PM", title: "Pre-booked ride created", detail: "Hotel transport desk booked airport pickup for arriving guest" },
      { id: "t2", type: "system", timestamp: "7:00 PM", title: "Driver accepted", detail: "Yusuf Abdullahi accepted. ETA: 15 min to airport." },
      { id: "t3", type: "system", timestamp: "7:20 PM", title: "Driver not at pickup", detail: "GPS shows driver stationary 8km from airport" },
      { id: "t4", type: "auto", timestamp: "7:30 PM", title: "No-show alert triggered", detail: "15 min past ETA. Driver has not moved." },
      { id: "t5", type: "hotel", timestamp: "7:45 PM", title: "Hotel escalated", detail: "Transport desk called support — guest has been waiting 45 min at arrivals" },
      { id: "t6", type: "system", timestamp: "7:50 PM", title: "Replacement driver dispatched", detail: "New driver assigned — ETA 20 min" },
      { id: "t7", type: "hotel", timestamp: "8:00 PM", title: "Dispute filed", detail: "Critical — VIP guest stranded at airport. Hotel partner relationship at risk." },
      { id: "t8", type: "admin", timestamp: "8:05 PM", title: "Auto-escalated", detail: "Hotel partner + airport no-show = critical escalation" },
    ],
    evidence: [
      { id: "e1", type: "gps_trace", label: "Driver GPS", summary: "Driver stationary at Oshodi for 35 minutes after accepting trip. Never moved toward airport.", timestamp: "7:20 PM", source: "system" },
      { id: "e2", type: "system_log", label: "No-Show Pattern", summary: "3rd no-show in 30 days. Previous: Feb 28 (Lekki), Mar 3 (Ikoyi)", timestamp: "", source: "system" },
      { id: "e3", type: "call_recording", label: "Support Call", summary: "Hotel transport desk called to report guest stranded. Requested immediate resolution.", timestamp: "7:45 PM", source: "hotel" },
      { id: "e4", type: "system_log", label: "Replacement Trip", summary: "Replacement driver arrived at 8:10 PM. Guest waited total 55 minutes.", timestamp: "8:10 PM", source: "system" },
    ],
    createdAt: "30 min ago",
    slaDeadline: "2h",
    slaHoursLeft: 1.5,
    assignedTo: "Senior Ops",
    tags: ["airport-no-show", "hotel-partner", "vip-guest", "repeat-no-show", "critical"],
  },

  // ─── TYPE D: Driver → Hotel Guest ──────────────────────────────────────
  {
    id: "DSP-1038",
    disputeType: "driver_hotel_guest",
    category: "property",
    priority: "high",
    status: "in_review",
    title: "Guest vomited in vehicle — driver requesting cleaning fee",
    description: "Driver reports hotel guest vomited in the back seat during a late-night trip from Eko Hotels to Lekki. Driver requesting ₦25,000 cleaning fee and loss-of-earnings compensation.",
    rider: { name: "Mr. James Okonkwo", phone: "+234 811 999 0000", rating: 4.2, totalTrips: 3, avatar: "JO", joinDate: "Mar 2026", disputeHistory: 0 },
    driver: { name: "Blessing Ojo", phone: "+234 803 222 3333", rating: 4.72, totalTrips: 1890, avatar: "BO", joinDate: "Aug 2023", disputeHistory: 1 },
    hotel: {
      name: "Eko Hotels & Suites",
      phone: "+234 1 262 0000",
      avatar: "EH",
      tier: "gold",
      totalBookings: 1203,
      address: "Plot 1415 Adetokunbo Ademola St, VI, Lagos",
      contactPerson: "Chidi Nnamdi (Transport Desk)",
      disputeHistory: 5,
    },
    guest: {
      name: "Mr. James Okonkwo",
      phone: "+234 811 999 0000",
      avatar: "JO",
      roomNumber: "812",
      checkIn: "Mar 7, 2026",
      checkOut: "Mar 11, 2026",
    },
    trip: { id: "TRP-88305", pickup: "Eko Hotels, VI", dropoff: "Lekki Phase 1", distance: "8.9 km", duration: "25 min", fare: 4200, surgeMultiplier: 1.3, date: "Mar 8, 11:45 PM", vehicleType: "JET Comfort", paymentMethod: "Hotel Account", bookingSource: "hotel_concierge" },
    timeline: [
      { id: "t1", type: "system", timestamp: "11:40 PM", title: "Ride booked via hotel", detail: "Late-night trip from hotel bar area" },
      { id: "t2", type: "system", timestamp: "11:45 PM", title: "Ride started", detail: "Pickup at hotel lobby" },
      { id: "t3", type: "driver", timestamp: "11:58 PM", title: "Incident reported", detail: "Guest was sick in vehicle. Driver pulled over immediately." },
      { id: "t4", type: "system", timestamp: "12:02 AM", title: "Trip ended early", detail: "Driver ended trip at Admiralty Way — 3km short of destination" },
      { id: "t5", type: "driver", timestamp: "12:15 AM", title: "Dispute filed + photos", detail: "Driver submitted 4 photos of soiled interior. Requesting ₦25,000 cleaning + ₦15,000 lost earnings." },
      { id: "t6", type: "hotel", timestamp: "Mar 9 9:00 AM", title: "Hotel notified", detail: "Transport desk acknowledged. Guest is checking out Mar 11." },
      { id: "t7", type: "admin", timestamp: "Mar 9 9:30 AM", title: "Assigned for review", detail: "Property damage claims require photo verification" },
    ],
    evidence: [
      { id: "e1", type: "photo", label: "Interior Photos (4)", summary: "Visible soiling on rear seat and floor mat. Back of front passenger seat also affected.", timestamp: "12:15 AM", source: "driver" },
      { id: "e2", type: "system_log", label: "Vehicle Status", summary: "Vehicle marked offline by driver. Currently unavailable for rides.", timestamp: "12:20 AM", source: "system" },
      { id: "e3", type: "fare_calc", label: "Cleaning Fee Estimate", summary: "JET standard cleaning fee: ₦15,000-₦25,000 depending on severity. Photos suggest high severity.", timestamp: "", source: "system" },
      { id: "e4", type: "system_log", label: "Lost Earnings Estimate", summary: "Driver averages ₦18,000/night on Fri-Sat. Vehicle offline ~14 hours for cleaning.", timestamp: "", source: "system" },
    ],
    createdAt: "3h ago",
    slaDeadline: "12h",
    slaHoursLeft: 9,
    assignedTo: "Finance Ops",
    tags: ["property-damage", "cleaning-fee", "hotel-guest", "driver-filed", "compensation"],
  },
  {
    id: "DSP-1037",
    disputeType: "driver_hotel_guest",
    category: "no_show",
    priority: "medium",
    status: "new",
    title: "Hotel guest no-show — driver waited 20 min at Transcorp Hilton",
    description: "Driver arrived at Transcorp Hilton Abuja for a pre-booked pickup. Guest never appeared. Driver requesting cancellation fee and wait-time compensation.",
    rider: { name: "Ms. Halima Yusuf", phone: "+234 809 444 5555", rating: 0, totalTrips: 1, avatar: "HY", joinDate: "Mar 2026", disputeHistory: 0 },
    driver: { name: "Adamu Garba", phone: "+234 902 666 7777", rating: 4.65, totalTrips: 2100, avatar: "AG", joinDate: "Apr 2023", disputeHistory: 2 },
    hotel: {
      name: "Transcorp Hilton Abuja",
      phone: "+234 9 461 2000",
      avatar: "TH",
      tier: "gold",
      totalBookings: 956,
      address: "1 Aguiyi Ironsi St, Maitama, Abuja",
      contactPerson: "Amina Bello (Concierge Supervisor)",
      disputeHistory: 3,
    },
    guest: {
      name: "Ms. Halima Yusuf",
      phone: "+234 809 444 5555",
      avatar: "HY",
      roomNumber: "605",
      checkIn: "Mar 8, 2026",
      checkOut: "Mar 10, 2026",
    },
    trip: { id: "TRP-88315", pickup: "Transcorp Hilton, Maitama", dropoff: "National Assembly Complex", distance: "6.8 km", duration: "—", fare: 3800, surgeMultiplier: 1.0, date: "Mar 9, 8:00 AM", vehicleType: "JET Go", paymentMethod: "Hotel Account", bookingSource: "hotel_concierge" },
    timeline: [
      { id: "t1", type: "system", timestamp: "7:45 AM", title: "Pre-booked ride activated", detail: "Hotel concierge booking for 8:00 AM pickup" },
      { id: "t2", type: "system", timestamp: "7:55 AM", title: "Driver arrived", detail: "Driver at hotel lobby entrance. Notified concierge." },
      { id: "t3", type: "system", timestamp: "8:00 AM", title: "Pickup time reached", detail: "Guest not at lobby" },
      { id: "t4", type: "hotel", timestamp: "8:05 AM", title: "Concierge called guest room", detail: "No answer from Room 605" },
      { id: "t5", type: "driver", timestamp: "8:15 AM", title: "Driver waited 20 min", detail: "\"I have been waiting since 7:55. No one has come down.\"" },
      { id: "t6", type: "system", timestamp: "8:20 AM", title: "Trip cancelled — no-show", detail: "System auto-cancelled after 20 min wait" },
      { id: "t7", type: "driver", timestamp: "8:25 AM", title: "Dispute filed", detail: "Driver requesting ₦2,500 wait-time fee + cancellation compensation" },
    ],
    evidence: [
      { id: "e1", type: "gps_trace", label: "Driver GPS", summary: "Driver stationary at Transcorp Hilton for 25 minutes (7:55 AM - 8:20 AM)", timestamp: "8:20 AM", source: "system" },
      { id: "e2", type: "system_log", label: "Wait Timer", summary: "Arrival confirmed at 7:55 AM. Standard no-show threshold: 10 min. Driver waited 25 min.", timestamp: "8:20 AM", source: "system" },
      { id: "e3", type: "system_log", label: "Cancellation Policy", summary: "Hotel concierge bookings: ₦1,500 cancellation fee standard. Driver requesting ₦2,500 for extended wait.", timestamp: "", source: "system" },
    ],
    createdAt: "4h ago",
    slaDeadline: "24h",
    slaHoursLeft: 20,
    tags: ["guest-no-show", "hotel-booking", "wait-time", "abuja", "cancellation-fee"],
  },
];

// ─── Aggregate stats ──────────────────────────────────────────────────────
export const DISPUTE_STATS = {
  total: DISPUTES.length,
  bySeverity: {
    critical: DISPUTES.filter(d => d.priority === "critical").length,
    high: DISPUTES.filter(d => d.priority === "high").length,
    medium: DISPUTES.filter(d => d.priority === "medium").length,
    low: DISPUTES.filter(d => d.priority === "low").length,
  },
  byCategory: {
    fare: DISPUTES.filter(d => d.category === "fare").length,
    route: DISPUTES.filter(d => d.category === "route").length,
    safety: DISPUTES.filter(d => d.category === "safety").length,
    payment: DISPUTES.filter(d => d.category === "payment").length,
    service: DISPUTES.filter(d => d.category === "service").length,
    property: DISPUTES.filter(d => d.category === "property").length,
    no_show: DISPUTES.filter(d => d.category === "no_show").length,
  },
  byType: {
    rider_driver: DISPUTES.filter(d => d.disputeType === "rider_driver").length,
    hotel_driver: DISPUTES.filter(d => d.disputeType === "hotel_driver").length,
    driver_hotel_guest: DISPUTES.filter(d => d.disputeType === "driver_hotel_guest").length,
  },
  byStatus: {
    new: DISPUTES.filter(d => d.status === "new").length,
    in_review: DISPUTES.filter(d => d.status === "in_review").length,
    awaiting_evidence: DISPUTES.filter(d => d.status === "awaiting_evidence").length,
    escalated: DISPUTES.filter(d => d.status === "escalated").length,
  },
  avgResolutionTime: 4.2,
  slaCompliance: 91.3,
  resolvedToday: 8,
  resolutionSplit: { riderFavored: 52, driverFavored: 31, split: 17 },
};

export const formatNaira = (n: number) => `₦${n.toLocaleString()}`;
