import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import { User } from './models/User';

dotenv.config();

const seed = async () => {
  const mongoURI = process.env.MONGO_URI;
  if (!mongoURI) {
    console.error('MONGO_URI is not defined in environment variables');
    process.exit(1);
  }

  try {
    await mongoose.connect(mongoURI);
    console.log('Connected to MongoDB for seeding...');

    const adminEmail = process.env.DEFAULT_ADMIN_EMAIL || 'admin@drstethos.com';
    const adminPassword = process.env.DEFAULT_ADMIN_PASSWORD || 'AdminPassword123!';

    const existingAdmin = await User.findOne({ email: adminEmail.toLowerCase() });
    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash(adminPassword, 10);
      const user = await User.create({
        email: adminEmail.toLowerCase(),
        password: hashedPassword,
        role: 'SUPER_ADMIN',
        firstName: 'System',
        lastName: 'Admin',
      });
      console.log(`Default Super Admin created: ${user.email}`);
    } else {
      console.log(`Admin user ${adminEmail} already exists.`);
    }

    console.log('Seeding completed successfully.');
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('Error during seeding:', error);
    process.exit(1);
  }
};

seed();

