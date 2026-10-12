import { onCall, HttpsError } from "firebase-functions/v2/https";
import { admin, db } from "../firebaseAdmin";
import { assertAdmin } from "../auth/assertAdmin";

interface NotificationPayload {
  userId?: string;
  fcmToken?: string;
  name?: string;
  status?: "APPROVED" | "REJECTED";
  rejectionReason?: string;
  profileType?: "DOCTOR" | "HOSPITAL";
  profileId?: string;
}

function buildNotificationContent(payload: Required<
  Pick<NotificationPayload, "name" | "status" | "profileType">
> & { rejectionReason?: string }) {
  const label = payload.profileType === "DOCTOR" ? "doctor" : "hospital";

  if (payload.status === "APPROVED") {
    return {
      title: "Profile verified",
      body: `Hi ${payload.name}, your ${label} profile has been verified on DrStethos.`,
    };
  }

  const reason = payload.rejectionReason?.trim()
    ? ` Reason: ${payload.rejectionReason.trim()}`
    : "";

  return {
    title: "Profile verification rejected",
    body: `Hi ${payload.name}, your ${label} profile verification was rejected.${reason}`,
  };
}

/**
 * Existing callable used by DoctorProfile / HospitalProfile.
 * Recreated here because functions/ source was missing locally but referenced by firebase.json.
 */
export const sendApprovalNotification = onCall(
  {
    region: "asia-south1",
    timeoutSeconds: 60,
    memory: "256MiB",
  },
  async (request) => {
    const adminUid = await assertAdmin(request);
    const data = (request.data || {}) as NotificationPayload;

    const {
      userId,
      fcmToken,
      name,
      status,
      rejectionReason,
      profileType,
      profileId,
    } = data;

    if (!userId || !fcmToken || !name || !status || !profileType || !profileId) {
      throw new HttpsError("invalid-argument", "Missing required fields.");
    }

    if (status !== "APPROVED" && status !== "REJECTED") {
      throw new HttpsError("invalid-argument", "Invalid status.");
    }

    if (profileType !== "DOCTOR" && profileType !== "HOSPITAL") {
      throw new HttpsError("invalid-argument", "Invalid profileType.");
    }

    const { title, body } = buildNotificationContent({
      name,
      status,
      profileType,
      rejectionReason,
    });

    try {
      const messageId = await admin.messaging().send({
        token: fcmToken,
        notification: { title, body },
        data: {
          type: "PROFILE_VERIFICATION",
          status,
          profileType,
          profileId,
          userId,
        },
      });

      await db.collection("notification_logs").add({
        userId,
        profileType,
        profileId,
        status,
        title,
        body,
        fcmToken: fcmToken.slice(0, 20),
        messageId,
        sentAt: new Date(),
        sentByAdmin: adminUid,
      });

      return { success: true, messageId };
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown FCM error";

      await db.collection("notification_errors").add({
        userId,
        profileType,
        profileId,
        status,
        fcmToken: fcmToken.slice(0, 20),
        error: message,
        timestamp: new Date(),
        attemptedByAdmin: adminUid,
      });

      console.error("sendApprovalNotification failure:", message);
      throw new HttpsError("internal", "Failed to send notification.");
    }
  }
);

export const sendBatchNotifications = onCall(
  {
    region: "asia-south1",
    timeoutSeconds: 120,
    memory: "256MiB",
  },
  async (request) => {
    await assertAdmin(request);

    const notifications = (request.data as { notifications?: NotificationPayload[] })
      ?.notifications;

    if (!Array.isArray(notifications) || notifications.length === 0) {
      throw new HttpsError("invalid-argument", "notifications array is required.");
    }

    if (notifications.length > 50) {
      throw new HttpsError("invalid-argument", "Too many notifications in one batch.");
    }

    const results = [];
    for (const item of notifications) {
      try {
        // Reuse single-send logic via messaging directly would duplicate auth;
        // call the same validation path by constructing a mini request is awkward —
        // inline a simplified send for batch.
        const {
          userId,
          fcmToken,
          name,
          status,
          rejectionReason,
          profileType,
          profileId,
        } = item;

        if (!userId || !fcmToken || !name || !status || !profileType || !profileId) {
          results.push({ success: false, error: "Missing required fields" });
          continue;
        }

        const { title, body } = buildNotificationContent({
          name,
          status,
          profileType,
          rejectionReason,
        });

        const messageId = await admin.messaging().send({
          token: fcmToken,
          notification: { title, body },
          data: {
            type: "PROFILE_VERIFICATION",
            status,
            profileType,
            profileId,
            userId,
          },
        });

        results.push({ success: true, messageId, userId });
      } catch (error) {
        results.push({
          success: false,
          userId: item.userId || null,
          error: error instanceof Error ? error.message : "Unknown error",
        });
      }
    }

    return { success: true, results };
  }
);
