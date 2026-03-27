 /**
 * Rider Wallet Screen — complete e2e wallet experience.
 *
 * Orchestrates: balance card, payment methods, recent transactions,
 * and all sheet overlays (top-up, send, tx detail, all transactions,
 * add card, manage methods).
 *
 * Glass hierarchy:
 *   - MapCanvas peek → atmospheric bleed
 *   - Balance card → naked center (no glass)
 *   - Default payment → subtle surface (secondary)
 *   - Transactions → transparent rows (tertiary)
 *
 * Data sourced from wallet-data.ts.
 */

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ArrowDownLeft,
  ArrowUpRight,
  ChevronRight,
  MapPin,
  Send,
  Gift,
  Zap,
  CreditCard,
  Plus,
} from "lucide-react";
import {
  GLASS_COLORS,
  GLASS_TYPE,
  MOTION,
  type GlassColorMode,
} from "../../config/project";
import { BRAND_COLORS } from "../../config/brand";
import { RIDER_TYPE as RT } from "../../config/rider-type";
import { MapCanvas } from "./map-canvas";
import { WalletBalanceCard } from "./wallet-balance-card";
import {
  PAYMENT_METHODS,
  RECENT_TRANSACTIONS,
  WALLET_BALANCE,
  type Transaction,
  type PaymentMethod,
} from "./wallet-data";
import {
  TopUpSheet,
  SendSheet,
  TxDetailSheet,
  AllTransactionsView,
  AddCardSheet,
  ManageMethodsSheet,
} from "./wallet-sheets";

interface Props {
  colorMode: GlassColorMode;
  isNewUser?: boolean;
}

export function RiderWalletScreen({ colorMode, isNewUser = false }: Props) {
  const c = GLASS_COLORS[colorMode];
  const d = colorMode === "dark";

  /* ── Sheet states ── */
  const [showTopUp, setShowTopUp] = useState(false);
  const [showSend, setShowSend] = useState(false);
  const [showAllTx, setShowAllTx] = useState(false);
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);
  const [showAddCard, setShowAddCard] = useState(false);
  const [showManageMethods, setShowManageMethods] = useState(false);

  /* ── Payment methods state (local mutable for set-default/remove) ── */
  const [methods, setMethods] = useState<PaymentMethod[]>(isNewUser ? [] : PAYMENT_METHODS);
  const defaultMethod = methods.find((m) => m.isDefault) ?? methods[0];

  const displayBalance = isNewUser ? 0 : WALLET_BALANCE;
  const displayTransactions = isNewUser ? [] : RECENT_TRANSACTIONS;

  const handleSetDefault = useCallback((id: string) => {
    setMethods((prev) =>
      prev.map((m) => ({ ...m, isDefault: m.id === id })),
    );
  }, []);

  const handleRemoveMethod = useCallback((id: string) => {
    setMethods((prev) => {
      const next = prev.filter((m) => m.id !== id);
      // If we removed the default, promote first card
      if (next.length > 0 && !next.some((m) => m.isDefault)) {
        next[0] = { ...next[0], isDefault: true };
      }
      return next;
    });
  }, []);

  /* ── Transaction tap → detail sheet ── */
  const handleTxTap = useCallback((tx: Transaction) => {
    setSelectedTx(tx);
  }, []);

  /* ── Tx icon helper ── */
  const TxIcon = ({ tx }: { tx: (typeof RECENT_TRANSACTIONS)[number] }) => {
    if (tx.category === "ride")
      return <MapPin className="w-3.5 h-3.5" />;
    if (tx.category === "topup")
      return <ArrowDownLeft className="w-3.5 h-3.5" />;
    if (tx.category === "send")
      return <Send className="w-3.5 h-3.5" />;
    if (tx.category === "referral")
      return <Gift className="w-3.5 h-3.5" />;
    if (tx.category === "promo")
      return <Zap className="w-3.5 h-3.5" />;
    return tx.type === "credit" ? (
      <ArrowDownLeft className="w-3.5 h-3.5" />
    ) : (
      <ArrowUpRight className="w-3.5 h-3.5" />
    );
  };

  return (
    <div className="h-full flex flex-col" style={{ background: c.bg }}>
      {/* ── Map atmospheric peek ── */}
      <div className="relative shrink-0" style={{ height: "18vh" }}>
        <MapCanvas variant="muted" colorMode={colorMode} />
        <div
          className="absolute inset-0"
          style={{
            background: d
              ? "linear-gradient(to bottom, transparent 10%, #0B0B0D)"
              : "linear-gradient(to bottom, transparent 10%, #FAFAFA)",
          }}
        />
      </div>

      {/* ── Scrollable content ── */}
      <div className="flex-1 overflow-y-auto px-5 pb-6 scrollbar-hide -mt-6">
        {/* ── Balance card ── */}
        <div className="mb-2">
          <WalletBalanceCard
            colorMode={colorMode}
            balance={displayBalance}
            spentThisMonth={isNewUser ? "₦0" : "₦11,800"}
            onTopUp={() => setShowTopUp(true)}
            onSend={() => setShowSend(true)}
            onCards={() => setShowManageMethods(true)}
          />
        </div>

        {/* ── Payment method — collapsed default row ── */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
        >
          <div className="flex items-center justify-between mb-3">
            <span style={{ ...RT.label, color: c.text.faint }}>
              Payment
            </span>
            <motion.button
              onClick={() => setShowManageMethods(true)}
              whileTap={{ scale: 0.95 }}
            >
              <span style={{ ...RT.meta, color: c.text.muted }}>
                Manage
              </span>
            </motion.button>
          </div>

          {defaultMethod ? (
            <motion.button
              className="w-full text-left flex items-center gap-3 px-4 py-3.5 rounded-xl"
              style={{
                background: c.surface.subtle,
                border: `1px solid ${c.surface.hover}`,
              }}
              onClick={() => setShowManageMethods(true)}
              whileTap={{ scale: 0.98 }}
            >
              <defaultMethod.icon
                className="w-4 h-4 shrink-0"
                style={{ color: c.icon.tertiary }}
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span
                    style={{ ...RT.bodySmall, color: c.text.primary }}
                  >
                    {defaultMethod.label}
                  </span>
                  <span
                    className="px-1.5 py-0.5 rounded"
                    style={{
                      ...RT.badge,
                      background: c.green.tint,
                      color: BRAND_COLORS.green,
                    }}
                  >
                    Default
                  </span>
                </div>
              </div>
              <ChevronRight
                className="w-3.5 h-3.5 shrink-0"
                style={{ color: c.icon.muted }}
              />
            </motion.button>
          ) : (
            <motion.button
              className="w-full text-left flex items-center gap-3 px-4 py-3.5 rounded-xl"
              style={{
                background: c.surface.subtle,
                border: `1px dashed ${d ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.08)"}`,
              }}
              onClick={() => setShowAddCard(true)}
              whileTap={{ scale: 0.98 }}
            >
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                style={{ background: c.surface.hover }}
              >
                <Plus className="w-3.5 h-3.5" style={{ color: c.text.ghost }} />
              </div>
              <div className="flex-1 min-w-0">
                <span style={{ ...RT.bodySmall, color: c.text.tertiary }}>
                  Add a payment method
                </span>
                <span
                  className="block mt-0.5"
                  style={{ ...RT.meta, color: c.text.ghost }}
                >
                  Card, bank, or mobile money
                </span>
              </div>
              <ChevronRight
                className="w-3.5 h-3.5 shrink-0"
                style={{ color: c.icon.muted }}
              />
            </motion.button>
          )}
        </motion.div>

        {/* ── Recent transactions ── */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center justify-between mb-3">
            <span style={{ ...RT.label, color: c.text.faint }}>
              Recent
            </span>
            {displayTransactions.length > 0 && (
            <motion.button
              onClick={() => setShowAllTx(true)}
              whileTap={{ scale: 0.95 }}
            >
              <span style={{ ...RT.meta, color: c.text.muted }}>
                See all
              </span>
            </motion.button>
            )}
          </div>

          {displayTransactions.length === 0 ? (
            <div className="text-center py-10">
              <div
                className="w-12 h-12 rounded-xl mx-auto mb-3 flex items-center justify-center"
                style={{ background: c.surface.hover }}
              >
                <CreditCard className="w-5 h-5" style={{ color: c.text.ghost }} />
              </div>
              <span style={{ ...RT.bodySmall, color: c.text.tertiary, display: "block", marginBottom: "4px" }}>
                No transactions yet
              </span>
              <span style={{ ...RT.meta, color: c.text.ghost }}>
                Your payment history will appear here
              </span>
            </div>
          ) : (
          <div className="space-y-0.5">
            {displayTransactions.map((tx, i) => (
              <motion.button
                key={tx.id}
                className="w-full text-left flex items-center gap-3 px-3 py-3.5 rounded-xl"
                style={{ background: "transparent" }}
                onClick={() => handleTxTap(tx)}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 + i * MOTION.stagger }}
              >
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                  style={{
                    background:
                      tx.type === "credit" ? c.green.tint : c.surface.subtle,
                    color:
                      tx.type === "credit"
                        ? BRAND_COLORS.green
                        : c.icon.tertiary,
                  }}
                >
                  <TxIcon tx={tx} />
                </div>
                <div className="flex-1 min-w-0">
                  <div
                    className="truncate"
                    style={{ ...RT.bodySmall, color: c.text.primary }}
                  >
                    {tx.label}
                  </div>
                  <div
                    className="mt-0.5"
                    style={{ ...RT.meta, color: c.text.muted }}
                  >
                    {tx.date}, {tx.time}
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
          )}
        </motion.div>
      </div>

      {/* ═══ Sheet overlays ═══ */}
      <AnimatePresence>
        {showTopUp && (
          <TopUpSheet
            key="topup"
            colorMode={colorMode}
            onClose={() => setShowTopUp(false)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showSend && (
          <SendSheet
            key="send"
            colorMode={colorMode}
            onClose={() => setShowSend(false)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedTx && (
          <TxDetailSheet
            key="tx-detail"
            colorMode={colorMode}
            tx={selectedTx}
            onClose={() => setSelectedTx(null)}
            onContextualAction={() => {
              const cat = selectedTx.category;
              setSelectedTx(null);
              if (cat === "topup") setTimeout(() => setShowTopUp(true), 200);
              else if (cat === "send") setTimeout(() => setShowSend(true), 200);
              // "Book again" for rides — would navigate to booking flow
            }}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showAllTx && (
          <AllTransactionsView
            key="all-tx"
            colorMode={colorMode}
            onClose={() => setShowAllTx(false)}
            onTxTap={(tx) => {
              setShowAllTx(false);
              // Small delay so exit animation completes before detail opens
              setTimeout(() => setSelectedTx(tx), 200);
            }}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showAddCard && (
          <AddCardSheet
            key="add-card"
            colorMode={colorMode}
            onClose={() => setShowAddCard(false)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showManageMethods && (
          <ManageMethodsSheet
            key="manage"
            colorMode={colorMode}
            methods={methods}
            onClose={() => setShowManageMethods(false)}
            onSetDefault={handleSetDefault}
            onRemove={handleRemoveMethod}
            onAddCard={() => {
              setShowManageMethods(false);
              setTimeout(() => setShowAddCard(true), 200);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}