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
exports.ProductsService = void 0;
const common_1 = require("@nestjs/common");
const pg_1 = require("pg");
let ProductsService = class ProductsService {
    constructor(pool) {
        this.pool = pool;
    }
    async create(data) {
        console.log(data, 'test');
        const query = `
      INSERT INTO Product (ProductName, CategoryID, Price)
      VALUES ($1, $2, $3)
      RETURNING *;
    `;
        const result = await this.pool.query(query, [
            data.productname,
            data.categoryid,
            data.price,
        ]);
        return result.rows[0];
    }
    async findAll() {
        const query = `
      SELECT p.*, c.CategoryName
      FROM Product p
      JOIN Category c ON p.CategoryID = c.CategoryID;
    `;
        const result = await this.pool.query(query);
        return result.rows;
    }
    async findOne(id) {
        const query = `
      SELECT p.*, c.CategoryName
      FROM Product p
      JOIN Category c ON p.CategoryID = c.CategoryID
      WHERE p.ProductID = $1;
    `;
        const result = await this.pool.query(query, [id]);
        if (result.rows.length === 0) {
            throw new common_1.NotFoundException(`Product with ID ${id} not found`);
        }
        return result.rows[0];
    }
    async update(id, data) {
        const currentProduct = await this.findOne(id);
        const query = `
      UPDATE Product
      SET 
        ProductName = $1,
        CategoryID = $2,
        Price = $3
      WHERE ProductID = $4
      RETURNING *;
    `;
        const result = await this.pool.query(query, [
            data.productName || currentProduct.productname,
            data.categoryId || currentProduct.categoryid,
            data.price || currentProduct.price,
            id,
        ]);
        return result.rows[0];
    }
    async remove(id) {
        const query = `
      DELETE FROM Product
      WHERE ProductID = $1
      RETURNING *;
    `;
        const result = await this.pool.query(query, [id]);
        if (result.rows.length === 0) {
            throw new common_1.NotFoundException(`Product with ID ${id} not found`);
        }
        return result.rows[0];
    }
};
exports.ProductsService = ProductsService;
exports.ProductsService = ProductsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [pg_1.Pool])
], ProductsService);
//# sourceMappingURL=products.service.js.map