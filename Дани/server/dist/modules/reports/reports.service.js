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
};
exports.ReportsService = ReportsService;
exports.ReportsService = ReportsService = __decorate([
    (0, common_1.Injectable)()
], ReportsService);
//# sourceMappingURL=reports.service.js.map