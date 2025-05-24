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
exports.TaxesService = void 0;
const common_1 = require("@nestjs/common");
const pg_1 = require("pg");
let TaxesService = class TaxesService {
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
        const result = await this.pool.query('SELECT * FROM Tax');
        return result.rows;
    }
    async findOne(id) {
        const result = await this.pool.query('SELECT * FROM Tax WHERE TaxID = $1', [id]);
        return result.rows[0];
    }
    async create(createTaxDto) {
        const { taxcode, taxname, rate, regulatorydocument, description, taxtype } = createTaxDto;
        const result = await this.pool.query('INSERT INTO Tax (TaxCode, TaxName, Rate, RegulatoryDocument, Description, TaxType) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *', [taxcode, taxname, rate, regulatorydocument, description, taxtype]);
        return result.rows[0];
    }
    async update(id, updateTaxDto) {
        const { taxcode, taxname, rate, regulatorydocument, description, taxtype } = updateTaxDto;
        const result = await this.pool.query('UPDATE Tax SET TaxCode = $1, TaxName = $2, Rate = $3, RegulatoryDocument = $4, Description = $5, TaxType = $6 WHERE TaxID = $7 RETURNING *', [taxcode, taxname, rate, regulatorydocument, description, taxtype, id]);
        return result.rows[0];
    }
    async remove(id) {
        const result = await this.pool.query('DELETE FROM Tax WHERE TaxID = $1 RETURNING *', [id]);
        return result.rows[0];
    }
};
exports.TaxesService = TaxesService;
exports.TaxesService = TaxesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], TaxesService);
//# sourceMappingURL=taxes.service.js.map