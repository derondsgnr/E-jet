 /**
 * Driver Shell — root layout for the mobile driver experience.
 *
 * Orchestrates: bottom nav, tab screens, trip request overlay, design lab.
 * Design Lab: simulation controls (color mode, trip requests, new user toggle).
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
 *   - "Simulate Request" in Design Lab triggers incoming ride overlay
 *   - Accept → ActiveTrip (nav → pickup OTP → in-trip → trip-end OTP → complete)
 *   - Decline / Timeout → toast + dismiss
 */

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sun, Moon, Beaker, User, Radio } from "lucide-react";
import {
  MOTION,
  GLASS_COLORS,
  GLASS_TYPE,
  type GlassColorMode,
} from "../config/project";
import { BRAND_COLORS } from "../config/brand";
import { DriverBottomNav, type DriverTab } from "../components/driver/driver-bottom-nav";
import { EarningsHomeC } from "../components/driver/earnings-home-c";
import { TripRequestOverlay } from "../components/driver/trip-request";
import { GlassPanel } from "../components/rider/glass-panel";
import { useJetToast } from "../components/rider/jet-toast";
import {
  MOCK_TRIP_REQUESTS,
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
  const [colorMode, setColorMode] = useState<GlassColorMode>("dark");
  const [tab, setTab] = useState<DriverTab>("home");
  const [showLab, setShowLab] = useState(false);
  const [isNewUser, setIsNewUser] = useState(false);
  const [activeRequest, setActiveRequest] = useState<TripRequest | null>(null);
  const [activeTrip, setActiveTrip] = useState<TripRequest | null>(null);
  const [requestIndex, setRequestIndex] = useState(0);
  const [tabLoading, setTabLoading] = useState(false);
  const c = GLASS_COLORS[colorMode];
  const d = colorMode === "dark";
  const { showToast, ToastContainer } = useJetToast(colorMode);

  // Auto-trigger removed — trip requests are simulated via Design Lab only.
  // The previous auto-trigger fired 3s after mount, blocking all navigation.

  const handleTabChange = useCallback((newTab: DriverTab) => {
    if (newTab !== tab) {
      setTabLoading(true);
      setTimeout(() => setTabLoading(false), 500);
    }
    setTab(newTab);
    setShowLab(false);
  }, [tab]);

  const toggleColorMode = useCallback(() => {
    setColorMode((prev) => (prev === "dark" ? "light" : "dark"));
  }, []);

  // Trip request handlers
  const simulateRequest = useCallback(() => {
    const req = MOCK_TRIP_REQUESTS[requestIndex % MOCK_TRIP_REQUESTS.length];
    setActiveRequest(req);
    setRequestIndex((i) => i + 1);
    setShowLab(false);
  }, [requestIndex]);

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

  // Preview label for next request
  const nextReq = MOCK_TRIP_REQUESTS[requestIndex % MOCK_TRIP_REQUESTS.length];
  const reqPreviewLabel = nextReq.surgeMultiplier > 1
    ? `${nextReq.surgeMultiplier}x surge`
    : nextReq.vehicleType === "EV"
      ? "EV request"
      : "Normal";

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
                <EarningsHomeC colorMode={colorMode} isNewUser={isNewUser} />
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

      {/* ── Design Lab toggle (floating — root level z-50, above everything) ── */}
      {!activeTrip && (
        <motion.button
          className="absolute left-3 w-10 h-10 rounded-full flex items-center justify-center"
          style={{
            bottom: 72,
            zIndex: 50,
            background: showLab
              ? BRAND_COLORS.green + "20"
              : d
                ? "rgba(11,11,13,0.75)"
                : "rgba(250,250,250,0.85)",
            border: `1px solid ${showLab ? BRAND_COLORS.green + "30" : d ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.08)"}`,
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            boxShadow: d
              ? "0 2px 10px rgba(0,0,0,0.5)"
              : "0 2px 10px rgba(0,0,0,0.12)",
          }}
          onClick={() => setShowLab((p) => !p)}
          whileTap={{ scale: 0.9 }}
        >
          <Beaker
            className="w-4 h-4"
            style={{
              color: showLab ? BRAND_COLORS.green : c.text.secondary,
            }}
          />
        </motion.button>
      )}

      {/* ── Design Lab panel ── */}
      <AnimatePresence>
        {showLab && !activeTrip && (
          <motion.div
            className="absolute left-3 w-56"
            style={{ bottom: 120, zIndex: 50 }}
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={MOTION.standard}
          >
            <GlassPanel
              variant={d ? "dark" : "light"}
              className="rounded-xl overflow-hidden p-3"
              blur={24}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-3">
                <span
                  style={{
                    ...GLASS_TYPE.label,
                    color: c.text.muted,
                    fontSize: "10px",
                  }}
                >
                  Design Lab
                </span>
                <motion.button
                  onClick={toggleColorMode}
                  whileTap={{ scale: 0.9 }}
                  className="w-6 h-6 rounded-md flex items-center justify-center"
                  style={{
                    background: d ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)",
                  }}
                >
                  {d ? (
                    <Sun className="w-3.5 h-3.5" style={{ color: c.text.muted }} />
                  ) : (
                    <Moon className="w-3.5 h-3.5" style={{ color: c.text.muted }} />
                  )}
                </motion.button>
              </div>

              {/* Simulate trip request */}
              <motion.button
                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg mb-1.5"
                style={{
                  background: activeRequest
                    ? "rgba(245,158,11,0.12)"
                    : "transparent",
                  border: `1px solid ${activeRequest ? "rgba(245,158,11,0.2)" : "transparent"}`,
                  opacity: activeRequest ? 0.6 : 1,
                }}
                onClick={simulateRequest}
                whileTap={{ scale: 0.97 }}
                disabled={!!activeRequest}
              >
                <Radio
                  className="w-3.5 h-3.5"
                  style={{ color: activeRequest ? "#F59E0B" : BRAND_COLORS.green }}
                />
                <div className="flex-1 text-left">
                  <span
                    style={{
                      ...GLASS_TYPE.bodySmall,
                      fontWeight: 600,
                      color: activeRequest ? "#F59E0B" : BRAND_COLORS.green,
                      display: "block",
                    }}
                  >
                    {activeRequest ? "Request active…" : "Simulate Request"}
                  </span>
                  <span
                    style={{
                      ...GLASS_TYPE.caption,
                      fontSize: "9px",
                      color: c.text.muted,
                      display: "block",
                    }}
                  >
                    {activeRequest ? "Wait for response" : `Next: ${reqPreviewLabel}`}
                  </span>
                </div>
              </motion.button>

              {/* New user toggle */}
              <motion.button
                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg"
                style={{
                  background: isNewUser
                    ? BRAND_COLORS.green + "15"
                    : "transparent",
                  border: `1px solid ${isNewUser ? BRAND_COLORS.green + "25" : "transparent"}`,
                }}
                onClick={() => setIsNewUser((p) => !p)}
                whileTap={{ scale: 0.97 }}
              >
                <User
                  className="w-3.5 h-3.5"
                  style={{ color: isNewUser ? BRAND_COLORS.green : c.text.muted }}
                />
                <span
                  style={{
                    ...GLASS_TYPE.bodySmall,
                    fontWeight: 600,
                    color: isNewUser ? BRAND_COLORS.green : c.text.secondary,
                  }}
                >
                  {isNewUser ? "New User ON" : "New User"}
                </span>
              </motion.button>
            </GlassPanel>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toast container (shell-level for trip request toasts) */}
      <ToastContainer />
    </div>
  );
}