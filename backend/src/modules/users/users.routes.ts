import { Router } from 'express';
import { authenticate, authorizeRoles } from '../../middleware/auth.middleware';
import * as usersController from './users.controller';

const router = Router();

router.get('/', authenticate, authorizeRoles('SUPER_ADMIN'), usersController.getUsers);
router.delete('/:id', authenticate, authorizeRoles('SUPER_ADMIN'), usersController.deleteUser);
router.patch('/:id/role', authenticate, authorizeRoles('SUPER_ADMIN'), usersController.updateUserRole);

export default router;

