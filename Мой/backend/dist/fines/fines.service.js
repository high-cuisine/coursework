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
exports.FinesService = void 0;
const common_1 = require("@nestjs/common");
const pg_1 = require("pg");
let FinesService = class FinesService {
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
        const result = await this.pool.query('SELECT * FROM Fine');
        return result.rows;
    }
    async findOne(id) {
        const result = await this.pool.query('SELECT * FROM Fine WHERE FineID = $1', [id]);
        return result.rows[0];
    }
    async create(createFineDto) {
        const { fineamount, chargedate, paymentdeadline, paymentstatus, paymentdate, violationid } = createFineDto;
        const result = await this.pool.query('INSERT INTO Fine (FineAmount, ChargeDate, PaymentDeadline, PaymentStatus, PaymentDate, ViolationID) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *', [fineamount, chargedate, paymentdeadline, paymentstatus, paymentdate, violationid]);
        return result.rows[0];
    }
    async update(id, updateFineDto) {
        const { fineamount, chargedate, paymentdeadline, paymentstatus, paymentdate, violationid } = updateFineDto;
        const result = await this.pool.query('UPDATE Fine SET FineAmount = $1, ChargeDate = $2, PaymentDeadline = $3, PaymentStatus = $4, PaymentDate = $5, ViolationID = $6 WHERE FineID = $7 RETURNING *', [fineamount, chargedate, paymentdeadline, paymentstatus, paymentdate, violationid, id]);
        return result.rows[0];
    }
    async remove(id) {
        const result = await this.pool.query('DELETE FROM Fine WHERE FineID = $1 RETURNING *', [id]);
        return result.rows[0];
    }
};
exports.FinesService = FinesService;
exports.FinesService = FinesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], FinesService);
//# sourceMappingURL=fines.service.js.map