"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DepartmentsService = void 0;
const common_1 = require("@nestjs/common");
const pg_1 = require("pg");
let DepartmentsService = class DepartmentsService {
    constructor() {
        this.pool = new pg_1.Pool({
            user: 'postgres',
            host: 'localhost',
            database: 'tax_system',
            password: 'postgres',
            port: 5432,
        });
    }
    async findAll() {
        const result = await this.pool.query('SELECT * FROM Department');
        return result.rows;
    }
    async findOne(id) {
        const result = await this.pool.query('SELECT * FROM Department WHERE DepartmentID = $1', [id]);
        return result.rows[0];
    }
    async create(createDepartmentDto) {
        const { name, address, phone, headinspectorid } = createDepartmentDto;
        const result = await this.pool.query('INSERT INTO Department (Name, Address, Phone, HeadInspectorID) VALUES ($1, $2, $3, $4) RETURNING *', [name, address, phone, headinspectorid]);
        return result.rows[0];
    }
    async update(id, updateDepartmentDto) {
        const { name, address, phone, headinspectorid } = updateDepartmentDto;
        const result = await this.pool.query('UPDATE Department SET Name = $1, Address = $2, Phone = $3, HeadInspectorID = $4 WHERE DepartmentID = $5 RETURNING *', [name, address, phone, headinspectorid, id]);
        return result.rows[0];
    }
    async remove(id) {
        const result = await this.pool.query('DELETE FROM Department WHERE DepartmentID = $1 RETURNING *', [id]);
        return result.rows[0];
    }
};
exports.DepartmentsService = DepartmentsService;
exports.DepartmentsService = DepartmentsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], DepartmentsService);
//# sourceMappingURL=departments.service.js.map