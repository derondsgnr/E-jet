/**
 * FLEET — NEW
 * Create fleet owner form
 */

import { useState, useMemo } from "react";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { ArrowLeft, Info } from "lucide-react";
import { useAdminTheme, BRAND, TY, STATUS } from "../config/admin-theme";
import { AdminModal, ModalHeader, ModalFooter, SurfaceButton } from "../components/admin/ui/surfaces";

interface FormData {
  businessName: string;
  ownerName: string;
  phone: string;
  email: string;
  cacNumber: string;
  bankName: string;
  accountNumber: string;
  accountName: string;
  jetCommission: number;
  fleetCommission: number;
  payoutSchedule: string;
}

const INITIAL_FORM: FormData = {
    businessName: "",
    ownerName: "",
    phone: "",
    email: "",
    cacNumber: "",
    bankName: "",
    accountNumber: "",
    accountName: "",
    jetCommission: 20,
    fleetCommission: 80,
    payoutSchedule: "weekly",
};

export function AdminFleetNew() {
  const navigate = useNavigate();
  const { t } = useAdminTheme();
  const [formData, setFormData] = useState<FormData>(INITIAL_FORM);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showDiscardModal, setShowDiscardModal] = useState(false);

  const isDirty = useMemo(() => {
    return Object.keys(INITIAL_FORM).some(
      key => (formData as any)[key] !== (INITIAL_FORM as any)[key]
    );
  }, [formData]);

  const handleBack = () => {
    if (isDirty) {
      setShowDiscardModal(true);
    } else {
      navigate("/admin/fleet/empty");
    }
  };

  const handleDiscard = () => {
    setFormData(INITIAL_FORM);
    setErrors({});
    setShowDiscardModal(false);
    navigate("/admin/fleet/empty");
  };

  const hasRequiredFields =
    formData.businessName &&
    formData.ownerName &&
    formData.phone &&
    formData.email &&
    formData.bankName &&
    formData.accountNumber;

  const handleCreate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.businessName) newErrors.businessName = "This field is required.";
    if (!formData.ownerName) newErrors.ownerName = "This field is required.";
    if (!formData.phone) newErrors.phone = "This field is required.";
    if (!formData.email) newErrors.email = "This field is required.";
    if (!formData.bankName) newErrors.bankName = "This field is required.";
    if (!formData.accountNumber) newErrors.accountNumber = "Bank account required. Fleet owner cannot receive payouts without this.";

    if (formData.jetCommission + formData.fleetCommission !== 100) {
      newErrors.commission = "Commission split must total 100%";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setShowConfirmModal(true);
    }
  };

  const confirmCreate = () => {
    navigate("/admin/fleet/profile?new=true");
  };

  return (
    <>
      <div className="w-full h-screen flex flex-col overflow-hidden" style={{ background: t.bg }}>
        {/* Header */}
        <div
          className="h-14 px-6 flex items-center gap-3 shrink-0"
          style={{ borderBottom: `1px solid ${t.borderSubtle}` }}
        >
          <button
            onClick={handleBack}
            className="p-1.5 rounded-lg hover:bg-opacity-80"
            style={{ background: t.surfaceHover }}
          >
            <ArrowLeft size={14} style={{ color: t.iconSecondary }} />
          </button>
          <span style={{ ...TY.bodyR, fontSize: "12px", color: t.textMuted }}>
            Fleet
          </span>
          <span style={{ color: t.textGhost }}>→</span>
          <span style={{ ...TY.body, fontSize: "12px", color: t.textSecondary }}>
            Add fleet owner
          </span>
        </div>

        {/* Form */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-2xl mx-auto space-y-8">
            {/* Owner Details */}
            <div>
              <span
                className="block mb-4"
                style={{
                  ...TY.label,
                  fontSize: "9px",
                  letterSpacing: "0.04em",
                  color: t.textFaint,
                }}
              >
                OWNER DETAILS
              </span>

              <div className="space-y-4">
                <FormField
                  label="Business name"
                  required
                  value={formData.businessName}
                  onChange={v => setFormData({ ...formData, businessName: v })}
                  error={errors.businessName}
                />

                <FormField
                  label="Owner name"
                  required
                  value={formData.ownerName}
                  onChange={v => setFormData({ ...formData, ownerName: v })}
                  error={errors.ownerName}
                />

                <FormField
                  label="Phone number"
                  required
                  type="tel"
                  value={formData.phone}
                  onChange={v => setFormData({ ...formData, phone: v })}
                  error={errors.phone}
                />

                <FormField
                  label="Email address"
                  required
                  type="email"
                  value={formData.email}
                  onChange={v => setFormData({ ...formData, email: v })}
                  error={errors.email}
                />

                <FormField
                  label="CAC number"
                  value={formData.cacNumber}
                  onChange={v => setFormData({ ...formData, cacNumber: v })}
                  hint="Optional"
                />
              </div>
            </div>

            {/* Payout Details */}
            <div>
              <span
                className="block mb-4"
                style={{
                  ...TY.label,
                  fontSize: "9px",
                  letterSpacing: "0.04em",
                  color: t.textFaint,
                }}
              >
                PAYOUT DETAILS
              </span>

              <div className="space-y-4">
                <FormField
                  label="Bank name"
                  required
                  value={formData.bankName}
                  onChange={v => setFormData({ ...formData, bankName: v })}
                  error={errors.bankName}
                  placeholder="Nigerian banks"
                />

                <FormField
                  label="Account number"
                  required
                  value={formData.accountNumber}
                  onChange={v => setFormData({ ...formData, accountNumber: v })}
                  error={errors.accountNumber}
                />

                <FormField
                  label="Account name"
                  value={formData.accountName}
                  onChange={v => setFormData({ ...formData, accountName: v })}
                  hint="Auto-filled on account number entry"
                />

                <div
                  className="px-3 py-2 rounded-xl flex items-start gap-2"
                  style={{ background: t.infoBg, border: `1px solid ${t.infoBorder}` }}
                >
                  <Info size={12} className="mt-0.5 shrink-0" style={{ color: t.infoText }} />
                  <span style={{ ...TY.bodyR, fontSize: "10px", color: t.textMuted }}>
                    Required to receive driver earnings
                  </span>
                </div>
              </div>
            </div>

            {/* Commercial Terms */}
            <div>
              <span
                className="block mb-4"
                style={{
                  ...TY.label,
                  fontSize: "9px",
                  letterSpacing: "0.04em",
                  color: t.textFaint,
                }}
              >
                COMMERCIAL TERMS
              </span>

              <div className="space-y-4">
                <div>
                  <label className="block mb-1.5">
                    <span style={{ ...TY.body, fontSize: "11px", color: t.textTertiary }}>
                      JET commission
                    </span>
                  </label>
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <input
                        type="number"
                        value={formData.jetCommission}
                        onChange={e => {
                          const val = parseFloat(e.target.value) || 0;
                          setFormData({
                            ...formData,
                            jetCommission: val,
                            fleetCommission: 100 - val,
                          });
                        }}
                        className="w-20 h-10 px-3 rounded-xl outline-none"
                        style={{
                          background: t.surface,
                          border: `1px solid ${errors.commission ? "#D4183D" : t.borderSubtle}`,
                          color: t.text,
                          ...TY.body,
                          fontSize: "12px",
                        }}
                      />
                      <span style={{ ...TY.body, fontSize: "12px", color: t.textMuted }}>
                        %
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span style={{ ...TY.body, fontSize: "11px", color: t.textTertiary }}>
                        Fleet owner earns
                      </span>
                      <span style={{ ...TY.body, fontSize: "12px", color: t.text }}>
                        {formData.fleetCommission}%
                      </span>
                    </div>

                    <div
                      className="px-3 py-2 rounded-xl flex items-start gap-2"
                      style={{ background: t.infoBg, border: `1px solid ${t.infoBorder}` }}
                    >
                      <Info size={12} className="mt-0.5 shrink-0" style={{ color: t.infoText }} />
                      <span style={{ ...TY.bodyR, fontSize: "10px", color: t.textMuted }}>
                        Combined must equal 100%
                      </span>
                    </div>

                    {errors.commission && (
                      <p style={{ ...TY.bodyR, fontSize: "10px", color: "#D4183D" }}>
                        {errors.commission}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block mb-1.5">
                    <span style={{ ...TY.body, fontSize: "11px", color: t.textTertiary }}>
                      Payout schedule
                    </span>
                  </label>
                  <div className="flex items-center gap-2">
                    <span style={{ ...TY.body, fontSize: "12px", color: t.textSecondary }}>
                      Weekly
                    </span>
                    <button
                      className="px-2 py-1 rounded"
                      style={{ background: t.surfaceHover, border: `1px solid ${t.borderSubtle}` }}
                    >
                      <span style={{ ...TY.cap, fontSize: "9px", color: t.textMuted }}>
                        Change to Daily ↓
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div
              className="pt-6 flex items-center justify-between"
              style={{ borderTop: `1px solid ${t.borderSubtle}` }}
            >
              <button
                className="h-11 px-5 rounded-xl"
                style={{
                  background: t.surface,
                  border: `1px solid ${t.borderSubtle}`,
                  minHeight: 44,
                }}
                onClick={() => navigate("/admin/fleet/empty")}
              >
                <span
                  style={{
                    ...TY.body,
                    fontSize: "12px",
                    letterSpacing: "-0.02em",
                    color: t.textMuted,
                  }}
                >
                  Save as draft
                </span>
              </button>

              <button
                className="h-11 px-5 rounded-xl transition-opacity"
                style={{
                  background: hasRequiredFields ? BRAND.green : t.surface,
                  border: `1px solid ${hasRequiredFields ? BRAND.green : t.borderSubtle}`,
                  opacity: hasRequiredFields ? 1 : 0.5,
                  cursor: hasRequiredFields ? "pointer" : "not-allowed",
                  minHeight: 44,
                }}
                onClick={hasRequiredFields ? handleCreate : undefined}
              >
                <span
                  style={{
                    ...TY.body,
                    fontSize: "12px",
                    letterSpacing: "-0.02em",
                    color: hasRequiredFields ? "#FFFFFF" : t.textMuted,
                  }}
                >
                  Create fleet owner →
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation modal */}
      <AdminModal
        open={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        width={440}
      >
        <ModalHeader
          title="Create fleet owner?"
          onClose={() => setShowConfirmModal(false)}
        />
        <div className="px-6 py-5 space-y-3">
          <div>
            <span style={{ ...TY.body, fontSize: "13px", color: t.text }}>
              {formData.businessName} · {formData.ownerName}
            </span>
          </div>
          <div>
            <span style={{ ...TY.bodyR, fontSize: "11px", color: t.textMuted }}>
              Contact: {formData.email}
            </span>
          </div>
          <p className="mt-4" style={{ ...TY.bodyR, fontSize: "11px", color: t.textMuted, lineHeight: 1.5 }}>
            An invitation will be sent to {formData.ownerName}. They will log in to add vehicles and drivers.
          </p>
        </div>
        <ModalFooter>
          <SurfaceButton label="Cancel" variant="ghost" onClick={() => setShowConfirmModal(false)} />
          <SurfaceButton
            label="Create and send invitation →"
            variant="primary"
            onClick={confirmCreate}
          />
        </ModalFooter>
      </AdminModal>

      {/* Discard modal */}
      <AdminModal
        open={showDiscardModal}
        onClose={() => setShowDiscardModal(false)}
        width={440}
      >
        <ModalHeader
          title="Discard changes?"
          onClose={() => setShowDiscardModal(false)}
        />
        <div className="px-6 py-5 space-y-3">
          <p className="mt-4" style={{ ...TY.bodyR, fontSize: "11px", color: t.textMuted, lineHeight: 1.5 }}>
            Are you sure you want to discard your changes and go back?
          </p>
        </div>
        <ModalFooter>
          <SurfaceButton label="Cancel" variant="ghost" onClick={() => setShowDiscardModal(false)} />
          <SurfaceButton
            label="Discard and go back →"
            variant="primary"
            onClick={handleDiscard}
          />
        </ModalFooter>
      </AdminModal>
    </>
  );
}

function FormField({
  label,
  value,
  onChange,
  required,
  type = "text",
  error,
  hint,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
  type?: string;
  error?: string;
  hint?: string;
  placeholder?: string;
}) {
  const { t } = useAdminTheme();

  return (
    <div>
      <label className="block mb-1.5">
        <span style={{ ...TY.body, fontSize: "11px", color: t.textTertiary }}>
          {label} {required && <span style={{ color: STATUS.error }}>*</span>}
        </span>
      </label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full h-10 px-3 rounded-xl outline-none transition-all"
        style={{
          background: t.surface,
          border: `1px solid ${error ? "#D4183D" : t.borderSubtle}`,
          color: t.text,
          ...TY.body,
          fontSize: "12px",
          letterSpacing: "-0.02em",
        }}
      />
      {error && (
        <p className="mt-1.5" style={{ ...TY.bodyR, fontSize: "10px", color: "#D4183D" }}>
          {error}
        </p>
      )}
      {hint && !error && (
        <p className="mt-1.5" style={{ ...TY.bodyR, fontSize: "10px", color: t.textFaint }}>
          {hint}
        </p>
      )}
    </div>
  );
}

