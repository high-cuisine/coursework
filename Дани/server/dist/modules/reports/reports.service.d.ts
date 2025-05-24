export declare class ReportsService {
    getTAllReports(): Promise<any[]>;
    getReportById(id: number): Promise<any[]>;
    createReport(store_id: number, month: number, total_revenue: any): Promise<any[]>;
    deleteReport(id: number): Promise<any[]>;
    updateReport(id: number, store_id: number, month: number, total_revenue: any): Promise<any[]>;
    getInventoryReport(): Promise<{
        inventory: any[];
    }>;
}
