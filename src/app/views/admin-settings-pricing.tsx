/**
 * SETTINGS — PRICING
 * Zone-based pricing configuration
 */

import { useState } from "react";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { Plus, ArrowLeft, Info } from "lucide-react";
import { AdminThemeProvider, useAdminTheme, BRAND, TY } from "../config/admin-theme";
import { AdminModal, ModalHeader, ModalFooter, SurfaceButton } from "../components/admin/ui/surfaces";

interface ZoneData {
  id: string;
  name: string;
}

interface PricingData {
  baseFare: number;
  perKm: number;
  perMin: number;
  minFare: number;
  cancellationFee: number;
  maxSurge: number;
}

const DEFAULT_PRICING: PricingData = {
  baseFare: 350,
  perKm: 85,
  perMin: 15,
  minFare: 800,
  cancellationFee: 200,
  maxSurge: 3.0,
};

const ZONES: ZoneData[] = [
  { id: "1", name: "Lagos Island" },
  { id: "2", name: "Lekki" },
  { id: "3", name: "Victoria Island" },
];

function SettingsPricingInner() {
  const navigate = useNavigate();
  const { t } = useAdminTheme();
  const [selectedZone, setSelectedZone] = useState<string>(ZONES[0].id);
  const [pricing, setPricing] = useState<PricingData>(DEFAULT_PRICING);
  const [originalPricing, setOriginalPricing] = useState<PricingData>(DEFAULT_PRICING);
  const [showResetModal, setShowResetModal] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const zone = ZONES.find(z => z.id === selectedZone)!;
  const hasChanges = JSON.stringify(pricing) !== JSON.stringify(originalPricing);

  const handleSave = () => {
    const newErrors: Record<string, string> = {};

    if (pricing.minFare < pricing.baseFare) {
      newErrors.minFare = `Minimum fare should be higher than or equal to your base fare (₦${pricing.baseFare})`;
    }

    if (pricing.perKm === 0) {
      // This is a warning, not an error
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setOriginalPricing(pricing);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }
  };

  const handleReset = () => {
    setPricing(DEFAULT_PRICING);
    setOriginalPricing(DEFAULT_PRICING);
    setShowResetModal(false);
  };

  return (
    <>
      <div className="w-full h-screen flex overflow-hidden" style={{ background: t.bg }}>
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header with breadcrumb */}
          <div
            className="h-14 px-6 flex items-center gap-3 shrink-0"
            style={{ borderBottom: `1px solid ${t.borderSubtle}` }}
          >
            <button
              onClick={() => navigate("/dashboard-empty?state=B")}
              className="p-1.5 rounded-lg hover:bg-opacity-80"
              style={{ background: t.surfaceHover }}
            >
              <ArrowLeft size={14} style={{ color: t.iconSecondary }} />
            </button>
            <span style={{ ...TY.bodyR, fontSize: "12px", color: t.textMuted }}>
              Settings
            </span>
            <span style={{ color: t.textGhost }}>→</span>
            <span style={{ ...TY.body, fontSize: "12px", color: t.textSecondary }}>
              Pricing
            </span>
          </div>

          {/* Content — two columns */}
          <div className="flex-1 flex overflow-hidden">
            {/* Left column — zone list */}
            <div
              className="w-80 p-5 overflow-y-auto shrink-0"
              style={{ borderRight: `1px solid ${t.borderSubtle}` }}
            >
              <span
                className="block mb-3"
                style={{ ...TY.label, fontSize: "9px", letterSpacing: "0.04em", color: t.textFaint }}
              >
                SERVICE ZONES
              </span>

              <div className="mb-4" style={{ height: 1, background: t.borderSubtle }} />

              <div className="space-y-2">
                {ZONES.map(z => {
                  const isSelected = selectedZone === z.id;
                  return (
                    <button
                      key={z.id}
                      className="w-full px-3 py-2.5 rounded-xl text-left transition-all"
                      style={{
                        background: isSelected ? t.surfaceActive : "transparent",
                        borderLeft: isSelected ? `3px solid ${BRAND.green}` : "3px solid transparent",
                      }}
                      onClick={() => setSelectedZone(z.id)}
                    >
                      <span
                        style={{
                          ...TY.body,
                          fontSize: "12px",
                          letterSpacing: "-0.02em",
                          color: isSelected ? t.text : t.textTertiary,
                        }}
                      >
                        {z.name}
                      </span>
                    </button>
                  );
                })}
              </div>

              <button
                className="w-full mt-4 h-10 px-3 rounded-xl flex items-center gap-2"
                style={{ border: `1px dashed ${t.borderSubtle}` }}
              >
                <Plus size={14} style={{ color: t.iconMuted }} />
                <span style={{ ...TY.body, fontSize: "11px", color: t.textMuted }}>
                  Add zone
                </span>
              </button>
            </div>

            {/* Right column — pricing fields */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="max-w-xl">
                <div className="flex items-center justify-between mb-4">
                  <span
                    style={{
                      ...TY.h,
                      fontFamily: "'Montserrat', sans-serif",
                      fontWeight: 600,
                      fontSize: "16px",
                      letterSpacing: "-0.03em",
                      color: t.text,
                    }}
                  >
                    PRICING — {zone.name}
                  </span>
                </div>

                <div className="mb-4" style={{ height: 1, background: t.borderSubtle }} />

                {/* Form fields */}
                <div className="space-y-4 mb-6">
                  <PricingField
                    label="Base fare"
                    value={pricing.baseFare}
                    onChange={v => setPricing({ ...pricing, baseFare: v })}
                    prefix="₦"
                  />

                  <PricingField
                    label="Per kilometre"
                    value={pricing.perKm}
                    onChange={v => setPricing({ ...pricing, perKm: v })}
                    prefix="₦"
                    warning={pricing.perKm === 0 ? "Riders won't be charged for distance in this zone. Confirm this is intentional." : undefined}
                  />

                  <PricingField
                    label="Per minute"
                    value={pricing.perMin}
                    onChange={v => setPricing({ ...pricing, perMin: v })}
                    prefix="₦"
                  />

                  <PricingField
                    label="Minimum fare"
                    value={pricing.minFare}
                    onChange={v => setPricing({ ...pricing, minFare: v })}
                    prefix="₦"
                    error={errors.minFare}
                  />

                  <PricingField
                    label="Cancellation fee"
                    value={pricing.cancellationFee}
                    onChange={v => setPricing({ ...pricing, cancellationFee: v })}
                    prefix="₦"
                  />

                  <PricingField
                    label="Maximum surge"
                    value={pricing.maxSurge}
                    onChange={v => setPricing({ ...pricing, maxSurge: v })}
                    suffix="x"
                    step={0.1}
                  />
                </div>

                {/* Info note */}
                <div
                  className="p-3 rounded-xl flex items-start gap-2 mb-6"
                  style={{ background: t.infoBg, border: `1px solid ${t.infoBorder}` }}
                >
                  <Info size={14} className="mt-0.5 shrink-0" style={{ color: t.infoText }} />
                  <p style={{ ...TY.bodyR, fontSize: "11px", color: t.textSecondary, lineHeight: 1.5 }}>
                    These are JET standard rates. Changes apply to this zone only.
                  </p>
                </div>

                {/* Success message */}
                <AnimatePresence>
                  {saveSuccess && (
                    <motion.div
                      className="mb-4 p-3 rounded-xl flex items-center gap-2"
                      style={{ background: t.greenBg, border: `1px solid ${t.greenBorder}` }}
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                    >
                      <div className="w-1.5 h-1.5 rounded-full" style={{ background: BRAND.green }} />
                      <span style={{ ...TY.body, fontSize: "11px", color: BRAND.green }}>
                        Pricing saved for {zone.name}.
                      </span>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Actions */}
                <div className="flex items-center gap-3">
                  <button
                    className="h-11 px-5 rounded-xl transition-opacity"
                    style={{
                      background: hasChanges ? BRAND.green : t.surface,
                      border: `1px solid ${hasChanges ? BRAND.green : t.borderSubtle}`,
                      opacity: hasChanges ? 1 : 0.5,
                      cursor: hasChanges ? "pointer" : "not-allowed",
                      minHeight: 44,
                    }}
                    onClick={hasChanges ? handleSave : undefined}
                  >
                    <span
                      style={{
                        ...TY.body,
                        fontSize: "12px",
                        letterSpacing: "-0.02em",
                        color: hasChanges ? "#FFFFFF" : t.textMuted,
                      }}
                    >
                      {hasChanges ? "Save changes" : "No changes to save"}
                    </span>
                  </button>

                  <button
                    className="h-11 px-5 rounded-xl transition-colors"
                    style={{
                      background: t.surface,
                      border: `1px solid ${t.borderSubtle}`,
                      minHeight: 44,
                    }}
                    onClick={() => setShowResetModal(true)}
                  >
                    <span
                      style={{
                        ...TY.body,
                        fontSize: "12px",
                        letterSpacing: "-0.02em",
                        color: t.textSecondary,
                      }}
                    >
                      Reset to JET defaults
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Reset modal */}
      <AdminModal
        open={showResetModal}
        onClose={() => setShowResetModal(false)}
        width={420}
      >
        <ModalHeader
          title={`Reset pricing for ${zone.name}?`}
          onClose={() => setShowResetModal(false)}
        />
        <div className="px-6 py-5">
          <p style={{ ...TY.bodyR, fontSize: "12px", color: t.textMuted, lineHeight: 1.5 }}>
            This will remove your custom rates and restore JET standard pricing for this zone.
          </p>
        </div>
        <ModalFooter>
          <SurfaceButton
            label="Cancel"
            variant="ghost"
            onClick={() => setShowResetModal(false)}
          />
          <SurfaceButton
            label="Reset to defaults"
            variant="danger"
            onClick={handleReset}
          />
        </ModalFooter>
      </AdminModal>
    </>
  );
}

function PricingField({
  label,
  value,
  onChange,
  prefix,
  suffix,
  step = 1,
  error,
  warning,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  prefix?: string;
  suffix?: string;
  step?: number;
  error?: string;
  warning?: string;
}) {
  const { t } = useAdminTheme();

  return (
    <div>
      <label className="block mb-1.5">
        <span style={{ ...TY.body, fontSize: "11px", color: t.textTertiary }}>
          {label}
        </span>
      </label>
      <div className="flex items-center gap-2">
        {prefix && (
          <span style={{ ...TY.body, fontSize: "13px", color: t.textMuted }}>
            {prefix}
          </span>
        )}
        <input
          type="number"
          value={value}
          onChange={e => onChange(parseFloat(e.target.value) || 0)}
          step={step}
          className="flex-1 h-10 px-3 rounded-xl outline-none transition-all"
          style={{
            background: t.surface,
            border: `1px solid ${error ? "#D4183D" : t.borderSubtle}`,
            color: t.text,
            ...TY.body,
            fontSize: "13px",
            letterSpacing: "-0.02em",
          }}
        />
        {suffix && (
          <span style={{ ...TY.body, fontSize: "13px", color: t.textMuted }}>
            {suffix}
          </span>
        )}
      </div>
      {error && (
        <p className="mt-1.5" style={{ ...TY.bodyR, fontSize: "10px", color: "#D4183D" }}>
          {error}
        </p>
      )}
      {warning && !error && (
        <p className="mt-1.5" style={{ ...TY.bodyR, fontSize: "10px", color: "#F59E0B" }}>
          {warning}
        </p>
      )}
    </div>
  );
}

export function AdminSettingsPricing() {
  return (
    <AdminThemeProvider>
      <SettingsPricingInner />
    </AdminThemeProvider>
  );
}
