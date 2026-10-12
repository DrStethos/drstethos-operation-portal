import mongoose, { Schema } from 'mongoose';

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

const UserSchema = new Schema<IUser>({
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String },
  role: { type: String, enum: ['SUPER_ADMIN', 'MANAGER'], default: 'MANAGER' },
  firstName: { type: String },
  lastName: { type: String },
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

export const User = mongoose.model<IUser>('User', UserSchema);
