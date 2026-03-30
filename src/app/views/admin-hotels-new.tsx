/**
 * HOTELS — NEW
 * Create hotel partner form
 */

import { useState } from "react";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { ArrowLeft, Star, ChevronDown, Info } from "lucide-react";
import { useAdminTheme, BRAND, TY, STATUS } from "../config/admin-theme";
import { AdminModal, ModalHeader, ModalFooter, SurfaceButton } from "../components/admin/ui/surfaces";

interface FormData {
  hotelName: string;
  address: string;
  starRating: number;
  cacNumber: string;
  contactName: string;
  email: string;
  phone: string;
  corporateRate: string;
  billingCycle: string;
  creditLimit: number;
  dashboardAccess: boolean;
  apiAccess: boolean;
}

export function AdminHotelsNew() {
  const navigate = useNavigate();
  const { t } = useAdminTheme();
  const [formData, setFormData] = useState<FormData>({
    hotelName: "",
    address: "",
    starRating: 4,
    cacNumber: "",
    contactName: "",
    email: "",
    phone: "",
    corporateRate: "standard",
    billingCycle: "monthly",
    creditLimit: 500000,
    dashboardAccess: true,
    apiAccess: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showDiscardModal, setShowDiscardModal] = useState(false);

  const hasRequiredFields =
    formData.hotelName &&
    formData.address &&
    formData.contactName &&
    formData.email &&
    formData.phone;

  const handleCreate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.hotelName) newErrors.hotelName = "This field is required.";
    if (!formData.address) newErrors.address = "This field is required.";
    if (!formData.contactName) newErrors.contactName = "This field is required.";
    if (!formData.email) newErrors.email = "This field is required.";
    if (!formData.phone) newErrors.phone = "This field is required.";

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setShowConfirmModal(true);
    }
  };

  const confirmCreate = () => {
    navigate("/admin/hotels/profile?new=true");
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
            onClick={() => navigate("/admin/hotels/empty")}
            className="p-1.5 rounded-lg hover:bg-opacity-80"
            style={{ background: t.surfaceHover }}
          >
            <ArrowLeft size={14} style={{ color: t.iconSecondary }} />
          </button>
          <span style={{ ...TY.bodyR, fontSize: "12px", color: t.textMuted }}>
            Hotels
          </span>
          <span style={{ color: t.textGhost }}>→</span>
          <span style={{ ...TY.body, fontSize: "12px", color: t.textSecondary }}>
            Add new partner
          </span>
        </div>

        {/* Form */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-2xl mx-auto space-y-8">
            {/* Hotel Details */}
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
                HOTEL DETAILS
              </span>

              <div className="space-y-4">
                <FormField
                  label="Hotel name"
                  required
                  value={formData.hotelName}
                  onChange={v => setFormData({ ...formData, hotelName: v })}
                  error={errors.hotelName}
                />

                <FormField
                  label="Address"
                  required
                  value={formData.address}
                  onChange={v => setFormData({ ...formData, address: v })}
                  error={errors.address}
                />

                <div>
                  <label className="block mb-1.5">
                    <span style={{ ...TY.body, fontSize: "11px", color: t.textTertiary }}>
                      Star rating
                    </span>
                  </label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map(rating => (
                      <button
                        key={rating}
                        className="w-10 h-10 rounded-xl flex items-center justify-center transition-all"
                        style={{
                          background: formData.starRating >= rating ? t.greenBg : t.surface,
                          border: `1px solid ${formData.starRating >= rating ? t.greenBorder : t.borderSubtle}`,
                        }}
                        onClick={() => setFormData({ ...formData, starRating: rating })}
                      >
                        <Star
                          size={14}
                          style={{
                            color: formData.starRating >= rating ? BRAND.green : t.iconMuted,
                            fill: formData.starRating >= rating ? BRAND.green : "none",
                          }}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <FormField
                  label="CAC number"
                  value={formData.cacNumber}
                  onChange={v => setFormData({ ...formData, cacNumber: v })}
                  hint="Optional — can be added later"
                />
              </div>
            </div>

            {/* Primary Contact */}
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
                PRIMARY CONTACT
              </span>

              <div className="space-y-4">
                <FormField
                  label="Contact name"
                  required
                  value={formData.contactName}
                  onChange={v => setFormData({ ...formData, contactName: v })}
                  error={errors.contactName}
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
                  label="Phone number"
                  required
                  type="tel"
                  value={formData.phone}
                  onChange={v => setFormData({ ...formData, phone: v })}
                  error={errors.phone}
                />
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
                      Corporate rate
                    </span>
                  </label>
                  <div className="flex items-center gap-2">
                    <span style={{ ...TY.body, fontSize: "12px", color: t.textSecondary }}>
                      JET standard rate
                    </span>
                    <button
                      className="px-2 py-1 rounded"
                      style={{ background: t.surfaceHover, border: `1px solid ${t.borderSubtle}` }}
                    >
                      <span style={{ ...TY.cap, fontSize: "9px", color: t.textMuted }}>
                        Customise ↓
                      </span>
                    </button>
                  </div>
                  <div
                    className="mt-2 px-3 py-2 rounded-xl flex items-start gap-2"
                    style={{ background: t.infoBg, border: `1px solid ${t.infoBorder}` }}
                  >
                    <Info size={12} className="mt-0.5 shrink-0" style={{ color: t.infoText }} />
                    <span style={{ ...TY.bodyR, fontSize: "10px", color: t.textMuted }}>
                      Pre-agreed rate applies by default
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block mb-1.5">
                    <span style={{ ...TY.body, fontSize: "11px", color: t.textTertiary }}>
                      Billing cycle
                    </span>
                  </label>
                  <div className="flex items-center gap-2">
                    <span style={{ ...TY.body, fontSize: "12px", color: t.textSecondary }}>
                      Monthly
                    </span>
                    <button
                      className="px-2 py-1 rounded"
                      style={{ background: t.surfaceHover, border: `1px solid ${t.borderSubtle}` }}
                    >
                      <span style={{ ...TY.cap, fontSize: "9px", color: t.textMuted }}>
                        Change ↓
                      </span>
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block mb-1.5">
                    <span style={{ ...TY.body, fontSize: "11px", color: t.textTertiary }}>
                      Credit limit
                    </span>
                  </label>
                  <div className="flex items-center gap-2">
                    <span style={{ ...TY.body, fontSize: "12px", color: t.textSecondary }}>
                      ₦500,000 / month
                    </span>
                    <button
                      className="px-2 py-1 rounded"
                      style={{ background: t.surfaceHover, border: `1px solid ${t.borderSubtle}` }}
                    >
                      <span style={{ ...TY.cap, fontSize: "9px", color: t.textMuted }}>
                        Adjust ↓
                      </span>
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <ToggleRow
                    label="Dashboard access"
                    value={formData.dashboardAccess}
                    onChange={v => setFormData({ ...formData, dashboardAccess: v })}
                  />
                  <ToggleRow
                    label="API access"
                    value={formData.apiAccess}
                    onChange={v => setFormData({ ...formData, apiAccess: v })}
                  />
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
                onClick={() => navigate("/admin/hotels/empty")}
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
                  Create hotel partner →
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
          title="Create hotel partner?"
          onClose={() => setShowConfirmModal(false)}
        />
        <div className="px-6 py-5 space-y-3">
          <div>
            <span style={{ ...TY.body, fontSize: "13px", color: t.text }}>
              {formData.hotelName}
            </span>
          </div>
          <div>
            <span style={{ ...TY.bodyR, fontSize: "11px", color: t.textMuted }}>
              Contact: {formData.contactName} · {formData.email}
            </span>
          </div>
          <p className="mt-4" style={{ ...TY.bodyR, fontSize: "11px", color: t.textMuted, lineHeight: 1.5 }}>
            An invitation will be sent to {formData.email}. They will log in to set up their team and preferences.
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
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
  type?: string;
  error?: string;
  hint?: string;
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

function ToggleRow({ label, value, onChange }: { label: string; value: boolean; onChange: (v: boolean) => void }) {
  const { t } = useAdminTheme();

  return (
    <div
      className="flex items-center justify-between px-3 py-2.5 rounded-xl"
      style={{ background: t.surface, border: `1px solid ${t.borderSubtle}` }}
    >
      <span style={{ ...TY.body, fontSize: "12px", color: t.textSecondary }}>
        {label}
      </span>
      <button
        className="w-11 h-6 rounded-full relative transition-all"
        style={{
          background: value ? BRAND.green : t.surfaceActive,
        }}
        onClick={() => onChange(!value)}
      >
        <div
          className="w-5 h-5 rounded-full absolute top-0.5 transition-all"
          style={{
            background: "#FFFFFF",
            left: value ? "22px" : "2px",
          }}
        />
      </button>
    </div>
  );
}

