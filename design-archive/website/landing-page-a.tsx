/**
 * JET Landing Page — Version A: "EDITORIAL GRAVITY"
 *
 * DNA: Waabi's editorial mastery — massive white space, asymmetric layouts,
 * typography that commands attention, scattered image constellations.
 *
 * Key moves:
 * - Left-aligned oversized headline (not centered — editorial asymmetry)
 * - Split compositions: text/image in tension, never balanced
 * - Scattered image constellation for "The Platform" section
 * - Accordion feature reveals (Safe → Sustainable → Smart)
 * - Giant ghost numbers as section markers
 * - Green used only as scalpel (dots, underlines, CTA)
 * - Documentary photography style
 */

import { useState, useRef } from "react";
import { motion, useInView, AnimatePresence } from "motion/react";
import {
  ArrowRight,
  ArrowUpRight,
  Shield,
  Leaf,
  Zap,
  ChevronDown,
  MapPin,
  Car,
  Building2,
  Users,
} from "lucide-react";
import { BRAND_COLORS } from "../../config/brand";
import { JetLogo } from "../brand/jet-logo";

// ─── Images ───
const IMG_HERO = "https://images.unsplash.com/photo-1574612357719-5dd0a272afe2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxMYWdvcyUyME5pZ2VyaWElMjBhZXJpYWwlMjBjaXR5c2NhcGUlMjBuaWdodCUyMGxpZ2h0c3xlbnwxfHx8fDE3NzI5MzE3OTl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral";
const IMG_EV = "https://images.unsplash.com/photo-1750830331454-86d5c088ca7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBlbGVjdHJpYyUyMHZlaGljbGUlMjBkYXJrJTIwc3R1ZGlvfGVufDF8fHx8MTc3MjkzMTgwMHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral";
const IMG_WOMAN = "https://images.unsplash.com/photo-1772714601002-fbb0fea8a911?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhZnJpY2FuJTIwd29tYW4lMjBwcm9mZXNzaW9uYWwlMjBwb3J0cmFpdCUyMG1vZGVybnxlbnwxfHx8fDE3NzI5MzE4MDB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral";
const IMG_STREET = "https://images.unsplash.com/photo-1658402834638-c6f65944b551?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxMYWdvcyUyMHN0cmVldCUyMHZpYnJhbnQlMjB1cmJhbiUyMGxpZmV8ZW58MXx8fHwxNzcyOTMxODAxfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral";
const IMG_ROAD = "https://images.unsplash.com/photo-1767681774518-dc28fec12c5e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBjaXR5JTIwcm9hZCUyMGhpZ2h3YXklMjBzdW5zZXQlMjBnb2xkZW58ZW58MXx8fHwxNzcyOTMxODA2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral";
const IMG_CHARGE = "https://images.unsplash.com/photo-1768310465625-5824a01fff4c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGVjdHJpYyUyMGNhciUyMGNoYXJnaW5nJTIwc3RhdGlvbiUyMG1vZGVybnxlbnwxfHx8fDE3NzI4NzU5OTJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral";
const IMG_TRAFFIC = "https://images.unsplash.com/photo-1771495604392-2008757fb32a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhZnJpY2FuJTIwY2l0eSUyMHRyYWZmaWMlMjBidXN5JTIwaW50ZXJzZWN0aW9ufGVufDF8fHx8MTc3MjkzMTgwN3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral";
const IMG_MAN = "https://images.unsplash.com/photo-1550051414-003c9007794c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhZnJpY2FuJTIwbWFuJTIwc21pbGluZyUyMHByb2Zlc3Npb25hbCUyMGhlYWRzaG90fGVufDF8fHx8MTc3MjkzMTgwNXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral";

// ─── Typography ───
const H = { fontFamily: "var(--font-heading)", letterSpacing: "-0.03em", fontWeight: 600, lineHeight: 1.12 } as const;
const B = { fontFamily: "var(--font-body)", letterSpacing: "-0.02em", fontWeight: 400, lineHeight: 1.5 } as const;
const BM = { ...B, fontWeight: 500 } as const;

// ─── Fade In ───
function Reveal({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay }}
    >
      {children}
    </motion.div>
  );
}

// ─── Accordion Feature ───
function FeatureAccordion({ items }: { items: { title: string; body: string; icon: React.ElementType }[] }) {
  const [open, setOpen] = useState(0);
  return (
    <div className="flex flex-col">
      {items.map((item, i) => {
        const Icon = item.icon;
        const isOpen = open === i;
        return (
          <button
            key={item.title}
            className="text-left w-full"
            onClick={() => setOpen(i)}
            style={{ borderTop: i === 0 ? "none" : "1px solid rgba(0,0,0,0.06)" }}
          >
            <div className="flex items-center justify-between py-6">
              <div className="flex items-center gap-4">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center transition-colors duration-300"
                  style={{ background: isOpen ? `${BRAND_COLORS.green}12` : "rgba(0,0,0,0.03)" }}
                >
                  <Icon className="w-5 h-5" style={{ color: isOpen ? BRAND_COLORS.green : "rgba(11,11,13,0.3)" }} />
                </div>
                <span
                  style={{
                    ...H,
                    fontSize: "clamp(24px, 3.5vw, 40px)",
                    letterSpacing: "-0.02em",
                    color: isOpen ? "#0B0B0D" : "rgba(11,11,13,0.2)",
                    transition: "color 0.3s",
                  }}
                >
                  {item.title}
                </span>
              </div>
              <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.3 }}>
                <ChevronDown className="w-5 h-5" style={{ color: "rgba(11,11,13,0.2)" }} />
              </motion.div>
            </div>
            <AnimatePresence>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  className="overflow-hidden"
                >
                  <p
                    className="pb-6 max-w-[480px]"
                    style={{ ...B, fontSize: "17px", color: "rgba(11,11,13,0.55)" }}
                  >
                    {item.body}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </button>
        );
      })}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// VERSION A — EDITORIAL GRAVITY
// ═══════════════════════════════════════════════════════════════════════════════
interface Props {
  onGetStarted?: () => void;
  onDriveWithUs?: () => void;
}

export function LandingPageA({ onGetStarted, onDriveWithUs }: Props) {
  return (
    <div className="relative w-full min-h-screen" style={{ background: "#FAFAFA" }}>
      {/* ── NAV ── */}
      <nav className="fixed top-0 left-0 right-0 z-50" style={{ background: "rgba(250,250,250,0.9)", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)", borderBottom: "1px solid rgba(0,0,0,0.04)" }}>
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 flex items-center justify-between h-16">
          <JetLogo variant="full" mode="dark" height={22} />
          <div className="hidden md:flex items-center gap-8">
            {["Platform", "Business", "Sustainability", "Drive"].map(l => (
              <a key={l} href={`#${l.toLowerCase()}`} style={{ ...BM, fontSize: "14px", color: "rgba(11,11,13,0.45)", textDecoration: "none" }} className="hover:!text-[#0B0B0D] transition-colors">
                {l}
              </a>
            ))}
          </div>
          <motion.button
            className="px-5 py-2 rounded-full"
            style={{ ...BM, fontSize: "14px", color: "#fff", background: "#0B0B0D" }}
            onClick={onGetStarted}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
          >
            Get started <ArrowUpRight className="inline w-3.5 h-3.5 ml-1" />
          </motion.button>
        </div>
      </nav>

      {/* ══════════════════════════════════════════════════════════════════════
          HERO — Asymmetric editorial split
      ══════════════════════════════════════════════════════════════════════ */}
      <section className="min-h-screen flex items-end relative overflow-hidden pt-16">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 w-full pb-16 lg:pb-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-0 items-end">
            {/* Left: Headline */}
            <div className="lg:col-span-7 pt-24 lg:pt-0">
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
              >
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-2 h-2 rounded-full" style={{ background: BRAND_COLORS.green }} />
                  <span style={{ ...BM, fontSize: "13px", color: "rgba(11,11,13,0.4)", letterSpacing: "0.04em", textTransform: "uppercase" }}>
                    E-hailing, reimagined
                  </span>
                </div>
                <h1 style={{ ...H, fontSize: "clamp(48px, 8vw, 110px)", color: "#0B0B0D" }}>
                  Move through
                  <br />
                  Lagos
                  <span style={{ color: BRAND_COLORS.green }}>.</span>
                  <br />
                  <span style={{ color: "rgba(11,11,13,0.12)" }}>Differently.</span>
                </h1>
              </motion.div>

              <motion.div
                className="flex items-center gap-4 mt-10"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.5 }}
              >
                <motion.button
                  className="px-7 py-4 rounded-full flex items-center gap-2"
                  style={{ ...BM, fontSize: "15px", color: "#fff", background: "#0B0B0D" }}
                  onClick={onGetStarted}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                >
                  Ride with JET
                  <ArrowRight className="w-4 h-4" />
                </motion.button>
                <motion.button
                  className="px-7 py-4 rounded-full flex items-center gap-2"
                  style={{ ...BM, fontSize: "15px", color: "#0B0B0D", background: "transparent", border: "1px solid rgba(0,0,0,0.1)" }}
                  onClick={onDriveWithUs}
                  whileHover={{ background: "rgba(0,0,0,0.03)" }}
                  whileTap={{ scale: 0.97 }}
                >
                  Drive & earn
                </motion.button>
              </motion.div>
            </div>

            {/* Right: Hero image */}
            <motion.div
              className="lg:col-span-5 relative"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.3 }}
            >
              <div className="rounded-3xl overflow-hidden aspect-[4/5] lg:aspect-[3/4]">
                <img src={IMG_HERO} alt="" className="w-full h-full object-cover" />
              </div>
              {/* Floating stat card */}
              <motion.div
                className="absolute -left-8 bottom-12 px-6 py-4 rounded-2xl hidden lg:block"
                style={{ background: "#fff", boxShadow: "0 20px 60px rgba(0,0,0,0.08)", border: "1px solid rgba(0,0,0,0.04)" }}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 }}
              >
                <div style={{ ...H, fontSize: "28px", color: "#0B0B0D" }}>50K<span style={{ color: BRAND_COLORS.green }}>+</span></div>
                <div style={{ ...B, fontSize: "13px", color: "rgba(11,11,13,0.4)" }}>Active riders in Lagos</div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          TRUST BAR — Giant numbers
      ══════════════════════════════════════════════════════════════════════ */}
      <section className="py-20 lg:py-28 px-6 lg:px-12" style={{ borderTop: "1px solid rgba(0,0,0,0.06)" }}>
        <div className="max-w-[1400px] mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-4">
            {[
              { num: "50K+", label: "Active riders" },
              { num: "8,200", label: "Verified drivers" },
              { num: "4.8", label: "Average rating" },
              { num: "12M+", label: "Trips completed" },
            ].map((s, i) => (
              <Reveal key={s.label} delay={i * 0.08}>
                <div>
                  <div style={{ ...H, fontSize: "clamp(36px, 5vw, 64px)", color: "#0B0B0D", lineHeight: 1 }}>
                    {s.num}
                  </div>
                  <div className="mt-2" style={{ ...B, fontSize: "15px", color: "rgba(11,11,13,0.35)" }}>
                    {s.label}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          FEATURES — Accordion (Waabi Safe/Scalable/Practical pattern)
      ══════════════════════════════════════════════════════════════════════ */}
      <section id="platform" className="py-24 lg:py-32 px-6 lg:px-12">
        <div className="max-w-[1400px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
            {/* Left: Image */}
            <Reveal>
              <div className="rounded-3xl overflow-hidden aspect-[4/5] sticky top-24">
                <img src={IMG_ROAD} alt="" className="w-full h-full object-cover" />
              </div>
            </Reveal>

            {/* Right: Accordion */}
            <div className="lg:pt-8">
              <Reveal>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-1.5 h-1.5 rounded-full" style={{ background: BRAND_COLORS.green }} />
                  <span style={{ ...BM, fontSize: "13px", color: BRAND_COLORS.green, letterSpacing: "0.04em", textTransform: "uppercase" }}>
                    The platform
                  </span>
                </div>
                <h2 className="mb-12" style={{ ...H, fontSize: "clamp(28px, 3.5vw, 44px)", color: "#0B0B0D" }}>
                  Built for how
                  <br />
                  Lagos actually moves.
                </h2>
              </Reveal>

              <Reveal delay={0.1}>
                <FeatureAccordion
                  items={[
                    {
                      title: "Safe",
                      icon: Shield,
                      body: "Trip-end OTP verification, real-time tracking, in-app SOS, and background-checked drivers. Every ride is monitored from pickup to drop-off. Share your trip live with anyone you trust.",
                    },
                    {
                      title: "Sustainable",
                      icon: Leaf,
                      body: "Nigeria's first mixed EV and gas fleet. Track your carbon savings per ride, choose JetEV for zero-emission trips. We're building the infrastructure for cleaner urban mobility.",
                    },
                    {
                      title: "Smart",
                      icon: Zap,
                      body: "Transparent fare estimates before you book. No hidden fees, no surge surprises. Multiple payment options — cash, cards, wallets. Smart routing that learns your patterns.",
                    },
                  ]}
                />
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          IMAGE CONSTELLATION — Scattered (Waabi manifesto pattern)
      ══════════════════════════════════════════════════════════════════════ */}
      <section className="py-24 lg:py-40 px-6 lg:px-12 relative overflow-hidden">
        <div className="max-w-[1400px] mx-auto relative" style={{ minHeight: "600px" }}>
          {/* Scattered images */}
          <Reveal delay={0}>
            <div className="absolute top-0 left-[5%] w-[140px] lg:w-[200px] rounded-2xl overflow-hidden aspect-square">
              <img src={IMG_WOMAN} alt="" className="w-full h-full object-cover" />
            </div>
          </Reveal>
          <Reveal delay={0.05}>
            <div className="absolute top-[10%] right-[8%] w-[160px] lg:w-[220px] rounded-2xl overflow-hidden aspect-[3/4]">
              <img src={IMG_STREET} alt="" className="w-full h-full object-cover" />
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="absolute top-[35%] left-[20%] w-[120px] lg:w-[180px] rounded-2xl overflow-hidden aspect-[4/3]">
              <img src={IMG_CHARGE} alt="" className="w-full h-full object-cover" />
            </div>
          </Reveal>
          <Reveal delay={0.15}>
            <div className="absolute bottom-[5%] right-[15%] w-[130px] lg:w-[190px] rounded-2xl overflow-hidden aspect-square">
              <img src={IMG_MAN} alt="" className="w-full h-full object-cover" />
            </div>
          </Reveal>
          <Reveal delay={0.08}>
            <div className="absolute bottom-[10%] left-[2%] w-[100px] lg:w-[150px] rounded-2xl overflow-hidden aspect-[3/4]">
              <img src={IMG_TRAFFIC} alt="" className="w-full h-full object-cover" />
            </div>
          </Reveal>

          {/* Center text */}
          <div className="relative z-10 flex flex-col items-center justify-center text-center py-40">
            <Reveal>
              <p style={{ ...B, fontSize: "15px", color: "rgba(11,11,13,0.3)" }} className="mb-4">
                We built our own road.
              </p>
            </Reveal>
            <Reveal delay={0.1}>
              <h2
                className="max-w-[640px]"
                style={{ ...H, fontSize: "clamp(22px, 3vw, 32px)", color: "#0B0B0D", lineHeight: 1.4, letterSpacing: "-0.02em" }}
              >
                A platform purpose-built for Nigerian mobility — combining electric and gas fleets, verified drivers, and transparent pricing into one seamless experience.
              </h2>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          HOW IT WORKS — Steps with giant ghost numbers
      ══════════════════════════════════════════════════════════════════════ */}
      <section className="py-24 lg:py-32 px-6 lg:px-12" style={{ background: "#0B0B0D" }}>
        <div className="max-w-[1400px] mx-auto">
          <Reveal>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-1.5 h-1.5 rounded-full" style={{ background: BRAND_COLORS.green }} />
              <span style={{ ...BM, fontSize: "13px", color: BRAND_COLORS.green, letterSpacing: "0.04em", textTransform: "uppercase" }}>
                How it works
              </span>
            </div>
            <h2 className="mb-20" style={{ ...H, fontSize: "clamp(28px, 4vw, 48px)", color: "#fff" }}>
              Three taps.
              <br />
              <span style={{ color: "rgba(255,255,255,0.2)" }}>You're moving.</span>
            </h2>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-8">
            {[
              { num: "01", icon: MapPin, title: "Set destination", body: "Enter where you're going. Save frequent places for one-tap booking." },
              { num: "02", icon: Car, title: "Choose your ride", body: "JetEV for green trips, Comfort for everyday, Premium for the extra touch." },
              { num: "03", icon: Shield, title: "Ride with confidence", body: "Driver's verified. Share your trip live. OTP ensures safe completion." },
            ].map((step, i) => (
              <Reveal key={step.num} delay={i * 0.1}>
                <div className="relative">
                  <div
                    style={{ ...H, fontSize: "120px", color: "rgba(255,255,255,0.03)", lineHeight: 1, position: "absolute", top: "-20px", left: "-8px" }}
                  >
                    {step.num}
                  </div>
                  <div className="relative pt-16">
                    <step.icon className="w-5 h-5 mb-4" style={{ color: BRAND_COLORS.green }} />
                    <h3 className="mb-2" style={{ ...H, fontSize: "20px", letterSpacing: "-0.02em", color: "#fff" }}>
                      {step.title}
                    </h3>
                    <p style={{ ...B, fontSize: "15px", color: "rgba(255,255,255,0.4)" }}>
                      {step.body}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          FOR BUSINESS — Asymmetric split
      ══════════════════════════════════════════════════════════════════════ */}
      <section id="business" className="py-24 lg:py-32 px-6 lg:px-12">
        <div className="max-w-[1400px] mx-auto">
          <Reveal>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-1.5 h-1.5 rounded-full" style={{ background: BRAND_COLORS.green }} />
              <span style={{ ...BM, fontSize: "13px", color: BRAND_COLORS.green, letterSpacing: "0.04em", textTransform: "uppercase" }}>
                For business
              </span>
            </div>
            <h2 className="mb-16" style={{ ...H, fontSize: "clamp(28px, 4vw, 48px)", color: "#0B0B0D" }}>
              Trusted by the best
              <br />
              <span style={{ color: "rgba(11,11,13,0.12)" }}>in the industry.</span>
            </h2>
          </Reveal>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {[
              { icon: Building2, title: "Fleet owners", body: "Full-stack fleet management — vehicle tracking, driver performance, revenue analytics, maintenance scheduling. Scale your transport operations with real-time intelligence.", img: IMG_ROAD },
              { icon: Users, title: "Hotel partners", body: "Premium guest transport on demand. Branded booking portal, VIP pickup coordination, and seamless billing integration. Your guests move like they should.", img: IMG_WOMAN },
            ].map((card, i) => (
              <Reveal key={card.title} delay={i * 0.1}>
                <div
                  className="rounded-3xl overflow-hidden group cursor-pointer transition-all duration-500 hover:shadow-xl"
                  style={{ background: "#fff", border: "1px solid rgba(0,0,0,0.06)" }}
                >
                  <div className="relative h-56 overflow-hidden">
                    <img
                      src={card.img}
                      alt=""
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, transparent 40%, rgba(0,0,0,0.4))" }} />
                  </div>
                  <div className="p-8">
                    <div className="flex items-center gap-3 mb-3">
                      <card.icon className="w-5 h-5" style={{ color: BRAND_COLORS.green }} />
                      <h3 style={{ ...H, fontSize: "22px", letterSpacing: "-0.02em", color: "#0B0B0D" }}>
                        {card.title}
                      </h3>
                    </div>
                    <p style={{ ...B, fontSize: "15px", color: "rgba(11,11,13,0.55)" }}>
                      {card.body}
                    </p>
                    <div className="mt-6 flex items-center gap-2" style={{ ...BM, fontSize: "14px", color: "#0B0B0D" }}>
                      Learn more <ArrowUpRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          SUSTAINABILITY — Full-bleed image + text overlay
      ══════════════════════════════════════════════════════════════════════ */}
      <section id="sustainability" className="relative overflow-hidden" style={{ minHeight: "80vh" }}>
        <img src={IMG_CHARGE} alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to right, rgba(11,11,13,0.85) 0%, rgba(11,11,13,0.4) 100%)" }} />
        <div className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-12 py-32 lg:py-40">
          <Reveal>
            <div className="max-w-[520px]">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-1.5 h-1.5 rounded-full" style={{ background: BRAND_COLORS.green }} />
                <span style={{ ...BM, fontSize: "13px", color: BRAND_COLORS.green, letterSpacing: "0.04em", textTransform: "uppercase" }}>
                  Sustainability
                </span>
              </div>
              <h2 style={{ ...H, fontSize: "clamp(32px, 5vw, 56px)", color: "#fff" }}>
                The future of
                <br />
                urban mobility
                <br />
                is electric.
              </h2>
              <p className="mt-6" style={{ ...B, fontSize: "17px", color: "rgba(255,255,255,0.55)" }}>
                Nigeria's first mixed EV & gas fleet. Every electric ride
                reduces emissions, and we track the impact so you can see
                the difference you're making.
              </p>
              <div className="flex items-center gap-6 mt-10">
                {[
                  { val: "30%", label: "EV fleet" },
                  { val: "2.4K", label: "Tons CO2 saved" },
                  { val: "100%", label: "EV by 2030" },
                ].map(s => (
                  <div key={s.label}>
                    <div style={{ ...H, fontSize: "28px", color: "#fff" }}>{s.val}</div>
                    <div style={{ ...B, fontSize: "13px", color: "rgba(255,255,255,0.35)" }}>{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          DRIVER RECRUITMENT — Simple split
      ══════════════════════════════════════════════════════════════════════ */}
      <section id="drive" className="py-24 lg:py-32 px-6 lg:px-12">
        <div className="max-w-[1400px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <Reveal>
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-1.5 h-1.5 rounded-full" style={{ background: BRAND_COLORS.green }} />
                  <span style={{ ...BM, fontSize: "13px", color: BRAND_COLORS.green, letterSpacing: "0.04em", textTransform: "uppercase" }}>
                    Earn with JET
                  </span>
                </div>
                <h2 style={{ ...H, fontSize: "clamp(28px, 4vw, 48px)", color: "#0B0B0D" }}>
                  Your car.
                  <br />
                  Your schedule.
                  <br />
                  <span style={{ color: "rgba(11,11,13,0.12)" }}>Your income.</span>
                </h2>
                <p className="mt-6 max-w-[420px]" style={{ ...B, fontSize: "17px", color: "rgba(11,11,13,0.55)" }}>
                  Join thousands of drivers earning on their own terms.
                  Weekly payouts, fuel bonuses, insurance coverage, and a
                  platform that respects your time.
                </p>
                <motion.button
                  className="mt-8 px-7 py-4 rounded-full flex items-center gap-2"
                  style={{ ...BM, fontSize: "15px", color: "#fff", background: "#0B0B0D" }}
                  onClick={onDriveWithUs}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                >
                  Start driving <ArrowRight className="w-4 h-4" />
                </motion.button>
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="rounded-3xl overflow-hidden aspect-[4/5]">
                <img src={IMG_MAN} alt="" className="w-full h-full object-cover" />
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          DOWNLOAD CTA
      ══════════════════════════════════════════════════════════════════════ */}
      <section className="py-24 lg:py-32 px-6 lg:px-12" style={{ background: "#0B0B0D" }}>
        <div className="max-w-[1400px] mx-auto text-center">
          <Reveal>
            <h2 style={{ ...H, fontSize: "clamp(36px, 6vw, 72px)", color: "#fff" }}>
              Ready to move
              <span style={{ color: BRAND_COLORS.green }}>?</span>
            </h2>
            <p className="mt-4 max-w-[400px] mx-auto" style={{ ...B, fontSize: "17px", color: "rgba(255,255,255,0.4)" }}>
              Download JET and experience premium mobility in Lagos.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10">
              <motion.button
                className="px-8 py-4 rounded-full flex items-center gap-2"
                style={{ ...BM, fontSize: "16px", color: "#0B0B0D", background: "#fff" }}
                onClick={onGetStarted}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
              >
                Ride with JET <ArrowRight className="w-4 h-4" />
              </motion.button>
              <motion.button
                className="px-8 py-4 rounded-full flex items-center gap-2"
                style={{ ...BM, fontSize: "16px", color: "rgba(255,255,255,0.7)", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}
                onClick={onDriveWithUs}
                whileHover={{ background: "rgba(255,255,255,0.1)" }}
                whileTap={{ scale: 0.97 }}
              >
                Drive & earn
              </motion.button>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="py-12 px-6 lg:px-12" style={{ background: "#0B0B0D", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <JetLogo variant="full" mode="light" height={20} />
          <div className="flex items-center gap-8">
            {["Privacy", "Terms", "Support"].map(l => (
              <a key={l} href="#" style={{ ...B, fontSize: "13px", color: "rgba(255,255,255,0.3)", textDecoration: "none" }}>
                {l}
              </a>
            ))}
          </div>
          <span style={{ ...B, fontSize: "13px", color: "rgba(255,255,255,0.2)" }}>
            &copy; 2026 JET. Lagos, Nigeria.
          </span>
        </div>
      </footer>
    </div>
  );
}
