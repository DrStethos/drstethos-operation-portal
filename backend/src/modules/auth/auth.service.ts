import { User } from '../../models/User';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';

export class AuthService {
  static async login(email: string, password: string) {
    const user = await User.findOne({ email: email.toLowerCase() }).lean();
    if (!user || !user.password) {
      throw new Error('Invalid credentials');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error('Invalid credentials');
    }

    const idStr = user._id ? user._id.toString() : (user.id || '');
    const token = jwt.sign(
      {
        id: idStr,
        userId: idStr,
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
      },
      JWT_SECRET,
      { expiresIn: '1d' }
    );

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
