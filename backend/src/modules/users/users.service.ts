import { User } from '../../models/User';

export const getUsers = async () => {
  return await User.find().select('-password').sort({ createdAt: -1 }).lean();
};

export const deleteUser = async (id: string, currentUserId: string) => {
  if (id === currentUserId) {
    throw new Error('You cannot delete your own account');
  }
  return await User.findByIdAndDelete(id);
};

export const updateUserRole = async (id: string, role: 'SUPER_ADMIN' | 'MANAGER') => {
  return await User.findByIdAndUpdate(id, { role }, { new: true }).select('-password').lean();
};

