import { ArrowLeft, Printer, Download, Building2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const TermsForHospitals = () => {
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
              <Building2 className="h-8 w-8 text-primary" />
              <h1 className="text-3xl sm:text-4xl font-bold">Terms and Conditions for Hospitals</h1>
            </div>
            <p className="text-muted-foreground mb-2">Recruitment Platform Terms</p>
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
              Welcome to <strong>DrStethos</strong>. These Terms and Conditions ("Terms") govern your use of our recruitment platform as a hospital or healthcare institution ("Hospital," "you," or "your"). By registering and using our services, you agree to comply with and be bound by these Terms.
            </p>
          </section>

          {/* Account Registration */}
          <details id="registration" className="group bg-muted/5 rounded-md p-3 sm:p-4" open>
            <summary className="cursor-pointer list-none outline-none">
              <h2 className="text-xl sm:text-2xl font-semibold inline">2. Account Registration and Eligibility</h2>
              <span className="ml-2 text-sm text-muted-foreground group-open:rotate-180 transition-transform inline-block">▾</span>
            </summary>
            <div className="mt-3 space-y-3">
              <p><strong>2.1</strong> You agree to provide accurate and complete information during registration.</p>
              <p><strong>2.2</strong> You are responsible for maintaining the confidentiality of your login credentials.</p>
              <p><strong>2.3</strong> You represent that you are legally authorized to enter into this agreement on behalf of your organization.</p>
            </div>
          </details>

          {/* Subscription Plans */}
          <details id="subscription" className="group bg-muted/5 rounded-md p-3 sm:p-4" open>
            <summary className="cursor-pointer list-none outline-none">
              <h2 className="text-xl sm:text-2xl font-semibold inline">3. Subscription Plans and Payments</h2>
              <span className="ml-2 text-sm text-muted-foreground group-open:rotate-180 transition-transform inline-block">▾</span>
            </summary>
            <div className="mt-3 space-y-3">
              <p><strong>3.1</strong> You agree to pay subscription fees for the selected plan (Silver, Gold, Platinum) as described on our platform.</p>
              <p><strong>3.2</strong> Subscription payments must be made in advance according to the billing cycle you select (monthly or annual).</p>
              <p><strong>3.3</strong> Renewal will be automatic unless cancelled as per cancellation policy outlined on the app.</p>
              <p><strong>3.4</strong> Additional charges apply for usage beyond plan limits or for optional add-ons.</p>
            </div>
          </details>

          {/* Job Postings */}
          <details id="job-postings" className="group bg-muted/5 rounded-md p-3 sm:p-4" open>
            <summary className="cursor-pointer list-none outline-none">
              <h2 className="text-xl sm:text-2xl font-semibold inline">4. Job Postings and Candidate Access</h2>
              <span className="ml-2 text-sm text-muted-foreground group-open:rotate-180 transition-transform inline-block">▾</span>
            </summary>
            <div className="mt-3 space-y-3">
              <p><strong>4.1</strong> Job posts must comply with applicable laws and not contain discriminatory or fraudulent content.</p>
              <p><strong>4.2</strong> You may post jobs and access candidate profiles according to your subscription tier limits.</p>
              <p><strong>4.3</strong> Candidate information accessed through the platform must be used only for recruitment purposes and treated confidentially.</p>
            </div>
          </details>

          {/* Use of Platform */}
          <details id="platform-use" className="group bg-muted/5 rounded-md p-3 sm:p-4" open>
            <summary className="cursor-pointer list-none outline-none">
              <h2 className="text-xl sm:text-2xl font-semibold inline">5. Use of the Platform</h2>
              <span className="ml-2 text-sm text-muted-foreground group-open:rotate-180 transition-transform inline-block">▾</span>
            </summary>
            <div className="mt-3 space-y-3">
              <p><strong>5.1</strong> You agree not to use the platform for any unlawful or unauthorized purpose.</p>
              <p><strong>5.2</strong> You shall not interfere with the platform's operation or compromise its security.</p>
            </div>
          </details>

          {/* Intellectual Property */}
          <details id="intellectual-property" className="group bg-muted/5 rounded-md p-3 sm:p-4" open>
            <summary className="cursor-pointer list-none outline-none">
              <h2 className="text-xl sm:text-2xl font-semibold inline">6. Intellectual Property</h2>
              <span className="ml-2 text-sm text-muted-foreground group-open:rotate-180 transition-transform inline-block">▾</span>
            </summary>
            <div className="mt-3 space-y-3">
              <p><strong>6.1</strong> Content you upload remains your property, but you grant DrStethos a license to use it for service provision.</p>
              <p><strong>6.2</strong> DrStethos owns all rights to the platform and software provided.</p>
            </div>
          </details>

          {/* Suspension and Termination */}
          <details id="termination" className="group bg-muted/5 rounded-md p-3 sm:p-4" open>
            <summary className="cursor-pointer list-none outline-none">
              <h2 className="text-xl sm:text-2xl font-semibold inline">7. Suspension and Termination</h2>
              <span className="ml-2 text-sm text-muted-foreground group-open:rotate-180 transition-transform inline-block">▾</span>
            </summary>
            <div className="mt-3 space-y-3">
              <p><strong>7.1</strong> We reserve the right to suspend or terminate accounts violating these Terms without prior notice.</p>
              <p><strong>7.2</strong> Upon termination, your access to the platform will cease, but accrued fees remain payable.</p>
            </div>
          </details>

          {/* Limitation of Liability */}
          <details id="liability" className="group bg-muted/5 rounded-md p-3 sm:p-4" open>
            <summary className="cursor-pointer list-none outline-none">
              <h2 className="text-xl sm:text-2xl font-semibold inline">8. Limitation of Liability</h2>
              <span className="ml-2 text-sm text-muted-foreground group-open:rotate-180 transition-transform inline-block">▾</span>
            </summary>
            <div className="mt-3 space-y-3">
              <p><strong>8.1</strong> DrStethos provides services "as is" without guarantees of recruitment success.</p>
              <p><strong>8.2</strong> Liability to you shall be limited to the amount paid in the preceding six (6) months.</p>
            </div>
          </details>

          {/* Governing Law */}
          <details id="governing-law" className="group bg-muted/5 rounded-md p-3 sm:p-4" open>
            <summary className="cursor-pointer list-none outline-none">
              <h2 className="text-xl sm:text-2xl font-semibold inline">9. Governing Law and Dispute Resolution</h2>
              <span className="ml-2 text-sm text-muted-foreground group-open:rotate-180 transition-transform inline-block">▾</span>
            </summary>
            <div className="mt-3 space-y-3">
              <p><strong>9.1</strong> These Terms shall be governed by laws of India.</p>
              <p><strong>9.2</strong> Any disputes shall be subject to the exclusive jurisdiction of courts in Andhra Pradesh, India.</p>
            </div>
          </details>

          {/* Amendments */}
          <details id="amendments" className="group bg-muted/5 rounded-md p-3 sm:p-4" open>
            <summary className="cursor-pointer list-none outline-none">
              <h2 className="text-xl sm:text-2xl font-semibold inline">10. Amendments</h2>
              <span className="ml-2 text-sm text-muted-foreground group-open:rotate-180 transition-transform inline-block">▾</span>
            </summary>
            <div className="mt-3 space-y-3">
              <p><strong>10.1</strong> We may amend these Terms with prior notice posted on the app or via email.</p>
            </div>
          </details>

          {/* Acknowledgment */}
          <section id="acknowledgment" className="mt-8 p-4 sm:p-6 bg-primary/10 rounded-lg border-2 border-primary/20">
            <h2 className="text-xl sm:text-2xl font-semibold mb-4">Acknowledgment</h2>
            <p className="text-base sm:text-lg">
              By registering on DrStethos, you acknowledge that you have read, understood, and agree to these Terms and Conditions.
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
                <a className="block hover:text-primary py-1 transition-colors" href="#job-postings">4. Job Postings</a>
                <a className="block hover:text-primary py-1 transition-colors" href="#platform-use">5. Use of Platform</a>
                <a className="block hover:text-primary py-1 transition-colors" href="#intellectual-property">6. Intellectual Property</a>
                <a className="block hover:text-primary py-1 transition-colors" href="#termination">7. Suspension & Termination</a>
                <a className="block hover:text-primary py-1 transition-colors" href="#liability">8. Limitation of Liability</a>
                <a className="block hover:text-primary py-1 transition-colors" href="#governing-law">9. Governing Law</a>
                <a className="block hover:text-primary py-1 transition-colors" href="#amendments">10. Amendments</a>
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

export default TermsForHospitals;
