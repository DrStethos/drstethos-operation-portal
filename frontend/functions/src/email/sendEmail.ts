import { onCall, HttpsError } from "firebase-functions/v2/https";
import { db } from "../firebaseAdmin";
import { assertAdmin, assertEmailRateLimit } from "../auth/assertAdmin";
import {
  createMicrosoftSmtpTransporter,
  smtpPassword,
  smtpUser,
} from "./smtpTransport";
import {
  isValidEmail,
  isValidTemplateId,
  renderTemplate,
  sanitizeVariables,
} from "./templateUtils";

interface SendEmailRequest {
  templateId?: string;
  recipient?: string;
  variables?: Record<string, unknown>;
}

interface EmailTemplateDoc {
  subject?: string;
  html?: string;
  text?: string;
  enabled?: boolean;
  description?: string;
}

/**
 * Callable: sendEmail
 *
 * Frontend payload:
 * {
 *   templateId: "doctorApproval",
 *   recipient: "doctor@example.com",
 *   variables: { doctorName: "Dr. John", ... }
 * }
 *
 * Microsoft SMTP credentials stay in Cloud Functions secrets only.
 */
export const sendEmail = onCall(
  {
    region: "asia-south1",
    secrets: [smtpUser, smtpPassword],
    timeoutSeconds: 60,
    memory: "256MiB",
  },
  async (request) => {
    const adminUid = await assertAdmin(request);
    await assertEmailRateLimit(adminUid);

    const data = (request.data || {}) as SendEmailRequest;
    const templateId = typeof data.templateId === "string" ? data.templateId.trim() : "";
    const recipient = typeof data.recipient === "string" ? data.recipient.trim() : "";

    if (!isValidTemplateId(templateId)) {
      throw new HttpsError("invalid-argument", "Invalid templateId.");
    }
    if (!isValidEmail(recipient)) {
      throw new HttpsError("invalid-argument", "Invalid recipient email.");
    }

    let variables: Record<string, string | number | boolean>;
    try {
      variables = sanitizeVariables(data.variables);
    } catch (err) {
      throw new HttpsError(
        "invalid-argument",
        err instanceof Error ? err.message : "Invalid template variables."
      );
    }

    // Never accept SMTP config from the client
    if (
      data &&
      typeof data === "object" &&
      ("smtp" in data ||
        "password" in data ||
        "appPassword" in data ||
        "smtpUser" in data ||
        "smtpPassword" in data ||
        "gmailUser" in data ||
        "gmailPassword" in data)
    ) {
      throw new HttpsError(
        "invalid-argument",
        "SMTP configuration cannot be provided by the client."
      );
    }

    const templateSnap = await db.collection("emailTemplates").doc(templateId).get();
    if (!templateSnap.exists) {
      throw new HttpsError("not-found", `Email template "${templateId}" not found.`);
    }

    const template = templateSnap.data() as EmailTemplateDoc;
    if (template.enabled === false) {
      throw new HttpsError(
        "failed-precondition",
        `Email template "${templateId}" is disabled.`
      );
    }

    const subjectTemplate = template.subject || "";
    const htmlTemplate = template.html || "";
    const textTemplate = template.text || "";

    if (!subjectTemplate.trim() || (!htmlTemplate.trim() && !textTemplate.trim())) {
      throw new HttpsError(
        "failed-precondition",
        `Email template "${templateId}" is missing subject or body.`
      );
    }

    const subject = renderTemplate(subjectTemplate, variables);
    const html = htmlTemplate ? renderTemplate(htmlTemplate, variables) : undefined;
    const text = textTemplate
      ? renderTemplate(textTemplate, variables)
      : undefined;

    const user = smtpUser.value();
    const pass = smtpPassword.value();

    if (!user || !pass) {
      throw new HttpsError(
        "failed-precondition",
        "SMTP secrets are not configured on the server."
      );
    }

    const transporter = createMicrosoftSmtpTransporter(user, pass);

    try {
      const info = await transporter.sendMail({
        from: `"DrStethos" <${user}>`,
        to: recipient,
        subject,
        text: text || undefined,
        html: html || undefined,
      });

      await db.collection("email_logs").add({
        templateId,
        recipient,
        subject,
        status: "sent",
        messageId: info.messageId || null,
        sentByAdmin: adminUid,
        sentAt: new Date(),
        variables,
      });

      return {
        success: true,
        templateId,
        recipient,
        messageId: info.messageId || null,
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown SMTP error";

      await db.collection("email_errors").add({
        templateId,
        recipient,
        status: "failed",
        error: message,
        attemptedByAdmin: adminUid,
        timestamp: new Date(),
      });

      console.error("sendEmail SMTP failure:", message);
      throw new HttpsError("internal", "Failed to send email. Please try again later.");
    }
  }
);
