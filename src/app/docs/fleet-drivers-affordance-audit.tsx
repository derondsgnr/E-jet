/**
 * ═══════════════════════════════════════════════════════════════════════
 * FLEET DRIVERS — AFFORDANCE AUDIT
 * ═══════════════════════════════════════════════════════════════════════
 *
 * Two issues flagged:
 *   1. "Pipeline" label — is it clear to the user?
 *   2. Are all affordances accounted for?
 *
 *
 * ─── ISSUE 1: "PIPELINE" NAMING ────────────────────────────────────────
 *
 *   WHO SEES THIS:  Fleet owner (non-technical, running a business)
 *   WHAT THEY THINK: "Which drivers aren't ready to drive yet?"
 *   WHAT WE SHOW:    "Pipeline · 8"
 *
 *   PROBLEM:
 *     "Pipeline" is product/engineering jargon.
 *     A fleet owner in Lagos managing 30 drivers doesn't think
 *     in pipelines — they think in readiness.
 *
 *   RECOMMENDATION:
 *     ┌─────────────┬──────────────────┬────────────────────────────┐
 *     │ Current     │ Better           │ Why                        │
 *     ├─────────────┼──────────────────┼────────────────────────────┤
 *     │ "Pipeline"  │ "Pending"        │ Plain, universal, Stripe   │
 *     │             │                  │ uses this exact pattern    │
 *     └─────────────┴──────────────────┴────────────────────────────┘
 *
 *     Subitems in filter pills:
 *       - "Docs Submitted"  → stays (clear)
 *       - "Under Review"    → stays (clear)
 *       - "Rejected"        → stays (clear)
 *
 *   VERDICT: Rename "Pipeline" → "Pending" everywhere.
 *
 *
 * ─── ISSUE 2: AFFORDANCE AUDIT ─────────────────────────────────────────
 *
 *   ✅ WHAT WE HAVE (working):
 *     • Filter by status (All, Online, On Trip, Offline, Pending)
 *     • Search by name or vehicle
 *     • Sort by 4 columns (clickable headers + dropdown fallback)
 *     • Click row → side drawer with full driver detail
 *     • Call / Message driver from drawer
 *     • Reassign vehicle from drawer
 *     • Suspend driver (with confirmation modal)
 *     • View ride history (placeholder → future)
 *     • Invite new driver (sheet modal)
 *     • Send reminder to unverified drivers
 *     • LIVE badge on active trips
 *     • SUSPENDED badge inline
 *     • Verification progress bar for pending drivers
 *     • Empty state with clear recovery action
 *
 *   ❌ WHAT'S MISSING (prioritized):
 *
 *     ┌───┬─────────────────────────────┬──────────┬─────────────────────────┐
 *     │ # │ Missing Affordance          │ Priority │ Why                     │
 *     ├───┼─────────────────────────────┼──────────┼─────────────────────────┤
 *     │ 1 │ "Suspended" filter pill     │ HIGH     │ There's a suspended     │
 *     │   │                             │          │ driver but no way to    │
 *     │   │                             │          │ filter to just them.    │
 *     │   │                             │          │ Dead end.              │
 *     ├───┼─────────────────────────────┼──────────┼─────────────────────────┤
 *     │ 2 │ Row count indicator         │ HIGH     │ "Showing 8 of 30" —    │
 *     │   │                             │          │ user needs to know if   │
 *     │   │                             │          │ filters are hiding data │
 *     ├───┼─────────────────────────────┼──────────┼─────────────────────────┤
 *     │ 3 │ "Last seen" for offline     │ MEDIUM   │ "Offline" alone doesn't │
 *     │   │ drivers                     │          │ tell you if they were   │
 *     │   │                             │          │ active 2hrs or 2wks ago │
 *     ├───┼─────────────────────────────┼──────────┼─────────────────────────┤
 *     │ 4 │ Reactivate suspended driver │ MEDIUM   │ We can suspend but      │
 *     │   │                             │          │ there's no "unsuspend"  │
 *     │   │                             │          │ — that's a dead end     │
 *     ├───┼─────────────────────────────┼──────────┼─────────────────────────┤
 *     │ 5 │ Bulk select + actions       │ LOW      │ At 30 drivers, single-  │
 *     │   │ (message all, export)       │          │ select is fine. At 100+ │
 *     │   │                             │          │ this becomes essential  │
 *     └───┴─────────────────────────────┴──────────┴─────────────────────────┘
 *
 *
 *   DECISION NEEDED:
 *     → Fix #1 + #2 now (quick, high-value)?
 *     → Fix #1–4 now (medium effort)?
 *     → Note all, fix as we encounter them?
 *
 *
 * ─── SUMMARY ───────────────────────────────────────────────────────────
 *
 *   RENAME:    "Pipeline" → "Pending"
 *   ADD NOW:   Suspended filter + row count
 *   ADD NEXT:  Last seen + reactivate action
 *   ADD LATER: Bulk actions (when fleet scales past 50+)
 *
 * ═══════════════════════════════════════════════════════════════════════
 */

export {};
