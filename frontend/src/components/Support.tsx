import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label as FormLabel } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Mail } from "lucide-react";
import { sendSupportContact } from "@/helpers/supportEmailHelper";
import { Reveal, Label } from "@/components/landing/SectionPrimitives";

const SUPPORT_EMAIL = "support@drstethos.com";

const Support = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await sendSupportContact({
        name: name.trim(),
        email: email.trim(),
        message: message.trim(),
      });
      toast({
        title: "Message sent",
        description: "We'll get back to you as soon as possible.",
      });
      setName("");
      setEmail("");
      setMessage("");
    } catch {
      toast({
        title: "Failed to send",
        description: `Please try again or email ${SUPPORT_EMAIL}`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="bg-[#F6F9F7] overflow-x-hidden py-16 md:py-24">
      <div className="page-container">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16">
          <Reveal>
            <Label>Contact</Label>
            <h2 className="display-xl text-foreground">Get in touch</h2>
            <p className="body-lg text-muted-foreground mt-4 max-w-md">
              Questions about hiring or jobs? We typically reply within one business day.
            </p>
            <div className="mt-10 space-y-5 text-[15px]">
              <div>
                <p className="font-medium text-foreground">Email</p>
                <a href={`mailto:${SUPPORT_EMAIL}`} className="text-muted-foreground hover:text-primary">
                  {SUPPORT_EMAIL}
                </a>
              </div>
              <div>
                <p className="font-medium text-foreground">Phone</p>
                <a href="tel:+917075355969" className="text-muted-foreground hover:text-primary">
                  +91 70753 55969
                </a>
              </div>
              <div>
                <p className="font-medium text-foreground">Office</p>
                <p className="text-muted-foreground leading-relaxed">
                  DRSTETHOS INNOVATIONS LLP, Bhimavaram, Andhra Pradesh, 534201
                </p>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <FormLabel htmlFor="name">Name</FormLabel>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="h-12 rounded-none border-black/10 bg-white"
                />
              </div>
              <div className="space-y-2">
                <FormLabel htmlFor="email">Email</FormLabel>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-12 rounded-none border-black/10 bg-white"
                />
              </div>
              <div className="space-y-2">
                <FormLabel htmlFor="message">Message</FormLabel>
                <Textarea
                  id="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                  rows={5}
                  className="rounded-none border-black/10 bg-white resize-none"
                />
              </div>
              <Button type="submit" disabled={isLoading} className="h-12 rounded-full px-8 text-base font-semibold">
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Mail className="mr-2 h-4 w-4" />
                    Send message
                  </>
                )}
              </Button>
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  );
};

export default Support;
