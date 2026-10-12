import mongoose, { Schema } from 'mongoose';

export interface IImportRowError {
  rowNumber: number;
  error: string;
}

export interface IImportJob {
  id?: string;
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
  totalRows: number;
  failedRows: number;
  errors: IImportRowError[];
  createdAt?: Date;
  updatedAt?: Date;
}

const ImportRowErrorSchema = new Schema<IImportRowError>({
  rowNumber: { type: Number, required: true },
  error: { type: String, required: true }
}, { _id: false });

const ImportJobSchema = new Schema<IImportJob>({
  status: { type: String, enum: ['PENDING', 'PROCESSING', 'COMPLETED', 'FAILED'], default: 'PENDING' },
  totalRows: { type: Number, default: 0 },
  failedRows: { type: Number, default: 0 },
  errors: [ImportRowErrorSchema]
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

export const ImportJob = mongoose.model<IImportJob>('ImportJob', ImportJobSchema);
