/**
 * DS RIDER — Rider C Spine component documentation.
 * GlassPanel (7 variants), MapCanvas, GLASS_COLORS, GLASS_TYPE,
 * JetToast, JetConfirm, JetSkeleton, JetEmpty/Error, BottomNav.
 */

import { useState } from "react";
import { useAdminTheme, BRAND, TY, STATUS } from "../config/admin-theme";
import { GLASS_COLORS, GLASS_TYPE, MOTION, type GlassColorMode } from "../config/project";
import { GlassPanel } from "../components/rider/glass-panel";
import { MapCanvas } from "../components/rider/map-canvas";
import { SkeletonBox, SkeletonHero, SkeletonList, SkeletonPills } from "../components/rider/jet-skeleton";
import { JetEmpty, JetError, JetNetworkError } from "../components/rider/jet-states";
import { Section, DSCard, SLabel, PropTable, NoteCard, DSep, TokenRow } from "./ds-primitives";
import {
  Home, Clock, Wallet, User, MapPin, Star, Zap,
  Check, X, AlertTriangle, Info, WifiOff, RefreshCw,
} from "lucide-react";

// ═══════════════════════════════════════════════════════════════════════════

export default function DSRider() {
  const { t, theme } = useAdminTheme();
  const isDark = theme === "dark";
  const [glassMode, setGlassMode] = useState<"dark" | "light">("dark");

  const gc = GLASS_COLORS[glassMode];

  return (
    <div className="max-w-[1100px] mx-auto px-5 py-8 space-y-14">

      {/* ═══ GLASS_COLORS TOKEN SYSTEM ═══ */}
      <Section id="glass-colors" title="GLASS_COLORS TOKEN SYSTEM" description="Mode-aware opacity palette for all Rider C Spine surfaces.">
        <DSCard>
          <div className="flex gap-2 mb-5">
            {(["dark", "light"] as const).map(m => (
              <button key={m} onClick={() => setGlassMode(m)} className="px-3 py-1.5 rounded-lg cursor-pointer" style={{
                background: glassMode === m ? (isDark ? "rgba(255,255,255,0.06)" : "#fff") : "transparent",
                border: `1px solid ${glassMode === m ? t.borderStrong : "transparent"}`,
                ...TY.body, fontSize: "10px", color: glassMode === m ? t.text : t.textMuted, letterSpacing: "-0.02em",
              }}>{m}</button>
            ))}
          </div>

          <SLabel>TEXT HIERARCHY ({glassMode})</SLabel>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-5">
            {Object.entries(gc.text).map(([name, val]) => (
              <div key={name} className="flex items-center gap-3 px-3 py-2 rounded-xl" style={{ background: glassMode === "dark" ? "rgba(11,11,13,0.9)" : "rgba(250,250,250,0.9)" }}>
                <span className="w-5 text-center shrink-0" style={{ color: val, fontWeight: 600, fontSize: "13px" }}>Aa</span>
                <span className="flex-1" style={{ ...TY.body, fontSize: "10px", color: val, fontFamily: "monospace", letterSpacing: "-0.02em" }}>{name}</span>
                <span style={{ ...TY.bodyR, fontSize: "9px", color: gc.text.muted, fontFamily: "monospace" }}>{(val as string).slice(0, 28)}</span>
              </div>
            ))}
          </div>

          <SLabel>ICON HIERARCHY ({glassMode})</SLabel>
          <div className="flex flex-wrap gap-4 mb-5">
            {Object.entries(gc.icon).map(([name, val]) => (
              <div key={name} className="flex items-center gap-2 px-3 py-2 rounded-xl" style={{ background: glassMode === "dark" ? "rgba(11,11,13,0.9)" : "rgba(250,250,250,0.9)" }}>
                <MapPin size={14} style={{ color: val }} />
                <span style={{ ...TY.body, fontSize: "10px", color: gc.text.secondary, fontFamily: "monospace", letterSpacing: "-0.02em" }}>{name}</span>
              </div>
            ))}
          </div>

          <SLabel>SURFACE TOKENS ({glassMode})</SLabel>
          <div className="flex flex-wrap gap-3 mb-5">
            {Object.entries(gc.surface).map(([name, val]) => (
              <div key={name} className="flex flex-col items-center gap-1.5">
                <div className="w-16 h-12 rounded-xl" style={{ background: glassMode === "dark" ? gc.bg : GLASS_COLORS.light.bg }}>
                  <div className="w-full h-full rounded-xl" style={{ background: val }} />
                </div>
                <span style={{ ...TY.body, fontSize: "9px", color: t.textMuted, fontFamily: "monospace", letterSpacing: "-0.02em" }}>{name}</span>
              </div>
            ))}
          </div>

          <SLabel>GREEN ACCENTS ({glassMode})</SLabel>
          <div className="flex flex-wrap gap-3">
            {Object.entries(gc.green).map(([name, val]) => (
              <div key={name} className="flex items-center gap-2 px-3 py-2 rounded-xl" style={{ background: glassMode === "dark" ? "rgba(11,11,13,0.9)" : "rgba(250,250,250,0.9)" }}>
                <div className="w-4 h-4 rounded" style={{ background: val }} />
                <span style={{ ...TY.body, fontSize: "10px", color: gc.text.secondary, fontFamily: "monospace", letterSpacing: "-0.02em" }}>{name}</span>
              </div>
            ))}
          </div>
        </DSCard>
      </Section>

      {/* ═══ GLASS_TYPE ═══ */}
      <Section id="glass-type" title="GLASS_TYPE TYPOGRAPHY" description="C Spine typographic hierarchy as composable inline style objects.">
        <DSCard>
          <div className="space-y-4" style={{ background: glassMode === "dark" ? "rgba(11,11,13,0.95)" : "rgba(250,250,250,0.95)", borderRadius: 16, padding: 20 }}>
            {([
              { token: "display", style: GLASS_TYPE.display, sample: "Good morning" },
              { token: "body", style: GLASS_TYPE.body, sample: "Where are you going today?" },
              { token: "bodyRegular", style: GLASS_TYPE.bodyRegular, sample: "Your ride is on the way. ETA 3 minutes." },
              { token: "small", style: GLASS_TYPE.small, sample: "Toyota Camry · LND-234-AB" },
              { token: "bodySmall", style: GLASS_TYPE.bodySmall, sample: "4.8 ★ · 1,240 trips" },
              { token: "bodySmallRegular", style: GLASS_TYPE.bodySmallRegular, sample: "Last trip completed 2 hours ago" },
              { token: "caption", style: GLASS_TYPE.caption, sample: "₦2,400 · 12 min" },
              { token: "label", style: GLASS_TYPE.label, sample: "SAVED PLACES" },
            ]).map(({ token, style, sample }) => (
              <div key={token} className="flex items-baseline gap-4">
                <span className="shrink-0 w-28" style={{ ...TY.body, fontSize: "9px", color: gc.text.faint, fontFamily: "monospace", letterSpacing: "-0.02em" }}>{token}</span>
                <span style={{ ...style, color: token === "label" ? gc.text.faint : gc.text.primary }}>{sample}</span>
              </div>
            ))}
          </div>
          <PropTable rows={[
            ["fontFamily", "string", "var(--font-heading) | var(--font-body)"],
            ["fontSize", "string", "11px – 28px"],
            ["fontWeight", "400 | 500 | 600", "Per token"],
            ["letterSpacing", "string", "-0.02em | -0.03em | 0.05em"],
          ]} />
        </DSCard>
      </Section>

      {/* ═══ GLASS PANEL ═══ */}
      <Section id="glass-panel" title="GLASS PANEL — 7 VARIANTS" description="Adaptive surface component. Dark = translucent glass. Light = Apple-frosted.">
        <DSCard>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-5">
            {(["dark", "light", "map-dark", "map-light", "sheet-light", "chip-dark", "chip-light"] as const).map(v => (
              <div key={v} className="relative rounded-2xl overflow-hidden" style={{ height: v.includes("chip") ? 60 : 120, background: v.includes("dark") || v === "map-dark" ? "#0B0B0D" : "#FAFAFA" }}>
                {/* Simulated background noise */}
                <div className="absolute inset-0 opacity-20" style={{ background: v.includes("dark") ? "radial-gradient(circle at 30% 70%, rgba(29,185,84,0.15), transparent 60%)" : "radial-gradient(circle at 70% 30%, rgba(29,185,84,0.08), transparent 60%)" }} />
                <GlassPanel variant={v} className={`absolute ${v.includes("chip") ? "bottom-2 left-2 right-2 top-2" : "bottom-3 left-3 right-3 top-3"} rounded-xl flex items-center justify-center`}>
                  <span style={{ ...GLASS_TYPE.caption, color: v.includes("dark") ? GLASS_COLORS.dark.text.secondary : GLASS_COLORS.light.text.secondary }}>{v}</span>
                </GlassPanel>
              </div>
            ))}
          </div>
          <PropTable rows={[
            ["variant", "'dark' | 'light' | 'map-dark' | ...", "'dark'"],
            ["borderless", "boolean", "false"],
            ["blur", "number (px)", "20"],
            ["className", "string", "''"],
          ]} />
          <NoteCard variant="green">Dark: translucent glass + backdrop-blur + luminous border. Light: frosted white + multi-layer shadow + fine 0.5px border.</NoteCard>
        </DSCard>
      </Section>

      {/* ═══ MAP CANVAS ═══ */}
      <Section id="map-canvas" title="MAP CANVAS" description="Full-bleed atmospheric background. Dark night photo + green glows. Light day photo + soft gradients.">
        <DSCard noPad>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0 overflow-hidden rounded-2xl" style={{ height: 280 }}>
            <div className="relative overflow-hidden">
              <MapCanvas colorMode="dark" className="absolute inset-0" />
              <div className="absolute bottom-3 left-3">
                <GlassPanel variant="chip-dark" className="px-2.5 py-1 rounded-lg">
                  <span style={{ ...GLASS_TYPE.caption, color: GLASS_COLORS.dark.text.secondary }}>Dark mode</span>
                </GlassPanel>
              </div>
            </div>
            <div className="relative overflow-hidden">
              <MapCanvas colorMode="light" className="absolute inset-0" />
              <div className="absolute bottom-3 left-3">
                <GlassPanel variant="chip-light" className="px-2.5 py-1 rounded-lg">
                  <span style={{ ...GLASS_TYPE.caption, color: GLASS_COLORS.light.text.secondary }}>Light mode</span>
                </GlassPanel>
              </div>
            </div>
          </div>
        </DSCard>
        <DSCard className="mt-4">
          <PropTable rows={[
            ["colorMode", "'dark' | 'light'", "'dark'"],
            ["useSimulated", "boolean", "true"],
            ["mapStyle", "MapStyleConfig", "undefined"],
            ["mapContainerRef", "RefCallback<HTMLDivElement>", "undefined"],
          ]} />
        </DSCard>
      </Section>

      {/* ═══ BOTTOM NAV ═══ */}
      <Section id="bottom-nav" title="RIDER BOTTOM NAV" description="4 tabs: Home, Activity, Wallet, Account. 44px min touch targets.">
        <DSCard>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(["dark", "light"] as const).map(mode => {
              const c = GLASS_COLORS[mode];
              return (
                <div key={mode} className="rounded-2xl overflow-hidden" style={{ background: mode === "dark" ? "#0B0B0D" : "#FAFAFA" }}>
                  <div className="flex items-end justify-around px-4 py-3" style={{
                    background: mode === "dark" ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.8)",
                    backdropFilter: "blur(20px)",
                    borderTop: `1px solid ${mode === "dark" ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)"}`,
                  }}>
                    {[
                      { icon: Home, label: "Home", active: true },
                      { icon: Clock, label: "Activity", active: false },
                      { icon: Wallet, label: "Wallet", active: false },
                      { icon: User, label: "Account", active: false },
                    ].map(tab => (
                      <div key={tab.label} className="flex flex-col items-center gap-1 py-1 px-3 min-w-[44px] min-h-[44px] justify-center">
                        <tab.icon size={18} style={{ color: tab.active ? BRAND.green : c.icon.muted }} />
                        <span style={{ ...GLASS_TYPE.caption, fontSize: "9px", color: tab.active ? BRAND.green : c.text.muted }}>{tab.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </DSCard>
      </Section>

      {/* ═══ JET TOAST ═══ */}
      <Section id="jet-toast" title="JET TOAST" description="Rider toast system. 4 variants, auto-dismiss, stacking (max 3), spring animation.">
        <DSCard>
          <div className="space-y-3" style={{ background: "rgba(11,11,13,0.95)", borderRadius: 16, padding: 20 }}>
            {([
              { msg: "Place saved to favourites", variant: "success", icon: Check, color: BRAND.green },
              { msg: "Trip cancelled", variant: "error", icon: X, color: STATUS.error },
              { msg: "Driver is 2 min away", variant: "info", icon: Info, color: STATUS.info },
              { msg: "Surge pricing active", variant: "warning", icon: AlertTriangle, color: STATUS.warning },
            ]).map(toast => {
              const Icon = toast.icon;
              return (
                <div key={toast.variant} className="flex items-center gap-3 px-4 py-3 rounded-2xl" style={{
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  backdropFilter: "blur(20px)",
                }}>
                  <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0" style={{ background: `${toast.color}18` }}>
                    <Icon size={13} style={{ color: toast.color }} />
                  </div>
                  <span style={{ ...GLASS_TYPE.bodySmall, color: GLASS_COLORS.dark.text.primary, flex: 1 }}>{toast.msg}</span>
                  <span className="px-2 py-0.5 rounded" style={{ ...GLASS_TYPE.caption, fontSize: "8px", color: toast.color, background: `${toast.color}10` }}>{toast.variant}</span>
                </div>
              );
            })}
          </div>
          <PropTable rows={[
            ["message", "string", "—"],
            ["variant", "'success' | 'error' | 'info' | 'warning'", "'success'"],
            ["duration", "number (ms)", "2500"],
            ["action", "{ label, onPress }", "undefined"],
          ]} />
          <NoteCard variant="info">Usage: const {'{ showToast, ToastContainer }'} = useJetToast(colorMode); · Auto-dismiss · Max 3 stacked</NoteCard>
        </DSCard>
      </Section>

      {/* ═══ JET CONFIRM ═══ */}
      <Section id="jet-confirm" title="JET CONFIRM" description="Apple-style confirmation dialog with C spine DNA.">
        <DSCard>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Standard */}
            <div className="rounded-2xl overflow-hidden relative" style={{ height: 220, background: "#0B0B0D" }}>
              <div className="absolute inset-0" style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(8px)" }} />
              <div className="absolute inset-4 flex items-center justify-center">
                <div className="w-full max-w-[260px] rounded-2xl p-5" style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.09)", backdropFilter: "blur(20px)" }}>
                  <span style={{ ...GLASS_TYPE.body, color: GLASS_COLORS.dark.text.primary, display: "block", marginBottom: 4 }}>Sign out?</span>
                  <span style={{ ...GLASS_TYPE.bodySmallRegular, color: GLASS_COLORS.dark.text.muted, display: "block", marginBottom: 16 }}>You'll need to sign in again.</span>
                  <div className="flex gap-3">
                    <div className="flex-1 py-2.5 rounded-xl text-center" style={{ background: "rgba(255,255,255,0.06)", ...GLASS_TYPE.bodySmall, color: GLASS_COLORS.dark.text.secondary }}>Cancel</div>
                    <div className="flex-1 py-2.5 rounded-xl text-center" style={{ background: BRAND.green, ...GLASS_TYPE.bodySmall, color: "#fff" }}>Sign out</div>
                  </div>
                </div>
              </div>
            </div>
            {/* Destructive */}
            <div className="rounded-2xl overflow-hidden relative" style={{ height: 220, background: "#0B0B0D" }}>
              <div className="absolute inset-0" style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(8px)" }} />
              <div className="absolute inset-4 flex items-center justify-center">
                <div className="w-full max-w-[260px] rounded-2xl p-5" style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.09)", backdropFilter: "blur(20px)" }}>
                  <span style={{ ...GLASS_TYPE.body, color: GLASS_COLORS.dark.text.primary, display: "block", marginBottom: 4 }}>Cancel ride?</span>
                  <span style={{ ...GLASS_TYPE.bodySmallRegular, color: GLASS_COLORS.dark.text.muted, display: "block", marginBottom: 16 }}>A ₦200 cancellation fee may apply.</span>
                  <div className="flex gap-3">
                    <div className="flex-1 py-2.5 rounded-xl text-center" style={{ background: "rgba(255,255,255,0.06)", ...GLASS_TYPE.bodySmall, color: GLASS_COLORS.dark.text.secondary }}>Keep ride</div>
                    <div className="flex-1 py-2.5 rounded-xl text-center" style={{ background: STATUS.error, ...GLASS_TYPE.bodySmall, color: "#fff" }}>Cancel</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <PropTable rows={[
            ["open", "boolean", "false"],
            ["colorMode", "'dark' | 'light'", "—"],
            ["title", "string", "—"],
            ["message", "string", "—"],
            ["destructive", "boolean", "false"],
            ["confirmLabel", "string", "'Confirm'"],
            ["onConfirm", "() => void", "—"],
            ["onCancel", "() => void", "—"],
          ]} />
        </DSCard>
      </Section>

      {/* ═══ JET SKELETON ═══ */}
      <Section id="jet-skeleton" title="JET SKELETON" description="C Spine pulse skeleton primitives. GLASS_COLORS-aware.">
        <DSCard>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(["dark", "light"] as const).map(mode => (
              <div key={mode} className="rounded-2xl overflow-hidden p-5 space-y-4" style={{ background: mode === "dark" ? "#0B0B0D" : "#FAFAFA" }}>
                <span style={{ ...GLASS_TYPE.caption, color: GLASS_COLORS[mode].text.faint }}>{mode} mode</span>
                <SkeletonHero colorMode={mode} />
                <SkeletonPills colorMode={mode} count={4} />
                <SkeletonList colorMode={mode} rows={3} />
              </div>
            ))}
          </div>
          <PropTable rows={[
            ["colorMode", "'dark' | 'light'", "—"],
            ["SkeletonBox", "width, height, radius", "Primitive rect"],
            ["SkeletonHero", "colorMode", "Large hero block"],
            ["SkeletonList", "colorMode, rows", "Row list"],
            ["SkeletonPills", "colorMode, count", "Horizontal pills"],
          ]} />
        </DSCard>
      </Section>

      {/* ═══ JET EMPTY / ERROR / NETWORK ═══ */}
      <Section id="jet-states" title="JET EMPTY · ERROR · NETWORK" description="C Spine state components. Never dead-ends, always recovery paths.">
        <DSCard>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="rounded-2xl overflow-hidden" style={{ background: "#0B0B0D", height: 280 }}>
              <JetEmpty colorMode="dark" icon={Star} title="No saved places" description="Save your frequent destinations for quick booking." actionLabel="Add a place" onAction={() => {}} />
            </div>
            <div className="rounded-2xl overflow-hidden" style={{ background: "#0B0B0D", height: 280 }}>
              <JetError colorMode="dark" title="Can't load rides" description="Something went wrong. Pull down to retry." onRetry={() => {}} />
            </div>
            <div className="rounded-2xl overflow-hidden" style={{ background: "#0B0B0D", height: 280 }}>
              <JetNetworkError colorMode="dark" onRetry={() => {}} />
            </div>
          </div>
        </DSCard>
      </Section>

      {/* ═══ DESIGN SPINE RULE ═══ */}
      <Section id="spine-rule" title="DESIGN SPINE RULE (LOCKED)">
        <DSCard>
          <NoteCard variant="green">Variation C "Bold" is the locked design spine. Every Rider screen MUST carry the C spine's visual DNA.</NoteCard>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <SLabel>MUST BE CONSISTENT</SLabel>
              <div className="space-y-1.5">
                {[
                  "GlassPanel as card/surface material",
                  "MapCanvas atmospheric background",
                  "Green ambient glows (low opacity)",
                  "Noise texture overlay at 3%",
                  "Gradient depth system",
                  "Typography: Montserrat 600 / Manrope 500",
                  "Green as scalpel — CTAs, active, status only",
                  "Motion stagger 40ms via MOTION config",
                ].map(item => (
                  <div key={item} className="flex items-center gap-2">
                    <Check size={10} style={{ color: BRAND.green }} />
                    <span style={{ ...TY.bodyR, fontSize: "10px", color: t.textSecondary, letterSpacing: "-0.02em" }}>{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <SLabel>CAN VARY</SLabel>
              <div className="space-y-1.5">
                {[
                  "Layout structure (full-screen / sheet / split)",
                  "Information density + disclosure strategy",
                  "Content hierarchy + section ordering",
                  "Interaction patterns (tabs / scroll / filters)",
                  "Where the map appears (full-bleed / peek / strip)",
                ].map(item => (
                  <div key={item} className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-sm" style={{ background: t.surface, border: `1px solid ${t.borderSubtle}` }} />
                    <span style={{ ...TY.bodyR, fontSize: "10px", color: t.textMuted, letterSpacing: "-0.02em" }}>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </DSCard>
      </Section>

      {/* ═══ RIDER SHEETS ═══ */}
      <Section id="rider-sheets" title="RIDER SHEETS" description="CancelReasonSheet, ScheduleCreateSheet, BookingSheets (Route, Payment, Safety).">
        <DSCard>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                name: "CancelReasonSheet",
                desc: "Post-confirmation reason selection. Contextual reasons list, single tap, done.",
                reasons: ["Changed my plans", "Driver is taking too long", "Wrong address", "Found another ride", "Safety concern"],
                northstar: "Uber cancel reason flow",
              },
              {
                name: "ScheduleCreateSheet",
                desc: "New scheduled ride: Pickup → Destination → Date → Time → Vehicle → Recurrence → Confirm.",
                reasons: ["Location search mode", "Date/time picker", "Vehicle class selector", "Recurrence options"],
                northstar: "Apple Maps bottom sheet",
              },
              {
                name: "BookingSheets",
                desc: "RouteEditSheet (swap pickup/dest), PaymentSheet (switch method), SafetySheet (SOS, share trip).",
                reasons: ["RouteEditSheet", "PaymentSheet", "SafetySheet"],
                northstar: "Uber inline editing · Airbnb disclosure",
              },
            ].map(sheet => (
              <div key={sheet.name} className="rounded-xl p-4 flex flex-col" style={{ background: t.surface, border: `1px solid ${t.borderSubtle}` }}>
                <span style={{ ...TY.body, fontSize: "11px", color: t.text, marginBottom: 4, letterSpacing: "-0.02em" }}>{sheet.name}</span>
                <span style={{ ...TY.bodyR, fontSize: "10px", color: t.textMuted, marginBottom: 8, letterSpacing: "-0.02em" }}>{sheet.desc}</span>
                <div className="space-y-1 mb-3">
                  {sheet.reasons.map(r => (
                    <div key={r} className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full" style={{ background: BRAND.green }} />
                      <span style={{ ...TY.bodyR, fontSize: "9px", color: t.textSecondary, letterSpacing: "-0.02em" }}>{r}</span>
                    </div>
                  ))}
                </div>
                <span className="mt-auto" style={{ ...TY.bodyR, fontSize: "9px", color: t.textFaint, fontStyle: "italic", letterSpacing: "-0.02em" }}>Northstar: {sheet.northstar}</span>
              </div>
            ))}
          </div>
          <NoteCard variant="info">All rider sheets use GlassPanel surface, spring physics slide-up, backdrop scrim. Grab handle at top.</NoteCard>
        </DSCard>
      </Section>

      <div className="py-6 text-center">
        <span style={{ ...TY.bodyR, fontSize: "10px", color: t.textGhost, letterSpacing: "-0.02em" }}>JET Design System · Rider C Spine · 17 Mar 2026</span>
      </div>
    </div>
  );
}