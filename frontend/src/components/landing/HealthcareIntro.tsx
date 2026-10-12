import { Reveal, Label } from "./SectionPrimitives";

const HealthcareIntro = () => {
  return (
    <section id="about" data-scene className="bg-[#F6F9F7] scroll-mt-20 py-16 md:py-24">
      <div className="page-container">
        <Reveal>
          <Label>The connection</Label>
        </Reveal>

        <div className="relative mt-4 md:mt-6">
          <div className="grid md:grid-cols-3 gap-8 md:gap-6 items-center">
            <Reveal delay={0.05} className="md:text-right order-1">
              <p className="display-xl text-foreground">
                Hospitals need
                <br />
                the right doctors.
              </p>
            </Reveal>

            {/* True visual center of the connection row */}
            <div className="order-2 flex justify-center items-center min-h-[160px] md:min-h-[190px]">
              <div
                id="steth-anchor-connect"
                className="w-[160px] h-[160px] sm:w-[180px] sm:h-[180px] md:w-[190px] md:h-[190px] shrink-0"
                aria-hidden="true"
              />
            </div>

            <Reveal delay={0.15} className="order-3">
              <p id="connect-text-height" className="display-xl text-foreground">
                Doctors need
                <br />
                the right opportunities.
              </p>
            </Reveal>
          </div>
        </div>

        <Reveal delay={0.2} className="mt-10 max-w-xl">
          <p className="body-lg text-muted-foreground">
            DrStethos brings both sides together—so hiring stays clear, verified, and in one place.
          </p>
        </Reveal>
      </div>
    </section>
  );
};

export default HealthcareIntro;
