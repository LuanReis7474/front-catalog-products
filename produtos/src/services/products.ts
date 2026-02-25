import { api } from './api';


export interface Product {
    id: number;
    title: string;
    price: number;
    description: string;
    category: string;
    image: string;
}

export const ProductService = {
    getAll: async () => {
        const response = await api.get<Product[]>('/products');
        return response.data;
    },


    getById: async (id: number) => {
        const response = await api.get<Product>(`/products/${id}`);
        return response.data;
    }
};