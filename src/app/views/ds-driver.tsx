/**
 * DS DRIVER — Driver app component documentation.
 * TripRequest, ActiveTrip, DriverWallet, EarningsHome,
 * DriverBottomNav, DriverSheets, DriverVerification.
 */

import { useState } from "react";
import {
  Home, Clock, Wallet, User, Power, Star, Navigation,
  ArrowUpRight, ArrowDownLeft, TrendingUp, Zap, Car,
  Banknote, Smartphone, MapPin, Route, Phone, MessageSquare,
  CheckCircle2, Shield, Plus, ChevronRight, AlertTriangle,
} from "lucide-react";
import { useAdminTheme, BRAND, TY, STATUS } from "../config/admin-theme";
import { GLASS_COLORS, GLASS_TYPE, MOTION } from "../config/project";
import { GlassPanel } from "../components/rider/glass-panel";
import { Section, DSCard, SLabel, PropTable, NoteCard, DSep } from "./ds-primitives";

export default function DSDriver() {
  const { t, theme } = useAdminTheme();
  const isDark = theme === "dark";
  const c = GLASS_COLORS.dark;

  return (
    <div className="max-w-[1100px] mx-auto px-5 py-8 space-y-14">

      {/* ═══ EARNINGS HOME ═══ */}
      <Section id="earnings-home" title="EARNINGS HOME (3 VARIATIONS)" description="A: Minimal card · B: Split panel · C: Atmospheric (LOCKED SPINE)">
        <DSCard>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Variation A */}
            <div className="rounded-2xl overflow-hidden relative" style={{ height: 300, background: "#0B0B0D" }}>
              <div className="absolute inset-0" style={{ background: "radial-gradient(circle at 50% 80%, rgba(29,185,84,0.06), transparent 60%)" }} />
              <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                <span style={{ ...GLASS_TYPE.caption, color: c.text.faint }}>Variation A · Minimal</span>
              </div>
              <div className="absolute bottom-14 left-3 right-3">
                <GlassPanel variant="dark" className="rounded-2xl p-4">
                  <span style={{ ...GLASS_TYPE.caption, color: c.text.muted }}>TODAY'S EARNINGS</span>
                  <span style={{ ...GLASS_TYPE.display, color: c.text.display, display: "block", marginTop: 4 }}>₦45,200</span>
                  <div className="flex items-center gap-2 mt-2">
                    <span style={{ ...GLASS_TYPE.bodySmall, color: BRAND.green }}>12 trips</span>
                    <span style={{ ...GLASS_TYPE.bodySmall, color: c.text.faint }}>·</span>
                    <span style={{ ...GLASS_TYPE.bodySmall, color: c.text.muted }}>6h 20m</span>
                  </div>
                </GlassPanel>
              </div>
              <div className="absolute bottom-3 left-3 right-3 flex justify-center">
                <div className="w-14 h-14 rounded-full flex items-center justify-center" style={{ background: BRAND.green, boxShadow: `0 0 24px ${BRAND.green}40` }}>
                  <Power size={20} color="#fff" />
                </div>
              </div>
            </div>

            {/* Variation B */}
            <div className="rounded-2xl overflow-hidden relative" style={{ height: 300, background: "#0B0B0D" }}>
              <div className="absolute inset-0" style={{ background: "radial-gradient(circle at 50% 30%, rgba(29,185,84,0.05), transparent 50%)" }} />
              <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                <span style={{ ...GLASS_TYPE.caption, color: c.text.faint }}>Variation B · Split</span>
              </div>
              <div className="absolute top-10 left-3 right-3 bottom-14 flex flex-col gap-2">
                <GlassPanel variant="dark" className="rounded-xl p-3 flex-1 flex flex-col justify-center items-center">
                  <span style={{ ...GLASS_TYPE.display, fontSize: "32px", color: c.text.display }}>₦45.2K</span>
                  <span style={{ ...GLASS_TYPE.bodySmall, color: c.text.muted, marginTop: 4 }}>Today's earnings</span>
                </GlassPanel>
                <div className="flex gap-2">
                  <GlassPanel variant="dark" className="rounded-xl p-3 flex-1 text-center">
                    <span style={{ ...GLASS_TYPE.body, color: c.text.primary }}>12</span>
                    <span style={{ ...GLASS_TYPE.caption, color: c.text.faint, display: "block" }}>Trips</span>
                  </GlassPanel>
                  <GlassPanel variant="dark" className="rounded-xl p-3 flex-1 text-center">
                    <span style={{ ...GLASS_TYPE.body, color: c.text.primary }}>4.8</span>
                    <span style={{ ...GLASS_TYPE.caption, color: c.text.faint, display: "block" }}>Rating</span>
                  </GlassPanel>
                  <GlassPanel variant="dark" className="rounded-xl p-3 flex-1 text-center">
                    <span style={{ ...GLASS_TYPE.body, color: c.text.primary }}>6h</span>
                    <span style={{ ...GLASS_TYPE.caption, color: c.text.faint, display: "block" }}>Online</span>
                  </GlassPanel>
                </div>
              </div>
            </div>

            {/* Variation C (LOCKED) */}
            <div className="rounded-2xl overflow-hidden relative" style={{ height: 300, background: "#0B0B0D" }}>
              <div className="absolute inset-0" style={{ background: "radial-gradient(circle at 50% 100%, rgba(29,185,84,0.1), transparent 50%), radial-gradient(circle at 80% 20%, rgba(29,185,84,0.05), transparent 40%)" }} />
              <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                <span style={{ ...GLASS_TYPE.caption, color: BRAND.green }}>Variation C · LOCKED SPINE</span>
                <span className="px-2 py-0.5 rounded" style={{ background: `${BRAND.green}15`, ...GLASS_TYPE.caption, fontSize: "8px", color: BRAND.green }}>ACTIVE</span>
              </div>
              <div className="absolute top-12 left-3 right-3 bottom-14">
                <GlassPanel variant="dark" className="rounded-2xl p-4 h-full flex flex-col">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: `${BRAND.green}15` }}>
                        <Power size={14} style={{ color: BRAND.green }} />
                      </div>
                      <div>
                        <span style={{ ...GLASS_TYPE.bodySmall, color: BRAND.green }}>Online</span>
                        <span style={{ ...GLASS_TYPE.caption, color: c.text.faint, display: "block" }}>6h 20m</span>
                      </div>
                    </div>
                    <span style={{ ...GLASS_TYPE.caption, color: c.text.muted }}>4.8★</span>
                  </div>
                  <div className="flex-1 flex flex-col justify-center">
                    <span style={{ ...GLASS_TYPE.caption, color: c.text.faint }}>TODAY</span>
                    <span style={{ ...GLASS_TYPE.display, color: c.text.display, fontSize: "36px" }}>₦45,200</span>
                    <div className="flex gap-3 mt-2">
                      <span style={{ ...GLASS_TYPE.bodySmall, color: c.text.muted }}>12 trips · ₦3,767/trip</span>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-auto">
                    <div className="flex-1 py-2 rounded-xl text-center" style={{ background: "rgba(255,255,255,0.06)" }}>
                      <span style={{ ...GLASS_TYPE.caption, color: c.text.secondary }}>Last trip →</span>
                    </div>
                    <div className="flex-1 py-2 rounded-xl text-center" style={{ background: `${BRAND.green}12` }}>
                      <span style={{ ...GLASS_TYPE.caption, color: BRAND.green }}>Demand zones</span>
                    </div>
                  </div>
                </GlassPanel>
              </div>
            </div>
          </div>
          <NoteCard variant="green">Variation C is the locked spine. Full MapCanvas atmospheric background. Online/Offline toggles atmospheric shift.</NoteCard>
        </DSCard>
      </Section>

      {/* ═══ TRIP REQUEST ═══ */}
      <Section id="trip-request" title="TRIP REQUEST" description="Incoming ride request overlay. Decision-optimized IA: earnings hero → distance → route → accept.">
        <DSCard>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-2xl overflow-hidden relative" style={{ height: 360, background: "#0B0B0D" }}>
              <div className="absolute inset-0" style={{ background: "radial-gradient(circle at 50% 100%, rgba(29,185,84,0.12), transparent 50%)" }} />
              <GlassPanel variant="dark" className="absolute bottom-3 left-3 right-3 rounded-2xl p-4">
                {/* Countdown */}
                <div className="flex items-center justify-between mb-3">
                  <span style={{ ...GLASS_TYPE.caption, color: c.text.faint }}>NEW RIDE REQUEST</span>
                  <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ border: `2px solid ${BRAND.green}`, background: `${BRAND.green}08` }}>
                    <span style={{ ...GLASS_TYPE.body, color: BRAND.green }}>15</span>
                  </div>
                </div>
                {/* Earnings hero */}
                <span style={{ ...GLASS_TYPE.display, fontSize: "28px", color: c.text.display }}>₦3,200</span>
                <span style={{ ...GLASS_TYPE.bodySmall, color: c.text.muted, display: "block", marginTop: 2 }}>Net earnings · Cash</span>
                {/* Route */}
                <div className="mt-3 space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ background: BRAND.green }} />
                    <span style={{ ...GLASS_TYPE.bodySmall, color: c.text.primary }}>Victoria Island</span>
                    <span style={{ ...GLASS_TYPE.caption, color: c.text.faint }}>2.1km · 4min</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ background: c.text.faint }} />
                    <span style={{ ...GLASS_TYPE.bodySmall, color: c.text.secondary }}>Lekki Phase 1</span>
                    <span style={{ ...GLASS_TYPE.caption, color: c.text.faint }}>8.5km · 18min</span>
                  </div>
                </div>
                {/* Rider */}
                <div className="flex items-center gap-2 mt-3 py-2 px-3 rounded-xl" style={{ background: "rgba(255,255,255,0.04)" }}>
                  <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ background: `${BRAND.green}12` }}>
                    <span style={{ ...GLASS_TYPE.caption, fontSize: "8px", color: BRAND.green }}>AA</span>
                  </div>
                  <span style={{ ...GLASS_TYPE.bodySmall, color: c.text.secondary }}>Adaeze A.</span>
                  <span style={{ ...GLASS_TYPE.caption, color: c.text.faint }}>4.9★ · 320 trips</span>
                </div>
                {/* Actions */}
                <div className="flex gap-3 mt-3">
                  <span className="flex-1 text-center py-2" style={{ ...GLASS_TYPE.bodySmall, color: c.text.muted, cursor: "pointer" }}>Decline</span>
                  <div className="flex-1 py-3 rounded-xl text-center" style={{ background: BRAND.green }}>
                    <span style={{ ...GLASS_TYPE.body, color: "#fff" }}>Accept</span>
                  </div>
                </div>
              </GlassPanel>
            </div>
            <div>
              <SLabel>DECISION IA (TOP → BOTTOM)</SLabel>
              <div className="space-y-2">
                {[
                  { n: "1", label: "Countdown timer", desc: "Urgency frame — 15s ring" },
                  { n: "2", label: "Net earnings hero", desc: "THE number — why you'd say yes" },
                  { n: "3", label: "Pickup distance + ETA", desc: "Cost of saying yes" },
                  { n: "4", label: "Route visualization", desc: "Pickup → Destination" },
                  { n: "5", label: "Trip distance + duration", desc: "Time commitment" },
                  { n: "6", label: "Rider trust signal", desc: "Name · Rating · Trip count" },
                  { n: "7", label: "Payment + badges", desc: "Modifiers, not primary" },
                  { n: "8", label: "Accept CTA", desc: "Green, full width" },
                  { n: "9", label: "Decline", desc: "Quiet muted text link" },
                ].map(item => (
                  <div key={item.n} className="flex items-start gap-3 px-3 py-2 rounded-xl" style={{ background: t.surface }}>
                    <span className="w-5 h-5 rounded-full flex items-center justify-center shrink-0" style={{ background: `${BRAND.green}12`, ...TY.body, fontSize: "9px", color: BRAND.green, letterSpacing: "-0.02em" }}>{item.n}</span>
                    <div>
                      <span style={{ ...TY.body, fontSize: "11px", color: t.text, letterSpacing: "-0.02em" }}>{item.label}</span>
                      <span style={{ ...TY.bodyR, fontSize: "10px", color: t.textFaint, display: "block", letterSpacing: "-0.02em" }}>{item.desc}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <PropTable rows={[
            ["trip", "TripRequestType", "Mock data from driver-data.ts"],
            ["colorMode", "'dark' | 'light'", "'dark'"],
            ["onAccept", "() => void", "—"],
            ["onDecline", "() => void", "—"],
          ]} />
        </DSCard>
      </Section>

      {/* ═══ ACTIVE TRIP ═══ */}
      <Section id="active-trip" title="ACTIVE TRIP" description="Post-accept flow. State machine: navigating → arrived → in_trip → completed.">
        <DSCard>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
            {[
              { phase: "Navigating", desc: "Driving to pickup", color: STATUS.info, icon: Navigation },
              { phase: "Arrived", desc: "Waiting for rider + OTP", color: STATUS.warning, icon: MapPin },
              { phase: "In Trip", desc: "Driving to destination", color: BRAND.green, icon: Route },
              { phase: "Completed", desc: "Rating + earnings summary", color: "#737373", icon: CheckCircle2 },
            ].map(p => {
              const Icon = p.icon;
              return (
                <div key={p.phase} className="rounded-xl p-3" style={{ background: `${p.color}08`, border: `1px solid ${p.color}18` }}>
                  <div className="flex items-center gap-2 mb-2">
                    <Icon size={12} style={{ color: p.color }} />
                    <span style={{ ...TY.body, fontSize: "11px", color: p.color, letterSpacing: "-0.02em" }}>{p.phase}</span>
                  </div>
                  <span style={{ ...TY.bodyR, fontSize: "10px", color: t.textMuted, letterSpacing: "-0.02em" }}>{p.desc}</span>
                </div>
              );
            })}
          </div>
          <SLabel>PHASE FEATURES</SLabel>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[
              { feature: "Navigate FAB", desc: "Floating button opens external maps. Lives on map, not in sheet." },
              { feature: "OTP Verification", desc: "At arrived_at_pickup. Driver enters code rider shares. 6-digit auto-advance." },
              { feature: "Action Bar", desc: "Call / Chat buttons. No double-line pills, all single-line whitespace-nowrap." },
              { feature: "Progress Dots", desc: "Horizontal dots across phases. Current phase = green dot." },
              { feature: "Cancel Flow", desc: "JetConfirm with per-phase messaging. Always available." },
              { feature: "In-ride Chat", desc: "Mirrors rider's chat. Sender flipped to 'driver'. Same mockOTP data." },
            ].map(f => (
              <div key={f.feature} className="flex items-start gap-2 px-3 py-2 rounded-xl" style={{ background: t.surface }}>
                <ChevronRight size={10} style={{ color: BRAND.green, marginTop: 3 }} />
                <div>
                  <span style={{ ...TY.body, fontSize: "11px", color: t.text, letterSpacing: "-0.02em" }}>{f.feature}</span>
                  <span style={{ ...TY.bodyR, fontSize: "10px", color: t.textFaint, display: "block", letterSpacing: "-0.02em" }}>{f.desc}</span>
                </div>
              </div>
            ))}
          </div>
        </DSCard>
      </Section>

      {/* ═══ DRIVER WALLET ═══ */}
      <Section id="driver-wallet" title="DRIVER WALLET" description="Balance + minimum balance enforcement. Fund, withdraw, transaction history.">
        <DSCard>
          <div className="rounded-2xl overflow-hidden relative" style={{ height: 280, background: "#0B0B0D" }}>
            <div className="absolute inset-0" style={{ background: "radial-gradient(circle at 50% 100%, rgba(29,185,84,0.08), transparent 50%)" }} />
            <GlassPanel variant="dark" className="absolute top-3 left-3 right-3 rounded-2xl p-4">
              <span style={{ ...GLASS_TYPE.caption, color: c.text.faint }}>WALLET BALANCE</span>
              <span style={{ ...GLASS_TYPE.display, color: c.text.display, display: "block", marginTop: 4 }}>₦12,500</span>
              <div className="flex items-center gap-2 mt-2">
                <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
                  <div className="h-full rounded-full" style={{ width: "62%", background: BRAND.green }} />
                </div>
                <span style={{ ...GLASS_TYPE.caption, color: c.text.faint }}>Min: ₦5,000</span>
              </div>
              <div className="flex gap-2 mt-4">
                <div className="flex-1 py-2.5 rounded-xl flex items-center justify-center gap-1.5" style={{ background: `${BRAND.green}12` }}>
                  <Plus size={12} style={{ color: BRAND.green }} />
                  <span style={{ ...GLASS_TYPE.bodySmall, color: BRAND.green }}>Fund</span>
                </div>
                <div className="flex-1 py-2.5 rounded-xl flex items-center justify-center gap-1.5" style={{ background: "rgba(255,255,255,0.06)" }}>
                  <ArrowUpRight size={12} style={{ color: c.text.secondary }} />
                  <span style={{ ...GLASS_TYPE.bodySmall, color: c.text.secondary }}>Withdraw</span>
                </div>
              </div>
            </GlassPanel>
            {/* Transactions */}
            <div className="absolute bottom-3 left-3 right-3 space-y-1">
              {[
                { label: "Trip earnings", amount: "+₦3,200", color: BRAND.green, icon: ArrowDownLeft },
                { label: "Commission (20%)", amount: "-₦640", color: STATUS.error, icon: ArrowUpRight },
                { label: "Wallet top-up", amount: "+₦5,000", color: STATUS.info, icon: Plus },
              ].map(tx => {
                const Icon = tx.icon;
                return (
                  <div key={tx.label} className="flex items-center gap-3 px-3 py-2 rounded-xl" style={{ background: "rgba(255,255,255,0.03)" }}>
                    <Icon size={11} style={{ color: tx.color }} />
                    <span className="flex-1" style={{ ...GLASS_TYPE.caption, color: c.text.secondary }}>{tx.label}</span>
                    <span style={{ ...GLASS_TYPE.bodySmall, color: tx.color }}>{tx.amount}</span>
                  </div>
                );
              })}
            </div>
          </div>
          <NoteCard variant="warning">Drivers must maintain minimum balance (admin-configured) to go online. Low balance shows warning + blocks toggle.</NoteCard>
        </DSCard>
      </Section>

      {/* ═══ DRIVER BOTTOM NAV ═══ */}
      <Section id="driver-nav" title="DRIVER BOTTOM NAV" description="4 tabs: Home (Earnings + Toggle) · Trips (History) · Wallet · Account.">
        <DSCard>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(["dark", "light"] as const).map(mode => {
              const colors = GLASS_COLORS[mode];
              const d = mode === "dark";
              return (
                <div key={mode} className="rounded-2xl overflow-hidden" style={{ background: d ? "#0B0B0D" : "#FAFAFA" }}>
                  <div className="flex items-end justify-around px-2 py-2" style={{
                    paddingBottom: 12,
                    background: d ? "rgba(11,11,13,0.85)" : "rgba(250,250,250,0.9)",
                    backdropFilter: "blur(20px)",
                    borderTop: `1px solid ${d ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}`,
                  }}>
                    {[
                      { icon: Home, label: "Home", active: true },
                      { icon: Clock, label: "Trips", active: false },
                      { icon: Wallet, label: "Wallet", active: false },
                      { icon: User, label: "Account", active: false },
                    ].map(tab => (
                      <div key={tab.label} className="flex flex-col items-center gap-1 min-w-[44px] min-h-[44px] justify-center">
                        <tab.icon size={18} style={{ color: tab.active ? BRAND.green : colors.icon.muted }} />
                        <span style={{ ...GLASS_TYPE.caption, fontSize: "9px", color: tab.active ? BRAND.green : colors.text.muted }}>{tab.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
          <PropTable rows={[
            ["active", "DriverTab", "'home'"],
            ["onTabChange", "(tab: DriverTab) => void", "—"],
            ["colorMode", "'dark' | 'light'", "—"],
          ]} />
        </DSCard>
      </Section>

      {/* ═══ DRIVER SHEETS ═══ */}
      <Section id="driver-sheets" title="DRIVER SHEETS" description="Bottom sheet overlays: TripDetail, EarningsBreakdown, DemandZones.">
        <DSCard>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { name: "TripDetailSheet", desc: "Expanded completed trip view. Route, fare breakdown, rider info, rating.", icon: Route },
              { name: "EarningsBreakdownSheet", desc: "Daily/weekly earnings decomposition. Gross, commission, net, tips.", icon: Banknote },
              { name: "DemandZonesSheet", desc: "Active demand zones with surge levels. Map pins + distance.", icon: TrendingUp },
            ].map(sheet => {
              const Icon = sheet.icon;
              return (
                <div key={sheet.name} className="rounded-xl p-4" style={{ background: t.surface, border: `1px solid ${t.borderSubtle}` }}>
                  <div className="flex items-center gap-2 mb-2">
                    <Icon size={14} style={{ color: BRAND.green }} />
                    <span style={{ ...TY.body, fontSize: "11px", color: t.text, letterSpacing: "-0.02em" }}>{sheet.name}</span>
                  </div>
                  <span style={{ ...TY.bodyR, fontSize: "10px", color: t.textMuted, letterSpacing: "-0.02em" }}>{sheet.desc}</span>
                </div>
              );
            })}
          </div>
          <NoteCard variant="info">All sheets use GlassPanel surface, spring physics slide-up, backdrop scrim. Pattern matches rider wallet-sheets.tsx.</NoteCard>
        </DSCard>
      </Section>

      {/* ═══ DRIVER VERIFICATION ═══ */}
      <Section id="verification" title="DRIVER VERIFICATION" description="Document upload → Background check → Vehicle inspection → Training → Approved.">
        <DSCard>
          <div className="flex items-center gap-2 mb-4">
            {[
              { label: "Documents", done: true },
              { label: "Background", done: true },
              { label: "Inspection", done: false, active: true },
              { label: "Training", done: false },
              { label: "Approved", done: false },
            ].map((step, i, arr) => (
              <div key={step.label} className="flex items-center gap-2">
                <div className="flex flex-col items-center gap-1">
                  <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{
                    background: step.done ? BRAND.green : step.active ? `${BRAND.green}15` : t.surface,
                    border: `1.5px solid ${step.done ? BRAND.green : step.active ? BRAND.green : t.borderSubtle}`,
                  }}>
                    {step.done ? <CheckCircle2 size={10} color="#fff" /> : <span style={{ ...TY.body, fontSize: "8px", color: step.active ? BRAND.green : t.textFaint, letterSpacing: "-0.02em" }}>{i + 1}</span>}
                  </div>
                  <span style={{ ...TY.bodyR, fontSize: "8px", color: step.done || step.active ? t.text : t.textFaint, letterSpacing: "-0.02em" }}>{step.label}</span>
                </div>
                {i < arr.length - 1 && <div className="w-4 h-px mb-3" style={{ background: step.done ? BRAND.green : t.borderSubtle }} />}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[
              { doc: "Driver's License", status: "Approved", color: BRAND.green },
              { doc: "Vehicle Registration", status: "Approved", color: BRAND.green },
              { doc: "Insurance Certificate", status: "Pending Review", color: STATUS.warning },
              { doc: "Background Check", status: "In Progress", color: STATUS.info },
            ].map(d => (
              <div key={d.doc} className="flex items-center gap-3 px-4 py-3 rounded-xl" style={{ background: t.surface, border: `1px solid ${t.borderSubtle}` }}>
                <div className="w-2 h-2 rounded-full" style={{ background: d.color }} />
                <span className="flex-1" style={{ ...TY.body, fontSize: "11px", color: t.text, letterSpacing: "-0.02em" }}>{d.doc}</span>
                <span className="px-2 py-0.5 rounded" style={{ ...TY.cap, fontSize: "9px", color: d.color, background: `${d.color}10`, letterSpacing: "-0.02em" }}>{d.status}</span>
              </div>
            ))}
          </div>
        </DSCard>
      </Section>

      <div className="py-6 text-center">
        <span style={{ ...TY.bodyR, fontSize: "10px", color: t.textGhost, letterSpacing: "-0.02em" }}>JET Design System · Driver Components · 17 Mar 2026</span>
      </div>
    </div>
  );
}
