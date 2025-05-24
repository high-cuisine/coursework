import { RequestService } from './request.service';
declare class CreateRequestDto {
    storeId: number;
    productId: number;
    requestedQuantity: number;
    requestDate?: Date;
}
declare class UpdateRequestDto {
    requestedQuantity?: number;
    requestDate?: Date;
}
export declare class RequestController {
    private readonly requestService;
    constructor(requestService: RequestService);
    create(createRequestDto: CreateRequestDto): Promise<any>;
    findAll(): Promise<any[]>;
    findOne(id: string): Promise<any>;
    getStoreRequests(storeId: string, status?: string): Promise<any[]>;
    update(id: string, updateRequestDto: UpdateRequestDto): Promise<any>;
    remove(id: string): Promise<any>;
}
export {};
