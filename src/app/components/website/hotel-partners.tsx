/**
 * JET — Hotel Partners Page
 *
 * Audience: Hotel GMs and Operations Managers
 * Job: Get them to submit the contact form
 * Angle: Replace generic Bolt Corporate / ad-hoc drivers with a
 *        branded, trackable, billingintegrated guest transport solution
 */

import { useState, useRef } from "react";
import { motion, useInView } from "motion/react";
import {
  ArrowRight, ArrowLeft, Check,
  Building2, Shield, FileText, Phone,
  Star, Clock, CreditCard,
} from "lucide-react";
import { BRAND_COLORS } from "../../config/brand";
import { JetLogo } from "../brand/jet-logo";

// ─── Config ──────────────────────────────────────────────────────────────────
const CONTACT_EMAIL = "hello@jet.ng";

// ─── Images ──────────────────────────────────────────────────────────────────
const IMG_HOTEL_ENTRANCE = "https://images.unsplash.com/photo-1566073771259-6a8506099945?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1400";
const IMG_HOTEL_LOBBY    = "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080";
const IMG_HOTEL_CONCIERGE = "https://images.unsplash.com/photo-1564501049412-61c2a3083791?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080";

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
    name: "", hotel: "", city: "", role: "", email: "", phone: "", message: "",
  });

  const canSubmit = form.name && form.hotel && form.email && form.city;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    // Wire to backend when ready — for now mailto fallback
    const subject = encodeURIComponent(`Hotel Partner Enquiry — ${form.hotel}`);
    const body = encodeURIComponent(
      `Name: ${form.name}\nHotel: ${form.hotel}\nCity: ${form.city}\nRole: ${form.role}\nEmail: ${form.email}\nPhone: ${form.phone}\n\n${form.message}`
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
          Our team will reach out within one business day to walk you through the JET Hotel Partner programme.
        </p>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="p-8 flex flex-col gap-5">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label style={labelStyle}>Your name *</label>
          <input style={inputStyle} placeholder="Amaka Osei"
            value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
        </div>
        <div>
          <label style={labelStyle}>Your role</label>
          <input style={inputStyle} placeholder="Operations Manager"
            value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label style={labelStyle}>Hotel name *</label>
          <input style={inputStyle} placeholder="Eko Hotels & Suites"
            value={form.hotel} onChange={e => setForm(f => ({ ...f, hotel: e.target.value }))} />
        </div>
        <div>
          <label style={labelStyle}>City *</label>
          <input style={inputStyle} placeholder="Lagos"
            value={form.city} onChange={e => setForm(f => ({ ...f, city: e.target.value }))} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label style={labelStyle}>Work email *</label>
          <input style={inputStyle} type="email" placeholder="amaka@ekohotels.com"
            value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
        </div>
        <div>
          <label style={labelStyle}>Phone number</label>
          <input style={inputStyle} type="tel" placeholder="+234 800 000 0000"
            value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
        </div>
      </div>

      <div>
        <label style={labelStyle}>Anything you'd like us to know</label>
        <textarea
          placeholder="How many guests do you move daily? Do you have an existing transport arrangement?"
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
interface HotelPartnersProps {
  onBack?: () => void;
  onGetStarted?: () => void;
}

// ════════════════════════════════════════════════════════════════════════════
export function HotelPartners({ onBack, onGetStarted }: HotelPartnersProps) {
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
          <img src={IMG_HOTEL_ENTRANCE} alt="" className="w-full h-full object-cover" style={{ opacity: 0.18 }} />
          <div className="absolute inset-0" style={{
            background: "linear-gradient(to bottom, #FAFAFA 0%, rgba(250,250,250,0.6) 50%, #FAFAFA 100%)",
          }} />
        </div>
        <div className="relative z-10 px-6 md:px-16 py-20 md:py-28 max-w-5xl">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}
            className="flex items-center gap-2 mb-6">
            <Building2 size={13} style={{ color: BRAND_COLORS.green }} />
            <span style={{ ...BM, fontSize: "11px", color: BRAND_COLORS.green, letterSpacing: "0.06em", textTransform: "uppercase" as const }}>
              Hotel partners
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
            style={{ ...H, fontSize: "clamp(36px, 6vw, 72px)", color: "#0B0B0D", maxWidth: 680 }}>
            Your guests deserve a better arrival
            <span style={{ color: BRAND_COLORS.green }}>.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.7 }}
            style={{ ...B, fontSize: "clamp(15px, 2vw, 18px)", color: "#6E6E70", maxWidth: 520, marginTop: 16 }}>
            Replace ad-hoc drivers and generic ride apps with a branded,
            trackable, fully billed guest transport solution — built for hotels that care about first impressions.
          </motion.p>
        </div>
      </section>

      {/* ── PAIN POINTS ── */}
      <section className="px-6 md:px-16 py-16 max-w-6xl mx-auto">
        <Reveal>
          <p style={{ ...BM, fontSize: "13px", color: "#8E8E8E", marginBottom: 32 }}>
            What your guests experience today — and what changes with JET.
          </p>
        </Reveal>
        <div className="grid md:grid-cols-2 gap-4">
          {[
            {
              before: "A generic Bolt ride to your hotel. No branding. No greeting.",
              after:  "A JET pickup coordinated by your concierge. Branded, confirmed, tracked.",
              icon: Star,
            },
            {
              before: "Your ops team manually reconciling ride receipts at month-end.",
              after:  "Consolidated billing. One invoice. All guest trips in one place.",
              icon: CreditCard,
            },
            {
              before: "Calling a regular driver who may or may not show up.",
              after:  "On-demand dispatch. OTP-verified. Real-time ETA for your guest.",
              icon: Clock,
            },
            {
              before: "No visibility if something goes wrong during a guest's trip.",
              after:  "Live tracking and trip records for every guest movement.",
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
            <h2 style={{ ...H, fontSize: "clamp(28px, 4vw, 48px)", color: "#FFFFFF", marginTop: 12, maxWidth: 520, marginBottom: 48 }}>
              Everything your concierge needs to move guests seamlessly
              <span style={{ color: BRAND_COLORS.green }}>.</span>
            </h2>
          </Reveal>

          <div className="grid md:grid-cols-3 gap-4">
            {[
              {
                icon: Building2,
                title: "Branded booking portal",
                body: "Your staff books rides directly from a JET portal branded to your hotel. Guests receive confirmation in your name, not ours.",
              },
              {
                icon: FileText,
                title: "Consolidated billing",
                body: "All guest trips appear on a single monthly invoice. No more chasing individual receipts or reimbursements.",
              },
              {
                icon: Shield,
                title: "OTP-verified trips",
                body: "Every pickup and drop-off is verified with a unique code. Your guests are never in an unverified, untracked vehicle.",
              },
              {
                icon: Phone,
                title: "Dedicated account line",
                body: "A direct number to the JET hotel team — not a general support queue. Issues resolved before your guest notices.",
              },
              {
                icon: Clock,
                title: "Real-time tracking",
                body: "Your concierge sees every guest vehicle on a live map. Share ETA directly with the guest in seconds.",
              },
              {
                icon: Star,
                title: "VIP coordination",
                body: "Pre-scheduled airport pickups, group movements, event transfers. Briefed drivers. Consistent experience.",
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
              <img src={IMG_HOTEL_LOBBY} alt="Hotel lobby" className="w-full h-full object-cover" />
            </div>
          </Reveal>
          <Reveal delay={0.15}>
            <span style={{ ...BM, fontSize: "11px", color: BRAND_COLORS.green, letterSpacing: "0.06em", textTransform: "uppercase" as const }}>
              The experience
            </span>
            <h2 style={{ ...H, fontSize: "clamp(24px, 3.5vw, 40px)", color: "#0B0B0D", marginTop: 12, marginBottom: 20 }}>
              Your brand. Our fleet. Their best arrival
              <span style={{ color: BRAND_COLORS.green }}>.</span>
            </h2>
            <p style={{ ...B, fontSize: "16px", color: "#6E6E70", lineHeight: 1.7, marginBottom: 24 }}>
              From the moment your guest lands to the moment they check out,
              every ground movement reflects the standard your hotel is built on.
              JET handles the logistics. You take the credit.
            </p>
            <div className="flex flex-col gap-3">
              {[
                "Airport arrivals and departures",
                "In-city guest transport",
                "Group and event transfers",
                "Long-term billing integration",
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
                Let's talk about your guests
                <span style={{ color: BRAND_COLORS.green }}>.</span>
              </h2>
              <p style={{ ...B, fontSize: "16px", color: "#6E6E70", lineHeight: 1.7, marginBottom: 32 }}>
                Tell us about your hotel and how you currently move guests.
                Our team will reach out within one business day to walk you
                through how JET works for properties like yours.
              </p>
              <div className="rounded-2xl overflow-hidden" style={{ height: 260 }}>
                <img src={IMG_HOTEL_CONCIERGE} alt="Hotel concierge" className="w-full h-full object-cover" />
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
