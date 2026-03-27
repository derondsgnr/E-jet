/**
 * ═══════════════════════════════════════════════════════════════════════════
 * JET — SURFACE COVERAGE MAP
 * Updated: March 14, 2026
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * Visual audit of every surface across Rider, Driver, Fleet Owner, Admin.
 * ✅ = Built   ⚡ = Needs affordance pass   🔲 = Placeholder   ⬜ = Not started
 *
 * ─────────────────────────────────────────────────────────────────────────
 *
 *  ┌─────────────────────────────────────────────────────────────────────┐
 *  │  RIDER (Mobile-first)                                    STATUS    │
 *  ├─────────────────────────────────────────────────────────────────────┤
 *  │  Onboarding       Splash → Auth → OTP → KYC → Done      ✅        │
 *  │  Home Shell        Map + Destination + Bottom tabs        ✅        │
 *  │  Scheduled Rides   Upcoming bookings list                 ✅        │
 *  │  Driver Approach   ETA + map + driver card                ✅        │
 *  │  In-Ride → Rating  Trip tracking → Complete → Rate        ✅        │
 *  │  ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─  │
 *  │  Activity tab      Ride history list                      ✅        │
 *  │  Wallet tab        Balance + transactions                 ✅        │
 *  │  Account tab       Profile + settings                     ✅        │
 *  │                                                                     │
 *  │  VERDICT: Rider is complete for MVP demo.                           │
 *  └─────────────────────────────────────────────────────────────────────┘
 *
 *  ┌─────────────────────────────────────────────────────────────────────┐
 *  │  DRIVER (Mobile-first)                                   STATUS    │
 *  ├─────────────────────────────────────────────────────────────────────┤
 *  │  Onboarding       Splash → Auth → OTP → Vehicle → Done   ✅        │
 *  │  Verification     Docs → BG check → Inspection schedule   ✅        │
 *  │  Home Shell        Online toggle + trip requests           ✅        │
 *  │  ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─  │
 *  │  Trips tab         History + active trip                   ✅        │
 *  │  Wallet tab        Earnings + cashout                     ✅        │
 *  │  Account tab       Profile + documents                    ✅        │
 *  │                                                                     │
 *  │  VERDICT: Driver is complete for MVP demo.                          │
 *  └─────────────────────────────────────────────────────────────────────┘
 *
 *  ┌─────────────────────────────────────────────────────────────────────┐
 *  │  FLEET OWNER (Web dashboard)                             STATUS    │
 *  ├─────────────────────────────────────────────────────────────────────┤
 *  │  Onboarding       Welcome → Business info → Bank → Done  ✅        │
 *  │  Dashboard Empty   Post-onboard, pre-first-ride           ✅        │
 *  │  Dashboard Active  Live KPIs + earnings + fleet overview   ✅        │
 *  │  ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─  │
 *  │  Drivers tab       Driver list, status, invite, manage     🔲       │
 *  │  Vehicles tab      Vehicle list, inspection, health        🔲       │
 *  │  Earnings tab      Payouts, breakdown, reports             🔲       │
 *  │  Settings tab      Business profile, bank, preferences     🔲       │
 *  │                                                                     │
 *  │  VERDICT: Shell + onboarding + dashboard done.                      │
 *  │  4 sub-views are placeholders — these are NEXT.                     │
 *  └─────────────────────────────────────────────────────────────────────┘
 *
 *  ┌─────────────────────────────────────────────────────────────────────┐
 *  │  ADMIN (Web dashboard)                                   STATUS    │
 *  ├─────────────────────────────────────────────────────────────────────┤
 *  │  Command Center    Main dashboard (V1 + V2)               ✅        │
 *  │  Dashboard Empty   First-launch state                     ✅        │
 *  │  Onboarding        Welcome → Zones                        ✅        │
 *  │  Rides             Trip management                        ✅        │
 *  │  Disputes          Resolution pipeline                    ✅        │
 *  │  Drivers           Driver mgmt + verification pipeline    ✅        │
 *  │  Finance           Money flows                            ✅        │
 *  │  Settings: Pricing Pricing config                         ✅        │
 *  │  Hotels            Empty → New → Profile (3-stage)        ✅        │
 *  │  Fleet (admin)     Empty → New → Profile (3-stage)        ✅        │
 *  │  ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─  │
 *  │  Riders            Rider management                       🔲       │
 *  │  Support           B2B support cases                      🔲       │
 *  │  Comms             Communications + broadcasts            🔲       │
 *  │  Analytics         Deep dives                             🔲       │
 *  │  Settings (full)   Config + compliance (beyond pricing)   🔲       │
 *  │                                                                     │
 *  │  VERDICT: Core ops surfaces done. 5 placeholders remain.            │
 *  └────────────────────────────────────────────────────────────────────┘
 *
 *  ┌─────────────────────────────────────────────────────────────────────┐
 *  │  WEBSITE / OTHER                                         STATUS    │
 *  ├─────────────────────────────────────────────────────────────────────┤
 *  │  Marketing site    Landing page                           ✅        │
 *  │  Launcher          Demo hub / surface switcher            ✅        │
 *  │  Briefing          Visual analysis system                 ✅        │
 *  └─��───────────────────────────────────────────────────────────────────┘
 *
 *
 * ═══════════════════════════════════════════════════════════════════════════
 * RECOMMENDED BUILD ORDER
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * Priority is based on: user flow continuity → what's referenced by
 * existing affordances → operational value.
 *
 * ┌───┬──────────────────────────────────────────────────────────────────┐
 * │ # │  SURFACE                          WHY NEXT                      │
 * ├───┼──────────────────────────────────────────────────────────────────┤
 * │ 1 │  Fleet: Drivers tab               Empty state already links     │
 * │   │                                   here. Dead end right now.     │
 * │   │                                   List + invite + status cards. │
 * ├───┼──────────────────────────────────────────────────────────────────┤
 * │ 2 │  Fleet: Vehicles tab              "Add Vehicle" modal already   │
 * │   │                                   exists. Needs the list view   │
 * │   │                                   to land in. Inspection status.│
 * ├───┼──────────────────────────────────────────────────────────────────┤
 * │ 3 │  Fleet: Earnings tab              Payout card links here.       │
 * │   │                                   Earnings breakdown, payout    │
 * │   │                                   history, pending amounts.     │
 * ├───┼──────────────────────────────────────────────────────────────────┤
 * │ 4 │  Fleet: Settings tab              "Edit profile" + "Change      │
 * │   │                                   bank" both point here.        │
 * │   │                                   Business info, bank, prefs.   │
 * ├───┼──────────────────────────────────────────────────────────────────┤
 * │ 5 │  Admin: Riders                    Completes the user mgmt       │
 * │   │                                   triangle (drivers ✅ riders   │
 * │   │                                   🔲 fleet ✅ hotels ✅).       │
 * ├───┼──────────────────────────────────────────────────────────────────┤
 * │ 6 │  Admin: Analytics                 Gives the CC dashboards data  │
 * │   │                                   drill-down destinations.      │
 * ├───┼──────────────────────────────────────────────────────────────────┤
 * │ 7 │  Admin: Support (B2B)             Fleet owner + hotel account   │
 * │   │                                   issues. Lower urgency for     │
 * │   │                                   demo but needed for complete  │
 * │   │                                   ops story.                    │
 * ├───┼──────────────────────────────────────────────────────────────────┤
 * │ 8 │  Admin: Comms                     Broadcast + notifications.    │
 * │   │                                   Nice-to-have for demo.        │
 * ├───┼──────────────────────────────────────────────────────────────────┤
 * │ 9 │  Admin: Settings (full)           Compliance, zones, roles.     │
 * │   │                                   Only pricing exists today.    │
 * └───┴──────────────────────────────────────────────────────────────────┘
 *
 *
 * ═══════════════════════════════════════════════════════════════════════════
 * SUMMARY
 * ═══════════════════════════════════════════════════════════════════════════
 *
 *   BUILT:        26 surfaces
 *   PLACEHOLDER:   9 surfaces
 *
 *   Next 4 (Fleet sub-views) are the highest priority because:
 *     → The empty state we just finished links to all of them
 *     → They complete the fleet owner E2E journey
 *     → They're a contained scope (same shell, same theme, same patterns)
 *
 *   After Fleet is fully wired, Admin: Riders closes the user
 *   management gap across all entity types.
 *
 * ═══════════════════════════════════════════════════════════════════════════
 */

export {};