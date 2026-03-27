 /**
 * Website Variant Views — Direct routes to individual landing page variations.
 *
 * /website/a → Editorial Gravity
 * /website/b → Cinematic Dark
 * /website/c → Spatial Theater
 */

import { useNavigate } from "react-router";
import { LandingPageA } from "../components/website/landing-page-a";
import { LandingPageB } from "../components/website/landing-page-b";
import { LandingPageC } from "../components/website/landing-page-c";

function useNavCallbacks() {
  const navigate = useNavigate();
  return {
    onGetStarted: () => navigate("/rider/onboarding"),
    onDriveWithUs: () => navigate("/driver/onboarding"),
  };
}

export function WebsiteA() {
  const cbs = useNavCallbacks();
  return <LandingPageA {...cbs} />;
}

export function WebsiteB() {
  const cbs = useNavCallbacks();
  return <LandingPageB {...cbs} />;
}

export function WebsiteC() {
  const cbs = useNavCallbacks();
  return <LandingPageC {...cbs} />;
}
