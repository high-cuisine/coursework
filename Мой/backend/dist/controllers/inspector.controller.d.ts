import { Request, Response } from 'express';
export declare class InspectorController {
    private inspectorService;
    constructor();
    getAllInspectors(req: Request, res: Response): Promise<void>;
    getInspectorById(req: Request, res: Response): Promise<void>;
    createInspector(req: Request, res: Response): Promise<void>;
    updateInspector(req: Request, res: Response): Promise<void>;
    deleteInspector(req: Request, res: Response): Promise<void>;
    getInspectorViolations(req: Request, res: Response): Promise<void>;
    getInspectorDepartment(req: Request, res: Response): Promise<void>;
}
