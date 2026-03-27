 /**
 * Scheduled Rides — Shared data, types, and mock state.
 *
 * Status lifecycle:
 *   upcoming → confirmed → driver-assigned → driver-en-route → [transitions to live ride]
 *   upcoming → cancelled (user-initiated)
 *   confirmed → completed (ride finished)
 */

export type RideStatus =
  | "upcoming"       // Scheduled, not yet confirmed by system
  | "confirmed"      // System confirmed, waiting for ride day
  | "driver-assigned" // Driver matched (15-30 min before pickup)
  | "driver-en-route" // Driver heading to pickup
  | "completed"
  | "cancelled";

export type RideCategory = "JetEV" | "Comfort" | "Premium";
export type Recurrence = "daily" | "weekdays" | "weekly" | null;

export interface ScheduledRide {
  id: string;
  from: string;
  fromAddress: string;
  to: string;
  toAddress: string;
  /** ISO date string */
  date: string;
  /** Display time e.g. "8:30 AM" */
  time: string;
  category: RideCategory;
  fare: string;
  status: RideStatus;
  recurring: Recurrence;
  driver: { name: string; rating: number; vehicle?: string; plate?: string; eta?: string } | null;
  duration: string;
}

/** Recurring template — deduplicated pattern for the Recurring filter */
export interface RecurringTemplate {
  id: string;
  from: string;
  fromAddress: string;
  to: string;
  toAddress: string;
  time: string;
  category: RideCategory;
  fare: string;
  recurrence: "daily" | "weekdays" | "weekly";
  /** How many upcoming instances */
  instanceCount: number;
  /** Is the recurring pattern active? */
  active: boolean;
}

export const MOCK_SCHEDULED_RIDES: ScheduledRide[] = [
  // ── Today: driver already assigned (demonstrates state progression) ──
  {
    id: "s1",
    from: "Home",
    fromAddress: "12 Bourdillon Rd, Ikoyi",
    to: "Work",
    toAddress: "235 Ikorodu Rd, Lagos",
    date: "2026-03-04", // today
    time: "7:30 AM",
    category: "JetEV",
    fare: "₦3,400",
    status: "driver-assigned",
    recurring: "weekdays",
    driver: { name: "Chidi A.", rating: 4.95, vehicle: "Tesla Model 3", plate: "LG-891-EV", eta: "12 min" },
    duration: "25 min",
  },
  // ── Tomorrow morning ──
  {
    id: "s2",
    from: "Home",
    fromAddress: "12 Bourdillon Rd, Ikoyi",
    to: "Work",
    toAddress: "235 Ikorodu Rd, Lagos",
    date: "2026-03-05",
    time: "7:30 AM",
    category: "JetEV",
    fare: "₦3,400",
    status: "confirmed",
    recurring: "weekdays",
    driver: null,
    duration: "25 min",
  },
  // ── Tomorrow evening ──
  {
    id: "s3",
    from: "Work",
    fromAddress: "235 Ikorodu Rd, Lagos",
    to: "Lekki Phase 1",
    toAddress: "Admiralty Way, Lekki",
    date: "2026-03-05",
    time: "6:00 PM",
    category: "Comfort",
    fare: "₦4,800",
    status: "confirmed",
    recurring: "weekdays",
    driver: null,
    duration: "35 min",
  },
  // ── Friday — one-off airport run ──
  {
    id: "s4",
    from: "Home",
    fromAddress: "12 Bourdillon Rd, Ikoyi",
    to: "Airport",
    toAddress: "MM Airport, Ikeja",
    date: "2026-03-06",
    time: "5:00 AM",
    category: "Premium",
    fare: "₦8,200",
    status: "upcoming",
    recurring: null,
    driver: null,
    duration: "45 min",
  },
  // ── Saturday — weekly gym ──
  {
    id: "s5",
    from: "Home",
    fromAddress: "12 Bourdillon Rd, Ikoyi",
    to: "Gym",
    toAddress: "The Palms, Lekki",
    date: "2026-03-07",
    time: "6:30 AM",
    category: "JetEV",
    fare: "₦2,800",
    status: "upcoming",
    recurring: "weekly",
    driver: null,
    duration: "18 min",
  },
  // ── Past: completed yesterday ──
  {
    id: "s6",
    from: "Home",
    fromAddress: "12 Bourdillon Rd, Ikoyi",
    to: "Work",
    toAddress: "235 Ikorodu Rd, Lagos",
    date: "2026-03-03",
    time: "7:30 AM",
    category: "JetEV",
    fare: "₦3,400",
    status: "completed",
    recurring: "weekdays",
    driver: { name: "Chidi A.", rating: 4.95 },
    duration: "22 min",
  },
  // ── Past: completed Monday ──
  {
    id: "s7",
    from: "Work",
    fromAddress: "235 Ikorodu Rd, Lagos",
    to: "Lekki Phase 1",
    toAddress: "Admiralty Way, Lekki",
    date: "2026-03-02",
    time: "6:00 PM",
    category: "Comfort",
    fare: "₦4,800",
    status: "completed",
    recurring: "weekdays",
    driver: { name: "Emeka O.", rating: 4.88 },
    duration: "38 min",
  },
  // ── Past: cancelled ──
  {
    id: "s8",
    from: "Home",
    fromAddress: "12 Bourdillon Rd, Ikoyi",
    to: "Airport",
    toAddress: "MM Airport, Ikeja",
    date: "2026-03-01",
    time: "4:30 AM",
    category: "Premium",
    fare: "₦8,200",
    status: "cancelled",
    recurring: null,
    driver: null,
    duration: "45 min",
  },
];

/** Extract recurring templates from rides (deduplicated by route+time+recurrence) */
export function extractRecurringTemplates(rides: ScheduledRide[]): RecurringTemplate[] {
  const map = new Map<string, RecurringTemplate>();

  rides.forEach((r) => {
    if (!r.recurring || r.status === "cancelled") return;
    const key = `${r.from}-${r.to}-${r.time}-${r.recurring}`;
    if (map.has(key)) {
      const t = map.get(key)!;
      if (r.status !== "completed") t.instanceCount++;
    } else {
      map.set(key, {
        id: `tmpl-${r.id}`,
        from: r.from,
        fromAddress: r.fromAddress,
        to: r.to,
        toAddress: r.toAddress,
        time: r.time,
        category: r.category,
        fare: r.fare,
        recurrence: r.recurring,
        instanceCount: r.status !== "completed" ? 1 : 0,
        active: true,
      });
    }
  });

  return Array.from(map.values());
}

/** Days for the calendar scroller */
export function getCalendarDays(centerDate: Date, range = 14) {
  const days = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let i = 0; i < range; i++) {
    const d = new Date(centerDate);
    d.setDate(d.getDate() + i);
    d.setHours(0, 0, 0, 0);
    days.push({
      date: d,
      dayName: d.toLocaleDateString("en-US", { weekday: "short" }),
      dayNum: d.getDate(),
      monthShort: d.toLocaleDateString("en-US", { month: "short" }),
      isToday: d.getTime() === today.getTime(),
      dateStr: d.toISOString().split("T")[0],
    });
  }
  return days;
}

/** Group rides by date */
export function groupRidesByDate(rides: ScheduledRide[]): Record<string, ScheduledRide[]> {
  return rides.reduce((acc, ride) => {
    if (!acc[ride.date]) acc[ride.date] = [];
    acc[ride.date].push(ride);
    return acc;
  }, {} as Record<string, ScheduledRide[]>);
}

/** Format a date string for display */
export function formatDateDisplay(dateStr: string): string {
  const d = new Date(dateStr + "T00:00:00");
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (d.getTime() === today.getTime()) return "Today";
  if (d.getTime() === tomorrow.getTime()) return "Tomorrow";
  if (d.getTime() === yesterday.getTime()) return "Yesterday";
  return d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
}

/** Category color map */
export function getCategoryColor(category: RideCategory): string {
  switch (category) {
    case "JetEV": return "#1DB954";
    case "Premium": return "#A78BFA";
    case "Comfort": return "#60A5FA";
  }
}

/** Recurrence label */
export function recurrenceLabel(r: Recurrence): string {
  if (!r) return "One-time";
  switch (r) {
    case "daily": return "Every day";
    case "weekdays": return "Weekdays";
    case "weekly": return "Weekly";
  }
}

/** Time slots for the schedule creator */
export function generateTimeSlots(): string[] {
  const slots: string[] = [];
  for (let h = 0; h < 24; h++) {
    for (const m of [0, 15, 30, 45]) {
      const hour12 = h === 0 ? 12 : h > 12 ? h - 12 : h;
      const ampm = h < 12 ? "AM" : "PM";
      const min = m === 0 ? "00" : String(m);
      slots.push(`${hour12}:${min} ${ampm}`);
    }
  }
  return slots;
}

/** Status display helpers */
export function statusLabel(s: RideStatus): string {
  switch (s) {
    case "upcoming": return "Pending";
    case "confirmed": return "Confirmed";
    case "driver-assigned": return "Driver assigned";
    case "driver-en-route": return "Driver en route";
    case "completed": return "Completed";
    case "cancelled": return "Cancelled";
  }
}

export function isLiveStatus(s: RideStatus): boolean {
  return s === "driver-assigned" || s === "driver-en-route";
}
