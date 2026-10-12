"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const dotenv_1 = __importDefault(require("dotenv"));
const User_1 = require("./models/User");
dotenv_1.default.config();
const seed = async () => {
    const mongoURI = process.env.MONGO_URI;
    if (!mongoURI) {
        console.error('MONGO_URI is not defined in environment variables');
        process.exit(1);
    }
    try {
        await mongoose_1.default.connect(mongoURI);
        console.log('Connected to MongoDB for seeding...');
        const adminEmail = process.env.DEFAULT_ADMIN_EMAIL || 'admin@drstethos.com';
        const adminPassword = process.env.DEFAULT_ADMIN_PASSWORD || 'AdminPassword123!';
        const existingAdmin = await User_1.User.findOne({ email: adminEmail.toLowerCase() });
        if (!existingAdmin) {
            const hashedPassword = await bcrypt_1.default.hash(adminPassword, 10);
            const user = await User_1.User.create({
                email: adminEmail.toLowerCase(),
                password: hashedPassword,
                role: 'SUPER_ADMIN',
                firstName: 'System',
                lastName: 'Admin',
            });
            console.log(`Default Super Admin created: ${user.email}`);
        }
        else {
            console.log(`Admin user ${adminEmail} already exists.`);
        }
        console.log('Seeding completed successfully.');
        await mongoose_1.default.disconnect();
        process.exit(0);
    }
    catch (error) {
        console.error('Error during seeding:', error);
        process.exit(1);
    }
};
seed();
//# sourceMappingURL=seed.js.map