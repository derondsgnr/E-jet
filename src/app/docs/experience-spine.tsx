 /**
 * ============================================================================
 * JET — EXPERIENCE SPINE
 * ============================================================================
 *
 * The product and experience companion to the design spine (Variation C "Bold").
 * One living document. Strategy, competitive patterns, flow thinking,
 * ecosystem coherence, and open explorations — all in one place.
 *
 * Structure:
 *   1. Competitive Intelligence — What we learn from who
 *   2. Experience Principles — The rules that govern every decision
 *   3. Core Loop & Flow Architecture — How rides actually work
 *   4. Surface-by-Surface Strategy — What each dashboard IS
 *   5. Ecosystem Coherence — How surfaces talk to each other
 *   6. Open Explorations — Things we're still thinking through
 *   7. The Jet Signature — What makes this feel like ONLY Jet
 *
 * LAST UPDATED: 2026-03-03
 * ============================================================================
 *
 *
 *
 * ┌──────────────────────────────────────────────────────────────────────────┐
 * │  1. COMPETITIVE INTELLIGENCE                                             │
 * │  What we learn from who — patterns, not copies                           │
 * └──────────────────────────────────────────────────────────────────────────┘
 *
 *
 * ── UBER ──────────────────────────────────────────────────────────────────
 *
 * What they do excellently:
 *
 *   ECOSYSTEM COHERENCE
 *   Uber's deepest moat isn't the app — it's that rider, driver, Uber Eats,
 *   Uber for Business, and fleet management all share a unified design
 *   language, account system, and mental model. You learn Uber once, and
 *   every surface feels familiar. The same map, the same card patterns,
 *   the same bottom sheet behavior.
 *
 *   → Jet lesson: Every surface must feel like "the same family." A fleet
 *     owner looking at a ride should see the same route visualization,
 *     same status language, same color coding as the rider and driver.
 *     The map is the shared canvas across ALL six surfaces.
 *
 *   RIDE STATE MACHINE
 *   Uber's ride-in-progress screen is arguably the most refined real-time
 *   UI in consumer software. The state transitions are buttery:
 *   searching → matching (with driver card sliding in) → arriving (car
 *   animation on map) → in-progress (live route) → arriving at destination
 *   → trip complete (fare breakdown slides up) → rating.
 *   Every state has a clear visual identity. You always know where you are.
 *
 *   → Jet lesson: Our ride state machine must be equally clear. Every state
 *     gets its own screen composition. Transitions between states are
 *     animated and unmistakable. The bottom sheet TRANSFORMS — it doesn't
 *     just swap content.
 *
 *   DRIVER MATCHING TRANSPARENCY
 *   The "searching for driver" animation (expanding rings, then driver card
 *   with photo + rating + car details + ETA) builds trust through
 *   progressive disclosure. You go from uncertainty to "I know who's
 *   coming, what they drive, and when they'll arrive" in 10-30 seconds.
 *
 *   → Jet lesson: Matching must feel alive, not loading. Show the search
 *     radius expanding on the map. When matched, the driver reveal should
 *     feel like a moment — not just a card appearing.
 *
 *   SAFETY ARCHITECTURE
 *   Trip sharing, RideCheck (detects unusual stops), emergency button,
 *   driver verification, license plate confirmation. Safety features are
 *   accessible but not anxiety-inducing. They're there when you need them,
 *   invisible when you don't.
 *
 *   → Jet lesson: Our OTP system (handled like Uber's PIN — background
 *     verification, not a front-and-center ceremony) plus trip sharing,
 *     emergency button, and driver verification. Safety as confidence,
 *     not as fear.
 *
 *   PRICING TRANSPARENCY
 *   Upfront pricing was Uber's biggest UX innovation. You know the fare
 *   before you book. Surge pricing is shown clearly with a multiplier.
 *   Fare breakdown after trip: base + distance + time + fees.
 *
 *   → Jet lesson: Upfront pricing is non-negotiable. Fare breakdown must
 *     be Airbnb-level transparent. If there's a surge, explain WHY
 *     (high demand in your area) not just WHAT (1.5x).
 *
 * What they get wrong (Jet's opportunities):
 *   - Surge pricing feels punitive, not transparent
 *   - Driver experience is transactional, not supportive
 *   - No meaningful EV differentiation in most markets
 *   - Vehicle quality inconsistent — no visible quality commitment
 *   - Support is a maze of automated responses
 *   - The app has become bloated (Eats, packages, transit — too much)
 *
 *
 * ── BOLT ──────────────────────────────────────────────────────────────────
 * (Direct competitor — dominant in Nigeria)
 *
 * What they do well:
 *   - Simpler than Uber. Less bloat. Focused on core ride-hailing.
 *   - Lower commission for drivers → better driver supply
 *   - Competitive pricing for riders
 *   - Clean, functional UI (not beautiful, but works)
 *
 * What Nigerian riders complain about:
 *   - DRIVER CANCELLATIONS: The #1 pain point. Drivers accept, then cancel
 *     when the destination isn't profitable enough. Creates massive
 *     frustration and wastes 5-10 minutes per cancellation.
 *   - SURGE PRICING OPACITY: Price jumps with no explanation.
 *   - SAFETY CONCERNS: Especially for women riders at night. Limited
 *     safety features compared to Uber.
 *   - VEHICLE QUALITY: No minimum standard enforcement. You might get
 *     a car with no AC in Lagos heat.
 *   - PAYMENT ISSUES: Card payment failures, wallet top-up friction.
 *     Cash is dominant but creates change/safety issues.
 *
 *   → Jet opportunities (the product wedge):
 *     1. ANTI-CANCELLATION: Smart dispatch that shows drivers the
 *        destination and fare BEFORE they accept. If they accept,
 *        cancellation has real consequences. This alone could be
 *        Jet's killer feature.
 *     2. VEHICLE QUALITY GUARANTEE: Every Jet vehicle is inspected.
 *        EV fleet is inherently higher quality. "Jet Standard" as
 *        a visible quality badge.
 *     3. SAFETY-FIRST: OTP verification, trip sharing, emergency
 *        button, driver verification — safety as a brand pillar,
 *        not a hidden feature.
 *     4. TRANSPARENT PRICING: Airbnb-style fare breakdown. If surge,
 *        explain it. If EV is cheaper (electricity vs fuel), show
 *        the savings.
 *     5. PAYMENT FLEXIBILITY: Cards, wallet, bank transfer, USSD,
 *        cash — meet riders where they are. But make digital
 *        payments delightful enough that riders CHOOSE them.
 *
 *
 * ── INDRIVE ──────────────────────────────────────────────────────────────
 * (Growing in Nigeria — rider-set pricing)
 *
 * What's interesting:
 *   - Riders set their own price, drivers accept or negotiate.
 *   - Creates a marketplace dynamic. Riders feel in control.
 *   - Popular in price-sensitive markets.
 *
 *   → Jet lesson: We're NOT doing negotiated pricing (premium positioning
 *     contradicts haggling). BUT the insight is that riders want to feel
 *     in control of the transaction. Jet can provide this through:
 *     - Clear fare ranges ("typically ₦2,800-₦3,200 for this route")
 *     - EV vs Gas price comparison ("save ₦400 with JET EV")
 *     - Scheduled ride discounts ("book for 7am, save 15%")
 *     Control without negotiation.
 *
 *
 * ── GRAB (Southeast Asia) ──────────────��─────────────────────────────────
 *
 * What's relevant:
 *   - Super-app evolution: started as ride-hailing, expanded to food,
 *     payments, financial services. Similar trajectory opportunity for Jet.
 *   - Vehicle type selection is CORE: bike, car, premium car, taxi, van.
 *     Each has clear icon, ETA, and price. Selection is a horizontal
 *     scroll of cards — not a dropdown.
 *   - GrabPay wallet became a standalone financial product.
 *
 *   → Jet lesson for vehicle selection (answering the strategic question):
 *
 *     ┌─────────────────────────────────────────────────────────────┐
 *     │  VEHICLE SELECTION: CORE BUT NOT FRICTION                   │
 *     │                                                             │
 *     │  Vehicle type IS a core step because EV is Jet's            │
 *     │  differentiator. But it should feel like CHOOSING,          │
 *     │  not configuring.                                           │
 *     │                                                             │
 *     │  The pattern:                                               │
 *     │  1. Rider enters destination                                │
 *     │  2. Map shows route                                         │
 *     │  3. Bottom sheet shows vehicle options as horizontal cards:  │
 *     │     [JET EV ⚡] [JET Go] [JET XL] [JET Premium]            │
 *     │     Each card shows: icon, ETA, fare, and for EV —          │
 *     │     the CO₂ savings vs gas equivalent                       │
 *     │  4. EV is the DEFAULT/first option (brand positioning)      │
 *     │  5. Rider taps to select, then "Confirm Ride"               │
 *     │                                                             │
 *     │  The EV card gets a subtle green accent (the scalpel).      │
 *     │  Over time, learn user preference and pre-select.           │
 *     │  This is ONE screen, ONE interaction. Not a funnel step.    │
 *     │                                                             │
 *     │  If Phase 2 EV is toggled off, the same screen just shows   │
 *     │  gas vehicle types. Nothing breaks. Nothing feels missing.  │
 *     │  The architecture adapts seamlessly.                        │
 *     └─────────────────────────────────────────────────────────────┘
 *
 *
 * ── CAREEM (Middle East/Africa) ──────────────────────────────────────────
 *
 * What's relevant:
 *   - Operated in infrastructure-constrained markets (poor roads, erratic
 *     connectivity, cash-heavy economies). Sound familiar?
 *   - Built robust offline-first patterns. App works on 2G.
 *   - Captain (driver) welfare programs: insurance, savings, bonuses.
 *   - "Careem Pay" wallet became critical for driver payouts.
 *
 *   → Jet lesson: Design for Lagos network conditions. Offline-capable
 *     states, optimistic UI, graceful degradation. Driver financial
 *     features (instant payout, savings tools) build loyalty and reduce
 *     churn.
 *
 *
 * ── GOJEK / GOTO (Indonesia) ────────────────────────────────────────────
 *
 * What's relevant:
 *   - Multi-modal vehicle selection done beautifully: bike, car, taxi,
 *     blue bird (premium). Large icons, clear differentiation.
 *   - Driver "GoPartner" app has genuine career-building tools:
 *     performance analytics, income targets, skill development.
 *   - Their driver app doesn't feel like surveillance — it feels
 *     like a partner tool.
 *
 *   → Jet lesson: The driver app should feel like a CAREER TOOL, not
 *     a dispatch terminal. Earnings goals, performance insights,
 *     and EV training/education features.
 *
 *
 * ── DIDI (China) ─────────────────────────────────────────────────────────
 *
 * What's relevant:
 *   - Most sophisticated AI dispatch system. Ride allocation considers
 *     driver location, traffic, battery level (EV), driver preference,
 *     rider history, and predicted demand 30 minutes ahead.
 *   - Fleet management tools are the most advanced in the industry.
 *     Real-time vehicle health, driver fatigue detection, predictive
 *     maintenance scheduling.
 *   - EV fleet at massive scale — their battery management and charging
 *     station routing is years ahead.
 *
 *   → Jet lesson: Our fleet owner dashboard should aspire to Didi-level
 *     intelligence. Even if V1 is simpler, the information architecture
 *     should accommodate: vehicle health, battery status, charging
 *     recommendations, predictive maintenance, driver performance scoring.
 *
 *
 * ── ADJACENT INSPIRATION ─────────────────────────────────────────────────
 *
 * AIRBNB → Trust architecture
 *   - Host/guest reviews are bilateral — both parties rate each other.
 *   - Price breakdown is completely transparent (nightly rate + fees + taxes).
 *   - "Rare find" and social proof ("3 others looking at this") create urgency
 *     without manipulation.
 *   - Host dashboard: earnings + calendar + booking management. Clean, actionable.
 *   → Maps to: Rider/driver bilateral ratings. Fare transparency. Fleet owner
 *     dashboard as "host dashboard for vehicles."
 *
 * STRIPE DASHBOARD → Financial analytics
 *   - Revenue, payouts, balance — all at a glance.
 *   - Beautiful charts that actually inform decisions.
 *   - Payout scheduling with clear timelines.
 *   → Maps to: Driver earnings dashboard, fleet owner revenue, admin financials.
 *
 * LINEAR → Information density
 *   - Every pixel earns its place. Dense but breathable.
 *   - Keyboard shortcuts for power users. Command palette.
 *   - Status workflows with clear visual language.
 *   → Maps to: Admin dashboard, fleet management views.
 *
 * APPLE MAPS → Map interaction
 *   - Bottom sheet with detents (peek, half, full).
 *   - Turn-by-turn with clear upcoming maneuver.
 *   - Search that feels instant with local results.
 *   → Maps to: All map-centric screens (rider, driver, fleet).
 *
 *
 *
 * ┌──────────────────────────────────────────────────────────────────────────┐
 * │  2. EXPERIENCE PRINCIPLES                                                │
 * │  The rules that govern every UX decision across all six surfaces         │
 * └──────────────────────────────────────────────────────────────────────────┘
 *
 * Derived from competitive analysis + northstar DNA + Jet's positioning.
 *
 *
 * PRINCIPLE 1: EVERY SECOND IS EARNED
 * ────────────────────────────────────
 * The core ride booking flow must be completable in under 15 seconds
 * for a returning user. Every tap, every screen, every animation must
 * justify its existence. If removing something doesn't hurt comprehension,
 * it was waste.
 *
 * What this means in practice:
 * - Destination search remembers and predicts. Recent/saved/suggested.
 * - Vehicle selection is one tap, not a scroll-then-tap.
 * - Confirmation is one tap. No "Are you sure?" for booking a ride.
 * - The app learns: frequent routes surface first, preferred vehicle
 *   type pre-selected, payment method remembered.
 *
 * Northstar test: Could an Apple designer justify this step existing?
 *
 *
 * PRINCIPLE 2: TRUST IS THE PRODUCT
 * ──────────────────────────────────
 * In Nigeria's ride-hailing market, trust is the primary purchase decision.
 * Not price, not speed — TRUST. Will the driver show up? Is the car safe?
 * Will I be overcharged? Am I safe as a woman riding alone at night?
 *
 * What this means in practice:
 * - Driver verification is visible (verified badge, not hidden).
 * - Vehicle details shown BEFORE driver arrives (plate, color, model).
 * - Real-time trip sharing is one tap, prominent, not buried in a menu.
 * - Fare is locked upfront. No surprises. Breakdown available.
 * - OTP verification runs silently but the security icon is visible.
 * - Emergency button accessible from any ride-active screen.
 * - Rating is bilateral: riders rate drivers, drivers rate riders.
 *   This creates mutual accountability.
 *
 * Northstar test: Would Airbnb consider this transparent enough?
 *
 *
 * PRINCIPLE 3: THE MAP IS THE WORLD
 * ──────────────────────────────────
 * The map is not a widget, not a card, not a supporting visual.
 * It IS the primary canvas. Everything else floats on it.
 * The map creates spatial context — where am I, where am I going,
 * where is my driver, how does my route look.
 *
 * What this means in practice:
 * - Rider home: full-bleed map, UI floats via glass/sheets.
 * - Driver home: full-bleed map, earnings overlay, ride request overlay.
 * - Fleet dashboard: map is the hero card, 40-60% of screen.
 * - Hotel dashboard: map shows active guest rides in real-time.
 * - Admin: live operations map is the command center hero.
 * - The same map component, same route visualization, same markers
 *   appear across ALL surfaces. Unified spatial language.
 *
 * Northstar test: Does this feel like Apple Maps-level spatial design?
 *
 *
 * PRINCIPLE 4: STATES, NOT SCREENS
 * ─────────────────────────────────
 * A ride is a state machine, not a collection of screens. The UI
 * TRANSFORMS as the ride progresses. The bottom sheet morphs, the map
 * adjusts, the header evolves. You never feel "taken to a new page" —
 * you feel the ride progressing around you.
 *
 * The ride state machine:
 *
 *   IDLE → SEARCHING → DESTINATION_SET → VEHICLE_SELECTED →
 *   CONFIRMING → MATCHING → DRIVER_ASSIGNED → DRIVER_EN_ROUTE →
 *   DRIVER_ARRIVING → PICKUP_OTP → IN_PROGRESS → APPROACHING_DEST →
 *   DROPOFF_OTP → COMPLETE → RATING → RECEIPT
 *
 * Each state has:
 *   - A distinct bottom sheet composition
 *   - A map state (zoom level, markers, route line, camera angle)
 *   - A header state (what's shown, what actions are available)
 *   - Entry animation (how we arrive at this state)
 *   - Edge states (what can go wrong, how we recover)
 *
 * What this means in practice:
 * - The bottom sheet doesn't DISAPPEAR and REAPPEAR — it TRANSFORMS.
 * - The map camera smoothly transitions between states.
 * - Information is added/removed progressively, not swapped wholesale.
 * - Every state has an exit: cancel, help, call driver, emergency.
 *
 * Northstar test: Is this as fluid as Linear's status transitions?
 *
 *
 * PRINCIPLE 5: PREMIUM IS IN THE DETAILS
 * ───────────────────────────────────────
 * Jet's premium positioning comes from the accumulation of small
 * refinements, not from one flashy feature. It's the micro-interaction
 * when you select a vehicle. The smooth count-up animation on your
 * earnings. The haptic feedback when your driver arrives. The gradient
 * on the EV badge. The sound design on ride completion.
 *
 * What this means in practice:
 * - Number animations on metrics (count-up, not instant)
 * - Map car icon rotates smoothly along the route
 * - Skeleton → content transitions (never flash of empty state)
 * - Pull-to-refresh with brand-moment animation
 * - Ride completion celebration (subtle, not confetti)
 * - EV rides get a distinct completion moment (CO₂ saved callout)
 *
 * Northstar test: Would this pass Jony Ive's "inevitable" test?
 *
 *
 * PRINCIPLE 6: ONE PLATFORM, SIX WINDOWS
 * ───────────────────────────────────────
 * Rider, Driver, Fleet Owner, Hotel, Admin, and the marketing website
 * are not six separate products. They are six windows into ONE platform.
 * An action in one window creates a ripple in others. The design
 * language, terminology, status colors, map style, and component DNA
 * are shared. A fleet owner looking at a ride should recognize the
 * same route visualization the rider sees.
 *
 * What this means in practice:
 * - Shared component library: map, route viz, status badges, ride cards
 * - Shared terminology: "JET EV" not "Electric Vehicle" in one place
 *   and "EV" in another. "Trip" or "Ride" — pick one, use everywhere.
 * - Shared status colors: green = active/online, amber = pending,
 *   red = issue, blue = informational. Same everywhere.
 * - Shared motion language: same easing curves, same stagger patterns.
 * - When a ride state changes, EVERY surface watching that ride updates.
 *
 * Northstar test: Does this feel as cohesive as the Apple ecosystem?
 *
 *
 * PRINCIPLE 7: GRACEFUL ALWAYS
 * ────────────────────────────
 * Lagos has 2G dead zones. Phones overheat in traffic. Payments fail.
 * Drivers cancel. GPS drifts. The app will be used in imperfect
 * conditions by people who are often stressed (running late, in traffic,
 * in an unfamiliar area). Grace under pressure is the UX mandate.
 *
 * What this means in practice:
 * - Optimistic UI: show the action succeeded, roll back if it didn't.
 * - Offline states: if connectivity drops mid-ride, show last known
 *   state with "Reconnecting..." — never a blank screen.
 * - Payment fallback: if card fails, offer wallet. If wallet fails,
 *   offer bank transfer. If all digital fails, allow cash. Never a
 *   dead end.
 * - Driver cancel recovery: immediately re-enter matching, show
 *   "Finding you another driver" — not an error screen.
 * - Every error has a recovery path. Every loading state has a skeleton.
 *   Every empty state has a CTA.
 *
 * Northstar test: Would this survive Careem's infrastructure stress tests?
 *
 *
 *
 * ┌──────────────────────────────────────────────────────────────────────────┐
 * │  3. CORE LOOP & FLOW ARCHITECTURE                                        │
 * │  How rides actually work, end to end                                     │
 * └──────────────────────────────────────────────────────────────────────────┘
 *
 *
 * ── THE RIDER CORE LOOP ──────────────────────────────────────────────────
 *
 * This is the atomic interaction Jet must nail. Everything else is
 * supporting infrastructure. If this flow isn't world-class, nothing
 * else matters.
 *
 *   ┌─────────────────────────────────────────────────────────┐
 *   │                                                         │
 *   │  OPEN APP                                               │
 *   │    ↓                                                    │
 *   │  HOME (map + "Where to?" + recent/saved places)         │
 *   │    ↓ tap search / tap recent / tap saved                │
 *   │  DESTINATION SEARCH                                     │
 *   │    ↓ select destination                                 │
 *   │  ROUTE PREVIEW + VEHICLE SELECTION                      │
 *   │    Map shows route. Bottom sheet shows vehicle options:  │
 *   │    [JET EV ⚡ ₦2,800 · 4 min]                          │
 *   │    [JET Go    ₦3,200 · 3 min]                          │
 *   │    [JET XL    ₦4,500 · 6 min]                          │
 *   │    EV is default/first. Shows savings vs gas.           │
 *   │    ↓ select vehicle + "Confirm Ride"                    │
 *   │  MATCHING                                               │
 *   │    Search animation on map. "Finding your driver..."    │
 *   │    ↓ driver found                                       │
 *   │  DRIVER ASSIGNED                                        │
 *   │    Driver card: photo, name, rating, car, plate, ETA.   │
 *   │    Map shows driver moving toward you.                  │
 *   │    Actions: call, message, cancel, share trip.          │
 *   │    ↓ driver arrives                                     │
 *   │  PICKUP                                                 │
 *   │    "Your driver is here." OTP verified in background.   │
 *   │    ↓                                                    │
 *   │  IN PROGRESS                                            │
 *   │    Live route on map. ETA updating.                     │
 *   │    Actions: share trip, emergency, call driver.         │
 *   │    ↓ approaching destination                            │
 *   │  ARRIVING                                               │
 *   │    "Almost there." Dropoff OTP completes silently.      │
 *   │    ↓                                                    │
 *   │  TRIP COMPLETE                                          │
 *   │    Fare breakdown. Rating. Tip option.                  │
 *   │    EV rides: "You saved Xg CO₂ on this trip ⚡"        │
 *   │    ↓                                                    │
 *   │  HOME (loop restarts)                                   │
 *   │                                                         │
 *   └─────────────────────────────────────────────────────────┘
 *
 * Target: Open → Ride confirmed in ≤4 taps for returning users.
 *         (tap "Where to?" → tap recent destination → tap vehicle → confirm)
 *
 *
 * ── THE DRIVER CORE LOOP ─────────────────────────────────────────────────
 *
 *   ┌─────────────────────────────────────────────────────────┐
 *   │                                                         │
 *   │  OPEN APP                                               │
 *   │    ↓                                                    │
 *   │  HOME (map + earnings summary + "Go Online" CTA)        │
 *   │    Offline: earnings recap, performance, tips.           │
 *   │    ↓ tap "Go Online"                                    │
 *   │  ONLINE / WAITING                                       │
 *   │    Map centered on location. "Waiting for rides..."     │
 *   │    Demand heatmap visible (where rides are needed).     │
 *   │    ↓ ride request arrives                               │
 *   │  RIDE REQUEST                                           │
 *   │    CRITICAL: Shows pickup, destination, fare, distance, │
 *   │    estimated time BEFORE driver accepts. This is the    │
 *   │    anti-cancellation design. Informed acceptance.       │
 *   │    Timer: accept within 15 seconds or it passes.        │
 *   │    ↓ accept                                             │
 *   │  EN ROUTE TO PICKUP                                     │
 *   │    Navigation to rider. Rider details visible.          │
 *   │    ↓ arrive at pickup                                   │
 *   │  AT PICKUP                                              │
 *   │    Enter rider's OTP. Confirms correct passenger.       │
 *   │    ↓ OTP verified                                       │
 *   │  RIDE IN PROGRESS                                       │
 *   │    Navigation to destination. Fare accruing.            │
 *   │    ↓ arrive at destination                              │
 *   │  COMPLETING RIDE                                        │
 *   │    Dropoff OTP. Fare confirmed. Rating.                 │
 *   │    ↓                                                    │
 *   │  ONLINE / WAITING (loop restarts)                       │
 *   │    Updated earnings. Streak progress if applicable.     │
 *   │                                                         │
 *   └─────────────────────────────────────────────────────────┘
 *
 * Key driver UX insight: The ride request screen is the most important
 * screen in the driver app. It must convey pickup location, destination,
 * fare, and estimated time in under 3 seconds of glance time. Drivers
 * are often driving when this appears. Visual hierarchy is SAFETY.
 *
 *
 * ── EDGE STATES (the ones that actually matter) ──────────────────────────
 *
 * NO DRIVERS AVAILABLE
 *   Don't just say "No drivers found." Show:
 *   - "Drivers are busy in your area right now"
 *   - Estimated wait time if they retry
 *   - Option to schedule for later
 *   - Option to expand search (slight fare increase, wider radius)
 *   - Demand heatmap showing where drivers are
 *
 * DRIVER CANCELS AFTER ACCEPTING
 *   - Automatically re-enter matching. No "OK" to dismiss.
 *   - "Finding you another driver" — seamless recovery.
 *   - If second driver cancels, offer: try again / schedule / different vehicle type
 *   - Track cancellation patterns per driver (admin visibility)
 *
 * PAYMENT FAILS
 *   - Card declined → "Try another card" + wallet option
 *   - Wallet insufficient → "Top up" inline + bank transfer option
 *   - All digital fails → cash option (with "Digital payment recommended" nudge)
 *   - NEVER block the ride completion. Resolve payment post-ride if needed.
 *
 * CONNECTIVITY DROPS
 *   - Show last known state. "Reconnecting..."
 *   - Ride continues server-side regardless of client connectivity.
 *   - On reconnect, sync state smoothly (no jarring jumps).
 *   - Critical actions (accept ride, start ride, complete ride) queue
 *     locally and push when connected.
 *
 * GPS DRIFT
 *   - Pin location adjustment ("Adjust your pickup spot")
 *   - Landmark-based pickup ("I'm at the gate of XYZ building")
 *   - Driver and rider can see each other's location to self-coordinate
 *
 *
 *
 * ┌──────────────────────────────────────────────────────────────────────────┐
 * │  4. SURFACE-BY-SURFACE STRATEGY                                          │
 * │  What each dashboard IS — its soul, not just its features                │
 * └──────────────────────────────────────────────────────────────────────────┘
 *
 *
 * ── RIDER APP ────────────────────────────────────────────────────────────
 *
 * Soul: "Your trusted mobility companion."
 * Feeling: Premium, confident, effortless. Like being picked up by a friend
 *          who always knows the way.
 * Primary JTBD: Get from A to B safely, quickly, and predictably.
 * Secondary JTBD: Feel good about choosing sustainable transport.
 * Surface: Mobile-first (iOS/Android web wrapper or native).
 * Design: Variation C "Bold" spine — map-centric, information-rich,
 *         stat cards for engagement, route viz for transparency.
 *
 * Key screens:
 *   - Home (locked: Variation C)
 *   - Destination search
 *   - Route preview + vehicle selection
 *   - Ride matching
 *   - Ride in progress
 *   - Trip complete + rating
 *   - Ride history
 *   - Payment methods
 *   - Profile & settings
 *   - Saved places
 *   - Scheduled rides
 *   - Trip sharing (active ride)
 *   - Support
 *
 *
 * ── DRIVER APP ───────────────────────────────────────────────────────────
 *
 * Soul: "Your career tool."
 * Feeling: Empowering, transparent, respectful. This isn't a dispatch
 *          terminal — it's a partner app that helps you earn more,
 *          drive smarter, and build a sustainable income.
 * Primary JTBD: Earn money efficiently and safely.
 * Secondary JTBD: Understand my performance and grow.
 * Surface: Mobile-first.
 * Design: Same C "Bold" DNA as rider but earnings-focused. Dashboard
 *         energy on a mobile screen — today's earnings as the hero metric,
 *         ride requests as the primary interaction.
 *
 * Key screens:
 *   - Home (offline: earnings recap, online: waiting + heatmap)
 *   - Ride request (the most critical screen — see above)
 *   - Navigation (en route to pickup, en route to destination)
 *   - Earnings dashboard (daily/weekly/monthly, trends, goals)
 *   - Ride history
 *   - Performance / ratings
 *   - Vehicle management (docs, inspection, battery status for EV)
 *   - Profile & settings
 *   - Support
 *   - EV: charging station finder + battery management
 *
 *
 * ── FLEET OWNER DASHBOARD ────────────────────────────────────────────────
 *
 * How would Apple, Linear, and Airbnb think about this?
 *
 * APPLE would say: "What is the ONE thing a fleet owner needs to know
 * when they open this? Start there. Everything else is progressive
 * disclosure." → The answer is: "How much money did my fleet make
 * today, and are all my vehicles working?"
 *
 * LINEAR would say: "Show everything at once, but with ruthless
 * hierarchy. Dense information, clear priority. Keyboard shortcuts
 * for power users. Command palette." → Fleet owners with 50+ vehicles
 * need speed and density.
 *
 * AIRBNB (host dashboard) would say: "Revenue first. Calendar second.
 * Actionable items third. Never more than one action needed to resolve
 * any issue." → The fleet dashboard should surface problems that need
 * attention, not just display data.
 *
 * Soul: "Your fleet's command center."
 * Feeling: In control, informed, efficient. Like a well-run cockpit —
 *          everything you need, nothing you don't.
 * Primary JTBD: Maximize ROI on my vehicles.
 * Secondary JTBD: Keep my fleet running smoothly (maintenance, compliance).
 * Surface: Web-first (desktop), responsive to tablet.
 * Design: Linear/Vercel clinical dashboard. Card-based grid. Map as
 *         hero card showing live fleet positions.
 *
 * Default view philosophy:
 *   The fleet owner opens this in the MORNING (Apple thinking) and
 *   checks it THROUGHOUT THE DAY (Linear thinking). So the default
 *   is a morning dashboard — today's snapshot — with one-click access
 *   to real-time monitoring when they need to go deep.
 *
 *   Morning view: Today's revenue / Active vehicles / Driver performance
 *   Real-time view: Live map / Vehicle positions / Active rides
 *   Weekly view: Revenue trends / Utilization rates / Maintenance schedule
 *
 * Key screens:
 *   - Overview (morning dashboard: revenue, active vehicles, alerts)
 *   - Fleet map (real-time vehicle positions, status, routes)
 *   - Vehicles (list: status, earnings, battery, maintenance due)
 *   - Drivers (list: performance, ratings, earnings, online status)
 *   - Revenue & analytics (charts, trends, per-vehicle P&L)
 *   - Maintenance (schedule, alerts, inspection status)
 *   - Settings
 *
 *
 * ── HOTEL DASHBOARD ──────────────────────────────────────────────────────
 *
 * How would our northstars think about this?
 *
 * AIRBNB would say: "The hotel staff's job is to make the GUEST happy.
 * Every screen should be oriented around guest experience, not fleet
 * management. The hotel doesn't care about vehicle utilization — they
 * care about 'Did my guest get picked up on time?'"
 *
 * APPLE would say: "A concierge at a premium hotel should be able to
 * book a ride for a guest in under 30 seconds. The interface should
 * feel like an extension of the hotel's own service, not a third-party
 * tool."
 *
 * Soul: "Seamless guest mobility, by your hotel."
 * Feeling: Hospitality-grade. This should feel like a natural extension
 *          of the hotel's concierge service, not a ride-hailing dashboard.
 * Primary JTBD: Get my guest from hotel to destination (and back) smoothly.
 * Secondary JTBD: Track all guest transportation for billing/reporting.
 * Surface: Web (tablet-friendly for concierge desk use).
 *
 * Two booking models (both supported):
 *   MODEL A — CONCIERGE BOOKS (default):
 *     Hotel staff enters guest name + destination → ride booked.
 *     Guest receives SMS/WhatsApp with ride details and tracking link.
 *     Guest never needs Jet account. Frictionless.
 *     Hotel is billed, not the guest.
 *
 *   MODEL B — GUEST SELF-SERVICE:
 *     Hotel sends guest a magic link (SMS/WhatsApp/QR code).
 *     Guest opens link → lightweight ride booking interface.
 *     No app download, no account creation needed.
 *     Guest can choose to create full Jet account after (conversion funnel).
 *     Guest or hotel is billed (configurable per hotel).
 *
 * Key screens:
 *   - Active rides (live: which guests are in transit)
 *   - Book a ride (for a guest: destination, vehicle type, notes)
 *   - Guest history (past rides by guest name/room)
 *   - Billing (monthly invoice, ride-by-ride breakdown)
 *   - Settings (hotel details, staff permissions, billing config)
 *
 *
 * ── ADMIN DASHBOARD ──────────────────────────────────────────────────────
 *
 * How would our northstars handle this?
 *
 * LINEAR would say: "The admin's job is to keep the machine running.
 * Surface anomalies. Make every metric actionable. Dense, keyboard-
 * navigable, zero wasted space."
 *
 * VERCEL would say: "Real-time is the default. The admin should FEEL
 * the platform's pulse. Deployments (rides) happening, errors (issues)
 * surfacing, performance (metrics) updating — all live."
 *
 * Soul: "The platform's nerve center."
 * Feeling: Powerful, vigilant, fast. Like a Bloomberg terminal for
 *          mobility — dense, real-time, actionable.
 * Primary JTBD: Is the platform healthy right now? (operational)
 * Secondary JTBD: How is the business performing over time? (analytical)
 * Surface: Web-first, large screen optimized.
 *
 * Home view is OPERATIONAL-FIRST (command center):
 *   Live: Active rides, driver supply, surge zones, open issues
 *   Today: Completed rides, revenue, new signups, cancellation rate
 *   Action items: Pending verifications, disputed rides, support tickets
 *
 * Analytics is a DRILL-DOWN (separate section):
 *   Revenue trends, user growth, ride patterns, fleet utilization,
 *   geographic heat maps, cohort analysis.
 *
 * Key screens:
 *   - Command center (live operations overview)
 *   - Users (riders + drivers: search, filter, CRUD, verification status)
 *   - Rides (live, history, disputes, cancellation tracking)
 *   - Fleet (vehicles, inspections, EV fleet status, maintenance)
 *   - Revenue & finance (earnings, payouts, commissions, billing)
 *   - Analytics & reports (trends, cohorts, geography, predictions)
 *   - Support tickets (queue, escalation, resolution)
 *   - Settings & config (pricing, zones, vehicle types, commission rates)
 *
 *
 * ── MARKETING WEBSITE ────────────────────────────────────────────────────
 *
 * Soul: "The promise."
 * Feeling: Bold, confident, aspirational. This is where the brand lives
 *          at full volume. Every other surface is functional; the website
 *          is emotional.
 * Primary JTBD: Convince riders to download, drivers to sign up,
 *               fleet owners to partner, hotels to integrate.
 * Surface: Responsive web (mobile → desktop).
 *
 * Key pages:
 *   - Hero / home (brand story, app download CTA, EV narrative)
 *   - Ride with Jet (rider benefits, safety, pricing transparency)
 *   - Drive with Jet (driver benefits, earnings potential, EV fleet)
 *   - Fleet partnerships (fleet owner value prop, dashboard preview)
 *   - Hotel partnerships (hotel integration value prop)
 *   - About (mission, team, sustainability commitment)
 *   - Safety (trust + safety features)
 *   - Support / contact
 *
 *
 *
 * ┌──────────────────────────────────────────────────────────────────────────┐
 * │  5. ECOSYSTEM COHERENCE                                                  │
 * │  How one ride ripples across all six surfaces                            │
 * └──────────────────────────────────────────────────────────────────────────┘
 *
 * A SINGLE RIDE creates events across FIVE surfaces simultaneously.
 * This is the "one platform, six windows" principle in action.
 *
 *   ┌─────────────────────────────────────────────────────────────────┐
 *   │                                                                 │
 *   │  Rider books ride                                               │
 *   │    ├── Rider app: "Searching for driver..."                     │
 *   │    ├── Admin:     ride appears in live feed                     │
 *   │    └── (if hotel booked): Hotel dashboard: "Ride dispatched"    │
 *   │                                                                 │
 *   │  Driver accepts                                                 │
 *   │    ├── Rider app: driver card appears, map shows driver         │
 *   │    ├── Driver app: navigation to pickup starts                  │
 *   │    ├── Fleet owner: vehicle status → "On ride"                  │
 *   │    ├── Admin:       ride status → "Driver assigned"             │
 *   │    └── Hotel:       "Driver en route to guest"                  │
 *   │                                                                 │
 *   │  Ride in progress                                               │
 *   │    ├── Rider app: live route tracking                           │
 *   │    ├── Driver app: navigation to destination                    │
 *   │    ├── Fleet owner: vehicle moving on map, fare accruing        │
 *   │    ├── Admin:       ride active, contributing to metrics        │
 *   │    └── Hotel:       "Guest in transit"                          │
 *   │                                                                 │
 *   │  Ride completes                                                 │
 *   │    ├── Rider app:   fare breakdown, rating, tip                 │
 *   │    ├── Driver app:  earnings updated, rating received           │
 *   │    ├── Fleet owner: vehicle revenue updated, vehicle free       │
 *   │    ├── Admin:       ride → completed, revenue updated           │
 *   │    └── Hotel:       "Guest arrived safely", billing updated     │
 *   │                                                                 │
 *   └─────────────────────────────────────────────────────────────────┘
 *
 * SHARED LANGUAGE DICTIONARY:
 *   Ride status:  Requested → Matched → En route → In progress → Completed
 *   Driver status: Offline → Online → On ride → Returning
 *   Vehicle status: Available → On ride → Charging → Maintenance → Offline
 *   Payment status: Pending → Processing → Completed → Failed → Refunded
 *
 *   These terms are IDENTICAL across all surfaces. A "Matched" ride
 *   looks the same (same badge color, same icon, same word) whether
 *   you're a rider, fleet owner, or admin.
 *
 * SHARED VISUAL LANGUAGE:
 *   Status colors:
 *     Green (#1DB954): Active, online, completed, success
 *     Amber (#F59E0B): Pending, matching, in progress, warning
 *     Red (#D4183D):   Cancelled, issue, emergency, error
 *     Blue (#3B82F6):  Informational, scheduled, navigating
 *     Gray (#737373):  Offline, inactive, historical
 *
 *   These color meanings are IDENTICAL across all surfaces.
 *
 *
 *
 * ┌──────────────────────────────────────────────────────────────────────────┐
 * │  6. OPEN EXPLORATIONS                                                    │
 * │  Things we're still thinking through                                     │
 * └──────────────────────────────────────────────────────────────────────────┘
 *
 *
 * ── LOYALTY / ENGAGEMENT (light exploration) ─────────────────────────────
 *
 * Not a heavy gamification system. Jet is premium, not a game.
 * But light engagement hooks that reward consistent usage:
 *
 * Option A: "JET Miles"
 *   - Every ride earns miles. EV rides earn 2x.
 *   - Miles unlock: priority matching, fare discounts, premium vehicle
 *     upgrades, airport lounge access (partnership).
 *   - Tiers: JET → JET Plus → JET Elite (based on monthly rides).
 *   - Visible in home screen stat card (already have this in Var C).
 *
 * Option B: "Carbon Wallet"
 *   - Focus loyalty around sustainability narrative.
 *   - Track cumulative CO₂ saved (already in Var C's stat cards).
 *   - Milestones: "50kg CO₂ saved" → badge + small reward.
 *   - Shareable on social media (brand amplification).
 *   - No tiers. Just an ever-growing positive impact number.
 *
 * Option C: Hybrid
 *   - JET Miles for economic rewards (discounts, upgrades).
 *   - Carbon tracking for emotional rewards (impact, sharing).
 *   - Both visible in home screen stat area.
 *   - Premium users get both. Light, not bloated.
 *
 * Current leaning: Option C (hybrid). It serves both motivations —
 * "save money" AND "feel good." The Var C stat cards already have
 * the visual real estate for this.
 *
 *
 * ── CORPORATE RIDES ──────────────────────────────────────────────────────
 *
 * Re-reading the PRD, here's what I interpret:
 *
 * The PRD describes a "Corporate Rider" persona as a sub-type of rider
 * who needs corporate billing, ride history, and reliability. The JET
 * value is a "corporate dashboard" and "invoice automation."
 *
 * My interpretation: This is TWO things:
 *
 *   1. RIDER-SIDE: A "Business" profile within the rider app (like Uber
 *      for Business). Employee has their personal Jet account but can
 *      switch to their company's payment method. Rides taken on the
 *      business profile are billed to the company, not the individual.
 *      The rider experience is identical — same app, same flow, just
 *      different payment source.
 *
 *   2. COMPANY-SIDE: A lightweight web dashboard where the company's
 *      admin manages: employee list, spending limits, approved routes,
 *      invoices, ride reports. This could be a sub-section of the
 *      admin dashboard OR a standalone "Jet for Business" portal.
 *
 * Recommendation: For V1, the rider-side business profile toggle is
 * a must (it's just a payment method + tagging). The company-side
 * dashboard can be a simplified version of the admin dashboard,
 * potentially a 7th surface — or a "Business" tab within the admin.
 * Let's design the rider-side for launch and leave architecture space
 * for the company dashboard.
 *
 *
 * ── SCHEDULING & ADVANCE BOOKING ─────────────────────────────────────────
 *
 * The PRD doesn't emphasize this but it's table stakes and especially
 * valuable for the hotel use case and corporate use case.
 *
 * Pattern: "Book for later" as a secondary CTA on the vehicle selection
 * screen. Calendar + time picker → confirmed scheduled ride. Reminder
 * notification 15 minutes before. Auto-dispatch at scheduled time.
 *
 * For hotels: the primary booking mode IS scheduling ("Guest needs
 * pickup at 7am tomorrow for airport").
 *
 *
 * ── DRIVER INCENTIVES & ANTI-CANCELLATION ────────────────────────────────
 *
 * The anti-cancellation design (showing destination + fare before accept)
 * is a product decision with major implications:
 *
 * Pros:
 *   - Dramatically reduces cancellations (driver makes informed choice)
 *   - Builds rider trust (if driver accepted, they're coming)
 *   - Fairer for drivers (no surprise 45-min trips)
 *
 * Cons:
 *   - Drivers may cherry-pick profitable routes, leaving underserved areas
 *   - Need "acceptance rate" as a metric — too much decline = consequences
 *
 * Mitigation: Incentive multipliers for underserved routes/times.
 * "Earn 1.5x on rides from [area]." Visible in driver home screen.
 *
 *
 *
 * ┌──────────────────────────────────────────────────────────────────────────┐
 * │  7. THE JET SIGNATURE                                                    │
 * │  What makes this feel like ONLY Jet                                      │
 * └──────────────────────────────────────────────────────────────────────────┘
 *
 * Five moments that no other e-hailing app does, that become synonymous
 * with the Jet brand:
 *
 * 1. THE EV CHOICE MOMENT
 *    When selecting a vehicle, the EV option shows a real-time comparison:
 *    "JET EV: ₦2,800 · Save ₦400 vs gas · 12g CO₂ saved"
 *    This isn't a hidden stat — it's front and center on the selection card.
 *    Over time, you build a cumulative savings number. "You've saved
 *    ₦34,000 and 2.4kg CO₂ by choosing JET EV."
 *    Nobody else does this. It makes sustainability tangible and personal.
 *
 * 2. THE TRUST REVEAL
 *    When your driver is assigned, the reveal is a MOMENT, not just a card.
 *    Driver photo, name, rating, car model, plate — but also: "Verified ✓"
 *    badge, "3,000+ rides" experience badge, and for EV: the vehicle's
 *    cleanliness rating. Progressive disclosure builds anticipation and trust.
 *    A subtle, confident animation. Not flashy — inevitable.
 *
 * 3. THE ARRIVAL PULSE
 *    When your driver is 1 minute away, the map zooms in smoothly,
 *    the car icon enlarges slightly, and a subtle pulse emanates from
 *    your pickup point. Your phone vibrates gently. "Your JET is arriving."
 *    This micro-moment turns a stressful wait into a confident knowing.
 *
 * 4. THE GREEN RECEIPT
 *    Every completed ride shows a receipt. EV rides get a special
 *    "Green Receipt" variant — same fare breakdown, but at the top:
 *    "This ride was powered by clean energy ⚡" with a small
 *    environmental impact stat. Shareable. Subtle but ownable.
 *    Riders WANT to share this. Free brand amplification.
 *
 * 5. THE MORNING DASHBOARD (Fleet Owner)
 *    Fleet owners open the app to a personalized morning briefing:
 *    "Good morning. Your fleet earned ₦2.4M yesterday. 12/15 vehicles
 *    active. 1 maintenance alert." Dense, warm, actionable. It treats
 *    the fleet owner as a business partner, not a user. Nobody in
 *    Nigerian e-hailing gives fleet owners this level of respect.
 *
 *
 *
 * ============================================================================
 * WHAT WE BUILD NEXT — SURFACE PRIORITY
 * ============================================================================
 *
 * We've locked the Rider Home (Variation C). The build sequence should
 * follow the core loop — what's needed for one complete ride to flow
 * through the system:
 *
 * PHASE 1: Complete Rider Flow (the core product)
 *   1. Destination search
 *   2. Route preview + vehicle selection (the EV choice moment)
 *   3. Matching + driver assigned
 *   4. Ride in progress
 *   5. Trip complete + rating
 *
 * PHASE 2: Driver App (can't have riders without drivers)
 *   6. Driver home (online/offline, earnings)
 *   7. Ride request (the critical screen)
 *   8. Navigation/active ride
 *
 * PHASE 3: Supporting Dashboards
 *   9.  Fleet owner dashboard
 *   10. Hotel dashboard
 *   11. Admin dashboard
 *
 * PHASE 4: Marketing + Polish
 *   12. Landing page / website
 *   13. Onboarding flows (rider + driver)
 *   14. Settings, profile, history screens
 *
 * Each screen gets the Design Lab treatment (3 variations) for critical
 * screens, or goes straight to build for supporting screens.
 *
 * ============================================================================
 */

export {};
