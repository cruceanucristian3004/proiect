import { apiClient } from './client';

export interface User {
  id: string;
  email: string;
  name: string;
  username?: string;
  role: string;
  avatar_url?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  message?: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
  username?: string;
}

export interface UpdateProfileData {
  name?: string;
  username?: string;
}

export const authAPI = {
  register: async (data: RegisterData): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/api/auth/register', data);
    return response.data;
  },

  login: async (data: LoginData): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/api/auth/login', data);
    return response.data;
  },

  getProfile: async (): Promise<{ user: User }> => {
    const response = await apiClient.get<{ user: User }>('/api/auth/profile');
    return response.data;
  },

  uploadAvatar: async (file: File): Promise<{ avatar_url: string; user: User }> => {
    const formData = new FormData();
    formData.append('avatar', file);
    const response = await apiClient.post<{ avatar_url: string; user: User }>(
      '/api/auth/avatar',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  },

  updateProfile: async (data: UpdateProfileData): Promise<{ user: User }> => {
    const response = await apiClient.put<{ user: User }>('/api/auth/profile', data);
    return response.data;
  },
};