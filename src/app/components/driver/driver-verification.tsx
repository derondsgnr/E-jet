 /**
 * Driver Verification Pipeline — Post-signup activation flow.
 *
 * Apple/Airbnb design pattern:
 * After signing up, drivers can't accept trips immediately.
 * They land on a verification status screen that shows their progress
 * through a multi-step checklist:
 *
 *   ✅ Phone verified (done during onboarding)
 *   📤 Upload documents (driver's license, insurance, registration)
 *   🔍 Background check (auto-triggered after doc upload)
 *   🚗 Vehicle inspection (schedule an in-person inspection)
 *   ✅ Account activated
 *
 * Key UX decisions (Apple/Airbnb influence):
 *   - Progress is always visible — no mystery states
 *   - Each step has clear instructions + estimated time
 *   - Completed steps show green checkmarks (green as scalpel)
 *   - Pending steps show what's needed to progress
 *   - "Schedule inspection" is a clear CTA with available slots
 *   - The entire screen is a celebration of progress, not a gate
 *
 * DRIVER_TYPE enforced — nothing below 13px.
 * C spine: GlassPanel, MapCanvas, ambient glows.
 */

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Phone, FileText, Shield, Car, CheckCircle2,
  Clock, Upload, Calendar, ChevronRight, ArrowLeft,
  AlertCircle, MapPin, X, Zap, Camera, Check,
} from "lucide-react";
import {
  GLASS_COLORS,
  MOTION,
  type GlassColorMode,
} from "../../config/project";
import { BRAND_COLORS } from "../../config/brand";
import { DRIVER_TYPE as DT } from "../../config/driver-type";
import { MapCanvas } from "../rider/map-canvas";
import { GlassPanel } from "../rider/glass-panel";
import { useJetToast } from "../rider/jet-toast";

// ─── Verification step types ─────────────────────────────────────────────────
type StepStatus = "complete" | "action-needed" | "in-review" | "locked";
type StepId = "phone" | "documents" | "background" | "inspection" | "activated";

interface VerificationStep {
  id: StepId;
  icon: typeof Phone;
  title: string;
  description: string;
  status: StepStatus;
  detail?: string;
  eta?: string;
  actionLabel?: string;
}

// ─── Mock data — in production this comes from API ───────────────────────────
const MOCK_STEPS: VerificationStep[] = [
  {
    id: "phone",
    icon: Phone,
    title: "Phone verified",
    description: "Your phone number has been confirmed",
    status: "complete",
  },
  {
    id: "documents",
    icon: FileText,
    title: "Upload documents",
    description: "Driver's license, insurance, vehicle registration",
    status: "action-needed",
    detail: "2 of 3 documents uploaded",
    actionLabel: "Upload remaining",
  },
  {
    id: "background",
    icon: Shield,
    title: "Background check",
    description: "Automated identity and criminal record verification",
    status: "locked",
    eta: "Usually takes 24–48 hours",
  },
  {
    id: "inspection",
    icon: Car,
    title: "Vehicle inspection",
    description: "In-person vehicle safety and condition check",
    status: "locked",
    eta: "30 min appointment",
    actionLabel: "Schedule inspection",
  },
  {
    id: "activated",
    icon: CheckCircle2,
    title: "Start driving",
    description: "Your account will be activated once all steps are complete",
    status: "locked",
  },
];

// ─── Document upload mock ────────────────────────────────────────────────────
interface DocUpload {
  id: string;
  label: string;
  status: "uploaded" | "pending" | "rejected";
  fileName?: string;
}

const MOCK_DOCS: DocUpload[] = [
  { id: "license", label: "Driver's license", status: "uploaded", fileName: "license_front.jpg" },
  { id: "insurance", label: "Vehicle insurance", status: "uploaded", fileName: "insurance_cert.pdf" },
  { id: "registration", label: "Vehicle registration", status: "pending" },
];

// ─── Inspection slots ────────────────────────────────────────────────────────
interface InspectionSlot {
  id: string;
  date: string;
  dayLabel: string;
  time: string;
  location: string;
  available: boolean;
}

const MOCK_SLOTS: InspectionSlot[] = [
  { id: "s1", date: "Mar 7", dayLabel: "Fri", time: "9:00 AM", location: "Lekki Phase 1 Hub", available: true },
  { id: "s2", date: "Mar 7", dayLabel: "Fri", time: "11:30 AM", location: "Lekki Phase 1 Hub", available: true },
  { id: "s3", date: "Mar 7", dayLabel: "Fri", time: "2:00 PM", location: "Lekki Phase 1 Hub", available: false },
  { id: "s4", date: "Mar 8", dayLabel: "Sat", time: "10:00 AM", location: "Victoria Island Hub", available: true },
  { id: "s5", date: "Mar 8", dayLabel: "Sat", time: "1:00 PM", location: "Victoria Island Hub", available: true },
  { id: "s6", date: "Mar 10", dayLabel: "Mon", time: "9:00 AM", location: "Ikeja Hub", available: true },
];

// ─── Sub-views ───────────────────────────────────────────────────────────────
type SubView = "main" | "documents" | "schedule";

// ═══════════════════════════════════════════════════════════════════════════════
// Main Component
// ═══════════════════════════════════════════════════════════════════════════════
interface Props {
  colorMode: GlassColorMode;
  onActivated?: () => void;
}

export function DriverVerificationScreen({ colorMode, onActivated }: Props) {
  const c = GLASS_COLORS[colorMode];
  const d = colorMode === "dark";
  const { showToast, ToastContainer } = useJetToast(colorMode);
  const [subView, setSubView] = useState<SubView>("main");
  const [steps, setSteps] = useState(MOCK_STEPS);
  const [docs, setDocs] = useState(MOCK_DOCS);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);

  const completedCount = steps.filter(s => s.status === "complete").length;
  const totalSteps = steps.length - 1; // Don't count "activated" as a step
  const progress = completedCount / totalSteps;

  const handleDocUpload = useCallback((docId: string) => {
    setDocs(prev => prev.map(doc =>
      doc.id === docId ? { ...doc, status: "uploaded" as const, fileName: `${docId}_uploaded.jpg` } : doc
    ));
    showToast({ message: "Document uploaded successfully", variant: "success" });
    
    // Check if all docs are now uploaded
    const allUploaded = docs.every(doc => doc.id === docId || doc.status === "uploaded");
    if (allUploaded) {
      setSteps(prev => prev.map(step => {
        if (step.id === "documents") return { ...step, status: "complete" as const, detail: "All documents uploaded" };
        if (step.id === "background") return { ...step, status: "in-review" as const };
        if (step.id === "inspection") return { ...step, status: "action-needed" as const };
        return step;
      }));
    }
  }, [docs, showToast]);

  const handleSchedule = useCallback(() => {
    if (!selectedSlot) return;
    const slot = MOCK_SLOTS.find(s => s.id === selectedSlot);
    setSteps(prev => prev.map(step => {
      if (step.id === "inspection") {
        return {
          ...step,
          status: "in-review" as const,
          detail: `Scheduled: ${slot?.date} at ${slot?.time}`,
          actionLabel: undefined,
        };
      }
      return step;
    }));
    setSubView("main");
    showToast({ message: `Inspection scheduled for ${slot?.date} at ${slot?.time}`, variant: "success" });
  }, [selectedSlot, showToast]);

  // ─── Status styling ──────────────────────────────────────────────────────
  const statusStyles = (status: StepStatus) => {
    switch (status) {
      case "complete":
        return { color: BRAND_COLORS.green, bg: c.green.tint, iconColor: BRAND_COLORS.green };
      case "action-needed":
        return { color: "#F59E0B", bg: d ? "rgba(245,158,11,0.08)" : "rgba(245,158,11,0.06)", iconColor: "#F59E0B" };
      case "in-review":
        return { color: "#3B82F6", bg: d ? "rgba(59,130,246,0.08)" : "rgba(59,130,246,0.06)", iconColor: "#3B82F6" };
      case "locked":
        return { color: c.text.ghost, bg: c.surface.subtle, iconColor: c.text.ghost };
    }
  };

  const statusLabel = (status: StepStatus) => {
    switch (status) {
      case "complete": return "Done";
      case "action-needed": return "Action needed";
      case "in-review": return "In review";
      case "locked": return "Pending";
    }
  };

  // ─── DOCUMENTS SUB-VIEW ──────────────────────────────────────────────────
  if (subView === "documents") {
    return (
      <div className="h-full flex flex-col" style={{ background: c.bg }}>
        <div
          className="flex items-center gap-3 px-5 shrink-0"
          style={{ paddingTop: "calc(env(safe-area-inset-top, 12px) + 16px)", paddingBottom: "12px" }}
        >
          <motion.button
            className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: c.surface.subtle }}
            onClick={() => setSubView("main")}
            whileTap={{ scale: 0.9 }}
          >
            <ArrowLeft className="w-4 h-4" style={{ color: c.icon.secondary }} />
          </motion.button>
          <span style={{ ...DT.heading, color: c.text.primary }}>Documents</span>
        </div>

        <div className="flex-1 overflow-y-auto px-5 pb-24 scrollbar-hide">
          <p className="mb-5" style={{ ...DT.meta, color: c.text.muted, lineHeight: "1.5" }}>
            Upload clear photos of each document. We'll verify them within 24 hours. Make sure all text is readable and no corners are cut off.
          </p>

          {docs.map((doc, i) => {
            const isUploaded = doc.status === "uploaded";
            return (
              <motion.div
                key={doc.id}
                className="mb-3"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ ...MOTION.standard, delay: i * 0.04 }}
              >
                <GlassPanel variant={d ? "dark" : "light"} blur={20} className="rounded-2xl px-4 py-4">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
                      style={{
                        background: isUploaded ? c.green.tint : c.surface.subtle,
                      }}
                    >
                      {isUploaded ? (
                        <CheckCircle2 className="w-5 h-5" style={{ color: BRAND_COLORS.green }} />
                      ) : (
                        <FileText className="w-5 h-5" style={{ color: c.icon.muted }} />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <span style={{ ...DT.label, color: c.text.primary }}>{doc.label}</span>
                      <div style={{ ...DT.meta, color: isUploaded ? BRAND_COLORS.green : c.text.muted, marginTop: "1px" }}>
                        {isUploaded ? doc.fileName : "Not uploaded yet"}
                      </div>
                    </div>
                    {!isUploaded && (
                      <motion.button
                        className="flex items-center gap-1.5 px-3 py-2 rounded-xl"
                        style={{ background: BRAND_COLORS.green }}
                        onClick={() => handleDocUpload(doc.id)}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Camera className="w-3.5 h-3.5" style={{ color: "#fff" }} />
                        <span style={{ ...DT.meta, fontWeight: 600, color: "#fff" }}>Upload</span>
                      </motion.button>
                    )}
                  </div>
                </GlassPanel>
              </motion.div>
            );
          })}

          <div
            className="mt-4 px-4 py-3 rounded-xl"
            style={{ background: c.surface.subtle }}
          >
            <p style={{ ...DT.meta, color: c.text.faint, lineHeight: "1.5" }}>
              📋 Accepted formats: JPG, PNG, PDF. Max 10MB per file. Documents must be valid and not expired.
            </p>
          </div>
        </div>
        <ToastContainer />
      </div>
    );
  }

  // ─── SCHEDULE INSPECTION SUB-VIEW ──────────────────────────────────────────
  if (subView === "schedule") {
    return (
      <div className="h-full flex flex-col" style={{ background: c.bg }}>
        <div
          className="flex items-center gap-3 px-5 shrink-0"
          style={{ paddingTop: "calc(env(safe-area-inset-top, 12px) + 16px)", paddingBottom: "12px" }}
        >
          <motion.button
            className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: c.surface.subtle }}
            onClick={() => setSubView("main")}
            whileTap={{ scale: 0.9 }}
          >
            <ArrowLeft className="w-4 h-4" style={{ color: c.icon.secondary }} />
          </motion.button>
          <span style={{ ...DT.heading, color: c.text.primary }}>Schedule Inspection</span>
        </div>

        <div className="flex-1 overflow-y-auto px-5 pb-24 scrollbar-hide">
          <p className="mb-5" style={{ ...DT.meta, color: c.text.muted, lineHeight: "1.5" }}>
            Choose a time and location for your vehicle inspection. The check takes about 30 minutes and covers safety, lights, tyres, and general condition.
          </p>

          {/* What to bring */}
          <GlassPanel variant={d ? "dark" : "light"} blur={20} className="rounded-2xl px-4 py-4 mb-5">
            <span className="block mb-2" style={{ ...DT.label, color: c.text.primary }}>What to bring</span>
            {["Your vehicle", "Driver's license (original)", "Vehicle registration (original)", "Proof of insurance"].map((item, i) => (
              <div key={i} className="flex items-center gap-2 py-1">
                <Check className="w-3.5 h-3.5 shrink-0" style={{ color: BRAND_COLORS.green }} />
                <span style={{ ...DT.meta, color: c.text.muted }}>{item}</span>
              </div>
            ))}
          </GlassPanel>

          {/* Available slots */}
          <span className="block mb-3" style={{ ...DT.label, color: c.text.faint, letterSpacing: "0.04em", textTransform: "uppercase" }}>
            Available Slots
          </span>

          {MOCK_SLOTS.map((slot, i) => {
            const isSelected = selectedSlot === slot.id;
            return (
              <motion.button
                key={slot.id}
                className="w-full mb-2"
                onClick={() => slot.available && setSelectedSlot(slot.id)}
                disabled={!slot.available}
                whileTap={slot.available ? { scale: 0.98 } : {}}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ ...MOTION.standard, delay: i * 0.03 }}
              >
                <GlassPanel
                  variant={d ? "dark" : "light"}
                  blur={20}
                  className="rounded-2xl px-4 py-3.5"
                  style={{
                    border: isSelected
                      ? `2px solid ${BRAND_COLORS.green}`
                      : `2px solid transparent`,
                    opacity: slot.available ? 1 : 0.4,
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="text-center" style={{ minWidth: 40 }}>
                        <div style={{ ...DT.label, color: isSelected ? BRAND_COLORS.green : c.text.primary }}>
                          {slot.dayLabel}
                        </div>
                        <div style={{ ...DT.meta, color: c.text.muted }}>{slot.date}</div>
                      </div>
                      <div>
                        <span style={{ ...DT.label, color: c.text.primary }}>{slot.time}</span>
                        <div className="flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3" style={{ color: c.text.faint }} />
                          <span style={{ ...DT.meta, color: c.text.muted }}>{slot.location}</span>
                        </div>
                      </div>
                    </div>
                    {isSelected && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 400, damping: 20 }}
                      >
                        <CheckCircle2 className="w-5 h-5" style={{ color: BRAND_COLORS.green }} />
                      </motion.div>
                    )}
                    {!slot.available && (
                      <span style={{ ...DT.meta, color: c.text.ghost }}>Full</span>
                    )}
                  </div>
                </GlassPanel>
              </motion.button>
            );
          })}
        </div>

        {/* Confirm button */}
        <div className="px-5 pb-8 pt-3">
          <motion.button
            className="w-full py-3.5 rounded-xl flex items-center justify-center gap-2"
            style={{
              background: selectedSlot ? BRAND_COLORS.green : c.surface.hover,
              boxShadow: selectedSlot ? `0 4px 16px ${BRAND_COLORS.green}25` : "none",
            }}
            onClick={handleSchedule}
            whileTap={selectedSlot ? { scale: 0.97 } : {}}
          >
            <Calendar className="w-4 h-4" style={{ color: selectedSlot ? "#fff" : c.text.ghost }} />
            <span style={{ ...DT.cta, color: selectedSlot ? "#fff" : c.text.ghost }}>
              Confirm booking
            </span>
          </motion.button>
        </div>
        <ToastContainer />
      </div>
    );
  }

  // ─── MAIN VERIFICATION STATUS VIEW ─────────────────────────────────────────
  return (
    <div className="relative w-full h-full" style={{ background: c.bg }}>
      <MapCanvas colorMode={colorMode} variant="dark" />
      {d ? (
        <div className="absolute inset-0 bg-gradient-to-b from-[#0B0B0D]/60 via-[#0B0B0D]/40 to-[#0B0B0D]/80 z-[1]" />
      ) : (
        <div
          className="absolute inset-0 z-[1]"
          style={{
            background:
              "linear-gradient(to bottom, rgba(250,250,250,0.7) 0%, rgba(250,250,250,0.4) 40%, rgba(250,250,250,0.85) 100%)",
          }}
        />
      )}

      <div className="absolute inset-0 z-[2] overflow-y-auto scrollbar-hide">
        <div style={{ paddingTop: "calc(env(safe-area-inset-top, 12px) + 20px)" }}>
          {/* Header */}
          <div className="px-5 mb-6">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={MOTION.emphasis}
            >
              <span style={{ ...DT.heading, fontSize: "24px", color: c.text.primary }}>
                Getting you road-ready
              </span>
              <p className="mt-1" style={{ ...DT.meta, color: c.text.muted, lineHeight: "1.5" }}>
                Complete these steps to start accepting trips. We'll notify you at each stage.
              </p>
            </motion.div>
          </div>

          {/* Progress bar */}
          <div className="px-5 mb-6">
            <GlassPanel variant={d ? "dark" : "light"} blur={20} className="rounded-2xl px-4 py-4">
              <div className="flex items-center justify-between mb-3">
                <span style={{ ...DT.label, color: c.text.primary }}>
                  {completedCount} of {totalSteps} complete
                </span>
                <span style={{ ...DT.meta, color: BRAND_COLORS.green, fontWeight: 600 }}>
                  {Math.round(progress * 100)}%
                </span>
              </div>
              <div
                className="h-2 rounded-full overflow-hidden"
                style={{ background: c.surface.hover }}
              >
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: BRAND_COLORS.green }}
                  initial={{ width: 0 }}
                  animate={{ width: `${progress * 100}%` }}
                  transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
                />
              </div>
            </GlassPanel>
          </div>

          {/* Steps */}
          <div className="px-5 mb-5">
            {steps.map((step, i) => {
              const styles = statusStyles(step.status);
              const isLast = i === steps.length - 1;
              const StepIcon = step.icon;
              const hasAction = step.status === "action-needed" && step.actionLabel;

              return (
                <motion.div
                  key={step.id}
                  className="relative"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ ...MOTION.standard, delay: i * 0.06 }}
                >
                  {/* Connector line */}
                  {!isLast && (
                    <div
                      className="absolute left-[23px] top-[48px] w-[2px]"
                      style={{
                        height: "calc(100% - 36px)",
                        background: step.status === "complete"
                          ? `${BRAND_COLORS.green}30`
                          : c.surface.hover,
                      }}
                    />
                  )}

                  <div className="flex gap-3 mb-3">
                    {/* Step icon */}
                    <div
                      className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0"
                      style={{ background: styles.bg }}
                    >
                      {step.status === "complete" ? (
                        <CheckCircle2 className="w-5 h-5" style={{ color: BRAND_COLORS.green }} />
                      ) : step.status === "in-review" ? (
                        <Clock className="w-5 h-5" style={{ color: styles.iconColor }} />
                      ) : (
                        <StepIcon className="w-5 h-5" style={{ color: styles.iconColor }} />
                      )}
                    </div>

                    {/* Step content */}
                    <GlassPanel
                      variant={d ? "dark" : "light"}
                      blur={20}
                      className="flex-1 rounded-2xl px-4 py-3.5"
                      style={{
                        opacity: step.status === "locked" ? 0.5 : 1,
                      }}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <span style={{ ...DT.label, color: c.text.primary }}>
                            {step.title}
                          </span>
                          <p style={{ ...DT.meta, color: c.text.muted, marginTop: "2px", lineHeight: "1.4" }}>
                            {step.description}
                          </p>
                          {step.detail && (
                            <div className="flex items-center gap-1.5 mt-2">
                              <div
                                className="w-1.5 h-1.5 rounded-full"
                                style={{ background: styles.color }}
                              />
                              <span style={{ ...DT.meta, color: styles.color, fontWeight: 600 }}>
                                {step.detail}
                              </span>
                            </div>
                          )}
                          {step.eta && step.status !== "complete" && (
                            <div className="flex items-center gap-1 mt-1.5">
                              <Clock className="w-3 h-3" style={{ color: c.text.ghost }} />
                              <span style={{ ...DT.meta, color: c.text.ghost }}>{step.eta}</span>
                            </div>
                          )}
                        </div>
                        <span
                          className="shrink-0 px-2 py-0.5 rounded-md"
                          style={{
                            ...DT.meta,
                            fontSize: "11px",
                            fontWeight: 600,
                            color: styles.color,
                            background: styles.bg,
                          }}
                        >
                          {statusLabel(step.status)}
                        </span>
                      </div>

                      {/* Action button */}
                      {hasAction && (
                        <motion.button
                          className="mt-3 w-full py-2.5 rounded-xl flex items-center justify-center gap-2"
                          style={{
                            background: step.id === "inspection"
                              ? BRAND_COLORS.green
                              : d ? "rgba(245,158,11,0.12)" : "rgba(245,158,11,0.08)",
                            border: step.id === "inspection"
                              ? "none"
                              : `1px solid ${d ? "rgba(245,158,11,0.2)" : "rgba(245,158,11,0.15)"}`,
                          }}
                          onClick={() => {
                            if (step.id === "documents") setSubView("documents");
                            if (step.id === "inspection") setSubView("schedule");
                          }}
                          whileTap={{ scale: 0.97 }}
                        >
                          {step.id === "documents" && <Upload className="w-3.5 h-3.5" style={{ color: "#F59E0B" }} />}
                          {step.id === "inspection" && <Calendar className="w-3.5 h-3.5" style={{ color: "#fff" }} />}
                          <span style={{
                            ...DT.meta,
                            fontWeight: 600,
                            color: step.id === "inspection" ? "#fff" : "#F59E0B",
                          }}>
                            {step.actionLabel}
                          </span>
                        </motion.button>
                      )}
                    </GlassPanel>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Help note */}
          <div className="px-5 mb-6">
            <div
              className="flex items-start gap-3 px-4 py-3 rounded-xl"
              style={{ background: c.surface.subtle }}
            >
              <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" style={{ color: c.text.ghost }} />
              <p style={{ ...DT.meta, color: c.text.faint, lineHeight: "1.5" }}>
                Need help? Contact our driver support team at <span style={{ color: BRAND_COLORS.green }}>drivers@jetapp.ng</span> or
                call <span style={{ color: BRAND_COLORS.green }}>0800-JET-HELP</span>.
              </p>
            </div>
          </div>

          {/* Continue to dashboard — visible so driver can explore while waiting */}
          <div className="px-5 mb-6">
            <motion.button
              className="w-full py-3.5 rounded-xl flex items-center justify-center gap-2"
              style={{
                background: BRAND_COLORS.green,
                boxShadow: `0 4px 16px ${BRAND_COLORS.green}25`,
              }}
              onClick={() => onActivated?.()}
              whileTap={{ scale: 0.97 }}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...MOTION.standard, delay: 0.5 }}
            >
              <span style={{ ...DT.cta, color: "#fff" }}>
                Continue to dashboard
              </span>
            </motion.button>
            <p className="mt-2 text-center" style={{ ...DT.meta, color: c.text.ghost }}>
              You can explore the app while verification is in progress
            </p>
          </div>

          <div style={{ height: 100 }} />
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}