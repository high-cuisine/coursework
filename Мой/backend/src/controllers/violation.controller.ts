import { Request, Response } from 'express';
import { ViolationService } from '../services/violation.service';

export class ViolationController {
  private violationService: ViolationService;

  constructor() {
    this.violationService = new ViolationService();
  }

  async getAllViolations(req: Request, res: Response) {
    try {
      console.log('Getting all violations');
      const violations = await this.violationService.getAllViolations();
      console.log(`Found ${violations.length} violations`);
      res.json(violations);
    } catch (error) {
      console.error('Error in getAllViolations:', error);
      res.status(500).json({ message: 'Error fetching violations', error: error.message });
    }
  }

  async getViolationById(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      console.log(`Getting violation with ID: ${id}`);
      const violation = await this.violationService.getViolationById(id);
      console.log('Found violation:', violation);
      res.json(violation);
    } catch (error) {
      console.error(`Error in getViolationById for ID ${req.params.id}:`, error);
      if (error.message === 'Violation not found') {
        res.status(404).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'Error fetching violation', error: error.message });
      }
    }
  }

  async createViolation(req: Request, res: Response) {
    try {
      console.log('Creating new violation:', req.body);
      const violation = await this.violationService.createViolation(req.body);
      console.log('Created violation:', violation);
      res.status(201).json(violation);
    } catch (error) {
      console.error('Error in createViolation:', error);
      res.status(400).json({ message: 'Error creating violation', error: error.message });
    }
  }

  async updateViolation(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      console.log(`Updating violation with ID: ${id}`, req.body);
      const violation = await this.violationService.updateViolation(id, req.body);
      console.log('Updated violation:', violation);
      res.json(violation);
    } catch (error) {
      console.error(`Error in updateViolation for ID ${req.params.id}:`, error);
      if (error.message === 'Violation not found') {
        res.status(404).json({ message: error.message });
      } else {
        res.status(400).json({ message: 'Error updating violation', error: error.message });
      }
    }
  }

  async createFine(req: Request, res: Response) {
    try {
      console.log('Creating new fine:', req.body);
      const fine = await this.violationService.createFine(req.body);
      console.log('Created fine:', fine);
      res.status(201).json(fine);
    } catch (error) {
      console.error('Error in createFine:', error);
      res.status(400).json({ message: 'Error creating fine', error: error.message });
    }
  }

  async updateFine(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      console.log(`Updating fine with ID: ${id}`, req.body);
      const fine = await this.violationService.updateFine(id, req.body);
      console.log('Updated fine:', fine);
      res.json(fine);
    } catch (error) {
      console.error(`Error in updateFine for ID ${req.params.id}:`, error);
      if (error.message === 'Fine not found') {
        res.status(404).json({ message: error.message });
      } else {
        res.status(400).json({ message: 'Error updating fine', error: error.message });
      }
    }
  }

  async getViolationFines(req: Request, res: Response) {
    try {
      const violationId = parseInt(req.params.violationId);
      console.log(`Getting fines for violation ID: ${violationId}`);
      const fines = await this.violationService.getViolationFines(violationId);
      console.log(`Found ${fines.length} fines for violation ID: ${violationId}`);
      res.json(fines);
    } catch (error) {
      console.error(`Error in getViolationFines for violation ID ${req.params.violationId}:`, error);
      res.status(500).json({ message: 'Error fetching violation fines', error: error.message });
    }
  }

  async getOverdueViolations(req: Request, res: Response) {
    try {
      console.log('Getting overdue violations');
      const violations = await this.violationService.getOverdueViolations();
      console.log(`Found ${violations.length} overdue violations`);
      res.json(violations);
    } catch (error) {
      console.error('Error in getOverdueViolations:', error);
      res.status(500).json({ message: 'Error fetching overdue violations', error: error.message });
    }
  }

  async getViolationsByStatus(req: Request, res: Response) {
    try {
      const status = req.params.status;
      console.log(`Getting violations with status: ${status}`);
      const violations = await this.violationService.getViolationsByStatus(status);
      console.log(`Found ${violations.length} violations with status: ${status}`);
      res.json(violations);
    } catch (error) {
      console.error(`Error in getViolationsByStatus for status ${req.params.status}:`, error);
      res.status(500).json({ message: 'Error fetching violations by status', error: error.message });
    }
  }
} 