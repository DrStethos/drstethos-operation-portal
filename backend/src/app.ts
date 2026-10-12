import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import hospitalRoutes from './modules/hospitals/hospitals.routes';
import authRoutes from './modules/auth/auth.routes';
import invitationRoutes from './modules/invitations/invitations.routes';
import importRoutes from './modules/imports/imports.routes';
import userRoutes from './modules/users/users.routes';
import hospitalOptionsRoutes from './modules/hospital-options/hospital-options.routes';

dotenv.config();

const app = express();

const allowedOrigins = (process.env.FRONTEND_URL || '')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

if (process.env.NODE_ENV !== 'production') {
  allowedOrigins.push('http://localhost:8080', 'http://127.0.0.1:8080');
}

app.use(cors({
  origin: (origin, callback) => {
    callback(null, !origin || allowedOrigins.includes(origin));
  },
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

// Define routes here
app.use('/api/hospitals', hospitalRoutes);
app.use('/api/hospital-options', hospitalOptionsRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/invitations', invitationRoutes);
app.use('/api/imports', importRoutes);
app.use('/api/users', userRoutes);

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Hospital Operations Portal API' });
});

const frontendDistPath = path.resolve(__dirname, '../../frontend/dist');
if (fs.existsSync(path.join(frontendDistPath, 'index.html'))) {
  app.use(express.static(frontendDistPath, { index: false }));
  app.use((req, res, next) => {
    if (req.method !== 'GET' || req.path.startsWith('/api/') || req.path === '/health' || !req.accepts('html')) {
      return next();
    }
    res.sendFile(path.join(frontendDistPath, 'index.html'));
  });
}

export default app;
