import mongoose from 'mongoose';
import { setServers } from 'node:dns';
import dotenv from 'dotenv';
dotenv.config();

const connectDB = async () => {
  try {
    const dnsServers = process.env.MONGODB_DNS_SERVERS
      ?.split(',')
      .map((server) => server.trim())
      .filter(Boolean) ?? ['8.8.8.8', '8.8.4.4'];
    setServers(dnsServers);

    const mongoURI = process.env.MONGO_URI;
    if (!mongoURI) {
      console.error('MONGO_URI is not defined in environment variables');
      process.exit(1);
    }
    await mongoose.connect(mongoURI);
    console.log('MongoDB Connected...');
  } catch (err: any) {
    console.error('Error connecting to MongoDB:', err.message);
    process.exit(1);
  }
};

export default connectDB;
