import { DepartmentsService } from './departments.service';
export declare class DepartmentsController {
    private readonly departmentsService;
    constructor(departmentsService: DepartmentsService);
    findAll(): Promise<any>;
    findOne(id: string): Promise<any>;
    create(createDepartmentDto: any): Promise<any>;
    update(id: string, updateDepartmentDto: any): Promise<any>;
    remove(id: string): Promise<any>;
}
