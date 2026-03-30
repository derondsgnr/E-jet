/**
 * DRIVERS — VERIFICATION
 * Extended Kanban with empty states and full approval workflow
 */

import { useState } from "react";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import {
  Users, Copy, CheckCircle2, XCircle, ArrowLeft, AlertCircle,
  FileText, Shield, Car, Clock
} from "lucide-react";
import { useAdminTheme, BRAND, TY, STATUS } from "../config/admin-theme";
import { AdminDrawer } from "../components/admin/ui/surfaces";
import { AdminModal, ModalHeader, ModalFooter, SurfaceButton } from "../components/admin/ui/surfaces";

interface Driver {
  id: string;
  name: string;
  vehicle: string;
  type: "Gas" | "EV";
  photo?: string;
  stage: string;
  daysInStage: number;
  documents: {
    nin: boolean;
    license: boolean;
    insurance: boolean;
  };
  inspectionStatus: "not_scheduled" | "scheduled" | "complete";
}

const MOCK_DRIVERS: Driver[] = [
  {
    id: "1",
    name: "Emeka Nwosu",
    vehicle: "Toyota Camry",
    type: "Gas",
    stage: "docs_submitted",
    daysInStage: 2,
    documents: { nin: true, license: true, insurance: false },
    inspectionStatus: "not_scheduled",
  },
  {
    id: "2",
    name: "Chidi Okafor",
    vehicle: "BYD Seal",
    type: "EV",
    stage: "under_review",
    daysInStage: 1,
    documents: { nin: true, license: true, insurance: true },
    inspectionStatus: "scheduled",
  },
];

const STAGES = [
  { id: "registered", label: "REGISTERED" },
  { id: "docs_submitted", label: "DOCS SUBMITTED" },
  { id: "under_review", label: "UNDER REVIEW" },
  { id: "inspection_scheduled", label: "INSPECTION\nSCHEDULED" },
  { id: "approved", label: "APPROVED" },
];

export function AdminDriversVerification() {
  const navigate = useNavigate();
  const { t } = useAdminTheme();
  const [drivers] = useState<Driver[]>(MOCK_DRIVERS);
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [rejectedDriverIds, setRejectedDriverIds] = useState<Set<string>>(new Set());
  const [showRejectSuccess, setShowRejectSuccess] = useState(false);

  const isEmpty = drivers.length === 0;

  return (
    <>
      <div className="w-full h-screen flex flex-col overflow-hidden" style={{ background: t.bg }}>
        {/* Header */}
        <div
          className="h-14 px-6 flex items-center gap-3 shrink-0"
          style={{ borderBottom: `1px solid ${t.borderSubtle}` }}
        >
          <button
            onClick={() => navigate("/admin/dashboard-empty?state=B")}
            className="p-1.5 rounded-lg hover:bg-opacity-80"
            style={{ background: t.surfaceHover }}
          >
            <ArrowLeft size={14} style={{ color: t.iconSecondary }} />
          </button>
          <span
            style={{
              ...TY.h,
              fontFamily: "'Montserrat', sans-serif",
              fontWeight: 600,
              fontSize: "14px",
              letterSpacing: "-0.03em",
              color: t.text,
            }}
          >
            Drivers — Verification
          </span>
        </div>

        {/* Kanban or Empty State */}
        <div className="flex-1 overflow-x-auto overflow-y-hidden p-6">
          {isEmpty ? (
            <div className="h-full flex items-center justify-center">
              <div className="max-w-md text-center">
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
                  style={{ background: t.surface, border: `1px solid ${t.borderSubtle}` }}
                >
                  <Users size={28} style={{ color: t.iconMuted }} />
                </div>

                <h3
                  className="mb-2"
                  style={{
                    ...TY.sub,
                    fontSize: "16px",
                    letterSpacing: "-0.02em",
                    color: t.text,
                  }}
                >
                  No drivers registered yet
                </h3>

                <p
                  className="mb-6"
                  style={{
                    ...TY.bodyR,
                    fontSize: "13px",
                    color: t.textMuted,
                    lineHeight: 1.5,
                  }}
                >
                  Share your driver signup link so drivers can register on the JET mobile app.
                </p>

                <div
                  className="px-4 py-3 rounded-xl mb-4 inline-flex items-center gap-2"
                  style={{
                    background: t.surface,
                    border: `1px solid ${t.borderSubtle}`,
                  }}
                >
                  <span
                    style={{
                      ...TY.body,
                      fontSize: "14px",
                      letterSpacing: "-0.02em",
                      color: BRAND.green,
                    }}
                  >
                    jet.ng/drive
                  </span>
                </div>

                <button
                  className="h-11 px-5 rounded-xl flex items-center gap-2 mx-auto mb-4"
                  style={{
                    background: t.greenBg,
                    border: `1px solid ${t.greenBorder}`,
                    minHeight: 44,
                  }}
                >
                  <Copy size={14} style={{ color: BRAND.green }} />
                  <span
                    style={{
                      ...TY.body,
                      fontSize: "12px",
                      letterSpacing: "-0.02em",
                      color: BRAND.green,
                    }}
                  >
                    Copy link
                  </span>
                </button>

                <p
                  style={{
                    ...TY.bodyR,
                    fontSize: "11px",
                    color: t.textFaint,
                  }}
                >
                  Drivers will appear here once they register and submit their documents.
                </p>
              </div>
            </div>
          ) : (
            <div className="flex gap-4 min-w-max">
              {STAGES.map(stage => {
                const stageDrivers = drivers.filter(d => d.stage === stage.id && !rejectedDriverIds.has(d.id));

                return (
                  <div key={stage.id} className="w-72 flex flex-col shrink-0">
                    <div className="mb-3 px-1">
                      <span
                        style={{
                          ...TY.label,
                          fontSize: "9px",
                          letterSpacing: "0.04em",
                          color: t.textFaint,
                          whiteSpace: "pre-line",
                        }}
                      >
                        {stage.label}
                      </span>
                    </div>

                    <div className="flex-1 space-y-2">
                      {stageDrivers.map(driver => (
                        <DriverCard
                          key={driver.id}
                          driver={driver}
                          onClick={() => setSelectedDriver(driver)}
                        />
                      ))}

                      {stageDrivers.length === 0 && (
                        <div
                          className="h-24 rounded-xl flex items-center justify-center"
                          style={{ border: `1px dashed ${t.borderSubtle}` }}
                        >
                          <span
                            style={{
                              ...TY.bodyR,
                              fontSize: "10px",
                              color: t.textGhost,
                            }}
                          >
                            No drivers
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Driver detail drawer */}
      <AdminDrawer
        open={!!selectedDriver}
        onClose={() => setSelectedDriver(null)}
        title={selectedDriver?.name || ""}
        subtitle={`Registered ${selectedDriver?.daysInStage} days ago`}
      >
        {selectedDriver && (
          <div className="p-5 space-y-6">
            {/* Vehicle */}
            <div>
              <span
                className="block mb-2"
                style={{ ...TY.label, fontSize: "9px", color: t.textFaint }}
              >
                VEHICLE
              </span>
              <div className="flex items-center gap-2">
                <span style={{ ...TY.body, fontSize: "12px", color: t.textSecondary }}>
                  {selectedDriver.vehicle} 2023 · LND-284EP ·
                </span>
                <span
                  className="px-2 py-0.5 rounded"
                  style={{
                    ...TY.cap,
                    fontSize: "9px",
                    background: selectedDriver.type === "EV" ? t.greenBg : t.surface,
                    color: selectedDriver.type === "EV" ? BRAND.green : t.textMuted,
                  }}
                >
                  {selectedDriver.type}
                </span>
              </div>
            </div>

            {/* Documents */}
            <div>
              <span
                className="block mb-3"
                style={{ ...TY.label, fontSize: "9px", color: t.textFaint }}
              >
                DOCUMENTS
              </span>
              <div className="space-y-2">
                <DocRow label="NIN" verified={selectedDriver.documents.nin} />
                <DocRow label="Driver's licence" verified={selectedDriver.documents.license} meta="expires Dec 2027" />
                <DocRow
                  label="Vehicle insurance"
                  verified={selectedDriver.documents.insurance}
                  action={!selectedDriver.documents.insurance}
                />
              </div>
            </div>

            {/* Inspection */}
            <div>
              <span
                className="block mb-3"
                style={{ ...TY.label, fontSize: "9px", color: t.textFaint }}
              >
                PHYSICAL INSPECTION
              </span>
              <div
                className="p-3 rounded-xl"
                style={{ background: t.surface, border: `1px solid ${t.borderSubtle}` }}
              >
                <span className="block mb-2" style={{ ...TY.body, fontSize: "11px", color: t.textSecondary }}>
                  Status: {selectedDriver.inspectionStatus === "complete" ? "Complete" : selectedDriver.inspectionStatus === "scheduled" ? "Scheduled" : "Not yet scheduled"}
                </span>
                <div className="flex gap-2">
                  {selectedDriver.inspectionStatus === "not_scheduled" && (
                    <button
                      className="px-3 py-1.5 rounded-lg"
                      style={{ background: t.surfaceHover, border: `1px solid ${t.borderSubtle}` }}
                    >
                      <span style={{ ...TY.body, fontSize: "10px", color: t.textTertiary }}>
                        Mark as scheduled
                      </span>
                    </button>
                  )}
                  <button
                    className="px-3 py-1.5 rounded-lg"
                    style={{
                      background: selectedDriver.inspectionStatus !== "not_scheduled" ? t.surfaceHover : t.surface,
                      border: `1px solid ${t.borderSubtle}`,
                      opacity: selectedDriver.inspectionStatus !== "not_scheduled" ? 1 : 0.5,
                    }}
                    disabled={selectedDriver.inspectionStatus === "not_scheduled"}
                  >
                    <span style={{ ...TY.body, fontSize: "10px", color: t.textTertiary }}>
                      Mark as complete
                    </span>
                  </button>
                </div>
              </div>
            </div>

            {/* Decision */}
            <div>
              <span
                className="block mb-3"
                style={{ ...TY.label, fontSize: "9px", color: t.textFaint }}
              >
                DECISION
              </span>
              <div className="flex gap-2">
                <button
                  className="flex-1 h-11 px-4 rounded-xl flex items-center justify-center gap-2"
                  style={{
                    background: t.errorBg,
                    border: `1px solid ${t.errorBorder}`,
                    minHeight: 44,
                  }}
                  onClick={() => setShowRejectModal(true)}
                >
                  <XCircle size={14} style={{ color: STATUS.error }} />
                  <span style={{ ...TY.body, fontSize: "11px", color: STATUS.error }}>
                    Reject driver
                  </span>
                </button>

                <button
                  className="flex-1 h-11 px-4 rounded-xl flex items-center justify-center gap-2"
                  style={{
                    background: selectedDriver.documents.insurance && selectedDriver.inspectionStatus === "complete" ? BRAND.green : t.surface,
                    border: `1px solid ${selectedDriver.documents.insurance && selectedDriver.inspectionStatus === "complete" ? BRAND.green : t.borderSubtle}`,
                    opacity: selectedDriver.documents.insurance && selectedDriver.inspectionStatus === "complete" ? 1 : 0.5,
                    minHeight: 44,
                  }}
                  onClick={() => selectedDriver.documents.insurance && selectedDriver.inspectionStatus === "complete" && setShowApproveModal(true)}
                  title={!(selectedDriver.documents.insurance && selectedDriver.inspectionStatus === "complete") ? "Complete all documents and physical inspection to approve" : ""}
                >
                  <CheckCircle2 size={14} style={{ color: selectedDriver.documents.insurance && selectedDriver.inspectionStatus === "complete" ? "#FFFFFF" : t.textMuted }} />
                  <span style={{ ...TY.body, fontSize: "11px", color: selectedDriver.documents.insurance && selectedDriver.inspectionStatus === "complete" ? "#FFFFFF" : t.textMuted }}>
                    Approve driver
                  </span>
                </button>
              </div>
            </div>
          </div>
        )}
      </AdminDrawer>

      {/* Reject modal */}
      <AdminModal
        open={showRejectModal}
        onClose={() => setShowRejectModal(false)}
        danger
        width={440}
      >
        <ModalHeader
          title={`Reject ${selectedDriver?.name}?`}
          onClose={() => setShowRejectModal(false)}
        />
        <div className="px-6 py-5 space-y-4">
          <p style={{ ...TY.body, fontSize: "12px", color: t.textSecondary }}>
            Select a reason:
          </p>
          <div className="space-y-2">
            {["Document issue", "Vehicle failed inspection", "Identity mismatch", "Other"].map(reason => (
              <button
                key={reason}
                className="w-full px-3 py-2.5 rounded-xl text-left flex items-center gap-2"
                style={{
                  background: rejectReason === reason ? t.errorBg : t.surface,
                  border: `1px solid ${rejectReason === reason ? t.errorBorder : t.borderSubtle}`,
                }}
                onClick={() => setRejectReason(reason)}
              >
                <div
                  className="w-4 h-4 rounded-full border-2 flex items-center justify-center"
                  style={{ borderColor: rejectReason === reason ? STATUS.error : t.borderSubtle }}
                >
                  {rejectReason === reason && (
                    <div className="w-2 h-2 rounded-full" style={{ background: STATUS.error }} />
                  )}
                </div>
                <span style={{ ...TY.body, fontSize: "12px", color: t.textSecondary }}>
                  {reason}
                </span>
              </button>
            ))}
          </div>
          <p style={{ ...TY.bodyR, fontSize: "11px", color: t.textMuted }}>
            Driver will be notified via the JET app.
          </p>
        </div>
        <ModalFooter>
          <SurfaceButton label="Cancel" variant="ghost" onClick={() => setShowRejectModal(false)} />
          <SurfaceButton label="Reject driver" variant="danger" onClick={() => {
            if (selectedDriver) {
              setRejectedDriverIds(prev => new Set([...prev, selectedDriver.id]));
              setShowRejectModal(false);
              setShowRejectSuccess(true);
            }
          }} />
        </ModalFooter>
      </AdminModal>

      {/* Approve modal */}
      <AdminModal
        open={showApproveModal}
        onClose={() => setShowApproveModal(false)}
        width={420}
      >
        <ModalHeader
          title={`Approve ${selectedDriver?.name}?`}
          onClose={() => setShowApproveModal(false)}
        />
        <div className="px-6 py-5 space-y-3">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={16} style={{ color: BRAND.green }} />
            <span style={{ ...TY.body, fontSize: "12px", color: t.textSecondary }}>
              {selectedDriver?.vehicle} 2023 · LND-284EP
            </span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 size={16} style={{ color: BRAND.green }} />
            <span style={{ ...TY.body, fontSize: "12px", color: t.textSecondary }}>
              All checks complete
            </span>
          </div>
          <p className="mt-4" style={{ ...TY.bodyR, fontSize: "11px", color: t.textMuted }}>
            Driver will be notified and can go online immediately.
          </p>
        </div>
        <ModalFooter>
          <SurfaceButton label="Cancel" variant="ghost" onClick={() => setShowApproveModal(false)} />
          <SurfaceButton
            label="Approve driver"
            variant="primary"
            onClick={() => {
              setShowApproveModal(false);
              navigate("/admin/dashboard-empty?state=C");
            }}
          />
        </ModalFooter>
      </AdminModal>

      {/* Reject success modal */}
      <AdminModal
        open={showRejectSuccess}
        onClose={() => setShowRejectSuccess(false)}
        width={420}
      >
        <ModalHeader
          title="Driver Rejected"
          onClose={() => setShowRejectSuccess(false)}
        />
        <div className="px-6 py-5 space-y-3">
          <p style={{ ...TY.body, fontSize: "12px", color: t.textSecondary }}>
            The driver has been successfully rejected.
          </p>
        </div>
        <ModalFooter>
          <SurfaceButton label="Close" variant="primary" onClick={() => setShowRejectSuccess(false)} />
        </ModalFooter>
      </AdminModal>
    </>
  );
}

function DriverCard({ driver, onClick }: { driver: Driver; onClick: () => void }) {
  const { t } = useAdminTheme();

  return (
    <motion.button
      className="w-full p-3 rounded-xl text-left group"
      style={{
        background: t.surface,
        border: `1px solid ${t.borderSubtle}`,
      }}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      onClick={onClick}
      whileHover={{ scale: 1.01 }}
    >
      <div className="flex items-start gap-3">
        <div
          className="w-10 h-10 rounded-xl shrink-0 flex items-center justify-center"
          style={{ background: t.surfaceActive }}
        >
          <Users size={16} style={{ color: t.iconMuted }} />
        </div>

        <div className="flex-1 min-w-0">
          <span
            className="block mb-0.5"
            style={{ ...TY.body, fontSize: "12px", letterSpacing: "-0.02em", color: t.text }}
          >
            {driver.name}
          </span>
          <div className="flex items-center gap-1.5 mb-1">
            <span style={{ ...TY.bodyR, fontSize: "10px", color: t.textMuted }}>
              {driver.vehicle} · {driver.type}
            </span>
            {driver.type === "EV" && (
              <span
                className="px-1.5 py-0.5 rounded"
                style={{ ...TY.cap, fontSize: "8px", background: t.greenBg, color: BRAND.green }}
              >
                EV
              </span>
            )}
          </div>
          <span style={{ ...TY.bodyR, fontSize: "9px", color: t.textFaint }}>
            In this stage: {driver.daysInStage} days
          </span>
        </div>
      </div>
    </motion.button>
  );
}

function DocRow({ label, verified, meta, action }: { label: string; verified: boolean; meta?: string; action?: boolean }) {
  const { t } = useAdminTheme();

  return (
    <div
      className="px-3 py-2 rounded-xl flex items-center gap-2"
      style={{ background: t.surface, border: `1px solid ${t.borderSubtle}` }}
    >
      {verified ? (
        <CheckCircle2 size={14} style={{ color: BRAND.green }} />
      ) : (
        <XCircle size={14} style={{ color: STATUS.error }} />
      )}
      <div className="flex-1 min-w-0">
        <span className="block" style={{ ...TY.body, fontSize: "11px", color: t.textSecondary }}>
          {label}
        </span>
        {meta && (
          <span style={{ ...TY.bodyR, fontSize: "9px", color: t.textFaint }}>
            {meta}
          </span>
        )}
        {!verified && !meta && (
          <span style={{ ...TY.bodyR, fontSize: "9px", color: STATUS.error }}>
            not uploaded
          </span>
        )}
      </div>
      {action && (
        <button
          className="px-2 py-1 rounded"
          style={{ background: t.surfaceHover, border: `1px solid ${t.borderSubtle}` }}
        >
          <span style={{ ...TY.cap, fontSize: "9px", color: t.textTertiary }}>
            Request
          </span>
        </button>
      )}
    </div>
  );
}

