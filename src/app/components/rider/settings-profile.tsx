 /**
 * Profile Edit — View/edit personal details.
 *
 * NORTHSTAR: Apple ID settings + Linear profile.
 * Fields: name, email, phone — with inline edit pattern.
 * Non-destructive: save/cancel with confirmation.
 */

import { useState } from "react";
import { motion } from "motion/react";
import { ArrowLeft, Camera, Star, Calendar } from "lucide-react";
import { GLASS_COLORS, GLASS_TYPE, type GlassColorMode } from "../../config/project";
import { BRAND_COLORS } from "../../config/brand";
import { RIDER_USER } from "./rider-home-c";
import type { ToastConfig } from "./jet-toast";

const AVATAR_URL =
  "https://images.unsplash.com/photo-1668752600261-e56e7f3780b6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwb3J0cmFpdCUyMGFmcmljYW4lMjBtYW4lMjBwcm9mZXNzaW9uYWwlMjBoZWFkc2hvdHxlbnwxfHx8fDE3NzI1MzU3NzV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral";

interface Props {
  colorMode: GlassColorMode;
  onBack: () => void;
  showToast: (config: ToastConfig) => void;
}

export function ProfileEditScreen({ colorMode, onBack, showToast }: Props) {
  const c = GLASS_COLORS[colorMode];
  const d = colorMode === "dark";

  const [firstName, setFirstName] = useState(RIDER_USER.firstName);
  const [lastName, setLastName] = useState(RIDER_USER.lastName);
  const [email, setEmail] = useState("adeola.o@gmail.com");
  const [phone, setPhone] = useState("+234 803 456 7890");
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleChange = (setter: (v: string) => void) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setter(e.target.value);
    setDirty(true);
  };

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setDirty(false);
      showToast({ message: "Profile updated", variant: "success" });
    }, 800);
  };

  const inputStyle = {
    ...GLASS_TYPE.bodySmall,
    color: c.text.primary,
    padding: "12px 14px",
    borderRadius: 12,
    background: c.surface.hover,
    border: "none",
    outline: "none",
    width: "100%",
  };

  return (
    <div className="h-full flex flex-col" style={{ background: c.bg }}>
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-14 pb-3">
        <div className="flex items-center gap-3">
          <motion.button
            className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: c.surface.subtle }}
            onClick={onBack}
            whileTap={{ scale: 0.9 }}
          >
            <ArrowLeft className="w-4 h-4" style={{ color: c.icon.secondary }} />
          </motion.button>
          <span style={{ ...GLASS_TYPE.body, fontWeight: 600, color: c.text.primary }}>
            Profile
          </span>
        </div>
        {dirty && (
          <motion.button
            className="px-4 py-2 rounded-xl"
            style={{
              ...GLASS_TYPE.bodySmall,
              fontWeight: 600,
              color: "#FFFFFF",
              background: BRAND_COLORS.green,
              opacity: saving ? 0.6 : 1,
            }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSave}
            disabled={saving}
            initial={{ opacity: 0, x: 8 }}
            animate={{ opacity: 1, x: 0 }}
          >
            {saving ? "Saving..." : "Save"}
          </motion.button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto px-5 pb-24 scrollbar-hide">
        {/* Avatar */}
        <motion.div
          className="flex flex-col items-center mt-4 mb-6"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="relative mb-3">
            <div
              className="w-20 h-20 rounded-full overflow-hidden border-2"
              style={{ borderColor: `${BRAND_COLORS.green}30` }}
            >
              <img src={AVATAR_URL} alt="Profile" className="w-full h-full object-cover" />
            </div>
            <motion.button
              className="absolute -bottom-0.5 -right-0.5 w-7 h-7 rounded-full flex items-center justify-center"
              style={{
                background: BRAND_COLORS.green,
                border: `2px solid ${c.bg}`,
              }}
              whileTap={{ scale: 0.85 }}
              onClick={() => showToast({ message: "Photo picker would open here", variant: "info" })}
            >
              <Camera className="w-3 h-3" style={{ color: "#FFFFFF" }} />
            </motion.button>
          </div>

          {/* Quick stats */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <Star className="w-3 h-3" style={{ color: BRAND_COLORS.green, fill: BRAND_COLORS.green }} />
              <span style={{ ...GLASS_TYPE.caption, color: c.text.secondary }}>{RIDER_USER.rating}</span>
            </div>
            <span style={{ ...GLASS_TYPE.caption, color: c.text.ghost }}>·</span>
            <div className="flex items-center gap-1">
              <Calendar className="w-3 h-3" style={{ color: c.icon.muted }} />
              <span style={{ ...GLASS_TYPE.caption, color: c.text.muted }}>Since {RIDER_USER.memberSince}</span>
            </div>
          </div>
        </motion.div>

        {/* Form */}
        <span className="block mb-3" style={{ ...GLASS_TYPE.label, color: c.text.faint }}>
          Personal details
        </span>

        <div className="space-y-3 mb-6">
          <div>
            <label style={{ ...GLASS_TYPE.caption, color: c.text.muted, display: "block", marginBottom: 4, paddingLeft: 2 }}>
              First name
            </label>
            <input style={inputStyle} value={firstName} onChange={handleChange(setFirstName)} />
          </div>
          <div>
            <label style={{ ...GLASS_TYPE.caption, color: c.text.muted, display: "block", marginBottom: 4, paddingLeft: 2 }}>
              Last name
            </label>
            <input style={inputStyle} value={lastName} onChange={handleChange(setLastName)} />
          </div>
          <div>
            <label style={{ ...GLASS_TYPE.caption, color: c.text.muted, display: "block", marginBottom: 4, paddingLeft: 2 }}>
              Email
            </label>
            <input style={inputStyle} value={email} onChange={handleChange(setEmail)} type="email" />
          </div>
          <div>
            <label style={{ ...GLASS_TYPE.caption, color: c.text.muted, display: "block", marginBottom: 4, paddingLeft: 2 }}>
              Phone
            </label>
            <input style={inputStyle} value={phone} onChange={handleChange(setPhone)} type="tel" />
          </div>
        </div>

        {/* Read-only info */}
        <span className="block mb-3" style={{ ...GLASS_TYPE.label, color: c.text.faint }}>
          Account
        </span>
        <div className="rounded-2xl overflow-hidden" style={{ background: c.surface.subtle }}>
          {[
            { label: "Rider ID", value: "JET-RD-00847" },
            { label: "Member since", value: RIDER_USER.memberSince },
            { label: "Lifetime rides", value: "127" },
          ].map((row, i) => (
            <div
              key={row.label}
              className="flex items-center justify-between px-4 py-3.5"
              style={{
                borderBottom: i < 2 ? `1px solid ${c.surface.hover}` : "none",
              }}
            >
              <span style={{ ...GLASS_TYPE.bodySmall, color: c.text.muted }}>{row.label}</span>
              <span style={{ ...GLASS_TYPE.bodySmall, color: c.text.primary }}>{row.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}