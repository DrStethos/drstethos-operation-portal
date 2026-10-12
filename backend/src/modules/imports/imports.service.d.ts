interface HospitalImporter {
    id: string;
    email?: string;
    name?: string;
    role?: string;
}
export declare const importHospitals: (filePath: string, user: HospitalImporter) => Promise<import("../../models/ImportJob").IImportJob & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
export {};
//# sourceMappingURL=imports.service.d.ts.map