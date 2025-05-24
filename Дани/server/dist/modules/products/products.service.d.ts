import { Pool } from 'pg';
export declare class ProductsService {
    private readonly pool;
    constructor(pool: Pool);
    create(data: {
        productname: string;
        categoryid: number;
        price: number;
        description: string;
    }): Promise<any>;
    findAll(): Promise<any[]>;
    findOne(id: number): Promise<any>;
    update(id: number, data: {
        productName?: string;
        categoryId?: number;
        price?: number;
    }): Promise<any>;
    remove(id: number): Promise<any>;
}
