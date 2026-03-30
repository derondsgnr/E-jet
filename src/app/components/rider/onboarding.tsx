 /**
 * Onboarding Variation C — "Veil"
 *
 * Full-screen glass with map bleeding through the blur.
 * Auth content centered vertically. Apple lock screen energy.
 * The map is felt, not seen — atmosphere without distraction.
 */

import { motion, AnimatePresence } from "motion/react";
import { MOTION, GLASS_COLORS, GLASS_TYPE, type GlassColorMode } from "../../config/project";
import { MapCanvas } from "./map-canvas";
import { JetLogo } from "../brand/jet-logo";
import {
  useOnboardingFlow,
  CinematicSplash,
  SocialButtons,
  OrDivider,
  PhoneInput,
  OtpVerification,
  KycForm,
  DoneCelebration,
  TermsText,
} from "./onboarding-shared";

interface OnboardingCProps {
  colorMode: GlassColorMode;
  onComplete?: () => void;
}

export function RiderOnboardingFlow({ colorMode, onComplete }: OnboardingCProps) {
  const flow = useOnboardingFlow();
  const c = GLASS_COLORS[colorMode];
  const isLight = colorMode === "light";

  const handleDone = () => {
    onComplete?.();
  };

  const handleSocial = (_provider: "google" | "apple") => {
    flow.setStep("kyc");
  };

  return (
    <div className="relative h-full w-full overflow-hidden" style={{ background: c.bg }}>
      {/* Living map — bleeds through the veil */}
      <MapCanvas colorMode={colorMode} variant={isLight ? "dark" : "dark"} />

      {/* Cinematic splash */}
      <AnimatePresence>
        {flow.step === "splash" && <CinematicSplash colorMode={colorMode} />}
      </AnimatePresence>

      {/* Full-screen glass veil */}
      <AnimatePresence mode="wait">
        {flow.step !== "splash" && flow.step !== "done" && (
          <motion.div
            key="veil"
            className="absolute inset-0 z-10 flex flex-col items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            transition={MOTION.emphasis}
          >
            {/* The veil — frosted glass over the entire screen */}
            <div
              className="absolute inset-0"
              style={{
                background: isLight
                  ? "rgba(250,250,250,0.72)"
                  : "rgba(11,11,13,0.75)",
                backdropFilter: "blur(60px)",
                WebkitBackdropFilter: "blur(60px)",
              }}
            />

            {/* Subtle green ambient glow through the veil */}
            <div
              className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] rounded-full"
              style={{
                background: "radial-gradient(ellipse, rgba(29,185,84,0.08) 0%, transparent 70%)",
              }}
            />

            {/* Content — centered vertically */}
            <div className="relative z-10 w-full max-w-[360px] px-6">
              <AnimatePresence mode="wait">
                {flow.step === "auth" && (
                  <motion.div
                    key="auth"
                    className="flex flex-col gap-6"
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={MOTION.emphasis}
                  >
                    {/* Logo + heading */}
                    <div className="flex flex-col items-center gap-5 mb-2">
                      <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ ...MOTION.emphasis, delay: 0.1 }}
                      >
                        <JetLogo
                          variant="full"
                          mode={isLight ? "dark" : "light"}
                          height={36}
                        />
                      </motion.div>
                      <motion.p
                        style={{ ...GLASS_TYPE.body, color: c.text.tertiary, textAlign: "center" }}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ ...MOTION.emphasis, delay: 0.2 }}
                      >
                        Sign in or create your account
                      </motion.p>
                    </div>

                    {/* Auth options */}
                    <motion.div
                      className="flex flex-col gap-5"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ ...MOTION.emphasis, delay: 0.15 }}
                    >
                      <SocialButtons colorMode={colorMode} onSocialLogin={handleSocial} />
                      <OrDivider colorMode={colorMode} />
                      <PhoneInput
                        colorMode={colorMode}
                        phone={flow.phone}
                        setPhone={flow.setPhone}
                        onContinue={flow.goToOtp}
                      />
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.4 }}
                    >
                      <TermsText colorMode={colorMode} />
                    </motion.div>
                  </motion.div>
                )}

                {flow.step === "otp" && (
                  <motion.div
                    key="otp"
                    className="flex flex-col gap-5"
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={MOTION.emphasis}
                  >
                    <OtpVerification
                      colorMode={colorMode}
                      otp={flow.otp}
                      setOtp={flow.setOtp}
                      onVerify={flow.goToKyc}
                      onBack={flow.goBack}
                      phone={flow.phone}
                    />
                  </motion.div>
                )}

                {flow.step === "kyc" && (
                  <motion.div
                    key="kyc"
                    className="flex flex-col gap-5"
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={MOTION.emphasis}
                  >
                    <KycForm
                      colorMode={colorMode}
                      firstName={flow.firstName}
                      setFirstName={flow.setFirstName}
                      lastName={flow.lastName}
                      setLastName={flow.setLastName}
                      onComplete={flow.goToDone}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Done celebration */}
      <AnimatePresence>
        {flow.step === "done" && (
          <motion.div
            className="absolute inset-0 z-20 flex items-center justify-center px-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={MOTION.emphasis}
          >
            <div
              className="absolute inset-0"
              style={{
                background: isLight ? "rgba(250,250,250,0.6)" : "rgba(11,11,13,0.6)",
                backdropFilter: "blur(40px)",
                WebkitBackdropFilter: "blur(40px)",
              }}
            />
            <div className="relative z-10">
              <DoneCelebration
                colorMode={colorMode}
                firstName={flow.firstName || "there"}
                onContinue={handleDone}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Reset button (demo) */}
      <ResetButton flow={flow} colorMode={colorMode} />
    </div>
  );
}

function ResetButton({ flow, colorMode }: { flow: ReturnType<typeof useOnboardingFlow>; colorMode: GlassColorMode }) {
  const c = GLASS_COLORS[colorMode];
  if (flow.step === "splash") return null;

  return (
    <motion.button
      className="absolute top-0 right-4 z-30 px-3 py-1.5 rounded-full"
      style={{
        marginTop: "calc(env(safe-area-inset-top, 12px) + 12px)",
        background: c.surface.raised,
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        border: `1px solid ${c.surface.hover}`,
        ...GLASS_TYPE.caption,
        color: c.text.muted,
      }}
      onClick={flow.resetToSplash}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1 }}
    >
      Replay
    </motion.button>
  );
}
