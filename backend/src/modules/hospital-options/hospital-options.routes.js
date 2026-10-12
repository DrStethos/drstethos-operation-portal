"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../../middleware/auth.middleware");
const hospital_options_controller_1 = require("./hospital-options.controller");
const router = (0, express_1.Router)();
router.use(auth_middleware_1.authenticate, (0, auth_middleware_1.authorizeRoles)('SUPER_ADMIN', 'MANAGER'));
router.get('/', hospital_options_controller_1.getOptions);
router.post('/', (0, auth_middleware_1.authorizeRoles)('SUPER_ADMIN'), hospital_options_controller_1.addOption);
router.delete('/', (0, auth_middleware_1.authorizeRoles)('SUPER_ADMIN'), hospital_options_controller_1.removeOption);
exports.default = router;
//# sourceMappingURL=hospital-options.routes.js.map