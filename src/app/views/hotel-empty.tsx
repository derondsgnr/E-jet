/**
 * HOTEL — EMPTY STATE
 *
 * Post-onboarding, pre-first-ride. Shows setup progress + next actions.
 * Never a blank page — guides the user to their first guest ride.
 */

import { useState } from "react";
import { motion } from "motion/react";
import { Car, Users, Receipt, Check, Clock, ArrowRight, UserPlus, Building2 } from "lucide-react";
import { useAdminTheme, BRAND, TY, STATUS } from "../config/admin-theme";
import { useHotelContext } from "./hotel-context";
import { Toast } from "../components/shared/toast";

export function HotelEmpty() {
  const { t, theme } = useAdminTheme();
  const isDark = theme === "dark";
  const { navigateTo } = useHotelContext();
  const [toastMsg, setToastMsg] = useState<{ msg: string; type: "success" | "info" | "error" } | null>(null);
  const showToast = (msg: string, type: "success" | "info" | "error" = "info") => setToastMsg({ msg, type });
  const [expandedStep, setExpandedStep] = useState<string | null>(null);

  const CHECKLIST = [
    { id: "profile", label: "Hotel profile confirmed", done: true, icon: Building2 },
    { id: "team", label: "Invite team members", done: false, icon: Users,
      detail: "Add concierge and front desk staff so they can book rides for guests.",
      action: { label: "Invite team", onClick: () => navigateTo("settings") },
    },
    { id: "ride", label: "Book your first guest ride", done: false, icon: Car,
      detail: "Once you book a ride, your dashboard will light up with live tracking and analytics.",
      action: { label: "Book a ride", onClick: () => navigateTo("book") },
    },
    { id: "billing", label: "Review billing terms", done: true, icon: Receipt },
  ];

  const completedCount = CHECKLIST.filter(s => s.done).length;

  return (
    <div className="h-full overflow-y-auto p-4 md:p-6">
      <div className="max-w-2xl mx-auto space-y-6">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <h2 style={{
            fontFamily: "'Montserrat', sans-serif", fontWeight: 600,
            fontSize: "18px", letterSpacing: "-0.03em", color: t.text, lineHeight: "1.2",
          }}>
            Welcome, Eko Hotels
          </h2>
          <p className="mt-1" style={{ ...TY.bodyR, fontSize: "12px", color: t.textMuted, lineHeight: "1.5" }}>
            Complete setup to start booking rides for your guests.
          </p>
        </motion.div>

        {/* Progress Bar */}
        <motion.div
          className="p-4 rounded-xl"
          style={{ background: isDark ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.015)", border: `1px solid ${t.borderSubtle}` }}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
        >
          <div className="flex items-center justify-between mb-2">
            <span style={{ ...TY.body, fontSize: "11px", color: t.text, lineHeight: "1.4", letterSpacing: "-0.02em" }}>
              Setup progress
            </span>
            <span style={{ ...TY.bodyR, fontSize: "10px", color: BRAND.green, lineHeight: "1.5" }}>
              {completedCount}/{CHECKLIST.length}
            </span>
          </div>
          <div className="h-1.5 rounded-full overflow-hidden" style={{ background: isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)" }}>
            <motion.div
              className="h-full rounded-full"
              style={{ background: BRAND.green }}
              initial={{ width: 0 }}
              animate={{ width: `${(completedCount / CHECKLIST.length) * 100}%` }}
              transition={{ duration: 0.6, delay: 0.2 }}
            />
          </div>
        </motion.div>

        {/* Checklist */}
        <motion.div
          className="rounded-xl overflow-hidden"
          style={{ border: `1px solid ${t.borderSubtle}` }}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          {CHECKLIST.map((step, i) => {
            const isExpanded = expandedStep === step.id;
            const isLast = i === CHECKLIST.length - 1;
            return (
              <div key={step.id}>
                <button
                  className="w-full flex items-center gap-3 px-4 py-3.5 cursor-pointer"
                  onClick={() => setExpandedStep(isExpanded ? null : step.id)}
                  style={{ background: "transparent" }}
                >
                  {step.done ? (
                    <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0" style={{ background: `${BRAND.green}12` }}>
                      <Check size={10} style={{ color: BRAND.green }} />
                    </div>
                  ) : (
                    <div className="w-5 h-5 rounded-full shrink-0" style={{ border: `1.5px solid ${t.borderSubtle}` }} />
                  )}
                  <step.icon size={14} style={{ color: step.done ? BRAND.green : t.textFaint }} />
                  <span className="flex-1 text-left" style={{
                    ...TY.body, fontSize: "12px",
                    color: step.done ? t.textMuted : t.text,
                    textDecoration: step.done ? "line-through" : "none",
                    lineHeight: "1.4", letterSpacing: "-0.02em",
                  }}>
                    {step.label}
                  </span>
                </button>

                {isExpanded && "detail" in step && (
                  <motion.div
                    className="px-4 pb-3.5 pl-16"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    <p className="mb-2" style={{ ...TY.bodyR, fontSize: "11px", color: t.textMuted, lineHeight: "1.5" }}>
                      {step.detail}
                    </p>
                    {"action" in step && step.action && (
                      <button
                        onClick={step.action.onClick}
                        className="px-3 py-1.5 rounded-lg flex items-center gap-1.5 cursor-pointer"
                        style={{ background: `${BRAND.green}08`, border: `1px solid ${BRAND.green}14` }}
                      >
                        <span style={{ ...TY.body, fontSize: "10px", color: BRAND.green, lineHeight: "1.4", letterSpacing: "-0.02em" }}>
                          {step.action.label}
                        </span>
                        <ArrowRight size={10} style={{ color: BRAND.green }} />
                      </button>
                    )}
                  </motion.div>
                )}

                {!isLast && (
                  <div className="mx-4" style={{ height: 1, background: t.borderSubtle }} />
                )}
              </div>
            );
          })}
        </motion.div>

        {/* CTA Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <motion.div
            className="p-4 rounded-xl cursor-pointer"
            style={{ background: isDark ? `${BRAND.green}04` : `${BRAND.green}03`, border: `1px solid ${isDark ? `${BRAND.green}12` : `${BRAND.green}08`}` }}
            onClick={() => navigateTo("book")}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            whileHover={{ scale: 1.01 }}
          >
            <Car size={18} style={{ color: BRAND.green, marginBottom: 8 }} />
            <span className="block" style={{ ...TY.body, fontSize: "12px", color: BRAND.green, lineHeight: "1.4", letterSpacing: "-0.02em" }}>
              Book a ride for a guest
            </span>
            <span style={{ ...TY.bodyR, fontSize: "10px", color: t.textMuted, lineHeight: "1.5" }}>
              Airport transfers, city tours, meetings
            </span>
          </motion.div>

          <motion.div
            className="p-4 rounded-xl cursor-pointer"
            style={{ background: isDark ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.015)", border: `1px solid ${t.borderSubtle}` }}
            onClick={() => navigateTo("settings")}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            whileHover={{ scale: 1.01 }}
          >
            <UserPlus size={18} style={{ color: t.textMuted, marginBottom: 8 }} />
            <span className="block" style={{ ...TY.body, fontSize: "12px", color: t.text, lineHeight: "1.4", letterSpacing: "-0.02em" }}>
              Invite team members
            </span>
            <span style={{ ...TY.bodyR, fontSize: "10px", color: t.textMuted, lineHeight: "1.5" }}>
              Concierge, front desk staff
            </span>
          </motion.div>
        </div>

        {/* Info */}
        <motion.div
          className="px-4 py-3 rounded-xl flex items-center gap-3"
          style={{ background: isDark ? "rgba(255,255,255,0.015)" : "rgba(0,0,0,0.01)", border: `1px solid ${t.borderSubtle}` }}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }}
        >
          <Clock size={14} style={{ color: t.textFaint }} />
          <div>
            <span className="block" style={{ ...TY.body, fontSize: "11px", color: t.textSecondary, lineHeight: "1.4", letterSpacing: "-0.02em" }}>
              Billing starts on first ride
            </span>
            <span style={{ ...TY.bodyR, fontSize: "10px", color: t.textMuted, lineHeight: "1.5" }}>
              Monthly invoices. Credit limit: ₦500,000. No upfront payment required.
            </span>
          </div>
        </motion.div>

      </div>

      {toastMsg && <Toast message={toastMsg.msg} type={toastMsg.type} onDismiss={() => setToastMsg(null)} />}
    </div>
  );
}