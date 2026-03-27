 /**
 * ============================================================================
 * INFORMATION ARCHITECTURE
 * ============================================================================
 *
 * Navigation structure and screen inventory for each user type.
 * This drives the routing, sidebar, and cross-platform nav design.
 *
 * RIDER (Mobile-first)
 * --------------------
 * - Home (map + request)
 * - Ride in progress
 * - Ride history
 * - Payment methods
 * - Profile & settings
 * - Support
 *
 * DRIVER (Mobile-first)
 * ---------------------
 * - Home (online/offline toggle + map)
 * - Ride request (incoming)
 * - Active ride (navigation)
 * - Earnings dashboard
 * - Ride history
 * - Profile & vehicle
 * - Settings
 *
 * FLEET OWNER (Web-first)
 * -----------------------
 * - Fleet overview (drivers, vehicles, utilization)
 * - Driver roster (manage employed/contracted drivers)
 * - Vehicle management (registry, maintenance, EV tracking)
 * - Earnings & payouts (aggregated from driver trips)
 * - Performance metrics
 * - Support (raise cases with JET)
 * - Settings & profile
 *
 * HOTEL (Web-first)
 * -----------------
 * - Booking dashboard (book rides for guests)
 * - Active rides (track guest trips in real-time)
 * - Booking history (all guest rides)
 * - Billing & invoicing (corporate account)
 * - Guest management (frequent guests, preferences)
 * - API integration (keys, webhooks, docs)
 * - Support (raise cases with JET)
 * - Settings & profile
 *
 * ADMIN (Web-first) — Central nervous system
 * -------------------------------------------
 *
 *   OPERATIONS
 *   ├── Command Center — Live overview, decision queue, KPIs, map
 *   ├── Rides — All trips (rider-booked + hotel-booked), live + historical
 *   ├── Disputes — Ride-level conflicts (rider↔driver, hotel↔driver)
 *   └── Support — B2B cases from fleet owners + hotels
 *
 *   PEOPLE
 *   ├── Riders — Consumer accounts, trip history, disputes
 *   └── Drivers — Verification, profiles, fleet affiliation
 *
 *   PARTNERS
 *   ├── Hotels — B2B demand-side (accounts, bookings, billing, API)
 *   └── Fleet — B2B supply-side (owners, vehicles, payouts, performance)
 *
 *   BUSINESS
 *   ├── Finance — All money flows (rider→JET→driver/fleet, hotel→JET)
 *   └── Analytics — Cross-platform metrics, partner performance
 *
 *   SYSTEM
 *   ├── Communications — Broadcasts, partner announcements
 *   └── Settings — Config, admin users, pricing, integrations
 *
 * WEBSITE / LANDING
 * -----------------
 * - Marketing, onboarding, trust-building, app store links
 * - Driver signup
 * - Fleet owner application
 * - Hotel partnership inquiry
 *
 * ============================================================================
 *
 * ENTITY GOVERNANCE (who manages whom):
 *
 *   Admin → Riders (direct)
 *   Admin → Drivers (direct)
 *   Admin → Fleet Owners (B2B partnership)
 *   Admin → Hotels (B2B partnership)
 *   Fleet Owner → Their Drivers (employment, via fleet dashboard)
 *   Fleet Owner → Their Vehicles (ownership, via fleet dashboard)
 *   Hotel → Guest Rides (booking, via hotel dashboard)
 *
 * The admin can see and act on everything.
 * Fleet owners and hotels can only see their own scope.
 *
 * ============================================================================
 */

export {};
