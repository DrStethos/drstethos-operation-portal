"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../../middleware/auth.middleware");
const verification_controller_1 = require("./verification.controller");
const router = (0, express_1.Router)();
router.use(auth_middleware_1.authenticate);
router.use((0, auth_middleware_1.authorizeRoles)('SUPER_ADMIN', 'super_admin'));
router.post('/:profileType/:profileId/decision', verification_controller_1.decideVerification);
exports.default = router;
//# sourceMappingURL=verification.routes.js.map