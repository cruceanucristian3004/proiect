import { Hono, Context } from 'hono';
import { serve } from '@hono/node-server';
import { cors } from 'hono/cors';
import { errorHandler } from './middlewares/error-handler';
import fs from 'fs';
import path from 'path';

const LOG_FILE = path.join(process.cwd(), '.cursor', 'debug.log');
const log = (data: any) => {
  try {
    const dir = path.dirname(LOG_FILE);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.appendFileSync(LOG_FILE, JSON.stringify(data) + '\n');
  } catch {}
};
import { authMiddleware, adminMiddleware } from './middlewares/auth';
import {
  register,
  login,
  getProfile,
  uploadAvatar,
  updateProfile,
} from './auth/auth.handler';
import {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
} from './modules/handler';
import {
  getArticles,
  getArticle,
  createArticle,
  updateArticle,
  deleteArticle,
} from './modules/handler';

const app = new Hono();

// #region agent log
log({location:'backend/src/index.ts:34',message:'Backend app initialized',data:{port:Number(process.env.PORT)||3000,nodeEnv:process.env.NODE_ENV},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'});
// #endregion

// Middleware
app.use('*', cors({
  origin: '*',
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
}));

// Serve static files (uploads)
const UPLOAD_DIR = process.env.UPLOAD_DIR || './uploads';
app.get('/uploads/*', async (c: Context) => {
  try {
    const filePath = c.req.path.replace('/uploads/', '');
    const fullPath = path.join(process.cwd(), UPLOAD_DIR, filePath);
    
    // Security: ensure path is within uploads directory
    const normalizedPath = path.normalize(fullPath);
    const uploadsDir = path.join(process.cwd(), UPLOAD_DIR);
    if (!normalizedPath.startsWith(path.normalize(uploadsDir))) {
      return c.json({ error: 'Forbidden' }, 403);
    }

    // Check if file exists
    if (!fs.existsSync(normalizedPath)) {
      return c.json({ error: 'File not found' }, 404);
    }

    // Read file
    const fileBuffer = fs.readFileSync(normalizedPath);
    const ext = path.extname(normalizedPath).toLowerCase();
    
    // Determine content type
    const contentTypes: Record<string, string> = {
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.gif': 'image/gif',
      '.webp': 'image/webp',
      '.svg': 'image/svg+xml',
    };
    
    const contentType = contentTypes[ext] || 'application/octet-stream';
    
    return new Response(fileBuffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000',
      },
    });
  } catch (error: any) {
    console.error('Error serving file:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// Health check
app.get('/', (c: Context) => {
  // #region agent log
  log({location:'backend/src/index.ts:44',message:'Health check endpoint hit',data:{path:c.req.path},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'});
  // #endregion
  return c.json({ message: 'API is running', version: '1.0.0' });
});

app.get('/api/health', (c: Context) => {
  return c.json({ status: 'ok', message: 'API is healthy' });
});

// Auth routes (public)
app.post('/api/auth/register', async (c: Context) => {
  // #region agent log
  log({location:'backend/src/index.ts:56',message:'Register endpoint hit',data:{path:c.req.path,method:c.req.method},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'});
  // #endregion
  return register(c);
});
app.post('/api/auth/login', async (c: Context) => {
  // #region agent log
  log({location:'backend/src/index.ts:62',message:'Login endpoint hit',data:{path:c.req.path,method:c.req.method},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'});
  // #endregion
  return login(c);
});

// Auth routes (protected)
app.get('/api/auth/profile', authMiddleware, getProfile);
app.put('/api/auth/profile', authMiddleware, updateProfile);
app.post('/api/auth/avatar', authMiddleware, uploadAvatar);

// Products routes (autentificare necesară pentru a vedea produsele)
app.get('/api/products', authMiddleware, async (c: Context) => {
  // #region agent log
  log({location:'backend/src/index.ts:68',message:'Get products endpoint hit',data:{path:c.req.path},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'});
  // #endregion
  return getProducts(c);
});
app.get('/api/products/:id', authMiddleware, getProduct);
app.post('/api/products', authMiddleware, createProduct);
app.put('/api/products/:id', authMiddleware, updateProduct);
app.delete('/api/products/:id', authMiddleware, deleteProduct);

// Articles routes (autentificare necesară pentru a vedea articolele)
app.get('/api/articles', authMiddleware, getArticles);
app.get('/api/articles/:id', authMiddleware, getArticle);
app.post('/api/articles', authMiddleware, createArticle);
app.put('/api/articles/:id', authMiddleware, updateArticle);
app.delete('/api/articles/:id', authMiddleware, deleteArticle);

// 404 handler
app.notFound((c: Context) => {
  return c.json(
    {
      error: 'Not Found',
      message: 'The requested resource could not be found',
    },
    404
  );
});

// Error handler
app.onError(errorHandler);

const port = Number(process.env.PORT) || 3000;

serve({
  fetch: app.fetch,
  port,
}, (info: { port: number }) => {
  console.log(`Server is running on http://localhost:${info.port}`);
  // #region agent log
  log({location:'backend/src/index.ts:103',message:'Backend server started successfully',data:{port:info.port,url:`http://localhost:${info.port}`},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'});
  // #endregion
});