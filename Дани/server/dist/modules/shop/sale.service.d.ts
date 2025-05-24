import { Pool } from 'pg';
export declare class SaleService {
    private readonly pool;
    constructor(pool: Pool);
    create(data: {
        storeId: number;
        productId: number;
        quantity: number;
        saleDate?: Date;
    }): Promise<any>;
    findAll(): Promise<any[]>;
    findOne(id: number): Promise<any>;
    update(id: number, data: {
        quantity?: number;
        saleDate?: Date;
    }): Promise<any>;
    remove(id: number): Promise<any>;
    getSaleHistory(storeId: number, startDate: Date, endDate: Date): Promise<any[]>;
}
