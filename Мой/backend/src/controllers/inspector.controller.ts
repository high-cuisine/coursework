import { Request, Response } from 'express';
import { InspectorService } from '../services/inspector.service';

export class InspectorController {
  private inspectorService: InspectorService;

  constructor() {
    this.inspectorService = new InspectorService();
  }

  async getAllInspectors(req: Request, res: Response) {
    try {
      console.log('Getting all inspectors');
      const inspectors = await this.inspectorService.getAllInspectors();
      console.log(`Found ${inspectors.length} inspectors`);
      res.json(inspectors);
    } catch (error) {
      console.error('Error in getAllInspectors:', error);
      res.status(500).json({ message: 'Error fetching inspectors', error: error.message });
    }
  }

  async getInspectorById(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      console.log(`Getting inspector with ID: ${id}`);
      const inspector = await this.inspectorService.getInspectorById(id);
      console.log('Found inspector:', inspector);
      res.json(inspector);
    } catch (error) {
      console.error(`Error in getInspectorById for ID ${req.params.id}:`, error);
      if (error.message === 'Inspector not found') {
        res.status(404).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'Error fetching inspector', error: error.message });
      }
    }
  }

  async createInspector(req: Request, res: Response) {
    try {
      console.log('Creating new inspector:', req.body);
      const inspector = await this.inspectorService.createInspector(req.body);
      console.log('Created inspector:', inspector);
      res.status(201).json(inspector);
    } catch (error) {
      console.error('Error in createInspector:', error);
      res.status(400).json({ message: 'Error creating inspector', error: error.message });
    }
  }

  async updateInspector(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      console.log(`Updating inspector with ID: ${id}`, req.body);
      const inspector = await this.inspectorService.updateInspector(id, req.body);
      console.log('Updated inspector:', inspector);
      res.json(inspector);
    } catch (error) {
      console.error(`Error in updateInspector for ID ${req.params.id}:`, error);
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
      console.log(`Deleting inspector with ID: ${id}`);
      await this.inspectorService.deleteInspector(id);
      console.log(`Successfully deleted inspector with ID: ${id}`);
      res.status(204).send();
    } catch (error) {
      console.error(`Error in deleteInspector for ID ${req.params.id}:`, error);
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
      console.log(`Getting violations for inspector ID: ${id}`);
      const violations = await this.inspectorService.getInspectorViolations(id);
      console.log(`Found ${violations.length} violations for inspector ID: ${id}`);
      res.json(violations);
    } catch (error) {
      console.error(`Error in getInspectorViolations for ID ${req.params.id}:`, error);
      res.status(500).json({ message: 'Error fetching inspector violations', error: error.message });
    }
  }

  async getInspectorDepartment(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      console.log(`Getting department for inspector ID: ${id}`);
      const department = await this.inspectorService.getInspectorDepartment(id);
      console.log('Found department:', department);
      res.json(department);
    } catch (error) {
      console.error(`Error in getInspectorDepartment for ID ${req.params.id}:`, error);
      res.status(500).json({ message: 'Error fetching inspector department', error: error.message });
    }
  }
} 