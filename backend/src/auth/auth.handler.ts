import { Context } from 'hono';
import { pool } from '../db/connection';
import { hashPassword, comparePassword } from '../utils/hash';
import { generateToken } from '../utils/jwt';
import { registerSchema, loginSchema, updateProfileSchema } from '../modules/schema';
import { saveFile } from '../utils/upload';
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

export const register = async (c: Context) => {
  // #region agent log
  log({location:'backend/src/auth/auth.handler.ts:18',message:'Register function called',data:{},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'E'});
  // #endregion
  try {
    // #region agent log
    log({location:'backend/src/auth/auth.handler.ts:20',message:'About to parse request body',data:{},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'E'});
    // #endregion
    const body = await c.req.json();
    // #region agent log
    log({location:'backend/src/auth/auth.handler.ts:23',message:'Request body parsed',data:{hasEmail:!!body.email,hasPassword:!!body.password,hasName:!!body.name},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'E'});
    // #endregion
    const validated = registerSchema.parse(body);
    // #region agent log
    log({location:'backend/src/auth/auth.handler.ts:25',message:'Body validated successfully',data:{email:validated.email,name:validated.name},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'E'});
    // #endregion

    // Verifică dacă email-ul există deja
    // #region agent log
    log({location:'backend/src/auth/auth.handler.ts:28',message:'About to query database for existing user',data:{email:validated.email},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'});
    // #endregion
    const existingUser = await pool.query(
      'SELECT id FROM users WHERE email = $1',
      [validated.email]
    );
    // #region agent log
    log({location:'backend/src/auth/auth.handler.ts:33',message:'Database query completed',data:{userExists:existingUser.rows.length>0},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'});
    // #endregion

    if (existingUser.rows.length > 0) {
      return c.json({ error: 'Email already exists' }, 409);
    }

    // Hash password
    const hashedPassword = await hashPassword(validated.password);

    // Verifică dacă username-ul există deja
    if (validated.username) {
      const existingUsername = await pool.query(
        'SELECT id FROM users WHERE username = $1',
        [validated.username]
      );

      if (existingUsername.rows.length > 0) {
        return c.json({ error: 'Username already exists' }, 409);
      }
    }

    // Inserează utilizatorul
    const result = await pool.query(
      'INSERT INTO users (email, password, name, username) VALUES ($1, $2, $3, $4) RETURNING id, email, name, username, role, avatar_url',
      [validated.email, hashedPassword, validated.name, validated.username || null]
    );

    const user = result.rows[0];
    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    return c.json({
      message: 'User registered successfully',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        username: user.username,
        role: user.role,
        avatar_url: user.avatar_url,
      },
      token,
    }, 201);
  } catch (error: any) {
    // #region agent log
    log({location:'backend/src/auth/auth.handler.ts:50',message:'Error caught in register',data:{errorName:error?.name,errorMessage:error?.message,errorCode:error?.code,hasStack:!!error?.stack},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'E'});
    // #endregion
    if (error.name === 'ZodError') {
      return c.json({ error: 'Validation error', details: error.errors }, 400);
    }
    throw error;
  }
};

export const login = async (c: Context) => {
  try {
    const body = await c.req.json();
    const validated = loginSchema.parse(body);

    // Găsește utilizatorul
    const result = await pool.query(
      'SELECT id, email, password, name, username, role, avatar_url FROM users WHERE email = $1',
      [validated.email]
    );

    if (result.rows.length === 0) {
      return c.json({ error: 'Invalid email or password' }, 401);
    }

    const user = result.rows[0];

    // Verifică password
    const isValid = await comparePassword(validated.password, user.password);
    if (!isValid) {
      return c.json({ error: 'Invalid email or password' }, 401);
    }

    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    return c.json({
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        username: user.username,
        role: user.role,
        avatar_url: user.avatar_url,
      },
      token,
    });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return c.json({ error: 'Validation error', details: error.errors }, 400);
    }
    throw error;
  }
};

export const getProfile = async (c: Context) => {
  const user = (c as any).user;
  
  const result = await pool.query(
    'SELECT id, email, name, username, role, avatar_url, created_at FROM users WHERE id = $1',
    [user.userId]
  );

  if (result.rows.length === 0) {
    return c.json({ error: 'User not found' }, 404);
  }

  return c.json({ user: result.rows[0] });
};

export const uploadAvatar = async (c: Context) => {
  try {
    const user = (c as any).user;
    const body = await c.req.parseBody();
    const file = body.avatar as File;

    if (!file) {
      return c.json({ error: 'No file provided' }, 400);
    }

    // Verifică tipul fișierului
    if (!file.type.startsWith('image/')) {
      return c.json({ error: 'File must be an image' }, 400);
    }

    // Salvează fișierul
    const filepath = await saveFile(file, user.userId, 'avatar');

    // Actualizează avatar_url în baza de date
    await pool.query(
      'UPDATE users SET avatar_url = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
      [filepath, user.userId]
    );

    // Salvează în tabelul files
    await pool.query(
      'INSERT INTO files (filename, original_name, mime_type, size, path, user_id) VALUES ($1, $2, $3, $4, $5, $6)',
      [filepath.split('/').pop(), file.name, file.type, file.size, filepath, user.userId]
    );

    // Obține utilizatorul actualizat
    const updatedUser = await pool.query(
      'SELECT id, email, name, username, role, avatar_url FROM users WHERE id = $1',
      [user.userId]
    );

    return c.json({
      message: 'Avatar uploaded successfully',
      avatar_url: filepath,
      user: updatedUser.rows[0],
    });
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
};

export const updateProfile = async (c: Context) => {
  try {
    const user = (c as any).user;
    const body = await c.req.json();
    const validated = updateProfileSchema.parse(body);

    // Verifică dacă username-ul există deja (dacă este diferit)
    if (validated.username !== undefined) {
      const existingUsername = await pool.query(
        'SELECT id FROM users WHERE username = $1 AND id != $2',
        [validated.username, user.userId]
      );

      if (existingUsername.rows.length > 0) {
        return c.json({ error: 'Username already exists' }, 409);
      }
    }

    const updates: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    if (validated.name) {
      updates.push(`name = $${paramIndex++}`);
      values.push(validated.name);
    }
    if (validated.username !== undefined) {
      updates.push(`username = $${paramIndex++}`);
      values.push(validated.username || null);
    }

    if (updates.length === 0) {
      return c.json({ error: 'No fields to update' }, 400);
    }

    updates.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(user.userId);

    const result = await pool.query(
      `UPDATE users SET ${updates.join(', ')} WHERE id = $${paramIndex} RETURNING id, email, name, username, role, avatar_url`,
      values
    );

    return c.json({
      message: 'Profile updated successfully',
      user: result.rows[0],
    });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return c.json({ error: 'Validation error', details: error.errors }, 400);
    }
    throw error;
  }
};