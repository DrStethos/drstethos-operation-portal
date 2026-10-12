import { Router } from 'express';
import { authenticate, authorizeRoles } from '../../middleware/auth.middleware';
import * as invitationController from './invitations.controller';

const router = Router();

router.post('/', authenticate, authorizeRoles('SUPER_ADMIN'), invitationController.createInvitation);
router.get('/', authenticate, authorizeRoles('SUPER_ADMIN'), invitationController.getInvitations);
router.delete('/:id', authenticate, authorizeRoles('SUPER_ADMIN'), invitationController.deleteInvitation);
router.post('/:token/accept', invitationController.acceptInvitation);

export default router;
