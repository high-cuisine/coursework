import { PurchaseService } from './purchase.service';
export declare class PurchaseController {
    private readonly purchaseService;
    constructor(purchaseService: PurchaseService);
    createPurchase(purchaseData: {
        user_id: number;
        store_id: number;
        product_id: number;
        quantity: number;
        total_amount: number;
    }): Promise<any>;
    getPurchaseStatuses(): Promise<any[]>;
    getPurchases(): Promise<any[]>;
    getPurchaseById(id: number): Promise<any>;
    updatePurchaseStatus(id: number, statusId: number): Promise<any>;
    archivePurchase(id: number): Promise<void>;
}
