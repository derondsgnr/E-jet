 /**
 * Website View — Public-facing JET marketing site.
 *
 * Manages which page is showing:
 *   "landing"  → Main marketing landing page
 *   "hotels"   → Hotel partners B2B subpage
 *   "fleet"    → Fleet owners B2B subpage
 */

import { useState } from "react";
import { useNavigate } from "react-router";
import { LandingPage } from "../components/website/landing-page";
import { HotelPartners } from "../components/website/hotel-partners";
import { FleetOwners } from "../components/website/fleet-owners";

type Page = "landing" | "hotels" | "fleet";

export function Website() {
  const navigate = useNavigate();
  const [page, setPage] = useState<Page>("landing");

  if (page === "hotels") {
    return (
      <HotelPartners
        onBack={() => setPage("landing")}
        onGetStarted={() => navigate("/rider/onboarding")}
      />
    );
  }

  if (page === "fleet") {
    return (
      <FleetOwners
        onBack={() => setPage("landing")}
        onGetStarted={() => navigate("/rider/onboarding")}
      />
    );
  }

  return (
    <LandingPage
      onGetStarted={() => navigate("/rider/onboarding")}
      onDriveWithUs={() => navigate("/driver/onboarding")}
      onFleetOwner={() => setPage("fleet")}
      onHotelPartner={() => setPage("hotels")}
    />
  );
}
