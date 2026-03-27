 /**
 * Referrals — Invite friends, earn rewards.
 *
 * NORTHSTAR: Uber referral + Cash App invite flow.
 * Hero: referral code with copy + share. Progress toward next reward.
 * History of referred friends with status.
 */

import { useState } from "react";
import { motion } from "motion/react";
import { ArrowLeft, Copy, Share2, Check, Gift, User, Clock } from "lucide-react";
import { GLASS_COLORS, GLASS_TYPE, MOTION, type GlassColorMode } from "../../config/project";
import { BRAND_COLORS } from "../../config/brand";
import { RIDER_TYPE as RT } from "../../config/rider-type";
import type { ToastConfig } from "./jet-toast";

const REFERRAL_CODE = "JETADEOLA";
const REWARD_PER_INVITE = 500;
const REFERRED_FRIENDS = [
  { name: "Ngozi A.", status: "completed" as const, earned: "₦500", date: "Feb 28" },
  { name: "Tunde M.", status: "completed" as const, earned: "₦500", date: "Feb 15" },
  { name: "Blessing O.", status: "pending" as const, earned: "—", date: "Mar 2" },
];

interface Props {
  colorMode: GlassColorMode;
  onBack: () => void;
  showToast: (config: ToastConfig) => void;
}

export function ReferralsScreen({ colorMode, onBack, showToast }: Props) {
  const c = GLASS_COLORS[colorMode];
  const d = colorMode === "dark";
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard?.writeText(REFERRAL_CODE).catch(() => {});
    setCopied(true);
    showToast({ message: "Referral code copied!", variant: "success", duration: 2000 });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: "Ride with JET",
        text: `Use my code ${REFERRAL_CODE} to get ₦${REWARD_PER_INVITE} off your first ride on JET!`,
        url: "https://jetride.ng/invite",
      }).catch(() => {});
    } else {
      handleCopy();
    }
  };

  const completedCount = REFERRED_FRIENDS.filter((f) => f.status === "completed").length;
  const totalEarned = completedCount * REWARD_PER_INVITE;

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
          Referrals
        </span>
      </div>

      <div className="flex-1 overflow-y-auto px-5 pb-24 scrollbar-hide">
        {/* Hero — earnings summary */}
        <motion.div
          className="text-center mt-6 mb-2"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-3"
            style={{
              background: d ? "rgba(29,185,84,0.1)" : "rgba(29,185,84,0.06)",
              border: `1px solid ${d ? "rgba(29,185,84,0.15)" : "rgba(29,185,84,0.1)"}`,
            }}
          >
            <Gift className="w-6 h-6" style={{ color: BRAND_COLORS.green }} />
          </div>
          <span
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: "32px",
              fontWeight: 700,
              letterSpacing: "-0.04em",
              lineHeight: "1",
              color: c.text.display,
              display: "block",
            }}
          >
            ₦{totalEarned.toLocaleString()}
          </span>
          <span
            className="block mt-1.5"
            style={{ ...RT.bodySmall, color: c.text.muted }}
          >
            earned from {completedCount} referral{completedCount !== 1 ? "s" : ""}
          </span>
        </motion.div>

        {/* Reward info */}
        <motion.p
          className="text-center mb-6 px-4"
          style={{ ...RT.meta, color: c.text.faint, lineHeight: "1.6" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 }}
        >
          Invite friends to JET. You both get ₦{REWARD_PER_INVITE} when they complete their first ride.
        </motion.p>

        {/* Referral code card */}
        <motion.div
          className="rounded-2xl px-5 py-4 mb-6"
          style={{
            background: c.surface.subtle,
            border: `1px solid ${d ? "rgba(29,185,84,0.1)" : "rgba(29,185,84,0.06)"}`,
          }}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <span className="block mb-2" style={{ ...RT.meta, color: c.text.faint }}>
            Your referral code
          </span>
          <div className="flex items-center gap-3 mb-4">
            <span
              className="flex-1"
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "22px",
                fontWeight: 600,
                letterSpacing: "0.05em",
                color: c.text.primary,
              }}
            >
              {REFERRAL_CODE}
            </span>
            <motion.button
              className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ background: c.surface.hover }}
              whileTap={{ scale: 0.85 }}
              onClick={handleCopy}
            >
              {copied ? (
                <Check className="w-4 h-4" style={{ color: BRAND_COLORS.green }} />
              ) : (
                <Copy className="w-4 h-4" style={{ color: c.icon.secondary }} />
              )}
            </motion.button>
          </div>

          <motion.button
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl"
            style={{
              background: BRAND_COLORS.green,
            }}
            whileTap={{ scale: 0.97 }}
            onClick={handleShare}
          >
            <Share2 className="w-4 h-4" style={{ color: "#FFFFFF" }} />
            <span style={{ ...RT.bodySmall, fontWeight: 600, color: "#FFFFFF" }}>
              Share invite link
            </span>
          </motion.button>
        </motion.div>

        {/* Referred friends */}
        <span className="block mb-3" style={{ ...RT.label, color: c.text.faint }}>
          Invited friends
        </span>

        <div className="rounded-2xl overflow-hidden" style={{ background: c.surface.subtle }}>
          {REFERRED_FRIENDS.map((friend, i) => (
            <motion.div
              key={friend.name}
              className="flex items-center gap-3 px-4 py-3.5"
              style={{
                borderBottom: i < REFERRED_FRIENDS.length - 1
                  ? `1px solid ${c.surface.hover}`
                  : "none",
              }}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 + i * MOTION.stagger }}
            >
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                style={{
                  background: friend.status === "completed"
                    ? (d ? "rgba(29,185,84,0.12)" : "rgba(29,185,84,0.08)")
                    : c.surface.hover,
                }}
              >
                <User
                  className="w-3.5 h-3.5"
                  style={{
                    color: friend.status === "completed"
                      ? BRAND_COLORS.green
                      : c.icon.muted,
                  }}
                />
              </div>
              <div className="flex-1">
                <span style={{ ...RT.bodySmall, color: c.text.primary }}>
                  {friend.name}
                </span>
                <div className="flex items-center gap-1.5 mt-0.5">
                  {friend.status === "pending" ? (
                    <>
                      <Clock className="w-2.5 h-2.5" style={{ color: BRAND_COLORS.warning }} />
                      <span style={{ ...RT.meta, color: BRAND_COLORS.warning }}>
                        Awaiting first ride
                      </span>
                    </>
                  ) : (
                    <span style={{ ...RT.meta, color: c.text.muted }}>
                      Completed · {friend.date}
                    </span>
                  )}
                </div>
              </div>
              <span
                style={{
                  ...RT.bodySmall,
                  fontWeight: 600,
                  color: friend.status === "completed" ? BRAND_COLORS.green : c.text.ghost,
                }}
              >
                {friend.earned}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}