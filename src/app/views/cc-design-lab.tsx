/**
 * COMMAND CENTER — DESIGN LAB
 * Route: /briefing/command-center
 *
 * Interactive design exploration for the two open questions:
 *   Q3 — Activity Feed: How to integrate hotel/fleet events
 *   Q4 — Footer tabs: How to surface partner health
 *
 * Locked decisions (from chat):
 *   ✅ Q1 — National KPIs: cross-platform (rides, revenue, supply, match, hotel rides, fleet util, completion, open issues)
 *   ✅ Q2 — Decision queue: hotel + fleet actions added, cleanly separated by entity type
 */

import { useState } from "react";
import { motion } from "motion/react";
import {
  Activity, Building2, Car, CheckCircle2, Filter,
  Layers, Radio, Scale, Users, Wallet, Zap,
  ChevronRight, Sun, Moon, MessageSquare,
  ArrowRight, MapPin, AlertTriangle, Clock, Star,
} from "lucide-react";
import { AdminThemeProvider, useAdminTheme, TY, BRAND, STATUS } from "../config/admin-theme";

/* ═══════════════════════════════════════════════════════════════════════════
   SHARED UI
   ═══════════════════════════════════════════════════════════════════════════ */

function Card({ children, selected, onClick, borderColor }: { children: React.ReactNode; selected?: boolean; onClick?: () => void; borderColor?: string }) {
  const { t } = useAdminTheme();
  return (
    <div
      className={`rounded-xl p-4 transition-all ${onClick ? "cursor-pointer" : ""}`}
      style={{
        background: t.surfaceRaised,
        border: `1px solid ${selected ? BRAND.green : borderColor || t.borderSubtle}`,
        boxShadow: selected ? `0 0 20px ${BRAND.green}12` : t.shadow,
      }}
      onClick={onClick}
    >
      {children}
    </div>
  );
}

function OptionTag({ label, selected }: { label: string; selected?: boolean }) {
  return (
    <span
      className="px-2.5 py-1 rounded-full inline-flex items-center gap-1.5"
      style={{
        ...TY.cap,
        fontSize: "10px",
        color: selected ? BRAND.green : "#737373",
        background: selected ? `${BRAND.green}12` : "transparent",
        border: `1px solid ${selected ? BRAND.green : "#73737330"}`,
      }}
    >
      {selected && <CheckCircle2 size={10} />}
      {label}
    </span>
  );
}

function SectionDivider({ label }: { label: string }) {
  const { t } = useAdminTheme();
  return (
    <div className="flex items-center gap-3 mt-10 mb-4">
      <div className="h-px flex-1" style={{ background: t.borderSubtle }} />
      <span style={{ ...TY.label, fontSize: "9px", color: t.textFaint, letterSpacing: "0.1em" }}>{label}</span>
      <div className="h-px flex-1" style={{ background: t.borderSubtle }} />
    </div>
  );
}

function NorthstarQuote({ brand, text }: { brand: string; text: string }) {
  const { t } = useAdminTheme();
  return (
    <div className="flex items-start gap-2.5 py-2 px-3 rounded-lg mt-2" style={{ background: `${STATUS.info}06`, border: `1px solid ${STATUS.info}10` }}>
      <span className="px-1.5 py-0.5 rounded shrink-0" style={{ ...TY.cap, fontSize: "8px", color: STATUS.info, background: `${STATUS.info}12` }}>{brand}</span>
      <span style={{ ...TY.bodyR, fontSize: "11px", color: t.textSecondary, lineHeight: "1.55" }}>{text}</span>
    </div>
  );
}

function Dot({ color }: { color: string }) {
  return <div className="w-1.5 h-1.5 rounded-full mt-[6px] shrink-0" style={{ background: color }} />;
}

function Bullet({ children, color }: { children: React.ReactNode; color?: string }) {
  const { t } = useAdminTheme();
  return (
    <div className="flex items-start gap-2.5 py-0.5">
      <Dot color={color || t.textMuted} />
      <span style={{ ...TY.bodyR, fontSize: "11px", color: t.textSecondary, lineHeight: "1.5" }}>{children}</span>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   MOCK FEED ITEMS — for visual prototyping
   ═══════════════════════════════════════════════════════════════════════════ */

const SAMPLE_FEED_MIXED = [
  { type: "ride", icon: MapPin, color: BRAND.green, msg: "Trip #JT-48320 completed · ₦3,200 · EV", time: "Just now", zone: "VI" },
  { type: "hotel", icon: Building2, color: STATUS.info, msg: "Eko Hotel guest ride requested · Suite 412", time: "1m ago", zone: "VI" },
  { type: "ride", icon: Activity, color: BRAND.green, msg: "Surge 1.4x activated", time: "2m ago", zone: "Ikeja" },
  { type: "fleet", icon: Car, color: "#F59E0B", msg: "GreenCab fleet: 3 vehicles offline", time: "2m ago", zone: "Lekki" },
  { type: "ride", icon: MapPin, color: BRAND.green, msg: "Trip #JT-48318 completed · ₦2,100", time: "3m ago", zone: "Surulere" },
  { type: "hotel", icon: Building2, color: STATUS.info, msg: "Radisson Blu: daily invoice generated · ₦284K", time: "4m ago", zone: "Ikeja" },
  { type: "ride", icon: AlertTriangle, color: STATUS.error, msg: "Payment retry failed · Trip #JT-48315", time: "5m ago", zone: "Yaba" },
  { type: "fleet", icon: Car, color: "#F59E0B", msg: "Lagos Rides fleet payout processed · ₦1.2M", time: "6m ago", zone: "—" },
];

const FEED_FILTER_PILLS = [
  { id: "all", label: "All", icon: Layers, color: BRAND.green },
  { id: "rides", label: "Rides", icon: MapPin, color: BRAND.green },
  { id: "hotels", label: "Hotels", icon: Building2, color: STATUS.info },
  { id: "fleet", label: "Fleet", icon: Car, color: "#F59E0B" },
];

/* ═══════════════════════════════════════════════════════════════════════════
   OPTION PROTOTYPES — Q3 (Activity Feed)
   ═══════════════════════════════════════════════════════════════════════════ */

function FeedOptionA() {
  const { t } = useAdminTheme();
  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <span style={{ ...TY.body, fontSize: "12px", color: t.text }}>Option A — Unified Feed</span>
        <OptionTag label="Simple" />
      </div>
      <span className="block mb-3" style={{ ...TY.bodyR, fontSize: "11px", color: t.textMuted }}>
        Everything in one stream. Hotel/fleet events get colored entity dots to distinguish them visually.
      </span>
      {/* Mini prototype */}
      <div className="rounded-lg overflow-hidden" style={{ background: t.surface, border: `1px solid ${t.borderSubtle}` }}>
        {SAMPLE_FEED_MIXED.slice(0, 5).map((item, i) => (
          <div key={i} className="flex items-center gap-2.5 px-3 py-2" style={{ borderBottom: i < 4 ? `1px solid ${t.borderSubtle}` : "none" }}>
            <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: item.color }} />
            <span className="flex-1 truncate" style={{ ...TY.bodyR, fontSize: "10px", color: t.textSecondary }}>{item.msg}</span>
            <span className="shrink-0" style={{ ...TY.cap, fontSize: "8px", color: t.textFaint }}>{item.time}</span>
          </div>
        ))}
      </div>
      <Bullet color={BRAND.green}>Pro: Zero learning curve. Admin sees everything.</Bullet>
      <Bullet color={STATUS.warning}>Con: Hotel/fleet events can drown in ride volume (rides are 90%+ of events).</Bullet>
      <NorthstarQuote brand="Vercel" text="Their deployment feed is unified — all projects, all types. But Vercel's event volume is lower than a ride-hailing platform." />
    </div>
  );
}

function FeedOptionB() {
  const { t } = useAdminTheme();
  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <span style={{ ...TY.body, fontSize: "12px", color: t.text }}>Option B — Feed stays ride-focused, partners get indicators</span>
        <OptionTag label="Separation" />
      </div>
      <span className="block mb-3" style={{ ...TY.bodyR, fontSize: "11px", color: t.textMuted }}>
        Live feed = rides only (it's the heartbeat). Hotel/fleet health surfaced through footer tabs or KPI badges — not the feed.
      </span>
      <div className="rounded-lg overflow-hidden" style={{ background: t.surface, border: `1px solid ${t.borderSubtle}` }}>
        {SAMPLE_FEED_MIXED.filter(i => i.type === "ride").slice(0, 4).map((item, i) => (
          <div key={i} className="flex items-center gap-2.5 px-3 py-2" style={{ borderBottom: i < 3 ? `1px solid ${t.borderSubtle}` : "none" }}>
            <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: item.color }} />
            <span className="flex-1 truncate" style={{ ...TY.bodyR, fontSize: "10px", color: t.textSecondary }}>{item.msg}</span>
            <span className="shrink-0" style={{ ...TY.cap, fontSize: "8px", color: t.textFaint }}>{item.time}</span>
          </div>
        ))}
      </div>
      <div className="flex items-center gap-2 mt-2 px-2 py-1.5 rounded-lg" style={{ background: `${STATUS.info}06`, border: `1px solid ${STATUS.info}10` }}>
        <Building2 size={10} style={{ color: STATUS.info }} />
        <span style={{ ...TY.cap, fontSize: "9px", color: STATUS.info }}>Hotels: 14 active · 846 guest rides</span>
        <Car size={10} style={{ color: "#F59E0B", marginLeft: 8 }} />
        <span style={{ ...TY.cap, fontSize: "9px", color: "#F59E0B" }}>Fleet: 72% util · 312 online</span>
      </div>
      <Bullet color={BRAND.green}>Pro: Feed stays fast and scannable. Clear mental model: feed = rides.</Bullet>
      <Bullet color={STATUS.warning}>Con: Partner events aren't immediately visible — admin must look elsewhere.</Bullet>
      <NorthstarQuote brand="Linear" text="Linear separates activity by project/team. You see YOUR context, not everything. The feed serves one purpose clearly." />
    </div>
  );
}

function FeedOptionC() {
  const { t } = useAdminTheme();
  const [filter, setFilter] = useState("all");
  const filtered = filter === "all" ? SAMPLE_FEED_MIXED : SAMPLE_FEED_MIXED.filter(i => {
    if (filter === "rides") return i.type === "ride";
    if (filter === "hotels") return i.type === "hotel";
    if (filter === "fleet") return i.type === "fleet";
    return true;
  });

  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <span style={{ ...TY.body, fontSize: "12px", color: t.text }}>Option C — Filterable Feed</span>
        <OptionTag label="Flexible" />
        <OptionTag label="LOCKED" selected />
      </div>
      <span className="block mb-3" style={{ ...TY.bodyR, fontSize: "11px", color: t.textMuted }}>
        One feed, but with filter pills. Default: All. Admin can focus on hotel or fleet events when needed. Consistent with entity filter pattern already in the decision panel.
      </span>
      {/* Filter pills */}
      <div className="flex items-center gap-1 mb-2 p-1 rounded-lg" style={{ background: t.surface }}>
        {FEED_FILTER_PILLS.map(f => (
          <button
            key={f.id}
            className="flex items-center gap-1 px-2.5 py-1 rounded-md transition-all"
            style={{
              background: filter === f.id ? t.overlay : "transparent",
              boxShadow: filter === f.id ? t.shadow : "none",
            }}
            onClick={() => setFilter(f.id)}
          >
            <f.icon size={9} style={{ color: filter === f.id ? f.color : t.iconMuted }} />
            <span style={{ ...TY.body, fontSize: "9px", color: filter === f.id ? t.text : t.textMuted }}>{f.label}</span>
          </button>
        ))}
      </div>
      {/* Feed */}
      <div className="rounded-lg overflow-hidden" style={{ background: t.surface, border: `1px solid ${t.borderSubtle}` }}>
        {filtered.slice(0, 5).map((item, i) => (
          <div key={i} className="flex items-center gap-2.5 px-3 py-2" style={{ borderBottom: i < Math.min(4, filtered.length - 1) ? `1px solid ${t.borderSubtle}` : "none" }}>
            <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: item.color }} />
            <span className="flex-1 truncate" style={{ ...TY.bodyR, fontSize: "10px", color: t.textSecondary }}>{item.msg}</span>
            <span className="shrink-0" style={{ ...TY.cap, fontSize: "8px", color: t.textFaint }}>{item.time}</span>
          </div>
        ))}
      </div>
      <Bullet color={BRAND.green}>Pro: Flexible. Unified by default, focused when needed. Mirrors existing entity filter UX.</Bullet>
      <Bullet color={BRAND.green}>Pro: Hotel-focused admin can filter to see only hotel events. Same for fleet.</Bullet>
      <Bullet color={STATUS.warning}>Con: Slightly more UI surface area (pills). But pills are already a learned pattern in this UI.</Bullet>
      <NorthstarQuote brand="Apple" text="Notification Center: one stream, but filterable by app. Default = all. The filter is an affordance, not a requirement." />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   OPTION PROTOTYPES — Q4 (Footer / Partner Health)
   ═══════════════════════════════════════════════════════════════════════════ */

function FooterOptionA() {
  const { t } = useAdminTheme();
  const tabs = [
    { icon: Users, label: "Pipeline", val: "43", color: STATUS.warning },
    { icon: Scale, label: "Disputes", val: "12", color: STATUS.error },
    { icon: Wallet, label: "Revenue", val: "₦2.6M", color: BRAND.green },
    { icon: Building2, label: "Hotels", val: "14", color: STATUS.info },
    { icon: Car, label: "Fleet", val: "18", color: "#F59E0B" },
  ];
  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <span style={{ ...TY.body, fontSize: "12px", color: t.text }}>Option A — Extend Footer Tabs</span>
        <OptionTag label="Simple" />
      </div>
      <span className="block mb-3" style={{ ...TY.bodyR, fontSize: "11px", color: t.textMuted }}>
        Add Hotels + Fleet as two new footer tabs. Each opens an overlay panel (like Pipeline/Disputes/Revenue already do).
      </span>
      <div className="flex items-center rounded-lg overflow-hidden" style={{ background: t.surface, border: `1px solid ${t.borderSubtle}` }}>
        {tabs.map((tab, i) => (
          <button key={tab.label} className="flex-1 flex items-center justify-center gap-1.5 py-2.5 transition-colors" style={{ borderRight: i < tabs.length - 1 ? `1px solid ${t.borderSubtle}` : "none" }}>
            <tab.icon size={11} style={{ color: tab.color }} />
            <span style={{ ...TY.body, fontSize: "9px", color: t.textSecondary }}>{tab.label}</span>
            <span className="px-1.5 py-0.5 rounded-md" style={{ ...TY.cap, fontSize: "8px", color: tab.color, background: `${tab.color}12` }}>{tab.val}</span>
          </button>
        ))}
      </div>
      <Bullet color={BRAND.green}>Pro: Consistent pattern. Zero new concepts. Admin already knows how footer tabs work.</Bullet>
      <Bullet color={STATUS.warning}>Con: 5 tabs may feel crowded, especially on smaller screens.</Bullet>
    </div>
  );
}

function FooterOptionB() {
  const { t } = useAdminTheme();
  const operationalTabs = [
    { icon: Users, label: "Pipeline", val: "43", color: STATUS.warning },
    { icon: Scale, label: "Disputes", val: "12", color: STATUS.error },
    { icon: Wallet, label: "Revenue", val: "₦2.6M", color: BRAND.green },
  ];
  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <span style={{ ...TY.body, fontSize: "12px", color: t.text }}>Option B — Keep Footer Clean, Use Entity Filter</span>
        <OptionTag label="Minimal" />
        <OptionTag label="LOCKED" selected />
      </div>
      <span className="block mb-3" style={{ ...TY.bodyR, fontSize: "11px", color: t.textMuted }}>
        Footer stays at 3 tabs (operational). Hotel/fleet health is accessed through the existing entity filter when drilled into a state. National-level hotel/fleet health is represented in KPIs only.
      </span>
      <div className="flex items-center rounded-lg overflow-hidden" style={{ background: t.surface, border: `1px solid ${t.borderSubtle}` }}>
        {operationalTabs.map((tab, i) => (
          <button key={tab.label} className="flex-1 flex items-center justify-center gap-1.5 py-2.5 transition-colors" style={{ borderRight: i < operationalTabs.length - 1 ? `1px solid ${t.borderSubtle}` : "none" }}>
            <tab.icon size={11} style={{ color: tab.color }} />
            <span style={{ ...TY.body, fontSize: "9px", color: t.textSecondary }}>{tab.label}</span>
            <span className="px-1.5 py-0.5 rounded-md" style={{ ...TY.cap, fontSize: "8px", color: tab.color, background: `${tab.color}12` }}>{tab.val}</span>
          </button>
        ))}
      </div>
      <Bullet color={BRAND.green}>Pro: Clean. Minimal. Footer doesn't grow.</Bullet>
      <Bullet color={STATUS.warning}>Con: Hotel/fleet detail requires drilling into a state first. No national-level partner health overlay.</Bullet>
      <NorthstarQuote brand="Linear" text="Linear doesn't overload the sidebar with every view. Some things are accessed through navigation, not widgets." />
    </div>
  );
}

function FooterOptionC() {
  const { t } = useAdminTheme();
  const [activeGroup, setActiveGroup] = useState<"ops" | "partners">("ops");
  const opsItems = [
    { icon: Users, label: "Pipeline", val: "43", color: STATUS.warning },
    { icon: Scale, label: "Disputes", val: "12", color: STATUS.error },
    { icon: Wallet, label: "Revenue", val: "₦2.6M", color: BRAND.green },
  ];
  const partnerItems = [
    { icon: Building2, label: "Hotels", val: "14 active", color: STATUS.info },
    { icon: Car, label: "Fleet", val: "72% util", color: "#F59E0B" },
    { icon: MessageSquare, label: "B2B Cases", val: "3 open", color: STATUS.error },
  ];
  const items = activeGroup === "ops" ? opsItems : partnerItems;

  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <span style={{ ...TY.body, fontSize: "12px", color: t.text }}>Option C — Grouped Footer Tabs</span>
        <OptionTag label="Balanced" />
        <OptionTag label="Not chosen" />
      </div>
      <span className="block mb-3" style={{ ...TY.bodyR, fontSize: "11px", color: t.textMuted }}>
        Footer has two groups: Operations (Pipeline/Disputes/Revenue) and Partners (Hotels/Fleet/B2B Cases). A small toggle switches between them. Max 3 tabs visible at once — never crowded.
      </span>
      <div className="rounded-lg overflow-hidden" style={{ background: t.surface, border: `1px solid ${t.borderSubtle}` }}>
        {/* Group toggle */}
        <div className="flex items-center gap-0.5 p-1 mx-2 mt-1.5 rounded-lg" style={{ background: t.bg }}>
          {(["ops", "partners"] as const).map(g => (
            <button
              key={g}
              className="flex-1 py-1 rounded-md transition-all text-center"
              style={{
                background: activeGroup === g ? t.overlay : "transparent",
                boxShadow: activeGroup === g ? t.shadow : "none",
              }}
              onClick={() => setActiveGroup(g)}
            >
              <span style={{ ...TY.body, fontSize: "9px", color: activeGroup === g ? t.text : t.textMuted }}>
                {g === "ops" ? "Operations" : "Partners"}
              </span>
            </button>
          ))}
        </div>
        {/* Tabs */}
        <div className="flex items-center mt-1">
          {items.map((tab, i) => (
            <button key={tab.label} className="flex-1 flex items-center justify-center gap-1.5 py-2.5 transition-colors" style={{ borderRight: i < items.length - 1 ? `1px solid ${t.borderSubtle}` : "none" }}>
              <tab.icon size={11} style={{ color: tab.color }} />
              <span style={{ ...TY.body, fontSize: "9px", color: t.textSecondary }}>{tab.label}</span>
              <span className="px-1.5 py-0.5 rounded-md" style={{ ...TY.cap, fontSize: "8px", color: tab.color, background: `${tab.color}12` }}>{tab.val}</span>
            </button>
          ))}
        </div>
      </div>
      <Bullet color={BRAND.green}>Pro: Clean — never more than 3 tabs visible. Scales to future partner types.</Bullet>
      <Bullet color={BRAND.green}>Pro: Mirrors the entity filter mental model (operations vs. partners as contexts).</Bullet>
      <Bullet color={BRAND.green}>Pro: B2B Cases gets a home (currently homeless in the footer).</Bullet>
      <Bullet color={STATUS.warning}>Con: One extra click to switch groups. But the toggle is always visible.</Bullet>
      <NorthstarQuote brand="Apple" text="iOS Control Center: grouped sections. You see one context at a time but can switch instantly. Never overwhelming." />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   DECISIONS TRACKER
   ═══════════════════════════════════════════════════════════════════════════ */

function DecisionsTracker() {
  const { t } = useAdminTheme();
  const decisions = [
    { q: "Q1", label: "National KPIs", status: "locked" as const, answer: "Cross-platform: Rides, Revenue, Supply, Match, Hotel Rides, Fleet Util, Completion, Open Issues" },
    { q: "Q2", label: "Decision Queue", status: "locked" as const, answer: "Hotel + Fleet actions added, cleanly separated by entity. No conflation." },
    { q: "Q3", label: "Activity Feed", status: "locked" as const, answer: "Filterable feed (Option C). One stream with filter pills: All / Rides / Hotels / Fleet. Default: All." },
    { q: "Q4", label: "Footer / Partner Health", status: "locked" as const, answer: "Footer stays at 3 tabs (Pipeline, Disputes, Revenue). Partner health via KPIs + decision queue + feed filters. Hotels/Fleet are entities, not workflows — they have dedicated sidebar surfaces." },
  ];

  return (
    <div className="space-y-2">
      {decisions.map(d => (
        <div key={d.q} className="flex items-start gap-3 px-3 py-2.5 rounded-lg" style={{ background: d.status === "locked" ? `${BRAND.green}06` : `${STATUS.warning}06`, border: `1px solid ${d.status === "locked" ? `${BRAND.green}15` : `${STATUS.warning}15`}` }}>
          <span className="px-1.5 py-0.5 rounded shrink-0" style={{ ...TY.cap, fontSize: "9px", color: d.status === "locked" ? BRAND.green : STATUS.warning, background: d.status === "locked" ? `${BRAND.green}12` : `${STATUS.warning}12` }}>
            {d.q}
          </span>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span style={{ ...TY.body, fontSize: "11px", color: t.text }}>{d.label}</span>
              {d.status === "locked" ? (
                <CheckCircle2 size={10} style={{ color: BRAND.green }} />
              ) : (
                <Clock size={10} style={{ color: STATUS.warning }} />
              )}
            </div>
            <span className="block mt-0.5" style={{ ...TY.bodyR, fontSize: "10px", color: t.textMuted }}>{d.answer}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   MAIN PAGE
   ═══════════════════════════════════════════════════════════════════════════ */

function DesignLabContent() {
  const { t, theme, toggle } = useAdminTheme();

  return (
    <div className="min-h-screen" style={{ background: t.bg }}>
      {/* Top bar */}
      <div className="sticky top-0 z-50 flex items-center justify-between px-6 h-12" style={{ background: t.overlay, borderBottom: `1px solid ${t.border}`, backdropFilter: "blur(12px)" }}>
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full" style={{ background: BRAND.green }} />
          <span style={{ ...TY.sub, fontSize: "13px", color: t.text }}>Command Center — Design Lab</span>
        </div>
        <button onClick={toggle} className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: t.surfaceHover }}>
          {theme === "dark" ? <Sun size={14} style={{ color: t.icon }} /> : <Moon size={14} style={{ color: t.icon }} />}
        </button>
      </div>

      <div className="max-w-[900px] mx-auto px-5 py-8">
        {/* Decisions tracker */}
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
          <span className="block mb-3" style={{ ...TY.sub, fontSize: "14px", color: t.text }}>Decision Tracker</span>
          <DecisionsTracker />
        </motion.div>

        {/* ═══ Q3 — ACTIVITY FEED ═══ */}
        <SectionDivider label="Q3 — ACTIVITY FEED" />

        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <span className="block mb-1" style={{ ...TY.sub, fontSize: "14px", color: t.text }}>
            How should hotel/fleet events appear in the live feed?
          </span>
          <span className="block mb-4" style={{ ...TY.bodyR, fontSize: "11px", color: t.textMuted }}>
            The live feed bar currently shows ride events only. Hotels generate ~8% of rides. Fleet events are operational (payouts, compliance). The question: how to integrate without drowning signal in noise?
          </span>
        </motion.div>

        <div className="space-y-4">
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
            <Card><FeedOptionA /></Card>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card><FeedOptionB /></Card>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
            <Card borderColor={`${BRAND.green}20`}><FeedOptionC /></Card>
          </motion.div>
        </div>

        {/* ═══ Q4 — FOOTER / PARTNER HEALTH ═══ */}
        <SectionDivider label="Q4 — FOOTER TABS / PARTNER HEALTH" />

        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <span className="block mb-1" style={{ ...TY.sub, fontSize: "14px", color: t.text }}>
            How should partner health (Hotels, Fleet) surface in the decision panel footer?
          </span>
          <span className="block mb-4" style={{ ...TY.bodyR, fontSize: "11px", color: t.textMuted }}>
            Currently 3 footer tabs: Pipeline, Disputes, Revenue. Hotels and Fleet have deep detail when you drill into a state + filter — but no national-level panel.
          </span>
        </motion.div>

        <div className="space-y-4">
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
            <Card><FooterOptionA /></Card>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            <Card><FooterOptionB /></Card>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}>
            <Card borderColor={`${BRAND.green}20`}><FooterOptionC /></Card>
          </motion.div>
        </div>

        {/* ═══ NEXT STEPS ═══ */}
        <SectionDivider label="IMPLEMENTATION STATUS" />
        <Card borderColor={`${BRAND.green}20`}>
          <div className="flex items-center gap-2 mb-3">
            <CheckCircle2 size={14} style={{ color: BRAND.green }} />
            <span style={{ ...TY.body, fontSize: "12px", color: BRAND.green }}>All 4 decisions locked. Implementation complete.</span>
          </div>
          <Bullet color={BRAND.green}>Mock data updated — hotel/fleet action items + feed events added</Bullet>
          <Bullet color={BRAND.green}>National KPI strip — cross-platform: Rides, Revenue, Supply, Match, Hotel Rides, Fleet Util, Completion, Open Issues</Bullet>
          <Bullet color={BRAND.green}>Decision queue — hotel/fleet actions with entity-type section labels</Bullet>
          <Bullet color={BRAND.green}>Live feed — filterable with pills (All / Rides / Hotels / Fleet)</Bullet>
          <Bullet color={BRAND.green}>Footer — stays at 3 operational tabs (Pipeline, Disputes, Revenue)</Bullet>
        </Card>

        <div className="h-16" />
      </div>
    </div>
  );
}

export function CCDesignLab() {
  return (
    <AdminThemeProvider>
      <DesignLabContent />
    </AdminThemeProvider>
  );
}