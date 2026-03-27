/**
 * JET ADMIN — FLEET VIEW
 * Route: /admin/fleet
 */
import { AdminPageShell } from "../components/admin/ui/admin-page-shell";
import { AdminFleetPage } from "../components/admin/fleet/admin-fleet";

export function AdminFleetView() {
  return (
    <AdminPageShell title="Fleet" subtitle="Supply management · Vehicles & drivers">
      <div className="flex-1 h-full">
        <AdminFleetPage />
      </div>
    </AdminPageShell>
  );
}
