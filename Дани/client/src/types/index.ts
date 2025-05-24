export interface User {
  id: number;
  username: string;
  email: string;
  role: string;
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
  description: string;
  price: number;
  categoryid: number;
}

export interface Category {
  categoryid: number;
  categoryname: string;
  productcount: string;
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
  storename: string;
  productname: string;
}

export interface Sale {
  id: number;
  productId: number;
  storeId: number;
  quantity: number;
  saleDate: string;
  product?: Product;
  store?: Store;
}

export interface SalesReport {
  totalSales: number;
  totalRevenue: number;
  salesByProduct: Array<{
    productName: string;
    quantity: number;
    revenue: number;
  }>;
  salesByStore: Array<{
    storeName: string;
    quantity: number;
    revenue: number;
  }>;
}

export interface InventoryReport {
  inventory: Array<{
    productName: string;
    storeName: string;
    quantity: number;
  }>;
}

export interface ProfitReport {
  totalProfit: number;
  profitByProduct: Array<{
    productName: string;
    profit: number;
  }>;
  profitByStore: Array<{
    storeName: string;
    profit: number;
  }>;
} 