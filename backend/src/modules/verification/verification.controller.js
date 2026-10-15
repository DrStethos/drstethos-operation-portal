"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.decideVerification = void 0;
const verification_service_1 = require("./verification.service");
const decideVerification = async (req, res) => {
    const profileType = String(req.params.profileType || '');
    const profileId = String(req.params.profileId || '').trim();
    const decision = req.body?.decision;
    const rejectionReason = typeof req.body?.rejectionReason === 'string'
        ? req.body.rejectionReason.trim()
        : '';
    if (!['doctor', 'hospital'].includes(profileType)) {
        return res.status(400).json({ message: 'Profile type must be doctor or hospital' });
    }
    if (!profileId || profileId.length > 150) {
        return res.status(400).json({ message: 'A valid profile ID is required' });
    }
    if (decision !== 'approve' && decision !== 'reject') {
        return res.status(400).json({ message: 'Decision must be approve or reject' });
    }
    if (decision === 'reject' && !rejectionReason) {
        return res.status(400).json({ message: 'A rejection reason is required' });
    }
    if (rejectionReason.length > 4000) {
        return res.status(400).json({ message: 'Rejection reason is too long' });
    }
    try {
        const result = await verification_service_1.verificationService.decide(profileType, profileId, decision, req.user || {}, rejectionReason);
        return res.json(result);
    }
    catch (error) {
        const message = error instanceof Error ? error.message : 'Verification action failed';
        console.error('Verification action failed:', error);
        if (message === 'Verification profile not found' || message === 'Profile user not found') {
            return res.status(404).json({ message });
        }
        if (message === 'Profile is missing its user reference' ||
            message === 'A recipient email address is required to send the verification update') {
            return res.status(400).json({ message });
        }
        if (message === 'Verification email template is unavailable' ||
            message === 'Verification email template is incomplete') {
            return res.status(503).json({ message });
        }
        const firebaseErrorCode = error?.code;
        if (firebaseErrorCode === 7 ||
            firebaseErrorCode === '7' ||
            message.includes('PERMISSION_DENIED')) {
            return res.status(503).json({ message: 'Firebase Admin credentials need Firestore access' });
        }
        if (/default credentials|application default|credential/i.test(message)) {
            return res.status(503).json({ message: 'Firebase Admin credentials are not configured on the backend' });
        }
        return res.status(500).json({ message: 'Could not complete verification action' });
    }
};
exports.decideVerification = decideVerification;
//# sourceMappingURL=verification.controller.js.map