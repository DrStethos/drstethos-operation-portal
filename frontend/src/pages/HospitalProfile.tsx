import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { Badge } from "@/components/ui/badge";
import { ProfileReviewHeader } from "@/components/admin/profileReview/ProfileReviewHeader";
import {
  DocumentLink,
  InfoGrid,
  InfoItem,
  ProfileSection,
} from "@/components/admin/profileReview/ProfileSection";
import { VerificationActionsPanel } from "@/components/admin/profileReview/VerificationActionsPanel";
import { toast } from "sonner";
import {
  Building2,
  MapPin,
  Phone,
  FileText,
  Calendar,
} from "lucide-react";
import { ProfileApprovalConfirmDialog } from "@/components/email/ProfileApprovalConfirmDialog";
import { ProfileRejectionConfirmDialog } from "@/components/email/ProfileRejectionConfirmDialog";
import {
  sendApprovalEmail,
  sendRejectionEmail,
} from "@/helpers/emailHelper";
import { sendApprovalNotification } from "@/helpers/notificationHelper";

interface HospitalProfile {
  id: string;
  userId: string;
  name: string;
  hospitalType: string;
  customHospitalType?: string;
  licenseNumber: string;
  profilePhotoUrl?: string;
  address: string;
  city: string;
  state: string;
  pinCode: string;
  email: string;
  contactNumber: string;
  website?: string;
  specialization: string;
  licenseCertificateUrl?: string;
  aboutHospital?: string;
  profileViewsCount: number;
  lastViewsReset: any;
  createdAt: any;
  updatedAt: any;
  isVerified: boolean;
  isActive: boolean;
}

interface UserData {
  verifiedAt?: any;
  verifiedByAdminUid?: string;
  verifiedByAdminEmail?: string;
  rejectedAt?: any;
  rejectedByAdminUid?: string;
  rejectedByAdminEmail?: string;
  rejectionReason?: string;
}

const HospitalProfile = () => {
  const { profileId } = useParams<{ profileId: string }>();
  const navigate = useNavigate();
  const [hospital, setHospital] = useState<HospitalProfile | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [showApproveDialog, setShowApproveDialog] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");

  useEffect(() => {
    if (profileId) {
      fetchHospitalProfile();
    }
  }, [profileId]);

  const fetchHospitalProfile = async () => {
    try {
      if (!profileId) return;

      const hospitalRef = doc(db, "hospitals", profileId);
      const hospitalDoc = await getDoc(hospitalRef);

      if (hospitalDoc.exists()) {
        const hospitalData = {
          id: hospitalDoc.id,
          ...hospitalDoc.data(),
        } as HospitalProfile;
        setHospital(hospitalData);

        // Fetch user data to get admin verification/rejection details
        const userRef = doc(db, "users", hospitalData.userId);
        const userDoc = await getDoc(userRef);
        if (userDoc.exists()) {
          setUserData(userDoc.data() as UserData);
        }
      } else {
        toast.error("Hospital profile not found");
        navigate("/admin/verify");
      }
    } catch (error) {
      console.error("Error fetching hospital profile:", error);
      toast.error("Failed to load hospital profile");
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprove = async () => {
    if (!hospital || !profileId) return;

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
      const hospitalRef = doc(db, "hospitals", profileId);
      const userRef = doc(db, "users", hospital.userId);
      await updateDoc(hospitalRef, {
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
      const user = userSnapshot.data();
      setHospital((current) => current ? { ...current, isVerified: true, verifiedAt, updatedAt: verifiedAt } : current);
      setUserData((current) => ({
        ...current,
        verifiedAt,
        verifiedByAdminUid: admin.uid,
        verifiedByAdminEmail: admin.email || "N/A",
        rejectedAt: null,
        rejectionReason: null,
        rejectedByAdminUid: null,
        rejectedByAdminEmail: null,
      }));

      if (typeof user?.fcmToken === "string" && user.fcmToken) {
        try {
          await sendApprovalNotification({
            userId: hospital.userId,
            fcmToken: user.fcmToken,
            name: hospital.name,
            status: "APPROVED",
            profileType: "HOSPITAL",
            profileId,
          });
        } catch (notificationError) {
          console.error("Hospital approval notification failed:", notificationError);
          toast.warning("Hospital verified, but the notification could not be sent.");
        }
      }

      const emailSent = await sendApprovalEmail({
        toEmail: hospital.email,
        profileName: hospital.name,
        profileType: "Hospital",
        dashboardLink: "https://drstethos.com",
      });
      setShowApproveDialog(false);
      toast.success(emailSent
        ? "Hospital verified successfully."
        : "Hospital verified, but the email could not be sent.");
    } catch (error) {
      console.error("Error approving hospital:", error);
      toast.error("Failed to verify hospital. Check Firebase admin access and try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReject = () => {
    setShowRejectDialog(true);
  };

  const confirmReject = async () => {
    if (!hospital || !profileId) return;
    if (!rejectionReason.trim()) {
      toast.error("Please provide a reason for rejection");
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
      const hospitalRef = doc(db, "hospitals", profileId);
      const userRef = doc(db, "users", hospital.userId);
      await updateDoc(hospitalRef, {
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
      const user = userSnapshot.data();
      setHospital((current) => current ? { ...current, isVerified: false } : current);
      setUserData((current) => ({
        ...current,
        rejectedAt,
        rejectionReason: reason,
        rejectedByAdminUid: admin.uid,
        rejectedByAdminEmail: admin.email || "N/A",
      }));

      if (typeof user?.fcmToken === "string" && user.fcmToken) {
        try {
          await sendApprovalNotification({
            userId: hospital.userId,
            fcmToken: user.fcmToken,
            name: hospital.name,
            status: "REJECTED",
            rejectionReason: reason,
            profileType: "HOSPITAL",
            profileId,
          });
        } catch (notificationError) {
          console.error("Hospital rejection notification failed:", notificationError);
          toast.warning("Hospital rejection was saved, but the notification could not be sent.");
        }
      }

      const emailSent = await sendRejectionEmail({
        toEmail: hospital.email,
        profileName: hospital.name,
        profileType: "Hospital",
        rejectionReason: reason,
      });
      setShowRejectDialog(false);
      setRejectionReason("");
      toast.success(emailSent
        ? "Hospital rejection saved successfully."
        : "Hospital rejection saved, but the email could not be sent.");
    } catch (error) {
      console.error("Error rejecting hospital:", error);
      toast.error("Failed to reject hospital. Check Firebase admin access and try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-8 bg-slate-200 rounded w-1/4"></div>
        <div className="h-64 bg-slate-200 rounded"></div>
        <div className="h-64 bg-slate-200 rounded"></div>
      </div>
    );
  }

  if (!hospital) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white py-12 text-center text-slate-500">
        Hospital profile not found
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <ProfileReviewHeader
        name={hospital.name}
        subtitle="Hospital profile review"
        isVerified={hospital.isVerified}
        photoUrl={hospital.profilePhotoUrl}
        onBack={() => navigate("/admin/verify")}
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <ProfileSection title="Hospital details" icon={Building2}>
            <InfoGrid>
              <InfoItem
                label="Hospital type"
                value={
                  hospital.hospitalType === "other"
                    ? hospital.customHospitalType
                    : hospital.hospitalType
                }
              />
              <InfoItem label="License number" value={hospital.licenseNumber} />
              <InfoItem label="Specialization" value={hospital.specialization} />
              <InfoItem
                label="Status"
                value={
                  <Badge variant={hospital.isActive ? "default" : "secondary"}>
                    {hospital.isActive ? "Active" : "Inactive"}
                  </Badge>
                }
              />
            </InfoGrid>
          </ProfileSection>

          <ProfileSection title="Contact" icon={Phone}>
            <InfoGrid>
              <InfoItem label="Email" value={hospital.email} />
              <InfoItem label="Phone" value={hospital.contactNumber} />
              <InfoItem
                label="Website"
                value={
                  hospital.website ? (
                    <a
                      href={hospital.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {hospital.website}
                    </a>
                  ) : undefined
                }
                className="sm:col-span-2"
              />
            </InfoGrid>
          </ProfileSection>

          <ProfileSection title="Location" icon={MapPin}>
            <p className="text-sm font-medium text-slate-800">{hospital.address}</p>
            <p className="mt-1 text-sm text-slate-600">
              {hospital.city}, {hospital.state} – {hospital.pinCode}
            </p>
          </ProfileSection>

          {hospital.aboutHospital ? (
            <ProfileSection title="About" icon={FileText}>
              <p className="whitespace-pre-wrap text-sm leading-relaxed text-slate-700">
                {hospital.aboutHospital}
              </p>
            </ProfileSection>
          ) : null}

          {hospital.licenseCertificateUrl ? (
            <ProfileSection title="License certificate" icon={FileText}>
              <DocumentLink
                label="View license certificate"
                href={hospital.licenseCertificateUrl}
              />
            </ProfileSection>
          ) : null}
        </div>

        <VerificationActionsPanel
          isVerified={hospital.isVerified}
          isProcessing={isProcessing}
          onApprove={() => setShowApproveDialog(true)}
          onReject={handleReject}
        >
          {userData && (userData.rejectionReason || userData.rejectedAt) ? (
            <ProfileSection title="Previous rejection" className="border-red-200 bg-red-50/40">
              <div className="space-y-2 text-sm">
                {userData.rejectedByAdminEmail ? (
                  <InfoItem label="Rejected by" value={userData.rejectedByAdminEmail} />
                ) : null}
                {userData.rejectedAt ? (
                  <InfoItem
                    label="Rejected at"
                    value={
                      typeof userData.rejectedAt?.toDate === "function"
                        ? userData.rejectedAt.toDate().toLocaleString("en-IN")
                        : new Date(userData.rejectedAt).toLocaleString("en-IN")
                    }
                  />
                ) : null}
                {userData.rejectionReason ? (
                  <div className="rounded-lg border border-red-200 bg-white p-3 text-sm text-slate-700">
                    <p className="text-xs font-medium uppercase tracking-wide text-red-500">Reason</p>
                    <p className="mt-1">{userData.rejectionReason}</p>
                  </div>
                ) : null}
              </div>
            </ProfileSection>
          ) : null}

          <ProfileSection title="Timeline" icon={Calendar}>
            <div className="space-y-3 text-sm">
              <InfoItem
                label="Submitted"
                value={hospital.createdAt?.toDate?.().toLocaleString("en-IN")}
              />
              <InfoItem
                label="Last updated"
                value={hospital.updatedAt?.toDate?.().toLocaleString("en-IN")}
              />
              <InfoItem label="User ID" value={<span className="font-mono text-xs">{hospital.userId}</span>} />
            </div>
          </ProfileSection>
        </VerificationActionsPanel>
      </div>

      <ProfileApprovalConfirmDialog
        open={showApproveDialog}
        onOpenChange={setShowApproveDialog}
        profileName={hospital.name}
        profileType="Hospital"
        recipientEmail={hospital.email}
        isProcessing={isProcessing}
        onConfirm={handleApprove}
      />

      <ProfileRejectionConfirmDialog
        open={showRejectDialog}
        onOpenChange={(open) => {
          setShowRejectDialog(open);
          if (!open) setRejectionReason("");
        }}
        profileName={hospital.name}
        profileType="Hospital"
        recipientEmail={hospital.email}
        rejectionReason={rejectionReason}
        onRejectionReasonChange={setRejectionReason}
        isProcessing={isProcessing}
        onConfirm={confirmReject}
      />
    </div>
  );
};

export default HospitalProfile;
