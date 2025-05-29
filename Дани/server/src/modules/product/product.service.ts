import { Injectable } from '@nestjs/common';
import { Pool } from 'pg';

@Injectable()
export class ProductService {
    constructor(private readonly pool: Pool) {}

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

    async getProductById(id: number) {
        const result = await this.pool.query(`
            SELECT p.*, c.categoryname, COALESCE(s.quantity, 0) as current_stock
            FROM "Product" p
            LEFT JOIN "Category" c ON p.categoryid = c.categoryid
            LEFT JOIN "Stock" s ON p.productid = s.product_id
            WHERE p.productid = $1
        `, [id]);
        return result.rows[0];
    }

    async createProduct(productData: any) {
        const { productname, description, price, image_url, categoryid } = productData;
        const result = await this.pool.query(`
            INSERT INTO "Product" (productname, description, price, image_url, categoryid)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *
        `, [productname, description, price, image_url, categoryid]);
        return result.rows[0];
    }

    async updateProduct(id: number, productData: any) {
        const { productname, description, price, image_url, categoryid } = productData;
        const result = await this.pool.query(`
            UPDATE "Product"
            SET productname = $1, description = $2, price = $3, image_url = $4, categoryid = $5
            WHERE productid = $6
            RETURNING *
        `, [productname, description, price, image_url, categoryid, id]);
        return result.rows[0];
    }

    async updateProductStock(productId: number, storeId: number, quantity: number) {
        // Проверяем существование записи
        const checkResult = await this.pool.query(
            'SELECT * FROM "Stock" WHERE product_id = $1 AND store_id = $2',
            [productId, storeId]
        );

        if (checkResult.rows.length === 0) {
            // Если записи нет, создаем новую
            const result = await this.pool.query(
                'INSERT INTO "Stock" (product_id, store_id, quantity) VALUES ($1, $2, $3) RETURNING *',
                [productId, storeId, quantity]
            );
            return result.rows[0];
        } else {
            // Если запись есть, обновляем количество
            const result = await this.pool.query(
                'UPDATE "Stock" SET quantity = $3 WHERE product_id = $1 AND store_id = $2 RETURNING *',
                [productId, storeId, quantity]
            );
            return result.rows[0];
        }
    }
} 