import { Button } from "@/components/ui/button";
import { Bell } from "lucide-react";
import { useInView } from "@/hooks/use-in-view";
import { scrollToId } from "@/lib/motion";

const AppDownload = () => {
  const [ref, inView] = useInView<HTMLElement>({ threshold: 0.15 });

  return (
    <section ref={ref} className="section-y gradient-medical overflow-x-hidden">
      <div className="page-container">
        <div
          className={`max-w-2xl mx-auto text-center text-white space-y-5 transition-all duration-700 ${
            inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
          }`}
        >
          <h2 className="font-display text-2xl md:text-3xl lg:text-[2.15rem] font-semibold tracking-tight">
            Your healthcare career, in your pocket
          </h2>
          <p className="text-sm md:text-[15px] text-white/85 leading-relaxed font-normal">
            Manage shifts, apply faster, and stay connected anywhere. Store links go live at launch.
          </p>
          <Button
            size="lg"
            variant="secondary"
            className="text-sm h-11 px-6 rounded-full shadow-md gap-2 font-semibold"
            onClick={() => scrollToId("get-in-touch")}
          >
            <Bell className="h-4 w-4" />
            Notify me at launch
          </Button>
          <p className="text-xs text-white/55 font-normal">App Store and Google Play coming soon</p>
        </div>
      </div>
    </section>
  );
};

export default AppDownload;
