"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaxpayerController = void 0;
const taxpayer_service_1 = require("../services/taxpayer.service");
class TaxpayerController {
    constructor() {
        this.taxpayerService = new taxpayer_service_1.TaxpayerService();
    }
    async getAllTaxpayers(req, res) {
        try {
            const taxpayers = await this.taxpayerService.getAllTaxpayers();
            res.json(taxpayers);
        }
        catch (error) {
            res.status(500).json({ message: 'Error fetching taxpayers', error: error.message });
        }
    }
    async getTaxpayerById(req, res) {
        try {
            const id = parseInt(req.params.id);
            const taxpayer = await this.taxpayerService.getTaxpayerById(id);
            res.json(taxpayer);
        }
        catch (error) {
            if (error.message === 'Taxpayer not found') {
                res.status(404).json({ message: error.message });
            }
            else {
                res.status(500).json({ message: 'Error fetching taxpayer', error: error.message });
            }
        }
    }
    async createTaxpayer(req, res) {
        try {
            const taxpayer = await this.taxpayerService.createTaxpayer(req.body);
            res.status(201).json(taxpayer);
        }
        catch (error) {
            res.status(400).json({ message: 'Error creating taxpayer', error: error.message });
        }
    }
    async updateTaxpayer(req, res) {
        try {
            const id = parseInt(req.params.id);
            const taxpayer = await this.taxpayerService.updateTaxpayer(id, req.body);
            res.json(taxpayer);
        }
        catch (error) {
            if (error.message === 'Taxpayer not found') {
                res.status(404).json({ message: error.message });
            }
            else {
                res.status(400).json({ message: 'Error updating taxpayer', error: error.message });
            }
        }
    }
    async deleteTaxpayer(req, res) {
        try {
            const id = parseInt(req.params.id);
            await this.taxpayerService.deleteTaxpayer(id);
            res.status(204).send();
        }
        catch (error) {
            if (error.message === 'Taxpayer not found') {
                res.status(404).json({ message: error.message });
            }
            else {
                res.status(500).json({ message: 'Error deleting taxpayer', error: error.message });
            }
        }
    }
    async getTaxpayerViolations(req, res) {
        try {
            const id = parseInt(req.params.id);
            const violations = await this.taxpayerService.getTaxpayerViolations(id);
            res.json(violations);
        }
        catch (error) {
            res.status(500).json({ message: 'Error fetching taxpayer violations', error: error.message });
        }
    }
    async getTaxpayerFines(req, res) {
        try {
            const id = parseInt(req.params.id);
            const fines = await this.taxpayerService.getTaxpayerFines(id);
            res.json(fines);
        }
        catch (error) {
            res.status(500).json({ message: 'Error fetching taxpayer fines', error: error.message });
        }
    }
}
exports.TaxpayerController = TaxpayerController;
//# sourceMappingURL=taxpayer.controller.js.map