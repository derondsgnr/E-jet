 /**
 * Notifications Settings — toggle preferences with immediate feedback.
 *
 * Categories: Ride updates, Promotions, Safety alerts, Weekly summary.
 * Each toggle gives haptic-style visual feedback via spring animation.
 * C spine: glass surface, green-as-scalpel for active toggles.
 */

import { useState } from "react";
import { motion } from "motion/react";
import { ArrowLeft, Bell, Tag, Shield, BarChart3 } from "lucide-react";
import { GLASS_COLORS, GLASS_TYPE, MOTION, type GlassColorMode } from "../../config/project";
import { BRAND_COLORS } from "../../config/brand";
import { RIDER_TYPE as RT } from "../../config/rider-type";
import type { ToastConfig } from "./jet-toast";

interface NotifPref {
  id: string;
  icon: typeof Bell;
  label: string;
  description: string;
  defaultOn: boolean;
}

const PREFS: NotifPref[] = [
  { id: "ride", icon: Bell, label: "Ride updates", description: "Driver assigned, arrival, trip completed", defaultOn: true },
  { id: "promos", icon: Tag, label: "Promotions & offers", description: "Discounts, referral rewards, flash deals", defaultOn: true },
  { id: "safety", icon: Shield, label: "Safety alerts", description: "SOS confirmations, trip sharing updates", defaultOn: true },
  { id: "summary", icon: BarChart3, label: "Weekly summary", description: "Spend breakdown, carbon savings, stats", defaultOn: false },
];

interface Props {
  colorMode: GlassColorMode;
  onBack: () => void;
  showToast: (config: ToastConfig) => void;
}

export function NotificationsSettings({ colorMode, onBack, showToast }: Props) {
  const c = GLASS_COLORS[colorMode];
  const d = colorMode === "dark";
  const [toggles, setToggles] = useState<Record<string, boolean>>(
    Object.fromEntries(PREFS.map((p) => [p.id, p.defaultOn]))
  );

  const handleToggle = (id: string) => {
    const next = !toggles[id];
    setToggles((prev) => ({ ...prev, [id]: next }));
    const pref = PREFS.find((p) => p.id === id)!;
    showToast({
      message: `${pref.label} ${next ? "enabled" : "disabled"}`,
      variant: next ? "success" : "info",
      duration: 1800,
    });
  };

  return (
    <div className="h-full flex flex-col" style={{ background: c.bg }}>
      {/* Header */}
      <div className="flex items-center gap-3 px-5 pt-14 pb-3">
        <motion.button
          className="w-9 h-9 rounded-xl flex items-center justify-center"
          style={{ background: c.surface.subtle }}
          onClick={onBack}
          whileTap={{ scale: 0.9 }}
        >
          <ArrowLeft className="w-4 h-4" style={{ color: c.icon.secondary }} />
        </motion.button>
        <span style={{ ...RT.body, fontWeight: 600, color: c.text.primary }}>
          Notifications
        </span>
      </div>

      <div className="flex-1 overflow-y-auto px-5 pb-24 scrollbar-hide">
        {/* Section label */}
        <span
          className="block mt-4 mb-3"
          style={{ ...RT.label, color: c.text.faint }}
        >
          Preferences
        </span>

        <div
          className="rounded-2xl overflow-hidden"
          style={{ background: c.surface.subtle }}
        >
          {PREFS.map((pref, i) => (
            <motion.div
              key={pref.id}
              className="flex items-center gap-3 px-4 py-4"
              style={{
                borderBottom: i < PREFS.length - 1
                  ? `1px solid ${c.surface.hover}`
                  : "none",
              }}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * MOTION.stagger }}
            >
              <pref.icon
                className="w-[18px] h-[18px] shrink-0"
                style={{ color: toggles[pref.id] ? BRAND_COLORS.green : c.icon.muted }}
              />
              <div className="flex-1 min-w-0">
                <span style={{ ...RT.bodySmall, color: c.text.primary }}>
                  {pref.label}
                </span>
                <div style={{ ...RT.meta, color: c.text.muted, marginTop: "1px" }}>
                  {pref.description}
                </div>
              </div>
              {/* Toggle */}
              <motion.button
                className="relative shrink-0"
                style={{
                  width: 44,
                  height: 26,
                  borderRadius: 13,
                  background: toggles[pref.id]
                    ? BRAND_COLORS.green
                    : (d ? "rgba(255,255,255,0.12)" : "rgba(11,11,13,0.1)"),
                  transition: "background 0.2s ease",
                }}
                onClick={() => handleToggle(pref.id)}
                whileTap={{ scale: 0.92 }}
              >
                <motion.div
                  className="absolute top-[3px] rounded-full"
                  style={{
                    width: 20,
                    height: 20,
                    background: "#FFFFFF",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
                  }}
                  animate={{ left: toggles[pref.id] ? 21 : 3 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              </motion.button>
            </motion.div>
          ))}
        </div>

        {/* Quiet note */}
        <p
          className="mt-4 px-1"
          style={{ ...RT.meta, color: c.text.faint, lineHeight: "1.5" }}
        >
          Critical safety notifications are always enabled and cannot be turned off.
          You can manage email preferences in your profile settings.
        </p>
      </div>
    </div>
  );
}