import { SupplyService } from './supply.service';
declare class UpdateSupplyDto {
    quantity?: number;
    supplyDate?: Date;
}
declare class SupplyHistoryDto {
    startDate: Date;
    endDate: Date;
}
export declare class SupplyController {
    private readonly supplyService;
    constructor(supplyService: SupplyService);
    create(createSupplyDto: any): Promise<any>;
    findAll(): Promise<any[]>;
    findOne(id: string): Promise<any>;
    getSupplyHistory(storeId: string, { startDate, endDate }: SupplyHistoryDto): Promise<any[]>;
    update(id: string, updateSupplyDto: UpdateSupplyDto): Promise<any>;
    remove(id: string): Promise<any>;
}
export {};
