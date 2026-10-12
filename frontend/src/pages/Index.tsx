import { useRef } from "react";
import LandingNav from "@/components/landing/LandingNav";
import HeroSection from "@/components/landing/HeroSection";
import HealthcareIntro from "@/components/landing/HealthcareIntro";
import PlatformConnection from "@/components/landing/PlatformConnection";
import DoctorExperience from "@/components/landing/DoctorExperience";
import HospitalExperience from "@/components/landing/HospitalExperience";
import HowItWorksStory from "@/components/landing/HowItWorksStory";
import ProductShowcase from "@/components/landing/ProductShowcase";
import TrustSection from "@/components/landing/TrustSection";
import PricingSection from "@/components/landing/PricingSection";
import FAQSection from "@/components/landing/FAQSection";
import FinalCTA from "@/components/landing/FinalCTA";
import StethoscopeJourney from "@/components/landing/StethoscopeJourney";
import Support from "@/components/Support";
import Footer from "@/components/Footer";
import { useLandingGsap } from "@/hooks/useLandingGsap";

const Index = () => {
  const rootRef = useRef<HTMLDivElement>(null);
  useLandingGsap(rootRef);

  return (
    <div
      ref={rootRef}
      className="landing-theme relative w-full max-w-[100vw] min-h-screen overflow-x-hidden bg-background"
    >
      <LandingNav />
      <StethoscopeJourney />
      <HeroSection />
      <HealthcareIntro />
      <PlatformConnection />
      <DoctorExperience />
      <HospitalExperience />
      <HowItWorksStory />
      <ProductShowcase />
      <TrustSection />
      <PricingSection />
      <FAQSection />
      <FinalCTA />
      <div id="get-in-touch" className="scroll-mt-20" data-scene>
        <Support />
      </div>
      <Footer />
    </div>
  );
};

export default Index;
