export interface User {
    user_id: number;
    username: string;
    email: string;
    password_hash: string;
    role: string;
    created_at: Date;
    last_login: Date | null;
}
export interface Category {
    category_id: number;
    category_name: string;
}
export interface Product {
    product_id: number;
    product_name: string;
    category_id: number;
    price: number;
    category_name?: string;
}
export interface Store {
    store_id: number;
    store_name: string;
    location: string;
}
export interface Supply {
    supply_id: number;
    store_id: number;
    product_id: number;
    supply_date: Date;
    quantity: number;
    store_name?: string;
    product_name?: string;
}
export interface Sale {
    sale_id: number;
    store_id: number;
    product_id: number;
    sale_date: Date;
    quantity: number;
    total_amount: number;
    store_name?: string;
    product_name?: string;
}
export interface Request {
    request_id: number;
    store_id: number;
    product_id: number;
    request_date: Date;
    requested_quantity: number;
    status: 'pending' | 'approved' | 'rejected';
    store_name?: string;
    product_name?: string;
}
export interface Report {
    report_id: number;
    store_id: number;
    month: Date;
    total_revenue: number;
    store_name?: string;
}
