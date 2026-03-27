/**
 * JET ADMIN — DRIVERS
 * Route: /admin/drivers
 *
 * Full E2E driver management surface with pipeline,
 * active roster, suspended list, performance, and all flows wired.
 */

import { AdminPageShell } from "../components/admin/ui/admin-page-shell";
import { AdminDriversFull } from "../components/admin/drivers/admin-drivers-full";
import { VERIFICATION_PIPELINE } from "../config/admin-mock-data";

export function AdminDrivers() {
  return (
    <AdminPageShell
      title="Drivers"
      subtitle={`${VERIFICATION_PIPELINE.approved} active · ${VERIFICATION_PIPELINE.documentsReview + VERIFICATION_PIPELINE.newApplications + VERIFICATION_PIPELINE.backgroundCheck} in pipeline`}
    >
      <div className="flex-1 h-full">
        <AdminDriversFull />
      </div>
    </AdminPageShell>
  );
}
