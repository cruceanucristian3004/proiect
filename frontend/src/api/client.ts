import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor pentru a adăuga token-ul la fiecare request
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  // #region agent log
  fetch('http://127.0.0.1:7242/ingest/a8ccfd05-efc0-4883-97e2-f268560c8741',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'frontend/src/api/client.ts:13',message:'API request made',data:{url:config.url,method:config.method,hasToken:!!token},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'})}).catch(()=>{});
  // #endregion
  return config;
});

// Interceptor pentru a gestiona erorile
apiClient.interceptors.response.use(
  (response) => {
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/a8ccfd05-efc0-4883-97e2-f268560c8741',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'frontend/src/api/client.ts:22',message:'API response received',data:{status:response.status,url:response.config.url},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'})}).catch(()=>{});
    // #endregion
    return response;
  },
  (error) => {
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/a8ccfd05-efc0-4883-97e2-f268560c8741',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'frontend/src/api/client.ts:28',message:'API error occurred',data:{status:error.response?.status,message:error.message,url:error.config?.url},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'})}).catch(()=>{});
    // #endregion
    if (error.response?.status === 401) {
      const isAuthPage = window.location.pathname === '/login' || window.location.pathname === '/register';
      
      // Nu redirecționa dacă suntem deja pe pagina de login/register
      // pentru a permite afișarea mesajelor de eroare
      if (!isAuthPage) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);