import mongoose from 'mongoose';
export interface IHospital {
    id?: string;
    name: string;
    hospitalType?: string;
    speciality?: string;
    location?: string;
    contactNumber?: string;
    email?: string;
    source?: string;
    vacancy?: number;
    createdById?: string;
    createdByName?: string;
    createdByEmail?: string;
    createdByRole?: string;
    createdAt?: Date;
    updatedAt?: Date;
}
export declare const Hospital: mongoose.Model<IHospital, {}, {}, {}, mongoose.Document<unknown, {}, IHospital, {}, mongoose.DefaultSchemaOptions> & IHospital & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
} & {
    id: string;
}, any, IHospital & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>;
//# sourceMappingURL=Hospital.d.ts.map