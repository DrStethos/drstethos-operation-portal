import mongoose, { Schema, Types } from 'mongoose';

export interface IAuditLog {
  id?: string;
  userId?: Types.ObjectId;
  action: string;
  entity: string;
  entityId?: string;
  details?: any;
  createdAt?: Date;
}

const AuditLogSchema = new Schema<IAuditLog>({
  userId: { type: Schema.Types.ObjectId, ref: 'User' },
  action: { type: String, required: true },
  entity: { type: String, required: true },
  entityId: { type: String },
  details: { type: Schema.Types.Mixed },
}, { 
  timestamps: { createdAt: true, updatedAt: false },
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

export const AuditLog = mongoose.model<IAuditLog>('AuditLog', AuditLogSchema);
