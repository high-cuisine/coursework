import { Request, Response } from 'express';
import { TaxpayerService } from '../services/taxpayer.service';

export class TaxpayerController {
  private taxpayerService: TaxpayerService;

  constructor() {
    this.taxpayerService = new TaxpayerService();
  }

  async getAllTaxpayers(req: Request, res: Response) {
    try {
      console.log('Getting all taxpayers');
      const taxpayers = await this.taxpayerService.getAllTaxpayers();
      console.log(`Found ${taxpayers.length} taxpayers`);
      res.json(taxpayers);
    } catch (error) {
      console.error('Error in getAllTaxpayers:', error);
      res.status(500).json({ message: 'Error fetching taxpayers', error: error.message });
    }
  }

  async getTaxpayerById(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      console.log(`Getting taxpayer with ID: ${id}`);
      const taxpayer = await this.taxpayerService.getTaxpayerById(id);
      console.log('Found taxpayer:', taxpayer);
      res.json(taxpayer);
    } catch (error) {
      console.error(`Error in getTaxpayerById for ID ${req.params.id}:`, error);
      if (error.message === 'Taxpayer not found') {
        res.status(404).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'Error fetching taxpayer', error: error.message });
      }
    }
  }

  async createTaxpayer(req: Request, res: Response) {
    try {
      console.log('Creating new taxpayer:', req.body);
      const taxpayer = await this.taxpayerService.createTaxpayer(req.body);
      console.log('Created taxpayer:', taxpayer);
      res.status(201).json(taxpayer);
    } catch (error) {
      console.error('Error in createTaxpayer:', error);
      res.status(400).json({ message: 'Error creating taxpayer', error: error.message });
    }
  }

  async updateTaxpayer(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      console.log(`Updating taxpayer with ID: ${id}`, req.body);
      const taxpayer = await this.taxpayerService.updateTaxpayer(id, req.body);
      console.log('Updated taxpayer:', taxpayer);
      res.json(taxpayer);
    } catch (error) {
      console.error(`Error in updateTaxpayer for ID ${req.params.id}:`, error);
      if (error.message === 'Taxpayer not found') {
        res.status(404).json({ message: error.message });
      } else {
        res.status(400).json({ message: 'Error updating taxpayer', error: error.message });
      }
    }
  }

  async deleteTaxpayer(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      console.log(`Deleting taxpayer with ID: ${id}`);
      await this.taxpayerService.deleteTaxpayer(id);
      console.log(`Successfully deleted taxpayer with ID: ${id}`);
      res.status(204).send();
    } catch (error) {
      console.error(`Error in deleteTaxpayer for ID ${req.params.id}:`, error);
      if (error.message === 'Taxpayer not found') {
        res.status(404).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'Error deleting taxpayer', error: error.message });
      }
    }
  }

  async getTaxpayerViolations(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      console.log(`Getting violations for taxpayer ID: ${id}`);
      const violations = await this.taxpayerService.getTaxpayerViolations(id);
      console.log(`Found ${violations.length} violations for taxpayer ID: ${id}`);
      res.json(violations);
    } catch (error) {
      console.error(`Error in getTaxpayerViolations for ID ${req.params.id}:`, error);
      res.status(500).json({ message: 'Error fetching taxpayer violations', error: error.message });
    }
  }

  async getTaxpayerFines(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      console.log(`Getting fines for taxpayer ID: ${id}`);
      const fines = await this.taxpayerService.getTaxpayerFines(id);
      console.log(`Found ${fines.length} fines for taxpayer ID: ${id}`);
      res.json(fines);
    } catch (error) {
      console.error(`Error in getTaxpayerFines for ID ${req.params.id}:`, error);
      res.status(500).json({ message: 'Error fetching taxpayer fines', error: error.message });
    }
  }
} 