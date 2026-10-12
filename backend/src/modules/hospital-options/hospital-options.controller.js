"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeOption = exports.addOption = exports.getOptions = void 0;
const hospital_options_service_1 = require("./hospital-options.service");
const getOptions = async (_req, res) => {
    try {
        res.json(await hospital_options_service_1.hospitalOptionsService.getOptions());
    }
    catch (error) {
        console.error('Failed to load hospital field options:', error);
        res.status(500).json({ message: 'Failed to load hospital field options' });
    }
};
exports.getOptions = getOptions;
const addOption = async (req, res) => {
    try {
        res.json(await hospital_options_service_1.hospitalOptionsService.addOption(req.body.field, req.body.value));
    }
    catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to add hospital field option';
        const status = message.startsWith('Invalid ') || message.startsWith('Option value') ? 400 : 500;
        if (status === 500)
            console.error('Failed to add hospital field option:', error);
        res.status(status).json({ message });
    }
};
exports.addOption = addOption;
const removeOption = async (req, res) => {
    try {
        res.json(await hospital_options_service_1.hospitalOptionsService.removeOption(req.body.field, req.body.value));
    }
    catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to remove hospital field option';
        const status = message.startsWith('Invalid ') || message.startsWith('Option value') ? 400 : 500;
        if (status === 500)
            console.error('Failed to remove hospital field option:', error);
        res.status(status).json({ message });
    }
};
exports.removeOption = removeOption;
//# sourceMappingURL=hospital-options.controller.js.map