/**
 * JET Landing Page — Version B: "CINEMATIC DARK"
 *
 * DNA: Avatr's cinematic luxury + Vexel's atmospheric depth.
 *
 * Key moves:
 * - Full dark mode — the entire page lives in darkness
 * - Full-bleed hero image with barely-there type (Avatr "Watch the Film")
 * - Glass panels for all content cards (C spine applied to web)
 * - Green ambient architectural glows
 * - Grid/dot pattern backgrounds (Vexel ceiling)
 * - Horizontal card scrolling for features
 * - Phone mockup section showing the app
 * - "Scroll to Discover" prompt
 */

import { useRef } from "react";
import { motion, useInView, useScroll, useTransform } from "motion/react";
import {
  ArrowRight,
  ArrowUpRight,
  Shield,
  Leaf,
  Zap,
  MapPin,
  Car,
  Battery,
  ChevronDown,
  Building2,
  Users,
  Play,
} from "lucide-react";
import { BRAND_COLORS } from "../../config/brand";
import { JetLogo } from "../brand/jet-logo";

// ─── Images ───
const IMG_HERO = "https://images.unsplash.com/photo-1574612357719-5dd0a272afe2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxMYWdvcyUyME5pZ2VyaWElMjBhZXJpYWwlMjBjaXR5c2NhcGUlMjBuaWdodCUyMGxpZ2h0c3xlbnwxfHx8fDE3NzI5MzE3OTl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral";
const IMG_INTERIOR = "https://images.unsplash.com/photo-1760553121156-56d1c9d3df15?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBjYXIlMjBpbnRlcmlvciUyMGRhc2hib2FyZCUyMG5pZ2h0fGVufDF8fHx8MTc3MjkzMTgwMXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral";
const IMG_EV = "https://images.unsplash.com/photo-1750830331454-86df5c088ca7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBlbGVjdHJpYyUyMHZlaGljbGUlMjBkYXJrJTIwc3R1ZGlvfGVufDF8fHx8MTc3MjkzMTgwMHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral";
const IMG_CHARGE = "https://images.unsplash.com/photo-1768310465625-5824a01fff4c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGVjdHJpYyUyMGNhciUyMGNoYXJnaW5nJTIwc3RhdGlvbiUyMG1vZGVybnxlbnwxfHx8fDE3NzI4NzU5OTJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral";
const IMG_ROAD = "https://images.unsplash.com/photo-1767681774518-dc28fec12c5e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBjaXR5JTIwcm9hZCUyMGhpZ2h3YXklMjBzdW5zZXQlMjBnb2xkZW58ZW58MXx8fHwxNzcyOTMxODA2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral";
const IMG_MAN = "https://images.unsplash.com/photo-1550051414-003c9007794c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhZnJpY2FuJTIwbWFuJTIwc21pbGluZyUyMHByb2Zlc3Npb25hbCUyMGhlYWRzaG90fGVufDF8fHx8MTc3MjkzMTgwNXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral";

// ─── Typography ───
const H = { fontFamily: "var(--font-heading)", letterSpacing: "-0.03em", fontWeight: 600, lineHeight: 1.12 } as const;
const B = { fontFamily: "var(--font-body)", letterSpacing: "-0.02em", fontWeight: 400, lineHeight: 1.5 } as const;
const BM = { ...B, fontWeight: 500 } as const;

// ─── Glass Panel ───
function GlassPanel({ children, className = "", style = {} }: { children: React.ReactNode; className?: string; style?: React.CSSProperties }) {
  return (
    <div
      className={`relative overflow-hidden ${className}`}
      style={{
        background: "rgba(255,255,255,0.04)",
        backdropFilter: "blur(40px)",
        WebkitBackdropFilter: "blur(40px)",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: "24px",
        ...style,
      }}
    >
      {/* Top edge highlight */}
      <div className="absolute top-0 left-[10%] right-[10%] h-px" style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)" }} />
      {children}
    </div>
  );
}

// ─── Reveal ───
function Reveal({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay }}
    >
      {children}
    </motion.div>
  );
}

// ─── Dot Grid Background ───
function DotGrid() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ opacity: 0.3 }}>
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.15) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// VERSION B — CINEMATIC DARK
// ═══════════════════════════════════════════════════════════════════════════════
interface Props {
  onGetStarted?: () => void;
  onDriveWithUs?: () => void;
}

export function LandingPageB({ onGetStarted, onDriveWithUs }: Props) {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <div className="relative w-full min-h-screen" style={{ background: "#060608" }}>
      {/* ── Ambient Glows ── */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px]" style={{ background: `radial-gradient(ellipse, ${BRAND_COLORS.green}08 0%, transparent 70%)` }} />
        <div className="absolute top-0 right-0 w-[600px] h-[600px]" style={{ background: `radial-gradient(ellipse at top right, ${BRAND_COLORS.green}05 0%, transparent 70%)` }} />
      </div>

      {/* ── NAV ── */}
      <nav className="fixed top-0 left-0 right-0 z-50" style={{ background: "rgba(6,6,8,0.8)", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 flex items-center justify-between h-16">
          <JetLogo variant="full" mode="light" height={22} />
          <div className="hidden md:flex items-center gap-8">
            {["Experience", "Platform", "Business", "Drive"].map(l => (
              <a key={l} href={`#${l.toLowerCase()}`} style={{ ...BM, fontSize: "14px", color: "rgba(255,255,255,0.35)", textDecoration: "none" }} className="hover:!text-white transition-colors">
                {l}
              </a>
            ))}
          </div>
          <motion.button
            className="px-5 py-2 rounded-full"
            style={{ ...BM, fontSize: "14px", color: "#0B0B0D", background: "#fff" }}
            onClick={onGetStarted}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
          >
            Get started
          </motion.button>
        </div>
      </nav>

      {/* ══════════════════════════════════════════════════════════════════════
          HERO — Full-bleed cinematic (Avatr style)
      ══════════════════════════════════════════════════════════════════════ */}
      <section ref={heroRef} className="relative w-full overflow-hidden" style={{ height: "100vh" }}>
        {/* Background image with parallax zoom */}
        <motion.div className="absolute inset-0" style={{ scale: heroScale }}>
          <img src={IMG_HERO} alt="" className="w-full h-full object-cover" style={{ opacity: 0.5 }} />
        </motion.div>

        {/* Gradient overlays */}
        <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, rgba(6,6,8,0.3) 0%, rgba(6,6,8,0.1) 40%, rgba(6,6,8,0.8) 100%)" }} />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to right, rgba(6,6,8,0.6) 0%, transparent 60%)" }} />

        {/* Green light leak at bottom */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[1200px] h-[200px]" style={{ background: `radial-gradient(ellipse, ${BRAND_COLORS.green}0C 0%, transparent 70%)` }} />

        {/* Hero content — bottom-left anchored (Avatr) */}
        <motion.div className="absolute inset-0 z-10 flex flex-col justify-end" style={{ opacity: heroOpacity }}>
          <div className="max-w-[1400px] mx-auto px-6 lg:px-12 pb-16 lg:pb-24 w-full">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            >
              <h1 style={{ ...H, fontSize: "clamp(40px, 7vw, 80px)", color: "#fff" }}>
                It's Time. For the Rise
                <br />
                of Premium Mobility.
              </h1>
            </motion.div>

            <motion.div
              className="flex items-center justify-between mt-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              {/* Left: CTA */}
              <div className="flex items-center gap-4">
                <motion.button
                  className="w-14 h-14 rounded-full flex items-center justify-center"
                  style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.15)" }}
                  whileHover={{ background: "rgba(255,255,255,0.15)" }}
                  onClick={onGetStarted}
                >
                  <Play className="w-5 h-5 text-white ml-0.5" />
                </motion.button>
                <span style={{ ...BM, fontSize: "15px", color: "rgba(255,255,255,0.6)" }}>
                  Experience JET
                </span>
              </div>

              {/* Right: Scroll indicator */}
              <div className="hidden lg:flex items-center gap-2">
                <span style={{ ...BM, fontSize: "13px", color: "rgba(255,255,255,0.3)" }}>
                  Scroll to Discover
                </span>
                <motion.div animate={{ y: [0, 6, 0] }} transition={{ duration: 2, repeat: Infinity }}>
                  <ChevronDown className="w-4 h-4" style={{ color: "rgba(255,255,255,0.3)" }} />
                </motion.div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          FEATURES — Horizontal Glass Cards (Vexel pattern)
      ══════════════════════════════════════════════════════════════════════ */}
      <section id="experience" className="relative py-24 lg:py-32 px-6 lg:px-12">
        <DotGrid />
        <div className="max-w-[1400px] mx-auto relative z-10">
          <Reveal>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-1.5 h-1.5 rounded-full" style={{ background: BRAND_COLORS.green }} />
              <span style={{ ...BM, fontSize: "13px", color: BRAND_COLORS.green, letterSpacing: "0.04em", textTransform: "uppercase" }}>
                The JET Experience
              </span>
            </div>
            <h2 className="mb-16" style={{ ...H, fontSize: "clamp(28px, 4vw, 48px)", color: "#fff" }}>
              Move through Lagos
              <br />
              <span style={{ color: "rgba(255,255,255,0.15)" }}>differently.</span>
            </h2>
          </Reveal>

          {/* Glass feature cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              {
                icon: Shield,
                title: "Ironclad Safety",
                body: "Trip-end OTP, real-time tracking, SOS, background-checked drivers. Every ride monitored from pickup to drop-off.",
                accent: BRAND_COLORS.green,
              },
              {
                icon: Leaf,
                title: "Zero-Emission Rides",
                body: "Nigeria's first mixed EV fleet. Track your carbon savings, choose JetEV for green trips that move the needle.",
                accent: "#34D079",
              },
              {
                icon: Zap,
                title: "Transparent Pricing",
                body: "See your fare before you book. No hidden fees, no surge surprises. Cash, cards, wallets — your choice.",
                accent: "#60A5FA",
              },
            ].map((f, i) => {
              const Icon = f.icon;
              return (
                <Reveal key={f.title} delay={i * 0.1}>
                  <GlassPanel className="p-7 h-full group cursor-pointer transition-all duration-500 hover:border-white/12">
                    {/* Glow on hover */}
                    <div
                      className="absolute -top-20 left-1/2 -translate-x-1/2 w-[200px] h-[200px] opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                      style={{ background: `radial-gradient(circle, ${f.accent}15 0%, transparent 70%)` }}
                    />
                    <div className="relative z-10">
                      <div
                        className="w-12 h-12 rounded-2xl flex items-center justify-center mb-6"
                        style={{ background: `${f.accent}10`, border: `1px solid ${f.accent}15` }}
                      >
                        <Icon className="w-5 h-5" style={{ color: f.accent }} />
                      </div>
                      <h3 className="mb-3" style={{ ...H, fontSize: "20px", letterSpacing: "-0.02em", color: "#fff" }}>
                        {f.title}
                      </h3>
                      <p style={{ ...B, fontSize: "15px", color: "rgba(255,255,255,0.4)" }}>
                        {f.body}
                      </p>
                    </div>
                  </GlassPanel>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          APP SHOWCASE — Glass panel with phone mockup simulation
      ══════════════════════════════════════════════════════════════════════ */}
      <section id="platform" className="py-24 lg:py-32 px-6 lg:px-12 relative">
        <div className="max-w-[1400px] mx-auto">
          <Reveal>
            <GlassPanel className="p-8 lg:p-12" style={{ borderRadius: "32px" }}>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                {/* Left: Content */}
                <div>
                  <span style={{ ...BM, fontSize: "13px", color: BRAND_COLORS.green, letterSpacing: "0.04em", textTransform: "uppercase" }}>
                    The app
                  </span>
                  <h2 className="mt-4 mb-6" style={{ ...H, fontSize: "clamp(28px, 3.5vw, 44px)", color: "#fff" }}>
                    Three taps.
                    <br />
                    You're moving.
                  </h2>
                  <div className="flex flex-col gap-6">
                    {[
                      { num: "01", title: "Set destination", body: "Smart suggestions based on your patterns" },
                      { num: "02", title: "Choose your ride", body: "JetEV, Comfort, or Premium — price upfront" },
                      { num: "03", title: "Ride with confidence", body: "Verified driver. Live sharing. OTP completion" },
                    ].map((step, i) => (
                      <motion.div
                        key={step.num}
                        className="flex items-start gap-4"
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 + i * 0.1 }}
                      >
                        <div
                          className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                          style={{ background: `${BRAND_COLORS.green}15`, border: `1px solid ${BRAND_COLORS.green}20` }}
                        >
                          <span style={{ ...BM, fontSize: "12px", color: BRAND_COLORS.green }}>{step.num}</span>
                        </div>
                        <div>
                          <div style={{ ...H, fontSize: "16px", letterSpacing: "-0.02em", color: "#fff" }}>{step.title}</div>
                          <div style={{ ...B, fontSize: "14px", color: "rgba(255,255,255,0.35)" }}>{step.body}</div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                  <motion.button
                    className="mt-8 px-7 py-3.5 rounded-full flex items-center gap-2"
                    style={{ ...BM, fontSize: "15px", color: "#0B0B0D", background: BRAND_COLORS.green }}
                    onClick={onGetStarted}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    Try JET now <ArrowRight className="w-4 h-4" />
                  </motion.button>
                </div>

                {/* Right: Phone mockup */}
                <div className="flex items-center justify-center">
                  <div
                    className="relative w-[280px] rounded-[40px] overflow-hidden"
                    style={{ aspectRatio: "9/19.5", background: "#111", border: "3px solid rgba(255,255,255,0.1)", boxShadow: `0 40px 80px rgba(0,0,0,0.5), 0 0 60px ${BRAND_COLORS.green}08` }}
                  >
                    <img src={IMG_INTERIOR} alt="JET app preview" className="w-full h-full object-cover" style={{ opacity: 0.85 }} />
                    {/* Phone screen overlay */}
                    <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.2) 0%, transparent 30%, rgba(0,0,0,0.6) 100%)" }} />
                    {/* Simulated UI elements */}
                    <div className="absolute bottom-0 left-0 right-0 p-5">
                      <div className="rounded-2xl p-4" style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(20px)", border: "1px solid rgba(255,255,255,0.1)" }}>
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-8 h-8 rounded-full" style={{ background: BRAND_COLORS.green }} />
                          <div>
                            <div style={{ ...BM, fontSize: "13px", color: "#fff" }}>JetEV</div>
                            <div style={{ ...B, fontSize: "11px", color: "rgba(255,255,255,0.4)" }}>2 min away</div>
                          </div>
                          <div className="ml-auto" style={{ ...H, fontSize: "16px", color: "#fff" }}>&#8358;2,400</div>
                        </div>
                        <div className="w-full h-10 rounded-xl flex items-center justify-center" style={{ background: BRAND_COLORS.green }}>
                          <span style={{ ...BM, fontSize: "14px", color: "#fff" }}>Confirm ride</span>
                        </div>
                      </div>
                    </div>
                    {/* Status bar mock */}
                    <div className="absolute top-0 left-0 right-0 h-12 flex items-center justify-center">
                      <div className="w-20 h-5 rounded-full" style={{ background: "#000" }} />
                    </div>
                  </div>
                </div>
              </div>
            </GlassPanel>
          </Reveal>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          STATS — Floating glass cards
      ══════════════════════════════════════════════════════════════════════ */}
      <section className="py-20 px-6 lg:px-12 relative">
        <div className="max-w-[1400px] mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { val: "50K+", label: "Active riders", accent: BRAND_COLORS.green },
              { val: "8,200", label: "Verified drivers", accent: "#60A5FA" },
              { val: "4.8", label: "Average rating", accent: "#FBBF24" },
              { val: "12M+", label: "Trips completed", accent: "#34D079" },
            ].map((s, i) => (
              <Reveal key={s.label} delay={i * 0.08}>
                <GlassPanel className="p-6 text-center">
                  <div style={{ ...H, fontSize: "clamp(28px, 4vw, 44px)", color: "#fff" }}>
                    {s.val}
                  </div>
                  <div className="mt-1" style={{ ...B, fontSize: "14px", color: "rgba(255,255,255,0.3)" }}>
                    {s.label}
                  </div>
                </GlassPanel>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          SUSTAINABILITY — Cinematic image section
      ══════════════════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden" style={{ minHeight: "80vh" }}>
        <img src={IMG_CHARGE} alt="" className="absolute inset-0 w-full h-full object-cover" style={{ opacity: 0.4 }} />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to right, rgba(6,6,8,0.9) 0%, rgba(6,6,8,0.5) 100%)" }} />
        
        {/* Green glow */}
        <div className="absolute bottom-0 right-[20%] w-[600px] h-[300px]" style={{ background: `radial-gradient(ellipse, ${BRAND_COLORS.green}0A 0%, transparent 70%)` }} />

        <div className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-12 py-32 lg:py-40">
          <Reveal>
            <div className="max-w-[560px]">
              <div className="flex items-center gap-3 mb-4">
                <Battery className="w-4 h-4" style={{ color: BRAND_COLORS.green }} />
                <span style={{ ...BM, fontSize: "13px", color: BRAND_COLORS.green, letterSpacing: "0.04em", textTransform: "uppercase" }}>
                  Sustainability
                </span>
              </div>
              <h2 style={{ ...H, fontSize: "clamp(32px, 5vw, 56px)", color: "#fff" }}>
                The future is
                <br />
                electric.
              </h2>
              <p className="mt-6" style={{ ...B, fontSize: "17px", color: "rgba(255,255,255,0.45)" }}>
                Nigeria's first mixed EV & gas fleet. Every electric ride reduces emissions,
                and we track the impact so you can see the difference you're making.
              </p>
              <div className="flex items-center gap-8 mt-10">
                {[
                  { val: "30%", label: "EV fleet" },
                  { val: "2.4K", label: "Tons CO2 saved" },
                  { val: "2030", label: "100% EV target" },
                ].map(s => (
                  <div key={s.label}>
                    <div style={{ ...H, fontSize: "24px", color: BRAND_COLORS.green }}>{s.val}</div>
                    <div style={{ ...B, fontSize: "13px", color: "rgba(255,255,255,0.3)" }}>{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          BUSINESS — Glass cards side by side
      ══════════════════════════════════════════════════════════════════════ */}
      <section id="business" className="py-24 lg:py-32 px-6 lg:px-12 relative">
        <DotGrid />
        <div className="max-w-[1400px] mx-auto relative z-10">
          <Reveal>
            <div className="text-center mb-16">
              <span style={{ ...BM, fontSize: "13px", color: BRAND_COLORS.green, letterSpacing: "0.04em", textTransform: "uppercase" }}>
                For business
              </span>
              <h2 className="mt-4" style={{ ...H, fontSize: "clamp(28px, 4vw, 48px)", color: "#fff" }}>
                Scale your operations.
              </h2>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {[
              { icon: Building2, title: "Fleet owners", body: "Vehicle tracking, driver performance, revenue analytics, maintenance scheduling. Full-stack fleet management.", img: IMG_ROAD },
              { icon: Users, title: "Hotel partners", body: "Premium guest transport on demand. Branded booking, VIP coordination, seamless billing.", img: IMG_MAN },
            ].map((c, i) => (
              <Reveal key={c.title} delay={i * 0.1}>
                <GlassPanel className="overflow-hidden group cursor-pointer transition-all duration-500 hover:border-white/12" style={{ borderRadius: "28px" }}>
                  <div className="relative h-52 overflow-hidden">
                    <img src={c.img} alt="" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" style={{ opacity: 0.6 }} />
                    <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, transparent 30%, rgba(6,6,8,0.8))" }} />
                  </div>
                  <div className="p-7">
                    <div className="flex items-center gap-3 mb-3">
                      <c.icon className="w-5 h-5" style={{ color: BRAND_COLORS.green }} />
                      <h3 style={{ ...H, fontSize: "22px", letterSpacing: "-0.02em", color: "#fff" }}>{c.title}</h3>
                    </div>
                    <p style={{ ...B, fontSize: "15px", color: "rgba(255,255,255,0.4)" }}>{c.body}</p>
                    <div className="mt-5 flex items-center gap-2" style={{ ...BM, fontSize: "14px", color: BRAND_COLORS.green }}>
                      Learn more <ArrowUpRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </GlassPanel>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          DRIVER RECRUITMENT
      ══════════════════════════════════════════════════════════════════════ */}
      <section id="drive" className="py-24 lg:py-32 px-6 lg:px-12">
        <div className="max-w-[1400px] mx-auto">
          <Reveal>
            <GlassPanel className="p-8 lg:p-12" style={{ borderRadius: "32px" }}>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div className="rounded-3xl overflow-hidden aspect-[4/3]">
                  <img src={IMG_MAN} alt="" className="w-full h-full object-cover" style={{ opacity: 0.8 }} />
                </div>
                <div>
                  <span style={{ ...BM, fontSize: "13px", color: BRAND_COLORS.green, letterSpacing: "0.04em", textTransform: "uppercase" }}>
                    Earn with JET
                  </span>
                  <h2 className="mt-4" style={{ ...H, fontSize: "clamp(28px, 3.5vw, 44px)", color: "#fff" }}>
                    Your car. Your schedule.
                    <br />
                    <span style={{ color: "rgba(255,255,255,0.2)" }}>Your income.</span>
                  </h2>
                  <p className="mt-4" style={{ ...B, fontSize: "16px", color: "rgba(255,255,255,0.4)" }}>
                    Join thousands of drivers earning on their own terms.
                    Weekly payouts, fuel bonuses, insurance coverage, and a
                    platform that respects your time.
                  </p>
                  <motion.button
                    className="mt-8 px-7 py-3.5 rounded-full flex items-center gap-2"
                    style={{ ...BM, fontSize: "15px", color: "#0B0B0D", background: "#fff" }}
                    onClick={onDriveWithUs}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    Start driving <ArrowRight className="w-4 h-4" />
                  </motion.button>
                </div>
              </div>
            </GlassPanel>
          </Reveal>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          DOWNLOAD CTA
      ══════════════════════════════════════════════════════════════════════ */}
      <section className="py-32 lg:py-40 px-6 lg:px-12 relative">
        {/* Large ambient glow */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-[600px] h-[600px]" style={{ background: `radial-gradient(circle, ${BRAND_COLORS.green}0A 0%, transparent 60%)` }} />
        </div>

        <div className="max-w-[1400px] mx-auto text-center relative z-10">
          <Reveal>
            <h2 style={{ ...H, fontSize: "clamp(40px, 7vw, 80px)", color: "#fff" }}>
              Ready to move<span style={{ color: BRAND_COLORS.green }}>?</span>
            </h2>
            <p className="mt-4 max-w-[400px] mx-auto" style={{ ...B, fontSize: "17px", color: "rgba(255,255,255,0.3)" }}>
              Download JET and experience premium mobility.
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
                style={{ ...BM, fontSize: "16px", color: "rgba(255,255,255,0.6)", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}
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
      <footer className="py-12 px-6 lg:px-12" style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}>
        <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <JetLogo variant="full" mode="light" height={20} />
          <div className="flex items-center gap-8">
            {["Privacy", "Terms", "Support"].map(l => (
              <a key={l} href="#" style={{ ...B, fontSize: "13px", color: "rgba(255,255,255,0.25)", textDecoration: "none" }}>
                {l}
              </a>
            ))}
          </div>
          <span style={{ ...B, fontSize: "13px", color: "rgba(255,255,255,0.15)" }}>
            &copy; 2026 JET. Lagos, Nigeria.
          </span>
        </div>
      </footer>
    </div>
  );
}
