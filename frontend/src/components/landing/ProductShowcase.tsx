import { Label } from "./SectionPrimitives";
import {
  DoctorHomeScreen,
  DoctorJobDetailsScreen,
  HospitalHomeScreen,
} from "./AppPhoneScreens";

const features = [
  "Professional profiles",
  "Job discovery",
  "One-tap applications",
  "Application tracking",
  "In-app chat",
  "Verified credentials",
  "Hospital hiring tools",
  "Interview scheduling",
];

const ProductShowcase = () => {
  const loop = [...features, ...features];

  return (
    <section
      id="product"
      className="relative z-20 bg-[#F6F9F7] overflow-x-hidden py-16 md:py-24"
    >
      <div
        id="steth-anchor-under-product"
        className="pointer-events-none absolute left-1/2 bottom-2 -translate-x-1/2 w-[160px] h-[120px] sm:w-[200px] sm:h-[140px] z-0"
        aria-hidden="true"
      />

      <div className="page-container mb-8 md:mb-10 relative z-10">
        <div className="max-w-2xl">
          <Label>Mobile app</Label>
          <h2 className="display-xl text-foreground">
            Everything you need to manage healthcare hiring—on your phone.
          </h2>
          <p className="body-lg text-muted-foreground mt-4 max-w-lg">
            DrStethos is a mobile app for doctors and hospitals. Discover roles, post openings,
            apply, and hire—without a web dashboard.
          </p>
        </div>
      </div>

      <div className="relative z-10 mb-10 md:mb-12 overflow-hidden border-y border-black/5 py-4">
        <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-[#F6F9F7] to-transparent z-10" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-[#F6F9F7] to-transparent z-10" />
        <div className="flex w-max animate-marquee gap-10 whitespace-nowrap will-change-transform">
          {loop.map((f, i) => (
            <span
              key={`${f}-${i}`}
              className="inline-flex items-center gap-3 text-sm font-medium text-foreground/70"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-primary/70" />
              {f}
            </span>
          ))}
        </div>
      </div>

      <div className="page-container relative z-10">
        <div className="relative mx-auto flex items-end justify-center max-w-3xl min-h-[420px] sm:min-h-[480px] md:min-h-[520px]">
          <div
            className="absolute left-[4%] sm:left-[8%] bottom-2 z-[1] origin-bottom opacity-95 hidden sm:block"
            style={{ transform: "rotate(-6deg) translateY(12px) scale(0.92)" }}
          >
            <HospitalHomeScreen className="w-[200px] sm:w-[230px] md:w-[250px]" />
          </div>

          <div className="relative z-[3] -mb-1">
            <DoctorHomeScreen className="w-[230px] sm:w-[260px] md:w-[280px]" />
          </div>

          <div
            className="absolute right-[4%] sm:right-[8%] bottom-2 z-[2] origin-bottom opacity-95 hidden sm:block"
            style={{ transform: "rotate(6deg) translateY(18px) scale(0.92)" }}
          >
            <DoctorJobDetailsScreen className="w-[200px] sm:w-[230px] md:w-[250px]" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductShowcase;
