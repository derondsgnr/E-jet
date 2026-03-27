/**
 * Activity Data — types, mock data, and utility functions for the Activity screen.
 *
 * Pure data module (no JSX). Provides trip history, filtering, stats computation,
 * sparkline data, and formatting helpers.
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
export type Period = "week" | "month" | "3months";

export interface ActivityTrip {
  id: string;
  from: string;
  to: string;
  fare: string;
  /** Raw amount in naira */
  amount: number;
  time: string;
  date: string;
  durationMin: number;
  ev: boolean;
  status: "completed" | "cancelled";
  /** Carbon saved in kg (EV trips only) */
  carbonKg: number;
  /** Driver name */
  driver: string;
  /** Driver rating */
  driverRating: number;
  /** Vehicle info */
  vehicle: string;
  /** Payment method */
  paymentMethod: string;
  /** Trip ID for display */
  tripRef: string;
}

export const PERIOD_LABELS: Record<Period, string> = {
  week: "This week",
  month: "This month",
  "3months": "3 months",
};

// ---------------------------------------------------------------------------
// Mock trip data
// ---------------------------------------------------------------------------
const MOCK_TRIPS: ActivityTrip[] = [
  {
    id: "t1", from: "Home", to: "Office", fare: "₦2,800", amount: 2800,
    time: "8:15 AM", date: "2026-03-10", durationMin: 32, ev: true,
    carbonKg: 0.8, status: "completed", driver: "Emeka O.",
    driverRating: 4.9, vehicle: "Tesla Model 3 · White · LSR-234-KJ",
    paymentMethod: "Wallet", tripRef: "JET-2603100815",
  },
  {
    id: "t2", from: "Office", to: "The Palms", fare: "₦1,500", amount: 1500,
    time: "1:20 PM", date: "2026-03-10", durationMin: 18, ev: false,
    carbonKg: 0, status: "completed", driver: "Chidi A.",
    driverRating: 4.7, vehicle: "Toyota Corolla · Black · APP-891-LG",
    paymentMethod: "Card •••• 4521", tripRef: "JET-2603101320",
  },
  {
    id: "t3", from: "The Palms", to: "Home", fare: "₦2,200", amount: 2200,
    time: "4:45 PM", date: "2026-03-10", durationMin: 25, ev: true,
    carbonKg: 0.6, status: "completed", driver: "Bola T.",
    driverRating: 4.8, vehicle: "BYD Atto 3 · Grey · KTU-112-AB",
    paymentMethod: "Wallet", tripRef: "JET-2603101645",
  },
  {
    id: "t4", from: "Home", to: "Airport", fare: "—", amount: 0,
    time: "6:00 AM", date: "2026-03-09", durationMin: 0, ev: false,
    carbonKg: 0, status: "cancelled", driver: "—",
    driverRating: 0, vehicle: "—",
    paymentMethod: "—", tripRef: "JET-2603090600",
  },
  {
    id: "t5", from: "Home", to: "Office", fare: "₦3,100", amount: 3100,
    time: "7:50 AM", date: "2026-03-09", durationMin: 38, ev: true,
    carbonKg: 0.9, status: "completed", driver: "Kelechi N.",
    driverRating: 4.6, vehicle: "Tesla Model Y · Blue · FKJ-067-LA",
    paymentMethod: "Wallet", tripRef: "JET-2603090750",
  },
  {
    id: "t6", from: "Office", to: "Gym", fare: "₦1,800", amount: 1800,
    time: "5:30 PM", date: "2026-03-09", durationMin: 15, ev: false,
    carbonKg: 0, status: "completed", driver: "Ade M.",
    driverRating: 4.5, vehicle: "Honda Civic · Silver · GGE-443-OG",
    paymentMethod: "Card •••• 4521", tripRef: "JET-2603091730",
  },
  {
    id: "t7", from: "Gym", to: "Home", fare: "₦2,400", amount: 2400,
    time: "7:15 PM", date: "2026-03-09", durationMin: 22, ev: true,
    carbonKg: 0.7, status: "completed", driver: "Yusuf D.",
    driverRating: 4.9, vehicle: "BYD Dolphin · White · MNA-221-KW",
    paymentMethod: "Wallet", tripRef: "JET-2603091915",
  },
  {
    id: "t8", from: "Home", to: "Office", fare: "₦2,650", amount: 2650,
    time: "8:30 AM", date: "2026-03-08", durationMin: 30, ev: false,
    carbonKg: 0, status: "completed", driver: "Ibrahim K.",
    driverRating: 4.4, vehicle: "Toyota Camry · Black · EPE-778-LG",
    paymentMethod: "Card •••• 4521", tripRef: "JET-2603080830",
  },
  {
    id: "t9", from: "Office", to: "Home", fare: "₦2,900", amount: 2900,
    time: "6:45 PM", date: "2026-03-08", durationMin: 35, ev: true,
    carbonKg: 0.85, status: "completed", driver: "Emeka O.",
    driverRating: 4.9, vehicle: "Tesla Model 3 · White · LSR-234-KJ",
    paymentMethod: "Wallet", tripRef: "JET-2603081845",
  },
  {
    id: "t10", from: "Home", to: "The Palms", fare: "₦1,700", amount: 1700,
    time: "11:00 AM", date: "2026-03-07", durationMin: 20, ev: false,
    carbonKg: 0, status: "completed", driver: "Femi J.",
    driverRating: 4.7, vehicle: "Honda Accord · Grey · AKD-556-LA",
    paymentMethod: "Card •••• 4521", tripRef: "JET-2603071100",
  },
  {
    id: "t11", from: "The Palms", to: "Home", fare: "₦1,900", amount: 1900,
    time: "3:30 PM", date: "2026-03-07", durationMin: 22, ev: true,
    carbonKg: 0.55, status: "completed", driver: "Bola T.",
    driverRating: 4.8, vehicle: "BYD Atto 3 · Grey · KTU-112-AB",
    paymentMethod: "Wallet", tripRef: "JET-2603071530",
  },
  {
    id: "t12", from: "Home", to: "Office", fare: "₦2,750", amount: 2750,
    time: "8:00 AM", date: "2026-03-06", durationMin: 33, ev: true,
    carbonKg: 0.8, status: "completed", driver: "Kelechi N.",
    driverRating: 4.6, vehicle: "Tesla Model Y · Blue · FKJ-067-LA",
    paymentMethod: "Wallet", tripRef: "JET-2603060800",
  },
  {
    id: "t13", from: "Office", to: "Home", fare: "₦3,000", amount: 3000,
    time: "7:00 PM", date: "2026-03-05", durationMin: 36, ev: false,
    carbonKg: 0, status: "completed", driver: "Ade M.",
    driverRating: 4.5, vehicle: "Honda Civic · Silver · GGE-443-OG",
    paymentMethod: "Card •••• 4521", tripRef: "JET-2603050700",
  },
  {
    id: "t14", from: "Home", to: "Airport", fare: "₦5,200", amount: 5200,
    time: "5:00 AM", date: "2026-03-04", durationMin: 45, ev: true,
    carbonKg: 1.3, status: "completed", driver: "Yusuf D.",
    driverRating: 4.9, vehicle: "BYD Dolphin · White · MNA-221-KW",
    paymentMethod: "Wallet", tripRef: "JET-2603040500",
  },
];

// ---------------------------------------------------------------------------
// Filtering
// ---------------------------------------------------------------------------
export function filterByPeriod(period: Period): ActivityTrip[] {
  const now = new Date("2026-03-10");
  let cutoff: Date;
  switch (period) {
    case "week":
      cutoff = new Date(now);
      cutoff.setDate(cutoff.getDate() - 7);
      break;
    case "month":
      cutoff = new Date(now);
      cutoff.setMonth(cutoff.getMonth() - 1);
      break;
    case "3months":
      cutoff = new Date(now);
      cutoff.setMonth(cutoff.getMonth() - 3);
      break;
  }
  return MOCK_TRIPS.filter((t) => new Date(t.date) >= cutoff);
}

// ---------------------------------------------------------------------------
// Stats
// ---------------------------------------------------------------------------
export interface ActivityStats {
  totalSpend: number;
  rideCount: number;
  avgRide: number;
  totalMinutes: number;
  carbonSavedKg: number;
  evRides: number;
}

export function computeStats(trips: ActivityTrip[]): ActivityStats {
  const completed = trips.filter((t) => t.status === "completed");
  const totalSpend = completed.reduce((s, t) => s + t.amount, 0);
  const totalMinutes = completed.reduce((s, t) => s + t.durationMin, 0);
  const carbonSavedKg = +(completed.reduce((s, t) => s + t.carbonKg, 0).toFixed(1));
  const evRides = completed.filter((t) => t.ev).length;
  return {
    totalSpend,
    rideCount: completed.length,
    avgRide: completed.length > 0 ? Math.round(totalSpend / completed.length) : 0,
    totalMinutes,
    carbonSavedKg,
    evRides,
  };
}

// ---------------------------------------------------------------------------
// Sparkline data
// ---------------------------------------------------------------------------
export function sparklineForPeriod(
  period: Period
): { label: string; amount: number }[] {
  const now = new Date("2026-03-10");
  const points: { label: string; amount: number }[] = [];

  if (period === "week") {
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().slice(0, 10);
      const dayTrips = MOCK_TRIPS.filter(
        (t) => t.date === dateStr && t.status === "completed"
      );
      points.push({
        label: dayNames[d.getDay()],
        amount: dayTrips.reduce((s, t) => s + t.amount, 0),
      });
    }
  } else if (period === "month") {
    // 4 weekly buckets
    for (let w = 3; w >= 0; w--) {
      const weekEnd = new Date(now);
      weekEnd.setDate(weekEnd.getDate() - w * 7);
      const weekStart = new Date(weekEnd);
      weekStart.setDate(weekStart.getDate() - 6);
      const weekTrips = MOCK_TRIPS.filter((t) => {
        const td = new Date(t.date);
        return td >= weekStart && td <= weekEnd && t.status === "completed";
      });
      points.push({
        label: `W${4 - w}`,
        amount: weekTrips.reduce((s, t) => s + t.amount, 0),
      });
    }
  } else {
    // 3 month buckets
    for (let m = 2; m >= 0; m--) {
      const month = new Date(now);
      month.setMonth(month.getMonth() - m);
      const monthStr = month.toISOString().slice(0, 7);
      const monthTrips = MOCK_TRIPS.filter(
        (t) => t.date.startsWith(monthStr) && t.status === "completed"
      );
      const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      points.push({
        label: monthNames[month.getMonth()],
        amount: monthTrips.reduce((s, t) => s + t.amount, 0),
      });
    }
  }
  return points;
}

// ---------------------------------------------------------------------------
// Most visited places
// ---------------------------------------------------------------------------
export interface MostVisitedPlace {
  name: string;
  count: number;
  isSaved: boolean;
}

export function deriveMostVisited(
  trips: ActivityTrip[],
  savedNames: string[]
): MostVisitedPlace[] {
  const counts: Record<string, number> = {};
  const completed = trips.filter((t) => t.status === "completed");
  for (const t of completed) {
    counts[t.to] = (counts[t.to] || 0) + 1;
  }
  return Object.entries(counts)
    .map(([name, count]) => ({
      name,
      count,
      isSaved: savedNames.includes(name),
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);
}

// ---------------------------------------------------------------------------
// Group trips by date
// ---------------------------------------------------------------------------
export interface TripGroup {
  date: string;
  trips: ActivityTrip[];
}

export function groupTripsByDate(trips: ActivityTrip[]): TripGroup[] {
  const grouped: Record<string, ActivityTrip[]> = {};
  for (const trip of trips) {
    const d = new Date(trip.date);
    const today = new Date("2026-03-10");
    const yesterday = new Date("2026-03-09");
    let label: string;
    if (trip.date === today.toISOString().slice(0, 10)) {
      label = "Today";
    } else if (trip.date === yesterday.toISOString().slice(0, 10)) {
      label = "Yesterday";
    } else {
      label = d.toLocaleDateString("en-NG", {
        weekday: "short",
        month: "short",
        day: "numeric",
      });
    }
    if (!grouped[label]) grouped[label] = [];
    grouped[label].push(trip);
  }
  return Object.entries(grouped).map(([date, trips]) => ({ date, trips }));
}

// ---------------------------------------------------------------------------
// Formatters
// ---------------------------------------------------------------------------
export function formatNaira(amount: number): string {
  return `₦${amount.toLocaleString("en-NG")}`;
}

export function formatMinutes(minutes: number): string {
  if (minutes < 60) return `${minutes}m`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
}
