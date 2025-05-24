import { Request, Response } from 'express';
import { TaxpayerService } from '../services/taxpayer.service';

export class TaxpayerController {
  private taxpayerService: TaxpayerService;

  constructor() {
    this.taxpayerService = new TaxpayerService();
  }

  async getAllTaxpayers(req: Request, res: Response) {
    try {
      const taxpayers = await this.taxpayerService.getAllTaxpayers();
      res.json(taxpayers);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching taxpayers', error: error.message });
    }
  }

  async getTaxpayerById(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const taxpayer = await this.taxpayerService.getTaxpayerById(id);
      res.json(taxpayer);
    } catch (error) {
      if (error.message === 'Taxpayer not found') {
        res.status(404).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'Error fetching taxpayer', error: error.message });
      }
    }
  }

  async createTaxpayer(req: Request, res: Response) {
    try {
      const taxpayer = await this.taxpayerService.createTaxpayer(req.body);
      res.status(201).json(taxpayer);
    } catch (error) {
      res.status(400).json({ message: 'Error creating taxpayer', error: error.message });
    }
  }

  async updateTaxpayer(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const taxpayer = await this.taxpayerService.updateTaxpayer(id, req.body);
      res.json(taxpayer);
    } catch (error) {
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
      await this.taxpayerService.deleteTaxpayer(id);
      res.status(204).send();
    } catch (error) {
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
      const violations = await this.taxpayerService.getTaxpayerViolations(id);
      res.json(violations);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching taxpayer violations', error: error.message });
    }
  }

  async getTaxpayerFines(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const fines = await this.taxpayerService.getTaxpayerFines(id);
      res.json(fines);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching taxpayer fines', error: error.message });
    }
  }
} 