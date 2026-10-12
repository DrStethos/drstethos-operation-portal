import { ArrowRight, Building2, Stethoscope } from "lucide-react";
import { Button } from "@/components/ui/button";
import { scrollToId } from "@/lib/motion";
import { Reveal } from "./SectionPrimitives";

const FinalCTA = () => {
  return (
    <section data-scene className="relative overflow-hidden bg-[hsl(150,42%,11%)]">
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(ellipse 70% 60% at 50% 0%, hsl(142 48% 30% / 0.4), transparent 55%)",
        }}
      />
      <img
        src="/assets/center.png"
        alt=""
        className="pointer-events-none absolute right-[-4%] bottom-[-18%] w-[220px] md:w-[280px] opacity-[0.1] rotate-12 hidden sm:block"
        aria-hidden="true"
      />

      <div className="page-container relative z-10 py-20 md:py-28">
        <Reveal className="max-w-2xl">
          <h2 className="display-xl text-white">
            Your next opportunity
            <br />
            starts here.
          </h2>
          <p className="body-lg text-white/70 mt-5 max-w-md">
            Whether you&apos;re hiring doctors or looking for your next healthcare opportunity,
            DrStethos brings the journey together.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <Button
              size="lg"
              className="h-12 rounded-full px-7 text-sm font-semibold bg-white text-primary hover:bg-white/95 gap-2"
              onClick={() => scrollToId("for-doctors", 72)}
            >
              <Stethoscope className="h-4 w-4" />
              I&apos;m a Doctor
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="h-12 rounded-full px-7 text-sm font-semibold border-white/25 bg-transparent text-white hover:bg-white/10 hover:text-white gap-2"
              onClick={() => scrollToId("for-hospitals", 72)}
            >
              <Building2 className="h-4 w-4" />
              I&apos;m a Hospital
            </Button>
          </div>
        </Reveal>
      </div>
    </section>
  );
};

export default FinalCTA;
