 /**
 * Rider Bottom Navigation — persistent across rider screens.
 * Uber/Bolt-style: Home, Activity, Wallet, Account.
 * Hides during active booking flow.
 */

import { motion } from "motion/react";
import { Home, Clock, Wallet, User } from "lucide-react";
import {
  GLASS_COLORS,
  GLASS_TYPE,
  type GlassColorMode,
} from "../../config/project";
import { BRAND_COLORS } from "../../config/brand";

export type RiderTab = "home" | "activity" | "wallet" | "account";

const TABS: { id: RiderTab; label: string; icon: typeof Home }[] = [
  { id: "home", label: "Home", icon: Home },
  { id: "activity", label: "Activity", icon: Clock },
  { id: "wallet", label: "Wallet", icon: Wallet },
  { id: "account", label: "Account", icon: User },
];

interface BottomNavProps {
  active: RiderTab;
  onTabChange: (tab: RiderTab) => void;
  colorMode: GlassColorMode;
}

export function BottomNav({ active, onTabChange, colorMode }: BottomNavProps) {
  const c = GLASS_COLORS[colorMode];
  const d = colorMode === "dark";

  return (
    <div
      className="flex items-end justify-around px-2"
      style={{
        paddingBottom: "max(env(safe-area-inset-bottom, 8px), 8px)",
        paddingTop: "8px",
        background: d
          ? "rgba(11,11,13,0.85)"
          : "rgba(250,250,250,0.9)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderTop: `1px solid ${d ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}`,
      }}
    >
      {TABS.map((tab) => {
        const isActive = active === tab.id;
        const Icon = tab.icon;

        return (
          <motion.button
            key={tab.id}
            className="flex flex-col items-center gap-0.5 py-1 px-4 min-w-[64px]"
            onClick={() => onTabChange(tab.id)}
            whileTap={{ scale: 0.9 }}
          >
            <Icon
              className="w-[22px] h-[22px]"
              style={{
                color: isActive ? BRAND_COLORS.green : c.icon.muted,
                strokeWidth: isActive ? 2.2 : 1.8,
              }}
            />
            <span
              style={{
                ...GLASS_TYPE.caption,
                fontSize: "10px",
                color: isActive ? BRAND_COLORS.green : c.text.muted,
                fontWeight: isActive ? 600 : 500,
              }}
            >
              {tab.label}
            </span>
          </motion.button>
        );
      })}
    </div>
  );
}
