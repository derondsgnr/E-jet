/**
 * ═══════════════════════════════════════════════════════════════════════════
 * AFFORDANCE AUDIT — Decision Panels, Side Drawers, Modals
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * Scope: Every interactive surface across the fleet dashboard
 * Evaluated: Dead-ends, phantom affordances, noop handlers, "coming soon"
 *            stubs, unimplementable actions, consistency gaps
 *
 * Classification:
 *   🔴 DEAD-END    — Button does literally nothing, or handler is () => {}
 *   🟠 PHANTOM     — Pretends to act but doesn't change state (fake feedback)
 *   🟡 STUB        — "Coming soon" toast, feature exists elsewhere but not wired
 *   ✅ WIRED       — Action completes its full lifecycle (modal → confirm → feedback)
 *
 *
 * ═══════════════════════════════════════════════════════════════════════════
 * FINDINGS BY SURFACE
 * ═══════════════════════════════════════════════════════════════════════════
 *
 *
 * ── 1. ADMIN: DRIVER VERIFICATION ─────────────────────────────────────────
 *    File: admin-drivers-verification.tsx
 *
 *    ┌────────────────────────────┬──────────┬────────────────────────────┐
 *    │ Affordance                 │ Status   │ Issue                      │
 *    ├────────────────────────────┼──────────┼────────────────────────────┤
 *    │ Reject → ConfirmModal      │ 🔴 DEAD  │ onClick={() => {})         │
 *    │                            │          │ Line 435. Button rendered  │
 *    │                            │          │ as destructive red but     │
 *    │                            │          │ does NOTHING on click.     │
 *    │                            │          │ User sees reject modal,    │
 *    │                            │          │ types a reason, clicks     │
 *    │                            │          │ "Reject driver" — nothing. │
 *    ├────────────────────────────┼──────────┼────────────────────────────┤
 *    │ Approve → ConfirmModal     │ ✅ WIRED │ Closes modal + navigates  │
 *    │                            │          │ to dashboard-empty.        │
 *    ├────────────────────────────┼──────────┼────────────────────────────┤
 *    │ Driver detail drawer       │ ✅ WIRED │ Opens, closes, shows data. │
 *    │                            │          │ Missing: Escape key close  │
 *    │                            │          │ (AdminDrawer handles this?)│
 *    └────────────────────────────┴──────────┴────────────────────────────┘
 *
 *    FIX: Reject button must close modal + move driver to rejected state
 *    + show toast. Matches approve pattern.
 *
 *
 * ── 2. FLEET: DRIVER DETAIL DRAWER ───────────────────────────────────────
 *    File: fleet-drivers.tsx → DriverDetailPanel
 *
 *    ┌────────────────────────────┬──────────┬────────────────────────────┐
 *    │ Affordance                 │ Status   │ Issue                      │
 *    ├────────────────────────────┼──────────┼────────────────────────────┤
 *    │ Call button                │ ✅ WIRED │ Opens tel: link + toast    │
 *    ├────────────────────────────┼──────────┼────────────────────────────┤
 *    │ Message button             │ 🟠 PHANT │ Shows "SMS sent to X"     │
 *    │                            │          │ but no SMS is sent. No    │
 *    │                            │          │ actual messaging system.   │
 *    │                            │          │ Gives false confirmation.  │
 *    ├────────────────────────────┼──────────┼────────────────────────────┤
 *    │ Send Reminder (pipeline)   │ 🟠 PHANT │ "Reminder sent to X" but  │
 *    │                            │          │ no email/notification sent.│
 *    ├────────────────────────────┼──────────┼────────────────────────────┤
 *    │ View Full History          │ 🟡 STUB  │ "Full history coming soon" │
 *    │                            │          │ Presents as a full action  │
 *    │                            │          │ card but goes nowhere.     │
 *    ├────────────────────────────┼──────────┼───────────────────────────┤
 *    │ Reassign Vehicle           │ ✅ WIRED │ Opens ReassignVehicleModal │
 *    │                            │          │ with available vehicles.   │
 *    │                            │          │ Empty state handled. ✓     │
 *    ├────────────────────────────┼──────────┼────────────────────────────┤
 *    │ Suspend Driver             │ ✅ WIRED │ → ConfirmModal → toast    │
 *    │ Reactivate Driver          │ ✅ WIRED │ → ConfirmModal → toast    │
 *    └────────────────────────────┴──────────┴────────────────────────────┘
 *
 *    FIX for Message: Change to honest toast: "Messaging coming soon"
 *    OR show a compose drawer/modal with pre-filled template (even if
 *    mock, at least the affordance doesn't lie about completing an action). - is this technically possible to message the driver directy? use our product os skill to validate it
 *
 *    FIX for Send Reminder: Same — either honest "coming soon" or show
 *    a preview of the reminder that "would be sent." -preview
 *
 *    FIX for View Full History: Either remove or add a disabled indicator
 *    with "Planned" badge. Currently styled identically to working buttons. - what's the view full history supposed to be
 *
 *
 * ── 3. FLEET: VEHICLE DETAIL DRAWER ──────────────────────────────────────
 *    File: fleet-vehicles.tsx → VehicleDetailPanel
 *
 *    ┌────────────────────────────┬──────────┬────────────────────────────┐
 *    │ Affordance                 │ Status   │ Issue                      │
 *    ├────────────────────────────┼──────────┼────────────────────────────┤
 *    │ Service History            │ 🟡 STUB  │ "Service history coming    │
 *    │                            │          │ soon" — styled as full     │ - validate
 *    │                            │          │ action card.               │
 *    ├────────────────────────────┼──────────┼────────────────────────────┤
 *    │ Trip History               │ 🟡 STUB  │ "Trip history coming soon" │
 *    │                            │          │ — same issue.              │ - wire 
 *    ├────────────────────────────┼──────────┼────────────────────────────┤
 *    │ Reassign Driver            │ 🟡 STUB  │ "Driver reassignment       │
 *    │                            │          │ coming soon" — but a       │ - wire
 *    │                            │          │ ReassignVehicleModal       │
 *    │                            │          │ already exists in fleet-   │
 *    │                            │          │ drivers.tsx. Needs the     │
 *    │                            │          │ inverse: a driver picker.  │
 *    ├────────────────────────────┼──────────┼────────────────────────────┤
 *    │ Deactivate Vehicle         │ ✅ WIRED │ → ConfirmModal → toast    │
 *    │ Reactivate Vehicle         │ ✅ WIRED │ → ConfirmModal → toast    │   
 *    └────────────────────────────┴──────────┴────────────────────────────┘
 *
 *
 * ── 4. FLEET: VEHICLES TOOLBAR ───────────────────────────────────────────
 *    File: fleet-vehicles.tsx (main view toolbar)
 *
 *    ┌────────────────────────────┬──────────┬────────────────────────────┐
 *    │ Affordance                 │ Status   │ Issue                      │
 *    ├────────────────────────────┼──────────┼────────────────────────────┤
 *    │ "+ Add Vehicle" button     │ 🟡 STUB  │ "Add vehicle flow coming   │
 *    │                            │          │ soon" — BUT AddVehicle-    │
 *    │                            │          │ Sheet exists as a shared   │
 *    │                            │          │ component and is already   │ - wire
 *    │                            │          │ wired in fleet-empty.tsx.  │
 *    │                            │          │ This is the SAME button    │
 *    │                            │          │ use-case. Dead wiring.     │
 *    └────────────────────────────┴──────────┴────────────────────────────┘
 *
 *    FIX: Import AddVehicleSheet and wire it. The component exists.
 *
 *
 * ── 5. FLEET: SETTINGS ──────────────────────────────────────────────────
 *    File: fleet-settings.tsx
 *
 *    ┌────────────────────────────┬──────────┬────────────────────────────┐
 *    │ Affordance                 │ Status   │ Issue                      │
 *    ├────────────────────────────┼──────────┼────────────────────────────┤
 *    │ Save changes               │ ✅ WIRED │ SaveBar → toast. Good.     │
 *    │ Discard changes            │ 🟠 PHANT │ Sets dirty=false + toast   │
 *    │                            │          │ but field values don't     │
 *    │                            │          │ reset. (Known P1 gap.)     │
 *    │ Unsaved changes guard      │ ✅ WIRED │ ConfirmModal on section    │
 *    │                            │          │ switch. Save & Switch      │
 *    │                            │          │ button works.              │
 *    │ Deactivate fleet           │ ✅ WIRED │ ConfirmModal → toast.      │
 *    │ Delete fleet               │ ✅ WIRED │ ConfirmModal → toast       │
 *    │                            │          │ + 72h grace period msg. ✓  │
 *    │ Export fleet data          │ ✅ WIRED │ Download icon + toast.     │
 *    │ Notification toggles       │ ✅ WIRED │ Toggle + toast (debounce   │
 *    │                            │          │ is a known P2 gap).        │
 *    │ 2FA toggle                 │ 🟠 PHANT │ Single-click enable/       │
 *    │                            │          │ disable with no confirm.   │ - wire
 *    │                            │          │ (Known P1 gap.)            │
 *    │ Session revoke             │ 🟠 PHANT │ Immediate revoke, no       │ - wire
 *    │                            │          │ confirm. (Known P1 gap.)   │
 *    └────────────────────────────┴──────────┴────────────────────────────┘
 *
 *
 * ── 6. FLEET: EMPTY STATE ────────────────────────────────────────────────
 *    File: fleet-empty.tsx
 *
 *    ┌────────────────────────────┬──────────┬────────────────────────────┐
 *    │ Affordance                 │ Status   │ Issue                      │
 *    ├────────────────────────────┼──────────┼────────────────────────────┤
 *    │ Invite Driver (QA)         │ ✅ WIRED │ Opens InviteDriverSheet    │
 *    │ Add Vehicle (QA)           │ ✅ WIRED │ Opens AddVehicleSheet      │
 *    │ Copy Invite Link (QA)     │ ✅ WIRED │ Clipboard + toast          │
 *    │ Fleet Settings (QA)       │ ✅ WIRED │ Navigates to settings tab  │
 *    │ Setup checklist steps      │ ✅ WIRED │ Expandable + wired actions │
 *    │ Pending items: resend/     │ 🟠 PHANT │ "Resend" shows toast       │
 *    │   cancel                   │          │ "Invitation resent" but    │
 *    │                            │          │ no actual resend logic.    │
 *    │ Help beacon                │ ✅ WIRED │ Opens external link        │
 *    └────────────────────────────┴──────────┴────────────────────────────┘
 *
 *
 * ── 7. ADMIN: HOTEL CREATION / FLEET CREATION ────────────────────────────
 *    Files: admin-hotels-new.tsx, admin-fleet-new.tsx
 *
 *    ┌────────────────────────────┬──────────┬────────────────────────────┐
 *    │ Affordance                 │ Status   │ Issue                      │
 *    ├────────────────────────────┼──────────┼────────────────────────────┤
 *    │ Create + send invitation   │ ✅ WIRED │ Validate → ConfirmModal    │
 *    │                            │          │ → closes modal. But—does   │
 *    │                            │          │ it navigate after? Does    │
 *    │                            │          │ the user see their new     │
 *    │                            │          │ entity? Needs review.      │
 *    │ Discard modal              │ ✅ WIRED │ admin-hotels-new only.     │
 *    │                            │          │ admin-fleet-new lacks it.  │
 *    └────────────────────────────┴──────────┴────────────────────────────┘
 *
 *
 * ── 8. ADMIN: HOTEL PROFILE ─────────────────────────────────────────────
 *    File: admin-hotels-profile.tsx
 *
 *    ┌────────────────────────────┬──────────┬────────────────────────────┐
 *    │ Affordance                 │ Status   │ Issue                      │
 *    ├────────────────────────────┼──────────┼────────────────────────────┤
 *    │ Resend invitation modal    │ ✅ WIRED │ Opens modal → closes.      │
 *    │                            │          │ "Resend invitation" button │
 *    │                            │          │ closes modal but no toast  │
 *    │                            │          │ or success feedback shown. │
 *    └────────────────────────────┴──────────┴────────────────────────────┘
 *
 *
 * ── 9. ADMIN: PRICING SETTINGS ──────────────────────────────────────────
 *    File: admin-settings-pricing.tsx
 *
 *    ┌────────────────────────────┬──────────┬────────────────────────────┐
 *    │ Affordance                 │ Status   │ Issue                      │
 *    ├────────────────────────────┼──────────┼────────────────────────────┤
 *    │ Reset pricing              │ ✅ WIRED │ ConfirmModal → resets      │
 *    │                            │          │ state to defaults.         │
 *    │ Save pricing               │ ✅ WIRED │ Updates state + success    │
 *    │                            │          │ feedback.                  │
 *    └────────────────────────────┴──────────┴────────────────────────────┘
 *
 *
 * ══════════════════════════════════════════════════════════════════════════
 * SUMMARY SCORECARD
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * ┌─────────────────┬──────┬──────────────────────────────────────────────┐
 * │ Classification   │ Count│ Details                                      │
 * ├─────────────────┼──────┼──────────────────────────────────────────────┤
 * │ 🔴 DEAD-END      │  1   │ Admin reject driver (noop onClick)           │
 * │ 🟠 PHANTOM       │  5   │ Message, Send Reminder, Resend invitation,  │
 * │                  │      │ 2FA toggle, Session revoke (these last 2    │
 * │                  │      │ are known P1 gaps from settings audit)      │
 * │ 🟡 STUB          │  5   │ View Full History, Service History,          │
 * │                  │      │ Trip History, Reassign Driver (vehicles),   │
 * │                  │      │ Add Vehicle toolbar                         │
 * │ ✅ WIRED         │  20+ │ All confirm modals, drawer open/close,      │
 * │                  │      │ save/discard, danger zone, quick actions    │
 * └─────────────────┴──────┴──────────────────────────────────────────────┘
 *
 *
 * ═══════════════════════════════════════════════════════════════════════════
 * SYSTEMIC PATTERNS FOUND
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * 1. "COMING SOON" STUBS LOOK IDENTICAL TO WORKING BUTTONS
 *    The 5 stub buttons use the exact same visual styling (card + icon +
 *    label + description) as fully wired actions like Suspend/Deactivate.
 *    User has no visual signal that these won't work.
 *
 *    Fix: Add a "Planned" badge (muted, small) and reduce visual weight.
 *    Or — just wire them. The hardest (Add Vehicle, Reassign) already
 *    have shared components that just need importing. - wire them
 *
 * 2. PHANTOM TOASTS LIE ABOUT COMPLETING ACTIONS
 *    "SMS sent to Adamu" / "Reminder sent to Adamu" / "Invitation resent"
 *    These use success toasts for actions that didn't actually happen.
 *    This breaks Product OS: "Provide clear, immediate feedback for every
 *    user action" — feedback must be HONEST. - for these remember that i am not the one fully developing i am handing off the designs so what i really need at the end of the day is all necessary ui(toasts, pages, modals, banners, components in all their states etc) accounted for during export
 *
 *    Fix: Either honestly stub ("Messaging not yet connected") or show a
 *    preview/compose state that makes it clear it's a demo.
 *
 * 3. ADD VEHICLE COMPONENT EXISTS BUT ISN'T WIRED IN VEHICLES TAB
 *    AddVehicleSheet is imported and working in fleet-empty.tsx.
 *    fleet-vehicles.tsx has an "Add Vehicle" CTA button on the toolbar
 *    that shows a "coming soon" toast instead. Easy fix. - wire
 *
 * 4. DISCARD MODAL INCONSISTENCY IN ADMIN CREATION FLOWS
 *    admin-hotels-new.tsx has a showDiscardModal state.
 *    admin-fleet-new.tsx does not. Both are creation forms. systemize
 *
 *
 * ═══════════════════════════════════════════════════════════════════════════
 * PRIORITY FIX PLAN
 * ══════════════════════════════════════════════════════════════════════════
 *
 * ┌─────────┬──────────────────────────────────────────────────────────────┐
 * │  P0     │ Fix admin reject driver noop → close + move to rejected    │
 * │         │ + toast "Driver rejected"                                   │
 * ├─────────┼──────────────────────────────────────────────────────────────┤
 * │  P1     │ Wire AddVehicleSheet into fleet-vehicles.tsx toolbar        │
 * │  P1     │ Change phantom toasts to honest stubs (Message, Reminder,  │
 * │         │ Resend) — use "info" type + accurate wording               │
 * │  P1     │ Add "Planned" visual treatment to stub action cards         │
 * │         │ (View Full History, Service History, Trip History)          │
 * ├─────────┼──────────────────────────────────────────────────────────────┤
 * │  P2     │ Build ReassignDriverModal for vehicles (inverse of the     │
 * │         │ ReassignVehicleModal that exists in fleet-drivers)          │
 * │  P2     │ Add discard confirm to admin-fleet-new.tsx (parity with    │
 * │         │ admin-hotels-new.tsx)                                       │
 * │  P2     │ Add success toast to admin-hotels-profile resend action    │
 * └─────────┴──────────────────────────────────────────────────────────────┘
 *
 *
 * ═══════════════════════════════════════════════════════════════════════════
 * DETAIL DRAWER SYSTEM REVIEW (DetailDrawer component)
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * The shared DetailDrawer (detail-drawer.tsx) is structurally solid:
 *   ✅ Desktop: absolute overlay, 380px, doesn't reflow content
 *   ✅ Mobile: fixed slide-over with backdrop + tap-to-close
 *   ✅ Spring easing [0.16, 1, 0.3, 1] matches the brand
 *   ✅ Glass-blur backdrop, theme-aware border + shadow
 *
 * Missing from DetailDrawer itself:
 *   ⚠️  No Escape key handler (content panels handle close via X button
 *       but no keyboard shortcut at the drawer shell level)
 *   ⚠️  No body scroll lock on mobile (backdrop tap closes, but
 *       background content can still scroll) - across board we need to make sure the mobile responsive version has a ux tailored to the mobile experience
 *   ⚠️  No aria-label or role="complementary" / role="dialog"
 *
 * These are the same kind of a11y gaps flagged in the settings audit.
 * Fix at the DetailDrawer level = fix for all tabs at once.
 *
 *
 * ═══════════════════════════════════════════════════════════════════════════
 * ADMIN SURFACE PRIMITIVES (AdminModal / AdminDrawer)
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * Not audited in depth here — but the admin surfaces (used in
 * admin-drivers-verification, admin-hotels-new, admin-fleet-new,
 * admin-settings-pricing) appear consistently wired. The ONE dead-end
 * is the reject driver noop, which is a handler bug not a surface bug.
 *
 * AdminModal and AdminDrawer should be checked for the same a11y gaps:
 *   - Escape key close
 *   - Focus trap
 *   - ARIA attributes
 *
 *
 * should we fix the p0 and p1s? what about the systemic patterns?
 *
 *
 * ═══════════════════════════════════════════════════════════════════════════
 * FLEET SHELL — MULTI-FLEET MANAGEMENT AUDIT
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * Reference: /src/app/docs/fleet-multi-fleet-brief.tsx
 *   "Each fleet = workspace. One account, multiple fleets.
 *    Fleet switcher in top bar. 'Add new fleet' option."
 *
 * File: fleet-shell.tsx (FleetTopBar component)
 *
 *
 * ── FLEET SWITCHER ────────────────────────────────────────────────────────
 *
 *    ┌────────────────────────────┬──────────┬────────────────────────────┐
 *    │ Affordance                 │ Status   │ Issue                      │
 *    ├────────────────────────────┼──────────┼────────────────────────────┤
 *    │ Fleet switcher dropdown    │ 🟠 COSM  │ Opens/closes. Shows 2      │
 *    │                            │          │ fleets (Metro Lagos,       │
 *    │                            │          │ Metro Abuja). Switching    │
 *    │                            │          │ changes the active dot     │
 *    │                            │          │ and header label, BUT:     │ - wire
 *    │                            │          │                            │
 *    │                            │          │ activeFleet is LOCAL STATE │
 *    │                            │          │ in FleetTopBar. It never   │
 *    │                            │          │ propagates to FleetContext │
 *    │                            │          │ or any content view. ALL   │
 *    │                            │          │ tabs (drivers, vehicles,   │
 *    │                            │          │ earnings, settings) show   │
 *    │                            │          │ identical MOCK_FLEET_OWNER │
 *    │                            │          │ data regardless of which   │
 *    │                            │          │ fleet is "selected."       │
 *    │                            │          │                            │
 *    │                            │          │ The switcher is cosmetic.  │
 *    ├────────────────────────────┼──────────┼────────────────────────────┤
 *    │ "Add new fleet" button     │ 🔴 DEAD  │ Line 418-426. The button   │
 *    │                            │          │ has NO onClick handler.    │
 *    │                            │          │ Renders with cursor:pointer│ - wire
 *    │                            │          │ from parent but clicking   │
 *    │                            │          │ does absolutely nothing.   │
 *    │                            │          │                            │
 *    │                            │          │ This is THE entry point    │
 *    │                            │          │ for multi-fleet. Without   │
 *    │                            │          │ it, the multi-fleet brief  │
 *    │                            │          │ is unimplementable.        │
 *    ├────────────────────────────┼──────────┼────────────────────────────┤
 *    │ Invite link copy (top bar) │ 🔴 DEAD  │ Line 437-445. Rendered as  │
 *    │                            │          │ a div with cursor:pointer  │
 *    │                            │          │ and a Copy icon, but NO    │
 *    │                            │          │ onClick handler. Shows     │
 *    │                            │          │ "jet.ng/fleet/abc" text    │
 *    │                            │          │ but clicking doesn't copy. │
 *    │                            │          │ (The SAME action in fleet- │
 *    │                            │          │ empty.tsx Quick Actions IS │
 *    │                            │          │ wired — inconsistency.)    │
 *    └────────────────────────────┴──────────┴────────────────────────────┘
 *
 *
 * ── WHAT THE FLEET OWNER CAN ACTUALLY "MANAGE" TODAY ──────────────────────
 *
 *    Per the multi-fleet brief, the fleet owner should be able to:
 *
 *    ┌──────────────────────────────────────┬───────┬──────────────────────┐
 *    │ Capability                           │ Built │ Notes                │
 *    ├──────────────────────────────────────┼───────┼──────────────────────┤
 *    │ View fleet dashboard (KPIs, chart)   │ ✅    │ fleet-variation-e    │
 *    │ Manage drivers (list, detail, CRUD)  │ ✅    │ fleet-drivers — but  │
 *    │                                      │       │ scope is per fleet   │
 *    │                                      │       │ in theory, global in │
 *    │                                      │       │ practice (1 dataset) │
 *    │ Manage vehicles (list, detail, CRUD) │ 🟡    │ fleet-vehicles —     │
 *    │                                      │       │ list + detail work.  │
 *    │                                      │       │ "Add Vehicle" button │
 *    │                                      │       │ is a stub (P1 fix). │
 *    │ View earnings                        │ ✅    │ fleet-earnings       │
 *    │ Fleet settings (profile, bank, etc.) │ ✅    │ fleet-settings       │
 *    │ Switch between fleets                │ 🟠    │ UI exists, cosmetic  │
 *    │                                      │       │ only — data doesn't  │
 *    │                                      │       │ change per fleet.    │
 *    │ Create a new fleet                   │ 🔴    │ Dead button, no      │
 *    │                                      │       │ onClick, no flow,    │ - wire
 *    │                                      │       │ no sheet/modal.      │
 *    │ Delete / deactivate a fleet          │ ✅    │ In settings danger   │
 *    │                                      │       │ zone (toast-only).   │
 *    │ View aggregate across all fleets     │ ❌    │ Not built. Brief     │ - wire
 *    │                                      │       │ says "Owner CAN view │
 *    │                                      │       │ aggregate."          │
 *    │ Copy invite link                     │ 🔴    │ Dead in top bar.     │
 *    │                                      │       │ Wired in fleet-empty.│
 *    └──────────────────────────────────────┴───────┴──────────────────────┘
 *
 *
 * ── WHAT "ADD NEW FLEET" SHOULD DO (design decision needed) ──────────────
 *
 *    Option A: Inline sheet in the fleet switcher dropdown
 *      → Minimal: name + location → creates workspace → switches to it
 *      → Matches fleet-empty onboarding pattern (new fleet starts in
 *        "empty" journey state with setup checklist)
 *
 *    Option B: Full creation flow (mini onboarding)
 *      → fleet-onboarding.tsx already exists for the first fleet.
 *        "Add new fleet" could reuse it with isAdditionalFleet flag.
 *
 *    Option C: Modal with key fields (Linear "Create project" pattern)
 *      → Name, location/zone, maybe bank → creates workspace.
 *
 *    Recommendation: Option A for the MVP surface (just name + location),
 *    which transitions the new fleet into fleet-onboarding for the full - okay
 *    setup (bank, vehicles, invites). Matches the progressive disclosure
 *    design northstar.
 *
 *
 * ── UPDATED PRIORITY FIX PLAN (with fleet management) ────────────────────
 *
 * ┌─────────┬──────────────────────────────────────────────────────────────┐
 * │  P0     │ ✅ Fix admin reject driver noop → close + move to rejected  │
 * │         │    + success modal. rejectedDriverIds filters kanban.       │
 * │  P0     │ ✅ Wire "Add new fleet" button → inline creation form       │
 * │         │    (name + location → creates workspace → fleet-empty)      │
 * │  P0     │ ✅ Wire invite link copy in top bar (clipboard + toast)     │
 * ├─────────┼──────────────────────────────────────────────────────────────┤
 * │  P1     │ ✅ Lift activeFleet to FleetContext (activeFleetId,          │
 * │         │    setActiveFleetId, fleets, addFleet all in context)       │
 * │  P1     │ ✅ Wire AddVehicleSheet into fleet-vehicles.tsx toolbar     │
 * │  P1     │ ✅ Fix phantom toasts — Message + Send Reminder now show    │
 * │         │    honest "requires backend integration" info toasts        │
 * │  P1     │ ✅ Wire "View Full History" → DriverHistoryModal            │
 * │         │    (trips + earnings + ratings, tabbed, mock trip data)     │
 * │  P1     │ ✅ Wire "Service History" + "Trip History" →                │
 * │         │    VehicleHistoryModal (tabbed: service log + trip list)    │
 * │  P1     │ ✅ Wire "Reassign Driver" → ReassignDriverModal            │
 * │         │    (driver picker for vehicles, inverse of vehicle modal)   │
 * ├─────────┼──────────────────────────────────────────────────────────────┤
 * │  P2     │ ✅ Discard modal parity for admin-fleet-new                │
 * │         │    (isDirty check, confirmation modal, form reset)          │
 * │  P2     │ ✅ Aggregate view across all fleets                         │
 * │         │    ("All Fleets" option in fleet switcher with Layers icon, │
 * │         │    ALL_FLEETS_ID constant exported for view consumption)    │
 * │  P2     │ ✅ Aggregate KPIs in dashboard                              │
 * │         │    (banner + multiplied metrics when ALL_FLEETS selected)   │
 * │  P2     │ ✅ 2FA toggle confirmation modals                           │
 * │         │    (enable: green confirm, disable: destructive confirm)    │
 * │  P2     │ ✅ Session revoke confirmation modals                       │
 * │         │    (destructive, shows device + browser + location)         │
 * │  P2     │ ✅ DetailDrawer a11y pass                                   │
 * │         │    (Escape key, body scroll lock, role=dialog, aria-label,  │
 * │         │    aria-modal, backdrop keyboard support)                   │
 * │  P2     │ ✅ User menu + logout in top bar                            │
 * │         │    (avatar dropdown: name, email, settings link, sign out)  │
 * └─────────┴──────────────────────────────────────────────────────────────┘
 */

export {};