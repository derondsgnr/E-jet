/**
 * Reassign Driver Modal — Driver picker for a vehicle.
 * Inverse of ReassignVehicleModal in fleet-drivers.tsx.
 * Wired into fleet-vehicles.tsx "Reassign Driver" action.
 *
 * Data source: driver_roster table × fleet_id (uses MOCK_DRIVERS)
 */

import { motion } from "motion/react";
import { X, Users, Zap } from "lucide-react";
import { useAdminTheme, BRAND, TY, STATUS } from "../../config/admin-theme";
import type { FleetDriver, FleetVehicle } from "../../config/fleet-mock-data";
import { StatusDot } from "./driver-card";

export function ReassignDriverModal({ vehicle, drivers, onAssign, onClose }: {
  vehicle: FleetVehicle;
  drivers: FleetDriver[];
  onAssign: (driverId: string) => void;
  onClose: () => void;
}) {
  const { t, theme } = useAdminTheme();
  const isDark = theme === "dark";

  // Available: approved drivers who are either unassigned or currently assigned to THIS vehicle
  const available = drivers.filter(d =>
    d.verificationStatus === "approved" &&
    (!d.assignedVehicleId || d.assignedVehicleId === vehicle.id)
  );

  const statusColor = (status: FleetDriver["status"]) => {
    switch (status) {
      case "online": return BRAND.green;
      case "on_trip": return STATUS.info;
      case "offline": return t.textFaint;
      case "suspended": return STATUS.error;
    }
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="absolute inset-0" style={{ background: isDark ? "rgba(0,0,0,0.7)" : "rgba(0,0,0,0.3)" }} onClick={onClose} />
      <motion.div
        className="relative w-full max-w-sm rounded-2xl p-6 max-h-[70vh] overflow-y-auto"
        style={{
          background: isDark ? "rgba(22,22,24,0.97)" : "#fff",
          border: `1px solid ${t.borderSubtle}`,
          boxShadow: isDark ? "0 24px 64px rgba(0,0,0,0.5)" : "0 24px 64px rgba(0,0,0,0.15)",
        }}
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 style={{ ...TY.sub, fontSize: "15px", color: t.text, lineHeight: "1.3", letterSpacing: "-0.03em" }}>Reassign Driver</h3>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:opacity-70 transition-opacity cursor-pointer" style={{ background: t.surface }}>
            <X size={14} style={{ color: t.iconMuted }} />
          </button>
        </div>

        {/* Vehicle context */}
        <div className="flex items-center gap-2.5 p-3 rounded-xl mb-4" style={{ background: t.surface, border: `1px solid ${t.borderSubtle}` }}>
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{
            background: vehicle.type === "EV" ? `${BRAND.green}08` : t.surfaceRaised || t.surface,
          }}>
            {vehicle.type === "EV" ? <Zap size={12} style={{ color: BRAND.green }} /> : (
              <span style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 600, fontSize: "8px", color: t.textFaint }}>
                {vehicle.make[0]}
              </span>
            )}
          </div>
          <div className="min-w-0">
            <span className="block truncate" style={{ ...TY.body, fontSize: "12px", color: t.text, lineHeight: "1.4", letterSpacing: "-0.02em" }}>
              {vehicle.make} {vehicle.model} {vehicle.year}
            </span>
            <span style={{ ...TY.bodyR, fontSize: "10px", color: t.textMuted, lineHeight: "1.5" }}>
              {vehicle.plate}
            </span>
          </div>
        </div>

        <p style={{ ...TY.bodyR, fontSize: "12px", color: t.textMuted, lineHeight: "1.5", marginBottom: 16 }}>
          Select a driver for this vehicle
        </p>

        <div className="space-y-2">
          {available.length === 0 && (
            <div className="py-8 text-center">
              <Users size={20} style={{ color: t.textFaint, margin: "0 auto 8px" }} />
              <span className="block" style={{ ...TY.body, fontSize: "12px", color: t.textMuted, lineHeight: "1.4", letterSpacing: "-0.02em" }}>
                No available drivers
              </span>
              <span style={{ ...TY.bodyR, fontSize: "11px", color: t.textFaint, lineHeight: "1.5" }}>
                All approved drivers are assigned to other vehicles
              </span>
            </div>
          )}
          {available.map(driver => {
            const isCurrentlyAssigned = driver.assignedVehicleId === vehicle.id;
            return (
              <button
                key={driver.id}
                className="w-full p-3.5 rounded-xl text-left flex items-center gap-3 transition-colors cursor-pointer"
                style={{
                  background: isCurrentlyAssigned ? t.greenBg : t.surface,
                  border: `1px solid ${isCurrentlyAssigned ? t.greenBorder : t.borderSubtle}`,
                }}
                onClick={() => onAssign(driver.id)}
                onMouseEnter={e => { if (!isCurrentlyAssigned) e.currentTarget.style.borderColor = `${BRAND.green}30`; }}
                onMouseLeave={e => { if (!isCurrentlyAssigned) e.currentTarget.style.borderColor = t.borderSubtle; }}
              >
                {/* Avatar */}
                <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 relative" style={{
                  background: isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)",
                  border: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}`,
                }}>
                  <span style={{
                    fontFamily: "'Montserrat', sans-serif", fontWeight: 600,
                    fontSize: "10px", color: t.textMuted, letterSpacing: "-0.02em",
                  }}>
                    {driver.name.split(" ").map(n => n[0]).join("")}
                  </span>
                  <div className="absolute -bottom-0.5 -right-0.5">
                    <StatusDot color={statusColor(driver.status)} size={8} pulse={driver.status === "on_trip"} />
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <span className="block truncate" style={{ ...TY.body, fontSize: "12px", color: t.text, lineHeight: "1.4", letterSpacing: "-0.02em" }}>
                    {driver.name}
                  </span>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span style={{ ...TY.bodyR, fontSize: "10px", color: t.textMuted, lineHeight: "1.5" }}>
                      {driver.totalRides} rides
                    </span>
                    <span style={{ ...TY.bodyR, fontSize: "10px", color: t.textFaint, lineHeight: "1.5" }}>·</span>
                    <span style={{ ...TY.bodyR, fontSize: "10px", color: t.textMuted, lineHeight: "1.5" }}>
                      {driver.rating} ★
                    </span>
                    <span style={{ ...TY.bodyR, fontSize: "10px", color: t.textFaint, lineHeight: "1.5" }}>·</span>
                    <span className="capitalize" style={{
                      ...TY.bodyR, fontSize: "10px",
                      color: statusColor(driver.status),
                      lineHeight: "1.5",
                    }}>
                      {driver.status.replace("_", " ")}
                    </span>
                  </div>
                </div>

                {isCurrentlyAssigned && (
                  <span style={{ ...TY.bodyR, fontSize: "10px", color: BRAND.green, lineHeight: "1.5" }}>Current</span>
                )}
              </button>
            );
          })}
        </div>
      </motion.div>
    </motion.div>
  );
}
