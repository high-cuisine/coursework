export interface User {
  user_id: number;
  username: string;
  email: string;
  role: string;
  created_at: string;
  last_login: string;
}

export interface LoginDto {
  username: string;
  password: string;
}

export interface RegisterDto {
  username: string;
  email: string;
  password: string;
  role: string;
}

export interface Product {
  productid: number;
  productname: string;
  categoryid: number;
  price: number;
  description: string;
  image_url?: string;
  category?: Category;
  store_id?: number;
  current_stock?: number;
}

export interface Category {
  categoryid: number;
  categoryname: string;
  productcount: number;
}

export interface Store {
  storeid: number;
  storename: string;
  location: string;
}

export interface Supply {
  supplyid: number;
  storeid: number;
  productid: number;
  supplydate: string;
  quantity: number;
  productname?: string;
  storename?: string;
}

export interface Sale {
  saleid: number;
  storeid: number;
  productid: number;
  saledate: string;
  quantity: number;
  totalamount: number;
  productname?: string;
  storename?: string;
}

export interface Report {
  report_id: number;
  store_id: number;
  month: string;
  total_revenue: number;
  storename?: string;
}

export interface InventoryReport {
  inventory: Array<{
    productid: number;
    productname: string;
    price: number;
    categoryname: string;
    currentstock: number;
  }>;
}

export interface SalesReport {
  total_sales: number;
  total_revenue: number;
  sales_by_product: Array<{
    productname: string;
    quantity: number;
    revenue: number;
  }>;
  sales_by_store: Array<{
    storename: string;
    quantity: number;
    revenue: number;
  }>;
}

export interface ProfitReport {
  total_profit: number;
  profit_by_product: Array<{
    productname: string;
    profit: number;
  }>;
  profit_by_store: Array<{
    storename: string;
    profit: number;
  }>;
}

export interface CartItem {
  productid: number;
  productname: string;
  price: number;
  quantity: number;
  categoryid: number;
} 