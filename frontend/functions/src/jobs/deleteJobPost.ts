import { onCall, HttpsError } from "firebase-functions/v2/https";
import { assertAdmin } from "../auth/assertAdmin";
import { db } from "../firebaseAdmin";

interface DeleteJobPostRequest {
  jobId?: string;
}

export const deleteJobPost = onCall(
  {
    region: "asia-south1",
    timeoutSeconds: 120,
    memory: "256MiB",
  },
  async (request) => {
    const adminUid = await assertAdmin(request);
    const rawJobId = (request.data as DeleteJobPostRequest | undefined)?.jobId;
    const jobId = typeof rawJobId === "string" ? rawJobId.trim() : "";

    if (!jobId || jobId.length > 1500 || jobId.includes("/")) {
      throw new HttpsError("invalid-argument", "A valid job ID is required.");
    }

    const jobRef = db.collection("jobs").doc(jobId);
    const jobSnapshot = await jobRef.get();
    if (!jobSnapshot.exists) {
      throw new HttpsError("not-found", "Job post not found.");
    }

    const applications = await jobRef.collection("applications").get();
    let batch = db.batch();
    let batchSize = 0;
    const commitBatch = async () => {
      if (batchSize === 0) return;
      await batch.commit();
      batch = db.batch();
      batchSize = 0;
    };
    const queueDelete = async (ref: FirebaseFirestore.DocumentReference) => {
      batch.delete(ref);
      batchSize += 1;
      if (batchSize >= 450) await commitBatch();
    };

    for (const application of applications.docs) {
      const applicationData = application.data();
      const doctorId =
        typeof applicationData.doctorId === "string" ? applicationData.doctorId.trim() : "";
      await queueDelete(application.ref);
      if (doctorId && !doctorId.includes("/")) {
        await queueDelete(
          db.collection("doctors").doc(doctorId).collection("appliedJobs").doc(application.id)
        );
      }
    }

    await queueDelete(jobRef);
    const auditRef = db.collection("admin_audit_logs").doc();
    batch.set(auditRef, {
      action: "deleteJobPost",
      targetJobId: jobId,
      targetHospitalId: jobSnapshot.get("hospitalId") || null,
      deletedApplications: applications.size,
      performedByAdminUid: adminUid,
      performedAt: new Date(),
    });
    batchSize += 1;
    await commitBatch();

    return { success: true, jobId, deletedApplications: applications.size, deletedBy: adminUid };
  }
);
