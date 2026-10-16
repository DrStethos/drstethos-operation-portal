import mongoose, { Schema } from 'mongoose';

export interface IHospital {
  id?: string;
  serialNumber?: string;
  name: string;
  hospitalType?: string;
  speciality?: string;
  location?: string;
  contactNumber?: string;
  email?: string;
  source?: string;
  vacancy?: number;
  contactStatus?: 'Connected' | 'Not Connected' | 'Connected but Not Lifted' | null;
  outreachVacancies?: number | null;
  outreachNotes?: string | null;
  hospitalCommitments?: string | null;
  createdById?: string;
  createdByName?: string;
  createdByEmail?: string;
  createdByRole?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const HospitalSchema = new Schema<IHospital>({
  serialNumber: { type: String, trim: true },
  name: { type: String, required: true, trim: true },
  hospitalType: { type: String, trim: true },
  speciality: { type: String, trim: true },
  location: { type: String, trim: true },
  contactNumber: { type: String, trim: true },
  email: { type: String, trim: true, lowercase: true },
  source: { type: String, trim: true },
  vacancy: { type: Number, min: 0 },
  contactStatus: { type: String, enum: ['Connected', 'Not Connected', 'Connected but Not Lifted'] },
  outreachVacancies: { type: Number, min: 0, validate: Number.isInteger },
  outreachNotes: { type: String, trim: true, maxlength: 5000 },
  hospitalCommitments: { type: String, trim: true, maxlength: 5000 },
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
