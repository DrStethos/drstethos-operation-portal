import { Card } from "@/components/ui/card";
import { Quote } from "lucide-react";

const testimonials = [
  {
    name: "Dr. Sarah Mitchell",
    role: "Cardiologist",
    content: "This platform transformed my career search. Within days, I found multiple hospitals offering exactly the shifts I wanted. The credential verification process was seamless.",
    rating: 5
  },
  {
    name: "James Robertson",
    role: "HR Director, City General Hospital",
    content: "We reduced our hiring time by 60%. The quality of candidates is exceptional, and the platform makes scheduling and communication effortless.",
    rating: 5
  },
  {
    name: "Dr. Priya Sharma",
    role: "Emergency Medicine Physician",
    content: "As a locum doctor, this app is essential. I manage all my shifts, credentials, and communication with facilities in one place. Absolutely recommended.",
    rating: 5
  }
];

const Testimonials = () => {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl lg:text-5xl font-bold text-foreground">
            Trusted by Healthcare Professionals
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            See what doctors and hospitals say about our platform
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <Card
              key={index}
              className="p-8 bg-card hover:shadow-medical transition-all duration-300 relative"
            >
              <Quote className="h-10 w-10 text-primary/20 absolute top-6 right-6" />

              <div className="space-y-4">
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>

                <p className="text-muted-foreground leading-relaxed italic">
                  "{testimonial.content}"
                </p>

                <div className="pt-4 border-t">
                  <p className="font-semibold text-foreground">{testimonial.name}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
