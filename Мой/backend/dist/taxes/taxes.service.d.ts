export declare class TaxesService {
    private pool;
    constructor();
    findAll(): Promise<any>;
    findOne(id: number): Promise<any>;
    create(createTaxDto: any): Promise<any>;
    update(id: number, updateTaxDto: any): Promise<any>;
    remove(id: number): Promise<any>;
}
