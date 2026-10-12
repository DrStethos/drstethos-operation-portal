import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Reveal, Label } from "./SectionPrimitives";

const faqs = [
  {
    q: "How does billing work for hospitals?",
    a: "Hospitals choose Silver, Gold, or Platinum with monthly or yearly billing. Yearly plans are about 20% less than paying month-to-month. Invoices include GST for B2B accounts.",
  },
  {
    q: "How are doctors and hospitals verified?",
    a: "Profiles go through document checks before full access. Admins review incomplete submissions and request missing documents when needed.",
  },
  {
    q: "Can we interview inside the app?",
    a: "Yes. Hospitals can invite shortlisted doctors to in-app video interviews so scheduling stays in one place.",
  },
  {
    q: "When will the mobile apps launch?",
    a: "Store links go live at launch. Use Get in touch to request a notify-me note.",
  },
  {
    q: "Is there a free plan for doctors?",
    a: "Yes. Basic Career is free with limited applications. Premium Physician unlocks unlimited applications and enhanced tools for a fixed 3-month package.",
  },
];

const FAQSection = () => {
  return (
    <section id="faq" data-scene className="bg-white overflow-x-hidden scroll-mt-20 py-16 md:py-24">
      <div className="page-container">
        <div className="grid lg:grid-cols-[0.9fr_1.1fr] gap-10 lg:gap-16">
          <Reveal>
            <Label>FAQ</Label>
            <h2 className="display-xl text-foreground">
              Questions,
              <br />
              answered.
            </h2>
          </Reveal>

          <Reveal delay={0.06}>
            <Accordion type="single" collapsible className="w-full border-t border-black/10">
              {faqs.map((item) => (
                <AccordionItem key={item.q} value={item.q} className="border-black/10">
                  <AccordionTrigger className="text-left text-base md:text-lg font-medium hover:no-underline py-4 tracking-tight">
                    {item.q}
                  </AccordionTrigger>
                  <AccordionContent className="body-lg text-muted-foreground pb-4 pr-2">
                    {item.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </Reveal>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
