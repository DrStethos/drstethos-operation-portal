import { useState } from "react";
import { useInView } from "@/hooks/use-in-view";

const hospitalSteps = [
  {
    title: "Create & verify hospital",
    description: "Register your facility and complete verification so candidates trust every listing.",
  },
  {
    title: "Post clear roles",
    description: "Publish openings with specialty, experience, location, and compensation details.",
  },
  {
    title: "Shortlist applicants",
    description: "Review verified doctor profiles and shortlist the right fit without spreadsheet chaos.",
  },
  {
    title: "Interview & place",
    description: "Run in-app interviews and move from offer to placement in one workflow.",
  },
];

const doctorSteps = [
  {
    title: "Create & verify profile",
    description: "Sign up, add credentials, and get verified so hospitals can trust your profile.",
  },
  {
    title: "Discover openings",
    description: "Browse verified hospital roles and filter by specialty, location, and schedule.",
  },
  {
    title: "Apply in a tap",
    description: "Submit applications quickly and track status without recruiter middlemen.",
  },
  {
    title: "Interview in-app",
    description: "Attend interviews inside DrStethos and move toward your next placement.",
  },
];

type TabKey = "hospitals" | "doctors";

const HowItWorks = () => {
  const [ref, inView] = useInView<HTMLElement>({ threshold: 0.12 });
  const [tab, setTab] = useState<TabKey>("hospitals");
  const steps = tab === "hospitals" ? hospitalSteps : doctorSteps;

  return (
    <section ref={ref} className="py-12 md:py-16 lg:py-20 bg-secondary/60 overflow-x-hidden">
      <div className="page-container">
        {/* Heading + tabs full width — image sits with steps, not the title */}
        <div
          className={`mb-6 md:mb-8 transition-all duration-700 ${
            inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
          }`}
        >
          <h2 className="font-display text-2xl md:text-3xl font-semibold text-foreground tracking-tight">
            From signup to placement
          </h2>
          <p className="mt-2 text-sm md:text-[15px] text-muted-foreground font-normal leading-relaxed max-w-md">
            A clear path for hospitals and doctors—no recruiting maze.
          </p>

          <div className="mt-5 inline-flex rounded-full bg-white p-1 border border-border">
            {(
              [
                { id: "hospitals" as const, label: "Hospital side" },
                { id: "doctors" as const, label: "Doctor side" },
              ] as const
            ).map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setTab(item.id)}
                className={`px-4 py-2 rounded-full text-[13px] font-medium transition-colors ${
                  tab === item.id
                    ? "bg-primary text-white"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-10 items-center">
          <ol className="relative">
            <div
              className="hidden sm:block absolute left-[1.05rem] top-3 bottom-3 w-px bg-border"
              aria-hidden="true"
            />
            {steps.map((step, index) => (
              <li
                key={`${tab}-${step.title}`}
                className={`relative grid grid-cols-[2.5rem_1fr] gap-3 sm:gap-4 py-3 border-b border-border/70 last:border-0 transition-all duration-500 ${
                  inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                }`}
                style={{ transitionDelay: inView ? `${index * 70}ms` : "0ms" }}
              >
                <span className="relative z-10 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-white text-xs font-semibold">
                  {index + 1}
                </span>
                <div className="min-w-0 pt-0.5">
                  <h3 className="text-sm font-semibold text-foreground mb-1">{step.title}</h3>
                  <p className="text-[13px] text-muted-foreground leading-relaxed font-normal">
                    {step.description}
                  </p>
                </div>
              </li>
            ))}
          </ol>

          <div
            className={`transition-all duration-700 delay-100 ${
              inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
            }`}
          >
            <div className="rounded-2xl overflow-hidden bg-secondary/40">
              <img
                src="/assets/how-it-works-clean.png"
                alt="Clean illustration of the hiring journey"
                className="w-full h-[240px] sm:h-[300px] lg:h-[340px] object-cover object-center"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
