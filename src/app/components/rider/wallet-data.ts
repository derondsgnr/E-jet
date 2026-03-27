 /**
 * Wallet mock data — transactions, payment methods, send recipients.
 * Extracted to keep screen + sheet files lean.
 */

import {
  CreditCard,
  Banknote,
  type LucideIcon,
} from "lucide-react";

// ---------------------------------------------------------------------------
// Payment Methods
// ---------------------------------------------------------------------------
export interface PaymentMethod {
  id: string;
  icon: LucideIcon;
  label: string;
  detail: string;
  isDefault: boolean;
  type: "card" | "cash" | "bank";
  /** For card type — last 4 digits */
  last4?: string;
  /** Card network */
  network?: "visa" | "mastercard" | "verve";
}

export const PAYMENT_METHODS: PaymentMethod[] = [
  {
    id: "pm-1",
    icon: CreditCard,
    label: "Visa •••• 4821",
    detail: "Expires 09/27",
    isDefault: true,
    type: "card",
    last4: "4821",
    network: "visa",
  },
  {
    id: "pm-2",
    icon: CreditCard,
    label: "Mastercard •••• 7392",
    detail: "Expires 03/26",
    isDefault: false,
    type: "card",
    last4: "7392",
    network: "mastercard",
  },
  {
    id: "pm-3",
    icon: Banknote,
    label: "Cash",
    detail: "Pay driver directly",
    isDefault: false,
    type: "cash",
  },
];

// ---------------------------------------------------------------------------
// Transactions
// ---------------------------------------------------------------------------
export type TxType = "debit" | "credit";
export type TxCategory = "ride" | "topup" | "referral" | "send" | "promo";
export type TxStatus = "success" | "pending" | "failed" | "refunded";

/** Fare breakdown for ride transactions */
export interface FareBreakdown {
  baseFare: string;
  distance: string;
  time: string;
  surge?: string;
  discount?: string;
  total: string;
}

/** Trip context for ride transactions */
export interface TripContext {
  driverName: string;
  driverInitials: string;
  vehicle: string;
  /** e.g. "Toyota Camry · LSR 284 KJ" */
  durationMin: number;
  distanceKm: number;
  isEV?: boolean;
}

export interface Transaction {
  id: string;
  label: string;
  amount: string;
  /** Raw amount for sorting/display */
  rawAmount: number;
  time: string;
  date: string;
  /** Full precise timestamp for detail view */
  fullDate: string;
  type: TxType;
  category: TxCategory;
  status: TxStatus;
  /** For rides — origin/destination */
  route?: { from: string; to: string };
  /** Payment method used */
  methodLabel?: string;
  /** Reference ID */
  ref: string;
  /** Fare breakdown (rides only) */
  breakdown?: FareBreakdown;
  /** Trip context (rides only) */
  trip?: TripContext;
}

export const TRANSACTIONS: Transaction[] = [
  {
    id: "tx-1",
    label: "Ride to Lekki Phase 1",
    amount: "-₦3,200",
    rawAmount: -3200,
    time: "2:15 PM",
    date: "Today",
    fullDate: "Tue, 4 Mar 2026, 2:15 PM",
    type: "debit",
    category: "ride",
    status: "success",
    route: { from: "Victoria Island", to: "Lekki Phase 1" },
    methodLabel: "Visa •••• 4821",
    ref: "JET-2026-A8F3K2",
    breakdown: {
      baseFare: "₦800",
      distance: "₦1,600",
      time: "₦480",
      surge: "₦320",
      total: "₦3,200",
    },
    trip: {
      driverName: "Adebayo K.",
      driverInitials: "AK",
      vehicle: "Toyota Camry · LSR 284 KJ",
      durationMin: 22,
      distanceKm: 8.4,
    },
  },
  {
    id: "tx-2",
    label: "Wallet top-up",
    amount: "+₦10,000",
    rawAmount: 10000,
    time: "1:00 PM",
    date: "Today",
    fullDate: "Tue, 4 Mar 2026, 1:00 PM",
    type: "credit",
    category: "topup",
    status: "success",
    methodLabel: "Visa •••• 4821",
    ref: "JET-2026-T9D1L7",
  },
  {
    id: "tx-3",
    label: "Ride to Ikeja City Mall",
    amount: "-₦5,800",
    rawAmount: -5800,
    time: "4:30 PM",
    date: "Yesterday",
    fullDate: "Mon, 3 Mar 2026, 4:30 PM",
    type: "debit",
    category: "ride",
    status: "success",
    route: { from: "Surulere", to: "Ikeja City Mall" },
    methodLabel: "Wallet",
    ref: "JET-2026-R2M8P5",
    breakdown: {
      baseFare: "₦800",
      distance: "₦3,200",
      time: "₦1,200",
      surge: "₦600",
      total: "₦5,800",
    },
    trip: {
      driverName: "Emeka N.",
      driverInitials: "EN",
      vehicle: "Kia EV6 · APP 117 MU",
      durationMin: 38,
      distanceKm: 14.2,
      isEV: true,
    },
  },
  {
    id: "tx-4",
    label: "Referral bonus",
    amount: "+₦500",
    rawAmount: 500,
    time: "10:00 AM",
    date: "Mon",
    fullDate: "Mon, 3 Mar 2026, 10:00 AM",
    type: "credit",
    category: "referral",
    status: "success",
    ref: "JET-2026-B3N6Q1",
  },
  {
    id: "tx-5",
    label: "Ride to Victoria Island",
    amount: "-₦2,800",
    rawAmount: -2800,
    time: "6:45 PM",
    date: "Sun",
    fullDate: "Sun, 2 Mar 2026, 6:45 PM",
    type: "debit",
    category: "ride",
    status: "success",
    route: { from: "Ikoyi", to: "Victoria Island" },
    methodLabel: "Mastercard •••• 7392",
    ref: "JET-2026-R7K4W9",
    breakdown: {
      baseFare: "₦800",
      distance: "₦1,200",
      time: "₦400",
      discount: "-₦200",
      total: "₦2,800",
    },
    trip: {
      driverName: "Fatima B.",
      driverInitials: "FB",
      vehicle: "Honda Accord · KTU 892 AE",
      durationMin: 14,
      distanceKm: 4.1,
    },
  },
  {
    id: "tx-6",
    label: "Sent to Adaeze O.",
    amount: "-₦2,000",
    rawAmount: -2000,
    time: "3:20 PM",
    date: "Sat",
    fullDate: "Sat, 1 Mar 2026, 3:20 PM",
    type: "debit",
    category: "send",
    status: "success",
    ref: "JET-2026-S1P5V8",
  },
  {
    id: "tx-7",
    label: "Promo credit",
    amount: "+₦1,500",
    rawAmount: 1500,
    time: "12:00 PM",
    date: "Fri",
    fullDate: "Fri, 28 Feb 2026, 12:00 PM",
    type: "credit",
    category: "promo",
    status: "success",
    ref: "JET-2026-P4C2X6",
  },
  {
    id: "tx-8",
    label: "Ride to Ajah",
    amount: "-₦4,200",
    rawAmount: -4200,
    time: "9:10 AM",
    date: "Fri",
    fullDate: "Fri, 28 Feb 2026, 9:10 AM",
    type: "debit",
    category: "ride",
    status: "success",
    route: { from: "Lekki Phase 1", to: "Ajah" },
    methodLabel: "Wallet",
    ref: "JET-2026-R8H3Y7",
    breakdown: {
      baseFare: "₦800",
      distance: "₦2,400",
      time: "₦600",
      surge: "₦400",
      total: "₦4,200",
    },
    trip: {
      driverName: "Ibrahim M.",
      driverInitials: "IM",
      vehicle: "Tesla Model 3 · LND 503 BG",
      durationMin: 28,
      distanceKm: 11.6,
      isEV: true,
    },
  },
  {
    id: "tx-9",
    label: "Wallet top-up",
    amount: "+₦5,000",
    rawAmount: 5000,
    time: "8:00 AM",
    date: "Thu",
    fullDate: "Thu, 27 Feb 2026, 8:00 AM",
    type: "credit",
    category: "topup",
    status: "success",
    methodLabel: "Mastercard •••• 7392",
    ref: "JET-2026-T2F9Z4",
  },
  {
    id: "tx-10",
    label: "Ride to Maryland Mall",
    amount: "-₦3,600",
    rawAmount: -3600,
    time: "5:15 PM",
    date: "Wed",
    fullDate: "Wed, 26 Feb 2026, 5:15 PM",
    type: "debit",
    category: "ride",
    status: "success",
    route: { from: "Yaba", to: "Maryland Mall" },
    methodLabel: "Visa •••• 4821",
    ref: "JET-2026-R5G1M3",
    breakdown: {
      baseFare: "₦800",
      distance: "₦1,800",
      time: "₦600",
      discount: "-₦200",
      total: "₦3,600",
    },
    trip: {
      driverName: "Oluchi E.",
      driverInitials: "OE",
      vehicle: "Hyundai Ioniq 5 · KRD 019 FH",
      durationMin: 19,
      distanceKm: 7.8,
      isEV: true,
    },
  },
];

/** First 5 for the "Recent" preview */
export const RECENT_TRANSACTIONS = TRANSACTIONS.slice(0, 5);

// ---------------------------------------------------------------------------
// Top-up
// ---------------------------------------------------------------------------
export const TOP_UP_AMOUNTS = ["₦2,000", "₦5,000", "₦10,000", "₦20,000"];

// ---------------------------------------------------------------------------
// Send recipients (recent)
// ---------------------------------------------------------------------------
export interface SendRecipient {
  id: string;
  name: string;
  phone: string;
  initials: string;
}

export const RECENT_RECIPIENTS: SendRecipient[] = [
  { id: "r-1", name: "Adaeze O.", phone: "+234 812 ***  4521", initials: "AO" },
  { id: "r-2", name: "Chidi K.", phone: "+234 803 *** 8912", initials: "CK" },
  { id: "r-3", name: "Funke A.", phone: "+234 705 *** 3347", initials: "FA" },
];

export const WALLET_BALANCE = "₦14,500";
export const WALLET_BALANCE_RAW = 14500;
