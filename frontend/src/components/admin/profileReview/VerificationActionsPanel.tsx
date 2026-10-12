import { CheckCircle, XCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface VerificationActionsPanelProps {
  isVerified: boolean;
  isProcessing: boolean;
  onApprove: () => void;
  onReject: () => void;
  children?: React.ReactNode;
}

export function VerificationActionsPanel({
  isVerified,
  isProcessing,
  onApprove,
  onReject,
  children,
}: VerificationActionsPanelProps) {
  return (
    <div className="space-y-4 lg:sticky lg:top-4">
      <Card className="border-slate-200 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Review decision</CardTitle>
          <CardDescription className="text-sm">
            Approve sends a welcome email. Reject asks for a reason first.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2.5">
          <Button
            className="h-10 w-full bg-green-600 hover:bg-green-700"
            disabled={isVerified || isProcessing}
            onClick={onApprove}
          >
            <CheckCircle className="mr-2 h-4 w-4" />
            {isVerified ? "Already approved" : "Approve & send email"}
          </Button>
          <Button
            variant="outline"
            className="h-10 w-full border-red-200 text-red-600 hover:bg-red-50"
            disabled={isProcessing}
            onClick={onReject}
          >
            <XCircle className="mr-2 h-4 w-4" />
            Reject application
          </Button>
        </CardContent>
      </Card>
      {children}
    </div>
  );
}
