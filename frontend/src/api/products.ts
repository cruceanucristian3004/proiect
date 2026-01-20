import { apiClient } from './client';

export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  image_url?: string;
  user_id: string;
  user_name?: string;
  user_username?: string;
  user_email?: string;
  user_avatar_url?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateProductData {
  name: string;
  description?: string;
  price: number;
}

export const productsAPI = {
  getAll: async (): Promise<{ products: Product[] }> => {
    const response = await apiClient.get<{ products: Product[] }>('/api/products');
    return response.data;
  },

  getOne: async (id: string): Promise<{ product: Product }> => {
    const response = await apiClient.get<{ product: Product }>(`/api/products/${id}`);
    return response.data;
  },

  create: async (data: CreateProductData, image?: File): Promise<{ product: Product }> => {
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('description', data.description || '');
    formData.append('price', data.price.toString());
    if (image) {
      formData.append('image', image);
    }

    const response = await apiClient.post<{ product: Product }>(
      '/api/products',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  },

  update: async (id: string, data: Partial<CreateProductData>): Promise<{ product: Product }> => {
    const response = await apiClient.put<{ product: Product }>(
      `/api/products/${id}`,
      data
    );
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/api/products/${id}`);
  },
};