/**
 * JET — Fleet Owners Page
 *
 * Audience: Fleet operators and vehicle owners (5+ cars)
 * Job: Get them to submit the contact form
 * Angle: Replace idle assets and fragmented dispatch with a managed,
 *        revenue-generating fleet operation under the JET network
 */

import { useState, useRef } from "react";
import { motion, useInView } from "motion/react";
import {
  ArrowRight, ArrowLeft, Check,
  Car, BarChart3, Wrench, Phone,
  MapPin, Clock, Shield, Zap,
} from "lucide-react";
import { BRAND_COLORS } from "../../config/brand";
import { JetLogo } from "../brand/jet-logo";

// ─── Config ──────────────────────────────────────────────────────────────────
const CONTACT_EMAIL = "hello@jet.ng";

// ─── Images ──────────────────────────────────────────────────────────────────
const IMG_FLEET_HERO    = "https://images.unsplash.com/photo-1503376780353-7e6692767b70?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1400";
const IMG_FLEET_LINEUP  = "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080";
const IMG_FLEET_MGMT    = "https://images.unsplash.com/photo-1551288049-bebda4e38f71?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080";

// ─── Typography ──────────────────────────────────────────────────────────────
const H  = { fontFamily: "var(--font-heading)", letterSpacing: "-0.03em", fontWeight: 600, lineHeight: 1.1 } as const;
const B  = { fontFamily: "var(--font-body)",    letterSpacing: "-0.02em", fontWeight: 400, lineHeight: 1.55 } as const;
const BM = { ...B, fontWeight: 500 } as const;

// ─── Reveal ──────────────────────────────────────────────────────────────────
function Reveal({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div ref={ref} className={className}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay }}
    >
      {children}
    </motion.div>
  );
}

// ─── Contact Form ─────────────────────────────────────────────────────────────
function ContactForm() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: "", company: "", city: "", fleetSize: "", email: "", phone: "", message: "",
  });

  const canSubmit = form.name && form.email && form.city && form.fleetSize;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    const subject = encodeURIComponent(`Fleet Partner Enquiry — ${form.company || form.name}`);
    const body = encodeURIComponent(
      `Name: ${form.name}\nCompany: ${form.company}\nCity: ${form.city}\nFleet size: ${form.fleetSize}\nEmail: ${form.email}\nPhone: ${form.phone}\n\n${form.message}`
    );
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
    setSubmitted(true);
  };

  const inputStyle = {
    ...B, fontSize: "14px", color: "#0B0B0D",
    width: "100%", height: 44, padding: "0 14px",
    borderRadius: 12, outline: "none",
    background: "#F7F8FA",
    border: "1px solid rgba(0,0,0,0.08)",
  } as React.CSSProperties;

  const labelStyle = {
    ...BM, fontSize: "11px", color: "#6E6E70",
    display: "block", marginBottom: 6,
    letterSpacing: "0.02em",
  } as React.CSSProperties;

  const selectStyle = {
    ...inputStyle,
    appearance: "none" as const,
    WebkitAppearance: "none" as const,
    cursor: "pointer",
  };

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center text-center py-16 px-8"
      >
        <div className="w-14 h-14 rounded-full flex items-center justify-center mb-5"
          style={{ background: `${BRAND_COLORS.green}12`, border: `1px solid ${BRAND_COLORS.green}20` }}>
          <Check size={24} style={{ color: BRAND_COLORS.green }} />
        </div>
        <h3 style={{ ...H, fontSize: "22px", color: "#0B0B0D", marginBottom: 8 }}>We'll be in touch</h3>
        <p style={{ ...B, fontSize: "14px", color: "#6E6E70", maxWidth: 320 }}>
          Our fleet partnerships team will reach out within one business day to walk you through how JET works for operators.
        </p>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="p-8 flex flex-col gap-5">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label style={labelStyle}>Your name *</label>
          <input style={inputStyle} placeholder="Emeka Nwosu"
            value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
        </div>
        <div>
          <label style={labelStyle}>Company name</label>
          <input style={inputStyle} placeholder="Nwosu Transport Ltd"
            value={form.company} onChange={e => setForm(f => ({ ...f, company: e.target.value }))} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label style={labelStyle}>Fleet size *</label>
          <select style={selectStyle}
            value={form.fleetSize} onChange={e => setForm(f => ({ ...f, fleetSize: e.target.value }))}>
            <option value="">Select range</option>
            <option value="5–10">5 – 10 vehicles</option>
            <option value="11–25">11 – 25 vehicles</option>
            <option value="26–50">26 – 50 vehicles</option>
            <option value="51+">51+ vehicles</option>
          </select>
        </div>
        <div>
          <label style={labelStyle}>City *</label>
          <input style={inputStyle} placeholder="Abuja"
            value={form.city} onChange={e => setForm(f => ({ ...f, city: e.target.value }))} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label style={labelStyle}>Work email *</label>
          <input style={inputStyle} type="email" placeholder="emeka@nwosutransport.com"
            value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
        </div>
        <div>
          <label style={labelStyle}>Phone number</label>
          <input style={inputStyle} type="tel" placeholder="+234 800 000 0000"
            value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
        </div>
      </div>

      <div>
        <label style={labelStyle}>Tell us about your operation</label>
        <textarea
          placeholder="What kinds of vehicles do you run? Are they currently active on any platform?"
          value={form.message}
          onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
          rows={4}
          style={{
            ...B, fontSize: "14px", color: "#0B0B0D",
            width: "100%", padding: "12px 14px",
            borderRadius: 12, outline: "none", resize: "none",
            background: "#F7F8FA",
            border: "1px solid rgba(0,0,0,0.08)",
          }}
        />
      </div>

      <motion.button
        type="submit"
        disabled={!canSubmit}
        whileTap={canSubmit ? { scale: 0.98 } : undefined}
        className="h-12 rounded-xl flex items-center justify-center gap-2 transition-opacity"
        style={{
          background: canSubmit ? BRAND_COLORS.green : "#E5E5E5",
          opacity: canSubmit ? 1 : 0.6,
          cursor: canSubmit ? "pointer" : "not-allowed",
          minHeight: 44,
        }}
      >
        <span style={{ ...BM, fontSize: "14px", color: canSubmit ? "#FFFFFF" : "#8E8E8E" }}>
          Request a conversation
        </span>
        <ArrowRight size={15} color={canSubmit ? "#FFFFFF" : "#8E8E8E"} />
      </motion.button>

      <p style={{ ...B, fontSize: "11px", color: "#8E8E8E", textAlign: "center" as const }}>
        No commitment. Our team will reach out within one business day.
      </p>
    </form>
  );
}

// ─── Props ────────────────────────────────────────────────────────────────────
interface FleetOwnersProps {
  onBack?: () => void;
  onGetStarted?: () => void;
}

// ════════════════════════════════════════════════════════════════════════════
export function FleetOwners({ onBack, onGetStarted }: FleetOwnersProps) {
  return (
    <div className="w-full min-h-screen" style={{ background: "#FAFAFA" }}>

      {/* ── NAV ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-10"
        style={{
          height: 64,
          background: "rgba(250,250,250,0.92)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(0,0,0,0.05)",
        }}>
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="flex items-center gap-1.5 transition-colors"
            style={{ ...BM, fontSize: "13px", color: "#8E8E8E" }}>
            <ArrowLeft size={14} />
            Back
          </button>
          <div style={{ width: 1, height: 16, background: "rgba(0,0,0,0.1)" }} />
          <JetLogo variant="full" mode="dark" height={24} />
        </div>
        <motion.button onClick={onGetStarted} whileTap={{ scale: 0.97 }}
          className="h-9 px-5 rounded-xl"
          style={{ background: BRAND_COLORS.green }}>
          <span style={{ ...BM, fontSize: "13px", color: "#FFFFFF" }}>Ride with JET</span>
        </motion.button>
      </nav>

      {/* ── HERO ── */}
      <section className="relative overflow-hidden" style={{ paddingTop: 64, minHeight: 560 }}>
        <div className="absolute inset-0">
          <img src={IMG_FLEET_HERO} alt="" className="w-full h-full object-cover" style={{ opacity: 0.18 }} />
          <div className="absolute inset-0" style={{
            background: "linear-gradient(to bottom, #FAFAFA 0%, rgba(250,250,250,0.6) 50%, #FAFAFA 100%)",
          }} />
        </div>
        <div className="relative z-10 px-6 md:px-16 py-20 md:py-28 max-w-5xl">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}
            className="flex items-center gap-2 mb-6">
            <Car size={13} style={{ color: BRAND_COLORS.green }} />
            <span style={{ ...BM, fontSize: "11px", color: BRAND_COLORS.green, letterSpacing: "0.06em", textTransform: "uppercase" as const }}>
              Fleet partners
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
            style={{ ...H, fontSize: "clamp(36px, 6vw, 72px)", color: "#0B0B0D", maxWidth: 680 }}>
            Your vehicles should be working — not waiting
            <span style={{ color: BRAND_COLORS.green }}>.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.7 }}
            style={{ ...B, fontSize: "clamp(15px, 2vw, 18px)", color: "#6E6E70", maxWidth: 520, marginTop: 16 }}>
            Partner with JET to put your fleet on a premium network — with
            managed dispatch, real-time visibility, and consistent earnings
            without the operational headache.
          </motion.p>
        </div>
      </section>

      {/* ── PAIN POINTS ── */}
      <section className="px-6 md:px-16 py-16 max-w-6xl mx-auto">
        <Reveal>
          <p style={{ ...BM, fontSize: "13px", color: "#8E8E8E", marginBottom: 32 }}>
            What running a fleet looks like today — and what changes with JET.
          </p>
        </Reveal>
        <div className="grid md:grid-cols-2 gap-4">
          {[
            {
              before: "Vehicles sitting idle between trips. Revenue lost every hour they're parked.",
              after:  "Demand-matched dispatch. Your fleet moves when riders need it most.",
              icon: Car,
            },
            {
              before: "No visibility into where your vehicles are or how drivers are performing.",
              after:  "Live fleet map, trip history, and driver behaviour reports — all in one place.",
              icon: BarChart3,
            },
            {
              before: "Chasing individual drivers for daily earnings and end-of-month reconciliation.",
              after:  "Automated earnings reports. Consolidated payouts. No spreadsheet required.",
              icon: Clock,
            },
            {
              before: "Drivers operating unchecked — no accountability when something goes wrong.",
              after:  "OTP-verified trips and rider ratings create a visible record on every journey.",
              icon: Shield,
            },
          ].map((item, i) => {
            const Icon = item.icon;
            return (
              <Reveal key={i} delay={i * 0.08}>
                <div className="rounded-2xl p-6" style={{ background: "#FFFFFF", border: "1px solid rgba(0,0,0,0.06)" }}>
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center mb-4"
                    style={{ background: `${BRAND_COLORS.green}10` }}>
                    <Icon size={15} style={{ color: BRAND_COLORS.green }} />
                  </div>
                  <p style={{ ...B, fontSize: "13px", color: "#8E8E8E", marginBottom: 10, textDecoration: "line-through" }}>
                    {item.before}
                  </p>
                  <p style={{ ...BM, fontSize: "14px", color: "#0B0B0D" }}>
                    {item.after}
                  </p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section style={{ background: "#0B0B0D" }} className="px-6 md:px-16 py-20 md:py-28">
        <div className="max-w-6xl mx-auto">
          <Reveal>
            <span style={{ ...BM, fontSize: "11px", color: BRAND_COLORS.green, letterSpacing: "0.06em", textTransform: "uppercase" as const }}>
              What you get
            </span>
            <h2 style={{ ...H, fontSize: "clamp(28px, 4vw, 48px)", color: "#FFFFFF", marginTop: 12, maxWidth: 540, marginBottom: 48 }}>
              Tools to run a tighter, more profitable operation
              <span style={{ color: BRAND_COLORS.green }}>.</span>
            </h2>
          </Reveal>

          <div className="grid md:grid-cols-3 gap-4">
            {[
              {
                icon: MapPin,
                title: "Live fleet visibility",
                body: "See every vehicle on a real-time map. Know where your fleet is, what they're doing, and how long each trip takes.",
              },
              {
                icon: BarChart3,
                title: "Earnings dashboard",
                body: "Daily, weekly, and monthly earnings per vehicle. No more end-of-month surprises — just clean, exportable data.",
              },
              {
                icon: Wrench,
                title: "Maintenance tracking",
                body: "Log service records and set mileage alerts per vehicle. Know when a car needs attention before it causes a problem.",
              },
              {
                icon: Shield,
                title: "Driver accountability",
                body: "OTP verification, trip ratings, and incident records give you a complete picture of every driver's performance.",
              },
              {
                icon: Zap,
                title: "Demand-matched dispatch",
                body: "JET's routing matches your vehicles to the highest-demand zones. Less idle time. More productive trips per day.",
              },
              {
                icon: Phone,
                title: "Dedicated fleet support",
                body: "A direct line to the JET fleet team. Not a general queue — a team that knows your operation by name.",
              },
            ].map((feat, i) => {
              const Icon = feat.icon;
              return (
                <Reveal key={feat.title} delay={i * 0.07}>
                  <div className="rounded-2xl p-6 h-full"
                    style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-5"
                      style={{ background: `${BRAND_COLORS.green}12` }}>
                      <Icon size={16} style={{ color: BRAND_COLORS.green }} />
                    </div>
                    <h3 style={{ ...H, fontSize: "17px", color: "#FFFFFF", marginBottom: 8 }}>{feat.title}</h3>
                    <p style={{ ...B, fontSize: "13px", color: "#7D7D7D" }}>{feat.body}</p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── IMAGE + PROOF ── */}
      <section className="px-6 md:px-16 py-20 max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <Reveal>
            <div className="rounded-3xl overflow-hidden" style={{ height: 440 }}>
              <img src={IMG_FLEET_LINEUP} alt="Fleet vehicles" className="w-full h-full object-cover" />
            </div>
          </Reveal>
          <Reveal delay={0.15}>
            <span style={{ ...BM, fontSize: "11px", color: BRAND_COLORS.green, letterSpacing: "0.06em", textTransform: "uppercase" as const }}>
              The partnership
            </span>
            <h2 style={{ ...H, fontSize: "clamp(24px, 3.5vw, 40px)", color: "#0B0B0D", marginTop: 12, marginBottom: 20 }}>
              Your assets. Our network. Structured earnings
              <span style={{ color: BRAND_COLORS.green }}>.</span>
            </h2>
            <p style={{ ...B, fontSize: "16px", color: "#6E6E70", lineHeight: 1.7, marginBottom: 24 }}>
              JET is built for fleet operators who want more than a driver app.
              You bring the vehicles. We bring the demand, the operations tools,
              and the structure to make every asset in your fleet earn consistently.
            </p>
            <div className="flex flex-col gap-3">
              {[
                "5 or more vehicles welcome",
                "Saloon, SUV, and EV configurations",
                "Flexible driver assignment per vehicle",
                "Earnings reports for each car individually",
              ].map(item => (
                <div key={item} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0"
                    style={{ background: `${BRAND_COLORS.green}12` }}>
                    <Check size={11} style={{ color: BRAND_COLORS.green }} />
                  </div>
                  <span style={{ ...BM, fontSize: "14px", color: "#0B0B0D" }}>{item}</span>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── CONTACT FORM ── */}
      <section style={{ background: "#F5F5F5" }} className="px-6 md:px-16 py-20">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-start">
            {/* Left — pitch */}
            <Reveal>
              <span style={{ ...BM, fontSize: "11px", color: BRAND_COLORS.green, letterSpacing: "0.06em", textTransform: "uppercase" as const }}>
                Get started
              </span>
              <h2 style={{ ...H, fontSize: "clamp(28px, 4vw, 44px)", color: "#0B0B0D", marginTop: 12, marginBottom: 20 }}>
                Let's talk about your fleet
                <span style={{ color: BRAND_COLORS.green }}>.</span>
              </h2>
              <p style={{ ...B, fontSize: "16px", color: "#6E6E70", lineHeight: 1.7, marginBottom: 32 }}>
                Tell us about your vehicles and how your operation currently runs.
                Our fleet partnerships team will walk you through the numbers
                and how JET fits into what you already have.
              </p>
              <div className="rounded-2xl overflow-hidden" style={{ height: 260 }}>
                <img src={IMG_FLEET_MGMT} alt="Fleet operations dashboard" className="w-full h-full object-cover" />
              </div>
            </Reveal>

            {/* Right — form */}
            <Reveal delay={0.15}>
              <div className="rounded-3xl overflow-hidden" style={{ background: "#FFFFFF", border: "1px solid rgba(0,0,0,0.06)" }}>
                <div className="px-8 pt-7 pb-0">
                  <h3 style={{ ...H, fontSize: "20px", color: "#0B0B0D" }}>Partner with JET</h3>
                  <p style={{ ...B, fontSize: "13px", color: "#8E8E8E", marginTop: 4 }}>
                    No commitment. We'll reach out within one business day.
                  </p>
                </div>
                <ContactForm />
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="px-6 md:px-16 py-8 flex flex-col md:flex-row items-center justify-between gap-4"
        style={{ background: "#0B0B0D", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
        <JetLogo variant="full" mode="light" height={22} />
        <div className="flex items-center gap-6">
          {[{ label: "Privacy", href: "#" }, { label: "Terms", href: "#" }, { label: "Support", href: `mailto:${CONTACT_EMAIL}` }].map(link => (
            <a key={link.label} href={link.href} style={{ ...B, fontSize: "13px", color: "#636363" }}
              className="hover:text-white transition-colors">{link.label}</a>
          ))}
        </div>
        <span style={{ ...B, fontSize: "12px", color: "#5D5D5D" }}>© 2026 JET Nigeria.</span>
      </footer>
    </div>
  );
}
