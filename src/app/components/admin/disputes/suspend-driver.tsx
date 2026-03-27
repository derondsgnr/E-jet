/**
 * JET ADMIN — SUSPEND DRIVER CONFIRMATION MODAL
 *
 * CENTER MODAL (high-friction) — Irreversible action.
 *
 * What this actually does:
 *   1. Sets driver status to "suspended" in the database
 *   2. Sends push + SMS notification to driver
 *   3. Prevents new ride requests from being matched to this driver
 *   4. If driver has an active ride → that ride completes normally, then lock kicks in
 *
 * What the admin sees:
 *   - Driver's current stats (context, not judgement)
 *   - Active ride status (will they be mid-trip?)
 *   - Duration selection (the admin decides, not a fabricated tier system)
 *   - Impact preview (what happens to the driver's queue)
 *   - Notification preview (what the driver will receive)
 *   - Internal note for audit trail
 *
 * Design: Apple confirmation dialog clarity, Linear density,
 *         Airbnb "show both sides" transparency
 */

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Ban, AlertTriangle, CheckCircle2, Clock,
  ArrowRight, Car, User,
} from "lucide-react";
import { useAdminTheme, TY, BRAND, STATUS } from "../../../config/admin-theme";
import { AdminModal, ModalHeader, ModalFooter, SurfaceButton } from "../ui/surfaces";
import { type Dispute } from "../../../config/dispute-mock-data";

interface SuspendDriverProps {
  open: boolean;
  onClose: () => void;
  dispute: Dispute;
  onConfirm: (data: SuspensionData) => void;
}

export interface SuspensionData {
  driverName: string;
  duration: SuspendDuration;
  reason: string;
  internalNote: string;
  disputeId: string;
}

type SuspendDuration = "24h" | "72h" | "7d" | "30d" | "indefinite";

const DURATION_OPTIONS: { id: SuspendDuration; label: string; desc: string }[] = [
  { id: "24h", label: "24 hours", desc: "Temporary hold. Driver can resume after." },
  { id: "72h", label: "3 days", desc: "Standard cooldown for repeated issues." },
  { id: "7d", label: "7 days", desc: "Extended suspension for serious concerns." },
  { id: "30d", label: "30 days", desc: "Long-term suspension pending review." },
  { id: "indefinite", label: "Indefinite", desc: "Until manually reinstated by an admin." },
];

const REASON_OPTIONS = [
  "Safety concern from this dispute",
  "Pattern of repeated disputes",
  "Rider safety report",
  "Driving behavior concern",
  "Policy violation",
  "Other (specify in note)",
];

export function SuspendDriver({ open, onClose, dispute, onConfirm }: SuspendDriverProps) {
  const { t, theme } = useAdminTheme();
  const d = dispute.driver;

  const [duration, setDuration] = useState<SuspendDuration | null>(null);
  const [reason, setReason] = useState<string | null>(null);
  const [internalNote, setInternalNote] = useState("");
  const [step, setStep] = useState<"configure" | "confirm">("configure");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Simulated: does the driver have a ride in progress?
  const hasActiveRide = useMemo(() => Math.random() > 0.6, []);

  const canProceed = duration !== null && reason !== null;

  const handleConfirm = () => {
    if (!duration || !reason) return;
    setIsSubmitting(true);
    setTimeout(() => {
      onConfirm({
        driverName: d.name,
        duration,
        reason,
        internalNote,
        disputeId: dispute.id,
      });
      setIsSubmitting(false);
      handleClose();
    }, 1200);
  };

  const handleClose = () => {
    setStep("configure");
    setDuration(null);
    setReason(null);
    setInternalNote("");
    onClose();
  };

  const selectedDuration = DURATION_OPTIONS.find(o => o.id === duration);

  return (
    <AdminModal open={open} onClose={handleClose} width={500} persistent={step === "confirm"} danger>
      <ModalHeader
        title={step === "configure" ? "Suspend Driver" : "Confirm Suspension"}
        subtitle={step === "configure" ? `${d.name} · ${dispute.id}` : "This will immediately affect the driver's ability to receive rides"}
        onClose={handleClose}
        icon={<Ban size={16} style={{ color: STATUS.error }} />}
        accentColor={STATUS.error}
      />

      <AnimatePresence mode="wait">
        {step === "configure" ? (
          <motion.div
            key="configure"
            className="overflow-y-auto scrollbar-hide"
            style={{ maxHeight: "calc(100vh - 280px)" }}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -8 }}
            transition={{ duration: 0.15 }}
          >
            <div className="p-6 space-y-5">

              {/* ─── DRIVER CONTEXT ─── */}
              <Section label="DRIVER" t={t}>
                <div
                  className="rounded-xl p-3"
                  style={{ background: t.surface, border: `1px solid ${t.borderSubtle}` }}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center"
                      style={{ background: `${BRAND.green}12` }}
                    >
                      <span style={{ ...TY.body, fontSize: "12px", letterSpacing: "-0.02em", color: BRAND.green }}>{d.avatar}</span>
                    </div>
                    <div>
                      <span className="block" style={{ ...TY.body, fontSize: "13px", letterSpacing: "-0.02em", color: t.text }}>{d.name}</span>
                      <span style={{ ...TY.bodyR, fontSize: "10px", letterSpacing: "-0.02em", color: t.textMuted }}>
                        {d.totalTrips} trips · {d.rating} rating · {d.disputeHistory} prior disputes
                      </span>
                    </div>
                  </div>

                  {/* Active ride warning */}
                  {hasActiveRide && (
                    <div
                      className="rounded-lg p-2.5 flex items-start gap-2"
                      style={{ background: `${STATUS.warning}06`, border: `1px solid ${STATUS.warning}12` }}
                    >
                      <Car size={12} className="mt-0.5 shrink-0" style={{ color: STATUS.warning }} />
                      <div>
                        <span className="block" style={{ ...TY.body, fontSize: "10px", letterSpacing: "-0.02em", color: STATUS.warning }}>
                          Driver has a ride in progress
                        </span>
                        <span style={{ ...TY.bodyR, fontSize: "10px", letterSpacing: "-0.02em", color: t.textMuted }}>
                          The current ride will complete normally. Suspension takes effect after drop-off.
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </Section>

              {/* ─── REASON ─── */}
              <Section label="REASON" t={t}>
                <div className="space-y-1.5">
                  {REASON_OPTIONS.map(r => {
                    const isActive = reason === r;
                    return (
                      <button
                        key={r}
                        className="w-full text-left px-3 py-2.5 rounded-xl transition-all"
                        style={{
                          background: isActive ? `${STATUS.error}08` : "transparent",
                          border: `1px solid ${isActive ? `${STATUS.error}25` : t.borderSubtle}`,
                        }}
                        onClick={() => setReason(r)}
                      >
                        <span style={{ ...TY.body, fontSize: "11px", letterSpacing: "-0.02em", color: isActive ? STATUS.error : t.textSecondary }}>
                          {r}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </Section>

              {/* ─── DURATION ─── */}
              <Section label="DURATION" t={t}>
                <div className="flex flex-wrap gap-2">
                  {DURATION_OPTIONS.map(opt => {
                    const isActive = duration === opt.id;
                    const isDanger = opt.id === "indefinite";
                    return (
                      <button
                        key={opt.id}
                        className="flex-none px-3 py-2 rounded-xl transition-all"
                        style={{
                          background: isActive
                            ? isDanger ? `${STATUS.error}12` : `${STATUS.warning}10`
                            : "transparent",
                          border: `1px solid ${
                            isActive
                              ? isDanger ? `${STATUS.error}30` : `${STATUS.warning}25`
                              : t.borderSubtle
                          }`,
                        }}
                        onClick={() => setDuration(opt.id)}
                      >
                        <span
                          className="block"
                          style={{
                            ...TY.body,
                            fontSize: "12px",
                            letterSpacing: "-0.02em",
                            color: isActive
                              ? isDanger ? STATUS.error : STATUS.warning
                              : t.text,
                          }}
                        >
                          {opt.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
                {selectedDuration && (
                  <motion.span
                    className="block mt-2"
                    style={{ ...TY.bodyR, fontSize: "10px", letterSpacing: "-0.02em", color: t.textMuted }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    {selectedDuration.desc}
                  </motion.span>
                )}
              </Section>

              {/* ─── WHAT HAPPENS ─── */}
              {canProceed && (
                <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
                  <Section label="WHAT HAPPENS" t={t}>
                    <div className="space-y-2">
                      <ImpactRow
                        icon={<Ban size={12} style={{ color: STATUS.error }} />}
                        text={`${d.name} will be unable to receive new ride requests${duration === "indefinite" ? " until manually reinstated" : ` for ${selectedDuration?.label}`}.`}
                        t={t}
                      />
                      <ImpactRow
                        icon={<Clock size={12} style={{ color: STATUS.warning }} />}
                        text={hasActiveRide ? "Current ride completes normally. Lock starts after drop-off." : "Takes effect immediately — driver is not currently on a trip."}
                        t={t}
                      />
                      <ImpactRow
                        icon={<User size={12} style={{ color: STATUS.info }} />}
                        text="Driver receives a push notification and SMS explaining the suspension."
                        t={t}
                      />
                    </div>
                  </Section>
                </motion.div>
              )}

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
                    minHeight: 56,
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
                style={{ background: `${STATUS.error}12` }}
              >
                <Ban size={24} style={{ color: STATUS.error }} />
              </div>

              <span className="block mb-2" style={{ ...TY.sub, fontSize: "16px", letterSpacing: "-0.02em", color: t.text }}>
                Suspend {d.name}?
              </span>

              <span className="block mb-5" style={{ ...TY.bodyR, fontSize: "12px", letterSpacing: "-0.02em", color: t.textMuted, maxWidth: 360 }}>
                {d.name} will be unable to receive ride requests
                {duration === "indefinite" ? " until manually reinstated by an admin" : ` for ${selectedDuration?.label}`}.
                {hasActiveRide ? " Their current ride will complete first." : ""}
              </span>

              {/* Summary */}
              <div
                className="rounded-xl p-4 w-full text-left space-y-2"
                style={{ background: `${STATUS.error}04`, border: `1px solid ${STATUS.error}12` }}
              >
                <SummaryRow label="Reason" value={reason || ""} t={t} />
                <SummaryRow label="Duration" value={selectedDuration?.label || ""} t={t} />
                <SummaryRow label="Linked dispute" value={dispute.id} t={t} />
                {internalNote && <SummaryRow label="Note" value={internalNote} t={t} />}
              </div>

              {/* Irreversibility */}
              <div
                className="rounded-xl p-3 w-full text-left mt-3"
                style={{ background: `${STATUS.warning}06`, border: `1px solid ${STATUS.warning}15` }}
              >
                <div className="flex items-start gap-2">
                  <AlertTriangle size={14} className="mt-0.5 shrink-0" style={{ color: STATUS.warning }} />
                  <span style={{ ...TY.bodyR, fontSize: "10px", letterSpacing: "-0.02em", color: t.textMuted }}>
                    You can reverse this later from the driver's profile. All suspension actions are logged in the audit trail.
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <ModalFooter>
        {step === "configure" ? (
          <>
            <SurfaceButton label="Cancel" variant="ghost" onClick={handleClose} />
            <SurfaceButton
              label="Review Suspension"
              variant="danger"
              icon={<ArrowRight size={14} style={{ color: "#FFFFFF" }} />}
              onClick={() => setStep("confirm")}
              disabled={!canProceed}
            />
          </>
        ) : (
          <>
            <SurfaceButton label="Go Back" variant="outline" onClick={() => setStep("configure")} />
            <SurfaceButton
              label={isSubmitting ? "Suspending..." : "Confirm Suspension"}
              variant="danger"
              icon={isSubmitting ? undefined : <Ban size={14} style={{ color: "#FFFFFF" }} />}
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

function ImpactRow({ icon, text, t }: { icon: React.ReactNode; text: string; t: any }) {
  return (
    <div className="flex items-start gap-2.5 px-3 py-2 rounded-lg" style={{ background: t.surface }}>
      <div className="mt-0.5 shrink-0">{icon}</div>
      <span style={{ ...TY.bodyR, fontSize: "11px", lineHeight: "1.5", letterSpacing: "-0.02em", color: t.textSecondary }}>{text}</span>
    </div>
  );
}

function SummaryRow({ label, value, t }: { label: string; value: string; t: any }) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <span style={{ ...TY.body, fontSize: "10px", letterSpacing: "-0.02em", color: t.textMuted }}>{label}</span>
      <span className="text-right" style={{ ...TY.body, fontSize: "11px", letterSpacing: "-0.02em", color: t.text }}>{value}</span>
    </div>
  );
}
