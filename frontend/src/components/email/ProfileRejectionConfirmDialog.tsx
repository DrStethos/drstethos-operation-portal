import { Loader2, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { ProfileRejectionEmailPreview } from "@/components/email/ProfileRejectionEmailPreview";

interface ProfileRejectionConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  profileName: string;
  profileType: string;
  recipientEmail?: string;
  rejectionReason: string;
  onRejectionReasonChange: (value: string) => void;
  isProcessing?: boolean;
  onConfirm: () => void;
}

export function ProfileRejectionConfirmDialog({
  open,
  onOpenChange,
  profileName,
  profileType,
  recipientEmail,
  rejectionReason,
  onRejectionReasonChange,
  isProcessing = false,
  onConfirm,
}: ProfileRejectionConfirmDialogProps) {
  const canConfirm = rejectionReason.trim().length > 0;

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen && !isProcessing) onOpenChange(false);
      }}
    >
      <DialogContent className="flex max-h-[92vh] flex-col gap-0 overflow-hidden p-0 sm:max-w-2xl">
        <DialogHeader className="shrink-0 border-b border-slate-100 px-6 py-4">
          <DialogTitle className="text-base font-semibold">Reject profile</DialogTitle>
          <DialogDescription className="text-sm">
            Enter a reason and review the email that will be sent to {profileName}.
          </DialogDescription>
        </DialogHeader>

        <div className="min-h-0 flex-1 space-y-4 overflow-y-auto px-6 py-4">
          <Textarea
            value={rejectionReason}
            onChange={(e) => onRejectionReasonChange(e.target.value)}
            rows={3}
            placeholder="Enter rejection reason..."
            className="resize-none"
            disabled={isProcessing}
          />

          <ProfileRejectionEmailPreview
            profileName={profileName}
            profileType={profileType}
            recipientEmail={recipientEmail}
            rejectionReason={rejectionReason}
          />
        </div>

        <DialogFooter className="shrink-0 gap-2 border-t border-slate-100 px-6 py-4 sm:gap-0">
          <Button
            variant="outline"
            disabled={isProcessing}
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={onConfirm}
            disabled={isProcessing || !canConfirm}
          >
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Rejecting...
              </>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                Reject &amp; Send Email
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
