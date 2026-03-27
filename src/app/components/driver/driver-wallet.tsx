 /**
 * Driver Wallet — Balance, funding, minimum balance enforcement.
 *
 * Drivers must maintain a minimum balance (set by admin) to go online.
 * The wallet shows:
 *   - Current balance with min-balance indicator
 *   - Quick fund action
 *   - Withdraw to bank
 *   - Recent transactions (commissions, earnings, top-ups)
 *
 * C spine: MapCanvas, GlassPanel, green-as-scalpel, DRIVER_TYPE.
 */

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Plus,
  ArrowUpRight,
  ArrowDownLeft,
  Wallet,
  AlertTriangle,
  CheckCircle2,
  X,
  CreditCard,
  Building2,
  ChevronRight,
} from "lucide-react";
import {
  GLASS_COLORS,
  MOTION,
  type GlassColorMode,
} from "../../config/project";
import { BRAND_COLORS } from "../../config/brand";
import { DRIVER_TYPE as DT } from "../../config/driver-type";
import { MapCanvas } from "../rider/map-canvas";
import { GlassPanel } from "../rider/glass-panel";
import { useJetToast } from "../rider/jet-toast";
import {
  DRIVER_WALLET,
  type DriverWallet,
  type WalletTransaction,
  formatNaira,
  isLowBalance,
  canGoOnline,
} from "./driver-data";

// ---------------------------------------------------------------------------
// Transaction styling
// ---------------------------------------------------------------------------
const TX_CONFIG: Record<
  WalletTransaction["type"],
  { icon: typeof Plus; color: string; prefix: string }
> = {
  credit: {
    icon: ArrowDownLeft,
    color: BRAND_COLORS.green,
    prefix: "+",
  },
  debit: {
    icon: ArrowUpRight,
    color: BRAND_COLORS.error,
    prefix: "",
  },
  withdrawal: { icon: Building2, color: "#F59E0B", prefix: "" },
  commission: {
    icon: CreditCard,
    color: BRAND_COLORS.error,
    prefix: "",
  },
  bonus: {
    icon: CheckCircle2,
    color: BRAND_COLORS.green,
    prefix: "+",
  },
};

// ---------------------------------------------------------------------------
// Quick fund amounts
// ---------------------------------------------------------------------------
const FUND_AMOUNTS = [1000, 2000, 5000, 10000];

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
interface Props {
  colorMode: GlassColorMode;
  isNewUser?: boolean;
}

export function DriverWalletScreen({
  colorMode,
  isNewUser = false,
}: Props) {
  const c = GLASS_COLORS[colorMode];
  const d = colorMode === "dark";
  const { showToast, ToastContainer } = useJetToast(colorMode);

  const [wallet, setWallet] = useState<DriverWallet>(
    isNewUser
      ? { ...DRIVER_WALLET, balance: 0, transactions: [] }
      : DRIVER_WALLET,
  );
  const [showFund, setShowFund] = useState(false);
  const [showWithdraw, setShowWithdraw] = useState(false);
  const [selectedAmount, setSelectedAmount] = useState<
    number | null
  >(null);
  const [customAmount, setCustomAmount] = useState("");

  const low = isLowBalance(wallet);
  const canDrive = canGoOnline(wallet);

  const handleFund = useCallback(() => {
    const amount =
      selectedAmount || parseInt(customAmount) || 0;
    if (amount <= 0) return;
    setWallet((prev) => ({
      ...prev,
      balance: prev.balance + amount,
      lastFunded: "Just now",
      transactions: [
        {
          id: `w-${Date.now()}`,
          type: "credit",
          label: "Wallet top-up",
          amount,
          timestamp: "Just now",
          reference: `TXN-${Math.floor(Math.random() * 100000)}`,
        },
        ...prev.transactions,
      ],
    }));
    setShowFund(false);
    setSelectedAmount(null);
    setCustomAmount("");
    showToast({
      message: `${formatNaira(amount)} added to wallet`,
      variant: "success",
    });
  }, [selectedAmount, customAmount, showToast]);

  const handleWithdraw = useCallback(() => {
    if (wallet.balance <= wallet.minimumBalance) {
      showToast({
        message: `You must keep at least ${formatNaira(wallet.minimumBalance)} in your wallet`,
        variant: "warning",
      });
      return;
    }
    const withdrawable = wallet.balance - wallet.minimumBalance;
    setWallet((prev) => ({
      ...prev,
      balance: prev.minimumBalance,
      transactions: [
        {
          id: `w-${Date.now()}`,
          type: "withdrawal",
          label: "Withdrawal to GTBank",
          amount: -withdrawable,
          timestamp: "Just now",
          reference: `WTH-${Math.floor(Math.random() * 10000)}`,
        },
        ...prev.transactions,
      ],
    }));
    setShowWithdraw(false);
    showToast({
      message: `${formatNaira(withdrawable)} sent to your bank`,
      variant: "success",
    });
  }, [wallet, showToast]);

  return (
    <div
      className="relative w-full h-full overflow-hidden"
      style={{ background: c.bg }}
    >
      <MapCanvas colorMode={colorMode} variant="dark" />
      {d ? (
        <div className="absolute inset-0 bg-gradient-to-b from-[#0B0B0D]/60 via-[#0B0B0D]/40 to-[#0B0B0D]/80 z-[1]" />
      ) : (
        <div
          className="absolute inset-0 z-[1]"
          style={{
            background:
              "linear-gradient(to bottom, rgba(250,250,250,0.7) 0%, rgba(250,250,250,0.4) 40%, rgba(250,250,250,0.85) 100%)",
          }}
        />
      )}

      <div
        className="absolute inset-0 z-[2] overflow-y-auto scrollbar-hide"
        style={{
          paddingTop:
            "calc(env(safe-area-inset-top, 12px) + 16px)",
        }}
      >
        {/* Header */}
        <div className="px-5 mb-6">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={MOTION.emphasis}
          >
            <span
              style={{
                ...DT.heading,
                fontSize: "24px",
                color: c.text.primary,
              }}
            >
              Wallet
            </span>
          </motion.div>
        </div>

        {/* Balance card */}
        <div className="px-5 mb-5">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...MOTION.emphasis, delay: 0.1 }}
          >
            <GlassPanel
              variant={d ? "dark" : "light"}
              blur={24}
              className="rounded-2xl px-5 py-5"
            >
              <div className="flex items-center justify-between mb-1">
                <span
                  style={{ ...DT.meta, color: c.text.muted }}
                >
                  Available balance
                </span>
                <div
                  className="flex items-center gap-1 px-2 py-0.5 rounded-md"
                  style={{
                    background: canDrive
                      ? `${BRAND_COLORS.green}10`
                      : `${BRAND_COLORS.error}10`,
                  }}
                >
                  {canDrive ? (
                    <CheckCircle2
                      className="w-3 h-3"
                      style={{ color: BRAND_COLORS.green }}
                    />
                  ) : (
                    <AlertTriangle
                      className="w-3 h-3"
                      style={{ color: BRAND_COLORS.error }}
                    />
                  )}
                  <span
                    style={{
                      ...DT.meta,
                      fontSize: "11px",
                      fontWeight: 600,
                      color: canDrive
                        ? BRAND_COLORS.green
                        : BRAND_COLORS.error,
                    }}
                  >
                    {canDrive ? "Can drive" : "Below minimum"}
                  </span>
                </div>
              </div>

              <div
                style={{
                  fontFamily: "var(--font-heading)",
                  fontSize: "36px",
                  fontWeight: 600,
                  letterSpacing: "-0.03em",
                  lineHeight: "1.1",
                  color: c.text.display,
                }}
              >
                {formatNaira(wallet.balance)}
              </div>

              {/* Min balance indicator */}
              <div className="mt-3 mb-4">
                <div className="flex items-center justify-between mb-1.5">
                  <span
                    style={{ ...DT.meta, color: c.text.faint }}
                  >
                    Minimum balance:{" "}
                    {formatNaira(wallet.minimumBalance)}
                  </span>
                  <span
                    style={{
                      ...DT.meta,
                      color: low
                        ? "#F59E0B"
                        : BRAND_COLORS.green,
                      fontWeight: 600,
                    }}
                  >
                    {low ? "Low" : "OK"}
                  </span>
                </div>
                <div
                  className="h-1.5 rounded-full overflow-hidden"
                  style={{ background: c.surface.hover }}
                >
                  <motion.div
                    className="h-full rounded-full"
                    style={{
                      background: !canDrive
                        ? BRAND_COLORS.error
                        : low
                          ? "#F59E0B"
                          : BRAND_COLORS.green,
                    }}
                    initial={{ width: 0 }}
                    animate={{
                      width: `${Math.min(100, (wallet.balance / (wallet.minimumBalance * 2.5)) * 100)}%`,
                    }}
                    transition={{
                      duration: 0.8,
                      ease: "easeOut",
                      delay: 0.2,
                    }}
                  />
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex gap-3">
                <motion.button
                  className="flex-1 py-3 rounded-xl flex items-center justify-center gap-2"
                  style={{
                    background: BRAND_COLORS.green,
                    boxShadow: `0 4px 12px ${BRAND_COLORS.green}25`,
                  }}
                  onClick={() => setShowFund(true)}
                  whileTap={{ scale: 0.97 }}
                >
                  <Plus
                    className="w-4 h-4"
                    style={{ color: "#fff" }}
                  />
                  <span style={{ ...DT.cta, color: "#fff" }}>
                    Fund
                  </span>
                </motion.button>
                <motion.button
                  className="flex-1 py-3 rounded-xl flex items-center justify-center gap-2"
                  style={{
                    background: c.surface.subtle,
                    border: `1px solid ${c.surface.hover}`,
                  }}
                  onClick={() => setShowWithdraw(true)}
                  whileTap={{ scale: 0.97 }}
                >
                  <ArrowUpRight
                    className="w-4 h-4"
                    style={{ color: c.icon.secondary }}
                  />
                  <span
                    style={{
                      ...DT.cta,
                      color: c.text.secondary,
                    }}
                  >
                    Withdraw
                  </span>
                </motion.button>
              </div>
            </GlassPanel>
          </motion.div>
        </div>

        {/* Low balance warning */}
        <AnimatePresence>
          {!canDrive && (
            <motion.div
              className="px-5 mb-5"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={MOTION.standard}
            >
              <div
                className="flex items-start gap-3 px-4 py-3.5 rounded-xl"
                style={{
                  background: d
                    ? "rgba(212,24,61,0.08)"
                    : "rgba(212,24,61,0.05)",
                  border: `1px solid ${BRAND_COLORS.error}20`,
                }}
              >
                <AlertTriangle
                  className="w-4 h-4 mt-0.5 shrink-0"
                  style={{ color: BRAND_COLORS.error }}
                />
                <div>
                  <span
                    style={{
                      ...DT.label,
                      color: BRAND_COLORS.error,
                      display: "block",
                    }}
                  >
                    Cannot accept trips
                  </span>
                  <span
                    style={{
                      ...DT.meta,
                      color: c.text.muted,
                      lineHeight: "1.4",
                    }}
                  >
                    Fund your wallet with at least{" "}
                    {formatNaira(wallet.minimumBalance)} to go
                    online and start accepting rides.
                  </span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Wallet info */}
        <div className="px-5 mb-3">
          <span
            style={{
              ...DT.meta,
              color: c.text.faint,
              letterSpacing: "0.04em",
              textTransform: "uppercase",
            }}
          >
            How it works
          </span>
        </div>
        <div className="px-5 mb-6">
          <GlassPanel
            variant={d ? "dark" : "light"}
            blur={20}
            className="rounded-2xl px-4 py-3.5"
          >
            {[
              {
                label: "Platform fee",
                detail:
                  "Commission is deducted per trip from your wallet",
              },
              {
                label: "Minimum balance",
                detail: `Maintain ${formatNaira(wallet.minimumBalance)} to stay online (set by admin)`,
              },
              {
                label: "Instant withdraw",
                detail:
                  "Transfer to your bank anytime above minimum",
              },
            ].map((item, i) => (
              <div
                key={item.label}
                className="flex items-start gap-3 py-2.5"
                style={{
                  borderBottom:
                    i < 2
                      ? `1px solid ${c.surface.subtle}`
                      : "none",
                }}
              >
                <div
                  className="w-6 h-6 rounded-md flex items-center justify-center shrink-0 mt-0.5"
                  style={{ background: c.surface.subtle }}
                >
                  <span
                    style={{
                      fontFamily: "var(--font-heading)",
                      fontSize: "11px",
                      fontWeight: 600,
                      color: c.text.muted,
                    }}
                  >
                    {i + 1}
                  </span>
                </div>
                <div>
                  <span
                    style={{
                      ...DT.label,
                      color: c.text.primary,
                      display: "block",
                    }}
                  >
                    {item.label}
                  </span>
                  <span
                    style={{
                      ...DT.meta,
                      color: c.text.muted,
                      lineHeight: "1.4",
                    }}
                  >
                    {item.detail}
                  </span>
                </div>
              </div>
            ))}
          </GlassPanel>
        </div>

        {/* Transactions */}
        <div className="px-5 mb-3">
          <div className="flex items-center justify-between">
            <span
              style={{
                ...DT.meta,
                color: c.text.faint,
                letterSpacing: "0.04em",
                textTransform: "uppercase",
              }}
            >
              Recent transactions
            </span>
            <span style={{ ...DT.meta, color: c.text.ghost }}>
              {wallet.transactions.length} total
            </span>
          </div>
        </div>

        <div className="px-5 pb-32">
          {wallet.transactions.length === 0 ? (
            <motion.div
              className="text-center py-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <Wallet
                className="w-10 h-10 mx-auto mb-3"
                style={{ color: c.text.ghost }}
              />
              <span
                style={{
                  ...DT.label,
                  color: c.text.ghost,
                  display: "block",
                  marginBottom: "4px",
                }}
              >
                No transactions yet
              </span>
              <span style={{ ...DT.meta, color: c.text.faint }}>
                Fund your wallet to start accepting trips
              </span>
            </motion.div>
          ) : (
            wallet.transactions.map((tx, i) => {
              const config = TX_CONFIG[tx.type];
              const TxIcon = config.icon;
              const isPositive = tx.amount > 0;

              return (
                <motion.div
                  key={tx.id}
                  className="flex items-center gap-3 py-3"
                  style={{
                    borderBottom:
                      i < wallet.transactions.length - 1
                        ? `1px solid ${c.surface.subtle}`
                        : "none",
                  }}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    ...MOTION.standard,
                    delay: i * 0.03,
                  }}
                >
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                    style={{
                      background: isPositive
                        ? `${BRAND_COLORS.green}10`
                        : `${config.color}10`,
                    }}
                  >
                    <TxIcon
                      className="w-4 h-4"
                      style={{ color: config.color }}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span
                      style={{
                        ...DT.label,
                        color: c.text.primary,
                        display: "block",
                      }}
                    >
                      {tx.label}
                    </span>
                    <span
                      style={{
                        ...DT.meta,
                        color: c.text.faint,
                      }}
                    >
                      {tx.timestamp}
                    </span>
                  </div>
                  <span
                    style={{
                      ...DT.label,
                      color: isPositive
                        ? BRAND_COLORS.green
                        : c.text.primary,
                      fontWeight: 600,
                    }}
                  >
                    {config.prefix}
                    {formatNaira(Math.abs(tx.amount))}
                  </span>
                </motion.div>
              );
            })
          )}
        </div>
      </div>

      {/* ── Fund Sheet ── */}
      <AnimatePresence>
        {showFund && (
          <motion.div
            className="absolute inset-0 z-30 flex flex-col justify-end"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div
              className="absolute inset-0"
              style={{
                background: d
                  ? "rgba(0,0,0,0.6)"
                  : "rgba(0,0,0,0.3)",
              }}
              onClick={() => setShowFund(false)}
            />
            <motion.div
              className="relative z-10"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{
                type: "spring",
                stiffness: 400,
                damping: 32,
                mass: 0.8,
              }}
            >
              <GlassPanel
                variant={d ? "dark" : "light"}
                blur={32}
                className="rounded-t-3xl px-5 pt-5 pb-10"
              >
                <div className="flex items-center justify-between mb-5">
                  <span
                    style={{
                      ...DT.heading,
                      color: c.text.primary,
                    }}
                  >
                    Fund wallet
                  </span>
                  <motion.button
                    className="w-8 h-8 rounded-full flex items-center justify-center"
                    style={{ background: c.surface.subtle }}
                    onClick={() => setShowFund(false)}
                    whileTap={{ scale: 0.9 }}
                  >
                    <X
                      className="w-4 h-4"
                      style={{ color: c.icon.secondary }}
                    />
                  </motion.button>
                </div>

                <span
                  className="block mb-3"
                  style={{ ...DT.meta, color: c.text.muted }}
                >
                  Select amount
                </span>
                <div className="grid grid-cols-4 gap-2 mb-4">
                  {FUND_AMOUNTS.map((amount) => {
                    const isActive = selectedAmount === amount;
                    return (
                      <motion.button
                        key={amount}
                        className="py-3 rounded-xl text-center"
                        style={{
                          background: isActive
                            ? `${BRAND_COLORS.green}15`
                            : c.surface.subtle,
                          border: `1.5px solid ${isActive ? BRAND_COLORS.green : "transparent"}`,
                        }}
                        onClick={() => {
                          setSelectedAmount(amount);
                          setCustomAmount("");
                        }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <span
                          style={{
                            ...DT.label,
                            color: isActive
                              ? BRAND_COLORS.green
                              : c.text.primary,
                          }}
                        >
                          {formatNaira(amount)}
                        </span>
                      </motion.button>
                    );
                  })}
                </div>

                <span
                  className="block mb-2"
                  style={{ ...DT.meta, color: c.text.muted }}
                >
                  Or enter custom amount
                </span>
                <input
                  className="w-full px-4 py-3 rounded-xl outline-none mb-5"
                  placeholder="e.g. 3000"
                  inputMode="numeric"
                  value={customAmount}
                  onChange={(e) => {
                    setCustomAmount(
                      e.target.value.replace(/\D/g, ""),
                    );
                    setSelectedAmount(null);
                  }}
                  style={{
                    ...DT.secondary,
                    color: c.text.primary,
                    background: c.surface.subtle,
                    border: `1px solid ${c.surface.hover}`,
                  }}
                />

                <motion.button
                  className="w-full py-3.5 rounded-xl flex items-center justify-center gap-2"
                  style={{
                    background:
                      selectedAmount || customAmount
                        ? BRAND_COLORS.green
                        : c.surface.hover,
                  }}
                  onClick={handleFund}
                  whileTap={
                    selectedAmount || customAmount
                      ? { scale: 0.97 }
                      : undefined
                  }
                >
                  <span
                    style={{
                      ...DT.cta,
                      color:
                        selectedAmount || customAmount
                          ? "#fff"
                          : c.text.ghost,
                    }}
                  >
                    {selectedAmount || customAmount
                      ? `Add ${formatNaira(selectedAmount || parseInt(customAmount) || 0)}`
                      : "Select an amount"}
                  </span>
                </motion.button>
              </GlassPanel>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Withdraw Sheet ── */}
      <AnimatePresence>
        {showWithdraw && (
          <motion.div
            className="absolute inset-0 z-30 flex flex-col justify-end"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div
              className="absolute inset-0"
              style={{
                background: d
                  ? "rgba(0,0,0,0.6)"
                  : "rgba(0,0,0,0.3)",
              }}
              onClick={() => setShowWithdraw(false)}
            />
            <motion.div
              className="relative z-10"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{
                type: "spring",
                stiffness: 400,
                damping: 32,
                mass: 0.8,
              }}
            >
              <GlassPanel
                variant={d ? "dark" : "light"}
                blur={32}
                className="rounded-t-3xl px-5 pt-5 pb-10"
              >
                <div className="flex items-center justify-between mb-5">
                  <span
                    style={{
                      ...DT.heading,
                      color: c.text.primary,
                    }}
                  >
                    Withdraw
                  </span>
                  <motion.button
                    className="w-8 h-8 rounded-full flex items-center justify-center"
                    style={{ background: c.surface.subtle }}
                    onClick={() => setShowWithdraw(false)}
                    whileTap={{ scale: 0.9 }}
                  >
                    <X
                      className="w-4 h-4"
                      style={{ color: c.icon.secondary }}
                    />
                  </motion.button>
                </div>

                <div className="mb-5">
                  <GlassPanel
                    variant={d ? "dark" : "light"}
                    blur={16}
                    className="rounded-xl px-4 py-3.5"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span
                        style={{
                          ...DT.meta,
                          color: c.text.muted,
                        }}
                      >
                        Withdrawable
                      </span>
                      <span
                        style={{
                          ...DT.label,
                          color: c.text.primary,
                          fontWeight: 600,
                        }}
                      >
                        {formatNaira(
                          Math.max(
                            0,
                            wallet.balance -
                              wallet.minimumBalance,
                          ),
                        )}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span
                        style={{
                          ...DT.meta,
                          color: c.text.faint,
                        }}
                      >
                        Locked (min balance)
                      </span>
                      <span
                        style={{
                          ...DT.meta,
                          color: c.text.faint,
                        }}
                      >
                        {formatNaira(wallet.minimumBalance)}
                      </span>
                    </div>
                  </GlassPanel>
                </div>

                <div
                  className="flex items-center gap-3 px-4 py-3 rounded-xl mb-5"
                  style={{ background: c.surface.subtle }}
                >
                  <Building2
                    className="w-4 h-4 shrink-0"
                    style={{ color: c.icon.muted }}
                  />
                  <div className="flex-1">
                    <span
                      style={{
                        ...DT.label,
                        color: c.text.primary,
                        display: "block",
                      }}
                    >
                      GTBank ****4821
                    </span>
                    <span
                      style={{
                        ...DT.meta,
                        color: c.text.faint,
                      }}
                    >
                      Chidi Eze
                    </span>
                  </div>
                  <ChevronRight
                    className="w-4 h-4"
                    style={{ color: c.icon.muted }}
                  />
                </div>

                <motion.button
                  className="w-full py-3.5 rounded-xl flex items-center justify-center gap-2"
                  style={{
                    background:
                      wallet.balance > wallet.minimumBalance
                        ? BRAND_COLORS.green
                        : c.surface.hover,
                  }}
                  onClick={handleWithdraw}
                  whileTap={
                    wallet.balance > wallet.minimumBalance
                      ? { scale: 0.97 }
                      : undefined
                  }
                >
                  <span
                    style={{
                      ...DT.cta,
                      color:
                        wallet.balance > wallet.minimumBalance
                          ? "#fff"
                          : c.text.ghost,
                    }}
                  >
                    {wallet.balance > wallet.minimumBalance
                      ? `Withdraw ${formatNaira(Math.max(0, wallet.balance - wallet.minimumBalance))}`
                      : "Nothing to withdraw"}
                  </span>
                </motion.button>
              </GlassPanel>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <ToastContainer />
    </div>
  );
}