import mongoose from 'mongoose';
export interface IUser {
    id?: string;
    email: string;
    password?: string;
    role: 'SUPER_ADMIN' | 'MANAGER';
    firstName?: string;
    lastName?: string;
    createdAt?: Date;
    updatedAt?: Date;
}
export declare const User: mongoose.Model<IUser, {}, {}, {}, mongoose.Document<unknown, {}, IUser, {}, mongoose.DefaultSchemaOptions> & IUser & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
} & {
    id: string;
}, any, IUser & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>;
//# sourceMappingURL=User.d.ts.map