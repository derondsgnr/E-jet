/**
 * ADD VEHICLE SHEET — Shared modal for adding vehicles
 *
 * Single source of truth. Used by:
 *   - fleet-empty.tsx (empty state quick actions)
 *   - fleet-vehicles.tsx (vehicle list toolbar)
 *   - fleet-variation-e.tsx (dashboard quick actions + "Add" button)
 *
 * Wrap in <AnimatePresence> at the call site.
 */

import { useState } from "react";
import { motion } from "motion/react";
import { Car, X } from "lucide-react";
import { useAdminTheme, BRAND, TY } from "../../config/admin-theme";

interface AddVehicleSheetProps {
  onClose: () => void;
  onAdd: (make: string, plate: string) => void;
}

export function AddVehicleSheet({ onClose, onAdd }: AddVehicleSheetProps) {
  const { t, theme } = useAdminTheme();
  const isDark = theme === "dark";
  const [make, setMake] = useState("");
  const [plate, setPlate] = useState("");

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-end md:items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div
        className="absolute inset-0"
        style={{ background: isDark ? "rgba(0,0,0,0.6)" : "rgba(0,0,0,0.3)" }}
        onClick={onClose}
      />
      <motion.div
        className="relative w-full max-w-sm mx-4 rounded-2xl overflow-hidden"
        style={{
          background: isDark ? "#141416" : "#FFFFFF",
          border: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}`,
          boxShadow: isDark ? "0 16px 48px rgba(0,0,0,0.6)" : "0 16px 48px rgba(0,0,0,0.15)",
        }}
        initial={{ y: 40, scale: 0.96 }}
        animate={{ y: 0, scale: 1 }}
        exit={{ y: 20, scale: 0.98 }}
        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-5 py-4"
          style={{ borderBottom: `1px solid ${isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)"}` }}
        >
          <div className="flex items-center gap-2">
            <Car size={14} style={{ color: t.textMuted }} />
            <span style={{
              fontFamily: "'Montserrat', sans-serif", fontWeight: 600,
              fontSize: "13px", letterSpacing: "-0.02em", color: t.text, lineHeight: "1.2",
            }}>Add Vehicle</span>
          </div>
          <button onClick={onClose} className="cursor-pointer p-1 rounded-lg" style={{ background: isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)" }}>
            <X size={14} style={{ color: t.textFaint }} />
          </button>
        </div>

        {/* Body */}
        <div className="px-5 py-4 space-y-3">
          <div>
            <label style={{ ...TY.body, fontSize: "10px", color: t.textMuted, lineHeight: "1.4", display: "block", marginBottom: 4 }}>
              Make & Model
            </label>
            <input
              placeholder="e.g. Toyota Camry 2021"
              value={make}
              onChange={(e) => setMake(e.target.value)}
              className="w-full py-2.5 px-3 rounded-xl outline-none"
              style={{
                fontFamily: "'Manrope', sans-serif", fontWeight: 400,
                fontSize: "13px", color: t.text,
                background: isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)",
                border: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}`,
                lineHeight: "1.4", minHeight: 44,
              }}
            />
          </div>
          <div>
            <label style={{ ...TY.body, fontSize: "10px", color: t.textMuted, lineHeight: "1.4", display: "block", marginBottom: 4 }}>
              License Plate
            </label>
            <input
              placeholder="e.g. LND-284EP"
              value={plate}
              onChange={(e) => setPlate(e.target.value)}
              className="w-full py-2.5 px-3 rounded-xl outline-none"
              style={{
                fontFamily: "'Manrope', sans-serif", fontWeight: 400,
                fontSize: "13px", color: t.text,
                background: isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)",
                border: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}`,
                lineHeight: "1.4", minHeight: 44,
              }}
            />
          </div>
          <span style={{ ...TY.bodyR, fontSize: "9px", color: t.textFaint, lineHeight: "1.5" }}>
            Vehicle will need to pass inspection before it can be assigned to a driver.
          </span>
        </div>

        {/* Footer */}
        <div
          className="px-5 py-4 flex items-center gap-2"
          style={{ borderTop: `1px solid ${isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)"}` }}
        >
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl cursor-pointer" style={{
            border: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}`,
            fontFamily: "'Manrope', sans-serif", fontWeight: 500, fontSize: "12px", color: t.textMuted, minHeight: 44,
          }}>Cancel</button>
          <button
            onClick={() => { if (make && plate) onAdd(make, plate); }}
            className="flex-1 py-2.5 rounded-xl cursor-pointer flex items-center justify-center gap-1.5"
            style={{
              background: (!make || !plate) ? (isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)") : BRAND.green,
              color: (!make || !plate) ? t.textFaint : "#FFFFFF",
              fontFamily: "'Montserrat', sans-serif", fontWeight: 600, fontSize: "12px",
              letterSpacing: "-0.02em", minHeight: 44, opacity: (!make || !plate) ? 0.5 : 1,
            }}
          >
            <Car size={13} /> Add Vehicle
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
