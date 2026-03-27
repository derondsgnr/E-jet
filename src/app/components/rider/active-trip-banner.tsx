 /**
 * Active Trip Banner — floating card shown on home screen when a ride is in progress.
 * Tapping it navigates back to the live trip view.
 */

import { motion } from "motion/react";
import { Navigation, Car } from "lucide-react";
import {
  GLASS_COLORS,
  GLASS_TYPE,
  type GlassColorMode,
} from "../../config/project";
import { BRAND_COLORS } from "../../config/brand";
import { GlassPanel } from "./glass-panel";

interface ActiveTripBannerProps {
  colorMode: GlassColorMode;
  driverName: string;
  eta: string;
  destination: string;
  onTap: () => void;
}

export function ActiveTripBanner({
  colorMode,
  driverName,
  eta,
  destination,
  onTap,
}: ActiveTripBannerProps) {
  const c = GLASS_COLORS[colorMode];
  const d = colorMode === "dark";

  return (
    <motion.button
      className="w-full text-left"
      onClick={onTap}
      initial={{ y: 20, opacity: 0, scale: 0.96 }}
      animate={{ y: 0, opacity: 1, scale: 1 }}
      exit={{ y: 20, opacity: 0, scale: 0.96 }}
      transition={{ type: "spring", stiffness: 400, damping: 28 }}
      whileTap={{ scale: 0.97 }}
    >
      <GlassPanel
        variant={d ? "dark" : "light"}
        blur={20}
        className="px-4 py-3.5 rounded-2xl"
        style={{
          border: `1px solid ${BRAND_COLORS.green}25`,
        }}
      >
        <div className="flex items-center gap-3">
          {/* Animated pulse dot */}
          <div className="relative w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
            style={{ background: c.green.tint }}
          >
            <Car className="w-[18px] h-[18px]" style={{ color: BRAND_COLORS.green }} />
            <motion.div
              className="absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full"
              style={{ background: BRAND_COLORS.green }}
              animate={{ scale: [1, 1.3, 1], opacity: [1, 0.6, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>

          {/* Trip info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <span style={{ ...GLASS_TYPE.bodySmall, color: c.text.primary }}>
                Trip in progress
              </span>
            </div>
            <div className="flex items-center gap-1 mt-0.5">
              <Navigation className="w-3 h-3" style={{ color: BRAND_COLORS.green }} />
              <span
                className="truncate"
                style={{ ...GLASS_TYPE.caption, color: c.text.muted }}
              >
                {destination} · {eta}
              </span>
            </div>
          </div>

          {/* ETA badge */}
          <div
            className="px-3 py-1.5 rounded-lg shrink-0"
            style={{ background: c.green.tint }}
          >
            <span style={{ ...GLASS_TYPE.bodySmall, color: BRAND_COLORS.green }}>
              {eta}
            </span>
          </div>
        </div>

        {/* Progress bar */}
        <div
          className="mt-3 h-1 rounded-full overflow-hidden"
          style={{ background: c.surface.subtle }}
        >
          <motion.div
            className="h-full rounded-full"
            style={{ background: BRAND_COLORS.green }}
            animate={{ width: ["35%", "65%", "35%"] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
      </GlassPanel>
    </motion.button>
  );
}
