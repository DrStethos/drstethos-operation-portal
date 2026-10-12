"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const User_1 = require("../../models/User");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';
class AuthService {
    static async login(email, password) {
        const user = await User_1.User.findOne({ email: email.toLowerCase() }).lean();
        if (!user || !user.password) {
            throw new Error('Invalid credentials');
        }
        const isMatch = await bcrypt_1.default.compare(password, user.password);
        if (!isMatch) {
            throw new Error('Invalid credentials');
        }
        const idStr = user._id ? user._id.toString() : (user.id || '');
        const token = jsonwebtoken_1.default.sign({
            id: idStr,
            userId: idStr,
            email: user.email,
            role: user.role,
            firstName: user.firstName,
            lastName: user.lastName,
        }, JWT_SECRET, { expiresIn: '1d' });
        return {
            user: {
                id: idStr,
                email: user.email,
                role: user.role,
                firstName: user.firstName,
                lastName: user.lastName
            },
            token
        };
    }
}
exports.AuthService = AuthService;
//# sourceMappingURL=auth.service.js.map