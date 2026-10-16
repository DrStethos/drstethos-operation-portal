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
const zod_1 = require("zod");
const hospitalOutreachSchema = zod_1.z.object({
    contactStatus: zod_1.z.enum(['Connected', 'Not Connected', 'Connected but Not Lifted']).nullable(),
    vacancy: zod_1.z.number().int().nonnegative().nullable(),
    outreachNotes: zod_1.z.string().max(5000).nullable(),
});
class HospitalsService {
    async updateOutreach(id, data, user) {
        const parsedData = hospitalOutreachSchema.safeParse(data);
        if (!parsedData.success) {
            throw new Error('Invalid hospital outreach details');
        }
        const hospital = await this.getHospitalById(id, user);
        return Hospital_1.Hospital.findByIdAndUpdate(id, {
            contactStatus: parsedData.data.contactStatus,
            vacancy: parsedData.data.contactStatus === 'Connected'
                ? parsedData.data.vacancy
                : null,
            outreachNotes: parsedData.data.outreachNotes,
        }, { new: true, runValidators: true }).lean();
    }
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
            serialNumber: data.serialNumber,
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
        const hospital = await this.getHospitalById(id, user);
        await this.assertCanEditHospital(hospital, user);
        const updated = await Hospital_1.Hospital.findByIdAndUpdate(id, {
            serialNumber: data.serialNumber,
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
    async removeHospitalVacancy(id, user) {
        const hospital = await this.getHospitalById(id, user);
        await this.assertCanEditHospital(hospital, user);
        return Hospital_1.Hospital.findByIdAndUpdate(id, { vacancy: null }, { new: true, runValidators: true }).lean();
    }
    async assertCanEditHospital(hospital, user) {
        if (['SUPER_ADMIN', 'super_admin'].includes(user?.role))
            return;
        const userId = (user?.id || user?.userId || user?._id)?.toString();
        const userEmail = user?.email?.toLowerCase();
        let isCreator = Boolean((userId && hospital.createdById?.toString() === userId) ||
            (userEmail && hospital.createdByEmail?.toLowerCase() === userEmail));
        if (!isCreator && userId && !hospital.createdById) {
            isCreator = Boolean(await HospitalAccessAssignment_1.HospitalAccessAssignment.findOne({
                hospitalId: hospital._id,
                userId,
            }).lean());
        }
        if (!isCreator) {
            throw new Error('You can only edit hospitals you added');
        }
    }
    async deleteHospital(id, user) {
        const hospital = await this.getHospitalById(id, user);
        await this.assertCanDeleteHospital(hospital, user);
        await HospitalAccessAssignment_1.HospitalAccessAssignment.deleteMany({ hospitalId: id });
        return Hospital_1.Hospital.findByIdAndDelete(id).lean();
    }
    async deleteHospitals(ids, user) {
        if (!Array.isArray(ids) || ids.length === 0) {
            throw new Error('Select at least one hospital to delete');
        }
        if (ids.some((id) => !mongoose_1.default.Types.ObjectId.isValid(id))) {
            throw new Error('One or more hospital IDs are invalid');
        }
        const uniqueIds = [...new Set(ids)];
        const hospitals = await Hospital_1.Hospital.find({ _id: { $in: uniqueIds } }).lean();
        if (hospitals.length !== uniqueIds.length) {
            throw new Error('One or more hospitals were not found');
        }
        await Promise.all(hospitals.map(async (hospital) => {
            await this.assertInMyList(hospital, user);
            await this.assertCanDeleteHospital(hospital, user);
        }));
        await HospitalAccessAssignment_1.HospitalAccessAssignment.deleteMany({ hospitalId: { $in: uniqueIds } });
        const result = await Hospital_1.Hospital.deleteMany({ _id: { $in: uniqueIds } });
        return { deletedCount: result.deletedCount };
    }
    async assertInMyList(hospital, user) {
        if (['SUPER_ADMIN', 'super_admin'].includes(user?.role))
            return;
        const userId = (user?.id || user?.userId || user?._id)?.toString();
        const userEmail = user?.email?.toLowerCase();
        const isCreator = Boolean((userId && hospital.createdById?.toString() === userId) ||
            (userEmail && hospital.createdByEmail?.toLowerCase() === userEmail));
        if (isCreator)
            return;
        const assignment = userId
            ? await HospitalAccessAssignment_1.HospitalAccessAssignment.findOne({ hospitalId: hospital._id, userId }).lean()
            : null;
        if (!assignment) {
            throw new Error('Bulk deletion is only allowed for hospitals in your My List');
        }
    }
    async assertCanDeleteHospital(hospital, user) {
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
    }
}
exports.HospitalsService = HospitalsService;
exports.hospitalsService = new HospitalsService();
//# sourceMappingURL=hospitals.service.js.map