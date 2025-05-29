import api from '../interceptors/auth.interceptor';
import { API_URL } from '../config';

export interface Purchase {
    purchase_id: number;
    user_id: number;
    store_id: number;
    product_id: number;
    quantity: number;
    total_amount: number;
    status_id: number;
    created_at: string;
    updated_at: string;
    user?: any;
    store?: any;
    product?: any;
    status?: any;
}

export interface PurchaseStatus {
    status_id: number;
    status_name: string;
}

class PurchaseService {
    async createPurchase(purchaseData: Partial<Purchase>): Promise<Purchase> {
        const response = await api.post(`${API_URL}/purchases`, purchaseData);
        return response.data;
    }

    async getPurchases(): Promise<Purchase[]> {
        const response = await api.get(`${API_URL}/purchases`);
        return response.data;
    }

    async getPurchaseById(id: number): Promise<Purchase> {
        const response = await api.get(`${API_URL}/purchases/${id}`);
        return response.data;
    }

    async updatePurchaseStatus(id: number, statusId: number): Promise<Purchase> {
        const response = await api.put(`${API_URL}/purchases/${id}/status`, { statusId });
        return response.data;
    }

    async archivePurchase(id: number): Promise<void> {
        await api.put(`${API_URL}/purchases/${id}/archive`);
    }

    async getPurchaseStatuses(): Promise<PurchaseStatus[]> {
        const response = await api.get(`${API_URL}/purchases/statuses`);
        return response.data;
    }
}

export const purchaseService = new PurchaseService(); 