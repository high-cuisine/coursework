export declare class DepartmentsService {
    private pool;
    constructor();
    findAll(): Promise<any>;
    findOne(id: number): Promise<any>;
    create(createDepartmentDto: any): Promise<any>;
    update(id: number, updateDepartmentDto: any): Promise<any>;
    remove(id: number): Promise<any>;
}
