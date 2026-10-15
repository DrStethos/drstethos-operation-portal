"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.importHospitals = exports.mapHospitalRow = void 0;
const xlsx = __importStar(require("xlsx"));
const fs_1 = __importDefault(require("fs"));
const ImportJob_1 = require("../../models/ImportJob");
const Hospital_1 = require("../../models/Hospital");
const HospitalAccessAssignment_1 = require("../../models/HospitalAccessAssignment");
const normalizeHeader = (header) => header.toLowerCase().replace(/[^a-z0-9]/g, '');
const getCellValue = (row, aliases) => {
    const normalizedAliases = new Set(aliases.map(normalizeHeader));
    const matchingHeader = Object.keys(row).find((header) => normalizedAliases.has(normalizeHeader(header)));
    return matchingHeader === undefined ? undefined : row[matchingHeader];
};
const getOptionalString = (value) => {
    if (value === null || value === undefined)
        return undefined;
    const stringValue = String(value).trim();
    return stringValue ? stringValue : undefined;
};
const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const mapHospitalRow = (row) => {
    const name = getOptionalString(getCellValue(row, ['Hospital Name', 'Hospital']));
    if (!name)
        throw new Error('Missing Hospital Name');
    const hospitalFields = { name };
    const serialNumber = getOptionalString(getCellValue(row, ['S.No', 'S No', 'Serial Number', 'Serial No']));
    const hospitalType = getOptionalString(getCellValue(row, ['Hospital Type', 'Type']));
    const speciality = getOptionalString(getCellValue(row, [
        'Hospital Speciality',
        'Hospital Specialty',
        'Speciality',
        'Specialty',
    ]));
    const location = getOptionalString(getCellValue(row, [
        'Location / Full Address',
        'Location',
        'Address',
        'Full Address',
    ]));
    const contactNumber = getOptionalString(getCellValue(row, [
        'Contact Number',
        'Phone Number',
        'Phone',
        'Mobile Number',
    ]));
    const email = getOptionalString(getCellValue(row, ['Email Address', 'Email ID', 'Email']));
    const source = getOptionalString(getCellValue(row, ['Source Website', 'Website', 'Website URL', 'Source']));
    const vacancyValue = getOptionalString(getCellValue(row, ['Vacancy']));
    const vacancy = vacancyValue === undefined ? undefined : Number(vacancyValue);
    if (vacancy !== undefined && (!Number.isInteger(vacancy) || vacancy < 0)) {
        throw new Error('Vacancy must be a non-negative whole number');
    }
    if (serialNumber)
        hospitalFields.serialNumber = serialNumber;
    if (hospitalType)
        hospitalFields.hospitalType = hospitalType;
    if (speciality)
        hospitalFields.speciality = speciality;
    if (location)
        hospitalFields.location = location;
    if (contactNumber)
        hospitalFields.contactNumber = contactNumber;
    if (email)
        hospitalFields.email = email;
    if (source)
        hospitalFields.source = source;
    if (vacancy !== undefined)
        hospitalFields.vacancy = vacancy;
    return hospitalFields;
};
exports.mapHospitalRow = mapHospitalRow;
const importHospitals = async (filePath, user) => {
    const job = await ImportJob_1.ImportJob.create({ status: 'PROCESSING', totalRows: 0, failedRows: 0, errors: [] });
    try {
        const workbook = xlsx.readFile(filePath);
        const sheetName = workbook.SheetNames[0];
        if (!sheetName) {
            throw new Error('Excel file has no valid sheets');
        }
        const sheet = workbook.Sheets[sheetName];
        if (!sheet) {
            throw new Error('Worksheet data could not be read');
        }
        const data = xlsx.utils.sheet_to_json(sheet, {
            defval: '',
            raw: false,
        });
        job.totalRows = data.length;
        await job.save();
        const assignedHospitalIds = await HospitalAccessAssignment_1.HospitalAccessAssignment.distinct('hospitalId', {
            userId: user.id,
        });
        let failed = 0;
        for (let i = 0; i < data.length; i++) {
            const row = data[i];
            try {
                if (!row)
                    throw new Error('Spreadsheet row could not be read');
                const hospitalFields = (0, exports.mapHospitalRow)(row);
                const existingRecords = await Hospital_1.Hospital.find({
                    name: {
                        $regex: `^${escapeRegExp(hospitalFields.name)}$`,
                        $options: 'i',
                    },
                    $or: [
                        { createdById: user.id },
                        { _id: { $in: assignedHospitalIds } },
                    ],
                });
                let hospitals = existingRecords;
                if (existingRecords.length > 0) {
                    await Hospital_1.Hospital.updateMany({ _id: { $in: existingRecords.map((hospital) => hospital._id) } }, { $set: hospitalFields }, { runValidators: true });
                    await Hospital_1.Hospital.collection.updateMany({ _id: { $in: existingRecords.map((hospital) => hospital._id) } }, { $unset: { sourceWebsite: '' } });
                }
                else {
                    hospitals = [
                        await Hospital_1.Hospital.create({
                            ...hospitalFields,
                            createdById: user.id,
                            ...(user.name ? { createdByName: user.name } : {}),
                            ...(user.email ? { createdByEmail: user.email } : {}),
                            ...(user.role ? { createdByRole: user.role } : {}),
                        }),
                    ];
                }
                if (hospitals.length === 0) {
                    throw new Error('Failed to save hospital record');
                }
                await Promise.all(hospitals.map((hospital) => HospitalAccessAssignment_1.HospitalAccessAssignment.updateOne({ userId: user.id, hospitalId: hospital._id }, { $setOnInsert: { userId: user.id, hospitalId: hospital._id } }, { upsert: true })));
            }
            catch (err) {
                failed++;
                job.errors.push({ rowNumber: i + 2, error: err.message });
            }
        }
        job.status = failed === data.length && data.length > 0 ? 'FAILED' : 'COMPLETED';
        job.failedRows = failed;
        await job.save();
    }
    catch (error) {
        job.status = 'FAILED';
        await job.save();
    }
    finally {
        if (fs_1.default.existsSync(filePath)) {
            fs_1.default.unlinkSync(filePath);
        }
    }
    return job.toJSON();
};
exports.importHospitals = importHospitals;
//# sourceMappingURL=imports.service.js.map