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
exports.PropertiesService = void 0;
const common_1 = require("@nestjs/common");
const pg_1 = require("pg");
let PropertiesService = class PropertiesService {
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
        const result = await this.pool.query('SELECT * FROM Property');
        return result.rows;
    }
    async findOne(id) {
        const result = await this.pool.query('SELECT * FROM Property WHERE PropertyID = $1', [id]);
        return result.rows[0];
    }
    async create(createPropertyDto) {
        const { propertytype, taxpayerid } = createPropertyDto;
        const result = await this.pool.query('INSERT INTO Property (PropertyType, TaxpayerID) VALUES ($1, $2) RETURNING *', [propertytype, taxpayerid]);
        return result.rows[0];
    }
    async update(id, updatePropertyDto) {
        const { propertytype, taxpayerid } = updatePropertyDto;
        const result = await this.pool.query('UPDATE Property SET PropertyType = $1, TaxpayerID = $2 WHERE PropertyID = $3 RETURNING *', [propertytype, taxpayerid, id]);
        return result.rows[0];
    }
    async remove(id) {
        const result = await this.pool.query('DELETE FROM Property WHERE PropertyID = $1 RETURNING *', [id]);
        return result.rows[0];
    }
};
exports.PropertiesService = PropertiesService;
exports.PropertiesService = PropertiesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], PropertiesService);
//# sourceMappingURL=properties.service.js.map