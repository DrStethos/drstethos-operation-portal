import { httpsCallable } from "firebase/functions";
import { functions } from "@/lib/firebase";

export interface SendSupportContactPayload {
  name: string;
  email: string;
  message: string;
}

export const sendSupportContact = async (
  payload: SendSupportContactPayload
): Promise<{ success: boolean; messageId?: string | null }> => {
  const callable = httpsCallable(functions, "sendSupportContact");
  const response = await callable(payload);
  return response.data as { success: boolean; messageId?: string | null };
};
