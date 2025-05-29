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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductsService = void 0;
const common_1 = require("@nestjs/common");
const pg_1 = require("pg");
let ProductsService = class ProductsService {
    constructor(pool) {
        this.pool = pool;
    }
    async getProducts() {
        const query = `
      SELECT 
        p.*,
        c.categoryname,
        COALESCE(s.quantity, 0) as current_stock,
        s.store_id
      FROM product p
      LEFT JOIN category c ON p.categoryid = c.categoryid
      LEFT JOIN stock s ON p.productid = s.product_id
      ORDER BY p.productid;
    `;
        const result = await this.pool.query(query);
        return result.rows;
    }
    async getProductById(id) {
        const query = `
      SELECT p.*, c.categoryname
      FROM product p
      LEFT JOIN category c ON p.categoryid = c.categoryid
      WHERE p.productid = $1;
    `;
        const result = await this.pool.query(query, [id]);
        if (result.rows.length === 0) {
            throw new common_1.NotFoundException(`Product with ID ${id} not found`);
        }
        return result.rows[0];
    }
    async createProduct(data) {
        const query = `
      INSERT INTO product (productname, description, price, image_url, categoryid)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *;
    `;
        const result = await this.pool.query(query, [
            data.productname,
            data.description,
            data.price,
            data.image_url,
            data.categoryid,
        ]);
        return result.rows[0];
    }
    async updateProduct(id, data) {
        const query = `
      UPDATE product
      SET productname = COALESCE($1, productname),
          description = COALESCE($2, description),
          price = COALESCE($3, price),
          image_url = COALESCE($4, image_url),
          categoryid = COALESCE($5, categoryid)
      WHERE productid = $6
      RETURNING *;
    `;
        const result = await this.pool.query(query, [
            data.productname,
            data.description,
            data.price,
            data.image_url,
            data.categoryid,
            id,
        ]);
        if (result.rows.length === 0) {
            throw new common_1.NotFoundException(`Product with ID ${id} not found`);
        }
        return result.rows[0];
    }
    async updateProductStock(productId, storeId, quantity) {
        const checkResult = await this.pool.query('SELECT * FROM stock WHERE product_id = $1 AND store_id = $2', [productId, storeId]);
        if (checkResult.rows.length === 0) {
            const insertQuery = `
        INSERT INTO stock (product_id, store_id, quantity)
        VALUES ($1, $2, $3)
        RETURNING *;
      `;
            const result = await this.pool.query(insertQuery, [productId, storeId, quantity]);
            return result.rows[0];
        }
        else {
            const updateQuery = `
        UPDATE stock
        SET quantity = $3
        WHERE product_id = $1 AND store_id = $2
        RETURNING *;
      `;
            const result = await this.pool.query(updateQuery, [productId, storeId, quantity]);
            return result.rows[0];
        }
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
    __param(0, (0, common_1.Inject)('DATABASE_POOL')),
    __metadata("design:paramtypes", [pg_1.Pool])
], ProductsService);
//# sourceMappingURL=products.service.js.map