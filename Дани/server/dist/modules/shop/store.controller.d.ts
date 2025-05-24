import { StoreService } from './store.service';
export declare class StoreController {
    private readonly storeService;
    constructor(storeService: StoreService);
    create(data: {
        storeName: string;
        address: string;
    }): Promise<any>;
    findAll(): Promise<any[]>;
    findOne(id: string): Promise<any>;
    getStoreInventory(id: string): Promise<any[]>;
    update(id: string, data: any): Promise<any>;
    remove(id: string): Promise<any>;
    addCascadeDelete(): Promise<void>;
}
