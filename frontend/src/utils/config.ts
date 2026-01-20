// Centralized configuration for API URLs
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const getImageUrl = (path: string | null | undefined): string | null => {
  if (!path) return null;
  // If path already includes http, return as is
  if (path.startsWith('http')) return path;
  // Otherwise, prepend API base URL
  return `${API_BASE_URL}${path}`;
};
