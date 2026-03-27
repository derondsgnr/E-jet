/**
 * JET ADMIN — HOTELS VIEW
 * Route: /admin/hotels
 */
import { AdminPageShell } from "../components/admin/ui/admin-page-shell";
import { AdminHotelsPage } from "../components/admin/hotels/admin-hotels";

export function AdminHotelsView() {
  return (
    <AdminPageShell title="Hotels" subtitle="Partner management · B2B">
      <div className="flex-1 h-full">
        <AdminHotelsPage />
      </div>
    </AdminPageShell>
  );
}
