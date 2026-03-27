/**
 * ┌─────────────────────────────────────────────────────────────────────────┐
 * │  HOTEL SURFACE — BUILD MANIFEST                                        │
 * │  Date: 16 Mar 2026                                                     │
 * │  Route: /hotel                                                         │
 * └─────────────────────────────────────────────────────────────────────────┘
 *
 *
 * ══════════════════════════════════════════════════════════════════════════
 * FILES CREATED
 * ══════════════════════════════════════════════════════════════════════════
 *
 * ┌────────────────────────────────────────┬────────────────────────────────┐
 * │ File                                   │ Purpose                        │
 * ├────────────────────────────────────────┼────────────────────────────────┤
 * │ config/hotel-mock-data.tsx             │ Types + mock data (traceable)  │
 * │ views/hotel-shell.tsx                  │ Shell + nav + context + toggle │
 * │ views/hotel-onboarding.tsx             │ 4-step wizard                  │
 * │ views/hotel-empty.tsx                  │ Post-onboard empty state       │
 * │ views/hotel-dashboard-view.tsx         │ Active dashboard               │
 * │ views/hotel-book-ride.tsx              │ Guest ride booking form        │
 * │ views/hotel-rides.tsx                  │ Ride history + detail drawer   │
 * │ views/hotel-billing.tsx               │ Invoices + credit meter        │
 * │ views/hotel-settings.tsx              │ Profile + team + notifs + theme │
 * └────────────────────────────────────────┴────────────────────────────────┘
 *
 *
 * ══════════════════════════════════════════════════════════════════════════
 * JOURNEY STATES
 * ══════════════════════════════════════════════════════════════════════════
 *
 * ┌────────────────┬────────┬─────────────────────────────────────────────┐
 * │ State          │ Status │ Notes                                       │
 * ├────────────────┼────────┼─────────────────────────────────────────────┤
 * │ Onboarding     │   ✅   │ Welcome → Hotel Profile → Team Invite → Done│
 * │ Empty          │   ✅   │ Checklist + CTA cards + progress bar        │
 * │ Active         │   ✅   │ Dashboard + 4 tabs (Book, Rides, Billing,   │
 * │                │        │ Settings). Journey toggle for testing.       │
 * └────────────────┴────────┴─────────────────────────────────────────────┘
 *
 *
 * ══════════════════════════════════════════════════════════════════════════
 * TAB-BY-TAB
 * ══════════════════════════════════════════════════════════════════════════
 *
 * ┌──────────────┬────────┬─────────────────────────────────────────────┐
 * │ Tab          │ Status │ Features                                    │
 * ├──────────────┼────────┼─────────────────────────────────────────────┤
 * │ Dashboard    │   ✅   │ KPI strip (4 tiles) · Active rides feed    │
 * │              │        │ Weekly sparkline · Credit meter · Recent    │
 * │              │        │ rides list · Month summary · Quick actions  │
 * ├──────────────┼────────┼─────────────────────────────────────────────┤
 * │ Book Ride    │   ✅   │ Guest name/room · Destination (with popular│
 * │              │        │ dropdown) · Vehicle type picker · Payment   │
 * │              │        │ method · Notes · Success state with reset   │
 * ├──────────────┼────────┼─────────────────────────────────────────────┤
 * │ Rides        │   ✅   │ Filterable table (All/Active/Completed/    │
 * │              │        │ Cancelled) · Search · Sort · Detail drawer │
 * │              │        │ with full ride info (route, driver, fare,   │
 * │              │        │ payment, timestamps)                        │
 * ├──────────────┼────────┼─────────────────────────────────────────────┤
 * │ Billing      │   ✅   │ KPI strip · Credit usage meter with warning│
 * │              │        │ Invoice table (sortable, with PDF download) │
 * │              │        │ Billing terms summary · Request changes CTA │
 * ├──────────────┼────────┼─────────────────────────────────────────────┤
 * │ Settings     │   ✅   │ 4 sections: Profile (inline edit) · Team   │
 * │              │        │ (invite + list + remove with confirm) ·     │
 * │              │        │ Notifications (4 toggles) · Appearance      │
 * │              │        │ (light/dark theme toggle)                   │
 * └──────────────┴────────┴─────────────────────────────────────────────┘
 *
 *
 * ══════════════════════════════════════════════════════════════════════════
 * SHELL CHROME
 * ══════════════════════════════════════════════════════════════════════════
 *
 * ┌──────────────────────────┬────────┬──────────────────────────────────┐
 * │ Element                  │ Status │ Notes                            │
 * ├──────────────────────────┼────────┼──────────────────────────────────┤
 * │ Top bar (hotel name)     │   ✅   │ Building2 icon + hotel name      │
 * │ Notifications dropdown   │   ✅   │ Unread badge + panel with items  │
 * │ User menu + logout       │   ✅   │ Avatar dropdown, settings, sign  │
 * │                          │        │ out with toast feedback           │
 * │ Nav rail (desktop)       │   ✅   │ 48→180px hover. 5 items.         │
 * │ Bottom tabs (mobile)     │   ✅   │ 56px, 44px touch targets.        │
 * │ Journey toggle (dev)     │   ✅   │ 3 states for testing.            │
 * └──────────────────────────┴────────┴──────────────────────────────────┘
 *
 *
 * ══════════════════════════════════════════════════════════════════════════
 * DATA TRACEABILITY
 * ══════════════════════════════════════════════════════════════════════════
 *
 *   Every KPI and metric in hotel-mock-data.tsx has [TABLE.column]
 *   annotations. No phantom metrics.
 *
 *   • Rides → trips table WHERE booking_source = 'hotel'
 *   • Invoices → hotel_invoices table
 *   • Team → hotel_team_members table
 *   • Credit → hotel_partners.credit_limit + SUM(pending invoices)
 *   • KPIs → aggregated from trips + invoices
 *
 *
 * ══════════════════════════════════════════════════════════════════════════
 * ACCESSIBILITY
 * ══════════════════════════════════════════════════════════════════════════
 *
 *   • DetailDrawer: Escape key, body scroll lock, role=dialog, aria-label
 *   • All buttons: min 44px touch targets
 *   • Destructive actions: ConfirmModal (team member removal)
 *   • Toast feedback on every action
 *   • Theme toggle: light/dark
 *
 *
 *   ┌─────────────────────────────────────────────────────┐
 *   │  HOTEL SURFACE STATUS: ✅ COMPLETE (Frontend MVP)   │
 *   └─────────────────────────────────────────────────────┘
 */

export {};
