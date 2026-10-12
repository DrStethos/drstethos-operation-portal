export type HospitalOptionField = 'hospitalTypes' | 'specialities';
export declare class HospitalOptionsService {
    getOptions(): Promise<{
        hospitalTypes: string[];
        specialities: string[];
    }>;
    addOption(field: string, rawValue: unknown): Promise<{
        hospitalTypes: string[];
        specialities: string[];
    }>;
    removeOption(field: string, rawValue: unknown): Promise<{
        hospitalTypes: string[];
        specialities: string[];
    }>;
}
export declare const hospitalOptionsService: HospitalOptionsService;
//# sourceMappingURL=hospital-options.service.d.ts.map