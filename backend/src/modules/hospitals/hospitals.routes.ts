import { Router } from 'express';
import { authenticate, authorizeRoles } from '../../middleware/auth.middleware';
import {
  getAllHospitals,
  getHospitalById,
  createHospital,
  updateHospital,
  updateHospitalOutreach,
  removeHospitalVacancy,
  deleteHospital,
  deleteHospitals
} from './hospitals.controller';

const router = Router();

// Secure all hospital endpoints
router.use(authenticate);
router.use(authorizeRoles('SUPER_ADMIN', 'MANAGER'));

router.get('/', getAllHospitals);
router.get('/:id', getHospitalById);
router.post('/', createHospital);
router.patch('/:id/outreach', authorizeRoles('SUPER_ADMIN', 'MANAGER'), updateHospitalOutreach);
router.delete('/:id/vacancy', authorizeRoles('SUPER_ADMIN', 'MANAGER'), removeHospitalVacancy);
router.put('/:id', authorizeRoles('SUPER_ADMIN', 'MANAGER'), updateHospital);
router.delete('/bulk', authorizeRoles('SUPER_ADMIN', 'MANAGER'), deleteHospitals);
router.delete('/:id', authorizeRoles('SUPER_ADMIN', 'MANAGER'), deleteHospital);

export default router;
