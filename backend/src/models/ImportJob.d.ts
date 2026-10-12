import mongoose from 'mongoose';
export interface IImportRowError {
    rowNumber: number;
    error: string;
}
export interface IImportJob {
    id?: string;
    status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
    totalRows: number;
    failedRows: number;
    errors: IImportRowError[];
    createdAt?: Date;
    updatedAt?: Date;
}
export declare const ImportJob: mongoose.Model<IImportJob, {}, {}, {}, mongoose.Document<unknown, {}, IImportJob, {}, mongoose.DefaultSchemaOptions> & IImportJob & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
} & {
    id: string;
}, any, IImportJob & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>;
//# sourceMappingURL=ImportJob.d.ts.map