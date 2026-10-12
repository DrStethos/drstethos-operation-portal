import mongoose from 'mongoose';
export interface IAdminInvitation {
    id?: string;
    email: string;
    token: string;
    role: 'SUPER_ADMIN' | 'MANAGER';
    expiresAt: Date;
    createdAt?: Date;
    updatedAt?: Date;
}
export declare const AdminInvitation: mongoose.Model<IAdminInvitation, {}, {}, {}, mongoose.Document<unknown, {}, IAdminInvitation, {}, mongoose.DefaultSchemaOptions> & IAdminInvitation & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
} & {
    id: string;
}, any, IAdminInvitation & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>;
//# sourceMappingURL=AdminInvitation.d.ts.map