import { httpsCallable } from "firebase/functions";
import { doc, deleteDoc, collection, addDoc, getDoc } from "firebase/firestore";
import { functions, db, auth } from "@/lib/firebase";

export interface DeleteUserAccountPayload {
  userId: string;
  profileId?: string;
  role?: string;
}

function resolveProfileCollection(role?: string, profileId?: string): "doctors" | "hospitals" | null {
  const normalizedRole = String(role || "").toLowerCase();
  if (normalizedRole === "hospital") return "hospitals";
  if (normalizedRole === "doctor") return "doctors";
  if (profileId?.startsWith("hospital")) return "hospitals";
  if (profileId?.startsWith("doctor")) return "doctors";
  return null;
}

export const deleteUserAccount = async (payload: DeleteUserAccountPayload) => {
  const userId = payload.userId?.trim();
  if (!userId) {
    throw new Error("A valid userId is required.");
  }

  // 1. Attempt Cloud Function first (deletes both Firebase Auth and Firestore if Firebase session is active)
  try {
    const callable = httpsCallable(functions, "deleteUserAccount");
    const response = await callable(payload);
    return response.data as { success: boolean; userId: string; authDeleted: boolean };
  } catch (cloudError: any) {
    console.warn("Cloud function deleteUserAccount uncallable or unauthenticated, executing direct Firestore deletion:", cloudError);

    // 2. Direct Firestore fallback: remove user document and linked profile document
    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);
    const userData = userSnap.data();

    const profileId = (payload.profileId?.trim()) || (typeof userData?.profileId === "string" ? userData.profileId : "");
    const role = (payload.role?.trim()) || (typeof userData?.role === "string" ? userData.role : "");

    const collectionName = resolveProfileCollection(role, profileId);
    if (profileId && collectionName) {
      try {
        await deleteDoc(doc(db, collectionName, profileId));
      } catch (profileError) {
        console.warn(`Profile delete skipped for ${collectionName}/${profileId}:`, profileError);
      }
    }

    if (userSnap.exists()) {
      await deleteDoc(userRef);
    }

    // 3. Log deletion audit record in Firestore
    try {
      await addDoc(collection(db, "admin_audit_logs"), {
        action: "deleteUserAccount",
        targetUserId: userId,
        targetEmail: userData?.email || null,
        performedBy: auth.currentUser?.email || "OperationsPortalAdmin",
        performedAt: new Date(),
        method: "direct_firestore_deletion",
      });
    } catch (auditError) {
      console.warn("Audit log write skipped:", auditError);
    }

    return {
      success: true,
      userId,
      authDeleted: false,
    };
  }
};
