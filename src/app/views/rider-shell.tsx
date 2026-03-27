 /**
 * Rider Shell — root layout for the mobile rider experience.
 *
 * Orchestrates: bottom nav, tab screens, booking flow, active trip state.
 * All callbacks wired — no dead buttons.
 */

import { useState, useCallback } from "react";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { Sun, Moon, User } from "lucide-react";
import { MOTION, GLASS_COLORS, GLASS_TYPE, type GlassColorMode } from "../config/project";
import { BottomNav, type RiderTab } from "../components/rider/bottom-nav";
import { ActiveTripBanner } from "../components/rider/active-trip-banner";
import { RiderHomeC } from "../components/rider/rider-home-c";
import { BookingFlowB } from "../components/rider/booking-flow-b";
import { RiderActivityScreen } from "../components/rider/activity-screen";
import { RiderWalletScreen } from "../components/rider/wallet-screen";
import { RiderAccountScreen } from "../components/rider/account-screen";
import { DestinationSearchC } from "../components/rider/destination-search-c";
import { SavedPlacesScreen } from "../components/rider/saved-places-screen";
import { ScheduledRidesB } from "../components/rider/scheduled-rides-b";
import {
  RiderHomeSkeleton,
  ActivitySkeleton,
  WalletSkeleton,
} from "../components/rider/jet-skeleton";

type RiderFlowState = "tabs" | "destination" | "booking";

export function RiderShell() {
  const [colorMode, setColorMode] = useState<GlassColorMode>("dark");
  const [tab, setTab] = useState<RiderTab>("home");
  const [activeTrip, setActiveTrip] = useState(false);
  const [flowState, setFlowState] = useState<RiderFlowState>("tabs");
  const [showSavedPlaces, setShowSavedPlaces] = useState(false);
  const [showScheduled, setShowScheduled] = useState(false);
  const [isNewUser, setIsNewUser] = useState(false);
  const [tabLoading, setTabLoading] = useState(false);
  const c = GLASS_COLORS[colorMode];
  const navigate = useNavigate();

  /* ── Navigation callbacks (wired to child screens) ── */
  const openDestination = useCallback(() => setFlowState("destination"), []);
  const openBooking = useCallback(() => setFlowState("booking"), []);
  const closeFlow = useCallback(() => setFlowState("tabs"), []);

  const handleDestinationSelect = useCallback(() => {
    // Place selected → advance to vehicle booking
    setFlowState("booking");
  }, []);

  const handleBookingComplete = useCallback(() => {
    setFlowState("tabs");
    setTab("home");
  }, []);

  const handleOpenActiveTrip = useCallback(() => {
    navigate("/rider/approach");
  }, [navigate]);

  const handleQuickDestination = useCallback((_id: string) => {
    // Quick destination tapped — skip search, go straight to booking
    setFlowState("booking");
  }, []);

  const goToActivity = useCallback(() => setTab("activity"), []);
  const goToAccount = useCallback(() => setTab("account"), []);
  const goToScheduled = useCallback(() => setShowScheduled(true), []);
  const goToSavedPlaces = useCallback(() => setShowSavedPlaces(true), []);

  const showBooking = flowState !== "tabs";

  /* ── Tab change also dismisses sub-screens ── */
  const handleTabChange = useCallback((newTab: RiderTab) => {
    setShowSavedPlaces(false);
    setShowScheduled(false);
    if (newTab !== tab) {
      setTabLoading(true);
      setTimeout(() => setTabLoading(false), 500);
    }
    setTab(newTab);
  }, [tab]);

  return (
    <div className="relative h-screen w-full overflow-hidden flex flex-col" style={{ background: c.bg }}>
      {/* ── Main content area ── */}
      <div className="flex-1 relative overflow-hidden">
        <AnimatePresence mode="wait">
          {showSavedPlaces && !showBooking ? (
            <motion.div
              key="saved-places"
              className="absolute inset-0"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={MOTION.emphasis}
            >
              <SavedPlacesScreen
                colorMode={colorMode}
                onBack={() => setShowSavedPlaces(false)}
                onRideToPlace={() => {
                  setShowSavedPlaces(false);
                  setFlowState("booking");
                }}
              />
            </motion.div>
          ) : showScheduled && !showBooking ? (
            <motion.div
              key="scheduled"
              className="absolute inset-0"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={MOTION.emphasis}
            >
              <ScheduledRidesB
                colorMode={colorMode}
                onBack={() => setShowScheduled(false)}
                onTrackRide={() => {
                  setShowScheduled(false);
                  navigate("/rider/approach");
                }}
              />
            </motion.div>
          ) : flowState === "destination" ? (
            <motion.div
              key="destination"
              className="absolute inset-0"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={MOTION.emphasis}
            >
              <DestinationSearchC
                colorMode={colorMode}
                onBack={closeFlow}
                onSelect={() => handleDestinationSelect()}
              />
            </motion.div>
          ) : flowState === "booking" ? (
            <motion.div
              key="booking"
              className="absolute inset-0"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={MOTION.emphasis}
            >
              <BookingFlowB
                colorMode={colorMode}
                onBack={closeFlow}
                onComplete={handleBookingComplete}
                onScheduleForLater={() => {
                  closeFlow();
                  setShowScheduled(true);
                }}
              />
            </motion.div>
          ) : (
            <motion.div
              key={tab}
              className="absolute inset-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              {tabLoading ? (
                <div className="h-full" style={{ background: c.bg }}>
                  {tab === "home" && <RiderHomeSkeleton colorMode={colorMode} />}
                  {tab === "activity" && <ActivitySkeleton colorMode={colorMode} />}
                  {tab === "wallet" && <WalletSkeleton colorMode={colorMode} />}
                  {tab === "account" && <RiderHomeSkeleton colorMode={colorMode} />}
                </div>
              ) : (
                <>
              {tab === "home" && (
                <RiderHomeC
                  colorMode={colorMode}
                  isNewUser={isNewUser}
                  onSearchTap={openDestination}
                  onAvatarTap={goToAccount}
                  onSeeAllTap={goToActivity}
                  onQuickDestination={handleQuickDestination}
                  onScheduledTap={goToScheduled}
                  onSavedPlacesTap={goToSavedPlaces}
                />
              )}
              {tab === "activity" && (
                <RiderActivityScreen
                  colorMode={colorMode}
                  isNewUser={isNewUser}
                  onBookAgain={openBooking}
                />
              )}
              {tab === "wallet" && <RiderWalletScreen colorMode={colorMode} isNewUser={isNewUser} />}
              {tab === "account" && (
                <RiderAccountScreen
                  colorMode={colorMode}
                  onSavedPlacesTap={goToSavedPlaces}
                  onThemeChange={setColorMode}
                />
              )}
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Active trip banner (above nav, below content) ── */}
      <AnimatePresence>
        {!showBooking && activeTrip && (
          <motion.div
            className="px-4 pb-2"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 350, damping: 28 }}
          >
            <ActiveTripBanner
              colorMode={colorMode}
              driverName="Adebayo K."
              eta="8 min"
              destination="Lekki Phase 1"
              onTap={handleOpenActiveTrip}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Bottom nav (hidden during booking) ── */}
      <AnimatePresence>
        {!showBooking && (
          <motion.div
            initial={{ y: 80 }}
            animate={{ y: 0 }}
            exit={{ y: 80 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
          >
            <BottomNav active={tab} onTabChange={handleTabChange} colorMode={colorMode} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Color mode toggle (design review only) ── */}
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

      {/* ── Active trip toggle (demo control) ── */}
      {!showBooking && (
        <motion.button
          className="fixed top-0 right-5 z-[55] flex items-center gap-2 px-3 py-2 rounded-full"
          style={{
            marginTop: "calc(env(safe-area-inset-top, 12px) + 12px)",
            background: activeTrip ? "rgba(29,185,84,0.15)" : c.surface.raised,
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
            border: `1px solid ${activeTrip ? "rgba(29,185,84,0.3)" : c.surface.hover}`,
          }}
          onClick={() => setActiveTrip(!activeTrip)}
          initial={{ opacity: 0, x: 12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ ...MOTION.emphasis, delay: 0.6 }}
          whileTap={{ scale: 0.95 }}
        >
          <span style={{
            ...GLASS_TYPE.caption,
            color: activeTrip ? "#1DB954" : c.text.tertiary,
          }}>
            {activeTrip ? "Trip ON" : "Trip OFF"}
          </span>
        </motion.button>
      )}

      {/* ── New user toggle (demo control) ── */}
      {!showBooking && (
        <motion.button
          className="fixed top-0 right-20 z-[55] flex items-center gap-2 px-3 py-2 rounded-full"
          style={{
            marginTop: "calc(env(safe-area-inset-top, 12px) + 12px)",
            background: isNewUser ? "rgba(29,185,84,0.15)" : c.surface.raised,
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
            border: `1px solid ${isNewUser ? "rgba(29,185,84,0.3)" : c.surface.hover}`,
          }}
          onClick={() => setIsNewUser(!isNewUser)}
          initial={{ opacity: 0, x: 12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ ...MOTION.emphasis, delay: 0.6 }}
          whileTap={{ scale: 0.95 }}
        >
          <User className="w-4 h-4" style={{ color: isNewUser ? "#1DB954" : c.text.tertiary }} />
          <span style={{
            ...GLASS_TYPE.caption,
            color: isNewUser ? "#1DB954" : c.text.tertiary,
          }}>
            {isNewUser ? "New User ON" : "New User OFF"}
          </span>
        </motion.button>
      )}
    </div>
  );
}