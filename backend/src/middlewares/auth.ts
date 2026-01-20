import { Context, Next } from 'hono';
import { verifyToken, JWTPayload } from '../utils/jwt';

export interface AuthContext extends Context {
  user?: JWTPayload;
}

export const authMiddleware = async (c: AuthContext, next: Next) => {
  try {
    const authHeader = c.req.header('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return c.json({ error: 'Unauthorized - No token provided' }, 401);
    }

    const token = authHeader.substring(7);
    const payload = verifyToken(token);
    
    c.user = payload;
    await next();
  } catch (error) {
    return c.json({ error: 'Unauthorized - Invalid token' }, 401);
  }
};

export const adminMiddleware = async (c: AuthContext, next: Next) => {
  if (!c.user) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  if (c.user.role !== 'admin') {
    return c.json({ error: 'Forbidden - Admin access required' }, 403);
  }

  await next();
};