import { Request, Response } from 'express';
export declare class TaxpayerController {
    private taxpayerService;
    constructor();
    getAllTaxpayers(req: Request, res: Response): Promise<void>;
    getTaxpayerById(req: Request, res: Response): Promise<void>;
    createTaxpayer(req: Request, res: Response): Promise<void>;
    updateTaxpayer(req: Request, res: Response): Promise<void>;
    deleteTaxpayer(req: Request, res: Response): Promise<void>;
    getTaxpayerViolations(req: Request, res: Response): Promise<void>;
    getTaxpayerFines(req: Request, res: Response): Promise<void>;
}
