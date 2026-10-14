"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const dotenv_1 = __importDefault(require("dotenv"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const hospitals_routes_1 = __importDefault(require("./modules/hospitals/hospitals.routes"));
const auth_routes_1 = __importDefault(require("./modules/auth/auth.routes"));
const invitations_routes_1 = __importDefault(require("./modules/invitations/invitations.routes"));
const imports_routes_1 = __importDefault(require("./modules/imports/imports.routes"));
const users_routes_1 = __importDefault(require("./modules/users/users.routes"));
const hospital_options_routes_1 = __importDefault(require("./modules/hospital-options/hospital-options.routes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const allowedOrigins = (process.env.FRONTEND_URL || '')
    .split(',')
    .map((origin) => origin.trim().replace(/\/+$/, ''))
    .filter(Boolean);
const productionOrigins = ['https://operations.drstethos.com'];
const isDevelopment = process.env.NODE_ENV !== 'production';
app.use((0, cors_1.default)({
    origin: (origin, callback) => {
        const isLocalDevelopmentOrigin = isDevelopment &&
            /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin || '');
        callback(null, !origin ||
            allowedOrigins.includes(origin) ||
            productionOrigins.includes(origin) ||
            isLocalDevelopmentOrigin);
    },
    credentials: true,
}));
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
// Define routes here
app.use('/api/hospitals', hospitals_routes_1.default);
app.use('/api/hospital-options', hospital_options_routes_1.default);
app.use('/api/auth', auth_routes_1.default);
app.use('/api/invitations', invitations_routes_1.default);
app.use('/api/imports', imports_routes_1.default);
app.use('/api/users', users_routes_1.default);
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK', message: 'Hospital Operations Portal API' });
});
const frontendDistPath = path_1.default.resolve(__dirname, '../../frontend/dist');
if (fs_1.default.existsSync(path_1.default.join(frontendDistPath, 'index.html'))) {
    app.use(express_1.default.static(frontendDistPath, { index: false }));
    app.use((req, res, next) => {
        if (req.method !== 'GET' || req.path.startsWith('/api/') || req.path === '/health' || !req.accepts('html')) {
            return next();
        }
        res.sendFile(path_1.default.join(frontendDistPath, 'index.html'));
    });
}
exports.default = app;
//# sourceMappingURL=app.js.map