import { Calendar, Clock, Award, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useInView } from "@/hooks/use-in-view";
import { scrollToId } from "@/lib/motion";

const benefits = [
  {
    icon: Calendar,
    title: "Shift Discovery",
    description: "Browse shifts that match your schedule and location preferences.",
  },
  {
    icon: Clock,
    title: "Flexible Hours",
    description: "Full-time, part-time, or per-diem—pick what fits your life.",
  },
  {
    icon: Award,
    title: "Profile Credibility",
    description: "Verified badges build trust with healthcare facilities.",
  },
  {
    icon: Upload,
    title: "Easy Credentials",
    description: "Store and share licenses and certifications securely.",
  },
];

const ForDoctors = () => {
  const [ref, inView] = useInView<HTMLElement>({ threshold: 0.15 });

  return (
    <section
      ref={ref}
      id="for-doctors"
      className="section-y gradient-medical text-white overflow-x-hidden scroll-mt-16"
    >
      <div className="page-container">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-14 items-center">
          <div
            className={`space-y-5 transition-all duration-700 ${
              inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
            }`}
          >
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-white/70">
              For doctors
            </p>
            <h2 className="font-display text-2xl md:text-3xl lg:text-[2.15rem] font-semibold tracking-tight leading-snug">
              Take control of your medical career
            </h2>
            <p className="text-sm md:text-[15px] text-white/85 leading-relaxed max-w-lg font-normal">
              Permanent roles, flexible shifts, or consulting—find the fit with intelligent matching.
            </p>
            <Button
              size="lg"
              className="h-11 rounded-full bg-white text-primary hover:bg-white/95 font-semibold"
              onClick={() => scrollToId("get-in-touch")}
            >
              Talk to us
            </Button>
          </div>

          <div className="grid sm:grid-cols-2 gap-3.5">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <div
                  key={benefit.title}
                  className={`p-5 rounded-2xl bg-white/10 backdrop-blur border border-white/15 hover:bg-white/15 transition-all duration-500 ${
                    inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
                  }`}
                  style={{ transitionDelay: inView ? `${120 + index * 70}ms` : "0ms" }}
                >
                  <Icon className="h-5 w-5 text-white mb-3" strokeWidth={2} />
                  <h3 className="text-sm font-semibold mb-1.5 text-white">{benefit.title}</h3>
                  <p className="text-white/75 text-xs leading-relaxed font-normal">{benefit.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ForDoctors;
