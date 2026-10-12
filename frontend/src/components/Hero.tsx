import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Stethoscope,
  Building2,
  ChevronDown,
  BadgeCheck,
  Briefcase,
  Video,
} from "lucide-react";
import { useInView } from "@/hooks/use-in-view";
import { openLandingPath } from "@/components/ChoosePath";
import { scrollToId } from "@/lib/motion";

const showcasePoints = [
  {
    icon: BadgeCheck,
    title: "Verified profiles",
    text: "Credential checks before full access",
  },
  {
    icon: Briefcase,
    title: "Jobs & applications",
    text: "Post roles or apply in a few taps",
  },
  {
    icon: Video,
    title: "In-app interviews",
    text: "Schedule and meet without app-switching",
  },
];

const Hero = () => {
  const [showcaseRef, showcaseInView] = useInView<HTMLDivElement>({
    threshold: 0.12,
    rootMargin: "0px 0px -5% 0px",
  });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  const scrollToShowcase = () => {
    document.getElementById("hero-showcase")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <>
      <section className="relative w-full min-h-[calc(100dvh-3.5rem)] max-w-[100vw] overflow-hidden flex flex-col bg-[hsl(150,42%,16%)]">
        <div
          className="absolute inset-0 pointer-events-none"
          aria-hidden="true"
          style={{
            background: `
              radial-gradient(ellipse 70% 55% at 50% 0%, hsl(142 50% 34% / 0.45), transparent 58%),
              radial-gradient(ellipse 50% 40% at 100% 100%, hsl(152 45% 26% / 0.35), transparent 55%),
              linear-gradient(180deg, hsl(150 40% 18%) 0%, hsl(150 42% 14%) 55%, hsl(150 48% 11%) 100%)
            `,
          }}
        />
        <div
          className="absolute inset-0 opacity-[0.035] pointer-events-none"
          aria-hidden="true"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.55) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.45) 1px, transparent 1px)",
            backgroundSize: "56px 56px",
            maskImage: "radial-gradient(ellipse 80% 70% at 50% 40%, black, transparent)",
          }}
        />

        <div className="page-container relative z-10 flex-1 flex flex-col items-center justify-center text-center py-16 md:py-20 pb-24">
          <div
            className={`w-full max-w-2xl mx-auto transition-all duration-700 ease-out ${
              mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
          >
            <div className="inline-flex items-center gap-2.5 mb-8">
              <img
                src="/logo.png"
                alt=""
                className="h-11 w-11 sm:h-12 sm:w-12 rounded-xl object-contain bg-white/10 p-1 ring-1 ring-white/15"
              />
              <p className="font-display text-white text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight leading-none">
                DrStethos
              </p>
            </div>

            <h1 className="font-display text-2xl sm:text-3xl md:text-4xl lg:text-[2.65rem] font-semibold leading-[1.2] tracking-tight text-white">
              Healthcare hiring, without the headache.
            </h1>

            <p className="mt-5 text-[15px] sm:text-base text-white leading-relaxed max-w-lg mx-auto font-normal">
              Verified doctors. Trusted hospitals. Roles and talent that actually fit—across India.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3">
              <Button
                size="lg"
                className="text-sm px-8 h-12 rounded-full shadow-lg hover:shadow-xl hover:scale-[1.01] transition-all bg-white text-primary hover:bg-white/95 font-semibold gap-2"
                onClick={() => openLandingPath("doctors")}
              >
                <Stethoscope className="h-4 w-4" />
                I&apos;m a Doctor
                <ArrowRight className="h-4 w-4" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="text-sm px-8 h-12 rounded-full border-white/30 bg-white/5 text-white hover:bg-white/12 hover:text-white font-semibold gap-2 backdrop-blur-sm"
                onClick={() => openLandingPath("hospitals")}
              >
                <Building2 className="h-4 w-4" />
                I&apos;m a Hospital
              </Button>
            </div>

            <div className="mt-10 pt-6 border-t border-white/10 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[12px] sm:text-[13px] text-white/55 font-normal">
              <span>Verified profiles</span>
              <span className="hidden sm:inline text-white/25">·</span>
              <span>In-app interviews</span>
              <span className="hidden sm:inline text-white/25">·</span>
              <span>Direct hiring</span>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={scrollToShowcase}
          className="absolute bottom-5 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-0.5 text-white/50 hover:text-white transition-colors"
          aria-label="Scroll to see the app"
        >
          <span className="text-[10px] font-medium tracking-[0.18em] uppercase">See the app</span>
          <ChevronDown className="w-5 h-5 animate-bounce-soft" />
        </button>
      </section>

      <section
        id="hero-showcase"
        className="relative w-full max-w-[100vw] overflow-x-hidden bg-[hsl(150,42%,16%)]"
      >
        <div
          className="absolute inset-0 pointer-events-none"
          aria-hidden="true"
          style={{
            background:
              "radial-gradient(ellipse 80% 50% at 70% 80%, hsl(142 50% 30% / 0.35), transparent 60%)",
          }}
        />

        <div ref={showcaseRef} className="relative z-10 page-container pt-10 md:pt-12 pb-0">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-10 items-end">
            <div
              className={`pb-10 md:pb-14 transition-all duration-700 ${
                showcaseInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
              }`}
            >
              <h2 className="font-display text-xl sm:text-2xl md:text-[1.85rem] font-semibold text-white tracking-tight leading-snug">
                Hiring that fits in your pocket
              </h2>
              <p className="mt-3 text-sm text-white/70 font-normal leading-relaxed max-w-md">
                One app for discovery, applications, and interviews—built for hospitals and doctors.
              </p>

              <ul className="mt-6 space-y-0 border-t border-white/15 max-w-md">
                {showcasePoints.map((point, index) => {
                  const Icon = point.icon;
                  return (
                    <li
                      key={point.title}
                      className={`flex gap-3 py-3.5 border-b border-white/15 transition-all duration-700 ${
                        showcaseInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
                      }`}
                      style={{ transitionDelay: showcaseInView ? `${120 + index * 80}ms` : "0ms" }}
                    >
                      <div className="mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-white/10">
                        <Icon className="h-4 w-4 text-white" strokeWidth={2} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-white">{point.title}</p>
                        <p className="text-xs text-white/60 font-normal mt-0.5 leading-relaxed">
                          {point.text}
                        </p>
                      </div>
                    </li>
                  );
                })}
              </ul>

              <button
                type="button"
                onClick={() => scrollToId("how-it-works")}
                className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-white/85 hover:text-white transition-colors"
              >
                See how it works
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>

            <div className="relative w-full max-w-md mx-auto lg:max-w-none overflow-hidden">
              <div className="relative mx-auto h-[280px] sm:h-[340px] md:h-[400px] lg:h-[440px] flex items-end justify-center">
                <div
                  className={`absolute bottom-0 left-1/2 w-[46%] max-w-[180px] md:max-w-[210px] transition-all duration-1000 ease-out ${
                    showcaseInView
                      ? "opacity-100 -translate-x-[calc(50%+3.75rem)] sm:-translate-x-[calc(50%+5rem)] md:-translate-x-[calc(50%+5.75rem)] -rotate-[7deg] scale-[0.92]"
                      : "opacity-0 -translate-x-1/2 scale-90"
                  }`}
                  style={{ transitionDelay: showcaseInView ? "200ms" : "0ms" }}
                >
                  <img
                    src="/assets/left.png"
                    alt="DrStethos app — jobs view"
                    className="w-full h-auto object-contain drop-shadow-2xl"
                  />
                </div>

                <div
                  className={`absolute bottom-0 left-1/2 w-[46%] max-w-[180px] md:max-w-[210px] transition-all duration-1000 ease-out ${
                    showcaseInView
                      ? "opacity-100 -translate-x-[calc(50%-3.75rem)] sm:-translate-x-[calc(50%-5rem)] md:-translate-x-[calc(50%-5.75rem)] rotate-[7deg] scale-[0.92]"
                      : "opacity-0 -translate-x-1/2 scale-90"
                  }`}
                  style={{ transitionDelay: showcaseInView ? "200ms" : "0ms" }}
                >
                  <img
                    src="/assets/right.png"
                    alt="DrStethos app — profile view"
                    className="w-full h-auto object-contain drop-shadow-2xl"
                  />
                </div>

                <div
                  className={`relative z-10 w-[52%] max-w-[210px] md:max-w-[250px] transition-all duration-1000 ease-out ${
                    showcaseInView ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-10 scale-95"
                  }`}
                  style={{ transitionDelay: showcaseInView ? "60ms" : "0ms" }}
                >
                  <img
                    src="/assets/center.png"
                    alt="DrStethos app"
                    className="w-full h-auto object-contain drop-shadow-2xl"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Hero;
