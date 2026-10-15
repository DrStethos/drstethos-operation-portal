import { firestoreAdmin, firebaseAdmin } from '../../config/firebaseAdmin';

type ProfileType = 'doctor' | 'hospital';
type VerificationDecision = 'approve' | 'reject';

const escapeHtml = (value: string) =>
  value.replace(/[&<>"']/g, (character) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  })[character] || character);

export class VerificationService {
  async decide(
    profileType: ProfileType,
    profileId: string,
    decision: VerificationDecision,
    adminUser: { id?: string; email?: string },
    rejectionReason?: string,
  ) {
    const profileCollection = profileType === 'doctor' ? 'doctors' : 'hospitals';
    const profileRef = firestoreAdmin.collection(profileCollection).doc(profileId);
    const now = new Date();
    const adminId = adminUser.id || 'unknown';
    const adminEmail = adminUser.email || 'N/A';

    return firestoreAdmin.runTransaction(async (transaction) => {
      const profileSnapshot = await transaction.get(profileRef);
      if (!profileSnapshot.exists) {
        throw new Error('Verification profile not found');
      }

      const profile = profileSnapshot.data() || {};
      const userId = typeof profile.userId === 'string' ? profile.userId : '';
      if (!userId) {
        throw new Error('Profile is missing its user reference');
      }

      const userRef = firestoreAdmin.collection('users').doc(userId);
      const userSnapshot = await transaction.get(userRef);
      if (!userSnapshot.exists) {
        throw new Error('Profile user not found');
      }

      const user = userSnapshot.data() || {};
      const templateId = `${profileType}${decision === 'approve' ? 'Approval' : 'Rejection'}`;
      const emailTemplateRef = firestoreAdmin.collection('emailTemplates').doc(templateId);
      const emailTemplateSnapshot = await transaction.get(emailTemplateRef);
      if (!emailTemplateSnapshot.exists || emailTemplateSnapshot.data()?.enabled === false) {
        throw new Error('Verification email template is unavailable');
      }

      const emailTemplate = emailTemplateSnapshot.data() || {};
      const templateSubject = typeof emailTemplate.subject === 'string' ? emailTemplate.subject : '';
      const templateHtml = typeof emailTemplate.html === 'string' ? emailTemplate.html : '';
      const templateText = typeof emailTemplate.text === 'string' ? emailTemplate.text : '';
      if (!templateSubject.trim() || (!templateHtml.trim() && !templateText.trim())) {
        throw new Error('Verification email template is incomplete');
      }

      const profileName = String(profile.name || user.name || 'User');
      const recipient = String(profile.email || user.email || '').trim();
      if (!recipient) {
        throw new Error('A recipient email address is required to send the verification update');
      }

      const profileLabel = profileType === 'doctor' ? 'Doctor' : 'Hospital';
      const approval = decision === 'approve';
      const reason = (rejectionReason || '').trim();
      const variables = {
        profileName,
        profileType: profileLabel,
        profile_name: profileName,
        profile_type: profileLabel,
        email: recipient,
        dashboardLink: 'https://drstethos.com',
        dashboard_link: 'https://drstethos.com',
        rejectionReason: reason,
        rejection_reason: reason,
      };
      const renderTemplate = (template: string, htmlSafe: boolean) =>
        template.replace(/\{\{\s*([a-zA-Z0-9_]+)\s*\}\}/g, (_match, key: string) => {
          const value = variables[key as keyof typeof variables];
          if (value === undefined) return '';
          return htmlSafe ? escapeHtml(value) : value;
        });
      const subject = renderTemplate(templateSubject, false);
      const text = renderTemplate(templateText, false);
      const html = renderTemplate(templateHtml, true);

      const mailRef = firestoreAdmin.collection('mail').doc();
      transaction.set(mailRef, {
        to: recipient,
        message: { subject, text, html },
        createdAt: firebaseAdmin.firestore.FieldValue.serverTimestamp(),
      });

      const status = approval ? 'APPROVED' : 'REJECTED';
      const notificationText = approval
        ? `Hi ${profileName}, your ${profileLabel.toLowerCase()} profile has been verified on DrStethos.`
        : `Hi ${profileName}, your ${profileLabel.toLowerCase()} profile verification was rejected. Reason: ${reason}`;
      if (typeof user.fcmToken === 'string' && user.fcmToken) {
        const fcmRef = firestoreAdmin.collection('fcm_messages').doc();
        transaction.set(fcmRef, {
          token: user.fcmToken,
          notification: {
            title: approval ? 'Profile verified' : 'Profile verification rejected',
            body: notificationText,
          },
          createdAt: firebaseAdmin.firestore.FieldValue.serverTimestamp(),
        });
      }

      const commonProfileUpdate = {
        isVerified: approval,
        updatedAt: now,
        ...(approval ? { verifiedAt: now } : {}),
      };
      const adminIdentifier = `portal:${adminId}`;
      const userUpdate = approval
        ? {
            isVerified: true,
            verifiedAt: now,
            verifiedByAdminUid: adminIdentifier,
            verifiedByAdminEmail: adminEmail,
            rejectedAt: null,
            rejectionReason: null,
            rejectedByAdminUid: null,
            rejectedByAdminEmail: null,
          }
        : {
            isVerified: false,
            rejectionReason: reason,
            rejectedAt: now,
            rejectedByAdminUid: adminIdentifier,
            rejectedByAdminEmail: adminEmail,
          };

      transaction.update(profileRef, commonProfileUpdate);
      transaction.update(userRef, userUpdate);

      return {
        success: true,
        decision,
        profileType,
        profileName,
        recipient,
        status,
        verifiedAt: approval ? now.toISOString() : null,
        rejectedAt: approval ? null : now.toISOString(),
        rejectionReason: approval ? null : reason,
        adminId: adminIdentifier,
        adminEmail,
      };
    });
  }
}

export const verificationService = new VerificationService();
