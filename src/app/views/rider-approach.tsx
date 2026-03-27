 /**
 * RiderApproach — Driver Approach screen (LOCKED: Variation A "Tracker").
 * Accessible at /rider/approach
 */

import { useState } from "react";
import { useNavigate } from "react-router";
import { motion } from "motion/react";
import { Sun, Moon } from "lucide-react";
import { MOTION, GLASS_COLORS, GLASS_TYPE, type GlassColorMode } from "../config/project";
import { DriverApproachA } from "../components/rider/driver-approach-a";

export function RiderApproach() {
  const [colorMode, setColorMode] = useState<GlassColorMode>("dark");
  const c = GLASS_COLORS[colorMode];
  const navigate = useNavigate();

  return (
    <div className="relative h-screen w-full overflow-hidden">
      <DriverApproachA
        colorMode={colorMode}
        onCancel={() => navigate("/rider")}
        onRideStart={() => navigate("/rider/trip")}
      />

      {/* Color mode toggle */}
      <motion.button
        className="fixed top-0 left-5 z-[55] flex items-center gap-2 px-3 py-2 rounded-full"
        style={{
          marginTop: "calc(env(safe-area-inset-top, 12px) + 12px)",
          background: c.surface.raised,
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          border: `1px solid ${c.surface.hover}`,
        }}
        onClick={() => setColorMode(colorMode === "dark" ? "light" : "dark")}
        initial={{ opacity: 0, x: -12 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ ...MOTION.emphasis, delay: 0.5 }}
        whileTap={{ scale: 0.95 }}
      >
        {colorMode === "dark" ? (
          <Sun className="w-4 h-4" style={{ color: c.text.tertiary }} />
        ) : (
          <Moon className="w-4 h-4" style={{ color: c.text.tertiary }} />
        )}
        <span style={{ ...GLASS_TYPE.caption, color: c.text.tertiary }}>
          {colorMode === "dark" ? "Light" : "Dark"}
        </span>
      </motion.button>
    </div>
  );
}