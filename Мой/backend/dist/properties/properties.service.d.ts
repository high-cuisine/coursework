export declare class PropertiesService {
    private pool;
    constructor();
    findAll(): Promise<any>;
    findOne(id: number): Promise<any>;
    create(createPropertyDto: any): Promise<any>;
    update(id: number, updatePropertyDto: any): Promise<any>;
    remove(id: number): Promise<any>;
}
