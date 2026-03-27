/**
 * Driver Onboarding — C spine "Veil" variant.
 *
 * Reuses shared onboarding components (splash, auth, OTP)
 * but replaces KYC with driver-specific vehicle verification step.
 *
 * Flow: splash → auth (phone) → OTP → vehicle info → done
 */

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowRight, ArrowLeft, FileText, Check, Zap } from "lucide-react";
import {
  GLASS_COLORS,
  MOTION,
  type GlassColorMode,
} from "../../config/project";
import { BRAND_COLORS } from "../../config/brand";
import { DRIVER_TYPE as DT } from "../../config/driver-type";
import { MapCanvas } from "../rider/map-canvas";
import { JetLogo } from "../brand/jet-logo";
import {
  CinematicSplash,
  PhoneInput,
  OtpVerification,
  SocialButtons,
  TermsText,
} from "../rider/onboarding-shared";

// ---------------------------------------------------------------------------
// Flow state
// ---------------------------------------------------------------------------
type DriverOnboardingStep = "splash" | "auth" | "otp" | "vehicle" | "done";

function useDriverOnboardingFlow() {
  const [step, setStep] = useState<DriverOnboardingStep>("splash");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [vehicleMake, setVehicleMake] = useState("");
  const [vehicleModel, setVehicleModel] = useState("");
  const [vehiclePlate, setVehiclePlate] = useState("");
  const [vehicleYear, setVehicleYear] = useState("");
  const [isEV, setIsEV] = useState(false);

  useEffect(() => {
    if (step === "splash") {
      const timer = setTimeout(() => setStep("auth"), 2500);
      return () => clearTimeout(timer);
    }
  }, [step]);

  const goToOtp = useCallback(() => setStep("otp"), []);
  const goToVehicle = useCallback(() => setStep("vehicle"), []);
  const goToDone = useCallback(() => setStep("done"), []);
  const goBack = useCallback(() => {
    if (step === "otp") setStep("auth");
    else if (step === "vehicle") setStep("otp");
  }, [step]);

  return {
    step, phone, setPhone, otp, setOtp,
    vehicleMake, setVehicleMake,
    vehicleModel, setVehicleModel,
    vehiclePlate, setVehiclePlate,
    vehicleYear, setVehicleYear,
    isEV, setIsEV,
    goToOtp, goToVehicle, goToDone, goBack,
  };
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------
interface Props {
  colorMode: GlassColorMode;
  onComplete: () => void;
}

export function DriverOnboardingC({ colorMode, onComplete }: Props) {
  const c = GLASS_COLORS[colorMode];
  const d = colorMode === "dark";
  const flow = useDriverOnboardingFlow();

  const handleComplete = useCallback(() => {
    flow.goToDone();
    setTimeout(onComplete, 1800);
  }, [flow, onComplete]);

  const isPhoneValid = flow.phone.replace(/\D/g, "").length >= 10;
  const isOtpFull = flow.otp.every((d) => d.length === 1);
  const isVehicleValid = flow.vehicleMake.trim() && flow.vehicleModel.trim() && flow.vehiclePlate.trim() && flow.vehicleYear.trim();

  return (
    <div className="relative w-full h-full overflow-hidden" style={{ background: c.bg }}>
      {/* Map background */}
      <MapCanvas colorMode={colorMode} variant="dark" />

      {/* Glass veil */}
      <div
        className="absolute inset-0 z-[1]"
        style={{
          background: d
            ? "rgba(11,11,13,0.75)"
            : "rgba(250,250,250,0.7)",
          backdropFilter: "blur(40px)",
          WebkitBackdropFilter: "blur(40px)",
        }}
      />

      {/* Content */}
      <div className="absolute inset-0 z-[2] flex flex-col">
        <AnimatePresence mode="wait">
          {/* ─── SPLASH ─── */}
          {flow.step === "splash" && (
            <CinematicSplash key="splash" colorMode={colorMode} />
          )}

          {/* ─── AUTH ─── */}
          {flow.step === "auth" && (
            <motion.div
              key="auth"
              className="flex-1 flex flex-col justify-center px-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={MOTION.emphasis}
            >
              <div className="mb-8">
                <JetLogo variant="icon" size={32} mode={d ? "dark" : "light"} />
              </div>
              <div className="mb-2">
                <span style={{ ...DT.heading, fontSize: "24px", color: c.text.primary }}>
                  Start driving with JET
                </span>
              </div>
              <p className="mb-8" style={{ ...DT.meta, color: c.text.muted, lineHeight: "1.5" }}>
                Enter your phone number to get started. We'll send you a verification code.
              </p>

              <PhoneInput
                phone={flow.phone}
                setPhone={flow.setPhone}
                onContinue={flow.goToOtp}
                colorMode={colorMode}
              />

              <motion.button
                className="w-full mt-4 py-3.5 rounded-xl flex items-center justify-center gap-2"
                style={{
                  background: isPhoneValid ? BRAND_COLORS.green : c.surface.hover,
                  boxShadow: isPhoneValid ? `0 4px 16px ${BRAND_COLORS.green}25` : "none",
                }}
                onClick={() => isPhoneValid && flow.goToOtp()}
                whileTap={isPhoneValid ? { scale: 0.97 } : {}}
              >
                <span style={{ ...DT.cta, color: isPhoneValid ? "#fff" : c.text.ghost }}>
                  Continue
                </span>
                <ArrowRight className="w-4 h-4" style={{ color: isPhoneValid ? "#fff" : c.text.ghost }} />
              </motion.button>

              <div className="mt-6">
                <SocialButtons colorMode={colorMode} onSocialLogin={() => flow.goToOtp()} />
              </div>

              <div className="mt-6">
                <TermsText colorMode={colorMode} />
              </div>
            </motion.div>
          )}

          {/* ─── OTP ─── */}
          {flow.step === "otp" && (
            <OtpVerification
              key="otp"
              colorMode={colorMode}
              otp={flow.otp}
              setOtp={flow.setOtp}
              onVerify={flow.goToVehicle}
              onBack={flow.goBack}
              phone={flow.phone}
            />
          )}

          {/* ─── VEHICLE INFO ─── */}
          {flow.step === "vehicle" && (
            <motion.div
              key="vehicle"
              className="flex-1 flex flex-col px-8 overflow-y-auto scrollbar-hide"
              style={{ paddingTop: "calc(env(safe-area-inset-top, 12px) + 24px)" }}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={MOTION.emphasis}
            >
              <motion.button
                className="mb-6 w-9 h-9 rounded-xl flex items-center justify-center"
                style={{ background: c.surface.subtle }}
                onClick={flow.goBack}
                whileTap={{ scale: 0.9 }}
              >
                <ArrowLeft className="w-4 h-4" style={{ color: c.icon.secondary }} />
              </motion.button>

              <div className="mb-2">
                <span style={{ ...DT.heading, fontSize: "24px", color: c.text.primary }}>
                  Vehicle details
                </span>
              </div>
              <p className="mb-6" style={{ ...DT.meta, color: c.text.muted, lineHeight: "1.5" }}>
                Tell us about your vehicle. You can update this later in Settings.
              </p>

              <div className="space-y-3 mb-6">
                {[
                  { label: "Make", value: flow.vehicleMake, onChange: flow.setVehicleMake, placeholder: "e.g. Toyota" },
                  { label: "Model", value: flow.vehicleModel, onChange: flow.setVehicleModel, placeholder: "e.g. Camry" },
                  { label: "Year", value: flow.vehicleYear, onChange: flow.setVehicleYear, placeholder: "e.g. 2022" },
                  { label: "Plate number", value: flow.vehiclePlate, onChange: flow.setVehiclePlate, placeholder: "e.g. LAG 123 AB" },
                ].map(({ label, value, onChange, placeholder }) => (
                  <div key={label}>
                    <label className="block mb-1.5" style={{ ...DT.meta, color: c.text.muted }}>
                      {label}
                    </label>
                    <input
                      className="w-full px-4 py-3 rounded-xl outline-none"
                      placeholder={placeholder}
                      value={value}
                      onChange={(e) => onChange(e.target.value)}
                      style={{
                        ...DT.secondary,
                        color: c.text.primary,
                        background: c.surface.subtle,
                        border: `1px solid ${c.surface.hover}`,
                      }}
                    />
                  </div>
                ))}

                {/* EV toggle */}
                <button
                  className="w-full flex items-center justify-between px-4 py-3.5 rounded-xl"
                  style={{
                    background: flow.isEV ? c.green.tint : c.surface.subtle,
                    border: `1px solid ${flow.isEV ? `${BRAND_COLORS.green}20` : c.surface.hover}`,
                  }}
                  onClick={() => flow.setIsEV(!flow.isEV)}
                >
                  <div className="flex items-center gap-2.5">
                    <Zap className="w-4 h-4" style={{ color: flow.isEV ? BRAND_COLORS.green : c.icon.muted }} />
                    <span style={{ ...DT.label, color: flow.isEV ? BRAND_COLORS.green : c.text.primary }}>
                      Electric vehicle (EV)
                    </span>
                  </div>
                  <div
                    className="relative w-11 h-6 rounded-full transition-colors"
                    style={{
                      background: flow.isEV
                        ? BRAND_COLORS.green
                        : d ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.1)",
                    }}
                  >
                    <motion.div
                      className="absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm"
                      animate={{ left: flow.isEV ? 22 : 2 }}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                  </div>
                </button>
              </div>

              {/* Documents note */}
              <div
                className="flex items-start gap-3 px-4 py-3 rounded-xl mb-6"
                style={{ background: c.surface.subtle }}
              >
                <FileText className="w-4 h-4 mt-0.5 shrink-0" style={{ color: c.icon.muted }} />
                <p style={{ ...DT.meta, color: c.text.muted, lineHeight: "1.5" }}>
                  After registration, you'll need to upload documents and schedule a vehicle inspection before you can start driving.
                </p>
              </div>

              <motion.button
                className="w-full py-3.5 rounded-xl flex items-center justify-center gap-2 mb-8"
                style={{
                  background: isVehicleValid ? BRAND_COLORS.green : c.surface.hover,
                  boxShadow: isVehicleValid ? `0 4px 16px ${BRAND_COLORS.green}25` : "none",
                }}
                onClick={() => isVehicleValid && handleComplete()}
                whileTap={isVehicleValid ? { scale: 0.97 } : {}}
              >
                <span style={{ ...DT.cta, color: isVehicleValid ? "#fff" : c.text.ghost }}>
                  Submit registration
                </span>
              </motion.button>
            </motion.div>
          )}

          {/* ─── DONE ─── */}
          {flow.step === "done" && (
            <motion.div
              key="done"
              className="flex-1 flex flex-col items-center justify-center px-8"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ ...MOTION.emphasis, duration: 0.5 }}
            >
              <motion.div
                className="w-20 h-20 rounded-full flex items-center justify-center mb-6"
                style={{ background: BRAND_COLORS.green }}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.15 }}
              >
                <Check className="w-10 h-10" style={{ color: "#fff" }} />
              </motion.div>
              <span
                style={{
                  ...DT.heading,
                  fontSize: "24px",
                  color: c.text.primary,
                  textAlign: "center",
                  marginBottom: "8px",
                }}
              >
                Registration submitted
              </span>
              <p style={{ ...DT.meta, color: c.text.muted, textAlign: "center", maxWidth: "260px", lineHeight: "1.5" }}>
                Next up: upload your documents and schedule a vehicle inspection to get activated.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}