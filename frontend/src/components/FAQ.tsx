import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    q: "How does billing work for hospitals?",
    a: "Hospitals choose Silver, Gold, or Platinum with monthly or yearly billing. Yearly plans are about 20% less than paying month-to-month. Invoices include GST for B2B accounts.",
  },
  {
    q: "How are doctors and hospitals verified?",
    a: "Profiles go through document checks (licenses, certificates, facility details) before full access. Admins review incomplete submissions and request missing documents when needed.",
  },
  {
    q: "Can we interview inside the app?",
    a: "Yes. Hospitals can invite shortlisted doctors to in-app video interviews so scheduling and follow-up stay in one place—no external meeting tools required.",
  },
  {
    q: "When will the mobile apps launch?",
    a: "iOS and Android store links will go live at launch. Use Get in touch to request a notify-me note; we will reach out when downloads open.",
  },
  {
    q: "Is there a free plan for doctors?",
    a: "Yes. Basic Career is free with limited applications. Premium Physician unlocks unlimited applications, featured visibility, messaging, and video interviewing for a fixed 3-month package.",
  },
];

const FAQ = () => {
  return (
    <section id="faq" className="section-y bg-white overflow-x-hidden scroll-mt-16">
      <div className="page-container">
        <div className="grid lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] gap-10 lg:gap-16 items-start">
          <div>
            <h2 className="font-display text-2xl md:text-3xl lg:text-[2.15rem] font-semibold text-foreground tracking-tight">
              Questions, answered
            </h2>
            <p className="mt-3 text-sm md:text-[15px] text-muted-foreground max-w-md font-normal leading-relaxed">
              Billing, verification, interviews, and launch—short answers for hospitals and doctors.
            </p>
          </div>

          <Accordion type="single" collapsible className="w-full border-t border-border/80">
            {faqs.map((item) => (
              <AccordionItem key={item.q} value={item.q} className="border-border/80">
                <AccordionTrigger className="text-left text-[15px] font-medium text-foreground hover:no-underline py-4">
                  {item.q}
                </AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground leading-relaxed font-normal pb-4">
                  {item.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
