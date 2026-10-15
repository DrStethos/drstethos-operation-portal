"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verificationService = exports.VerificationService = void 0;
const firebaseAdmin_1 = require("../../config/firebaseAdmin");
const escapeHtml = (value) => value.replace(/[&<>"']/g, (character) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
})[character] || character);
class VerificationService {
    async decide(profileType, profileId, decision, adminUser, rejectionReason) {
        const profileCollection = profileType === 'doctor' ? 'doctors' : 'hospitals';
        const profileRef = firebaseAdmin_1.firestoreAdmin.collection(profileCollection).doc(profileId);
        const now = new Date();
        const adminId = adminUser.id || 'unknown';
        const adminEmail = adminUser.email || 'N/A';
        return firebaseAdmin_1.firestoreAdmin.runTransaction(async (transaction) => {
            const profileSnapshot = await transaction.get(profileRef);
            if (!profileSnapshot.exists) {
                throw new Error('Verification profile not found');
            }
            const profile = profileSnapshot.data() || {};
            const userId = typeof profile.userId === 'string' ? profile.userId : '';
            if (!userId) {
                throw new Error('Profile is missing its user reference');
            }
            const userRef = firebaseAdmin_1.firestoreAdmin.collection('users').doc(userId);
            const userSnapshot = await transaction.get(userRef);
            if (!userSnapshot.exists) {
                throw new Error('Profile user not found');
            }
            const user = userSnapshot.data() || {};
            const templateId = `${profileType}${decision === 'approve' ? 'Approval' : 'Rejection'}`;
            const emailTemplateRef = firebaseAdmin_1.firestoreAdmin.collection('emailTemplates').doc(templateId);
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
            const renderTemplate = (template, htmlSafe) => template.replace(/\{\{\s*([a-zA-Z0-9_]+)\s*\}\}/g, (_match, key) => {
                const value = variables[key];
                if (value === undefined)
                    return '';
                return htmlSafe ? escapeHtml(value) : value;
            });
            const subject = renderTemplate(templateSubject, false);
            const text = renderTemplate(templateText, false);
            const html = renderTemplate(templateHtml, true);
            const mailRef = firebaseAdmin_1.firestoreAdmin.collection('mail').doc();
            transaction.set(mailRef, {
                to: recipient,
                message: { subject, text, html },
                createdAt: firebaseAdmin_1.firebaseAdmin.firestore.FieldValue.serverTimestamp(),
            });
            const status = approval ? 'APPROVED' : 'REJECTED';
            const notificationText = approval
                ? `Hi ${profileName}, your ${profileLabel.toLowerCase()} profile has been verified on DrStethos.`
                : `Hi ${profileName}, your ${profileLabel.toLowerCase()} profile verification was rejected. Reason: ${reason}`;
            if (typeof user.fcmToken === 'string' && user.fcmToken) {
                const fcmRef = firebaseAdmin_1.firestoreAdmin.collection('fcm_messages').doc();
                transaction.set(fcmRef, {
                    token: user.fcmToken,
                    notification: {
                        title: approval ? 'Profile verified' : 'Profile verification rejected',
                        body: notificationText,
                    },
                    createdAt: firebaseAdmin_1.firebaseAdmin.firestore.FieldValue.serverTimestamp(),
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
exports.VerificationService = VerificationService;
exports.verificationService = new VerificationService();
//# sourceMappingURL=verification.service.js.map