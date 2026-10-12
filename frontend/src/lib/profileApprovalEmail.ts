export const PROFILE_APPROVAL_LOGO_URL =
  "https://firebasestorage.googleapis.com/v0/b/drstethos-app.firebasestorage.app/o/branding%2Flogo.png?alt=media&token=ed47366a-0bce-4f88-9c94-83e4c50c69fc";

export const DEFAULT_DASHBOARD_LINK = "https://drstethos.com";

export const getApprovalSubject = (profileType: string) =>
  String(profileType).toLowerCase() === "doctor"
    ? "Welcome to DrStethos — your doctor profile is approved"
    : "Welcome to DrStethos — your hospital profile is approved";

export const getApprovalTemplateId = (profileType: string) =>
  String(profileType).toLowerCase() === "doctor"
    ? "doctorApproval"
    : "hospitalApproval";
