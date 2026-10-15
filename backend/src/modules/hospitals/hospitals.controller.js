"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteHospitals = exports.deleteHospital = exports.removeHospitalVacancy = exports.updateHospitalOutreach = exports.updateHospital = exports.createHospital = exports.getHospitalById = exports.getAllHospitals = void 0;
const hospitals_service_1 = require("./hospitals.service");
const getAllHospitals = async (req, res) => {
    try {
        const hospitals = await hospitals_service_1.hospitalsService.getAllHospitals(req.user);
        res.json(hospitals);
    }
    catch (error) {
        res.status(500).json({ message: error.message || 'Internal Server Error' });
    }
};
exports.getAllHospitals = getAllHospitals;
const getHospitalById = async (req, res) => {
    try {
        const hospitalId = String(req.params.id);
        const hospital = await hospitals_service_1.hospitalsService.getHospitalById(hospitalId, req.user);
        res.json(hospital);
    }
    catch (error) {
        if (error.message === 'Hospital not found') {
            res.status(404).json({ message: error.message });
        }
        else if (error.message === 'Unauthorized to access this hospital') {
            res.status(403).json({ message: error.message });
        }
        else {
            res.status(500).json({ message: error.message || 'Internal Server Error' });
        }
    }
};
exports.getHospitalById = getHospitalById;
const createHospital = async (req, res) => {
    try {
        const hospital = await hospitals_service_1.hospitalsService.createHospital(req.body, req.user);
        res.status(201).json(hospital);
    }
    catch (error) {
        res.status(500).json({ message: error.message || 'Internal Server Error' });
    }
};
exports.createHospital = createHospital;
const updateHospital = async (req, res) => {
    try {
        const hospitalId = String(req.params.id);
        const hospital = await hospitals_service_1.hospitalsService.updateHospital(hospitalId, req.body, req.user);
        res.json(hospital);
    }
    catch (error) {
        if (error.message === 'Hospital not found') {
            res.status(404).json({ message: error.message });
        }
        else if (error.message === 'Unauthorized to access this hospital' ||
            error.message === 'You can only edit hospitals you added') {
            res.status(403).json({ message: error.message });
        }
        else {
            res.status(500).json({ message: error.message || 'Internal Server Error' });
        }
    }
};
exports.updateHospital = updateHospital;
const updateHospitalOutreach = async (req, res) => {
    try {
        const hospitalId = String(req.params.id);
        const hospital = await hospitals_service_1.hospitalsService.updateOutreach(hospitalId, req.body, req.user);
        res.json(hospital);
    }
    catch (error) {
        if (error.message === 'Invalid hospital ID' || error.message === 'Invalid hospital outreach details') {
            res.status(400).json({ message: error.message });
        }
        else if (error.message === 'Hospital not found') {
            res.status(404).json({ message: error.message });
        }
        else if (error.message === 'You can only edit hospitals you added') {
            res.status(403).json({ message: error.message });
        }
        else {
            res.status(500).json({ message: error.message || 'Internal Server Error' });
        }
    }
};
exports.updateHospitalOutreach = updateHospitalOutreach;
const removeHospitalVacancy = async (req, res) => {
    try {
        const hospitalId = String(req.params.id);
        const hospital = await hospitals_service_1.hospitalsService.removeHospitalVacancy(hospitalId, req.user);
        res.json(hospital);
    }
    catch (error) {
        if (error.message === 'Invalid hospital ID') {
            res.status(400).json({ message: error.message });
        }
        else if (error.message === 'Hospital not found') {
            res.status(404).json({ message: error.message });
        }
        else if (error.message === 'You can only edit hospitals you added') {
            res.status(403).json({ message: error.message });
        }
        else {
            res.status(500).json({ message: error.message || 'Internal Server Error' });
        }
    }
};
exports.removeHospitalVacancy = removeHospitalVacancy;
const deleteHospital = async (req, res) => {
    try {
        const hospitalId = String(req.params.id);
        await hospitals_service_1.hospitalsService.deleteHospital(hospitalId, req.user);
        res.status(204).send();
    }
    catch (error) {
        if (error.message === 'Hospital not found') {
            res.status(404).json({ message: error.message });
        }
        else if (error.message === 'Unauthorized to access this hospital' ||
            error.message === 'Unauthorized to delete this hospital') {
            res.status(403).json({ message: error.message });
        }
        else {
            res.status(500).json({ message: error.message || 'Internal Server Error' });
        }
    }
};
exports.deleteHospital = deleteHospital;
const deleteHospitals = async (req, res) => {
    try {
        const result = await hospitals_service_1.hospitalsService.deleteHospitals(req.body?.ids, req.user);
        res.json(result);
    }
    catch (error) {
        if (error.message === 'Unauthorized to delete this hospital' ||
            error.message === 'Bulk deletion is only allowed for hospitals in your My List') {
            res.status(403).json({ message: error.message });
        }
        else if (error.message === 'Select at least one hospital to delete' ||
            error.message === 'One or more hospital IDs are invalid' ||
            error.message === 'One or more hospitals were not found') {
            res.status(400).json({ message: error.message });
        }
        else {
            res.status(500).json({ message: error.message || 'Internal Server Error' });
        }
    }
};
exports.deleteHospitals = deleteHospitals;
//# sourceMappingURL=hospitals.controller.js.map