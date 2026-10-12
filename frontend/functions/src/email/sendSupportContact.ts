import { onCall, HttpsError } from "firebase-functions/v2/https";
import { db } from "../firebaseAdmin";
import {
  createMicrosoftSmtpTransporter,
  smtpPassword,
  smtpUser,
} from "./smtpTransport";
import { isValidEmail, renderTemplate } from "./templateUtils";

const TEMPLATE_ID = "supportContact";
const SUPPORT_INBOX = "support@drstethos.com";
const RATE_WINDOW_MS = 60 * 60 * 1000;
const MAX_SUBMISSIONS_PER_WINDOW = 5;

interface SupportContactRequest {
  name?: string;
  email?: string;
  message?: string;
}

function getClientIp(rawRequest: { ip?: string; headers?: Record<string, unknown> } | undefined): string {
  const forwarded = rawRequest?.headers?.["x-forwarded-for"];
  if (typeof forwarded === "string" && forwarded.trim()) {
    return forwarded.split(",")[0].trim();
  }
  if (typeof rawRequest?.ip === "string" && rawRequest.ip.trim()) {
    return rawRequest.ip.trim();
  }
  return "unknown";
}

async function assertSupportRateLimit(clientKey: string): Promise<void> {
  const now = Date.now();
  const ref = db.collection("email_rate_limits").doc(`support_${clientKey}`);
  const snap = await ref.get();
  const data = snap.data() || {};
  const windowStart = typeof data.windowStart === "number" ? data.windowStart : 0;
  let count = typeof data.count === "number" ? data.count : 0;

  if (now - windowStart > RATE_WINDOW_MS) {
    await ref.set({ windowStart: now, count: 1, updatedAt: now });
    return;
  }

  if (count >= MAX_SUBMISSIONS_PER_WINDOW) {
    throw new HttpsError(
      "resource-exhausted",
      "Too many messages sent recently. Please try again later."
    );
  }

  await ref.set({ windowStart, count: count + 1, updatedAt: now }, { merge: true });
}

function sanitizeSupportInput(data: SupportContactRequest) {
  const name = typeof data.name === "string" ? data.name.trim() : "";
  const email = typeof data.email === "string" ? data.email.trim() : "";
  const message = typeof data.message === "string" ? data.message.trim() : "";

  if (name.length < 2 || name.length > 100) {
    throw new HttpsError("invalid-argument", "Please enter your name (2–100 characters).");
  }
  if (!isValidEmail(email)) {
    throw new HttpsError("invalid-argument", "Please enter a valid email address.");
  }
  if (message.length < 10 || message.length > 2000) {
    throw new HttpsError("invalid-argument", "Message must be between 10 and 2000 characters.");
  }

  return { name, email, message };
}

/**
 * Public callable for the website contact form.
 * Sends to support@drstethos.com using the Firestore supportContact template.
 */
export const sendSupportContact = onCall(
  {
    region: "asia-south1",
    secrets: [smtpUser, smtpPassword],
    timeoutSeconds: 60,
    memory: "256MiB",
  },
  async (request) => {
    const clientIp = getClientIp(request.rawRequest);
    await assertSupportRateLimit(clientIp.replace(/[^a-zA-Z0-9._-]/g, "_").slice(0, 64));

    const { name, email, message } = sanitizeSupportInput(
      (request.data || {}) as SupportContactRequest
    );

    const templateSnap = await db.collection("emailTemplates").doc(TEMPLATE_ID).get();
    if (!templateSnap.exists) {
      throw new HttpsError("not-found", "Support email template is not configured.");
    }

    const template = templateSnap.data() as {
      subject?: string;
      html?: string;
      text?: string;
      enabled?: boolean;
      recipient?: string;
    };

    if (template.enabled === false) {
      throw new HttpsError("failed-precondition", "Support email is temporarily unavailable.");
    }

    const variables = {
      fromName: name,
      fromEmail: email,
      from_name: name,
      from_email: email,
      message,
    };

    const subject = renderTemplate(template.subject || "", variables);
    const html = template.html ? renderTemplate(template.html, variables) : undefined;
    const text = template.text ? renderTemplate(template.text, variables) : undefined;

    if (!subject.trim() || (!html?.trim() && !text?.trim())) {
      throw new HttpsError("failed-precondition", "Support email template is incomplete.");
    }

    const user = smtpUser.value();
    const pass = smtpPassword.value();

    if (!user || !pass) {
      throw new HttpsError("failed-precondition", "Email service is not configured.");
    }

    const recipient =
      typeof template.recipient === "string" && isValidEmail(template.recipient.trim())
        ? template.recipient.trim()
        : SUPPORT_INBOX;

    const transporter = createMicrosoftSmtpTransporter(user, pass);

    try {
      const info = await transporter.sendMail({
        from: `"DrStethos" <${user}>`,
        to: recipient,
        replyTo: email,
        subject,
        text: text || undefined,
        html: html || undefined,
      });

      await db.collection("email_logs").add({
        templateId: TEMPLATE_ID,
        recipient,
        subject,
        status: "sent",
        messageId: info.messageId || null,
        source: "supportContact",
        clientIp,
        variables,
        sentAt: new Date(),
      });

      return { success: true, messageId: info.messageId || null };
    } catch (error) {
      const errMessage = error instanceof Error ? error.message : "Unknown SMTP error";

      await db.collection("email_errors").add({
        templateId: TEMPLATE_ID,
        recipient,
        status: "failed",
        error: errMessage,
        source: "supportContact",
        clientIp,
        timestamp: new Date(),
      });

      console.error("sendSupportContact SMTP failure:", errMessage);
      throw new HttpsError("internal", "Failed to send message. Please try again later.");
    }
  }
);
