/**
 * JET ADMIN — COMMAND CENTER ONBOARDING (3 Variations)
 *
 * The journey from "platform just created" → "live operations."
 * Each variation explores a different approach to the same problem:
 *
 *   A "Mission Brief" — Stripe/Vercel-style sequential wizard.
 *     Focused, one-step-at-a-time. The CC is hidden until setup is done.
 *     Inspiration: Stripe Atlas, Vercel project setup, Railway onboarding
 *
 *   B "Launch Sequence" — Map-centric progressive reveal.
 *     The CC layout is already visible but dormant. Steps illuminate the map.
 *     Inspiration: Uber city launcher, SpaceX mission control, Mapbox Studio
 *
 *   C "Control Room" — Dashboard skeleton with power-up activation.
 *     Every CC element exists as a skeleton. Steps activate sections.
 *     Inspiration: Linear empty project, Datadog first integration, Grafana
 *
 * Design Lab toggle switches between A/B/C in real time.
 */

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  MapPin, Car, Building2, Users, Rocket,
  CheckCircle2, Circle,
  ArrowRight, Zap, Globe, Shield,
  Activity, Wallet, Radio,
  Clock, Eye,
  TrendingUp,
} from "lucide-react";
import { useAdminTheme, TY, BRAND, STATUS } from "../../config/admin-theme";
import { ThemeToggle } from "./ui/primitives";
import { formatNaira } from "../../config/admin-mock-data";

/* ═══════════════════════════════════════════════════════════════════════════
   SHARED — Setup steps (data model is the same across all variations)
   ═══════════════════════════════════════════════════════════════════════════ */

export interface SetupStep {
  id: string;
  label: string;
  shortLabel: string;
  desc: string;
  icon: typeof MapPin;
  color: string;
  required: boolean;
  unlocks: string[];
  /** What metric appears when this step completes */
  metric?: { label: string; value: string };
}

export const SETUP_STEPS: SetupStep[] = [
  {
    id: "zones",
    label: "Configure service zones",
    shortLabel: "Zones",
    desc: "Define geographic boundaries, set pricing tiers and surge multipliers for each zone.",
    icon: MapPin,
    color: BRAND.green,
    required: true,
    unlocks: ["Map zone boundaries", "Zone drill-down", "Pricing controls"],
    metric: { label: "Zones", value: "4" },
  },
  {
    id: "drivers",
    label: "Onboard drivers",
    shortLabel: "Drivers",
    desc: "Invite drivers or approve applications. They flow through verification before going live.",
    icon: Car,
    color: BRAND.green,
    required: true,
    unlocks: ["Driver pins on map", "Supply metrics", "Verification pipeline"],
    metric: { label: "Drivers", value: "0" },
  },
  {
    id: "hotels",
    label: "Connect hotel partners",
    shortLabel: "Hotels",
    desc: "Invite hotels for guest pickup integration. Each gets a branded concierge booking portal.",
    icon: Building2,
    color: STATUS.info,
    required: false,
    unlocks: ["Hotel pins", "Guest ride metrics", "Hotel revenue"],
    metric: { label: "Hotels", value: "0" },
  },
  {
    id: "fleet",
    label: "Add fleet partners",
    shortLabel: "Fleet",
    desc: "Onboard fleet operators managing multiple vehicles. They get their own dashboard.",
    icon: Users,
    color: "#F59E0B",
    required: false,
    unlocks: ["Fleet overlay", "Utilization metrics", "Fleet payouts"],
    metric: { label: "Fleet", value: "0" },
  },
  {
    id: "launch",
    label: "Go live",
    shortLabel: "Launch",
    desc: "Open the rider app. Riders sign up, request rides, and the Command Center comes alive.",
    icon: Rocket,
    color: "#A78BFA",
    required: true,
    unlocks: ["Live rides", "Revenue stream", "Action queue", "Demand heatmap"],
    metric: { label: "Status", value: "Live" },
  },
];

/* ═══════════════════════════════════════════════════════════════════════════
   SHARED — Data source legend
   ═══════════════════════════════════════════════════════════════════════════ */

const DATA_FLOW = [
  { source: "Riders", how: "Sign up via mobile app", dest: "Rider pool", color: "#8B5CF6" },
  { source: "Drivers", how: "Admin invite or self-apply", dest: "Verification pipeline", color: BRAND.green },
  { source: "Hotels", how: "Admin creates partnership", dest: "Hotel portal", color: STATUS.info },
  { source: "Fleet", how: "Admin onboards owner", dest: "Fleet dashboard", color: "#F59E0B" },
  { source: "Rides", how: "Rider request → Driver accept", dest: "Command Center metrics", color: STATUS.warning },
];

/* ═══════════════════════════════════════════════════════════════════════════
   VARIATION A — "Mission Brief"
   
   Sequential wizard. One focused step at a time.
   Stripe Atlas setup flow meets Vercel's deployment wizard.
   The Command Center is entirely replaced until setup completes.
   ═══════════════════════════════════════════════════════════════════════════ */

function VariationA({ completed, onToggleStep }: { completed: string[]; onToggleStep: (id: string) => void }) {
  const { theme, t } = useAdminTheme();
  const isDark = theme === "dark";
  const [activeStep, setActiveStep] = useState(0);

  const requiredDone = SETUP_STEPS.filter(s => s.required && completed.includes(s.id)).length;
  const totalRequired = SETUP_STEPS.filter(s => s.required).length;

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* ─── Step indicator (horizontal) ─── */}
      <div
        className="flex items-center gap-0 px-6 py-4 shrink-0 overflow-x-auto scrollbar-hide"
        style={{ borderBottom: `1px solid ${t.border}` }}
      >
        {SETUP_STEPS.map((step, i) => {
          const done = completed.includes(step.id);
          const active = i === activeStep;
          return (
            <div key={step.id} className="flex items-center">
              <button
                onClick={() => setActiveStep(i)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors"
                style={{
                  background: active ? (isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.03)") : "transparent",
                  minHeight: 36,
                }}
              >
                {done ? (
                  <CheckCircle2 size={14} style={{ color: BRAND.green }} />
                ) : (
                  <div
                    className="w-5 h-5 rounded-full flex items-center justify-center"
                    style={{
                      background: active ? step.color : "transparent",
                      border: `1.5px solid ${active ? step.color : isDark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.1)"}`,
                    }}
                  >
                    <span style={{
                      fontFamily: "'Manrope', sans-serif", fontWeight: 600,
                      fontSize: "9px", color: active ? "#fff" : t.textFaint,
                    }}>
                      {i + 1}
                    </span>
                  </div>
                )}
                <span style={{
                  fontFamily: "'Manrope', sans-serif", fontWeight: active ? 600 : 500,
                  fontSize: "12px", letterSpacing: "-0.02em",
                  color: active ? t.text : done ? t.textMuted : t.textFaint,
                }}>
                  {step.shortLabel}
                </span>
                {!step.required && (
                  <span style={{
                    fontFamily: "'Manrope', sans-serif", fontWeight: 400,
                    fontSize: "9px", color: t.textGhost,
                  }}>opt</span>
                )}
              </button>
              {i < SETUP_STEPS.length - 1 && (
                <div
                  className="w-6 h-px shrink-0"
                  style={{ background: done ? BRAND.green : isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)" }}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* ─── Active step content ─── */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-12 overflow-y-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeStep}
            className="w-full"
            style={{ maxWidth: 540 }}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          >
            {(() => {
              const step = SETUP_STEPS[activeStep];
              const done = completed.includes(step.id);
              return (
                <>
                  {/* Step icon */}
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6"
                    style={{
                      background: `${step.color}${isDark ? "12" : "08"}`,
                      border: `1px solid ${step.color}${isDark ? "20" : "15"}`,
                    }}
                  >
                    <step.icon size={22} style={{ color: step.color }} />
                  </div>

                  {/* Title + desc */}
                  <h2 style={{
                    ...TY.h, fontSize: "22px", color: t.text, margin: 0,
                  }}>
                    {step.label}
                  </h2>
                  <p style={{
                    ...TY.bodyR, fontSize: "14px", color: t.textMuted,
                    margin: 0, marginTop: 8, maxWidth: 440, lineHeight: "1.6",
                  }}>
                    {step.desc}
                  </p>

                  {/* What this unlocks */}
                  <div
                    className="mt-6 rounded-xl p-4"
                    style={{
                      background: isDark ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.015)",
                      border: `1px solid ${isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.03)"}`,
                    }}
                  >
                    <div className="flex items-center gap-1.5 mb-3">
                      <Zap size={10} style={{ color: step.color }} />
                      <span style={{
                        ...TY.label, fontSize: "9px", color: t.textFaint,
                      }}>This step unlocks</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {step.unlocks.map(u => (
                        <span
                          key={u}
                          className="px-2.5 py-1 rounded-lg"
                          style={{
                            fontFamily: "'Manrope', sans-serif", fontWeight: 500,
                            fontSize: "11px", letterSpacing: "-0.02em",
                            color: done ? BRAND.green : t.textMuted,
                            background: done
                              ? `${BRAND.green}${isDark ? "10" : "08"}`
                              : isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)",
                            border: `1px solid ${done
                              ? `${BRAND.green}${isDark ? "20" : "15"}`
                              : isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.03)"
                            }`,
                          }}
                        >
                          {done && "✓ "}{u}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Action */}
                  <div className="mt-8 flex items-center gap-3">
                    <button
                      onClick={() => {
                        onToggleStep(step.id);
                        if (!done && activeStep < SETUP_STEPS.length - 1) {
                          setTimeout(() => setActiveStep(activeStep + 1), 300);
                        }
                      }}
                      className="h-11 px-6 rounded-xl flex items-center gap-2 transition-opacity hover:opacity-90"
                      style={{
                        background: done ? isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.03)" : step.color,
                        border: done ? `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)"}` : "none",
                        minHeight: 44,
                      }}
                    >
                      <span style={{
                        fontFamily: "'Manrope', sans-serif", fontWeight: 600,
                        fontSize: "13px", letterSpacing: "-0.02em",
                        color: done ? t.textMuted : "#FFFFFF",
                      }}>
                        {done ? "Undo" : step.id === "launch" ? "Launch platform" : `Set up ${step.shortLabel.toLowerCase()}`}
                      </span>
                      {!done && <ArrowRight size={14} style={{ color: "#FFFFFF" }} />}
                    </button>

                    {!step.required && !done && (
                      <button
                        onClick={() => {
                          if (activeStep < SETUP_STEPS.length - 1) setActiveStep(activeStep + 1);
                        }}
                        className="h-11 px-4 rounded-xl transition-colors"
                        style={{
                          background: isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)",
                          border: `1px solid ${isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.03)"}`,
                          minHeight: 44,
                        }}
                      >
                        <span style={{
                          fontFamily: "'Manrope', sans-serif", fontWeight: 500,
                          fontSize: "12px", letterSpacing: "-0.02em", color: t.textMuted,
                        }}>
                          Skip for now
                        </span>
                      </button>
                    )}
                  </div>

                  {/* Progress */}
                  <div className="mt-10 flex items-center gap-2">
                    <span style={{
                      fontFamily: "'Manrope', sans-serif", fontWeight: 400,
                      fontSize: "11px", letterSpacing: "-0.02em", color: t.textFaint,
                    }}>
                      {requiredDone} of {totalRequired} required steps complete
                    </span>
                    <div
                      className="flex-1 h-1 rounded-full overflow-hidden"
                      style={{ background: isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)", maxWidth: 120 }}
                    >
                      <motion.div
                        className="h-full rounded-full"
                        style={{ background: BRAND.green }}
                        animate={{ width: `${(requiredDone / totalRequired) * 100}%` }}
                        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                      />
                    </div>
                  </div>
                </>
              );
            })()}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}


/* ═══════════════════════════════════════════════════════════════════════════
   VARIATION B — "Launch Sequence"
   
   Map-centric. The CC layout is already visible — the map is the hero.
   A floating checklist card sits over the map (like Google Maps info cards).
   As steps complete, the map progressively illuminates.
   
   Uber city launcher × Apple Maps first-run × SpaceX mission control
   ═══════════════════════════════════════════════════════════════════════════ */

function VariationB({ completed, onToggleStep }: { completed: string[]; onToggleStep: (id: string) => void }) {
  const { theme, t } = useAdminTheme();
  const isDark = theme === "dark";

  const hasZones = completed.includes("zones");
  const hasDrivers = completed.includes("drivers");
  const hasHotels = completed.includes("hotels");
  const hasFleet = completed.includes("fleet");
  const isLive = completed.includes("launch");

  const requiredDone = SETUP_STEPS.filter(s => s.required && completed.includes(s.id)).length;
  const totalRequired = SETUP_STEPS.filter(s => s.required).length;

  // Simulated KPI values based on what's activated
  const kpis = [
    { label: "Zones", value: hasZones ? "4" : "—", active: hasZones, icon: MapPin, color: BRAND.green },
    { label: "Drivers", value: hasDrivers ? "12" : "—", active: hasDrivers, icon: Car, color: BRAND.green },
    { label: "Rides", value: isLive ? "34" : "—", active: isLive, icon: Activity, color: STATUS.warning },
    { label: "Revenue", value: isLive ? formatNaira(127400) : "—", active: isLive, icon: Wallet, color: "#A78BFA" },
  ];

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* ─── KPI Strip (dormant → active) ─── */}
      <div
        className="flex items-stretch shrink-0 overflow-x-auto scrollbar-hide"
        style={{ background: t.overlay, borderBottom: `1px solid ${t.border}` }}
      >
        {kpis.map((kpi, i) => (
          <motion.div
            key={kpi.label}
            className="flex items-center gap-2 px-5 py-3 shrink-0"
            style={{
              borderRight: i < kpis.length - 1 ? `1px solid ${t.border}` : "none",
              opacity: kpi.active ? 1 : 0.35,
            }}
            animate={{ opacity: kpi.active ? 1 : 0.35 }}
            transition={{ duration: 0.4 }}
          >
            <kpi.icon size={13} style={{ color: kpi.active ? kpi.color : t.textGhost }} />
            <div>
              <span style={{
                ...TY.cap, fontSize: "9px", color: t.textFaint,
                display: "block",
              }}>{kpi.label}</span>
              <motion.span
                style={{
                  ...TY.sub, fontSize: "15px",
                  color: kpi.active ? t.text : t.textGhost,
                  display: "block",
                }}
                key={kpi.value}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {kpi.value}
              </motion.span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* ─── Map + floating card ─── */}
      <div className="flex-1 relative min-h-0">
        {/* Atmospheric map background */}
        <div className="absolute inset-0" style={{ background: t.mapBg }}>
          <div className="absolute inset-0" style={{ background: `radial-gradient(ellipse at 35% 45%, ${t.mapGlow1} 0%, transparent 55%)` }} />
          <div className="absolute inset-0" style={{ background: `radial-gradient(ellipse at 75% 80%, ${t.mapGlow2} 0%, transparent 50%)` }} />
          {/* Grid */}
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(${t.mapGrid} 1px, transparent 1px)`,
            backgroundSize: "24px 24px", mixBlendMode: "overlay",
          }} />
        </div>

        {/* Map SVG — Nigeria outline */}
        <svg
          viewBox="0 0 500 420"
          className="absolute inset-0 w-full h-full"
          preserveAspectRatio="xMidYMid meet"
        >
          <g>
            {/* Nigeria outline */}
            <motion.path
              d="M 60,55 Q 70,42 95,35 Q 140,25 180,22 Q 220,20 260,18 Q 300,16 340,22 Q 370,26 395,35 Q 415,42 430,55 Q 442,68 448,85 Q 452,100 455,120 Q 458,140 452,160 Q 448,175 440,188 Q 435,198 425,210 Q 418,220 410,235 Q 400,252 385,268 Q 370,282 352,295 Q 338,308 320,320 Q 305,330 290,342 Q 272,355 255,362 Q 238,370 220,375 Q 200,380 180,382 Q 165,384 150,378 Q 135,372 120,362 Q 108,354 98,342 Q 88,328 82,312 Q 76,296 72,280 Q 68,264 65,248 Q 62,232 58,215 Q 54,198 52,180 Q 50,162 48,142 Q 46,122 48,102 Q 50,82 55,68 Z"
              fill={t.mapOutlineFill}
              stroke={t.mapOutline}
              strokeWidth="1"
              initial={{ opacity: 0.3 }}
              animate={{ opacity: hasZones ? 1 : 0.3 }}
              transition={{ duration: 0.8 }}
            />

            {/* Zone highlights — appear when zones are configured */}
            {hasZones && (
              <>
                {[
                  { cx: 180, cy: 330, name: "Island" },
                  { cx: 140, cy: 290, name: "Mainland" },
                  { cx: 230, cy: 310, name: "Lekki" },
                  { cx: 110, cy: 260, name: "Ikeja" },
                ].map((zone, i) => (
                  <motion.g key={zone.name} initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.1, duration: 0.4 }}>
                    <circle cx={zone.cx} cy={zone.cy} r="18" fill={`${BRAND.green}08`} stroke={`${BRAND.green}30`} strokeWidth="0.5" />
                    <circle cx={zone.cx} cy={zone.cy} r="3" fill={BRAND.green} opacity={0.6} />
                    <text x={zone.cx} y={zone.cy - 22} textAnchor="middle" fill={t.textFaint} fontSize="7" fontFamily="var(--font-body)" fontWeight="500" letterSpacing="-0.02em">{zone.name}</text>
                  </motion.g>
                ))}
              </>
            )}

            {/* Driver pins — appear when drivers are onboarded */}
            {hasDrivers && hasZones && (
              <>
                {[
                  { cx: 170, cy: 340 }, { cx: 195, cy: 325 },
                  { cx: 135, cy: 285 }, { cx: 155, cy: 295 },
                  { cx: 225, cy: 305 }, { cx: 115, cy: 255 },
                ].map((pin, i) => (
                  <motion.g key={i} initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 + i * 0.06, duration: 0.3 }}>
                    <circle cx={pin.cx} cy={pin.cy} r="4" fill={BRAND.green} opacity={0.9} />
                    <circle cx={pin.cx} cy={pin.cy} r="7" fill="none" stroke={BRAND.green} strokeWidth="0.5" opacity={0.3} />
                  </motion.g>
                ))}
              </>
            )}

            {/* Hotel pins */}
            {hasHotels && hasZones && (
              <>
                {[{ cx: 200, cy: 320 }, { cx: 160, cy: 300 }].map((pin, i) => (
                  <motion.g key={`h${i}`} initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.5 + i * 0.1, duration: 0.3 }}>
                    <rect x={pin.cx - 5} y={pin.cy - 5} width="10" height="10" rx="3" fill={STATUS.info} opacity={0.9} />
                    <text x={pin.cx} y={pin.cy + 3} textAnchor="middle" fill="#fff" fontSize="6" fontWeight="600">H</text>
                  </motion.g>
                ))}
              </>
            )}

            {/* Fleet pins */}
            {hasFleet && hasZones && (
              <>
                {[{ cx: 130, cy: 270 }].map((pin, i) => (
                  <motion.g key={`f${i}`} initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.6, duration: 0.3 }}>
                    <rect x={pin.cx - 5} y={pin.cy - 5} width="10" height="10" rx="3" fill="#F59E0B" opacity={0.9} />
                    <text x={pin.cx} y={pin.cy + 3} textAnchor="middle" fill="#fff" fontSize="6" fontWeight="600">F</text>
                  </motion.g>
                ))}
              </>
            )}

            {/* Live ride lines — pulsing when launched */}
            {isLive && hasZones && (
              <>
                {[
                  { x1: 140, y1: 290, x2: 180, y2: 330 },
                  { x1: 230, y1: 310, x2: 180, y2: 330 },
                  { x1: 110, y1: 260, x2: 140, y2: 290 },
                ].map((line, i) => (
                  <motion.line
                    key={`r${i}`}
                    x1={line.x1} y1={line.y1} x2={line.x2} y2={line.y2}
                    stroke={BRAND.green} strokeWidth="1" strokeDasharray="4 3"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0.2, 0.6, 0.2] }}
                    transition={{ duration: 2, repeat: Infinity, delay: i * 0.4 }}
                  />
                ))}
              </>
            )}
          </g>
        </svg>

        {/* ─── Floating launch checklist (Google Maps info-card style) ─── */}
        <motion.div
          className="absolute bottom-4 left-4 md:bottom-6 md:left-6 rounded-2xl overflow-hidden"
          style={{
            width: 320,
            maxWidth: "calc(100vw - 32px)",
            background: isDark ? "rgba(12,12,14,0.92)" : "rgba(255,255,255,0.97)",
            backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
            border: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}`,
            boxShadow: isDark
              ? "0 16px 48px rgba(0,0,0,0.5)"
              : "0 16px 48px rgba(0,0,0,0.08), 0 0 0 1px rgba(0,0,0,0.03)",
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Header */}
          <div className="px-5 pt-4 pb-3">
            <div className="flex items-center justify-between">
              <h3 style={{ ...TY.sub, fontSize: "13px", color: t.text, margin: 0 }}>
                Launch checklist
              </h3>
              <span style={{
                fontFamily: "'Manrope', sans-serif", fontWeight: 500,
                fontSize: "10px", letterSpacing: "-0.01em", color: t.textFaint,
              }}>
                {requiredDone}/{totalRequired} required
              </span>
            </div>
            {/* Progress bar */}
            <div
              className="h-1 rounded-full overflow-hidden mt-2.5"
              style={{ background: isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)" }}
            >
              <motion.div
                className="h-full rounded-full"
                style={{ background: BRAND.green }}
                animate={{ width: `${(requiredDone / totalRequired) * 100}%` }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              />
            </div>
          </div>

          {/* Steps */}
          <div className="px-3 pb-3">
            {SETUP_STEPS.map((step, i) => {
              const done = completed.includes(step.id);
              return (
                <button
                  key={step.id}
                  onClick={() => onToggleStep(step.id)}
                  className="w-full flex items-center gap-3 px-2 py-2 rounded-lg transition-colors"
                  style={{ minHeight: 40 }}
                  onMouseEnter={e => { e.currentTarget.style.background = isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "transparent"; }}
                >
                  {done ? (
                    <CheckCircle2 size={14} style={{ color: BRAND.green }} />
                  ) : (
                    <Circle size={14} style={{ color: isDark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.1)" }} />
                  )}
                  <step.icon size={12} style={{ color: done ? t.textFaint : step.color, opacity: done ? 0.5 : 0.8 }} />
                  <span style={{
                    fontFamily: "'Manrope', sans-serif", fontWeight: 500,
                    fontSize: "12px", letterSpacing: "-0.02em",
                    color: done ? t.textMuted : t.text,
                    textDecoration: done ? "line-through" : "none",
                    flex: 1, textAlign: "left",
                  }}>
                    {step.label}
                  </span>
                  {!step.required && (
                    <span style={{
                      fontFamily: "'Manrope', sans-serif", fontWeight: 400,
                      fontSize: "9px", color: t.textGhost,
                    }}>opt</span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Data source hint */}
          <div className="px-5 pb-4 pt-1" style={{ borderTop: `1px solid ${isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.03)"}` }}>
            <span style={{
              fontFamily: "'Manrope', sans-serif", fontWeight: 400,
              fontSize: "10px", letterSpacing: "-0.01em", color: t.textFaint,
            }}>
              Minimum: zones + 1 verified driver
            </span>
          </div>
        </motion.div>

        {/* ─── Status badge (top-right) ─── */}
        <motion.div
          className="absolute top-4 right-4 md:top-6 md:right-6 flex items-center gap-2 px-3 py-2 rounded-xl"
          style={{
            background: isDark ? "rgba(12,12,14,0.85)" : "rgba(255,255,255,0.92)",
            backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)",
            border: `1px solid ${isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)"}`,
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <div
            className="w-2 h-2 rounded-full"
            style={{ background: isLive ? BRAND.green : isDark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.12)" }}
          />
          <span style={{
            fontFamily: "'Manrope', sans-serif", fontWeight: 500,
            fontSize: "11px", letterSpacing: "-0.02em",
            color: isLive ? BRAND.green : t.textFaint,
          }}>
            {isLive ? "Platform live" : "Setup mode"}
          </span>
        </motion.div>
      </div>
    </div>
  );
}


/* ═══════════════════════════════════════════════════════════════════════════
   VARIATION C — "Control Room"
   
   The full CC layout is visible as a skeleton. Each completed step
   "activates" a section — skeleton → populated with a subtle green pulse.
   
   Linear empty project × Datadog first-integration × Grafana new dashboard
   ═══════════════════════════════════════════════════════════════════════════ */

function SkeletonBar({ w, h = 8, style }: { w: number | string; h?: number; style?: React.CSSProperties }) {
  const { theme } = useAdminTheme();
  return (
    <div
      className="rounded-full"
      style={{
        width: typeof w === "number" ? w : w,
        height: h,
        background: theme === "dark" ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)",
        ...style,
      }}
    />
  );
}

function SkeletonKPI({ label, active, value, icon: Icon, color }: {
  label: string; active: boolean; value: string; icon: typeof Activity; color: string;
}) {
  const { theme, t } = useAdminTheme();
  const isDark = theme === "dark";
  return (
    <motion.div
      className="flex items-center gap-2.5 px-4 py-3 shrink-0"
      style={{ opacity: active ? 1 : 0.3 }}
      animate={{ opacity: active ? 1 : 0.3 }}
      transition={{ duration: 0.5 }}
    >
      <div
        className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
        style={{
          background: active ? `${color}${isDark ? "10" : "08"}` : isDark ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.015)",
          border: `1px solid ${active ? `${color}20` : isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)"}`,
        }}
      >
        <Icon size={13} style={{ color: active ? color : t.textGhost }} />
      </div>
      <div>
        <span style={{ ...TY.cap, fontSize: "9px", color: t.textFaint, display: "block" }}>{label}</span>
        {active ? (
          <motion.span
            style={{ ...TY.sub, fontSize: "14px", color: t.text, display: "block" }}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {value}
          </motion.span>
        ) : (
          <SkeletonBar w={48} h={12} style={{ marginTop: 3 }} />
        )}
      </div>
    </motion.div>
  );
}

function VariationC({ completed, onToggleStep }: { completed: string[]; onToggleStep: (id: string) => void }) {
  const { theme, t } = useAdminTheme();
  const isDark = theme === "dark";

  const hasZones = completed.includes("zones");
  const hasDrivers = completed.includes("drivers");
  const hasHotels = completed.includes("hotels");
  const isLive = completed.includes("launch");

  const requiredDone = SETUP_STEPS.filter(s => s.required && completed.includes(s.id)).length;
  const totalRequired = SETUP_STEPS.filter(s => s.required).length;

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* ─── KPI Strip (skeleton → active) ─── */}
      <div
        className="flex items-stretch shrink-0 overflow-x-auto scrollbar-hide"
        style={{ background: t.overlay, borderBottom: `1px solid ${t.border}` }}
      >
        <SkeletonKPI label="Active Zones" active={hasZones} value="4 zones" icon={MapPin} color={BRAND.green} />
        <div style={{ width: 1, background: t.border }} />
        <SkeletonKPI label="Drivers Online" active={hasDrivers} value="12 online" icon={Car} color={BRAND.green} />
        <div style={{ width: 1, background: t.border }} />
        <SkeletonKPI label="Live Rides" active={isLive} value="34 active" icon={Activity} color={STATUS.warning} />
        <div style={{ width: 1, background: t.border }} />
        <SkeletonKPI label="Today's Revenue" active={isLive} value={formatNaira(127400)} icon={Wallet} color="#A78BFA" />
        <div style={{ width: 1, background: t.border }} />
        <SkeletonKPI label="Match Rate" active={isLive} value="94%" icon={TrendingUp} color={BRAND.green} />
        <div style={{ width: 1, background: t.border }} />
        <SkeletonKPI label="Avg Wait" active={isLive} value="2.4m" icon={Clock} color={STATUS.warning} />
      </div>

      {/* ─── Main area: Map + Panel ─── */}
      <div className="flex-1 flex min-h-0">
        {/* Left: Map (skeleton or alive) */}
        <div className="flex-1 relative min-w-0">
          {/* Atmospheric background */}
          <div className="absolute inset-0" style={{ background: t.mapBg }}>
            <div className="absolute inset-0" style={{ background: `radial-gradient(ellipse at 35% 45%, ${t.mapGlow1} 0%, transparent 55%)` }} />
            <div className="absolute inset-0" style={{
              backgroundImage: `radial-gradient(${t.mapGrid} 1px, transparent 1px)`,
              backgroundSize: "24px 24px", mixBlendMode: "overlay",
            }} />
          </div>

          {/* Map SVG */}
          <svg viewBox="0 0 500 420" className="absolute inset-0 w-full h-full" preserveAspectRatio="xMidYMid meet">
            <motion.path
              d="M 60,55 Q 70,42 95,35 Q 140,25 180,22 Q 220,20 260,18 Q 300,16 340,22 Q 370,26 395,35 Q 415,42 430,55 Q 442,68 448,85 Q 452,100 455,120 Q 458,140 452,160 Q 448,175 440,188 Q 435,198 425,210 Q 418,220 410,235 Q 400,252 385,268 Q 370,282 352,295 Q 338,308 320,320 Q 305,330 290,342 Q 272,355 255,362 Q 238,370 220,375 Q 200,380 180,382 Q 165,384 150,378 Q 135,372 120,362 Q 108,354 98,342 Q 88,328 82,312 Q 76,296 72,280 Q 68,264 65,248 Q 62,232 58,215 Q 54,198 52,180 Q 50,162 48,142 Q 46,122 48,102 Q 50,82 55,68 Z"
              fill={t.mapOutlineFill}
              stroke={hasZones ? `${BRAND.green}40` : t.mapOutline}
              strokeWidth={hasZones ? "1.5" : "1"}
              animate={{
                stroke: hasZones ? `${BRAND.green}40` : t.mapOutline,
                strokeWidth: hasZones ? 1.5 : 1,
              }}
              transition={{ duration: 0.6 }}
            />

            {/* Zone markers when active */}
            {hasZones && [
              { cx: 180, cy: 330, name: "Island" },
              { cx: 140, cy: 290, name: "Mainland" },
              { cx: 230, cy: 310, name: "Lekki" },
              { cx: 110, cy: 260, name: "Ikeja" },
            ].map((z, i) => (
              <motion.g key={z.name} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.08 }}>
                <circle cx={z.cx} cy={z.cy} r="16" fill={`${BRAND.green}06`} stroke={`${BRAND.green}25`} strokeWidth="0.5" />
                <circle cx={z.cx} cy={z.cy} r="2.5" fill={BRAND.green} opacity={0.7} />
                <text x={z.cx} y={z.cy - 20} textAnchor="middle" fill={t.textFaint} fontSize="6.5" fontFamily="var(--font-body)" fontWeight="500">{z.name}</text>
              </motion.g>
            ))}

            {/* Driver dots */}
            {hasDrivers && hasZones && [
              { cx: 172, cy: 338 }, { cx: 188, cy: 322 },
              { cx: 148, cy: 285 }, { cx: 125, cy: 262 },
              { cx: 222, cy: 308 },
            ].map((d, i) => (
              <motion.circle key={`d${i}`} cx={d.cx} cy={d.cy} r="3" fill={BRAND.green}
                initial={{ opacity: 0, r: 0 }} animate={{ opacity: 0.8, r: 3 }}
                transition={{ delay: 0.2 + i * 0.05 }} />
            ))}

            {/* Live pulse when launched */}
            {isLive && (
              <motion.circle cx="180" cy="330" r="40" fill="none" stroke={BRAND.green} strokeWidth="1"
                initial={{ opacity: 0, r: 20 }}
                animate={{ opacity: [0.3, 0], r: [20, 60] }}
                transition={{ duration: 2.5, repeat: Infinity }}
              />
            )}
          </svg>

          {/* Center text when nothing configured */}
          {!hasZones && (
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                className="text-center px-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <Globe size={28} style={{ color: t.textGhost, margin: "0 auto 12px" }} />
                <span style={{
                  ...TY.bodyR, fontSize: "13px", color: t.textFaint, display: "block",
                }}>
                  Configure zones to activate the map
                </span>
              </motion.div>
            </div>
          )}
        </div>

        {/* Right: Setup panel (replaces the decision panel) */}
        <motion.div
          className="hidden md:flex flex-col shrink-0 overflow-y-auto"
          style={{
            width: 300,
            background: t.overlay,
            borderLeft: `1px solid ${t.border}`,
          }}
          initial={{ opacity: 0, x: 12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          {/* Panel header */}
          <div className="px-4 py-4" style={{ borderBottom: `1px solid ${t.border}` }}>
            <div className="flex items-center justify-between mb-1">
              <span style={{ ...TY.sub, fontSize: "12px", color: t.text }}>Platform setup</span>
              <span style={{
                fontFamily: "'Manrope', sans-serif", fontWeight: 500,
                fontSize: "10px", color: BRAND.green,
              }}>
                {requiredDone}/{totalRequired}
              </span>
            </div>
            <div
              className="h-1 rounded-full overflow-hidden"
              style={{ background: isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)" }}
            >
              <motion.div
                className="h-full rounded-full"
                style={{ background: BRAND.green }}
                animate={{ width: `${(requiredDone / totalRequired) * 100}%` }}
              />
            </div>
          </div>

          {/* Steps */}
          <div className="flex-1 px-3 py-2">
            {SETUP_STEPS.map((step, i) => {
              const done = completed.includes(step.id);
              return (
                <motion.button
                  key={step.id}
                  onClick={() => onToggleStep(step.id)}
                  className="w-full rounded-xl p-3 mb-1.5 text-left transition-colors"
                  style={{
                    background: done
                      ? `${BRAND.green}${isDark ? "06" : "04"}`
                      : isDark ? "rgba(255,255,255,0.01)" : "rgba(0,0,0,0.005)",
                    border: `1px solid ${done ? `${BRAND.green}15` : "transparent"}`,
                  }}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + i * 0.05 }}
                  whileHover={{ scale: 1.005 }}
                  onMouseEnter={e => {
                    if (!done) e.currentTarget.style.background = isDark ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.01)";
                  }}
                  onMouseLeave={e => {
                    if (!done) e.currentTarget.style.background = isDark ? "rgba(255,255,255,0.01)" : "rgba(0,0,0,0.005)";
                  }}
                >
                  <div className="flex items-center gap-2.5">
                    {done ? (
                      <CheckCircle2 size={14} style={{ color: BRAND.green }} />
                    ) : (
                      <Circle size={14} style={{ color: isDark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.1)" }} />
                    )}
                    <step.icon size={12} style={{ color: done ? BRAND.green : step.color }} />
                    <span style={{
                      fontFamily: "'Manrope', sans-serif", fontWeight: 500,
                      fontSize: "12px", letterSpacing: "-0.02em",
                      color: done ? BRAND.green : t.text,
                      textDecoration: done ? "line-through" : "none",
                      flex: 1,
                    }}>
                      {step.label}
                    </span>
                    {!step.required && (
                      <span style={{
                        fontFamily: "'Manrope', sans-serif", fontWeight: 400,
                        fontSize: "9px", color: t.textGhost,
                      }}>opt</span>
                    )}
                  </div>

                  {/* Unlocks preview */}
                  {!done && (
                    <div className="flex flex-wrap gap-1 mt-2 ml-7">
                      {step.unlocks.slice(0, 2).map(u => (
                        <span key={u} style={{
                          fontFamily: "'Manrope', sans-serif", fontWeight: 400,
                          fontSize: "9px", letterSpacing: "-0.01em", color: t.textFaint,
                          padding: "1px 6px", borderRadius: 4,
                          background: isDark ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.015)",
                        }}>{u}</span>
                      ))}
                    </div>
                  )}
                </motion.button>
              );
            })}
          </div>

          {/* Data sources */}
          <div className="px-4 py-3" style={{ borderTop: `1px solid ${t.border}` }}>
            <div className="flex items-center gap-1.5 mb-2.5">
              <Shield size={9} style={{ color: t.textFaint }} />
              <span style={{ ...TY.label, fontSize: "8px", color: t.textGhost }}>Data sources</span>
            </div>
            {DATA_FLOW.map(d => (
              <div key={d.source} className="flex items-center gap-1.5 mb-1">
                <div className="w-1 h-1 rounded-full shrink-0" style={{ background: d.color }} />
                <span style={{
                  fontFamily: "'Manrope', sans-serif", fontWeight: 500,
                  fontSize: "9px", color: t.textMuted, minWidth: 38,
                }}>{d.source}</span>
                <span style={{
                  fontFamily: "'Manrope', sans-serif", fontWeight: 400,
                  fontSize: "9px", color: t.textFaint,
                }}>{d.how}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* ─── Live Feed Bar (skeleton) ─── */}
      <div
        className="flex items-center px-5 h-10 shrink-0"
        style={{ background: t.overlay, borderTop: `1px solid ${t.border}` }}
      >
        <Radio size={10} style={{ color: isLive ? BRAND.green : t.textGhost, marginRight: 8 }} />
        <AnimatePresence mode="wait">
          {isLive ? (
            <motion.span
              key="live"
              style={{ ...TY.bodyR, fontSize: "11px", color: t.textMuted }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <span style={{ color: BRAND.green }}>●</span> Ride #2847 completed — Island → Mainland · ₦2,400 · ★4.8
            </motion.span>
          ) : (
            <motion.span
              key="waiting"
              style={{ ...TY.bodyR, fontSize: "11px", color: t.textFaint }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              Waiting for platform to go live...
            </motion.span>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}


/* ═══════════════════════════════════════════════════════════════════════════
   MAIN EXPORT — Design Lab toggle + variation renderer
   ═══════════════════════════════════════════════════════════════════════════ */

export type OnboardingVariation = "A" | "B" | "C";

interface Props {
  variation: OnboardingVariation;
  onVariationChange: (v: OnboardingVariation) => void;
  onGoActive: () => void;
}

export function CommandCenterOnboarding({ variation, onVariationChange, onGoActive }: Props) {
  const { theme, t } = useAdminTheme();
  const isDark = theme === "dark";
  const [completed, setCompleted] = useState<string[]>([]);

  const toggleStep = (id: string) => {
    setCompleted(prev =>
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  const allRequiredDone = SETUP_STEPS.filter(s => s.required).every(s => completed.includes(s.id));

  return (
    <>
      {/* ─── Header with Design Lab toggle ─── */}
      <motion.div
        className="flex items-center justify-between px-5 h-14 shrink-0"
        style={{ background: t.overlay, borderBottom: `1px solid ${t.border}` }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="flex items-center gap-3">
          <h1 style={{ ...TY.sub, fontSize: "14px", color: t.text }}>Command Center</h1>
          <span style={{ ...TY.bodyR, fontSize: "11px", color: t.textFaint }}>Setup</span>
        </div>

        <div className="flex items-center gap-2">
          {/* Variation toggle (Design Lab) */}
          <div
            className="flex items-center h-7 rounded-lg overflow-hidden"
            style={{
              border: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)"}`,
            }}
          >
            {(["A", "B", "C"] as const).map(v => (
              <button
                key={v}
                onClick={() => onVariationChange(v)}
                className="h-full px-2.5 transition-colors"
                style={{
                  background: variation === v
                    ? isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)"
                    : "transparent",
                  minWidth: 28,
                }}
              >
                <span style={{
                  fontFamily: "'Manrope', sans-serif", fontWeight: variation === v ? 600 : 400,
                  fontSize: "10px", letterSpacing: "-0.01em",
                  color: variation === v ? t.text : t.textFaint,
                }}>
                  {v}
                </span>
              </button>
            ))}
          </div>

          {/* Go to active */}
          <button
            onClick={onGoActive}
            className="h-7 px-3 rounded-lg flex items-center gap-1.5 transition-colors"
            style={{
              background: allRequiredDone
                ? BRAND.green
                : isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.03)",
              border: allRequiredDone
                ? "none"
                : `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)"}`,
            }}
            onMouseEnter={e => {
              if (!allRequiredDone) e.currentTarget.style.background = isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)";
            }}
            onMouseLeave={e => {
              if (!allRequiredDone) e.currentTarget.style.background = isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.03)";
            }}
          >
            <Eye size={11} style={{ color: allRequiredDone ? "#fff" : t.textMuted }} />
            <span style={{
              fontFamily: "'Manrope', sans-serif", fontWeight: 500,
              fontSize: "10px", letterSpacing: "-0.01em",
              color: allRequiredDone ? "#fff" : t.textMuted,
            }}>
              {allRequiredDone ? "Enter Command Center" : "Preview active"}
            </span>
          </button>

          <ThemeToggle />
        </div>
      </motion.div>

      {/* ─── Variation content ─── */}
      <AnimatePresence mode="wait">
        <motion.div
          key={variation}
          className="flex-1 flex flex-col min-h-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {variation === "A" && <VariationA completed={completed} onToggleStep={toggleStep} />}
          {variation === "B" && <VariationB completed={completed} onToggleStep={toggleStep} />}
          {variation === "C" && <VariationC completed={completed} onToggleStep={toggleStep} />}
        </motion.div>
      </AnimatePresence>
    </>
  );
}