"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.acceptInvitation = exports.deleteInvitation = exports.getInvitations = exports.createInvitation = void 0;
const crypto_1 = __importDefault(require("crypto"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const email_service_1 = require("../email/email.service");
const AdminInvitation_1 = require("../../models/AdminInvitation");
const User_1 = require("../../models/User");
const createInvitation = async (email, role) => {
    const token = crypto_1.default.randomBytes(32).toString('hex');
    const hashedToken = await bcrypt_1.default.hash(token, 10);
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
    await AdminInvitation_1.AdminInvitation.findOneAndUpdate({ email: email.toLowerCase() }, { token: hashedToken, role, expiresAt }, { new: true, upsert: true }).lean();
    await (0, email_service_1.sendInvitationEmail)(email, token, role);
    return { email, token };
};
exports.createInvitation = createInvitation;
const getInvitations = async () => {
    return await AdminInvitation_1.AdminInvitation.find().sort({ createdAt: -1 }).lean();
};
exports.getInvitations = getInvitations;
const deleteInvitation = async (id) => {
    return await AdminInvitation_1.AdminInvitation.findByIdAndDelete(id);
};
exports.deleteInvitation = deleteInvitation;
const acceptInvitation = async (token, password) => {
    const invitations = await AdminInvitation_1.AdminInvitation.find().lean();
    let validInvitation = null;
    for (const inv of invitations) {
        if (await bcrypt_1.default.compare(token, inv.token) && inv.expiresAt > new Date()) {
            validInvitation = inv;
            break;
        }
    }
    if (!validInvitation) {
        throw new Error('Invalid or expired token');
    }
    const hashedPassword = await bcrypt_1.default.hash(password, 10);
    const user = await User_1.User.create({
        email: validInvitation.email.toLowerCase(),
        password: hashedPassword,
        role: validInvitation.role,
    });
    await AdminInvitation_1.AdminInvitation.findByIdAndDelete(validInvitation._id);
    return user.toJSON();
};
exports.acceptInvitation = acceptInvitation;
//# sourceMappingURL=invitations.service.js.map