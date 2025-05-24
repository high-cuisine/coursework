import { PropertiesService } from './properties.service';
export declare class PropertiesController {
    private readonly propertiesService;
    constructor(propertiesService: PropertiesService);
    findAll(): Promise<any>;
    findOne(id: string): Promise<any>;
    create(createPropertyDto: any): Promise<any>;
    update(id: string, updatePropertyDto: any): Promise<any>;
    remove(id: string): Promise<any>;
}
