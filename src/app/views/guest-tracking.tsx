/**
 * GUEST TRACKING PAGE — Public, no auth required
 *
 * URL: /track/:token
 *
 * Accessed via SMS link sent to hotel guest. Shows:
 *   - Live trip status progression (including reassignment)
 *   - Driver details (name, vehicle, plate, rating)
 *   - ETA + destination ETA during in_trip
 *   - Start OTP (proximity-gated: visible only when driver is near pickup)
 *   - End OTP (proximity-gated: visible only during in_trip phase)
 *   - Call driver + Call hotel buttons
 *   - Route summary
 *   - Link expiry after trip + 30 min
 *   - Trip receipt on completion
 *
 * No registration, no app install — works in any mobile browser.
 * Token: UUID v4, cryptographically random. Expires post-trip.
 *
 * NOW items addressed:
 *   ✓ OTP proximity reveal (not always visible)
 *   ✓ Tracking link expiry + crypto-random tokens
 *   ✓ Auto-reassignment when driver cancels
 *   ✓ Call hotel button on tracking page
 *   ✓ GPS geofence as signal not trigger (documented in otp-config.ts)
 *
 * Data sources:
 *   - Trip data: trips table via token → trip_id Redis lookup
 *   - Driver data: drivers table (name, vehicle, rating)
 *   - OTP: /config/otp-config.ts (START_OTP, END_OTP)
 *   - Tracking token: /config/otp-config.ts (TRACKING_LINK)
 *   - Hotel phone: hotel_partners.phone
 */

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Star, Phone, MapPin, Shield, Clock, Building2, Check,
  AlertCircle, RefreshCw,
} from "lucide-react";
import { START_OTP, END_OTP, TRACKING_LINK } from "../config/otp-config";

// ── Brand constants (standalone — no admin-theme dependency) ──────────

const GREEN = "#1DB954";
const BLACK = "#0B0B0D";
const AMBER = "#F59E0B";

// ── Typography helpers ────────────────────────────────────────────────

const montserrat = (weight: number, size: string, color: string, extra: React.CSSProperties = {}): React.CSSProperties => ({
  fontFamily: "'Montserrat', sans-serif", fontWeight: weight,
  fontSize: size, letterSpacing: "-0.03em", color, lineHeight: "1.2", ...extra,
});

const manrope = (weight: number, size: string, color: string, extra: React.CSSProperties = {}): React.CSSProperties => ({
  fontFamily: "'Manrope', sans-serif", fontWeight: weight,
  fontSize: size, letterSpacing: "-0.02em", color, lineHeight: "1.4", ...extra,
});

// ── Mock trip data (matches hotel booking) ────────────────────────────

const TRIP = {
  driver: {
    name: "Emeka Nwosu",
    initials: "EN",
    rating: 4.9,
    totalRides: 2841,
    vehicle: "Toyota Camry 2024",
    plate: "LND-458-KJ",
    phone: "+234 802 345 6789",
  },
  hotel: {
    name: "Eko Hotels & Suites",
    phone: "+234 1 277 6000",
  },
  route: {
    pickup: "Eko Hotels & Suites — Main Lobby",
    destination: "Murtala Muhammed Airport",
  },
  vehicle: "JetComfort",
  fare: "₦16,200",
  startOtp: { code: START_OTP.code, digits: [...START_OTP.digits] },
  endOtp: { code: END_OTP.code, digits: [...END_OTP.digits] },
  token: TRACKING_LINK.mockToken,
};

type TrackingPhase =
  | "en_route"
  | "arrived"
  | "in_trip"
  | "completed"
  | "reassigning"   // Driver cancelled → finding new driver
  | "expired";       // Link expired post-trip

const PHASES: { id: TrackingPhase; label: string; short: string }[] = [
  { id: "en_route", label: "Your driver is on the way", short: "En route" },
  { id: "arrived", label: "Your driver has arrived", short: "Arrived" },
  { id: "in_trip", label: "Trip in progress", short: "In trip" },
  { id: "completed", label: "You've arrived!", short: "Done" },
];

// Map phase to progress step index (reassigning maps to 0)
function phaseToIdx(phase: TrackingPhase): number {
  const map: Record<TrackingPhase, number> = {
    en_route: 0, arrived: 1, in_trip: 2, completed: 3,
    reassigning: 0, expired: 3,
  };
  return map[phase];
}

// ── OTP Card Component ────────────────────────────────────────────────

function OtpCard({ digits, label, sublabel }: {
  digits: readonly number[] | number[];
  label: string;
  sublabel: string;
}) {
  return (
    <div className="p-4 rounded-2xl mb-4" style={{
      background: "rgba(255,255,255,0.03)",
      border: "1px solid rgba(255,255,255,0.06)",
    }}>
      <span className="block mb-3" style={{
        ...montserrat(600, "10px", "#7D7D7D"),
        letterSpacing: "0.04em",
      }}>
        {label}
      </span>

      <div className="flex items-center justify-center gap-2.5 mb-3">
        {digits.map((d, i) => (
          <motion.div
            key={i}
            className="w-14 h-16 rounded-xl flex items-center justify-center"
            style={{
              background: `${GREEN}06`,
              border: `1px solid ${GREEN}18`,
            }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 + i * 0.06 }}
          >
            <span style={montserrat(600, "26px", GREEN, { lineHeight: "1" })}>
              {d}
            </span>
          </motion.div>
        ))}
      </div>

      <p className="text-center" style={manrope(400, "11px", "#7D7D7D", { lineHeight: "1.5" })}>
        {sublabel}
      </p>
    </div>
  );
}

// ── Hidden OTP placeholder ────────────────────────────────────────────

function OtpHidden({ message }: { message: string }) {
  return (
    <div className="p-4 rounded-2xl mb-4" style={{
      background: "rgba(255,255,255,0.02)",
      border: "1px solid rgba(255,255,255,0.04)",
    }}>
      <div className="flex items-center justify-center gap-2 py-4">
        <Shield size={14} style={{ color: "#5D5D5D" }} />
        <span style={manrope(400, "12px", "#7D7D7D", { lineHeight: "1.5" })}>
          {message}
        </span>
      </div>
    </div>
  );
}

// ── Reassigning State ─────────────────────────────────────────────────

function ReassigningCard() {
  return (
    <div className="p-5 rounded-2xl mb-4" style={{
      background: `${AMBER}06`,
      border: `1px solid ${AMBER}15`,
    }}>
      <div className="flex items-start gap-3">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
        >
          <RefreshCw size={18} style={{ color: AMBER }} />
        </motion.div>
        <div>
          <span className="block mb-1" style={montserrat(600, "14px", "#fff")}>
            Finding a new driver
          </span>
          <span style={manrope(400, "12px", "#808080", { lineHeight: "1.5" })}>
            Your previous driver had to cancel. We're matching you with another driver nearby — this usually takes less than 2 minutes.
          </span>
        </div>
      </div>
      <div className="mt-3 ml-8">
        <div className="h-1 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.04)" }}>
          <motion.div
            className="h-full rounded-full"
            style={{ background: AMBER }}
            animate={{ width: ["0%", "70%", "30%", "90%", "50%"] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
      </div>
    </div>
  );
}

// ── Expired State ─────────────────────────────────────────────────────

function ExpiredView() {
  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: BLACK }}>
      <div className="text-center px-6 max-w-sm">
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{
          background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)",
        }}>
          <Clock size={24} style={{ color: "#7D7D7D" }} />
        </div>
        <h1 style={montserrat(600, "18px", "#fff", { marginBottom: "8px" })}>
          This trip has ended
        </h1>
        <p style={manrope(400, "13px", "#7D7D7D", { lineHeight: "1.5" })}>
          This tracking link has expired for your security. If you need help with this trip, please contact the hotel.
        </p>
        <div className="mt-6">
          <a
            href={`tel:${TRIP.hotel.phone}`}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl"
            style={{ background: `${GREEN}08`, border: `1px solid ${GREEN}18` }}
          >
            <Building2 size={14} style={{ color: GREEN }} />
            <span style={manrope(500, "13px", GREEN)}>Contact hotel</span>
          </a>
        </div>
        <span className="block mt-8" style={montserrat(600, "10px", "rgba(255,255,255,0.08)")}>
          Powered by JET
        </span>
      </div>
    </div>
  );
}

// ── Trip Receipt (shown after completion) ─────────────────────────────

function TripReceipt() {
  return (
    <div className="p-4 rounded-2xl mb-4" style={{
      background: "rgba(255,255,255,0.03)",
      border: "1px solid rgba(255,255,255,0.06)",
    }}>
      <div className="flex items-center gap-2 mb-3">
        <Check size={14} style={{ color: GREEN }} />
        <span style={montserrat(600, "10px", "#7D7D7D", { letterSpacing: "0.04em" })}>
          TRIP SUMMARY
        </span>
      </div>

      <div className="space-y-2">
        {[
          { label: "Route", value: `${TRIP.route.pickup.split("—")[0].trim()} → Airport` },
          { label: "Driver", value: TRIP.driver.name },
          { label: "Vehicle", value: `${TRIP.driver.vehicle} · ${TRIP.driver.plate}` },
          { label: "Payment", value: `Charged to ${TRIP.hotel.name}` },
        ].map((row) => (
          <div key={row.label} className="flex items-center justify-between py-1.5">
            <span style={manrope(400, "11px", "rgba(255,255,255,0.35)")}>
              {row.label}
            </span>
            <span style={manrope(500, "11px", "rgba(255,255,255,0.7)")}>
              {row.value}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-3 pt-3" style={{
        borderTop: "1px solid rgba(255,255,255,0.04)",
      }}>
        <p className="text-center" style={manrope(400, "10px", "rgba(255,255,255,0.25)", { lineHeight: "1.5" })}>
          Thank you for riding with JET. Have a safe journey.
        </p>
      </div>
    </div>
  );
}


// ═══════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

export function GuestTracking() {
  const [phase, setPhase] = useState<TrackingPhase>("en_route");

  // Simulated driver proximity (for OTP reveal demo)
  // In production: real-time GPS distance from server
  const [driverNearPickup, setDriverNearPickup] = useState(false);

  const phaseIdx = phaseToIdx(phase);
  const isLive = phase !== "completed" && phase !== "expired" && phase !== "reassigning";

  // Demo: auto-advance through phases including reassignment
  useEffect(() => {
    const timers = [
      // Driver approaches → near pickup (OTP reveal trigger)
      setTimeout(() => setDriverNearPickup(true), 4000),
      setTimeout(() => setPhase("arrived"), 6000),
      // Simulate driver cancel → reassignment at 9s
      setTimeout(() => {
        setPhase("reassigning");
        setDriverNearPickup(false);
      }, 9000),
      // New driver found → back to en_route at 12s
      setTimeout(() => setPhase("en_route"), 12000),
      // New driver arrives
      setTimeout(() => setDriverNearPickup(true), 14000),
      setTimeout(() => setPhase("arrived"), 15000),
      setTimeout(() => setPhase("in_trip"), 18000),
      setTimeout(() => setPhase("completed"), 26000),
      // Link expires 8s after completion (demo — real: 30 min)
      setTimeout(() => setPhase("expired"), 34000),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  // Expired view
  if (phase === "expired") return <ExpiredView />;

  const etaText = phase === "en_route" ? "4 min"
    : phase === "arrived" ? "Here"
    : phase === "in_trip" ? "~35 min"
    : phase === "reassigning" ? "..."
    : "Arrived";

  const destinationEta = phase === "in_trip" ? "Arriving at airport in ~35 min" : null;

  // OTP visibility rules:
  // Start OTP: only visible when driver is within 500m of pickup (driverNearPickup) OR phase is arrived
  // End OTP: only visible during in_trip phase
  const showStartOtp = (driverNearPickup || phase === "arrived") && phase !== "in_trip" && phase !== "completed";
  const showEndOtp = phase === "in_trip";

  return (
    <div className="min-h-screen" style={{ background: BLACK }}>
      {/* Ambient glow */}
      <div className="fixed inset-0 pointer-events-none" style={{
        background: "radial-gradient(ellipse 70% 50% at 50% 100%, rgba(29,185,84,0.04) 0%, transparent 70%)",
      }} />

      <div className="relative max-w-md mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: GREEN }}>
              <span style={montserrat(700, "10px", "#fff", { letterSpacing: "-0.02em" })}>J</span>
            </div>
            <span style={montserrat(600, "14px", "#fff")}>JET</span>
          </div>
          <div className="flex items-center gap-1">
            <Shield size={10} style={{ color: "#7D7D7D" }} />
            <span style={manrope(400, "9px", "#7D7D7D")}>
              Secure tracking
            </span>
          </div>
        </div>

        {/* Phase progress */}
        <div className="flex items-center gap-1 mb-2">
          {PHASES.map((p, i) => (
            <div key={p.id} className="flex-1 h-1 rounded-full overflow-hidden" style={{
              background: "rgba(255,255,255,0.04)",
            }}>
              <motion.div
                className="h-full rounded-full"
                style={{ background: phase === "reassigning" ? AMBER : GREEN }}
                animate={{ width: i <= phaseIdx ? "100%" : "0%" }}
                transition={{ duration: 0.4 }}
              />
            </div>
          ))}
        </div>
        <div className="flex items-center justify-between mb-6">
          {PHASES.map((p, i) => (
            <span key={p.id} style={manrope(400, "8px",
              i <= phaseIdx ? (phase === "reassigning" ? AMBER : GREEN) : "#5D5D5D"
            )}>
              {p.short}
            </span>
          ))}
        </div>

        {/* Reassigning state */}
        <AnimatePresence mode="wait">
          {phase === "reassigning" && (
            <motion.div
              key="reassigning"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
            >
              <ReassigningCard />

              {/* Call hotel during reassignment */}
              <a
                href={`tel:${TRIP.hotel.phone}`}
                className="flex items-center justify-center gap-2 py-3 rounded-xl mb-4 w-full"
                style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
              >
                <Building2 size={14} style={{ color: "#808080" }} />
                <span style={manrope(500, "13px", "#808080")}>
                  Call {TRIP.hotel.name}
                </span>
              </a>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main content — hidden during reassignment */}
        {phase !== "reassigning" && (
          <>
            {/* Status headline */}
            <motion.div
              key={phase}
              className="mb-6"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h1 style={montserrat(600, "20px", "#fff")}>
                {PHASES[phaseIdx]?.label ?? "Loading..."}
              </h1>
              {isLive && (
                <div className="flex items-center gap-1.5 mt-2">
                  <motion.div
                    className="w-2 h-2 rounded-full"
                    style={{ background: GREEN }}
                    animate={{ opacity: [1, 0.3, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  />
                  <span style={manrope(400, "12px", "#808080", { lineHeight: "1.5" })}>
                    Live tracking active
                  </span>
                </div>
              )}
              {destinationEta && (
                <div className="flex items-center gap-1.5 mt-1.5">
                  <MapPin size={11} style={{ color: "#7D7D7D" }} />
                  <span style={manrope(400, "11px", "#7D7D7D", { lineHeight: "1.5" })}>
                    {destinationEta}
                  </span>
                </div>
              )}
            </motion.div>

            {/* Driver card */}
            <div className="p-4 rounded-2xl mb-4" style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.06)",
            }}>
              <div className="flex items-start gap-3 mb-3">
                <div className="w-12 h-12 rounded-full flex items-center justify-center shrink-0" style={{
                  background: `${GREEN}10`, border: `2px solid ${GREEN}`,
                }}>
                  <span style={montserrat(600, "14px", GREEN, { letterSpacing: "-0.02em" })}>
                    {TRIP.driver.initials}
                  </span>
                </div>
                <div className="flex-1">
                  <span className="block" style={manrope(500, "15px", "#fff")}>
                    {TRIP.driver.name}
                  </span>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <Star size={11} style={{ color: GREEN, fill: GREEN }} />
                    <span style={manrope(400, "11px", "#808080", { lineHeight: "1.5" })}>
                      {TRIP.driver.rating} · {TRIP.driver.totalRides.toLocaleString()} rides
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="block" style={montserrat(600, "20px", GREEN)}>
                    {etaText}
                  </span>
                  <span style={manrope(400, "10px", "#7D7D7D", { lineHeight: "1.5" })}>
                    {phase === "arrived" ? "Waiting" : phase === "in_trip" ? "To destination" : "ETA"}
                  </span>
                </div>
              </div>

              {/* Gradient separator */}
              <div className="mb-3" style={{
                height: 1,
                background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.04) 20%, rgba(255,255,255,0.04) 80%, transparent)",
              }} />

              <div className="flex items-center justify-between mb-3">
                <div>
                  <span className="block" style={manrope(500, "12px", "#fff")}>
                    {TRIP.driver.vehicle}
                  </span>
                  <span style={manrope(400, "11px", "#7D7D7D", { lineHeight: "1.5" })}>
                    {TRIP.driver.plate}
                  </span>
                </div>
                <span style={{
                  ...montserrat(600, "9px", GREEN),
                  letterSpacing: "0.04em",
                  background: `${GREEN}10`,
                  padding: "3px 8px", borderRadius: "6px",
                }}>
                  {TRIP.vehicle}
                </span>
              </div>

              {/* Action buttons: Call driver + Call hotel */}
              <div className="flex gap-2">
                <a
                  href={`tel:${TRIP.driver.phone}`}
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl cursor-pointer"
                  style={{ background: `${GREEN}08`, border: `1px solid ${GREEN}18` }}
                >
                  <Phone size={14} style={{ color: GREEN }} />
                  <span style={manrope(500, "13px", GREEN)}>Call driver</span>
                </a>
                <a
                  href={`tel:${TRIP.hotel.phone}`}
                  className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl cursor-pointer"
                  style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
                >
                  <Building2 size={14} style={{ color: "#808080" }} />
                  <span style={manrope(500, "12px", "#808080")}>Hotel</span>
                </a>
              </div>
            </div>

            {/* OTP Cards — proximity-gated */}
            <AnimatePresence mode="wait">
              {showStartOtp && (
                <motion.div
                  key="start-otp"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                >
                  <OtpCard
                    digits={TRIP.startOtp.digits}
                    label="PICKUP CODE"
                    sublabel="Show this code to your driver at pickup"
                  />
                </motion.div>
              )}
              {!showStartOtp && !showEndOtp && phase !== "completed" && (
                <motion.div
                  key="otp-hidden"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <OtpHidden message="Your code will appear when driver arrives" />
                </motion.div>
              )}
              {showEndOtp && (
                <motion.div
                  key="end-otp"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                >
                  <OtpCard
                    digits={TRIP.endOtp.digits}
                    label="TRIP COMPLETION CODE"
                    sublabel="Show this code to your driver at your destination"
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Trip receipt (completion only) */}
            {phase === "completed" && <TripReceipt />}

            {/* Route card */}
            <div className="p-4 rounded-2xl mb-6" style={{
              background: "rgba(255,255,255,0.02)",
              border: "1px solid rgba(255,255,255,0.04)",
            }}>
              <span className="block mb-3" style={{
                ...montserrat(600, "10px", "#7D7D7D"),
                letterSpacing: "0.04em",
              }}>
                TRIP DETAILS
              </span>

              <div className="flex items-start gap-2.5">
                <div className="flex flex-col items-center gap-0.5 mt-1.5">
                  <div className="w-2 h-2 rounded-full" style={{ background: GREEN }} />
                  <div className="w-px h-5" style={{ background: "rgba(255,255,255,0.06)" }} />
                  <MapPin size={10} style={{ color: "#7D7D7D" }} />
                </div>
                <div className="space-y-3">
                  <div>
                    <span className="block" style={manrope(500, "12px", "#fff")}>
                      {TRIP.route.pickup}
                    </span>
                    <span style={manrope(400, "10px", "#7D7D7D", { lineHeight: "1.5" })}>
                      Pickup
                    </span>
                  </div>
                  <div>
                    <span className="block" style={manrope(500, "12px", "#fff")}>
                      {TRIP.route.destination}
                    </span>
                    <span style={manrope(400, "10px", "#7D7D7D", { lineHeight: "1.5" })}>
                      Destination
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="text-center">
              <div className="flex items-center justify-center gap-1.5 mb-1">
                <Shield size={10} style={{ color: "#5D5D5D" }} />
                <span style={manrope(400, "10px", "#5D5D5D")}>
                  This tracking link expires {TRACKING_LINK.expiryMinutesPostTrip} min after your trip
                </span>
              </div>
              <span style={montserrat(600, "10px", "#5D5D5D")}>
                Powered by JET
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
