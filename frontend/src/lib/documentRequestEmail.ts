export const DOCUMENT_REQUEST_LOGO_URL =
  "https://firebasestorage.googleapis.com/v0/b/drstethos-app.firebasestorage.app/o/branding%2Flogo.png?alt=media&token=ed47366a-0bce-4f88-9c94-83e4c50c69fc";

export const DOCUMENT_REQUEST_SUBJECT =
  "Action required: Complete your DrStethos profile";

export type MissingDocKey =
  | "certificates"
  | "resume"
  | "mcaNumber"
  | "profilePhoto"
  | "experience"
  | "education";

export const MISSING_DOC_LABELS: Record<MissingDocKey, string> = {
  certificates: "Medical certificates",
  resume: "Resume",
  mcaNumber: "MCA / license number",
  profilePhoto: "Profile photo",
  experience: "Experience details",
  education: "Education details",
};

export const buildMissingDocumentsText = (missing: MissingDocKey[]) =>
  missing.map((key) => `• ${MISSING_DOC_LABELS[key]}`).join("\n");

export const buildMissingDocumentsListHtml = (missing: MissingDocKey[]) =>
  `<ul style="margin:16px 0;padding-left:20px;color:#334155">` +
  missing
    .map(
      (key) =>
        `<li style="margin-bottom:8px">${MISSING_DOC_LABELS[key]}</li>`
    )
    .join("") +
  "</ul>";
