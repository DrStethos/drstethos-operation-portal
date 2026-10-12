import { Router } from 'express';
import { authenticate, authorizeRoles } from '../../middleware/auth.middleware';
import { addOption, getOptions, removeOption } from './hospital-options.controller';

const router = Router();

router.use(authenticate, authorizeRoles('SUPER_ADMIN', 'MANAGER'));
router.get('/', getOptions);
router.post('/', authorizeRoles('SUPER_ADMIN'), addOption);
router.delete('/', authorizeRoles('SUPER_ADMIN'), removeOption);

export default router;
