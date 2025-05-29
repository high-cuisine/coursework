import { Pool } from 'pg';
export declare class ProductService {
    private readonly pool;
    constructor(pool: Pool);
    getProducts(): Promise<any[]>;
    getProductById(id: number): Promise<any>;
    createProduct(productData: any): Promise<any>;
    updateProduct(id: number, productData: any): Promise<any>;
    updateProductStock(productId: number, storeId: number, quantity: number): Promise<any>;
}
