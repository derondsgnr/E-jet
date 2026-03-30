/**
 * JET ADMIN — HOTELS SURFACE (E2E)
 *
 * Surfaces wired:
 *   Row click → SIDE DRAWER (hotel summary + actions)
 *   Full Profile → inner SIDE DRAWER (expanded profile with all data)
 *   Invoices → inner SIDE DRAWER (invoice ledger, mark paid, send reminder)
 *   API Keys → inner SIDE DRAWER (key list, generate, revoke)
 *   Contact Hotel → inner SIDE DRAWER (message compose)
 *   Suspend Partnership → CENTER MODAL (destructive, persistent)
 *   Adjust Commission → CENTER MODAL (financial impact)
 *
 * Layout: Pipeline stages strip → KPI inline → sortable table → row click → drawer
 * Pattern: Stripe Connect accounts, Salesforce partner management
 */

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Building2, Search, Star, MapPin, Phone, Mail, CreditCard,
  AlertTriangle, CheckCircle2, Clock, Filter, ChevronDown, ChevronRight,
  ExternalLink, X, Plus, Globe2, Key, Wifi, WifiOff,
  ArrowUpRight, Scale, Ban, Users, Activity, Zap,
  FileText, RefreshCcw, Send, Eye, EyeOff, Copy, Trash2,
  Receipt, DollarSign, Bell, MessageSquare, Percent, Shield,
} from "lucide-react";
import { useAdminTheme, TY, BRAND, STATUS } from "../../../config/admin-theme";
import { AdminModal, AdminDrawer, ModalHeader, ModalFooter, SurfaceButton } from "../ui/surfaces";

/* ═══ Types ═══ */
type HotelStage = "onboarding" | "integration" | "active" | "at_risk" | "suspended";
type IntegrationStatus = "live" | "testing" | "pending" | "error";
type HotelTier = "enterprise" | "premium" | "standard";
type InvoiceStatus = "paid" | "pending" | "overdue" | "disputed";

const STAGE_META: Record<HotelStage, { label: string; color: string }> = {
  onboarding: { label: "Onboarding", color: STATUS.info },
  integration: { label: "Integration", color: "#8B5CF6" },
  active: { label: "Active", color: BRAND.green },
  at_risk: { label: "At Risk", color: STATUS.warning },
  suspended: { label: "Suspended", color: STATUS.error },
};

const TIER_META: Record<HotelTier, { label: string; color: string }> = {
  enterprise: { label: "Enterprise", color: "#8B5CF6" },
  premium: { label: "Premium", color: BRAND.green },
  standard: { label: "Standard", color: STATUS.neutral },
};

const INT_META: Record<IntegrationStatus, { label: string; color: string; icon: typeof Wifi }> = {
  live: { label: "Live", color: BRAND.green, icon: Wifi },
  testing: { label: "Testing", color: STATUS.info, icon: Activity },
  pending: { label: "Pending", color: STATUS.neutral, icon: Clock },
  error: { label: "Error", color: STATUS.error, icon: WifiOff },
};

const INV_STATUS: Record<InvoiceStatus, { label: string; color: string }> = {
  paid: { label: "Paid", color: BRAND.green },
  pending: { label: "Pending", color: STATUS.warning },
  overdue: { label: "Overdue", color: STATUS.error },
  disputed: { label: "Disputed", color: "#8B5CF6" },
};

interface HotelInvoice {
  id: string;
  period: string;
  amount: number;
  commission: number;
  status: InvoiceStatus;
  dueDate: string;
  paidDate?: string;
  bookingCount: number;
}

interface HotelApiKey {
  id: string;
  name: string;
  prefix: string;
  created: string;
  lastUsed: string;
  status: "active" | "revoked";
  scopes: string[];
}

interface Hotel {
  id: string;
  name: string;
  city: string;
  address: string;
  stars: number;
  tier: HotelTier;
  stage: HotelStage;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  integration: IntegrationStatus;
  commission: number;
  monthlyBookings: number;
  monthlyRevenue: number;
  totalBookings: number;
  outstandingInvoice: number;
  overdueAmount: number;
  teamSize: number;
  joinDate: string;
  lastBooking: string;
  apiKeyCount: number;
  webhookHealth: number;
  invoices: HotelInvoice[];
  apiKeys: HotelApiKey[];
  recentGuests: { name: string; room: string; trips: number; lastTrip: string }[];
}

const mkInvoices = (monthlyRev: number, totalBookings: number): HotelInvoice[] => {
  if (monthlyRev === 0) return [];
  const months = ["Mar 2026", "Feb 2026", "Jan 2026", "Dec 2025", "Nov 2025"];
  return months.map((period, i) => {
    const variance = 0.85 + Math.random() * 0.3;
    const amt = Math.round(monthlyRev * variance);
    const comm = Math.round(amt * 0.18);
    const bk = Math.round((totalBookings / 8) * variance);
    const status: InvoiceStatus = i === 0 ? "pending" : i === 1 && Math.random() > 0.5 ? "pending" : "paid";
    return {
      id: `INV-${String(2600 + i * 100 - Math.round(Math.random() * 50))}`,
      period, amount: amt, commission: comm, status,
      dueDate: i === 0 ? "Apr 15, 2026" : `${months[i]} 15`,
      paidDate: status === "paid" ? `${months[i]} 12` : undefined,
      bookingCount: bk,
    };
  });
};

const mkApiKeys = (count: number): HotelApiKey[] => {
  if (count === 0) return [];
  const keys: HotelApiKey[] = [
    { id: "key-1", name: "Production", prefix: "jet_live_", created: "2025-06-15", lastUsed: "2h ago", status: "active", scopes: ["bookings:write", "guests:read", "tracking:read"] },
    { id: "key-2", name: "Staging", prefix: "jet_test_", created: "2025-06-10", lastUsed: "3d ago", status: "active", scopes: ["bookings:write", "guests:read"] },
  ];
  return keys.slice(0, count);
};

const HOTELS: Hotel[] = [
  { id: "HTL-001", name: "Eko Hotels & Suites", city: "Lagos", address: "Victoria Island", stars: 5, tier: "enterprise", stage: "active", contactName: "Adaeze Okafor", contactEmail: "adaeze@ekohotels.com", contactPhone: "+234 801 234 5678", integration: "live", commission: 18, monthlyBookings: 342, monthlyRevenue: 4_275_000, totalBookings: 2_840, outstandingInvoice: 1_200_000, overdueAmount: 0, teamSize: 8, joinDate: "2025-03-15", lastBooking: "15m ago", apiKeyCount: 2, webhookHealth: 98,
    invoices: mkInvoices(4_275_000, 2_840), apiKeys: mkApiKeys(2),
    recentGuests: [{ name: "Adebayo O.", room: "1204", trips: 3, lastTrip: "2h ago" }, { name: "Ngozi E.", room: "805", trips: 1, lastTrip: "Yesterday" }, { name: "Michael D.", room: "1102", trips: 2, lastTrip: "3d ago" }],
  },
  { id: "HTL-002", name: "Transcorp Hilton", city: "Abuja", address: "Maitama", stars: 5, tier: "enterprise", stage: "active", contactName: "Ibrahim Sule", contactEmail: "isule@transcorphilton.com", contactPhone: "+234 802 345 6789", integration: "live", commission: 18, monthlyBookings: 289, monthlyRevenue: 3_612_500, totalBookings: 2_150, outstandingInvoice: 980_000, overdueAmount: 0, teamSize: 6, joinDate: "2025-04-22", lastBooking: "1h ago", apiKeyCount: 2, webhookHealth: 100,
    invoices: mkInvoices(3_612_500, 2_150), apiKeys: mkApiKeys(2),
    recentGuests: [{ name: "Amina B.", room: "702", trips: 2, lastTrip: "1h ago" }, { name: "Tunde B.", room: "1501", trips: 4, lastTrip: "5h ago" }],
  },
  { id: "HTL-003", name: "Four Points Sheraton", city: "Lagos", address: "Lekki Phase 1", stars: 4, tier: "premium", stage: "active", contactName: "Kemi Adeola", contactEmail: "kemi@fourpointslagos.com", contactPhone: "+234 803 456 7890", integration: "live", commission: 18, monthlyBookings: 178, monthlyRevenue: 2_225_000, totalBookings: 1_420, outstandingInvoice: 0, overdueAmount: 0, teamSize: 4, joinDate: "2025-06-10", lastBooking: "3h ago", apiKeyCount: 1, webhookHealth: 95,
    invoices: mkInvoices(2_225_000, 1_420), apiKeys: mkApiKeys(1),
    recentGuests: [{ name: "Folake A.", room: "306", trips: 1, lastTrip: "3h ago" }],
  },
  { id: "HTL-004", name: "Radisson Blu Lagos", city: "Lagos", address: "Ikeja GRA", stars: 4, tier: "premium", stage: "active", contactName: "Tunde Bakare", contactEmail: "tunde@radissonblu.com", contactPhone: "+234 804 567 8901", integration: "live", commission: 18, monthlyBookings: 156, monthlyRevenue: 1_950_000, totalBookings: 890, outstandingInvoice: 650_000, overdueAmount: 0, teamSize: 3, joinDate: "2025-08-18", lastBooking: "2h ago", apiKeyCount: 1, webhookHealth: 92,
    invoices: mkInvoices(1_950_000, 890), apiKeys: mkApiKeys(1),
    recentGuests: [{ name: "Chidi E.", room: "412", trips: 2, lastTrip: "2h ago" }],
  },
  { id: "HTL-005", name: "Lagos Continental", city: "Lagos", address: "Victoria Island", stars: 5, tier: "premium", stage: "at_risk", contactName: "Folake Ogun", contactEmail: "folake@lagoscont.com", contactPhone: "+234 805 678 9012", integration: "error", commission: 18, monthlyBookings: 24, monthlyRevenue: 300_000, totalBookings: 680, outstandingInvoice: 420_000, overdueAmount: 420_000, teamSize: 3, joinDate: "2025-05-30", lastBooking: "12d ago", apiKeyCount: 1, webhookHealth: 34,
    invoices: [
      { id: "INV-2580", period: "Mar 2026", amount: 300_000, commission: 54_000, status: "overdue", dueDate: "Mar 15, 2026", bookingCount: 24 },
      { id: "INV-2490", period: "Feb 2026", amount: 120_000, commission: 21_600, status: "overdue", dueDate: "Feb 15, 2026", bookingCount: 10 },
      { id: "INV-2380", period: "Jan 2026", amount: 840_000, commission: 151_200, status: "paid", dueDate: "Jan 15, 2026", paidDate: "Jan 18, 2026", bookingCount: 68 },
    ],
    apiKeys: mkApiKeys(1),
    recentGuests: [],
  },
  { id: "HTL-006", name: "Protea Hotel Ikeja", city: "Lagos", address: "Ikeja", stars: 3, tier: "standard", stage: "active", contactName: "Emeka Obi", contactEmail: "emeka@protea.com", contactPhone: "+234 806 789 0123", integration: "live", commission: 18, monthlyBookings: 89, monthlyRevenue: 890_000, totalBookings: 520, outstandingInvoice: 0, overdueAmount: 0, teamSize: 2, joinDate: "2025-09-14", lastBooking: "5h ago", apiKeyCount: 1, webhookHealth: 88,
    invoices: mkInvoices(890_000, 520), apiKeys: mkApiKeys(1),
    recentGuests: [{ name: "Kemi O.", room: "201", trips: 1, lastTrip: "5h ago" }],
  },
  { id: "HTL-007", name: "BON Hotel Abuja", city: "Abuja", address: "Wuse 2", stars: 3, tier: "standard", stage: "integration", contactName: "Amina Bello", contactEmail: "amina@bonhotel.com", contactPhone: "+234 807 890 1234", integration: "testing", commission: 18, monthlyBookings: 0, monthlyRevenue: 0, totalBookings: 0, outstandingInvoice: 0, overdueAmount: 0, teamSize: 2, joinDate: "2026-02-20", lastBooking: "—", apiKeyCount: 1, webhookHealth: 72,
    invoices: [], apiKeys: mkApiKeys(1),
    recentGuests: [],
  },
  { id: "HTL-008", name: "Grand Ibro Hotel", city: "Abuja", address: "Garki", stars: 3, tier: "standard", stage: "onboarding", contactName: "Yusuf Garba", contactEmail: "yusuf@grandibro.com", contactPhone: "+234 808 901 2345", integration: "pending", commission: 18, monthlyBookings: 0, monthlyRevenue: 0, totalBookings: 0, outstandingInvoice: 0, overdueAmount: 0, teamSize: 0, joinDate: "2026-03-10", lastBooking: "—", apiKeyCount: 0, webhookHealth: 0,
    invoices: [], apiKeys: [],
    recentGuests: [],
  },
  { id: "HTL-009", name: "Prestige Hotel", city: "Port Harcourt", address: "GRA", stars: 3, tier: "standard", stage: "suspended", contactName: "Chibuike Eze", contactEmail: "chi@prestige.com", contactPhone: "+234 809 012 3456", integration: "error", commission: 18, monthlyBookings: 0, monthlyRevenue: 0, totalBookings: 180, outstandingInvoice: 340_000, overdueAmount: 340_000, teamSize: 1, joinDate: "2025-07-22", lastBooking: "45d ago", apiKeyCount: 1, webhookHealth: 0,
    invoices: [
      { id: "INV-2410", period: "Jan 2026", amount: 340_000, commission: 61_200, status: "overdue", dueDate: "Jan 15, 2026", bookingCount: 28 },
      { id: "INV-2310", period: "Dec 2025", amount: 280_000, commission: 50_400, status: "paid", dueDate: "Dec 15, 2025", paidDate: "Dec 20, 2025", bookingCount: 22 },
    ],
    apiKeys: mkApiKeys(1),
    recentGuests: [],
  },
];

const formatNaira = (v: number) => {
  if (v >= 1_000_000) return `₦${(v / 1_000_000).toFixed(1)}M`;
  if (v >= 1_000) return `₦${(v / 1_000).toFixed(0)}k`;
  return `₦${v.toLocaleString()}`;
};

const HOTEL_KPI = {
  totalPartners: HOTELS.length,
  active: HOTELS.filter(h => h.stage === "active").length,
  monthlyBookings: HOTELS.reduce((a, h) => a + h.monthlyBookings, 0),
  monthlyRevenue: HOTELS.reduce((a, h) => a + h.monthlyRevenue, 0),
  overdueTotal: HOTELS.reduce((a, h) => a + h.overdueAmount, 0),
  integrationErrors: HOTELS.filter(h => h.integration === "error").length,
};

/* ═══════════════════════════════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════════════════════════════ */

export function AdminHotelsPage() {
  const { theme, t } = useAdminTheme();
  const isDark = theme === "dark";

  const [search, setSearch] = useState("");
  const [stageFilter, setStageFilter] = useState<HotelStage | "all">("all");
  const [selectedHotel, setSelectedHotel] = useState<Hotel | null>(null);

  // Sub-surface states
  const [showSuspendModal, setShowSuspendModal] = useState(false);
  const [showCommissionModal, setShowCommissionModal] = useState(false);
  const [subDrawer, setSubDrawer] = useState<"invoices" | "apikeys" | "contact" | "profile" | null>(null);
  const [suspendReason, setSuspendReason] = useState("");
  const [newCommission, setNewCommission] = useState("");

  const filtered = useMemo(() => {
    let list = [...HOTELS];
    if (stageFilter !== "all") list = list.filter(h => h.stage === stageFilter);
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(h => h.name.toLowerCase().includes(q) || h.city.toLowerCase().includes(q) || h.id.toLowerCase().includes(q));
    }
    return list;
  }, [stageFilter, search]);

  const openSub = (drawer: typeof subDrawer) => setSubDrawer(drawer);
  const closeSub = () => setSubDrawer(null);

  return (
    <div className="flex h-full overflow-hidden">
      <div className={`flex-1 flex flex-col overflow-hidden transition-all ${selectedHotel ? "hidden md:flex" : "flex"}`}>
        {/* ─── Pipeline Strip ─── */}
        <div className="shrink-0 flex items-center gap-2 px-4 py-3 overflow-x-auto" style={{ borderBottom: `1px solid ${t.borderSubtle}` }}>
          {(["all", "onboarding", "integration", "active", "at_risk", "suspended"] as const).map(s => {
            const active = stageFilter === s;
            const meta = s !== "all" ? STAGE_META[s] : null;
            const count = s === "all" ? HOTELS.length : HOTELS.filter(h => h.stage === s).length;
            return (
              <button
                key={s}
                className="flex items-center gap-1.5 h-8 px-3 rounded-lg shrink-0 transition-all"
                style={{
                  background: active ? (meta ? `${meta.color}12` : (isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)")) : "transparent",
                  border: `1px solid ${active ? (meta ? `${meta.color}25` : t.borderStrong) : "transparent"}`,
                }}
                onClick={() => setStageFilter(s)}
              >
                {meta && <span className="w-1.5 h-1.5 rounded-full" style={{ background: meta.color }} />}
                <span style={{ fontFamily: "'Manrope', sans-serif", fontWeight: active ? 500 : 400, fontSize: "11px", letterSpacing: "-0.02em", color: active ? (meta?.color || t.text) : t.textMuted }}>
                  {s === "all" ? "All" : meta!.label}
                </span>
                <span style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 500, fontSize: "9px", color: active ? (meta?.color || t.textMuted) : t.textGhost }}>{count}</span>
              </button>
            );
          })}

          {/* KPIs inline */}
          <div className="ml-auto flex items-center gap-4 shrink-0">
            {[
              { label: "Monthly Vol", value: formatNaira(HOTEL_KPI.monthlyRevenue), color: BRAND.green, source: "trips.source=hotel.sum(fare, 30d)" },
              { label: "Bookings/mo", value: HOTEL_KPI.monthlyBookings.toLocaleString(), color: t.text, source: "trips.source=hotel.count(30d)" },
              { label: "Overdue", value: HOTEL_KPI.overdueTotal > 0 ? formatNaira(HOTEL_KPI.overdueTotal) : "₦0", color: HOTEL_KPI.overdueTotal > 0 ? STATUS.error : t.textFaint, source: "invoices.status=overdue.sum" },
            ].map(kpi => (
              <div key={kpi.label} className="flex items-baseline gap-1 group relative">
                <span style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 600, fontSize: "14px", letterSpacing: "-0.03em", color: kpi.color }}>{kpi.value}</span>
                <span style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 400, fontSize: "9px", color: t.textFaint }}>{kpi.label}</span>
                <div className="absolute -bottom-3 right-0 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span style={{ fontFamily: "'Manrope', sans-serif", fontSize: "7px", color: t.textGhost }}>{kpi.source}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ─── Search Bar ─── */}
        <div className="shrink-0 flex items-center gap-2 px-4 py-2" style={{ borderBottom: `1px solid ${t.borderSubtle}` }}>
          <div className="flex items-center gap-2 h-8 px-3 rounded-lg flex-1 max-w-xs" style={{ background: isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.03)", border: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}` }}>
            <Search size={12} style={{ color: t.textFaint }} />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search hotels…" className="flex-1 bg-transparent outline-none" style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 400, fontSize: "12px", letterSpacing: "-0.02em", color: t.text }} />
            {search && <button onClick={() => setSearch("")}><X size={10} style={{ color: t.textFaint }} /></button>}
          </div>
          <span className="ml-auto" style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 400, fontSize: "10px", color: t.textFaint }}>{filtered.length} partner{filtered.length !== 1 ? "s" : ""}</span>
        </div>

        {/* ─── TABLE ─── */}
        <div className="flex-1 overflow-auto">
          <table className="w-full min-w-[900px]" style={{ borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: `1px solid ${t.borderSubtle}` }}>
                {["Hotel", "Stage", "Tier", "Integration", "Bookings/mo", "Revenue/mo", "Outstanding", "Team", "Last Booking"].map(h => (
                  <th key={h} className="text-left px-3 h-9">
                    <span style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 600, fontSize: "9px", letterSpacing: "0.05em", textTransform: "uppercase" as const, color: t.textFaint }}>{h}</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((hotel, i) => {
                const stg = STAGE_META[hotel.stage];
                const tier = TIER_META[hotel.tier];
                const intg = INT_META[hotel.integration];
                const isSelected = selectedHotel?.id === hotel.id;

                return (
                  <motion.tr
                    key={hotel.id}
                    className="cursor-pointer transition-colors"
                    style={{ borderBottom: `1px solid ${t.borderSubtle}`, background: isSelected ? t.surfaceActive : "transparent" }}
                    onClick={() => { setSelectedHotel(hotel); setSubDrawer(null); }}
                    onMouseEnter={e => { if (!isSelected) (e.currentTarget as HTMLElement).style.background = isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.015)"; }}
                    onMouseLeave={e => { if (!isSelected) (e.currentTarget as HTMLElement).style.background = "transparent"; }}
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.02 + i * 0.02 }}
                  >
                    <td className="px-3 py-2.5">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: `${stg.color}10` }}>
                          <Building2 size={14} style={{ color: stg.color }} />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="truncate" style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 500, fontSize: "13px", letterSpacing: "-0.02em", color: t.text }}>{hotel.name}</span>
                            {hotel.stars >= 5 && <Star size={9} style={{ color: "#F59E0B", fill: "#F59E0B" }} />}
                          </div>
                          <span style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 400, fontSize: "10px", color: t.textFaint }}>{hotel.city} · {hotel.address}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-2.5">
                      <div className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full" style={{ background: stg.color }} />
                        <span style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 500, fontSize: "11px", color: stg.color }}>{stg.label}</span>
                      </div>
                    </td>
                    <td className="px-3 py-2.5">
                      <span className="px-1.5 py-0.5 rounded" style={{ background: `${tier.color}10`, fontFamily: "'Manrope', sans-serif", fontWeight: 500, fontSize: "10px", color: tier.color }}>{tier.label}</span>
                    </td>
                    <td className="px-3 py-2.5">
                      <div className="flex items-center gap-1.5">
                        <intg.icon size={10} style={{ color: intg.color }} />
                        <span style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 500, fontSize: "11px", color: intg.color }}>{intg.label}</span>
                        {hotel.integration === "live" && (
                          <span style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 400, fontSize: "9px", color: t.textGhost }}>{hotel.webhookHealth}%</span>
                        )}
                      </div>
                    </td>
                    <td className="px-3 py-2.5 text-right">
                      <span style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 500, fontSize: "12px", color: hotel.monthlyBookings > 0 ? t.text : t.textGhost }}>{hotel.monthlyBookings || "—"}</span>
                    </td>
                    <td className="px-3 py-2.5 text-right">
                      <span style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 500, fontSize: "12px", color: hotel.monthlyRevenue > 0 ? t.text : t.textGhost }}>{hotel.monthlyRevenue > 0 ? formatNaira(hotel.monthlyRevenue) : "—"}</span>
                    </td>
                    <td className="px-3 py-2.5 text-right">
                      {hotel.overdueAmount > 0 ? (
                        <div className="flex items-center justify-end gap-1">
                          <AlertTriangle size={9} style={{ color: STATUS.error }} />
                          <span style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 500, fontSize: "12px", color: STATUS.error }}>{formatNaira(hotel.overdueAmount)}</span>
                        </div>
                      ) : hotel.outstandingInvoice > 0 ? (
                        <span style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 500, fontSize: "12px", color: STATUS.warning }}>{formatNaira(hotel.outstandingInvoice)}</span>
                      ) : (
                        <span style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 400, fontSize: "12px", color: t.textGhost }}>—</span>
                      )}
                    </td>
                    <td className="px-3 py-2.5">
                      <div className="flex items-center gap-1">
                        <Users size={10} style={{ color: t.iconMuted }} />
                        <span style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 400, fontSize: "11px", color: t.textMuted }}>{hotel.teamSize}</span>
                      </div>
                    </td>
                    <td className="px-3 py-2.5">
                      <span style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 400, fontSize: "11px", color: t.textFaint }}>{hotel.lastBooking}</span>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>

          {filtered.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16">
              <Building2 size={20} style={{ color: t.textGhost, marginBottom: 8 }} />
              <span style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 600, fontSize: "12px", color: t.textSecondary }}>No hotels match</span>
              <span className="block mt-1" style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 400, fontSize: "11px", color: t.textMuted }}>Adjust filters or search</span>
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

      {/* ═══ PRIMARY DRAWER — Hotel Summary ═══ */}
      <AdminDrawer open={!!selectedHotel && !subDrawer} onClose={() => setSelectedHotel(null)} title={selectedHotel?.name} subtitle={selectedHotel?.id} width={460}>
        {selectedHotel && (
          <HotelSummaryDrawer
            hotel={selectedHotel} isDark={isDark} t={t}
            onSuspend={() => setShowSuspendModal(true)}
            onCommission={() => { setNewCommission(String(selectedHotel.commission)); setShowCommissionModal(true); }}
            onInvoices={() => openSub("invoices")}
            onApiKeys={() => openSub("apikeys")}
            onContact={() => openSub("contact")}
            onProfile={() => openSub("profile")}
          />
        )}
      </AdminDrawer>

      {/* ═══ SUB-DRAWER: Invoices ═══ */}
      <AdminDrawer open={subDrawer === "invoices"} onClose={closeSub} title="Invoices" subtitle={selectedHotel?.name} width={500}>
        {selectedHotel && <InvoicesDrawer hotel={selectedHotel} isDark={isDark} t={t} />}
      </AdminDrawer>

      {/* ═══ SUB-DRAWER: API Keys ═══ */}
      <AdminDrawer open={subDrawer === "apikeys"} onClose={closeSub} title="API Keys" subtitle={selectedHotel?.name} width={480}>
        {selectedHotel && <ApiKeysDrawer hotel={selectedHotel} isDark={isDark} t={t} />}
      </AdminDrawer>

      {/* ═══ SUB-DRAWER: Contact ═══ */}
      <AdminDrawer open={subDrawer === "contact"} onClose={closeSub} title="Contact Hotel" subtitle={selectedHotel?.contactName} width={440}>
        {selectedHotel && <ContactDrawer hotel={selectedHotel} isDark={isDark} t={t} onSend={closeSub} />}
      </AdminDrawer>

      {/* ═══ SUB-DRAWER: Full Profile ═══ */}
      <AdminDrawer open={subDrawer === "profile"} onClose={closeSub} title="Hotel Profile" subtitle={selectedHotel?.name} width={520}>
        {selectedHotel && <FullProfileDrawer hotel={selectedHotel} isDark={isDark} t={t} />}
      </AdminDrawer>

      {/* ═══ SUSPEND MODAL ═══ */}
      <AdminModal open={showSuspendModal} onClose={() => setShowSuspendModal(false)} width={480} danger persistent>
        {selectedHotel && (
          <div>
            <ModalHeader
              title={selectedHotel.stage === "suspended" ? "Reactivate Partnership" : "Suspend Partnership"}
              subtitle={`${selectedHotel.name} · ${selectedHotel.totalBookings} lifetime bookings`}
              onClose={() => setShowSuspendModal(false)}
              icon={<Ban size={16} style={{ color: selectedHotel.stage === "suspended" ? BRAND.green : STATUS.error }} />}
              accentColor={selectedHotel.stage === "suspended" ? BRAND.green : STATUS.error}
            />
            <div className="px-6 py-5 space-y-4">
              <div className="rounded-xl p-3" style={{ background: `${selectedHotel.stage === "suspended" ? BRAND.green : STATUS.error}08`, border: `1px solid ${selectedHotel.stage === "suspended" ? BRAND.green : STATUS.error}15` }}>
                <span style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 400, fontSize: "11px", lineHeight: "1.5", color: selectedHotel.stage === "suspended" ? BRAND.green : STATUS.error }}>
                  {selectedHotel.stage === "suspended"
                    ? "Reactivating restores booking ability and API access."
                    : "Suspending disables booking, API access, and queues outstanding invoices."}
                </span>
              </div>
              {selectedHotel.stage !== "suspended" && (
                <>
                  <textarea
                    value={suspendReason}
                    onChange={e => setSuspendReason(e.target.value)}
                    placeholder="Reason for suspension…"
                    rows={3}
                    className="w-full px-3 py-2.5 rounded-xl bg-transparent outline-none resize-none"
                    style={{ border: `1px solid ${isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)"}`, fontFamily: "'Manrope', sans-serif", fontSize: "12px", lineHeight: "1.5", color: t.text }}
                  />
                  {/* Impact summary */}
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { label: "Active Bookings", value: selectedHotel.monthlyBookings > 0 ? "Will be cancelled" : "None" },
                      { label: "Outstanding", value: selectedHotel.outstandingInvoice > 0 ? formatNaira(selectedHotel.outstandingInvoice) : "₦0" },
                      { label: "API Keys", value: `${selectedHotel.apiKeyCount} will be revoked` },
                      { label: "Guest Impact", value: selectedHotel.recentGuests.length > 0 ? `${selectedHotel.recentGuests.length} active guests` : "None" },
                    ].map(m => (
                      <div key={m.label} className="rounded-lg p-2" style={{ background: isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)", border: `1px solid ${isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.04)"}` }}>
                        <span className="block" style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 500, fontSize: "11px", color: t.text }}>{m.value}</span>
                        <span style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 400, fontSize: "9px", color: t.textFaint }}>{m.label}</span>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
            <ModalFooter>
              <SurfaceButton label="Cancel" variant="ghost" onClick={() => { setShowSuspendModal(false); setSuspendReason(""); }} />
              <SurfaceButton
                label={selectedHotel.stage === "suspended" ? "Reactivate" : "Suspend Partnership"}
                variant={selectedHotel.stage === "suspended" ? "primary" : "danger"}
                icon={selectedHotel.stage === "suspended" ? <RefreshCcw size={13} /> : <Ban size={13} />}
                onClick={() => { setShowSuspendModal(false); setSuspendReason(""); }}
              />
            </ModalFooter>
          </div>
        )}
      </AdminModal>

      {/* ═══ COMMISSION MODAL ═══ */}
      <AdminModal open={showCommissionModal} onClose={() => setShowCommissionModal(false)} width={440}>
        {selectedHotel && (
          <div>
            <ModalHeader
              title="Adjust Commission"
              subtitle={`${selectedHotel.name} · Currently ${selectedHotel.commission}%`}
              onClose={() => setShowCommissionModal(false)}
              icon={<Percent size={16} style={{ color: BRAND.green }} />}
              accentColor={BRAND.green}
            />
            <div className="px-6 py-5 space-y-4">
              <div>
                <span className="block mb-1.5" style={{ ...TY.label, fontSize: "9px", color: t.textFaint }}>NEW RATE (%)</span>
                <div className="flex items-center gap-2 h-11 px-3 rounded-xl" style={{ background: isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.02)", border: `1px solid ${isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)"}` }}>
                  <input
                    value={newCommission}
                    onChange={e => setNewCommission(e.target.value.replace(/[^0-9.]/g, ""))}
                    className="flex-1 bg-transparent outline-none"
                    style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 600, fontSize: "18px", letterSpacing: "-0.03em", color: t.text }}
                  />
                  <span style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 500, fontSize: "14px", color: t.textMuted }}>%</span>
                </div>
              </div>
              <div className="rounded-xl p-3" style={{ background: `${BRAND.green}06`, border: `1px solid ${BRAND.green}12` }}>
                <span style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 400, fontSize: "11px", lineHeight: "1.5", color: t.textSecondary }}>
                  At {newCommission || selectedHotel.commission}% on {selectedHotel.monthlyBookings} monthly bookings, estimated monthly commission: <span style={{ fontWeight: 600, color: BRAND.green }}>{formatNaira(Math.round(selectedHotel.monthlyRevenue * (Number(newCommission || selectedHotel.commission) / 100)))}</span>
                </span>
              </div>
            </div>
            <ModalFooter>
              <SurfaceButton label="Cancel" variant="ghost" onClick={() => setShowCommissionModal(false)} />
              <SurfaceButton label="Update Commission" variant="primary" icon={<CheckCircle2 size={13} />} onClick={() => setShowCommissionModal(false)} />
            </ModalFooter>
          </div>
        )}
      </AdminModal>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   HOTEL SUMMARY DRAWER
   ═══════════════════════════════════════════════════════════════════════════ */

function HotelSummaryDrawer({ hotel, isDark, t, onSuspend, onCommission, onInvoices, onApiKeys, onContact, onProfile }: {
  hotel: Hotel; isDark: boolean; t: any;
  onSuspend: () => void; onCommission: () => void;
  onInvoices: () => void; onApiKeys: () => void;
  onContact: () => void; onProfile: () => void;
}) {
  const stg = STAGE_META[hotel.stage];
  const tier = TIER_META[hotel.tier];
  const intg = INT_META[hotel.integration];

  return (
    <div className="px-5 py-4 space-y-4">
      {/* Stage + Tier */}
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1.5 h-6 px-2 rounded-md" style={{ background: `${stg.color}12`, border: `1px solid ${stg.color}20` }}>
          <span className="w-1.5 h-1.5 rounded-full" style={{ background: stg.color }} />
          <span style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 500, fontSize: "10px", color: stg.color }}>{stg.label}</span>
        </div>
        <span className="px-1.5 py-0.5 rounded" style={{ background: `${tier.color}10`, fontFamily: "'Manrope', sans-serif", fontWeight: 500, fontSize: "9px", color: tier.color }}>{tier.label}</span>
        <div className="flex items-center gap-0.5">
          {Array.from({ length: hotel.stars }).map((_, i) => (
            <Star key={i} size={8} style={{ color: "#F59E0B", fill: "#F59E0B" }} />
          ))}
        </div>
      </div>

      {/* Contact */}
      <div className="rounded-xl p-3 space-y-1.5" style={{ background: t.surface, border: `1px solid ${t.borderSubtle}` }}>
        {[
          { icon: Users, value: hotel.contactName },
          { icon: Mail, value: hotel.contactEmail },
          { icon: Phone, value: hotel.contactPhone },
          { icon: MapPin, value: `${hotel.city} — ${hotel.address}` },
          { icon: Clock, value: `Partner since ${hotel.joinDate}` },
        ].map(({ icon: Icon, value }) => (
          <div key={value} className="flex items-center gap-2">
            <Icon size={11} style={{ color: t.iconMuted }} />
            <span style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 400, fontSize: "12px", color: t.text }}>{value}</span>
          </div>
        ))}
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 gap-2">
        {[
          { label: "Monthly Bookings", value: hotel.monthlyBookings || "—", color: hotel.monthlyBookings ? t.text : t.textGhost, source: "trips.hotel_id.count(30d)" },
          { label: "Monthly Revenue", value: hotel.monthlyRevenue ? formatNaira(hotel.monthlyRevenue) : "—", color: hotel.monthlyRevenue ? BRAND.green : t.textGhost, source: "trips.hotel_id.sum(fare, 30d)" },
          { label: "Total Bookings", value: hotel.totalBookings.toLocaleString(), color: t.text, source: "trips.hotel_id.count(all)" },
          { label: "Commission", value: `${hotel.commission}%`, color: BRAND.green, source: "hotel_partners.commission_rate" },
        ].map(m => (
          <div key={m.label} className="p-3 rounded-xl group relative" style={{ background: t.surface, border: `1px solid ${t.borderSubtle}` }}>
            <span className="block" style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 600, fontSize: "16px", letterSpacing: "-0.03em", lineHeight: "1.2", color: m.color }}>{m.value}</span>
            <span style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 400, fontSize: "10px", color: t.textFaint }}>{m.label}</span>
            <div className="absolute bottom-0.5 right-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
              <span style={{ fontFamily: "'Manrope', sans-serif", fontSize: "7px", color: t.textGhost }}>{m.source}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Integration health */}
      <div className="rounded-xl p-3" style={{ background: hotel.integration === "error" ? `${STATUS.error}06` : t.surface, border: `1px solid ${hotel.integration === "error" ? `${STATUS.error}15` : t.borderSubtle}` }}>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5">
            <intg.icon size={12} style={{ color: intg.color }} />
            <span style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 500, fontSize: "12px", color: intg.color }}>Integration: {intg.label}</span>
          </div>
          <span style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 400, fontSize: "10px", color: t.textFaint }}>{hotel.apiKeyCount} API key{hotel.apiKeyCount !== 1 ? "s" : ""}</span>
        </div>
        {hotel.webhookHealth > 0 && (
          <div>
            <div className="flex items-center justify-between mb-1">
              <span style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 400, fontSize: "10px", color: t.textMuted }}>Webhook health</span>
              <span style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 500, fontSize: "10px", color: hotel.webhookHealth < 80 ? STATUS.error : BRAND.green }}>{hotel.webhookHealth}%</span>
            </div>
            <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ background: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)" }}>
              <div className="h-full rounded-full" style={{ width: `${hotel.webhookHealth}%`, background: hotel.webhookHealth < 80 ? STATUS.error : BRAND.green }} />
            </div>
          </div>
        )}
      </div>

      {/* Billing alert */}
      {(hotel.outstandingInvoice > 0 || hotel.overdueAmount > 0) && (
        <div className="rounded-xl p-3" style={{ background: hotel.overdueAmount > 0 ? `${STATUS.error}06` : `${STATUS.warning}06`, border: `1px solid ${hotel.overdueAmount > 0 ? `${STATUS.error}15` : `${STATUS.warning}15`}` }}>
          <div className="flex items-center gap-1.5 mb-1">
            <CreditCard size={11} style={{ color: hotel.overdueAmount > 0 ? STATUS.error : STATUS.warning }} />
            <span style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 600, fontSize: "9px", letterSpacing: "0.04em", textTransform: "uppercase" as const, color: hotel.overdueAmount > 0 ? STATUS.error : STATUS.warning }}>
              {hotel.overdueAmount > 0 ? "Overdue" : "Outstanding"}
            </span>
          </div>
          <span className="block" style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 600, fontSize: "18px", letterSpacing: "-0.03em", color: hotel.overdueAmount > 0 ? STATUS.error : STATUS.warning }}>
            {formatNaira(hotel.overdueAmount || hotel.outstandingInvoice)}
          </span>
        </div>
      )}

      {/* Recent guests */}
      {hotel.recentGuests.length > 0 && (
        <div>
          <span style={{ ...TY.label, fontSize: "8px", color: t.textGhost }}>RECENT GUESTS</span>
          <div className="mt-2 space-y-1">
            {hotel.recentGuests.map((g, i) => (
              <div key={i} className="flex items-center justify-between px-3 py-2 rounded-lg" style={{ background: t.surface, border: `1px solid ${t.borderSubtle}` }}>
                <div className="flex items-center gap-2">
                  <Users size={10} style={{ color: t.iconMuted }} />
                  <span style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 500, fontSize: "12px", color: t.text }}>{g.name}</span>
                  <span style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 400, fontSize: "10px", color: t.textFaint }}>Room {g.room}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 400, fontSize: "10px", color: t.textMuted }}>{g.trips} trip{g.trips !== 1 ? "s" : ""}</span>
                  <span style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 400, fontSize: "9px", color: t.textGhost }}>· {g.lastTrip}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="grid grid-cols-2 gap-2 pt-2">
        {[
          { label: "Full Profile", icon: ExternalLink, onClick: onProfile, color: t.textMuted, bg: isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.03)", border: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)" },
          { label: "Invoices", icon: Receipt, onClick: onInvoices, color: t.textMuted, bg: isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.03)", border: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)" },
          { label: "API Keys", icon: Key, onClick: onApiKeys, color: t.textMuted, bg: isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.03)", border: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)" },
          { label: "Contact", icon: MessageSquare, onClick: onContact, color: t.textMuted, bg: isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.03)", border: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)" },
          { label: "Commission", icon: Percent, onClick: onCommission, color: BRAND.green, bg: `${BRAND.green}06`, border: `${BRAND.green}15` },
          { label: hotel.stage === "suspended" ? "Reactivate" : "Suspend", icon: hotel.stage === "suspended" ? RefreshCcw : Ban, onClick: onSuspend, color: hotel.stage === "suspended" ? BRAND.green : STATUS.error, bg: hotel.stage === "suspended" ? `${BRAND.green}08` : `${STATUS.error}06`, border: hotel.stage === "suspended" ? `${BRAND.green}18` : `${STATUS.error}15` },
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
   INVOICES DRAWER
   ═══════════════════════════════════════════════════════════════════════════ */

function InvoicesDrawer({ hotel, isDark, t }: { hotel: Hotel; isDark: boolean; t: any }) {
  const [confirmingPay, setConfirmingPay] = useState<string | null>(null);

  if (hotel.invoices.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
        <Receipt size={20} style={{ color: t.textGhost, marginBottom: 8 }} />
        <span className="block" style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 600, fontSize: "12px", color: t.textSecondary }}>No invoices yet</span>
        <span style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 400, fontSize: "11px", color: t.textMuted }}>Invoices will appear once the hotel starts generating bookings</span>
      </div>
    );
  }

  const total = hotel.invoices.reduce((a, inv) => a + inv.amount, 0);
  const outstanding = hotel.invoices.filter(inv => inv.status !== "paid").reduce((a, inv) => a + inv.amount, 0);

  return (
    <div className="px-5 py-4 space-y-4">
      {/* Summary */}
      <div className="grid grid-cols-2 gap-2">
        <div className="p-3 rounded-xl" style={{ background: t.surface, border: `1px solid ${t.borderSubtle}` }}>
          <span className="block" style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 600, fontSize: "16px", letterSpacing: "-0.03em", color: t.text }}>{formatNaira(total)}</span>
          <span style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 400, fontSize: "10px", color: t.textFaint }}>Total invoiced</span>
        </div>
        <div className="p-3 rounded-xl" style={{ background: outstanding > 0 ? `${STATUS.warning}06` : t.surface, border: `1px solid ${outstanding > 0 ? `${STATUS.warning}15` : t.borderSubtle}` }}>
          <span className="block" style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 600, fontSize: "16px", letterSpacing: "-0.03em", color: outstanding > 0 ? STATUS.warning : t.textGhost }}>{outstanding > 0 ? formatNaira(outstanding) : "₦0"}</span>
          <span style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 400, fontSize: "10px", color: t.textFaint }}>Outstanding</span>
        </div>
      </div>

      {/* Invoice list */}
      <div className="space-y-2">
        {hotel.invoices.map(inv => {
          const sm = INV_STATUS[inv.status];
          const isConfirming = confirmingPay === inv.id;
          return (
            <div key={inv.id} className="rounded-xl p-3" style={{ background: t.surface, border: `1px solid ${inv.status === "overdue" ? `${STATUS.error}15` : t.borderSubtle}` }}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 500, fontSize: "12px", color: t.text }}>{inv.id}</span>
                  <span className="px-1.5 py-0.5 rounded" style={{ background: `${sm.color}12`, fontFamily: "'Manrope', sans-serif", fontWeight: 500, fontSize: "9px", color: sm.color }}>{sm.label}</span>
                </div>
                <span style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 600, fontSize: "14px", letterSpacing: "-0.03em", color: t.text }}>{formatNaira(inv.amount)}</span>
              </div>
              <div className="flex items-center gap-3 mb-2">
                <span style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 400, fontSize: "10px", color: t.textMuted }}>{inv.period}</span>
                <span style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 400, fontSize: "10px", color: t.textGhost }}>·</span>
                <span style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 400, fontSize: "10px", color: t.textMuted }}>{inv.bookingCount} bookings</span>
                <span style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 400, fontSize: "10px", color: t.textGhost }}>·</span>
                <span style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 400, fontSize: "10px", color: t.textFaint }}>Commission: {formatNaira(inv.commission)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 400, fontSize: "10px", color: inv.status === "overdue" ? STATUS.error : t.textFaint }}>
                  {inv.paidDate ? `Paid ${inv.paidDate}` : `Due ${inv.dueDate}`}
                </span>
                {inv.status !== "paid" && (
                  <div className="flex items-center gap-1.5">
                    {!isConfirming ? (
                      <>
                        <button onClick={() => setConfirmingPay(inv.id)} className="h-7 px-2.5 rounded-lg flex items-center gap-1 transition-opacity hover:opacity-80" style={{ background: `${BRAND.green}10`, border: `1px solid ${BRAND.green}20` }}>
                          <CheckCircle2 size={10} style={{ color: BRAND.green }} />
                          <span style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 500, fontSize: "10px", color: BRAND.green }}>Mark Paid</span>
                        </button>
                        <button className="h-7 px-2.5 rounded-lg flex items-center gap-1 transition-opacity hover:opacity-80" style={{ background: isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.03)", border: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)"}` }}>
                          <Bell size={10} style={{ color: t.textMuted }} />
                          <span style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 500, fontSize: "10px", color: t.textMuted }}>Remind</span>
                        </button>
                      </>
                    ) : (
                      <>
                        <button onClick={() => setConfirmingPay(null)} className="h-7 px-2.5 rounded-lg" style={{ background: isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.03)", border: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)"}` }}>
                          <span style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 500, fontSize: "10px", color: t.textMuted }}>Cancel</span>
                        </button>
                        <button onClick={() => setConfirmingPay(null)} className="h-7 px-2.5 rounded-lg" style={{ background: BRAND.green, border: `1px solid ${BRAND.green}` }}>
                          <span style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 500, fontSize: "10px", color: "#fff" }}>Confirm</span>
                        </button>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   API KEYS DRAWER
   ═══════════════════════════════════════════════════════════════════════════ */

function ApiKeysDrawer({ hotel, isDark, t }: { hotel: Hotel; isDark: boolean; t: any }) {
  const [showKey, setShowKey] = useState<Record<string, boolean>>({});
  const [revoking, setRevoking] = useState<string | null>(null);

  if (hotel.apiKeys.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
        <Key size={20} style={{ color: t.textGhost, marginBottom: 8 }} />
        <span className="block" style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 600, fontSize: "12px", color: t.textSecondary }}>No API keys</span>
        <span className="block mt-1" style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 400, fontSize: "11px", color: t.textMuted }}>Generate a key to enable integration</span>
        <button className="mt-4 h-9 px-4 rounded-xl flex items-center gap-1.5" style={{ background: BRAND.green }}>
          <Plus size={12} style={{ color: "#fff" }} />
          <span style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 500, fontSize: "11px", color: "#fff" }}>Generate Key</span>
        </button>
      </div>
    );
  }

  return (
    <div className="px-5 py-4 space-y-4">
      <div className="flex items-center justify-between">
        <span style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 400, fontSize: "11px", color: t.textMuted }}>{hotel.apiKeys.filter(k => k.status === "active").length} active key{hotel.apiKeys.filter(k => k.status === "active").length !== 1 ? "s" : ""}</span>
        <button className="h-8 px-3 rounded-lg flex items-center gap-1.5 transition-opacity hover:opacity-80" style={{ background: `${BRAND.green}10`, border: `1px solid ${BRAND.green}20` }}>
          <Plus size={11} style={{ color: BRAND.green }} />
          <span style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 500, fontSize: "11px", color: BRAND.green }}>Generate New Key</span>
        </button>
      </div>

      {hotel.apiKeys.map(key => (
        <div key={key.id} className="rounded-xl p-3" style={{ background: key.status === "revoked" ? `${STATUS.error}04` : t.surface, border: `1px solid ${key.status === "revoked" ? `${STATUS.error}10` : t.borderSubtle}` }}>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Key size={12} style={{ color: key.status === "active" ? BRAND.green : STATUS.error }} />
              <span style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 500, fontSize: "12px", color: t.text }}>{key.name}</span>
              <span className="px-1.5 py-0.5 rounded" style={{ background: key.status === "active" ? `${BRAND.green}12` : `${STATUS.error}12`, fontFamily: "'Manrope', sans-serif", fontWeight: 500, fontSize: "9px", color: key.status === "active" ? BRAND.green : STATUS.error }}>
                {key.status}
              </span>
            </div>
          </div>

          {/* Key value */}
          <div className="flex items-center gap-2 h-8 px-2.5 rounded-lg mb-2" style={{ background: isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)", border: `1px solid ${isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.04)"}` }}>
            <code style={{ fontFamily: "monospace", fontSize: "11px", color: t.textSecondary, flex: 1 }}>
              {showKey[key.id] ? `${key.prefix}sk_${key.id}_a1b2c3d4e5f6` : `${key.prefix}sk_••••••••••••`}
            </code>
            <button onClick={() => setShowKey(prev => ({ ...prev, [key.id]: !prev[key.id] }))}>
              {showKey[key.id] ? <EyeOff size={11} style={{ color: t.textFaint }} /> : <Eye size={11} style={{ color: t.textFaint }} />}
            </button>
            <button><Copy size={11} style={{ color: t.textFaint }} /></button>
          </div>

          {/* Scopes */}
          <div className="flex items-center gap-1.5 flex-wrap mb-2">
            {key.scopes.map(scope => (
              <span key={scope} className="px-1.5 py-0.5 rounded" style={{ background: isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.03)", fontFamily: "monospace", fontSize: "9px", color: t.textMuted }}>{scope}</span>
            ))}
          </div>

          {/* Meta + actions */}
          <div className="flex items-center justify-between">
            <span style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 400, fontSize: "10px", color: t.textFaint }}>Created {key.created} · Last used {key.lastUsed}</span>
            {key.status === "active" && (
              revoking === key.id ? (
                <div className="flex items-center gap-1.5">
                  <button onClick={() => setRevoking(null)} className="h-6 px-2 rounded" style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 500, fontSize: "10px", color: t.textMuted }}>Cancel</button>
                  <button onClick={() => setRevoking(null)} className="h-6 px-2 rounded" style={{ background: STATUS.error, fontFamily: "'Manrope', sans-serif", fontWeight: 500, fontSize: "10px", color: "#fff" }}>Revoke</button>
                </div>
              ) : (
                <button onClick={() => setRevoking(key.id)} className="h-6 px-2 rounded flex items-center gap-1" style={{ background: `${STATUS.error}08`, border: `1px solid ${STATUS.error}12` }}>
                  <Trash2 size={9} style={{ color: STATUS.error }} />
                  <span style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 500, fontSize: "10px", color: STATUS.error }}>Revoke</span>
                </button>
              )
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   CONTACT DRAWER
   ═══════════════════════════════════════════════════════════════════════════ */

function ContactDrawer({ hotel, isDark, t, onSend }: { hotel: Hotel; isDark: boolean; t: any; onSend: () => void }) {
  const [channel, setChannel] = useState<"email" | "phone">("email");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const templates = [
    { label: "Invoice reminder", value: `Dear ${hotel.contactName},\n\nThis is a friendly reminder regarding the outstanding invoice for ${hotel.name}. Please review and process payment at your earliest convenience.\n\nBest regards,\nJET Partner Team` },
    { label: "Integration check-in", value: `Dear ${hotel.contactName},\n\nWe noticed some activity changes on your integration. Our team is available to help resolve any issues.\n\nBest regards,\nJET Partner Team` },
    { label: "Monthly report", value: `Dear ${hotel.contactName},\n\nYour monthly performance summary is ready for review. ${hotel.monthlyBookings} bookings were processed, generating ${formatNaira(hotel.monthlyRevenue)} in revenue.\n\nBest regards,\nJET Partner Team` },
  ];

  return (
    <div className="px-5 py-4 space-y-4">
      {/* Channel */}
      <div>
        <span style={{ ...TY.label, fontSize: "8px", color: t.textGhost }}>CHANNEL</span>
        <div className="mt-2 flex gap-2">
          {([
            { key: "email" as const, label: "Email", desc: hotel.contactEmail, icon: Mail },
            { key: "phone" as const, label: "Phone", desc: hotel.contactPhone, icon: Phone },
          ]).map(ch => (
            <button key={ch.key} className="flex-1 flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-left" style={{ background: channel === ch.key ? `${BRAND.green}08` : t.surface, border: `1px solid ${channel === ch.key ? `${BRAND.green}20` : t.borderSubtle}` }}
              onClick={() => setChannel(ch.key)}>
              <div className="w-4 h-4 flex items-center justify-center">
                {channel === ch.key ? <CheckCircle2 size={13} style={{ color: BRAND.green }} /> : <div className="w-3.5 h-3.5 rounded-full" style={{ border: `1.5px solid ${t.textFaint}` }} />}
              </div>
              <div>
                <span className="block" style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 500, fontSize: "12px", color: t.text }}>{ch.label}</span>
                <span style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 400, fontSize: "10px", color: t.textFaint }}>{ch.desc}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Template */}
      <div>
        <span style={{ ...TY.label, fontSize: "8px", color: t.textGhost }}>TEMPLATE</span>
        <div className="mt-2 space-y-1">
          {templates.map(tmpl => (
            <button key={tmpl.label} className="w-full text-left px-3 py-2 rounded-lg transition-colors" style={{ background: "transparent" }}
              onClick={() => { setMessage(tmpl.value); setSubject(tmpl.label); }}
              onMouseEnter={e => { e.currentTarget.style.background = isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "transparent"; }}>
              <span style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 500, fontSize: "11px", color: t.textSecondary }}>{tmpl.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Subject */}
      {channel === "email" && (
        <div>
          <span style={{ ...TY.label, fontSize: "8px", color: t.textGhost }}>SUBJECT</span>
          <input value={subject} onChange={e => setSubject(e.target.value)} placeholder="Email subject…" className="mt-1.5 w-full h-9 px-3 rounded-xl bg-transparent outline-none" style={{ border: `1px solid ${t.borderSubtle}`, fontFamily: "'Manrope', sans-serif", fontSize: "12px", color: t.text }} />
        </div>
      )}

      {/* Message */}
      <div>
        <span style={{ ...TY.label, fontSize: "8px", color: t.textGhost }}>MESSAGE</span>
        <textarea value={message} onChange={e => setMessage(e.target.value)} placeholder={`Write to ${hotel.contactName}…`} rows={6} className="mt-1.5 w-full px-3 py-2.5 rounded-xl bg-transparent outline-none resize-none" style={{ border: `1px solid ${t.borderSubtle}`, fontFamily: "'Manrope', sans-serif", fontSize: "12px", lineHeight: "1.5", color: t.text }} />
      </div>

      {/* Send */}
      <button className="w-full h-11 rounded-xl flex items-center justify-center gap-2" style={{ background: BRAND.green, minHeight: 44 }} onClick={onSend}>
        <Send size={13} style={{ color: "#fff" }} />
        <span style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 500, fontSize: "12px", color: "#fff" }}>Send {channel === "email" ? "Email" : "Call Request"}</span>
      </button>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   FULL PROFILE DRAWER
   ═══════════════════════════════════════════════════════════════════════════ */

function FullProfileDrawer({ hotel, isDark, t }: { hotel: Hotel; isDark: boolean; t: any }) {
  const stg = STAGE_META[hotel.stage];
  const tier = TIER_META[hotel.tier];
  const intg = INT_META[hotel.integration];
  const paidInvoices = hotel.invoices.filter(inv => inv.status === "paid");
  const pendingInvoices = hotel.invoices.filter(inv => inv.status !== "paid");

  return (
    <div className="px-5 py-4 space-y-5">
      {/* Header card */}
      <div className="rounded-xl p-4" style={{ background: t.surface, border: `1px solid ${t.borderSubtle}` }}>
        <div className="flex items-center gap-3 mb-3">
          <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: `${stg.color}12` }}>
            <Building2 size={20} style={{ color: stg.color }} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 600, fontSize: "15px", letterSpacing: "-0.03em", color: t.text }}>{hotel.name}</span>
              {hotel.stars >= 5 && <Star size={10} style={{ color: "#F59E0B", fill: "#F59E0B" }} />}
            </div>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="px-1.5 py-0.5 rounded" style={{ background: `${stg.color}12`, fontFamily: "'Manrope', sans-serif", fontWeight: 500, fontSize: "9px", color: stg.color }}>{stg.label}</span>
              <span className="px-1.5 py-0.5 rounded" style={{ background: `${tier.color}10`, fontFamily: "'Manrope', sans-serif", fontWeight: 500, fontSize: "9px", color: tier.color }}>{tier.label}</span>
              <span style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 400, fontSize: "10px", color: t.textFaint }}>{hotel.id}</span>
            </div>
          </div>
        </div>

        {/* Contact info */}
        <div className="space-y-1.5 mt-3" style={{ paddingTop: 12, borderTop: `1px solid ${t.borderSubtle}` }}>
          {[
            { icon: Users, value: hotel.contactName, label: "Primary contact" },
            { icon: Mail, value: hotel.contactEmail },
            { icon: Phone, value: hotel.contactPhone },
            { icon: MapPin, value: `${hotel.city}, ${hotel.address}` },
            { icon: Clock, value: `Partner since ${hotel.joinDate}` },
            { icon: Users, value: `${hotel.teamSize} team members` },
          ].map(({ icon: Icon, value }) => (
            <div key={value} className="flex items-center gap-2">
              <Icon size={11} style={{ color: t.iconMuted }} />
              <span style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 400, fontSize: "11px", color: t.text }}>{value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* All-time metrics */}
      <div>
        <span style={{ ...TY.label, fontSize: "8px", color: t.textGhost }}>PERFORMANCE</span>
        <div className="mt-2 grid grid-cols-3 gap-2">
          {[
            { label: "Total Bookings", value: hotel.totalBookings.toLocaleString(), color: t.text, source: "trips.hotel_id.count" },
            { label: "Monthly Rev", value: formatNaira(hotel.monthlyRevenue), color: BRAND.green, source: "trips.hotel_id.sum(fare,30d)" },
            { label: "Commission", value: `${hotel.commission}%`, color: BRAND.green, source: "hotel_partners.commission" },
            { label: "Monthly Book", value: String(hotel.monthlyBookings), color: t.text, source: "trips.hotel_id.count(30d)" },
            { label: "Webhook", value: hotel.webhookHealth > 0 ? `${hotel.webhookHealth}%` : "—", color: hotel.webhookHealth < 80 ? STATUS.error : BRAND.green, source: "webhooks.success_rate" },
            { label: "API Keys", value: String(hotel.apiKeyCount), color: t.text, source: "api_keys.hotel_id.count" },
          ].map(m => (
            <div key={m.label} className="p-2.5 rounded-lg group relative" style={{ background: t.surface, border: `1px solid ${t.borderSubtle}` }}>
              <span className="block" style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 600, fontSize: "14px", letterSpacing: "-0.03em", lineHeight: "1.2", color: m.color }}>{m.value}</span>
              <span style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 400, fontSize: "9px", color: t.textFaint }}>{m.label}</span>
              <div className="absolute bottom-0.5 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <span style={{ fontFamily: "'Manrope', sans-serif", fontSize: "7px", color: t.textGhost }}>{m.source}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Integration detail */}
      <div className="rounded-xl p-3" style={{ background: hotel.integration === "error" ? `${STATUS.error}04` : t.surface, border: `1px solid ${hotel.integration === "error" ? `${STATUS.error}12` : t.borderSubtle}` }}>
        <span style={{ ...TY.label, fontSize: "8px", color: t.textGhost }}>INTEGRATION</span>
        <div className="mt-2 flex items-center gap-2">
          <intg.icon size={14} style={{ color: intg.color }} />
          <span style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 500, fontSize: "13px", color: intg.color }}>{intg.label}</span>
        </div>
        {hotel.webhookHealth > 0 && (
          <div className="mt-2">
            <div className="w-full h-2 rounded-full overflow-hidden" style={{ background: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)" }}>
              <div className="h-full rounded-full transition-all" style={{ width: `${hotel.webhookHealth}%`, background: hotel.webhookHealth < 80 ? STATUS.error : BRAND.green }} />
            </div>
            <span className="block mt-1" style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 400, fontSize: "10px", color: t.textFaint }}>Webhook success rate: {hotel.webhookHealth}%</span>
          </div>
        )}
      </div>

      {/* Invoice summary */}
      <div>
        <span style={{ ...TY.label, fontSize: "8px", color: t.textGhost }}>BILLING SUMMARY</span>
        <div className="mt-2 rounded-xl p-3" style={{ background: t.surface, border: `1px solid ${t.borderSubtle}` }}>
          <div className="space-y-1.5">
            <div className="flex justify-between">
              <span style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 400, fontSize: "11px", color: t.textMuted }}>Total invoiced ({hotel.invoices.length})</span>
              <span style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 500, fontSize: "11px", color: t.text }}>{formatNaira(hotel.invoices.reduce((a, i) => a + i.amount, 0))}</span>
            </div>
            <div className="flex justify-between">
              <span style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 400, fontSize: "11px", color: t.textMuted }}>Paid ({paidInvoices.length})</span>
              <span style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 500, fontSize: "11px", color: BRAND.green }}>{formatNaira(paidInvoices.reduce((a, i) => a + i.amount, 0))}</span>
            </div>
            {pendingInvoices.length > 0 && (
              <div className="flex justify-between">
                <span style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 500, fontSize: "11px", color: STATUS.warning }}>Outstanding ({pendingInvoices.length})</span>
                <span style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 600, fontSize: "11px", color: STATUS.warning }}>{formatNaira(pendingInvoices.reduce((a, i) => a + i.amount, 0))}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recent guests */}
      {hotel.recentGuests.length > 0 && (
        <div>
          <span style={{ ...TY.label, fontSize: "8px", color: t.textGhost }}>ACTIVE GUESTS</span>
          <div className="mt-2 space-y-1">
            {hotel.recentGuests.map((g, i) => (
              <div key={i} className="flex items-center justify-between px-3 py-2 rounded-lg" style={{ background: t.surface, border: `1px solid ${t.borderSubtle}` }}>
                <div className="flex items-center gap-2">
                  <Users size={10} style={{ color: t.iconMuted }} />
                  <span style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 500, fontSize: "11px", color: t.text }}>{g.name}</span>
                  <span style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 400, fontSize: "10px", color: t.textFaint }}>Rm {g.room}</span>
                </div>
                <span style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 400, fontSize: "10px", color: t.textMuted }}>{g.trips} trip{g.trips !== 1 ? "s" : ""} · {g.lastTrip}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
