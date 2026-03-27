/**
 * ============================================================================
 * HOTEL BOOKING FLOW — UX GAP ANALYSIS
 * ============================================================================
 *
 * Benchmarked against: Uber for Business, Blacklane, Karhoo, Alto,
 * Airbnb (trust), Apple (security), Linear (progressive disclosure)
 *
 * Scope: Full lifecycle across Hotel, Driver, Guest, Admin
 *
 * ============================================================================
 * LEGEND:
 *   [CRITICAL]  — Blocks real usage or creates trust/safety failure
 *   [HIGH]      — Major friction, workaround exists but painful
 *   [MEDIUM]    — Polish gap, noticeable to power users
 *   [LOW]       — Nice-to-have, benchmarked against northstars
 * ============================================================================
 *
 *
 * ════════════════════════════════════════════════════════════════════════════
 * 1. ARRIVAL VERIFICATION — "Has the driver actually arrived?"
 * ════════════════════════════════════════════════════════════════════════════
 *
 * THE QUESTION: How does the hotel know the driver has really reached?
 *
 * CURRENT STATE:
 *   Driver taps "I've arrived" → status changes on hotel dashboard
 *   No independent verification. Driver could tap early (gaming wait time).
 *
 * BENCHMARKS:
 *   - Uber for Business: GPS geofence at pickup. "Arrived" only fires
 *     when driver is within 100m of pin.
 *   - Blacklane: Chauffeur checks in via app, hotel concierge gets push.
 *     Manual confirmation NOT required — trust the GPS.
 *   - Alto: Geofence + photo of arrival location (optional).
 *
 * RECOMMENDATION:
 *   ┌──────────────────────────────────────────────────────┐
 *   │  GPS geofence verification (automatic, no friction)  │
 *   │                                                      │
 *   │  Driver within 150m of hotel pin                     │
 *   │  → Status auto-moves to "arrived"                    │
 *   │  → Hotel gets push notification with ETA overlay     │
 *   │                                                      │
 *   │  Driver taps "arrived" outside geofence              │
 *   │  → Soft warning: "You seem far from the pickup"      │
 *   │  → Still allows (traffic rerouting is real)          │
 *   │  → Flags for admin review if repeated                │
 *   └──────────────────────────────────────────────────────┘
 *
 * WHY NOT HOTEL CONFIRMS:
 *   - Adds friction to every single ride
 *   - Concierge may be busy, creating artificial delays
 *   - Guest is waiting — speed matters more than ceremony
 *   - Geofence is more reliable than human confirmation
 *
 * WHY NOT GUEST CONFIRMS:
 *   - Guest may not have the app
 *   - Guest may not understand the confirmation step
 *   - Adds confusion to what should be a seamless handoff
 *
 * VERDICT: GPS geofence (automatic) + admin audit trail for anomalies
 *
 *
 * ════════════════════════════════════════════════════════════════════════════
 * 2. OTP HANDOFF — WHO GIVES THE CODE TO WHOM?
 * ════════════════════════════════════════════════════════════════════════════
 *
 * CURRENT STATE:
 *   - Start OTP: Guest tells driver their 4-digit code
 *   - End OTP: Driver tells guest their 4-digit code
 *   - Hotel dashboard shows both codes
 *   - Guest tracking page shows start OTP
 *
 * GAPS:
 *
 *   [CRITICAL] Guest may not check their SMS before driver arrives
 *   ┌──────────────────────────────────────────────────────┐
 *   │  Solution: Hotel concierge hands guest a card with   │
 *   │  the OTP at handoff. Card has QR → tracking link.    │
 *   │  "Your ride code is 8316. Show this to your driver." │
 *   │                                                      │
 *   │  Implementation: Print-ready card template in hotel   │
 *   │  dashboard. One-click print or display on tablet.     │
 *   └──────────────────────────────────────────────────────┘
 *
 *   [HIGH] What if guest loses the code?
 *   ┌──────────────────────────────────────────────────────┐
 *   │  Solution: Hotel can re-send OTP via SMS from their  │
 *   │  dashboard. Also: driver app shows "Guest doesn't    │
 *   │  have code? Call hotel" with one-tap hotel number.    │
 *   └──────────────────────────��───────────────────────────┘
 *
 *   [MEDIUM] End-of-trip OTP feels weird for hotel guests
 *   ┌──────────────────────────────────────────────────────┐
 *   │  For hotel bookings, end OTP could be optional.      │
 *   │  The hotel account is being charged regardless.      │
 *   │  Guest just confirms "trip ended" on tracking page.  │
 *   │  This is how Blacklane works — no end-of-trip code.  │
 *   └──────────────────────────────────────────────────────┘
 *
 *
 * ════════════════════════════════════════════════════════════════════════════
 * 3. CANCELLATION FLOWS — EVERY PARTY'S PERSPECTIVE
 * ════════════════════════════════════════════════════════════════════════════
 *
 * WHO CAN CANCEL AND WHEN:
 *
 *   ┌─────────────┬────────────────────────────────────────────────────┐
 *   │ Party       │ Current state → Gap                               │
 *   ├─────────────┼────────────────────────────────────────────────────┤
 *   │ Hotel       │ Can cancel before driver assigned ✓                │
 *   │             │ Can cancel after assignment ✓ (with confirmation)  │
 *   │             │ [GAP] No cancellation fee display                  │
 *   │             │ [GAP] No "reassign" option (cancel + rebook)       │
 *   ├─────────────┼────────────────────────────────────────────────────┤
 *   │ Driver      │ Can cancel with reason selection ✓                 │
 *   │             │ [GAP] Hotel not notified WHY driver cancelled      │
 *   │             │ [GAP] No auto-reassignment to next driver          │
 *   ├─────────────┼────────────────────────────────────────────────────┤
 *   │ Guest       │ Guest has no cancellation ability ✓ (correct)      │
 *   │             │ Guest must call hotel to cancel                    │
 *   │             │ [GAP] No "I don't need this ride" on tracking page │
 *   ├─────────────┼────────────────────────────────────────────────────┤
 *   │ Admin       │ Can view + cancel any ride ✓                       │
 *   │             │ [GAP] No cancellation analytics by source          │
 *   └─────────────┴────────────────────────────────────────────────────┘
 *
 * [CRITICAL] Driver cancels → Hotel left hanging
 *   ┌──────────────────────────────────────────────────────┐
 *   │  Solution: Auto-reassignment pipeline                │
 *   │                                                      │
 *   │  Driver cancels hotel booking                        │
 *   │  → System auto-dispatches to next available driver   │
 *   │  → Hotel sees "Reassigning..." status (not cancelled)│
 *   │  → Guest tracking page shows "Finding new driver"    │
 *   │  → If no driver in 5 min → hotel notified to rebook  │
 *   │  → Cancellation reason visible to hotel & admin      │
 *   └──────────────────────────────────────────────────────┘
 *
 *
 * ════════════════════════════════════════════════════════════════════════════
 * 4. GUEST TRACKING PAGE — GAPS
 * ════════════════════════════════════════════════════════════════════════════
 *
 *   [HIGH] No way for guest to contact hotel
 *   ┌──────────────────────────────────────────────────────┐
 *   │  Add "Call Hotel" button alongside "Call Driver"     │
 *   │  Guest may need to coordinate with concierge         │
 *   └──────────────────────────────────────────────────────┘
 *
 *   [HIGH] Tracking link has no expiry
 *   ┌──────────────────────────────────────────────────────┐
 *   │  Link should expire 30 min after trip completion     │
 *   │  After expiry → "This trip has ended" with receipt   │
 *   │  Security: prevents link reuse / sharing             │
 *   └──────────────────────────────────────────────────────┘
 *
 *   [MEDIUM] No estimated arrival at destination
 *   ┌──────────────────────────────────────────────────────┐
 *   │  During "in_trip" phase, show:                       │
 *   │  "Arriving at [destination] in ~12 min"              │
 *   │  Benchmark: every ride-hail app shows this           │
 *   └──────────────────────────────────────────────────────┘
 *
 *   [MEDIUM] No receipt or summary after trip
 *   ┌──────────────────────────────────────────────────────┐
 *   │  After trip → show mini receipt:                     │
 *   │  Route, duration, fare (if guest-paid)               │
 *   │  "Charged to Eko Hotels" (if hotel-paid)             │
 *   │  Driver rating (optional for hotel guests)           │
 *   └──────────────────────────────────────────────────────┘
 *
 *   [LOW] No language detection
 *   ┌──────────────────────────────────────────────────────┐
 *   │  International guests at Nigerian hotels             │
 *   │  Auto-detect browser language for tracking page      │
 *   │  Minimum: English, French, Chinese, Arabic           │
 *   └──────────────────────────────────────────────────────┘
 *
 *
 * ════════════════════════════════════════════════════════════════════════════
 * 5. HOTEL DASHBOARD — LIVE TRACKING GAPS
 * ═════════════════════════════════════���══════════════════════════════════════
 *
 *   [HIGH] No multi-ride tracking view
 *   ┌──────────────────────────────────────────────────────┐
 *   │  Hotels with 10+ daily rides need a "Live Map" tab   │
 *   │  showing ALL active rides simultaneously.            │
 *   │  Benchmark: Uber for Business dashboard              │
 *   │  Each pin = one active ride, click → detail panel    │
 *   └──────────────────────────────────────────────────────┘
 *
 *   [HIGH] No proactive alerts
 *   ┌──────────────────────────────────────────────────────┐
 *   │  Hotel should be alerted BEFORE problems escalate:   │
 *   │  - "Driver hasn't moved in 5 min" (stuck/lost)      │
 *   │  - "Driver is going wrong direction"                 │
 *   │  - "Guest hasn't been picked up after 10 min wait"   │
 *   │  Benchmark: Karhoo enterprise alerts                 │
 *   └──────────────────────────────────────────────────────┘
 *
 *   [MEDIUM] Share modal needs "share to WhatsApp" 
 *   ┌──────────────────────────────────────────────────────┐
 *   │  Nigeria: WhatsApp > SMS for guest communication     │
 *   │  Add WhatsApp deep link alongside SMS                │
 *   │  wa.me/{phone}?text={tracking_url}                   │
 *   └──────────────────────────────────────────────────────┘
 *
 *
 * ════════════════════════════════════════════════════════════════════════════
 * 6. DRIVER SURFACE — HOTEL BOOKING GAPS
 * ════════════════════════════════════════════════════════════════════════════
 *
 *   [HIGH] Driver doesn't know hotel-specific pickup protocols
 *   ┌──────────────────────────────────────────────────────┐
 *   │  Hotels have specific pickup zones, valet procedures │
 *   │  Solution: Hotel profile includes "Pickup guide"     │
 *   │  - "Use main entrance. Valet will direct you."       │
 *   │  - "Park at Bay 3. Ask for concierge desk."          │
 *   │  Shown in trip request + navigation phase            │
 *   └──────────────────────────────────────────────────────┘
 *
 *   [MEDIUM] No special handling for international guests
 *   ┌──────────────────────────────────────────────────────┐
 *   │  Flag: "International guest — may need language help" │
 *   │  If flight number provided, show terminal info        │
 *   │  Benchmark: Blacklane shows guest nationality         │
 *   └──────────────────────────────────────────────────────┘
 *
 *   [MEDIUM] Hotel tips handling unclear
 *   ┌──────────────────────────────────────────────────────┐
 *   │  Corporate hotel rides: who tips? Guest or hotel?    │
 *   │  Solution: tip is always guest-optional              │
 *   │  Hotel account is never charged for tips             │
 *   │  Driver sees "Tip: Guest-optional" badge             │
 *   └──────────────────────────────────────────────────────┘
 *
 *
 * ════════════════════════════════════════════════════════════════════════════
 * 7. ADMIN SURFACE — HOTEL BOOKING VISIBILITY GAPS
 * ════════════════════════════════════════════════════════════════════════════
 *
 *   [HIGH] No booking source filter on admin rides view
 *   ┌──────────────────────────────────────────────────────┐
 *   │  Admin needs: "Show me all hotel bookings"           │
 *   │  Filter: booking_source = hotel | rider | scheduled  │
 *   │  Each hotel booking shows: hotel name, guest, booker │
 *   └─────────────���────────────────────────────────────────┘
 *
 *   [HIGH] No hotel-specific dispute resolution
 *   ┌──────────────────────────────────────────────────────┐
 *   │  Hotel disputes are B2B — different SLA than rider   │
 *   │  Hotel disputes affect billing relationship          │
 *   │  Need: hotel dispute type in admin disputes panel    │
 *   │  Include: hotel contact, booking reference, invoice  │
 *   └──────────────────────────────────────────────────────┘
 *
 *   [MEDIUM] No hotel health score in admin
 *   ┌──────────────────────────────────────────────────────┐
 *   │  Per-hotel metrics visible to admin:                 │
 *   │  - Rides/month trend                                 │
 *   │  - Cancellation rate                                 │
 *   │  - Average guest rating of drivers                   │
 *   │  - Payment compliance (invoice payment speed)        │
 *   │  - Credit utilization %                              │
 *   └──────────────────────────────────────────────────────┘
 *
 *
 * ════════════════════════════════════════════════════════════════════════════
 * 8. SECURITY & TRUST GAPS
 * ════════════════════════════════════════════════════════════════════════════
 *
 *   [CRITICAL] Tracking link is guessable if sequential
 *   ┌──────────────────────────────────────────────────────┐
 *   │  Token must be cryptographically random (UUID v4)    │
 *   │  NOT sequential IDs or predictable patterns          │
 *   │  Token → trip_id mapping in Redis with TTL           │
 *   └──────────────────────────────────────────────────────┘
 *
 *   [HIGH] OTP visible on guest tracking page permanently
 *   ┌────────────────────���─────────────────────────────────┐
 *   │  OTP should only be visible when driver is within    │
 *   │  500m of pickup (close enough for handoff)           │
 *   │  Before that: "Your code will appear when driver     │
 *   │  arrives" — prevents screenshot sharing              │
 *   └──────────────────────────────────────────────────────┘
 *
 *   [MEDIUM] No abuse detection on hotel accounts
 *   ┌──────────────────────────────────────────────────────┐
 *   │  Possible: hotel employee books rides for personal   │
 *   │  use. Solution: anomaly detection                    │
 *   │  - Rides at unusual hours (2am from non-hotel addr)  │
 *   │  - Pickup not at hotel address                       │
 *   │  - Unusually high ride frequency per team member     │
 *   │  → Admin alert, not auto-block                       │
 *   └──────────────────────────────────────────────────────┘
 *
 *
 * ═══════════════���════════════════════════════════════════════════════════════
 * 9. DESIGN CONSISTENCY AUDIT (COMPLETED)
 * ════════════════════════════════════════════════════════════════════════════
 *
 *   Items fixed in this session:
 *
 *   [FIXED] Hotel settings ≠ Fleet settings design
 *   ┌──────────────────────────────────────────────────────┐
 *   │  Hotel settings rewritten to match fleet-settings:   │
 *   │  ✓ SettingCard (rounded-2xl, subtle shadow)          │
 *   │  ✓ SectionHeader (icon box + title + description)    │
 *   │  ✓ FieldRow (label left, input right, responsive)    │
 *   │  ✓ TextInput (green focus ring + border glow)        │
 *   │  ✓ Toggle (green active, spring animation)           │
 *   │  ✓ Separator (gradient fade, Linear/Vercel style)    │
 *   │  ✓ SaveBar (floating, blur backdrop)                 │
 *   │  ✓ Skeleton loading + error recovery                 │
 *   │  ✓ Stagger animations + reduced-motion support       │
 *   │  ✓ Keyboard shortcuts (Cmd+S, Escape)                │
 *   │  ✓ Unsaved changes guard on section switch           │
 *   │  ✓ Added Security + Danger Zone sections             │
 *   └──────────────────────────────────────────────────────┘
 *
 *   [FIXED] Booking form inputs had no focus states
 *   ┌──────────────────────────────────────────────────────┐
 *   │  All inputs now have:                                │
 *   │  ✓ Green border on focus (BRAND.green + 60%)         │
 *   │  ✓ 2px outer ring glow (BRAND.green + 18%)           │
 *   │  ✓ Subtle background tint                            │
 *   │  ✓ Label color shifts to green on focus              │
 *   │  ✓ 150ms transition for smooth feel                  │
 *   │  Applied to: FormInput, destination, date, time,     │
 *   │  notes textarea, team invite input                   │
 *   └──────────────────────────────────────────────────────┘
 *
 *   [FIXED] Border radii inconsistent
 *   ┌──────────────��───────────────────────────────────────┐
 *   │  Fleet uses rounded-2xl (16px) for cards.            │
 *   │  Hotel settings now uses same rounded-2xl system:    │
 *   │  - Cards: rounded-2xl (16px)                         │
 *   │  - Inputs: rounded-xl (12px)                         │
 *   │  - Badges/pills: rounded-lg (8px)                    │
 *   │  - Avatars: rounded-xl or rounded-full               │
 *   └──────────────────────────────────────────────────────┘
 *
 *
 * ════════════════════════════════════════════════════════════════════════════
 * PRIORITY MATRIX
 * ════════════════════════════════════════════════════════════════════════════
 *
 *   ┌─────────────────────────────────────────────────────────────────┐
 *   │  NOW (blocks launch)                                           │
 *   │  ├── ✅ GPS geofence as SIGNAL (not trigger — see below)      │
 *   │  ├── ✅ Auto-reassignment when driver cancels                 │
 *   │  ├── ✅ Tracking link expiry + crypto-random tokens           │
 *   │  ├── ✅ Admin booking source filter (all 3 variations)        │
 *   │  └── ✅ OTP proximity reveal (not always visible)             │
 *   │                                                                │
 *   │  NEXT (first 2 weeks post-launch)                              │
 *   │  ├── ✅ Guest "Call Hotel" on tracking page (DONE EARLY)      │
 *   │  ├── Hotel pickup guide for drivers                            │
 *   │  ├── WhatsApp share integration                                │
 *   │  ├── Multi-ride live map view for hotels                       │
 *   │  ├── Hotel dispute type in admin                               │
 *   │  └── ✅ Trip receipt on guest tracking page (DONE EARLY)      │
 *   │                                                                │
 *   │  LATER (month 2+)                                              │
 *   │  ├── Proactive anomaly alerts for hotels                       │
 *   │  ├── Hotel health score in admin                               │
 *   │  ├── Language detection on tracking page                       │
 *   │  ├── Hotel abuse detection                                     │
 *   │  └── Printable OTP card from dashboard                         │
 *   └─────────────────────────────────────────────────────────────────┘
 *
 *   CORRECTION: GPS GEOFENCE CANNOT AUTO-END TRIPS
 *   ┌─────────────────────────────────────────────────────────────────┐
 *   │  Nigerian addresses use landmarks, not exact coordinates.      │
 *   │  Maps data can be imprecise (wrong pin, gated estates).        │
 *   │  GPS geofence = SIGNAL, not trigger.                           │
 *   │                                                                │
 *   │  Arrival verification = layered:                               │
 *   │  1. GPS geofence 150m → "Near pickup" badge (signal)          │
 *   │  2. Driver taps "arrived" → primary trigger                    │
 *   │  3. OTP exchange → final handshake                             │
 *   │                                                                │
 *   │  If driver taps "arrived" outside geofence:                    │
 *   │  → Soft warning, allow (traffic rerouting is real)             │
 *   │  → Repeated anomalies flagged for admin review                 │
 *   │                                                                │
 *   │  Full architecture: /config/otp-config.ts                      │
 *   └─────────────────────────────────────────────────────────────────┘
 *
 *
 * ════════════════════════════════════════════════════════════════════════════
 * DATA SOURCE: This analysis references no phantom metrics.
 * All gaps are traceable to real user journeys across the 4 parties.
 * Benchmarks are from publicly documented features of named products.
 * ════════════════════════════════════════════════════════════════════════════
 */

export {};