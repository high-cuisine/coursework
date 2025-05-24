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
exports.CategoryService = void 0;
const common_1 = require("@nestjs/common");
const pg_1 = require("pg");
let CategoryService = class CategoryService {
    constructor(pool) {
        this.pool = pool;
    }
    async create(data) {
        console.log(data);
        const query = `
      INSERT INTO Category (CategoryName)
      VALUES ($1)
      RETURNING *;
    `;
        const result = await this.pool.query(query, [data.categoryName.categoryName]);
        return result.rows[0];
    }
    async findAll() {
        const query = `
      SELECT c.*,
             COUNT(p.ProductID) as ProductCount
      FROM Category c
      LEFT JOIN Product p ON c.CategoryID = p.CategoryID
      GROUP BY c.CategoryID
      ORDER BY c.CategoryName;
    `;
        const result = await this.pool.query(query);
        return result.rows;
    }
    async findOne(id) {
        const query = `
      SELECT c.*,
             COUNT(p.ProductID) as ProductCount
      FROM Category c
      LEFT JOIN Product p ON c.CategoryID = p.CategoryID
      WHERE c.CategoryID = $1
      GROUP BY c.CategoryID;
    `;
        const result = await this.pool.query(query, [id]);
        if (result.rows.length === 0) {
            throw new common_1.NotFoundException(`Category with ID ${id} not found`);
        }
        return result.rows[0];
    }
    async update(id, data) {
        console.log(data, id);
        const query = `
      UPDATE Category
      SET CategoryName = $1
      WHERE CategoryID = $2
      RETURNING *;
    `;
        const result = await this.pool.query(query, [data.categoryName, id]);
        if (result.rows.length === 0) {
            throw new common_1.NotFoundException(`Category with ID ${id} not found`);
        }
        return result.rows[0];
    }
    async remove(id) {
        const checkQuery = `
      SELECT COUNT(*) as count
      FROM Product
      WHERE CategoryID = $1;
    `;
        const checkResult = await this.pool.query(checkQuery, [id]);
        if (checkResult.rows[0].count > 0) {
            throw new Error('Cannot delete category that has products');
        }
        const query = `
      DELETE FROM Category
      WHERE CategoryID = $1
      RETURNING *;
    `;
        const result = await this.pool.query(query, [id]);
        if (result.rows.length === 0) {
            throw new common_1.NotFoundException(`Category with ID ${id} not found`);
        }
        return result.rows[0];
    }
    async getProductsByCategory(id) {
        const query = `
      SELECT p.*
      FROM Product p
      WHERE p.CategoryID = $1
      ORDER BY p.ProductName;
    `;
        const result = await this.pool.query(query, [id]);
        return result.rows;
    }
};
exports.CategoryService = CategoryService;
exports.CategoryService = CategoryService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [pg_1.Pool])
], CategoryService);
//# sourceMappingURL=category.service.js.map