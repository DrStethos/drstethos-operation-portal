import { HospitalFieldOptions } from '../../models/HospitalFieldOptions';

export type HospitalOptionField = 'hospitalTypes' | 'specialities';

export class HospitalOptionsService {
  async getOptions() {
    const options = await HospitalFieldOptions.findOne({ key: 'hospital-fields' }).lean();
    return {
      hospitalTypes: options?.hospitalTypes ?? [],
      specialities: options?.specialities ?? [],
    };
  }

  async addOption(field: string, rawValue: unknown) {
    if (field !== 'hospitalTypes' && field !== 'specialities') {
      throw new Error('Invalid hospital option field');
    }
    if (typeof rawValue !== 'string' || !rawValue.trim()) {
      throw new Error('Option value is required');
    }

    const value = rawValue.trim();
    if (value.length > 100) {
      throw new Error('Option value must be 100 characters or fewer');
    }

    const options = await HospitalFieldOptions.findOneAndUpdate(
      { key: 'hospital-fields' },
      { $addToSet: { [field]: value } },
      { new: true, upsert: true, setDefaultsOnInsert: true },
    ).lean();
    return {
      hospitalTypes: options.hospitalTypes,
      specialities: options.specialities,
    };
  }

  async removeOption(field: string, rawValue: unknown) {
    if (field !== 'hospitalTypes' && field !== 'specialities') {
      throw new Error('Invalid hospital option field');
    }
    if (typeof rawValue !== 'string' || !rawValue.trim()) {
      throw new Error('Option value is required');
    }

    const options = await HospitalFieldOptions.findOneAndUpdate(
      { key: 'hospital-fields' },
      { $pull: { [field]: rawValue.trim() } },
      { new: true, upsert: true, setDefaultsOnInsert: true },
    ).lean();
    return {
      hospitalTypes: options.hospitalTypes,
      specialities: options.specialities,
    };
  }
}

export const hospitalOptionsService = new HospitalOptionsService();
