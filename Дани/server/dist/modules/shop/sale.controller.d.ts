import { SaleService } from './sale.service';
declare class CreateSaleDto {
    storeId: number;
    productId: number;
    quantity: number;
    saleDate?: Date;
}
declare class UpdateSaleDto {
    quantity?: number;
    saleDate?: Date;
}
declare class SaleHistoryDto {
    startDate: Date;
    endDate: Date;
}
export declare class SaleController {
    private readonly saleService;
    constructor(saleService: SaleService);
    create(createSaleDto: CreateSaleDto): Promise<any>;
    findAll(): Promise<any[]>;
    findOne(id: string): Promise<any>;
    getSaleHistory(storeId: string, { startDate, endDate }: SaleHistoryDto): Promise<any[]>;
    update(id: string, updateSaleDto: UpdateSaleDto): Promise<any>;
    remove(id: string): Promise<any>;
}
export {};
