/**
 * JET ADMIN — DISPUTES (Locked Composite)
 *
 * Fuses the best of each exploration:
 *   A's queue — filterable, compact, priority bars, always-visible backlog
 *   C's detail — rider vs shared truth vs driver split-court view
 *   A's resolution — verdict cards, quick actions, tags
 *
 * The split-court makes fairness visible. The resolution panel
 * puts every action one click away. The queue keeps the backlog
 * scannable even while resolving a case.
 */

import { AdminPageShell } from "../components/admin/ui/admin-page-shell";
import { DISPUTE_STATS } from "../config/dispute-mock-data";
import { DisputeResolution } from "../components/admin/disputes/dispute-resolution";

export function AdminDisputes() {
  return (
    <AdminPageShell
      title="Disputes"
      subtitle={`${DISPUTE_STATS.total} open · ${DISPUTE_STATS.bySeverity.critical + DISPUTE_STATS.bySeverity.high} urgent`}
    >
      <div className="flex-1 h-full">
        <DisputeResolution />
      </div>
    </AdminPageShell>
  );
}
