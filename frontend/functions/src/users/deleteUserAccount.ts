import { onCall, HttpsError } from "firebase-functions/v2/https";
import { assertAdmin } from "../auth/assertAdmin";
import { admin, db } from "../firebaseAdmin";

interface DeleteUserAccountRequest {
  userId?: string;
  profileId?: string;
  role?: string;
}

function profileCollection(role?: string, profileId?: string): "doctors" | "hospitals" | null {
  const normalizedRole = String(role || "").toLowerCase();
  if (normalizedRole === "hospital") return "hospitals";
  if (normalizedRole === "doctor") return "doctors";

  if (profileId?.startsWith("hospital")) return "hospitals";
  if (profileId?.startsWith("doctor")) return "doctors";

  return null;
}

/**
 * Fully delete a platform user: Firestore user/profile docs + Firebase Auth account.
 * Admin portal previously deleted Firestore only, leaving orphaned Auth emails.
 */
export const deleteUserAccount = onCall(
  {
    region: "asia-south1",
    timeoutSeconds: 60,
    memory: "256MiB",
  },
  async (request) => {
    const adminUid = await assertAdmin(request);

    const data = (request.data || {}) as DeleteUserAccountRequest;
    const userId = typeof data.userId === "string" ? data.userId.trim() : "";

    if (!userId || userId.length > 128) {
      throw new HttpsError("invalid-argument", "A valid userId is required.");
    }

    if (userId === adminUid) {
      throw new HttpsError("permission-denied", "You cannot delete your own admin account.");
    }

    const userRef = db.collection("users").doc(userId);
    const userSnap = await userRef.get();
    const userData = userSnap.data();

    const profileId =
      (typeof data.profileId === "string" && data.profileId.trim()) ||
      (typeof userData?.profileId === "string" ? userData.profileId : "");
    const role =
      (typeof data.role === "string" && data.role.trim()) ||
      (typeof userData?.role === "string" ? userData.role : "");

    const collectionName = profileCollection(role, profileId);
    if (profileId && collectionName) {
      try {
        await db.collection(collectionName).doc(profileId).delete();
      } catch (error) {
        console.warn(`Profile delete skipped for ${collectionName}/${profileId}:`, error);
      }
    }

    if (userSnap.exists) {
      await userRef.delete();
    }

    try {
      await admin.auth().deleteUser(userId);
    } catch (error) {
      const code = (error as { code?: string })?.code;
      if (code !== "auth/user-not-found") {
        console.error("Auth delete failed:", error);
        throw new HttpsError(
          "internal",
          "User data was removed, but deleting the login account failed. Remove the email manually from Firebase Authentication."
        );
      }
    }

    await db.collection("admin_audit_logs").add({
      action: "deleteUserAccount",
      targetUserId: userId,
      targetEmail: userData?.email || null,
      performedByAdminUid: adminUid,
      performedAt: new Date(),
    });

    return {
      success: true,
      userId,
      authDeleted: true,
    };
  }
);
