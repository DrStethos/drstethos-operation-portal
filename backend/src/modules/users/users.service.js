"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserRole = exports.deleteUser = exports.getUsers = void 0;
const User_1 = require("../../models/User");
const getUsers = async () => {
    return await User_1.User.find().select('-password').sort({ createdAt: -1 }).lean();
};
exports.getUsers = getUsers;
const deleteUser = async (id, currentUserId) => {
    if (id === currentUserId) {
        throw new Error('You cannot delete your own account');
    }
    return await User_1.User.findByIdAndDelete(id);
};
exports.deleteUser = deleteUser;
const updateUserRole = async (id, role) => {
    return await User_1.User.findByIdAndUpdate(id, { role }, { new: true }).select('-password').lean();
};
exports.updateUserRole = updateUserRole;
//# sourceMappingURL=users.service.js.map