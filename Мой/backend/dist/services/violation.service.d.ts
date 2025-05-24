export interface Violation {
    violationid: number;
    violationdate: Date;
    violationperiod: string;
    nonpaymentamount: number;
    violationdescription: string;
    status: string;
    paymentoverdue: boolean;
    taxpayerid: number;
    taxid: number;
    inspectorid: number;
}
export interface Fine {
    fineid: number;
    fineamount: number;
    chargedate: Date;
    paymentdeadline: Date;
    paymentstatus: string;
    paymentdate: Date;
    violationid: number;
}
export declare class ViolationService {
    getAllViolations(): Promise<Violation[]>;
    getViolationById(id: number): Promise<Violation>;
    createViolation(violation: Omit<Violation, 'violationid'>): Promise<Violation>;
    updateViolation(id: number, violation: Partial<Violation>): Promise<Violation>;
    createFine(fine: Omit<Fine, 'fineid'>): Promise<Fine>;
    updateFine(id: number, fine: Partial<Fine>): Promise<Fine>;
    getViolationFines(violationId: number): Promise<Fine[]>;
    getOverdueViolations(): Promise<Violation[]>;
    getViolationsByStatus(status: string): Promise<Violation[]>;
}
