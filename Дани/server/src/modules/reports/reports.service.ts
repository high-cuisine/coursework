import { Injectable, Req, Res } from '@nestjs/common';
import { pool } from 'src/core/db';

@Injectable()
export class ReportsService {
    async getTAllReports() {
        const query = `
            SELECT * FROM Report;
        `;
        const { rows } = await pool.query(query);
        return rows;
    }

    async getReportById(id:number) {
        const query = `
            SELECT * FROM Report WHERE id =${id};
        `;
        const { rows } = await pool.query(query);
        return rows;
    }

    async createReport(store_id:number, month:number, total_revenue:any,) {
        const query = `
            INSERT INTO shop (name, category, selling_price)
            VALUES ($1, $2, $3)
            RETURNING *;
        `;

        const { rows } = await pool.query(query, [store_id, month, total_revenue]);
        return rows;
    }

    async deleteReport(id:number) {
        const query = `
            DELETE FROM Report WHERE id =$1;
        `;

        const { rows } = await pool.query(query, [id]);
        return rows;
    }

    async updateReport(id:number, store_id:number, month:number, total_revenue:any) {
        const query = `
            UPDATE Report SET store_id =$1, month =$2, total_revenue =$3 WHERE id =$4;
        `;

        const { rows } = await pool.query(query, [store_id, month, total_revenue, id]);
        return rows;
    }

    async getInventoryReport() {
        const query = `
            WITH SupplyTotals AS (
                SELECT 
                    s.StoreID,
                    s.ProductID,
                    SUM(s.Quantity) as TotalSupplied
                FROM Supply s
                GROUP BY s.StoreID, s.ProductID
            ),
            SaleTotals AS (
                SELECT 
                    s.StoreID,
                    s.ProductID,
                    SUM(s.Quantity) as TotalSold
                FROM Sale s
                GROUP BY s.StoreID, s.ProductID
            )
            SELECT 
                p.ProductName as productName,
                st.StoreName as storeName,
                COALESCE(sup.TotalSupplied, 0) - COALESCE(sal.TotalSold, 0) as quantity
            FROM Product p
            CROSS JOIN Store st
            LEFT JOIN SupplyTotals sup ON sup.ProductID = p.ProductID AND sup.StoreID = st.StoreID
            LEFT JOIN SaleTotals sal ON sal.ProductID = p.ProductID AND sal.StoreID = st.StoreID
            WHERE COALESCE(sup.TotalSupplied, 0) - COALESCE(sal.TotalSold, 0) > 0
            ORDER BY st.StoreName, p.ProductName;
        `;
        
        const { rows } = await pool.query(query);
        return {
            inventory: rows
        };
    }
}

