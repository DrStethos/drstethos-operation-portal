import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import PhoneFrame from "@/components/PhoneFrame";
import Reveal from "@/components/Reveal";
import { scrollToId, springSoft } from "@/lib/motion";

const Paths = () => {
  const reduced = useReducedMotion();

  return (
    <section id="paths" className="section-y bg-white">
      <div className="page-container">
        <Reveal className="max-w-2xl mb-12 md:mb-16">
          <p className="eyebrow mb-3">Who it&apos;s for</p>
          <h2 className="display text-[1.85rem] sm:text-[2.35rem] lg:text-[2.6rem]">
            One platform. Two clear starting points.
          </h2>
          <p className="lede mt-4 max-w-lg">
            Whether you&apos;re looking for the right role or the right hire—start here.
          </p>
        </Reveal>

        <div className="grid lg:grid-cols-2 gap-5 lg:gap-6">
          {/* Find Jobs / Doctors */}
          <Reveal delay={0.08} variant="tilt">
            <motion.article
              id="for-doctors"
              className="surface overflow-hidden scroll-mt-24 hover:shadow-soft transition-shadow duration-500"
              whileHover={reduced ? undefined : { y: -6, rotateX: 2, rotateY: -2 }}
              transition={springSoft}
              style={{ transformStyle: "preserve-3d", perspective: 900 }}
            >
              <div className="p-6 sm:p-8 pb-4">
                <p className="text-sm font-medium text-muted-foreground mb-2">For doctors</p>
                <h3 className="font-display text-xl sm:text-2xl font-semibold tracking-tight mb-3">
                  Find work that fits your life.
                </h3>
                <p className="text-[15px] text-muted-foreground leading-relaxed mb-5">
                  Explore verified roles, flexible shifts, and hospitals looking for your specialty.
                </p>
                <ul className="space-y-2 text-sm text-foreground/80 mb-6">
                  <li>Featured jobs matched to your specialty</li>
                  <li>Fast apply with credential profile</li>
                  <li>Track interviews and application status</li>
                </ul>
                <Button
                  variant="outline"
                  className="rounded-xl h-11 font-semibold"
                  onClick={() => scrollToId("get-in-touch")}
                >
                  Explore opportunities
                  <ArrowUpRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
              <div className="px-6 sm:px-8 pb-8 flex justify-center" style={{ perspective: 1000 }}>
                <motion.div
                  animate={
                    reduced
                      ? undefined
                      : { rotateY: [-12, 12, -12], rotateX: [4, -2, 4] }
                  }
                  transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                  style={{ transformStyle: "preserve-3d" }}
                >
                  <PhoneFrame
                    src="/assets/phone-doctor-home.png"
                    alt="Doctor Featured Jobs screen"
                    className="!w-[180px] sm:!w-[200px]"
                  />
                </motion.div>
              </div>
            </motion.article>
          </Reveal>

          {/* Hire Doctors / Hospitals */}
          <Reveal delay={0.16} variant="tilt">
            <motion.article
              id="for-hospitals"
              className="overflow-hidden rounded-2xl bg-forest text-white scroll-mt-24 transition-shadow duration-500 hover:shadow-soft"
              whileHover={reduced ? undefined : { y: -6, rotateX: 2, rotateY: 2 }}
              transition={springSoft}
              style={{ transformStyle: "preserve-3d", perspective: 900 }}
            >
              <div className="p-6 sm:p-8 pb-4">
                <p className="text-sm font-medium text-white/55 mb-2">For hospitals</p>
                <h3 className="font-display text-xl sm:text-2xl font-semibold tracking-tight mb-3">
                  Hire verified talent, faster.
                </h3>
                <p className="text-[15px] leading-relaxed text-white/70 mb-5">
                  Post roles, shortlist professionals, and manage interviews from one dashboard.
                </p>
                <ul className="space-y-2 text-sm text-white/80 mb-6">
                  <li>Posted jobs with live application counts</li>
                  <li>Shortlist, hire, and schedule interviews</li>
                  <li>Staffing progress in one view</li>
                </ul>
                <Button
                  className="rounded-xl h-11 font-semibold bg-primary hover:bg-primary/90"
                  onClick={() => scrollToId("pricing")}
                >
                  Start hiring
                  <ArrowUpRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
              <div className="px-6 sm:px-8 pb-8 flex justify-center" style={{ perspective: 1000 }}>
                <motion.div
                  animate={
                    reduced
                      ? undefined
                      : { rotateY: [12, -12, 12], rotateX: [-2, 4, -2] }
                  }
                  transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
                  style={{ transformStyle: "preserve-3d" }}
                >
                  <PhoneFrame
                    src="/assets/phone-hospital-home.png"
                    alt="Hospital Posted Jobs screen"
                    className="!w-[180px] sm:!w-[200px]"
                  />
                </motion.div>
              </div>
            </motion.article>
          </Reveal>
        </div>
      </div>
    </section>
  );
};

export default Paths;
