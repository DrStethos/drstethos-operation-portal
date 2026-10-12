import { Router } from 'express';
import { authenticate, authorizeRoles } from '../../middleware/auth.middleware';
import {
  getAllHospitals,
  getHospitalById,
  createHospital,
  updateHospital,
  deleteHospital
} from './hospitals.controller';

const router = Router();

// Secure all hospital endpoints
router.use(authenticate);
router.use(authorizeRoles('SUPER_ADMIN', 'MANAGER'));

router.get('/', getAllHospitals);
router.get('/:id', getHospitalById);
router.post('/', createHospital);
router.put('/:id', authorizeRoles('SUPER_ADMIN'), updateHospital);
router.delete('/:id', authorizeRoles('SUPER_ADMIN'), deleteHospital);

export default router;
