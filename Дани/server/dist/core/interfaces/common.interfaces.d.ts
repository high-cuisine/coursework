export interface PaginatedResponse<T> {
    items: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}
export interface DateRange {
    startDate: Date;
    endDate: Date;
}
export interface JwtPayload {
    sub: number;
    username: string;
    role: string;
}
export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
}
