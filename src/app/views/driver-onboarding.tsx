 /**
 * Driver Onboarding — C spine "Veil" variant.
 *
 * Flow: cinematic splash → phone auth → OTP → vehicle info → done → driver shell.
 */

import { useState } from "react";
import { useNavigate } from "react-router";
import { Sun, Moon } from "lucide-react";
import { motion } from "motion/react";
import { MOTION, GLASS_COLORS, GLASS_TYPE, type GlassColorMode } from "../config/project";
import { DriverOnboardingC } from "../components/driver/driver-onboarding";

export function DriverOnboarding() {
  const [colorMode, setColorMode] = useState<GlassColorMode>("dark");
  const navigate = useNavigate();
  const c = GLASS_COLORS[colorMode];

  const handleComplete = () => {
    navigate("/driver/verification");
  };

  return (
    <div className="relative h-screen w-full overflow-hidden">
      <DriverOnboardingC colorMode={colorMode} onComplete={handleComplete} />

      {/* Color mode toggle (design review only) */}
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