/**
 * DS FLEET — Fleet-specific component documentation.
 * DriverCard (3 variants), DriverHistoryModal, VehicleHistoryModal,
 * ReassignDriverModal, AddVehicleSheet, InviteDriverSheet,
 * NotificationPanel, Table row patterns.
 */

import { useState } from "react";
import {
  Car, Users, Wallet, Zap, Star, Clock, MapPin,
  ChevronRight, Wrench, Bell, AlertTriangle, CheckCircle,
  UserPlus, Plus, X, Mail, Settings2,
} from "lucide-react";
import { useAdminTheme, BRAND, TY, STATUS } from "../config/admin-theme";
import { Sparkline, StatusDot } from "../components/fleet/driver-card";
import { Section, DSCard, SLabel, PropTable, NoteCard, DSep, StatusBadge } from "./ds-primitives";

export default function DSFleet() {
  const { t, theme } = useAdminTheme();
  const isDark = theme === "dark";

  return (
    <div className="max-w-[1100px] mx-auto px-5 py-8 space-y-14">

      {/* ═══ DRIVER CARD ═══ */}
      <Section id="driver-card" title="DRIVER CARD — 3 VARIANTS" description="Compact (list), Detailed (expanded), Mini (inline). + Sparkline + StatusDot.">
        <DSCard>
          <SLabel>COMPACT VARIANT (LIST ROW)</SLabel>
          <div className="space-y-0 mb-6">
            {[
              { name: "Chidi Okafor", status: "on_trip", rating: 4.8, rides: 1240, trend: [3, 4, 2, 6, 5, 8, 7, 9, 10, 12], vehicle: "Toyota Camry", isEv: false, earnings: "₦45K" },
              { name: "Amaka Eze", status: "online", rating: 4.9, rides: 890, trend: [5, 6, 4, 7, 8, 9, 7, 10, 11, 12], vehicle: "Hyundai Ioniq 5", isEv: true, earnings: "₦38K" },
              { name: "Emeka Nwankwo", status: "offline", rating: 4.5, rides: 2100, trend: [12, 10, 9, 7, 6, 5, 4, 3, 2, 1], vehicle: "Kia EV6", isEv: true, earnings: "₦0" },
            ].map(d => {
              const statusColor = d.status === "on_trip" ? BRAND.green : d.status === "online" ? STATUS.info : "#737373";
              const statusLabel = d.status === "on_trip" ? "On Trip" : d.status === "online" ? "Online" : "Offline";
              return (
                <div key={d.name} className="flex items-center gap-3 px-4 py-3 cursor-pointer group" style={{ borderBottom: `1px solid ${isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.03)"}` }}>
                  <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0" style={{ background: `${BRAND.green}12`, border: `1px solid ${BRAND.green}20` }}>
                    <span style={{ ...TY.body, fontSize: "11px", color: BRAND.green, letterSpacing: "-0.02em" }}>{d.name.split(" ").map(n => n[0]).join("")}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span style={{ ...TY.body, fontSize: "12px", color: t.text, letterSpacing: "-0.02em" }}>{d.name}</span>
                      <StatusDot color={statusColor} size={5} pulse={d.status === "on_trip"} />
                      {d.isEv && <span className="px-1.5 py-0.5 rounded" style={{ background: `${BRAND.green}10`, ...TY.cap, fontSize: "8px", color: BRAND.green }}><Zap size={8} className="inline" /> EV</span>}
                    </div>
                    <span style={{ ...TY.bodyR, fontSize: "10px", color: t.textMuted, letterSpacing: "-0.02em" }}>{d.vehicle} · {d.rides} trips · {d.rating}★</span>
                  </div>
                  <Sparkline data={d.trend} color={statusColor} width={48} height={16} />
                  <span style={{ ...TY.body, fontSize: "10px", color: t.textSecondary, letterSpacing: "-0.02em" }}>{d.earnings}</span>
                  <ChevronRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: t.iconMuted }} />
                </div>
              );
            })}
          </div>

          <DSep />

          <SLabel>DETAILED VARIANT (EXPANDED)</SLabel>
          <div className="rounded-xl overflow-hidden" style={{ border: `1px solid ${t.borderSubtle}` }}>
            <div className="flex items-center gap-3 px-4 py-3" style={{ background: t.surface }}>
              <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: `${BRAND.green}12`, border: `1.5px solid ${BRAND.green}25` }}>
                <span style={{ ...TY.body, fontSize: "12px", color: BRAND.green, letterSpacing: "-0.02em" }}>CO</span>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span style={{ ...TY.body, fontSize: "13px", color: t.text, letterSpacing: "-0.02em" }}>Chidi Okafor</span>
                  <StatusDot color={BRAND.green} size={6} pulse />
                  <span style={{ ...TY.bodyR, fontSize: "10px", color: BRAND.green, letterSpacing: "-0.02em" }}>On Trip</span>
                </div>
                <span style={{ ...TY.bodyR, fontSize: "10px", color: t.textMuted, letterSpacing: "-0.02em" }}>Toyota Camry · LND-234-AB</span>
              </div>
              <div className="flex flex-col items-end">
                <span style={{ ...TY.body, fontSize: "14px", color: t.text, letterSpacing: "-0.02em" }}>4.8★</span>
                <span style={{ ...TY.bodyR, fontSize: "10px", color: t.textFaint, letterSpacing: "-0.02em" }}>1,240 trips</span>
              </div>
            </div>
            {/* Expanded detail */}
            <div className="px-4 py-3 grid grid-cols-4 gap-3" style={{ borderTop: `1px solid ${isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.03)"}` }}>
              {[
                { label: "Today", value: "₦45K", color: BRAND.green },
                { label: "This week", value: "₦180K" },
                { label: "Online hrs", value: "6h 20m" },
                { label: "Acceptance", value: "92%" },
              ].map(s => (
                <div key={s.label} className="text-center">
                  <span style={{ ...TY.h, fontSize: "14px", color: s.color || t.text, display: "block" }}>{s.value}</span>
                  <span style={{ ...TY.bodyR, fontSize: "9px", color: t.textFaint, letterSpacing: "-0.02em" }}>{s.label}</span>
                </div>
              ))}
            </div>
            {/* Sparkline */}
            <div className="px-4 py-2 flex items-center gap-3" style={{ borderTop: `1px solid ${isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.03)"}` }}>
              <span style={{ ...TY.bodyR, fontSize: "9px", color: t.textFaint, letterSpacing: "-0.02em" }}>7-day trend</span>
              <Sparkline data={[3, 4, 2, 6, 5, 8, 7, 9, 10, 12]} color={BRAND.green} width={120} height={24} />
            </div>
          </div>

          <DSep />

          <SLabel>MINI VARIANT (INLINE)</SLabel>
          <div className="flex flex-wrap gap-3">
            {[
              { name: "Chidi O.", color: BRAND.green },
              { name: "Amaka E.", color: STATUS.info },
              { name: "Emeka N.", color: "#737373" },
            ].map(d => (
              <div key={d.name} className="flex items-center gap-2 px-3 py-2 rounded-xl" style={{ background: t.surface, border: `1px solid ${t.borderSubtle}` }}>
                <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ background: `${BRAND.green}10` }}>
                  <span style={{ ...TY.body, fontSize: "8px", color: BRAND.green, letterSpacing: "-0.02em" }}>{d.name.split(" ").map(n => n[0]).join("")}</span>
                </div>
                <span style={{ ...TY.body, fontSize: "10px", color: t.text, letterSpacing: "-0.02em" }}>{d.name}</span>
                <StatusDot color={d.color} size={5} />
              </div>
            ))}
          </div>
        </DSCard>
      </Section>

      {/* ═══ FLEET MODALS ═══ */}
      <Section id="fleet-modals" title="FLEET MODALS" description="DriverHistoryModal, VehicleHistoryModal, ReassignDriverModal.">
        <DSCard>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                name: "DriverHistoryModal",
                desc: "Full trip/earnings/rating history. Tabbed: Trips · Earnings · Ratings.",
                tabs: ["Trips", "Earnings", "Ratings"],
                icon: Users,
                source: "trips table × driver_id",
              },
              {
                name: "VehicleHistoryModal",
                desc: "Service log + trip history. Tabbed: Service Log · Trip History.",
                tabs: ["Service Log", "Trip History"],
                icon: Car,
                source: "service_log + trips × vehicle_id",
              },
              {
                name: "ReassignDriverModal",
                desc: "Driver picker for vehicle assignment. Shows available approved drivers.",
                tabs: ["Available Drivers"],
                icon: UserPlus,
                source: "driver_roster × fleet_id",
              },
            ].map(modal => {
              const Icon = modal.icon;
              return (
                <div key={modal.name} className="rounded-xl overflow-hidden" style={{ border: `1px solid ${t.borderSubtle}` }}>
                  <div className="px-4 py-3 flex items-center gap-2" style={{ background: t.surface }}>
                    <Icon size={14} style={{ color: t.icon }} />
                    <span style={{ ...TY.body, fontSize: "11px", color: t.text, letterSpacing: "-0.02em" }}>{modal.name}</span>
                  </div>
                  <div className="px-4 py-3">
                    <span style={{ ...TY.bodyR, fontSize: "10px", color: t.textMuted, display: "block", marginBottom: 8, letterSpacing: "-0.02em" }}>{modal.desc}</span>
                    <div className="flex gap-1 mb-3">
                      {modal.tabs.map((tab, i) => (
                        <span key={tab} className="px-2 py-1 rounded-lg" style={{
                          background: i === 0 ? (isDark ? `${BRAND.green}08` : `${BRAND.green}04`) : "transparent",
                          border: `1px solid ${i === 0 ? `${BRAND.green}14` : "transparent"}`,
                          ...TY.body, fontSize: "9px", color: i === 0 ? BRAND.green : t.textMuted, letterSpacing: "-0.02em",
                        }}>{tab}</span>
                      ))}
                    </div>
                    <span style={{ ...TY.bodyR, fontSize: "9px", color: t.textFaint, fontStyle: "italic", letterSpacing: "-0.02em" }}>Source: {modal.source}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </DSCard>
      </Section>

      {/* ═══ FLEET SHEETS ═══ */}
      <Section id="fleet-sheets" title="FLEET SHEETS" description="AddVehicleSheet, InviteDriverSheet — shared bottom sheet / center modal.">
        <DSCard>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Add Vehicle */}
            <div className="rounded-2xl overflow-hidden" style={{ background: isDark ? "#141416" : "#fff", border: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}`, boxShadow: t.shadowLg }}>
              <div className="flex items-center justify-between px-5 py-3" style={{ borderBottom: `1px solid ${t.borderSubtle}` }}>
                <div className="flex items-center gap-2"><Car size={14} style={{ color: t.textMuted }} /><span style={{ ...TY.sub, fontSize: "13px", color: t.text, letterSpacing: "-0.02em" }}>Add Vehicle</span></div>
                <div className="w-6 h-6 rounded-md flex items-center justify-center" style={{ background: t.surface }}><X size={12} style={{ color: t.textMuted }} /></div>
              </div>
              <div className="p-5 space-y-3">
                <div className="px-3 py-2 rounded-xl" style={{ background: isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)", border: `1px solid ${t.borderSubtle}` }}>
                  <span style={{ ...TY.bodyR, fontSize: "11px", color: t.textFaint, letterSpacing: "-0.02em" }}>Make & Model</span>
                </div>
                <div className="px-3 py-2 rounded-xl" style={{ background: isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)", border: `1px solid ${t.borderSubtle}` }}>
                  <span style={{ ...TY.bodyR, fontSize: "11px", color: t.textFaint, letterSpacing: "-0.02em" }}>Plate Number</span>
                </div>
                <button className="w-full py-2.5 rounded-xl text-center" style={{ background: BRAND.green, ...TY.body, fontSize: "12px", color: "#fff", letterSpacing: "-0.02em" }}>Add Vehicle</button>
              </div>
            </div>
            {/* Invite Driver */}
            <div className="rounded-2xl overflow-hidden" style={{ background: isDark ? "#141416" : "#fff", border: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}`, boxShadow: t.shadowLg }}>
              <div className="flex items-center justify-between px-5 py-3" style={{ borderBottom: `1px solid ${t.borderSubtle}` }}>
                <div className="flex items-center gap-2"><UserPlus size={14} style={{ color: t.textMuted }} /><span style={{ ...TY.sub, fontSize: "13px", color: t.text, letterSpacing: "-0.02em" }}>Invite Driver</span></div>
                <div className="w-6 h-6 rounded-md flex items-center justify-center" style={{ background: t.surface }}><X size={12} style={{ color: t.textMuted }} /></div>
              </div>
              <div className="p-5 space-y-3">
                <div className="px-3 py-2 rounded-xl" style={{ background: isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)", border: `1px solid ${t.borderSubtle}` }}>
                  <span style={{ ...TY.bodyR, fontSize: "11px", color: t.textFaint, letterSpacing: "-0.02em" }}>Full Name</span>
                </div>
                <div className="px-3 py-2 rounded-xl" style={{ background: isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)", border: `1px solid ${t.borderSubtle}` }}>
                  <span style={{ ...TY.bodyR, fontSize: "11px", color: t.textFaint, letterSpacing: "-0.02em" }}>Email or Phone</span>
                </div>
                <button className="w-full py-2.5 rounded-xl text-center flex items-center justify-center gap-1.5" style={{ background: BRAND.green, ...TY.body, fontSize: "12px", color: "#fff", letterSpacing: "-0.02em" }}><Mail size={13} /> Send Invite</button>
              </div>
            </div>
          </div>
          <NoteCard variant="info">Shared components: used in fleet-empty.tsx, fleet-vehicles.tsx, fleet-variation-e.tsx. Wrap in AnimatePresence at call site.</NoteCard>
        </DSCard>
      </Section>

      {/* ═══ NOTIFICATION PANEL ═══ */}
      <Section id="notification-panel" title="NOTIFICATION PANEL" description="Category-filtered dropdown. Earnings · Drivers · Vehicles · System.">
        <DSCard>
          <div className="rounded-xl overflow-hidden" style={{ border: `1px solid ${t.borderSubtle}`, maxWidth: 360 }}>
            <div className="flex items-center justify-between px-4 py-2.5" style={{ borderBottom: `1px solid ${t.borderSubtle}` }}>
              <span style={{ ...TY.sub, fontSize: "12px", color: t.text, letterSpacing: "-0.02em" }}>Notifications</span>
              <span style={{ ...TY.bodyR, fontSize: "10px", color: BRAND.green, cursor: "pointer", letterSpacing: "-0.02em" }}>Mark all read</span>
            </div>
            {/* Category filters */}
            <div className="flex gap-1.5 px-4 py-2" style={{ borderBottom: `1px solid ${isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.03)"}` }}>
              {[
                { label: "All", active: true, color: t.text },
                { label: "Earnings", active: false, icon: Wallet, color: BRAND.green },
                { label: "Drivers", active: false, icon: Users, color: STATUS.info },
                { label: "Vehicles", active: false, icon: Car, color: STATUS.warning },
                { label: "System", active: false, icon: Settings2, color: "#8B8B8D" },
              ].map(cat => (
                <span key={cat.label} className="px-2 py-1 rounded-lg" style={{
                  background: cat.active ? (isDark ? "rgba(255,255,255,0.06)" : "#fff") : "transparent",
                  border: `1px solid ${cat.active ? t.borderStrong : "transparent"}`,
                  ...TY.body, fontSize: "9px", color: cat.active ? t.text : t.textMuted, letterSpacing: "-0.02em",
                }}>{cat.label}</span>
              ))}
            </div>
            {/* Notification items */}
            {[
              { icon: Wallet, color: BRAND.green, title: "Payout processed", desc: "₦680,000 sent to GTBank ****4521", time: "2m", unread: true, cat: "earnings" },
              { icon: Users, color: STATUS.info, title: "Driver went offline", desc: "Emeka Nwankwo — 24h inactive", time: "1h", unread: true, cat: "drivers" },
              { icon: Car, color: STATUS.warning, title: "Maintenance due", desc: "Camry LND-234 — 15,000km service", time: "3h", unread: false, cat: "vehicles" },
              { icon: AlertTriangle, color: STATUS.error, title: "Insurance expiring", desc: "Amaka Eze — expires in 3 days", time: "5h", unread: false, cat: "drivers" },
            ].map((n, i) => {
              const NIcon = n.icon;
              return (
                <div key={i} className="flex items-start gap-3 px-4 py-3 cursor-pointer" style={{
                  background: n.unread ? (isDark ? "rgba(29,185,84,0.02)" : "rgba(29,185,84,0.015)") : "transparent",
                  borderBottom: i < 3 ? `1px solid ${isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.03)"}` : "none",
                }}>
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5" style={{ background: `${n.color}10` }}>
                    <NIcon size={12} style={{ color: n.color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="truncate" style={{ ...TY.body, fontSize: "11px", color: t.text, letterSpacing: "-0.02em" }}>{n.title}</span>
                      {n.unread && <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: BRAND.green }} />}
                    </div>
                    <span className="truncate block" style={{ ...TY.bodyR, fontSize: "10px", color: t.textMuted, letterSpacing: "-0.02em" }}>{n.desc}</span>
                  </div>
                  <span className="shrink-0" style={{ ...TY.bodyR, fontSize: "9px", color: t.textFaint }}>{n.time}</span>
                </div>
              );
            })}
          </div>
          <PropTable rows={[
            ["notifications", "FleetNotification[]", "From fleet-mock-data.ts"],
            ["onMarkAllRead", "() => void", "—"],
            ["onNotifClick", "(id) => void", "Navigate + mark read"],
          ]} />
        </DSCard>
      </Section>

      {/* ═══ TABLE PATTERNS ═══ */}
      <Section id="table-patterns" title="TABLE ROW PATTERNS" description="Fleet drivers, vehicles, hotel rides — row patterns with inline data viz.">
        <DSCard>
          <SLabel>VEHICLE TABLE ROW</SLabel>
          <div className="space-y-0 mb-5">
            {[
              { plate: "LND-234-AB", make: "Toyota Camry 2024", type: "Gas", battery: null, driver: "Chidi Okafor", status: "Active", statusColor: BRAND.green },
              { plate: "ABJ-567-EV", make: "Hyundai Ioniq 5", type: "EV", battery: 78, driver: "Amaka Eze", status: "Active", statusColor: BRAND.green },
              { plate: "LND-890-KE", make: "Kia EV6", type: "EV", battery: 23, driver: "—", status: "Maintenance", statusColor: STATUS.warning },
            ].map(v => (
              <div key={v.plate} className="flex items-center gap-3 px-4 py-3 cursor-pointer group" style={{ borderBottom: `1px solid ${isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.03)"}` }}>
                <Car size={14} style={{ color: t.iconSecondary }} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span style={{ ...TY.body, fontSize: "12px", color: t.text, letterSpacing: "-0.02em" }}>{v.make}</span>
                    {v.type === "EV" && <span className="px-1.5 py-0.5 rounded" style={{ background: `${BRAND.green}10`, ...TY.cap, fontSize: "8px", color: BRAND.green }}><Zap size={8} className="inline" /> EV</span>}
                  </div>
                  <span style={{ ...TY.bodyR, fontSize: "10px", color: t.textMuted, letterSpacing: "-0.02em" }}>{v.plate} · {v.driver}</span>
                </div>
                {v.battery !== null && (
                  <div className="flex items-center gap-1.5">
                    <div className="w-8 h-2 rounded-full overflow-hidden" style={{ background: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)" }}>
                      <div className="h-full rounded-full" style={{ width: `${v.battery}%`, background: v.battery > 50 ? BRAND.green : v.battery > 20 ? STATUS.warning : STATUS.error }} />
                    </div>
                    <span style={{ ...TY.body, fontSize: "9px", color: t.textFaint, fontFamily: "monospace" }}>{v.battery}%</span>
                  </div>
                )}
                <StatusBadge label={v.status} color={v.statusColor} bg={`${v.statusColor}10`} border={`${v.statusColor}20`} />
                <ChevronRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: t.iconMuted }} />
              </div>
            ))}
          </div>

          <DSep />

          <SLabel>TABLE TOOLBAR PATTERN</SLabel>
          <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl mb-3" style={{ background: t.surface, border: `1px solid ${t.borderSubtle}` }}>
            <div className="flex items-center gap-2 flex-1 px-3 py-1.5 rounded-lg" style={{ background: isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)", border: `1px solid ${t.borderSubtle}` }}>
              <span style={{ ...TY.bodyR, fontSize: "11px", color: t.textFaint, letterSpacing: "-0.02em" }}>Search vehicles...</span>
            </div>
            <div className="flex gap-1.5">
              {["All", "Active", "EV", "Maintenance"].map((f, i) => (
                <span key={f} className="px-2 py-1 rounded-lg" style={{
                  background: i === 0 ? (isDark ? `${BRAND.green}08` : `${BRAND.green}04`) : "transparent",
                  border: `1px solid ${i === 0 ? `${BRAND.green}14` : "transparent"}`,
                  ...TY.body, fontSize: "9px", color: i === 0 ? BRAND.green : t.textMuted, letterSpacing: "-0.02em",
                }}>{f}</span>
              ))}
            </div>
            <button className="px-3 py-1.5 rounded-lg flex items-center gap-1" style={{ background: BRAND.green }}>
              <Plus size={11} color="#fff" />
              <span style={{ ...TY.body, fontSize: "10px", color: "#fff", letterSpacing: "-0.02em" }}>Add</span>
            </button>
          </div>
          <NoteCard variant="info">Search + filter pills + sort + action button. All tables follow this toolbar pattern.</NoteCard>
        </DSCard>
      </Section>

      <div className="py-6 text-center">
        <span style={{ ...TY.bodyR, fontSize: "10px", color: t.textGhost, letterSpacing: "-0.02em" }}>JET Design System · Fleet Components · 17 Mar 2026</span>
      </div>
    </div>
  );
}
