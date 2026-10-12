import { ArrowLeft, Printer, Download, Shield, AlertTriangle, UserX, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";

const SafetyStandards = () => {
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
              <Shield className="h-8 w-8 text-primary" />
              <h1 className="text-3xl sm:text-4xl font-bold">Child Safety Standards</h1>
            </div>
            <p className="text-muted-foreground mb-4 sm:mb-6">Last updated: December 11, 2025</p>
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

              {/* Critical Alert */}
              <Alert className="border-destructive bg-destructive/10">
                <AlertTriangle className="h-5 w-5 text-destructive" />
                <AlertDescription className="text-base font-medium">
                  <strong>Zero Tolerance Policy:</strong> DrStethos maintains a strict zero-tolerance policy against Child Sexual Abuse and Exploitation (CSAE). Any violations will result in immediate account termination and reporting to appropriate authorities.
                </AlertDescription>
              </Alert>

              <section id="introduction">
                <h2 className="text-xl sm:text-2xl font-semibold mb-4">Our Commitment to Child Safety</h2>
                <p className="text-base sm:text-lg">
                  <strong>DrStethos</strong> is a professional healthcare recruitment platform connecting doctors and hospitals. While our platform is designed exclusively for adults and professional use, we recognize our responsibility to maintain a safe digital environment and actively combat Child Sexual Abuse and Exploitation (CSAE) in all its forms.
                </p>
                <p className="text-base sm:text-lg mt-4">
                  This page outlines our comprehensive policies, procedures, and standards to prevent, detect, and respond to any content or behavior related to child sexual abuse and exploitation on our platform.
                </p>
              </section>

              {/* Zero Tolerance Stance */}
              <details id="stance" className="group bg-muted/5 rounded-md p-3 sm:p-4" open>
                <summary className="cursor-pointer list-none outline-none">
                  <h2 className="text-xl sm:text-2xl font-semibold inline flex items-center gap-2">
                    <UserX className="h-5 w-5 text-destructive" />
                    Our Stance Against CSAE
                  </h2>
                  <span className="ml-2 text-sm text-muted-foreground group-open:rotate-180 transition-transform inline-block">▾</span>
                </summary>
                <div className="mt-4">
                  <div className="p-4 bg-destructive/10 rounded-md border border-destructive/20 mb-4">
                    <h3 className="text-lg font-semibold mb-3 text-destructive">Absolute Zero Tolerance</h3>
                    <p className="mb-2">
                      DrStethos categorically condemns and prohibits any form of child sexual abuse and exploitation, including but not limited to:
                    </p>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>Child Sexual Abuse Material (CSAM)</li>
                      <li>Any content that sexualizes, grooms, or exploits minors</li>
                      <li>Sharing, distributing, or soliciting CSAM</li>
                      <li>Inappropriate interactions with minors</li>
                      <li>Child trafficking or exploitation coordination</li>
                      <li>Any attempt to normalize or promote abuse of children</li>
                    </ul>
                  </div>

                  <h3 className="text-lg sm:text-xl font-semibold mt-6 mb-3">Our Core Principles</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-1 flex-shrink-0" />
                      <div>
                        <strong>Professional Platform:</strong> DrStethos is exclusively designed for adult healthcare professionals and institutions. We require age verification and professional credentials.
                      </div>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-1 flex-shrink-0" />
                      <div>
                        <strong>Proactive Detection:</strong> We employ advanced automated systems and manual review processes to detect and prevent CSAE content before it reaches our platform.
                      </div>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-1 flex-shrink-0" />
                      <div>
                        <strong>Swift Action:</strong> Any detected CSAE content or behavior results in immediate account suspension, content removal, and law enforcement notification.
                      </div>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-1 flex-shrink-0" />
                      <div>
                        <strong>Legal Cooperation:</strong> We maintain full cooperation with law enforcement agencies and child protection organizations globally.
                      </div>
                    </li>
                  </ul>
                </div>
              </details>

              {/* Reporting Mechanisms */}
              <details id="reporting" className="group bg-muted/5 rounded-md p-3 sm:p-4" open>
                <summary className="cursor-pointer list-none outline-none">
                  <h2 className="text-xl sm:text-2xl font-semibold inline flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-orange-600" />
                    Reporting Mechanisms
                  </h2>
                  <span className="ml-2 text-sm text-muted-foreground group-open:rotate-180 transition-transform inline-block">▾</span>
                </summary>
                <div className="mt-4">
                  <p className="mb-4 text-base">
                    We provide multiple confidential channels for reporting suspected CSAE content or behavior:
                  </p>

                  <div className="space-y-4">
                    <div className="p-4 bg-orange-500/10 rounded-md border border-orange-500/20">
                      <h3 className="text-lg font-semibold mb-2">1. In-App Reporting</h3>
                      <ul className="list-disc pl-6 space-y-1">
                        <li>Use the "Report" button available on all user profiles and content</li>
                        <li>Select "Child Safety Concern" as the report category</li>
                        <li>Provide detailed information about the concern</li>
                        <li>Reports are reviewed immediately by our safety team</li>
                      </ul>
                    </div>

                    <div className="p-4 bg-orange-500/10 rounded-md border border-orange-500/20">
                      <h3 className="text-lg font-semibold mb-2">2. Emergency Email Hotline</h3>
                      <p className="mb-2">
                        <strong>Email:</strong>{" "}
                        <a href="mailto:safety@drstethos.com" className="text-primary underline font-semibold">
                          safety@drstethos.com
                        </a>
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Priority response for urgent child safety concerns. Monitored 24/7 with response within 1 hour.
                      </p>
                    </div>

                    <div className="p-4 bg-orange-500/10 rounded-md border border-orange-500/20">
                      <h3 className="text-lg font-semibold mb-2">3. Direct Contact</h3>
                      <p className="mb-2">
                        <strong>Support Email:</strong>{" "}
                        <a href="mailto:support@drstethos.com" className="text-primary underline">
                          support@drstethos.com
                        </a>
                      </p>
                      <p className="mb-2">
                        <strong>Business Address:</strong> DrStethos, Inc., [Your Business Address]
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Mark communications with "URGENT - Child Safety" for priority handling.
                      </p>
                    </div>

                    <div className="p-4 bg-orange-500/10 rounded-md border border-orange-500/20">
                      <h3 className="text-lg font-semibold mb-2">4. Anonymous Reporting</h3>
                      <p>
                        Users can submit anonymous reports through our web portal at{" "}
                        <a href="https://drstethos.com/report" className="text-primary underline">
                          drstethos.com/report
                        </a>
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        No login required. All reports are treated with strict confidentiality.
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 p-4 bg-blue-500/10 rounded-md border border-blue-500/20">
                    <h3 className="text-lg font-semibold mb-2">External Reporting Resources</h3>
                    <p className="mb-2">You can also report CSAM directly to:</p>
                    <ul className="list-disc pl-6 space-y-1">
                      <li>
                        <strong>NCMEC CyberTipline:</strong>{" "}
                        <a href="https://www.cybertipline.org" target="_blank" rel="noopener noreferrer" className="text-primary underline">
                          www.cybertipline.org
                        </a>{" "}
                        (USA)
                      </li>
                      <li>
                        <strong>Internet Watch Foundation:</strong>{" "}
                        <a href="https://www.iwf.org.uk" target="_blank" rel="noopener noreferrer" className="text-primary underline">
                          www.iwf.org.uk
                        </a>{" "}
                        (UK)
                      </li>
                      <li>
                        <strong>Your local law enforcement:</strong> Contact your local police department immediately
                      </li>
                    </ul>
                  </div>
                </div>
              </details>

              {/* Moderation Processes */}
              <details id="moderation" className="group bg-muted/5 rounded-md p-3 sm:p-4" open>
                <summary className="cursor-pointer list-none outline-none">
                  <h2 className="text-xl sm:text-2xl font-semibold inline">Moderation Processes</h2>
                  <span className="ml-2 text-sm text-muted-foreground group-open:rotate-180 transition-transform inline-block">▾</span>
                </summary>
                <div className="mt-4">
                  <p className="mb-4 text-base">
                    DrStethos employs a multi-layered approach to content moderation and user safety:
                  </p>

                  <h3 className="text-lg sm:text-xl font-semibold mt-4 mb-3">1. Preventive Measures</h3>
                  <ul className="list-disc pl-6 space-y-2 mb-4">
                    <li><strong>Age Verification:</strong> All users must be 18+ and provide professional healthcare credentials</li>
                    <li><strong>Identity Verification:</strong> Healthcare professionals must verify their medical licenses and professional identities</li>
                    <li><strong>Upload Restrictions:</strong> Strict limitations on file types and content that can be uploaded</li>
                    <li><strong>Content Filtering:</strong> Automated systems scan all uploads using PhotoDNA and other CSAM detection technologies</li>
                  </ul>

                  <h3 className="text-lg sm:text-xl font-semibold mt-4 mb-3">2. Automated Detection</h3>
                  <ul className="list-disc pl-6 space-y-2 mb-4">
                    <li><strong>Hash Matching:</strong> Integration with NCMEC's PhotoDNA database to detect known CSAM</li>
                    <li><strong>AI Screening:</strong> Machine learning algorithms to identify potential CSAE content and behavior patterns</li>
                    <li><strong>Text Analysis:</strong> Natural language processing to detect grooming language or inappropriate content</li>
                    <li><strong>Behavioral Monitoring:</strong> Pattern detection for suspicious account activity</li>
                  </ul>

                  <h3 className="text-lg sm:text-xl font-semibold mt-4 mb-3">3. Human Review</h3>
                  <ul className="list-disc pl-6 space-y-2 mb-4">
                    <li><strong>Trained Safety Team:</strong> Dedicated moderators trained in CSAE detection and child safety protocols</li>
                    <li><strong>24/7 Monitoring:</strong> Round-the-clock review of flagged content and reports</li>
                    <li><strong>Expert Consultation:</strong> Partnership with child safety experts for complex cases</li>
                    <li><strong>Priority Queue:</strong> Child safety reports receive highest priority review (within 1 hour)</li>
                  </ul>

                  <h3 className="text-lg sm:text-xl font-semibold mt-4 mb-3">4. Immediate Response Protocol</h3>
                  <div className="p-3 bg-destructive/10 rounded-md border border-destructive/20">
                    <p className="mb-2">When CSAE content or behavior is detected:</p>
                    <ol className="list-decimal pl-6 space-y-2">
                      <li><strong>Instant Suspension:</strong> Immediate account suspension and content removal (within minutes)</li>
                      <li><strong>Evidence Preservation:</strong> Secure storage of all evidence for law enforcement</li>
                      <li><strong>Law Enforcement Notification:</strong> Immediate report to NCMEC CyberTipline and relevant authorities</li>
                      <li><strong>Permanent Ban:</strong> Account permanently banned with IP and device blocking</li>
                      <li><strong>Network Investigation:</strong> Analysis of associated accounts and potential coordinated activity</li>
                    </ol>
                  </div>

                  <h3 className="text-lg sm:text-xl font-semibold mt-6 mb-3">5. Continuous Improvement</h3>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Regular updates to detection algorithms and moderation protocols</li>
                    <li>Quarterly training for moderation team on emerging threats</li>
                    <li>Collaboration with industry partners to share threat intelligence</li>
                    <li>Annual third-party audits of our safety systems</li>
                  </ul>
                </div>
              </details>

              {/* Compliance Commitment */}
              <details id="compliance" className="group bg-muted/5 rounded-md p-3 sm:p-4" open>
                <summary className="cursor-pointer list-none outline-none">
                  <h2 className="text-xl sm:text-2xl font-semibold inline">Compliance Commitment</h2>
                  <span className="ml-2 text-sm text-muted-foreground group-open:rotate-180 transition-transform inline-block">▾</span>
                </summary>
                <div className="mt-4">
                  <p className="mb-4 text-base">
                    DrStethos is committed to full compliance with all applicable laws, regulations, and industry standards related to child safety:
                  </p>

                  <h3 className="text-lg sm:text-xl font-semibold mt-4 mb-3">Legal Compliance</h3>
                  <ul className="list-disc pl-6 space-y-2 mb-4">
                    <li>
                      <strong>18 U.S.C. § 2258A:</strong> Full compliance with mandatory CSAM reporting requirements
                    </li>
                    <li>
                      <strong>PROTECT Act:</strong> Adherence to U.S. federal laws prohibiting child exploitation
                    </li>
                    <li>
                      <strong>GDPR & International Laws:</strong> Compliance with global data protection and child safety regulations
                    </li>
                    <li>
                      <strong>Local Jurisdiction Laws:</strong> Compliance with child protection laws in all operating regions
                    </li>
                  </ul>

                  <h3 className="text-lg sm:text-xl font-semibold mt-4 mb-3">Industry Standards</h3>
                  <ul className="list-disc pl-6 space-y-2 mb-4">
                    <li>
                      <strong>NCMEC Partnership:</strong> Active member of the National Center for Missing & Exploited Children reporting network
                    </li>
                    <li>
                      <strong>Technology Coalition:</strong> Participant in industry-wide child safety initiatives
                    </li>
                    <li>
                      <strong>Safety by Design:</strong> Implementation of child safety principles in product development
                    </li>
                    <li>
                      <strong>Transparency Reports:</strong> Annual publication of safety metrics and enforcement actions
                    </li>
                  </ul>

                  <h3 className="text-lg sm:text-xl font-semibold mt-4 mb-3">Our Reporting Obligations</h3>
                  <div className="p-4 bg-blue-500/10 rounded-md border border-blue-500/20 mb-4">
                    <p className="mb-2">
                      As a responsible platform operator, DrStethos is legally obligated to:
                    </p>
                    <ul className="list-disc pl-6 space-y-1">
                      <li>Report all suspected CSAM to NCMEC's CyberTipline</li>
                      <li>Preserve evidence and provide it to law enforcement upon legal request</li>
                      <li>Maintain records of reports for the time required by law</li>
                      <li>Cooperate fully with law enforcement investigations</li>
                      <li>Notify users of their legal rights and reporting options</li>
                    </ul>
                  </div>

                  <h3 className="text-lg sm:text-xl font-semibold mt-4 mb-3">Continuous Compliance</h3>
                  <ul className="list-disc pl-6 space-y-2">
                    <li><strong>Legal Monitoring:</strong> Regular review of evolving laws and regulations</li>
                    <li><strong>Policy Updates:</strong> Quarterly review and updates to safety policies</li>
                    <li><strong>External Audits:</strong> Annual third-party compliance audits</li>
                    <li><strong>Staff Training:</strong> Mandatory training on legal obligations and reporting requirements</li>
                    <li><strong>Incident Documentation:</strong> Comprehensive records of all safety incidents and responses</li>
                  </ul>
                </div>
              </details>

              {/* User Responsibilities */}
              <details id="user-responsibilities" className="group bg-muted/5 rounded-md p-3 sm:p-4">
                <summary className="cursor-pointer list-none outline-none">
                  <h2 className="text-xl sm:text-2xl font-semibold inline">User Responsibilities</h2>
                  <span className="ml-2 text-sm text-muted-foreground group-open:rotate-180 transition-transform inline-block">▾</span>
                </summary>
                <div className="mt-4">
                  <p className="mb-4 text-base">
                    All DrStethos users play a crucial role in maintaining a safe platform:
                  </p>

                  <h3 className="text-lg sm:text-xl font-semibold mt-4 mb-3">User Obligations</h3>
                  <ul className="list-disc pl-6 space-y-2 mb-4">
                    <li>Report any suspected CSAE content or behavior immediately</li>
                    <li>Never share, distribute, or engage with any CSAM</li>
                    <li>Maintain professional conduct at all times</li>
                    <li>Verify your identity and professional credentials accurately</li>
                    <li>Cooperate with safety investigations when requested</li>
                  </ul>

                  <h3 className="text-lg sm:text-xl font-semibold mt-4 mb-3">Consequences of Violations</h3>
                  <div className="p-3 bg-destructive/10 rounded-md border border-destructive/20">
                    <p className="mb-2 font-semibold">Any user who violates our child safety policies will face:</p>
                    <ul className="list-disc pl-6 space-y-1">
                      <li>Immediate and permanent account termination</li>
                      <li>Reporting to law enforcement and NCMEC</li>
                      <li>Legal prosecution to the fullest extent of the law</li>
                      <li>Permanent ban from all DrStethos services</li>
                      <li>Potential civil liability</li>
                    </ul>
                  </div>
                </div>
              </details>

              {/* Contact and Questions */}
              <section id="contact" className="mt-8 p-6 bg-primary/5 rounded-md border border-primary/20">
                <h2 className="text-xl sm:text-2xl font-semibold mb-4">Questions or Concerns?</h2>
                <p className="mb-4">
                  If you have questions about our child safety standards or want to report a concern:
                </p>
                <ul className="space-y-2">
                  <li>
                    <strong>Safety Team:</strong>{" "}
                    <a href="mailto:safety@drstethos.com" className="text-primary underline">
                      safety@drstethos.com
                    </a>
                  </li>
                  <li>
                    <strong>General Inquiries:</strong>{" "}
                    <a href="mailto:support@drstethos.com" className="text-primary underline">
                      support@drstethos.com
                    </a>
                  </li>
                  <li>
                    <strong>Anonymous Reporting:</strong>{" "}
                    <a href="https://drstethos.com/report" className="text-primary underline">
                      drstethos.com/report
                    </a>
                  </li>
                </ul>
              </section>

              {/* Last Updated */}
              <div className="mt-8 p-4 bg-muted/30 rounded-md text-sm text-muted-foreground">
                <p>
                  <strong>Document Version:</strong> 1.0<br />
                  <strong>Last Updated:</strong> December 11, 2025<br />
                  <strong>Next Review Date:</strong> March 11, 2026
                </p>
                <p className="mt-2">
                  This document is reviewed quarterly and updated as needed to reflect current laws, regulations, and best practices.
                </p>
              </div>

            </div>
          </div>

          {/* Sidebar / Quick Links */}
          <div className="md:col-span-1">
            <div className="sticky top-24">
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <nav className="space-y-2">
                <a href="#introduction" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Our Commitment
                </a>
                <a href="#stance" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Our Stance Against CSAE
                </a>
                <a href="#reporting" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Reporting Mechanisms
                </a>
                <a href="#moderation" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Moderation Processes
                </a>
                <a href="#compliance" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Compliance Commitment
                </a>
                <a href="#user-responsibilities" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                  User Responsibilities
                </a>
                <a href="#contact" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Contact Us
                </a>
              </nav>

              <div className="mt-8 p-4 bg-destructive/10 rounded-md border border-destructive/20">
                <h4 className="font-semibold mb-2 text-destructive">Emergency Reporting</h4>
                <p className="text-sm mb-3">
                  For urgent child safety concerns:
                </p>
                <a
                  href="mailto:safety@drstethos.com"
                  className="block w-full text-center bg-destructive text-destructive-foreground px-4 py-2 rounded-md font-semibold hover:bg-destructive/90 transition-colors"
                >
                  Report Now
                </a>
                <p className="text-xs mt-2 text-muted-foreground">
                  24/7 monitoring • 1-hour response time
                </p>
              </div>

              <div className="mt-6 p-4 bg-muted/30 rounded-md">
                <h4 className="font-semibold mb-2">Related Documents</h4>
                <ul className="space-y-2 text-sm">
                  <li>
                    <Link to="/privacy-policy" className="text-primary hover:underline">
                      Privacy Policy
                    </Link>
                  </li>
                  <li>
                    <Link to="/termsandservices/fordoctors" className="text-primary hover:underline">
                      Terms for Doctors
                    </Link>
                  </li>
                  <li>
                    <Link to="/termsandservices/forhospitals" className="text-primary hover:underline">
                      Terms for Hospitals
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t mt-12 py-8 bg-muted/30">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© 2025 DrStethos. All rights reserved.</p>
          <p className="mt-2">
            Committed to safety, compliance, and child protection.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default SafetyStandards;
