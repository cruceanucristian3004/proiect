import { Context } from 'hono';
import fs from 'fs/promises';
import path from 'path';

const UPLOAD_DIR = process.env.UPLOAD_DIR || './uploads';

// Asigură-te că directorul de upload există
export const ensureUploadDir = async () => {
  try {
    await fs.access(UPLOAD_DIR);
  } catch {
    await fs.mkdir(UPLOAD_DIR, { recursive: true });
  }
};

export const saveFile = async (
  file: File,
  userId: string,
  type: 'avatar' | 'document' | 'product' | 'article'
): Promise<string> => {
  await ensureUploadDir();

  const timestamp = Date.now();
  const extension = path.extname(file.name);
  const filename = `${type}_${userId}_${timestamp}${extension}`;
  const filepath = path.join(UPLOAD_DIR, filename);

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  await fs.writeFile(filepath, buffer);

  return `/uploads/${filename}`;
};

export const deleteFile = async (filepath: string): Promise<void> => {
  try {
    const fullPath = path.join(process.cwd(), filepath);
    await fs.unlink(fullPath);
  } catch (error) {
    console.error('Error deleting file:', error);
  }
};