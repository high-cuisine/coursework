import { ProductService } from './product.service';
export declare class ProductController {
    private readonly productService;
    constructor(productService: ProductService);
    getProducts(): Promise<any[]>;
    getProductById(id: number): Promise<any>;
    createProduct(productData: any): Promise<any>;
    updateProduct(id: number, productData: any): Promise<any>;
    updateProductStock(id: number, stockData: {
        store_id: number;
        quantity: number;
    }): Promise<any>;
}
