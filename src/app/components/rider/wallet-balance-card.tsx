 /**
 * WalletBalanceCard — Single locked layout.
 *
 * No glass, center-aligned, JET Wallet status badge,
 * bold hero balance, spend context, text-link actions (Linear style)
 * with inline "Cards" action.
 *
 * Chart stripped — every element earns its place.
 */

import { motion } from "motion/react";
import {
  Plus,
  ArrowUpRight,
  CreditCard,
  TrendingDown,
} from "lucide-react";
import {
  GLASS_COLORS,
  GLASS_TYPE,
  type GlassColorMode,
} from "../../config/project";
import { BRAND_COLORS } from "../../config/brand";

export type WalletVariant = "A" | "B" | "C";

interface WalletBalanceCardProps {
  colorMode: GlassColorMode;
  variant?: WalletVariant;
  balance: string;
  spentThisMonth: string;
  onTopUp: () => void;
  onSend?: () => void;
  onCards?: () => void;
}

export function WalletBalanceCard({
  colorMode,
  balance,
  spentThisMonth,
  onTopUp,
  onSend,
  onCards,
}: WalletBalanceCardProps) {
  const d = colorMode === "dark";
  const c = GLASS_COLORS[colorMode];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 }}
      className="py-2 mb-3"
    >
      {/* Status badge */}
      <div className="flex items-center justify-center gap-1.5 mb-4">
        <div
          className="w-1.5 h-1.5 rounded-full"
          style={{ background: BRAND_COLORS.green }}
        />
        <span style={{ ...GLASS_TYPE.caption, color: c.text.muted }}>
          JET Wallet
        </span>
      </div>

      {/* Hero balance — bold, centered */}
      <div className="text-center mb-2">
        <span
          style={{
            fontFamily: "var(--font-heading)",
            fontSize: "38px",
            fontWeight: 700,
            letterSpacing: "-0.04em",
            lineHeight: "1",
            color: c.text.display,
          }}
        >
          {balance}
        </span>
      </div>

      {/* Spend context */}
      <div className="flex items-center justify-center gap-1.5 mb-5">
        <TrendingDown className="w-3 h-3" style={{ color: c.icon.muted }} />
        <span style={{ ...GLASS_TYPE.caption, color: c.text.muted }}>
          {spentThisMonth} spent this month
        </span>
      </div>

      {/* Actions row */}
      <div
        className="flex items-center justify-center gap-5 pt-3"
        style={{ borderTop: `1px solid ${d ? "rgba(255,255,255,0.04)" : "rgba(11,11,13,0.04)"}` }}
      >
        <motion.button
          className="flex items-center gap-1.5"
          onClick={onTopUp}
          whileTap={{ scale: 0.95 }}
        >
          <Plus className="w-3 h-3" style={{ color: BRAND_COLORS.green }} />
          <span style={{ ...GLASS_TYPE.caption, fontWeight: 600, color: BRAND_COLORS.green }}>
            Top up
          </span>
        </motion.button>
        <motion.button
          className="flex items-center gap-1.5"
          onClick={onSend}
          whileTap={{ scale: 0.95 }}
        >
          <ArrowUpRight className="w-3 h-3" style={{ color: c.icon.muted }} />
          <span style={{ ...GLASS_TYPE.caption, color: c.text.muted }}>
            Send
          </span>
        </motion.button>
        <motion.button
          className="flex items-center gap-1.5"
          onClick={onCards}
          whileTap={{ scale: 0.95 }}
        >
          <CreditCard className="w-3 h-3" style={{ color: c.icon.muted }} />
          <span style={{ ...GLASS_TYPE.caption, color: c.text.muted }}>
            Cards
          </span>
        </motion.button>
      </div>
    </motion.div>
  );
}
