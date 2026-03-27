/**
 * Shared mock data for the Ride Booking flow.
 * Vehicle types, driver profiles, trip details — same data, three presentations.
 */

import { START_OTP, END_OTP } from "../../config/otp-config";

// ---------------------------------------------------------------------------
// Flow stages
// ---------------------------------------------------------------------------
export type BookingStage =
  | "vehicle-select"
  | "matching"
  | "driver-assigned"
  | "driver-arriving"
  | "pickup-otp"
  | "in-progress"
  | "complete";

export const STAGE_ORDER: BookingStage[] = [
  "vehicle-select",
  "matching",
  "driver-assigned",
  "driver-arriving",
  "pickup-otp",
  "in-progress",
  "complete",
];

// ---------------------------------------------------------------------------
// Vehicle types
// ---------------------------------------------------------------------------
export interface VehicleType {
  id: string;
  name: string;
  description: string;
  capacity: number;
  eta: string;
  fare: string;
  fareNum: number;
  isEV: boolean;
  /** Savings vs gas equivalent — only for EV */
  savings?: string;
  icon: "car" | "car-ev" | "car-xl" | "car-lux";
}

export const vehicleTypes: VehicleType[] = [
  {
    id: "jet-go",
    name: "JetGo",
    description: "Affordable everyday rides",
    capacity: 4,
    eta: "4 min",
    fare: "₦2,800",
    fareNum: 2800,
    isEV: false,
    icon: "car",
  },
  {
    id: "jet-ev",
    name: "JetEV",
    description: "Zero emissions, lower fare",
    capacity: 4,
    eta: "6 min",
    fare: "₦2,400",
    fareNum: 2400,
    isEV: true,
    savings: "Save ₦400",
    icon: "car-ev",
  },
  {
    id: "jet-comfort",
    name: "JetComfort",
    description: "Extra legroom, newer cars",
    capacity: 4,
    eta: "5 min",
    fare: "₦3,800",
    fareNum: 3800,
    isEV: false,
    icon: "car",
  },
  {
    id: "jet-xl",
    name: "JetXL",
    description: "6-seater for groups",
    capacity: 6,
    eta: "8 min",
    fare: "₦5,200",
    fareNum: 5200,
    isEV: false,
    icon: "car-xl",
  },
  {
    id: "jet-lux",
    name: "JetLux",
    description: "Premium experience",
    capacity: 4,
    eta: "10 min",
    fare: "₦8,500",
    fareNum: 8500,
    isEV: false,
    icon: "car-lux",
  },
];

// ---------------------------------------------------------------------------
// Route / trip
// ---------------------------------------------------------------------------
export interface TripRoute {
  pickup: { name: string; address: string };
  dropoff: { name: string; address: string };
  distance: string;
  duration: string;
  /** Polyline points for route preview (normalized 0-1) */
  routePath: string;
}

export const mockRoute: TripRoute = {
  pickup: {
    name: "Current location",
    address: "12 Bourdillon Rd, Ikoyi",
  },
  dropoff: {
    name: "Lekki Phase 1",
    address: "Admiralty Way, Lekki Phase 1",
  },
  distance: "6.8 km",
  duration: "12 min",
  routePath:
    "M 200 650 C 210 580, 180 520, 200 450 S 240 380, 220 300 S 190 240, 200 180",
};

// ---------------------------------------------------------------------------
// Driver
// ---------------------------------------------------------------------------
export interface DriverProfile {
  name: string;
  rating: number;
  trips: number;
  vehicle: string;
  plate: string;
  color: string;
  etaToPickup: string;
  avatarInitials: string;
  isEV: boolean;
}

export const mockDriver: DriverProfile = {
  name: "Adebayo K.",
  rating: 4.92,
  trips: 2847,
  vehicle: "BYD Atto 3",
  plate: "LG-234-KJA",
  color: "White",
  etaToPickup: "4 min",
  avatarInitials: "AK",
  isEV: true,
};

// ---------------------------------------------------------------------------
// Completed trip
// ---------------------------------------------------------------------------
export interface CompletedTrip {
  fare: string;
  fareBreakdown: { label: string; amount: string }[];
  paymentMethod: string;
  durationActual: string;
  distanceActual: string;
  pickupTime: string;
  dropoffTime: string;
  /** CO₂ saved in kg (EV trips only) */
  carbonSavedKg: number | null;
  isEV: boolean;
}

export const mockCompletedTrip: CompletedTrip = {
  fare: "₦3,200",
  fareBreakdown: [
    { label: "Base fare", amount: "₦500" },
    { label: "Distance (6.8 km)", amount: "₦1,900" },
    { label: "Time (12 min)", amount: "₦600" },
    { label: "Service fee", amount: "₦200" },
  ],
  paymentMethod: "Visa •••• 4821",
  durationActual: "14 min",
  distanceActual: "7.1 km",
  pickupTime: "2:34 PM",
  dropoffTime: "2:48 PM",
  carbonSavedKg: 0.85,
  isEV: true,
};

// ---------------------------------------------------------------------------
// Tip options
// ---------------------------------------------------------------------------
export const tipOptions = [
  { label: "₦200", value: 200 },
  { label: "₦500", value: 500 },
  { label: "₦1,000", value: 1000 },
  { label: "Custom", value: -1 },
];

// ---------------------------------------------------------------------------
// OTP Data — re-exported from single source of truth
// See /config/otp-config.ts for system architecture
// ---------------------------------------------------------------------------

export const mockOTP = {
  code: START_OTP.displayCode,
  digits: [...START_OTP.digits],
};

export const tripEndOTP = {
  code: END_OTP.displayCode,
  digits: [...END_OTP.digits],
};

// ---------------------------------------------------------------------------
// Driver approach states
// ---------------------------------------------------------------------------
export type ApproachState = "assigned" | "en-route" | "arriving" | "here";

export interface ApproachStep {
  id: ApproachState;
  label: string;
  sublabel: string;
  eta?: string;
}

export const approachSteps: ApproachStep[] = [
  { id: "assigned", label: "Driver matched", sublabel: "Adebayo accepted your ride", eta: "4 min" },
  { id: "en-route", label: "On the way", sublabel: "Heading to your pickup", eta: "2 min" },
  { id: "arriving", label: "Almost there", sublabel: "Arriving at pickup point", eta: "< 1 min" },
  { id: "here", label: "Driver arrived", sublabel: "Your driver is waiting" },
];

// ---------------------------------------------------------------------------
// Chat messages (in-ride)
// ---------------------------------------------------------------------------
export interface ChatMessage {
  id: string;
  sender: "rider" | "driver";
  text: string;
  time: string;
}

export const mockChatMessages: ChatMessage[] = [
  { id: "1", sender: "driver", text: "On my way to Lekki Phase 1 now. Traffic is light 👍", time: "2:36 PM" },
  { id: "2", sender: "rider", text: "Great, thank you!", time: "2:37 PM" },
  { id: "3", sender: "driver", text: "Taking the Lekki-Epe expressway, should be smooth", time: "2:39 PM" },
];

// ---------------------------------------------------------------------------
// Carbon savings helpers
// ---------------------------------------------------------------------------
/** Average CO₂ emitted per km for a standard petrol car (grams) */
const CO2_PER_KM_GAS = 120;

/** Calculate CO₂ saved for an EV trip (kg) */
export function calcCarbonSaved(distanceKm: number): number {
  return Math.round((distanceKm * CO2_PER_KM_GAS) / 10) / 100; // kg, 2 decimal places
}