 /**
 * Wallet Sheets — overlay/bottom-sheet components for the wallet flow.
 *
 * Sheets:
 *   - TopUpSheet        → select amount → confirm → success
 *   - SendSheet         → pick recipient → enter amount → confirm → success
 *   - TxDetailSheet     → full transaction detail (route, method, ref, timestamp)
 *   - AllTransactions   → date-grouped scrollable list with category filter
 *   - AddCardSheet      → mock card entry form
 *   - ManageMethodSheet → set default, remove (with confirm)
 */

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  X,
  Check,
  ArrowDownLeft,
  ArrowUpRight,
  Send,
  Gift,
  Zap,
  MapPin,
  CreditCard,
  Copy,
  ChevronLeft,
  Trash2,
  Star,
  Plus,
  Search,
} from "lucide-react";
import {
  GLASS_COLORS,
  GLASS_TYPE,
  MOTION,
  type GlassColorMode,
} from "../../config/project";
import { BRAND_COLORS } from "../../config/brand";
import {
  type Transaction,
  type TxCategory,
  type TxStatus,
  type PaymentMethod,
  type SendRecipient,
  TRANSACTIONS,
  PAYMENT_METHODS,
  RECENT_RECIPIENTS,
  TOP_UP_AMOUNTS,
  WALLET_BALANCE,
} from "./wallet-data";

/* ═══════════════════════════════════════════════════════════════════════════
   Shared helpers
   ═══════════════════════════════════════════════════════════════════════════ */

function SheetBackdrop({
  colorMode,
  onClose,
}: {
  colorMode: GlassColorMode;
  onClose: () => void;
}) {
  const d = colorMode === "dark";
  return (
    <motion.div
      className="absolute inset-0"
      style={{ background: d ? "rgba(0,0,0,0.6)" : "rgba(0,0,0,0.25)" }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    />
  );
}

function SheetContainer({
  colorMode,
  children,
  fullHeight,
}: {
  colorMode: GlassColorMode;
  children: React.ReactNode;
  fullHeight?: boolean;
}) {
  const d = colorMode === "dark";
  return (
    <motion.div
      className="relative z-10"
      style={{
        background: d ? "#111113" : "#FFFFFF",
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        boxShadow: d
          ? "0 -8px 40px rgba(0,0,0,0.5)"
          : "0 -8px 40px rgba(0,0,0,0.08)",
        ...(fullHeight ? { height: "92vh" } : {}),
      }}
      initial={{ y: "100%" }}
      animate={{ y: 0 }}
      exit={{ y: "100%" }}
      transition={{ type: "spring", stiffness: 350, damping: 30 }}
    >
      <div className="flex justify-center pt-2.5 pb-1">
        <div
          className="w-9 h-1 rounded-full"
          style={{
            background: d ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.15)",
          }}
        />
      </div>
      {children}
    </motion.div>
  );
}

function SheetHeader({
  colorMode,
  title,
  onClose,
}: {
  colorMode: GlassColorMode;
  title: string;
  onClose: () => void;
}) {
  const c = GLASS_COLORS[colorMode];
  return (
    <div className="flex items-center justify-between py-3 mb-4 px-5">
      <span
        style={{
          fontFamily: "var(--font-heading)",
          fontSize: "18px",
          fontWeight: 600,
          letterSpacing: "-0.02em",
          lineHeight: "1.2",
          color: c.text.primary,
        }}
      >
        {title}
      </span>
      <motion.button
        className="w-8 h-8 rounded-lg flex items-center justify-center"
        style={{ background: c.surface.subtle }}
        onClick={onClose}
        whileTap={{ scale: 0.9 }}
      >
        <X className="w-4 h-4" style={{ color: c.icon.secondary }} />
      </motion.button>
    </div>
  );
}

function SuccessState({
  colorMode,
  title,
  subtitle,
}: {
  colorMode: GlassColorMode;
  title: string;
  subtitle: string;
}) {
  const c = GLASS_COLORS[colorMode];
  return (
    <motion.div
      className="py-10 text-center"
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
    >
      <div
        className="w-14 h-14 rounded-full mx-auto mb-4 flex items-center justify-center"
        style={{ background: c.green.tint }}
      >
        <Check className="w-7 h-7" style={{ color: BRAND_COLORS.green }} />
      </div>
      <div
        style={{
          fontFamily: "var(--font-heading)",
          fontSize: "17px",
          fontWeight: 600,
          letterSpacing: "-0.02em",
          lineHeight: "1.3",
          color: c.text.primary,
        }}
      >
        {title}
      </div>
      <div
        className="mt-1.5"
        style={{ ...GLASS_TYPE.caption, color: c.text.muted }}
      >
        {subtitle}
      </div>
    </motion.div>
  );
}

/** Category → icon mapping */
function TxIcon({ category, type }: { category: TxCategory; type: "debit" | "credit" }) {
  if (category === "ride") return <MapPin className="w-3.5 h-3.5" />;
  if (category === "topup") return <ArrowDownLeft className="w-3.5 h-3.5" />;
  if (category === "send") return <Send className="w-3.5 h-3.5" />;
  if (category === "referral") return <Gift className="w-3.5 h-3.5" />;
  if (category === "promo") return <Zap className="w-3.5 h-3.5" />;
  return type === "credit" ? (
    <ArrowDownLeft className="w-3.5 h-3.5" />
  ) : (
    <ArrowUpRight className="w-3.5 h-3.5" />
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   1. TOP-UP SHEET
   ═══════════════════════════════════════════════════════════════════════════ */

export function TopUpSheet({
  colorMode,
  onClose,
}: {
  colorMode: GlassColorMode;
  onClose: () => void;
}) {
  const c = GLASS_COLORS[colorMode];
  const [selected, setSelected] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const handleConfirm = () => {
    if (!selected) return;
    setDone(true);
    setTimeout(() => onClose(), 1500);
  };

  return (
    <div className="absolute inset-0 z-50 flex flex-col justify-end">
      <SheetBackdrop colorMode={colorMode} onClose={onClose} />
      <SheetContainer colorMode={colorMode}>
        <SheetHeader colorMode={colorMode} title="Top up wallet" onClose={onClose} />
        <div className="px-5 pb-6">
          {done ? (
            <SuccessState
              colorMode={colorMode}
              title="Top-up successful"
              subtitle={`${selected} added to your wallet`}
            />
          ) : (
            <>
              <div className="grid grid-cols-2 gap-2.5 mb-5">
                {TOP_UP_AMOUNTS.map((amount) => (
                  <motion.button
                    key={amount}
                    className="rounded-xl text-center"
                    style={{
                      padding: "18px 0",
                      background:
                        selected === amount ? c.green.tint : c.surface.subtle,
                      border:
                        selected === amount
                          ? `1.5px solid ${BRAND_COLORS.green}40`
                          : "1.5px solid transparent",
                    }}
                    onClick={() => setSelected(amount)}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span
                      style={{
                        fontFamily: "var(--font-heading)",
                        fontSize: "16px",
                        fontWeight: 600,
                        letterSpacing: "-0.02em",
                        lineHeight: "1",
                        color:
                          selected === amount
                            ? BRAND_COLORS.green
                            : c.text.primary,
                      }}
                    >
                      {amount}
                    </span>
                  </motion.button>
                ))}
              </div>
              <motion.button
                className="w-full py-3.5 rounded-2xl flex items-center justify-center"
                style={{
                  background: selected ? BRAND_COLORS.green : c.surface.subtle,
                  opacity: selected ? 1 : 0.5,
                }}
                onClick={handleConfirm}
                whileTap={selected ? { scale: 0.97 } : {}}
              >
                <span
                  style={{
                    ...GLASS_TYPE.bodySmall,
                    fontWeight: 600,
                    color: selected ? "#FFFFFF" : c.text.muted,
                  }}
                >
                  {selected ? `Add ${selected}` : "Select amount"}
                </span>
              </motion.button>
            </>
          )}
        </div>
      </SheetContainer>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   2. SEND SHEET
   ═══════════════════════════════════════════════════════════════════════════ */

type SendStep = "recipient" | "amount" | "confirm" | "done";

export function SendSheet({
  colorMode,
  onClose,
}: {
  colorMode: GlassColorMode;
  onClose: () => void;
}) {
  const c = GLASS_COLORS[colorMode];
  const d = colorMode === "dark";
  const [step, setStep] = useState<SendStep>("recipient");
  const [selectedRecipient, setSelectedRecipient] = useState<SendRecipient | null>(null);
  const [amount, setAmount] = useState("");

  const handlePickRecipient = (r: SendRecipient) => {
    setSelectedRecipient(r);
    setStep("amount");
  };

  const handleAmountNext = () => {
    if (!amount || parseFloat(amount) <= 0) return;
    setStep("confirm");
  };

  const handleConfirmSend = () => {
    setStep("done");
    setTimeout(() => onClose(), 1500);
  };

  const goBack = () => {
    if (step === "amount") setStep("recipient");
    else if (step === "confirm") setStep("amount");
    else onClose();
  };

  return (
    <div className="absolute inset-0 z-50 flex flex-col justify-end">
      <SheetBackdrop colorMode={colorMode} onClose={onClose} />
      <SheetContainer colorMode={colorMode}>
        <div className="px-5 pb-6">
          {/* Header with back */}
          <div className="flex items-center justify-between py-3 mb-4">
            <div className="flex items-center gap-2">
              {step !== "recipient" && step !== "done" && (
                <motion.button
                  className="w-7 h-7 rounded-lg flex items-center justify-center"
                  style={{ background: c.surface.subtle }}
                  onClick={goBack}
                  whileTap={{ scale: 0.9 }}
                >
                  <ChevronLeft className="w-4 h-4" style={{ color: c.icon.secondary }} />
                </motion.button>
              )}
              <span
                style={{
                  fontFamily: "var(--font-heading)",
                  fontSize: "18px",
                  fontWeight: 600,
                  letterSpacing: "-0.02em",
                  lineHeight: "1.2",
                  color: c.text.primary,
                }}
              >
                {step === "recipient" && "Send to"}
                {step === "amount" && "Enter amount"}
                {step === "confirm" && "Confirm"}
                {step === "done" && ""}
              </span>
            </div>
            {step !== "done" && (
              <motion.button
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ background: c.surface.subtle }}
                onClick={onClose}
                whileTap={{ scale: 0.9 }}
              >
                <X className="w-4 h-4" style={{ color: c.icon.secondary }} />
              </motion.button>
            )}
          </div>

          <AnimatePresence mode="wait">
            {/* ── Step 1: Pick recipient ── */}
            {step === "recipient" && (
              <motion.div
                key="recipient"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
              >
                <div className="space-y-1.5">
                  {RECENT_RECIPIENTS.map((r, i) => (
                    <motion.button
                      key={r.id}
                      className="w-full text-left flex items-center gap-3 px-4 py-3.5 rounded-xl"
                      style={{
                        background: c.surface.subtle,
                        border: "1px solid transparent",
                      }}
                      onClick={() => handlePickRecipient(r)}
                      whileTap={{ scale: 0.98 }}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * MOTION.stagger }}
                    >
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
                        style={{
                          background: d
                            ? "rgba(255,255,255,0.08)"
                            : "rgba(11,11,13,0.06)",
                        }}
                      >
                        <span
                          style={{
                            ...GLASS_TYPE.caption,
                            fontWeight: 600,
                            color: c.text.tertiary,
                          }}
                        >
                          {r.initials}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div
                          style={{
                            ...GLASS_TYPE.bodySmall,
                            color: c.text.primary,
                          }}
                        >
                          {r.name}
                        </div>
                        <div
                          className="mt-0.5"
                          style={{ ...GLASS_TYPE.caption, color: c.text.muted }}
                        >
                          {r.phone}
                        </div>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* ── Step 2: Amount ── */}
            {step === "amount" && (
              <motion.div
                key="amount"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
              >
                <div className="text-center mb-2">
                  <span
                    style={{ ...GLASS_TYPE.caption, color: c.text.muted }}
                  >
                    To {selectedRecipient?.name}
                  </span>
                </div>
                <div className="flex items-center justify-center gap-1 mb-2">
                  <span
                    style={{
                      fontFamily: "var(--font-heading)",
                      fontSize: "14px",
                      fontWeight: 600,
                      letterSpacing: "-0.02em",
                      color: c.text.muted,
                    }}
                  >
                    ₦
                  </span>
                  <input
                    type="number"
                    inputMode="numeric"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0"
                    autoFocus
                    className="bg-transparent text-center outline-none w-40"
                    style={{
                      fontFamily: "var(--font-heading)",
                      fontSize: "38px",
                      fontWeight: 700,
                      letterSpacing: "-0.04em",
                      lineHeight: "1",
                      color: c.text.display,
                      caretColor: BRAND_COLORS.green,
                    }}
                  />
                </div>
                <div className="text-center mb-6">
                  <span
                    style={{ ...GLASS_TYPE.caption, color: c.text.faint }}
                  >
                    Balance: {WALLET_BALANCE}
                  </span>
                </div>
                <motion.button
                  className="w-full py-3.5 rounded-2xl flex items-center justify-center"
                  style={{
                    background:
                      amount && parseFloat(amount) > 0
                        ? BRAND_COLORS.green
                        : c.surface.subtle,
                    opacity: amount && parseFloat(amount) > 0 ? 1 : 0.5,
                  }}
                  onClick={handleAmountNext}
                  whileTap={
                    amount && parseFloat(amount) > 0 ? { scale: 0.97 } : {}
                  }
                >
                  <span
                    style={{
                      ...GLASS_TYPE.bodySmall,
                      fontWeight: 600,
                      color:
                        amount && parseFloat(amount) > 0
                          ? "#FFFFFF"
                          : c.text.muted,
                    }}
                  >
                    Continue
                  </span>
                </motion.button>
              </motion.div>
            )}

            {/* ── Step 3: Confirm ── */}
            {step === "confirm" && (
              <motion.div
                key="confirm"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
              >
                <div
                  className="rounded-xl px-4 py-4 mb-5 space-y-3"
                  style={{
                    background: c.surface.subtle,
                    border: `1px solid ${c.surface.hover}`,
                  }}
                >
                  <div className="flex items-center justify-between">
                    <span style={{ ...GLASS_TYPE.caption, color: c.text.muted }}>
                      To
                    </span>
                    <span style={{ ...GLASS_TYPE.bodySmall, color: c.text.primary }}>
                      {selectedRecipient?.name}
                    </span>
                  </div>
                  <div
                    style={{
                      borderBottom: `1px solid ${d ? "rgba(255,255,255,0.04)" : "rgba(11,11,13,0.04)"}`,
                    }}
                  />
                  <div className="flex items-center justify-between">
                    <span style={{ ...GLASS_TYPE.caption, color: c.text.muted }}>
                      Amount
                    </span>
                    <span
                      style={{
                        fontFamily: "var(--font-heading)",
                        fontSize: "16px",
                        fontWeight: 600,
                        letterSpacing: "-0.02em",
                        lineHeight: "1",
                        color: c.text.primary,
                      }}
                    >
                      ₦{parseFloat(amount).toLocaleString()}
                    </span>
                  </div>
                  <div
                    style={{
                      borderBottom: `1px solid ${d ? "rgba(255,255,255,0.04)" : "rgba(11,11,13,0.04)"}`,
                    }}
                  />
                  <div className="flex items-center justify-between">
                    <span style={{ ...GLASS_TYPE.caption, color: c.text.muted }}>
                      From
                    </span>
                    <span style={{ ...GLASS_TYPE.bodySmall, color: c.text.primary }}>
                      JET Wallet
                    </span>
                  </div>
                </div>
                <motion.button
                  className="w-full py-3.5 rounded-2xl flex items-center justify-center"
                  style={{ background: BRAND_COLORS.green }}
                  onClick={handleConfirmSend}
                  whileTap={{ scale: 0.97 }}
                >
                  <span
                    style={{
                      ...GLASS_TYPE.bodySmall,
                      fontWeight: 600,
                      color: "#FFFFFF",
                    }}
                  >
                    Send ₦{parseFloat(amount).toLocaleString()}
                  </span>
                </motion.button>
              </motion.div>
            )}

            {/* ── Step 4: Done ── */}
            {step === "done" && (
              <motion.div key="done">
                <SuccessState
                  colorMode={colorMode}
                  title="Money sent"
                  subtitle={`₦${parseFloat(amount).toLocaleString()} sent to ${selectedRecipient?.name}`}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </SheetContainer>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   3. TRANSACTION DETAIL SHEET
   ═══════════════════════════════════════════════════════════════════════════ */

/** Status → display config */
const STATUS_CONFIG: Record<
  TxStatus,
  { label: string; color: string; bg: (d: boolean) => string }
> = {
  success: {
    label: "Successful",
    color: "#1DB954",
    bg: (d) => (d ? "rgba(29,185,84,0.12)" : "rgba(29,185,84,0.08)"),
  },
  pending: {
    label: "Pending",
    color: "#F59E0B",
    bg: (d) => (d ? "rgba(245,158,11,0.12)" : "rgba(245,158,11,0.08)"),
  },
  failed: {
    label: "Failed",
    color: "#EF4444",
    bg: (d) => (d ? "rgba(239,68,68,0.12)" : "rgba(239,68,68,0.08)"),
  },
  refunded: {
    label: "Refunded",
    color: "#8B5CF6",
    bg: (d) => (d ? "rgba(139,92,246,0.12)" : "rgba(139,92,246,0.08)"),
  },
};

/** Contextual action label per category */
function getContextualAction(category: TxCategory): string | null {
  switch (category) {
    case "ride":
      return "Book again";
    case "topup":
      return "Top up again";
    case "send":
      return "Send again";
    default:
      return null;
  }
}

export function TxDetailSheet({
  colorMode,
  tx,
  onClose,
  onContextualAction,
}: {
  colorMode: GlassColorMode;
  tx: Transaction;
  onClose: () => void;
  /** Fires the contextual repeat action (book again, top up again, etc.) */
  onContextualAction?: () => void;
}) {
  const c = GLASS_COLORS[colorMode];
  const d = colorMode === "dark";
  const [copied, setCopied] = useState(false);

  const statusConf = STATUS_CONFIG[tx.status];
  const contextAction = getContextualAction(tx.category);
  const isRide = tx.category === "ride";
  const divider = `1px solid ${d ? "rgba(255,255,255,0.04)" : "rgba(11,11,13,0.04)"}`;

  const handleCopy = () => {
    navigator.clipboard?.writeText(tx.ref).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="absolute inset-0 z-50 flex flex-col justify-end">
      <SheetBackdrop colorMode={colorMode} onClose={onClose} />
      <SheetContainer colorMode={colorMode}>
        <SheetHeader colorMode={colorMode} title="Transaction" onClose={onClose} />
        <div className="px-5 pb-6 overflow-y-auto" style={{ maxHeight: "75vh" }}>
          {/* ── Hero: amount + label + status ── */}
          <div className="text-center mb-1">
            <span
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "32px",
                fontWeight: 700,
                letterSpacing: "-0.04em",
                lineHeight: "1",
                color:
                  tx.type === "credit" ? BRAND_COLORS.green : c.text.primary,
              }}
            >
              {tx.amount}
            </span>
          </div>
          <div className="flex items-center justify-center gap-2 mb-1.5">
            <span style={{ ...GLASS_TYPE.bodySmall, color: c.text.muted }}>
              {tx.label}
            </span>
          </div>
          {/* Status badge — compact, centered */}
          <div className="flex justify-center mb-5">
            <span
              className="px-2 py-0.5 rounded-md"
              style={{
                ...GLASS_TYPE.caption,
                fontSize: "10px",
                fontWeight: 600,
                color: statusConf.color,
                background: statusConf.bg(d),
              }}
            >
              {statusConf.label}
            </span>
          </div>

          {/* ── Ride trip context (rides only) ── */}
          {isRide && tx.trip && (
            <div
              className="flex items-center gap-3 px-4 py-3 rounded-xl mb-3"
              style={{
                background: c.surface.subtle,
                border: `1px solid ${c.surface.hover}`,
              }}
            >
              {/* Driver avatar */}
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
                style={{
                  background: d
                    ? "rgba(255,255,255,0.08)"
                    : "rgba(11,11,13,0.06)",
                }}
              >
                <span
                  style={{
                    ...GLASS_TYPE.caption,
                    fontWeight: 600,
                    color: c.text.tertiary,
                  }}
                >
                  {tx.trip.driverInitials}
                </span>
              </div>
              {/* Driver + vehicle */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span
                    style={{ ...GLASS_TYPE.bodySmall, color: c.text.primary }}
                  >
                    {tx.trip.driverName}
                  </span>
                  {tx.trip.isEV && (
                    <span
                      className="px-1 py-px rounded"
                      style={{
                        ...GLASS_TYPE.caption,
                        fontSize: "8px",
                        fontWeight: 600,
                        color: c.green.evText,
                        background: c.green.evBg,
                      }}
                    >
                      EV
                    </span>
                  )}
                </div>
                <div
                  className="mt-0.5 truncate"
                  style={{ ...GLASS_TYPE.caption, color: c.text.muted }}
                >
                  {tx.trip.vehicle}
                </div>
              </div>
              {/* Trip stats */}
              <div className="text-right shrink-0">
                <div style={{ ...GLASS_TYPE.caption, color: c.text.tertiary }}>
                  {tx.trip.durationMin} min
                </div>
                <div
                  className="mt-0.5"
                  style={{ ...GLASS_TYPE.caption, color: c.text.muted }}
                >
                  {tx.trip.distanceKm} km
                </div>
              </div>
            </div>
          )}

          {/* ── Details card ── */}
          <div
            className="rounded-xl px-4 py-1 mb-3"
            style={{
              background: c.surface.subtle,
              border: `1px solid ${c.surface.hover}`,
            }}
          >
            {/* Full timestamp */}
            <div className="flex items-center justify-between py-3">
              <span style={{ ...GLASS_TYPE.caption, color: c.text.muted }}>
                Date
              </span>
              <span style={{ ...GLASS_TYPE.bodySmall, color: c.text.primary }}>
                {tx.fullDate}
              </span>
            </div>
            <div style={{ borderBottom: divider }} />

            {/* Route (rides only) */}
            {isRide && tx.route && (
              <>
                <div className="flex items-center justify-between py-3">
                  <span style={{ ...GLASS_TYPE.caption, color: c.text.muted }}>
                    Route
                  </span>
                  <span
                    className="text-right"
                    style={{ ...GLASS_TYPE.bodySmall, color: c.text.primary }}
                  >
                    {tx.route.from} → {tx.route.to}
                  </span>
                </div>
                <div style={{ borderBottom: divider }} />
              </>
            )}

            {/* Payment method */}
            {tx.methodLabel && (
              <>
                <div className="flex items-center justify-between py-3">
                  <span style={{ ...GLASS_TYPE.caption, color: c.text.muted }}>
                    Paid with
                  </span>
                  <span
                    style={{ ...GLASS_TYPE.bodySmall, color: c.text.primary }}
                  >
                    {tx.methodLabel}
                  </span>
                </div>
                {isRide && tx.breakdown && (
                  <div style={{ borderBottom: divider }} />
                )}
              </>
            )}

            {/* Fare breakdown (rides only) — inline rows, no toggle */}
            {isRide && tx.breakdown && (
              <>
                <div className="py-2.5 space-y-2">
                  <div className="flex items-center justify-between">
                    <span
                      style={{ ...GLASS_TYPE.caption, color: c.text.faint }}
                    >
                      Base fare
                    </span>
                    <span
                      style={{ ...GLASS_TYPE.caption, color: c.text.muted }}
                    >
                      {tx.breakdown.baseFare}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span
                      style={{ ...GLASS_TYPE.caption, color: c.text.faint }}
                    >
                      Distance
                    </span>
                    <span
                      style={{ ...GLASS_TYPE.caption, color: c.text.muted }}
                    >
                      {tx.breakdown.distance}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span
                      style={{ ...GLASS_TYPE.caption, color: c.text.faint }}
                    >
                      Time
                    </span>
                    <span
                      style={{ ...GLASS_TYPE.caption, color: c.text.muted }}
                    >
                      {tx.breakdown.time}
                    </span>
                  </div>
                  {tx.breakdown.surge && (
                    <div className="flex items-center justify-between">
                      <span
                        style={{ ...GLASS_TYPE.caption, color: c.text.faint }}
                      >
                        Surge
                      </span>
                      <span
                        style={{ ...GLASS_TYPE.caption, color: c.text.muted }}
                      >
                        {tx.breakdown.surge}
                      </span>
                    </div>
                  )}
                  {tx.breakdown.discount && (
                    <div className="flex items-center justify-between">
                      <span
                        style={{ ...GLASS_TYPE.caption, color: c.text.faint }}
                      >
                        Discount
                      </span>
                      <span
                        style={{
                          ...GLASS_TYPE.caption,
                          color: BRAND_COLORS.green,
                        }}
                      >
                        {tx.breakdown.discount}
                      </span>
                    </div>
                  )}
                </div>
                <div style={{ borderBottom: divider }} />
                <div className="flex items-center justify-between py-3">
                  <span
                    style={{
                      ...GLASS_TYPE.caption,
                      fontWeight: 600,
                      color: c.text.tertiary,
                    }}
                  >
                    Total
                  </span>
                  <span
                    style={{
                      ...GLASS_TYPE.bodySmall,
                      fontWeight: 600,
                      color: c.text.primary,
                    }}
                  >
                    {tx.breakdown.total}
                  </span>
                </div>
              </>
            )}
          </div>

          {/* ── Reference — copy ── */}
          <motion.button
            className="w-full flex items-center justify-between px-4 py-3 rounded-xl mb-5"
            style={{
              background: c.surface.subtle,
              border: `1px solid ${c.surface.hover}`,
            }}
            onClick={handleCopy}
            whileTap={{ scale: 0.98 }}
          >
            <div>
              <div style={{ ...GLASS_TYPE.caption, color: c.text.muted }}>
                Reference
              </div>
              <div
                className="mt-0.5"
                style={{ ...GLASS_TYPE.bodySmall, color: c.text.primary }}
              >
                {tx.ref}
              </div>
            </div>
            <div className="flex items-center gap-1">
              {copied ? (
                <Check
                  className="w-3.5 h-3.5"
                  style={{ color: BRAND_COLORS.green }}
                />
              ) : (
                <Copy className="w-3.5 h-3.5" style={{ color: c.icon.muted }} />
              )}
              <span
                style={{
                  ...GLASS_TYPE.caption,
                  color: copied ? BRAND_COLORS.green : c.text.muted,
                }}
              >
                {copied ? "Copied" : "Copy"}
              </span>
            </div>
          </motion.button>

          {/* ── Actions — quiet text links (Linear style) ── */}
          <div
            className="flex items-center justify-center gap-5"
            style={{
              borderTop: divider,
              paddingTop: "14px",
            }}
          >
            {contextAction && onContextualAction && (
              <motion.button
                className="flex items-center gap-1"
                onClick={onContextualAction}
                whileTap={{ scale: 0.95 }}
              >
                <span
                  style={{
                    ...GLASS_TYPE.caption,
                    fontWeight: 600,
                    color: BRAND_COLORS.green,
                  }}
                >
                  {contextAction}
                </span>
              </motion.button>
            )}
            <motion.button
              className="flex items-center gap-1"
              onClick={() => {
                const text = `JET Receipt\n${tx.label}\n${tx.amount}\n${tx.fullDate}\nRef: ${tx.ref}`;
                navigator.clipboard?.writeText(text).catch(() => {});
                setCopied(true);
                setTimeout(() => setCopied(false), 1500);
              }}
              whileTap={{ scale: 0.95 }}
            >
              <span
                style={{ ...GLASS_TYPE.caption, color: c.text.muted }}
              >
                Share receipt
              </span>
            </motion.button>
            <motion.button
              className="flex items-center gap-1"
              whileTap={{ scale: 0.95 }}
            >
              <span
                style={{ ...GLASS_TYPE.caption, color: c.text.muted }}
              >
                Report issue
              </span>
            </motion.button>
          </div>
        </div>
      </SheetContainer>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   4. ALL TRANSACTIONS VIEW (full-screen overlay)
   ═══════════════════════════════════════════════════════════════════════════ */

const CATEGORY_FILTERS: { id: TxCategory | "all"; label: string }[] = [
  { id: "all", label: "All" },
  { id: "ride", label: "Rides" },
  { id: "topup", label: "Top-ups" },
  { id: "send", label: "Sent" },
  { id: "referral", label: "Referrals" },
  { id: "promo", label: "Promos" },
];

export function AllTransactionsView({
  colorMode,
  onClose,
  onTxTap,
}: {
  colorMode: GlassColorMode;
  onClose: () => void;
  onTxTap: (tx: Transaction) => void;
}) {
  const c = GLASS_COLORS[colorMode];
  const d = colorMode === "dark";
  const [filter, setFilter] = useState<TxCategory | "all">("all");

  const filtered = useMemo(
    () =>
      filter === "all"
        ? TRANSACTIONS
        : TRANSACTIONS.filter((t) => t.category === filter),
    [filter],
  );

  // Group by date
  const grouped = useMemo(() => {
    const map = new Map<string, Transaction[]>();
    for (const tx of filtered) {
      const g = map.get(tx.date) ?? [];
      g.push(tx);
      map.set(tx.date, g);
    }
    return Array.from(map.entries());
  }, [filtered]);

  return (
    <div className="absolute inset-0 z-50 flex flex-col justify-end">
      <SheetBackdrop colorMode={colorMode} onClose={onClose} />
      <SheetContainer colorMode={colorMode} fullHeight>
        <div className="flex flex-col h-full">
          <SheetHeader colorMode={colorMode} title="Transactions" onClose={onClose} />

          {/* Category filter pills */}
          <div
            className="flex gap-2 px-5 pb-4 overflow-x-auto scrollbar-hide"
            style={{ WebkitOverflowScrolling: "touch" }}
          >
            {CATEGORY_FILTERS.map((cf) => (
              <motion.button
                key={cf.id}
                className="shrink-0 px-3 py-1.5 rounded-lg"
                style={{
                  background:
                    filter === cf.id
                      ? d
                        ? "rgba(29,185,84,0.12)"
                        : "rgba(29,185,84,0.08)"
                      : c.surface.subtle,
                  border:
                    filter === cf.id
                      ? `1px solid ${BRAND_COLORS.green}30`
                      : "1px solid transparent",
                }}
                onClick={() => setFilter(cf.id)}
                whileTap={{ scale: 0.95 }}
              >
                <span
                  style={{
                    ...GLASS_TYPE.caption,
                    fontWeight: filter === cf.id ? 600 : 500,
                    color:
                      filter === cf.id ? BRAND_COLORS.green : c.text.muted,
                  }}
                >
                  {cf.label}
                </span>
              </motion.button>
            ))}
          </div>

          {/* Grouped list */}
          <div className="flex-1 overflow-y-auto px-5 pb-8 scrollbar-hide">
            {grouped.length === 0 && (
              <div className="text-center py-12">
                <span style={{ ...GLASS_TYPE.bodySmall, color: c.text.muted }}>
                  No transactions
                </span>
              </div>
            )}
            {grouped.map(([date, txs]) => (
              <div key={date} className="mb-5">
                <div className="mb-2">
                  <span style={{ ...GLASS_TYPE.label, color: c.text.faint }}>
                    {date}
                  </span>
                </div>
                <div className="space-y-0.5">
                  {txs.map((tx, i) => (
                    <motion.button
                      key={tx.id}
                      className="w-full text-left flex items-center gap-3 px-3 py-3.5 rounded-xl"
                      style={{ background: "transparent" }}
                      onClick={() => onTxTap(tx)}
                      whileTap={{ scale: 0.98 }}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.03 }}
                    >
                      <div
                        className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                        style={{
                          background:
                            tx.type === "credit"
                              ? c.green.tint
                              : c.surface.subtle,
                          color:
                            tx.type === "credit"
                              ? BRAND_COLORS.green
                              : c.icon.tertiary,
                        }}
                      >
                        <TxIcon category={tx.category} type={tx.type} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div
                          className="truncate"
                          style={{
                            ...GLASS_TYPE.bodySmall,
                            color: c.text.primary,
                          }}
                        >
                          {tx.label}
                        </div>
                        <div
                          className="mt-0.5"
                          style={{
                            ...GLASS_TYPE.caption,
                            color: c.text.muted,
                          }}
                        >
                          {tx.time}
                        </div>
                      </div>
                      <span
                        style={{
                          fontFamily: "var(--font-heading)",
                          fontSize: "14px",
                          fontWeight: 500,
                          letterSpacing: "-0.02em",
                          lineHeight: "1",
                          color:
                            tx.type === "credit"
                              ? BRAND_COLORS.green
                              : c.text.primary,
                        }}
                      >
                        {tx.amount}
                      </span>
                    </motion.button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </SheetContainer>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   5. ADD CARD SHEET
   ═══════════════════════════════════════════════════════════════════════════ */

export function AddCardSheet({
  colorMode,
  onClose,
}: {
  colorMode: GlassColorMode;
  onClose: () => void;
}) {
  const c = GLASS_COLORS[colorMode];
  const d = colorMode === "dark";
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [done, setDone] = useState(false);

  const isValid =
    cardNumber.replace(/\s/g, "").length >= 16 &&
    expiry.length >= 5 &&
    cvv.length >= 3;

  const handleAdd = () => {
    if (!isValid) return;
    setDone(true);
    setTimeout(() => onClose(), 1500);
  };

  const formatCardNumber = (val: string) => {
    const digits = val.replace(/\D/g, "").slice(0, 16);
    return digits.replace(/(.{4})/g, "$1 ").trim();
  };

  const formatExpiry = (val: string) => {
    const digits = val.replace(/\D/g, "").slice(0, 4);
    if (digits.length > 2) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
    return digits;
  };

  const inputStyle = {
    ...GLASS_TYPE.bodySmall,
    color: c.text.primary,
    background: c.surface.subtle,
    border: `1px solid ${c.surface.hover}`,
    borderRadius: "12px",
    padding: "14px 16px",
    width: "100%",
    outline: "none",
    caretColor: BRAND_COLORS.green,
  };

  return (
    <div className="absolute inset-0 z-50 flex flex-col justify-end">
      <SheetBackdrop colorMode={colorMode} onClose={onClose} />
      <SheetContainer colorMode={colorMode}>
        <SheetHeader colorMode={colorMode} title="Add card" onClose={onClose} />
        <div className="px-5 pb-6">
          {done ? (
            <SuccessState
              colorMode={colorMode}
              title="Card added"
              subtitle={`•••• ${cardNumber.replace(/\s/g, "").slice(-4)} saved to your wallet`}
            />
          ) : (
            <>
              <div className="space-y-3 mb-5">
                <div>
                  <label
                    style={{
                      ...GLASS_TYPE.caption,
                      color: c.text.muted,
                      display: "block",
                      marginBottom: "6px",
                    }}
                  >
                    Card number
                  </label>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                    placeholder="0000 0000 0000 0000"
                    style={inputStyle}
                  />
                </div>
                <div className="flex gap-3">
                  <div className="flex-1">
                    <label
                      style={{
                        ...GLASS_TYPE.caption,
                        color: c.text.muted,
                        display: "block",
                        marginBottom: "6px",
                      }}
                    >
                      Expiry
                    </label>
                    <input
                      type="text"
                      inputMode="numeric"
                      value={expiry}
                      onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                      placeholder="MM/YY"
                      style={inputStyle}
                    />
                  </div>
                  <div className="flex-1">
                    <label
                      style={{
                        ...GLASS_TYPE.caption,
                        color: c.text.muted,
                        display: "block",
                        marginBottom: "6px",
                      }}
                    >
                      CVV
                    </label>
                    <input
                      type="text"
                      inputMode="numeric"
                      value={cvv}
                      onChange={(e) => setCvv(e.target.value.replace(/\D/g, "").slice(0, 4))}
                      placeholder="000"
                      style={inputStyle}
                    />
                  </div>
                </div>
              </div>
              <motion.button
                className="w-full py-3.5 rounded-2xl flex items-center justify-center"
                style={{
                  background: isValid ? BRAND_COLORS.green : c.surface.subtle,
                  opacity: isValid ? 1 : 0.5,
                }}
                onClick={handleAdd}
                whileTap={isValid ? { scale: 0.97 } : {}}
              >
                <span
                  style={{
                    ...GLASS_TYPE.bodySmall,
                    fontWeight: 600,
                    color: isValid ? "#FFFFFF" : c.text.muted,
                  }}
                >
                  Add card
                </span>
              </motion.button>
            </>
          )}
        </div>
      </SheetContainer>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   6. MANAGE PAYMENT METHODS SHEET
   ═══════════════════════════════════════════════════════════════════════════ */

export function ManageMethodsSheet({
  colorMode,
  methods,
  onClose,
  onSetDefault,
  onRemove,
  onAddCard,
}: {
  colorMode: GlassColorMode;
  methods: PaymentMethod[];
  onClose: () => void;
  onSetDefault: (id: string) => void;
  onRemove: (id: string) => void;
  onAddCard: () => void;
}) {
  const c = GLASS_COLORS[colorMode];
  const d = colorMode === "dark";
  const [confirmRemove, setConfirmRemove] = useState<string | null>(null);

  const handleRemove = (id: string) => {
    if (confirmRemove === id) {
      onRemove(id);
      setConfirmRemove(null);
    } else {
      setConfirmRemove(id);
    }
  };

  return (
    <div className="absolute inset-0 z-50 flex flex-col justify-end">
      <SheetBackdrop colorMode={colorMode} onClose={onClose} />
      <SheetContainer colorMode={colorMode}>
        <SheetHeader colorMode={colorMode} title="Payment methods" onClose={onClose} />
        <div className="px-5 pb-6">
          <div className="space-y-1.5 mb-4">
            {methods.map((pm, i) => (
              <motion.div
                key={pm.id}
                className="flex items-center gap-3 px-4 py-3.5 rounded-xl"
                style={{
                  background: c.surface.subtle,
                  border: pm.isDefault
                    ? `1px solid rgba(29,185,84,${d ? "0.15" : "0.1"})`
                    : "1px solid transparent",
                }}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * MOTION.stagger }}
              >
                <pm.icon
                  className="w-4 h-4 shrink-0"
                  style={{ color: c.icon.tertiary }}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span
                      style={{ ...GLASS_TYPE.bodySmall, color: c.text.primary }}
                    >
                      {pm.label}
                    </span>
                    {pm.isDefault && (
                      <span
                        className="px-1.5 py-0.5 rounded"
                        style={{
                          ...GLASS_TYPE.caption,
                          fontSize: "9px",
                          background: c.green.tint,
                          color: BRAND_COLORS.green,
                        }}
                      >
                        Default
                      </span>
                    )}
                  </div>
                  <div style={{ ...GLASS_TYPE.caption, color: c.text.muted }}>
                    {pm.detail}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 shrink-0">
                  {!pm.isDefault && pm.type === "card" && (
                    <motion.button
                      className="w-7 h-7 rounded-lg flex items-center justify-center"
                      style={{ background: c.surface.raised }}
                      onClick={() => onSetDefault(pm.id)}
                      whileTap={{ scale: 0.9 }}
                      title="Set as default"
                    >
                      <Star className="w-3 h-3" style={{ color: c.icon.muted }} />
                    </motion.button>
                  )}
                  {pm.type === "card" && (
                    <motion.button
                      className="w-7 h-7 rounded-lg flex items-center justify-center"
                      style={{
                        background:
                          confirmRemove === pm.id
                            ? "rgba(239,68,68,0.12)"
                            : c.surface.raised,
                      }}
                      onClick={() => handleRemove(pm.id)}
                      whileTap={{ scale: 0.9 }}
                      title={
                        confirmRemove === pm.id
                          ? "Tap again to confirm"
                          : "Remove"
                      }
                    >
                      <Trash2
                        className="w-3 h-3"
                        style={{
                          color:
                            confirmRemove === pm.id
                              ? "#EF4444"
                              : c.icon.muted,
                        }}
                      />
                    </motion.button>
                  )}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Add card */}
          <motion.button
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl"
            style={{
              background: "transparent",
              border: `1px dashed ${c.surface.hover}`,
            }}
            onClick={onAddCard}
            whileTap={{ scale: 0.98 }}
          >
            <Plus className="w-3.5 h-3.5" style={{ color: c.icon.muted }} />
            <span style={{ ...GLASS_TYPE.bodySmall, color: c.text.muted }}>
              Add new card
            </span>
          </motion.button>
        </div>
      </SheetContainer>
    </div>
  );
}
