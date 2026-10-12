import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Building2, Stethoscope } from "lucide-react";
import { Button } from "@/components/ui/button";
import { scrollToId } from "@/lib/motion";
import Stethoscope3D from "./Stethoscope3D";

const HeroSection = () => {
  const reduced = useReducedMotion();

  return (
    <section
      id="home"
      data-scene
      className="relative w-full overflow-visible bg-[hsl(150,42%,11%)] pt-[5.25rem] md:pt-[5.75rem] pb-16 md:pb-24"
    >
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{
          background: `
            radial-gradient(ellipse 70% 50% at 70% 40%, hsl(142 45% 28% / 0.4), transparent 55%),
            linear-gradient(180deg, hsl(150 40% 12%) 0%, hsl(150 42% 10%) 100%)
          `,
        }}
      />

      <div className="page-container relative z-10">
        {/* Align top so model sits beside the headline, not lower-centered */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-10 items-start">
          <div>
            {/* Height reference for the stethoscope = label + headline + body */}
            <div id="hero-text-block">
              <motion.p
                initial={reduced ? false : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="label-sm text-white/45 mb-4"
              >
                DrStethos
              </motion.p>

              <motion.h1
                initial={reduced ? false : { opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.05 }}
                className="display-hero text-white"
              >
                Healthcare hiring,
                <br />
                without the headache.
              </motion.h1>

              <motion.p
                initial={reduced ? false : { opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.15 }}
                className="body-lg text-white/75 mt-5 max-w-md"
              >
                Connect hospitals with the right doctors and discover healthcare opportunities in one
                place.
              </motion.p>
            </div>

            <motion.div
              initial={reduced ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.25 }}
              className="mt-8 flex flex-col sm:flex-row gap-3"
            >
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
            </motion.div>
          </div>

          {/* Model sits top-aligned beside the text block, same height as text */}
          <div className="relative hidden lg:block overflow-visible">
            <div
              id="steth-anchor-hero"
              className="w-full max-w-[420px] ml-auto overflow-visible"
              style={{ height: "var(--hero-steth-h, 280px)" }}
              aria-hidden="true"
            />
            {reduced && (
              <div className="absolute inset-0 overflow-visible drop-shadow-2xl">
                <Stethoscope3D autoRotate={false} />
              </div>
            )}
          </div>

          {/* Mobile anchor — compact, still top-aligned */}
          <div className="relative lg:hidden overflow-visible -mt-2 mb-2">
            <div
              id="steth-anchor-hero-mobile"
              className="mx-auto w-[240px] h-[220px] overflow-visible"
              aria-hidden="true"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
