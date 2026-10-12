import mongoose, { Schema } from 'mongoose';

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

const HospitalSchema = new Schema<IHospital>({
  name: { type: String, required: true, trim: true },
  hospitalType: { type: String, trim: true },
  speciality: { type: String, trim: true },
  location: { type: String, trim: true },
  contactNumber: { type: String, trim: true },
  email: { type: String, trim: true, lowercase: true },
  source: { type: String, trim: true },
  vacancy: { type: Number, min: 0 },
  createdById: { type: String, trim: true },
  createdByName: { type: String, trim: true },
  createdByEmail: { type: String, trim: true, lowercase: true },
  createdByRole: { type: String, trim: true },
}, { 
  timestamps: true,
  toJSON: {
    virtuals: true,
    versionKey: false,
    transform: (_doc, ret: Record<string, any>) => {
      ret.id = ret._id ? ret._id.toString() : ret.id;
      delete ret._id;
      return ret;
    }
  }
});

export const Hospital = mongoose.model<IHospital>('Hospital', HospitalSchema);
