import { ProductsService } from './products.service';
declare class CreateProductDto {
    productname: string;
    description: string;
    price: number;
    image_url: string;
    categoryid: number;
}
declare class UpdateProductDto {
    productname?: string;
    description?: string;
    price?: number;
    image_url?: string;
    categoryid?: number;
}
declare class UpdateStockDto {
    store_id: number;
    quantity: number;
}
export declare class ProductsController {
    private readonly productsService;
    private readonly logger;
    constructor(productsService: ProductsService);
    getProducts(): Promise<any[]>;
    getProductById(id: number): Promise<any>;
    createProduct(productData: CreateProductDto): Promise<any>;
    updateProduct(id: number, productData: UpdateProductDto): Promise<any>;
    updateProductStock(id: number, stockData: UpdateStockDto): Promise<any>;
    remove(id: number): Promise<any>;
}
export {};
