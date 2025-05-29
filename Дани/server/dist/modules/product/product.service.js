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
exports.ProductService = void 0;
const common_1 = require("@nestjs/common");
const pg_1 = require("pg");
let ProductService = class ProductService {
    constructor(pool) {
        this.pool = pool;
    }
    async getProducts() {
        const result = await this.pool.query(`
            SELECT p.*, c.categoryname, COALESCE(s.quantity, 0) as current_stock
            FROM "Product" p
            LEFT JOIN "Category" c ON p.categoryid = c.categoryid
            LEFT JOIN "Stock" s ON p.productid = s.product_id
            ORDER BY p.productname
        `);
        return result.rows;
    }
    async getProductById(id) {
        const result = await this.pool.query(`
            SELECT p.*, c.categoryname, COALESCE(s.quantity, 0) as current_stock
            FROM "Product" p
            LEFT JOIN "Category" c ON p.categoryid = c.categoryid
            LEFT JOIN "Stock" s ON p.productid = s.product_id
            WHERE p.productid = $1
        `, [id]);
        return result.rows[0];
    }
    async createProduct(productData) {
        const { productname, description, price, image_url, categoryid } = productData;
        const result = await this.pool.query(`
            INSERT INTO "Product" (productname, description, price, image_url, categoryid)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *
        `, [productname, description, price, image_url, categoryid]);
        return result.rows[0];
    }
    async updateProduct(id, productData) {
        const { productname, description, price, image_url, categoryid } = productData;
        const result = await this.pool.query(`
            UPDATE "Product"
            SET productname = $1, description = $2, price = $3, image_url = $4, categoryid = $5
            WHERE productid = $6
            RETURNING *
        `, [productname, description, price, image_url, categoryid, id]);
        return result.rows[0];
    }
    async updateProductStock(productId, storeId, quantity) {
        const checkResult = await this.pool.query('SELECT * FROM "Stock" WHERE product_id = $1 AND store_id = $2', [productId, storeId]);
        if (checkResult.rows.length === 0) {
            const result = await this.pool.query('INSERT INTO "Stock" (product_id, store_id, quantity) VALUES ($1, $2, $3) RETURNING *', [productId, storeId, quantity]);
            return result.rows[0];
        }
        else {
            const result = await this.pool.query('UPDATE "Stock" SET quantity = $3 WHERE product_id = $1 AND store_id = $2 RETURNING *', [productId, storeId, quantity]);
            return result.rows[0];
        }
    }
};
exports.ProductService = ProductService;
exports.ProductService = ProductService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [pg_1.Pool])
], ProductService);
//# sourceMappingURL=product.service.js.map