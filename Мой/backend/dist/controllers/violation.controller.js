"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ViolationController = void 0;
const violation_service_1 = require("../services/violation.service");
class ViolationController {
    constructor() {
        this.violationService = new violation_service_1.ViolationService();
    }
    async getAllViolations(req, res) {
        try {
            const violations = await this.violationService.getAllViolations();
            res.json(violations);
        }
        catch (error) {
            res.status(500).json({ message: 'Error fetching violations', error: error.message });
        }
    }
    async getViolationById(req, res) {
        try {
            const id = parseInt(req.params.id);
            const violation = await this.violationService.getViolationById(id);
            res.json(violation);
        }
        catch (error) {
            if (error.message === 'Violation not found') {
                res.status(404).json({ message: error.message });
            }
            else {
                res.status(500).json({ message: 'Error fetching violation', error: error.message });
            }
        }
    }
    async createViolation(req, res) {
        try {
            const violation = await this.violationService.createViolation(req.body);
            res.status(201).json(violation);
        }
        catch (error) {
            res.status(400).json({ message: 'Error creating violation', error: error.message });
        }
    }
    async updateViolation(req, res) {
        try {
            const id = parseInt(req.params.id);
            const violation = await this.violationService.updateViolation(id, req.body);
            res.json(violation);
        }
        catch (error) {
            if (error.message === 'Violation not found') {
                res.status(404).json({ message: error.message });
            }
            else {
                res.status(400).json({ message: 'Error updating violation', error: error.message });
            }
        }
    }
    async createFine(req, res) {
        try {
            const fine = await this.violationService.createFine(req.body);
            res.status(201).json(fine);
        }
        catch (error) {
            res.status(400).json({ message: 'Error creating fine', error: error.message });
        }
    }
    async updateFine(req, res) {
        try {
            const id = parseInt(req.params.id);
            const fine = await this.violationService.updateFine(id, req.body);
            res.json(fine);
        }
        catch (error) {
            if (error.message === 'Fine not found') {
                res.status(404).json({ message: error.message });
            }
            else {
                res.status(400).json({ message: 'Error updating fine', error: error.message });
            }
        }
    }
    async getViolationFines(req, res) {
        try {
            const violationId = parseInt(req.params.violationId);
            const fines = await this.violationService.getViolationFines(violationId);
            res.json(fines);
        }
        catch (error) {
            res.status(500).json({ message: 'Error fetching violation fines', error: error.message });
        }
    }
    async getOverdueViolations(req, res) {
        try {
            const violations = await this.violationService.getOverdueViolations();
            res.json(violations);
        }
        catch (error) {
            res.status(500).json({ message: 'Error fetching overdue violations', error: error.message });
        }
    }
    async getViolationsByStatus(req, res) {
        try {
            const status = req.params.status;
            const violations = await this.violationService.getViolationsByStatus(status);
            res.json(violations);
        }
        catch (error) {
            res.status(500).json({ message: 'Error fetching violations by status', error: error.message });
        }
    }
}
exports.ViolationController = ViolationController;
//# sourceMappingURL=violation.controller.js.map