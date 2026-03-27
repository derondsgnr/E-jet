/**
 * LandingPage — Public-facing JET marketing page.
 *
 * Placeholder scaffold — paste real content when ready.
 */

interface LandingPageProps {
  onGetStarted?: () => void;
  onDriveWithUs?: () => void;
  onFleetOwner?: () => void;
  onHotelPartner?: () => void;
}

export function LandingPage({
  onGetStarted,
  onDriveWithUs,
  onFleetOwner,
  onHotelPartner,
}: LandingPageProps) {
  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "#0B0B0D" }}>
      <div className="text-center px-6">
        <span
          style={{
            fontFamily: "var(--font-heading)",
            fontSize: "48px",
            fontWeight: 700,
            letterSpacing: "-0.04em",
            lineHeight: "1.1",
            color: "#FFFFFF",
            display: "block",
          }}
        >
          JET
        </span>
        <p
          className="mt-3"
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "16px",
            fontWeight: 400,
            letterSpacing: "-0.02em",
            lineHeight: "1.5",
            color: "rgba(255,255,255,0.5)",
          }}
        >
          Premium e-hailing, redefined.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3 mt-8">
          <button
            onClick={onGetStarted}
            className="px-6 py-3 rounded-xl"
            style={{
              background: "#1DB954",
              fontFamily: "var(--font-body)",
              fontSize: "14px",
              fontWeight: 600,
              letterSpacing: "-0.02em",
              lineHeight: "1.4",
              color: "#FFFFFF",
            }}
          >
            Get started
          </button>
          <button
            onClick={onDriveWithUs}
            className="px-6 py-3 rounded-xl"
            style={{
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.1)",
              fontFamily: "var(--font-body)",
              fontSize: "14px",
              fontWeight: 500,
              letterSpacing: "-0.02em",
              lineHeight: "1.4",
              color: "rgba(255,255,255,0.7)",
            }}
          >
            Drive with us
          </button>
        </div>
      </div>
    </div>
  );
}
