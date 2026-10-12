import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Search,
  Eye,
  Mail,
  FileWarning,
  Loader2,
  Send,
  Phone,
} from "lucide-react";
import { toast } from "sonner";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { sendEmail } from "@/helpers/cloudEmailHelper";
import { DocumentRequestEmailPreview } from "@/components/email/DocumentRequestEmailPreview";
import {
  buildMissingDocumentsListHtml,
  buildMissingDocumentsText,
  DOCUMENT_REQUEST_SUBJECT,
  MISSING_DOC_LABELS,
  type MissingDocKey,
} from "@/lib/documentRequestEmail";

interface IncompleteDoctor {
  id: string;
  userId: string;
  name: string;
  email: string;
  phoneNumber?: string;
  specialization?: string;
  isVerified: boolean;
  missing: MissingDocKey[];
  certificateCount: number;
  documentsRequestSentAt?: Date | null;
  documentsRequestCount: number;
  fcmToken?: string;
}

const hasText = (value: unknown) =>
  typeof value === "string" && value.trim().length > 0;

const hasNonEmptyArray = (value: unknown) =>
  Array.isArray(value) && value.length > 0;

const hasResumeField = (data: Record<string, any>) =>
  hasText(data.resumeUrl) ||
  hasText(data.resume) ||
  hasText(data.resumeFileUrl) ||
  hasText(data.cvUrl) ||
  hasText(data.cv) ||
  (typeof data.resume === "object" && data.resume !== null && hasText(data.resume.url));

const hasExperienceField = (data: Record<string, any>) =>
  data.yearsOfExperience !== undefined &&
  data.yearsOfExperience !== null &&
  data.yearsOfExperience !== ""
    ? true
    : hasNonEmptyArray(data.experiences) ||
      hasNonEmptyArray(data.experience) ||
      hasNonEmptyArray(data.workExperience) ||
      hasText(data.experience) ||
      hasText(data.workExperience) ||
      hasText(data.experienceDetails);

const hasEducationField = (data: Record<string, any>) =>
  hasText(data.qualifications) ||
  hasText(data.education) ||
  hasText(data.educationDetails) ||
  hasNonEmptyArray(data.education) ||
  hasNonEmptyArray(data.educations) ||
  hasNonEmptyArray(data.educationDetails);

const AdminIncompleteDocuments = () => {
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState<IncompleteDoctor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "not_contacted" | "contacted">("all");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const [contactTarget, setContactTarget] = useState<IncompleteDoctor | null>(null);
  const [bulkMode, setBulkMode] = useState(false);
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    fetchIncompleteDoctors();
  }, []);

  const fetchIncompleteDoctors = async () => {
    setIsLoading(true);
    try {
      const doctorsSnap = await getDocs(collection(db, "doctors"));
      const incomplete: IncompleteDoctor[] = [];

      for (const doctorDoc of doctorsSnap.docs) {
        const data = doctorDoc.data();
        const missing: MissingDocKey[] = [];

        let certificateCount = 0;
        let hasResumeInCertificates = false;
        try {
          const certSnap = await getDocs(
            collection(db, "doctors", doctorDoc.id, "certificates")
          );
          certificateCount = certSnap.size;
          hasResumeInCertificates = certSnap.docs.some((cert) => {
            const fileName = String(cert.data().fileName || "").toLowerCase();
            const type = String(cert.data().type || cert.data().documentType || "").toLowerCase();
            return (
              fileName.includes("resume") ||
              fileName.includes("cv") ||
              type.includes("resume") ||
              type.includes("cv")
            );
          });
        } catch (err) {
          console.warn("Certificate fetch failed for", doctorDoc.id, err);
        }

        // Optional resume subcollection
        let hasResumeSubcollection = false;
        try {
          const resumeSnap = await getDocs(
            collection(db, "doctors", doctorDoc.id, "resumes")
          );
          hasResumeSubcollection = !resumeSnap.empty;
        } catch {
          // subcollection may not exist
        }

        if (certificateCount === 0) missing.push("certificates");
        if (!hasResumeField(data) && !hasResumeInCertificates && !hasResumeSubcollection) {
          missing.push("resume");
        }
        if (!data.mcaNumber || String(data.mcaNumber).trim() === "") {
          missing.push("mcaNumber");
        }
        if (!data.profilePhotoUrl || String(data.profilePhotoUrl).trim() === "") {
          missing.push("profilePhoto");
        }
        if (!hasExperienceField(data)) {
          missing.push("experience");
        }
        if (!hasEducationField(data)) {
          missing.push("education");
        }

        if (missing.length === 0) continue;

        // Prefer user email/fcm if available
        let email = data.email || "";
        let fcmToken: string | undefined;
        let phoneNumber = data.phoneNumber || undefined;

        if (data.userId) {
          try {
            const userDoc = await getDoc(doc(db, "users", data.userId));
            if (userDoc.exists()) {
              const userData = userDoc.data();
              email = email || userData.email || "";
              fcmToken = userData.fcmToken;
              phoneNumber = phoneNumber || userData.phone || userData.phoneNumber;
            }
          } catch (err) {
            console.warn("User lookup failed:", err);
          }
        }

        incomplete.push({
          id: doctorDoc.id,
          userId: data.userId || "",
          name: data.name || "Unnamed Doctor",
          email: email || "N/A",
          phoneNumber,
          specialization: data.specialization,
          isVerified: data.isVerified === true,
          missing,
          certificateCount,
          documentsRequestSentAt: data.documentsRequestSentAt?.toDate?.() || null,
          documentsRequestCount: data.documentsRequestCount || 0,
          fcmToken,
        });
      }

      incomplete.sort((a, b) => b.missing.length - a.missing.length);
      setDoctors(incomplete);
    } catch (error) {
      console.error("Error loading incomplete documents:", error);
      toast.error("Failed to load incomplete document list");
    } finally {
      setIsLoading(false);
    }
  };

  const filtered = useMemo(() => {
    const q = searchTerm.toLowerCase();
    return doctors.filter((doctor) => {
      const matchesSearch =
        doctor.name.toLowerCase().includes(q) ||
        doctor.email.toLowerCase().includes(q) ||
        (doctor.specialization || "").toLowerCase().includes(q) ||
        doctor.missing.some((m) => MISSING_DOC_LABELS[m].toLowerCase().includes(q));

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "not_contacted" && !doctor.documentsRequestSentAt) ||
        (statusFilter === "contacted" && !!doctor.documentsRequestSentAt);

      return matchesSearch && matchesStatus;
    });
  }, [doctors, searchTerm, statusFilter]);

  const counts = useMemo(
    () => ({
      total: doctors.length,
      notContacted: doctors.filter((d) => !d.documentsRequestSentAt).length,
      contacted: doctors.filter((d) => !!d.documentsRequestSentAt).length,
    }),
    [doctors]
  );

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === filtered.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filtered.map((d) => d.id)));
    }
  };

  const openContact = (doctor: IncompleteDoctor) => {
    setBulkMode(false);
    setContactTarget(doctor);
  };

  const openBulkContact = () => {
    const targets = doctors.filter((d) => selectedIds.has(d.id));
    if (targets.length === 0) {
      toast.error("Select at least one doctor");
      return;
    }
    setBulkMode(true);
    setContactTarget(null);
  };

  const sendRequestToDoctor = async (doctor: IncompleteDoctor) => {
    if (!doctor.email || doctor.email === "N/A") {
      throw new Error(`No email on file for ${doctor.name}`);
    }

    const missingDocuments = buildMissingDocumentsText(doctor.missing);
    const missingDocumentsList = buildMissingDocumentsListHtml(doctor.missing);

    // Secure send via Cloud Function (Gmail SMTP + Firestore template)
    await sendEmail({
      templateId: "documentRequest",
      recipient: doctor.email,
      variables: {
        doctorName: doctor.name,
        email: doctor.email,
        missingDocuments,
        missingDocumentsList,
      },
    });

    // Keep a lightweight audit trail (no SMTP secrets; content only)
    await addDoc(collection(db, "mail"), {
      to: doctor.email,
      message: {
        subject: DOCUMENT_REQUEST_SUBJECT,
        text: `Hi ${doctor.name},\n\nMissing items:\n${missingDocuments}`,
        html: buildMissingDocumentsListHtml(doctor.missing),
      },
      type: "DOCUMENT_REQUEST",
      delivery: "cloud_function_smtp",
      doctorId: doctor.id,
      userId: doctor.userId || null,
      createdAt: serverTimestamp(),
      createdBy: auth.currentUser?.uid || null,
    });

    if (doctor.fcmToken) {
      await addDoc(collection(db, "fcm_messages"), {
        token: doctor.fcmToken,
        notification: {
          title: "Upload missing documents",
          body: "Please add your missing documents, resume, experience, and education details in the DrStethos app.",
        },
        data: {
          type: "DOCUMENT_REQUEST",
          doctorId: doctor.id,
        },
        createdAt: serverTimestamp(),
      });
    }

    await updateDoc(doc(db, "doctors", doctor.id), {
      documentsRequestSentAt: new Date(),
      documentsRequestCount: (doctor.documentsRequestCount || 0) + 1,
      lastDocumentsRequestMissing: doctor.missing,
      updatedAt: new Date(),
    });

    if (doctor.userId) {
      try {
        await updateDoc(doc(db, "users", doctor.userId), {
          documentsRequestSentAt: new Date(),
          documentsRequestCount: (doctor.documentsRequestCount || 0) + 1,
        });
      } catch {
        // user doc may not exist / may be permission limited
      }
    }
  };

  const handleSend = async () => {
    const targets = bulkMode
      ? doctors.filter((d) => selectedIds.has(d.id))
      : contactTarget
      ? [contactTarget]
      : [];

    if (targets.length === 0) {
      toast.error("No doctors selected");
      return;
    }

    setIsSending(true);
    try {
      let successCount = 0;
      let failCount = 0;
      for (const doctor of targets) {
        try {
          await sendRequestToDoctor(doctor);
          successCount += 1;
        } catch (err) {
          console.error(err);
          failCount += 1;
        }
      }

      if (successCount > 0) {
        setDoctors((prev) =>
          prev.map((d) =>
            targets.some((t) => t.id === d.id)
              ? {
                  ...d,
                  documentsRequestSentAt: new Date(),
                  documentsRequestCount: (d.documentsRequestCount || 0) + 1,
                }
              : d
          )
        );
      }

      if (successCount > 0 && failCount === 0) {
        toast.success(
          successCount === 1
            ? "Document upload request sent"
            : `Document upload requests sent to ${successCount} doctors`
        );
      } else if (successCount > 0 && failCount > 0) {
        toast.warning(`Sent ${successCount}, failed ${failCount}`);
      } else {
        toast.error("Failed to send request. Check doctor emails.");
      }

      if (successCount > 0) {
        setContactTarget(null);
        setBulkMode(false);
        setSelectedIds(new Set());
      }
    } catch (error) {
      console.error("Failed to send document request:", error);
      toast.error("Failed to send request. Please try again.");
    } finally {
      setIsSending(false);
    }
  };

  const previewDoctor = bulkMode
    ? doctors.find((d) => selectedIds.has(d.id))
    : contactTarget;

  if (isLoading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-10 rounded-lg bg-slate-200/70" />
        <div className="h-72 rounded-lg bg-slate-200/70" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-x-5 gap-y-1 text-[12px] text-slate-500 border-b border-slate-100 pb-3">
        <span>
          Incomplete <span className="font-semibold text-slate-900 tabular-nums">{counts.total}</span>
        </span>
        <span>
          Not contacted{" "}
          <span className="font-semibold text-amber-600 tabular-nums">{counts.notContacted}</span>
        </span>
        <span>
          Contacted{" "}
          <span className="font-semibold text-blue-600 tabular-nums">{counts.contacted}</span>
        </span>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
            <Input
              placeholder="Search doctors or missing documents..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-9 pl-9 text-sm border-slate-200 bg-slate-50/60"
            />
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            {([
              { id: "all", label: "All" },
              { id: "not_contacted", label: "Not contacted" },
              { id: "contacted", label: "Contacted" },
            ] as const).map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setStatusFilter(tab.id)}
                className={`h-8 rounded-md px-3 text-xs transition-colors ${
                  statusFilter === tab.id
                    ? "bg-slate-900 text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200/80"
                }`}
              >
                {tab.label}
              </button>
            ))}

            <Button
              size="sm"
              className="h-8 text-xs bg-blue-600 hover:bg-blue-700"
              disabled={selectedIds.size === 0}
              onClick={openBulkContact}
            >
              <Send className="mr-1.5 h-3.5 w-3.5" />
              Request selected ({selectedIds.size})
            </Button>
          </div>
      </div>

        <div className="overflow-x-auto -mx-1">
          <table className="w-full min-w-[900px] text-left">
            <thead>
              <tr className="border-b border-slate-200 text-[11px] uppercase tracking-wide text-slate-500">
                <th className="px-2 py-2.5 font-medium w-10 sm:px-3">
                  <Checkbox
                    checked={filtered.length > 0 && selectedIds.size === filtered.length}
                    onCheckedChange={toggleSelectAll}
                    aria-label="Select all"
                  />
                </th>
                <th className="px-2 py-2.5 font-medium sm:px-3">Doctor</th>
                <th className="px-2 py-2.5 font-medium sm:px-3">Missing documents</th>
                <th className="px-2 py-2.5 font-medium sm:px-3">Request status</th>
                <th className="px-2 py-2.5 font-medium text-right sm:px-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((doctor) => (
                <tr key={doctor.id} className="hover:bg-slate-50">
                  <td className="px-2 py-2.5 sm:px-3">
                    <Checkbox
                      checked={selectedIds.has(doctor.id)}
                      onCheckedChange={() => toggleSelect(doctor.id)}
                      aria-label={`Select ${doctor.name}`}
                    />
                  </td>
                  <td className="px-2 py-2.5 sm:px-3">
                    <div className="min-w-0">
                      <p className="text-[13px] font-medium text-slate-900 truncate">
                        {doctor.name}
                      </p>
                      <p className="text-[12px] text-slate-500 truncate">{doctor.email}</p>
                      {doctor.specialization && (
                        <p className="text-[11px] text-slate-400 mt-0.5">{doctor.specialization}</p>
                      )}
                    </div>
                  </td>
                  <td className="px-2 py-2.5 sm:px-3">
                    <div className="flex flex-wrap gap-1.5">
                      {doctor.missing.map((key) => (
                        <span
                          key={key}
                          className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-700"
                        >
                          <FileWarning className="h-3 w-3" />
                          {MISSING_DOC_LABELS[key]}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-2 py-2.5 sm:px-3">
                    {doctor.documentsRequestSentAt ? (
                      <div>
                        <span className="text-[12px] font-medium text-blue-700">Contacted</span>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          {doctor.documentsRequestSentAt.toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                          {doctor.documentsRequestCount > 1
                            ? ` · ${doctor.documentsRequestCount} times`
                            : ""}
                        </p>
                      </div>
                    ) : (
                      <span className="text-[12px] font-medium text-slate-500">Not contacted</span>
                    )}
                  </td>
                  <td className="px-2 py-2.5 sm:px-3">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 px-2 text-xs text-slate-600 hover:text-blue-700 hover:bg-blue-50"
                        onClick={() => navigate(`/admin/doctor/${doctor.id}`)}
                        title="View profile"
                      >
                        <Eye className="h-3.5 w-3.5" />
                      </Button>
                      {doctor.phoneNumber && (
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 px-2 text-xs text-slate-600 hover:text-blue-700 hover:bg-blue-50"
                          asChild
                        >
                          <a href={`tel:${doctor.phoneNumber}`} title="Call">
                            <Phone className="h-3.5 w-3.5" />
                          </a>
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 px-2.5 text-xs text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                        onClick={() => openContact(doctor)}
                      >
                        <Mail className="mr-1 h-3.5 w-3.5" />
                        Request upload
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filtered.length === 0 && (
            <div className="py-14 text-center">
              <p className="text-sm text-slate-400">
                {doctors.length === 0
                  ? "No doctors with incomplete documents found"
                  : "No doctors match your filters"}
              </p>
            </div>
          )}
        </div>

        <div className="border-t border-slate-100 pt-2.5 text-[11px] text-slate-400">
          Showing {filtered.length} of {doctors.length}
        </div>

      <Dialog
        open={bulkMode || !!contactTarget}
        onOpenChange={(open) => {
          if (!open && !isSending) {
            setBulkMode(false);
            setContactTarget(null);
          }
        }}
      >
        <DialogContent className="flex max-h-[92vh] flex-col gap-0 overflow-hidden p-0 sm:max-w-2xl">
          <DialogHeader className="shrink-0 border-b border-slate-100 px-6 py-4">
            <DialogTitle className="text-base font-semibold">
              {bulkMode
                ? `Request document upload (${selectedIds.size})`
                : "Request document upload"}
            </DialogTitle>
            <DialogDescription className="text-sm">
              {bulkMode
                ? "Review the email below. Each doctor receives their own name and missing document list."
                : `This is the exact email that will be sent to ${contactTarget?.name}.`}
            </DialogDescription>
          </DialogHeader>

          {previewDoctor && (
            <div className="min-h-0 flex-1 overflow-y-auto px-6 py-4">
              <DocumentRequestEmailPreview
                doctorName={previewDoctor.name}
                recipientEmail={previewDoctor.email}
                missing={previewDoctor.missing}
                bulkNote={
                  bulkMode && selectedIds.size > 1
                    ? `Showing preview for ${previewDoctor.name}. The other ${
                        selectedIds.size - 1
                      } selected doctor${
                        selectedIds.size - 1 === 1 ? "" : "s"
                      } will receive the same layout with their own details.`
                    : undefined
                }
              />
            </div>
          )}

          <DialogFooter className="shrink-0 gap-2 border-t border-slate-100 px-6 py-4 sm:gap-0">
            <Button
              variant="outline"
              disabled={isSending}
              onClick={() => {
                setBulkMode(false);
                setContactTarget(null);
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSend}
              disabled={isSending}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isSending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Send Request
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminIncompleteDocuments;
