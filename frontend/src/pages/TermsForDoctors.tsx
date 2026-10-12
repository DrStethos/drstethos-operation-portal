import { ArrowLeft, Printer, Download, Stethoscope } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const TermsForDoctors = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <Link to="/">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Button>
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="container mx-auto px-4 py-6 md:py-12 max-w-6xl">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <Stethoscope className="h-8 w-8 text-primary" />
              <h1 className="text-3xl sm:text-4xl font-bold">Terms and Conditions for Doctors</h1>
            </div>
            <p className="text-muted-foreground mb-2">Healthcare Professional Terms</p>
            <p className="text-muted-foreground mb-4 sm:mb-6">Effective Date: November 29, 2025</p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => window.print()} title="Print" className="flex-1 sm:flex-none">
              <Printer className="h-4 w-4" />
              <span className="hidden sm:inline ml-2">Print / Save as PDF</span>
              <span className="sm:hidden ml-2">Print</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => window.print()}
              title="Download PDF (use Print -> Save as PDF)"
              className="flex-1 sm:flex-none">
              <Download className="h-4 w-4" />
              <span className="hidden sm:inline ml-2">Download PDF</span>
              <span className="sm:hidden ml-2">Download</span>
            </Button>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Content column (spans 2) */}
          <div className="md:col-span-2">
            <div className="prose prose-gray dark:prose-invert max-w-none space-y-8">

          <section id="introduction">
            <h2 className="text-xl sm:text-2xl font-semibold mb-4">1. Introduction</h2>
            <p className="text-base sm:text-lg">
              Welcome to <strong>DrStethos</strong>. These Terms and Conditions ("Terms") govern your use of our platform as a doctor or healthcare professional ("Doctor," "you," or "your"). By registering, you agree to these Terms.
            </p>
          </section>

          {/* Account Registration */}
          <details id="registration" className="group bg-muted/5 rounded-md p-3 sm:p-4" open>
            <summary className="cursor-pointer list-none outline-none">
              <h2 className="text-xl sm:text-2xl font-semibold inline">2. Account Registration and Eligibility</h2>
              <span className="ml-2 text-sm text-muted-foreground group-open:rotate-180 transition-transform inline-block">▾</span>
            </summary>
            <div className="mt-3 space-y-3">
              <p><strong>2.1</strong> You must provide truthful, up-to-date information during registration.</p>
              <p><strong>2.2</strong> You are responsible for protecting your login credentials and maintaining account security.</p>
              <p><strong>2.3</strong> You confirm holding the necessary medical licenses and certifications to practice in your jurisdiction.</p>
            </div>
          </details>

          {/* Subscription Plans */}
          <details id="subscription" className="group bg-muted/5 rounded-md p-3 sm:p-4" open>
            <summary className="cursor-pointer list-none outline-none">
              <h2 className="text-xl sm:text-2xl font-semibold inline">3. Subscription Plans and Payments</h2>
              <span className="ml-2 text-sm text-muted-foreground group-open:rotate-180 transition-transform inline-block">▾</span>
            </summary>
            <div className="mt-3 space-y-3">
              <p><strong>3.1</strong> You agree to pay for your chosen plan (Basic or Premium) as applicable to your subscription tier.</p>
              <p><strong>3.2</strong> Payments are due per billing cycle (monthly or annual) as selected during subscription.</p>
              <p><strong>3.3</strong> Additional charges may apply for usage beyond plan limits or for optional premium features.</p>
            </div>
          </details>

          {/* Job Applications */}
          <details id="applications" className="group bg-muted/5 rounded-md p-3 sm:p-4" open>
            <summary className="cursor-pointer list-none outline-none">
              <h2 className="text-xl sm:text-2xl font-semibold inline">4. Job Applications and Communication</h2>
              <span className="ml-2 text-sm text-muted-foreground group-open:rotate-180 transition-transform inline-block">▾</span>
            </summary>
            <div className="mt-3 space-y-3">
              <p><strong>4.1</strong> Apply only for jobs matching your qualifications, experience, and medical licensing.</p>
              <p><strong>4.2</strong> Misrepresentation of credentials, experience, or qualifications is strictly prohibited and may result in immediate account termination.</p>
              <p><strong>4.3</strong> All communications with hospitals and recruiters must be professional, respectful, and conducted in good faith.</p>
            </div>
          </details>

          {/* Use of Content and Privacy */}
          <details id="privacy" className="group bg-muted/5 rounded-md p-3 sm:p-4" open>
            <summary className="cursor-pointer list-none outline-none">
              <h2 className="text-xl sm:text-2xl font-semibold inline">5. Use of Content and Privacy</h2>
              <span className="ml-2 text-sm text-muted-foreground group-open:rotate-180 transition-transform inline-block">▾</span>
            </summary>
            <div className="mt-3 space-y-3">
              <p><strong>5.1</strong> You consent to your profile information being used for job matching and recruitment purposes by hospitals and healthcare institutions.</p>
              <p><strong>5.2</strong> Your personal data will be handled in accordance with our{" "}
                <Link to="/privacy-policy" className="text-primary underline">Privacy Policy</Link> and applicable Indian data protection laws.
              </p>
              <p><strong>5.3</strong> You retain ownership of content you upload but grant DrStethos a license to use it for service provision.</p>
            </div>
          </details>

          {/* Suspension and Termination */}
          <details id="termination" className="group bg-muted/5 rounded-md p-3 sm:p-4" open>
            <summary className="cursor-pointer list-none outline-none">
              <h2 className="text-xl sm:text-2xl font-semibold inline">6. Suspension and Termination</h2>
              <span className="ml-2 text-sm text-muted-foreground group-open:rotate-180 transition-transform inline-block">▾</span>
            </summary>
            <div className="mt-3 space-y-3">
              <p><strong>6.1</strong> Violations of these Terms may result in account suspension or termination without prior notice.</p>
              <p><strong>6.2</strong> Upon termination, your access to job search features and platform services will be disabled.</p>
              <p><strong>6.3</strong> You may delete your account at any time by following the account deletion process outlined in our{" "}
                <Link to="/privacy-policy/delete-account" className="text-primary underline">Account Deletion Page</Link>.
              </p>
            </div>
          </details>

          {/* Disclaimers and Liability */}
          <details id="liability" className="group bg-muted/5 rounded-md p-3 sm:p-4" open>
            <summary className="cursor-pointer list-none outline-none">
              <h2 className="text-xl sm:text-2xl font-semibold inline">7. Disclaimers and Limitation of Liability</h2>
              <span className="ml-2 text-sm text-muted-foreground group-open:rotate-180 transition-transform inline-block">▾</span>
            </summary>
            <div className="mt-3 space-y-3">
              <p><strong>7.1</strong> DrStethos does not guarantee job placement, interview opportunities, or employment outcomes. The platform facilitates connections only.</p>
              <p><strong>7.2</strong> DrStethos provides services "as is" without warranties of any kind, express or implied.</p>
              <p><strong>7.3</strong> Our liability to you shall be limited to the total amount of payments you have made to DrStethos in the preceding six (6) months.</p>
              <p><strong>7.4</strong> We are not responsible for the accuracy of job postings or the conduct of hospitals using our platform.</p>
            </div>
          </details>

          {/* Governing Law */}
          <details id="governing-law" className="group bg-muted/5 rounded-md p-3 sm:p-4" open>
            <summary className="cursor-pointer list-none outline-none">
              <h2 className="text-xl sm:text-2xl font-semibold inline">8. Governing Law and Dispute Resolution</h2>
              <span className="ml-2 text-sm text-muted-foreground group-open:rotate-180 transition-transform inline-block">▾</span>
            </summary>
            <div className="mt-3 space-y-3">
              <p><strong>8.1</strong> These Terms shall be governed by and construed in accordance with the laws of India.</p>
              <p><strong>8.2</strong> Any disputes arising from these Terms shall be subject to the exclusive jurisdiction of the courts in Andhra Pradesh, India.</p>
            </div>
          </details>

          {/* Amendments */}
          <details id="amendments" className="group bg-muted/5 rounded-md p-3 sm:p-4" open>
            <summary className="cursor-pointer list-none outline-none">
              <h2 className="text-xl sm:text-2xl font-semibold inline">9. Amendments</h2>
              <span className="ml-2 text-sm text-muted-foreground group-open:rotate-180 transition-transform inline-block">▾</span>
            </summary>
            <div className="mt-3 space-y-3">
              <p><strong>9.1</strong> We may amend these Terms at any time with prior notice posted on the app or sent via email to your registered address.</p>
              <p><strong>9.2</strong> Continued use of the platform after amendments constitutes acceptance of the updated Terms.</p>
            </div>
          </details>

          {/* Acknowledgment */}
          <section id="acknowledgment" className="mt-8 p-4 sm:p-6 bg-primary/10 rounded-lg border-2 border-primary/20">
            <h2 className="text-xl sm:text-2xl font-semibold mb-4">Acknowledgment</h2>
            <p className="text-base sm:text-lg">
              By registering on DrStethos as a healthcare professional, you acknowledge that you have read, understood, and agree to these Terms and Conditions.
            </p>
          </section>

          {/* Contact Information */}
          <section id="contact" className="mt-6 p-4 bg-muted/30 rounded-md border">
            <h3 className="text-lg font-semibold mb-3">Contact Information</h3>
            <p className="mb-2">If you have any questions about these Terms and Conditions, please contact us:</p>
            <div className="space-y-1">
              <p><strong>App Name:</strong> DrStethos</p>
              <p><strong>Developer:</strong> Vishnu Spire LLP</p>
              <p>
                <strong>Email:</strong>{" "}
                <a href="mailto:stethosabhisha@gmail.com" className="text-primary underline">
                  stethosabhisha@gmail.com
                </a>
              </p>
            </div>
          </section>
            </div>
          </div>

          {/* TOC column */}
          <aside className="md:col-span-1 md:sticky md:top-28 md:self-start order-first md:order-last">
            <div className="rounded-md border p-4 bg-background/60 mb-6 md:mb-0">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-3">
                <h3 className="text-sm font-semibold">Contents</h3>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex-1 sm:flex-none"
                    onClick={() => {
                      document.querySelectorAll('details').forEach((d) => (d.open = true));
                    }}>
                    Expand All
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex-1 sm:flex-none"
                    onClick={() => {
                      document.querySelectorAll('details').forEach((d) => (d.open = false));
                    }}>
                    Collapse All
                  </Button>
                </div>
              </div>

              <nav className="text-sm space-y-2">
                <a className="block text-primary hover:underline py-1 transition-colors" href="#introduction">1. Introduction</a>
                <a className="block hover:text-primary py-1 transition-colors" href="#registration">2. Account Registration</a>
                <a className="block hover:text-primary py-1 transition-colors" href="#subscription">3. Subscription Plans</a>
                <a className="block hover:text-primary py-1 transition-colors" href="#applications">4. Job Applications</a>
                <a className="block hover:text-primary py-1 transition-colors" href="#privacy">5. Use of Content & Privacy</a>
                <a className="block hover:text-primary py-1 transition-colors" href="#termination">6. Suspension & Termination</a>
                <a className="block hover:text-primary py-1 transition-colors" href="#liability">7. Disclaimers & Liability</a>
                <a className="block hover:text-primary py-1 transition-colors" href="#governing-law">8. Governing Law</a>
                <a className="block hover:text-primary py-1 transition-colors" href="#amendments">9. Amendments</a>
                <a className="block hover:text-primary py-1 transition-colors" href="#acknowledgment">Acknowledgment</a>
                <a className="block hover:text-primary py-1 transition-colors" href="#contact">Contact Information</a>
              </nav>
            </div>
          </aside>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t mt-16 py-8 bg-muted/30">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-muted-foreground">
            © 2025 DrStethos by Vishnu Spire LLP. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default TermsForDoctors;
