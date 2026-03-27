/**
 * HOTEL — BOOK RIDE (Concierge Booking Flow)
 *
 * Multi-stage flow modeled after rider booking-flow-b, adapted for
 * hotel concierge use case.
 *
 * Stages:
 *   1. guest    → Guest name, room, phone, flight number
 *   2. route    → Pickup detail, destination, schedule (now/later)
 *   3. vehicle  → Vehicle options with ETA + fare + payment method
 *   4. confirm  → Full summary review
 *   5. matching → Finding driver (progress bar, ~3s)
 *   6. assigned → Driver card + share with guest + book another
 *
 * Data sources:
 *   - Vehicle options → vehicle_types table (same as rider)
 *   - Fare estimates → fare_engine(origin, destination, vehicle_type)
 *   - Driver assignment → dispatch_engine
 *   - Credit check → hotel_partners.credit_limit - SUM(pending)
 */

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ArrowLeft, ArrowRight, Car, Zap, Users, Crown, Star,
  MapPin, User, Hash, Phone, Plane, Clock, Calendar,
  CreditCard, Wallet, Check, ChevronRight, ChevronDown,
  Share2, X, AlertTriangle, RotateCcw, Navigation,
  MessageSquare, Copy, ExternalLink, Send, Building2,
} from "lucide-react";
import { useAdminTheme, BRAND, TY, STATUS } from "../config/admin-theme";
import { MOCK_HOTEL } from "../config/hotel-mock-data";
import { useHotelContext } from "./hotel-context";
import { Toast } from "../components/shared/toast";
import { FormSkeleton } from "../components/shared/view-skeleton";
import { ErrorState } from "../components/shared/error-state";
import { START_OTP, TRACKING_LINK } from "../config/otp-config";

const data = MOCK_HOTEL;

// ── Types ───────────────────────────────────────────────────────────────

type BookingStage = "guest" | "route" | "vehicle" | "confirm" | "matching" | "assigned";

interface VehicleOption {
  id: string;
  name: string;
  description: string;
  capacity: number;
  eta: string;
  fare: number;
  fareDisplay: string;
  isEV: boolean;
  icon: "car" | "car-ev" | "car-xl" | "car-lux";
}

const VEHICLE_OPTIONS: VehicleOption[] = [
  { id: "jet-go",      name: "JetGo",      description: "Affordable everyday rides",   capacity: 4, eta: "4 min", fare: 12400, fareDisplay: "₦12,400", isEV: false, icon: "car" },
  { id: "jet-ev",      name: "JetEV",      description: "Zero emissions, lower fare",  capacity: 4, eta: "6 min", fare: 10800, fareDisplay: "₦10,800", isEV: true,  icon: "car-ev" },
  { id: "jet-comfort", name: "JetComfort",  description: "Extra legroom, newer cars",   capacity: 4, eta: "5 min", fare: 16200, fareDisplay: "₦16,200", isEV: false, icon: "car" },
  { id: "jet-xl",      name: "JetXL",      description: "6-seater for groups",         capacity: 6, eta: "8 min", fare: 21500, fareDisplay: "₦21,500", isEV: false, icon: "car-xl" },
  { id: "jet-lux",     name: "JetLux",     description: "Premium experience",          capacity: 4, eta: "10 min",fare: 32000, fareDisplay: "₦32,000", isEV: false, icon: "car-lux" },
];

const VEHICLE_ICONS: Record<string, typeof Car> = {
  "car": Car, "car-ev": Zap, "car-xl": Users, "car-lux": Crown,
};

const POPULAR_DESTINATIONS = [
  { name: "Murtala Muhammed Airport", type: "airport" as const },
  { name: "Eko Atlantic City", type: "business" as const },
  { name: "The Palms Shopping Mall", type: "shopping" as const },
  { name: "Lekki Conservation Centre", type: "tourism" as const },
  { name: "National Theatre, Iganmu", type: "tourism" as const },
  { name: "Civic Centre, V.I.", type: "business" as const },
  { name: "Landmark Beach, Oniru", type: "tourism" as const },
];

const RECENT_BOOKINGS = [
  { guestName: "Mr. James Wright", room: "1204", destination: "Murtala Muhammed Airport", vehicle: "JetComfort", fare: "₦18,500" },
  { guestName: "Ms. Sarah Chen", room: "806", destination: "Lekki Conservation Centre", vehicle: "JetEV", fare: "₦12,800" },
];

const PICKUP_SUBLOCATIONS = [
  "Main Lobby", "Porte-cochère", "Convention Centre Entrance",
  "Pool Deck Exit", "Parking Level B1",
];

const MOCK_DRIVER = {
  name: "Emeka Nwosu",
  rating: 4.9,
  totalRides: 2841,
  vehicle: "Toyota Camry 2024",
  plate: "LND-458-KJ",
  photo: "EN",
  eta: "4 min",
};


// ── Helpers ─────────────────────────────────────────────────────────────

function fmt(n: number): string {
  return "₦" + n.toLocaleString();
}


// ── Progress Bar ────────────────────────────────────────────────────────

const STAGES: BookingStage[] = ["guest", "route", "vehicle", "confirm", "matching", "assigned"];

function StageProgress({ stage }: { stage: BookingStage }) {
  const { t, theme } = useAdminTheme();
  const isDark = theme === "dark";
  const idx = STAGES.indexOf(stage);
  const total = 4; // Only show 4 user-facing steps (not matching/assigned)

  if (idx >= 4) return null;

  return (
    <div className="flex items-center gap-1.5 mb-6">
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} className="flex-1 h-1 rounded-full overflow-hidden" style={{
          background: isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)",
        }}>
          <motion.div
            className="h-full rounded-full"
            style={{ background: BRAND.green }}
            animate={{ width: i < idx ? "100%" : i === idx ? "50%" : "0%" }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          />
        </div>
      ))}
    </div>
  );
}


// ── Stage Header ────────────────────────────────────────────────────────

function StageHeader({ title, subtitle, onBack }: { title: string; subtitle: string; onBack?: () => void }) {
  const { t } = useAdminTheme();
  return (
    <div className="flex items-start gap-3 mb-5">
      {onBack && (
        <button onClick={onBack} className="mt-0.5 p-1.5 rounded-lg cursor-pointer" style={{ border: `1px solid ${t.borderSubtle}` }}>
          <ArrowLeft size={14} style={{ color: t.textMuted }} />
        </button>
      )}
      <div>
        <h2 style={{
          fontFamily: "'Montserrat', sans-serif", fontWeight: 600,
          fontSize: "16px", letterSpacing: "-0.03em", color: t.text, lineHeight: "1.2",
        }}>
          {title}
        </h2>
        <p className="mt-0.5" style={{ ...TY.bodyR, fontSize: "11px", color: t.textMuted, lineHeight: "1.5" }}>
          {subtitle}
        </p>
      </div>
    </div>
  );
}


// ── Focus-aware input style helper ──────────────────────────────────────

function useInputStyle(focused: boolean) {
  const { theme } = useAdminTheme();
  const isDark = theme === "dark";
  return {
    background: isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)",
    border: `1px solid ${focused ? BRAND.green + "60" : isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}`,
    boxShadow: focused ? `0 0 0 2px ${BRAND.green}18` : "none",
  } as const;
}


// ── Form Input ──────────────────────────────────────────────────────────

function FormInput({ label, value, onChange, placeholder, icon: Icon, required, type = "text" }: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string;
  icon?: typeof User; required?: boolean; type?: string;
}) {
  const { t, theme } = useAdminTheme();
  const isDark = theme === "dark";
  const [focused, setFocused] = useState(false);
  return (
    <div>
      <label className="flex items-center gap-1.5 mb-1.5">
        {Icon && <Icon size={10} style={{ color: focused ? BRAND.green : t.textFaint }} />}
        <span style={{ ...TY.body, fontSize: "11px", color: focused ? BRAND.green : t.textMuted, lineHeight: "1.4", letterSpacing: "-0.02em", transition: "color 0.15s" }}>
          {label}{required && " *"}
        </span>
      </label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className="w-full px-3 py-2.5 rounded-xl outline-none transition-all duration-150"
        style={{
          ...TY.bodyR, fontSize: "12px", color: t.text, lineHeight: "1.4", minHeight: 44,
          background: isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)",
          border: `1px solid ${focused ? BRAND.green + "60" : isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}`,
          boxShadow: focused ? `0 0 0 2px ${BRAND.green}18` : "none",
        }}
      />
    </div>
  );
}


// ── CTA Button ──────────────────────────────────────────────────────────

function CTAButton({ label, onClick, disabled, icon: Icon }: {
  label: string; onClick: () => void; disabled?: boolean; icon?: typeof ArrowRight;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="w-full py-3 rounded-xl flex items-center justify-center gap-2 cursor-pointer mt-6"
      style={{
        background: disabled ? "transparent" : BRAND.green,
        border: `1px solid ${disabled ? "rgba(128,128,128,0.2)" : BRAND.green}`,
        opacity: disabled ? 0.4 : 1,
        minHeight: 48,
      }}
    >
      <span style={{ ...TY.body, fontSize: "12px", color: disabled ? "#888" : "#fff", letterSpacing: "-0.02em", lineHeight: "1.4" }}>
        {label}
      </span>
      {Icon && <Icon size={14} style={{ color: disabled ? "#888" : "#fff" }} />}
    </button>
  );
}


// ═══════════════════════════════════════════════════════════════════════════
// STAGE 1: GUEST DETAILS
// ═══════════════════════════════════════════════════════════════════════════

function StageGuest({ form, setForm, onNext, onBack }: {
  form: BookingForm; setForm: (f: BookingForm) => void; onNext: () => void; onBack: () => void;
}) {
  const { t, theme } = useAdminTheme();
  const isDark = theme === "dark";
  const canProceed = form.guestName.trim() && form.roomNumber.trim() && form.guestPhone.trim();

  return (
    <div>
      <StageHeader title="Guest details" subtitle="Who is this ride for?" onBack={onBack} />

      {/* Recent bookings — quick rebook */}
      {RECENT_BOOKINGS.length > 0 && (
        <div className="mb-5">
          <span className="block mb-2" style={{
            fontFamily: "'Montserrat', sans-serif", fontWeight: 600,
            fontSize: "9px", letterSpacing: "0.04em", color: t.textFaint, lineHeight: "1.2",
          }}>
            RECENT GUESTS
          </span>
          <div className="space-y-1.5">
            {RECENT_BOOKINGS.map((rb, i) => (
              <motion.button
                key={i}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer text-left"
                style={{
                  background: isDark ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.015)",
                  border: `1px solid ${isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.05)"}`,
                }}
                onClick={() => setForm({ ...form, guestName: rb.guestName, roomNumber: rb.room, destination: rb.destination })}
                whileHover={{ borderColor: `${BRAND.green}20` }}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.04 }}
              >
                <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0" style={{
                  background: isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.03)",
                }}>
                  <RotateCcw size={11} style={{ color: t.textFaint }} />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="block truncate" style={{ ...TY.body, fontSize: "11px", color: t.text, lineHeight: "1.4", letterSpacing: "-0.02em" }}>
                    {rb.guestName} · Room {rb.room}
                  </span>
                  <span style={{ ...TY.bodyR, fontSize: "9px", color: t.textFaint, lineHeight: "1.5" }}>
                    {rb.destination} · {rb.vehicle} · {rb.fare}
                  </span>
                </div>
                <ChevronRight size={11} style={{ color: t.textFaint }} />
              </motion.button>
            ))}
          </div>

          <div className="my-4 h-px" style={{ background: `linear-gradient(90deg, ${t.borderSubtle}, transparent 80%)` }} />
        </div>
      )}

      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormInput label="Guest name" icon={User} required value={form.guestName} onChange={v => setForm({ ...form, guestName: v })} placeholder="e.g. Mr. James Wright" />
          <FormInput label="Room number" icon={Hash} required value={form.roomNumber} onChange={v => setForm({ ...form, roomNumber: v })} placeholder="e.g. 1204" />
        </div>
        <FormInput label="Guest phone" icon={Phone} required type="tel" value={form.guestPhone} onChange={v => setForm({ ...form, guestPhone: v })} placeholder="+234 801 234 5678" />
        <FormInput label="Flight number" icon={Plane} value={form.flightNumber} onChange={v => setForm({ ...form, flightNumber: v })} placeholder="Optional — for airport transfers" />
      </div>

      <CTAButton label="Next — Choose route" onClick={onNext} disabled={!canProceed} icon={ArrowRight} />
    </div>
  );
}


// ═══════════════════════════════════════════════════════════════════════════
// STAGE 2: ROUTE
// ═══════════════════════════════════════════════════════════════════════════

function StageRoute({ form, setForm, onNext, onBack }: {
  form: BookingForm; setForm: (f: BookingForm) => void; onNext: () => void; onBack: () => void;
}) {
  const { t, theme } = useAdminTheme();
  const isDark = theme === "dark";
  const [showDestDropdown, setShowDestDropdown] = useState(false);
  const [showPickupSub, setShowPickupSub] = useState(false);
  const [destFocused, setDestFocused] = useState(false);
  const [dateFocused, setDateFocused] = useState(false);
  const [timeFocused, setTimeFocused] = useState(false);
  const [notesFocused, setNotesFocused] = useState(false);
  const destStyle = useInputStyle(destFocused);
  const dateStyle = useInputStyle(dateFocused);
  const timeStyle = useInputStyle(timeFocused);
  const notesStyle = useInputStyle(notesFocused);
  const canProceed = form.destination.trim().length > 0;

  const isAirportDest = form.destination.toLowerCase().includes("airport");

  return (
    <div>
      <StageHeader title="Route" subtitle={`Booking for ${form.guestName} · Room ${form.roomNumber}`} onBack={onBack} />

      <div className="space-y-4">
        {/* Pickup */}
        <div>
          <label className="flex items-center gap-1.5 mb-1.5">
            <div className="w-2 h-2 rounded-full" style={{ background: BRAND.green }} />
            <span style={{ ...TY.body, fontSize: "11px", color: t.textMuted, lineHeight: "1.4", letterSpacing: "-0.02em" }}>
              Pickup
            </span>
          </label>
          <div className="px-3 py-2.5 rounded-xl" style={{ border: `1px solid ${t.borderSubtle}` }}>
            <span className="block" style={{ ...TY.body, fontSize: "12px", color: t.text, lineHeight: "1.4", letterSpacing: "-0.02em" }}>
              Eko Hotels & Suites
            </span>
            <button
              onClick={() => setShowPickupSub(!showPickupSub)}
              className="flex items-center gap-1 mt-1 cursor-pointer"
            >
              <span style={{ ...TY.bodyR, fontSize: "10px", color: form.pickupDetail ? BRAND.green : t.textFaint, lineHeight: "1.5" }}>
                {form.pickupDetail || "Specify location (lobby, entrance...)"}
              </span>
              <ChevronDown size={10} style={{ color: t.textFaint }} />
            </button>
          </div>

          <AnimatePresence>
            {showPickupSub && (
              <motion.div
                className="mt-1 flex flex-wrap gap-1.5"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
              >
                {PICKUP_SUBLOCATIONS.map(loc => (
                  <button
                    key={loc}
                    onClick={() => { setForm({ ...form, pickupDetail: loc }); setShowPickupSub(false); }}
                    className="px-2.5 py-1.5 rounded-lg cursor-pointer"
                    style={{
                      background: form.pickupDetail === loc ? `${BRAND.green}08` : (isDark ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.015)"),
                      border: `1px solid ${form.pickupDetail === loc ? `${BRAND.green}14` : t.borderSubtle}`,
                    }}
                  >
                    <span style={{ ...TY.bodyR, fontSize: "10px", color: form.pickupDetail === loc ? BRAND.green : t.textMuted, lineHeight: "1.4" }}>
                      {loc}
                    </span>
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Destination */}
        <div className="relative">
          <label className="flex items-center gap-1.5 mb-1.5">
            <MapPin size={10} style={{ color: t.textFaint }} />
            <span style={{ ...TY.body, fontSize: "11px", color: t.textMuted, lineHeight: "1.4", letterSpacing: "-0.02em" }}>
              Destination *
            </span>
          </label>
          <div className="relative">
            <input
              value={form.destination}
              onChange={e => { setForm({ ...form, destination: e.target.value }); setShowDestDropdown(true); }}
              onFocus={() => { setShowDestDropdown(true); setDestFocused(true); }}
              onBlur={() => setDestFocused(false)}
              placeholder="Where is the guest going?"
              className="w-full px-3 py-2.5 rounded-xl outline-none transition-all duration-150"
              style={{ ...TY.bodyR, fontSize: "12px", color: t.text, lineHeight: "1.4", minHeight: 44, ...destStyle }}
            />
          </div>

          <AnimatePresence>
            {showDestDropdown && !form.destination && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowDestDropdown(false)} />
                <motion.div
                  className="absolute top-full left-0 right-0 mt-1 rounded-xl overflow-hidden z-20"
                  style={{
                    background: isDark ? "rgba(18,18,20,0.97)" : "rgba(255,255,255,0.98)",
                    border: `1px solid ${t.borderSubtle}`,
                    boxShadow: isDark ? "0 8px 24px rgba(0,0,0,0.4)" : "0 8px 24px rgba(0,0,0,0.08)",
                    backdropFilter: "blur(16px)",
                  }}
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                >
                  <div className="px-3 py-2" style={{ borderBottom: `1px solid ${t.borderSubtle}` }}>
                    <span style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 600, fontSize: "9px", letterSpacing: "0.04em", color: t.textFaint }}>
                      POPULAR DESTINATIONS
                    </span>
                  </div>
                  {POPULAR_DESTINATIONS.map(d => (
                    <button
                      key={d.name}
                      className="w-full px-3 py-2.5 text-left cursor-pointer flex items-center gap-2"
                      onClick={() => { setForm({ ...form, destination: d.name }); setShowDestDropdown(false); }}
                      style={{ borderBottom: `1px solid ${isDark ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.02)"}` }}
                    >
                      {d.type === "airport" ? <Plane size={10} style={{ color: t.textFaint }} /> : <MapPin size={10} style={{ color: t.textFaint }} />}
                      <span style={{ ...TY.bodyR, fontSize: "11px", color: t.text, lineHeight: "1.4" }}>{d.name}</span>
                    </button>
                  ))}
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>

        {/* Airport transfer notice */}
        {isAirportDest && !form.flightNumber && (
          <motion.div
            className="flex items-center gap-2 px-3 py-2 rounded-xl"
            style={{ background: `${STATUS.info}06`, border: `1px solid ${STATUS.info}10` }}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
          >
            <Plane size={11} style={{ color: STATUS.info }} />
            <span style={{ ...TY.bodyR, fontSize: "10px", color: STATUS.info, lineHeight: "1.5" }}>
              Airport destination detected — consider adding a flight number for timed pickup.
            </span>
          </motion.div>
        )}

        {/* Schedule */}
        <div>
          <label className="flex items-center gap-1.5 mb-2">
            <Clock size={10} style={{ color: t.textFaint }} />
            <span style={{ ...TY.body, fontSize: "11px", color: t.textMuted, lineHeight: "1.4", letterSpacing: "-0.02em" }}>When</span>
          </label>
          <div className="flex gap-2">
            {([
              { id: "now" as const, label: "Now", icon: Navigation },
              { id: "later" as const, label: "Schedule", icon: Calendar },
            ]).map(opt => {
              const active = form.scheduleType === opt.id;
              return (
                <button
                  key={opt.id}
                  onClick={() => setForm({ ...form, scheduleType: opt.id })}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl cursor-pointer"
                  style={{
                    border: `1px solid ${active ? `${BRAND.green}20` : t.borderSubtle}`,
                    background: active ? (isDark ? `${BRAND.green}04` : `${BRAND.green}02`) : "transparent",
                    minHeight: 44,
                  }}
                >
                  <opt.icon size={12} style={{ color: active ? BRAND.green : t.textFaint }} />
                  <span style={{ ...TY.body, fontSize: "11px", color: active ? BRAND.green : t.textSecondary, lineHeight: "1.4", letterSpacing: "-0.02em" }}>
                    {opt.label}
                  </span>
                </button>
              );
            })}
          </div>

          <AnimatePresence>
            {form.scheduleType === "later" && (
              <motion.div
                className="mt-3 grid grid-cols-2 gap-3"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
              >
                <div>
                  <label className="block mb-1">
                    <span style={{ ...TY.bodyR, fontSize: "9px", color: t.textFaint }}>Date</span>
                  </label>
                  <input
                    type="date"
                    value={form.scheduleDate}
                    onChange={e => setForm({ ...form, scheduleDate: e.target.value })}
                    onFocus={() => setDateFocused(true)}
                    onBlur={() => setDateFocused(false)}
                    className="w-full px-3 py-2.5 rounded-xl outline-none transition-all duration-150"
                    style={{ ...TY.bodyR, fontSize: "11px", color: t.text, minHeight: 40, ...dateStyle }}
                  />
                </div>
                <div>
                  <label className="block mb-1">
                    <span style={{ ...TY.bodyR, fontSize: "9px", color: t.textFaint }}>Time</span>
                  </label>
                  <input
                    type="time"
                    value={form.scheduleTime}
                    onChange={e => setForm({ ...form, scheduleTime: e.target.value })}
                    onFocus={() => setTimeFocused(true)}
                    onBlur={() => setTimeFocused(false)}
                    className="w-full px-3 py-2.5 rounded-xl outline-none transition-all duration-150"
                    style={{ ...TY.bodyR, fontSize: "11px", color: t.text, minHeight: 40, ...timeStyle }}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Notes */}
        <div>
          <label className="block mb-1.5">
            <span style={{ ...TY.body, fontSize: "11px", color: t.textMuted, lineHeight: "1.4", letterSpacing: "-0.02em" }}>Notes for driver (optional)</span>
          </label>
          <textarea
            value={form.notes}
            onChange={e => setForm({ ...form, notes: e.target.value })}
            placeholder="e.g. Guest has 2 large suitcases, needs wheelchair-accessible vehicle"
            rows={2}
            onFocus={() => setNotesFocused(true)}
            onBlur={() => setNotesFocused(false)}
            className="w-full px-3 py-2.5 rounded-xl outline-none resize-none transition-all duration-150"
            style={{ ...TY.bodyR, fontSize: "11px", color: t.text, lineHeight: "1.5", ...notesStyle }}
          />
        </div>
      </div>

      <CTAButton label="Next — Choose vehicle" onClick={onNext} disabled={!canProceed} icon={ArrowRight} />
    </div>
  );
}


// ═══════════════════════════════════════════════════════════════════════════
// STAGE 3: VEHICLE SELECT
// ═══════════════════════════════════════════════════════════════════════════

function StageVehicle({ form, setForm, onNext, onBack }: {
  form: BookingForm; setForm: (f: BookingForm) => void; onNext: () => void; onBack: () => void;
}) {
  const { t, theme } = useAdminTheme();
  const isDark = theme === "dark";

  const selected = VEHICLE_OPTIONS.find(v => v.id === form.vehicleId) || VEHICLE_OPTIONS[0];
  const creditRemaining = data.creditLimit - data.creditUsed;
  const overCredit = form.paymentMethod === "hotel_account" && selected.fare > creditRemaining;

  return (
    <div>
      <StageHeader
        title="Vehicle & payment"
        subtitle={`${form.guestName} → ${form.destination}`}
        onBack={onBack}
      />

      {/* Vehicle Options */}
      <div className="space-y-1.5 mb-5">
        {VEHICLE_OPTIONS.map((v, i) => {
          const active = form.vehicleId === v.id;
          const Icon = VEHICLE_ICONS[v.icon] || Car;
          return (
            <motion.button
              key={v.id}
              className="w-full flex items-center gap-3 px-3 py-3 rounded-xl cursor-pointer text-left"
              onClick={() => setForm({ ...form, vehicleId: v.id })}
              style={{
                background: active
                  ? isDark ? `${BRAND.green}06` : `${BRAND.green}03`
                  : "transparent",
                border: `1px solid ${active ? `${BRAND.green}18` : (isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.05)")}`,
                minHeight: 56,
              }}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              whileHover={{ borderColor: active ? undefined : `${isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.1)"}` }}
            >
              <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{
                background: active ? `${BRAND.green}10` : (isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.03)"),
              }}>
                <Icon size={16} style={{ color: active ? BRAND.green : t.textFaint }} />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span style={{ ...TY.body, fontSize: "12px", color: active ? BRAND.green : t.text, lineHeight: "1.4", letterSpacing: "-0.02em" }}>
                    {v.name}
                  </span>
                  {v.isEV && (
                    <span className="px-1 py-0.5 rounded" style={{
                      fontFamily: "'Montserrat', sans-serif", fontWeight: 600,
                      fontSize: "7px", letterSpacing: "0.04em",
                      background: `${BRAND.green}10`, color: BRAND.green, lineHeight: "1.2",
                    }}>EV</span>
                  )}
                  <span className="ml-auto shrink-0" style={{ ...TY.bodyR, fontSize: "10px", color: t.textFaint, lineHeight: "1.5" }}>
                    {v.eta}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span style={{ ...TY.bodyR, fontSize: "9px", color: t.textFaint, lineHeight: "1.5" }}>
                    {v.description} · {v.capacity} seats
                  </span>
                  <span style={{
                    fontFamily: "'Montserrat', sans-serif", fontWeight: 600,
                    fontSize: "12px", letterSpacing: "-0.02em",
                    color: active ? BRAND.green : t.text, lineHeight: "1.2",
                  }}>
                    {v.fareDisplay}
                  </span>
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>

      <div className="h-px mb-4" style={{ background: `linear-gradient(90deg, ${t.borderSubtle}, transparent 80%)` }} />

      {/* Payment method */}
      <div className="mb-4">
        <label className="flex items-center gap-1.5 mb-2">
          <CreditCard size={10} style={{ color: t.textFaint }} />
          <span style={{ ...TY.body, fontSize: "11px", color: t.textMuted, lineHeight: "1.4", letterSpacing: "-0.02em" }}>Charge to</span>
        </label>
        <div className="flex gap-2">
          {([
            { id: "hotel_account" as const, label: "Hotel account", sub: `${fmt(creditRemaining)} remaining` },
            { id: "guest_card" as const, label: "Guest's card", sub: "Charged at pickup" },
          ]).map(pm => {
            const active = form.paymentMethod === pm.id;
            return (
              <button
                key={pm.id}
                onClick={() => setForm({ ...form, paymentMethod: pm.id })}
                className="flex-1 p-3 rounded-xl cursor-pointer text-left"
                style={{
                  border: `1px solid ${active ? `${BRAND.green}20` : t.borderSubtle}`,
                  background: active ? (isDark ? `${BRAND.green}04` : `${BRAND.green}02`) : "transparent",
                }}
              >
                <span className="block" style={{ ...TY.body, fontSize: "10px", color: active ? BRAND.green : t.textSecondary, lineHeight: "1.4", letterSpacing: "-0.02em" }}>
                  {pm.label}
                </span>
                <span style={{ ...TY.bodyR, fontSize: "9px", color: t.textFaint, lineHeight: "1.5" }}>
                  {pm.sub}
                </span>
              </button>
            );
          })}
        </div>

        {overCredit && (
          <motion.div
            className="flex items-center gap-2 px-3 py-2 mt-2 rounded-xl"
            style={{ background: `${STATUS.error}06`, border: `1px solid ${STATUS.error}10` }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <AlertTriangle size={11} style={{ color: STATUS.error }} />
            <span style={{ ...TY.bodyR, fontSize: "10px", color: STATUS.error, lineHeight: "1.5" }}>
              This fare exceeds your remaining credit. Switch to guest card or contact JET.
            </span>
          </motion.div>
        )}
      </div>

      <CTAButton label="Next — Review booking" onClick={onNext} disabled={overCredit} icon={ArrowRight} />
    </div>
  );
}


// ═══════════════════════════════════════════════════════════════════════════
// STAGE 4: CONFIRM
// ═══════════════════════════════════════════════════════════════════════════

function StageConfirm({ form, onConfirm, onBack }: {
  form: BookingForm; onConfirm: () => void; onBack: () => void;
}) {
  const { t, theme } = useAdminTheme();
  const isDark = theme === "dark";
  const vehicle = VEHICLE_OPTIONS.find(v => v.id === form.vehicleId) || VEHICLE_OPTIONS[0];
  const Icon = VEHICLE_ICONS[vehicle.icon] || Car;

  const rows = [
    { label: "Guest", value: `${form.guestName} · Room ${form.roomNumber}` },
    { label: "Phone", value: form.guestPhone },
    ...(form.flightNumber ? [{ label: "Flight", value: form.flightNumber }] : []),
    { label: "Pickup", value: `Eko Hotels${form.pickupDetail ? ` — ${form.pickupDetail}` : ""}` },
    { label: "Destination", value: form.destination },
    { label: "When", value: form.scheduleType === "now" ? "Now" : `${form.scheduleDate} at ${form.scheduleTime}` },
    { label: "Vehicle", value: `${vehicle.name} · ${vehicle.eta} ETA` },
    { label: "Fare", value: vehicle.fareDisplay },
    { label: "Payment", value: form.paymentMethod === "hotel_account" ? "Hotel account" : "Guest's card" },
    ...(form.notes ? [{ label: "Notes", value: form.notes }] : []),
  ];

  return (
    <div>
      <StageHeader title="Review booking" subtitle="Confirm all details before dispatching" onBack={onBack} />

      <div className="rounded-xl overflow-hidden mb-4" style={{ border: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}` }}>
        {rows.map((row, i) => (
          <div
            key={row.label}
            className="flex items-start justify-between px-4 py-2.5"
            style={{ borderBottom: i < rows.length - 1 ? `1px solid ${isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.03)"}` : "none" }}
          >
            <span style={{ ...TY.bodyR, fontSize: "10px", color: t.textFaint, lineHeight: "1.5", flexShrink: 0, width: 72 }}>
              {row.label}
            </span>
            <span className="text-right" style={{ ...TY.body, fontSize: "11px", color: t.text, lineHeight: "1.4", letterSpacing: "-0.02em" }}>
              {row.value}
            </span>
          </div>
        ))}
      </div>

      {/* Fare highlight */}
      <div className="flex items-center justify-between px-4 py-3 rounded-xl mb-2" style={{
        background: isDark ? `${BRAND.green}04` : `${BRAND.green}02`,
        border: `1px solid ${isDark ? `${BRAND.green}14` : `${BRAND.green}08`}`,
      }}>
        <div className="flex items-center gap-2">
          <Icon size={16} style={{ color: BRAND.green }} />
          <span style={{ ...TY.body, fontSize: "12px", color: BRAND.green, lineHeight: "1.4", letterSpacing: "-0.02em" }}>
            {vehicle.name}
          </span>
        </div>
        <span style={{
          fontFamily: "'Montserrat', sans-serif", fontWeight: 600,
          fontSize: "18px", letterSpacing: "-0.03em", color: BRAND.green, lineHeight: "1.2",
        }}>
          {vehicle.fareDisplay}
        </span>
      </div>

      <CTAButton label="Confirm — Book ride" onClick={onConfirm} icon={Check} />
    </div>
  );
}


// ═══════════════════════════════════════════════════════════════════════════
// STAGE 5: MATCHING
// ═══════════════════════════════════════════════════════════════════════════

function StageMatching({ onAssigned }: { onAssigned: () => void }) {
  const { t, theme } = useAdminTheme();
  const isDark = theme === "dark";
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(p => Math.min(p + 1, 100));
    }, 28);
    const timeout = setTimeout(() => {
      clearInterval(interval);
      onAssigned();
    }, 3000);
    return () => { clearInterval(interval); clearTimeout(timeout); };
  }, [onAssigned]);

  return (
    <div className="flex flex-col items-center justify-center py-16">
      <motion.div
        className="w-16 h-16 rounded-full flex items-center justify-center mb-6"
        style={{ background: `${BRAND.green}08`, border: `2px solid ${BRAND.green}20` }}
        animate={{ scale: [1, 1.08, 1] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
      >
        <Car size={24} style={{ color: BRAND.green }} />
      </motion.div>

      <h3 className="mb-2" style={{
        fontFamily: "'Montserrat', sans-serif", fontWeight: 600,
        fontSize: "16px", letterSpacing: "-0.03em", color: t.text, lineHeight: "1.2",
      }}>
        Finding a driver...
      </h3>
      <p className="mb-6" style={{ ...TY.bodyR, fontSize: "11px", color: t.textMuted, lineHeight: "1.5" }}>
        Matching with the best available driver nearby
      </p>

      <div className="w-48 h-1.5 rounded-full overflow-hidden" style={{
        background: isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)",
      }}>
        <motion.div
          className="h-full rounded-full"
          style={{ background: BRAND.green, width: `${progress}%` }}
        />
      </div>
    </div>
  );
}


// ═══════════════════════════════════════════════════════════════════════════
// STAGE 6: LIVE TRACKING (replaces simple "assigned" card)
// ═══════════════════════════════════════════════════════════════════════════

type TrackingPhase = "en_route_to_pickup" | "arrived_at_pickup" | "in_trip" | "completed";

const TRACKING_PHASES: { id: TrackingPhase; label: string; shortLabel: string }[] = [
  { id: "en_route_to_pickup", label: "Driver en route to pickup", shortLabel: "En route" },
  { id: "arrived_at_pickup", label: "Driver arrived at pickup", shortLabel: "At pickup" },
  { id: "in_trip", label: "Trip in progress", shortLabel: "In trip" },
  { id: "completed", label: "Trip completed", shortLabel: "Done" },
];

// OTP synced from single source of truth (/config/otp-config.ts)
// Hotel shows START OTP — guest gives this to driver at pickup
const TRIP_OTP = { code: START_OTP.code, digits: [...START_OTP.digits] };
const TRACKING_TOKEN = TRACKING_LINK.mockShortToken;

function StageAssigned({ form, onBookAnother, onViewRides }: {
  form: BookingForm; onBookAnother: () => void; onViewRides: () => void;
}) {
  const { t, theme } = useAdminTheme();
  const isDark = theme === "dark";
  const vehicle = VEHICLE_OPTIONS.find(v => v.id === form.vehicleId) || VEHICLE_OPTIONS[0];
  const [toastMsg, setToastMsg] = useState<{ msg: string; type: "success" | "info" | "error" } | null>(null);
  const [phase, setPhase] = useState<TrackingPhase>("en_route_to_pickup");
  const phaseIdx = TRACKING_PHASES.findIndex(p => p.id === phase);
  const [showShareModal, setShowShareModal] = useState(false);
  const [smsSent, setSmsSent] = useState(false);
  const [cancelConfirm, setCancelConfirm] = useState(false);

  // Auto-advance demo phases
  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase("arrived_at_pickup"), 8000),
      setTimeout(() => setPhase("in_trip"), 14000),
      setTimeout(() => setPhase("completed"), 22000),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  const trackingUrl = `jet.ng/track/${TRACKING_TOKEN}`;
  const smsPreview = `Your JET ride is on the way!\nDriver: ${MOCK_DRIVER.name} · ${MOCK_DRIVER.vehicle}\n${MOCK_DRIVER.plate} · ETA: ${MOCK_DRIVER.eta}\nTrack: ${trackingUrl}\nCode: ${TRIP_OTP.code}`;

  const handleSendSMS = () => {
    setSmsSent(true);
    setShowShareModal(false);
    setToastMsg({ msg: `Tracking + OTP sent to ${form.guestPhone} via SMS`, type: "success" });
  };

  const handleCopyLink = () => {
    navigator.clipboard?.writeText(`https://${trackingUrl}`);
    setToastMsg({ msg: "Tracking link copied to clipboard", type: "info" });
  };

  const handleCancel = () => {
    setCancelConfirm(false);
    setToastMsg({ msg: "Ride cancelled. Guest has been notified.", type: "error" });
    setTimeout(onBookAnother, 1500);
  };

  return (
    <div>
      {/* Status bar — phase dots */}
      <div className="flex items-center gap-1 mb-4">
        {TRACKING_PHASES.map((p, i) => (
          <div key={p.id} className="flex-1 flex flex-col items-center gap-1">
            <div className="w-full h-1 rounded-full overflow-hidden" style={{
              background: isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)",
            }}>
              <motion.div
                className="h-full rounded-full"
                style={{ background: BRAND.green }}
                animate={{ width: i <= phaseIdx ? "100%" : "0%" }}
                transition={{ duration: 0.4 }}
              />
            </div>
            <span style={{ ...TY.bodyR, fontSize: "8px", color: i <= phaseIdx ? BRAND.green : t.textFaint, lineHeight: "1.2" }}>
              {p.shortLabel}
            </span>
          </div>
        ))}
      </div>

      {/* Status headline */}
      <motion.div
        key={phase}
        className="flex items-center gap-2 px-4 py-3 rounded-xl mb-4"
        style={{
          background: phase === "completed" ? `${BRAND.green}06` : (isDark ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.015)"),
          border: `1px solid ${phase === "completed" ? `${BRAND.green}14` : t.borderSubtle}`,
        }}
        initial={{ opacity: 0, y: -4 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {phase === "completed" ? (
          <Check size={14} style={{ color: BRAND.green }} />
        ) : (
          <motion.div
            className="w-2 h-2 rounded-full"
            style={{ background: BRAND.green }}
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        )}
        <span style={{ ...TY.body, fontSize: "12px", color: phase === "completed" ? BRAND.green : t.text, lineHeight: "1.4", letterSpacing: "-0.02em" }}>
          {TRACKING_PHASES[phaseIdx].label}
        </span>
        {smsSent && phase !== "completed" && (
          <span className="ml-auto px-1.5 py-0.5 rounded" style={{
            fontFamily: "'Montserrat', sans-serif", fontWeight: 600,
            fontSize: "7px", letterSpacing: "0.04em",
            background: `${BRAND.green}08`, color: BRAND.green,
          }}>
            SMS SENT
          </span>
        )}
      </motion.div>

      {/* Driver Card */}
      <motion.div
        className="p-4 rounded-xl mb-4"
        style={{
          background: isDark ? "rgba(255,255,255,0.025)" : "rgba(255,255,255,0.9)",
          border: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}`,
        }}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="flex items-start gap-3 mb-3">
          <div className="w-11 h-11 rounded-full flex items-center justify-center shrink-0" style={{
            background: `${BRAND.green}08`, border: `2px solid ${BRAND.green}`,
          }}>
            <span style={{
              fontFamily: "'Montserrat', sans-serif", fontWeight: 600,
              fontSize: "12px", color: BRAND.green, letterSpacing: "-0.02em",
            }}>
              {MOCK_DRIVER.photo}
            </span>
          </div>
          <div className="flex-1">
            <span className="block" style={{ ...TY.body, fontSize: "13px", color: t.text, lineHeight: "1.4", letterSpacing: "-0.02em" }}>
              {MOCK_DRIVER.name}
            </span>
            <div className="flex items-center gap-2 mt-0.5">
              <Star size={10} style={{ color: BRAND.green, fill: BRAND.green }} />
              <span style={{ ...TY.bodyR, fontSize: "10px", color: t.textMuted, lineHeight: "1.5" }}>
                {MOCK_DRIVER.rating} · {MOCK_DRIVER.totalRides.toLocaleString()} rides
              </span>
            </div>
          </div>
          <div className="text-right">
            <span className="block" style={{
              fontFamily: "'Montserrat', sans-serif", fontWeight: 600,
              fontSize: "16px", letterSpacing: "-0.03em", color: BRAND.green, lineHeight: "1.2",
            }}>
              {phase === "en_route_to_pickup" ? MOCK_DRIVER.eta : phase === "arrived_at_pickup" ? "Here" : phase === "in_trip" ? "~35m" : "--"}
            </span>
            <span style={{ ...TY.bodyR, fontSize: "9px", color: t.textFaint, lineHeight: "1.5" }}>
              {phase === "arrived_at_pickup" ? "Waiting" : phase === "in_trip" ? "To dest." : "ETA"}
            </span>
          </div>
        </div>

        <div className="h-px mb-3" style={{ background: t.borderSubtle }} />

        <div className="flex items-center justify-between">
          <div>
            <span className="block" style={{ ...TY.body, fontSize: "11px", color: t.text, lineHeight: "1.4", letterSpacing: "-0.02em" }}>
              {MOCK_DRIVER.vehicle}
            </span>
            <span style={{ ...TY.bodyR, fontSize: "10px", color: t.textFaint, lineHeight: "1.5" }}>
              {MOCK_DRIVER.plate}
            </span>
          </div>
          <span style={{
            fontFamily: "'Montserrat', sans-serif", fontWeight: 600,
            fontSize: "14px", letterSpacing: "-0.02em", color: t.text, lineHeight: "1.2",
          }}>
            {vehicle.fareDisplay}
          </span>
        </div>

        {/* Contact buttons */}
        <div className="flex gap-2 mt-3">
          <button
            onClick={() => setToastMsg({ msg: "Calling driver...", type: "info" })}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg cursor-pointer"
            style={{ border: `1px solid ${t.borderSubtle}`, minHeight: 36 }}
          >
            <Phone size={11} style={{ color: t.textMuted }} />
            <span style={{ ...TY.bodyR, fontSize: "10px", color: t.textSecondary, lineHeight: "1.4" }}>Call</span>
          </button>
          <button
            onClick={() => setToastMsg({ msg: "Opening chat...", type: "info" })}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg cursor-pointer"
            style={{ border: `1px solid ${t.borderSubtle}`, minHeight: 36 }}
          >
            <MessageSquare size={11} style={{ color: t.textMuted }} />
            <span style={{ ...TY.bodyR, fontSize: "10px", color: t.textSecondary, lineHeight: "1.4" }}>Message</span>
          </button>
        </div>
      </motion.div>

      {/* Trip summary */}
      <motion.div
        className="px-4 py-3 rounded-xl mb-4"
        style={{ background: isDark ? "rgba(255,255,255,0.015)" : "rgba(0,0,0,0.01)", border: `1px solid ${t.borderSubtle}` }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.15 }}
      >
        <div className="flex items-center gap-2 mb-2">
          <User size={10} style={{ color: t.textFaint }} />
          <span style={{ ...TY.body, fontSize: "11px", color: t.text, lineHeight: "1.4", letterSpacing: "-0.02em" }}>
            {form.guestName} · Room {form.roomNumber}
          </span>
        </div>
        <div className="flex items-start gap-2">
          <div className="flex flex-col items-center gap-0.5 mt-1">
            <div className="w-1.5 h-1.5 rounded-full" style={{ background: BRAND.green }} />
            <div className="w-px h-4" style={{ background: t.borderSubtle }} />
            <MapPin size={8} style={{ color: t.textFaint }} />
          </div>
          <div className="space-y-2">
            <span className="block" style={{ ...TY.bodyR, fontSize: "10px", color: t.textMuted, lineHeight: "1.5" }}>
              Eko Hotels{form.pickupDetail ? ` — ${form.pickupDetail}` : ""}
            </span>
            <span className="block" style={{ ...TY.bodyR, fontSize: "10px", color: t.textMuted, lineHeight: "1.5" }}>
              {form.destination}
            </span>
          </div>
        </div>
      </motion.div>

      {/* OTP Card — triple channel */}
      <motion.div
        className="p-4 rounded-xl mb-4"
        style={{
          background: isDark ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.01)",
          border: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}`,
        }}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex items-center justify-between mb-3">
          <span style={{
            fontFamily: "'Montserrat', sans-serif", fontWeight: 600,
            fontSize: "10px", letterSpacing: "0.04em", color: t.textFaint, lineHeight: "1.2",
          }}>
            TRIP VERIFICATION CODE
          </span>
          <span style={{ ...TY.bodyR, fontSize: "9px", color: t.textFaint }}>
            Channel 3 of 3
          </span>
        </div>

        <div className="flex items-center justify-center gap-2 mb-3">
          {TRIP_OTP.digits.map((d, i) => (
            <motion.div
              key={i}
              className="w-12 h-14 rounded-xl flex items-center justify-center"
              style={{
                background: isDark ? `${BRAND.green}06` : `${BRAND.green}03`,
                border: `1px solid ${isDark ? `${BRAND.green}18` : `${BRAND.green}10`}`,
              }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.25 + i * 0.05 }}
            >
              <span style={{
                fontFamily: "'Montserrat', sans-serif", fontWeight: 600,
                fontSize: "22px", letterSpacing: "-0.02em", color: BRAND.green, lineHeight: "1",
              }}>
                {d}
              </span>
            </motion.div>
          ))}
        </div>

        <p className="text-center mb-2" style={{ ...TY.bodyR, fontSize: "10px", color: t.textMuted, lineHeight: "1.5" }}>
          Guest shows this code to driver at destination
        </p>

        <div className="h-px my-3" style={{ background: `linear-gradient(90deg, transparent, ${t.borderSubtle}, transparent)` }} />

        <div className="space-y-1.5">
          {[
            { idx: 1, label: smsSent ? `SMS sent to ${form.guestPhone}` : "SMS — not yet sent", done: smsSent },
            { idx: 2, label: smsSent ? "Tracking page — link sent" : "Tracking page — pending share", done: smsSent },
            { idx: 3, label: "Hotel dashboard — visible now (you)", done: true },
          ].map(ch => (
            <div key={ch.idx} className="flex items-center gap-2">
              <div className="w-4 h-4 rounded flex items-center justify-center" style={{
                background: ch.done ? `${BRAND.green}10` : (isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.03)"),
              }}>
                {ch.done ? <Check size={8} style={{ color: BRAND.green }} /> : <span style={{ ...TY.bodyR, fontSize: "8px", color: t.textFaint }}>{ch.idx}</span>}
              </div>
              <span style={{ ...TY.bodyR, fontSize: "9px", color: ch.done ? BRAND.green : t.textFaint, lineHeight: "1.5" }}>
                {ch.label}
              </span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Actions */}
      <div className="flex items-center gap-2 mb-4">
        <button
          onClick={() => setShowShareModal(true)}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl cursor-pointer"
          style={{
            background: smsSent ? "transparent" : `${BRAND.green}06`,
            border: `1px solid ${smsSent ? t.borderSubtle : `${BRAND.green}14`}`,
            minHeight: 44,
          }}
        >
          <Send size={12} style={{ color: smsSent ? t.textMuted : BRAND.green }} />
          <span style={{ ...TY.body, fontSize: "11px", color: smsSent ? t.textSecondary : BRAND.green, lineHeight: "1.4", letterSpacing: "-0.02em" }}>
            {smsSent ? "Resend to guest" : "Share tracking with guest"}
          </span>
        </button>
      </div>

      {phase !== "completed" ? (
        <button
          onClick={() => setCancelConfirm(true)}
          className="w-full py-3 rounded-xl flex items-center justify-center gap-2 cursor-pointer"
          style={{ border: `1px solid ${STATUS.error}20`, minHeight: 48 }}
        >
          <X size={14} style={{ color: STATUS.error }} />
          <span style={{ ...TY.body, fontSize: "12px", color: STATUS.error, letterSpacing: "-0.02em", lineHeight: "1.4" }}>
            Cancel ride
          </span>
        </button>
      ) : (
        <div className="flex gap-3">
          <button
            onClick={onBookAnother}
            className="flex-1 py-3 rounded-xl flex items-center justify-center gap-2 cursor-pointer"
            style={{ background: BRAND.green, border: `1px solid ${BRAND.green}`, minHeight: 48 }}
          >
            <span style={{ ...TY.body, fontSize: "12px", color: "#fff", letterSpacing: "-0.02em", lineHeight: "1.4" }}>
              Book another ride
            </span>
          </button>
          <button
            onClick={onViewRides}
            className="px-5 py-3 rounded-xl cursor-pointer"
            style={{ border: `1px solid ${t.borderSubtle}`, minHeight: 48 }}
          >
            <span style={{ ...TY.body, fontSize: "12px", color: t.textSecondary, letterSpacing: "-0.02em", lineHeight: "1.4" }}>
              View rides
            </span>
          </button>
        </div>
      )}

      {/* ── SHARE MODAL ── */}
      <AnimatePresence>
        {showShareModal && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="absolute inset-0" style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)" }} onClick={() => setShowShareModal(false)} />
            <motion.div
              className="relative w-full max-w-sm rounded-2xl overflow-hidden p-5"
              style={{
                background: isDark ? "rgba(18,18,20,0.97)" : "#fff",
                border: `1px solid ${isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)"}`,
                boxShadow: "0 24px 48px rgba(0,0,0,0.2)",
              }}
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 style={{
                  fontFamily: "'Montserrat', sans-serif", fontWeight: 600,
                  fontSize: "14px", letterSpacing: "-0.03em", color: t.text, lineHeight: "1.2",
                }}>
                  Share ride tracking
                </h3>
                <button onClick={() => setShowShareModal(false)} className="p-1 cursor-pointer">
                  <X size={14} style={{ color: t.textFaint }} />
                </button>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2">
                  <User size={10} style={{ color: t.textFaint }} />
                  <span style={{ ...TY.body, fontSize: "11px", color: t.text, lineHeight: "1.4", letterSpacing: "-0.02em" }}>
                    {form.guestName} · Room {form.roomNumber}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone size={10} style={{ color: t.textFaint }} />
                  <span style={{ ...TY.bodyR, fontSize: "11px", color: t.textMuted, lineHeight: "1.5" }}>
                    {form.guestPhone}
                  </span>
                </div>
              </div>

              <div className="mb-4">
                <span className="block mb-2" style={{
                  fontFamily: "'Montserrat', sans-serif", fontWeight: 600,
                  fontSize: "9px", letterSpacing: "0.04em", color: t.textFaint, lineHeight: "1.2",
                }}>
                  THE GUEST WILL RECEIVE
                </span>
                <div className="space-y-1.5">
                  {["Live tracking link", "Driver details (name, vehicle, plate)", "Trip verification code (OTP)"].map(item => (
                    <div key={item} className="flex items-center gap-2">
                      <Check size={9} style={{ color: BRAND.green }} />
                      <span style={{ ...TY.bodyR, fontSize: "10px", color: t.textMuted, lineHeight: "1.5" }}>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mb-4">
                <span className="block mb-2" style={{
                  fontFamily: "'Montserrat', sans-serif", fontWeight: 600,
                  fontSize: "9px", letterSpacing: "0.04em", color: t.textFaint, lineHeight: "1.2",
                }}>
                  SMS PREVIEW
                </span>
                <div className="p-3 rounded-xl" style={{
                  background: isDark ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.015)",
                  border: `1px solid ${t.borderSubtle}`,
                }}>
                  <pre className="whitespace-pre-wrap" style={{ ...TY.bodyR, fontSize: "10px", color: t.textSecondary, lineHeight: "1.6", fontFamily: "'Manrope', sans-serif" }}>
                    {smsPreview}
                  </pre>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={handleSendSMS}
                  className="flex-1 py-3 rounded-xl flex items-center justify-center gap-2 cursor-pointer"
                  style={{ background: BRAND.green, border: `1px solid ${BRAND.green}`, minHeight: 44 }}
                >
                  <Send size={12} style={{ color: "#fff" }} />
                  <span style={{ ...TY.body, fontSize: "11px", color: "#fff", letterSpacing: "-0.02em", lineHeight: "1.4" }}>
                    Send SMS
                  </span>
                </button>
                <button
                  onClick={handleCopyLink}
                  className="px-4 py-3 rounded-xl flex items-center justify-center gap-2 cursor-pointer"
                  style={{ border: `1px solid ${t.borderSubtle}`, minHeight: 44 }}
                >
                  <Copy size={12} style={{ color: t.textMuted }} />
                  <span style={{ ...TY.body, fontSize: "11px", color: t.textSecondary, letterSpacing: "-0.02em", lineHeight: "1.4" }}>
                    Copy link
                  </span>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── CANCEL CONFIRMATION ── */}
      <AnimatePresence>
        {cancelConfirm && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="absolute inset-0" style={{ background: "rgba(0,0,0,0.5)" }} onClick={() => setCancelConfirm(false)} />
            <motion.div
              className="relative w-full max-w-xs rounded-2xl overflow-hidden p-5"
              style={{
                background: isDark ? "rgba(18,18,20,0.97)" : "#fff",
                border: `1px solid ${isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)"}`,
              }}
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
            >
              <h3 className="mb-2" style={{
                fontFamily: "'Montserrat', sans-serif", fontWeight: 600,
                fontSize: "14px", letterSpacing: "-0.03em", color: t.text, lineHeight: "1.2",
              }}>
                Cancel this ride?
              </h3>
              <p className="mb-4" style={{ ...TY.bodyR, fontSize: "11px", color: t.textMuted, lineHeight: "1.5" }}>
                The driver will be notified and the guest will receive a cancellation SMS. A cancellation fee may apply to the hotel account.
              </p>
              <div className="flex gap-2">
                <button
                  onClick={handleCancel}
                  className="flex-1 py-2.5 rounded-xl flex items-center justify-center cursor-pointer"
                  style={{ background: STATUS.error, border: `1px solid ${STATUS.error}`, minHeight: 40 }}
                >
                  <span style={{ ...TY.body, fontSize: "11px", color: "#fff", letterSpacing: "-0.02em" }}>Cancel ride</span>
                </button>
                <button
                  onClick={() => setCancelConfirm(false)}
                  className="flex-1 py-2.5 rounded-xl flex items-center justify-center cursor-pointer"
                  style={{ border: `1px solid ${t.borderSubtle}`, minHeight: 40 }}
                >
                  <span style={{ ...TY.body, fontSize: "11px", color: t.textSecondary, letterSpacing: "-0.02em" }}>Keep ride</span>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {toastMsg && <Toast message={toastMsg.msg} type={toastMsg.type} onDismiss={() => setToastMsg(null)} />}
      </AnimatePresence>
    </div>
  );
}


// ═══════════════════════════════════════════════════════════════════════════
// FORM STATE & MAIN EXPORT
// ═══════════════════════════════════════════════════════════════════════════

interface BookingForm {
  guestName: string;
  roomNumber: string;
  guestPhone: string;
  flightNumber: string;
  pickupDetail: string;
  destination: string;
  scheduleType: "now" | "later";
  scheduleDate: string;
  scheduleTime: string;
  notes: string;
  vehicleId: string;
  paymentMethod: "hotel_account" | "guest_card";
}

const INITIAL_FORM: BookingForm = {
  guestName: "",
  roomNumber: "",
  guestPhone: "",
  flightNumber: "",
  pickupDetail: "",
  destination: "",
  scheduleType: "now",
  scheduleDate: "2026-03-16",
  scheduleTime: "14:00",
  notes: "",
  vehicleId: "jet-go",
  paymentMethod: "hotel_account",
};


export function HotelBookRide() {
  const { t } = useAdminTheme();
  const { navigateTo } = useHotelContext();

  const [stage, setStage] = useState<BookingStage>("guest");
  const [form, setForm] = useState<BookingForm>(INITIAL_FORM);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 400);
    return () => clearTimeout(timer);
  }, []);

  const resetFlow = useCallback(() => {
    setForm(INITIAL_FORM);
    setStage("guest");
  }, []);

  const goToRides = useCallback(() => navigateTo("rides"), [navigateTo]);

  if (isLoading) return <FormSkeleton />;
  if (isError) return <ErrorState onRetry={() => { setIsError(false); setIsLoading(true); setTimeout(() => setIsLoading(false), 400); }} />;

  return (
    <div className="h-full overflow-y-auto p-4 md:p-6">
      <div className="max-w-lg mx-auto">
        <StageProgress stage={stage} />

        <AnimatePresence mode="wait">
          <motion.div
            key={stage}
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -12 }}
            transition={{ duration: 0.2 }}
          >
            {stage === "guest" && (
              <StageGuest
                form={form}
                setForm={setForm}
                onNext={() => setStage("route")}
                onBack={() => navigateTo("dashboard")}
              />
            )}
            {stage === "route" && (
              <StageRoute
                form={form}
                setForm={setForm}
                onNext={() => setStage("vehicle")}
                onBack={() => setStage("guest")}
              />
            )}
            {stage === "vehicle" && (
              <StageVehicle
                form={form}
                setForm={setForm}
                onNext={() => setStage("confirm")}
                onBack={() => setStage("route")}
              />
            )}
            {stage === "confirm" && (
              <StageConfirm
                form={form}
                onConfirm={() => setStage("matching")}
                onBack={() => setStage("vehicle")}
              />
            )}
            {stage === "matching" && (
              <StageMatching onAssigned={() => setStage("assigned")} />
            )}
            {stage === "assigned" && (
              <StageAssigned
                form={form}
                onBookAnother={resetFlow}
                onViewRides={goToRides}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}