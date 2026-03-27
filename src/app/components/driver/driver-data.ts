/**
 * Driver App — Data layer for Earnings Home.
 *
 * Mock data matching real Nigerian driver patterns:
 *   - Cash-dominant payments
 *   - Naira currency
 *   - Lagos routes & neighborhoods
 *   - EV + gas vehicle mix
 *   - Realistic commission structure (transparent)
 */

import { START_OTP, END_OTP } from "../../config/otp-config";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
export interface DriverProfile {
  firstName: string;
  lastName: string;
  initials: string;
  rating: number;
  acceptanceRate: number;
  totalTrips: number;
  memberSince: string;
  vehicle: {
    make: string;
    model: string;
    year: number;
    plate: string;
    type: "EV" | "Comfort" | "Economy";
    color: string;
  };
}

export interface EarningsPeriod {
  label: string;
  earnings: number;
  trips: number;
  hoursOnline: number;
  cashTrips: number;
  digitalTrips: number;
  commission: number;
  bonuses: number;
  tips: number;
}

export interface TripRecord {
  id: string;
  rider: string;
  riderRating: number;
  riderTrips: number;
  from: string;
  to: string;
  grossFare: number;
  commission: number;
  netEarnings: number;
  tip: number;
  paymentType: "cash" | "digital";
  vehicleType: "EV" | "Comfort" | "Economy";
  duration: number; // minutes
  distance: number; // km
  time: string; // display string
  timestamp: number;
}

export interface DemandZone {
  id: string;
  area: string;
  level: "low" | "moderate" | "high" | "surge";
  multiplier: number;
}

export interface DailyEarning {
  day: string;
  amount: number;
}

// ---------------------------------------------------------------------------
// Trip request (incoming ride)
// ---------------------------------------------------------------------------
export interface TripRequest {
  id: string;
  rider: {
    name: string;
    rating: number;
    trips: number;
    initials: string;
    avatarUrl?: string;
  };
  pickup: {
    address: string;
    area: string;
    distanceFromDriver: number; // km
    etaMinutes: number; // minutes to pickup
  };
  destination: {
    address: string;
    area: string;
  };
  estimate: {
    distance: number; // km
    duration: number; // minutes
    fare: number; // gross
    netEarnings: number; // after commission
  };
  paymentType: "cash" | "digital";
  vehicleType: "EV" | "Comfort" | "Economy";
  surgeMultiplier: number; // 1.0 = no surge
  timeoutSeconds: number;
  /** Hotel booking fields — present when bookingSource === 'hotel' */
  bookingSource?: "rider" | "hotel";
  hotelName?: string;
  guestName?: string;       // Guest name (replaces rider name in UI)
  pickupDetail?: string;    // Sub-location: "Main Lobby", "Convention Centre Entrance"
  driverNotes?: string;     // Concierge notes: "2 large suitcases"
  flightNumber?: string;    // For airport transfers
  roomNumber?: string;      // Hotel room number
}

// ---------------------------------------------------------------------------
// Driver profile
// ---------------------------------------------------------------------------
export const DRIVER_PROFILE: DriverProfile = {
  firstName: "Chidi",
  lastName: "Eze",
  initials: "CE",
  rating: 4.89,
  acceptanceRate: 94,
  totalTrips: 2847,
  memberSince: "2024",
  vehicle: {
    make: "Toyota",
    model: "Corolla",
    year: 2022,
    plate: "LSR-482-JT",
    type: "Comfort",
    color: "Silver",
  },
};

// ---------------------------------------------------------------------------
// Today's earnings
// ---------------------------------------------------------------------------
export const TODAY_EARNINGS: EarningsPeriod = {
  label: "Today",
  earnings: 24500,
  trips: 8,
  hoursOnline: 6.2,
  cashTrips: 5,
  digitalTrips: 3,
  commission: 4900,
  bonuses: 1500,
  tips: 800,
};

// ---------------------------------------------------------------------------
// This week's earnings
// ---------------------------------------------------------------------------
export const WEEK_EARNINGS: EarningsPeriod = {
  label: "This week",
  earnings: 142300,
  trips: 47,
  hoursOnline: 38.5,
  cashTrips: 28,
  digitalTrips: 19,
  commission: 28460,
  bonuses: 5000,
  tips: 4200,
};

// ---------------------------------------------------------------------------
// Weekly sparkline data
// ---------------------------------------------------------------------------
export const WEEKLY_EARNINGS: DailyEarning[] = [
  { day: "Mon", amount: 18200 },
  { day: "Tue", amount: 22400 },
  { day: "Wed", amount: 28100 },
  { day: "Thu", amount: 24500 },
  { day: "Fri", amount: 31200 },
  { day: "Sat", amount: 17900 },
  { day: "Sun", amount: 0 },
];

// ---------------------------------------------------------------------------
// Recent trips
// ---------------------------------------------------------------------------
export const RECENT_TRIPS: TripRecord[] = [
  {
    id: "t1",
    rider: "Tunde A.",
    riderRating: 4.8,
    riderTrips: 847,
    from: "Victoria Island",
    to: "Lekki Phase 1",
    grossFare: 3800,
    commission: 760,
    netEarnings: 3040,
    tip: 200,
    paymentType: "digital",
    vehicleType: "Comfort",
    duration: 18,
    distance: 8.2,
    time: "12 min ago",
    timestamp: Date.now() - 720000,
  },
  {
    id: "t2",
    rider: "Ngozi I.",
    riderRating: 4.9,
    riderTrips: 234,
    from: "Ikoyi",
    to: "Surulere",
    grossFare: 4500,
    commission: 900,
    netEarnings: 3600,
    tip: 0,
    paymentType: "cash",
    vehicleType: "Comfort",
    duration: 25,
    distance: 12.1,
    time: "45 min ago",
    timestamp: Date.now() - 2700000,
  },
  {
    id: "t3",
    rider: "Femi O.",
    riderRating: 4.6,
    riderTrips: 52,
    from: "Ikeja GRA",
    to: "Maryland",
    grossFare: 2200,
    commission: 440,
    netEarnings: 1760,
    tip: 100,
    paymentType: "digital",
    vehicleType: "Comfort",
    duration: 12,
    distance: 5.4,
    time: "1hr ago",
    timestamp: Date.now() - 3600000,
  },
  {
    id: "t4",
    rider: "Amaka C.",
    riderRating: 4.7,
    riderTrips: 189,
    from: "Lekki Phase 1",
    to: "Ajah",
    grossFare: 3200,
    commission: 640,
    netEarnings: 2560,
    tip: 300,
    paymentType: "cash",
    vehicleType: "Comfort",
    duration: 22,
    distance: 10.8,
    time: "2hr ago",
    timestamp: Date.now() - 7200000,
  },
  {
    id: "t5",
    rider: "Kola B.",
    riderRating: 4.5,
    riderTrips: 31,
    from: "Yaba",
    to: "Victoria Island",
    grossFare: 5100,
    commission: 1020,
    netEarnings: 4080,
    tip: 0,
    paymentType: "cash",
    vehicleType: "Comfort",
    duration: 32,
    distance: 14.6,
    time: "3hr ago",
    timestamp: Date.now() - 10800000,
  },
];

// ---------------------------------------------------------------------------
// Demand zones
// ---------------------------------------------------------------------------
export const DEMAND_ZONES: DemandZone[] = [
  { id: "z1", area: "Victoria Island", level: "high", multiplier: 1.5 },
  { id: "z2", area: "Ikoyi", level: "moderate", multiplier: 1.2 },
  { id: "z3", area: "Lekki", level: "surge", multiplier: 1.8 },
  { id: "z4", area: "Ikeja", level: "low", multiplier: 1.0 },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
export function formatNaira(amount: number): string {
  return `\u20A6${amount.toLocaleString()}`;
}

export function formatHours(hours: number): string {
  const h = Math.floor(hours);
  const m = Math.round((hours - h) * 60);
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
}

export function getDemandColor(level: DemandZone["level"]): string {
  switch (level) {
    case "surge":
      return "#F59E0B";
    case "high":
      return "#1DB954";
    case "moderate":
      return "rgba(29,185,84,0.5)";
    case "low":
      return "rgba(255,255,255,0.2)";
  }
}

// ---------------------------------------------------------------------------
// New user (zero-data) variants
// ---------------------------------------------------------------------------
export const NEW_USER_PROFILE: DriverProfile = {
  firstName: "Chidi",
  lastName: "Eze",
  initials: "CE",
  rating: 0,
  acceptanceRate: 0,
  totalTrips: 0,
  memberSince: "2026",
  vehicle: {
    make: "Toyota",
    model: "Corolla",
    year: 2022,
    plate: "LSR-482-JT",
    type: "Comfort",
    color: "Silver",
  },
};

export const NEW_USER_EARNINGS: EarningsPeriod = {
  label: "Today",
  earnings: 0,
  trips: 0,
  hoursOnline: 0,
  cashTrips: 0,
  digitalTrips: 0,
  commission: 0,
  bonuses: 0,
  tips: 0,
};

export const NEW_USER_WEEKLY: DailyEarning[] = [
  { day: "Mon", amount: 0 },
  { day: "Tue", amount: 0 },
  { day: "Wed", amount: 0 },
  { day: "Thu", amount: 0 },
  { day: "Fri", amount: 0 },
  { day: "Sat", amount: 0 },
  { day: "Sun", amount: 0 },
];

// ---------------------------------------------------------------------------
// Chat messages (driver perspective — synced with rider)
// ---------------------------------------------------------------------------
export interface ChatMessage {
  id: string;
  sender: "rider" | "driver";
  text: string;
  time: string;
}

export const MOCK_DRIVER_CHAT: ChatMessage[] = [
  { id: "d1", sender: "driver", text: "On my way to pick you up! Traffic is light 👍", time: "2:36 PM" },
  { id: "d2", sender: "rider", text: "Great, I'm at the gate. Blue shirt.", time: "2:37 PM" },
  { id: "d3", sender: "driver", text: "Got it, pulling up now", time: "2:39 PM" },
];

// ---------------------------------------------------------------------------
// OTP verification — re-exported from single source of truth
// See /config/otp-config.ts for full system architecture
// ---------------------------------------------------------------------------

export const TRIP_OTP = {
  code: START_OTP.code,
  digits: [...START_OTP.digits],
};

export const TRIP_END_OTP = {
  code: END_OTP.code,
  digits: [...END_OTP.digits],
};

// ---------------------------------------------------------------------------
// Driver Wallet (minimum balance required to go online)
// ---------------------------------------------------------------------------
export interface DriverWallet {
  balance: number;
  minimumBalance: number; // set by admin
  currency: string;
  pendingWithdrawal: number;
  lastFunded: string;
  transactions: WalletTransaction[];
}

export interface WalletTransaction {
  id: string;
  type: "credit" | "debit" | "withdrawal" | "commission" | "bonus";
  label: string;
  amount: number;
  timestamp: string;
  reference?: string;
}

export const DRIVER_WALLET: DriverWallet = {
  balance: 3250,
  minimumBalance: 2000, // admin-set: ₦2,000 minimum to go online
  currency: "NGN",
  pendingWithdrawal: 0,
  lastFunded: "Mar 3, 2026",
  transactions: [
    { id: "w1", type: "credit", label: "Wallet top-up", amount: 5000, timestamp: "Mar 3, 11:20 AM", reference: "TXN-83921" },
    { id: "w2", type: "commission", label: "Platform commission", amount: -640, timestamp: "Mar 3, 10:45 AM", reference: "TRP-2847" },
    { id: "w3", type: "credit", label: "Trip earnings (digital)", amount: 3200, timestamp: "Mar 3, 10:44 AM", reference: "TRP-2847" },
    { id: "w4", type: "commission", label: "Platform commission", amount: -480, timestamp: "Mar 2, 6:12 PM", reference: "TRP-2846" },
    { id: "w5", type: "credit", label: "Trip earnings (digital)", amount: 2400, timestamp: "Mar 2, 6:11 PM", reference: "TRP-2846" },
    { id: "w6", type: "bonus", label: "Peak hours bonus", amount: 1500, timestamp: "Mar 2, 3:00 PM" },
    { id: "w7", type: "withdrawal", label: "Withdrawal to GTBank", amount: -15000, timestamp: "Mar 1, 9:00 AM", reference: "WTH-4821" },
    { id: "w8", type: "credit", label: "Wallet top-up", amount: 10000, timestamp: "Feb 28, 2:30 PM", reference: "TXN-83820" },
    { id: "w9", type: "commission", label: "Platform commission", amount: -720, timestamp: "Feb 28, 1:15 PM", reference: "TRP-2845" },
    { id: "w10", type: "credit", label: "Trip earnings (digital)", amount: 3600, timestamp: "Feb 28, 1:14 PM", reference: "TRP-2845" },
  ],
};

/** Low balance if below minimum + 500 buffer */
export function isLowBalance(wallet: DriverWallet): boolean {
  return wallet.balance < wallet.minimumBalance + 500;
}

/** Can't go online if below minimum */
export function canGoOnline(wallet: DriverWallet): boolean {
  return wallet.balance >= wallet.minimumBalance;
}

// ---------------------------------------------------------------------------
// Mock trip requests (incoming ride requests)
// ---------------------------------------------------------------------------
export const MOCK_TRIP_REQUESTS: TripRequest[] = [
  {
    id: "req1",
    rider: {
      name: "Adaobi N.",
      rating: 4.9,
      trips: 312,
      initials: "AN",
    },
    pickup: {
      address: "27B Admiralty Way",
      area: "Lekki Phase 1",
      distanceFromDriver: 1.2,
      etaMinutes: 4,
    },
    destination: {
      address: "The Palms Shopping Mall",
      area: "Lekki",
    },
    estimate: {
      distance: 6.8,
      duration: 15,
      fare: 3200,
      netEarnings: 2560,
    },
    paymentType: "digital",
    vehicleType: "Comfort",
    surgeMultiplier: 1.0,
    timeoutSeconds: 30,
  },
  {
    id: "req2",
    rider: {
      name: "Emeka U.",
      rating: 4.7,
      trips: 89,
      initials: "EU",
    },
    pickup: {
      address: "12 Adeola Odeku St",
      area: "Victoria Island",
      distanceFromDriver: 0.8,
      etaMinutes: 3,
    },
    destination: {
      address: "Murtala Muhammed Airport",
      area: "Ikeja",
    },
    estimate: {
      distance: 22.4,
      duration: 45,
      fare: 8900,
      netEarnings: 7120,
    },
    paymentType: "cash",
    vehicleType: "Comfort",
    surgeMultiplier: 1.5,
    timeoutSeconds: 30,
  },
  {
    id: "req3",
    rider: {
      name: "Blessing O.",
      rating: 4.4,
      trips: 15,
      initials: "BO",
    },
    pickup: {
      address: "3 Bourdillon Road",
      area: "Ikoyi",
      distanceFromDriver: 2.1,
      etaMinutes: 7,
    },
    destination: {
      address: "Circle Mall, Jakande",
      area: "Lekki",
    },
    estimate: {
      distance: 11.2,
      duration: 28,
      fare: 4800,
      netEarnings: 3840,
    },
    paymentType: "digital",
    vehicleType: "EV",
    surgeMultiplier: 1.8,
    timeoutSeconds: 30,
  },
  {
    id: "req4",
    rider: {
      name: "Mr. James Wright",
      rating: 0,     // Guest — no JET rating
      trips: 0,      // Guest — no JET history
      initials: "JW",
    },
    pickup: {
      address: "Eko Hotels & Suites, V.I.",
      area: "Victoria Island",
      distanceFromDriver: 1.5,
      etaMinutes: 5,
    },
    destination: {
      address: "Murtala Muhammed Airport",
      area: "Ikeja",
    },
    estimate: {
      distance: 24.1,
      duration: 50,
      fare: 16200,
      netEarnings: 12960,
    },
    paymentType: "digital",
    vehicleType: "Comfort",
    surgeMultiplier: 1.0,
    timeoutSeconds: 30,
    // Hotel booking fields
    bookingSource: "hotel",
    hotelName: "Eko Hotels & Suites",
    guestName: "Mr. James Wright",
    pickupDetail: "Main Lobby",
    driverNotes: "2 large suitcases, guest checking out. Flight LOS-LHR 1430.",
    flightNumber: "BA-0084",
    roomNumber: "1204",
  },
];