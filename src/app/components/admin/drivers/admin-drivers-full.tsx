/**
 * JET ADMIN — DRIVERS SURFACE (E2E)
 *
 * Surfaces wired:
 *   Pipeline card click → SIDE DRAWER (stage queue with driver list)
 *   Roster row click → SIDE DRAWER (driver profile with tabs)
 *   Approve Driver → CENTER MODAL (confirmation)
 *   Reject Driver → CENTER MODAL (destructive, persistent)
 *   Suspend Driver → CENTER MODAL (destructive, persistent)
 *   Reactivate Driver → CENTER MODAL (confirmation)
 *   Message Driver → SIDE DRAWER (compose with templates)
 *   Bulk Approve → CENTER MODAL (batch confirmation)
 *   Export CSV → immediate download simulation
 *   Schedule Inspection → SIDE DRAWER (date/location picker)
 *
 * Tabs: Pipeline · Active Roster · Suspended · Performance
 * Pattern: Linear team management, Uber fleet, Stripe Connect
 */

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Users, UserCheck, UserX, Search, Car, Phone, Mail,
  AlertTriangle, CheckCircle2, XCircle, Clock, Zap,
  ChevronDown, ChevronRight, ExternalLink, X, Ban,
  Shield, Star, BarChart3, MapPin, Calendar,
  Send, MessageSquare, FileText, Download, Filter,
  ArrowUpRight, ArrowDownRight, RefreshCcw,
  Eye, Copy, Fuel, Battery, Activity, ClipboardCheck,
  FileSearch, ShieldCheck, CarFront, TrendingUp,
} from "lucide-react";
import { useAdminTheme, TY, BRAND, STATUS } from "../../../config/admin-theme";
import { AdminModal, AdminDrawer, ModalHeader, ModalFooter, SurfaceButton } from "../ui/surfaces";
import { VERIFICATION_PIPELINE, formatNaira } from "../../../config/admin-mock-data";

/* ═══ Types ═══ */
type DriverStatus = "active" | "offline" | "on_trip" | "suspended" | "pending_review";
type PipelineStage = "new_application" | "docs_review" | "background_check" | "inspection_scheduled" | "inspection_complete";
type VehicleType = "ev" | "gas";

const DRIVER_STATUS_META: Record<DriverStatus, { label: string; color: string }> = {
  active: { label: "Online", color: BRAND.green },
  on_trip: { label: "On Trip", color: STATUS.info },
  offline: { label: "Offline", color: STATUS.neutral },
  suspended: { label: "Suspended", color: STATUS.error },
  pending_review: { label: "Pending", color: STATUS.warning },
};

const STAGE_META: Record<PipelineStage, { label: string; icon: any; color: string; desc: string }> = {
  new_application: { label: "New Applications", icon: Users, color: STATUS.info, desc: "Review personal info, eligibility" },
  docs_review: { label: "Document Review", icon: FileSearch, color: STATUS.warning, desc: "License, insurance, vehicle papers" },
  background_check: { label: "Background Check", icon: ShieldCheck, color: "#F97316", desc: "Criminal check, driving history" },
  inspection_scheduled: { label: "Inspection Scheduled", icon: CarFront, color: BRAND.green, desc: "Physical vehicle inspection" },
  inspection_complete: { label: "Inspection Complete", icon: ClipboardCheck, color: BRAND.green, desc: "Final approval pending" },
};

/* ═══ Mock Data ═══ */
interface Driver {
  id: string;
  name: string;
  phone: string;
  email: string;
  status: DriverStatus;
  rating: number;
  totalTrips: number;
  completionRate: number;
  cancelRate: number;
  earnings: number;
  vehicle: string;
  vehicleType: VehicleType;
  plate: string;
  zone: string;
  joinDate: string;
  lastActive: string;
  documents: { nin: boolean; license: boolean; insurance: boolean; vehicleReg: boolean };
  pipelineStage?: PipelineStage;
  daysInStage?: number;
  suspendReason?: string;
}

const ACTIVE_DRIVERS: Driver[] = [
  { id: "d-1", name: "Emeka Nwosu", phone: "+234 812 345 6789", email: "emeka.n@email.com", status: "active", rating: 4.92, totalTrips: 2847, completionRate: 97.2, cancelRate: 2.8, earnings: 1840000, vehicle: "Toyota Camry 2022", vehicleType: "gas", plate: "LND-482AX", zone: "Victoria Island", joinDate: "Jun 2025", lastActive: "Now", documents: { nin: true, license: true, insurance: true, vehicleReg: true } },
  { id: "d-2", name: "Fatima Bello", phone: "+234 803 456 7890", email: "fatima.b@email.com", status: "on_trip", rating: 4.88, totalTrips: 2102, completionRate: 96.8, cancelRate: 3.2, earnings: 1420000, vehicle: "BYD Atto 3", vehicleType: "ev", plate: "APP-118EV", zone: "Lekki Phase 1", joinDate: "Aug 2025", lastActive: "Now", documents: { nin: true, license: true, insurance: true, vehicleReg: true } },
  { id: "d-3", name: "Oluwaseun Kolade", phone: "+234 905 567 8901", email: "seun.k@email.com", status: "active", rating: 4.76, totalTrips: 1856, completionRate: 94.1, cancelRate: 5.9, earnings: 1180000, vehicle: "Honda Accord 2021", vehicleType: "gas", plate: "KJA-924BD", zone: "Ikeja", joinDate: "Sep 2025", lastActive: "2 min ago", documents: { nin: true, license: true, insurance: true, vehicleReg: true } },
  { id: "d-4", name: "Ibrahim Danjuma", phone: "+234 814 678 9012", email: "ibrahim.d@email.com", status: "offline", rating: 4.81, totalTrips: 1234, completionRate: 95.4, cancelRate: 4.6, earnings: 920000, vehicle: "Tesla Model 3", vehicleType: "ev", plate: "ABJ-201EV", zone: "Abuja Central", joinDate: "Oct 2025", lastActive: "1h ago", documents: { nin: true, license: true, insurance: true, vehicleReg: true } },
  { id: "d-5", name: "Abubakar Sule", phone: "+234 708 789 0123", email: "abubakar.s@email.com", status: "active", rating: 4.94, totalTrips: 3120, completionRate: 98.1, cancelRate: 1.9, earnings: 2240000, vehicle: "Toyota Corolla 2023", vehicleType: "gas", plate: "LND-761CE", zone: "Surulere", joinDate: "Mar 2025", lastActive: "Now", documents: { nin: true, license: true, insurance: true, vehicleReg: true } },
  { id: "d-6", name: "Ngozi Obi", phone: "+234 816 890 1234", email: "ngozi.o@email.com", status: "on_trip", rating: 4.85, totalTrips: 1678, completionRate: 96.2, cancelRate: 3.8, earnings: 1080000, vehicle: "Hyundai Kona EV", vehicleType: "ev", plate: "LND-445EV", zone: "Yaba", joinDate: "Nov 2025", lastActive: "Now", documents: { nin: true, license: true, insurance: true, vehicleReg: true } },
  { id: "d-7", name: "David Adeyemi", phone: "+234 902 901 2345", email: "david.a@email.com", status: "offline", rating: 4.68, totalTrips: 892, completionRate: 92.4, cancelRate: 7.6, earnings: 580000, vehicle: "Kia Rio 2020", vehicleType: "gas", plate: "OG-342FG", zone: "Gbagada", joinDate: "Jan 2026", lastActive: "3h ago", documents: { nin: true, license: true, insurance: true, vehicleReg: true } },
  { id: "d-8", name: "Blessing Okoro", phone: "+234 813 012 3456", email: "blessing.o@email.com", status: "active", rating: 4.91, totalTrips: 2480, completionRate: 97.6, cancelRate: 2.4, earnings: 1620000, vehicle: "Toyota Camry 2023", vehicleType: "gas", plate: "LND-890HJ", zone: "Ikoyi", joinDate: "May 2025", lastActive: "Now", documents: { nin: true, license: true, insurance: true, vehicleReg: true } },
];

const PIPELINE_DRIVERS: Driver[] = [
  { id: "pd-1", name: "Chinedu Okafor", phone: "+234 809 111 2222", email: "chinedu.o@email.com", status: "pending_review", rating: 0, totalTrips: 0, completionRate: 0, cancelRate: 0, earnings: 0, vehicle: "Toyota Camry 2021", vehicleType: "gas", plate: "Pending", zone: "Lagos", joinDate: "Mar 2026", lastActive: "N/A", documents: { nin: true, license: true, insurance: false, vehicleReg: false }, pipelineStage: "docs_review", daysInStage: 2 },
  { id: "pd-2", name: "Amina Yusuf", phone: "+234 805 222 3333", email: "amina.y@email.com", status: "pending_review", rating: 0, totalTrips: 0, completionRate: 0, cancelRate: 0, earnings: 0, vehicle: "Honda Civic 2022", vehicleType: "gas", plate: "Pending", zone: "Abuja", joinDate: "Mar 2026", lastActive: "N/A", documents: { nin: true, license: true, insurance: true, vehicleReg: true }, pipelineStage: "background_check", daysInStage: 1 },
  { id: "pd-3", name: "Tunde Bakare", phone: "+234 811 333 4444", email: "tunde.b@email.com", status: "pending_review", rating: 0, totalTrips: 0, completionRate: 0, cancelRate: 0, earnings: 0, vehicle: "BYD Seal", vehicleType: "ev", plate: "Pending", zone: "Lagos", joinDate: "Mar 2026", lastActive: "N/A", documents: { nin: true, license: false, insurance: false, vehicleReg: false }, pipelineStage: "new_application", daysInStage: 1 },
  { id: "pd-4", name: "Grace Adekunle", phone: "+234 703 444 5555", email: "grace.a@email.com", status: "pending_review", rating: 0, totalTrips: 0, completionRate: 0, cancelRate: 0, earnings: 0, vehicle: "Toyota Corolla 2020", vehicleType: "gas", plate: "Pending", zone: "Port Harcourt", joinDate: "Mar 2026", lastActive: "N/A", documents: { nin: true, license: true, insurance: true, vehicleReg: true }, pipelineStage: "inspection_scheduled", daysInStage: 3 },
  { id: "pd-5", name: "Uche Nnamdi", phone: "+234 815 555 6666", email: "uche.n@email.com", status: "pending_review", rating: 0, totalTrips: 0, completionRate: 0, cancelRate: 0, earnings: 0, vehicle: "Hyundai Elantra 2023", vehicleType: "gas", plate: "Pending", zone: "Lagos", joinDate: "Mar 2026", lastActive: "N/A", documents: { nin: true, license: true, insurance: true, vehicleReg: true }, pipelineStage: "inspection_complete", daysInStage: 1 },
];

const SUSPENDED_DRIVERS: Driver[] = [
  { id: "sd-1", name: "Kunle Ajayi", phone: "+234 802 666 7777", email: "kunle.a@email.com", status: "suspended", rating: 3.2, totalTrips: 420, completionRate: 78.4, cancelRate: 21.6, earnings: 280000, vehicle: "Toyota Camry 2019", vehicleType: "gas", plate: "LND-234AB", zone: "Surulere", joinDate: "Dec 2025", lastActive: "5d ago", documents: { nin: true, license: true, insurance: true, vehicleReg: true }, suspendReason: "Multiple safety complaints · 3 incidents in 7 days" },
  { id: "sd-2", name: "Joseph Eze", phone: "+234 810 777 8888", email: "joseph.e@email.com", status: "suspended", rating: 3.8, totalTrips: 680, completionRate: 82.1, cancelRate: 17.9, earnings: 440000, vehicle: "Honda Accord 2020", vehicleType: "gas", plate: "ABJ-567CD", zone: "Abuja Wuse", joinDate: "Nov 2025", lastActive: "12d ago", documents: { nin: true, license: true, insurance: false, vehicleReg: true }, suspendReason: "Expired vehicle insurance · Failed to renew within grace period" },
];

const TABS = ["Pipeline", "Active Roster", "Suspended", "Performance"] as const;
type TabKey = typeof TABS[number];

/* ═══ Sub-components ═══ */
function StatusBadge({ label, color }: { label: string; color: string }) {
  return (
    <span
      className="inline-flex items-center h-5 px-2 rounded-full"
      style={{ background: `${color}14`, color, fontSize: "10px", fontFamily: "'Manrope', sans-serif", fontWeight: 500, letterSpacing: "-0.02em" }}
    >
      {label}
    </span>
  );
}

function DocBadge({ ok }: { ok: boolean }) {
  return ok
    ? <CheckCircle2 size={13} style={{ color: BRAND.green }} />
    : <XCircle size={13} style={{ color: STATUS.error }} />;
}

/* ═══ Main Component ═══ */
export function AdminDriversFull() {
  const { t, theme } = useAdminTheme();
  const isDark = theme === "dark";

  const [activeTab, setActiveTab] = useState<TabKey>("Pipeline");
  const [rosterSearch, setRosterSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<DriverStatus | "all">("all");
  const [vehicleFilter, setVehicleFilter] = useState<VehicleType | "all">("all");
  const [zoneFilter, setZoneFilter] = useState<string>("all");

  // Surfaces
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);
  const [stageDrawer, setStageDrawer] = useState<PipelineStage | null>(null);
  const [approveModal, setApproveModal] = useState<Driver | null>(null);
  const [rejectModal, setRejectModal] = useState<Driver | null>(null);
  const [suspendModal, setSuspendModal] = useState<Driver | null>(null);
  const [reactivateModal, setReactivateModal] = useState<Driver | null>(null);
  const [messageDrawer, setMessageDrawer] = useState<Driver | null>(null);
  const [bulkApproveModal, setBulkApproveModal] = useState(false);
  const [inspectionDrawer, setInspectionDrawer] = useState<Driver | null>(null);
  const [confirmState, setConfirmState] = useState<"idle" | "loading" | "done">("idle");
  const [rejectReason, setRejectReason] = useState("");
  const [suspendReason, setSuspendReason] = useState("");
  const [messageText, setMessageText] = useState("");
  const [exportDone, setExportDone] = useState(false);

  // Filtered roster
  const filteredRoster = useMemo(() => {
    return ACTIVE_DRIVERS.filter(d => {
      if (statusFilter !== "all" && d.status !== statusFilter) return false;
      if (vehicleFilter !== "all" && d.vehicleType !== vehicleFilter) return false;
      if (zoneFilter !== "all" && d.zone !== zoneFilter) return false;
      if (rosterSearch) {
        const q = rosterSearch.toLowerCase();
        return d.name.toLowerCase().includes(q) || d.phone.includes(q) || d.vehicle.toLowerCase().includes(q) || d.zone.toLowerCase().includes(q);
      }
      return true;
    });
  }, [rosterSearch, statusFilter, vehicleFilter, zoneFilter]);

  const zones = [...new Set(ACTIVE_DRIVERS.map(d => d.zone))];

  const stageDrivers = useMemo(() => {
    if (!stageDrawer) return [];
    return PIPELINE_DRIVERS.filter(d => d.pipelineStage === stageDrawer);
  }, [stageDrawer]);

  const doConfirm = (callback?: () => void) => {
    setConfirmState("loading");
    setTimeout(() => setConfirmState("done"), 1200);
    setTimeout(() => {
      setConfirmState("idle");
      setApproveModal(null);
      setRejectModal(null);
      setSuspendModal(null);
      setReactivateModal(null);
      setBulkApproveModal(false);
      setRejectReason("");
      setSuspendReason("");
      callback?.();
    }, 2400);
  };

  const handleExport = () => {
    setExportDone(true);
    setTimeout(() => setExportDone(false), 2000);
  };

  const pipelineStageCounts: Record<PipelineStage, number> = {
    new_application: VERIFICATION_PIPELINE.newApplications,
    docs_review: VERIFICATION_PIPELINE.documentsReview,
    background_check: VERIFICATION_PIPELINE.backgroundCheck,
    inspection_scheduled: VERIFICATION_PIPELINE.inspectionScheduled,
    inspection_complete: VERIFICATION_PIPELINE.inspectionComplete,
  };

  return (
    <>
      <div className="p-3 md:p-5 max-w-[1400px]">
        {/* Tabs */}
        <div className="flex items-center gap-1 mb-5 overflow-x-auto pb-1">
          {TABS.map(tb => (
            <button
              key={tb}
              onClick={() => setActiveTab(tb)}
              className="px-3 h-8 rounded-lg whitespace-nowrap transition-colors"
              style={{ background: activeTab === tb ? t.surfaceActive : "transparent", color: activeTab === tb ? t.text : t.textMuted, ...TY.body, fontSize: "12px" }}
            >
              {tb}
              {tb === "Pipeline" && <span className="ml-1.5 text-[10px]" style={{ color: BRAND.green }}>{VERIFICATION_PIPELINE.newApplications + VERIFICATION_PIPELINE.documentsReview + VERIFICATION_PIPELINE.backgroundCheck}</span>}
              {tb === "Suspended" && SUSPENDED_DRIVERS.length > 0 && <span className="ml-1.5 text-[10px]" style={{ color: STATUS.error }}>{SUSPENDED_DRIVERS.length}</span>}
            </button>
          ))}
        </div>

        {activeTab === "Pipeline" && (
          <PipelineTab t={t} isDark={isDark}
            stageCounts={pipelineStageCounts}
            onStageClick={setStageDrawer}
            onBulkApprove={() => setBulkApproveModal(true)}
          />
        )}

        {activeTab === "Active Roster" && (
          <RosterTab
            t={t} isDark={isDark}
            drivers={filteredRoster}
            search={rosterSearch} onSearchChange={setRosterSearch}
            statusFilter={statusFilter} onStatusFilterChange={setStatusFilter}
            vehicleFilter={vehicleFilter} onVehicleFilterChange={setVehicleFilter}
            zoneFilter={zoneFilter} onZoneFilterChange={setZoneFilter}
            zones={zones}
            onSelectDriver={setSelectedDriver}
            onExport={handleExport}
            exportDone={exportDone}
          />
        )}

        {activeTab === "Suspended" && (
          <SuspendedTab t={t} isDark={isDark}
            drivers={SUSPENDED_DRIVERS}
            onSelectDriver={setSelectedDriver}
            onReactivate={setReactivateModal}
          />
        )}

        {activeTab === "Performance" && (
          <PerformanceTab t={t} isDark={isDark} drivers={ACTIVE_DRIVERS} />
        )}
      </div>

      {/* ═══ DRIVER PROFILE DRAWER ═══ */}
      <AdminDrawer open={!!selectedDriver} onClose={() => setSelectedDriver(null)} title={selectedDriver?.name || ""} subtitle={selectedDriver?.status ? DRIVER_STATUS_META[selectedDriver.status]?.label : ""} width={460}>
        {selectedDriver && (
          <DriverProfile
            driver={selectedDriver} t={t}
            onSuspend={() => { setSelectedDriver(null); setSuspendModal(selectedDriver); }}
            onMessage={() => { setSelectedDriver(null); setMessageDrawer(selectedDriver); }}
            onApprove={selectedDriver.status === "pending_review" ? () => { setSelectedDriver(null); setApproveModal(selectedDriver); } : undefined}
            onReject={selectedDriver.status === "pending_review" ? () => { setSelectedDriver(null); setRejectModal(selectedDriver); } : undefined}
            onReactivate={selectedDriver.status === "suspended" ? () => { setSelectedDriver(null); setReactivateModal(selectedDriver); } : undefined}
            onScheduleInspection={selectedDriver.pipelineStage === "inspection_scheduled" ? () => { setSelectedDriver(null); setInspectionDrawer(selectedDriver); } : undefined}
          />
        )}
      </AdminDrawer>

      {/* ═══ STAGE QUEUE DRAWER ═══ */}
      <AdminDrawer open={!!stageDrawer} onClose={() => setStageDrawer(null)} title={stageDrawer ? STAGE_META[stageDrawer].label : ""} subtitle={`${stageDrivers.length} drivers in this stage`}>
        <div className="flex-1 overflow-y-auto p-5 space-y-2">
          {stageDrivers.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <CheckCircle2 size={24} style={{ color: BRAND.green, marginBottom: 8 }} />
              <span style={{ ...TY.body, fontSize: "13px", color: t.textMuted }}>No drivers in this stage</span>
            </div>
          ) : (
            stageDrivers.map((d, i) => (
              <motion.button
                key={d.id}
                onClick={() => { setStageDrawer(null); setTimeout(() => setSelectedDriver(d), 250); }}
                className="w-full p-4 rounded-xl text-left transition-colors group"
                style={{ background: t.surface, border: `1px solid ${t.borderSubtle}` }}
                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                whileHover={{ x: 2 }}
              >
                <div className="flex items-center justify-between mb-2">
                  <span style={{ ...TY.body, fontSize: "13px", color: t.text }}>{d.name}</span>
                  <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: t.textMuted }} />
                </div>
                <div className="flex items-center gap-3">
                  <span style={{ ...TY.bodyR, fontSize: "10px", color: t.textMuted }}>{d.vehicle}</span>
                  {d.vehicleType === "ev" && <span className="flex items-center gap-0.5" style={{ fontSize: "9px", color: BRAND.green }}><Zap size={9} /> EV</span>}
                  <span style={{ ...TY.bodyR, fontSize: "10px", color: t.textFaint }}>{d.daysInStage}d in stage</span>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <span style={{ ...TY.label, fontSize: "8px", color: t.textFaint, letterSpacing: "0.04em" }}>DOCS:</span>
                  <DocBadge ok={d.documents.nin} />
                  <DocBadge ok={d.documents.license} />
                  <DocBadge ok={d.documents.insurance} />
                  <DocBadge ok={d.documents.vehicleReg} />
                </div>
              </motion.button>
            ))
          )}
        </div>
      </AdminDrawer>

      {/* ═══ MESSAGE DRAWER ═══ */}
      <AdminDrawer open={!!messageDrawer} onClose={() => setMessageDrawer(null)} title="Message Driver" subtitle={messageDrawer?.name}>
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          <div>
            <label style={{ ...TY.label, fontSize: "9px", color: t.textFaint, letterSpacing: "0.06em" }} className="block mb-1.5">TEMPLATE</label>
            <select
              className="w-full h-10 px-3 rounded-lg outline-none appearance-none"
              style={{ background: t.surface, border: `1px solid ${t.borderSubtle}`, color: t.text, ...TY.body, fontSize: "12px" }}
              onChange={e => setMessageText(e.target.value)}
            >
              <option value="">Custom message...</option>
              <option value="Hi, your document review has been completed. Please check your driver app for the next steps.">Document review complete</option>
              <option value="Your vehicle inspection has been scheduled. Please check your driver app for the date, time, and location.">Inspection scheduled</option>
              <option value="Congratulations! Your application has been approved. You can now go online and start accepting rides.">Application approved</option>
              <option value="We noticed some issues with your uploaded documents. Please re-upload the required documents in your driver app.">Document re-upload needed</option>
            </select>
          </div>
          <div>
            <label style={{ ...TY.label, fontSize: "9px", color: t.textFaint, letterSpacing: "0.06em" }} className="block mb-1.5">MESSAGE</label>
            <textarea
              value={messageText}
              onChange={e => setMessageText(e.target.value)}
              placeholder="Type your message..."
              rows={5}
              className="w-full px-3 py-2 rounded-lg outline-none resize-none"
              style={{ background: t.surface, border: `1px solid ${t.borderSubtle}`, color: t.text, ...TY.body, fontSize: "12px", lineHeight: "1.5" }}
            />
          </div>
          <div className="flex items-center gap-3">
            <span style={{ ...TY.bodyR, fontSize: "10px", color: t.textFaint }}>Channel:</span>
            {["Push", "SMS", "Email"].map(ch => (
              <span key={ch} className="h-6 px-2 rounded flex items-center" style={{ background: t.surfaceActive, ...TY.body, fontSize: "10px", color: t.text }}>{ch}</span>
            ))}
          </div>
          <button
            disabled={!messageText}
            className="w-full h-10 rounded-xl flex items-center justify-center gap-2"
            style={{ background: BRAND.green, color: "#fff", ...TY.body, fontSize: "12px", opacity: !messageText ? 0.5 : 1 }}
            onClick={() => { setMessageDrawer(null); setMessageText(""); }}
          >
            <Send size={13} /> Send Message
          </button>
        </div>
      </AdminDrawer>

      {/* ═══ INSPECTION DRAWER ═══ */}
      <AdminDrawer open={!!inspectionDrawer} onClose={() => setInspectionDrawer(null)} title="Schedule Inspection" subtitle={inspectionDrawer?.name}>
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          <div>
            <label style={{ ...TY.label, fontSize: "9px", color: t.textFaint, letterSpacing: "0.06em" }} className="block mb-1.5">DATE</label>
            <input
              type="date"
              className="w-full h-10 px-3 rounded-lg outline-none"
              style={{ background: t.surface, border: `1px solid ${t.borderSubtle}`, color: t.text, ...TY.body, fontSize: "12px" }}
            />
          </div>
          <div>
            <label style={{ ...TY.label, fontSize: "9px", color: t.textFaint, letterSpacing: "0.06em" }} className="block mb-1.5">TIME SLOT</label>
            <select className="w-full h-10 px-3 rounded-lg outline-none appearance-none" style={{ background: t.surface, border: `1px solid ${t.borderSubtle}`, color: t.text, ...TY.body, fontSize: "12px" }}>
              <option>9:00 AM</option>
              <option>10:00 AM</option>
              <option>11:00 AM</option>
              <option>1:00 PM</option>
              <option>2:00 PM</option>
              <option>3:00 PM</option>
            </select>
          </div>
          <div>
            <label style={{ ...TY.label, fontSize: "9px", color: t.textFaint, letterSpacing: "0.06em" }} className="block mb-1.5">LOCATION</label>
            <select className="w-full h-10 px-3 rounded-lg outline-none appearance-none" style={{ background: t.surface, border: `1px solid ${t.borderSubtle}`, color: t.text, ...TY.body, fontSize: "12px" }}>
              <option>JET Inspection Center — Lekki</option>
              <option>JET Inspection Center — Ikeja</option>
              <option>JET Inspection Center — Abuja</option>
              <option>Partner Center — Port Harcourt</option>
            </select>
          </div>
          <div className="rounded-xl p-4" style={{ background: t.surface, border: `1px solid ${t.borderSubtle}` }}>
            <span className="block mb-2" style={{ ...TY.label, fontSize: "9px", color: t.textFaint, letterSpacing: "0.06em" }}>VEHICLE</span>
            <span style={{ ...TY.body, fontSize: "12px", color: t.text }}>{inspectionDrawer?.vehicle}</span>
            {inspectionDrawer?.vehicleType === "ev" && <span className="ml-2 inline-flex items-center gap-0.5" style={{ fontSize: "10px", color: BRAND.green }}><Zap size={10} /> EV</span>}
          </div>
          <button
            className="w-full h-10 rounded-xl flex items-center justify-center gap-2"
            style={{ background: BRAND.green, color: "#fff", ...TY.body, fontSize: "12px" }}
            onClick={() => setInspectionDrawer(null)}
          >
            <Calendar size={13} /> Confirm Inspection
          </button>
        </div>
      </AdminDrawer>

      {/* ═══ APPROVE MODAL ═══ */}
      <AdminModal open={!!approveModal} onClose={() => { setApproveModal(null); setConfirmState("idle"); }}>
        <ModalHeader title="Approve Driver" subtitle={approveModal ? `${approveModal.name} — ${approveModal.vehicle}` : ""} />
        <div className="px-5 py-4">
          <div className="rounded-xl p-4 space-y-2" style={{ background: t.surface, border: `1px solid ${t.borderSubtle}` }}>
            {approveModal && [
              { l: "Documents", v: "All verified" },
              { l: "Background Check", v: "Passed" },
              { l: "Vehicle", v: approveModal.vehicle },
              { l: "Zone", v: approveModal.zone },
            ].map(r => (
              <div key={r.l} className="flex items-center justify-between">
                <span style={{ ...TY.bodyR, fontSize: "11px", color: t.textMuted }}>{r.l}</span>
                <span style={{ ...TY.body, fontSize: "11px", color: t.text }}>{r.v}</span>
              </div>
            ))}
          </div>
        </div>
        <ModalFooter>
          <SurfaceButton variant="ghost" onClick={() => { setApproveModal(null); setConfirmState("idle"); }}>Cancel</SurfaceButton>
          <SurfaceButton variant="primary" onClick={() => doConfirm()} loading={confirmState === "loading"}>
            {confirmState === "done" ? "Approved" : "Approve Driver"}
          </SurfaceButton>
        </ModalFooter>
      </AdminModal>

      {/* ═══ REJECT MODAL ═══ */}
      <AdminModal open={!!rejectModal} onClose={() => { setRejectModal(null); setConfirmState("idle"); }} persistent danger>
        <ModalHeader title="Reject Application" subtitle={rejectModal?.name || ""} />
        <div className="px-5 py-4 space-y-3">
          <div>
            <label style={{ ...TY.label, fontSize: "9px", color: t.textFaint, letterSpacing: "0.06em" }} className="block mb-1.5">REASON</label>
            <select value={rejectReason} onChange={e => setRejectReason(e.target.value)} className="w-full h-10 px-3 rounded-lg outline-none appearance-none" style={{ background: t.surface, border: `1px solid ${t.borderSubtle}`, color: t.text, ...TY.body, fontSize: "12px" }}>
              <option value="">Select reason...</option>
              <option value="docs_invalid">Invalid documents</option>
              <option value="background_fail">Background check failed</option>
              <option value="vehicle_fail">Vehicle does not meet standards</option>
              <option value="eligibility">Does not meet eligibility criteria</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div className="flex items-start gap-2 p-3 rounded-lg" style={{ background: `${STATUS.error}08`, border: `1px solid ${STATUS.error}20` }}>
            <AlertTriangle size={14} style={{ color: STATUS.error, marginTop: 1, flexShrink: 0 }} />
            <span style={{ ...TY.bodyR, fontSize: "11px", color: t.textMuted, lineHeight: "1.5" }}>The applicant will be notified and can re-apply after 30 days.</span>
          </div>
        </div>
        <ModalFooter>
          <SurfaceButton variant="ghost" onClick={() => { setRejectModal(null); setConfirmState("idle"); }}>Cancel</SurfaceButton>
          <SurfaceButton variant="danger" onClick={() => doConfirm()} loading={confirmState === "loading"} disabled={!rejectReason}>
            {confirmState === "done" ? "Rejected" : "Reject Application"}
          </SurfaceButton>
        </ModalFooter>
      </AdminModal>

      {/* ═══ SUSPEND MODAL ═══ */}
      <AdminModal open={!!suspendModal} onClose={() => { setSuspendModal(null); setConfirmState("idle"); }} persistent danger>
        <ModalHeader title="Suspend Driver" subtitle={suspendModal?.name || ""} />
        <div className="px-5 py-4 space-y-3">
          <div>
            <label style={{ ...TY.label, fontSize: "9px", color: t.textFaint, letterSpacing: "0.06em" }} className="block mb-1.5">REASON</label>
            <select value={suspendReason} onChange={e => setSuspendReason(e.target.value)} className="w-full h-10 px-3 rounded-lg outline-none appearance-none" style={{ background: t.surface, border: `1px solid ${t.borderSubtle}`, color: t.text, ...TY.body, fontSize: "12px" }}>
              <option value="">Select reason...</option>
              <option value="safety">Safety complaints</option>
              <option value="cancellation">Excessive cancellation rate</option>
              <option value="fraud">Suspected fraud</option>
              <option value="insurance">Expired insurance</option>
              <option value="inspection">Failed vehicle inspection</option>
              <option value="conduct">Unprofessional conduct</option>
              <option value="other">Other</option>
            </select>
          </div>
          {suspendModal && (
            <div className="rounded-xl p-4 space-y-2" style={{ background: t.surface, border: `1px solid ${t.borderSubtle}` }}>
              {[
                { l: "Current rating", v: `★ ${suspendModal.rating}` },
                { l: "Total trips", v: String(suspendModal.totalTrips) },
                { l: "Completion rate", v: `${suspendModal.completionRate}%` },
              ].map(r => (
                <div key={r.l} className="flex items-center justify-between">
                  <span style={{ ...TY.bodyR, fontSize: "11px", color: t.textMuted }}>{r.l}</span>
                  <span style={{ ...TY.body, fontSize: "11px", color: t.text }}>{r.v}</span>
                </div>
              ))}
            </div>
          )}
          <div className="flex items-start gap-2 p-3 rounded-lg" style={{ background: `${STATUS.error}08`, border: `1px solid ${STATUS.error}20` }}>
            <AlertTriangle size={14} style={{ color: STATUS.error, marginTop: 1, flexShrink: 0 }} />
            <span style={{ ...TY.bodyR, fontSize: "11px", color: t.textMuted, lineHeight: "1.5" }}>Driver will be immediately taken offline and unable to accept rides. Pending earnings will be held.</span>
          </div>
        </div>
        <ModalFooter>
          <SurfaceButton variant="ghost" onClick={() => { setSuspendModal(null); setConfirmState("idle"); }}>Cancel</SurfaceButton>
          <SurfaceButton variant="danger" onClick={() => doConfirm()} loading={confirmState === "loading"} disabled={!suspendReason}>
            {confirmState === "done" ? "Suspended" : "Suspend Driver"}
          </SurfaceButton>
        </ModalFooter>
      </AdminModal>

      {/* ═══ REACTIVATE MODAL ═══ */}
      <AdminModal open={!!reactivateModal} onClose={() => { setReactivateModal(null); setConfirmState("idle"); }}>
        <ModalHeader title="Reactivate Driver" subtitle={reactivateModal?.name || ""} />
        <div className="px-5 py-4">
          {reactivateModal && (
            <>
              <div className="rounded-xl p-4 space-y-2 mb-3" style={{ background: t.surface, border: `1px solid ${t.borderSubtle}` }}>
                {[
                  { l: "Suspended for", v: reactivateModal.suspendReason || "N/A" },
                  { l: "Rating at suspension", v: `★ ${reactivateModal.rating}` },
                  { l: "Last active", v: reactivateModal.lastActive },
                ].map(r => (
                  <div key={r.l} className="flex items-center justify-between">
                    <span style={{ ...TY.bodyR, fontSize: "11px", color: t.textMuted }}>{r.l}</span>
                    <span style={{ ...TY.body, fontSize: "11px", color: t.text }}>{r.v}</span>
                  </div>
                ))}
              </div>
              <div className="flex items-start gap-2 p-3 rounded-lg" style={{ background: `${BRAND.green}08`, border: `1px solid ${BRAND.green}20` }}>
                <CheckCircle2 size={14} style={{ color: BRAND.green, marginTop: 1, flexShrink: 0 }} />
                <span style={{ ...TY.bodyR, fontSize: "11px", color: t.textMuted, lineHeight: "1.5" }}>Driver will be able to go online and accept rides immediately after reactivation.</span>
              </div>
            </>
          )}
        </div>
        <ModalFooter>
          <SurfaceButton variant="ghost" onClick={() => { setReactivateModal(null); setConfirmState("idle"); }}>Cancel</SurfaceButton>
          <SurfaceButton variant="primary" onClick={() => doConfirm()} loading={confirmState === "loading"}>
            {confirmState === "done" ? "Reactivated" : "Reactivate Driver"}
          </SurfaceButton>
        </ModalFooter>
      </AdminModal>

      {/* ═══ BULK APPROVE MODAL ═══ */}
      <AdminModal open={bulkApproveModal} onClose={() => { setBulkApproveModal(false); setConfirmState("idle"); }} persistent>
        <ModalHeader title="Bulk Approve Drivers" subtitle={`${VERIFICATION_PIPELINE.inspectionComplete} drivers with completed inspections`} />
        <div className="px-5 py-4">
          <div className="rounded-xl p-4" style={{ background: t.surface, border: `1px solid ${t.borderSubtle}` }}>
            <div className="space-y-2">
              {[
                { l: "Eligible drivers", v: String(VERIFICATION_PIPELINE.inspectionComplete) },
                { l: "All documents verified", v: "Yes" },
                { l: "Background checks passed", v: "Yes" },
                { l: "Inspections complete", v: "Yes" },
              ].map(r => (
                <div key={r.l} className="flex items-center justify-between">
                  <span style={{ ...TY.bodyR, fontSize: "11px", color: t.textMuted }}>{r.l}</span>
                  <span style={{ ...TY.body, fontSize: "11px", color: BRAND.green }}>{r.v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <ModalFooter>
          <SurfaceButton variant="ghost" onClick={() => { setBulkApproveModal(false); setConfirmState("idle"); }}>Cancel</SurfaceButton>
          <SurfaceButton variant="primary" onClick={() => doConfirm()} loading={confirmState === "loading"}>
            {confirmState === "done" ? "All Approved" : `Approve ${VERIFICATION_PIPELINE.inspectionComplete} Drivers`}
          </SurfaceButton>
        </ModalFooter>
      </AdminModal>
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════
   PIPELINE TAB
   ═══════════════════════════════════════════════════════════════ */
function PipelineTab({ t, isDark, stageCounts, onStageClick, onBulkApprove }: any) {
  const stages = Object.entries(STAGE_META) as [PipelineStage, typeof STAGE_META[PipelineStage]][];
  const totalInPipeline = Object.values(stageCounts).reduce((a: number, b: number) => a + b, 0);

  return (
    <>
      {/* Summary strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {[
          { label: "In Pipeline", value: totalInPipeline, color: STATUS.info, source: "drivers.status = pending_review" },
          { label: "Approved (active)", value: VERIFICATION_PIPELINE.approved, color: BRAND.green, source: "drivers.status = active" },
          { label: "Avg Processing", value: `${VERIFICATION_PIPELINE.avgProcessingDays}d`, color: t.text, source: "AVG(approved_at - applied_at)" },
          { label: "Oldest Pending", value: `${VERIFICATION_PIPELINE.oldestPending}d`, color: STATUS.warning, source: "MAX(now - applied_at) WHERE status = pending" },
        ].map((kpi, i) => (
          <motion.div key={kpi.label} className="p-4 rounded-2xl group relative" style={{ background: t.surfaceRaised, border: `1px solid ${t.borderSubtle}`, boxShadow: t.shadow }} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.04 }}>
            <span className="block" style={{ ...TY.h, fontSize: "22px", color: kpi.color }}>{kpi.value}</span>
            <span style={{ ...TY.bodyR, fontSize: "10px", color: t.textFaint }}>{kpi.label}</span>
            <div className="absolute bottom-1 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <span style={{ ...TY.cap, fontSize: "8px", color: t.textGhost }}>{kpi.source}</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Stage cards */}
      <span className="block mb-3" style={{ ...TY.label, fontSize: "9px", color: t.textFaint, letterSpacing: "0.06em" }}>VERIFICATION PIPELINE</span>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 mb-6">
        {stages.map(([key, meta], i) => (
          <motion.button
            key={key}
            onClick={() => onStageClick(key)}
            className="p-4 rounded-2xl text-left transition-all group"
            style={{ background: t.surfaceRaised, border: `1px solid ${t.borderSubtle}`, boxShadow: t.shadow }}
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + i * 0.05 }}
            whileHover={{ scale: 1.01, borderColor: `${meta.color}40` }}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: `${meta.color}12` }}>
                <meta.icon size={16} style={{ color: meta.color }} />
              </div>
              <span style={{ ...TY.h, fontSize: "24px", color: t.text }}>{stageCounts[key]}</span>
            </div>
            <span className="block mb-0.5" style={{ ...TY.body, fontSize: "12px", color: t.textSecondary }}>{meta.label}</span>
            <div className="flex items-center justify-between">
              <span style={{ ...TY.bodyR, fontSize: "10px", color: t.textFaint }}>{meta.desc}</span>
              <ChevronRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: t.textMuted }} />
            </div>
          </motion.button>
        ))}
      </div>

      {/* Quick actions */}
      <span className="block mb-3" style={{ ...TY.label, fontSize: "9px", color: t.textFaint, letterSpacing: "0.06em" }}>ACTIONS</span>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
        {[
          { label: "Bulk approve completed inspections", icon: CheckCircle2, action: onBulkApprove, highlight: true },
          { label: "Review oldest pending application", icon: Clock, action: () => onStageClick("new_application") },
          { label: "Review documents awaiting approval", icon: FileSearch, action: () => onStageClick("docs_review") },
          { label: "Check background check progress", icon: ShieldCheck, action: () => onStageClick("background_check") },
          { label: "Schedule vehicle inspections", icon: CarFront, action: () => onStageClick("inspection_scheduled") },
          { label: "Configure verification rules", icon: Shield, action: () => {} },
        ].map((action, i) => (
          <motion.button
            key={action.label}
            onClick={action.action}
            className="flex items-center gap-2.5 px-4 h-11 rounded-xl text-left transition-all group"
            style={{ background: action.highlight ? `${BRAND.green}08` : t.surface, border: `1px solid ${action.highlight ? `${BRAND.green}20` : t.borderSubtle}` }}
            initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 + i * 0.03 }}
            whileHover={{ x: 2 }}
          >
            <action.icon size={13} style={{ color: action.highlight ? BRAND.green : t.textMuted }} />
            <span style={{ ...TY.body, fontSize: "12px", color: t.text }}>{action.label}</span>
            <ChevronRight size={12} className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: t.textMuted }} />
          </motion.button>
        ))}
      </div>
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════
   ACTIVE ROSTER TAB
   ═══════════════════════════════════════════════════════════════ */
function RosterTab({ t, isDark, drivers, search, onSearchChange, statusFilter, onStatusFilterChange, vehicleFilter, onVehicleFilterChange, zoneFilter, onZoneFilterChange, zones, onSelectDriver, onExport, exportDone }: any) {
  return (
    <>
      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <div className="flex items-center gap-2 flex-1 min-w-[200px] h-9 px-3 rounded-lg" style={{ background: t.surface, border: `1px solid ${t.borderSubtle}` }}>
          <Search size={13} style={{ color: t.iconMuted }} />
          <input
            value={search} onChange={e => onSearchChange(e.target.value)}
            placeholder="Search name, phone, vehicle, zone..."
            className="flex-1 bg-transparent outline-none"
            style={{ color: t.text, ...TY.body, fontSize: "12px" }}
          />
        </div>
        <select value={statusFilter} onChange={e => onStatusFilterChange(e.target.value)} className="h-9 px-3 rounded-lg outline-none appearance-none" style={{ background: t.surface, border: `1px solid ${t.borderSubtle}`, color: t.text, ...TY.body, fontSize: "11px" }}>
          <option value="all">All statuses</option>
          {Object.entries(DRIVER_STATUS_META).filter(([k]) => k !== "suspended" && k !== "pending_review").map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
        </select>
        <select value={vehicleFilter} onChange={e => onVehicleFilterChange(e.target.value)} className="h-9 px-3 rounded-lg outline-none appearance-none" style={{ background: t.surface, border: `1px solid ${t.borderSubtle}`, color: t.text, ...TY.body, fontSize: "11px" }}>
          <option value="all">All vehicles</option>
          <option value="ev">EV only</option>
          <option value="gas">Gas only</option>
        </select>
        <select value={zoneFilter} onChange={e => onZoneFilterChange(e.target.value)} className="h-9 px-3 rounded-lg outline-none appearance-none" style={{ background: t.surface, border: `1px solid ${t.borderSubtle}`, color: t.text, ...TY.body, fontSize: "11px" }}>
          <option value="all">All zones</option>
          {zones.map((z: string) => <option key={z} value={z}>{z}</option>)}
        </select>
        <button onClick={onExport} className="h-9 px-3 rounded-lg flex items-center gap-1.5" style={{ background: t.surface, border: `1px solid ${t.borderSubtle}`, ...TY.body, fontSize: "11px", color: t.text }}>
          <Download size={12} />
          {exportDone ? "Downloaded!" : "Export CSV"}
        </button>
      </div>

      {/* Table */}
      <div className="rounded-2xl overflow-hidden" style={{ background: t.surfaceRaised, border: `1px solid ${t.borderSubtle}`, boxShadow: t.shadow }}>
        <div className="hidden lg:grid grid-cols-[1fr_120px_80px_80px_80px_80px_80px] gap-2 px-4 h-10 items-center" style={{ borderBottom: `1px solid ${t.borderSubtle}` }}>
          {["Driver", "Vehicle", "Rating", "Trips", "Completion", "Zone", "Status"].map(h => (
            <span key={h} style={{ ...TY.label, fontSize: "9px", color: t.textFaint, letterSpacing: "0.06em" }}>{h}</span>
          ))}
        </div>
        {drivers.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Users size={24} style={{ color: t.iconMuted, marginBottom: 8 }} />
            <span style={{ ...TY.body, fontSize: "13px", color: t.textMuted }}>No drivers match filters</span>
          </div>
        ) : (
          drivers.map((d: Driver, i: number) => {
            const statusMeta = DRIVER_STATUS_META[d.status];
            return (
              <motion.button
                key={d.id}
                onClick={() => onSelectDriver(d)}
                className="w-full grid grid-cols-1 lg:grid-cols-[1fr_120px_80px_80px_80px_80px_80px] gap-2 px-4 py-3 lg:h-14 items-center text-left transition-colors"
                style={{ borderBottom: `1px solid ${t.borderSubtle}` }}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.02 }}
                whileHover={{ backgroundColor: t.surfaceHover }}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0" style={{ background: `${statusMeta.color}14` }}>
                    <span style={{ ...TY.cap, fontSize: "10px", color: statusMeta.color }}>{d.name.split(" ").map(n => n[0]).join("")}</span>
                  </div>
                  <div className="min-w-0">
                    <span className="block truncate" style={{ ...TY.body, fontSize: "12px", color: t.text }}>{d.name}</span>
                    <span style={{ ...TY.bodyR, fontSize: "10px", color: t.textFaint }}>{d.phone}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="truncate" style={{ ...TY.bodyR, fontSize: "11px", color: t.textMuted }}>{d.vehicle.split(" ").slice(0, 2).join(" ")}</span>
                  {d.vehicleType === "ev" && <Zap size={10} style={{ color: BRAND.green }} />}
                </div>
                <span style={{ ...TY.body, fontSize: "12px", color: d.rating >= 4.8 ? BRAND.green : d.rating >= 4.5 ? t.text : STATUS.warning }}>★ {d.rating}</span>
                <span style={{ ...TY.body, fontSize: "12px", color: t.text }}>{d.totalTrips.toLocaleString()}</span>
                <span style={{ ...TY.body, fontSize: "12px", color: d.completionRate >= 95 ? BRAND.green : d.completionRate >= 90 ? t.text : STATUS.warning }}>{d.completionRate}%</span>
                <span className="truncate" style={{ ...TY.bodyR, fontSize: "10px", color: t.textMuted }}>{d.zone}</span>
                <StatusBadge label={statusMeta.label} color={statusMeta.color} />
              </motion.button>
            );
          })
        )}
      </div>
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SUSPENDED TAB
   ═══════════════════════════════════════════════════════════════ */
function SuspendedTab({ t, isDark, drivers, onSelectDriver, onReactivate }: any) {
  return (
    <>
      {drivers.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 rounded-2xl" style={{ background: t.surfaceRaised, border: `1px solid ${t.borderSubtle}` }}>
          <CheckCircle2 size={32} style={{ color: BRAND.green, marginBottom: 12 }} />
          <span style={{ ...TY.sub, fontSize: "14px", color: t.text }}>No suspended drivers</span>
          <span style={{ ...TY.bodyR, fontSize: "12px", color: t.textMuted }}>All drivers are in good standing</span>
        </div>
      ) : (
        <div className="space-y-3">
          {drivers.map((d: Driver, i: number) => (
            <motion.div
              key={d.id}
              className="rounded-2xl p-4"
              style={{ background: `${STATUS.error}04`, border: `1px solid ${STATUS.error}15`, boxShadow: t.shadow }}
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: `${STATUS.error}14` }}>
                    <span style={{ ...TY.cap, fontSize: "11px", color: STATUS.error }}>{d.name.split(" ").map((n: string) => n[0]).join("")}</span>
                  </div>
                  <div>
                    <span className="block" style={{ ...TY.body, fontSize: "13px", color: t.text }}>{d.name}</span>
                    <span style={{ ...TY.bodyR, fontSize: "10px", color: t.textMuted }}>{d.vehicle} · {d.zone}</span>
                  </div>
                </div>
                <StatusBadge label="Suspended" color={STATUS.error} />
              </div>
              <div className="rounded-lg p-3 mb-3" style={{ background: t.surface, border: `1px solid ${t.borderSubtle}` }}>
                <span className="block mb-1" style={{ ...TY.label, fontSize: "9px", color: t.textFaint, letterSpacing: "0.06em" }}>REASON</span>
                <span style={{ ...TY.bodyR, fontSize: "11px", color: t.textMuted }}>{d.suspendReason}</span>
              </div>
              <div className="flex items-center gap-4 mb-3">
                <div><span style={{ ...TY.bodyR, fontSize: "10px", color: t.textFaint }}>Rating</span><span className="block" style={{ ...TY.body, fontSize: "12px", color: t.text }}>★ {d.rating}</span></div>
                <div><span style={{ ...TY.bodyR, fontSize: "10px", color: t.textFaint }}>Trips</span><span className="block" style={{ ...TY.body, fontSize: "12px", color: t.text }}>{d.totalTrips}</span></div>
                <div><span style={{ ...TY.bodyR, fontSize: "10px", color: t.textFaint }}>Last active</span><span className="block" style={{ ...TY.body, fontSize: "12px", color: t.text }}>{d.lastActive}</span></div>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => onReactivate(d)} className="h-9 px-4 rounded-lg flex items-center gap-1.5" style={{ background: BRAND.green, color: "#fff", ...TY.body, fontSize: "11px" }}>
                  <RefreshCcw size={12} /> Reactivate
                </button>
                <button onClick={() => onSelectDriver(d)} className="h-9 px-4 rounded-lg flex items-center gap-1.5" style={{ background: t.surface, border: `1px solid ${t.borderSubtle}`, color: t.text, ...TY.body, fontSize: "11px" }}>
                  <Eye size={12} /> View Profile
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════
   PERFORMANCE TAB
   ═══════════════════════════════════════════════════════════════ */
function PerformanceTab({ t, isDark, drivers }: any) {
  const sorted = [...drivers].sort((a: Driver, b: Driver) => b.rating - a.rating);
  const avgRating = (drivers.reduce((s: number, d: Driver) => s + d.rating, 0) / drivers.length).toFixed(2);
  const avgCompletion = (drivers.reduce((s: number, d: Driver) => s + d.completionRate, 0) / drivers.length).toFixed(1);
  const totalTrips = drivers.reduce((s: number, d: Driver) => s + d.totalTrips, 0);
  const evDrivers = drivers.filter((d: Driver) => d.vehicleType === "ev").length;

  return (
    <>
      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {[
          { label: "Avg Rating", value: `★ ${avgRating}`, color: BRAND.green, source: "AVG(drivers.rating) WHERE status = active" },
          { label: "Avg Completion", value: `${avgCompletion}%`, color: Number(avgCompletion) >= 95 ? BRAND.green : STATUS.warning, source: "AVG(drivers.completion_rate)" },
          { label: "Total Trips (roster)", value: totalTrips.toLocaleString(), color: t.text, source: "SUM(drivers.total_trips) WHERE status = active" },
          { label: "EV Drivers", value: `${evDrivers}/${drivers.length}`, color: BRAND.green, source: "COUNT(drivers WHERE vehicle_type = ev)" },
        ].map((kpi, i) => (
          <motion.div key={kpi.label} className="p-4 rounded-2xl group relative" style={{ background: t.surfaceRaised, border: `1px solid ${t.borderSubtle}`, boxShadow: t.shadow }} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
            <span className="block" style={{ ...TY.h, fontSize: "22px", color: kpi.color }}>{kpi.value}</span>
            <span style={{ ...TY.bodyR, fontSize: "10px", color: t.textFaint }}>{kpi.label}</span>
            <div className="absolute bottom-1 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <span style={{ ...TY.cap, fontSize: "8px", color: t.textGhost }}>{kpi.source}</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Leaderboard */}
      <span className="block mb-3" style={{ ...TY.label, fontSize: "9px", color: t.textFaint, letterSpacing: "0.06em" }}>DRIVER LEADERBOARD — BY RATING</span>
      <div className="rounded-2xl overflow-hidden" style={{ background: t.surfaceRaised, border: `1px solid ${t.borderSubtle}`, boxShadow: t.shadow }}>
        {sorted.map((d: Driver, i: number) => (
          <motion.div
            key={d.id}
            className="flex items-center gap-4 px-4 h-14"
            style={{ borderBottom: `1px solid ${t.borderSubtle}` }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}
          >
            <span className="w-6 text-center" style={{ ...TY.h, fontSize: "14px", color: i < 3 ? BRAND.green : t.textFaint }}>
              {i + 1}
            </span>
            <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0" style={{ background: `${BRAND.green}10` }}>
              <span style={{ ...TY.cap, fontSize: "10px", color: BRAND.green }}>{d.name.split(" ").map((n: string) => n[0]).join("")}</span>
            </div>
            <div className="flex-1 min-w-0">
              <span className="block truncate" style={{ ...TY.body, fontSize: "12px", color: t.text }}>{d.name}</span>
              <span style={{ ...TY.bodyR, fontSize: "10px", color: t.textFaint }}>{d.zone} · {d.totalTrips} trips</span>
            </div>
            <span style={{ ...TY.body, fontSize: "13px", color: BRAND.green }}>★ {d.rating}</span>
            <div className="hidden md:flex items-center gap-3">
              <div className="text-right">
                <span className="block" style={{ ...TY.body, fontSize: "11px", color: t.text }}>{d.completionRate}%</span>
                <span style={{ ...TY.bodyR, fontSize: "9px", color: t.textFaint }}>completion</span>
              </div>
              <div className="text-right">
                <span className="block" style={{ ...TY.body, fontSize: "11px", color: t.text }}>{formatNaira(d.earnings)}</span>
                <span style={{ ...TY.bodyR, fontSize: "9px", color: t.textFaint }}>earnings</span>
              </div>
              {d.vehicleType === "ev" && <Zap size={12} style={{ color: BRAND.green }} />}
            </div>
          </motion.div>
        ))}
      </div>
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════
   DRIVER PROFILE (Drawer content)
   ═══════════════════════════════════════════════════════════════ */
function DriverProfile({ driver, t, onSuspend, onMessage, onApprove, onReject, onReactivate, onScheduleInspection }: {
  driver: Driver; t: any;
  onSuspend: () => void; onMessage: () => void;
  onApprove?: () => void; onReject?: () => void;
  onReactivate?: () => void; onScheduleInspection?: () => void;
}) {
  const statusMeta = DRIVER_STATUS_META[driver.status];
  const [profileTab, setProfileTab] = useState<"overview" | "documents" | "history">("overview");

  return (
    <div className="flex-1 overflow-y-auto">
      {/* Status + Avatar */}
      <div className="px-5 py-4" style={{ borderBottom: `1px solid ${t.borderSubtle}` }}>
        <div className="flex items-center gap-4 mb-3">
          <div className="w-14 h-14 rounded-full flex items-center justify-center" style={{ background: `${statusMeta.color}14` }}>
            <span style={{ ...TY.h, fontSize: "18px", color: statusMeta.color }}>{driver.name.split(" ").map(n => n[0]).join("")}</span>
          </div>
          <div>
            <span className="block" style={{ ...TY.sub, fontSize: "15px", color: t.text }}>{driver.name}</span>
            <div className="flex items-center gap-2 mt-1">
              <StatusBadge label={statusMeta.label} color={statusMeta.color} />
              {driver.vehicleType === "ev" && (
                <span className="flex items-center gap-0.5 h-5 px-2 rounded-full" style={{ background: `${BRAND.green}14`, color: BRAND.green, fontSize: "10px" }}>
                  <Zap size={9} /> EV
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="h-8 px-3 rounded-lg flex items-center gap-1.5" style={{ background: t.surface, border: `1px solid ${t.borderSubtle}`, ...TY.body, fontSize: "10px", color: t.text }}>
            <Phone size={11} /> Call
          </button>
          <button onClick={onMessage} className="h-8 px-3 rounded-lg flex items-center gap-1.5" style={{ background: t.surface, border: `1px solid ${t.borderSubtle}`, ...TY.body, fontSize: "10px", color: t.text }}>
            <MessageSquare size={11} /> Message
          </button>
          <button className="h-8 px-3 rounded-lg flex items-center gap-1.5" style={{ background: t.surface, border: `1px solid ${t.borderSubtle}`, ...TY.body, fontSize: "10px", color: t.text }}>
            <Mail size={11} /> Email
          </button>
        </div>
      </div>

      {/* Profile tabs */}
      <div className="flex items-center gap-1 px-5 pt-3 pb-2">
        {(["overview", "documents", "history"] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setProfileTab(tab)}
            className="px-3 h-7 rounded-md capitalize"
            style={{ background: profileTab === tab ? t.surfaceActive : "transparent", color: profileTab === tab ? t.text : t.textMuted, ...TY.body, fontSize: "11px" }}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="px-5 py-3 space-y-4">
        {profileTab === "overview" && (
          <>
            {/* Stats */}
            <div className="grid grid-cols-2 gap-2">
              {[
                { l: "Rating", v: `★ ${driver.rating}`, color: driver.rating >= 4.8 ? BRAND.green : t.text },
                { l: "Total Trips", v: driver.totalTrips.toLocaleString(), color: t.text },
                { l: "Completion", v: `${driver.completionRate}%`, color: driver.completionRate >= 95 ? BRAND.green : STATUS.warning },
                { l: "Cancel Rate", v: `${driver.cancelRate}%`, color: driver.cancelRate <= 5 ? t.text : STATUS.error },
                { l: "Earnings", v: formatNaira(driver.earnings), color: BRAND.green },
                { l: "Joined", v: driver.joinDate, color: t.text },
              ].map(s => (
                <div key={s.l} className="p-3 rounded-lg" style={{ background: t.surface, border: `1px solid ${t.borderSubtle}` }}>
                  <span className="block" style={{ ...TY.h, fontSize: "15px", color: s.color }}>{s.v}</span>
                  <span style={{ ...TY.bodyR, fontSize: "9px", color: t.textFaint }}>{s.l}</span>
                </div>
              ))}
            </div>

            {/* Vehicle */}
            <div className="rounded-xl p-4" style={{ background: t.surface, border: `1px solid ${t.borderSubtle}` }}>
              <span className="block mb-2" style={{ ...TY.label, fontSize: "9px", color: t.textFaint, letterSpacing: "0.06em" }}>VEHICLE</span>
              {[
                { l: "Vehicle", v: driver.vehicle },
                { l: "Plate", v: driver.plate },
                { l: "Type", v: driver.vehicleType === "ev" ? "Electric Vehicle" : "Gas" },
                { l: "Zone", v: driver.zone },
                { l: "Last active", v: driver.lastActive },
              ].map(r => (
                <div key={r.l} className="flex items-center justify-between py-1">
                  <span style={{ ...TY.bodyR, fontSize: "11px", color: t.textMuted }}>{r.l}</span>
                  <span style={{ ...TY.body, fontSize: "11px", color: t.text }}>{r.v}</span>
                </div>
              ))}
            </div>
          </>
        )}

        {profileTab === "documents" && (
          <div className="space-y-3">
            {[
              { name: "National ID (NIN)", ok: driver.documents.nin },
              { name: "Driver's License", ok: driver.documents.license },
              { name: "Vehicle Insurance", ok: driver.documents.insurance },
              { name: "Vehicle Registration", ok: driver.documents.vehicleReg },
            ].map(doc => (
              <div key={doc.name} className="flex items-center gap-3 p-3 rounded-xl" style={{ background: t.surface, border: `1px solid ${t.borderSubtle}` }}>
                <DocBadge ok={doc.ok} />
                <span className="flex-1" style={{ ...TY.body, fontSize: "12px", color: t.text }}>{doc.name}</span>
                <span style={{ ...TY.bodyR, fontSize: "10px", color: doc.ok ? BRAND.green : STATUS.error }}>{doc.ok ? "Verified" : "Missing"}</span>
              </div>
            ))}
          </div>
        )}

        {profileTab === "history" && (
          <div className="space-y-2">
            {[
              { event: "Completed trip #JT-48320", time: "2 min ago", type: "trip" },
              { event: "Came online", time: "45 min ago", type: "status" },
              { event: "Completed trip #JT-48298", time: "1h ago", type: "trip" },
              { event: "Completed trip #JT-48270", time: "2h ago", type: "trip" },
              { event: "Went offline", time: "Yesterday, 11:42 PM", type: "status" },
              { event: "Completed trip #JT-48190", time: "Yesterday, 10:18 PM", type: "trip" },
              { event: "Received payout — ₦18,400", time: "Yesterday, 6:00 AM", type: "payout" },
            ].map((ev, i) => (
              <div key={i} className="flex items-center gap-3 py-2">
                <div className="w-1.5 h-1.5 rounded-full" style={{ background: ev.type === "trip" ? BRAND.green : ev.type === "payout" ? STATUS.info : t.textMuted }} />
                <span className="flex-1" style={{ ...TY.bodyR, fontSize: "11px", color: t.text }}>{ev.event}</span>
                <span style={{ ...TY.bodyR, fontSize: "10px", color: t.textFaint }}>{ev.time}</span>
              </div>
            ))}
          </div>
        )}

        {/* Actions */}
        <div className="space-y-2 pt-3" style={{ borderTop: `1px solid ${t.borderSubtle}` }}>
          {onApprove && (
            <button onClick={onApprove} className="w-full h-10 rounded-xl flex items-center justify-center gap-2" style={{ background: BRAND.green, color: "#fff", ...TY.body, fontSize: "12px" }}>
              <CheckCircle2 size={13} /> Approve Driver
            </button>
          )}
          {onReject && (
            <button onClick={onReject} className="w-full h-10 rounded-xl flex items-center justify-center gap-2" style={{ background: `${STATUS.error}10`, border: `1px solid ${STATUS.error}20`, color: STATUS.error, ...TY.body, fontSize: "12px" }}>
              <XCircle size={13} /> Reject Application
            </button>
          )}
          {onReactivate && (
            <button onClick={onReactivate} className="w-full h-10 rounded-xl flex items-center justify-center gap-2" style={{ background: BRAND.green, color: "#fff", ...TY.body, fontSize: "12px" }}>
              <RefreshCcw size={13} /> Reactivate Driver
            </button>
          )}
          {onScheduleInspection && (
            <button onClick={onScheduleInspection} className="w-full h-10 rounded-xl flex items-center justify-center gap-2" style={{ background: `${STATUS.info}10`, border: `1px solid ${STATUS.info}20`, color: STATUS.info, ...TY.body, fontSize: "12px" }}>
              <Calendar size={13} /> Schedule Inspection
            </button>
          )}
          {driver.status !== "suspended" && driver.status !== "pending_review" && (
            <button onClick={onSuspend} className="w-full h-10 rounded-xl flex items-center justify-center gap-2" style={{ background: `${STATUS.error}08`, border: `1px solid ${STATUS.error}20`, color: STATUS.error, ...TY.body, fontSize: "12px" }}>
              <Ban size={13} /> Suspend Driver
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
