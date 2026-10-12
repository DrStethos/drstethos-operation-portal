import { httpsCallable } from "firebase/functions";
import { functions } from "@/lib/firebase";

interface NotificationPayload {
	userId: string;
	fcmToken: string;
	name: string;
	status: "APPROVED" | "REJECTED";
	rejectionReason?: string;
	profileType: "DOCTOR" | "HOSPITAL";
	profileId: string;
}

/**
 * Send a single approval/rejection notification via Cloud Function
 */
export const sendApprovalNotification = async (
	payload: NotificationPayload
) => {
	try {
		const sendNotification = httpsCallable(
			functions,
			"sendApprovalNotification"
		);
		const response = await sendNotification(payload);
		console.log("Notification sent:", response.data);
		return response.data;
	} catch (error) {
		console.error("Error sending notification:", error);
		throw error;
	}
};

/**
 * Send multiple approval/rejection notifications via Cloud Function
 */
export const sendBatchNotifications = async (
	notifications: NotificationPayload[]
) => {
	try {
		const sendBatch = httpsCallable(functions, "sendBatchNotifications");
		const response = await sendBatch({ notifications });
		console.log("Batch notifications sent:", response.data);
		return response.data;
	} catch (error) {
		console.error("Error sending batch notifications:", error);
		throw error;
	}
};
