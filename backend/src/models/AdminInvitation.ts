import mongoose, { Schema } from 'mongoose';

export interface IAdminInvitation {
  id?: string;
  email: string;
  token: string;
  role: 'SUPER_ADMIN' | 'MANAGER';
  expiresAt: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

const AdminInvitationSchema = new Schema<IAdminInvitation>({
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  token: { type: String, required: true, unique: true },
  role: { type: String, enum: ['SUPER_ADMIN', 'MANAGER'], required: true },
  expiresAt: { type: Date, required: true }
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

AdminInvitationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const AdminInvitation = mongoose.model<IAdminInvitation>('AdminInvitation', AdminInvitationSchema);
