 /**
 * ============================================================================
 * JET ADMIN — COMPLETE PRODUCT ARCHITECTURE
 * ============================================================================
 *
 * Created: March 2026
 * Status: LOCKED — All admin surfaces must align to this blueprint
 *
 * JET is a four-sided platform:
 *   DEMAND: Riders (C2C) + Hotels (B2B)
 *   SUPPLY: Drivers (individuals) + Fleet Owners (B2B)
 *   PLATFORM: JET (the governing layer — this admin)
 *
 * The admin dashboard is JET's central nervous system. It governs ALL entity
 * types, ALL transaction types, ALL partner relationships, and ALL operational
 * decisions across the platform.
 *
 * ============================================================================
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────┐
 * │                                                                         │
 * │   1. ENTITY RELATIONSHIP MODEL                                         │
 * │                                                                         │
 * └─────────────────────────────────────────────────────────────────────────┘
 *
 * ┌──────────────────────── DEMAND SIDE ────────────────────────┐
 * │                                                              │
 * │  RIDER (Consumer)              HOTEL (B2B Partner)           │
 * │  ─────────────────            ─────────────────              │
 * │  · Personal account           · Corporate account            │
 * │  · Pays per ride              · Invoiced monthly             │
 * │  · Files disputes             · Files disputes (for guests)  │
 * │  · Rates drivers              · Rates drivers                │
 * │  · Direct JET user            · API + Dashboard user         │
 * │                                · Books on behalf of guests   │
 * │                                · Guests may not be JET users │
 * └──────────────────────────────┬───────────────────────────────┘
 *                                │
 *                          ┌─────▼─────┐
 *                          │   RIDE    │ ← The transaction
 *                          │ (Trip)    │
 *                          └─────┬─────┘
 *                                │
 * ┌──────────────────────────────▼───────────────────────────────┐
 * │                                                              │
 * │  DRIVER (Individual)          FLEET OWNER (B2B Partner)      │
 * │  ─────────────────            ─────────────────              │
 * │  · Personal account           · Corporate account            │
 * │  · Earns per ride             · Earns via driver commission  │
 * │  · Responds to disputes       · Owns vehicles                │
 * │  · Goes through verification  · Manages driver roster        │
 * │  · May be independent OR      · Responsible for vehicle      │
 * │    fleet-affiliated             condition & maintenance      │
 * │                                · Has own dashboard           │
 * │                                · Payouts aggregated from     │
 * │                                  driver earnings             │
 * └──────────────────────────────────────────────────────────────┘
 *
 *
 * KEY RELATIONSHIPS:
 *
 *   Rider ──requests──▶ Ride ◀──fulfills── Driver
 *   Hotel ──books────▶ Ride (on behalf of guest)
 *   Fleet Owner ──employs──▶ Driver (1:many)
 *   Fleet Owner ──owns──▶ Vehicle (1:many)
 *   Driver ──drives──▶ Vehicle (1:1 at any time)
 *   Driver ──may be──▶ Independent OR Fleet-affiliated
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────┐
 * │                                                                         │
 * │   2. RIDE TAXONOMY — Who initiates rides?                              │
 * │                                                                         │
 * └─────────────────────────────────────────────────────────────────────────┘
 *
 * Every ride has a BOOKING SOURCE:
 *
 *   RIDER-BOOKED (C2C)
 *   · Rider opens app → requests ride → matched to driver
 *   · Payment: rider's card/wallet, per-trip
 *   · Dispute: Rider vs Driver
 *   · Revenue: ride fare × take rate
 *
 *   HOTEL-BOOKED (B2B)
 *   · Hotel dashboard/API → books for guest → matched to driver
 *   · Payment: invoiced to hotel's corporate account, monthly
 *   · Dispute: Hotel vs Driver (hotel as proxy for guest)
 *   · Revenue: ride fare × corporate rate (potentially different take rate)
 *   · Guest may or may not have a JET account
 *   · Guest info may be limited (name, phone — not a full rider profile)
 *
 * The admin must be able to:
 *   · Filter rides by booking source
 *   · See hotel name + guest info on hotel-booked rides
 *   · Handle disputes from both sources with the correct party info
 *   · Track revenue separately by source for financial visibility
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────┐
 * │                                                                         │
 * │   3. DISPUTE TAXONOMY — Who can dispute whom?                          │
 * │                                                                         │
 * └─────────────────────────────────────────────────────────────────────────┘
 *
 * RIDE DISPUTES (trip-level, two parties, evidence-based):
 * ──────────────────────────────────────────────────────────
 *
 *   Type A: RIDER vs DRIVER
 *   · Standard ride dispute — what we have today
 *   · Filed by either party about a specific trip
 *   · Categories: safety, fare, route, payment, service
 *   · Resolution: refund rider, close (favor driver), split
 *
 *   Type B: HOTEL vs DRIVER
 *   · Hotel files on behalf of guest
 *   · Nearly identical structure to Type A
 *   · KEY DIFFERENCES:
 *     - "Rider" column becomes "Hotel + Guest" column
 *     - Guest may have limited profile (no JET account, no rating history)
 *     - Refund goes to hotel's corporate account, not an individual
 *     - Hotel's contract terms may affect resolution options
 *     - Hotel may have a dedicated account manager to notify
 *
 *   Type C: DRIVER vs RIDER (driver-initiated)
 *   · Driver reports rider for damage, abuse, false cancellation
 *   · Same court structure, driver is the initiator
 *   · Resolution: close, flag rider, compensate driver
 *
 *   Type D: DRIVER vs HOTEL-GUEST
 *   · Driver reports hotel guest for damage/abuse
 *   · Hotel is notified as the booking party
 *   · Resolution: close, flag guest, compensate driver, notify hotel
 *
 * B2B CASES (account-level, one party, ticket-based):
 * ──────────────────────────────────────────────────────
 *
 * These are NOT ride disputes. They don't have a "split court."
 * They are support tickets / account issues from B2B partners.
 *
 *   FLEET OWNER CASES:
 *   · "My payout is incorrect" → Finance team investigation
 *   · "Why was my driver deactivated?" → Ops review
 *   · "My vehicle was rejected unfairly" → Verification review
 *   · "Commission rate dispute" → Account management
 *   · "Bulk driver onboarding issue" → Ops support
 *
 *   HOTEL CASES:
 *   · "Our invoice doesn't match ride records" → Finance investigation
 *   · "API integration issue" → Technical support
 *   · "Guest complained about ride quality" → May escalate to ride dispute
 *   · "Contract terms negotiation" → Account management
 *   · "Billing cycle change request" → Finance/Ops
 *
 * The admin handles B2B cases through a SEPARATE surface (Support/Cases),
 * not through the ride dispute queue. If a B2B case reveals a ride-level
 * issue, it gets linked to or spawns a ride dispute.
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────┐
 * │                                                                         │
 * │   4. ADMIN SURFACE ARCHITECTURE                                        │
 * │                                                                         │
 * └─────────────────────────────────────────────────────────────────────────┘
 *
 * Nav Structure:
 *
 *   OPERATIONS
 *   ├── Command Center     Overview, decision queue, live map, KPIs
 *   ├── Rides              All trips (rider + hotel booked), live + historical
 *   ├── Disputes           Ride-level conflicts (all dispute types A-D)
 *   └── Support            B2B cases from fleet owners + hotels
 *
 *   PEOPLE
 *   ├── Riders             Consumer accounts (C2C demand side)
 *   └── Drivers            Supply-side individuals (independent + fleet)
 *
 *   PARTNERS
 *   ├── Hotels             B2B demand-side partners
 *   └── Fleet              B2B supply-side partners (owners + vehicles)
 *
 *   BUSINESS
 *   ├── Finance            All money flows (rider payments, driver payouts,
 *   │                        fleet payouts, hotel billing, platform revenue)
 *   └── Analytics          Cross-platform metrics, partner performance
 *
 *   SYSTEM
 *   ├── Communications     Broadcasts, announcements, partner comms
 *   └── Settings           Config, admin users, pricing, integrations
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────┐
 * │                                                                         │
 * │   5. SURFACE SPECIFICATIONS                                            │
 * │                                                                         │
 * └─────────────────────────────────────────────────────────────────────────┘
 *
 * ── COMMAND CENTER ──────────────────────────────────────────────────────────
 * Status: Built (needs partner metrics extension)
 *
 * What it does today:
 *   · Live operational overview with Nigeria map
 *   · Decision queue (disputes, driver verification, system alerts)
 *   · KPI cards (rides, revenue, supply, demand)
 *   · Geographic drill-down (national → state → zone)
 *
 * What it needs:
 *   · Hotel booking volume in KPIs
 *   · Fleet utilization metrics
 *   · B2B case queue alongside ride dispute queue
 *   · Partner health indicators
 *   · Revenue split: rider-direct vs hotel-booked
 *
 *
 * ── RIDES ───────────────────────────────────────────────────────────────────
 * Status: Placeholder
 *
 * Must handle:
 *   · All trips regardless of booking source
 *   · Booking source indicator (rider | hotel)
 *   · Filter by: source, status, state/zone, date, vehicle type
 *   · Hotel-booked rides show: hotel name, guest name, corporate account
 *   · Rider-booked rides show: rider name, payment method
 *   · Live ride monitoring on map
 *   · Trip detail view with full route, fare breakdown, parties
 *   · Fare audit tools
 *
 *
 * ── DISPUTES ────────────────────────────────────────────────────────────────
 * Status: Built (Types A and C, needs Type B and D extension)
 *
 * Current: Rider ↔ Driver split court with resolution modal
 *
 * Extension needed:
 *   · Dispute type indicator in queue (rider-filed, hotel-filed, driver-filed)
 *   · When hotel-filed: rider column becomes hotel+guest column
 *     - Hotel corporate name, account tier, account manager
 *     - Guest info (name, phone — may be sparse)
 *     - Refund targets hotel corporate account
 *   · When driver is fleet-affiliated: fleet owner context in driver column
 *     - Fleet name, fleet contact
 *     - Option to notify fleet owner of outcome
 *   · Contact drawer handles: rider, driver, hotel, fleet owner
 *   · Resolution options adapt based on dispute type
 *
 *
 * ── SUPPORT ─────────────────────────────────────────────────────────────────
 * Status: Not built (NEW SURFACE)
 *
 * Purpose: B2B account-level cases from fleet owners and hotels
 * Pattern: Linear issue tracker (not split-court)
 *
 * Structure:
 *   · Case queue (filterable by partner type, status, category)
 *   · Case detail view:
 *     - Partner info (fleet owner or hotel account)
 *     - Case category (billing, technical, account, operational)
 *     - Thread (messages, internal notes, attachments)
 *     - Status workflow: open → investigating → pending partner → resolved
 *     - Linked rides or disputes (if applicable)
 *     - Assignee (admin user)
 *   · SLA tracking per case priority
 *   · Escalation path to account management
 *
 *
 * ── RIDERS ──────────────────────────────────────────────────────────────────
 * Status: Placeholder
 *
 * Must handle:
 *   · Rider directory (search, filter, sort)
 *   · Rider profile: trips, spend, rating, disputes, payment methods
 *   · Account actions: suspend, reactivate, issue credit
 *   · Contact rider (push, SMS, email)
 *   · Flag for review
 *
 *
 * ── DRIVERS ─────────────────────────────────────────────────────────────────
 * Status: Built (verification Kanban + command center link)
 *
 * Must also handle:
 *   · Driver directory (search, filter, sort)
 *   · Driver profile: trips, earnings, rating, disputes, vehicle
 *   · Fleet affiliation indicator (independent vs fleet-name)
 *   · Account actions: suspend, reactivate, require re-verification
 *   · Contact driver
 *   · Vehicle assignment history
 *
 *
 * ── HOTELS ──────────────────────────────────────────────────────────────────
 * Status: Not built (NEW SURFACE)
 *
 * Purpose: Manage hotel B2B partner accounts
 *
 * Structure:
 *   · Hotel partner directory
 *   · Hotel profile:
 *     - Account info: name, address, contact, account manager
 *     - Contract: tier (standard/premium/enterprise), terms, commission rate
 *     - API: integration status, API key management, webhook config
 *     - Bookings: all rides booked by this hotel, volume metrics
 *     - Billing: invoices, payment status, outstanding balance
 *     - Disputes: all disputes filed by this hotel
 *     - Cases: all B2B support cases from this hotel
 *     - Performance: booking volume, guest satisfaction, avg trip value
 *   · Onboarding pipeline: application → review → contract → integration → live
 *   · Actions: suspend partnership, adjust terms, issue credit, contact
 *   · Bulk actions: generate invoices, send statements
 *
 *
 * ── FLEET ───────────────────────────────────────────────────────────────────
 * Status: Placeholder (scoped as "vehicle management" — needs expansion)
 *
 * Must handle TWO concerns:
 *
 *   A. FLEET OWNERS (B2B partner management):
 *     · Fleet owner directory
 *     · Fleet owner profile:
 *       - Account info: business name, contact, registration
 *       - Driver roster: all drivers employed/contracted by this fleet
 *       - Vehicle fleet: all vehicles owned, status, utilization
 *       - Financials: payouts (aggregated from driver earnings), commission
 *       - Disputes: involving this fleet's drivers
 *       - Cases: B2B support cases from this fleet owner
 *       - Performance: fleet-level metrics (avg rating, trip volume)
 *     · Onboarding pipeline: application → verification → vehicle approval → live
 *     · Actions: suspend fleet operations, adjust commission, contact
 *
 *   B. VEHICLES (asset registry):
 *     · Vehicle directory
 *     · Vehicle profile: specs, owner, assigned driver, status, inspection
 *     · EV tracking: charge level, range, charging schedule
 *     · Maintenance tracking
 *     · Vehicle approval/rejection workflow
 *
 *
 * ── FINANCE ─────────────────────────────────────────────────────────────────
 * Status: Built (needs partner financial flows)
 *
 * Must handle ALL money flows:
 *
 *   INFLOWS (money coming to JET):
 *   · Rider payments (per-ride, card/wallet)
 *   · Hotel payments (monthly invoice, corporate transfer)
 *
 *   OUTFLOWS (money leaving JET):
 *   · Driver payouts (individual earnings after commission)
 *   · Fleet owner payouts (aggregated from their drivers' earnings)
 *   · Refunds to riders
 *   · Credits to hotel accounts
 *
 *   PLATFORM REVENUE:
 *   · Commission from rider-booked rides
 *   · Commission from hotel-booked rides (may differ)
 *   · Revenue breakdown by source, state, zone
 *
 *   Views:
 *   · Revenue dashboard (by source, time, geography)
 *   · Payout management (drivers + fleet owners)
 *   · Hotel billing (invoices, statements, reconciliation)
 *   · Rider payment tracking
 *   · Refund audit trail
 *   · Unit economics (per-ride, per-driver, per-fleet, per-hotel)
 *
 *
 * ── ANALYTICS ───────────────────────────────────────────────────────────────
 * Status: Placeholder
 *
 * Must cover:
 *   · Operational: supply-demand, rides, ETAs, cancellation rates
 *   · Financial: revenue, take rate, ARPU, unit economics
 *   · Geographic: state/zone performance, expansion readiness
 *   · Rider: cohorts, retention, churn, lifetime value
 *   · Driver: cohorts, earnings, churn, verification funnel
 *   · Hotel: booking volume, guest satisfaction, revenue contribution
 *   · Fleet: utilization, driver performance, vehicle efficiency
 *   · Comparative: rider-booked vs hotel-booked performance
 *
 *
 * ── COMMUNICATIONS ──────────────────────────────────────────────────────────
 * Status: Not built (NEW SURFACE)
 *
 * Purpose: Platform-wide and targeted communications
 *
 * Types:
 *   · Rider broadcasts (app notifications, promos)
 *   · Driver broadcasts (policy updates, earnings info)
 *   · Hotel partner announcements (API changes, new features)
 *   · Fleet owner announcements (policy updates, payout info)
 *   · Targeted messages (specific segment, state, zone)
 *   · System-wide announcements (maintenance, incidents)
 *
 *
 * ── SETTINGS ────────────────────────────────────────────────────────────────
 * Status: Placeholder
 *
 * Must handle:
 *   · Admin user management (single user type for now, RBAC later)
 *   · Pricing rules (base fares, surge, commission rates)
 *   · Hotel pricing: corporate rate configuration per tier
 *   · Fleet commission: fleet owner commission rates
 *   · Notification templates (rider, driver, hotel, fleet owner)
 *   · Hotel API configuration
 *   · Payment gateway settings (Paystack)
 *   · SMS gateway settings (Termii)
 *   · Compliance and data retention
 *   · Audit trail
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────┐
 * │                                                                         │
 * │   6. CROSS-SURFACE INTERACTIONS                                        │
 * │                                                                         │
 * └─────────────────────────────────────────────────────────────────────────┘
 *
 * When an admin takes action on one surface, it may affect others:
 *
 *   SUSPEND DRIVER (from Disputes or Drivers surface)
 *   → Affects: Driver profile, Fleet Owner (if affiliated), active rides
 *   → Notifies: Driver, Fleet Owner (if affiliated)
 *   → Updates: Command Center decision queue
 *
 *   RESOLVE DISPUTE (from Disputes)
 *   → Affects: Rider or Hotel account (refund), Driver record
 *   → Notifies: Both parties, Fleet Owner (if applicable), Hotel (if applicable)
 *   → Updates: Finance (refund transaction), Analytics (resolution metrics)
 *
 *   SUSPEND HOTEL PARTNERSHIP (from Hotels)
 *   → Affects: All pending hotel bookings, billing
 *   → Notifies: Hotel contact, Hotel's account manager
 *   → Updates: Finance (pause billing), Rides (flag hotel rides)
 *
 *   SUSPEND FLEET OPERATIONS (from Fleet)
 *   → Affects: All fleet drivers (not individually suspended — fleet-level lock)
 *   → Notifies: Fleet Owner, all affiliated drivers
 *   → Updates: Rides (reassign affected rides), Finance (pause fleet payouts)
 *
 *   ISSUE REFUND (from Finance or Disputes)
 *   → Affects: Rider wallet/card OR Hotel corporate account
 *   → Updates: Finance ledger, Ride record, Analytics
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────┐
 * │                                                                         │
 * │   7. BUILD PRIORITY                                                    │
 * │                                                                         │
 * └─────────────────────────────────────────────────────────────────────────┘
 *
 * PHASE 1 — CORE OPERATIONS (launch-critical)
 * ─────────────────────────────────────────────
 *   ✅ Command Center (built)
 *   ✅ Disputes — rider ↔ driver (built)
 *   ✅ Drivers — verification Kanban (built)
 *   ✅ Finance — base visibility (built)
 *   🔲 Rides — live + historical with booking source
 *   🔲 Riders — directory + profiles
 *   🔲 Drivers — full directory (extends Kanban)
 *
 * PHASE 2 — FLEET OWNERS (pre-launch for supply partnerships)
 * ─────────────────────────────────────────────────────────────
 *   🔲 Fleet — fleet owner accounts + vehicle registry
 *   🔲 Drivers — fleet affiliation indicator
 *   🔲 Disputes — fleet context badge on driver column
 *   🔲 Finance — fleet owner payout management
 *
 * PHASE 3 — HOTEL PARTNERS (when hotel product launches)
 * ───────────────────────────────────────────────────────
 *   🔲 Hotels — partner accounts + onboarding pipeline
 *   🔲 Rides — hotel-booked ride distinction
 *   🔲 Disputes — hotel-initiated disputes (Type B, D)
 *   🔲 Finance — hotel billing + invoicing
 *
 * PHASE 4 — PLATFORM MATURITY
 * ────────────────────────────
 *   🔲 Support — B2B case management
 *   🔲 Communications — broadcast + targeted messaging
 *   🔲 Analytics — full cross-platform deep dives
 *   🔲 Settings — complete configuration surface
 *   🔲 Command Center — partner metrics extension
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────┐
 * │                                                                         │
 * │   8. ARCHITECTURAL RULES                                               │
 * │                                                                         │
 * └─────────────────────────────────────────────────────────────────────────┘
 *
 * 1. EVERY entity type (Rider, Driver, Fleet Owner, Hotel) must have
 *    a dedicated admin surface for account management.
 *
 * 2. EVERY transaction type (rider-booked ride, hotel-booked ride) must
 *    be distinguishable in the rides surface and financial reporting.
 *
 * 3. RIDE DISPUTES and B2B CASES are fundamentally different UX patterns.
 *    Never shoehorn B2B account issues into the ride dispute queue.
 *
 * 4. When a driver is fleet-affiliated, the fleet owner is a STAKEHOLDER
 *    (notified, visible as context) but NOT a PARTY to ride disputes.
 *
 * 5. When a hotel books a ride, the hotel is the ACCOUNT HOLDER and the
 *    guest is the RIDER for dispute purposes. Refunds target the hotel.
 *
 * 6. Financial flows must be trackable end-to-end:
 *    Who paid → What was the platform's cut → Who was paid out → Any refunds
 *
 * 7. Every surface must handle: loading, empty, error states.
 *    Every destructive action uses center modals.
 *    Every contextual/compositional action uses side drawers.
 *
 * 8. All surfaces use the shared admin design system:
 *    AdminThemeProvider, semantic tokens, TY typography, surface primitives.
 *
 * 9. Cross-surface links: clicking a rider name in Disputes opens the
 *    Riders surface. Clicking a hotel name opens Hotels. Every entity
 *    reference is navigable.
 *
 * 10. The admin governs ALL of JET. No entity type should require
 *     going outside the admin to manage.
 *
 * ============================================================================
 */

export {};
