import crypto from 'crypto';
import bcrypt from 'bcrypt';
import { sendInvitationEmail } from '../email/email.service';
import { AdminInvitation } from '../../models/AdminInvitation';
import { User } from '../../models/User';

export const createInvitation = async (email: string, role: 'SUPER_ADMIN' | 'MANAGER') => {
  const token = crypto.randomBytes(32).toString('hex');
  const hashedToken = await bcrypt.hash(token, 10);
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

  await AdminInvitation.findOneAndUpdate(
    { email: email.toLowerCase() },
    { token: hashedToken, role, expiresAt },
    { new: true, upsert: true }
  ).lean();

  await sendInvitationEmail(email, token, role);

  return { email, token };
};

export const getInvitations = async () => {
  return await AdminInvitation.find().sort({ createdAt: -1 }).lean();
};

export const deleteInvitation = async (id: string) => {
  return await AdminInvitation.findByIdAndDelete(id);
};

export const acceptInvitation = async (token: string, password: string) => {
  const invitations = await AdminInvitation.find().lean();
  let validInvitation = null;

  for (const inv of invitations) {
    if (await bcrypt.compare(token, inv.token) && inv.expiresAt > new Date()) {
      validInvitation = inv;
      break;
    }
  }

  if (!validInvitation) {
    throw new Error('Invalid or expired token');
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    email: validInvitation.email.toLowerCase(),
    password: hashedPassword,
    role: validInvitation.role,
  });

  await AdminInvitation.findByIdAndDelete(validInvitation._id);

  return user.toJSON();
};
