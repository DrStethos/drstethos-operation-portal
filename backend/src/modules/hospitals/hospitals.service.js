"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.hospitalsService = exports.HospitalsService = void 0;
const Hospital_1 = require("../../models/Hospital");
const HospitalAccessAssignment_1 = require("../../models/HospitalAccessAssignment");
const User_1 = require("../../models/User");
const mongoose_1 = __importDefault(require("mongoose"));
class HospitalsService {
    async getAllHospitals(_user) {
        const [hospitals, assignments] = await Promise.all([
            Hospital_1.Hospital.find().sort({ createdAt: -1 }).lean(),
            HospitalAccessAssignment_1.HospitalAccessAssignment.find().lean(),
        ]);
        const assignmentByHospital = new Map(assignments.map((assignment) => [assignment.hospitalId.toString(), assignment.userId.toString()]));
        const legacyCreatorIds = [...new Set(hospitals
                .filter((hospital) => !hospital.createdById)
                .map((hospital) => assignmentByHospital.get(hospital._id.toString()))
                .filter((id) => Boolean(id)))];
        const legacyCreators = legacyCreatorIds.length > 0
            ? await User_1.User.find({ _id: { $in: legacyCreatorIds } }).select('firstName lastName email').lean()
            : [];
        const creatorById = new Map(legacyCreators.map((creator) => [
            creator._id.toString(),
            {
                name: [creator.firstName, creator.lastName].filter(Boolean).join(' '),
                email: creator.email,
            },
        ]));
        return hospitals.map((hospital) => {
            if (hospital.createdById)
                return hospital;
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
    async getHospitalById(id, _user) {
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            throw new Error('Invalid hospital ID');
        }
        const hospital = await Hospital_1.Hospital.findById(id).lean();
        if (!hospital) {
            throw new Error('Hospital not found');
        }
        return hospital;
    }
    async createHospital(data, user) {
        const createdById = user.id || user.userId;
        const createdByName = [user.firstName, user.lastName].filter(Boolean).join(' ') || user.name;
        const hospital = await Hospital_1.Hospital.create({
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
            await HospitalAccessAssignment_1.HospitalAccessAssignment.create({
                userId: user.id,
                hospitalId: hospital._id,
            });
        }
        return hospital.toJSON();
    }
    async updateHospital(id, data, user) {
        await this.getHospitalById(id, user); // verifies access
        const updated = await Hospital_1.Hospital.findByIdAndUpdate(id, {
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
    async deleteHospital(id, user) {
        const hospital = await this.getHospitalById(id, user);
        const isSuperAdmin = ['SUPER_ADMIN', 'super_admin'].includes(user?.role);
        if (!isSuperAdmin) {
            const currentUserId = (user?.id || user?.userId || user?._id)?.toString();
            const hospitalCreatorId = hospital.createdById?.toString();
            let isOwner = Boolean(currentUserId && hospitalCreatorId && currentUserId === hospitalCreatorId);
            if (!isOwner && currentUserId) {
                const assignment = await HospitalAccessAssignment_1.HospitalAccessAssignment.findOne({
                    hospitalId: hospital._id,
                    userId: currentUserId,
                }).lean();
                if (assignment) {
                    isOwner = true;
                }
            }
            if (!isOwner) {
                throw new Error('Unauthorized to delete this hospital');
            }
        }
        await HospitalAccessAssignment_1.HospitalAccessAssignment.deleteMany({ hospitalId: id });
        return Hospital_1.Hospital.findByIdAndDelete(id).lean();
    }
}
exports.HospitalsService = HospitalsService;
exports.hospitalsService = new HospitalsService();
//# sourceMappingURL=hospitals.service.js.map