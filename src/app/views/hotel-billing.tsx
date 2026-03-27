/**
 * HOTEL — BILLING TAB
 *
 * One job: Understand costs and invoices.
 * Architecture: Credit meter + Invoice table + Billing terms.
 *
 * Data sources:
 *   - Credit → hotel_partners.credit_limit, SUM(hotel_invoices.total WHERE pending)
 *   - Invoices → hotel_invoices table
 *   - Terms → hotel_partners.billing_cycle, rate_type
 */

import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Receipt, CreditCard, Download, Calendar, Check, Clock, AlertTriangle, ChevronRight } from "lucide-react";
import { useAdminTheme, BRAND, TY, STATUS } from "../config/admin-theme";
import { MOCK_HOTEL, type HotelInvoice } from "../config/hotel-mock-data";
import { Toast } from "../components/shared/toast";
import { BillingSkeleton } from "../components/shared/view-skeleton";
import { ErrorState } from "../components/shared/error-state";

const data = MOCK_HOTEL;

function fmt(n: number): string {
  if (n >= 1000000) return "₦" + (n / 1000000).toFixed(1) + "M";
  return "₦" + n.toLocaleString();
}

function invoiceStatusColor(s: HotelInvoice["status"]): string {
  switch (s) {
    case "paid": return BRAND.green;
    case "pending": return STATUS.warning;
    case "overdue": return STATUS.error;
    default: return "#555";
  }
}

export function HotelBilling() {
  const { t, theme } = useAdminTheme();
  const isDark = theme === "dark";
  const [toastMsg, setToastMsg] = useState<{ msg: string; type: "success" | "info" | "error" } | null>(null);
  const showToast = (msg: string, type: "success" | "info" | "error" = "info") => setToastMsg({ msg, type });
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  const creditPercent = Math.min((data.creditUsed / data.creditLimit) * 100, 100);
  const creditWarning = creditPercent > 80;
  const totalPaid = data.invoices.filter(i => i.status === "paid").reduce((a, i) => a + i.amount, 0);

  if (isLoading) return <BillingSkeleton />;
  if (isError) return <ErrorState onRetry={() => { setIsError(false); setIsLoading(true); setTimeout(() => setIsLoading(false), 500); }} />;

  return (
    <div className="h-full overflow-y-auto p-4 md:p-6">
      <div className="max-w-3xl mx-auto space-y-6">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
          <h2 style={{
            fontFamily: "'Montserrat', sans-serif", fontWeight: 600,
            fontSize: "16px", letterSpacing: "-0.03em", color: t.text, lineHeight: "1.2",
          }}>
            Billing
          </h2>
          <p className="mt-1" style={{ ...TY.bodyR, fontSize: "11px", color: t.textMuted, lineHeight: "1.5" }}>
            Invoices, credit usage, and billing terms
          </p>
        </motion.div>

        {/* KPI Strip */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-3"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
        >
          {[
            { label: "Credit Used", value: fmt(data.creditUsed), color: creditWarning ? STATUS.warning : t.text },
            { label: "Credit Limit", value: fmt(data.creditLimit), color: t.text },
            { label: "Current Invoice", value: fmt(data.invoices[0]?.amount || 0), color: t.text },
            { label: "Total Paid", value: fmt(totalPaid), color: BRAND.green },
          ].map((kpi, i) => (
            <motion.div
              key={kpi.label}
              className="px-3.5 py-3 rounded-xl"
              style={{
                border: `1px solid ${isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.05)"}`,
                background: isDark ? "rgba(255,255,255,0.015)" : "rgba(255,255,255,0.6)",
              }}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 + i * 0.04 }}
            >
              <span className="block" style={{ ...TY.bodyR, fontSize: "9px", color: t.textFaint, lineHeight: "1.5" }}>{kpi.label}</span>
              <span style={{
                fontFamily: "'Montserrat', sans-serif", fontWeight: 600,
                fontSize: "18px", letterSpacing: "-0.03em", color: kpi.color, lineHeight: "1.2",
              }}>
                {kpi.value}
              </span>
            </motion.div>
          ))}
        </motion.div>

        {/* Credit Meter */}
        <motion.div
          className="p-4 rounded-xl"
          style={{
            background: isDark ? "rgba(255,255,255,0.02)" : "rgba(255,255,255,0.8)",
            border: `1px solid ${creditWarning ? `${STATUS.warning}20` : (isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.05)")}`,
          }}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <CreditCard size={12} style={{ color: creditWarning ? STATUS.warning : t.textMuted }} />
              <span style={{ ...TY.body, fontSize: "11px", color: t.text, lineHeight: "1.4", letterSpacing: "-0.02em" }}>
                Monthly Credit
              </span>
            </div>
            <span style={{ ...TY.bodyR, fontSize: "10px", color: creditWarning ? STATUS.warning : t.textMuted, lineHeight: "1.5" }}>
              {creditPercent.toFixed(0)}% used
            </span>
          </div>
          <div className="h-2 rounded-full overflow-hidden mb-2" style={{ background: isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)" }}>
            <motion.div
              className="h-full rounded-full"
              style={{ background: creditWarning ? STATUS.warning : BRAND.green }}
              initial={{ width: 0 }}
              animate={{ width: `${creditPercent}%` }}
              transition={{ duration: 0.6, delay: 0.15 }}
            />
          </div>
          <div className="flex justify-between">
            <span style={{ ...TY.bodyR, fontSize: "10px", color: t.textMuted, lineHeight: "1.5" }}>{fmt(data.creditUsed)} used</span>
            <span style={{ ...TY.bodyR, fontSize: "10px", color: t.textFaint, lineHeight: "1.5" }}>{fmt(data.creditLimit - data.creditUsed)} remaining</span>
          </div>
          {creditWarning && (
            <div className="flex items-center gap-2 mt-3 px-3 py-2 rounded-lg" style={{ background: `${STATUS.warning}06`, border: `1px solid ${STATUS.warning}10` }}>
              <AlertTriangle size={11} style={{ color: STATUS.warning }} />
              <span style={{ ...TY.bodyR, fontSize: "10px", color: STATUS.warning, lineHeight: "1.5" }}>
                Approaching credit limit. Contact JET to request an increase.
              </span>
            </div>
          )}
        </motion.div>

        {/* Separator */}
        <div className="h-px" style={{ background: `linear-gradient(90deg, ${t.borderSubtle}, transparent 80%)` }} />

        {/* Invoices Table */}
        <div>
          <span className="block mb-3" style={{
            fontFamily: "'Montserrat', sans-serif", fontWeight: 600,
            fontSize: "12px", letterSpacing: "-0.02em", color: t.text, lineHeight: "1.2",
          }}>
            Invoices
          </span>

          <div className="rounded-xl overflow-hidden" style={{ border: `1px solid ${isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.05)"}` }}>
            {/* Header row */}
            <div className="grid grid-cols-5 gap-2 px-4 py-2.5" style={{ borderBottom: `1px solid ${t.borderSubtle}`, background: isDark ? "rgba(255,255,255,0.01)" : "rgba(0,0,0,0.01)" }}>
              {["Period", "Rides", "Amount", "Status", ""].map(h => (
                <span key={h} style={{ ...TY.bodyR, fontSize: "9px", color: t.textFaint, letterSpacing: "0.02em", lineHeight: "1.5" }}>{h}</span>
              ))}
            </div>

            {data.invoices.map((inv, i) => {
              const statusColor = invoiceStatusColor(inv.status);
              return (
                <motion.div
                  key={inv.id}
                  className="grid grid-cols-5 gap-2 px-4 py-3 items-center cursor-pointer"
                  style={{ borderBottom: i < data.invoices.length - 1 ? `1px solid ${isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.03)"}` : "none" }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.12 + i * 0.04 }}
                  whileHover={{ backgroundColor: isDark ? "rgba(255,255,255,0.015)" : "rgba(0,0,0,0.008)" }}
                >
                  <span style={{ ...TY.body, fontSize: "11px", color: t.text, lineHeight: "1.4", letterSpacing: "-0.02em" }}>
                    {inv.period}
                  </span>
                  <span style={{ ...TY.bodyR, fontSize: "11px", color: t.textMuted, lineHeight: "1.4" }}>
                    {inv.rideCount}
                  </span>
                  <span style={{
                    fontFamily: "'Montserrat', sans-serif", fontWeight: 600,
                    fontSize: "12px", letterSpacing: "-0.02em", color: t.text, lineHeight: "1.2",
                  }}>
                    {fmt(inv.amount)}
                  </span>
                  <span className="px-2 py-0.5 rounded-lg w-fit" style={{
                    ...TY.bodyR, fontSize: "9px", background: `${statusColor}08`, color: statusColor, lineHeight: "1.4",
                  }}>
                    {inv.status === "paid" ? "Paid" : inv.status === "pending" ? "Pending" : "Overdue"}
                  </span>
                  <button
                    onClick={(e) => { e.stopPropagation(); showToast(`Downloading ${inv.period} invoice...`, "info"); }}
                    className="flex items-center gap-1 px-2 py-1 rounded-lg cursor-pointer"
                    style={{ border: `1px solid ${t.borderSubtle}` }}
                  >
                    <Download size={10} style={{ color: t.textFaint }} />
                    <span style={{ ...TY.bodyR, fontSize: "9px", color: t.textMuted, lineHeight: "1.4" }}>PDF</span>
                  </button>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Separator */}
        <div className="h-px" style={{ background: `linear-gradient(90deg, ${t.borderSubtle}, transparent 80%)` }} />

        {/* Billing Terms */}
        <motion.div
          className="p-4 rounded-xl"
          style={{ background: isDark ? "rgba(255,255,255,0.015)" : "rgba(0,0,0,0.01)", border: `1px solid ${t.borderSubtle}` }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <span className="block mb-3" style={{
            fontFamily: "'Montserrat', sans-serif", fontWeight: 600,
            fontSize: "10px", letterSpacing: "-0.02em", color: t.textFaint, lineHeight: "1.2",
          }}>
            Billing Terms
          </span>
          <div className="space-y-2">
            {[
              { label: "Rate", value: data.corporateRate },
              { label: "Billing cycle", value: data.billingCycle },
              { label: "Credit limit", value: fmt(data.creditLimit) + " / month" },
              { label: "Payment terms", value: "Net 30" },
            ].map(item => (
              <div key={item.label} className="flex items-center justify-between py-1">
                <span style={{ ...TY.bodyR, fontSize: "10px", color: t.textMuted, lineHeight: "1.5" }}>{item.label}</span>
                <span style={{ ...TY.body, fontSize: "11px", color: t.text, lineHeight: "1.4", letterSpacing: "-0.02em" }}>{item.value}</span>
              </div>
            ))}
          </div>
          <button
            onClick={() => showToast("Contact JET support to modify billing terms", "info")}
            className="mt-3 px-3 py-1.5 rounded-lg cursor-pointer"
            style={{ border: `1px solid ${t.borderSubtle}` }}
          >
            <span style={{ ...TY.body, fontSize: "10px", color: t.textMuted, lineHeight: "1.4", letterSpacing: "-0.02em" }}>
              Request changes →
            </span>
          </button>
        </motion.div>

        <div className="h-16" />
      </div>

      {toastMsg && <Toast message={toastMsg.msg} type={toastMsg.type} onDismiss={() => setToastMsg(null)} />}
    </div>
  );
}