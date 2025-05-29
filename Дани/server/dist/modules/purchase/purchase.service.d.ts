import { Pool } from 'pg';
export declare class PurchaseService {
    private readonly pool;
    constructor(pool: Pool);
    createPurchase(data: {
        user_id: number;
        store_id: number;
        product_id: number;
        quantity: number;
        total_amount: number;
    }): Promise<any>;
    getPurchases(): Promise<any[]>;
    getPurchaseById(id: number): Promise<any>;
    updatePurchaseStatus(id: number, statusId: number): Promise<any>;
    archivePurchase(id: number): Promise<void>;
    getPurchaseStatuses(): Promise<any[]>;
}
