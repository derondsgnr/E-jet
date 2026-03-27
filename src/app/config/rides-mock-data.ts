/**
 * JET ADMIN — RIDES MOCK DATA
 *
 * Realistic Lagos ride-hailing trip data.
 * All fares in Naira, all addresses real Lagos locations,
 * all names Nigerian, all zones from the CC zone system.
 *
 * Data sources (traceable):
 *   - Trip records: created when rider requests → driver accepts
 *   - Fare: calculated by pricing engine (base + distance×rate + surge)
 *   - Ratings: submitted by rider/driver post-trip
 *   - Source: rider_app (organic), hotel_concierge (hotel portal), scheduled (pre-booked)
 */

export type TripStatus = "matching" | "driver_assigned" | "en_route_pickup" | "in_progress" | "completed" | "cancelled";
export type BookingSource = "rider_app" | "hotel_concierge" | "scheduled";
export type PaymentMethod = "card" | "cash" | "wallet" | "hotel_invoice";
export type PaymentStatus = "paid" | "pending" | "failed" | "refunded";

export interface TripRecord {
  id: string;
  status: TripStatus;
  source: BookingSource;
  rider: {
    name: string;
    phone: string;
    rating: number;
    totalTrips: number;
  };
  driver: {
    name: string;
    phone: string;
    rating: number;
    vehicle: string;
    plate: string;
    isEV: boolean;
  } | null; // null when still matching
  pickup: {
    address: string;
    zone: string;
  };
  dropoff: {
    address: string;
    zone: string;
  };
  fare: {
    base: number;
    distance: number;
    surge: number;
    total: number;
    commission: number;
  };
  timing: {
    requested: string; // ISO timestamp
    matched: string | null;
    pickedUp: string | null;
    droppedOff: string | null;
    duration: number | null; // minutes
    waitTime: number | null; // seconds to match
  };
  distance: number; // km
  riderRating: number | null; // what rider gave driver
  driverRating: number | null; // what driver gave rider
  payment: {
    method: PaymentMethod;
    status: PaymentStatus;
  };
  zone: string;
  state: string;
  flags: string[];
  hotelName?: string; // for hotel_concierge bookings
  cancellationReason?: string;
}

/* ═══════════════════════════════════════════════════════════════════════════
   STATUS METADATA
   ═══════════════════════════════════════════════════════════════════════════ */

export const TRIP_STATUS_META: Record<TripStatus, { label: string; color: string; dotPulse: boolean }> = {
  matching: { label: "Matching", color: "#F59E0B", dotPulse: true },
  driver_assigned: { label: "Assigned", color: "#3B82F6", dotPulse: true },
  en_route_pickup: { label: "En route", color: "#8B5CF6", dotPulse: true },
  in_progress: { label: "In ride", color: "#1DB954", dotPulse: true },
  completed: { label: "Completed", color: "#1DB954", dotPulse: false },
  cancelled: { label: "Cancelled", color: "#D4183D", dotPulse: false },
};

export const SOURCE_META: Record<BookingSource, { label: string; color: string; icon: string }> = {
  rider_app: { label: "Rider app", color: "#8B5CF6", icon: "R" },
  hotel_concierge: { label: "Hotel", color: "#3B82F6", icon: "H" },
  scheduled: { label: "Scheduled", color: "#F59E0B", icon: "S" },
};

export const FLAG_META: Record<string, { label: string; color: string }> = {
  long_wait: { label: "Long wait", color: "#F59E0B" },
  route_deviation: { label: "Route deviation", color: "#D4183D" },
  surge_applied: { label: "Surge", color: "#F97316" },
  high_fare: { label: "High fare", color: "#8B5CF6" },
  ev_ride: { label: "EV", color: "#1DB954" },
  first_ride: { label: "First ride", color: "#3B82F6" },
  hotel_vip: { label: "VIP guest", color: "#F59E0B" },
  cancelled_by_rider: { label: "Rider cancelled", color: "#D4183D" },
  cancelled_by_driver: { label: "Driver cancelled", color: "#D4183D" },
  payment_failed: { label: "Payment failed", color: "#D4183D" },
};

/* ═══════════════════════════════════════════════════════════════════════════
   TRIP RECORDS — 20 realistic Lagos trips
   ═══════════════════════════════════════════════════════════════════════════ */

const now = new Date("2026-03-11T14:32:00+01:00"); // Lagos time (WAT)
const mins = (m: number) => new Date(now.getTime() - m * 60000).toISOString();

export const TRIPS: TripRecord[] = [
  // ── LIVE rides (4) ──
  {
    id: "JET-3041",
    status: "in_progress",
    source: "rider_app",
    rider: { name: "Chioma Eze", phone: "+2348012345678", rating: 4.9, totalTrips: 187 },
    driver: { name: "Emeka Nwosu", phone: "+2348098765432", rating: 4.8, vehicle: "Toyota Camry 2023", plate: "LND-284EP", isEV: false },
    pickup: { address: "The Palms Shopping Centre, Lekki", zone: "Lekki" },
    dropoff: { address: "Eko Atlantic, Victoria Island", zone: "Island" },
    fare: { base: 400, distance: 1800, surge: 0, total: 2200, commission: 440 },
    timing: { requested: mins(18), matched: mins(17), pickedUp: mins(12), droppedOff: null, duration: null, waitTime: 38 },
    distance: 8.4, riderRating: null, driverRating: null,
    payment: { method: "card", status: "pending" },
    zone: "Lekki", state: "Lagos", flags: [],
  },
  {
    id: "JET-3042",
    status: "en_route_pickup",
    source: "hotel_concierge",
    rider: { name: "James Whitfield", phone: "+447911234567", rating: 5.0, totalTrips: 2 },
    driver: { name: "Adebayo Kehinde", phone: "+2348034567890", rating: 4.9, vehicle: "Hyundai Ioniq 5", plate: "APP-001EV", isEV: true },
    pickup: { address: "Eko Hotels & Suites, Victoria Island", zone: "Island" },
    dropoff: { address: "Murtala Muhammed Airport, Ikeja", zone: "Ikeja" },
    fare: { base: 500, distance: 4200, surge: 600, total: 5300, commission: 1060 },
    timing: { requested: mins(6), matched: mins(5), pickedUp: null, droppedOff: null, duration: null, waitTime: 42 },
    distance: 22.1, riderRating: null, driverRating: null,
    payment: { method: "hotel_invoice", status: "pending" },
    zone: "Island", state: "Lagos", flags: ["ev_ride", "hotel_vip", "surge_applied"],
    hotelName: "Eko Hotels & Suites",
  },
  {
    id: "JET-3043",
    status: "matching",
    source: "rider_app",
    rider: { name: "Funke Adeyemi", phone: "+2348056789012", rating: 4.7, totalTrips: 43 },
    driver: null,
    pickup: { address: "Computer Village, Ikeja", zone: "Ikeja" },
    dropoff: { address: "Surulere National Stadium", zone: "Mainland" },
    fare: { base: 400, distance: 1400, surge: 0, total: 1800, commission: 360 },
    timing: { requested: mins(2), matched: null, pickedUp: null, droppedOff: null, duration: null, waitTime: null },
    distance: 7.2, riderRating: null, driverRating: null,
    payment: { method: "wallet", status: "pending" },
    zone: "Ikeja", state: "Lagos", flags: ["long_wait"],
  },
  {
    id: "JET-3044",
    status: "driver_assigned",
    source: "scheduled",
    rider: { name: "Oluwaseun Bakare", phone: "+2348023456789", rating: 4.8, totalTrips: 92 },
    driver: { name: "Ibrahim Musa", phone: "+2348045678901", rating: 4.7, vehicle: "Toyota Corolla 2022", plate: "KJA-892FB", isEV: false },
    pickup: { address: "Maryland Mall, Ikeja", zone: "Ikeja" },
    dropoff: { address: "Landmark Beach, Victoria Island", zone: "Island" },
    fare: { base: 400, distance: 2600, surge: 0, total: 3000, commission: 600 },
    timing: { requested: mins(8), matched: mins(7), pickedUp: null, droppedOff: null, duration: null, waitTime: 52 },
    distance: 14.3, riderRating: null, driverRating: null,
    payment: { method: "card", status: "pending" },
    zone: "Ikeja", state: "Lagos", flags: [],
  },

  // ── COMPLETED rides (12) ──
  {
    id: "JET-3035",
    status: "completed",
    source: "rider_app",
    rider: { name: "Aisha Mohammed", phone: "+2348067890123", rating: 4.9, totalTrips: 214 },
    driver: { name: "Chukwuma Obi", phone: "+2348078901234", rating: 4.9, vehicle: "BYD Atto 3", plate: "APP-014EV", isEV: true },
    pickup: { address: "Shoprite, Lekki", zone: "Lekki" },
    dropoff: { address: "Banana Island, Ikoyi", zone: "Island" },
    fare: { base: 400, distance: 2200, surge: 0, total: 2600, commission: 520 },
    timing: { requested: mins(52), matched: mins(51), pickedUp: mins(47), droppedOff: mins(28), duration: 19, waitTime: 34 },
    distance: 11.8, riderRating: 5, driverRating: 5,
    payment: { method: "card", status: "paid" },
    zone: "Lekki", state: "Lagos", flags: ["ev_ride"],
  },
  {
    id: "JET-3034",
    status: "completed",
    source: "hotel_concierge",
    rider: { name: "Sarah Chen", phone: "+8613912345678", rating: 5.0, totalTrips: 1 },
    driver: { name: "Tunde Afolabi", phone: "+2348089012345", rating: 4.8, vehicle: "Toyota Camry 2024", plate: "LND-441EP", isEV: false },
    pickup: { address: "InterContinental Lagos", zone: "Island" },
    dropoff: { address: "Nike Art Gallery, Lekki", zone: "Lekki" },
    fare: { base: 500, distance: 1800, surge: 0, total: 2300, commission: 460 },
    timing: { requested: mins(95), matched: mins(94), pickedUp: mins(89), droppedOff: mins(62), duration: 27, waitTime: 28 },
    distance: 9.6, riderRating: 5, driverRating: 5,
    payment: { method: "hotel_invoice", status: "paid" },
    zone: "Island", state: "Lagos", flags: ["hotel_vip", "first_ride"],
    hotelName: "InterContinental Lagos",
  },
  {
    id: "JET-3033",
    status: "completed",
    source: "rider_app",
    rider: { name: "Ngozi Okafor", phone: "+2348090123456", rating: 4.6, totalTrips: 31 },
    driver: { name: "Yusuf Bello", phone: "+2348001234567", rating: 4.5, vehicle: "Kia Rio 2021", plate: "KSF-182GE", isEV: false },
    pickup: { address: "Ojodu Berger Bus Stop", zone: "Ikeja" },
    dropoff: { address: "Alausa Secretariat, Ikeja", zone: "Ikeja" },
    fare: { base: 400, distance: 800, surge: 300, total: 1500, commission: 300 },
    timing: { requested: mins(110), matched: mins(108), pickedUp: mins(101), droppedOff: mins(88), duration: 13, waitTime: 95 },
    distance: 4.1, riderRating: 4, driverRating: 5,
    payment: { method: "cash", status: "paid" },
    zone: "Ikeja", state: "Lagos", flags: ["surge_applied", "long_wait"],
  },
  {
    id: "JET-3032",
    status: "completed",
    source: "rider_app",
    rider: { name: "Damilola Ogunbiyi", phone: "+2348012456789", rating: 4.8, totalTrips: 156 },
    driver: { name: "Femi Adeleke", phone: "+2348023567890", rating: 4.7, vehicle: "Honda Accord 2023", plate: "LND-329EP", isEV: false },
    pickup: { address: "Lekki Phase 1 Gate", zone: "Lekki" },
    dropoff: { address: "CMS, Lagos Island", zone: "Island" },
    fare: { base: 400, distance: 3400, surge: 0, total: 3800, commission: 760 },
    timing: { requested: mins(145), matched: mins(143), pickedUp: mins(138), droppedOff: mins(98), duration: 40, waitTime: 44 },
    distance: 18.2, riderRating: 5, driverRating: 4,
    payment: { method: "wallet", status: "paid" },
    zone: "Lekki", state: "Lagos", flags: ["high_fare"],
  },
  {
    id: "JET-3031",
    status: "completed",
    source: "rider_app",
    rider: { name: "Kemi Fashola", phone: "+2348034678901", rating: 4.9, totalTrips: 89 },
    driver: { name: "Adebayo Kehinde", phone: "+2348034567890", rating: 4.9, vehicle: "Hyundai Ioniq 5", plate: "APP-001EV", isEV: true },
    pickup: { address: "Falomo Roundabout, Ikoyi", zone: "Island" },
    dropoff: { address: "Four Points by Sheraton, Lekki", zone: "Lekki" },
    fare: { base: 400, distance: 1600, surge: 0, total: 2000, commission: 400 },
    timing: { requested: mins(180), matched: mins(179), pickedUp: mins(175), droppedOff: mins(155), duration: 20, waitTime: 22 },
    distance: 8.8, riderRating: 5, driverRating: 5,
    payment: { method: "card", status: "paid" },
    zone: "Island", state: "Lagos", flags: ["ev_ride"],
  },
  {
    id: "JET-3030",
    status: "completed",
    source: "scheduled",
    rider: { name: "Tobi Adeniyi", phone: "+2348045789012", rating: 4.7, totalTrips: 67 },
    driver: { name: "Hassan Abdullahi", phone: "+2348056890123", rating: 4.6, vehicle: "Toyota Corolla 2022", plate: "AAA-547FV", isEV: false },
    pickup: { address: "Murtala Muhammed Airport", zone: "Ikeja" },
    dropoff: { address: "The George Hotel, Ikoyi", zone: "Island" },
    fare: { base: 500, distance: 4800, surge: 0, total: 5300, commission: 1060 },
    timing: { requested: mins(240), matched: mins(238), pickedUp: mins(232), droppedOff: mins(188), duration: 44, waitTime: 36 },
    distance: 24.5, riderRating: 4, driverRating: 5,
    payment: { method: "card", status: "paid" },
    zone: "Ikeja", state: "Lagos", flags: ["high_fare"],
  },
  {
    id: "JET-3029",
    status: "completed",
    source: "rider_app",
    rider: { name: "Adeola Williams", phone: "+2348067901234", rating: 4.5, totalTrips: 22 },
    driver: { name: "Olamide Johnson", phone: "+2348078012345", rating: 4.4, vehicle: "Kia Cerato 2022", plate: "KRD-671GW", isEV: false },
    pickup: { address: "Yaba Tech Main Gate", zone: "Mainland" },
    dropoff: { address: "National Theatre, Surulere", zone: "Mainland" },
    fare: { base: 400, distance: 600, surge: 0, total: 1000, commission: 200 },
    timing: { requested: mins(290), matched: mins(288), pickedUp: mins(282), droppedOff: mins(270), duration: 12, waitTime: 48 },
    distance: 3.2, riderRating: 4, driverRating: 4,
    payment: { method: "cash", status: "paid" },
    zone: "Mainland", state: "Lagos", flags: [],
  },
  {
    id: "JET-3028",
    status: "completed",
    source: "hotel_concierge",
    rider: { name: "Michael Torres", phone: "+14155551234", rating: 5.0, totalTrips: 3 },
    driver: { name: "Chidi Nnaji", phone: "+2348089123456", rating: 4.8, vehicle: "BYD Seal", plate: "APP-008EV", isEV: true },
    pickup: { address: "Radisson Blu Anchorage, V.I.", zone: "Island" },
    dropoff: { address: "Lekki Conservation Centre", zone: "Lekki" },
    fare: { base: 500, distance: 2400, surge: 0, total: 2900, commission: 580 },
    timing: { requested: mins(320), matched: mins(319), pickedUp: mins(314), droppedOff: mins(284), duration: 30, waitTime: 18 },
    distance: 12.6, riderRating: 5, driverRating: 5,
    payment: { method: "hotel_invoice", status: "paid" },
    zone: "Island", state: "Lagos", flags: ["ev_ride", "hotel_vip"],
    hotelName: "Radisson Blu Anchorage",
  },
  {
    id: "JET-3027",
    status: "completed",
    source: "rider_app",
    rider: { name: "Bolaji Martins", phone: "+2348090234567", rating: 4.8, totalTrips: 134 },
    driver: { name: "Segun Ajayi", phone: "+2348001345678", rating: 4.7, vehicle: "Toyota Camry 2023", plate: "LND-519EP", isEV: false },
    pickup: { address: "Allen Avenue, Ikeja", zone: "Ikeja" },
    dropoff: { address: "Ikeja City Mall", zone: "Ikeja" },
    fare: { base: 400, distance: 400, surge: 0, total: 800, commission: 160 },
    timing: { requested: mins(360), matched: mins(359), pickedUp: mins(355), droppedOff: mins(347), duration: 8, waitTime: 26 },
    distance: 2.1, riderRating: 5, driverRating: 5,
    payment: { method: "wallet", status: "paid" },
    zone: "Ikeja", state: "Lagos", flags: [],
  },
  {
    id: "JET-3026",
    status: "completed",
    source: "rider_app",
    rider: { name: "Amara Obi", phone: "+2348012567890", rating: 4.9, totalTrips: 201 },
    driver: { name: "Emeka Nwosu", phone: "+2348098765432", rating: 4.8, vehicle: "Toyota Camry 2023", plate: "LND-284EP", isEV: false },
    pickup: { address: "Admiralty Way, Lekki Phase 1", zone: "Lekki" },
    dropoff: { address: "Circle Mall, Lekki", zone: "Lekki" },
    fare: { base: 400, distance: 600, surge: 0, total: 1000, commission: 200 },
    timing: { requested: mins(400), matched: mins(399), pickedUp: mins(395), droppedOff: mins(385), duration: 10, waitTime: 20 },
    distance: 3.0, riderRating: 5, driverRating: 5,
    payment: { method: "card", status: "paid" },
    zone: "Lekki", state: "Lagos", flags: [],
  },

  // ── CANCELLED rides (4) ──
  {
    id: "JET-3040",
    status: "cancelled",
    source: "rider_app",
    rider: { name: "Osagie Omoruyi", phone: "+2348023678901", rating: 4.3, totalTrips: 15 },
    driver: { name: "Tunde Afolabi", phone: "+2348089012345", rating: 4.8, vehicle: "Toyota Camry 2024", plate: "LND-441EP", isEV: false },
    pickup: { address: "Ajah Roundabout", zone: "Lekki" },
    dropoff: { address: "Abraham Adesanya, Lekki", zone: "Lekki" },
    fare: { base: 400, distance: 800, surge: 0, total: 0, commission: 0 },
    timing: { requested: mins(25), matched: mins(23), pickedUp: null, droppedOff: null, duration: null, waitTime: 68 },
    distance: 4.2, riderRating: null, driverRating: null,
    payment: { method: "card", status: "refunded" },
    zone: "Lekki", state: "Lagos", flags: ["cancelled_by_rider", "long_wait"],
    cancellationReason: "Driver taking too long",
  },
  {
    id: "JET-3038",
    status: "cancelled",
    source: "rider_app",
    rider: { name: "Blessing Okoro", phone: "+2348034789012", rating: 4.6, totalTrips: 28 },
    driver: null,
    pickup: { address: "Third Mainland Bridge (Mainland end)", zone: "Mainland" },
    dropoff: { address: "Awolowo Road, Ikoyi", zone: "Island" },
    fare: { base: 400, distance: 0, surge: 0, total: 0, commission: 0 },
    timing: { requested: mins(45), matched: null, pickedUp: null, droppedOff: null, duration: null, waitTime: null },
    distance: 0, riderRating: null, driverRating: null,
    payment: { method: "wallet", status: "refunded" },
    zone: "Mainland", state: "Lagos", flags: ["cancelled_by_rider"],
    cancellationReason: "No drivers available",
  },
  {
    id: "JET-3036",
    status: "cancelled",
    source: "hotel_concierge",
    rider: { name: "Peter Schmidt", phone: "+491711234567", rating: 5.0, totalTrips: 1 },
    driver: { name: "Yusuf Bello", phone: "+2348001234567", rating: 4.5, vehicle: "Kia Rio 2021", plate: "KSF-182GE", isEV: false },
    pickup: { address: "Lagos Continental Hotel", zone: "Island" },
    dropoff: { address: "Lekki Free Trade Zone", zone: "Lekki" },
    fare: { base: 500, distance: 0, surge: 0, total: 0, commission: 0 },
    timing: { requested: mins(70), matched: mins(68), pickedUp: null, droppedOff: null, duration: null, waitTime: 52 },
    distance: 0, riderRating: null, driverRating: null,
    payment: { method: "hotel_invoice", status: "refunded" },
    zone: "Island", state: "Lagos", flags: ["cancelled_by_driver", "hotel_vip"],
    cancellationReason: "Driver cancelled — vehicle issue",
    hotelName: "Lagos Continental Hotel",
  },
  {
    id: "JET-3039",
    status: "cancelled",
    source: "rider_app",
    rider: { name: "Yemi Alade", phone: "+2348045890123", rating: 4.1, totalTrips: 8 },
    driver: null,
    pickup: { address: "Oshodi Bus Terminal", zone: "Mainland" },
    dropoff: { address: "Mushin Market", zone: "Mainland" },
    fare: { base: 400, distance: 0, surge: 0, total: 0, commission: 0 },
    timing: { requested: mins(55), matched: null, pickedUp: null, droppedOff: null, duration: null, waitTime: null },
    distance: 0, riderRating: null, driverRating: null,
    payment: { method: "cash", status: "refunded" },
    zone: "Mainland", state: "Lagos", flags: ["cancelled_by_rider"],
    cancellationReason: "Changed plans",
  },
];

/* ═══════════════════════════════════════════════════════════════════════════
   DERIVED METRICS — Computed from TRIPS array
   ═══════════════════════════════════════════════════════════════════════════ */

const liveStatuses: TripStatus[] = ["matching", "driver_assigned", "en_route_pickup", "in_progress"];
export const LIVE_TRIPS = TRIPS.filter(t => liveStatuses.includes(t.status));
export const COMPLETED_TRIPS = TRIPS.filter(t => t.status === "completed");
export const CANCELLED_TRIPS = TRIPS.filter(t => t.status === "cancelled");

export const RIDES_KPI = {
  liveCount: LIVE_TRIPS.length,
  completedToday: COMPLETED_TRIPS.length,
  cancelledToday: CANCELLED_TRIPS.length,
  totalToday: TRIPS.length,
  cancellationRate: Math.round((CANCELLED_TRIPS.length / TRIPS.length) * 100),
  avgWaitTime: Math.round(
    COMPLETED_TRIPS
      .filter(t => t.timing.waitTime !== null)
      .reduce((sum, t) => sum + (t.timing.waitTime || 0), 0) /
    COMPLETED_TRIPS.filter(t => t.timing.waitTime !== null).length
  ),
  avgDuration: Math.round(
    COMPLETED_TRIPS
      .filter(t => t.timing.duration !== null)
      .reduce((sum, t) => sum + (t.timing.duration || 0), 0) /
    COMPLETED_TRIPS.filter(t => t.timing.duration !== null).length
  ),
  revenueToday: COMPLETED_TRIPS.reduce((sum, t) => sum + t.fare.total, 0),
  commissionToday: COMPLETED_TRIPS.reduce((sum, t) => sum + t.fare.commission, 0),
  avgFare: Math.round(COMPLETED_TRIPS.reduce((sum, t) => sum + t.fare.total, 0) / COMPLETED_TRIPS.length),
  evRides: COMPLETED_TRIPS.filter(t => t.driver?.isEV).length,
  hotelRides: TRIPS.filter(t => t.source === "hotel_concierge").length,
  avgRating: +(COMPLETED_TRIPS.filter(t => t.riderRating).reduce((s, t) => s + (t.riderRating || 0), 0) / COMPLETED_TRIPS.filter(t => t.riderRating).length).toFixed(1),
};

export { formatNaira } from "./admin-mock-data";

/** Time ago helper */
export function timeAgo(iso: string): string {
  const diff = now.getTime() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}
