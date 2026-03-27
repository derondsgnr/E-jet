/**
 * Driver Settings Sub-Screens — Notifications, Safety, Help, Language.
 *
 * Mirrors rider settings pattern but driver-contextual.
 * DRIVER_TYPE enforced — nothing below 13px.
 * C spine: GlassPanel cards, MapCanvas, ambient glows.
 */

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ArrowLeft, Bell, BellOff, Volume2, VolumeX,
  Shield, UserPlus, Trash2, Phone, Share2,
  AlertTriangle, X, Check, ChevronDown,
  HelpCircle, MessageCircle, Mail,
  CreditCard, Car, Navigation, Globe,
  FileText, Zap, MapPin,
} from "lucide-react";
import {
  GLASS_COLORS,
  MOTION,
  type GlassColorMode,
} from "../../config/project";
import { BRAND_COLORS } from "../../config/brand";
import { DRIVER_TYPE as DT } from "../../config/driver-type";
import { GlassPanel } from "../rider/glass-panel";

// ═══════════════════════════════════════════════════════════════════════════════
// Toggle row (reusable)
// ═══════════════════════════════════════════════════════════════════════════════
function ToggleRow({
  label,
  description,
  enabled,
  onToggle,
  colorMode,
}: {
  label: string;
  description?: string;
  enabled: boolean;
  onToggle: () => void;
  colorMode: GlassColorMode;
}) {
  const c = GLASS_COLORS[colorMode];
  const d = colorMode === "dark";

  return (
    <button
      className="w-full flex items-center justify-between px-4 py-3.5"
      onClick={onToggle}
    >
      <div className="flex-1 text-left">
        <span style={{ ...DT.label, color: c.text.primary }}>{label}</span>
        {description && (
          <div style={{ ...DT.meta, color: c.text.muted, marginTop: "1px" }}>
            {description}
          </div>
        )}
      </div>
      <div
        className="relative w-11 h-6 rounded-full shrink-0 transition-colors"
        style={{
          background: enabled
            ? BRAND_COLORS.green
            : d ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.1)",
        }}
      >
        <motion.div
          className="absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm"
          animate={{ left: enabled ? 22 : 2 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        />
      </div>
    </button>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// NOTIFICATIONS SETTINGS
// ═══════════════════════════════════════════════════════════════════════════════
export function DriverNotificationsSettings({
  colorMode,
  onBack,
}: {
  colorMode: GlassColorMode;
  onBack: () => void;
}) {
  const c = GLASS_COLORS[colorMode];
  const d = colorMode === "dark";
  const [tripAlerts, setTripAlerts] = useState(true);
  const [earningsUpdates, setEarningsUpdates] = useState(true);
  const [promoAlerts, setPromoAlerts] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [vibration, setVibration] = useState(true);
  const [quietHours, setQuietHours] = useState(false);

  return (
    <div className="h-full flex flex-col" style={{ background: c.bg }}>
      {/* Header */}
      <div
        className="flex items-center gap-3 px-5 shrink-0"
        style={{ paddingTop: "calc(env(safe-area-inset-top, 12px) + 16px)", paddingBottom: "12px" }}
      >
        <motion.button
          className="w-9 h-9 rounded-xl flex items-center justify-center"
          style={{ background: c.surface.subtle }}
          onClick={onBack}
          whileTap={{ scale: 0.9 }}
        >
          <ArrowLeft className="w-4 h-4" style={{ color: c.icon.secondary }} />
        </motion.button>
        <span style={{ ...DT.heading, color: c.text.primary }}>Notifications</span>
      </div>

      <div className="flex-1 overflow-y-auto px-5 pb-24 scrollbar-hide">
        {/* Trip alerts */}
        <div className="mb-5">
          <span className="block mb-3" style={{ ...DT.label, color: c.text.faint, letterSpacing: "0.04em", textTransform: "uppercase" }}>
            Trip Alerts
          </span>
          <GlassPanel variant={d ? "dark" : "light"} blur={20} className="rounded-2xl overflow-hidden">
            <ToggleRow
              label="New trip requests"
              description="Get notified when a rider is nearby"
              enabled={tripAlerts}
              onToggle={() => setTripAlerts(!tripAlerts)}
              colorMode={colorMode}
            />
            <div style={{ borderBottom: `1px solid ${c.surface.hover}` }} />
            <ToggleRow
              label="Earnings updates"
              description="Daily and weekly summaries"
              enabled={earningsUpdates}
              onToggle={() => setEarningsUpdates(!earningsUpdates)}
              colorMode={colorMode}
            />
            <div style={{ borderBottom: `1px solid ${c.surface.hover}` }} />
            <ToggleRow
              label="Promotions & bonuses"
              description="Surge zones, streak bonuses"
              enabled={promoAlerts}
              onToggle={() => setPromoAlerts(!promoAlerts)}
              colorMode={colorMode}
            />
          </GlassPanel>
        </div>

        {/* Sound & haptics */}
        <div className="mb-5">
          <span className="block mb-3" style={{ ...DT.label, color: c.text.faint, letterSpacing: "0.04em", textTransform: "uppercase" }}>
            Sound & Haptics
          </span>
          <GlassPanel variant={d ? "dark" : "light"} blur={20} className="rounded-2xl overflow-hidden">
            <ToggleRow
              label="Sound"
              description="Play audio for new requests"
              enabled={soundEnabled}
              onToggle={() => setSoundEnabled(!soundEnabled)}
              colorMode={colorMode}
            />
            <div style={{ borderBottom: `1px solid ${c.surface.hover}` }} />
            <ToggleRow
              label="Vibration"
              description="Haptic feedback for alerts"
              enabled={vibration}
              onToggle={() => setVibration(!vibration)}
              colorMode={colorMode}
            />
            <div style={{ borderBottom: `1px solid ${c.surface.hover}` }} />
            <ToggleRow
              label="Quiet hours"
              description="Mute all alerts 10pm – 6am"
              enabled={quietHours}
              onToggle={() => setQuietHours(!quietHours)}
              colorMode={colorMode}
            />
          </GlassPanel>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SAFETY SETTINGS
// ═══════════════════════════════════════════════════════════════════════════════
interface EmergencyContact {
  id: string;
  name: string;
  phone: string;
  initials: string;
}

const INITIAL_CONTACTS: EmergencyContact[] = [
  { id: "ec-1", name: "Ngozi A.", phone: "+234 803 ••• 1234", initials: "NA" },
  { id: "ec-2", name: "Emeka O.", phone: "+234 812 ••• 5678", initials: "EO" },
];

export function DriverSafetySettings({
  colorMode,
  onBack,
}: {
  colorMode: GlassColorMode;
  onBack: () => void;
}) {
  const c = GLASS_COLORS[colorMode];
  const d = colorMode === "dark";
  const [contacts, setContacts] = useState<EmergencyContact[]>(INITIAL_CONTACTS);
  const [autoShare, setAutoShare] = useState(true);
  const [dashcamReminder, setDashcamReminder] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newName, setNewName] = useState("");
  const [newPhone, setNewPhone] = useState("");

  const handleAdd = () => {
    if (!newName.trim() || !newPhone.trim()) return;
    const initials = newName.trim().split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
    setContacts(prev => [...prev, {
      id: `ec-${Date.now()}`,
      name: newName.trim(),
      phone: newPhone.trim(),
      initials,
    }]);
    setNewName("");
    setNewPhone("");
    setShowAddModal(false);
  };

  const handleRemove = (id: string) => {
    setContacts(prev => prev.filter(c => c.id !== id));
  };

  return (
    <div className="h-full flex flex-col" style={{ background: c.bg }}>
      <div
        className="flex items-center gap-3 px-5 shrink-0"
        style={{ paddingTop: "calc(env(safe-area-inset-top, 12px) + 16px)", paddingBottom: "12px" }}
      >
        <motion.button
          className="w-9 h-9 rounded-xl flex items-center justify-center"
          style={{ background: c.surface.subtle }}
          onClick={onBack}
          whileTap={{ scale: 0.9 }}
        >
          <ArrowLeft className="w-4 h-4" style={{ color: c.icon.secondary }} />
        </motion.button>
        <span style={{ ...DT.heading, color: c.text.primary }}>Safety</span>
      </div>

      <div className="flex-1 overflow-y-auto px-5 pb-24 scrollbar-hide">
        {/* Emergency contacts */}
        <div className="mb-5">
          <div className="flex items-center justify-between mb-3">
            <span style={{ ...DT.label, color: c.text.faint, letterSpacing: "0.04em", textTransform: "uppercase" }}>
              Emergency Contacts
            </span>
            <motion.button
              className="flex items-center gap-1 px-2 py-1 rounded-lg"
              style={{ background: c.surface.subtle }}
              onClick={() => setShowAddModal(true)}
              whileTap={{ scale: 0.95 }}
            >
              <UserPlus className="w-3 h-3" style={{ color: BRAND_COLORS.green }} />
              <span style={{ ...DT.meta, color: BRAND_COLORS.green }}>Add</span>
            </motion.button>
          </div>
          <GlassPanel variant={d ? "dark" : "light"} blur={20} className="rounded-2xl overflow-hidden">
            {contacts.length === 0 ? (
              <div className="px-4 py-8 text-center">
                <Shield className="w-6 h-6 mx-auto mb-2" style={{ color: c.text.ghost }} />
                <span style={{ ...DT.meta, color: c.text.muted }}>
                  No emergency contacts added
                </span>
              </div>
            ) : (
              contacts.map((contact, i) => (
                <div
                  key={contact.id}
                  className="flex items-center gap-3 px-4 py-3.5"
                  style={{
                    borderBottom: i < contacts.length - 1 ? `1px solid ${c.surface.hover}` : "none",
                  }}
                >
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
                    style={{ background: c.green.tint }}
                  >
                    <span style={{ ...DT.meta, fontWeight: 600, color: BRAND_COLORS.green }}>
                      {contact.initials}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0 text-left">
                    <span style={{ ...DT.label, color: c.text.primary }}>{contact.name}</span>
                    <div style={{ ...DT.meta, color: c.text.muted, marginTop: "1px" }}>
                      {contact.phone}
                    </div>
                  </div>
                  <motion.button
                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ background: c.surface.subtle }}
                    onClick={() => handleRemove(contact.id)}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Trash2 className="w-3.5 h-3.5" style={{ color: BRAND_COLORS.error }} />
                  </motion.button>
                </div>
              ))
            )}
          </GlassPanel>
        </div>

        {/* Trip sharing */}
        <div className="mb-5">
          <span className="block mb-3" style={{ ...DT.label, color: c.text.faint, letterSpacing: "0.04em", textTransform: "uppercase" }}>
            Trip Sharing
          </span>
          <GlassPanel variant={d ? "dark" : "light"} blur={20} className="rounded-2xl overflow-hidden">
            <ToggleRow
              label="Auto-share active trips"
              description="Share live trip status with contacts"
              enabled={autoShare}
              onToggle={() => setAutoShare(!autoShare)}
              colorMode={colorMode}
            />
            <div style={{ borderBottom: `1px solid ${c.surface.hover}` }} />
            <ToggleRow
              label="Dashcam reminder"
              description="Prompt to start recording before trips"
              enabled={dashcamReminder}
              onToggle={() => setDashcamReminder(!dashcamReminder)}
              colorMode={colorMode}
            />
          </GlassPanel>
        </div>

        {/* SOS */}
        <div className="mb-5">
          <span className="block mb-3" style={{ ...DT.label, color: c.text.faint, letterSpacing: "0.04em", textTransform: "uppercase" }}>
            Emergency
          </span>
          <GlassPanel variant={d ? "dark" : "light"} blur={20} className="rounded-2xl overflow-hidden">
            <div className="px-4 py-4">
              <div className="flex items-center gap-3 mb-3">
                <AlertTriangle className="w-5 h-5 shrink-0" style={{ color: BRAND_COLORS.error }} />
                <span style={{ ...DT.label, color: c.text.primary }}>
                  Emergency SOS
                </span>
              </div>
              <p style={{ ...DT.meta, color: c.text.muted, lineHeight: "1.5" }}>
                During an active trip, press and hold the power button 5 times rapidly
                to trigger emergency SOS. This will alert your emergency contacts and
                local authorities (112).
              </p>
            </div>
          </GlassPanel>
        </div>
      </div>

      {/* Add contact modal */}
      <AnimatePresence>
        {showAddModal && (
          <div className="absolute inset-0 z-50 flex items-end">
            <motion.div
              className="absolute inset-0"
              style={{ background: d ? "rgba(0,0,0,0.6)" : "rgba(0,0,0,0.25)" }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAddModal(false)}
            />
            <motion.div
              className="relative z-10 w-full px-5 pb-8"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 350, damping: 30 }}
            >
              <GlassPanel variant={d ? "dark" : "light"} blur={24} className="rounded-2xl px-5 py-5">
                <div className="flex items-center justify-between mb-4">
                  <span style={{ ...DT.heading, color: c.text.primary }}>Add contact</span>
                  <motion.button
                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ background: c.surface.subtle }}
                    onClick={() => setShowAddModal(false)}
                    whileTap={{ scale: 0.9 }}
                  >
                    <X className="w-4 h-4" style={{ color: c.icon.secondary }} />
                  </motion.button>
                </div>
                <input
                  className="w-full rounded-xl px-4 py-3 mb-3 outline-none"
                  placeholder="Full name"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  style={{
                    ...DT.secondary,
                    color: c.text.primary,
                    background: c.surface.subtle,
                    border: `1px solid ${c.surface.hover}`,
                  }}
                />
                <input
                  className="w-full rounded-xl px-4 py-3 mb-4 outline-none"
                  placeholder="Phone number"
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                  style={{
                    ...DT.secondary,
                    color: c.text.primary,
                    background: c.surface.subtle,
                    border: `1px solid ${c.surface.hover}`,
                  }}
                />
                <motion.button
                  className="w-full py-3 rounded-xl flex items-center justify-center gap-2"
                  style={{
                    background: BRAND_COLORS.green,
                    opacity: newName.trim() && newPhone.trim() ? 1 : 0.4,
                  }}
                  onClick={handleAdd}
                  whileTap={{ scale: 0.97 }}
                  disabled={!newName.trim() || !newPhone.trim()}
                >
                  <Check className="w-4 h-4" style={{ color: "#fff" }} />
                  <span style={{ ...DT.cta, color: "#fff" }}>Save contact</span>
                </motion.button>
              </GlassPanel>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// HELP & SUPPORT
// ═══════════════════════════════════════════════════════════════════════════════
interface FAQ {
  id: string;
  icon: typeof HelpCircle;
  question: string;
  answer: string;
}

const DRIVER_FAQS: FAQ[] = [
  {
    id: "faq-1", icon: CreditCard,
    question: "When do I get paid?",
    answer: "Earnings are deposited to your linked bank account every Monday by 9am. You can also request instant cashout (₦100 fee) from the Earnings screen at any time.",
  },
  {
    id: "faq-2", icon: Car,
    question: "How does surge pricing work?",
    answer: "Surge multipliers (1.5x, 2x, etc.) are applied during high-demand periods. You'll see the surge indicator on your trip request. The full surge amount goes to you — JET doesn't take a cut of the surge.",
  },
  {
    id: "faq-3", icon: Shield,
    question: "What happens if a rider cancels?",
    answer: "If a rider cancels after you've waited 5+ minutes, you receive a ₦200 cancellation fee. If you cancel, it affects your acceptance rate. Three consecutive cancels trigger a 10-minute cooldown.",
  },
  {
    id: "faq-4", icon: Zap,
    question: "How do I switch to an EV?",
    answer: "Contact our fleet team to register your electric vehicle. EV drivers get priority matching for eco-conscious riders and a 5% commission reduction on all EV trips.",
  },
  {
    id: "faq-5", icon: Navigation,
    question: "Can I choose my pickup area?",
    answer: "You can set a preferred zone in Settings, but trip requests come from your current GPS location. Working in high-demand areas (orange/red on the heat map) increases your trip frequency.",
  },
];

export function DriverHelpSettings({
  colorMode,
  onBack,
}: {
  colorMode: GlassColorMode;
  onBack: () => void;
}) {
  const c = GLASS_COLORS[colorMode];
  const d = colorMode === "dark";
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null);

  return (
    <div className="h-full flex flex-col" style={{ background: c.bg }}>
      <div
        className="flex items-center gap-3 px-5 shrink-0"
        style={{ paddingTop: "calc(env(safe-area-inset-top, 12px) + 16px)", paddingBottom: "12px" }}
      >
        <motion.button
          className="w-9 h-9 rounded-xl flex items-center justify-center"
          style={{ background: c.surface.subtle }}
          onClick={onBack}
          whileTap={{ scale: 0.9 }}
        >
          <ArrowLeft className="w-4 h-4" style={{ color: c.icon.secondary }} />
        </motion.button>
        <span style={{ ...DT.heading, color: c.text.primary }}>Help & Support</span>
      </div>

      <div className="flex-1 overflow-y-auto px-5 pb-24 scrollbar-hide">
        {/* FAQs */}
        <div className="mb-6">
          <span className="block mb-3" style={{ ...DT.label, color: c.text.faint, letterSpacing: "0.04em", textTransform: "uppercase" }}>
            Frequently Asked
          </span>
          <GlassPanel variant={d ? "dark" : "light"} blur={20} className="rounded-2xl overflow-hidden">
            {DRIVER_FAQS.map((faq, i) => {
              const isOpen = expandedFaq === faq.id;
              return (
                <motion.div key={faq.id}>
                  <button
                    className="w-full px-4 py-3.5 flex items-center gap-3 text-left"
                    style={{
                      borderBottom: !isOpen && i < DRIVER_FAQS.length - 1
                        ? `1px solid ${c.surface.hover}` : "none",
                    }}
                    onClick={() => setExpandedFaq(isOpen ? null : faq.id)}
                  >
                    <faq.icon className="w-4 h-4 shrink-0" style={{ color: c.icon.secondary }} />
                    <span className="flex-1" style={{ ...DT.label, color: c.text.primary }}>
                      {faq.question}
                    </span>
                    <ChevronDown
                      className="w-4 h-4 shrink-0 transition-transform"
                      style={{
                        color: c.icon.muted,
                        transform: isOpen ? "rotate(180deg)" : "none",
                      }}
                    />
                  </button>
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div
                          className="px-4 pb-4 pt-1"
                          style={{
                            borderBottom: i < DRIVER_FAQS.length - 1
                              ? `1px solid ${c.surface.hover}` : "none",
                          }}
                        >
                          <p style={{ ...DT.meta, color: c.text.muted, lineHeight: "1.6" }}>
                            {faq.answer}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </GlassPanel>
        </div>

        {/* Contact */}
        <div className="mb-5">
          <span className="block mb-3" style={{ ...DT.label, color: c.text.faint, letterSpacing: "0.04em", textTransform: "uppercase" }}>
            Contact Us
          </span>
          <GlassPanel variant={d ? "dark" : "light"} blur={20} className="rounded-2xl overflow-hidden">
            {[
              { icon: MessageCircle, label: "Live chat", sub: "Avg. response: 2 min", color: BRAND_COLORS.green },
              { icon: Mail, label: "Email support", sub: "drivers@jetapp.ng", color: c.icon.secondary },
              { icon: Phone, label: "Phone support", sub: "0800-JET-HELP (24/7)", color: c.icon.secondary },
            ].map(({ icon: Icon, label, sub, color }, i) => (
              <motion.button
                key={label}
                className="w-full px-4 py-3.5 flex items-center gap-3"
                style={{
                  borderBottom: i < 2 ? `1px solid ${c.surface.hover}` : "none",
                }}
                whileTap={{ scale: 0.98 }}
              >
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                  style={{ background: c.surface.subtle }}
                >
                  <Icon className="w-4 h-4" style={{ color }} />
                </div>
                <div className="flex-1 min-w-0 text-left">
                  <span style={{ ...DT.label, color: c.text.primary }}>{label}</span>
                  <div style={{ ...DT.meta, color: c.text.muted, marginTop: "1px" }}>
                    {sub}
                  </div>
                </div>
              </motion.button>
            ))}
          </GlassPanel>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// LANGUAGE SELECTOR
// ═══════════════════════════════════════════════════════════════════════════════
const LANGUAGES = [
  { code: "en", label: "English", native: "English" },
  { code: "yo", label: "Yorùbá", native: "Yorùbá" },
  { code: "ig", label: "Igbo", native: "Igbo" },
  { code: "ha", label: "Hausa", native: "Hausa" },
  { code: "pcm", label: "Pidgin", native: "Naijá" },
  { code: "fr", label: "French", native: "Français" },
];

export function DriverLanguageSettings({
  colorMode,
  onBack,
}: {
  colorMode: GlassColorMode;
  onBack: () => void;
}) {
  const c = GLASS_COLORS[colorMode];
  const d = colorMode === "dark";
  const [selected, setSelected] = useState("en");

  return (
    <div className="h-full flex flex-col" style={{ background: c.bg }}>
      <div
        className="flex items-center gap-3 px-5 shrink-0"
        style={{ paddingTop: "calc(env(safe-area-inset-top, 12px) + 16px)", paddingBottom: "12px" }}
      >
        <motion.button
          className="w-9 h-9 rounded-xl flex items-center justify-center"
          style={{ background: c.surface.subtle }}
          onClick={onBack}
          whileTap={{ scale: 0.9 }}
        >
          <ArrowLeft className="w-4 h-4" style={{ color: c.icon.secondary }} />
        </motion.button>
        <span style={{ ...DT.heading, color: c.text.primary }}>Language</span>
      </div>

      <div className="flex-1 overflow-y-auto px-5 pb-24 scrollbar-hide">
        <GlassPanel variant={d ? "dark" : "light"} blur={20} className="rounded-2xl overflow-hidden">
          {LANGUAGES.map((lang, i) => (
            <motion.button
              key={lang.code}
              className="w-full px-4 py-3.5 flex items-center justify-between"
              style={{
                borderBottom: i < LANGUAGES.length - 1 ? `1px solid ${c.surface.hover}` : "none",
                background: selected === lang.code ? c.surface.subtle : "transparent",
              }}
              onClick={() => setSelected(lang.code)}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center gap-3">
                <Globe className="w-4 h-4" style={{ color: selected === lang.code ? BRAND_COLORS.green : c.icon.muted }} />
                <div className="text-left">
                  <span style={{ ...DT.label, color: c.text.primary }}>{lang.label}</span>
                  {lang.native !== lang.label && (
                    <div style={{ ...DT.meta, color: c.text.muted, marginTop: "1px" }}>{lang.native}</div>
                  )}
                </div>
              </div>
              {selected === lang.code && (
                <Check className="w-4 h-4" style={{ color: BRAND_COLORS.green }} />
              )}
            </motion.button>
          ))}
        </GlassPanel>
      </div>
    </div>
  );
}