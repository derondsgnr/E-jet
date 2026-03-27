/**
 * JET ADMIN — RESOLUTION CONFIRMATION MODAL
 *
 * CENTER MODAL (high-friction) — Irreversible action with financial impact.
 *
 * WHAT THIS DOES (only real, executable actions):
 *   1. Favor Rider  — Issue refund via Paystack + close dispute
 *   2. Favor Driver  — Close dispute + notify rider
 *   3. Split         — Issue partial refund + close dispute
 *
 * WHAT THIS DOES NOT DO (removed — no backend exists):
 *   ✕ Warning tier system — policy must be defined by ops, not invented by UI
 *   ✕ Escalation teams — no team management or assignment queue exists
 *   ✕ SLA reassignment — no escalation platform to receive it
 *
 * The admin sees: driver's raw dispute history as data (not a fabricated
 * "warning tier"), notification previews, refund amount, internal note.
 * The system records the verdict + note. That's it.
 */

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  User, Shield, RefreshCcw, AlertTriangle, CheckCircle2,
  ArrowRight, Wallet, Clock,
} from "lucide-react";
import { useAdminTheme, TY, BRAND, STATUS } from "../../../config/admin-theme";
import { AdminModal, ModalHeader, ModalFooter, SurfaceButton } from "../ui/surfaces";
import { formatNaira, type Dispute } from "../../../config/dispute-mock-data";

export type VerdictType = "rider" | "driver" | "split";

interface ResolutionConfirmationProps {
  open: boolean;
  onClose: () => void;
  dispute: Dispute;
  verdict: VerdictType;
  onConfirm: (verdict: VerdictType, data: ResolutionData) => void;
}

export interface ResolutionData {
  verdict: VerdictType;
  refundAmount: number;
  internalNote: string;
}

const VERDICT_CONFIG: Record<VerdictType, {
  title: string;
  icon: React.ComponentType<{ size?: number; style?: React.CSSProperties }>;
  color: string;
  description: string;
}> = {
  rider: {
    title: "Favor Rider",
    icon: User,
    color: STATUS.info,
    description: "Full refund issued to rider. Dispute closed.",
  },
  driver: {
    title: "Favor Driver",
    icon: Shield,
    color: BRAND.green,
    description: "Dispute closed in driver's favor. Rider notified with explanation.",
  },
  split: {
    title: "Split Resolution",
    icon: RefreshCcw,
    color: STATUS.warning,
    description: "Partial refund to rider. Both parties notified of split outcome.",
  },
};

export function ResolutionConfirmation({
  open,
  onClose,
  dispute,
  verdict,
  onConfirm,
}: ResolutionConfirmationProps) {
  const { t, theme } = useAdminTheme();
  const config = VERDICT_CONFIG[verdict];

  const [internalNote, setInternalNote] = useState("");
  const [splitPercent, setSplitPercent] = useState(50);
  const [step, setStep] = useState<"review" | "confirm">("review");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const refundAmount = useMemo(() => {
    if (verdict === "rider") return dispute.trip.fare;
    if (verdict === "split") return Math.round(dispute.trip.fare * (splitPercent / 100));
    return 0;
  }, [verdict, dispute.trip.fare, splitPercent]);

  const handleConfirm = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      onConfirm(verdict, {
        verdict,
        refundAmount,
        internalNote,
      });
      setIsSubmitting(false);
      setStep("review");
      onClose();
    }, 1200);
  };

  const handleClose = () => {
    setStep("review");
    setInternalNote("");
    setSplitPercent(50);
    onClose();
  };

  const Icon = config.icon;

  return (
    <AdminModal open={open} onClose={handleClose} width={500} persistent={step === "confirm"}>
      {/* Header */}
      <ModalHeader
        title={step === "review" ? config.title : "Confirm Action"}
        subtitle={step === "review" ? `${dispute.id} · ${dispute.title}` : "This action cannot be undone"}
        onClose={handleClose}
        icon={<Icon size={16} style={{ color: config.color }} />}
        accentColor={config.color}
      />

      <AnimatePresence mode="wait">
        {step === "review" ? (
          <motion.div
            key="review"
            className="overflow-y-auto scrollbar-hide"
            style={{ maxHeight: "calc(100vh - 280px)" }}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -8 }}
            transition={{ duration: 0.15 }}
          >
            <div className="p-6 space-y-5">

              {/* ─── WHAT HAPPENS ─── */}
              <Section label="WHAT HAPPENS" t={t}>
                <div className="space-y-2.5">
                  {/* Financial impact — only for rider/split */}
                  {(verdict === "rider" || verdict === "split") && (
                    <ImpactRow
                      icon={<Wallet size={13} style={{ color: config.color }} />}
                      label="Refund to rider"
                      value={formatNaira(refundAmount)}
                      detail={
                        verdict === "split"
                          ? `${splitPercent}% of ${formatNaira(dispute.trip.fare)} fare · ${dispute.trip.paymentMethod === "Wallet" ? "Wallet credit" : "Paystack reversal"}`
                          : `Full fare · ${dispute.trip.paymentMethod === "Wallet" ? "Wallet credit (instant)" : "Paystack reversal (1-3 business days)"}`
                      }
                      valueColor={config.color}
                      t={t}
                    />
                  )}

                  {verdict === "driver" && (
                    <ImpactRow
                      icon={<Shield size={13} style={{ color: BRAND.green }} />}
                      label="Dispute closed"
                      value="No refund"
                      detail="Rider will be notified. No impact on driver record."
                      valueColor={BRAND.green}
                      t={t}
                    />
                  )}
                </div>
              </Section>

              {/* ─── DRIVER CONTEXT (raw data, not fabricated tiers) ─── */}
              {verdict === "rider" && dispute.driver.disputeHistory > 0 && (
                <Section label="DRIVER HISTORY" t={t}>
                  <div
                    className="rounded-xl p-3"
                    style={{
                      background: dispute.driver.disputeHistory >= 5 ? `${STATUS.error}06` : t.surface,
                      border: `1px solid ${dispute.driver.disputeHistory >= 5 ? `${STATUS.error}12` : t.borderSubtle}`,
                    }}
                  >
                    <div className="flex items-baseline justify-between mb-1">
                      <span style={{ ...TY.body, fontSize: "12px", letterSpacing: "-0.02em", color: t.text }}>
                        {dispute.driver.disputeHistory} prior disputes
                      </span>
                      <span style={{ ...TY.bodyR, fontSize: "10px", letterSpacing: "-0.02em", color: t.textMuted }}>
                        {dispute.driver.totalTrips} total trips · {dispute.driver.rating} rating
                      </span>
                    </div>
                    <span style={{ ...TY.bodyR, fontSize: "10px", lineHeight: "1.5", letterSpacing: "-0.02em", color: t.textMuted }}>
                      This data is visible to you for context. Consequences (warnings, suspensions) are separate ops decisions.
                    </span>
                  </div>
                </Section>
              )}

              {/* ─── SPLIT SLIDER ─── */}
              {verdict === "split" && (
                <Section label="REFUND AMOUNT" t={t}>
                  <div
                    className="rounded-xl p-4"
                    style={{ background: t.surface, border: `1px solid ${t.borderSubtle}` }}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span style={{ ...TY.body, fontSize: "12px", letterSpacing: "-0.02em", color: t.text }}>
                        Rider: {formatNaira(refundAmount)}
                      </span>
                      <span style={{ ...TY.body, fontSize: "12px", letterSpacing: "-0.02em", color: t.textMuted }}>
                        Platform: {formatNaira(dispute.trip.fare - refundAmount)}
                      </span>
                    </div>

                    {/* Slider track */}
                    <div className="relative h-8 flex items-center">
                      <div className="absolute inset-x-0 h-1.5 rounded-full" style={{ background: t.surfaceActive }} />
                      <div
                        className="absolute h-1.5 rounded-full left-0"
                        style={{ width: `${splitPercent}%`, background: STATUS.warning }}
                      />
                      <input
                        type="range"
                        min={10}
                        max={90}
                        step={5}
                        value={splitPercent}
                        onChange={e => setSplitPercent(Number(e.target.value))}
                        className="absolute inset-x-0 h-8 opacity-0 cursor-pointer"
                      />
                      <div
                        className="absolute w-5 h-5 rounded-full -translate-x-1/2 pointer-events-none"
                        style={{
                          left: `${splitPercent}%`,
                          background: STATUS.warning,
                          boxShadow: `0 0 0 3px ${STATUS.warning}20`,
                        }}
                      >
                        <span
                          className="absolute -top-6 left-1/2 -translate-x-1/2"
                          style={{ ...TY.cap, fontSize: "10px", letterSpacing: "-0.02em", color: STATUS.warning, whiteSpace: "nowrap" }}
                        >
                          {splitPercent}%
                        </span>
                      </div>
                    </div>

                    {/* Quick presets */}
                    <div className="flex gap-2 mt-3">
                      {[25, 50, 75].map(pct => (
                        <button
                          key={pct}
                          className="flex-1 h-7 rounded-lg transition-colors"
                          style={{
                            background: splitPercent === pct ? `${STATUS.warning}15` : t.surface,
                            border: `1px solid ${splitPercent === pct ? `${STATUS.warning}30` : t.borderSubtle}`,
                          }}
                          onClick={() => setSplitPercent(pct)}
                        >
                          <span style={{ ...TY.cap, fontSize: "10px", letterSpacing: "-0.02em", color: splitPercent === pct ? STATUS.warning : t.textMuted }}>
                            {pct}%
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                </Section>
              )}

              {/* ─── NOTIFICATION PREVIEW ─── */}
              <Section label="BOTH PARTIES WILL BE NOTIFIED" t={t}>
                <div className="space-y-2.5">
                  <NotificationPreview
                    party="Rider"
                    name={dispute.rider.name}
                    avatar={dispute.rider.avatar}
                    message={getRiderNotification(verdict, dispute, refundAmount)}
                    accentColor={STATUS.info}
                    t={t}
                  />
                  <NotificationPreview
                    party="Driver"
                    name={dispute.driver.name}
                    avatar={dispute.driver.avatar}
                    message={getDriverNotification(verdict, dispute)}
                    accentColor={BRAND.green}
                    t={t}
                  />
                </div>
              </Section>

              {/* ─── INTERNAL NOTE ─── */}
              <Section label="INTERNAL NOTE (OPTIONAL)" t={t}>
                <textarea
                  className="w-full rounded-xl p-3 resize-none outline-none"
                  style={{
                    background: t.surface,
                    border: `1px solid ${t.borderSubtle}`,
                    color: t.text,
                    ...TY.bodyR,
                    fontSize: "12px",
                    letterSpacing: "-0.02em",
                    minHeight: 64,
                  }}
                  placeholder="Add context for the audit trail..."
                  value={internalNote}
                  onChange={e => setInternalNote(e.target.value)}
                />
              </Section>
            </div>
          </motion.div>
        ) : (
          /* ─── CONFIRMATION STEP ─── */
          <motion.div
            key="confirm"
            className="p-6"
            initial={{ opacity: 0, x: 8 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 8 }}
            transition={{ duration: 0.15 }}
          >
            <div className="flex flex-col items-center text-center py-4">
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4"
                style={{ background: `${config.color}12` }}
              >
                <Icon size={24} style={{ color: config.color }} />
              </div>

              <span className="block mb-2" style={{ ...TY.sub, fontSize: "16px", letterSpacing: "-0.02em", color: t.text }}>
                Confirm resolution?
              </span>

              <span className="block mb-5" style={{ ...TY.bodyR, fontSize: "12px", letterSpacing: "-0.02em", color: t.textMuted, maxWidth: 360 }}>
                {config.description}
                {refundAmount > 0 && (
                  <>
                    {" "}A refund of <strong style={{ color: config.color }}>{formatNaira(refundAmount)}</strong> will be processed to {dispute.rider.name}'s {dispute.trip.paymentMethod}.
                  </>
                )}
              </span>

              {/* Irreversibility warning */}
              <div
                className="rounded-xl p-3 w-full text-left"
                style={{
                  background: `${STATUS.warning}06`,
                  border: `1px solid ${STATUS.warning}15`,
                }}
              >
                <div className="flex items-start gap-2">
                  <AlertTriangle size={14} className="mt-0.5 shrink-0" style={{ color: STATUS.warning }} />
                  <div>
                    <span className="block mb-0.5" style={{ ...TY.body, fontSize: "11px", letterSpacing: "-0.02em", color: STATUS.warning }}>
                      This action cannot be undone
                    </span>
                    <span style={{ ...TY.bodyR, fontSize: "10px", letterSpacing: "-0.02em", color: t.textMuted }}>
                      {verdict === "rider" && `${formatNaira(refundAmount)} refund via ${dispute.trip.paymentMethod === "Wallet" ? "wallet credit" : "Paystack reversal"}. Both parties notified.`}
                      {verdict === "driver" && `${dispute.rider.name} will be notified the dispute was closed. No refund issued.`}
                      {verdict === "split" && `${splitPercent}% refund (${formatNaira(refundAmount)}) to rider via ${dispute.trip.paymentMethod === "Wallet" ? "wallet credit" : "Paystack reversal"}. Both parties notified.`}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <ModalFooter>
        {step === "review" ? (
          <>
            <SurfaceButton label="Cancel" variant="ghost" onClick={handleClose} />
            <SurfaceButton
              label="Review & Confirm"
              variant="primary"
              icon={<ArrowRight size={14} style={{ color: "#FFFFFF" }} />}
              onClick={() => setStep("confirm")}
            />
          </>
        ) : (
          <>
            <SurfaceButton label="Go Back" variant="outline" onClick={() => setStep("review")} />
            <SurfaceButton
              label={isSubmitting ? "Processing..." : "Confirm Resolution"}
              variant="primary"
              icon={
                isSubmitting
                  ? undefined
                  : <CheckCircle2 size={14} style={{ color: "#FFFFFF" }} />
              }
              onClick={handleConfirm}
              loading={isSubmitting}
            />
          </>
        )}
      </ModalFooter>
    </AdminModal>
  );
}

/* ═══ Sub-components ═══ */

function Section({ label, t, children }: { label: string; t: any; children: React.ReactNode }) {
  return (
    <div>
      <span className="block mb-2" style={{ ...TY.label, fontSize: "9px", color: t.textFaint }}>{label}</span>
      {children}
    </div>
  );
}

function ImpactRow({
  icon, label, value, detail, valueColor, t,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  detail: string;
  valueColor: string;
  t: any;
}) {
  return (
    <div
      className="flex items-start gap-3 p-3 rounded-xl"
      style={{ background: t.surface, border: `1px solid ${t.borderSubtle}` }}
    >
      <div className="mt-0.5 shrink-0">{icon}</div>
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline justify-between gap-2">
          <span style={{ ...TY.body, fontSize: "12px", letterSpacing: "-0.02em", color: t.text }}>{label}</span>
          <span className="shrink-0" style={{ ...TY.body, fontSize: "12px", letterSpacing: "-0.02em", color: valueColor }}>{value}</span>
        </div>
        <span className="block mt-0.5" style={{ ...TY.bodyR, fontSize: "10px", letterSpacing: "-0.02em", color: t.textMuted }}>{detail}</span>
      </div>
    </div>
  );
}

function NotificationPreview({
  party, name, avatar, message, accentColor, t,
}: {
  party: string;
  name: string;
  avatar: string;
  message: string;
  accentColor: string;
  t: any;
}) {
  return (
    <div
      className="rounded-xl p-3"
      style={{ background: `${accentColor}04`, border: `1px solid ${accentColor}10` }}
    >
      <div className="flex items-center gap-2 mb-2">
        <div
          className="w-6 h-6 rounded-full flex items-center justify-center shrink-0"
          style={{ background: `${accentColor}12` }}
        >
          <span style={{ ...TY.cap, fontSize: "8px", letterSpacing: "-0.02em", color: accentColor }}>{avatar}</span>
        </div>
        <span style={{ ...TY.body, fontSize: "11px", letterSpacing: "-0.02em", color: t.text }}>{name}</span>
        <span style={{ ...TY.cap, fontSize: "8px", letterSpacing: "-0.02em", color: accentColor }}>{party}</span>
        <div className="flex gap-1 ml-auto">
          {["Push", "SMS"].map(ch => (
            <span key={ch} className="px-1.5 py-0.5 rounded" style={{ ...TY.cap, fontSize: "8px", letterSpacing: "-0.02em", color: t.textFaint, background: t.surface }}>
              {ch}
            </span>
          ))}
        </div>
      </div>
      <div className="rounded-lg p-2.5" style={{ background: t.surface }}>
        <span style={{ ...TY.bodyR, fontSize: "11px", lineHeight: "1.6", letterSpacing: "-0.02em", color: t.textSecondary }}>
          {message}
        </span>
      </div>
    </div>
  );
}

/* ─── Notification templates ─── */

function getRiderNotification(verdict: VerdictType, dispute: Dispute, refundAmount: number): string {
  const first = dispute.rider.name.split(" ")[0];
  switch (verdict) {
    case "rider":
      return `Hi ${first}, your dispute (${dispute.id}) has been resolved in your favor. A refund of ${formatNaira(refundAmount)} will be credited to your ${dispute.trip.paymentMethod === "Wallet" ? "JET Wallet" : "card"} within 1-3 business days. Thank you for your patience.`;
    case "driver":
      return `Hi ${first}, after reviewing all evidence for dispute ${dispute.id}, we've determined the original charge was correct. If you have additional information, you can reach out to support within 48 hours.`;
    case "split":
      return `Hi ${first}, your dispute (${dispute.id}) has been partially resolved. A refund of ${formatNaira(refundAmount)} will be credited to your ${dispute.trip.paymentMethod === "Wallet" ? "JET Wallet" : "card"} within 1-3 business days.`;
  }
}

function getDriverNotification(verdict: VerdictType, dispute: Dispute): string {
  const first = dispute.driver.name.split(" ")[0];
  switch (verdict) {
    case "rider":
      return `${first}, dispute ${dispute.id} has been resolved. A refund was issued to the rider. This resolution has been logged to your trip history.`;
    case "driver":
      return `${first}, dispute ${dispute.id} has been resolved in your favor. No action has been taken against your account. Thank you for your cooperation.`;
    case "split":
      return `${first}, dispute ${dispute.id} has been resolved with a partial refund to the rider. This resolution has been logged to your trip history.`;
  }
}
