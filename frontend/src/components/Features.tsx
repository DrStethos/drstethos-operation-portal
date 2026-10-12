import { Zap, Shield, FileCheck, Bell } from "lucide-react";
import { Card } from "@/components/ui/card";

const features = [
  {
    icon: Zap,
    title: "Smart Job Matching",
    description: "AI-powered algorithm matches your skills and preferences with the perfect hospital opportunities instantly."
  },
  {
    icon: Shield,
    title: "Verified Hospitals",
    description: "All partner hospitals are thoroughly verified and credentialed for your peace of mind and safety."
  },
  {
    icon: FileCheck,
    title: "Digital Credentials",
    description: "Upload and manage your certifications, licenses, and qualifications in one secure digital profile."
  },
  {
    icon: Bell,
    title: "Instant Notifications",
    description: "Get real-time alerts for matching opportunities, shift availabilities, and hospital responses."
  }
];

const Features = () => {
  return (
    <section className="py-20 bg-gradient-subtle">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl lg:text-5xl font-bold text-foreground">
            Powerful Features for Modern Healthcare
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Everything you need to find your perfect medical position or hire top healthcare talent
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card
                key={index}
                className="p-8 hover:shadow-medical transition-all duration-300 hover:-translate-y-2 border-2 bg-card"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="mb-6 w-16 h-16 rounded-2xl gradient-medical flex items-center justify-center">
                  <Icon className="h-8 w-8 text-white" strokeWidth={2} />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-card-foreground">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Features;
