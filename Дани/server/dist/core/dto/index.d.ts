export declare class RegisterDto {
    username: string;
    email: string;
    password: string;
    role?: string;
}
export declare class LoginDto {
    username: string;
    password: string;
}
export declare class CreateProductDto {
    productName: string;
    categoryId: number;
    price: number;
}
export declare class UpdateProductDto {
    productName?: string;
    categoryId?: number;
    price?: number;
}
export declare class CreateCategoryDto {
    categoryName: string;
}
export declare class UpdateCategoryDto {
    categoryName: string;
}
export declare class CreateStoreDto {
    storeName: string;
    location: string;
}
export declare class UpdateStoreDto {
    storeName?: string;
    location?: string;
}
export declare class CreateSupplyDto {
    storeId: number;
    productId: number;
    quantity: number;
    supplyDate?: Date;
}
export declare class UpdateSupplyDto {
    quantity?: number;
    supplyDate?: Date;
}
export declare class CreateSaleDto {
    storeId: number;
    productId: number;
    quantity: number;
    saleDate?: Date;
}
export declare class UpdateSaleDto {
    quantity?: number;
    saleDate?: Date;
}
export declare class CreateRequestDto {
    storeId: number;
    productId: number;
    requestedQuantity: number;
    requestDate?: Date;
}
export declare class UpdateRequestDto {
    requestedQuantity?: number;
    requestDate?: Date;
    status?: 'pending' | 'approved' | 'rejected';
}
export declare class DateRangeDto {
    startDate: Date;
    endDate: Date;
}
export declare class PaginationDto {
    page?: number;
    limit?: number;
}
