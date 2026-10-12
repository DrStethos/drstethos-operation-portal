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
exports.importHospitals = void 0;
const xlsx = __importStar(require("xlsx"));
const fs_1 = __importDefault(require("fs"));
const ImportJob_1 = require("../../models/ImportJob");
const Hospital_1 = require("../../models/Hospital");
const HospitalAccessAssignment_1 = require("../../models/HospitalAccessAssignment");
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
        const data = xlsx.utils.sheet_to_json(sheet);
        job.totalRows = data.length;
        await job.save();
        let failed = 0;
        for (let i = 0; i < data.length; i++) {
            const row = data[i];
            try {
                if (!row['Hospital Name'])
                    throw new Error('Missing Hospital Name');
                const vacancyValue = row['Vacancy'];
                const vacancy = vacancyValue === undefined || vacancyValue === null || vacancyValue === ''
                    ? undefined
                    : Number(vacancyValue);
                if (vacancy !== undefined && (!Number.isInteger(vacancy) || vacancy < 0)) {
                    throw new Error('Vacancy must be a non-negative whole number');
                }
                const hospital = await Hospital_1.Hospital.create({
                    name: row['Hospital Name'],
                    ...(row['Hospital Type'] ? { hospitalType: row['Hospital Type'] } : {}),
                    ...(row['Hospital Speciality'] ? { speciality: row['Hospital Speciality'] } : {}),
                    ...(row['Address'] ? { location: row['Address'] } : {}),
                    ...(row['Phone Number'] ? { contactNumber: row['Phone Number'] } : {}),
                    ...(row['Email ID'] ? { email: row['Email ID'] } : {}),
                    ...(row['Source'] ? { source: row['Source'] } : {}),
                    ...(vacancy !== undefined ? { vacancy } : {}),
                    createdById: user.id,
                    ...(user.name ? { createdByName: user.name } : {}),
                    ...(user.email ? { createdByEmail: user.email } : {}),
                    ...(user.role ? { createdByRole: user.role } : {}),
                });
                await HospitalAccessAssignment_1.HospitalAccessAssignment.create({
                    userId: user.id,
                    hospitalId: hospital._id
                });
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