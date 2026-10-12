import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { scrollToId } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { Reveal, Label } from "./SectionPrimitives";

const hospitalPlans = [
  {
    name: "Silver",
    popular: false,
    monthlyPrice: "3,500",
    yearlyPrice: "33,500",
    highlights: [
      "50 verified profile unlocks",
      "2 job posts",
      "10 interview invites",
      "20 shortlist limit",
    ],
  },
  {
    name: "Gold",
    popular: true,
    monthlyPrice: "8,500",
    yearlyPrice: "81,500",
    highlights: [
      "150 verified profile unlocks",
      "5 job posts",
      "Priority listing boost",
      "40 interview invites",
      "50 shortlist limit",
    ],
  },
  {
    name: "Platinum",
    popular: false,
    monthlyPrice: "14,500",
    yearlyPrice: "1,39,000",
    highlights: [
      "1,000 verified profile unlocks",
      "30 job posts",
      "Double priority boost",
      "Unlimited interview invites",
      "API access",
    ],
  },
];

const doctorPlans = [
  {
    name: "Basic Career",
    popular: false,
    isFree: true,
    price: "FREE",
    sub: "No credit card required",
    highlights: ["Limited verified profile", "5 applications / month", "Basic search filters"],
  },
  {
    name: "Premium Physician",
    popular: true,
    isFree: false,
    price: "₹499",
    sub: "for 3 months · ₹166/mo equivalent",
    highlights: [
      "Verified badge",
      "Unlimited applications",
      "Featured profile",
      "Direct messaging",
      "Video interviewing",
    ],
  },
];

const PricingSection = () => {
  const contact = () => scrollToId("get-in-touch", 72);

  return (
    <section id="pricing" data-scene className="bg-[#F6F9F7] overflow-x-hidden scroll-mt-20 py-16 md:py-24">
      <div className="page-container">
        <Reveal className="max-w-xl mb-10">
          <Label>Pricing</Label>
          <h2 className="display-xl text-foreground">Clear plans. Simple pricing.</h2>
          <p className="body-lg text-muted-foreground mt-3">
            Transparent hospital and doctor plans—upgrade when you need more reach.
          </p>
        </Reveal>

        <Tabs defaultValue="hospitals">
          <TabsList className="h-10 p-1 bg-white rounded-full mb-8 border border-black/5">
            <TabsTrigger
              value="hospitals"
              className="rounded-full px-5 text-sm data-[state=active]:bg-primary data-[state=active]:text-white"
            >
              Hospitals
            </TabsTrigger>
            <TabsTrigger
              value="doctors"
              className="rounded-full px-5 text-sm data-[state=active]:bg-primary data-[state=active]:text-white"
            >
              Doctors
            </TabsTrigger>
          </TabsList>

          <TabsContent value="hospitals" className="mt-0">
            <div className="grid md:grid-cols-3 gap-4" data-reveal-stagger>
              {hospitalPlans.map((plan) => (
                <div
                  key={plan.name}
                  className={cn(
                    "flex h-full flex-col p-7 md:p-8",
                    plan.popular ? "bg-[hsl(150,42%,11%)] text-white" : "bg-white text-foreground"
                  )}
                >
                  {plan.popular && (
                    <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-white/45 mb-3">
                      Recommended
                    </p>
                  )}
                  <h3 className="text-xl font-semibold tracking-tight">{plan.name}</h3>
                  <div className="mt-5 mb-1">
                    <span className="text-3xl md:text-4xl font-semibold tracking-tight">
                      ₹{plan.monthlyPrice}
                    </span>
                    <span
                      className={cn(
                        "ml-1.5 text-sm",
                        plan.popular ? "text-white/50" : "text-muted-foreground"
                      )}
                    >
                      /mo
                    </span>
                  </div>
                  <p
                    className={cn(
                      "text-xs mb-6",
                      plan.popular ? "text-white/45" : "text-muted-foreground"
                    )}
                  >
                    ₹{plan.yearlyPrice}/yr · ~20% less yearly
                  </p>
                  <ul className="flex-1 space-y-2.5 mb-8">
                    {plan.highlights.map((h) => (
                      <li key={h} className="flex gap-2.5 text-sm leading-snug">
                        <Check
                          className={cn(
                            "h-4 w-4 mt-0.5 flex-shrink-0",
                            plan.popular ? "text-emerald-300" : "text-primary"
                          )}
                          strokeWidth={2.5}
                        />
                        {h}
                      </li>
                    ))}
                  </ul>
                  <Button
                    onClick={contact}
                    className={cn(
                      "w-full h-11 rounded-full text-sm font-semibold",
                      plan.popular
                        ? "bg-white text-primary hover:bg-white/95"
                        : "bg-primary text-white hover:bg-primary/90"
                    )}
                  >
                    Get Started
                  </Button>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="doctors" className="mt-0">
            <div className="grid sm:grid-cols-2 gap-4 max-w-2xl" data-reveal-stagger>
              {doctorPlans.map((plan) => (
                <div
                  key={plan.name}
                  className={cn(
                    "flex h-full flex-col p-7 md:p-8",
                    plan.popular ? "bg-[hsl(150,42%,11%)] text-white" : "bg-white"
                  )}
                >
                  <h3 className="text-xl font-semibold tracking-tight">{plan.name}</h3>
                  <div className="mt-5 mb-1">
                    <span className="text-3xl md:text-4xl font-semibold tracking-tight">{plan.price}</span>
                  </div>
                  <p
                    className={cn(
                      "text-xs mb-6",
                      plan.popular ? "text-white/45" : "text-muted-foreground"
                    )}
                  >
                    {plan.sub}
                  </p>
                  <ul className="flex-1 space-y-2.5 mb-8">
                    {plan.highlights.map((h) => (
                      <li key={h} className="flex gap-2.5 text-sm">
                        <Check
                          className={cn(
                            "h-4 w-4 mt-0.5",
                            plan.popular ? "text-emerald-300" : "text-primary"
                          )}
                          strokeWidth={2.5}
                        />
                        {h}
                      </li>
                    ))}
                  </ul>
                  <Button
                    onClick={contact}
                    className={cn(
                      "w-full h-11 rounded-full text-sm font-semibold",
                      plan.popular
                        ? "bg-white text-primary hover:bg-white/95"
                        : "bg-primary text-white"
                    )}
                  >
                    {plan.isFree ? "Start Free" : "Get Premium"}
                  </Button>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
};

export default PricingSection;
