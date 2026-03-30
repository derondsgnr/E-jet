/**
 * JET Landing Page — Version C: "SPATIAL THEATER"
 *
 * DNA: Hybrid experimental — the page IS a journey.
 *
 * Key moves:
 * - Dark hero that transitions to light sections (entering the city at dawn)
 * - Layered parallax depth in hero: bg city, midground glass stats, fg text
 * - Bento grid layout for capabilities
 * - Large-scale parallax numbers
 * - Horizontal scroll feature section
 * - Split-tone sections (dark/light alternating with purpose)
 * - Image reveals with scroll
 * - Most motion-heavy of the three
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
  Building2,
  Users,
  Battery,
  Lock,
  Smartphone,
  Globe,
} from "lucide-react";
import { BRAND_COLORS } from "../../config/brand";
import { JetLogo } from "../brand/jet-logo";

// ─── Images ───
const IMG_HERO = "https://images.unsplash.com/photo-1574612357719-5dd0a272afe2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxMYWdvcyUyME5pZ2VyaWElMjBhZXJpYWwlMjBjaXR5c2NhcGUlMjBuaWdodCUyMGxpZ2h0c3xlbnwxfHx8fDE3NzI5MzE3OTl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral";
const IMG_INTERIOR = "https://images.unsplash.com/photo-1760553121156-56d1c9d3df15?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBjYXIlMjBpbnRlcmlvciUyMGRhc2hib2FyZCUyMG5pZ2h0fGVufDF8fHx8MTc3MjkzMTgwMXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral";
const IMG_CHARGE = "https://images.unsplash.com/photo-1768310465625-5824a01fff4c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGVjdHJpYyUyMGNhciUyMGNoYXJnaW5nJTIwc3RhdGlvbiUyMG1vZGVybnxlbnwxfHx8fDE3NzI4NzU5OTJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral";
const IMG_ROAD = "https://images.unsplash.com/photo-1767681774518-dc28fec12c5e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBjaXR5JTIwcm9hZCUyMGhpZ2h3YXklMjBzdW5zZXQlMjBnb2xkZW58ZW58MXx8fHwxNzcyOTMxODA2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral";
const IMG_STREET = "https://images.unsplash.com/photo-1658402834638-c6f65944b551?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxMYWdvcyUyMHN0cmVldCUyMHZpYnJhbnQlMjB1cmJhbiUyMGxpZmV8ZW58MXx8fHwxNzcyOTMxODAxfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral";
const IMG_MAN = "https://images.unsplash.com/photo-1550051414-003c9007794c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhZnJpY2FuJTIwbWFuJTIwc21pbGluZyUyMHByb2Zlc3Npb25hbCUyMGhlYWRzaG90fGVufDF8fHx8MTc3MjkzMTgwNXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral";
const IMG_WOMAN = "https://images.unsplash.com/photo-1772714601002-fbb0fea8a911?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhZnJpY2FuJTIwd29tYW4lMjBwcm9mZXNzaW9uYWwlMjBwb3J0cmFpdCUyMG1vZGVybnxlbnwxfHx8fDE3NzI5MzE4MDB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral";

// ─── Typography ───
const H = { fontFamily: "var(--font-heading)", letterSpacing: "-0.03em", fontWeight: 600, lineHeight: 1.12 } as const;
const B = { fontFamily: "var(--font-body)", letterSpacing: "-0.02em", fontWeight: 400, lineHeight: 1.5 } as const;
const BM = { ...B, fontWeight: 500 } as const;

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

// ─── Parallax Number ───
function ParallaxNum({ value, className = "" }: { value: string; className?: string }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [40, -40]);
  return (
    <motion.div ref={ref} style={{ y }} className={className}>
      <span style={{ ...H, fontSize: "clamp(80px, 12vw, 160px)", color: "rgba(255,255,255,0.04)", lineHeight: 1 }}>
        {value}
      </span>
    </motion.div>
  );
}

// ─── Bento Card ───
function BentoCard({
  children,
  className = "",
  dark = false,
  style = {},
}: {
  children: React.ReactNode;
  className?: string;
  dark?: boolean;
  style?: React.CSSProperties;
}) {
  return (
    <motion.div
      className={`rounded-3xl overflow-hidden ${className}`}
      style={{
        background: dark ? "rgba(11,11,13,0.97)" : "#fff",
        border: dark ? "1px solid rgba(255,255,255,0.06)" : "1px solid rgba(0,0,0,0.06)",
        ...style,
      }}
      whileHover={{ y: -4, transition: { duration: 0.3 } }}
    >
      {children}
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// VERSION C — SPATIAL THEATER
// ═════════════════════════════���═════════════════════════════════════════════════
interface Props {
  onGetStarted?: () => void;
  onDriveWithUs?: () => void;
}

export function LandingPageC({ onGetStarted, onDriveWithUs }: Props) {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: heroProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroScale = useTransform(heroProgress, [0, 1], [1, 1.2]);
  const heroTextY = useTransform(heroProgress, [0, 1], [0, -80]);
  const heroOpacity = useTransform(heroProgress, [0, 0.7], [1, 0]);

  // For the horizontal scroll section
  const hScrollRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: hProgress } = useScroll({ target: hScrollRef, offset: ["start end", "end start"] });
  const hX = useTransform(hProgress, [0, 1], ["0%", "-15%"]);

  return (
    <div className="relative w-full min-h-screen" style={{ background: "#FAFAFA" }}>
      {/* ── NAV ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 mix-blend-difference">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 flex items-center justify-between h-16">
          <JetLogo variant="full" mode="light" height={22} />
          <div className="hidden md:flex items-center gap-8">
            {["Platform", "Business", "Sustainability", "Drive"].map(l => (
              <a key={l} href={`#${l.toLowerCase()}`} style={{ ...BM, fontSize: "14px", color: "rgba(255,255,255,0.6)", textDecoration: "none" }}>
                {l}
              </a>
            ))}
          </div>
          <button
            className="px-5 py-2 rounded-full"
            style={{ ...BM, fontSize: "14px", color: "#000", background: "#fff" }}
            onClick={onGetStarted}
          >
            Get started
          </button>
        </div>
      </nav>

      {/* ══════════════════════════════════════════════════════════════════════
          HERO — Layered parallax depth (dark)
      ══════════════════════════════════════════════════════════════════════ */}
      <section ref={heroRef} className="relative overflow-hidden" style={{ height: "110vh", background: "#060608" }}>
        {/* Layer 1: Background city */}
        <motion.div className="absolute inset-0" style={{ scale: heroScale }}>
          <img src={IMG_HERO} alt="" className="w-full h-full object-cover" style={{ opacity: 0.45 }} />
        </motion.div>

        {/* Gradient overlays */}
        <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, rgba(6,6,8,0.4) 0%, rgba(6,6,8,0.2) 50%, rgba(6,6,8,0.95) 100%)" }} />

        {/* Green ambient */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[1000px] h-[400px]" style={{ background: `radial-gradient(ellipse, ${BRAND_COLORS.green}0C 0%, transparent 70%)` }} />

        {/* Layer 2: Floating glass stat cards (midground) */}
        <motion.div
          className="absolute inset-0 z-10 hidden lg:flex items-center justify-center"
          style={{ opacity: heroOpacity }}
        >
          <div className="relative w-full max-w-[1400px] mx-auto px-12">
            {/* Floating card — top right */}
            <motion.div
              className="absolute top-[18vh] right-12 px-5 py-4 rounded-2xl"
              style={{
                background: "rgba(255,255,255,0.05)",
                backdropFilter: "blur(30px)",
                border: "1px solid rgba(255,255,255,0.08)",
                y: useTransform(heroProgress, [0, 1], [0, -60]),
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 }}
            >
              <div style={{ ...H, fontSize: "24px", color: "#fff" }}>50K<span style={{ color: BRAND_COLORS.green }}>+</span></div>
              <div style={{ ...B, fontSize: "12px", color: "rgba(255,255,255,0.35)" }}>Active riders</div>
            </motion.div>

            {/* Floating card — bottom left */}
            <motion.div
              className="absolute bottom-[28vh] left-12 px-5 py-4 rounded-2xl"
              style={{
                background: "rgba(255,255,255,0.05)",
                backdropFilter: "blur(30px)",
                border: "1px solid rgba(255,255,255,0.08)",
                y: useTransform(heroProgress, [0, 1], [0, -30]),
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.4 }}
            >
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full" style={{ background: BRAND_COLORS.green }} />
                <span style={{ ...BM, fontSize: "13px", color: "rgba(255,255,255,0.5)" }}>EV Fleet Active</span>
              </div>
              <div className="mt-1" style={{ ...H, fontSize: "20px", color: "#fff" }}>
                4.8 <span style={{ ...B, fontSize: "13px", color: "rgba(255,255,255,0.3)" }}>avg rating</span>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Layer 3: Foreground text */}
        <motion.div
          className="absolute inset-0 z-20 flex flex-col justify-center items-center text-center px-6"
          style={{ y: heroTextY, opacity: heroOpacity }}
        >
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="flex items-center justify-center gap-2 mb-6">
              <div className="w-1.5 h-1.5 rounded-full" style={{ background: BRAND_COLORS.green }} />
              <span style={{ ...BM, fontSize: "13px", color: "rgba(255,255,255,0.4)", letterSpacing: "0.06em", textTransform: "uppercase" }}>
                Premium e-hailing
              </span>
              <div className="w-1.5 h-1.5 rounded-full" style={{ background: BRAND_COLORS.green }} />
            </div>
          </motion.div>

          <motion.h1
            style={{ ...H, fontSize: "clamp(44px, 8vw, 96px)", color: "#fff" }}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
          >
            Move through
            <br />
            Lagos<span style={{ color: BRAND_COLORS.green }}>.</span> Differently<span style={{ color: BRAND_COLORS.green }}>.</span>
          </motion.h1>

          <motion.p
            className="mt-5 max-w-[480px]"
            style={{ ...B, fontSize: "clamp(16px, 2vw, 18px)", color: "rgba(255,255,255,0.4)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            Premium rides with Nigeria's first mixed EV & gas fleet.
            Safe trips, transparent pricing, zero surprises.
          </motion.p>

          <motion.div
            className="flex items-center gap-4 mt-10"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
          >
            <motion.button
              className="px-7 py-4 rounded-full flex items-center gap-2"
              style={{ ...BM, fontSize: "15px", color: "#0B0B0D", background: "#fff" }}
              onClick={onGetStarted}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              Ride with JET <ArrowRight className="w-4 h-4" />
            </motion.button>
            <motion.button
              className="px-7 py-4 rounded-full flex items-center gap-2"
              style={{ ...BM, fontSize: "15px", color: "rgba(255,255,255,0.6)", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}
              onClick={onDriveWithUs}
              whileHover={{ background: "rgba(255,255,255,0.1)" }}
              whileTap={{ scale: 0.97 }}
            >
              Drive & earn
            </motion.button>
          </motion.div>
        </motion.div>

        {/* Bottom fade to white */}
        <div className="absolute bottom-0 left-0 right-0 h-32" style={{ background: "linear-gradient(to bottom, transparent, #FAFAFA)" }} />
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          HORIZONTAL SCROLL — Features (light mode)
      ══════════════════════════════════════════════════════════════════════ */}
      <section id="platform" className="py-24 lg:py-32 px-6 lg:px-12 overflow-hidden" ref={hScrollRef}>
        <div className="max-w-[1400px] mx-auto">
          <Reveal>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-1.5 h-1.5 rounded-full" style={{ background: BRAND_COLORS.green }} />
              <span style={{ ...BM, fontSize: "13px", color: BRAND_COLORS.green, letterSpacing: "0.04em", textTransform: "uppercase" }}>
                The platform
              </span>
            </div>
            <h2 className="mb-16" style={{ ...H, fontSize: "clamp(28px, 4vw, 48px)", color: "#0B0B0D" }}>
              Built for how Lagos
              <br />
              <span style={{ color: "rgba(11,11,13,0.12)" }}>actually moves.</span>
            </h2>
          </Reveal>
        </div>

        {/* Horizontal scrolling cards */}
        <motion.div className="flex gap-5 px-6 lg:px-12" style={{ x: hX }}>
          {[
            { icon: Shield, title: "Trip-end OTP", body: "Synced verification code ensures rides complete only when you say. No ambiguity.", img: IMG_INTERIOR, accent: BRAND_COLORS.green },
            { icon: Lock, title: "Real-time tracking", body: "Share your ride live with anyone you trust. GPS tracking from pickup to drop-off.", img: IMG_STREET, accent: "#60A5FA" },
            { icon: Leaf, title: "JetEV", body: "Choose zero-emission rides. Track your carbon savings. Nigeria's first mixed EV fleet.", img: IMG_CHARGE, accent: "#34D079" },
            { icon: Zap, title: "Upfront pricing", body: "See your exact fare before booking. No surge surprises, multiple payment options.", img: IMG_ROAD, accent: "#FBBF24" },
            { icon: Smartphone, title: "Smart routing", body: "AI-powered routes that learn Lagos traffic patterns. Faster pickups, shorter rides.", img: IMG_HERO, accent: "#A78BFA" },
          ].map((card, i) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={card.title}
                className="shrink-0 w-[340px] rounded-3xl overflow-hidden group cursor-pointer"
                style={{ background: "#fff", border: "1px solid rgba(0,0,0,0.06)" }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                whileHover={{ y: -6 }}
              >
                <div className="relative h-48 overflow-hidden">
                  <img src={card.img} alt="" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, transparent 40%, rgba(0,0,0,0.5))" }} />
                  <div className="absolute bottom-4 left-4">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: `${card.accent}20`, backdropFilter: "blur(10px)" }}>
                      <Icon className="w-4 h-4" style={{ color: card.accent }} />
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="mb-2" style={{ ...H, fontSize: "18px", letterSpacing: "-0.02em", color: "#0B0B0D" }}>
                    {card.title}
                  </h3>
                  <p style={{ ...B, fontSize: "14px", color: "rgba(11,11,13,0.5)" }}>
                    {card.body}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          BENTO GRID — Capabilities
      ══════════════════════════════════════════════════════════════════════ */}
      <section className="py-24 lg:py-32 px-6 lg:px-12">
        <div className="max-w-[1400px] mx-auto">
          <Reveal>
            <div className="text-center mb-16">
              <h2 style={{ ...H, fontSize: "clamp(28px, 4vw, 48px)", color: "#0B0B0D" }}>
                Everything you need.
              </h2>
              <p className="mt-3" style={{ ...B, fontSize: "17px", color: "rgba(11,11,13,0.4)" }}>
                One platform, every ride type.
              </p>
            </div>
          </Reveal>

          {/* Bento */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-[280px]">
            {/* Large card — spans 2 cols */}
            <Reveal className="lg:col-span-2">
              <BentoCard className="h-full relative" dark>
                <img src={IMG_ROAD} alt="" className="absolute inset-0 w-full h-full object-cover" style={{ opacity: 0.3 }} />
                <div className="absolute inset-0" style={{ background: "linear-gradient(to right, rgba(11,11,13,0.9) 0%, rgba(11,11,13,0.4) 100%)" }} />
                <div className="relative z-10 p-8 h-full flex flex-col justify-end">
                  <div className="flex items-center gap-2 mb-3">
                    <Globe className="w-4 h-4" style={{ color: BRAND_COLORS.green }} />
                    <span style={{ ...BM, fontSize: "12px", color: BRAND_COLORS.green, letterSpacing: "0.04em", textTransform: "uppercase" }}>Coverage</span>
                  </div>
                  <h3 style={{ ...H, fontSize: "28px", letterSpacing: "-0.02em", color: "#fff" }}>
                    Across Lagos and expanding
                  </h3>
                  <p className="mt-2 max-w-[400px]" style={{ ...B, fontSize: "15px", color: "rgba(255,255,255,0.4)" }}>
                    Full coverage across Victoria Island, Ikeja, Lekki, and growing. Coming soon to Abuja and Port Harcourt.
                  </p>
                </div>
              </BentoCard>
            </Reveal>

            {/* Stats card */}
            <Reveal delay={0.1}>
              <BentoCard className="h-full p-8 flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4" style={{ background: `${BRAND_COLORS.green}08` }}>
                    <Users className="w-5 h-5" style={{ color: BRAND_COLORS.green }} />
                  </div>
                  <div style={{ ...H, fontSize: "48px", color: "#0B0B0D" }}>50K<span style={{ color: BRAND_COLORS.green }}>+</span></div>
                </div>
                <p style={{ ...B, fontSize: "15px", color: "rgba(11,11,13,0.4)" }}>Active riders trust JET daily</p>
              </BentoCard>
            </Reveal>

            {/* Safety card */}
            <Reveal delay={0.05}>
              <BentoCard className="h-full p-8 flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4" style={{ background: "rgba(59,130,246,0.08)" }}>
                    <Shield className="w-5 h-5" style={{ color: "#3B82F6" }} />
                  </div>
                  <h3 style={{ ...H, fontSize: "20px", letterSpacing: "-0.02em", color: "#0B0B0D" }}>
                    Trip-end OTP
                  </h3>
                </div>
                <p style={{ ...B, fontSize: "14px", color: "rgba(11,11,13,0.4)" }}>
                  Synced verification code ensures safe ride completion every time.
                </p>
              </BentoCard>
            </Reveal>

            {/* EV card — spans 2 cols */}
            <Reveal delay={0.1} className="lg:col-span-2">
              <BentoCard className="h-full relative" dark>
                <img src={IMG_CHARGE} alt="" className="absolute inset-0 w-full h-full object-cover" style={{ opacity: 0.25 }} />
                <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, rgba(11,11,13,0.9) 0%, rgba(11,11,13,0.5) 100%)` }} />
                {/* Green glow */}
                <div className="absolute bottom-0 right-[20%] w-[300px] h-[200px]" style={{ background: `radial-gradient(ellipse, ${BRAND_COLORS.green}10 0%, transparent 70%)` }} />
                <div className="relative z-10 p-8 h-full flex flex-col justify-end">
                  <div className="flex items-center gap-2 mb-3">
                    <Battery className="w-4 h-4" style={{ color: BRAND_COLORS.green }} />
                    <span style={{ ...BM, fontSize: "12px", color: BRAND_COLORS.green, letterSpacing: "0.04em", textTransform: "uppercase" }}>JetEV</span>
                  </div>
                  <h3 style={{ ...H, fontSize: "28px", letterSpacing: "-0.02em", color: "#fff" }}>
                    Nigeria's first EV ride fleet
                  </h3>
                  <p className="mt-2 max-w-[400px]" style={{ ...B, fontSize: "15px", color: "rgba(255,255,255,0.4)" }}>
                    30% of fleet is electric today. Zero-emission rides, real-time carbon tracking, and a 100% EV target by 2030.
                  </p>
                </div>
              </BentoCard>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          HOW IT WORKS — Dark section with parallax numbers
      ══════════════════════════════════════════════════════════════════════ */}
      <section className="py-24 lg:py-32 px-6 lg:px-12 relative overflow-hidden" style={{ background: "#0B0B0D" }}>
        {/* Giant parallax ghost numbers */}
        <div className="absolute top-0 left-0 right-0 flex justify-between px-12 pointer-events-none" style={{ opacity: 0.4 }}>
          <ParallaxNum value="01" />
          <ParallaxNum value="02" />
          <ParallaxNum value="03" />
        </div>

        <div className="max-w-[1400px] mx-auto relative z-10">
          <Reveal>
            <div className="text-center mb-20">
              <h2 style={{ ...H, fontSize: "clamp(28px, 4vw, 48px)", color: "#fff" }}>
                Three taps. You're moving.
              </h2>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-16">
            {[
              { icon: MapPin, title: "Set destination", body: "Enter where you're going. Save frequent places for one-tap booking. Smart suggestions learn your patterns." },
              { icon: Car, title: "Choose your ride", body: "JetEV for green trips, Comfort for everyday, Premium for the extra touch. Price upfront — no surprises." },
              { icon: Shield, title: "Ride with confidence", body: "Verified driver arrives. Share your trip live. OTP ensures the ride completes when you say." },
            ].map((step, i) => (
              <Reveal key={step.title} delay={i * 0.12}>
                <div className="text-center">
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-6"
                    style={{ background: `${BRAND_COLORS.green}10`, border: `1px solid ${BRAND_COLORS.green}15` }}
                  >
                    <step.icon className="w-6 h-6" style={{ color: BRAND_COLORS.green }} />
                  </div>
                  <h3 className="mb-3" style={{ ...H, fontSize: "20px", letterSpacing: "-0.02em", color: "#fff" }}>
                    {step.title}
                  </h3>
                  <p className="max-w-[300px] mx-auto" style={{ ...B, fontSize: "15px", color: "rgba(255,255,255,0.4)" }}>
                    {step.body}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          BUSINESS — Light split cards
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
              Scale your operations.
            </h2>
          </Reveal>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {[
              { icon: Building2, title: "Fleet owners", body: "Vehicle tracking, driver performance, revenue analytics. Full-stack fleet management with real-time intelligence.", img: IMG_ROAD },
              { icon: Users, title: "Hotel partners", body: "Premium guest transport on demand. Branded booking, VIP coordination, seamless billing integration.", img: IMG_WOMAN },
            ].map((c, i) => (
              <Reveal key={c.title} delay={i * 0.1}>
                <div
                  className="rounded-3xl overflow-hidden group cursor-pointer transition-shadow duration-500 hover:shadow-xl"
                  style={{ background: "#fff", border: "1px solid rgba(0,0,0,0.06)" }}
                >
                  <div className="relative h-52 overflow-hidden">
                    <img src={c.img} alt="" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                    <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, transparent 40%, rgba(0,0,0,0.4))" }} />
                  </div>
                  <div className="p-8">
                    <div className="flex items-center gap-3 mb-3">
                      <c.icon className="w-5 h-5" style={{ color: BRAND_COLORS.green }} />
                      <h3 style={{ ...H, fontSize: "22px", letterSpacing: "-0.02em", color: "#0B0B0D" }}>{c.title}</h3>
                    </div>
                    <p style={{ ...B, fontSize: "15px", color: "rgba(11,11,13,0.5)" }}>{c.body}</p>
                    <div className="mt-5 flex items-center gap-2" style={{ ...BM, fontSize: "14px", color: "#0B0B0D" }}>
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
          DRIVE RECRUITMENT — Image + text
      ══════════════════════════════════════════════════════════════════════ */}
      <section id="drive" className="relative overflow-hidden" style={{ minHeight: "70vh", background: "#0B0B0D" }}>
        <img src={IMG_MAN} alt="" className="absolute inset-0 w-full h-full object-cover" style={{ opacity: 0.35 }} />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to right, rgba(11,11,13,0.9) 0%, rgba(11,11,13,0.3) 100%)" }} />
        <div className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-12 py-32 lg:py-40">
          <Reveal>
            <div className="max-w-[500px]">
              <span style={{ ...BM, fontSize: "13px", color: BRAND_COLORS.green, letterSpacing: "0.04em", textTransform: "uppercase" }}>
                Earn with JET
              </span>
              <h2 className="mt-4" style={{ ...H, fontSize: "clamp(32px, 5vw, 56px)", color: "#fff" }}>
                Your car.
                <br />
                Your schedule.
                <br />
                <span style={{ color: "rgba(255,255,255,0.2)" }}>Your income.</span>
              </h2>
              <p className="mt-6" style={{ ...B, fontSize: "17px", color: "rgba(255,255,255,0.45)" }}>
                Join thousands of drivers earning on their own terms.
                Weekly payouts, fuel bonuses, insurance coverage.
              </p>
              <motion.button
                className="mt-8 px-7 py-4 rounded-full flex items-center gap-2"
                style={{ ...BM, fontSize: "15px", color: "#0B0B0D", background: "#fff" }}
                onClick={onDriveWithUs}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
              >
                Start driving <ArrowRight className="w-4 h-4" />
              </motion.button>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          CTA — Light with green accent
      ══════════════════════════════════════════════════════════════════════ */}
      <section className="py-32 lg:py-40 px-6 lg:px-12 relative">
        {/* Subtle green glow */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-[500px] h-[500px]" style={{ background: `radial-gradient(circle, ${BRAND_COLORS.green}06 0%, transparent 60%)` }} />
        </div>
        <div className="max-w-[1400px] mx-auto text-center relative z-10">
          <Reveal>
            <h2 style={{ ...H, fontSize: "clamp(36px, 6vw, 72px)", color: "#0B0B0D" }}>
              Ready to move<span style={{ color: BRAND_COLORS.green }}>?</span>
            </h2>
            <p className="mt-4 max-w-[400px] mx-auto" style={{ ...B, fontSize: "17px", color: "rgba(11,11,13,0.4)" }}>
              Download JET and experience premium mobility in Lagos.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10">
              <motion.button
                className="px-8 py-4 rounded-full flex items-center gap-2"
                style={{ ...BM, fontSize: "16px", color: "#fff", background: "#0B0B0D" }}
                onClick={onGetStarted}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
              >
                Ride with JET <ArrowRight className="w-4 h-4" />
              </motion.button>
              <motion.button
                className="px-8 py-4 rounded-full flex items-center gap-2"
                style={{ ...BM, fontSize: "16px", color: "#0B0B0D", background: "transparent", border: "1px solid rgba(0,0,0,0.1)" }}
                onClick={onDriveWithUs}
                whileHover={{ background: "rgba(0,0,0,0.03)" }}
                whileTap={{ scale: 0.97 }}
              >
                Drive & earn
              </motion.button>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="py-12 px-6 lg:px-12" style={{ background: "#0B0B0D" }}>
        <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <JetLogo variant="full" mode="light" height={20} />
          <div className="flex items-center gap-8">
            {["Privacy", "Terms", "Support"].map(l => (
              <a key={l} href="#" style={{ ...B, fontSize: "13px", color: "rgba(255,255,255,0.3)", textDecoration: "none" }}>
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