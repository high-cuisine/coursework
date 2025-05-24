import { Pool } from 'pg';
export declare class CategoryService {
    private readonly pool;
    constructor(pool: Pool);
    create(data: {
        categoryName: any;
    }): Promise<any>;
    findAll(): Promise<any[]>;
    findOne(id: number): Promise<any>;
    update(id: number, data: {
        categoryName: string;
    }): Promise<any>;
    remove(id: number): Promise<any>;
    getProductsByCategory(id: number): Promise<any[]>;
}
