/**
 * DS FOUNDATION — Tokens, Colors, Typography, Spacing, Radius, Separators,
 * Motion, Z-index, Breakpoints, Icons, Accessibility.
 */

import { useState } from "react";
import { motion } from "motion/react";
import {
  Sun, Moon, Zap, Car, Users, Wallet, Star,
  AlertTriangle, CheckCircle, Info, XCircle, AlertCircle,
  Search, Plus, ChevronRight, ChevronDown, X, Copy,
  LayoutDashboard, Settings, Bell, Clock,
  ArrowUp, ArrowDown, Shield, MapPin, Keyboard,
  UserPlus, Mail, Phone, Download, Wrench, RotateCcw,
  Eye, EyeOff, MoreHorizontal, Filter, ArrowUpDown,
} from "lucide-react";
import { useAdminTheme, BRAND, TY, STATUS } from "../config/admin-theme";
import { MOTION, Z, BREAKPOINTS } from "../config/project";
import { BRAND_COLORS, TYPOGRAPHY } from "../config/brand";
import { Separator } from "../components/shared/settings-primitives";
import { Section, DSCard, SLabel, PropTable, Swatch, TokenRow, NoteCard, DSep } from "./ds-primitives";

const STAGGER = 0.04;

export default function DSFoundation() {
  const { t, theme } = useAdminTheme();
  const isDark = theme === "dark";

  return (
    <div className="max-w-[1100px] mx-auto px-5 py-8 space-y-14">

      {/* ═══ BRAND IDENTITY ═══ */}
      <Section id="brand" title="BRAND IDENTITY" description="JET — Premium, reliable e-hailing. Nigeria.">
        <DSCard>
          <div className="flex flex-wrap items-center gap-6 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center" style={{ background: BRAND.green }}><Zap size={28} color="#fff" /></div>
              <div>
                <span style={{ ...TY.h, fontSize: "28px", color: t.text, display: "block" }}>JET</span>
                <span style={{ ...TY.bodyR, fontSize: "11px", color: t.textMuted }}>E-Hailing Platform · EVs + Gas</span>
              </div>
            </div>
            <div className="flex-1" />
            <div className="flex flex-wrap gap-2">
              {["Confident", "Efficient", "Trustworthy", "Premium"].map((tr) => (
                <span key={tr} className="px-3 py-1.5 rounded-full" style={{ background: isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)", border: `1px solid ${t.borderSubtle}`, ...TY.body, fontSize: "10px", color: t.textTertiary, letterSpacing: "-0.02em" }}>{tr}</span>
              ))}
            </div>
          </div>
          <SLabel>DESIGN NORTH STARS</SLabel>
          <div className="flex flex-wrap gap-3">
            {[
              { name: "Apple", desc: "Spatial clarity, purposeful motion" },
              { name: "Linear", desc: "Tight typography, density done right" },
              { name: "Vercel", desc: "Monochrome confidence" },
              { name: "Airbnb", desc: "Trust through transparency" },
              { name: "Framer", desc: "Fluid motion serves comprehension" },
              { name: "Figma", desc: "Composable components" },
            ].map((ref) => (
              <div key={ref.name} className="flex flex-col gap-0.5 px-3 py-2 rounded-lg" style={{ background: `${BRAND.green}06`, border: `1px solid ${BRAND.green}10` }}>
                <span style={{ ...TY.body, fontSize: "10px", color: t.greenText, letterSpacing: "-0.02em" }}>{ref.name}</span>
                <span style={{ ...TY.bodyR, fontSize: "9px", color: t.textFaint }}>{ref.desc}</span>
              </div>
            ))}
          </div>
        </DSCard>
      </Section>

      {/* ═══ COLOR PALETTE ═══ */}
      <Section id="colors" title="COLOR PALETTE">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <DSCard>
            <SLabel>BRAND COLORS</SLabel>
            <div className="flex flex-wrap gap-5">
              <Swatch color={BRAND.green} name="Primary" value="#1DB954" size="lg" />
              <Swatch color={BRAND.greenDark} name="Dark Green" value="#046538" size="lg" />
              <Swatch color={BRAND.black} name="Black" value="#0B0B0D" size="lg" />
              <Swatch color={BRAND.white} name="White" value="#FFFFFF" size="lg" />
              <Swatch color={BRAND.light} name="Light" value="#F5F5F5" size="lg" />
            </div>
          </DSCard>
          <DSCard>
            <SLabel>STATUS COLORS</SLabel>
            <div className="flex flex-wrap gap-5">
              <Swatch color={STATUS.success} name="Success" value="#1DB954" size="lg" />
              <Swatch color={STATUS.warning} name="Warning" value="#F59E0B" size="lg" />
              <Swatch color={STATUS.error} name="Error" value="#D4183D" size="lg" />
              <Swatch color={STATUS.info} name="Info" value="#3B82F6" size="lg" />
            </div>
          </DSCard>
          <DSCard className="md:col-span-2">
            <SLabel>GREY SCALE</SLabel>
            <div className="flex flex-wrap gap-3">
              {[
                { n: "50", l: "#FAFAFA", d: "#171717" }, { n: "100", l: "#F5F5F5", d: "#1C1C1F" },
                { n: "200", l: "#E5E5E5", d: "#262626" }, { n: "300", l: "#D4D4D4", d: "#404040" },
                { n: "400", l: "#A3A3A3", d: "#525252" }, { n: "500", l: "#737373", d: "#737373" },
                { n: "600", l: "#525252", d: "#A3A3A3" }, { n: "700", l: "#404040", d: "#D4D4D4" },
                { n: "800", l: "#262626", d: "#E5E5E5" }, { n: "900", l: "#171717", d: "#F5F5F5" },
                { n: "950", l: "#0B0B0D", d: "#FAFAFA" },
              ].map((g) => <Swatch key={g.n} color={isDark ? g.d : g.l} name={g.n} value={isDark ? g.d : g.l} size="sm" />)}
            </div>
          </DSCard>
          <DSCard>
            <SLabel>GREEN OPACITY SCALE</SLabel>
            <div className="flex flex-wrap gap-3">
              {["0.05", "0.10", "0.15", "0.20", "0.30", "0.50", "1"].map((op) => (
                <Swatch key={op} color={op === "1" ? BRAND.green : `rgba(29,185,84,${op})`} name={`${Math.round(parseFloat(op) * 100)}%`} value={op === "1" ? "#1DB954" : `rgba(…,${op})`} size="md" />
              ))}
            </div>
          </DSCard>
          <DSCard>
            <SLabel>GREEN TINT SCALE (brand.tsx)</SLabel>
            <div className="flex flex-wrap gap-3">
              {([
                ["green50", BRAND_COLORS.green50, "5%"],
                ["green100", BRAND_COLORS.green100, "10%"],
                ["green200", BRAND_COLORS.green200, "20%"],
                ["green300", BRAND_COLORS.green300, "30%"],
                ["green400", BRAND_COLORS.green400, "50%"],
              ] as const).map(([name, val, pct]) => (
                <Swatch key={name} color={val} name={pct} value={name} size="md" />
              ))}
            </div>
          </DSCard>
        </div>
      </Section>

      {/* ═══ SEMANTIC TOKENS ═══ */}
      <Section id="semantic" title="SEMANTIC TOKENS" description="All tokens adapt to light/dark mode.">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <DSCard><SLabel>SURFACES</SLabel>
            {(["bg", "bgSubtle", "surface", "surfaceRaised", "surfaceHover", "surfaceActive", "overlay", "glass"] as const).map(k => <TokenRow key={k} name={k} value={t[k]} preview="bg" />)}
          </DSCard>
          <DSCard><SLabel>TEXT HIERARCHY</SLabel>
            {(["text", "textSecondary", "textTertiary", "textMuted", "textFaint", "textGhost"] as const).map(k => <TokenRow key={k} name={k} value={t[k]} preview="text" />)}
          </DSCard>
          <DSCard><SLabel>BORDERS</SLabel>
            {(["border", "borderSubtle", "borderStrong"] as const).map(k => <TokenRow key={k} name={k} value={t[k]} preview="border" />)}
          </DSCard>
          <DSCard><SLabel>ICONS</SLabel>
            {(["icon", "iconSecondary", "iconMuted"] as const).map(k => (
              <div key={k} className="flex items-center gap-2 py-1.5">
                <Car size={16} style={{ color: t[k] }} />
                <span style={{ ...TY.body, fontSize: "11px", color: t.text, fontFamily: "monospace", flex: 1, letterSpacing: "-0.02em" }}>{k}</span>
                <span style={{ ...TY.bodyR, fontSize: "10px", color: t.textFaint, fontFamily: "monospace" }}>{t[k]}</span>
              </div>
            ))}
          </DSCard>
          <DSCard className="md:col-span-2"><SLabel>STATUS TOKEN SETS (bg · border · text)</SLabel>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {([
                { name: "Green", bg: t.greenBg, border: t.greenBorder, text: t.greenText },
                { name: "Error", bg: t.errorBg, border: t.errorBorder, text: t.errorText },
                { name: "Warning", bg: t.warningBg, border: t.warningBorder, text: t.warningText },
                { name: "Info", bg: t.infoBg, border: t.infoBorder, text: t.infoText },
              ]).map((s) => (
                <div key={s.name} className="p-3 rounded-xl flex flex-col gap-2" style={{ background: s.bg, border: `1px solid ${s.border}` }}>
                  <span style={{ ...TY.body, fontSize: "11px", color: s.text, letterSpacing: "-0.02em" }}>{s.name}</span>
                  {(["bg", "border", "text"] as const).map(field => (
                    <span key={field} style={{ ...TY.bodyR, fontSize: "9px", color: s.text, opacity: 0.7, fontFamily: "monospace" }}>{field}: {(s as any)[field]?.toString().slice(0, 30)}</span>
                  ))}
                </div>
              ))}
            </div>
          </DSCard>
        </div>
      </Section>

      {/* ═══ TYPOGRAPHY ═══ */}
      <Section id="typography" title="TYPOGRAPHY">
        <DSCard>
          <div className="flex flex-wrap gap-8 mb-6">
            <div>
              <SLabel>HEADINGS — MONTSERRAT</SLabel>
              <span style={{ fontFamily: "var(--font-heading)", fontWeight: 600, fontSize: "32px", color: t.text, letterSpacing: "-0.03em", lineHeight: "1.2" }}>Montserrat</span>
              <span style={{ ...TY.bodyR, fontSize: "10px", color: t.textFaint, display: "block", marginTop: 4 }}>Weights: 500 (medium), 600 (semibold) · Tracking: -0.02em to -0.03em · LH: 1.2–1.4</span>
            </div>
            <div>
              <SLabel>BODY — MANROPE</SLabel>
              <span style={{ fontFamily: "var(--font-body)", fontWeight: 500, fontSize: "32px", color: t.text, letterSpacing: "-0.02em", lineHeight: "1.4" }}>Manrope</span>
              <span style={{ ...TY.bodyR, fontSize: "10px", color: t.textFaint, display: "block", marginTop: 4 }}>Weights: 400 (regular), 500 (medium) · Tracking: -0.02em · LH: 1.4–1.5</span>
            </div>
          </div>
          <DSep />
          <SLabel>TY TOKENS (admin-theme.tsx)</SLabel>
          <div className="space-y-4">
            {([
              { token: "TY.h", style: TY.h, size: "24px", sample: "Dashboard Overview" },
              { token: "TY.sub", style: TY.sub, size: "16px", sample: "Fleet Earnings This Week" },
              { token: "TY.body", style: TY.body, size: "13px", sample: "Active drivers across all fleets: 24 online, 8 on trip" },
              { token: "TY.bodyR", style: TY.bodyR, size: "13px", sample: "Last updated 2 minutes ago. Next payout scheduled for Friday." },
              { token: "TY.cap", style: TY.cap, size: "11px", sample: "₦2,450,000 total revenue" },
              { token: "TY.label", style: TY.label, size: "10px", sample: "VEHICLE STATUS" },
            ]).map(({ token, style, size, sample }) => (
              <div key={token} className="flex items-baseline gap-4">
                <span className="shrink-0 w-14" style={{ ...TY.body, fontSize: "10px", color: t.textFaint, fontFamily: "monospace", letterSpacing: "-0.02em" }}>{token}</span>
                <span style={{ ...style, fontSize: size, color: token === "TY.bodyR" ? t.textSecondary : token === "TY.cap" ? t.textMuted : t.text }}>{sample}</span>
              </div>
            ))}
          </div>
          <DSep />
          <SLabel>TYPOGRAPHY CONFIG (brand.tsx)</SLabel>
          <PropTable rows={[
            ["heading.fontFamily", "string", "'Montserrat', system-ui, sans-serif"],
            ["heading.weights", "{ medium, semibold }", "500, 600"],
            ["heading.letterSpacing", "{ h1..h4 }", "-0.03em → -0.01em"],
            ["heading.lineHeight", "{ h1..h4 }", "1.2 → 1.4"],
            ["body.fontFamily", "string", "'Manrope', system-ui, sans-serif"],
            ["body.weights", "{ regular, medium }", "400, 500"],
            ["body.letterSpacing", "string", "-0.02em"],
            ["body.lineHeight", "{ paragraph, ui }", "1.5, 1.4"],
          ]} />
        </DSCard>
      </Section>

      {/* ═══ SPACING ═══ */}
      <Section id="spacing" title="SPACING & GRID">
        <DSCard>
          <SLabel>4PX BASE UNIT</SLabel>
          <div className="flex flex-wrap items-end gap-4 mb-4">
            {[4, 8, 12, 16, 20, 24, 32, 40, 48, 64].map((px) => (
              <div key={px} className="flex flex-col items-center gap-1.5">
                <div className="rounded" style={{ width: px, height: px, background: `${BRAND.green}30`, border: `1px solid ${BRAND.green}40` }} />
                <span style={{ ...TY.body, fontSize: "10px", color: t.text, fontFamily: "monospace", letterSpacing: "-0.02em" }}>{px}</span>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap gap-4 mt-2">
            {[
              { label: "Base unit", value: "4px" },
              { label: "Touch target", value: "44px min" },
              { label: "Component gap", value: "8–16px" },
              { label: "Section gap", value: "24–48px" },
            ].map(s => (
              <span key={s.label} className="px-3 py-1.5 rounded-lg" style={{ background: isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)", border: `1px solid ${t.borderSubtle}`, ...TY.bodyR, fontSize: "10px", color: t.textSecondary }}>
                {s.label}: <span style={{ color: t.text, fontFamily: "monospace" }}>{s.value}</span>
              </span>
            ))}
          </div>
        </DSCard>
      </Section>

      {/* ═══ RADIUS & ELEVATION ═══ */}
      <Section id="radius" title="RADIUS & ELEVATION">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <DSCard>
            <SLabel>BORDER RADIUS</SLabel>
            <div className="flex flex-wrap gap-4">
              {[
                { name: "sm", value: "8px" }, { name: "md", value: "10px" },
                { name: "lg", value: "12px" }, { name: "xl", value: "16px" },
                { name: "2xl", value: "20px" }, { name: "full", value: "9999px" },
              ].map(r => (
                <div key={r.name} className="flex flex-col items-center gap-1.5">
                  <div className="w-14 h-14 flex items-center justify-center" style={{ background: t.surface, border: `1px solid ${t.borderStrong}`, borderRadius: r.value }}>
                    <span style={{ ...TY.body, fontSize: "9px", color: t.textMuted, fontFamily: "monospace", letterSpacing: "-0.02em" }}>{r.value}</span>
                  </div>
                  <span style={{ ...TY.body, fontSize: "10px", color: t.text, letterSpacing: "-0.02em" }}>{r.name}</span>
                </div>
              ))}
            </div>
          </DSCard>
          <DSCard>
            <SLabel>ELEVATION (SHADOWS)</SLabel>
            <div className="space-y-4">
              {[
                { name: "shadow", value: t.shadow, label: "Default" },
                { name: "shadowLg", value: t.shadowLg, label: "Large (modals, drawers)" },
              ].map(s => (
                <div key={s.name} className="flex items-center gap-3">
                  <div className="w-20 h-12 rounded-xl" style={{ background: isDark ? "rgba(255,255,255,0.04)" : "#fff", boxShadow: s.value }} />
                  <div>
                    <span style={{ ...TY.body, fontSize: "10px", color: t.text, fontFamily: "monospace", display: "block", letterSpacing: "-0.02em" }}>{s.name}</span>
                    <span style={{ ...TY.bodyR, fontSize: "9px", color: t.textFaint }}>{s.label}</span>
                  </div>
                </div>
              ))}
              <div className="flex items-center gap-3">
                <div className="w-20 h-12 rounded-xl" style={{ background: t.glass, backdropFilter: t.glassBlur, border: `1px solid ${t.borderSubtle}`, boxShadow: t.shadow }} />
                <div>
                  <span style={{ ...TY.body, fontSize: "10px", color: t.text, fontFamily: "monospace", display: "block", letterSpacing: "-0.02em" }}>glass</span>
                  <span style={{ ...TY.bodyR, fontSize: "9px", color: t.textFaint }}>Blur + opacity surface</span>
                </div>
              </div>
            </div>
          </DSCard>
        </div>
      </Section>

      {/* ═══ SEPARATORS ═══ */}
      <Section id="separators" title="SEPARATORS & DIVIDERS">
        <DSCard>
          <div className="space-y-6">
            <div>
              <SLabel>HORIZONTAL — GRADIENT FADE</SLabel>
              <div className="h-px" style={{ background: isDark ? "linear-gradient(90deg, transparent, rgba(255,255,255,0.06) 20%, rgba(255,255,255,0.06) 80%, transparent)" : "linear-gradient(90deg, transparent, rgba(0,0,0,0.06) 20%, rgba(0,0,0,0.06) 80%, transparent)" }} />
            </div>
            <div>
              <SLabel>VERTICAL — PANEL DIVIDER</SLabel>
              <div className="flex items-stretch h-20 gap-6">
                <div className="flex-1 rounded-lg p-3" style={{ background: t.surface }}><span style={{ ...TY.body, fontSize: "10px", color: t.textSecondary, letterSpacing: "-0.02em" }}>Main panel</span></div>
                <div className="w-px self-stretch" style={{ background: `linear-gradient(to bottom, transparent, ${t.borderSubtle}, transparent)` }} />
                <div className="w-32 rounded-lg p-3" style={{ background: t.surface }}><span style={{ ...TY.body, fontSize: "10px", color: t.textSecondary, letterSpacing: "-0.02em" }}>Side panel</span></div>
              </div>
            </div>
            <div>
              <SLabel>SETTINGS SEPARATOR (COMPONENT)</SLabel>
              <Separator />
            </div>
          </div>
          <NoteCard variant="error">Never use one-sided borders (border-t, border-l). Always gradient separators that fade at both ends.</NoteCard>
        </DSCard>
      </Section>

      {/* ═══ MOTION ═══ */}
      <Section id="motion" title="MOTION LANGUAGE">
        <DSCard>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <SLabel>EASING CURVE</SLabel>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-20 h-8 rounded-lg overflow-hidden relative" style={{ background: t.surface }}>
                  <motion.div className="absolute top-1 bottom-1 left-1 w-6 rounded-md" style={{ background: BRAND.green }}
                    animate={{ x: [0, 48, 0] }} transition={{ repeat: Infinity, duration: 2, ease: [0.16, 1, 0.3, 1] }} />
                </div>
                <span style={{ ...TY.body, fontSize: "10px", color: t.text, fontFamily: "monospace", letterSpacing: "-0.02em" }}>[0.16, 1, 0.3, 1]</span>
              </div>
            </div>
            <div>
              <SLabel>STAGGER PATTERN</SLabel>
              <div className="space-y-1.5">
                {[0, 1, 2, 3, 4].map(i => (
                  <motion.div key={i} className="h-6 rounded-lg" style={{ background: `${BRAND.green}${(15 + i * 8).toString(16)}`, width: `${60 + i * 10}%` }}
                    initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * STAGGER, duration: 0.3, ease: [0.16, 1, 0.3, 1] }} />
                ))}
              </div>
              <span style={{ ...TY.body, fontSize: "10px", color: t.text, fontFamily: "monospace", display: "block", marginTop: 8, letterSpacing: "-0.02em" }}>STAGGER = {MOTION.stagger * 1000}ms</span>
            </div>
            <div>
              <SLabel>DURATIONS (MOTION config)</SLabel>
              <div className="space-y-2">
                {[
                  { l: "micro", v: `${MOTION.micro.duration * 1000}ms`, desc: "Button press, toggle" },
                  { l: "standard", v: `${MOTION.standard.duration * 1000}ms`, desc: "Panel, nav, card" },
                  { l: "emphasis", v: `${MOTION.emphasis.duration * 1000}ms`, desc: "Page, modal, onboarding" },
                  { l: "spring", v: `stiff: ${MOTION.spring.stiffness}`, desc: "Playful, gestures" },
                ].map(d => (
                  <div key={d.l} className="flex items-center justify-between">
                    <div>
                      <span style={{ ...TY.body, fontSize: "10px", color: t.textSecondary, letterSpacing: "-0.02em" }}>{d.l}</span>
                      <span style={{ ...TY.bodyR, fontSize: "9px", color: t.textFaint, display: "block" }}>{d.desc}</span>
                    </div>
                    <span style={{ ...TY.body, fontSize: "10px", color: t.text, fontFamily: "monospace", letterSpacing: "-0.02em" }}>{d.v}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </DSCard>
      </Section>

      {/* ═══ Z-INDEX ═══ */}
      <Section id="zindex" title="Z-INDEX SCALE">
        <DSCard>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {(Object.entries(Z) as [string, number][]).map(([name, val]) => (
              <div key={name} className="flex items-center gap-2 px-3 py-2 rounded-xl" style={{ background: t.surface, border: `1px solid ${t.borderSubtle}` }}>
                <span style={{ ...TY.body, fontSize: "11px", color: t.text, fontFamily: "monospace", flex: 1, letterSpacing: "-0.02em" }}>{name}</span>
                <span style={{ ...TY.h, fontSize: "14px", color: BRAND.green }}>{val}</span>
              </div>
            ))}
          </div>
        </DSCard>
      </Section>

      {/* ═══ BREAKPOINTS ═══ */}
      <Section id="breakpoints" title="BREAKPOINTS">
        <DSCard>
          <div className="flex flex-wrap gap-3">
            {(Object.entries(BREAKPOINTS) as [string, number][]).map(([name, val]) => (
              <div key={name} className="flex flex-col items-center gap-1 px-4 py-2.5 rounded-xl" style={{ background: t.surface, border: `1px solid ${t.borderSubtle}` }}>
                <span style={{ ...TY.h, fontSize: "16px", color: t.text }}>{val}<span style={{ fontSize: "10px", color: t.textFaint }}>px</span></span>
                <span style={{ ...TY.body, fontSize: "10px", color: t.textMuted, fontFamily: "monospace", letterSpacing: "-0.02em" }}>{name}</span>
              </div>
            ))}
          </div>
        </DSCard>
      </Section>

      {/* ═══ ICONS ═══ */}
      <Section id="icons" title="ICON CATALOG (LUCIDE-REACT)">
        <DSCard>
          <span style={{ ...TY.bodyR, fontSize: "10px", color: t.textFaint, display: "block", marginBottom: 12 }}>Sizes: 12–14px inline/badges · 16–18px actions · 24–28px empty states</span>
          <div className="flex flex-wrap gap-3">
            {([
              [LayoutDashboard, "Dashboard"], [Car, "Vehicles"], [Users, "Drivers"], [Wallet, "Earnings"],
              [Settings, "Settings"], [Bell, "Notifications"], [Clock, "History"], [Star, "Rating"],
              [Zap, "EV"], [Shield, "Security"], [MapPin, "Location"], [Search, "Search"],
              [Plus, "Add"], [Copy, "Copy"], [AlertTriangle, "Warning"], [CheckCircle, "Success"],
              [Info, "Info"], [XCircle, "Error"], [AlertCircle, "Alert"], [ArrowUp, "Up"],
              [ArrowDown, "Down"], [ChevronRight, "Navigate"], [ChevronDown, "Expand"], [X, "Close"],
              [Eye, "Show"], [EyeOff, "Hide"], [MoreHorizontal, "More"], [Filter, "Filter"],
              [ArrowUpDown, "Sort"], [Download, "Download"], [Mail, "Mail"], [Phone, "Phone"],
              [UserPlus, "Invite"], [Wrench, "Maintenance"], [RotateCcw, "Retry"], [Keyboard, "Keyboard"],
            ] as [typeof Car, string][]).map(([Icon, label]) => (
              <div key={label} className="flex flex-col items-center gap-1.5 w-14">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: t.surface, border: `1px solid ${t.borderSubtle}` }}><Icon size={16} style={{ color: t.icon }} /></div>
                <span style={{ ...TY.bodyR, fontSize: "9px", color: t.textFaint, textAlign: "center" }}>{label}</span>
              </div>
            ))}
          </div>
        </DSCard>
      </Section>

      {/* ═══ ACCESSIBILITY ═══ */}
      <Section id="a11y" title="ACCESSIBILITY">
        <DSCard>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {[
              { title: "Keyboard Navigation", items: ["Escape closes modals/drawers", "Tab focus trap in modals", "Enter/Space activates buttons", "Arrow keys in select pills"] },
              { title: "ARIA", items: ["role=\"dialog\" on modals/drawers", "aria-modal=\"true\" on fixed overlays", "aria-label on all interactive elements", "aria-pressed on toggles"] },
              { title: "Touch Targets", items: ["Minimum 44px on mobile (Apple HIG)", "8px minimum gap between targets", "Generous padding on list rows"] },
              { title: "Screen Readers", items: ["Status changes announced via live regions", "Form errors linked via aria-describedby", "Icons have sr-only labels or aria-hidden"] },
            ].map(section => (
              <div key={section.title}>
                <span style={{ ...TY.sub, fontSize: "12px", color: t.text, display: "block", marginBottom: 8 }}>{section.title}</span>
                <div className="space-y-1.5">
                  {section.items.map(item => (
                    <div key={item} className="flex items-center gap-2">
                      <CheckCircle size={10} style={{ color: BRAND.green }} />
                      <span style={{ ...TY.bodyR, fontSize: "10px", color: t.textSecondary }}>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </DSCard>
      </Section>

      {/* ── Footer ─── */}
      <div className="py-6 text-center">
        <span style={{ ...TY.bodyR, fontSize: "10px", color: t.textGhost }}>JET Design System · Foundation · 17 Mar 2026</span>
      </div>
    </div>
  );
}
