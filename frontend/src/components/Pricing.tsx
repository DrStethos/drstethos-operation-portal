import { Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const hospitalPlans = [
  {
    name: "Silver",
    tagline: "Essential Hiring",
    popular: false,
    monthlyPrice: "3,500",
    yearlyPrice: "33,500",
    features: [
      { name: "Verified Profile Unlocks", value: "50", included: true },
      { name: "Job Posts", value: "2", included: true },
      { name: "Priority Listing", value: "No", included: false },
      { name: "Interview Invites", value: "10", included: true },
      { name: "Shortlist Limit", value: "20", included: true },
      { name: "API Access", value: "No", included: false },
    ],
  },
  {
    name: "Gold",
    tagline: "Growth Accelerated",
    popular: true,
    monthlyPrice: "8,500",
    yearlyPrice: "81,500",
    features: [
      { name: "Verified Profile Unlocks", value: "150", included: true },
      { name: "Job Posts", value: "5", included: true },
      { name: "Priority Listing", value: "Single Boost", included: true },
      { name: "Interview Invites", value: "40", included: true },
      { name: "Shortlist Limit", value: "50", included: true },
      { name: "API Access", value: "No", included: false },
    ],
  },
  {
    name: "Platinum",
    tagline: "Total Talent Command",
    popular: false,
    monthlyPrice: "14,500",
    yearlyPrice: "1,39,000",
    features: [
      { name: "Verified Profile Unlocks", value: "1,000", included: true },
      { name: "Job Posts", value: "30", included: true },
      { name: "Priority Listing", value: "Double Boost", included: true },
      { name: "Interview Invites", value: "Unlimited", included: true },
      { name: "Shortlist Limit", value: "500", included: true },
      { name: "API Access", value: "Yes", included: true },
    ],
  },
];

const doctorPlans = [
  {
    name: "Basic Career",
    tagline: "Get started free",
    popular: false,
    isFree: true,
    priceLabel: "FREE",
    priceSubtext: "No credit card required",
    features: [
      { name: "Verified Profile", value: "Limited", included: true },
      { name: "Featured Profile Status", value: "No", included: false },
      { name: "Job Applications", value: "5/month", included: true },
      { name: "Search Filters", value: "Basic", included: true },
      { name: "Direct Messaging", value: "No", included: false },
      { name: "CV Highlighting", value: "No", included: false },
      { name: "Video Interviewing", value: "No", included: false },
      { name: "Priority Support", value: "No", included: false },
    ],
  },
  {
    name: "Premium Physician",
    tagline: "Maximum Visibility & Tools",
    popular: true,
    isFree: false,
    priceLabel: "499",
    pricePeriod: "for 3 months",
    // 499 for 3 months ≈ ₹166/mo vs ~₹185/mo if billed monthly (~10% less)
    priceSubtext: "₹166/mo equivalent · vs ₹185/mo if billed monthly",
    features: [
      { name: "Verified Profile", value: "Yes (Verified Badge)", included: true },
      { name: "Featured Profile Status", value: "Yes (Top Search Result)", included: true },
      { name: "Job Applications", value: "Unlimited", included: true },
      { name: "Search Filters", value: "Advanced & Niche", included: true },
      { name: "Direct Messaging", value: "Yes", included: true },
      { name: "CV Highlighting", value: "Yes", included: true },
      { name: "Video Interviewing", value: "Yes (Pre-screening)", included: true },
      { name: "Priority Support", value: "Yes", included: true },
    ],
  },
];

const hospitalBenefits = [
  "Direct hiring — keep 100% of first month salary",
  "Verified Credential Badges",
  "Direct Doctor Connect",
  "Automated B2B GST Invoicing",
];

const doctorBenefits = [
  "Keep 100% of your first month salary",
  "Connect directly with hospital HR teams",
  "Instant profile & job notifications",
  "Showcase verified credentials",
];

type Feature = { name: string; value: string; included: boolean };

const FeatureRow = ({ feature }: { feature: Feature }) => (
  <div className="flex items-start gap-2.5 py-2 border-b border-border/60 last:border-0">
    {feature.included ? (
      <Check className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" strokeWidth={2.5} />
    ) : (
      <X className="w-4 h-4 text-muted-foreground/40 flex-shrink-0 mt-0.5" strokeWidth={2} />
    )}
    <div className="flex flex-1 items-baseline justify-between gap-3 min-w-0">
      <span
        className={`text-[13px] font-medium ${
          feature.included ? "text-foreground" : "text-muted-foreground/60"
        }`}
      >
        {feature.name}
      </span>
      <span
        className={`text-[12px] text-right flex-shrink-0 ${
          feature.included ? "text-muted-foreground" : "text-muted-foreground/40"
        }`}
      >
        {feature.value}
      </span>
    </div>
  </div>
);

const BenefitsPanel = ({
  title,
  items,
  note,
}: {
  title: string;
  items: string[];
  note: string;
}) => (
  <div className="mt-10 pt-8 border-t border-border max-w-3xl mx-auto">
    <h4 className="text-sm font-semibold text-foreground mb-3.5">{title}</h4>
    <ul className="grid sm:grid-cols-2 gap-2.5">
      {items.map((item) => (
        <li key={item} className="flex items-start gap-2">
          <Check className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" strokeWidth={2.5} />
          <span className="text-[13px] text-muted-foreground leading-snug">{item}</span>
        </li>
      ))}
    </ul>
    <p className="text-[11px] text-muted-foreground/70 mt-4">{note}</p>
  </div>
);

const Pricing = () => {
  const scrollToContact = () => {
    document.getElementById("get-in-touch")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <section className="section-y bg-white overflow-x-hidden">
      <div className="page-container">
        <div className="max-w-xl mb-10 md:mb-12">
          <h2 className="font-display text-2xl md:text-3xl lg:text-[2.15rem] font-semibold text-foreground mb-3 tracking-tight">
            Clear plans. Simple pricing.
          </h2>
          <p className="text-sm md:text-[15px] text-muted-foreground font-normal leading-relaxed">
            Transparent pricing for hospitals and doctors — upgrade when you need more reach.
          </p>
        </div>

        <Tabs defaultValue="hospitals" className="w-full max-w-5xl">
          <TabsList className="inline-flex h-10 p-1 bg-secondary rounded-full mb-10">
            <TabsTrigger
              value="hospitals"
              className="rounded-full px-5 text-[13px] font-medium data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm"
            >
              For Hospitals
            </TabsTrigger>
            <TabsTrigger
              value="doctors"
              className="rounded-full px-5 text-[13px] font-medium data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm"
            >
              For Doctors
            </TabsTrigger>
          </TabsList>

          <TabsContent value="hospitals" className="mt-0 focus-visible:outline-none">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-0 sm:gap-0 border border-border rounded-2xl overflow-hidden">
              {hospitalPlans.map((plan, index) => (
                <div
                  key={plan.name}
                  className={`relative flex flex-col bg-white p-5 sm:p-6 ${
                    index > 0 ? "border-t sm:border-t-0 sm:border-l border-border" : ""
                  } ${plan.popular ? "bg-secondary/40" : ""}`}
                >
                  {plan.popular && (
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-primary mb-2">
                      Best value
                    </p>
                  )}

                  <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground mb-1">
                    {plan.tagline}
                  </p>
                  <h3 className="text-xl font-semibold text-foreground tracking-tight mb-5">
                    {plan.name}
                  </h3>

                  <div className="mb-5 pb-5 border-b border-border/70">
                    <div className="flex items-baseline gap-1">
                      <span className="text-[2rem] font-semibold text-foreground tracking-tight leading-none">
                        ₹{plan.monthlyPrice}
                      </span>
                      <span className="text-[13px] text-muted-foreground">/month</span>
                    </div>
                    <p className="text-[12px] text-muted-foreground mt-2">
                      ₹{plan.yearlyPrice}/year · ~20% less than 12× monthly
                    </p>
                  </div>

                  <div className="flex-1 mb-6">
                    {plan.features.map((feature) => (
                      <FeatureRow key={feature.name} feature={feature} />
                    ))}
                  </div>

                  <Button
                    onClick={scrollToContact}
                    className={`w-full h-11 rounded-full text-[13px] font-medium ${
                      plan.popular ? "bg-primary hover:bg-primary/90" : ""
                    }`}
                    variant={plan.popular ? "default" : "outline"}
                  >
                    Get Started
                  </Button>
                </div>
              ))}
            </div>

            <BenefitsPanel
              title="Included with hospital plans"
              items={hospitalBenefits}
              note="*Yearly price is ~20% below 12 months of the monthly rate. Prices inclusive of taxes."
            />
          </TabsContent>

          <TabsContent value="doctors" className="mt-0 focus-visible:outline-none">
            <div className="grid sm:grid-cols-2 gap-0 border border-border rounded-2xl overflow-hidden max-w-3xl">
              {doctorPlans.map((plan, index) => (
                <div
                  key={plan.name}
                  className={`relative flex flex-col bg-white p-5 sm:p-6 ${
                    index > 0 ? "border-t sm:border-t-0 sm:border-l border-border" : ""
                  } ${plan.popular ? "bg-secondary/40" : ""}`}
                >
                  {plan.popular && (
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-primary mb-2">
                      Recommended
                    </p>
                  )}

                  <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground mb-1">
                    {plan.tagline}
                  </p>
                  <h3 className="text-xl font-semibold text-foreground tracking-tight mb-5">
                    {plan.name}
                  </h3>

                  <div className="mb-5 pb-5 border-b border-border/70">
                    {plan.isFree ? (
                      <>
                        <span className="text-[2rem] font-semibold text-foreground tracking-tight leading-none">
                          {plan.priceLabel}
                        </span>
                        <p className="text-[12px] text-muted-foreground mt-2">{plan.priceSubtext}</p>
                      </>
                    ) : (
                      <>
                        <div className="flex items-baseline gap-1.5 flex-wrap">
                          <span className="text-[2rem] font-semibold text-foreground tracking-tight leading-none">
                            ₹{plan.priceLabel}
                          </span>
                          <span className="text-[13px] text-muted-foreground">{plan.pricePeriod}</span>
                        </div>
                        <p className="text-[12px] text-muted-foreground mt-2">{plan.priceSubtext}</p>
                      </>
                    )}
                  </div>

                  <div className="flex-1 mb-6">
                    {plan.features.map((feature) => (
                      <FeatureRow key={feature.name} feature={feature} />
                    ))}
                  </div>

                  <Button
                    onClick={scrollToContact}
                    className={`w-full h-11 rounded-full text-[13px] font-medium ${
                      plan.popular ? "bg-primary hover:bg-primary/90" : ""
                    }`}
                    variant={plan.popular ? "default" : "outline"}
                  >
                    {plan.isFree ? "Start Free" : "Get Premium"}
                  </Button>
                </div>
              ))}
            </div>

            <BenefitsPanel
              title="Why doctors choose DrStethos"
              items={doctorBenefits}
              note="*Premium package price is for the full 3-month term. Prices inclusive of taxes."
            />
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
};

export default Pricing;
