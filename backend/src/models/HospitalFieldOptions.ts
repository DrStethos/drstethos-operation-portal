import mongoose, { Schema } from 'mongoose';

export interface IHospitalFieldOptions {
  key: string;
  hospitalTypes: string[];
  specialities: string[];
}

const HospitalFieldOptionsSchema = new Schema<IHospitalFieldOptions>({
  key: { type: String, required: true, unique: true, default: 'hospital-fields' },
  hospitalTypes: { type: [String], default: [] },
  specialities: { type: [String], default: [] },
}, {
  timestamps: true,
  versionKey: false,
});

export const HospitalFieldOptions = mongoose.model<IHospitalFieldOptions>(
  'HospitalFieldOptions',
  HospitalFieldOptionsSchema,
);
