/**
 * Driver Profile Settings — Edit profile, change phone, reset PIN, account security.
 *
 * Airbnb/Apple pattern: progressive disclosure, edit-in-place, confirm destructive.
 * DRIVER_TYPE enforced — nothing below 13px.
 */

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ArrowLeft, Camera, Phone, Lock, Mail, Shield,
  ChevronRight, Check, X, AlertTriangle, KeyRound,
} from "lucide-react";
import {
  GLASS_COLORS,
  MOTION,
  type GlassColorMode,
} from "../../config/project";
import { BRAND_COLORS } from "../../config/brand";
import { DRIVER_TYPE as DT } from "../../config/driver-type";
import { GlassPanel } from "../rider/glass-panel";
import { JetConfirm } from "../rider/jet-confirm";
import { useJetToast } from "../rider/jet-toast";

// ─── Sub-views ───────────────────────────────────────────────────────────────
type SubView = "main" | "edit-name" | "change-phone" | "reset-pin" | "change-email";

interface Props {
  colorMode: GlassColorMode;
  onBack: () => void;
}

export function DriverProfileSettings({ colorMode, onBack }: Props) {
  const c = GLASS_COLORS[colorMode];
  const d = colorMode === "dark";
  const { showToast, ToastContainer } = useJetToast(colorMode);

  const [subView, setSubView] = useState<SubView>("main");
  const [firstName, setFirstName] = useState("Adebayo");
  const [lastName, setLastName] = useState("Ojo");
  const [email, setEmail] = useState("adebayo.ojo@gmail.com");
  const [phone] = useState("+234 803 456 7890");

  // ── Edit name state ──
  const [editFirstName, setEditFirstName] = useState(firstName);
  const [editLastName, setEditLastName] = useState(lastName);

  // ── Change phone state ──
  const [newPhone, setNewPhone] = useState("");
  const [phoneOtp, setPhoneOtp] = useState("");
  const [phoneStep, setPhoneStep] = useState<"input" | "otp">("input");

  // ── Reset PIN state ──
  const [currentPin, setCurrentPin] = useState("");
  const [newPin, setNewPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [pinStep, setPinStep] = useState<"current" | "new" | "confirm">("current");

  // ── Change email state ──
  const [editEmail, setEditEmail] = useState(email);

  // ── Delete account ──
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const goBack = useCallback(() => {
    setSubView("main");
    // Reset sub-view states
    setPhoneStep("input");
    setNewPhone("");
    setPhoneOtp("");
    setPinStep("current");
    setCurrentPin("");
    setNewPin("");
    setConfirmPin("");
  }, []);

  // ─── Header ────────────────────────────────────────────────────────────────
  const renderHeader = (title: string, back: () => void) => (
    <div
      className="flex items-center gap-3 px-5 shrink-0"
      style={{ paddingTop: "calc(env(safe-area-inset-top, 12px) + 16px)", paddingBottom: "12px" }}
    >
      <motion.button
        className="w-9 h-9 rounded-xl flex items-center justify-center"
        style={{ background: c.surface.subtle }}
        onClick={back}
        whileTap={{ scale: 0.9 }}
      >
        <ArrowLeft className="w-4 h-4" style={{ color: c.icon.secondary }} />
      </motion.button>
      <span style={{ ...DT.heading, color: c.text.primary }}>{title}</span>
    </div>
  );

  // ─── EDIT NAME ──────────────────────────────────────────────────────────────
  if (subView === "edit-name") {
    return (
      <div className="h-full flex flex-col" style={{ background: c.bg }}>
        {renderHeader("Edit name", goBack)}
        <div className="flex-1 px-5 pt-4">
          <div className="space-y-3 mb-6">
            <div>
              <label className="block mb-1.5" style={{ ...DT.meta, color: c.text.muted }}>First name</label>
              <input
                className="w-full px-4 py-3 rounded-xl outline-none"
                value={editFirstName}
                onChange={(e) => setEditFirstName(e.target.value)}
                style={{ ...DT.secondary, color: c.text.primary, background: c.surface.subtle, border: `1px solid ${c.surface.hover}` }}
              />
            </div>
            <div>
              <label className="block mb-1.5" style={{ ...DT.meta, color: c.text.muted }}>Last name</label>
              <input
                className="w-full px-4 py-3 rounded-xl outline-none"
                value={editLastName}
                onChange={(e) => setEditLastName(e.target.value)}
                style={{ ...DT.secondary, color: c.text.primary, background: c.surface.subtle, border: `1px solid ${c.surface.hover}` }}
              />
            </div>
          </div>
          <motion.button
            className="w-full py-3.5 rounded-xl flex items-center justify-center gap-2"
            style={{ background: BRAND_COLORS.green }}
            onClick={() => {
              setFirstName(editFirstName);
              setLastName(editLastName);
              goBack();
              showToast({ message: "Name updated", variant: "success" });
            }}
            whileTap={{ scale: 0.97 }}
          >
            <Check className="w-4 h-4" style={{ color: "#fff" }} />
            <span style={{ ...DT.cta, color: "#fff" }}>Save changes</span>
          </motion.button>
        </div>
        <ToastContainer />
      </div>
    );
  }

  // ─── CHANGE PHONE ──────────────────────────────────────────────────────────
  if (subView === "change-phone") {
    return (
      <div className="h-full flex flex-col" style={{ background: c.bg }}>
        {renderHeader("Change phone number", goBack)}
        <div className="flex-1 px-5 pt-4">
          {phoneStep === "input" ? (
            <>
              <p className="mb-4" style={{ ...DT.meta, color: c.text.muted, lineHeight: "1.5" }}>
                Your current number is <span style={{ color: c.text.primary }}>{phone}</span>.
                Enter your new phone number and we'll send a verification code.
              </p>
              <input
                className="w-full px-4 py-3 rounded-xl outline-none mb-4"
                placeholder="+234 8XX XXX XXXX"
                value={newPhone}
                onChange={(e) => setNewPhone(e.target.value)}
                style={{ ...DT.secondary, color: c.text.primary, background: c.surface.subtle, border: `1px solid ${c.surface.hover}` }}
              />
              <motion.button
                className="w-full py-3.5 rounded-xl flex items-center justify-center gap-2"
                style={{
                  background: newPhone.length >= 10 ? BRAND_COLORS.green : c.surface.hover,
                }}
                onClick={() => newPhone.length >= 10 && setPhoneStep("otp")}
                whileTap={newPhone.length >= 10 ? { scale: 0.97 } : {}}
              >
                <span style={{ ...DT.cta, color: newPhone.length >= 10 ? "#fff" : c.text.ghost }}>
                  Send verification code
                </span>
              </motion.button>
            </>
          ) : (
            <>
              <p className="mb-4" style={{ ...DT.meta, color: c.text.muted, lineHeight: "1.5" }}>
                Enter the 6-digit code sent to <span style={{ color: c.text.primary }}>{newPhone}</span>
              </p>
              <input
                className="w-full px-4 py-3 rounded-xl outline-none mb-4 text-center tracking-[0.3em]"
                placeholder="• • • • • •"
                maxLength={6}
                value={phoneOtp}
                onChange={(e) => setPhoneOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                style={{ ...DT.heading, color: c.text.primary, background: c.surface.subtle, border: `1px solid ${c.surface.hover}` }}
              />
              <motion.button
                className="w-full py-3.5 rounded-xl flex items-center justify-center gap-2"
                style={{
                  background: phoneOtp.length === 6 ? BRAND_COLORS.green : c.surface.hover,
                }}
                onClick={() => {
                  if (phoneOtp.length === 6) {
                    goBack();
                    showToast({ message: "Phone number updated", variant: "success" });
                  }
                }}
                whileTap={phoneOtp.length === 6 ? { scale: 0.97 } : {}}
              >
                <span style={{ ...DT.cta, color: phoneOtp.length === 6 ? "#fff" : c.text.ghost }}>
                  Verify & update
                </span>
              </motion.button>
              <motion.button className="mt-3 mx-auto block" whileTap={{ scale: 0.95 }}>
                <span style={{ ...DT.meta, color: BRAND_COLORS.green }}>Resend code</span>
              </motion.button>
            </>
          )}
        </div>
        <ToastContainer />
      </div>
    );
  }

  // ─── RESET PIN ──────────────────────────────────────────────────────────────
  if (subView === "reset-pin") {
    const stepTitle = pinStep === "current" ? "Enter current PIN" : pinStep === "new" ? "Create new PIN" : "Confirm new PIN";
    const stepDesc = pinStep === "current"
      ? "Enter your current 4-digit PIN to continue"
      : pinStep === "new"
        ? "Choose a new 4-digit PIN for your account"
        : "Re-enter your new PIN to confirm";
    const currentValue = pinStep === "current" ? currentPin : pinStep === "new" ? newPin : confirmPin;
    const setter = pinStep === "current" ? setCurrentPin : pinStep === "new" ? setNewPin : setConfirmPin;

    return (
      <div className="h-full flex flex-col" style={{ background: c.bg }}>
        {renderHeader("Reset PIN", goBack)}
        <div className="flex-1 px-5 pt-4">
          <p className="mb-2" style={{ ...DT.label, color: c.text.primary }}>{stepTitle}</p>
          <p className="mb-6" style={{ ...DT.meta, color: c.text.muted }}>{stepDesc}</p>

          {/* PIN dots visualization */}
          <div className="flex items-center justify-center gap-4 mb-8">
            {[0, 1, 2, 3].map((i) => (
              <motion.div
                key={i}
                className="w-4 h-4 rounded-full"
                style={{
                  background: currentValue.length > i
                    ? BRAND_COLORS.green
                    : c.surface.hover,
                  border: `2px solid ${currentValue.length > i ? BRAND_COLORS.green : c.surface.hover}`,
                }}
                animate={{ scale: currentValue.length === i ? 1.2 : 1 }}
              />
            ))}
          </div>

          <input
            className="w-full px-4 py-3 rounded-xl outline-none text-center tracking-[0.5em] mb-4"
            type="password"
            maxLength={4}
            value={currentValue}
            onChange={(e) => setter(e.target.value.replace(/\D/g, "").slice(0, 4))}
            autoFocus
            style={{ ...DT.heading, color: c.text.primary, background: c.surface.subtle, border: `1px solid ${c.surface.hover}` }}
          />

          <motion.button
            className="w-full py-3.5 rounded-xl flex items-center justify-center gap-2"
            style={{
              background: currentValue.length === 4 ? BRAND_COLORS.green : c.surface.hover,
            }}
            onClick={() => {
              if (currentValue.length !== 4) return;
              if (pinStep === "current") setPinStep("new");
              else if (pinStep === "new") setPinStep("confirm");
              else if (pinStep === "confirm") {
                if (newPin !== confirmPin) {
                  showToast({ message: "PINs don't match. Try again.", variant: "warning" });
                  setConfirmPin("");
                  return;
                }
                goBack();
                showToast({ message: "PIN updated successfully", variant: "success" });
              }
            }}
            whileTap={currentValue.length === 4 ? { scale: 0.97 } : {}}
          >
            <span style={{ ...DT.cta, color: currentValue.length === 4 ? "#fff" : c.text.ghost }}>
              {pinStep === "confirm" ? "Confirm & save" : "Continue"}
            </span>
          </motion.button>

          {pinStep === "current" && (
            <motion.button className="mt-4 mx-auto block" whileTap={{ scale: 0.95 }}>
              <span style={{ ...DT.meta, color: BRAND_COLORS.green }}>Forgot PIN?</span>
            </motion.button>
          )}

          {/* Step indicator */}
          <div className="flex items-center justify-center gap-2 mt-6">
            {(["current", "new", "confirm"] as const).map((step) => (
              <div
                key={step}
                className="h-1 rounded-full"
                style={{
                  width: step === pinStep ? 20 : 8,
                  background: step === pinStep ? BRAND_COLORS.green : c.surface.hover,
                  transition: "all 0.3s ease",
                }}
              />
            ))}
          </div>
        </div>
        <ToastContainer />
      </div>
    );
  }

  // ─── CHANGE EMAIL ──────────────────────────────────────────────────────────
  if (subView === "change-email") {
    return (
      <div className="h-full flex flex-col" style={{ background: c.bg }}>
        {renderHeader("Change email", goBack)}
        <div className="flex-1 px-5 pt-4">
          <label className="block mb-1.5" style={{ ...DT.meta, color: c.text.muted }}>Email address</label>
          <input
            className="w-full px-4 py-3 rounded-xl outline-none mb-4"
            type="email"
            value={editEmail}
            onChange={(e) => setEditEmail(e.target.value)}
            style={{ ...DT.secondary, color: c.text.primary, background: c.surface.subtle, border: `1px solid ${c.surface.hover}` }}
          />
          <p className="mb-6" style={{ ...DT.meta, color: c.text.faint, lineHeight: "1.5" }}>
            We'll send a verification link to your new email address. Your current email will remain active until you verify.
          </p>
          <motion.button
            className="w-full py-3.5 rounded-xl flex items-center justify-center gap-2"
            style={{ background: BRAND_COLORS.green }}
            onClick={() => {
              setEmail(editEmail);
              goBack();
              showToast({ message: "Verification email sent", variant: "success" });
            }}
            whileTap={{ scale: 0.97 }}
          >
            <span style={{ ...DT.cta, color: "#fff" }}>Update email</span>
          </motion.button>
        </div>
        <ToastContainer />
      </div>
    );
  }

  // ─── MAIN VIEW ──────────────────────────────────────────────────────────────
  return (
    <div className="h-full flex flex-col" style={{ background: c.bg }}>
      {renderHeader("Profile & Security", onBack)}

      <div className="flex-1 overflow-y-auto px-5 pb-24 scrollbar-hide">
        {/* Avatar */}
        <motion.div
          className="flex flex-col items-center py-6"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="relative mb-3">
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center"
              style={{ background: c.green.tint, border: `2px solid ${BRAND_COLORS.green}30` }}
            >
              <span style={{ fontFamily: "var(--font-heading)", fontSize: "28px", fontWeight: 700, color: BRAND_COLORS.green }}>
                {firstName[0]}{lastName[0]}
              </span>
            </div>
            <motion.button
              className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full flex items-center justify-center"
              style={{ background: BRAND_COLORS.green, border: `3px solid ${c.bg}` }}
              whileTap={{ scale: 0.85 }}
            >
              <Camera className="w-3.5 h-3.5" style={{ color: "#fff" }} />
            </motion.button>
          </div>
          <span style={{ ...DT.heading, color: c.text.primary }}>{firstName} {lastName}</span>
          <span style={{ ...DT.meta, color: c.text.muted, marginTop: "2px" }}>{phone}</span>
        </motion.div>

        {/* Personal info */}
        <div className="mb-5">
          <span className="block mb-3" style={{ ...DT.label, color: c.text.faint, letterSpacing: "0.04em", textTransform: "uppercase" }}>
            Personal Information
          </span>
          <GlassPanel variant={d ? "dark" : "light"} blur={20} className="rounded-2xl overflow-hidden">
            {[
              { icon: null, label: "Name", value: `${firstName} ${lastName}`, key: "edit-name" as SubView },
              { icon: Phone, label: "Phone", value: phone, key: "change-phone" as SubView },
              { icon: Mail, label: "Email", value: email, key: "change-email" as SubView },
            ].map(({ icon: Icon, label, value, key }, i) => (
              <motion.button
                key={key}
                className="w-full px-4 py-3.5 flex items-center gap-3"
                style={{ borderBottom: i < 2 ? `1px solid ${c.surface.hover}` : "none" }}
                onClick={() => {
                  if (key === "edit-name") { setEditFirstName(firstName); setEditLastName(lastName); }
                  if (key === "change-email") { setEditEmail(email); }
                  setSubView(key);
                }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex-1 min-w-0 text-left">
                  <span style={{ ...DT.meta, color: c.text.faint }}>{label}</span>
                  <div style={{ ...DT.label, color: c.text.primary, marginTop: "1px" }}>{value}</div>
                </div>
                <ChevronRight className="w-4 h-4 shrink-0" style={{ color: c.icon.muted }} />
              </motion.button>
            ))}
          </GlassPanel>
        </div>

        {/* Security */}
        <div className="mb-5">
          <span className="block mb-3" style={{ ...DT.label, color: c.text.faint, letterSpacing: "0.04em", textTransform: "uppercase" }}>
            Security
          </span>
          <GlassPanel variant={d ? "dark" : "light"} blur={20} className="rounded-2xl overflow-hidden">
            <motion.button
              className="w-full px-4 py-3.5 flex items-center gap-3"
              style={{ borderBottom: `1px solid ${c.surface.hover}` }}
              onClick={() => setSubView("reset-pin")}
              whileTap={{ scale: 0.98 }}
            >
              <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{ background: c.surface.subtle }}>
                <KeyRound className="w-4 h-4" style={{ color: c.icon.secondary }} />
              </div>
              <div className="flex-1 min-w-0 text-left">
                <span style={{ ...DT.label, color: c.text.primary }}>Reset PIN</span>
                <div style={{ ...DT.meta, color: c.text.muted, marginTop: "1px" }}>Change your 4-digit login PIN</div>
              </div>
              <ChevronRight className="w-4 h-4 shrink-0" style={{ color: c.icon.muted }} />
            </motion.button>
            <motion.button
              className="w-full px-4 py-3.5 flex items-center gap-3"
              whileTap={{ scale: 0.98 }}
            >
              <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{ background: c.surface.subtle }}>
                <Shield className="w-4 h-4" style={{ color: c.icon.secondary }} />
              </div>
              <div className="flex-1 min-w-0 text-left">
                <span style={{ ...DT.label, color: c.text.primary }}>Two-factor auth</span>
                <div style={{ ...DT.meta, color: c.text.muted, marginTop: "1px" }}>Extra security for your account</div>
              </div>
              <span
                className="px-2 py-0.5 rounded-md"
                style={{ ...DT.meta, fontSize: "11px", fontWeight: 600, color: BRAND_COLORS.green, background: c.green.tint }}
              >
                On
              </span>
            </motion.button>
          </GlassPanel>
        </div>

        {/* Danger zone */}
        <div className="mb-5">
          <span className="block mb-3" style={{ ...DT.label, color: c.text.faint, letterSpacing: "0.04em", textTransform: "uppercase" }}>
            Account
          </span>
          <motion.button
            className="w-full py-3.5 rounded-xl flex items-center justify-center gap-2"
            style={{
              background: d ? "rgba(212,24,61,0.08)" : "rgba(212,24,61,0.05)",
              border: `1px solid ${d ? "rgba(212,24,61,0.15)" : "rgba(212,24,61,0.1)"}`,
            }}
            onClick={() => setShowDeleteConfirm(true)}
            whileTap={{ scale: 0.97 }}
          >
            <AlertTriangle className="w-4 h-4" style={{ color: BRAND_COLORS.error }} />
            <span style={{ ...DT.label, color: BRAND_COLORS.error }}>Delete account</span>
          </motion.button>
          <p className="mt-2 text-center" style={{ ...DT.meta, color: c.text.ghost, lineHeight: "1.5" }}>
            This will permanently delete your driver account and all trip data.
          </p>
        </div>
      </div>

      <JetConfirm
        open={showDeleteConfirm}
        colorMode={colorMode}
        title="Delete your account?"
        message="This action is permanent. All your trip history, earnings data, and documents will be permanently deleted. This cannot be undone."
        confirmLabel="Delete account"
        cancelLabel="Keep my account"
        destructive
        onConfirm={() => {
          setShowDeleteConfirm(false);
          showToast({ message: "Account deletion requested. You'll receive a confirmation email.", variant: "info" });
        }}
        onCancel={() => setShowDeleteConfirm(false)}
      />
      <ToastContainer />
    </div>
  );
}
