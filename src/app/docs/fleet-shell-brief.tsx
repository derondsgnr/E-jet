/**
 * ┌─────────────────────────────────────────────────────────────────────┐
 * │  FLEET OWNER — Shell + Nav + Journey Architecture                  │
 * │  Date: 14 Mar 2026                                                 │
 * └─────────────────────────────────────────────────────────────────────┘
 *
 * ══════════════════════════════════════════════════════════════════════
 * 1. NAVIGATION
 * ══════════════════════════════════════════════════════════════════════
 *
 * Fleet owner has ~5 nav items. Admin has 12+. So we DON'T clone the
 * admin's expandable rail — that's overkill here.
 *
 * Instead: slim LEFT icon rail (48px collapsed, 180px expanded on hover).
 * Matches Linear/Vercel pattern for small nav sets. Keeps horizontal
 * space free for E's split command layout.
 *
 * NAV ITEMS:
 *   ┌────────────┬──────────────┬─────────────────────────────────────┐
 *   │ ID         │ Label        │ Purpose                             │
 *   ├────────────┼──────────────┼─────────────────────────────────────┤
 *   │ dashboard  │ Dashboard    │ Variation E — operational overview  │
 *   │ drivers    │ Drivers      │ Full driver list + management       │
 *   │ vehicles   │ Vehicles     │ Vehicle list + registration flow    │
 *   │ earnings   │ Earnings     │ Detailed earnings + payout history  │
 *   │ settings   │ Settings     │ Business profile, bank, preferences │
 *   └────────────┴──────────────┴─────────────────────────────────────┘
 *
 * MOBILE: Bottom tab bar (5 items, icon + label). Matches iOS pattern.
 * Touch targets: 44px min (Apple HIG).
 *
 * ══════════════════════════════════════════════════════════════════════
 * 2. FLEET OWNER JOURNEY — 3 STATES
 * ══════════════════════════════════════════════════════════════════════
 *
 * STATE 1: ONBOARDING (first-time setup wizard)
 * ──────────────────────────────────────────────
 * Triggered: Fleet owner just got invited by admin, first login.
 * Route: /fleet/onboarding
 * Pattern: Stripe-style stepped wizard. No nav shell — full-screen.
 *
 * Steps:
 *   1. Welcome — "Welcome to JET Fleet" + what to expect
 *   2. Business Profile — name, phone, email (pre-filled from invite)
 *   3. Bank Account — for payout deposits
 *   4. Add First Vehicle — make, model, plate, type (EV/Gas)
 *   5. Invite First Driver — name, phone → sends invite link
 *   6. Done — "You're all set" → redirects to /fleet
 *
 * Northstar: Stripe onboarding, Linear workspace setup.
 * Key: each step is ONE thing. No multi-field forms.
 * Progress indicator: step dots at top (not a progress bar).
 *
 *
 * STATE 2: EMPTY (shell visible, no operational data yet)
 * ──────────────────────────────────────────────────────────
 * Triggered: Onboarding complete but no rides yet.
 * Route: /fleet (dashboard index)
 * Pattern: Airbnb host "get started" empty state.
 *
 * Layout uses the fleet shell (with nav), but dashboard content shows:
 *   - Setup progress card: "3 of 5 steps complete"
 *     · ✅ Business profile
 *     · ✅ Bank account
 *     · ✅ First vehicle added
 *     · ⬜ First driver verified
 *     · ⬜ First ride completed
 *   - "What's next" cards:
 *     · "Your vehicle is pending inspection" + CTA
 *     · "Invite more drivers" + CTA
 *     · "Your first payout will appear here"
 *   - Earnings section shows ₦0 with encouraging copy
 *   - Vehicles/Drivers sections show the 1 vehicle + pending state
 *
 * Key principle: NEVER a blank page. Always show progress + next action.
 * Northstar: Airbnb host dashboard before first booking.
 *
 *
 * STATE 3: ACTIVE (full operational dashboard)
 * ────────────────────────────────────────────
 * Triggered: At least 1 completed ride.
 * Route: /fleet (dashboard index) — same route, different content
 * Content: Variation E as built.
 *
 * ══════════════════════════════════════════════════════════════════════
 * 3. ROUTING ARCHITECTURE
 * ══════════════════════════════════════════════════════════════════════
 *
 *   /fleet/onboarding       → FleetOnboarding (no shell, standalone)
 *   /fleet                  → FleetShell (nav rail + outlet)
 *     /fleet (index)        → FleetHome (empty or active based on state)
 *     /fleet/drivers        → FleetDrivers
 *     /fleet/vehicles       → FleetVehicles
 *     /fleet/earnings       → FleetEarnings
 *     /fleet/settings       → FleetSettings
 *
 * For demo purposes: a state toggle in the UI to switch between
 * onboarding / empty / active states.
 *
 * ══════════════════════════════════════════════════════════════════════
 * 4. FILES TO CREATE
 * ══════════════════════════════════════════════════════════════════════
 *
 *   /src/app/views/fleet-shell.tsx         → Shell + nav rail
 *   /src/app/views/fleet-onboarding.tsx    → Onboarding wizard
 *   /src/app/views/fleet-empty.tsx         → Empty state dashboard
 *   (Update routes.tsx)
 *   (fleet-variation-e.tsx stays as the active state)
 */

export {};
