import { ProductsService } from './products.service';
declare class UpdateProductDto {
    productName?: string;
    categoryId?: number;
    price?: number;
}
export declare class ProductsController {
    private readonly productsService;
    constructor(productsService: ProductsService);
    create(date: any): Promise<any>;
    findAll(): Promise<any[]>;
    findOne(id: string): Promise<any>;
    update(id: string, updateProductDto: UpdateProductDto): Promise<any>;
    remove(id: string): Promise<any>;
}
export {};
