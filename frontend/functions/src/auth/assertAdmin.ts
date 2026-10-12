import { CallableRequest, HttpsError } from "firebase-functions/v2/https";
import { db } from "../firebaseAdmin";

/**
 * Require Firebase Auth + users/{uid}.isAdmin === true
 * (matches AdminLayout.tsx authorization).
 */
export async function assertAdmin(request: CallableRequest): Promise<string> {
  if (!request.auth?.uid) {
    throw new HttpsError("unauthenticated", "Authentication required.");
  }

  const uid = request.auth.uid;
  const userSnap = await db.collection("users").doc(uid).get();

  if (!userSnap.exists || userSnap.data()?.isAdmin !== true) {
    throw new HttpsError(
      "permission-denied",
      "Only authorized admins can send emails."
    );
  }

  return uid;
}

/**
 * Simple per-admin rate limit to reduce open-relay abuse if a token leaks.
 * Max 30 emails / rolling 60 seconds per admin.
 */
export async function assertEmailRateLimit(adminUid: string): Promise<void> {
  const now = Date.now();
  const windowMs = 60_000;
  const maxPerWindow = 30;
  const ref = db.collection("email_rate_limits").doc(adminUid);
  const snap = await ref.get();
  const data = snap.data() || {};
  const windowStart = typeof data.windowStart === "number" ? data.windowStart : 0;
  let count = typeof data.count === "number" ? data.count : 0;

  if (now - windowStart > windowMs) {
    await ref.set({ windowStart: now, count: 1, updatedAt: now });
    return;
  }

  if (count >= maxPerWindow) {
    throw new HttpsError(
      "resource-exhausted",
      "Email rate limit exceeded. Please wait a minute and try again."
    );
  }

  await ref.set(
    { windowStart, count: count + 1, updatedAt: now },
    { merge: true }
  );
}
