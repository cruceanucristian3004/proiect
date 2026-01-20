import { Context } from 'hono';
import { pool } from '../db/connection';
import { createProductSchema, updateProductSchema } from './schema';
import { createArticleSchema, updateArticleSchema } from './schema';
import { createTaskSchema, updateTaskSchema } from './schema';
import { saveFile, deleteFile } from '../utils/upload';

// Products handlers
export const getProducts = async (c: Context) => {
  const result = await pool.query(
    `SELECT p.*, 
     u.name as user_name, 
     u.username as user_username, 
     u.email as user_email,
     u.avatar_url as user_avatar_url
     FROM products p 
     JOIN users u ON p.user_id = u.id 
     ORDER BY p.created_at DESC`
  );
  return c.json({ products: result.rows });
};

export const getProduct = async (c: Context) => {
  const id = c.req.param('id');
  const result = await pool.query(
    `SELECT p.*, 
     u.name as user_name, 
     u.username as user_username, 
     u.email as user_email,
     u.avatar_url as user_avatar_url
     FROM products p 
     JOIN users u ON p.user_id = u.id 
     WHERE p.id = $1`,
    [id]
  );

  if (result.rows.length === 0) {
    return c.json({ error: 'Product not found' }, 404);
  }

  return c.json({ product: result.rows[0] });
};

export const createProduct = async (c: Context) => {
  try {
    const user = (c as any).user;
    
    // Check if request is FormData or JSON
    const contentType = c.req.header('Content-Type') || '';
    let body: any;
    let imageFile: File | null = null;

    if (contentType.includes('multipart/form-data')) {
      // Parse FormData
      const formData = await c.req.parseBody();
      body = {
        name: formData.name as string,
        description: formData.description as string,
        price: parseFloat(formData.price as string),
      };
      imageFile = formData.image as File || null;
    } else {
      // Parse JSON
      body = await c.req.json();
    }

    const validated = createProductSchema.parse(body);

    // Handle file upload
    let imageUrl = null;
    if (imageFile) {
      imageUrl = await saveFile(imageFile, user.userId, 'product');
    }

    const result = await pool.query(
      'INSERT INTO products (name, description, price, image_url, user_id) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [validated.name, validated.description || null, validated.price, imageUrl, user.userId]
    );

    return c.json({ product: result.rows[0] }, 201);
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return c.json({ error: 'Validation error', details: error.errors }, 400);
    }
    throw error;
  }
};

export const updateProduct = async (c: Context) => {
  try {
    const id = c.req.param('id');
    const user = (c as any).user;
    const body = await c.req.json();
    const validated = updateProductSchema.parse(body);

    // Verifică dacă produsul există
    const existing = await pool.query('SELECT * FROM products WHERE id = $1', [id]);
    if (existing.rows.length === 0) {
      return c.json({ error: 'Product not found' }, 404);
    }

    // Verifică permisiuni (doar owner sau admin)
    if (existing.rows[0].user_id !== user.userId && user.role !== 'admin') {
      return c.json({ error: 'Forbidden' }, 403);
    }

    const updates: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    if (validated.name) {
      updates.push(`name = $${paramIndex++}`);
      values.push(validated.name);
    }
    if (validated.description !== undefined) {
      updates.push(`description = $${paramIndex++}`);
      values.push(validated.description);
    }
    if (validated.price) {
      updates.push(`price = $${paramIndex++}`);
      values.push(validated.price);
    }

    if (updates.length === 0) {
      return c.json({ error: 'No fields to update' }, 400);
    }

    updates.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(id);

    const result = await pool.query(
      `UPDATE products SET ${updates.join(', ')} WHERE id = $${paramIndex} RETURNING *`,
      values
    );

    return c.json({ product: result.rows[0] });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return c.json({ error: 'Validation error', details: error.errors }, 400);
    }
    throw error;
  }
};

export const deleteProduct = async (c: Context) => {
  const id = c.req.param('id');
  const user = (c as any).user;

  // Verifică dacă produsul există
  const existing = await pool.query('SELECT * FROM products WHERE id = $1', [id]);
  if (existing.rows.length === 0) {
    return c.json({ error: 'Product not found' }, 404);
  }

  // Verifică permisiuni (doar owner sau admin)
  if (existing.rows[0].user_id !== user.userId && user.role !== 'admin') {
    return c.json({ error: 'Forbidden' }, 403);
  }

  // Șterge imaginea dacă există
  if (existing.rows[0].image_url) {
    await deleteFile(existing.rows[0].image_url);
  }

  await pool.query('DELETE FROM products WHERE id = $1', [id]);
  return c.json({ message: 'Product deleted successfully' });
};

// Articles handlers
export const getArticles = async (c: Context) => {
  const result = await pool.query(
    `SELECT a.*, 
     u.name as user_name, 
     u.username as user_username, 
     u.email as user_email,
     u.avatar_url as user_avatar_url
     FROM articles a 
     JOIN users u ON a.user_id = u.id 
     ORDER BY a.created_at DESC`
  );
  return c.json({ articles: result.rows });
};

export const getArticle = async (c: Context) => {
  const id = c.req.param('id');
  const result = await pool.query(
    `SELECT a.*, 
     u.name as user_name, 
     u.username as user_username, 
     u.email as user_email,
     u.avatar_url as user_avatar_url
     FROM articles a 
     JOIN users u ON a.user_id = u.id 
     WHERE a.id = $1`,
    [id]
  );

  if (result.rows.length === 0) {
    return c.json({ error: 'Article not found' }, 404);
  }

  return c.json({ article: result.rows[0] });
};

export const createArticle = async (c: Context) => {
  try {
    const user = (c as any).user;
    
    // Check if request is FormData or JSON
    const contentType = c.req.header('Content-Type') || '';
    let body: any;
    let imageFile: File | null = null;

    if (contentType.includes('multipart/form-data')) {
      // Parse FormData
      const formData = await c.req.parseBody();
      body = {
        title: formData.title as string,
        content: formData.content as string,
      };
      imageFile = formData.image as File || null;
    } else {
      // Parse JSON
      body = await c.req.json();
    }

    const validated = createArticleSchema.parse(body);

    // Handle file upload
    let imageUrl = null;
    if (imageFile) {
      imageUrl = await saveFile(imageFile, user.userId, 'article');
    }

    const result = await pool.query(
      'INSERT INTO articles (title, content, image_url, user_id) VALUES ($1, $2, $3, $4) RETURNING *',
      [validated.title, validated.content, imageUrl, user.userId]
    );

    return c.json({ article: result.rows[0] }, 201);
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return c.json({ error: 'Validation error', details: error.errors }, 400);
    }
    throw error;
  }
};

export const updateArticle = async (c: Context) => {
  try {
    const id = c.req.param('id');
    const user = (c as any).user;
    const body = await c.req.json();
    const validated = updateArticleSchema.parse(body);

    const existing = await pool.query('SELECT * FROM articles WHERE id = $1', [id]);
    if (existing.rows.length === 0) {
      return c.json({ error: 'Article not found' }, 404);
    }

    if (existing.rows[0].user_id !== user.userId && user.role !== 'admin') {
      return c.json({ error: 'Forbidden' }, 403);
    }

    const updates: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    if (validated.title) {
      updates.push(`title = $${paramIndex++}`);
      values.push(validated.title);
    }
    if (validated.content) {
      updates.push(`content = $${paramIndex++}`);
      values.push(validated.content);
    }

    if (updates.length === 0) {
      return c.json({ error: 'No fields to update' }, 400);
    }

    updates.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(id);

    const result = await pool.query(
      `UPDATE articles SET ${updates.join(', ')} WHERE id = $${paramIndex} RETURNING *`,
      values
    );

    return c.json({ article: result.rows[0] });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return c.json({ error: 'Validation error', details: error.errors }, 400);
    }
    throw error;
  }
};

export const deleteArticle = async (c: Context) => {
  const id = c.req.param('id');
  const user = (c as any).user;

  const existing = await pool.query('SELECT * FROM articles WHERE id = $1', [id]);
  if (existing.rows.length === 0) {
    return c.json({ error: 'Article not found' }, 404);
  }

  if (existing.rows[0].user_id !== user.userId && user.role !== 'admin') {
    return c.json({ error: 'Forbidden' }, 403);
  }

  if (existing.rows[0].image_url) {
    await deleteFile(existing.rows[0].image_url);
  }

  await pool.query('DELETE FROM articles WHERE id = $1', [id]);
  return c.json({ message: 'Article deleted successfully' });
};