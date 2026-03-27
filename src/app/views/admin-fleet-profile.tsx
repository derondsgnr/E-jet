/**
 * FLEET — PROFILE
 * Fleet owner profile view
 */

import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { ArrowLeft, Car, Mail, Phone, CreditCard, ChevronRight } from "lucide-react";
import { AdminThemeProvider, useAdminTheme, BRAND, TY, STATUS } from "../config/admin-theme";
import { AdminModal, ModalHeader, ModalFooter, SurfaceButton } from "../components/admin/ui/surfaces";

function FleetProfileInner() {
  const navigate = useNavigate();
  const { t } = useAdminTheme();
  const [searchParams] = useSearchParams();
  const isNew = searchParams.get("new") === "true";
  const [status, setStatus] = useState<"invited" | "active">("invited");
  const [showResendModal, setShowResendModal] = useState(false);
  const [hasVehicles, setHasVehicles] = useState(false);

  return (
    <>
      <div className="w-full h-screen flex flex-col overflow-hidden" style={{ background: t.bg }}>
        {/* Header */}
        <div
          className="h-14 px-6 flex items-center gap-3 shrink-0"
          style={{ borderBottom: `1px solid ${t.borderSubtle}` }}
        >
          <button
            onClick={() => navigate("/fleet-empty")}
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
            Metro Express Fleet
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
                    Metro Express Fleet created. Invitation sent to chidi@metroexpress.ng.
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
                METRO EXPRESS FLEET
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

            {/* Owner Details */}
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
                OWNER DETAILS
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
                      Chidi Okonkwo
                    </span>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1">
                        <Mail size={12} style={{ color: t.iconMuted }} />
                        <span style={{ ...TY.bodyR, fontSize: "11px", color: t.textMuted }}>
                          chidi@metroexpress.ng
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Phone size={12} style={{ color: t.iconMuted }} />
                        <span style={{ ...TY.bodyR, fontSize: "11px", color: t.textMuted }}>
                          +234 802 345 6789
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
                <DetailRow label="JET commission" value="20%" />
                <DetailRow label="Payout schedule" value="Weekly" />
                <DetailRow label="Bank account" value="••••• 4521 · GTBank" />
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

            {/* Vehicles */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <span
                  style={{
                    ...TY.label,
                    fontSize: "9px",
                    letterSpacing: "0.04em",
                    color: t.textFaint,
                  }}
                >
                  VEHICLES
                </span>
                <span
                  style={{
                    ...TY.h,
                    fontSize: "16px",
                    letterSpacing: "-0.03em",
                    color: t.textSecondary,
                  }}
                >
                  {hasVehicles ? "3" : "0"}
                </span>
              </div>

              {!hasVehicles ? (
                <div
                  className="p-6 rounded-xl text-center"
                  style={{ background: t.surface, border: `1px solid ${t.borderSubtle}` }}
                >
                  <p style={{ ...TY.bodyR, fontSize: "12px", color: t.textMuted, lineHeight: 1.5 }}>
                    No vehicles yet. Vehicles will appear here once the fleet owner adds them from their dashboard.
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  <VehicleRow
                    vehicle="Toyota Camry 2023"
                    plate="LND-284EP"
                    type="Gas"
                    status="Pending inspection"
                  />
                  <VehicleRow
                    vehicle="BYD Seal 2024"
                    plate="LND-291KA"
                    type="EV"
                    status="Pending inspection"
                  />
                  <VehicleRow
                    vehicle="Honda Accord 2022"
                    plate="LND-156BT"
                    type="Gas"
                    status="Approved"
                    approved
                  />
                </div>
              )}
            </div>

            {/* Drivers */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <span
                  style={{
                    ...TY.label,
                    fontSize: "9px",
                    letterSpacing: "0.04em",
                    color: t.textFaint,
                  }}
                >
                  DRIVERS
                </span>
                <span
                  style={{
                    ...TY.h,
                    fontSize: "16px",
                    letterSpacing: "-0.03em",
                    color: t.textSecondary,
                  }}
                >
                  0
                </span>
              </div>

              <div
                className="p-6 rounded-xl text-center"
                style={{ background: t.surface, border: `1px solid ${t.borderSubtle}` }}
              >
                <span style={{ ...TY.bodyR, fontSize: "12px", color: t.textMuted }}>
                  No drivers linked yet.
                </span>
              </div>
            </div>

            {/* Earnings */}
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
                EARNINGS
              </span>

              <div
                className="p-6 rounded-xl text-center"
                style={{ background: t.surface, border: `1px solid ${t.borderSubtle}` }}
              >
                <span style={{ ...TY.bodyR, fontSize: "12px", color: t.textMuted }}>
                  No payouts yet.
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
            A new invitation will be sent to chidi@metroexpress.ng.
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

function VehicleRow({
  vehicle,
  plate,
  type,
  status,
  approved,
}: {
  vehicle: string;
  plate: string;
  type: "Gas" | "EV";
  status: string;
  approved?: boolean;
}) {
  const { t } = useAdminTheme();

  return (
    <button
      className="w-full p-3 rounded-xl flex items-center gap-3 text-left transition-colors"
      style={{
        background: t.surface,
        border: `1px solid ${t.borderSubtle}`,
      }}
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span style={{ ...TY.body, fontSize: "12px", color: t.text }}>
            {vehicle} · {plate} · {type}
          </span>
          {type === "EV" && (
            <span
              className="px-1.5 py-0.5 rounded"
              style={{ ...TY.cap, fontSize: "8px", background: t.greenBg, color: BRAND.green }}
            >
              EV
            </span>
          )}
        </div>
        <span style={{ ...TY.bodyR, fontSize: "10px", color: approved ? BRAND.green : t.textMuted }}>
          Status: {status}
        </span>
      </div>

      <div className="flex items-center gap-1 shrink-0">
        <span style={{ ...TY.cap, fontSize: "9px", color: t.textTertiary }}>
          {approved ? "View" : "Review"} →
        </span>
      </div>
    </button>
  );
}

export function AdminFleetProfile() {
  return (
    <AdminThemeProvider>
      <FleetProfileInner />
    </AdminThemeProvider>
  );
}
