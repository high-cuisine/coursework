import api from '../interceptors/auth.interceptor';
import { LoginDto, RegisterDto, Product, Category, Store, Supply, Sale, Report } from '../types';

export const apiService = {
  // Auth
  login: async (data: LoginDto) => {
    const response = await api.post('/auth/login', data);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    return response.data;
  },

  register: async (data: RegisterDto) => {
    const response = await api.post('/auth/register', data);
    return response.data;
  },

  // Products
  getProducts: async () => {
    const response = await api.get('/products');
    return response.data;
  },

  createProduct: async (data: Partial<Product>) => {
    const response = await api.post('/products', data);
    return response.data;
  },

  updateProduct: async (id: number, data: Partial<Product>) => {
    const response = await api.put(`/products/${id}`, data);
    return response.data;
  },

  updateProductStock: async (productId: number, storeId: number, quantity: number) => {
    const response = await api.put(`/products/${productId}/stock`, { store_id: storeId, quantity });
    return response.data;
  },

  deleteProduct: async (id: number) => {
    const response = await api.delete(`/products/${id}`);
    return response.data;
  },

  // Categories
  getCategories: async () => {
    const response = await api.get('/categories');
    return response.data;
  },

  createCategory: async (data: Partial<Category>) => {
    const response = await api.post('/categories', data);
    return response.data;
  },

  updateCategory: async (id: number, data: Partial<Category>) => {
    const response = await api.put(`/categories/${id}`, data);
    return response.data;
  },

  deleteCategory: async (id: number) => {
    const response = await api.delete(`/categories/${id}`);
    return response.data;
  },

  // Stores
  getStores: async () => {
    const response = await api.get('/stores');
    return response.data;
  },

  createStore: async (data: Partial<Store>) => {
    const response = await api.post('/stores', data);
    return response.data;
  },

  updateStore: async (id: number, data: Partial<Store>) => {
    const response = await api.put(`/stores/${id}`, data);
    return response.data;
  },

  deleteStore: async (id: number) => {
    const response = await api.delete(`/stores/${id}`);
    return response.data;
  },

  // Supplies
  getSupplies: async () => {
    const response = await api.get('/supplies');
    return response.data;
  },

  createSupply: async (data: Partial<Supply>) => {
    const response = await api.post('/supplies', data);
    return response.data;
  },

  updateSupply: async (id: number, data: Partial<Supply>) => {
    const response = await api.put(`/supplies/${id}`, data);
    return response.data;
  },

  deleteSupply: async (id: number) => {
    const response = await api.delete(`/supplies/${id}`);
    return response.data;
  },

  // Sales
  getSales: async () => {
    const response = await api.get('/sales');
    return response.data;
  },

  createSale: async (data: Partial<Sale>) => {
    const response = await api.post('/sales', data);
    return response.data;
  },

  updateSale: async (id: number, data: Partial<Sale>) => {
    const response = await api.put(`/sales/${id}`, data);
    return response.data;
  },

  deleteSale: async (id: number) => {
    const response = await api.delete(`/sales/${id}`);
    return response.data;
  },

  // Reports
  getReports: async () => {
    const response = await api.get('/reports');
    return response.data;
  },

  createReport: async (data: Partial<Report>) => {
    const response = await api.post('/reports', data);
    return response.data;
  },

  updateReport: async (id: number, data: Partial<Report>) => {
    const response = await api.put(`/reports/${id}`, data);
    return response.data;
  },

  deleteReport: async (id: number) => {
    const response = await api.delete(`/reports/${id}`);
    return response.data;
  },

  // Additional report endpoints
  getSalesReport: async (startDate: string, endDate: string) => {
    const response = await api.get(`/reports/sales?startDate=${startDate}&endDate=${endDate}`);
    return response.data;
  },

  getInventoryReport: async () => {
    const response = await api.get('/reports/inventory');
    return response.data;
  },

  getProfitReport: async (startDate: string, endDate: string) => {
    const response = await api.get(`/reports/profit?startDate=${startDate}&endDate=${endDate}`);
    return response.data;
  },

  // Purchases
  getPurchases: async () => {
    const response = await api.get('/purchases');
    return response.data;
  },

  createPurchase: async (data: { user_id: number; store_id: number; product_id: number; quantity: number; total_amount: number }) => {
    const response = await api.post('/purchases', data);
    return response.data;
  },

  getPurchaseStatuses: async () => {
    const response = await api.get('/purchases/statuses');
    return response.data;
  },

  updatePurchaseStatus: async (id: number, statusId: number) => {
    const response = await api.put(`/purchases/${id}/status`, { statusId });
    return response.data;
  },

  archivePurchase: async (id: number) => {
    const response = await api.put(`/purchases/${id}/archive`);
    return response.data;
  },
}; 