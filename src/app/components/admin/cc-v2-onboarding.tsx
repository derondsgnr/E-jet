/**
 * FIX 1 — UNIFIED ONBOARDING (V2)
 *
 * Full-screen fixed overlay covering entire viewport (including nav rail).
 * Background: ghosted Nigeria map that progressively lights up as steps complete.
 * Center: setup card — left step nav, right action form.
 * Each step has a REAL action (not "mark as complete"):
 *   Zones → configure zone name/tier
 *   Drivers → invite via email/phone
 *   Hotels → add hotel partner (optional)
 *   Fleet → register fleet owner (optional)
 *   Go Live → confirmation → celebration → CC reveal
 *
 * Progressive build-up: map pins and KPI cards appear as steps finish.
 * Celebration: confetti + pulse + success state on full completion.
 */

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  MapPin, Car, Building2, Users, Rocket,
  CheckCircle2, Activity, Wallet, Zap,
  ChevronRight, Plus, X, Send, Globe, Star,
} from "lucide-react";
import { useAdminTheme, TY, BRAND, STATUS } from "../../config/admin-theme";
import {
  ZONE_MAP_POSITIONS,
} from "../../config/admin-mock-data";

/* ══════════════════════════════════════════════════════════════��════════════
   STEP DEFINITIONS
   ═══════════════════════════════════════════════════════════════════════════ */

interface SetupStep {
  id: string;
  label: string;
  desc: string;
  icon: typeof MapPin;
  color: string;
  required: boolean;
  actionLabel: string;
  /** What lights up on the CC when this step completes */
  unlocks: string;
}

const STEPS: SetupStep[] = [
  {
    id: "zones",
    label: "Zones",
    desc: "Define geographic boundaries and pricing for your operating areas.",
    icon: MapPin,
    color: BRAND.green,
    required: true,
    actionLabel: "Create Zone",
    unlocks: "Zone pins on map · Demand heatmap · Surge controls",
  },
  {
    id: "drivers",
    label: "Drivers",
    desc: "Invite drivers to join the platform. They'll flow through verification.",
    icon: Car,
    color: BRAND.green,
    required: true,
    actionLabel: "Invite Driver",
    unlocks: "Supply metrics · Driver KPIs · Onboarding pipeline",
  },
  {
    id: "hotels",
    label: "Hotels",
    desc: "Add hotel partners for guest ride integration.",
    icon: Building2,
    color: STATUS.info,
    required: false,
    actionLabel: "Add Partner",
    unlocks: "Hotel entity layer · Guest ride metrics · Partner invoicing",
  },
  {
    id: "fleet",
    label: "Fleet",
    desc: "Register fleet owners who manage multiple vehicles and drivers.",
    icon: Car,
    color: "#F59E0B",
    required: false,
    actionLabel: "Register Fleet",
    unlocks: "Fleet utilization · Vehicle tracking · Payout management",
  },
  {
    id: "launch",
    label: "Go Live",
    desc: "Open to riders. The Command Center comes alive.",
    icon: Rocket,
    color: "#A78BFA",
    required: true,
    actionLabel: "Launch JET",
    unlocks: "Live ride tracking · Revenue stream · Full Command Center",
  },
];

/* ═══════════════════════════════════════════════════════════════════════════
   ZONE FORM
   ═══════════════════════════════════════════════════════════════════════════ */

function ZoneForm({ onComplete }: { onComplete: () => void }) {
  const { t, theme } = useAdminTheme();
  const isDark = theme === "dark";
  const [name, setName] = useState("");
  const [tier, setTier] = useState("standard");

  const canSubmit = name.trim().length >= 2;

  return (
    <div className="space-y-4">
      <div>
        <label style={{ ...TY.label, fontSize: "9px", color: t.textMuted, display: "block", marginBottom: 6 }}>ZONE NAME</label>
        <input
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="e.g. Victoria Island"
          className="w-full h-10 px-3 rounded-lg outline-none transition-colors"
          style={{
            ...TY.body, fontSize: "13px", color: t.text,
            background: isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.03)",
            border: `1px solid ${isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)"}`,
          }}
        />
      </div>
      <div>
        <label style={{ ...TY.label, fontSize: "9px", color: t.textMuted, display: "block", marginBottom: 6 }}>PRICING TIER</label>
        <div className="flex gap-2">
          {["standard", "premium", "surge"].map(t2 => (
            <button
              key={t2}
              onClick={() => setTier(t2)}
              className="flex-1 h-9 rounded-lg transition-all"
              style={{
                ...TY.body, fontSize: "11px",
                color: tier === t2 ? "#FFF" : t.textSecondary,
                background: tier === t2 ? BRAND.green : isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)",
                border: `1px solid ${tier === t2 ? BRAND.green : isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}`,
              }}
            >
              {t2.charAt(0).toUpperCase() + t2.slice(1)}
            </button>
          ))}
        </div>
      </div>
      <button
        onClick={() => canSubmit && onComplete()}
        disabled={!canSubmit}
        className="w-full h-10 rounded-lg flex items-center justify-center gap-2 transition-all"
        style={{
          background: canSubmit ? BRAND.green : isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.03)",
          color: canSubmit ? "#FFF" : t.textFaint,
          opacity: canSubmit ? 1 : 0.5,
        }}
      >
        <Plus size={14} />
        <span style={{ ...TY.body, fontSize: "12px" }}>Create Zone</span>
      </button>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   DRIVER INVITE FORM
   ═══════════════════════════════════════════════════════════════════════════ */

function DriverForm({ onComplete }: { onComplete: () => void }) {
  const { t, theme } = useAdminTheme();
  const isDark = theme === "dark";
  const [contact, setContact] = useState("");

  const canSubmit = contact.trim().length >= 3;

  return (
    <div className="space-y-4">
      <div>
        <label style={{ ...TY.label, fontSize: "9px", color: t.textMuted, display: "block", marginBottom: 6 }}>EMAIL OR PHONE</label>
        <input
          value={contact}
          onChange={e => setContact(e.target.value)}
          placeholder="driver@email.com or +234..."
          className="w-full h-10 px-3 rounded-lg outline-none transition-colors"
          style={{
            ...TY.body, fontSize: "13px", color: t.text,
            background: isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.03)",
            border: `1px solid ${isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)"}`,
          }}
        />
      </div>
      <div className="p-3 rounded-lg" style={{ background: `${BRAND.green}08`, border: `1px solid ${BRAND.green}12` }}>
        <span style={{ ...TY.bodyR, fontSize: "10px", color: t.textMuted }}>
          Driver receives an invite link → signs up → enters verification pipeline (documents → background → vehicle inspection).
        </span>
      </div>
      <button
        onClick={() => canSubmit && onComplete()}
        disabled={!canSubmit}
        className="w-full h-10 rounded-lg flex items-center justify-center gap-2 transition-all"
        style={{
          background: canSubmit ? BRAND.green : isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.03)",
          color: canSubmit ? "#FFF" : t.textFaint,
          opacity: canSubmit ? 1 : 0.5,
        }}
      >
        <Send size={13} />
        <span style={{ ...TY.body, fontSize: "12px" }}>Send Invite</span>
      </button>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   HOTEL FORM
   ═══════════════════════════════════════════════════════════════════════════ */

function HotelForm({ onComplete, onSkip }: { onComplete: () => void; onSkip: () => void }) {
  const { t, theme } = useAdminTheme();
  const isDark = theme === "dark";
  const [name, setName] = useState("");
  const [hotelTier, setHotelTier] = useState("3-star");

  const canSubmit = name.trim().length >= 2;

  return (
    <div className="space-y-4">
      <div>
        <label style={{ ...TY.label, fontSize: "9px", color: t.textMuted, display: "block", marginBottom: 6 }}>HOTEL NAME</label>
        <input
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="e.g. Eko Hotels & Suites"
          className="w-full h-10 px-3 rounded-lg outline-none transition-colors"
          style={{
            ...TY.body, fontSize: "13px", color: t.text,
            background: isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.03)",
            border: `1px solid ${isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)"}`,
          }}
        />
      </div>
      <div>
        <label style={{ ...TY.label, fontSize: "9px", color: t.textMuted, display: "block", marginBottom: 6 }}>TIER</label>
        <div className="flex gap-2">
          {["3-star", "4-star", "5-star"].map(tier => (
            <button
              key={tier}
              onClick={() => setHotelTier(tier)}
              className="flex-1 h-9 rounded-lg flex items-center justify-center gap-1 transition-all"
              style={{
                ...TY.body, fontSize: "11px",
                color: hotelTier === tier ? "#FFF" : t.textSecondary,
                background: hotelTier === tier ? STATUS.info : isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)",
                border: `1px solid ${hotelTier === tier ? STATUS.info : isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}`,
              }}
            >
              <Star size={10} />
              {tier}
            </button>
          ))}
        </div>
      </div>
      <div className="flex gap-2">
        <button
          onClick={onSkip}
          className="flex-1 h-10 rounded-lg flex items-center justify-center transition-colors"
          style={{
            ...TY.body, fontSize: "12px", color: t.textMuted,
            background: isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)",
            border: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)"}`,
          }}
        >
          Skip for now
        </button>
        <button
          onClick={() => canSubmit && onComplete()}
          disabled={!canSubmit}
          className="flex-1 h-10 rounded-lg flex items-center justify-center gap-2 transition-all"
          style={{
            background: canSubmit ? STATUS.info : isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.03)",
            color: canSubmit ? "#FFF" : t.textFaint,
            opacity: canSubmit ? 1 : 0.5,
          }}
        >
          <Building2 size={13} />
          <span style={{ ...TY.body, fontSize: "12px" }}>Add Partner</span>
        </button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════���═══════════════════
   FLEET FORM
   ═══════════════════════════════════════════════════════════════════════════ */

function FleetForm({ onComplete, onSkip }: { onComplete: () => void; onSkip: () => void }) {
  const { t, theme } = useAdminTheme();
  const isDark = theme === "dark";
  const [ownerName, setOwnerName] = useState("");
  const [vehicles, setVehicles] = useState("");

  const canSubmit = ownerName.trim().length >= 2 && vehicles.trim().length > 0;

  return (
    <div className="space-y-4">
      <div>
        <label style={{ ...TY.label, fontSize: "9px", color: t.textMuted, display: "block", marginBottom: 6 }}>FLEET OWNER NAME</label>
        <input
          value={ownerName}
          onChange={e => setOwnerName(e.target.value)}
          placeholder="e.g. Lagos Express Fleet Ltd"
          className="w-full h-10 px-3 rounded-lg outline-none transition-colors"
          style={{
            ...TY.body, fontSize: "13px", color: t.text,
            background: isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.03)",
            border: `1px solid ${isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)"}`,
          }}
        />
      </div>
      <div>
        <label style={{ ...TY.label, fontSize: "9px", color: t.textMuted, display: "block", marginBottom: 6 }}>NUMBER OF VEHICLES</label>
        <input
          value={vehicles}
          onChange={e => setVehicles(e.target.value.replace(/\D/g, ""))}
          placeholder="e.g. 25"
          className="w-full h-10 px-3 rounded-lg outline-none transition-colors"
          style={{
            ...TY.body, fontSize: "13px", color: t.text,
            background: isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.03)",
            border: `1px solid ${isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)"}`,
          }}
        />
      </div>
      <div className="flex gap-2">
        <button
          onClick={onSkip}
          className="flex-1 h-10 rounded-lg flex items-center justify-center transition-colors"
          style={{
            ...TY.body, fontSize: "12px", color: t.textMuted,
            background: isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)",
            border: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)"}`,
          }}
        >
          Skip for now
        </button>
        <button
          onClick={() => canSubmit && onComplete()}
          disabled={!canSubmit}
          className="flex-1 h-10 rounded-lg flex items-center justify-center gap-2 transition-all"
          style={{
            background: canSubmit ? "#F59E0B" : isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.03)",
            color: canSubmit ? "#FFF" : t.textFaint,
            opacity: canSubmit ? 1 : 0.5,
          }}
        >
          <Car size={13} />
          <span style={{ ...TY.body, fontSize: "12px" }}>Register Fleet</span>
        </button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   LAUNCH CONFIRMATION
   ═══════════════════════════════════════════════════════════════════════════ */

function LaunchForm({ completed, onLaunch }: { completed: string[]; onLaunch: () => void }) {
  const { t, theme } = useAdminTheme();
  const isDark = theme === "dark";
  const requiredDone = STEPS.filter(s => s.required && s.id !== "launch" && completed.includes(s.id)).length;
  const requiredTotal = STEPS.filter(s => s.required && s.id !== "launch").length;
  const canLaunch = requiredDone >= requiredTotal;

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        {STEPS.filter(s => s.id !== "launch").map(step => {
          const done = completed.includes(step.id);
          return (
            <div key={step.id} className="flex items-center gap-3 p-2.5 rounded-lg" style={{
              background: done ? `${step.color}06` : isDark ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.015)",
              border: `1px solid ${done ? `${step.color}15` : "transparent"}`,
            }}>
              {done ? (
                <CheckCircle2 size={16} style={{ color: step.color }} />
              ) : (
                <div className="w-4 h-4 rounded-full" style={{ border: `1.5px solid ${t.textFaint}` }} />
              )}
              <span style={{ ...TY.body, fontSize: "12px", color: done ? t.text : t.textMuted }}>{step.label}</span>
              {!step.required && <span style={{ ...TY.cap, fontSize: "8px", color: t.textFaint }}>Optional</span>}
              {done && <span style={{ ...TY.cap, fontSize: "8px", color: step.color, marginLeft: "auto" }}>Done</span>}
            </div>
          );
        })}
      </div>
      {!canLaunch && (
        <div className="p-3 rounded-lg" style={{ background: `${STATUS.warning}08`, border: `1px solid ${STATUS.warning}12` }}>
          <span style={{ ...TY.bodyR, fontSize: "11px", color: STATUS.warning }}>
            Complete all required steps before launching.
          </span>
        </div>
      )}
      <button
        onClick={() => canLaunch && onLaunch()}
        disabled={!canLaunch}
        className="w-full h-12 rounded-xl flex items-center justify-center gap-2.5 transition-all"
        style={{
          background: canLaunch ? `linear-gradient(135deg, ${BRAND.green}, #046538)` : isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.03)",
          color: canLaunch ? "#FFF" : t.textFaint,
          opacity: canLaunch ? 1 : 0.4,
          boxShadow: canLaunch ? `0 4px 24px ${BRAND.green}30` : "none",
        }}
      >
        <Rocket size={16} />
        <span style={{ ...TY.sub, fontSize: "14px" }}>Launch JET</span>
      </button>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   CELEBRATION OVERLAY
   ═══════════════════════════════════════════════════════════════════════════ */

function CelebrationOverlay({ onDone }: { onDone: () => void }) {
  const { t } = useAdminTheme();

  // Generate confetti particles
  const particles = Array.from({ length: 40 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    delay: Math.random() * 0.8,
    duration: 1.5 + Math.random() * 1.5,
    color: [BRAND.green, "#046538", STATUS.info, "#A78BFA", "#F59E0B", "#FFF"][i % 6],
    size: 4 + Math.random() * 6,
    rotation: Math.random() * 360,
  }));

  return (
    <motion.div
      className="absolute inset-0 z-50 flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Confetti */}
      {particles.map(p => (
        <motion.div
          key={p.id}
          className="absolute rounded-sm"
          style={{
            width: p.size,
            height: p.size * 0.6,
            background: p.color,
            left: `${p.x}%`,
            top: "-5%",
          }}
          initial={{ y: 0, rotate: 0, opacity: 1 }}
          animate={{
            y: [0, window.innerHeight * 1.2],
            rotate: [0, p.rotation + 720],
            opacity: [1, 1, 0],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            ease: "easeIn",
          }}
        />
      ))}

      {/* Center success card */}
      <motion.div
        className="relative z-10 text-center px-10 py-8 rounded-2xl"
        style={{
          background: t.overlay,
          border: `1px solid ${BRAND.green}30`,
          boxShadow: `0 0 80px ${BRAND.green}15, 0 8px 32px rgba(0,0,0,0.2)`,
          backdropFilter: "blur(20px)",
        }}
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.3, type: "spring", damping: 15 }}
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.5, type: "spring", damping: 12 }}
        >
          <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center" style={{ background: `${BRAND.green}15` }}>
            <CheckCircle2 size={32} style={{ color: BRAND.green }} />
          </div>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}>
          <h2 style={{ ...TY.h, fontSize: "24px", color: t.text, marginBottom: 8, letterSpacing: "-0.03em" }}>JET is Live</h2>
          <p style={{ ...TY.bodyR, fontSize: "13px", color: t.textMuted, marginBottom: 20, lineHeight: "1.5" }}>
            Your Command Center is active.<br />
            Riders can now request rides.
          </p>
          <button
            onClick={onDone}
            className="h-10 px-6 rounded-lg transition-colors"
            style={{ background: BRAND.green, color: "#FFF" }}
          >
            <span style={{ ...TY.body, fontSize: "13px" }}>Enter Command Center</span>
          </button>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   GHOSTED MAP BACKGROUND — progressively lights up
   ═══════════════════════════════════════════════════════════════════════════ */

function GhostedMap({ completed }: { completed: string[] }) {
  const { t, theme } = useAdminTheme();
  const isDark = theme === "dark";
  const zonesComplete = completed.includes("zones");
  const driversComplete = completed.includes("drivers");

  return (
    <div className="absolute inset-0 pointer-events-none">
      {/* Atmospheric background */}
      <div className="absolute inset-0" style={{ background: t.mapBg }}>
        <div className="absolute inset-0" style={{ background: `radial-gradient(ellipse at 35% 45%, ${t.mapGlow1} 0%, transparent 55%)` }} />
        <div className="absolute inset-0" style={{ background: `radial-gradient(ellipse at 75% 80%, ${t.mapGlow2} 0%, transparent 50%)` }} />
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(${t.mapGrid} 1px, transparent 1px)`,
          backgroundSize: "24px 24px",
          mixBlendMode: "overlay",
        }} />
      </div>

      {/* Nigeria outline */}
      <svg viewBox="0 0 500 420" className="absolute inset-0 w-full h-full" preserveAspectRatio="xMidYMid meet" style={{ opacity: 0.4 }}>
        <path
          d="M 60,55 Q 70,42 95,35 Q 140,25 180,22 Q 220,20 260,18 Q 300,16 340,22 Q 370,26 395,35 Q 415,42 430,55 Q 442,68 448,85 Q 452,100 455,120 Q 458,140 452,160 Q 448,175 440,188 Q 435,198 425,210 Q 418,220 410,235 Q 400,252 385,268 Q 370,282 352,295 Q 338,308 320,320 Q 305,330 290,342 Q 272,355 255,362 Q 238,370 220,375 Q 200,380 180,382 Q 165,384 150,378 Q 135,372 120,362 Q 108,354 98,342 Q 88,328 82,312 Q 76,296 72,280 Q 68,264 65,248 Q 62,232 58,215 Q 54,198 52,180 Q 50,162 48,142 Q 46,122 48,102 Q 50,82 55,68 Z"
          fill={t.mapOutlineFill}
          stroke={t.mapOutline}
          strokeWidth="1"
        />
        <path d="M 55,150 Q 100,160 150,180 Q 200,200 250,230 Q 280,248 310,270" fill="none" stroke={t.mapWater} strokeWidth="2" strokeLinecap="round" />
        <text x="120" y="60" fill={t.mapLabel} fontSize="7" fontFamily="var(--font-body)" fontWeight="500" letterSpacing="0.12em" opacity={0.5}>NORTH</text>
        <text x="250" y="340" fill={t.mapLabel} fontSize="7" fontFamily="var(--font-body)" fontWeight="500" letterSpacing="0.12em" opacity={0.5}>SOUTH</text>

        {/* Progressive zone pins — appear when zones step completes */}
        {zonesComplete && ZONE_MAP_POSITIONS.slice(0, 5).map((zone, i) => {
          const cx = zone.x * 5;
          const cy = zone.y * 4.2;
          return (
            <motion.g
              key={zone.name}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 0.5, scale: 1 }}
              transition={{ delay: 0.2 + i * 0.15, type: "spring", damping: 12 }}
              style={{ transformOrigin: `${cx}px ${cy}px` } as any}
            >
              <circle cx={cx} cy={cy} r={8} fill={BRAND.green} opacity={0.15} />
              <circle cx={cx} cy={cy} r={5} fill={BRAND.green} opacity={0.3} />
              <circle cx={cx} cy={cy} r={5} fill="none" stroke={BRAND.green} strokeWidth={0.8} opacity={0.5} />
            </motion.g>
          );
        })}

        {/* Driver activity dots — appear when drivers step completes */}
        {driversComplete && [
          { x: 180, y: 170 }, { x: 220, y: 200 }, { x: 260, y: 180 },
          { x: 300, y: 220 }, { x: 240, y: 240 },
        ].map((dot, i) => (
          <motion.circle
            key={`driver-${i}`}
            cx={dot.x}
            cy={dot.y}
            r={2.5}
            fill={BRAND.green}
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.2, 0.6, 0.2] }}
            transition={{ delay: 0.3 + i * 0.1, duration: 2, repeat: Infinity }}
          />
        ))}
      </svg>

      {/* Dim overlay */}
      <div className="absolute inset-0" style={{
        background: isDark
          ? `rgba(11,11,13,${completed.length >= 3 ? 0.6 : 0.75})`
          : `rgba(245,245,245,${completed.length >= 3 ? 0.6 : 0.75})`,
        transition: "background 0.8s ease",
      }} />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   STEP COMPLETION MICRO-CELEBRATION
   ═══════════════════════════════════════════════════════════════════════════ */

function StepSuccess({ step }: { step: SetupStep }) {
  const { t } = useAdminTheme();
  return (
    <motion.div
      className="flex flex-col items-center justify-center py-6"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "spring", damping: 15 }}
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", damping: 10, delay: 0.1 }}
      >
        <div className="w-12 h-12 rounded-full flex items-center justify-center mb-3" style={{ background: `${step.color}15` }}>
          <CheckCircle2 size={24} style={{ color: step.color }} />
        </div>
      </motion.div>
      <span style={{ ...TY.sub, fontSize: "14px", color: t.text, marginBottom: 4 }}>{step.label} configured</span>
      <span style={{ ...TY.bodyR, fontSize: "11px", color: t.textMuted }}>{step.unlocks.split("·")[0].trim()} is now active</span>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   MAIN ONBOARDING COMPONENT — FULL SCREEN FIXED OVERLAY
   ═══════════════════════════════════════════════════════════════════════════ */

export function CCv2Onboarding({ onGoActive }: { onGoActive?: () => void }) {
  const { t, theme } = useAdminTheme();
  const isDark = theme === "dark";

  const [activeStepIdx, setActiveStepIdx] = useState(0);
  const [completed, setCompleted] = useState<string[]>([]);
  const [justCompleted, setJustCompleted] = useState<string | null>(null);
  const [celebrating, setCelebrating] = useState(false);

  const activeStep = STEPS[activeStepIdx];
  const requiredSteps = STEPS.filter(s => s.required && s.id !== "launch");
  const requiredDone = requiredSteps.filter(s => completed.includes(s.id)).length;
  const totalRequired = requiredSteps.length;
  const progress = totalRequired > 0 ? (requiredDone / totalRequired) * 100 : 0;

  const handleStepComplete = useCallback((stepId: string) => {
    if (completed.includes(stepId)) return;
    setCompleted(prev => [...prev, stepId]);
    setJustCompleted(stepId);

    // Show micro-celebration for 1.5s then advance to next incomplete step
    setTimeout(() => {
      setJustCompleted(null);
      // Find next incomplete step
      const currentIdx = STEPS.findIndex(s => s.id === stepId);
      for (let i = 1; i < STEPS.length; i++) {
        const nextIdx = (currentIdx + i) % STEPS.length;
        if (!completed.includes(STEPS[nextIdx].id) && STEPS[nextIdx].id !== stepId) {
          setActiveStepIdx(nextIdx);
          break;
        }
      }
    }, 1500);
  }, [completed]);

  const handleSkip = useCallback((stepId: string) => {
    const currentIdx = STEPS.findIndex(s => s.id === stepId);
    for (let i = 1; i < STEPS.length; i++) {
      const nextIdx = (currentIdx + i) % STEPS.length;
      if (!completed.includes(STEPS[nextIdx].id)) {
        setActiveStepIdx(nextIdx);
        break;
      }
    }
  }, [completed]);

  const handleLaunch = useCallback(() => {
    setCelebrating(true);
  }, []);

  const handleCelebrationDone = useCallback(() => {
    setCelebrating(false);
    onGoActive?.();
  }, [onGoActive]);

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center" style={{ background: t.bg }}>
      {/* Ghosted map background — progressively lights up */}
      <GhostedMap completed={completed} />

      {/* Green ambient glows */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px]" style={{
          background: `radial-gradient(ellipse, ${BRAND.green}06 0%, transparent 70%)`,
        }} />
        <div className="absolute top-0 right-0 w-[400px] h-[400px]" style={{
          background: `radial-gradient(ellipse, ${BRAND.green}04 0%, transparent 70%)`,
        }} />
      </div>

      {/* Celebration overlay */}
      <AnimatePresence>
        {celebrating && <CelebrationOverlay onDone={handleCelebrationDone} />}
      </AnimatePresence>

      {/* Main setup card — centered */}
      {!celebrating && (
        <motion.div
          className="relative z-10 w-full max-w-[780px] mx-4 rounded-2xl overflow-hidden flex flex-col"
          style={{
            background: isDark ? "rgba(18,18,22,0.95)" : "rgba(255,255,255,0.97)",
            border: `1px solid ${isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)"}`,
            boxShadow: isDark
              ? "0 24px 80px rgba(0,0,0,0.5), 0 0 1px rgba(255,255,255,0.1)"
              : "0 24px 80px rgba(0,0,0,0.12), 0 0 1px rgba(0,0,0,0.05)",
            backdropFilter: "blur(40px)",
            maxHeight: "85vh",
          }}
          initial={{ opacity: 0, y: 20, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, ease: [0.19, 1, 0.22, 1] }}
        >
          {/* Card header */}
          <div className="flex items-center justify-between px-6 py-4 shrink-0" style={{
            borderBottom: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}`,
          }}>
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: `${BRAND.green}12` }}>
                <Globe size={14} style={{ color: BRAND.green }} />
              </div>
              <div>
                <span style={{ ...TY.sub, fontSize: "14px", color: t.text }}>Set up JET</span>
                <span className="block" style={{ ...TY.bodyR, fontSize: "10px", color: t.textMuted }}>Configure your e-hailing platform</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span style={{ ...TY.cap, fontSize: "9px", color: BRAND.green }}>{requiredDone}/{totalRequired} required</span>
            </div>
          </div>

          {/* Card body: left steps + right content */}
          <div className="flex flex-1 min-h-0 overflow-hidden">
            {/* Left — step navigation */}
            <div className="w-[220px] shrink-0 py-4 px-3 overflow-y-auto" style={{
              borderRight: `1px solid ${isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"}`,
            }}>
              <div className="space-y-1">
                {STEPS.map((step, i) => {
                  const done = completed.includes(step.id);
                  const active = i === activeStepIdx;

                  return (
                    <button
                      key={step.id}
                      onClick={() => setActiveStepIdx(i)}
                      className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg transition-all text-left"
                      style={{
                        background: active
                          ? isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.04)"
                          : "transparent",
                        border: active
                          ? `1px solid ${step.color}25`
                          : "1px solid transparent",
                      }}
                    >
                      {/* Step indicator */}
                      {done ? (
                        <CheckCircle2 size={16} style={{ color: step.color, flexShrink: 0 }} />
                      ) : (
                        <div className="w-4 h-4 rounded-full flex items-center justify-center shrink-0" style={{
                          border: `1.5px solid ${active ? step.color : t.textFaint}`,
                          background: active ? `${step.color}10` : "transparent",
                        }}>
                          <span style={{ ...TY.cap, fontSize: "7px", color: active ? step.color : t.textFaint }}>{i + 1}</span>
                        </div>
                      )}

                      <div className="min-w-0">
                        <span className="block truncate" style={{
                          ...TY.body, fontSize: "12px",
                          color: done ? step.color : active ? t.text : t.textMuted,
                        }}>
                          {step.label}
                        </span>
                        {!step.required && (
                          <span style={{ ...TY.cap, fontSize: "8px", color: t.textFaint }}>Optional</span>
                        )}
                      </div>

                      {active && !done && (
                        <ChevronRight size={10} style={{ color: t.textFaint, marginLeft: "auto", flexShrink: 0 }} />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Right — action area */}
            <div className="flex-1 min-w-0 p-6 overflow-y-auto">
              <AnimatePresence mode="wait">
                {justCompleted ? (
                  <StepSuccess key={`success-${justCompleted}`} step={STEPS.find(s => s.id === justCompleted)!} />
                ) : (
                  <motion.div
                    key={activeStep.id}
                    initial={{ opacity: 0, x: 12 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -12 }}
                    transition={{ duration: 0.25 }}
                  >
                    {/* Step header */}
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${activeStep.color}12` }}>
                        <activeStep.icon size={16} style={{ color: activeStep.color }} />
                      </div>
                      <div>
                        <h3 style={{ ...TY.sub, fontSize: "16px", color: t.text, letterSpacing: "-0.02em" }}>{activeStep.label}</h3>
                      </div>
                    </div>
                    <p style={{ ...TY.bodyR, fontSize: "12px", color: t.textMuted, marginBottom: 20, lineHeight: "1.5" }}>
                      {activeStep.desc}
                    </p>

                    {/* Unlocks preview */}
                    <div className="mb-5 p-3 rounded-lg" style={{
                      background: isDark ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.015)",
                      border: `1px solid ${isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)"}`,
                    }}>
                      <span style={{ ...TY.label, fontSize: "8px", color: t.textFaint, letterSpacing: "0.08em" }}>UNLOCKS ON COMMAND CENTER</span>
                      <p style={{ ...TY.bodyR, fontSize: "11px", color: t.textSecondary, marginTop: 4 }}>{activeStep.unlocks}</p>
                    </div>

                    {/* Step-specific form */}
                    {completed.includes(activeStep.id) ? (
                      <div className="flex items-center gap-3 py-4">
                        <CheckCircle2 size={18} style={{ color: activeStep.color }} />
                        <span style={{ ...TY.body, fontSize: "13px", color: activeStep.color }}>Completed</span>
                      </div>
                    ) : (
                      <>
                        {activeStep.id === "zones" && <ZoneForm onComplete={() => handleStepComplete("zones")} />}
                        {activeStep.id === "drivers" && <DriverForm onComplete={() => handleStepComplete("drivers")} />}
                        {activeStep.id === "hotels" && <HotelForm onComplete={() => handleStepComplete("hotels")} onSkip={() => handleSkip("hotels")} />}
                        {activeStep.id === "fleet" && <FleetForm onComplete={() => handleStepComplete("fleet")} onSkip={() => handleSkip("fleet")} />}
                        {activeStep.id === "launch" && <LaunchForm completed={completed} onLaunch={handleLaunch} />}
                      </>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Bottom — progress bar */}
          <div className="shrink-0 px-6 py-3" style={{
            borderTop: `1px solid ${isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"}`,
          }}>
            <div className="flex items-center gap-3">
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span style={{ ...TY.body, fontSize: "10px", color: t.textMuted }}>
                    {requiredDone} of {totalRequired} required
                  </span>
                  {requiredDone === totalRequired && (
                    <span style={{ ...TY.cap, fontSize: "9px", color: BRAND.green }}>Ready to launch</span>
                  )}
                </div>
                <div className="h-1.5 rounded-full overflow-hidden" style={{
                  background: isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)",
                }}>
                  <motion.div
                    className="h-full rounded-full"
                    style={{ background: BRAND.green }}
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                  />
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
