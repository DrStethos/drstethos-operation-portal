import { httpsCallable } from "firebase/functions";
import { functions } from "@/lib/firebase";

export interface DeleteUserAccountPayload {
  userId: string;
  profileId?: string;
  role?: string;
}

export const deleteUserAccount = async (payload: DeleteUserAccountPayload) => {
  const callable = httpsCallable(functions, "deleteUserAccount");
  const response = await callable(payload);
  return response.data as { success: boolean; userId: string; authDeleted: boolean };
};
