"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteHospital = exports.updateHospital = exports.createHospital = exports.getHospitalById = exports.getAllHospitals = void 0;
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
        else if (error.message === 'Unauthorized to access this hospital') {
            res.status(403).json({ message: error.message });
        }
        else {
            res.status(500).json({ message: error.message || 'Internal Server Error' });
        }
    }
};
exports.updateHospital = updateHospital;
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
//# sourceMappingURL=hospitals.controller.js.map