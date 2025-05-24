import { Request, Response } from 'express';
export declare class ViolationController {
    private violationService;
    constructor();
    getAllViolations(req: Request, res: Response): Promise<void>;
    getViolationById(req: Request, res: Response): Promise<void>;
    createViolation(req: Request, res: Response): Promise<void>;
    updateViolation(req: Request, res: Response): Promise<void>;
    createFine(req: Request, res: Response): Promise<void>;
    updateFine(req: Request, res: Response): Promise<void>;
    getViolationFines(req: Request, res: Response): Promise<void>;
    getOverdueViolations(req: Request, res: Response): Promise<void>;
    getViolationsByStatus(req: Request, res: Response): Promise<void>;
}
