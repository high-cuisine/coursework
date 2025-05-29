import { Injectable, NotFoundException } from '@nestjs/common';
import { Pool } from 'pg';

@Injectable()
export class PurchaseService {
    constructor(private readonly pool: Pool) {}

    async createPurchase(data: {
        user_id: number;
        store_id: number;
        product_id: number;
        quantity: number;
        total_amount: number;
    }) {
        // Начинаем транзакцию
        const client = await this.pool.connect();
        try {
            await client.query('BEGIN');

            // Проверяем наличие товара
            const stockQuery = `
                SELECT quantity 
                FROM stock 
                WHERE product_id = $1 AND store_id = $2
                FOR UPDATE;
            `;
            const stockResult = await client.query(stockQuery, [data.product_id, data.store_id]);
            
            if (stockResult.rows.length === 0 || stockResult.rows[0].quantity < data.quantity) {
                throw new Error('Недостаточно товара в наличии');
            }

            // Создаем заказ
            const purchaseQuery = `
                INSERT INTO purchase (
                    user_id, store_id, product_id, quantity, 
                    total_amount, status_id, created_at, updated_at
                )
                VALUES ($1, $2, $3, $4, $5, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
                RETURNING *;
            `;
            const purchaseResult = await client.query(purchaseQuery, [
                data.user_id,
                data.store_id,
                data.product_id,
                data.quantity,
                data.total_amount,
            ]);

            // Обновляем количество товара
            const updateStockQuery = `
                UPDATE stock
                SET quantity = quantity - $1
                WHERE product_id = $2 AND store_id = $3;
            `;
            await client.query(updateStockQuery, [data.quantity, data.product_id, data.store_id]);

            await client.query('COMMIT');
            return purchaseResult.rows[0];
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    }

    async getPurchases() {
        const query = `
            SELECT p.*, 
                   u.username as user_name,
                   s.storename as store_name,
                   pr.productname as product_name,
                   ps.status_name as status_name
            FROM purchase p
            JOIN users u ON p.user_id = u.user_id
            JOIN store s ON p.store_id = s.storeid
            JOIN product pr ON p.product_id = pr.productid
            JOIN purchase_status ps ON p.status_id = ps.status_id
            ORDER BY p.created_at DESC;
        `;
        const result = await this.pool.query(query);
        return result.rows;
    }

    async getPurchaseById(id: number) {
        const query = `
            SELECT p.*, 
                   u.username as user_name,
                   s.storename as store_name,
                   pr.productname as product_name,
                   ps.status_name as status_name
            FROM purchase p
            JOIN users u ON p.user_id = u.user_id
            JOIN store s ON p.store_id = s.storeid
            JOIN product pr ON p.product_id = pr.productid
            JOIN purchase_status ps ON p.status_id = ps.status_id
            WHERE p.purchase_id = $1;
        `;
        const result = await this.pool.query(query, [id]);
        
        if (result.rows.length === 0) {
            throw new NotFoundException(`Purchase with ID ${id} not found`);
        }
        
        return result.rows[0];
    }

    async updatePurchaseStatus(id: number, statusId: number) {
        const query = `
            UPDATE purchase
            SET status_id = $1, updated_at = CURRENT_TIMESTAMP
            WHERE purchase_id = $2
            RETURNING *;
        `;
        const result = await this.pool.query(query, [statusId, id]);
        
        if (result.rows.length === 0) {
            throw new NotFoundException(`Purchase with ID ${id} not found`);
        }
        
        return result.rows[0];
    }

    async archivePurchase(id: number) {
        // First, get the purchase data
        const purchase = await this.getPurchaseById(id);
        
        // Insert into archive
        const archiveQuery = `
            INSERT INTO purchase_archive (
                purchase_id, user_id, store_id, product_id,
                quantity, total_amount, status_id,
                created_at, archived_at
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, CURRENT_TIMESTAMP);
        `;
        
        await this.pool.query(archiveQuery, [
            purchase.purchase_id,
            purchase.user_id,
            purchase.store_id,
            purchase.product_id,
            purchase.quantity,
            purchase.total_amount,
            purchase.status_id,
            purchase.created_at,
        ]);
        
        // Delete from main table
        const deleteQuery = `
            DELETE FROM purchase
            WHERE purchase_id = $1;
        `;
        await this.pool.query(deleteQuery, [id]);
    }

    async getPurchaseStatuses() {
        // First, ensure we have default statuses
        const insertQuery = `
            INSERT INTO purchase_status (status_name)
            VALUES 
                ('Pending'),
                ('Approved'),
                ('Rejected'),
                ('Completed'),
                ('Cancelled')
            ON CONFLICT (status_name) DO NOTHING;
        `;
        await this.pool.query(insertQuery);

        // Then get all statuses
        const query = `
            SELECT status_id as id, status_name as name
            FROM purchase_status
            ORDER BY status_id;
        `;
        const result = await this.pool.query(query);
        return result.rows;
    }
} 