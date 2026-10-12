import { ArrowLeft, Trash2, Mail, Clock, Database, Shield } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const DeleteAccount = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <Link to="/privacy-policy">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Privacy Policy
            </Button>
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="container mx-auto px-4 py-6 md:py-12 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">Account & Data Deletion</h1>
          <p className="text-muted-foreground mb-4">Dr Stethos by Nexus Sparks</p>
          <p className="text-base sm:text-lg">
            This page explains how you can request the deletion of your account and personal data from the Dr Stethos mobile application.
          </p>
        </div>

        <Alert className="mb-8 border-destructive/50 bg-destructive/10">
          <Trash2 className="h-4 w-4 text-destructive" />
          <AlertTitle className="text-destructive">Important Notice</AlertTitle>
          <AlertDescription>
            Account deletion is permanent and cannot be undone. All your data will be permanently deleted from our systems within 7 days of your request.
          </AlertDescription>
        </Alert>

        <div className="space-y-6">
          {/* How to Request Deletion */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trash2 className="h-5 w-5" />
                How to Request Account & Data Deletion
              </CardTitle>
              <CardDescription>
                You have two options to delete your account and all associated data
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border-l-4 border-primary pl-4">
                <h3 className="font-semibold mb-2">Option 1: Delete from the App (Recommended)</h3>
                <ol className="list-decimal pl-5 space-y-2 text-sm sm:text-base">
                  <li>Open the <strong>Dr Stethos</strong> mobile app</li>
                  <li>Navigate to your <strong>Profile</strong> or <strong>Settings</strong></li>
                  <li>Scroll down and tap on <strong>"Delete Account"</strong></li>
                  <li>Confirm your deletion request</li>
				  <li>You will receive a confirmation email once the deletion is complete</li>
                </ol>
              </div>

              <div className="border-l-4 border-secondary pl-4">
                <h3 className="font-semibold mb-2">Option 2: Email Request</h3>
                <p className="text-sm sm:text-base mb-2">
                  If you cannot access the app or prefer email, send a deletion request to:
                </p>
                <div className="flex items-center gap-2 p-3 bg-muted rounded-md">
                  <Mail className="h-4 w-4 text-primary" />
                  <a
                    href="mailto:stethosabhisha@gmail.com?subject=Account Deletion Request - Dr Stethos"
                    className="text-primary underline"
                  >
                    stethosabhisha@gmail.com
                  </a>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  Please include your registered email address or phone number in the request.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* What Data We Delete */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                What Data We Delete
              </CardTitle>
              <CardDescription>
                The following information will be permanently removed from our systems
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm sm:text-base">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">✓</span>
                  <span><strong>Firebase Authentication data</strong> (email address, phone number, authentication tokens)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">✓</span>
                  <span><strong>User profile information</strong> (name, profile picture, preferences)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">✓</span>
                  <span><strong>Medical records and health data</strong> (if applicable)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">✓</span>
                  <span><strong>Communication history</strong> (chats, messages, interactions)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">✓</span>
                  <span><strong>App usage data and analytics</strong> linked to your account</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">✓</span>
                  <span><strong>Device information and session data</strong></span>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* What We Retain */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                What We Retain (If Any)
              </CardTitle>
              <CardDescription>
                Certain data may be retained for legal or security purposes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm sm:text-base">
                <li className="flex items-start gap-2">
                  <span className="text-muted-foreground mt-1">•</span>
                  <span><strong>Security and fraud prevention logs</strong> (retained for 7-30 days to prevent abuse and ensure platform security)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-muted-foreground mt-1">•</span>
                  <span><strong>Transaction records</strong> (if required by financial regulations or tax laws)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-muted-foreground mt-1">•</span>
                  <span><strong>Legal compliance data</strong> (only if required by law enforcement or legal proceedings)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-muted-foreground mt-1">•</span>
                  <span><strong>Anonymized analytics data</strong> (aggregated data that cannot identify you personally)</span>
                </li>
              </ul>
              <p className="text-sm text-muted-foreground mt-4">
                All retained data is kept only as long as legally required and is securely deleted once the retention period expires.
              </p>
            </CardContent>
          </Card>

          {/* Deletion Timeline */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                How Long Does Deletion Take?
              </CardTitle>
              <CardDescription>
                Account and data deletion timeline
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold">
                    1
                  </div>
                  <div>
                    <h4 className="font-semibold">Immediate (0-24 hours)</h4>
                    <p className="text-sm text-muted-foreground">
                      Your account will be deactivated immediately, and you will no longer be able to log in to the app.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold">
                    2
                  </div>
                  <div>
                    <h4 className="font-semibold">Within 7 Days</h4>
                    <p className="text-sm text-muted-foreground">
                      All your personal data, including profile information, medical records, and communication history, will be permanently deleted from our active databases and backup systems.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold">
                    3
                  </div>
                  <div>
                    <h4 className="font-semibold">Confirmation Email</h4>
                    <p className="text-sm text-muted-foreground">
                      You will receive an email confirmation once the deletion process is complete (if you provided an email address).
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Support */}
          <Card>
            <CardHeader>
              <CardTitle>Need Help?</CardTitle>
              <CardDescription>
                If you have questions about account deletion
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-sm sm:text-base">
                For questions or concerns about the account deletion process, please contact us:
              </p>
              <div className="flex flex-col gap-2 p-4 bg-muted rounded-md">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-primary" />
                  <strong>Email:</strong>
                  <a
                    href="mailto:stethosabhisha@gmail.com"
                    className="text-primary underline"
                  >
                    stethosabhisha@gmail.com
                  </a>
                </div>
                <div>
                  <strong>Developer:</strong> Vishnu Spire LLP
                </div>
                <div>
                  <strong>App:</strong> Dr Stethos
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8 p-4 border rounded-md bg-muted/30">
          <p className="text-sm text-muted-foreground">
            <strong>Privacy Compliance:</strong> This deletion process complies with GDPR, CCPA, and Google Play Store data deletion requirements.
            For more information about how we handle your data, please review our{" "}
            <Link to="/privacy-policy" className="text-primary underline">
              Privacy Policy
            </Link>.
          </p>
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

export default DeleteAccount;
