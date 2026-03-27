 /**
 * RiderTrip — Orchestrates the in-ride → complete → rating flow.
 *
 * State machine:  in-ride → complete → rating → (navigate home)
 *
 * Entered from:
 *   - Driver Approach "Start ride" button
 *   - Active trip banner tap (if already in ride)
 *
 * On completion → navigates back to RiderShell (/).
 */

import { useState } from "react";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { Sun, Moon } from "lucide-react";
import { MOTION, GLASS_COLORS, GLASS_TYPE, type GlassColorMode } from "../config/project";
import { InRideScreen } from "../components/rider/in-ride-screen";
import { RideCompleteScreen } from "../components/rider/ride-complete-screen";
import { RideRatingScreen } from "../components/rider/ride-rating-screen";

type TripPhase = "in-ride" | "complete" | "rating";

export function RiderTrip() {
  const [colorMode, setColorMode] = useState<GlassColorMode>("dark");
  const [phase, setPhase] = useState<TripPhase>("in-ride");
  const navigate = useNavigate();
  const c = GLASS_COLORS[colorMode];

  const goHome = () => navigate("/rider");

  return (
    <div className="relative h-screen w-full overflow-hidden">
      <AnimatePresence mode="wait">
        {phase === "in-ride" && (
          <motion.div
            key="in-ride"
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, x: -30 }}
            transition={MOTION.emphasis}
          >
            <InRideScreen
              colorMode={colorMode}
              onTripComplete={() => setPhase("complete")}
              onCancel={goHome}
            />
          </motion.div>
        )}

        {phase === "complete" && (
          <motion.div
            key="complete"
            className="absolute inset-0"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={MOTION.emphasis}
          >
            <RideCompleteScreen
              colorMode={colorMode}
              onContinueToRating={() => setPhase("rating")}
            />
          </motion.div>
        )}

        {phase === "rating" && (
          <motion.div
            key="rating"
            className="absolute inset-0"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0 }}
            transition={MOTION.emphasis}
          >
            <RideRatingScreen
              colorMode={colorMode}
              onSubmit={() => goHome()}
              onSkip={goHome}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Color mode toggle (design review) */}
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