import { ReportsService } from './reports.service';
import { Request, Response } from 'express';
export declare class ReportsController {
    private readonly reportService;
    constructor(reportService: ReportsService);
    getAllReports(req: Request, res: Response): Promise<void>;
    getById(req: Request, res: Response): Promise<void>;
    createReport(req: Request, res: Response): Promise<void>;
    deleteReport(req: Request, res: Response): Promise<void>;
    updateReport(req: Request, res: Response): Promise<void>;
    getInventoryReport(): Promise<{
        inventory: any[];
    }>;
}
