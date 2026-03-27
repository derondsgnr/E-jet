/**
 * JET ADMIN — RIDERS VIEW
 * Route: /admin/riders
 * Thin wrapper — same pattern as admin-disputes.tsx
 */

import { AdminPageShell } from "../components/admin/ui/admin-page-shell";
import { AdminRidersPage as RidersContent } from "../components/admin/riders/admin-riders";
import { RIDER_KPI } from "../config/riders-mock-data";

export function AdminRidersPage() {
  return (
    <AdminPageShell
      title="Riders"
      subtitle={`${RIDER_KPI.total.toLocaleString()} registered · ${RIDER_KPI.newThisWeek} new this week`}
    >
      <div className="flex-1 h-full">
        <RidersContent />
      </div>
    </AdminPageShell>
  );
}
