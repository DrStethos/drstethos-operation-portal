import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CheckCircle2, Search, Send, Trophy } from "lucide-react";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger);

const steps = [
  {
    title: "Create your profile",
    description: "Sign up, add credentials, and get verified.",
    cardTitle: "Verified start",
    cardLines: [
      "Add specialty and experience",
      "Upload documents for review",
      "Get verified before full access",
    ],
    icon: CheckCircle2,
    theme: {
      bg: "#F3F8F5",
      panel: "#FFFFFF",
      accent: "#00964C",
      number: "rgba(0,150,76,0.18)",
      text: "#0F2A1C",
      muted: "#5A6F63",
    },
  },
  {
    title: "Discover opportunities",
    description: "Browse roles or post openings in the same app.",
    cardTitle: "Smart discovery",
    cardLines: [
      "Featured jobs for doctors",
      "Filters by type and location",
      "Hospitals manage posted roles",
    ],
    icon: Search,
    theme: {
      bg: "#EAF3FF",
      panel: "#FFFFFF",
      accent: "#2563EB",
      number: "rgba(37,99,235,0.16)",
      text: "#0F1B2D",
      muted: "#5B6B7C",
    },
  },
  {
    title: "Apply & review",
    description: "Apply in a few taps. Hospitals shortlist in-app.",
    cardTitle: "Simple applications",
    cardLines: [
      "Apply Now from job details",
      "Track status as it updates",
      "Hospitals shortlist candidates",
    ],
    icon: Send,
    theme: {
      bg: "#FFF6EB",
      panel: "#FFFFFF",
      accent: "#C2410C",
      number: "rgba(194,65,12,0.16)",
      text: "#2A1608",
      muted: "#7A6554",
    },
  },
  {
    title: "Get hired",
    description: "Interview and move to placement inside DrStethos.",
    cardTitle: "Connected hiring",
    cardLines: [
      "Message and interview in-app",
      "Clear hiring decisions",
      "From signup to placement",
    ],
    icon: Trophy,
    theme: {
      bg: "#F3EEFF",
      panel: "#FFFFFF",
      accent: "#6D28D9",
      number: "rgba(109,40,217,0.16)",
      text: "#1C1030",
      muted: "#6B5F7A",
    },
  },
];

const HowItWorksStory = () => {
  const [active, setActive] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const theme = steps[active].theme;
  const Icon = steps[active].icon;

  useEffect(() => {
    const section = sectionRef.current;
    const pin = pinRef.current;
    if (!section || !pin) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isMobile = window.matchMedia("(max-width: 767px)").matches;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: section,
        start: reduced || isMobile ? "top 80%" : "top top",
        end: reduced || isMobile ? "bottom 20%" : "bottom bottom",
        scrub: true,
        pin: !reduced && !isMobile ? pin : false,
        anticipatePin: 1,
        onUpdate: (self) => {
          const idx = Math.min(steps.length - 1, Math.floor(self.progress * steps.length));
          setActive(idx);
        },
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="how-it-works"
      data-scene
      className="scroll-mt-20 md:h-[150vh] transition-colors duration-500"
      style={{ backgroundColor: theme.bg }}
    >
      <div ref={pinRef} className="relative md:h-screen flex items-center py-12 md:py-0">
        <div className="page-container w-full">
          <p className="label-sm mb-4" style={{ color: theme.accent }}>
            How it works
          </p>

          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div className="relative max-w-md">
              <p
                className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight leading-none tabular-nums transition-colors duration-500"
                style={{ color: theme.number }}
              >
                0{active + 1}
              </p>
              <h2
                className="display-lg mt-2 max-w-md transition-colors duration-500"
                style={{ color: theme.text }}
              >
                {steps[active].title}
              </h2>
              <p
                className="text-[15px] mt-3 max-w-sm leading-relaxed transition-colors duration-500"
                style={{ color: theme.muted }}
              >
                {steps[active].description}
              </p>

              <div className="mt-6 flex gap-2">
                {steps.map((s, i) => (
                  <button
                    key={s.title}
                    type="button"
                    aria-label={`Step ${i + 1}`}
                    onClick={() => setActive(i)}
                    className={cn(
                      "h-1.5 rounded-full transition-all duration-300",
                      active === i ? "w-9" : "w-3.5 opacity-30 hover:opacity-60"
                    )}
                    style={{ backgroundColor: theme.accent }}
                  />
                ))}
              </div>
            </div>

            <div
              key={steps[active].title}
              className="relative z-20 w-full max-w-md lg:ml-auto rounded-2xl p-7 sm:p-8 shadow-[0_20px_50px_-28px_rgba(0,0,0,0.22)] transition-all duration-500"
              style={{ backgroundColor: theme.panel }}
            >
              <div
                className="inline-flex h-11 w-11 items-center justify-center rounded-xl mb-5"
                style={{ backgroundColor: `${theme.accent}18`, color: theme.accent }}
              >
                <Icon className="h-5 w-5" strokeWidth={2.2} />
              </div>
              <p
                className="text-xs font-semibold uppercase tracking-[0.16em] mb-2"
                style={{ color: theme.accent }}
              >
                Step 0{active + 1}
              </p>
              <h3 className="text-xl font-semibold tracking-tight mb-5" style={{ color: theme.text }}>
                {steps[active].cardTitle}
              </h3>
              <ul className="space-y-3">
                {steps[active].cardLines.map((line) => (
                  <li
                    key={line}
                    className="flex gap-3 rounded-xl px-4 py-3 text-[14px] font-medium"
                    style={{ backgroundColor: theme.bg, color: theme.text }}
                  >
                    <span
                      className="mt-1.5 h-1.5 w-1.5 rounded-full flex-shrink-0"
                      style={{ backgroundColor: theme.accent }}
                    />
                    {line}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksStory;
