/**
 * JET ADMIN — FINANCE SURFACE (E2E)
 *
 * Surfaces wired:
 *   Row click → SIDE DRAWER (transaction detail)
 *   Approve Batch → CENTER MODAL (financial, persistent)
 *   Issue Refund → CENTER MODAL (financial, persistent)
 *   Retry Payment → CENTER MODAL (confirmation)
 *   Trigger Payout → SIDE DRAWER (payout detail + confirm)
 *   Generate Report → SIDE DRAWER (config + generate)
 *   Reconcile → CENTER MODAL (gateway reconciliation)
 *   Configure Rates → SIDE DRAWER (commission rate editor)
 *
 * Tabs: Overview · Transactions · Payouts · Refunds · Reports
 * Pattern: Stripe Dashboard, Paystack Console, Linear billing
 */

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  TrendingUp, Wallet, CreditCard, Banknote, Clock, XCircle,
  ArrowUpRight, ArrowDownRight, Search, ChevronDown, ChevronRight,
  CheckCircle2, AlertTriangle, RefreshCcw, Download, Filter,
  Calendar, Receipt, Send, FileText, Percent, DollarSign,
  ExternalLink, X, Copy, Eye, RotateCcw, Ban, Zap,
  BarChart3, PieChart,
} from "lucide-react";
import { useAdminTheme, TY, BRAND, STATUS } from "../../../config/admin-theme";
import { AdminModal, AdminDrawer, ModalHeader, ModalFooter, SurfaceButton } from "../ui/surfaces";
import { FINANCE_SUMMARY, REVENUE_CHART, formatNaira } from "../../../config/admin-mock-data";

/* ═══ Types ═══ */
type TxnType = "ride_fare" | "commission" | "payout" | "refund" | "processing_fee" | "hotel_invoice" | "fleet_settlement";
type TxnStatus = "completed" | "pending" | "failed" | "refunded" | "processing";
type PayoutStatus = "completed" | "pending" | "failed" | "processing" | "approved";
type RefundStatus = "completed" | "pending" | "rejected";

const TXN_TYPE_META: Record<TxnType, { label: string; color: string }> = {
  ride_fare: { label: "Ride Fare", color: BRAND.green },
  commission: { label: "Commission", color: STATUS.info },
  payout: { label: "Payout", color: "#8B5CF6" },
  refund: { label: "Refund", color: STATUS.warning },
  processing_fee: { label: "Processing", color: STATUS.neutral },
  hotel_invoice: { label: "Hotel Invoice", color: "#F59E0B" },
  fleet_settlement: { label: "Fleet Settlement", color: "#06B6D4" },
};

const TXN_STATUS_META: Record<TxnStatus, { label: string; color: string }> = {
  completed: { label: "Completed", color: BRAND.green },
  pending: { label: "Pending", color: STATUS.warning },
  failed: { label: "Failed", color: STATUS.error },
  refunded: { label: "Refunded", color: STATUS.info },
  processing: { label: "Processing", color: "#8B5CF6" },
};

const PAYOUT_STATUS_META: Record<PayoutStatus, { label: string; color: string }> = {
  completed: { label: "Completed", color: BRAND.green },
  pending: { label: "Pending", color: STATUS.warning },
  failed: { label: "Failed", color: STATUS.error },
  processing: { label: "Processing", color: STATUS.info },
  approved: { label: "Approved", color: "#8B5CF6" },
};

const REFUND_STATUS_META: Record<RefundStatus, { label: string; color: string }> = {
  completed: { label: "Completed", color: BRAND.green },
  pending: { label: "Pending", color: STATUS.warning },
  rejected: { label: "Rejected", color: STATUS.error },
};

/* ═══ Mock Data ═══ */
interface Transaction {
  id: string;
  ref: string;
  type: TxnType;
  status: TxnStatus;
  amount: number;
  fee: number;
  net: number;
  from: string;
  to: string;
  tripId?: string;
  gateway: string;
  timestamp: string;
  date: string;
}

const TRANSACTIONS: Transaction[] = [
  { id: "txn-1", ref: "TXN-48320", type: "ride_fare", status: "completed", amount: 3200, fee: 48, net: 3152, from: "Adaeze O.", to: "Emeka N.", tripId: "JT-48320", gateway: "Paystack", timestamp: "2 min ago", date: "Mar 17, 2026" },
  { id: "txn-2", ref: "TXN-48319", type: "commission", status: "completed", amount: 640, fee: 0, net: 640, from: "Platform", to: "JET Revenue", gateway: "Internal", timestamp: "2 min ago", date: "Mar 17, 2026" },
  { id: "txn-3", ref: "TXN-48318", type: "ride_fare", status: "completed", amount: 2100, fee: 32, net: 2068, from: "Chidi E.", to: "Fatima B.", tripId: "JT-48318", gateway: "Paystack", timestamp: "4 min ago", date: "Mar 17, 2026" },
  { id: "txn-4", ref: "TXN-48315", type: "ride_fare", status: "failed", amount: 4800, fee: 0, net: 0, from: "Kemi A.", to: "Oluwaseun K.", tripId: "JT-48315", gateway: "Paystack", timestamp: "8 min ago", date: "Mar 17, 2026" },
  { id: "txn-5", ref: "TXN-48310", type: "ride_fare", status: "completed", amount: 4800, fee: 72, net: 4728, from: "James M.", to: "Ibrahim D.", tripId: "JT-48310", gateway: "Paystack", timestamp: "12 min ago", date: "Mar 17, 2026" },
  { id: "txn-6", ref: "TXN-48305", type: "refund", status: "completed", amount: -1400, fee: 0, net: -1400, from: "JET", to: "Blessing O.", tripId: "JT-48202", gateway: "Paystack", timestamp: "24 min ago", date: "Mar 17, 2026" },
  { id: "txn-7", ref: "TXN-48301", type: "hotel_invoice", status: "pending", amount: 284000, fee: 4260, net: 279740, from: "Radisson Blu", to: "JET", gateway: "Bank Transfer", timestamp: "1h ago", date: "Mar 17, 2026" },
  { id: "txn-8", ref: "TXN-48298", type: "fleet_settlement", status: "processing", amount: 980000, fee: 14700, net: 965300, from: "JET", to: "Metro Express", gateway: "Bank Transfer", timestamp: "2h ago", date: "Mar 17, 2026" },
  { id: "txn-9", ref: "TXN-48290", type: "payout", status: "completed", amount: 18400, fee: 100, net: 18300, from: "JET", to: "Emeka N.", gateway: "Paystack", timestamp: "3h ago", date: "Mar 17, 2026" },
  { id: "txn-10", ref: "TXN-48285", type: "ride_fare", status: "refunded", amount: 2800, fee: 42, net: 0, from: "Yemi F.", to: "Abubakar S.", tripId: "JT-48105", gateway: "Paystack", timestamp: "4h ago", date: "Mar 17, 2026" },
  { id: "txn-11", ref: "TXN-48280", type: "processing_fee", status: "completed", amount: 213450, fee: 0, net: 213450, from: "Paystack", to: "JET", gateway: "Paystack", timestamp: "6h ago", date: "Mar 16, 2026" },
  { id: "txn-12", ref: "TXN-48275", type: "ride_fare", status: "completed", amount: 1800, fee: 27, net: 1773, from: "Ngozi P.", to: "David A.", tripId: "JT-48275", gateway: "Paystack", timestamp: "7h ago", date: "Mar 16, 2026" },
];

interface Payout {
  id: string;
  ref: string;
  recipient: string;
  recipientType: "driver" | "fleet" | "hotel";
  amount: number;
  status: PayoutStatus;
  period: string;
  trips: number;
  bank: string;
  accountEnding: string;
  timestamp: string;
}

const PAYOUTS: Payout[] = [
  { id: "po-1", ref: "PO-8421", recipient: "Daily Driver Batch", recipientType: "driver", amount: 2800000, status: "pending", period: "Mar 17", trips: 412, bank: "Batch (412 drivers)", accountEnding: "—", timestamp: "Pending approval" },
  { id: "po-2", ref: "PO-8420", recipient: "GreenRide Lagos", recipientType: "fleet", amount: 1240000, status: "processing", period: "Mar 10–16", trips: 1842, bank: "GTBank", accountEnding: "4821", timestamp: "Processing" },
  { id: "po-3", ref: "PO-8419", recipient: "Metro Express", recipientType: "fleet", amount: 980000, status: "completed", period: "Mar 10–16", trips: 1456, bank: "First Bank", accountEnding: "7733", timestamp: "Mar 16, 14:20" },
  { id: "po-4", ref: "PO-8418", recipient: "Eko Hotels & Suites", recipientType: "hotel", amount: 752000, status: "completed", period: "Mar 10–16", trips: 186, bank: "Zenith Bank", accountEnding: "2194", timestamp: "Mar 16, 14:18" },
  { id: "po-5", ref: "PO-8417", recipient: "Emeka Nwosu", recipientType: "driver", amount: 48200, status: "completed", period: "Mar 16", trips: 18, bank: "Kuda MFB", accountEnding: "9102", timestamp: "Mar 16, 06:00" },
  { id: "po-6", ref: "PO-8416", recipient: "Fatima Bello", recipientType: "driver", amount: 32400, status: "completed", period: "Mar 16", trips: 14, bank: "OPay", accountEnding: "3341", timestamp: "Mar 16, 06:00" },
  { id: "po-7", ref: "PO-8415", recipient: "SwiftMove Nigeria", recipientType: "fleet", amount: 860000, status: "failed", period: "Mar 10–16", trips: 1128, bank: "Access Bank", accountEnding: "5567", timestamp: "Mar 15, 14:20" },
  { id: "po-8", ref: "PO-8414", recipient: "Radisson Blu Ikeja", recipientType: "hotel", amount: 574000, status: "completed", period: "Mar 3–9", trips: 142, bank: "UBA", accountEnding: "8842", timestamp: "Mar 10, 14:20" },
];

interface Refund {
  id: string;
  ref: string;
  rider: string;
  tripId: string;
  amount: number;
  reason: string;
  status: RefundStatus;
  initiatedBy: string;
  timestamp: string;
}

const REFUNDS: Refund[] = [
  { id: "rf-1", ref: "RF-3421", rider: "Blessing Okafor", tripId: "JT-48202", amount: 1400, reason: "Driver no-show", status: "completed", initiatedBy: "Auto-refund", timestamp: "24 min ago" },
  { id: "rf-2", ref: "RF-3420", rider: "Yemi Fashola", tripId: "JT-48105", amount: 2800, reason: "Overcharge — route deviation", status: "completed", initiatedBy: "Admin: Adeola O.", timestamp: "4h ago" },
  { id: "rf-3", ref: "RF-3419", rider: "Kemi Adeyemi", tripId: "JT-48050", amount: 4200, reason: "Safety concern — aggressive driving", status: "pending", initiatedBy: "Admin: Adeola O.", timestamp: "6h ago" },
  { id: "rf-4", ref: "RF-3418", rider: "Chidi Eze", tripId: "JT-47982", amount: 1200, reason: "AC not working", status: "completed", initiatedBy: "Support agent", timestamp: "1d ago" },
  { id: "rf-5", ref: "RF-3417", rider: "Ngozi Peters", tripId: "JT-47890", amount: 3600, reason: "Wrong destination charged", status: "rejected", initiatedBy: "Rider request", timestamp: "2d ago" },
];

const TABS = ["Overview", "Transactions", "Payouts", "Refunds", "Reports"] as const;
type TabKey = typeof TABS[number];

/* ═══ Sub-components ═══ */
function StatusBadge({ label, color }: { label: string; color: string }) {
  return (
    <span
      className="inline-flex items-center h-5 px-2 rounded-full"
      style={{ background: `${color}14`, color, fontSize: "10px", fontFamily: "'Manrope', sans-serif", fontWeight: 500, letterSpacing: "-0.02em" }}
    >
      {label}
    </span>
  );
}

function TypeBadge({ label, color }: { label: string; color: string }) {
  return (
    <span
      className="inline-flex items-center h-5 px-1.5 rounded"
      style={{ background: `${color}10`, color, fontSize: "9px", fontFamily: "'Manrope', sans-serif", fontWeight: 600, letterSpacing: "0.02em" }}
    >
      {label}
    </span>
  );
}

/* ═══ Main Component ═══ */
export function AdminFinanceFull() {
  const { t, theme } = useAdminTheme();
  const isDark = theme === "dark";

  const [activeTab, setActiveTab] = useState<TabKey>("Overview");
  const [txnSearch, setTxnSearch] = useState("");
  const [txnTypeFilter, setTxnTypeFilter] = useState<TxnType | "all">("all");
  const [txnStatusFilter, setTxnStatusFilter] = useState<TxnStatus | "all">("all");
  const [payoutStatusFilter, setPayoutStatusFilter] = useState<PayoutStatus | "all">("all");

  // Surfaces
  const [selectedTxn, setSelectedTxn] = useState<Transaction | null>(null);
  const [selectedPayout, setSelectedPayout] = useState<Payout | null>(null);
  const [approveModal, setApproveModal] = useState(false);
  const [refundModal, setRefundModal] = useState(false);
  const [retryModal, setRetryModal] = useState<Transaction | null>(null);
  const [ratesDrawer, setRatesDrawer] = useState(false);
  const [reportDrawer, setReportDrawer] = useState(false);
  const [reconcileModal, setReconcileModal] = useState(false);
  const [refundAmount, setRefundAmount] = useState("");
  const [refundReason, setRefundReason] = useState("");
  const [refundTrip, setRefundTrip] = useState("");
  const [confirmState, setConfirmState] = useState<"idle" | "loading" | "done">("idle");

  // Filtered data
  const filteredTxns = useMemo(() => {
    return TRANSACTIONS.filter(txn => {
      if (txnTypeFilter !== "all" && txn.type !== txnTypeFilter) return false;
      if (txnStatusFilter !== "all" && txn.status !== txnStatusFilter) return false;
      if (txnSearch) {
        const q = txnSearch.toLowerCase();
        return txn.ref.toLowerCase().includes(q) || txn.from.toLowerCase().includes(q) || txn.to.toLowerCase().includes(q) || (txn.tripId || "").toLowerCase().includes(q);
      }
      return true;
    });
  }, [txnSearch, txnTypeFilter, txnStatusFilter]);

  const filteredPayouts = useMemo(() => {
    if (payoutStatusFilter === "all") return PAYOUTS;
    return PAYOUTS.filter(p => p.status === payoutStatusFilter);
  }, [payoutStatusFilter]);

  const doConfirm = () => {
    setConfirmState("loading");
    setTimeout(() => setConfirmState("done"), 1200);
    setTimeout(() => {
      setConfirmState("idle");
      setApproveModal(false);
      setRefundModal(false);
      setRetryModal(null);
      setReconcileModal(false);
      setRefundAmount("");
      setRefundReason("");
      setRefundTrip("");
    }, 2400);
  };

  return (
    <>
      <div className="p-3 md:p-5 max-w-[1400px]">
        {/* Tabs */}
        <div className="flex items-center gap-1 mb-5 overflow-x-auto pb-1">
          {TABS.map(tb => (
            <button
              key={tb}
              onClick={() => setActiveTab(tb)}
              className="px-3 h-8 rounded-lg whitespace-nowrap transition-colors"
              style={{ background: activeTab === tb ? t.surfaceActive : "transparent", color: activeTab === tb ? t.text : t.textMuted, ...TY.body, fontSize: "12px" }}
            >
              {tb}
            </button>
          ))}
        </div>

        {activeTab === "Overview" && (
          <OverviewSection t={t} isDark={isDark}
            onApproveBatch={() => setApproveModal(true)}
            onRetryPayments={() => setRetryModal(TRANSACTIONS.find(tx => tx.status === "failed") || null)}
            onIssueRefund={() => setRefundModal(true)}
            onConfigureRates={() => setRatesDrawer(true)}
            onReconcile={() => setReconcileModal(true)}
            onGenerateReport={() => setReportDrawer(true)}
            onViewTransactions={() => setActiveTab("Transactions")}
            onViewPayouts={() => setActiveTab("Payouts")}
          />
        )}

        {activeTab === "Transactions" && (
          <TransactionsSection
            t={t} isDark={isDark}
            transactions={filteredTxns}
            search={txnSearch} onSearchChange={setTxnSearch}
            typeFilter={txnTypeFilter} onTypeFilterChange={setTxnTypeFilter}
            statusFilter={txnStatusFilter} onStatusFilterChange={setTxnStatusFilter}
            onSelectTxn={setSelectedTxn}
            onRetry={(txn) => setRetryModal(txn)}
          />
        )}

        {activeTab === "Payouts" && (
          <PayoutsSection
            t={t} isDark={isDark}
            payouts={filteredPayouts}
            statusFilter={payoutStatusFilter} onStatusFilterChange={setPayoutStatusFilter}
            onSelectPayout={setSelectedPayout}
            onApproveBatch={() => setApproveModal(true)}
          />
        )}

        {activeTab === "Refunds" && (
          <RefundsSection
            t={t} isDark={isDark}
            onIssueRefund={() => setRefundModal(true)}
          />
        )}

        {activeTab === "Reports" && (
          <ReportsSection t={t} isDark={isDark} onGenerate={() => setReportDrawer(true)} />
        )}
      </div>

      {/* ═══ TRANSACTION DETAIL DRAWER ═══ */}
      <AdminDrawer open={!!selectedTxn} onClose={() => setSelectedTxn(null)} title="Transaction Detail" subtitle={selectedTxn?.ref}>
        {selectedTxn && <TransactionDetail txn={selectedTxn} t={t} onRetry={() => { setSelectedTxn(null); setRetryModal(selectedTxn); }} onRefund={() => { setSelectedTxn(null); setRefundModal(true); setRefundTrip(selectedTxn.tripId || ""); setRefundAmount(String(selectedTxn.amount)); }} />}
      </AdminDrawer>

      {/* ═══ PAYOUT DETAIL DRAWER ═══ */}
      <AdminDrawer open={!!selectedPayout} onClose={() => setSelectedPayout(null)} title="Payout Detail" subtitle={selectedPayout?.ref}>
        {selectedPayout && <PayoutDetail payout={selectedPayout} t={t} onApprove={() => { setSelectedPayout(null); setApproveModal(true); }} onRetry={() => { setSelectedPayout(null); }} />}
      </AdminDrawer>

      {/* ═══ RATES DRAWER ═══ */}
      <AdminDrawer open={ratesDrawer} onClose={() => setRatesDrawer(false)} title="Commission Rates" subtitle="Platform fee configuration">
        <RatesEditor t={t} onClose={() => setRatesDrawer(false)} />
      </AdminDrawer>

      {/* ═══ REPORT DRAWER ═══ */}
      <AdminDrawer open={reportDrawer} onClose={() => setReportDrawer(false)} title="Generate Report" subtitle="Financial report builder">
        <ReportBuilder t={t} onClose={() => setReportDrawer(false)} />
      </AdminDrawer>

      {/* ═══ APPROVE BATCH MODAL ═══ */}
      <AdminModal open={approveModal} onClose={() => { setApproveModal(false); setConfirmState("idle"); }} persistent>
        <ModalHeader title="Approve Payout Batch" subtitle="This will release funds to 412 driver accounts" />
        <div className="px-5 py-4 space-y-4">
          <div className="rounded-xl p-4" style={{ background: t.surface, border: `1px solid ${t.borderSubtle}` }}>
            <div className="flex items-center justify-between mb-3">
              <span style={{ ...TY.bodyR, fontSize: "11px", color: t.textFaint }}>Batch Total</span>
              <span style={{ ...TY.h, fontSize: "20px", color: BRAND.green }}>{formatNaira(2800000)}</span>
            </div>
            <div className="space-y-2">
              {[{ l: "Recipients", v: "412 drivers" }, { l: "Settlement window", v: "Closes in 4h" }, { l: "Gateway", v: "Paystack Bulk Transfer" }, { l: "Source account", v: "JET Operations ****4821" }].map(r => (
                <div key={r.l} className="flex items-center justify-between">
                  <span style={{ ...TY.bodyR, fontSize: "11px", color: t.textMuted }}>{r.l}</span>
                  <span style={{ ...TY.body, fontSize: "11px", color: t.text }}>{r.v}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="flex items-start gap-2 p-3 rounded-lg" style={{ background: `${STATUS.warning}08`, border: `1px solid ${STATUS.warning}20` }}>
            <AlertTriangle size={14} style={{ color: STATUS.warning, marginTop: 1, flexShrink: 0 }} />
            <span style={{ ...TY.bodyR, fontSize: "11px", color: t.textMuted, lineHeight: "1.5" }}>
              This action is irreversible. Funds will be transferred to individual driver bank accounts within 30 minutes.
            </span>
          </div>
        </div>
        <ModalFooter>
          <SurfaceButton variant="ghost" onClick={() => { setApproveModal(false); setConfirmState("idle"); }}>Cancel</SurfaceButton>
          <SurfaceButton variant="primary" onClick={doConfirm} loading={confirmState === "loading"}>
            {confirmState === "done" ? "Approved" : "Approve & Release"}
          </SurfaceButton>
        </ModalFooter>
      </AdminModal>

      {/* ═══ REFUND MODAL ═══ */}
      <AdminModal open={refundModal} onClose={() => { setRefundModal(false); setConfirmState("idle"); }} persistent danger>
        <ModalHeader title="Issue Refund" subtitle="Refund will be credited to rider's payment method" />
        <div className="px-5 py-4 space-y-3">
          <div>
            <label style={{ ...TY.label, fontSize: "9px", color: t.textFaint, letterSpacing: "0.06em" }} className="block mb-1.5">TRIP REFERENCE</label>
            <input
              value={refundTrip} onChange={e => setRefundTrip(e.target.value)}
              placeholder="e.g. JT-48320"
              className="w-full h-10 px-3 rounded-lg outline-none"
              style={{ background: t.surface, border: `1px solid ${t.borderSubtle}`, color: t.text, ...TY.body, fontSize: "12px" }}
            />
          </div>
          <div>
            <label style={{ ...TY.label, fontSize: "9px", color: t.textFaint, letterSpacing: "0.06em" }} className="block mb-1.5">AMOUNT (NGN)</label>
            <input
              value={refundAmount} onChange={e => setRefundAmount(e.target.value)}
              placeholder="0"
              type="number"
              className="w-full h-10 px-3 rounded-lg outline-none"
              style={{ background: t.surface, border: `1px solid ${t.borderSubtle}`, color: t.text, ...TY.body, fontSize: "12px" }}
            />
          </div>
          <div>
            <label style={{ ...TY.label, fontSize: "9px", color: t.textFaint, letterSpacing: "0.06em" }} className="block mb-1.5">REASON</label>
            <select
              value={refundReason} onChange={e => setRefundReason(e.target.value)}
              className="w-full h-10 px-3 rounded-lg outline-none appearance-none"
              style={{ background: t.surface, border: `1px solid ${t.borderSubtle}`, color: t.text, ...TY.body, fontSize: "12px" }}
            >
              <option value="">Select reason...</option>
              <option value="overcharge">Overcharge — fare discrepancy</option>
              <option value="no_show">Driver no-show</option>
              <option value="safety">Safety concern</option>
              <option value="route_deviation">Route deviation</option>
              <option value="service_quality">Service quality issue</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>
        <ModalFooter>
          <SurfaceButton variant="ghost" onClick={() => { setRefundModal(false); setConfirmState("idle"); }}>Cancel</SurfaceButton>
          <SurfaceButton variant="danger" onClick={doConfirm} loading={confirmState === "loading"} disabled={!refundAmount || !refundReason}>
            {confirmState === "done" ? "Refund Issued" : `Issue Refund${refundAmount ? ` — ${formatNaira(Number(refundAmount))}` : ""}`}
          </SurfaceButton>
        </ModalFooter>
      </AdminModal>

      {/* ═══ RETRY PAYMENT MODAL ═══ */}
      <AdminModal open={!!retryModal} onClose={() => { setRetryModal(null); setConfirmState("idle"); }}>
        <ModalHeader title="Retry Failed Payment" subtitle={retryModal ? `${retryModal.ref} — ${retryModal.from}` : ""} />
        <div className="px-5 py-4">
          <div className="rounded-xl p-4" style={{ background: t.surface, border: `1px solid ${t.borderSubtle}` }}>
            <div className="space-y-2">
              {retryModal && [
                { l: "Amount", v: formatNaira(retryModal.amount) },
                { l: "Gateway", v: retryModal.gateway },
                { l: "Original attempt", v: retryModal.timestamp },
                { l: "Trip", v: retryModal.tripId || "N/A" },
              ].map(r => (
                <div key={r.l} className="flex items-center justify-between">
                  <span style={{ ...TY.bodyR, fontSize: "11px", color: t.textMuted }}>{r.l}</span>
                  <span style={{ ...TY.body, fontSize: "11px", color: t.text }}>{r.v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <ModalFooter>
          <SurfaceButton variant="ghost" onClick={() => { setRetryModal(null); setConfirmState("idle"); }}>Cancel</SurfaceButton>
          <SurfaceButton variant="primary" onClick={doConfirm} loading={confirmState === "loading"}>
            {confirmState === "done" ? "Retried" : "Retry Payment"}
          </SurfaceButton>
        </ModalFooter>
      </AdminModal>

      {/* ═══ RECONCILE MODAL ═══ */}
      <AdminModal open={reconcileModal} onClose={() => { setReconcileModal(false); setConfirmState("idle"); }} persistent>
        <ModalHeader title="Reconcile Gateway" subtitle="Compare platform records with Paystack settlement" />
        <div className="px-5 py-4 space-y-4">
          <div className="rounded-xl p-4" style={{ background: t.surface, border: `1px solid ${t.borderSubtle}` }}>
            <div className="space-y-2">
              {[
                { l: "Platform total (today)", v: formatNaira(14230000), match: true },
                { l: "Paystack settled", v: formatNaira(14018000), match: false },
                { l: "Discrepancy", v: formatNaira(212000), color: STATUS.warning },
                { l: "Pending settlement", v: formatNaira(212000) },
              ].map(r => (
                <div key={r.l} className="flex items-center justify-between">
                  <span style={{ ...TY.bodyR, fontSize: "11px", color: t.textMuted }}>{r.l}</span>
                  <span style={{ ...TY.body, fontSize: "11px", color: "color" in r && r.color ? r.color : t.text }}>{r.v}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="flex items-start gap-2 p-3 rounded-lg" style={{ background: `${STATUS.info}08`, border: `1px solid ${STATUS.info}20` }}>
            <CheckCircle2 size={14} style={{ color: STATUS.info, marginTop: 1, flexShrink: 0 }} />
            <span style={{ ...TY.bodyR, fontSize: "11px", color: t.textMuted, lineHeight: "1.5" }}>
              Discrepancy within normal range (1.49%). Pending settlements typically clear within 2 hours.
            </span>
          </div>
        </div>
        <ModalFooter>
          <SurfaceButton variant="ghost" onClick={() => { setReconcileModal(false); setConfirmState("idle"); }}>Close</SurfaceButton>
          <SurfaceButton variant="primary" onClick={doConfirm} loading={confirmState === "loading"}>
            {confirmState === "done" ? "Reconciled" : "Mark Reconciled"}
          </SurfaceButton>
        </ModalFooter>
      </AdminModal>
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════
   OVERVIEW TAB
   ═══════════════════════════════════════════════════════════════ */
function OverviewSection({ t, isDark, onApproveBatch, onRetryPayments, onIssueRefund, onConfigureRates, onReconcile, onGenerateReport, onViewTransactions, onViewPayouts }: any) {
  return (
    <>
      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {[
          { label: "Gross Revenue", value: formatNaira(FINANCE_SUMMARY.grossRevenue), icon: TrendingUp, color: t.text, delta: "+8.0%", up: true, source: "SUM(trip.fare) WHERE date = today" },
          { label: "Commission (20%)", value: formatNaira(FINANCE_SUMMARY.commission), icon: Wallet, color: BRAND.green, delta: "+8.0%", up: true, source: "SUM(trip.commission) WHERE date = today" },
          { label: "Processing Fees", value: formatNaira(FINANCE_SUMMARY.paymentProcessing), icon: CreditCard, color: t.textMuted, delta: null, up: false, source: "SUM(txn.gateway_fee) WHERE date = today" },
          { label: "Net Revenue", value: formatNaira(FINANCE_SUMMARY.netRevenue), icon: Banknote, color: BRAND.green, delta: "+7.2%", up: true, source: "commission - processing_fees - refunds" },
        ].map((card, i) => (
          <motion.div
            key={card.label}
            className="p-4 rounded-2xl group relative"
            style={{ background: t.surfaceRaised, border: `1px solid ${t.borderSubtle}`, boxShadow: t.shadow }}
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.05 }}
          >
            <div className="flex items-center justify-between mb-3">
              <card.icon size={14} style={{ color: card.color }} />
              {card.delta && (
                <span className="flex items-center gap-0.5" style={{ ...TY.cap, fontSize: "10px", color: card.up ? BRAND.green : STATUS.error }}>
                  {card.up ? <ArrowUpRight size={10} /> : <ArrowDownRight size={10} />}
                  {card.delta}
                </span>
              )}
            </div>
            <span className="block mb-0.5" style={{ ...TY.h, fontSize: "22px", color: card.color }}>{card.value}</span>
            <span style={{ ...TY.bodyR, fontSize: "10px", color: t.textFaint }}>{card.label}</span>
            <div className="absolute bottom-1 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <span style={{ ...TY.cap, fontSize: "8px", color: t.textGhost }}>{card.source}</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Attention items */}
      <span className="block mb-3" style={{ ...TY.label, fontSize: "9px", color: t.textFaint, letterSpacing: "0.06em" }}>REQUIRES ATTENTION</span>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
        {[
          { label: "Pending Payouts", value: formatNaira(FINANCE_SUMMARY.pendingPayouts), desc: "412 drivers · Settlement in 4h", icon: Clock, color: STATUS.warning, action: onApproveBatch },
          { label: "Failed Payments", value: formatNaira(FINANCE_SUMMARY.failedPayments), desc: "1.8% failure rate · Paystack", icon: XCircle, color: STATUS.error, action: onRetryPayments },
          { label: "Platform Float", value: formatNaira(FINANCE_SUMMARY.float), desc: "Unallocated balance", icon: Wallet, color: STATUS.info, action: onReconcile },
        ].map((item, i) => (
          <motion.button
            key={item.label}
            onClick={item.action}
            className="p-4 rounded-2xl text-left transition-all group"
            style={{ background: `${item.color}06`, border: `1px solid ${item.color}15`, boxShadow: t.shadow }}
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 + i * 0.05 }}
            whileHover={{ scale: 1.01 }}
          >
            <div className="flex items-center justify-between mb-2">
              <item.icon size={16} style={{ color: item.color }} />
              <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: item.color }} />
            </div>
            <span className="block" style={{ ...TY.h, fontSize: "20px", color: item.color }}>{item.value}</span>
            <span className="block mb-0.5" style={{ ...TY.body, fontSize: "12px", color: t.text }}>{item.label}</span>
            <span style={{ ...TY.bodyR, fontSize: "10px", color: t.textMuted }}>{item.desc}</span>
          </motion.button>
        ))}
      </div>

      {/* Revenue Chart */}
      <span className="block mb-3" style={{ ...TY.label, fontSize: "9px", color: t.textFaint, letterSpacing: "0.06em" }}>WEEKLY REVENUE</span>
      <div className="rounded-2xl p-5 mb-6" style={{ background: t.surfaceRaised, border: `1px solid ${t.borderSubtle}`, boxShadow: t.shadow }}>
        <div className="flex items-end gap-2" style={{ height: 120 }}>
          {REVENUE_CHART.map((day, i) => {
            const maxRev = Math.max(...REVENUE_CHART.map(d => d.revenue));
            const h = (day.revenue / maxRev) * 100;
            return (
              <motion.div
                key={day.day}
                className="flex-1 flex flex-col items-center gap-1"
                initial={{ opacity: 0, scaleY: 0 }}
                animate={{ opacity: 1, scaleY: 1 }}
                transition={{ delay: 0.3 + i * 0.05 }}
                style={{ transformOrigin: "bottom" }}
              >
                <span style={{ ...TY.cap, fontSize: "9px", color: t.textMuted }}>{formatNaira(day.revenue)}</span>
                <div className="w-full rounded-lg" style={{ height: `${h}%`, background: i === REVENUE_CHART.length - 1 ? BRAND.green : t.surfaceActive, minHeight: 8, transition: "height 0.5s" }} />
                <span style={{ ...TY.cap, fontSize: "9px", color: t.textFaint }}>{day.day}</span>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Quick actions */}
      <span className="block mb-3" style={{ ...TY.label, fontSize: "9px", color: t.textFaint, letterSpacing: "0.06em" }}>QUICK ACTIONS</span>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
        {[
          { label: "Approve payout batch", icon: CheckCircle2, action: onApproveBatch },
          { label: "Retry failed payments", icon: RefreshCcw, action: onRetryPayments },
          { label: "Issue manual refund", icon: RotateCcw, action: onIssueRefund },
          { label: "View transaction log", icon: Receipt, action: onViewTransactions },
          { label: "Configure commission rates", icon: Percent, action: onConfigureRates },
          { label: "Generate financial report", icon: FileText, action: onGenerateReport },
          { label: "Reconcile payment gateway", icon: RefreshCcw, action: onReconcile },
          { label: "View payout history", icon: Send, action: onViewPayouts },
          { label: "Set payout schedule", icon: Calendar, action: onConfigureRates },
        ].map((action, i) => (
          <motion.button
            key={action.label}
            onClick={action.action}
            className="flex items-center gap-2.5 px-4 h-11 rounded-xl text-left transition-all group"
            style={{ background: t.surface, border: `1px solid ${t.borderSubtle}` }}
            initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 + i * 0.03 }}
            whileHover={{ x: 2 }}
          >
            <action.icon size={13} style={{ color: BRAND.green }} />
            <span style={{ ...TY.body, fontSize: "12px", color: t.text }}>{action.label}</span>
            <ChevronRight size={12} className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: t.textMuted }} />
          </motion.button>
        ))}
      </div>
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════
   TRANSACTIONS TAB
   ═══════════════════════════════════════════════════════════════ */
function TransactionsSection({ t, isDark, transactions, search, onSearchChange, typeFilter, onTypeFilterChange, statusFilter, onStatusFilterChange, onSelectTxn, onRetry }: any) {
  return (
    <>
      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <div className="flex items-center gap-2 flex-1 min-w-[200px] h-9 px-3 rounded-lg" style={{ background: t.surface, border: `1px solid ${t.borderSubtle}` }}>
          <Search size={13} style={{ color: t.iconMuted }} />
          <input
            value={search} onChange={e => onSearchChange(e.target.value)}
            placeholder="Search ref, name, trip ID..."
            className="flex-1 bg-transparent outline-none"
            style={{ color: t.text, ...TY.body, fontSize: "12px" }}
          />
        </div>
        <select
          value={typeFilter} onChange={e => onTypeFilterChange(e.target.value)}
          className="h-9 px-3 rounded-lg outline-none appearance-none"
          style={{ background: t.surface, border: `1px solid ${t.borderSubtle}`, color: t.text, ...TY.body, fontSize: "11px" }}
        >
          <option value="all">All types</option>
          {Object.entries(TXN_TYPE_META).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
        </select>
        <select
          value={statusFilter} onChange={e => onStatusFilterChange(e.target.value)}
          className="h-9 px-3 rounded-lg outline-none appearance-none"
          style={{ background: t.surface, border: `1px solid ${t.borderSubtle}`, color: t.text, ...TY.body, fontSize: "11px" }}
        >
          <option value="all">All statuses</option>
          {Object.entries(TXN_STATUS_META).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className="rounded-2xl overflow-hidden" style={{ background: t.surfaceRaised, border: `1px solid ${t.borderSubtle}`, boxShadow: t.shadow }}>
        {/* Header */}
        <div className="hidden md:grid grid-cols-[1fr_100px_100px_100px_80px_100px_40px] gap-2 px-4 h-10 items-center" style={{ borderBottom: `1px solid ${t.borderSubtle}` }}>
          {["Reference", "Type", "Amount", "Net", "Status", "Time", ""].map(h => (
            <span key={h} style={{ ...TY.label, fontSize: "9px", color: t.textFaint, letterSpacing: "0.06em" }}>{h}</span>
          ))}
        </div>
        {/* Rows */}
        {transactions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Receipt size={24} style={{ color: t.iconMuted, marginBottom: 8 }} />
            <span style={{ ...TY.body, fontSize: "13px", color: t.textMuted }}>No transactions match filters</span>
          </div>
        ) : (
          transactions.map((txn: Transaction, i: number) => {
            const typeMeta = TXN_TYPE_META[txn.type];
            const statusMeta = TXN_STATUS_META[txn.status];
            return (
              <motion.button
                key={txn.id}
                onClick={() => onSelectTxn(txn)}
                className="w-full grid grid-cols-1 md:grid-cols-[1fr_100px_100px_100px_80px_100px_40px] gap-2 px-4 py-3 md:h-12 items-center text-left transition-colors"
                style={{ borderBottom: `1px solid ${t.borderSubtle}` }}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.02 }}
                whileHover={{ backgroundColor: t.surfaceHover }}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span style={{ ...TY.body, fontSize: "12px", color: t.text }} className="truncate">{txn.ref}</span>
                  <span className="hidden md:inline" style={{ ...TY.bodyR, fontSize: "10px", color: t.textMuted }}>{txn.from} → {txn.to}</span>
                </div>
                <TypeBadge label={typeMeta.label} color={typeMeta.color} />
                <span style={{ ...TY.body, fontSize: "12px", color: txn.amount < 0 ? STATUS.error : t.text }}>{txn.amount < 0 ? "-" : ""}{formatNaira(Math.abs(txn.amount))}</span>
                <span style={{ ...TY.bodyR, fontSize: "12px", color: t.textMuted }}>{formatNaira(Math.abs(txn.net))}</span>
                <StatusBadge label={statusMeta.label} color={statusMeta.color} />
                <span style={{ ...TY.bodyR, fontSize: "10px", color: t.textFaint }}>{txn.timestamp}</span>
                <div>
                  {txn.status === "failed" && (
                    <button onClick={e => { e.stopPropagation(); onRetry(txn); }} className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors" style={{ background: `${STATUS.warning}10` }}>
                      <RefreshCcw size={12} style={{ color: STATUS.warning }} />
                    </button>
                  )}
                </div>
              </motion.button>
            );
          })
        )}
      </div>
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════
   PAYOUTS TAB
   ═══════════════════════════════════════════════════════════════ */
function PayoutsSection({ t, isDark, payouts, statusFilter, onStatusFilterChange, onSelectPayout, onApproveBatch }: any) {
  const pendingCount = PAYOUTS.filter(p => p.status === "pending").length;
  return (
    <>
      {/* Top strip */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <select
          value={statusFilter} onChange={e => onStatusFilterChange(e.target.value)}
          className="h-9 px-3 rounded-lg outline-none appearance-none"
          style={{ background: t.surface, border: `1px solid ${t.borderSubtle}`, color: t.text, ...TY.body, fontSize: "11px" }}
        >
          <option value="all">All statuses</option>
          {Object.entries(PAYOUT_STATUS_META).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
        </select>
        {pendingCount > 0 && (
          <button
            onClick={onApproveBatch}
            className="h-9 px-4 rounded-lg flex items-center gap-2 transition-colors"
            style={{ background: BRAND.green, color: "#fff", ...TY.body, fontSize: "12px" }}
          >
            <CheckCircle2 size={13} />
            Approve pending ({pendingCount})
          </button>
        )}
      </div>

      {/* Table */}
      <div className="rounded-2xl overflow-hidden" style={{ background: t.surfaceRaised, border: `1px solid ${t.borderSubtle}`, boxShadow: t.shadow }}>
        <div className="hidden md:grid grid-cols-[1fr_100px_120px_80px_80px_100px] gap-2 px-4 h-10 items-center" style={{ borderBottom: `1px solid ${t.borderSubtle}` }}>
          {["Recipient", "Type", "Amount", "Trips", "Status", "Time"].map(h => (
            <span key={h} style={{ ...TY.label, fontSize: "9px", color: t.textFaint, letterSpacing: "0.06em" }}>{h}</span>
          ))}
        </div>
        {payouts.map((po: Payout, i: number) => {
          const statusMeta = PAYOUT_STATUS_META[po.status];
          return (
            <motion.button
              key={po.id}
              onClick={() => onSelectPayout(po)}
              className="w-full grid grid-cols-1 md:grid-cols-[1fr_100px_120px_80px_80px_100px] gap-2 px-4 py-3 md:h-12 items-center text-left transition-colors"
              style={{ borderBottom: `1px solid ${t.borderSubtle}` }}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.02 }}
              whileHover={{ backgroundColor: t.surfaceHover }}
            >
              <div className="min-w-0">
                <span className="block truncate" style={{ ...TY.body, fontSize: "12px", color: t.text }}>{po.recipient}</span>
                <span style={{ ...TY.bodyR, fontSize: "10px", color: t.textFaint }}>{po.ref} · {po.period}</span>
              </div>
              <TypeBadge label={po.recipientType.charAt(0).toUpperCase() + po.recipientType.slice(1)} color={po.recipientType === "driver" ? BRAND.green : po.recipientType === "fleet" ? STATUS.info : "#F59E0B"} />
              <span style={{ ...TY.body, fontSize: "13px", color: t.text }}>{formatNaira(po.amount)}</span>
              <span style={{ ...TY.bodyR, fontSize: "12px", color: t.textMuted }}>{po.trips.toLocaleString()}</span>
              <StatusBadge label={statusMeta.label} color={statusMeta.color} />
              <span style={{ ...TY.bodyR, fontSize: "10px", color: t.textFaint }}>{po.timestamp}</span>
            </motion.button>
          );
        })}
      </div>
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════
   REFUNDS TAB
   ═══════════════════════════════════════════════════════════════ */
function RefundsSection({ t, isDark, onIssueRefund }: any) {
  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <span style={{ ...TY.body, fontSize: "12px", color: t.text }}>{REFUNDS.length} refunds</span>
          <span style={{ ...TY.bodyR, fontSize: "11px", color: t.textMuted }}>Total: {formatNaira(REFUNDS.filter(r => r.status === "completed").reduce((s, r) => s + r.amount, 0))}</span>
        </div>
        <button
          onClick={onIssueRefund}
          className="h-9 px-4 rounded-lg flex items-center gap-2 transition-colors"
          style={{ background: BRAND.green, color: "#fff", ...TY.body, fontSize: "12px" }}
        >
          <RotateCcw size={13} />
          Issue Refund
        </button>
      </div>

      <div className="rounded-2xl overflow-hidden" style={{ background: t.surfaceRaised, border: `1px solid ${t.borderSubtle}`, boxShadow: t.shadow }}>
        <div className="hidden md:grid grid-cols-[1fr_100px_100px_1fr_80px_100px] gap-2 px-4 h-10 items-center" style={{ borderBottom: `1px solid ${t.borderSubtle}` }}>
          {["Rider", "Trip", "Amount", "Reason", "Status", "Time"].map(h => (
            <span key={h} style={{ ...TY.label, fontSize: "9px", color: t.textFaint, letterSpacing: "0.06em" }}>{h}</span>
          ))}
        </div>
        {REFUNDS.map((rf, i) => {
          const statusMeta = REFUND_STATUS_META[rf.status];
          return (
            <motion.div
              key={rf.id}
              className="grid grid-cols-1 md:grid-cols-[1fr_100px_100px_1fr_80px_100px] gap-2 px-4 py-3 md:h-12 items-center"
              style={{ borderBottom: `1px solid ${t.borderSubtle}` }}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.02 }}
            >
              <div className="min-w-0">
                <span className="block truncate" style={{ ...TY.body, fontSize: "12px", color: t.text }}>{rf.rider}</span>
                <span style={{ ...TY.bodyR, fontSize: "10px", color: t.textFaint }}>{rf.ref} · {rf.initiatedBy}</span>
              </div>
              <span style={{ ...TY.body, fontSize: "11px", color: STATUS.info }}>{rf.tripId}</span>
              <span style={{ ...TY.body, fontSize: "12px", color: STATUS.error }}>{formatNaira(rf.amount)}</span>
              <span className="truncate" style={{ ...TY.bodyR, fontSize: "11px", color: t.textMuted }}>{rf.reason}</span>
              <StatusBadge label={statusMeta.label} color={statusMeta.color} />
              <span style={{ ...TY.bodyR, fontSize: "10px", color: t.textFaint }}>{rf.timestamp}</span>
            </motion.div>
          );
        })}
      </div>
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════
   REPORTS TAB
   ═══════════════════════════════════════════════════════════════ */
function ReportsSection({ t, isDark, onGenerate }: any) {
  const reports = [
    { name: "Weekly Revenue Summary", period: "Mar 10–16, 2026", size: "124 KB", status: "ready" },
    { name: "Monthly P&L Statement", period: "February 2026", size: "342 KB", status: "ready" },
    { name: "Driver Payout Reconciliation", period: "Mar 10–16, 2026", size: "218 KB", status: "ready" },
    { name: "Hotel Partner Invoice Summary", period: "February 2026", size: "89 KB", status: "ready" },
    { name: "Fleet Settlement Report", period: "Mar 10–16, 2026", size: "156 KB", status: "ready" },
    { name: "Payment Gateway Analytics", period: "March 2026 (MTD)", size: "—", status: "generating" },
  ];

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <span style={{ ...TY.body, fontSize: "12px", color: t.text }}>Financial Reports</span>
        <button
          onClick={onGenerate}
          className="h-9 px-4 rounded-lg flex items-center gap-2 transition-colors"
          style={{ background: BRAND.green, color: "#fff", ...TY.body, fontSize: "12px" }}
        >
          <FileText size={13} />
          Generate New
        </button>
      </div>

      <div className="space-y-2">
        {reports.map((rpt, i) => (
          <motion.div
            key={rpt.name}
            className="flex items-center gap-4 p-4 rounded-xl transition-colors group"
            style={{ background: t.surfaceRaised, border: `1px solid ${t.borderSubtle}` }}
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
          >
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${BRAND.green}10` }}>
              <FileText size={16} style={{ color: BRAND.green }} />
            </div>
            <div className="flex-1 min-w-0">
              <span className="block truncate" style={{ ...TY.body, fontSize: "12px", color: t.text }}>{rpt.name}</span>
              <span style={{ ...TY.bodyR, fontSize: "10px", color: t.textFaint }}>{rpt.period} · {rpt.size}</span>
            </div>
            {rpt.status === "ready" ? (
              <button className="h-8 px-3 rounded-lg flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity" style={{ background: t.surface, border: `1px solid ${t.borderSubtle}`, ...TY.body, fontSize: "11px", color: t.text }}>
                <Download size={12} />
                Download
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: `${BRAND.green} transparent ${BRAND.green} ${BRAND.green}` }} />
                <span style={{ ...TY.bodyR, fontSize: "10px", color: t.textMuted }}>Generating...</span>
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════
   TRANSACTION DETAIL (Drawer content)
   ═══════════════════════════════════════════════════════════════ */
function TransactionDetail({ txn, t, onRetry, onRefund }: { txn: Transaction; t: any; onRetry: () => void; onRefund: () => void }) {
  const typeMeta = TXN_TYPE_META[txn.type];
  const statusMeta = TXN_STATUS_META[txn.status];
  return (
    <div className="flex-1 overflow-y-auto p-5 space-y-4">
      {/* Status header */}
      <div className="flex items-center gap-3 mb-2">
        <StatusBadge label={statusMeta.label} color={statusMeta.color} />
        <TypeBadge label={typeMeta.label} color={typeMeta.color} />
      </div>
      <span className="block" style={{ ...TY.h, fontSize: "24px", color: txn.amount < 0 ? STATUS.error : t.text }}>
        {txn.amount < 0 ? "-" : ""}{formatNaira(Math.abs(txn.amount))}
      </span>

      {/* Details */}
      <div className="rounded-xl p-4 space-y-3" style={{ background: t.surface, border: `1px solid ${t.borderSubtle}` }}>
        {[
          { l: "Reference", v: txn.ref },
          { l: "From", v: txn.from },
          { l: "To", v: txn.to },
          ...(txn.tripId ? [{ l: "Trip ID", v: txn.tripId }] : []),
          { l: "Gateway", v: txn.gateway },
          { l: "Processing Fee", v: formatNaira(txn.fee) },
          { l: "Net Amount", v: formatNaira(Math.abs(txn.net)) },
          { l: "Date", v: txn.date },
          { l: "Time", v: txn.timestamp },
        ].map(r => (
          <div key={r.l} className="flex items-center justify-between">
            <span style={{ ...TY.bodyR, fontSize: "11px", color: t.textMuted }}>{r.l}</span>
            <span style={{ ...TY.body, fontSize: "11px", color: t.text }}>{r.v}</span>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="space-y-2 pt-2">
        {txn.status === "failed" && (
          <button onClick={onRetry} className="w-full h-10 rounded-xl flex items-center justify-center gap-2 transition-colors" style={{ background: `${STATUS.warning}10`, border: `1px solid ${STATUS.warning}20`, color: STATUS.warning, ...TY.body, fontSize: "12px" }}>
            <RefreshCcw size={13} /> Retry Payment
          </button>
        )}
        {txn.type === "ride_fare" && txn.status === "completed" && (
          <button onClick={onRefund} className="w-full h-10 rounded-xl flex items-center justify-center gap-2 transition-colors" style={{ background: `${STATUS.error}08`, border: `1px solid ${STATUS.error}20`, color: STATUS.error, ...TY.body, fontSize: "12px" }}>
            <RotateCcw size={13} /> Issue Refund
          </button>
        )}
        <button className="w-full h-10 rounded-xl flex items-center justify-center gap-2 transition-colors" style={{ background: t.surface, border: `1px solid ${t.borderSubtle}`, color: t.text, ...TY.body, fontSize: "12px" }}>
          <Copy size={13} /> Copy Reference
        </button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   PAYOUT DETAIL (Drawer content)
   ═══════════════════════════════════════════════════════════════ */
function PayoutDetail({ payout, t, onApprove, onRetry }: { payout: Payout; t: any; onApprove: () => void; onRetry: () => void }) {
  const statusMeta = PAYOUT_STATUS_META[payout.status];
  return (
    <div className="flex-1 overflow-y-auto p-5 space-y-4">
      <div className="flex items-center gap-3 mb-2">
        <StatusBadge label={statusMeta.label} color={statusMeta.color} />
      </div>
      <span className="block" style={{ ...TY.h, fontSize: "24px", color: t.text }}>{formatNaira(payout.amount)}</span>
      <span className="block" style={{ ...TY.body, fontSize: "14px", color: t.textSecondary }}>{payout.recipient}</span>

      <div className="rounded-xl p-4 space-y-3" style={{ background: t.surface, border: `1px solid ${t.borderSubtle}` }}>
        {[
          { l: "Reference", v: payout.ref },
          { l: "Type", v: payout.recipientType },
          { l: "Period", v: payout.period },
          { l: "Trips", v: String(payout.trips) },
          { l: "Bank", v: payout.bank },
          { l: "Account ending", v: payout.accountEnding },
          { l: "Timestamp", v: payout.timestamp },
        ].map(r => (
          <div key={r.l} className="flex items-center justify-between">
            <span style={{ ...TY.bodyR, fontSize: "11px", color: t.textMuted }}>{r.l}</span>
            <span style={{ ...TY.body, fontSize: "11px", color: t.text }}>{r.v}</span>
          </div>
        ))}
      </div>

      <div className="space-y-2 pt-2">
        {payout.status === "pending" && (
          <button onClick={onApprove} className="w-full h-10 rounded-xl flex items-center justify-center gap-2" style={{ background: BRAND.green, color: "#fff", ...TY.body, fontSize: "12px" }}>
            <CheckCircle2 size={13} /> Approve Payout
          </button>
        )}
        {payout.status === "failed" && (
          <button onClick={onRetry} className="w-full h-10 rounded-xl flex items-center justify-center gap-2" style={{ background: `${STATUS.warning}10`, border: `1px solid ${STATUS.warning}20`, color: STATUS.warning, ...TY.body, fontSize: "12px" }}>
            <RefreshCcw size={13} /> Retry Payout
          </button>
        )}
        <button className="w-full h-10 rounded-xl flex items-center justify-center gap-2" style={{ background: t.surface, border: `1px solid ${t.borderSubtle}`, color: t.text, ...TY.body, fontSize: "12px" }}>
          <Copy size={13} /> Copy Reference
        </button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   RATES EDITOR (Drawer content)
   ═══════════════════════════════════════════════════════════════ */
function RatesEditor({ t, onClose }: { t: any; onClose: () => void }) {
  const [rates, setRates] = useState([
    { category: "Standard Ride", rate: 20, min: 10, max: 30 },
    { category: "Premium Ride", rate: 25, min: 15, max: 35 },
    { category: "EV Ride", rate: 18, min: 10, max: 25 },
    { category: "Hotel Booking", rate: 15, min: 10, max: 20 },
    { category: "Fleet Settlement", rate: 12, min: 8, max: 18 },
  ]);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="flex-1 overflow-y-auto p-5 space-y-4">
      <span style={{ ...TY.bodyR, fontSize: "11px", color: t.textMuted, lineHeight: "1.5" }}>
        Commission rates applied to each ride fare. Changes take effect immediately for new rides.
      </span>
      <div className="space-y-3">
        {rates.map((r, i) => (
          <div key={r.category} className="rounded-xl p-4" style={{ background: t.surface, border: `1px solid ${t.borderSubtle}` }}>
            <div className="flex items-center justify-between mb-2">
              <span style={{ ...TY.body, fontSize: "12px", color: t.text }}>{r.category}</span>
              <span style={{ ...TY.h, fontSize: "16px", color: BRAND.green }}>{r.rate}%</span>
            </div>
            <input
              type="range" min={r.min} max={r.max} value={r.rate}
              onChange={e => {
                const newRates = [...rates];
                newRates[i] = { ...r, rate: Number(e.target.value) };
                setRates(newRates);
              }}
              className="w-full h-1 rounded-full appearance-none"
              style={{ background: `linear-gradient(to right, ${BRAND.green} ${((r.rate - r.min) / (r.max - r.min)) * 100}%, ${t.surfaceActive} ${((r.rate - r.min) / (r.max - r.min)) * 100}%)` }}
            />
            <div className="flex items-center justify-between mt-1">
              <span style={{ ...TY.cap, fontSize: "9px", color: t.textFaint }}>{r.min}%</span>
              <span style={{ ...TY.cap, fontSize: "9px", color: t.textFaint }}>{r.max}%</span>
            </div>
          </div>
        ))}
      </div>
      <button
        onClick={handleSave}
        className="w-full h-10 rounded-xl flex items-center justify-center gap-2"
        style={{ background: BRAND.green, color: "#fff", ...TY.body, fontSize: "12px" }}
      >
        {saved ? <><CheckCircle2 size={13} /> Saved</> : "Save Changes"}
      </button>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   REPORT BUILDER (Drawer content)
   ═══════════════════════════════════════════════════════════════ */
function ReportBuilder({ t, onClose }: { t: any; onClose: () => void }) {
  const [reportType, setReportType] = useState("");
  const [dateRange, setDateRange] = useState("this_week");
  const [generating, setGenerating] = useState(false);
  const [done, setDone] = useState(false);

  const handleGenerate = () => {
    setGenerating(true);
    setTimeout(() => { setGenerating(false); setDone(true); }, 2000);
    setTimeout(() => setDone(false), 4000);
  };

  return (
    <div className="flex-1 overflow-y-auto p-5 space-y-4">
      <div>
        <label style={{ ...TY.label, fontSize: "9px", color: t.textFaint, letterSpacing: "0.06em" }} className="block mb-1.5">REPORT TYPE</label>
        <select
          value={reportType} onChange={e => setReportType(e.target.value)}
          className="w-full h-10 px-3 rounded-lg outline-none appearance-none"
          style={{ background: t.surface, border: `1px solid ${t.borderSubtle}`, color: t.text, ...TY.body, fontSize: "12px" }}
        >
          <option value="">Select report type...</option>
          <option value="revenue">Revenue Summary</option>
          <option value="pnl">P&L Statement</option>
          <option value="payouts">Payout Reconciliation</option>
          <option value="hotel_invoices">Hotel Invoice Summary</option>
          <option value="fleet_settlements">Fleet Settlement Report</option>
          <option value="gateway">Payment Gateway Analytics</option>
          <option value="tax">Tax Report</option>
        </select>
      </div>
      <div>
        <label style={{ ...TY.label, fontSize: "9px", color: t.textFaint, letterSpacing: "0.06em" }} className="block mb-1.5">DATE RANGE</label>
        <select
          value={dateRange} onChange={e => setDateRange(e.target.value)}
          className="w-full h-10 px-3 rounded-lg outline-none appearance-none"
          style={{ background: t.surface, border: `1px solid ${t.borderSubtle}`, color: t.text, ...TY.body, fontSize: "12px" }}
        >
          <option value="today">Today</option>
          <option value="this_week">This Week</option>
          <option value="last_week">Last Week</option>
          <option value="this_month">This Month</option>
          <option value="last_month">Last Month</option>
          <option value="custom">Custom Range</option>
        </select>
      </div>
      <div className="rounded-xl p-4" style={{ background: t.surface, border: `1px solid ${t.borderSubtle}` }}>
        <span className="block mb-2" style={{ ...TY.label, fontSize: "9px", color: t.textFaint, letterSpacing: "0.06em" }}>INCLUDES</span>
        {["Transaction details", "Commission breakdown", "Processing fees", "Payout summary", "Refund log"].map(item => (
          <div key={item} className="flex items-center gap-2 py-1">
            <CheckCircle2 size={12} style={{ color: BRAND.green }} />
            <span style={{ ...TY.bodyR, fontSize: "11px", color: t.textMuted }}>{item}</span>
          </div>
        ))}
      </div>
      <button
        onClick={handleGenerate}
        disabled={!reportType || generating}
        className="w-full h-10 rounded-xl flex items-center justify-center gap-2 transition-opacity"
        style={{ background: BRAND.green, color: "#fff", ...TY.body, fontSize: "12px", opacity: !reportType ? 0.5 : 1 }}
      >
        {generating ? (
          <><div className="w-4 h-4 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: "#fff transparent #fff #fff" }} /> Generating...</>
        ) : done ? (
          <><CheckCircle2 size={13} /> Report Ready — Download</>
        ) : (
          <><FileText size={13} /> Generate Report</>
        )}
      </button>
    </div>
  );
}
