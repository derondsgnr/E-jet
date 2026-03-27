 /**
 * Safety Settings — Emergency contacts, SOS, trip sharing.
 *
 * NORTHSTAR: Uber Safety Center + Apple Emergency SOS.
 * Key affordances:
 *   - Add/remove emergency contacts
 *   - Toggle auto-share trip with contacts
 *   - SOS activation instructions (not a button you accidentally tap)
 *   - Trusted contacts get green treatment (saved state)
 */

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ArrowLeft, Shield, UserPlus, Trash2, Phone, Share2,
  AlertTriangle, X, Check,
} from "lucide-react";
import { GLASS_COLORS, GLASS_TYPE, MOTION, type GlassColorMode } from "../../config/project";
import { BRAND_COLORS } from "../../config/brand";
import { RIDER_TYPE as RT } from "../../config/rider-type";
import type { ToastConfig } from "./jet-toast";

interface EmergencyContact {
  id: string;
  name: string;
  phone: string;
  initials: string;
}

const INITIAL_CONTACTS: EmergencyContact[] = [
  { id: "ec-1", name: "Amaka O.", phone: "+234 803 ••• 4521", initials: "AO" },
  { id: "ec-2", name: "Chidi E.", phone: "+234 812 ••• 7893", initials: "CE" },
];

interface Props {
  colorMode: GlassColorMode;
  onBack: () => void;
  showToast: (config: ToastConfig) => void;
}

export function SafetySettings({ colorMode, onBack, showToast }: Props) {
  const c = GLASS_COLORS[colorMode];
  const d = colorMode === "dark";
  const [contacts, setContacts] = useState<EmergencyContact[]>(INITIAL_CONTACTS);
  const [autoShare, setAutoShare] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newName, setNewName] = useState("");
  const [newPhone, setNewPhone] = useState("");

  const handleDeleteContact = (id: string) => {
    const contact = contacts.find((c) => c.id === id);
    setContacts((prev) => prev.filter((c) => c.id !== id));
    setDeleteId(null);
    showToast({
      message: `${contact?.name ?? "Contact"} removed`,
      variant: "info",
      duration: 2000,
    });
  };

  const handleAddContact = () => {
    if (!newName.trim() || !newPhone.trim()) {
      showToast({ message: "Please fill in both fields", variant: "warning" });
      return;
    }
    const initials = newName.trim().split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2);
    const maskedPhone = newPhone.length > 6
      ? newPhone.slice(0, 8) + " ••• " + newPhone.slice(-4)
      : newPhone;
    setContacts((prev) => [
      ...prev,
      { id: `ec-${Date.now()}`, name: newName.trim(), phone: maskedPhone, initials },
    ]);
    setNewName("");
    setNewPhone("");
    setShowAddForm(false);
    showToast({ message: `${newName.trim()} added as emergency contact`, variant: "success" });
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
          Safety
        </span>
      </div>

      <div className="flex-1 overflow-y-auto px-5 pb-24 scrollbar-hide">
        {/* SOS Card */}
        <motion.div
          className="rounded-2xl px-4 py-4 mt-4 mb-5"
          style={{
            background: d ? "rgba(212,24,61,0.08)" : "rgba(212,24,61,0.05)",
            border: `1px solid ${d ? "rgba(212,24,61,0.15)" : "rgba(212,24,61,0.1)"}`,
          }}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-4 h-4" style={{ color: BRAND_COLORS.error }} />
            <span style={{ ...RT.bodySmall, fontWeight: 600, color: BRAND_COLORS.error }}>
              Emergency SOS
            </span>
          </div>
          <p style={{ ...RT.meta, color: c.text.muted, lineHeight: "1.6" }}>
            During an active trip, press and hold the SOS button for 3 seconds to alert your
            emergency contacts and JET's safety team with your live location.
          </p>
        </motion.div>

        {/* Emergency Contacts */}
        <span className="block mb-3" style={{ ...RT.label, color: c.text.faint }}>
          Emergency contacts
        </span>

        <div className="rounded-2xl overflow-hidden mb-2" style={{ background: c.surface.subtle }}>
          {contacts.map((contact, i) => (
            <motion.div
              key={contact.id}
              className="flex items-center gap-3 px-4 py-3.5"
              style={{
                borderBottom: i < contacts.length - 1
                  ? `1px solid ${c.surface.hover}`
                  : "none",
              }}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + i * MOTION.stagger }}
            >
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
                style={{
                  background: d ? "rgba(29,185,84,0.12)" : "rgba(29,185,84,0.08)",
                }}
              >
                <span style={{ ...RT.meta, fontWeight: 600, color: BRAND_COLORS.green }}>
                  {contact.initials}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <span style={{ ...RT.bodySmall, color: c.text.primary }}>
                  {contact.name}
                </span>
                <div style={{ ...RT.meta, color: c.text.muted }}>{contact.phone}</div>
              </div>

              {/* Delete with inline confirm */}
              {deleteId === contact.id ? (
                <div className="flex items-center gap-1.5">
                  <motion.button
                    className="w-7 h-7 rounded-lg flex items-center justify-center"
                    style={{ background: d ? "rgba(212,24,61,0.15)" : "rgba(212,24,61,0.1)" }}
                    onClick={() => handleDeleteContact(contact.id)}
                    whileTap={{ scale: 0.85 }}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                  >
                    <Check className="w-3 h-3" style={{ color: BRAND_COLORS.error }} />
                  </motion.button>
                  <motion.button
                    className="w-7 h-7 rounded-lg flex items-center justify-center"
                    style={{ background: c.surface.hover }}
                    onClick={() => setDeleteId(null)}
                    whileTap={{ scale: 0.85 }}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                  >
                    <X className="w-3 h-3" style={{ color: c.icon.muted }} />
                  </motion.button>
                </div>
              ) : (
                <motion.button
                  className="w-7 h-7 rounded-lg flex items-center justify-center"
                  style={{ background: "transparent" }}
                  onClick={() => setDeleteId(contact.id)}
                  whileTap={{ scale: 0.85 }}
                >
                  <Trash2 className="w-3.5 h-3.5" style={{ color: c.icon.muted }} />
                </motion.button>
              )}
            </motion.div>
          ))}
        </div>

        {/* Add contact */}
        <AnimatePresence>
          {showAddForm ? (
            <motion.div
              className="rounded-2xl overflow-hidden mb-4"
              style={{
                background: c.surface.subtle,
                border: `1px solid ${d ? "rgba(29,185,84,0.12)" : "rgba(29,185,84,0.08)"}`,
              }}
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ type: "spring", stiffness: 400, damping: 28 }}
            >
              <div className="px-4 py-4 space-y-3">
                <input
                  className="w-full bg-transparent outline-none"
                  style={{
                    ...RT.bodySmall,
                    color: c.text.primary,
                    padding: "10px 12px",
                    borderRadius: 10,
                    background: c.surface.hover,
                    border: "none",
                  }}
                  placeholder="Full name"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  autoFocus
                />
                <input
                  className="w-full bg-transparent outline-none"
                  style={{
                    ...RT.bodySmall,
                    color: c.text.primary,
                    padding: "10px 12px",
                    borderRadius: 10,
                    background: c.surface.hover,
                    border: "none",
                  }}
                  placeholder="Phone number"
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                  type="tel"
                />
                <div className="flex gap-2">
                  <motion.button
                    className="flex-1 py-2.5 rounded-xl text-center"
                    style={{
                      ...RT.bodySmall,
                      fontWeight: 600,
                      color: "#FFFFFF",
                      background: BRAND_COLORS.green,
                    }}
                    whileTap={{ scale: 0.97 }}
                    onClick={handleAddContact}
                  >
                    Add contact
                  </motion.button>
                  <motion.button
                    className="px-4 py-2.5 rounded-xl"
                    style={{
                      ...RT.bodySmall,
                      color: c.text.muted,
                      background: c.surface.hover,
                    }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => { setShowAddForm(false); setNewName(""); setNewPhone(""); }}
                  >
                    Cancel
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.button
              className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl mb-5"
              style={{
                background: c.surface.subtle,
                border: `1px dashed ${c.surface.hover}`,
              }}
              onClick={() => setShowAddForm(true)}
              whileTap={{ scale: 0.97 }}
            >
              <UserPlus className="w-3.5 h-3.5" style={{ color: BRAND_COLORS.green }} />
              <span style={{ ...RT.bodySmall, color: BRAND_COLORS.green }}>
                Add emergency contact
              </span>
            </motion.button>
          )}
        </AnimatePresence>

        {/* Auto-share toggle */}
        <span className="block mb-3" style={{ ...RT.label, color: c.text.faint }}>
          Trip sharing
        </span>
        <div className="rounded-2xl overflow-hidden" style={{ background: c.surface.subtle }}>
          <div className="flex items-center gap-3 px-4 py-4">
            <Share2 className="w-[18px] h-[18px] shrink-0" style={{ color: autoShare ? BRAND_COLORS.green : c.icon.muted }} />
            <div className="flex-1">
              <span style={{ ...RT.bodySmall, color: c.text.primary }}>
                Auto-share trips
              </span>
              <div style={{ ...RT.meta, color: c.text.muted, marginTop: "1px" }}>
                Automatically share your live trip status with emergency contacts
              </div>
            </div>
            <motion.button
              className="relative shrink-0"
              style={{
                width: 44,
                height: 26,
                borderRadius: 13,
                background: autoShare
                  ? BRAND_COLORS.green
                  : (d ? "rgba(255,255,255,0.12)" : "rgba(11,11,13,0.1)"),
                transition: "background 0.2s ease",
              }}
              onClick={() => {
                setAutoShare(!autoShare);
                showToast({
                  message: `Trip auto-sharing ${!autoShare ? "enabled" : "disabled"}`,
                  variant: !autoShare ? "success" : "info",
                  duration: 1800,
                });
              }}
              whileTap={{ scale: 0.92 }}
            >
              <motion.div
                className="absolute top-[3px] rounded-full"
                style={{
                  width: 20,
                  height: 20,
                  background: "#FFFFFF",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
                }}
                animate={{ left: autoShare ? 21 : 3 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
}