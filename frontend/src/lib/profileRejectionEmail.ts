export const PROFILE_REJECTION_LOGO_URL =
  "https://firebasestorage.googleapis.com/v0/b/drstethos-app.firebasestorage.app/o/branding%2Flogo.png?alt=media&token=ed47366a-0bce-4f88-9c94-83e4c50c69fc";

export const getRejectionSubject = (profileType: string) =>
  String(profileType).toLowerCase() === "doctor"
    ? "Update on your DrStethos doctor profile verification"
    : "Update on your DrStethos hospital profile verification";

export const getRejectionTemplateId = (profileType: string) =>
  String(profileType).toLowerCase() === "doctor"
    ? "doctorRejection"
    : "hospitalRejection";
