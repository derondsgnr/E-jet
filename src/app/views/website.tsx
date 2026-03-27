 /**
 * Website View — Public-facing JET marketing site.
 *
 * Wraps the LandingPage component and provides navigation callbacks
 * that link to the demo flows (rider onboarding, driver onboarding, etc).
 */

import { useNavigate } from "react-router";
import { LandingPage } from "../components/website/landing-page";

export function Website() {
  const navigate = useNavigate();

  return (
    <LandingPage
      onGetStarted={() => navigate("/rider/onboarding")}
      onDriveWithUs={() => navigate("/driver/onboarding")}
      onFleetOwner={() => navigate("/fleet")}
      onHotelPartner={() => navigate("/hotel")}
    />
  );
}
