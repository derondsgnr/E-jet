/**
 * JET ADMIN — FLEET SURFACE (E2E)
 *
 * Surfaces wired:
 *   Row click → SIDE DRAWER (fleet summary + actions)
 *   Driver Roster → inner SIDE DRAWER (fleet's drivers with status, rating)
 *   Vehicle Registry → inner SIDE DRAWER (vehicles with EV/gas, maintenance)
 *   Payouts → inner SIDE DRAWER (payout history, trigger payout)
 *   Full Profile → inner SIDE DRAWER (expanded fleet profile)
 *   Contact Owner → inner SIDE DRAWER (message compose)
 *   Suspend Fleet → CENTER MODAL (destructive, persistent)
 *   Adjust Commission → CENTER MODAL (financial impact)
 *
 * Layout: KPI strip → pipeline tabs → sortable table → drawer
 * Pattern: Stripe Connect, Uber fleet management
 */

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Truck, Search, Car, Users, MapPin, Phone, Mail,
  AlertTriangle, CheckCircle2, Clock, Zap, Activity,
  ChevronDown, ChevronRight, ExternalLink, X, Ban, RefreshCcw,
  Wallet, Wrench, Shield, Star, BarChart3, Gauge,
  Plus, Send, MessageSquare, Percent, DollarSign,
  ArrowUpRight, ArrowDownRight, UserCheck, UserX,
  Fuel, Battery, Calendar, Receipt,
} from "lucide-react";
import { useAdminTheme, TY, BRAND, STATUS } from "../../../config/admin-theme";
import { AdminModal, AdminDrawer, ModalHeader, ModalFooter, SurfaceButton } from "../ui/surfaces";

/* ═══ Types ═══ */
type FleetStage = "onboarding" | "verification" | "active" | "probation" | "suspended";
type DriverStatus = "active" | "offline" | "on_trip" | "suspended" | "pending";
type VehicleStatus = "active" | "maintenance" | "inspection_due" | "decommissioned";
type PayoutStatus = "completed" | "pending" | "failed" | "processing";

const STAGE_META: Record<FleetStage, { label: string; color: string }> = {
  onboarding: { label: "Onboarding", color: STATUS.info },
  verification: { label: "Verification", color: "#8B5CF6" },
  active: { label: "Active", color: BRAND.green },
  probation: { label: "Probation", color: STATUS.warning },
  suspended: { label: "Suspended", color: STATUS.error },
};

const DRIVER_STATUS: Record<DriverStatus, { label: string; color: string }> = {
  active: { label: "Online", color: BRAND.green },
  on_trip: { label: "On Trip", color: STATUS.info },
  offline: { label: "Offline", color: "#737373" },
  suspended: { label: "Suspended", color: STATUS.error },
  pending: { label: "Pending", color: STATUS.warning },
};

const VEHICLE_STATUS: Record<VehicleStatus, { label: string; color: string }> = {
  active: { label: "Active", color: BRAND.green },
  maintenance: { label: "Maintenance", color: STATUS.warning },
  inspection_due: { label: "Inspection Due", color: STATUS.error },
  decommissioned: { label: "Decommissioned", color: "#737373" },
};

const PAYOUT_STATUS: Record<PayoutStatus, { label: string; color: string }> = {
  completed: { label: "Completed", color: BRAND.green },
  pending: { label: "Pending", color: STATUS.warning },
  processing: { label: "Processing", color: STATUS.info },
  failed: { label: "Failed", color: STATUS.error },
};

interface FleetDriver {
  id: string;
  name: string;
  phone: string;
  status: DriverStatus;
  rating: number;
  trips: number;
  completionRate: number;
  vehicle: string;
  isEV: boolean;
  joinDate: string;
  lastActive: string;
}

interface FleetVehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  plate: string;
  type: "ev" | "gas";
  status: VehicleStatus;
  assignedDriver: string | null;
  mileage: number;
  lastService: string;
  nextService: string;
  trips: number;
}

interface FleetPayout {
  id: string;
  period: string;
  amount: number;
  commission: number;
  trips: number;
  status: PayoutStatus;
  processedDate: string;
  method: string;
}

interface Fleet {
  id: string;
  name: string;
  ownerName: string;
  ownerPhone: string;
  ownerEmail: string;
  city: string;
  stage: FleetStage;
  totalDrivers: number;
  activeDrivers: number;
  totalVehicles: number;
  evVehicles: number;
  gasVehicles: number;
  maintenanceDue: number;
  commission: number;
  monthlyEarnings: number;
  monthlyPayout: number;
  pendingPayout: number;
  completionRate: number;
  avgRating: number;
  totalTrips: number;
  joinDate: string;
  lastPayout: string;
  utilization: number;
  drivers: FleetDriver[];
  vehicles: FleetVehicle[];
  payouts: FleetPayout[];
}

const mkDrivers = (count: number, active: number): FleetDriver[] => {
  const names = ["Chidi Emeka", "Amara Nwosu", "Tolu Bakare", "Efe Okoro", "Kunle Adeyemi", "Bala Musa", "Yemi Alade", "Obinna Eze", "Segun Olatunji", "Femi Adeleke", "Hassan Garba", "Victor Okafor", "Sunday Edoho", "Musa Adamu", "Chibueze Nwankwo"];
  const vehicles = ["Toyota Corolla 2024", "Hyundai Ioniq 5", "Toyota Camry 2023", "Nissan Leaf", "Honda Civic 2024", "BYD Atto 3", "Toyota Corolla 2023", "Hyundai Elantra 2024"];
  return Array.from({ length: Math.min(count, 15) }, (_, i) => {
    const isActive = i < active;
    const statuses: DriverStatus[] = isActive ? ["active", "on_trip", "active"] : ["offline", "suspended", "pending"];
    return {
      id: `DRV-${String(100 + i).padStart(4, "0")}`,
      name: names[i % names.length],
      phone: `+234 80${i} ${String(100 + i * 11).slice(0, 3)} ${String(2000 + i * 37).slice(0, 4)}`,
      status: statuses[i % statuses.length],
      rating: 3.8 + Math.random() * 1.1,
      trips: Math.round(100 + Math.random() * 400),
      completionRate: 88 + Math.random() * 11,
      vehicle: vehicles[i % vehicles.length],
      isEV: i % 3 === 1,
      joinDate: `2025-${String(3 + (i % 10)).padStart(2, "0")}-${String(5 + (i % 20)).padStart(2, "0")}`,
      lastActive: isActive ? ["5m ago", "Now", "20m ago", "1h ago"][i % 4] : ["2d ago", "1w ago", "—"][i % 3],
    };
  });
};

const mkVehicles = (total: number, ev: number): FleetVehicle[] => {
  const makes = [
    { make: "Toyota", model: "Corolla", year: 2024, type: "gas" as const },
    { make: "Hyundai", model: "Ioniq 5", year: 2024, type: "ev" as const },
    { make: "Toyota", model: "Camry", year: 2023, type: "gas" as const },
    { make: "Nissan", model: "Leaf", year: 2023, type: "ev" as const },
    { make: "Honda", model: "Civic", year: 2024, type: "gas" as const },
    { make: "BYD", model: "Atto 3", year: 2024, type: "ev" as const },
    { make: "Toyota", model: "RAV4", year: 2023, type: "gas" as const },
    { make: "Hyundai", model: "Elantra", year: 2024, type: "gas" as const },
  ];
  return Array.from({ length: Math.min(total, 15) }, (_, i) => {
    const m = makes[i % makes.length];
    const isEV = i < ev;
    const statuses: VehicleStatus[] = ["active", "active", "active", "maintenance", "inspection_due"];
    return {
      id: `VEH-${String(200 + i).padStart(4, "0")}`,
      make: isEV ? ["Hyundai", "Nissan", "BYD"][i % 3] : m.make,
      model: isEV ? ["Ioniq 5", "Leaf", "Atto 3"][i % 3] : m.model,
      year: m.year,
      plate: `LG-${String(100 + i * 7)}${["AA", "BB", "CC", "DD"][i % 4]}`,
      type: isEV ? "ev" : "gas",
      status: statuses[i % statuses.length],
      assignedDriver: i < total - 2 ? `DRV-${String(100 + i).padStart(4, "0")}` : null,
      mileage: 12000 + Math.round(Math.random() * 40000),
      lastService: `${["Jan", "Feb", "Mar"][i % 3]} 2026`,
      nextService: `${["Apr", "May", "Jun"][i % 3]} 2026`,
      trips: Math.round(200 + Math.random() * 800),
    };
  });
};

const mkPayouts = (monthly: number): FleetPayout[] => {
  if (monthly === 0) return [];
  return ["Mar 2026", "Feb 2026", "Jan 2026", "Dec 2025", "Nov 2025"].map((period, i) => {
    const variance = 0.85 + Math.random() * 0.3;
    const amt = Math.round(monthly * variance);
    const comm = Math.round(amt * 0.15 / 0.85);
    return {
      id: `PAY-${String(3000 + i * 100)}`,
      period, amount: amt, commission: comm,
      trips: Math.round(200 + Math.random() * 300),
      status: (i === 0 ? "pending" : "completed") as PayoutStatus,
      processedDate: i === 0 ? "—" : `${period.split(" ")[0]} 28`,
      method: "Bank transfer · GTBank",
    };
  });
};

const FLEETS: Fleet[] = [
  { id: "FLT-001", name: "Greenfield Motors", ownerName: "Alhaji Sanni Bello", ownerPhone: "+234 801 111 2222", ownerEmail: "sanni@greenfieldng.com", city: "Lagos", stage: "active", totalDrivers: 48, activeDrivers: 41, totalVehicles: 52, evVehicles: 18, gasVehicles: 34, maintenanceDue: 3, commission: 15, monthlyEarnings: 8_420_000, monthlyPayout: 7_157_000, pendingPayout: 2_840_000, completionRate: 96.4, avgRating: 4.7, totalTrips: 14_200, joinDate: "2025-02-15", lastPayout: "3d ago", utilization: 79, drivers: mkDrivers(48, 41), vehicles: mkVehicles(52, 18), payouts: mkPayouts(7_157_000) },
  { id: "FLT-002", name: "Swift Ride Fleet", ownerName: "Chief Emeka Okafor", ownerPhone: "+234 802 222 3333", ownerEmail: "emeka@swiftride.com", city: "Lagos", stage: "active", totalDrivers: 32, activeDrivers: 28, totalVehicles: 35, evVehicles: 12, gasVehicles: 23, maintenanceDue: 1, commission: 15, monthlyEarnings: 5_680_000, monthlyPayout: 4_828_000, pendingPayout: 0, completionRate: 94.8, avgRating: 4.5, totalTrips: 9_800, joinDate: "2025-04-10", lastPayout: "1d ago", utilization: 80, drivers: mkDrivers(32, 28), vehicles: mkVehicles(35, 12), payouts: mkPayouts(4_828_000) },
  { id: "FLT-003", name: "Abuja Premium Cars", ownerName: "Hajiya Amina Yusuf", ownerPhone: "+234 803 333 4444", ownerEmail: "amina@abujapremium.com", city: "Abuja", stage: "active", totalDrivers: 24, activeDrivers: 20, totalVehicles: 28, evVehicles: 8, gasVehicles: 20, maintenanceDue: 2, commission: 15, monthlyEarnings: 4_120_000, monthlyPayout: 3_502_000, pendingPayout: 1_200_000, completionRate: 95.2, avgRating: 4.6, totalTrips: 6_400, joinDate: "2025-05-22", lastPayout: "5d ago", utilization: 71, drivers: mkDrivers(24, 20), vehicles: mkVehicles(28, 8), payouts: mkPayouts(3_502_000) },
  { id: "FLT-004", name: "Lagos Express Fleet", ownerName: "Tunde Adewale", ownerPhone: "+234 804 444 5555", ownerEmail: "tunde@lagosxpress.com", city: "Lagos", stage: "probation", totalDrivers: 18, activeDrivers: 12, totalVehicles: 20, evVehicles: 2, gasVehicles: 18, maintenanceDue: 5, commission: 15, monthlyEarnings: 2_340_000, monthlyPayout: 1_989_000, pendingPayout: 1_989_000, completionRate: 87.3, avgRating: 3.9, totalTrips: 4_100, joinDate: "2025-07-18", lastPayout: "12d ago", utilization: 60, drivers: mkDrivers(18, 12), vehicles: mkVehicles(20, 2), payouts: mkPayouts(1_989_000) },
  { id: "FLT-005", name: "PH Mobility", ownerName: "Chibuike Nnaji", ownerPhone: "+234 805 555 6666", ownerEmail: "chibuike@phmobility.com", city: "Port Harcourt", stage: "active", totalDrivers: 14, activeDrivers: 11, totalVehicles: 16, evVehicles: 4, gasVehicles: 12, maintenanceDue: 0, commission: 15, monthlyEarnings: 1_890_000, monthlyPayout: 1_606_500, pendingPayout: 0, completionRate: 93.8, avgRating: 4.4, totalTrips: 2_800, joinDate: "2025-09-05", lastPayout: "2d ago", utilization: 69, drivers: mkDrivers(14, 11), vehicles: mkVehicles(16, 4), payouts: mkPayouts(1_606_500) },
  { id: "FLT-006", name: "Kano City Rides", ownerName: "Malam Garba Shehu", ownerPhone: "+234 806 666 7777", ownerEmail: "garba@kanocity.com", city: "Kano", stage: "verification", totalDrivers: 8, activeDrivers: 0, totalVehicles: 10, evVehicles: 0, gasVehicles: 10, maintenanceDue: 0, commission: 15, monthlyEarnings: 0, monthlyPayout: 0, pendingPayout: 0, completionRate: 0, avgRating: 0, totalTrips: 0, joinDate: "2026-02-28", lastPayout: "—", utilization: 0, drivers: mkDrivers(8, 0), vehicles: mkVehicles(10, 0), payouts: [] },
  { id: "FLT-007", name: "EcoRide Nigeria", ownerName: "Dr. Folake Aina", ownerPhone: "+234 807 777 8888", ownerEmail: "folake@ecoride.ng", city: "Lagos", stage: "onboarding", totalDrivers: 0, activeDrivers: 0, totalVehicles: 0, evVehicles: 0, gasVehicles: 0, maintenanceDue: 0, commission: 15, monthlyEarnings: 0, monthlyPayout: 0, pendingPayout: 0, completionRate: 0, avgRating: 0, totalTrips: 0, joinDate: "2026-03-12", lastPayout: "—", utilization: 0, drivers: [], vehicles: [], payouts: [] },
  { id: "FLT-008", name: "Delta Rides Co", ownerName: "Oghene Akpor", ownerPhone: "+234 808 888 9999", ownerEmail: "oghene@deltaridesng.com", city: "Lagos", stage: "suspended", totalDrivers: 6, activeDrivers: 0, totalVehicles: 8, evVehicles: 0, gasVehicles: 8, maintenanceDue: 4, commission: 15, monthlyEarnings: 0, monthlyPayout: 0, pendingPayout: 680_000, completionRate: 72.1, avgRating: 3.2, totalTrips: 1_200, joinDate: "2025-08-14", lastPayout: "32d ago", utilization: 0, drivers: mkDrivers(6, 0), vehicles: mkVehicles(8, 0), payouts: mkPayouts(0) },
];

const formatNaira = (v: number) => {
  if (v >= 1_000_000) return `₦${(v / 1_000_000).toFixed(1)}M`;
  if (v >= 1_000) return `₦${(v / 1_000).toFixed(0)}k`;
  return `₦${v.toLocaleString()}`;
};

const FLEET_KPI = {
  totalFleets: FLEETS.length,
  totalDrivers: FLEETS.reduce((a, f) => a + f.totalDrivers, 0),
  activeDrivers: FLEETS.reduce((a, f) => a + f.activeDrivers, 0),
  totalVehicles: FLEETS.reduce((a, f) => a + f.totalVehicles, 0),
  evVehicles: FLEETS.reduce((a, f) => a + f.evVehicles, 0),
  pendingPayouts: FLEETS.reduce((a, f) => a + f.pendingPayout, 0),
  maintenanceDue: FLEETS.reduce((a, f) => a + f.maintenanceDue, 0),
};

/* ═══════════════════════════════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════════════════════════════ */

export function AdminFleetPage() {
  const { theme, t } = useAdminTheme();
  const isDark = theme === "dark";

  const [search, setSearch] = useState("");
  const [stageFilter, setStageFilter] = useState<FleetStage | "all">("all");
  const [selectedFleet, setSelectedFleet] = useState<Fleet | null>(null);

  // Sub-surface states
  const [showSuspendModal, setShowSuspendModal] = useState(false);
  const [showCommissionModal, setShowCommissionModal] = useState(false);
  const [showPayoutModal, setShowPayoutModal] = useState(false);
  const [subDrawer, setSubDrawer] = useState<"drivers" | "vehicles" | "payouts" | "contact" | "profile" | null>(null);
  const [suspendReason, setSuspendReason] = useState("");
  const [newCommission, setNewCommission] = useState("");

  const filtered = useMemo(() => {
    let list = [...FLEETS];
    if (stageFilter !== "all") list = list.filter(f => f.stage === stageFilter);
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(f => f.name.toLowerCase().includes(q) || f.ownerName.toLowerCase().includes(q) || f.id.toLowerCase().includes(q) || f.city.toLowerCase().includes(q));
    }
    return list;
  }, [stageFilter, search]);

  const openSub = (drawer: typeof subDrawer) => setSubDrawer(drawer);
  const closeSub = () => setSubDrawer(null);

  return (
    <div className="flex h-full overflow-hidden">
      <div className={`flex-1 flex flex-col overflow-hidden ${selectedFleet ? "hidden md:flex" : "flex"}`}>
        {/* ─── KPI + Pipeline Strip ─── */}
        <div className="shrink-0 px-4 py-3 overflow-x-auto" style={{ borderBottom: `1px solid ${t.borderSubtle}` }}>
          <div className="flex items-center gap-4 mb-3">
            {[
              { label: "Drivers", value: `${FLEET_KPI.activeDrivers}/${FLEET_KPI.totalDrivers}`, color: BRAND.green, source: "drivers.fleet.active/total" },
              { label: "Vehicles", value: FLEET_KPI.totalVehicles.toString(), color: t.text, source: "vehicles.count" },
              { label: "EV Mix", value: `${Math.round((FLEET_KPI.evVehicles / FLEET_KPI.totalVehicles) * 100)}%`, color: BRAND.green, source: "vehicles.type=ev/total" },
              { label: "Pending Payouts", value: formatNaira(FLEET_KPI.pendingPayouts), color: FLEET_KPI.pendingPayouts > 0 ? STATUS.warning : t.textFaint, source: "payouts.status=pending.sum" },
              { label: "Maint Due", value: FLEET_KPI.maintenanceDue.toString(), color: FLEET_KPI.maintenanceDue > 0 ? STATUS.warning : t.textFaint, source: "vehicles.maintenance_due.count" },
            ].map((kpi, i) => (
              <div key={kpi.label} className="flex items-baseline gap-1 shrink-0 pr-4 group relative" style={{ borderRight: i < 4 ? `1px solid ${t.borderSubtle}` : "none" }}>
                <span style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 600, fontSize: "14px", letterSpacing: "-0.03em", color: kpi.color }}>{kpi.value}</span>
                <span style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 400, fontSize: "9px", color: t.textFaint }}>{kpi.label}</span>
                <div className="absolute -bottom-3 right-0 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span style={{ fontFamily: "'Manrope', sans-serif", fontSize: "7px", color: t.textGhost }}>{kpi.source}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-1">
            {(["all", "onboarding", "verification", "active", "probation", "suspended"] as const).map(s => {
              const active = stageFilter === s;
              const meta = s !== "all" ? STAGE_META[s] : null;
              const count = s === "all" ? FLEETS.length : FLEETS.filter(f => f.stage === s).length;
              return (
                <button key={s} className="flex items-center gap-1 h-7 px-2.5 rounded-md transition-all" style={{ background: active ? (meta ? `${meta.color}12` : (isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)")) : "transparent", border: `1px solid ${active ? (meta ? `${meta.color}25` : t.borderStrong) : "transparent"}` }}
                  onClick={() => setStageFilter(s)}>
                  {meta && <span className="w-1.5 h-1.5 rounded-full" style={{ background: meta.color }} />}
                  <span style={{ fontFamily: "'Manrope', sans-serif", fontWeight: active ? 500 : 400, fontSize: "11px", letterSpacing: "-0.02em", color: active ? (meta?.color || t.text) : t.textMuted }}>{s === "all" ? "All" : meta!.label}</span>
                  <span style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 500, fontSize: "9px", color: t.textGhost }}>{count}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ─── Search ─── */}
        <div className="shrink-0 flex items-center gap-2 px-4 py-2" style={{ borderBottom: `1px solid ${t.borderSubtle}` }}>
          <div className="flex items-center gap-2 h-8 px-3 rounded-lg flex-1 max-w-xs" style={{ background: isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.03)", border: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}` }}>
            <Search size={12} style={{ color: t.textFaint }} />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search fleet name, owner…" className="flex-1 bg-transparent outline-none" style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 400, fontSize: "12px", color: t.text }} />
            {search && <button onClick={() => setSearch("")}><X size={10} style={{ color: t.textFaint }} /></button>}
          </div>
          <span className="ml-auto" style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 400, fontSize: "10px", color: t.textFaint }}>{filtered.length} fleet{filtered.length !== 1 ? "s" : ""}</span>
        </div>

        {/* ─── TABLE ─── */}
        <div className="flex-1 overflow-auto">
          <table className="w-full min-w-[1000px]" style={{ borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: `1px solid ${t.borderSubtle}` }}>
                {["Fleet", "Stage", "Drivers", "Vehicles", "EV Mix", "Utilization", "Completion", "Rating", "Earnings/mo", "Pending"].map(h => (
                  <th key={h} className="text-left px-3 h-9">
                    <span style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 600, fontSize: "9px", letterSpacing: "0.05em", textTransform: "uppercase" as const, color: t.textFaint }}>{h}</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((fleet, i) => {
                const stg = STAGE_META[fleet.stage];
                const isSelected = selectedFleet?.id === fleet.id;
                const evPercent = fleet.totalVehicles > 0 ? Math.round((fleet.evVehicles / fleet.totalVehicles) * 100) : 0;

                return (
                  <motion.tr key={fleet.id} className="cursor-pointer transition-colors" style={{ borderBottom: `1px solid ${t.borderSubtle}`, background: isSelected ? t.surfaceActive : "transparent" }}
                    onClick={() => { setSelectedFleet(fleet); setSubDrawer(null); }}
                    onMouseEnter={e => { if (!isSelected) (e.currentTarget as HTMLElement).style.background = isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.015)"; }}
                    onMouseLeave={e => { if (!isSelected) (e.currentTarget as HTMLElement).style.background = "transparent"; }}
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.02 + i * 0.02 }}
                  >
                    <td className="px-3 py-2.5">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: `${stg.color}10` }}>
                          <Truck size={14} style={{ color: stg.color }} />
                        </div>
                        <div className="min-w-0">
                          <span className="block truncate" style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 500, fontSize: "13px", letterSpacing: "-0.02em", color: t.text }}>{fleet.name}</span>
                          <span style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 400, fontSize: "10px", color: t.textFaint }}>{fleet.ownerName} · {fleet.city}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-2.5"><div className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full" style={{ background: stg.color }} /><span style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 500, fontSize: "11px", color: stg.color }}>{stg.label}</span></div></td>
                    <td className="px-3 py-2.5"><span style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 500, fontSize: "12px", color: fleet.activeDrivers > 0 ? BRAND.green : t.textGhost }}>{fleet.activeDrivers}</span><span style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 400, fontSize: "10px", color: t.textGhost }}>/{fleet.totalDrivers}</span></td>
                    <td className="px-3 py-2.5"><div className="flex items-center gap-1"><Car size={10} style={{ color: t.iconMuted }} /><span style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 500, fontSize: "12px", color: t.text }}>{fleet.totalVehicles}</span>{fleet.maintenanceDue > 0 && <span className="flex items-center gap-0.5 ml-1"><Wrench size={8} style={{ color: STATUS.warning }} /><span style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 500, fontSize: "9px", color: STATUS.warning }}>{fleet.maintenanceDue}</span></span>}</div></td>
                    <td className="px-3 py-2.5">{evPercent > 0 ? <div className="flex items-center gap-1"><Zap size={9} style={{ color: BRAND.green }} /><span style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 500, fontSize: "12px", color: BRAND.green }}>{evPercent}%</span></div> : <span style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 400, fontSize: "12px", color: t.textGhost }}>—</span>}</td>
                    <td className="px-3 py-2.5">{fleet.utilization > 0 ? <div className="flex items-center gap-1.5"><div className="w-10 h-1.5 rounded-full overflow-hidden" style={{ background: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)" }}><div className="h-full rounded-full" style={{ width: `${fleet.utilization}%`, background: fleet.utilization < 60 ? STATUS.warning : BRAND.green }} /></div><span style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 500, fontSize: "10px", color: fleet.utilization < 60 ? STATUS.warning : t.textMuted }}>{fleet.utilization}%</span></div> : <span style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 400, fontSize: "12px", color: t.textGhost }}>—</span>}</td>
                    <td className="px-3 py-2.5"><span style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 500, fontSize: "12px", color: fleet.completionRate > 0 ? (fleet.completionRate < 90 ? STATUS.error : t.text) : t.textGhost }}>{fleet.completionRate > 0 ? `${fleet.completionRate}%` : "—"}</span></td>
                    <td className="px-3 py-2.5">{fleet.avgRating > 0 ? <div className="flex items-center gap-1"><Star size={9} style={{ color: "#F59E0B", fill: "#F59E0B" }} /><span style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 500, fontSize: "12px", color: fleet.avgRating < 4.0 ? STATUS.warning : t.text }}>{fleet.avgRating.toFixed(1)}</span></div> : <span style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 400, fontSize: "12px", color: t.textGhost }}>—</span>}</td>
                    <td className="px-3 py-2.5"><span style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 500, fontSize: "12px", color: fleet.monthlyEarnings > 0 ? t.text : t.textGhost }}>{fleet.monthlyEarnings > 0 ? formatNaira(fleet.monthlyEarnings) : "—"}</span></td>
                    <td className="px-3 py-2.5">{fleet.pendingPayout > 0 ? <span style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 500, fontSize: "12px", color: STATUS.warning }}>{formatNaira(fleet.pendingPayout)}</span> : <span style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 400, fontSize: "12px", color: t.textGhost }}>—</span>}</td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>

          {filtered.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16">
              <Truck size={20} style={{ color: t.textGhost, marginBottom: 8 }} />
              <span style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 600, fontSize: "12px", color: t.textSecondary }}>No fleets match</span>
              {(stageFilter !== "all" || search) && (
                <button className="mt-3 h-8 px-4 rounded-lg" style={{ background: isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.03)", border: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)"}` }}
                  onClick={() => { setStageFilter("all"); setSearch(""); }}>
                  <span style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 500, fontSize: "11px", color: t.textMuted }}>Clear filters</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ═══ PRIMARY DRAWER ═══ */}
      <AdminDrawer open={!!selectedFleet && !subDrawer} onClose={() => setSelectedFleet(null)} title={selectedFleet?.name} subtitle={selectedFleet?.id} width={460}>
        {selectedFleet && (
          <FleetSummaryDrawer fleet={selectedFleet} isDark={isDark} t={t}
            onSuspend={() => setShowSuspendModal(true)}
            onCommission={() => { setNewCommission(String(selectedFleet.commission)); setShowCommissionModal(true); }}
            onDrivers={() => openSub("drivers")}
            onVehicles={() => openSub("vehicles")}
            onPayouts={() => openSub("payouts")}
            onContact={() => openSub("contact")}
            onProfile={() => openSub("profile")}
            onTriggerPayout={() => setShowPayoutModal(true)}
          />
        )}
      </AdminDrawer>

      {/* ═══ SUB-DRAWERS ═══ */}
      <AdminDrawer open={subDrawer === "drivers"} onClose={closeSub} title="Driver Roster" subtitle={selectedFleet?.name} width={520}>
        {selectedFleet && <DriverRosterDrawer fleet={selectedFleet} isDark={isDark} t={t} />}
      </AdminDrawer>

      <AdminDrawer open={subDrawer === "vehicles"} onClose={closeSub} title="Vehicle Registry" subtitle={selectedFleet?.name} width={520}>
        {selectedFleet && <VehicleRegistryDrawer fleet={selectedFleet} isDark={isDark} t={t} />}
      </AdminDrawer>

      <AdminDrawer open={subDrawer === "payouts"} onClose={closeSub} title="Payout History" subtitle={selectedFleet?.name} width={500}>
        {selectedFleet && <PayoutsDrawer fleet={selectedFleet} isDark={isDark} t={t} />}
      </AdminDrawer>

      <AdminDrawer open={subDrawer === "contact"} onClose={closeSub} title="Contact Owner" subtitle={selectedFleet?.ownerName} width={440}>
        {selectedFleet && <FleetContactDrawer fleet={selectedFleet} isDark={isDark} t={t} onSend={closeSub} />}
      </AdminDrawer>

      <AdminDrawer open={subDrawer === "profile"} onClose={closeSub} title="Fleet Profile" subtitle={selectedFleet?.name} width={520}>
        {selectedFleet && <FleetProfileDrawer fleet={selectedFleet} isDark={isDark} t={t} />}
      </AdminDrawer>

      {/* ═══ SUSPEND MODAL ═══ */}
      <AdminModal open={showSuspendModal} onClose={() => setShowSuspendModal(false)} width={480} danger persistent>
        {selectedFleet && (
          <div>
            <ModalHeader title={selectedFleet.stage === "suspended" ? "Reactivate Fleet" : "Suspend Fleet"} subtitle={`${selectedFleet.name} · ${selectedFleet.totalDrivers} drivers affected`} onClose={() => setShowSuspendModal(false)} icon={<Ban size={16} style={{ color: selectedFleet.stage === "suspended" ? BRAND.green : STATUS.error }} />} accentColor={selectedFleet.stage === "suspended" ? BRAND.green : STATUS.error} />
            <div className="px-6 py-5 space-y-4">
              <div className="rounded-xl p-3" style={{ background: `${selectedFleet.stage === "suspended" ? BRAND.green : STATUS.error}08`, border: `1px solid ${selectedFleet.stage === "suspended" ? BRAND.green : STATUS.error}15` }}>
                <span style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 400, fontSize: "11px", lineHeight: "1.5", color: selectedFleet.stage === "suspended" ? BRAND.green : STATUS.error }}>
                  {selectedFleet.stage === "suspended" ? "Reactivating restores all drivers to their previous status." : `Suspending deactivates all ${selectedFleet.totalDrivers} drivers and ${selectedFleet.totalVehicles} vehicles. Pending payouts (${formatNaira(selectedFleet.pendingPayout)}) will be held.`}
                </span>
              </div>
              {selectedFleet.stage !== "suspended" && (
                <textarea value={suspendReason} onChange={e => setSuspendReason(e.target.value)} placeholder="Reason for suspension…" rows={3} className="w-full px-3 py-2.5 rounded-xl bg-transparent outline-none resize-none" style={{ border: `1px solid ${isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)"}`, fontFamily: "'Manrope', sans-serif", fontSize: "12px", lineHeight: "1.5", color: t.text }} />
              )}
            </div>
            <ModalFooter>
              <SurfaceButton label="Cancel" variant="ghost" onClick={() => { setShowSuspendModal(false); setSuspendReason(""); }} />
              <SurfaceButton label={selectedFleet.stage === "suspended" ? "Reactivate" : "Suspend"} variant={selectedFleet.stage === "suspended" ? "primary" : "danger"} onClick={() => { setShowSuspendModal(false); setSuspendReason(""); }} />
            </ModalFooter>
          </div>
        )}
      </AdminModal>

      {/* ═══ COMMISSION MODAL ═══ */}
      <AdminModal open={showCommissionModal} onClose={() => setShowCommissionModal(false)} width={440}>
        {selectedFleet && (
          <div>
            <ModalHeader title="Adjust Commission" subtitle={`${selectedFleet.name} · Currently ${selectedFleet.commission}%`} onClose={() => setShowCommissionModal(false)} icon={<Percent size={16} style={{ color: BRAND.green }} />} accentColor={BRAND.green} />
            <div className="px-6 py-5 space-y-4">
              <div className="flex items-center gap-2 h-11 px-3 rounded-xl" style={{ background: isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.02)", border: `1px solid ${isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)"}` }}>
                <input value={newCommission} onChange={e => setNewCommission(e.target.value.replace(/[^0-9.]/g, ""))} className="flex-1 bg-transparent outline-none" style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 600, fontSize: "18px", letterSpacing: "-0.03em", color: t.text }} />
                <span style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 500, fontSize: "14px", color: t.textMuted }}>%</span>
              </div>
              <div className="rounded-xl p-3" style={{ background: `${BRAND.green}06`, border: `1px solid ${BRAND.green}12` }}>
                <span style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 400, fontSize: "11px", lineHeight: "1.5", color: t.textSecondary }}>
                  At {newCommission || selectedFleet.commission}%, JET retains <span style={{ fontWeight: 600, color: BRAND.green }}>{formatNaira(Math.round(selectedFleet.monthlyEarnings * (Number(newCommission || selectedFleet.commission) / 100)))}</span> from {formatNaira(selectedFleet.monthlyEarnings)} monthly earnings.
                </span>
              </div>
            </div>
            <ModalFooter>
              <SurfaceButton label="Cancel" variant="ghost" onClick={() => setShowCommissionModal(false)} />
              <SurfaceButton label="Update" variant="primary" onClick={() => setShowCommissionModal(false)} />
            </ModalFooter>
          </div>
        )}
      </AdminModal>

      {/* ═══ TRIGGER PAYOUT MODAL ═══ */}
      <AdminModal open={showPayoutModal} onClose={() => setShowPayoutModal(false)} width={440}>
        {selectedFleet && selectedFleet.pendingPayout > 0 && (
          <div>
            <ModalHeader title="Trigger Payout" subtitle={`${selectedFleet.name}`} onClose={() => setShowPayoutModal(false)} icon={<Wallet size={16} style={{ color: BRAND.green }} />} accentColor={BRAND.green} />
            <div className="px-6 py-5 space-y-4">
              <div className="p-4 rounded-xl text-center" style={{ background: t.surface, border: `1px solid ${t.borderSubtle}` }}>
                <span className="block" style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 600, fontSize: "28px", letterSpacing: "-0.03em", color: BRAND.green }}>{formatNaira(selectedFleet.pendingPayout)}</span>
                <span style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 400, fontSize: "11px", color: t.textFaint }}>Pending payout amount</span>
              </div>
              <div className="rounded-xl p-3" style={{ background: `${BRAND.green}06`, border: `1px solid ${BRAND.green}12` }}>
                <span style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 400, fontSize: "11px", lineHeight: "1.5", color: t.textSecondary }}>
                  Payout will be processed via bank transfer to the fleet owner's registered account. Processing takes 1-3 business days.
                </span>
              </div>
            </div>
            <ModalFooter>
              <SurfaceButton label="Cancel" variant="ghost" onClick={() => setShowPayoutModal(false)} />
              <SurfaceButton label="Process Payout" variant="primary" icon={<Wallet size={13} />} onClick={() => setShowPayoutModal(false)} />
            </ModalFooter>
          </div>
        )}
      </AdminModal>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   FLEET SUMMARY DRAWER
   ═══════════════════════════════════════════════════════════════════════════ */

function FleetSummaryDrawer({ fleet, isDark, t, onSuspend, onCommission, onDrivers, onVehicles, onPayouts, onContact, onProfile, onTriggerPayout }: {
  fleet: Fleet; isDark: boolean; t: any;
  onSuspend: () => void; onCommission: () => void;
  onDrivers: () => void; onVehicles: () => void;
  onPayouts: () => void; onContact: () => void;
  onProfile: () => void; onTriggerPayout: () => void;
}) {
  const stg = STAGE_META[fleet.stage];
  const evPercent = fleet.totalVehicles > 0 ? Math.round((fleet.evVehicles / fleet.totalVehicles) * 100) : 0;

  return (
    <div className="px-5 py-4 space-y-4">
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1.5 h-6 px-2 rounded-md" style={{ background: `${stg.color}12`, border: `1px solid ${stg.color}20` }}>
          <span className="w-1.5 h-1.5 rounded-full" style={{ background: stg.color }} /><span style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 500, fontSize: "10px", color: stg.color }}>{stg.label}</span>
        </div>
        <span style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 400, fontSize: "10px", color: t.textFaint }}>{fleet.commission}% commission</span>
      </div>

      <div className="rounded-xl p-3 space-y-1.5" style={{ background: t.surface, border: `1px solid ${t.borderSubtle}` }}>
        {[{ icon: Users, value: fleet.ownerName }, { icon: Mail, value: fleet.ownerEmail }, { icon: Phone, value: fleet.ownerPhone }, { icon: MapPin, value: fleet.city }, { icon: Clock, value: `Partner since ${fleet.joinDate}` }].map(({ icon: Icon, value }) => (
          <div key={value} className="flex items-center gap-2"><Icon size={11} style={{ color: t.iconMuted }} /><span style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 400, fontSize: "12px", color: t.text }}>{value}</span></div>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-2">
        {[
          { label: "Drivers", value: `${fleet.activeDrivers}/${fleet.totalDrivers}`, color: BRAND.green },
          { label: "Vehicles", value: fleet.totalVehicles.toString(), color: t.text },
          { label: "EV Mix", value: evPercent > 0 ? `${evPercent}%` : "—", color: evPercent > 0 ? BRAND.green : t.textGhost },
        ].map(m => (
          <div key={m.label} className="p-3 rounded-xl" style={{ background: t.surface, border: `1px solid ${t.borderSubtle}` }}>
            <span className="block" style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 600, fontSize: "16px", letterSpacing: "-0.03em", color: m.color }}>{m.value}</span>
            <span style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 400, fontSize: "9px", color: t.textFaint }}>{m.label}</span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-2">
        {[
          { label: "Completion", value: fleet.completionRate > 0 ? `${fleet.completionRate}%` : "—", color: fleet.completionRate < 90 ? STATUS.error : BRAND.green },
          { label: "Rating", value: fleet.avgRating > 0 ? fleet.avgRating.toFixed(1) : "—", color: fleet.avgRating > 0 ? (fleet.avgRating < 4.0 ? STATUS.warning : t.text) : t.textGhost },
          { label: "Utilization", value: fleet.utilization > 0 ? `${fleet.utilization}%` : "—", color: fleet.utilization < 60 ? STATUS.warning : BRAND.green },
          { label: "Total Trips", value: fleet.totalTrips > 0 ? fleet.totalTrips.toLocaleString() : "—", color: t.text },
        ].map(m => (
          <div key={m.label} className="p-3 rounded-xl" style={{ background: t.surface, border: `1px solid ${t.borderSubtle}` }}>
            <span className="block" style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 600, fontSize: "16px", letterSpacing: "-0.03em", color: m.color }}>{m.value}</span>
            <span style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 400, fontSize: "9px", color: t.textFaint }}>{m.label}</span>
          </div>
        ))}
      </div>

      {/* Financials */}
      <div className="rounded-xl p-3" style={{ background: t.surface, border: `1px solid ${t.borderSubtle}` }}>
        <span style={{ ...TY.label, fontSize: "8px", color: t.textGhost }}>FINANCIALS</span>
        <div className="mt-2 space-y-1.5">
          <div className="flex justify-between"><span style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 400, fontSize: "11px", color: t.textMuted }}>Monthly earnings</span><span style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 500, fontSize: "11px", color: t.text }}>{fleet.monthlyEarnings > 0 ? formatNaira(fleet.monthlyEarnings) : "—"}</span></div>
          <div className="flex justify-between"><span style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 400, fontSize: "11px", color: t.textMuted }}>Monthly payout</span><span style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 500, fontSize: "11px", color: BRAND.green }}>{fleet.monthlyPayout > 0 ? formatNaira(fleet.monthlyPayout) : "—"}</span></div>
          <div className="h-px" style={{ background: t.borderSubtle }} />
          <div className="flex justify-between"><span style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 500, fontSize: "11px", color: fleet.pendingPayout > 0 ? STATUS.warning : t.textMuted }}>Pending payout</span><span style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 600, fontSize: "12px", color: fleet.pendingPayout > 0 ? STATUS.warning : t.textGhost }}>{fleet.pendingPayout > 0 ? formatNaira(fleet.pendingPayout) : "—"}</span></div>
          <span style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 400, fontSize: "9px", color: t.textFaint }}>Last payout: {fleet.lastPayout}</span>
        </div>
        {fleet.pendingPayout > 0 && (
          <button onClick={onTriggerPayout} className="mt-3 w-full h-9 rounded-lg flex items-center justify-center gap-1.5 transition-opacity hover:opacity-80" style={{ background: `${BRAND.green}10`, border: `1px solid ${BRAND.green}20` }}>
            <Wallet size={11} style={{ color: BRAND.green }} />
            <span style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 500, fontSize: "11px", color: BRAND.green }}>Trigger Payout</span>
          </button>
        )}
      </div>

      {fleet.maintenanceDue > 0 && (
        <div className="rounded-xl p-3" style={{ background: `${STATUS.warning}06`, border: `1px solid ${STATUS.warning}12` }}>
          <div className="flex items-center gap-1.5"><Wrench size={11} style={{ color: STATUS.warning }} /><span style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 500, fontSize: "11px", color: STATUS.warning }}>{fleet.maintenanceDue} vehicle{fleet.maintenanceDue > 1 ? "s" : ""} due for maintenance</span></div>
        </div>
      )}

      {/* Actions */}
      <div className="grid grid-cols-2 gap-2 pt-2">
        {[
          { label: "Full Profile", icon: ExternalLink, onClick: onProfile, color: t.textMuted, bg: isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.03)", border: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)" },
          { label: "Driver Roster", icon: Users, onClick: onDrivers, color: t.textMuted, bg: isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.03)", border: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)" },
          { label: "Vehicles", icon: Car, onClick: onVehicles, color: t.textMuted, bg: isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.03)", border: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)" },
          { label: "Payouts", icon: Wallet, onClick: onPayouts, color: t.textMuted, bg: isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.03)", border: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)" },
          { label: "Contact", icon: MessageSquare, onClick: onContact, color: t.textMuted, bg: isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.03)", border: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)" },
          { label: "Commission", icon: Percent, onClick: onCommission, color: BRAND.green, bg: `${BRAND.green}06`, border: `${BRAND.green}15` },
          { label: fleet.stage === "suspended" ? "Reactivate" : "Suspend", icon: fleet.stage === "suspended" ? RefreshCcw : Ban, onClick: onSuspend, color: fleet.stage === "suspended" ? BRAND.green : STATUS.error, bg: fleet.stage === "suspended" ? `${BRAND.green}08` : `${STATUS.error}06`, border: fleet.stage === "suspended" ? `${BRAND.green}18` : `${STATUS.error}15` },
        ].map(btn => (
          <button key={btn.label} onClick={btn.onClick} className="h-10 rounded-xl flex items-center justify-center gap-1.5 transition-opacity hover:opacity-80" style={{ background: btn.bg, border: `1px solid ${btn.border}` }}>
            <btn.icon size={12} style={{ color: btn.color }} />
            <span style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 500, fontSize: "11px", color: btn.color === t.textMuted ? t.text : btn.color }}>{btn.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   DRIVER ROSTER DRAWER
   ═══════════════════════════════════════════════════════════════════════════ */

function DriverRosterDrawer({ fleet, isDark, t }: { fleet: Fleet; isDark: boolean; t: any }) {
  const [filter, setFilter] = useState<DriverStatus | "all">("all");
  const drivers = filter === "all" ? fleet.drivers : fleet.drivers.filter(d => d.status === filter);

  if (fleet.drivers.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
        <Users size={20} style={{ color: t.textGhost, marginBottom: 8 }} />
        <span className="block" style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 600, fontSize: "12px", color: t.textSecondary }}>No drivers yet</span>
        <span style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 400, fontSize: "11px", color: t.textMuted }}>Drivers will appear once the fleet onboards them</span>
      </div>
    );
  }

  return (
    <div className="px-5 py-4 space-y-3">
      {/* Filter tabs */}
      <div className="flex items-center gap-1 flex-wrap">
        {(["all", "active", "on_trip", "offline", "suspended", "pending"] as const).map(s => {
          const active = filter === s;
          const meta = s !== "all" ? DRIVER_STATUS[s] : null;
          const count = s === "all" ? fleet.drivers.length : fleet.drivers.filter(d => d.status === s).length;
          if (count === 0 && s !== "all") return null;
          return (
            <button key={s} className="flex items-center gap-1 h-6 px-2 rounded-md" style={{ background: active ? (meta ? `${meta.color}12` : (isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)")) : "transparent" }} onClick={() => setFilter(s)}>
              {meta && <span className="w-1.5 h-1.5 rounded-full" style={{ background: meta.color }} />}
              <span style={{ fontFamily: "'Manrope', sans-serif", fontWeight: active ? 500 : 400, fontSize: "10px", color: active ? (meta?.color || t.text) : t.textMuted }}>{s === "all" ? "All" : meta!.label}</span>
              <span style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 500, fontSize: "8px", color: t.textGhost }}>{count}</span>
            </button>
          );
        })}
      </div>

      {/* Driver list */}
      {drivers.map(driver => {
        const ds = DRIVER_STATUS[driver.status];
        return (
          <div key={driver.id} className="flex items-center gap-3 px-3 py-2.5 rounded-xl" style={{ background: t.surface, border: `1px solid ${t.borderSubtle}` }}>
            <div className="relative shrink-0">
              <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: `${ds.color}12` }}>
                <span style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 600, fontSize: "10px", color: ds.color }}>{driver.name.split(" ").map(w => w[0]).join("")}</span>
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full" style={{ background: t.overlay }}><span className="block w-1.5 h-1.5 rounded-full mx-auto mt-[2px]" style={{ background: ds.color }} /></span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="truncate" style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 500, fontSize: "12px", letterSpacing: "-0.02em", color: t.text }}>{driver.name}</span>
                {driver.isEV && <Zap size={9} style={{ color: BRAND.green }} />}
              </div>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 400, fontSize: "10px", color: t.textFaint }}>{driver.vehicle}</span>
                <span style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 400, fontSize: "10px", color: t.textGhost }}>·</span>
                <span style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 400, fontSize: "10px", color: t.textFaint }}>{driver.trips} trips</span>
              </div>
            </div>
            <div className="flex flex-col items-end gap-0.5 shrink-0">
              <div className="flex items-center gap-1">
                <Star size={8} style={{ color: "#F59E0B", fill: "#F59E0B" }} />
                <span style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 500, fontSize: "10px", color: t.textMuted }}>{driver.rating.toFixed(1)}</span>
              </div>
              <span style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 400, fontSize: "9px", color: t.textFaint }}>{driver.lastActive}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   VEHICLE REGISTRY DRAWER
   ═══════════════════════════════════════════════════════════════════════════ */

function VehicleRegistryDrawer({ fleet, isDark, t }: { fleet: Fleet; isDark: boolean; t: any }) {
  const [filter, setFilter] = useState<"all" | "ev" | "gas" | "maintenance">("all");
  const vehicles = fleet.vehicles.filter(v => {
    if (filter === "ev") return v.type === "ev";
    if (filter === "gas") return v.type === "gas";
    if (filter === "maintenance") return v.status === "maintenance" || v.status === "inspection_due";
    return true;
  });

  if (fleet.vehicles.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
        <Car size={20} style={{ color: t.textGhost, marginBottom: 8 }} />
        <span className="block" style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 600, fontSize: "12px", color: t.textSecondary }}>No vehicles registered</span>
        <span style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 400, fontSize: "11px", color: t.textMuted }}>Vehicles will appear once the fleet registers them</span>
      </div>
    );
  }

  return (
    <div className="px-5 py-4 space-y-3">
      <div className="flex items-center gap-1">
        {[
          { key: "all" as const, label: "All", count: fleet.vehicles.length },
          { key: "ev" as const, label: "EV", count: fleet.vehicles.filter(v => v.type === "ev").length },
          { key: "gas" as const, label: "Gas", count: fleet.vehicles.filter(v => v.type === "gas").length },
          { key: "maintenance" as const, label: "Needs Attention", count: fleet.vehicles.filter(v => v.status === "maintenance" || v.status === "inspection_due").length },
        ].filter(f => f.count > 0 || f.key === "all").map(f => (
          <button key={f.key} className="flex items-center gap-1 h-6 px-2 rounded-md" style={{ background: filter === f.key ? (isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)") : "transparent" }} onClick={() => setFilter(f.key)}>
            <span style={{ fontFamily: "'Manrope', sans-serif", fontWeight: filter === f.key ? 500 : 400, fontSize: "10px", color: filter === f.key ? t.text : t.textMuted }}>{f.label}</span>
            <span style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 500, fontSize: "8px", color: t.textGhost }}>{f.count}</span>
          </button>
        ))}
      </div>

      {vehicles.map(v => {
        const vs = VEHICLE_STATUS[v.status];
        return (
          <div key={v.id} className="rounded-xl p-3" style={{ background: (v.status === "maintenance" || v.status === "inspection_due") ? `${vs.color}04` : t.surface, border: `1px solid ${(v.status === "maintenance" || v.status === "inspection_due") ? `${vs.color}12` : t.borderSubtle}` }}>
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-2">
                {v.type === "ev" ? <Battery size={12} style={{ color: BRAND.green }} /> : <Fuel size={12} style={{ color: t.iconMuted }} />}
                <span style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 500, fontSize: "12px", color: t.text }}>{v.make} {v.model} {v.year}</span>
              </div>
              <span className="px-1.5 py-0.5 rounded" style={{ background: `${vs.color}12`, fontFamily: "'Manrope', sans-serif", fontWeight: 500, fontSize: "9px", color: vs.color }}>{vs.label}</span>
            </div>
            <div className="flex items-center gap-3">
              <span style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 400, fontSize: "10px", color: t.textFaint }}>{v.plate}</span>
              <span style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 400, fontSize: "10px", color: t.textGhost }}>·</span>
              <span style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 400, fontSize: "10px", color: t.textFaint }}>{v.mileage.toLocaleString()} km</span>
              <span style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 400, fontSize: "10px", color: t.textGhost }}>·</span>
              <span style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 400, fontSize: "10px", color: t.textFaint }}>{v.trips} trips</span>
              {v.assignedDriver && (
                <>
                  <span style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 400, fontSize: "10px", color: t.textGhost }}>·</span>
                  <span style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 400, fontSize: "10px", color: BRAND.green }}>{v.assignedDriver}</span>
                </>
              )}
            </div>
            {(v.status === "maintenance" || v.status === "inspection_due") && (
              <div className="flex items-center gap-1.5 mt-1.5">
                <Wrench size={9} style={{ color: vs.color }} />
                <span style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 400, fontSize: "10px", color: vs.color }}>Next service: {v.nextService}</span>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   PAYOUTS DRAWER
   ═══════════════════════════════════════════════════════════════════════════ */

function PayoutsDrawer({ fleet, isDark, t }: { fleet: Fleet; isDark: boolean; t: any }) {
  if (fleet.payouts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
        <Wallet size={20} style={{ color: t.textGhost, marginBottom: 8 }} />
        <span className="block" style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 600, fontSize: "12px", color: t.textSecondary }}>No payouts yet</span>
        <span style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 400, fontSize: "11px", color: t.textMuted }}>Payouts will be generated once the fleet starts earning</span>
      </div>
    );
  }

  return (
    <div className="px-5 py-4 space-y-3">
      <div className="grid grid-cols-2 gap-2">
        <div className="p-3 rounded-xl" style={{ background: t.surface, border: `1px solid ${t.borderSubtle}` }}>
          <span className="block" style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 600, fontSize: "16px", letterSpacing: "-0.03em", color: BRAND.green }}>{formatNaira(fleet.payouts.filter(p => p.status === "completed").reduce((a, p) => a + p.amount, 0))}</span>
          <span style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 400, fontSize: "10px", color: t.textFaint }}>Total paid out</span>
        </div>
        <div className="p-3 rounded-xl" style={{ background: fleet.pendingPayout > 0 ? `${STATUS.warning}06` : t.surface, border: `1px solid ${fleet.pendingPayout > 0 ? `${STATUS.warning}15` : t.borderSubtle}` }}>
          <span className="block" style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 600, fontSize: "16px", letterSpacing: "-0.03em", color: fleet.pendingPayout > 0 ? STATUS.warning : t.textGhost }}>{fleet.pendingPayout > 0 ? formatNaira(fleet.pendingPayout) : "₦0"}</span>
          <span style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 400, fontSize: "10px", color: t.textFaint }}>Pending</span>
        </div>
      </div>

      {fleet.payouts.map(payout => {
        const ps = PAYOUT_STATUS[payout.status];
        return (
          <div key={payout.id} className="rounded-xl p-3" style={{ background: t.surface, border: `1px solid ${payout.status === "pending" ? `${STATUS.warning}15` : t.borderSubtle}` }}>
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-2">
                <span style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 500, fontSize: "12px", color: t.text }}>{payout.id}</span>
                <span className="px-1.5 py-0.5 rounded" style={{ background: `${ps.color}12`, fontFamily: "'Manrope', sans-serif", fontWeight: 500, fontSize: "9px", color: ps.color }}>{ps.label}</span>
              </div>
              <span style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 600, fontSize: "14px", letterSpacing: "-0.03em", color: t.text }}>{formatNaira(payout.amount)}</span>
            </div>
            <div className="flex items-center gap-3">
              <span style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 400, fontSize: "10px", color: t.textMuted }}>{payout.period}</span>
              <span style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 400, fontSize: "10px", color: t.textGhost }}>·</span>
              <span style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 400, fontSize: "10px", color: t.textMuted }}>{payout.trips} trips</span>
              <span style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 400, fontSize: "10px", color: t.textGhost }}>·</span>
              <span style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 400, fontSize: "10px", color: t.textFaint }}>Comm: {formatNaira(payout.commission)}</span>
            </div>
            <div className="flex items-center justify-between mt-1.5">
              <span style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 400, fontSize: "10px", color: t.textFaint }}>{payout.method}</span>
              <span style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 400, fontSize: "10px", color: t.textFaint }}>{payout.processedDate}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   FLEET CONTACT DRAWER
   ═══════════════════════════════════════════════════════════════════════════ */

function FleetContactDrawer({ fleet, isDark, t, onSend }: { fleet: Fleet; isDark: boolean; t: any; onSend: () => void }) {
  const [channel, setChannel] = useState<"email" | "phone">("email");
  const [message, setMessage] = useState("");

  return (
    <div className="px-5 py-4 space-y-4">
      <div className="flex gap-2">
        {([{ key: "email" as const, label: "Email", desc: fleet.ownerEmail, icon: Mail }, { key: "phone" as const, label: "Phone", desc: fleet.ownerPhone, icon: Phone }]).map(ch => (
          <button key={ch.key} className="flex-1 flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-left" style={{ background: channel === ch.key ? `${BRAND.green}08` : t.surface, border: `1px solid ${channel === ch.key ? `${BRAND.green}20` : t.borderSubtle}` }} onClick={() => setChannel(ch.key)}>
            <div className="w-4 h-4 flex items-center justify-center">{channel === ch.key ? <CheckCircle2 size={13} style={{ color: BRAND.green }} /> : <div className="w-3.5 h-3.5 rounded-full" style={{ border: `1.5px solid ${t.textFaint}` }} />}</div>
            <div><span className="block" style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 500, fontSize: "12px", color: t.text }}>{ch.label}</span><span style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 400, fontSize: "10px", color: t.textFaint }}>{ch.desc}</span></div>
          </button>
        ))}
      </div>
      <div>
        <span style={{ ...TY.label, fontSize: "8px", color: t.textGhost }}>MESSAGE</span>
        <textarea value={message} onChange={e => setMessage(e.target.value)} placeholder={`Write to ${fleet.ownerName}…`} rows={6} className="mt-1.5 w-full px-3 py-2.5 rounded-xl bg-transparent outline-none resize-none" style={{ border: `1px solid ${t.borderSubtle}`, fontFamily: "'Manrope', sans-serif", fontSize: "12px", lineHeight: "1.5", color: t.text }} />
      </div>
      <button className="w-full h-11 rounded-xl flex items-center justify-center gap-2" style={{ background: BRAND.green, minHeight: 44 }} onClick={onSend}>
        <Send size={13} style={{ color: "#fff" }} /><span style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 500, fontSize: "12px", color: "#fff" }}>Send</span>
      </button>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   FLEET PROFILE DRAWER
   ═══════════════════════════════════════════════════════════════════════════ */

function FleetProfileDrawer({ fleet, isDark, t }: { fleet: Fleet; isDark: boolean; t: any }) {
  const stg = STAGE_META[fleet.stage];
  const evPercent = fleet.totalVehicles > 0 ? Math.round((fleet.evVehicles / fleet.totalVehicles) * 100) : 0;

  return (
    <div className="px-5 py-4 space-y-5">
      <div className="rounded-xl p-4" style={{ background: t.surface, border: `1px solid ${t.borderSubtle}` }}>
        <div className="flex items-center gap-3 mb-3">
          <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: `${stg.color}12` }}><Truck size={20} style={{ color: stg.color }} /></div>
          <div>
            <span style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 600, fontSize: "15px", letterSpacing: "-0.03em", color: t.text }}>{fleet.name}</span>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="px-1.5 py-0.5 rounded" style={{ background: `${stg.color}12`, fontFamily: "'Manrope', sans-serif", fontWeight: 500, fontSize: "9px", color: stg.color }}>{stg.label}</span>
              <span style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 400, fontSize: "10px", color: t.textFaint }}>{fleet.id}</span>
            </div>
          </div>
        </div>
        <div className="space-y-1.5 pt-3" style={{ borderTop: `1px solid ${t.borderSubtle}` }}>
          {[{ icon: Users, v: fleet.ownerName }, { icon: Mail, v: fleet.ownerEmail }, { icon: Phone, v: fleet.ownerPhone }, { icon: MapPin, v: fleet.city }, { icon: Clock, v: `Since ${fleet.joinDate}` }].map(r => (
            <div key={r.v} className="flex items-center gap-2"><r.icon size={11} style={{ color: t.iconMuted }} /><span style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 400, fontSize: "11px", color: t.text }}>{r.v}</span></div>
          ))}
        </div>
      </div>

      <div>
        <span style={{ ...TY.label, fontSize: "8px", color: t.textGhost }}>SUPPLY</span>
        <div className="mt-2 grid grid-cols-3 gap-2">
          {[
            { label: "Drivers", value: `${fleet.activeDrivers}/${fleet.totalDrivers}`, color: BRAND.green, source: "drivers.fleet_id" },
            { label: "Vehicles", value: String(fleet.totalVehicles), color: t.text, source: "vehicles.fleet_id.count" },
            { label: "EV Mix", value: evPercent > 0 ? `${evPercent}%` : "—", color: BRAND.green, source: "vehicles.type=ev/total" },
            { label: "Utilization", value: fleet.utilization > 0 ? `${fleet.utilization}%` : "—", color: fleet.utilization < 60 ? STATUS.warning : BRAND.green, source: "vehicles.active/total" },
            { label: "Completion", value: fleet.completionRate > 0 ? `${fleet.completionRate}%` : "—", color: fleet.completionRate < 90 ? STATUS.error : BRAND.green, source: "trips.completed/requested" },
            { label: "Rating", value: fleet.avgRating > 0 ? fleet.avgRating.toFixed(1) : "—", color: t.text, source: "trips.avg(rating)" },
          ].map(m => (
            <div key={m.label} className="p-2.5 rounded-lg group relative" style={{ background: t.surface, border: `1px solid ${t.borderSubtle}` }}>
              <span className="block" style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 600, fontSize: "14px", letterSpacing: "-0.03em", lineHeight: "1.2", color: m.color }}>{m.value}</span>
              <span style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 400, fontSize: "9px", color: t.textFaint }}>{m.label}</span>
              <div className="absolute bottom-0.5 right-1 opacity-0 group-hover:opacity-100 transition-opacity"><span style={{ fontFamily: "'Manrope', sans-serif", fontSize: "7px", color: t.textGhost }}>{m.source}</span></div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <span style={{ ...TY.label, fontSize: "8px", color: t.textGhost }}>FINANCIALS</span>
        <div className="mt-2 rounded-xl p-3" style={{ background: t.surface, border: `1px solid ${t.borderSubtle}` }}>
          <div className="space-y-1.5">
            <div className="flex justify-between"><span style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 400, fontSize: "11px", color: t.textMuted }}>Total trips</span><span style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 500, fontSize: "11px", color: t.text }}>{fleet.totalTrips.toLocaleString()}</span></div>
            <div className="flex justify-between"><span style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 400, fontSize: "11px", color: t.textMuted }}>Monthly earnings</span><span style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 500, fontSize: "11px", color: t.text }}>{fleet.monthlyEarnings > 0 ? formatNaira(fleet.monthlyEarnings) : "—"}</span></div>
            <div className="flex justify-between"><span style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 400, fontSize: "11px", color: t.textMuted }}>JET commission ({fleet.commission}%)</span><span style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 500, fontSize: "11px", color: BRAND.green }}>{fleet.monthlyEarnings > 0 ? formatNaira(Math.round(fleet.monthlyEarnings * fleet.commission / 100)) : "—"}</span></div>
            <div className="h-px" style={{ background: t.borderSubtle }} />
            <div className="flex justify-between"><span style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 500, fontSize: "11px", color: t.text }}>Payout ({fleet.payouts.filter(p => p.status === "completed").length} completed)</span><span style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 600, fontSize: "12px", color: BRAND.green }}>{formatNaira(fleet.payouts.filter(p => p.status === "completed").reduce((a, p) => a + p.amount, 0))}</span></div>
            {fleet.pendingPayout > 0 && (
              <div className="flex justify-between"><span style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 500, fontSize: "11px", color: STATUS.warning }}>Pending</span><span style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 600, fontSize: "12px", color: STATUS.warning }}>{formatNaira(fleet.pendingPayout)}</span></div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
