import {
  DEFAULT_DASHBOARD_LINK,
  getApprovalSubject,
  PROFILE_APPROVAL_LOGO_URL,
} from "@/lib/profileApprovalEmail";

interface ProfileApprovalEmailPreviewProps {
  profileName: string;
  profileType: string;
  recipientEmail?: string;
  dashboardLink?: string;
}

export function ProfileApprovalEmailPreview({
  profileName,
  profileType,
  recipientEmail,
  dashboardLink = DEFAULT_DASHBOARD_LINK,
}: ProfileApprovalEmailPreviewProps) {
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
              <span className="text-slate-800">{getApprovalSubject(profileType)}</span>
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
              src={PROFILE_APPROVAL_LOGO_URL}
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
            Congratulations! Your {profileType} Profile Has Been Approved
          </h2>

          <p className="mb-3 text-sm leading-relaxed text-slate-700">
            Dear <strong>{profileName}</strong>,
          </p>
          <p className="mb-3 text-sm leading-relaxed text-slate-700">
            We&rsquo;re delighted to inform you that your <strong>{profileType}</strong> profile
            has been{" "}
            <strong style={{ color: "#1d4ed8" }}>successfully verified and approved</strong> on{" "}
            <strong>DrStethos</strong>.
          </p>
          <p className="mb-3 text-sm leading-relaxed text-slate-700">
            You are now officially part of a rapidly growing digital healthcare ecosystem designed
            to empower doctors, hospitals, and medical professionals with enhanced visibility,
            trust, and patient engagement tools.
          </p>

          <div className="my-7 text-center">
            <span
              className="inline-block rounded-md px-7 py-3 text-[15px] font-semibold text-white shadow-sm"
              style={{
                backgroundColor: "#1d4ed8",
                boxShadow: "0 3px 10px rgba(29, 78, 216, 0.25)",
              }}
            >
              Go to Your Dashboard
            </span>
          </div>

          <p className="mb-3 text-sm leading-relaxed text-slate-700">
            From here, you can manage your profile, update information, and explore upcoming
            features that will further strengthen your online presence and streamline engagement
            with patients.
          </p>
          <p className="mb-3 text-sm leading-relaxed text-slate-500">
            If you need assistance, our support team is always here to help. Contact us at{" "}
            <a href="mailto:support@drstethos.com" className="text-[#1d4ed8] no-underline">
              support@drstethos.com
            </a>
            .
          </p>
          <p className="mt-5 text-sm text-slate-700">
            Warm regards,
            <br />
            <strong style={{ color: "#1d4ed8" }}>Team DrStethos</strong>
          </p>
          <p className="mt-2 text-[11px] text-slate-400">Dashboard link: {dashboardLink}</p>
        </div>
      </div>
    </div>
  );
}
