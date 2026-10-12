import { Users, CheckCircle, Calendar as CalendarIcon, BarChart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useInView } from "@/hooks/use-in-view";
import { scrollToId } from "@/lib/motion";

const benefits = [
  {
    icon: Users,
    title: "Hiring Efficiency",
    description: "Cut time-to-hire with instant access to qualified professionals.",
  },
  {
    icon: CheckCircle,
    title: "Verified Profiles",
    description: "Pre-screened doctors with verified credentials and backgrounds.",
  },
  {
    icon: CalendarIcon,
    title: "Scheduling Tools",
    description: "Post shifts and manage staffing requirements in one place.",
  },
  {
    icon: BarChart,
    title: "Shift Management",
    description: "Track filled roles, applications, and staffing analytics live.",
  },
];

const ForHospitals = () => {
  const [ref, inView] = useInView<HTMLElement>({ threshold: 0.15 });

  return (
    <section
      ref={ref}
      id="for-hospitals"
      className="section-y bg-secondary/50 overflow-x-hidden scroll-mt-16"
    >
      <div className="page-container">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-14 items-center">
          <div className="grid sm:grid-cols-2 gap-3.5 order-2 lg:order-1">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <div
                  key={benefit.title}
                  className={`p-5 rounded-2xl bg-white border border-border/70 hover:border-primary/25 hover:shadow-medical transition-all duration-500 ${
                    inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
                  }`}
                  style={{ transitionDelay: inView ? `${index * 70}ms` : "0ms" }}
                >
                  <div className="w-10 h-10 rounded-xl gradient-medical flex items-center justify-center mb-3">
                    <Icon className="h-5 w-5 text-white" strokeWidth={2} />
                  </div>
                  <h3 className="text-sm font-semibold mb-1.5 text-foreground">{benefit.title}</h3>
                  <p className="text-muted-foreground text-xs leading-relaxed font-normal">
                    {benefit.description}
                  </p>
                </div>
              );
            })}
          </div>

          <div
            className={`space-y-5 order-1 lg:order-2 transition-all duration-700 ${
              inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
            }`}
          >
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">
              For hospitals
            </p>
            <h2 className="font-display text-2xl md:text-3xl lg:text-[2.15rem] font-semibold text-foreground tracking-tight leading-snug">
              Streamline your staffing process
            </h2>
            <p className="text-sm md:text-[15px] text-muted-foreground leading-relaxed max-w-lg font-normal">
              From emergency coverage to permanent hires—connect with verified talent, cut agency
              fees, and keep staffing levels where they need to be.
            </p>
            <Button
              size="lg"
              className="h-11 rounded-full font-semibold shadow-medical"
              onClick={() => scrollToId("pricing")}
            >
              View hiring plans
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ForHospitals;
