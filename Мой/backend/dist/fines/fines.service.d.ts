export declare class FinesService {
    private pool;
    constructor();
    findAll(): Promise<any>;
    findOne(id: number): Promise<any>;
    create(createFineDto: any): Promise<any>;
    update(id: number, updateFineDto: any): Promise<any>;
    remove(id: number): Promise<any>;
}
