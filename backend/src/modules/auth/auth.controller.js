"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const auth_service_1 = require("./auth.service");
class AuthController {
    static async login(req, res) {
        try {
            const { email, password } = req.body;
            const { user, token } = await auth_service_1.AuthService.login(email, password);
            res.cookie('token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                maxAge: 24 * 60 * 60 * 1000 // 1 day
            });
            res.json({ message: 'Logged in successfully', user, token });
        }
        catch (error) {
            res.status(401).json({ message: error.message || 'Login failed' });
        }
    }
    static async logout(req, res) {
        res.clearCookie('token');
        res.json({ message: 'Logged out successfully' });
    }
    static async me(req, res) {
        const user = req.user;
        if (!user) {
            return res.status(401).json({ message: 'Not authenticated' });
        }
        res.json({ user });
    }
}
exports.AuthController = AuthController;
//# sourceMappingURL=auth.controller.js.map