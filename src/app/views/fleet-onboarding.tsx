/**
 * FLEET OWNER — ONBOARDING WIZARD
 *
 * Corrected flow — vehicles come via DRIVER onboarding, not here.
 *
 * Steps:
 *   1. Welcome — Premium first impression (hero visual + value props)
 *   2. Business Profile — name, email, location/zone
 *   3. Bank Account — for payouts
 *   4. Invite First Driver — via EMAIL
 *   5. Done — celebration → redirect to empty state
 *
 * Northstar: Stripe Atlas onboarding, Linear workspace setup,
 * Vercel project creation, Luma event page.
 *
 * Welcome page: gradient background + hero image + glass value cards.
 * Step pages: clean, focused, one thing per step (UNCHANGED from before).
 */

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ArrowRight, ArrowLeft, Building2, CreditCard,
  UserPlus, Check, Mail, MapPin,
  TrendingUp, Shield, Zap, Clock,
} from "lucide-react";
import { useAdminTheme, BRAND, TY, STATUS } from "../config/admin-theme";

const TOTAL_STEPS = 5;

interface StepProps {
  onNext: () => void;
  onBack?: () => void;
}

// ─── Shared Input ───────────────────────────────────────────────────────────

function Input({
  label, placeholder, value, onChange, type = "text", icon: Icon,
}: {
  label: string; placeholder: string; value: string;
  onChange: (v: string) => void; type?: string;
  icon?: typeof Mail;
}) {
  const { t, theme } = useAdminTheme();
  const isDark = theme === "dark";

  return (
    <div className="space-y-1.5">
      <label style={{ ...TY.body, fontSize: "10px", color: t.textMuted, lineHeight: "1.4" }}>
        {label}
      </label>
      <div className="relative">
        {Icon && (
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
            <Icon size={14} style={{ color: t.textFaint }} />
          </div>
        )}
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full py-3 rounded-xl outline-none transition-all duration-150"
          style={{
            paddingLeft: Icon ? 36 : 14,
            paddingRight: 14,
            fontFamily: "'Manrope', sans-serif", fontWeight: 400,
            fontSize: "13px", letterSpacing: "-0.02em",
            color: t.text,
            background: isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)",
            border: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}`,
            lineHeight: "1.4",
            minHeight: 44,
          }}
        />
      </div>
    </div>
  );
}


function PrimaryButton({ label, onClick, disabled = false }: {
  label: string; onClick: () => void; disabled?: boolean;
}) {
  const { theme } = useAdminTheme();
  const isDark = theme === "dark";

  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl cursor-pointer"
      style={{
        background: disabled
          ? isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)"
          : BRAND.green,
        color: disabled
          ? isDark ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.2)"
          : "#FFFFFF",
        fontFamily: "'Montserrat', sans-serif", fontWeight: 600,
        fontSize: "13px", letterSpacing: "-0.02em",
        minHeight: 48,
        opacity: disabled ? 0.5 : 1,
      }}
      whileHover={disabled ? undefined : { scale: 1.01 }}
      whileTap={disabled ? undefined : { scale: 0.99 }}
    >
      {label}
      <ArrowRight size={16} />
    </motion.button>
  );
}

function SecondaryButton({ label, onClick }: { label: string; onClick: () => void }) {
  const { t } = useAdminTheme();

  return (
    <button
      onClick={onClick}
      className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl cursor-pointer"
      style={{
        border: `1px solid ${t.borderSubtle}`,
        color: t.textMuted,
        fontFamily: "'Manrope', sans-serif", fontWeight: 500,
        fontSize: "12px", letterSpacing: "-0.02em",
        minHeight: 44,
      }}
    >
      <ArrowLeft size={14} />
      {label}
    </button>
  );
}


// ─── Step Header (shared by steps 2-4) ──────────────────────────────────────

function StepHeader({ icon: Icon, title, detail }: {
  icon: typeof Building2; title: string; detail: string;
}) {
  const { t, theme } = useAdminTheme();
  const isDark = theme === "dark";

  return (
    <div className="mb-6">
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
        style={{
          background: isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)",
          border: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)"}`,
        }}
      >
        <Icon size={18} style={{ color: t.textFaint }} />
      </div>
      <span className="block mb-1" style={{
        fontFamily: "'Montserrat', sans-serif", fontWeight: 600,
        fontSize: "18px", letterSpacing: "-0.03em", color: t.text, lineHeight: "1.2",
      }}>
        {title}
      </span>
      <span style={{ ...TY.bodyR, fontSize: "12px", color: t.textMuted, lineHeight: "1.5" }}>
        {detail}
      </span>
    </div>
  );
}


// ═══════════════════════════════════════════════════════════════════════════
// STEP 1: WELCOME — Premium first impression
// ═══════════════════════════════════════════════════════════════════════════
//
// Northstar references:
//   Stripe Atlas — full-bleed gradient, hero visual, 3 value props
//   Linear — dark atmospheric, feature cards, product preview
//   Luma — imagery + gradient overlay + clean hierarchy
//   Vercel — geometric confidence + single CTA
//
// Layout: Split on desktop (visual left, content right).
//         Stacked on mobile (visual top, content below).

function StepWelcome({ onNext }: StepProps) {
  const { t, theme } = useAdminTheme();
  const isDark = theme === "dark";

  const VALUE_PROPS = [
    {
      icon: TrendingUp,
      title: "Track earnings in real-time",
      detail: "See every trip, every naira, as it happens across your fleet.",
    },
    {
      icon: Shield,
      title: "Verified drivers & vehicles",
      detail: "Every driver goes through KYC. Every vehicle gets inspected.",
    },
    {
      icon: Zap,
      title: "Automated payouts",
      detail: "Weekly deposits to your bank account. No manual reconciliation.",
    },
    {
      icon: Clock,
      title: "Setup in under 3 minutes",
      detail: "Business profile, bank account, invite drivers. That's it.",
    },
  ];

  // Inline SVG grid pattern — Vercel/Linear style
  const gridColor = isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)";
  const GRID_SVG = `url("data:image/svg+xml,%3Csvg width='40' height='40' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='40' height='40' fill='none'/%3E%3Crect x='0' y='0' width='1' height='1' fill='${encodeURIComponent(gridColor)}'/%3E%3C/svg%3E")`;

  return (
    <div className="h-full flex flex-col md:flex-row">

      {/* ── LEFT: Geometric visual panel ─────────────────────────────── */}
      <div
        className="relative md:w-[50%] shrink-0 overflow-hidden"
        style={{
          background: isDark ? "#0A0A0C" : "#FAFAFA",
        }}
      >
        {/* Square dot grid pattern */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: GRID_SVG,
            backgroundSize: "40px 40px",
          }}
        />

        {/* Ambient glow — green bottom-center */}
        <div
          className="absolute bottom-0 left-1/2 -translate-x-1/2"
          style={{
            width: "120%",
            height: "60%",
            background: `radial-gradient(ellipse at center bottom, ${BRAND.green}${isDark ? "10" : "08"} 0%, transparent 70%)`,
          }}
        />

        {/* Ambient glow — subtle blue top-right */}
        <div
          className="absolute top-0 right-0"
          style={{
            width: "60%",
            height: "40%",
            background: `radial-gradient(ellipse at top right, ${STATUS.info}06 0%, transparent 70%)`,
          }}
        />

        {/* Edge fade into right panel */}
        <div
          className="absolute inset-y-0 right-0 w-24"
          style={{
            background: isDark
              ? "linear-gradient(to right, transparent, #0B0B0D)"
              : "linear-gradient(to right, transparent, #FFFFFF)",
          }}
        />

        {/* Content */}
        <div className="relative z-10 h-full flex flex-col justify-between p-8 md:p-12">

          {/* Top: Logo + badge */}
          <motion.div
            className="flex items-center gap-3"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{
                background: isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.03)",
                border: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)"}`,
              }}
            >
              <span style={{
                fontFamily: "'Montserrat', sans-serif", fontWeight: 700,
                fontSize: "15px", color: BRAND.green,
              }}>J</span>
            </div>
            <div>
              <span className="block" style={{
                fontFamily: "'Montserrat', sans-serif", fontWeight: 600,
                fontSize: "13px", letterSpacing: "-0.02em", color: t.text, lineHeight: "1.2",
              }}>JET Fleet</span>
              <span style={{
                fontFamily: "'Manrope', sans-serif", fontWeight: 400,
                fontSize: "10px", color: t.textFaint, lineHeight: "1.5",
              }}>Fleet Management Platform</span>
            </div>
          </motion.div>

          {/* Center: Hero copy */}
          <div>
            <motion.span
              className="block mb-3"
              style={{
                fontFamily: "'Montserrat', sans-serif", fontWeight: 600,
                fontSize: "32px", letterSpacing: "-0.03em",
                color: t.text, lineHeight: "1.1",
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.5 }}
            >
              Manage your fleet.{"\n"}
              <br />
              <span style={{ color: t.textMuted }}>Grow your business.</span>
            </motion.span>

            <motion.span
              className="block"
              style={{
                fontFamily: "'Manrope', sans-serif", fontWeight: 400,
                fontSize: "14px", letterSpacing: "-0.02em",
                color: t.textMuted, lineHeight: "1.6",
                maxWidth: 380,
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.4 }}
            >
              Real-time visibility into every vehicle, driver, and naira across your entire operation.
            </motion.span>
          </div>

          {/* Bottom: Social proof */}
          <motion.div
            className="flex items-center gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35, duration: 0.4 }}
          >
            {[
              { value: "2,400+", label: "Active fleets" },
              { value: "₦1.2B", label: "Paid out monthly" },
              { value: "99.8%", label: "Uptime" },
            ].map((stat, i) => (
              <div key={stat.label} className="flex items-center gap-3">
                {i > 0 && (
                  <div className="w-px h-6" style={{ background: t.borderSubtle }} />
                )}
                <div>
                  <span className="block" style={{
                    fontFamily: "'Montserrat', sans-serif", fontWeight: 600,
                    fontSize: "15px", letterSpacing: "-0.02em", color: t.text, lineHeight: "1.2",
                  }}>{stat.value}</span>
                  <span style={{
                    fontFamily: "'Manrope', sans-serif", fontWeight: 400,
                    fontSize: "10px", color: t.textFaint, lineHeight: "1.5",
                  }}>{stat.label}</span>
                </div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Mobile min height */}
        <div className="md:hidden" style={{ minHeight: 360 }} />
      </div>


      {/* ── RIGHT: Value props + CTA ───────────────────────────────────── */}
      <div className="flex-1 flex flex-col justify-center p-6 md:p-10 lg:p-14 overflow-y-auto">

        {/* Mobile-only: header */}
        <div className="md:hidden mb-6">
          <span className="block mb-1" style={{
            fontFamily: "'Montserrat', sans-serif", fontWeight: 600,
            fontSize: "22px", letterSpacing: "-0.03em", color: t.text, lineHeight: "1.15",
          }}>
            Welcome to JET Fleet
          </span>
          <span style={{ ...TY.bodyR, fontSize: "13px", color: t.textMuted, lineHeight: "1.5" }}>
            Let's get your fleet operation set up.
          </span>
        </div>

        {/* Desktop section label */}
        <motion.div
          className="hidden md:block mb-8"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
        >
          <span className="block mb-1" style={{
            fontFamily: "'Montserrat', sans-serif", fontWeight: 600,
            fontSize: "15px", letterSpacing: "-0.03em", color: t.text, lineHeight: "1.2",
          }}>
            Everything you need
          </span>
          <span style={{ ...TY.bodyR, fontSize: "12px", color: t.textMuted, lineHeight: "1.5" }}>
            to run a fleet on JET.
          </span>
        </motion.div>

        {/* Value prop cards — vertical list with left accent */}
        <div className="space-y-3 mb-10">
          {VALUE_PROPS.map((prop, i) => (
            <motion.div
              key={prop.title}
              className="flex items-start gap-3.5 p-4 rounded-2xl"
              style={{
                background: isDark
                  ? "rgba(255,255,255,0.02)"
                  : "rgba(0,0,0,0.012)",
                border: `1px solid ${isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)"}`,
              }}
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + i * 0.06, duration: 0.35 }}
            >
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                style={{
                  background: isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.025)",
                  border: `1px solid ${isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.04)"}`,
                }}
              >
                <prop.icon size={15} style={{ color: t.textMuted }} />
              </div>
              <div>
                <span className="block mb-0.5" style={{
                  ...TY.body, fontSize: "12px", color: t.text, lineHeight: "1.4",
                }}>
                  {prop.title}
                </span>
                <span style={{
                  ...TY.bodyR, fontSize: "10px", color: t.textMuted, lineHeight: "1.5",
                }}>
                  {prop.detail}
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          className="max-w-sm"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.3 }}
        >
          <PrimaryButton label="Get started" onClick={onNext} />
          <div className="mt-3 text-center">
            <span style={{ ...TY.bodyR, fontSize: "10px", color: t.textFaint, lineHeight: "1.5" }}>
              Takes about 3 minutes · No credit card required
            </span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}


// ═══════════════════════════════════════════════════════════════════════════
// STEP 2: BUSINESS PROFILE (with location for multi-fleet support)
// ═══════════════════════════════════════════════════════════════════════════

function StepBusinessProfile({ onNext, onBack }: StepProps) {
  const [name, setName] = useState("Metro Express Fleet");
  const [email, setEmail] = useState("chidi@metroexpress.ng");
  const [location, setLocation] = useState("Lagos");

  return (
    <div className="max-w-sm mx-auto w-full">
      <StepHeader
        icon={Building2}
        title="Business Profile"
        detail="Basic information about your fleet business."
      />
      <div className="space-y-3 mb-6">
        <Input label="Business Name" placeholder="Your fleet name" value={name} onChange={setName} icon={Building2} />
        <Input label="Email" placeholder="you@company.com" value={email} onChange={setEmail} type="email" icon={Mail} />
        <Input label="Operating Location" placeholder="e.g. Lagos, Abuja" value={location} onChange={setLocation} icon={MapPin} />
      </div>
      <div className="space-y-2">
        <PrimaryButton label="Continue" onClick={onNext} disabled={!name || !email || !location} />
        {onBack && <SecondaryButton label="Back" onClick={onBack} />}
      </div>
    </div>
  );
}


// ═══════════════════════════════════════════════════════════════════════════
// STEP 3: BANK ACCOUNT
// ═══════════════════════════════════════════════════════════════════════════

function StepBankAccount({ onNext, onBack }: StepProps) {
  const [bank, setBank] = useState("GTBank");
  const [account, setAccount] = useState("0123456789");
  const [accountName, setAccountName] = useState("Metro Express Fleet Ltd");

  return (
    <div className="max-w-sm mx-auto w-full">
      <StepHeader
        icon={CreditCard}
        title="Bank Account"
        detail="Where your fleet earnings will be deposited."
      />
      <div className="space-y-3 mb-6">
        <Input label="Bank" placeholder="Select your bank" value={bank} onChange={setBank} />
        <Input label="Account Number" placeholder="10-digit account number" value={account} onChange={setAccount} />
        <Input label="Account Name" placeholder="Auto-verified" value={accountName} onChange={setAccountName} />
      </div>
      <div className="space-y-2">
        <PrimaryButton label="Continue" onClick={onNext} disabled={!bank || !account} />
        {onBack && <SecondaryButton label="Back" onClick={onBack} />}
      </div>
    </div>
  );
}


// ═══════════════════════════════════════════════════════════════════════════
// STEP 4: INVITE FIRST DRIVER (via email, not phone)
// ═══════════════════════════════════════════════════════════════════════════

function StepInviteDriver({ onNext, onBack }: StepProps) {
  const { t } = useAdminTheme();
  const [driverName, setDriverName] = useState("");
  const [driverEmail, setDriverEmail] = useState("");

  return (
    <div className="max-w-sm mx-auto w-full">
      <StepHeader
        icon={UserPlus}
        title="Invite Your First Driver"
        detail="They'll receive an email with instructions to sign up and register their vehicle."
      />
      <div className="space-y-3 mb-6">
        <Input label="Driver Name" placeholder="Full name" value={driverName} onChange={setDriverName} icon={UserPlus} />
        <Input label="Email Address" placeholder="driver@email.com" value={driverEmail} onChange={setDriverEmail} type="email" icon={Mail} />
      </div>
      <div className="space-y-2">
        <PrimaryButton label="Send Invite" onClick={onNext} disabled={!driverName || !driverEmail} />
        <button
          onClick={onNext}
          className="w-full py-3 cursor-pointer"
          style={{
            ...TY.body, fontSize: "12px", color: t.textMuted,
            lineHeight: "1.4",
          }}
        >
          Skip for now
        </button>
        {onBack && <SecondaryButton label="Back" onClick={onBack} />}
      </div>
    </div>
  );
}


// ═══════════════════════════════════════════════════════════════════════════
// STEP 5: DONE
// ═══════════════════════════════════════════════════════════════════════════

function StepDone({ onNext }: StepProps) {
  const { t, theme } = useAdminTheme();
  const isDark = theme === "dark";

  return (
    <div className="flex flex-col items-center text-center max-w-sm mx-auto">
      <motion.div
        className="w-16 h-16 rounded-full flex items-center justify-center mb-6"
        style={{
          background: `linear-gradient(135deg, ${BRAND.green}18 0%, ${BRAND.green}06 100%)`,
          border: `1px solid ${BRAND.green}15`,
        }}
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        <Check size={28} style={{ color: BRAND.green }} />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.4 }}
      >
        <span className="block mb-2" style={{
          fontFamily: "'Montserrat', sans-serif", fontWeight: 600,
          fontSize: "22px", letterSpacing: "-0.03em", color: t.text, lineHeight: "1.2",
        }}>
          You're all set
        </span>
        <span className="block mb-3" style={{
          ...TY.bodyR, fontSize: "13px", color: t.textMuted, lineHeight: "1.5",
        }}>
          Your fleet dashboard is ready. We'll notify you when your first driver signs up.
        </span>
      </motion.div>

      {/* Next steps summary */}
      <motion.div
        className="w-full rounded-2xl p-4 mb-8 text-left"
        style={{
          background: isDark ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.015)",
          border: `1px solid ${isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)"}`,
        }}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25, duration: 0.35 }}
      >
        <span className="block mb-2" style={{ ...TY.body, fontSize: "10px", color: t.textFaint, lineHeight: "1.4" }}>
          WHAT HAPPENS NEXT
        </span>
        {[
          "Your driver receives an email invite",
          "They sign up and register their vehicle",
          "Vehicle goes through inspection",
          "Rides start → earnings appear on your dashboard",
        ].map((item, i) => (
          <div key={i} className="flex items-start gap-2 py-1.5">
            <span style={{
              fontFamily: "'Montserrat', sans-serif", fontWeight: 600,
              fontSize: "9px", color: t.textFaint,
              width: 16, textAlign: "center", lineHeight: "1.4", flexShrink: 0,
              marginTop: 1,
            }}>
              {i + 1}
            </span>
            <span style={{ ...TY.bodyR, fontSize: "11px", color: t.textMuted, lineHeight: "1.5" }}>
              {item}
            </span>
          </div>
        ))}
      </motion.div>

      <motion.div
        className="w-full"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.3 }}
      >
        <PrimaryButton label="Go to Dashboard" onClick={onNext} />
      </motion.div>
    </div>
  );
}


// ─── Progress Dots ──────────────────────────────────────────────────────────

function ProgressDots({ current, total }: { current: number; total: number }) {
  const { t } = useAdminTheme();

  return (
    <div className="flex items-center gap-1.5">
      {Array.from({ length: total }).map((_, i) => (
        <motion.div
          key={i}
          className="rounded-full"
          style={{
            width: i === current ? 20 : 6,
            height: 6,
            background: i === current
              ? BRAND.green
              : i < current
                ? `${BRAND.green}40`
                : t.borderSubtle,
          }}
          animate={{
            width: i === current ? 20 : 6,
          }}
          transition={{ duration: 0.2 }}
        />
      ))}
    </div>
  );
}


// ═══════════════════════════════════════════════════════════════════════════
// MAIN ONBOARDING
// ═══════════════════════════════════════════════════════════════════════════

export function FleetOnboarding({ onComplete }: { onComplete: () => void }) {
  const { t, theme } = useAdminTheme();
  const isDark = theme === "dark";
  const [step, setStep] = useState(0);

  const next = () => {
    if (step < TOTAL_STEPS - 1) {
      setStep(s => s + 1);
    } else {
      onComplete();
    }
  };
  const back = () => setStep(s => Math.max(0, s - 1));

  const STEPS = [
    <StepWelcome key="welcome" onNext={next} />,
    <StepBusinessProfile key="profile" onNext={next} onBack={back} />,
    <StepBankAccount key="bank" onNext={next} onBack={back} />,
    <StepInviteDriver key="driver" onNext={next} onBack={back} />,
    <StepDone key="done" onNext={next} />,
  ];

  // Welcome page is full-bleed — no chrome
  if (step === 0) {
    return (
      <div className="h-full overflow-hidden" style={{ background: isDark ? "#0B0B0D" : "#FFFFFF" }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={0}
            className="h-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {STEPS[0]}
          </motion.div>
        </AnimatePresence>
      </div>
    );
  }

  // Steps 2-5 get the standard chrome (progress dots + step counter)
  return (
    <div className="h-full flex flex-col" style={{ background: t.bg }}>
      {/* Top bar with progress */}
      <div
        className="shrink-0 px-6 flex items-center justify-between"
        style={{ height: 56, borderBottom: `1px solid ${t.borderSubtle}` }}
      >
        <div className="flex items-center gap-2.5">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center"
            style={{
              background: `linear-gradient(135deg, ${BRAND.green}18 0%, ${BRAND.green}06 100%)`,
              border: `1px solid ${BRAND.green}12`,
            }}
          >
            <span style={{
              fontFamily: "'Montserrat', sans-serif", fontWeight: 700,
              fontSize: "10px", color: BRAND.green,
            }}>J</span>
          </div>
          <span style={{
            fontFamily: "'Montserrat', sans-serif", fontWeight: 600,
            fontSize: "12px", letterSpacing: "-0.02em", color: t.textMuted,
          }}>
            Fleet Setup
          </span>
        </div>
        <ProgressDots current={step} total={TOTAL_STEPS} />
        <span style={{ ...TY.bodyR, fontSize: "10px", color: t.textFaint, lineHeight: "1.5" }}>
          {step + 1} of {TOTAL_STEPS}
        </span>
      </div>

      {/* Step content */}
      <div className="flex-1 flex items-center justify-center p-6 overflow-y-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            className="w-full"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          >
            {STEPS[step]}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}