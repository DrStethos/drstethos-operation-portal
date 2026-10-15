import mongoose from 'mongoose';
export declare class HospitalsService {
    updateOutreach(id: string, data: unknown, user: any): Promise<(import("../../models/Hospital").IHospital & {
        _id: mongoose.Types.ObjectId;
    } & {
        __v: number;
    }) | null>;
    getAllHospitals(_user: any): Promise<(import("../../models/Hospital").IHospital & {
        _id: mongoose.Types.ObjectId;
    } & {
        __v: number;
    })[]>;
    getHospitalById(id: string, _user: any): Promise<import("../../models/Hospital").IHospital & {
        _id: mongoose.Types.ObjectId;
    } & {
        __v: number;
    }>;
    createHospital(data: any, user: any): Promise<import("../../models/Hospital").IHospital & {
        _id: mongoose.Types.ObjectId;
    } & {
        __v: number;
    }>;
    updateHospital(id: string, data: any, user: any): Promise<(import("../../models/Hospital").IHospital & {
        _id: mongoose.Types.ObjectId;
    } & {
        __v: number;
    }) | null>;
    removeHospitalVacancy(id: string, user: any): Promise<(import("../../models/Hospital").IHospital & {
        _id: mongoose.Types.ObjectId;
    } & {
        __v: number;
    }) | null>;
    private assertCanEditHospital;
    deleteHospital(id: string, user: any): Promise<(import("../../models/Hospital").IHospital & {
        _id: mongoose.Types.ObjectId;
    } & {
        __v: number;
    }) | null>;
    deleteHospitals(ids: string[], user: any): Promise<{
        deletedCount: number;
    }>;
    private assertInMyList;
    private assertCanDeleteHospital;
}
export declare const hospitalsService: HospitalsService;
//# sourceMappingURL=hospitals.service.d.ts.map