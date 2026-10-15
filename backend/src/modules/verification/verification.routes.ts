import { Router } from 'express';
import { authenticate, authorizeRoles } from '../../middleware/auth.middleware';
import { decideVerification } from './verification.controller';

const router = Router();

router.use(authenticate);
router.use(authorizeRoles('SUPER_ADMIN', 'super_admin'));
router.post('/:profileType/:profileId/decision', decideVerification);

export default router;
