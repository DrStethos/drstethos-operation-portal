import { useInView } from "@/hooks/use-in-view";

const checklist = [
  "Jobs, applications, and interviews in one digital flow",
  "Verified hospitals and credential-checked doctors",
  "Built for real staffing needs—not recruiter theatre",
];

const AboutUs = () => {
  const [ref, inView] = useInView<HTMLElement>({ threshold: 0.12 });

  return (
    <section ref={ref} className="section-y bg-white overflow-x-hidden">
      <div className="page-container">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-14 items-center">
          <div
            className={`space-y-5 transition-all duration-700 ${
              inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
            }`}
          >
            <h2 className="font-display text-2xl md:text-3xl lg:text-[2.35rem] font-semibold text-foreground tracking-tight leading-tight">
              Built for modern healthcare hiring
            </h2>
            <p className="text-sm md:text-[15px] text-muted-foreground font-normal leading-relaxed max-w-md">
              DrStethos bridges hospitals and healthcare professionals so staffing moves faster,
              stays transparent, and stays in one place.
            </p>
            <p className="text-sm md:text-[15px] text-foreground/80 font-normal leading-relaxed max-w-md">
              Hospitals post and manage roles. Doctors discover verified openings and apply in a
              tap. Interviews happen inside the platform—without the agency maze.
            </p>

            <ul className="space-y-0 border-t border-border max-w-md pt-1">
              {checklist.map((item) => (
                <li
                  key={item}
                  className="flex gap-3 py-3 border-b border-border text-sm text-foreground/85 font-normal leading-relaxed"
                >
                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div
            className={`transition-all duration-700 delay-100 ${
              inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
            }`}
          >
            <div className="relative rounded-2xl overflow-hidden">
              <img
                src="/assets/hero-hiring.png"
                alt="Healthcare professionals collaborating on hiring"
                className="w-full h-[280px] sm:h-[340px] lg:h-[380px] object-cover"
              />
              <div className="absolute bottom-4 left-4 flex items-center gap-2 rounded-xl bg-white/95 px-2.5 py-2 shadow-md border border-white/80">
                <img src="/logo.png" alt="DrStethos" className="h-8 w-8 rounded-lg object-contain" />
                <span className="pr-1 text-sm font-semibold text-foreground tracking-tight">
                  DrStethos
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;
