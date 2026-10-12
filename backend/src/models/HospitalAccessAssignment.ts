import mongoose, { Schema, Types } from 'mongoose';

export interface IHospitalAccessAssignment {
  id?: string;
  userId: Types.ObjectId | string;
  hospitalId: Types.ObjectId | string;
  createdAt?: Date;
  updatedAt?: Date;
}

const HospitalAccessAssignmentSchema = new Schema<IHospitalAccessAssignment>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  hospitalId: { type: Schema.Types.ObjectId, ref: 'Hospital', required: true },
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

HospitalAccessAssignmentSchema.index({ userId: 1, hospitalId: 1 }, { unique: true });

export const HospitalAccessAssignment = mongoose.model<IHospitalAccessAssignment>('HospitalAccessAssignment', HospitalAccessAssignmentSchema);
