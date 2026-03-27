 You're right. Let me write the complete brief. Every frame, every state, every connection.

Figma Make Brief — Complete Onboarding E2E

GROUND RULES
Do not touch any existing built frames. Create new frames only. Every new frame uses the existing admin shell — nav rail, top header, same dark theme, same typography. No new layout patterns.
When instructions say "right panel" — it is the same right panel drawer pattern already established in the Command Center. When instructions say "modal" — it is the same center modal pattern already established in Disputes.

FRAME INVENTORY — NEW FRAMES TO CREATE
/onboarding-welcome
/onboarding-zones
/dashboard-empty
/settings-pricing
/drivers-verification
/hotels-empty
/hotels-new
/hotels-profile
/fleet-empty
/fleet-new
/fleet-profile

FRAME 1 — /onboarding-welcome
Full screen. No nav rail. No header. Clean centered layout on dark background.
[JET logo — top left, small]

[Centered, vertically middle of screen]

  Welcome to JET Admin

  You're the control centre for Nigeria's smartest
  mobility platform. Let's get you set up.

  One thing to do first — define where JET operates.

  [Set up service zones →]        ← green CTA button

[Bottom — muted text]
  Takes about 5 minutes
No other elements. No skip. No tour. One CTA only.
Clicking "Set up service zones →" navigates to /onboarding-zones.

FRAME 2 — /onboarding-zones
No nav rail. Top header shows: "Setup · Step 1 of 1" in muted text. No back button.
Main content — two columns:
Left column (60%): Map of Nigeria. States are visible as outlines. Pre-suggested zone chips appear above the map in a horizontal scroll:
[+ Lagos Island]  [+ Lekki]  [+ Victoria Island]  
[+ Ikeja]  [+ Abuja Central]  [+ Port Harcourt]
Clicking a chip adds that zone to the map as a green outlined area and adds it to the right column list. Admin can also draw a custom zone — a "Draw zone" button sits below the chip row.
Right column (40%): Configured zones list.
CONFIGURED ZONES
─────────────────
Empty state until first zone added:
"Click a suggested zone or draw your own on the map"

After adding:
● Lagos Island          [rename] [remove]
● Lekki                 [rename] [remove]

[+ Add another zone]
Bottom of right column — fixed:
Zones added: 2                    [Continue to dashboard →]
"Continue to dashboard →" is disabled (muted, not clickable) until at least one zone is added. When disabled, shows tooltip on hover: "Add at least one zone to continue."
When one or more zones added — button turns green and becomes clickable. Navigates to /dashboard-empty.
Edge cases on this frame:
Admin tries to add a zone with no name after drawing — inline error appears next to the name field: "Give this zone a name to save it."
Admin removes all zones and tries to continue — button returns to disabled state.
Admin adds more than 10 zones — a muted note appears: "You can add more zones after launch from Settings."

FRAME 3 — /dashboard-empty
Duplicate of the existing active dashboard. Make only these changes:
KPI strip: Replace all values with "—". Remove all health tags. Labels stay. No colour treatment on any metric group.
Map area: Zone outlines visible in green. No activity bubbles. No state pins. No drill-down. Map is static.
Decisions panel: Remove all items. Replace entire panel content with:
  ● Platform is setting up
    No issues to handle yet.
Green dot. Muted text. Nothing else in the panel.
Bottom ticker: Single muted line — "Waiting for first activity..."
Right panel — replace with Setup Thread. This is the persistent setup guide. It sits where the briefing panel normally lives. It does not slide in — it is present by default on this frame.
GETTING STARTED        2 of 5 complete

  ✓  Service zones — 3 configured
  ✓  Pricing — confirmed

  →  Drivers                          [Review →]
     4 registered · awaiting verification

  ○  Hotel partners                   [Add →]
     Optional — corporate bookings

  ○  Fleet partners                   [Add →]
     Optional — grow driver supply

─────────────────────────────────────
  Once a driver is verified, your
  platform is ready to take rides.
State A (just arrived from onboarding):
Only "Service zones" is checked. Pricing is the active item (arrow, green text, [Go →] button). Drivers, Hotels, Fleet are muted grey.
State B (pricing confirmed):
Zones and Pricing both checked. Drivers becomes active item.
State C (one driver verified):
Zones, Pricing, Drivers all checked. Hotels and Fleet remain as optional soft CTAs. The note at the bottom changes to: "Your platform can accept rides. Hotels and fleet partners can be added anytime."
For the prototype — create all three states as separate sub-frames and wire the [Go →] and [Review →] buttons to navigate between states.

FRAME 4 — /settings-pricing
Nav rail visible. Active nav item: Settings. Header breadcrumb: "Settings → Pricing."
Main content — two columns:
Left column (35%): Zone list.
SERVICE ZONES
──────────────
● Lagos Island         ← selected state, green left border
  Lekki
  Victoria Island

  [+ Add zone]         ← muted, links to zone setup
Clicking a zone selects it and loads its pricing in the right column.
Right column (65%): Pricing fields for selected zone.
PRICING — Lagos Island
───────────────────────

  Base fare            ₦  [350    ]
  Per kilometre        ₦  [85     ]
  Per minute           ₦  [15     ]
  Minimum fare         ₦  [800    ]
  Cancellation fee     ₦  [200    ]
  Maximum surge        [  3.0  ]x

  ⓘ These are JET standard rates.
    Changes apply to this zone only.

  [Save changes]    [Reset to JET defaults]
All fields are pre-filled with JET default values. Admin edits only what they want to change.
"Save changes" states:
Default — grey, not yet interacted with: "No changes to save."
After any field edited — green, active: "Save changes."
After saving — brief confirmation inline below the fields: "✓ Pricing saved for Lagos Island."
"Reset to JET defaults" — clicking opens a center modal:
Reset pricing for Lagos Island?

This will remove your custom rates and restore
JET standard pricing for this zone.

[Cancel]    [Reset to defaults]
Destructive action = center modal. Follows existing pattern.
Edge cases:
Minimum fare set lower than base fare — red inline error below minimum fare field: "Minimum fare should be higher than or equal to your base fare (₦350)."
Per km set to ₦0 — amber inline warning: "Riders won't be charged for distance in this zone. Confirm this is intentional."
Admin edits fields then tries to navigate away without saving — a modal: "You have unsaved pricing changes for Lagos Island. Save before leaving?" [Discard] [Save and continue].
After saving at least one zone's pricing — the Setup Thread in /dashboard-empty marks Pricing as complete. For the prototype, the [Go →] button on the Setup Thread links back to /dashboard-empty State B.

FRAME 5 — /drivers-verification
This frame already exists as a Kanban. Extend it — do not rebuild.
Add to the existing Kanban:
Kanban column headers updated to reflect the full pipeline:
REGISTERED    DOCS SUBMITTED    UNDER REVIEW    INSPECTION      APPROVED
                                                SCHEDULED
Empty state for the entire Kanban (no drivers registered yet):
Replace Kanban content with:
[Person icon]
No drivers registered yet

Share your driver signup link so drivers
can register on the JET mobile app.

  jet.ng/drive

  [Copy link]

Drivers will appear here once they register
and submit their documents.
Driver card in each column:
[Photo]  Emeka Nwosu
         Toyota Camry · Gas
         ★ Pending
         In this stage: 2 days
EV vehicles show a small green "EV" tag instead of "Gas."
Clicking a driver card opens the right panel drawer:
EMEKA NWOSU
Registered 2 days ago

VEHICLE
Toyota Camry 2023 · LND-284EP · Gas

DOCUMENTS
  ✓  NIN — verified
  ✓  Driver's licence — expires Dec 2027
  ✗  Vehicle insurance — not uploaded
     [Request document →]

PHYSICAL INSPECTION
  Status: Not yet scheduled
  [Mark as scheduled]
  [Mark as complete]    ← disabled until scheduled

DECISION
  [Reject driver ↓]    [Approve driver →]
"Approve driver" disabled and shows why: "Complete all documents and physical inspection to approve."
"Approve driver" becomes active only when all document rows show ✓ and inspection is marked complete.
"Reject driver" opens a modal:
Reject Emeka Nwosu?

Select a reason:
  ○ Document issue
  ○ Vehicle failed inspection
  ○ Identity mismatch
  ○ Other — [text field]

Driver will be notified via the JET app.

[Cancel]    [Reject driver]
"Approve driver" opens a confirmation modal:
Approve Emeka Nwosu?

  Toyota Camry 2023 · LND-284EP
  All checks complete

Driver will be notified and can go
online immediately.

[Cancel]    [Approve driver →]
After approval — driver card moves to Approved column. Right panel closes. A brief success state appears inline at the top of the Kanban: "✓ Emeka Nwosu approved. They can now go online."
"Request document" — opens a small modal:
Request missing document

Emeka Nwosu will receive a push notification
asking them to upload:

  Vehicle insurance

[Cancel]    [Send request]
After sending — the document row in the drawer updates: "Vehicle insurance — requested · 2m ago."

FRAME 6 — /hotels-empty
Nav rail visible. Active nav item: Hotels (under Partners). Header: "Hotels."
Main content — centered empty state:
[Building icon]

No hotel partners yet

Connect hotel partners to enable corporate
guest bookings, monthly invoicing, and
concierge ride management.

[Add hotel partner →]        ← green CTA

─────────────────────────────
How it works:
  1. You create the hotel account
  2. They receive an invitation by email
  3. They log in and set up their team
  4. They can start booking rides for guests
The "How it works" section is small, muted text below the CTA. It teaches without overwhelming.
Clicking "Add hotel partner →" navigates to /hotels-new.

FRAME 7 — /hotels-new
Header breadcrumb: "Hotels → Add new partner."
Main content — single scrollable form. Not a wizard. Three labelled sections:
HOTEL DETAILS

  Hotel name       *    [________________________]
  Address          *    [________________________]
  Star rating           [1★]  [2★]  [3★]  [4★]  [5★]
  CAC number            [________________________]
                        Optional — can be added later

PRIMARY CONTACT

  Contact name     *    [________________________]
  Email address    *    [________________________]
  Phone number     *    [________________________]

COMMERCIAL TERMS

  Corporate rate        JET standard rate    [Customise ↓]
                        ⓘ Pre-agreed rate applies by default

  Billing cycle         Monthly              [Change ↓]

  Credit limit          ₦500,000 / month     [Adjust ↓]

  Dashboard access      [Toggle — ON]
  API access            [Toggle — OFF]

─────────────────────────────────────────────
  [Save as draft]              [Create hotel partner →]
Fields marked * are required. "Create hotel partner →" is disabled until all required fields are filled.
"Customise" on corporate rate expands an input field inline:
Custom rate per ride    ₦ [_______]
                        ⓘ Standard rate is ₦XXX per ride
"Create hotel partner →" opens a confirmation modal:
Create hotel partner?

  Eko Hotels & Suites
  Contact: Adaeze Okafor · adaeze@ekohotels.com

An invitation will be sent to adaeze@ekohotels.com.
They will log in to set up their team and preferences.

[Cancel]    [Create and send invitation →]
After confirmation — navigates to /hotels-profile for the newly created hotel. A success banner at top: "✓ Eko Hotels created. Invitation sent to adaeze@ekohotels.com."
Edge cases:
Required field left empty on submit attempt — red border on empty field, muted error text below: "This field is required."
Email address already exists in system — inline error: "This email is already linked to a JET account."
Admin tries to navigate away with unsaved changes — modal: "Discard changes to this hotel? Changes will be lost." [Discard] [Keep editing].
Save as draft — hotel appears in /hotels-empty replaced by /hotels-directory with status "Draft." Admin can return and complete.

FRAME 8 — /hotels-profile
Header breadcrumb: "Hotels → Eko Hotels & Suites."
Main content — three sections visible on load:
EKO HOTELS & SUITES
● Invited — awaiting first login        ← status tag

─────────────────────────────────────────
ACCOUNT DETAILS
  Address         Victoria Island, Lagos
  Star rating     ★★★★★
  CAC number      — not provided    [Add →]
  Created         Today, 11 March 2026

CONTACT
  Adaeze Okafor
  adaeze@ekohotels.com · +234 801 234 5678
  [Resend invitation]

COMMERCIAL TERMS
  Rate            JET standard
  Billing cycle   Monthly
  Credit limit    ₦500,000 / month
  [Edit terms]

─────────────────────────────────────────
RIDE HISTORY
  No rides yet. Rides will appear here
  once the hotel starts booking.

BILLING
  No invoices yet.
Status changes from "Invited — awaiting first login" to "Active" once hotel logs in. For the prototype, create both status states.
"Resend invitation" — opens small modal: "Resend invitation to adaeze@ekohotels.com?" [Cancel] [Resend].

FRAME 9 — /fleet-empty
Identical structure to /hotels-empty. Active nav item: Fleet (under Partners).
[Car icon]

No fleet partners yet

Add fleet owners to grow your driver supply
through managed vehicle fleets.

[Add fleet owner →]

─────────────────────────────────────────
How it works:
  1. You create the fleet owner account
  2. They receive an invitation by email
  3. They add their vehicles and drivers
  4. Vehicles go through inspection
  5. Approved vehicles and drivers go live

FRAME 10 — /fleet-new
Header breadcrumb: "Fleet → Add fleet owner."
OWNER DETAILS

  Business name    *    [________________________]
  Owner name       *    [________________________]
  Phone number     *    [________________________]
  Email address    *    [________________________]
  CAC number            [________________________]
                        Optional

PAYOUT DETAILS

  Bank name        *    [Dropdown — Nigerian banks ↓]
  Account number   *    [________________________]
  Account name          [________________________]
                        Auto-filled on account number entry
                   ⓘ  Required to receive driver earnings

COMMERCIAL TERMS

  JET commission        20%    [Adjust ↓]
  Payout schedule       Weekly [Change to Daily ↓]

─────────────────────────────────────────
  [Save as draft]         [Create fleet owner →]
Bank account is required. If admin tries to submit without it — inline error: "Bank account required. Fleet owner cannot receive payouts without this."
Commission "Adjust" expands inline:
JET commission     [20]  %
Fleet owner earns  [80]  %
                   ⓘ Combined must equal 100%
If numbers don't add to 100 — inline error: "Commission split must total 100%."
Confirmation modal:
Create fleet owner?

  Metro Express Fleet · Chidi Okonkwo
  Contact: chidi@metroexpress.ng

An invitation will be sent to Chidi.
They will log in to add vehicles and drivers.

[Cancel]    [Create and send invitation →]

FRAME 11 — /fleet-profile
Header breadcrumb: "Fleet → Metro Express Fleet."
METRO EXPRESS FLEET
● Invited — awaiting first login

─────────────────────────────────────────
OWNER DETAILS
  Chidi Okonkwo
  chidi@metroexpress.ng · +234 802 345 6789
  [Resend invitation]

COMMERCIAL TERMS
  JET commission    20%
  Payout schedule   Weekly
  Bank account      ••••• 4521 · GTBank
  [Edit terms]

─────────────────────────────────────────
VEHICLES                              0
  No vehicles yet.
  Vehicles will appear here once the
  fleet owner adds them from their dashboard.

DRIVERS                               0
  No drivers linked yet.

EARNINGS
  No payouts yet.
Once fleet owner adds vehicles — vehicles appear as a list:
VEHICLES                              3
  Toyota Camry 2023 · LND-284EP · Gas
  Status: Pending inspection           [Review →]

  BYD Seal 2024 · LND-291KA · EV
  Status: Pending inspection           [Review →]

  Honda Accord 2022 · LND-156BT · Gas
  Status: Approved                     [View →]
"Review →" on a pending vehicle opens the driver verification drawer pattern — same component, adapted for vehicles.

WIRING — ALL NAVIGATION CONNECTIONS
/onboarding-welcome
  [Set up service zones →] → /onboarding-zones

/onboarding-zones
  [Continue to dashboard →] → /dashboard-empty (State A)

/dashboard-empty
  Setup Thread [Go →] on Pricing → /settings-pricing
  Setup Thread [Review →] on Drivers → /drivers-verification
  Setup Thread [Add →] on Hotels → /hotels-empty
  Setup Thread [Add →] on Fleet → /fleet-empty
  After pricing saved → /dashboard-empty (State B)
  After first driver approved → /dashboard-empty (State C)

/settings-pricing
  After saving → returns to /dashboard-empty (State B)
  Nav rail → any surface

/drivers-verification
  After first approval → /dashboard-empty (State C)
  Nav rail → any surface

/hotels-empty
  [Add hotel partner →] → /hotels-new

/hotels-new
  [Create and send invitation →] → /hotels-profile
  [Save as draft] → /hotels-empty (with draft state)
  Back / cancel → /hotels-empty

/hotels-profile
  Nav rail → any surface
  Breadcrumb → /hotels-empty

/fleet-empty
  [Add fleet owner →] → /fleet-new

/fleet-new
  [Create and send invitation →] → /fleet-profile
  [Save as draft] → /fleet-empty (with draft state)
  Back / cancel → /fleet-empty

/fleet-profile
  [Review →] on vehicle → opens right panel drawer
  Nav rail → any surface
  Breadcrumb → /fleet-empty

WHAT NOT TO TOUCH
Everything currently built. No exceptions. No modifications to existing frames. New frames only.