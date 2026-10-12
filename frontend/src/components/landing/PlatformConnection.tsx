import { ArrowUpRight } from "lucide-react";
import { scrollToId } from "@/lib/motion";
import { Reveal, Label } from "./SectionPrimitives";

const PlatformConnection = () => {
  return (
    <section
      id="one-platform"
      data-scene
      className="relative z-20 bg-white py-14 md:py-16 overflow-hidden isolate"
    >
      <div
        id="steth-anchor-under-platform"
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 z-0"
        aria-hidden="true"
      />

      <div className="page-container mb-6 md:mb-8 relative z-10">
        <Reveal>
          <Label>One platform</Label>
          <h2 className="display-xl text-foreground max-w-2xl">
            Two sides of healthcare hiring.
          </h2>
        </Reveal>
      </div>

      <div className="page-container grid md:grid-cols-2 gap-4 relative z-10" data-reveal-stagger>
        <button
          type="button"
          onClick={() => scrollToId("for-doctors", 72)}
          className="group relative text-left overflow-hidden min-h-[280px] md:min-h-[340px] bg-[#EEF4F0] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <img
            src="/assets/editorial-doctor.jpg"
            alt="For doctors"
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-6 md:p-8 text-white">
            <p className="label-sm text-white/55 mb-2">For doctors</p>
            <h3 className="display-lg text-white max-w-sm">
              Your next opportunity is closer than you think.
            </h3>
            <span className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-white/90">
              Explore
              <ArrowUpRight className="h-4 w-4" />
            </span>
          </div>
        </button>

        <button
          type="button"
          onClick={() => scrollToId("for-hospitals", 72)}
          className="group relative text-left overflow-hidden min-h-[280px] md:min-h-[340px] bg-[hsl(150,28%,12%)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <img
            src="/assets/editorial-hospital.jpg"
            alt="For hospitals"
            className="absolute inset-0 h-full w-full object-cover opacity-90 transition-transform duration-700 group-hover:scale-[1.03]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[hsl(150,40%,6%)] via-black/30 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-6 md:p-8 text-white">
            <p className="label-sm text-white/55 mb-2">For hospitals</p>
            <h3 className="display-lg text-white max-w-sm">Find the right doctors, faster.</h3>
            <span className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-white/90">
              Explore
              <ArrowUpRight className="h-4 w-4" />
            </span>
          </div>
        </button>
      </div>
    </section>
  );
};

export default PlatformConnection;
