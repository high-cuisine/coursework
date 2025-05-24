export interface Inspector {
    inspectorid: number;
    lastname: string;
    firstname: string;
    middlename: string;
    position: string;
    hiredate: Date;
    accesslevel: string;
    departmentid: number;
}
export declare class InspectorService {
    getAllInspectors(): Promise<Inspector[]>;
    getInspectorById(id: number): Promise<Inspector>;
    createInspector(inspector: Omit<Inspector, 'inspectorid'>): Promise<Inspector>;
    updateInspector(id: number, inspector: Partial<Inspector>): Promise<Inspector>;
    deleteInspector(id: number): Promise<void>;
    getInspectorViolations(id: number): Promise<any>;
    getInspectorDepartment(id: number): Promise<any>;
}
