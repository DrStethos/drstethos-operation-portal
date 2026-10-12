import { Button } from "@/components/ui/button";
import { scrollToId } from "@/lib/motion";
import { Reveal, Label } from "./SectionPrimitives";

const points = [
  "Discover verified openings",
  "Build a trusted profile",
  "Apply and track progress",
];

const DoctorExperience = () => {
  return (
    <section
      id="for-doctors"
      data-scene
      className="relative z-10 bg-[#F6F9F7] overflow-x-hidden scroll-mt-20 py-14 md:py-20"
    >
      <div className="page-container">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          <Reveal className="lg:col-span-5">
            <Label>For doctors</Label>
            <h2 className="display-xl text-foreground">
              Your next opportunity
              <br />
              is closer than you think.
            </h2>
            <p className="body-lg text-muted-foreground mt-4 max-w-md">
              Discover roles, present your credentials, apply, and interview—without the recruiter
              maze.
            </p>

            <div className="mt-8 max-w-sm border-t border-black/10">
              {points.map((line, i) => (
                <p
                  key={line}
                  className="flex gap-3 text-[15px] text-foreground/90 font-medium py-4 border-b border-black/10"
                >
                  <span className="text-primary/60 tabular-nums text-sm font-semibold">0{i + 1}</span>
                  {line}
                </p>
              ))}
            </div>

            <Button
              className="mt-8 h-11 rounded-full px-6 text-sm font-semibold"
              onClick={() => scrollToId("get-in-touch", 72)}
            >
              Get started as a doctor
            </Button>
          </Reveal>

          <Reveal delay={0.08} className="lg:col-span-7 relative">
            <div className="relative overflow-hidden rounded-2xl bg-[#E8F0EB] aspect-[4/5] sm:aspect-[5/4] max-h-[480px]">
              <img
                data-parallax="18"
                src="/assets/editorial-doctor.jpg"
                alt="Doctor using DrStethos"
                className="absolute inset-0 h-full w-full object-cover object-top"
              />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
};

export default DoctorExperience;
