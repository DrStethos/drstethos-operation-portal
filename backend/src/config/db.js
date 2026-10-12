"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const node_dns_1 = require("node:dns");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const connectDB = async () => {
    try {
        const dnsServers = process.env.MONGODB_DNS_SERVERS
            ?.split(',')
            .map((server) => server.trim())
            .filter(Boolean) ?? ['8.8.8.8', '8.8.4.4'];
        (0, node_dns_1.setServers)(dnsServers);
        const mongoURI = process.env.MONGO_URI;
        if (!mongoURI) {
            console.error('MONGO_URI is not defined in environment variables');
            process.exit(1);
        }
        await mongoose_1.default.connect(mongoURI);
        console.log('MongoDB Connected...');
    }
    catch (err) {
        console.error('Error connecting to MongoDB:', err.message);
        process.exit(1);
    }
};
exports.default = connectDB;
//# sourceMappingURL=db.js.map