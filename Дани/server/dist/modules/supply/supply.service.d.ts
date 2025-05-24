import { Pool } from 'pg';
export declare class SupplyService {
    private readonly pool;
    constructor(pool: Pool);
    create(data: any): Promise<any>;
    findAll(): Promise<any[]>;
    findOne(id: number): Promise<any>;
    update(id: number, data: {
        quantity?: number;
        supplyDate?: Date;
    }): Promise<any>;
    remove(id: number): Promise<any>;
    getSupplyHistory(storeId: number, startDate: Date, endDate: Date): Promise<any[]>;
}
