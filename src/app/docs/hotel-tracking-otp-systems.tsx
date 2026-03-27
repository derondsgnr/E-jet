/**
 * ┌─────────────────────────────────────────────────────────────────────────┐
 * │  HOTEL LIVE TRACKING + GUEST SHARING + OTP SYSTEM DESIGN              │
 * │  Cross-surface systems architecture                                    │
 * │  Date: 17 Mar 2026                                                     │
 * └─────────────────────────────────────────────────────────────────────────┘
 *
 *
 * ══════════════════════════════════════════════════════════════════════════
 * 1. THE PROBLEM SPACE
 * ══════════════════════════════════════════════════════════════════════════
 *
 * Three actors, three surfaces, one trip:
 *
 *   ┌──────────────┐     ┌──────────────┐     ┌──────────────┐
 *   │   CONCIERGE  │     │    GUEST     │     │   DRIVER     │
 *   │  (Hotel Web) │     │ (SMS Link)   │     │ (Driver App) │
 *   └──────┬───────┘     └──────┬───────┘     └──────┬───────┘
 *          │ Books ride         │ Receives link       │ Gets request
 *          │ Tracks live        │ Tracks live          │ Sees hotel badge
 *          │ Sees OTP           │ Sees OTP             │ Enters OTP
 *          │ Can cancel         │ Can call driver      │ Navigates
 *          └────────────────────┴─────────────────────┘
 *
 *
 * ══════════════════════════════════════════════════════════════════════════
 * 2. LIVE TRACKING (Hotel Dashboard)
 * ══════════════════════════════════════════════════════════════════════════
 *
 * After "Confirm — Book ride" → Matching → Driver Assigned:
 *
 *   ┌────────────────────────────────────────────────┐
 *   │  TRACKING VIEW (replaces assigned card)        │
 *   │                                                │
 *   │  ┌──────────────────────────────────────────┐  │
 *   │  │        LIVE MAP STRIP (30%)              │  │
 *   │  │  • Animated driver marker (pulsing dot)  │  │
 *   │  │  • Route line: green dashed              │  │
 *   │  │  • Pickup pin + Destination pin          │  │
 *   │  └──────────────────────────────────────────┘  │
 *   │                                                │
 *   │  STATUS BAR                                    │
 *   │  ┌──────┬──────┬──────┬──────┐                │
 *   │  │  ●   │  ○   │  ○   │  ○   │                │
 *   │  │En    │At    │In    │Done  │                │
 *   │  │route │pickup│trip  │      │                │
 *   │  └──────┴──────┴──────┴──────┘                │
 *   │                                                │
 *   │  DRIVER CARD                                   │
 *   │  [Avatar] Emeka Nwosu ★ 4.9                   │
 *   │  Toyota Camry 2024 · LND-458-KJ               │
 *   │  ETA: 4 min                                    │
 *   │                                                │
 *   │  ┌────────────┐  ┌────────────┐               │
 *   │  │ 📞 Call    │  │ 💬 Message │               │
 *   │  └────────────┘  └────────────┘               │
 *   │                                                │
 *   │  GUEST INFO                                    │
 *   │  Mr. James Wright · Room 1204                  │
 *   │  +234 801 234 5678                             │
 *   │  Eko Hotels (Main Lobby) → Airport             │
 *   │                                                │
 *   │  OTP CARD                                      │
 *   │  ┌──────────────────────────────┐              │
 *   │  │  Trip verification code     │              │
 *   │  │  ┌───┬───┬───┬───┐         │              │
 *   │  │  │ 8 │ 3 │ 1 │ 6 │         │              │
 *   │  │  └───┴───┴───┴───┘         │              │
 *   │  │  Guest shows this to driver │              │
 *   │  └──────────────────────────────┘              │
 *   │                                                │
 *   │  [Share tracking with guest]  [Cancel ride]    │
 *   └────────────────────────────────────────────────┘
 *
 *
 * STATUS PROGRESSION (auto-advance in demo):
 *   en_route_to_pickup → arrived_at_pickup → in_trip → completed
 *   (mirrors driver's active-trip.tsx phases)
 *
 *
 * ══════════════════════════════════════════════════════════════════════════
 * 3. GUEST TRACKING PAGE (Public — No Auth)
 * ══════════════════════════════════════════════════════════════════════════
 *
 * URL: /track/{token}
 *
 * SMS sent to guest:
 *   "Your JET ride is on the way! Driver: Emeka in Toyota Camry
 *    (LND-458-KJ). Track live: jet.ng/track/a8f2c1
 *    Verification code: 8316 — show this to your driver."
 *
 * The page shows:
 *
 *   ┌────────────────────────────────────────────┐
 *   │  JET logo                                  │
 *   │                                            │
 *   │  ┌────────────────────────────────────┐    │
 *   │  │        LIVE MAP (full width)       │    │
 *   │  │   [Driver dot pulsing]             │    │
 *   │  └────────────────────────────────────┘    │
 *   │                                            │
 *   │  STATUS: Driver is on the way              │
 *   │  ┌──────┬──────┬──────┬──────┐            │
 *   │  │  ●   │  ○   │  ○   │  ○   │            │
 *   │  └──────┴──────┴──────┴──────┘            │
 *   │                                            │
 *   │  YOUR DRIVER                               │
 *   │  [Avatar] Emeka Nwosu ★ 4.9               │
 *   │  Toyota Camry 2024 · LND-458-KJ           │
 *   │  ETA: 4 min                                │
 *   │                                            │
 *   │  [📞 Call driver]                          │
 *   │                                            │
 *   │  VERIFICATION CODE                         │
 *   │  ┌───┬───┬───┬───┐                        │
 *   │  │ 8 │ 3 │ 1 │ 6 │                        │
 *   │  └───┴───┴───┴───┘                        │
 *   │  Show this code to your driver             │
 *   │                                            │
 *   │  TRIP DETAILS                              │
 *   │  Pickup: Eko Hotels (Main Lobby)           │
 *   │  Destination: Murtala Muhammed Airport     │
 *   │  Vehicle: JetComfort                       │
 *   │                                            │
 *   │  Powered by JET                            │
 *   └────────────────────────────────────────────┘
 *
 * KEY DECISIONS:
 *   ✓ No registration required — token-based access
 *   ✓ Token expires after trip completion + 30 min
 *   ✓ Read-only: guest can ONLY view + call driver
 *   ✓ Mobile-first responsive layout
 *   ✓ Works in any mobile browser (SMS → browser)
 *
 *
 * ══════════════════════════════════════════════════════════════════════════
 * 4. OTP SYSTEM — HOTEL BOOKING ADAPTATION
 * ══════════════════════════════════════════════════════════════════════════
 *
 * CURRENT SYSTEM (Rider App):
 *   1. Rider books ride via app
 *   2. After trip starts, app shows trip-end OTP
 *   3. At destination, rider reads OTP to driver
 *   4. Driver enters OTP → trip marked complete
 *   5. Purpose: prevent premature trip completion
 *
 * PROBLEM WITH HOTEL BOOKINGS:
 *   - Guest doesn't have the app
 *   - Concierge booked on their behalf
 *   - Guest might be a tourist with no data plan
 *
 * SOLUTION: TRIPLE-CHANNEL OTP DELIVERY
 *
 *   ┌─────────────────────────────────────────────────────────┐
 *   │  Channel 1: SMS                                         │
 *   │  OTP included in the tracking SMS sent to guest         │
 *   │  "...Verification code: 8316 — show this to driver"    │
 *   │  Works even without internet (SMS is offline-capable)   │
 *   ├─────────────────────────────────────────────────────────┤
 *   │  Channel 2: Guest Tracking Page                         │
 *   │  OTP displayed prominently on /track/{token}            │
 *   │  Guest can access anytime during trip                   │
 *   │  Requires internet but no app installation              │
 *   ├─────────────────────────────────────────────────────────┤
 *   │  Channel 3: Hotel Dashboard                             │
 *   │  OTP visible on tracking view to concierge              │
 *   │  Fallback: concierge can relay OTP to guest via         │
 *   │  room phone, WhatsApp, or at checkout                   │
 *   └─────────────────────────────────────────────────────────┘
 *
 * FLOW:
 *   1. Concierge books ride → system generates OTP
 *   2. OTP sent to guest via SMS (Channel 1)
 *   3. OTP displayed on tracking page (Channel 2)
 *   4. OTP visible on hotel dashboard (Channel 3)
 *   5. At destination: guest shows OTP to driver from ANY channel
 *   6. Driver enters OTP → trip completes → hotel charged
 *
 * EDGE CASES:
 *   - Guest lost phone → concierge relays OTP (Channel 3)
 *   - No SMS delivery → guest uses tracking link (Channel 2)
 *   - No internet at all → concierge calls guest OTP (Channel 3)
 *   - Driver disputes → admin sees all 3 delivery timestamps
 *
 * DATA MODEL:
 *   trip_otp {
 *     trip_id       → trips.id
 *     code          → 4-digit string
 *     sms_sent_at   → timestamp (Channel 1)
 *     sms_delivered  → boolean
 *     page_viewed_at → timestamp (Channel 2)
 *     hotel_viewed_at→ timestamp (Channel 3)
 *     verified_at   → timestamp (when driver entered correct OTP)
 *     verified_via   → 'guest_sms' | 'tracking_page' | 'hotel_relay'
 *   }
 *
 *
 * ══════════════════════════════════════════════════════════════════════════
 * 5. DRIVER SURFACE — HOTEL BOOKING HANDLING
 * ══════════════════════════════════════════════════════════════════════════
 *
 * CURRENT STATE: ❌ No hotel awareness
 *   - TripRequest has no hotel/booking_source field
 *   - Driver sees hotel guests as regular riders
 *   - No "hotel badge" or pickup instructions
 *   - Payment shows "digital" — no hotel account indicator
 *
 * WHAT CHANGES:
 *
 * ┌───┬──────────────────────┬─────────────────────────────────┐
 * │ # │ Driver Surface Change │ Why                             │
 * ├───┼──────────────────────┼─────────────────────────────────┤
 * │ 1 │ booking_source field  │ TripRequest gains               │
 * │   │ on TripRequest        │ bookingSource?: 'hotel'         │
 * │   │                       │ hotelName?: string              │
 * │   │                       │ guestName?: string              │
 * │   │                       │ pickupDetail?: string           │
 * │   │                       │ notes?: string                  │
 * ├───┼──────────────────────┼─────────────────────────────────┤
 * │ 2 │ Hotel badge on        │ 🏨 badge on trip request card   │
 * │   │ incoming request      │ "Hotel booking · Eko Hotels"    │
 * │   │                       │ Signals guaranteed payment      │
 * ├───┼──────────────────────┼─────────────────────────────────┤
 * │ 3 │ Guest name replaces   │ "Pick up Mr. James Wright"      │
 * │   │ rider name            │ instead of "Pick up Adaobi N."  │
 * │   │                       │ Different avatar treatment       │
 * ├───┼──────────────────────┼─────────────────────────────────┤
 * │ 4 │ Pickup instructions   │ "Eko Hotels — Main Lobby"       │
 * │   │                       │ Sub-location is critical for     │
 * │   │                       │ large hotel properties           │
 * ├───┼──────────────────────┼─────────────────────────────────┤
 * │ 5 │ Payment badge         │ Shows "Hotel account" instead    │
 * │   │                       │ of "Cash/Digital". Driver knows  │
 * │   │                       │ payment is guaranteed.           │
 * ├───┼──────────────────────┼─────────────────────────────────┤
 * │ 6 │ Notes from concierge  │ "2 large suitcases" etc.        │
 * │   │                       │ Displayed below pickup address   │
 * ├───┼──────────────────────┼─────────────────────────────────┤
 * │ 7 │ OTP awareness         │ OTP flow unchanged — driver      │
 * │   │                       │ still enters code at destination │
 * │   │                       │ Guest shows OTP from SMS/link    │
 * │   │                       │ instead of from app              │
 * └───┴──────────────────────┴─────────────────────────────────┘
 *
 * MOCK DATA ADDITION:
 *   A 4th trip request in MOCK_TRIP_REQUESTS with hotel booking fields.
 *
 *
 * ══════════════════════════════════════════════════════════════════════════
 * 6. BUILD PLAN
 * ══════════════════════════════════════════════════════════════════════════
 *
 * ┌───┬──────────────────────────────┬──────────────────────────────────┐
 * │ # │ File                          │ What                             │
 * ├───┼──────────────────────────────┼──────────────────────────────────┤
 * │ 1 │ hotel-book-ride.tsx          │ Add tracking stage after         │
 * │   │                              │ assigned (live tracking view)    │
 * ├───┼──────────────────────────────┼──────────────────────────────────┤
 * │ 2 │ guest-tracking.tsx           │ Public guest tracking page       │
 * │   │ (new route: /track/:token)   │ No auth, mobile-first           │
 * ├───┼──────────────────────────────┼──────────────────────────────────┤
 * │ 3 │ driver-data.ts              │ Add hotel fields to TripRequest  │
 * │   │                              │ Add hotel mock trip request      │
 * ├───┼──────────────────────────────┼──────────────────────────────────┤
 * │ 4 │ trip-request.tsx             │ Hotel badge, guest name,         │
 * │   │                              │ pickup detail, notes display     │
 * ├───┼──────────────────────────────┼──────────────────────────────────┤
 * │ 5 │ active-trip.tsx              │ Hotel badge persistence in       │
 * │   │                              │ active trip view                 │
 * ├───┼──────────────────────────────┼──────────────────────────────────┤
 * │ 6 │ routes.tsx                   │ Add /track/:token route          │
 * └───┴──────────────────────────────┴──────────────────────────────────┘
 *
 *
 * ══════════════════════════════════════════════════════════════════════════
 * 7. SHARE EXPERIENCE FLOW
 * ══════════════════════════════════════════════════════════════════════════
 *
 *   ┌────────────────────────────────────────────────────────────┐
 *   │  1. Concierge taps "Share tracking with guest"             │
 *   │     ↓                                                       │
 *   │  2. SHARE MODAL appears:                                    │
 *   │     ┌──────────────────────────────────────────────┐       │
 *   │     │  Share ride tracking                         │       │
 *   │     │                                              │       │
 *   │     │  Guest: Mr. James Wright                     │       │
 *   │     │  Phone: +234 801 234 5678                    │       │
 *   │     │                                              │       │
 *   │     │  The guest will receive:                     │       │
 *   │     │  ✓ Live tracking link                        │       │
 *   │     │  ✓ Driver details                            │       │
 *   │     │  ✓ Trip verification code (OTP)              │       │
 *   │     │                                              │       │
 *   │     │  SMS Preview:                                │       │
 *   │     │  ┌────────────────────────────────────┐      │       │
 *   │     │  │ Your JET ride is on the way!       │      │       │
 *   │     │  │ Driver: Emeka · Toyota Camry       │      │       │
 *   │     │  │ LND-458-KJ · ETA: 4 min           │      │       │
 *   │     │  │ Track: jet.ng/track/a8f2c1         │      │       │
 *   │     │  │ Code: 8316                         │      │       │
 *   │     │  └────────────────────────────────────┘      │       │
 *   │     │                                              │       │
 *   │     │  [Send SMS]          [Copy link]             │       │
 *   │     └──────────────────────────────────────────────┘       │
 *   │     ↓                                                       │
 *   │  3. Toast: "Tracking details sent to guest via SMS"         │
 *   │     Status badge on tracking view: "SMS sent ✓"             │
 *   └────────────────────────────────────────────────────────────┘
 *
 */

export {};
