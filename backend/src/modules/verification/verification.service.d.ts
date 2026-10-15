type ProfileType = 'doctor' | 'hospital';
type VerificationDecision = 'approve' | 'reject';
export declare class VerificationService {
    decide(profileType: ProfileType, profileId: string, decision: VerificationDecision, adminUser: {
        id?: string;
        email?: string;
    }, rejectionReason?: string): Promise<{
        success: boolean;
        decision: VerificationDecision;
        profileType: ProfileType;
        profileName: string;
        recipient: string;
        status: string;
        verifiedAt: string | null;
        rejectedAt: string | null;
        rejectionReason: string | null;
        adminId: string;
        adminEmail: string;
    }>;
}
export declare const verificationService: VerificationService;
export {};
//# sourceMappingURL=verification.service.d.ts.map