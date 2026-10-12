import {
  getRejectionSubject,
  PROFILE_REJECTION_LOGO_URL,
} from "@/lib/profileRejectionEmail";

interface ProfileRejectionEmailPreviewProps {
  profileName: string;
  profileType: string;
  rejectionReason: string;
  recipientEmail?: string;
}

export function ProfileRejectionEmailPreview({
  profileName,
  profileType,
  rejectionReason,
  recipientEmail,
}: ProfileRejectionEmailPreviewProps) {
  const reason = rejectionReason.trim() || "Your reason will appear here.";

  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 bg-slate-50 px-4 py-3">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
          Email preview
        </p>
        {recipientEmail && (
          <div className="mt-2 space-y-1 text-sm">
            <div className="flex gap-2">
              <span className="w-14 shrink-0 text-slate-500">To</span>
              <span className="truncate font-medium text-slate-800">{recipientEmail}</span>
            </div>
            <div className="flex gap-2">
              <span className="w-14 shrink-0 text-slate-500">Subject</span>
              <span className="text-slate-800">{getRejectionSubject(profileType)}</span>
            </div>
          </div>
        )}
      </div>

      <div
        className="max-h-[min(52vh,520px)] overflow-y-auto p-4"
        style={{ backgroundColor: "#f4f8ff" }}
      >
        <div
          className="mx-auto rounded-[10px] border border-[#dce6ff] bg-white p-6"
          style={{ maxWidth: 600 }}
        >
          <div className="mb-5 text-center">
            <img
              src={PROFILE_REJECTION_LOGO_URL}
              alt="DrStethos"
              width={75}
              height={75}
              className="mx-auto rounded-[10px]"
            />
          </div>

          <h2
            className="mb-4 text-center text-[22px] font-semibold leading-snug"
            style={{ color: "#1d4ed8" }}
          >
            Update on Your {profileType} Profile Verification
          </h2>

          <p className="mb-3 text-sm leading-relaxed text-slate-700">
            Dear <strong>{profileName}</strong>,
          </p>
          <p className="mb-3 text-sm leading-relaxed text-slate-700">
            Thank you for submitting your <strong>{profileType}</strong> profile for verification
            on <strong>DrStethos</strong>. We appreciate the time and effort you invested in
            completing your details.
          </p>
          <p className="mb-3 text-sm leading-relaxed text-slate-700">
            After a thorough review, we were unable to approve your profile at this time. Below is
            the reason provided by our verification team:
          </p>

          <div
            className="my-5 rounded-md border-l-4 px-4 py-3"
            style={{ backgroundColor: "#f1f5ff", borderLeftColor: "#ef4444" }}
          >
            <p className="m-0 text-sm text-red-500">
              <strong>Reason:</strong> {reason}
            </p>
          </div>

          <p className="mb-3 text-sm leading-relaxed text-slate-700">
            We encourage you to review the above details and update your profile accordingly. Once
            the necessary corrections or documents are provided, you may resubmit for verification
            at any time.
          </p>
          <p className="mb-3 text-sm leading-relaxed text-slate-700">
            If you need clarification or further assistance, our support team will be happy to
            help. Contact us at{" "}
            <a href="mailto:support@drstethos.com" className="text-[#1d4ed8] no-underline">
              support@drstethos.com
            </a>
            .
          </p>
          <p className="mt-5 text-sm text-slate-700">
            Thank you for your understanding.
            <br />
            <strong style={{ color: "#1d4ed8" }}>Team DrStethos</strong>
          </p>
        </div>
      </div>
    </div>
  );
}
