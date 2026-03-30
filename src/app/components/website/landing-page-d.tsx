/**
 * JET Landing Page — Version D: "ELEVATED NIGERIA"
 *
 * DNA: Editorial Gravity × Spatial Theater
 *
 * Key moves:
 * - Spatial hero: dark, layered parallax, floating OTP card as proof
 * - Editorial body: light sections, asymmetric compositions, left-anchored headlines
 * - Bento grid for safety/capabilities (Spatial) with editorial restraint (A)
 * - Parallax ghost numbers for How It Works (C)
 * - Scattered image rhythm from Editorial Gravity
 * - Green used only as scalpel — dots, underlines, CTAs
 *
 * Copy: "A different class of ride." — Class → Safety → Planet
 * No fake stats. No competitor naming. No Lagos-only framing.
 */

import { useRef, useState } from "react";
import { motion, useInView, useScroll, useTransform, AnimatePresence } from "motion/react";
import {
  ArrowRight,
  ArrowUpRight,
  ChevronDown,
  Shield,
  Leaf,
  Zap,
  MapPin,
  Car,
  Building2,
  Users,
  Battery,
  Lock,
} from "lucide-react";
import { BRAND_COLORS } from "../../config/brand";
import { JetLogo } from "../brand/jet-logo";

// ─── Config ─────────────────────────────────────────────────────────────────
const CONTACT_EMAIL = "hello@jet.ng";
const APP_STORE_URL = "#app-store";   // Replace with live App Store link
const PLAY_STORE_URL = "#play-store"; // Replace with live Play Store link

// ─── Images ─────────────────────────────────────────────────────────────────
const IMG_HERO    = "https://images.unsplash.com/photo-1574612357719-5dd0a272afe2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxMYWdvcyUyME5pZ2VyaWElMjBhZXJpYWwlMjBjaXR5c2NhcGUlMjBuaWdodCUyMGxpZ2h0c3xlbnwxfHx8fDE3NzI5MzE3OTl8MA&ixlib=rb-4.1.0&q=80&w=1080";
const IMG_FLEET   = "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080"; // fleet of cars parked — operations scale
const IMG_ROAD    = "https://images.unsplash.com/photo-1470224114660-3f6686c562eb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080"; // highway at dusk — used in image constellation
const IMG_CHARGE  = "https://images.unsplash.com/photo-1768310465625-5824a01fff4c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGVjdHJpYyUyMGNhciUyMGNoYXJnaW5nJTIwc3RhdGlvbiUyMG1vZGVybnxlbnwxfHx8fDE3NzI4NzU5OTJ8MA&ixlib=rb-4.1.0&q=80&w=1080";
const IMG_STREET  = "https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080"; // Lagos skyline / modern Nigeria cityscape
const IMG_MAN     = "https://images.unsplash.com/photo-1550051414-003c9007794c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhZnJpY2FuJTIwbWFuJTIwc21pbGluZyUyMHByb2Zlc3Npb25hbCUyMGhlYWRzaG90fGVufDF8fHx8MTc3MjkzMTgwNXww&ixlib=rb-4.1.0&q=80&w=1080";
const IMG_HOTEL   = "https://images.unsplash.com/photo-1566073771259-6a8506099945?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080"; // luxury hotel entrance with car arrival
const IMG_INTERIOR = "https://images.unsplash.com/photo-1503376780353-7e6692767b70?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080"; // premium car interior — leather, ambient lighting

// ─── Typography ─────────────────────────────────────────────────────────────
const H  = { fontFamily: "var(--font-heading)", letterSpacing: "-0.03em", fontWeight: 600, lineHeight: 1.1 } as const;
const B  = { fontFamily: "var(--font-body)",    letterSpacing: "-0.02em", fontWeight: 400, lineHeight: 1.55 } as const;
const BM = { ...B, fontWeight: 500 } as const;

// ─── Scroll Reveal ───────────────────────────────────────────────────────────
function Reveal({
  children, delay = 0, className = "", from = "bottom",
}: {
  children: React.ReactNode; delay?: number; className?: string; from?: "bottom" | "left" | "right";
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const initial =
    from === "left"  ? { opacity: 0, x: -32 } :
    from === "right" ? { opacity: 0, x: 32 } :
                       { opacity: 0, y: 28 };
  return (
    <motion.div ref={ref} className={className}
      initial={initial}
      animate={inView ? { opacity: 1, x: 0, y: 0 } : {}}
      transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1], delay }}
    >
      {children}
    </motion.div>
  );
}

// ─── Parallax Ghost Number ───────────────────────────────────────────────────
function ParallaxNum({ value, light = false }: { value: string; light?: boolean }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [50, -50]);
  return (
    <motion.div ref={ref} style={{ y }} className="absolute select-none pointer-events-none">
      <span style={{
        ...H,
        fontSize: "clamp(100px, 14vw, 180px)",
        color: light ? "rgba(11,11,13,0.04)" : "rgba(255,255,255,0.05)",
        lineHeight: 1,
      }}>
        {value}
      </span>
    </motion.div>
  );
}

// ─── OTP Card (floating proof element) ──────────────────────────────────────
function OtpProofCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.9, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="absolute bottom-8 left-8 rounded-2xl px-5 py-4"
      style={{
        background: "rgba(8,8,10,0.75)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        border: "1px solid rgba(255,255,255,0.08)",
        boxShadow: "0 20px 60px rgba(0,0,0,0.4)",
        minWidth: 220,
      }}
    >
      <div className="flex items-center gap-2 mb-3">
        <div className="w-2 h-2 rounded-full" style={{ background: BRAND_COLORS.green }} />
        <span style={{ ...BM, fontSize: "10px", color: "#7D7D7D", letterSpacing: "0.06em", textTransform: "uppercase" as const }}>
          Trip secured
        </span>
      </div>
      <div className="flex items-center gap-2 mb-1">
        <span style={{ ...H, fontSize: "28px", color: "#FFFFFF", letterSpacing: "-0.04em" }}>4 · 8 · 2 · 1</span>
      </div>
      <span style={{ ...B, fontSize: "11px", color: "#7D7D7D" }}>
        Show this code at pickup
      </span>
    </motion.div>
  );
}

// ─── Props ───────────────────────────────────────────────────────────────────
interface LandingPageDProps {
  onGetStarted?: () => void;
  onDriveWithUs?: () => void;
  onHotelPartner?: () => void;
  onFleetOwner?: () => void;
}

// ════════════════════════════════════════════════════════════════════════════
export function LandingPageD({ onGetStarted, onDriveWithUs, onHotelPartner, onFleetOwner }: LandingPageDProps) {
  const heroRef = useRef(null);
  const { scrollYProgress: heroScroll } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroImgScale = useTransform(heroScroll, [0, 1], [1, 1.08]);
  const heroImgY     = useTransform(heroScroll, [0, 1], ["0%", "12%"]);
  const [businessOpen, setBusinessOpen] = useState(false);

  return (
    <div className="w-full" style={{ background: "#FAFAFA" }}>

      {/* ══════════════════════════════════════════════════════════════════
          NAV
      ══════════════════════════════════════════════════════════════════ */}
      <nav
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-10"
        style={{
          height: 64,
          background: "rgba(6,6,8,0.82)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(255,255,255,0.05)",
        }}
      >
        <JetLogo variant="full" mode="light" height={26} />

        <div className="hidden md:flex items-center gap-8">
          <button
            style={{ ...BM, fontSize: "14px", color: "#979797" }}
            onClick={onGetStarted}
            className="transition-colors hover:text-white"
          >
            Ride
          </button>
          <button
            style={{ ...BM, fontSize: "14px", color: "#979797" }}
            onClick={onDriveWithUs}
            className="transition-colors hover:text-white"
          >
            Drive
          </button>

          {/* Business dropdown */}
          <div className="relative">
            <button
              style={{ ...BM, fontSize: "14px", color: businessOpen ? "#FFFFFF" : "#979797" }}
              onClick={() => setBusinessOpen(o => !o)}
              onBlur={() => setTimeout(() => setBusinessOpen(false), 150)}
              className="transition-colors hover:text-white flex items-center gap-1"
            >
              Business
              <motion.span
                animate={{ rotate: businessOpen ? 180 : 0 }}
                transition={{ duration: 0.2 }}
                style={{ display: "flex" }}
              >
                <ChevronDown size={13} />
              </motion.span>
            </button>

            <AnimatePresence>
              {businessOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 6, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 4, scale: 0.97 }}
                  transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute top-full mt-2 right-0 rounded-2xl overflow-hidden"
                  style={{
                    width: 220,
                    background: "rgba(18,18,22,0.96)",
                    backdropFilter: "blur(20px)",
                    WebkitBackdropFilter: "blur(20px)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    boxShadow: "0 16px 40px rgba(0,0,0,0.5)",
                  }}
                >
                  <button
                    onClick={() => { setBusinessOpen(false); onHotelPartner?.(); }}
                    className="w-full flex items-center gap-3 px-4 py-3.5 transition-colors text-left"
                    style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}
                    onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.04)")}
                    onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                  >
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                      style={{ background: `${BRAND_COLORS.green}14` }}>
                      <Building2 size={13} style={{ color: BRAND_COLORS.green }} />
                    </div>
                    <div>
                      <p style={{ ...BM, fontSize: "13px", color: "#FFFFFF" }}>Hotel partners</p>
                      <p style={{ ...B, fontSize: "11px", color: "#636363" }}>Guest transport solutions</p>
                    </div>
                  </button>
                  <button
                    onClick={() => { setBusinessOpen(false); onFleetOwner?.(); }}
                    className="w-full flex items-center gap-3 px-4 py-3.5 transition-colors text-left"
                    onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.04)")}
                    onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                  >
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                      style={{ background: `${BRAND_COLORS.green}14` }}>
                      <Car size={13} style={{ color: BRAND_COLORS.green }} />
                    </div>
                    <div>
                      <p style={{ ...BM, fontSize: "13px", color: "#FFFFFF" }}>Fleet owners</p>
                      <p style={{ ...B, fontSize: "11px", color: "#636363" }}>Manage your vehicles</p>
                    </div>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <motion.button
          onClick={onGetStarted}
          whileTap={{ scale: 0.97 }}
          className="h-9 px-5 rounded-xl flex items-center gap-2"
          style={{ background: BRAND_COLORS.green }}
        >
          <span style={{ ...BM, fontSize: "13px", color: "#FFFFFF" }}>Get JET</span>
        </motion.button>
      </nav>

      {/* ══════════════════════════════════════════════════════════════════
          HERO — Spatial dark, parallax image, floating OTP proof
      ══════════════════════════════════════════════════════════════════ */}
      <section
        ref={heroRef}
        className="relative overflow-hidden flex flex-col justify-end"
        style={{ height: "100svh", minHeight: 640, background: "#06060A" }}
      >
        {/* Parallax image */}
        <motion.div
          className="absolute inset-0"
          style={{ scale: heroImgScale, y: heroImgY }}
        >
          <img src={IMG_HERO} alt="" className="w-full h-full object-cover" style={{ opacity: 0.5 }} />
          <div className="absolute inset-0" style={{
            background: "linear-gradient(to bottom, rgba(6,6,8,0.2) 0%, rgba(6,6,8,0.1) 40%, rgba(6,6,8,0.85) 100%)",
          }} />
        </motion.div>

        {/* Ambient green glow */}
        <div className="absolute inset-0 pointer-events-none" style={{
          background: `radial-gradient(ellipse 60% 40% at 80% 60%, ${BRAND_COLORS.green}08 0%, transparent 70%)`,
        }} />

        {/* Content */}
        <div className="relative z-10 px-6 md:px-16 pb-16 max-w-5xl">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="flex items-center gap-2 mb-6"
          >
            <div className="w-1.5 h-1.5 rounded-full" style={{ background: BRAND_COLORS.green }} />
            <span style={{ ...BM, fontSize: "11px", color: "#7D7D7D", letterSpacing: "0.06em", textTransform: "uppercase" as const }}>
              Now in Nigeria
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            style={{ ...H, fontSize: "clamp(44px, 7vw, 88px)", color: "#FFFFFF", maxWidth: 700 }}
          >
            A different class<br />of ride
            <span style={{ color: BRAND_COLORS.green }}>.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            style={{ ...B, fontSize: "clamp(15px, 2vw, 18px)", color: "#979797", maxWidth: 500, marginTop: 16 }}
          >
            Premium e-hailing across Nigeria. Safe trips, upfront pricing,
            and Nigeria's first mixed EV fleet.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.65, duration: 0.6 }}
            className="flex flex-wrap items-center gap-3 mt-8"
          >
            <motion.button
              onClick={onGetStarted}
              whileTap={{ scale: 0.97 }}
              className="h-12 px-7 rounded-xl flex items-center gap-2"
              style={{ background: BRAND_COLORS.green, minHeight: 44 }}
            >
              <span style={{ ...BM, fontSize: "15px", color: "#FFFFFF" }}>Ride with JET</span>
              <ArrowRight size={15} color="#FFFFFF" />
            </motion.button>

            <motion.button
              onClick={onDriveWithUs}
              whileTap={{ scale: 0.97 }}
              className="h-12 px-7 rounded-xl flex items-center gap-2"
              style={{
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.1)",
                minHeight: 44,
              }}
            >
              <span style={{ ...BM, fontSize: "15px", color: "#B5B5B5" }}>Drive & earn</span>
            </motion.button>
          </motion.div>
        </div>

        {/* Floating OTP proof card */}
        <div className="absolute right-8 md:right-16 bottom-12 hidden md:block">
          <OtpProofCard />
        </div>

        {/* Fade to light */}
        <div className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none" style={{
          background: "linear-gradient(to bottom, transparent, #FAFAFA)",
        }} />
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          CLAIM — Editorial, full-width, asymmetric
      ══════════════════════════════════════════════════════════════════ */}
      <section className="px-6 md:px-16 py-24 md:py-32 max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 md:gap-20 items-end">
          <Reveal from="left">
            <span style={{ ...BM, fontSize: "11px", color: BRAND_COLORS.green, letterSpacing: "0.06em", textTransform: "uppercase" as const }}>
              Our stance
            </span>
            <h2 style={{ ...H, fontSize: "clamp(32px, 5vw, 56px)", color: "#0B0B0D", marginTop: 16, maxWidth: 480 }}>
              Built around how Nigeria actually moves
              <span style={{ color: BRAND_COLORS.green }}>.</span>
            </h2>
          </Reveal>

          <Reveal delay={0.15} from="right">
            <p style={{ ...B, fontSize: "17px", color: "#6E6E70", lineHeight: 1.7 }}>
              Every route, every payment option, every decision — designed around
              Nigerian roads, Nigerian riders, and the people who drive them.
              Not adapted. Built.
            </p>
            <div className="mt-8 h-px w-16" style={{ background: BRAND_COLORS.green }} />
          </Reveal>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          SAFETY — Bento grid, dark section
      ══════════════════════════════════════════════════════════════════ */}
      <section style={{ background: "#0B0B0D" }} className="px-6 md:px-16 py-24 md:py-32">
        <div className="max-w-6xl mx-auto">
          <Reveal>
            <span style={{ ...BM, fontSize: "11px", color: BRAND_COLORS.green, letterSpacing: "0.06em", textTransform: "uppercase" as const }}>
              Safety
            </span>
            <h2 style={{ ...H, fontSize: "clamp(28px, 4vw, 48px)", color: "#FFFFFF", marginTop: 12, maxWidth: 520 }}>
              The ride starts and ends on your terms
              <span style={{ color: BRAND_COLORS.green }}>.</span>
            </h2>
          </Reveal>

          {/* Bento grid */}
          <div className="grid md:grid-cols-3 gap-4 mt-12">
            {/* Large card — main OTP explanation */}
            <Reveal delay={0.1} className="md:col-span-2">
              <div
                className="rounded-3xl p-8 h-full relative overflow-hidden"
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.06)",
                  minHeight: 280,
                }}
              >
                <div className="w-10 h-10 rounded-2xl flex items-center justify-center mb-6"
                  style={{ background: `${BRAND_COLORS.green}12`, border: `1px solid ${BRAND_COLORS.green}20` }}>
                  <Shield size={18} style={{ color: BRAND_COLORS.green }} />
                </div>
                <h3 style={{ ...H, fontSize: "22px", color: "#FFFFFF", marginBottom: 12 }}>
                  Two-point OTP verification
                </h3>
                <p style={{ ...B, fontSize: "15px", color: "#979797", maxWidth: 400 }}>
                  One code at pickup. One code at drop-off. Your trip only completes
                  when you confirm it — no ambiguity, no disputes.
                </p>

                {/* Decorative OTP digits */}
                <div className="absolute bottom-8 right-8 flex items-center gap-3">
                  {["4", "8", "2", "1"].map((d, i) => (
                    <div key={i} className="w-10 h-12 rounded-xl flex items-center justify-center"
                      style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
                      <span style={{ ...H, fontSize: "20px", color: "#FFFFFF" }}>{d}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>

            {/* Tracking card */}
            <Reveal delay={0.2}>
              <div
                className="rounded-3xl p-8 h-full"
                style={{
                  background: `${BRAND_COLORS.green}08`,
                  border: `1px solid ${BRAND_COLORS.green}18`,
                  minHeight: 280,
                }}
              >
                <div className="w-10 h-10 rounded-2xl flex items-center justify-center mb-6"
                  style={{ background: `${BRAND_COLORS.green}15` }}>
                  <MapPin size={18} style={{ color: BRAND_COLORS.green }} />
                </div>
                <h3 style={{ ...H, fontSize: "20px", color: "#FFFFFF", marginBottom: 12 }}>
                  Live tracking
                </h3>
                <p style={{ ...B, fontSize: "14px", color: "#979797" }}>
                  Share your ride with anyone you trust, in real time. From pickup to drop-off.
                </p>
              </div>
            </Reveal>

            {/* Start OTP */}
            <Reveal delay={0.25}>
              <div className="rounded-3xl p-8"
                style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.05)" }}>
                <Lock size={18} style={{ color: "#7D7D7D", marginBottom: 16 }} />
                <h3 style={{ ...H, fontSize: "17px", color: "#FFFFFF", marginBottom: 8 }}>Start OTP</h3>
                <p style={{ ...B, fontSize: "13px", color: "#7D7D7D" }}>
                  Your driver only moves when you confirm. No unauthorised departures.
                </p>
              </div>
            </Reveal>

            {/* End OTP */}
            <Reveal delay={0.3}>
              <div className="rounded-3xl p-8"
                style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.05)" }}>
                <Shield size={18} style={{ color: "#7D7D7D", marginBottom: 16 }} />
                <h3 style={{ ...H, fontSize: "17px", color: "#FFFFFF", marginBottom: 8 }}>End OTP</h3>
                <p style={{ ...B, fontSize: "13px", color: "#7D7D7D" }}>
                  Your trip only closes when you arrive safely and confirm.
                </p>
              </div>
            </Reveal>

            {/* Verified drivers */}
            <Reveal delay={0.35}>
              <div className="rounded-3xl p-8"
                style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.05)" }}>
                <Users size={18} style={{ color: "#7D7D7D", marginBottom: 16 }} />
                <h3 style={{ ...H, fontSize: "17px", color: "#FFFFFF", marginBottom: 8 }}>Verified drivers</h3>
                <p style={{ ...B, fontSize: "13px", color: "#7D7D7D" }}>
                  Every driver on the platform is screened before their first trip.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          HOW IT WORKS — Editorial light, parallax ghost numbers
      ══════════════════════════════════════════════════════════════════ */}
      <section className="px-6 md:px-16 py-24 md:py-36 max-w-6xl mx-auto">
        <Reveal>
          <span style={{ ...BM, fontSize: "11px", color: BRAND_COLORS.green, letterSpacing: "0.06em", textTransform: "uppercase" as const }}>
            How it works
          </span>
          <h2 style={{ ...H, fontSize: "clamp(28px, 4vw, 48px)", color: "#0B0B0D", marginTop: 12 }}>
            Three taps. You're moving.
          </h2>
        </Reveal>

        <div className="grid md:grid-cols-3 gap-0 mt-16 divide-x divide-black/5">
          {[
            {
              num: "01", icon: MapPin,
              title: "Set your destination",
              body: "Enter where you're going. JET finds the best route and shows you the fare before you confirm. No surprises.",
            },
            {
              num: "02", icon: Car,
              title: "Choose your ride",
              body: "JetEV for zero-emission trips. Comfort for everyday. Premium for when it matters. Price locked upfront.",
            },
            {
              num: "03", icon: Shield,
              title: "Ride with confidence",
              body: "Your driver is verified. Your trip is tracked. Your OTP ensures you arrive safely, every time.",
            },
          ].map((step, i) => {
            const Icon = step.icon;
            return (
              <Reveal key={step.num} delay={i * 0.12} className="relative px-0 md:px-10 py-8 first:pl-0 last:pr-0">
                <ParallaxNum value={step.num} light />
                <div className="relative z-10 pt-12">
                  <div className="w-10 h-10 rounded-2xl flex items-center justify-center mb-6"
                    style={{ background: `${BRAND_COLORS.green}10`, border: `1px solid ${BRAND_COLORS.green}18` }}>
                    <Icon size={18} style={{ color: BRAND_COLORS.green }} />
                  </div>
                  <h3 style={{ ...H, fontSize: "20px", color: "#0B0B0D", marginBottom: 12 }}>{step.title}</h3>
                  <p style={{ ...B, fontSize: "14px", color: "#6E6E70" }}>{step.body}</p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          EDITORIAL IMAGE — asymmetric split with city image
      ══════════════════════════════════════════════════════════════════ */}
      <section className="px-6 md:px-16 py-8 max-w-6xl mx-auto">
        <Reveal>
          <div className="grid md:grid-cols-5 gap-4" style={{ height: 520 }}>
            {/* Left — tall single image */}
            <div className="md:col-span-3 rounded-3xl overflow-hidden h-full">
              <img src={IMG_STREET} alt="Nigeria city" className="w-full h-full object-cover" />
            </div>
            {/* Right — two stacked images, each half height */}
            <div className="md:col-span-2 flex flex-col gap-4 h-full">
              <div className="rounded-3xl overflow-hidden flex-1">
                <img src={IMG_INTERIOR} alt="Premium car interior" className="w-full h-full object-cover" />
              </div>
              <div className="rounded-3xl overflow-hidden flex-1">
                <img src={IMG_ROAD} alt="Nigerian road" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          SUSTAINABILITY — Full-bleed dark with editorial text
      ══════════════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden py-24 md:py-36 mt-16" style={{ background: "#0B0B0D" }}>
        {/* Background image */}
        <div className="absolute inset-0">
          <img src={IMG_CHARGE} alt="" className="w-full h-full object-cover" style={{ opacity: 0.2 }} />
          <div className="absolute inset-0" style={{
            background: "linear-gradient(to right, rgba(11,11,13,0.97) 0%, rgba(11,11,13,0.7) 60%, rgba(11,11,13,0.4) 100%)",
          }} />
        </div>

        <div className="relative z-10 px-6 md:px-16 max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <Reveal from="left">
              <span style={{ ...BM, fontSize: "11px", color: BRAND_COLORS.green, letterSpacing: "0.06em", textTransform: "uppercase" as const }}>
                JetEV
              </span>
              <h2 style={{ ...H, fontSize: "clamp(28px, 4vw, 52px)", color: "#FFFFFF", marginTop: 12, marginBottom: 20 }}>
                Your ride
                <span style={{ color: BRAND_COLORS.green }}>.</span>
                <br />Less carbon
                <span style={{ color: BRAND_COLORS.green }}>.</span>
              </h2>
              <p style={{ ...B, fontSize: "16px", color: "#979797", maxWidth: 440, lineHeight: 1.7 }}>
                Nigeria's first mixed EV and gas fleet. Every time you choose JetEV,
                you're cutting emissions without cutting convenience. We track the
                impact so you can see exactly what you're contributing.
              </p>
              <motion.button
                onClick={onGetStarted}
                whileTap={{ scale: 0.97 }}
                className="mt-8 h-12 px-7 rounded-xl flex items-center gap-2"
                style={{ background: BRAND_COLORS.green, minHeight: 44 }}
              >
                <span style={{ ...BM, fontSize: "14px", color: "#FFFFFF" }}>Ride with JET</span>
                <ArrowRight size={14} color="#FFFFFF" />
              </motion.button>
            </Reveal>

            <Reveal delay={0.2} from="right">
              <div className="grid grid-cols-3 gap-4">
                {[
                  { value: "30%",  label: "EV fleet at launch" },
                  { value: "—",    label: "Carbon tracked per ride" },
                  { value: "2030", label: "100% EV target" },
                ].map(stat => (
                  <div key={stat.label} className="rounded-2xl p-5"
                    style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}>
                    <div style={{ ...H, fontSize: "28px", color: BRAND_COLORS.green, marginBottom: 6 }}>{stat.value}</div>
                    <div style={{ ...B, fontSize: "12px", color: "#7D7D7D" }}>{stat.label}</div>
                  </div>
                ))}
              </div>
              <div className="mt-6 flex items-center gap-2">
                <Battery size={14} style={{ color: BRAND_COLORS.green }} />
                <span style={{ ...B, fontSize: "12px", color: "#636363" }}>
                  Choose JetEV at checkout to offset your trip's carbon footprint
                </span>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          DRIVERS — Editorial, asymmetric, honest
      ══════════════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img src={IMG_MAN} alt="" className="w-full h-full object-cover" style={{ opacity: 0.12 }} />
        </div>
        <div className="relative z-10 px-6 md:px-16 py-24 md:py-36 max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <Reveal from="left">
              <span style={{ ...BM, fontSize: "11px", color: BRAND_COLORS.green, letterSpacing: "0.06em", textTransform: "uppercase" as const }}>
                Drive with JET
              </span>
              <h2 style={{ ...H, fontSize: "clamp(32px, 5vw, 56px)", color: "#0B0B0D", marginTop: 12, marginBottom: 20 }}>
                Your car
                <span style={{ color: BRAND_COLORS.green }}>.</span>{" "}
                Your city
                <span style={{ color: BRAND_COLORS.green }}>.</span>
                <br />Your income
                <span style={{ color: BRAND_COLORS.green }}>.</span>
              </h2>
              <p style={{ ...B, fontSize: "17px", color: "#6E6E70", lineHeight: 1.7, maxWidth: 440 }}>
                Join the platform built to respect the people who power it.
                Weekly payouts, transparent earnings, and a company that
                actually picks up when you call.
              </p>
              <motion.button
                onClick={onDriveWithUs}
                whileTap={{ scale: 0.97 }}
                className="mt-8 h-12 px-7 rounded-xl flex items-center gap-2"
                style={{ background: "#0B0B0D", minHeight: 44 }}
              >
                <span style={{ ...BM, fontSize: "15px", color: "#FFFFFF" }}>Start driving</span>
                <ArrowRight size={15} color="#FFFFFF" />
              </motion.button>
            </Reveal>

            <Reveal delay={0.15} from="right">
              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: Zap,      title: "Weekly payouts",      body: "Earnings transferred every week, no delays." },
                  { icon: Shield,   title: "Trip protection",     body: "Every ride is tracked and recorded end-to-end." },
                  { icon: MapPin,   title: "Your routes",         body: "Choose when and where you drive. No quotas." },
                  { icon: Users,    title: "Real support",        body: "A team that responds when something goes wrong." },
                ].map((item, i) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.title} className="rounded-2xl p-5"
                      style={{
                        background: i % 2 === 0 ? "#FFFFFF" : "#F5F5F5",
                        border: "1px solid rgba(0,0,0,0.05)",
                      }}>
                      <Icon size={16} style={{ color: BRAND_COLORS.green, marginBottom: 12 }} />
                      <div style={{ ...BM, fontSize: "14px", color: "#0B0B0D", marginBottom: 4 }}>{item.title}</div>
                      <div style={{ ...B, fontSize: "12px", color: "#8E8E8E" }}>{item.body}</div>
                    </div>
                  );
                })}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          BUSINESS — Two cards, editorial light
      ══════════════════════════════════════════════════════════════════ */}
      <section className="px-6 md:px-16 py-24 md:py-32" style={{ background: "#F5F5F5" }}>
        <div className="max-w-6xl mx-auto">
          <Reveal>
            <span style={{ ...BM, fontSize: "11px", color: BRAND_COLORS.green, letterSpacing: "0.06em", textTransform: "uppercase" as const }}>
              For business
            </span>
            <h2 style={{ ...H, fontSize: "clamp(28px, 4vw, 48px)", color: "#0B0B0D", marginTop: 12, maxWidth: 500 }}>
              Move your guests. Manage your fleet
              <span style={{ color: BRAND_COLORS.green }}>.</span>
            </h2>
          </Reveal>

          <div className="grid md:grid-cols-2 gap-6 mt-12 items-stretch">
            {[
              {
                img: IMG_HOTEL,
                label: "Hotel partners",
                icon: Building2,
                title: "Premium transport for your guests, on demand.",
                body: "Branded booking, seamless billing, VIP coordination — integrated into how you already work.",
                onAction: onHotelPartner,
              },
              {
                img: IMG_FLEET,
                label: "Fleet owners",
                icon: Car,
                title: "Real-time vehicle tracking. Revenue analytics. One dashboard.",
                body: "Built for operators who run at scale. Driver performance, maintenance scheduling, payout management.",
                onAction: onFleetOwner,
              },
            ].map(card => {
              const Icon = card.icon;
              return (
                <Reveal key={card.label} className="h-full">
                  <div className="rounded-3xl overflow-hidden group flex flex-col h-full" style={{ border: "1px solid rgba(0,0,0,0.06)" }}>
                    <div className="relative overflow-hidden" style={{ height: 280 }}>
                      <img
                        src={card.img}
                        alt={card.label}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0" style={{
                        background: "linear-gradient(to bottom, transparent 40%, rgba(0,0,0,0.5) 100%)",
                      }} />
                      <div className="absolute bottom-5 left-5 flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg flex items-center justify-center"
                          style={{ background: `${BRAND_COLORS.green}18` }}>
                          <Icon size={14} style={{ color: BRAND_COLORS.green }} />
                        </div>
                        <span style={{ ...BM, fontSize: "12px", color: "#FFFFFF" }}>{card.label}</span>
                      </div>
                    </div>
                    <div className="p-6 bg-white flex flex-col flex-1">
                      <h3 style={{ ...H, fontSize: "18px", color: "#0B0B0D", marginBottom: 8 }}>{card.title}</h3>
                      <p style={{ ...B, fontSize: "14px", color: "#6E6E70", marginBottom: 16, flex: 1 }}>{card.body}</p>
                      <button
                        onClick={card.onAction}
                        className="flex items-center gap-1.5 group/link"
                        style={{ ...BM, fontSize: "13px", color: BRAND_COLORS.green, background: "none", border: "none", padding: 0, cursor: "pointer" }}
                      >
                        Learn more
                        <ArrowUpRight size={14} className="transition-transform group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5" />
                      </button>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          DOWNLOAD CTA — Dark, centered, strong close
      ══════════════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden py-28 md:py-40" style={{ background: "#06060A" }}>
        <div className="absolute inset-0 pointer-events-none" style={{
          background: `radial-gradient(ellipse 50% 60% at 50% 100%, ${BRAND_COLORS.green}0A 0%, transparent 70%)`,
        }} />

        <div className="relative z-10 px-6 text-center max-w-2xl mx-auto">
          <Reveal>
            <h2 style={{ ...H, fontSize: "clamp(36px, 6vw, 72px)", color: "#FFFFFF", marginBottom: 20 }}>
              Ready to move differently
              <span style={{ color: BRAND_COLORS.green }}>?</span>
            </h2>
            <p style={{ ...B, fontSize: "17px", color: "#7D7D7D", marginBottom: 36 }}>
              Download JET and experience what premium e-hailing in Nigeria actually feels like.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <motion.a
                href={APP_STORE_URL}
                whileTap={{ scale: 0.97 }}
                className="h-14 px-8 rounded-2xl flex items-center gap-3"
                style={{ background: "#FFFFFF", minHeight: 44 }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" fill="#0B0B0D"/>
                </svg>
                <div className="text-left">
                  <div style={{ ...B, fontSize: "10px", color: "#6E6E70", lineHeight: 1 }}>Download on the</div>
                  <div style={{ ...H, fontSize: "16px", color: "#0B0B0D", lineHeight: 1.2 }}>App Store</div>
                </div>
              </motion.a>

              <motion.a
                href={PLAY_STORE_URL}
                whileTap={{ scale: 0.97 }}
                className="h-14 px-8 rounded-2xl flex items-center gap-3"
                style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", minHeight: 44 }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M3.18 23.76c.33.18.7.22 1.06.12L15.38 12 11.8 8.42 3.18 23.76zM20.64 10.27l-2.84-1.63-3.83 3.83 3.83 3.83 2.87-1.65c.82-.47.82-1.91-.03-2.38zM2.01 1.05C1.95 1.22 1.92 1.4 1.92 1.6v20.8c0 .2.03.38.09.54L13.62 12 2.01 1.05zM3.18.24L11.8 8.87l3.58-3.58L4.24.12A1.3 1.3 0 003.18.24z" fill="#B5B5B5"/>
                </svg>
                <div className="text-left">
                  <div style={{ ...B, fontSize: "10px", color: "#636363", lineHeight: 1 }}>Get it on</div>
                  <div style={{ ...H, fontSize: "16px", color: "#B5B5B5", lineHeight: 1.2 }}>Google Play</div>
                </div>
              </motion.a>
            </div>

            <div className="mt-8">
              <button
                onClick={onDriveWithUs}
                style={{ ...BM, fontSize: "13px", color: "#636363" }}
                className="hover:text-white transition-colors"
              >
                Drive & earn with JET →
              </button>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          FOOTER
      ══════════════════════════════════════════════════════════════════ */}
      <footer
        className="px-6 md:px-16 py-8 flex flex-col md:flex-row items-center justify-between gap-4"
        style={{ background: "#06060A", borderTop: "1px solid rgba(255,255,255,0.05)" }}
      >
        <JetLogo variant="full" mode="light" height={22} />

        <div className="flex items-center gap-6">
          {[
            { label: "Privacy", href: "#" },
            { label: "Terms",   href: "#" },
            { label: "Support", href: `mailto:${CONTACT_EMAIL}` },
          ].map(link => (
            <a key={link.label} href={link.href}
              style={{ ...B, fontSize: "13px", color: "#636363" }}
              className="hover:text-white transition-colors">
              {link.label}
            </a>
          ))}
        </div>

        <span style={{ ...B, fontSize: "12px", color: "#5D5D5D" }}>
          © 2026 JET Nigeria.
        </span>
      </footer>

    </div>
  );
}
