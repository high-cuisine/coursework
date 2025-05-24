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
exports.StoreService = void 0;
const common_1 = require("@nestjs/common");
const pg_1 = require("pg");
let StoreService = class StoreService {
    constructor(pool) {
        this.pool = pool;
    }
    async create(data) {
        console.log(data, 'test');
        const query = `
      INSERT INTO Store (StoreName, Location)
      VALUES ($1, $2)
      RETURNING *;
    `;
        const result = await this.pool.query(query, [data.storeName, data.address]);
        return result.rows[0];
    }
    async findAll() {
        const query = `
      SELECT *
      FROM Store
      ORDER BY StoreID;
    `;
        const result = await this.pool.query(query);
        return result.rows;
    }
    async findOne(id) {
        const query = `
      SELECT *
      FROM Store
      WHERE StoreID = $1;
    `;
        const result = await this.pool.query(query, [id]);
        if (result.rows.length === 0) {
            throw new common_1.NotFoundException(`Store with ID ${id} not found`);
        }
        return result.rows[0];
    }
    async update(id, data) {
        const currentStore = await this.findOne(id);
        console.log(currentStore, id, data);
        const query = `
      UPDATE Store
      SET 
        StoreName = $1,
        Location = $2
      WHERE StoreID = $3
      RETURNING *;
    `;
        const result = await this.pool.query(query, [
            data.storename,
            data.location || currentStore.location,
            id,
        ]);
        return result.rows[0];
    }
    async remove(id) {
        const query = `
      DELETE FROM Store
      WHERE StoreID = $1
      RETURNING *;
    `;
        const result = await this.pool.query(query, [id]);
        if (result.rows.length === 0) {
            throw new common_1.NotFoundException(`Store with ID ${id} not found`);
        }
        return result.rows[0];
    }
    async getStoreInventory(id) {
        const query = `
      SELECT p.ProductID, p.ProductName, p.Price, c.CategoryName,
             COALESCE(
               (SELECT SUM(s.Quantity) 
                FROM Supply s 
                WHERE s.StoreID = $1 AND s.ProductID = p.ProductID), 0
             ) - 
             COALESCE(
               (SELECT SUM(sl.Quantity) 
                FROM Sale sl 
                WHERE sl.StoreID = $1 AND sl.ProductID = p.ProductID), 0
             ) as CurrentStock
      FROM Product p
      JOIN Category c ON p.CategoryID = c.CategoryID
      ORDER BY c.CategoryName, p.ProductName;
    `;
        const result = await this.pool.query(query, [id]);
        return result.rows;
    }
    async addCascadeDelete() {
        const queries = [
            'ALTER TABLE Supply DROP CONSTRAINT IF EXISTS supply_storeid_fkey',
            'ALTER TABLE Sale DROP CONSTRAINT IF EXISTS sale_storeid_fkey',
            'ALTER TABLE Request DROP CONSTRAINT IF EXISTS request_storeid_fkey',
            'ALTER TABLE Report DROP CONSTRAINT IF EXISTS report_store_id_fkey',
            'ALTER TABLE Supply ADD CONSTRAINT supply_storeid_fkey FOREIGN KEY (StoreID) REFERENCES Store(StoreID) ON DELETE CASCADE',
            'ALTER TABLE Sale ADD CONSTRAINT sale_storeid_fkey FOREIGN KEY (StoreID) REFERENCES Store(StoreID) ON DELETE CASCADE',
            'ALTER TABLE Request ADD CONSTRAINT request_storeid_fkey FOREIGN KEY (StoreID) REFERENCES Store(StoreID) ON DELETE CASCADE',
            'ALTER TABLE Report ADD CONSTRAINT report_store_id_fkey FOREIGN KEY (store_id) REFERENCES Store(StoreID) ON DELETE CASCADE'
        ];
        for (const query of queries) {
            await this.pool.query(query);
        }
    }
};
exports.StoreService = StoreService;
exports.StoreService = StoreService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [pg_1.Pool])
], StoreService);
//# sourceMappingURL=store.service.js.map