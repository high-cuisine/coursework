import { Pool } from 'pg';
export declare class ProductsService {
    private readonly pool;
    constructor(pool: Pool);
    getProducts(): Promise<any[]>;
    getProductById(id: number): Promise<any>;
    createProduct(data: {
        productname: string;
        description: string;
        price: number;
        image_url: string;
        categoryid: number;
    }): Promise<any>;
    updateProduct(id: number, data: {
        productname?: string;
        description?: string;
        price?: number;
        image_url?: string;
        categoryid?: number;
    }): Promise<any>;
    updateProductStock(productId: number, storeId: number, quantity: number): Promise<any>;
    findAll(): Promise<any[]>;
    findOne(id: number): Promise<any>;
    update(id: number, data: {
        productName?: string;
        categoryId?: number;
        price?: number;
    }): Promise<any>;
    remove(id: number): Promise<any>;
}
