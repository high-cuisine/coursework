export interface Taxpayer {
    taxpayerid: number;
    type: string;
    fullname: string;
    taxid: string;
    registrationaddress: string;
    phone: string;
    email: string;
    registrationdate: Date;
    departmentid: number;
}
export declare class TaxpayerService {
    getAllTaxpayers(): Promise<Taxpayer[]>;
    getTaxpayerById(id: number): Promise<Taxpayer>;
    createTaxpayer(taxpayer: Omit<Taxpayer, 'taxpayerid'>): Promise<Taxpayer>;
    updateTaxpayer(id: number, taxpayer: Partial<Taxpayer>): Promise<Taxpayer>;
    deleteTaxpayer(id: number): Promise<void>;
    getTaxpayerViolations(id: number): Promise<any>;
    getTaxpayerFines(id: number): Promise<any>;
}
