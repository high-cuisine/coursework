import { Request, Response } from 'express';
import { InspectorService } from '../services/inspector.service';

export class InspectorController {
  private inspectorService: InspectorService;

  constructor() {
    this.inspectorService = new InspectorService();
  }

  async getAllInspectors(req: Request, res: Response) {
    try {
      const inspectors = await this.inspectorService.getAllInspectors();
      res.json(inspectors);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching inspectors', error: error.message });
    }
  }

  async getInspectorById(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const inspector = await this.inspectorService.getInspectorById(id);
      res.json(inspector);
    } catch (error) {
      if (error.message === 'Inspector not found') {
        res.status(404).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'Error fetching inspector', error: error.message });
      }
    }
  }

  async createInspector(req: Request, res: Response) {
    try {
      const inspector = await this.inspectorService.createInspector(req.body);
      res.status(201).json(inspector);
    } catch (error) {
      res.status(400).json({ message: 'Error creating inspector', error: error.message });
    }
  }

  async updateInspector(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const inspector = await this.inspectorService.updateInspector(id, req.body);
      res.json(inspector);
    } catch (error) {
      if (error.message === 'Inspector not found') {
        res.status(404).json({ message: error.message });
      } else {
        res.status(400).json({ message: 'Error updating inspector', error: error.message });
      }
    }
  }

  async deleteInspector(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      await this.inspectorService.deleteInspector(id);
      res.status(204).send();
    } catch (error) {
      if (error.message === 'Inspector not found') {
        res.status(404).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'Error deleting inspector', error: error.message });
      }
    }
  }

  async getInspectorViolations(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const violations = await this.inspectorService.getInspectorViolations(id);
      res.json(violations);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching inspector violations', error: error.message });
    }
  }

  async getInspectorDepartment(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const department = await this.inspectorService.getInspectorDepartment(id);
      res.json(department);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching inspector department', error: error.message });
    }
  }
} 