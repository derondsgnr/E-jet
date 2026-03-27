/**
 * JET ADMIN — CONTACT DRAWER
 *
 * SIDE DRAWER (low-friction) — Admin composes message to rider or driver.
 * Background dispute context stays visible.
 *
 * Features:
 * - Template picker (Nigerian-context templates)
 * - SMS fallback toggle (critical for Nigeria — 40% push failure rate)
 * - Character count (SMS limit awareness)
 * - Delivery channel indicators
 *
 * Pattern: Linear sidebar, Airbnb host messaging
 */

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Send,
  MessageSquare,
  Phone,
  Smartphone,
  ToggleLeft,
  ToggleRight,
  ChevronDown,
} from "lucide-react";
import {
  useAdminTheme,
  TY,
  BRAND,
  STATUS,
} from "../../../config/admin-theme";
import { AdminDrawer } from "../ui/surfaces";
import { type Dispute } from "../../../config/dispute-mock-data";

type ContactTarget = "rider" | "driver" | "hotel";

interface ContactDrawerProps {
  open: boolean;
  onClose: () => void;
  dispute: Dispute;
  target: ContactTarget;
  onSend: (data: ContactMessageData) => void;
}

export interface ContactMessageData {
  target: ContactTarget;
  message: string;
  template: string | null;
  channels: ("push" | "sms" | "email")[];
}

/* ─── Nigerian-context message templates ─── */
const TEMPLATES: Record<
  string,
  { id: string; label: string; body: string }[]
> = {
  rider: [
    {
      id: "evidence_request",
      label: "Request additional evidence",
      body: "Hi {firstName}, we're reviewing your dispute ({disputeId}). Could you share any additional details or screenshots? This helps us resolve things faster. You can reply here or upload directly in the JET app.",
    },
    {
      id: "status_update",
      label: "Share a status update",
      body: "Hi {firstName}, your dispute ({disputeId}) is under review. We're looking at all available evidence and expect to have an update within {slaHours} hours. Thank you for your patience.",
    },
    {
      id: "clarification",
      label: "Ask for clarification",
      body: "Hi {firstName}, we need to clarify a few details about your dispute ({disputeId}). Could you confirm: [Add question here]. This will help us reach a fair resolution.",
    },
    {
      id: "follow_up",
      label: "Follow up after resolution",
      body: "Hi {firstName}, we've resolved dispute {disputeId}. If you have any remaining concerns, we're here to help. Your experience matters to us.",
    },
  ],
  driver: [
    {
      id: "evidence_request",
      label: "Request driver's account",
      body: "Hi {firstName}, a dispute ({disputeId}) was filed about a recent trip. Could you share your side of what happened? You can reply here or respond through the JET Driver app.",
    },
    {
      id: "dashcam_request",
      label: "Request dashcam footage",
      body: "Hi {firstName}, we're investigating dispute {disputeId}. If you have any dashcam footage from this trip, please upload it through the JET Driver app within 24 hours.",
    },
    {
      id: "resolution_notice",
      label: "Resolution notice",
      body: "Hi {firstName}, dispute {disputeId} has been reviewed and resolved. A note has been added to the trip record. You can view the details in your JET Driver app. If you have questions, reach out to driver support.",
    },
    {
      id: "general_followup",
      label: "General follow-up",
      body: "Hi {firstName}, we're following up regarding dispute {disputeId}. If you have any additional information that might help, please share it with us. We want to make sure we have the full picture.",
    },
  ],
  hotel: [
    {
      id: "acknowledge_complaint",
      label: "Acknowledge hotel complaint",
      body: "Dear {firstName}, we've received your complaint ({disputeId}) regarding the recent guest transport incident. We take hotel partner feedback seriously and are investigating. We'll update you within {slaHours} hours.",
    },
    {
      id: "request_details",
      label: "Request additional details",
      body: "Dear {firstName}, could you share any additional details about dispute {disputeId}? Guest statements, concierge observations, or any documentation would help us resolve this quickly.",
    },
    {
      id: "resolution_update",
      label: "Resolution update",
      body: "Dear {firstName}, dispute {disputeId} has been resolved. We've taken appropriate action to ensure this doesn't affect your guests' experience going forward. Thank you for flagging this.",
    },
    {
      id: "compensation_notice",
      label: "Compensation notice",
      body: "Dear {firstName}, as part of resolving dispute {disputeId}, we've applied a credit to your hotel account and extended a courtesy credit to the affected guest. We value your partnership.",
    },
  ],
};

const SMS_CHAR_LIMIT = 160; // Standard SMS limit
const SMS_CONCAT_LIMIT = 306; // 2-part SMS

export function ContactDrawer({
  open,
  onClose,
  dispute,
  target,
  onSend,
}: ContactDrawerProps) {
  const { t } = useAdminTheme();
  const party = target === "hotel" && dispute.hotel
    ? { name: dispute.hotel.contactPerson.split(" (")[0] || dispute.hotel.name, phone: dispute.hotel.phone, rating: 0, totalTrips: dispute.hotel.totalBookings, avatar: dispute.hotel.avatar, joinDate: "", disputeHistory: dispute.hotel.disputeHistory }
    : target === "rider" ? dispute.rider : dispute.driver;
  const templates = TEMPLATES[target] || TEMPLATES["rider"];

  const [message, setMessage] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState<
    string | null
  >(null);
  const [smsEnabled, setSmsEnabled] = useState(true); // Default ON for Nigeria
  const [emailEnabled, setEmailEnabled] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const charCount = message.length;
  const smsSegments =
    charCount <= SMS_CHAR_LIMIT
      ? 1
      : Math.ceil(charCount / 153); // Concatenated SMS uses 153 chars per segment

  const fillTemplate = (templateId: string) => {
    const tpl = templates.find((t) => t.id === templateId);
    if (!tpl) return;

    const filled = tpl.body
      .replace("{firstName}", party.name.split(" ")[0])
      .replace("{disputeId}", dispute.id)
      .replace(
        "{slaHours}",
        String(Math.max(dispute.slaHoursLeft, 4)),
      );

    setMessage(filled);
    setSelectedTemplate(templateId);
    setShowTemplates(false);
  };

  const handleSend = () => {
    if (!message.trim()) return;
    setIsSending(true);
    setTimeout(() => {
      const channels: ("push" | "sms" | "email")[] = ["push"];
      if (smsEnabled) channels.push("sms");
      if (emailEnabled) channels.push("email");
      onSend({
        target,
        message,
        template: selectedTemplate,
        channels,
      });
      setIsSending(false);
      setMessage("");
      setSelectedTemplate(null);
      onClose();
    }, 800);
  };

  return (
    <AdminDrawer
      open={open}
      onClose={onClose}
      width={440}
      title={`Contact ${target === "rider" ? "Rider" : target === "hotel" ? "Hotel Partner" : "Driver"}`}
      subtitle={`${party.name} · ${dispute.id}`}
    >
      <div className="flex flex-col h-full">
        {/* Party info strip */}
        <div
          className="flex items-center gap-3 px-5 py-3 shrink-0"
          style={{
            borderBottom: `1px solid ${t.borderSubtle}`,
          }}
        >
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
            style={{
              background: `${target === "rider" ? STATUS.info : BRAND.green}12`,
            }}
          >
            <span
              style={{
                ...TY.cap,
                fontSize: "10px",
                color:
                  target === "rider"
                    ? STATUS.info
                    : BRAND.green,
              }}
            >
              {party.avatar}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <span
              className="block"
              style={{
                ...TY.body,
                fontSize: "12px",
                color: t.text,
              }}
            >
              {party.name}
            </span>
            <span
              style={{
                ...TY.bodyR,
                fontSize: "10px",
                color: t.textMuted,
              }}
            >
              {party.phone}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Phone size={11} style={{ color: t.iconMuted }} />
            <span
              style={{
                ...TY.cap,
                fontSize: "9px",
                color: t.textFaint,
              }}
            >
              Call
            </span>
          </div>
        </div>

        {/* Delivery channels */}
        <div
          className="px-5 py-3 shrink-0"
          style={{
            borderBottom: `1px solid ${t.borderSubtle}`,
          }}
        >
          <span
            className="block mb-2"
            style={{
              ...TY.label,
              fontSize: "8px",
              color: t.textFaint,
            }}
          >
            DELIVERY CHANNELS
          </span>
          <div className="flex gap-3">
            {/* Push — always on */}
            <div className="flex items-center gap-2">
              <Smartphone
                size={12}
                style={{ color: BRAND.green }}
              />
              <span
                style={{
                  ...TY.body,
                  fontSize: "11px",
                  color: t.textSecondary,
                }}
              >
                Push
              </span>
              <span
                className="px-1.5 py-0.5 rounded"
                style={{
                  ...TY.cap,
                  fontSize: "8px",
                  color: BRAND.green,
                  background: `${BRAND.green}12`,
                }}
              >
                Always
              </span>
            </div>

            {/* SMS toggle */}
            <button
              className="flex items-center gap-2"
              onClick={() => setSmsEnabled(!smsEnabled)}
            >
              <MessageSquare
                size={12}
                style={{
                  color: smsEnabled ? BRAND.green : t.iconMuted,
                }}
              />
              <span
                style={{
                  ...TY.body,
                  fontSize: "11px",
                  color: smsEnabled
                    ? t.textSecondary
                    : t.textMuted,
                }}
              >
                SMS
              </span>
              {smsEnabled ? (
                <ToggleRight
                  size={16}
                  style={{ color: BRAND.green }}
                />
              ) : (
                <ToggleLeft
                  size={16}
                  style={{ color: t.iconMuted }}
                />
              )}
            </button>

            {/* Email toggle */}
            <button
              className="flex items-center gap-2"
              onClick={() => setEmailEnabled(!emailEnabled)}
            >
              <Send
                size={12}
                style={{
                  color: emailEnabled
                    ? BRAND.green
                    : t.iconMuted,
                }}
              />
              <span
                style={{
                  ...TY.body,
                  fontSize: "11px",
                  color: emailEnabled
                    ? t.textSecondary
                    : t.textMuted,
                }}
              >
                Email
              </span>
              {emailEnabled ? (
                <ToggleRight
                  size={16}
                  style={{ color: BRAND.green }}
                />
              ) : (
                <ToggleLeft
                  size={16}
                  style={{ color: t.iconMuted }}
                />
              )}
            </button>
          </div>

          {smsEnabled && (
            <motion.div
              className="mt-2 px-2 py-1.5 rounded-lg"
              style={{
                background: `${STATUS.warning}06`,
                border: `1px solid ${STATUS.warning}10`,
              }}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
            >
              <span
                style={{
                  ...TY.bodyR,
                  fontSize: "10px",
                  color: STATUS.warning,
                }}
              >
                SMS fallback via Termii. Cost: ₦4/SMS.{" "}
                {charCount > SMS_CHAR_LIMIT && (
                  <span style={{ color: STATUS.error }}>
                    Message exceeds 160 chars — will send as{" "}
                    {smsSegments} SMS segments (₦
                    {smsSegments * 4}).
                  </span>
                )}
              </span>
            </motion.div>
          )}
        </div>

        {/* Template picker */}
        <div className="px-5 py-3 shrink-0">
          <button
            className="w-full flex items-center justify-between h-9 px-3 rounded-lg transition-colors"
            style={{
              background: t.surface,
              border: `1px solid ${t.borderSubtle}`,
            }}
            onClick={() => setShowTemplates(!showTemplates)}
          >
            <span
              style={{
                ...TY.body,
                fontSize: "11px",
                color: t.textSecondary,
              }}
            >
              {selectedTemplate
                ? templates.find(
                    (t) => t.id === selectedTemplate,
                  )?.label
                : "Choose a template..."}
            </span>
            <ChevronDown
              size={12}
              style={{
                color: t.iconMuted,
                transform: showTemplates
                  ? "rotate(180deg)"
                  : "none",
                transition: "transform 0.15s",
              }}
            />
          </button>

          <AnimatePresence>
            {showTemplates && (
              <motion.div
                className="mt-2 rounded-xl overflow-hidden"
                style={{
                  background: t.surface,
                  border: `1px solid ${t.borderSubtle}`,
                }}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
              >
                {templates.map((tpl, i) => (
                  <button
                    key={tpl.id}
                    className="w-full text-left px-3 py-2.5 transition-colors"
                    style={{
                      borderBottom:
                        i < templates.length - 1
                          ? `1px solid ${t.borderSubtle}`
                          : "none",
                      background:
                        selectedTemplate === tpl.id
                          ? t.surfaceActive
                          : "transparent",
                    }}
                    onClick={() => fillTemplate(tpl.id)}
                    onMouseEnter={(e) => {
                      if (selectedTemplate !== tpl.id)
                        e.currentTarget.style.background =
                          t.surfaceHover;
                    }}
                    onMouseLeave={(e) => {
                      if (selectedTemplate !== tpl.id)
                        e.currentTarget.style.background =
                          "transparent";
                    }}
                  >
                    <span
                      style={{
                        ...TY.body,
                        fontSize: "11px",
                        color: t.text,
                      }}
                    >
                      {tpl.label}
                    </span>
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Message composer */}
        <div className="flex-1 px-5 pb-3">
          <textarea
            className="w-full h-full rounded-xl p-3 resize-none outline-none"
            style={{
              background: t.surface,
              border: `1px solid ${t.borderSubtle}`,
              color: t.text,
              ...TY.bodyR,
              fontSize: "12px",
              minHeight: 140,
            }}
            placeholder={`Write a message to ${party.name.split(" ")[0]}...`}
            value={message}
            onChange={(e) => {
              setMessage(e.target.value);
              if (selectedTemplate) setSelectedTemplate(null);
            }}
          />
        </div>

        {/* Footer */}
        <div
          className="flex items-center justify-between px-5 shrink-0"
          style={{
            height: 56,
            borderTop: `1px solid ${t.borderSubtle}`,
          }}
        >
          <div className="flex items-center gap-3">
            <span
              style={{
                ...TY.cap,
                fontSize: "10px",
                color:
                  charCount > SMS_CONCAT_LIMIT && smsEnabled
                    ? STATUS.error
                    : t.textFaint,
              }}
            >
              {charCount} chars
            </span>
            {smsEnabled && charCount > 0 && (
              <span
                style={{
                  ...TY.cap,
                  fontSize: "10px",
                  color: t.textFaint,
                }}
              >
                · {smsSegments} SMS
              </span>
            )}
          </div>

          <button
            className="h-10 px-5 rounded-xl flex items-center gap-2 transition-opacity"
            style={{
              background: BRAND.green,
              opacity: !message.trim() || isSending ? 0.5 : 1,
              cursor:
                !message.trim() || isSending
                  ? "not-allowed"
                  : "pointer",
              minHeight: 44,
            }}
            onClick={handleSend}
            disabled={!message.trim() || isSending}
          >
            {isSending ? (
              <div className="w-3.5 h-3.5 rounded-full border-2 border-white border-t-transparent animate-spin" />
            ) : (
              <Send size={13} style={{ color: "#FFFFFF" }} />
            )}
            <span
              style={{
                ...TY.body,
                fontSize: "12px",
                color: "#FFFFFF",
              }}
            >
              {isSending ? "Sending..." : "Send"}
            </span>
          </button>
        </div>
      </div>
    </AdminDrawer>
  );
}