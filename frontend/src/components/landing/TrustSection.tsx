import { Reveal, Label } from "./SectionPrimitives";

const benefits = [
  { n: "01", title: "Professional profiles", text: "Credential-checked doctors and verified facilities." },
  { n: "02", title: "Smarter discovery", text: "Clear openings with the details that matter." },
  { n: "03", title: "Simplified applications", text: "Apply, shortlist, and follow up in one flow." },
  { n: "04", title: "Connected hiring", text: "Interviews and status without switching tools." },
];

const TrustSection = () => {
  return (
    <section
      id="why-drstethos"
      data-scene
      className="relative z-10 bg-white overflow-x-hidden py-16 md:py-24"
    >
      <div className="page-container relative">
        <div
          id="steth-anchor-why-mid"
          className="pointer-events-none absolute left-1/2 top-[55%] -translate-x-1/2 w-8 h-8"
          aria-hidden="true"
        />

        <Reveal className="max-w-2xl mb-10 md:mb-12">
          <Label>Why DrStethos</Label>
          <h2 className="display-xl text-foreground">Built for modern healthcare hiring.</h2>
        </Reveal>

        {/* Stethoscope column stretches to full two-row points height */}
        <div className="relative flex flex-col lg:flex-row lg:items-stretch gap-8 lg:gap-10">
          <div
            id="why-points-grid"
            className="grid sm:grid-cols-2 gap-x-12 gap-y-10 max-w-3xl flex-1"
            data-reveal-stagger
          >
            {benefits.map((b) => (
              <div key={b.n}>
                <p className="text-xs font-semibold text-primary/50 tracking-widest mb-2">{b.n}</p>
                <h3 className="text-lg md:text-xl font-semibold tracking-tight text-foreground">
                  {b.title}
                </h3>
                <p className="mt-2 text-[15px] text-muted-foreground leading-relaxed max-w-sm">{b.text}</p>
              </div>
            ))}
          </div>

          <div className="relative shrink-0 w-full max-w-[280px] sm:max-w-[300px] lg:w-[280px] xl:w-[320px] mx-auto lg:mx-0 self-stretch min-h-[220px]">
            <div
              id="steth-anchor-why"
              className="pointer-events-none absolute inset-0"
              aria-hidden="true"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustSection;
