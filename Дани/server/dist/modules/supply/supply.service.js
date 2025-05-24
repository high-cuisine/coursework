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
exports.SupplyService = void 0;
const common_1 = require("@nestjs/common");
const pg_1 = require("pg");
let SupplyService = class SupplyService {
    constructor(pool) {
        this.pool = pool;
    }
    async create(data) {
        console.log(data, 'test');
        const query = `
      INSERT INTO Supply (StoreID, ProductID, Quantity, SupplyDate)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `;
        const result = await this.pool.query(query, [
            data.storeId,
            data.productId,
            data.quantity,
            data.supplyDate || new Date(),
        ]);
        return result.rows[0];
    }
    async findAll() {
        const query = `
      SELECT s.*, st.StoreName, p.ProductName
      FROM Supply s
      JOIN Store st ON s.StoreID = st.StoreID
      JOIN Product p ON s.ProductID = p.ProductID
      ORDER BY s.SupplyDate DESC;
    `;
        const result = await this.pool.query(query);
        return result.rows;
    }
    async findOne(id) {
        const query = `
      SELECT s.*, st.StoreName, p.ProductName
      FROM Supply s
      JOIN Store st ON s.StoreID = st.StoreID
      JOIN Product p ON s.ProductID = p.ProductID
      WHERE s.SupplyID = $1;
    `;
        const result = await this.pool.query(query, [id]);
        if (result.rows.length === 0) {
            throw new common_1.NotFoundException(`Supply with ID ${id} not found`);
        }
        return result.rows[0];
    }
    async update(id, data) {
        const currentSupply = await this.findOne(id);
        const query = `
      UPDATE Supply
      SET 
        Quantity = $1,
        SupplyDate = $2
      WHERE SupplyID = $3
      RETURNING *;
    `;
        const result = await this.pool.query(query, [
            data.quantity || currentSupply.quantity,
            data.supplyDate || currentSupply.supplydate,
            id,
        ]);
        return result.rows[0];
    }
    async remove(id) {
        const query = `
      DELETE FROM Supply
      WHERE SupplyID = $1
      RETURNING *;
    `;
        const result = await this.pool.query(query, [id]);
        if (result.rows.length === 0) {
            throw new common_1.NotFoundException(`Supply with ID ${id} not found`);
        }
        return result.rows[0];
    }
    async getSupplyHistory(storeId, startDate, endDate) {
        const query = `
      SELECT s.*, p.ProductName, st.StoreName
      FROM Supply s
      JOIN Product p ON s.ProductID = p.ProductID
      JOIN Store st ON s.StoreID = st.StoreID
      WHERE s.StoreID = $1
        AND s.SupplyDate BETWEEN $2 AND $3
      ORDER BY s.SupplyDate DESC;
    `;
        const result = await this.pool.query(query, [storeId, startDate, endDate]);
        return result.rows;
    }
};
exports.SupplyService = SupplyService;
exports.SupplyService = SupplyService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [pg_1.Pool])
], SupplyService);
//# sourceMappingURL=supply.service.js.map