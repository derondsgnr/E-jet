/**
 * JET ADMIN — SUPPORT (B2B Cases)
 * Route: /admin/support
 *
 * Linear-style issue tracker for fleet owner + hotel account-level cases.
 * NOT ride disputes — these are B2B partner support tickets.
 */

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  LifeBuoy, Search, Filter, X, ChevronRight, Clock,
  Building2, Truck, User, MessageSquare, Paperclip,
  AlertCircle, CheckCircle2, Loader2, ArrowUpRight,
  Send, MoreHorizontal, Link2,
} from "lucide-react";
import { useAdminTheme, TY, BRAND, STATUS } from "../config/admin-theme";
import { AdminPageShell } from "../components/admin/ui/admin-page-shell";

/* ─── Types ─── */
type CaseStatus = "open" | "investigating" | "pending_partner" | "resolved";
type CaseCategory = "billing" | "technical" | "account" | "operational";
type PartnerType = "fleet" | "hotel";
type CasePriority = "urgent" | "high" | "medium" | "low";

const STATUS_META: Record<CaseStatus, { label: string; color: string; icon: typeof Clock }> = {
  open: { label: "Open", color: STATUS.info, icon: AlertCircle },
  investigating: { label: "Investigating", color: STATUS.warning, icon: Loader2 },
  pending_partner: { label: "Pending Partner", color: "#8B5CF6", icon: Clock },
  resolved: { label: "Resolved", color: STATUS.success, icon: CheckCircle2 },
};

const PRIORITY_META: Record<CasePriority, { label: string; color: string }> = {
  urgent: { label: "Urgent", color: STATUS.error },
  high: { label: "High", color: STATUS.warning },
  medium: { label: "Medium", color: STATUS.info },
  low: { label: "Low", color: "#737373" },
};

const CATEGORY_META: Record<CaseCategory, { label: string; color: string }> = {
  billing: { label: "Billing", color: STATUS.warning },
  technical: { label: "Technical", color: STATUS.info },
  account: { label: "Account", color: "#8B5CF6" },
  operational: { label: "Operational", color: STATUS.success },
};

interface SupportCase {
  id: string;
  title: string;
  partnerType: PartnerType;
  partnerName: string;
  status: CaseStatus;
  category: CaseCategory;
  priority: CasePriority;
  assignee: string;
  created: string;
  updated: string;
  linkedRides: number;
  messages: number;
  slaHours: number;
  slaRemaining: number;
}

const MOCK_CASES: SupportCase[] = [
  { id: "SC-001", title: "Payout discrepancy — February settlement", partnerType: "fleet", partnerName: "Greenfield Motors", status: "investigating", category: "billing", priority: "urgent", assignee: "Adaeze O.", created: "2h ago", updated: "45m ago", linkedRides: 12, messages: 8, slaHours: 24, slaRemaining: 6 },
  { id: "SC-002", title: "API webhook not firing for ride completions", partnerType: "hotel", partnerName: "Eko Hotels & Suites", status: "open", category: "technical", priority: "high", assignee: "Unassigned", created: "1h ago", updated: "1h ago", linkedRides: 0, messages: 2, slaHours: 12, slaRemaining: 11 },
  { id: "SC-003", title: "Driver deactivated without notice — requesting review", partnerType: "fleet", partnerName: "Swift Ride Fleet", status: "pending_partner", category: "operational", priority: "high", assignee: "Tunde B.", created: "1d ago", updated: "3h ago", linkedRides: 1, messages: 14, slaHours: 48, slaRemaining: 22 },
  { id: "SC-004", title: "Invoice amount doesn't match booking records", partnerType: "hotel", partnerName: "Transcorp Hilton", status: "investigating", category: "billing", priority: "medium", assignee: "Kemi A.", created: "2d ago", updated: "5h ago", linkedRides: 34, messages: 6, slaHours: 48, slaRemaining: 18 },
  { id: "SC-005", title: "Bulk driver onboarding — documents stuck in review", partnerType: "fleet", partnerName: "Lagos Express Fleet", status: "open", category: "account", priority: "medium", assignee: "Unassigned", created: "4h ago", updated: "4h ago", linkedRides: 0, messages: 3, slaHours: 24, slaRemaining: 20 },
  { id: "SC-006", title: "Commission rate renegotiation request", partnerType: "fleet", partnerName: "Abuja Premium Cars", status: "pending_partner", category: "account", priority: "low", assignee: "Adaeze O.", created: "3d ago", updated: "1d ago", linkedRides: 0, messages: 10, slaHours: 72, slaRemaining: 48 },
  { id: "SC-007", title: "Guest complaint — driver no-show on airport pickup", partnerType: "hotel", partnerName: "Four Points Sheraton", status: "resolved", category: "operational", priority: "urgent", assignee: "Tunde B.", created: "5d ago", updated: "2d ago", linkedRides: 1, messages: 18, slaHours: 12, slaRemaining: 0 },
  { id: "SC-008", title: "API key rotation request for production environment", partnerType: "hotel", partnerName: "Radisson Blu Lagos", status: "resolved", category: "technical", priority: "low", assignee: "Kemi A.", created: "1w ago", updated: "4d ago", linkedRides: 0, messages: 4, slaHours: 48, slaRemaining: 0 },
];

const SUPPORT_KPI = {
  open: 3,
  investigating: 2,
  pendingPartner: 2,
  avgResolution: "18h",
  slaCompliance: "87%",
};

type TabKey = "all" | "open" | "investigating" | "pending_partner" | "resolved";

export function AdminSupportPage() {
  const { t, theme } = useAdminTheme();
  const isDark = theme === "dark";
  const [tab, setTab] = useState<TabKey>("all");
  const [search, setSearch] = useState("");
  const [selectedCase, setSelectedCase] = useState<SupportCase | null>(null);

  const tabs: { key: TabKey; label: string; count: number }[] = [
    { key: "all", label: "All Cases", count: MOCK_CASES.length },
    { key: "open", label: "Open", count: MOCK_CASES.filter(c => c.status === "open").length },
    { key: "investigating", label: "Investigating", count: MOCK_CASES.filter(c => c.status === "investigating").length },
    { key: "pending_partner", label: "Pending", count: MOCK_CASES.filter(c => c.status === "pending_partner").length },
    { key: "resolved", label: "Resolved", count: MOCK_CASES.filter(c => c.status === "resolved").length },
  ];

  const filtered = useMemo(() => {
    let list = MOCK_CASES;
    if (tab !== "all") list = list.filter(c => c.status === tab);
    if (search) {
      const s = search.toLowerCase();
      list = list.filter(c => c.title.toLowerCase().includes(s) || c.partnerName.toLowerCase().includes(s) || c.id.toLowerCase().includes(s));
    }
    return list;
  }, [tab, search]);

  return (
    <AdminPageShell title="Support" subtitle="B2B partner cases">
      <div className="p-3 md:p-5 max-w-[1400px]">
        {/* KPI */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
          {[
            { label: "Open Cases", value: SUPPORT_KPI.open.toString(), icon: AlertCircle, color: STATUS.info, sub: "Awaiting triage" },
            { label: "Investigating", value: SUPPORT_KPI.investigating.toString(), icon: Loader2, color: STATUS.warning, sub: "In progress" },
            { label: "Avg Resolution", value: SUPPORT_KPI.avgResolution, icon: Clock, color: BRAND.green, sub: "Last 30 days" },
            { label: "SLA Compliance", value: SUPPORT_KPI.slaCompliance, icon: CheckCircle2, color: STATUS.success, sub: "Within target" },
          ].map((card, i) => (
            <motion.div
              key={card.label}
              className="p-4 rounded-2xl"
              style={{ background: t.surfaceRaised, border: `1px solid ${t.borderSubtle}`, boxShadow: t.shadow }}
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.04 }}
            >
              <card.icon size={14} style={{ color: card.color, marginBottom: 8 }} />
              <span className="block" style={{ ...TY.h, fontSize: "22px", color: card.color }}>{card.value}</span>
              <span className="block" style={{ ...TY.bodyR, fontSize: "10px", color: t.textFaint }}>{card.label}</span>
              <span style={{ ...TY.bodyR, fontSize: "9px", color: t.textGhost }}>{card.sub}</span>
            </motion.div>
          ))}
        </div>

        {/* Tabs + Search */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
          <div className="flex items-center gap-1 overflow-x-auto">
            {tabs.map(tb => (
              <button
                key={tb.key}
                onClick={() => setTab(tb.key)}
                className="flex items-center gap-1.5 px-3 h-8 rounded-lg whitespace-nowrap transition-colors"
                style={{ background: tab === tb.key ? t.surfaceActive : "transparent", color: tab === tb.key ? t.text : t.textMuted, ...TY.body, fontSize: "12px" }}
              >
                {tb.label}
                <span className="px-1.5 py-0.5 rounded" style={{ background: tab === tb.key ? `${BRAND.green}18` : t.surface, ...TY.cap, fontSize: "10px", color: tab === tb.key ? BRAND.green : t.textFaint }}>{tb.count}</span>
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 px-3 h-8 rounded-lg" style={{ background: t.surface, border: `1px solid ${t.borderSubtle}` }}>
              <Search size={13} style={{ color: t.iconMuted }} />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search cases…" className="bg-transparent outline-none w-36 sm:w-48" style={{ ...TY.bodyR, fontSize: "12px", color: t.text }} />
            </div>
            <button className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: t.surface, border: `1px solid ${t.borderSubtle}` }}>
              <Filter size={13} style={{ color: t.icon }} />
            </button>
          </div>
        </div>

        {/* Case List — Linear style */}
        <div className="rounded-2xl overflow-hidden" style={{ background: t.surfaceRaised, border: `1px solid ${t.borderSubtle}`, boxShadow: t.shadow }}>
          {filtered.map((c, i) => {
            const sm = STATUS_META[c.status];
            const pm = PRIORITY_META[c.priority];
            const cm = CATEGORY_META[c.category];
            const slaPercent = c.slaHours > 0 ? ((c.slaHours - c.slaRemaining) / c.slaHours) * 100 : 100;
            const slaDanger = c.slaRemaining > 0 && c.slaRemaining < c.slaHours * 0.25;

            return (
              <motion.button
                key={c.id}
                onClick={() => setSelectedCase(c)}
                className="w-full flex items-start gap-3 px-4 py-3.5 text-left transition-colors"
                style={{ borderBottom: `1px solid ${t.borderSubtle}`, background: selectedCase?.id === c.id ? t.surfaceActive : "transparent" }}
                whileHover={{ backgroundColor: isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)" }}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 + i * 0.03 }}
              >
                {/* Priority bar */}
                <div className="w-1 h-10 rounded-full shrink-0 mt-0.5" style={{ background: pm.color }} />

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span style={{ ...TY.cap, fontSize: "10px", color: t.textFaint }}>{c.id}</span>
                    <span className="px-1.5 py-0.5 rounded" style={{ background: `${cm.color}12`, ...TY.cap, fontSize: "9px", color: cm.color }}>{cm.label}</span>
                    <div className="flex items-center gap-1 px-1.5 py-0.5 rounded" style={{ background: `${sm.color}12` }}>
                      <sm.icon size={9} style={{ color: sm.color }} />
                      <span style={{ ...TY.cap, fontSize: "9px", color: sm.color }}>{sm.label}</span>
                    </div>
                  </div>
                  <span className="block mb-1.5 truncate" style={{ ...TY.body, fontSize: "13px", color: t.text }}>{c.title}</span>
                  <div className="flex items-center gap-3 flex-wrap">
                    <div className="flex items-center gap-1">
                      {c.partnerType === "fleet" ? <Truck size={10} style={{ color: t.iconMuted }} /> : <Building2 size={10} style={{ color: t.iconMuted }} />}
                      <span style={{ ...TY.bodyR, fontSize: "10px", color: t.textMuted }}>{c.partnerName}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <User size={10} style={{ color: t.iconMuted }} />
                      <span style={{ ...TY.bodyR, fontSize: "10px", color: c.assignee === "Unassigned" ? STATUS.warning : t.textMuted }}>{c.assignee}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageSquare size={10} style={{ color: t.iconMuted }} />
                      <span style={{ ...TY.bodyR, fontSize: "10px", color: t.textMuted }}>{c.messages}</span>
                    </div>
                    {c.linkedRides > 0 && (
                      <div className="flex items-center gap-1">
                        <Link2 size={10} style={{ color: t.iconMuted }} />
                        <span style={{ ...TY.bodyR, fontSize: "10px", color: t.textMuted }}>{c.linkedRides} rides</span>
                      </div>
                    )}
                    {c.slaRemaining > 0 && (
                      <div className="flex items-center gap-1">
                        <div className="w-12 h-1.5 rounded-full overflow-hidden" style={{ background: t.surface }}>
                          <div className="h-full rounded-full" style={{ width: `${slaPercent}%`, background: slaDanger ? STATUS.error : BRAND.green }} />
                        </div>
                        <span style={{ ...TY.cap, fontSize: "9px", color: slaDanger ? STATUS.error : t.textFaint }}>{c.slaRemaining}h left</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex flex-col items-end shrink-0">
                  <span style={{ ...TY.bodyR, fontSize: "10px", color: t.textFaint }}>{c.updated}</span>
                  <ChevronRight size={14} style={{ color: t.iconMuted, marginTop: 8 }} />
                </div>
              </motion.button>
            );
          })}

          {filtered.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16">
              <LifeBuoy size={24} style={{ color: t.textGhost, marginBottom: 8 }} />
              <span style={{ ...TY.body, fontSize: "13px", color: t.textMuted }}>No cases found</span>
            </div>
          )}
        </div>
      </div>

      {/* Case Detail Drawer */}
      <AnimatePresence>
        {selectedCase && (
          <>
            <motion.div className="fixed inset-0 z-40" style={{ background: "rgba(0,0,0,0.4)" }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedCase(null)} />
            <motion.div
              className="fixed right-0 top-0 bottom-0 w-full sm:w-[480px] z-50 overflow-y-auto"
              style={{ background: t.bg, borderLeft: `1px solid ${t.border}` }}
              initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
            >
              <CaseDetail c={selectedCase} onClose={() => setSelectedCase(null)} />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </AdminPageShell>
  );
}

function CaseDetail({ c, onClose }: { c: SupportCase; onClose: () => void }) {
  const { t } = useAdminTheme();
  const sm = STATUS_META[c.status];
  const pm = PRIORITY_META[c.priority];

  const THREAD = [
    { author: c.partnerName, isPartner: true, time: c.created, text: c.title + ". Please investigate this urgently — it's affecting our operations." },
    { author: c.assignee !== "Unassigned" ? c.assignee : "System", isPartner: false, time: "30m later", text: "Thank you for reaching out. We're looking into this now and will update you within the SLA window." },
    { author: c.partnerName, isPartner: true, time: "2h later", text: "Any updates? Our team is waiting on this to proceed with reconciliation." },
  ];

  return (
    <div className="p-5">
      <div className="flex items-center justify-between mb-6">
        <span style={{ ...TY.label, fontSize: "9px", color: t.textFaint, letterSpacing: "0.06em" }}>CASE DETAIL</span>
        <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: t.surfaceHover }}>
          <X size={14} style={{ color: t.icon }} />
        </button>
      </div>

      {/* Meta */}
      <div className="flex items-center gap-2 mb-3">
        <span style={{ ...TY.cap, fontSize: "10px", color: t.textFaint }}>{c.id}</span>
        <span className="px-1.5 py-0.5 rounded" style={{ background: `${pm.color}15`, ...TY.cap, fontSize: "9px", color: pm.color }}>{pm.label}</span>
        <div className="flex items-center gap-1 px-1.5 py-0.5 rounded" style={{ background: `${sm.color}12` }}>
          <sm.icon size={9} style={{ color: sm.color }} />
          <span style={{ ...TY.cap, fontSize: "9px", color: sm.color }}>{sm.label}</span>
        </div>
      </div>
      <span className="block mb-4" style={{ ...TY.sub, fontSize: "15px", color: t.text }}>{c.title}</span>

      {/* Partner info */}
      <div className="rounded-xl p-3 mb-4 flex items-center gap-3" style={{ background: t.surface, border: `1px solid ${t.borderSubtle}` }}>
        {c.partnerType === "fleet" ? <Truck size={16} style={{ color: BRAND.green }} /> : <Building2 size={16} style={{ color: STATUS.info }} />}
        <div>
          <span className="block" style={{ ...TY.body, fontSize: "13px", color: t.text }}>{c.partnerName}</span>
          <span style={{ ...TY.bodyR, fontSize: "10px", color: t.textMuted }}>{c.partnerType === "fleet" ? "Fleet Owner" : "Hotel Partner"} · {CATEGORY_META[c.category].label}</span>
        </div>
      </div>

      {/* SLA */}
      {c.slaRemaining > 0 && (
        <div className="rounded-xl p-3 mb-4" style={{ background: t.surface, border: `1px solid ${t.borderSubtle}` }}>
          <div className="flex items-center justify-between mb-2">
            <span style={{ ...TY.bodyR, fontSize: "11px", color: t.textMuted }}>SLA Progress</span>
            <span style={{ ...TY.body, fontSize: "11px", color: c.slaRemaining < c.slaHours * 0.25 ? STATUS.error : BRAND.green }}>{c.slaRemaining}h remaining</span>
          </div>
          <div className="w-full h-2 rounded-full overflow-hidden" style={{ background: t.surfaceActive }}>
            <div className="h-full rounded-full transition-all" style={{ width: `${((c.slaHours - c.slaRemaining) / c.slaHours) * 100}%`, background: c.slaRemaining < c.slaHours * 0.25 ? STATUS.error : BRAND.green }} />
          </div>
        </div>
      )}

      {/* Thread */}
      <span className="block mb-3" style={{ ...TY.label, fontSize: "9px", color: t.textFaint, letterSpacing: "0.06em" }}>CONVERSATION</span>
      <div className="space-y-3 mb-4">
        {THREAD.map((msg, i) => (
          <div key={i} className="rounded-xl p-3" style={{ background: msg.isPartner ? `${STATUS.info}06` : t.surface, border: `1px solid ${msg.isPartner ? `${STATUS.info}15` : t.borderSubtle}` }}>
            <div className="flex items-center justify-between mb-1.5">
              <span style={{ ...TY.body, fontSize: "11px", color: msg.isPartner ? STATUS.info : BRAND.green }}>{msg.author}</span>
              <span style={{ ...TY.bodyR, fontSize: "9px", color: t.textFaint }}>{msg.time}</span>
            </div>
            <span style={{ ...TY.bodyR, fontSize: "12px", color: t.text, lineHeight: "1.5" }}>{msg.text}</span>
          </div>
        ))}
      </div>

      {/* Reply box */}
      <div className="rounded-xl p-3 mb-4" style={{ background: t.surface, border: `1px solid ${t.borderSubtle}` }}>
        <textarea
          className="w-full bg-transparent outline-none resize-none mb-2"
          placeholder="Write a reply…"
          rows={3}
          style={{ ...TY.bodyR, fontSize: "12px", color: t.text }}
        />
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: t.surfaceHover }}>
              <Paperclip size={12} style={{ color: t.iconMuted }} />
            </button>
            <button className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: t.surfaceHover }}>
              <Link2 size={12} style={{ color: t.iconMuted }} />
            </button>
          </div>
          <button className="h-8 px-4 rounded-lg flex items-center gap-2" style={{ background: BRAND.green, ...TY.body, fontSize: "12px", color: "#fff" }}>
            <Send size={12} /> Reply
          </button>
        </div>
      </div>

      {/* Actions */}
      <span className="block mb-2" style={{ ...TY.label, fontSize: "9px", color: t.textFaint, letterSpacing: "0.06em" }}>ACTIONS</span>
      <div className="space-y-2">
        {[
          { label: "Assign to Admin", color: t.text },
          { label: "Escalate to Account Manager", color: STATUS.warning },
          { label: "Link to Ride / Dispute", color: STATUS.info },
          { label: "Flag for Finance Review", color: STATUS.error },
        ].map(a => (
          <button key={a.label} className="w-full h-9 rounded-xl flex items-center justify-center transition-colors" style={{ background: t.surface, border: `1px solid ${t.borderSubtle}`, ...TY.body, fontSize: "12px", color: a.color }}>
            {a.label}
          </button>
        ))}
      </div>
    </div>
  );
}
