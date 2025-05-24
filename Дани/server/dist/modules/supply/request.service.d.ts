import { Pool } from 'pg';
export declare class RequestService {
    private readonly pool;
    constructor(pool: Pool);
    create(data: {
        storeId: number;
        productId: number;
        requestedQuantity: number;
        requestDate?: Date;
    }): Promise<any>;
    findAll(): Promise<any[]>;
    findOne(id: number): Promise<any>;
    update(id: number, data: {
        requestedQuantity?: number;
        requestDate?: Date;
    }): Promise<any>;
    remove(id: number): Promise<any>;
    getStoreRequests(storeId: number, status?: string): Promise<any[]>;
}
