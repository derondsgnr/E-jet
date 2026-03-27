/**
 * ADMIN COMMAND CENTER V2 — WIRED PREVIEW
 * Route: /admin/v2
 *
 * Thin wrapper that renders the FULL CommandCenterComposite
 * with variant="v2" — activating:
 *   FIX 1: CCv2Onboarding (full-screen fixed overlay with real action forms)
 *   FIX 2: V2 KPI strip (5-group with health) + split Decisions panel
 *
 * ALL other behavior is 1:1 with /admin:
 *   - Full 3-level drill-down (national → state → zone → entity)
 *   - Entity filter strip + entity detail panels
 *   - Zone connections, hover tooltips, entity pins
 *   - All contextual KPI scoping per drilled state/entity filter
 *   - Overlay panels (Verification, Disputes, Finance) — identical
 *   - Footer tabs, live feed bar, alert bar
 */

import { CommandCenterComposite } from "../components/admin/command-center-composite";

export function AdminCommandCenterV2() {
  return <CommandCenterComposite variant="v2" />;
}
