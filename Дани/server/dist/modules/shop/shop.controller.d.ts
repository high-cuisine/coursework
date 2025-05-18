import { ShopService } from './shop.service';
import { Request, Response } from 'express';
export declare class ShopController {
    private readonly shopService;
    constructor(shopService: ShopService);
    getAll(req: Request, res: Response): Promise<void>;
    getById(req: Request, res: Response): Promise<void>;
    createShop(req: Request, res: Response): Promise<void>;
}
