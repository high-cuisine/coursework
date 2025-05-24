import { CategoryService } from './category.service';
declare class UpdateCategoryDto {
    categoryName: string;
}
export declare class CategoryController {
    private readonly categoryService;
    constructor(categoryService: CategoryService);
    create(categoryName: string): Promise<any>;
    findAll(): Promise<any[]>;
    findOne(id: string): Promise<any>;
    getProductsByCategory(id: string): Promise<any[]>;
    update(id: string, updateCategoryDto: UpdateCategoryDto): Promise<any>;
    remove(id: string): Promise<any>;
}
export {};
