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
import { ProfileApprovalEmailPreview } from "@/components/email/ProfileApprovalEmailPreview";

interface ProfileApprovalConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  profileName: string;
  profileType: string;
  recipientEmail?: string;
  isProcessing?: boolean;
  onConfirm: () => void;
}

export function ProfileApprovalConfirmDialog({
  open,
  onOpenChange,
  profileName,
  profileType,
  recipientEmail,
  isProcessing = false,
  onConfirm,
}: ProfileApprovalConfirmDialogProps) {
  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen && !isProcessing) onOpenChange(false);
      }}
    >
      <DialogContent className="flex max-h-[92vh] flex-col gap-0 overflow-hidden p-0 sm:max-w-2xl">
        <DialogHeader className="shrink-0 border-b border-slate-100 px-6 py-4">
          <DialogTitle className="text-base font-semibold">Approve profile</DialogTitle>
          <DialogDescription className="text-sm">
            This is the exact approval email that will be sent to {profileName}.
          </DialogDescription>
        </DialogHeader>

        <div className="min-h-0 flex-1 overflow-y-auto px-6 py-4">
          <ProfileApprovalEmailPreview
            profileName={profileName}
            profileType={profileType}
            recipientEmail={recipientEmail}
          />
        </div>

        <DialogFooter className="shrink-0 gap-2 border-t border-slate-100 px-6 py-4 sm:gap-0">
          <Button variant="outline" disabled={isProcessing} onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            disabled={isProcessing}
            className="bg-green-600 hover:bg-green-700"
          >
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Approving...
              </>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                Approve &amp; Send Email
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
