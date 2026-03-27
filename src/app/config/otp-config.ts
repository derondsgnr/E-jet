/**
 * JET OTP — SINGLE SOURCE OF TRUTH
 *
 * All OTP codes across every surface reference this file.
 * No surface may define its own OTP constants.
 *
 * ┌───────────────────────────────────────────────────────────────────────┐
 * │  TWO-OTP SYSTEM                                                      │
 * │                                                                       │
 * │  START OTP (4729)                                                     │
 * │  ├── Rider/Guest shows this code to driver at PICKUP                 │
 * │  ├── Driver enters it to START the trip                              │
 * │  ├── Visible on: Rider app, Guest tracking page, Hotel dashboard     │
 * │  └── Purpose: Confirms right passenger is in the car                 │
 * │                                                                       │
 * │  END OTP (8316)                                                       │
 * │  ├── Rider/Guest shows this code to driver at DESTINATION            │
 * │  ├── Driver enters it to COMPLETE the trip                           │
 * │  ├── Visible on: Rider app, Guest tracking page (proximity-gated)   │
 * │  └── Purpose: Prevents premature trip completion                     │
 * │                                                                       │
 * │  ARRIVAL VERIFICATION (separate from OTP — see below)                │
 * └───────────────────────────────────────────────────────────────────────┘
 *
 * ARRIVAL VERIFICATION STRATEGY:
 *   GPS geofence alone CANNOT end or verify a trip because:
 *   - Nigerian addresses often use landmarks, not exact coordinates
 *   - Maps data can be imprecise (wrong pin, gated estates, etc.)
 *   - Multiple entrances at hotels, malls, airports
 *
 *   Solution: LAYERED verification
 *   1. GPS geofence (150m) = SIGNAL, not trigger
 *      → If driver within geofence: green "Near pickup" badge
 *      → If driver taps "arrived" outside geofence: soft warning + allow
 *      → Repeated violations flagged for admin review
 *   2. Driver taps "I've arrived" = primary trigger
 *   3. OTP exchange = final handshake (passenger confirmed in car)
 *
 * Data sources:
 *   - START OTP → generated per trip in trips.start_otp (4-digit)
 *   - END OTP → generated per trip in trips.end_otp (4-digit)
 *   - Geofence → calculated from trips.pickup_lat/lng vs driver GPS
 *   - In production: codes are random per trip. Mock uses fixed codes.
 *
 * Consumers:
 *   - /components/rider/booking-data.ts (re-exports)
 *   - /components/driver/driver-data.ts (re-exports)
 *   - /views/hotel-book-ride.tsx (imports directly)
 *   - /views/guest-tracking.tsx (imports directly)
 */

// ── Start OTP ──────────────────────────────────────────────────────────────
// Rider/Guest → Driver at PICKUP

export const START_OTP = {
  code: "4729",
  displayCode: "4 7 2 9",
  digits: [4, 7, 2, 9] as const,
};

// ── End OTP ────────────────────────────────────────────────────────────────
// Rider/Guest → Driver at DESTINATION

export const END_OTP = {
  code: "8316",
  displayCode: "8 3 1 6",
  digits: [8, 3, 1, 6] as const,
};

// ── Geofence config ────────────────────────────────────────────────────────

export const GEOFENCE = {
  /** Radius in meters — driver considered "near" when within this range */
  radiusMeters: 150,
  /** OTP proximity reveal — end OTP shown when driver within this range of destination */
  otpRevealRadiusMeters: 500,
  /** Number of out-of-geofence "arrived" taps before admin flag */
  anomalyThreshold: 3,
};

// ── Tracking link config ───────────────────────────────────────────────────

export const TRACKING_LINK = {
  /** Token format: UUID v4, cryptographically random */
  tokenFormat: "uuid-v4" as const,
  /** Minutes after trip completion before link expires */
  expiryMinutesPostTrip: 30,
  /** Example token for demo */
  mockToken: "a8f2c1e7-9d4b-4f2a-b8c3-1e5f7a2d9b4c",
  /** Short token for SMS display */
  mockShortToken: "a8f2c1",
};

// ── Reassignment config ────────────────────────────────────────────────────

export const REASSIGNMENT = {
  /** Seconds to wait for a new driver before notifying hotel to rebook */
  timeoutSeconds: 300,
  /** Max auto-reassignment attempts */
  maxAttempts: 3,
};
