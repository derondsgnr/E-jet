import { LandingPageD } from "./landing-page-d";

interface LandingPageProps {
  onGetStarted?: () => void;
  onDriveWithUs?: () => void;
  onFleetOwner?: () => void;
  onHotelPartner?: () => void;
}

export function LandingPage({
  onGetStarted,
  onDriveWithUs,
}: LandingPageProps) {
  return <LandingPageD onGetStarted={onGetStarted} onDriveWithUs={onDriveWithUs} />;
}
