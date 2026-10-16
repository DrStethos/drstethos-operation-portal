import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  doc,
  getDoc,
  updateDoc,
  collection,
  getDocs,
} from "firebase/firestore";
import { auth, db } from "@/lib/firebase";

import { ProfileReviewHeader } from "@/components/admin/profileReview/ProfileReviewHeader";
import {
  DocumentLink,
  InfoGrid,
  InfoItem,
  ProfileSection,
} from "@/components/admin/profileReview/ProfileSection";
import { VerificationActionsPanel } from "@/components/admin/profileReview/VerificationActionsPanel";
import { ProfileApprovalConfirmDialog } from "@/components/email/ProfileApprovalConfirmDialog";
import { ProfileRejectionConfirmDialog } from "@/components/email/ProfileRejectionConfirmDialog";

import { toast } from "sonner";

import {
  User,
  Briefcase,
  FileText,
  Award,
  Calendar,
} from "lucide-react";
import {
  sendApprovalEmail,
  sendRejectionEmail,
} from "@/helpers/emailHelper";
import { sendApprovalNotification } from "@/helpers/notificationHelper";

interface Certificate {
  id: string;
  fileName: string;
  fileUrl: string;
  createdAt: any;
}

interface DoctorProfileType {
  id: string;
  userId: string;
  name: string;
  email: string;
  phoneNumber?: string;
  profilePhotoUrl?: string;
  age?: number;
  gender?: string;
  mcaNumber?: string;
  specialization: string;
  yearsOfExperience: number;
  qualifications?: string;
  bio?: string;
  location?: string;
  createdAt: any;
  updatedAt: any;
  isVerified: boolean;
  isActive: boolean;
}

const DoctorProfile = () => {
  const { profileId } = useParams<{ profileId: string }>();
  const navigate = useNavigate();

  const [doctor, setDoctor] = useState<DoctorProfileType | null>(null);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  // rejection dialog
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [showApproveDialog, setShowApproveDialog] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");

  // Fetch doctor profile
  useEffect(() => {
    if (!profileId) return;
    fetchDoctorProfile();
    fetchCertificates();
  }, [profileId]);

  const fetchDoctorProfile = async () => {
    try {
      const ref = doc(db, "doctors", profileId!);
      const snap = await getDoc(ref);

      if (!snap.exists()) {
        toast.error("Doctor profile not found");
        navigate("/admin/verify");
        return;
      }

      setDoctor({ id: snap.id, ...(snap.data() as any) });
    } catch (err) {
      console.error(err);
      toast.error("Failed to load doctor profile");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCertificates = async () => {
    try {
      const certRef = collection(db, "doctors", profileId!, "certificates");
      const certSnap = await getDocs(certRef);
      const list: Certificate[] = [];
      certSnap.forEach((doc) => list.push({ id: doc.id, ...(doc.data() as any) }));
      setCertificates(list);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load certificates");

    }
  };

  // Approve doctor
  const handleApprove = async () => {
    if (!doctor || !profileId) return;

    setIsProcessing(true);
    try {
      if (typeof auth.authStateReady === "function") {
        await auth.authStateReady();
      }
      const admin = auth.currentUser;
      if (!admin) {
        toast.error("Firebase admin session not found. Please sign out (bottom-left) and sign in again with your Firebase admin account.");
        return;
      }

      const verifiedAt = new Date();
      const doctorRef = doc(db, "doctors", profileId);
      const userRef = doc(db, "users", doctor.userId);
      await updateDoc(doctorRef, {
        isVerified: true,
        verifiedAt,
        updatedAt: verifiedAt,
      });
      await updateDoc(userRef, {
        isVerified: true,
        verifiedAt,
        verifiedByAdminUid: admin.uid,
        verifiedByAdminEmail: admin.email || "N/A",
        rejectedAt: null,
        rejectionReason: null,
        rejectedByAdminUid: null,
        rejectedByAdminEmail: null,
      });

      const userSnapshot = await getDoc(userRef);
      const userData = userSnapshot.data();
      setDoctor({ ...doctor, isVerified: true, verifiedAt, updatedAt: verifiedAt });

      if (typeof userData?.fcmToken === "string" && userData.fcmToken) {
        try {
          await sendApprovalNotification({
            userId: doctor.userId,
            fcmToken: userData.fcmToken,
            name: doctor.name,
            status: "APPROVED",
            profileType: "DOCTOR",
            profileId,
          });
        } catch (notificationError) {
          console.error("Doctor approval notification failed:", notificationError);
          toast.warning("Doctor verified, but the notification could not be sent.");
        }
      }

      const emailSent = await sendApprovalEmail({
        toEmail: doctor.email,
        profileName: doctor.name,
        profileType: "Doctor",
        dashboardLink: "https://drstethos.com",
      });
      setShowApproveDialog(false);
      toast.success(emailSent
        ? "Doctor verified successfully."
        : "Doctor verified, but the email could not be sent.");
    } catch (error) {
      console.error("Error approving doctor:", error);
      toast.error("Failed to verify doctor. Check Firebase admin access and try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  // Reject doctor
  const confirmReject = async () => {
    if (!doctor || !profileId) return;
    if (!rejectionReason.trim()) {
      toast.error("Please enter a reason");
      return;
    }

    setIsProcessing(true);

    try {
      if (typeof auth.authStateReady === "function") {
        await auth.authStateReady();
      }
      const admin = auth.currentUser;
      if (!admin) {
        toast.error("Firebase admin session not found. Please sign out (bottom-left) and sign in again with your Firebase admin account.");
        return;
      }

      const rejectedAt = new Date();
      const reason = rejectionReason.trim();
      const doctorRef = doc(db, "doctors", profileId);
      const userRef = doc(db, "users", doctor.userId);
      await updateDoc(doctorRef, {
        isVerified: false,
        updatedAt: rejectedAt,
      });
      await updateDoc(userRef, {
        isVerified: false,
        rejectionReason: reason,
        rejectedAt,
        rejectedByAdminUid: admin.uid,
        rejectedByAdminEmail: admin.email || "N/A",
      });

      const userSnapshot = await getDoc(userRef);
      const userData = userSnapshot.data();
      setDoctor({ ...doctor, isVerified: false, updatedAt: rejectedAt });

      if (typeof userData?.fcmToken === "string" && userData.fcmToken) {
        try {
          await sendApprovalNotification({
            userId: doctor.userId,
            fcmToken: userData.fcmToken,
            name: doctor.name,
            status: "REJECTED",
            rejectionReason: reason,
            profileType: "DOCTOR",
            profileId,
          });
        } catch (notificationError) {
          console.error("Doctor rejection notification failed:", notificationError);
          toast.warning("Doctor rejection was saved, but the notification could not be sent.");
        }
      }

      const emailSent = await sendRejectionEmail({
        toEmail: doctor.email,
        profileName: doctor.name,
        profileType: "Doctor",
        rejectionReason: reason,
      });
      toast.success(emailSent
        ? "Doctor rejection saved successfully."
        : "Doctor rejection saved, but the email could not be sent.");
    } catch (error) {
      console.error("Error rejecting doctor:", error);
      toast.error("Failed to reject doctor. Check Firebase admin access and try again.");
    } finally {
      setIsProcessing(false);
      setShowRejectDialog(false);
      setRejectionReason("");
    }
  };

  const handleRejectClick = () => setShowRejectDialog(true);

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-24 rounded-xl bg-slate-200/70" />
        <div className="grid gap-4 lg:grid-cols-3">
          <div className="h-64 rounded-xl bg-slate-200/70 lg:col-span-2" />
          <div className="h-48 rounded-xl bg-slate-200/70" />
        </div>
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white py-12 text-center text-slate-500">
        Doctor not found
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <ProfileReviewHeader
        name={doctor.name}
        subtitle="Doctor profile review"
        isVerified={doctor.isVerified}
        photoUrl={doctor.profilePhotoUrl}
        onBack={() => navigate("/admin/verify")}
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <ProfileSection title="Contact & identity" icon={User}>
            <InfoGrid>
              <InfoItem label="Email" value={doctor.email} />
              <InfoItem label="Phone" value={doctor.phoneNumber} />
              <InfoItem
                label="Gender"
                value={doctor.gender ? (
                  <span className="capitalize">{doctor.gender}</span>
                ) : undefined}
              />
              <InfoItem label="Age" value={doctor.age} />
              <InfoItem label="Location" value={doctor.location} />
              <InfoItem label="MCA number" value={doctor.mcaNumber} />
            </InfoGrid>
          </ProfileSection>

          <ProfileSection title="Professional details" icon={Briefcase}>
            <InfoGrid>
              <InfoItem label="Specialization" value={doctor.specialization} />
              <InfoItem
                label="Experience"
                value={
                  doctor.yearsOfExperience !== undefined
                    ? `${doctor.yearsOfExperience} years`
                    : undefined
                }
              />
              <InfoItem label="Qualifications" value={doctor.qualifications} className="sm:col-span-2" />
            </InfoGrid>
          </ProfileSection>

          {doctor.bio ? (
            <ProfileSection title="Bio" icon={FileText}>
              <p className="whitespace-pre-wrap text-sm leading-relaxed text-slate-700">{doctor.bio}</p>
            </ProfileSection>
          ) : null}

          {certificates.length > 0 ? (
            <ProfileSection title="Certificates & documents" icon={Award}>
              <div className="space-y-2">
                {certificates.map((c) => (
                  <DocumentLink key={c.id} label={c.fileName || "Certificate"} href={c.fileUrl} />
                ))}
              </div>
            </ProfileSection>
          ) : null}
        </div>

        <VerificationActionsPanel
          isVerified={doctor.isVerified}
          isProcessing={isProcessing}
          onApprove={() => setShowApproveDialog(true)}
          onReject={handleRejectClick}
        >
          <ProfileSection title="Timeline" icon={Calendar}>
            <div className="space-y-3 text-sm">
              <InfoItem
                label="Submitted"
                value={doctor.createdAt?.toDate?.().toLocaleString("en-IN")}
              />
              <InfoItem
                label="Last updated"
                value={doctor.updatedAt?.toDate?.().toLocaleString("en-IN")}
              />
            </div>
          </ProfileSection>
        </VerificationActionsPanel>
      </div>

      <ProfileApprovalConfirmDialog
        open={showApproveDialog}
        onOpenChange={setShowApproveDialog}
        profileName={doctor.name}
        profileType="Doctor"
        recipientEmail={doctor.email}
        isProcessing={isProcessing}
        onConfirm={handleApprove}
      />

      <ProfileRejectionConfirmDialog
        open={showRejectDialog}
        onOpenChange={(open) => {
          setShowRejectDialog(open);
          if (!open) setRejectionReason("");
        }}
        profileName={doctor.name}
        profileType="Doctor"
        recipientEmail={doctor.email}
        rejectionReason={rejectionReason}
        onRejectionReasonChange={setRejectionReason}
        isProcessing={isProcessing}
        onConfirm={confirmReject}
      />
    </div>
  );
};

export default DoctorProfile;
