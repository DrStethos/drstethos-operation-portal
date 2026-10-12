import {
  DOCUMENT_REQUEST_LOGO_URL,
  DOCUMENT_REQUEST_SUBJECT,
  MISSING_DOC_LABELS,
  type MissingDocKey,
} from "@/lib/documentRequestEmail";

interface DocumentRequestEmailPreviewProps {
  doctorName: string;
  recipientEmail?: string;
  missing: MissingDocKey[];
  bulkNote?: string;
}

export function DocumentRequestEmailPreview({
  doctorName,
  recipientEmail,
  missing,
  bulkNote,
}: DocumentRequestEmailPreviewProps) {
  return (
    <div className="space-y-0">
      {bulkNote && (
        <p className="mb-3 rounded-md border border-blue-100 bg-blue-50 px-3 py-2 text-xs text-blue-800">
          {bulkNote}
        </p>
      )}

      <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 bg-slate-50 px-4 py-3">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
            Email preview
          </p>
          {recipientEmail && recipientEmail !== "N/A" && (
            <div className="mt-2 space-y-1 text-sm">
              <div className="flex gap-2">
                <span className="w-14 shrink-0 text-slate-500">To</span>
                <span className="truncate font-medium text-slate-800">{recipientEmail}</span>
              </div>
              <div className="flex gap-2">
                <span className="w-14 shrink-0 text-slate-500">Subject</span>
                <span className="text-slate-800">{DOCUMENT_REQUEST_SUBJECT}</span>
              </div>
            </div>
          )}
        </div>

        <div
          className="max-h-[min(52vh,520px)] overflow-y-auto"
          style={{ backgroundColor: "#f4f6f8" }}
        >
          <div className="px-3 py-5 sm:px-4">
            <div
              className="mx-auto overflow-hidden rounded-xl bg-white shadow-sm"
              style={{ maxWidth: 560, boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}
            >
              <div
                className="px-6 py-7 text-center"
                style={{ backgroundColor: "#0040FF" }}
              >
                <img
                  src={DOCUMENT_REQUEST_LOGO_URL}
                  alt="DrStethos"
                  width={56}
                  height={56}
                  className="mx-auto mb-3 block rounded-xl"
                />
                <p
                  className="m-0 text-lg font-semibold text-white"
                  style={{ fontSize: 18 }}
                >
                  DrStethos
                </p>
              </div>

              <div
                className="px-6 py-8 sm:px-7"
                style={{ color: "#1e293b", fontSize: 15, lineHeight: 1.6 }}
              >
                <p className="mb-4 mt-0">
                  Hi <strong>{doctorName}</strong>,
                </p>
                <p className="mb-2 mt-0">
                  We reviewed your profile and noticed the following items are still missing
                  or incomplete:
                </p>

                <ul
                  className="my-4 pl-5"
                  style={{ color: "#334155", margin: "16px 0", paddingLeft: 20 }}
                >
                  {missing.map((key) => (
                    <li key={key} className="mb-2">
                      {MISSING_DOC_LABELS[key]}
                    </li>
                  ))}
                </ul>

                <p className="my-4 mt-0">
                  Please open the DrStethos app, add the missing information, and make sure
                  everything is saved successfully.
                </p>
                <p className="mb-6 mt-0 text-sm" style={{ color: "#64748b" }}>
                  If you have already submitted these, please double-check that your profile
                  shows them correctly.
                </p>

                <span
                  className="inline-block rounded-lg px-6 py-3 text-sm font-semibold text-white"
                  style={{ backgroundColor: "#0040FF" }}
                >
                  Open DrStethos
                </span>
              </div>

              <div
                className="border-t px-6 py-5 sm:px-7"
                style={{
                  backgroundColor: "#f8fafc",
                  borderColor: "#e2e8f0",
                  color: "#94a3b8",
                  fontSize: 12,
                  lineHeight: 1.5,
                }}
              >
                <p className="m-0">
                  Regards,
                  <br />
                  DrStethos Admin Team
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
