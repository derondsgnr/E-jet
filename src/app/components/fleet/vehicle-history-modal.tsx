/**
 * Vehicle History Modal — Service + Trip history for a vehicle.
 * Tab-based: "Service Log" and "Trip History" in one modal.
 * Wired into fleet-vehicles.tsx "Service History" and "Trip History" actions.
 *
 * Data source: service_log table + trips table × vehicle_id (mock inline)
 */

import { useState } from "react";
import { motion } from "motion/react";
import { X, Wrench, MapPin, Star, Car, Zap, Calendar, Clock, AlertTriangle, CheckCircle } from "lucide-react";
import { useAdminTheme, BRAND, TY, STATUS } from "../../config/admin-theme";
import type { FleetVehicle } from "../../config/fleet-mock-data";

// ── Mock service records ───────────────────────────────────────────────────

interface ServiceRecord {
  id: string;
  date: string;
  type: "routine" | "repair" | "inspection" | "recall";
  description: string;
  cost: number;
  provider: string;
  status: "completed" | "scheduled" | "overdue";
}

interface VehicleTripRecord {
  id: string;
  date: string;
  driver: string;
  pickup: string;
  dropoff: string;
  fare: number;
  distance: string;
  duration: string;
  rating: number | null;
}

function generateServiceRecords(vehicle: FleetVehicle): ServiceRecord[] {
  const records: ServiceRecord[] = [
    { id: "s1", date: "Mar 10, 2026", type: "routine", description: "Oil change + filter replacement", cost: 15000, provider: "AutoCare Lagos", status: "completed" },
    { id: "s2", date: "Feb 14, 2026", type: "inspection", description: "Quarterly fleet inspection", cost: 5000, provider: "JET Inspection Hub", status: "completed" },
    { id: "s3", date: "Jan 22, 2026", type: "repair", description: "Brake pad replacement (front)", cost: 32000, provider: "Lagos Motors", status: "completed" },
    { id: "s4", date: "Dec 15, 2025", type: "routine", description: "Tire rotation + alignment", cost: 12000, provider: "AutoCare Lagos", status: "completed" },
    { id: "s5", date: "Nov 08, 2025", type: "inspection", description: "Annual safety inspection", cost: 8000, provider: "JET Inspection Hub", status: "completed" },
  ];

  if (vehicle.type === "EV") {
    records.splice(2, 0, {
      id: "s-ev", date: "Jan 30, 2026", type: "routine", description: "Battery health check + cabin filter", cost: 8000, provider: "BYD Service Center", status: "completed",
    });
  }

  if (vehicle.nextInspection === "Overdue") {
    records.unshift({
      id: "s-overdue", date: vehicle.nextInspection, type: "inspection", description: "Quarterly inspection — OVERDUE", cost: 5000, provider: "JET Inspection Hub", status: "overdue",
    });
  }

  if (vehicle.nextInspection && vehicle.nextInspection !== "Overdue") {
    records.unshift({
      id: "s-next", date: vehicle.nextInspection, type: "inspection", description: "Next scheduled inspection", cost: 5000, provider: "JET Inspection Hub", status: "scheduled",
    });
  }

  return records;
}

function generateTripRecords(vehicle: FleetVehicle): VehicleTripRecord[] {
  const locations = [
    ["Victoria Island", "Lekki Phase 1"], ["Ikeja", "Maryland"], ["Ikoyi", "Ajah"],
    ["Surulere", "Yaba"], ["Garki", "Maitama"], ["Wuse", "Asokoro"],
    ["Alausa", "Ikeja GRA"], ["Lekki", "Banana Island"], ["Yaba", "Ebute Metta"],
    ["Maryland", "Anthony"], ["Festac", "Apapa"], ["Ogba", "Agege"],
  ];
  const drivers = vehicle.assignedDriverName
    ? [vehicle.assignedDriverName, vehicle.assignedDriverName, vehicle.assignedDriverName, "Previous Driver"]
    : ["Unassigned"];
  const dates = [
    "Today, 2:14 PM", "Today, 11:30 AM", "Today, 9:05 AM",
    "Yesterday, 6:45 PM", "Yesterday, 3:20 PM", "Yesterday, 12:10 PM",
    "Mar 14, 5:55 PM", "Mar 14, 2:30 PM", "Mar 14, 10:15 AM",
    "Mar 13, 7:20 PM", "Mar 13, 4:00 PM", "Mar 13, 1:45 PM",
    "Mar 12, 6:30 PM", "Mar 12, 3:15 PM", "Mar 12, 11:00 AM",
  ];
  return dates.map((date, i) => {
    const [pickup, dropoff] = locations[i % locations.length];
    return {
      id: `vt-${i}`,
      date,
      driver: drivers[i % drivers.length],
      pickup,
      dropoff,
      fare: 1800 + Math.round(Math.random() * 4200),
      distance: `${3 + Math.round(Math.random() * 15)} km`,
      duration: `${8 + Math.round(Math.random() * 30)} min`,
      rating: Math.random() > 0.3 ? Math.round((4 + Math.random()) * 10) / 10 : null,
    };
  });
}

type TabId = "service" | "trips";

export function VehicleHistoryModal({ vehicle, onClose, initialTab = "service" }: {
  vehicle: FleetVehicle;
  onClose: () => void;
  initialTab?: TabId;
}) {
  const { t, theme } = useAdminTheme();
  const isDark = theme === "dark";
  const [activeTab, setActiveTab] = useState<TabId>(initialTab);
  const serviceRecords = generateServiceRecords(vehicle);
  const tripRecords = generateTripRecords(vehicle);

  const tabs: { id: TabId; label: string; count: number }[] = [
    { id: "service", label: "Service Log", count: serviceRecords.length },
    { id: "trips", label: "Trip History", count: tripRecords.length },
  ];

  const serviceTypeIcon = (type: ServiceRecord["type"]) => {
    switch (type) {
      case "routine": return <Wrench size={12} style={{ color: STATUS.info }} />;
      case "repair": return <AlertTriangle size={12} style={{ color: STATUS.warning }} />;
      case "inspection": return <CheckCircle size={12} style={{ color: BRAND.green }} />;
      case "recall": return <AlertTriangle size={12} style={{ color: STATUS.error }} />;
    }
  };

  const serviceStatusColor = (status: ServiceRecord["status"]) => {
    switch (status) {
      case "completed": return BRAND.green;
      case "scheduled": return STATUS.info;
      case "overdue": return STATUS.error;
    }
  };

  const totalServiceCost = serviceRecords.filter(s => s.status === "completed").reduce((s, r) => s + r.cost, 0);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="absolute inset-0" style={{ background: isDark ? "rgba(0,0,0,0.7)" : "rgba(0,0,0,0.3)" }} onClick={onClose} />
      <motion.div
        className="relative w-full max-w-md rounded-2xl max-h-[80vh] flex flex-col overflow-hidden"
        style={{
          background: isDark ? "rgba(22,22,24,0.97)" : "#fff",
          border: `1px solid ${t.borderSubtle}`,
          boxShadow: isDark ? "0 24px 64px rgba(0,0,0,0.5)" : "0 24px 64px rgba(0,0,0,0.15)",
        }}
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
      >
        {/* Header */}
        <div className="px-6 pt-5 pb-4 shrink-0" style={{ borderBottom: `1px solid ${t.borderSubtle}` }}>
          <div className="flex items-center justify-between mb-3">
            <h3 style={{ ...TY.sub, fontSize: "15px", color: t.text, lineHeight: "1.3", letterSpacing: "-0.03em" }}>
              Vehicle History
            </h3>
            <button onClick={onClose} className="p-1.5 rounded-lg hover:opacity-70 transition-opacity cursor-pointer" style={{ background: t.surface }}>
              <X size={14} style={{ color: t.iconMuted }} />
            </button>
          </div>

          {/* Vehicle summary */}
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{
              background: vehicle.type === "EV" ? `${BRAND.green}08` : t.surface,
              border: `1px solid ${vehicle.type === "EV" ? `${BRAND.green}15` : t.borderSubtle}`,
            }}>
              {vehicle.type === "EV" ? <Zap size={14} style={{ color: BRAND.green }} /> : <Car size={14} style={{ color: t.iconSecondary }} />}
            </div>
            <div>
              <span className="block" style={{ ...TY.body, fontSize: "13px", color: t.text, lineHeight: "1.4", letterSpacing: "-0.02em" }}>
                {vehicle.make} {vehicle.model} {vehicle.year}
              </span>
              <span style={{ ...TY.bodyR, fontSize: "11px", color: t.textMuted, lineHeight: "1.5" }}>
                {vehicle.plate} · {vehicle.mileage?.toLocaleString()} km
              </span>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-0.5 p-0.5 rounded-lg" style={{ background: t.surface }}>
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="flex-1 py-1.5 px-3 rounded-md transition-all cursor-pointer flex items-center justify-center gap-1.5"
                style={{
                  background: activeTab === tab.id
                    ? isDark ? "rgba(255,255,255,0.06)" : "#fff"
                    : "transparent",
                  boxShadow: activeTab === tab.id ? "0 1px 3px rgba(0,0,0,0.1)" : "none",
                }}
              >
                <span style={{
                  ...TY.body, fontSize: "11px",
                  color: activeTab === tab.id ? t.text : t.textMuted,
                  lineHeight: "1.4", letterSpacing: "-0.02em",
                }}>
                  {tab.label}
                </span>
                <span className="px-1.5 py-0.5 rounded-md" style={{
                  background: activeTab === tab.id ? `${BRAND.green}10` : "transparent",
                  ...TY.bodyR, fontSize: "9px",
                  color: activeTab === tab.id ? BRAND.green : t.textFaint,
                  lineHeight: "1.5",
                }}>
                  {tab.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {activeTab === "service" && (
            <div>
              {/* Cost summary */}
              <div className="flex items-center gap-3 p-3 rounded-xl mb-4" style={{ background: t.surface, border: `1px solid ${t.borderSubtle}` }}>
                <div>
                  <span className="block" style={{ ...TY.bodyR, fontSize: "10px", color: t.textMuted, lineHeight: "1.5" }}>Total maintenance cost</span>
                  <span style={{ ...TY.sub, fontSize: "16px", color: t.text, lineHeight: "1.3", letterSpacing: "-0.03em" }}>
                    ₦{totalServiceCost.toLocaleString()}
                  </span>
                </div>
                <div className="flex-1" />
                <div className="text-right">
                  <span className="block" style={{ ...TY.bodyR, fontSize: "10px", color: t.textMuted, lineHeight: "1.5" }}>Next service</span>
                  <span style={{ ...TY.body, fontSize: "12px", color: vehicle.nextInspection === "Overdue" ? STATUS.error : t.text, lineHeight: "1.4", letterSpacing: "-0.02em" }}>
                    {vehicle.nextInspection || "—"}
                  </span>
                </div>
              </div>

              {/* Service records */}
              <div className="space-y-1">
                {serviceRecords.map((record, i) => (
                  <motion.div
                    key={record.id}
                    className="py-3 flex items-start gap-3"
                    style={{ borderBottom: i < serviceRecords.length - 1 ? `1px solid ${t.borderSubtle}` : "none" }}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.03 }}
                  >
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5" style={{ background: t.surface }}>
                      {serviceTypeIcon(record.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <span className="block" style={{ ...TY.body, fontSize: "12px", color: t.text, lineHeight: "1.4", letterSpacing: "-0.02em" }}>
                          {record.description}
                        </span>
                        <span className="shrink-0 px-1.5 py-0.5 rounded-md" style={{
                          background: `${serviceStatusColor(record.status)}08`,
                          ...TY.bodyR, fontSize: "9px", color: serviceStatusColor(record.status), lineHeight: "1.5",
                        }}>
                          {record.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <span style={{ ...TY.bodyR, fontSize: "10px", color: t.textMuted, lineHeight: "1.5" }}>{record.date}</span>
                        <span style={{ ...TY.bodyR, fontSize: "10px", color: t.textFaint, lineHeight: "1.5" }}>·</span>
                        <span style={{ ...TY.bodyR, fontSize: "10px", color: t.textMuted, lineHeight: "1.5" }}>{record.provider}</span>
                        {record.status === "completed" && (
                          <>
                            <span style={{ ...TY.bodyR, fontSize: "10px", color: t.textFaint, lineHeight: "1.5" }}>·</span>
                            <span style={{ ...TY.body, fontSize: "10px", color: t.text, lineHeight: "1.4", letterSpacing: "-0.02em" }}>₦{record.cost.toLocaleString()}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "trips" && (
            <div className="space-y-1">
              {tripRecords.map((trip, i) => (
                <motion.div
                  key={trip.id}
                  className="py-3 flex items-start gap-3"
                  style={{ borderBottom: i < tripRecords.length - 1 ? `1px solid ${t.borderSubtle}` : "none" }}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                >
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5" style={{ background: t.surface }}>
                    <MapPin size={12} style={{ color: t.iconSecondary }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="truncate" style={{ ...TY.body, fontSize: "12px", color: t.text, lineHeight: "1.4", letterSpacing: "-0.02em" }}>
                        {trip.pickup} → {trip.dropoff}
                      </span>
                      <span className="shrink-0" style={{ ...TY.body, fontSize: "12px", color: t.text, lineHeight: "1.4", letterSpacing: "-0.02em" }}>
                        ₦{trip.fare.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                      <span style={{ ...TY.bodyR, fontSize: "10px", color: t.textMuted, lineHeight: "1.5" }}>{trip.date}</span>
                      <span style={{ ...TY.bodyR, fontSize: "10px", color: t.textFaint, lineHeight: "1.5" }}>·</span>
                      <span style={{ ...TY.bodyR, fontSize: "10px", color: t.textMuted, lineHeight: "1.5" }}>{trip.driver}</span>
                      <span style={{ ...TY.bodyR, fontSize: "10px", color: t.textFaint, lineHeight: "1.5" }}>·</span>
                      <span style={{ ...TY.bodyR, fontSize: "10px", color: t.textMuted, lineHeight: "1.5" }}>{trip.distance}</span>
                      {trip.rating && (
                        <>
                          <span style={{ ...TY.bodyR, fontSize: "10px", color: t.textFaint, lineHeight: "1.5" }}>·</span>
                          <span className="flex items-center gap-0.5">
                            <Star size={8} style={{ color: STATUS.warning, fill: STATUS.warning }} />
                            <span style={{ ...TY.bodyR, fontSize: "10px", color: t.textMuted, lineHeight: "1.5" }}>{trip.rating}</span>
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
