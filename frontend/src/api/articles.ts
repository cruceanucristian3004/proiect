import { apiClient } from './client';

export interface Article {
  id: string;
  title: string;
  content: string;
  image_url?: string;
  user_id: string;
  user_name?: string;
  user_username?: string;
  user_email?: string;
  user_avatar_url?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateArticleData {
  title: string;
  content: string;
}

export const articlesAPI = {
  getAll: async (): Promise<{ articles: Article[] }> => {
    const response = await apiClient.get<{ articles: Article[] }>('/api/articles');
    return response.data;
  },

  getOne: async (id: string): Promise<{ article: Article }> => {
    const response = await apiClient.get<{ article: Article }>(`/api/articles/${id}`);
    return response.data;
  },

  create: async (data: CreateArticleData, image?: File): Promise<{ article: Article }> => {
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('content', data.content);
    if (image) {
      formData.append('image', image);
    }

    const response = await apiClient.post<{ article: Article }>(
      '/api/articles',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  },

  update: async (id: string, data: Partial<CreateArticleData>): Promise<{ article: Article }> => {
    const response = await apiClient.put<{ article: Article }>(
      `/api/articles/${id}`,
      data
    );
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/api/articles/${id}`);
  },
};