import { httpsCallable } from "firebase/functions";
import { functions } from "@/lib/firebase";

export type EmailTemplateId =
  | "doctorApproval"
  | "hospitalApproval"
  | "doctorRejection"
  | "hospitalRejection"
  | "documentRequest"
  | (string & {});

export interface SendEmailPayload {
  templateId: EmailTemplateId;
  recipient: string;
  variables?: Record<string, string | number | boolean>;
}

export interface SendEmailResult {
  success: boolean;
  templateId: string;
  recipient: string;
  messageId?: string | null;
}

/**
 * Call the secure Cloud Function `sendEmail`.
 * Gmail SMTP credentials never leave the server.
 */
export const sendEmail = async (
  payload: SendEmailPayload
): Promise<SendEmailResult> => {
  const callable = httpsCallable(functions, "sendEmail");
  const response = await callable(payload);
  return response.data as SendEmailResult;
};
