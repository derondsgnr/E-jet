 /**
 * JetEmpty / JetError / JetNetworkError — C spine empty & error states.
 *
 * Guidelines: "Empty states are designed, not afterthoughts."
 * "Loading states use skeletons, not spinners."
 * "Never dead-ends, always recovery paths."
 *
 * C spine: GlassPanel-aware colors, motion stagger, green-as-scalpel.
 */

import { motion } from "motion/react";
import {
  WifiOff,
  AlertTriangle,
  RefreshCw,
  type LucideIcon,
} from "lucide-react";
import {
  GLASS_COLORS,
  MOTION,
  type GlassColorMode,
} from "../../config/project";
import { BRAND_COLORS } from "../../config/brand";
import { RIDER_TYPE as RT } from "../../config/rider-type";

// ---------------------------------------------------------------------------
// JetEmpty — zero-data / no content state
// ---------------------------------------------------------------------------
export function JetEmpty({
  colorMode,
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
}: {
  colorMode: GlassColorMode;
  icon: LucideIcon;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}) {
  const c = GLASS_COLORS[colorMode];

  return (
    <motion.div
      className="flex flex-col items-center justify-center py-14 px-6 text-center"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={MOTION.standard}
    >
      <motion.div
        className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4"
        style={{ background: c.surface.subtle }}
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ ...MOTION.standard, delay: 0.05 }}
      >
        <Icon className="w-6 h-6" style={{ color: c.text.ghost }} />
      </motion.div>

      <motion.span
        className="block mb-1"
        style={{
          ...RT.body,
          fontWeight: 600,
          color: c.text.secondary,
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ ...MOTION.standard, delay: 0.1 }}
      >
        {title}
      </motion.span>

      {description && (
        <motion.p
          className="max-w-[260px]"
          style={{
            ...RT.meta,
            color: c.text.muted,
            lineHeight: "1.5",
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ ...MOTION.standard, delay: 0.15 }}
        >
          {description}
        </motion.p>
      )}

      {actionLabel && onAction && (
        <motion.button
          className="mt-5 px-5 py-2.5 rounded-xl"
          style={{
            background: BRAND_COLORS.green,
            boxShadow: `0 4px 16px ${BRAND_COLORS.green}20`,
          }}
          onClick={onAction}
          whileTap={{ scale: 0.96 }}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...MOTION.standard, delay: 0.2 }}
        >
          <span style={{ ...RT.meta, fontWeight: 600, color: "#fff" }}>
            {actionLabel}
          </span>
        </motion.button>
      )}
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// JetError — generic error with retry
// ---------------------------------------------------------------------------
export function JetError({
  colorMode,
  title = "Something went wrong",
  description = "We couldn't load this content. Please try again.",
  onRetry,
}: {
  colorMode: GlassColorMode;
  title?: string;
  description?: string;
  onRetry?: () => void;
}) {
  const c = GLASS_COLORS[colorMode];
  const d = colorMode === "dark";

  return (
    <motion.div
      className="flex flex-col items-center justify-center py-14 px-6 text-center"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={MOTION.standard}
    >
      <motion.div
        className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4"
        style={{
          background: d ? "rgba(212,24,61,0.08)" : "rgba(212,24,61,0.06)",
        }}
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ ...MOTION.standard, delay: 0.05 }}
      >
        <AlertTriangle
          className="w-6 h-6"
          style={{ color: BRAND_COLORS.error }}
        />
      </motion.div>

      <motion.span
        className="block mb-1"
        style={{
          ...RT.body,
          fontWeight: 600,
          color: c.text.secondary,
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ ...MOTION.standard, delay: 0.1 }}
      >
        {title}
      </motion.span>

      <motion.p
        className="max-w-[260px]"
        style={{
          ...RT.meta,
          color: c.text.muted,
          lineHeight: "1.5",
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ ...MOTION.standard, delay: 0.15 }}
      >
        {description}
      </motion.p>

      {onRetry && (
        <motion.button
          className="mt-5 flex items-center gap-2 px-5 py-2.5 rounded-xl"
          style={{ background: c.surface.subtle }}
          onClick={onRetry}
          whileTap={{ scale: 0.96 }}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...MOTION.standard, delay: 0.2 }}
        >
          <RefreshCw className="w-3.5 h-3.5" style={{ color: c.icon.secondary }} />
          <span style={{ ...RT.meta, fontWeight: 600, color: c.text.secondary }}>
            Try again
          </span>
        </motion.button>
      )}
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// JetNetworkError — specific offline / network failure state
// ---------------------------------------------------------------------------
export function JetNetworkError({
  colorMode,
  onRetry,
}: {
  colorMode: GlassColorMode;
  onRetry?: () => void;
}) {
  const c = GLASS_COLORS[colorMode];

  return (
    <motion.div
      className="flex flex-col items-center justify-center py-14 px-6 text-center"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={MOTION.standard}
    >
      <motion.div
        className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4"
        style={{ background: c.surface.subtle }}
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ ...MOTION.standard, delay: 0.05 }}
      >
        <WifiOff className="w-6 h-6" style={{ color: c.text.ghost }} />
      </motion.div>

      <motion.span
        className="block mb-1"
        style={{
          ...RT.body,
          fontWeight: 600,
          color: c.text.secondary,
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ ...MOTION.standard, delay: 0.1 }}
      >
        No connection
      </motion.span>

      <motion.p
        className="max-w-[260px]"
        style={{
          ...RT.meta,
          color: c.text.muted,
          lineHeight: "1.5",
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ ...MOTION.standard, delay: 0.15 }}
      >
        Check your internet connection and try again.
      </motion.p>

      {onRetry && (
        <motion.button
          className="mt-5 flex items-center gap-2 px-5 py-2.5 rounded-xl"
          style={{ background: c.surface.subtle }}
          onClick={onRetry}
          whileTap={{ scale: 0.96 }}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...MOTION.standard, delay: 0.2 }}
        >
          <RefreshCw className="w-3.5 h-3.5" style={{ color: c.icon.secondary }} />
          <span style={{ ...RT.meta, fontWeight: 600, color: c.text.secondary }}>
            Try again
          </span>
        </motion.button>
      )}
    </motion.div>
  );
}
