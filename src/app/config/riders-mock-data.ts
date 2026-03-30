/**
 * JET ADMIN — RIDER MOCK DATA
 *
 * Rich simulated data for the rider management surface.
 * Reflects real-world Nigerian rider demographics and usage patterns.
 */

import { STATUS } from "./admin-theme";

export type RiderStatus = "active" | "suspended" | "flagged" | "new" | "churned";
export type PaymentType = "card" | "wallet" | "cash" | "corporate";

export interface RiderTrip {
  id: string;
  route: string;
  fare: number;
  status: "completed" | "cancelled" | "disputed";
  date: string;
  driverName: string;
  rating: number | null;
  source: "rider" | "hotel";
}

export interface RiderDispute {
  id: string;
  category: string;
  status: "open" | "resolved";
  amount: number;
  date: string;
}

export interface RiderPayment {
  type: PaymentType;
  label: string;
  last4?: string;
  balance?: number;
  isDefault: boolean;
}

export interface Rider {
  id: string;
  name: string;
  phone: string;
  email: string;
  status: RiderStatus;
  city: string;
  zone: string;
  joinDate: string;
  lastActive: string;
  rating: number;
  totalTrips: number;
  totalSpend: number;
  cancelRate: number;
  disputeCount: number;
  payments: RiderPayment[];
  recentTrips: RiderTrip[];
  disputes: RiderDispute[];
  notes: string[];
  tags: string[];
}

export const RIDER_STATUS_META: Record<RiderStatus, { label: string; color: string; dotPulse: boolean }> = {
  active: { label: "Active", color: "#1DB954", dotPulse: false },
  suspended: { label: "Suspended", color: "#D4183D", dotPulse: false },
  flagged: { label: "Flagged", color: "#F59E0B", dotPulse: true },
  new: { label: "New", color: "#3B82F6", dotPulse: false },
  churned: { label: "Churned", color: STATUS.neutral, dotPulse: false },
};

export const RIDER_KPI = {
  total: 24_819,
  active30d: 18_432,
  newThisWeek: 347,
  avgRating: 4.6,
  churnRate: 8.2,
  avgTripsPerWeek: 3.4,
  // Data sources
  sources: {
    total: "users.type=rider.count",
    active30d: "users.type=rider.last_trip < 30d",
    newThisWeek: "users.type=rider.created_at > 7d",
    avgRating: "rides.completed.avg(rider_rating_by_driver)",
    churnRate: "users.type=rider.no_trip_60d / total",
    avgTripsPerWeek: "rides.completed.count(7d) / users.active_7d",
  },
};

const mkTrips = (routes: [string, number, string][]): RiderTrip[] =>
  routes.map(([route, fare, date], i) => ({
    id: `TR-${String(1000 + i)}`,
    route,
    fare,
    status: "completed",
    date,
    driverName: ["Chidi E.", "Amara N.", "Tolu B.", "Efe O.", "Kunle A."][i % 5],
    rating: [5, 4, 5, 4, 5][i % 5],
    source: "rider",
  }));

export const RIDERS: Rider[] = [
  {
    id: "RDR-0001", name: "Adebayo Ogunlesi", phone: "+234 801 234 5678", email: "adebayo@email.com",
    status: "active", city: "Lagos", zone: "Victoria Island",
    joinDate: "2025-08-15", lastActive: "2h ago", rating: 4.8,
    totalTrips: 142, totalSpend: 487600, cancelRate: 3.2, disputeCount: 1,
    payments: [
      { type: "card", label: "Mastercard", last4: "4521", isDefault: true },
      { type: "wallet", label: "JET Wallet", balance: 12400, isDefault: false },
    ],
    recentTrips: mkTrips([
      ["Lekki Phase 1 → Victoria Island", 3200, "2h ago"],
      ["Ikeja → Surulere", 4800, "Yesterday"],
      ["Ikoyi → Lekki", 2100, "2 days ago"],
      ["VI → Ajah", 5600, "3 days ago"],
      ["Surulere → Ikeja GRA", 3400, "4 days ago"],
    ]),
    disputes: [{ id: "D-2801", category: "fare", status: "resolved", amount: 800, date: "2 weeks ago" }],
    notes: [],
    tags: ["loyal", "high-value"],
  },
  {
    id: "RDR-0002", name: "Ngozi Ekechi", phone: "+234 802 345 6789", email: "ngozi@email.com",
    status: "active", city: "Lagos", zone: "Lekki",
    joinDate: "2025-09-22", lastActive: "45m ago", rating: 4.9,
    totalTrips: 89, totalSpend: 312400, cancelRate: 1.1, disputeCount: 0,
    payments: [
      { type: "card", label: "Visa", last4: "8892", isDefault: true },
      { type: "wallet", label: "JET Wallet", balance: 5200, isDefault: false },
    ],
    recentTrips: mkTrips([
      ["Lekki → Ikoyi", 2800, "45m ago"],
      ["Victoria Island → Lekki Phase 1", 3100, "Yesterday"],
      ["Ajah → Lekki", 2400, "2 days ago"],
    ]),
    disputes: [],
    notes: [],
    tags: ["low-cancel"],
  },
  {
    id: "RDR-0003", name: "Ibrahim Musa", phone: "+234 803 456 7890", email: "ibrahim@email.com",
    status: "flagged", city: "Abuja", zone: "Wuse",
    joinDate: "2026-01-10", lastActive: "3d ago", rating: 3.2,
    totalTrips: 23, totalSpend: 67800, cancelRate: 18.5, disputeCount: 4,
    payments: [
      { type: "card", label: "Mastercard", last4: "8834", isDefault: true },
    ],
    recentTrips: mkTrips([
      ["Wuse → Garki", 2200, "3d ago"],
      ["Maitama → Wuse", 1800, "5d ago"],
    ]),
    disputes: [
      { id: "D-2903", category: "fare", status: "open", amount: 1200, date: "3d ago" },
      { id: "D-2847", category: "service", status: "open", amount: 0, date: "1w ago" },
      { id: "D-2780", category: "payment", status: "resolved", amount: 3400, date: "2w ago" },
      { id: "D-2712", category: "no_show", status: "resolved", amount: 800, date: "3w ago" },
    ],
    notes: ["High cancellation rate — possible abuse pattern", "4 disputes in 3 weeks"],
    tags: ["high-cancel", "frequent-disputer", "review-needed"],
  },
  {
    id: "RDR-0004", name: "Folake Adeyemi", phone: "+234 804 567 8901", email: "folake@email.com",
    status: "active", city: "Lagos", zone: "Ikeja",
    joinDate: "2025-06-03", lastActive: "1h ago", rating: 4.7,
    totalTrips: 211, totalSpend: 892300, cancelRate: 2.8, disputeCount: 0,
    payments: [
      { type: "card", label: "Visa", last4: "2201", isDefault: true },
      { type: "wallet", label: "JET Wallet", balance: 24600, isDefault: false },
      { type: "corporate", label: "Deloitte Nigeria", isDefault: false },
    ],
    recentTrips: mkTrips([
      ["Ikeja GRA → VI", 5200, "1h ago"],
      ["VI → Ikeja", 5100, "Yesterday"],
      ["Ikeja → Airport", 6800, "2 days ago"],
      ["Airport → Ikeja GRA", 6400, "3 days ago"],
    ]),
    disputes: [],
    notes: [],
    tags: ["corporate", "high-value", "loyal"],
  },
  {
    id: "RDR-0005", name: "Chukwu Emeka", phone: "+234 805 678 9012", email: "chukwu@email.com",
    status: "suspended", city: "Lagos", zone: "Ajah",
    joinDate: "2026-02-14", lastActive: "2w ago", rating: 2.1,
    totalTrips: 15, totalSpend: 34200, cancelRate: 42.0, disputeCount: 7,
    payments: [
      { type: "card", label: "Verve", last4: "6610", isDefault: true },
    ],
    recentTrips: mkTrips([
      ["Ajah → Lekki", 2800, "2w ago"],
    ]),
    disputes: [
      { id: "D-2950", category: "safety", status: "open", amount: 0, date: "2w ago" },
      { id: "D-2920", category: "fare", status: "resolved", amount: 2100, date: "3w ago" },
    ],
    notes: [
      "Account suspended for repeated abuse — 42% cancel rate, 7 disputes",
      "Safety dispute filed by driver DRV-0441 — verbal abuse allegation",
    ],
    tags: ["suspended", "abuse-risk"],
  },
  {
    id: "RDR-0006", name: "Amina Bello", phone: "+234 806 789 0123", email: "amina@email.com",
    status: "active", city: "Abuja", zone: "Garki",
    joinDate: "2025-11-30", lastActive: "6h ago", rating: 4.6,
    totalTrips: 67, totalSpend: 198700, cancelRate: 5.1, disputeCount: 0,
    payments: [
      { type: "wallet", label: "JET Wallet", balance: 8100, isDefault: true },
    ],
    recentTrips: mkTrips([
      ["Garki → Maitama", 3200, "6h ago"],
      ["Wuse → Garki", 2400, "Yesterday"],
      ["Asokoro → Wuse", 4200, "2 days ago"],
    ]),
    disputes: [],
    notes: [],
    tags: [],
  },
  {
    id: "RDR-0007", name: "Tunde Bakare", phone: "+234 807 890 1234", email: "tunde@email.com",
    status: "new", city: "Lagos", zone: "Surulere",
    joinDate: "2026-03-12", lastActive: "1d ago", rating: 5.0,
    totalTrips: 3, totalSpend: 8400, cancelRate: 0, disputeCount: 0,
    payments: [
      { type: "card", label: "Mastercard", last4: "9921", isDefault: true },
    ],
    recentTrips: mkTrips([
      ["Surulere → Yaba", 1800, "1d ago"],
      ["Yaba → Surulere", 1600, "2d ago"],
      ["Surulere → Ikeja", 3200, "3d ago"],
    ]),
    disputes: [],
    notes: [],
    tags: ["new-user"],
  },
  {
    id: "RDR-0008", name: "Kemi Okonkwo", phone: "+234 808 901 2345", email: "kemi@email.com",
    status: "active", city: "Lagos", zone: "Ikoyi",
    joinDate: "2025-07-19", lastActive: "20m ago", rating: 4.5,
    totalTrips: 156, totalSpend: 543200, cancelRate: 4.8, disputeCount: 2,
    payments: [
      { type: "card", label: "Visa", last4: "3309", isDefault: true },
      { type: "wallet", label: "JET Wallet", balance: 3200, isDefault: false },
    ],
    recentTrips: mkTrips([
      ["Ikoyi → VI", 1800, "20m ago"],
      ["Lekki → Ikoyi", 3400, "Yesterday"],
      ["Ikoyi → Ajah", 5200, "2 days ago"],
    ]),
    disputes: [
      { id: "D-2650", category: "route", status: "resolved", amount: 0, date: "1 month ago" },
      { id: "D-2520", category: "fare", status: "resolved", amount: 600, date: "2 months ago" },
    ],
    notes: [],
    tags: ["high-value"],
  },
  {
    id: "RDR-0009", name: "Yusuf Abdullahi", phone: "+234 809 012 3456", email: "yusuf@email.com",
    status: "active", city: "Kano", zone: "Nassarawa",
    joinDate: "2025-12-05", lastActive: "4h ago", rating: 4.3,
    totalTrips: 44, totalSpend: 132600, cancelRate: 6.2, disputeCount: 1,
    payments: [
      { type: "wallet", label: "JET Wallet", balance: 8100, isDefault: true },
      { type: "cash", label: "Cash", isDefault: false },
    ],
    recentTrips: mkTrips([
      ["Nassarawa → Sabon Gari", 1400, "4h ago"],
      ["Sabon Gari → Nassarawa", 1200, "Yesterday"],
    ]),
    disputes: [{ id: "D-2750", category: "service", status: "resolved", amount: 0, date: "3w ago" }],
    notes: [],
    tags: [],
  },
  {
    id: "RDR-0010", name: "Chiamaka Nweze", phone: "+234 810 123 4567", email: "chiamaka@email.com",
    status: "flagged", city: "Port Harcourt", zone: "GRA",
    joinDate: "2025-10-28", lastActive: "5d ago", rating: 3.8,
    totalTrips: 31, totalSpend: 89100, cancelRate: 14.2, disputeCount: 3,
    payments: [
      { type: "card", label: "Mastercard", last4: "7712", isDefault: true },
    ],
    recentTrips: mkTrips([
      ["GRA → Trans Amadi", 2600, "5d ago"],
      ["Trans Amadi → GRA", 2400, "6d ago"],
    ]),
    disputes: [
      { id: "D-2880", category: "fare", status: "open", amount: 1800, date: "5d ago" },
      { id: "D-2810", category: "payment", status: "resolved", amount: 4200, date: "2w ago" },
      { id: "D-2740", category: "service", status: "resolved", amount: 0, date: "1 month ago" },
    ],
    notes: ["Elevated cancellation rate — 14.2%, flagged for review"],
    tags: ["high-cancel", "review-needed"],
  },
  {
    id: "RDR-0011", name: "Chidinma Ojo", phone: "+234 811 234 5678", email: "chidinma@email.com",
    status: "churned", city: "Lagos", zone: "Yaba",
    joinDate: "2025-05-12", lastActive: "68d ago", rating: 4.1,
    totalTrips: 52, totalSpend: 156800, cancelRate: 8.4, disputeCount: 1,
    payments: [
      { type: "card", label: "Visa", last4: "5501", isDefault: true },
    ],
    recentTrips: mkTrips([
      ["Yaba → Surulere", 1600, "68d ago"],
    ]),
    disputes: [{ id: "D-2400", category: "fare", status: "resolved", amount: 400, date: "3 months ago" }],
    notes: ["No trip in 68 days — potentially churned"],
    tags: ["churned"],
  },
];

export const formatNaira = (v: number) => {
  if (v >= 1_000_000) return `₦${(v / 1_000_000).toFixed(1)}M`;
  if (v >= 1_000) return `₦${(v / 1_000).toFixed(v >= 100_000 ? 0 : 1)}k`;
  return `₦${v.toLocaleString()}`;
};

export const DISPUTE_STATS = {
  totalOpen: RIDERS.reduce((a, r) => a + r.disputes.filter(d => d.status === "open").length, 0),
};
