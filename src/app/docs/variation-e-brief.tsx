/**
 * ┌─────────────────────────────────────────────────────────────────────┐
 * │  VARIATION E — "Fleet Command" · Design Brief                      │
 * │  Date: 14 Mar 2026                                                 │
 * └─────────────────────────────────────────────────────────────────────┘
 *
 * ══════════════════════════════════════════════════════════════════════
 * 1. TARGET USER AUDIT
 * ══════════════════════════════════════════════════════════════════════
 *
 * WHO: Fleet Owner in Lagos, Nigeria (Chidi Okonkwo archetype)
 *   - Owns 5-15 vehicles, employs 5-10 drivers
 *   - NOT a data analyst — they're a business operator
 *   - Checks dashboard 1-3x/day on laptop or phone
 *   - Mental model: "Am I making money? Are things running? Any problems?"
 *
 * DECISION LOOP (what they actually do when they open the dashboard):
 *   1. "How much did I make today?" → Glance at earnings
 *   2. "Is everything running smoothly?" → Check driver/vehicle status
 *   3. "Anything I need to deal with?" → See attention items
 *   4. "When's my next payout?" → Check payout date + amount
 *
 * ══════════════════════════════════════════════════════════════════════
 * 2. METRIC AUDIT — RUTHLESS JUSTIFICATION
 * ══════════════════════════════════════════════════════════════════════
 *
 * ┌────────────────────┬──────────┬────────────────────────────────────────┬──────────────────────────────┐
 * │ METRIC             │ VERDICT  │ WHY                                    │ DATA SOURCE                  │
 * ├────────────────────┼──────────┼────────────────────────────────────────┼──────────────────────────────┤
 * │ Next Payout        │ ✅ KEEP  │ #1 reason they open the dashboard.     │ earnings.nextPayout          │
 * │ (amount + date)    │ HERO     │ Every fleet owner's core question:     │ (payout ledger)              │
 * │                    │          │ "When do I get paid?"                  │                              │
 * ├────────────────────┼──────────┼────────────────────────────────────────┼──────────────────────────────┤
 * │ Earnings Today     │ ✅ KEEP  │ "Am I making money today?" — the       │ SUM(trips.fare × fleet_share)│
 * │                    │          │ daily pulse check.                     │ WHERE date = today           │
 * ├────────────────────┼──────────┼────────────────────────────────────────┼──────────────────────────────┤
 * │ Earnings Week /    │ ✅ KEEP  │ Context for daily number. "Is today    │ Same aggregation,            │
 * │ Month / All Time   │ INLINE   │ good or bad compared to my average?"   │ different time windows       │
 * ├────────────────────┼──────────┼────────────────────────────────────────┼──────────────────────────────┤
 * │ Weekly Chart       │ ✅ KEEP  │ Pattern recognition: "Which days are   │ dailyChart[]                 │
 * │ (sparkline)        │          │ my fleet busiest?" Informs scheduling  │ (daily aggregation)          │
 * │                    │          │ decisions.                             │                              │
 * ├────────────────────┼──────────┼────────────────────────────────────────┼──────────────────────────────┤
 * │ Rides Today        │ ✅ KEEP  │ "How busy is my fleet?" Correlates     │ COUNT(trips) WHERE           │
 * │                    │          │ with earnings — if rides are up but    │ date = today                 │
 * │                    │          │ earnings flat, flag average fare issue │                              │
 * ├────────────────────┼──────────┼────────────────────────────────────────┼──────────────────────────────┤
 * │ Online Drivers     │ ✅ KEEP  │ "Are my drivers actually working?"     │ dispatch heartbeat           │
 * │ (X of Y)           │          │ Direct operational visibility.         │ (real-time)                  │
 * ├────────────────────┼──────────┼────────────────────────────────────────┼──────────────────────────────┤
 * │ Driver status      │ ✅ KEEP  │ "Who's on a trip, who's idle, who's   │ dispatch heartbeat           │
 * │ (on_trip/online/   │          │ offline?" — the fleet owner equivalent │ (real-time)                  │
 * │  offline)          │          │ of "is my employee at their desk?"     │                              │
 * ├────────────────────┼──────────┼────────────────────────────────────────┼──────────────────────────────┤
 * │ Driver earnings +  │ ✅ KEEP  │ "Who's my best driver? Who's          │ driver.earningsThisWeek      │
 * │ rank               │ TOP 4    │ underperforming?" Informs             │ (trips × fleet_share)        │
 * │                    │          │ retention / bonus decisions.           │                              │
 * ├────────────────────┼──────────┼────────────────────────────────────────┼──────────────────────────────┤
 * │ Fleet Rating       │ ✅ KEEP  │ "Are riders happy with my fleet?"      │ AVG(driver.rating)           │
 * │ (avg)              │ COMPACT  │ If rating drops → investigate.         │ 30-day rolling from          │
 * │                    │          │ Below 4.5 = action needed.             │ rider feedback               │
 * ├────────────────────┼──────────┼────────────────────────────────────────┼──────────────────────────────┤
 * │ Vehicle status     │ ✅ KEEP  │ "Are my cars on the road or sitting?"  │ vehicle.status +             │
 * │ (active/total)     │ SIMPLE   │ Simple count: how many earning vs not  │ vehicle.assignedDriverId     │
 * ├────────────────────┼──────────┼────────────────────────────────────────┼──────────────────────────────┤
 * │ Needs Attention    │ ✅ KEEP  │ "What do I need to deal with?"         │ Derived from vehicle status  │
 * │ queue              │          │ Actionable items only.                 │ + driver verification        │
 * ├────────────────────┼──────────┼────────────────────────────────────────┼──────────────────────────────┤
 * │ Utilization %      │ ❌ CUT   │ What does "57%" mean to Chidi?         │ n/a — replaced by simple     │
 * │ (ring chart)       │          │ Nothing. "4 of 7 cars active" is       │ "X active / Y total" count   │
 * │                    │          │ instantly clear. The ring adds visual  │                              │
 * │                    │          │ complexity for zero clarity gain.      │                              │
 * ├────────────────────┼──────────┼────────────────────────────────────────┼──────────────────────────────┤
 * │ Vehicle Pipeline   │ ❌ CUT   │ "Pipeline" is PM jargon. Chidi thinks │ n/a — replaced by            │
 * │ (flow diagram)     │          │ "my cars" not "pipeline stages."       │ simple grouped list:         │
 * │                    │          │ Adds visual noise without informing    │ "Your Vehicles" with         │
 * │                    │          │ any decision.                          │ status badges                │
 * ├────────────────────┼──────────┼────────────────────────────────────────┼──────────────────────────────┤
 * │ Fleet Status Bar   │ ❌ CUT   │ Progress bars for vehicle counts add  │ n/a — dots + numbers is      │
 * │ (segmented bar)    │          │ visual weight without aiding any       │ cleaner and faster to scan   │
 * │                    │          │ decision. User said: overwhelming.     │                              │
 * ├────────────────────┼──────────┼────────────────────────────────────────┼──────────────────────────────┤
 * │ Activity Feed      │ ⚠️ KEEP │ Nice context but not a decision-maker. │ dispatch + finance events    │
 * │                    │ COMPACT  │ Demote to bottom of decision panel.    │                              │
 * │                    │          │ 3 items max, not 5.                    │                              │
 * └────────────────────┴──────────┴────────────────────────────────────────┴──────────────────────────────┘
 *
 * ══════════════════════════════════════════════════════════════════════
 * 3. NORTHSTAR VALIDATION
 * ══════════════════════════════════════════════════════════════════════
 *
 * STRIPE DASHBOARD:
 *   ✓ Hero = today's revenue (big number)
 *   ✓ Breakdown = time periods in a row
 *   ✓ "Needs action" as a separate queue
 *   ✓ No abstract charts without labels
 *   → We match: Next Payout hero, earnings row, Needs Attention
 *
 * LINEAR:
 *   ✓ Information density done right — no wasted space
 *   ✓ Everything clickable to detail
 *   ✓ Status as dots + text, not charts
 *   ✓ Compact KPI tiles
 *   → We match: fleet health as dots + numbers, driver cards with drill-down
 *
 * AIRBNB HOST DASHBOARD:
 *   ✓ "Your earnings" is the hero
 *   ✓ "Things to do" = action items queue
 *   ✓ Performance metrics grouped simply
 *   ✓ Progressive disclosure: summary → detail on click
 *   → We match: earnings hero, attention queue, top performers with expand
 *
 * APPLE (SCREEN TIME / HEALTH):
 *   ✓ Big number at top
 *   ✓ Simple breakdown below
 *   ✓ Trend sparkline for context
 *   ✓ Grouped lists for detail
 *   → We match: sparklines on earnings, vehicles as simple groups
 *
 * ══════════════════════════════════════════════════════════════════════
 * 4. VEHICLE SECTION REDESIGN — "Your Vehicles"
 * ══════════════════════════════════════════════════════════════════════
 *
 * OLD NAMES: "Vehicle Pipeline", "Vehicle Roster", "Fleet Status Bar"
 * NEW NAME: "Your Vehicles"
 *
 * WHY: Chidi thinks "my cars" — not pipelines, rosters, or status bars.
 *
 * DESIGN: Simple flat list with status badges per vehicle.
 * No collapsible groups (over-engineering for 5-10 vehicles).
 * Each vehicle shows: make/model, plate, driver name, status badge.
 * Status badge colors match the dots in fleet health summary.
 *
 * When fleet scales to 15+ vehicles, THEN introduce grouping.
 * For now: flat list, status badge, done. Apple-simple.
 *
 * ══════════════════════════════════════════════════════════════════════
 * 5. VARIATION E — "Fleet Command" ARCHITECTURE
 * ══════════════════════════════════════════════════════════════════════
 *
 * Layout: A's Split Command (exactly)
 *   - Same height positioning
 *   - Bento LEFT (flex-1) + Decision Panel RIGHT (300px)
 *
 * LEFT PANEL (scrollable):
 *   ┌──────────────────────────────────────────────────────────┐
 *   │  Fleet Health (C-style KPI tiles, 4-col grid)           │
 *   │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐   │
 *   │  │Earnings  │ │ Rides    │ │ Vehicles │ │ Drivers  │   │
 *   │  │₦36,200   │ │ 23       │ │ 4/7      │ │ 3/5      │   │
 *   │  │Today     │ │ Today    │ │ Active   │ │ Online   │   │
 *   │  └──────────┘ └──────────┘ └──────────┘ └──────────┘   │
 *   │                                                          │
 *   │  Earnings Breakdown (inline row)                         │
 *   │  Today ₦36K · Week ₦138K · Month ₦582K · All ₦2.8M     │
 *   │  ▁▂▃▅▇▆▂ (weekly sparkline)                              │
 *   │                                                          │
 *   │  ── separator ──                                         │
 *   │                                                          │
 *   │  Top Performers (2-col compact driver cards, B-style)    │
 *   │  ┌─────────────────┐ ┌─────────────────┐                │
 *   │  │ #1 Emeka Nwosu  │ │ #2 Adaeze Okoro │                │
 *   │  │ ₦45.2K · ⭐4.87 │ │ ₦38.9K · ⭐4.92 │                │
 *   │  └─────────────────┘ └─────────────────┘                │
 *   │  ┌─────────────────┐ ┌─────────────────┐                │
 *   │  │ #3 Chioma Eze   │ │ #4 Tunde Adeyemi│                │
 *   │  │ ₦31.4K · ⭐4.95 │ │ ₦22.1K · ⭐4.71 │                │
 *   │  └─────────────────┘ └─────────────────┘                │
 *   │                                                          │
 *   │  ── separator ──                                         │
 *   │                                                          │
 *   │  Your Vehicles (simple flat list)                        │
 *   │  Toyota Camry · LND-284EP · Emeka  · [Active]           │
 *   │  BYD Seal · LND-291KA · Adaeze     · [Active] [EV]     │
 *   │  Honda Accord · LND-156BT · Tunde  · [Active]           │
 *   │  BYD Atto 3 · LND-312FA           · [Inspection]        │
 *   │  ...                                                     │
 *   └──────────────────────────────────────────────────────────┘
 *
 * RIGHT DECISION PANEL (from A, exact):
 *   ┌──────────────────────────┐
 *   │ Next Payout              │
 *   │ ₦137,600 · 14 Mar       │
 *   │                          │
 *   │ ── separator ──          │
 *   │                          │
 *   │ ⚠ Needs Attention (3)   │
 *   │ Hyundai Ioniq 5 · review│
 *   │ BYD Atto 3 · inspection │
 *   │ Ibrahim Musa · verify   │
 *   │                          │
 *   │ ── separator ──          │
 *   │                          │
 *   │ Quick Actions            │
 *   │ [Invite] [Add Vehicle]  │
 *   │ [Schedule] [Payout]     │
 *   │                          │
 *   │ ── separator ──          │
 *   │                          │
 *   │ ⚫ Fleet Health          │
 *   │ ⭐ 4.86 rating           │
 *   │ ● 4 active · 1 insp     │
 *   │ ● 1 review · 1 maint    │
 *   │                          │
 *   │ ── separator ──          │
 *   │                          │
 *   │ Activity (3 items max)  │
 *   │ ● Emeka completed ride  │
 *   │ ● Adaeze came online    │
 *   │ ● Payout processed      │
 *   └──────────────────────────┘
 *
 * ══════════════════════════════════════════════════════════════════════
 * 6. WHAT CHANGED FROM D → E
 * ══════════════════════════════════════════════════════════════════════
 *
 * ❌ Removed: Full-width hero (takes too much vertical space for mobile)
 * ❌ Removed: Fleet Status Bar (progress bar = visual noise per user feedback)
 * ❌ Removed: Vehicle Roster with collapsible groups (over-engineered for <10 vehicles)
 * ✅ Added: C-style KPI tiles (4 clean numbers with sparklines)
 * ✅ Added: Inline earnings row (compact, not a hero card)
 * ✅ Added: Fleet health summary in decision panel (dots + numbers, no bars)
 * ✅ Kept: A's exact split layout + decision panel positioning
 * ✅ Kept: B/D's compact driver cards with rank
 * ✅ Kept: A's Quick Actions
 * ✅ Simplified: Vehicles to flat list with status badges
 * ✅ Simplified: Activity feed to 3 items max
 */

export {};
