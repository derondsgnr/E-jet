 /**
 * Onboarding shared components — cinematic intro, auth form, OTP, KYC.
 *
 * Used by all three onboarding layout variations.
 * Flow: splash → auth → otp → kyc → done
 */

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Smartphone, ArrowRight, ArrowLeft, Check } from "lucide-react";
import { MOTION, GLASS_COLORS, GLASS_TYPE, type GlassColorMode } from "../../config/project";
import { BRAND } from "../../config/brand";
import { JetLogo } from "../brand/jet-logo";

// ─── Flow state ──────────────────────────────────────────────────────────────
export type OnboardingStep = "splash" | "auth" | "otp" | "kyc" | "done";

export function useOnboardingFlow() {
  const [step, setStep] = useState<OnboardingStep>("splash");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  // Auto-advance from splash
  useEffect(() => {
    if (step === "splash") {
      const timer = setTimeout(() => setStep("auth"), 2500);
      return () => clearTimeout(timer);
    }
  }, [step]);

  const goToOtp = useCallback(() => setStep("otp"), []);
  const goToKyc = useCallback(() => setStep("kyc"), []);
  const goToDone = useCallback(() => setStep("done"), []);
  const goBack = useCallback(() => {
    if (step === "otp") setStep("auth");
    else if (step === "kyc") setStep("otp");
  }, [step]);
  const resetToSplash = useCallback(() => {
    setStep("splash");
    setPhone("");
    setOtp(["", "", "", "", "", ""]);
    setFirstName("");
    setLastName("");
  }, []);

  return {
    step, setStep,
    phone, setPhone,
    otp, setOtp,
    firstName, setFirstName,
    lastName, setLastName,
    goToOtp, goToKyc, goToDone, goBack, resetToSplash,
  };
}

// ─── Cinematic Splash ────────────────────────────────────────────────────────
export function CinematicSplash({ colorMode }: { colorMode: GlassColorMode }) {
  const c = GLASS_COLORS[colorMode];
  const isLight = colorMode === "light";

  return (
    <motion.div
      className="absolute inset-0 flex flex-col items-center justify-center z-20"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      transition={{ ...MOTION.emphasis, duration: 0.6 }}
    >
      {/* Backdrop blur veil */}
      <div
        className="absolute inset-0"
        style={{
          background: isLight
            ? "rgba(250,250,250,0.6)"
            : "rgba(11,11,13,0.7)",
          backdropFilter: "blur(40px)",
          WebkitBackdropFilter: "blur(40px)",
        }}
      />

      {/* Logo + tagline */}
      <motion.div
        className="relative z-10 flex flex-col items-center gap-6"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...MOTION.emphasis, delay: 0.2 }}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ ...MOTION.emphasis, delay: 0.1 }}
        >
          <JetLogo
            variant="full"
            mode={isLight ? "dark" : "light"}
            height={48}
          />
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...MOTION.emphasis, delay: 0.5 }}
          style={{
            ...GLASS_TYPE.body,
            color: c.text.secondary,
          }}
        >
          {BRAND.tagline}
        </motion.p>

        {/* Subtle loading pulse */}
        <motion.div
          className="flex items-center gap-1.5 mt-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-1.5 h-1.5 rounded-full"
              style={{ background: "#1DB954" }}
              animate={{ opacity: [0.2, 0.8, 0.2] }}
              transition={{
                duration: 1.2,
                repeat: Infinity,
                delay: i * 0.15,
                ease: "easeInOut",
              }}
            />
          ))}
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

// ─── Social login buttons ────────────────────────────────────────────────────
function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 01-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
      <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853"/>
      <path d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.997 8.997 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
      <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
    </svg>
  );
}

function AppleIcon({ color }: { color: string }) {
  return (
    <svg width="16" height="18" viewBox="0 0 16 18" fill={color}>
      <path d="M13.168 9.483c-.024-2.508 2.055-3.718 2.148-3.779-1.172-1.711-2.994-1.944-3.639-1.969-1.539-.16-3.024.921-3.81.921-.799 0-2.013-.904-3.315-.878C2.922 3.804 1.382 4.66.535 6.105c-1.734 2.999-.442 7.425 1.235 9.855.829 1.192 1.808 2.526 3.093 2.479 1.249-.053 1.718-.8 3.227-.8 1.497 0 1.93.8 3.236.771 1.34-.024 2.186-1.205 3.002-2.404.96-1.374 1.348-2.724 1.366-2.795-.031-.011-2.61-1-2.636-3.972l.11.244zM10.758 2.45C11.44 1.622 11.9.493 11.777-.5c-.963.042-2.163.66-2.856 1.475C8.272 1.72 7.72 2.876 7.866 3.979c1.079.08 2.185-.549 2.892-1.528z"/>
    </svg>
  );
}

export function SocialButtons({ colorMode, onSocialLogin }: {
  colorMode: GlassColorMode;
  onSocialLogin: (provider: "google" | "apple") => void;
}) {
  const c = GLASS_COLORS[colorMode];
  const isLight = colorMode === "light";

  return (
    <div className="flex flex-col gap-3 w-full">
      <motion.button
        className="flex items-center justify-center gap-3 w-full py-3.5 rounded-xl transition-colors"
        style={{
          background: c.surface.raised,
          border: `1px solid ${isLight ? "rgba(0,0,0,0.08)" : "rgba(255,255,255,0.08)"}`,
          ...GLASS_TYPE.small,
          color: c.text.primary,
        }}
        whileTap={{ scale: 0.98 }}
        onClick={() => onSocialLogin("google")}
      >
        <GoogleIcon />
        Continue with Google
      </motion.button>

      <motion.button
        className="flex items-center justify-center gap-3 w-full py-3.5 rounded-xl transition-colors"
        style={{
          background: isLight ? "#0B0B0D" : "rgba(255,255,255,0.9)",
          ...GLASS_TYPE.small,
          color: isLight ? "#fff" : "#0B0B0D",
        }}
        whileTap={{ scale: 0.98 }}
        onClick={() => onSocialLogin("apple")}
      >
        <AppleIcon color={isLight ? "#fff" : "#0B0B0D"} />
        Continue with Apple
      </motion.button>
    </div>
  );
}

// ─── Divider ─────────────────────────────────────────────────────────────────
export function OrDivider({ colorMode }: { colorMode: GlassColorMode }) {
  const c = GLASS_COLORS[colorMode];
  return (
    <div className="flex items-center gap-4 w-full my-1">
      <div className="flex-1 h-px" style={{ background: c.surface.hover }} />
      <span style={{ ...GLASS_TYPE.caption, color: c.text.muted }}>or</span>
      <div className="flex-1 h-px" style={{ background: c.surface.hover }} />
    </div>
  );
}

// ─── Phone input ──────────────────────────────────────────────────────��──────
export function PhoneInput({ colorMode, phone, setPhone, onContinue }: {
  colorMode: GlassColorMode;
  phone: string;
  setPhone: (v: string) => void;
  onContinue: () => void;
}) {
  const c = GLASS_COLORS[colorMode];
  const isLight = colorMode === "light";
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.length >= 10) onContinue();
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
      <div
        className="flex items-center gap-0 rounded-xl overflow-hidden"
        style={{
          background: c.surface.subtle,
          border: `1px solid ${isLight ? "rgba(0,0,0,0.08)" : "rgba(255,255,255,0.08)"}`,
        }}
      >
        <div
          className="flex items-center gap-2 px-4 py-3.5 shrink-0"
          style={{
            borderRight: `1px solid ${c.surface.hover}`,
          }}
        >
          <span style={{ ...GLASS_TYPE.small, color: c.text.secondary }}>🇳🇬</span>
          <span style={{ ...GLASS_TYPE.small, color: c.text.secondary }}>+234</span>
        </div>
        <input
          ref={inputRef}
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 11))}
          placeholder="Phone number"
          className="flex-1 bg-transparent px-4 py-3.5 outline-none"
          style={{
            ...GLASS_TYPE.small,
            color: c.text.primary,
            caretColor: "#1DB954",
          }}
          autoFocus
        />
      </div>

      <motion.button
        type="submit"
        className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl transition-all"
        style={{
          background: phone.length >= 10 ? "#1DB954" : c.surface.raised,
          color: phone.length >= 10 ? "#fff" : c.text.muted,
          ...GLASS_TYPE.small,
          fontWeight: 600,
        }}
        whileTap={{ scale: 0.98 }}
        disabled={phone.length < 10}
      >
        <Smartphone className="w-4 h-4" />
        Continue with phone
      </motion.button>
    </form>
  );
}

// ─── OTP Verification ────────────────────────────────────────────────────────
export function OtpVerification({ colorMode, otp, setOtp, onVerify, onBack, phone }: {
  colorMode: GlassColorMode;
  otp: string[];
  setOtp: (v: string[]) => void;
  onVerify: () => void;
  onBack: () => void;
  phone: string;
}) {
  const c = GLASS_COLORS[colorMode];
  const isLight = colorMode === "light";
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [resendTimer, setResendTimer] = useState(30);

  useEffect(() => {
    inputRefs.current[0]?.focus();
    const interval = setInterval(() => {
      setResendTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Auto-verify when all filled
  useEffect(() => {
    if (otp.every((d) => d !== "")) {
      const timer = setTimeout(onVerify, 600);
      return () => clearTimeout(timer);
    }
  }, [otp, onVerify]);

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  return (
    <div className="flex flex-col items-center gap-6 w-full">
      {/* Back + Title */}
      <div className="flex flex-col items-center gap-2 w-full">
        <button
          onClick={onBack}
          className="self-start flex items-center gap-1.5 mb-2"
          style={{ ...GLASS_TYPE.small, color: c.text.secondary }}
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
        <h2
          style={{
            ...GLASS_TYPE.display,
            fontSize: "22px",
            color: c.text.primary,
            textAlign: "center",
          }}
        >
          Verify your number
        </h2>
        <p style={{ ...GLASS_TYPE.bodySmall, color: c.text.tertiary, textAlign: "center" }}>
          We sent a code to +234 {phone}
        </p>
      </div>

      {/* OTP inputs */}
      <div className="flex items-center gap-3">
        {otp.map((digit, i) => (
          <motion.input
            key={i}
            ref={(el: HTMLInputElement | null) => { inputRefs.current[i] = el; }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange(i, e.target.value)}
            onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => handleKeyDown(i, e)}
            className="w-12 h-14 text-center rounded-xl outline-none"
            style={{
              background: digit ? (isLight ? "rgba(29,185,84,0.06)" : "rgba(29,185,84,0.1)") : c.surface.subtle,
              border: `1.5px solid ${digit ? "rgba(29,185,84,0.3)" : (isLight ? "rgba(0,0,0,0.06)" : "rgba(255,255,255,0.06)")}`,
              ...GLASS_TYPE.display,
              fontSize: "20px",
              color: c.text.primary,
              caretColor: "#1DB954",
              transition: "border-color 0.15s, background 0.15s",
            }}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...MOTION.standard, delay: i * MOTION.stagger }}
          />
        ))}
      </div>

      {/* Resend */}
      <p style={{ ...GLASS_TYPE.bodySmall, color: c.text.muted, textAlign: "center" }}>
        {resendTimer > 0 ? (
          <>Resend code in <span style={{ color: c.text.secondary }}>{resendTimer}s</span></>
        ) : (
          <button
            onClick={() => setResendTimer(30)}
            style={{ color: "#1DB954" }}
          >
            Resend code
          </button>
        )}
      </p>
    </div>
  );
}

// ─── KYC Form ────────────────────────────────────────────────────────────────
export function KycForm({ colorMode, firstName, setFirstName, lastName, setLastName, onComplete }: {
  colorMode: GlassColorMode;
  firstName: string;
  setFirstName: (v: string) => void;
  lastName: string;
  setLastName: (v: string) => void;
  onComplete: () => void;
}) {
  const c = GLASS_COLORS[colorMode];
  const isLight = colorMode === "light";
  const isValid = firstName.trim().length >= 2 && lastName.trim().length >= 2;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isValid) onComplete();
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6 w-full">
      <div className="flex flex-col items-center gap-2">
        <h2
          style={{
            ...GLASS_TYPE.display,
            fontSize: "22px",
            color: c.text.primary,
            textAlign: "center",
          }}
        >
          What's your name?
        </h2>
        <p style={{ ...GLASS_TYPE.bodySmall, color: c.text.tertiary, textAlign: "center" }}>
          This helps your driver identify you
        </p>
      </div>

      <div className="flex flex-col gap-3">
        <motion.input
          type="text"
          value={firstName}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFirstName(e.target.value)}
          placeholder="First name"
          className="w-full px-4 py-3.5 rounded-xl outline-none"
          style={{
            background: c.surface.subtle,
            border: `1px solid ${firstName ? "rgba(29,185,84,0.2)" : (isLight ? "rgba(0,0,0,0.06)" : "rgba(255,255,255,0.06)")}`,
            ...GLASS_TYPE.small,
            color: c.text.primary,
            caretColor: "#1DB954",
            transition: "border-color 0.15s",
          }}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...MOTION.standard, delay: 0 }}
          autoFocus
        />
        <motion.input
          type="text"
          value={lastName}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLastName(e.target.value)}
          placeholder="Last name"
          className="w-full px-4 py-3.5 rounded-xl outline-none"
          style={{
            background: c.surface.subtle,
            border: `1px solid ${lastName ? "rgba(29,185,84,0.2)" : (isLight ? "rgba(0,0,0,0.06)" : "rgba(255,255,255,0.06)")}`,
            ...GLASS_TYPE.small,
            color: c.text.primary,
            caretColor: "#1DB954",
            transition: "border-color 0.15s",
          }}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...MOTION.standard, delay: MOTION.stagger }}
        />
      </div>

      <motion.button
        type="submit"
        className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl transition-all"
        style={{
          background: isValid ? "#1DB954" : c.surface.raised,
          color: isValid ? "#fff" : c.text.muted,
          ...GLASS_TYPE.small,
          fontWeight: 600,
        }}
        whileTap={{ scale: 0.98 }}
        disabled={!isValid}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...MOTION.standard, delay: MOTION.stagger * 2 }}
      >
        <Check className="w-4 h-4" />
        Get started
      </motion.button>
    </form>
  );
}

// ─── Done celebration ────────────────────────────────────────────────────────
export function DoneCelebration({ colorMode, firstName, onContinue }: {
  colorMode: GlassColorMode;
  firstName: string;
  onContinue: () => void;
}) {
  const c = GLASS_COLORS[colorMode];

  useEffect(() => {
    const timer = setTimeout(onContinue, 2000);
    return () => clearTimeout(timer);
  }, [onContinue]);

  return (
    <motion.div
      className="flex flex-col items-center justify-center gap-4"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={MOTION.emphasis}
    >
      {/* Check circle */}
      <motion.div
        className="w-16 h-16 rounded-full flex items-center justify-center"
        style={{ background: "rgba(29,185,84,0.12)" }}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.1 }}
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 400, damping: 15, delay: 0.3 }}
        >
          <Check className="w-7 h-7" style={{ color: "#1DB954" }} />
        </motion.div>
      </motion.div>

      <motion.h2
        style={{ ...GLASS_TYPE.display, fontSize: "22px", color: c.text.primary, textAlign: "center" }}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...MOTION.emphasis, delay: 0.4 }}
      >
        Welcome, {firstName}
      </motion.h2>

      <motion.p
        style={{ ...GLASS_TYPE.bodySmall, color: c.text.tertiary, textAlign: "center" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ ...MOTION.emphasis, delay: 0.6 }}
      >
        Let's get you moving
      </motion.p>
    </motion.div>
  );
}

// ─── Terms text ──────────────────────────────────────────────────────────────
export function TermsText({ colorMode }: { colorMode: GlassColorMode }) {
  const c = GLASS_COLORS[colorMode];
  return (
    <p style={{ ...GLASS_TYPE.caption, color: c.text.muted, textAlign: "center", lineHeight: "1.5" }}>
      By continuing, you agree to our{" "}
      <span style={{ color: c.text.secondary, textDecoration: "underline", textUnderlineOffset: "2px" }}>
        Terms of Service
      </span>{" "}
      and{" "}
      <span style={{ color: c.text.secondary, textDecoration: "underline", textUnderlineOffset: "2px" }}>
        Privacy Policy
      </span>
    </p>
  );
}
