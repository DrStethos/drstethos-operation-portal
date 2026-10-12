import mongoose, { Types } from 'mongoose';
export interface IAuditLog {
    id?: string;
    userId?: Types.ObjectId;
    action: string;
    entity: string;
    entityId?: string;
    details?: any;
    createdAt?: Date;
}
export declare const AuditLog: mongoose.Model<IAuditLog, {}, {}, {}, mongoose.Document<unknown, {}, IAuditLog, {}, mongoose.DefaultSchemaOptions> & IAuditLog & {
    _id: Types.ObjectId;
} & {
    __v: number;
} & {
    id: string;
}, any, IAuditLog & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
//# sourceMappingURL=AuditLog.d.ts.map