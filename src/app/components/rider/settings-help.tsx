 /**
 * Help & Support — FAQ, contact, report issue.
 *
 * NORTHSTAR: Apple Support + Airbnb Help Center.
 * Progressive disclosure: FAQ first (self-serve), contact last.
 */

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ArrowLeft, ChevronDown, MessageCircle, Mail, Phone,
  FileText, HelpCircle, CreditCard, Shield, Zap,
} from "lucide-react";
import { GLASS_COLORS, GLASS_TYPE, MOTION, type GlassColorMode } from "../../config/project";
import { BRAND_COLORS } from "../../config/brand";
import { RIDER_TYPE as RT } from "../../config/rider-type";

interface FAQ {
  id: string;
  icon: typeof HelpCircle;
  question: string;
  answer: string;
}

const FAQS: FAQ[] = [
  {
    id: "faq-1", icon: CreditCard,
    question: "How do I get a refund?",
    answer: "If your ride was cancelled by a driver or you were incorrectly charged, go to Activity → tap the trip → Report issue. Refunds are processed within 24 hours to your original payment method.",
  },
  {
    id: "faq-2", icon: Shield,
    question: "How do I report a safety concern?",
    answer: "During a ride, tap the shield icon to access emergency features. After a ride, go to Activity → tap the trip → Report issue → Safety concern. For immediate emergencies, always call local authorities first.",
  },
  {
    id: "faq-3", icon: Zap,
    question: "What is JetEV and how does it work?",
    answer: "JetEV is our electric vehicle fleet. When available, you can choose an EV for your ride at no extra cost. EV rides contribute to your carbon savings tracked in your Activity screen.",
  },
  {
    id: "faq-4", icon: CreditCard,
    question: "How do I change my payment method?",
    answer: "Go to Wallet → tap your payment method → Manage. You can add new cards, set a default, or remove old ones. You can also pay with JET Wallet balance or cash.",
  },
  {
    id: "faq-5", icon: HelpCircle,
    question: "Why was my ride more expensive than estimated?",
    answer: "Fares can vary from estimates due to route changes, traffic, or surge pricing during peak hours. You can see the full breakdown by tapping the trip in Activity. If you believe there's an error, report it for review.",
  },
];

interface Props {
  colorMode: GlassColorMode;
  onBack: () => void;
  showToast: (config: ToastConfig) => void;
}

export function HelpSettings({ colorMode, onBack, showToast }: Props) {
  const c = GLASS_COLORS[colorMode];
  const d = colorMode === "dark";
  const [expanded, setExpanded] = useState<string | null>(null);

  const toggle = (id: string) => {
    setExpanded((prev) => (prev === id ? null : id));
  };

  const handleContact = (method: string) => {
    showToast({
      message: method === "chat"
        ? "Starting live chat..."
        : method === "email"
          ? "Opening email draft..."
          : "Calling JET support...",
      variant: "info",
      duration: 2000,
    });
  };

  return (
    <div className="h-full flex flex-col" style={{ background: c.bg }}>
      {/* Header */}
      <div className="flex items-center gap-3 px-5 pt-14 pb-3">
        <motion.button
          className="w-9 h-9 rounded-xl flex items-center justify-center"
          style={{ background: c.surface.subtle }}
          onClick={onBack}
          whileTap={{ scale: 0.9 }}
        >
          <ArrowLeft className="w-4 h-4" style={{ color: c.icon.secondary }} />
        </motion.button>
        <span style={{ ...RT.body, fontWeight: 600, color: c.text.primary }}>
          Help & Support
        </span>
      </div>

      <div className="flex-1 overflow-y-auto px-5 pb-24 scrollbar-hide">
        {/* FAQ section */}
        <span className="block mt-4 mb-3" style={{ ...RT.label, color: c.text.faint }}>
          Frequently asked
        </span>

        <div className="space-y-2 mb-6">
          {FAQS.map((faq, i) => {
            const isOpen = expanded === faq.id;
            return (
              <motion.div
                key={faq.id}
                className="rounded-2xl overflow-hidden"
                style={{
                  background: c.surface.subtle,
                  border: isOpen
                    ? `1px solid ${d ? "rgba(29,185,84,0.1)" : "rgba(29,185,84,0.06)"}`
                    : "1px solid transparent",
                }}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * MOTION.stagger }}
              >
                <motion.button
                  className="w-full flex items-center gap-3 px-4 py-3.5 text-left"
                  onClick={() => toggle(faq.id)}
                  whileTap={{ scale: 0.98 }}
                >
                  <faq.icon
                    className="w-[16px] h-[16px] shrink-0"
                    style={{ color: isOpen ? BRAND_COLORS.green : c.icon.muted }}
                  />
                  <span
                    className="flex-1"
                    style={{
                      ...RT.bodySmall,
                      color: c.text.primary,
                    }}
                  >
                    {faq.question}
                  </span>
                  <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronDown className="w-4 h-4 shrink-0" style={{ color: c.icon.muted }} />
                  </motion.div>
                </motion.button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                      className="overflow-hidden"
                    >
                      <div
                        className="px-4 pb-4 pt-0"
                        style={{ paddingLeft: "44px" }}
                      >
                        <p style={{
                          ...RT.metaSmall,
                          color: c.text.muted,
                          lineHeight: "1.6",
                        }}>
                          {faq.answer}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

        {/* Contact options */}
        <span className="block mb-3" style={{ ...RT.label, color: c.text.faint }}>
          Contact us
        </span>
        <div className="rounded-2xl overflow-hidden" style={{ background: c.surface.subtle }}>
          {[
            { key: "chat", icon: MessageCircle, label: "Live chat", desc: "Usually replies in 2 min", badge: "Online" },
            { key: "email", icon: Mail, label: "Email support", desc: "support@jetride.ng", badge: null },
            { key: "phone", icon: Phone, label: "Call us", desc: "+234 1 234 5678", badge: null },
          ].map((opt, i) => (
            <motion.button
              key={opt.key}
              className="w-full flex items-center gap-3 px-4 py-3.5 text-left"
              style={{
                borderBottom: i < 2 ? `1px solid ${c.surface.hover}` : "none",
              }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleContact(opt.key)}
            >
              <opt.icon className="w-[18px] h-[18px] shrink-0" style={{ color: c.icon.secondary }} />
              <div className="flex-1">
                <span style={{ ...RT.bodySmall, color: c.text.primary }}>{opt.label}</span>
                <div style={{ ...RT.meta, color: c.text.muted }}>{opt.desc}</div>
              </div>
              {opt.badge && (
                <span
                  className="px-2 py-0.5 rounded-md"
                  style={{
                    ...RT.badge,
                    fontWeight: 600,
                    color: BRAND_COLORS.green,
                    background: d ? "rgba(29,185,84,0.12)" : "rgba(29,185,84,0.06)",
                  }}
                >
                  {opt.badge}
                </span>
              )}
            </motion.button>
          ))}
        </div>

        {/* Legal links (quiet) */}
        <div className="flex items-center justify-center gap-4 mt-6 mb-4">
          {["Terms of Service", "Privacy Policy"].map((text) => (
            <button
              key={text}
              onClick={() => showToast({ message: `Opening ${text}...`, variant: "info", duration: 1500 })}
            >
              <span style={{ ...RT.meta, color: c.text.faint }}>{text}</span>
            </button>
          ))}
        </div>

        {/* App version */}
        <div className="text-center mb-4">
          <span style={{ ...RT.metaSmall, color: c.text.ghost }}>
            JET v2.4.1 (Build 1842)
          </span>
        </div>
      </div>
    </div>
  );
}