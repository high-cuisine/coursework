import { Injectable } from '@nestjs/common';
import { Pool } from 'pg';

@Injectable()
export class ReportsService {
    constructor(private readonly pool: Pool) {}

    async getTAllReports() {
        const query = `
            SELECT * FROM Report
            ORDER BY month DESC;
        `;
        const result = await this.pool.query(query);
        return result.rows;
    }

    async getReportById(id: number) {
        const query = `
            SELECT * FROM Report
            WHERE id = $1;
        `;
        const result = await this.pool.query(query, [id]);
        return result.rows[0];
    }

    async createReport(store_id: number, month: number, total_revenue: number) {
        const query = `
            INSERT INTO Report (store_id, month, total_revenue)
            VALUES ($1, $2, $3)
            RETURNING *;
        `;
        const result = await this.pool.query(query, [store_id, month, total_revenue]);
        return result.rows[0];
    }

    async deleteReport(id: number) {
        const query = `
            DELETE FROM Report
            WHERE id = $1
            RETURNING *;
        `;
        const result = await this.pool.query(query, [id]);
        return result.rows[0];
    }

    async updateReport(id: number, store_id: number, month: number, total_revenue: number) {
        const query = `
            UPDATE Report
            SET store_id = $1, month = $2, total_revenue = $3
            WHERE id = $4
            RETURNING *;
        `;
        const result = await this.pool.query(query, [store_id, month, total_revenue, id]);
        return result.rows[0];
    }

    async getInventoryReport() {
        const query = `
            SELECT 
                p.productid,
                p.productname,
                p.price,
                c.categoryname,
                COALESCE(s.quantity, 0) as current_stock
            FROM Product p
            LEFT JOIN Category c ON p.categoryid = c.categoryid
            LEFT JOIN Stock s ON p.productid = s.product_id
            ORDER BY p.productname
        `;
        
        try {
            const result = await this.pool.query(query);
            return result.rows;
        } catch (error) {
            console.error('Error getting inventory report:', error);
            throw error;
        }
    }

    async getSalesReport(startDate: string, endDate: string) {
        // Debug query to check all purchases
        const debugQuery = `
            SELECT 
                p.*,
                ps.status_name
            FROM Purchase p
            LEFT JOIN PurchaseStatus ps ON p.status_id = ps.status_id
            ORDER BY p.created_at DESC;
        `;
        const debugResult = await this.pool.query(debugQuery);
        console.log('Debug - All purchases:', debugResult.rows);

        // Convert dates to ISO format and add time
        const startDateTime = `${startDate}T00:00:00.000Z`;
        const endDateTime = `${endDate}T23:59:59.999Z`;

        const query = `
            SELECT 
                DATE(p.created_at) as date,
                COUNT(*) as total_sales,
                SUM(p.total_amount) as total_revenue,
                ps.status_name,
                COUNT(*) FILTER (WHERE p.status_id IN (2, 4)) as completed_sales,
                SUM(p.total_amount) FILTER (WHERE p.status_id IN (2, 4)) as completed_revenue
            FROM Purchase p
            LEFT JOIN PurchaseStatus ps ON p.status_id = ps.status_id
            WHERE p.created_at BETWEEN $1 AND $2
            GROUP BY DATE(p.created_at), ps.status_name
            ORDER BY date;
        `;
        const result = await this.pool.query(query, [startDateTime, endDateTime]);
        console.log('Debug - Sales report result:', result.rows);
        return result.rows;
    }

    async getProfitReport(startDate: string, endDate: string) {
        // Convert dates to ISO format and add time
        const startDateTime = `${startDate}T00:00:00.000Z`;
        const endDateTime = `${endDate}T23:59:59.999Z`;

        const query = `
            WITH sales AS (
                SELECT 
                    p.product_id,
                    SUM(p.quantity) as sold_quantity,
                    SUM(p.total_amount) as revenue
                FROM Purchase p
                WHERE p.created_at BETWEEN $1 AND $2
                AND p.status_id IN (2, 4) -- Approved or Completed
                GROUP BY p.product_id
            ),
            costs AS (
                SELECT 
                    s.product_id,
                    SUM(s.quantity * s.price) as total_cost
                FROM Supply s
                WHERE s.created_at BETWEEN $1 AND $2
                GROUP BY s.product_id
            )
            SELECT 
                p.productid,
                p.productname,
                COALESCE(s.sold_quantity, 0) as sold_quantity,
                COALESCE(s.revenue, 0) as revenue,
                COALESCE(c.total_cost, 0) as cost,
                COALESCE(s.revenue, 0) - COALESCE(c.total_cost, 0) as profit
            FROM Product p
            LEFT JOIN sales s ON p.productid = s.product_id
            LEFT JOIN costs c ON p.productid = c.product_id
            ORDER BY profit DESC;
        `;
        const result = await this.pool.query(query, [startDateTime, endDateTime]);
        return result.rows;
    }
}

