 /**
 * Driver Shell — root layout for the mobile driver experience.
 *
 * Orchestrates: bottom nav, tab screens, trip request overlay.
 * Earnings Home uses the approved C "Atmospheric" variation.
 * (Archived variations A/B moved to /design-archive/driver-earnings/)
 *
 * Navigation structure (4 tabs):
 *   Home    → Earnings + Online/Offline toggle (wallet min-balance enforced)
 *   Trips   → Trip history
 *   Wallet  → Balance, fund, withdraw, min-balance enforcement
 *   Account → Profile, vehicle, documents, settings
 *
 * Trip Request flow:
 *   - Accept → ActiveTrip (nav → pickup OTP → in-trip → trip-end OTP → complete)
 *   - Decline / Timeout → toast + dismiss
 */

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  MOTION,
  GLASS_COLORS,
  type GlassColorMode,
} from "../config/project";
import { DriverBottomNav, type DriverTab } from "../components/driver/driver-bottom-nav";
import { EarningsHome } from "../components/driver/earnings-home";
import { TripRequestOverlay } from "../components/driver/trip-request";
import { useJetToast } from "../components/rider/jet-toast";
import {
  type TripRequest,
  formatNaira,
} from "../components/driver/driver-data";
import { ActiveTrip } from "../components/driver/active-trip";
import { EarningsHistory } from "../components/driver/earnings-history";
import { AccountVehicle } from "../components/driver/account-vehicle";
import { DriverWalletScreen } from "../components/driver/driver-wallet";
import {
  EarningsHomeSkeleton,
  EarningsHistorySkeleton,
} from "../components/rider/jet-skeleton";

export function DriverShell() {
  const [colorMode, setColorMode] = useState<GlassColorMode>("dark"); // TODO: persist via localStorage or system preference
  const [tab, setTab] = useState<DriverTab>("home");
  const [isNewUser] = useState(false); // TODO: derive from driver profile data
  const [activeRequest, setActiveRequest] = useState<TripRequest | null>(null);
  const [activeTrip, setActiveTrip] = useState<TripRequest | null>(null);
  const [tabLoading, setTabLoading] = useState(false);
  const c = GLASS_COLORS[colorMode];
  const { showToast, ToastContainer } = useJetToast(colorMode);

  const handleTabChange = useCallback((newTab: DriverTab) => {
    if (newTab !== tab) {
      setTabLoading(true);
      setTimeout(() => setTabLoading(false), 500);
    }
    setTab(newTab);
  }, [tab]);

  const handleAccept = useCallback(
    (req: TripRequest) => {
      setActiveRequest(null);
      setActiveTrip(req);
      showToast({
        message: req.bookingSource === "hotel"
          ? `Hotel pickup accepted — heading to ${req.hotelName}`
          : `Trip accepted — heading to ${req.rider.name}`,
        variant: "success",
        duration: 3000,
      });
    },
    [showToast],
  );

  const handleDecline = useCallback(
    (req: TripRequest) => {
      setActiveRequest(null);
      showToast({
        message: "Request declined",
        variant: "info",
        duration: 2000,
      });
    },
    [showToast],
  );

  const handleTimeout = useCallback(
    (req: TripRequest) => {
      setActiveRequest(null);
      showToast({
        message: "Request expired — you didn't respond in time",
        variant: "warning",
        duration: 3000,
      });
    },
    [showToast],
  );

  const handleTripComplete = useCallback(
    (req: TripRequest) => {
      setActiveTrip(null);
      showToast({
        message: `Earned ${formatNaira(req.estimate.netEarnings)} — nice trip!`,
        variant: "success",
        duration: 3500,
      });
    },
    [showToast],
  );

  const handleTripCancel = useCallback(
    (req: TripRequest) => {
      setActiveTrip(null);
      showToast({
        message: "Trip cancelled",
        variant: "warning",
        duration: 2500,
      });
    },
    [showToast],
  );

  return (
    <div
      className="relative h-screen w-full overflow-hidden flex flex-col"
      style={{ background: c.bg }}
    >
      {/* ── Active Trip (replaces everything when in trip) ── */}
      <AnimatePresence>
        {activeTrip && (
          <motion.div
            key="active-trip"
            className="absolute inset-0 z-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <ActiveTrip
              request={activeTrip}
              colorMode={colorMode}
              onTripComplete={handleTripComplete}
              onTripCancel={handleTripCancel}
              showToast={showToast}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Main content area ── */}
      <div className="flex-1 relative overflow-hidden">
        <AnimatePresence mode="wait">
          {tab === "home" && (
            <motion.div
              key="home"
              className="absolute inset-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={MOTION.standard}
            >
              {tabLoading ? (
                <div className="h-full" style={{ background: c.bg }}>
                  <EarningsHomeSkeleton colorMode={colorMode} />
                </div>
              ) : (
                <EarningsHome colorMode={colorMode} isNewUser={isNewUser} />
              )}
            </motion.div>
          )}

          {tab === "trips" && (
            <motion.div
              key="trips"
              className="absolute inset-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={MOTION.standard}
            >
              {tabLoading ? (
                <div className="h-full" style={{ background: c.bg }}>
                  <EarningsHistorySkeleton colorMode={colorMode} />
                </div>
              ) : (
              <EarningsHistory colorMode={colorMode} />
              )}
            </motion.div>
          )}

          {tab === "wallet" && (
            <motion.div
              key="wallet"
              className="absolute inset-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={MOTION.standard}
            >
              <DriverWalletScreen colorMode={colorMode} isNewUser={isNewUser} />
            </motion.div>
          )}

          {tab === "account" && (
            <motion.div
              key="account"
              className="absolute inset-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={MOTION.standard}
            >
              <AccountVehicle colorMode={colorMode} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Trip Request Overlay (above everything in content area) ── */}
        <AnimatePresence>
          {activeRequest && (
            <TripRequestOverlay
              key={activeRequest.id}
              request={activeRequest}
              colorMode={colorMode}
              onAccept={handleAccept}
              onDecline={handleDecline}
              onTimeout={handleTimeout}
            />
          )}
        </AnimatePresence>
      </div>

      {/* ── Bottom navigation ── */}
      {!activeTrip && (
        <DriverBottomNav
          active={tab}
          onTabChange={handleTabChange}
          colorMode={colorMode}
        />
      )}

      {/* Toast container (shell-level for trip request toasts) */}
      <ToastContainer />
    </div>
  );
}