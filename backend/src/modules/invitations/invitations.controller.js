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
exports.acceptInvitation = exports.deleteInvitation = exports.getInvitations = exports.createInvitation = void 0;
const invitationService = __importStar(require("./invitations.service"));
const createInvitation = async (req, res) => {
    try {
        const { email, role } = req.body;
        if (!email || !role) {
            return res.status(400).json({ error: 'Email and role are required' });
        }
        const invitation = await invitationService.createInvitation(email, role);
        res.status(201).json(invitation);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
};
exports.createInvitation = createInvitation;
const getInvitations = async (req, res) => {
    try {
        const invitations = await invitationService.getInvitations();
        res.status(200).json(invitations);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.getInvitations = getInvitations;
const deleteInvitation = async (req, res) => {
    try {
        const id = String(req.params.id);
        await invitationService.deleteInvitation(id);
        res.status(200).json({ message: 'Invitation revoked successfully' });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.deleteInvitation = deleteInvitation;
const acceptInvitation = async (req, res) => {
    try {
        const token = String(req.params.token);
        const { password } = req.body;
        if (!password) {
            return res.status(400).json({ error: 'Password is required' });
        }
        const user = await invitationService.acceptInvitation(token, password);
        res.status(200).json({
            message: 'Invitation accepted successfully',
            user: { id: user.id || user._id, email: user.email, role: user.role }
        });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
};
exports.acceptInvitation = acceptInvitation;
//# sourceMappingURL=invitations.controller.js.map