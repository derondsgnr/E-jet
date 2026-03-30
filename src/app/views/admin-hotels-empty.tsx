/**
 * HOTELS — EMPTY STATE
 * Empty state with explainer + CTA to add hotel partner
 */

import { useNavigate } from "react-router";
import { motion } from "motion/react";
import { Building2, ArrowRight } from "lucide-react";
import { useAdminTheme, BRAND, TY } from "../config/admin-theme";

export function AdminHotelsEmpty() {
  const navigate = useNavigate();
  const { t } = useAdminTheme();

  return (
    <div className="w-full h-screen flex flex-col overflow-hidden" style={{ background: t.bg }}>
      {/* Header */}
      <div
        className="h-14 px-6 flex items-center shrink-0"
        style={{ borderBottom: `1px solid ${t.borderSubtle}` }}
      >
        <span
          style={{
            ...TY.h,
            fontFamily: "'Montserrat', sans-serif",
            fontWeight: 600,
            fontSize: "14px",
            letterSpacing: "-0.03em",
            color: t.text,
          }}
        >
          Hotels
        </span>
      </div>

      {/* Centered empty state */}
      <div className="flex-1 flex items-center justify-center p-6">
        <motion.div
          className="max-w-md text-center"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5"
            style={{ background: t.surface, border: `1px solid ${t.borderSubtle}` }}
          >
            <Building2 size={28} style={{ color: t.iconMuted }} />
          </div>

          <h3
            className="mb-2"
            style={{
              ...TY.sub,
              fontSize: "18px",
              letterSpacing: "-0.02em",
              color: t.text,
            }}
          >
            No hotel partners yet
          </h3>

          <p
            className="mb-6"
            style={{
              ...TY.bodyR,
              fontSize: "13px",
              color: t.textMuted,
              lineHeight: 1.5,
            }}
          >
            Connect hotel partners to enable corporate guest bookings, monthly invoicing, and concierge ride management.
          </p>

          <button
            className="h-12 px-6 rounded-xl flex items-center justify-center gap-2 mx-auto mb-8"
            style={{
              background: BRAND.green,
              border: `1px solid ${BRAND.green}`,
              minHeight: 44,
            }}
            onClick={() => navigate("/admin/hotels/new")}
          >
            <span
              style={{
                ...TY.body,
                fontSize: "13px",
                letterSpacing: "-0.02em",
                color: "#FFFFFF",
              }}
            >
              Add hotel partner
            </span>
            <ArrowRight size={14} style={{ color: "#FFFFFF" }} />
          </button>

          <div
            className="pt-6"
            style={{ borderTop: `1px solid ${t.borderSubtle}` }}
          >
            <span
              className="block mb-3"
              style={{
                ...TY.cap,
                fontSize: "9px",
                letterSpacing: "0.04em",
                color: t.textFaint,
              }}
            >
              HOW IT WORKS
            </span>

            <div className="space-y-2 text-left">
              {[
                "You create the hotel account",
                "They receive an invitation by email",
                "They log in and set up their team",
                "They can start booking rides for guests",
              ].map((step, i) => (
                <div key={i} className="flex items-start gap-2">
                  <span style={{ ...TY.body, fontSize: "11px", color: t.textMuted }}>
                    {i + 1}.
                  </span>
                  <span style={{ ...TY.bodyR, fontSize: "11px", color: t.textMuted }}>
                    {step}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
