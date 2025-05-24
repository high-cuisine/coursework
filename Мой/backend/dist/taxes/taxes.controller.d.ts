import { TaxesService } from './taxes.service';
export declare class TaxesController {
    private readonly taxesService;
    constructor(taxesService: TaxesService);
    findAll(): Promise<any>;
    findOne(id: string): Promise<any>;
    create(createTaxDto: any): Promise<any>;
    update(id: string, updateTaxDto: any): Promise<any>;
    remove(id: string): Promise<any>;
}
