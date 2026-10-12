import * as nodemailer from "nodemailer";
import { defineSecret } from "firebase-functions/params";

export const smtpUser = defineSecret("SMTP_USER");
export const smtpPassword = defineSecret("SMTP_PASSWORD");

const CONSUMER_OUTLOOK_DOMAINS = new Set([
  "outlook.com",
  "hotmail.com",
  "live.com",
  "msn.com",
]);

/** Pick Microsoft SMTP host based on the sender mailbox domain. */
export function getMicrosoftSmtpHost(email: string): string {
  const domain = email.split("@")[1]?.toLowerCase() ?? "";
  if (CONSUMER_OUTLOOK_DOMAINS.has(domain)) {
    return "smtp-mail.outlook.com";
  }
  return "smtp.office365.com";
}

export function createMicrosoftSmtpTransporter(user: string, pass: string) {
  return nodemailer.createTransport({
    host: getMicrosoftSmtpHost(user),
    port: 587,
    secure: false,
    requireTLS: true,
    auth: {
      user,
      pass,
    },
  });
}
