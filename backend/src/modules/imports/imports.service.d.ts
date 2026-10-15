import { type IHospital } from '../../models/Hospital';
interface HospitalImporter {
    id: string;
    email?: string;
    name?: string;
    role?: string;
}
export declare const mapHospitalRow: (row: Record<string, unknown>) => Partial<IHospital> & Pick<IHospital, "name">;
export declare const importHospitals: (filePath: string, user: HospitalImporter) => Promise<import("../../models/ImportJob").IImportJob & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
export {};
//# sourceMappingURL=imports.service.d.ts.map