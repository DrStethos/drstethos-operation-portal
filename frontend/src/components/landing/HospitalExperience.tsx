import { Button } from "@/components/ui/button";
import { scrollToId } from "@/lib/motion";
import { Reveal, Label } from "./SectionPrimitives";

const HospitalExperience = () => {
  return (
    <section
      id="for-hospitals"
      data-scene
      className="relative z-20 bg-[hsl(150,42%,11%)] text-white overflow-x-hidden scroll-mt-20 py-16 md:py-24 isolate"
    >
      <div
        id="steth-anchor-under-hospitals"
        className="pointer-events-none absolute left-1/2 bottom-8 -translate-x-1/2 w-4 h-4 z-0"
        aria-hidden="true"
      />
      <div className="page-container relative z-10">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          <Reveal className="lg:col-span-7 order-2 lg:order-1">
            <div className="relative overflow-hidden rounded-2xl aspect-[16/10] max-h-[420px] ring-1 ring-white/10">
              <img
                data-parallax="16"
                src="/assets/editorial-hospital.jpg"
                alt="Modern hospital environment"
                className="absolute inset-0 h-full w-full object-cover"
              />
            </div>
          </Reveal>

          <Reveal delay={0.06} className="lg:col-span-5 order-1 lg:order-2">
            <Label light>For hospitals</Label>
            <h2 className="display-xl text-white">
              Find the right doctors,
              <br />
              faster.
            </h2>
            <p className="body-lg text-white/70 mt-4 max-w-md">
              Post opportunities, review verified profiles, interview in-app, and hire with clarity.
            </p>

            <div className="mt-8 space-y-4 border-t border-white/15 pt-6 max-w-sm">
              {[
                "Post clear opportunities",
                "Discover verified doctors",
                "Interview and hire in one flow",
              ].map((line, i) => (
                <p key={line} className="flex gap-3 text-[15px] text-white/90 font-medium">
                  <span className="text-white/40 tabular-nums text-sm font-semibold">0{i + 1}</span>
                  {line}
                </p>
              ))}
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <Button
                className="h-11 rounded-full px-6 text-sm font-semibold bg-white text-primary hover:bg-white/95"
                onClick={() => scrollToId("pricing", 72)}
              >
                View hiring plans
              </Button>
              <Button
                variant="outline"
                className="h-11 rounded-full px-6 text-sm font-semibold border-white/25 bg-transparent text-white hover:bg-white/10 hover:text-white"
                onClick={() => scrollToId("get-in-touch", 72)}
              >
                Talk to us
              </Button>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
};

export default HospitalExperience;
