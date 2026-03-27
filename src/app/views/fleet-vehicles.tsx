/**
 * FLEET OWNER — VEHICLES TAB
 *
 * Master-detail layout mirroring fleet-drivers.tsx:
 *   Left: KPI strip + filter pills + search/sort toolbar + data table
 *   Right: inline detail drawer (380px desktop, slide-over mobile)
 *
 * Architecture: Linear filter bar + Stripe/Linear data table + Apple master-detail.
 * Data source: MOCK_VEHICLES from fleet-mock-data.tsx (vehicle_registry table)
 */

import { useState, useMemo, useCallback, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Car, Plus, Search, SlidersHorizontal, X, Zap,
  Wrench, Check, Shield,
  User, ArrowUpRight, Battery, MapPin,
  FileText, ArrowDown,
  CheckCircle, XCircle,
} from "lucide-react";
import { useAdminTheme, BRAND, TY, STATUS } from "../config/admin-theme";
import { MOCK_VEHICLES, type FleetVehicle } from "../config/fleet-mock-data";
import { DetailDrawer } from "../components/detail-drawer";
import { useFleetContext } from "./fleet-context";
import { Toast } from "../components/shared/toast";
import { ConfirmModal } from "../components/shared/confirm-modal";
import { AddVehicleSheet } from "../components/fleet/add-vehicle-sheet";
import { VehicleHistoryModal } from "../components/fleet/vehicle-history-modal";
import { ReassignDriverModal } from "../components/fleet/reassign-driver-modal";
import { MOCK_DRIVERS } from "../config/fleet-mock-data";
import { TableSkeleton } from "../components/shared/view-skeleton";
import { ErrorState } from "../components/shared/error-state";

// ─── Constants ──────────────────────────────────────────────────────────────
const STAGGER = 0.04;

type VehicleStatus = FleetVehicle["status"];
type FilterId = "all" | "active" | "ev" | "pending" | "maintenance" | "inactive";
type SortId = "name" | "plate" | "mileage" | "status";

// ─── Status helpers (data source: vehicle_registry.status) ──────────────────

function vehicleStatusColor(status: VehicleStatus): string {
  switch (status) {
    case "approved": return BRAND.green;
    case "maintenance": return STATUS.warning;
    case "inspection_scheduled":
    case "under_review":
    case "pending_docs":
    case "registered": return STATUS.info;
    case "suspended": return STATUS.error;
    case "deactivated": return "rgba(255,255,255,0.25)";
    default: return "rgba(255,255,255,0.25)";
  }
}

function vehicleStatusLabel(status: VehicleStatus): string {
  switch (status) {
    case "approved": return "Active";
    case "maintenance": return "Maintenance";
    case "inspection_scheduled": return "Inspection Scheduled";
    case "under_review": return "Under Review";
    case "pending_docs": return "Pending Docs";
    case "registered": return "Registered";
    case "suspended": return "Suspended";
    case "deactivated": return "Deactivated";
    default: return status;
  }
}

function matchesFilter(v: FleetVehicle, filter: FilterId): boolean {
  switch (filter) {
    case "all": return true;
    case "active": return v.status === "approved";
    case "ev": return v.type === "EV";
    case "pending": return ["registered", "pending_docs", "under_review", "inspection_scheduled"].includes(v.status);
    case "maintenance": return v.status === "maintenance";
    case "inactive": return v.status === "suspended" || v.status === "deactivated";
    default: return true;
  }
}

// ─── Formatting ─────────────────────────────────────────────────────────────
function fmtMileage(km?: number): string {
  if (!km) return "—";
  return km >= 1000 ? `${(km / 1000).toFixed(1)}k km` : `${km} km`;
}

// ─── Status Dot ─────────────────────────────────────────────────────────────
function StatusDot({ color, size = 6, pulse }: { color: string; size?: number; pulse?: boolean }) {
  return (
    <span className="relative flex shrink-0" style={{ width: size, height: size }}>
      {pulse && (
        <span
          className="absolute inset-0 rounded-full animate-ping"
          style={{ background: color, opacity: 0.3 }}
        />
      )}
      <span className="relative rounded-full w-full h-full block" style={{ background: color }} />
    </span>
  );
}

// ─── KPI Tile ───────────────────────────────────────────────────────────────
function KPITile({ label, value, color, active, onClick, delay }: {
  label: string; value: number; color: string; active: boolean;
  onClick: () => void; delay: number;
}) {
  const { t, theme } = useAdminTheme();
  const isDark = theme === "dark";
  return (
    <motion.button
      className="flex flex-col items-start px-3.5 py-2.5 rounded-xl shrink-0 transition-all min-w-[90px]"
      style={{
        background: active ? (isDark ? `${color}10` : `${color}06`) : t.surface,
        border: `1px solid ${active ? `${color}20` : t.borderSubtle}`,
      }}
      onClick={onClick}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      whileTap={{ scale: 0.97 }}
    >
      <span style={{ ...TY.h, fontSize: "18px", color: active ? color : t.text, lineHeight: "1.2" }}>{value}</span>
      <span style={{ ...TY.bodyR, fontSize: "10px", color: active ? color : t.textMuted, lineHeight: "1.5", whiteSpace: "nowrap" }}>{label}</span>
    </motion.button>
  );
}

// ─── Filter Pill ────────────────────────────────────────────────────────────
function FilterPill({ label, count, active, onClick }: {
  label: string; count: number; active: boolean; onClick: () => void;
}) {
  const { t } = useAdminTheme();
  return (
    <button
      className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg shrink-0 transition-all"
      style={{
        background: active ? `${BRAND.green}10` : "transparent",
        border: `1px solid ${active ? `${BRAND.green}18` : "transparent"}`,
      }}
      onClick={onClick}
    >
      <span style={{
        ...TY.body, fontSize: "11px",
        color: active ? BRAND.green : t.textSecondary,
        lineHeight: "1.4", letterSpacing: "-0.02em",
      }}>{label}</span>
      <span style={{
        ...TY.bodyR, fontSize: "9px",
        color: active ? BRAND.green : t.textFaint,
        lineHeight: "1.4",
      }}>{count}</span>
    </button>
  );
}

// ─── Sortable Column Header ─────────────────────────────────────────────────
function ColHeader({ label, sortKey, currentSort, onSort, align = "left" }: {
  label: string; sortKey: SortId; currentSort: SortId;
  onSort: (s: SortId) => void; align?: "left" | "right";
}) {
  const { t } = useAdminTheme();
  const active = currentSort === sortKey;
  return (
    <button
      className="flex items-center gap-1 transition-colors"
      style={{ justifyContent: align === "right" ? "flex-end" : "flex-start" }}
      onClick={() => onSort(sortKey)}
    >
      <span style={{
        ...TY.label, fontSize: "10px", letterSpacing: "0.04em", lineHeight: "1.4",
        color: active ? BRAND.green : t.textFaint,
      }}>{label}</span>
      {active && <ArrowDown size={9} style={{ color: BRAND.green }} />}
    </button>
  );
}

// ─── Status Badge ───────────────────────────────────────────────────────────
function VehicleStatusBadge({ status }: { status: VehicleStatus }) {
  const color = vehicleStatusColor(status);
  return (
    <div className="flex items-center gap-1.5">
      <StatusDot color={color} size={5} pulse={status === "approved"} />
      <span style={{ ...TY.bodyR, fontSize: "11px", color, lineHeight: "1.4" }}>
        {vehicleStatusLabel(status)}
      </span>
    </div>
  );
}

// ─── Type Badge (EV / Gas) ──────────────────────────────────────────────────
function TypeBadge({ type }: { type: "EV" | "Gas" }) {
  const isEV = type === "EV";
  return (
    <span
      className="inline-flex items-center gap-1 px-1.5 py-px rounded"
      style={{
        fontSize: "9px",
        background: isEV ? `${BRAND.green}10` : "rgba(255,255,255,0.04)",
        color: isEV ? BRAND.green : "rgba(255,255,255,0.45)",
        border: `1px solid ${isEV ? `${BRAND.green}15` : "rgba(255,255,255,0.06)"}`,
        fontFamily: "'Montserrat', sans-serif", fontWeight: 600,
        lineHeight: "1.2", letterSpacing: "0.02em",
      }}
    >
      {isEV && <Zap size={8} />}
      {type}
    </span>
  );
}

// ─── Battery Indicator (EV only) ────────────────────────────────────────────
function BatteryBar({ level }: { level: number }) {
  const barColor = level > 50 ? BRAND.green : level > 20 ? STATUS.warning : STATUS.error;
  return (
    <div className="flex items-center gap-1.5">
      <div className="w-8 h-2 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
        <div className="h-full rounded-full" style={{ width: `${level}%`, background: barColor }} />
      </div>
      <span style={{ ...TY.bodyR, fontSize: "9px", color: barColor, lineHeight: "1.4" }}>{level}%</span>
    </div>
  );
}

// ─── Vehicle Data Table ─────────────────────────────────────────────────────

function VehicleTable({ vehicles, selectedId, onSelect, sortBy, onSort }: {
  vehicles: FleetVehicle[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  sortBy: SortId;
  onSort: (s: SortId) => void;
}) {
  const { t, theme } = useAdminTheme();
  const isDark = theme === "dark";

  const thStyle: React.CSSProperties = {
    position: "sticky", top: 0, zIndex: 2,
    background: isDark ? "rgba(17,17,19,0.97)" : "rgba(255,255,255,0.97)",
    backdropFilter: "blur(8px)",
    padding: "8px 12px",
    borderBottom: `1px solid ${t.borderSubtle}`,
  };

  return (
    <table className="w-full" style={{ borderCollapse: "separate", borderSpacing: 0 }}>
      <thead>
        <tr>
          <th style={{ ...thStyle, textAlign: "left" }}>
            <ColHeader label="VEHICLE" sortKey="name" currentSort={sortBy} onSort={onSort} />
          </th>
          <th className="hidden sm:table-cell" style={{ ...thStyle, textAlign: "left" }}>
            <ColHeader label="PLATE" sortKey="plate" currentSort={sortBy} onSort={onSort} />
          </th>
          <th className="hidden md:table-cell" style={{ ...thStyle, textAlign: "left" }}>
            <span style={{ ...TY.label, fontSize: "10px", letterSpacing: "0.04em", lineHeight: "1.4", color: t.textFaint }}>TYPE</span>
          </th>
          <th className="hidden sm:table-cell" style={{ ...thStyle, textAlign: "left" }}>
            <span style={{ ...TY.label, fontSize: "10px", letterSpacing: "0.04em", lineHeight: "1.4", color: t.textFaint }}>STATUS</span>
          </th>
          <th className="hidden lg:table-cell" style={{ ...thStyle, textAlign: "left" }}>
            <span style={{ ...TY.label, fontSize: "10px", letterSpacing: "0.04em", lineHeight: "1.4", color: t.textFaint }}>DRIVER</span>
          </th>
          <th className="hidden md:table-cell" style={{ ...thStyle, textAlign: "right" }}>
            <ColHeader label="MILEAGE" sortKey="mileage" currentSort={sortBy} onSort={onSort} align="right" />
          </th>
        </tr>
      </thead>
      <tbody>
        {vehicles.map((v) => {
          const selected = selectedId === v.id;
          return (
            <tr
              key={v.id}
              className="transition-colors cursor-pointer"
              style={{
                background: selected
                  ? (isDark ? `${BRAND.green}08` : `${BRAND.green}04`)
                  : "transparent",
              }}
              onClick={() => onSelect(v.id)}
              onMouseEnter={e => { if (!selected) (e.currentTarget).style.background = t.surfaceHover; }}
              onMouseLeave={e => { if (!selected) (e.currentTarget).style.background = "transparent"; }}
            >
              {/* Vehicle name + type badge on mobile */}
              <td style={{ padding: "8px 12px", borderBottom: `1px solid ${t.borderSubtle}` }}>
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: t.surface, border: `1px solid ${t.borderSubtle}` }}>
                    {v.type === "EV" ? <Zap size={14} style={{ color: BRAND.green }} /> : <Car size={14} style={{ color: t.iconSecondary }} />}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="truncate" style={{ ...TY.body, fontSize: "12px", color: t.text, lineHeight: "1.4", letterSpacing: "-0.02em" }}>
                        {v.make} {v.model}
                      </span>
                      <span style={{ ...TY.bodyR, fontSize: "10px", color: t.textMuted, lineHeight: "1.4" }}>{v.year}</span>
                    </div>
                    {/* Mobile: show plate + status inline */}
                    <div className="flex items-center gap-2 sm:hidden mt-0.5">
                      <span style={{ ...TY.bodyR, fontSize: "10px", color: t.textFaint, lineHeight: "1.4", fontFamily: "monospace" }}>{v.plate}</span>
                      <StatusDot color={vehicleStatusColor(v.status)} size={5} />
                    </div>
                  </div>
                </div>
              </td>
              {/* Plate */}
              <td className="hidden sm:table-cell" style={{ padding: "8px 12px", borderBottom: `1px solid ${t.borderSubtle}` }}>
                <span style={{ ...TY.body, fontSize: "11px", color: t.textSecondary, lineHeight: "1.4", letterSpacing: "0.01em", fontFamily: "monospace" }}>
                  {v.plate}
                </span>
              </td>
              {/* Type */}
              <td className="hidden md:table-cell" style={{ padding: "8px 12px", borderBottom: `1px solid ${t.borderSubtle}` }}>
                <TypeBadge type={v.type} />
              </td>
              {/* Status */}
              <td className="hidden sm:table-cell" style={{ padding: "8px 12px", borderBottom: `1px solid ${t.borderSubtle}` }}>
                <VehicleStatusBadge status={v.status} />
              </td>
              {/* Assigned Driver */}
              <td className="hidden lg:table-cell" style={{ padding: "8px 12px", borderBottom: `1px solid ${t.borderSubtle}` }}>
                <span className="truncate block" style={{
                  ...TY.bodyR, fontSize: "11px",
                  color: v.assignedDriverName ? t.textSecondary : t.textFaint,
                  lineHeight: "1.4", maxWidth: 160,
                }}>
                  {v.assignedDriverName || "Unassigned"}
                </span>
              </td>
              {/* Mileage */}
              <td className="hidden md:table-cell" style={{ padding: "8px 12px", borderBottom: `1px solid ${t.borderSubtle}`, textAlign: "right" }}>
                <span style={{
                  ...TY.body, fontSize: "11px",
                  color: (v.mileage && v.mileage > 0) ? t.text : t.textFaint,
                  lineHeight: "1.4", letterSpacing: "-0.02em",
                }}>
                  {fmtMileage(v.mileage)}
                </span>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

// ─── Vehicle Detail Panel ───────────────────────────────────────────────────

function VehicleDetailPanel({ vehicle, onClose, onReassign, onDeactivate, onReactivate, onViewServiceHistory, onViewTripHistory, showToast }: {
  vehicle: FleetVehicle;
  onClose: () => void;
  onReassign: () => void;
  onDeactivate: () => void;
  onReactivate: () => void;
  onViewServiceHistory: () => void;
  onViewTripHistory: () => void;
  showToast: (msg: string, type?: "success" | "info" | "error") => void;
}) {
  const { t, theme } = useAdminTheme();
  const isDark = theme === "dark";
  const statusColor = vehicleStatusColor(vehicle.status);
  const isActive = vehicle.status === "approved";
  const isPending = ["registered", "pending_docs", "under_review", "inspection_scheduled"].includes(vehicle.status);

  const sectionStyle: React.CSSProperties = {
    borderTop: `1px solid ${t.borderSubtle}`,
    paddingTop: 16,
    marginTop: 16,
  };

  return (
    <motion.div
      className="h-full flex flex-col"
      initial={{ opacity: 0, x: 12 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 12 }}
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Drawer header */}
      <div className="flex items-center justify-between px-5 py-3 shrink-0" style={{ borderBottom: `1px solid ${t.borderSubtle}` }}>
        <span style={{ ...TY.sub, fontSize: "14px", color: t.text, lineHeight: "1.3" }}>Vehicle Details</span>
        <button onClick={onClose} className="p-1.5 rounded-lg transition-colors" style={{ background: t.surface, border: `1px solid ${t.borderSubtle}` }}>
          <X size={14} style={{ color: t.iconMuted }} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-5">
        {/* Vehicle Header */}
        <div className="flex items-start gap-3.5 mb-1">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0" style={{ background: t.surface, border: `1px solid ${t.borderSubtle}` }}>
            {vehicle.type === "EV"
              ? <Zap size={20} style={{ color: BRAND.green }} />
              : <Car size={20} style={{ color: t.iconSecondary }} />
            }
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="block" style={{ ...TY.sub, fontSize: "16px", color: t.text, lineHeight: "1.3", letterSpacing: "-0.02em" }}>
                {vehicle.make} {vehicle.model}
              </span>
              <TypeBadge type={vehicle.type} />
            </div>
            <div className="flex items-center gap-2 mt-1">
              <StatusDot color={statusColor} size={7} pulse={isActive} />
              <span style={{ ...TY.bodyR, fontSize: "11px", color: statusColor, lineHeight: "1.5" }}>
                {vehicleStatusLabel(vehicle.status)}
              </span>
            </div>
            <span style={{ ...TY.bodyR, fontSize: "10px", color: t.textFaint, lineHeight: "1.5" }}>
              {vehicle.plate} · {vehicle.year}{vehicle.color ? ` · ${vehicle.color}` : ""}
            </span>
          </div>
        </div>

        {/* EV Battery Status */}
        {vehicle.evData && (
          <div className="mt-4 p-3.5 rounded-xl" style={{ background: `${BRAND.green}06`, border: `1px solid ${BRAND.green}10` }}>
            <div className="flex items-center gap-2 mb-2.5">
              <Battery size={13} style={{ color: BRAND.green }} />
              <span style={{ ...TY.body, fontSize: "11px", color: BRAND.green, lineHeight: "1.4", letterSpacing: "-0.02em" }}>
                Battery Status
              </span>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <span className="block" style={{ ...TY.bodyR, fontSize: "9px", color: t.textFaint, lineHeight: "1.5" }}>Charge</span>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
                    <div className="h-full rounded-full" style={{
                      width: `${vehicle.evData.batteryLevel}%`,
                      background: vehicle.evData.batteryLevel > 50 ? BRAND.green : vehicle.evData.batteryLevel > 20 ? STATUS.warning : STATUS.error,
                    }} />
                  </div>
                  <span style={{ ...TY.h, fontSize: "14px", color: t.text, lineHeight: "1.2" }}>
                    {vehicle.evData.batteryLevel}%
                  </span>
                </div>
              </div>
              <div>
                <span className="block" style={{ ...TY.bodyR, fontSize: "9px", color: t.textFaint, lineHeight: "1.5" }}>Range</span>
                <span style={{ ...TY.h, fontSize: "14px", color: t.text, lineHeight: "1.2" }}>{vehicle.evData.range} km</span>
              </div>
              <div>
                <span className="block" style={{ ...TY.bodyR, fontSize: "9px", color: t.textFaint, lineHeight: "1.5" }}>Last Charged</span>
                <span style={{ ...TY.body, fontSize: "11px", color: t.textSecondary, lineHeight: "1.4", letterSpacing: "-0.02em" }}>{vehicle.evData.lastCharged}</span>
              </div>
            </div>
          </div>
        )}

        {/* Details */}
        <div style={sectionStyle}>
          <span className="block mb-3" style={{ ...TY.label, fontSize: "9px", color: t.textFaint, letterSpacing: "0.06em", lineHeight: "1.4" }}>
            DETAILS
          </span>
          <div className="space-y-2.5">
            {[
              { label: "Plate", value: vehicle.plate },
              ...(vehicle.vin ? [{ label: "VIN", value: vehicle.vin }] : []),
              ...(vehicle.color ? [{ label: "Color", value: vehicle.color }] : []),
              ...(vehicle.mileage !== undefined ? [{ label: "Mileage", value: fmtMileage(vehicle.mileage) }] : []),
              ...(vehicle.addedDate ? [{ label: "Added", value: vehicle.addedDate }] : []),
            ].map(row => (
              <div key={row.label} className="flex items-center justify-between">
                <span style={{ ...TY.bodyR, fontSize: "11px", color: t.textMuted, lineHeight: "1.4" }}>{row.label}</span>
                <span style={{ ...TY.body, fontSize: "11px", color: t.textSecondary, lineHeight: "1.4", letterSpacing: "-0.02em" }}>{row.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Compliance */}
        <div style={sectionStyle}>
          <span className="block mb-3" style={{ ...TY.label, fontSize: "9px", color: t.textFaint, letterSpacing: "0.06em", lineHeight: "1.4" }}>
            COMPLIANCE
          </span>
          <div className="space-y-2">
            {[
              { label: "Last Service", value: vehicle.lastService || "—", icon: Wrench, warn: false },
              { label: "Next Inspection", value: vehicle.nextInspection || "—", icon: Shield, warn: vehicle.nextInspection === "Overdue" },
              { label: "Insurance Expiry", value: vehicle.insuranceExpiry || "—", icon: FileText, warn: vehicle.insuranceExpiry === "Expired" },
            ].map(row => (
              <div key={row.label} className="flex items-center gap-3 p-2.5 rounded-xl" style={{
                background: row.warn ? `${STATUS.error}06` : t.surface,
                border: `1px solid ${row.warn ? `${STATUS.error}12` : t.borderSubtle}`,
              }}>
                <row.icon size={13} style={{ color: row.warn ? STATUS.error : t.iconSecondary, shrink: 0 }} />
                <div className="flex-1 min-w-0">
                  <span className="block" style={{ ...TY.bodyR, fontSize: "9px", color: t.textFaint, lineHeight: "1.5" }}>{row.label}</span>
                  <span style={{ ...TY.body, fontSize: "11px", color: row.warn ? STATUS.error : t.text, lineHeight: "1.4", letterSpacing: "-0.02em" }}>
                    {row.value}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Assigned Driver */}
        <div style={sectionStyle}>
          <span className="block mb-3" style={{ ...TY.label, fontSize: "9px", color: t.textFaint, letterSpacing: "0.06em", lineHeight: "1.4" }}>
            ASSIGNED DRIVER
          </span>
          {vehicle.assignedDriverName ? (
            <div className="p-3 rounded-xl flex items-center gap-3" style={{ background: t.surface, border: `1px solid ${t.borderSubtle}` }}>
              <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: t.surfaceRaised }}>
                <User size={14} style={{ color: t.iconMuted }} />
              </div>
              <span className="flex-1 truncate" style={{ ...TY.body, fontSize: "12px", color: t.text, lineHeight: "1.4", letterSpacing: "-0.02em" }}>
                {vehicle.assignedDriverName}
              </span>
            </div>
          ) : (
            <div className="p-3 rounded-xl flex items-center gap-2" style={{ background: `${STATUS.warning}06`, border: `1px solid ${STATUS.warning}10` }}>
              <User size={14} style={{ color: STATUS.warning }} />
              <span style={{ ...TY.bodyR, fontSize: "11px", color: STATUS.warning, lineHeight: "1.5" }}>No driver assigned</span>
            </div>
          )}
          <button
            className="mt-2.5 w-full py-2 rounded-xl flex items-center justify-center gap-2 transition-colors"
            style={{ background: t.surface, border: `1px solid ${t.borderSubtle}`, ...TY.body, fontSize: "11px", color: t.textSecondary, lineHeight: "1.4", letterSpacing: "-0.02em" }}
            onClick={onReassign}
          >
            <ArrowUpRight size={11} />
            {vehicle.assignedDriverName ? "Reassign Driver" : "Assign Driver"}
          </button>
        </div>

        {/* Verification (pending vehicles) */}
        {isPending && (
          <div style={sectionStyle}>
            <span className="block mb-3" style={{ ...TY.label, fontSize: "9px", color: t.textFaint, letterSpacing: "0.06em", lineHeight: "1.4" }}>
              VERIFICATION PROGRESS
            </span>
            <div className="p-4 rounded-xl" style={{ background: `${STATUS.info}06`, border: `1px solid ${STATUS.info}12` }}>
              <div className="flex items-center gap-2 mb-3">
                <Shield size={14} style={{ color: STATUS.info }} />
                <span style={{ ...TY.body, fontSize: "12px", color: STATUS.info, lineHeight: "1.4", letterSpacing: "-0.02em" }}>
                  {vehicleStatusLabel(vehicle.status)}
                </span>
              </div>
              <div className="space-y-2.5">
                {[
                  { label: "Registration", done: true },
                  { label: "Documents Upload", done: vehicle.status !== "pending_docs" && vehicle.status !== "registered" },
                  { label: "Admin Review", done: vehicle.status === "inspection_scheduled" },
                  { label: "Inspection", done: false },
                ].map(step => (
                  <div key={step.label} className="flex items-center gap-2">
                    {step.done
                      ? <CheckCircle size={12} style={{ color: BRAND.green }} />
                      : <div className="w-3 h-3 rounded-full" style={{ border: `1.5px solid ${t.textFaint}` }} />
                    }
                    <span style={{ ...TY.bodyR, fontSize: "11px", color: step.done ? BRAND.green : t.textMuted, lineHeight: "1.4" }}>
                      {step.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div style={sectionStyle}>
          <span className="block mb-3" style={{ ...TY.label, fontSize: "9px", color: t.textFaint, letterSpacing: "0.06em", lineHeight: "1.4" }}>
            ACTIONS
          </span>
          <div className="space-y-2">
            <button
              className="w-full p-3 rounded-xl flex items-center gap-3 transition-colors text-left"
              style={{ background: t.surface, border: `1px solid ${t.borderSubtle}` }}
              onClick={onViewServiceHistory}
              onMouseEnter={e => e.currentTarget.style.borderColor = `${BRAND.green}20`}
              onMouseLeave={e => e.currentTarget.style.borderColor = t.borderSubtle}
            >
              <Wrench size={14} style={{ color: t.iconSecondary }} />
              <div>
                <span className="block" style={{ ...TY.body, fontSize: "12px", color: t.text, lineHeight: "1.4", letterSpacing: "-0.02em" }}>
                  Service History
                </span>
                <span style={{ ...TY.bodyR, fontSize: "10px", color: t.textMuted, lineHeight: "1.5" }}>
                  Maintenance log, repairs, inspections
                </span>
              </div>
            </button>
            <button
              className="w-full p-3 rounded-xl flex items-center gap-3 transition-colors text-left"
              style={{ background: t.surface, border: `1px solid ${t.borderSubtle}` }}
              onClick={onViewTripHistory}
              onMouseEnter={e => e.currentTarget.style.borderColor = `${BRAND.green}20`}
              onMouseLeave={e => e.currentTarget.style.borderColor = t.borderSubtle}
            >
              <MapPin size={14} style={{ color: t.iconSecondary }} />
              <div>
                <span className="block" style={{ ...TY.body, fontSize: "12px", color: t.text, lineHeight: "1.4", letterSpacing: "-0.02em" }}>
                  Trip History
                </span>
                <span style={{ ...TY.bodyR, fontSize: "10px", color: t.textMuted, lineHeight: "1.5" }}>
                  All trips completed with this vehicle
                </span>
              </div>
            </button>
            {vehicle.status === "suspended" || vehicle.status === "deactivated" ? (
              <button
                className="w-full p-3 rounded-xl flex items-center gap-3 transition-colors text-left"
                style={{ background: `${BRAND.green}06`, border: `1px solid ${BRAND.green}10` }}
                onClick={onReactivate}
                onMouseEnter={e => e.currentTarget.style.borderColor = `${BRAND.green}25`}
                onMouseLeave={e => e.currentTarget.style.borderColor = `${BRAND.green}10`}
              >
                <Check size={14} style={{ color: BRAND.green }} />
                <div>
                  <span className="block" style={{ ...TY.body, fontSize: "12px", color: BRAND.green, lineHeight: "1.4", letterSpacing: "-0.02em" }}>
                    Reactivate Vehicle
                  </span>
                  <span style={{ ...TY.bodyR, fontSize: "10px", color: t.textMuted, lineHeight: "1.5" }}>
                    Restore to active fleet
                  </span>
                </div>
              </button>
            ) : (
              <button
                className="w-full p-3 rounded-xl flex items-center gap-3 transition-colors text-left"
                style={{ background: `${STATUS.error}04`, border: `1px solid ${STATUS.error}08` }}
                onClick={onDeactivate}
                onMouseEnter={e => e.currentTarget.style.borderColor = `${STATUS.error}25`}
                onMouseLeave={e => e.currentTarget.style.borderColor = `${STATUS.error}08`}
              >
                <XCircle size={14} style={{ color: STATUS.error }} />
                <div>
                  <span className="block" style={{ ...TY.body, fontSize: "12px", color: STATUS.error, lineHeight: "1.4", letterSpacing: "-0.02em" }}>
                    Deactivate Vehicle
                  </span>
                  <span style={{ ...TY.bodyR, fontSize: "10px", color: t.textMuted, lineHeight: "1.5" }}>
                    Remove from active fleet
                  </span>
                </div>
              </button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// Toast + ConfirmModal → shared components (see imports above)

// ═══════════════════════════════════════════════════════════════════════════
// MAIN: FLEET VEHICLES VIEW
// ═══════════════════════════════════════════════════════════════════════════

export function FleetVehicles() {
  const { t, theme } = useAdminTheme();
  const isDark = theme === "dark";
  const { deepLink, consumeDeepLink } = useFleetContext();

  // State
  const [filter, setFilter] = useState<FilterId>("all");
  const [sortBy, setSortBy] = useState<SortId>("name");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedVehicleId, setSelectedVehicleId] = useState<string | null>(null);
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showDeactivateModal, setShowDeactivateModal] = useState(false);
  const [showReactivateModal, setShowReactivateModal] = useState(false);
  const [showAddSheet, setShowAddSheet] = useState(false);
  const [showServiceHistory, setShowServiceHistory] = useState(false);
  const [showTripHistory, setShowTripHistory] = useState(false);
  const [showReassignDriver, setShowReassignDriver] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: "success" | "info" | "error" } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  const searchRef = useRef<HTMLInputElement>(null);
  const sortRef = useRef<HTMLDivElement>(null);

  const vehicles = MOCK_VEHICLES;

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  // Deep-link: auto-select vehicle from dashboard navigation
  useEffect(() => {
    if (deepLink && deepLink.entityType === "vehicle") {
      const exists = vehicles.some(v => v.id === deepLink.entityId);
      if (exists) {
        setSelectedVehicleId(deepLink.entityId);
        setFilter("all");
      }
      consumeDeepLink();
    }
  }, [deepLink, consumeDeepLink, vehicles]);

  const showToastFn = useCallback((msg: string, type: "success" | "info" | "error" = "info") => {
    setToast({ msg, type });
  }, []);

  // Counts (data source: COUNT(*) GROUP BY status from vehicle_registry)
  const counts = useMemo(() => {
    const c = { all: vehicles.length, active: 0, ev: 0, pending: 0, maintenance: 0, inactive: 0 };
    vehicles.forEach(v => {
      if (v.status === "approved") c.active++;
      if (v.type === "EV") c.ev++;
      if (["registered", "pending_docs", "under_review", "inspection_scheduled"].includes(v.status)) c.pending++;
      if (v.status === "maintenance") c.maintenance++;
      if (v.status === "suspended" || v.status === "deactivated") c.inactive++;
    });
    return c;
  }, [vehicles]);

  // Filter + Search + Sort
  const filteredVehicles = useMemo(() => {
    let list = vehicles.filter(v => matchesFilter(v, filter));
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(v =>
        `${v.make} ${v.model}`.toLowerCase().includes(q) ||
        v.plate.toLowerCase().includes(q) ||
        (v.assignedDriverName && v.assignedDriverName.toLowerCase().includes(q))
      );
    }
    list = [...list].sort((a, b) => {
      switch (sortBy) {
        case "name": return `${a.make} ${a.model}`.localeCompare(`${b.make} ${b.model}`);
        case "plate": return a.plate.localeCompare(b.plate);
        case "mileage": return (b.mileage || 0) - (a.mileage || 0);
        case "status": return a.status.localeCompare(b.status);
        default: return 0;
      }
    });
    return list;
  }, [vehicles, filter, searchQuery, sortBy]);

  const selectedVehicle = useMemo(
    () => vehicles.find(v => v.id === selectedVehicleId) || null,
    [vehicles, selectedVehicleId]
  );

  // Focus search on open
  useEffect(() => {
    if (showSearch) searchRef.current?.focus();
  }, [showSearch]);

  const sortOptions: { id: SortId; label: string }[] = [
    { id: "name", label: "Name" },
    { id: "plate", label: "Plate" },
    { id: "mileage", label: "Mileage" },
    { id: "status", label: "Status" },
  ];

  // Close sort dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (sortRef.current && !sortRef.current.contains(e.target as Node)) {
        setShowSortDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleFilterFromKPI = (f: FilterId) => {
    setFilter(f);
    setSelectedVehicleId(null);
  };

  const handleSelectVehicle = (id: string) => {
    setSelectedVehicleId(prev => prev === id ? null : id);
  };

  // ─── Render ──────────────────────────────────────────────────────────────

  if (isLoading) return <TableSkeleton />;
  if (isError) return <ErrorState onRetry={() => { setIsError(false); setIsLoading(true); setTimeout(() => setIsLoading(false), 500); }} />;

  return (
    <div className="h-full flex flex-col overflow-hidden relative">
      {/* Top Section: KPIs + Filters */}
      <div className="shrink-0 px-4 pt-4 pb-0 sm:px-5 sm:pt-5">
        {/* KPI Strip */}
        <div className="flex gap-2.5 mb-4 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
          <KPITile label="Total Vehicles" value={counts.all} color={t.textSecondary} active={filter === "all"} onClick={() => handleFilterFromKPI("all")} delay={0} />
          <KPITile label="Active" value={counts.active} color={BRAND.green} active={filter === "active"} onClick={() => handleFilterFromKPI("active")} delay={STAGGER} />
          <KPITile label="EV" value={counts.ev} color={BRAND.green} active={filter === "ev"} onClick={() => handleFilterFromKPI("ev")} delay={STAGGER * 2} />
          <KPITile label="Pending" value={counts.pending} color={STATUS.info} active={filter === "pending"} onClick={() => handleFilterFromKPI("pending")} delay={STAGGER * 3} />
          {counts.maintenance > 0 && (
            <KPITile label="Maintenance" value={counts.maintenance} color={STATUS.warning} active={filter === "maintenance"} onClick={() => handleFilterFromKPI("maintenance")} delay={STAGGER * 4} />
          )}
          {counts.inactive > 0 && (
            <KPITile label="Inactive" value={counts.inactive} color={STATUS.error} active={filter === "inactive"} onClick={() => handleFilterFromKPI("inactive")} delay={STAGGER * 5} />
          )}
        </div>

        {/* Filter bar + tools */}
        <div className="flex items-center gap-1 mb-3 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
          <div className="flex items-center gap-0.5 flex-1 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
            {(["all", "active", "ev", "pending", "maintenance", "inactive"] as FilterId[]).map(f => (
              <FilterPill
                key={f}
                label={f === "all" ? "All" : f === "ev" ? "EV" : f.charAt(0).toUpperCase() + f.slice(1)}
                count={counts[f]}
                active={filter === f}
                onClick={() => setFilter(f)}
              />
            ))}
          </div>

          {/* Search toggle */}
          <button
            className="p-2 rounded-lg shrink-0 transition-colors"
            style={{ background: showSearch ? `${BRAND.green}12` : "transparent", border: `1px solid ${showSearch ? `${BRAND.green}20` : "transparent"}` }}
            onClick={() => { setShowSearch(!showSearch); if (showSearch) setSearchQuery(""); }}
          >
            <Search size={14} style={{ color: showSearch ? BRAND.green : t.iconMuted }} />
          </button>

          {/* Sort */}
          <div className="relative" ref={sortRef}>
            <button
              className="p-2 rounded-lg shrink-0 transition-colors"
              style={{ background: showSortDropdown ? `${BRAND.green}12` : "transparent", border: `1px solid ${showSortDropdown ? `${BRAND.green}20` : "transparent"}` }}
              onClick={() => setShowSortDropdown(!showSortDropdown)}
            >
              <SlidersHorizontal size={14} style={{ color: showSortDropdown ? BRAND.green : t.iconMuted }} />
            </button>
            <AnimatePresence>
              {showSortDropdown && (
                <motion.div
                  className="absolute right-0 top-full mt-1 w-40 rounded-xl py-1 z-30"
                  style={{
                    background: isDark ? "rgba(22,22,24,0.97)" : "#fff",
                    border: `1px solid ${t.borderSubtle}`,
                    boxShadow: isDark ? "0 8px 32px rgba(0,0,0,0.5)" : "0 8px 32px rgba(0,0,0,0.12)",
                  }}
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                >
                  {sortOptions.map(opt => (
                    <button
                      key={opt.id}
                      className="w-full px-3.5 py-2 text-left flex items-center gap-2 transition-colors"
                      style={{ background: sortBy === opt.id ? t.greenBg : "transparent" }}
                      onClick={() => { setSortBy(opt.id); setShowSortDropdown(false); }}
                      onMouseEnter={e => { if (sortBy !== opt.id) e.currentTarget.style.background = t.surfaceHover; }}
                      onMouseLeave={e => { if (sortBy !== opt.id) e.currentTarget.style.background = "transparent"; }}
                    >
                      {sortBy === opt.id && <Check size={11} style={{ color: BRAND.green }} />}
                      <span style={{ ...TY.body, fontSize: "12px", color: sortBy === opt.id ? BRAND.green : t.textSecondary, lineHeight: "1.4", letterSpacing: "-0.02em" }}>
                        {opt.label}
                      </span>
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Add Vehicle — compact labeled button */}
          <button
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg shrink-0 transition-all"
            style={{
              background: BRAND.green,
              border: `1px solid ${BRAND.green}`,
              ...TY.body, fontSize: "11px", color: "#fff", lineHeight: "1.4", letterSpacing: "-0.02em",
            }}
            onClick={() => setShowAddSheet(true)}
            onMouseEnter={e => { e.currentTarget.style.opacity = "0.88"; }}
            onMouseLeave={e => { e.currentTarget.style.opacity = "1"; }}
          >
            <Plus size={12} />
            <span className="hidden sm:inline">Add Vehicle</span>
          </button>
        </div>

        {/* Search Input (animated) */}
        <AnimatePresence>
          {showSearch && (
            <motion.div
              className="mb-3"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="relative">
                <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: t.iconMuted }} />
                <input
                  ref={searchRef}
                  className="w-full pl-8 pr-8 py-2 rounded-xl outline-none"
                  style={{
                    background: t.surface,
                    border: `1px solid ${t.borderSubtle}`,
                    ...TY.bodyR, fontSize: "12px", color: t.text, lineHeight: "1.4",
                  }}
                  placeholder="Search by make, model, plate, or driver…"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <button
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 rounded-md"
                    onClick={() => setSearchQuery("")}
                  >
                    <X size={12} style={{ color: t.iconMuted }} />
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Content: Table + footer */}
      <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
          <div className="flex-1 overflow-y-auto" style={{ scrollbarWidth: "thin" }}>
            {filteredVehicles.length === 0 ? (
              <motion.div
                className="flex flex-col items-center justify-center py-16 px-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-3" style={{ background: t.surface, border: `1px solid ${t.borderSubtle}` }}>
                  <Search size={18} style={{ color: t.iconMuted }} />
                </div>
                <span className="block mb-1" style={{ ...TY.body, fontSize: "13px", color: t.textSecondary, lineHeight: "1.4", letterSpacing: "-0.02em" }}>
                  No vehicles match
                </span>
                <span className="block text-center mb-4" style={{ ...TY.bodyR, fontSize: "11px", color: t.textMuted, lineHeight: "1.5" }}>
                  Try a different filter or search term
                </span>
                <button
                  className="px-4 py-2 rounded-xl transition-colors"
                  style={{ background: t.surface, border: `1px solid ${t.borderSubtle}`, ...TY.body, fontSize: "12px", color: BRAND.green, lineHeight: "1.4", letterSpacing: "-0.02em" }}
                  onClick={() => { setFilter("all"); setSearchQuery(""); }}
                >
                  Clear Filters
                </button>
              </motion.div>
            ) : (
              <VehicleTable
                vehicles={filteredVehicles}
                selectedId={selectedVehicleId}
                onSelect={handleSelectVehicle}
                sortBy={sortBy}
                onSort={setSortBy}
              />
            )}
          </div>

          {/* Row count footer */}
          <div className="shrink-0 px-4 pb-3 sm:px-5 sm:pb-4 pt-2" style={{ borderTop: `1px solid ${t.borderSubtle}` }}>
            <div className="flex items-center justify-between px-1">
              <span style={{ ...TY.bodyR, fontSize: "11px", color: t.textFaint, lineHeight: "1.4" }}>
                {filteredVehicles.length === vehicles.length
                  ? `${vehicles.length} vehicles`
                  : `Showing ${filteredVehicles.length} of ${vehicles.length}`}
              </span>
              {filter !== "all" || searchQuery ? (
                <button
                  className="transition-colors"
                  style={{ ...TY.bodyR, fontSize: "11px", color: BRAND.green, lineHeight: "1.4" }}
                  onClick={() => { setFilter("all"); setSearchQuery(""); }}
                >
                  Clear filters
                </button>
              ) : null}
            </div>
          </div>
      </div>

      {/* Detail Drawer — absolute overlay, not in flex flow */}
      <DetailDrawer open={!!selectedVehicle} onClose={() => setSelectedVehicleId(null)}>
        {selectedVehicle && (
          <VehicleDetailPanel
            vehicle={selectedVehicle}
            onClose={() => setSelectedVehicleId(null)}
            onReassign={() => setShowReassignDriver(true)}
            onDeactivate={() => setShowDeactivateModal(true)}
            onReactivate={() => setShowReactivateModal(true)}
            onViewServiceHistory={() => setShowServiceHistory(true)}
            onViewTripHistory={() => setShowTripHistory(true)}
            showToast={showToastFn}
          />
        )}
      </DetailDrawer>

      {/* Modals */}
      <AnimatePresence>
        {showDeactivateModal && selectedVehicle && (
          <ConfirmModal
            title="Deactivate Vehicle"
            message={`${selectedVehicle.make} ${selectedVehicle.model} (${selectedVehicle.plate}) will be removed from active fleet. ${selectedVehicle.assignedDriverName ? `${selectedVehicle.assignedDriverName} will be unassigned.` : ""}`}
            confirmLabel="Deactivate"
            destructive
            onConfirm={() => {
              setShowDeactivateModal(false);
              showToastFn(`${selectedVehicle.plate} has been deactivated`, "success");
            }}
            onCancel={() => setShowDeactivateModal(false)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showReactivateModal && selectedVehicle && (
          <ConfirmModal
            title="Reactivate Vehicle"
            message={`${selectedVehicle.make} ${selectedVehicle.model} (${selectedVehicle.plate}) will be restored to the active fleet.`}
            confirmLabel="Reactivate"
            onConfirm={() => {
              setShowReactivateModal(false);
              showToastFn(`${selectedVehicle.plate} has been reactivated`, "success");
            }}
            onCancel={() => setShowReactivateModal(false)}
          />
        )}
      </AnimatePresence>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <Toast
            message={toast.msg}
            type={toast.type}
            onDismiss={() => setToast(null)}
          />
        )}
      </AnimatePresence>

      {/* Add Vehicle Sheet */}
      <AnimatePresence>
        {showAddSheet && (
          <AddVehicleSheet
            onClose={() => setShowAddSheet(false)}
            onAdd={(make, plate) => {
              setShowAddSheet(false);
              showToastFn(`${make} (${plate}) added to fleet`, "success");
            }}
          />
        )}
      </AnimatePresence>

      {/* Vehicle History (Service / Trip) */}
      <AnimatePresence>
        {(showServiceHistory || showTripHistory) && selectedVehicle && (
          <VehicleHistoryModal
            vehicle={selectedVehicle}
            initialTab={showTripHistory ? "trips" : "service"}
            onClose={() => { setShowServiceHistory(false); setShowTripHistory(false); }}
          />
        )}
      </AnimatePresence>

      {/* Reassign Driver */}
      <AnimatePresence>
        {showReassignDriver && selectedVehicle && (
          <ReassignDriverModal
            vehicle={selectedVehicle}
            drivers={MOCK_DRIVERS}
            onAssign={(driverId) => {
              setShowReassignDriver(false);
              const d = MOCK_DRIVERS.find(dr => dr.id === driverId);
              showToastFn(`${d?.name || "Driver"} assigned to ${selectedVehicle.plate}`, "success");
            }}
            onClose={() => setShowReassignDriver(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}