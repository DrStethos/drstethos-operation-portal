import { Hospital } from '../../models/Hospital';
import { HospitalAccessAssignment } from '../../models/HospitalAccessAssignment';
import { User } from '../../models/User';
import mongoose from 'mongoose';

export class HospitalsService {
  async getAllHospitals(_user: any) {
    const [hospitals, assignments] = await Promise.all([
      Hospital.find().sort({ createdAt: -1 }).lean(),
      HospitalAccessAssignment.find().lean(),
    ]);
    const assignmentByHospital = new Map(
      assignments.map((assignment) => [assignment.hospitalId.toString(), assignment.userId.toString()])
    );
    const legacyCreatorIds = [...new Set(
      hospitals
        .filter((hospital) => !hospital.createdById)
        .map((hospital) => assignmentByHospital.get(hospital._id.toString()))
        .filter((id): id is string => Boolean(id))
    )];
    const legacyCreators = legacyCreatorIds.length > 0
      ? await User.find({ _id: { $in: legacyCreatorIds } }).select('firstName lastName email').lean()
      : [];
    const creatorById = new Map(legacyCreators.map((creator) => [
      creator._id.toString(),
      {
        name: [creator.firstName, creator.lastName].filter(Boolean).join(' '),
        email: creator.email,
      },
    ]));

    return hospitals.map((hospital) => {
      if (hospital.createdById) return hospital;
      const creatorId = assignmentByHospital.get(hospital._id.toString());
      const creator = creatorId ? creatorById.get(creatorId) : undefined;
      return creatorId
        ? {
            ...hospital,
            createdById: creatorId,
            ...(creator?.name ? { createdByName: creator.name } : {}),
            ...(creator?.email ? { createdByEmail: creator.email } : {}),
          }
        : hospital;
    });
  }

  async getHospitalById(id: string, _user: any) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error('Invalid hospital ID');
    }
    const hospital = await Hospital.findById(id).lean();
    
    if (!hospital) {
      throw new Error('Hospital not found');
    }

    return hospital;
  }

  async createHospital(data: any, user: any) {
    const createdById = user.id || user.userId;
    const createdByName = [user.firstName, user.lastName].filter(Boolean).join(' ') || user.name;
    const hospital = await Hospital.create({
      name: data.name,
      hospitalType: data.hospitalType,
      speciality: data.speciality,
      location: data.location,
      contactNumber: data.contactNumber,
      email: data.email,
      source: data.source,
      vacancy: data.vacancy,
      createdById,
      createdByName,
      createdByEmail: user.email,
      createdByRole: user.role,
    });

    if (user.role === 'MANAGER') {
       await HospitalAccessAssignment.create({
         userId: user.id,
         hospitalId: hospital._id,
       });
    }
    return hospital.toJSON();
  }

  async updateHospital(id: string, data: any, user: any) {
    await this.getHospitalById(id, user); // verifies access
    
    const updated = await Hospital.findByIdAndUpdate(id, {
      name: data.name,
      hospitalType: data.hospitalType,
      speciality: data.speciality,
      location: data.location,
      contactNumber: data.contactNumber,
      email: data.email,
      source: data.source,
      vacancy: data.vacancy,
    }, { new: true, runValidators: true }).lean();

    return updated;
  }

  async deleteHospital(id: string, user: any) {
    await this.getHospitalById(id, user); // verifies access
    
    await HospitalAccessAssignment.deleteMany({ hospitalId: id });
    return Hospital.findByIdAndDelete(id).lean();
  }
}

export const hospitalsService = new HospitalsService();
