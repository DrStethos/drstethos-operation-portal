import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useInView } from "@/hooks/use-in-view";
import { scrollToId } from "@/lib/motion";

const paths = {
  doctors: {
    label: "Doctors",
    headline: "Take control of your medical career",
    copy: "Permanent roles, flexible shifts, or consulting—browse verified openings and apply without the recruiter maze.",
    cta: "Talk to us",
    ctaTarget: "get-in-touch",
    points: [
      "Shift and role discovery matched to your schedule",
      "Full-time, part-time, or per-diem flexibility",
      "Verified profile badges that hospitals trust",
      "Secure storage for licenses and certifications",
    ],
  },
  hospitals: {
    label: "Hospitals",
    headline: "Staff faster with verified talent",
    copy: "Post roles, shortlist candidates, and run interviews in one workflow—cut agency fees and keep staffing levels steady.",
    cta: "View hiring plans",
    ctaTarget: "pricing",
    points: [
      "Shorter time-to-hire with qualified professionals",
      "Pre-screened doctors with verified credentials",
      "Shift posting and applicant management in one place",
      "Live visibility into applications and filled roles",
    ],
  },
} as const;

export type PathKey = keyof typeof paths;

export const openLandingPath = (key: PathKey) => {
  window.dispatchEvent(new CustomEvent("drstethos:path", { detail: key }));
  scrollToId("paths");
};

const ChoosePath = () => {
  const [active, setActive] = useState<PathKey>("doctors");
  const [ref, inView] = useInView<HTMLElement>({ threshold: 0.12 });
  const path = paths[active];

  useEffect(() => {
    const onPath = (event: Event) => {
      const detail = (event as CustomEvent<PathKey>).detail;
      if (detail === "doctors" || detail === "hospitals") setActive(detail);
    };
    window.addEventListener("drstethos:path", onPath);
    return () => window.removeEventListener("drstethos:path", onPath);
  }, []);

  return (
    <section
      ref={ref}
      id="paths"
      className="section-y bg-[hsl(150,28%,12%)] text-white overflow-x-hidden scroll-mt-16"
    >
      <div id="for-doctors" className="scroll-mt-16" />
      <div id="for-hospitals" className="scroll-mt-16" />

      <div className="page-container">
        <div
          className={`flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10 transition-all duration-700 ${
            inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
          }`}
        >
          <div className="max-w-xl">
            <h2 className="font-display text-2xl md:text-3xl lg:text-[2.15rem] font-semibold tracking-tight">
              Choose your path
            </h2>
            <p className="mt-3 text-sm md:text-[15px] text-white/70 font-normal leading-relaxed">
              One platform, two focused experiences—built for how you hire or how you work.
            </p>
          </div>

          <div className="inline-flex self-start rounded-full bg-white/10 p-1 border border-white/15">
            {(Object.keys(paths) as PathKey[]).map((key) => (
              <button
                key={key}
                type="button"
                onClick={() => setActive(key)}
                className={`px-4 py-2 rounded-full text-[13px] font-medium transition-colors ${
                  active === key
                    ? "bg-white text-[hsl(150,35%,14%)]"
                    : "text-white/75 hover:text-white"
                }`}
              >
                {paths[key].label}
              </button>
            ))}
          </div>
        </div>

        <div
          className={`grid lg:grid-cols-2 gap-10 lg:gap-16 items-start transition-all duration-500 ${
            inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
          }`}
        >
          <div className="space-y-5">
            <h3 className="font-display text-xl md:text-2xl font-semibold tracking-tight leading-snug">
              {path.headline}
            </h3>
            <p className="text-sm md:text-[15px] text-white/75 leading-relaxed max-w-lg font-normal">
              {path.copy}
            </p>
            <Button
              size="lg"
              className="h-11 rounded-full bg-white text-primary hover:bg-white/95 font-semibold"
              onClick={() => scrollToId(path.ctaTarget)}
            >
              {path.cta}
            </Button>
          </div>

          <ul className="space-y-0 border-t border-white/15">
            {path.points.map((point) => (
              <li
                key={point}
                className="py-4 border-b border-white/15 text-sm md:text-[15px] text-white/90 font-normal leading-relaxed"
              >
                {point}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};

export default ChoosePath;
