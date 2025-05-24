import { Pool } from 'pg';
export declare class StoreService {
    private readonly pool;
    constructor(pool: Pool);
    create(data: {
        storeName: string;
        address: string;
    }): Promise<any>;
    findAll(): Promise<any[]>;
    findOne(id: number): Promise<any>;
    update(id: number, data: {
        storename?: string;
        location?: string;
    }): Promise<any>;
    remove(id: number): Promise<any>;
    getStoreInventory(id: number): Promise<any[]>;
    addCascadeDelete(): Promise<void>;
}
