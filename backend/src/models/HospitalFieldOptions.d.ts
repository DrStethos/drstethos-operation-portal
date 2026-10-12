import mongoose from 'mongoose';
export interface IHospitalFieldOptions {
    key: string;
    hospitalTypes: string[];
    specialities: string[];
}
export declare const HospitalFieldOptions: mongoose.Model<IHospitalFieldOptions, {}, {}, {}, mongoose.Document<unknown, {}, IHospitalFieldOptions, {}, mongoose.DefaultSchemaOptions> & IHospitalFieldOptions & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
} & {
    id: string;
}, any, IHospitalFieldOptions & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>;
//# sourceMappingURL=HospitalFieldOptions.d.ts.map