/**
 * HOTELS — PROFILE
 * Hotel partner profile view
 */

import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { ArrowLeft, Star, Building2, Mail, Phone, CreditCard, Calendar } from "lucide-react";
import { useAdminTheme, BRAND, TY, STATUS } from "../config/admin-theme";
import { AdminModal, ModalHeader, ModalFooter, SurfaceButton } from "../components/admin/ui/surfaces";

export function AdminHotelsProfile() {
  const navigate = useNavigate();
  const { t } = useAdminTheme();
  const [searchParams] = useSearchParams();
  const isNew = searchParams.get("new") === "true";
  const [status, setStatus] = useState<"invited" | "active">("invited");
  const [showResendModal, setShowResendModal] = useState(false);

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
            Eko Hotels & Suites
          </span>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-3xl mx-auto space-y-6">
            {/* Success banner */}
            <AnimatePresence>
              {isNew && (
                <motion.div
                  className="p-4 rounded-xl flex items-center gap-2"
                  style={{ background: t.greenBg, border: `1px solid ${t.greenBorder}` }}
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                >
                  <div className="w-1.5 h-1.5 rounded-full" style={{ background: BRAND.green }} />
                  <span style={{ ...TY.body, fontSize: "12px", color: BRAND.green }}>
                    Eko Hotels created. Invitation sent to adaeze@ekohotels.com.
                  </span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Title + Status */}
            <div>
              <h1
                className="mb-2"
                style={{
                  ...TY.h,
                  fontFamily: "'Montserrat', sans-serif",
                  fontWeight: 600,
                  fontSize: "20px",
                  letterSpacing: "-0.03em",
                  color: t.text,
                }}
              >
                EKO HOTELS & SUITES
              </h1>
              <div className="flex items-center gap-2">
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ background: status === "active" ? BRAND.green : STATUS.warning }}
                />
                <span style={{ ...TY.body, fontSize: "12px", color: t.textMuted }}>
                  {status === "active" ? "Active" : "Invited — awaiting first login"}
                </span>
              </div>
            </div>

            <div style={{ height: 1, background: t.borderSubtle }} />

            {/* Account Details */}
            <div>
              <span
                className="block mb-3"
                style={{
                  ...TY.label,
                  fontSize: "9px",
                  letterSpacing: "0.04em",
                  color: t.textFaint,
                }}
              >
                ACCOUNT DETAILS
              </span>

              <div className="space-y-2">
                <DetailRow label="Address" value="Victoria Island, Lagos" />
                <DetailRow
                  label="Star rating"
                  value={
                    <div className="flex gap-0.5">
                      {[1, 2, 3, 4, 5].map(i => (
                        <Star
                          key={i}
                          size={12}
                          style={{ color: BRAND.green, fill: BRAND.green }}
                        />
                      ))}
                    </div>
                  }
                />
                <DetailRow
                  label="CAC number"
                  value={
                    <div className="flex items-center gap-2">
                      <span style={{ ...TY.bodyR, fontSize: "12px", color: t.textMuted }}>
                        — not provided
                      </span>
                      <button
                        className="px-2 py-1 rounded"
                        style={{ background: t.surfaceHover, border: `1px solid ${t.borderSubtle}` }}
                      >
                        <span style={{ ...TY.cap, fontSize: "9px", color: t.textTertiary }}>
                          Add →
                        </span>
                      </button>
                    </div>
                  }
                />
                <DetailRow label="Created" value="Today, 11 March 2026" />
              </div>
            </div>

            {/* Contact */}
            <div>
              <span
                className="block mb-3"
                style={{
                  ...TY.label,
                  fontSize: "9px",
                  letterSpacing: "0.04em",
                  color: t.textFaint,
                }}
              >
                CONTACT
              </span>

              <div
                className="p-4 rounded-xl"
                style={{ background: t.surface, border: `1px solid ${t.borderSubtle}` }}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <span
                      className="block mb-1"
                      style={{ ...TY.body, fontSize: "13px", color: t.text }}
                    >
                      Adaeze Okafor
                    </span>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1">
                        <Mail size={12} style={{ color: t.iconMuted }} />
                        <span style={{ ...TY.bodyR, fontSize: "11px", color: t.textMuted }}>
                          adaeze@ekohotels.com
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Phone size={12} style={{ color: t.iconMuted }} />
                        <span style={{ ...TY.bodyR, fontSize: "11px", color: t.textMuted }}>
                          +234 801 234 5678
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  className="h-9 px-4 rounded-xl"
                  style={{
                    background: t.surfaceHover,
                    border: `1px solid ${t.borderSubtle}`,
                  }}
                  onClick={() => setShowResendModal(true)}
                >
                  <span
                    style={{
                      ...TY.body,
                      fontSize: "11px",
                      letterSpacing: "-0.02em",
                      color: t.textSecondary,
                    }}
                  >
                    Resend invitation
                  </span>
                </button>
              </div>
            </div>

            {/* Commercial Terms */}
            <div>
              <span
                className="block mb-3"
                style={{
                  ...TY.label,
                  fontSize: "9px",
                  letterSpacing: "0.04em",
                  color: t.textFaint,
                }}
              >
                COMMERCIAL TERMS
              </span>

              <div className="space-y-2">
                <DetailRow label="Rate" value="JET standard" />
                <DetailRow label="Billing cycle" value="Monthly" />
                <DetailRow label="Credit limit" value="₦500,000 / month" />
                <DetailRow
                  label=""
                  value={
                    <button
                      className="px-3 py-1.5 rounded-lg"
                      style={{ background: t.surfaceHover, border: `1px solid ${t.borderSubtle}` }}
                    >
                      <span style={{ ...TY.body, fontSize: "10px", color: t.textTertiary }}>
                        Edit terms
                      </span>
                    </button>
                  }
                />
              </div>
            </div>

            <div style={{ height: 1, background: t.borderSubtle }} />

            {/* Ride History */}
            <div>
              <span
                className="block mb-3"
                style={{
                  ...TY.label,
                  fontSize: "9px",
                  letterSpacing: "0.04em",
                  color: t.textFaint,
                }}
              >
                RIDE HISTORY
              </span>

              <div
                className="p-6 rounded-xl text-center"
                style={{ background: t.surface, border: `1px solid ${t.borderSubtle}` }}
              >
                <span style={{ ...TY.bodyR, fontSize: "12px", color: t.textMuted }}>
                  No rides yet. Rides will appear here once the hotel starts booking.
                </span>
              </div>
            </div>

            {/* Billing */}
            <div>
              <span
                className="block mb-3"
                style={{
                  ...TY.label,
                  fontSize: "9px",
                  letterSpacing: "0.04em",
                  color: t.textFaint,
                }}
              >
                BILLING
              </span>

              <div
                className="p-6 rounded-xl text-center"
                style={{ background: t.surface, border: `1px solid ${t.borderSubtle}` }}
              >
                <span style={{ ...TY.bodyR, fontSize: "12px", color: t.textMuted }}>
                  No invoices yet.
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Resend modal */}
      <AdminModal
        open={showResendModal}
        onClose={() => setShowResendModal(false)}
        width={400}
      >
        <ModalHeader
          title="Resend invitation?"
          onClose={() => setShowResendModal(false)}
        />
        <div className="px-6 py-5">
          <p style={{ ...TY.bodyR, fontSize: "12px", color: t.textMuted, lineHeight: 1.5 }}>
            A new invitation will be sent to adaeze@ekohotels.com.
          </p>
        </div>
        <ModalFooter>
          <SurfaceButton label="Cancel" variant="ghost" onClick={() => setShowResendModal(false)} />
          <SurfaceButton
            label="Resend"
            variant="primary"
            onClick={() => setShowResendModal(false)}
          />
        </ModalFooter>
      </AdminModal>
    </>
  );
}

function DetailRow({ label, value }: { label: string; value: React.ReactNode }) {
  const { t } = useAdminTheme();

  return (
    <div
      className="flex items-center justify-between px-3 py-2.5 rounded-xl"
      style={{ background: t.surface, border: `1px solid ${t.borderSubtle}` }}
    >
      {label && (
        <span style={{ ...TY.body, fontSize: "11px", color: t.textTertiary }}>
          {label}
        </span>
      )}
      {typeof value === "string" ? (
        <span style={{ ...TY.body, fontSize: "12px", color: t.textSecondary }}>
          {value}
        </span>
      ) : (
        value
      )}
    </div>
  );
}

