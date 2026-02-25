import { api } from './api';

export interface OrderItem {
    productId: number;
    quantity: number;
}

export interface CreateOrderData {
    nameCustomer: string;
    paymentMethod: string;
    street: string;
    number: string;
    neighborhood: string;
    city: string;
    items: OrderItem[];
}

export interface OrderResponse extends CreateOrderData {
    id: string;
    total: number;
    createdAt?: string;
}

export const OrderService = {
    create: async (data: CreateOrderData) => {
        const response = await api.post<OrderResponse>('/orders', data);
        return response.data;
    },

    getAll: async () => {
        const response = await api.get<OrderResponse[]>('/orders');
        return response.data;
    },

    getById: async (id: string) => {
        const response = await api.get<OrderResponse>(`/orders/${id}`);
        return response.data;
    }
};