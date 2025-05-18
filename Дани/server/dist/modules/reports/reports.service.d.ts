export declare class ReportsService {
    getTAllReports(): Promise<any[]>;
    getReportById(id: number): Promise<any[]>;
    createReport(store_id: number, month: number, total_revenue: any): Promise<any[]>;
}
