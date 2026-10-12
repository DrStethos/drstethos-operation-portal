import emailjs from "@emailjs/browser";
import { sendEmail } from "@/helpers/cloudEmailHelper";
import { getApprovalTemplateId } from "@/lib/profileApprovalEmail";
import { getRejectionTemplateId } from "@/lib/profileRejectionEmail";

const SERVICE_ID = "service_w6oztfn";
const APPROVAL_TEMPLATE_ID = "template_sw8dute";
const REJECTION_TEMPLATE_ID = "template_r659bp8";
const PUBLIC_KEY = "25mYPFciSU8myaCQI";

type ProfileTypeLabel = "Doctor" | "Hospital" | string;

interface ApprovalEmailArgs {
  toEmail: string;
  profileName: string;
  profileType?: ProfileTypeLabel;
  dashboardLink?: string;
}

interface RejectionEmailArgs {
  toEmail: string;
  profileName: string;
  profileType?: ProfileTypeLabel;
  rejectionReason: string;
}

const isDoctor = (profileType: ProfileTypeLabel = "Hospital") =>
  String(profileType).toLowerCase() === "doctor";

/**
 * Prefer Cloud Function (Gmail SMTP + Firestore templates).
 * Fall back to EmailJS if the function is not deployed / fails.
 * EmailJS is kept temporarily until SMTP is verified in production.
 */
async function sendViaCloudOrEmailJs(options: {
  cloud: () => Promise<unknown>;
  emailJs: () => Promise<unknown>;
  label: string;
}): Promise<boolean> {
  try {
    await options.cloud();
    return true;
  } catch (cloudError) {
    console.warn(
      `${options.label}: Cloud Function failed, falling back to EmailJS`,
      cloudError
    );
    try {
      await options.emailJs();
      return true;
    } catch (emailJsError) {
      console.error(`${options.label}: EmailJS fallback failed`, emailJsError);
      return false;
    }
  }
}

export const sendApprovalEmail = async ({
  toEmail,
  profileName,
  profileType = "Hospital",
  dashboardLink = "https://drstethos.com",
}: ApprovalEmailArgs) => {
  const templateId = getApprovalTemplateId(profileType);

  return sendViaCloudOrEmailJs({
    label: "Approval email",
    cloud: () =>
      sendEmail({
        templateId,
        recipient: toEmail,
        variables: {
          profileName,
          profileType,
          profile_name: profileName,
          profile_type: profileType,
          email: toEmail,
          dashboardLink,
          dashboard_link: dashboardLink,
          doctorName: String(profileType).toLowerCase() === "doctor" ? profileName : "",
          hospitalName: String(profileType).toLowerCase() === "hospital" ? profileName : "",
          verificationDate: new Date().toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          }),
        },
      }),
    emailJs: () =>
      emailjs.send(
        SERVICE_ID,
        APPROVAL_TEMPLATE_ID,
        {
          profile_name: profileName,
          profile_type: profileType,
          to_email: toEmail,
          dashboard_link: dashboardLink,
        },
        PUBLIC_KEY
      ),
  });
};

export const sendRejectionEmail = async ({
  toEmail,
  profileName,
  profileType = "Hospital",
  rejectionReason,
}: RejectionEmailArgs) => {
  const templateId = getRejectionTemplateId(profileType);

  return sendViaCloudOrEmailJs({
    label: "Rejection email",
    cloud: () =>
      sendEmail({
        templateId,
        recipient: toEmail,
        variables: {
          profileName,
          profileType,
          profile_name: profileName,
          profile_type: profileType,
          email: toEmail,
          rejectionReason,
          rejection_reason: rejectionReason,
          doctorName: isDoctor(profileType) ? profileName : "",
          hospitalName: !isDoctor(profileType) ? profileName : "",
        },
      }),
    emailJs: () =>
      emailjs.send(
        SERVICE_ID,
        REJECTION_TEMPLATE_ID,
        {
          profile_name: profileName,
          profile_type: profileType,
          rejection_reason: rejectionReason,
          to_email: toEmail,
        },
        PUBLIC_KEY
      ),
  });
};
