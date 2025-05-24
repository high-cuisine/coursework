"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportsService = void 0;
const common_1 = require("@nestjs/common");
const db_1 = require("../../core/db");
let ReportsService = class ReportsService {
    async getTAllReports() {
        const query = `
            SELECT * FROM Report;
        `;
        const { rows } = await db_1.pool.query(query);
        return rows;
    }
    async getReportById(id) {
        const query = `
            SELECT * FROM Report WHERE id =${id};
        `;
        const { rows } = await db_1.pool.query(query);
        return rows;
    }
    async createReport(store_id, month, total_revenue) {
        const query = `
            INSERT INTO shop (name, category, selling_price)
            VALUES ($1, $2, $3)
            RETURNING *;
        `;
        const { rows } = await db_1.pool.query(query, [store_id, month, total_revenue]);
        return rows;
    }
    async deleteReport(id) {
        const query = `
            DELETE FROM Report WHERE id =$1;
        `;
        const { rows } = await db_1.pool.query(query, [id]);
        return rows;
    }
    async updateReport(id, store_id, month, total_revenue) {
        const query = `
            UPDATE Report SET store_id =$1, month =$2, total_revenue =$3 WHERE id =$4;
        `;
        const { rows } = await db_1.pool.query(query, [store_id, month, total_revenue, id]);
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
        const { rows } = await db_1.pool.query(query);
        return {
            inventory: rows
        };
    }
};
exports.ReportsService = ReportsService;
exports.ReportsService = ReportsService = __decorate([
    (0, common_1.Injectable)()
], ReportsService);
//# sourceMappingURL=reports.service.js.map