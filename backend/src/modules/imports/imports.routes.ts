import { Router } from 'express';
import { authenticate, authorizeRoles } from '../../middleware/auth.middleware';
import * as importController from './imports.controller';
import multer from 'multer';

const upload = multer({ dest: 'uploads/' });
const router = Router();

router.post('/hospitals', authenticate, authorizeRoles(['SUPER_ADMIN', 'MANAGER']), upload.single('file'), importController.importHospitals);

export default router;

