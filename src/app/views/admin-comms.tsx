/**
 * JET ADMIN — COMMUNICATIONS
 * Route: /admin/comms
 *
 * Broadcast center + targeted messaging across all user types.
 * Pattern: Linear notifications + Mailchimp campaign builder.
 */

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Megaphone, Send, Bell, Users, Car, Building2, Truck,
  Clock, CheckCircle2, XCircle, Eye, Plus, Search,
  Filter, ChevronRight, X, Mail, Smartphone, Globe2,
  BarChart3, Target, Calendar, Edit3, Copy,
} from "lucide-react";
import { useAdminTheme, TY, BRAND, STATUS } from "../config/admin-theme";
import { AdminPageShell } from "../components/admin/ui/admin-page-shell";

/* ─── Types ─── */
type Channel = "push" | "sms" | "email";
type Audience = "all_riders" | "all_drivers" | "hotels" | "fleet_owners" | "segment" | "system";
type BroadcastStatus = "sent" | "scheduled" | "draft" | "failed";

const CHANNEL_META: Record<Channel, { label: string; icon: typeof Bell; color: string }> = {
  push: { label: "Push", icon: Smartphone, color: BRAND.green },
  sms: { label: "SMS", icon: Mail, color: STATUS.info },
  email: { label: "Email", icon: Mail, color: STATUS.warning },
};

const AUDIENCE_META: Record<Audience, { label: string; icon: typeof Users; color: string }> = {
  all_riders: { label: "All Riders", icon: Users, color: BRAND.green },
  all_drivers: { label: "All Drivers", icon: Car, color: STATUS.info },
  hotels: { label: "Hotel Partners", icon: Building2, color: STATUS.warning },
  fleet_owners: { label: "Fleet Owners", icon: Truck, color: "#8B5CF6" },
  segment: { label: "Custom Segment", icon: Target, color: "#F97316" },
  system: { label: "System-wide", icon: Globe2, color: STATUS.error },
};

const STATUS_META_COMMS: Record<BroadcastStatus, { label: string; color: string; icon: typeof CheckCircle2 }> = {
  sent: { label: "Sent", color: STATUS.success, icon: CheckCircle2 },
  scheduled: { label: "Scheduled", color: STATUS.info, icon: Calendar },
  draft: { label: "Draft", color: "#737373", icon: Edit3 },
  failed: { label: "Failed", color: STATUS.error, icon: XCircle },
};

interface Broadcast {
  id: string;
  title: string;
  audience: Audience;
  channel: Channel;
  status: BroadcastStatus;
  sentAt: string;
  delivered: number;
  opened: number;
  total: number;
  preview: string;
}

const MOCK_BROADCASTS: Broadcast[] = [
  { id: "BC-001", title: "Weekend surge pricing update", audience: "all_riders", channel: "push", status: "sent", sentAt: "2h ago", delivered: 18_240, opened: 12_480, total: 18_432, preview: "Hey! Starting this weekend, we're adjusting surge pricing to be more predictable. Peak hours will now have a fixed 1.5x multiplier instead of dynamic pricing." },
  { id: "BC-002", title: "New EV incentive program", audience: "all_drivers", channel: "push", status: "sent", sentAt: "1d ago", delivered: 3_410, opened: 2_890, total: 3_814, preview: "Great news! Drivers using EVs now earn an extra 5% bonus per trip. Switch to an EV today and boost your earnings." },
  { id: "BC-003", title: "API v2 migration guide", audience: "hotels", channel: "email", status: "sent", sentAt: "3d ago", delivered: 42, opened: 38, total: 44, preview: "We're upgrading to API v2 on April 1st. Please review the migration guide and update your integration before the deadline." },
  { id: "BC-004", title: "March payout schedule", audience: "fleet_owners", channel: "email", status: "scheduled", sentAt: "Tomorrow, 9am", delivered: 0, opened: 0, total: 128, preview: "Your March payouts will be processed on the 25th. Ensure your bank details are up to date." },
  { id: "BC-005", title: "Lagos zone expansion — Epe", audience: "all_drivers", channel: "sms", status: "draft", sentAt: "—", delivered: 0, opened: 0, total: 3_814, preview: "We're expanding to Epe! Drivers in this zone will receive priority ride allocation for the first 2 weeks." },
  { id: "BC-006", title: "Scheduled maintenance notice", audience: "system", channel: "push", status: "scheduled", sentAt: "Mar 20, 2am", delivered: 0, opened: 0, total: 22_246, preview: "JET will undergo scheduled maintenance on March 20, 2-4am WAT. Ride requests will be temporarily unavailable." },
  { id: "BC-007", title: "Referral bonus activated", audience: "segment", channel: "push", status: "sent", sentAt: "5d ago", delivered: 4_820, opened: 3_100, total: 5_000, preview: "Refer a friend and earn ₦500 in ride credits! Your unique referral code is ready in your profile." },
  { id: "BC-008", title: "Driver rating policy update", audience: "all_drivers", channel: "email", status: "failed", sentAt: "2d ago", delivered: 1_200, opened: 0, total: 3_814, preview: "We've updated our driver rating policy. Drivers consistently rated below 3.5 will enter a probationary review period." },
];

const COMMS_KPI = {
  totalSent: "47.2k",
  deliveryRate: "96.4%",
  openRate: "68%",
  scheduled: 2,
};

type TabKey = "all" | "sent" | "scheduled" | "draft" | "failed";

export function AdminCommsPage() {
  const { t, theme } = useAdminTheme();
  const isDark = theme === "dark";
  const [tab, setTab] = useState<TabKey>("all");
  const [search, setSearch] = useState("");
  const [composing, setComposing] = useState(false);
  const [selectedBroadcast, setSelectedBroadcast] = useState<Broadcast | null>(null);

  const tabs: { key: TabKey; label: string; count: number }[] = [
    { key: "all", label: "All", count: MOCK_BROADCASTS.length },
    { key: "sent", label: "Sent", count: MOCK_BROADCASTS.filter(b => b.status === "sent").length },
    { key: "scheduled", label: "Scheduled", count: MOCK_BROADCASTS.filter(b => b.status === "scheduled").length },
    { key: "draft", label: "Drafts", count: MOCK_BROADCASTS.filter(b => b.status === "draft").length },
    { key: "failed", label: "Failed", count: MOCK_BROADCASTS.filter(b => b.status === "failed").length },
  ];

  const filtered = tab === "all" ? MOCK_BROADCASTS : MOCK_BROADCASTS.filter(b => b.status === tab);
  const searched = search ? filtered.filter(b => b.title.toLowerCase().includes(search.toLowerCase())) : filtered;

  return (
    <AdminPageShell
      title="Communications"
      subtitle="Broadcasts & messaging"
      actions={
        <button
          onClick={() => setComposing(true)}
          className="h-8 px-3 rounded-lg flex items-center gap-1.5 transition-colors"
          style={{ background: BRAND.green, ...TY.body, fontSize: "12px", color: "#fff" }}
        >
          <Plus size={13} /> New Broadcast
        </button>
      }
    >
      <div className="p-3 md:p-5 max-w-[1400px]">
        {/* KPIs */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
          {[
            { label: "Total Sent (30d)", value: COMMS_KPI.totalSent, icon: Send, color: t.text, sub: "Across all channels" },
            { label: "Delivery Rate", value: COMMS_KPI.deliveryRate, icon: CheckCircle2, color: BRAND.green, sub: "Push + SMS + Email" },
            { label: "Open Rate", value: COMMS_KPI.openRate, icon: Eye, color: STATUS.info, sub: "Push + Email only" },
            { label: "Scheduled", value: COMMS_KPI.scheduled.toString(), icon: Calendar, color: STATUS.warning, sub: "Pending delivery" },
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
          <div className="flex items-center gap-2 px-3 h-8 rounded-lg" style={{ background: t.surface, border: `1px solid ${t.borderSubtle}` }}>
            <Search size={13} style={{ color: t.iconMuted }} />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search broadcasts…" className="bg-transparent outline-none w-36 sm:w-48" style={{ ...TY.bodyR, fontSize: "12px", color: t.text }} />
          </div>
        </div>

        {/* Broadcast List */}
        <div className="rounded-2xl overflow-hidden" style={{ background: t.surfaceRaised, border: `1px solid ${t.borderSubtle}`, boxShadow: t.shadow }}>
          {searched.map((b, i) => {
            const sm = STATUS_META_COMMS[b.status];
            const am = AUDIENCE_META[b.audience];
            const cm = CHANNEL_META[b.channel];
            const deliveryPct = b.total > 0 && b.delivered > 0 ? Math.round((b.delivered / b.total) * 100) : 0;

            return (
              <motion.button
                key={b.id}
                onClick={() => setSelectedBroadcast(b)}
                className="w-full flex items-start gap-3 px-4 py-3.5 text-left transition-colors"
                style={{ borderBottom: `1px solid ${t.borderSubtle}`, background: selectedBroadcast?.id === b.id ? t.surfaceActive : "transparent" }}
                whileHover={{ backgroundColor: isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)" }}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 + i * 0.03 }}
              >
                <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${am.color}12` }}>
                  <am.icon size={16} style={{ color: am.color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="truncate" style={{ ...TY.body, fontSize: "13px", color: t.text }}>{b.title}</span>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <div className="flex items-center gap-1 px-1.5 py-0.5 rounded" style={{ background: `${sm.color}12` }}>
                      <sm.icon size={9} style={{ color: sm.color }} />
                      <span style={{ ...TY.cap, fontSize: "9px", color: sm.color }}>{sm.label}</span>
                    </div>
                    <div className="flex items-center gap-1 px-1.5 py-0.5 rounded" style={{ background: `${cm.color}12` }}>
                      <cm.icon size={9} style={{ color: cm.color }} />
                      <span style={{ ...TY.cap, fontSize: "9px", color: cm.color }}>{cm.label}</span>
                    </div>
                    <span style={{ ...TY.bodyR, fontSize: "10px", color: t.textMuted }}>{am.label}</span>
                    {deliveryPct > 0 && (
                      <span style={{ ...TY.bodyR, fontSize: "10px", color: t.textMuted }}>· {deliveryPct}% delivered</span>
                    )}
                  </div>
                </div>
                <div className="flex flex-col items-end shrink-0">
                  <span style={{ ...TY.bodyR, fontSize: "10px", color: t.textFaint }}>{b.sentAt}</span>
                  <ChevronRight size={14} style={{ color: t.iconMuted, marginTop: 8 }} />
                </div>
              </motion.button>
            );
          })}

          {searched.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16">
              <Megaphone size={24} style={{ color: t.textGhost, marginBottom: 8 }} />
              <span style={{ ...TY.body, fontSize: "13px", color: t.textMuted }}>No broadcasts found</span>
            </div>
          )}
        </div>
      </div>

      {/* Broadcast Detail Drawer */}
      <AnimatePresence>
        {selectedBroadcast && (
          <>
            <motion.div className="fixed inset-0 z-40" style={{ background: "rgba(0,0,0,0.4)" }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedBroadcast(null)} />
            <motion.div
              className="fixed right-0 top-0 bottom-0 w-full sm:w-[420px] z-50 overflow-y-auto"
              style={{ background: t.bg, borderLeft: `1px solid ${t.border}` }}
              initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
            >
              <BroadcastDetail b={selectedBroadcast} onClose={() => setSelectedBroadcast(null)} />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Compose Modal */}
      <AnimatePresence>
        {composing && (
          <>
            <motion.div className="fixed inset-0 z-40" style={{ background: "rgba(0,0,0,0.5)" }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setComposing(false)} />
            <motion.div
              className="fixed inset-4 md:inset-auto md:top-1/2 md:left-1/2 md:w-[560px] md:max-h-[80vh] md:-translate-x-1/2 md:-translate-y-1/2 z-50 overflow-y-auto rounded-2xl"
              style={{ background: t.bg, border: `1px solid ${t.border}`, boxShadow: "0 20px 60px rgba(0,0,0,0.3)" }}
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
            >
              <ComposeModal onClose={() => setComposing(false)} />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </AdminPageShell>
  );
}

function BroadcastDetail({ b, onClose }: { b: Broadcast; onClose: () => void }) {
  const { t } = useAdminTheme();
  const sm = STATUS_META_COMMS[b.status];
  const am = AUDIENCE_META[b.audience];
  const cm = CHANNEL_META[b.channel];

  return (
    <div className="p-5">
      <div className="flex items-center justify-between mb-6">
        <span style={{ ...TY.label, fontSize: "9px", color: t.textFaint, letterSpacing: "0.06em" }}>BROADCAST DETAIL</span>
        <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: t.surfaceHover }}>
          <X size={14} style={{ color: t.icon }} />
        </button>
      </div>

      <span className="block mb-2" style={{ ...TY.cap, fontSize: "10px", color: t.textFaint }}>{b.id}</span>
      <span className="block mb-4" style={{ ...TY.sub, fontSize: "16px", color: t.text }}>{b.title}</span>

      {/* Meta badges */}
      <div className="flex items-center gap-2 flex-wrap mb-4">
        <div className="flex items-center gap-1 px-2 py-1 rounded-lg" style={{ background: `${sm.color}12` }}>
          <sm.icon size={11} style={{ color: sm.color }} />
          <span style={{ ...TY.body, fontSize: "11px", color: sm.color }}>{sm.label}</span>
        </div>
        <div className="flex items-center gap-1 px-2 py-1 rounded-lg" style={{ background: `${am.color}12` }}>
          <am.icon size={11} style={{ color: am.color }} />
          <span style={{ ...TY.body, fontSize: "11px", color: am.color }}>{am.label}</span>
        </div>
        <div className="flex items-center gap-1 px-2 py-1 rounded-lg" style={{ background: `${cm.color}12` }}>
          <cm.icon size={11} style={{ color: cm.color }} />
          <span style={{ ...TY.body, fontSize: "11px", color: cm.color }}>{cm.label}</span>
        </div>
      </div>

      {/* Preview */}
      <span className="block mb-2" style={{ ...TY.label, fontSize: "9px", color: t.textFaint, letterSpacing: "0.06em" }}>MESSAGE PREVIEW</span>
      <div className="rounded-xl p-4 mb-4" style={{ background: t.surface, border: `1px solid ${t.borderSubtle}` }}>
        <span style={{ ...TY.bodyR, fontSize: "12px", color: t.text, lineHeight: "1.6" }}>{b.preview}</span>
      </div>

      {/* Delivery metrics */}
      {b.delivered > 0 && (
        <>
          <span className="block mb-2" style={{ ...TY.label, fontSize: "9px", color: t.textFaint, letterSpacing: "0.06em" }}>DELIVERY METRICS</span>
          <div className="grid grid-cols-3 gap-2 mb-4">
            {[
              { label: "Total", value: b.total.toLocaleString(), color: t.text },
              { label: "Delivered", value: b.delivered.toLocaleString(), color: BRAND.green },
              { label: "Opened", value: b.opened.toLocaleString(), color: STATUS.info },
            ].map(m => (
              <div key={m.label} className="p-3 rounded-xl text-center" style={{ background: t.surface, border: `1px solid ${t.borderSubtle}` }}>
                <span className="block" style={{ ...TY.h, fontSize: "16px", color: m.color }}>{m.value}</span>
                <span style={{ ...TY.bodyR, fontSize: "10px", color: t.textFaint }}>{m.label}</span>
              </div>
            ))}
          </div>
          {/* Delivery bar */}
          <div className="rounded-xl p-3 mb-4" style={{ background: t.surface, border: `1px solid ${t.borderSubtle}` }}>
            <div className="flex items-center justify-between mb-2">
              <span style={{ ...TY.bodyR, fontSize: "11px", color: t.textMuted }}>Delivery Rate</span>
              <span style={{ ...TY.body, fontSize: "11px", color: BRAND.green }}>{Math.round((b.delivered / b.total) * 100)}%</span>
            </div>
            <div className="w-full h-2 rounded-full overflow-hidden" style={{ background: t.surfaceActive }}>
              <div className="h-full rounded-full" style={{ width: `${(b.delivered / b.total) * 100}%`, background: BRAND.green }} />
            </div>
          </div>
        </>
      )}

      {/* Actions */}
      <span className="block mb-2" style={{ ...TY.label, fontSize: "9px", color: t.textFaint, letterSpacing: "0.06em" }}>ACTIONS</span>
      <div className="space-y-2">
        <button className="w-full h-9 rounded-xl flex items-center justify-center gap-2 transition-colors" style={{ background: t.surface, border: `1px solid ${t.borderSubtle}`, ...TY.body, fontSize: "12px", color: t.text }}>
          <Copy size={13} /> Duplicate
        </button>
        {b.status === "draft" && (
          <button className="w-full h-9 rounded-xl flex items-center justify-center gap-2 transition-colors" style={{ background: BRAND.green, ...TY.body, fontSize: "12px", color: "#fff" }}>
            <Send size={13} /> Send Now
          </button>
        )}
      </div>
    </div>
  );
}

function ComposeModal({ onClose }: { onClose: () => void }) {
  const { t } = useAdminTheme();
  const [audience, setAudience] = useState<Audience>("all_riders");
  const [channel, setChannel] = useState<Channel>("push");

  return (
    <div className="p-5">
      <div className="flex items-center justify-between mb-6">
        <span style={{ ...TY.sub, fontSize: "15px", color: t.text }}>New Broadcast</span>
        <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: t.surfaceHover }}>
          <X size={14} style={{ color: t.icon }} />
        </button>
      </div>

      {/* Audience */}
      <span className="block mb-2" style={{ ...TY.label, fontSize: "9px", color: t.textFaint, letterSpacing: "0.06em" }}>AUDIENCE</span>
      <div className="grid grid-cols-3 gap-2 mb-4">
        {(Object.keys(AUDIENCE_META) as Audience[]).map(a => {
          const am = AUDIENCE_META[a];
          return (
            <button
              key={a}
              onClick={() => setAudience(a)}
              className="p-2.5 rounded-xl flex flex-col items-center gap-1.5 transition-colors"
              style={{ background: audience === a ? `${am.color}12` : t.surface, border: `1px solid ${audience === a ? am.color : t.borderSubtle}` }}
            >
              <am.icon size={16} style={{ color: am.color }} />
              <span style={{ ...TY.bodyR, fontSize: "10px", color: audience === a ? am.color : t.textMuted }}>{am.label}</span>
            </button>
          );
        })}
      </div>

      {/* Channel */}
      <span className="block mb-2" style={{ ...TY.label, fontSize: "9px", color: t.textFaint, letterSpacing: "0.06em" }}>CHANNEL</span>
      <div className="flex items-center gap-2 mb-4">
        {(Object.keys(CHANNEL_META) as Channel[]).map(c => {
          const cm = CHANNEL_META[c];
          return (
            <button
              key={c}
              onClick={() => setChannel(c)}
              className="flex items-center gap-1.5 px-3 h-9 rounded-lg transition-colors"
              style={{ background: channel === c ? `${cm.color}12` : t.surface, border: `1px solid ${channel === c ? cm.color : t.borderSubtle}`, ...TY.body, fontSize: "12px", color: channel === c ? cm.color : t.textMuted }}
            >
              <cm.icon size={13} />
              {cm.label}
            </button>
          );
        })}
      </div>

      {/* Title */}
      <span className="block mb-2" style={{ ...TY.label, fontSize: "9px", color: t.textFaint, letterSpacing: "0.06em" }}>TITLE</span>
      <input
        className="w-full h-10 px-3 rounded-xl bg-transparent outline-none mb-4"
        placeholder="Broadcast title…"
        style={{ border: `1px solid ${t.borderSubtle}`, ...TY.body, fontSize: "13px", color: t.text }}
      />

      {/* Message */}
      <span className="block mb-2" style={{ ...TY.label, fontSize: "9px", color: t.textFaint, letterSpacing: "0.06em" }}>MESSAGE</span>
      <textarea
        className="w-full px-3 py-2.5 rounded-xl bg-transparent outline-none resize-none mb-4"
        placeholder="Write your message…"
        rows={5}
        style={{ border: `1px solid ${t.borderSubtle}`, ...TY.bodyR, fontSize: "12px", color: t.text, lineHeight: "1.6" }}
      />

      {/* Actions */}
      <div className="flex items-center gap-2">
        <button className="flex-1 h-10 rounded-xl flex items-center justify-center gap-2" style={{ background: t.surface, border: `1px solid ${t.borderSubtle}`, ...TY.body, fontSize: "12px", color: t.text }}>
          <Calendar size={13} /> Schedule
        </button>
        <button className="flex-1 h-10 rounded-xl flex items-center justify-center gap-2" style={{ background: t.surface, border: `1px solid ${t.borderSubtle}`, ...TY.body, fontSize: "12px", color: t.textMuted }}>
          Save Draft
        </button>
        <button className="flex-1 h-10 rounded-xl flex items-center justify-center gap-2" style={{ background: BRAND.green, ...TY.body, fontSize: "12px", color: "#fff" }}>
          <Send size={13} /> Send Now
        </button>
      </div>
    </div>
  );
}
