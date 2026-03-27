/**
 * JET ADMIN — COMMAND CENTER METRIC AUDIT
 * =========================================
 *
 * Product OS Gate: PM + Finance + Engineering
 * Question: "Does every metric have a source, a method, and a reason to exist?"
 *
 * AUDIT DATE: March 10, 2026
 * SCOPE: Command Center composite — all metrics shown to admin
 *
 *
 * ═══════════════════════════════════════════════════════════════════════════
 * 1. NATIONAL KPI STRIP — 8 metrics
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * ┌─────────────────┬──────────────────────────────────────────┬────────────┐
 * │ Metric          │ Data Source                              │ Verdict    │
 * ├─────────────────┼──────────────────────────────────────────┼────────────┤
 * │ Active Rides    │ trips WHERE status = 'in_progress'      │ ✅ VALID    │
 * │                 │ Real-time count. DB query or cache.      │            │
 * │                 │ Scope: platform → state → zone           │            │
 * ├─────────────────┼──────────────────────────────────────────┼────────────┤
 * │ Revenue         │ SUM(trip.fare) WHERE trip.completed_at   │ ✅ VALID    │
 * │                 │ >= today_start. Payment gateway confirms.│            │
 * │                 │ Scope: platform → state → zone           │            │
 * ├─────────────────┼──────────────────────────────────────────┼────────────┤
 * │ Driver Supply   │ driver_sessions WHERE status = 'online'  │ ✅ VALID    │
 * │                 │ COUNT. Driver app heartbeat (30s ping).  │            │
 * │                 │ Driver goes offline if no ping in 90s.   │            │
 * │                 │ Scope: platform → state → zone           │            │
 * ├─────────────────┼──────────────────────────────────────────┼────────────┤
 * │ Avg Match       │ AVG(trip.matched_at - trip.requested_at) │ ✅ VALID    │
 * │                 │ Rolling 30min window. Seconds.           │            │
 * │                 │ Scope: platform → state → zone           │            │
 * ├─────────────────┼──────────────────────────────────────────┼────────────┤
 * │ Hotel Rides     │ trips WHERE trip.hotel_partner_id IS NOT │ ✅ VALID    │
 * │                 │ NULL AND status IN ('in_progress',       │            │
 * │                 │ 'completed') AND completed_at >= today.  │            │
 * │                 │ Hotel integration sets hotel_partner_id  │            │
 * │                 │ when ride is booked through hotel portal. │            │
 * │                 │ Scope: platform → state → zone           │            │
 * ├─────────────────┼──────────────────────────────────────────┼────────────┤
 * │ Fleet Util      │ (fleet_vehicles WHERE current_trip_id    │ ✅ VALID    │
 * │                 │ IS NOT NULL) / (fleet_vehicles WHERE     │            │
 * │                 │ status = 'online') * 100.                │            │
 * │                 │ Requires fleet vehicles to be tagged with│            │
 * │                 │ fleet_owner_id in vehicle table.         │            │
 * │                 │ Scope: platform → state → zone           │            │
 * ├─────────────────┼──────────────────────────────────────────┼────────────┤
 * │ Completion      │ trips.status = 'completed' /             │ ✅ VALID    │
 * │                 │ trips.status IN ('completed','cancelled',│            │
 * │                 │ 'no_show') WHERE requested_at >= today.  │            │
 * │                 │ Scope: platform → state → zone           │            │
 * ├─────────────────┼──────────────────────────────────────────┼────────────┤
 * │ Open Issues     │ support_tickets WHERE status = 'open'.   │ ✅ VALID    │
 * │                 │ Tickets created by riders, drivers, or   │            │
 * │                 │ system (payment failures, safety alerts).│            │
 * │                 │ Scope: platform → state → zone (via trip)│            │
 * └─────────────────┴──────────────────────────────────────────┴────────────┘
 *
 *
 * ═══════════════════════════════════════════════════════════════════════════
 * 2. FOOTER PANELS — Pipeline / Disputes / Revenue
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * CRITICAL FINDING: All three are currently NATIONAL-SCOPED regardless of
 * drill level. Admin sees "12 disputes" whether at national map or inside
 * Wuse zone — confusing and misleading.
 *
 * ┌─────────────────┬──────────────────────────────────────────┬────────────┐
 * │ Panel           │ Scope Behavior                           │ Fix        │
 * ├─────────────────┼──────────────────────────────────────────┼────────────┤
 * │ PIPELINE        │ Driver verification is a CENTRAL OPS     │ ALWAYS     │
 * │ (Verification)  │ function. Drivers are verified once,     │ NATIONAL   │
 * │                 │ regardless of operating state. Pipeline  │            │
 * │                 │ stages: Applied → Documents → Background │ Label:     │
 * │                 │ → Inspection → Approved/Rejected.        │ "Platform" │
 * │                 │                                          │            │
 * │                 │ Data source: driver_applications table.  │            │
 * │                 │ Each row has: stage, submitted_at,       │            │
 * │                 │ updated_at, assigned_reviewer.           │            │
 * │                 │                                          │            │
 * │                 │ Badge count = WHERE stage NOT IN         │            │
 * │                 │ ('approved', 'rejected').                │            │
 * ├─────────────────┼──────────────────────────────────────────┼────────────┤
 * │ DISPUTES        │ Disputes tie to TRIPS. Trips have zones. │ CONTEXTUAL │
 * │                 │ When drilled into a state/zone, disputes │            │
 * │                 │ should filter to that geography.         │ Show scope │
 * │                 │                                          │ label      │
 * │                 │ Data source: disputes table.             │            │
 * │                 │ JOIN trip ON dispute.trip_id = trip.id    │            │
 * │                 │ WHERE trip.zone_id = X / trip.state = Y. │            │
 * │                 │                                          │            │
 * │                 │ Badge count = WHERE status = 'open'      │            │
 * │                 │ filtered by geography.                   │            │
 * ├─────────────────┼──────────────────────────────────────────┼────────────┤
 * │ REVENUE         │ Revenue ties to TRIPS. Absolutely        │ CONTEXTUAL │
 * │                 │ filterable by state/zone.                │            │
 * │                 │                                          │ Show scope │
 * │                 │ Data source: transactions table.         │ label      │
 * │                 │ JOIN trip ON transaction.trip_id.         │            │
 * │                 │ Gross = SUM(trip.fare).                  │            │
 * │                 │ Commission = SUM(trip.commission).       │            │
 * │                 │ Net = commission - processing_fees.      │            │
 * │                 │                                          │            │
 * │                 │ Badge = net_revenue today, scoped.       │            │
 * └─────────────────┴──────────────────────────────────────────┴────────────┘
 *
 *
 * ═══════════════════════════════════════════════════════════════════════════
 * 3. PHANTOM METRICS — metrics without clear data input method
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * ┌─────────────────┬──────────────────────────────────────────┬────────────┐
 * │ Metric          │ Problem                                  │ Fix        │
 * ├─────────────────┼──────────────────────────────────────────┼────────────┤
 * │ Hotel           │ Field: guestRating (e.g. 4.8)            │ RENAME     │
 * │ "Guest Rating"  │ WHERE does this come from?               │            │
 * │                 │ Option A: Hotel's own star rating from   │            │
 * │                 │ onboarding form → then label it          │            │
 * │                 │ "Hotel Tier" not "guest rating."         │            │
 * │                 │ Option B: Average trip.rating for rides  │            │
 * │                 │ booked through this hotel → measurable   │            │
 * │                 │ but requires sufficient ride volume.     │            │
 * │                 │                                          │            │
 * │                 │ FIX: Rename to "Avg Ride Rating" and     │
 * │                 │ source from trip.rating WHERE            │            │
 * │                 │ trip.hotel_partner_id = X.               │            │
 * │                 │ Show "—" if < 10 rated rides (too few    │            │
 * │                 │ to be meaningful).                       │            │
 * ├─────────────────┼──────────────────────────────────────────┼────────────┤
 * │ "Driver         │ Formula: drivers / (activeRides * 0.08)  │ REPLACE    │
 * │ Coverage"       │ The 0.08 multiplier is arbitrary.        │            │
 * │ (Supply Health) │ What does "8% of active rides need a     │            │
 * │                 │ driver" mean? Nothing.                   │            │
 * │                 │                                          │            │
 * │                 │ REAL METRIC: Supply-Demand Ratio         │            │
 * │                 │ = available_drivers / (riders_requesting  │            │
 * │                 │ + predicted_demand_next_15min)            │            │
 * │                 │                                          │            │
 * │                 │ Simpler version for MVP:                 │            │
 * │                 │ = idle_drivers / waiting_riders           │            │
 * │                 │ Healthy: > 1.2 (20% surplus)             │            │
 * │                 │ Warning: 0.8-1.2 (tight)                 │            │
 * │                 │ Critical: < 0.8 (shortage)               │            │
 * │                 │                                          │            │
 * │                 │ Data source: driver_sessions (idle) and  │            │
 * │                 │ trips WHERE status = 'requested' AND     │            │
 * │                 │ matched_at IS NULL.                      │            │
 * ├─────────────────┼──────────────────────────────────────────┼────────────┤
 * │ riderAvgTrips   │ "Average trips per rider" is a LIFETIME  │ REMOVE     │
 * │                 │ metric, not real-time. Doesn't belong in │ from       │
 * │                 │ a real-time operational dashboard.       │ Command    │
 * │                 │ Belongs in a rider analytics page.       │ Center     │
 * └─────────────────┴──────────────────────────────────────────┴────────────┘
 *
 *
 * ═══════════════════════════════════════════════════════════════════════════
 * 4. VANITY METRICS — shown but not actionable
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * ┌─────────────────┬──────────────────────────────────────────┬────────────┐
 * │ Metric          │ Why Vanity                               │ Replace    │
 * ├─────────────────┼──────────────────────────────────────────┼────────────┤
 * │ Platform avg    │ avgRating: 4.72 — so what? Unless it's   │ REPLACE    │
 * │ rating (4.72)   │ dropping, this tells admin nothing.      │ with:      │
 * │                 │                                          │ "Low-rated │
 * │                 │ Actionable replacement:                  │ trips      │
 * │                 │ "Trips rated < 4.0 today: 23"            │ today: 23" │
 * │                 │ Source: trips WHERE rating < 4.0 AND     │            │
 * │                 │ completed_at >= today_start.             │            │
 * ├─────────────────┼──────────────────────────────────────────┼────────────┤
 * │ Dispute         │ "62% rider-favored" — interesting for    │ KEEP but   │
 * │ resolution      │ policy review, not for real-time ops.    │ MOVE to    │
 * │ breakdown       │ Admin can't act on this in the moment.   │ disputes   │
 * │                 │                                          │ deep-dive  │
 * │                 │ Keep in the disputes overlay as context, │ page, not  │
 * │                 │ not as a headline metric.                │ headline   │
 * ├─────────────────┼──────────────────────────────────────────┼────────────┤
 * │ Rider churn     │ churnRate: 3.2% — monthly cohort metric. │ REMOVE     │
 * │ rate            │ Not real-time. Not actionable in Command │ from CC    │
 * │                 │ Center. Belongs in growth/analytics.     │            │
 * ├─────────────────┼──────────────────────────────────────────┼────────────┤
 * │ Rider retention │ retentionRate: 88.4% — same as churn.    │ REMOVE     │
 * │ rate            │ Monthly metric, not operational.         │ from CC    │
 * └─────────────────┴──────────────────────────────────────────┴────────────┘
 *
 *
 * ═══════════════════════════════════════════════════════════════════════════
 * 5. ZONE-LEVEL ENTITY METRICS — data source mapping
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * DRIVER entity metrics:
 * ┌─────────────┬────────────────────────────────────────────┬──────────┐
 * │ Metric      │ Source                                     │ Status   │
 * ├─────────────┼────────────────────────────────────────────┼──────────┤
 * │ Active      │ driver_sessions.status = 'on_trip'         │ ✅ VALID  │
 * │ En-route    │ driver_sessions.status = 'en_route_pickup' │ ✅ VALID  │
 * │ Idle        │ driver_sessions.status = 'idle'            │ ✅ VALID  │
 * │ EV count    │ vehicles.fuel_type = 'electric' WHERE      │ ✅ VALID  │
 * │             │ driver_id IN (online drivers in zone)      │          │
 * │ Rating      │ AVG(trip.driver_rating) last 30 days       │ ✅ VALID  │
 * │ Rides done  │ COUNT(trips) WHERE driver_id = X AND       │ ✅ VALID  │
 * │             │ status = 'completed'                       │          │
 * └─────────────┴────────────────────────────────────────────┴──────────┘
 *
 * RIDER entity metrics:
 * ┌─────────────┬────────────────────────────────────────────┬──────────┐
 * │ Metric      │ Source                                     │ Status   │
 * ├─────────────┼────────────────────────────────────────────┼──────────┤
 * │ In-ride     │ trips.status = 'in_progress' WHERE         │ ✅ VALID  │
 * │             │ rider_id has active session in zone        │          │
 * │ Matched     │ trips.status = 'matched' (driver assigned, │ ✅ VALID  │
 * │             │ pickup pending)                            │          │
 * │ Waiting     │ trips.status = 'requested' AND matched_at  │ ✅ VALID  │
 * │             │ IS NULL                                    │          │
 * └─────────────┴────────────────────────────────────────────┴──────────┘
 *
 * HOTEL entity metrics:
 * ┌─────────────┬────────────────────────────────────────────┬──────────┐
 * │ Metric      │ Source                                     │ Status   │
 * ├─────────────┼────────────────────────────────────────────┼──────────┤
 * │ Partners    │ hotel_partners WHERE zone = X AND          │ ✅ VALID  │
 * │             │ status = 'active'                          │          │
 * │ Rooms       │ hotel_partners.room_count (from onboarding │ ✅ VALID  │
 * │             │ form, updated by hotel admin)              │          │
 * │ Avg Ride    │ AVG(trip.rating) WHERE hotel_partner_id =  │ ⚠️ RENAME │
 * │ Rating      │ X AND rating IS NOT NULL AND rated_at >=   │ from     │
 * │             │ 30_days_ago. Show "—" if < 10 rated trips. │ "guest   │
 * │             │                                            │ rating"  │
 * │ Tiers       │ hotel_partners.tier (set during contract   │ ✅ VALID  │
 * │             │ negotiation: 3-Star, 4-Star, 5-Star)      │          │
 * │ Pending     │ hotel_invoices WHERE status = 'pending'    │ ✅ VALID  │
 * │ Invoice     │ SUM(amount)                                │          │
 * └─────────────┴────────────────────────────────────────────┴──────────┘
 *
 * FLEET entity metrics:
 * ┌─────────────┬────────────────────────────────────────────┬──────────┐
 * │ Metric      │ Source                                     │ Status   │
 * ├─────────────┼────────────────────────────────────────────┼──────────┤
 * │ Vehicles    │ fleet_vehicles WHERE fleet_owner_id = X    │ ✅ VALID  │
 * │             │ AND status != 'decommissioned'             │          │
 * │ Online      │ fleet_vehicles WHERE status = 'online'     │ ✅ VALID  │
 * │ Utilization │ (vehicles with active trip / total online)  │ ✅ VALID  │
 * │             │ * 100. Real-time calculation.              │          │
 * │ Pending     │ fleet_payouts WHERE status = 'pending'     │ ✅ VALID  │
 * │ Payout      │ SUM(amount)                                │          │
 * └─────────────┴────────────────────────────────────────────┴──────────┘
 *
 *
 * ═══════════════════════════════════════════════════════════════════════════
 * 6. STATE BRIEFING — Supply Health diagnostics
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * ┌─────────────────┬──────────────────────────────────────────┬────────────┐
 * │ Diagnostic      │ Current Formula → Fix                    │ Status     │
 * ├─────────────────┼──────────────────────────────────────────┼────────────┤
 * │ Driver coverage │ CURRENT: drivers / (activeRides * 0.08)  │ ⛔ PHANTOM  │
 * │                 │ FIX: idle_drivers / waiting_riders        │            │
 * │                 │ Show: "24 available / 18 requesting"     │            │
 * │                 │ Threshold: > 1.2 healthy, < 0.8 critical │            │
 * │                 │ Source: driver_sessions + trips           │            │
 * ├─────────────────┼──────────────────────────────────────────┼────────────┤
 * │ Avg match time  │ AVG(matched_at - requested_at) rolling   │ ✅ VALID    │
 * │                 │ 30min. Target: < 60s.                    │            │
 * │                 │ Source: trips table, timestamp diff.     │            │
 * ├─────────────────┼──────────────────────────────────────────┼────────────┤
 * │ Trip completion │ completed / (completed + cancelled +     │ ✅ VALID    │
 * │                 │ no_show) today. Target: ≥ 90%.           │            │
 * │                 │ Source: trips table, status counts.      │            │
 * └─────────────────┴──────────────────────────────────────────┴────────────┘
 *
 *
 * ═══════════════════════════════════════════════════════════════════════════
 * 7. ACTIONS TAKEN IN THIS AUDIT
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * ✅ Footer tabs made scope-contextual:
 *    - Pipeline: Always national (central ops function) — labeled "Platform"
 *    - Disputes: Filters by drilled state/zone — labeled with scope
 *    - Revenue: Filters by drilled state/zone — labeled with scope
 *
 * ✅ "Driver coverage" formula replaced:
 *    - Old: drivers / (activeRides * 0.08) — meaningless
 *    - New: idle_drivers / waiting_riders with proper thresholds
 *    - Labels: "24 available / 18 requesting" instead of phantom numbers
 *
 * ✅ Hotel "guestRating" renamed to "Ride Rating" in zone detail panels
 *    - Clarifies this is avg trip.rating from hotel guest rides
 *
 * ✅ Scope labels added to footer panel headers
 *    - "Pipeline · Platform-wide"
 *    - "Disputes · FCT Abuja" or "Disputes · Wuse zone"
 *    - "Revenue · FCT Abuja" or "Revenue · Platform"
 *
 * ⬜ FUTURE: Remove churnRate, retentionRate, avgTripsPerRider from
 *    Command Center data (not real-time operational metrics)
 *
 * ⬜ FUTURE: Replace platform avgRating with "low-rated trips today"
 *
 *
 * ═══════════════════════════════════════════════════════════════════════════
 * 8. DATA FLOW SUMMARY (how metrics get generated)
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * ┌──────────────────────────────────────────────────────────────────────┐
 * │                        DATA INPUT POINTS                            │
 * ├──────────────────────────────────────────────────────────────────────┤
 * │                                                                     │
 * │  RIDER APP                                                          │
 * │  └─ trip.request → creates trip record (zone, state, timestamp)     │
 * │  └─ trip.rating → updates trip.rider_rating after completion        │
 * │  └─ dispute.create → creates dispute linked to trip_id              │
 * │                                                                     │
 * │  DRIVER APP                                                         │
 * │  └─ session.heartbeat → updates driver location, status every 30s  │
 * │  └─ trip.accept → sets trip.matched_at timestamp                   │
 * │  └─ trip.complete → sets trip.completed_at, triggers payment        │
 * │  └─ application.submit → creates driver_application record         │
 * │                                                                     │
 * │  HOTEL PORTAL                                                       │
 * │  └─ booking.create → creates trip with hotel_partner_id             │
 * │  └─ invoice.generate → auto-generated daily from completed trips   │
 * │                                                                     │
 * │  FLEET PORTAL                                                       │
 * │  └─ vehicle.register → adds to fleet_vehicles table                │
 * │  └─ payout.request → creates fleet_payout record                   │
 * │                                                                     │
 * │  PAYMENT GATEWAY (Paystack)                                         │
 * │  └─ payment.success → updates transaction record                   │
 * │  └─ payment.failed → triggers retry, creates support ticket        │
 * │                                                                     │
 * │  ADMIN ACTIONS                                                      │
 * │  └─ verification.review → advances driver_application stage        │
 * │  └─ dispute.resolve → updates dispute status + resolution          │
 * │  └─ surge.adjust → updates zone surge multiplier                   │
 * │  └─ broadcast.send → creates notification batch                    │
 * │                                                                     │
 * └──────────────────────────────────────────────────────────────────────┘
 *
 * Every metric in the Command Center traces back to one of these input
 * points. If a metric can't be traced → it's phantom. Kill it.
 */
export {};
