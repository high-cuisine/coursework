import { Pool } from 'pg';
export declare class ReportsService {
    private readonly pool;
    constructor(pool: Pool);
    getTAllReports(): Promise<any[]>;
    getReportById(id: number): Promise<any>;
    createReport(store_id: number, month: number, total_revenue: number): Promise<any>;
    deleteReport(id: number): Promise<any>;
    updateReport(id: number, store_id: number, month: number, total_revenue: number): Promise<any>;
    getInventoryReport(): Promise<any[]>;
    getSalesReport(startDate: string, endDate: string): Promise<any[]>;
    getProfitReport(startDate: string, endDate: string): Promise<any[]>;
}
