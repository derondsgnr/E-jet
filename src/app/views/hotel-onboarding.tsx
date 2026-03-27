/**
 * HOTEL — ONBOARDING WIZARD
 *
 * 4 steps: Welcome → Hotel Profile → Team Setup → Done
 * Simpler than fleet onboarding — hotels have simpler setup needs.
 */

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Building2, Users, UserPlus, ArrowRight, ArrowLeft, Check, Mail, Star, ChevronRight, Car } from "lucide-react";
import { useAdminTheme, BRAND, TY, STATUS } from "../config/admin-theme";

const TOTAL_STEPS = 4;

interface StepProps {
  onNext: () => void;
  onBack?: () => void;
}


// ── Progress Bar ────────────────────────────────────────────────────────────

function ProgressBar({ step }: { step: number }) {
  const { t, theme } = useAdminTheme();
  const isDark = theme === "dark";

  return (
    <div className="flex items-center gap-1.5 mb-8">
      {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
        <div key={i} className="flex-1 h-1 rounded-full overflow-hidden" style={{
          background: isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)",
        }}>
          <motion.div
            className="h-full rounded-full"
            style={{ background: BRAND.green }}
            initial={{ width: 0 }}
            animate={{ width: i < step ? "100%" : i === step ? "50%" : "0%" }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          />
        </div>
      ))}
    </div>
  );
}


// ── Step Header ─────────────────────────────────────────────────────────────

function StepHeader({ icon: Icon, title, detail }: {
  icon: typeof Building2; title: string; detail: string;
}) {
  const { t } = useAdminTheme();
  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-2">
        <Icon size={16} style={{ color: BRAND.green }} />
        <span style={{
          fontFamily: "'Montserrat', sans-serif", fontWeight: 600,
          fontSize: "16px", letterSpacing: "-0.03em", color: t.text, lineHeight: "1.2",
        }}>
          {title}
        </span>
      </div>
      <span style={{ ...TY.bodyR, fontSize: "12px", color: t.textMuted, lineHeight: "1.5" }}>
        {detail}
      </span>
    </div>
  );
}


// ── Input ───────────────────────────────────────────────────────────────────

function Input({ label, value, onChange, placeholder, type = "text" }: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string; type?: string;
}) {
  const { t, theme } = useAdminTheme();
  const isDark = theme === "dark";

  return (
    <div>
      <label className="block mb-1.5">
        <span style={{ ...TY.body, fontSize: "11px", color: t.textMuted, lineHeight: "1.4", letterSpacing: "-0.02em" }}>{label}</span>
      </label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-3 py-2.5 rounded-xl bg-transparent outline-none"
        style={{
          border: `1px solid ${t.borderSubtle}`,
          ...TY.bodyR, fontSize: "12px", color: t.text, lineHeight: "1.4",
          minHeight: 44,
        }}
      />
    </div>
  );
}


// ── Nav Buttons ─────────────────────────────────────────────────────────────

function NavButtons({ onNext, onBack, nextLabel = "Continue", disabled = false }: {
  onNext: () => void; onBack?: () => void; nextLabel?: string; disabled?: boolean;
}) {
  const { t } = useAdminTheme();
  return (
    <div className="flex items-center gap-3 mt-8">
      {onBack && (
        <button onClick={onBack} className="px-4 py-2.5 rounded-xl cursor-pointer" style={{ border: `1px solid ${t.borderSubtle}`, minHeight: 44 }}>
          <ArrowLeft size={14} style={{ color: t.textMuted }} />
        </button>
      )}
      <button
        onClick={onNext}
        disabled={disabled}
        className="flex-1 py-2.5 rounded-xl flex items-center justify-center gap-2 cursor-pointer"
        style={{
          background: disabled ? t.surface : BRAND.green,
          border: `1px solid ${disabled ? t.borderSubtle : BRAND.green}`,
          minHeight: 44,
          opacity: disabled ? 0.5 : 1,
        }}
      >
        <span style={{ ...TY.body, fontSize: "12px", color: disabled ? t.textFaint : "#fff", letterSpacing: "-0.02em", lineHeight: "1.4" }}>
          {nextLabel}
        </span>
        <ArrowRight size={14} style={{ color: disabled ? t.textFaint : "#fff" }} />
      </button>
    </div>
  );
}


// ═══════════════════════════════════════════════════════════════════════════
// STEP 1: WELCOME
// ═══════════════════════════════════════════════════════════════════════════

function StepWelcome({ onNext }: StepProps) {
  const { t, theme } = useAdminTheme();
  const isDark = theme === "dark";

  const features = [
    { icon: "🚗", title: "Book rides for guests", detail: "Airport transfers, city tours, business meetings — all from your dashboard" },
    { icon: "📊", title: "Track every ride", detail: "Real-time status, driver ratings, and complete ride history" },
    { icon: "💳", title: "Simplified billing", detail: "Monthly invoicing with credit limits — no per-ride payments" },
    { icon: "👥", title: "Team access", detail: "Concierge and front desk staff can book on behalf of guests" },
  ];

  return (
    <div className="flex flex-col items-center justify-center h-full p-6">
      <motion.div
        className="max-w-md w-full text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5"
          style={{ background: isDark ? `${BRAND.green}08` : `${BRAND.green}06`, border: `1px solid ${isDark ? `${BRAND.green}14` : `${BRAND.green}10`}` }}
        >
          <Building2 size={28} style={{ color: BRAND.green }} />
        </div>

        <h1 className="mb-2" style={{
          fontFamily: "'Montserrat', sans-serif", fontWeight: 600,
          fontSize: "22px", letterSpacing: "-0.03em", color: t.text, lineHeight: "1.2",
        }}>
          Welcome to JET for Hotels
        </h1>
        <p className="mb-8" style={{ ...TY.bodyR, fontSize: "13px", color: t.textMuted, lineHeight: "1.5" }}>
          Seamless guest mobility, billed to your account. Let's get you set up in under 2 minutes.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8 text-left">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              className="px-4 py-3 rounded-xl"
              style={{ background: isDark ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.015)", border: `1px solid ${t.borderSubtle}` }}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.06 }}
            >
              <span className="text-base mb-1 block">{f.icon}</span>
              <span className="block" style={{ ...TY.body, fontSize: "11px", color: t.text, lineHeight: "1.4", letterSpacing: "-0.02em" }}>{f.title}</span>
              <span style={{ ...TY.bodyR, fontSize: "10px", color: t.textMuted, lineHeight: "1.5" }}>{f.detail}</span>
            </motion.div>
          ))}
        </div>

        <button
          onClick={onNext}
          className="w-full py-3 rounded-xl flex items-center justify-center gap-2 cursor-pointer"
          style={{ background: BRAND.green, border: `1px solid ${BRAND.green}`, minHeight: 48 }}
        >
          <span style={{ ...TY.body, fontSize: "13px", color: "#fff", letterSpacing: "-0.02em", lineHeight: "1.4" }}>
            Get started
          </span>
          <ArrowRight size={16} style={{ color: "#fff" }} />
        </button>
      </motion.div>
    </div>
  );
}


// ═══════════════════════════════════════════════════════════════════════════
// STEP 2: HOTEL PROFILE
// ═══════════════════════════════════════════════════════════════════════════

function StepProfile({ onNext, onBack }: StepProps) {
  const [name, setName] = useState("Eko Hotels & Suites");
  const [address, setAddress] = useState("Victoria Island, Lagos");
  const [rating, setRating] = useState(5);
  const { t } = useAdminTheme();

  return (
    <div className="max-w-sm mx-auto w-full">
      <StepHeader icon={Building2} title="Hotel details" detail="Confirm your hotel information" />
      <div className="space-y-4">
        <Input label="Hotel name" value={name} onChange={setName} />
        <Input label="Address" value={address} onChange={setAddress} />
        <div>
          <label className="block mb-1.5">
            <span style={{ ...TY.body, fontSize: "11px", color: t.textMuted, lineHeight: "1.4", letterSpacing: "-0.02em" }}>Star rating</span>
          </label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map(r => (
              <button key={r} onClick={() => setRating(r)} className="w-10 h-10 rounded-xl flex items-center justify-center cursor-pointer"
                style={{ background: r <= rating ? `${BRAND.green}08` : "transparent", border: `1px solid ${r <= rating ? `${BRAND.green}18` : t.borderSubtle}` }}>
                <Star size={14} style={{ color: r <= rating ? BRAND.green : t.textFaint, fill: r <= rating ? BRAND.green : "none" }} />
              </button>
            ))}
          </div>
        </div>
      </div>
      <NavButtons onNext={onNext} onBack={onBack} disabled={!name.trim()} />
    </div>
  );
}


// ═══════════════════════════════════════════════════════════════════════════
// STEP 3: INVITE TEAM
// ═══════════════════════════════════════════════════════════════════════════

function StepTeam({ onNext, onBack }: StepProps) {
  const [email, setEmail] = useState("");
  const [invited, setInvited] = useState<string[]>([]);
  const { t, theme } = useAdminTheme();
  const isDark = theme === "dark";

  const invite = () => {
    if (email.trim() && email.includes("@")) {
      setInvited([...invited, email.trim()]);
      setEmail("");
    }
  };

  return (
    <div className="max-w-sm mx-auto w-full">
      <StepHeader icon={Users} title="Invite your team" detail="Add concierge or front desk staff who'll book rides for guests" />

      <div className="flex items-center gap-2 mb-4">
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="team@hotel.com"
          className="flex-1 px-3 py-2.5 rounded-xl bg-transparent outline-none"
          style={{ border: `1px solid ${t.borderSubtle}`, ...TY.bodyR, fontSize: "12px", color: t.text, lineHeight: "1.4", minHeight: 44 }}
          onKeyDown={e => { if (e.key === "Enter") invite(); }}
        />
        <button
          onClick={invite}
          disabled={!email.includes("@")}
          className="px-4 py-2.5 rounded-xl cursor-pointer"
          style={{ background: email.includes("@") ? BRAND.green : t.surface, border: `1px solid ${email.includes("@") ? BRAND.green : t.borderSubtle}`, minHeight: 44, opacity: email.includes("@") ? 1 : 0.5 }}
        >
          <UserPlus size={14} style={{ color: email.includes("@") ? "#fff" : t.textFaint }} />
        </button>
      </div>

      {invited.length > 0 && (
        <div className="space-y-1.5 mb-4">
          {invited.map((e, i) => (
            <div key={i} className="flex items-center gap-2 px-3 py-2 rounded-xl" style={{ background: isDark ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.015)", border: `1px solid ${t.borderSubtle}` }}>
              <Mail size={11} style={{ color: BRAND.green }} />
              <span className="flex-1" style={{ ...TY.bodyR, fontSize: "11px", color: t.text, lineHeight: "1.4" }}>{e}</span>
              <Check size={11} style={{ color: BRAND.green }} />
            </div>
          ))}
        </div>
      )}

      <p style={{ ...TY.bodyR, fontSize: "10px", color: t.textFaint, lineHeight: "1.5" }}>
        You can skip this and invite team members later from Settings.
      </p>

      <NavButtons onNext={onNext} onBack={onBack} nextLabel={invited.length > 0 ? "Continue" : "Skip for now"} />
    </div>
  );
}


// ═══════════════════════════════════════════════════════════════════════════
// STEP 4: DONE
// ═══════════════════════════════════════════════════════════════════════════

function StepDone({ onNext }: StepProps) {
  const { t, theme } = useAdminTheme();
  const isDark = theme === "dark";

  return (
    <div className="max-w-sm mx-auto w-full text-center">
      <motion.div
        className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5"
        style={{ background: `${BRAND.green}10`, border: `2px solid ${BRAND.green}` }}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        <Check size={28} style={{ color: BRAND.green }} />
      </motion.div>

      <h2 className="mb-2" style={{
        fontFamily: "'Montserrat', sans-serif", fontWeight: 600,
        fontSize: "18px", letterSpacing: "-0.03em", color: t.text, lineHeight: "1.2",
      }}>
        You're all set!
      </h2>
      <p className="mb-8" style={{ ...TY.bodyR, fontSize: "12px", color: t.textMuted, lineHeight: "1.5" }}>
        Your hotel dashboard is ready. Start booking rides for your guests — we'll handle the rest.
      </p>

      <div className="space-y-2 text-left mb-8">
        {[
          { label: "Book your first guest ride", icon: Car },
          { label: "View monthly invoices in Billing", icon: "📊" },
          { label: "Invite more team members in Settings", icon: Users },
        ].map((item, i) => (
          <motion.div
            key={item.label}
            className="flex items-center gap-3 px-4 py-3 rounded-xl"
            style={{ background: isDark ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.015)", border: `1px solid ${t.borderSubtle}` }}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 + i * 0.08 }}
          >
            {typeof item.icon === "string" ? (
              <span>{item.icon}</span>
            ) : (
              <item.icon size={14} style={{ color: BRAND.green }} />
            )}
            <span style={{ ...TY.body, fontSize: "11px", color: t.text, lineHeight: "1.4", letterSpacing: "-0.02em" }}>{item.label}</span>
            <ChevronRight size={12} className="ml-auto" style={{ color: t.textFaint }} />
          </motion.div>
        ))}
      </div>

      <button
        onClick={onNext}
        className="w-full py-3 rounded-xl flex items-center justify-center gap-2 cursor-pointer"
        style={{ background: BRAND.green, border: `1px solid ${BRAND.green}`, minHeight: 48 }}
      >
        <span style={{ ...TY.body, fontSize: "13px", color: "#fff", letterSpacing: "-0.02em", lineHeight: "1.4" }}>
          Go to dashboard
        </span>
        <ArrowRight size={16} style={{ color: "#fff" }} />
      </button>
    </div>
  );
}


// ═══════════════════════════════════════════════════════════════════════════
// MAIN
// ═══════════════════════════════════════════════════════════════════════════

export function HotelOnboarding({ onComplete }: { onComplete: () => void }) {
  const { t } = useAdminTheme();
  const [step, setStep] = useState(0);

  const next = () => {
    if (step >= TOTAL_STEPS - 1) { onComplete(); return; }
    setStep(s => s + 1);
  };
  const back = () => setStep(s => Math.max(0, s - 1));

  return (
    <div className="h-full flex flex-col p-6 overflow-y-auto">
      {step > 0 && <ProgressBar step={step} />}
      <div className="flex-1 flex items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            className="w-full"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25 }}
          >
            {step === 0 && <StepWelcome onNext={next} />}
            {step === 1 && <StepProfile onNext={next} onBack={back} />}
            {step === 2 && <StepTeam onNext={next} onBack={back} />}
            {step === 3 && <StepDone onNext={next} />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}