import { FinesService } from './fines.service';
export declare class FinesController {
    private readonly finesService;
    constructor(finesService: FinesService);
    findAll(): Promise<any>;
    findOne(id: string): Promise<any>;
    create(createFineDto: any): Promise<any>;
    update(id: string, updateFineDto: any): Promise<any>;
    remove(id: string): Promise<any>;
}
