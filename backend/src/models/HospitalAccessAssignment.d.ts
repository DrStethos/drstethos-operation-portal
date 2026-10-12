import mongoose, { Types } from 'mongoose';
export interface IHospitalAccessAssignment {
    id?: string;
    userId: Types.ObjectId | string;
    hospitalId: Types.ObjectId | string;
    createdAt?: Date;
    updatedAt?: Date;
}
export declare const HospitalAccessAssignment: mongoose.Model<IHospitalAccessAssignment, {}, {}, {}, mongoose.Document<unknown, {}, IHospitalAccessAssignment, {}, mongoose.DefaultSchemaOptions> & IHospitalAccessAssignment & {
    _id: Types.ObjectId;
} & {
    __v: number;
} & {
    id: string;
}, any, IHospitalAccessAssignment & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
//# sourceMappingURL=HospitalAccessAssignment.d.ts.map