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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Hospital = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const HospitalSchema = new mongoose_1.Schema({
    serialNumber: { type: String, trim: true },
    name: { type: String, required: true, trim: true },
    hospitalType: { type: String, trim: true },
    speciality: { type: String, trim: true },
    location: { type: String, trim: true },
    contactNumber: { type: String, trim: true },
    email: { type: String, trim: true, lowercase: true },
    source: { type: String, trim: true },
    vacancy: { type: Number, min: 0 },
    contactStatus: { type: String, enum: ['Connected', 'Not Connected'] },
    outreachVacancies: { type: Number, min: 0, validate: Number.isInteger },
    outreachNotes: { type: String, trim: true, maxlength: 5000 },
    hospitalCommitments: { type: String, trim: true, maxlength: 5000 },
    createdById: { type: String, trim: true },
    createdByName: { type: String, trim: true },
    createdByEmail: { type: String, trim: true, lowercase: true },
    createdByRole: { type: String, trim: true },
}, {
    timestamps: true,
    toJSON: {
        virtuals: true,
        versionKey: false,
        transform: (_doc, ret) => {
            ret.id = ret._id ? ret._id.toString() : ret.id;
            delete ret._id;
            return ret;
        }
    }
});
exports.Hospital = mongoose_1.default.model('Hospital', HospitalSchema);
//# sourceMappingURL=Hospital.js.map