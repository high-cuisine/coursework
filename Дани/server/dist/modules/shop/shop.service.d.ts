export declare class ShopService {
    getAll(): Promise<any[]>;
    getById(id: number): Promise<any[]>;
    createShop(name: string, address: string, phone: string, email: string): Promise<any>;
}
