/**
 * JET ADMIN — FINANCE
 * Route: /admin/finance
 *
 * Full E2E financial surface with tabs, transactions,
 * payouts, refunds, reports, and all flows wired.
 */

import { AdminPageShell } from "../components/admin/ui/admin-page-shell";
import { AdminFinanceFull } from "../components/admin/finance/admin-finance-full";
import { FINANCE_SUMMARY, formatNaira } from "../config/admin-mock-data";

export function AdminFinance() {
  return (
    <AdminPageShell
      title="Finance"
      subtitle={`Today · ${formatNaira(FINANCE_SUMMARY.grossRevenue)} gross`}
    >
      <div className="flex-1 h-full">
        <AdminFinanceFull />
      </div>
    </AdminPageShell>
  );
}
