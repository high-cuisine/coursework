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
exports.RequestService = void 0;
const common_1 = require("@nestjs/common");
const pg_1 = require("pg");
let RequestService = class RequestService {
    constructor(pool) {
        this.pool = pool;
    }
    async create(data) {
        const query = `
      INSERT INTO Request (StoreID, ProductID, RequestedQuantity, RequestDate)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `;
        const result = await this.pool.query(query, [
            data.storeId,
            data.productId,
            data.requestedQuantity,
            data.requestDate || new Date(),
        ]);
        return result.rows[0];
    }
    async findAll() {
        const query = `
      SELECT r.*, st.StoreName, p.ProductName
      FROM Request r
      JOIN Store st ON r.StoreID = st.StoreID
      JOIN Product p ON r.ProductID = p.ProductID
      ORDER BY r.RequestDate DESC;
    `;
        const result = await this.pool.query(query);
        return result.rows;
    }
    async findOne(id) {
        const query = `
      SELECT r.*, st.StoreName, p.ProductName
      FROM Request r
      JOIN Store st ON r.StoreID = st.StoreID
      JOIN Product p ON r.ProductID = p.ProductID
      WHERE r.RequestID = $1;
    `;
        const result = await this.pool.query(query, [id]);
        if (result.rows.length === 0) {
            throw new common_1.NotFoundException(`Request with ID ${id} not found`);
        }
        return result.rows[0];
    }
    async update(id, data) {
        const currentRequest = await this.findOne(id);
        const query = `
      UPDATE Request
      SET 
        RequestedQuantity = $1,
        RequestDate = $2
      WHERE RequestID = $3
      RETURNING *;
    `;
        const result = await this.pool.query(query, [
            data.requestedQuantity || currentRequest.requestedquantity,
            data.requestDate || currentRequest.requestdate,
            id,
        ]);
        return result.rows[0];
    }
    async remove(id) {
        const query = `
      DELETE FROM Request
      WHERE RequestID = $1
      RETURNING *;
    `;
        const result = await this.pool.query(query, [id]);
        if (result.rows.length === 0) {
            throw new common_1.NotFoundException(`Request with ID ${id} not found`);
        }
        return result.rows[0];
    }
    async getStoreRequests(storeId, status) {
        let query = `
      SELECT r.*, p.ProductName, st.StoreName
      FROM Request r
      JOIN Product p ON r.ProductID = p.ProductID
      JOIN Store st ON r.StoreID = st.StoreID
      WHERE r.StoreID = $1
    `;
        const params = [storeId];
        if (status) {
            query += ` AND r.Status = $2`;
            params.push(Number(status));
        }
        query += ` ORDER BY r.RequestDate DESC`;
        const result = await this.pool.query(query, params);
        return result.rows;
    }
};
exports.RequestService = RequestService;
exports.RequestService = RequestService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [pg_1.Pool])
], RequestService);
//# sourceMappingURL=request.service.js.map