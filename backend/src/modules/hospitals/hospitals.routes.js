"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../../middleware/auth.middleware");
const hospitals_controller_1 = require("./hospitals.controller");
const router = (0, express_1.Router)();
// Secure all hospital endpoints
router.use(auth_middleware_1.authenticate);
router.use((0, auth_middleware_1.authorizeRoles)('SUPER_ADMIN', 'MANAGER'));
router.get('/', hospitals_controller_1.getAllHospitals);
router.get('/:id', hospitals_controller_1.getHospitalById);
router.post('/', hospitals_controller_1.createHospital);
router.patch('/:id/outreach', (0, auth_middleware_1.authorizeRoles)('SUPER_ADMIN', 'MANAGER'), hospitals_controller_1.updateHospitalOutreach);
router.delete('/:id/vacancy', (0, auth_middleware_1.authorizeRoles)('SUPER_ADMIN', 'MANAGER'), hospitals_controller_1.removeHospitalVacancy);
router.put('/:id', (0, auth_middleware_1.authorizeRoles)('SUPER_ADMIN', 'MANAGER'), hospitals_controller_1.updateHospital);
router.delete('/bulk', (0, auth_middleware_1.authorizeRoles)('SUPER_ADMIN', 'MANAGER'), hospitals_controller_1.deleteHospitals);
router.delete('/:id', (0, auth_middleware_1.authorizeRoles)('SUPER_ADMIN', 'MANAGER'), hospitals_controller_1.deleteHospital);
exports.default = router;
//# sourceMappingURL=hospitals.routes.js.map